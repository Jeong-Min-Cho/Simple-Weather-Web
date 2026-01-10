"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import { TemperatureDisplay } from "@/entities/weather/ui/TemperatureDisplay";
import type { HourlyForecast as HourlyForecastType } from "@/features/weather/model/types";
import { Droplets } from "lucide-react";

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">시간대별 예보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {data.map((item, index) => (
            <HourlyItem key={item.timestamp} item={item} isNow={index === 0} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface HourlyItemProps {
  item: HourlyForecastType;
  isNow?: boolean;
}

function HourlyItem({ item, isNow }: HourlyItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px]">
      <span className="text-sm text-[var(--muted-foreground)]">
        {isNow ? "지금" : item.time}
      </span>
      <WeatherIcon icon={item.icon} condition={item.condition} size="sm" />
      <TemperatureDisplay temperature={item.temperature} size="sm" />
      {item.pop > 0 && (
        <div className="flex items-center gap-0.5 text-xs text-blue-500">
          <Droplets className="w-3 h-3" />
          <span>{Math.round(item.pop * 100)}%</span>
        </div>
      )}
    </div>
  );
}
