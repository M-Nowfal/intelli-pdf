"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader } from "../ui/loader";

type OTPFormProps = {
  email: string;
};

export function OTPForm({
  email,
  className,
  ...props
}: OTPFormProps & React.ComponentProps<"div">) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter valid OTP");

    try {
      setIsVerifying(true);
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Email verified successfully");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent");
      setSeconds(60);
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        toast.error(err.response?.data?.error || "Please wait before resending");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerify}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to <b className="text-primary">{email}</b>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>

            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              id="otp"
              required
              containerClassName="gap-4"
              disabled={isVerifying}
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <FieldDescription className="text-center">
              {seconds > 0 ? (
                <>Resend OTP in {seconds}s</>
              ) : (
                <Button
                  variant="link"
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sky-600 font-semibold"
                >
                  Resend OTP
                </Button>
              )}
            </FieldDescription>
          </Field>

          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying" : "Verify"}
              {isVerifying && <Loader />}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
