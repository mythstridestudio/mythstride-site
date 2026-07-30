import type { ReactNode } from "react";

export function CtaGroup({ children }: { children: ReactNode }) {
  return <div className="cta-row">{children}</div>;
}
