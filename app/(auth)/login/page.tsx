import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Intelli-PDF Login",
  description: "Login to use Intelli-PDF's intelli AI"
};

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
