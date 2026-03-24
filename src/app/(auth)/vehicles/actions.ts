"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
} from "@/lib/db/vehicles";
import { VehicleCreateSchema, VehicleUpdateSchema } from "@/types/vehicle";
import type { VehicleFormState } from "@/types/vehicle";
import type { VehicleStatus } from "@prisma/client";

export async function createVehicleAction(
  _prev: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = VehicleCreateSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await createVehicle(parsed.data);
  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function updateVehicleAction(
  id: string,
  _prev: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = VehicleUpdateSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await updateVehicle(id, parsed.data);
  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  redirect(`/vehicles/${id}`);
}

export async function deleteVehicleAction(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await deleteVehicle(id);
  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function updateStatusAction(id: string, statut: VehicleStatus) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await updateVehicleStatus(id, statut);
  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
}
