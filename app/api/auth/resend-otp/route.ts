import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP, canResendOTP, checkDailyLimit } from "@/lib/otp";
import { sendOTP } from "@/lib/otp";
import { otpFlowOptions } from "@/utils/options";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const allowed = await canResendOTP(email);
  if (!allowed) {
    return NextResponse.json(
      { error: "Please wait before resending OTP" },
      { status: 429 }
    );
  }

  if (!(await checkDailyLimit(email))) {
    return NextResponse.json(
      { error: "OTP limit exceeded for today" },
      { status: 429 }
    )
  }

  const otp = generateOTP();
  await storeOTP(email, otp);
  await sendOTP(email, otp);

  const otpFlowToken = crypto.randomUUID();
  
  const res = NextResponse.json({ success: true });
  
  res.cookies.set("otp_flow", otpFlowToken, otpFlowOptions);

  return res;
}
