<!-- src/components/ToolHeader.vue -->
<template>
  <div class="tool-layout" :style="{ width }">
    <n-h1 prefix="bar">{{ title }}</n-h1>
    <n-text depth="3">{{ description }}</n-text>
  </div>
</template>

<script lang="ts" setup>
import { NH1, NText } from "naive-ui";

interface Props {
  title: string;
  description: string;
  width?: string; // Optional prop
}
const props = withDefaults(defineProps<Props>(), {
  width: "800px",
});
</script>
