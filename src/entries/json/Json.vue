<template>
  <n-flex
    v-show="treeData.length == 0 && dataSource === 'input'"
    justify="center"
    align="center"
    vertical
    class="uploader"
    :style="{
      height: '100vh',
      //width: '100wh',
    }">
    <SearchPopover
      triggerText="Search JSON"
      :currentKeyIndex="currentKeyIndex"
      :allKeysLength="searchResultKeys.length"
      :show="showSearch"
      @update:show="(value: boolean) => showSearch = value"
      @update:pattern="(value: string) => { pattern = value; searchResultKeys = []; }"
      @moveUp="handleMoveUp"
      @moveDown="handleMoveDown" />
    <n-card :bordered="false" class="enter-input-card">
      <n-flex>
        <n-gradient-text
          v-if="jpr == null || jpr.isValid"
          :gradient="{
            from: 'rgb(85, 85, 85)',
            to: 'rgb(170, 170, 170)',
          }">
          {{ i18n("json_input_tips") }}
          <n-button text color="rgb(170, 170, 170)" @click="triggerFileInput">
            {{ i18n("json_json_file_tips") }}
          </n-button>
        </n-gradient-text>
        <n-popover trigger="hover" placement="bottom" :show-arrow="false">
          <template #trigger>
            <n-switch
              v-model:value="inputModel.rememberData"
              size="medium"
              style="margin-left: 355px">
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
            v-model:value="inputStartValue"
            v-if="jpr == null || jpr.isValid"
            size="small"
            type="textarea"
            round
            :spellcheck="false"
            clearable
            :autosize="{
              maxRows: 18,
              minRows: 18,
            }" />
        </div>
        <n-button size="tiny" @click="handleStartInput">JSON-Tool</n-button>
        <n-button
          size="tiny"
          v-if="jpr && !jpr.isValid"
          @click="handleModifyErrorInput"
          >{{ i18n("json_input_btn_return") }}</n-button
        >
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="convertOptions"
          @select="handleConvert">
          <n-button size="tiny"
            ><template #icon
              ><n-icon>
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
                </svg> </n-icon></template
            >Convert</n-button
          >
        </n-dropdown>
      </n-flex>
    </n-card>
  </n-flex>
  <n-back-top :right="100" />
  <n-tree
    v-if="treeData.length > 0"
    ref="treeInstRef"
    :show-line="true"
    :data="treeData"
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    virtual-scroll
    :animated="false"
    :render-label="renderLabel"
    :render-suffix="renderSuffix"
    :node-props="nodeProps"
    :style="{ height: treeHeight + 'px' }"
    :show-irrelevant-nodes="false"
    :pattern="pattern"
    :filter="treeFilter"
    :on-update:expanded-keys="updatePrefixWithExpaned" />
  <n-flex
    class="pathTips"
    justify="start"
    :style="bgCss"
    v-if="treeData.length > 0">
    {{ currentNodePath }}</n-flex
  >
  <div class="input-panel" v-if="showInputPanel" :style="clickStyle">
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
          <n-input
            v-model:value="inputModel.path"
            :placeholder="i18n('json_label_path')"
            @click="copyText(inputModel.path)"
            readonly />
        </n-form-item>
        <n-form-item :label="i18n('json_label_key')" path="key">
          <n-input
            v-model:value="inputModel.key"
            :placeholder="i18n('json_label_key')"
            @click="copyText(inputModel.key)"
            readonly />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-input
            v-model:value="inputModel.value"
            size="large"
            type="textarea"
            round
            :spellcheck="false"
            @dblclick="copyText(inputModel.value)"
            clearable
            class="dynamic-textarea"
            :autosize="{
              minRows: 18,
              maxRows: 18,
            }" />
        </n-form-item>
      </n-form>
      <n-flex vertical class="button-container"
        ><n-flex align="baseline">
          <n-button size="tiny" @click="modifyInputValue"
            ><template #icon>
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
              </n-icon> </template
            >{{ i18n("json_btn_modify") }}</n-button
          >
          <n-button
            size="tiny"
            secondary
            strong
            v-show="inputModel.oldValue != inputModel.value && isModified"
            @click="handleCancel"
            ><template #icon>
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
              </n-icon> </template
            >{{ i18n("json_btn_undo") }}
          </n-button>
          <n-button size="tiny" @click="deUri"
            ><template #icon>
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
              </n-icon> </template
            >deUri</n-button
          >
          <n-button size="tiny" @click="handleBase64"
            ><template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path
                    d="M2.61 19c.48 0 .91-.3 1.06-.75l1.01-2.83h5.65l.99 2.82c.16.46.59.76 1.07.76c.79 0 1.33-.79 1.05-1.52L9.19 6.17C8.93 5.47 8.25 5 7.5 5s-1.43.47-1.69 1.17L1.56 17.48c-.28.73.27 1.52 1.05 1.52zM7.44 7.6h.12l2.03 5.79H5.41L7.44 7.6zM15 12c0-.55.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1z"
                    fill="currentColor"></path>
                </svg>
              </n-icon> </template
            >{{ isBase64Ref ? "deBase64" : "enBase64" }}</n-button
          >
          <n-button size="tiny" @click="formatLine"
            ><template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path
                    d="M5 9h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h8c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1z"
                    fill="currentColor"></path>
                </svg>
              </n-icon> </template
            >Compact</n-button
          >
          <n-button size="tiny" v-if="isDateTime" @click="formatDateTime"
            ><template #icon>
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
              </n-icon> </template
            >Time</n-button
          >
          <n-button
            text
            tag="a"
            :href="urlValueRef"
            v-if="urlValueRef != null"
            target="_blank"
            type="primary">
            {{ i18n("json_btn_link") }}
          </n-button>
        </n-flex>
        <n-flex align="baseline">
          <n-button size="tiny" @click="expandAllNodes"
            ><template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path d="M7 10l5 5l5-5z" fill="currentColor"></path>
                </svg>
              </n-icon> </template
            >{{ i18n("json_btn_expand_all") }}
          </n-button>
          <n-button size="tiny" @click="collapseAllNodes"
            ><template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path d="M7 14l5-5l5 5z" fill="currentColor"></path>
                </svg>
              </n-icon> </template
            >{{ i18n("json_btn_collapse_all") }}
          </n-button>
          <n-button size="tiny" @click="handleExpandTo"
            ><template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path
                    d="M4 15c-.55 0-1 .45-1 1v3c0 1.1.9 2 2 2h3c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1zm1-9c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V6zm14-3h-3c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V5c0-1.1-.9-2-2-2zm0 15c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c1.1 0 2-.9 2-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v2zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z"
                    fill="currentColor"></path>
                </svg>
              </n-icon> </template
            >{{ i18n("json_btn_expand_node") }}</n-button
          >
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
              </n-icon> </template
            >{{ i18n("json_btn_scroll_to_node") }}</n-button
          >
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
  NA,
  NTree,
  NIcon,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NGradientText,
  NAlert,
  NBackTop,
  useLoadingBar,
  NButtonGroup,
  NDropdown,
  NSwitch,
  NPopover,
  type TreeOption,
  type TreeInst,
} from "naive-ui";
import {
  ref,
  reactive,
  h,
  watch,
  shallowRef,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { debounce } from "lodash-es";
import FolderIcon from "./icon/Folder.vue";
import FolderOpenIcon from "./icon/FolderOpen.vue";
import FileTrayIcon from "./icon/FileTray.vue";
import LinkIcon from "./icon/Link.vue";
import { currentTheme } from "@/utils/theme";
import { getDiscreteApi } from "@/utils/message";
import { i18n } from "@/utils/i18n";
import {
  getItem,
  setItem,
  defaultOptions,
  JT,
  isBase64,
  getLastArrayIndexFromPath,
  isValidUrl,
} from "@/utils/common";
import {
  parseJsonWithErrorDetails,
  optimizedJsonSort,
  getValueByPath,
  setValueByPath,
  strExt,
} from "@/utils/json";
import TextLine from "./TextLine.vue";
import SearchPopover from "./SearchPopover.vue";
import useClipboard from "vue-clipboard3";
import {
  type CustomTreeOption,
  type JsonParseResult,
  type InputModel,
} from "@/utils/types";
import { FormatConverter } from "@/utils/convert";
import {
  isDateOrTime,
  isTimestamp,
  timestampToISO8601,
  formats,
} from "@/utils/datetime";
const { toClipboard } = useClipboard(); //复制
const copyText = async (val: any) => {
  try {
    await toClipboard(val);
    const { message } = getDiscreteApi();
    message.success(i18n("copy_success_msg"));
  } catch (e) {}
};
const loadingBar = useLoadingBar(); //加载条
const treeInstRef = ref<TreeInst | null>(null); //树实例
const jsonData = ref<string | null>(null); //原始JSON数据
const jsonParsedData = ref<any>(); //数据格式化JSON数据
const chunks = ref<string[]>([]); //数据分片
const treeData = shallowRef<CustomTreeOption[]>([]); //tree数据
const expandedKeys = shallowRef<(string | number)[]>([]); //展开节点
const selectedKeys = ref<(string | number)[]>([]); //选中的节点key
const allExpandableKeys = ref<(string | number)[]>([]); //所有可展开的节点key
const keyToParentMap = ref<Map<string, string | null>>(new Map()); //父节点缓存key map
const currentNodePath = ref<string | undefined>(); //当前节点路径
const options = reactive(defaultOptions); //配置选项;
const inputFormRef = ref<any>(); //输入表单Ref

const inputModel = ref<InputModel>({
  path: null,
  value: null,
  key: null,
  oldValue: null,
  showValue: true,
  showLength: false,
  showIcon: false,
  folderStyle: false,
  rememberData: false,
}); //输入表单数据
const urlValueRef = ref<string | null>(null); //url value
const showInputPanel = ref<boolean>(false); //控制输入面板展示隐藏
const dataSource = ref<string | null>(""); //数据来源
const showCollapsePannel = ref<boolean>(false); //控制输入面板折叠/展开
const fileInput = ref<HTMLInputElement | null>(null);
const testData = ref<any[]>([
  {
    extension: "JSON-Tool",
    always_free: true,
    author: "Libs",
    emoji: "🐔 🐝 🐲 ☎️ 🫠 🕵️‍♂️ 🦓",
    features: [],
    bugs: {},
    links: ["https://github.com/laboratorys/JSON-Tool"],
    time: new Date(),
    introduce:
      "JSON-Tool is a powerful, all-in-one Browser extension designed to streamline JSON workflows and enhance developer productivity. Packed with smart features and essential utilities, it’s the perfect companion for developers, testers, and anyone working with structured data.",
  },
]); //测试数据
const yamlTestData = ref<string>(
  FormatConverter.jsonToYaml(JSON.stringify(testData.value))
);
const inputStartValue = ref<string | null>(
  JT.stringify(testData.value, null, "    ")
); //输入JSON数据
const isModified = ref(false);
const clickStyle = ref<Record<string, string>>({});
const treeHeight = ref(400); // 默认高度
const pattern = ref(""); //搜索
const showSearch = ref(false);
const isBase64Ref = ref(false); //值是不是base64
const jpr = ref<JsonParseResult | null>();
const searchResultKeys = ref<string[]>([]); //搜索结果Keys
const currentKeyIndex = ref<number>(-1); //当前key索引
const currentKey = ref<string>(""); //当前key
const textType = ref<string>("json"); //输入文本类型
const isDateTime = ref(false); //输入值是否是日期时间格式
// 缓存前缀的 Map
const prefixCache = new Map<string, any>();
const colorMap = new Map<string, any>();
const convertOptions = [
  {
    label: "YAML To JSON",
    key: "toJson",
  },
  {
    label: "JSON To YAML",
    key: "toYaml",
  },
]; //文本格式转换
//JSON PATH提示背景色根据当前主题切换
const bgCss = computed(() => {
  if (currentTheme.value.name === "dark") {
    return "border-top: 1px solid #242832;background-color:#101218";
  }
  return "border-top: 1px solid #fff;background-color:#eee";
});
// 计算树的高度
const updateTreeHeight = () => {
  const windowHeight = window.innerHeight;
  const offset = 25;
  treeHeight.value = windowHeight - offset;
};
const debouncedUpdateHeight = debounce(updateTreeHeight, 100); //防抖
const isExtension = ref(
  typeof browser !== "undefined" && browser.runtime && browser.runtime.id
);
//生命周期钩子
onMounted(() => {
  //更新高度
  debouncedUpdateHeight();
  //监听ctrl+k事件
  window.addEventListener("keydown", handleKeydown);
  //监听窗口大小改变
  window.addEventListener("resize", debouncedUpdateHeight);
  if (showCollapsePannel.value) {
    clickStyle.value = { height: "80vh" };
  }
  //读取配置信息
  getItem("options").then((v: any) => {
    if (v) {
      Object.assign(options, v);
    }
    //根据配色初始化前缀缓存
    initializePrefixCache(options.color);
    options.color.forEach((item) => {
      colorMap.set(item.type, item);
    });
  });
  //获取偏好设置
  getItem("preference").then((v: any) => {
    inputModel.value.showIcon = v?.showIcon;
    inputModel.value.showLength = v?.showLength || false;
    inputModel.value.showValue = v?.showValue || true;
    inputModel.value.folderStyle = v?.folderStyle || false;
    inputModel.value.rememberData = v?.rememberData || false;
  });
  //发送消息，页面准备就绪
  window.parent.postMessage({ action: "ready" }, "*");
  //接收来自content.ts的数据消息
  window.addEventListener("message", (event) => {
    if (event.data.action === "fromUrl") {
      dataSource.value = "url";
      loadingBar.start();
    } else if (event.data.action === "displayJsonChunk") {
      const { chunk, index, total } = event.data;
      chunks.value[index] = chunk;
      if (
        chunks.value.length === total &&
        chunks.value.every((c) => c !== undefined)
      ) {
        jsonData.value = chunks.value.join("");
        chunks.value = []; // 清空
        var parsedData = JT.parse(jsonData.value);
        if (options.sortKeys) {
          parsedData = optimizedJsonSort(parsedData, {
            sortArrays: true,
          });
        }
        jsonParsedData.value = parsedData;
        treeData.value = buildTree(parsedData);
        if (options.treeExpandMode) {
          expandedKeys.value = allExpandableKeys.value;
        }
        loadingBar.finish();
      }
    }
  });
  if (isExtension.value) {
    //发送消息到background.ts，当前Tab标签页准备就绪
    browser.tabs.getCurrent((tab) => {
      if (tab?.id) {
        browser.runtime.sendMessage({ action: "ready", tabId: tab.id });
      }
    });
  } else {
    dataSource.value = "input";
    setInputData();
  }
});
//设置输入历史数据
const setInputData = () => {
  getItem("preference").then((v: any) => {
    inputModel.value.rememberData = v?.rememberData || false;
    if (inputModel.value.rememberData) {
      getItem("inputData").then((v: any) => {
        if (v !== null) {
          inputStartValue.value = JT.stringify(JT.parse(v), null, "    ");
        }
      });
    } else {
      inputStartValue.value = JT.stringify(testData.value, null, "    ");
    }
  });
};
if (isExtension.value) {
  //监听background.ts发来的数据消息
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "sendData" && message.from === "input") {
      dataSource.value = "input";
      setInputData();
    }
    if (message.action === "sendData" && message.data !== null) {
      dataSource.value = "input";
      inputStartValue.value = message.data;
    }
  });
} else {
  dataSource.value = "input";
  setInputData();
}

onUnmounted(() => {
  window.removeEventListener("resize", debouncedUpdateHeight);
  window.removeEventListener("keydown", handleKeydown);
});
//获取数据类型
const getType = (data: any): string => {
  if (data === null) {
    return "null";
  }
  return Array.isArray(data) ? "array" : typeof data;
};
// 生成唯一 key 的计数器
let keyCounter = 0;
//生成Tree的key
const generateKey = (prefix: string): string => {
  const safePrefix = prefix || "node"; // 默认值防止空 prefix
  return `${safePrefix}-${keyCounter++}`;
};
// 构建树形结构
const buildTree = (
  data: any,
  labelPrefix: string = "JSON",
  parentPath: string = "JSON",
  parentKey: string | null = null
): CustomTreeOption[] => {
  const dataType = getType(data);
  const root: CustomTreeOption = {
    key: generateKey(labelPrefix),
    k: labelPrefix,
    v: dataType === "object" || dataType === "array" ? null : data,
    type: dataType,
    isLeaf: !(dataType === "object" || dataType === "array"),
    path: parentPath,
  };
  const children: CustomTreeOption[] = [];

  if (labelPrefix === "JSON") {
    allExpandableKeys.value = [];
    keyToParentMap.value.clear();
  }

  if (!root.isLeaf) {
    allExpandableKeys.value.push(root.key);
  }

  keyToParentMap.value.set(root.key, parentKey);

  if (data === null) {
    root.k = labelPrefix;
    root.v = null;
    root.isLeaf = true;
    return [root];
  }

  if (dataType === "array") {
    data.forEach((item: any, index: number) => {
      const itemType = getType(item);
      const childPath = `${parentPath}[${index}]`;
      const childNode: CustomTreeOption = {
        key: generateKey(`arr-${index}`),
        k: itemType === "object" || itemType === "array" ? `${index}` : null,
        v: itemType === "object" || itemType === "array" ? null : item,
        type: itemType,
        isLeaf: !(itemType === "object" || itemType === "array"),
        path: childPath,
      };

      if (itemType === "object" || itemType === "array") {
        // 修正：传入当前子节点的key作为父键
        const subTree = buildTree(
          item,
          `arr-${index}`,
          childPath,
          childNode.key
        )[0];
        childNode.children = subTree.children || [];
        childNode.isLeaf = childNode.children.length === 0;
      }

      keyToParentMap.value.set(childNode.key, root.key);
      if (!childNode.isLeaf) {
        allExpandableKeys.value.push(childNode.key);
      }
      children.push(childNode);
    });
  } else if (dataType === "object") {
    Object.entries(data).forEach(([key, value]) => {
      const valueType = getType(value);
      const childPath = `${parentPath}.${key}`;
      const childNode: CustomTreeOption = {
        key: generateKey(`obj-${key}`),
        k: key,
        v: valueType === "object" || valueType === "array" ? null : value,
        type: valueType,
        isLeaf: !(valueType === "object" || valueType === "array"),
        path: childPath,
      };

      if (valueType === "object" || valueType === "array") {
        // 修正：传入当前子节点的key作为父键
        const subTree = buildTree(
          value,
          `obj-${key}`,
          childPath,
          childNode.key
        )[0];
        childNode.children = subTree.children || [];
        childNode.isLeaf = childNode.children.length === 0;
      }

      keyToParentMap.value.set(childNode.key, root.key);
      if (!childNode.isLeaf) {
        allExpandableKeys.value.push(childNode.key);
      }
      children.push(childNode);
    });
  } else {
    root.k = labelPrefix;
    root.v = data;
    root.isLeaf = true;
    return [root];
  }

  if (children.length) {
    root.children = children;
    root.isLeaf = false;
  }

  return [root];
};
//渲染节点内容
const renderNodeContent = (
  option: CustomTreeOption,
  extraContent: any[] = []
) => {
  let k = inputModel.value.showValue ? `${option.k}: ` : `${option.k}`;
  if (option.type === "object" || option.type === "array") {
    k = `${option.k}`;
  } else if (option.k === null) {
    k = "";
  }
  let v = `${String(option.v)}`;
  let vColor = colorMap.get(option.type).color;
  if (option.type === "object" || option.type === "array") {
    v = "";
  }

  const content = [getPrefixByType(option)];

  if (extraContent.length === 0 && k) {
    let kColor = "";
    if (option.type === "array") {
      kColor = colorMap.get("array").color;
    } else {
      if (option.isLeaf) {
        kColor = colorMap.get("key").color;
      }
    }
    content.push(
      h(
        "span",
        {
          style: {
            color: kColor,
            lineHeight: "20px",
            verticalAlign: "middle",
            fontSize: "15px",
            display: "block",
          },
        },
        k
      )
    );
  }

  if (inputModel.value.showValue && option.isLeaf) {
    if (isValidUrl(String(v))) {
      content.push(
        h(
          NButton,
          {
            text: true,
            tag: "a",
            href: v,
            target: "_blank",
            style: {
              color: "#63E2B7FF",
              marginLeft: "5px",
              lineHeight: "20px",
              verticalAlign: "middle",
              fontSize: "15px",
            },
            onClick: (e) => {
              if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
              }
            },
          },
          {
            default: () => v,
            icon: () =>
              h(NIcon, null, {
                default: () => h(LinkIcon),
              }),
          }
        )
      );
    } else {
      content.push(
        h(
          "span",
          {
            style: {
              color: vColor,
              marginLeft: "5px",
              lineHeight: "20px",
              verticalAlign: "middle",
              fontSize: "15px",
            },
          },
          v
        )
      );
    }
  }

  content.push(...extraContent);

  return h(
    NFlex,
    {
      align: "center",
      wrap: false,
      size: "small",
      style: { lineHeight: "20px" },
    },
    { default: () => content }
  );
};
//渲染label
const renderLabel = ({ option }: { option: any }) => {
  //根节点渲染popover搜索
  const extraContent =
    option.key === "JSON-0"
      ? [
          h(SearchPopover, {
            triggerText: option.k || "JSON",
            currentKeyIndex: currentKeyIndex.value,
            allKeysLength: searchResultKeys.value.length,
            show: showSearch.value,
            "onUpdate:show": (value: boolean) => {
              showSearch.value = value;
            },
            "onUpdate:pattern": (value: string) => {
              pattern.value = value;
              searchResultKeys.value = [];
            },
            onMoveUp: handleMoveUp,
            onMoveDown: handleMoveDown,
          }),
        ]
      : [];
  return renderNodeContent(option, []);
};
//处理搜索结果上移
const handleMoveUp = () => {
  if (currentKeyIndex.value < searchResultKeys.value.length - 1) {
    currentKeyIndex.value = currentKeyIndex.value + 1;
    currentKey.value = searchResultKeys.value[currentKeyIndex.value];
    selectedKeys.value = [currentKey.value];
    treeInstRef.value?.scrollTo({ key: currentKey.value });
  }
};
//处理搜索结果下移
const handleMoveDown = () => {
  if (currentKeyIndex.value > 0) {
    currentKeyIndex.value = currentKeyIndex.value - 1;
    currentKey.value = searchResultKeys.value[currentKeyIndex.value];
    selectedKeys.value = [currentKey.value];
    treeInstRef.value?.scrollTo({ key: currentKey.value });
  }
};
//初始化前缀缓存，避免每次都加载
const initializePrefixCache = (options: any[]) => {
  options.forEach((option) => {
    prefixCache.set(option.type, genPrefix(option.color, option.text));
  });
};
//根据类型获取前缀
const getPrefixByType = (option: CustomTreeOption) => {
  if (!inputModel.value.showIcon) {
    return null;
  }
  if (inputModel.value.folderStyle) {
    if (option.type === "array" || option.type === "object") {
      const isExpanded = expandedKeys.value.includes(option.key);
      return h(NIcon, null, {
        default: () => h(isExpanded ? FolderOpenIcon : FolderIcon),
      });
    } else {
      return h(NIcon, null, {
        default: () => h(FileTrayIcon),
      });
    }
  }
  const cacheKey = `${option.type}`;
  return prefixCache.get(cacheKey) || null;
};
//渲染后缀（array&object长度）
const renderSuffix = ({ option }: { option: TreeOption }) => {
  const customOption = option as CustomTreeOption;
  var dataSize = customOption?.children?.length
    ? customOption.children.length
    : 0;
  const noneValidMode =
    customOption.type === "object" && options.showLengthMode === "arr";
  const text = customOption.type === "object" ? "props" : "items";
  return noneValidMode || customOption.isLeaf || !inputModel.value.showLength
    ? null
    : h(
        NButton,
        {
          color: "#d3d3d3",
          size: "tiny",
          style: { marginLeft: "10px", height: "16px" },
        },
        { default: () => `${dataSize} ${text}` }
      );
};
//生成前缀
const genPrefix = (color: string, text: string) => {
  return h(
    "span",
    {
      style: {
        color: `${color}`,
        lineHeight: "20px", // 统一行高
        marginRight: "4px", // 与 label 保持间距
        verticalAlign: "middle",
        fontSize: "smaller",
      },
    },
    `${text}`
  );
};
//节点属性，自定义事件
const nodeProps = ({ option }: { option: TreeOption }) => {
  const customOption = option as CustomTreeOption;
  return {
    onClick() {
      //点击节点，赋值给输入区域
      inputModel.value.path = customOption.path;
      inputModel.value.key = customOption.k;
      inputModel.value.nodeKey = customOption.key;
      inputModel.value.value = getValueByPath(
        jsonParsedData.value,
        customOption.path
      );
      const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([/?].*)?$/i;
      const cleanStr = strClean(inputModel.value.value); //先清理下字符串
      //检查是不是url
      if (urlRegex.test(cleanStr)) {
        urlValueRef.value = cleanStr;
      } else {
        urlValueRef.value = null;
      }
      if (option.k === null) {
        inputModel.value.key = getLastArrayIndexFromPath(customOption.path);
      }
      if (inputModel.value.value != null) {
        isDateTime.value = isDateOrTime(cleanStr);
      }
      //设置旧数据，撤销修改使用
      inputModel.value.oldValue = inputModel.value.value;
      //base64检查
      isBase64Ref.value = isBase64(inputModel.value.value);
      //显示面板
      showInputPanel.value = true;
      showCollapsePannel.value = true;
      clickStyle.value = {};
      //设置选中key
      selectedKeys.value = [customOption.key];
    },
    onMouseover() {
      //鼠标移入，显示JSON Path
      currentNodePath.value = customOption.path;
    },
    onMouseout() {
      //鼠标移出清空路径
      currentNodePath.value = "";
    },
  };
};
//展开更新前缀
const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: "expand" | "collapse" | "filter";
  }
) => {
  expandedKeys.value = _keys;
  return;
};

//文本压缩成一行
const formatLine = () => {
  let result;
  try {
    const json = JT.parse(inputModel.value.value);
    result = JT.stringify(json);
    result = result.replace(/\s+/g, "");
  } catch (e) {
    result = String(inputModel.value.value)
      .replace(/\r\n/g, "\\n")
      .replace(/\r/g, "\\n")
      .replace(/\n/g, "\\n");
  }
  inputModel.value.value = result;
};
//Uri解码
const deUri = () => {
  if (inputModel.value.value !== null) {
    inputModel.value.value = decodeURIComponent(inputModel.value.value);
  }
};
//处理Base64
const handleBase64 = () => {
  if (inputModel.value.value === null) return;
  try {
    if (getType(inputModel.value.value) === "string") {
      if (isBase64Ref.value) {
        //Base64格式解码
        inputModel.value.value =
          '"' + atob(inputModel.value.value.replace(/^['"]|['"]$/g, "")) + '"';
        isBase64Ref.value = false;
      } else {
        //Base64编码
        inputModel.value.value =
          '"' + btoa(inputModel.value.value.replace(/^['"]|['"]$/g, "")) + '"';
        isBase64Ref.value = true;
      }
    }
  } catch (e) {}
};
//展开所有节点
const expandAllNodes = () => {
  expandedKeys.value = [...allExpandableKeys.value];
};
//收起所有节点
const collapseAllNodes = () => {
  expandedKeys.value = [];
};
//滚动到某节点
const handleScrollTo = () => {
  treeInstRef.value?.scrollTo({ key: inputModel.value.nodeKey });
};
//展开某节点
const handleExpandTo = () => {
  if (selectedKeys.value.length === 0) return; // 无选中节点时不操作
  const targetKey = selectedKeys.value[0];
  const parentKeys = getParentKeys(String(targetKey));
  parentKeys.push(String(targetKey));
  treeInstRef.value?.scrollTo({ key: inputModel.value.nodeKey });
  expandedKeys.value = parentKeys;
};
//获取父节点Keys
const getParentKeys = (targetKey: string) => {
  const keys = [];
  let currentKey = targetKey;
  while (currentKey && keyToParentMap.value.has(currentKey)) {
    const parentKey = keyToParentMap.value.get(currentKey);
    if (parentKey) keys.push(parentKey);
    currentKey = String(parentKey);
  }
  return keys;
};
//字符串清理：前后引号
const strClean = (v: any) => {
  return String(v.replace(/^['"]|['"]$/g, ""));
};
//修改输入值
const modifyInputValue = () => {
  let modifyInputValue = inputModel.value.value;
  if (modifyInputValue !== null && getType(modifyInputValue) === "string") {
    modifyInputValue = modifyInputValue.replace(/^['"]|['"]$/g, "");
  }
  let parsedValue = modifyInputValue;
  try {
    parsedValue = JT.parse(modifyInputValue);
  } catch (e) {}
  const valueType = getType(parsedValue);
  if (valueType === "array" || valueType === "object") {
    inputModel.value.value = JT.stringify(parsedValue, null, "    ");
  }
  modifyNodeByKey(inputModel.value.nodeKey, modifyInputValue);
  isModified.value = true;
};
//根据key查找节点
const findNodeByKey = (
  tree: CustomTreeOption[],
  key: string | undefined
): CustomTreeOption | null => {
  for (const node of tree) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
};
//根据key修改节点
const modifyNodeByKey = (key: string | undefined, newValue: string | null) => {
  const targetNode: CustomTreeOption | null = findNodeByKey(
    treeData.value,
    key
  );
  if (targetNode === null) {
    console.error(`Node with key ${key} not found`);
    return;
  }

  let parsedValue = newValue;
  try {
    parsedValue = JT.parse(newValue);
  } catch (e) {}
  const valueType = getType(parsedValue);
  targetNode.v =
    valueType === "object" || valueType === "array" ? null : parsedValue;
  targetNode.type = valueType;
  targetNode.isLeaf = !(valueType === "object" || valueType === "array");

  // 如果节点从叶子变为非叶子，重新构建子树并更新 allExpandableKeys
  if (!targetNode.isLeaf) {
    const subTree = buildTree(
      parsedValue,
      String(targetNode.k),
      targetNode.path,
      targetNode.key
    )[0];
    targetNode.children = subTree.children || [];

    // 更新 allExpandableKeys 和 keyToParentMap
    if (!allExpandableKeys.value.includes(targetNode.key)) {
      allExpandableKeys.value.push(targetNode.key);
    }
    updateExpandableKeys(targetNode.children || [], targetNode.key);
  } else {
    targetNode.children = [];
    // 如果从非叶子变为叶子，从 allExpandableKeys 中移除
    allExpandableKeys.value = allExpandableKeys.value.filter(
      (k) => k !== targetNode.key
    );
  }

  // 更新 JSON 数据
  jsonParsedData.value = setValueByPath(
    jsonParsedData.value,
    targetNode.path,
    parsedValue
  );

  // 深拷贝 treeData 以确保响应式更新
  treeData.value = JSON.parse(JSON.stringify(treeData.value));
};

// 辅助函数：递归更新 allExpandableKeys 和 keyToParentMap
const updateExpandableKeys = (
  children: CustomTreeOption[],
  parentKey: string
) => {
  children.forEach((child) => {
    keyToParentMap.value.set(child.key, parentKey);
    if (!child.isLeaf && !allExpandableKeys.value.includes(child.key)) {
      allExpandableKeys.value.push(child.key);
    }
    if (child.children) {
      updateExpandableKeys(child.children, child.key);
    }
  });
};
//处理撤回修改
const handleCancel = () => {
  inputModel.value.value = inputModel.value.oldValue;
  modifyInputValue();
  isModified.value = false;
};
//处理输入值
const handleStartInput = () => {
  if (inputStartValue.value === null) return;
  if (textType.value === "yaml") {
    inputStartValue.value = FormatConverter.yamlToJson(
      String(inputStartValue.value)
    );
  }
  const result: JsonParseResult = parseJsonWithErrorDetails(
    inputStartValue.value
  );
  jpr.value = result;
  if (result.isValid) {
    jsonData.value = inputStartValue.value;
    jsonParsedData.value = JT.parse(jsonData.value);
    if (options.sortKeys) {
      jsonParsedData.value = optimizedJsonSort(jsonParsedData.value, {
        sortArrays: true,
      });
    }
    treeData.value = buildTree(jsonParsedData.value);
    if (options.treeExpandMode) {
      expandedKeys.value = allExpandableKeys.value;
    }
  }
  if (inputModel.value.rememberData) {
    setItem("inputData", inputStartValue.value);
  }
};
//输入格式错误
const handleModifyErrorInput = () => {
  jpr.value = null;
};
//收起面板
const collapsePannel = () => {
  showCollapsePannel.value = !showCollapsePannel.value;
  clickStyle.value = showCollapsePannel.value
    ? {}
    : { width: "27px", height: "27px" };
};
//打开设置页面
const openOptionsTab = () => {
  var options_url = browser.runtime.getURL("/options.html");
  browser.tabs.create({ url: options_url, selected: true });
};
//监听输入数据
watch(
  inputModel,
  () => {
    //更新偏好设置
    setItem("preference", {
      showValue: inputModel.value.showValue,
      showLength: inputModel.value.showLength,
      showIcon: inputModel.value.showIcon,
      folderStyle: inputModel.value.folderStyle,
      rememberData: inputModel.value.rememberData,
    });
  },
  { deep: true }
);

//tree搜索过滤
const treeFilter = (pattern: string, node: TreeOption) => {
  const customOption = node as CustomTreeOption;
  if (!pattern) return true;
  const label = customOption.k || "";
  const value =
    customOption.v !== null && customOption.v !== undefined
      ? String(customOption.v)
      : "";
  const result =
    customOption.key === "JSON-0" ||
    label.toLowerCase().includes(pattern.toLowerCase()) ||
    value.toLowerCase().includes(pattern.toLowerCase());
  if (result && customOption.key !== "JSON-0") {
    searchResultKeys.value.push(customOption.key);
  }
  return result;
};
//监听搜索结果Key
watch(
  searchResultKeys,
  (newVal, oldVal) => {
    if (newVal.length === 0) {
      currentKeyIndex.value = -1;
      currentKey.value = "";
    }
    if (newVal.length > 0) {
      currentKeyIndex.value = 0;
      currentKey.value = newVal[0];
    }
    if (currentKeyIndex.value >= 0) {
      selectedKeys.value = [currentKey.value];
    }
  },
  { deep: true }
);
//监听ctrl+k事件：弹出搜索
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "k") {
    event.preventDefault();
    showSearch.value = !showSearch.value;
  }
};
//文件读取JSON
const handleFileChange = (event: Event) => {
  loadingBar.start();
  const target = event.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];
  if (!file) return;
  const reader: FileReader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>): void => {
    const content = (e.target?.result as string) || "";
    inputStartValue.value = content;
    loadingBar.finish();
  };
  reader.onerror = (e: ProgressEvent<FileReader>): void => {
    console.error("File read error: ", e);
    loadingBar.error();
    const { message } = getDiscreteApi();
    message.error("File read error!");
  };
  reader.readAsText(file);
};
const triggerFileInput = (): void => {
  fileInput.value?.click();
};
//文本类型切换
const handleChgTextType = (type: string) => {
  textType.value = type;
  if (type === "json") {
    inputStartValue.value = JT.stringify(testData.value, null, "    ");
  } else if (type === "yaml") {
    inputStartValue.value = yamlTestData.value;
  }
};
const handleConvert = (key: string | number) => {
  if (inputStartValue.value !== null) {
    try {
      if (key === "toJson") {
        inputStartValue.value = FormatConverter.yamlToJson(
          inputStartValue.value
        );
      } else if (key === "toYaml") {
        inputStartValue.value = FormatConverter.jsonToYaml(
          inputStartValue.value
        );
      }
    } catch (e) {}
  }
};
const formatIndex = ref(0);
const formatDateTime = () => {
  let cleanStr = strClean(inputModel.value.oldValue);
  const { formatter } = formats[formatIndex.value];
  if (!isNaN(Number(cleanStr)) && isTimestamp(Number(cleanStr))) {
    cleanStr = timestampToISO8601(Number(cleanStr));
  }
  var formatResult = formatter(cleanStr);
  if (!isNaN(Number(formatResult))) {
    inputModel.value.value = formatResult;
  } else {
    inputModel.value.value = strExt(formatter(cleanStr));
  }
  formatIndex.value = (formatIndex.value + 1) % formats.length;
};
</script>
<style scoped>
.pathTips {
  height: 25px;
  line-height: 1.6em;
  width: 100%;
  position: fixed;
  z-index: 15;
  left: 0;
  bottom: 0;
  padding: 0.2em 1em 0;
}
.input-panel {
  padding: 2px 2px 2px 2px;
  width: 540px;
  max-height: 90vh;
  position: fixed;
  z-index: 10;
  right: 2em;
  top: 1em;
  box-shadow: 4px 4px 9px rgba(0, 0, 50, 0.2),
    -3px -3px 30px rgba(88, 88, 188, 0.1) inset;
  transition: height 0.2s ease-out, width 0.2s ease-out;
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
}

.button-container {
  flex-shrink: 0;
}
.enter-input-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 502px;
  border-radius: 6px;
  box-shadow: 6px 5px 7px rgba(50, 50, 50, 0.4);
}
.flex-grow {
  flex: 1;
}
.enter-input-card {
  width: 672px;
  border-radius: 6px;
  box-shadow: 6px 5px 7px rgba(50, 50, 50, 0.4);
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
.scroll-container {
  max-height: 400px;
  overflow-y: auto; /* 仅垂直滚动 */
  overflow-x: hidden; /* 禁止水平滚动 */
  width: 100%; /* 外层宽度 100% */
  box-sizing: border-box; /* 包含 padding 和 border */
  border-radius: 4px;
  border-right: 1px solid #e8e8e8;
}
.textarea-container {
  position: relative;
  width: 100%;
}

.input-textarea {
  width: 100%;
}

.hover-button-group {
  position: absolute;
  top: 12px; /* 按钮组位于 textarea 上方 */
  right: -30px;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.2s ease; /* 平滑过渡 */
}

.textarea-container:hover .hover-button-group {
  opacity: 1; /* 鼠标悬停时显示 */
}
</style>
