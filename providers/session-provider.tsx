"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import api from "@/lib/axios";

function UserValidator({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const validateUser = async () => {
        try {
          await api.get("/auth/status");
        } catch (err: unknown) {
          console.error("User no longer exists. Logging out...");
          signOut({ callbackUrl: "/login" });
        }
      };

      validateUser();
    }
  }, [status]);

  return <>{children}</>;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserValidator>
        {children}
      </UserValidator>
    </SessionProvider>
  );
}
