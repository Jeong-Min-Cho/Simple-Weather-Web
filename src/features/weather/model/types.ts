// Open-Meteo API Response Types

export interface Coordinates {
  lat: number;
  lon: number;
}

// Open-Meteo Current Weather Response
export interface OpenMeteoCurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface OpenMeteoCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface OpenMeteoHourlyUnits {
  time: string;
  temperature_2m: string;
  weather_code: string;
  precipitation_probability: string;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface OpenMeteoDailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  sunrise: string;
  sunset: string;
}

export interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: OpenMeteoCurrentUnits;
  current?: OpenMeteoCurrent;
  hourly_units?: OpenMeteoHourlyUnits;
  hourly?: OpenMeteoHourly;
  daily_units?: OpenMeteoDailyUnits;
  daily?: OpenMeteoDaily;
}

// Open-Meteo Geocoding Response
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  country: string;
  country_id: number;
  admin1?: string;
  admin1_id?: number;
  admin2?: string;
  admin2_id?: number;
  admin3?: string;
  admin3_id?: number;
  admin4?: string;
  admin4_id?: number;
  timezone: string;
  population?: number;
  postcodes?: string[];
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

// App-specific types (transformed)
export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  timestamp: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyForecast {
  time: string;
  timestamp: number;
  temperature: number;
  icon: string;
  condition: string;
  pop: number; // Probability of precipitation (0-1)
}

// WMO Weather Code mapping
export interface WeatherCodeInfo {
  condition: string;
  description: string;
  icon: string;
}
