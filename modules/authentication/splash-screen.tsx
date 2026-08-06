"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/common/logo";
import { Spinner } from "@/components/ui/spinner";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 select-none"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading application"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Logo size="xl" showText={true} />
        </motion.div>
        
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground text-base sm:text-lg font-medium tracking-wide text-center"
        >
          AI-Powered Weather Intelligence
        </motion.span>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-2"
        >
          <Spinner size="md" />
        </motion.div>
      </div>
    </motion.div>
  );
}
export default SplashScreen;
