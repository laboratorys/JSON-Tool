import DefaultTheme from "vitepress/theme";
import { h } from "vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 覆盖 VPButton 组件
    app.component("VPButton", {
      name: "CustomVPButton",
      props: {
        text: String,
        theme: String,
        href: String,
      },
      render() {
        return h(
          "a",
          {
            class: ["VPButton", this.theme],
            href: this.href,
          },
          [h("span", { innerHTML: this.text })]
        );
      },
    });
  },
};
