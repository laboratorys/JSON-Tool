import * as yaml from "js-yaml";
export class FormatConverter {
  // --------------------- JSON 转换 ---------------------
  static jsonToYaml(jsonStr: string): string {
    try {
      const obj = JSON.parse(jsonStr);
      return yaml.dump(obj, { indent: 4 });
    } catch (e) {
      throw new Error("Invalid JSON input");
    }
  }

  static yamlToJson(yamlStr: string): string {
    try {
      const obj = yaml.load(yamlStr);
      const objType = Array.isArray(obj) ? "array" : typeof obj;
      if (objType === "array" || objType === "object") {
        return JSON.stringify(obj, null, "    ");
      }
      throw new Error("Invalid YAML input");
    } catch (e) {
      throw new Error("Invalid YAML input");
    }
  }
}
