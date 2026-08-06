"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ROUTES } from "@/constants/routes";
import { AnimatedFade } from "@/components/ui/animated-fade";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Compute password strength directly during render
  let passwordStrength = 0;
  let strengthLabel = "";
  if (password) {
    if (password.length >= 8) passwordStrength++;
    if (/[A-Z]/.test(password)) passwordStrength++;
    if (/[0-9]/.test(password)) passwordStrength++;
    if (/[^A-Za-z0-9]/.test(password)) passwordStrength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    strengthLabel = labels[passwordStrength] || "Very Weak";
  }

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validate()) return;

    setIsLoading(true);
    // Simulate API registration call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitMessage({
        type: "success",
        text: "Account created successfully! (Simulated registration)",
      });
      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  const strengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-danger";
      case 2:
        return "bg-warning";
      case 3:
        return "bg-primary";
      case 4:
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  return (
    <AnimatedFade className="w-full max-w-md mx-auto">
      <Card variant="default" className="p-8 shadow-lg border-border bg-card">
        <div className="flex flex-col items-center text-center mb-6">
          <Heading level="h2" className="text-2xl font-bold mb-1">
            Create an account
          </Heading>
          <Text variant="secondary" size="sm">
            Get started with your WeatherWise account
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
            label="Full Name"
            type="text"
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            leadingIcon={<User className="h-4.5 w-4.5" />}
            disabled={isLoading}
            required
            autoComplete="name"
          />

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
            <Input
              label="Password"
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
            />

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span
                    className={
                      passwordStrength <= 1
                        ? "text-danger"
                        : passwordStrength === 2
                        ? "text-warning"
                        : passwordStrength === 3
                        ? "text-primary"
                        : "text-success"
                    }
                  >
                    {strengthLabel}
                  </span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        step <= passwordStrength
                          ? strengthColor(passwordStrength)
                          : "bg-muted-foreground/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leadingIcon={<Lock className="h-4.5 w-4.5" />}
            trailingIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-foreground cursor-pointer focus:outline-none flex items-center justify-center h-full"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            }
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center mt-6">
          <Text variant="secondary" size="sm">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="text-primary font-bold hover:underline"
            >
              Sign In
            </Link>
          </Text>
        </div>
      </Card>
    </AnimatedFade>
  );
}
export default SignupForm;
