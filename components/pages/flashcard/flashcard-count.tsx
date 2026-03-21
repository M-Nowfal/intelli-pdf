import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useFlashCardStore } from "@/store/useFlashCardStore";
import { toast } from "sonner";
import { useDashboardStore } from "@/store/useDashboardStore";
import { playSuccessSound } from "@/utils/sound";
import { useSession } from "next-auth/react";
import { COST } from "@/utils/constants";

interface FlashCardCountProps {
  pdfId: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
}

export function FlashCardCount({ pdfId, isDialogOpen, setIsDialogOpen }: FlashCardCountProps) {
  const { data: session } = useSession();
  const [numCardsToGenerate, setNumCardsToGenerate] = useState(0);
  const { generateFlashCards, isGenerating, isLoading } = useFlashCardStore();
  const { decrementCredits } = useDashboardStore();
  const isProUser = session?.user?.subscription?.tier === "pro";

  const handleGenerate = async () => {
    setIsDialogOpen(false);
    if (numCardsToGenerate > 50 || numCardsToGenerate < 3) {
      toast.warning("Enter a count between 3 - 50");
      return;
    }
    if (await generateFlashCards(pdfId, numCardsToGenerate)) {
      playSuccessSound(2);
      if (!isProUser)
        decrementCredits(20);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isGenerating || isLoading}
          size="lg"
          className="shadow-sm"
        >
          {isGenerating ? (
            <Loader />
          ) : (
            <Sparkles />
          )}
          {isGenerating ? "Generating" : "Generate New Cards"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Generate Flashcards</DialogTitle>
          <DialogDescription>
            How many cards would you like to create from this PDF?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="numCards" className="text-right ms-2">
              Count
            </Label>
            <Input
              id="numCards"
              type="string"
              min={3}
              max={50}
              value={numCardsToGenerate}
              onChange={(e) => setNumCardsToGenerate(parseInt(e.target.value) || 0)}
              className="col-span-4"
            />
          </div>
          <span className="text-sm text-muted-foreground shrink-0">
            You can generate a minimum of 3 and a maximum of 50 cards in one request.
          </span>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleGenerate}
            disabled={numCardsToGenerate === 0 || isGenerating}
            className="w-full"
          >
            {isGenerating ? "Creating" : `Generate (${isProUser ? 0 : COST} Credits)`}
            {isGenerating && <Loader />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}