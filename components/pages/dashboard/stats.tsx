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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vibrate } from "@/lib/haptics";

export function DashboardStats() {
  const { stats, fetchStats, isLoading, error } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const maxCredits = 1000;
  const currentCredits = stats?.aiCredits || 0;
  const isOverLimit = currentCredits > maxCredits;
  const progressPercentage = Math.min(100, (currentCredits / maxCredits) * 100);

  function navigate(url: string) {
    vibrate();
    router.push(url);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

      <Card onClick={() => navigate("/pdf")} className="gap-3 bg-linear-to-br from-blue-50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader size={15} /> : stats?.totalDocuments || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "..." : `+${stats?.weeklyUploads || 0} uploaded this week`}
          </p>
        </CardContent>
      </Card>

      <Card onClick={() => navigate("/flashcards")} className="gap-3 bg-linear-to-br from-green-50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">FlashCards Created</CardTitle>
          <GalleryVerticalEnd className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader size={15} /> : stats?.flashcardsMastered || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Lifetime generated
          </p>
        </CardContent>
      </Card>

      <Card className="gap-3 bg-linear-to-br from-purple-50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Loader size={15} /> : stats?.studyStreak?.streak || 0} Days
          </div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>

      <Card onClick={() => navigate("/settings?tab=billing")} className="gap-3 bg-linear-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 shadow hover:shadow-xl transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
          <Brain className={cn(
            "h-4 w-4",
            isOverLimit ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"
          )} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className={cn(
              "text-2xl font-bold",
              isOverLimit && "text-amber-600 dark:text-amber-500"
            )}>
              {isLoading ? <Loader size={15} /> : currentCredits}
            </div>

            {isOverLimit && (
              <p className="text-xs text-amber-600 dark:text-amber-500 font-medium mt-1">
                Bonus credits active!
              </p>
            )}
          </div>

          <Progress
            value={progressPercentage}
            className={cn(
              "mt-2 h-2",
              isOverLimit && "[&>div]:bg-amber-500"
            )}
          />
        </CardContent>
      </Card>

    </div>
  );
}