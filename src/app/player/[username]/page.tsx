import PublicPlayerProfilePage from "./public-player-profile-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ username: "Botinha" }];
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <PublicPlayerProfilePage username={username} />;
}
