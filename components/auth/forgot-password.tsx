"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import api from "@/lib/axios";
import { vibrate } from "@/lib/haptics";

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>();

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch,
    formState: { errors: resetErrors },
  } = useForm({
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSendOTP = async (data: { email: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password/send", data);
      if (res.data.success) {
        setEmail(data.email);
        setStep(2);
        toast.success("Verification code sent to your email.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password/reset", {
        email,
        otp: data.otp,
        password: data.password,
      });

      if (res.data.success) {
        toast.success("Password reset successfully! You can now login.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-3 bg-primary/10 rounded-full mb-2">
          {step === 1 ? (
            <Mail className="w-6 h-6 text-primary" />
          ) : (
            <KeyRound className="w-6 h-6 text-primary" />
          )}
        </div>
        <h1 className="text-xl font-bold">
          {step === 1 ? "Forgot password?" : "Reset Password"}
        </h1>
        <FieldDescription className="max-w-75">
          {step === 1
            ? "Enter your email address and we'll send you a verification code."
            : `Enter the 6-digit code sent to ${email} and your new password.`}
        </FieldDescription>
      </div>

      {step === 1 ? (
        <form onSubmit={handleEmailSubmit(onSendOTP)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter E-Mail address"
                disabled={loading}
                {...registerEmail("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {emailErrors.email && (
                <FieldDescription className="text-destructive">
                  {emailErrors.email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
                {loading && <Loader />}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit(onResetPassword)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
              <Input
                id="otp"
                placeholder="123456"
                maxLength={6}
                className="text-center tracking-[0.5em] font-mono text-lg"
                disabled={loading}
                {...registerReset("otp", {
                  required: "OTP is required",
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                })}
              />
              {resetErrors.otp && (
                <FieldDescription className="text-destructive">
                  {resetErrors.otp.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                disabled={loading}
                {...registerReset("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message:
                      "Password must contain uppercase, lowercase, and number",
                  },
                })}
              />
              {resetErrors.password && (
                <FieldDescription className="text-destructive">
                  {resetErrors.password.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                disabled={loading}
                {...registerReset("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Passwords do not match";
                    }
                  },
                })}
              />
              {resetErrors.confirmPassword && (
                <FieldDescription className="text-destructive">
                  {resetErrors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
                {loading && <Loader />}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      <div className="flex justify-center">
        <Link
          onClick={() => vibrate()}
          href="/login"
          className={cn(
            "flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors",
            loading && "pointer-events-none opacity-50"
          )}
          prefetch
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}