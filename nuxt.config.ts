// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    build: {
      target: ["esnext", "es2022"],
    },
    esbuild: {
      target: "es2022",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Martel",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Baloo+Tamma+2",
        },
      ],
      script: [
        {
          src: "https://unpkg.com/tesseract.js@4.0.2/dist/tesseract.min.js",
        },
      ],
    },
  },
  modules: ["nuxt-icon"],
});
