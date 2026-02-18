"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSummaryStore } from "@/store/useSummaryStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FilePlus,
  ScrollText,
  ArrowRight,
  CalendarDays,
  FileText,
  Sparkles,
  Trash2
} from "lucide-react";
import { CardSkeloton } from "@/components/common/card-skeloton";
import Link from "next/link";
import { vibrate } from "@/lib/haptics";
import { Alert } from "@/components/common/alert";
import { toast } from "sonner";

export function SummaryList() {
  const router = useRouter();
  const { summaryList, isSummaryLoading, fetchSummaryList } = useSummaryStore();

  useEffect(() => {
    fetchSummaryList();
  }, [fetchSummaryList]);

  const handleCreateNew = () => router.push("/summarize/select");

  return (
    <div className="flex flex-col h-full p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
              <ScrollText className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My Summaries
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Access your AI-generated insights. Review, share, or generate new summaries from your documents.
          </p>
        </div>

        <Button onClick={handleCreateNew} disabled={isSummaryLoading} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <FilePlus />
          New Summary
        </Button>
      </div>

      <div className="flex-1 min-h-100">
        {isSummaryLoading && summaryList.length === 0 ? (
          <CardSkeloton />
        ) : summaryList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 border-2 border-dashed w-full max-w-5xl mt-10 mx-auto rounded-3xl bg-muted/10 text-center px-4">
            <div className="p-5 rounded-full bg-primary/5 mb-4 ring-1 ring-primary/10">
              <Sparkles className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">No summaries yet</h3>
            <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
              Upload a PDF document to generate your first AI summary and meaningful insights.
            </p>
            <Button variant="outline" onClick={handleCreateNew} className="gap-2">
              <FilePlus className="h-4 w-4" />
              Create your first summary
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {summaryList.map((item) => (
              <SummaryCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ item }: { item: { id: string, title: string } }) {
  const { deleteSummary } = useSummaryStore();
  const router = useRouter();

  return (
    <Card className="gap-2 group relative flex flex-col border-muted-foreground/20 transition-all duration-300 hover:shadow-lg hover:border-primary/20 bg-card hover:bg-accent/30 active:scale-95 overflow-hidden">
      <Link
        href={`/summarize/${item.id}`}
        onClick={() => vibrate()}
        className="absolute inset-0 z-20"
        prefetch
      >
        <span className="sr-only">View Deck</span>
      </Link>
      <div className="absolute top-2 right-2 z-20">
        <Alert
          trigger={
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Deck</span>
            </Button>
          }
          title={`Delete Summary?`}
          description="This action will remove this summary permanently. You won't be able to recover it."
          onContinue={() => deleteSummary(item.id, () => {
            toast.success("Summary deleted successfully");
            router.push("/summarize");
          })}
        />
      </div>
      <CardHeader className="relative z-10 space-y-4">
        <div className="flex items-center gap-5">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
            <FileText className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-[10px] font-medium bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            AI Summary
          </Badge>
        </div>
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {item.title || "Untitled Document"}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs font-mono pt-1">
            <span>ID:</span>
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">
              {item.id.slice(-7).toUpperCase()}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter>
        <div className="w-full flex justify-between items-center text-sm font-medium text-muted-foreground group-hover:text-foreground">
          <div className="flex items-center gap-2 text-xs transition-all duration-300">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>View Full Summary</span>
          </div>
          <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />          </div>
      </CardFooter>
    </Card>
  );
}