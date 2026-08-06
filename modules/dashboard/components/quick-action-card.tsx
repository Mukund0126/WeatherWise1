import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Sparkles, Calendar, Search, Heart, CalendarDays } from "lucide-react";
import * as motion from "framer-motion/client";

interface QuickActionCardProps {
  actionName: string;
  description: string;
  onClick: () => void;
}

export function QuickActionCard({
  actionName,
  description,
  onClick,
}: QuickActionCardProps) {
  const getIcon = () => {
    switch (actionName) {
      case "Ask AI":
        return <Sparkles className="h-5 w-5 text-primary" />;
      case "Plan Event":
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case "Search City":
        return <Search className="h-5 w-5 text-sky-500" />;
      case "Favorite Cities":
        return <Heart className="h-5 w-5 text-rose-500" />;
      case "View Forecast":
      default:
        return <CalendarDays className="h-5 w-5 text-emerald-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full"
      onClick={onClick}
    >
      <Card
        variant="default"
        className="p-5 flex items-start gap-4 border border-border bg-card hover:bg-card/90 transition-all select-none h-full"
      >
        <div className="p-2.5 rounded-xl bg-background border border-border/40 flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div className="space-y-0.5">
          <Heading level="h4" className="text-xs sm:text-sm font-bold text-foreground">
            {actionName}
          </Heading>
          <Text
            variant="secondary"
            size="xs"
            className="text-slate-500 text-[10px] sm:text-xs line-clamp-2"
          >
            {description}
          </Text>
        </div>
      </Card>
    </motion.div>
  );
}
export default QuickActionCard;
