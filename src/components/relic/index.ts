/**
 * RELIC — the site's single source of truth for MythStride's visual language.
 *
 * Import from here, never from an asset path:
 *
 *     import { MythBossMedal, RelicFrame } from "@/components/relic";
 *
 * A page that reaches for `/assets/mythstride/...` directly has stepped around
 * the frame table in `lib/relic-frames.ts`, which is where the pack's authored
 * slice insets live. That is how a frame ends up with smeared corners.
 */

export { RelicFrame, default as RelicFrameDefault } from "./RelicFrame";
export { MythBossMedal } from "./MythBossMedal";
export { BossHealthBar } from "./BossHealthBar";
export { MythGlyph } from "./MythGlyph";

export {
  MYTH_GLYPHS,
  RELIC_ART,
  RELIC_FRAMES,
  relicFrameVars,
  type MythGlyphName,
  type RelicFrameKey,
  type RelicFrameSpec,
} from "@/lib/relic-frames";
