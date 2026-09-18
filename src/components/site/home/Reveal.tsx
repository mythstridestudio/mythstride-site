"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Rendered element, so a grid container needs no extra wrapper. */
  as?: "div" | "ol" | "ul" | "section" | "figure";
  /**
   * Accessible name for the rendered element.
   *
   * The horizontally scrolling rails need one: a browser hands keyboard focus
   * to a scrollable box so it can be scrolled with the arrow keys, and an
   * unnamed stop is announced as nothing at all.
   */
  label?: string;
};

type Status = "static" | "hidden" | "revealed";

/**
 * Brings its subtree in when it first reaches the viewport.
 *
 * The animation lives in the stylesheet, keyed off `data-revealed`; this
 * component only reports visibility. It never animates, never reads layout on
 * scroll, and stops observing the moment it has fired.
 *
 * The server renders no `data-revealed` attribute at all, and the CSS leaves an
 * element without one fully visible. So a page with JavaScript switched off —
 * or one that has not hydrated yet — shows every section normally, and only a
 * hydrated page that has measured an element as still below the fold ever hides
 * it in order to bring it back.
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  label,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("static");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") return;

    // Anything already on screen at mount stays as rendered: hiding it now
    // only to fade it back in would be a flash, not an entrance.
    const belowTheFold = node.getBoundingClientRect().top > window.innerHeight * 0.9;
    if (!belowTheFold) return;

    setStatus("hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStatus("revealed");
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        // Only the bottom edge is pulled in, and that is what holds the
        // entrance back until the element is properly on screen. The enormous
        // top margin is a safety net: an observer only reports a *change* in
        // intersection, so an element the page jumped clean over — an anchor
        // link, a flick, a restored scroll position — could otherwise go from
        // "below the fold" to "above the fold" without ever intersecting, and
        // stay invisible for good. Extending the root upward means anything at
        // or above the viewport counts as intersecting and reveals.
        rootMargin: "100000px 0px -12% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // The tag comes from the closed list above, so this is always an
      // HTMLElement; TypeScript cannot narrow the union of ref types itself.
      ref={ref as React.RefObject<never>}
      className={`reveal ${className}`.trim()}
      aria-label={label}
      data-revealed={status === "static" ? undefined : status === "revealed"}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
