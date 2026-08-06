"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ROUTES } from "@/constants/routes";
import { AnimatedFade } from "@/components/ui/animated-fade";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validate()) return;

    setIsLoading(true);
    // Simulate authentication api call
    setTimeout(() => {
      setIsLoading(false);
      if (email === "user@weatherwise.com" && password === "password123") {
        setSubmitMessage({
          type: "success",
          text: "Login successful! Redirecting to dashboard...",
        });
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD);
        }, 800);
      } else {
        setSubmitMessage({
          type: "error",
          text: "Invalid email or password. Hint: user@weatherwise.com / password123",
        });
      }
    }, 1500);
  };

  return (
    <AnimatedFade className="w-full max-w-md mx-auto">
      <Card variant="default" className="p-8 shadow-lg border-border bg-card">
        <div className="flex flex-col items-center text-center mb-6">
          <Heading level="h2" className="text-2xl font-bold mb-1">
            Welcome back
          </Heading>
          <Text variant="secondary" size="sm">
            Enter your credentials to access WeatherWise
          </Text>
        </div>

        {submitMessage && (
          <Alert
            variant={submitMessage.type === "success" ? "success" : "error"}
            className="mb-5"
          >
            {submitMessage.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leadingIcon={<Mail className="h-4.5 w-4.5" />}
            disabled={isLoading}
            required
            autoComplete="email"
          />

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-foreground select-none cursor-pointer"
              >
                Password
              </label>
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leadingIcon={<Lock className="h-4.5 w-4.5" />}
                trailingIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-foreground cursor-pointer focus:outline-none flex items-center justify-center h-full"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                }
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1 select-none">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              disabled={isLoading}
            />
            <label
              htmlFor="remember"
              className="text-xs text-muted-foreground cursor-pointer font-medium"
            >
              Remember me for 30 days
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <Divider label="Or continue with" className="my-6" />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            type="button"
            className="relative group bg-card"
            disabled
          >
            <span className="text-sm">Google</span>
            <Badge
              variant="outline"
              className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 border-primary/20 bg-primary/5 text-primary"
            >
              Soon
            </Badge>
          </Button>
          <Button
            variant="outline"
            type="button"
            className="relative group bg-card"
            disabled
          >
            <span className="text-sm">GitHub</span>
            <Badge
              variant="outline"
              className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 border-primary/20 bg-primary/5 text-primary"
            >
              Soon
            </Badge>
          </Button>
        </div>

        <div className="text-center">
          <Text variant="secondary" size="sm">
            {"Don't have an account? "}
            <Link
              href={ROUTES.SIGNUP}
              className="text-primary font-bold hover:underline"
            >
              Create account
            </Link>
          </Text>
        </div>
      </Card>
    </AnimatedFade>
  );
}
export default LoginForm;
