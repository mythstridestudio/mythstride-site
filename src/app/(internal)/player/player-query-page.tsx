"use client";

import { useSearchParams } from "next/navigation";
import PublicPlayerProfilePage from "./[username]/public-player-profile-page";
import { ProfileUnavailable } from "./profile-unavailable";

export default function PlayerQueryPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return <ProfileUnavailable />;
  }

  return <PublicPlayerProfilePage username={encodeURIComponent(username)} />;
}
