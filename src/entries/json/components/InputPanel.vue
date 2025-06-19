<template>
  <div class="input-panel" :style="clickStyle">
    <n-button size="small" text class="min-btn" @click="collapsePannel">
      <n-icon>
        <svg
          v-if="!showCollapsePannel"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24">
          <path
            d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6l-1.41-1.41z"
            fill="currentColor"></path>
        </svg>
        <svg
          v-if="showCollapsePannel"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24">
          <path
            d="M12 8l-6 6l1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"
            fill="currentColor"></path>
        </svg>
      </n-icon>
    </n-button>
    <n-card :bordered="false" v-if="showCollapsePannel" class="input-card">
      <n-form
        ref="inputFormRef"
        :model="inputModel"
        label-placement="left"
        size="small"
        class="form-container">
        <n-form-item :label="i18n('json_label_path')" path="path">
          <n-popover
            placement="bottom-end"
            :show="showPathCopied"
            trigger="manual">
            <template #trigger>
              <n-select
                v-model:value="inputModel.path"
                size="small"
                filterable
                @update:value="handlePathUpdateValue"
                :options="allJsonPaths" />
            </template>
            <div>{{ i18n("copy_success_msg") }}</div>
          </n-popover>
          <n-button
            text
            style="font-size: 20px"
            @click="copyPathText(inputModel.path)">
            <n-icon>
              <svg
                v-if="!pathCopied"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16">
                <g fill="none">
                  <path
                    d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415zM11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2h5zm0 1h-5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5z"
                    fill="currentColor"></path>
                </g>
              </svg>
              <svg
                v-if="pathCopied"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 12 12">
                <g fill="none">
                  <path
                    d="M9.854 3.146a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L5 7.293l4.146-4.147a.5.5 0 0 1 .708 0z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </n-icon>
          </n-button>
        </n-form-item>
        <n-form-item :label="i18n('json_label_key')" path="key">
          <n-popover
            placement="bottom-end"
            :show="showKeyCopied"
            trigger="manual">
            <template #trigger>
              <n-input
                v-model:value="inputModel.key"
                :placeholder="i18n('json_label_key')"
                readonly />
            </template>
            <div>{{ i18n("copy_success_msg") }}</div>
          </n-popover>
          <n-button
            text
            style="font-size: 20px"
            @click="copyKeyText(inputModel.key)">
            <n-icon>
              <svg
                v-if="!keyCopied"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16">
                <g fill="none">
                  <path
                    d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415zM11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2h5zm0 1h-5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5z"
                    fill="currentColor"></path>
                </g>
              </svg>
              <svg
                v-if="keyCopied"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 12 12">
                <g fill="none">
                  <path
                    d="M9.854 3.146a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L5 7.293l4.146-4.147a.5.5 0 0 1 .708 0z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </n-icon>
          </n-button>
        </n-form-item>
        <n-form-item class="textarea-container" :show-label="false">
          <n-button
            text
            class="textarea-copy-btn"
            style="font-size: 20px"
            @click="copyTextValue(inputModel.value)">
            <n-icon>
              <svg
                v-if="!valueCopied"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16">
                <g fill="none">
                  <path
                    d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415zM11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2h5zm0 1h-5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5z"
                    fill="currentColor"></path>
                </g>
              </svg>
              <svg
                v-if="valueCopied"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 12 12">
                <g fill="none">
                  <path
                    d="M9.854 3.146a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L5 7.293l4.146-4.147a.5.5 0 0 1 .708 0z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </n-icon>
          </n-button>
          <n-popover
            placement="bottom-end"
            :show="showValueCopied"
            trigger="manual">
            <template #trigger>
              <n-input
                v-model:value="inputModel.value"
                size="large"
                type="textarea"
                round
                :spellcheck="false"
                clearable
                class="dynamic-textarea"
                :autosize="{ minRows: 18, maxRows: 18 }" />
            </template>
            <div>{{ i18n("copy_success_msg") }}</div>
          </n-popover>
        </n-form-item>
      </n-form>
      <n-flex vertical class="button-container">
        <n-flex align="baseline">
          <n-button size="tiny" @click="saveAsFile">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 20 20">
                  <g fill="none">
                    <path
                      d="M6 2a2 2 0 0 0-2 2v5h1V4a1 1 0 0 1 1-1h4v3.5A1.5 1.5 0 0 0 11.5 8H15v8a1 1 0 0 1-1 1h-3v1h3a2 2 0 0 0 2-2V7.414a1.5 1.5 0 0 0-.44-1.06l-3.914-3.915A1.5 1.5 0 0 0 10.586 2H6zm8.793 5H11.5a.5.5 0 0 1-.5-.5V3.207L14.793 7zM4 10h3v2H4v-2zm-2 0h1v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-2.41a1 1 0 0 1 .293.203l1.414 1.414a1 1 0 0 1 .293.707V18a1 1 0 0 1-1 1v-4.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5V19a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zm6 5v4H3v-4h5z"
                      fill="currentColor"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            {{ i18n("json_btn_save_as") }}
          </n-button>
          <n-button
            size="tiny"
            v-show="inputModel.oldValue == inputModel.value || !isModified"
            @click="modifyInputValue">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 16 16">
                  <g fill="none">
                    <path
                      d="M4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h1.547l.25-1H4.5A1.5 1.5 0 0 1 3 11.5V5h10v1.036c.331-.058.671-.05 1 .023V4.5A2.5 2.5 0 0 0 11.5 2h-7zM3.085 4A1.5 1.5 0 0 1 4.5 3h7a1.5 1.5 0 0 1 1.415 1h-9.83zm11.46 3.455a1.56 1.56 0 0 0-2.207 0l-4.289 4.288a2.777 2.777 0 0 0-.73 1.29l-.303 1.212a.61.61 0 0 0 .739.739l1.211-.303a2.777 2.777 0 0 0 1.29-.73l4.289-4.289a1.56 1.56 0 0 0 0-2.207z"
                      fill="currentColor"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            {{ i18n("json_btn_modify") }}
          </n-button>
          <n-button
            size="tiny"
            v-show="inputModel.oldValue != inputModel.value && isModified"
            @click="handleCancel">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512">
                  <path
                    d="M448 256L272 88v96C103.57 184 64 304.77 64 424c48.61-62.24 91.6-96 208-96v96z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="32"></path>
                </svg>
              </n-icon>
            </template>
            {{ i18n("json_btn_undo") }}
          </n-button>
          <n-button
            size="tiny"
            @click="deUri"
            v-if="inputModel.valueType === 'string'">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 16 16">
                  <g fill="none">
                    <path
                      d="M5 6c0-.65.22-1.409.7-1.996C6.166 3.433 6.9 3 8 3c.65 0 1.409.22 1.996.7C10.567 4.166 11 4.9 11 6a.5.5 0 0 0 .5.5c.648 0 1.289.212 1.757.574l.015.011c.647.146 1.227.471 1.684.92c-.132-.716-.545-1.303-1.088-1.723a3.865 3.865 0 0 0-1.89-.753c-.113-1.16-.638-2.022-1.349-2.603C9.841 2.28 8.85 2 8 2c-1.4 0-2.417.567-3.074 1.37a4.204 4.204 0 0 0-.898 2.154C1.965 5.735 1 7.322 1 8.5c0 .573.142 1.332.686 1.954c.556.636 1.46 1.046 2.814 1.046h.645a3.5 3.5 0 0 1-.145-1h-.5c-1.146 0-1.742-.34-2.061-.704C2.108 9.418 2 8.927 2 8.5c0-.736.688-2 2.5-2A.5.5 0 0 0 5 6zm3.5 2a2.5 2.5 0 0 0 0 5H9a.5.5 0 0 0 0-1h-.5a1.5 1.5 0 0 1 0-3H9a.5.5 0 0 0 0-1h-.5zM12 8a.5.5 0 0 0 0 1h.5a1.5 1.5 0 0 1 0 3H12a.5.5 0 0 0 0 1h.5a2.5 2.5 0 0 0 0-5H12zm-3.5 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"
                      fill="currentColor"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            {{ isEncodedRef ? "deUri" : "enUri" }}
          </n-button>
          <n-button
            size="tiny"
            @click="handleBase64"
            v-if="inputModel.valueType === 'string'">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path
                    d="M2.61 19c.48 0 .91-.3 1.06-.75l1.01-2.83h5.65l.99 2.82c.16.46.59.76 1.07.76c.79 0 1.33-.79 1.05-1.52L9.19 6.17C8.93 5.47 8.25 5 7.5 5s-1.43.47-1.69 1.17L1.56 17.48c-.28.73.27 1.52 1.05 1.52zM7.44 7.6h.12l2.03 5.79H5.41L7.44 7.6zM15 12c0-.55.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1z"
                    fill="currentColor"></path>
                </svg>
              </n-icon>
            </template>
            {{ isBase64Ref ? "deBase64" : "enBase64" }}
          </n-button>
          <n-button size="tiny" @click="formatLine">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path
                    d="M5 9h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h8c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1z"
                    fill="currentColor"></path>
                </svg>
              </n-icon>
            </template>
            {{ i18n("json_btn_compact") }}
          </n-button>
          <n-button size="tiny" v-if="isDateTime" @click="formatDateTime">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 12 12">
                  <g fill="none">
                    <path
                      d="M3 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 3 .5zm2 7a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-1 0v3zM5.5 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9zM2 6.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0zm8.148-2.647a.5.5 0 1 0 .706-.708l-1.002-.998a.5.5 0 1 0-.706.708l1.002.998z"
                      fill="currentColor"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            Time
          </n-button>
        </n-flex>
        <n-flex align="baseline">
          <n-button size="tiny" @click="expandCollapsedAllNodes">
            <template #icon>
              <n-icon>
                <svg
                  v-if="expandedKeys.length == 0"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path d="M7 10l5 5l5-5z" fill="currentColor"></path>
                </svg>
                <svg
                  v-if="expandedKeys.length > 0"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path d="M7 14l5-5l5 5z" fill="currentColor"></path>
                </svg>
              </n-icon>
            </template>
            {{
              expandedKeys.length == 0
                ? i18n("json_btn_expand_all")
                : i18n("json_btn_collapse_all")
            }}
          </n-button>
          <n-button size="tiny" @click="handleExpandTo">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path
                    d="M4 15c-.55 0-1 .45-1 1v3c0 1.1.9 2 2 2h3c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1zm1-9c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V6zm14-3h-3c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V5c0-1.1-.9-2-2-2zm0 15c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c1.1 0 2-.9 2-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v2zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z"
                    fill="currentColor"></path>
                </svg>
              </n-icon>
            </template>
            {{
              expandedKeys.includes(selectedKeys[0])
                ? i18n("json_btn_collapse_node")
                : i18n("json_btn_expand_node")
            }}
          </n-button>
          <n-button size="tiny" @click="handleScrollTo">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32">
                  <path
                    d="M12 16a4 4 0 1 0 4-4a4 4 0 0 0-4 4zm6 0a2 2 0 1 1-2-2a2 2 0 0 1 2 2z"
                    fill="currentColor"></path>
                  <path
                    d="M16 27.17l-5.6-5.59L9 23l7 7l7-7l-1.41-1.41L16 27.17z"
                    fill="currentColor"></path>
                  <path
                    d="M16 4.83l5.58 5.57L23 9l-7-7l-7 7l1.41 1.41L16 4.83z"
                    fill="currentColor"></path>
                </svg>
              </n-icon>
            </template>
            {{ i18n("json_btn_scroll_to_node") }}
          </n-button>
        </n-flex>
        <n-flex align="baseline" :size="1">
          <n-checkbox v-model:checked="inputModel.showValue" size="small">
            {{ i18n("json_check_box_show_value") }}
          </n-checkbox>
          <n-checkbox v-model:checked="inputModel.showLength" size="small">
            {{ i18n("json_check_box_show_length") }}
          </n-checkbox>
          <n-checkbox v-model:checked="inputModel.showIcon" size="small">
            {{ i18n("json_check_box_show_ico") }}
          </n-checkbox>
          <n-checkbox
            v-if="inputModel.showIcon"
            v-model:checked="inputModel.folderStyle"
            size="small">
            {{ i18n("json_check_box_folder_style") }}
          </n-checkbox>
        </n-flex>
      </n-flex>
      <n-button
        size="large"
        text
        @click="openOptionsTab"
        v-if="isExtension"
        class="setting-btn">
        <n-icon>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
            xml:space="preserve">
            <path
              d="M416.3,256c0-21,13.1-38.9,31.7-46.1c-4.9-20.5-13-39.7-23.7-57.1c-6.4,2.8-13.2,4.3-20.1,4.3c-12.6,0-25.2-4.8-34.9-14.4
              c-14.9-14.9-18.2-36.8-10.2-55C341.8,77,322.5,68.9,302.1,64C295,82.5,277,95.7,256,95.7c-21,0-39-13.2-46.1-31.7
              c-20.5,4.9-39.7,13-57.1,23.7c8.1,18.1,4.7,40.1-10.2,55c-9.6,9.6-22.3,14.4-34.9,14.4c-6.9,0-13.7-1.4-20.1-4.3
              C77,170.3,68.9,189.5,64,210c18.5,7.1,31.7,25,31.7,46.1c0,21-13.1,38.9-31.6,46.1c4.9,20.5,13,39.7,23.7,57.1
              c6.4-2.8,13.2-4.2,20-4.2c12.6,0,25.2,4.8,34.9,14.4c14.8,14.8,18.2,36.8,10.2,54.9c17.4,10.7,36.7,18.8,57.1,23.7
              c7.1-18.5,25-31.6,46-31.6c21,0,38.9,13.1,46,31.6c20.5-4.9,39.7-13,57.1-23.7c-8-18.1-4.6-40,10.2-54.9
              c9.6-9.6,22.2-14.4,34.9-14.4c6.8,0,13.7,1.4,20,4.2c10.7-17.4,18.8-36.7,23.7-57.1C429.5,295,416.3,277.1,416.3,256z M256.9,335.9
              c-44.3,0-80-35.9-80-80c0-44.1,35.7-80,80-80s80,35.9,80,80C336.9,300,301.2,335.9,256.9,335.9z"></path>
          </svg>
        </n-icon>
      </n-button>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {
  NFlex,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NIcon,
  NSelect,
  NPopover,
} from "naive-ui";
import { ref } from "vue";
import { i18n } from "@/utils/i18n";
import useClipboard from "vue-clipboard3";
import { type JsonPathOption, type InputModel } from "@/utils/types";
import { strClean } from "@/utils/common";

const { toClipboard } = useClipboard();

defineProps<{
  inputModel: InputModel;
  clickStyle: Record<string, string>;
  showCollapsePannel: boolean;
  isModified: boolean;
  isBase64Ref: boolean;
  isEncodedRef: boolean;
  isDateTime: boolean;
  expandedKeys: (string | number)[];
  selectedKeys: (string | number)[];
  isExtension: boolean;
  allJsonPaths: JsonPathOption[];
}>();
const emit = defineEmits([
  "collapsePannel",
  "modifyInputValue",
  "handleCancel",
  "deUri",
  "handleBase64",
  "formatLine",
  "formatDateTime",
  "expandCollapsedAllNodes",
  "handleExpandTo",
  "handleScrollTo",
  "openOptionsTab",
  "saveAsFile",
  "handlePathUpdateValue",
]);

const inputFormRef = ref<any>();
const pathCopied = ref(false);
const showPathCopied = ref(false);
const keyCopied = ref(false);
const showKeyCopied = ref(false);
const valueCopied = ref(false);
const showValueCopied = ref(false);
const collapsePannel = () => emit("collapsePannel");
const copyPathText = async (val: any) => {
  try {
    await toClipboard(val);
    pathCopied.value = true;
    showPathCopied.value = true;
    setTimeout(() => {
      pathCopied.value = false;
      showPathCopied.value = false;
    }, 3000);
  } catch (e) {}
};
const copyKeyText = async (val: any) => {
  try {
    await toClipboard(val);
    keyCopied.value = true;
    showKeyCopied.value = true;
    setTimeout(() => {
      keyCopied.value = false;
      showKeyCopied.value = false;
    }, 3000);
  } catch (e) {}
};
const copyTextValue = async (val: any) => {
  try {
    await toClipboard(strClean(val));
    valueCopied.value = true;
    showValueCopied.value = true;
    setTimeout(() => {
      valueCopied.value = false;
      showValueCopied.value = false;
    }, 3000);
  } catch (e) {}
};
const modifyInputValue = () => emit("modifyInputValue");
const handleCancel = () => emit("handleCancel");
const deUri = () => emit("deUri");
const handleBase64 = () => emit("handleBase64");
const formatLine = () => emit("formatLine");
const formatDateTime = () => emit("formatDateTime");
const expandCollapsedAllNodes = () => emit("expandCollapsedAllNodes");
const handleExpandTo = () => emit("handleExpandTo");
const handleScrollTo = () => emit("handleScrollTo");
const openOptionsTab = () => emit("openOptionsTab");
const saveAsFile = () => emit("saveAsFile");
const handlePathUpdateValue = (value: string, option: JsonPathOption) =>
  emit("handlePathUpdateValue", value, option);
</script>

<style scoped>
.input-panel {
  padding: 2px;
  width: var(--panel-width);
  max-height: var(--input-panel-height);
  position: fixed;
  z-index: 10;
  right: var(--panel-right);
  top: 1em;
  box-shadow:
    4px 4px 9px rgba(0, 0, 50, 0.2),
    -3px -3px 30px rgba(88, 88, 188, 0.1) inset;
  transition:
    height 0.2s ease-out,
    width 0.2s ease-out;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}
.input-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-container .n-form-item {
  margin-bottom: -15px;
  flex-shrink: 0;
}
.dynamic-textarea {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.button-container {
  flex-shrink: 0;
}
.min-btn {
  position: absolute;
  right: 5px;
  top: 5px;
  padding-left: 7px;
  z-index: 1;
  font-size: 20px;
}
.setting-btn {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding-left: 7px;
  z-index: 1;
  font-size: 20px;
}
.textarea-copy-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  display: none;
  z-index: 1;
}
.textarea-container {
  position: relative;
}
.textarea-container:hover .textarea-copy-btn {
  display: block;
}
</style>
