import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CallToAction() {
  return (
    <section className="px-4 py-20 md:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-card border border-border px-6 py-16 text-center shadow-2xl sm:px-16 md:py-24">

        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-card/80 to-card" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-primary/20 blur-[100px]" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">

          <Badge variant="outline" className="px-3 py-1 gap-2 border-primary/20 bg-primary/5 text-primary backdrop-blur-xl">
            <Sparkles className="h-4 w-4 fill-primary/30" />
            <span className="bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent font-medium">
              Limited Time Free Access
            </span>
          </Badge>

          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Ready to master your <br />
            <span className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              studies effortlessly?
            </span>
          </h2>

          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join thousands of students who are saving hours every week. Turn any messy PDF into a structured learning path instantly.
          </p>

          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 w-full sm:w-auto px-8 text-base shadow-lg shadow-primary/20"
              asChild
            >
              <Link href="/signup" prefetch>
                Get Started for Free
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-full sm:w-auto px-8 text-base bg-transparent hover:bg-muted/50"
              asChild
            >
              <Link href="#" className="gap-2 hover:cursor-not-allowed opacity-75">
                View Live Demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}