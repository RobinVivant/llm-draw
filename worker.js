let handleRequest;

try {
  ({ handleRequest } = require('@cloudflare/next-on-pages'));
} catch (error) {
  console.error('Failed to import @cloudflare/next-on-pages:', error);
  handleRequest = () => new Response('Server configuration error', { status: 500 });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});
