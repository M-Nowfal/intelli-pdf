function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-muted/60 shadow-sm">
      <div className="text-5xl font-extrabold text-muted-foreground mb-4 font-mono">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export function Working() {
  return (
    <section className="bg-muted/30 py-16 md:py-24 border-y border-border/50">
      <div className="px-4 md:px-8 space-y-12 max-w-400 mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How it Works</h2>
          <p className="text-lg text-muted-foreground">Three simple steps to smarter studying.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

          <StepCard
            number="01"
            title="Upload PDF"
            description="Drag and drop your lecture notes, textbooks, or research papers."
          />
          <StepCard
            number="02"
            title="AI Analyzes"
            description="Our AI reads the document, identifying key concepts and definitions."
          />
          <StepCard
            number="03"
            title="Start Learning"
            description="Review summaries, flip flashcards, or take a quiz immediately."
          />
        </div>
      </div>
    </section>
  );
}