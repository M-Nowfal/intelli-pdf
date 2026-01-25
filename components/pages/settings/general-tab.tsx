import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/common/avatar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import api from "@/lib/axios";
import { DeleteAccount } from "./danger-zone";

export function GeneralTab() {
  const { data: session, update } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setName(session?.user?.name || "");
  }, [session]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.put("/user", { name });

      if (res.data.success) {
        await update({ name });
        toast.success("Profile Updated.");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Update failed, try again later.");
    } finally {
      setIsLoading(false);
    }
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
              <Button variant="outline" size="sm" className="mt-2" disabled>Upload New</Button>
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
          <Button onClick={handleUpdateProfile} disabled={isLoading || session?.user?.name?.trim() === name.trim()}>
            {isLoading ? <>
              Saving Changes <Loader />
            </> : <>
              <Save /> Save Changes
            </>}
          </Button>
        </CardFooter>
      </Card>
      <DeleteAccount />
    </>
  );
}