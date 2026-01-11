"use client";

import Link from "next/link";
import {
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardRecentActivity() {
  return (
    <div className="grid gap-4 md:gap-8 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              Continue where you left off.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              View All
              <TrendingUp className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Computer_Networks_Unit_3.pdf
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Processed 2 hours ago • 2.4 MB
                  </p>
                </div>
                <Button variant="ghost" size="sm">Chat</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                Quiz Completed
              </p>
              <p className="text-sm text-muted-foreground">
                You scored 8/10 on "Data Structures"
              </p>
            </div>
            <div className="ml-auto font-medium text-green-500">+80pts</div>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarFallback>UP</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                File Uploaded
              </p>
              <p className="text-sm text-muted-foreground">
                OS_Lecture_Notes_Final.pdf
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}