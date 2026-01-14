"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useFavoritesStore, type FavoriteLocation } from "@/shared/model/favoritesStore";
import { SortableFavoriteCard } from "./SortableFavoriteCard";
import { AliasEditModal } from "./AliasEditModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Star } from "lucide-react";

export function FavoriteGrid() {
  const { favorites, removeFavorite, updateAlias, reorderFavorites } = useFavoritesStore();
  const [editingFavorite, setEditingFavorite] = useState<FavoriteLocation | null>(null);
  const [deletingFavorite, setDeletingFavorite] = useState<FavoriteLocation | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEdit = useCallback((favorite: FavoriteLocation) => {
    setEditingFavorite(favorite);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    const favorite = favorites.find((f) => f.id === id);
    if (favorite) {
      setDeletingFavorite(favorite);
    }
  }, [favorites]);

  const handleDeleteConfirm = useCallback((id: string) => {
    removeFavorite(id);
  }, [removeFavorite]);

  const handleSaveAlias = useCallback((id: string, newAlias: string) => {
    updateAlias(id, newAlias);
    setEditingFavorite(null);
  }, [updateAlias]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderFavorites(active.id as string, over.id as string);
    }
  }, [reorderFavorites]);

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={favorites.map((f) => f.id)} strategy={rectSortingStrategy}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {favorites.map((favorite) => (
              <SortableFavoriteCard
                key={favorite.id}
                favorite={favorite}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AliasEditModal
        favorite={editingFavorite}
        onClose={() => setEditingFavorite(null)}
        onSave={handleSaveAlias}
      />

      <DeleteConfirmModal
        favorite={deletingFavorite}
        onClose={() => setDeletingFavorite(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
