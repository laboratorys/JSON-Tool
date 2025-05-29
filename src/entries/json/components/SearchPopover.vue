<template>
  <n-popover
    trigger="manual"
    :show="showSearch"
    placement="right-start"
    class="custom-popover"
    :y="5"
    :x="x"
    style="position: sticky; padding: 0px !important"
    @clickoutside="handleOutSide"
    :show-arrow="false">
    <template #trigger>
      <span>{{ triggerText }}</span>
    </template>
    <n-flex align="center">
      <n-input
        class="search-input"
        ref="patternRef"
        v-model:value="localPattern"
        :placeholder="i18n('json_search_placeholder')"
        size="small"
        :spellcheck="false"
        @keyup.enter="keyEnter"
        style="width: 50%">
        <template #prefix>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 20 20">
              <g fill="none">
                <path
                  d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z"
                  fill="currentColor"></path>
              </g>
            </svg>
          </n-icon>
        </template>
        <template #suffix>
          <n-text depth="3">
            {{ currentKeyIndex + 1 }}/{{ allKeysLength }}
          </n-text>
        </template>
      </n-input>
      <n-text
        :type="localPattern ? 'error' : 'default'"
        v-if="allKeysLength == 0"
        >{{ i18n("json_search_result_error_msg") }}</n-text
      >
      <n-divider vertical />
      <n-button text @click="moveUp">
        <n-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 16 16">
            <g fill="none">
              <path
                d="M7.5 13.5a.5.5 0 0 0 1 0V3.803l3.628 4.031a.5.5 0 0 0 .744-.668l-4.5-5a.5.5 0 0 0-.744 0l-4.5 5a.5.5 0 0 0 .744.668L7.5 3.803V13.5z"
                fill="currentColor"></path>
            </g>
          </svg>
        </n-icon>
      </n-button>
      <n-button text @click="moveDown">
        <n-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 16 16">
            <g fill="none">
              <path
                d="M8.5 2.5a.5.5 0 1 0-1 0v9.697L3.872 8.166a.5.5 0 1 0-.744.668l4.5 5a.5.5 0 0 0 .744 0l4.5-5a.5.5 0 0 0-.744-.668L8.5 12.197V2.5z"
                fill="currentColor"></path>
            </g>
          </svg>
        </n-icon>
      </n-button>
      <n-button text @click="handleClose">
        <n-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32">
            <path
              d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
              fill="currentColor"></path>
          </svg>
        </n-icon>
      </n-button>
    </n-flex>
  </n-popover>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash-es";
import {
  NPopover,
  NFlex,
  NInput,
  NIcon,
  NDivider,
  NButton,
  NText,
} from "naive-ui";
import { i18n } from "@/utils/i18n";
defineProps<{
  triggerText?: string;
  allKeysLength?: number;
  currentKeyIndex?: number;
}>();

const showSearch = defineModel<boolean>("show", { default: false }); // 添加 v-model:show 支持
const emit = defineEmits<{
  (e: "update:pattern", value: string): void;
  (e: "move-up"): void;
  (e: "move-down"): void;
}>();

const localPattern = ref("");
const patternRef = ref(null);
const x = ref(0);
const updateSearchPosition = () => {
  const windowWidth = window.innerWidth;
  const popoverWidth = 300; // 假设 SearchPopover 的宽度为 300px，可根据实际调整
  x.value = (windowWidth - popoverWidth) / 2; // 居中计算
};
// 双向绑定 pattern
watch(localPattern, (newValue) => {
  emit("update:pattern", newValue);
});

// 聚焦输入框
watch(showSearch, (newValue) => {
  if (newValue) {
    nextTick(() => {
      patternRef.value?.focus();
    });
  }
});

// 切换显示状态
const toggleShow = () => {
  showSearch.value = !showSearch.value;
};

const moveUp = () => {
  emit("move-up");
};

const moveDown = () => {
  emit("move-down");
};
const handleClose = () => {
  showSearch.value = false;
  localPattern.value = "";
};
const handleOutSide = () => {
  showSearch.value = false;
};
const keyEnter = () => {
  moveDown();
};
onMounted(() => {
  updateSearchPosition();
  window.addEventListener("resize", debounce(updateSearchPosition, 100));
});

onUnmounted(() => {
  window.removeEventListener("resize", debounce(updateSearchPosition, 100));
});
</script>

<style scoped>
/* 移除搜索框边框 */
.search-input {
  --n-border: none !important;
  --n-border-hover: none !important;
  --n-border-focus: none !important;
  --n-box-shadow-focus: none !important;
  outline: none !important;
}
</style>
