/* Shared behaviour for every page: theme, header, menu, tabs, reveals, counters
   and the cursor ring. Each feature looks for its own markup and does nothing
   when that markup is not on the page. */
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

  /* Header: hide on scroll down, show on scroll up, mark the active section - */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        var menuOpen = document.querySelector(".menu.is-open");
        header.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 200);
        lastY = y;
      },
      { passive: true }
    );

    /* The active link is the last section (in page order) that has reached
       the middle of the screen. Home's sections stack and stay stuck, so an
       earlier section can still overlap the middle; the later one is on top. */
    var links = [].slice.call(document.querySelectorAll(".site-nav a[data-section]"));
    var targets = links.map(function (link) {
      return document.getElementById(link.dataset.section);
    });
    if (!links.length) return;
    /* The footer sticks to the bottom of the screen underneath the page, so it
       always looks "in view"; it really starts where the content above it ends. */
    function topOf(target) {
      var style = getComputedStyle(target);
      var stuckToBottom = style.position === "sticky" && style.bottom !== "auto" && target.previousElementSibling;
      return stuckToBottom
        ? target.previousElementSibling.getBoundingClientRect().bottom
        : target.getBoundingClientRect().top;
    }
    var ticking = false;
    function markActive() {
      ticking = false;
      var middle = window.innerHeight / 2;
      var active = -1;
      targets.forEach(function (target, i) {
        if (target && topOf(target) <= middle) active = i;
      });
      /* at the very bottom the last section counts even if short */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        for (var i = targets.length - 1; i >= 0; i--) {
          if (targets[i] && topOf(targets[i]) < window.innerHeight) {
            active = i;
            break;
          }
        }
      }
      links.forEach(function (link, i) {
        link.classList.toggle("is-active", i === active);
      });
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(markActive);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", markActive);
    window.addEventListener("load", markActive);
    markActive();
  }

  /* Phone menu -------------------------------------------------------------- */
  function initMenu() {
    var button = document.querySelector(".menu-button");
    var menu = document.getElementById("menu");
    if (!button || !menu) return;
    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Close" : "Menu";
      root.style.overflow = open ? "hidden" : "";
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      }
    }
    button.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
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
     - opening text, or anything short: covered in full
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
      if (first.matches("p, h3, h4, blockquote") || h <= 160) end = start + h + 40;
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
  function initCursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    var x = 0,
      y = 0,
      cx = 0,
      cy = 0;
    document.addEventListener("mousemove", function (event) {
      x = event.clientX;
      y = event.clientY;
      ring.classList.add("is-on");
      ring.classList.toggle("is-link", !!event.target.closest("a, button, [role=tab], summary"));
    });
    document.addEventListener("mouseleave", function () {
      ring.classList.remove("is-on");
    });
    (function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      var size = ring.offsetWidth / 2;
      ring.style.transform = "translate(" + (cx - size) + "px," + (cy - size) + "px)";
      requestAnimationFrame(loop);
    })();
  }

  function start() {
    initTheme();
    initHeader();
    initMenu();
    initTabs();
    initBands();
    splitHeadings();
    initReveal();
    initCounters();
    initCursor();
  }

  window.Site = { initTabs: initTabs, reduceMotion: reduceMotion };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
