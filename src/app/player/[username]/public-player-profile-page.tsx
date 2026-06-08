"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getAssetPath } from "@/lib/assets";
import { ApiConfigurationError, ApiError } from "@/lib/api/client";
import { getPublicPlayer, type PublicPlayerResult } from "@/lib/api/public-player";
import type { AchievementRarity, PublicPlayerProfile } from "@/lib/api/types";
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

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; result: PublicPlayerResult }
  | { status: "error"; message: string };

type RarityView = {
  label: string;
  className: string;
  wellClassName: string;
};

const rarityViews: Record<AchievementRarity, RarityView> = {
  common: {
    label: "Common",
    className: "border-text-muted/35 text-text-secondary",
    wellClassName: "rarity-common",
  },
  uncommon: {
    label: "Uncommon",
    className: "border-emerald/35 text-emerald",
    wellClassName: "rarity-uncommon",
  },
  rare: {
    label: "Rare",
    className: "border-diamond/40 text-diamond",
    wellClassName: "rarity-rare",
  },
  epic: {
    label: "Epic",
    className: "border-magic-purple/45 text-magic-purple",
    wellClassName: "border-magic-purple/45 [--rarity-glow:rgba(141,69,214,0.28)]",
  },
  legendary: {
    label: "Legendary",
    className: "border-gold-bright/50 text-gold-bright",
    wellClassName: "rarity-legendary",
  },
  mythic: {
    label: "Mythic",
    className: "border-fiery-orange/55 text-fiery-orange",
    wellClassName: "border-fiery-orange/55 [--rarity-glow:rgba(232,98,42,0.36)]",
  },
};

function formatDistance(distanceKm: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(distanceKm);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
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
    return "This champion profile was not found.";
  }

  if (error instanceof ApiError) {
    return "The MythStride API could not load this champion profile.";
  }

  return "This champion profile is temporarily unavailable.";
}

function getMediaPath(path: string | null | undefined) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  return getAssetPath(path);
}

function getSharedStat(value: number | undefined, suffix = "") {
  return typeof value === "number" ? `${formatNumber(value)}${suffix}` : "Not shared";
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

function ProfileError({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="app-panel p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-fiery-orange/35 bg-fiery-orange/10 text-fiery-orange">
          <ShieldIcon className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl text-gold md:text-4xl">Champion profile unavailable</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-secondary">{message}</p>
        <a href={`${getAssetPath("/")}#join`} className="myth-button-primary mt-8 px-8 py-3 font-display text-sm tracking-wider">
          Begin Your Journey
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
    <div className="rounded-[18px] border border-gold-dim/20 bg-void/72 p-4">
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
    <div className="relative overflow-hidden rounded-[22px] border border-gold-dim/20 bg-charcoal/35 p-5">
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
  return (
    <section className="app-panel app-panel-compact relative overflow-hidden p-5 md:p-7">
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/45 to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Champion card</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-gold-bright md:text-5xl">
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
          <div className="min-w-20 rounded-[18px] border border-gold/35 bg-gold/10 px-4 py-3 text-center">
            <div className="font-display text-4xl leading-none text-gold">{player.level}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-text-muted">Level</div>
          </div>
        </div>

        <div className="my-7 h-px bg-gradient-to-r from-transparent via-gold-dim/35 to-transparent" />

        <div className="grid gap-4 sm:grid-cols-3">
          <HeroStat label="Flame streak" value={`${player.currentStreakDays} days`} icon={SparkleIcon} tone="ember" />
          <HeroStat label="Guild" value={player.guild?.name ?? "No guild"} icon={UsersIcon} tone="emerald" />
          <HeroStat label="Distance" value={`${formatDistance(player.totalDistanceKm)} km`} icon={MapIcon} />
        </div>
      </div>
    </section>
  );
}

function BossProgress({ player }: { player: PublicPlayerProfile }) {
  const boss = player.currentBoss;
  const healthPercent = Math.max(0, Math.min(100, boss?.healthPercent ?? 0));
  const damagePercent = 100 - healthPercent;

  return (
    <section className="app-panel app-panel-compact relative overflow-hidden p-5 md:p-7">
      <div className="absolute inset-0 boss-halo opacity-75" />
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative aspect-square overflow-hidden rounded-[24px] border border-fiery-orange/25 bg-rich-brown/35">
          {boss ? (
            <img
              src={getMediaPath(boss.imageUrl)}
              alt={boss.name}
              className="h-full w-full object-contain p-8 drop-shadow-[0_0_42px_rgba(232,98,42,0.32)]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-text-muted">
              No active boss
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fiery-orange/30 bg-fiery-orange/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-fiery-orange">
            <SkullIcon className="h-4 w-4" />
            Boss progress
          </div>
          <h2 className="font-display text-4xl leading-tight text-gold md:text-5xl">
            {boss?.name ?? "The next shadow has not appeared."}
          </h2>
          <p className="mt-4 font-display text-2xl text-fiery-orange">The Dark Mist still advances.</p>

          {boss && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                <span className="text-text-secondary">Health remaining</span>
                <span className="font-semibold text-fiery-orange">{healthPercent}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-fiery-orange/30 bg-void">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-hp-red via-fiery-orange to-amber"
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-text-muted">
                <span>{damagePercent}% weakened</span>
                <span>{healthPercent}% remains</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AchievementGrid({ player }: { player: PublicPlayerProfile }) {
  const achievements = player.rareAchievements;

  return (
    <section className="app-panel app-panel-compact p-5 md:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Achievements</p>
          <h2 className="mt-2 font-display text-3xl text-gold md:text-4xl">Relics of the Journey</h2>
        </div>
        <TrophyIcon className="h-8 w-8 text-gold-dim" />
      </div>

      {achievements.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {achievements.map((achievement) => {
            const rarity = rarityViews[achievement.rarity];

            return (
              <div
                key={`${achievement.name}-${achievement.rarity}`}
                className={`relative overflow-hidden rounded-[22px] border bg-void/70 p-4 ${rarity.className}`}
              >
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
                <div className={`rarity-well ${rarity.wellClassName} mx-auto flex h-24 w-24 items-center justify-center p-3`}>
                  <img src={getMediaPath(achievement.iconUrl)} alt="" className="h-full w-full object-contain" />
                </div>
                <h3 className="mt-4 font-display text-xl text-gold">{achievement.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">{rarity.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[22px] border border-gold-dim/20 bg-void/65 p-6 text-sm leading-relaxed text-text-muted">
          No public achievements shared yet.
        </div>
      )}
    </section>
  );
}

function JourneyStatistics({ player }: { player: PublicPlayerProfile }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <JourneyRelic
        label="Total distance"
        value={`${formatDistance(player.totalDistanceKm)} km`}
        detail="Ground crossed in the real world and carried into Elyndor."
        icon={MapIcon}
      />
      <JourneyRelic
        label="Total runs"
        value={getSharedStat(undefined)}
        detail="Adventures recorded in the runner's public chronicle."
        icon={BookIcon}
      />
      <JourneyRelic
        label="Current streak"
        value={`${player.currentStreakDays} days`}
        detail="The Flame kept alive through repeated effort."
        icon={SparkleIcon}
      />
      <JourneyRelic
        label="Bosses defeated"
        value={getSharedStat(undefined)}
        detail="Shadows already driven back from the path."
        icon={SwordsIcon}
      />
    </section>
  );
}

function AdventureLog({ player }: { player: PublicPlayerProfile }) {
  const latestRun = player.latestRun;

  return (
    <section className="app-panel app-panel-compact relative overflow-hidden p-5 md:p-7">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="relative">
        <div className="mb-6 flex items-center gap-3 text-fiery-orange">
          <BookIcon className="h-6 w-6" />
          <h2 className="font-display text-3xl text-gold md:text-4xl">Adventure Log</h2>
        </div>

        {latestRun ? (
          <div className="grid gap-5 md:grid-cols-[0.45fr_1fr] md:items-center">
            <div className="rounded-[22px] border border-fiery-orange/25 bg-fiery-orange/5 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-text-muted">Distance</div>
              <div className="mt-2 font-display text-4xl text-gold-bright">
                {formatDistance(latestRun.distanceKm)} km
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-text-muted">Date</div>
              <div className="mt-2 text-sm text-text-secondary">{formatDate(latestRun.date)}</div>
            </div>
            <div>
              <p className="font-display text-2xl leading-snug text-gold md:text-3xl">
                {latestRun.summary ?? "Latest adventure recorded by MythStride."}
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                The latest public adventure from {player.displayName}&apos;s chronicle.
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-[22px] border border-gold-dim/20 bg-void/65 p-6 text-sm leading-relaxed text-text-muted">
            No public adventure has been shared yet.
          </p>
        )}
      </div>
    </section>
  );
}

function GuildSection({ player }: { player: PublicPlayerProfile }) {
  if (!player.guild) {
    return null;
  }

  return (
    <section className="app-panel app-panel-compact relative overflow-hidden p-5 md:p-7">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald/10 blur-3xl" />
      <div className="relative grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[24px] border border-emerald/30 bg-emerald/8 text-emerald">
          <UsersIcon className="h-10 w-10" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Guild banner</p>
          <h2 className="mt-2 font-display text-3xl text-gold md:text-4xl">{player.guild.name}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
            Guild description will be revealed when this banner is expanded by the realm.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalProfileCTA() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-gold-dim/25 bg-void/80 p-8 text-center md:p-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('${getAssetPath("/images/aethron-scroll-bg.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/76 to-void" />
      <div className="relative">
        <SparkleIcon className="mx-auto mb-5 h-8 w-8 text-emerald" />
        <h2 className="font-display text-4xl leading-tight text-gold-bright md:text-5xl">
          Answer Aethron&apos;s Call
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-text-secondary">
          Begin your own journey through Elyndor and turn each run into progress against the Dark Mist.
        </p>
        <a href={`${getAssetPath("/")}#join`} className="myth-button-primary mt-8 px-9 py-4 font-display text-sm tracking-wider">
          <SwordsIcon className="h-4 w-4" />
          Begin Your Journey
        </a>
      </div>
    </section>
  );
}

function PlayerProfile({ player, source, fallbackReason }: PublicPlayerResult) {
  const boss = player.currentBoss;
  const healthPercent = Math.max(0, Math.min(100, boss?.healthPercent ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-6">
      {source === "development-mock" && (
        <div className="mx-auto mb-6 max-w-4xl rounded-full border border-amber/35 bg-amber/10 px-5 py-3 text-center text-xs leading-relaxed text-amber">
          Temporary local development mock. Production will show API data only. {fallbackReason}
        </div>
      )}

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <section className="app-panel relative overflow-hidden p-5 md:p-8">
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
              <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">Legendary adventurer profile</p>
              <h1 className="mt-4 font-display text-5xl leading-none text-gold-bright md:text-7xl">
                {player.displayName}
              </h1>
              <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-gold md:text-3xl">
                {player.title}
              </p>
              <p className="mt-5 max-w-2xl leading-relaxed text-text-secondary">
                A public champion record from Elyndor, carrying the runner&apos;s level, flame streak, guild banner,
                boss pressure, achievements, and latest adventure.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <HeroStat label="Level" value={`${player.level}`} icon={CrownIcon} />
                <HeroStat label="Boss" value={boss?.name ?? "None"} icon={SkullIcon} tone="ember" />
                <HeroStat label="Streak" value={`${player.currentStreakDays} days`} icon={SparkleIcon} tone="ember" />
                <HeroStat label="Distance" value={`${formatDistance(player.totalDistanceKm)} km`} icon={MapIcon} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 boss-halo rounded-full blur-2xl opacity-80" />
              <div className="relative overflow-hidden rounded-[28px] border border-gold-dim/25 bg-void/76 p-5">
                <div className="absolute inset-0 bg-stone-texture opacity-20" />
                <div className="relative aspect-square rounded-[24px] border border-fiery-orange/20 bg-rich-brown/35">
                  {boss ? (
                    <img
                      src={getMediaPath(boss.imageUrl)}
                      alt={boss.name}
                      className="h-full w-full object-contain p-8 drop-shadow-[0_0_42px_rgba(232,98,42,0.3)]"
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
                      <span className="font-display text-xl text-gold">{boss.name}</span>
                      <span className="text-sm font-semibold text-fiery-orange">{healthPercent}% health</span>
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
      <div className="absolute inset-0 bg-gradient-to-b from-void/92 via-void/78 to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="pointer-events-none absolute inset-4 border border-gold-dim/20 md:inset-8" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fiery-orange/10 blur-3xl" />

      <div className="relative z-10">
        {loadState.status === "loading" && <ProfileLoading />}
        {loadState.status === "error" && <ProfileError message={loadState.message} />}
        {loadState.status === "loaded" && <PlayerProfile {...loadState.result} />}
      </div>
    </main>
  );
}
