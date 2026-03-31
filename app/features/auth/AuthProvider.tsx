import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import authService from "~/features/auth/auth-service";
import {
  clearSession,
  getStoredSession,
  type SessionSnapshot,
  subscribeToSessionChanges,
} from "~/features/auth/auth-storage";
import type { ApiResult } from "~/services/api/responses";
import type { MeResponseData, User } from "~/features/auth/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isHydrating: boolean;
  token: string | null;
  user: User | null;
  refreshUser: () => Promise<ApiResult<MeResponseData>>;
  logout: () => Promise<ApiResult<null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function buildContextValue(
  session: SessionSnapshot,
  isHydrating: boolean,
  refreshUser: () => Promise<ApiResult<MeResponseData>>,
  logout: () => Promise<ApiResult<null>>,
): AuthContextValue {
  return {
    isAuthenticated: Boolean(session.token && session.user),
    isHydrating,
    token: session.token,
    user: session.user,
    refreshUser,
    logout,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<SessionSnapshot>(() => getStoredSession());
  const [isHydrating, setIsHydrating] = useState(Boolean(session.token));

  useEffect(() => {
    const unsubscribe = subscribeToSessionChanges((nextSession) => {
      setSession(nextSession);
      setIsHydrating(false);
    });

    return unsubscribe;
  }, []);

  const refreshUser = async () => {
    setIsHydrating(true);

    try {
      return await authService.getMe();
    } finally {
      setIsHydrating(false);
    }
  };

  const logout = async () => {
    setIsHydrating(true);

    try {
      return await authService.logout();
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    if (!session.token) {
      setIsHydrating(false);
      return;
    }

    let cancelled = false;

    const hydrateSession = async () => {
      setIsHydrating(true);

      try {
        await authService.getMe();
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [session.token]);

  const value = useMemo(
    () => buildContextValue(session, isHydrating, refreshUser, logout),
    [isHydrating, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
