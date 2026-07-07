import { maybeSendRecommendationAlert } from "@/lib/alerts/dispatch";
import { recordRecommendationSnapshot } from "@/lib/history/record";
import { fetchGreenWindowsSafe } from "@/lib/gridpulse";
import { buildRecommendationPlan } from "@/lib/recommendations";

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return false;

  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-cron-secret");

  return header === expected;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const data = await fetchGreenWindowsSafe(24, 6);
  if (!data?.best_window) {
    return Response.json({ ok: true, alert: false, reason: "no_window" });
  }

  const plan = buildRecommendationPlan(data.best_window, data.slots);
  const snapshotId = await recordRecommendationSnapshot(
    plan,
    data.window_hours,
    "view",
  );

  await maybeSendRecommendationAlert(plan, snapshotId);

  return Response.json({
    ok: true,
    snapshot_id: snapshotId,
    primary_action: plan.primary?.action ?? null,
  });
}
