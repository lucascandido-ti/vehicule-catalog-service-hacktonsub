import { DataSource } from "typeorm";

import {
  VehiculeBrandSchema,
  VehiculeDocsSchema,
  VehiculeModelSchema,
  VehiculeModelVersionSchema,
  VehiculeSchema,
} from "../schema";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "vcsdatabase",
  username: "_user_aplic",
  password: "root",
  entities: [
    VehiculeSchema,
    VehiculeDocsSchema,
    VehiculeBrandSchema,
    VehiculeModelSchema,
    VehiculeModelVersionSchema,
  ],
  synchronize: true,
  subscribers: [],
});
