"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MarkDown } from "@/components/common/react-markdown";
import api from "@/lib/axios";
import { Loader } from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Copy, Pause, Play, RotateCcw, Volume2, Lock, MessageCircleDashedIcon, RefreshCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOT } from "@/utils/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cleanMarkdown, copy } from "@/helpers/chat.helper";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SharedChatPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const router = useRouter();

  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUnshared, setIsUnshared] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [pausedId, setPausedId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCancelledRef = useRef<boolean>(false);
  const { isMobile } = useSettingsStore();

  useEffect(() => {
    const fetchSharedChat = async () => {
      try {
        const res = await api.get(`/chat/share?chatid=${id}`);
        if (!res.data.success) {
          setIsError(true);
          return;
        }
        setChat(res.data.chat);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setIsUnshared(true);
        } else {
          console.error("Failed to fetch chat", err);
          setIsError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchSharedChat();
  }, [id]);

  useEffect(() => {
    const fetchSharedChat = async () => {
      try {
        const res = await api.get(`/chat/share?chatid=${id}`);
        if (!res.data.success) {
          setIsError(true);
          return;
        }
        setChat(res.data.chat);
      } catch (err) {
        console.error("Failed to fetch chat", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchSharedChat();
  }, [id]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => stopSpeech();
  }, []);

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    isCancelledRef.current = true;
    setSpeakingMessageId(null);
    setPausedId(null);
    currentUtteranceRef.current = null;
  };

  const handleCopy = (messageId: string, content: string) => {
    copy(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const restartSpeech = () => stopSpeech();

  const handleSpeech = (messageId: string, content: string) => {
    if (!("speechSynthesis" in window)) {
      toast.warning("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === messageId && isMobile()) {
      stopSpeech();
      return;
    }

    if (speakingMessageId === messageId && !pausedId) {
      window.speechSynthesis.pause();
      setPausedId(messageId);
      return;
    }

    if (speakingMessageId === messageId && pausedId === messageId) {
      window.speechSynthesis.resume();
      setPausedId(null);
      return;
    }

    stopSpeech();
    isCancelledRef.current = false;
    setSpeakingMessageId(messageId);

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
        setSpeakingMessageId(null);
        setPausedId(null);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[85vh]">
        <Loader size={50} />
      </div>
    );
  }

  if (isUnshared) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 text-center bg-background">
        <div className="p-4 bg-muted/50 rounded-full mb-6">
          <Lock className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Link Revoked</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          The owner of this document has stopped sharing this chat session. It is no longer publicly accessible.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/" prefetch>Try Intelli-PDF for Free</Link>
        </Button>
      </div>
    );
  }

  if (isError || !chat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 text-center bg-background">
        <div className="p-4 bg-red-500/10 rounded-full mb-6">
          <MessageCircleDashedIcon className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Chat Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          We couldn't load this chat session. The link might be broken, or the chat may have been permanently deleted.
        </p>
        <div className="flex gap-5 items-center">
          <Button asChild className="rounded-full">
            <Link href="/" prefetch>
              <ArrowLeft />
              Back
            </Link>
          </Button>
          <Button className="rounded-full" onClick={() => router.refresh()}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto bg-background">
      <div className="flex shrink-0 p-4 md:p-6 border-b items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Shared Chat Session
          </h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            Document: <span className="font-medium text-foreground">{chat.pdfId?.title || "Unknown Document"}</span>
          </p>
        </div>

        {!session && (
          <Button asChild size="sm" className="shrink-0 rounded-full">
            <Link href="/">Try Intelli-PDF</Link>
          </Button>
        )}
      </div>

      <div className="flex-1 w-full p-4">
        <div className="flex flex-col space-y-10 pb-4 mt-4">
          {chat.messages.map((message: any, i: number) => {
            const isUser = message.role === "user";
            const msgId = message._id || message.id || i.toString();
            const isCopied = copiedId === msgId;
            const isSpeaking = speakingMessageId === msgId;
            const isPaused = pausedId === msgId;

            return (
              <div
                key={msgId}
                className={cn(
                  "flex w-full items-start gap-3 group px-2",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isUser && (
                  <Avatar className="hidden md:block h-8 w-8 border shrink-0 mt-1">
                    <AvatarImage src={BOT} />
                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(
                  "flex flex-col gap-2",
                  isUser ? "items-end max-w-[85%] sm:max-w-[80%]" : "items-start max-w-full md:max-w-[90%]"
                )}>

                  <div
                    className={cn(
                      "text-sm leading-7 transition-all duration-200 relative w-fit max-w-full wrap-break-word",
                      isUser
                        ? "bg-secondary text-secondary-foreground px-5 py-3 rounded-2xl rounded-tr-sm"
                        : "bg-transparent text-foreground px-0 py-0"
                    )}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <MarkDown content={message.content} />
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-2 mt-1 select-none">
                      <div className="flex items-center gap-2">

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5"
                              onClick={() => handleCopy(msgId, message.content)}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span className="text-xs">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span className="text-xs">Copy</span>
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            {isCopied ? "Copied!" : "Copy to clipboard"}
                          </TooltipContent>
                        </Tooltip>

                        {isSpeaking && !isMobile() && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={restartSpeech}
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Restart</TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleSpeech(msgId, message.content)}
                              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              {isMobile() ? (
                                isSpeaking ? (
                                  <>
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                  </>
                                ) : (
                                  <Volume2 className="h-3.5 w-3.5" />
                                )
                              ) : (
                                isSpeaking && !isPaused ? (
                                  <Pause className="h-3.5 w-3.5 fill-current" />
                                ) : isPaused ? (
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                ) : (
                                  <Volume2 className="h-3.5 w-3.5" />
                                )
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            {isSpeaking && !isPaused ? "Pause" : isPaused && isSpeaking ? "Resume" : "Listen"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}