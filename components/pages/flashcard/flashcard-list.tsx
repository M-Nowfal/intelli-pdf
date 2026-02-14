"use client";

import { useEffect } from "react";
import { useFlashCardStore } from "@/store/useFlashCardStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GalleryVerticalEnd,
  ArrowRight,
  Layers,
  Plus,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { vibrate } from "@/lib/haptics";
import { CardSkeloton } from "@/components/common/card-skeloton";
import { Alert } from "@/components/common/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function FlashCardList() {
  const router = useRouter();
  const { flashCardList, isLoading, fetchFlashCardList, deleteFlashCards } = useFlashCardStore();

  useEffect(() => {
    fetchFlashCardList();
  }, [fetchFlashCardList]);

  const handleCreateNew = () => router.push("/flashcards/select");

  const handleDeleteDeck = (cardId: string) => {
    deleteFlashCards(cardId);
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
              <GalleryVerticalEnd className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              My FlashCards
            </h1>
          </div>
          <p className="text-muted-foreground ms-2">
            Review your study decks generated from your PDFs. Click a deck to start practicing.
          </p>
        </div>
        <Button onClick={handleCreateNew} size="lg" className="shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
          New Deck
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-100">
        {isLoading && flashCardList.length === 0 ? (
          <CardSkeloton />
        ) : flashCardList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 border-2 border-dashed w-full max-w-5xl mt-10 mx-auto rounded-3xl bg-muted/10 text-center px-4">
            <div className="p-5 rounded-full bg-primary/5 mb-4 ring-1 ring-primary/10">
              <Layers className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">No flashcards yet</h3>
            <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
              Upload a document to generate your first set of AI study cards.
            </p>
            <Button variant="outline" onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first deck
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {flashCardList.map((item: any) => (
              <FlashcardDeckItem
                key={item._id}
                item={item}
                onDelete={() => handleDeleteDeck(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardDeckItem({
  item,
  onDelete
}: {
  item: any;
  onDelete: () => void;
}) {
  const pdfTitle = item.pdfId?.title || "Untitled Document";
  const cardCount = item.cards?.length || 0;

  return (
    <Card className="gap-2 group relative flex flex-col border-muted-foreground/20 transition-all duration-300 hover:shadow-lg hover:border-primary/20 bg-card hover:bg-accent/30 active:scale-95 overflow-hidden">
      <Link 
        href={`/flashcards/${item.pdfId._id}`} 
        onClick={() => vibrate()}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View Deck</span>
      </Link>

      <div className="absolute top-2 right-2 z-20">
        <Alert
          trigger={
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Deck</span>
            </Button>
          }
          title="Delete Flashcard Deck?"
          description="This will permanently delete this deck and all its cards. This action cannot be undone."
          onContinue={onDelete}
        />
      </div>

      <CardHeader className="relative z-0 pb-2 pointer-events-none"> 
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
            <Layers className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="px-3 text-[12px] font-medium bg-background/50 group-hover:border-primary/30 transition-all duration-300">
            {cardCount} Cards
          </Badge>
        </div>

        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors pr-6">
            {pdfTitle}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs font-mono pt-1">
            <span>ID:</span>
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">
              {item._id.slice(-7).toUpperCase()}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter className="flex flex-col gap-4 pt-0 mt-auto pointer-events-none relative z-0">
        <div className="w-full flex justify-between items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-all duration-300 border-t pt-4">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Practice Now</span>
          </div>
          <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </CardFooter>
    </Card>
  );
}