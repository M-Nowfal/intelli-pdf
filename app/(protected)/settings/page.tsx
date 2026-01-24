import { Settings } from "@/components/pages/settings/setting";
import { SettingsIcon } from "lucide-react";

export const metadata = {
  title: "Intelli-PDF - Settings",
  description: "Manage your account settings and preferences on Intelli-PDF.",
};

interface SettingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const resolvedParams = await searchParams;
  const tabParam = resolvedParams.tab;

  const validTabs = ["general", "billing", "appearance"];
  const activeTab = (typeof tabParam === "string" && validTabs.includes(tabParam))
    ? tabParam
    : "general";

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <SettingsIcon className="h-4 w-4 sm:h-6 sm:w-6 text-primary hover:animate-spin" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground ms-2">
          Manage your account settings and preferences.
        </p>
      </div>
      <Settings tab={activeTab} />
    </div>
  );
}