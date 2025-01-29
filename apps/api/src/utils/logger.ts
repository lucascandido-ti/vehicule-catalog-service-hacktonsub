import { Logger } from "@nestjs/common";

import { ILogger } from "../providers";

export class NestjsLogger implements ILogger {
  private readonly logger: Logger;

  constructor(name?: string) {
    this.logger = name ? new Logger(name) : new Logger();
  }

  public error(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(message, ...optionalParams);
  }

  public warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(message, ...optionalParams);
  }

  public info(message: unknown, ...optionalParams: unknown[]) {
    this.logger.log(message, ...optionalParams);
  }

  public debug(message: unknown, ...optionalParams: unknown[]) {
    this.logger.debug(message, ...optionalParams);
  }

  public trace(message: unknown, ...optionalParams: unknown[]) {
    this.logger.verbose(message, ...optionalParams);
  }
}
