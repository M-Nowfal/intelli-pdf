"use client";

import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Layers, ExternalLink, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IPDF } from "@/types/pdf";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutate } from "@/hooks/use-mutate";
import { toast } from "sonner";
import { Alert } from "@/components/common/alert";
import { usePdfStore } from "@/store/usePdfStore";
import { Loader } from "@/components/ui/loader";

export default function PDFList() {
  const { pdfs, fetchPdfs, isLoading, error, removePdf } = usePdfStore();
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleRemovePDF = async (pdfId: string) => {
    await removePDF.mutate(`/pdf?id=${pdfId}`);
    if (!removePDF.error) {
      removePdf(pdfId);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-destructive/10 rounded-lg border border-destructive/20">
        <h3 className="text-lg font-semibold text-destructive">Error loading PDFs</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="mt-4 border-destructive/50 hover:bg-destructive/10"
          onClick={() => fetchPdfs()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const pdfList: IPDF[] = Array.isArray(pdfs) ? pdfs : [];

  if (!isLoading && pdfList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-lg bg-muted/30">
        <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">No PDFs Uploaded Yet</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Upload your first PDF to generate embeddings and start chatting with it.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/pdf/upload")}
        >
          Upload PDF
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {pdfList.map((pdf) => (
        <Card key={pdf._id} className="group hover:shadow-lg transition-all duration-300 border-border/60">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base font-semibold line-clamp-1" title={pdf.title}>
                {pdf.title}
              </CardTitle>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(pdf.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent className="pb-1">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="font-normal text-xs flex gap-1">
                <Layers className="h-3 w-3" /> {pdf.pages} Pages
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(pdf.fileSize)}
              </span>
            </div>
          </CardContent>

          <CardFooter className="pt-0 flex gap-2">
            <Button className="flex-1 gap-2" variant="default" asChild>
              <Link
                href={removePDF.loading ? "" : pdf.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={removePDF.loading ? "pointer-events-none opacity-50" : ""}
              >
                {removePDF.loading ? (
                  <>
                    Removing PDF
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    View PDF
                  </>
                )}
              </Link>
            </Button>
            <Alert
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  disabled={removePDF.loading}
                >
                  {removePDF.loading ? <Loader /> : <Trash2 className="h-4 w-4" />}
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
  );
}
