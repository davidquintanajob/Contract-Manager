module.exports = {
    apps: [
      {
        name: 'contc-front',
        port: 5356, // o el puerto que quieras
        exec_mode: 'cluster',
        instances: 'max', // o un número fijo
        script: './.output/server/index.mjs', // Ruta al entry point de Nuxt 3
        env: {
          NUXT_PUBLIC_BACKEND_HOST: 'http://31.170.165.44:5671',
          NITRO_PORT: 5356,
          PORT: 5356,
          NODE_ENV: 'production'
        }
      }
    ]
  }