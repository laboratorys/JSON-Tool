import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  root: "src/entries/json",
  plugins: [vue()],
  build: {
    outDir: "../../../dist/web",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/entries/json/index.html"),
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: {
          vendor: ["vue", "naive-ui"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: path.resolve(__dirname, "src/static"),
  base: "./",
});
