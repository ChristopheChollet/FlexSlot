# Alertes V2.1 — Slack / Discord / Cron

Guide pour activer les webhooks **GridPulse** (seuil carbone) et **FlexSlot** (recommandation Décaler / carbone élevé).

Tu peux utiliser **la même URL webhook** pour les deux apps (un seul canal `#energy-ops`).

---

## 1. Créer le webhook

### Slack

1. [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
2. Nom : `GreenChain Ops` (ou autre) → choisis ton workspace
3. **Incoming Webhooks** → activer → **Add New Webhook to Workspace**
4. Choisis un canal (ex. `#energy-alerts`) → **Allow**
5. Copie l’URL : `https://hooks.slack.com/services/T…/B…/…`

### Discord

1. Paramètres du serveur → **Intégrations** → **Webhooks** → **Nouveau webhook**
2. Nom : `GridPulse / FlexSlot` → choisis un salon
3. **Copier l’URL du webhook** : `https://discord.com/api/webhooks/…`

Les messages sont formatés automatiquement (`text` pour Slack, `content` pour Discord).

---

## 2. GridPulse (Railway — backend API)

Dans le service **backend** Railway → **Variables** :

| Variable | Valeur |
|----------|--------|
| `ALERT_WEBHOOK_URL` | URL Slack ou Discord |
| `CARBON_ALERT_THRESHOLD_GCO2` | `200` (défaut dashboard) |
| `ALERT_WEBHOOK_ENABLED` | `true` |

**Redéploie** le service backend.

**Déclenchement** : à chaque ingestion horaire (GitHub Actions → `POST /ingest/run`), si le carbone **franchit** le seuil (pas à chaque heure au-dessus — anti-spam).

**Test manuel** (remplace l’URL et le secret) :

```bash
curl -X POST "https://TON-API-RAILWAY/ingest/run" \
  -H "X-Ingest-Secret: TON_INGEST_SECRET"
```

Réponse JSON : `"alert": { "fired": true, … }` si seuil franchi.

---

## 3. FlexSlot (Vercel)

### Variables d’environnement

Projet FlexSlot → **Settings** → **Environment Variables** :

| Variable | Valeur |
|----------|--------|
| `FLEXSLOT_ALERT_WEBHOOK_URL` | Même URL Slack/Discord |
| `FLEXSLOT_CARBON_ALERT_THRESHOLD_GCO2` | `200` |
| `FLEXSLOT_ALERT_ACTIONS` | `defer` |
| `CRON_SECRET` | Secret long aléatoire (voir ci-dessous) |

Générer `CRON_SECRET` :

```bash
openssl rand -hex 32
```

Colle le résultat dans Vercel (Production + Preview si besoin).

### Cron Vercel (déjà dans `vercel.json`)

> **Plan Hobby** : Vercel n’autorise qu’**un cron par jour** (pas toutes les 15 min). Le repo utilise `0 7 * * *` (07:00 UTC). Pour du polling 15 min : plan Pro, ou cron externe (ex. [cron-job.org](https://cron-job.org)) qui appelle l’endpoint ci-dessous.

```json
{
  "crons": [
    {
      "path": "/api/cron/check-alerts",
      "schedule": "0 7 * * *"
    }
  ]
}
```

- **1× / jour** (07:00 UTC) sur Hobby — Vercel appelle `/api/cron/check-alerts`
- Vercel envoie automatiquement `Authorization: Bearer <CRON_SECRET>` si la variable est définie
- Déduplication **15 min** côté app (pas de spam si plusieurs déclencheurs)

**Redéploie** après avoir ajouté les variables (un push sur `main` suffit).

### Déclenchement sans cron

Les alertes partent aussi quand quelqu’un visite **`/recommendations`** (nouveau snapshot uniquement).

### Test manuel du cron

```bash
curl "https://flex-slot.vercel.app/api/cron/check-alerts" \
  -H "Authorization: Bearer TON_CRON_SECRET"
```

Réponse attendue : `{ "ok": true, "snapshot_id": "…", "primary_action": "defer" }`

---

## 4. Checklist rapide

- [ ] Webhook Slack ou Discord créé
- [ ] `ALERT_WEBHOOK_URL` sur Railway (GridPulse backend)
- [ ] `FLEXSLOT_ALERT_WEBHOOK_URL` + `CRON_SECRET` sur Vercel (FlexSlot)
- [ ] Redéploiements faits
- [ ] Test curl ingest (GridPulse) et/ou cron (FlexSlot)
- [ ] Message reçu dans le canal

---

## 5. Dépannage

| Problème | Piste |
|----------|--------|
| Rien sur GridPulse | Seuil pas **franchi** (il faut passer de ≤200 à >200) ; vérifie `ALERT_WEBHOOK_ENABLED=true` |
| Rien sur FlexSlot | Pas de reco `defer` et carbone < seuil ; ou dédup 15 min (normal) |
| Cron 401 | `CRON_SECRET` manquant ou différent entre Vercel env et header |
| Slack 404 | URL webhook révoquée — recrée le webhook |
| Cron absent sur Vercel | Plan **Hobby** : crons limités ; vérifie **Deployments** → onglet **Cron Jobs** après deploy |

---

## 6. Exemple de messages

**GridPulse**

```
GridPulse — seuil carbone dépassé (FR)
Actuel : 245 gCO₂/kWh (seuil 200)
Avant : 185 gCO₂/kWh
Mesure : 2026-07-07T18:00:00+00:00
```

**FlexSlot**

```
FlexSlot — Décaler (defer)
Score 32 · Carbone moy. 220 gCO₂/kWh (seuil 200)
Renouvelable moy. 28 %
Fenêtre : 07/07/2026 10:00 → 16:00
```
