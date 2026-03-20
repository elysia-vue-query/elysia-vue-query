import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@elysia-vue-query/nuxt"],
  devtools: { enabled: true },
  compatibilityDate: "latest",
  elysiaVueQuery: {},
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "elysia-vue-query — Nuxt Playground",
      htmlAttrs: { style: "background:#030712" },
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
        },
      ],
    },
  },
});
