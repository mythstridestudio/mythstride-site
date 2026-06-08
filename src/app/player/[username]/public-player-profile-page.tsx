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
  CrownIcon,
  MapIcon,
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
    <div className="flex h-full w-full items-center justify-center text-center text-sm text-text-muted">
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
    gold: "text-gold",
    ember: "text-fiery-orange",
    emerald: "text-emerald",
  }[tone];

  return (
    <div className="rpg-inset rounded-[14px] p-4">
      <div className={`mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] ${toneClass}`}>
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="font-display text-2xl leading-none text-gold-bright md:text-3xl">{value}</div>
    </div>
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
    <div className="rpg-inset relative overflow-hidden rounded-[16px] p-5">
      <div className="absolute right-4 top-4 text-gold-dim/10">
        <Icon className="h-14 w-14" />
      </div>
      <div className="relative">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold-dim/25 bg-void/75 text-gold">
          <Icon className="h-5 w-5" />
        </div>
        <div className="font-display text-3xl text-gold-bright">{value}</div>
        <h3 className="mt-2 font-display text-xl text-gold">{label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{detail}</p>
      </div>
    </div>
  );
}

function ChampionCard({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const { lang } = useLanguage();
  const locale = getLanguageLocale(lang);

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-4 sm:p-5 md:p-7">
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/45 to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{t("publicProfile.championCard")}</p>
            <h2 className="rpg-heading mt-3 font-display text-3xl leading-none text-gold-bright sm:text-4xl md:text-5xl">
              {player.displayName}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-4 py-2 text-sm text-fiery-orange">
                <CrownIcon className="h-4 w-4" />
                {player.title}
              </span>
              <span className="resource-pill text-sm text-text-secondary">@{player.username}</span>
            </div>
          </div>
          <div className="rpg-inset min-w-20 rounded-[14px] border-gold/35 px-4 py-3 text-center">
            <div className="font-display text-4xl leading-none text-gold">{player.level}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-text-muted">{t("publicProfile.labels.level")}</div>
          </div>
        </div>

        <div className="my-7 h-px bg-gradient-to-r from-transparent via-gold-dim/35 to-transparent" />

        <div className="grid gap-4 sm:grid-cols-3">
          <HeroStat label={t("publicProfile.labels.flameStreak")} value={getStreakLabel(player.currentStreakDays, t)} icon={SparkleIcon} tone="ember" />
          <HeroStat label={t("publicProfile.labels.guild")} value={player.guild?.name ?? t("publicProfile.fallbacks.noGuild")} icon={UsersIcon} tone="emerald" />
          <HeroStat label={t("publicProfile.labels.distance")} value={getDistanceLabel(player.totalDistanceKm, locale, t)} icon={MapIcon} />
        </div>
      </div>
    </section>
  );
}

function BossProgress({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const boss = player.currentBoss;
  const bossImageSrc = getMediaPath(boss?.imageUrl) ?? getBossMedalPath(boss?.name);
  const healthPercent = Math.max(0, Math.min(100, boss?.healthPercent ?? 0));
  const damagePercent = 100 - healthPercent;

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-4 sm:p-5 md:p-7">
      <div className="absolute inset-0 boss-halo opacity-75" />
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rpg-inset relative aspect-square overflow-hidden rounded-[18px] border-fiery-orange/25">
          {boss && bossImageSrc ? (
            <img
              src={bossImageSrc}
              alt={boss.name}
              className="h-full w-full object-contain p-8 drop-shadow-[0_0_42px_rgba(232,98,42,0.32)]"
            />
          ) : boss ? (
            <BossImageFallback label={`${boss.name}: ${t("publicProfile.fallbacks.bossImageUnavailable")}`} />
          ) : (
            <BossImageFallback label={t("publicProfile.fallbacks.noActiveBoss")} />
          )}
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-fiery-orange">
            <SkullIcon className="h-4 w-4" />
            {t("publicProfile.labels.bossProgress")}
          </div>
          <h2 className="rpg-heading font-display text-3xl leading-tight text-gold sm:text-4xl md:text-5xl">
            {boss?.name ?? t("publicProfile.fallbacks.nextShadow")}
          </h2>
          <p className="mt-4 font-display text-2xl text-fiery-orange">{t("publicProfile.boss.mistAdvances")}</p>

          {boss && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                <span className="text-text-secondary">{t("publicProfile.labels.healthRemaining")}</span>
                <span className="font-semibold text-fiery-orange">{healthPercent}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-fiery-orange/30 bg-void">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber"
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-text-muted">
                <span>{t<string>("publicProfile.boss.weakened").replace("{percent}", String(damagePercent))}</span>
                <span>{t<string>("publicProfile.boss.remains").replace("{percent}", String(healthPercent))}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AchievementGrid({ player }: { player: PublicPlayerProfile }) {
  const { t } = useTranslations();
  const achievements = player.rareAchievements ?? [];

  return (
    <section className="app-panel app-panel-compact rpg-card p-4 sm:p-5 md:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{t("publicProfile.labels.achievements")}</p>
          <h2 className="mt-2 font-display text-3xl text-gold md:text-4xl">{t("publicProfile.journey.relicsTitle")}</h2>
        </div>
        <TrophyIcon className="h-8 w-8 text-gold-dim" />
      </div>

      {achievements.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {achievements.map((achievement) => {
            const rarity = rarityViews[achievement.rarity];
            const iconSrc = getMediaPath(achievement.iconUrl) ?? getBossMedalPath(achievement.name);

            return (
              <div
                key={`${achievement.name}-${achievement.rarity}`}
                className={`rpg-inset relative overflow-hidden rounded-[16px] p-4 ${rarity.className}`}
              >
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
                <div className={`rarity-well ${rarity.wellClassName} mx-auto flex h-24 w-24 items-center justify-center p-3`}>
                  {iconSrc ? (
                    <img src={iconSrc} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <AchievementIconFallback />
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl text-gold">{achievement.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">
                  {t(`publicProfile.rarities.${achievement.rarity}`)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rpg-inset rounded-[16px] p-6 text-sm leading-relaxed text-text-muted">
          {t("publicProfile.fallbacks.noAchievements")}
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
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-4 sm:p-5 md:p-7">
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
            <div>
              <p className="font-display text-2xl leading-snug text-gold md:text-3xl">
                {latestRun.summary ?? t("publicProfile.fallbacks.latestAdventure")}
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                {t<string>("publicProfile.adventure.latestFrom").replace("{name}", player.displayName)}
              </p>
            </div>
          </div>
        ) : (
          <p className="rpg-inset rounded-[16px] p-6 text-sm leading-relaxed text-text-muted">
            {t("publicProfile.fallbacks.noAdventure")}
          </p>
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
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-4 sm:p-5 md:p-7">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald/10 blur-3xl" />
      <div className="relative grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <div className="rpg-inset flex h-24 w-24 items-center justify-center rounded-[18px] border-emerald/30 text-emerald">
          <UsersIcon className="h-10 w-10" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{t("publicProfile.labels.guildBanner")}</p>
          <h2 className="mt-2 font-display text-3xl text-gold md:text-4xl">{player.guild.name}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
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
    <section className="app-panel rpg-card relative overflow-hidden p-6 text-center sm:p-8 md:p-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('${getAssetPath("/images/aethron-scroll-bg.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/76 to-void" />
      <div className="relative">
        <SparkleIcon className="mx-auto mb-5 h-8 w-8 text-emerald" />
        <h2 className="rpg-heading font-display text-3xl leading-tight text-gold-bright sm:text-4xl md:text-5xl">
          {t("publicProfile.cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-text-secondary">
          {t("publicProfile.cta.description")}
        </p>
        <a href={`${getAssetPath("/")}#join`} className="myth-button-primary mt-8 px-9 py-4 font-display text-sm tracking-wider">
          <SwordsIcon className="h-4 w-4" />
          {t("publicProfile.beginJourney")}
        </a>
      </div>
    </section>
  );
}

function PlayerProfile({ player, source }: PublicPlayerResult) {
  const { t } = useTranslations();
  const { lang } = useLanguage();
  const locale = getLanguageLocale(lang);
  const boss = player.currentBoss;
  const bossImageSrc = getMediaPath(boss?.imageUrl) ?? getBossMedalPath(boss?.name);
  const healthPercent = Math.max(0, Math.min(100, boss?.healthPercent ?? 0));
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {source === "development-mock" && (
        <div className="mx-auto mb-6 max-w-4xl rounded-full border border-amber/35 bg-amber/10 px-5 py-3 text-center text-xs leading-relaxed text-amber">
          {t("publicProfile.developmentMock")}
        </div>
      )}

      <motion.div
        className="space-y-6"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <section className="app-panel rpg-card relative overflow-hidden p-4 sm:p-5 md:p-8">
          <div className="absolute inset-0 bg-stone-texture opacity-25" />
          <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-ember-glow opacity-80" />
          <div className="relative grid gap-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <a href={getAssetPath("/")} className="mb-8 inline-flex items-center gap-2">
                <img src={getAssetPath("/images/mythstride-app-icon.png")} alt="" className="h-9 w-9 rounded-full" />
                <span className="font-display text-lg tracking-wider text-gold">
                  Myth<span className="text-gold-bright">Stride</span>
                </span>
              </a>
              <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">{t("publicProfile.legendaryProfile")}</p>
              <h1 className="rpg-heading mt-4 font-display text-4xl leading-none text-gold-bright sm:text-5xl md:text-7xl">
                {player.displayName}
              </h1>
              <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-gold md:text-3xl">
                {player.title}
              </p>
              <p className="rpg-copy mt-5 max-w-2xl leading-relaxed text-text-secondary">
                {t("publicProfile.profileDescription")}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <HeroStat label={t("publicProfile.labels.level")} value={`${player.level}`} icon={CrownIcon} />
                <HeroStat label={t("publicProfile.labels.boss")} value={boss?.name ?? t("publicProfile.fallbacks.none")} icon={SkullIcon} tone="ember" />
                <HeroStat label={t("publicProfile.labels.streak")} value={getStreakLabel(player.currentStreakDays, t)} icon={SparkleIcon} tone="ember" />
                <HeroStat label={t("publicProfile.labels.distance")} value={getDistanceLabel(player.totalDistanceKm, locale, t)} icon={MapIcon} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 boss-halo rounded-full blur-2xl opacity-80" />
              <div className="rpg-inset relative overflow-hidden rounded-[20px] p-4 sm:p-5">
                <div className="absolute inset-0 bg-stone-texture opacity-20" />
                <div className="relative aspect-square rounded-[16px] border border-fiery-orange/20 bg-rich-brown/35">
                  {boss && bossImageSrc ? (
                    <img
                      src={bossImageSrc}
                      alt={boss.name}
                      className="h-full w-full object-contain p-8 drop-shadow-[0_0_42px_rgba(232,98,42,0.3)]"
                    />
                  ) : boss ? (
                    <BossImageFallback label={`${boss.name}: ${t("publicProfile.fallbacks.bossImageUnavailable")}`} />
                  ) : (
                    <BossImageFallback label={t("publicProfile.fallbacks.noActiveBoss")} />
                  )}
                </div>
                {boss && (
                  <div className="relative mt-5">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-display text-xl text-gold">{boss.name}</span>
                      <span className="text-sm font-semibold text-fiery-orange">
                        {t<string>("publicProfile.boss.health").replace("{percent}", String(healthPercent))}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full border border-fiery-orange/25 bg-void">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber"
                        style={{ width: `${healthPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <ChampionCard player={player} />
        <BossProgress player={player} />
        <JourneyStatistics player={player} />
        <AchievementGrid player={player} />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <AdventureLog player={player} />
          <GuildSection player={player} />
        </div>

        <FinalProfileCTA />
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
