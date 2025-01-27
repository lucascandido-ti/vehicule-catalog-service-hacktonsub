import { defineConfig } from "vitest/config";

import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    include: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
  },
  plugins: [swc.vite(), tsconfigPaths()],
});
