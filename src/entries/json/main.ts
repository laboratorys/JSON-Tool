import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { loadAllLocales, initLocale } from "@/utils/i18n";
import { initTheme } from "@/utils/theme";
import { setJSONEngine } from "@/utils/common";
loadAllLocales().then(() => {
  initLocale().then(() => {
    initTheme().then(() => {
      setJSONEngine().then(() => {
        const app = createApp(App);
        app.mount("#app");
      });
    });
  });
});
