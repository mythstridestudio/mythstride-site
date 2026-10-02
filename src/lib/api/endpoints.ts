export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
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
  accountDeletion: {
    requestLink: "/api/account-deletion/request-link",
    confirmLink: "/api/account-deletion/confirm-link",
  },
} as const;
