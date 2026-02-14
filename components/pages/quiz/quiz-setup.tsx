"use client";

import { useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Plus } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface QuizSetupProps {
  pdfId: string;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onQuizReady: () => void;
}

export function QuizSetup({ pdfId, isOpen, setIsOpen, onQuizReady }: QuizSetupProps) {
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
      decrementCredits(20);
      setIsOpen(false);
      onQuizReady();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Generate Quizzes
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="sm:max-w-md" 
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => isLoading && e.preventDefault()}
        showCloseButton={!isLoading}
      >
        <DialogHeader className="mb-5">
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Quiz Setup
          </DialogTitle>
          <DialogDescription className="text-start">
            Generate a new quiz from your document.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="question-amount">Number of Questions</Label>
          <div className="flex flex-col gap-1">
            <Input
              id="question-amount"
              type="number"
              min={3}
              max={50}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="text-center text-lg"
            />
            <span className="text-sm text-muted-foreground shrink-0">
              (Min: 3 Questions) (Max: 50 Questions)
            </span>
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4" />
                Generating
              </>
            ) : (
              "Start Quiz"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}