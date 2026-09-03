import type { CSSProperties, ElementType, ReactNode } from "react";

import {
  RELIC_FRAMES,
  relicFrameVars,
  type RelicFrameKey,
} from "@/lib/relic-frames";

interface RelicFrameProps {
  /** Which authored frame to wear. */
  frame: RelicFrameKey;
  children?: ReactNode;
  /** Defaults to a `div`; pass `section`, `li`, `article` to keep semantics. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Puts an authored RELIC frame behind whatever it wraps.
 *
 * ── WHY `border-image` AND NOT AN `<img>` ───────────────────────────────────
 *
 * These frames are nine-slice art: four fixed corners, four stretchable edges,
 * one stretchable middle. An `<img>` behind the content would smear the
 * corners as the box grows. `border-image` is the web's own nine-slice, and it
 * takes the same numbers the app hands `Canvas.drawImageNine`, so both
 * platforms draw the identical artwork.
 *
 * The element keeps its own layout: this is a background and a border, so it
 * changes no intrinsic size and imposes no layout protocol on its caller.
 *
 * Content padding comes from the frame's own insets, so text never lands on
 * the metal. That is the CSS answer to the pack's `safeArea`.
 *
 * The frame is decoration; it contributes nothing to the accessibility tree.
 */
export function RelicFrame({
  frame,
  children,
  as: Tag = "div",
  className = "",
  style,
}: RelicFrameProps) {
  const spec = RELIC_FRAMES[frame];

  return (
    <Tag
      className={`relic-frame ${className}`.trim()}
      style={
        {
          ...relicFrameVars(frame),
          // The authored inset doubles as the safe area for content.
          paddingBlock: `${spec.width[0]}px`,
          paddingInline: `${spec.width[3]}px`,
          minWidth: `${spec.minSize.w}px`,
          minHeight: `${spec.minSize.h}px`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

export default RelicFrame;
