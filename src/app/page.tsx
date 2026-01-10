"use client";

import { useState, useCallback } from "react";
import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useCurrentWeather, useHourlyForecast, useGeocode } from "@/features/weather";
import { useGeolocation } from "@/shared/hooks";
import { LocationSearch, type LocationResult, getLocationForGeocode } from "@/features/location-search";
import { MapPin, MapPinOff, Loader2, Navigation } from "lucide-react";
import { Button } from "@/shared/ui";

interface SelectedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { latitude: geoLat, longitude: geoLon, error: geoError, isLoading: geoLoading } = useGeolocation();

  // 검색된 지역의 좌표 조회
  const { data: geocodeResults, isLoading: geocodeLoading } = useGeocode(searchQuery);

  // 현재 사용할 좌표 결정
  const currentLat = selectedLocation?.latitude ?? geoLat;
  const currentLon = selectedLocation?.longitude ?? geoLon;
  const currentLocationName = selectedLocation?.name;

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(currentLat, currentLon, currentLocationName);

  const { data: hourly } = useHourlyForecast(currentLat, currentLon);

  // 검색 결과 선택 처리
  const handleLocationSelect = useCallback((location: LocationResult) => {
    const geocodeQuery = getLocationForGeocode(location);
    setSearchQuery(geocodeQuery);

    // geocodeResults가 업데이트되면 useEffect에서 처리
  }, []);

  // geocode 결과가 오면 위치 설정
  if (geocodeResults && geocodeResults.length > 0 && searchQuery && !selectedLocation) {
    const result = geocodeResults[0];
    setSelectedLocation({
      name: searchQuery,
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setSearchQuery("");
  }

  // 현재 위치로 돌아가기
  const handleResetToCurrentLocation = useCallback(() => {
    setSelectedLocation(null);
    setSearchQuery("");
  }, []);

  const isLoading = geoLoading || weatherLoading || geocodeLoading;

  // 로딩 화면 (현재 위치 모드일 때만)
  if (isLoading && !selectedLocation) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--muted-foreground)] animate-spin" />
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <MapPin className="w-4 h-4" />
          <span>
            {geoLoading
              ? "현재 위치 확인 중..."
              : geocodeLoading
                ? "지역 검색 중..."
                : "날씨 정보 불러오는 중..."}
          </span>
        </div>
      </main>
    );
  }

  // 위치 권한 에러 (검색된 위치가 없을 때만)
  if (geoError && !selectedLocation) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 gap-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Weather App</h1>

        <div className="w-full max-w-md">
          <LocationSearch onSelect={handleLocationSelect} placeholder="지역 검색 (예: 서울, 강남구, 역삼동)" />
        </div>

        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <MapPinOff className="w-12 h-12 text-[var(--muted-foreground)]" />
          <p className="text-[var(--muted-foreground)]">{geoError}</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            위치 검색을 통해 원하는 지역의 날씨를 확인하세요.
          </p>
        </div>
      </main>
    );
  }

  // 날씨 API 에러
  if (weatherError && !isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg text-red-500">날씨 정보를 불러오는데 실패했습니다.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 gap-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Weather App</h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {/* 검색 바 */}
        <LocationSearch onSelect={handleLocationSelect} placeholder="지역 검색 (예: 서울, 강남구, 역삼동)" />

        {/* 현재 위치로 돌아가기 버튼 */}
        {selectedLocation && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToCurrentLocation}
            className="self-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            현재 위치로
          </Button>
        )}

        {/* 날씨 정보 */}
        {weather && <WeatherCard data={weather} />}
        {hourly && <HourlyForecast data={hourly} />}
      </div>
    </main>
  );
}
