import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/useSettingsStore";
import { vibrate } from "@/lib/haptics";

export function AppearanceTab() {
  const { setTheme, theme } = useTheme();

  const { haptics, setHaptics, mobileNav, setMobileNav } = useSettingsStore();

  const handleToggle = (checked: boolean) => {
    setHaptics(checked);
    if (checked) vibrate();
  };

  function isMobile() {
    if (typeof navigator === "undefined") return false;

    const ua = navigator.userAgent.toLowerCase();

    return /android|iphone|ipad|ipod|mobile/i.test(ua);
  }

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel of the application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div
              onClick={() => {
                vibrate();
                setTheme("light");
              }}
              className={`cursor-pointer rounded-lg border-2 p-2 hover:bg-muted ${theme === 'light' ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="space-y-2 rounded-md bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-4/6 rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium">
                <Sun className="h-4 w-4" /> Light
              </div>
            </div>

            <div
              onClick={() => {
                vibrate();
                setTheme("dark");
              }}
              className={`cursor-pointer rounded-lg border-2 p-2 hover:bg-muted ${theme === 'dark' ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="space-y-2 rounded-md bg-neutral-950 p-2">
                <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-2 w-4/6 rounded-lg bg-neutral-400" />
                  <div className="h-2 w-full rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-25 rounded-lg bg-neutral-400" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium">
                <Moon className="h-4 w-4" /> Dark
              </div>
            </div>

            <div
              onClick={() => {
                vibrate();
                setTheme("system");
              }}
              className={`cursor-pointer rounded-lg border-2 p-2 hover:bg-muted ${theme === 'system' ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="space-y-2 rounded-md bg-slate-300 p-2">
                <div className="space-y-2 rounded-md bg-slate-600 p-2 shadow-sm">
                  <div className="h-2 w-4/6 rounded-lg bg-slate-400" />
                  <div className="h-2 w-full rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-600 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-25 rounded-lg bg-slate-400" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium">
                <Laptop className="h-4 w-4" /> System
              </div>
            </div>
          </div>
        </div>

      </CardContent>
      {isMobile() && <CardFooter className="flex flex-col gap-5 border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-0.5">
            <Label className="text-base">Haptic Feedback</Label>
            <p className="text-xs text-muted-foreground">
              {haptics
                ? "Vibrations are currently enabled."
                : "Vibrations are turned off for a simpler experience."}
            </p>
          </div>
          <Switch
            checked={haptics}
            onCheckedChange={handleToggle}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between w-full">
          <div className="space-y-0.5">
            <Label className="text-base">Bottom Navigation Bar</Label>
            <p className="text-xs text-muted-foreground">
              {mobileNav
                ? "The menu bar is visible at the bottom of mobile screens."
                : "The menu bar is hidden on mobile screens."}
            </p>
          </div>
          <Switch
            checked={mobileNav}
            onCheckedChange={() => {
              vibrate();
              setMobileNav(!mobileNav);
            }}
          />
        </div>
      </CardFooter>}
    </Card>
  );
}