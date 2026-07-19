/* Hanam BBQ Tây Hồ — app logic
 * i18n toggle, menu render, hero slideshow, scroll reveal, header scroll state.
 */
(function () {
  "use strict";

  var LANG_KEY = "hanam_lang";
  var DEFAULT_LANG = "vi";
  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var currentMenuCat = "popular";

  /* ---------------- Analytics (Amplitude taxonomy) ----------------
   * See docs/analytics/amplitude-taxonomy.md.
   * track() attaches common props (language, device_type) to every event.
   */
  function deviceType() {
    return (window.innerWidth <= 900) ? "mobile" : "desktop";
  }
  function track(name, props) {
    if (typeof window.HanamTrack !== "function") return;
    var base = { language: getLang(), device_type: deviceType() };
    if (props) {
      for (var k in props) {
        if (Object.prototype.hasOwnProperty.call(props, k)) base[k] = props[k];
      }
    }
    window.HanamTrack(name, base);
  }
  function priceToNumber(p) {
    if (!p) return null;
    var digits = String(p).replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : null;
  }

  /* ---------------- i18n ---------------- */
  /* Session-scoped, not localStorage: the audience is Vietnamese, and a
     single EN toggle used to stick forever, so anyone who once peeked at the
     English copy was greeted in English on every later visit. The choice now
     holds while the tab is open and every fresh visit opens in Vietnamese.
     The old localStorage key is cleared on load, or visitors who toggled EN
     under the previous build would keep landing in English forever. */
  function readStoredLang() {
    try {
      var s = sessionStorage.getItem(LANG_KEY);
      if (s === "vi" || s === "en") return s;
    } catch (e) {}
    return null;
  }

  function getLang() {
    return readStoredLang() || DEFAULT_LANG;
  }

  function dropLegacyLang() {
    try { localStorage.removeItem(LANG_KEY); } catch (e) {}
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
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-alt");
      if (dict[k] != null) el.setAttribute("alt", dict[k]);
    });
    document.documentElement.lang = lang;
    // The Google Maps embed localises its own labels from `hl`, so it has to be
    // re-pointed on every switch or the map stays Vietnamese under English.
    var mapFrame = document.getElementById("map-embed-frame");
    if (mapFrame) {
      var wanted = mapFrame.src.replace(/([?&]hl=)[^&]*/, "$1" + lang);
      if (wanted !== mapFrame.src) mapFrame.src = wanted;
    }
    try { sessionStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      var on = b.getAttribute("data-lang-btn") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (window.MENU) renderMenu(lang);
  }

  /* ---------------- Menu ---------------- */
  var GROUP_TITLES = {
    /* `short` is the jump-chip label. Four chips split the phone width evenly,
       which leaves ~67px of text — "Set Combo" ellipsised to "Set Com…" there.
       Only groups whose full title overruns need one. */
    combo: { vi: "Set Combo", en: "Combo", ko: "콤보", short: { vi: "Combo", en: "Combo" } },
    pork: { vi: "Thịt heo", en: "Pork", ko: "돼지고기" },
    beef: { vi: "Thịt bò", en: "Beef", ko: "소고기" },
    lunch: { vi: "Set trưa", en: "Lunch Set", ko: "런치세트" },
    soju: { vi: "Rượu Soju", en: "Soju", ko: "소주" },
    beer: { vi: "Bia", en: "Beer", ko: "맥주" },
    trad: { vi: "Rượu truyền thống", en: "Korean Liqueur", ko: "전통주" }
  };

  /* Groups rendered as one hero photo + a priced list, not a card each.
     The beef board's cuts are too low-res to survive a card crop. */
  var BANNER_GROUPS = { beef: "assets/img/menu/beef-hero.jpg" };
  /* Groups rendered as a priced list with no photos at all. */
  var LIST_GROUPS = { lunch: true };

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
    var price = m.price || "";
    var dict = (window.CONTENT && window.CONTENT[lang]) || {};
    var hint = dict.menu_view_details || "";
    var ariaLabel = name + (hint ? " — " + hint : "");
    // The description belongs to the detail modal only — the grid stays scannable.
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
        '</div>' +
      '</article>';
  }

  function groupId(group) { return "menu-group-" + group; }

  function groupTitleHTML(group, lang) {
    var t = GROUP_TITLES[group] || {};
    var label = pickLang(t, lang);
    return '' +
      '<div class="menu-group-title reveal" id="' + escAttr(groupId(group)) + '">' +
        '<span class="menu-group-name">' + label + '</span>' +
        '<span class="menu-group-ko" lang="ko">' + (t.ko || "") + '</span>' +
      '</div>';
  }

  /* Main carries 25 items across four groups, so it gets a jump bar. Built
     from whatever titled groups the category actually renders — add a group
     to menu.js and its chip appears on its own. Anchors, not buttons: the
     html{scroll-padding-top} rule already clears the fixed header. */
  function subnavHTML(items, lang) {
    var order = [], seen = {};
    items.forEach(function (m) {
      var g = m.group;
      if (g && GROUP_TITLES[g] && !seen[g]) { seen[g] = 1; order.push(g); }
    });
    if (order.length < 2) return "";
    return order.map(function (g) {
      var t = GROUP_TITLES[g];
      return '<a class="menu-jump" href="#' + escAttr(groupId(g)) + '"' +
        ' data-jump-group="' + escAttr(g) + '">' +
        pickLang(t.short || t, lang) +
      '</a>';
    }).join("");
  }

  /* A priced row: name + Korean label on the left, price on the right. */
  function menuRowHTML(m, lang) {
    var name = pickLang(m.name, lang);
    var dict = (window.CONTENT && window.CONTENT[lang]) || {};
    var hint = dict.menu_view_details || "";
    var clickable = !!(m.desc && pickLang(m.desc, lang));
    return '' +
      '<li class="menu-row' + (clickable ? ' is-clickable' : '') + '"' +
        (clickable
          ? ' data-item-id="' + escAttr(m.id) + '" role="button" tabindex="0"' +
            ' aria-label="' + escAttr(name + (hint ? " — " + hint : "")) + '"'
          : '') + '>' +
        '<span class="menu-row-info">' +
          '<span class="menu-row-name">' + name + '</span>' +
          '<span class="menu-row-ko" lang="ko">' + m.ko + '</span>' +
        '</span>' +
        '<span class="menu-row-price">' + (m.price || "") + '</span>' +
      '</li>';
  }

  function renderCardsGrouped(items, lang) {
    // Bucket by group so a whole group can pick its own layout.
    var order = [], byGroup = {};
    items.forEach(function (m) {
      var g = m.group || "_";
      if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
      byGroup[g].push(m);
    });

    return order.map(function (g) {
      var list = byGroup[g];
      // Popular is a flat list — only groups with a title get a heading.
      var head = GROUP_TITLES[g] ? groupTitleHTML(g, lang) : "";

      if (BANNER_GROUPS[g]) {
        return head +
          '<figure class="menu-banner reveal">' +
            '<img src="' + BANNER_GROUPS[g] + '" alt="" loading="lazy" decoding="async" />' +
          '</figure>' +
          '<ul class="menu-rows reveal">' +
            list.map(function (m) { return menuRowHTML(m, lang); }).join("") +
          '</ul>';
      }
      if (LIST_GROUPS[g]) {
        return head +
          '<ul class="menu-rows reveal">' +
            list.map(function (m) { return menuRowHTML(m, lang); }).join("") +
          '</ul>';
      }
      return head + list.map(function (m) { return menuCardHTML(m, lang); }).join("");
    }).join("");
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
    // Corkage is a house rule, not a product — it sits under the drink list.
    var corkageHTML = dict.menu_corkage_title
      ? '<div class="corkage reveal">' +
          '<span class="corkage-title">' + dict.menu_corkage_title + '</span>' +
          '<ul class="corkage-list">' +
            '<li><span>' + dict.menu_corkage_wine + '</span>' +
                '<span class="corkage-price">' + dict.menu_corkage_wine_price + '</span></li>' +
            '<li><span>' + dict.menu_corkage_spirit + '</span>' +
                '<span class="corkage-price">' + dict.menu_corkage_spirit_price + '</span></li>' +
          '</ul>' +
        '</div>'
      : '';

    return '' +
      (note ? '<p class="alcohol-note reveal">' + note + '</p>' : '') +
      '<div class="alcohol-list">' + listHTML + '</div>' +
      corkageHTML;
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
    // Alcohol builds its own headings, so it has no jump targets to point at.
    var subnav = document.getElementById("menu-subnav");
    if (subnav) {
      subnav.innerHTML = cat === "alcohol" ? "" : subnavHTML(items, lang);
      subnav.hidden = !subnav.innerHTML;
      syncJumpActive();
    }
    // Newly injected cards need the reveal observer.
    observeReveals(grid.querySelectorAll(".reveal"));
  }

  /* Mark the group you are currently reading. The heading that most recently
     passed under the sticky bar wins; before the first one, the first chip
     stays lit so the bar is never blank. */
  function syncJumpActive() {
    var subnav = document.getElementById("menu-subnav");
    if (!subnav || subnav.hidden) return;
    var chips = subnav.querySelectorAll(".menu-jump");
    if (!chips.length) return;
    // Measure the bar rather than hard-coding a line: a jump leaves the
    // heading just below it, and a fixed threshold missed that by ~50px,
    // leaving the previous chip lit at the destination.
    var line = subnav.getBoundingClientRect().bottom + 90;
    var active = chips[0].getAttribute("data-jump-group");
    for (var i = 0; i < chips.length; i++) {
      var g = chips[i].getAttribute("data-jump-group");
      var el = document.getElementById(groupId(g));
      if (el && el.getBoundingClientRect().top <= line) active = g;
    }
    for (var j = 0; j < chips.length; j++) {
      var on = chips[j].getAttribute("data-jump-group") === active;
      chips[j].classList.toggle("is-active", on);
      chips[j].setAttribute("aria-current", on ? "true" : "false");
    }
  }

  function initMenuSubnav() {
    var subnav = document.getElementById("menu-subnav");
    if (!subnav) return;
    subnav.addEventListener("click", function (e) {
      var chip = e.target.closest ? e.target.closest(".menu-jump") : null;
      if (chip) track("Menu Group Jumped", { menu_group: chip.getAttribute("data-jump-group") });
    });
    var queued = false;
    window.addEventListener("scroll", function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; syncJumpActive(); });
    }, { passive: true });
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
        var cat = b.getAttribute("data-menu-cat");
        var changed = cat !== currentMenuCat;
        setMenuCat(cat);
        if (changed) track("Menu Tab Switched", { menu_tab: cat });
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

    // Beef cuts and lunch sets carry no photo — hide the figure rather than
    // leaving an empty frame.
    var figure = modalEl.querySelector(".menu-modal__figure");
    if (item.img) {
      if (img) { img.setAttribute("src", item.img); img.setAttribute("alt", name); }
      if (figure) figure.hidden = false;
    } else {
      if (img) { img.removeAttribute("src"); img.setAttribute("alt", ""); }
      if (figure) figure.hidden = true;
    }
    if (ko) ko.textContent = item.ko || "";
    if (nameEl) nameEl.textContent = name;
    if (priceEl) priceEl.textContent = item.price || "";
    if (descEl) {
      // Preserve line breaks (combo desc); desc is trusted data.
      descEl.innerHTML = desc ? escapeHTML(desc).replace(/\n/g, "<br>") : "";
    }

    track("Menu Item Viewed", {
      item_id: item.id,
      item_name_ko: item.ko,
      item_category: item.group || currentMenuCat,
      item_price_vnd: priceToNumber(item.price),
      menu_tab: currentMenuCat
    });

    lastFocusedCard = card || null;
    modalEl.hidden = false;
    // Force reflow so the transition runs, then mark open.
    void modalEl.offsetWidth;
    modalEl.classList.add("is-open");
    document.body.classList.add("modal-open");

    var closeBtn = modalEl.querySelector(".menu-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeMenuModal(method) {
    if (!modalEl || modalEl.hidden) return;
    track("Menu Modal Closed", {
      item_id: (lastFocusedCard && lastFocusedCard.getAttribute)
        ? lastFocusedCard.getAttribute("data-item-id") : null,
      close_method: method || "unknown"
    });
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
      var card = e.target.closest ? e.target.closest(".menu-card[data-item-id], .menu-row[data-item-id]") : null;
      if (!card) return;
      var item = findMenuItem(card.getAttribute("data-item-id"));
      if (item) openMenuModal(item, card);
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      var card = e.target.closest ? e.target.closest(".menu-card[data-item-id], .menu-row[data-item-id]") : null;
      if (!card) return;
      e.preventDefault();
      var item = findMenuItem(card.getAttribute("data-item-id"));
      if (item) openMenuModal(item, card);
    });

    // Close via × button and overlay backdrop.
    modalEl.querySelectorAll("[data-modal-close]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        var t = e.currentTarget;
        var method = (t.classList && t.classList.contains("menu-modal__overlay"))
          ? "overlay" : "close_button";
        closeMenuModal(method);
      });
    });

    // ESC to close.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modalEl.hidden) closeMenuModal("escape");
    });
  }

  /* ---------------- Privacy policy modal (Decree 13 notice) ----------------
   * Opened by any [data-privacy-open] trigger (footer link + consent lines).
   * Mirrors the menu modal's open/close mechanics.
   */
  function initPrivacyModal() {
    var el = document.getElementById("privacy-modal");
    if (!el) return;
    var lastFocused = null;

    function open(trigger) {
      lastFocused = trigger || null;
      el.hidden = false;
      void el.offsetWidth;
      el.classList.add("is-open");
      document.body.classList.add("modal-open");
      var closeBtn = el.querySelector(".privacy-modal__close");
      if (closeBtn) closeBtn.focus();
      track("Privacy Policy Viewed", {
        source: trigger ? (trigger.getAttribute("data-evt-loc") || "consent_or_footer") : "unknown"
      });
    }

    function close() {
      if (el.hidden) return;
      el.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      function hide() {
        el.hidden = true;
        el.removeEventListener("transitionend", onEnd);
      }
      function onEnd(e) {
        if (e.target === el || e.propertyName === "opacity") hide();
      }
      if (prefersReduced) { hide(); }
      else {
        el.addEventListener("transitionend", onEnd);
        setTimeout(hide, 400);
      }
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      lastFocused = null;
    }

    document.querySelectorAll("[data-privacy-open]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        open(e.currentTarget);
      });
    });
    el.querySelectorAll("[data-modal-close]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.hidden) close();
    });
  }

  /* ---------------- Hero slideshow ----------------
   * Slide 1 ships its image via CSS (LCP); slides 2..n carry data-bg and are
   * fetched after load so they never compete with the first paint.
   */
  function initHeroSlides() {
    var slides = document.querySelectorAll(".hero-slide");
    var dots = document.querySelectorAll(".hero-dot");
    if (slides.length < 2) return;

    var idx = 0;
    var timer = null;
    var INTERVAL = 3000;  // pairs with the .7s cross-fade in styles.css

    function loadBg(el) {
      var src = el.getAttribute("data-bg");
      if (!src) return;
      el.style.backgroundImage = 'url("' + src + '")';
      el.removeAttribute("data-bg");
    }

    function show(next) {
      if (next === idx) return;
      loadBg(slides[next]);
      slides[idx].classList.remove("is-active");
      slides[next].classList.add("is-active");
      if (dots.length) {
        dots[idx].classList.remove("is-active");
        dots[idx].removeAttribute("aria-current");
        dots[next].classList.add("is-active");
        dots[next].setAttribute("aria-current", "true");
      }
      idx = next;
      // Warm the following slide so its fade-in is never a blank frame.
      loadBg(slides[(next + 1) % slides.length]);
    }

    function start() {
      if (prefersReduced || timer) return;
      timer = setInterval(function () { show((idx + 1) % slides.length); }, INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        stop();
        show(i);
        start();
      });
    });

    // Don't animate offscreen, and don't fight the user while they read.
    var hero = document.querySelector(".hero");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.15 }).observe(hero);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    if (prefersReduced) return;
    if (document.readyState === "complete") loadBg(slides[1]);
    else window.addEventListener("load", function () { loadBg(slides[1]); });
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
    observeReveals(document.querySelectorAll(".reveal, .reveal-up, .reveal-side"));
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    /* --header-h was a hand-guessed 76px while the real header is ~133px and
       shrinks on scroll. The menu jump bar sticks to it, so a stale value
       parked the bar underneath the header — publish the measured height
       instead, after the class flip so we measure the state we just set. */
    function syncHeight() {
      var h = Math.round(header.getBoundingClientRect().height);
      if (h) document.documentElement.style.setProperty("--header-h", h + "px");
    }
    var wasScrolled = null;
    function onScroll() {
      var scrolled = window.scrollY > 24;
      header.classList.toggle("is-scrolled", scrolled);
      syncHeight();
      // The brand shrinks over .45s, so the height right after the flip is
      // mid-transition. Re-measure once it has settled.
      if (scrolled !== wasScrolled) {
        wasScrolled = scrolled;
        setTimeout(syncHeight, 500);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncHeight);
    // The wordmark's webfont lands after first paint and changes the height.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeight);
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
        var to = b.getAttribute("data-lang-btn");
        var from = getLang();
        applyLang(to);
        if (to !== from) {
          track("Language Switched", { from_language: from, to_language: to });
          if (typeof window.HanamSetUser === "function") {
            window.HanamSetUser("preferred_language", to);
          }
        }
      });
    });
  }

  /* ---------------- Navigation + CTA click tracking ---------------- */
  function initNavTracking() {
    var nav = document.getElementById("primary-nav");
    if (!nav) return;
    var MAP = { "#story": "story", "#why": "why_hanam", "#menu": "menu", "#visit": "visit" };
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        var href = a.getAttribute("href") || "";
        var toggle = document.querySelector(".nav-toggle");
        var isMobile = toggle && getComputedStyle(toggle).display !== "none";
        track("Navigation Clicked", {
          nav_item: MAP[href] || href.replace("#", ""),
          nav_location: isMobile ? "mobile_overlay" : "header"
        });
      });
    });
  }

  function initCtaTracking() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest ? e.target.closest("[data-evt-cta]") : null;
      if (!el) return;
      track("CTA Clicked", {
        cta_type: el.getAttribute("data-evt-cta"),
        cta_location: el.getAttribute("data-evt-loc") || null,
        destination: el.getAttribute("data-evt-dest") || null
      });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    dropLegacyLang();
    initLangButtons();
    initNavTracking();
    initCtaTracking();
    initMobileNav();
    initHeader();
    initMenuTabs();
    initMenuSubnav();
    initMenuModal();
    initPrivacyModal();
    applyLang(getLang()); // renders menu + sets language
    initHeroSlides();
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
})();
