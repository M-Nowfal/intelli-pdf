"use client";

import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

export function DashboardTitle() {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <Button className="ml-auto gap-2" onClick={() => router.push("/pdf/upload")}>
        <Plus className="h-4 w-4" />
        Upload PDF
      </Button>
    </div>
  );
}