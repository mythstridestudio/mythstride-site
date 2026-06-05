import { ApiError, apiFetch } from "./client";

export type WaitlistLanguage = "en" | "pt";

export interface WaitlistSignupPayload {
  email: string;
  name?: string;
  language: WaitlistLanguage;
  source: "website";
}

export type WaitlistSignupResult = "joined" | "alreadyJoined";

interface WaitlistSignupResponse {
  success?: boolean;
  message?: string;
  data?: WaitlistSignupResponse;
}

function isWaitlistSignupResponse(value: unknown): value is WaitlistSignupResponse {
  return typeof value === "object" && value !== null;
}

function messageIndicatesAlreadyJoined(message: string | undefined) {
  return message?.toLowerCase().includes("already") ?? false;
}

function getWaitlistMessage(response: WaitlistSignupResponse) {
  return response.message ?? response.data?.message;
}

export async function joinWaitlist(payload: WaitlistSignupPayload): Promise<WaitlistSignupResult> {
  try {
    const response = await apiFetch<unknown>("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (isWaitlistSignupResponse(response) && messageIndicatesAlreadyJoined(getWaitlistMessage(response))) {
      return "alreadyJoined";
    }

    return "joined";
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return "alreadyJoined";
    }

    throw error;
  }
}
