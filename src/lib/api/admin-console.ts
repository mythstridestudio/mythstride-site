import { apiFetch } from "./client";

export interface AdminAuditLog {
  id: string;
  userId: string | null;
  jogadorId: string | null;
  eventType: string;
  severity: string;
  message: string;
  resourceType: string | null;
  resourceId: string | null;
  metadataJson: string | null;
  createdAt: string;
}

export interface AdminAuditPage {
  page: number;
  pageSize: number;
  total: number;
  items: AdminAuditLog[];
}

export function getAdminAuditLogs(
  token: string,
  options: { page?: number; pageSize?: number; eventType?: string } = {},
) {
  const query = new URLSearchParams({
    page: String(options.page ?? 1),
    pageSize: String(options.pageSize ?? 20),
  });
  if (options.eventType) query.set("eventType", options.eventType);
  return apiFetch<AdminAuditPage>(`/api/admin/security-logs?${query.toString()}`, {
    accessToken: token,
    cache: "no-store",
  });
}

export const MANUAL_MEDAL_GRANT_EVENT = "admin_event_medal_grant";
