"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import type { WindowRecommendation } from "@/lib/recommendations";
import {
  createFlexSlotAction,
  type CreateSlotActionResult,
} from "@/lib/greenops/actions";

export function CreateFlexSlotButton({
  recommendation,
}: {
  recommendation: WindowRecommendation;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CreateSlotActionResult | null>(null);
  const searchParams = useSearchParams();
  const tourActive = searchParams.get("tour") === "1";

  const canCreate = recommendation.suggestedKind !== null;

  function handleClick() {
    setResult(null);
    startTransition(async () => {
      const response = await createFlexSlotAction({
        start_at: recommendation.start_at,
        end_at: recommendation.end_at,
        score: recommendation.score,
        avg_carbon_gco2_kwh: recommendation.avg_carbon_gco2_kwh,
        avg_renewable_pct: recommendation.avg_renewable_pct,
        action: recommendation.action,
        label: recommendation.label,
        suggestedKind: recommendation.suggestedKind,
      });
      setResult(response);
    });
  }

  return (
    <div
      className="mt-6 border-t border-[var(--surface-border)] pt-6"
      data-tour="create-slot"
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          disabled={!canCreate || isPending}
          className="btn-primary px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Création…" : "Créer le slot dans GreenOps"}
        </button>
        {!canCreate && (
          <p className="text-sm text-[var(--text-muted)]">
            Action « décaler » — pas de slot automatique.
          </p>
        )}
      </div>

      {result?.ok && (
        <div className="mt-4 space-y-1 text-sm text-[var(--text-secondary)]">
          <p>
            Slot créé — badge{" "}
            <strong>FlexSlot · {recommendation.label}</strong> dans GreenOps.
          </p>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            id {result.slotId} · source {result.source} · action{" "}
            {result.recommendationAction}
          </p>
          <a
            href={
              tourActive
                ? `${result.greenopsUrl}${result.greenopsUrl.includes("?") ? "&" : "?"}tour=1&step=go-flex`
                : result.greenopsUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-medium text-[var(--accent)] underline"
          >
            Voir ce slot dans GreenOps →
          </a>
        </div>
      )}

      {result && !result.ok && (
        <p className="mt-4 text-sm text-red-700 dark:text-red-300" role="alert">
          {result.message}
        </p>
      )}
    </div>
  );
}
