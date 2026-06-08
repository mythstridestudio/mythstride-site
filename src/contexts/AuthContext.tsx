"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api/client";
import {
  AUTH_TOKEN_STORAGE_KEY,
  clearStoredAccessToken,
  loginWithEmail,
  readStoredAccessToken,
  writeStoredAccessToken,
} from "@/lib/api/auth";
import type { AuthLoginRequest, PrivatePlayerProfile } from "@/lib/api/types";
import { getPlayerProfile } from "@/lib/api/player";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  token: string | null;
  user: PrivatePlayerProfile | null;
  status: AuthStatus;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthLoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<PrivatePlayerProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const logout = useCallback(() => {
    clearStoredAccessToken();
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const loadUser = useCallback(
    async (accessToken: string) => {
      try {
        const profile = await getPlayerProfile(accessToken);
        setUser(profile);
        setStatus("authenticated");
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          logout();
          return;
        }

        setUser(null);
        setStatus("authenticated");
      }
    },
    [logout],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedToken = readStoredAccessToken();

      if (!storedToken) {
        setStatus("unauthenticated");
        return;
      }

      setToken(storedToken);
      void loadUser(storedToken);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadUser]);

  const login = useCallback(
    async (credentials: AuthLoginRequest) => {
      setStatus("loading");
      const response = await loginWithEmail(credentials);
      writeStoredAccessToken(response.token);
      setToken(response.token);
      await loadUser(response.token);
    },
    [loadUser],
  );

  const refreshUser = useCallback(async () => {
    if (!token) {
      return;
    }

    await loadUser(token);
  }, [loadUser, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      status,
      loading: status === "loading",
      isAuthenticated: status === "authenticated" && Boolean(token),
      login,
      logout,
      refreshUser,
    }),
    [login, logout, refreshUser, status, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

export { AUTH_TOKEN_STORAGE_KEY };
