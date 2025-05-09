import JSON5 from "json5";
import localForage from "localforage";
const getItem: any = async (k: string) => {
  return await localForage.getItem(`${k}`);
};
const setItem = async (k: any, v: any) => {
  const data = JSON.parse(JSON.stringify(v));
  await localForage.setItem(`${k}`, data);
};
let JT = JSON5 as any;

const setJSONEngine = async () => {
  let options = structuredClone(defaultOptions);
  const o = await getItem("options");
  if (o) {
    options = o;
  }
  if (options.parsingEngine === "json") {
    JT = JSON;
  } else if (options.parsingEngine === "json5") {
    JT = JSON5;
  } else {
    JT = JSON5;
  }
};
const setColor = async () => {
  let options = structuredClone(defaultOptions);
  const o = await getItem("options");
  if (o) {
    options = o;
  }
  if (options.colorStyle === "simple") {
    options.color = simpleColor;
  } else if (options.colorStyle === "jt") {
    options.color = jtColor;
  } else {
    options.color = options.customColor;
  }
  setItem("options", options);
};
const isBase64 = (str: string | null = null) => {
  if (str === null) {
    return false;
  }
  const base64Regex =
    /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64Regex.test(str)) return false;
  try {
    const decoded = atob(str);
    return btoa(decoded) === str;
  } catch (e) {
    return false;
  }
};
const isEncoded = (str: string | null = null) => {
  try {
    if (str === null) {
      return false;
    }
    const decoded = decodeURIComponent(str);
    return decoded !== str;
  } catch (e) {
    return false;
  }
};
const getLastArrayIndexFromPath = (path: string) => {
  const parts = path.split(/[\[\].]/).filter(Boolean);
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  return null;
};
const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};
const jtColor = [
  { type: "key", dark: "#63e2b7", light: "#006633", text: null },
  { type: "array", dark: "#F0E68C", light: "#6B4E31", text: "[Arr]" },
  { type: "object", dark: "#F06292", light: "#AD1457", text: "{Ojb}" },
  { type: "boolean", dark: "#26A69A", light: "#004D40", text: "T|F" },
  { type: "number", dark: "#CE93D8", light: "#AB47BC", text: "Num" },
  { type: "null", dark: "#B0BEC5", light: "#616161", text: "Null" },
  { type: "string", dark: "#E57373", light: "#B71C1C", text: "Str" },
];
const simpleColor = [
  { type: "key", dark: "#FFFFFF", light: "#111111", text: null },
  { type: "array", dark: "#FFFFFF", light: "#111111", text: "[Arr]" },
  { type: "object", dark: "#FFFFFF", light: "#111111", text: "{Ojb}" },
  { type: "boolean", dark: "#FC1E70", light: "#FC1E70", text: "T|F" },
  { type: "number", dark: "#FC1E70", light: "#FC1E70", text: "Num" },
  { type: "null", dark: "#B0BEC5", light: "#616161", text: "Null" },
  { type: "string", dark: "#42B983", light: "#42B983", text: "Str" },
];
const defaultOptions = {
  renderSwitch: true,
  renderTypes: ["JSON"],
  contextMenus: true,
  showPannel: ["leftClick"],
  lang: "en",
  theme: "auto",
  openJTMode: "window",
  parsingEngine: "json",
  saveCollapseStatus: true,
  sortKeys: false,
  treeExpandMode: true,
  showLengthMode: "arr",
  hotKeys: ["ctrl_k", "ctrl_s"],
  colorStyle: "simple",
  customColor: jtColor,
  color: jtColor,
};
const encodeKey = (key: string) => {
  return encodeURIComponent(key)
    .replace(/\./g, "%2E") // 强制编码点号
    .replace(/\//g, "%2F") // 可选：编码斜杠
    .replace(/\[/g, "%5B") // 可选：编码方括号
    .replace(/\]/g, "%5D");
};
//字符串清理：前后引号
const strClean = (v: any) => {
  return String(v.replace(/^['"]|['"]$/g, ""));
};
export {
  getItem,
  setItem,
  setColor,
  setJSONEngine,
  defaultOptions,
  jhColor,
  JT,
  isBase64,
  isEncoded,
  getLastArrayIndexFromPath,
  isValidUrl,
  encodeKey,
  strClean,
};
