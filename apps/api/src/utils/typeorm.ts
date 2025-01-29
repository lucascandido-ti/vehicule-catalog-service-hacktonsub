import { ConfigModule, ConfigService } from "@nestjs/config";
import { DynamicModule, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DataSource } from "typeorm";

import { DataSourceConfig } from "@vcs/adapter/data";

import { RepositoryResolver, getRepositoryResolverToken } from "../providers";

export class NestjsTypeormModule {
  public static forRoot(dataSource: DataSource): DynamicModule {
    const dataSourceName = dataSource.name ?? "default";
    const providers: Provider[] = [
      {
        provide: getRepositoryResolverToken(dataSource),
        useClass: RepositoryResolver,
      },
    ];

    return {
      global: true,
      module: NestjsTypeormModule,
      imports: [
        TypeOrmModule.forRootAsync({
          name: dataSourceName,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const typeormConfig = configService.get<DataSourceConfig>(`data.${dataSourceName}`)!;

            const options = dataSource.options;

            Object.assign(options, typeormConfig);

            return options;
          },
        }),
      ],
      providers,
      exports: providers,
    };
  }
}
