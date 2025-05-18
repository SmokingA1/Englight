const isDev = process.env.NODE_ENV === "development";

type LogLevel = "info" | "warn" | "error" | "debug";

const shouldLog = (level: LogLevel) => {
    return isDev || level === "error"; // ошибки логгировать даже в проде
};

export const logger = {
    info: (...args: any[]) => {
        if (shouldLog("info")) console.info("%c[INFO]", "color: blue", ...args);
    },

    warn: (...args: any[]) => {
        if (shouldLog("warn")) console.warn("%c[WARN]", "color: orange", ...args);
    },

    error: (...args: any[]) => {
        if (shouldLog("error")) console.error("%c[ERROR]", "color: red", ...args);
    },

    debug: (...args: any[]) => {
        if (shouldLog("debug")) console.debug("%c[DEBUG]", "color: green", ...args);
    }
};
