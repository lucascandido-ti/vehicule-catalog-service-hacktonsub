import { beforeAll, describe, expect, it } from "vitest";

import { Accessories, VehiculeBrand, VehiculeModel, VehiculeModelVersion } from "@vcs/core/domain";

describe("VehiculeModelVersion", () => {
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

  it("should create an instance with correct properties", () => {
    const version = VehiculeModelVersion.create("1.4 LX 8V GASOLINA 4P MANUAL", mockModel);

    expect(version).toBeInstanceOf(VehiculeModelVersion);

    expect(version.description).toBe("1.4 LX 8V GASOLINA 4P MANUAL");
    expect(version.model.name).toBe("Fit");
    expect(version.model.brand.name).toBe("Honda");
  });

  it("should return the correct UUID (ID)", () => {
    const version = VehiculeModelVersion.create("1.4 LX 8V GASOLINA 4P MANUAL", mockModel);

    expect(version).toBeInstanceOf(VehiculeModelVersion);

    expect(version.description).toBe("1.4 LX 8V GASOLINA 4P MANUAL");
    expect(version.model.name).toBe("Fit");
    expect(version.model.brand.name).toBe("Honda");

    const mockId = "f46d0b58-360b-441f-881c-029aaccc70ac";
    (version as any).id = mockId;

    expect(version.uuid).toBe(mockId);
  });
});
