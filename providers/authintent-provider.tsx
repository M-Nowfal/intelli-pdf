"use client";

import { createContext, useContext } from "react";

type AuthIntentProviderTypes = {
  setIntent: (intent: "login" | "signup") => void;
};

const AuthContext = createContext<AuthIntentProviderTypes | null>(null);

export function AuthIntentProvider({ children }: { children: React.ReactNode }) {
  const setIntent = (intent: "login" | "signup") => {
    document.cookie = `auth_intent=${intent}; path=/; max-age=60`;
  };

  return (
    <AuthContext.Provider value={{ setIntent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthIntent = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthIntent must be used within an AuthIntentProvider");
  }
  return context;
}