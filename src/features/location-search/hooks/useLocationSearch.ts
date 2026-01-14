"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGeocode } from "@/features/weather";
import { type LocationResult, getGeocodingQueries } from "../model/searchLocations";

export interface SelectedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface PendingSearch {
  locationName: string;
  queries: string[];
  currentIndex: number;
}

// 기본 위치: 서울 강남구
export const DEFAULT_LOCATION = {
  latitude: 37.4979,
  longitude: 127.0276,
  name: "서울 강남구",
} as const;

interface UseLocationSearchOptions {
  geoLatitude: number | null;
  geoLongitude: number | null;
  geoError: string | null;
}

interface UseLocationSearchReturn {
  selectedLocation: SelectedLocation | null;
  locationError: string | null;
  isSearching: boolean;
  useDefaultLocation: boolean;
  currentLat: number | null;
  currentLon: number | null;
  currentLocationName: string | undefined;
  handleLocationSelect: (location: LocationResult) => void;
  handleResetToCurrentLocation: () => void;
  handleCloseError: () => void;
}

export function useLocationSearch({
  geoLatitude,
  geoLongitude,
  geoError,
}: UseLocationSearchOptions): UseLocationSearchReturn {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendingSearch, setPendingSearch] = useState<PendingSearch | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const prevGeocodeResults = useRef<unknown>(null);

  // 검색된 지역의 좌표 조회
  const { data: geocodeResults, isLoading: geocodeLoading, isFetched } = useGeocode(searchQuery);

  // 현재 사용할 좌표 결정 (위치 권한 거부시 기본 위치 사용)
  const useDefaultLocation = !selectedLocation && !!geoError;
  const currentLat = selectedLocation?.latitude ?? geoLatitude ?? (useDefaultLocation ? DEFAULT_LOCATION.latitude : null);
  const currentLon = selectedLocation?.longitude ?? geoLongitude ?? (useDefaultLocation ? DEFAULT_LOCATION.longitude : null);
  const currentLocationName = selectedLocation?.name ?? (useDefaultLocation ? DEFAULT_LOCATION.name : undefined);

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

  return {
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
  };
}
