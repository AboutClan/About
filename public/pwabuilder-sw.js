/* global workbox */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");
// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

workbox.setConfig({
  debug: false,
});

const offlineFallbackPage = "/offline";
const offlinePageCache = "pwa-offline-page-cache";

self.addEventListener("install", async (event) => {
  event.waitUntil(caches.open(offlinePageCache).then((cache) => cache.add(offlineFallbackPage)));
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") {
    // page navigation 제외
    return;
  }

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match("offline");
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("push", (e) => {
  const data = e.data.json();

  self.registration.showNotification(data.title, {
    body: data?.body,
    badge: data?.badge,
    data: data?.data || { url: "/", notificationType: "default" },
    icon: data?.icon,
    tag: data?.tag,
    requireInteraction: data?.requireInteraction || true,
    silent: data?.silent,
    renotify: data?.renotify || true,
    timestamp: data?.timestamp || Date.now(),
    vibrate: data?.vibrate,
    actions: data?.actions || [
      {
        action: "https://studyabout.herokuapp.com/home",
        title: "ABOUT",
        icon: data.icon,
      },
    ],
    dir: data?.dir,
  });
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification

  const url = event.notification.data.url; // Get the URL from the notification data
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});

// ** //
//
//
// 밑에서부터는 다시 디버깅
//
//
// ** //
// const API_CACHE = "api-cache";
// const STATIC_RESOURCES = "static-resources";
// const IMAGES_CACHE = "images";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";

// if (workbox.navigationPreload.isSupported()) {
//   workbox.navigationPreload.enable();
// } // Adjust caching strategy for API requests
// workbox.routing.registerRoute(
//   new RegExp(`${SERVER_URI}/.*`), // Adjust the regex to match your API requests
//   new workbox.strategies.NetworkFirst({
//     cacheName: API_CACHE,
//     plugins: [
//       new workbox.expiration.ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 24 * 60 * 60, // 1 day
//       }),
//     ],
//     fetchOptions: {
//       cache: "no-store",
//     },
//   }),
// );

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches
//       .open(CACHE)
//       .then((cache) => cache.add(offlineFallbackPage))
//       .then(() => {
//         return self.skipWaiting();
//       }),
//   );
// });

// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE, API_CACHE, STATIC_RESOURCES, IMAGES_CACHE];
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             if (!cacheWhitelist.includes(cacheName)) {
//               return caches.delete(cacheName);
//             }
//           }),
//         );
//       })
//       .then(() => self.clients.claim()),
//   );
// });

// self.addEventListener("install", async (event) => {
//   event.waitUntil(caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage)));
// });

// if (workbox.navigationPreload.isSupported()) {
//   workbox.navigationPreload.enable();
// }

// workbox.routing.registerRoute(
//   new RegExp("/_next/static/.*"),
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: STATIC_RESOURCES,
//   }),
// ); // Adjust caching strategy for images
// workbox.routing.registerRoute(
//   new RegExp("/_next/image.*"),
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: IMAGES_CACHE,
//   }),
// );

// Fallback for navigation requests
// self.addEventListener("fetch", (event) => {
//   if (event.request.mode === "navigate") {
//     event.respondWith(
//       (async () => {
//         try {
//           const preloadResp = await event.preloadResponse;
//           if (preloadResp) {
//             return preloadResp;
//           }

//           const networkResp = await fetch(event.request);
//           return networkResp;
//         } catch (error) {
//           const cache = await caches.open(CACHE);
//           const cachedResp = await cache.match(offlineFallbackPage);
//           return cachedResp;
//         }
//       })(),
//     );
//   }
// });
