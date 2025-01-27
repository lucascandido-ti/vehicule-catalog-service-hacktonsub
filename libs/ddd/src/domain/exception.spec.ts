import { describe, expect, test } from "vitest";
import { Exception } from "./exception";

class MyException extends Exception {
  constructor() {
    super("My exception");
  }
}

describe("Exception", () => {
  test("error message property is preserved", () => {
    try {
      throw new MyException();
    } catch (e) {
      const exception = e as Exception;

      expect(exception.name).toBe("MyException");
      expect(exception.message).toBe("My exception");
    }
  });
});
