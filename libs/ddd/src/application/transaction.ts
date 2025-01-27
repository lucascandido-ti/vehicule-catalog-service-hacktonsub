import { AggregateRoot, Exception } from "../domain";

import { Constructor } from "./utils";
import { IRepositoryEx } from "./repository";

/**
 * Exception thrown when a **Repository** is not found by the resolver.
 */
export class RepositoryNotFoundException extends Exception {
  constructor(Entity: Constructor<AggregateRoot<unknown>>) {
    super(`Repository for ${Entity.name} not found`);
  }
}

/**
 * Interface for representing a container of **Repositories**.
 */
export interface IRepositoryResolver {
  resolveRepositoryFor<
    T extends AggregateRoot<TId>,
    TRepository extends IRepositoryEx<T> = IRepositoryEx<T>,
    TId = T["id"],
  >(
    Entity: Constructor<T>,
  ): Promise<TRepository>;
}

/**
 * Interface for representing a **Transaction**.
 */
export interface ITransaction {
  readonly repositoryResolver: IRepositoryResolver;

  isComplete: boolean;

  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * Base class for implementing a **Transaction**.
 */
export abstract class Transaction implements ITransaction {
  public abstract readonly repositoryResolver: IRepositoryResolver;

  public isComplete: boolean;

  constructor() {
    this.isComplete = false;
  }

  public abstract commit(): Promise<void>;

  public abstract rollback(): Promise<void>;
}

/**
 * Interface for representing a **Transaction** manager.
 *
 * It is responsible for creating and managing the lifecycle of a **Transaction**.
 *
 * @remarks It is highly recommended to use the `withTransaction` method to execute a
 * **Transaction**, since it will properly handle its lifecycle. Usage of other methods is
 * discouraged and should be avoided.
 */
export interface ITransactionManager {
  beginTransaction(): Promise<ITransaction>;
  commitTransaction(txn: ITransaction): Promise<void>;
  rollbackTransaction(txn: ITransaction): Promise<void>;
  withTransaction<T>(cb: (repositoryResolver: IRepositoryResolver) => Promise<T>): Promise<T>;
}

/**
 * Base class for implementing a **Transaction** manager.
 *
 * @remarks Overriding the methods on this class is discouraged. Instead, prefer to handle `commit`
 * and `rollback` logic on a custom `Transaction` class.
 */
export abstract class TransactionManager implements ITransactionManager {
  public abstract beginTransaction(): Promise<ITransaction>;

  public async withTransaction<T>(
    cb: (repositoryResolver: IRepositoryResolver) => Promise<T>,
  ): Promise<T> {
    const txn = await this.beginTransaction();

    try {
      const result = await cb(txn.repositoryResolver);

      await this.commitTransaction(txn);

      return result;
    } catch (err) {
      await this.rollbackTransaction(txn);

      throw err;
    }
  }

  public async commitTransaction(txn: ITransaction): Promise<void> {
    if (txn.isComplete) {
      return;
    }

    await txn.commit();

    txn.isComplete = true;
  }

  public async rollbackTransaction(txn: ITransaction): Promise<void> {
    if (txn.isComplete) {
      return;
    }

    await txn.rollback();

    txn.isComplete = true;
  }
}
