"use client";

import { useActionState } from "react";
import type { VehicleFormState } from "@/types/vehicle";
import {
  CARBURANT_LABELS,
  BOITE_LABELS,
  STATUT_LABELS,
  CARROSSERIE_LABELS,
  NORME_EURO_OPTIONS,
  CATEGORIE_VEHICULE_OPTIONS,
} from "@/types/vehicle";
import type { Vehicle } from "@prisma/client";

type Action = (
  prev: VehicleFormState,
  formData: FormData
) => Promise<VehicleFormState>;

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-600">{errors[0]}</p>;
}

function Field({
  label,
  name,
  hint,
  children,
  errors,
  required,
}: {
  label: string;
  name: string;
  hint?: string;
  children: React.ReactNode;
  errors?: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="flex items-baseline gap-1.5 text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-xs font-normal text-zinc-400">{hint}</span>}
      </label>
      <div className="mt-1">{children}</div>
      <FieldError errors={errors} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="col-span-full mb-1 mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
      {children}
    </h2>
  );
}

const inputCls =
  "block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const selectCls =
  "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";

function toDateInput(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function VehicleForm({
  action,
  vehicle,
  submitLabel,
}: {
  action: Action;
  vehicle?: Vehicle;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<VehicleFormState, FormData>(
    action,
    {}
  );
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {state.message && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.message}
        </p>
      )}

      {/* ── IDENTIFICATION ─────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Identification</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Marque" name="marque" required errors={e.marque}>
            <input id="marque" name="marque" required defaultValue={vehicle?.marque ?? ""} className={inputCls} />
          </Field>
          <Field label="Modèle" name="modele" hint="D.3" required errors={e.modele}>
            <input id="modele" name="modele" required defaultValue={vehicle?.modele ?? ""} className={inputCls} />
          </Field>
          <Field label="Version" name="version" hint="D.2" errors={e.version}>
            <input id="version" name="version" defaultValue={vehicle?.version ?? ""} className={inputCls} placeholder="ex : 1.6 TDI 115ch" />
          </Field>
          <Field label="Immatriculation" name="immatriculation" hint="A" errors={e.immatriculation}>
            <input id="immatriculation" name="immatriculation" defaultValue={vehicle?.immatriculation ?? ""} className={inputCls} placeholder="AB-123-CD" />
          </Field>
          <Field label="N° VIN" name="vin" hint="E" errors={e.vin}>
            <input id="vin" name="vin" defaultValue={vehicle?.vin ?? ""} className={inputCls} placeholder="17 caractères" maxLength={17} />
          </Field>
          <Field label="N° formule" name="numeroFormule" errors={e.numeroFormule}>
            <input id="numeroFormule" name="numeroFormule" defaultValue={vehicle?.numeroFormule ?? ""} className={inputCls} placeholder="En haut à droite de la CG" />
          </Field>
          <Field label="Couleur" name="couleur" hint="R" errors={e.couleur}>
            <input id="couleur" name="couleur" defaultValue={vehicle?.couleur ?? ""} className={inputCls} />
          </Field>
          <Field label="Année modèle" name="annee" required errors={e.annee}>
            <input id="annee" name="annee" type="number" required min={1900} max={2100} defaultValue={vehicle?.annee ?? new Date().getFullYear()} className={inputCls} />
          </Field>
          <Field label="1ère mise en circulation" name="datePremiereCirculation" hint="B" errors={e.datePremiereCirculation}>
            <input id="datePremiereCirculation" name="datePremiereCirculation" type="date" defaultValue={toDateInput(vehicle?.datePremiereCirculation)} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* ── CATÉGORIE & CARROSSERIE ────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Catégorie & carrosserie</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Catégorie EU" name="categorieVehicule" hint="J" errors={e.categorieVehicule}>
            <select id="categorieVehicule" name="categorieVehicule" className={selectCls} defaultValue={vehicle?.categorieVehicule ?? ""}>
              <option value="">— Sélectionner —</option>
              {CATEGORIE_VEHICULE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Carrosserie" name="carrosserie" hint="J.1" errors={e.carrosserie}>
            <select id="carrosserie" name="carrosserie" className={selectCls} defaultValue={vehicle?.carrosserie ?? ""}>
              <option value="">— Sélectionner —</option>
              {Object.entries(CARROSSERIE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Nb portes" name="nbPortes" errors={e.nbPortes}>
            <input id="nbPortes" name="nbPortes" type="number" min={2} max={9} defaultValue={vehicle?.nbPortes ?? ""} className={inputCls} />
          </Field>
          <Field label="Nb places assises" name="nombrePlaces" hint="S.1" errors={e.nombrePlaces}>
            <input id="nombrePlaces" name="nombrePlaces" type="number" min={1} max={100} defaultValue={vehicle?.nombrePlaces ?? ""} className={inputCls} placeholder="Conducteur inclus" />
          </Field>
          <Field label="Nb places debout" name="nombrePlacesDebout" hint="S.2" errors={e.nombrePlacesDebout}>
            <input id="nombrePlacesDebout" name="nombrePlacesDebout" type="number" min={0} defaultValue={vehicle?.nombrePlacesDebout ?? ""} className={inputCls} />
          </Field>
          <Field label="N° réception" name="numeroReception" hint="K" errors={e.numeroReception}>
            <input id="numeroReception" name="numeroReception" defaultValue={vehicle?.numeroReception ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* ── MOTORISATION ──────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Motorisation</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Carburant" name="carburant" hint="P.3" required errors={e.carburant}>
            <select id="carburant" name="carburant" required className={selectCls} defaultValue={vehicle?.carburant ?? "ESSENCE"}>
              {Object.entries(CARBURANT_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Boîte" name="boite" required errors={e.boite}>
            <select id="boite" name="boite" required className={selectCls} defaultValue={vehicle?.boite ?? "MANUELLE"}>
              {Object.entries(BOITE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Cylindrée (cm³)" name="cylindree" hint="P.1" errors={e.cylindree}>
            <input id="cylindree" name="cylindree" type="number" min={0} defaultValue={vehicle?.cylindree ?? ""} className={inputCls} placeholder="ex : 1598" />
          </Field>
          <Field label="Puissance kW" name="puissanceKw" hint="P.2" errors={e.puissanceKw}>
            <input id="puissanceKw" name="puissanceKw" type="number" min={0} defaultValue={vehicle?.puissanceKw ?? ""} className={inputCls} />
          </Field>
          <Field label="Puissance DIN (ch)" name="puissanceCv" errors={e.puissanceCv}>
            <input id="puissanceCv" name="puissanceCv" type="number" min={0} defaultValue={vehicle?.puissanceCv ?? ""} className={inputCls} placeholder="Chevaux DIN" />
          </Field>
          <Field label="Puissance fiscale (CV)" name="puissanceFiscale" hint="P.4" errors={e.puissanceFiscale}>
            <input id="puissanceFiscale" name="puissanceFiscale" type="number" min={0} defaultValue={vehicle?.puissanceFiscale ?? ""} className={inputCls} placeholder="Chevaux fiscaux" />
          </Field>
          <Field label="N° moteur" name="numeroMoteur" hint="P.5" errors={e.numeroMoteur}>
            <input id="numeroMoteur" name="numeroMoteur" defaultValue={vehicle?.numeroMoteur ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* ── MASSES & DIMENSIONS ───────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Masses & dimensions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Poids à vide (kg)" name="poidsVide" hint="G" errors={e.poidsVide}>
            <input id="poidsVide" name="poidsVide" type="number" min={0} defaultValue={vehicle?.poidsVide ?? ""} className={inputCls} />
          </Field>
          <Field label="PTAC (kg)" name="ptac" hint="F.1" errors={e.ptac}>
            <input id="ptac" name="ptac" type="number" min={0} defaultValue={vehicle?.ptac ?? ""} className={inputCls} placeholder="Masse totale autorisée en charge" />
          </Field>
          <Field label="PTRA (kg)" name="ptra" hint="F.3" errors={e.ptra}>
            <input id="ptra" name="ptra" type="number" min={0} defaultValue={vehicle?.ptra ?? ""} className={inputCls} placeholder="Masse totale roulante autorisée" />
          </Field>
          <Field label="Empattement (mm)" name="empattement" hint="M" errors={e.empattement}>
            <input id="empattement" name="empattement" type="number" min={0} defaultValue={vehicle?.empattement ?? ""} className={inputCls} />
          </Field>
          <Field label="Nombre d'essieux" name="nombreEssieux" hint="L" errors={e.nombreEssieux}>
            <input id="nombreEssieux" name="nombreEssieux" type="number" min={1} max={10} defaultValue={vehicle?.nombreEssieux ?? ""} className={inputCls} />
          </Field>
          <Field label="Vitesse max (km/h)" name="vitesseMax" hint="T" errors={e.vitesseMax}>
            <input id="vitesseMax" name="vitesseMax" type="number" min={0} defaultValue={vehicle?.vitesseMax ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* ── ÉMISSIONS ─────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Émissions & environnement</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="CO₂ (g/km)" name="co2" hint="V.7" errors={e.co2}>
            <input id="co2" name="co2" type="number" min={0} defaultValue={vehicle?.co2 ?? ""} className={inputCls} />
          </Field>
          <Field label="Norme antipollution" name="normeEuro" hint="V.9" errors={e.normeEuro}>
            <select id="normeEuro" name="normeEuro" className={selectCls} defaultValue={vehicle?.normeEuro ?? ""}>
              <option value="">— Sélectionner —</option>
              {NORME_EURO_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* ── KILOMÉTRAGE & SUIVI ───────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Kilométrage & suivi</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Kilométrage" name="kilometrage" required errors={e.kilometrage}>
            <input id="kilometrage" name="kilometrage" type="number" required min={0} defaultValue={vehicle?.kilometrage ?? 0} className={inputCls} />
          </Field>
          <Field label="Date d'achat" name="dateAchat" required errors={e.dateAchat}>
            <input id="dateAchat" name="dateAchat" type="date" required defaultValue={toDateInput(vehicle?.dateAchat) || new Date().toISOString().split("T")[0]} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* ── COMMERCIAL ────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Commercial</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Prix d'achat (€)" name="prixAchat" required errors={e.prixAchat}>
            <input id="prixAchat" name="prixAchat" type="number" required min={0} step={0.01} defaultValue={vehicle?.prixAchat ?? ""} className={inputCls} />
          </Field>
          <Field label="Prix de vente (€)" name="prixVente" errors={e.prixVente}>
            <input id="prixVente" name="prixVente" type="number" min={0} step={0.01} defaultValue={vehicle?.prixVente ?? ""} className={inputCls} />
          </Field>
          <Field label="Statut" name="statut" required errors={e.statut}>
            <select id="statut" name="statut" required className={selectCls} defaultValue={vehicle?.statut ?? "EN_STOCK"}>
              {Object.entries(STATUT_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* ── NOTES ─────────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700">Notes internes</h3>
        <textarea
          id="notesInternes"
          name="notesInternes"
          rows={3}
          defaultValue={vehicle?.notesInternes ?? ""}
          className={inputCls}
          placeholder="Observations, historique, travaux à prévoir…"
        />
        <FieldError errors={e.notesInternes} />
      </section>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {isPending ? "Enregistrement…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
