"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { QuizInterface } from "@/components/pages/quiz/quiz-interface";
import { QuizSetup } from "@/components/pages/quiz/quiz-setup";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActiveQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { loadQuiz, currentQuiz, isLoading } = useQuizStore();
  const [pdfId, setPdfId] = useState<string>("");
  const [initFinished, setInitFinished] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setPdfId(id);
      await loadQuiz(id);
      setInitFinished(true);
    })();
  }, [params, loadQuiz]);

  if (isLoading || !initFinished) {
    return (
      <div className="flex justify-center items-center w-full h-[90vh] p-4">
        <Card className="w-full max-w-2xl m-auto shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-24 bg-primary/10" />
              <Skeleton className="h-5 w-10 bg-primary/10" />
            </div>

            <Skeleton className="h-10 w-full rounded-full bg-primary/10" />

            <div className="mt-4 space-y-2">
              <Skeleton className="h-7 w-3/4 bg-primary/10" />
              <Skeleton className="h-7 w-1/2 bg-primary/10" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-15 w-full rounded-xl bg-primary/10" />
            ))}
          </CardContent>

          <CardFooter className="flex justify-end pt-4">
            <Skeleton className="h-10 w-32 rounded-md bg-primary/10" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="p-4 py-8">
        <QuizSetup
          pdfId={pdfId}
          onQuizReady={() => loadQuiz(pdfId)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 py-8 flex flex-col items-center justify-center h-[85vh]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">
          {typeof currentQuiz.pdfId === 'object' ? currentQuiz.pdfId.title : 'Quiz Session'}
        </h1>
        <p className="text-muted-foreground">
          Answer the questions below to test your knowledge.
        </p>
      </div>

      <QuizInterface quiz={currentQuiz} />
    </div>
  );
}