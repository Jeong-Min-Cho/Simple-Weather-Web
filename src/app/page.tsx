"use client";

import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useCurrentWeather, useHourlyForecast } from "@/features/weather";
import { useGeolocation } from "@/shared/hooks";
import { MapPin, MapPinOff, Loader2 } from "lucide-react";

export default function Home() {
  const { latitude, longitude, error: geoError, isLoading: geoLoading } = useGeolocation();

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(latitude, longitude);

  const { data: hourly } = useHourlyForecast(latitude, longitude);

  const isLoading = geoLoading || weatherLoading;

  // 로딩 화면
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--muted-foreground)] animate-spin" />
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <MapPin className="w-4 h-4" />
          <span>{geoLoading ? "현재 위치 확인 중..." : "날씨 정보 불러오는 중..."}</span>
        </div>
      </main>
    );
  }

  // 위치 권한 에러
  if (geoError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <MapPinOff className="w-16 h-16 text-[var(--muted-foreground)]" />
        <p className="text-lg text-[var(--muted-foreground)]">{geoError}</p>
        <p className="text-sm text-[var(--muted-foreground)] text-center">
          위치 권한을 허용하면 현재 위치의 날씨를 확인할 수 있습니다.
        </p>
      </main>
    );
  }

  // 날씨 API 에러
  if (weatherError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg text-red-500">날씨 정보를 불러오는데 실패했습니다.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 gap-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
        Weather App
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {weather && <WeatherCard data={weather} />}
        {hourly && <HourlyForecast data={hourly} />}
      </div>
    </main>
  );
}
