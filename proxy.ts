import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis";
import { Ratelimit } from "@upstash/ratelimit";

const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/otp")) {
    const otpToken = req.cookies.get("otp_flow");
    if (!otpToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : "127.0.0.1";

    const { success, limit, reset, remaining } = await rateLimit.limit(`ratelimit_${clientIp}`);

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
      
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded. Excessive computational requests detected." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": retryAfterSeconds.toString(),
          },
        }
      );
    }

    const response = NextResponse.next();
    
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;

  } catch (err: unknown) {
    console.error("Rate Limiting Subsystem Failure Detected:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/otp/:path*",
    "/api/:path*"
  ],
};