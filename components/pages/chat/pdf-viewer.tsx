"use client";

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  return (
    <iframe
      src={`${url}#zoom=33`}
      className="w-full h-full border-none"
      title="PDF Viewer"
    />
  );
}