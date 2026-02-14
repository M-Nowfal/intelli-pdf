"use client";

import { useEffect, useState } from "react";
import { useFlashCardStore } from "@/store/useFlashCardStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  GalleryVerticalEnd
} from "lucide-react";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";
import { FlashCardCount } from "./flashcard-count";
import { Alert } from "@/components/common/alert";

export function FlashcardView({ pdfId }: { pdfId: string }) {
  const {
    flashCards,
    isLoading,
    isGenerating,
    fetchFlashCards,
    deleteFlashCard
  } = useFlashCardStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (pdfId) fetchFlashCards(pdfId);
  }, [pdfId]);

  useEffect(() => {
    if (currentIndex >= flashCards.length && flashCards.length > 0) {
      setCurrentIndex(flashCards.length - 1);
    }
  }, [flashCards.length, currentIndex]);

  useEffect(() => {
    if (flashCards.length === 0 && !isLoading)
      setIsDialogOpen(true);
    else 
      setIsDialogOpen(false);
  }, [flashCards.length]);

  const handleNavigate = (direction: "next" | "prev") => {
    setIsFlipped(false);
    setTimeout(() => {
      if (direction === "next") {
        setCurrentIndex((prev) => Math.min(prev + 1, flashCards.length - 1));
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }, 200);
  };

  const handleDelete = async () => {
    const cardId = flashCards[currentIndex]._id;
    await deleteFlashCard(pdfId, cardId);
    setIsFlipped(false);
  };

  const currentCard = flashCards[currentIndex];
  const progress = flashCards.length > 0 ? ((currentIndex + 1) / flashCards.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full space-y-6">

      <div className="flex flex-col sm:flex-row md:items-center justify-between gap-7 shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
              <GalleryVerticalEnd className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Flashcards</h2>
          </div>
          <p className="text-sm ms-2 max-w-md text-muted-foreground">
            Learn smarter, not harder. Build your knowledge one flashcard at a time and keep leveling up effortlessly.
          </p>
        </div>
        <FlashCardCount {...{ pdfId, isDialogOpen, setIsDialogOpen }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-100">
        {isLoading && flashCards.length === 0 ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <Loader size={50} />
            <p className="text-muted-foreground">Loading your deck...</p>
          </div>
        ) : flashCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 md:p-12 space-y-6 text-center border-2 border-dashed rounded-3xl bg-muted/30 w-full max-w-2xl">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Your deck is empty</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm md:text-base">
                Click the generate button above to let AI create study cards from your document.
              </p>
            </div>
            {isGenerating && <div className="flex items-center gap-3">
              <span className="animate-pulse md:text-xl">Generating New FlashCards</span>
              <Loader size={30} />
            </div>}
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-8 flex flex-col justify-center mt-8 h-[60vh]">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Card {currentIndex + 1} of {flashCards.length}</span>
                <span>{Math.round(progress)}% Completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="relative w-full aspect-video perspective-1000">
              <motion.div
                className="relative w-full h-full preserve-3d cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 backface-hidden shadow-xl border-border/50 bg-card hover:border-primary/20 transition-colors">
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border px-2 sm:px-3 py-1 rounded-full">
                      Question
                    </span>
                  </div>

                  <div className="overflow-y-auto w-full text-center hide-scrollbar max-h-full flex items-center justify-center">
                    <h3 className="text-lg sm:text-2xl font-medium leading-relaxed text-card-foreground select-none px-2">
                      {currentCard?.question}
                    </h3>
                  </div>

                  <div className="absolute bottom-4 sm:bottom-6 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground/60 animate-pulse">
                    <RotateCw className="w-3 h-3" />
                    Tap to flip
                  </div>
                </Card>

                <Card
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 backface-hidden shadow-xl bg-green-50/90 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span className="text-[10px] sm:text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest border border-green-200 dark:border-green-800 px-2 sm:px-3 py-1 rounded-full">
                      Answer
                    </span>
                  </div>

                  <div className="overflow-y-auto w-full text-center hide-scrollbar max-h-full flex items-center justify-center">
                    <p className="text-base sm:text-xl font-medium leading-relaxed text-green-950/90 dark:text-green-50/90 select-none px-2">
                      {currentCard?.answer}
                    </p>
                  </div>

                  <div className="absolute bottom-4 sm:bottom-6 flex items-center gap-2 text-[10px] sm:text-xs text-green-600/60 dark:text-green-400/50">
                    <RotateCw className="w-3 h-3" />
                    Tap to flip back
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleNavigate("prev")}
                disabled={currentIndex === 0}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              <div className="flex gap-2">
                <Alert
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Delete Card</span>
                      <span className="sm:hidden">Delete</span>
                    </Button>
                  }
                  title="Remove This Card?"
                  description="Are you sure you want to delete this card? This action cannot be undone."
                  onContinue={handleDelete}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleNavigate("next")}
                disabled={currentIndex === flashCards.length - 1}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}