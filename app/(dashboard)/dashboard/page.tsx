"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { GreetingCard } from "@/modules/dashboard/components/greeting-card";
import { RecommendationCard } from "@/modules/dashboard/components/recommendation-card";
import { WeatherHero } from "@/modules/dashboard/components/weather-hero";
import { WeatherMetricCard } from "@/modules/dashboard/components/weather-metric-card";
import { ForecastCard } from "@/modules/dashboard/components/forecast-card";
import { HighlightCard } from "@/modules/dashboard/components/highlight-card";
import { QuickActionCard } from "@/modules/dashboard/components/quick-action-card";
import { FavoriteCityCard } from "@/modules/dashboard/components/favorite-city-card";
import { FloatingAssistant } from "@/modules/assistant/components/floating-assistant";
import { SectionHeader } from "@/modules/dashboard/components/section-header";
import { Search, MapPin, Loader2, AlertCircle, Heart } from "lucide-react";
import type { SearchSuggestion } from "@/modules/weather/types/weather.types";

import { useWeather } from "@/modules/weather/hooks/useWeather";
import { useWeatherStore } from "@/modules/weather/store/weather.store";
import { DashboardSkeleton } from "@/modules/weather/components/dashboard-skeleton";
import { ErrorCard } from "@/modules/weather/components/error-card";

export default function DashboardPage() {
  const {
    currentWeather,
    isLoading,
    error,
    clearError,
    fetchWeather,
  } = useWeather();

  const {
    searchSuggestions,
    fetchSuggestions,
    currentCity,
    errorType,
    isSearching,
    searchError,
    favoriteCities,
    toggleFavoriteCity,
    removeFavoriteCity,
    isFavorite,
  } = useWeatherStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [mobileSelectedIndex, setMobileSelectedIndex] = useState(-1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // eslint-disable-next-line
    setMobileSelectedIndex(-1);
  }, [searchQuery, searchSuggestions]);

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsVisible) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMobileSelectedIndex((prev) => (prev < searchSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMobileSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (mobileSelectedIndex >= 0 && mobileSelectedIndex < searchSuggestions.length) {
        e.preventDefault();
        handleSuggestionSelect(searchSuggestions[mobileSelectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSuggestionsVisible(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setSuggestionsVisible(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (val.trim().length < 2) {
      useWeatherStore.setState({ searchSuggestions: [] });
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val, controller.signal);
    }, 300);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion | string) => {
    if (typeof suggestion === "string") {
      fetchWeather(suggestion);
    } else if (suggestion.lat !== undefined && suggestion.lon !== undefined) {
      useWeatherStore.getState().fetchWeatherByCoordinates(suggestion.lat, suggestion.lon, suggestion.name, suggestion.region, suggestion.country);
    } else {
      fetchWeather(suggestion.name);
    }
    setSearchQuery("");
    setSuggestionsVisible(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchWeather(searchQuery);
    setSearchQuery("");
    setSuggestionsVisible(false);
  };

  const handleActionClick = (actionName: string) => {
    switch (actionName) {
      case "Ask AI":
        alert("Navigating to AI Assistant module (Sprint 6 placeholder).");
        break;
      case "Plan Event":
        alert("Navigating to Smart Event Planner module (Sprint 7 placeholder).");
        break;
      case "Search City":
        alert("Focus on the search bar above to look up other global cities.");
        break;
      case "Favorite Cities":
        alert("Navigating to Favorites management (Sprint 8 placeholder).");
        break;
      case "View Forecast":
      default:
        alert("Opening expanded detailed weather trends (Sprint 5 placeholder).");
        break;
    }
  };

  // 1. Error boundary render
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
        <Navbar
          variant="dashboard"
          searchQuery={searchQuery}
          onSearchChange={(e) => handleSearchChange(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
          suggestions={searchSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          suggestionsVisible={suggestionsVisible}
          onFocus={() => setSuggestionsVisible(true)}
          onBlur={() => setTimeout(() => setSuggestionsVisible(false), 200)}
          showProfile={true}
          isSearching={isSearching}
          searchError={searchError}
        />
        <div className="flex-1 flex items-center justify-center">
          <ErrorCard
            message={error}
            type={errorType || undefined}
            onRetry={() => {
              clearError();
              fetchWeather(currentCity || "Ahmedabad");
            }}
          />
        </div>
      </div>
    );
  }

  // 2. Loading skeleton boundary render
  if (isLoading && !currentWeather) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
        <Navbar
          variant="dashboard"
          searchQuery={searchQuery}
          onSearchChange={(e) => handleSearchChange(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
          showProfile={true}
          isSearching={isSearching}
          searchError={searchError}
        />
        <DashboardSkeleton />
      </div>
    );
  }

  const data = currentWeather;
  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Dashboard Navbar */}
      <Navbar
        variant="dashboard"
        searchQuery={searchQuery}
        onSearchChange={(e) => handleSearchChange(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
        suggestions={searchSuggestions}
        onSuggestionSelect={handleSuggestionSelect}
        suggestionsVisible={suggestionsVisible}
        onFocus={() => setSuggestionsVisible(true)}
        onBlur={() => setTimeout(() => setSuggestionsVisible(false), 200)}
        showProfile={true}
        isSearching={isSearching}
        searchError={searchError}
      />

      <PageContainer size="lg" className="flex-1 py-6 space-y-10">
        {/* Header section with Greeting & Inline Search for Mobile/Tablet */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <GreetingCard
            userName={data.greeting.userName}
            weatherSummary={data.greeting.weatherSummary}
            dateString={data.greeting.dateString}
          />

          {/* Inline search bar (visible on mobile/tablet, hidden on desktop Navbar) */}
          <div className="flex md:hidden flex-col relative w-full max-w-sm">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center relative w-full"
            >
              <Search className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="text"
                role="combobox"
                aria-expanded={suggestionsVisible}
                aria-controls="mobile-search-listbox"
                aria-activedescendant={mobileSelectedIndex >= 0 ? `mobile-search-item-${mobileSelectedIndex}` : undefined}
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setSuggestionsVisible(true)}
                onBlur={() => setTimeout(() => setSuggestionsVisible(false), 200)}
                onKeyDown={handleMobileKeyDown}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
            </form>

            {suggestionsVisible && (
              <div className="absolute top-12 left-0 w-full rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg overflow-hidden z-50">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching locations...
                  </div>
                ) : searchError ? (
                  <div className="flex items-center justify-center p-4 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {searchError}
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  <ul 
                    id="mobile-search-listbox" 
                    role="listbox" 
                    className="divide-y divide-border/40 max-h-60 overflow-y-auto"
                  >
                    {searchSuggestions.map((item, index) => {
                      const isSelected = index === mobileSelectedIndex;
                      return (
                        <li key={item.id} role="option" aria-selected={isSelected} id={`mobile-search-item-${index}`}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionSelect(item);
                            }}
                            onMouseEnter={() => setMobileSelectedIndex(index)}
                            className={`w-full text-left px-4 py-3 text-xs transition-colors block cursor-pointer flex items-center gap-3 ${isSelected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5"}`}
                          >
                            <MapPin className={`h-4 w-4 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-semibold truncate">{item.name}</span>
                              {(item.region || item.country) && (
                                <span className={`text-[10px] block truncate ${isSelected ? "text-primary/70" : "text-muted-foreground"}`}>
                                  {item.region ? `${item.region}, ` : ""}{item.country}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                    No locations found
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Layout Grid 1: Today's Recommendations & Core Hero Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between">
            <RecommendationCard
              score={data.recommendation.score}
              text={data.recommendation.text}
              bullets={data.recommendation.bullets}
              metrics={data.recommendation.metrics}
            />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between">
            <WeatherHero
              city={data.hero.city}
              temp={data.hero.temp}
              condition={data.hero.condition}
              feelsLike={data.hero.feelsLike}
              high={data.hero.high}
              low={data.hero.low}
              icon={data.hero.icon}
              isFavorite={isFavorite(data.hero.city)}
              onToggleFavorite={() =>
                toggleFavoriteCity({
                  id: String(Date.now()),
                  name: data.hero.city,
                  temp: data.hero.temp,
                  condition: data.hero.condition,
                  icon: data.hero.icon,
                  lat: data.location.lat,
                  lon: data.location.lon,
                  region: data.location.region,
                  country: data.location.country,
                })
              }
            />
          </div>
        </div>

        {/* Quick weather card stats */}
        <div className="space-y-4">
          <SectionHeader
            title="Weather Intelligence Metrics"
            description="High-fidelity indexes regarding today's ambient environment."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.metrics.map((metric, index) => (
              <WeatherMetricCard
                key={index}
                iconName={metric.icon}
                name={metric.name}
                value={metric.value}
                description={metric.description}
              />
            ))}
          </div>
        </div>

        {/* Layout Grid 2: Forecast and AI features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Hourly and Daily Forecasts */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Hourly Forecast */}
            <div className="space-y-4">
              <SectionHeader
                title="Hourly Forecast"
                description="Expected atmospheric changes for the next 24 hours."
              />
              <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {data.hourlyForecast.map((hour, index) => (
                  <ForecastCard
                    key={index}
                    type="hourly"
                    timeOrDay={hour.time}
                    iconName={hour.icon}
                    temp={hour.temp}
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Forecast */}
            <div className="space-y-4">
              <SectionHeader
                title="Upcoming Forecast"
                description="Long-range climate forecast updates."
              />
              <div className="flex flex-col gap-2">
                {data.dailyForecast.map((day, index) => (
                  <ForecastCard
                    key={index}
                    type="daily"
                    timeOrDay={day.day}
                    iconName={day.icon}
                    high={day.high}
                    low={day.low}
                    condition={day.condition}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Saved Locations */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            {/* Favorite Cities */}
            <div className="space-y-4">
              <SectionHeader
                title="Saved Locations"
                description="Monitored city temperatures."
              />
              {favoriteCities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {favoriteCities.map((city) => (
                    <FavoriteCityCard
                      key={city.id || city.name}
                      name={city.name}
                      temp={city.temp}
                      condition={city.condition}
                      icon={city.icon}
                      onClick={() => handleSuggestionSelect(city.name)}
                      onRemove={() => removeFavoriteCity(city.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-border/60 rounded-2xl bg-card/30 space-y-2">
                  <Heart className="h-6 w-6 text-rose-500/60 mx-auto animate-pulse" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    No favorite cities saved yet.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Click the heart icon on any weather card to save your favorite locations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="space-y-4">
          <SectionHeader
            title="Weather Highlights"
            description="Deep dive parameters regarding local solar and pressure conditions."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.highlights.map((highlight, index) => (
              <HighlightCard
                key={index}
                name={highlight.name}
                value={highlight.value}
                description={highlight.description}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <SectionHeader
            title="Quick Shortcuts"
            description="Speed actions for navigation, event planners, and assistant prompts."
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <QuickActionCard
              actionName="Ask AI"
              description="Query weather advice"
              onClick={() => handleActionClick("Ask AI")}
            />
            <QuickActionCard
              actionName="Plan Event"
              description="Coordinate event comfort"
              onClick={() => handleActionClick("Plan Event")}
            />
            <QuickActionCard
              actionName="Search City"
              description="Inspect global regions"
              onClick={() => handleActionClick("Search City")}
            />
            <QuickActionCard
              actionName="Favorite Cities"
              description="Manage saved regions"
              onClick={() => handleActionClick("Favorite Cities")}
            />
            <QuickActionCard
              actionName="View Forecast"
              description="expanded trend outlook"
              onClick={() => handleActionClick("View Forecast")}
            />
          </div>
        </div>
      </PageContainer>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 mt-12 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            WeatherWise
          </span>
          <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">
            Version 1.0.0 (Sprint 5 Production API)
          </span>
        </div>
      </footer>
      <FloatingAssistant />
    </div>
  );
}
