import { describe, expect, it } from "vitest";

import { VehiculeBrand } from "@vcs/core/domain";

describe("VehiculeBrand", () => {
  it("should create an instance with correct properties", () => {
    const brand = VehiculeBrand.create(
      "Honda",
      "Marca Honda",
      "Minato, Metrópole de Tóquio, Japão",
    );

    expect(brand).toBeInstanceOf(VehiculeBrand);

    expect(brand.name).toBe("Honda");
    expect(brand.description).toBe("Marca Honda");
    expect(brand.headquarters).toBe("Minato, Metrópole de Tóquio, Japão");
  });

  it("should return the correct UUID (ID)", () => {
    const brand = VehiculeBrand.create(
      "Honda",
      "Marca Honda",
      "Minato, Metrópole de Tóquio, Japão",
    );

    expect(brand).toBeInstanceOf(VehiculeBrand);

    expect(brand.name).toBe("Honda");
    expect(brand.description).toBe("Marca Honda");
    expect(brand.headquarters).toBe("Minato, Metrópole de Tóquio, Japão");

    const mockId = "f46d0b58-360b-441f-881c-029aaccc70ac";
    (brand as any).id = mockId;

    expect(brand.uuid).toBe(mockId);
  });
});
