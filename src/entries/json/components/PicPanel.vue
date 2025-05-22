<template>
  <n-popover trigger="hover" placement="bottom" :show-arrow="showTips">
    <template #trigger>
      <n-button
        text
        tag="a"
        :href="url"
        target="_blank"
        :style="{
          color: urlColor,
          marginLeft: '5px',
          lineHeight: '20px',
          verticalAlign: 'middle',
          fontSize: '15px',
        }"
        @click="urlClick"
        ><template #icon>
          <n-icon>
            <LinkIcon />
          </n-icon> </template
        >{{ url }}</n-button
      >
    </template>
    <div style="padding: 0px; max-width: 200px" v-if="showTips">
      {{ i18n("json_link_tooltip") }}
    </div>
    <div style="padding: 0px; max-width: 300px" v-if="showPic">
      <n-image width="300" :src="url" preview-disabled>
        <template #error>
          <n-text type="error"> {{ i18n("json_image_error_msg") }} </n-text>
        </template>
      </n-image>
    </div>
  </n-popover>
</template>
<script lang="ts" setup>
import { NImage, NIcon, NPopover, NButton, NText } from "naive-ui";
import { i18n } from "@/utils/i18n";
import { ref } from "vue";
import LinkIcon from "../icon/Link.vue";
const showTips = ref(true);
const showPic = ref(false);
const props = defineProps<{
  url: string;
  urlColor: string;
}>();
isImageUrl(props.url).then((result) => {
  if (result) {
    showPic.value = true;
    showTips.value = false;
  } else {
    showTips.value = true;
    showPic.value = false;
  }
});
const urlClick = (e: MouseEvent) => {
  if (!e.ctrlKey && !e.metaKey) {
    e.preventDefault();
  }
};
</script>
