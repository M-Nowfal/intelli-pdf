import { OTPForm } from "@/components/auth/otp-form";

export default async function OTPPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm email={email ?? ""} />
      </div>
    </div>
  );
}
