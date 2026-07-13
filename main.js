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

  function priceHtml(item) {
    if (item.soldout) {
      return '<span class="mitem__soldout">Tijdelijk uitverkocht</span>';
    }
    var from = item.from ? '<span class="from">vanaf</span>' : "";
    return '<span class="mitem__price">' + from + euro(item.price) + "</span>";
  }

  function itemHtml(item) {
    var cls = "mitem" + (item.soldout ? " mitem--soldout" : "");
    var desc = item.desc ? '<span class="mitem__desc">' + esc(item.desc) + "</span>" : "";
    return (
      '<li class="' + cls + '">' +
        '<span class="mitem__name">' + esc(item.name) + "</span>" +
        priceHtml(item) +
        desc +
      "</li>"
    );
  }

  function cardHtml(cat) {
    return (
      '<article class="mcard" id="cat-' + cat.id + '" data-cat="' + cat.id + '">' +
        '<header class="mcard__head">' +
          '<h3 class="mcard__title">' + esc(cat.title) + "</h3>" +
          (cat.tag ? '<span class="mcard__tag">' + esc(cat.tag) + "</span>" : "") +
        "</header>" +
        (cat.blurb ? '<p class="mcard__blurb">' + esc(cat.blurb) + "</p>" : "") +
        '<ul class="mlist">' + cat.items.map(itemHtml).join("") + "</ul>" +
      "</article>"
    );
  }

  if (grid) {
    grid.innerHTML = data.map(cardHtml).join("");
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
  var ORDER = [1, 2, 3, 4, 5, 6, 0]; // ma → zo

  function computeStatus(now) {
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
    // volgende opening zoeken (max 7 dagen vooruit)
    for (var i = 0; i < 8; i++) {
      var d = (day + i) % 7;
      var h = HOURS[d];
      if (!h) continue;
      if (i === 0 && mins < h.open) {
        return { open: false, text: "Gesloten · opent om " + fmt(h.open) };
      }
      if (i > 0) {
        var when = i === 1 ? "morgen" : DAY_NL[d];
        return { open: false, text: "Gesloten · opent " + when + " om " + fmt(h.open) };
      }
    }
    return { open: false, text: "Gesloten" };
  }

  function fmt(m) {
    var hh = Math.floor(m / 60);
    var mm = m % 60;
    return hh + ":" + (mm < 10 ? "0" + mm : mm);
  }

  function paintStatus() {
    var now = new Date();
    var st = computeStatus(now);
    document.querySelectorAll('[data-role="status"]').forEach(function (el) {
      el.classList.toggle("is-open", st.open);
      el.classList.toggle("is-closed", !st.open);
      var txt = el.querySelector(".status__text");
      if (txt) txt.textContent = st.text;
    });
    // "vandaag" in de hero
    var today = HOURS[now.getDay()];
    document.querySelectorAll('[data-role="today-hours"]').forEach(function (el) {
      el.textContent = today ? today.label : "Gesloten";
    });
  }

  function buildHours() {
    var todayDay = new Date().getDay();
    document.querySelectorAll('[data-role="hours"] tbody').forEach(function (tbody) {
      tbody.innerHTML = ORDER.map(function (d) {
        var h = HOURS[d];
        var cls = d === todayDay ? ' class="is-today"' : "";
        return "<tr" + cls + "><td>" + DAY_NL[d] + "</td><td>" +
               (h ? h.label : "Gesloten") + "</td></tr>";
      }).join("");
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
