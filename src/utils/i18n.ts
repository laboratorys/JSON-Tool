// src/utils/i18n.ts
import { ref } from "vue";
import { setItem, getItem, defaultOptions } from "@/utils/common";
const supportedLocales = ["en", "zh_CN", "zh_TW"];
const currentLocale = ref("en");
const messages: any = {};
const isExtension =
  typeof browser !== "undefined" && browser.runtime && browser.runtime.id;
const loadAllLocales = (() => {
  let loaded = false;
  return async () => {
    if (loaded) return;
    try {
      await Promise.all(
        supportedLocales.map(async (locale) => {
          let response;
          if (isExtension) {
            response = await fetch(
              browser.runtime.getURL(`_locales/${locale}/messages.json` as any)
            );
          } else {
            response = await fetch(`/_locales/${locale}/messages.json`);
          }
          messages[locale] = await response?.json();
        })
      );
      loaded = true;
    } catch (error) {
      console.error("Error loading all locales:", error);
    }
  };
})();
const setLocale = (locale: string) => {
  if (supportedLocales.includes(locale)) {
    currentLocale.value = locale;
    getItem("options").then((v: any) => {
      let options = structuredClone(defaultOptions);
      if (v) {
        options = v;
      }
      options.lang = locale;
      //setItem("options", options);
    });
  }
};

const changeLocale = (locale: string) => {
  if (supportedLocales.includes(locale)) {
    currentLocale.value = locale;
    getItem("options").then((v: any) => {
      let options = structuredClone(defaultOptions);
      if (v) {
        options = v;
      }
      options.lang = locale;
      setItem("options", options);
    });
  }
};

const i18n = (key: string) => {
  return messages[currentLocale.value]?.[key]?.message || key;
};

const initLocale = async () => {
  return new Promise((resolve) => {
    getItem("options").then((v: any) => {
      let options = structuredClone(defaultOptions);
      if (v) {
        options = v;
      }
      if (options.lang && supportedLocales.includes(options.lang)) {
        currentLocale.value = options.lang;
      }
      resolve(currentLocale.value);
    });
  });
};

export {
  currentLocale,
  setLocale,
  changeLocale,
  i18n,
  supportedLocales,
  initLocale,
  loadAllLocales,
};
