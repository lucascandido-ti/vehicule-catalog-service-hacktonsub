import { EntitySchema } from "typeorm";

import { VehiculeDocs } from "@vcs/core/domain";

import { BaseEntitySchema } from "../utils";

export class VehiculeDocsTable extends VehiculeDocs {
  vehiculeId!: string;
}

export const VehiculeDocsSchema = new EntitySchema<VehiculeDocsTable>({
  target: VehiculeDocsTable,
  name: "VehiculeDocsSchema",
  tableName: "VehiculeDocs",
  columns: {
    ...BaseEntitySchema,
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
      primaryKeyConstraintName: "PK_VehiculeDocs",
    },
    vehiculeId: {
      type: "uuid",
    },
    license_plate: {
      type: String,
    },
    chassis_code: {
      type: String,
    },
    renavam: {
      type: String,
    },
  },
  relations: {
    vehicule: {
      type: "many-to-one",
      target: "VehiculeTable",
      inverseSide: "Vehicule",
      joinColumn: {
        name: "vehiculeId",
        referencedColumnName: "id",
        foreignKeyConstraintName: "FK_VehiculeDocs_Vehicule",
      },
      onDelete: "CASCADE",
      orphanedRowAction: "delete",
    },
  },
});
