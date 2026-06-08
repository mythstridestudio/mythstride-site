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
    byUsername: (username: string) => `/api/public/player/${encodeURIComponent(username)}`,
  },
  waitlist: "/api/waitlist",
} as const;
