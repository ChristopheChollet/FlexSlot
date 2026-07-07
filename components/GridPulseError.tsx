import { getEcosystemLinks } from "@/lib/site";

export function GridPulseError({
  message,
  apiUrl,
}: {
  message: string;
  apiUrl: string;
}) {
  const { gridPulse } = getEcosystemLinks();

  return (
    <section
      className="section-card border-[#fecaca] bg-[#fef2f2] dark:border-[#7f1d1d] dark:bg-[#450a0a]/40"
      role="alert"
    >
      <h2 className="text-lg font-medium text-[#991b1b] dark:text-[#fca5a5]">
        GridPulse indisponible
      </h2>
      <p className="mt-2 text-sm text-[#7f1d1d] dark:text-[#fecaca]">{message}</p>
      <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
        <li>
          <strong>Local :</strong> lance GridPulse —{" "}
          <code className="text-xs">cd GridPulse/backend && uvicorn app.main:app --reload --port 8000</code>
        </li>
        <li>
          <strong>Config :</strong> <code className="text-xs">GRIDPULSE_API_URL</code>{" "}
          dans <code className="text-xs">.env.local</code> (actuel : {apiUrl})
        </li>
        <li>
          <strong>Prod :</strong> utilise l&apos;URL Railway de l&apos;API GridPulse si
          le backend local n&apos;est pas démarré.
        </li>
      </ul>
      {gridPulse && (
        <a
          href={gridPulse}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-[var(--accent)] underline"
        >
          Ouvrir le dashboard GridPulse →
        </a>
      )}
    </section>
  );
}
