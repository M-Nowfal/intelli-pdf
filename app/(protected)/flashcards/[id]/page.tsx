import { FlashcardView } from "@/components/pages/flashcard/flashcard-view";

export const metadata = {
  title: "Intelli-PDF - Flashcards",
  description: "Create and review flashcards generated from your PDFs with Intelli-PDF.",
};

type PageProps = { params: Promise<{ id: string; }> };

export default async function FlashcardsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="p-4">
      <FlashcardView pdfId={id} />
    </div>
  );
}