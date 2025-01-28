import { Entity } from "@libs/ddd";

import { Vehicule } from "../aggregates";

export class VehiculeDocs extends Entity<string> {
  public readonly vehicule: Vehicule;
  public readonly license_plate: string;
  public readonly chassis_code: string;
  public readonly renavam: string;

  constructor(vehicule: Vehicule, licensePlate: string, chassisCode: string, renavam: string) {
    super(undefined!);

    this.vehicule = vehicule;
    this.license_plate = licensePlate;
    this.chassis_code = chassisCode;
    this.renavam = renavam;
  }

  public get uuid(): string {
    return this.id;
  }

  public static create(
    vehicule: Vehicule,
    licensePlate: string,
    chassisCode: string,
    renavam: string,
  ) {
    return new VehiculeDocs(vehicule, licensePlate, chassisCode, renavam);
  }
}
