import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";

/**
 * Base class for representing an **Aggregate Root**:
 *
 * > An Aggregate is a group of associated objects which are considered as one unit with regard to
 * > data changes. The Aggregate is demarcated by a boundary which separates the objects inside
 * > from those outside. Each Aggregate has one root. The root is an Entity, and it is the only
 * > object accessible from outside. The root can hold references to any of the aggregate objects,
 * > and the other objects can hold references to each other, but an outside object can hold
 * > references only to the root object. If there are other Entities inside the boundary, the
 * > identity of those entities is local, making sense only inside the aggregate.
 */
export abstract class AggregateRoot<TId> extends Entity<TId> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  protected registerDomainEvent(domainEvent: DomainEvent) {
    this._domainEvents.push(domainEvent);
  }

  public drainDomainEvents(): DomainEvent[] {
    const domainEvents = this._domainEvents;
    this._domainEvents = [];

    return domainEvents;
  }
}
