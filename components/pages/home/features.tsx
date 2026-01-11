import { 
  Bot, 
  BrainCircuit, 
  FileText, 
  Layers, 
  LayoutDashboard, 
  Library, 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-background border-muted/60 transition-all hover:border-accent hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 p-2 ring-1 ring-inset ring-foreground/10">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export function Features() {
  return (
    <section id="features" className="px-4 md:px-8 py-16 md:py-24 space-y-12 max-w-400 mx-auto">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Everything you need to master your subjects
        </h2>
        <p className="text-lg text-muted-foreground">
          Stop highlighting and starting memorizing. Our toolsuite transforms passive reading into active recall.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Bot className="h-8 w-8 text-blue-500" />}
          title="AI Chat Assistant"
          description="Chat directly with your PDF. Ask questions, request clarifications, and find specific information instantly without scrolling."
        />
        <FeatureCard
          icon={<Layers className="h-8 w-8 text-purple-500" />}
          title="Smart Flashcards"
          description="Automatically generate flashcards from key concepts in your documents. Perfect for last-minute exam revision."
        />
        <FeatureCard
          icon={<BrainCircuit className="h-8 w-8 text-green-500" />}
          title="Quiz Generation"
          description="Test your knowledge with AI-generated multiple choice questions. Identify your weak spots before the real exam."
        />
        <FeatureCard
          icon={<FileText className="h-8 w-8 text-orange-500" />}
          title="Instant Summaries"
          description="Get concise summaries of long chapters or research papers. Understand the 'big picture' in seconds."
        />
        <FeatureCard
          icon={<Library className="h-8 w-8 text-red-500" />}
          title="Document Library"
          description="Organize all your study materials in one place. Search across all your uploaded documents at once."
        />
        <FeatureCard
          icon={<LayoutDashboard className="h-8 w-8 text-cyan-500" />}
          title="Progress Tracking"
          description="Track your learning streak, flashcards mastered, and quiz scores. See your improvement over time."
        />
      </div>
    </section>
  );
}