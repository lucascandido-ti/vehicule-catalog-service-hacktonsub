import { EntitySchema } from "typeorm";

import { VehiculeModel } from "@vcs/core/domain";

import { BaseEntitySchema } from "../utils";

export class VehiculeModelTable extends VehiculeModel {
  brandId!: string;
}

export const VehiculeModelSchema = new EntitySchema<VehiculeModelTable>({
  target: VehiculeModelTable,
  name: "VehiculeModelSchema",
  tableName: "VehiculeModel",
  columns: {
    ...BaseEntitySchema,
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
      primaryKeyConstraintName: "PK_VehiculeModel",
    },
    brandId: {
      type: "uuid",
    },
    name: {
      type: String,
    },
    year: {
      type: String,
    },
    color: {
      type: String,
    },
    accessories: {
      type: String,
    },
  },
  relations: {
    brand: {
      type: "one-to-one",
      target: "VehiculeBrandTable",
      inverseSide: "VehiculeBrand",
      joinColumn: {
        name: "brandId",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_VehiculeModel_VehiculeBrand",
      },
      onDelete: "CASCADE",
      orphanedRowAction: "delete",
    },
  },
});
