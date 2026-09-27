// Hero CTA switcher, driven entirely by config.js (window.MODA_LANDING_CONFIG).
//
// The static markup in index.html (#hero-actions) is the waitlist-primary
// state — that is what a client with no JS, or a plain curl of the page,
// sees. This script only REPLACES that markup, and only once a real
// TestFlight link or the LAUNCHED flag is set. If CTA_URL is not a real
// https URL, this script is a no-op and the static waitlist CTA stands.
(function () {
  "use strict";

  var config = window.MODA_LANDING_CONFIG || {};
  var CTA_URL = config.CTA_URL;
  var LAUNCHED = Boolean(config.LAUNCHED);
  var APP_STORE_URL = config.APP_STORE_URL;

  var POSTHOG_KEY = "phc_tqddBU4NQjQchPw4nFB4NXaMXUBdZQdr7catwjqUBc83";
  var POSTHOG_HOST = "https://us.i.posthog.com";

  function isValidHttpsUrl(value) {
    return typeof value === "string" && /^https:\/\/\S+$/.test(value);
  }

  function anonId() {
    var key = "moda_landing_distinct_id";
    try {
      var existing = window.localStorage.getItem(key);
      if (existing) return existing;
      var id =
        "landing-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
      window.localStorage.setItem(key, id);
      return id;
    } catch (e) {
      return "landing-anonymous";
    }
  }

  function track(event) {
    try {
      fetch(POSTHOG_HOST + "/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_KEY,
          event: event,
          distinct_id: anonId(),
          properties: {
            $lib: "moda-landing-static",
            $current_url: window.location.href,
            $ip: "0.0.0.0",
            $geoip_disable: true,
          },
          timestamp: new Date().toISOString(),
        }),
      }).catch(function () {
        // Analytics is best-effort — never surface a failure to the visitor.
      });
    } catch (e) {
      // Never let analytics throw into the page.
    }
  }

  var downloadLink = document.getElementById("download-appstore-cta");
  if (downloadLink) {
    downloadLink.addEventListener("click", function () {
      track("cta_appstore_click");
    });
  }

  var actions = document.getElementById("hero-actions");
  if (!actions) return;

  if (LAUNCHED && isValidHttpsUrl(APP_STORE_URL)) {
    actions.innerHTML =
      '<a class="primary-cta" id="hero-appstore-cta" href="' +
      APP_STORE_URL +
      '" target="_blank" rel="noopener">Get it on the App Store <span>→</span></a>' +
      '<div class="micro">Available now on iPhone.</div>';
    var appStoreLink = document.getElementById("hero-appstore-cta");
    if (appStoreLink) {
      appStoreLink.addEventListener("click", function () {
        track("cta_appstore_click");
      });
    }
    return;
  }

  if (isValidHttpsUrl(CTA_URL)) {
    actions.innerHTML =
      '<a class="primary-cta" id="hero-testflight-cta" href="' +
      CTA_URL +
      '" target="_blank" rel="noopener">Get early access on TestFlight <span>→</span></a>' +
      '<a class="hero-secondary-cta" href="#waitlist">or get notified at launch</a>';
    var tfLink = document.getElementById("hero-testflight-cta");
    if (tfLink) {
      tfLink.addEventListener("click", function () {
        track("cta_testflight_click");
      });
    }
  }
  // else: CTA_URL is the placeholder — leave the static waitlist-primary
  // markup exactly as shipped. No dead link, ever.
})();
