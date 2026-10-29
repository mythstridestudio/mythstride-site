import { Suspense } from "react";
import MedalsWallPage from "./medals-wall-page";

export default function MedalsPage() {
  return (
    <Suspense fallback={null}>
      <MedalsWallPage />
    </Suspense>
  );
}
