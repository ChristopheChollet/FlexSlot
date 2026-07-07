import type { GreenWindow, HourlySlot } from "@/lib/gridpulse";

export type RecommendationAction = "consume" | "flex" | "defer";
export type SuggestedSlotKind = "need" | "offer" | null;

export type ActionMeta = {
  action: RecommendationAction;
  label: string;
  description: string;
  suggestedKind: SuggestedSlotKind;
};

export type SlotRecommendation = HourlySlot & ActionMeta;

export type WindowRecommendation = GreenWindow &
  ActionMeta & {
    hourly: SlotRecommendation[];
  };

export type RecommendationPlan = {
  primary: WindowRecommendation | null;
  outlook: SlotRecommendation[];
};

const ACTION_META: Record<RecommendationAction, Omit<ActionMeta, "action">> = {
  consume: {
    label: "Consommer",
    description:
      "Fenêtre favorable — prioriser la consommation ou un besoin de flex sur ce créneau.",
    suggestedKind: "need",
  },
  flex: {
    label: "Flex",
    description:
      "Contexte modéré — proposer un créneau flexible plutôt que consommer immédiatement.",
    suggestedKind: "offer",
  },
  defer: {
    label: "Décaler",
    description:
      "Réseau peu favorable — reporter la consommation ou la flexibilité si possible.",
    suggestedKind: null,
  },
};

export function scoreToAction(score: number): RecommendationAction {
  if (score >= 70) return "consume";
  if (score >= 45) return "flex";
  return "defer";
}

export function actionFromScore(score: number): ActionMeta {
  const action = scoreToAction(score);
  return { action, ...ACTION_META[action] };
}

export function recommendSlot(slot: HourlySlot): SlotRecommendation {
  return { ...slot, ...actionFromScore(slot.score) };
}

function hourInWindow(hour: string, start: string, end: string): boolean {
  const t = new Date(hour).getTime();
  return t >= new Date(start).getTime() && t <= new Date(end).getTime();
}

export function buildWindowRecommendation(
  window: GreenWindow,
  slots: HourlySlot[],
): WindowRecommendation {
  const meta = actionFromScore(window.score);
  const hourly = slots
    .filter((s) => hourInWindow(s.hour, window.start_at, window.end_at))
    .sort((a, b) => a.hour.localeCompare(b.hour))
    .map(recommendSlot);

  return {
    ...window,
    ...meta,
    hourly,
  };
}

export function buildOutlook(slots: HourlySlot[], limit = 12): SlotRecommendation[] {
  return [...slots]
    .sort((a, b) => b.hour.localeCompare(a.hour))
    .slice(0, limit)
    .sort((a, b) => a.hour.localeCompare(b.hour))
    .map(recommendSlot);
}

export function buildRecommendationPlan(
  bestWindow: GreenWindow | null,
  slots: HourlySlot[],
): RecommendationPlan {
  return {
    primary: bestWindow ? buildWindowRecommendation(bestWindow, slots) : null,
    outlook: buildOutlook(slots, 12),
  };
}

export function actionBadgeClass(action: RecommendationAction): string {
  switch (action) {
    case "consume":
      return "action-badge action-badge-consume";
    case "flex":
      return "action-badge action-badge-flex";
    case "defer":
      return "action-badge action-badge-defer";
  }
}
