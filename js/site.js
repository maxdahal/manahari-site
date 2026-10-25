/* Shared behaviour for every page: the motion button, hero videos, theme,
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

  function initTheme() {
    labelThemeButtons();
    document.querySelectorAll(".theme-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
        labelThemeButtons();
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

  /* Cursor ring (pointer devices only) -------------------------------------- */
  /* Cursor: a small muted-orange dot on the pointer and a thin ring that
     trails softly behind it. Over anything with a data-cursor label (case
     studies, artwork, the recruiter button…) the ring grows into a round
     badge showing that label, like "View project", and the dot hides; over
     other links and buttons the ring grows a little. The real pointer stays
     underneath, so clicking is as precise as ever. Only for a mouse or
     trackpad, and off for reduced motion. */
  function initCursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    var label = document.createElement("span");
    ring.appendChild(label);
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    var x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      current = null;
    document.addEventListener("mousemove", function (event) {
      x = event.clientX;
      y = event.clientY;
      /* position through the translate property, so the press shrink
         (scale) happens in place and never pulls the dot toward the corner */
      dot.style.translate = x + "px " + y + "px";
      document.documentElement.classList.add("has-cursor");
      /* the target can be the document itself (no .closest) */
      var el = event.target instanceof Element ? event.target : document.body;
      var labelled = el.closest("[data-cursor]");
      var text = labelled ? labelled.getAttribute("data-cursor") : "";
      if (text !== current) {
        current = text;
        label.textContent = text;
        document.documentElement.classList.toggle("cursor-label", !!text);
      }
      document.documentElement.classList.toggle("cursor-link", !text && !!el.closest("a, button, [role=tab], summary, label"));
    });
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
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      ring.style.translate = cx.toFixed(1) + "px " + cy.toFixed(1) + "px";
      requestAnimationFrame(loop);
    })();
  }



  /* Pause motion: the button in the top bar on every page. The choice holds
     for the rest of the visit (this tab's session) on every page. */
  try {
    if (sessionStorage.getItem("motion") === "paused") root.classList.add("motion-paused");
  } catch (e) {}
  /* Hero videos: play muted on a loop unless motion is reduced or paused
     with the motion button; they follow the button after that. */
  function initHeroVideo() {
    var videos = [].slice.call(document.querySelectorAll("[data-hero-video]"));
    if (!videos.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      var stop = reduce.matches || root.classList.contains("motion-paused");
      videos.forEach(function (v) {
        if (stop) v.pause();
        else {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        }
      });
    }
    document.addEventListener("motionchange", sync);
    sync();
  }
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
    initHeroVideo();
    initTheme();
    initMenu();
    initBadge();
    initCursor();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
