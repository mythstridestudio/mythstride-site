import type { Metadata } from "next";
import { OrganizersLanding } from "@/components/site/OrganizersLanding";
import { organizersCopy } from "@/content/organizers";
import { createLocalizedMetadata } from "@/lib/metadata";

// Short ad-friendly URL: /organizadores/. Canonical is /pt-BR/organizadores/.
export const metadata: Metadata = createLocalizedMetadata({
  locale: "pt-BR",
  path: "/organizadores",
  title: organizersCopy["pt-BR"].seoTitle,
  description: organizersCopy["pt-BR"].seoDescription,
});

export default function OrganizerCampaignLanding() {
  return <OrganizersLanding locale="pt-BR" />;
}
