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
  if (options.colorStyle === "jt") {
    options.color = jtColor;
  } else if (options.colorStyle === "jh") {
    options.color = jhColor;
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
  { type: "key", color: "#0A9648", text: null },
  { type: "array", color: "#F08080", text: "[arr]" },
  { type: "object", color: "#008000", text: "{obj}" },
  { type: "boolean", color: "#4dcebc", text: "0|1" },
  { type: "number", color: "#ad4dce", text: "Num" },
  { type: "null", color: "#808080", text: "Null" },
  { type: "string", color: "#fb3b05", text: "Str" },
];
const jhColor = [
  { type: "key", color: "#4a0", text: null },
  { type: "array", color: "#f63", text: "[arr]" },
  { type: "object", color: "#008000", text: "{obj}" },
  { type: "boolean", color: "#09c", text: "0|1" },
  { type: "number", color: "#cc00ff", text: "Num" },
  { type: "null", color: "#bb4", text: "Null" },
  { type: "string", color: "#fb3b05", text: "Str" },
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
  colorStyle: "jt",
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
};
