import { handleRequest as nextHandleRequest } from '@cloudflare/next-on-pages';

async function handleRequest(event) {
  try {
    const response = await nextHandleRequest(event);
    if (!(response instanceof Response)) {
      console.error('Invalid response from nextHandleRequest');
      return new Response('Invalid response from server', { status: 500 });
    }
    return response;
  } catch (error) {
    console.error('Error in handleRequest:', error);
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});
