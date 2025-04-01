<template>
  <n-card :bordered="false" class="enter-input-card">
    <n-flex>
      <n-gradient-text
        v-if="jpr == null || jpr.isValid"
        :gradient="{ from: 'rgb(85, 85, 85)', to: 'rgb(170, 170, 170)' }">
        {{ i18n("json_input_tips") }}
        <n-button text color="rgb(170, 170, 170)" @click="triggerFileInput">
          {{ i18n("json_json_file_tips") }}
        </n-button>
      </n-gradient-text>
      <n-popover
        trigger="hover"
        placement="bottom"
        :show-arrow="false"
        v-if="jpr == null || jpr.isValid">
        <template #trigger>
          <n-switch
            v-model:value="inputModel.rememberData"
            size="medium"
            class="remenber-data">
            <template #checked-icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 20 20">
                  <g fill="none">
                    <path
                      d="M13.073 15l-.384 1.605c-.184.771-.865 1.33-1.67 1.39l-.144.005h-1.75c-.818 0-1.535-.516-1.776-1.262l-.038-.133L6.928 15h6.145zM10 2c3.314 0 6 2.597 6 5.8c0 1.677-.745 3.216-2.204 4.594a.599.599 0 0 0-.145.213l-.026.081L13.311 14H6.689l-.313-1.311a.595.595 0 0 0-.17-.295c-1.39-1.312-2.133-2.77-2.2-4.355L4 7.8l.003-.191C4.108 4.494 6.753 2 10 2z"
                      fill="currentColor"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            <template #unchecked-icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 16 16">
                  <g fill="none">
                    <path
                      d="M7.998 2.001c-1.229 0-2.35.481-3.168 1.31c-.798.81-1.29 1.937-1.33 3.233l-.001.019v.02c.057 1.236.655 2.324 1.737 3.454l.702 2.941l.007.022c.1.297.292.544.534.717c.251.18.558.282.883.282l1.384-.004l.021-.002a1.51 1.51 0 0 0 .84-.345c.231-.194.406-.46.48-.774l.796-3.05c1.034-.994 1.618-2.144 1.618-3.437a4.318 4.318 0 0 0-1.32-3.102a4.55 4.55 0 0 0-3.183-1.284zM5.543 4.013A3.414 3.414 0 0 1 7.998 3a3.55 3.55 0 0 1 2.486 1a3.318 3.318 0 0 1 1.017 2.386c0 .991-.453 1.926-1.404 2.805l-.108.1L9.543 11H6.494l-.349-1.464l-.097-.1C5 8.372 4.548 7.48 4.499 6.557c.038-1.048.434-1.925 1.044-2.543zM6.733 12h2.55l-.165.627l-.003.013a.445.445 0 0 1-.15.24a.509.509 0 0 1-.267.115L7.361 13a.516.516 0 0 1-.3-.095a.457.457 0 0 1-.162-.206L6.732 12z"
                      fill="currentColor"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
          </n-switch>
        </template>
        <span>{{ i18n("json_remember_data_proper") }}</span>
      </n-popover>
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        accept=".txt,.json,.yml,.yaml,.toml,.xml,.ini,.properties,.csv"
        @change="handleFileChange" />
      <n-alert
        :title="i18n('json_err_alert_title')"
        type="error"
        v-if="jpr && !jpr.isValid"
        :bordered="false">
        {{ i18n("json_err_line") }}: {{ jpr?.errorDetails?.line }}<br />
        {{ i18n("json_err_context") }}: {{ jpr?.errorDetails?.context }}<br />
        {{ i18n("json_err_msg") }}: {{ jpr?.errorDetails?.message }}<br />
      </n-alert>
      <div class="scroll-container">
        <text-line
          v-if="jpr && !jpr.isValid"
          :text="String(inputStartValue)"
          :highlighted-line="jpr?.errorDetails?.line" />
      </div>
      <div class="textarea-container">
        <n-button-group
          v-if="jpr == null || jpr.isValid"
          class="hover-button-group">
          <n-button
            type="primary"
            size="tiny"
            :ghost="textType !== 'json'"
            @click="handleChgTextType('json')">
            JSON
          </n-button>
          <n-button
            type="primary"
            :ghost="textType !== 'yaml'"
            size="tiny"
            @click="handleChgTextType('yaml')">
            yaml
          </n-button>
        </n-button-group>
        <n-input
          class="input-textarea"
          :value="inputStartValue"
          @update:value="updateInputStartValue"
          v-if="jpr == null || jpr.isValid"
          size="small"
          type="textarea"
          round
          :spellcheck="false"
          clearable
          :autosize="{ maxRows: 18, minRows: 18 }"
          ref="textareaRef"
          :disabled="inputDisabled"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @drop="handleDrop" />
      </div>
      <n-button size="tiny" @click="handleStartInput">JSON-Tool</n-button>
      <n-button
        size="tiny"
        v-if="jpr && !jpr.isValid"
        @click="handleModifyErrorInput">
        {{ i18n("json_input_btn_return") }}
      </n-button>
      <n-dropdown
        placement="bottom-start"
        trigger="hover"
        size="small"
        :options="convertOptions"
        @select="handleConvert">
        <n-button size="tiny">
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24">
                <path
                  d="M3 12h4l3 8l4-16l3 8h4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </n-icon>
          </template>
          Convert
        </n-button>
      </n-dropdown>
    </n-flex>
  </n-card>
</template>

<script lang="ts" setup>
import {
  NFlex,
  NButton,
  NCard,
  NGradientText,
  NAlert,
  NButtonGroup,
  NDropdown,
  NSwitch,
  NPopover,
  NInput,
  NIcon,
} from "naive-ui";
import { ref } from "vue";
import { i18n } from "@/utils/i18n";
import TextLine from "../components/TextLine.vue";
import { type JsonParseResult, type InputModel } from "@/utils/types";
const textareaRef = ref<InstanceType<typeof NInput> | null>(null);

defineProps<{
  inputModel: InputModel;
  jpr: JsonParseResult | null;
  inputStartValue: string | null;
  textType: string;
  convertOptions: { label: string; key: string }[];
}>();

const emit = defineEmits([
  "handleFileChange",
  "handleStartInput",
  "handleModifyErrorInput",
  "handleChgTextType",
  "handleConvert",
  "update:inputStartValue",
]);

const fileInput = ref<HTMLInputElement | null>(null);
const inputDisabled = ref(false);
const triggerFileInput = () => {
  fileInput.value?.click();
};
const handleFileChange = (event: Event) => emit("handleFileChange", event);
const handleStartInput = () => emit("handleStartInput");
const handleModifyErrorInput = () => emit("handleModifyErrorInput");
const handleChgTextType = (type: string) => emit("handleChgTextType", type);
const handleConvert = (key: string | number) => emit("handleConvert", key);
const updateInputStartValue = (value: string) =>
  emit("update:inputStartValue", value);

// 拖放事件处理
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  if (textareaRef.value) {
    textareaRef.value.$el.classList.add("drag-over");
    inputDisabled.value = true;
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  // 确保拖动时保持高亮状态
  if (
    textareaRef.value &&
    !textareaRef.value.$el.classList.contains("drag-over")
  ) {
    textareaRef.value.$el.classList.add("drag-over");
  }
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  if (textareaRef.value) {
    textareaRef.value.$el.classList.remove("drag-over");
    inputDisabled.value = false;
  }
};
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (textareaRef.value) {
    textareaRef.value.$el.classList.remove("drag-over");
    inputDisabled.value = false;
  }
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target?.result as string;
    updateInputStartValue(content);
  };

  reader.onerror = (e) => {
    console.error("File reading failed:", e);
    updateInputStartValue("Error: Unable to read file");
  };
  reader.readAsText(file, "UTF-8");
};
</script>

<style scoped>
.enter-input-card {
  width: var(--enter-input-card-width);
  border-radius: 6px;
  box-shadow: 6px 5px 7px rgba(50, 50, 50, 0.4);
}
.scroll-container {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border-right: 1px solid #e8e8e8;
}
.textarea-container {
  position: relative;
  width: 100%;
}
.input-textarea {
  width: 100%;
  transition: border-color 0.3s, background-color 0.3s, box-shadow 0.3s;
}
/* 拖入状态样式 */
.input-textarea.drag-over {
  background-color: #333333; /* 黑灰色背景 */
  border: 3px #555555; /* 灰色边框 */
  opacity: 0.7; /* 降低透明度，模拟禁用效果 */
  color: #aaaaaa; /* 文字颜色变浅 */
}
.hover-button-group {
  position: absolute;
  top: 12px;
  right: -30px;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.textarea-container:hover .hover-button-group {
  opacity: 1;
}
.remenber-data {
  margin-left: var(--remenber-data-left);
}
</style>
