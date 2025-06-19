<template>
  <n-flex vertical :size="1">
    <ToolHeader
      title="UUID generator"
      description="A Universally Unique Identifier (UUID) is a 128-bit number used to identify information in computer systems. The number of possible UUIDs is 16^32, which is 2^128 or about 3.4x10^38 (which is a lot!)." />
    <div class="tool-content">
      <n-grid x-gap="12" :cols="1">
        <n-gi>
          <n-flex justify="center"
            ><n-card :bordered="false" embedded>
              <n-form
                label-placement="left"
                size="large"
                ref="formRef"
                :rules="rules">
                <n-form-item label="UUID Version">
                  <n-flex>
                    <n-button
                      strong
                      secondary
                      v-for="item in versions"
                      :type="
                        store.uuid.version === item ? 'success' : 'default'
                      "
                      @click="handleVersionChange(item)">
                      {{ item }}</n-button
                    >
                  </n-flex></n-form-item
                >
                <n-form-item label="Quantity(1-100)">
                  <n-input-number
                    v-model:value="store.uuid.quantity"
                    :step="1"
                    :min="1"
                    :max="100"
                    :style="{ width: '200px' }"
                    :readonly="
                      store.uuid.version === 'V3' || store.uuid.version === 'V5'
                    " />
                </n-form-item>
                <n-form-item
                  label="Namespace"
                  v-if="
                    store.uuid.version === 'V3' || store.uuid.version === 'V5'
                  ">
                  <n-flex>
                    <n-button
                      v-for="item in namespaces"
                      strong
                      secondary
                      :type="
                        store.uuid.namespace.type === item
                          ? 'success'
                          : 'default'
                      "
                      @click="handleNamespaceChange(item)">
                      {{ item }}</n-button
                    >
                  </n-flex></n-form-item
                >
                <n-form-item
                  v-if="
                    store.uuid.version === 'V3' || store.uuid.version === 'V5'
                  "
                  path="namespace"
                  feedback-style="padding-left: 98px;">
                  <n-input
                    v-model:value="store.uuid.namespace.value"
                    placeholder="Namespace"
                    :readonly="nsValueReadeOnlyRef"
                    :spellcheck="false"
                    :style="{ marginLeft: '98px' }" />
                </n-form-item>
                <n-form-item
                  label="Name"
                  v-if="
                    store.uuid.version === 'V3' || store.uuid.version === 'V5'
                  "
                  :spellcheck="false"
                  path="name">
                  <n-input v-model:value="store.uuid.name" placeholder="Name" />
                </n-form-item>
                <n-form-item label="Format">
                  <n-flex align="center">
                    <n-checkbox v-model:checked="store.uuid.hyphens">
                      Hyphens
                    </n-checkbox>
                    <n-checkbox v-model:checked="store.uuid.uppercase">
                      Uppercase
                    </n-checkbox>
                    <n-checkbox v-model:checked="store.uuid.commas">
                      , Commas
                    </n-checkbox>
                    <n-checkbox v-model:checked="store.uuid.quotes">
                      " " Quotes
                    </n-checkbox>
                    <n-checkbox v-model:checked="store.uuid.braces">
                      {} Braces
                    </n-checkbox>
                    <n-checkbox v-model:checked="store.uuid.array">
                      [] JSON Array
                    </n-checkbox>
                  </n-flex>
                </n-form-item>
                <n-form-item label="Encoding">
                  <n-radio-group
                    v-model:value="store.uuid.encoding"
                    name="encodinggroup"
                    size="medium">
                    <n-radio-button
                      v-for="e in encodingGroup"
                      :key="e.value"
                      :value="e.value">
                      {{ e.label }}
                    </n-radio-button>
                  </n-radio-group>
                </n-form-item>
              </n-form>
              <n-card
                v-if="uuids != ''"
                content-style="padding: 5px;max-height: 300px;
                      overflow-y: auto;">
                <n-flex justify="center">
                  <n-text
                    style="white-space: pre-wrap; font-size: 16px"
                    storng
                    >{{ uuids }}</n-text
                  >
                </n-flex>
              </n-card>
              <n-flex justify="center" style="margin-top: 20px">
                <n-button @click="copy(uuids)">Copy</n-button>
                <n-button type="primary" @click="refreshUUIDs">
                  Refresh
                </n-button></n-flex
              >
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
  NText,
  NGrid,
  NGi,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NInputNumber,
  NCheckbox,
  NRadioGroup,
  NRadioButton,
  type FormInst,
  type FormItemRule,
} from "naive-ui";
import ToolHeader from "../components/ToolHeader.vue";
import { useStore } from "../store";
import {
  v1 as generateUuidV1,
  v3 as generateUuidV3,
  v4 as generateUuidV4,
  v5 as generateUuidV5,
  v6 as generateUuidV6,
  NIL as nilUuid,
  validate as uuidValidate,
} from "uuid";
import { computedRefreshable } from "@/utils/computedRefreshable";
import { withDefaultOnError } from "@/utils/defaults";
import { getDiscreteApi } from "@/utils/message";
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const copy = (copyText: any) => {
  try {
    toClipboard(copyText);
    const { message } = getDiscreteApi();
    message.success(`Content copied success!`);
  } catch (e) {}
};
const formRef = ref<FormInst | null>(null);
const store = useStore();
const versions = ["Nil", "V1", "V3", "V4", "V5", "V6"] as const;
const namespaces = ["DNS", "URL", "CUSTOMIZE"] as const;
const encodingGroup = [
  { label: "None", value: "none" },
  { label: "Base64", value: "base64" },
  { label: "Base64 Url", value: "base64url" },
];
const handleVersionChange = (v: string) => {
  store.uuid.version = v;
  if (
    store.uuid.version === "V3" ||
    store.uuid.version === "V5" ||
    store.uuid.version === "Nil"
  ) {
    store.uuid.quantity = 1;
  }
};
const generators = {
  Nil: () => nilUuid,
  V1: (index: number) =>
    generateUuidV1({
      clockseq: index,
      msecs: Date.now(),
      nsecs: Math.floor(Math.random() * 10000),
      node: Uint8Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
      ),
    }),
  V3: () => generateUuidV3(store.uuid.name, store.uuid.namespace.value),
  V4: () => generateUuidV4(),
  V5: () => generateUuidV5(store.uuid.name, store.uuid.namespace.value),
  V6: () =>
    generateUuidV6({
      clockseq: 0x1234,
      msecs: Date.now(),
      nsecs: Math.floor(Math.random() * 10000),
      node: Uint8Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
      ),
    }),
};
type UUIDGenerators = {
  Nil: () => string;
  V1: (index: number) => string;
  V3: () => string;
  V4: () => string;
  V5: () => string;
  V6: () => string;
};
const [uuids, refreshUUIDs] = computedRefreshable(() =>
  withDefaultOnError(() => {
    if (store.uuid.version === "V3" || store.uuid.version === "V5") {
      formRef.value?.validate((errors) => {
        if (!errors) {
          return "";
        }
      });
    }
    const idArr = Array.from(
      { length: store.uuid.quantity },
      (_ignored, index) => {
        const version = store.uuid.version as keyof UUIDGenerators;
        const generator = generators[version] ?? generators.Nil;
        let uuidStr = generator(index);
        if (!store.uuid.hyphens) {
          uuidStr = uuidStr.replace(/-/g, "");
        }
        if (store.uuid.uppercase) {
          uuidStr = uuidStr.toUpperCase();
        }
        if (store.uuid.encoding === "base64") {
          const encoder = new TextEncoder();
          const bytes = encoder.encode(uuidStr);
          const binary = Array.from(bytes)
            .map((byte) => String.fromCharCode(byte))
            .join("");
          uuidStr = btoa(binary);
        } else if (store.uuid.encoding === "base64url") {
          uuidStr = btoa(uuidStr)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
        }
        if (store.uuid.braces) {
          uuidStr = `{${uuidStr}}`;
        }
        if (store.uuid.quotes) {
          uuidStr = `"${uuidStr}"`;
        }
        return uuidStr;
      }
    );
    return store.uuid.array
      ? JSON.stringify(idArr, null, "    ")
      : idArr.join(store.uuid.commas ? ",\n" : "\n");
  }, "")
);
const nsValueReadeOnlyRef = ref(false);
const handleNamespaceChange = (v: string) => {
  store.uuid.namespace.type = v;
  if (v === "DNS") {
    store.uuid.namespace.value = generateUuidV5.DNS;
    nsValueReadeOnlyRef.value = true;
  } else if (v === "URL") {
    store.uuid.namespace.value = generateUuidV5.URL;
    nsValueReadeOnlyRef.value = true;
  } else {
    store.uuid.namespace.value = generateUuidV4();
    nsValueReadeOnlyRef.value = false;
  }
};
const rules = {
  namespace: {
    required: false,
    message: "Invalid UUID",
    trigger: ["input", "blur"],
    validator(rule: FormItemRule, value: string) {
      if (store.uuid.namespace.value === nilUuid) {
        return true;
      }
      if (store.uuid.version != "V3" && store.uuid.version != "V5") {
        return true;
      }
      return uuidValidate(store.uuid.namespace.value);
    },
  },
};
</script>
<style scoped></style>
