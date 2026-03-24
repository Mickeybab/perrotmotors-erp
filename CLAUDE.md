# PERROT MOTORS — DMS (Dealer Management System)
## Configuration orchestrateur Claude Code

---

## Projet

SaaS interne de gestion de concession automobile sport/youngtimer.
Stack : **Next.js 15 (App Router) + PostgreSQL + Prisma + Tailwind CSS**
Hébergement : local (Docker Compose), migration VPS OVH ensuite.

---

## Architecture des agents

```
Orchestrateur (ce fichier)
├── Agent DEV      → implémente les US, une branche par US
├── Agent TEST     → écrit et exécute les tests (Vitest + Playwright)
└── Agent REVIEW   → review la PR, vérifie conventions et sécurité
```

### Règles de routing

- Une US = une branche = un agent DEV
- Nommage des branches : `feat/US-{id}-{slug-court}`
- Après merge d'une US → agent TEST valide la branche de destination
- Après validation → agent REVIEW ouvre/approuve la PR via `gh` CLI
- L'orchestrateur ne code JAMAIS directement

### Lancement multi-agents

```bash
# Activer Agent Teams
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Lancer l'orchestrateur (lui donne ce CLAUDE.md + le backlog)
claude

# Commande naturelle à taper :
# "Lance le sprint 1 : assigne les US 1, 2 et 3 à trois agents dev en parallèle"
```

---

## Conventions de code

### Nommage
- Composants React : PascalCase (`VehicleCard.tsx`)
- Fonctions/variables : camelCase
- Tables BDD : snake_case (`vehicle_costs`)
- Routes API : kebab-case (`/api/vehicles/[id]/costs`)
- Branches git : `feat/US-{id}-{slug}`, `fix/{slug}`, `chore/{slug}`

### Structure des fichiers

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Routes authentifiées
│   │   ├── vehicles/       # Gestion stock
│   │   ├── costs/          # Suivi coûts/marges
│   │   ├── customers/      # CRM
│   │   └── registrations/  # Carte grise / SIV
│   └── api/                # Route handlers
├── components/
│   ├── ui/                 # Composants atomiques
│   └── features/           # Composants métier
├── lib/
│   ├── db/                 # Client Prisma + queries
│   ├── siv/                # Logique SIV/ANTS
│   └── utils/
├── types/                  # Types TypeScript globaux
└── prisma/
    └── schema.prisma
```

### Standards qualité
- TypeScript strict mode (pas de `any`)
- Zod pour la validation des inputs API
- Chaque route API doit avoir son fichier `.test.ts`
- Couverture minimale : 80% sur les fonctions métier critiques
- Pas de secret en dur → `.env.local` uniquement

---

## Domaines métier

### 1. Gestion stock véhicules
- CRUD complet véhicule (VIN, immat, marque, modèle, année, km, couleur, prix achat, prix vente)
- Upload photos (local `/public/uploads/` en dev, S3-compatible en prod)
- Statuts : `EN_STOCK | EN_VENTE | RESERVE | VENDU | EN_REPARATION`
- Recherche/filtres multicritères

### 2. Suivi coûts / marges
- Coûts liés à un véhicule : achat, transport, réparations, CT, carte grise, comm
- Calcul automatique marge brute = prix_vente - total_coûts
- Dashboard synthèse par période

### 3. Carte grise / SIV
- Simulation démarches ANTS (pas d'API officielle, workflow manuel guidé)
- Checklist documents nécessaires selon type de véhicule
- Suivi statut demande (en attente, déposée, obtenue)
- Export PDF récapitulatif dossier

### 4. CRM Clients
- Fiche client (particulier / professionnel)
- Historique achats par client
- Notes / suivi relation

---

## Workflow Git

```bash
# Démarrer une US
git checkout main && git pull
git checkout -b feat/US-{id}-{slug}

# Commits
git commit -m "feat(US-{id}): description courte"

# Fin de US → ouvrir PR
gh pr create --title "feat: US-{id} - {titre}" --body "Closes #US-{id}"

# Review agent → approve ou request changes
gh pr review {pr-number} --approve  # ou --request-changes -b "..."
```

---

## Environnement local

```bash
# Démarrer la stack
docker compose up -d     # PostgreSQL sur :5432
npm run dev              # Next.js sur :3000

# BDD
npx prisma migrate dev   # Appliquer migrations
npx prisma studio        # GUI BDD

# Tests
npm run test             # Vitest (unitaire)
npm run test:e2e         # Playwright
```

---

## Priorités Sprint 1 (MVP)

1. **US-001** — Setup projet (Next.js + Prisma + Docker + Auth basique)
2. **US-002** — CRUD Véhicule (liste, création, édition, suppression)
3. **US-003** — Upload photos véhicule
4. **US-004** — Module coûts par véhicule + calcul marge
5. **US-005** — CRM Clients basique (fiche + liste)
6. **US-006** — Workflow carte grise (checklist + statut)

Sprint 2 : dashboard synthèse, exports PDF, recherche avancée.
