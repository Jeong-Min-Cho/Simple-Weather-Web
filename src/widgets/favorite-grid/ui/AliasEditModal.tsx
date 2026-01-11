"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/shared/ui";
import { X } from "lucide-react";
import type { FavoriteLocation } from "@/shared/model/favoritesStore";

interface AliasEditModalProps {
  favorite: FavoriteLocation | null;
  onClose: () => void;
  onSave: (id: string, newAlias: string) => void;
}

export function AliasEditModal({ favorite, onClose, onSave }: AliasEditModalProps) {
  const [alias, setAlias] = useState("");

  useEffect(() => {
    if (favorite) {
      setAlias(favorite.name);
    }
  }, [favorite]);

  if (!favorite) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.trim()) {
      onSave(favorite.id, alias.trim());
    }
  };

  const handleReset = () => {
    setAlias(favorite.originalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg w-full max-w-sm mx-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">별칭 수정</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--accent)] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-[var(--muted-foreground)] mb-1">
              원래 이름: {favorite.originalName}
            </label>
            <Input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="별칭 입력"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              원래대로
            </Button>
            <Button type="submit" className="flex-1">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
