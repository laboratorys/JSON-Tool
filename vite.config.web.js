import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  root: "src/entries/json",
  plugins: [vue()],
  build: {
    outDir: "../../../dist/web", // 输出目录
    assetsDir: "assets", // 静态资源目录
    sourcemap: false, // 生产环境关闭 sourcemap
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
      "@": path.resolve(__dirname, "./src"), // 路径别名
    },
  },
  publicDir: path.resolve(__dirname, "src/static"),
  base: "./", // 基础路径，根据部署调整
});
