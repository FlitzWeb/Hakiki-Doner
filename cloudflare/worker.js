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
    const headers = new Headers(response.headers);
    if (preview) headers.set("X-Robots-Tag", "noindex");
    else headers.set("Strict-Transport-Security", "max-age=63072000");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
