"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import {
  TemperatureDisplay,
  TemperatureRange,
} from "@/entities/weather/ui/TemperatureDisplay";
import type { WeatherData } from "@/features/weather/model/types";
import { Droplets, Wind, Star } from "lucide-react";
import { useFavoritesStore } from "@/shared/model/favoritesStore";

interface WeatherCardProps {
  data: WeatherData;
  latitude?: number;
  longitude?: number;
  showDetails?: boolean;
}

export function WeatherCard({ data, latitude, longitude, showDetails = true }: WeatherCardProps) {
  const { addFavorite, removeFavorite, isFavorite, getFavoriteByCoords } = useFavoritesStore();

  const canFavorite = latitude !== undefined && longitude !== undefined;
  const isFav = canFavorite && isFavorite(latitude, longitude);

  const handleToggleFavorite = () => {
    if (!canFavorite) return;

    if (isFav) {
      const fav = getFavoriteByCoords(latitude, longitude);
      if (fav) {
        removeFavorite(fav.id);
      }
    } else {
      const success = addFavorite({
        name: data.location,
        originalName: data.location,
        latitude,
        longitude,
      });
      if (!success) {
        alert("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-medium">{data.location}</span>
          {canFavorite && (
            <button
              onClick={handleToggleFavorite}
              className="p-1 hover:bg-[var(--accent)] rounded transition-colors"
              title={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              <Star
                className={`w-5 h-5 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-[var(--muted-foreground)]"}`}
              />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon icon={data.icon} condition={data.condition} size="xl" />
            <div className="flex flex-col">
              <TemperatureDisplay temperature={data.temperature} size="xl" />
              <span className="text-sm text-[var(--muted-foreground)]">
                {data.description}
              </span>
              <TemperatureRange min={data.tempMin} max={data.tempMax} />
            </div>
          </div>

          {showDetails && (
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <span className="text-[var(--foreground)]">
                  체감 {data.feelsLike}°
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>{data.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span>{data.windSpeed} m/s</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
