/* FlitzWeb klantacties-tracker
   Telt de klikken die er voor een klant toe doen (bellen, bestellen, route,
   WhatsApp, mail, formulier) en stuurt ze als event naar FlitzWeb Studio.
   - Geen cookies, geen persoonsgegevens: alleen "er is op X geklikt".
   - Werkt automatisch op tel:, mailto:, wa.me, Google/Apple Maps en
     bezorgplatforms. Overschrijven of extra knoppen tellen kan met
     data-flitz="order" (of call, directions, reserve, ...) op een link,
     knop of <form>.
   - Laad dit VOOR het Studio-script, zodat ?nietmeetellen meteen werkt:
       <script defer src="/flitz-track.js"></script>
       <script defer src="https://studio.flitzweb.nl/t.js"
               data-site="..." data-domains="klant.nl"></script>
*/
(function () {
  "use strict";

  // Eigen bezoeken uitsluiten: open één keer site.nl/?nietmeetellen op elk
  // apparaat/browser (?weermeetellen zet het terug). De Studio-tracker leest
  // "flitz-ignore" bij het versturen en laadt na dit script, dus ook dit
  // bezoek telt al niet.
  try {
    var q = location.search;
    var msg = null;
    // Wie zich in de Umami-tijd al had uitgesloten, blijft uitgesloten.
    if (localStorage.getItem("umami.disabled") === "1") {
      localStorage.setItem("flitz-ignore", "1");
      localStorage.removeItem("umami.disabled");
    }
    if (/[?&]nietmeetellen\b/.test(q)) {
      localStorage.setItem("flitz-ignore", "1");
      msg = "Deze browser telt niet meer mee in de statistieken.";
    } else if (/[?&]weermeetellen\b/.test(q)) {
      localStorage.removeItem("flitz-ignore");
      msg = "Deze browser telt weer mee in de statistieken.";
    }
    if (msg) {
      history.replaceState(null, "", location.pathname + location.hash);
      setTimeout(function () { alert(msg); }, 300);
    }
  } catch (e) {}

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
      var data = { where: where(el), page: location.pathname };
      // FlitzWeb Studio (studio.flitzweb.nl/t.js). Alleen window.flitz: het
      // Studio-script zet zelf ook window.umami als alias, dus beide aanroepen
      // zou elke klik dubbel tellen.
      if (window.flitz && typeof window.flitz.track === "function") {
        window.flitz.track(name, data);
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
