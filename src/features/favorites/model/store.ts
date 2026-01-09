"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { FavoriteLocation } from "./types";
import { FAVORITES_CONFIG } from "@/shared/config/constants";

interface FavoritesState {
  favorites: FavoriteLocation[];
}

interface FavoritesActions {
  addFavorite: (
    location: Omit<FavoriteLocation, "id" | "alias" | "createdAt">
  ) => boolean;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string | null) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  canAddFavorite: () => boolean;
  getFavoriteByCoords: (lat: number, lon: number) => FavoriteLocation | undefined;
}

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  persist(
    immer((set, get) => ({
      favorites: [],

      addFavorite: (location) => {
        const state = get();
        if (state.favorites.length >= FAVORITES_CONFIG.MAX_FAVORITES) {
          return false;
        }
        if (state.isFavorite(location.lat, location.lon)) {
          return false;
        }

        set((draft) => {
          draft.favorites.push({
            ...location,
            id: crypto.randomUUID(),
            alias: null,
            createdAt: Date.now(),
          });
        });
        return true;
      },

      removeFavorite: (id) => {
        set((draft) => {
          draft.favorites = draft.favorites.filter((f) => f.id !== id);
        });
      },

      updateAlias: (id, alias) => {
        set((draft) => {
          const favorite = draft.favorites.find((f) => f.id === id);
          if (favorite) {
            favorite.alias = alias?.trim() || null;
          }
        });
      },

      isFavorite: (lat, lon) => {
        return get().favorites.some(
          (f) => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lon - lon) < 0.001
        );
      },

      canAddFavorite: () => {
        return get().favorites.length < FAVORITES_CONFIG.MAX_FAVORITES;
      },

      getFavoriteByCoords: (lat, lon) => {
        return get().favorites.find(
          (f) => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lon - lon) < 0.001
        );
      },
    })),
    {
      name: "weather-favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
