import { AggregateRoot, Entity, Exception } from "../domain";

import { Constructor } from "./utils";
import { IEventBus } from "./event";

/**
 * Exception thrown when an **Entity** already exists and cannot be inserted in the **Repository**.
 */
export class EntityAlreadyExistsException<T extends Entity<TId>, TId = T["id"]> extends Exception {
  constructor(entity: T) {
    super(`${entity.constructor.name} entity with ID ${entity.id} already exists`);
  }
}

/**
 * Exception thrown when an **Entity** is expected to exist but cannot be found in the
 * **Repository**.
 */
export class EntityNotFoundException<T extends Entity<TId>, TId = T["id"]> extends Exception {
  constructor(Entity: Constructor<T>, id: TId) {
    super(`${Entity.name} entity with ID ${id} does not exist`);
  }
}

/**
 * Interface for representing a read-only **Repository**.
 */
export interface IReadRepository<T extends AggregateRoot<TId>, TId = T["id"]> {
  getById(id: TId): Promise<T | null>;
  list(skip: number, take: number): Promise<T[]>;
  count(): Promise<number>;
}

/**
 * Interface for extending the behaviour of a read-only **Repository**.
 */
export interface IReadRepositoryEx<T extends AggregateRoot<TId>, TId = T["id"]>
  extends IReadRepository<T, TId> {
  exists(id: TId): Promise<boolean>;
  empty(): Promise<boolean>;
}

/**
 * Mixin that extends the behaviour of a read-only **Repository**.
 *
 * @param Base - The base read-only **Repository** to extend.
 * @returns The extended read-only **Repository**.
 */
export function ReadRepositoryEx<
  T extends AggregateRoot<TId>,
  TId = T["id"],
  TBase extends Constructor<IReadRepository<T, TId>> = Constructor<IReadRepository<T, TId>>,
>(Base: TBase) {
  return class extends Base implements IReadRepositoryEx<T, TId> {
    public async exists(id: TId): Promise<boolean> {
      return !!(await this.getById(id));
    }

    public async empty(): Promise<boolean> {
      return (await this.count()) === 0;
    }
  };
}

/**
 * Interface for representing a **Repository**:
 *
 * > Therefore, use a Repository, the purpose of which is to encapsulate all the logic needed to
 * > obtain object references. The domain objects won’t have to deal with the infrastructure to get
 * > the needed references to other objects of the domain. They will just get them from the
 * > Repository and the model is regaining its clarity and focus.
 */
export interface IRepository<T extends AggregateRoot<TId>, TId = T["id"]>
  extends IReadRepository<T, TId> {
  insert(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<void>;
}

/**
 * Interface for extending the behaviour of **Repository**.
 */
export interface IRepositoryEx<T extends AggregateRoot<TId>, TId = T["id"]>
  extends IRepository<T, TId>,
    IReadRepositoryEx<T, TId> {
  insertRange(entities: T[]): Promise<T[]>;
  updateRange(entities: T[]): Promise<T[]>;
  deleteRange(entities: T[]): Promise<void>;
}

/**
 * Mixin that extends the behaviour of a **Repository**.
 *
 * @param Base - The base **Repository** to extend.
 * @returns The extended **Repository**.
 */
export function RepositoryEx<
  T extends AggregateRoot<TId>,
  TId = T["id"],
  TBase extends Constructor<IRepository<T, TId>> = Constructor<IRepository<T, TId>>,
>(Base: TBase) {
  return class extends ReadRepositoryEx(Base) implements IRepositoryEx<T, TId> {
    public async insertRange(entities: T[]): Promise<T[]> {
      return Promise.all(entities.map((entity) => this.insert(entity)));
    }

    public async updateRange(entities: T[]): Promise<T[]> {
      return Promise.all(entities.map((entity) => this.update(entity)));
    }

    public async deleteRange(entities: T[]): Promise<void> {
      await Promise.all(entities.map((entity) => this.delete(entity)));
    }
  };
}

/**
 * Interface for representing a **Repository** that emits **Domain Events**.
 */
export interface IRepositoryWithEvents<T extends AggregateRoot<TId>, TId = T["id"]>
  extends IRepositoryEx<T, TId> {
  eventBus: IEventBus;
}

/**
 * Mixin that adds **Domain Event** handling to a **Repository**.
 *
 * @param Base - The base **Repository** to extend.
 * @returns The extended **Repository**.
 */
export function RepositoryWithEvents<
  T extends AggregateRoot<TId>,
  TId = T["id"],
  TBase extends Constructor<IRepositoryWithEvents<T, TId>> = Constructor<
    IRepositoryWithEvents<T, TId>
  >,
>(Base: TBase) {
  return class extends Base implements IRepositoryEx<T, TId> {
    public override async insert(entity: T): Promise<T> {
      const insertedEntity = await super.insert(entity);

      await this.emitDomainEvents(insertedEntity);

      return insertedEntity;
    }

    public override async update(entity: T): Promise<T> {
      const updatedEntity = await super.update(entity);

      await this.emitDomainEvents(updatedEntity);

      return updatedEntity;
    }

    public override async delete(entity: T): Promise<void> {
      await super.delete(entity);

      await this.emitDomainEvents(entity);
    }

    public override async insertRange(entities: T[]): Promise<T[]> {
      const insertedEntities = await super.insertRange(entities);

      await this.emitDomainEvents(insertedEntities);

      return insertedEntities;
    }

    public override async updateRange(entities: T[]): Promise<T[]> {
      const updatedEntities = await super.updateRange(entities);

      await this.emitDomainEvents(updatedEntities);

      return updatedEntities;
    }

    public override async deleteRange(entities: T[]): Promise<void> {
      await super.deleteRange(entities);

      await this.emitDomainEvents(entities);
    }

    public async emitDomainEvents(entityOrEntities: T | T[]): Promise<void> {
      if (!this.eventBus) {
        return;
      }

      const entities = Array.isArray(entityOrEntities) ? entityOrEntities : [entityOrEntities];

      await Promise.all(
        entities
          .flatMap((entity) => entity.drainDomainEvents())
          .map(async (event) => this.eventBus.emit(event)),
      );
    }
  };
}
