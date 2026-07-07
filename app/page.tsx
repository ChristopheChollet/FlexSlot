import Link from "next/link";
import { HeroLivePreview } from "@/components/HeroLivePreview";
import { OpsChain } from "@/components/OpsChain";
import { RecommendationsIcon } from "@/components/RecommendationsIcon";
import { getEcosystemLinks, getRepoUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const stack = [
  "Next.js",
  "TypeScript",
  "GridPulse API",
  "GreenOps API",
  "Supabase",
  "Vercel",
];

const accent = "#ea580c";

const modules = [
  {
    href: "/recommendations",
    title: "Recommandations",
    description:
      "Fenêtre optimale GridPulse, action ops (consommer / flex / décaler) et création du slot GreenOps en un clic.",
    available: true,
  },
  {
    href: "/history",
    title: "Historique",
    description:
      "Snapshots des recommandations passées et lien vers le créneau GreenOps lorsqu'un slot a été créé.",
    available: true,
  },
] as const;

export default function HomePage() {
  const repoUrl = getRepoUrl();
  const ecosystem = getEcosystemLinks();

  return (
    <div className="pb-16">
      <section className="landing-hero-split pb-16 pt-4 sm:pt-8">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">Orchestration · Énergie &amp; climat</p>
          <h1 className="landing-title">
            De la data réseau
            <br />
            <span className="landing-title-accent">à l&apos;action ops</span>
          </h1>
          <p className="landing-lead">
            FlexSlot consomme GridPulse (créneaux verts, carbone), produit des
            recommandations actionnables et crée un slot flex dans GreenOps en un
            clic — le pont du triptyque ops.
          </p>
          <div className="landing-hero-cta">
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
          <ul className="stack-pills" aria-label="Stack technique">
            {stack.map((item) => (
              <li key={item}>
                <span className="stack-pill">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <HeroLivePreview />
      </section>

      <OpsChain
        highlight="decision"
        links={{
          gridPulse: ecosystem.gridPulse,
          greenOps: ecosystem.greenOps,
        }}
      />

      <section className="landing-modules" aria-labelledby="modules-heading">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
          Modules
        </p>
        <h2 id="modules-heading" className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
          Les pages du produit
        </h2>
        <p className="landing-modules-lead">
          Recommandations live depuis GridPulse et historique persistant des décisions
          ops — avec traçabilité jusqu&apos;à GreenOps.
        </p>
        <ul className="feature-grid">
          {modules.map((m) => (
            <li key={m.title} className="h-full">
              {m.available ? (
                <Link href={m.href} className="feature-card feature-card-link">
                  <span
                    className="feature-card-icon"
                    style={{ color: accent, backgroundColor: `${accent}14` }}
                    aria-hidden
                  >
                    <RecommendationsIcon />
                  </span>
                  <h3 className="feature-card-title">{m.title}</h3>
                  <p className="feature-card-desc">{m.description}</p>
                </Link>
              ) : (
                <div className="feature-card feature-card-soon opacity-80">
                  <span
                    className="feature-card-icon"
                    style={{ color: accent, backgroundColor: `${accent}14` }}
                    aria-hidden
                  >
                    <RecommendationsIcon />
                  </span>
                  <h3 className="feature-card-title">
                    {m.title}
                    <span className="module-soon-badge">V2</span>
                  </h3>
                  <p className="feature-card-desc">{m.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
