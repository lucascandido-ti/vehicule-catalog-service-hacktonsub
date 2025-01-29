import { EntitySchema } from "typeorm";

import { VehiculeModelVersion } from "@vcs/core/domain";

import { BaseEntitySchema } from "../utils";

export class VehiculeModelVersionTable extends VehiculeModelVersion {
  modelId!: string;
}

export const VehiculeModelVersionSchema = new EntitySchema<VehiculeModelVersionTable>({
  target: VehiculeModelVersionTable,
  name: "VehiculeModelVersionSchema",
  tableName: "VehiculeModelVersion",
  columns: {
    ...BaseEntitySchema,
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
      primaryKeyConstraintName: "PK_VehiculeModelVersion",
    },
    modelId: {
      type: "uuid",
    },
    description: {
      type: String,
    },
  },
  relations: {
    model: {
      type: "many-to-one",
      target: "VehiculeModelTable",
      inverseSide: "VehiculeModel",
      joinColumn: {
        name: "modelId",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_VehiculeModelVersion_VehiculeModel",
      },
      onDelete: "CASCADE",
      orphanedRowAction: "delete",
    },
  },
});
