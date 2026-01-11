"use client";

import { useState } from "react";
import { useFavoritesStore, type FavoriteLocation } from "@/shared/model/favoritesStore";
import { FavoriteCard } from "./FavoriteCard";
import { AliasEditModal } from "./AliasEditModal";
import { Star } from "lucide-react";

export function FavoriteGrid() {
  const { favorites, removeFavorite, updateAlias } = useFavoritesStore();
  const [editingFavorite, setEditingFavorite] = useState<FavoriteLocation | null>(null);

  const handleEdit = (favorite: FavoriteLocation) => {
    setEditingFavorite(favorite);
  };

  const handleDelete = (id: string) => {
    removeFavorite(id);
  };

  const handleSaveAlias = (id: string, newAlias: string) => {
    updateAlias(id, newAlias);
    setEditingFavorite(null);
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-[var(--muted-foreground)]">
        <Star className="w-8 h-8 mb-2" />
        <p className="text-sm">즐겨찾기한 장소가 없습니다</p>
        <p className="text-xs mt-1">날씨 카드의 ★ 버튼으로 추가하세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AliasEditModal
        favorite={editingFavorite}
        onClose={() => setEditingFavorite(null)}
        onSave={handleSaveAlias}
      />
    </>
  );
}
