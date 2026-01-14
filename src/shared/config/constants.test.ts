import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  FAVORITES_CONFIG,
  CACHE_CONFIG,
  GEOLOCATION_CONFIG,
  WEATHER_CONFIG,
} from "./constants";

describe("constants", () => {
  describe("APP_NAME", () => {
    it("앱 이름이 정의되어 있다", () => {
      expect(APP_NAME).toBe("Weather App");
    });
  });

  describe("FAVORITES_CONFIG", () => {
    it("최대 즐겨찾기 수가 정의되어 있다", () => {
      expect(FAVORITES_CONFIG.MAX_FAVORITES).toBe(6);
      expect(typeof FAVORITES_CONFIG.MAX_FAVORITES).toBe("number");
    });
  });

  describe("CACHE_CONFIG", () => {
    it("날씨 캐시 설정이 올바르게 정의되어 있다", () => {
      expect(CACHE_CONFIG.WEATHER_STALE_TIME).toBe(5 * 60 * 1000); // 5분
      expect(CACHE_CONFIG.WEATHER_GC_TIME).toBe(10 * 60 * 1000); // 10분
      expect(CACHE_CONFIG.WEATHER_REFETCH_INTERVAL).toBe(60 * 60 * 1000); // 1시간
    });

    it("지오코딩 캐시 설정이 올바르게 정의되어 있다", () => {
      expect(CACHE_CONFIG.GEOCODE_STALE_TIME).toBe(30 * 60 * 1000); // 30분
      expect(CACHE_CONFIG.GEOCODE_GC_TIME).toBe(60 * 60 * 1000); // 1시간
    });

    it("역지오코딩 캐시 설정이 올바르게 정의되어 있다", () => {
      expect(CACHE_CONFIG.REVERSE_GEOCODE_STALE_TIME).toBe(60 * 60 * 1000); // 1시간
      expect(CACHE_CONFIG.REVERSE_GEOCODE_GC_TIME).toBe(24 * 60 * 60 * 1000); // 24시간
    });
  });

  describe("GEOLOCATION_CONFIG", () => {
    it("위치 서비스 설정이 정의되어 있다", () => {
      expect(GEOLOCATION_CONFIG.TIMEOUT).toBe(10000); // 10초
      expect(GEOLOCATION_CONFIG.MAX_AGE).toBe(60000); // 1분
    });
  });

  describe("WEATHER_CONFIG", () => {
    it("날씨 설정이 정의되어 있다", () => {
      expect(WEATHER_CONFIG.HOURLY_FORECAST_COUNT).toBe(24);
      expect(WEATHER_CONFIG.MIN_SEARCH_LENGTH).toBe(2);
    });
  });
});
