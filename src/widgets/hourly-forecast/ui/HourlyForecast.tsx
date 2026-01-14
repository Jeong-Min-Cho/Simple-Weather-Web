"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import { TemperatureDisplay } from "@/entities/weather/ui/TemperatureDisplay";
import type { HourlyForecast as HourlyForecastType } from "@/features/weather/model/types";
import { Droplets } from "lucide-react";

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

export const HourlyForecast = memo(function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">시간대별 예보</CardTitle>
      </CardHeader>
      <CardContent>
        <ul
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin"
          role="list"
          aria-label="24시간 시간대별 날씨 예보"
        >
          {data.map((item, index) => (
            <HourlyItem key={item.timestamp} item={item} isNow={index === 0} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});

interface HourlyItemProps {
  item: HourlyForecastType;
  isNow?: boolean;
}

const HourlyItem = memo(function HourlyItem({ item, isNow }: HourlyItemProps) {
  const timeLabel = isNow ? "지금" : item.time;

  return (
    <li
      className="flex flex-col items-center gap-1 min-w-[60px]"
      aria-label={`${timeLabel}: ${item.temperature}도, ${item.condition}`}
    >
      <span className="text-sm text-[var(--muted-foreground)]">
        {timeLabel}
      </span>
      <WeatherIcon icon={item.icon} condition={item.condition} size="sm" />
      <TemperatureDisplay temperature={item.temperature} size="sm" />
      {item.pop > 0 && (
        <div className="flex items-center gap-0.5 text-xs text-blue-500">
          <Droplets className="w-3 h-3" aria-hidden="true" />
          <span aria-label={`강수 확률 ${Math.round(item.pop * 100)}%`}>
            {Math.round(item.pop * 100)}%
          </span>
        </div>
      )}
    </li>
  );
});
