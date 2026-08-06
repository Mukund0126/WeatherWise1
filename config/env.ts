export const ENV = {
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  appName: "WeatherWise",
  appVersion: "1.0.0",
} as const;
