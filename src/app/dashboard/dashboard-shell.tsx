"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ApiConfigurationError, ApiError, ApiNetworkError } from "@/lib/api/client";
import { getDashboardData, type DashboardData } from "@/lib/api/player";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetPath } from "@/lib/assets";
import { getBossImagePath, getBossMedalPath } from "@/lib/boss-medals";
import {
  ArrowRightIcon,
  BookIcon,
  CrownIcon,
  ShieldIcon,
  SkullIcon,
  SwordsIcon,
  TrophyIcon,
  WatchIcon,
} from "@/components/Icons";

type DashboardState =
  | { status: "loading" }
  | { status: "ready"; data: DashboardData }
  | { status: "error"; message: string };

function formatDistance(value?: number) {
  if (typeof value !== "number") {
    return "Not available";
  }

  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)} km`;
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
    return "NEXT_PUBLIC_API_BASE_URL is not configured for this environment.";
  }

  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    return "Your session expired. Please log in again.";
  }

  if (error instanceof ApiNetworkError) {
    return "The MythStride API is offline or unreachable. Please try again soon.";
  }

  return "The MythStride API could not load your dashboard.";
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
    <section className="app-panel app-panel-compact relative overflow-hidden p-5 md:p-6">
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
    <div className="rounded-[18px] border border-gold-dim/18 bg-void/62 p-5 text-sm leading-relaxed text-text-muted">
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

function DashboardContent({ data, onLogout }: { data: DashboardData; onLogout: () => void }) {
  const { profile, currentBoss, trophies, history } = data;
  const displayName = profile.displayName ?? profile.username;
  const shownTrophies = trophies.slice(0, 4);
  const recentRuns = history.slice(0, 4);
  const bossImageSrc = getImagePath(currentBoss?.imageUrl) ?? getBossMedalPath(currentBoss?.name);
  const bossHealth = Math.max(0, Math.min(100, currentBoss?.healthPercent ?? 0));

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Champion Summary" icon={CrownIcon}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-fiery-orange">@{profile.username}</p>
            <h1 className="mt-3 font-display text-4xl leading-none text-gold-bright md:text-5xl">
              {displayName}
            </h1>
            <p className="mt-3 text-lg text-gold">{profile.title ?? "MythStride Champion"}</p>
          </div>
          <div className="w-24 rounded-[18px] border border-gold/35 bg-gold/10 px-4 py-3 text-center">
            <div className="font-display text-4xl leading-none text-gold">{profile.level}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-text-muted">Level</div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="resource-pill justify-center text-sm text-text-secondary">{formatDistance(profile.totalDistanceKm)}</div>
          <div className="resource-pill justify-center text-sm text-text-secondary">
            {typeof profile.currentStreakDays === "number" ? `${profile.currentStreakDays} day streak` : "No streak shared"}
          </div>
          <div className="resource-pill justify-center text-sm text-text-secondary">
            {profile.guild?.name ?? "No guild"}
          </div>
        </div>
      </Panel>

      <Panel title="Current Boss" icon={SkullIcon}>
        <PartialNotice>{data.partialErrors.currentBoss}</PartialNotice>
        {currentBoss ? (
          <div className="grid gap-5 sm:grid-cols-[0.36fr_1fr] sm:items-center">
            <div className="aspect-square rounded-[20px] border border-fiery-orange/25 bg-rich-brown/35 p-4">
              {bossImageSrc ? (
                <img
                  src={bossImageSrc}
                  alt={currentBoss.name}
                  className="h-full w-full object-contain drop-shadow-[0_0_32px_rgba(232,98,42,0.28)]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-xs text-text-muted">Boss image unavailable</div>
              )}
            </div>
            <div>
              <h3 className="font-display text-3xl text-gold-bright">{currentBoss.name}</h3>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm text-text-secondary">
                  <span>Health remaining</span>
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
          <EmptyState>No active boss was returned by the backend.</EmptyState>
        )}
      </Panel>

      <Panel title="Recent Runs / Adventure Log" icon={BookIcon}>
        <PartialNotice>{data.partialErrors.history}</PartialNotice>
        {recentRuns.length > 0 ? (
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div key={run.id} className="rounded-[18px] border border-gold-dim/16 bg-void/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-xl text-gold">{formatDistance(run.distanceKm)}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">{formatDate(run.date)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {run.summary ?? "Run completed and recorded by MythStride."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>No recent runs were returned by the backend.</EmptyState>
        )}
      </Panel>

      <div className="grid gap-6">
        <Panel title="Achievements Preview" icon={TrophyIcon}>
          <PartialNotice>{data.partialErrors.trophies}</PartialNotice>
          {shownTrophies.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {shownTrophies.map((trophy) => (
                <div key={trophy.id} className="rounded-[18px] border border-gold-dim/16 bg-void/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gold">
                    <TrophyIcon className="h-4 w-4" />
                    <h3 className="font-display text-lg">{trophy.name}</h3>
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-fiery-orange">{trophy.rarity}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>No achievements were returned by the backend.</EmptyState>
          )}
        </Panel>

        <Panel title="Account Actions" icon={ShieldIcon}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/player/${encodeURIComponent(profile.username)}`} className="myth-button-secondary px-6 py-3 font-display text-sm tracking-wider">
              Public Profile
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <button type="button" onClick={onLogout} className="myth-button-primary px-6 py-3 font-display text-sm tracking-wider">
              Logout
              <SwordsIcon className="h-4 w-4" />
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function DashboardShell() {
  const router = useRouter();
  const { token, status: authStatus, logout } = useAuth();
  const [dashboardState, setDashboardState] = useState<DashboardState>({ status: "loading" });

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
            setDashboardState({ status: "error", message: getErrorMessage(error) });
          }
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [authStatus, logout, router, token]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-void py-24 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('${getAssetPath("/images/background.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/95 via-void/76 to-void" />
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="pointer-events-none absolute inset-4 border border-gold-dim/20 md:inset-8" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <img src={getAssetPath("/images/mythstride-app-icon.png")} alt="" className="h-9 w-9 rounded-full" />
          <span className="font-display text-lg tracking-wider text-gold">
            Myth<span className="text-gold-bright">Stride</span>
          </span>
        </Link>

        <div className="mb-8 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">Protected dashboard</p>
          <h1 className="font-display text-4xl leading-tight text-gold-bright md:text-6xl">Champion Command Hall</h1>
          <p className="max-w-3xl leading-relaxed text-text-secondary">
            Your private MythStride profile, active boss, achievements, and recent adventure history.
          </p>
        </div>

        {(authStatus === "loading" || dashboardState.status === "loading") && (
          <div className="app-panel app-panel-compact p-8">
            <div className="flex items-center gap-3 text-gold">
              <WatchIcon className="h-5 w-5 animate-pulse" />
              <span className="font-display text-2xl">Loading your profile...</span>
            </div>
          </div>
        )}

        {dashboardState.status === "error" && (
          <div className="app-panel app-panel-compact max-w-3xl p-8">
            <h2 className="font-display text-3xl text-gold">Dashboard unavailable</h2>
            <p className="mt-4 leading-relaxed text-text-secondary">{dashboardState.message}</p>
          </div>
        )}

        {dashboardState.status === "ready" && <DashboardContent data={dashboardState.data} onLogout={logout} />}
      </motion.div>
    </main>
  );
}
