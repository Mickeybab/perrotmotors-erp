import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById } from "@/lib/db/vehicles";
import VehicleForm from "@/components/features/VehicleForm";
import { updateVehicleAction } from "../../actions";

export default async function EditVehiclePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const action = updateVehicleAction.bind(null, id);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/vehicles/${id}`}
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Retour au véhicule
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Modifier — {vehicle.marque} {vehicle.modele}
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <VehicleForm
          action={action}
          vehicle={vehicle}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  );
}
