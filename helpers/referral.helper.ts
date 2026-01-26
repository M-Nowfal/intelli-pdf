import { transporter } from "@/lib/mailer";
import { APP_URL } from "@/utils/constants";
import { creditAwardMailTemplate } from "@/utils/template";
import crypto from "crypto";

export function generateReferralCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

export async function sendCreditAwardedMail(email: string, name: string) {
  try {
    await transporter.sendMail({
      from: `"Intelli-PDF" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "You earned 500 Free Credits! 🎉",
      html: creditAwardMailTemplate(name),
      text: `High five, ${name}! ✋\n\n` +
        `Your friend just joined Intelli-PDF using your link.\n\n` +
        `We have added +500 Credits to your account.\n` +
        `You can use these immediately to generate more quizzes and summaries.\n\n` +
        `Check your balance here: ${APP_URL}/settings?tab=billing\n\n` +
        `Keep sharing to earn unlimited rewards!\n` +
        `- The Intelli-PDF Team`,
    });
  } catch (err: unknown) {
    console.error(`Failed to send referral email to ${email}:`, err);
  }
}