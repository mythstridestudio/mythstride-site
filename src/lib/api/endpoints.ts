export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
  },
  player: {
    profile: "/api/player/profile",
    currentBoss: "/api/boss/current",
    trophies: "/api/trophies",
    history: "/api/history",
  },
  publicPlayer: {
    // TODO: Confirm this public profile endpoint with the MythStride backend contract.
    byUsername: (username: string) => `/api/public/player/${encodeURIComponent(username)}`,
  },
} as const;
