import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText } from "lucide-react";
import { useState } from "react";

export function SourceBadge({ sources }: { sources: number[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-primary/20 transition-colors border border-primary/20 select-none"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              Sources: Page {sources.slice(0, 2).join(", ")}
              {sources.length > 2 ? "..." : ""}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-62.5 wrap-break-word">
          <p className="text-sm">
            <span className="font-semibold">Found on Pages:</span>{" "}
            {sources.join(", ")}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}