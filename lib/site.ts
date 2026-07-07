const DEFAULT_REPO = "https://github.com/ChristopheChollet/FlexSlot";

export function getRepoUrl(): string {
  return process.env.NEXT_PUBLIC_REPO_URL?.trim() || DEFAULT_REPO;
}

export function getGridPulseApiUrl(): string {
  return (
    process.env.GRIDPULSE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_GRIDPULSE_API_URL?.trim() ||
    "http://localhost:8000"
  );
}

export function getGreenOpsApiUrl(): string {
  return (
    process.env.GREENOPS_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_GREENOPS_API_URL?.trim() ||
    "http://localhost:3000"
  );
}

export function getGreenOpsDemoOrgId(): string | null {
  const id = process.env.GREENOPS_DEMO_ORG_ID?.trim();
  return id || null;
}

export function getEcosystemLinks() {
  return {
    gridPulse:
      process.env.NEXT_PUBLIC_GRIDPULSE_DEMO_URL?.trim() ||
      "https://grid-pulse-steel.vercel.app",
    greenOps:
      process.env.NEXT_PUBLIC_GREENOPS_DEMO_URL?.trim() ||
      "https://green-ops-five.vercel.app",
  };
}

export function getGreenOpsDemoUrl(): string {
  return getEcosystemLinks().greenOps;
}
