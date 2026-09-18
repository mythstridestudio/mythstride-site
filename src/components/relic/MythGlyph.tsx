import Image from "next/image";

import { getAssetPath } from "@/lib/assets";
import {
  MYTH_GLYPHS,
  MYTH_GLYPHS_SMALL,
  MYTH_GLYPH_AURAS,
  MYTH_GLYPH_SMALL_MAX,
  MYTH_GLYPH_TILES,
  type MythGlyphName,
} from "@/lib/relic-frames";

interface MythGlyphProps {
  glyph: MythGlyphName;
  /** Rendered box, in CSS pixels. The art is square. */
  size?: number;
  /**
   * Screen-reader text. Left empty by default: these glyphs sit beside a
   * heading that already names the thing, and repeating it makes a reader say
   * it twice.
   */
  alt?: string;
  className?: string;
}

/**
 * One of the app's own artwork glyphs, in place of a drawn-for-the-web icon.
 *
 * ── WHEN TO USE THIS, AND WHEN NOT TO ───────────────────────────────────────
 *
 * Only where the product already ships artwork for exactly that subject. The
 * site's other icons in `components/Icons.tsx` are bespoke inline SVGs, not
 * an icon library, and they are fine where MythStride has no authored piece —
 * an arrow, a chevron, a close cross. Swapping those for invented "RELIC-ish"
 * art would be the false-relic the brief refuses.
 *
 * A boss is never a glyph. Use `MythBossMedal`.
 */
export function MythGlyph({
  glyph,
  size = 52,
  alt = "",
  className = "",
}: MythGlyphProps) {
  const aura = MYTH_GLYPH_AURAS[glyph];
  // A small slot draws the 128px cut; anything larger keeps the authored file.
  const source =
    size <= MYTH_GLYPH_SMALL_MAX ? MYTH_GLYPHS_SMALL[glyph] : MYTH_GLYPHS[glyph];
  const art = (
    <Image
      src={getAssetPath(source)}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={size}
      height={size}
      className={[
        "myth-glyph",
        MYTH_GLYPH_TILES.has(glyph) ? "myth-glyph--tile" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      loading="lazy"
      sizes={`${size}px`}
    />
  );

  // The aura needs a box of its own to sit behind the art. Only the glyphs the
  // app actually auras get one, so nothing else pays for an extra element.
  if (!aura) return art;

  return (
    <span className={`myth-glyph-aura myth-glyph-aura--${aura}`}>{art}</span>
  );
}

export default MythGlyph;
