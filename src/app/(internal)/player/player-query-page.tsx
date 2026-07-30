"use client";

import { useSearchParams } from "next/navigation";
import PublicPlayerProfilePage from "./[username]/public-player-profile-page";
import { useTranslations } from "@/lib/i18n";

export default function PlayerQueryPage() {
  const searchParams = useSearchParams();
  const { t } = useTranslations();
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-void px-6">
        <div className="app-panel app-panel-compact max-w-xl p-8 text-center">
          <h1 className="font-display text-3xl text-gold">{t("publicProfile.unavailable")}</h1>
          <p className="mt-4 text-text-secondary">{t("publicProfile.usernameRequired")}</p>
        </div>
      </main>
    );
  }

  return <PublicPlayerProfilePage username={encodeURIComponent(username)} />;
}
