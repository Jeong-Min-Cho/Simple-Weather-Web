"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useThemeStore } from "@/shared/model/themeStore";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={resolvedTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-300" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
