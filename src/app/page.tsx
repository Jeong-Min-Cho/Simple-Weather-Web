"use client";

import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useCurrentWeather, useHourlyForecast } from "@/features/weather";
import { WeatherCardSkeleton } from "@/widgets/weather-card";
import { HourlyForecastSkeleton } from "@/widgets/hourly-forecast";
import { useGeolocation } from "@/shared/hooks";
import { MapPin, MapPinOff } from "lucide-react";

export default function Home() {
  const { latitude, longitude, error: geoError, isLoading: geoLoading } = useGeolocation();

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(latitude, longitude);

  const { data: hourly, isLoading: hourlyLoading } = useHourlyForecast(latitude, longitude);

  const isLoading = geoLoading || weatherLoading;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 gap-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
        Weather App
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {geoError ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <MapPinOff className="w-12 h-12 text-[var(--muted-foreground)]" />
            <p className="text-[var(--muted-foreground)]">{geoError}</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              위치 권한을 허용하면 현재 위치의 날씨를 확인할 수 있습니다.
            </p>
          </div>
        ) : isLoading ? (
          <>
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
              <MapPin className="w-4 h-4 animate-pulse" />
              <span>현재 위치를 확인하는 중...</span>
            </div>
            <WeatherCardSkeleton />
            <HourlyForecastSkeleton />
          </>
        ) : weatherError ? (
          <div className="p-4 text-red-500 text-center">
            날씨 정보를 불러오는데 실패했습니다.
          </div>
        ) : (
          <>
            {weather && <WeatherCard data={weather} />}
            {hourly && <HourlyForecast data={hourly} />}
          </>
        )}
      </div>
    </main>
  );
}
