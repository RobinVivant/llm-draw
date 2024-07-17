let nextHandleRequest;

try {
  const { handleRequest: importedHandleRequest } = require('@cloudflare/next-on-pages');
  nextHandleRequest = importedHandleRequest;
} catch (error) {
  console.error('Failed to import @cloudflare/next-on-pages:', error);
  nextHandleRequest = () => new Response('Server configuration error', { status: 500 });
}

async function handleRequest(event) {
  try {
    console.log('Handling request...');
    const response = await nextHandleRequest(event);
    console.log('Response from nextHandleRequest:', response);

    if (!(response instanceof Response)) {
      console.error('Invalid response from nextHandleRequest:', response);
      return new Response('Invalid response from server', { status: 500 });
    }

    return response;
  } catch (error) {
    console.error('Error in handleRequest:', error);
    return new Response(`Server Error: ${error.stack || error.message}`, { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event).catch(error => {
    console.error('Unhandled error in fetch event:', error);
    return new Response(`Unhandled Server Error: ${error.stack || error.message}`, { status: 500 });
  }));
});
