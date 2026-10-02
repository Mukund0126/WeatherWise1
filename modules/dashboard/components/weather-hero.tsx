import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Thermometer, ArrowUp, ArrowDown, Sun, CloudSun, Cloud, Heart } from "lucide-react";
import * as motion from "framer-motion/client";

interface WeatherHeroProps {
  city: string;
  temp: number;
  condition: string;
  feelsLike: number;
  high: number;
  low: number;
  icon: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function WeatherHero({
  city,
  temp,
  condition,
  feelsLike,
  high,
  low,
  icon,
  isFavorite = false,
  onToggleFavorite,
}: WeatherHeroProps) {
  const renderWeatherIcon = () => {
    switch (icon) {
      case "sun":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="text-amber-500"
          >
            <Sun className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
          </motion.div>
        );
      case "cloud":
        return (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-slate-400"
          >
            <Cloud className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_0_12px_rgba(148,163,184,0.2)]" />
          </motion.div>
        );
      case "cloud-sun":
      default:
        return (
          <div className="relative text-sky-400">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <CloudSun className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_0_12px_rgba(14,165,233,0.2)]" />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <Card
      variant="default"
      className="p-6 sm:p-8 border border-border shadow-lg bg-card/60 relative overflow-hidden select-none"
    >
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Weather
            </span>
            <div className="flex items-center gap-3 mt-1">
              <Heading
                level="h2"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
              >
                {city}
              </Heading>
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    isFavorite
                      ? "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 scale-105 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                  }`}
                  title={isFavorite ? "Remove from favorite cities" : "Save as favorite city"}
                  aria-label={isFavorite ? "Remove from favorite cities" : "Save as favorite city"}
                >
                  <Heart className={`h-5 w-5 transition-transform active:scale-125 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-foreground">
              {temp}°
            </span>
            <span className="text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400">
              {condition}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Thermometer className="h-4 w-4 text-slate-400" />
              <span>
                {"Feels like "}
                <strong className="text-foreground font-semibold">{feelsLike}°</strong>
              </span>
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4 text-danger" />
              <span>
                {"High: "}
                <strong className="text-foreground font-semibold">{high}°</strong>
              </span>
            </span>
            <span className="flex items-center gap-1">
              <ArrowDown className="h-4 w-4 text-primary" />
              <span>
                {"Low: "}
                <strong className="text-foreground font-semibold">{low}°</strong>
              </span>
            </span>
          </div>
        </div>

        {/* Visual Weather Animation */}
        <div className="flex-shrink-0 self-center sm:self-auto p-4 bg-background/50 rounded-2xl border border-border/40 backdrop-blur-md shadow-sm">
          {renderWeatherIcon()}
        </div>
      </div>
    </Card>
  );
}
export default WeatherHero;
