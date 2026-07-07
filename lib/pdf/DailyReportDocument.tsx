import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { RecommendationPlan } from "@/lib/recommendations";
import { formatParisTime } from "@/lib/gridpulse";

const ACTION_LABELS: Record<string, string> = {
  consume: "Consommer",
  flex: "Flex",
  defer: "Décaler",
};

const ACTION_COLORS: Record<string, string> = {
  consume: "#15803d",
  flex: "#b45309",
  defer: "#b91c1c",
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2933",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #0f766e",
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 9,
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 10,
    color: "#52606d",
    marginTop: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  heroBox: {
    backgroundColor: "#f0fdfa",
    border: "1 solid #99f6e4",
    borderRadius: 4,
    padding: 12,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 12,
  },
  metric: {
    minWidth: 120,
  },
  metricLabel: {
    fontSize: 8,
    color: "#7b8794",
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 2,
  },
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1 solid #cbd2d9",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #e4e7eb",
    paddingVertical: 3,
  },
  th: {
    fontSize: 8,
    color: "#7b8794",
    textTransform: "uppercase",
  },
  td: {
    fontSize: 9,
  },
  colHour: { width: "22%" },
  colAction: { width: "20%" },
  colScore: { width: "18%" },
  colCarbon: { width: "20%" },
  colRenewable: { width: "20%" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    fontSize: 8,
    color: "#9aa5b1",
    borderTop: "0.5 solid #e4e7eb",
    paddingTop: 8,
  },
  emptyBox: {
    padding: 16,
    backgroundColor: "#fef2f2",
    border: "1 solid #fecaca",
    borderRadius: 4,
  },
});

function actionColor(action: string): string {
  return ACTION_COLORS[action] ?? "#1f2933";
}

function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

export function DailyReportDocument({
  plan,
  generatedAt,
}: {
  plan: RecommendationPlan;
  generatedAt: string;
}) {
  const { primary, outlook } = plan;

  return (
    <Document title="FlexSlot — Recommandation du jour">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FlexSlot · Écosystème ops énergie</Text>
          <Text style={styles.title}>Recommandation du jour</Text>
          <Text style={styles.subtitle}>
            Généré le {formatParisTime(generatedAt)} (heure de Paris) — GridPulse observe · FlexSlot
            recommande · GreenOps enregistre.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fenêtre optimale (6 h)</Text>
          {primary ? (
            <View style={styles.heroBox}>
              <View style={styles.heroRow}>
                <Text style={{ fontSize: 13, fontWeight: 700 }}>{primary.label}</Text>
                <Text style={{ fontSize: 11, fontWeight: 700, color: actionColor(primary.action) }}>
                  {actionLabel(primary.action)}
                </Text>
              </View>
              <Text style={{ color: "#3e4c59" }}>{primary.description}</Text>
              <View style={styles.metricGrid}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Fenêtre</Text>
                  <Text style={styles.metricValue}>
                    {formatParisTime(primary.start_at)} - {formatParisTime(primary.end_at)}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Score moyen</Text>
                  <Text style={styles.metricValue}>{primary.score}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Carbone moyen</Text>
                  <Text style={styles.metricValue}>{primary.avg_carbon_gco2_kwh} gCO2/kWh</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Slot GreenOps suggéré</Text>
                  <Text style={styles.metricValue}>
                    {primary.suggestedKind === "need"
                      ? "Besoin (need)"
                      : primary.suggestedKind === "offer"
                        ? "Offre (offer)"
                        : "Aucun (décaler)"}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text>Aucune fenêtre disponible — données GridPulse indisponibles ou insuffisantes.</Text>
            </View>
          )}
        </View>

        {primary && primary.hourly.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détail horaire de la fenêtre</Text>
            <HourlyTable rows={primary.hourly} />
          </View>
        )}

        {outlook.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outlook 12 h</Text>
            <HourlyTable rows={outlook} />
          </View>
        )}

        <Text style={styles.footer}>
          Indicateur pédagogique basé sur les données GridPulse (RTE, Electricity Maps) — ne
          constitue pas une recommandation opérationnelle réseau. Document généré automatiquement
          par FlexSlot dans le cadre d&apos;un portfolio de développement.
        </Text>
      </Page>
    </Document>
  );
}

function HourlyTable({
  rows,
}: {
  rows: {
    hour: string;
    action: string;
    label: string;
    score: number;
    carbon_gco2_kwh: number;
    renewable_pct: number;
  }[];
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.th, styles.colHour]}>Heure</Text>
        <Text style={[styles.th, styles.colAction]}>Action</Text>
        <Text style={[styles.th, styles.colScore]}>Score</Text>
        <Text style={[styles.th, styles.colCarbon]}>Carbone</Text>
        <Text style={[styles.th, styles.colRenewable]}>Renouvelable</Text>
      </View>
      {rows.map((row) => (
        <View style={styles.tableRow} key={row.hour}>
          <Text style={[styles.td, styles.colHour]}>{formatParisTime(row.hour)}</Text>
          <Text style={[styles.td, styles.colAction, { color: actionColor(row.action) }]}>
            {actionLabel(row.action)}
          </Text>
          <Text style={[styles.td, styles.colScore]}>{row.score}</Text>
          <Text style={[styles.td, styles.colCarbon]}>{row.carbon_gco2_kwh} g</Text>
          <Text style={[styles.td, styles.colRenewable]}>{row.renewable_pct} %</Text>
        </View>
      ))}
    </View>
  );
}
