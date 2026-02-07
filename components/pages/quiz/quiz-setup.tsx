"use client";

import { useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useDashboardStore } from "@/store/useDashboardStore";

interface QuizSetupProps {
  pdfId: string;
  onQuizReady: () => void;
}

export function QuizSetup({ pdfId, onQuizReady }: QuizSetupProps) {
  const { generateQuiz, isLoading } = useQuizStore();
  const [amount, setAmount] = useState(5);
  const { decrementCredits } = useDashboardStore();

  const handleGenerate = async () => {
    if (amount < 3 || amount > 50) {
      toast.error("Questions must be between 3 and 50");
      return;
    }

    const quizId = await generateQuiz(pdfId, amount);

    if (quizId) {
      toast.success("Quiz generated successfully!");
      onQuizReady();
      decrementCredits(20);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BrainCircuit className="w-6 h-6 text-primary" />
            Quiz Setup
          </CardTitle>
          <CardDescription>
            This document doesn't have a quiz yet. Create one now!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>How many questions?</Label>
            <Input
              type="number"
              min={3}
              max={50}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="text-center text-lg"
            />
            <p className="text-xs text-muted-foreground text-center">Max: 50</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader /> 
                Generating...
              </>
            ) : (
              "Start Quiz"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}