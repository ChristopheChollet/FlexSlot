import Link from "next/link";
import { glassHeaderStyle } from "@/lib/glassHeaderStyle";
import { getRepoUrl } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  const repoUrl = getRepoUrl();

  return (
    <header className="site-header" style={glassHeaderStyle}>
      <div className="site-header-bar mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-[var(--accent)]">
          FlexSlot
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
