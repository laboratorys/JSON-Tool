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
    <EnterInputCard
      :input-model="inputModel"
      :jpr="jpr"
      :input-start-value="inputStartValue"
      :text-type="textType"
      :convert-options="convertOptions"
      @handle-file-change="handleFileChange"
      @handle-start-input="handleStartInput"
      @handle-modify-error-input="handleModifyErrorInput"
      @handle-chg-text-type="handleChgTextType"
      @handle-convert="handleConvert"
      @update:input-start-value="(value) => (inputStartValue = value)" />
  </n-flex>
  <n-back-top :right="100" />
  <n-tree
    v-if="treeData.length > 0 && !isLoading"
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
  <InputPanel
    v-if="showInputPanel"
    :input-model="inputModel"
    :click-style="clickStyle"
    :show-collapse-pannel="showCollapsePannel"
    :is-modified="isModified"
    :is-base64-ref="isBase64Ref"
    :is-date-time="isDateTime"
    :expanded-keys="expandedKeys"
    :is-extension="isExtension"
    :is-encoded-ref="isEncodedRef"
    :all-json-paths="allJsonPaths"
    @collapse-pannel="collapsePannel"
    @modify-input-value="modifyInputValue"
    @handle-cancel="handleCancel"
    @de-uri="deUri"
    @handle-base64="handleBase64"
    @format-line="formatLine"
    @format-date-time="formatDateTime"
    @expand-collapsed-all-nodes="expandCollapsedAllNodes"
    @handle-expand-to="handleExpandTo"
    @handle-scroll-to="handleScrollTo"
    @open-options-tab="openOptionsTab"
    @save-as-file="saveAsFile"
    @handle-path-update-value="handlePathUpdateValue" />
  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    :show="showDropdownRef"
    :options="optionsRef"
    :x="xRef"
    :y="yRef"
    @select="handleSelect"
    @clickoutside="handleClickoutside" />
</template>
<script lang="ts" setup>
import {
  NFlex,
  NTree,
  NIcon,
  NButton,
  NBackTop,
  useLoadingBar,
  NPopover,
  NDropdown,
  type TreeOption,
  type TreeInst,
  type DropdownOption,
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
import InputPanel from "./components/InputPanel.vue";
import PicPanel from "./components/PicPanel.vue";
import EnterInputCard from "./components/EnterInputCard.vue";
import { debounce } from "lodash-es";
import FolderIcon from "./icon/Folder.vue";
import FolderOpenIcon from "./icon/FolderOpen.vue";
import FileTrayIcon from "./icon/FileTray.vue";
import CopyIcon from "./icon/Copy.vue";
import ViewIcon from "./icon/View.vue";
import LinkIcon from "./icon/Link.vue";
import { currentTheme } from "@/utils/theme";
import { getDiscreteApi } from "@/utils/message";
import {
  getItem,
  setItem,
  defaultOptions,
  JT,
  isBase64,
  isEncoded,
  getLastArrayIndexFromPath,
  isValidUrl,
  encodeKey,
  strClean,
  isImageUrl,
} from "@/utils/common";
import {
  parseJsonWithErrorDetails,
  optimizedJsonSort,
  getValueByPath,
  setValueByPath,
  strExt,
} from "@/utils/json";
import SearchPopover from "./components/SearchPopover.vue";
import {
  type CustomTreeOption,
  type JsonPathOption,
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
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const loadingBar = useLoadingBar(); //加载条
const isLoading = ref(true);
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
const inputModel = ref<InputModel>({
  path: null,
  value: null,
  valueType: "string",
  key: null,
  oldValue: null,
  showValue: true,
  showLength: false,
  showIcon: false,
  folderStyle: false,
  nodeKey: "JSON-0",
  rememberData: false,
  showInputPanel: false,
  clickStyle: {},
  showCollapsePannel: false,
}); //输入表单数据
const showInputPanel = ref<boolean>(false); //控制输入面板展示隐藏
const dataSource = ref<string | null>(""); //数据来源
const showCollapsePannel = ref<boolean>(false); //控制输入面板折叠/展开
const testData = ref<any[]>([
  {
    extension: "JSON-Tool",
    always_free: true,
    author: "Libs",
    emoji: "🐔 🐝 🐲 ☎️ 🫠 🕵️‍♂️ 🦓",
    since: 2025,
    logo: "https://json-docs.noki.icu/image/logo.svg",
    links: ["https://github.com/laboratorys/JSON-Tool"],
    time: new Date(),
    introduce: `JSON-Tool is a powerful, all-in-one Browser extension designed to streamline JSON workflows and enhance developer productivity. Packed with smart features and essential utilities, it’s the perfect companion for developers, testers, and anyone working with structured data.`,
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
const isEncodedRef = ref(false); //是否URI编码
const jpr = ref<JsonParseResult | null>(null);
const searchResultKeys = ref<string[]>([]); //搜索结果Keys
const currentKeyIndex = ref<number>(-1); //当前key索引
const currentKey = ref<string>(""); //当前key
const textType = ref<string>("json"); //输入文本类型
const isDateTime = ref(false); //输入值是否是日期时间格式
const allJsonPaths = ref<JsonPathOption[]>([]);
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
//右键菜单
const showDropdownRef = ref(false); //是否显示右键菜单
const xRef = ref(0); //坐标-X轴
const yRef = ref(0); //坐标-Y轴
const optionsRef = ref<DropdownOption[]>([]); //下拉选项
const rightClickTreeOption = ref<CustomTreeOption>();
const dropdownOptions = [
  {
    label: i18n("json_context_menu_op_copy_path"),
    key: "copyPath",
    icon() {
      return h(NIcon, null, {
        default: () => h(CopyIcon),
      });
    },
  },
  {
    label: i18n("json_context_menu_op_copy_key"),
    key: "copyKey",
    icon() {
      return h(NIcon, null, {
        default: () => h(CopyIcon),
      });
    },
  },
  {
    label: i18n("json_context_menu_op_copy_value"),
    key: "copyValue",
    icon() {
      return h(NIcon, null, {
        default: () => h(CopyIcon),
      });
    },
  },
];
const dropdownOptionsExt = [
  {
    type: "divider",
    key: "d1",
  },
  {
    label: i18n("json_context_menu_op_copy_origin_data"),
    key: "viewOriginalPage",
    icon() {
      return h(NIcon, null, {
        default: () => h(ViewIcon),
      });
    },
  },
];
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
  typeof browser !== "undefined" &&
    browser.runtime &&
    browser.runtime.id != null
);
//生命周期钩子
onMounted(async () => {
  // 立即计算初始高度
  updateTreeHeight(); // 非防抖，直接计算
  window.addEventListener("resize", debouncedUpdateHeight);
  window.addEventListener("keydown", handleKeydown);

  if (showCollapsePannel.value) {
    clickStyle.value = { height: "80vh" };
  }
  try {
    // 并行获取所有异步数据
    const [optionsData, preferenceData, savedExpandedKeys, savedSelectedKeys] =
      await Promise.all([
        getItem("options"),
        getItem("preference"),
        getItem("expandedKeys"),
        getItem("selectedKeys"),
      ]);

    // 更新配置
    if (optionsData) {
      Object.assign(options, optionsData);
      initializePrefixCache(options.color);
      options.color.forEach((item) => {
        colorMap.set(item.type, item);
      });
    }

    // 更新偏好设置
    if (preferenceData) {
      inputModel.value = {
        ...inputModel.value,
        showIcon: preferenceData.showIcon ?? false,
        showLength: preferenceData.showLength ?? false,
        showValue: preferenceData.showValue ?? true,
        folderStyle: preferenceData.folderStyle ?? false,
        rememberData: preferenceData.rememberData ?? false,
        showInputPanel: preferenceData.showInputPanel ?? false,
        showCollapsePannel: preferenceData.showCollapsePannel ?? false,
        clickStyle: preferenceData.clickStyle ?? {},
      };
    }

    // 如果配置了保存折叠状态，更新展开的节点
    if (options.saveCollapseStatus && savedExpandedKeys) {
      expandedKeys.value = savedExpandedKeys;
    }

    // 处理数据来源并初始化输入
    if (isExtension.value) {
      // 浏览器扩展模式：发送就绪消息
      browser.tabs.getCurrent((tab) => {
        if (tab?.id) {
          browser.runtime.sendMessage({ action: "ready", tabId: tab.id });
        }
      });

      // 设置消息监听器以接收输入数据
      browser.runtime.onMessage.addListener((message) => {
        if (
          message.action === "sendData" &&
          message.from === "input" &&
          dataSource.value !== "url"
        ) {
          dataSource.value = "input";
          setInputData(message.data);
        }
      });
    } else {
      dataSource.value = "input";
    }

    // 初始化输入数据
    await setInputData();

    // 向父窗口发送就绪消息
    window.parent.postMessage({ action: "ready" }, "*");

    // 处理传入的 JSON 分片
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
          chunks.value = [];
          let parsedData = JT.parse(jsonData.value);
          if (options.sortKeys) {
            parsedData = optimizedJsonSort(parsedData, { sortArrays: true });
          }
          jsonParsedData.value = parsedData;
          treeData.value = buildTree(parsedData);
          if (options.treeExpandMode && expandedKeys.value.length === 0) {
            expandedKeys.value = allExpandableKeys.value;
          }
          initPannelAfterBuildTree(savedSelectedKeys);
          loadingBar.finish();
        }
      }
    });
  } catch (error) {
    loadingBar.error();
    const { message } = getDiscreteApi();
    message.error("data load failed!");
  }
  isLoading.value = false;
});
//设置输入历史数据
const setInputData = (d?: null) => {
  getItem("preference").then((v: any) => {
    inputModel.value.rememberData = v?.rememberData || false;
    if (inputModel.value.rememberData) {
      getItem("inputData").then((v: any) => {
        if (v !== null) {
          if (d != null) {
            inputStartValue.value = d;
          } else {
            inputStartValue.value = JT.stringify(JT.parse(v), null, "    ");
          }
        }
      });
    } else {
      if (d != null) {
        inputStartValue.value = d;
      } else {
        inputStartValue.value = JT.stringify(testData.value, null, "    ");
      }
    }
  });
};
if (isExtension.value) {
  //监听background.ts发来的数据消息
  browser.runtime.onMessage.addListener((message) => {
    if (
      message.action === "sendData" &&
      message.from === "input" &&
      dataSource.value != "url"
    ) {
      dataSource.value = "input";
      setInputData(message.data);
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
interface BuildTreeContext {
  processedPaths: Set<string>;
  isRootCall?: boolean;
}
// 构建树形结构
const buildTree = (
  data: any,
  labelPrefix: string = "JSON",
  parentPath: string = "JSON",
  parentKey: string | null = null,
  context?: BuildTreeContext
): CustomTreeOption[] => {
  // 初始化上下文
  const ctx = context || {
    processedPaths: new Set(),
    isRootCall: true,
  };
  const dataType = getType(data);
  const root: CustomTreeOption = {
    key: generateKey(labelPrefix),
    k: labelPrefix,
    v: dataType === "object" || dataType === "array" ? null : data,
    type: dataType,
    isLeaf: !(dataType === "object" || dataType === "array"),
    path: parentPath,
  };
  // 添加根路径
  if (ctx.isRootCall) {
    allJsonPaths.value.push({
      label: parentPath,
      value: parentPath,
      treeOption: root,
    });
    ctx.processedPaths.add(parentPath);
  }
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
          childNode.key,
          { ...ctx, isRootCall: false } // 保持同一上下文
        )[0];
        childNode.children = subTree.children || [];
        childNode.isLeaf = childNode.children.length === 0;
      }

      keyToParentMap.value.set(childNode.key, root.key);
      if (!childNode.isLeaf) {
        allExpandableKeys.value.push(childNode.key);
      }
      children.push(childNode);
      if (!ctx.processedPaths.has(childPath)) {
        allJsonPaths.value.push({
          label: childPath,
          value: childPath,
          treeOption: childNode,
        });
        ctx.processedPaths.add(childPath);
      }
    });
  } else if (dataType === "object") {
    Object.entries(data).forEach(([key, value]) => {
      const valueType = getType(value);
      const childPath = `${parentPath}.${encodeKey(key)}`;
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
          childNode.key,
          { ...ctx, isRootCall: false } // 保持同一上下文
        )[0];
        childNode.children = subTree.children || [];
        childNode.isLeaf = childNode.children.length === 0;
      }

      keyToParentMap.value.set(childNode.key, root.key);
      if (!childNode.isLeaf) {
        allExpandableKeys.value.push(childNode.key);
      }
      children.push(childNode);
      if (!ctx.processedPaths.has(childPath)) {
        allJsonPaths.value.push({
          label: childPath,
          value: childPath,
          treeOption: childNode,
        });
        ctx.processedPaths.add(childPath);
      }
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
  const isSelected = selectedKeys.value.includes(option.key);
  const theme = currentTheme.value.name === "dark" ? "dark" : "light";
  if (option.type === "object" || option.type === "array") {
    k = `${option.k}`;
  } else if (option.k === null) {
    k = "";
  }
  let v = `${String(option.v)}`;
  let vColor = colorMap.get(option.type)[theme];
  if (option.type === "object" || option.type === "array") {
    v = "";
  }
  var textColor = "white";
  if (theme === "dark") {
    textColor = "black";
  }
  const prefix = getPrefixByType(
    option,
    isSelected,
    isSelected ? textColor : ""
  );
  const content: any[] = [];
  if (extraContent.length === 0 && k) {
    let kColor = "";
    if (option.type === "array") {
      kColor = colorMap.get("array")[theme];
    } else {
      if (option.isLeaf) {
        kColor = colorMap.get("key")[theme];
      }
    }
    if (isSelected) {
      kColor = textColor;
      vColor = textColor;
    }
    content.push(prefix);
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
      var urlColor = "";
      if (isSelected) {
        if (theme === "dark") {
          urlColor = "black";
        } else {
          urlColor = "white";
        }
      }
      content.push(
        h(PicPanel, { url: String(v), urlColor: urlColor } as any, {})
      );
    } else {
      if (isSelected) {
        var textColor = "white";
        if (theme === "dark") {
          textColor = "black";
        }
        vColor = textColor;
      }
      content.push(
        h(
          "span",
          {
            style: {
              color: vColor,
              marginLeft: "0px",
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
  const theme = currentTheme.value.name === "dark" ? "dark" : "light";
  options.forEach((option) => {
    prefixCache.set(option.type, option);
  });
};
//根据类型获取前缀
const getPrefixByType = (
  option: CustomTreeOption,
  isSelected: boolean,
  c: string
) => {
  if (!inputModel.value.showIcon) {
    return null;
  }
  if (inputModel.value.folderStyle) {
    if (option.type === "array" || option.type === "object") {
      const isExpanded = expandedKeys.value.includes(option.key);
      return h(
        NIcon,
        { color: c },
        {
          default: () => h(isExpanded ? FolderOpenIcon : FolderIcon),
        }
      );
    } else {
      return h(
        NIcon,
        { color: c },
        {
          default: () => h(FileTrayIcon),
        }
      );
    }
  }
  const cacheKey = `${option.type}`;
  var op = prefixCache.get(cacheKey);
  const theme = currentTheme.value.name === "dark" ? "dark" : "light";
  var color = op[theme];
  if (isSelected) {
    if (theme === "dark") {
      color = "black";
    } else {
      color = "white";
    }
  }
  return genPrefix(color, op.text) || null;
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
  const isSelected = selectedKeys.value.includes(customOption.key);
  var bgColor = "#18a058";
  if (currentTheme.value.name === "dark") {
    bgColor = "#63e2b7";
  }
  return {
    style: isSelected
      ? {
          backgroundColor: bgColor,
          borderRadius: "6px",
          padding: "2px 8px",
        }
      : {},
    onClick() {
      if (options.showPannel.includes("leftClick")) {
        nodeClick(customOption);
      }
    },
    onMouseover(e: MouseEvent): void {
      //鼠标移入，显示JSON Path
      currentNodePath.value = customOption.path;
      e.preventDefault();
    },
    onMouseout(e: MouseEvent): void {
      //鼠标移出清空路径
      currentNodePath.value = "";
      e.preventDefault();
    },
    onContextmenu(e: MouseEvent): void {
      rightClickTreeOption.value = customOption;
      optionsRef.value = dropdownOptions;
      if (isExtension.value && dataSource.value == "url") {
        optionsRef.value = optionsRef.value.concat(dropdownOptionsExt);
      }
      showDropdownRef.value = true;
      xRef.value = e.clientX;
      yRef.value = e.clientY;
      e.preventDefault();
    },
  };
};
const nodeClick = (customOption: CustomTreeOption | null) => {
  if (customOption == null) return;
  //点击节点，赋值给输入区域
  inputModel.value.path = decodeURIComponent(customOption.path);
  inputModel.value.key = customOption.k;
  inputModel.value.nodeKey = customOption.key;
  const current = getValueByPath(jsonParsedData.value, customOption.path);
  const type = getType(current);
  if ((type === "array" || type === "object") && current !== null) {
    inputModel.value.value = JT.stringify(current, null, "    ");
  } else {
    inputModel.value.value = strExt(current);
  }
  inputModel.value.valueType = type;
  const cleanStr = strClean(inputModel.value.value);
  if (customOption.k === null) {
    inputModel.value.key = getLastArrayIndexFromPath(customOption.path);
  }
  if (inputModel.value.value != null) {
    isDateTime.value = isDateOrTime(cleanStr);
  }
  //设置旧数据，撤销修改使用
  inputModel.value.oldValue = inputModel.value.value;
  //base64检查
  isBase64Ref.value = isBase64(inputModel.value.value);
  isEncodedRef.value = isEncoded(inputModel.value.value);
  //显示面板
  if (!options.showPannel.includes("onlyBtn")) {
    showInputPanel.value = true;
    showCollapsePannel.value = true;
    clickStyle.value = {};
  }
  syncPannelConfig();
  //设置选中key
  selectedKeys.value = [customOption.key];
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
    result = JT.stringify(json, null, 0);
  } catch (e) {
    result = String(inputModel.value.value).replace(/\r\n|\r|\n/g, "\n");
  }
  inputModel.value.value = result;
};
//Uri编/解码
const deUri = () => {
  let result = inputModel.value.value;
  try {
    if (
      inputModel.value.value !== null &&
      inputModel.value.valueType === "string"
    ) {
      const str = strClean(inputModel.value.value);
      if (isEncodedRef.value) {
        result = decodeURIComponent(str);
      } else {
        result = encodeURIComponent(str);
      }
      inputModel.value.value = strExt(result);
      isEncodedRef.value = !isEncodedRef.value;
    }
  } catch (e) {}
};
//处理Base64
const handleBase64 = () => {
  if (inputModel.value.value === null) return;
  let result = inputModel.value.value;
  try {
    if (inputModel.value.valueType === "string") {
      const str = strClean(inputModel.value.value);
      if (isBase64Ref.value) {
        //Base64格式解码
        const binary = atob(str);
        const bytes = new Uint8Array(
          binary.split("").map((char) => char.charCodeAt(0))
        );
        const decoder = new TextDecoder();
        result = decoder.decode(bytes);
        isBase64Ref.value = false;
      } else {
        //Base64编码
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        const binary = Array.from(bytes)
          .map((byte) => String.fromCharCode(byte))
          .join("");
        result = btoa(binary);
        isBase64Ref.value = true;
      }
      inputModel.value.value = strExt(result);
    }
  } catch (e) {
    console.error(e);
  }
};
//展开或收起所有节点
const expandCollapsedAllNodes = () => {
  if (expandedKeys.value.length == 0) {
    expandedKeys.value = [...allExpandableKeys.value];
  } else {
    expandedKeys.value = [];
  }
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
  key: string | number
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
const modifyNodeByKey = (key: string | number, newValue: string | null) => {
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
    try {
      inputStartValue.value = FormatConverter.yamlToJson(
        String(inputStartValue.value)
      );
    } catch (error) {
      const { message } = getDiscreteApi();
      message.error("Invalid YAML format!");
      return;
    }
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
    if (options.treeExpandMode && expandedKeys.value.length == 0) {
      expandedKeys.value = allExpandableKeys.value;
    }
    initPannelAfterBuildTree();
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
  syncPannelConfig();
};
//打开设置页面
const openOptionsTab = () => {
  var options_url = browser.runtime.getURL("/options.html");
  browser.tabs.create({ url: options_url, active: true });
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
      showInputPanel: inputModel.value.showInputPanel,
      showCollapsePannel: inputModel.value.showCollapsePannel,
      clickStyle: inputModel.value.clickStyle,
    });
  },
  { deep: true }
);
watch(expandedKeys.value, () => {
  setItem("expandedKeys", expandedKeys.value);
});
watch(selectedKeys.value, () => {
  setItem("selectedKeys", selectedKeys.value);
});
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
  return true;
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
  if (
    event.ctrlKey &&
    event.key === "k" &&
    options.hotKeys.includes("ctrl_k")
  ) {
    event.preventDefault();
    showSearch.value = !showSearch.value;
  } else if (
    event.ctrlKey &&
    event.key === "s" &&
    options.hotKeys.includes("ctrl_s")
  ) {
    event.preventDefault(); // 阻止浏览器默认保存页面行为
    saveAsFile();
  }
};
const saveAsFile = () => {
  const content = strClean(inputModel.value.value) || ""; // 确保内容不为 null

  let ext = ".txt";
  let mimeType = "text/plain;charset=utf-8";
  if (
    inputModel.value.valueType === "array" ||
    inputModel.value.valueType === "object"
  ) {
    ext = ".json";
    mimeType = "application/json;charset=utf-8";
  }
  const filename = "json-tool-output" + ext;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  if (isExtension.value) {
    browser.downloads.download(
      {
        url: url,
        filename: filename, // 建议文件名
        saveAs: true, // 启用“另存为”对话框
      },
      () => {
        if (browser.runtime.lastError) {
          console.error("Download failed:", browser.runtime.lastError);
        }
      }
    );
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
const handlePathUpdateValue = (value: string, option: JsonPathOption) => {
  nodeClick(option.treeOption);
};
//tree构建后初始化面板状态
const initPannelAfterBuildTree = (savedSelectedKeys?: any[]) => {
  const rootNode: CustomTreeOption | null = findNodeByKey(
    treeData.value,
    "JSON-0"
  );
  if (
    options.showPannel.includes("startup") &&
    !options.showPannel.includes("lastStatus")
  ) {
    if (rootNode != null) {
      nodeClick(rootNode);
    }
  } else if (options.showPannel.includes("onlyBtn")) {
    showInputPanel.value = true;
    showCollapsePannel.value = false;
    clickStyle.value = { width: "27px", height: "27px" };
    syncPannelConfig();
  } else if (
    options.showPannel.includes("lastStatus") &&
    inputModel.value.showInputPanel != undefined &&
    inputModel.value.showCollapsePannel != undefined
  ) {
    showInputPanel.value = inputModel.value.showInputPanel;
    showCollapsePannel.value = inputModel.value.showCollapsePannel;
    clickStyle.value = inputModel.value.clickStyle;
    if (showInputPanel.value && savedSelectedKeys?.length > 0) {
      const targetNode = findNodeByKey(treeData.value, savedSelectedKeys[0]);
      if (targetNode != null) {
        nodeClick(targetNode);
      } else {
        nodeClick(rootNode);
      }
    } else {
      nodeClick(rootNode);
    }
  }
};
//同步面板配置
const syncPannelConfig = () => {
  inputModel.value.showInputPanel = showInputPanel.value;
  inputModel.value.clickStyle = clickStyle.value;
  inputModel.value.showCollapsePannel = showCollapsePannel.value;
};
const handleSelect = (key: string | number) => {
  showDropdownRef.value = false;
  var copyText;
  var msgText;
  if (rightClickTreeOption.value) {
    if (key == "copyPath") {
      copyText = rightClickTreeOption.value.path;
      msgText = "Path";
    } else if (key == "copyKey") {
      copyText = rightClickTreeOption.value.k;
      msgText = "Key";
    } else if (key == "copyValue") {
      const current = getValueByPath(
        jsonParsedData.value,
        rightClickTreeOption.value.path
      );
      const type = getType(current);
      if ((type === "array" || type === "object") && current !== null) {
        copyText = JT.stringify(current, null, "    ");
      } else {
        copyText = current;
      }
      msgText = "Value";
    } else if (key == "viewOriginalPage") {
      browser.tabs.getCurrent((tab) => {
        if (tab?.id) {
          browser.runtime.sendMessage({
            action: "viewOriginalPage",
            tabId: tab.id,
          });
        }
      });
    }
  }
  if (copyText != null) {
    try {
      toClipboard(copyText);
      const { message } = getDiscreteApi();
      message.success(`${msgText} Copied success!`);
    } catch (e) {}
  }
};
const handleClickoutside = () => {
  showDropdownRef.value = false;
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
</style>
