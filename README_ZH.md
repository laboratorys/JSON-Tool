<img src='./docs/public/image/logo.svg' width='100'>

# JSON Tool

![Version](https://img.shields.io/github/v/tag/laboratorys/JSON-Tool?sort=semver&label=Version)
![Release](https://github.com/laboratorys/JSON-Tool/actions/workflows/release.yml/badge.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/laboratorys/JSON-Tool)
[![Nightly build](https://github.com/laboratorys/JSON-Tool/actions/workflows/nightly.yml/badge.svg)](https://github.com/laboratorys/JSON-Tool/actions/workflows/nightly.yml)
[![wxt](https://img.shields.io/badge/wxt-ff0?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8zMDVfNDkwKSI+CjxwYXRoIGQ9Ik0zNDguNjA4IDQ5MkMzODQuOTA1IDQ5MiA0MTQuMzI5IDQ2Mi41NzYgNDE0LjMyOSA0MjYuMjc5VjM2MC41NTdINDI2LjI3OUM0NjIuNTc2IDM2MC41NTcgNDkyIDMzMS4xMzIgNDkyIDI5NC44MzVDNDkyIDI1OC41MzggNDYyLjU3NiAyMjkuMTE0IDQyNi4yNzkgMjI5LjExNEg0MTQuMzI5VjE2My4zOTJDNDE0LjMyOSAxMjcuMDk1IDM4NC45MDUgOTcuNjcwOSAzNDguNjA4IDk3LjY3MDlIMjgyLjg4NlY4NS43MjE1QzI4Mi44ODYgNDkuNDI0NSAyNTMuNDYyIDIwIDIxNy4xNjUgMjBDMTgwLjg2OCAyMCAxNTEuNDQzIDQ5LjQyNDUgMTUxLjQ0MyA4NS43MjE1Vjk3LjY3MDlIODUuNzIxNUM0OS40MjQ1IDk3LjY3MDkgMjAgMTI3LjA5NSAyMCAxNjMuMzkyVjIyOS4xMTRIMzEuOTQ5NEM2OC4yNDY0IDIyOS4xMTQgOTcuNjcwOSAyNTguNTM4IDk3LjY3MDkgMjk0LjgzNUM5Ny42NzA5IDMzMS4xMzIgNjguMjQ2NCAzNjAuNTU3IDMxLjk0OTQgMzYwLjU1N0gyMFY0OTJIMTUxLjQ0M1Y0ODAuMDUxQzE1MS40NDMgNDQzLjc1NCAxODAuODY4IDQxNC4zMjkgMjE3LjE2NSA0MTQuMzI5QzI1My40NjIgNDE0LjMyOSAyODIuODg2IDQ0My43NTQgMjgyLjg4NiA0ODAuMDUxVjQ5MkgzNDguNjA4WiIgc3Ryb2tlPSIjNjdENTVFIiBzdHJva2Utd2lkdGg9IjQwIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMzA1XzQ5MCI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=&labelColor=grey&color=%2367D55E)](https://wxt.dev)

---

[English](https://github.com/laboratorys/JSON-Tool/blob/main/README.md) | 中文

JSON-Tool 是一款功能强大的多合一浏览器扩展，旨在简化 JSON 工作流程并提升开发者的生产力。它集成了智能功能和必备工具，是开发者、测试人员以及任何处理结构化数据的人的理想伴侣。

[link-jh]: https://jsonhandle.sinaapp.com/ "JSON-Handle"

> [!TIP]
> 本项目最初是为替代不支持 V3 的 [JSON-Handle][link-jh] 而创建的 V3 版本。其核心功能源自 [JSON-Handle][link-jh]。特别感谢 [JSON-Handle][link-jh] 对本项目的启发。

## 链接

- [文档](https://json-docs.noki.icu)
- [在线工具](https://json.noki.icu)

## 功能

- **输入方式：** URL、上下文菜单、手动输入、文件上传。
- **显示：** 树形结构（展开/折叠）、语法高亮、主题切换。
- **操作：** 搜索（Ctrl+K）、复制键/值/路径、数据转换（压缩、解码、时间戳、格式转换）。
- **性能：** 大型 JSON 的虚拟滚动。
- **附加功能：** 多语言支持，兼容 Chrome、Edge 和 Firefox。

## 安装

> [!TIP]
> 由于扩展商店的审核和发布需要时间，通常为 1-5 天，您可以在 [Nightly.link](https://nightly.link/laboratorys/JSON-Tool/workflows/nightly/main) 下载最新的扩展。

### 通过商店安装

[link-chrome]: https://chromewebstore.google.com/detail/json-tool/cfjljbmnabbphlgpgmbpmjccjanmheho "Version published on Chrome Web Store"
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/jsontool/fgppigoofkdaealhhghmjdnkmcpcndid "Version published on Edge Web Store"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/json-tool/ "Version published on Mozilla Add-ons"

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" style="vertical-align: middle">][link-chrome] [<img src="https://img.shields.io/chrome-web-store/v/cfjljbmnabbphlgpgmbpmjccjanmheho.svg?label=%20" style="vertical-align: middle">][link-chrome]　
[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/edge/edge.svg" width="48" alt="Edge" style="vertical-align: middle">][link-edge] [<img src="https://img.shields.io/badge/dynamic/json?label=&query=%24.version&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/fgppigoofkdaealhhghmjdnkmcpcndid" style="vertical-align: middle">][link-edge]　
[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" width="48" alt="Firefox" style="vertical-align: middle">][link-firefox] [<img src="https://img.shields.io/amo/v/json-tool.svg?label=%20" style="vertical-align: middle">][link-firefox]

### 通过文件安装

#### Google Chrome/Microsoft Edge

1. 从 [最新发布](https://github.com/laboratorys/JSON-Tool/releases) 下载 `json-tool-<version>-{chrome/edge}.zip` 文件。
2. 解压 `.zip` 文件内容。
3. 打开 Google Chrome，导航到 `{chrome/edge}://extensions/`。
4. 启用“开发者模式”。
5. 点击“加载未打包的扩展”，选择 `dist` 文件夹。
6. JSON Tool 现在应该出现在你的 Chrome 扩展列表中，可以开始使用。

#### Firefox

1. 从 [最新发布](https://github.com/laboratorys/JSON-Tool/releases) 下载 `json-tool-<version>-firefox.zip` 文件。
2. 打开 Firefox，导航到 `about:addons`。
3. 点击齿轮图标，选择“从文件安装附加组件...”。
4. 选择 `.zip` 文件。
5. JSON Tool 现在应该出现在你的 Firefox 扩展列表中，可以开始使用。

## 使用方法

1. 点击扩展图标，在标签页或窗口中打开 JSON-Tool。你可以手动输入 JSON 文本或上传 JSON 文件。点击 JSON-Tool 按钮后，你将获得格式化的 JSON 数据结构。
2. 当浏览器打开返回 JSON 数据的 URL 时，它会自动将 JSON 渲染为结构化的树形格式。
3. 打开选项配置插件，包括主题、国际化、配色方案等。

## 支持

如果您遇到任何问题或有改进建议，请随时在 [此仓库中提交问题](https://github.com/laboratorys/JSON-Tool/issues/new).

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。
