import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <PageContainer size="lg" className="py-6 space-y-10 animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2.5 w-full max-w-sm">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-3.5 w-1/2 rounded" />
        </div>
        <Skeleton className="h-11 w-full max-w-sm rounded-xl md:hidden" />
      </div>

      {/* Grid 1: Recommendation & Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex">
          <Card
            variant="glass"
            className="p-6 md:p-8 h-full w-full flex flex-col justify-between border-primary/10"
          >
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/40">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex">
          <Card
            variant="default"
            className="p-6 sm:p-8 h-full w-full flex flex-col justify-between border-border"
          >
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-12 w-1/2 rounded-xl" />
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-3.5 w-32 rounded" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </Card>
        </div>
      </div>

      {/* Grid 2: 6 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5 h-[130px] flex flex-col justify-between border-border">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-3.5 w-full rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Grid 3: Hourly, Daily & AI assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="p-4 min-w-[90px] h-[110px] flex flex-col items-center justify-between border-border"
                >
                  <Skeleton className="h-3 w-12 rounded" />
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-4 w-10 rounded" />
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3.5 rounded-xl border border-border/40"
                >
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <Card
            variant="glass"
            className="p-6 h-[220px] flex flex-col justify-between border-primary/10"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default DashboardSkeleton;
