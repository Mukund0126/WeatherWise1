import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Sunrise,
  Sunset,
  Moon,
  Gauge,
  Eye,
  Sun,
  Activity,
  Thermometer,
} from "lucide-react";

interface HighlightCardProps {
  name: string;
  value: string;
  description: string;
}

export function HighlightCard({
  name,
  value,
  description,
}: HighlightCardProps) {
  const getIcon = () => {
    switch (name) {
      case "Sunrise":
        return <Sunrise className="h-5 w-5 text-amber-500" />;
      case "Sunset":
        return <Sunset className="h-5 w-5 text-orange-500" />;
      case "Moon Phase":
        return <Moon className="h-5 w-5 text-indigo-400" />;
      case "Atmospheric Pressure":
        return <Gauge className="h-5 w-5 text-emerald-500" />;
      case "Visibility Range":
        return <Eye className="h-5 w-5 text-sky-500" />;
      case "UV Gauge":
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case "Air Quality Index":
        return <Activity className="h-5 w-5 text-rose-500" />;
      case "Thermal Sensation":
      default:
        return <Thermometer className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card
      variant="default"
      className="p-5 border border-border bg-card/40 hover:bg-card/70 transition-all select-none"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-1.5 rounded-lg bg-background border border-border/40 flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">
          {name}
        </span>
      </div>

      <div className="space-y-1">
        <Heading
          level="h4"
          className="text-base sm:text-lg font-bold text-foreground tracking-tight"
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
  );
}
export default HighlightCard;
