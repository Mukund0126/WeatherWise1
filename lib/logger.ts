const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  error: (message: string, error?: unknown, ...args: unknown[]) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error, ...args);
  },
};

export default logger;
