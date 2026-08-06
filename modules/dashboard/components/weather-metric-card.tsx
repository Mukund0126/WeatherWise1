import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Droplets, Wind, Gauge, Eye, Sun, Activity } from "lucide-react";
import * as motion from "framer-motion/client";

interface WeatherMetricCardProps {
  iconName: string;
  name: string;
  value: string;
  description: string;
}

export function WeatherMetricCard({
  iconName,
  name,
  value,
  description,
}: WeatherMetricCardProps) {
  const getIcon = () => {
    switch (iconName) {
      case "droplets":
        return <Droplets className="h-5 w-5 text-sky-500" />;
      case "wind":
        return <Wind className="h-5 w-5 text-indigo-500" />;
      case "gauge":
        return <Gauge className="h-5 w-5 text-emerald-500" />;
      case "eye":
        return <Eye className="h-5 w-5 text-amber-500" />;
      case "sun":
        return <Sun className="h-5 w-5 text-orange-500" />;
      case "activity":
      default:
        return <Activity className="h-5 w-5 text-rose-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        variant="default"
        className="p-5 flex flex-col justify-between h-full border border-border/80 bg-card hover:bg-card/90 transition-colors select-none group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {name}
          </span>
          <div className="p-2 rounded-xl bg-muted/40 group-hover:bg-primary/5 transition-all">
            {getIcon()}
          </div>
        </div>

        <div className="space-y-1">
          <Heading
            level="h4"
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground"
          >
            {value}
          </Heading>
          <Text
            variant="secondary"
            size="xs"
            className="text-slate-500 text-[10px] sm:text-xs"
          >
            {description}
          </Text>
        </div>
      </Card>
    </motion.div>
  );
}
export default WeatherMetricCard;
