import { renderToBuffer } from "@react-pdf/renderer";
import { fetchGreenWindowsSafe } from "@/lib/gridpulse";
import { buildRecommendationPlan } from "@/lib/recommendations";
import { DailyReportDocument } from "@/lib/pdf/DailyReportDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await fetchGreenWindowsSafe(24, 6);

  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const plan = buildRecommendationPlan(result.data.best_window, result.data.slots);
  const generatedAt = new Date().toISOString();

  const buffer = await renderToBuffer(
    DailyReportDocument({ plan, generatedAt }) as Parameters<typeof renderToBuffer>[0],
  );

  const filename = `flexslot-recommandation-${generatedAt.slice(0, 10)}.pdf`;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
