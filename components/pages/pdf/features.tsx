import { BookOpen, FileUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

export function PDFFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-linear-to-br from-blue-50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10">
        <CardContent className="pt-1">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">AI Processing</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Intelligent analysis of your documents
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-green-50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10">
        <CardContent className="pt-1">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FileUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Flashcard Generation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Automatic creation of study flashcards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1 bg-linear-to-br from-purple-50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10">
        <CardContent className="pt-1">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Smart Summaries</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Key points and chapter summaries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}