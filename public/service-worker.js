console.log("Service Worker script loaded");
const CACHE_NAME = "my-cache-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/Form.js",
  "/static/css/MyForm.css",
  "/static/css/App.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker installed");

      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Service Worker installed");

        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            console.error("Failed to fetch:", event.request.url, response);
            return response;
          }

          // Continue with caching logic
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          // Handle fetch errors, if needed
        });
    })
  );
});
