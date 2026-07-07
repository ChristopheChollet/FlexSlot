import {
  formatParisTime,
  type GreenWindowsResponse,
  type HourlySlot,
} from "@/lib/gridpulse";

export function GreenWindowPanel({
  data,
  apiUrl,
}: {
  data: GreenWindowsResponse;
  apiUrl: string;
}) {
  const best = data.best_window;

  return (
    <section className="section-card" aria-labelledby="best-window-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 id="best-window-title" className="text-lg font-medium">
          Meilleure fenêtre {data.window_hours} h
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Source : GridPulse · {apiUrl.replace(/^https?:\/\//, "")}
        </p>
      </div>

      {best ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Période"
            value={`${formatParisTime(best.start_at)} → ${formatParisTime(best.end_at)}`}
          />
          <Metric label="Score" value={String(best.score)} accent />
          <Metric
            label="Carbone moyen"
            value={`${best.avg_carbon_gco2_kwh} gCO₂/kWh`}
          />
          <Metric
            label="Renouvelable moyen"
            value={`${best.avg_renewable_pct} %`}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Pas assez de points horaires pour calculer une fenêtre de{" "}
          {data.window_hours} h. Lance une ingestion GridPulse ou élargis la
          période.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
        {data.hint}
      </p>
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

export function HourlySlotsTable({ slots }: { slots: HourlySlot[] }) {
  const recent = [...slots].sort((a, b) => b.hour.localeCompare(a.hour)).slice(0, 12);

  if (recent.length === 0) {
    return null;
  }

  return (
    <section className="section-card" aria-labelledby="hourly-slots-title">
      <h2 id="hourly-slots-title" className="text-lg font-medium">
        Créneaux horaires récents
      </h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        12 dernières heures disponibles — actions recommandées à l&apos;étape 4.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="py-2 pr-4 font-medium">Heure (Paris)</th>
              <th className="py-2 pr-4 font-medium">Score</th>
              <th className="py-2 pr-4 font-medium">Carbone</th>
              <th className="py-2 font-medium">Renouvelable</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((slot) => (
              <tr
                key={slot.hour}
                className="border-b border-[var(--surface-border)] last:border-0"
              >
                <td className="py-2.5 pr-4">{formatParisTime(slot.hour)}</td>
                <td className="py-2.5 pr-4 font-medium text-[var(--accent)]">
                  {slot.score}
                </td>
                <td className="py-2.5 pr-4">{slot.carbon_gco2_kwh} g</td>
                <td className="py-2.5">{slot.renewable_pct} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
