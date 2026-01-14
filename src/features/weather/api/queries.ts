import { useQuery } from "@tanstack/react-query";
import {
  getCurrentWeather,
  getHourlyForecast,
  geocodeLocation,
  reverseGeocode,
} from "./weatherApi";
import type { WeatherData, HourlyForecast, GeocodingResult } from "../model/types";
import { CACHE_CONFIG, WEATHER_CONFIG } from "@/shared/config/constants";

// Query Keys
export const weatherKeys = {
  all: ["weather"] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, "current", lat, lon] as const,
  hourly: (lat: number, lon: number) => [...weatherKeys.all, "hourly", lat, lon] as const,
  geocode: (query: string) => [...weatherKeys.all, "geocode", query] as const,
  reverseGeocode: (lat: number, lon: number) => [...weatherKeys.all, "reverse", lat, lon] as const,
};

// 현재 날씨 조회
export function useCurrentWeather(lat: number | null, lon: number | null, locationName?: string) {
  return useQuery<WeatherData>({
    queryKey: [...weatherKeys.current(lat ?? 0, lon ?? 0), "v3"],
    queryFn: () => getCurrentWeather(lat!, lon!, locationName),
    enabled: lat !== null && lon !== null,
    staleTime: CACHE_CONFIG.WEATHER_STALE_TIME,
    gcTime: CACHE_CONFIG.WEATHER_GC_TIME,
    refetchInterval: CACHE_CONFIG.WEATHER_REFETCH_INTERVAL,
  });
}

// 시간대별 예보 조회
export function useHourlyForecast(lat: number | null, lon: number | null) {
  return useQuery<HourlyForecast[]>({
    queryKey: weatherKeys.hourly(lat ?? 0, lon ?? 0),
    queryFn: () => getHourlyForecast(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: CACHE_CONFIG.WEATHER_STALE_TIME,
    gcTime: CACHE_CONFIG.WEATHER_GC_TIME,
    refetchInterval: CACHE_CONFIG.WEATHER_REFETCH_INTERVAL,
  });
}

// 지역명 검색 (Geocoding)
export function useGeocode(query: string) {
  return useQuery<GeocodingResult[]>({
    queryKey: weatherKeys.geocode(query),
    queryFn: () => geocodeLocation(query),
    enabled: query.length >= WEATHER_CONFIG.MIN_SEARCH_LENGTH,
    staleTime: CACHE_CONFIG.GEOCODE_STALE_TIME,
    gcTime: CACHE_CONFIG.GEOCODE_GC_TIME,
  });
}

// 좌표 → 지역명 (Reverse Geocoding)
export function useReverseGeocode(lat: number | null, lon: number | null) {
  return useQuery<string>({
    queryKey: weatherKeys.reverseGeocode(lat ?? 0, lon ?? 0),
    queryFn: () => reverseGeocode(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: CACHE_CONFIG.REVERSE_GEOCODE_STALE_TIME,
    gcTime: CACHE_CONFIG.REVERSE_GEOCODE_GC_TIME,
  });
}
