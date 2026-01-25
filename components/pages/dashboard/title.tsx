"use client";

import { LayoutDashboard, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

export function DashboardTitle() {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
          <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={3} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
      </div>
      <Button className="ml-auto gap-2" onClick={() => router.push("/pdf/upload")}>
        Upload New PDF
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}