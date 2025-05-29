import { ref, shallowRef } from "vue";
import { darkTheme, lightTheme, GlobalThemeOverrides } from "naive-ui";
import { getItem, setItem, defaultOptions } from "@/utils/common";
import DarkIcon from "@/entries/json/icon/Dark.vue";
import LightIcon from "@/entries/json/icon/Light.vue";
import AutoIcon from "@/entries/json/icon/Auto.vue";

const mql = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = ref(lightTheme);
const currentThemeIcon = shallowRef(LightIcon);
const setTheme = (t: string) => {
  if (t === "dark") {
    currentTheme.value = darkTheme;
    currentThemeIcon.value = DarkIcon;
  } else if (t === "light") {
    currentTheme.value = lightTheme;
    currentThemeIcon.value = LightIcon;
  } else if (t === "auto") {
    currentTheme.value = mql.matches ? darkTheme : lightTheme;
    currentThemeIcon.value = AutoIcon;
  } else {
    currentTheme.value = mql.matches ? darkTheme : lightTheme;
    currentThemeIcon.value = AutoIcon;
  }
};
const initTheme = async () => {
  let options = structuredClone(defaultOptions);
  const o = await getItem("options");
  if (o) {
    options = o;
  }
  setTheme(options.theme);
};
const changeTheme = async () => {
  var key = "auto";
  let options = structuredClone(defaultOptions);
  const o = await getItem("options");
  if (o) {
    options = o;
  }
  if (options.theme === "auto") {
    key = "light";
  } else if (options.theme === "light") {
    key = "dark";
  } else if (options.theme === "dark") {
    key = "auto";
  }
  options.theme = key;
  setTheme(options.theme);
  await setItem("options", options);
};
const themeOverrides: GlobalThemeOverrides = {};
/**const themeOverrides2: GlobalThemeOverrides = {
  common: {
    primaryColor: " #70c0e8FF",
    primaryColorHover: " #8acbecFF",
    primaryColorPressed: " #66afd3FF",
    primaryColorSuppl: "rgb(56, 137, 197)",
  },
};*/
export {
  currentTheme,
  currentThemeIcon,
  themeOverrides,
  setTheme,
  initTheme,
  changeTheme,
};
