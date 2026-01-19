"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlashCardStore } from "@/store/useFlashCardStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  GalleryVerticalEnd,
  ArrowRight,
  Layers,
  Plus,
  CalendarDays
} from "lucide-react";

export function FlashCardList() {
  const router = useRouter();
  const { flashCardList, isLoading, fetchFlashCardList } = useFlashCardStore();

  useEffect(() => {
    fetchFlashCardList();
  }, [fetchFlashCardList]);

  const handleCreateNew = () => router.push("/flashcard/select");

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent border">
              <GalleryVerticalEnd className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              My FlashCards
            </h1>
          </div>
          <p className="text-muted-foreground">
            Review your study decks generated from your PDFs. Click a deck to start practicing.
          </p>
        </div>
        <Button onClick={handleCreateNew} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <Plus className="mr-2 h-5 w-5" />
          New Deck
        </Button>
      </div>

      <div className="flex-1 min-h-100">
        {isLoading && flashCardList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader size={40} />
            <p className="text-muted-foreground animate-pulse">Loading your decks...</p>
          </div>
        ) : flashCardList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 border-2 border-dashed rounded-3xl bg-muted/10 text-center px-4">
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
                onClick={() => router.push(`/flashcards/${item.pdfId._id || item.pdfId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardDeckItem({ item, onClick }: { item: any; onClick: () => void }) {
  const pdfTitle = item.pdfId?.title || "Untitled Document";
  const cardCount = item.cards?.length || 0;

  return (
    <Card
      className="flex flex-col justify-between overflow-hidden border border-border/60 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer h-full"
      onClick={onClick}
    >

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start">
          <div className="p-2.5 rounded-lg bg-secondary/50 text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Layers className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="text-[10px] font-medium group-hover:border-primary/30 transition-colors">
            {cardCount} Cards
          </Badge>
        </div>

        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {pdfTitle}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs font-mono pt-1">
            <span>ID:</span>
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">
              {item._id.slice(-6).toUpperCase()}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter>
        <div className="w-full flex justify-between items-center text-sm font-medium text-muted-foreground group-hover:text-foreground">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Practice Now</span>
          </div>
          <div className="bg-background rounded-full p-1.5 shadow-sm border group-hover:border-primary/30 transition-colors">
            <ArrowRight className="h-3.5 w-3.5 text-primary -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}