import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bienvenue, {session?.user?.name ?? session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Véhicules en stock", value: "—" },
          { label: "Véhicules vendus", value: "—" },
          { label: "Clients", value: "—" },
          { label: "Dossiers carte grise", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
