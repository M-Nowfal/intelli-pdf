import { ThemeToggler } from "@/components/ui/theme-toggler";
import { APP_NAME } from "@/utils/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between w-full p-2 bg-linear-to-t from-background/80 via-gray-100/90 dark:via-neutral-900/90 to-gray-200 dark:to-neutral-800">
      <div className="flex items-center gap-3">
        <Link href="/" replace className="bg-card dark:bg-black shadow p-1.5 rounded-full border">
          <ArrowLeft />
        </Link>
        <h1 className="text-lg font-medium bg-card dark:bg-black shadow px-3 py-1 rounded-full border">{APP_NAME}</h1>
      </div>
      <div className="pe-1">
        <ThemeToggler />
      </div>
    </header>
  );
}