import { toast } from "sonner";

export function copy(text: string): void {
  navigator.clipboard?.writeText(text);
  toast.info("Copied to clipboard", { duration: 1500 });
}