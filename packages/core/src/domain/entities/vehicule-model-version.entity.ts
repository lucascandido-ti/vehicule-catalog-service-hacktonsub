import { Entity } from "@libs/ddd";
import { VehiculeModel } from "./vehicule-model.entity";

export class VehiculeModelVersion extends Entity<string> {
  public readonly description: string;
  public readonly model: VehiculeModel;

  constructor(description: string, model: VehiculeModel) {
    super(undefined!);

    this.description = description;
    this.model = model;
  }

  public get uuid(): string {
    return this.id;
  }

  public static create(description: string, model: VehiculeModel) {
    return new VehiculeModelVersion(description, model);
  }
}
