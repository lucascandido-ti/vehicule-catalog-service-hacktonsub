import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

import helmet from "helmet";

import { NestjsLogger, useMorgan, withMinLogLevel } from "./utils";
import { Config } from "./config";
import { LogLevel } from "./providers";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const config = (configService as unknown as { internalConfig: Config }).internalConfig;

  app.set("trust proxy", "1");
  app.enableCors({ credentials: true });
  app.enableShutdownHooks();

  app.useBodyParser("json", { type: ["application/json"] });

  app.useLogger(withMinLogLevel(LogLevel.parseFromEnv()));
  app.use(useMorgan());
  app.use(helmet());

  await app.listen(+config.port);

  const logger = new NestjsLogger();
  logger.debug(`Server listening on port: ${+config.port}`);
}
bootstrap();
