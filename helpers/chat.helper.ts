import { toast } from "sonner";

export function copy(text: string): void {
  navigator.clipboard?.writeText(cleanMarkdown(text));
  toast.info("Copied to clipboard", { duration: 1500 });
}

export function cleanMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "Code block.")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s/gm, "")
    .replace(/[`_~>]/g, "")
    .replace(/\n+/g, ". ")
    .replace("*", "");
};