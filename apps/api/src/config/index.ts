import fs from "node:fs";
import path from "node:path";

import z from "zod";

import { ApiConfig } from "./api.config";

export * from "./api.config";

export const Config = z.object({
  port: z.coerce.number().default(3333),
  globalPrefix: z.string().nullable().default("api"),
  api: ApiConfig,
});

export type Config = z.infer<typeof Config>;

export function readConfig(configFile: string): Config {
  let configJson: Record<string, unknown>;

  try {
    const configPath = path.join(process.cwd(), configFile);

    const configString = fs.readFileSync(configPath, { encoding: "utf-8" });

    configJson = JSON.parse(configString);
  } catch {
    configJson = {};
  }

  const result = Config.safeParse(configJson);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
