import { getAlertConfig } from "@/lib/alerts/config";
import {
  buildWebhookBody,
  formatFlexSlotAlertText,
} from "@/lib/alerts/webhook-body";
import type { RecommendationPlan } from "@/lib/recommendations";

export function shouldSendRecommendationAlert(
  plan: RecommendationPlan,
  config: NonNullable<ReturnType<typeof getAlertConfig>>,
): boolean {
  const primary = plan.primary;
  if (!primary) return false;

  const carbonHigh =
    (primary.avg_carbon_gco2_kwh ?? 0) >= config.thresholdGco2;
  const actionMatch = config.actions.includes(primary.action);

  return actionMatch || carbonHigh;
}

export async function maybeSendRecommendationAlert(
  plan: RecommendationPlan,
  snapshotId: string | null,
): Promise<void> {
  if (!snapshotId) return;

  const config = getAlertConfig();
  if (!config || !shouldSendRecommendationAlert(plan, config)) return;

  const primary = plan.primary;
  if (!primary) return;

  try {
    const raw = {
      event: "flexslot_recommendation_alert",
      source: "flexslot",
      action: primary.action,
      label: primary.label,
      score: primary.score,
      avg_carbon_gco2_kwh: primary.avg_carbon_gco2_kwh,
      avg_renewable_pct: primary.avg_renewable_pct,
      window_start: primary.start_at,
      window_end: primary.end_at,
      snapshot_id: snapshotId,
      threshold_gco2_kwh: config.thresholdGco2,
    };

    const text = formatFlexSlotAlertText({
      label: primary.label,
      action: primary.action,
      score: primary.score,
      avg_carbon_gco2_kwh: primary.avg_carbon_gco2_kwh,
      avg_renewable_pct: primary.avg_renewable_pct,
      window_start: primary.start_at,
      window_end: primary.end_at,
      threshold_gco2_kwh: config.thresholdGco2,
    });

    const res = await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWebhookBody(config.webhookUrl, text, raw)),
    });

    if (!res.ok) {
      console.error(
        "[flexslot] alert webhook failed:",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("[flexslot] alert webhook error:", err);
  }
}
