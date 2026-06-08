"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ApiConfigurationError, ApiError, ApiNetworkError } from "@/lib/api/client";
import { getDashboardData, type DashboardData } from "@/lib/api/player";
import { useAuth } from "@/contexts/AuthContext";
import { getLanguageLocale, useLanguage } from "@/contexts/LanguageContext";
import { getAssetPath } from "@/lib/assets";
import { getBossImagePath, getBossMedalPath } from "@/lib/boss-medals";
import { useTranslations } from "@/lib/i18n";
import AuthenticatedTopbar from "@/components/AuthenticatedTopbar";
import {
  ArrowRightIcon,
  BookIcon,
  CrownIcon,
  HomeIcon,
  ShieldIcon,
  SkullIcon,
  TrophyIcon,
  WatchIcon,
} from "@/components/Icons";

type DashboardState =
  | { status: "loading" }
  | { status: "ready"; data: DashboardData }
  | { status: "error"; messageKey: string };

function formatDistance(value: number | null | undefined, locale: string) {
  if (typeof value !== "number") {
    return "";
  }

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getErrorMessageKey(error: unknown) {
  if (error instanceof ApiConfigurationError) {
    return "dashboard.errors.configuration";
  }

  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    return "dashboard.errors.sessionExpired";
  }

  if (error instanceof ApiNetworkError) {
    return "dashboard.errors.offline";
  }

  return "dashboard.errors.generic";
}

function getImagePath(path: string | null | undefined) {
  return getBossImagePath(path);
}

function Panel({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-4 sm:p-5 md:p-6">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl text-gold">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rpg-inset rounded-[14px] p-5 text-sm leading-relaxed text-text-muted">
      {children}
    </div>
  );
}

function PartialNotice({ children }: { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <div className="mb-4 rounded-[16px] border border-amber/30 bg-amber/10 px-4 py-3 text-sm leading-relaxed text-amber">
      {children}
    </div>
  );
}

function DashboardContent({ data }: { data: DashboardData }) {
  const { t } = useTranslations();
  const { lang } = useLanguage();
  const locale = getLanguageLocale(lang);
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);
  const { profile, currentBoss, trophies, history } = data;
  const displayName = profile.displayName ?? profile.username;
  const username = profile.username?.trim();
  const profileHref = username ? `/player?username=${encodeURIComponent(username)}` : null;
  const shownTrophies = trophies.slice(0, 4);
  const recentRuns = history.slice(0, 4);
  const bossImageSrc = getImagePath(currentBoss?.imageUrl) ?? getBossMedalPath(currentBoss?.name);
  const bossHealth = Math.max(0, Math.min(100, currentBoss?.healthPercent ?? 0));
  const streakLabel =
    profile.currentStreakDays <= 0
      ? t("dashboardUsability.flameAwaits")
      : profile.currentStreakDays === 1
        ? t("dashboardUsability.dayStreak")
        : t<string>("dashboardUsability.daysStreak").replace("{count}", String(profile.currentStreakDays));
  const distanceLabel = t<string>("dashboardUsability.kmTraveled").replace(
    "{distance}",
    formatDistance(profile.totalDistanceKm, locale),
  );

  const copyProfileLink = async () => {
    if (!username) {
      return;
    }

    const path = `${getAssetPath("/player")}?username=${encodeURIComponent(username)}`;
    const absoluteUrl = new URL(path, window.location.origin).toString();

    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setProfileLinkCopied(true);
      window.setTimeout(() => setProfileLinkCopied(false), 2500);
    } catch {
      setProfileLinkCopied(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Panel title={t("dashboard.sections.championSummary")} icon={CrownIcon}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-fiery-orange">@{profile.username}</p>
            <h1 className="mt-3 font-display text-4xl leading-none text-gold-bright md:text-5xl">
              {displayName}
            </h1>
            <p className="mt-3 text-lg text-gold">{profile.title ?? t("dashboard.fallbacks.championTitle")}</p>
          </div>
          <div className="rpg-inset w-24 rounded-[14px] border-gold/35 px-4 py-3 text-center">
            <div className="font-display text-4xl leading-none text-gold">{profile.level}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-text-muted">{t("dashboard.labels.level")}</div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="resource-pill justify-center text-sm text-text-secondary">{distanceLabel}</div>
          <div className="resource-pill justify-center text-sm text-text-secondary">{streakLabel}</div>
          <div className="resource-pill justify-center text-sm text-text-secondary">
            {profile.guild?.name ?? t("dashboard.fallbacks.noGuild")}
          </div>
        </div>
      </Panel>

      <Panel title={t("dashboard.sections.currentBoss")} icon={SkullIcon}>
        <PartialNotice>{data.partialErrors.currentBoss ? t("dashboard.partialErrors.currentBoss") : undefined}</PartialNotice>
        {currentBoss ? (
          <div className="grid gap-5 sm:grid-cols-[0.36fr_1fr] sm:items-center">
            <div className="rpg-inset aspect-square rounded-[16px] border-fiery-orange/25 p-4">
              {bossImageSrc ? (
                <img
                  src={bossImageSrc}
                  alt={currentBoss.name}
                  className="h-full w-full object-contain drop-shadow-[0_0_32px_rgba(232,98,42,0.28)]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-xs text-text-muted">{t("dashboard.fallbacks.bossImageUnavailable")}</div>
              )}
            </div>
            <div>
              <h3 className="font-display text-3xl text-gold-bright">{currentBoss.name}</h3>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm text-text-secondary">
                  <span>{t("dashboard.labels.healthRemaining")}</span>
                  <span className="text-fiery-orange">{bossHealth}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-fiery-orange/25 bg-void">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber"
                    style={{ width: `${bossHealth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState>{t("dashboard.fallbacks.noActiveBoss")}</EmptyState>
        )}
      </Panel>

      <Panel title={t("dashboard.sections.adventureLog")} icon={BookIcon}>
        <PartialNotice>{data.partialErrors.history ? t("dashboard.partialErrors.history") : undefined}</PartialNotice>
        {recentRuns.length > 0 ? (
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div key={run.id} className="rpg-inset rounded-[14px] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-xl text-gold">
                    {typeof run.distanceKm === "number" && run.distanceKm > 0
                      ? `${formatDistance(run.distanceKm, locale)} km`
                      : run.summary?.trim() || (run.bossDamage && run.bossDamage > 0)
                        ? t("dashboardUsability.adventureRecorded")
                        : t("dashboardUsability.runRecorded")}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">{formatDate(run.date, locale)}</span>
                </div>
                {run.summary?.trim() && (
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{run.summary}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>
            <strong className="block font-display text-lg font-normal text-gold">
              {t("dashboardUsability.noAdventures")}
            </strong>
            <span className="mt-2 block">{t("dashboardUsability.nextRunPrompt")}</span>
          </EmptyState>
        )}
      </Panel>

      <div className="grid gap-6">
        <Panel title={t("dashboard.sections.achievementsPreview")} icon={TrophyIcon}>
          <PartialNotice>{data.partialErrors.trophies ? t("dashboard.partialErrors.trophies") : undefined}</PartialNotice>
          {shownTrophies.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {shownTrophies.map((trophy) => (
                <div key={trophy.id} className="rpg-inset rounded-[14px] p-4">
                  <div className="mb-2 flex items-center gap-2 text-gold">
                    <TrophyIcon className="h-4 w-4" />
                    <h3 className="font-display text-lg">{trophy.name}</h3>
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-fiery-orange">{trophy.rarity}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>{t("dashboard.fallbacks.noAchievements")}</EmptyState>
          )}
        </Panel>

        <Panel title={t("dashboard.sections.accountActions")} icon={ShieldIcon}>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {profileHref ? (
              <Link href={profileHref} className="myth-button-secondary px-6 py-3 font-display text-sm tracking-wider">
                {t("dashboardUsability.viewPublicProfile")}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <span className="myth-button-secondary cursor-not-allowed px-6 py-3 font-display text-sm tracking-wider opacity-45" aria-disabled="true">
                {t("dashboardUsability.viewPublicProfile")}
              </span>
            )}
            <button
              type="button"
              onClick={copyProfileLink}
              className="myth-button-secondary px-6 py-3 font-display text-sm tracking-wider disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!profileHref}
            >
              <ShieldIcon className="h-4 w-4" />
              {t("dashboardUsability.copyProfileLink")}
            </button>
            <Link href="/" className="myth-button-secondary px-6 py-3 font-display text-sm tracking-wider">
              <HomeIcon className="h-4 w-4" />
              {t("dashboardUsability.backToSite")}
            </Link>
          </div>
          {profileLinkCopied && (
            <p className="mt-3 text-sm text-emerald" role="status">
              {t("dashboardUsability.profileLinkCopied")}
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default function DashboardShell() {
  const router = useRouter();
  const { token, user, status: authStatus, logout } = useAuth();
  const { t } = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [dashboardState, setDashboardState] = useState<DashboardState>({ status: "loading" });
  const profileUsername =
    dashboardState.status === "ready" ? dashboardState.data.profile.username : user?.username;

  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setDashboardState({ status: "loading" });

      getDashboardData(token)
        .then((data) => {
          if (active) {
            setDashboardState({ status: "ready", data });
          }
        })
        .catch((error: unknown) => {
          if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
            logout();
            router.replace("/login");
            return;
          }

          if (active) {
            setDashboardState({ status: "error", messageKey: getErrorMessageKey(error) });
          }
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [authStatus, logout, router, token]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void py-20 md:py-28">
      <AuthenticatedTopbar profileUsername={profileUsername} />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('${getAssetPath("/images/background.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/95 via-void/76 to-void" />
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="pointer-events-none absolute inset-4 border border-gold-dim/20 md:inset-8" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">{t("dashboard.kicker")}</p>
          <h1 className="rpg-heading font-display text-3xl leading-tight text-gold-bright sm:text-4xl md:text-6xl">{t("dashboard.title")}</h1>
          <p className="rpg-copy max-w-3xl leading-relaxed text-text-secondary">
            {t("dashboard.description")}
          </p>
        </div>

        {(authStatus === "loading" || dashboardState.status === "loading") && (
          <div className="app-panel app-panel-compact rpg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 text-gold">
              <WatchIcon className="h-5 w-5 animate-pulse" />
              <span className="font-display text-2xl">{t("dashboard.loading")}</span>
            </div>
          </div>
        )}

        {dashboardState.status === "error" && (
          <div className="app-panel app-panel-compact rpg-card max-w-3xl p-6 sm:p-8">
            <h2 className="font-display text-3xl text-gold">{t("dashboard.unavailable")}</h2>
            <p className="mt-4 leading-relaxed text-text-secondary">{t(dashboardState.messageKey)}</p>
          </div>
        )}

        {dashboardState.status === "ready" && <DashboardContent data={dashboardState.data} />}
      </motion.div>
    </main>
  );
}
