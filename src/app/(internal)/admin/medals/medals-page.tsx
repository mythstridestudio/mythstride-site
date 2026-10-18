"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminWorkspace from "@/components/AdminWorkspace";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminAccessToken } from "@/lib/api/auth";
import AdminMedalGrantsPanel from "./admin-medal-grants-panel";
import AdminEventMedalCatalogPanel from "./admin-event-medal-catalog-panel";
import MedalTestDeliveryPanel from "../events/medal-test-delivery-panel";

export default function MedalsAdminPage() {
  const router = useRouter();
  const { token, status, user } = useAuth();
  const isAdmin = useMemo(() => isAdminAccessToken(token), [token]);
  const [catalogRefreshKey, setCatalogRefreshKey] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && !isAdmin) router.replace("/dashboard");
  }, [status, isAdmin, router]);

  if (status === "loading" || !token || !isAdmin) {
    return <main className="min-h-screen bg-void"/>;
  }

  return (
    <AdminWorkspace active="medals">
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <div className="lg:col-span-2">
          <AdminMedalGrantsPanel token={token} catalogRefreshKey={catalogRefreshKey} />
        </div>
        <div className="lg:col-span-2">
          <AdminEventMedalCatalogPanel token={token} onCreated={() => setCatalogRefreshKey((n) => n + 1)} />
        </div>
        <div className="lg:col-span-2">
          <MedalTestDeliveryPanel token={token} username={user?.username} />
        </div>
      </div>
    </AdminWorkspace>
  );
}
