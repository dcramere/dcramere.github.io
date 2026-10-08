(function () {
  var GA_ID = "G-DCE7YZDQTT";
  var CONSENT_KEY = "dcramere_analytics_consent";

  function copy() {
    return document.documentElement.lang === "nl"
      ? { text: "Deze site gebruikt analytics-cookies om te begrijpen hoe bezoekers de pagina gebruiken.", accept: "Accepteren", decline: "Weigeren" }
      : { text: "This site uses analytics cookies to understand how visitors use the page.", accept: "Accept", decline: "Decline" };
  }

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  window.dcTrack = function (name, params) {
    if (localStorage.getItem(CONSENT_KEY) === "granted") {
      if (!window.__gaLoaded) loadGA();
      if (window.gtag) window.gtag("event", name, params || {});
    }
  };

  function showBanner() {
    var bar = document.createElement("div");
    bar.className = "cookie-banner";
    bar.innerHTML =
      "<p></p>" +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-decline"></button>' +
      '<button type="button" class="cookie-accept"></button>' +
      "</div>";
    function label() {
      var c = copy();
      bar.querySelector("p").textContent = c.text;
      bar.querySelector(".cookie-accept").textContent = c.accept;
      bar.querySelector(".cookie-decline").textContent = c.decline;
    }
    label();
    document.addEventListener("dc:langchange", label);
    document.body.appendChild(bar);
    bar.querySelector(".cookie-accept").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "granted");
      loadGA();
      document.removeEventListener("dc:langchange", label);
      bar.remove();
    });
    bar.querySelector(".cookie-decline").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "denied");
      document.removeEventListener("dc:langchange", label);
      bar.remove();
    });
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) window.dcTrack(el.getAttribute("data-track"));
  });

  var consent = localStorage.getItem(CONSENT_KEY);
  if (consent === "granted") {
    loadGA();
  } else if (consent === null) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }
})();
