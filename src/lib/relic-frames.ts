/**
 * RELIC — the authored frame table, transcribed for the web.
 *
 * ── WHERE THESE NUMBERS COME FROM ───────────────────────────────────────────
 *
 * The MythStride app ships a nine-slice pack. Each frame is authored at a
 * logical size with a `centerSlice` rectangle naming the stretchable middle;
 * the app paints it with `Canvas.drawImageNine`. The source of truth is
 * `lib/widgets/relic_kit/relic_kit_slices.dart` in the Flutter repository —
 * every value below was copied from it, not measured or guessed.
 *
 * The web equivalent of `drawImageNine` is `border-image`, so each entry
 * carries what CSS needs:
 *
 *   `slice`  the four insets **in image pixels**, for `border-image-slice`.
 *            The pack states them in logical units, so they are multiplied by
 *            the density of the file we ship (2).
 *   `width`  the same insets **in CSS pixels**, for `border-image-width`.
 *            This is what keeps the ornament at its authored thickness
 *            instead of scaling with the element.
 *
 * ── WHY @2x AND NOT @3x ─────────────────────────────────────────────────────
 *
 * The pack authors @1x/@2x/@3x. The app declares @3x because a phone renders
 * at up to 3× device-pixel-ratio. On the web these frames are drawn at their
 * authored thickness — a 30 px card border, a 60 px button cap — so @2x already
 * covers a retina display, and @3x would roughly double the payload for no
 * visible gain. Nothing is re-encoded: this is an authored density, chosen, not
 * a conversion.
 */

import type { CSSProperties } from "react";

import { getAssetPath } from "./assets";

export type RelicFrameKey =
  | "cards/card_frame_clean_landscape"
  | "surfaces/panel_standard"
  | "buttons/primary_frame"
  | "buttons/secondary_frame"
  | "topbar/top_bar_frame"
  | "energy/hp_hud_frame";

export interface RelicFrameSpec {
  /** Public path, relative to the site root. */
  readonly asset: string;
  /** Authored logical size, straight from the pack. */
  readonly logical: { readonly w: number; readonly h: number };
  /** `border-image-slice`, in pixels of the shipped file. */
  readonly slice: readonly [number, number, number, number];
  /** `border-image-width`, in CSS pixels. Same order: top right bottom left. */
  readonly width: readonly [number, number, number, number];
  /**
   * Below this the art cannot be drawn and the caller should use a plain edge.
   * The app hits the same wall — see `relic_kit_dress.dart`.
   */
  readonly minSize: { readonly w: number; readonly h: number };
}

/** The density of the files under `public/assets/mythstride/relic/`. */
const SHIPPED_DENSITY = 2;

/**
 * Builds a spec from the pack's own vocabulary, so an entry reads the same way
 * it does in `relic_kit_slices.dart` and can be checked against it line by line.
 *
 * `centerSlice` is LTRB, like Flutter's `Rect.fromLTRB`.
 */
function spec(
  asset: string,
  logicalW: number,
  logicalH: number,
  centerSlice: readonly [number, number, number, number],
): RelicFrameSpec {
  const [left, top, right, bottom] = centerSlice;

  // Flutter states the center rectangle; CSS wants the four margins around it.
  const insetTop = top;
  const insetRight = logicalW - right;
  const insetBottom = logicalH - bottom;
  const insetLeft = left;

  return {
    asset,
    logical: { w: logicalW, h: logicalH },
    slice: [
      insetTop * SHIPPED_DENSITY,
      insetRight * SHIPPED_DENSITY,
      insetBottom * SHIPPED_DENSITY,
      insetLeft * SHIPPED_DENSITY,
    ],
    width: [insetTop, insetRight, insetBottom, insetLeft],
    minSize: { w: insetLeft + insetRight + 1, h: insetTop + insetBottom + 1 },
  };
}

const RELIC_ROOT = "/assets/mythstride/relic";

export const RELIC_FRAMES: Readonly<Record<RelicFrameKey, RelicFrameSpec>> = {
  // logicalSize 300x60, centerSlice LTRB(30, 5, 270, 55)
  "cards/card_frame_clean_landscape": spec(
    `${RELIC_ROOT}/cards/card_frame_clean_landscape@2x.png`,
    300,
    60,
    [30, 5, 270, 55],
  ),
  // logicalSize 240x104, centerSlice LTRB(43, 19, 197, 85)
  "surfaces/panel_standard": spec(
    `${RELIC_ROOT}/surfaces/panel_standard@2x.png`,
    240,
    104,
    [43, 19, 197, 85],
  ),
  // logicalSize 300x77, centerSlice LTRB(60, 0, 240, 77) — horizontal only.
  "buttons/primary_frame": spec(
    `${RELIC_ROOT}/buttons/primary_frame@2x.png`,
    300,
    77,
    [60, 0, 240, 77],
  ),
  // logicalSize 118x32, centerSlice LTRB(24, 0, 94, 32) — horizontal only.
  "buttons/secondary_frame": spec(
    `${RELIC_ROOT}/buttons/secondary_frame@2x.png`,
    118,
    32,
    [24, 0, 94, 32],
  ),
  // logicalSize 300x38, centerSlice LTRB(6, 0, 294, 38) — horizontal only.
  "topbar/top_bar_frame": spec(
    `${RELIC_ROOT}/topbar/top_bar_frame@2x.png`,
    300,
    38,
    [6, 0, 294, 38],
  ),
  // logicalSize 300x8, centerSlice LTRB(10, 0, 290, 8) — the HUD rail the app
  // puts under a health value. Horizontal only: the 10 px caps hold, the
  // middle stretches to whatever width and height the bar is given.
  "energy/hp_hud_frame": spec(
    `${RELIC_ROOT}/energy/hp_hud_frame@2x.png`,
    300,
    8,
    [10, 0, 290, 8],
  ),
};

/**
 * Whole-art pieces. Not nine-sliced: drawn complete at whatever size the slot
 * gives them, so they carry no insets.
 *
 * Only what something actually renders lives here. The pack's ornament family
 * — dividers, corner brackets — is deliberately absent: nothing on this site
 * consumes one, and a section seam on every heading is the ornament-everywhere
 * failure the migration is meant to avoid.
 */
export const RELIC_ART = {
  bossSeat: `${RELIC_ROOT}/medallions/boss_seat@2x.png`,
} as const;

/**
 * Artwork glyphs the product already ships, for subjects the site names.
 *
 * These replace a hand-drawn web icon **only** where MythStride has authored
 * art for exactly that thing. There is no gold entry: no surface on this site
 * names gold on its own, and shipping an unused asset is dead weight.
 */
export const MYTH_GLYPHS = {
  diamond: "/assets/mythstride/icons/diamonds.png",
  inventory: "/assets/mythstride/icons/inventory_backpack.png",
  achievements: "/assets/mythstride/icons/achievements.png",
  // The blade itself, from `assets/itens/mythstride_founder_sword.png`. Note
  // it is not `images/optimized/founder-sword.webp`, which is a different,
  // fiery sword: the Founder mark is light on a cool ground (V100 / L44), and
  // the homologated blade is the cyan one.
  founderSword: "/assets/mythstride/icons/founder_sword.png",
  // The authored Aethron sigil, from `assets/aethron/sig_aethron_01.png`. The
  // panel that holds it has always been called `__sigil`; it just had a drawn
  // wand in it, while the product shipped the real mark.
  aethronSigil: "/assets/mythstride/icons/aethron_sigil.png",
  // `assets/trophies/season_champion_gold.png`. One trophy, not the four-tier
  // ladder: no surface on this site names a bronze or diamond champion, and
  // shipping the other three would be the dead weight this table already
  // refuses for gold.
  seasonChampion: "/assets/mythstride/icons/season_champion.png",
  // The Dashboard's own world-card art, from
  // `assets/ui/dashboard/world_cards/`. These are the pieces the app puts on
  // the "Raid Ativa" and "Ameaça da Saga" cards — not the geometric marks in
  // `dashboard_glyphs.dart`, which that file's own header calls temporary
  // placeholders awaiting the D-12 wear scale.
  raidActive: "/assets/mythstride/icons/raid_active.png",
  sagaThreat: "/assets/mythstride/icons/saga_threat.png",
  // `assets/ui/icons/social/social.png` — the app's bottom-dock Social
  // destination. Authored at 96px, like `diamonds` and `inventory`, and kept
  // there rather than upscaled.
  social: "/assets/mythstride/icons/social.png",
  // `assets/glyphs/run_mode_outdoor.png`. Worth naming why this one is here
  // after being turned down once: it was dismissed as a ~40dp toggle glyph,
  // which is how the app *uses* it, but the file is authored at 1024px — a
  // full gold medallion, not a small mark. The size objection was about the
  // usage, not the asset.
  runOutdoor: "/assets/mythstride/icons/run_outdoor.png",
} as const;

export type MythGlyphName = keyof typeof MYTH_GLYPHS;

/**
 * The same glyphs, cut to 128px and re-encoded as WebP.
 *
 * The authored files run from 96px to 384px, which is what a phone screen
 * needs when it shows one of these as a reward or a header mark. The site puts
 * them beside a heading at 36–52px, where the largest of them — the champion
 * trophy, at 106 KB — would be downloading roughly forty times the pixels it
 * can draw. Anything asking for a small box gets this cut instead; the whole
 * set costs 52 KB against 359 KB.
 *
 * The authored PNG stays the source of truth and is still what a larger slot
 * resolves, so nothing here replaces an approved asset.
 */
export const MYTH_GLYPHS_SMALL: Readonly<Record<MythGlyphName, string>> =
  Object.fromEntries(
    Object.entries(MYTH_GLYPHS).map(([name, file]) => [
      name,
      file.replace("/icons/", "/icons/sm/").replace(/\.png$/, ".webp"),
    ]),
  ) as Record<MythGlyphName, string>;

/** Above this the authored file is worth its bytes. */
export const MYTH_GLYPH_SMALL_MAX = 64;

/**
 * Glyphs whose art carries its own opaque ground.
 *
 * The product authors two different kinds of piece. `itens/` and the currency
 * icons are cut out — transparent everywhere the subject is not, so they float
 * on whatever surface holds them. `achievement/` and `trophies/` are authored
 * as square tiles with a lit ground baked in; `achievements.png` measures 0%
 * transparent, corner alpha 255, against 47-90% transparent for the other
 * three.
 *
 * That is the family the piece belongs to, not a bad export, so the site does
 * not cut it out. It frames it instead — a tile reads as a deliberate inset
 * panel, where a raw square beside three floating cutouts reads as a mistake.
 */
export const MYTH_GLYPH_TILES: ReadonlySet<MythGlyphName> = new Set([
  "achievements",
  // Measured the same way: 640x640 authored, 0% transparent, corner alpha 255.
  "seasonChampion",
]);

/**
 * Glyphs the app wraps in a Founder aura.
 *
 * The blade is tier `mythstride` — `inventoryIsFounder` matches on a rarity
 * string containing "mythstride", and that tier carries `MythRewardGlow.high`
 * with `MythRewardMotion.sweep`. The tier's colour token is `#DAD38B`, but the
 * app never paints the blade with it: `MythFounderBladeSweep` sweeps cyan
 * (`#55CFFF` -> `#E8FBFF` -> `#75DFFF`), on cyan art.
 *
 * RFC 0005 is the reason for the split. The mythstride tier *was*
 * `_cyanSignature` until that RFC moved it to `#DAD38B` precisely so the top
 * earned tier and the purchased Founder mark would stop being one colour.
 * Painting the blade in the tier token would re-merge them. So the aura here
 * is the app's, verbatim.
 */
export const MYTH_GLYPH_AURAS: Readonly<Partial<Record<MythGlyphName, string>>> =
  {
    founderSword: "founder",
  };

/** The CSS custom properties a frame needs, ready to spread onto `style`. */
export function relicFrameVars(key: RelicFrameKey): CSSProperties {
  const frame = RELIC_FRAMES[key];
  return {
    // Through `getAssetPath` so a configured basePath is honoured, exactly as
    // the boss medals already do.
    ["--relic-frame-image" as string]: `url("${getAssetPath(frame.asset)}")`,
    ["--relic-frame-slice" as string]: frame.slice.join(" "),
    ["--relic-frame-width" as string]: frame.width
      .map((value) => `${value}px`)
      .join(" "),
  };
}
