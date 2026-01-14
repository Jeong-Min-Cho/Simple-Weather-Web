import { memo } from "react";
import { cn } from "@/shared/lib/cn";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  type LucideIcon,
} from "lucide-react";

interface WeatherIconProps {
  icon: string;
  condition: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

// icon 코드: "01d", "01n", "02d", "03d", "09d", "10d", "11d", "13d", "50d" 등
const iconMap: Record<string, LucideIcon> = {
  "01d": Sun,
  "01n": Moon,
  "02d": CloudSun,
  "02n": CloudMoon,
  "03d": Cloud,
  "03n": Cloud,
  "04d": Cloud,
  "04n": Cloud,
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,
  "10d": CloudRain,
  "10n": CloudRain,
  "11d": CloudLightning,
  "11n": CloudLightning,
  "13d": CloudSnow,
  "13n": CloudSnow,
  "50d": CloudFog,
  "50n": CloudFog,
};

const colorMap: Record<string, string> = {
  "01d": "text-yellow-500",
  "01n": "text-slate-300",
  "02d": "text-yellow-400",
  "02n": "text-slate-400",
  "03d": "text-gray-400",
  "03n": "text-gray-500",
  "04d": "text-gray-500",
  "04n": "text-gray-600",
  "09d": "text-blue-400",
  "09n": "text-blue-500",
  "10d": "text-blue-500",
  "10n": "text-blue-600",
  "11d": "text-purple-500",
  "11n": "text-purple-600",
  "13d": "text-cyan-300",
  "13n": "text-cyan-400",
  "50d": "text-gray-400",
  "50n": "text-gray-500",
};

export const WeatherIcon = memo(function WeatherIcon({
  icon,
  condition,
  size = "md",
  className,
}: WeatherIconProps) {
  const IconComponent = iconMap[icon] || Sun;
  const colorClass = colorMap[icon] || "text-gray-500";

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        sizeMap[size],
        className
      )}
      title={condition}
      role="img"
      aria-label={`날씨: ${condition}`}
    >
      <IconComponent className={cn("w-full h-full", colorClass)} aria-hidden="true" />
    </div>
  );
});
