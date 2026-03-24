"use client";

import { useTransition } from "react";
import { updateStatusAction } from "@/app/(auth)/vehicles/actions";
import { STATUT_LABELS } from "@/types/vehicle";
import type { VehicleStatus } from "@prisma/client";

const ALL_STATUTS: VehicleStatus[] = [
  "EN_STOCK",
  "EN_VENTE",
  "RESERVE",
  "VENDU",
  "EN_REPARATION",
];

export default function StatusSelect({
  vehicleId,
  currentStatut,
}: {
  vehicleId: string;
  currentStatut: VehicleStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatut = e.target.value as VehicleStatus;
    startTransition(() => updateStatusAction(vehicleId, newStatut));
  }

  return (
    <select
      value={currentStatut}
      onChange={handleChange}
      disabled={isPending}
      className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50"
    >
      {ALL_STATUTS.map((s) => (
        <option key={s} value={s}>
          {STATUT_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
