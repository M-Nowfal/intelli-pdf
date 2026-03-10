"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  EllipsisVertical, Eraser, ExternalLink, MessageCircleDashedIcon,
  Pin, PinOff, Share2, Trash2, Copy, Check, Share, Lock
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert } from "@/components/common/alert";
import Link from "next/link";
import { formatChatListTitle } from "@/helpers/name.helper";
import { formatFileSize } from "@/helpers/file.helper";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader } from "@/components/ui/loader";

interface ChatActionProps {
  activePdf: {
    title: string;
    pages: number;
    fileSize: number;
    fileUrl: string;
  };
}

export function ChatActionMenu({ activePdf }: ChatActionProps) {
  const {
    clearChat, deleteChat, chatId, chatList,
    isStrict, setIsStrict, isPinned, isLoading,
    togglePin, isPinLoading, toggleShare
  } = useChatStore();
  const router = useRouter();

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const currentChat = chatList.find((c) => c._id === chatId);
  const isShared = currentChat?.isShared || false;

  const handleClear = async () => {
    try {
      await clearChat(chatId);
      toast.success("Chat cleared successfully.");
    } catch (err: unknown) {
      toast.error("Failed to clear chat.");
    }
  };

  const handleDelete = async () => {
    await deleteChat(chatId, () => {
      toast.success("Chat deleted permanently.");
      router.push("/chat");
    });
  };

  const handleStopSharing = async () => {
    const promise = toggleShare(chatId, false);
    toast.promise(promise, {
      loading: 'Revoking link...',
      success: 'Chat is no longer public.',
      error: 'Failed to stop sharing.',
    });
  };

  const onShareClick = async () => {
    setIsShareDialogOpen(true);
    setIsShareLoading(true);
    setShareUrl("");

    try {
      const url = await toggleShare(chatId, true);
      if (url) {
        setShareUrl(url);
      } else {
        toast.error("Failed to generate share link.");
        setIsShareDialogOpen(false);
      }
    } catch (err: unknown) {
      toast.error("Something went wrong.");
      setIsShareDialogOpen(false);
    } finally {
      setIsShareLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setHasCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chat about ${activePdf.title}`,
          text: "Check out this AI chat session from Intelli-PDF!",
          url: shareUrl,
        });
      } catch (err: unknown) {
        console.log("Share failed or cancelled", err);
      }
    } else {
      toast.warning("Native share is not supported on this device/browser. Please copy the link instead.");
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Chat Actions
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="start" className="min-w-48 mt-3 me-5">
          <DropdownMenuLabel className="truncate max-w-50">
            <Link
              href={activePdf?.fileUrl || ""}
              target="_blank"
              className="w-fit flex items-center gap-2 bg-accent px-2 py-1 rounded-full shadow hover:shadow-md"
              prefetch
            >
              <h1 className="text-sm font-medium truncate max-w-32">
                {formatChatListTitle(activePdf?.title.replaceAll("_", " ") || "")}
              </h1>
              <ExternalLink size={15} />
            </Link>
            <div className="text-xs text-muted-foreground mt-2 me-2 text-end">
              {activePdf?.pages} Pages • {formatFileSize(activePdf?.fileSize || 0)}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer p-2"
            onSelect={(e) => e.preventDefault()}
            onClick={togglePin}
            disabled={isPinLoading}
          >
            {isPinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" />
                Unpin
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" />
                Pin
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-2" onClick={() => router.push("/chat")}>
            <MessageCircleDashedIcon className="mr-2 h-4 w-4" />
            New Chat
          </DropdownMenuItem>

          {isShared ? (
            <DropdownMenuItem
              className="cursor-pointer p-2 text-orange-500 focus:text-orange-600"
              onSelect={(e) => {
                e.preventDefault();
                handleStopSharing();
              }}
            >
              <Lock className="mr-2 h-4 w-4 text-orange-500/80" />
              Stop Sharing
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer p-2"
              onSelect={(e) => {
                e.preventDefault();
                onShareClick();
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
          )}

          <Alert
            trigger={
              <DropdownMenuItem
                className="cursor-pointer p-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Eraser className="mr-2 h-4 w-4" />
                Clear Chat
              </DropdownMenuItem>
            }
            title="Are you sure to Clear?"
            description="All the messages in this chat will be deleted permanently, this can't be undone."
            onContinue={handleClear}
          />

          <Alert
            trigger={
              <DropdownMenuItem
                className="text-red-400 focus:text-red-400 cursor-pointer p-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="text-red-400 mr-2" />
                Delete
              </DropdownMenuItem>
            }
            title="Are you sure to Delete?"
            description="All the chats related this document will be deleted permanently, this can't be undone."
            onContinue={handleDelete}
          />

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
            Strict with PDF
            <Switch checked={isStrict} onCheckedChange={setIsStrict} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-start">
            <DialogTitle>Share Public Link</DialogTitle>
            <DialogDescription>
              Anyone with this link will be able to view this read-only chat session.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 mt-2">
            {isShareLoading ? (
              <div className="flex items-center justify-center w-full p-4">
                <Loader />
              </div>
            ) : (
              <>
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-muted/50 focus-visible:ring-0"
                />
                <Button size="icon" variant="secondary" onClick={handleCopyLink}>
                  {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>

          <DialogFooter className="flex-row gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsShareDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isShareLoading || !shareUrl}
              onClick={handleNativeShare}
              className="gap-2 flex-1"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}