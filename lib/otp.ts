import { otpMailTemplate } from "@/utils/template";
import { transporter } from "./mailer";
import { redis } from "./redis";

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const checkDailyLimit = async (email: string): Promise<boolean> => {
  const key = `otp:count:${email}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 86400);
  }

  return count <= 5;
}

export const sendOTP = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Intelli-PDF" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Verification Code | Intelli-PDF",
    html: otpMailTemplate(otp),
    text: `Your verification code is ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`,
  });
};

export const storeOTP = async (email: string, otp: string): Promise<void> => {
  await redis.set(`otp:${email}`, otp, { ex: 600 });
  await redis.set(`otp:cooldown:${email}`, "1", { ex: 60 });
}

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const key = `otp:${email}`;
  const stored = await redis.get<number>(key);

  if (!stored) return false;
  if (stored !== Number(otp)) return false;

  await redis.del(key);
  return true;
}

export const canResendOTP = async (email: string) => {
  const cooldown = await redis.get(`otp:cooldown:${email}`)
  return !cooldown
}
