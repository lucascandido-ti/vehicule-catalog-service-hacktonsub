import { Entity } from "@libs/ddd";

import { Accessories } from "../enums";
import { VehiculeBrand } from "./vehicule-brand.entity";

export class VehiculeModel extends Entity<string> {
  public readonly name: string;
  public readonly year: string;
  public readonly color: string;
  public readonly accessories: Accessories[];
  public readonly brand: VehiculeBrand;

  constructor(
    name: string,
    year: string,
    color: string,
    accessories: Accessories[],
    brand: VehiculeBrand,
  ) {
    super(undefined!);

    this.name = name;
    this.year = year;
    this.color = color;
    this.accessories = accessories;
    this.brand = brand;
  }

  public get uuid(): string {
    return this.id;
  }

  public static create(
    name: string,
    year: string,
    color: string,
    accessories: Accessories[],
    brand: VehiculeBrand,
  ) {
    return new VehiculeModel(name, year, color, accessories, brand);
  }
}
