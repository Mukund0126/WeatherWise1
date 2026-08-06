import React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface GreetingCardProps {
  userName: string;
  weatherSummary: string;
  dateString: string;
}

export function GreetingCard({
  userName,
  weatherSummary,
  dateString,
}: GreetingCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col gap-1 md:gap-1.5 select-none">
      <Heading
        level="h2"
        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
      >
        {getGreeting()}, {userName}
      </Heading>
      <Text
        variant="secondary"
        size="md"
        className="max-w-xl text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
      >
        {weatherSummary}
      </Text>
      <Text
        variant="secondary"
        size="xs"
        className="font-semibold text-primary/80 tracking-wider uppercase mt-0.5"
      >
        {dateString}
      </Text>
    </div>
  );
}
export default GreetingCard;
