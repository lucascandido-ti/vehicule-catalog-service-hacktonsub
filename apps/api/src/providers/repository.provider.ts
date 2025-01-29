import { getDataSourceToken, getRepositoryToken } from "@nestjs/typeorm";
import { Provider } from "@nestjs/common";

import { DataSource, DataSourceOptions, EntityMetadata, ObjectLiteral } from "typeorm";

import { AggregateRoot, Constructor, IRepositoryEx } from "@libs/ddd";

import { BaseRepository } from "@vcs/adapter/data";

import { RepositoryResolver } from "./resolver.provider";
import { getRepositoryResolverToken } from "./transaction.provider";

export type RepositoryProviderProps = {
  Entity: Constructor<AggregateRoot<unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Repository: Constructor<BaseRepository<any>>;
};

export function makeEntityMetadataFilter<Entity extends ObjectLiteral>(
  Entity: Constructor<Entity>,
): (metadata: EntityMetadata) => boolean {
  return ({ target }: EntityMetadata) => {
    switch (typeof target) {
      case "string":
        return target === Entity.name;

      case "function":
        return target === Entity || target.prototype instanceof Entity;

      default:
        return false;
    }
  };
}

export function provideRepositories(
  props: RepositoryProviderProps[],
  dataSource?: DataSource | DataSourceOptions | string,
): Provider[] {
  return props.map(({ Entity, Repository }) => ({
    provide: getRepositoryToken(Entity, dataSource),
    inject: [getDataSourceToken(dataSource), getRepositoryResolverToken(dataSource)],
    useFactory: (dataSource: DataSource, repositoryResolver: RepositoryResolver) => {
      const entityMetadata = dataSource.entityMetadatas.find(makeEntityMetadataFilter(Entity));

      if (!entityMetadata) {
        throw new Error(`Entity metadata not found for ${Entity.name}`);
      }

      const rawRepository = dataSource.getRepository<InstanceType<typeof Entity>>(
        entityMetadata.target,
      );

      const repository: IRepositoryEx<InstanceType<typeof Entity>> = new Repository(rawRepository);

      repositoryResolver.registerRepository(Entity, repository);

      return repository;
    },
  }));
}
