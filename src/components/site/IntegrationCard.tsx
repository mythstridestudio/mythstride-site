import type { ReactNode } from "react";
import { FeatureCard } from "@/components/site/FeatureCard";

type IntegrationCardProps = {
  icon: ReactNode;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

export function IntegrationCard(props: IntegrationCardProps) {
  return <FeatureCard {...props} />;
}
