"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/shared/ui";
import { Search, MapPin, X } from "lucide-react";
import { searchLocations, type LocationResult } from "../model/searchLocations";
import { cn } from "@/shared/lib/cn";

interface LocationSearchProps {
  onSelect: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({
  onSelect,
  placeholder = "지역 검색...",
  className,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 검색 실행
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 1) {
      const searchResults = searchLocations(value, 8);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  // 결과 선택
  const handleSelect = useCallback(
    (location: LocationResult) => {
      onSelect(location);
      setQuery("");
      setResults([]);
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          } else if (results.length > 0) {
            // 선택된 항목이 없으면 첫 번째 결과 선택
            handleSelect(results[0]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, results, selectedIndex, handleSelect]
  );

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 1 && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-lg max-h-64 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelect(location)}
              className={cn(
                "w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[var(--accent)]",
                selectedIndex === index && "bg-[var(--accent)]"
              )}
            >
              <MapPin className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{location.name}</span>
                <span className="text-xs text-[var(--muted-foreground)] truncate">
                  {location.fullName}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
