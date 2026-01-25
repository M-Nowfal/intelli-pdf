import { SelectPDF } from "@/components/pages/select-pdf";
import { GalleryVerticalEnd } from "lucide-react";

export const metadata = {
  title: "Intelli-PDF - AI Flashcards",
  description: "Create and review flashcards generated from your PDFs with Intelli-PDF.",
};

export default async function SelectPDFToGenerateFlashCardPage() {

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <GalleryVerticalEnd className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Select a Document to Generate FlashCard
          </h1>
        </div>
        <p className="text-muted-foreground ms-2">
          Choose a PDF from your library to start generat flash card and learn qickly.
        </p>
      </div>
      <SelectPDF />
    </div>
  );
}
