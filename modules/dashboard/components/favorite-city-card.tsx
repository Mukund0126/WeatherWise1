import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Sun, Cloud, CloudSun, CloudRain, Trash2 } from "lucide-react";
import * as motion from "framer-motion/client";

interface FavoriteCityCardProps {
  name: string;
  temp: number;
  condition: string;
  icon: string;
  onClick?: () => void;
  onRemove?: () => void;
}

export function FavoriteCityCard({
  name,
  temp,
  condition,
  icon,
  onClick,
  onRemove,
}: FavoriteCityCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "sun":
        return <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />;
      case "cloud-rain":
        return <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-sky-500" />;
      case "cloud":
        return <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />;
      case "cloud-sun":
      default:
        return <CloudSun className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400" />;
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="cursor-pointer h-full group"
      onClick={onClick}
    >
      <Card
        variant="default"
        className="p-4 sm:p-5 flex items-center justify-between border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all select-none h-full relative"
      >
        <div className="space-y-1 pr-2">
          <Heading
            level="h4"
            className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors"
          >
            {name}
          </Heading>
          <Text
            variant="secondary"
            size="xs"
            className="text-slate-500 text-[10px] sm:text-xs"
          >
            {condition}
          </Text>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-background border border-border/40 rounded-xl flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-foreground tracking-tighter">
            {temp}°
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemoveClick}
              className="ml-1 p-1.5 rounded-lg text-slate-400 opacity-60 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
              title={`Remove ${name} from favorites`}
              aria-label={`Remove ${name} from favorites`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
export default FavoriteCityCard;
