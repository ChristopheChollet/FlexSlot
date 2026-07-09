import type { RecommendationAction } from "@/lib/recommendations";

export type AlertConfig = {
  webhookUrl: string;
  thresholdGco2: number;
  actions: RecommendationAction[];
};

export type AlertRules = {
  thresholdGco2: number;
  actions: RecommendationAction[];
};

const VALID_ACTIONS = new Set<RecommendationAction>(["consume", "flex", "defer"]);

function parseActions(): RecommendationAction[] {
  const actions = (process.env.FLEXSLOT_ALERT_ACTIONS ?? "defer")
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is RecommendationAction =>
      VALID_ACTIONS.has(value as RecommendationAction),
    );
  return actions.length > 0 ? actions : ["defer"];
}

export function getAlertRules(): AlertRules {
  const thresholdGco2 = Number(
    process.env.FLEXSLOT_CARBON_ALERT_THRESHOLD_GCO2 ?? "200",
  );
  return {
    thresholdGco2: Number.isFinite(thresholdGco2) ? thresholdGco2 : 200,
    actions: parseActions(),
  };
}

export function getAlertConfig(): AlertConfig | null {
  const webhookUrl = process.env.FLEXSLOT_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return null;

  const rules = getAlertRules();
  return { webhookUrl, ...rules };
}
