import type { ReactNode } from "react";
import { FeatureCard } from "@/components/site/FeatureCard";
import type { ProductFeature } from "@/config/product-status";
import type { PublicLocale } from "@/lib/locales";

type IntegrationCardProps = {
  locale: PublicLocale;
  feature: ProductFeature;
  icon: ReactNode;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

export function IntegrationCard(props: IntegrationCardProps) {
  return <FeatureCard {...props} detailedStatus />;
}
