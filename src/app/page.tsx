"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useCurrentWeather, useHourlyForecast, useGeocode } from "@/features/weather";
import { useGeolocation } from "@/shared/hooks";
import { LocationSearch, type LocationResult, getGeocodingQueries } from "@/features/location-search";
import { MapPin, MapPinOff, Loader2, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui";

interface SelectedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface PendingSearch {
  locationName: string;
  queries: string[];
  currentIndex: number;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendingSearch, setPendingSearch] = useState<PendingSearch | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const prevGeocodeResults = useRef<unknown>(null);

  const { latitude: geoLat, longitude: geoLon, error: geoError, isLoading: geoLoading } = useGeolocation();

  // 검색된 지역의 좌표 조회
  const { data: geocodeResults, isLoading: geocodeLoading, isFetched } = useGeocode(searchQuery);

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
    const queries = getGeocodingQueries(location);
    setLocationError(null);
    setPendingSearch({
      locationName: location.fullName,
      queries,
      currentIndex: 0,
    });
    setSearchQuery(queries[0]);
  }, []);

  // geocode 결과 처리 - 여러 쿼리 시도
  useEffect(() => {
    if (!pendingSearch) return;
    if (geocodeLoading) return;
    if (!isFetched) return;

    // 결과가 같으면 스킵 (중복 실행 방지)
    const resultsKey = JSON.stringify(geocodeResults);
    if (resultsKey === prevGeocodeResults.current) return;
    prevGeocodeResults.current = resultsKey;

    if (geocodeResults && geocodeResults.length > 0) {
      // 성공: 위치 설정
      const result = geocodeResults[0];
      setSelectedLocation({
        name: pendingSearch.locationName,
        latitude: result.latitude,
        longitude: result.longitude,
      });
      setSearchQuery("");
      setPendingSearch(null);
    } else {
      // 실패: 다음 쿼리 시도
      const nextIndex = pendingSearch.currentIndex + 1;
      if (nextIndex < pendingSearch.queries.length) {
        // 다음 쿼리로 즉시 전환
        const nextQuery = pendingSearch.queries[nextIndex];
        setPendingSearch({
          ...pendingSearch,
          currentIndex: nextIndex,
        });
        // 약간의 딜레이 후 다음 쿼리 실행 (깜빡임 방지)
        setTimeout(() => {
          setSearchQuery(nextQuery);
        }, 50);
      } else {
        // 모든 쿼리 실패
        setLocationError("해당 장소의 정보가 제공되지 않습니다.");
        setSearchQuery("");
        setPendingSearch(null);
      }
    }
  }, [geocodeResults, geocodeLoading, isFetched, pendingSearch]);

  // 현재 위치로 돌아가기
  const handleResetToCurrentLocation = useCallback(() => {
    setSelectedLocation(null);
    setSearchQuery("");
    setLocationError(null);
  }, []);

  // 에러 닫기
  const handleCloseError = useCallback(() => {
    setLocationError(null);
  }, []);

  const isSearching = !!pendingSearch;
  const isLoading = geoLoading || weatherLoading || isSearching;

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
              : pendingSearch
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

        {/* 검색 에러 메시지 */}
        {locationError && (
          <div className="w-full max-w-md flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500 flex-1">{locationError}</p>
            <button onClick={handleCloseError} className="text-red-500 hover:text-red-400">
              ✕
            </button>
          </div>
        )}

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

        {/* 검색 에러 메시지 */}
        {locationError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500 flex-1">{locationError}</p>
            <button onClick={handleCloseError} className="text-red-500 hover:text-red-400">
              ✕
            </button>
          </div>
        )}

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

        {/* 검색 중 로딩 */}
        {isSearching && (
          <div className="flex items-center justify-center gap-2 py-4 text-[var(--muted-foreground)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>지역 검색 중...</span>
          </div>
        )}

        {/* 날씨 정보 */}
        {!isSearching && weather && <WeatherCard data={weather} />}
        {!isSearching && hourly && <HourlyForecast data={hourly} />}
      </div>
    </main>
  );
}
