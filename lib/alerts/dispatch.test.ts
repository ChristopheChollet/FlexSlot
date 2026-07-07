import { describe, expect, it } from "vitest";

import { shouldSendRecommendationAlert } from "@/lib/alerts/dispatch";
import type { RecommendationAction, RecommendationPlan } from "@/lib/recommendations";

const baseConfig = {
  webhookUrl: "https://example.com/hook",
  thresholdGco2: 200,
  actions: ["defer"] as RecommendationAction[],
};

function planWith(
  overrides: Partial<NonNullable<RecommendationPlan["primary"]>>,
): RecommendationPlan {
  return {
    primary: {
      start_at: "2026-07-07T10:00:00Z",
      end_at: "2026-07-07T16:00:00Z",
      avg_carbon_gco2_kwh: 150,
      avg_renewable_pct: 40,
      score: 50,
      action: "flex",
      label: "Flex",
      description: "",
      suggestedKind: "offer",
      hourly: [],
      ...overrides,
    },
    outlook: [],
  };
}

describe("shouldSendRecommendationAlert", () => {
  it("fires on defer action", () => {
    const plan = planWith({ action: "defer", label: "Décaler", score: 30 });
    expect(shouldSendRecommendationAlert(plan, baseConfig)).toBe(true);
  });

  it("fires on high carbon even if action is flex", () => {
    const plan = planWith({ avg_carbon_gco2_kwh: 220, action: "flex" });
    expect(shouldSendRecommendationAlert(plan, baseConfig)).toBe(true);
  });

  it("skips moderate flex below threshold", () => {
    const plan = planWith({ avg_carbon_gco2_kwh: 120, action: "flex" });
    expect(shouldSendRecommendationAlert(plan, baseConfig)).toBe(false);
  });
});
