import Link from "next/link";
import { getRepoUrl } from "@/lib/site";

export function SiteHeader() {
  const repoUrl = getRepoUrl();

  return (
    <header className="site-header sticky top-0 z-10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-[var(--accent)]">
          FlexSlot
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/recommendations"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Recommandations
          </Link>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
