"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceTab } from "./appearance-tab";
import { BillingTab } from "./billing-tab";
import { GeneralTab } from "./general-tab";
import { vibrate } from "@/lib/haptics";

export function Settings({ tab }: { tab: string }) {

  return (
    <div className="max-w-5xl m-auto py-8 space-y-8">
      <Tabs
        defaultValue={tab}
        className="space-y-6"
        onValueChange={() => vibrate()}
      >
        <TabsList className="grid w-full max-w-xl grid-cols-3 lg:w-100">
          <TabsTrigger value="general">
            General
          </TabsTrigger>
          <TabsTrigger value="billing">
            Billing & AI
          </TabsTrigger>
          <TabsTrigger value="appearance">
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingTab />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}