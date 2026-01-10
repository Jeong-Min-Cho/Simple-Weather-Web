import { useQuery } from "@tanstack/react-query";
import {
  getCurrentWeather,
  getHourlyForecast,
  geocodeLocation,
  reverseGeocode,
} from "./weatherApi";
import type { WeatherData, HourlyForecast, GeocodingResult } from "../model/types";

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
    queryKey: weatherKeys.current(lat ?? 0, lon ?? 0),
    queryFn: () => getCurrentWeather(lat!, lon!, locationName),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

// 시간대별 예보 조회
export function useHourlyForecast(lat: number | null, lon: number | null) {
  return useQuery<HourlyForecast[]>({
    queryKey: weatherKeys.hourly(lat ?? 0, lon ?? 0),
    queryFn: () => getHourlyForecast(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// 지역명 검색 (Geocoding)
export function useGeocode(query: string) {
  return useQuery<GeocodingResult[]>({
    queryKey: weatherKeys.geocode(query),
    queryFn: () => geocodeLocation(query),
    enabled: query.length >= 2,
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  });
}

// 좌표 → 지역명 (Reverse Geocoding)
export function useReverseGeocode(lat: number | null, lon: number | null) {
  return useQuery<string>({
    queryKey: weatherKeys.reverseGeocode(lat ?? 0, lon ?? 0),
    queryFn: () => reverseGeocode(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 24 * 60 * 60 * 1000, // 24시간
  });
}
