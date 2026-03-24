# BACKLOG — PERROT MOTORS DMS
## Sprint 1 — MVP

---

## US-001 — Setup projet
**Branche :** `feat/US-001-project-setup`
**Priorité :** 🔴 Critique (bloquant pour toutes les autres)
**Estimation :** 3h

### Description
En tant que dev, je veux un projet Next.js fonctionnel avec toute la stack configurée, pour pouvoir démarrer le développement immédiatement.

### Critères d'acceptation
- [ ] Next.js 15 (App Router) initialisé avec TypeScript strict
- [ ] Tailwind CSS configuré
- [ ] Prisma configuré + connexion PostgreSQL via Docker
- [ ] Fichier `.env.local.example` documenté
- [ ] `docker-compose.yml` avec PostgreSQL 16
- [ ] `npm run dev` démarre sans erreur
- [ ] Auth basique avec NextAuth.js (credentials provider, 1 user admin en seed)
- [ ] Layout principal avec sidebar nav (Véhicules, Coûts, Clients, Carte grise)
- [ ] Page d'accueil dashboard vide

### Fichiers à créer
- `docker-compose.yml`
- `prisma/schema.prisma` (schema complet, voir US suivantes)
- `src/app/layout.tsx`
- `src/components/ui/Sidebar.tsx`
- `src/lib/auth.ts`
- `.env.local.example`

---

## US-002 — CRUD Véhicule
**Branche :** `feat/US-002-vehicle-crud`
**Priorité :** 🔴 Critique
**Dépend de :** US-001
**Estimation :** 4h

### Description
En tant que gestionnaire Perrot Motors, je veux pouvoir créer, consulter, modifier et supprimer un véhicule dans le stock.

### Critères d'acceptation
- [ ] Liste des véhicules en stock avec colonnes : miniature, marque/modèle, année, km, prix vente, statut, marge
- [ ] Filtres : statut, marque, année min/max, prix max
- [ ] Formulaire de création (tous les champs obligatoires validés avec Zod)
- [ ] Page détail véhicule
- [ ] Formulaire d'édition
- [ ] Suppression avec confirmation
- [ ] Changement de statut rapide (dropdown inline)
- [ ] Routes API : `GET/POST /api/vehicles`, `GET/PUT/DELETE /api/vehicles/[id]`

### Champs véhicule
```
VIN, immatriculation, marque, modèle, version, année, kilométrage,
couleur, carburant (essence/diesel/hybride/électrique/autre),
boîte (manuelle/automatique), nb_portes, puissance_cv, puissance_kw,
prix_achat, prix_vente, statut, notes_internes, date_achat, date_vente
```

### Fichiers à créer
- `src/app/(auth)/vehicles/page.tsx`
- `src/app/(auth)/vehicles/[id]/page.tsx`
- `src/app/(auth)/vehicles/new/page.tsx`
- `src/app/api/vehicles/route.ts`
- `src/app/api/vehicles/[id]/route.ts`
- `src/components/features/VehicleCard.tsx`
- `src/components/features/VehicleForm.tsx`
- `src/lib/db/vehicles.ts`
- `src/types/vehicle.ts`

---

## US-003 — Upload photos véhicule
**Branche :** `feat/US-003-vehicle-photos`
**Priorité :** 🟠 Haute
**Dépend de :** US-002
**Estimation :** 3h

### Description
En tant que gestionnaire, je veux uploader plusieurs photos d'un véhicule, définir une photo principale, et les réordonner.

### Critères d'acceptation
- [ ] Upload multi-fichiers (max 20 photos, max 5MB par photo, formats jpg/png/webp)
- [ ] Galerie photos sur la page détail véhicule
- [ ] Drag & drop pour réordonner
- [ ] Définir photo principale (utilisée en miniature dans la liste)
- [ ] Suppression photo individuelle avec confirmation
- [ ] Stockage : `/public/uploads/vehicles/{vehicleId}/` en dev
- [ ] Miniatures auto-générées (sharp)
- [ ] Route API : `POST/DELETE /api/vehicles/[id]/photos`

### Fichiers à créer
- `src/app/api/vehicles/[id]/photos/route.ts`
- `src/components/features/PhotoGallery.tsx`
- `src/components/features/PhotoUploader.tsx`
- `src/lib/storage.ts`

---

## US-004 — Module coûts et marges
**Branche :** `feat/US-004-costs-margins`
**Priorité :** 🔴 Critique
**Dépend de :** US-002
**Estimation :** 4h

### Description
En tant que gestionnaire, je veux suivre tous les coûts liés à un véhicule et voir la marge calculée automatiquement.

### Critères d'acceptation
- [ ] Liste des coûts par véhicule (onglet sur page détail)
- [ ] Types de coûts : `ACHAT | TRANSPORT | REPARATION | CONTROLE_TECHNIQUE | CARTE_GRISE | COMMISSION | AUTRE`
- [ ] Ajout/édition/suppression d'un coût (description, montant, date, facture optionnelle)
- [ ] Calcul automatique : total coûts, marge brute (€ et %), marge nette
- [ ] Widget synthèse marge sur la liste véhicules (badge coloré : vert > 15%, orange 5-15%, rouge < 5%)
- [ ] Dashboard coûts : total investi, total récupéré, marge globale du stock
- [ ] Routes API : `GET/POST /api/vehicles/[id]/costs`, `DELETE /api/costs/[id]`

### Fichiers à créer
- `src/app/(auth)/costs/page.tsx` (dashboard global)
- `src/app/api/vehicles/[id]/costs/route.ts`
- `src/app/api/costs/[id]/route.ts`
- `src/components/features/CostsList.tsx`
- `src/components/features/CostForm.tsx`
- `src/components/features/MarginBadge.tsx`
- `src/lib/db/costs.ts`

---

## US-005 — CRM Clients
**Branche :** `feat/US-005-crm-customers`
**Priorité :** 🟠 Haute
**Dépend de :** US-001
**Estimation :** 3h

### Description
En tant que gestionnaire, je veux gérer une fiche client et voir l'historique de ses achats.

### Critères d'acceptation
- [ ] Liste clients (nom, type particulier/pro, téléphone, nb véhicules achetés, CA total)
- [ ] Fiche client : infos personnelles/pro, adresse
- [ ] Section "Véhicules achetés" sur la fiche (liaison avec table véhicule via vente)
- [ ] Champ notes libres sur la fiche
- [ ] Recherche client par nom/téléphone/email
- [ ] Routes API : `GET/POST /api/customers`, `GET/PUT /api/customers/[id]`

### Champs client
```
type (particulier/professionnel), civilité, prénom, nom, société (si pro),
SIRET (si pro), email, téléphone, adresse, code_postal, ville, notes
```

### Fichiers à créer
- `src/app/(auth)/customers/page.tsx`
- `src/app/(auth)/customers/[id]/page.tsx`
- `src/app/(auth)/customers/new/page.tsx`
- `src/app/api/customers/route.ts`
- `src/app/api/customers/[id]/route.ts`
- `src/components/features/CustomerCard.tsx`
- `src/components/features/CustomerForm.tsx`
- `src/lib/db/customers.ts`

---

## US-006 — Workflow Carte Grise / SIV
**Branche :** `feat/US-006-registration-workflow`
**Priorité :** 🟠 Haute
**Dépend de :** US-002, US-005
**Estimation :** 4h

### Description
En tant que gestionnaire, je veux suivre l'état des démarches de carte grise pour chaque véhicule vendu et savoir quels documents sont nécessaires.

### Critères d'acceptation
- [ ] Déclenchement du workflow carte grise lors du passage statut → VENDU
- [ ] Checklist dynamique de documents selon type transaction (achat/vente, véhicule neuf/occasion, particulier/pro)
- [ ] Statuts dossier : `A_CONSTITUER | DEPOSE | EN_ATTENTE_ANTS | OBTENU | BLOQUE`
- [ ] Champ date dépôt, date obtention, numéro de dossier ANTS
- [ ] Notes / historique du suivi
- [ ] Alerte visuelle sur les dossiers bloqués > 30 jours
- [ ] Export PDF récapitulatif dossier (liste documents, infos véhicule, infos client)
- [ ] Routes API : `GET/POST /api/registrations`, `GET/PUT /api/registrations/[id]`

### Documents checklist (selon contexte)
```
Vente à particulier : CG barrée + signature, certificat de cession, contrôle technique,
                      pièce identité acheteur, justificatif domicile, mandat si mandataire
Vente à pro         : + Kbis, numéro SIRET
Véhicule importé    : + certificat de conformité européen, quitus fiscal
```

### Fichiers à créer
- `src/app/(auth)/registrations/page.tsx`
- `src/app/(auth)/registrations/[id]/page.tsx`
- `src/app/api/registrations/route.ts`
- `src/app/api/registrations/[id]/route.ts`
- `src/components/features/RegistrationChecklist.tsx`
- `src/components/features/RegistrationStatusBadge.tsx`
- `src/lib/siv/checklist.ts`
- `src/lib/siv/pdf-generator.ts`

---

## Schema Prisma (à créer dans US-001)

```prisma
model Vehicle {
  id              String   @id @default(cuid())
  vin             String?  @unique
  immatriculation String?
  marque          String
  modele          String
  version         String?
  annee           Int
  kilometrage     Int
  couleur         String?
  carburant       Carburant @default(ESSENCE)
  boite           Boite     @default(MANUELLE)
  nbPortes        Int?
  puissanceCv     Int?
  prixAchat       Float
  prixVente       Float?
  statut          VehicleStatus @default(EN_STOCK)
  notesInternes   String?
  dateAchat       DateTime @default(now())
  dateVente       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  photos          VehiclePhoto[]
  costs           VehicleCost[]
  registration    Registration?
  sale            Sale?
}

model VehiclePhoto {
  id          String   @id @default(cuid())
  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  url         String
  thumbUrl    String?
  isPrimary   Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model VehicleCost {
  id          String    @id @default(cuid())
  vehicleId   String
  vehicle     Vehicle   @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  type        CostType
  description String
  montant     Float
  date        DateTime  @default(now())
  factureUrl  String?
  createdAt   DateTime  @default(now())
}

model Customer {
  id          String       @id @default(cuid())
  type        CustomerType @default(PARTICULIER)
  civilite    String?
  prenom      String?
  nom         String
  societe     String?
  siret       String?
  email       String?
  telephone   String?
  adresse     String?
  codePostal  String?
  ville       String?
  notes       String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  sales       Sale[]
}

model Sale {
  id           String    @id @default(cuid())
  vehicleId    String    @unique
  vehicle      Vehicle   @relation(fields: [vehicleId], references: [id])
  customerId   String
  customer     Customer  @relation(fields: [customerId], references: [id])
  prixVente    Float
  dateVente    DateTime  @default(now())
  registration Registration?
}

model Registration {
  id              String             @id @default(cuid())
  vehicleId       String             @unique
  vehicle         Vehicle            @relation(fields: [vehicleId], references: [id])
  saleId          String?            @unique
  sale            Sale?              @relation(fields: [saleId], references: [id])
  statut          RegistrationStatus @default(A_CONSTITUER)
  numeroDossier   String?
  dateDepot       DateTime?
  dateObtention   DateTime?
  notes           String?
  documentsJson   Json?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
}

enum VehicleStatus {
  EN_STOCK
  EN_VENTE
  RESERVE
  VENDU
  EN_REPARATION
}

enum Carburant {
  ESSENCE
  DIESEL
  HYBRIDE
  ELECTRIQUE
  AUTRE
}

enum Boite {
  MANUELLE
  AUTOMATIQUE
}

enum CostType {
  ACHAT
  TRANSPORT
  REPARATION
  CONTROLE_TECHNIQUE
  CARTE_GRISE
  COMMISSION
  AUTRE
}

enum CustomerType {
  PARTICULIER
  PROFESSIONNEL
}

enum RegistrationStatus {
  A_CONSTITUER
  DEPOSE
  EN_ATTENTE_ANTS
  OBTENU
  BLOQUE
}
```
