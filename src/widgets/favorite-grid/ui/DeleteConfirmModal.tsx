"use client";

import { Button } from "@/shared/ui";
import { X, AlertTriangle } from "lucide-react";
import type { FavoriteLocation } from "@/shared/model/favoritesStore";

interface DeleteConfirmModalProps {
  favorite: FavoriteLocation | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteConfirmModal({ favorite, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!favorite) return null;

  const handleConfirm = () => {
    onConfirm(favorite.id);
    onClose();
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
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            삭제 확인
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--accent)] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[var(--muted-foreground)] mb-4">
          <span className="font-medium text-[var(--foreground)]">{favorite.name}</span>
          을(를) 즐겨찾기에서 삭제하시겠습니까?
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
