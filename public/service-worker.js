// service-worker.js

const cacheName = "offline-cache";
const offlineUrl = "offline.html"; // Replace with the actual path to your HTML file

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // List of resources to cache
      const resourcesToCache = [offlineUrl, "/index.html", "static/js/form"];

      // Use Promise.all to handle multiple add operations
      return Promise.all(
        resourcesToCache.map(async (resource) => {
          try {
            const response = await fetch(resource);
            // Check if the response is successful (status code 200)
            if (!response.ok) {
              throw new Error(`Failed to fetch: ${resource}`);
            }
            return await cache.put(resource, response);
          } catch (error) {
            console.error(`Caching failed for ${resource}:`, error);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((fetchResponse) => {
            if (
              !fetchResponse ||
              fetchResponse.status !== 200 ||
              fetchResponse.type !== "basic"
            ) {
              return fetchResponse;
            }

            const responseToCache = fetchResponse.clone();

            caches.open(cacheName).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return fetchResponse;
          })
          .catch((fetchError) => {
            console.error(`Fetch failed for ${event.request.url}:`, fetchError);
            return caches.match(offlineUrl);
          })
      );
    })
  );
});
