import pino, { LoggerOptions, DestinationStream } from "pino";

const isProduction = process.env.NODE_ENV === "production";

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
   
  },
};

const transport = isProduction
  ? pino.transport({
      target: "pino/file", 
    })
  : pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
        ignore: "pid,hostname", 
      },
    });

const logger = pino(options, transport as DestinationStream);

export default logger;
