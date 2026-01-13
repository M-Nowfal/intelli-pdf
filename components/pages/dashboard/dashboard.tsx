"use client";

import { DashboardStats } from "@/components/pages/dashboard/stats";
import { DashboardRecentActivity } from "@/components/pages/dashboard/recent-activity";
import { DashboardTitle } from "@/components/pages/dashboard/title";
import DashboardSkeloton from "./dashboard-skeloton";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Dashboard() {
  const { isLoading } = useCurrentUser();

  return (
    isLoading ? (
      <DashboardSkeloton />
    ) : (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background w-full">
        <DashboardTitle />
        <DashboardStats />
        <DashboardRecentActivity />
      </main>
    )
  );
}