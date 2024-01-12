console.log("Service Worker script loaded");
const CACHE_NAME = "my-cache-v8"; // Increment the version to force cache update
const urlsToCache = [
  "/",
  "/build/index.html",
  "/static/js/index.js",
  "/static/js/App.js",
  "/static/js/Form.js",
  "/static/css/MyForm.css",
  "/static/css/App.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker installed");

      // Use Promise.all to handle multiple add requests
      return Promise.all(
        urlsToCache.map((url) => {
          // Fetch each resource and add to cache
          return fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch: ${url}. Status: ${response.status}`
                );
              }

              const responseToCache = response.clone();
              return cache.put(url, responseToCache);
            })
            .catch((error) => {
              console.error(`Failed to fetch: ${url}`, error);
              // Consider providing a fallback response or handling the error in a different way
            });
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
