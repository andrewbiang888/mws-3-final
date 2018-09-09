module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'mws-3-final',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'In fulfillment of the Udacity mobile web specialist nanodegree program as recipient of the Grow With Google scholarship.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css', integrity: 'sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==', crossorigin: '' }
    ],
    script: [
      { src: 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js', integrity: 'sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==', crossorigin: ''}
    ]
  },
  modules: [
    '@nuxtjs/pwa',
  ],
  css: [
    '~css/main.css'
  ],
  plugins: [
    '~/plugins/restaurantfetch.js',
  ],
  router: {
    middleware: ['pages']
  },
  env: {
    SERVERURL: 'http://localhost:1337/'
  },
  transition: {
    name: 'pagetran',
    mode: 'out-in'
  },
  workbox: {
    importScripts: [
        'test-sw.js'
    ]
  },
  runtimeCaching: [
    {
      // To match cross-origin requests, use a RegExp that matches
      // the start of the origin:
      urlPattern: new RegExp('^http://localhost:1337/.*'),
      handler: 'datafromserver',
      options: {
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
   },
   {
    urlPattern: new RegExp('^https://api.tiles.mapbox.com/.*'),
    handler: 'mapimgdata',
    options: {
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
   }
],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

