import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById } from "@/lib/db/vehicles";
import StatusBadge from "@/components/features/StatusBadge";
import VehicleDetailActions from "./VehicleDetailActions";
import {
  CARBURANT_LABELS,
  BOITE_LABELS,
  CARROSSERIE_LABELS,
} from "@/types/vehicle";

function fmt(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}
function fmtEur(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function Row({ label, value, hint }: { label: string; value?: string | number | null; hint?: string }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-100 py-2 last:border-0">
      <dt className="flex items-baseline gap-1.5 text-sm text-zinc-500">
        {label}
        {hint && <span className="text-xs text-zinc-400">{hint}</span>}
      </dt>
      <dd className="text-sm font-medium text-zinc-900 text-right">{String(value)}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">{title}</h2>
      <dl>{children}</dl>
    </div>
  );
}

export default async function VehicleDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const totalCosts = vehicle.costs.reduce((sum, c) => sum + c.montant, 0);
  const marge = vehicle.prixVente != null ? vehicle.prixVente - vehicle.prixAchat - totalCosts : null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link href="/vehicles" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← Retour aux véhicules
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            {vehicle.marque} {vehicle.modele}
            {vehicle.version && (
              <span className="ml-2 text-lg font-normal text-zinc-500">{vehicle.version}</span>
            )}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge statut={vehicle.statut} />
            {vehicle.immatriculation && (
              <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700">
                {vehicle.immatriculation}
              </span>
            )}
            {vehicle.annee && (
              <span className="text-sm text-zinc-500">{vehicle.annee}</span>
            )}
            {vehicle.kilometrage != null && (
              <span className="text-sm text-zinc-500">{fmt(vehicle.kilometrage)} km</span>
            )}
          </div>
        </div>
        <VehicleDetailActions vehicleId={id} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Photo */}
        <div className="lg:col-span-1">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            {vehicle.photos[0] ? (
              <img src={vehicle.photos[0].url} alt={`${vehicle.marque} ${vehicle.modele}`} className="h-full w-full object-cover" />
            ) : (
              <span className="text-5xl text-zinc-300">🚗</span>
            )}
          </div>
        </div>

        {/* Colonnes d'infos */}
        <div className="space-y-4 lg:col-span-2">

          {/* Identification */}
          <Card title="Identification">
            <Row label="Marque" value={vehicle.marque} />
            <Row label="Modèle" value={vehicle.modele} hint="D.3" />
            <Row label="Version" value={vehicle.version} hint="D.2" />
            <Row label="Immatriculation" value={vehicle.immatriculation} hint="A" />
            <Row label="N° VIN" value={vehicle.vin} hint="E" />
            <Row label="N° formule" value={vehicle.numeroFormule} />
            <Row label="Couleur" value={vehicle.couleur} hint="R" />
            <Row label="Année" value={vehicle.annee} />
            <Row label="1ère mise en circulation" hint="B"
              value={vehicle.datePremiereCirculation
                ? new Date(vehicle.datePremiereCirculation).toLocaleDateString("fr-FR")
                : null} />
          </Card>

          {/* Catégorie */}
          <Card title="Catégorie & carrosserie">
            <Row label="Catégorie EU" value={vehicle.categorieVehicule} hint="J" />
            <Row label="Carrosserie" hint="J.1"
              value={vehicle.carrosserie ? CARROSSERIE_LABELS[vehicle.carrosserie] : null} />
            <Row label="Nb portes" value={vehicle.nbPortes} />
            <Row label="Nb places assises" value={vehicle.nombrePlaces} hint="S.1" />
            <Row label="Nb places debout" value={vehicle.nombrePlacesDebout} hint="S.2" />
            <Row label="N° réception" value={vehicle.numeroReception} hint="K" />
          </Card>

          {/* Motorisation */}
          <Card title="Motorisation">
            <Row label="Carburant" hint="P.3" value={CARBURANT_LABELS[vehicle.carburant]} />
            <Row label="Boîte" value={BOITE_LABELS[vehicle.boite]} />
            <Row label="Cylindrée" hint="P.1" value={vehicle.cylindree ? `${fmt(vehicle.cylindree)} cm³` : null} />
            <Row label="Puissance" hint="P.2" value={vehicle.puissanceKw ? `${vehicle.puissanceKw} kW` : null} />
            <Row label="Puissance DIN" value={vehicle.puissanceCv ? `${vehicle.puissanceCv} ch` : null} />
            <Row label="Puissance fiscale" hint="P.4" value={vehicle.puissanceFiscale ? `${vehicle.puissanceFiscale} CV` : null} />
            <Row label="N° moteur" hint="P.5" value={vehicle.numeroMoteur} />
          </Card>

          {/* Masses */}
          <Card title="Masses & dimensions">
            <Row label="Poids à vide" hint="G" value={vehicle.poidsVide ? `${fmt(vehicle.poidsVide)} kg` : null} />
            <Row label="PTAC" hint="F.1" value={vehicle.ptac ? `${fmt(vehicle.ptac)} kg` : null} />
            <Row label="PTRA" hint="F.3" value={vehicle.ptra ? `${fmt(vehicle.ptra)} kg` : null} />
            <Row label="Empattement" hint="M" value={vehicle.empattement ? `${fmt(vehicle.empattement)} mm` : null} />
            <Row label="Nombre d'essieux" hint="L" value={vehicle.nombreEssieux} />
            <Row label="Vitesse max" hint="T" value={vehicle.vitesseMax ? `${vehicle.vitesseMax} km/h` : null} />
          </Card>

          {/* Émissions */}
          <Card title="Émissions & environnement">
            <Row label="CO₂" hint="V.7" value={vehicle.co2 ? `${vehicle.co2} g/km` : null} />
            <Row label="Norme antipollution" hint="V.9" value={vehicle.normeEuro} />
          </Card>

          {/* Commercial */}
          <Card title="Commercial">
            <Row label="Kilométrage" value={`${fmt(vehicle.kilometrage)} km`} />
            <Row label="Prix d'achat" value={fmtEur(vehicle.prixAchat)} />
            <Row label="Prix de vente" value={vehicle.prixVente != null ? fmtEur(vehicle.prixVente) : "Non défini"} />
            <Row label="Marge brute" value={marge != null ? fmtEur(marge) : "—"} />
            <Row label="Date d'achat" value={new Date(vehicle.dateAchat).toLocaleDateString("fr-FR")} />
            {vehicle.dateVente && (
              <Row label="Date de vente" value={new Date(vehicle.dateVente).toLocaleDateString("fr-FR")} />
            )}
          </Card>

          {vehicle.notesInternes && (
            <Card title="Notes internes">
              <p className="text-sm text-zinc-700 whitespace-pre-line">{vehicle.notesInternes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
