import { handleRequest } from '@cloudflare/next-on-pages/api'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
