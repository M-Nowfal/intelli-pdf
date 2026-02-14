import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function PDFUploadSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8 mx-auto w-full max-w-7xl animate-in fade-in duration-500">
      <div className="space-y-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-5 w-full">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-9 w-64" />
            </div>
            <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
            <Skeleton className="h-5 w-full max-w-2xl mx-auto md:mx-0" />
          </div>

          <Skeleton className="h-9 w-40 rounded-full mx-auto md:mx-0" />
        </div>
        <Separator className="mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-muted/5 border-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full shadow-lg border-primary/10 py-0 pt-5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-56" />
          </div>
          <Skeleton className="h-5 w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <Skeleton className="h-72 w-full rounded-xl" />
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t px-6 py-5">
          <Skeleton className="h-10 w-full sm:w-24" />
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <Skeleton className="h-4 w-32 hidden sm:block" />
            <Skeleton className="h-12 w-full sm:w-56 rounded-md" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}