import { Suspense } from "react";
import PlayerQueryPage from "./player-query-page";

export default function PlayerPage() {
  return (
    <Suspense fallback={null}>
      <PlayerQueryPage />
    </Suspense>
  );
}
