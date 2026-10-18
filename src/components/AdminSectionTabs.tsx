"use client";

import Link from "next/link";

export default function AdminSectionTabs({ active }: { active: "events" | "medals" }) {
  const links = [
    { id: "events", label: "Eventos", href: "/admin/events" },
    { id: "medals", label: "Entrega de Medalhas", href: "/admin/medals" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 md:pt-28">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gold-dim/30 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-fiery-orange">Painel interno</p>
          <h1 className="font-display text-2xl text-gold-bright sm:text-3xl">Admin</h1>
        </div>
        <nav aria-label="Seções do painel Admin" className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "page" : undefined}
              className={`inline-flex min-h-10 items-center border px-4 py-2 font-display text-sm transition-colors ${
                active === link.id
                  ? "border-gold/60 bg-gold/15 text-gold-bright"
                  : "border-gold-dim/25 bg-void/50 text-text-secondary hover:border-gold/45 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
