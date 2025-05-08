import { getItem, defaultOptions, JT } from "@/utils/common";
import { FormatConverter } from "@/utils/convert";
// 获取当前页面的文本内容
const getPageText = () => {
  return (document.body.innerText || document.body.textContent)?.trim();
};

// 监听来自 background 的消息
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageText") {
    const text = getPageText();
    sendResponse({ text });
  }
});
export default defineContentScript({
  matches: ["*://*/*", "file:///*", "<all_urls>"],
  main() {
    const checkAndFormatJson = (options: any) => {
      const bodyText = getPageText();
      if (bodyText) {
        try {
          let convertText = bodyText;
          if (options.renderTypes.includes("YAML")) {
            convertText = FormatConverter.yamlToJson(bodyText);
          }
          const jsonData = JT.parse(convertText);
          // 清空原始页面内容
          document.body.innerHTML = "";

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
    getItem("options").then((v: any) => {
      let options = structuredClone(defaultOptions);
      if (v) {
        options = v;
      }
      if (options.renderSwitch) {
        if (document.readyState === "complete") {
          checkAndFormatJson(options);
        } else {
          window.addEventListener("load", () => {
            checkAndFormatJson(options);
          });
        }
      }
    });
  },
});
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
