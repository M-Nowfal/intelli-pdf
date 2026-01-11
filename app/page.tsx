"use client";

import { CallToAction } from "@/components/pages/home/cta";
import { FAQ } from "@/components/pages/home/faq";
import { Features } from "@/components/pages/home/features";
import { Footer } from "@/components/pages/home/footer";
import { Hero } from "@/components/pages/home/hero";
import { Working } from "@/components/pages/home/working";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Hero />
        <Features />
        <Working />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
