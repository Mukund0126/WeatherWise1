"use client";

import React, { useState } from "react";
import { SplashScreen } from "@/modules/authentication/splash-screen";
import { WelcomeScreen } from "@/modules/authentication/welcome-screen";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <WelcomeScreen key="welcome" />
      )}
    </AnimatePresence>
  );
}
