"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapIcon } from "@/components/Icons";
import { useTranslations } from "@/lib/i18n";

/**
 * Last-resort boundary for the authenticated area.
 *
 * ── WHAT IT IS FOR, AND WHAT IT IS NOT FOR ──────────────────────────────────
 *
 * It catches an *unexpected* render error, so one bad value no longer takes the
 * whole application down with nothing on screen. A `RangeError` from a date the
 * formatter could not read did exactly that until recently.
 *
 * It is not an error handler for the API. Expected failures — an expired
 * session, an offline backend, a profile that does not exist — are already
 * handled inside the pages, which know what to say about each one and can keep
 * the rest of the screen usable. Nothing about that changes: this only runs
 * when a page throws while rendering.
 *
 * The message is deliberately generic and factual. It claims nothing about
 * whether the backend is healthy, and it shows no stack, no digest and no
 * internal detail — the error still reaches the console for developers and the
 * host's logs, which is where it belongs.
 */
export default function InternalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslations();

  useEffect(() => {
    // Keep the failure visible to developers; the UI above stays generic.
    console.error(error);
  }, [error]);

  return (
    <main className="not-found-page">
      <div className="not-found-page__panel" role="alert">
        <MapIcon className="not-found-page__icon" />
        <p className="section-eyebrow">MythStride</p>
        <h1>{t("errorBoundary.title")}</h1>
        <p>{t("errorBoundary.body")}</p>
        <div className="cta-row">
          <button
            type="button"
            className="button button--primary"
            onClick={() => reset()}
          >
            {t("errorBoundary.retry")}
          </button>
          <Link className="button button--secondary" href="/" prefetch={false}>
            {t("errorBoundary.home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
