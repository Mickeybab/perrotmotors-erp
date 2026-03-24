# GUIDE DÉMARRAGE — Multi-Agents Perrot Motors

## Prérequis

```bash
# Claude Code
npm install -g @anthropic-ai/claude-code

# GitHub CLI (pour les PR automatiques)
# https://cli.github.com/
gh auth login

# Node.js 20+, Docker Desktop
```

---

## 1. Initialiser le projet

```bash
# Crée le projet Next.js
npx create-next-app@latest perrot-motors \
  --typescript --tailwind --eslint \
  --app --src-dir --no-turbopack

cd perrot-motors

# Copie les fichiers de config agents
cp /path/to/kit/CLAUDE.md ./CLAUDE.md
cp /path/to/kit/BACKLOG.md ./BACKLOG.md

# Init git + GitHub
git init
gh repo create perrot-motors --private
git remote add origin https://github.com/TON_USER/perrot-motors.git
git add . && git commit -m "chore: init projet"
git push -u origin main
```

---

## 2. Activer Agent Teams

```bash
# Dans ton shell (ou dans .zshrc / .bashrc)
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Vérifier la version (doit être >= 2.1.32)
claude --version
```

---

## 3. Lancer l'orchestrateur

```bash
cd perrot-motors
claude
```

Une fois Claude Code lancé, tape cette commande naturelle :

```
Lance le sprint 1 de Perrot Motors.

Lis le BACKLOG.md et le CLAUDE.md.

Crée une équipe de 3 agents :
- Agent DEV-1 → implémente US-001 (setup projet), branche feat/US-001-project-setup
- Agent DEV-2 → attend que US-001 soit mergée, puis implémente US-002 (CRUD véhicule)
- Agent DEV-3 → attend que US-001 soit mergée, puis implémente US-005 (CRM clients)

Pour chaque US terminée :
1. Lancer un agent TEST qui vérifie que les critères d'acceptation passent
2. Si les tests passent, lancer un agent REVIEW qui ouvre la PR avec gh
3. M'informer quand une PR est prête
```

---

## 4. Workflow typique d'une US

```
Orchestrateur
    │
    ├── spawn Agent DEV (feat/US-002)
    │       │
    │       ├── git checkout -b feat/US-002-vehicle-crud
    │       ├── Implémente CRUD véhicule selon US
    │       ├── git commit + push
    │       └── Signal "terminé"
    │
    ├── spawn Agent TEST (sur feat/US-002)
    │       │
    │       ├── Lit les critères d'acceptation de l'US
    │       ├── npm run test → vérifie les routes API
    │       ├── Vérifie que le build passe
    │       └── Signal "OK" ou "FAIL + détails"
    │
    └── spawn Agent REVIEW (si TEST OK)
            │
            ├── Lit le diff de la PR
            ├── Vérifie conventions CLAUDE.md
            ├── Vérifie qu'il n'y a pas de `any` TypeScript
            ├── gh pr create --title "feat: US-002 CRUD Véhicule"
            └── Signal "PR #X ouverte"
```

---

## 5. Commandes utiles pendant le sprint

```bash
# Voir les agents actifs
/tasks

# Voir l'avancement des PRs
gh pr list

# Passer sur une branche pour review manuelle
git checkout feat/US-002-vehicle-crud

# Merger une PR validée
gh pr merge 1 --squash

# Relancer un agent qui a planté
# (dans l'interface Claude Code, parle à l'orchestrateur)
"L'agent DEV-2 a planté sur US-002, relance-le sur la même branche"
```

---

## 6. Structure finale attendue après Sprint 1

```
perrot-motors/
├── CLAUDE.md
├── BACKLOG.md
├── docker-compose.yml
├── .env.local.example
├── prisma/
│   └── schema.prisma
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── vehicles/
    │   │   ├── costs/
    │   │   ├── customers/
    │   │   └── registrations/
    │   └── api/
    ├── components/
    │   ├── ui/
    │   └── features/
    └── lib/
        ├── db/
        ├── siv/
        └── auth.ts
```

---

## Conseils

- **Commence par US-001 seul** → valide que le setup marche avant de paralléliser
- **3 agents max en parallèle** pour commencer (scaling progressif)
- **US-002, 004, 005 peuvent tourner en parallèle** une fois US-001 mergée
- **US-003 et 006 dépendent** de US-002 → les lancer après
- Si un agent bugge, dis à l'orchestrateur : "Relance US-X, voici l'erreur : ..."
- Garde un œil sur les tokens : chaque agent a son propre context window
