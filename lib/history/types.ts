import type { RecommendationPlan } from "@/lib/recommendations";

export type SnapshotTrigger = "view" | "slot_created";

export type RecommendationSnapshotRow = {
  id: string;
  created_at: string;
  trigger_type: SnapshotTrigger;
  primary_action: string | null;
  primary_label: string | null;
  primary_score: number | null;
  window_start: string | null;
  window_end: string | null;
  avg_carbon_gco2_kwh: number | null;
  avg_renewable_pct: number | null;
  plan: RecommendationPlan & { window_hours?: number };
  greenops_slot_id: string | null;
};

export type HistoryListItem = {
  id: string;
  createdAt: string;
  triggerType: SnapshotTrigger;
  primaryLabel: string;
  primaryAction: string | null;
  primaryScore: number | null;
  windowStart: string | null;
  windowEnd: string | null;
  avgCarbon: number | null;
  greenopsSlotId: string | null;
  greenopsUrl: string | null;
};
