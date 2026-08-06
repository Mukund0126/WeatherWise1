import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Sparkles, Navigation, Dumbbell, Camera, Sun } from "lucide-react";

interface RecommendationCardProps {
  score: number;
  text: string;
  bullets: string[];
  metrics: {
    outdoorComfort: string;
    travel: string;
    exercise: string;
    photography: string;
  };
}

export function RecommendationCard({
  score,
  text,
  bullets,
  metrics,
}: RecommendationCardProps) {
  return (
    <Card
      variant="glass"
      className="p-6 md:p-8 border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background relative overflow-hidden shadow-md select-none"
    >
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-sans">
              {"Today's Weather Intelligence"}
            </span>
          </div>

          <div>
            <Heading
              level="h3"
              className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-foreground"
            >
              {text}
            </Heading>
            <ul className="space-y-1.5">
              {bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Score Ring / Block */}
        <div className="flex items-center gap-4 bg-background/60 dark:bg-card/60 backdrop-blur-md px-5 py-4 rounded-2xl border border-border/40 shadow-sm flex-shrink-0 w-full md:w-auto">
          <div className="h-12 w-12 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-lg">
            {score}
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Weather Score
            </span>
            <span className="font-bold text-sm text-foreground">
              {score >= 9
                ? "Excellent Conditions"
                : score >= 7
                ? "Very Good"
                : "Fair Conditions"}
            </span>
          </div>
        </div>
      </div>

      {/* Comfort Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/40">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Sun className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block leading-none">
              Outdoor Comfort
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground mt-1.5 block">
              {metrics.outdoorComfort}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Navigation className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block leading-none">
              Travel
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground mt-1.5 block">
              {metrics.travel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Dumbbell className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block leading-none">
              Exercise
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground mt-1.5 block">
              {metrics.exercise}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Camera className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block leading-none">
              Photography
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground mt-1.5 block">
              {metrics.photography}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
export default RecommendationCard;
