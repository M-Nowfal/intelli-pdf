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
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader } from "@/components/ui/loader"

type LoginFormData = {
  email: string
  password: string
}

type AuthLoading = "google" | "credentials" | null;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState<AuthLoading>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading("credentials");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("No user found")) {
          toast.error("No account found with this email");
        } else if (result.error.includes("Invalid password")) {
          toast.error("Incorrect password");
        } else if (result.error.includes("sign in with Google")) {
          toast.error("This account uses Google sign-in");
        } else {
          toast.error("Invalid email or password");
        }
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setLoading(null);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Welcome back</h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className={cn(
                  "underline",
                  loading && "pointer-events-none opacity-50"
                )}
              >
                Sign up
              </Link>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter E-Mail address"
              disabled={Boolean(loading)}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <FieldDescription className="text-destructive">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className={cn(
                  "ml-auto text-sm underline-offset-4 hover:underline",
                  loading && "pointer-events-none opacity-50"
                )}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              disabled={Boolean(loading)}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <FieldDescription className="text-destructive">
                {errors.password.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={Boolean(loading)}>
              {loading === "credentials" ? "Logging in" : "Login"}
              {loading === "credentials" && <Loader />}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={Boolean(loading)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
              {loading === "google" && <Loader />}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  )
}