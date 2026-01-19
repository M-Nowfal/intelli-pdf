"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Layers, MessageSquare, ArrowRight, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/helpers/file.helper";
import { usePdfStore } from "@/store/usePdfStore";
import { vibrate } from "@/lib/haptics";

export function SelectPDF() {
  const { pdfs, fetchPdfs, isPdfLoading, selectPdf } = usePdfStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  const handleSelect = (id: string) => {
    router.push(`${pathname.replace("/select", "")}/${id}`);
    selectPdf(id);
  };

  if (isPdfLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-50 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/10">
        <div className="bg-background p-4 rounded-full mb-4 shadow-sm ring-1 ring-border">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">No Documents Found</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
          Upload a PDF to your library to start chatting with it.
        </p>
        <Button onClick={() => router.push("/pdf/upload")}>
          Upload New PDF
          <Plus />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {pdfs.map((pdf) => (
        <Card
          key={pdf._id}
          onClick={() => {
            vibrate();
            handleSelect(pdf._id);
          }}
          className="gap-2 group relative flex flex-col overflow-hidden border-muted-foreground/20 transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer bg-card hover:bg-accent/30 active:scale-95"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="flex-1 space-y-2 pr-4">
              <CardTitle className="text-base font-semibold line-clamp-1 leading-tight group-hover:text-primary transition-colors" title={pdf.title}>
                {pdf.title}
              </CardTitle>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(pdf.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent className="pb-4 flex-1">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-normal text-xs flex gap-1.5 px-2.5 py-1 bg-background">
                <Layers className="h-3 w-3" /> {pdf.pages} Pages
              </Badge>
              <span className="text-xs text-muted-foreground border-l pl-3">
                {formatFileSize(pdf.fileSize)}
              </span>
            </div>
          </CardContent>

          <CardFooter className="pt-0 mt-auto">
            <div className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors border-t pt-3">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Start Conversation
              </span>
              <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}