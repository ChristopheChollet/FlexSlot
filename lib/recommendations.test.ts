import { describe, expect, it } from "vitest";
import {
  actionFromScore,
  buildRecommendationPlan,
  scoreToAction,
} from "@/lib/recommendations";

describe("scoreToAction", () => {
  it("maps high scores to consume", () => {
    expect(scoreToAction(70)).toBe("consume");
    expect(scoreToAction(90)).toBe("consume");
  });

  it("maps mid scores to flex", () => {
    expect(scoreToAction(45)).toBe("flex");
    expect(scoreToAction(69)).toBe("flex");
  });

  it("maps low scores to defer", () => {
    expect(scoreToAction(44)).toBe("defer");
    expect(scoreToAction(10)).toBe("defer");
  });
});

describe("buildRecommendationPlan", () => {
  it("builds primary window recommendation with hourly breakdown", () => {
    const plan = buildRecommendationPlan(
      {
        start_at: "2026-07-07T08:00:00+00:00",
        end_at: "2026-07-07T13:00:00+00:00",
        avg_carbon_gco2_kwh: 40,
        avg_renewable_pct: 55,
        score: 72,
      },
      [
        {
          hour: "2026-07-07T08:00:00+00:00",
          carbon_gco2_kwh: 38,
          renewable_pct: 60,
          score: 75,
        },
        {
          hour: "2026-07-07T09:00:00+00:00",
          carbon_gco2_kwh: 42,
          renewable_pct: 50,
          score: 68,
        },
      ],
    );

    expect(plan.primary?.action).toBe("consume");
    expect(plan.primary?.suggestedKind).toBe("need");
    expect(plan.primary?.hourly).toHaveLength(2);
    expect(plan.primary?.hourly[1].action).toBe("flex");
    expect(actionFromScore(44).label).toBe("Décaler");
  });
});
