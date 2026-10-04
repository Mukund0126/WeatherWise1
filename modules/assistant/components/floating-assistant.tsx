/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWeatherStore } from "@/modules/weather/store/weather.store";
import { Text } from "@/components/ui/text";
import {
  BrainCircuit,
  Send,
  User,
  Minimize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export function FloatingAssistant() {
  const { currentWeather, fetchWeather } = useWeatherStore();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize with welcome message
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      sender: "assistant",
      text: `Hello! I am your WeatherWise AI Companion. Ask me anything about current weather, outdoor activities, clothing advice, or speak commands like "Weather in Tokyo"!`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          if (transcript) {
            handleVoiceInput(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    const city = currentWeather?.hero.city || "your location";
    const temp = currentWeather?.hero.temp !== undefined ? `${currentWeather.hero.temp}°C` : "";
    const cond = currentWeather?.hero.condition || "";

    if (q.includes("rain") || q.includes("umbrella") || q.includes("wet")) {
      const isRainy = cond.toLowerCase().includes("rain") || cond.toLowerCase().includes("drizzle") || cond.toLowerCase().includes("shower");
      if (isRainy) {
        return `Yes, it is currently ${cond} in ${city} (${temp}). I highly recommend carrying an umbrella or a rain jacket!`;
      }
      const willRain = currentWeather?.dailyForecast?.some(d => d.condition.toLowerCase().includes("rain"));
      if (willRain) {
        return `It's not raining right now in ${city}, but the forecast indicates rain later today. Carrying an umbrella is a great idea!`;
      }
      return `There is no rain in the immediate forecast for ${city}. Current conditions are ${cond || "clear"} at ${temp}. You won't need an umbrella!`;
    }

    if (q.includes("cloth") || q.includes("wear") || q.includes("jacket") || q.includes("coat")) {
      const t = currentWeather?.hero.temp;
      if (t !== undefined) {
        if (t < 15) {
          return `It's chilly in ${city} at ${temp}. Wear a warm coat or sweater and long trousers.`;
        } else if (t > 28) {
          return `It's warm in ${city} (${temp}). Light breathable clothes, sunglasses, and sunscreen are best today!`;
        } else {
          return `The temperature in ${city} is a comfortable ${temp}. A light jacket or long-sleeve shirt is ideal.`;
        }
      }
      return `Dressing in light layers is safe unless it's cold or raining!`;
    }

    if (q.includes("run") || q.includes("exercise") || q.includes("cricket") || q.includes("play") || q.includes("outdoor")) {
      const score = currentWeather?.recommendation.score || 5;
      const text = currentWeather?.recommendation.text || "";
      if (score >= 7) {
        return `It's a fantastic day for outdoor activities in ${city}! Comfort score: ${score}/10. ${text}`;
      } else if (score >= 4) {
        return `Conditions are moderate for outdoors in ${city} (Score: ${score}/10). ${text}`;
      } else {
        return `I'd advise staying indoors or delaying outdoor plans in ${city}. Comfort score is low (${score}/10). ${text}`;
      }
    }

    if (q.includes("temp") || q.includes("hot") || q.includes("cold") || q.includes("weather")) {
      if (currentWeather) {
        return `Currently in ${city}, the weather is ${cond} with a temperature of ${temp} (feels like ${currentWeather.hero.feelsLike}°C). Today's range is ${currentWeather.hero.low}°C to ${currentWeather.hero.high}°C.`;
      }
      return `I can't access live metrics right now, but please double-check the dashboard once loaded!`;
    }

    const responses = [
      `For ${city}, the current condition is ${cond || "stable"} at ${temp || "ambient temperature"}. Ask me for clothing advice or outdoor safety tips anytime!`,
      `Air comfort in ${city} is currently rated as "${currentWeather?.recommendation.metrics.outdoorComfort || "Fair"}". Feel free to ask more specific questions!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const findMetric = (keyword: string) =>
        currentWeather?.metrics?.find((m) =>
          m.name.toLowerCase().includes(keyword.toLowerCase())
        )?.value;

      const weatherContext = currentWeather
        ? {
            city: currentWeather.hero.city,
            temp: currentWeather.hero.temp,
            feelsLike: currentWeather.hero.feelsLike,
            condition: currentWeather.hero.condition,
            humidity: findMetric("humidity"),
            windSpeed: findMetric("wind"),
            uvIndex: findMetric("uv"),
            high: currentWeather.hero.high,
            low: currentWeather.hero.low,
            recommendationScore: currentWeather.recommendation.score,
            forecastSummary: currentWeather.dailyForecast
              ?.slice(0, 4)
              .map((d) => `${d.day}: ${d.condition}, ${d.high}°C/${d.low}°C`)
              .join("; "),
          }
        : undefined;

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, weatherContext }),
      });

      const data = await res.json();
      let aiResponseText = "";

      if (res.ok && data.answer) {
        aiResponseText = data.answer;
      } else {
        aiResponseText = generateAIResponse(text);
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackText = generateAIResponse(text);
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: fallbackText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Speech-to-Text Input & Voice City Search
  const handleVoiceInput = (transcript: string) => {
    const trimmed = transcript.trim();
    if (!trimmed) return;

    // Check for Voice Weather Search Commands (e.g. "weather in Tokyo", "search for London", "show Paris")
    const searchPattern = /^(?:weather (?:in|for)|search (?:for|city)|show (?:weather for|weather in|me))\s+(.+)/i;
    const match = trimmed.match(searchPattern);

    if (match && match[1]) {
      const cityName = match[1].replace(/[?.!]/g, "").trim();
      if (cityName) {
        fetchWeather(cityName);
        const confirmMsg: Message = {
          id: String(Date.now()),
          sender: "user",
          text: `Voice Command: Weather for ${cityName}`,
          timestamp: new Date(),
        };
        const assistantMsg: Message = {
          id: String(Date.now() + 1),
          sender: "assistant",
          text: `Searching live weather forecast for ${cityName}...`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMsg, assistantMsg]);
        return;
      }
    }

    // Standard AI question via Voice
    handleSendMessage(trimmed);
  };

  const toggleMicListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech synthesis
  const speakMessage = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
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
                    <span className="text-[10px] font-semibold text-muted-foreground">Voice AI Ready</span>
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
                const isSpeaking = speakingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs select-none ${
                        isUser
                          ? "bg-primary text-primary-foreground font-bold"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isUser ? <User className="h-3.5 w-3.5" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed relative group ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted/60 text-foreground border border-border/30 rounded-tl-none"
                        }`}
                      >
                        {msg.text}

                        {/* Text-to-Speech audio button on AI messages */}
                        {!isUser && (
                          <button
                            onClick={() => speakMessage(msg.id, msg.text)}
                            className={`ml-2 p-1 rounded-full transition-all cursor-pointer inline-flex items-center align-middle ${
                              isSpeaking
                                ? "text-primary bg-primary/20 animate-pulse"
                                : "text-muted-foreground/60 hover:text-primary hover:bg-primary/10"
                            }`}
                            title={isSpeaking ? "Stop speaking" : "Listen to audio response"}
                            aria-label={isSpeaking ? "Stop speaking" : "Listen to audio response"}
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Volume2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
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

            {/* Input Bar with Voice Controls */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border bg-background flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={isListening ? "Listening for speech..." : "Ask weather or speak command..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                className={`flex-1 h-9 px-3 rounded-lg border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                  isListening
                    ? "border-rose-500/60 ring-1 ring-rose-500/40 bg-rose-500/5 placeholder:text-rose-500/80 font-medium"
                    : "border-border focus:ring-primary/40 focus:border-primary/40"
                }`}
              />

              {/* Speech-to-Text Mic Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleMicListening}
                  className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                  title={isListening ? "Stop listening" : "Click to speak voice question"}
                  aria-label={isListening ? "Stop listening" : "Click to speak voice question"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}

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
