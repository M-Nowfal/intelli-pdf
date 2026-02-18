import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

export function Hero() {
  const pathname = usePathname();

  return (
    <section className={`${pathname === "/" ? "pt-10" : ""} relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background`}>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl opacity-70 animate-pulse delay-1000 pointer-events-none" />

      <FloatingDoc
        className="top-[5%] left-[2%] md:top-[15%] md:left-[10%] -rotate-12 animate-float-slow"
        delay="0s"
        icon={<FileText className="h-full w-full text-blue-600" />}
        bgClass="bg-blue-500/10"
        title="Lecture_Notes.pdf"
      />

      <FloatingDoc
        className="top-[8%] right-[2%] md:top-[20%] md:right-[12%] rotate-6 animate-float"
        delay="2s"
        icon={<Sparkles className="h-full w-full text-yellow-600" />}
        bgClass="bg-yellow-500/10"
        title="AI Summary Generated"
      />

      <FloatingDoc
        className="bottom-[8%] left-[5%] md:bottom-[20%] md:left-[15%] rotate-12 animate-float-reverse"
        delay="1s"
        size="sm"
        icon={<BrainCircuit className="h-full w-full text-purple-600" />}
        bgClass="bg-purple-500/10"
        title="Quiz Ready"
      />

      <FloatingDoc
        className="bottom-[8%] right-[5%] md:bottom-[25%] md:right-[20%] -rotate-6 animate-float-slow"
        delay="3s"
        icon={<Layers className="h-full w-full text-green-600" />}
        bgClass="bg-green-500/10"
        title="Flashcards Created"
      />

      <div className="relative z-10 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">

          <Badge variant="secondary" className="px-4 py-2 gap-2 text-sm backdrop-blur-md bg-secondary/80 border-secondary-foreground/10 shadow-sm">
            <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>Now running on Gemini 2.5 Flash</span>
          </Badge>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1]">
            Turn your PDFs into <br className="hidden sm:inline" />
            <span className="text-primary bg-clip-text relative inline-block">
              Interactive Study Partners
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full blur-sm"></span>
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed backdrop-blur-sm md:backdrop-blur-none bg-background/30 md:bg-transparent p-2 rounded-xl">
            Don't just read—actively learn. Upload any textbook or lecture note, and let our AI
            generate summaries, flashcards, and quizzes instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
            <Button size="lg" className="h-14 px-10 text-lg gap-2 shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard" prefetch>
                Try for Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg backdrop-blur-sm bg-background/50" asChild>
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

function FloatingDoc({
  className,
  delay,
  icon,
  title = "Document.pdf",
  bgClass = "bg-primary/10",
  size = "md"
}: {
  className?: string,
  delay?: string,
  icon?: React.ReactNode,
  title?: string,
  bgClass?: string,
  size?: "sm" | "md"
}) {
  const widthClass = size === "sm" ? "w-28 md:w-32" : "w-40 md:w-48";
  const paddingClass = size === "sm" ? "p-3" : "p-4 md:p-5";
  const iconSizeClass = size === "sm" ? "h-6 w-6 md:h-8 md:w-8" : "h-8 w-8 md:h-12 md:w-12";

  const mobileOpacity = "opacity-40 xl:opacity-100";

  return (
    <Card
      className={`absolute flex flex-col gap-3 bg-card/90 backdrop-blur-sm border-muted/50 shadow-xl ${widthClass} ${paddingClass} ${mobileOpacity} ${className} pointer-events-none z-0`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-full ${bgClass} p-2 shrink-0`}>
          <div className={`${iconSizeClass}`}>
            {icon}
          </div>
        </div>
        <div className="space-y-1.5 w-full">
          <div className="h-2 w-full bg-foreground/10 rounded-full" />
          <div className="h-2 w-2/3 bg-foreground/10 rounded-full" />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500/50" />
        <span className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">
          {title}
        </span>
      </div>
    </Card>
  );
}