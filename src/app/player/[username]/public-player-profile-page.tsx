"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLanguageLocale, useLanguage } from "@/contexts/LanguageContext";
import { getAssetPath } from "@/lib/assets";
import { getBossImagePath, getBossMedalPath } from "@/lib/boss-medals";
import { ApiConfigurationError, ApiError, ApiNetworkError } from "@/lib/api/client";
import { getPublicPlayer, type PublicPlayerResult } from "@/lib/api/public-player";
import type { AchievementRarity, PublicPlayerProfile } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n";
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  CopyIcon,
  CrownIcon,
  MapIcon,
  ShareIcon,
  ShieldIcon,
  SkullIcon,
  SparkleIcon,
  SwordsIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/Icons";
import AuthenticatedTopbar from "@/components/AuthenticatedTopbar";

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; result: PublicPlayerResult }
  | { status: "error"; messageKey: string };

type RarityView = {
  className: string;
  wellClassName: string;
};

const rarityViews: Record<AchievementRarity, RarityView> = {
  common: {
    className: "border-text-muted/35 text-text-secondary",
    wellClassName: "rarity-common",
  },
  uncommon: {
    className: "border-emerald/35 text-emerald",
    wellClassName: "rarity-uncommon",
  },
  rare: {
    className: "border-diamond/40 text-diamond",
    wellClassName: "rarity-rare",
  },
  epic: {
    className: "border-magic-purple/45 text-magic-purple",
    wellClassName: "border-magic-purple/45 [--rarity-glow:rgba(141,69,214,0.28)]",
  },
  legendary: {
    className: "border-gold-bright/50 text-gold-bright",
    wellClassName: "rarity-legendary",
  },
  mythic: {
    className: "border-fiery-orange/55 text-fiery-orange",
    wellClassName: "border-fiery-orange/55 [--rarity-glow:rgba(232,98,42,0.36)]",
  },
};

function formatDistance(distanceKm: number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(distanceKm);
}

function getStreakLabel(currentStreakDays: number, t: <T = string>(key: string) => T) {
  if (currentStreakDays <= 0) {
    return t<string>("dashboardUsability.flameAwaits");
  }

  if (currentStreakDays === 1) {
    return t<string>("dashboardUsability.dayStreak");
  }

  return t<string>("dashboardUsability.daysStreak").replace("{count}", String(currentStreakDays));
}

function getDistanceLabel(totalDistanceKm: number, locale: string, t: <T = string>(key: string) => T) {
  return t<string>("dashboardUsability.kmTraveled").replace(
    "{distance}",
    formatDistance(totalDistanceKm, locale),
  );
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
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
    return "publicProfile.errors.configuration";
  }

  if (error instanceof ApiError && error.status === 404) {
    return "publicProfile.errors.notFound";
  }

  if (error instanceof ApiError) {
    return "publicProfile.errors.api";
  }

  if (error instanceof ApiNetworkError) {
    return "publicProfile.errors.offline";
  }

  return "publicProfile.errors.generic";
}

function getMediaPath(path: string | null | undefined) {
  return getBossImagePath(path);
}

function BossImageFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-center text-sm text-text-muted p-4">
      {label}
    </div>
  );
}

function AchievementIconFallback() {
  return <TrophyIcon className="h-10 w-10 text-current opacity-55" />;
}

function getSharedStat(value: number | undefined, locale: string, fallback: string, suffix = "") {
  return typeof value === "number" ? `${formatNumber(value, locale)}${suffix}` : fallback;
}

function ProfileLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="app-panel grid gap-8 p-5 md:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="min-h-[520px] animate-pulse rounded-[24px] border border-gold-dim/20 bg-charcoal/35" />
        <div className="space-y-5">
          <div className="h-10 w-56 animate-pulse rounded bg-gold-dim/20" />
          <div className="h-24 w-full max-w-2xl animate-pulse rounded bg-gold-dim/15" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-[20px] border border-gold-dim/15 bg-void/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileError({ messageKey }: { messageKey: string }) {
  const { t } = useTranslations();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="app-panel p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-fiery-orange/35 bg-fiery-orange/10 text-fiery-orange">
          <ShieldIcon className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl text-gold md:text-4xl">{t("publicProfile.unavailable")}</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-secondary">{t(messageKey)}</p>
        <a href={`${getAssetPath("/")}#join`} className="myth-button-primary mt-8 px-8 py-3 font-display text-sm tracking-wider">
          {t("publicProfile.beginJourney")}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  icon: Icon,
  tone = "gold",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "gold" | "ember" | "emerald";
}) {
  const toneClass = {
    gold: "text-gold border-gold/20",
    ember: "text-fiery-orange border-fiery-orange/20",
    emerald: "text-emerald border-emerald/20",
  }[tone];

  const glowClass = {
    gold: "shadow-[0_0_15px_rgba(212,175,55,0.1)]",
    ember: "shadow-[0_0_15px_rgba(232,98,42,0.1)]",
    emerald: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  }[tone];

  return (
    <div className={`rpg-inset group relative flex flex-col items-center justify-center rounded-[18px] border p-4 text-center transition-all duration-300 hover:scale-[1.02] ${toneClass} ${glowClass} min-w-0 w-full`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
      <Icon className="mb-3 h-5 w-5 shrink-0 opacity-70 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
      <div className="mb-1 text-[10px] uppercase tracking-[0.22em] opacity-60 whitespace-nowrap">
        {label}
      </div>
      <div className="font-display text-lg leading-tight text-gold-bright sm:text-xl break-words w-full">
        {value}
      </div>
    </div>
  );
}

function ChampionCrest({ name, className = "" }: { name: string; className?: string }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32 ${className}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-gold/10 blur-xl animate-pulse" />
      
      {/* Ornate Frame */}
      <div className="absolute inset-0 rounded-full border-4 border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
      <div className="absolute -inset-1 rounded-full border border-gold/20" />
      
      {/* Inner Surface */}
      <div className="absolute inset-1.5 rounded-full bg-void shadow-inner" />
      <div className="absolute inset-1.5 rounded-full bg-stone-texture opacity-30 mix-blend-overlay" />
      
      {/* Monogram */}
      <span className="relative font-display text-5xl text-gold-bright drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-6xl">
        {initial}
      </span>
      
      {/* Decorative Accents */}
      <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-gold/60 bg-void" />
      <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-gold/60 bg-void" />
    </div>
  );
}

function ProfileActions() {
  const { t } = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MythStride Champion Profile",
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section className="app-panel app-panel-compact rpg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <SparkleIcon className="h-5 w-5 text-gold" />
        <h3 className="font-display text-lg tracking-wider text-gold-bright uppercase">
          {t("publicProfile.actions.title")}
        </h3>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        <button
          onClick={handleCopy}
          className="myth-button-secondary group relative flex items-center justify-center gap-2 px-6 py-3 font-display text-xs tracking-widest flex-1 lg:flex-none"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-emerald" />
              <span className="text-emerald">{t("publicProfile.actions.linkCopied")}</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {t("publicProfile.actions.copyLink")}
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="myth-button-primary group flex items-center justify-center gap-2 px-6 py-3 font-display text-xs tracking-widest flex-1 lg:flex-none"
        >
          <ShareIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          {t("publicProfile.actions.shareProfile")}
        </button>
      </div>
    </section>
  );
}

function JourneyRelic({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rpg-inset group relative w-full overflow-hidden rounded-[22px] border border-gold/15 p-5 min-h-[128px] transition-all duration-300 hover:scale-[1.015] hover:border-gold/35 lg:p-6 lg:min-h-[145px]">
      <div className="absolute right-4 top-4 text-gold/7 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
        <Icon className="h-14 w-14" />
      </div>

      <div className="relative">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-void/75 text-gold shadow-[0_0_10px_rgba(212,175,55,0.12)]">
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-text-muted">
          {label}
        </div>

        <div className="mb-2 font-display text-2xl leading-tight text-gold-bright break-words lg:text-[1.7rem]">
          {value}
        </div>

        <p className="text-xs leading-relaxed text-text-secondary/80 transition-opacity group-hover:text-text-secondary">
          {detail}
        </p>
      </div>
    </div>
  );
}

function ChampionCard({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const { lang } = useLanguage();
  const locale = getLanguageLocale(lang);

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-6 sm:p-8 md:p-10">
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/45 to-transparent" />
      
      <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
        <ChampionCrest name={player.displayName} className="shrink-0" />
        
        <div className="flex-1 text-center md:text-left w-full overflow-hidden">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
            <CrownIcon className="h-3 w-3" />
            {t("publicProfile.championCard")}
          </div>
          
          <h2 className="font-display text-4xl leading-tight text-gold-bright sm:text-5xl md:text-6xl lg:text-7xl break-words">
            {player.displayName}
          </h2>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <p className="font-display text-xl text-fiery-orange sm:text-2xl md:text-3xl break-words">
              {player.title}
            </p>
            <div className="h-1.5 w-1.5 rounded-full bg-gold/30 hidden md:block" />
            <span className="text-sm font-medium tracking-widest text-text-muted break-all">
              @{player.username}
            </span>
          </div>

          <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <HeroStat label={t("publicProfile.labels.level")} value={`${player.level}`} icon={CrownIcon} />
            <HeroStat label={t("publicProfile.labels.flameStreak")} value={getStreakLabel(player.currentStreakDays, t)} icon={SparkleIcon} tone="ember" />
            <HeroStat label={t("publicProfile.labels.guild")} value={player.guild?.name ?? t("publicProfile.fallbacks.noGuild")} icon={UsersIcon} tone="emerald" />
            <HeroStat label={t("publicProfile.labels.distance")} value={getDistanceLabel(player.totalDistanceKm, locale, t)} icon={MapIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CurrentNemesis({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const boss = player.currentBoss;
  const bossImageSrc = getMediaPath(boss?.imageUrl) ?? getBossMedalPath(boss?.name);
  const healthPercent = Math.max(0, Math.min(100, boss?.healthPercent ?? 0));

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-0 boss-halo opacity-50" />
      <div className="absolute inset-0 bg-stone-texture opacity-15" />
      
      <div className="relative">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-hidden">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-fiery-orange">
              <SkullIcon className="h-3 w-3" />
              {t("publicProfile.boss.currentNemesis")}
            </div>
            <h2 className="font-display text-3xl text-gold sm:text-4xl md:text-5xl break-words">
              {boss?.name ?? t("publicProfile.fallbacks.nextShadow")}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-fiery-orange/40 hidden sm:block" />
            <p className="font-display text-lg sm:text-xl text-fiery-orange">
              {t("publicProfile.boss.mistAdvances")}
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Boss Portrait */}
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] aspect-square lg:mx-0">
            <div className="absolute inset-0 rounded-[32px] bg-fiery-orange/5 blur-2xl animate-pulse" />
            <div className="rpg-inset relative h-full w-full overflow-hidden rounded-[32px] border-2 border-fiery-orange/20 bg-rich-brown/20 p-6 sm:p-8 shadow-2xl">
              <div className="absolute inset-0 bg-stone-texture opacity-10" />
              {boss && bossImageSrc ? (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={bossImageSrc}
                  alt={boss.name}
                  className="h-full w-full object-contain drop-shadow-[0_0_50px_rgba(232,98,42,0.4)]"
                />
              ) : (
                <BossImageFallback label={boss?.name ?? t("publicProfile.fallbacks.noActiveBoss")} />
              )}
            </div>
          </div>

          {/* Versus Divider */}
          <div className="hidden lg:flex flex-col items-center gap-4">
            <div className="h-20 w-px bg-gradient-to-b from-transparent via-fiery-orange/30 to-transparent" />
            <div className="rounded-full border border-fiery-orange/40 bg-void p-3 text-fiery-orange">
              <SwordsIcon className="h-6 w-6" />
            </div>
            <div className="h-20 w-px bg-gradient-to-b from-transparent via-fiery-orange/30 to-transparent" />
          </div>

          {/* Progress Details */}
          <div className="flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">
                {t("publicProfile.labels.healthRemaining")}
              </p>
              <div className="flex items-end justify-center gap-4 lg:justify-start">
                <span className="font-display text-6xl sm:text-7xl md:text-8xl leading-none text-gold-bright">
                  {healthPercent}
                </span>
                <span className="mb-2 font-display text-3xl sm:text-4xl text-fiery-orange">%</span>
              </div>
            </div>

            {boss && (
              <div className="space-y-6">
                <div className="h-5 sm:h-6 overflow-hidden rounded-full border-2 border-fiery-orange/20 bg-void p-1 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${healthPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber shadow-[0_0_15px_rgba(232,98,42,0.5)]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-text-muted">
                  <span className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-hp-red shrink-0" />
                    {t<string>("publicProfile.boss.remains").replace("{percent}", String(healthPercent))}
                  </span>
                  <span className="flex items-center gap-2 sm:justify-end">
                    {t<string>("publicProfile.boss.weakened").replace("{percent}", String(100 - healthPercent))}
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald shrink-0" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementGrid({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const achievements = player.rareAchievements ?? [];

  return (
    <section className="app-panel app-panel-compact rpg-card p-6 sm:p-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
            <TrophyIcon className="h-3 w-3" />
            {t("publicProfile.labels.achievements")}
          </div>
          <h2 className="font-display text-4xl text-gold-bright md:text-5xl">
            {t("publicProfile.journey.legendaryAchievements")}
          </h2>
        </div>
      </div>

      {achievements.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement, index) => {
            const rarity = rarityViews[achievement.rarity];
            const iconSrc = getMediaPath(achievement.iconUrl) ?? getBossMedalPath(achievement.name);

            return (
              <motion.div
                key={`${achievement.name}-${achievement.rarity}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`rpg-inset relative overflow-hidden rounded-[24px] border-2 p-6 transition-colors duration-300 ${rarity.className} group`}
              >
                {/* Rarity Glow Effect */}
                <div className={`absolute -inset-10 opacity-0 transition-opacity duration-500 group-hover:opacity-20 blur-3xl ${rarity.wellClassName}`} />
                
                <div className="relative">
                  {/* Achievement Icon with Ornate Well */}
                  <div className={`mx-auto mb-6 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-2 border-dashed transition-transform duration-500 group-hover:rotate-6 ${rarity.className}`}>
                    <div className={`rarity-well ${rarity.wellClassName} flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center p-4 rounded-full bg-void shadow-2xl`}>
                      {iconSrc ? (
                        <img src={iconSrc} alt="" className="h-full w-full object-contain drop-shadow-xl" />
                      ) : (
                        <AchievementIconFallback />
                      )}
                    </div>
                  </div>

                  <div className="text-center overflow-hidden">
                    <h3 className="font-display text-xl sm:text-2xl text-gold-bright transition-colors group-hover:text-white break-words">
                      {achievement.name}
                    </h3>
                    <div className="mt-3 inline-block rounded-full bg-void/50 px-4 py-1 border border-white/5">
                      <p className="text-[10px] uppercase tracking-[0.25em] font-bold">
                        {t(`publicProfile.rarities.${achievement.rarity}`)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Corner Decorative Elements */}
                <div className="absolute top-2 left-2 h-4 w-4 border-t border-l border-current opacity-20" />
                <div className="absolute top-2 right-2 h-4 w-4 border-t border-r border-current opacity-20" />
                <div className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-current opacity-20" />
                <div className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-current opacity-20" />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rpg-inset rounded-[20px] p-10 text-center text-text-muted border border-dashed border-gold/10">
          <TrophyIcon className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p className="font-display text-xl">{t("publicProfile.fallbacks.noAchievements")}</p>
        </div>
      )}
    </section>
  );
}

function JourneyStatistics({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const { lang } = useLanguage();
  const locale = getLanguageLocale(lang);
  const notShared = t<string>("publicProfile.fallbacks.notShared");

  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
      <JourneyRelic
        label={t("publicProfile.labels.totalDistance")}
        value={getDistanceLabel(player.totalDistanceKm, locale, t)}
        detail={t("publicProfile.journey.distanceDetail")}
        icon={MapIcon}
      />
      <JourneyRelic
        label={t("publicProfile.labels.totalRuns")}
        value={getSharedStat(undefined, locale, notShared)}
        detail={t("publicProfile.journey.runsDetail")}
        icon={BookIcon}
      />
      <JourneyRelic
        label={t("publicProfile.labels.currentStreak")}
        value={getStreakLabel(player.currentStreakDays, t)}
        detail={t("publicProfile.journey.streakDetail")}
        icon={SparkleIcon}
      />
      <JourneyRelic
        label={t("publicProfile.labels.bossesDefeated")}
        value={getSharedStat(undefined, locale, notShared)}
        detail={t("publicProfile.journey.bossesDetail")}
        icon={SwordsIcon}
      />
    </section>
  );
}

function AdventureLog({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const { lang } = useLanguage();
  const locale = getLanguageLocale(lang);
  const latestRun = player.latestRun ?? null;

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="relative">
        <div className="mb-6 flex items-center gap-3 text-fiery-orange">
          <BookIcon className="h-6 w-6" />
          <h2 className="font-display text-3xl text-gold md:text-4xl">{t("publicProfile.labels.adventureLog")}</h2>
        </div>

        {latestRun ? (
          <div className="grid gap-5 md:grid-cols-[0.45fr_1fr] md:items-center">
            <div className="rpg-inset rounded-[16px] border-fiery-orange/25 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-text-muted">{t("publicProfile.labels.distance")}</div>
              <div className="mt-2 font-display text-4xl text-gold-bright">
                {formatDistance(latestRun.distanceKm, locale)} km
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-text-muted">{t("publicProfile.labels.date")}</div>
              <div className="mt-2 text-sm text-text-secondary">{formatDate(latestRun.date, locale)}</div>
            </div>
            <div className="overflow-hidden">
              <p className="font-display text-2xl leading-snug text-gold md:text-3xl break-words">
                {latestRun.summary ?? t("publicProfile.fallbacks.latestAdventure")}
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                {t<string>("publicProfile.adventure.latestFrom").replace("{name}", player.displayName)}
              </p>
            </div>
          </div>
        ) : (
          <div className="rpg-inset relative overflow-hidden rounded-[16px] p-8 text-center border-emerald/20 bg-emerald/5">
            <div className="absolute inset-0 bg-stone-texture opacity-10" />
            <SparkleIcon className="mx-auto mb-4 h-8 w-8 text-emerald/40" />
            <p className="relative font-display text-lg sm:text-xl text-emerald-bright tracking-wide italic">
              &quot;{t("publicProfile.adventure.emptyLogQuote")}&quot;
            </p>
            <p className="relative mt-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald/50">
              {t("publicProfile.fallbacks.noAdventure")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function GuildSection({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();

  if (!player.guild) {
    return null;
  }

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-6 sm:p-8">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald/10 blur-3xl" />
      <div className="relative grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <div className="rpg-inset flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[18px] border-emerald/30 text-emerald shrink-0">
          <UsersIcon className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        <div className="overflow-hidden text-center md:text-left">
          <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">{t("publicProfile.labels.guildBanner")}</p>
          <h2 className="mt-2 font-display text-3xl text-gold md:text-4xl break-words">{player.guild.name}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary text-sm sm:text-base">
            {t("publicProfile.guildDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalProfileCTA() {
  const { t } = useTranslations();

  return (
    <section className="app-panel rpg-card relative overflow-hidden p-8 text-center sm:p-12 md:p-16 border-emerald/30 shadow-[0_0_30px_rgba(16,185,129,0.05)] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${getAssetPath("/images/aethron-scroll-bg.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/80 to-void" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald/40 to-transparent" />
      
      <div className="relative z-10">
        <div className="mx-auto mb-8 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-emerald/30 bg-emerald/10 text-emerald shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <SparkleIcon className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse" />
        </div>
        
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-6xl leading-tight text-emerald-bright max-w-4xl mx-auto break-words">
          &quot;{t("publicProfile.cta.aethronQuote")}&quot;
        </h2>
        
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-text-secondary">
            {t("publicProfile.cta.description")}
          </p>
          
          <a href={`${getAssetPath("/")}#join`} className="myth-button-primary mt-4 group relative overflow-hidden px-8 sm:px-10 py-4 font-display text-sm tracking-widest bg-emerald/10 border-emerald/40 hover:bg-emerald/20 hover:border-emerald/60 text-emerald-bright w-full sm:w-auto">
            <div className="absolute inset-0 bg-emerald/10 translate-y-full transition-transform group-hover:translate-y-0" />
            <span className="relative flex items-center justify-center gap-3">
              <SwordsIcon className="h-4 w-4" />
              {t("publicProfile.beginJourney")}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function PlayerProfile({ player, source }: PublicPlayerResult) {
  const { t } = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {source === "development-mock" && (
        <div className="mx-auto mb-10 max-w-4xl rounded-full border border-amber/35 bg-amber/10 px-5 py-3 text-center text-xs leading-relaxed text-amber">
          {t("publicProfile.developmentMock")}
        </div>
      )}

      <motion.div
        className="space-y-8"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <ChampionCard player={player} />
        
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8 min-w-0">
            <CurrentNemesis player={player} />
            <AchievementGrid player={player} />
            <AdventureLog player={player} />
            <GuildSection player={player} />
          </div>
          
          <aside className="space-y-6 lg:min-w-0">
            <div className="space-y-6 lg:sticky lg:top-28">
              <ProfileActions />
              <JourneyStatistics player={player} />
            </div>
          </aside>
        </div>

        <div className="w-full">
          <FinalProfileCTA />
        </div>
      </motion.div>
    </div>
  );
}

export default function PublicPlayerProfilePage({ username }: { username: string }) {
  const decodedUsername = useMemo(() => decodeURIComponent(username), [username]);
  const { isAuthenticated, user } = useAuth();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    getPublicPlayer(decodedUsername)
      .then((result) => {
        if (active) {
          setLoadState({ status: "loaded", result });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadState({ status: "error", messageKey: getErrorMessageKey(error) });
        }
      });

    return () => {
      active = false;
    };
  }, [decodedUsername]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void py-20 md:py-28">
      {isAuthenticated && <AuthenticatedTopbar profileUsername={user?.username} />}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url('${getAssetPath("/images/background.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/92 via-void/78 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="pointer-events-none absolute inset-4 border border-gold-dim/20 md:inset-8" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fiery-orange/10 blur-3xl" />

      <div className="relative z-10">
        {loadState.status === "loading" && <ProfileLoading />}
        {loadState.status === "error" && <ProfileError messageKey={loadState.messageKey} />}
        {loadState.status === "loaded" && <PlayerProfile {...loadState.result} />}
      </div>
    </main>
  );
}
