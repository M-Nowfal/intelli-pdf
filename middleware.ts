import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEXTAUTH_SECRET } from "./utils/constants";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/uploadthing")) {
    return NextResponse.next();
  }

  if (path.startsWith("/api")) {
    const token = await getToken({ req, secret: NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  if (path.startsWith("/otp")) {
    const otpToken = req.cookies.get("otp_flow");
    if (!otpToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/otp",
    "/api/:path*"
  ],
}