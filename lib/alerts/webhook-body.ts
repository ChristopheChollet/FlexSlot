/**
 * Formate le corps HTTP pour Slack, Discord ou webhook générique.
 */
export function buildWebhookBody(
  webhookUrl: string,
  text: string,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  try {
    const host = new URL(webhookUrl).hostname;
    if (host.includes("hooks.slack.com") || host.includes("slack.com")) {
      return { text };
    }
    if (host.includes("discord.com")) {
      return { content: text };
    }
  } catch {
    /* URL relative ou invalide — payload brut */
  }
  return raw;
}

export function formatFlexSlotAlertText(payload: {
  label: string;
  action: string;
  score: number;
  avg_carbon_gco2_kwh: number;
  avg_renewable_pct: number;
  window_start: string;
  window_end: string;
  threshold_gco2_kwh: number;
}): string {
  const start = new Date(payload.window_start).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "short",
    timeStyle: "short",
  });
  const end = new Date(payload.window_end).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    timeStyle: "short",
  });

  return [
    `*FlexSlot* — ${payload.label} (\`${payload.action}\`)`,
    `Score ${payload.score} · Carbone moy. ${payload.avg_carbon_gco2_kwh} gCO₂/kWh (seuil ${payload.threshold_gco2_kwh})`,
    `Renouvelable moy. ${payload.avg_renewable_pct} %`,
    `Fenêtre : ${start} → ${end}`,
  ].join("\n");
}
