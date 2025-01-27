import { describe, expect, test } from "vitest";

import { Entity } from "./entity";

class MyEntity extends Entity<number> {
  constructor(id: number) {
    super(id);
  }
}

describe("Entity", () => {
  test.each`
    id1   | id2   | equals
    ${42} | ${42} | ${true}
    ${42} | ${13} | ${false}
  `("entities with IDs $id1 and $id2 are equal = $equals", ({ id1, id2, equals }) => {
    const entity1 = new MyEntity(id1);
    const entity2 = new MyEntity(id2);

    expect(entity1.equals(entity2)).toBe(equals);
  });
});
