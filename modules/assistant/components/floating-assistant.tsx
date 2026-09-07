/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWeatherStore } from "@/modules/weather/store/weather.store";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BrainCircuit,
  X,
  Send,
  MessageSquare,
  User,
  Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export function FloatingAssistant() {
  const { currentWeather } = useWeatherStore();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize with welcome message directly to avoid useEffect setState
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      sender: "assistant",
      text: `Hello! I am your WeatherWise AI Companion. Ask me anything about the current weather conditions, outdoor activities, clothing recommendations, or travel safety!`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    const city = currentWeather?.hero.city || "your location";
    const temp = currentWeather?.hero.temp !== undefined ? `${currentWeather.hero.temp}°C` : "";
    const cond = currentWeather?.hero.condition || "";

    // Context-aware dynamic responses
    if (q.includes("rain") || q.includes("umbrella") || q.includes("wet")) {
      const isRainy = cond.toLowerCase().includes("rain") || cond.toLowerCase().includes("drizzle") || cond.toLowerCase().includes("shower");
      if (isRainy) {
        return `Yes, it is currently ${cond} in ${city} (${temp}). I highly recommend carrying an umbrella or a rain jacket if you go outside!`;
      }
      // Check forecast
      const willRain = currentWeather?.dailyForecast?.some(d => d.condition.toLowerCase().includes("rain"));
      if (willRain) {
        return `It's not raining right now in ${city}, but the forecast indicates rain is expected later. It would be wise to carry an umbrella just in case!`;
      }
      return `There is no rain in the immediate forecast for ${city}. Current conditions are ${cond || "clear"} with a temperature of ${temp}. You probably don't need an umbrella!`;
    }

    if (q.includes("cloth") || q.includes("wear") || q.includes("jacket") || q.includes("coat")) {
      const t = currentWeather?.hero.temp;
      if (t !== undefined) {
        if (t < 15) {
          return `It's quite chilly in ${city} at ${temp}. I recommend layering up with a warm jacket or sweater and long pants.`;
        } else if (t > 28) {
          return `It's warm in ${city} (${temp}). Light cotton clothing, sunglasses, and sunscreen are your best choice today!`;
        } else {
          return `The temperature in ${city} is a comfortable ${temp}. A light t-shirt or a long-sleeve shirt with jeans should be perfect.`;
        }
      }
      return `I'd suggest checking the current temperature, but generally dressing in light, breathable layers is safe unless it's cold or raining!`;
    }

    if (q.includes("run") || q.includes("exercise") || q.includes("cricket") || q.includes("play") || q.includes("outdoor")) {
      const score = currentWeather?.recommendation.score || 5;
      const text = currentWeather?.recommendation.text || "";
      if (score >= 7) {
        return `It's a fantastic day for outdoor activities in ${city}! The recommendation score is ${score}/10. ${text}`;
      } else if (score >= 4) {
        return `Conditions are moderate for outdoors in ${city} (Score: ${score}/10). ${text}`;
      } else {
        return `I'd advise staying indoors or delaying outdoor plans in ${city}. The comfort score is low (${score}/10). ${text}`;
      }
    }

    if (q.includes("temp") || q.includes("hot") || q.includes("cold") || q.includes("weather")) {
      if (currentWeather) {
        return `Currently in ${city}, the weather is ${cond} with a temperature of ${temp} (feels like ${currentWeather.hero.feelsLike}°C). Today's range is ${currentWeather.hero.low}°C to ${currentWeather.hero.high}°C.`;
      }
      return `I can't access the live metrics right now, but please double-check the dashboard once it loads!`;
    }

    // Default responses
    const responses = [
      `That's an interesting question! For ${city}, the current condition is ${cond || "stable"} at ${temp || "ambient temperature"}. Let me know if you want clothing advice or outdoor safety tips.`,
      `I've analyzed the meteorological models for ${city}. The air comfort is currently rated as "${currentWeather?.recommendation.metrics.outdoorComfort || "Fair"}". Feel free to ask more specific questions!`,
      `Atmospheric pressure is stable in ${city}. If you're planning any trips or events, let me know so I can look up the safety metrics!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAIResponse(text);
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const quickPrompts = [
    "Should I carry an umbrella?",
    "Is it good for a run?",
    "What should I wear today?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] flex flex-col rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BrainCircuit className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div>
                  <Text className="font-bold text-xs text-foreground leading-none">
                    WeatherWise Copilot
                  </Text>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-semibold text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                aria-label="Close assistant"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs select-none ${isUser
                          ? "bg-primary text-primary-foreground font-bold"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {isUser ? <User className="h-3.5 w-3.5" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted/60 text-foreground border border-border/30 rounded-tl-none"
                          }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 block px-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Thinking Indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5 mr-auto max-w-[85%]">
                  <div className="h-7 w-7 rounded-full flex-shrink-0 bg-muted text-muted-foreground flex items-center justify-center">
                    <BrainCircuit className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-muted/40 border border-border/20 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 bg-card">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border bg-background flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about weather, clothing, activities..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center disabled:opacity-40 cursor-pointer transition-colors"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 flex items-center justify-center cursor-pointer transition-shadow"
        aria-label="Toggle assistant chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center relative"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default FloatingAssistant;
