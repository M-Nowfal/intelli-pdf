"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, PlayCircle, BookOpen, ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";
import { Alert } from "@/components/common/alert";

export function QuizList() {
  const { quizzes, fetchQuizzes, deleteQuiz, isLoading } = useQuizStore();
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  if (isLoading && quizzes.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader size={50} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
              <ListChecks className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          </div>
          <p className="text-muted-foreground">
            Review your past assessments or retake a quiz to improve your score.
          </p>
        </div>
        {!isLoading && quizzes.length > 0 && <Button onClick={() => router.push("/quiz/select")}>
          Generate New Quiz
        </Button>}
      </div>

      {
        quizzes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl space-y-4">
            <h3 className="text-xl font-semibold">No Quizzes Found</h3>
            <p className="text-muted-foreground mt-2">Generate a quiz from a PDF to see it here.</p>
            <Button onClick={() => router.push("/quiz/select")}>
              Generate New Quiz
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="gap-2 flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1 text-lg">
                        {typeof quiz.pdfId === 'object' ? quiz.pdfId.title : 'Unknown Document'}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {quiz.questions.length} Questions
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Score</p>
                      <p className={`text-2xl font-bold ${quiz.score >= 60 ? 'text-green-600' : 'text-primary'}`}>
                        {quiz.score ? quiz.score.toFixed(0) : 0}%
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {quiz.createdAt ? format(new Date(quiz.createdAt), "MMM d, yyyy") : ""}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-muted/20 flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/quiz/${quiz.pdfId._id}`)}
                    disabled={isLoading}
                  >
                    <PlayCircle />
                    {quiz.score > 0 ? "Retake" : "Start"}
                  </Button>
                  <Alert
                    trigger={
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader size={16} /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    }
                    title={`Delete "${quiz.pdfId.title}"?`}
                    description="This will permanently remove the quiz from the server. This action can't be undone."
                    onContinue={() => deleteQuiz(quiz.pdfId._id)}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      }
    </div >
  );
}