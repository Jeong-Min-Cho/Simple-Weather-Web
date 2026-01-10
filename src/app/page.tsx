"use client";

import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useCurrentWeather, useHourlyForecast } from "@/features/weather";
import { WeatherCardSkeleton } from "@/widgets/weather-card";
import { HourlyForecastSkeleton } from "@/widgets/hourly-forecast";

// 서울 좌표 (테스트용)
const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;

export default function Home() {
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useCurrentWeather(SEOUL_LAT, SEOUL_LON, "서울");
  const { data: hourly, isLoading: hourlyLoading } = useHourlyForecast(SEOUL_LAT, SEOUL_LON);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 gap-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
        Weather App
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {weatherLoading ? (
          <WeatherCardSkeleton />
        ) : weatherError ? (
          <div className="p-4 text-red-500 text-center">
            날씨 정보를 불러오는데 실패했습니다.
          </div>
        ) : weather ? (
          <WeatherCard data={weather} />
        ) : null}

        {hourlyLoading ? (
          <HourlyForecastSkeleton />
        ) : hourly ? (
          <HourlyForecast data={hourly} />
        ) : null}
      </div>
    </main>
  );
}
