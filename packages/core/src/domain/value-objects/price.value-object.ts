import { ValueObject } from "@libs/ddd";

export class Price extends ValueObject {
  private readonly value: number;

  constructor(value: number) {
    super();

    if (!this.isValidPrice(value)) {
      throw new Error("Invalid price. The value must be a non-negative number.");
    }
    this.value = parseFloat(value.toFixed(2));
  }

  private isValidPrice(value: number): boolean {
    return typeof value === "number" && value >= 0;
  }

  public getValue(): number {
    return this.value;
  }
}
