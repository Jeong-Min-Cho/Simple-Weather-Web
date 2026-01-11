"use client";

import { Card, CardContent } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import { TemperatureDisplay, TemperatureRange } from "@/entities/weather/ui/TemperatureDisplay";
import { useCurrentWeather } from "@/features/weather";
import { Skeleton } from "@/shared/ui";
import { Pencil, Trash2 } from "lucide-react";
import type { FavoriteLocation } from "@/shared/model/favoritesStore";
import Link from "next/link";

// 이름을 파싱하여 주요 부분과 상위 지역으로 분리
function parseLocationName(name: string): { main: string; sub: string } {
  const parts = name.split(" ");
  if (parts.length >= 3) {
    // "전라남도 여수시 소라면" -> main: "소라면", sub: "여수시"
    return {
      main: parts[parts.length - 1],
      sub: parts[parts.length - 2],
    };
  } else if (parts.length === 2) {
    // "경기도 수원시" -> main: "수원시", sub: "경기도"
    return {
      main: parts[1],
      sub: parts[0].replace(/(특별시|광역시|특별자치시|특별자치도|도)$/, ""),
    };
  }
  return { main: name, sub: "" };
}

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  onEdit: (favorite: FavoriteLocation) => void;
  onDelete: (id: string) => void;
}

export function FavoriteCard({ favorite, onEdit, onDelete }: FavoriteCardProps) {
  const { data: weather, isLoading } = useCurrentWeather(
    favorite.latitude,
    favorite.longitude,
    favorite.name
  );

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(favorite);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(favorite.id);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  const { main, sub } = parseLocationName(favorite.name);

  return (
    <Link href={`/weather/${favorite.id}`}>
      <Card className="w-full cursor-pointer hover:bg-[var(--accent)] transition-colors group">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-medium text-sm truncate">{main}</h3>
              {sub && (
                <p className="text-xs text-[var(--muted-foreground)] truncate">{sub}</p>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="p-1 hover:bg-[var(--background)] rounded"
                title="별칭 수정"
              >
                <Pencil className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-[var(--background)] rounded"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <WeatherIcon icon={weather.icon} condition={weather.condition} size="md" />
            <TemperatureDisplay temperature={weather.temperature} size="lg" />
          </div>

          <div className="mt-1">
            <TemperatureRange min={weather.tempMin} max={weather.tempMax} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
