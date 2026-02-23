"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { QuizInterface } from "@/components/pages/quiz/quiz-interface";
import { QuizSetup } from "@/components/pages/quiz/quiz-setup";
import { BrainCircuit } from "lucide-react";
import { QuizSkeleton } from "@/components/pages/quiz/quiz-skeloton";

export default function ActiveQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { loadQuiz, currentQuiz, isLoading, resetCurrentQuiz } = useQuizStore();
  const [pdfId, setPdfId] = useState<string>("");
  const [initFinished, setInitFinished] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setPdfId(id);
      await loadQuiz(id);
      setInitFinished(true);
    })();

    return () => {
      resetCurrentQuiz();
    }
  }, [params]);

  useEffect(() => {
    if (!currentQuiz && !isLoading)
      setIsOpen(true);
    else
      setIsOpen(false);
  }, [currentQuiz]);

  if (isLoading && !currentQuiz || !initFinished) {
    return <QuizSkeleton />;
  }

  const quizSetup = <QuizSetup
    pdfId={pdfId}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    onQuizReady={() => loadQuiz(pdfId)}
  />;

  if (!currentQuiz) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Quizzes</h3>
        </div>
        <div className="text-center py-20 border-2 border-dashed w-full max-w-2xl m-auto rounded-xl space-y-4">
          <div className="p-5 m-auto w-fit rounded-full bg-primary/5 mb-4 ring-1 ring-primary/10">
            <BrainCircuit className="h-10 w-10 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold">No Quizzes Generated yet for this PDF</h3>
          <p className="text-muted-foreground mt-2">Generate new quizzes from a PDF by clicking the below button.</p>
          {quizSetup}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between w-full">
        <div className="text-start w-full">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
              <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold line-clamp-1">
              {typeof currentQuiz.pdfId === 'object' ? currentQuiz.pdfId.title : 'Quiz Session'}
            </h1>
          </div>
          <p className="text-muted-foreground ms-2 mt-2">
            Answer the questions below to test your knowledge.
          </p>
        </div>
        <div className="mt-3 ms-auto">
          {quizSetup}
        </div>
      </div>
      <QuizInterface quiz={currentQuiz} />
    </div>
  );
}