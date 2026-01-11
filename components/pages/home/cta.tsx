import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <div className="relative rounded-3xl bg-linear-to-r from-neutral-300 via-neutral-950 to-neutral-300 dark:from-white/10 dark:via-white dark:to-white/10 px-6 py-10 md:px-16 md:py-16 text-center text-primary-foreground max-w-6xl mx-auto">
        <div className="absolute inset-0 opacity-10" />

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to ace your exams?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80">
            Join thousands of students who are saving time and learning faster with Intelli-PDF.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto" asChild>
            <Link href="/auth/signup">Get Started for Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}