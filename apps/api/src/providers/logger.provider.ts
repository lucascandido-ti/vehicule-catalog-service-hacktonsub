import { ValueObject } from "@libs/ddd";

export class LogLevel extends ValueObject {
  private static readonly ENV = "LOG_LEVEL";

  private static _variants: LogLevel[] = [];

  static readonly ERROR = new LogLevel("error");
  static readonly WARN = new LogLevel("warn");
  static readonly INFO = new LogLevel("info");
  static readonly DEBUG = new LogLevel("debug");
  static readonly TRACE = new LogLevel("trace");
  static readonly OFF = new LogLevel("off");

  private constructor(private readonly level: string) {
    super();

    LogLevel._variants.push(this);
  }

  public static get variants(): readonly LogLevel[] {
    return LogLevel._variants;
  }

  public static parse(value: string): LogLevel {
    switch (value.trim().toLowerCase()) {
      case "error":
        return LogLevel.ERROR;

      case "warn":
        return LogLevel.WARN;

      case "info":
        return LogLevel.INFO;

      case "debug":
        return LogLevel.DEBUG;

      case "trace":
        return LogLevel.TRACE;

      default:
        return LogLevel.OFF;
    }
  }

  public static parseFromEnv(): LogLevel {
    return LogLevel.parse(process.env[LogLevel.ENV] ?? "off");
  }

  public static levels(minLevel: LogLevel): LogLevel[] {
    const levels: LogLevel[] = [];

    for (const level of LogLevel.variants) {
      levels.push(level);

      if (level.equals(minLevel)) {
        break;
      }
    }

    return levels;
  }

  private get index(): number {
    return LogLevel._variants.indexOf(this);
  }

  public override compare(logLevel: LogLevel): number {
    // Inverted comparison, since the higher the index, the lower the level.
    return logLevel.index - this.index;
  }

  public override toString(): string {
    return this.level;
  }
}

type LogFunction = (message: unknown, ...optionalParams: unknown[]) => void;

export interface ILogger {
  readonly error: LogFunction;
  readonly warn: LogFunction;
  readonly info: LogFunction;
  readonly debug: LogFunction;
  readonly trace: LogFunction;
}

export abstract class Logger implements ILogger {
  public readonly minLevel: LogLevel;

  public readonly error: LogFunction = () => {};
  public readonly warn: LogFunction = () => {};
  public readonly info: LogFunction = () => {};
  public readonly debug: LogFunction = () => {};
  public readonly trace: LogFunction = () => {};

  constructor(minLogLevel = LogLevel.INFO) {
    this.minLevel = minLogLevel ?? LogLevel.parseFromEnv();

    if (this.minLevel.compare(LogLevel.ERROR) > 0) return;
    this.error = this.log.bind(this, LogLevel.ERROR);

    if (this.minLevel.compare(LogLevel.WARN) > 0) return;
    this.warn = this.log.bind(this, LogLevel.WARN);

    if (this.minLevel.compare(LogLevel.INFO) > 0) return;
    this.info = this.log.bind(this, LogLevel.INFO);

    if (this.minLevel.compare(LogLevel.DEBUG) > 0) return;
    this.debug = this.log.bind(this, LogLevel.DEBUG);

    if (this.minLevel.compare(LogLevel.TRACE) > 0) return;
    this.trace = this.log.bind(this, LogLevel.TRACE);
  }

  public abstract log(level: LogLevel, message: unknown, ...optionalParams: unknown[]): void;
}
