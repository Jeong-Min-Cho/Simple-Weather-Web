import { cn } from "@/shared/lib/cn";

interface TemperatureDisplayProps {
  temperature: number;
  size?: "sm" | "md" | "lg" | "xl";
  showUnit?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

export function TemperatureDisplay({
  temperature,
  size = "md",
  showUnit = true,
  className,
}: TemperatureDisplayProps) {
  return (
    <span className={cn("font-semibold tabular-nums", sizeClasses[size], className)}>
      {temperature}
      {showUnit && <span className="text-[0.6em] align-top ml-0.5">°C</span>}
    </span>
  );
}

interface TemperatureRangeProps {
  min: number;
  max: number;
  className?: string;
}

export function TemperatureRange({ min, max, className }: TemperatureRangeProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-[var(--muted-foreground)]", className)}>
      <span className="text-blue-500">↓ {min}°</span>
      <span className="text-red-500">↑ {max}°</span>
    </div>
  );
}
