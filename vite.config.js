import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

// Local builds go to build/ (ignored). Only the Gitea workflows build the published dist/ bundle
// via `npm run build:release`, so a locally generated bundle can never end up in dist/.
export default defineConfig(({ mode }) => ({
  define: {
    __PRICE_GRAPH_CARD_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: mode === "release" ? "dist" : "build",
    emptyOutDir: true,
    minify: "oxc",
    sourcemap: false,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "price-graph-card.js",
    },
    rolldownOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
}));
