const LogLevelColor = {
  DEBUG: "grey",
  INFO: "#0074D9",
  WARN: "#FF851B",
  ERROR: "#FF4136",
};

export const logger = {
  debug: (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.debug("%c[DEBUG]", `color: ${LogLevelColor.DEBUG}; font-weight: bold`, ...args);
    }
  },

  info: (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.info("%c[INFO]", `color: ${LogLevelColor.INFO}; font-weight: bold`, ...args);
    }
  },

  warn: (...args: unknown[]): void => {
    console.warn("%c[WARN]", `color: ${LogLevelColor.WARN}; font-weight: bold`, ...args);
  },

  error: (...args: unknown[]): void => {
    console.error("%c[ERROR]", `color: ${LogLevelColor.ERROR}; font-weight: bold`, ...args);
  },
};
