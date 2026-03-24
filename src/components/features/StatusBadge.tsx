import { STATUT_LABELS, STATUT_COLORS } from "@/types/vehicle";
import type { VehicleStatus } from "@prisma/client";

export default function StatusBadge({ statut }: { statut: VehicleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUT_COLORS[statut]}`}
    >
      {STATUT_LABELS[statut]}
    </span>
  );
}
