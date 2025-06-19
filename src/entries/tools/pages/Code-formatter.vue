<template>
  <n-flex vertical :size="1">
    <ToolHeader
      title="Code formatter"
      description="Prettify your XML/JSON/CSS/HTML/Javascript/SQL string into a friendly, human-readable format."
      width="1200px" />
    <div class="tool-content" style="width: 1200px">
      <n-flex
        ><n-button
          v-for="t in types"
          :key="t"
          :type="store.code_formatter.type == t ? 'primary' : ''"
          @click="changeCodeType(t)"
          >{{ t.toUpperCase() }}</n-button
        ></n-flex
      >
      <n-grid x-gap="15" :cols="cols">
        <n-gi
          ><n-card :bordered="false" embedded>
            <n-form-item label="Your Code">
              <n-input
                v-model:value="store.code_formatter.text"
                type="textarea"
                autofocus
                :spellcheck="false"
                clearable
                placeholder="Your text to format..."
                :autosize="{ minRows: 10, maxRows: 20 }" />
            </n-form-item>
          </n-card>
        </n-gi>
        <n-gi
          ><n-card
            :bordered="false"
            embedded
            :class="{ 'dark-theme': currentTheme.name === 'dark' }">
            <highlightjs
              class="pretty-xml-wrapper"
              v-if="textValidation.isValid"
              :code="formatedContent"></highlightjs>
            <n-text v-else type="error">{{ textValidation.message }}</n-text>
            <n-flex justify="center" align="center" style="margin-top: 15px">
              <n-switch
                size="large"
                v-model:value="store.code_formatter.minify">
                <template #checked>minify</template>
                <template #unchecked>format</template>
              </n-switch>
              <n-button @click="copy(formatedContent)">Copy</n-button>
            </n-flex>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </n-flex>
</template>
<script lang="ts" setup>
import {
  NFlex,
  NGrid,
  NGi,
  NCard,
  NFormItem,
  NInput,
  NText,
  NButton,
  NSwitch,
} from "naive-ui";
import { currentTheme } from "@/utils/theme";
import ToolHeader from "../components/ToolHeader.vue";
import { useStore } from "../store";
import { js_beautify, css_beautify, html_beautify } from "js-beautify";
import { format as sqlFormat } from "sql-formatter";
import xmlFormat from "xml-formatter";
import { minify } from "terser";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { computedRefreshable } from "@/utils/computedRefreshable";
const highlightjs = hljsVuePlugin.component;
const store = useStore();
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const copy = (copyText: any) => {
  try {
    toClipboard(copyText);
    const { message } = getDiscreteApi();
    message.success(`Content copied success!`);
  } catch (e) {}
};
const cols = ref(2);
const types = ["json", "xml", "js", "html", "css", "sql"];
const formatters = {
  xml: () =>
    html_beautify(store.code_formatter.text, store.code_formatter.options),
  json: () =>
    js_beautify(store.code_formatter.text, store.code_formatter.options),
  html: () =>
    html_beautify(store.code_formatter.text, store.code_formatter.options),
  css: () =>
    css_beautify(store.code_formatter.text, store.code_formatter.options),
  sql: () => sqlFormat(store.code_formatter.text),
  js: () =>
    js_beautify(store.code_formatter.text, store.code_formatter.options),
};
const minifiers = {
  xml: () =>
    xmlFormat.minify(store.code_formatter.text, {
      collapseContent: true,
    }),
  json: () => JSON.stringify(JSON.parse(store.code_formatter.text), null, 0),
  html: () => {
    let html = store.code_formatter.text;
    html = html.replace(/<!--[\s\S]*?-->/g, "");
    html = html.replace(/>\s+</g, "><");
    html = html.replace(/\s{2,}/g, " ");
    html = html.replace(/\s*<\s*/g, "<");
    html = html.replace(/\s*>\s*/g, ">");
    html = html.replace(/^\s+|\s+$/gm, "");
    return html.trim();
  },
  css: () => {
    return store.code_formatter.text
      .replace(/\s*\{\s*/g, "{")
      .replace(/\s*\}\s*/g, "}")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*;\s*/g, ";")
      .replace(/\s*,\s*/g, ",")
      .replace(/\n+/g, "")
      .replace(/\s+/g, " ")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();
  },
  sql: () => {
    return store.code_formatter.text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/--.*$/gm, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([,;()=<>!+-])\s*/g, "$1")
      .trim();
  },
  js: () => {
    return store.code_formatter.text
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([=+\-*\/%&|^!<>?:;,{}()[\]])\s*/g, "$1")
      .trim();
  },
};
type CodeFormatters = {
  xml: () => string;
  json: () => string;
  html: () => string;
  css: () => string;
  sql: () => string;
  js: () => string;
};
type CodeValidate = {
  xml: () => void;
  json: () => void;
  html: () => void;
  css: () => void;
  sql: () => void;
  js: () => void;
};
const validateContent = {
  xml: () => {
    const xmlStr = store.code_formatter.text.trim();
    if (!xmlStr) {
      textValidation.value = { isValid: false, status: "", message: "" };
      return;
    }
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        textValidation.value = {
          isValid: false,
          status: "error",
          message: `Invalid XML: ${parserError.textContent || "Unknown error"}`,
        };
      } else {
        textValidation.value = {
          isValid: true,
          status: "success",
          message: "",
        };
      }
    } catch (e: any) {
      textValidation.value = {
        isValid: false,
        status: "error",
        message: `Invalid XML: ${e.message || "Parsing failed"}`,
      };
    }
  },
  json: () => {
    try {
      const jsonStr = store.code_formatter.text.trim();
      if (!jsonStr) {
        textValidation.value = { isValid: false, status: "", message: "" };
        return;
      }
      JSON.parse(store.code_formatter.text);
    } catch (e: any) {
      textValidation.value = {
        isValid: false,
        status: "error",
        message: `Invalid JSON: ${e.message || "Parsing failed"}`,
      };
    }
  },
  html: () => {
    try {
      const str = store.code_formatter.text.trim();
      if (!str) {
        textValidation.value = { isValid: false, status: "", message: "" };
        return;
      }
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        store.code_formatter.text,
        "text/html"
      );
      return !doc.getElementsByTagName("parsererror").length;
    } catch (e: any) {
      textValidation.value = {
        isValid: false,
        status: "error",
        message: `Invalid HTML: ${e.message || "Parsing failed"}`,
      };
    }
  },
  css: () => {
    const str = store.code_formatter.text.trim();
    if (!str) {
      textValidation.value = { isValid: false, status: "", message: "" };
      return;
    }
  },
  sql: () => {
    const str = store.code_formatter.text.trim();
    if (!str) {
      textValidation.value = { isValid: false, status: "", message: "" };
      return;
    }
  },
  js: () => {
    const str = store.code_formatter.text.trim();
    if (!str) {
      textValidation.value = { isValid: false, status: "", message: "" };
      return;
    }
  },
};
const textValidation = ref({
  isValid: true,
  status: "" as "error" | "success" | "",
  message: "",
});
const [formatedContent] = computedRefreshable(() =>
  withDefaultOnError(() => {
    const type = store.code_formatter.type as keyof CodeFormatters;
    textValidation.value = {
      isValid: true,
      status: "" as "error" | "success" | "",
      message: "",
    };
    validateContent[store.code_formatter.type as keyof CodeValidate]();
    const formatter = formatters[type] ?? formatters.json;
    const minifier = minifiers[type] ?? minifiers.json;
    return store.code_formatter.minify ? minifier() : formatter();
  }, "")
);
const updateCols = () => {
  window.addEventListener("resize", () => {
    cols.value = window.innerWidth > 1465 ? 2 : 1;
  });
};
onMounted(() => {
  updateCols();
});
onUnmounted(() => {
  window.removeEventListener("resize", updateCols);
});
const changeCodeTheme = (val: string) => {
  document.getElementsByTagName("html")[0].dataset.codeTheme = val;
};
changeCodeTheme(
  currentTheme.value.name === "dark" ? "a11y-dark" : "a11y-light"
);
const changeCodeType = (t: string) => {
  store.code_formatter.text = "";
  store.code_formatter.type = t;
};
</script>
<style scoped>
.pretty-xml-wrapper {
  overflow-x: auto;
  max-width: 100%;
  line-height: 1.5;
  max-height: 54vh;
}
</style>
