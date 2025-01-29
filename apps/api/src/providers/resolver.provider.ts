import { EntityManager } from "typeorm";

import {
  AggregateRoot,
  Constructor,
  IRepositoryEx,
  IRepositoryResolver,
  RepositoryNotFoundException,
} from "@libs/ddd";

import { BaseRepository } from "@vcs/adapter/data";

import { makeEntityMetadataFilter } from "./repository.provider";

export class RepositoryResolver implements IRepositoryResolver {
  private readonly repositories = new Map<
    Constructor<AggregateRoot<unknown>>,
    IRepositoryEx<AggregateRoot<unknown>>
  >();

  public withEntityManager(entityManager: EntityManager): RepositoryResolver {
    const repositoryResolver = new RepositoryResolver();

    for (const [Entity, repository] of this.repositories) {
      const entityMetadata = entityManager.connection.entityMetadatas.find(
        makeEntityMetadataFilter(Entity),
      );

      if (!entityMetadata) {
        continue;
      }

      // Create a shallow copy of the repository, overriding the underlying repository with the one
      // created under this `EntityManager` instance.
      const rawRepository = entityManager.getRepository<InstanceType<typeof Entity>>(
        entityMetadata.target,
      );

      const managedRepository: BaseRepository<InstanceType<typeof Entity>> = Object.assign(
        Object.create(Object.getPrototypeOf(repository)),
        repository,
      );

      managedRepository.setRepository(rawRepository);

      repositoryResolver.registerRepository(Entity, managedRepository);
    }

    return repositoryResolver;
  }

  public registerRepository<T extends AggregateRoot<TId>, TId = T["id"]>(
    Entity: Constructor<T>,
    repository: IRepositoryEx<T>,
  ) {
    this.repositories.set(Entity, repository);
  }

  public async resolveRepositoryFor<
    T extends AggregateRoot<TId>,
    TRepository extends IRepositoryEx<T, T["id"]> = IRepositoryEx<T, T["id"]>,
    TId = T["id"],
  >(Entity: Constructor<T>): Promise<TRepository> {
    const repository = this.repositories.get(Entity);

    if (!repository) {
      throw new RepositoryNotFoundException(Entity);
    }

    return repository as unknown as TRepository;
  }
}
