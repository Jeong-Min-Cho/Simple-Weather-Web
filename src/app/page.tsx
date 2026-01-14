"use client";

import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useCurrentWeather, useHourlyForecast } from "@/features/weather";
import { useGeolocation } from "@/shared/hooks";
import { LocationSearch, useLocationSearch } from "@/features/location-search";
import { MapPin, MapPinOff, Loader2, Navigation, AlertCircle } from "lucide-react";
import { Button, ThemeToggle } from "@/shared/ui";
import { FavoriteGrid } from "@/widgets/favorite-grid";

export default function Home() {
  const { latitude: geoLat, longitude: geoLon, error: geoError, isLoading: geoLoading } = useGeolocation();

  const {
    selectedLocation,
    locationError,
    isSearching,
    useDefaultLocation,
    currentLat,
    currentLon,
    currentLocationName,
    handleLocationSelect,
    handleResetToCurrentLocation,
    handleCloseError,
  } = useLocationSearch({
    geoLatitude: geoLat,
    geoLongitude: geoLon,
    geoError: geoError,
  });

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(currentLat, currentLon, currentLocationName);

  const { data: hourly } = useHourlyForecast(currentLat, currentLon);

  const isLoading = geoLoading || weatherLoading || isSearching;

  // 로딩 화면 (현재 위치 모드일 때만)
  if (isLoading && !selectedLocation && !useDefaultLocation) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)]">
        <Loader2 className="w-10 h-10 text-[var(--muted-foreground)] animate-spin" />
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <MapPin className="w-4 h-4" />
          <span>
            {geoLoading
              ? "현재 위치 확인 중..."
              : isSearching
                ? "지역 검색 중..."
                : "날씨 정보 불러오는 중..."}
          </span>
        </div>
      </main>
    );
  }

  // 날씨 API 에러
  if (weatherError && !isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 bg-[var(--background)]">
        <p className="text-lg text-red-500">날씨 정보를 불러오는데 실패했습니다.</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] safe-area-bottom">
      {/* 헤더 */}
      <header className="w-full max-w-md lg:max-w-5xl mx-auto p-4 md:p-8 pb-0 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Weather App</h1>
        <ThemeToggle />
      </header>

      <main className="w-full max-w-md lg:max-w-5xl mx-auto p-4 md:px-8 flex flex-col gap-4">
        {/* 검색 영역 */}
        <nav aria-label="지역 검색">
          <div className="flex gap-2 lg:max-w-md">
            <div className="flex-1">
              <LocationSearch onSelect={handleLocationSelect} placeholder="지역 검색 (예: 서울, 강남구, 역삼동)" />
            </div>
            {selectedLocation && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleResetToCurrentLocation}
                title="현재 위치로"
                aria-label="현재 위치로 돌아가기"
                className="flex-shrink-0"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            )}
          </div>
        </nav>

        {/* 알림 메시지 영역 */}
        {locationError && (
          <aside role="alert" className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md lg:max-w-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-500 flex-1">{locationError}</p>
            <button onClick={handleCloseError} className="text-red-500 hover:text-red-400" aria-label="닫기">
              ✕
            </button>
          </aside>
        )}

        {useDefaultLocation && (
          <aside role="status" className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md lg:max-w-md">
            <MapPinOff className="w-4 h-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-blue-600">
              위치 권한이 거부되어 기본 위치(서울 강남구)를 표시합니다.
            </p>
          </aside>
        )}

        {/* 로딩 상태 */}
        {(isSearching || (weatherLoading && (selectedLocation || useDefaultLocation))) && (
          <div className="flex items-center justify-center gap-2 py-8 text-[var(--muted-foreground)]" role="status" aria-live="polite">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>{isSearching ? "지역 검색 중..." : "날씨 정보 불러오는 중..."}</span>
          </div>
        )}

        {/* 2컬럼 레이아웃 (데스크탑) */}
        <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
          {/* 왼쪽: 날씨 정보 */}
          <div className="flex-1 flex flex-col gap-4 lg:max-w-md">
            {!isSearching && !weatherLoading && weather && currentLat && currentLon && (
              <section aria-label="현재 날씨">
                <WeatherCard data={weather} latitude={currentLat} longitude={currentLon} />
              </section>
            )}
            {!isSearching && !weatherLoading && hourly && (
              <section aria-label="시간대별 예보">
                <HourlyForecast data={hourly} />
              </section>
            )}
          </div>

          {/* 오른쪽: 즐겨찾기 (데스크탑에서는 사이드바) */}
          <section className="mt-4 lg:mt-0 w-full lg:w-80 lg:flex-shrink-0" aria-label="즐겨찾기 목록">
            <h2 className="text-lg font-semibold mb-3">즐겨찾기</h2>
            <FavoriteGrid />
          </section>
        </div>
      </main>
    </div>
  );
}
