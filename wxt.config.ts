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
    permissions: ["activeTab", "clipboardWrite", "contextMenus", "downloads"],
    action: {},
    web_accessible_resources: [
      {
        resources: ["json.html", "tools.html"],
        matches: ["*://*/*", "file:///*"],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: "json-tool@example.com",
      },
    },
    commands: {
      open_json_tool: {
        suggested_key: {
          windows: "Alt+Shift+J",
          mac: "Alt+Shift+J",
        },
        description: "JSON-Tool快捷键",
        global: false,
      },
      open_dev_tool: {
        suggested_key: {
          windows: "Alt+Shift+D",
          mac: "Alt+Shift+D",
        },
        description: "Dev-Tool快捷键",
        global: false,
      },
    },
  },
});
