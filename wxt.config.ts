import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  srcDir: "src",
  outDir: "dist",
  entrypointsDir: "entries",
  publicDir: "src/static",
  manifest: {
    default_locale: "en",
    permissions: [
      "storage",
      "activeTab",
      "clipboardWrite",
      "contextMenus",
      "downloads",
    ],
    action: {},
    web_accessible_resources: [
      {
        resources: ["json.html"],
        matches: ["*://*/*", "file:///*"],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: "json-tool@example.com",
      },
    },
  },
});
