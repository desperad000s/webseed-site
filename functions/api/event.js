// CF Pages Function for /api/event — proxies Plausible event POSTs to the
// self-hosted Plausible instance on Hetzner. Handles non-POST methods
// quietly so they don't surface as 405 "Method Not Allowed" in the browser
// console (which Lighthouse counts as a Best Practices regression).

export async function onRequest(context) {
  const { request } = context;

  // CORS preflight — return 204 with permissive headers so the actual
  // POST request can go through without Plausible's upstream answering 405.
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Anything that isn't POST gets silently dropped (204), no console error.
  if (request.method !== 'POST') {
    return new Response(null, { status: 204 });
  }

  // Forward POST to upstream Plausible, preserving headers + body.
  const upstream = 'https://plausible.webseed.me/api/event';
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      'User-Agent': request.headers.get('user-agent') || '',
      'X-Forwarded-For': request.headers.get('cf-connecting-ip') || '',
      'X-Forwarded-Proto': 'https',
    },
    body: await request.text(),
  };
  const res = await fetch(upstream, init);
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
