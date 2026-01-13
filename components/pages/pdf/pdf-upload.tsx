"use client";

import { PDFHeader } from "@/components/pages/pdf/header";
import { PDFFeatures } from "@/components/pages/pdf/features";
import { PDFUpload } from "@/components/pages/pdf/upload";
import { PDFUploadSkeleton } from "./pdfupload-skeloton";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function UploadPDF() {
  const { isLoading } = useCurrentUser();

  return (
    isLoading ? (
      <PDFUploadSkeleton />
    ) : (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 mx-auto w-full">
        <PDFHeader />
        <PDFFeatures />
        <PDFUpload />
      </div>
    )
  );
}