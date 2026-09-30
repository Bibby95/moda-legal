/*
 * Moda landing — motion layer
 * Built on motion.dev (MIT, https://motion.dev), pinned to 13.4.6.
 *
 * Rules this file must never break:
 *   1. prefers-reduced-motion: reduce  -> no animation runs at all, everything visible.
 *   2. No cumulative layout shift. Only opacity / transform / text content animate.
 *   3. The App Store CTA is the loudest thing on the page. Motion supports it, never competes.
 *   4. The library is vendored, not loaded from a CDN — this page is the CTA target for
 *      every campaign link and must not depend on a third party being up. See vendor/README.md.
 *      index.html still carries a failsafe for the case where this module throws.
 */

import { animate, inView, stagger, scroll } from "./vendor/motion-13.4.6.esm.js";

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Mark everything visible and stop. Used for reduced-motion and as the failure path. */
function revealAllStatic() {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  document.documentElement.classList.add("motion-ready");
}

if (REDUCED) {
  revealAllStatic();
} else {
  start();
}

function start() {
  // Hand control of .reveal to JS. The CSS keeps opacity:0 until we say otherwise,
  // and the failsafe timer in index.html will force-reveal if this file never runs.
  document.documentElement.classList.add("motion-ready");

  const EASE_OUT = [0.16, 1, 0.3, 1];

  /**
   * Motion cannot spring a transform *string* to the keyword `none` — it reads as a
   * zero matrix and the element collapses. So every transform animation here ends on an
   * explicit value, and any rotation the stylesheet authored is read back and carried
   * through so the composition survives.
   */
  function restingTransform(el) {
    const t = getComputedStyle(el).transform;
    if (!t || t === "none") return { rotate: 0, rest: "translateY(0px) scale(1)" };
    const m = new DOMMatrixReadOnly(t);
    const rotate = Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI * 100) / 100;
    return { rotate, rest: `translateY(0px) scale(1) rotate(${rotate}deg)` };
  }

  /* ---------------------------------------------------------------
   * 1. Hero — staggered entrance, runs immediately on load.
   * ------------------------------------------------------------- */
  const heroText = document.querySelector(".hero-text");
  const heroArt = document.querySelector(".hero-art");

  if (heroText) {
    heroText.classList.add("visible");
    const lines = heroText.querySelectorAll(
      ".eyebrow, h1, .hero-copy, .hero-actions"
    );
    animate(
      lines,
      { opacity: [0, 1], transform: ["translateY(18px)", "translateY(0px)"] },
      { duration: 0.75, delay: stagger(0.08, { startDelay: 0.05 }), ease: EASE_OUT }
    );
  }

  if (heroArt) {
    heroArt.classList.add("visible");

    // Phones settle in with a spring, back-to-front. Each keeps its authored fan angle.
    heroArt.querySelectorAll(".phone").forEach((phone, i) => {
      const { rotate, rest } = restingTransform(phone);
      animate(
        phone,
        {
          opacity: [0, 1],
          transform: [`translateY(34px) scale(.96) rotate(${rotate}deg)`, rest],
        },
        { type: "spring", stiffness: 180, damping: 22, delay: 0.18 + i * 0.09 }
      );
    });

    // Pill notes arrive after the phones have landed.
    heroArt.querySelectorAll(".pill-note").forEach((note, i) => {
      const { rotate, rest } = restingTransform(note);
      animate(
        note,
        {
          opacity: [0, 1],
          transform: [`translateY(14px) scale(.94) rotate(${rotate}deg)`, rest],
        },
        { type: "spring", stiffness: 240, damping: 20, delay: 0.55 + i * 0.11 }
      );
    });

    // Background blobs drift on scroll. Small offsets only — this is depth, not movement.
    const shapes = heroArt.querySelectorAll(".shape-a, .shape-b, .shape-c");
    shapes.forEach((shape, i) => {
      const drift = [-46, 30, -22][i] ?? 0;
      scroll(
        animate(shape, { transform: ["translateY(0px)", `translateY(${drift}px)`] }, { ease: "linear" }),
        { target: heroArt, offset: ["start start", "end start"] }
      );
    });
  }

  /* ---------------------------------------------------------------
   * 2. Scroll reveals — replaces the old IntersectionObserver class flip.
   * ------------------------------------------------------------- */
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el === heroText || el === heroArt) return;

    inView(
      el,
      () => {
        el.classList.add("visible");

        // Animate the block's meaningful children rather than the whole slab —
        // reads as composed instead of a single fading rectangle.
        const parts = el.querySelectorAll(
          ".index, .feature-copy h2, .feature-copy p, .proof, .stage, .signal-copy > *, .stat, .waitlist-inner > *"
        );
        const targets = parts.length ? parts : [el];

        animate(
          targets,
          { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0px)"] },
          { duration: 0.7, delay: stagger(0.06), ease: EASE_OUT }
        );

        // Floating cards ride in slightly later, from the side they sit on.
        const cards = el.querySelectorAll(".floating-card");
        cards.forEach((card, i) => {
          const fromX = card.classList.contains("fc-b") ? 22 : -22;
          const { rotate, rest } = restingTransform(card);
          animate(
            card,
            {
              opacity: [0, 1],
              transform: [
                `translate(${fromX}px, 10px) scale(.95) rotate(${rotate}deg)`,
                rest,
              ],
            },
            { type: "spring", stiffness: 220, damping: 21, delay: 0.32 + i * 0.1 }
          );
        });
      },
      { amount: 0.2 }
    );
  });

  /* ---------------------------------------------------------------
   * 3. Numbers count up when their block enters view.
   *    Parses the existing markup so no copy changes are required.
   * ------------------------------------------------------------- */
  document.querySelectorAll(".stat strong, .proof strong").forEach((node) => {
    const raw = node.textContent.trim();
    const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return; // e.g. "1 tap", "Live" — leave as written

    const [, prefix, numText, suffix] = match;
    const target = parseFloat(numText.replace(/,/g, ""));
    if (!isFinite(target)) return;

    const decimals = (numText.split(".")[1] || "").length;
    const grouped = numText.includes(",");

    const format = (v) => {
      const fixed = v.toFixed(decimals);
      const withGroups = grouped
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      return prefix + withGroups + suffix;
    };

    // Reserve the final width before counting so nothing reflows mid-animation.
    // Deliberately does not touch `display` — these are block-level in the stylesheet
    // and overriding it collapses the stat layout.
    node.style.minWidth = `${Math.ceil(node.getBoundingClientRect().width)}px`;

    inView(
      node,
      () => {
        animate(0, target, {
          duration: 1.1,
          ease: EASE_OUT,
          onUpdate: (v) => {
            node.textContent = format(v);
          },
          onComplete: () => {
            node.textContent = raw; // exact original string wins
          },
        });
      },
      { amount: 0.6 }
    );
  });

  /* ---------------------------------------------------------------
   * 4. CTA feel — magnetic pull + press. Applied only to App Store buttons.
   *    This makes the CTA the most alive element on the page, by design.
   * ------------------------------------------------------------- */
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  document.querySelectorAll(".primary-cta, .nav-cta").forEach((cta) => {
    const arrow = cta.querySelector("span");

    // One rAF loop easing toward the pointer, rather than a new animation per pointermove.
    let tx = 0, ty = 0, px = 0, py = 0, scale = 1, pressed = false, raf = 0, active = false;
    const PULL = 5; // px — deliberately small. This is a nudge, not a bounce.

    function paint() {
      px += (tx - px) * 0.18;
      py += (ty - py) * 0.18;
      const s = pressed ? scale * 0.97 : scale;
      if (Math.abs(tx - px) < 0.05 && Math.abs(ty - py) < 0.05 && !active) {
        // Settled and idle — hand the element back to CSS so :hover and :focus work normally.
        cta.style.transform = "";
        raf = 0;
        return;
      }
      cta.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px) scale(${s})`;
      raf = requestAnimationFrame(paint);
    }
    function kick() {
      if (!raf) raf = requestAnimationFrame(paint);
    }

    if (!isCoarse) {
      cta.addEventListener("pointermove", (e) => {
        const r = cta.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * PULL;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2 * PULL - 2; // -2 matches the CSS hover lift
        scale = 1.03;
        active = true;
        kick();
      });

      cta.addEventListener("pointerleave", () => {
        tx = 0; ty = 0; scale = 1; active = false;
        kick();
        if (arrow) animate(arrow, { transform: "none" }, { type: "spring", stiffness: 300, damping: 24 });
      });

      cta.addEventListener("pointerenter", () => {
        if (arrow) animate(arrow, { transform: "translateX(3px)" }, { type: "spring", stiffness: 340, damping: 24 });
      });
    }

    cta.addEventListener("pointerdown", () => { pressed = true; active = true; kick(); });
    const release = () => { pressed = false; active = !isCoarse && cta.matches(":hover"); kick(); };
    cta.addEventListener("pointerup", release);
    cta.addEventListener("pointercancel", release);
  });

  /* ---------------------------------------------------------------
   * 5. Product stages lift a touch as they pass through the viewport.
   * ------------------------------------------------------------- */
  // Driven through the --py custom property so the stylesheet keeps ownership of the
  // centring translate and the tilt. Writing `transform` here would wipe both.
  document.querySelectorAll(".stage .phone").forEach((phone) => {
    scroll(
      animate(phone, { "--py": ["18px", "-18px"] }, { ease: "linear" }),
      { target: phone.closest(".stage"), offset: ["start end", "end start"] }
    );
  });
}
