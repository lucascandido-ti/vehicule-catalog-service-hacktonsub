import { getDataSourcePrefix } from "@nestjs/typeorm";

import { DataSource, DataSourceOptions } from "typeorm";

import { Constructor } from "@libs/ddd";

import { RepositoryResolver } from "./resolver.provider";

export function getRepositoryResolverToken(
  dataSource?: DataSource | DataSourceOptions | string,
): Constructor<RepositoryResolver> | string {
  const dataSourcePrefix = getDataSourcePrefix(dataSource);

  if (!dataSourcePrefix) {
    return RepositoryResolver;
  }

  return `${dataSourcePrefix}${RepositoryResolver.name}`;
}
