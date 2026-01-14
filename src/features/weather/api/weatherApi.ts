import type {
  OpenMeteoResponse,
  GeocodingResult,
  WeatherData,
  HourlyForecast,
  WeatherCodeInfo,
} from "../model/types";
import { WEATHER_CONFIG } from "@/shared/config/constants";

const BASE_URL = "https://api.open-meteo.com/v1";

// WMO Weather Code Mapping
// https://open-meteo.com/en/docs
const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0: { condition: "Clear", description: "맑음", icon: "01" },
  1: { condition: "Mainly Clear", description: "대체로 맑음", icon: "01" },
  2: { condition: "Partly Cloudy", description: "부분적으로 흐림", icon: "02" },
  3: { condition: "Overcast", description: "흐림", icon: "03" },
  45: { condition: "Fog", description: "안개", icon: "50" },
  48: { condition: "Depositing Rime Fog", description: "짙은 안개", icon: "50" },
  51: { condition: "Light Drizzle", description: "가벼운 이슬비", icon: "09" },
  53: { condition: "Moderate Drizzle", description: "이슬비", icon: "09" },
  55: { condition: "Dense Drizzle", description: "짙은 이슬비", icon: "09" },
  56: { condition: "Light Freezing Drizzle", description: "가벼운 진눈깨비", icon: "13" },
  57: { condition: "Dense Freezing Drizzle", description: "진눈깨비", icon: "13" },
  61: { condition: "Slight Rain", description: "약한 비", icon: "10" },
  63: { condition: "Moderate Rain", description: "비", icon: "10" },
  65: { condition: "Heavy Rain", description: "강한 비", icon: "10" },
  66: { condition: "Light Freezing Rain", description: "가벼운 얼어붙는 비", icon: "13" },
  67: { condition: "Heavy Freezing Rain", description: "강한 얼어붙는 비", icon: "13" },
  71: { condition: "Slight Snow", description: "약한 눈", icon: "13" },
  73: { condition: "Moderate Snow", description: "눈", icon: "13" },
  75: { condition: "Heavy Snow", description: "강한 눈", icon: "13" },
  77: { condition: "Snow Grains", description: "싸락눈", icon: "13" },
  80: { condition: "Slight Rain Showers", description: "약한 소나기", icon: "09" },
  81: { condition: "Moderate Rain Showers", description: "소나기", icon: "09" },
  82: { condition: "Violent Rain Showers", description: "강한 소나기", icon: "09" },
  85: { condition: "Slight Snow Showers", description: "약한 눈 소나기", icon: "13" },
  86: { condition: "Heavy Snow Showers", description: "강한 눈 소나기", icon: "13" },
  95: { condition: "Thunderstorm", description: "뇌우", icon: "11" },
  96: { condition: "Thunderstorm with Slight Hail", description: "약한 우박 동반 뇌우", icon: "11" },
  99: { condition: "Thunderstorm with Heavy Hail", description: "강한 우박 동반 뇌우", icon: "11" },
};

function getWeatherInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  const info = WMO_CODES[code] || { condition: "Unknown", description: "알 수 없음", icon: "01" };
  return {
    ...info,
    icon: info.icon + (isDay ? "d" : "n"),
  };
}

// API 호출 헬퍼
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// 현재 날씨 + 시간대별 예보 조회 (한 번의 API 호출로)
export async function getWeatherData(
  lat: number,
  lon: number
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    hourly: "temperature_2m,weather_code,precipitation_probability",
    daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "Asia/Seoul",
    forecast_days: "2",
  });

  const url = `${BASE_URL}/forecast?${params}`;
  return fetchApi<OpenMeteoResponse>(url);
}

// 현재 날씨 조회 (Transformed)
export async function getCurrentWeather(
  lat: number,
  lon: number,
  locationName?: string
): Promise<WeatherData> {
  // 위치명이 없으면 reverse geocoding으로 조회
  const [data, resolvedLocationName] = await Promise.all([
    getWeatherData(lat, lon),
    locationName ? Promise.resolve(locationName) : reverseGeocode(lat, lon),
  ]);
  return transformCurrentWeather(data, resolvedLocationName);
}

// 시간대별 예보 조회 (Transformed)
export async function getHourlyForecast(
  lat: number,
  lon: number
): Promise<HourlyForecast[]> {
  const data = await getWeatherData(lat, lon);
  return transformHourlyForecast(data);
}

// Nominatim Forward Geocoding Response
interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
  name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    province?: string;
    country?: string;
  };
}

// 지역명 검색 (Geocoding) - Nominatim 사용 (한국 지역 검색에 더 적합)
export async function geocodeLocation(
  locationName: string
): Promise<GeocodingResult[]> {
  try {
    const params = new URLSearchParams({
      q: locationName,
      format: "json",
      "accept-language": "ko",
      countrycodes: "kr",
      limit: "5",
    });

    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SimpleWeatherApp/1.0",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: NominatimSearchResult[] = await response.json();

    // Nominatim 결과를 GeocodingResult 형식으로 변환
    return data.map((item, index) => ({
      id: index,
      name: item.name || item.display_name.split(",")[0],
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      feature_code: "PPL",
      country_code: "KR",
      country: "South Korea",
      country_id: 1835841,
      timezone: "Asia/Seoul",
      admin1: item.address?.province || item.address?.state || "",
    }));
  } catch {
    return [];
  }
}

// Nominatim Reverse Geocoding Response
interface NominatimResponse {
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    province?: string;
    country?: string;
    borough?: string;
    suburb?: string;
    quarter?: string;
    neighbourhood?: string;
    city_district?: string;
    road?: string;
    dong?: string;
  };
  display_name: string;
}

// 좌표 → 지역명 변환 (Reverse Geocoding) - Nominatim (OpenStreetMap) 사용
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      format: "json",
      "accept-language": "ko",
      addressdetails: "1",
    });

    const url = `https://nominatim.openstreetmap.org/reverse?${params}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SimpleWeatherApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data: NominatimResponse = await response.json();
    const address = data.address;

    // 전체 주소 조합: 도/시 + 시/군/구 + 동/읍/면
    const parts: string[] = [];

    // 1. 도/광역시/특별시 (province 또는 state)
    const province = address.province || address.state;
    if (province) {
      parts.push(province);
    }

    // 2. 시/군/구
    if (address.city) {
      parts.push(address.city);
    }

    // 3. 구 (서울 같은 대도시)
    if (address.borough || address.city_district) {
      const district = address.borough || address.city_district;
      if (district && !parts.includes(district)) {
        parts.push(district);
      }
    }

    // 4. 읍/면 (town)
    if (address.town && !parts.includes(address.town)) {
      parts.push(address.town);
    }

    // 5. 동/리 (village, suburb, neighbourhood 등)
    const dong = address.dong || address.quarter || address.neighbourhood || address.suburb || address.village;
    if (dong && !parts.includes(dong)) {
      parts.push(dong);
    }

    return parts.length > 0 ? parts.join(" ") : "알 수 없는 위치";
  } catch {
    return "알 수 없는 위치";
  }
}

// Transform 함수들
function transformCurrentWeather(
  data: OpenMeteoResponse,
  locationName?: string
): WeatherData {
  const current = data.current;
  const daily = data.daily;

  if (!current || !daily) {
    throw new Error("Invalid weather data");
  }

  const isDay = isDaytime(daily.sunrise[0], daily.sunset[0]);
  const weatherInfo = getWeatherInfo(current.weather_code, isDay);

  return {
    location: locationName || `${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}`,
    country: "KR",
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    tempMin: Math.round(daily.temperature_2m_min[0]),
    tempMax: Math.round(daily.temperature_2m_max[0]),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m * 10) / 10, // km/h to 1 decimal
    condition: weatherInfo.condition,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    timestamp: new Date(current.time).getTime(),
    sunrise: new Date(daily.sunrise[0]).getTime(),
    sunset: new Date(daily.sunset[0]).getTime(),
  };
}

function transformHourlyForecast(data: OpenMeteoResponse): HourlyForecast[] {
  const hourly = data.hourly;
  const daily = data.daily;

  if (!hourly || !daily) {
    throw new Error("Invalid forecast data");
  }

  const now = new Date();
  const currentHour = now.getHours();

  // 현재 시간부터 시간대별 예보
  const forecasts: HourlyForecast[] = [];
  let startIndex = hourly.time.findIndex((time) => {
    const hour = new Date(time).getHours();
    return new Date(time) >= now || hour === currentHour;
  });

  if (startIndex === -1) startIndex = 0;

  // 1시간 간격으로 HOURLY_FORECAST_COUNT개
  for (let i = 0; i < WEATHER_CONFIG.HOURLY_FORECAST_COUNT; i++) {
    const index = startIndex + i;
    if (index >= hourly.time.length) break;

    const time = hourly.time[index];
    const timeDate = new Date(time);
    const isDay = isDaytime(daily.sunrise[0], daily.sunset[0], timeDate);
    const weatherInfo = getWeatherInfo(hourly.weather_code[index], isDay);

    forecasts.push({
      time: formatTime(timeDate.getTime()),
      timestamp: timeDate.getTime(),
      temperature: Math.round(hourly.temperature_2m[index]),
      icon: weatherInfo.icon,
      condition: weatherInfo.condition,
      pop: (hourly.precipitation_probability[index] || 0) / 100,
    });
  }

  return forecasts;
}

function isDaytime(sunrise: string, sunset: string, now?: Date): boolean {
  const currentTime = now || new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  // 날짜가 다를 수 있으므로 시간만 비교
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const sunriseMinutes = sunriseTime.getHours() * 60 + sunriseTime.getMinutes();
  const sunsetMinutes = sunsetTime.getHours() * 60 + sunsetTime.getMinutes();

  return currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes;
}

function formatTime(timestamp: number): string {
  const hour = new Date(timestamp).getHours();
  return `${hour}시`;
}
