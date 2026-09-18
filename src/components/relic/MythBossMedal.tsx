import Image from "next/image";

import { getBossMedalPath } from "@/lib/boss-medals";
import { getAssetPath } from "@/lib/assets";
import { RELIC_ART } from "@/lib/relic-frames";

type MedalSize = "sm" | "md" | "lg";

const SIZES: Record<MedalSize, number> = {
  sm: 56,
  md: 88,
  lg: 132,
};

interface MythBossMedalProps {
  /**
   * The boss's name, resolved against the medal map in `lib/boss-medals.ts`.
   * A name with no medal renders the empty seat rather than a stand-in symbol.
   */
  name: string;
  /** Overrides the resolved medal — for a server-supplied image URL. */
  src?: string | null;
  size?: MedalSize;
  /**
   * Screen-reader text. Omit it where the boss is already named in adjacent
   * copy: the medal is then decoration and should not be read twice.
   */
  alt?: string;
  className?: string;
  priority?: boolean;
  /**
   * Mounts the medal on `medallions/boss_seat`.
   *
   * Off by default, and that is deliberate: the shipped medals in
   * `public/images/boss-medals/` are already complete medallions — each carries
   * its own struck rim. Seating one inside a second frame is the stacked-edge
   * defect, two rims competing around the same subject. The seat is for a bare
   * portrait, such as a server-supplied `imageUrl` with no rim of its own.
   */
  seated?: boolean;
}

/**
 * A boss, shown the way the product shows a boss: its medal, seated.
 *
 * ── THE RULE THIS EXISTS TO KEEP ────────────────────────────────────────────
 *
 * The medal is the boss's identity in MythStride. It is never replaced by a
 * skull, a sword, a generic crest or an icon-font glyph — those say "monster"
 * in general, while the medal says *which* monster, and the eighteen medals are
 * authored art the player already recognises from the app.
 *
 * `medallions/boss_seat` is the authored mount the app uses underneath. It is
 * whole art, not nine-slice, so it is drawn complete behind the portrait.
 *
 * Nothing here invents a boss: the medal set is exactly what
 * `lib/boss-medals.ts` already maps, which is exactly what ships in
 * `public/images/boss-medals/`.
 */
export function MythBossMedal({
  name,
  src,
  size = "md",
  alt,
  className = "",
  priority = false,
  seated = false,
}: MythBossMedalProps) {
  const px = SIZES[size];
  // The small size never needs the 384px art; anything larger does.
  const medal = src ?? getBossMedalPath(name, size === "sm" ? "thumb" : "full");
  const decorative = !alt;

  return (
    <span
      className={`myth-boss-medal myth-boss-medal--${size}${
        seated ? " myth-boss-medal--seated" : ""
      } ${className}`.trim()}
      style={{
        width: px,
        height: px,
        backgroundImage: seated
          ? `url("${getAssetPath(RELIC_ART.bossSeat)}")`
          : undefined,
      }}
    >
      {medal ? (
        <Image
          src={medal}
          alt={decorative ? "" : alt}
          aria-hidden={decorative || undefined}
          width={px}
          height={px}
          className="myth-boss-medal__portrait"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={`${px}px`}
        />
      ) : null}
    </span>
  );
}

export default MythBossMedal;
