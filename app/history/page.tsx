import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { HistoryIcon } from "@/components/ModuleIcons";
import { ActionBadge } from "@/components/RecommendationPanel";
import { listRecommendationHistory } from "@/lib/history/queries";
import type { HistoryListItem } from "@/lib/history/types";
import { formatParisTime } from "@/lib/gridpulse";
import type { RecommendationAction } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { items, configured } = await listRecommendationHistory(40);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orchestration"
        title="Historique"
        description="Snapshots des recommandations GridPulse enregistrés par FlexSlot — avec lien vers le créneau GreenOps lorsqu'un slot a été créé en un clic."
        icon={<HistoryIcon />}
        accent="#6366f1"
      />

      {!configured ? (
        <div className="section-card">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Historique non configuré
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Ajoutez <code className="text-xs">SUPABASE_URL</code> et{" "}
            <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> (même projet que
            GreenOps), puis exécutez la migration{" "}
            <code className="text-xs">001_flexslot_recommendation_history.sql</code>.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="section-card">
          <p className="text-sm text-[var(--text-secondary)]">
            Aucun snapshot pour l&apos;instant. Ouvrez la page{" "}
            <Link href="/recommendations" className="font-medium text-[var(--accent)]">
              Recommandations
            </Link>{" "}
            pour enregistrer le premier.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <HistoryRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

function HistoryRow({ item }: { item: HistoryListItem }) {
  const action = item.primaryAction as RecommendationAction | null;

  return (
    <li className="section-card section-card-hover">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--text-muted)]">
            {formatParisTime(item.createdAt)}
            {item.triggerType === "slot_created" && (
              <span className="ml-2 rounded-full bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                Slot créé
              </span>
            )}
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
            {item.primaryLabel}
          </p>
        </div>
        {action && <ActionBadge action={action} label={item.primaryLabel} />}
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs text-[var(--text-muted)]">Score</dt>
          <dd className="font-medium">
            {item.primaryScore != null ? item.primaryScore.toFixed(1) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--text-muted)]">Fenêtre</dt>
          <dd className="font-medium">
            {item.windowStart && item.windowEnd
              ? `${formatParisTime(item.windowStart)} → ${formatParisTime(item.windowEnd)}`
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--text-muted)]">Carbone moy.</dt>
          <dd className="font-medium">
            {item.avgCarbon != null ? `${item.avgCarbon.toFixed(0)} g` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--text-muted)]">GreenOps</dt>
          <dd>
            {item.greenopsUrl ? (
              <a
                href={item.greenopsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--accent)] underline"
              >
                Voir le slot →
              </a>
            ) : (
              <span className="text-[var(--text-muted)]">—</span>
            )}
          </dd>
        </div>
      </dl>
    </li>
  );
}
