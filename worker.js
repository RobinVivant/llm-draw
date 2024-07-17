import { handleRequest } from '@cloudflare/next-on-pages'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
