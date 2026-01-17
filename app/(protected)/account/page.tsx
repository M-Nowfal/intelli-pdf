import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  return {
    title: `Intelli-PDF - ${session?.user?.name || "Account"}`,
    description: "Manage your account settings and preferences on Intelli-PDF.",
  };
}

export default function AccountPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-semibold">Account coming soon...</h1>
    </div>
  );
}