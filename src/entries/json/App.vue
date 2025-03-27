<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <Json />
    </n-loading-bar-provider>
    <n-global-style />
  </n-config-provider>
</template>
<script lang="ts" setup>
import { NConfigProvider, NLoadingBarProvider, NGlobalStyle } from "naive-ui";
import { currentTheme, themeOverrides } from "@/utils/theme";
import Json from "./Json.vue";
</script>
