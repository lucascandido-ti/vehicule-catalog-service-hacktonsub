import z from "zod";

export * from ".";
export * from "./data-source";

export { default as datasource } from "./data-source";

export const BaseDataSourceConfig = z.object({
  logging: z.boolean().default(false),
});

export const OracleDataSourceConfig = BaseDataSourceConfig.extend({
  connectString: z.string().min(1),
  schema: z.string().optional(),
  username: z.string().min(1),
  password: z.string().min(1),
});
export type OracleDataSourceConfig = z.infer<typeof OracleDataSourceConfig>;

export const PostgresDataSourceConfig = BaseDataSourceConfig.extend({
  host: z.string().min(1),
  post: z.number().default(5432),
  username: z.string().min(1),
  password: z.string().min(1),
});

export type PostgresDataSourceConfig = z.infer<typeof PostgresDataSourceConfig>;

export const DataSourceConfig = z.discriminatedUnion("type", [
  PostgresDataSourceConfig.extend({ type: z.literal("postgres") }),
]);

export type DataSourceConfig = z.infer<typeof DataSourceConfig>;

export const DataModuleConfig = z.record(
  z.union([z.literal("default"), z.string().min(1)]),
  DataSourceConfig,
);

export type DataModuleConfig = z.infer<typeof DataModuleConfig>;
