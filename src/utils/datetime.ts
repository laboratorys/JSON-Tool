/**
 * 检测输入值是否为日期/时间类型（字符串或数值）
 * @param input 输入值（字符串或数值）
 * @returns 是否为日期/时间类型
 */
const isDateOrTime = (input: string): boolean => {
  if (isNaN(Number(input))) {
    return isDateString(input);
  } else if (!isNaN(Number(input))) {
    return isTimestamp(Number(input));
  }
  return false;
};

/**
 * 检查字符串是否为有效日期格式
 * @param str 输入字符串
 * @returns 是否为有效日期
 */
function isDateString(str: string): boolean {
  const dateRegexes = [
    // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}$/,
    // YYYY/MM/DD
    /^\d{4}\/\d{2}\/\d{2}$/,
    // YYYYMMDD
    /^\d{8}$/,
    // YYYY-MM-DD HH:mm:ss
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    // YYYY/MM/DD HH:mm:ss
    /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/,
    // YYYY-MM-DD HH:mm:ss.SSS
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/,
    // YYYY/MM/DD HH:mm:ss.SSS
    /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/,
    // ISO 8601（带时区）
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/i,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?[+-]\d{2}:\d{2}$/i,
    // DD-MM-YYYY HH:mm:ss
    /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/,
    // MM/DD/YYYY HH:mm:ss
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/,
    // YYYY-MM-DD HH:mm
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
    // YYYY/MM/DD HH:mm
    /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/,
    // 12小时制时间格式
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [AP]M$/i,
    /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2} [AP]M$/i,
  ];

  // 检查是否符合日期格式
  if (!dateRegexes.some((regex) => regex.test(str))) {
    return false;
  }

  // 对日期进行有效性验证
  return isValidDate(str);
}

/**
 * 检查日期字符串是否为有效日期
 * @param dateStr 日期字符串
 * @returns 是否为有效日期
 */
const isValidDate = (dateStr: string): boolean => {
  let date: Date;

  // 处理 YYYYMMDD 格式
  if (/^\d{8}$/.test(dateStr)) {
    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10) - 1; // 月份从 0 开始
    const day = parseInt(dateStr.slice(6, 8), 10);
    date = new Date(year, month, day);
  } else {
    // 处理其他格式
    date = new Date(dateStr);
  }

  // 检查日期是否有效
  return (
    !isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateStr.slice(0, 10)
  );
};

/**
 * 检查数值是否为有效时间戳（支持秒级和毫秒级）
 * @param num 输入数值
 * @returns 是否为有效时间戳
 */
const isTimestamp = (num: number): boolean => {
  if (num < 0) return false;

  let ms = num;
  // 判断是否为秒级时间戳（10位数字）
  if (num >= 1e9 && num <= 9999999999) {
    ms = num * 1000;
  }
  // 判断是否为毫秒级时间戳（13位数字）
  else if (num >= 1e12 && num <= 9999999999999) {
    ms = num;
  } else {
    return false;
  }

  const date = new Date(ms);
  return !isNaN(date.getTime());
};
// Unix 时间戳
const formatToUnixTimestamp = (input: string | number): string => {
  const date = new Date(input);
  return Math.floor(date.getTime() / 1000).toString();
};
// 毫秒时间戳
const formatTimestamp = (input: string | number): string => {
  const date = new Date(input);
  return Math.floor(date.getTime()).toString();
};
// ISO 8601
const formatToISO8601 = (input: string | number): string => {
  const date = new Date(input);
  return date.toISOString();
};
// YYYY-MM-DD HH:mm:ss
const formatToDateTime = (input: string | number): string => {
  const date = new Date(input);
  return date
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");
};

//  YYYY-MM-DD
const formatToDate = (input: string | number): string => {
  const date = new Date(input);
  return date.toISOString().slice(0, 10);
};

const timestampToISO8601 = (timestamp: number | string): string => {
  const num = typeof timestamp === "string" ? Number(timestamp) : timestamp;

  if (num >= 1e12 && num <= 9999999999999) {
    return new Date(num).toISOString();
  } else if (num >= 1e9 && num <= 9999999999) {
    return new Date(num * 1000).toISOString();
  } else {
    throw new Error("无效的时间戳");
  }
};
const formats = [
  { name: "timestamp", formatter: formatTimestamp },
  { name: "Unix 时间戳", formatter: formatToUnixTimestamp },
  { name: "ISO-8601", formatter: formatToISO8601 },
  { name: "YYYY-MM-DD HH:mm:ss", formatter: formatToDateTime },
  { name: "YYYY-MM-DD", formatter: formatToDate },
];
export { isDateOrTime, isTimestamp, isDateString, timestampToISO8601, formats };
