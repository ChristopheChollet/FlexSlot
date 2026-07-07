# FlexSlot — Cadrage (Étape 1)

> Couche d'orchestration entre **GridPulse** (data réseau) et **GreenOps** (action métier).
> Projet 3 du triptyque ops : *GridPulse observe · FlexSlot recommande · GreenOps enregistre.*

---

## Problème résolu

Aujourd'hui :

- **GridPulse** calcule des créneaux verts (`GET /api/v1/green-windows`) mais ne dit pas quoi **faire**.
- **GreenOps** permet de créer des `flex_slots` manuellement, sans contexte réseau.

FlexSlot comble le gap : **data → recommandation actionnable → slot flex** (1 clic).

---

## Périmètre MVP (V1)

| In scope | Out of scope (V2+) |
|----------|-------------------|
| Consommer GridPulse (green-windows + forecasts optionnel) | Auth utilisateur propre à FlexSlot |
| Afficher 6–12 h avec score + action (`consommer` / `décaler` / `flex`) | ML / modèle propriétaire |
| Bouton « Créer le slot dans GreenOps » | VoltFlow / facturation |
| Traçabilité (`source`, score, fenêtre GridPulse) sur le slot | Multi-org FlexSlot |
| Export PDF « recommandation du jour » | Alertes Slack |

---

## Architecture cible

```
GridPulse API (Railway)
        │  GET /api/v1/green-windows
        │  GET /api/v1/forecasts (optionnel V1)
        ▼
FlexSlot (Next.js · Vercel)
        │  logique reco + UI
        │  POST /api/integrations/flex-slots
        ▼
GreenOps (Next.js · Vercel · Supabase)
        └── flex_slots (+ colonnes traçabilité)
```

### Stack FlexSlot

| Couche | Choix | Pourquoi |
|--------|-------|----------|
| Frontend | Next.js 16 · TypeScript · Tailwind 4 | Aligné GreenOps / GridPulse front |
| Orchestration | Server Components + Route Handlers | Pas de 2ᵉ backend à déployer pour le MVP |
| Auth V1 | Aucune (lecture publique GridPulse) | GreenOps garde l'auth ; création slot via clé service |
| Deploy | Vercel | Même workflow que les autres briques |

> Alternative V2 : extraire l'orchestration en FastAPI si besoin de montrer un 2ᵉ service Python.

---

## Contrats API

### Entrant — GridPulse (existant)

```
GET /api/v1/green-windows?hours=24&window=6
```

Réponse utilisée : `best_window`, `slots[]`, `window_hours`.

Variables FlexSlot :

- `GRIDPULSE_API_URL` — ex. `https://gridpulse-api.railway.app` ou `http://localhost:8000`

### Sortant — GreenOps (à créer — Étape 5)

```
POST /api/integrations/flex-slots
Headers:
  X-GreenOps-Service-Key: <secret partagé>
  Content-Type: application/json

Body:
{
  "org_id": "uuid",           // org cible (V1 : org démo fixe via env)
  "kind": "offer" | "need",
  "start_at": "ISO8601",
  "end_at": "ISO8601",
  "power_kw": 100,            // optionnel
  "notes": "Créé via FlexSlot — score 78",
  "recommendation": {
    "source": "flexslot",
    "action": "flex" | "consume" | "defer",
    "gridpulse_score": 78.2,
    "window_start": "ISO8601",
    "window_end": "ISO8601",
    "avg_carbon_gco2_kwh": 42.5
  }
}

Response 201:
{ "id": "uuid", "greenops_url": "https://green-ops-five.vercel.app/flex" }
```

Variables GreenOps :

- `GREENOPS_INTEGRATION_SECRET`
- `GREENOPS_DEMO_ORG_ID` (org de démo pour portfolio)

Variables FlexSlot :

- `GREENOPS_API_URL`
- `GREENOPS_SERVICE_KEY`
- `GREENOPS_DEMO_ORG_ID`

---

## Logique recommandation (V1 — règles simples)

Basée sur `best_window` et les `slots` horaires GridPulse :

| Condition | Action | Kind slot suggéré |
|-----------|--------|-------------------|
| `score >= 70` | **Consommer** — fenêtre favorable | `need` (besoin) |
| `score 45–69` | **Flex** — proposer un créneau flexible | `offer` |
| `score < 45` | **Décaler** — éviter, reporter | pas de slot auto ; message seul |

Libellés affichés en français ; `action` stockée en anglais pour l'API.

---

## Schéma GreenOps — migration 004 (Étape 5)

```sql
alter table public.flex_slots
  add column if not exists source text default 'manual',
  add column if not exists recommendation_action text,
  add column if not exists gridpulse_score numeric,
  add column if not exists gridpulse_window_start timestamptz,
  add column if not exists gridpulse_window_end timestamptz,
  add column if not exists gridpulse_avg_carbon numeric;
```

`source` : `'manual'` | `'flexslot'`.

---

## Plan de réalisation (pas à pas)

| Étape | Nom | Livrable |
|-------|-----|----------|
| **1** | Cadrage | Ce document + README |
| **2** | Scaffold FlexSlot | Repo Next.js, env, landing |
| **3** | Client GridPulse | `lib/gridpulse.ts` + page reco read-only |
| **4** | Moteur reco | Règles action + UI créneaux 6–12 h |
| **5** | API GreenOps | Migration 004 + route intégration |
| **6** | Action 1 clic | Bouton → slot créé → lien GreenOps |
| **7** | PDF + deploy | Export reco + Vercel + CORS GridPulse |

---

## Honnêteté entretien

- Recommandations **pédagogiques**, pas conseil opérationnel RTE.
- Intégration **démo portfolio** ; en prod réelle : auth OAuth service-to-service, idempotence, retry.

---

## Liens écosystème

| Projet | Rôle | URL démo |
|--------|------|----------|
| GridPulse | Data | grid-pulse-steel.vercel.app |
| FlexSlot | Orchestration | (à déployer) |
| GreenOps | Action | green-ops-five.vercel.app |
| VoltFlow | Facturation | phase 2 |
