"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getAssetPath } from "@/lib/assets";
import { ApiConfigurationError, ApiError } from "@/lib/api/client";
import { getPublicPlayer, type PublicPlayerResult } from "@/lib/api/public-player";
import type { AchievementRarity } from "@/lib/api/types";
import {
  ArrowRightIcon,
  CrownIcon,
  ShieldIcon,
  SparkleIcon,
  SwordsIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/Icons";

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; result: PublicPlayerResult }
  | { status: "error"; message: string };

const rarityStyles: Record<AchievementRarity, string> = {
  common: "border-text-muted/30 text-text-secondary",
  uncommon: "border-emerald/35 text-emerald",
  rare: "border-diamond/35 text-diamond",
  epic: "border-magic-purple/40 text-magic-purple",
  legendary: "border-gold-bright/45 text-gold-bright",
};

function formatDistance(distanceKm: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(distanceKm);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiConfigurationError) {
    return "Public profiles need NEXT_PUBLIC_API_BASE_URL before production data can load.";
  }

  if (error instanceof ApiError && error.status === 404) {
    return "This public profile was not found.";
  }

  if (error instanceof ApiError) {
    return "The MythStride API could not load this public profile.";
  }

  return "This public profile is temporarily unavailable.";
}

function getMediaPath(path: string) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  return getAssetPath(path);
}

function ProfileLoading() {
  return (
    <div className="app-panel mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
      <div className="min-h-[420px] animate-pulse rounded-[22px] border border-gold-dim/20 bg-charcoal/35" />
      <div className="space-y-5">
        <div className="h-8 w-44 animate-pulse rounded bg-gold-dim/20" />
        <div className="h-16 w-full max-w-lg animate-pulse rounded bg-gold-dim/15" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-[20px] border border-gold-dim/15 bg-void/60" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileError({ message }: { message: string }) {
  return (
    <div className="app-panel mx-auto max-w-3xl p-8 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-fiery-orange/35 bg-fiery-orange/10 text-fiery-orange">
        <ShieldIcon className="h-6 w-6" />
      </div>
      <h1 className="font-display text-3xl text-gold md:text-4xl">Profile unavailable</h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-secondary">{message}</p>
      <a href={`${getAssetPath("/")}#join`} className="gold-button mt-8 px-8 py-3 font-display text-sm tracking-wider">
        Begin Your Journey
        <ArrowRightIcon className="h-4 w-4" />
      </a>
    </div>
  );
}

function StatPanel({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[20px] border border-gold-dim/20 bg-void/72 p-5">
      <div className="font-display text-3xl text-gold-bright">{value}</div>
      <div className="mt-1 text-sm font-medium text-text-primary">{label}</div>
      <div className="mt-2 text-xs leading-relaxed text-text-muted">{detail}</div>
    </div>
  );
}

function PlayerProfile({ player, source, fallbackReason }: PublicPlayerResult) {
  const boss = player.currentBoss;
  const joinHref = `${getAssetPath("/")}#join`;
  const healthPercent = Math.max(0, Math.min(100, boss?.healthPercent ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-6">
      {source === "development-mock" && (
        <div className="mx-auto mb-6 max-w-4xl rounded-full border border-amber/35 bg-amber/10 px-5 py-3 text-center text-xs leading-relaxed text-amber">
          Temporary local development mock. Production will show API data only. {fallbackReason}
        </div>
      )}

      <motion.div
        className="app-panel relative overflow-hidden p-4 md:p-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <div className="absolute inset-0 bg-stone-texture opacity-20" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-7 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative overflow-hidden rounded-[24px] border border-gold-dim/25 bg-void/78 p-5">
            <div className="absolute inset-0 boss-halo opacity-80" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Public profile</p>
                <h1 className="mt-2 font-display text-4xl leading-none text-gold-bright md:text-5xl">
                  {player.displayName}
                </h1>
              </div>
              <div className="rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-right">
                <div className="font-display text-2xl text-gold">{player.level}</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Level</div>
              </div>
            </div>

            <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-4 py-2 text-sm text-fiery-orange">
              <CrownIcon className="h-4 w-4" />
              {player.title}
            </div>

            <div className="relative mt-7 aspect-[4/3] overflow-hidden rounded-[22px] border border-gold-dim/20 bg-rich-brown/30">
              {boss ? (
                <img
                  src={getMediaPath(boss.imageUrl)}
                  alt={boss.name}
                  className="h-full w-full object-contain p-6 drop-shadow-[0_0_36px_rgba(232,98,42,0.28)]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-text-muted">
                  No active boss
                </div>
              )}
            </div>

            {boss && (
              <div className="relative mt-5">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-display text-xl text-gold">{boss.name}</div>
                    <div className="text-xs text-text-muted">Current boss</div>
                  </div>
                  <div className="text-sm font-semibold text-fiery-orange">{healthPercent}%</div>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-fiery-orange/25 bg-void">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber"
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-col justify-between gap-6">
            <div>
              <a href={getAssetPath("/")} className="mb-7 inline-flex items-center gap-2">
                <img src={getAssetPath("/images/mythstride-app-icon.png")} alt="" className="h-9 w-9 rounded-full" />
                <span className="font-display text-lg tracking-wider text-gold">
                  Myth<span className="text-gold-bright">Stride</span>
                </span>
              </a>

              <p className="max-w-2xl font-display text-3xl leading-tight text-gold md:text-5xl">
                Run in the real world. Progress in another.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                {player.displayName}&apos;s public legend shows the progress they have chosen to share: distance,
                streak, guild, achievements, and the boss standing in their path.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatPanel
                label="Distance"
                value={`${formatDistance(player.totalDistanceKm)} km`}
                detail="Real-world distance carried into Elyndor."
              />
              <StatPanel
                label="Flame streak"
                value={`${player.currentStreakDays}`}
                detail="Days keeping momentum alive."
              />
              <StatPanel
                label="Guild"
                value={player.guild?.name ?? "No guild"}
                detail="The banner this runner carries."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="rounded-[22px] border border-gold-dim/20 bg-charcoal/35 p-5">
                <div className="mb-4 flex items-center gap-2 text-gold">
                  <TrophyIcon className="h-5 w-5" />
                  <h2 className="font-display text-xl">Rare achievements</h2>
                </div>
                <div className="space-y-3">
                  {player.rareAchievements.length > 0 ? (
                    player.rareAchievements.map((achievement) => (
                      <div
                        key={`${achievement.name}-${achievement.rarity}`}
                        className={`flex items-center gap-3 rounded-[18px] border bg-void/65 p-3 ${rarityStyles[achievement.rarity]}`}
                      >
                        <img
                          src={getMediaPath(achievement.iconUrl)}
                          alt=""
                          className="h-12 w-12 rounded-xl object-contain"
                        />
                        <div>
                          <div className="font-medium text-text-primary">{achievement.name}</div>
                          <div className="text-xs uppercase tracking-[0.18em]">{achievement.rarity}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-relaxed text-text-muted">No rare achievements shared yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-fiery-orange/20 bg-fiery-orange/5 p-5">
                <div className="mb-4 flex items-center gap-2 text-fiery-orange">
                  <SparkleIcon className="h-5 w-5" />
                  <h2 className="font-display text-xl">Last run</h2>
                </div>
                {player.lastRun ? (
                  <div>
                    <div className="font-display text-3xl text-gold-bright">
                      {formatDistance(player.lastRun.distanceKm)} km
                    </div>
                    <div className="mt-2 text-sm text-text-muted">{formatDate(player.lastRun.date)}</div>
                    <p className="mt-4 leading-relaxed text-text-secondary">{player.lastRun.summary}</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-text-muted">No public run shared yet.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gold-dim/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <UsersIcon className="h-4 w-4 text-emerald" />
                @{player.username}
              </div>
              <a href={joinHref} className="gold-button px-8 py-3 font-display text-sm tracking-wider">
                <SwordsIcon className="h-4 w-4" />
                Begin Your Journey
              </a>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

export default function PublicPlayerProfilePage({ username }: { username: string }) {
  const decodedUsername = useMemo(() => decodeURIComponent(username), [username]);
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
          setLoadState({ status: "error", message: getErrorMessage(error) });
        }
      });

    return () => {
      active = false;
    };
  }, [decodedUsername]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void py-24 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url('${getAssetPath("/images/background.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/74 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="pointer-events-none absolute inset-4 border border-gold-dim/20 md:inset-8" />

      <div className="relative z-10">
        {loadState.status === "loading" && <ProfileLoading />}
        {loadState.status === "error" && <ProfileError message={loadState.message} />}
        {loadState.status === "loaded" && <PlayerProfile {...loadState.result} />}
      </div>
    </main>
  );
}
