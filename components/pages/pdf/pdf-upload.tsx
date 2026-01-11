"use client";

import { PDFHeader } from "@/components/pages/pdf/header";
import { PDFFeatures } from "@/components/pages/pdf/features";
import { PDFUpload } from "@/components/pages/pdf/upload";
import { useSession } from "next-auth/react";
import { PDFUploadSkeleton } from "./pdfupload-skeloton";

export default function UploadPDF() {
  const { status } = useSession();

  return (
    status === "loading" ? (
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