import { Card, CardContent, CardHeader, Skeleton } from "@/shared/ui";

export function HourlyForecastSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-28" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <Skeleton className="h-4 w-10" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
