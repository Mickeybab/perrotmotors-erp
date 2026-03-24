import { prisma } from "@/lib/prisma";
import type { VehicleCreateInput, VehicleUpdateInput } from "@/types/vehicle";
import type { VehicleStatus } from "@prisma/client";

export type VehicleFilters = {
  statut?: VehicleStatus;
  marque?: string;
  anneeMin?: number;
  anneeMax?: number;
  prixMax?: number;
};

export async function getVehicles(filters: VehicleFilters = {}) {
  return prisma.vehicle.findMany({
    where: {
      ...(filters.statut && { statut: filters.statut }),
      ...(filters.marque && {
        marque: { contains: filters.marque, mode: "insensitive" },
      }),
      ...(filters.anneeMin && { annee: { gte: filters.anneeMin } }),
      ...(filters.anneeMax && { annee: { lte: filters.anneeMax } }),
      ...(filters.prixMax && { prixVente: { lte: filters.prixMax } }),
    },
    include: {
      photos: { where: { isPrimary: true }, take: 1 },
      costs: { select: { montant: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVehicleById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
      costs: { orderBy: { date: "desc" } },
      sale: { include: { customer: true } },
      registration: true,
    },
  });
}

export async function createVehicle(data: VehicleCreateInput) {
  return prisma.vehicle.create({ data });
}

export async function updateVehicle(id: string, data: VehicleUpdateInput) {
  return prisma.vehicle.update({ where: { id }, data });
}

export async function updateVehicleStatus(id: string, statut: VehicleStatus) {
  return prisma.vehicle.update({ where: { id }, data: { statut } });
}

export async function deleteVehicle(id: string) {
  return prisma.vehicle.delete({ where: { id } });
}

export async function getMarques() {
  const rows = await prisma.vehicle.findMany({
    select: { marque: true },
    distinct: ["marque"],
    orderBy: { marque: "asc" },
  });
  return rows.map((r) => r.marque);
}
