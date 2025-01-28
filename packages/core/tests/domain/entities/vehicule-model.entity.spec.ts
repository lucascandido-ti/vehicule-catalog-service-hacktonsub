import { beforeAll, describe, expect, it } from "vitest";

import { Accessories, VehiculeBrand, VehiculeModel } from "@vcs/core/domain";

describe("VehiculeModel", () => {
  let mockBrand: VehiculeBrand;

  beforeAll(() => {
    mockBrand = new VehiculeBrand("Honda", "Marca Honda", "Japão");
  });

  it("should create an instance with correct properties", () => {
    const model = VehiculeModel.create(
      "Fit",
      "2005",
      "Gray",
      [Accessories.AirConditioning, Accessories.GPS],
      mockBrand,
    );

    expect(model).toBeInstanceOf(VehiculeModel);

    expect(model.name).toBe("Fit");
    expect(model.year).toBe("2005");
    expect(model.color).toBe("Gray");
    expect(model.accessories).toHaveLength(2);
  });

  it("should return the correct UUID (ID)", () => {
    const model = VehiculeModel.create(
      "Fit",
      "2005",
      "Gray",
      [Accessories.AirConditioning, Accessories.GPS],
      mockBrand,
    );

    expect(model).toBeInstanceOf(VehiculeModel);

    expect(model.name).toBe("Fit");
    expect(model.year).toBe("2005");
    expect(model.color).toBe("Gray");
    expect(model.accessories).toHaveLength(2);

    const mockId = "f46d0b58-360b-441f-881c-029aaccc70ac";
    (model as any).id = mockId;

    expect(model.uuid).toBe(mockId);
  });
});
