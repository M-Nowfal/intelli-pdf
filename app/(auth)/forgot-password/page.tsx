import { ForgotPassword } from "@/components/auth/forgot-password";

export const metadata = {
  title: "Intelli-PDF Forgot Password",
  description: "You can change the password by autherization."
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPassword />
      </div>
    </div>
  );
}
