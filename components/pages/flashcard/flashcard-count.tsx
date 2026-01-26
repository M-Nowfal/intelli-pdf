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

export function FlashCardCount({ pdfId }: { pdfId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [numCardsToGenerate, setNumCardsToGenerate] = useState(0);
  const { generateFlashCards, isGenerating, isLoading } = useFlashCardStore();
  const { decrementCredits } = useDashboardStore();

  const handleGenerate = async () => {
    setIsDialogOpen(false);
    if (numCardsToGenerate > 20 || numCardsToGenerate < 1) {
      toast.warning("Enter a count between 1 - 20");
      return;
    }
    await generateFlashCards(pdfId, numCardsToGenerate);
    decrementCredits(20);
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
          <div className="grid grid-cols-5 items-center">
            <Label htmlFor="numCards" className="text-right">
              Count
            </Label>
            <Input
              id="numCards"
              type="string"
              min={1}
              max={20}
              value={numCardsToGenerate}
              onChange={(e) => setNumCardsToGenerate(parseInt(e.target.value) || 0)}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleGenerate} disabled={numCardsToGenerate === 0 || isGenerating}>
            {isGenerating ? "Creating" : "Generate"}
            {isGenerating && <Loader />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}