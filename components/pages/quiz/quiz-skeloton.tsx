import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuizSkeleton() {
  return (
    <div className="flex justify-center items-center w-full h-[90vh] p-4">
      <Card className="w-full max-w-2xl m-auto shadow-lg">
        <CardHeader>
          <p className="text-center animate-pulse text-muted-foreground text-lg font-medium">Generating Quizzes, Please wait</p>
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-24 bg-primary/10" />
            <Skeleton className="h-5 w-10 bg-primary/10" />
          </div>

          <Skeleton className="h-10 w-full rounded-full bg-primary/10" />

          <div className="mt-4 space-y-2">
            <Skeleton className="h-7 w-3/4 bg-primary/10" />
            <Skeleton className="h-7 w-1/2 bg-primary/10" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-15 w-full rounded-xl bg-primary/10" />
          ))}
        </CardContent>

        <CardFooter className="flex justify-end pt-4">
          <Skeleton className="h-10 w-32 rounded-md bg-primary/10" />
        </CardFooter>
      </Card>
    </div>
  );
}