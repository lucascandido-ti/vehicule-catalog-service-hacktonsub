import { Entity } from "@libs/ddd";

export class VehiculeBrand extends Entity<string> {
  public readonly name: string;
  public readonly description: string;
  public readonly headquarters: string;

  constructor(name: string, description: string, headquarters: string) {
    super(undefined!);

    this.name = name;
    this.description = description;
    this.headquarters = headquarters;
  }

  public get uuid(): string {
    return this.id;
  }

  public static create(name: string, description: string, headquarters: string) {
    return new VehiculeBrand(name, description, headquarters);
  }
}
