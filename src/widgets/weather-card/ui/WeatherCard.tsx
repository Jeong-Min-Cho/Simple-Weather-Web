"use client";

import { memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import {
  TemperatureDisplay,
  TemperatureRange,
} from "@/entities/weather/ui/TemperatureDisplay";
import type { WeatherData } from "@/features/weather/model/types";
import { Droplets, Wind, Star } from "lucide-react";
import { useFavoritesStore, MAX_FAVORITES } from "@/shared/model/favoritesStore";

interface WeatherCardProps {
  data: WeatherData;
  latitude?: number;
  longitude?: number;
  showDetails?: boolean;
}

export const WeatherCard = memo(function WeatherCard({ data, latitude, longitude, showDetails = true }: WeatherCardProps) {
  const { addFavorite, removeFavorite, isFavorite, getFavoriteByCoords } = useFavoritesStore();

  const canFavorite = latitude !== undefined && longitude !== undefined;
  const isFav = canFavorite && isFavorite(latitude, longitude);

  const handleToggleFavorite = useCallback(() => {
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
        alert(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 추가할 수 있습니다.`);
      }
    }
  }, [canFavorite, isFav, latitude, longitude, data.location, getFavoriteByCoords, removeFavorite, addFavorite]);

  return (
    <article aria-label={`${data.location} 날씨 정보`}>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-medium">{data.location}</span>
            {canFavorite && (
              <button
                onClick={handleToggleFavorite}
                className="p-1 hover:bg-[var(--accent)] rounded transition-colors"
                title={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                aria-label={isFav ? `${data.location} 즐겨찾기 해제` : `${data.location} 즐겨찾기 추가`}
                aria-pressed={isFav}
              >
                <Star
                  className={`w-5 h-5 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-[var(--muted-foreground)]"}`}
                  aria-hidden="true"
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
              <dl className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">체감 온도</dt>
                  <dd className="text-[var(--foreground)]">
                    체감 {data.feelsLike}°
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">습도</dt>
                  <Droplets className="w-4 h-4" aria-hidden="true" />
                  <dd>{data.humidity}%</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">풍속</dt>
                  <Wind className="w-4 h-4" aria-hidden="true" />
                  <dd>{data.windSpeed} m/s</dd>
                </div>
              </dl>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
});
