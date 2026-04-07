"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Sparkles, FileText, AlertCircle, FileSearch, Trash2, Volume2, Copy, Check, Pause, Play, RotateCcw, Settings2 } from "lucide-react";
import { MarkDown } from "@/components/common/react-markdown";
import { Button } from "@/components/ui/button";
import { Alert as AlertDialog } from "@/components/common/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSummaryStore } from "@/store/useSummaryStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { cleanMarkdown, copy } from "@/helpers/chat.helper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSettingsStore } from "@/store/useSettingsStore";
import { playSuccessSound } from "@/utils/sound";
import { useSession } from "next-auth/react";
import { COST } from "@/utils/constants";

export default function SummarizePage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isMobile } = useSettingsStore();
  const isProUser = session?.user?.subscription?.tier === "pro";

  const [lengthPref, setLengthPref] = useState("standard");
  const [customPromptPref, setCustomPromptPref] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const {
    summary,
    isSummaryLoading,
    summaryError,
    source,
    needsGeneration,
    fetchSummary,
    deleteSummary,
    markAsViewed
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
      fetchSummary(id, { action: "check" });
    }
  }, [id]);

  useEffect(() => {
    if (summary && source === "generated") {
      playSuccessSound(2);
      if (!isProUser)
        decrementCredits(20);
      setShowConfig(false);
      markAsViewed();
    }
  }, [summary, source]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleGenerate = () => {
    fetchSummary(id, {
      action: summary ? "regenerate" : "generate",
      length: lengthPref,
      customPrompt: customPromptPref
    });
  };

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

  if (needsGeneration || showConfig) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4 w-full mx-auto overflow-x-hidden mt-8">
        <Card className="w-full max-w-3xl pt-0 shadow-xl border-border bg-card overflow-hidden animate-up fill-mode-both">
          <CardHeader className="bg-muted/30 py-6">
            <div className="flex items-center gap-3 mb-2 text-primary">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Settings2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Configure Summary</CardTitle>
            </div>
            <CardDescription className="text-base">
              Customize how you want the AI to analyze and summarize your document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-3">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Summary Detail Level</Label>
              <Select value={lengthPref} onValueChange={setLengthPref}>
                <SelectTrigger className="h-12 bg-background w-full">
                  <SelectValue placeholder="Select detail level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very short and concise">Very Short & Concise</SelectItem>
                  <SelectItem value="short, highlighting key points">Short (Key Points Only)</SelectItem>
                  <SelectItem value="standard">Standard (Recommended)</SelectItem>
                  <SelectItem value="highly detailed and comprehensive">Detailed & Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Custom Instructions <span className="text-muted-foreground font-normal">(Optional)</span></Label>
              <Textarea
                placeholder="e.g., Focus mainly on the mathematical formulas, or explain this like I am a beginner..."
                value={customPromptPref}
                onChange={(e) => setCustomPromptPref(e.target.value)}
                rows={4}
                className="resize-none bg-background p-4 max-h-62 md:max-h-72"
              />
            </div>

            <Separator />

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4 w-full">
              {summary && !needsGeneration && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowConfig(false)}
                  className="w-full sm:flex-1 md:h-14 text-base"
                  disabled={isSummaryLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                size="lg"
                onClick={handleGenerate}
                className="w-full sm:flex-2 gap-2 md:h-14 text-base overflow-hidden"
                disabled={isSummaryLoading}
              >
                <Sparkles className="h-5 w-5 shrink-0" />
                <span className="truncate">
                  {isSummaryLoading
                    ? "Generating Analysis..."
                    : summary
                      ? `Regenerate Summary (${isProUser ? 0 : COST} Credits)`
                      : `Generate Summary (${isProUser ? 0 : COST} Credits)`}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden animate-in fade-in duration-500">
      <div className="space-y-4 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
                <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Document Summary</h1>
            </div>
            <p className="sm:text-lg ms-2 text-muted-foreground">
              A detailed breakdown of the key concepts and arguments found in your PDF.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 ms-auto">
            {summary && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfig(true)}
                  disabled={isSummaryLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  <span>Regenerate</span>
                </Button>

                <AlertDialog
                  trigger={
                    <Button variant="outline" size="sm" disabled={isSummaryLoading} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span>Delete Summary</span>
                    </Button>
                  }
                  title={`Delete Summary?`}
                  description="This action will remove this summary permanently."
                  onContinue={() => deleteSummary(id, () => {
                    toast.success("Summary deleted successfully");
                    router.push("/summarize");
                  })}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Card className="gap-0 pt-0 w-full max-w-4xl mx-auto mt-2 shadow-lg border-border bg-card overflow-hidden">
        <CardHeader className="space-y-1 py-5 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold tracking-wide uppercase text-xs">AI Generated Analysis</span>
            </div>

            {summary?.content && (
              <div className="flex items-center gap-1">
                {(isSpeaking || isPaused) && !mobile && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon-sm" onClick={restartSpeech}>
                        <RotateCcw className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Stop reading</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleSpeech(summary?.content || "")}>
                      {mobile ? (
                        isSpeaking ? (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                        ) : <Volume2 className="size-4" />
                      ) : (
                        isSpeaking && !isPaused ? <Pause className="size-4 fill-current" />
                          : isPaused ? <Play className="size-4 fill-current" />
                            : <Volume2 className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Listen"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(summary?.content || "")}>
                      {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isCopied ? "Copied!" : "Copy summary"}</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {summary?.title && (
            <CardTitle className="text-2xl sm:text-3xl font-bold mt-2 leading-tight">
              {summary.title}
            </CardTitle>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="mt-5">
          {summaryError ? (
            <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Failed to load summary</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-3">
                <span className="text-sm opacity-90">{summaryError}</span>
                <Button variant="outline" size="sm" onClick={() => fetchSummary(id, { action: "check" })} className="w-fit">
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          ) : isSummaryLoading ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4 bg-primary/10 rounded-md" />
                <Skeleton className="h-4 w-full bg-primary/10 rounded-md" />
                <Skeleton className="h-4 w-5/6 bg-primary/10 rounded-md" />
              </div>
              <Skeleton className="bg-primary/5 h-40 w-full rounded-xl animate-pulse" />
              <Skeleton className="bg-primary/5 h-32 w-full rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-full w-full min-w-0 wrap-break-word
              prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-8 prose-h3:mt-6 prose-h2:mb-4 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1 prose-code:bg-muted prose-code:px-1 prose-code:rounded-md">
              <MarkDown content={summary?.content} />
            </div>
          )}
        </CardContent>
      </Card>

      {!isSummaryLoading && !summaryError && summary && (
        <div className="mt-6 mb-8 flex justify-center text-muted-foreground text-sm items-center gap-2">
          <FileText className="h-4 w-4 opacity-50" />
          <p>Generated by Gemini 2.5 Flash</p>
        </div>
      )}
    </div>
  );
}