/* Hakiki Döner - interactie
   - rendert de menukaart uit menu-data.js
   - categoriefilter (chips)
   - live "nu geopend / gesloten" op basis van openingstijden
   - mobiel menu
*/
(function () {
  "use strict";

  var euro = function (cents) {
    return "€ " + (cents / 100).toFixed(2).replace(".", ",");
  };

  // Escape menu text before it goes into innerHTML, so a stray &, < or quote
  // in a name/description can't break the markup.
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------------- Menu render ---------------- */
  var grid = document.getElementById("menu-grid");
  var filter = document.getElementById("menu-filter");
  var data = window.HAKIKI_MENU || [];

  // Let op: de losse spans worden met een spatie aan elkaar geplakt. Zonder die
  // spatie plakt de tekst in zoekresultaten aan elkaar ("€ 12,0010 stuks"),
  // omdat Google de tekst uitleest zonder naar de opmaak te kijken.
  function priceHtml(item) {
    if (item.soldout) {
      return '<span class="mitem__soldout">Tijdelijk uitverkocht</span>';
    }
    var from = item.from ? '<span class="from">vanaf</span> ' : "";
    return '<span class="mitem__price">' + from + euro(item.price) + "</span>";
  }

  function itemHtml(item) {
    var cls = "mitem" + (item.soldout ? " mitem--soldout" : "");
    var desc = item.desc ? '<span class="mitem__desc">' + esc(item.desc) + "</span>" : "";
    return (
      '<li class="' + cls + '">' +
        '<span class="mitem__name">' + esc(item.name) + "</span> " +
        priceHtml(item) + " " +
        desc +
      "</li>"
    );
  }

  function cardHtml(cat) {
    return (
      '<article class="mcard" id="cat-' + cat.id + '" data-cat="' + cat.id + '">' +
        '<header class="mcard__head">' +
          '<h3 class="mcard__title">' + esc(cat.title) + "</h3> " +
          (cat.tag ? '<span class="mcard__tag">' + esc(cat.tag) + "</span>" : "") +
        "</header>" +
        (cat.blurb ? '<p class="mcard__blurb">' + esc(cat.blurb) + "</p>" : "") +
        '<ul class="mlist">' + cat.items.map(itemHtml).join("\n") + "</ul>" +
      "</article>"
    );
  }

  if (grid) {
    grid.innerHTML = data.map(cardHtml).join("\n");
  }

  /* ---------------- Filter chips ---------------- */
  if (filter && data.length) {
    var chips = ['<button class="chip is-active" role="tab" aria-selected="true" data-filter="all">Alles</button>'];
    data.forEach(function (cat) {
      chips.push(
        '<button class="chip" role="tab" aria-selected="false" data-filter="' +
        cat.id + '">' + esc(cat.title) + "</button>"
      );
    });
    filter.innerHTML = chips.join("");

    filter.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      var val = btn.getAttribute("data-filter");

      filter.querySelectorAll(".chip").forEach(function (c) {
        var active = c === btn;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-selected", active ? "true" : "false");
      });

      if (val === "all") {
        grid.querySelectorAll(".mcard").forEach(function (card) { card.hidden = false; });
        return;
      }
      grid.querySelectorAll(".mcard").forEach(function (card) {
        card.hidden = card.getAttribute("data-cat") !== val;
      });
      // spring naar het menu-begin zodat de gefilterde categorie in beeld komt
      var target = document.getElementById("cat-" + val);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------- Openingstijden + status ---------------- */
  var HOURS = window.HAKIKI_HOURS || {};
  var DAY_NL = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  var MAAND_NL = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  var DAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MAAND_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var ORDER = [1, 2, 3, 4, 5, 6, 0]; // ma → zo

  /* ---------------- Vakantiesluiting ----------------
     Verschijnt en verdwijnt automatisch. Bij een volgende vakantie
     alleen deze twee datums aanpassen (en de datums in de
     specialOpeningHoursSpecification in index.html). */
  var VAKANTIE = {
    start: new Date(2026, 6, 26),    // eerste dag gesloten (26 juli 2026)
    weerOpen: new Date(2026, 7, 19)  // eerste dag weer open (19 augustus 2026)
  };

  // "vooraf" = aankondiging, "dicht" = nu met vakantie, "voorbij" = klaar
  function vakantieFase(now) {
    if (now >= VAKANTIE.weerOpen) return "voorbij";
    if (now >= VAKANTIE.start) return "dicht";
    return "vooraf";
  }

  function datumNl(d) { return DAY_NL[d.getDay()] + " " + d.getDate() + " " + MAAND_NL[d.getMonth()]; }
  function datumEn(d) { return DAY_EN[d.getDay()] + ", " + MAAND_EN[d.getMonth()] + " " + d.getDate(); }

  // Testhulpje: voeg ?testdatum=2026-08-01 toe aan de URL om de site
  // te bekijken alsof het die dag is.
  var testdatum = null;
  try { testdatum = new URLSearchParams(window.location.search).get("testdatum"); } catch (e) {}
  function NOW() { return testdatum ? new Date(testdatum + "T12:00:00") : new Date(); }

  function computeStatus(now) {
    if (vakantieFase(now) === "dicht") {
      return { open: false, text: "Gesloten wegens vakantie · weer open " + datumNl(VAKANTIE.weerOpen) };
    }
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = HOURS[day];
    if (today && mins >= today.open && mins < today.close) {
      var closingSoon = today.close - mins <= 30;
      return {
        open: true,
        text: closingSoon ? "Sluit binnenkort · " + fmt(today.close) : "Nu geopend · tot " + fmt(today.close)
      };
    }
    // volgende opening zoeken; vakantiedagen worden overgeslagen
    for (var i = 0; i < 40; i++) {
      var dag = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (vakantieFase(dag) === "dicht") continue;
      var h = HOURS[dag.getDay()];
      if (!h) continue;
      if (i === 0) {
        if (mins < h.open) return { open: false, text: "Gesloten · opent om " + fmt(h.open) };
        continue;
      }
      var when = i === 1 ? "morgen" : (i < 7 ? DAY_NL[dag.getDay()] : datumNl(dag));
      return { open: false, text: "Gesloten · opent " + when + " om " + fmt(h.open) };
    }
    return { open: false, text: "Gesloten" };
  }

  function fmt(m) {
    var hh = Math.floor(m / 60);
    var mm = m % 60;
    return hh + ":" + (mm < 10 ? "0" + mm : mm);
  }

  function paintVakantie(now) {
    var fase = vakantieFase(now);
    var laatsteDag = new Date(VAKANTIE.weerOpen.getFullYear(), VAKANTIE.weerOpen.getMonth(), VAKANTIE.weerOpen.getDate() - 1);

    // meldingsbalk bovenaan
    var notice = document.getElementById("vakantie-notice");
    if (notice) {
      notice.hidden = fase === "voorbij";
      var nl = notice.querySelector('[data-role="vakantie-nl"]');
      var en = notice.querySelector('[data-role="vakantie-en"]');
      if (nl && en) {
        if (fase === "vooraf") {
          nl.textContent = "Vakantie: wij zijn gesloten van " + VAKANTIE.start.getDate() + " " + MAAND_NL[VAKANTIE.start.getMonth()] +
                           " t/m " + laatsteDag.getDate() + " " + MAAND_NL[laatsteDag.getMonth()] + ".";
          en.textContent = "Holiday: we will be closed from " + MAAND_EN[VAKANTIE.start.getMonth()] + " " + VAKANTIE.start.getDate() +
                           " until and including " + MAAND_EN[laatsteDag.getMonth()] + " " + laatsteDag.getDate() + ".";
        } else if (fase === "dicht") {
          nl.textContent = "Wij zijn gesloten wegens vakantie. Vanaf " + datumNl(VAKANTIE.weerOpen) + " bent u weer van harte welkom.";
          en.textContent = "We are closed for holiday. You are very welcome again from " + datumEn(VAKANTIE.weerOpen) + ".";
        }
      }
    }

    // pop-up: datums invullen en (één keer per bezoek) tonen
    var modal = document.getElementById("vakantie-modal");
    if (modal) {
      var setText = function (role, text) {
        var el = modal.querySelector('[data-role="' + role + '"]');
        if (el) el.textContent = text;
      };
      setText("vmodal-nl-datums", "van " + VAKANTIE.start.getDate() + " " + MAAND_NL[VAKANTIE.start.getMonth()] +
              " t/m " + laatsteDag.getDate() + " " + MAAND_NL[laatsteDag.getMonth()]);
      setText("vmodal-nl-open", datumNl(VAKANTIE.weerOpen).charAt(0).toUpperCase() + datumNl(VAKANTIE.weerOpen).slice(1));
      setText("vmodal-en-datums", "from " + MAAND_EN[VAKANTIE.start.getMonth()] + " " + VAKANTIE.start.getDate() +
              " until and including " + MAAND_EN[laatsteDag.getMonth()] + " " + laatsteDag.getDate());
      setText("vmodal-en-open", datumEn(VAKANTIE.weerOpen));

      modalWacht(modal, fase !== "voorbij");
    }

    // afhaal- en Thuisbezorgd-knoppen dimmen zolang de zaak dicht is
    var dicht = fase === "dicht";
    document.querySelectorAll('[data-role="afhaal-cta"], a[href*="thuisbezorgd"]').forEach(function (a) {
      a.classList.toggle("is-disabled", dicht);
      if (dicht) {
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("tabindex", "-1");
      } else {
        a.removeAttribute("aria-disabled");
        a.removeAttribute("tabindex");
      }
    });
  }

  /* ---------------- Geen bezorging meer, alleen afhalen ----------------
     Balk en pop-up verschijnen en verdwijnen automatisch. Vóór "vanaf"
     is het een aankondiging, daarna een melding; vanaf "meldenTot" is
     de pop-up weg (de balk blijft zolang de afhaalkorting loopt). */
  var AFHAAL = {
    vanaf: new Date(2026, 9, 1),      // eerste dag zonder bezorging (1 oktober 2026)
    meldenTot: new Date(2026, 10, 1)  // vanaf deze dag geen pop-up meer (1 november 2026)
  };

  /* ---------------- Bel & Bespaar (korting bij telefonisch bestellen + afhalen) ----------------
     Alles met data-role="korting" (balk, pop-up, sticker, Bel & Bespaar-
     sectie, belbalk onderin, "& bespaar 10%" in de belknoppen) is alleen
     zichtbaar zolang de actie loopt. NIET geldig via Thuisbezorgd.
     Actie stopt? Zet "tot" op de eerste dag zónder korting, en pas de
     <title> en meta-beschrijvingen in index.html aan. */
  var KORTING = {
    procent: 10,
    vanaf: new Date(2026, 9, 1),  // eerste dag van de actie (1 oktober 2026)
    tot: null                     // eerste dag zonder korting; null = loopt door
  };

  function kortingActief(now) {
    return now >= KORTING.vanaf && (!KORTING.tot || now < KORTING.tot);
  }

  // "vooraf" = aankondiging, "actief" = bezorging gestopt, "voorbij" = niet meer melden
  function afhaalFase(now) {
    if (now >= AFHAAL.meldenTot) return "voorbij";
    if (now >= AFHAAL.vanaf) return "actief";
    return "vooraf";
  }

  function paintAfhaal(now) {
    var fase = afhaalFase(now);
    var korting = kortingActief(now);
    var dagNl = AFHAAL.vanaf.getDate() + " " + MAAND_NL[AFHAAL.vanaf.getMonth()];
    var dagEn = MAAND_EN[AFHAAL.vanaf.getMonth()] + " " + AFHAAL.vanaf.getDate();
    var setText = function (root, role, text) {
      var el = root.querySelector('[data-role="' + role + '"]');
      if (el) el.textContent = text;
    };

    document.querySelectorAll('[data-role="korting"]').forEach(function (el) { el.hidden = !korting; });
    document.querySelectorAll('[data-role="korting-uit"]').forEach(function (el) { el.hidden = korting; });
    document.querySelectorAll('[data-role="korting-pct"]').forEach(function (el) { el.textContent = KORTING.procent + "%"; });

    var notice = document.getElementById("afhaal-notice");
    if (notice) {
      notice.hidden = fase === "voorbij" && !korting;
      var nl = { vooraf: "Per " + dagNl + " bezorgen wij niet meer aan huis.", actief: "Wij bezorgen niet meer aan huis.", voorbij: "" }[fase];
      var en = { vooraf: "From " + dagEn + " we no longer deliver.", actief: "We no longer deliver.", voorbij: "" }[fase];
      setText(notice, "afhaal-nl", (nl + (korting
        ? " Bestel telefonisch via 040 248 3606 en haal af in Winkelcentrum Woensel."
        : " Afhalen kan in Winkelcentrum Woensel.")).trim());
      setText(notice, "afhaal-en", ((korting ? KORTING.procent + "% off when you order by phone and pick up. " : "") + en +
        " Takeaway at Winkelcentrum Woensel.").replace("  ", " "));
    }

    var modal = document.getElementById("afhaal-modal");
    if (modal) {
      setText(modal, "amodal-nl-stop", fase === "vooraf"
        ? "Per " + dagNl + " stoppen wij met onze bezorgservice aan huis."
        : "Per " + dagNl + " bezorgen wij niet meer aan huis.");
      setText(modal, "amodal-en-stop", fase === "vooraf"
        ? "From " + dagEn + " we will no longer deliver to your home."
        : "As of " + dagEn + " we no longer deliver to your home.");
      modalWacht(modal, fase !== "voorbij");
    }
  }

  /* ---------------- Pop-ups (vakantie, afhalen) ----------------
     Een pop-up die getoond mag worden gaat in de wachtrij; er staat er
     altijd maar één tegelijk in beeld. Na sluiten komt de volgende. Wat
     gesloten is blijft deze sessie weg (sessionStorage, key in data-gezien). */
  function modalWacht(modal, tonen) {
    if (!tonen) {
      delete modal.dataset.wacht;
      sluitModal(modal, false);
      return;
    }
    var gezien = false;
    try { gezien = sessionStorage.getItem(modal.getAttribute("data-gezien")) === "1"; } catch (e) {}
    if (!gezien && modal.hidden) modal.dataset.wacht = "1";
  }

  function toonVolgendeModal() {
    if (document.querySelector(".vmodal:not([hidden])")) return;
    var modal = document.querySelector(".vmodal[data-wacht]");
    if (!modal) return;
    delete modal.dataset.wacht;
    modal.hidden = false;
    document.body.classList.add("has-modal");
    var x = modal.querySelector(".vmodal__x");
    if (x) x.focus();
  }

  function sluitModal(modal, onthoud) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("has-modal");
    if (onthoud !== false) {
      try { sessionStorage.setItem(modal.getAttribute("data-gezien"), "1"); } catch (e) {}
    }
    toonVolgendeModal();
  }

  // pop-up sluiten: kruisje, knop, buiten de kaart klikken of Escape
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest('[data-role="vmodal-close"]')) sluitModal(e.target.closest(".vmodal"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") sluitModal(document.querySelector(".vmodal:not([hidden])"));
  });

  // vangnet: klik op een uitgeschakelde knop doet niets
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a.is-disabled") : null;
    if (a) e.preventDefault();
  });

  function paintStatus() {
    var now = NOW();
    var st = computeStatus(now);
    paintVakantie(now);
    paintAfhaal(now);
    toonVolgendeModal();
    document.querySelectorAll('[data-role="status"]').forEach(function (el) {
      el.classList.toggle("is-open", st.open);
      el.classList.toggle("is-closed", !st.open);
      var txt = el.querySelector(".status__text");
      if (txt) txt.textContent = st.text;
    });
    // "vandaag" in de hero
    var today = vakantieFase(now) === "dicht" ? null : HOURS[now.getDay()];
    document.querySelectorAll('[data-role="today-hours"]').forEach(function (el) {
      el.textContent = today ? today.label : "Gesloten";
    });
  }

  function buildHours() {
    var todayDay = NOW().getDay();
    document.querySelectorAll('[data-role="hours"] tbody').forEach(function (tbody) {
      tbody.innerHTML = ORDER.map(function (d) {
        var h = HOURS[d];
        var cls = d === todayDay ? ' class="is-today"' : "";
        return "<tr" + cls + "><td>" + DAY_NL[d] + "</td> <td>" +
               (h ? h.label : "Gesloten") + "</td></tr>";
      }).join("\n");
    });
  }

  buildHours();
  paintStatus();
  setInterval(paintStatus, 60 * 1000); // elke minuut verversen

  /* ---------------- Menu in-/uitklappen ---------------- */
  var menuToggle = document.getElementById("menu-toggle");
  var menuCollapse = document.getElementById("menu-collapse");
  if (menuToggle && menuCollapse) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", open ? "false" : "true");
      menuCollapse.hidden = open;
      var label = menuToggle.querySelector(".menu__toggle-label");
      if (label) label.textContent = open ? "Toon de menukaart" : "Verberg de menukaart";
    });
  }

  /* ---------------- Jaar in footer ---------------- */
  document.querySelectorAll('[data-role="year"]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Mobiel menu ---------------- */
  var toggle = document.getElementById("nav-toggle");
  var mobile = document.getElementById("mobile-menu");
  if (toggle && mobile) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
      mobile.hidden = !open;
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    mobile.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    // sluiten bij verbreden naar desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) setOpen(false);
    });
  }
})();
