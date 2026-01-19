import { FlashCardList } from "@/components/pages/flashcard/flashcard-list";

export const metadata = {
  title: "Intelli-PDF - AI Flashcards",
  description: "Create and review flashcards generated from your PDFs with Intelli-PDF.",
};

export default async function SelectPDFToGenerateFlashCardPage() {

  return (
    <div className="p-4 space-y-8">
      <FlashCardList />
    </div>
  );
}
