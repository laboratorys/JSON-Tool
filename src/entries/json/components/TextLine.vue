<template>
  <div class="textarea-with-line-numbers">
    <div class="line-numbers">
      <span
        v-for="n in lineCount"
        :key="n"
        :class="{ 'highlight-line': n === highlightedLine }">
        {{ n }}
      </span>
    </div>
    <div
      class="textarea-content"
      :style="{ '--highlighted-line': highlightedLine }">
      <pre>{{ text }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  text?: string;
  highlightedLine?: number;
}>();

const lineCount = computed(() => {
  return props.text ? props.text.split("\n").length : 1;
});
</script>

<style scoped>
.textarea-with-line-numbers {
  display: flex;
  font-family: monospace;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.line-numbers {
  background: #f5f5f5;
  padding: 8px 4px;
  text-align: right;
  border-right: 1px solid #e8e8e8;
  user-select: none;
}

.line-numbers span {
  display: block;
  line-height: 20px;
  color: #888;
  padding-right: 8px;
}

.line-numbers .highlight-line {
  background: #fff3e0;
  color: #ff0000;
  font-weight: bold;
}

.textarea-content {
  flex: 1;
  padding: 8px;
  position: relative;
  overflow: auto;
}

.textarea-content pre {
  margin: 0;
  line-height: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: transparent;
}

.textarea-content::before {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 20px;
  background: rgba(255, 152, 0, 0.1);
  top: calc((var(--highlighted-line) - 1) * 20px + 8px); /* 考虑 padding */
  pointer-events: none;
}
</style>
