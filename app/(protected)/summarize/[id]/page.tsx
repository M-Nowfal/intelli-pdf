"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Sparkles, FileText, AlertCircle, FileSearch, Trash2, Volume2, Copy, Check, Pause, Play, RotateCcw } from "lucide-react";
import { MarkDown } from "@/components/common/react-markdown";
import { Button } from "@/components/ui/button";
import { Alert as AlertDialog } from "@/components/common/alert";
import { toast } from "sonner";
import { useSummaryStore } from "@/store/useSummaryStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { cleanMarkdown, copy } from "@/helpers/chat.helper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSettingsStore } from "@/store/useSettingsStore";
import { playSuccessSound } from "@/utils/sound";

export default function SummarizePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isMobile } = useSettingsStore();

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
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const isCancelledRef = useRef<boolean>(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const mobile = isMobile();

  useEffect(() => {
    if (id) {
      fetchSummary(id);
      if (source === "generated") {
        playSuccessSound();
        decrementCredits(20);
      }
    }
  }, [id, summary]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleCopy = (content: string) => {
    copy(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const startReading = (content: string) => {
    window.speechSynthesis.cancel();
    isCancelledRef.current = false;

    setIsSpeaking(true);
    setIsPaused(false);

    const cleanText = cleanMarkdown(content);
    const chunks = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];

    let availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length === 0) availableVoices = voices;

    const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"));
    const preferredVoice =
      englishVoices.find((v) => v.name.includes("Google US English")) ||
      englishVoices.find((v) => v.name.includes("Microsoft David")) ||
      englishVoices.find((v) => v.name.includes("Daniel")) ||
      englishVoices.find((v) => v.name.toLowerCase().includes("male")) ||
      englishVoices[0];

    let currentIndex = 0;

    const speakNextChunk = () => {
      if (isCancelledRef.current || currentIndex >= chunks.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }

      const chunkText = chunks[currentIndex].trim();
      if (!chunkText) {
        currentIndex++;
        speakNextChunk();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      currentUtteranceRef.current = utterance;

      utterance.onend = () => {
        currentIndex++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        console.error("Chunk Error:", e);
        currentIndex++;
        speakNextChunk();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    isCancelledRef.current = true;
    setIsSpeaking(false);
    setIsPaused(false);
    currentUtteranceRef.current = null;
  };

  const restartSpeech = () => stopSpeech();

  const handleSpeech = (content: string) => {
    if (!("speechSynthesis" in window)) {
      toast.warning("Text-to-speech is not supported.");
      return;
    }

    if (isSpeaking && mobile) {
      stopSpeech();
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    startReading(content);
  };

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
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
            description="This action will remove this summary permanently."
            onContinue={() => deleteSummary(id, () => {
              toast.success("Summary deleted successfully");
              router.push("/summarize");
            })}
          />
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto mt-5 shadow-lg border-border bg-card overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-wide uppercase text-sm">AI Generated Analysis</span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-semibold">{summary?.title.replaceAll("_", " ")}</CardTitle>

          {summary?.content && <CardDescription className="flex items-center justify-end gap-1 md:gap-2">
            {(isSpeaking || isPaused) && !mobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={restartSpeech}
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop reading</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleSpeech(summary?.content || "")}
                >
                  {mobile ? (
                    isSpeaking ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    ) : <Volume2 className="size-4" />
                  ) : (
                    isSpeaking && !isPaused ? (
                      <Pause className="size-4 fill-current" />
                    ) : isPaused ? (
                      <Play className="size-4 fill-current" />
                    ) : (
                      <Volume2 className="size-4" />
                    )
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Listen"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => handleCopy(summary?.content || "")}
                >
                  {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied!" : "Copy summary"}
              </TooltipContent>
            </Tooltip>

          </CardDescription>}
        </CardHeader>

        <Separator />
        <CardContent>
          {summaryError ? (
            <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Failed to load summary</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-3">
                <span className="text-sm opacity-90">{summaryError}</span>
                <Button variant="outline" size="sm" onClick={() => fetchSummary(id)} className="w-fit">
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          ) : isSummaryLoading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-primary/10" />
                <Skeleton className="h-4 w-full bg-primary/10" />
                <Skeleton className="h-4 w-5/6 bg-primary/10" />
              </div>
              <Skeleton className="bg-primary/10 h-32 w-full rounded-md animate-pulse" />
              <Skeleton className="bg-primary/10 h-32 w-full rounded-md animate-pulse" />
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-full w-full min-w-0 wrap-break-word
              prose-headings:font-bold prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1">
              <MarkDown content={summary?.content} />
            </div>
          )}
        </CardContent>
      </Card>

      {!isSummaryLoading && !summaryError && (
        <div className="mt-5 flex justify-center text-muted-foreground text-sm items-center gap-2">
          <FileText className="h-4 w-4 opacity-50" />
          <p>Generated by Gemini 2.5 Flash</p>
        </div>
      )}
    </div>
  );
}