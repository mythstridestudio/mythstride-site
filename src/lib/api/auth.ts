import { apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { AuthLoginRequest, AuthLoginResponse } from "./types";

export const AUTH_TOKEN_STORAGE_KEY = "mythstride.accessToken";

export const AUTH_ENDPOINTS = {
  login: API_ENDPOINTS.auth.login,
  playerProfile: API_ENDPOINTS.player.profile,
  currentBoss: API_ENDPOINTS.player.currentBoss,
  trophies: API_ENDPOINTS.player.trophies,
  history: API_ENDPOINTS.player.history,
} as const;

export function readStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function clearStoredAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function writeStoredAccessToken(accessToken: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
}

interface AuthLoginApiResponse {
  accessToken?: string;
  token?: string;
  jwt?: string;
  tokenType?: string;
  expiresAt?: string;
  user?: AuthLoginResponse["user"];
  data?: AuthLoginApiResponse;
}

function normalizeLoginResponse(response: AuthLoginApiResponse): AuthLoginResponse {
  const body = response.data ?? response;
  const accessToken = body.accessToken ?? body.token ?? body.jwt;

  if (!accessToken) {
    // TODO: Confirm the production login response field name with the MythStride backend.
    throw new Error("Login response did not include an access token.");
  }

  return {
    accessToken,
    tokenType: body.tokenType,
    expiresAt: body.expiresAt,
    user: body.user,
  };
}

export async function loginWithEmail(credentials: AuthLoginRequest) {
  const response = await apiFetch<AuthLoginApiResponse>(AUTH_ENDPOINTS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return normalizeLoginResponse(response);
}

export type { AuthLoginRequest, AuthLoginResponse };

// TODO: Replace this browser-storage placeholder once the backend auth contract is known.
// Prefer the backend's production session strategy, such as httpOnly cookies, if available.
