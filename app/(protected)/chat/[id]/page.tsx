"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePdfStore } from "@/store/usePdfStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Loader } from "@/components/ui/loader";
import { ChatInterface } from "@/components/pages/chat/chat-interface";
import { PdfViewer } from "@/components/pages/chat/pdf-viewer";
import { formatFileSize } from "@/helpers/file.helper";
import { formatChatListTitle } from "@/helpers/name.helper";
import { ChatActionMenu } from "@/components/pages/chat/chat-actions";

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;

  const { pdfs, fetchPdfs, isLoading } = usePdfStore();
  const [activePdf, setActivePdf] = useState<any>(null);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs, pdfs.length]);

  useEffect(() => {
    if (pdfs.length > 0) {
      const found = pdfs.find((pdf) => pdf._id === id);
      setActivePdf(found);
    }
  }, [pdfs, id]);

  if (isLoading || !activePdf) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <Loader size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">

      <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">

        <ResizablePanel
          defaultSize={20}
          minSize={0}
          className="hidden xl:block"
        >
          <div className="h-full w-full bg-gray-100 dark:bg-neutral-900 overflow-hidden">
            <PdfViewer url={activePdf.fileUrl} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden xl:flex" />

        <ResizablePanel defaultSize={80} minSize={50}>
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between border-b px-4 py-2 bg-background shrink-0">
              <h1 className="text-sm font-medium truncate max-w-40 md:max-w-md">
                {formatChatListTitle(activePdf.title)}
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {activePdf.pages} Pages • {formatFileSize(activePdf.fileSize)}
                </div>
                <ChatActionMenu title={activePdf.title} />
              </div>
            </div>

            <div className="flex-1 overflow-hidden w-full bg-background">
              <div className="h-full w-full max-w-5xl mx-auto flex flex-col">
                <ChatInterface pdfId={activePdf._id} title={activePdf.title} />
              </div>
            </div>
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}