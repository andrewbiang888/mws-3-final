importScripts('/_nuxt/workbox.42554690.js', 'test-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.a60220ceb4a4d6486f74.js",
    "revision": "6e595256c5a209e8699ab7a362101647"
  },
  {
    "url": "/_nuxt/layouts/default.66af246845ec47d2315c.js",
    "revision": "44ede48c5433756c88a88b55b6063e91"
  },
  {
    "url": "/_nuxt/manifest.6ac91b0124a429157923.js",
    "revision": "e3485113b1459bd25891e71cf9929533"
  },
  {
    "url": "/_nuxt/pages/index.4f9bd5d1faa4e212e7ac.js",
    "revision": "c2cb75007096807ca19da0691de0346c"
  },
  {
    "url": "/_nuxt/pages/restaurant.238e89e5331633c5dc0e.js",
    "revision": "b7752446ce79cfdd6e6514497e6b0023"
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





