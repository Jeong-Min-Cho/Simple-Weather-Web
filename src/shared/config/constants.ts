export const APP_NAME = "Weather App";

export const API_CONFIG = {
  OPENWEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5",
  OPENWEATHER_GEO_URL: "https://api.openweathermap.org/geo/1.0",
} as const;

export const FAVORITES_CONFIG = {
  MAX_FAVORITES: 6,
} as const;

export const CACHE_CONFIG = {
  WEATHER_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  WEATHER_GC_TIME: 10 * 60 * 1000, // 10 minutes
  LOCATION_STALE_TIME: Infinity, // Location data rarely changes
} as const;
