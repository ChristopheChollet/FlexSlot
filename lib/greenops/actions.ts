"use server";

import type { RecommendationAction, SuggestedSlotKind } from "@/lib/recommendations";
import {
  attachGreenOpsSlotToSnapshot,
} from "@/lib/history/record";
import {
  buildPayloadFromRecommendation,
  createFlexSlotInGreenOps,
} from "@/lib/greenops";
import { getGreenOpsDemoOrgId } from "@/lib/site";

export type CreateSlotInput = {
  start_at: string;
  end_at: string;
  score: number;
  avg_carbon_gco2_kwh: number;
  avg_renewable_pct: number;
  action: RecommendationAction;
  label: string;
  suggestedKind: SuggestedSlotKind;
};

export type CreateSlotActionResult =
  | {
      ok: true;
      slotId: string;
      greenopsUrl: string;
      source: string;
      recommendationAction: string;
    }
  | { ok: false; message: string };

export async function createFlexSlotAction(
  input: CreateSlotInput,
): Promise<CreateSlotActionResult> {
  const orgId = getGreenOpsDemoOrgId();
  if (!orgId) {
    return {
      ok: false,
      message: "GREENOPS_DEMO_ORG_ID manquant dans .env.local",
    };
  }

  if (!input.suggestedKind) {
    return {
      ok: false,
      message: "Aucun slot à créer pour une action « décaler ».",
    };
  }

  const payload = buildPayloadFromRecommendation(orgId, {
    start_at: input.start_at,
    end_at: input.end_at,
    avg_carbon_gco2_kwh: input.avg_carbon_gco2_kwh,
    avg_renewable_pct: input.avg_renewable_pct,
    score: input.score,
    action: input.action,
    label: input.label,
    description: "",
    suggestedKind: input.suggestedKind,
    hourly: [],
  });

  if (!payload) {
    return { ok: false, message: "Impossible de construire le payload GreenOps." };
  }

  const result = await createFlexSlotInGreenOps(payload);
  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  await attachGreenOpsSlotToSnapshot(input.start_at, result.data.id);

  return {
    ok: true,
    slotId: result.data.id,
    greenopsUrl: result.data.greenops_url,
    source: result.data.source,
    recommendationAction: result.data.recommendation_action,
  };
}
