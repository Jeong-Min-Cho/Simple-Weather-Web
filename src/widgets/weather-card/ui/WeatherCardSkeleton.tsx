import { Card, CardContent, CardHeader, Skeleton } from "@/shared/ui";

export function WeatherCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
