const staticBillSplitter = "bill-splitter-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticBillSplitter).then(cache => {
      cache.addAll(assets)
    })
  )
})