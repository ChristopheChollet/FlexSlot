import Link from "next/link";
import { FlexSlotLogo } from "@/components/FlexSlotLogo";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { glassHeaderStyle } from "@/lib/glassHeaderStyle";
import { getRepoUrl } from "@/lib/site";

export function SiteHeader() {
  const repoUrl = getRepoUrl();

  return (
    <header className="site-header" style={glassHeaderStyle} role="banner">
      <div className="site-header-bar mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="brand-lockup shrink-0">
          <FlexSlotLogo size="md" />
          <span className="brand-lockup-text">
            <span className="brand-lockup-name">FlexSlot</span>
            <span className="brand-lockup-sub">Orchestration ops</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLinks />
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link hidden sm:inline-flex"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
