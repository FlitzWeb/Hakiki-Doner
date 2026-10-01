/* FlitzWeb klantacties-tracker
   Telt de klikken die er voor een klant toe doen (bellen, bestellen, route,
   WhatsApp, mail, formulier) en stuurt ze als event naar Umami.
   - Geen cookies, geen persoonsgegevens: alleen "er is op X geklikt".
   - Werkt automatisch op tel:, mailto:, wa.me, Google/Apple Maps en
     bezorgplatforms. Overschrijven of extra knoppen tellen kan met
     data-flitz="order" (of call, directions, reserve, ...) op een link,
     knop of <form>.
   - Laad dit NA het Umami-script:
       <script defer src="https://cloud.umami.is/script.js"
               data-website-id="..." data-domains="klant.nl"></script>
       <script defer src="/flitz-track.js"></script>
*/
(function () {
  "use strict";

  var RULES = [
    ["call", /^tel:/i],
    ["email", /^mailto:/i],
    ["whatsapp", /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i],
    ["directions", /^https?:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple\.com)/i],
    ["order", /^https?:\/\/([a-z0-9-]+\.)*(thuisbezorgd\.nl|ubereats\.com|deliveroo\.[a-z.]+|takeaway\.com|lieferando\.[a-z.]+|bistroo\.nl)/i],
    ["reserve", /^https?:\/\/([a-z0-9-]+\.)*(thefork\.[a-z.]+|formitable\.com|resengo\.com|zenchef\.com|opentable\.[a-z.]+)/i],
    ["social", /^https?:\/\/([a-z0-9-]+\.)*(instagram\.com|facebook\.com|tiktok\.com)/i]
  ];

  function classify(el) {
    var explicit = el.getAttribute("data-flitz");
    if (explicit) return explicit;
    var href = el.getAttribute("href") || "";
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][1].test(href)) return RULES[i][0];
    }
    return null;
  }

  // Waar op de pagina zat de knop? (data-flitz-where > dichtstbijzijnde sectie-id)
  function where(el) {
    var tagged = el.closest("[data-flitz-where]");
    if (tagged) return tagged.getAttribute("data-flitz-where");
    if (el.closest("header, nav")) return "menu";
    if (el.closest("footer")) return "footer";
    var sec = el.closest("section[id], [id]");
    return sec ? sec.id : "page";
  }

  function send(name, el) {
    try {
      if (window.umami && typeof window.umami.track === "function") {
        window.umami.track(name, { where: where(el), page: location.pathname });
      }
    } catch (e) {}
  }

  // Capture-fase: we tellen ook als een ander script de klik later stopt.
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest && e.target.closest("a[href], [data-flitz]");
    if (!el || el.tagName === "FORM") return;
    var name = classify(el);
    if (name) send(name, el);
  }, true);

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form && form.getAttribute) send(form.getAttribute("data-flitz") || "form", form);
  }, true);
})();
