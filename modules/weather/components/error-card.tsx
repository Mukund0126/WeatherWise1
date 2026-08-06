import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff, Key, SearchCode } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";

interface ErrorCardProps {
  message: string;
  type?: string;
  onRetry: () => void;
}

export function ErrorCard({ message, type, onRetry }: ErrorCardProps) {
  const isNoInternet =
    type === "NETWORK_ERROR" || message.toLowerCase().includes("network");
  const isAuthError = type === "AUTH_ERROR";
  const isCityNotFound = type === "CITY_NOT_FOUND";

  return (
    <PageContainer size="lg" className="py-12 flex justify-center items-center">
      <Card
        variant="default"
        className="p-8 max-w-md w-full border-danger/25 bg-gradient-to-br from-danger/5 via-card to-background shadow-lg text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-danger/10 text-danger flex items-center justify-center">
            {isNoInternet ? (
              <WifiOff className="h-7 w-7" />
            ) : isAuthError ? (
              <Key className="h-7 w-7 text-warning" />
            ) : isCityNotFound ? (
              <SearchCode className="h-7 w-7" />
            ) : (
              <AlertCircle className="h-7 w-7" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Heading
            level="h3"
            className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
          >
            {isNoInternet
              ? "Connection Lost"
              : isAuthError
              ? "Configuration Required"
              : isCityNotFound
              ? "Location Not Found"
              : "Weather Engine Error"}
          </Heading>
          <Text
            variant="secondary"
            size="sm"
            className="text-slate-500 leading-relaxed text-xs sm:text-sm"
          >
            {message}
          </Text>
        </div>

        <div className="pt-2">
          <Button
            onClick={onRetry}
            variant="primary"
            size="md"
            className="w-full flex items-center justify-center gap-2 h-11"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}

export default ErrorCard;
