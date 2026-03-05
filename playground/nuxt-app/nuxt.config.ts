export default defineNuxtConfig({
  modules: ['@elysia-vue-query/nuxt'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  elysiaVueQuery: {},

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'elysia-vue-query — Nuxt Playground',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
