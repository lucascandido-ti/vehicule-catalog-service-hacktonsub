import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, BaseExceptionFilter } from "@nestjs/core";
import { ClassSerializerInterceptor, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { datasource } from "@vcs/adapter/data";

import { readConfig } from "./config";

import { NestjsTypeormModule } from "./utils";

import { HealthModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      load: [() => readConfig("./settings.json")],
    }),
    NestjsTypeormModule.forRoot(datasource),
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: BaseExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
})
export class AppModule {}
