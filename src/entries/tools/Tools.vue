<template>
  <n-layout has-sider :style="{ width: '100%', height: '100vh' }">
    <n-layout-sider
      bordered
      v-model:collapsed="store.global.menuCollapse"
      :default-expand-all="true"
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      :inverted="false">
      <n-page-header
        :class="{ 'centered-avatar': store.global.menuCollapse }"
        style="margin: 14px">
        <template v-if="!store.global.menuCollapse" #title>
          <n-gradient-text
            gradient="
             linear-gradient(90deg, red 0%, green 50%, blue 100%)
            ">
            Dev-Tool
          </n-gradient-text>
        </template>
        <template #avatar>
          <n-avatar src="/logo.svg" />
        </template>
      </n-page-header>
      <n-divider />
      <n-menu
        :inverted="false"
        v-model:value="store.global.activeMenu"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="handleUpdateMenu" />
    </n-layout-sider>
    <n-layout>
      <n-layout-content content-style="padding: 24px;height:96vh">
        <n-flex justify="center" align="center">
          <component :is="store.global.activeMenu"></component>
        </n-flex>
      </n-layout-content>
      <n-layout-footer
        style="
          height: 4vh;
          display: flex;
          flex-flow: wrap;
          justify-content: center;
          gap: 8px 12px;
          align-items: center;
        ">
        <n-gradient-text type="success" :size="14">
          ©2025 JSON-Tool &
          <n-a
            href="https://github.com/CorentinTh/it-tools"
            target="_blank"
            style="text-decoration: none"
            >it-tools</n-a
          >
        </n-gradient-text>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>
<script lang="ts" setup>
import {
  NA,
  NGradientText,
  NLayout,
  NLayoutSider,
  NMenu,
  NIcon,
  NFlex,
  NLayoutContent,
  NLayoutFooter,
  NPageHeader,
  NAvatar,
  NDivider,
  type MenuOption,
} from "naive-ui";
import CryptoIcon from "./icon/Lock.vue";
import UUIDIcon from "./icon/Uuid.vue";
import RandomIcon from "./icon/Random.vue";
import CodeIcon from "./icon/Code.vue";
import HashIcon from "./icon/Hash.vue";
import DateIcon from "./icon/Date.vue";
import { useStore } from "./store";
const store = useStore();
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
const menuOptions = [
  {
    label: "Crypto",
    key: "crypto",
    icon: renderIcon(CryptoIcon),
    children: [
      {
        label: "Token generator",
        key: "token",
        icon: renderIcon(RandomIcon),
      },
      {
        label: "UUID generator",
        key: "uuid",
        icon: renderIcon(UUIDIcon),
      },
      {
        label: "Hash text",
        key: "hash",
        icon: renderIcon(HashIcon),
      },
    ],
  },
  {
    label: "Code formatter",
    key: "code-formatter",
    icon: renderIcon(CodeIcon),
  },
  {
    label: "Date-time converter",
    key: "date-time-converter",
    icon: renderIcon(DateIcon),
  },
];
const handleUpdateMenu = (key: string, item: MenuOption) => {};
</script>
<style scoped>
.n-gradient-text {
  font-weight: bold;
}
.corner {
  position: absolute;
  top: 5px;
  right: 5px;
}

.centered-avatar .n-page-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.centered-avatar .n-page-header-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.centered-avatar .n-avatar {
  margin: 0 auto;
}
</style>
