"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Eye, EyeClosed } from "lucide-react"
import { useForm } from "react-hook-form"
import api from "@/lib/axios"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { Loader } from "../ui/loader"
import { useRouter, useSearchParams } from "next/navigation"
import { AxiosError } from "axios"
import { useAuthIntent } from "@/providers/authintent-provider"

type SignupFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type AuthLoading = "google" | "credentials" | null;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<AuthLoading>(null);
  const router = useRouter();
  const { setIntent } = useAuthIntent();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const password = watch("password");

  useEffect(() => {
    if (refCode) {
      document.cookie = `referral_code=${refCode}; path=/; max-age=86400`;
    }
  }, [refCode]);

  const onSubmit = async (data: SignupFormData) => {
    setLoading("credentials");
    setIntent("signup");
    try {
      const res = await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (!res.data.success) {
        throw new Error("Signup failed")
      }

      router.push(`/otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        toast.error(
          err.response?.data?.error ||
          "Something went wrong. Please try again."
        );
    } finally {
      setLoading(null);
    }
  }

  const handleGoogleSignin = async () => {
    setLoading("google");
    setIntent("signup");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err: unknown) {
      toast.error("Failed to sign in with Google");
      setLoading(null);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Create your account</h1>
            <FieldDescription>
              Already have an account?{" "}
              <Link
                href="/login"
                className={cn(
                  "underline",
                  loading && "pointer-events-none opacity-50"
                )}
              >
                Log in
              </Link>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              placeholder="Enter Name"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              disabled={Boolean(loading)}
            />
            {errors.name && (
              <FieldDescription className="text-destructive">
                {errors.name.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter E-Mail address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              disabled={Boolean(loading)}
            />
            {errors.email && (
              <FieldDescription className="text-destructive">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                {...register("password", {
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
                disabled={Boolean(loading)}
              />
              <Button
                type="button"
                variant="none"
                size="none"
                className="absolute right-2 top-2.5"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={Boolean(loading)}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </Button>
            </div>
            {errors.password && (
              <FieldDescription className="text-destructive">
                {errors.password.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm Password
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              disabled={Boolean(loading)}
            />
            {errors.confirmPassword && (
              <FieldDescription className="text-destructive">
                {errors.confirmPassword.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={Boolean(loading)}>
              {loading === "credentials" ? "Creating account" : "Create Account"}
              {loading === "credentials" && <Loader />}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleSignin}
              disabled={Boolean(loading)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Signup with Google
              {loading === "google" && <Loader />}
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
  )
}
