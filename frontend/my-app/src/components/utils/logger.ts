const isDev = process.env.NODE_ENV === "development";

export const logger = {
    info: (...args: any[]) => {
        if (isDev) console.info("[INFO]", ...args)
    }
}