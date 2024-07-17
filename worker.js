async function handleRequest(event) {
  try {
    console.log('Handling request...');
    const { handleRequest: nextHandleRequest } = await import('@cloudflare/next-on-pages');
    console.log('Successfully imported @cloudflare/next-on-pages');

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
