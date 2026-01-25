import { SelectPDF } from "@/components/pages/select-pdf";
import { FileCheck } from "lucide-react";

export const metadata = {
  title: "Intelli-PDF - Select Document",
  description: "Select a document to start chatting.",
};

export default function AIChatPage() {
  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={3} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Select a Document to Chat
          </h1>
        </div>
        <p className="text-muted-foreground ms-2">
          Choose a PDF from your library to start a new AI conversation.
        </p>
      </div>
      <SelectPDF />
    </div>
  );
}