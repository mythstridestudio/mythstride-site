"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminAccessToken } from "@/lib/api/auth";
import AdminWorkspace from "@/components/AdminWorkspace";
import type { AdminSection } from "@/components/AdminSectionTabs";

/** New admin sections share the same login + JWT role guard as Events/Medals.
 * The API enforces [Authorize(Roles = "Admin")] independently.
 */
export default function AdminProtectedWorkspace({
  active,
  render,
}: {
  active: AdminSection;
  render: (accessToken: string) => ReactNode;
}) {
  const { token, status } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => isAdminAccessToken(token), [token]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && !isAdmin) router.replace("/dashboard");
  }, [isAdmin, router, status]);

  if (status === "loading" || !token || !isAdmin) {
    return <main className="min-h-screen bg-void" />;
  }

  return <AdminWorkspace active={active}>{render(token)}</AdminWorkspace>;
}
