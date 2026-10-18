"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CrownIcon,
  HomeIcon,
  MenuIcon,
  ScrollIcon,
  ShieldIcon,
  TrophyIcon,
  UsersIcon,
  CloseIcon,
} from "@/components/Icons";

export type AdminSection = "overview" | "users" | "events" | "medals" | "deliveries" | "logs";

const links = [
  { id: "overview", label: "Visão Geral", href: "/admin", icon: HomeIcon },
  { id: "users", label: "Usuários", href: "/admin/users", icon: UsersIcon },
  { id: "events", label: "Eventos", href: "/admin/events", icon: ScrollIcon },
  { id: "medals", label: "Medalhas", href: "/admin/medals", icon: TrophyIcon },
  { id: "deliveries", label: "Entregas", href: "/admin/deliveries", icon: CrownIcon },
  { id: "logs", label: "Logs", href: "/admin/logs", icon: ShieldIcon },
] as const;

export default function AdminSectionTabs({ active }: { active: AdminSection }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Close the mobile drawer whenever navigation changes.
    const timer = window.setTimeout(() => setIsOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-gold-dim/30 bg-void/95 px-4 py-3 backdrop-blur md:top-20 lg:hidden">
        <button
          type="button"
          aria-controls="admin-sidebar"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-gold-dim/45 bg-[#17120f] px-4 font-display text-gold-bright"
        >
          <span className="flex items-center gap-2">
            <MenuIcon className="h-5 w-5" /> Menu Admin
          </span>
          <span className="text-xs text-text-secondary">{links.find((item) => item.id === active)?.label}</span>
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu administrativo"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Menu lateral administrativo"
        className={`fixed bottom-0 left-0 top-16 z-40 flex w-[min(85vw,270px)] flex-col overflow-y-auto border-r border-gold-dim/45 bg-[#0b0c0e] shadow-[15px_0_40px_rgba(0,0,0,.55)] md:top-20 lg:sticky lg:top-20 lg:z-0 lg:h-[calc(100vh-5rem)] lg:w-[248px] lg:shrink-0 lg:self-start lg:shadow-none ${
          isOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        <div className="relative border-b border-gold-dim/30 bg-[radial-gradient(ellipse_at_top,rgba(177,119,43,.18),transparent_75%)] px-5 py-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[.24em] text-fiery-orange">MythStride</p>
              <h2 className="mt-2 font-display text-xl text-gold-bright">Painel Admin</h2>
              <p className="mt-1 text-xs text-text-muted">Gerenciamento do mundo</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="rounded border border-gold-dim/35 p-1.5 text-text-secondary lg:hidden"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav aria-label="Seções do painel Admin" className="grid gap-1 p-3">
          {links.map(({ id, label, href, icon: Icon }) => {
            const selected = active === id;
            return (
              <Link
                key={id}
                href={href}
                aria-current={selected ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`flex min-h-12 items-center gap-3 rounded-md border px-3 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-bright ${
                  selected
                    ? "border-gold/65 bg-[linear-gradient(90deg,rgba(185,131,50,.24),rgba(185,131,50,.07))] font-semibold text-gold-bright shadow-[inset_3px_0_0_#c69a52]"
                    : "border-transparent text-text-secondary hover:border-gold-dim/35 hover:bg-gold/5 hover:text-gold"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-gold-dim/20 px-5 py-6">
          <p className="font-display text-xs tracking-[0.20em] text-gold-dim">MYTHSTRIDE</p>
          <p className="mt-1 text-[11px] text-text-muted">Mais que um jogo, uma jornada.</p>
        </div>
      </aside>
    </>
  );
}
