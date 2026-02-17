"use client";

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarRail, SidebarGroup, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, FileText,
  Settings, ChevronsUpDown, LogOut,
  Sparkles,
  X,
  GalleryVerticalEnd,
  Home, MessageCircleDashed,
  LucideIcon,
  ListChecks,
  ScrollText,
  Palette
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "@/components/common/logo";
import { APP_NAME } from "@/utils/constants";
import { signOut } from "next-auth/react";
import { Alert } from "@/components/common/alert";
import { UserAvatar } from "@/components/common/avatar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";
import { formatChatListTitle } from "@/helpers/name.helper";
import { vibrate } from "@/lib/haptics";
import { Skeleton } from "@/components/ui/skeleton";

type SubMenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { name, email } = useCurrentUser();
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { chatList, fetchChatList, isLoading } = useChatStore();
  const router = useRouter();

  useEffect(() => {
    fetchChatList();
  }, [fetchChatList]);

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  const isActive = (url: string) => pathname === url;

  const navMainItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    {
      title: "Documents", url: "/pdf", icon: FileText, items: [
        { title: "All Documents", url: "/pdf" },
        { title: "Upload PDF", url: "/pdf/upload" },
      ]
    },
    {
      title: "AI Chat", url: "/chat", icon: Sparkles, items: [
        { title: "New Chat", url: "/chat", icon: MessageCircleDashed },
        ...chatList.map(list => (
          { title: formatChatListTitle(list.pdfId.title), url: `/chat/${list.pdfId._id}` }
        ))
      ]
    },
    { title: "Flash Cards", url: "/flashcards", icon: GalleryVerticalEnd },
    { title: "Summarize PDF", url: "/summarize", icon: ScrollText },
    { title: "Quiz", url: "/quiz", icon: ListChecks },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground active:bg-transparent"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Logo onlyLogo />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{APP_NAME}</span>
              </div>
              {isMobile && <Button asChild variant="ghost" size="none" className="ml-auto" onClick={toggleSidebar}>
                <X />
              </Button>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMainItems.map((item) => {
              const hasChildren = !!item.items?.length

              return (
                <SidebarMenuItem key={item.title}>
                  {hasChildren ? (
                    <Collapsible
                      defaultOpen
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}
                          className={`px-3 py-5 transition-colors ${pathname.startsWith(item.url)
                            ? "bg-slate-200 dark:bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent"
                            }`}>
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-2">
                          {item.items!.map((subItem: SubMenuItem, idx) => (
                            <SidebarMenuSubItem key={idx}>
                              <SidebarMenuSubButton
                                asChild
                                className="py-4"
                                onClick={() => isMobile && toggleSidebar()}
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex justify-between"
                                  replace
                                  prefetch
                                >
                                  <div className="flex items-center gap-2">
                                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                    <span className="line-clamp-1 max-w-38">{subItem.title}</span>
                                  </div>
                                  {isActive(subItem.url) && <div className="w-2 h-2 bg-accent-foreground rounded-full" />}
                                </Link>
                              </SidebarMenuSubButton>
                              {isLoading && item.title === "AI Chat" && <Skeleton className="w-full h-5 mt-2 bg-primary/10" />}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`px-3 py-5 transition-colors ${isActive(item.url)
                        ? "bg-slate-200 dark:bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent"
                        }`}
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      <Link href={item.url} replace prefetch>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserAvatar />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={6}
              >
                <DropdownMenuItem
                  className="p-0 font-normal cursor-pointer"
                  onSelect={() => {
                    vibrate();
                    setTimeout(() => {
                      router.push("/settings");
                      if (isMobile) toggleSidebar();
                    }, 150);
                  }}
                >
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserAvatar />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{name}</span>
                      <span className="truncate text-xs">{email}</span>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => {
                      vibrate();
                      setTimeout(() => {
                        router.push("/upgrade");
                        if (isMobile) toggleSidebar();
                      }, 150);
                    }}
                    className="cursor-pointer"
                  >
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      vibrate();
                      setTimeout(() => {
                        router.push("/settings?tab=appearance");
                        if (isMobile) toggleSidebar();
                      }, 150);
                    }}
                    className="cursor-pointer"
                  >
                    <Palette />
                    Appearance
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Alert
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <LogOut className="text-red-500" />
                      <span className="text-red-500">Log out</span>
                    </DropdownMenuItem>
                  }
                  title="Log out of your account?"
                  description="You're about to end your current session. Any unsaved changes will be lost, and you'll need to sign in again to continue."
                  onContinue={handleLogout}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar >
  );
}