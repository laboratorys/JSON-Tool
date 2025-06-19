<template>
  <n-flex vertical :size="1">
    <ToolHeader
      title="Token generator"
      description="Generate random string with the chars you want, uppercase or lowercase letters, numbers and/or symbols." />
    <div class="tool-content">
      <n-grid x-gap="12" :cols="1">
        <n-gi>
          <n-flex justify="center"
            ><n-card :bordered="false" embedded>
              <n-form label-placement="left" label-width="140">
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="6" label="Uppercase (ABC...)">
                    <n-switch v-model:value="store.token.withUppercase" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="6" label="Lowercase (abc...)">
                    <n-switch v-model:value="store.token.withLowercase" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="6" label="Numbers (123...)">
                    <n-switch v-model:value="store.token.withNumbers" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="6" label="Symbols (!-;...)">
                    <n-switch v-model:value="store.token.withSymbols" />
                  </n-form-item-gi>
                </n-grid>
              </n-form>
              <n-form-item
                :label="`Length (${store.token.length})`"
                label-placement="left">
                <n-slider
                  v-model:value="store.token.length"
                  :step="1"
                  :min="1"
                  :max="512" /><n-input-number
                  v-model:value="store.token.length"
                  :step="1"
                  :min="1"
                  :max="512"
                  :style="{ width: '110px', marginLeft: '10px' }" />
              </n-form-item>
              <n-input
                v-model:value="token"
                type="textarea"
                readonly
                :autosize="{
                  minRows: 3,
                }"
                :style="{
                  maxWidth: '800px',
                }" />
              <n-flex justify="center" style="margin-top: 20px">
                <n-button @click="copy(token)">Copy</n-button>
                <n-button type="primary" @click="refreshToken">
                  Refresh
                </n-button></n-flex
              >
            </n-card></n-flex
          >
        </n-gi>
      </n-grid>
    </div>
  </n-flex>
</template>
<script lang="ts" setup>
import {
  NFlex,
  NH1,
  NText,
  NDivider,
  NGrid,
  NGi,
  NCard,
  NSwitch,
  NSlider,
  NForm,
  NFormItem,
  NFormItemGi,
  NInput,
  NButton,
  NInputNumber,
} from "naive-ui";
import ToolHeader from "../components/ToolHeader.vue";
import { useStore } from "../store";
import { shuffleString } from "@/utils/random";
import { computedRefreshable } from "@/utils/computedRefreshable";
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
const store = useStore();
const createToken = ({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = false,
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean;
  withLowercase?: boolean;
  withNumbers?: boolean;
  withSymbols?: boolean;
  length?: number;
  alphabet?: string;
}) => {
  const allAlphabet =
    alphabet ??
    [
      withUppercase ? "ABCDEFGHIJKLMOPQRSTUVWXYZ" : "",
      withLowercase ? "abcdefghijklmopqrstuvwxyz" : "",
      withNumbers ? "0123456789" : "",
      withSymbols ? ".,;:!?./-\"'#{([-|\\@)]=}*+" : "",
    ].join("");

  return shuffleString(allAlphabet.repeat(length)).substring(0, length);
};
const [token, refreshToken] = computedRefreshable(() =>
  createToken({
    length: store.token.length,
    withUppercase: store.token.withUppercase,
    withLowercase: store.token.withLowercase,
    withNumbers: store.token.withNumbers,
    withSymbols: store.token.withSymbols,
  })
);
</script>
<style scoped></style>
