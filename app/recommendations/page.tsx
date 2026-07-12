import { GridPulseError } from "@/components/GridPulseError";
import { PageHeader } from "@/components/PageHeader";
import { RecommendationsIcon } from "@/components/ModuleIcons";
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
      <PageHeader
        eyebrow="Orchestration"
        title="Recommandations"
        description="GridPulse alimente FlexSlot : fenêtre optimale, action ops et création du slot flex dans GreenOps en un clic."
        icon={<RecommendationsIcon />}
        actions={
          result.ok ? (
            <a
              href="/api/report"
              className="btn-secondary shrink-0 px-4 py-2 text-sm"
              download
            >
              Télécharger le PDF du jour
            </a>
          ) : undefined
        }
      />

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
      <div data-tour="reco-hero">
        {plan.primary ? (
          <RecommendationHero recommendation={plan.primary} />
        ) : (
          <GreenWindowPanel data={data} apiUrl={apiUrl} />
        )}
      </div>

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
