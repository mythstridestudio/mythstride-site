"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAssetPath } from "@/lib/assets";
import { AUTH_ENDPOINTS, AUTH_TOKEN_STORAGE_KEY, readStoredAccessToken } from "@/lib/api/auth";
import { ArrowRightIcon, CrownIcon, ShieldIcon, SwordsIcon, TrophyIcon, WatchIcon } from "@/components/Icons";

type DashboardStatus = "loading" | "needs-auth" | "ready" | "error";

function StatePanel({
  title,
  description,
  tone = "gold",
}: {
  title: string;
  description: string;
  tone?: "gold" | "ember" | "emerald";
}) {
  const toneClass = {
    gold: "border-gold-dim/25 text-gold",
    ember: "border-fiery-orange/25 text-fiery-orange",
    emerald: "border-emerald/25 text-emerald",
  }[tone];

  return (
    <div className={`rounded-[20px] border bg-void/68 p-5 ${toneClass}`}>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
  );
}

function EndpointList() {
  const endpoints = [
    ["Login", AUTH_ENDPOINTS.login],
    ["Profile", AUTH_ENDPOINTS.playerProfile],
    ["Current boss", AUTH_ENDPOINTS.currentBoss],
    ["Trophies", AUTH_ENDPOINTS.trophies],
    ["History", AUTH_ENDPOINTS.history],
  ];

  return (
    <div className="space-y-3">
      {endpoints.map(([label, endpoint]) => (
        <div
          key={endpoint}
          className="flex items-center justify-between gap-4 rounded-[16px] border border-gold-dim/15 bg-charcoal/35 px-4 py-3"
        >
          <span className="text-sm text-text-primary">{label}</span>
          <code className="font-mono text-xs text-text-muted">{endpoint}</code>
        </div>
      ))}
    </div>
  );
}

export default function DashboardShell() {
  const [status, setStatus] = useState<DashboardStatus>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = readStoredAccessToken();
      setStatus(token ? "ready" : "needs-auth");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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
        <a href={getAssetPath("/")} className="mb-8 inline-flex items-center gap-2">
          <img src={getAssetPath("/images/mythstride-app-icon.png")} alt="" className="h-9 w-9 rounded-full" />
          <span className="font-display text-lg tracking-wider text-gold">
            Myth<span className="text-gold-bright">Stride</span>
          </span>
        </a>

        <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr]">
          <section className="app-panel app-panel-compact p-6 md:p-7">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <ShieldIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Protected route</p>
                <h1 className="font-display text-3xl text-gold md:text-4xl">Dashboard foundation</h1>
              </div>
            </div>

            <p className="leading-relaxed text-text-secondary">
              This route is reserved for the authenticated MythStride experience. It keeps the shell, API contracts,
              and state handling in place while the backend auth contract is finalized.
            </p>

            <div className="mt-7 space-y-4">
              {status === "loading" && (
                <StatePanel
                  title="Loading state"
                  description="Checking for a stored session placeholder before authenticated API calls are enabled."
                />
              )}

              {status === "needs-auth" && (
                <StatePanel
                  title="Authentication required"
                  description="No local session placeholder was found. The full login flow will be added after the backend contract is confirmed."
                  tone="ember"
                />
              )}

              {status === "ready" && (
                <StatePanel
                  title="Authenticated shell ready"
                  description="A stored access token placeholder exists. Private endpoint fetching is intentionally not active yet."
                  tone="emerald"
                />
              )}

              {status === "error" && (
                <StatePanel
                  title="Error state"
                  description="Future private API failures will render here with retry and recovery actions."
                  tone="ember"
                />
              )}

              <StatePanel
                title="Empty state"
                description="When authenticated data returns no active boss, trophies, or history, this shell will show purposeful empty states instead of fabricated activity."
              />
            </div>

            <div className="mt-7 rounded-[20px] border border-gold-dim/20 bg-charcoal/35 p-5">
              <h2 className="font-display text-xl text-gold">Auth TODO</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                <li>Confirm request and response shape for login.</li>
                <li>Confirm whether sessions should use httpOnly cookies or bearer tokens.</li>
                <li>Replace local storage placeholder if the backend provides a safer session model.</li>
              </ul>
              <div className="mt-4 rounded-[14px] border border-gold-dim/15 bg-void/60 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-text-muted">Temporary key</div>
                <code className="mt-1 block font-mono text-xs text-gold">{AUTH_TOKEN_STORAGE_KEY}</code>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="app-panel app-panel-compact p-6 md:p-7">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Authenticated area structure</p>
                  <h2 className="mt-2 font-display text-3xl text-gold md:text-4xl">Player command hall</h2>
                </div>
                <a href={`${getAssetPath("/")}#join`} className="ghost-button px-5 py-2.5 font-display text-xs tracking-wider">
                  Begin Your Journey
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[20px] border border-gold-dim/20 bg-void/70 p-5">
                  <CrownIcon className="mb-4 h-6 w-6 text-gold" />
                  <h3 className="font-display text-xl text-gold">Profile</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">Public identity, level, title, and guild data.</p>
                </div>
                <div className="rounded-[20px] border border-fiery-orange/20 bg-fiery-orange/5 p-5">
                  <SwordsIcon className="mb-4 h-6 w-6 text-fiery-orange" />
                  <h3 className="font-display text-xl text-gold">Boss</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">Current encounter and progress from real runs.</p>
                </div>
                <div className="rounded-[20px] border border-emerald/20 bg-emerald/5 p-5">
                  <TrophyIcon className="mb-4 h-6 w-6 text-emerald" />
                  <h3 className="font-display text-xl text-gold">Rewards</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">Trophies, loot, history, and achievement unlocks.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="app-panel app-panel-compact p-6">
                <div className="mb-5 flex items-center gap-2 text-gold">
                  <WatchIcon className="h-5 w-5" />
                  <h2 className="font-display text-2xl">Expected endpoints</h2>
                </div>
                <EndpointList />
              </div>

              <div className="app-panel app-panel-compact p-6">
                <h2 className="font-display text-2xl text-gold">API organization</h2>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  Shared fetch logic lives in <code className="font-mono text-gold">src/lib/api/client.ts</code>.
                  Public-safe DTOs and private dashboard contracts live in typed API modules so components do not
                  duplicate endpoint behavior.
                </p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
