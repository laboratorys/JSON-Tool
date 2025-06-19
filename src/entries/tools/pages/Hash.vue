<template>
  <n-flex vertical :size="1">
    <ToolHeader
      title="Hash text"
      description="Hash a text string using the function you need : MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3 or RIPEMD160" />
    <div class="tool-content">
      <n-grid x-gap="12" :cols="1">
        <n-gi>
          <n-flex justify="center"
            ><n-card :bordered="false" embedded>
              <n-form-item label="Your text to hash">
                <n-input
                  v-model:value="store.hash.text"
                  type="textarea"
                  autofocus
                  :spellcheck="false"
                  clearable
                  placeholder="Your text to hash..."
                  :autosize="{ minRows: 3, maxRows: 3 }" />
              </n-form-item>
              <n-form-item label="Digest encoding">
                <n-select
                  v-model:value="store.hash.encoding"
                  :options="encodingOptions"
                  style="width: 80%" />
                <n-checkbox
                  v-model:checked="store.hash.uppercase"
                  style="margin-left: 10px; width: 20%">
                  Uppercase
                </n-checkbox>
              </n-form-item>
              <n-flex vertical>
                <n-input-group v-for="algo in algoNames" :key="algo">
                  <n-button> {{ algo }} </n-button>
                  <n-input :value="hashText(algo, store.hash.text)" readonly>
                    <template #suffix>
                      <n-popover trigger="hover" :show-arrow="false">
                        <template #trigger>
                          <n-button
                            type="primary"
                            text
                            circle
                            @click="
                              copy(hashText(algo, store.hash.text), algo)
                            ">
                            <template #icon> <CopyIcon /> </template>
                          </n-button>
                        </template>
                        <span>{{ mm[algo] }}</span>
                      </n-popover>
                    </template>
                  </n-input>
                </n-input-group>
              </n-flex>
            </n-card>
          </n-flex>
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
  NSelect,
  NInputGroup,
  NButton,
  NPopover,
  NCheckbox,
} from "naive-ui";
import {
  MD5,
  RIPEMD160,
  SHA1,
  SHA224,
  SHA256,
  SHA3,
  SHA384,
  SHA512,
  enc,
  type lib,
} from "crypto-js";
import ToolHeader from "../components/ToolHeader.vue";
import { useStore } from "../store";
import CopyIcon from "../icon/Copy.vue";
const store = useStore();
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const encodingOptions = [
  {
    label: "Binary (base 2)",
    value: "Bin",
  },
  {
    label: "Hexadecimal (base 16)",
    value: "Hex",
  },
  {
    label: "Base64 (base 64)",
    value: "Base64",
  },
  {
    label: "Base64url (base 64 with url safe chars)",
    value: "Base64url",
  },
];
const algos = {
  MD5,
  SHA1,
  SHA256,
  SHA224,
  SHA512,
  SHA384,
  SHA3,
  RIPEMD160,
} as const;
type AlgoNames = keyof typeof algos;
type Encoding = keyof typeof enc | "Bin";
const algoNames = Object.keys(algos) as AlgoNames[];
const mm = ref(
  Object.fromEntries(
    (Object.keys(algos) as AlgoNames[]).map((k) => [k, "Copy to clipboard"])
  ) as { [K in AlgoNames]: string }
);
const convertHexToBin = (hex: string) => {
  return hex
    .trim()
    .split("")
    .map((byte) => Number.parseInt(byte, 16).toString(2).padStart(4, "0"))
    .join("");
};
const formatWithEncoding = (words: lib.WordArray, encoding: Encoding) => {
  if (encoding === "Bin") {
    return convertHexToBin(words.toString(enc.Hex));
  }

  return store.hash.uppercase
    ? words.toString(enc[encoding]).toUpperCase()
    : words.toString(enc[encoding]);
};
const hashText = (algo: AlgoNames, value: string) =>
  formatWithEncoding(algos[algo](value), store.hash.encoding);

const copy = (copyText: any, algo: AlgoNames) => {
  try {
    toClipboard(copyText);
    mm.value[algo] = "Copied!";
    const message = "Copy to clipboard";
    setTimeout(
      (msg) => {
        mm.value[algo] = msg;
      },
      1000,
      message
    );
  } catch (e) {}
};
</script>
<style scoped></style>
