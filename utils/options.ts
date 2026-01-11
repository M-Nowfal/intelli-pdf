import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NODE_ENV } from "./constants";

export const otpFlowOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "lax",
  maxAge: 600,
  path: "/",
};
