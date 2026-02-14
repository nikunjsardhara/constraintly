"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const useAuth = () => {
  const { data: session } = authClient.useSession();
  return { session, isLoading: session === undefined };
};
