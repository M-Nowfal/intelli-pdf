import { Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/common/avatar";
import { Alert } from "@/components/common/alert";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

export function GeneralTab() {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Profile updation is under development.");
  };

  const handleDeleteAccount = async () => {
    toast.error("Account deletion is under development.");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <UserAvatar size="xl" />
            <div className="space-y-1">
              <h4 className="font-medium">Profile Picture</h4>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG. Max size: 2MB.
              </p>
              <Button variant="outline" size="sm" className="mt-2">Upload New</Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button onClick={handleUpdateProfile} disabled={isLoading}>
            {isLoading ? <>
              Saving Changes <Loader />
            </> : <>
              <Save /> Save Changes
            </>}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="space-y-0.5">
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and all data.
              </p>
            </div>
            <Alert
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 /> Delete
                </Button>
              }
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
              onContinue={handleDeleteAccount}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}