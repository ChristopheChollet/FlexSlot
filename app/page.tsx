import Link from "next/link";
import { getEcosystemLinks, getRepoUrl } from "@/lib/site";

const stack = ["Next.js", "TypeScript", "GridPulse API", "GreenOps API", "Vercel"];

export default function HomePage() {
  const repoUrl = getRepoUrl();
  const { gridPulse, greenOps } = getEcosystemLinks();

  return (
    <div className="pb-16">
      <section className="pb-12 pt-4 sm:pt-8">
        <p className="landing-eyebrow">Orchestration · Énergie &amp; climat</p>
        <h1 className="landing-title">
          De la data réseau
          <br />
          <span style={{ color: "var(--accent)" }}>à l&apos;action ops</span>
        </h1>
        <p className="landing-lead">
          FlexSlot consomme GridPulse (créneaux verts, carbone), produit des
          recommandations actionnables et crée un slot flex dans GreenOps en un
          clic — le pont du triptyque ops.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/recommendations" className="btn-primary px-6 py-2.5 text-sm">
            Voir les recommandations
          </Link>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-6 py-2.5 text-sm"
          >
            Code source →
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--text-muted)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Chaîne ops</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div className="flow-step">
            <p className="flow-step-label">1 · Data</p>
            <p className="mt-1 font-medium">GridPulse</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Mix, carbone, green-windows
            </p>
            {gridPulse && (
              <a
                href={gridPulse}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-[var(--accent)] underline"
              >
                Démo →
              </a>
            )}
          </div>
          <span className="flow-arrow hidden sm:block" aria-hidden>
            →
          </span>
          <div className="flow-step ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]">
            <p className="flow-step-label">2 · Décision</p>
            <p className="mt-1 font-medium">FlexSlot</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Consommer · flex · décaler
            </p>
          </div>
          <span className="flow-arrow hidden sm:block" aria-hidden>
            →
          </span>
          <div className="flow-step">
            <p className="flow-step-label">3 · Action</p>
            <p className="mt-1 font-medium">GreenOps</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              flex_slots, audit, équipe
            </p>
            {greenOps && (
              <a
                href={greenOps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-[var(--accent)] underline"
              >
                Démo →
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mt-12 section-card">
        <h2 className="text-lg font-medium">Roadmap build</h2>
        <ol className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
          <li>✅ Étape 1 — Cadrage</li>
          <li>✅ Étape 2 — Scaffold Next.js</li>
          <li>✅ Étape 3 — Client GridPulse + page reco</li>
          <li>✅ Étape 4 — Moteur recommandation</li>
          <li>✅ Étape 5 — API intégration GreenOps</li>
          <li>✅ Étape 6 — Création slot 1 clic</li>
          <li>
            <span className="badge-soon mr-2">next</span>
            Étape 7 — PDF + deploy
          </li>
        </ol>
      </section>
    </div>
  );
}
