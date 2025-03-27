import { ref } from "vue";
import { darkTheme, lightTheme, GlobalThemeOverrides } from "naive-ui";
import { getItem, defaultOptions } from "@/utils/common";
const mql = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = ref(lightTheme);
const setTheme = (t: string) => {
  if (t === "dark") {
    currentTheme.value = darkTheme;
  } else if (t === "light") {
    currentTheme.value = lightTheme;
  } else if (t === "auto") {
    currentTheme.value = mql.matches ? darkTheme : lightTheme;
  } else {
    currentTheme.value = mql.matches ? darkTheme : lightTheme;
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
const themeOverrides: GlobalThemeOverrides = {};
/**const themeOverrides2: GlobalThemeOverrides = {
  common: {
    primaryColor: " #70c0e8FF",
    primaryColorHover: " #8acbecFF",
    primaryColorPressed: " #66afd3FF",
    primaryColorSuppl: "rgb(56, 137, 197)",
  },
};*/
export { currentTheme, themeOverrides, setTheme, initTheme };
