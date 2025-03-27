import { JT } from "@/utils/common";
interface JsonParseResult {
  isValid: boolean;
  errorDetails?: {
    line: number;
    column: number;
    message: string;
    context: string;
  };
}
//解析JSON并返回错误信息
const parseJsonWithErrorDetails = (jsonString: string): JsonParseResult => {
  try {
    JT.parse(jsonString);
    return {
      isValid: true,
    };
  } catch (error) {
    const errorMessage = (error as SyntaxError).message;
    const lines = jsonString.split("\n");

    const positionMatch = errorMessage.match(/position (\d+)/);
    const errorPosition = positionMatch ? parseInt(positionMatch[1], 10) : -1;

    let currentPosition = 0;
    let errorLine = -1;
    let errorColumn = -1;

    // 计算初始错误位置
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length;
      if (currentPosition + lineLength >= errorPosition) {
        errorLine = i + 1;
        errorColumn = errorPosition - currentPosition + 1;
        break;
      }
      currentPosition += lineLength + 1; // 加换行符
    }

    // 如果未找到，设置为最后一行
    if (errorLine === -1) {
      errorLine = lines.length;
      errorColumn = lines[lines.length - 1].length + 1;
    }

    // 调整缺少逗号的情况
    if (errorMessage.includes("Expected ','") && errorLine > 1) {
      const prevLine = lines[errorLine - 2].trim(); // 前一行（-2 因为 errorLine 从 1 开始）
      if (
        prevLine.endsWith("null") ||
        prevLine.match(/\d+$/) || // 数字结尾
        prevLine.endsWith("true") ||
        prevLine.endsWith("false") ||
        prevLine.endsWith("]") ||
        prevLine.endsWith("}")
      ) {
        errorLine -= 1; // 回退到缺少逗号的行
        errorColumn = lines[errorLine - 1].length + 1; // 指向行末
      }
    }

    // 获取错误上下文（前后 20 个字符）
    const startContext = Math.max(0, errorPosition - 20);
    const endContext = Math.min(jsonString.length, errorPosition + 20);
    const context = jsonString.substring(startContext, endContext);

    return {
      isValid: false,
      errorDetails: {
        line: errorLine,
        column: errorColumn,
        message: errorMessage,
        context: context,
      },
    };
  }
};

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface SortConfig {
  sortArrays?: boolean;
  compare?: (a: any, b: any) => number;
}

/**
 * 高性能 JSON 递归排序（尾递归优化 + 通用比较器）
 * @param input - 输入数据
 * @param config - 配置项
 * @returns 排序后的 JSON 数据
 */
function optimizedJsonSort<T extends JsonValue>(
  input: T,
  config: SortConfig = {}
): T {
  const { sortArrays = true, compare = universalComparator } = config;

  const stack: Array<{
    data: JsonValue;
    parent: JsonObject | JsonArray | null;
    key: string | number | null;
  }> = [];
  const resultStack: JsonValue[] = [];
  const processed = new WeakMap<object, JsonValue>();

  // 初始化处理根节点
  stack.push({ data: input, parent: null, key: null });

  while (stack.length) {
    const { data, parent, key } = stack.pop()!;

    // 基础类型直接写入结果
    if (typeof data !== "object" || data === null) {
      assignResult(parent, key, data);
      continue;
    }

    // 检查循环引用
    if (processed.has(data)) {
      assignResult(parent, key, processed.get(data)!);
      continue;
    }

    // 处理数组
    if (Array.isArray(data)) {
      const sortedArray = sortArrays ? [...data].sort(compare) : data.slice();

      const ref: JsonArray = [];
      processed.set(data, ref);
      assignResult(parent, key, ref);

      // 反向压栈保持处理顺序
      for (let i = sortedArray.length - 1; i >= 0; i--) {
        stack.push({
          data: sortedArray[i],
          parent: ref,
          key: i,
        });
      }
      continue;
    }

    // 处理对象
    const sortedKeys = Object.keys(data).sort(compare);
    const ref: JsonObject = {};
    processed.set(data, ref);
    assignResult(parent, key, ref);

    // 反向遍历保持键顺序
    for (let i = sortedKeys.length - 1; i >= 0; i--) {
      const k = sortedKeys[i];
      stack.push({
        data: data[k],
        parent: ref,
        key: k,
      });
    }
  }

  return (resultStack[0] || input) as T;

  // 工具函数：安全赋值结果
  function assignResult(
    parent: JsonObject | JsonArray | null,
    key: string | number | null,
    value: JsonValue
  ) {
    if (parent === null) {
      resultStack.push(value);
    } else if (Array.isArray(parent)) {
      parent[key as number] = value;
    } else {
      (parent as JsonObject)[key as string] = value;
    }
  }
}

/**
 * 通用比较器（支持多类型排序）
 */
function universalComparator(a: any, b: any): number {
  const typeA = getTypeWeight(a);
  const typeB = getTypeWeight(b);

  // 按类型优先级排序
  if (typeA !== typeB) {
    return typeA - typeB;
  }

  // 同类型详细比较
  switch (typeof a) {
    case "number":
      return a - b;
    case "string":
      return a.localeCompare(b);
    case "boolean":
      return a === b ? 0 : a ? -1 : 1;
    default:
      return String(a).localeCompare(String(b));
  }
}

// 获取类型权重（自定义排序优先级）
const getTypeWeight = (val: any): number => {
  if (val === null) return 0;
  const type = typeof val;
  switch (type) {
    case "number":
      return 1;
    case "string":
      return 2;
    case "boolean":
      return 3;
    case "object":
      return Array.isArray(val) ? 4 : 5;
    default:
      return 6;
  }
};

//根据路径获取值
const getValueByPath = (json: any, path: string) => {
  const pathParts = path.startsWith("JSON") ? path.replace("JSON", "") : path; //处理根节点
  const parts = pathParts.split(/[\[\].]/).filter((part) => part !== ""); //路径解析

  let current = json;
  //循环路径
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof part === "string" && /^\d+$/.test(part)) {
      const index = parseInt(part, 10);
      if (Array.isArray(current) && index >= 0 && index < current.length) {
        current = current[index];
      } else {
        return undefined;
      }
    } else {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
  }
  if (
    Array.isArray(current) ||
    (typeof current === "object" && current !== null)
  ) {
    return JT.stringify(current, null, "    ");
  }
  return strExt(current);
};
const strExt = (v: any) => {
  if (v === null) {
    return "null";
  }
  if (typeof v === "string") {
    return '"' + v + '"';
  }
  return String(v);
};
//根据路径设置值
const setValueByPath = (json: any, path: string, value: any) => {
  if (path === "JSON" || path === "") {
    return value;
  }
  const pathParts = path.startsWith("JSON") ? path.replace("JSON", "") : path;

  const parts = pathParts
    .split(/[\[\].]/) //
    .filter((part) => part !== "");

  let current = json;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (current === null || current === undefined) {
      if (/^\d+$/.test(parts[i + 1])) {
        current = [];
      } else {
        current = {};
      }
      if (i === 0) {
        Object.assign(json, current);
      } else {
        const prevPart = parts[i - 1];
        if (/^\d+$/.test(prevPart)) {
          json[parseInt(prevPart, 10)] = current;
        } else {
          json[prevPart] = current;
        }
      }
    }

    if (typeof part === "string" && /^\d+$/.test(part)) {
      const index = parseInt(part, 10);
      if (!Array.isArray(current)) {
        current[index] = {};
      }
      current = current[index];
    } else {
      if (!(part in current)) {
        current[part] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      }
      current = current[part];
    }
  }
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    const index = parseInt(lastPart, 10);
    if (!Array.isArray(current)) {
      current = [];
    }
    current[index] = value;
  } else {
    if (current === null || current === undefined) {
      current = {};
    }
    current[lastPart] = value;
  }
  return json;
};

export {
  parseJsonWithErrorDetails,
  optimizedJsonSort,
  getValueByPath,
  setValueByPath,
  strExt,
};
