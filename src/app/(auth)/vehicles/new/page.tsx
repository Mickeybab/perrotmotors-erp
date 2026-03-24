import Link from "next/link";
import VehicleForm from "@/components/features/VehicleForm";
import { createVehicleAction } from "../actions";

export default function NewVehiclePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/vehicles" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Retour aux véhicules
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Nouveau véhicule
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <VehicleForm action={createVehicleAction} submitLabel="Créer le véhicule" />
      </div>
    </div>
  );
}
