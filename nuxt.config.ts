// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    'nuxt-toc',
    '@nuxtjs/i18n'
  ],
  tailwindcss: {
    // Options
  },
   vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'animated-icons'
    }
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme :{
          default: 'one-dark-pro',
          // OR
          },
        },
        toc: {
          depth: 2,
          searchDepth: 3, // include h3 headings
        }
      }
    }
  },
  //ctranslation
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
        langDir: './locales/', // This matches your directory structure

    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      {code: 'mm', name: 'Burmese', file: 'mm.json'},
      { code: 'kn', name: 'Karen', file: 'kn.json' }
    ]
  },
   pages: true,
 
  
  // Add your plugins
  plugins: [
    '~/plugins/router.js'
  ],
  
})