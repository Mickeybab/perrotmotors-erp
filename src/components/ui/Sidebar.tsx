"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/vehicles", label: "Véhicules", icon: "🚗" },
  { href: "/costs", label: "Coûts", icon: "💰" },
  { href: "/customers", label: "Clients", icon: "👥" },
  { href: "/registrations", label: "Carte grise", icon: "📄" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center border-b border-zinc-200 px-4">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          Perrot Motors
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <span>↩</span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
