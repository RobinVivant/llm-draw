let handleRequest;

try {
  ({ handleRequest } = require('@cloudflare/next-on-pages'));
} catch (error) {
  console.error('Failed to import @cloudflare/next-on-pages:', error);
  handleRequest = () => Promise.resolve(new Response('Server configuration error', { status: 500 }));
}

addEventListener('fetch', event => {
  event.respondWith(
    Promise.resolve(handleRequest(event))
      .then(response => response instanceof Response ? response : new Response('Invalid response', { status: 500 }))
      .catch(error => {
        console.error('Error in handleRequest:', error);
        return new Response('Internal Server Error', { status: 500 });
      })
  );
});
