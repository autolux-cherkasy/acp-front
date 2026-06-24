"use client";

import { type UserProfile, type UserRole } from "@/src/entities/user";
import { useProfileQuery } from "@/src/entities/user/api/useUserQueries";
import {
  getDevProfile,
  getDevRole,
  installDevAuthHelpers,
} from "@/src/shared/api/dev-auth";
import {
  hasAccessToken,
  subscribeToAuthChange,
} from "@/src/shared/api/session";
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
  const profileQuery = useProfileQuery();
  const [, setAuthVersion] = useState(0);
  const authenticated = hasAccessToken();
  const devRole = getDevRole() as UserRole | null;
  const { refetch } = profileQuery;
  const isAuthenticated = authenticated || devRole != null;
  const profile =
    devRole != null
      ? ((getDevProfile() as UserProfile | null) ?? null)
      : (profileQuery.data ?? null);
  const isLoading = devRole == null && authenticated
    ? profileQuery.isPending
    : false;

  const refreshSession = useCallback(async () => {
    if (devRole != null) {
      return getDevProfile() as UserProfile | null;
    }

    if (!hasAccessToken()) {
      return null;
    }

    const result = await refetch();
    return result.data ?? null;
  }, [devRole, refetch]);

  useEffect(() => {
    return installDevAuthHelpers();
  }, []);

  useEffect(() => {
    return subscribeToAuthChange(() => {
      setAuthVersion((current) => current + 1);
    });
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      profile,
      role: profile?.role ?? null,
      refreshSession,
    }),
    [isAuthenticated, isLoading, profile, refreshSession],
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
