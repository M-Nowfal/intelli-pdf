"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquareText, 
  FileText, 
  GalleryVerticalEnd, 
  Settings 
} from "lucide-react";
import { vibrate } from "@/lib/haptics";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Chat",
      href: "/chat",
      icon: MessageSquareText,
    },
    {
      label: "Summary",
      href: "/summarize",
      icon: FileText,
    },
    {
      label: "Cards",
      href: "/flashcards",
      icon: GalleryVerticalEnd,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-14 bg-background/80 backdrop-blur-lg border-t border-border md:hidden">
      <div className="grid h-full grid-cols-5 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => vibrate()}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 transition-colors group",
                isActive && "bg-muted/30"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-1 transition-all duration-200",
                  isActive 
                    ? "text-primary -translate-y-0.5"
                    : "text-muted-foreground/80 group-hover:text-primary"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground/80 group-hover:text-primary"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}