import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { loadAllLocales, initLocale } from "@/utils/i18n";
import { initTheme } from "@/utils/theme";
import { setJSONEngine } from "@/utils/common";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "highlight.js/styles/stackoverflow-light.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const pages: Record<string, { default: Component }> = import.meta.glob(
  "./pages/*.vue",
  {
    eager: true,
  }
);
loadAllLocales().then(() => {
  initLocale().then(() => {
    initTheme().then(() => {
      setJSONEngine().then(() => {
        const app = createApp(App);
        for (const path in pages) {
          const component = pages[path].default;
          const name =
            path
              .split("/")
              .pop()
              ?.replace(/\.vue$/, "") || "UnknownComponent";

          if (!name) continue;
          app.component(name.toLowerCase(), component);
        }
        app.use(pinia);
        app.use(hljsVuePlugin);
        app.mount("#app");
      });
    });
  });
});
