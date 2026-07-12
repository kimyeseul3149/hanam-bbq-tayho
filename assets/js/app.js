/* Hanam BBQ Tây Hồ — app logic
 * i18n toggle, menu render, counter animation, scroll reveal, header scroll state.
 */
(function () {
  "use strict";

  var LANG_KEY = "hanam_lang";
  var DEFAULT_LANG = "vi";
  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var currentMenuCat = "main";

  /* ---------------- i18n ---------------- */
  function getLang() {
    var stored = localStorage.getItem(LANG_KEY);
    return (stored === "vi" || stored === "en") ? stored : DEFAULT_LANG;
  }

  function applyLang(lang) {
    var dict = (window.CONTENT && window.CONTENT[lang]) || (window.CONTENT && window.CONTENT.vi) || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.textContent = dict[k];
    });
    // Attribute translations (aria-label / title) via data-i18n-aria
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-aria");
      if (dict[k] != null) el.setAttribute("aria-label", dict[k]);
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      var on = b.getAttribute("data-lang-btn") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (window.MENU) renderMenu(lang);
  }

  /* ---------------- Menu ---------------- */
  var GROUP_TITLES = {
    pork: { vi: "Thịt heo", en: "Pork", ko: "돼지고기" },
    beef: { vi: "Bò Wagyu", en: "Wagyu Beef", ko: "소고기" },
    combo: { vi: "Set trưa", en: "Lunch Set", ko: "런치세트" },
    soju: { vi: "Rượu Soju", en: "Soju", ko: "소주" },
    beer: { vi: "Bia", en: "Beer", ko: "맥주" }
  };

  function pickLang(obj, lang) {
    return (obj && (obj[lang] || obj.vi)) || "";
  }

  function escAttr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function menuCardHTML(m, lang) {
    var name = pickLang(m.name, lang);
    var desc = pickLang(m.desc, lang);
    var price = m.price || "";
    var dict = (window.CONTENT && window.CONTENT[lang]) || {};
    var hint = dict.menu_view_details || "";
    var ariaLabel = name + (hint ? " — " + hint : "");
    var descHTML = desc
      ? '<p class="menu-desc">' + desc.replace(/\n/g, "<br>") + "</p>"
      : "";
    var priceHTML = price
      ? '<span class="menu-price">' + price + "</span>"
      : "";
    return '' +
      '<article class="menu-card reveal is-clickable" data-item-id="' + escAttr(m.id) + '"' +
        ' role="button" tabindex="0" aria-label="' + escAttr(ariaLabel) + '">' +
        '<div class="menu-thumb">' +
          '<img src="' + m.img + '" alt="' + escAttr(name) + '" loading="lazy" decoding="async" />' +
        '</div>' +
        '<div class="menu-body">' +
          '<div class="menu-head">' +
            '<h3 class="menu-name">' + name + '</h3>' +
            '<div class="menu-meta">' +
              '<span class="menu-ko" lang="ko">' + m.ko + '</span>' +
              priceHTML +
            '</div>' +
          '</div>' +
          descHTML +
        '</div>' +
      '</article>';
  }

  function groupTitleHTML(group, lang) {
    var t = GROUP_TITLES[group] || {};
    var label = pickLang(t, lang);
    return '' +
      '<div class="menu-group-title reveal">' +
        '<span class="menu-group-name">' + label + '</span>' +
        '<span class="menu-group-ko" lang="ko">' + (t.ko || "") + '</span>' +
      '</div>';
  }

  function renderCardsGrouped(items, lang) {
    var html = "";
    var last = null;
    items.forEach(function (m) {
      if (m.group && m.group !== last) {
        html += groupTitleHTML(m.group, lang);
        last = m.group;
      }
      html += menuCardHTML(m, lang);
    });
    return html;
  }

  function renderAlcohol(items, lang) {
    var dict = (window.CONTENT && window.CONTENT[lang]) || {};
    var note = dict.menu_alcohol_note || "";
    var groups = [];
    var byGroup = {};
    items.forEach(function (m) {
      if (!byGroup[m.group]) { byGroup[m.group] = []; groups.push(m.group); }
      byGroup[m.group].push(m);
    });
    var listHTML = groups.map(function (g) {
      var t = GROUP_TITLES[g] || {};
      var rows = byGroup[g].map(function (m) {
        var name = pickLang(m.name, lang);
        return '' +
          '<li class="alcohol-row">' +
            '<div class="alcohol-info">' +
              '<span class="alcohol-name">' + name + '</span>' +
              '<span class="alcohol-ko" lang="ko">' + m.ko + '</span>' +
            '</div>' +
            '<span class="alcohol-price">' + (m.price || "") + '</span>' +
          '</li>';
      }).join("");
      return '' +
        '<div class="alcohol-group reveal">' +
          '<div class="alcohol-group-title">' +
            '<span class="alcohol-group-name">' + pickLang(t, lang) + '</span>' +
            '<span class="alcohol-group-ko" lang="ko">' + (t.ko || "") + '</span>' +
          '</div>' +
          '<ul class="alcohol-items">' + rows + '</ul>' +
        '</div>';
    }).join("");
    return '' +
      (note ? '<p class="alcohol-note reveal">' + note + '</p>' : '') +
      '<div class="alcohol-list">' + listHTML + '</div>';
  }

  function renderMenu(lang) {
    var grid = document.getElementById("menu-grid");
    if (!grid || !window.MENU) return;
    var cat = currentMenuCat;
    var items = window.MENU[cat] || window.MENU.main || [];
    if (cat === "alcohol") {
      grid.className = "menu-grid menu-grid--alcohol";
      grid.innerHTML = renderAlcohol(items, lang);
    } else {
      grid.className = "menu-grid";
      grid.innerHTML = renderCardsGrouped(items, lang);
    }
    // Newly injected cards need the reveal observer.
    observeReveals(grid.querySelectorAll(".reveal"));
  }

  function setMenuCat(cat) {
    if (!window.MENU || !window.MENU[cat] || cat === currentMenuCat) return;
    currentMenuCat = cat;
    document.querySelectorAll("[data-menu-cat]").forEach(function (b) {
      var on = b.getAttribute("data-menu-cat") === cat;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    renderMenu(getLang());
  }

  function initMenuTabs() {
    document.querySelectorAll("[data-menu-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        setMenuCat(b.getAttribute("data-menu-cat"));
      });
    });
  }

  /* ---------------- Menu detail modal (lightbox) ---------------- */
  var modalEl = null;
  var lastFocusedCard = null;

  function findMenuItem(id) {
    if (!window.MENU) return null;
    var list = window.MENU[currentMenuCat] || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function openMenuModal(item, card) {
    modalEl = modalEl || document.getElementById("menu-modal");
    if (!modalEl || !item) return;
    var lang = getLang();
    var name = pickLang(item.name, lang);
    var desc = pickLang(item.desc, lang);

    var img = modalEl.querySelector("#menu-modal-img");
    var ko = modalEl.querySelector("#menu-modal-ko");
    var nameEl = modalEl.querySelector("#menu-modal-name");
    var priceEl = modalEl.querySelector("#menu-modal-price");
    var descEl = modalEl.querySelector("#menu-modal-desc");

    if (img) { img.setAttribute("src", item.img || ""); img.setAttribute("alt", name); }
    if (ko) ko.textContent = item.ko || "";
    if (nameEl) nameEl.textContent = name;
    if (priceEl) priceEl.textContent = item.price || "";
    if (descEl) {
      // Preserve line breaks (combo desc); desc is trusted data.
      descEl.innerHTML = desc ? escapeHTML(desc).replace(/\n/g, "<br>") : "";
    }

    lastFocusedCard = card || null;
    modalEl.hidden = false;
    // Force reflow so the transition runs, then mark open.
    void modalEl.offsetWidth;
    modalEl.classList.add("is-open");
    document.body.classList.add("modal-open");

    var closeBtn = modalEl.querySelector(".menu-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeMenuModal() {
    if (!modalEl || modalEl.hidden) return;
    modalEl.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    var el = modalEl;
    function hide() {
      el.hidden = true;
      el.removeEventListener("transitionend", onEnd);
    }
    function onEnd(e) {
      if (e.target === el || e.propertyName === "opacity") hide();
    }
    if (prefersReduced) {
      hide();
    } else {
      el.addEventListener("transitionend", onEnd);
      // Fallback in case transitionend doesn't fire.
      setTimeout(hide, 400);
    }
    if (lastFocusedCard && typeof lastFocusedCard.focus === "function") {
      lastFocusedCard.focus();
    }
    lastFocusedCard = null;
  }

  function escapeHTML(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function initMenuModal() {
    modalEl = document.getElementById("menu-modal");
    var grid = document.getElementById("menu-grid");
    if (!modalEl || !grid) return;

    // Event delegation on the grid: open modal from photo cards only.
    grid.addEventListener("click", function (e) {
      var card = e.target.closest ? e.target.closest(".menu-card[data-item-id]") : null;
      if (!card) return;
      var item = findMenuItem(card.getAttribute("data-item-id"));
      if (item) openMenuModal(item, card);
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      var card = e.target.closest ? e.target.closest(".menu-card[data-item-id]") : null;
      if (!card) return;
      e.preventDefault();
      var item = findMenuItem(card.getAttribute("data-item-id"));
      if (item) openMenuModal(item, card);
    });

    // Close via × button and overlay backdrop.
    modalEl.querySelectorAll("[data-modal-close]").forEach(function (b) {
      b.addEventListener("click", closeMenuModal);
    });

    // ESC to close.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modalEl.hidden) closeMenuModal();
    });
  }

  /* ---------------- Counters ---------------- */
  function animateCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;

    function formatVal(v, dec) {
      return dec > 0 ? v.toFixed(dec) : Math.floor(v).toLocaleString("en-US");
    }

    function run(el) {
      var raw = el.getAttribute("data-count");
      var target = parseFloat(raw);
      var suffix = el.getAttribute("data-suffix") || "";
      var dot = raw.indexOf(".");
      var dec = dot > -1 ? (raw.length - dot - 1) : 0;
      if (prefersReduced) {
        el.textContent = formatVal(target, dec) + suffix;
        return;
      }
      var dur = 1400, t0 = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = formatVal(target * eased, dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = formatVal(target, dec) + suffix;
      }
      requestAnimationFrame(tick);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealObserver = null;
  function observeReveals(nodeList) {
    if (prefersReduced) {
      nodeList.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("in-view");
          revealObserver.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    nodeList.forEach(function (el) { revealObserver.observe(el); });
  }

  function initReveals() {
    observeReveals(document.querySelectorAll(".reveal"));
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    function close() {
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      document.body.classList.toggle("nav-open", !open);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- Language buttons ---------------- */
  function initLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () {
        applyLang(b.getAttribute("data-lang-btn"));
      });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initLangButtons();
    initMobileNav();
    initHeader();
    initMenuTabs();
    initMenuModal();
    applyLang(getLang()); // renders menu + sets language
    animateCounters();
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Expose per plan interface
  window.getLang = getLang;
  window.applyLang = applyLang;
  window.renderMenu = renderMenu;
  window.setMenuCat = setMenuCat;
  window.animateCounters = animateCounters;
})();
