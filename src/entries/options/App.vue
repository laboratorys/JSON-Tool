<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <NFlex align="center" justify="center" :gap="12">
      <n-image width="48" height="48" src="/logo.svg" /><n-h1
        >JSON-Tool {{ i18n("options_card_title") }}</n-h1
      ></NFlex
    >
    <n-flex justify="center" style="padding: 10px">
      <n-card
        :title="i18n('options_card_title')"
        size="medium"
        embedded
        :style="{ width: '840px', maxWidth: '90vw' }"
        hoverable>
        <template #header-extra>
          <n-flex>
            <n-popover trigger="hover" placement="bottom">
              <template #trigger>
                <n-button
                  text
                  style="font-size: 24px"
                  tag="a"
                  href="https://github.com/laboratorys/JSON-Tool"
                  target="_blank">
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 32 32">
                      <path
                        d="M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.71 3.71 0 0 0-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45a3 3 0 0 0 4.08 1.16a2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 0 1 1.44-3.76a5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7a5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2z"
                        fill-rule="evenodd"
                        fill="currentColor"></path>
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              <span>GitHub</span>
            </n-popover>
            <n-popover trigger="hover" placement="bottom">
              <template #trigger>
                <n-button
                  text
                  style="font-size: 24px"
                  target="_blank"
                  @click="showDonate = true">
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512">
                      <path
                        d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0S48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4c5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1c-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3c0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1c0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4c-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1c5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3c0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1c.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z"
                        fill="currentColor"></path>
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              <span>{{ i18n("options_donate_title") }}</span>
            </n-popover>
            <n-modal v-model:show="showDonate">
              <n-card
                style="width: 600px"
                :title="i18n('options_donate_title')"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true">
                <n-flex justify="center">
                  <n-image width="300" src="/donate.jpg" />
                </n-flex>
              </n-card>
            </n-modal>
          </n-flex>
        </template>
        <n-form
          ref="formRef"
          :model="options"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          label-align="left"
          :key="randomId"
          require-mark-placement="right-hanging"
          size="small"
          :style="{ maxWidth: '100%' }">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi
              :span="8"
              :label="i18n('options_render_switch_label')">
              <n-switch v-model:value="options.renderSwitch" />
            </n-form-item-gi>
            <n-form-item-gi :span="10" v-if="options.renderSwitch">
              <n-checkbox-group v-model:value="options.renderTypes">
                <n-checkbox value="JSON" label="JSON" disabled />
                <n-checkbox value="YAML" label="YAML" />
              </n-checkbox-group>
            </n-form-item-gi>
          </n-grid>
          <n-form-item>
            <n-checkbox v-model:checked="options.contextMenus">
              {{ i18n("options_context_menus_text") }}
            </n-checkbox>
          </n-form-item>
          <n-form-item :label="i18n('options_edit_pannel_label')">
            <n-checkbox-group
              v-model:value="options.showPannel"
              @update:value="checkShowBtn">
              <n-checkbox
                value="leftClick"
                :label="i18n('options_edit_pannel_op_click')" />
              <n-checkbox
                value="startup"
                :label="i18n('options_edit_pannel_op_start')" />
              <n-checkbox
                value="lastStatus"
                :label="i18n('options_edit_pannel_op_last')" />
              <n-checkbox
                value="onlyBtn"
                :label="i18n('options_edit_pannel_op_button')" />
            </n-checkbox-group>
          </n-form-item>
          <n-form-item :label="i18n('options_lang_label')">
            <n-select
              v-model:value="options.lang"
              :options="langOptions"
              :style="{
                width: '120px',
              }" />
          </n-form-item>
          <n-form-item :label="i18n('options_theme_label')">
            <n-radio-group v-model:value="options.theme" name="themeGroup">
              <n-radio-button value="light"> Light </n-radio-button>
              <n-radio-button value="dark"> Dark </n-radio-button>
              <n-radio-button value="auto"> Auto </n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="i18n('options_open_jt_mode_label')">
            <n-radio-group
              v-model:value="options.openJTMode"
              name="jtModeGroup">
              <n-radio value="window"> Window </n-radio>
              <n-radio value="tab"> Tab </n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="i18n('options_parsing_engine_label')">
            <n-radio-group
              v-model:value="options.parsingEngine"
              name="parsingEngineGroup">
              <n-radio value="json"> JSON </n-radio>
              <n-radio value="json5"> JSON5 </n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="i18n('options_show_length_mode_label')">
            <n-radio-group
              v-model:value="options.showLengthMode"
              name="showLengthModeGroup">
              <n-radio value="arr">
                {{ i18n("options_show_length_mode_op_arr") }}
              </n-radio>
              <n-radio value="arrObj">
                {{ i18n("options_show_length_mode_op_arrObj") }}
              </n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="i18n('options_hot_keys_label')">
            <n-checkbox-group v-model:value="options.hotKeys">
              <n-checkbox
                value="ctrl_k"
                :label="i18n('options_hot_keys_op_search')" />
              <n-checkbox
                value="ctrl_s"
                :label="i18n('options_hot_keys_op_save')" />
            </n-checkbox-group>
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="options.sortKeys">
              {{ i18n("options_sort_keys_text") }}
            </n-checkbox>
            <n-checkbox v-model:checked="options.saveCollapseStatus">
              {{ i18n("options_save_collapse_status_text") }}
            </n-checkbox>
            <n-checkbox v-model:checked="options.treeExpandMode">
              {{ i18n("options_tree_expand_text") }}
            </n-checkbox>
          </n-form-item>
          <n-form-item :label="i18n('options_color_style_label')">
            <n-radio-group
              v-model:value="options.colorStyle"
              name="colorStyleGroup">
              <n-radio value="simple">
                {{ i18n("options_color_style_op_simple") }}
              </n-radio>
              <n-radio value="jt">
                {{ i18n("options_color_style_op_jt") }}
              </n-radio>
              <n-radio value="custom">
                {{ i18n("options_color_style_op_custom") }}
              </n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item
            :label="i18n('options_color_label')"
            v-if="options.colorStyle === 'custom'">
            <n-data-table
              size="small"
              :columns="colorColumns"
              :data="options.customColor"
              :bordered="false" />
          </n-form-item>
          <n-flex>
            <n-button type="primary" size="small" @click="handleSaveOptions">
              <template #icon>
                <n-icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24">
                    <g fill="none">
                      <path
                        d="M6.75 3h-1A2.75 2.75 0 0 0 3 5.75v12.5A2.75 2.75 0 0 0 5.75 21H6v-6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 15v6h.25A2.75 2.75 0 0 0 21 18.25V8.286a3.25 3.25 0 0 0-.952-2.299l-2.035-2.035A3.25 3.25 0 0 0 15.75 3v4.5a2.25 2.25 0 0 1-2.25 2.25H9A2.25 2.25 0 0 1 6.75 7.5V3zm7.5 0v4.5a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V3h6zm2.25 18v-6a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v6h9z"
                        fill="currentColor"></path>
                    </g>
                  </svg>
                </n-icon>
              </template>
              {{ i18n("options_save_btn_text") }}
            </n-button>
            <n-button @click="handleResetOptions" type="error" size="small">
              <template #icon>
                <n-icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 20 20">
                    <g fill="none">
                      <path
                        d="M6.03 2.47a.75.75 0 0 1 0 1.06L4.81 4.75H11A6.25 6.25 0 1 1 4.75 11a.75.75 0 0 1 1.5 0A4.75 4.75 0 1 0 11 6.25H4.81l1.22 1.22a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0z"
                        fill="currentColor"></path>
                    </g>
                  </svg>
                </n-icon>
              </template>
              {{ i18n("options_reset_btn_text") }}
            </n-button>
          </n-flex>
        </n-form>
      </n-card>
    </n-flex>
    <n-global-style />
  </n-config-provider>
</template>
<script lang="ts" setup>
import {
  NConfigProvider,
  NButton,
  NFlex,
  NGlobalStyle,
  NCard,
  NSwitch,
  NForm,
  NFormItem,
  FormInst,
  NSelect,
  NRadioGroup,
  NRadioButton,
  NCheckbox,
  NRadio,
  NH1,
  NImage,
  NIcon,
  NDataTable,
  NColorPicker,
  NTag,
  NPopover,
  NGrid,
  NFormItemGi,
  NCheckboxGroup,
  NModal,
  NQrCode,
} from "naive-ui";
import { ref, reactive } from "vue";
import {
  getItem,
  setItem,
  defaultOptions,
  setJSONEngine,
} from "@/utils/common";
import { setLocale, i18n } from "@/utils/i18n";
import { getDiscreteApi } from "@/utils/message";
import { currentTheme, themeOverrides, setTheme } from "@/utils/theme";

const formRef = ref<FormInst | null>(null);
const options = reactive(structuredClone(defaultOptions));
const showDonate = ref(false);

const rules = {};
const langOptions = [
  {
    label: "en",
    value: "en",
  },
  {
    label: "zh_CN",
    value: "zh_CN",
  },
  {
    label: "zh_TW",
    value: "zh_TW",
  },
];
const colorColumns = [
  {
    title: "type",
    key: "type",
  },
  {
    title: "dark",
    key: "dark",
    render(row: any) {
      return h(
        NColorPicker,
        {
          value: row.dark,
          showAlpha: false,
          size: "small",
          onUpdateValue: (newValue) => {
            row.dark = newValue;
          },
        },
        { default: () => row.dark }
      );
    },
  },
  {
    title: "light",
    key: "light",
    render(row: any) {
      return h(
        NColorPicker,
        {
          value: row.light,
          showAlpha: false,
          size: "small",
          onUpdateValue: (newValue) => {
            row.light = newValue;
          },
        },
        { default: () => row.dark }
      );
    },
  },
  {
    title: "text",
    key: "text",
    render(row: any) {
      if (row.type === "key") {
        return "--";
      }
      return h(
        NTag,
        {},
        {
          default: () => {
            return row.text;
          },
        }
      );
    },
  },
];
const randomId = ref(0);
const handleSaveOptions = async () => {
  setTheme(options.theme);
  setLocale(options.lang);
  setItem("options", options).then(() => {
    setColor();
  });
  setJSONEngine();
  randomId.value = randomId.value + 1;
  const { message } = getDiscreteApi();
  message.success(i18n("options_save_success_msg"));
};
const handleResetOptions = () => {
  const df = structuredClone(defaultOptions);
  Object.assign(options, df);
  setTheme(options.theme);
  setLocale(options.lang);
  setItem("options", df).then(() => {
    setColor();
  });
  setJSONEngine();
  randomId.value = randomId.value + 1;
  const { message } = getDiscreteApi();
  message.success(i18n("options_save_success_msg"));
};
const checkShowBtn = (value: (string | number)[]) => {
  if (value.includes("onlyBtn")) {
    options.showPannel = ["onlyBtn"];
  }
};
onMounted(() => {
  getItem("options").then((savedOptions: any) => {
    if (savedOptions) {
      Object.assign(options, savedOptions);
    }
  });
});
</script>
<style scoped>
@media (max-width: 640px) {
  .n-card {
    width: 90vw !important;
  }
}
</style>
