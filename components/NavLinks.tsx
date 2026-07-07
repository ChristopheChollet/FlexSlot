"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/recommendations", label: "Recommandations", accent: "#ea580c" },
  { href: "/history", label: "Historique", accent: "#6366f1" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1" aria-label="Navigation principale">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link${active ? " nav-link-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span
              className="nav-dot"
              style={{ backgroundColor: l.accent }}
              aria-hidden
            />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
