import { JT } from "@/utils/common";
import { FormatConverter } from "@/utils/convert";
let content: string;
const getPageText = () => {
  return (document.body.innerText || document.body.textContent)?.trim();
};
// 监听来自 background 的消息
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageText") {
    const text = getPageText();
    sendResponse({ text });
  } else if (request.action === "viewOriginalPage") {
    if (
      window.document.getElementsByTagName("pre") &&
      window.document.getElementsByTagName("pre")[0]
    ) {
      window.document.getElementsByTagName("iframe")[0].style.display = "none";
      window.document.getElementsByTagName("pre")[0].style.display = "block";
    } else {
      document.body.innerHTML = content;
    }
  } else if (request.action === "syncOptions") {
    if (request.data.renderSwitch) {
      if (document.readyState === "complete") {
        checkAndFormatJson(request.data);
      } else {
        window.addEventListener("load", () => {
          checkAndFormatJson(request.data);
        });
      }
    }
  }
});
export default defineContentScript({
  matches: ["*://*/*", "file:///*", "<all_urls>"],
  main() {
    browser.runtime.sendMessage({ action: "getOptions" });
  },
});
const checkAndFormatJson = (options: any) => {
  const bodyText = getPageText();
  if (bodyText) {
    try {
      let convertText = bodyText;
      if (options.renderTypes.includes("YAML")) {
        convertText = FormatConverter.yamlToJson(bodyText);
      }
      const jsonData = JT.parse(convertText);
      if (
        window.document.getElementsByTagName("pre") &&
        window.document.getElementsByTagName("pre")[0]
      ) {
        window.document.getElementsByTagName("pre")[0].style.display = "none";
      } else {
        content = document.body.innerHTML;
        document.body.innerHTML = "";
      }
      // 创建 iframe
      const iframe = document.createElement("iframe");
      iframe.src = browser.runtime.getURL(`/json.html`);
      iframe.style.cssText = `
      width: 100%;
      height: 100vh;
      border: none;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
    `;
      document.body.appendChild(iframe);

      let isIframeReady = false;
      window.addEventListener("message", (event) => {
        if (event.data.action === "ready") {
          isIframeReady = true;
          iframe.contentWindow?.postMessage(
            {
              action: "fromUrl",
            },
            "*"
          );
          if (convertText) {
            sendData(iframe, convertText);
          }
        }
      });
      setTimeout(() => {
        if (!isIframeReady) {
          if (convertText) {
            sendData(iframe, convertText);
          }
        }
      }, 3000);
    } catch (e) {
      //console.error("Page content is not JSON:", e);
    }
  }
};
const sendData = (iframe: any, data: string) => {
  // 分片传递
  const chunkSize = 1024 * 1024; // 1 MB 每片
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  chunks.forEach((chunk, index) => {
    iframe.contentWindow?.postMessage(
      {
        action: "displayJsonChunk",
        chunk,
        index,
        total: chunks.length,
      },
      "*"
    );
  });
};
