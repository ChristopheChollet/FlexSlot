import { getGridPulseApiUrl } from "@/lib/site";

export type GreenWindow = {
  start_at: string;
  end_at: string;
  avg_carbon_gco2_kwh: number;
  avg_renewable_pct: number;
  score: number;
};

export type HourlySlot = {
  hour: string;
  carbon_gco2_kwh: number;
  renewable_pct: number;
  score: number;
};

export type GreenWindowsResponse = {
  window_hours: number;
  best_window: GreenWindow | null;
  slots: HourlySlot[];
  hint: string;
};

export type GridPulseFetchResult =
  | { ok: true; data: GreenWindowsResponse; apiUrl: string }
  | { ok: false; message: string; apiUrl: string };

export async function fetchGreenWindows(
  hours = 24,
  windowHours = 6,
): Promise<GreenWindowsResponse> {
  const result = await fetchGreenWindowsSafe(hours, windowHours);
  if (!result.ok) {
    throw new Error(result.message);
  }
  return result.data;
}

export async function fetchGreenWindowsSafe(
  hours = 24,
  windowHours = 6,
): Promise<GridPulseFetchResult> {
  const base = getGridPulseApiUrl().replace(/\/$/, "");
  const path = `/api/v1/green-windows?hours=${hours}&window=${windowHours}`;
  const url = `${base}${path}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      return {
        ok: false,
        apiUrl: base,
        message: `GridPulse a répondu ${res.status} sur ${path}`,
      };
    }
    const data = (await res.json()) as GreenWindowsResponse;
    return { ok: true, data, apiUrl: base };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Erreur réseau";
    return {
      ok: false,
      apiUrl: base,
      message: `Impossible de joindre GridPulse (${detail}). Vérifie GRIDPULSE_API_URL ou lance l'API locale (uvicorn :8000).`,
    };
  }
}

export function formatParisTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}
