"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedTopbar from "@/components/AuthenticatedTopbar";
import AdminSectionTabs from "@/components/AdminSectionTabs";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminAccessToken } from "@/lib/api/auth";
import AdminMedalGrantsPanel from "./admin-medal-grants-panel";
import MedalTestDeliveryPanel from "../events/medal-test-delivery-panel";

export default function MedalsAdminPage() {
  const router = useRouter();
  const { token, status, user } = useAuth();
  const isAdmin = useMemo(() => isAdminAccessToken(token), [token]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && !isAdmin) router.replace("/dashboard");
  }, [status, isAdmin, router]);

  if (status === "loading" || !token || !isAdmin) {
    return <main className="min-h-screen bg-void"/>;
  }

  return (
    <main className="min-h-screen bg-void text-text-primary">
      <AuthenticatedTopbar />
      <AdminSectionTabs active="medals" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <AdminMedalGrantsPanel token={token} />
        </div>
        <div className="lg:col-span-2">
          <MedalTestDeliveryPanel token={token} username={user?.username} />
        </div>
      </div>
    </main>
  );
}
