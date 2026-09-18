import type { CSSProperties } from "react";

interface BossHealthBarProps {
  /** Health remaining. */
  value: number;
  /** Full health. `100` when the caller only has a percentage. */
  max: number;
  /**
   * Where the bar starts before it drains to `value`.
   *
   * Only the Home's battle section uses it: the bar is painted at `from` and
   * the stylesheet animates it down to `value` when the section is revealed,
   * which is how that page shows a run landing on a boss. Leave it out and the
   * bar simply sits at `value`, which is what a live readout wants.
   */
  from?: number;
  /** Accessible name — the bar carries no text of its own. */
  label: string;
  className?: string;
}

const percent = (value: number, max: number) =>
  `${((Math.min(Math.max(value, 0), max) / max) * 100).toFixed(1)}%`;

/**
 * The boss health rail, exactly as the Home's battle section draws it.
 *
 * ── WHY THIS IS A COMPONENT AND NOT A SECOND BAR ────────────────────────────
 *
 * The Dashboard used to render its boss health through `MythProgressMeter`
 * with the relic HUD frame turned on. That is a different object — a rounded,
 * framed meter built for a percentage — and beside the Home it read as another
 * product. There is one boss bar in MythStride, so there is one component.
 *
 * It owns no styling: `.boss-hud__bar` and `.boss-hud__bar-fill` already exist
 * in the stylesheet and are unchanged, so the Home renders pixel for pixel what
 * it rendered before this was extracted.
 */
export function BossHealthBar({
  value,
  max,
  from,
  label,
  className = "",
}: BossHealthBarProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);

  const style = {
    ["--hp-to" as string]: percent(clamped, safeMax),
    // Only set when the caller wants the drain, so a live readout paints once.
    ...(from === undefined
      ? {}
      : { ["--hp-from" as string]: percent(from, safeMax) }),
  } as CSSProperties;

  return (
    <div
      className={`boss-hud__bar ${className}`.trim()}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={safeMax}
    >
      <span className="boss-hud__bar-fill" style={style} />
    </div>
  );
}

export default BossHealthBar;
