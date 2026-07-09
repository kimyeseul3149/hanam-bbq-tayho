/* Hanam BBQ Tây Hồ — app logic
 * i18n toggle, menu render, counter animation, scroll reveal, header scroll state.
 */
(function () {
  "use strict";

  var LANG_KEY = "hanam_lang";
  var DEFAULT_LANG = "vi";
  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  function renderMenu(lang) {
    var grid = document.getElementById("menu-grid");
    if (!grid || !window.MENU) return;
    grid.innerHTML = window.MENU.map(function (m) {
      var name = (m.name && (m.name[lang] || m.name.vi)) || "";
      var desc = (m.desc && (m.desc[lang] || m.desc.vi)) || "";
      return '' +
        '<article class="menu-card reveal">' +
          '<div class="menu-thumb">' +
            '<img src="' + m.img + '" alt="' + name + '" loading="lazy" decoding="async" />' +
          '</div>' +
          '<div class="menu-body">' +
            '<div class="menu-head">' +
              '<h3 class="menu-name">' + name + '</h3>' +
              '<span class="menu-ko" lang="ko">' + m.ko + '</span>' +
            '</div>' +
            (desc ? '<p class="menu-desc">' + desc + '</p>' : '') +
          '</div>' +
        '</article>';
    }).join("");
    // Newly injected cards need the reveal observer.
    observeReveals(grid.querySelectorAll(".reveal"));
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
  window.animateCounters = animateCounters;
})();
