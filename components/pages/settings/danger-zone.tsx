"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

import { Alert } from "@/components/common/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";

export function DeleteAccount() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [verifyType, setVerifyType] = useState<"PASSWORD" | "OTP" | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleInitiateDelete = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/user/delete");

      setVerifyType(res.data.type);
      setDialogOpen(true);

      if (res.data.type === "OTP") {
        toast.info("OTP sent to your email");
      }
    } catch (err) {
      toast.error("Failed to initiate deletion.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!inputValue) return toast.error("Please fill in the verification field.");

    setIsLoading(true);
    try {
      await api.delete("/user/delete", {
        data: {
          verificationValue: inputValue,
          type: verifyType
        }
      });

      toast.success("Account deleted successfully.");
      setDialogOpen(false);

      await signOut({ redirect: false });
      router.push("/login");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
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
                <Button variant="destructive" size="sm" disabled={isLoading}>
                  {isLoading ? <Loader /> : <><Trash2 /> Delete</>}
                </Button>
              }
              title="Are you absolutely sure?"
              description= {`This action cannot be undone. All the data stored will be permanently deleted from our server. ${verifyType === "OTP" ? "" : "We will send a OTP to your E-Mail id."}`}
              onContinue={handleInitiateDelete}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Security Verification</DialogTitle>
            <DialogDescription className="text-xs">
              {verifyType === "OTP"
                ? `We've emailed a verification code to ${session?.user?.email}. Enter the code below to verify your identity and proceed.`
                : "To make sure this action is intentional, please enter your account password. This step helps us securely confirm the deletion."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {verifyType === "OTP" ? (
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={inputValue}
                  onChange={(val) => setInputValue(val)}
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="flex-1"
            >Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading || (inputValue.length < 6)}
              className="flex-1"
            >
              Confirm & Delete
              {isLoading ? <Loader /> : null}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}