import {
  buildRecommendationPlan,
} from "@/lib/recommendations";
import { valuesToBarHeightPcts } from "@/lib/chartBarHeights";
import { fetchGreenWindowsSafe, formatParisTime } from "@/lib/gridpulse";

const DEMO_STATS = {
  score: "68",
  action: "Flex",
  carbon: "18 g",
  foot: "Aperçu démo · ouvrez Recommandations pour le détail",
  chartFoot: "Scores horaires (fenêtre 6 h) · démo",
  barValues: [66, 67, 68, 69, 68, 67],
} as const;

export async function HeroLivePreview() {
  const result = await fetchGreenWindowsSafe(24, 6);

  if (!result.ok || !result.data.best_window) {
    return <HeroPreviewStats {...DEMO_STATS} live={false} />;
  }

  const plan = buildRecommendationPlan(
    result.data.best_window,
    result.data.slots,
  );
  const primary = plan.primary;

  if (!primary) {
    return <HeroPreviewStats {...DEMO_STATS} live={false} />;
  }

  const barValues = primary.hourly.map((h) => h.score);

  return (
    <HeroPreviewStats
      score={primary.score.toFixed(1)}
      action={primary.label}
      carbon={`${primary.avg_carbon_gco2_kwh.toFixed(0)} g`}
      foot={`Données live · fenêtre ${formatParisTime(primary.start_at)}`}
      chartFoot="Scores horaires dans la fenêtre 6 h"
      live
      barValues={barValues}
    />
  );
}

function HeroPreviewStats({
  score,
  action,
  carbon,
  foot,
  chartFoot,
  live,
  barValues,
}: {
  score: string;
  action: string;
  carbon: string;
  foot: string;
  chartFoot: string;
  live: boolean;
  barValues: readonly number[];
}) {
  const barHeights = valuesToBarHeightPcts(barValues);

  return (
    <div className="screenshot-frame">
      <div className="screenshot-frame-chrome">
        <span className="screenshot-frame-dot" />
        <span className="screenshot-frame-dot" />
        <span className="screenshot-frame-dot" />
        <span className="ml-2 text-xs text-[var(--text-muted)]">
          flexslot{live ? " — live" : ""}
        </span>
      </div>
      <div className="hero-preview-body">
        <div className="hero-preview-stats">
          <div className="hero-preview-stat">
            <p className="hero-preview-label">Score moyen</p>
            <p className="hero-preview-value hero-preview-value-ok">{score}</p>
          </div>
          <div className="hero-preview-stat">
            <p className="hero-preview-label">Action</p>
            <p className="hero-preview-value">{action}</p>
          </div>
          <div className="hero-preview-stat">
            <p className="hero-preview-label">Carbone</p>
            <p className="hero-preview-value">{carbon}</p>
          </div>
        </div>
        <div className="hero-preview-chart" aria-hidden>
          {barHeights.map((height, i) => (
            <div
              key={i}
              className="hero-preview-bar"
              style={{ height }}
            />
          ))}
        </div>
        <p className="hero-preview-foot text-xs text-[var(--text-muted)]">
          {foot}
          <span className="block mt-1">{chartFoot}</span>
        </p>
      </div>
    </div>
  );
}
