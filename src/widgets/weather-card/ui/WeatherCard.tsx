"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import {
  TemperatureDisplay,
  TemperatureRange,
} from "@/entities/weather/ui/TemperatureDisplay";
import type { WeatherData } from "@/features/weather/model/types";
import { Droplets, Wind } from "lucide-react";

interface WeatherCardProps {
  data: WeatherData;
  showDetails?: boolean;
}

export function WeatherCard({ data, showDetails = true }: WeatherCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-medium">
            {data.location}
            {data.country && (
              <span className="text-sm text-[var(--muted-foreground)] ml-1">
                {data.country}
              </span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon icon={data.icon} condition={data.condition} size="xl" />
            <div className="flex flex-col">
              <TemperatureDisplay temperature={data.temperature} size="xl" />
              <span className="text-sm text-[var(--muted-foreground)]">
                {data.description}
              </span>
              <TemperatureRange min={data.tempMin} max={data.tempMax} />
            </div>
          </div>

          {showDetails && (
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <span className="text-[var(--foreground)]">
                  체감 {data.feelsLike}°
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>{data.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span>{data.windSpeed} m/s</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
