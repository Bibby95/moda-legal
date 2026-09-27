// Moda landing-page config — single source of truth for the hero CTA state.
// Static site, no build step: this file is the config a follow-up task edits
// by hand and republishes.
//
// CTA_URL: the public TestFlight link. MUST stay null until
// atelier-testflight-public-link-2026-09-18 delivers a real one — a visible
// dead link is worse than no button. While null, hero-cta.js leaves the
// static waitlist-primary markup untouched (see index.html #hero-actions).
//
// LAUNCHED: flip to true once Moda ships on the App Store. Switches the hero
// to the App Store badge and retires the TestFlight/waitlist CTAs.
window.MODA_LANDING_CONFIG = {
  CTA_URL: null,
  LAUNCHED: true,
  APP_STORE_URL: "https://apps.apple.com/app/id6780327914",
};
