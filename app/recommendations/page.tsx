import Link from "next/link";
import { GridPulseError } from "@/components/GridPulseError";
import {
  HourlyRecommendationsTable,
  RecommendationHero,
  RecommendationLegend,
} from "@/components/RecommendationPanel";
import { GreenWindowPanel } from "@/components/GreenWindowPanel";
import { buildRecommendationPlan } from "@/lib/recommendations";
import { recordRecommendationSnapshot } from "@/lib/history/record";
import { fetchGreenWindowsSafe } from "@/lib/gridpulse";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const result = await fetchGreenWindowsSafe(24, 6);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ← Accueil
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Recommandations</h1>
            <p className="mt-2 max-w-prose text-sm text-[var(--text-secondary)]">
              GridPulse alimente FlexSlot : fenêtre optimale, action ops et création
              du slot flex dans GreenOps en un clic.
            </p>
          </div>
          {result.ok && (
            <a
              href="/api/report"
              className="btn-secondary shrink-0 px-4 py-2 text-sm"
              download
            >
              Télécharger le PDF du jour
            </a>
          )}
        </div>
      </div>

      {result.ok ? (
        <RecommendationsContent data={result.data} apiUrl={result.apiUrl} />
      ) : (
        <GridPulseError message={result.message} apiUrl={result.apiUrl} />
      )}
    </div>
  );
}

function RecommendationsContent({
  data,
  apiUrl,
}: {
  data: import("@/lib/gridpulse").GreenWindowsResponse;
  apiUrl: string;
}) {
  const plan = buildRecommendationPlan(data.best_window, data.slots);

  void recordRecommendationSnapshot(plan, data.window_hours, "view");

  return (
    <>
      {plan.primary ? (
        <RecommendationHero recommendation={plan.primary} />
      ) : (
        <GreenWindowPanel data={data} apiUrl={apiUrl} />
      )}

      {plan.primary && plan.primary.hourly.length > 0 && (
        <HourlyRecommendationsTable
          title={`Détail fenêtre ${data.window_hours} h`}
          subtitle="Action horaire à l'intérieur de la meilleure fenêtre GridPulse."
          rows={plan.primary.hourly}
        />
      )}

      <HourlyRecommendationsTable
        title="Outlook 12 h"
        subtitle="12 dernières heures analysées — vue ops sur la période récente."
        rows={plan.outlook}
      />

      <RecommendationLegend />
    </>
  );
}
