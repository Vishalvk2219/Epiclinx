"use client";

import { useEffect } from "react";
import { useAuthStore, type User } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";

export const ClientAuthHydrator = ({ user }: { user: User | null }) => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) {
          setUser(user); // Hydrate from SSR
          return;
        }
        const newUser = await apiFetch("/user");
        setUser(newUser);
      } catch (err: any) {
        if (err.message === "Unauthorized" || err.message === "jwt expired") {
          try {
            // Attempt to refresh the access token
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
              method: "POST",
              credentials: "include", // ensures cookie is sent
            });
            // Retry user fetch
            const newUserAfterRefreshToken = await apiFetch("/user");
            setUser(newUserAfterRefreshToken);
          } catch (refreshErr) {
            console.warn("Refresh token failed", refreshErr);
            clearUser();
          }
        } else {
          console.error("Failed to fetch user:", err);
          clearUser();
        }
      }
    };

    fetchUser();
  }, []);

  return null;
};
