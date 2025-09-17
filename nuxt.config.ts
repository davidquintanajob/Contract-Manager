// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  plugins: [
    { src: '~/plugins/leaflet.js', ssr: false }, // Solo en el cliente
  ],
  // SEO and runtime configuration
  runtimeConfig: {
    public: {
      backendHost: process.env.NUXT_PUBLIC_BACKEND_HOST,
      // Base site URL used for canonical links and JSON-LD. Set NUXT_PUBLIC_SITE_URL in env.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },
  app: {
    head: {
      title: 'Contract Manager',
      titleTemplate: '%s | Contract Manager',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platforma para la gestión eficiente de contratos, entidades y trabajadores.' },
        { name: 'theme-color', content: '#0ea5e9' },
        { name: 'keywords', content: 'contratos, gestión, trabajadores, entidades, ofertas' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_ES' },
        { property: 'og:site_name', content: 'Contract Manager' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.jpeg' },
        { rel: 'canonical', href: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000' }
      ],
      script: [
        // Basic Organization JSON-LD for SEO
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Contract Manager",
            "url": process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            "logo": (process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/logo.jpeg'
          })
        }
      ]
    }
  }
})