// background.ts
import { getItem, defaultOptions, JT } from "@/utils/common";
// 定义消息类型
interface SendDataMessage {
  action: "sendData";
  data: any;
  from: "input";
}

interface ReadyMessage {
  action: "ready";
  tabId: number;
}

// 存储待发送消息的 Map，带时间戳
interface PendingEntry {
  message: SendDataMessage;
  timestamp: number;
}

const pendingMessages = new Map<number, PendingEntry>();
const TIMEOUT_MS = 10000; // 10秒超时，可调整

const actionAPI =
  typeof browser !== "undefined"
    ? browser.action || browser.browserAction // Firefox 兼容 V2/V3
    : chrome.action;

// 发送消息函数
const sendMessageToTab = (
  tabId: number,
  message: SendDataMessage
): Promise<void> => {
  return browser.tabs.sendMessage(tabId, message).catch(() => {});
};
const openJSONPage = (data: any): Promise<void> => {
  const jsonH_url = browser.runtime.getURL("/json.html");
  const message: SendDataMessage = { action: "sendData", data, from: "input" };
  const entry: PendingEntry = { message, timestamp: Date.now() };

  return getItem("options").then((v: any) => {
    let options = defaultOptions;
    if (v) {
      options = v;
    }
    if (options.openJTMode === "window") {
      return browser.windows
        .create({
          url: jsonH_url,
          type: "popup",
          width: 1024,
          height: 768,
        })
        .then((window) => {
          const tabId = window.tabs![0].id!;
          pendingMessages.set(tabId, entry);
        });
    } else {
      return browser.tabs
        .create({ url: jsonH_url, active: true })
        .then((newTab) => {
          pendingMessages.set(newTab.id!, entry);
        });
    }
  });
};

// 清理过期条目
const cleanExpiredMessages = () => {
  const now = Date.now();
  for (const [tabId, entry] of pendingMessages) {
    if (now - entry.timestamp > TIMEOUT_MS) {
      pendingMessages.delete(tabId);
    }
  }
};

// 监听就绪信号并发送数据
browser.runtime.onMessage.addListener((message: ReadyMessage, sender) => {
  if (message.action === "ready" && sender.tab?.id) {
    const tabId = sender.tab.id;
    const message: SendDataMessage = {
      action: "sendData",
      data: null,
      from: "input",
    };
    sendMessageToTab(tabId, message);
    const pendingEntry = pendingMessages.get(tabId);
    if (pendingEntry) {
      sendMessageToTab(tabId, pendingEntry.message);
      pendingMessages.delete(tabId); // 成功发送后立即清理
    }
  }
  cleanExpiredMessages(); // 每次处理消息时清理过期条目
});

// 监听标签页关闭，清理相关条目
browser.tabs.onRemoved.addListener((tabId) => {
  pendingMessages.delete(tabId);
});

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    getItem("options").then((v: any) => {
      let options = defaultOptions;
      if (v) {
        options = v;
      }
      if (options.contextMenus) {
        browser.contextMenus.create({
          id: "jt-s",
          title: "JSON Tool (selection)",
          contexts: ["selection"],
        });
        browser.contextMenus.create({
          id: "jt-p",
          title: "JSON Tool (page)",
          contexts: ["page"],
        });
      }
    });
    var options_url = browser.runtime.getURL("/options.html");
    browser.tabs.create({ url: options_url, active: true });
  });

  browser.contextMenus.onClicked.addListener((item) => {
    if (item.menuItemId === "jt-s") {
      openJSONPage(item.selectionText).catch(() => {});
    } else if (item.menuItemId === "jt-p") {
      getCurrentPageText()
        .then((text) => {
          openJSONPage(text).catch(() => {});
        })
        .catch((error) => {
          console.error("Failed to get page text:", error);
        });
    }
  });
  actionAPI.onClicked.addListener(() => {
    openJSONPage(null).catch(() => {});
  });
});
const getCurrentPageText = () => {
  return new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        reject("No active tab found");
        return;
      }
      const tabId = Number(tabs[0].id);
      browser.tabs.sendMessage(tabId, { action: "getPageText" }, (response) => {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          resolve(response.text);
        }
      });
    });
  });
};
