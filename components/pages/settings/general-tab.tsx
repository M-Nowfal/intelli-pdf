"use client";

import { Save, UploadCloud, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/common/avatar";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { DeleteAccount } from "./danger-zone";
import { Loader } from "@/components/ui/loader";
import axios from "axios";
import { Alert } from "@/components/common/alert";
import { Password } from "./password";

export function GeneralTab() {
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGoogleUser, setIsGoogleUser] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setName(session?.user?.name || "");
    checkUserProvider();
  }, [session]);

  const checkUserProvider = async () => {
    try {
      const res = await api.get("/user");
      setIsGoogleUser(res.data.provider === "google");
    } catch (err: unknown) {
      console.error("Failed to check provider status");
    }
  };

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const signRes = await api.post("/cloudinary/sign");
      const { signature, timestamp, apiKey, folder, cloudName } = signRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      if (uploadRes.data.secure_url) {
        await handleSaveChanges(name, uploadRes.data.secure_url);
      }
    } catch (err: any) {
      console.error("Cloudinary Error:", err.response?.data);
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setIsLoading(true);
    try {
      const res = await api.put("/user", { name, avatar: null });
      if (res.data.success) {
        await update({ name, image: null });
        toast.success("Profile picture removed.");
      }
    } catch (err) {
      toast.error("Failed to remove image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async (newName: string, newAvatarUrl?: string) => {
    setIsLoading(true);
    try {
      const dbPayload = { name: newName, ...(newAvatarUrl && { avatar: newAvatarUrl }) };
      const sessionPayload = { name: newName, ...(newAvatarUrl && { image: newAvatarUrl }) };

      const res = await api.put("/user", dbPayload);
      if (res.data.success) {
        await update(sessionPayload);
        toast.success("Profile updated successfully.");
      }
    } catch (err) {
      toast.error("Failed to save profile changes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="pb-0">
        <div className="flex items-start pe-3">
          <CardHeader className="w-full">
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details and public avatar.</CardDescription>
          </CardHeader>
          <Alert
            trigger={
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={isUploading || isLoading}
              >
                <LogOut className="text-red-500" />
                <span className="text-red-500">Log out</span>
              </Button>
            }
            title="Log out of your account?"
            description="You're about to end your current session. Any unsaved changes will be lost, and you'll need to sign in again to continue."
            onContinue={handleLogout}
          />
        </div>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <UserAvatar size="xl" />

            <div className="space-y-2 text-center sm:text-left">
              <h4 className="font-medium">Profile Picture</h4>
              <p className="text-xs text-muted-foreground max-w-50">
                JPG, PNG or GIF. Max size of 3MB.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <div className="flex gap-2 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isUploading || isLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? <Loader /> : <UploadCloud className="h-4 w-4" />}
                  {isUploading ? "Uploading..." : "Upload New"}
                </Button>

                {session?.user?.image && (
                  <Alert
                    trigger={
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isUploading || isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        Remove
                      </Button>
                    }
                    title="Remove profile picture?"
                    description="Are you sure you want to remove your profile picture?"
                    onContinue={handleRemoveImage}
                  />
                )}
              </div>
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
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-[10px] text-muted-foreground">
                Email is managed by your provider ({isGoogleUser ? "Google" : "credentials"}).
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button
            onClick={() => handleSaveChanges(name)}
            disabled={isLoading || isUploading || session?.user?.name?.trim() === name.trim()}
          >
            {isLoading ? (
              <>Saving <Loader className="mr-2 h-4 w-4" /></>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </CardFooter>
      </Card>
      {!isGoogleUser && <Password />}
      <DeleteAccount />
    </div>
  );
}