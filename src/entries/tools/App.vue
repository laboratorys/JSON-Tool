<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <Tools />
    </n-loading-bar-provider>
    <n-global-style />
  </n-config-provider>
</template>
<script lang="ts" setup>
import { NConfigProvider, NLoadingBarProvider, NGlobalStyle } from "naive-ui";
import { currentTheme, themeOverrides } from "@/utils/theme";
import Tools from "./Tools.vue";
</script>
<style lang="scss">
@use "sass:meta";

html[data-code-theme="a11y-dark"] {
  @include meta.load-css("highlight.js/styles/a11y-dark.css");
}
html[data-code-theme="a11y-light"] {
  @include meta.load-css("highlight.js/styles/a11y-light.css");
}
</style>
