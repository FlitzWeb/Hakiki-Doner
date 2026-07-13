/* Hakiki Döner — Vercel Web Analytics
   Meet de acties die er voor een snackbar echt toe doen:
   bestellen via Thuisbezorgd, bellen, route plannen, Instagram
   en het openklappen van de menukaart.
   Werkt zodra de site op Vercel staat met Web Analytics aan (Pro-plan voor events).
*/
(function () {
  "use strict";

  // Veilige wrapper rond Vercel's window.va (de queue-stub staat in index.html)
  function track(name, data) {
    if (typeof window.va === "function") {
      window.va("event", data ? { name: name, data: data } : { name: name });
    }
  }
  window.track = track;

  // Dichtstbijzijnde sectie, voor context bij een klik (hero, menu, footer, …)
  function locationOf(el) {
    var sec = el.closest("section, header, footer");
    if (!sec) return "overig";
    return sec.id || (sec.className || "").toString().split(" ")[0] || sec.tagName.toLowerCase();
  }

  // Eén gedelegeerde listener in de capture-fase, zodat we de menu-status
  // kunnen aflezen vóórdat main.js 'm omzet.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("a, button");
    if (!el) return;

    // Menukaart openklappen (alleen bij openen, niet bij sluiten)
    if (el.id === "menu-toggle") {
      if (el.getAttribute("aria-expanded") === "false") track("menu_open");
      return;
    }

    var href = el.getAttribute("href") || "";
    if (/thuisbezorgd/i.test(href))                                { track("order_thuisbezorgd", { location: locationOf(el) }); return; }
    if (/^tel:/i.test(href))                                       { track("phone_click"); return; }
    if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl/i.test(href))    { track("directions_click"); return; }
    if (/instagram\.com/i.test(href))                             { track("instagram_click"); return; }
  }, true); // capture
})();
