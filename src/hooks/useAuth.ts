import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  logoutUser,
  isAuthenticated,
  getUserProfile,
  UserProfile,
} from "@/lib/api/auth";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  const checkAuth = useCallback(async () => {
    try {
      const profile = await getUserProfile();
      setUser(profile);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Authentication failed");
      }
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: isAuthenticated(),
  };
}
