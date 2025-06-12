/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,vue,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './components/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3362d6",       // Azul oscuro del texto "SOLUTEC" (Pantone 2945 C)
        "secondary": "#7690b5",     // Gris del eslogan (similar a Cool Gray 9 C)
        "accent": "#93C5FD",        // Azul claro (para destacar elementos)
        "neutral": "#FFFFFF",       // Blanco puro (fondo de la imagen)
        "dark": "#111827"           // Negro suave (contraste elegante)
      }
    },
  },
  plugins: [],
}
