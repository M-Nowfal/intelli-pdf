"use client";

import { useEffect } from "react";
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

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;

  const { pdfs, fetchPdfs, selectPdf, isPdfLoading, getActivePdf } = usePdfStore();
  const activePdf = getActivePdf();

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs, pdfs.length]);

  useEffect(() => {
    if (id) {
      selectPdf(id);
    }
  }, [selectPdf, id]);

  if (activePdf && activePdf._id !== id) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <Loader size={50} />
      </div>
    );
  }

  if (isPdfLoading || !activePdf) {
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