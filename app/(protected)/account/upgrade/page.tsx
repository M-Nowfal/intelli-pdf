"use client";

import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function UpgradePage() {
  const features = [
    "Unlimited PDF Uploads",
    "Advanced AI Chat (Gemini Flash)",
    "Document Summarization",
    "Instant Flashcard Generation",
    "AI-Powered Quiz Creation",
    "Priority Processing Speed",
    "Early Access to New Features",
    "24/7 Priority Support",
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background flex flex-col items-center justify-center py-12 px-4 md:px-6">
      
      <div className="text-center space-y-4 mb-10 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Unlock the full power of <span className="text-primary">Intelli-AI</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          Supercharge your learning experience with our Pro plan. Get unlimited access to AI tools, faster processing, and exclusive features.
        </p>
      </div>

      <div className="w-full max-w-5xl">
        <Card className="grid lg:grid-cols-2 relative border-primary/20 shadow-2xl overflow-hidden bg-card">
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute top-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent" />

          <div className="flex flex-col justify-center p-6 lg:p-10 lg:border-r border-border/50 relative z-10">
            <CardHeader className="text-center pb-2 p-0">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full ring-1 ring-primary/20 shadow-lg shadow-primary/5">
                  <Crown className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Pro Access</CardTitle>
              <CardDescription className="text-lg mt-2">
                Everything you need to master your documents.
              </CardDescription>
            </CardHeader>

            <CardContent className="w-full mt-8 p-0">
              <div className="flex flex-col max-w-sm mx-auto items-center justify-center bg-muted/50 py-8 px-6 rounded-2xl border border-border/50 shadow-sm">
                <Badge variant="secondary" className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-3 py-1">
                  100% OFF • LIMITED TIME
                </Badge>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">₹0</span>
                  <span className="text-muted-foreground line-through text-xl">₹12,000</span>
                </div>
                <span className="text-muted-foreground font-medium mt-1">/ year</span>
                
                <div className="mt-4 pt-4 border-t border-border/50 w-full text-center">
                   <p className="text-xs text-muted-foreground font-medium">
                    Free for all users during beta period
                  </p>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="flex flex-col justify-center p-6 lg:p-10 bg-muted/10 relative z-10">
            
            <Separator className="lg:hidden mb-8" />

            <CardContent className="space-y-6 p-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  What&apos;s included:
                </h3>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 mt-8 p-0">
              <Button size="lg" className="w-full text-lg font-semibold h-14 shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]"
                onClick={() => toast.success("Free Access Claimed.")}
              >
                Claim Free Access
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No credit card required • Cancel anytime • Secure
              </p>
            </CardFooter>
          </div>
        </Card>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-background rounded-xl border shadow-sm">
            <Zap className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Lightning Fast</h3>
            <p className="text-xs text-muted-foreground">
              AI responses generated in seconds.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-background rounded-xl border shadow-sm">
            <Shield className="h-6 w-6 text-green-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Secure & Private</h3>
            <p className="text-xs text-muted-foreground">
              Your documents are encrypted and safe.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-background rounded-xl border shadow-sm">
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Best-in-Class AI</h3>
            <p className="text-xs text-muted-foreground">
              Powered by the latest LLM technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}