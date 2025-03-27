import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-vue"],
  srcDir: "src",
  outDir: "dist",
  entrypointsDir: "entries",
  publicDir: "static",
  manifest: {
    default_locale: "en",
    permissions: ["storage", "activeTab", "clipboardWrite", "contextMenus"],
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
