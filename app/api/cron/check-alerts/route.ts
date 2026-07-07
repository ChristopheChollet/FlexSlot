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

  const result = await fetchGreenWindowsSafe(24, 6);
  if (!result.ok) {
    return Response.json(
      { ok: false, alert: false, reason: "gridpulse_error", message: result.message },
      { status: 502 },
    );
  }

  const { best_window, slots, window_hours } = result.data;
  if (!best_window) {
    return Response.json({ ok: true, alert: false, reason: "no_window" });
  }

  const plan = buildRecommendationPlan(best_window, slots);
  const snapshotId = await recordRecommendationSnapshot(
    plan,
    window_hours,
    "view",
  );

  await maybeSendRecommendationAlert(plan, snapshotId);

  return Response.json({
    ok: true,
    snapshot_id: snapshotId,
    primary_action: plan.primary?.action ?? null,
  });
}
