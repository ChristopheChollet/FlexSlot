#!/usr/bin/env node
/**
 * Stub HTTP pour les tests E2E « approfondis » de FlexSlot.
 *
 * Simule les deux services externes que FlexSlot appelle CÔTÉ SERVEUR
 * (donc non interceptables par le navigateur) :
 *   - GridPulse : GET /api/v1/green-windows  → une fenêtre verte déterministe
 *   - GreenOps  : POST /api/integrations/flex-slots → création de slot
 *
 * FlexSlot est pointé ici via GRIDPULSE_API_URL / GREENOPS_API_URL (voir playwright.config.ts).
 * Aucune base de données, aucune dépendance : Node pur.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.PORT) || 4599;

/** Fenêtre verte avec score ≥ 70 → action « consume », slot « need » créable. */
function greenWindows() {
  const base = new Date("2026-07-12T02:00:00.000Z");
  const hourIso = (h) => new Date(base.getTime() + h * 3600_000).toISOString();

  const slots = [0, 1, 2, 3, 4, 5].map((h) => ({
    hour: hourIso(h),
    carbon_gco2_kwh: 40 + h,
    renewable_pct: 70 - h,
    score: 85 - h,
  }));

  return {
    window_hours: 6,
    best_window: {
      start_at: hourIso(0),
      end_at: hourIso(6),
      avg_carbon_gco2_kwh: 42,
      avg_renewable_pct: 68,
      score: 82,
    },
    slots,
    hint: "Fenêtre de test déterministe (stub E2E).",
  };
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/v1/green-windows") {
    return sendJson(res, 200, greenWindows());
  }

  if (req.method === "POST" && url.pathname === "/api/integrations/flex-slots") {
    // FlexSlot doit envoyer la clé service ; on la vérifie comme le ferait GreenOps.
    if (!req.headers["x-greenops-service-key"]) {
      return sendJson(res, 401, { error: "clé service manquante" });
    }

    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      let payload = {};
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        return sendJson(res, 400, { error: "JSON invalide" });
      }

      const action = payload?.recommendation?.action ?? "consume";
      const slotId = "slot_e2e_0001";

      return sendJson(res, 201, {
        id: slotId,
        greenops_url: `https://green-ops-five.vercel.app/flex#slot-${slotId}`,
        source: "flexslot",
        recommendation_action: action,
      });
    });
    return;
  }

  sendJson(res, 404, { error: `route inconnue: ${req.method} ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`[stub] GridPulse + GreenOps mock sur http://localhost:${PORT}`);
});
