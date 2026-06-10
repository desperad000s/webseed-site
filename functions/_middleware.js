// Edge middleware — runs on every CF Pages request.
//
// Strips Cloudflare's auto-injected RUM beacon (static.cloudflareinsights.com/
// beacon.min.js) from HTML responses BEFORE they leave the edge. The beacon is
// added by an account-level "Web Analytics auto-install" toggle that's not
// reachable from our API token. Stripping it here is the same end state
// without needing dashboard access.
//
// Side effect: we lose CF's Web Analytics RUM data for this site. GA4 +
// Plausible + Google Search Console already track real-user Core Web Vitals,
// so this is acceptable.
//
// Implementation: HTMLRewriter (built into the CF Workers runtime that
// Pages Functions run on). Cheap — streaming transform, no full-body buffer.

export async function onRequest(context) {
  const response = await context.next();

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  return new HTMLRewriter()
    .on('script[src*="cloudflareinsights"]', { element(el) { el.remove(); } })
    .on('script[data-cf-beacon]',            { element(el) { el.remove(); } })
    .on('script[data-cfasync="false"][src*="beacon"]', { element(el) { el.remove(); } })
    .transform(response);
}
