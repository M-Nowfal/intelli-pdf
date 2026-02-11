"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eraser, ExternalLink, MessageCircleDashedIcon, Pin, Trash2, Upload } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert } from "@/components/common/alert";
import Link from "next/link";
import { formatChatListTitle } from "@/helpers/name.helper";
import { formatFileSize } from "@/helpers/file.helper";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatActionProps {
  activePdf: {
    title: string;
    pages: number;
    fileSize: number;
    fileUrl: string;
  };
}

export function ChatActionMenu({ activePdf }: ChatActionProps) {
  const { clearChat, deleteChat, chatId, isStrict, setIsStrict } = useChatStore();
  const router = useRouter();

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

  return (
    <DropdownMenu modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
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
            href={activePdf?.fileUrl}
            target="_blank"
            className="w-fit flex items-center gap-2 bg-accent px-2 py-1 rounded-full shadow hover:shadow-md"
          >
            <h1 className="text-sm font-medium truncate max-w-32 md:max-w-md">
              {formatChatListTitle(activePdf?.title || "")}
            </h1>
            <ExternalLink size={15} />
          </Link>
          <div className="text-xs text-muted-foreground mt-2 me-2 text-end">
            {activePdf?.pages} Pages • {formatFileSize(activePdf?.fileSize || 0)}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer p-2" disabled>
          <Pin className="mr-2 h-4 w-4" />
          Pin
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer p-2" onClick={() => router.push("/chat")}>
          <MessageCircleDashedIcon className="mr-2 h-4 w-4" />
          New Chat
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer p-2" disabled>
          <Upload className="mr-2 h-4 w-4" />
          Export Chat
        </DropdownMenuItem>

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
  );
}