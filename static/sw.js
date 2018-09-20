importScripts('/_nuxt/workbox.42554690.js', 'test-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.573ec3cb04a2c27a465c.js",
    "revision": "a94e8470689cbfab63f3c3eb6025a110"
  },
  {
    "url": "/_nuxt/layouts/default.c9d9f8c429bd8867c989.js",
    "revision": "027c65e246167761a7a6e89e7cb50a02"
  },
  {
    "url": "/_nuxt/manifest.3d7f528c0c8c28d1537e.js",
    "revision": "ac3f261b868c48029f0beaeb9ad1343d"
  },
  {
    "url": "/_nuxt/pages/index.2f2b9413cc866e2039d7.js",
    "revision": "cef883c3d357c428bd03458fe9c203c1"
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





