"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetPath } from "@/lib/assets";
import { useTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  CloseIcon,
  CrownIcon,
  HomeIcon,
  MenuIcon,
  ShieldIcon,
  SwordsIcon,
} from "@/components/Icons";

interface AuthenticatedTopbarProps {
  profileUsername?: string | null;
}

export default function AuthenticatedTopbar({ profileUsername }: AuthenticatedTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = user?.username?.trim() || profileUsername?.trim() || "";
  const profileHref = username ? `/player?username=${encodeURIComponent(username)}` : null;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.replace("/login");
  };

  const linkClass = (active: boolean) =>
    `inline-flex min-h-10 items-center gap-2 border px-3 py-2 font-display text-xs tracking-wider transition-colors ${
      active
        ? "border-gold/45 bg-gold/12 text-gold-bright"
        : "border-gold-dim/20 bg-void/45 text-text-secondary hover:border-gold/35 hover:text-gold"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold-dim/35 bg-void/94 shadow-[0_14px_44px_rgba(0,0,0,0.52),0_1px_0_rgba(227,186,115,0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 md:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <img
            src={getAssetPath("/images/mythstride-app-icon.png")}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full object-cover shadow-[0_0_18px_rgba(212,168,83,0.18)]"
          />
          <span className="truncate font-display text-base tracking-wider text-gold sm:text-lg">
            Myth<span className="text-gold-bright">Stride</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label={t("authTopbar.navigation")}>
          <Link href="/dashboard" className={linkClass(pathname === "/dashboard")}>
            <CrownIcon className="h-4 w-4" />
            {t("authTopbar.dashboard")}
          </Link>
          {profileHref ? (
            <Link href={profileHref} className={linkClass(pathname === "/player" || pathname.startsWith("/player/"))}>
              <ShieldIcon className="h-4 w-4" />
              {t("authTopbar.publicProfile")}
            </Link>
          ) : (
            <span className={`${linkClass(false)} cursor-not-allowed opacity-45`} aria-disabled="true">
              <ShieldIcon className="h-4 w-4" />
              {t("authTopbar.publicProfile")}
            </span>
          )}
          <Link href="/" className={linkClass(false)}>
            <HomeIcon className="h-4 w-4" />
            {t("authTopbar.home")}
          </Link>
          <LanguageSwitcher className="px-2" />
          <button type="button" onClick={handleLogout} className="myth-button-primary min-h-10 px-4 py-2 font-display text-xs tracking-wider">
            <SwordsIcon className="h-4 w-4" />
            {t("authTopbar.logout")}
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <LanguageSwitcher className="max-[370px]:hidden" />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-gold-dim/30 bg-void/65 text-gold"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="authenticated-mobile-menu"
            aria-label={mobileOpen ? t("authTopbar.closeMenu") : t("authTopbar.openMenu")}
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="authenticated-mobile-menu"
        className={`overflow-hidden border-gold-dim/25 bg-void/96 transition-[max-height,opacity] duration-300 lg:hidden ${
          mobileOpen ? "max-h-96 border-t opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6" aria-label={t("authTopbar.navigation")}>
          <Link href="/dashboard" className={linkClass(pathname === "/dashboard")} onClick={() => setMobileOpen(false)}>
            <CrownIcon className="h-4 w-4" />
            {t("authTopbar.dashboard")}
          </Link>
          {profileHref ? (
            <Link href={profileHref} className={linkClass(pathname === "/player" || pathname.startsWith("/player/"))} onClick={() => setMobileOpen(false)}>
              <ShieldIcon className="h-4 w-4" />
              {t("authTopbar.publicProfile")}
            </Link>
          ) : (
            <span className={`${linkClass(false)} cursor-not-allowed opacity-45`} aria-disabled="true">
              <ShieldIcon className="h-4 w-4" />
              {t("authTopbar.publicProfile")}
            </span>
          )}
          <Link href="/" className={linkClass(false)} onClick={() => setMobileOpen(false)}>
            <HomeIcon className="h-4 w-4" />
            {t("authTopbar.home")}
          </Link>
          <button type="button" onClick={handleLogout} className="myth-button-primary min-h-10 px-4 py-2 font-display text-xs tracking-wider">
            <SwordsIcon className="h-4 w-4" />
            {t("authTopbar.logout")}
          </button>
        </nav>
      </div>
    </header>
  );
}
