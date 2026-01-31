import { KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

type PasswordMode = "change" | "forgot" | "otp";

const passwordValidation = {
  required: "Password is required",
  minLength: { value: 6, message: "Must be at least 6 characters" },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    message: "Must contain 1 uppercase, 1 lowercase, and 1 number",
  },
};

export function Password() {
  const { data: session } = useSession();
  const [passwordMode, setPasswordMode] = useState<PasswordMode>("change");
  const [passLoading, setPassLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const switchMode = (mode: PasswordMode) => {
    setPasswordMode(mode);
    reset();
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    reset();
    setTimeout(() => {
      setIsSuccess(false);
      setPasswordMode("change");
    }, 4000);
  };

  const handleChangeSubmit = async (data: any) => {
    setPassLoading(true);
    try {
      await api.post("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      handleSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleForgotTrigger = async () => {
    setPassLoading(true);
    try {
      const res = await api.post("/auth/forgot-password/send", { email: session?.user?.email });
      if (res.data.success) {
        switchMode("otp");
        toast.success("Verification code sent to your email.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send code.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleResetSubmit = async (data: any) => {
    setPassLoading(true);
    try {
      const res = await api.post("/auth/forgot-password/reset", {
        email: session?.user?.email,
        otp: data.otp,
        password: data.newPassword,
      });
      if (res.data.success) {
        handleSuccess();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setPassLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-900/10">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Password Updated!</h3>
            <p className="text-muted-foreground max-w-62.5 mx-auto text-sm">
              Your password has been changed successfully. You can now use your new credentials.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 border-green-200 hover:bg-green-100 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/50"
            onClick={() => {
              setIsSuccess(false);
              setPasswordMode("change");
            }}
          >
            Back to Settings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your password and security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {passwordMode === "change" && (
          <form onSubmit={handleSubmit(handleChangeSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="••••••••"
                disabled={passLoading}
                {...register("oldPassword", { required: "Current password is required" })}
              />
              {errors.oldPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.oldPassword.message as string}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                disabled={passLoading}
                {...register("newPassword", passwordValidation)}
              />
              {errors.newPassword ? (
                <p className="text-xs text-red-500 font-medium">
                  {errors.newPassword.message as string}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground">
                  Min 6 chars, 1 uppercase, 1 lowercase, 1 number.
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-muted-foreground"
                onClick={() => switchMode("forgot")}
              >
                Forgot your password?
              </Button>
            </div>

            <button type="submit" className="hidden" />
          </form>
        )}

        {passwordMode === "forgot" && (
          <div className="text-center space-y-4 py-4">
            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Reset Password</h4>
              <p className="text-sm text-muted-foreground mt-1 px-4">
                We will send a verification code to <br /><strong>{session?.user?.email}</strong>.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => switchMode("change")}
                disabled={passLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleForgotTrigger}
                disabled={passLoading}
              >
                {passLoading && <Loader />}
                Send Code
              </Button>
            </div>
          </div>
        )}

        {passwordMode === "otp" && (
          <form onSubmit={handleSubmit(handleResetSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="123456"
                className="text-center tracking-[0.5em] font-mono text-lg"
                maxLength={6}
                disabled={passLoading}
                {...register("otp", {
                  required: "Code is required",
                  minLength: { value: 6, message: "Code must be 6 digits" }
                })}
              />
              {errors.otp && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.otp.message as string}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                disabled={passLoading}
                {...register("newPassword", passwordValidation)}
              />
              {errors.newPassword ? (
                <p className="text-xs text-red-500 font-medium">
                  {errors.newPassword.message as string}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground">
                  Min 6 chars, 1 uppercase, 1 lowercase, 1 number.
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end py-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => switchMode("change")}
                disabled={passLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={passLoading}>
                {passLoading && <Loader />}
                Reset Password
              </Button>
            </div>
          </form>
        )}

      </CardContent>

      {passwordMode === "change" && (
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button
            onClick={handleSubmit(handleChangeSubmit)}
            disabled={passLoading}
          >
            {passLoading ? (
              <><Loader /> Updating</>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}