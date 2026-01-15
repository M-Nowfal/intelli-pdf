"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, StopCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { BOT } from "@/utils/constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import api from "@/lib/axios";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: number[];
}

interface ChatInterfaceProps {
  pdfId: string;
}

export function ChatInterface({ pdfId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const res = await api.get(`/chat?pdfId=${pdfId}`);

        const formattedMessages: Message[] = res.data?.map((msg: any) => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          sources: msg.sources || []
        }));

        setMessages(formattedMessages);
      } catch (err: unknown) {
        console.error("Error fetching history:", err);
        toast.error("Error", { description: "Failed to load previous conversations." });
      } finally {
        setIsHistoryLoading(false);
      }
    };

    if (pdfId) {
      fetchChatHistory();
    }
  }, [pdfId, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isHistoryLoading, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, pdfId }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      if (!response.body) throw new Error("No response body");

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, role: "assistant", content: "", sources },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedText += chunkValue;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: accumulatedText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Stream Error:", error);
      toast.error("Error", { description: "Failed to generate response." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isHistoryLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 w-full p-4 overflow-auto hide-scrollbar">
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
          <div className="space-y-8 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full items-start gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border shrink-0 mt-1">
                    <AvatarImage src={BOT} />
                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("flex flex-col gap-2 max-w-[85%] sm:max-w-[80%]", message.role === "user" && "items-end")}>
                  <div
                    className={cn(
                      "text-sm leading-7",
                      message.role === "user"
                        ? "bg-secondary text-secondary-foreground px-5 py-3 rounded-2xl rounded-tr-sm"
                        : "bg-transparent text-foreground px-0 py-0"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }) => <span className="font-semibold text-foreground">{children}</span>,
                        a: ({ children, href }) => (
                          <Link
                            href={href || "#"}
                            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </Link>
                        ),

                        table: ({ children }) => (
                          <div className="my-4 w-full overflow-hidden rounded-md border border-border bg-card">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">{children}</table>
                            </div>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                            {children}
                          </thead>
                        ),
                        tbody: ({ children }) => (
                          <tbody className="divide-y divide-border">
                            {children}
                          </tbody>
                        ),
                        tr: ({ children }) => (
                          <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            {children}
                          </tr>
                        ),
                        th: ({ children }) => (
                          <th className="h-10 px-4 py-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            {children}
                          </td>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-xs text-muted-foreground font-medium">Source:</span>
                      {message.sources.map((page, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1 cursor-default hover:bg-primary/20 transition-colors"
                          title={`Found on Page ${page}`}
                        >
                          <FileText className="w-3 h-3" /> Page {page}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border shrink-0 mt-1">
                  <AvatarImage src={BOT} />
                  <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
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

      <div className="p-4 bg-background shrink-0">
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
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <div className="pb-1 pr-1">
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                (!input.trim() || isLoading) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
              )}
            >
              {isLoading ? (
                <StopCircle className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
        <div className="flex justify-between mt-2 px-5">
          <p className="text-[10px] text-muted-foreground">
            Press <kbd className="font-sans">Enter</kbd> to send, <kbd className="font-sans">Shift + Enter</kbd> for new line
          </p>
          <p className="text-[10px] text-muted-foreground">
            Intelli-AI can make mistakes, so double-check it
          </p>
        </div>
      </div>
    </div>
  );
}