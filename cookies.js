/* Hakiki Döner - opruimen na het stoppen met Microsoft Clarity (okt 2026)
   De site gebruikt geen cookies meer, dus ook geen cookiebanner.
   Bezoekers die vroeger "Accepteren" kozen hebben nog Clarity-cookies en onze
   oude toestemmingskeuze in hun browser; die halen we hier weg.
*/
(function () {
  "use strict";
  try { localStorage.removeItem("hakiki-cookie-consent"); } catch (e) {}
  var host = location.hostname.replace(/^www\./, "");
  ["_clck", "_clsk"].forEach(function (name) {
    if (document.cookie.indexOf(name + "=") === -1) return;
    ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
    });
  });
})();
