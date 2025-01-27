/**
 * Base class for representing a **Value Object**:
 *
 * > There are cases when we need to contain some attributes of a domain element. We are not
 * > interested in which object it is, but what attributes it has. An object that is used to
 * > describe certain aspects of a domain, and which does not have identity, is named Value Object.
 */
export abstract class ValueObject {
  public clone(): ThisType<ValueObject> {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  public compare(valueObject: ThisType<ValueObject>): number {
    return compareObject(this, valueObject);
  }

  public equals(valueObject: ThisType<ValueObject>): boolean {
    return this.compare(valueObject) === 0;
  }

  public static compareFn(a: ValueObject, b: ValueObject): number {
    return a.compare(b);
  }
}

export function compareValue<T>(a: T | null, b: T | null): number {
  if (a === null || a === undefined) {
    return b === null || b === undefined ? 0 : -1;
  }

  if (b === null || b === undefined) {
    return a === null || a === undefined ? 0 : 1;
  }

  switch (typeof a) {
    case "function": {
      const functionA = a as () => never;
      const functionB = b as () => never;

      return compareString(functionA.name, functionB.name);
    }

    case "object": {
      if (a instanceof ValueObject && b instanceof ValueObject) {
        return a.compare(b);
      }

      if (Array.isArray(a) && Array.isArray(b)) {
        return compareArray(a, b);
      }

      const objectA = a as Record<string, unknown>;
      const objectB = b as Record<string, unknown>;

      return compareObject(objectA, objectB);
    }

    case "string": {
      const stringA = a as string;
      const stringB = b as string;

      return compareString(stringA, stringB);
    }

    case "symbol": {
      const symbolA = a as symbol;
      const symbolB = b as symbol;

      return compareValue(symbolA.description, symbolB.description);
    }

    default:
      return a < b ? -1 : a > b ? 1 : 0;
  }
}

function compareString(a: string, b: string): number {
  return a.localeCompare(b);
}

function compareArray<T>(a: T[], b: T[]): number {
  if (a.length !== b.length) {
    return a.length - b.length;
  }

  for (let i = 0; i < a.length; i++) {
    const result = compareValue(a[i], b[i]);

    if (result === 0) continue;

    return result;
  }

  return 0;
}

function compareObject(a: object, b: object): number {
  for (const [key, value] of Object.entries(a)) {
    const result = compareValue(value, b[key as keyof typeof b]);

    if (result === 0) continue;

    return result;
  }

  return 0;
}
