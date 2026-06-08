import { ApiError, apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export type WaitlistLanguage = "en" | "pt";

export interface WaitlistSignupPayload {
  email: string;
  name?: string;
  language?: WaitlistLanguage;
  source: "website";
}

export type WaitlistSignupResult = "joined" | "alreadyJoined";

interface WaitlistSignupResponse {
  success: boolean;
  message: string;
}

function isWaitlistSignupResponse(value: unknown): value is WaitlistSignupResponse {
  return typeof value === "object" && value !== null && "success" in value && "message" in value;
}

function messageIndicatesAlreadyJoined(message: string | undefined) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  return ["already", "duplicate", "exists", "inscrito", "cadastrado"].some((term) =>
    normalizedMessage.includes(term),
  );
}

export async function joinWaitlist(payload: WaitlistSignupPayload): Promise<WaitlistSignupResult> {
  try {
    const response = await apiFetch<WaitlistSignupResponse>(API_ENDPOINTS.waitlist, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (isWaitlistSignupResponse(response)) {
      if (messageIndicatesAlreadyJoined(response.message)) {
        return "alreadyJoined";
      }

      if (!response.success) {
        throw new Error("Waitlist signup was not accepted by the MythStride API.");
      }
    }

    return "joined";
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return "alreadyJoined";
    }

    throw error;
  }
}
