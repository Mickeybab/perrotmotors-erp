"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteVehicleAction } from "../actions";

export default function VehicleDetailActions({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => deleteVehicleAction(vehicleId));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/vehicles/${vehicleId}/edit`)}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        Modifier
      </button>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Supprimer
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600">Confirmer ?</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "…" : "Oui, supprimer"}
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
