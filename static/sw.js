importScripts('/_nuxt/workbox.42554690.js', 'test-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.73aba6ce2018d8116703.js",
    "revision": "15466ae41b8e9015fb4ec4e1cb6e96f5"
  },
  {
    "url": "/_nuxt/layouts/default.c9d9f8c429bd8867c989.js",
    "revision": "027c65e246167761a7a6e89e7cb50a02"
  },
  {
    "url": "/_nuxt/manifest.e69597f1b53650abab73.js",
    "revision": "c312b1db30e34279b70122ffc73bf43f"
  },
  {
    "url": "/_nuxt/pages/index.59cd0f270338bb74e83d.js",
    "revision": "85cd0fb2df050cbae2f4b40b681f046c"
  },
  {
    "url": "/_nuxt/pages/restaurant.6ed34aeb4e7a15cf75f2.js",
    "revision": "08df29446bd72f104549b38c6a9ee187"
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

workbox.routing.registerRoute(new RegExp('/^http:\/\/localhost:1337\/.*/'), workbox.strategies.cacheFirst({"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workbox.routing.registerRoute(new RegExp('/^https:\/\/api.tiles.mapbox.com\/.*/'), workbox.strategies.cacheFirst({"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workbox.routing.registerRoute(new RegExp('/^http:\/\/localhost:3333\/img\/.*/'), workbox.strategies.cacheFirst({"cacheName":"images","cacheableResponse":{"statuses":[0,200,304]}}), 'GET')





