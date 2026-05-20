"use client";

import { type UserProfile, type UserRole } from "@/src/entities/user";
import { useProfileQuery } from "@/src/entities/user/api/useUserQueries";
import {
  getDevProfile,
  getDevRole,
  installDevAuthHelpers,
} from "@/src/shared/api/dev-auth";
import { hasAccessToken } from "@/src/shared/api/session";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthSessionContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  role: UserRole | null;
  refreshSession: () => Promise<UserProfile | null>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep the first server and client render identical. Real auth state is resolved after mount.
  const profileQuery = useProfileQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const devRole = getDevRole() as UserRole | null;
  const { refetch } = profileQuery;

  const refreshSession = useCallback(async () => {
    if (devRole != null) {
      return getDevProfile() as UserProfile | null;
    }

    if (!hasAccessToken()) {
      return null;
    }

    const set = () => {
      setIsAuthenticated(hasAccessToken() || devRole != null);
    };
    set();
    const result = await refetch();
    return result.data ?? null;
  }, [refetch, devRole]);

  useEffect(() => {
    return installDevAuthHelpers();
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      isAuthenticated,
      isLoading: profileQuery.isPending,
      profile: profileQuery.data ?? null,
      role: profileQuery.data?.role ?? null,
      refreshSession,
    }),
    [
      isAuthenticated,
      profileQuery.isPending,
      profileQuery.data,
      refreshSession,
    ],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
