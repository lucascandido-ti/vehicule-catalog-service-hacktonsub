import { Entity } from "@libs/ddd";
import { Vehicule } from "../aggregates";

export class VehiculeFavorite extends Entity<string> {
  public readonly user_id: string;
  public readonly vehicule: Vehicule;

  constructor(userId: string, vehicule: Vehicule) {
    super(undefined!);

    this.user_id = userId;
    this.vehicule = vehicule;
  }

  public get uuid(): string {
    return this.id;
  }

  public static create(userId: string, vehicule: Vehicule) {
    return new VehiculeFavorite(userId, vehicule);
  }
}
