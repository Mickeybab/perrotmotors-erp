import { z } from "zod";
import type {
  Vehicle,
  VehicleStatus,
  Carburant,
  Boite,
  Carrosserie,
} from "@prisma/client";

export type { Vehicle, VehicleStatus, Carburant, Boite, Carrosserie };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const optionalInt = z.coerce
  .number()
  .int()
  .min(0)
  .optional()
  .nullable()
  .transform((v) => (v === 0 || v == null ? null : v));

const optionalPositiveFloat = z.coerce
  .number()
  .positive()
  .optional()
  .nullable()
  .transform((v) => (v == null ? null : v));

// ─── Zod schemas ─────────────────────────────────────────────────────────────

export const VehicleCreateSchema = z.object({
  // Identification
  vin: z.string().trim().optional(),
  immatriculation: z.string().trim().optional(),
  numeroFormule: z.string().trim().optional(),
  marque: z.string().trim().min(1, "Marque requise"),
  modele: z.string().trim().min(1, "Modèle requis"),
  version: z.string().trim().optional(),
  annee: z.coerce.number().int().min(1900).max(2100),
  couleur: z.string().trim().optional(),
  datePremiereCirculation: z.coerce.date().optional().nullable(),

  // Catégorie & carrosserie
  categorieVehicule: z.string().trim().optional(),
  carrosserie: z
    .enum([
      "BERLINE",
      "BREAK",
      "SUV",
      "COUPE",
      "CABRIOLET",
      "MONOSPACE",
      "UTILITAIRE",
      "CAMIONNETTE",
      "PICKUP",
      "AUTRE",
    ])
    .optional()
    .nullable(),
  nbPortes: optionalInt,

  // Motorisation
  carburant: z.enum([
    "ESSENCE",
    "DIESEL",
    "HYBRIDE",
    "ELECTRIQUE",
    "HYDROGENE",
    "AUTRE",
  ]),
  boite: z.enum(["MANUELLE", "AUTOMATIQUE"]),
  cylindree: optionalInt,
  puissanceKw: optionalInt,
  puissanceCv: optionalInt,
  puissanceFiscale: optionalInt,
  numeroMoteur: z.string().trim().optional(),

  // Masses
  ptac: optionalInt,
  ptra: optionalInt,
  poidsVide: optionalInt,

  // Dimensions & essieux
  empattement: optionalInt,
  nombreEssieux: optionalInt,

  // Capacité
  nombrePlaces: optionalInt,
  nombrePlacesDebout: optionalInt,

  // Performances
  vitesseMax: optionalInt,
  kilometrage: z.coerce.number().int().min(0),

  // Émissions
  co2: optionalInt,
  normeEuro: z.string().trim().optional(),

  // Réception
  numeroReception: z.string().trim().optional(),

  // Commercial
  prixAchat: z.coerce.number().positive("Prix d'achat requis"),
  prixVente: optionalPositiveFloat,
  statut: z.enum([
    "EN_STOCK",
    "EN_VENTE",
    "RESERVE",
    "VENDU",
    "EN_REPARATION",
  ]),
  notesInternes: z.string().trim().optional(),
  dateAchat: z.coerce.date(),
});

export const VehicleUpdateSchema = VehicleCreateSchema.partial();

export const VehicleStatusSchema = z.enum([
  "EN_STOCK",
  "EN_VENTE",
  "RESERVE",
  "VENDU",
  "EN_REPARATION",
]);

export type VehicleCreateInput = z.infer<typeof VehicleCreateSchema>;
export type VehicleUpdateInput = z.infer<typeof VehicleUpdateSchema>;

// ─── Form state ───────────────────────────────────────────────────────────────

export type VehicleFormState = {
  errors?: Partial<Record<keyof VehicleCreateInput, string[]>>;
  message?: string;
};

// ─── UI labels ───────────────────────────────────────────────────────────────

export const STATUT_LABELS: Record<VehicleStatus, string> = {
  EN_STOCK: "En stock",
  EN_VENTE: "En vente",
  RESERVE: "Réservé",
  VENDU: "Vendu",
  EN_REPARATION: "En réparation",
};

export const STATUT_COLORS: Record<VehicleStatus, string> = {
  EN_STOCK: "bg-blue-100 text-blue-800",
  EN_VENTE: "bg-green-100 text-green-800",
  RESERVE: "bg-yellow-100 text-yellow-800",
  VENDU: "bg-zinc-100 text-zinc-600",
  EN_REPARATION: "bg-orange-100 text-orange-800",
};

export const CARBURANT_LABELS: Record<Carburant, string> = {
  ESSENCE: "Essence",
  DIESEL: "Diesel",
  HYBRIDE: "Hybride",
  ELECTRIQUE: "Électrique",
  HYDROGENE: "Hydrogène",
  AUTRE: "Autre",
};

export const BOITE_LABELS: Record<Boite, string> = {
  MANUELLE: "Manuelle",
  AUTOMATIQUE: "Automatique",
};

export const CARROSSERIE_LABELS: Record<Carrosserie, string> = {
  BERLINE: "Berline",
  BREAK: "Break",
  SUV: "SUV / 4×4",
  COUPE: "Coupé",
  CABRIOLET: "Cabriolet",
  MONOSPACE: "Monospace",
  UTILITAIRE: "Utilitaire",
  CAMIONNETTE: "Camionnette",
  PICKUP: "Pick-up",
  AUTRE: "Autre",
};

export const NORME_EURO_OPTIONS = [
  "Euro 6d",
  "Euro 6d-TEMP",
  "Euro 6c",
  "Euro 6b",
  "Euro 6",
  "Euro 5b",
  "Euro 5a",
  "Euro 5",
  "Euro 4",
  "Euro 3",
  "Euro 2",
  "Euro 1",
];

export const CATEGORIE_VEHICULE_OPTIONS = [
  { value: "M1", label: "M1 — Voiture particulière (≤ 8 places)" },
  { value: "M2", label: "M2 — Minibus (> 8 places, ≤ 5t)" },
  { value: "M3", label: "M3 — Autocar / autobus (> 5t)" },
  { value: "N1", label: "N1 — Véhicule utilitaire léger (≤ 3,5t)" },
  { value: "N2", label: "N2 — Poids lourd (3,5t – 12t)" },
  { value: "N3", label: "N3 — Poids lourd (> 12t)" },
  { value: "L1e", label: "L1e — Cyclomoteur 2 roues" },
  { value: "L3e", label: "L3e — Motocyclette" },
  { value: "L5e", label: "L5e — Tricycle à moteur" },
];
