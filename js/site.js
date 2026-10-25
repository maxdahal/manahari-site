/* Shared behaviour for every page: theme, menu, tabs, section bands, the ID
   badge, reveals, counters and the cursor ring. Each feature looks for its own
   markup and does nothing when that markup is not on the page. */
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

  /* Tabs: [role=tablist] with [role=tab] buttons that control panels ------- */
  function initTabs(scope) {
    (scope || document).querySelectorAll('[role="tablist"]').forEach(function (list) {
      if (list.dataset.tabsReady || list.hasAttribute("data-tabs-manual")) return;
      list.dataset.tabsReady = "1";
      var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
      function select(index, focus) {
        tabs.forEach(function (tab, i) {
          var on = i === index;
          tab.setAttribute("aria-selected", String(on));
          tab.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(tab.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
          if (on && focus) tab.focus();
        });
        list.dispatchEvent(new CustomEvent("tabchange", { detail: { index: index } }));
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () {
          select(i, false);
        });
        tab.addEventListener("keydown", function (event) {
          var next = null;
          if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
          if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          if (next === null) return;
          event.preventDefault();
          select(next, true);
        });
      });
      var start = tabs.findIndex(function (tab) {
        return tab.getAttribute("aria-selected") === "true";
      });
      select(start < 0 ? 0 : start, false);
      list.selectTab = select;
    });
  }

  /* Split headings into letters for the reveal ----------------------------- */
  function splitHeadings() {
    if (reduceMotion) return;
    document.querySelectorAll("[data-split]").forEach(function (heading) {
      var text = heading.textContent.trim().replace(/\s+/g, " ");
      heading.setAttribute("aria-label", text);
      heading.textContent = "";
      var index = 0;
      text.split(" ").forEach(function (word, w) {
        var wordSpan = document.createElement("span");
        wordSpan.className = "split-word";
        wordSpan.setAttribute("aria-hidden", "true");
        word.split("").forEach(function (letter) {
          var span = document.createElement("span");
          span.className = "split-letter";
          span.style.setProperty("--i", index++);
          span.textContent = letter;
          wordSpan.appendChild(span);
        });
        heading.appendChild(wordSpan);
        if (w < text.split(" ").length - 1) heading.appendChild(document.createTextNode(" "));
      });
      heading.classList.add("reveal-split");
    });
  }

  /* Section band. How far it reaches depends on what opens the body:
     - opening text, anything short, or anything marked data-band-cover:
       covered in full
     - an image, or a row of cards with images: the top part only, so it
       hangs out below the band (text set beside the image is covered in full)
     - a tall text panel (table, list, timeline): the band stops where it
       starts, as a short strip under the heading, so no text is cut in half */
  /* true when an image sits at the very top of el (not just somewhere inside) */
  function opensWithImage(el) {
    if (el.matches("figure, img, picture, video")) return true;
    var media = el.querySelector("img, picture, video, figure");
    return !!media && media.getBoundingClientRect().top - el.getBoundingClientRect().top < 80;
  }
  /* height of the tallest text column that starts alongside an image in el */
  function textBeside(el) {
    var top = el.getBoundingClientRect().top;
    var tallest = 0;
    [].forEach.call(el.children, function (child) {
      var r = child.getBoundingClientRect();
      if (child.matches("figure, img, picture, video") || child.querySelector("img, picture, video, figure")) return;
      if (r.top - top < 80) tallest = Math.max(tallest, r.bottom - top);
    });
    return tallest;
  }
  function initBands() {
    var bodies = [].slice.call(document.querySelectorAll(".block:not(.block--plain) > .block__body"));
    if (!bodies.length) return;
    function size(body) {
      var first = body.firstElementChild;
      if (!first) return;
      var h = first.offsetHeight;
      /* offsets, not on-screen boxes, so a reveal still sliding in does not count */
      var start = first.offsetTop - body.offsetTop;
      var end;
      if (first.matches("p, h3, h4, blockquote, [data-band-cover]") || h <= 160) end = start + h + 40;
      else if (opensWithImage(first)) {
        var beside = first.matches("figure, img, picture, video") ? 0 : textBeside(first);
        if (!beside) end = start + Math.max(120, Math.min(200, h * 0.4));
        /* text next to an image: cover the text, let the image hang out */
        else end = beside <= 320 ? start + beside + 40 : start;
      } else end = start;
      body.style.setProperty("--band-h", Math.round(end) + "px");
    }
    function sizeAll() {
      bodies.forEach(size);
    }
    sizeAll();
    window.addEventListener("load", sizeAll);
    window.addEventListener("resize", sizeAll);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          size(entry.target.parentElement);
        });
      });
      bodies.forEach(function (body) {
        if (body.firstElementChild) ro.observe(body.firstElementChild);
      });
    }
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

  /* Reveal on scroll -------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal, .reveal-split");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Counters: <span data-count="30">30</span> counts up once in view ------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    function run(el) {
      var target = parseFloat(el.dataset.count);
      if (reduceMotion) {
        el.textContent = target;
        return;
      }
      var start = null;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / 1200);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    });
    counters.forEach(function (el) {
      observer.observe(el);
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
      var labelled = event.target.closest("[data-cursor]");
      var text = labelled ? labelled.getAttribute("data-cursor") : "";
      if (text !== current) {
        current = text;
        label.textContent = text;
        document.documentElement.classList.toggle("cursor-label", !!text);
      }
      document.documentElement.classList.toggle("cursor-link", !text && !!event.target.closest("a, button, [role=tab], summary, label"));
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
  function initMotion() {
    var button = document.querySelector(".motion-toggle");
    if (!button) return;
    function apply(paused) {
      root.classList.toggle("motion-paused", paused);
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "Play motion" : "Pause motion");
      button.title = paused ? "Play motion" : "Pause motion";
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
    initTabs();
    initBands();
    initBadge();
    splitHeadings();
    initReveal();
    initCounters();
    initCursor();
  }

  window.Site = { initTabs: initTabs, reduceMotion: reduceMotion };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
