import { BookOpen, Sparkles } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";

export function PDFHeader() {
  return (
    <div className="space-y-4 text-center md:text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-accent border">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={3} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              AI Study Assistant
            </h1>
          </div>
          <p className="text-xl font-semibold">
            Upload Study Materials
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Upload your PDF study materials and let our AI automatically create flashcards,
            summaries, and practice questions for you.
          </p>
        </div>

        <Badge variant="outline" className="h-fit px-4 py-2 text-sm gap-2">
          <Sparkles className="h-3 w-3" />
          AI-Powered Learning
        </Badge>
      </div>

      <Separator />
    </div>
  );
}