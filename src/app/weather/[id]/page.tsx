"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useFavoritesStore } from "@/shared/model/favoritesStore";
import { useCurrentWeather, useHourlyForecast } from "@/features/weather";
import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { Button, ThemeToggle } from "@/shared/ui";
import { ArrowLeft, Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WeatherDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { favorites } = useFavoritesStore();

  const favorite = favorites.find((f) => f.id === id);

  const { data: weather, isLoading: weatherLoading } = useCurrentWeather(
    favorite?.latitude ?? null,
    favorite?.longitude ?? null,
    favorite?.name
  );

  const { data: hourly, isLoading: hourlyLoading } = useHourlyForecast(
    favorite?.latitude ?? null,
    favorite?.longitude ?? null
  );

  if (!favorite) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 bg-[var(--background)]">
        <p className="text-lg text-[var(--muted-foreground)]">
          즐겨찾기를 찾을 수 없습니다.
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>
      </main>
    );
  }

  const isLoading = weatherLoading || hourlyLoading;

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)]">
        <Loader2 className="w-10 h-10 text-[var(--muted-foreground)] animate-spin" />
        <p className="text-[var(--muted-foreground)]">날씨 정보 불러오는 중...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] safe-area-bottom">
      <header className="w-full max-w-md mx-auto p-4 md:p-8 pb-0 flex items-center justify-between">
        <nav aria-label="뒤로가기">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            aria-label="홈으로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            돌아가기
          </Button>
        </nav>
        <ThemeToggle />
      </header>

      <main className="w-full max-w-md mx-auto p-4 md:px-8 flex flex-col gap-4">
        {weather && (
          <section aria-label="현재 날씨">
            <WeatherCard
              data={weather}
              latitude={favorite.latitude}
              longitude={favorite.longitude}
            />
          </section>
        )}

        {hourly && (
          <section aria-label="시간대별 예보">
            <HourlyForecast data={hourly} />
          </section>
        )}
      </main>
    </div>
  );
}
