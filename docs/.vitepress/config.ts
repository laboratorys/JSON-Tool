import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "JSON-Tool",
  lang: "en-US",
  description: "A JSON-Tool Official documentation.",
  head: [
    ["link", { rel: "icon", href: "/image/logo.svg" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/image/logo.svg",
    nav: [],

    sidebar: [],

    socialLinks: [
      { icon: "github", link: "https://github.com/laboratorys/JSON-Tool" },
    ],
  },
});
