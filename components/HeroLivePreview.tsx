import {
  buildRecommendationPlan,
  type RecommendationAction,
} from "@/lib/recommendations";
import { fetchGreenWindowsSafe, formatParisTime } from "@/lib/gridpulse";

const DEMO_STATS = {
  score: "68",
  action: "Flex",
  carbon: "18 g",
  foot: "Aperçu démo · ouvrez Recommandations pour le détail",
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

  return (
    <HeroPreviewStats
      score={primary.score.toFixed(1)}
      action={primary.label}
      carbon={`${primary.avg_carbon_gco2_kwh.toFixed(0)} g`}
      foot={`Données live · fenêtre ${formatParisTime(primary.start_at)}`}
      live
      actionKind={primary.action}
    />
  );
}

function HeroPreviewStats({
  score,
  action,
  carbon,
  foot,
  live,
  actionKind = "flex",
}: {
  score: string;
  action: string;
  carbon: string;
  foot: string;
  live: boolean;
  actionKind?: RecommendationAction;
}) {
  const barHeights = actionKind === "consume"
    ? ["70%", "85%", "60%", "90%", "75%", "65%"]
    : actionKind === "defer"
      ? ["35%", "45%", "30%", "50%", "40%", "38%"]
      : ["55%", "75%", "45%", "90%", "60%", "50%"];

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
        <p className="hero-preview-foot text-xs text-[var(--text-muted)]">{foot}</p>
      </div>
    </div>
  );
}
