import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getVehicles, createVehicle } from "@/lib/db/vehicles";
import { VehicleCreateSchema } from "@/types/vehicle";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const filters = {
    statut: searchParams.get("statut") || undefined,
    marque: searchParams.get("marque") || undefined,
    anneeMin: searchParams.get("anneeMin") ? Number(searchParams.get("anneeMin")) : undefined,
    anneeMax: searchParams.get("anneeMax") ? Number(searchParams.get("anneeMax")) : undefined,
    prixMax: searchParams.get("prixMax") ? Number(searchParams.get("prixMax")) : undefined,
  } as Parameters<typeof getVehicles>[0];

  const vehicles = await getVehicles(filters);
  return Response.json(vehicles);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = VehicleCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vehicle = await createVehicle(parsed.data);
  return Response.json(vehicle, { status: 201 });
}
