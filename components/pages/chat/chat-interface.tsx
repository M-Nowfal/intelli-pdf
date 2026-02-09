"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, StopCircle, Copy, Check, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { BOT } from "@/utils/constants";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import api from "@/lib/axios";
import { useChatStore, Message } from "@/store/useChatStore";
import { MarkDown } from "@/components/common/react-markdown";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cleanMarkdown, copy } from "@/helpers/chat.helper";
import { SourceBadge } from "./source-badge";

interface ChatInterfaceProps {
  pdfId: string;
  title: string;
}

export function ChatInterface({ pdfId, title }: ChatInterfaceProps) {
  const {
    messages,
    isMessagesLoading,
    fetchMessages,
    addMessage,
    updateMessageContent,
    setStreaming,
    isStreaming,
    addChat,
    fetchChatList,
    setChatId,
    isStrict
  } = useChatStore();
  const { decrementCredits } = useDashboardStore();
  const { mobileNav, isKeyboardActive, setIsKeyboardActive } = useSettingsStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (pdfId) {
      fetchMessages(pdfId);
    }
  }, [pdfId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMessagesLoading, isStreaming]);

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

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsKeyboardActive(false);
    };
  }, [setIsKeyboardActive]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);

    const isNewConversation = messages.length === 0;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    addMessage(userMessage);
    setInput("");
    setStreaming(true);

    try {
      const response = await api.post(
        "/chat",
        { messages: [...messages, userMessage], pdfId, isStrict },
        { adapter: "fetch", responseType: "stream" }
      );

      const sourcesHeader = response.headers["x-sources"];
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      if (isNewConversation) {
        const newChatId = response.headers["x-chat-id"];
        if (newChatId) {
          addChat({
            _id: newChatId,
            pdfId: { _id: pdfId, title }
          });
          setChatId(newChatId);
        } else {
          setTimeout(() => fetchChatList(), 1000);
        }
      }

      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      const aiMessageId = (Date.now() + 1).toString();
      let isFirstChunk = true;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedText += chunkValue;

        if (isFirstChunk) {
          addMessage({ id: aiMessageId, role: "assistant", content: "", sources });
          isFirstChunk = false;
        }

        updateMessageContent(aiMessageId, accumulatedText);
      }

      decrementCredits(10);
    } catch (err) {
      toast.error("Error generating response");
    } finally {
      setStreaming(false);
    }
  };

  const handleCopy = (id: string, content: string) => {
    copy(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeech = (id: string, content: string) => {
    if (!("speechSynthesis" in window)) {
      toast.warning("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
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
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <Loader size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex-1 w-full p-4 overflow-y-auto hide-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full mt-10 space-y-4 text-center opacity-50">
            <div className="p-4 rounded-full bg-muted">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ready to chat!</h3>
              <p className="text-sm">Ask me anything about this document.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-8 pb-4">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isCopied = copiedId === message.id;
              const isSpeaking = speakingMessageId === message.id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full items-start gap-3 group px-2",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {!isUser && (
                    <Avatar className="h-8 w-8 border shrink-0 mt-1">
                      <AvatarImage src={BOT} />
                      <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn(
                    "flex flex-col gap-2 max-w-[85%] sm:max-w-[80%]",
                    isUser ? "items-end text-right" : "items-start text-left"
                  )}>
                    <div className={cn(
                      "relative flex gap-2 items-center group/bubble",
                      isUser ? "flex-row-reverse" : "flex-col items-start"
                    )}>
                      <div
                        className={cn(
                          "text-sm leading-7 transition-all duration-200",
                          isUser
                            ? "bg-secondary text-secondary-foreground px-5 py-3 rounded-2xl rounded-tr-sm"
                            : "bg-transparent text-foreground px-0 py-0"
                        )}
                      >
                        <MarkDown content={message?.content} />
                      </div>

                      <div className={cn(
                        "transition-all duration-200 ease-out shrink-0",
                        "opacity-100 sm:opacity-0 sm:translate-y-2 group-hover/bubble:opacity-100 group-hover/bubble:scale-100 group-hover/bubble:translate-y-0",
                        isUser ? "order-last sm:order-0 mr-1" : "flex items-center not-md:justify-between w-full gap-3"
                      )}>
                        <Button
                          variant="secondary"
                          size={isUser ? "icon-sm" : "sm"}
                          className="shadow-sm hover:bg-secondary/80"
                          onClick={() => handleCopy(message.id, message.content)}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 animate-in zoom-in duration-300" />
                              {!isUser && <span className="text-xs">Copied</span>}
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              {!isUser && <span className="text-xs">Copy</span>}
                            </>
                          )}
                        </Button>
                        {!isUser && (
                          <Button
                            variant={isSpeaking ? "default" : "secondary"}
                            size="sm"
                            className={cn(
                              "shadow-sm transition-all duration-300",
                              isSpeaking ? "bg-primary text-primary-foreground" : "hover:bg-secondary/80"
                            )}
                            onClick={() => handleSpeech(message.id, message.content)}
                          >
                            {isSpeaking ? (
                              <>
                                <span className="relative flex h-2 w-2 mr-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-black opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-black"></span>
                                </span>
                                Stop
                              </>
                            ) : (
                              <>
                                <Volume2 />
                                Read
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {!isUser && message.sources && message.sources.length > 0 && (
                      <div className="mt-2 px-1">
                        <SourceBadge sources={message.sources} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border shrink-0 mt-1">
                  <AvatarImage src={BOT} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 mt-3">
                  <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "px-2 pt-2.5 pb-2 bg-background shrink-0",
          mobileNav && "pb-14 md:pb-2",
          isKeyboardActive && mobileNav && "pb-3"
        )}
      >
        <form
          onSubmit={handleSend}
          className="relative flex items-end w-full p-2 bg-muted/50 border rounded-2xl shadow-sm focus-within:shadow-lg dark:focus-within:shadow-neutral-900 transition-all"
        >
          <TextareaAutosize
            ref={textareaRef}
            minRows={1}
            maxRows={8}
            placeholder="Ask a question..."
            className="w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none border-none ring-0 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hide-scrollbar placeholder:text-muted-foreground"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
              }
              setIsKeyboardActive(true);
            }}
            onBlur={() => {
              blurTimeoutRef.current = setTimeout(() => {
                setIsKeyboardActive(false);
              }, 250);
            }}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />

          <div className="pb-1 pr-1">
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                (!input.trim() || isStreaming) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
              )}
            >
              {isStreaming ? (
                <StopCircle className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
        <div className={`flex justify-center md:justify-between mt-2 px-5 ${isKeyboardActive && mobileNav ? "hidden md:flex" : ""}`}>
          <p className="not-md:hidden text-xs text-muted-foreground text-center">
            Press <kbd className="font-sans">Enter</kbd> to send, <kbd className="font-sans">Shift + Enter</kbd> for new line
          </p>
          <p className={`text-xs text-muted-foreground text-center ${mobileNav ? "hidden md:block" : ""}`}>
            Intelli-AI can make mistakes, so double-check it
          </p>
        </div>
      </div>
    </div>
  );
}