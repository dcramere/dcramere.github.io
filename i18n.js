/*
 * Minimal NL/EN switcher. Each page defines window.I18N = { nl: {...}, en: {...} }
 * (see i18n-index.js / i18n-join.js) before loading this file.
 *
 *   data-i18n="key"        → element innerHTML
 *   data-i18n-aria="key"   → aria-label
 *   dict.title / dict.desc → <title> / <meta name="description">
 *
 * Language order: ?lang=xx → saved choice → DEFAULT. The static HTML holds the
 * DEFAULT language, so no-JS visitors and the first paint match it.
 */
(function () {
  var KEY = "dc_lang";
  var DEFAULT = "nl";
  var SUPPORTED = ["nl", "en"];
  var dict = window.I18N || {};

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage blocked — still switch for this view */ }
  }

  function initial() {
    var q = new URLSearchParams(location.search).get("lang");
    if (SUPPORTED.indexOf(q) > -1) { save(q); return q; }
    var saved = read();
    return SUPPORTED.indexOf(saved) > -1 ? saved : DEFAULT;
  }

  function apply(lang) {
    var d = dict[lang] || {};
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = d[el.getAttribute("data-i18n")];
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = d[el.getAttribute("data-i18n-aria")];
      if (v !== undefined) el.setAttribute("aria-label", v);
    });

    if (d.title) document.title = d.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && d.desc) meta.setAttribute("content", d.desc);

    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    document.dispatchEvent(new CustomEvent("dc:langchange", { detail: { lang: lang } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-switch [data-lang]");
    if (!b) return;
    var lang = b.getAttribute("data-lang");
    if (SUPPORTED.indexOf(lang) === -1) return;
    save(lang);
    apply(lang);
  });

  apply(initial());
})();
