import { beforeAll, describe, expect, it } from "vitest";

import {
  Accessories,
  Price,
  Status,
  Vehicule,
  VehiculeBrand,
  VehiculeDocs,
  VehiculeModel,
} from "@vcs/core/domain";

describe("VehiculeDocs", () => {
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
    const docs = VehiculeDocs.create(mockVehicule, "AAA-9A99", "JFAS465SS4FG", "9999999999");

    expect(docs).toBeInstanceOf(VehiculeDocs);

    expect(docs.license_plate).toBe("AAA-9A99");
    expect(docs.chassis_code).toBe("JFAS465SS4FG");
    expect(docs.renavam).toBe("9999999999");
  });

  it("should return the correct UUID (ID)", () => {
    const docs = VehiculeDocs.create(mockVehicule, "AAA-9A99", "JFAS465SS4FG", "9999999999");

    expect(docs).toBeInstanceOf(VehiculeDocs);

    const mockId = "f46d0b58-360b-441f-881c-029aaccc70ac";
    (docs as any).id = mockId;

    expect(docs.uuid).toBe(mockId);
  });
});
