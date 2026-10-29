"use client";

import Image from "next/image";
import { SkullIcon } from "@/components/Icons";
import { BossHealthBar } from "@/components/relic";
import { getBossImagePath, getBossMedalPath } from "@/lib/boss-medals";
import type { CurrentBoss } from "@/lib/api/types";

interface CurrentBossCardProps {
  boss: CurrentBoss | null | undefined;
  title: string;
  healthLabel: string;
  emptyLabel: string;
  imageUnavailableLabel: string;
  notice?: string | null;
}

/**
 * The same boss card used by the dashboard and public player profile.
 * Keep the rail in BossHealthBar, so its CSS, sheen and proportions never drift.
 */
export default function CurrentBossCard({
  boss,
  title,
  healthLabel,
  emptyLabel,
  imageUnavailableLabel,
  notice,
}: CurrentBossCardProps) {
  const bossImageSrc = getBossImagePath(boss?.imageUrl) ?? getBossMedalPath(boss?.name);
  const rawHealth = boss?.healthPercent;
  const bossHealth = typeof rawHealth === "number" && Number.isFinite(rawHealth)
    ? Math.max(0, Math.min(100, rawHealth))
    : 0;

  return (
    <section className="app-panel app-panel-compact rpg-card relative overflow-hidden p-4 sm:p-5 md:p-6">
      <div className="absolute inset-0 bg-stone-texture opacity-20" />
      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <SkullIcon className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl text-gold">{title}</h2>
        </div>

        {notice && (
          <div className="mb-4 rounded-[16px] border border-amber/30 bg-amber/10 px-4 py-3 text-sm leading-relaxed text-amber" role="status">
            {notice}
          </div>
        )}

        {boss ? (
          <div className="grid gap-5 sm:grid-cols-[0.36fr_1fr] sm:items-center">
            <div className="rpg-inset aspect-square rounded-[16px] border-fiery-orange/25 p-4">
              {bossImageSrc ? (
                <Image
                  src={bossImageSrc}
                  alt={boss.name}
                  width={320}
                  height={320}
                  unoptimized
                  className="h-full w-full object-contain drop-shadow-[0_0_32px_rgba(232,98,42,0.28)]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-xs text-text-muted">
                  {imageUnavailableLabel}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="break-words font-display text-3xl text-gold-bright">{boss.name}</h3>
              <div className="mt-5">
                <div className="mb-2 flex justify-between gap-3 text-sm text-text-secondary">
                  <span>{healthLabel}</span>
                  <span className="shrink-0 text-fiery-orange">{bossHealth}%</span>
                </div>
                <BossHealthBar value={bossHealth} max={100} label={`${boss.name} — ${healthLabel}`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="rpg-inset rounded-[14px] p-5 text-sm leading-relaxed text-text-muted">
            {emptyLabel}
          </div>
        )}
      </div>
    </section>
  );
}
