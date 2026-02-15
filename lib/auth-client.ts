"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export const useAuth = () => {
  const { data: session } = authClient.useSession();
  return { session, isLoading: session === undefined };
};
