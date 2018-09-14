importScripts('/_nuxt/workbox.42554690.js', 'test-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.8834f5735d082f324a82.js",
    "revision": "e18f0bc4777d2aeee7584888424a3df4"
  },
  {
    "url": "/_nuxt/layouts/default.c9d9f8c429bd8867c989.js",
    "revision": "027c65e246167761a7a6e89e7cb50a02"
  },
  {
    "url": "/_nuxt/manifest.fd37a2c87d85773f7bdd.js",
    "revision": "60c2b1acea25658961eb67aa92bc9947"
  },
  {
    "url": "/_nuxt/pages/index.7de6de90fd4a72907c0c.js",
    "revision": "f708e088a7b1830f74170db1b14e12af"
  },
  {
    "url": "/_nuxt/pages/restaurant.e5dde33f80dfcb8c5918.js",
    "revision": "6ae3a5b1529222efb2496052d1948926"
  },
  {
    "url": "/_nuxt/vendor.e12eee1491654c1b935e.js",
    "revision": "829a19700b353cd4e2b3eaf3c576f568"
  }
], {
  "cacheId": "mws-3-final",
  "directoryIndex": "/",
  "cleanUrls": false
})



workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/^http:\/\/localhost:1337\/.*/'), workbox.strategies.networkFirst({"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workbox.routing.registerRoute(new RegExp('/^https:\/\/api.tiles.mapbox.com\/.*/'), workbox.strategies.networkFirst({"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workbox.routing.registerRoute(new RegExp('/\.(?:png|gif|jpg|jpeg|svg)$/'), workbox.strategies.cacheFirst({"cacheName":"images"}), 'GET')





