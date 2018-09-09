importScripts('/_nuxt/workbox.42554690.js', 'test-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.89bdbfe387481471f6f9.js",
    "revision": "244f3cafcf0b158c46a9f6a7ae481c77"
  },
  {
    "url": "/_nuxt/layouts/default.4c3f68c816c825ff09e5.js",
    "revision": "1061554f63a38382d34acc131ac0f14b"
  },
  {
    "url": "/_nuxt/manifest.8012493153f875c6f66a.js",
    "revision": "7d518f1551d579e08e1a25398415bb3b"
  },
  {
    "url": "/_nuxt/pages/index.1249ba57119b3c3d917c.js",
    "revision": "ba4d7839083197feb992faeaa4b88733"
  },
  {
    "url": "/_nuxt/pages/restaurants.123f07b3edf0366b3e11.js",
    "revision": "61c37eb95b4970bb8c1a1ea46d7376d8"
  },
  {
    "url": "/_nuxt/vendor.3a8533c6b11023d88a5b.js",
    "revision": "fdaeda6e425058ee2ef18808f6f2cd71"
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





