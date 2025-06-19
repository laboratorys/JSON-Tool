import { defineStore } from "pinia";
import { v5 } from "uuid";
export const useStore = defineStore("store", {
  state: () => ({
    global: { activeMenu: "token", menuCollapse: false },
    token: {
      withUppercase: true,
      withLowercase: true,
      withNumbers: true,
      withSymbols: true,
      length: 22,
    },
    uuid: {
      version: "V4",
      quantity: 1,
      namespace: { type: "DNS", value: v5.DNS },
      name: "",
      hyphens: true,
      uppercase: false,
      braces: false,
      quotes: false,
      commas: false,
      array: false,
      encoding: "none",
    },
    hash: {
      text: "",
      encoding: "Hex",
      uppercase: false,
    },
    code_formatter: {
      text: "",
      type: "json",
      minify: false,
      options: { indent_size: 2, space_in_empty_paren: true },
    },
  }),
  persist: true,
});
