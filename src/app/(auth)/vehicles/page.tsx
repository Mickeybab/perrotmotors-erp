import Link from "next/link";
import { getVehicles, getMarques } from "@/lib/db/vehicles";
import VehicleCard from "@/components/features/VehicleCard";
import { STATUT_LABELS } from "@/types/vehicle";
import type { VehicleStatus } from "@prisma/client";

const ALL_STATUTS: VehicleStatus[] = [
  "EN_STOCK",
  "EN_VENTE",
  "RESERVE",
  "VENDU",
  "EN_REPARATION",
];

export default async function VehiclesPage(props: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await props.searchParams;

  const filters = {
    statut: (sp.statut as VehicleStatus) || undefined,
    marque: (sp.marque as string) || undefined,
    anneeMin: sp.anneeMin ? Number(sp.anneeMin) : undefined,
    anneeMax: sp.anneeMax ? Number(sp.anneeMax) : undefined,
    prixMax: sp.prixMax ? Number(sp.prixMax) : undefined,
  };

  const [vehicles, marques] = await Promise.all([
    getVehicles(filters),
    getMarques(),
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Véhicules</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {vehicles.length} véhicule{vehicles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/vehicles/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Ajouter
        </Link>
      </div>

      {/* Filtres */}
      <form method="GET" className="mb-6 flex flex-wrap gap-3">
        <select
          name="statut"
          defaultValue={sp.statut ?? ""}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <option value="">Tous les statuts</option>
          {ALL_STATUTS.map((s) => (
            <option key={s} value={s}>
              {STATUT_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          name="marque"
          defaultValue={sp.marque ?? ""}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <option value="">Toutes les marques</option>
          {marques.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="anneeMin"
          defaultValue={sp.anneeMin ?? ""}
          placeholder="Année min"
          className="w-28 rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        <input
          type="number"
          name="anneeMax"
          defaultValue={sp.anneeMax ?? ""}
          placeholder="Année max"
          className="w-28 rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        <input
          type="number"
          name="prixMax"
          defaultValue={sp.prixMax ?? ""}
          placeholder="Prix max (€)"
          className="w-36 rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />

        <button
          type="submit"
          className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
        >
          Filtrer
        </button>
        <Link
          href="/vehicles"
          className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900"
        >
          Réinitialiser
        </Link>
      </form>

      {/* Table */}
      {vehicles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center">
          <p className="text-zinc-500">Aucun véhicule trouvé.</p>
          <Link href="/vehicles/new" className="mt-2 block text-sm text-zinc-900 underline">
            Ajouter le premier véhicule
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-500">Photo</th>
                <th className="px-4 py-3 font-medium text-zinc-500">Véhicule</th>
                <th className="px-4 py-3 font-medium text-zinc-500">Année</th>
                <th className="px-4 py-3 font-medium text-zinc-500">Km</th>
                <th className="px-4 py-3 font-medium text-zinc-500">Prix vente</th>
                <th className="px-4 py-3 font-medium text-zinc-500">Statut</th>
                <th className="px-4 py-3 font-medium text-zinc-500">Marge</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
