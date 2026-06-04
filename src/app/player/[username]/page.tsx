import type { Metadata } from "next";
import { apiFetch, hasApiBaseUrl } from "@/lib/api/client";
import type { PublicPlayerProfile } from "@/lib/api/types";
import PublicPlayerProfilePage from "./public-player-profile-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ username: "Botinha" }];
}

async function getMetadataPlayer(username: string) {
  if (!hasApiBaseUrl()) {
    return null;
  }

  try {
    return await apiFetch<PublicPlayerProfile>(
      `/api/public/player/${encodeURIComponent(username)}`,
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const player = await getMetadataPlayer(decodedUsername);
  const displayName = player?.displayName ?? decodedUsername;
  const title = player?.title ?? "MythStride Champion";
  const level = player?.level;
  const boss = player?.currentBoss;
  const bossProgress = boss ? `${boss.healthPercent}% health remaining against ${boss.name}` : "boss progress awaits";
  const description = player
    ? `Explore ${displayName}'s journey through Elyndor: ${title}, level ${level}, with ${bossProgress}.`
    : `Explore ${displayName}'s journey through Elyndor, defeat bosses, earn achievements and answer Aethron's call.`;

  return {
    title: `${displayName} | MythStride Champion Profile`,
    description,
    openGraph: {
      title: `${displayName} | ${title}${level ? ` | Level ${level}` : ""}`,
      description,
      type: "profile",
      images: boss?.imageUrl
        ? [
            {
              url: boss.imageUrl,
              alt: `${boss.name} boss progress for ${displayName}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} | MythStride Champion Profile`,
      description,
    },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <PublicPlayerProfilePage username={username} />;
}
