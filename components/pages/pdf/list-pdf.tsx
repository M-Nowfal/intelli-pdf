"use client";

import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Layers, ExternalLink, Trash2, Plus, Library, Sparkles, MessageSquare, BrainCircuit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IPDF } from "@/types/pdf";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutate } from "@/hooks/use-mutate";
import { toast } from "sonner";
import { Alert } from "@/components/common/alert";
import { usePdfStore } from "@/store/usePdfStore";
import { Loader } from "@/components/ui/loader";
import { formatFileSize } from "@/helpers/file.helper";
import { useChatStore } from "@/store/useChatStore";
import { useSummaryStore } from "@/store/useSummaryStore";
import { CardSkeloton } from "@/components/common/card-skeloton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PDFList() {
  const {
    pdfs, fetchPdfs, isPdfLoading,
    pdfError, removePdf
  } = usePdfStore();
  const { removeSummary } = useSummaryStore();
  const { removeChatFromList } = useChatStore();
  const removePDF = useMutate("DELETE");
  const router = useRouter();

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  useEffect(() => {
    if (removePDF.data && !removePDF.error)
      toast.success(removePDF.data.message || "PDF removed successfully");

    if (removePDF.error)
      toast.error(removePDF.error);
  }, [removePDF.data, removePDF.error]);

  const handleRemovePDF = async (pdfId: string) => {
    await removePDF.mutate(`/pdf?id=${pdfId}`);
    if (!removePDF.error) {
      removePdf(pdfId);
      removeChatFromList(pdfId);
      removeSummary(pdfId);
    }
  };

  const pdfList: IPDF[] = Array.isArray(pdfs) ? pdfs : [];
  const hasPdfs = pdfList.length > 0;

  return (
    <div className="space-y-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
              <Library className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={3} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My Library</h2>
          </div>
          <p className="text-muted-foreground text-sm ms-2">
            Manage your uploaded documents and track your study progress.
          </p>
        </div>
        {hasPdfs && !isPdfLoading && (
          <Button onClick={() => router.push("/pdf/upload")} className="shadow-sm w-fit ms-auto">
            Upload New PDF
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="min-h-100">
        {isPdfLoading ? (
          <CardSkeloton />
        ) : pdfError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-destructive/5 rounded-xl border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error loading PDFs</h3>
            <p className="text-muted-foreground mb-6">{pdfError}</p>
            <Button
              variant="outline"
              className="border-destructive/30 hover:bg-destructive/10"
              onClick={() => fetchPdfs()}
            >
              Try Again
            </Button>
          </div>
        ) : !hasPdfs ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed w-full max-w-5xl mt-10 mx-auto rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm ring-1 ring-border">
              <FileText className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">No PDFs Uploaded Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Upload your first PDF to generate embeddings and start chatting with it.
            </p>
            <Button
              className="mt-8"
              onClick={() => router.push("/pdf/upload")}
            >
              Upload PDF
              <Plus className="mr-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pdfList.map((pdf) => (
              <Card key={pdf._id} className="group gap-2 hover:shadow-lg transition-all duration-300 border-border/60 flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex-1 space-y-3 pr-4">
                    <CardTitle className="text-base font-semibold line-clamp-1 leading-tight" title={pdf.title}>
                      {pdf.title}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(pdf.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                </CardHeader>

                <CardContent className="pb-4 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-normal text-xs flex gap-1.5 px-2.5 py-1">
                      <Layers className="h-3 w-3" /> {pdf.pages} Pages
                    </Badge>
                    <span className="text-xs text-muted-foreground border-l pl-3">
                      {formatFileSize(pdf.fileSize)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/5 flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex-1 gap-2 shadow-sm" variant="default">
                        <Sparkles className="h-4 w-4" />
                        Start Learning
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="center" className="w-48 mb-2">
                      <DropdownMenuLabel>Study Modes</DropdownMenuLabel>
                      
                      <DropdownMenuItem asChild>
                        <Link href={`/chat/${pdf._id}`} className="cursor-pointer flex items-center gap-2" prefetch>
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span>AI Chat</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/flashcards/${pdf._id}`} className="cursor-pointer flex items-center gap-2" prefetch>
                          <Layers className="h-4 w-4 text-amber-500" />
                          <span>Flashcards</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/quiz/${pdf._id}`} className="cursor-pointer flex items-center gap-2" prefetch>
                          <BrainCircuit className="h-4 w-4 text-purple-500" />
                          <span>Take Quiz</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/summarize/${pdf._id}`} className="cursor-pointer flex items-center gap-2" prefetch>
                          <FileText className="h-4 w-4 text-green-500" />
                          <span>Summary</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href={pdf.fileUrl}
                          target="_blank"
                          className="cursor-pointer flex items-center gap-2 text-muted-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Original PDF</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Alert
                    trigger={
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                        disabled={removePDF.loading}
                      >
                        {removePDF.loading ? <Loader size={16} /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    }
                    title={`Delete "${pdf.title}"?`}
                    description="This will permanently remove the PDF and all related data like chats, summaries, quizzes, and flashcards. This action can't be undone."
                    onContinue={() => handleRemovePDF(pdf._id)}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}