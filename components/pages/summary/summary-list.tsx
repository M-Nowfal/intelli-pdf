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
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FilePlus,
  ScrollText,
  ArrowRight,
  CalendarDays,
  FileText,
  Sparkles
} from "lucide-react";

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
              <ScrollText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Summaries
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Access your AI-generated insights. Review, share, or generate new summaries from your documents.
          </p>
        </div>

        <Button onClick={handleCreateNew} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <FilePlus className="mr-2 h-5 w-5" />
          New Summary
        </Button>
      </div>

      <div className="flex-1 min-h-100">
        {isSummaryLoading && summaryList.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        ) : summaryList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 border-2 border-dashed rounded-3xl bg-muted/10 text-center px-4">
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
                onClick={() => router.push(`/summarize/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ item, onClick }: { item: { id: string, title: string }, onClick: () => void }) {
  return (
    <Card
      className="relative flex flex-col justify-between overflow-hidden border hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer h-full"
      onClick={onClick}
    >
      <CardHeader className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div className="p-2.5 rounded-lg bg-secondary/50 text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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
              {item.id.slice(-6).toUpperCase()}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter>
        <div className="w-full flex justify-between items-center text-sm font-medium text-muted-foreground group-hover:text-foreground">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>View Full Summary</span>
          </div>
          <div className="bg-background rounded-full p-1.5 shadow-sm border group-hover:border-primary/30 transition-colors">
            <ArrowRight className="h-3.5 w-3.5 text-primary -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}