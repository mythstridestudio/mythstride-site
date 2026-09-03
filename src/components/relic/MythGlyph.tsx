import Image from "next/image";

import { getAssetPath } from "@/lib/assets";
import { MYTH_GLYPHS, type MythGlyphName } from "@/lib/relic-frames";

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
  return (
    <Image
      src={getAssetPath(MYTH_GLYPHS[glyph])}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={size}
      height={size}
      className={`myth-glyph ${className}`.trim()}
      loading="lazy"
      sizes={`${size}px`}
    />
  );
}

export default MythGlyph;
