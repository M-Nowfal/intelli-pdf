import PDFList from "@/components/pages/pdf/list-pdf";

export const metadata = {
  title: "Intelli-PDF - Your PDFs",
  description: "Manage and view your uploaded PDFs on Intelli-PDF.",
};

export default async function PDFPage() {

  return (
    <div className="p-4 md:p-6 lg:p-8 mx-auto w-full">
      <PDFList />
    </div>
  );
}
