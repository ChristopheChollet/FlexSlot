# FlexSlot

Couche d'**orchestration ops** entre [GridPulse](https://github.com/ChristopheChollet/GridPulse) et [GreenOps](https://github.com/ChristopheChollet/GreenOps) : consomme la data réseau, produit des recommandations actionnables, crée un créneau flex en 1 clic.

> **Phrase entretien :** *« GridPulse dit quand · FlexSlot dit quoi faire · GreenOps enregistre l'action. »*

## Position dans l'écosystème

```
GridPulse  →  FlexSlot  →  GreenOps  →  VoltFlow (phase 2)
   data        décision      action        €
```

## État du projet

| Phase | Statut |
|-------|--------|
| 1 — Cadrage | ✅ |
| 2 — Scaffold Next.js | ✅ |
| 3 — Client GridPulse | ✅ |
| 4 — Moteur reco + UI | ✅ |
| 5 — API GreenOps | ✅ |
| 6 — Action 1 clic | ✅ |
| 7 — PDF + deploy | 🔜 |
| 7 — PDF + deploy | 🔜 |

Détail : [`docs/CADRAGE.md`](docs/CADRAGE.md)

## Stack (cible)

- Next.js 16 · TypeScript · Tailwind 4
- Appels server-side vers GridPulse API + GreenOps integration API
- Vercel

## Variables d'environnement (preview)

```bash
GRIDPULSE_API_URL=https://your-gridpulse-api.railway.app
GREENOPS_API_URL=https://green-ops-five.vercel.app
GREENOPS_SERVICE_KEY=           # partagé avec GreenOps
GREENOPS_DEMO_ORG_ID=           # org cible démo
```

## Démarrage local

```bash
cd FlexSlot
npm install
cp .env.example .env.local
npm run dev
```

Ouvre [http://localhost:3002](http://localhost:3002) — port **3002** pour ne pas conflit avec GreenOps (`3000`) ni GridPulse front (`3000`/`3001`).

## Licence

Projet portfolio — Christophe Chollet.
