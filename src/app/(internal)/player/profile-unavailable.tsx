"use client";

import Link from "next/link";
import { HomeIcon } from "@/components/Icons";
import { useTranslations } from "@/lib/i18n";

/**
 * Shown wherever a public profile cannot be opened.
 *
 * Two routes land here. `/player/` without a `?username=` has nothing to look
 * up. `/player/profile-preview-disabled/` is the single placeholder that
 * `generateStaticParams` emits while static profile generation is off — see
 * `WEBSITE_ARCHITECTURE.md`, "Public profiles" — and it used to print an
 * English-only engineering note about "this static marketing build", which is
 * build-process language on a page anyone can reach.
 *
 * Both say the same factual thing instead, in all three languages, and give a
 * way back rather than ending the journey.
 */
export function ProfileUnavailable() {
  const { t } = useTranslations();

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-6">
      <div className="app-panel app-panel-compact max-w-xl p-8 text-center">
        <h1 className="font-display text-3xl text-gold">
          {t("publicProfile.unavailable")}
        </h1>
        <p className="mt-4 text-text-secondary">
          {t("publicProfile.usernameRequired")}
        </p>
        <Link className="button button--secondary mt-8" href="/" prefetch={false}>
          <HomeIcon className="h-4 w-4" />
          {t("authTopbar.home")}
        </Link>
      </div>
    </main>
  );
}

export default ProfileUnavailable;
