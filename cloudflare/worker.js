// Runs in front of the static files. Keeps hakiki.nl behaving as it did on
// Vercel: one address (https, no www), the old menu PDF link still lands on
// the menu, and preview addresses stay out of Google.
const SITE = "hakiki.nl";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const preview = url.hostname.endsWith(".workers.dev");

    if (!preview && (url.hostname !== SITE || url.protocol === "http:")) {
      url.hostname = SITE;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 308);
    }

    // Old printed/shared link to the PDF menu.
    if (url.pathname === "/hakikimenupdf.pdf") {
      return Response.redirect(`${url.origin}/#menu`, 308);
    }

    // "/" (and any folder) is its index.html; other pages keep their .html address.
    if (url.pathname.endsWith("/")) {
      url.pathname += "index.html";
      request = new Request(url, request);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) return notFound(preview);
    const headers = new Headers(response.headers);
    if (preview) headers.set("X-Robots-Tag", "noindex");
    else headers.set("Strict-Transport-Security", "max-age=63072000");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};

// A plain "not found" page instead of an empty screen.
function notFound(preview) {
  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Pagina niet gevonden | Hakiki Döner</title><style>body{margin:0;min-height:100vh;display:grid;place-content:center;gap:1rem;padding:1.5rem;font:1.0625rem/1.5 system-ui,sans-serif;text-align:center;background:#fbf6ee;color:#2a1a12}a{color:#b3121f}</style></head><body><h1>Pagina niet gevonden</h1><p>Deze pagina bestaat niet (meer).</p><p><a href="/">Naar de homepagina van Hakiki Döner</a></p></body></html>`;
  const headers = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" };
  if (preview) headers["X-Robots-Tag"] = "noindex";
  return new Response(html, { status: 404, headers });
}
