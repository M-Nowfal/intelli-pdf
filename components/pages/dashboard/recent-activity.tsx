"use client";

import Link from "next/link";
import {
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePdfStore } from "@/store/usePdfStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/helpers/file.helper";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";

export function DashboardRecentActivity() {
  const { pdfs, isPdfLoading, fetchPdfs } = usePdfStore();
  const router = useRouter();

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  const hasPdf = pdfs.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            {hasPdf ? "Continue where you left off." : "No Documents uploaded yet."}
          </CardDescription>
        </div>
        {hasPdf && <Button asChild size="sm" className="ml-auto gap-1">
          <Link href={hasPdf ? "/pdf" : "/pdf/upload"}>
            View All
            <TrendingUp className="h-4 w-4" />
          </Link>
        </Button>}
      </CardHeader>
      {isPdfLoading && <CardContent>
        <div className="flex justify-center">
          <Loader size={30} />
        </div>
      </CardContent>}
      {hasPdf && <CardContent>
        <div className="grid lg:grid-cols-2">
          {pdfs.slice(0, 5).map((pdf) => (
            <div key={pdf._id} className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {pdf.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(pdf.createdAt), { addSuffix: true })} • {formatFileSize(pdf.fileSize)}
                </p>
              </div>
              <Button variant="secondary" size="sm"
                onClick={() => router.push(`/chat/${pdf._id}`)}
              >Chat</Button>
            </div>
          ))}
        </div>
      </CardContent>}
    </Card>
  );
}