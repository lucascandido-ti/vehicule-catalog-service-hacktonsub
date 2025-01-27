import { describe, expect, test } from "vitest";

import { ValueObject, compareValue } from "./value-object";

class MyValueObject extends ValueObject {
  constructor(
    public readonly a: boolean,
    public readonly b: number,
    public readonly c: string,
  ) {
    super();
  }

  public override compare(valueObject: MyValueObject): -1 | 0 | 1 {
    if (this.a < valueObject.a) return -1;
    if (this.a > valueObject.a) return 1;

    const compareResult = this.c.localeCompare(valueObject.c);

    if (compareResult < 0) return -1;
    if (compareResult > 0) return 1;

    return 0;
  }
}

describe("ValueObject", () => {
  test("cloned value objects are different instances, but equivalent", () => {
    const entity1 = new MyValueObject(true, 42, "foo");
    const entity2 = entity1.clone();

    expect(entity1 === entity2).toBe(false);
    expect(entity1.equals(entity2)).toBe(true);
  });

  test.each`
    valueObject1                           | valueObject2                           | comparisonResult
    ${new MyValueObject(true, 42, "foo")}  | ${new MyValueObject(true, 42, "foo")}  | ${0}
    ${new MyValueObject(true, 42, "foo")}  | ${new MyValueObject(true, 13, "foo")}  | ${0}
    ${new MyValueObject(true, 42, "foo")}  | ${new MyValueObject(false, 13, "foo")} | ${1}
    ${new MyValueObject(false, 42, "foo")} | ${new MyValueObject(true, 13, "foo")}  | ${-1}
    ${new MyValueObject(true, 42, "foo")}  | ${new MyValueObject(true, 13, "bar")}  | ${1}
    ${new MyValueObject(false, 42, "bar")} | ${new MyValueObject(false, 13, "foo")} | ${-1}
  `(
    "compare $valueObject1 with $valueObject2 = $comparisonResult",
    ({ valueObject1, valueObject2, comparisonResult }) => {
      expect(valueObject1.compare(valueObject2)).toBe(comparisonResult);
    },
  );

  test.each`
    valueObject1                          | valueObject2                           | equals
    ${new MyValueObject(true, 42, "foo")} | ${new MyValueObject(true, 42, "foo")}  | ${true}
    ${new MyValueObject(true, 42, "foo")} | ${new MyValueObject(true, 13, "foo")}  | ${true}
    ${new MyValueObject(true, 42, "foo")} | ${new MyValueObject(false, 13, "foo")} | ${false}
    ${new MyValueObject(true, 42, "foo")} | ${new MyValueObject(true, 13, "bar")}  | ${false}
    ${new MyValueObject(true, 42, "foo")} | ${new MyValueObject(false, 13, "bar")} | ${false}
  `(
    "value objects $valueObject1 and $valueObject2 are equal = $equals",
    ({ valueObject1, valueObject2, equals }) => {
      expect(valueObject1.equals(valueObject2)).toBe(equals);
    },
  );

  test("list of value objects can be sorted", () => {
    const valueObjects = [
      new MyValueObject(false, 1, "foo"),
      new MyValueObject(true, 2, "foo"),
      new MyValueObject(false, 3, "bar"),
      new MyValueObject(true, 4, "bar"),
    ];

    valueObjects.sort(ValueObject.compareFn);

    expect(valueObjects[0]!.b).toBe(3);
    expect(valueObjects[1]!.b).toBe(1);
    expect(valueObjects[2]!.b).toBe(4);
    expect(valueObjects[3]!.b).toBe(2);
  });
});

function functionA(): boolean {
  return true;
}

function functionB(): number {
  return 42;
}

describe("compareValue", () => {
  test.each`
    a                          | b                          | comparisonResult
    ${null}                    | ${null}                    | ${0}
    ${null}                    | ${{}}                      | ${-1}
    ${{}}                      | ${null}                    | ${1}
    ${BigInt(13)}              | ${BigInt(42)}              | ${-1}
    ${BigInt(42)}              | ${BigInt(42)}              | ${0}
    ${BigInt(42)}              | ${BigInt(13)}              | ${1}
    ${false}                   | ${true}                    | ${-1}
    ${true}                    | ${true}                    | ${0}
    ${true}                    | ${false}                   | ${1}
    ${functionA}               | ${functionB}               | ${-1}
    ${functionB}               | ${functionA}               | ${1}
    ${13}                      | ${42}                      | ${-1}
    ${42}                      | ${42}                      | ${0}
    ${42}                      | ${13}                      | ${1}
    ${{ foo: 42, bar: "baz" }} | ${{ foo: 13, bar: "baz" }} | ${1}
    ${{ foo: 42, bar: "baz" }} | ${{ foo: 42, bar: "qux" }} | ${-1}
    ${[1, 2, 3]}               | ${[1, 2, 4]}               | ${-1}
    ${["qwerty", "azerty"]}    | ${["dvorak", "qwfpgj"]}    | ${1}
    ${"foo"}                   | ${"bar"}                   | ${1}
    ${"foo"}                   | ${"foo"}                   | ${0}
    ${"bar"}                   | ${"foo"}                   | ${-1}
    ${Symbol("foo")}           | ${Symbol("bar")}           | ${1}
    ${Symbol("foo")}           | ${Symbol("foo")}           | ${0}
    ${Symbol("bar")}           | ${Symbol("foo")}           | ${-1}
    ${undefined}               | ${undefined}               | ${0}
  `("compare $a with $b = $comparisonResult", ({ a, b, comparisonResult }) => {
    expect(compareValue(a, b)).toBe(comparisonResult);
  });
});
