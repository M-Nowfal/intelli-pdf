import { Dashboard } from "@/components/pages/dashboard/dashboard";

export const metadata = {
  title: "Intelli-PDF - Dashboard",
  description: "Manage your PDFs, view history, and access account settings on your Intelli-PDF dashboard.",
};

export default async function DashboardPage() {

  return (
    <Dashboard />
  );
}