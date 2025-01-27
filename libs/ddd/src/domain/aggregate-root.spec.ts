import { describe, expect, test } from "vitest";
import { AggregateRoot } from "./aggregate-root";
import { DomainEvent } from "./domain-event";

class MyDomainEvent extends DomainEvent {
  constructor(public readonly reason: string) {
    super();
  }
}

class MyAggregateRoot extends AggregateRoot<number> {
  constructor(id: number) {
    super(id);
  }

  public foo() {
    this.registerDomainEvent(new MyDomainEvent("foo"));
  }

  public bar() {
    this.registerDomainEvent(new MyDomainEvent("bar"));
  }
}

describe("AggregateRoot", () => {
  test("registerDomainEvent", () => {
    const aggregateRoot = new MyAggregateRoot(42);

    aggregateRoot.foo();
    aggregateRoot.bar();

    const domainEvents = aggregateRoot.domainEvents as readonly MyDomainEvent[];

    expect(domainEvents).toHaveLength(2);
    expect((domainEvents[0] as MyDomainEvent).reason).toBe("foo");
    expect((domainEvents[1] as MyDomainEvent).reason).toBe("bar");
  });

  test("drainDomainEvents", () => {
    const aggregateRoot = new MyAggregateRoot(42);

    aggregateRoot.foo();
    aggregateRoot.bar();

    const domainEvents = aggregateRoot.drainDomainEvents();

    expect(domainEvents).toHaveLength(2);
    expect(aggregateRoot.domainEvents).toHaveLength(0);
  });
});
