import { beforeAll, describe, expect, it } from "vitest";

import {
  Accessories,
  Price,
  Status,
  Vehicule,
  VehiculeBrand,
  VehiculeFavorite,
  VehiculeModel,
} from "@vcs/core/domain";

describe("VehiculeFavorite", () => {
  let mockVehicule: Vehicule;
  let mockBrand: VehiculeBrand;
  let mockModel: VehiculeModel;

  beforeAll(() => {
    mockBrand = new VehiculeBrand("Honda", "Marca Honda", "Japão");
    mockModel = new VehiculeModel(
      "Fit",
      "2005",
      "Gray",
      [Accessories.AirConditioning, Accessories.GPS],
      mockBrand,
    );
    mockVehicule = new Vehicule(
      mockBrand,
      mockModel,
      "Carro novo",
      new Price(19000),
      Status.AVAILABLE,
    );
  });

  it("should create an instance with correct properties", () => {
    const fav = VehiculeFavorite.create("1683e137-510a-476e-a322-c22c42c01c88", mockVehicule);

    expect(fav).toBeInstanceOf(VehiculeFavorite);

    expect(fav.user_id).toBe("1683e137-510a-476e-a322-c22c42c01c88");
    expect(fav.vehicule.brand.name).toBe("Honda");
  });

  it("should return the correct UUID (ID)", () => {
    const fav = VehiculeFavorite.create("1683e137-510a-476e-a322-c22c42c01c88", mockVehicule);

    expect(fav).toBeInstanceOf(VehiculeFavorite);

    const mockId = "f46d0b58-360b-441f-881c-029aaccc70ac";
    (fav as any).id = mockId;

    expect(fav.uuid).toBe(mockId);
  });
});
