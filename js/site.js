/* Shared behaviour for every page: the motion button, theme,
   phone menu, the ID badge and the cursor ring. Each feature looks for its
   own markup and does nothing when that markup is not on the page. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var THEME_KEY = "mt-theme";

  /* Theme ------------------------------------------------------------------ */
  function storedTheme() {
    try {
      var value = localStorage.getItem(THEME_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (e) {
      return null;
    }
  }
  function currentTheme() {
    return (
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }
  function labelThemeButtons() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.querySelectorAll(".theme-toggle").forEach(function (button) {
      button.setAttribute("aria-label", "Switch to " + next + " mode");
    });
  }
  var saved = storedTheme();
  if (saved) root.setAttribute("data-theme", saved);

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    labelThemeButtons();
  }
  /* Switching eases from one theme to the other instead of flashing: a
     cross-fade of the whole page where the browser has view transitions,
     otherwise the colours themselves fade (.theme-fade in site.css). It is
     instant for reduced motion or while motion is paused. */
  function switchTheme(next) {
    if (reduceMotion || root.classList.contains("motion-paused")) return setTheme(next);
    if (document.startViewTransition) {
      document.startViewTransition(function () {
        setTheme(next);
      });
      return;
    }
    root.classList.add("theme-fade");
    setTheme(next);
    setTimeout(function () {
      root.classList.remove("theme-fade");
    }, 500);
  }
  function initTheme() {
    labelThemeButtons();
    document.querySelectorAll(".theme-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        switchTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
  }

  /* Phone menu -------------------------------------------------------------- */
  function initMenu() {
    var button = document.querySelector(".menu-button");
    var menu = document.getElementById("menu");
    if (!button || !menu) return;
    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      if (button.classList.contains("icon-button")) button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      else button.textContent = open ? "Close" : "Menu";
      root.style.overflow = open ? "hidden" : "";
      /* focus stays on the toggle (now "Close menu"); the menu follows the
         top bar in the page, so Tab goes straight into its links */
    }
    button.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    window.matchMedia("(min-width: 1101px)").addEventListener("change", function (event) {
      if (event.matches) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        button.focus();
      }
    });
  }

  /* ID badge (Home and About): hovering the badge turns it over, the "Flip
     my ID" button toggles it (tap, click or keyboard), Escape turns it back */
  function initBadge() {
    var peek = document.querySelector(".peek");
    if (!peek) return;
    var tab = peek.querySelector(".peek__tab");
    var card = peek.querySelector(".badge__swing") || peek;
    var setOpen = function (open) {
      peek.classList.toggle("is-open", open);
      tab.setAttribute("aria-expanded", String(open));
    };
    tab.addEventListener("click", function () {
      setOpen(!peek.classList.contains("is-open"));
    });
    if (window.matchMedia("(hover: hover)").matches) {
      card.addEventListener("mouseenter", function () {
        setOpen(true);
      });
      card.addEventListener("mouseleave", function () {
        setOpen(false);
      });
    }
    peek.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        tab.focus();
      }
    });
  }

  /* Cursor (pointer devices only) ------------------------------------------- */
  /* Cursor: an orange circle in place of the system pointer (hidden in
     site.css). Over links and buttons it becomes an outline ring; over anything with a data-cursor label (case studies,
     artwork, the recruiter button…) a bigger outlined badge showing that
     label, like "View project". Only for a mouse or trackpad, and off for
     reduced motion, where the system pointer stays as it is. */
  function initCursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    var label = document.createElement("span");
    ring.appendChild(label);
    document.body.appendChild(ring);
    var x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      current = null;
    /* the label (e.g. "View") and link state follow what is under the
       pointer; the target can be the document itself (no .closest) */
    function aim(target) {
      var el = target instanceof Element ? target : document.body;
      var labelled = el.closest("[data-cursor]");
      var text = labelled ? labelled.getAttribute("data-cursor") : "";
      if (text !== current) {
        current = text;
        label.textContent = text;
        document.documentElement.classList.toggle("cursor-label", !!text);
      }
      document.documentElement.classList.toggle("cursor-link", !text && !!el.closest("a, button, [role=tab], summary, label"));
    }
    document.addEventListener("mousemove", function (event) {
      x = event.clientX;
      y = event.clientY;
      document.documentElement.classList.add("has-cursor");
      aim(event.target);
    });
    /* scrolling moves the page under a still pointer: look again at what
       is under it, or a label like "View" would stay behind */
    var looking = false;
    window.addEventListener("scroll", function () {
      if (looking || !document.documentElement.classList.contains("has-cursor")) return;
      looking = true;
      requestAnimationFrame(function () {
        looking = false;
        aim(document.elementFromPoint(x, y));
      });
    }, { passive: true });
    document.addEventListener("mouseleave", function () {
      document.documentElement.classList.remove("has-cursor");
    });
    document.addEventListener("mousedown", function () {
      document.documentElement.classList.add("cursor-down");
    });
    document.addEventListener("mouseup", function () {
      document.documentElement.classList.remove("cursor-down");
    });
    (function loop() {
      /* right on the pointer, since it stands in for it; moved through
         translate, so the press shrink (scale) happens in place */
      cx = x;
      cy = y;
      ring.style.translate = cx.toFixed(1) + "px " + cy.toFixed(1) + "px";
      requestAnimationFrame(loop);
    })();
  }

  /* Pause motion: the button in the top bar on every page. The choice holds
     for the rest of the visit (this tab's session) on every page. */
  try {
    if (sessionStorage.getItem("motion") === "paused") root.classList.add("motion-paused");
  } catch (e) {}
  function initMotion() {
    var button = document.querySelector(".motion-toggle");
    if (!button) return;
    function apply(paused) {
      root.classList.toggle("motion-paused", paused);
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "Play motion" : "Pause motion");
      /* the CSS tooltip under the button reads the label (no native title,
         so the two never show at once) */
      button.removeAttribute("title");
      document.dispatchEvent(new CustomEvent("motionchange", { detail: { paused: paused } }));
    }
    apply(root.classList.contains("motion-paused"));
    button.addEventListener("click", function () {
      var paused = !root.classList.contains("motion-paused");
      try {
        sessionStorage.setItem("motion", paused ? "paused" : "playing");
      } catch (e) {}
      apply(paused);
    });
  }

  function start() {
    initMotion();
    initTheme();
    initMenu();
    initBadge();
    initCursor();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
