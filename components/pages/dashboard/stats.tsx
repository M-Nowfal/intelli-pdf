"use client";

import {
  GalleryVerticalEnd,
  Brain,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

export function DashboardStats() {
  const { stats, fetchStats, isLoading, error } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (error) 
      toast.error(error);
  }, [error]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card className="gap-3 bg-linear-to-br from-blue-50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Total Documents
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader /> : stats?.totalDocuments}
          </div>
          <p className="text-xs text-muted-foreground">
            +2 uploaded this week
          </p>
        </CardContent>
      </Card>
      <Card className="gap-3 bg-linear-to-br from-green-50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Flashcards Mastered
          </CardTitle>
          <GalleryVerticalEnd className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader /> : stats?.flashcardsMastered}
          </div>
          <p className="text-xs text-muted-foreground">
            +18% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="gap-3 bg-linear-to-br from-purple-50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Study Streak
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader /> : stats?.studyStreak?.streak} Days
          </div>
          <p className="text-xs text-muted-foreground">
            Keep it up!
          </p>
        </CardContent>
      </Card>
      <Card className="gap-3 bg-linear-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            AI Credits
          </CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader /> : stats?.aiCredits}
          </div>
          <Progress value={(stats?.aiCredits || 0) / 10} className="mt-2 h-2" />
        </CardContent>
      </Card>
    </div>
  );
}