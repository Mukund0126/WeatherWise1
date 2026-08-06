import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit } from "lucide-react";

interface AssistantPreviewProps {
  placeholder: string;
  defaultAnswer: string;
}

export function AssistantPreview({
  placeholder,
  defaultAnswer,
}: AssistantPreviewProps) {
  const [question, setQuestion] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState(defaultAnswer);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setCurrentQuestion(question);

    // Simulate AI thinking and response
    setTimeout(() => {
      setIsLoading(false);
      setDisplayedAnswer(
        `I've analyzed the meteorological trends for your request "${question}". The atmospheric conditions remain highly favorable today with comfortable humidity. Outdoor activities are highly recommended before the slight evening cloud cover.`
      );
      setQuestion("");
    }, 1200);
  };

  return (
    <Card
      variant="glass"
      className="p-6 md:p-8 border-primary/20 bg-gradient-to-br from-background via-card to-primary/5 relative overflow-hidden shadow-md select-none"
    >
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-6">
        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <BrainCircuit className="h-4 w-4 animate-pulse" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary font-sans">
          AI Assistant Preview
        </span>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all disabled:opacity-50"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          size="sm"
          className="h-10 px-4"
        >
          Ask AI
        </Button>
      </form>

      {/* Answer Area */}
      <div className="p-4 rounded-xl bg-background/50 border border-border/40 backdrop-blur-sm relative">
        <div className="absolute top-3 left-4 flex items-center gap-1 text-primary text-[9px] font-bold uppercase tracking-wider">
          <Sparkles className="h-3 w-3" />
          <span>Response</span>
        </div>

        <div className="mt-4 min-h-[48px]">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
              <span className="ml-1 text-[11px] font-medium text-slate-500">
                AI is analyzing forecast models...
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {currentQuestion && (
                <Text
                  variant="secondary"
                  size="xs"
                  className="font-semibold italic text-slate-400 block text-[10px]"
                >
                  {"Q: \""}{currentQuestion}{"\""}
                </Text>
              )}
              <Text
                variant="primary"
                size="sm"
                className="leading-relaxed font-medium text-xs sm:text-sm text-foreground"
              >
                {displayedAnswer}
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
export default AssistantPreview;
