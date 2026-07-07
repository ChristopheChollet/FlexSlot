import Link from "next/link";
import { OpsChain } from "@/components/OpsChain";
import { getEcosystemLinks, getRepoUrl } from "@/lib/site";

const stack = ["Next.js", "TypeScript", "GridPulse API", "GreenOps API", "Vercel"];

export default function HomePage() {
  const repoUrl = getRepoUrl();
  const ecosystem = getEcosystemLinks();

  return (
    <div className="pb-16">
      <section className="landing-hero pb-16 pt-4 sm:pt-8">
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
      </section>

      <OpsChain
        highlight="decision"
        links={{
          gridPulse: ecosystem.gridPulse,
          greenOps: ecosystem.greenOps,
        }}
      />
    </div>
  );
}
