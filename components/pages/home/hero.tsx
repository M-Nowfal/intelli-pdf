import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-70 animate-pulse delay-1000 pointer-events-none" />

      <FloatingDoc
        className="hidden xl:flex top-[15%] left-[10%] -rotate-12 animate-float-slow"
        delay="0s"
      />
      <FloatingDoc
        className="hidden xl:flex top-[20%] right-[12%] rotate-6 animate-float"
        delay="2s"
        icon={<Sparkles className="h-10 w-10 text-yellow-500/70" />}
      />
      <FloatingDoc
        className="hidden xl:flex bottom-[20%] left-[15%] rotate-12 animate-float-reverse"
        delay="1s"
        size="sm"
      />
      <FloatingDoc
        className="hidden xl:flex bottom-[25%] right-[20%] -rotate-6 animate-float-slow"
        delay="3s"
      />

      <div className="relative z-10 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">

          <Badge variant="secondary" className="px-4 py-2 gap-2 text-sm backdrop-blur-md bg-secondary/80 border-secondary-foreground/10">
            <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>Now running on Gemini 1.5 Flash</span>
          </Badge>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1]">
            Turn your PDFs into <br className="hidden sm:inline" />
            <span className="text-primary bg-clip-text relative inline-block">
              Interactive Study Partners
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full blur-sm"></span>
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Don't just read—actively learn. Upload any textbook or lecture note, and let our AI
            generate summaries, flashcards, and quizzes instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
            <Button size="lg" className="shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard">
                Try for Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Free Tier Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>No Credit Card Req.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingDoc({ className, delay, icon, size = "md" }: { className?: string, delay?: string, icon?: React.ReactNode, size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "p-3 w-32" : "p-5 w-48";
  const iconSize = size === "sm" ? "h-8 w-8" : "h-12 w-12";

  return (
    <Card
      className={`absolute flex flex-col gap-3 bg-card/80 backdrop-blur-md border-muted shadow-xl ${sizeClasses} ${className} pointer-events-none`}
      style={{ animationDelay: delay }}
    >
      <div className="rounded-full bg-primary/10 p-2 w-fit">
        {icon || <FileText className={`${iconSize} text-primary/70`} strokeWidth={1.5} />}
      </div>
      <div className="space-y-2 opacity-60">
        <div className="h-2.5 w-3/4 bg-muted-foreground/30 rounded-full" />
        <div className="h-2.5 w-1/2 bg-muted-foreground/30 rounded-full" />
      </div>
    </Card>
  );
}