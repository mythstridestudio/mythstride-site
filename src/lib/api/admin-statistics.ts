import { apiFetch } from "./client";

export interface AdminEventRegistrationStat {
  eventId: string;
  eventName: string;
  startsAt: string;
  endsAt: string;
  status: string;
  inAppRegistrations: number;
  completed: number;
  officialRosterEntries: number;
}

export interface AdminRegistrationStatistics {
  asOfUtc: string;
  totalAccounts: number;
  verifiedAccounts: number;
  totalPlayers: number;
  totalEventRegistrations: number;
  uniqueEventParticipants: number;
  eventRegistrationsLast7Days: number;
  totalEvents: number;
  eventsLimit: number;
  events: AdminEventRegistrationStat[];
}

export function getAdminRegistrationStatistics(accessToken: string) {
  return apiFetch<AdminRegistrationStatistics>("/api/admin/statistics/registrations", {
    accessToken,
    cache: "no-store",
  });
}
