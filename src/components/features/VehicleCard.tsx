import Link from "next/link";
import StatusBadge from "./StatusBadge";
import StatusSelect from "./StatusSelect";
import type { Vehicle, VehiclePhoto, VehicleCost } from "@prisma/client";

type VehicleWithExtras = Vehicle & {
  photos: VehiclePhoto[];
  costs: { montant: number }[];
};

function formatEur(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatKm(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " km";
}

export default function VehicleCard({ vehicle }: { vehicle: VehicleWithExtras }) {
  const totalCosts = vehicle.costs.reduce((sum, c) => sum + c.montant, 0);
  const marge =
    vehicle.prixVente != null
      ? vehicle.prixVente - vehicle.prixAchat - totalCosts
      : null;

  return (
    <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
      {/* Miniature */}
      <td className="px-4 py-3">
        <div className="h-12 w-16 overflow-hidden rounded bg-zinc-100 flex items-center justify-center">
          {vehicle.photos[0] ? (
            <img
              src={vehicle.photos[0].thumbUrl ?? vehicle.photos[0].url}
              alt={`${vehicle.marque} ${vehicle.modele}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl text-zinc-300">🚗</span>
          )}
        </div>
      </td>

      {/* Marque / Modèle */}
      <td className="px-4 py-3">
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="font-medium text-zinc-900 hover:underline"
        >
          {vehicle.marque} {vehicle.modele}
        </Link>
        {vehicle.version && (
          <p className="text-xs text-zinc-500">{vehicle.version}</p>
        )}
      </td>

      {/* Année */}
      <td className="px-4 py-3 text-sm text-zinc-700">{vehicle.annee}</td>

      {/* Kilométrage */}
      <td className="px-4 py-3 text-sm text-zinc-700">
        {formatKm(vehicle.kilometrage)}
      </td>

      {/* Prix vente */}
      <td className="px-4 py-3 text-sm text-zinc-700">
        {vehicle.prixVente != null ? formatEur(vehicle.prixVente) : "—"}
      </td>

      {/* Statut */}
      <td className="px-4 py-3">
        <StatusSelect vehicleId={vehicle.id} currentStatut={vehicle.statut} />
      </td>

      {/* Marge */}
      <td className="px-4 py-3 text-sm font-medium">
        {marge != null ? (
          <span className={marge >= 0 ? "text-green-700" : "text-red-600"}>
            {formatEur(marge)}
          </span>
        ) : (
          <span className="text-zinc-400">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          Voir →
        </Link>
      </td>
    </tr>
  );
}
