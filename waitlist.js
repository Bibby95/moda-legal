// Moda pre-launch waitlist capture + page analytics.
//
// Client-side only, no build step — this page is served as-is from GitHub
// Pages. Both keys below are public-by-design: the Supabase key is the anon
// key (insert-only via RLS on the `waitlist` table, see
// supabase/migrations/037_waitlist.sql in Bibby95/Moda-App — no select,
// update, or delete is grantable to it), and the PostHog key is a project
// API key meant to be shipped client-side, same as the RN app's
// EXPO_PUBLIC_POSTHOG_KEY (utils/analytics.ts).
(function () {
  "use strict";

  var SUPABASE_URL = "https://pzporgvrezjmqtjezadk.supabase.co";
  var SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cG9yZ3ZyZXpqbXF0amV6YWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDE0NDksImV4cCI6MjA4NjY3NzQ0OX0.nmmKQuQ8HozG514BeMDIrPcKs_W2rluL-UmR7fgdC_c";
  var POSTHOG_KEY = "phc_tqddBU4NQjQchPw4nFB4NXaMXUBdZQdr7catwjqUBc83";
  var POSTHOG_HOST = "https://us.i.posthog.com";

  // One anonymous id per browser, stitched across the pageview + signup
  // events for this visit. Not tied to any Moda account.
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

  function track(event, properties) {
    try {
      fetch(POSTHOG_HOST + "/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_KEY,
          event: event,
          distinct_id: anonId(),
          properties: Object.assign({}, properties, {
            $lib: "moda-landing-static",
            $current_url: window.location.href,
            // No IP/city collection — same convention as the app-side fix
            // (utils/analytics.ts): $ip is overridden to a non-routable
            // address and $geoip_disable suppresses enrichment.
            $ip: "0.0.0.0",
            $geoip_disable: true,
          }),
          timestamp: new Date().toISOString(),
        }),
      }).catch(function () {
        // Analytics is best-effort — never surface a failure to the visitor.
      });
    } catch (e) {
      // Never let analytics throw into the page.
    }
  }

  track("landing_pageview");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var form = document.getElementById("waitlist-form");
  var input = document.getElementById("waitlist-email");
  var button = document.getElementById("waitlist-submit");
  var status = document.getElementById("waitlist-status");

  function setState(state, message) {
    status.textContent = message || "";
    status.className = "status status-" + state;
    button.disabled = state === "submitting";
    button.textContent = state === "submitting" ? "Joining…" : "Join the waitlist";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = input.value.trim();

    if (!EMAIL_RE.test(email)) {
      setState("error", "That doesn't look like an email address.");
      return;
    }

    setState("submitting", "");

    fetch(SUPABASE_URL + "/rest/v1/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email: email }),
    })
      .then(function (response) {
        if (response.status === 201) {
          setState("success", "You're on the list. We'll email you once.");
          track("landing_waitlist_signup");
          form.reset();
          return;
        }
        if (response.status === 409) {
          setState("success", "You're already on the list.");
          return;
        }
        setState("error", "Couldn't save that address — check it and try again.");
      })
      .catch(function () {
        setState("error", "Couldn't save that address — check it and try again.");
      });
  });
})();
