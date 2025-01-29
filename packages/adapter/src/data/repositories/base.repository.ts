import {
  AggregateRoot,
  Constructor,
  EntityAlreadyExistsException,
  EntityNotFoundException,
  IRepositoryEx,
} from "@libs/ddd";
import { Repository } from "typeorm";

export class BaseRepository<T extends AggregateRoot<TId>, TId = T["id"]>
  implements IRepositoryEx<T>
{
  constructor(protected repository: Repository<T>) {}

  public setRepository(repository: Repository<T>) {
    this.repository = repository;
  }

  public async getById(id: TId): Promise<T | null> {
    return this.repository.findOneBy({ id: id as never });
  }

  public async list(skip: number, take: number): Promise<T[]> {
    return this.repository.find({ skip, take });
  }

  public async count(): Promise<number> {
    return this.repository.count();
  }

  public async exists(id: TId): Promise<boolean> {
    return this.repository.existsBy({ id: id as never });
  }

  public async empty(): Promise<boolean> {
    return (await this.repository.count()) === 0;
  }

  public async insert(entity: T): Promise<T> {
    if (entity.id && (await this.exists(entity.id))) {
      throw new EntityAlreadyExistsException(entity);
    }

    return this.repository.save(entity);
  }

  public async insertRange(entities: T[]): Promise<T[]> {
    await Promise.race(
      entities.map(async (e) => {
        if (await this.exists(e.id)) {
          throw new EntityAlreadyExistsException(e);
        }
      }),
    );

    return this.repository.save(entities);
  }

  public async update(entity: T): Promise<T> {
    if (!(await this.exists(entity.id))) {
      throw new EntityNotFoundException(entity.constructor as Constructor<T>, entity.id);
    }

    return this.repository.save(entity);
  }

  public async updateRange(entities: T[]): Promise<T[]> {
    await Promise.race(
      entities.map(async (e) => {
        if (!(await this.exists(e.id))) {
          throw new EntityNotFoundException(e.constructor as Constructor<T>, e.id);
        }
      }),
    );

    return this.repository.save(entities);
  }

  public async delete(entity: T) {
    await this.repository.remove(entity);
  }

  public async deleteRange(entities: T[]) {
    await this.repository.remove(entities);
  }
}
