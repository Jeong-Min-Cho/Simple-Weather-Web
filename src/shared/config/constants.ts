export const APP_NAME = "Weather App";

export const API_CONFIG = {
  OPENWEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5",
  OPENWEATHER_GEO_URL: "https://api.openweathermap.org/geo/1.0",
} as const;

export const FAVORITES_CONFIG = {
  MAX_FAVORITES: 6,
} as const;

export const CACHE_CONFIG = {
  // 날씨 데이터
  WEATHER_STALE_TIME: 5 * 60 * 1000, // 5분
  WEATHER_GC_TIME: 10 * 60 * 1000, // 10분
  WEATHER_REFETCH_INTERVAL: 60 * 60 * 1000, // 1시간 자동 갱신
  // Geocoding 데이터
  GEOCODE_STALE_TIME: 30 * 60 * 1000, // 30분
  GEOCODE_GC_TIME: 60 * 60 * 1000, // 1시간
  REVERSE_GEOCODE_STALE_TIME: 60 * 60 * 1000, // 1시간
  REVERSE_GEOCODE_GC_TIME: 24 * 60 * 60 * 1000, // 24시간
  LOCATION_STALE_TIME: Infinity, // Location data rarely changes
} as const;

export const GEOLOCATION_CONFIG = {
  TIMEOUT: 10000, // 10초
  MAX_AGE: 60000, // 1분 캐시
} as const;

export const WEATHER_CONFIG = {
  HOURLY_FORECAST_COUNT: 24, // 시간대별 예보 개수
  MIN_SEARCH_LENGTH: 2, // 최소 검색어 길이
} as const;
