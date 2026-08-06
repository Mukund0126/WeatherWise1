import React from "react";
import { Card } from "@/components/ui/card";
import { Sun, Cloud, CloudSun, CloudRain, CloudDrizzle } from "lucide-react";

interface ForecastCardProps {
  type: "hourly" | "daily";
  timeOrDay: string;
  iconName: string;
  temp?: number;
  high?: number;
  low?: number;
  condition?: string;
}

export function ForecastCard({
  type,
  timeOrDay,
  iconName,
  temp,
  high,
  low,
  condition,
}: ForecastCardProps) {
  const getIcon = (sizeClass = "h-6 w-6") => {
    switch (iconName) {
      case "sun":
        return <Sun className={`${sizeClass} text-amber-500`} />;
      case "cloud-rain":
        return <CloudRain className={`${sizeClass} text-sky-500`} />;
      case "cloud-drizzle":
        return <CloudDrizzle className={`${sizeClass} text-sky-400`} />;
      case "cloud":
        return <Cloud className={`${sizeClass} text-slate-400`} />;
      case "cloud-sun":
      default:
        return <CloudSun className={`${sizeClass} text-sky-400`} />;
    }
  };

  if (type === "hourly") {
    return (
      <Card
        variant="default"
        className="p-4 flex flex-col items-center gap-3 min-w-[90px] border border-border/80 bg-card/60 hover:bg-card hover:border-primary/20 transition-all select-none text-center"
      >
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{timeOrDay}</span>
        <div className="p-1">{getIcon("h-7 w-7")}</div>
        <span className="text-sm font-bold text-foreground">{temp}°</span>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-card/40 border border-border/20 hover:border-primary/10 transition-all select-none gap-4">
      {/* Day */}
      <span className="w-16 text-sm font-bold text-foreground">{timeOrDay}</span>

      {/* Icon & Condition */}
      <div className="flex items-center gap-3 flex-1">
        {getIcon("h-5 w-5")}
        <span className="text-xs text-muted-foreground font-semibold hidden sm:inline-block">
          {condition}
        </span>
      </div>

      {/* High / Low Temperature */}
      <div className="flex items-center gap-3 text-xs sm:text-sm">
        <span className="w-8 text-right font-extrabold text-foreground">{high}°</span>
        <div className="w-12 sm:w-16 h-1 bg-muted rounded-full overflow-hidden relative hidden xs:block">
          <div className="absolute inset-y-0 left-1/4 right-1/4 bg-primary/50 rounded-full" />
        </div>
        <span className="w-8 text-left font-semibold text-slate-400">{low}°</span>
      </div>
    </div>
  );
}
export default ForecastCard;
