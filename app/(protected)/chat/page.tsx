import { SelectPDF } from "@/components/pages/chat/select-pdf";

export const metadata = {
  title: "Intelli-PDF - Select Document",
  description: "Select a document to start chatting.",
};

export default function AIChatPage() {
  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Select a Document</h1>
        <p className="text-muted-foreground">
          Choose a PDF from your library to start a new AI conversation.
        </p>
      </div>
      <SelectPDF />
    </div>
  );
}