"use client";

import { LayoutDashboard, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

export function DashboardTitle() {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-accent border">
          <LayoutDashboard className="h-6 w-6 text-primary" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
      </div>
      <Button className="ml-auto gap-2" onClick={() => router.push("/pdf/upload")}>
        <Plus className="h-4 w-4" />
        Upload PDF
      </Button>
    </div>
  );
}