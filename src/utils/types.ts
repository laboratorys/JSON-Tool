import { TreeOption as NaiveTreeOption } from "naive-ui";
interface CustomTreeOption extends NaiveTreeOption {
  key: string;
  k: string | null; // 键名
  v: any; // 值
  type: string; // 数据类型
  path: string; // 路径
  isLeaf: boolean; // 是否为叶子节点
  children?: CustomTreeOption[]; // 子节点（可选）
}
interface JsonParseResult {
  isValid: boolean;
  errorDetails?: {
    line: number;
    column: number;
    message: string;
    context: string;
  };
}
interface InputModel {
  path: string | null;
  value: string | null;
  key: string | null;
  oldValue: string | null;
  showValue: boolean;
  showLength: boolean;
  showIcon: boolean;
  folderStyle: boolean;
  nodeKey?: string;
  rememberData?: boolean;
}
export { CustomTreeOption, JsonParseResult, InputModel };
