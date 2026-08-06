"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ROUTES } from "@/constants/routes";
import { CloudSun, Sparkles, Navigation, ShieldCheck } from "lucide-react";
import { AnimatedFade } from "@/components/ui/animated-fade";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function WelcomeScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo size="sm" showText={true} />
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Brand Text & CTA Buttons */}
          <AnimatedFade className="flex flex-col text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-max mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Version 1.0 (Beta)</span>
            </div>

            <Heading
              level="h1"
              className="mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]"
            >
              Weather Intelligence, <br />
              <span className="text-primary font-sans">
                Not Just Weather Information.
              </span>
            </Heading>

            <Text
              variant="secondary"
              size="lg"
              className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400"
            >
              WeatherWise helps users make smarter daily decisions by combining
              real-time weather information with AI-powered recommendations.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ROUTES.LOGIN} passHref className="flex-1 sm:flex-initial">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto sm:px-10"
                >
                  Login
                </Button>
              </Link>
              <Link href={ROUTES.SIGNUP} passHref className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto sm:px-10 bg-card"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </AnimatedFade>

          {/* Right Side: Subtle layout illustration (Desktop Only) */}
          <AnimatedFade delay={0.2} className="hidden lg:block">
            <Card
              variant="glass"
              className="p-8 border-border/80 flex flex-col gap-6 relative overflow-hidden shadow-xl bg-gradient-to-tr from-card to-background"
            >
              {/* Glowing decorative lights */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-success/5 blur-3xl" />

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CloudSun className="h-6 w-6" />
                </div>
                <div>
                  <Heading level="h4">WeatherWise Intelligence</Heading>
                  <Text variant="secondary" size="sm">
                    Decision Support Engine
                  </Text>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-lg bg-background/50 border border-border/40">
                  <Navigation className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-sm block text-foreground">
                      Location-Aware Rules
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed mt-0.5 block">
                      Applies micro-climate datasets to coordinate with your
                      daily planner.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-lg bg-background/50 border border-border/40">
                  <Sparkles className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-sm block text-foreground">
                      AI Recommendations
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed mt-0.5 block">
                      Instant advisory alerts that help schedule travel or events
                      safely.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-lg bg-background/50 border border-border/40">
                  <ShieldCheck className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-sm block text-foreground">
                      Premium Security Layer
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed mt-0.5 block">
                      High-performance environment utilizing local encryption
                      protocols.
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Mock Chart representation */}
              <div className="h-20 w-full rounded-lg border border-dashed border-border/60 flex items-center justify-center bg-muted/20 select-none">
                <span className="text-xs text-muted-foreground/60 font-medium">
                  Dashboard Analytics Preview (Sprint 2)
                </span>
              </div>
            </Card>
          </AnimatedFade>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50 text-center">
        <Text variant="secondary" size="xs">
          © {new Date().getFullYear()} WeatherWise. All rights reserved.
        </Text>
      </footer>
    </div>
  );
}
export default WelcomeScreen;
