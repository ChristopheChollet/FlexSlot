import { CreateFlexSlotButton } from "@/components/CreateFlexSlotButton";
import {
  actionBadgeClass,
  type RecommendationAction,
  type SlotRecommendation,
  type WindowRecommendation,
} from "@/lib/recommendations";
import { formatParisTime } from "@/lib/gridpulse";

export function ActionBadge({ action, label }: { action: RecommendationAction; label: string }) {
  return (
    <span className={actionBadgeClass(action)}>{label}</span>
  );
}

export function RecommendationHero({
  recommendation,
}: {
  recommendation: WindowRecommendation;
}) {
  return (
    <section className="section-card recommendation-hero" aria-labelledby="reco-hero-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Recommandation principale
          </p>
          <h2 id="reco-hero-title" className="mt-2 text-xl font-semibold tracking-tight">
            {recommendation.label}
          </h2>
        </div>
        <ActionBadge action={recommendation.action} label={recommendation.label} />
      </div>

      <p className="mt-4 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
        {recommendation.description}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Fenêtre"
          value={`${formatParisTime(recommendation.start_at)} → ${formatParisTime(recommendation.end_at)}`}
        />
        <Metric label="Score moyen" value={String(recommendation.score)} accent />
        <Metric
          label="Carbone moyen"
          value={`${recommendation.avg_carbon_gco2_kwh} gCO₂/kWh`}
        />
        <Metric
          label="Slot GreenOps suggéré"
          value={
            recommendation.suggestedKind === "need"
              ? "Besoin (need)"
              : recommendation.suggestedKind === "offer"
                ? "Offre (offer)"
                : "Aucun (décaler)"
          }
        />
      </div>

      <CreateFlexSlotButton recommendation={recommendation} />
    </section>
  );
}

export function RecommendationLegend() {
  return (
    <section className="section-card bg-[var(--surface-muted)]">
      <h2 className="text-sm font-medium">Règles V1</h2>
      <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
        <li>
          <ActionBadge action="consume" label="Consommer" /> — score ≥ 70
        </li>
        <li>
          <ActionBadge action="flex" label="Flex" /> — score 45 à 69
        </li>
        <li>
          <ActionBadge action="defer" label="Décaler" /> — score &lt; 45
        </li>
      </ul>
    </section>
  );
}

export function HourlyRecommendationsTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: SlotRecommendation[];
}) {
  if (rows.length === 0) return null;

  return (
    <section className="section-card" aria-labelledby={title.replace(/\s/g, "-")}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="py-2 pr-4 font-medium">Heure</th>
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Score</th>
              <th className="py-2 pr-4 font-medium">Carbone</th>
              <th className="py-2 font-medium">Renouvelable</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.hour}
                className="border-b border-[var(--surface-border)] last:border-0"
              >
                <td className="py-2.5 pr-4">{formatParisTime(row.hour)}</td>
                <td className="py-2.5 pr-4">
                  <ActionBadge action={row.action} label={row.label} />
                </td>
                <td className="py-2.5 pr-4 font-medium">{row.score}</td>
                <td className="py-2.5 pr-4">{row.carbon_gco2_kwh} g</td>
                <td className="py-2.5">{row.renewable_pct} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}
      >
        {value}
      </p>
    </div>
  );
}
