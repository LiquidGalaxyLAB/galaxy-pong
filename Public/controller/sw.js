self.addEventListener('install', event=>{

})

self.addEventListener('activate', event=>{
  
})

self.addEventListener('fetch', event=>{
  event.respondWith(
    caches.match(event.request)
  )
})