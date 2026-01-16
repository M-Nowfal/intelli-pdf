"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eraser, Pencil, Trash2, Upload } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert } from "@/components/common/alert";

interface ChatActionProps {
  title: string;
}

export function ChatActionMenu({ title }: ChatActionProps) {
  const { clearChat, deleteChat, chatId } = useChatStore();
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
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-42 mt-3">
        <DropdownMenuLabel className="truncate max-w-50">{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer p-2" disabled>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer p-2" disabled>
          <Upload className="mr-2 h-4 w-4" />
          Export Chat
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleClear} className="cursor-pointer p-2">
          <Eraser className="mr-2 h-4 w-4" />
          Clear Chat
        </DropdownMenuItem>

        <Alert
          trigger={
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer p-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          }
          title="Are you sure to Delete?"
          description="All the chats related this document will be deleted permanently, this can't be undone."
          onContinue={handleDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}