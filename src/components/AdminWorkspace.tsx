"use client";

import type { ReactNode } from "react";
import AuthenticatedTopbar from "@/components/AuthenticatedTopbar";
import AdminSectionTabs, { type AdminSection } from "@/components/AdminSectionTabs";

/** Shared admin navigation. Business pages still perform their own JWT admin
 * guard; this layout adds navigation without changing existing route guards.
 */
export default function AdminWorkspace({
  active,
  children,
}: {
  active: AdminSection;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-void text-text-primary">
      <AuthenticatedTopbar />
      <div className="mx-auto flex w-full max-w-[1600px] flex-col pt-16 md:pt-20 lg:min-h-screen lg:flex-row">
        <AdminSectionTabs active={active} />
        <div className="min-w-0 flex-1 px-4 pb-16 pt-5 sm:px-6 lg:pt-8 xl:px-8">
          {children}
        </div>
      </div>
    </main>
  );
}
