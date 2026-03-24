import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getVehicleById, updateVehicle, deleteVehicle } from "@/lib/db/vehicles";
import { VehicleUpdateSchema } from "@/types/vehicle";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(vehicle);
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json();
  const parsed = VehicleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vehicle = await updateVehicle(id, parsed.data);
  return Response.json(vehicle);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await deleteVehicle(id);
  return new Response(null, { status: 204 });
}
