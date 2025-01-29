import { Entity } from "@libs/ddd";
import { EntitySchemaColumnOptions } from "typeorm";

export type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type EntityProps = NonFunctionPropertyNames<Entity<number>>;

export const BaseEntitySchema = {
  id: {
    type: Number,
    primary: true,
    generated: "increment",
  },
  createdAt: {
    type: "timestamp with time zone",
    createDate: true,
  },
  updatedAt: {
    type: "timestamp with time zone",
    updateDate: true,
  },
} satisfies Record<EntityProps, EntitySchemaColumnOptions>;
