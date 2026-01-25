"use client";

import { useState } from "react";
import { useQuizStore, QuizItem } from "@/store/useQuizStore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Trophy, CheckCircle2, XCircle, ArrowRight, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuizInterface({ quiz }: { quiz: QuizItem }) {
  const { submitScore } = useQuizStore();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(quiz.score || 0);

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = { ...answers, [currentIndex]: selectedAnswer };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: Record<number, string>) => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (finalAnswers[index] === q.answer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / questions.length) * 100;
    setCalculatedScore(finalScore);
    setIsFinished(true);

    await submitScore(quiz._id, finalScore);
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedAnswer("");
    setIsFinished(false);
    setCalculatedScore(0);
  };

  if (isFinished) {
    const isPassing = calculatedScore >= 60;
    return (
      <div className="flex justify-center">
        <Card className="w-full max-w-lg shadow-xl border-t-8 border-t-primary">
          <CardHeader className="flex flex-col items-center gap-2">
            <Trophy className={cn("w-12 h-12", isPassing ? "text-yellow-500" : "text-gray-400")} />
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
            <CardDescription>You scored {calculatedScore.toFixed(0)}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-h-100 overflow-y-auto space-y-4 hide-scrollbar">
              {questions.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.answer;
                return (
                  <div key={idx} className="text-sm p-3 rounded-lg bg-muted/50 border">
                    <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Correct: {q.answer}
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2 text-red-500 font-medium mt-1">
                        <XCircle className="w-4 h-4" /> Yours: {userAnswer || "Skipped"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleRetake}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Retake
            </Button>
            <Button onClick={() => router.push("/quiz")}>
              All Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-2xl m-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Question {currentIndex + 1} / {questions.length}</span>
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <CardTitle className="mt-4 text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className={cn(
                "flex items-center space-x-2 border rounded-xl p-4 cursor-pointer transition-all hover:bg-accent",
                selectedAnswer === option ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
              )}>
                <RadioGroupItem value={option} id={`opt-${idx}`} />
                <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={!selectedAnswer} size="lg" className="px-8">
            {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="pt-0.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}