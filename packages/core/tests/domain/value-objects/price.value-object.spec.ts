import { describe, it } from "vitest";

import { Price } from "@vcs/core/domain";

describe("Price Value Object", () => {
  it("should create a Price object with a valid value", () => {
    const price = new Price(100.123);
    expect(price.getValue()).toBe(100.12); // Verifica se o valor foi arredondado corretamente
  });

  it("should throw an error if the price is negative", () => {
    expect(() => new Price(-1)).toThrowError(
      "Invalid price. The value must be a non-negative number.",
    );
  });

  it("should throw an error if the value is not a number", () => {
    expect(() => new Price("invalid" as unknown as number)).toThrowError(
      "Invalid price. The value must be a non-negative number.",
    );
  });

  it("should handle zero as a valid price", () => {
    const price = new Price(0);
    expect(price.getValue()).toBe(0);
  });

  it("should allow creation with very large values", () => {
    const price = new Price(1_000_000.99);
    expect(price.getValue()).toBe(1_000_000.99);
  });

  it("should round the price to two decimal places", () => {
    const price = new Price(49.999);
    expect(price.getValue()).toBe(50.0);
  });
});
