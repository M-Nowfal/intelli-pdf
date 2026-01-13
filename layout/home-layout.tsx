"use client";

import { UserAvatar } from "@/components/common/avatar";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggler } from "@/components/ui/theme-toggler";
import { APP_NAME } from "@/utils/constants";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "./sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";

export function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useCurrentUser();

  const paths = ["/login", "/signup", "/otp", "/signout", "/forgot-password", "/account"];
  const isAuthPath = () => paths.some(path => path === pathname);
  const hideHeader = isAuthPath();

  return (
    <SidebarProvider>
      {isAuthenticated && !hideHeader && <AppSidebar />}
      <SidebarInset className="transition-[margin] duration-300 ease-in-out">
        {!hideHeader && (
          <header className="sticky z-20 top-0 flex items-center justify-between w-full p-2 bg-linear-to-t from-background/80 via-gray-100/90 dark:via-neutral-900/90 to-gray-200 dark:to-neutral-800">
            <div className="flex items-center gap-2">
              {isAuthenticated && <SidebarTrigger />}
              <h1 className="text-lg font-medium bg-card dark:bg-black shadow px-3 py-1 rounded-full border">{APP_NAME}</h1>
            </div>

            <div className="flex items-center gap-3 pe-1">
              {isLoading ? (
                <div className="flex items-center justify-center w-8 h-8 rounded-full border bg-muted/50 pb-1">
                  <Loader size={14} />
                </div>
              ) : isAuthenticated ? (
                <UserAvatar />
              ) : (
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Login
                </Button>
              )}
              <ThemeToggler />
            </div>
          </header>
        )}
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
