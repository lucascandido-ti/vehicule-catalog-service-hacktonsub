import { EntitySchema } from "typeorm";

import { VehiculeBrand } from "@vcs/core/domain";

import { BaseEntitySchema } from "../utils";

export class VehiculeBrandTable extends VehiculeBrand {}

export const VehiculeBrandSchema = new EntitySchema<VehiculeBrandTable>({
  target: VehiculeBrandTable,
  name: "VehiculeBrandSchema",
  tableName: "VehiculeBrand",
  columns: {
    ...BaseEntitySchema,
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
      primaryKeyConstraintName: "PK_VehiculeBrand",
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    headquarters: {
      type: String,
    },
  },
});
