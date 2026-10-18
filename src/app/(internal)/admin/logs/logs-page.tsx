"use client";

import AdminProtectedWorkspace from "@/components/AdminProtectedWorkspace";
import AdminAuditFeed from "@/components/AdminAuditFeed";

export default function AdminLogsPage() {
  return (
    <AdminProtectedWorkspace active="logs" render={(token) => (
      <div className="space-y-6">
        <div className="border-b border-gold-dim/30 pb-5">
          <p className="text-xs uppercase tracking-[0.22em] text-fiery-orange">MythStride · Administração</p>
          <h1 className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">Logs</h1>
          <p className="mt-2 text-sm text-text-secondary">Auditoria administrativa registrada pelo backend, ordenada pelos eventos mais recentes.</p>
        </div>
        <AdminAuditFeed token={token} onlyDeliveries={false} />
      </div>
    )} />
  );
}
