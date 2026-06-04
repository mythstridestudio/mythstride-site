import type { AuthLoginRequest, AuthLoginResponse } from "./types";

export const AUTH_TOKEN_STORAGE_KEY = "mythstride.accessToken";

export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  playerProfile: "/api/player/profile",
  currentBoss: "/api/boss/current",
  trophies: "/api/trophies",
  history: "/api/history",
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

export type { AuthLoginRequest, AuthLoginResponse };

// TODO: Replace this browser-storage placeholder once the backend auth contract is known.
// Prefer the backend's production session strategy, such as httpOnly cookies, if available.
