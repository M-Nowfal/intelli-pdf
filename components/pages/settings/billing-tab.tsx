"use client";

import { CreditCard, Share2, Sparkles, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { differenceInCalendarDays } from "date-fns";
import { Loader } from "@/components/ui/loader";
import { APP_URL } from "@/utils/constants";
import { cn } from "@/lib/utils";

export function BillingTab() {
  const { stats, fetchStats, refetchStats } = useDashboardStore();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleShare = async () => {
    let shareUrl = APP_URL;
    
    try {
      const res = await api.get("/user/credits/referral");
      if (res.status === 200) {
        shareUrl = `${APP_URL}/signup?ref=${res.data.referralCode}`
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error fetching referral code");
    }

    const shareData = {
      title: 'Intelli-PDF',
      text: 'Check out Intelli-PDF! It uses AI to summarize documents and create quizzes instantly.',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (clipboardErr) {
        toast.error("Failed to copy link.");
      }
    }
  };

  const lastClaimDate = stats?.lastClaimedAt ? new Date(stats.lastClaimedAt) : null;
  const canClaim = !lastClaimDate || differenceInCalendarDays(new Date(), lastClaimDate) >= 1;

  const handleClaimDaily = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    try {
      const res = await api.post("/user/credits/claim");

      if (res.data.success) {
        toast.success(res.data.message);
        await refetchStats();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to claim credits");
    } finally {
      setIsClaiming(false);
    }
  };

  const maxCredits = 1000;
  const currentCredits = stats?.aiCredits || 0;
  const isOverLimit = currentCredits > maxCredits;
  const progressPercentage = Math.min(100, (currentCredits / maxCredits) * 100);

  return (
    <Card className="pb-0 overflow-hidden">
      <CardHeader>
        <CardTitle>AI Credits Usage</CardTitle>
        <CardDescription>Monitor your AI consumption for generating quizzes and chats.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Monthly Credits</span>
            <span className={cn(
              "font-medium", 
              isOverLimit ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"
            )}>
              {currentCredits} / {maxCredits}
              {isOverLimit && <span className="text-xs ml-1.5 font-normal">(+Bonus)</span>}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={cn(
              "h-2",
              isOverLimit && "[&>div]:bg-amber-500"
            )} 
          />
        </div>

        <div className="rounded-lg border p-4 bg-background">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs text-muted-foreground">Currently Active</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="rounded-lg border bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-900/10 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-600">
                <Gift className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Daily Credit Allowance</h4>
                <p className="text-xs text-muted-foreground max-w-70">
                  Get <strong>50 credits</strong> every day. Missed days stack up!
                </p>
              </div>
            </div>

            <Button
              onClick={handleClaimDaily}
              disabled={!canClaim || isClaiming}
              size="sm"
              variant={canClaim ? "default" : "outline"}
              className={canClaim ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600 w-full sm:w-auto" : "w-full sm:w-auto"}
            >
              {isClaiming ? (
                <Loader />
              ) : (
                <Gift />
              )}
              {canClaim ? "Claim Credits" : "Claimed Today"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-900/10 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
                <h4 className="font-semibold text-sm">Get Free Credits</h4>
              </div>
              <p className="text-sm text-muted-foreground max-w-75">
                Running low? Invite friends to <strong>Intelli-PDF</strong> Help them study smarter and earn <strong>250 bonus credits</strong> for every friend who signs up.
              </p>
            </div>
            <Button
              onClick={handleShare}
              variant="secondary"
              className="shrink-0 w-full sm:w-auto gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {isCopied ? "Copied!" : "Share App"}
            </Button>
          </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4 bg-muted/20">
        <p className="text-sm text-muted-foreground">Need more power?</p>
        <Button variant="default" onClick={() => router.push("/upgrade")}>Upgrade to Pro</Button>
      </CardFooter>
    </Card>
  );
}