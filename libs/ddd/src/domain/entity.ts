/**
 * Base class for representing an **Entity**:
 *
 * > There is a category of objects which seem to have an identity, which remains the same
 * > throughout the states of the software. For these objects it is not the attributes which
 * > matter, but a thread of continuity and identity, which spans the life of a system and can
 * > extend beyond it. Such objects are called Entities.
 */
export abstract class Entity<TId> {
  constructor(
    public readonly id: TId,
    public readonly createdAt = new Date(),
    public updatedAt = new Date(),
  ) {}

  public equals(entity: typeof this): boolean {
    return this.id === entity.id;
  }
}
