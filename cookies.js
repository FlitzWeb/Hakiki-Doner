/* Hakiki Döner - cookietoestemming (AVG/GDPR)
   - Microsoft Clarity wordt pas geladen NA een expliciet akkoord
   - keuze blijft 6 maanden staan, daarna vragen we het opnieuw
   - "Cookievoorkeuren" in de footer opent de banner weer
   Let op: dit bestand moet ná main.js geladen worden, zodat we weten
   of de vakantie-pop-up op dit moment in beeld staat.
*/
(function () {
  "use strict";

  var CLARITY_ID = "xqkfrlfnu7";
  var KEY = "hakiki-cookie-consent";
  var MAX_AGE = 182 * 24 * 60 * 60 * 1000; // ~6 maanden

  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  /* ---------------- Keuze opslaan / uitlezen ---------------- */
  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || !saved.choice) return null;
      if (Date.now() - (saved.ts || 0) > MAX_AGE) return null; // verlopen: opnieuw vragen
      return saved.choice;
    } catch (e) {
      return null; // privémodus of geblokkeerde opslag
    }
  }

  function saveChoice(choice) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice: choice, ts: Date.now() }));
    } catch (e) {}
  }

  /* ---------------- Clarity ---------------- */
  var clarityLoaded = false;

  function loadClarity() {
    if (clarityLoaded || window.clarity) return;
    clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  // Bij het intrekken van toestemming: de cookies die Clarity op ons eigen
  // domein zet weghalen. De tag zelf blijft tot de volgende paginalading weg.
  function clearClarityCookies() {
    var host = location.hostname;
    var domains = ["", host, "." + host];
    var parts = host.split(".");
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));

    ["_clck", "_clsk"].forEach(function (name) {
      domains.forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
                          (d ? "; domain=" + d : "");
      });
    });
  }

  /* ---------------- Banner tonen / verbergen ---------------- */
  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function decide(choice) {
    saveChoice(choice);
    hideBanner();
    if (choice === "accepted") {
      loadClarity();
    } else {
      clearClarityCookies();
      // was Clarity in deze sessie al actief, dan stopt het pas na een verse lading
      if (window.clarity) location.reload();
    }
  }

  banner.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    if (e.target.closest('[data-role="cookie-accept"]')) decide("accepted");
    if (e.target.closest('[data-role="cookie-reject"]')) decide("rejected");
  });

  // "Cookievoorkeuren" in de footer
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest('[data-role="cookie-settings"]')) {
      showBanner();
      var first = banner.querySelector("button");
      if (first) first.focus();
    }
  });

  /* ---------------- Start ---------------- */
  var choice = readChoice();
  if (choice === "accepted") {
    loadClarity();
    return;
  }
  if (choice === "rejected") return;

  // Nog geen keuze: banner tonen, maar niet bovenop de vakantie-pop-up.
  var modal = document.getElementById("vakantie-modal");
  if (modal && !modal.hidden) {
    var obs = new MutationObserver(function () {
      if (modal.hidden) {
        obs.disconnect();
        showBanner();
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ["hidden"] });
  } else {
    showBanner();
  }
})();
