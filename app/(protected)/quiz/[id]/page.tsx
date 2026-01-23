"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { QuizInterface } from "@/components/pages/quiz/quiz-interface";
import { Loader } from "@/components/ui/loader";

export default function ActiveQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { loadQuiz, currentQuiz, isLoading } = useQuizStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      loadQuiz(id).then(() => setIsReady(true));
    })();
  }, []);

  if (isLoading || !isReady || !currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader size={50} />
        <p className="text-muted-foreground">Loading quiz data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 py-8">
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