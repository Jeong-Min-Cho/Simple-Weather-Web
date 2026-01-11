"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FavoriteLocation {
  id: string;
  name: string; // 별칭 (수정 가능)
  originalName: string; // 원래 이름
  latitude: number;
  longitude: number;
}

interface FavoritesState {
  favorites: FavoriteLocation[];
}

interface FavoritesActions {
  addFavorite: (location: Omit<FavoriteLocation, "id">) => boolean;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, name: string) => void;
  isFavorite: (latitude: number, longitude: number) => boolean;
  getFavoriteByCoords: (latitude: number, longitude: number) => FavoriteLocation | undefined;
}

const MAX_FAVORITES = 6;

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (location) => {
        const { favorites } = get();

        // 최대 개수 체크
        if (favorites.length >= MAX_FAVORITES) {
          return false;
        }

        // 이미 존재하는지 체크 (좌표 기준)
        const exists = favorites.some(
          (f) => f.latitude === location.latitude && f.longitude === location.longitude
        );
        if (exists) {
          return false;
        }

        const newFavorite: FavoriteLocation = {
          ...location,
          id: `fav-${Date.now()}`,
        };

        set({ favorites: [...favorites, newFavorite] });
        return true;
      },

      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

      updateAlias: (id, name) => {
        set({
          favorites: get().favorites.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        });
      },

      isFavorite: (latitude, longitude) => {
        return get().favorites.some(
          (f) => f.latitude === latitude && f.longitude === longitude
        );
      },

      getFavoriteByCoords: (latitude, longitude) => {
        return get().favorites.find(
          (f) => f.latitude === latitude && f.longitude === longitude
        );
      },
    }),
    {
      name: "weather-favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
