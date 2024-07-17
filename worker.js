let nextHandleRequest;

try {
  console.log('Attempting to import @cloudflare/next-on-pages...');
  const { handleRequest: importedHandleRequest } = require('@cloudflare/next-on-pages');
  console.log('Successfully imported @cloudflare/next-on-pages');
  nextHandleRequest = importedHandleRequest;
} catch (error) {
  console.error('Failed to import @cloudflare/next-on-pages:', error);
  console.error('Error stack:', error.stack);
  nextHandleRequest = () => new Response('Server configuration error', { status: 500 });
}

async function handleRequest(event) {
  try {
    console.log('Handling request...');
    if (typeof nextHandleRequest !== 'function') {
      throw new Error('nextHandleRequest is not a function');
    }
    console.log('Calling nextHandleRequest...');
    const response = await nextHandleRequest(event);
    console.log('Response from nextHandleRequest:', JSON.stringify({
      status: response.status,
      headers: Object.fromEntries(response.headers),
    }, null, 2));

    if (!(response instanceof Response)) {
      console.error('Invalid response from nextHandleRequest');
      return new Response('Invalid response from server', { status: 500 });
    }

    if (response.status === 500) {
      const errorText = await response.clone().text();
      console.error('Server error response:', errorText);
      return new Response(`Server Error: ${errorText}`, { status: 500 });
    }

    console.log('Returning response with status:', response.status);
    return response;
  } catch (error) {
    console.error('Error in handleRequest:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(`Server Error: ${error.message}\n\nStack: ${error.stack}\n\nDetails: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`, { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event).catch(error => {
    console.error('Unhandled error in fetch event:', error);
    console.error('Unhandled error stack:', error.stack);
    return new Response(`Unhandled Server Error: ${error.message}\n\nStack: ${error.stack}`, { status: 500 });
  }));
});
