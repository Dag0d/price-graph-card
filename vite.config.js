import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: {
    __PRICE_GRAPH_CARD_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
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
});
