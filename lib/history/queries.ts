import { createAdminClient } from "@/lib/supabase/admin";
import { greenOpsSlotUrl } from "@/lib/history/record";
import type { HistoryListItem, RecommendationSnapshotRow } from "@/lib/history/types";

export async function listRecommendationHistory(
  limit = 30,
): Promise<{ items: HistoryListItem[]; configured: boolean }> {
  const supabase = createAdminClient();
  if (!supabase) {
    return { items: [], configured: false };
  }

  const { data, error } = await supabase
    .from("flexslot_recommendation_snapshots")
    .select(
      "id, created_at, trigger_type, primary_action, primary_label, primary_score, window_start, window_end, avg_carbon_gco2_kwh, greenops_slot_id",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[flexslot] list history failed:", error.message);
    return { items: [], configured: true };
  }

  const items = (data ?? []).map((row) => ({
    id: row.id as string,
    createdAt: row.created_at as string,
    triggerType: row.trigger_type as HistoryListItem["triggerType"],
    primaryLabel: (row.primary_label as string) ?? "—",
    primaryAction: row.primary_action as string | null,
    primaryScore: row.primary_score as number | null,
    windowStart: row.window_start as string | null,
    windowEnd: row.window_end as string | null,
    avgCarbon: row.avg_carbon_gco2_kwh as number | null,
    greenopsSlotId: row.greenops_slot_id as string | null,
    greenopsUrl: row.greenops_slot_id
      ? greenOpsSlotUrl(row.greenops_slot_id as string)
      : null,
  }));

  return { items, configured: true };
}

export async function getRecommendationSnapshot(
  id: string,
): Promise<RecommendationSnapshotRow | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("flexslot_recommendation_snapshots")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as RecommendationSnapshotRow;
}
