/**
 * Official draft events seeded by FourElements2027DraftSeeder in the API.
 * The event IDs are stable; never derive them from a display title.
 */
export const FOUR_ELEMENTS_2027 = [
  {
    element: "terra",
    name: "Terra — O Despertar",
    eventId: "4e202701-0001-4000-8000-000000000001",
  },
  {
    element: "fogo",
    name: "Fogo — A Ascensão",
    eventId: "4e202701-0002-4000-8000-000000000002",
  },
  {
    element: "gelo",
    name: "Gelo — A Provação",
    eventId: "4e202701-0003-4000-8000-000000000003",
  },
  {
    element: "sombra",
    name: "Sombra — A Lenda",
    eventId: "4e202701-0004-4000-8000-000000000004",
  },
] as const;

export const FOUR_ELEMENTS_COLLECTION_KEY = "four_elements_2027";

/** Only the signed-in player's ID is ever used for reading collection status.
 * The API also checks this ID against the signed-in JWT. Award/remove requests
 * do not accept any target player ID: they are strictly self-service Admin QA.
 */
export function authenticatedPlayerId(accessToken: string): string | null {
  try {
    const payloadPart = accessToken.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as Record<string, unknown>;
    const candidate = payload.jogadorId;
    return typeof candidate === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidate)
      ? candidate
      : null;
  } catch {
    return null;
  }
}
