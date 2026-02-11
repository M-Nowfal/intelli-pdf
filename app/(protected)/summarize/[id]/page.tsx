"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Sparkles, FileText, AlertCircle, FileSearch, Trash2, Volume2, Copy, Check } from "lucide-react";
import { MarkDown } from "@/components/common/react-markdown";
import { Button } from "@/components/ui/button";
import { Alert as AlertDialog } from "@/components/common/alert";
import { toast } from "sonner";
import { useSummaryStore } from "@/store/useSummaryStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { cleanMarkdown, copy } from "@/helpers/chat.helper";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function SummarizePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const {
    summary,
    isSummaryLoading,
    summaryError,
    source,
    fetchSummary,
    deleteSummary
  } = useSummaryStore();
  const { decrementCredits } = useDashboardStore();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (id) {
      fetchSummary(id);
      if (source === "generated") {
        decrementCredits(20);
      }
    }
  }, [id, fetchSummary]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleCopy = (content: string) => {
    copy(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeech = (content: string) => {
    if (!("speechSynthesis" in window)) {
      toast.warning("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = cleanMarkdown(content);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));

    const preferredVoice = englishVoices.find(
      (v) =>
        v.name.includes("Microsoft David") ||
        v.name.includes("Daniel") ||
        (v.name.includes("Google") && v.name.includes("Male")) ||
        v.name.includes("Male")
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }

    utterance.lang = "en-US";
    utterance.pitch = 0.9;
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4">
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
                <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Document Summary</h1>
            </div>
            <p className="sm:text-lg ms-2">
              A detailed breakdown of the key concepts and arguments found in your PDF.
            </p>
          </div>
          <AlertDialog
            trigger={
              <Button size="sm" disabled={isSummaryLoading}>
                <Trash2 />
                <span className="hidden sm:inline">Delete Summary</span>
              </Button>
            }
            title={`Delete ${summary?.title} Summary?`}
            description="This action will remove this summary permanently. You won't be able to recover it."
            onContinue={() => deleteSummary(id, () => {
              toast.success("Summary deleted successfully");
              router.push("/summarize");
            })}
          />
        </div>
      </div>

      <Card className="max-w-4xl mx-auto mt-5 shadow-lg border-border bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-wide uppercase text-sm">AI Generated Analysis</span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-semibold">{summary?.title}</CardTitle>
          <CardDescription className="sm:text-lg">
            A detailed breakdown of the key concepts and arguments found in your PDF.
          </CardDescription>

          <CardDescription className="flex items-center justify-end gap-2 md:gap-5">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => handleCopy(summary?.content || "")}
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="size-5 lg:size-6" /> : <Copy className="size-5 lg:size-6" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied!" : "Copy summary to clipboard"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted",
                    isSpeaking && "text-primary bg-primary/10 hover:bg-primary/20"
                  )}
                  onClick={() => handleSpeech(summary?.content || "")}
                  disabled={!summary?.content || isSummaryLoading}
                >
                  {isSpeaking ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  ) : (
                    <Volume2 className="size-5 lg:size-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isSpeaking ? "Stop reading" : "Read summary aloud"}
              </TooltipContent>
            </Tooltip>
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          {summaryError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{summaryError}</AlertDescription>
            </Alert>
          ) : isSummaryLoading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-primary/10" />
                <Skeleton className="h-4 w-full bg-primary/10" />
                <Skeleton className="h-4 w-5/6 bg-primary/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-primary/10" />
                <Skeleton className="h-4 w-4/5 bg-primary/10" />
                <Skeleton className="h-4 w-full bg-primary/10" />
              </div>
              <Skeleton className="bg-primary/10 h-32 w-full rounded-md animate-pulse" />
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:font-bold prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1
            ">
              <MarkDown content={summary?.content} />
            </div>
          )}
        </CardContent>
      </Card>

      {!isSummaryLoading && !summaryError && (
        <div className="mt-5 flex justify-center text-muted-foreground text-sm items-center gap-2">
          <FileText className="h-4 w-4 opacity-50" />
          <p>Generated by Gemini 1.5 Flash</p>
        </div>
      )}
    </div>
  );
}