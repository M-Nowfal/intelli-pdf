import { toast } from "sonner";

export function copy(text: string): void {
  navigator.clipboard?.writeText(cleanMarkdown(text));
  toast.info("Copied to clipboard", { duration: 1500 });
}

export function cleanMarkdown(text: string): string {
  if (!text) return "";

  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*[-*+>]\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/[*_~`|#]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}