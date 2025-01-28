import { describe, expect, it } from "vitest";

import {
  Accessories,
  Price,
  Status,
  Vehicule,
  VehiculeBrand,
  VehiculeModel,
} from "@vcs/core/domain";

describe("Vehicule", () => {
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
  });

  it("should be able create a valid VehiculeBrand", () => {
    const vehicule = Vehicule.create(
      mockBrand,
      mockModel,
      "Carro novo",
      new Price(19000),
      Status.AVAILABLE,
    );

    expect(vehicule).toBeInstanceOf(Vehicule);

    expect(vehicule.description).toBe("Carro novo");
    expect(vehicule.price.getValue()).toBe(19000);
    expect(vehicule.brand.name).toBe("Honda");
    expect(vehicule.model.name).toBe("Fit");
  });

  it("should return the correct UUID (ID)", () => {
    const vehicule = Vehicule.create(
      mockBrand,
      mockModel,
      "Carro novo",
      new Price(19000),
      Status.AVAILABLE,
    );

    expect(vehicule).toBeInstanceOf(Vehicule);

    expect(vehicule.description).toBe("Carro novo");
    expect(vehicule.price.getValue()).toBe(19000);
    expect(vehicule.brand.name).toBe("Honda");
    expect(vehicule.model.name).toBe("Fit");

    const mockId = "f46d0b58-360b-441f-881c-029aaccc70ac";
    (vehicule as any).id = mockId;

    expect(vehicule.uuid).toBe(mockId);
  });
});
