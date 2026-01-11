"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/shared/ui";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import { TemperatureDisplay, TemperatureRange } from "@/entities/weather/ui/TemperatureDisplay";
import { useCurrentWeather } from "@/features/weather";
import { Skeleton } from "@/shared/ui";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { FavoriteLocation } from "@/shared/model/favoritesStore";
import Link from "next/link";

// 이름을 파싱하여 주요 부분과 상위 지역으로 분리
function parseLocationName(name: string): { main: string; sub: string } {
  const parts = name.split(" ");
  if (parts.length >= 3) {
    return {
      main: parts[parts.length - 1],
      sub: parts[parts.length - 2],
    };
  } else if (parts.length === 2) {
    return {
      main: parts[1],
      sub: parts[0].replace(/(특별시|광역시|특별자치시|특별자치도|도)$/, ""),
    };
  }
  return { main: name, sub: "" };
}

interface SortableFavoriteCardProps {
  favorite: FavoriteLocation;
  onEdit: (favorite: FavoriteLocation) => void;
  onDelete: (id: string) => void;
}

export function SortableFavoriteCard({ favorite, onEdit, onDelete }: SortableFavoriteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: favorite.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

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

  const { main, sub } = parseLocationName(favorite.name);

  if (isLoading) {
    return (
      <div ref={setNodeRef} style={style}>
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-12" />
              <div className="flex items-center gap-2 mt-1">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-14" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="w-full cursor-pointer hover:bg-[var(--accent)] transition-colors group">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <button
                {...attributes}
                {...listeners}
                className="p-0.5 cursor-grab active:cursor-grabbing touch-none"
                title="드래그하여 순서 변경"
              >
                <GripVertical className="w-4 h-4 text-[var(--muted-foreground)]" />
              </button>
              <Link href={`/weather/${favorite.id}`} className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{main}</h3>
                {sub && (
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{sub}</p>
                )}
              </Link>
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

          <Link href={`/weather/${favorite.id}`}>
            <div className="flex items-center gap-2">
              <WeatherIcon icon={weather.icon} condition={weather.condition} size="md" />
              <TemperatureDisplay temperature={weather.temperature} size="lg" />
            </div>

            <div className="mt-1">
              <TemperatureRange min={weather.tempMin} max={weather.tempMax} />
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
