## CHANGELOG

### ✨[v0.0.6] - 2025-06-19

#### 🚀Features

- Ported several common dev tools from [IT-Tools](https://github.com/CorentinTh/it-tools): **Token Generator**, **UUID Generator**, **Hash Text**, **Code Formatter**, **Date-Time Converter** (accessible via extension menu or shortcuts).
- Added global shortcuts: **Alt+Shift+J (Open JSON Tool)**, **Alt+Shift+D (Open Dev Tool)** .
- Expand or collapse the selected node when double-clicking.
- Add Expand icon style.

#### ⚡Improvements

- Optimized search functionality.
- Added quick-access menus at the bottom.
- Added node collapse function.

### ✨[v0.0.5] - 2025-05-22

#### 🐛Bug Fixes

- cannot turn off automatic rendering.
- json tree rendering is incomplete.

#### 🚀Features

- [JSON] support image preview.
- [JSON] added right-click menu for nodes, supports copying key/value/path and viewing original data.
- [Options] add version number and change log.

#### ⚡Improvements

- search no longer filters nodes.
- i18n

#### 🐳 Chore

- update pnpm 10.11.0
- update wxt 0.20.6
- update vite 6.3.5

### [v0.0.4] - 2025-05-22

#### 🐛Bug Fixes

- selected text does not work.

#### ⚡Improvements

- node selection is highlighted
- optimize color scheme

### [v0.0.3] - 2025-04-25

#### 🐛Bug Fixes

- handling special characters in paths:`./[]`

#### ⚡Improvements

- value copy action: Separate copy button instead of double click behavior
- values ​​are copied without the quote prefix

#### 🐳 Chore

- update pnpm 10.9.0
- update wxt 0.20.4

### [v0.0.2] - 2025-04-01

#### 🐛Bug Fixes

- Fixed base64 handling for strings with non-Latin1 characters
- [Firefox] Resolved issue where the input panel options button failed to open

#### 🚀Features

- Remember last input data
- Added `CTRL+S` shortcut for "Save As"
- Open settings page automatically after installation
- Filterable dropdown for JSON paths
- Configuration panel for JSON operations
- Configuration panel for Hot keys
- Drag-and-drop file support for text input

#### ⚡Improvements

- Merged "Expand/Collapse All Nodes" buttons
- Optimized enUri/deUri operations
- Improved copy operation interactions
- Code optimizations
- Dependency upgrades (wxt 0.20.0)

**Special thanks to Mr. Chen for his suggestions**

### [v0.0.1] - 2025-03-27

🎉 **First version**
