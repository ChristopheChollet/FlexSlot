import type { RecommendationPlan } from "@/lib/recommendations";
import { maybeSendRecommendationAlert } from "@/lib/alerts/dispatch";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGreenOpsDemoUrl } from "@/lib/site";
import type { SnapshotTrigger } from "@/lib/history/types";

const DEDUP_MINUTES = 15;

function planToRowFields(
  plan: RecommendationPlan,
  windowHours: number,
  trigger: SnapshotTrigger,
) {
  const primary = plan.primary;

  return {
    trigger_type: trigger,
    primary_action: primary?.action ?? null,
    primary_label: primary?.label ?? null,
    primary_score: primary?.score ?? null,
    window_start: primary?.start_at ?? null,
    window_end: primary?.end_at ?? null,
    avg_carbon_gco2_kwh: primary?.avg_carbon_gco2_kwh ?? null,
    avg_renewable_pct: primary?.avg_renewable_pct ?? null,
    plan: { ...plan, window_hours: windowHours },
  };
}

export async function recordRecommendationSnapshot(
  plan: RecommendationPlan,
  windowHours: number,
  trigger: SnapshotTrigger = "view",
): Promise<string | null> {
  if (!plan.primary) return null;

  const supabase = createAdminClient();
  if (!supabase) return null;

  const since = new Date(Date.now() - DEDUP_MINUTES * 60 * 1000).toISOString();
  const windowStart = plan.primary.start_at;

  const { data: existing } = await supabase
    .from("flexslot_recommendation_snapshots")
    .select("id")
    .eq("window_start", windowStart)
    .eq("primary_action", plan.primary.action)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id && trigger === "view") {
    return existing.id;
  }

  const { data, error } = await supabase
    .from("flexslot_recommendation_snapshots")
    .insert(planToRowFields(plan, windowHours, trigger))
    .select("id")
    .single();

  if (error) {
    console.error("[flexslot] record snapshot failed:", error.message);
    return null;
  }

  void maybeSendRecommendationAlert(plan, data.id);
  return data.id;
}

export async function attachGreenOpsSlotToSnapshot(
  windowStart: string,
  slotId: string,
): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: latest } = await supabase
    .from("flexslot_recommendation_snapshots")
    .select("id")
    .eq("window_start", windowStart)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest?.id) return;

  await supabase
    .from("flexslot_recommendation_snapshots")
    .update({
      greenops_slot_id: slotId,
      trigger_type: "slot_created",
    })
    .eq("id", latest.id);
}

export function greenOpsSlotUrl(slotId: string): string {
  const base = getGreenOpsDemoUrl().replace(/\/$/, "");
  return `${base}/flex#slot-${slotId}`;
}
