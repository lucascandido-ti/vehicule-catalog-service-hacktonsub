import { EntitySchema } from "typeorm";

import { Status, Vehicule } from "@vcs/core/domain";

import { BaseEntitySchema } from "../utils";

export class VehiculeTable extends Vehicule {
  brandId!: string;
  modelId!: string;
  versionId!: string;
}

export const VehiculeSchema = new EntitySchema<VehiculeTable>({
  target: VehiculeTable,
  name: "VehiculeSchema",
  tableName: "Vehicule",
  columns: {
    ...BaseEntitySchema,
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
      primaryKeyConstraintName: "PK_Vehicule",
    },
    brandId: {
      type: "uuid",
    },
    modelId: {
      type: "uuid",
    },
    versionId: {
      type: "uuid",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    status: {
      type: "enum",
      enum: Status,
      enumName: "Status",
    },
  },
  relations: {
    brand: {
      type: "many-to-one",
      target: "VehiculeBrandTable",
      inverseSide: "VehiculeBrand",
      joinColumn: {
        name: "brandId",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_Vehicule_VehiculeBrand",
      },
      onDelete: "CASCADE",
      orphanedRowAction: "delete",
    },
    model: {
      type: "many-to-one",
      target: "VehiculeModelTable",
      inverseSide: "VehiculeModel",
      joinColumn: {
        name: "modelId",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_Vehicule_VehiculeModel",
      },
      onDelete: "CASCADE",
      orphanedRowAction: "delete",
    },
    version: {
      type: "many-to-one",
      target: "VehiculeModelVersionTable",
      inverseSide: "VehiculeModelVersion",
      joinColumn: {
        name: "versionId",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_Vehicule_VehiculeModelVersion",
      },
      onDelete: "CASCADE",
      orphanedRowAction: "delete",
    },
  },
});
