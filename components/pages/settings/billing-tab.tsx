import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";

export function BillingTab() {
  const { stats } = useDashboardStore();
  const router = useRouter();

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>AI Credits Usage</CardTitle>
        <CardDescription>Monitor your AI consumption for generating quizzes and chats.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Monthly Credits</span>
            <span className="text-muted-foreground">
              {stats?.aiCredits || 0} / 1000
            </span>
          </div>
          <Progress value={((stats?.aiCredits || 0) / 1000) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground pt-1">
            Resets on the 1st of every month.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4 bg-muted/20">
        <p className="text-sm text-muted-foreground">Need more power?</p>
        <Button variant="default" onClick={() => router.push("/upgrade")}>Upgrade to Pro</Button>
      </CardFooter>
    </Card>
  );
}