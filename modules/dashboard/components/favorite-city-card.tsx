import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Sun, Cloud, CloudSun, CloudRain } from "lucide-react";
import * as motion from "framer-motion/client";

interface FavoriteCityCardProps {
  name: string;
  temp: number;
  condition: string;
  icon: string;
  onClick?: () => void;
}

export function FavoriteCityCard({
  name,
  temp,
  condition,
  icon,
  onClick,
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

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="cursor-pointer h-full"
      onClick={onClick}
    >
      <Card
        variant="default"
        className="p-5 flex items-center justify-between border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all select-none h-full"
      >
        <div className="space-y-1">
          <Heading
            level="h4"
            className="text-sm sm:text-base font-bold text-foreground"
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

        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-background border border-border/40 rounded-xl flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-foreground tracking-tighter">
            {temp}°
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
export default FavoriteCityCard;
