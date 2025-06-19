<img src='./docs/public/image/logo.svg' width='100'>

# JSON Tool

![Version](https://img.shields.io/github/v/tag/laboratorys/JSON-Tool?sort=semver&label=Version)
![Release](https://github.com/laboratorys/JSON-Tool/actions/workflows/release.yml/badge.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/laboratorys/JSON-Tool)
[![Nightly build](https://github.com/laboratorys/JSON-Tool/actions/workflows/nightly.yml/badge.svg)](https://github.com/laboratorys/JSON-Tool/actions/workflows/nightly.yml)
[![wxt](https://img.shields.io/badge/wxt-ff0?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8zMDVfNDkwKSI+CjxwYXRoIGQ9Ik0zNDguNjA4IDQ5MkMzODQuOTA1IDQ5MiA0MTQuMzI5IDQ2Mi41NzYgNDE0LjMyOSA0MjYuMjc5VjM2MC41NTdINDI2LjI3OUM0NjIuNTc2IDM2MC41NTcgNDkyIDMzMS4xMzIgNDkyIDI5NC44MzVDNDkyIDI1OC41MzggNDYyLjU3NiAyMjkuMTE0IDQyNi4yNzkgMjI5LjExNEg0MTQuMzI5VjE2My4zOTJDNDE0LjMyOSAxMjcuMDk1IDM4NC45MDUgOTcuNjcwOSAzNDguNjA4IDk3LjY3MDlIMjgyLjg4NlY4NS43MjE1QzI4Mi44ODYgNDkuNDI0NSAyNTMuNDYyIDIwIDIxNy4xNjUgMjBDMTgwLjg2OCAyMCAxNTEuNDQzIDQ5LjQyNDUgMTUxLjQ0MyA4NS43MjE1Vjk3LjY3MDlIODUuNzIxNUM0OS40MjQ1IDk3LjY3MDkgMjAgMTI3LjA5NSAyMCAxNjMuMzkyVjIyOS4xMTRIMzEuOTQ5NEM2OC4yNDY0IDIyOS4xMTQgOTcuNjcwOSAyNTguNTM4IDk3LjY3MDkgMjk0LjgzNUM5Ny42NzA5IDMzMS4xMzIgNjguMjQ2NCAzNjAuNTU3IDMxLjk0OTQgMzYwLjU1N0gyMFY0OTJIMTUxLjQ0M1Y0ODAuMDUxQzE1MS40NDMgNDQzLjc1NCAxODAuODY4IDQxNC4zMjkgMjE3LjE2NSA0MTQuMzI5QzI1My40NjIgNDE0LjMyOSAyODIuODg2IDQ0My43NTQgMjgyLjg4NiA0ODAuMDUxVjQ5MkgzNDguNjA4WiIgc3Ryb2tlPSIjNjdENTVFIiBzdHJva2Utd2lkdGg9IjQwIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMzA1XzQ5MCI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=&labelColor=grey&color=%2367D55E)](https://wxt.dev)

---

English | [中文](https://github.com/laboratorys/JSON-Tool/blob/main/README_ZH.md)

JSON-Tool is a powerful, all-in-one Browser extension designed to streamline JSON workflows and enhance developer productivity. Packed with smart features and essential utilities, it’s the perfect companion for developers, testers, and anyone working with structured data.

[link-jh]: https://jsonhandle.sinaapp.com/ "JSON-Handle"

> [!TIP]
> Originally created as a V3-compatible alternative to [JSON-Handle][link-jh] (which lacked V3 support), this project now coexists with [JSON-Handle][link-jh]'s updated version. Its core functionality is derived from JSON-Handle. Special thanks to [JSON-Handle][link-jh] for inspiring this work.

## Links

- [Docs](https://json-docs.noki.icu)
- [Online Tool](https://json.noki.icu)

## Features

- **Input Methods:** URL, Context Menu, Manual Input, File Upload.
- **Display:** Tree Structure (Expand/Collapse), Syntax Highlighting, Theme Switching.
- **Operations:** Search (Ctrl+K), Copy Key/Value/Path, Data Conversion (Compression, Decoding, Timestamp, Format Conversion).
- **Performance:** Virtual Scrolling for Large JSON.
- **Additional Features:** Multi-language Support, Works on Chrome, Edge, and Firefox.
- **Dev-Tool:** Ported several common dev tools from [IT-Tools](https://github.com/CorentinTh/it-tools).

## Installation

> [!TIP]
> Since it takes time for the extension store to review and publish, usually 1-5 days, you can download the latest extension in [Nightly.link](https://nightly.link/laboratorys/JSON-Tool/workflows/nightly/main)

### By store

[link-chrome]: https://chromewebstore.google.com/detail/json-tool/cfjljbmnabbphlgpgmbpmjccjanmheho "Version published on Chrome Web Store"
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/jsontool/fgppigoofkdaealhhghmjdnkmcpcndid "Version published on Edge Web Store"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/json-tool/ "Version published on Mozilla Add-ons"

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" style="vertical-align: middle">][link-chrome] [<img src="https://img.shields.io/chrome-web-store/v/cfjljbmnabbphlgpgmbpmjccjanmheho.svg?label=%20" style="vertical-align: middle">][link-chrome]　
[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/edge/edge.svg" width="48" alt="Edge" style="vertical-align: middle">][link-edge] [<img src="https://img.shields.io/badge/dynamic/json?label=&query=%24.version&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/fgppigoofkdaealhhghmjdnkmcpcndid" style="vertical-align: middle">][link-edge]　
[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" width="48" alt="Firefox" style="vertical-align: middle">][link-firefox] [<img src="https://img.shields.io/amo/v/json-tool.svg?label=%20" style="vertical-align: middle">][link-firefox]

### By file

#### Google Chrome/Microsoft Edge

1. Download the `json-tool-<version>-{chrome/edge}.zip` file from the [latest release](https://github.com/laboratorys/JSON-Tool/releases).
2. Extract the contents of the `.zip` file.
3. Open Google Chrome and navigate to `{chrome/edge}://extensions/`.
4. Enable "Developer mode".
5. Click on "Load unpacked" and select the `dist` folder.
6. JSON Tool should now appear in your list of Chrome extensions and is ready to use.

#### Firefox

1. Download the `json-tool-<version>-firefox.zip` file from the [latest release](https://github.com/laboratorys/JSON-Tool/releases).
2. Open Firefox and navigate to `about:addons`.
3. Click on the gear icon and select "Install Add-on From File...".
4. Select the `.zip` file.
5. JSON Tool should now appear in your list of Firefox extensions and is ready to use.

## Usage

1. Click the extension icon to open JSON-Tool in a tab or window. You can then manually enter JSON text or upload a JSON file. After clicking the JSON-Tool button, you will receive a formatted JSON data structure.
2. When a browser opens a URL that returns JSON data, it automatically renders the JSON into a structured tree format.
3. Open the options to configure the plugin, including theme, internationalization, color scheme, etc.

## Support

If you encounter any issues or have suggestions for improvements, please feel free to [open an issue in this repository](https://github.com/laboratorys/JSON-Tool/issues/new).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
