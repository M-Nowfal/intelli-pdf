import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { vibrate } from "@/lib/haptics";
import { JSX } from "react";

interface AlertDialogProps {
  trigger: JSX.Element;
  title: string;
  description: string;
  onContinue: () => void;
  loading?: boolean;
}

export function Alert({ trigger, title, description, onContinue, loading }: AlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle className="line-clamp-1">{title.replaceAll("_", " ")}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end">
          <AlertDialogCancel onClick={() => vibrate()} disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            vibrate();
            onContinue();
          }} disabled={loading}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
