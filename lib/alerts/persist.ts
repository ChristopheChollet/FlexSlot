import { createAdminClient } from "@/lib/supabase/admin";
import { formatFlexSlotAlertText } from "@/lib/alerts/webhook-body";
import { getGreenOpsDemoOrgId } from "@/lib/site";
import type { RecommendationPlan } from "@/lib/recommendations";

type PersistInput = {
  plan: RecommendationPlan;
  snapshotId: string;
  thresholdGco2: number;
};

export async function persistMeridianAlert({
  plan,
  snapshotId,
  thresholdGco2,
}: PersistInput): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  const primary = plan.primary;
  if (!primary) return;

  const message = formatFlexSlotAlertText({
    label: primary.label,
    action: primary.action,
    score: primary.score,
    avg_carbon_gco2_kwh: primary.avg_carbon_gco2_kwh,
    avg_renewable_pct: primary.avg_renewable_pct,
    window_start: primary.start_at,
    window_end: primary.end_at,
    threshold_gco2_kwh: thresholdGco2,
  });

  const title =
    primary.action === "defer"
      ? `Recommandation ${primary.label} — score ${primary.score}`
      : `Carbone élevé — ${primary.avg_carbon_gco2_kwh} gCO₂/kWh`;

  const payload = {
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
    threshold_gco2_kwh: thresholdGco2,
  };

  const orgId = getGreenOpsDemoOrgId();

  const { error } = await supabase.from("meridian_alerts").insert({
    source: "flexslot",
    event_type: "flexslot_recommendation_alert",
    title,
    message,
    payload,
    carbon_gco2_kwh: primary.avg_carbon_gco2_kwh,
    threshold_gco2_kwh: thresholdGco2,
    recommendation_action: primary.action,
    window_start: primary.start_at,
    window_end: primary.end_at,
    snapshot_id: snapshotId,
    org_id: orgId,
  });

  if (error) {
    console.error("[flexslot] persist meridian alert failed:", error.message);
  }
}
