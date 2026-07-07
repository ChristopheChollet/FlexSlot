import type {
  RecommendationAction,
  WindowRecommendation,
} from "@/lib/recommendations";
import { getGreenOpsApiUrl } from "@/lib/site";

export type CreateFlexSlotPayload = {
  org_id: string;
  kind: "offer" | "need";
  start_at: string;
  end_at: string;
  power_kw?: number | null;
  notes?: string | null;
  recommendation: {
    source: "flexslot";
    action: RecommendationAction;
    gridpulse_score: number;
    window_start: string;
    window_end: string;
    avg_carbon_gco2_kwh: number;
  };
};

export type CreateFlexSlotResult = {
  id: string;
  greenops_url: string;
  source: string;
  recommendation_action: string;
};

export type GreenOpsCreateResult =
  | { ok: true; data: CreateFlexSlotResult }
  | { ok: false; message: string };

function getServiceKey(): string {
  return process.env.GREENOPS_SERVICE_KEY?.trim() || "";
}

export function buildPayloadFromRecommendation(
  orgId: string,
  recommendation: WindowRecommendation,
): CreateFlexSlotPayload | null {
  if (!recommendation.suggestedKind) {
    return null;
  }

  return {
    org_id: orgId,
    kind: recommendation.suggestedKind,
    start_at: recommendation.start_at,
    end_at: recommendation.end_at,
    notes: `Créé via FlexSlot — ${recommendation.label} (score ${recommendation.score})`,
    recommendation: {
      source: "flexslot",
      action: recommendation.action,
      gridpulse_score: recommendation.score,
      window_start: recommendation.start_at,
      window_end: recommendation.end_at,
      avg_carbon_gco2_kwh: recommendation.avg_carbon_gco2_kwh,
    },
  };
}

export async function createFlexSlotInGreenOps(
  payload: CreateFlexSlotPayload,
): Promise<GreenOpsCreateResult> {
  const base = getGreenOpsApiUrl().replace(/\/$/, "");
  const key = getServiceKey();

  if (!key) {
    return {
      ok: false,
      message: "GREENOPS_SERVICE_KEY manquant dans .env.local",
    };
  }

  try {
    const res = await fetch(`${base}/api/integrations/flex-slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-GreenOps-Service-Key": key,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = (await res.json()) as {
      id?: string;
      greenops_url?: string;
      source?: string;
      recommendation_action?: string;
      error?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        message: body.error || `GreenOps a répondu ${res.status}`,
      };
    }

    if (!body.id || !body.greenops_url) {
      return { ok: false, message: "Réponse GreenOps incomplète." };
    }

    if (body.source !== "flexslot") {
      return {
        ok: false,
        message:
          "GreenOps a créé un slot sans source flexslot — vérifiez que l’API d’intégration locale tourne sur le port 3000.",
      };
    }

    return {
      ok: true,
      data: {
        id: body.id,
        greenops_url: body.greenops_url,
        source: body.source,
        recommendation_action: body.recommendation_action ?? "",
      },
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Erreur réseau";
    return {
      ok: false,
      message: `Impossible de joindre GreenOps (${detail}).`,
    };
  }
}
