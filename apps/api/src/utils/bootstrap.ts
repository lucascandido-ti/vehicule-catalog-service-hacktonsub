import { Logger, LogLevel as NestjsLogLevel } from "@nestjs/common";

import morgan from "morgan";

import { LogLevel } from "../providers";

export function useMorgan() {
  const logger = new Logger("Morgan");

  morgan.format("nest", function (this: Record<string, morgan.TokenCallbackFn>, tokens, req, res) {
    if (req?.method === "OPTIONS") return null;

    const responseTime = parseInt(tokens["response-time"]?.(req, res) ?? "0", 10);

    logger.log(`${req.method} ${req.url} ${res.statusCode} +${responseTime}ms`);

    return null;
  });

  return morgan("nest");
}

export function withMinLogLevel(logLevel: LogLevel): NestjsLogLevel[] {
  const levels = LogLevel.levels(logLevel);
  const nestjsLogLevels: NestjsLogLevel[] = ["fatal"];

  for (const level of levels) {
    const nestjsLogLevel = fnLogLevel(level);

    if (nestjsLogLevel === null) continue;

    nestjsLogLevels.push(nestjsLogLevel);
  }

  return nestjsLogLevels;
}

export function fnLogLevel(logLevel: LogLevel): NestjsLogLevel | null {
  switch (logLevel) {
    case LogLevel.ERROR:
      return "error";

    case LogLevel.WARN:
      return "warn";

    case LogLevel.INFO:
      return "log";

    case LogLevel.DEBUG:
      return "debug";

    case LogLevel.TRACE:
      return "verbose";

    default:
      return null;
  }
}
