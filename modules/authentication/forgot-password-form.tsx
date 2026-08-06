"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { AnimatedFade } from "@/components/ui/animated-fade";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate reset link dispatch
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <AnimatedFade className="w-full max-w-md mx-auto">
        <Card
          variant="default"
          className="p-8 shadow-lg border-border bg-card text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <Heading level="h2" className="text-2xl font-bold mb-2">
            Check your email
          </Heading>
          <Text
            variant="secondary"
            className="mb-6 text-sm leading-relaxed text-slate-500"
          >
            {"We've sent a password reset link to "}
            <span className="font-semibold text-foreground">{email}</span>.
            Please check your inbox and spam folders.
          </Text>

          <Link href={ROUTES.LOGIN} passHref>
            <Button variant="primary" fullWidth>
              Back to Sign In
            </Button>
          </Link>
        </Card>
      </AnimatedFade>
    );
  }

  return (
    <AnimatedFade className="w-full max-w-md mx-auto">
      <Card variant="default" className="p-8 shadow-lg border-border bg-card">
        <div className="flex flex-col items-center text-center mb-6">
          <Heading level="h2" className="text-2xl font-bold mb-1">
            Reset password
          </Heading>
          <Text variant="secondary" size="sm">
            {"Enter your email and we'll send you instructions to reset your password."}
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leadingIcon={<Mail className="h-4.5 w-4.5" />}
            disabled={isLoading}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </Card>
    </AnimatedFade>
  );
}
export default ForgotPasswordForm;
