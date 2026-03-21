import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscription: {
        tier: "free" | "pro";
        expiresAt: Date | null;
        lastOrderId: string | null;
      };
    } & DefaultSession["user"]
  }

  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    picture?: string | null;
    subscription?: {
      tier: "free" | "pro";
      expiresAt: Date | string | null;
      lastOrderId: string | null;
    };
  }
}