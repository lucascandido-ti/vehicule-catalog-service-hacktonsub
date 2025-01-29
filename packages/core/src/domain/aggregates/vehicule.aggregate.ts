import { AggregateRoot } from "@libs/ddd";

import { Price } from "../value-objects";
import { Status } from "../enums";

import { VehiculeBrand, VehiculeModel, VehiculeModelVersion } from "../entities";

export class Vehicule extends AggregateRoot<string> {
  public readonly brand: VehiculeBrand;
  public readonly model: VehiculeModel;
  public readonly version: VehiculeModelVersion;
  public readonly description: string;
  public readonly price: Price;
  public readonly status: Status;

  constructor(
    brand: VehiculeBrand,
    model: VehiculeModel,
    version: VehiculeModelVersion,
    description: string,
    price: Price,
    status: Status,
  ) {
    super(undefined!);

    this.brand = brand;
    this.model = model;
    this.version = version;
    this.description = description;
    this.price = price;
    this.status = status;
  }

  public get uuid(): string {
    return this.id;
  }

  public static create(
    brand: VehiculeBrand,
    model: VehiculeModel,
    version: VehiculeModelVersion,
    description: string,
    price: Price,
    status: Status,
  ): Vehicule {
    return new Vehicule(brand, model, version, description, price, status);
  }
}
