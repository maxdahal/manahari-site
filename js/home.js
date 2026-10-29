/* Home page behaviour: the recruiter summary, the motion tip, the season
   buttons, the Nepal fun facts, nav jumps and highlight, the artwork spotlight and lightbox. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Pause motion: the button in the top bar toggles .motion-paused on the
     page (the CSS pauses what it animates) and remembers the choice for
     next time. */
  function motionToggle() {
    var root = document.documentElement;
    var button = document.querySelector(".motion-toggle");
    if (!button) return;
    /* the button itself is wired in site.js; pressing it also closes the tip */
    button.addEventListener("click", function () {
      hideTip();
    });

    /* The tip: a small note under the button, pointing up at it, shown
       once per visit (the browser tab's session), when the intro has
       finished. A thin bar along its bottom counts down 8s and the tip goes
       when it runs out (the CSS pauses the bar while you hover or focus the
       tip); "Got it", the button itself or Escape close it sooner. */
    var tip = document.getElementById("motion-tip");
    function placeTip() {
      var r = button.getBoundingClientRect();
      var width = tip.offsetWidth;
      var edge = document.documentElement.clientWidth - 16;
      /* the note's right edge just past the button's, kept on screen */
      var left = Math.max(16, Math.min(r.right + 8, edge) - width);
      tip.style.setProperty("--tip-left", Math.round(left) + "px");
      tip.style.setProperty("--arrow-x", Math.round(r.left + r.width / 2 - left) + "px");
    }
    function hideTip() {
      if (!tip || tip.hidden) return;
      tip.classList.add("is-leaving");
      setTimeout(function () {
        tip.hidden = true;
      }, 250);
      window.removeEventListener("resize", placeTip);
    }
    try {
      localStorage.removeItem("motion-tip");
    } catch (e) {}
    var shown = false;
    try {
      shown = sessionStorage.getItem("motion-tip") === "shown";
    } catch (e) {}
    if (!tip || shown || reduceMotion || getComputedStyle(button).display === "none") return;
    /* after the hello intro, while it plays */
    var introLeft = root.classList.contains("hello-lock") ? 3600 : 1200;
    setTimeout(function () {
      if (root.classList.contains("motion-paused")) return;
      tip.hidden = false;
      placeTip();
      window.addEventListener("resize", placeTip);
      try {
        sessionStorage.setItem("motion-tip", "shown");
      } catch (e) {}
    }, introLeft);
    tip.querySelector(".motion-tip__timer").addEventListener("animationend", hideTip);
    tip.querySelector(".motion-tip__ok").addEventListener("click", hideTip);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideTip();
    });
  }

  /* For recruiters: the buttons (under the outline and in the phone menu)
     open the summary dialog; Close, Escape or a click on the dimmed page
     shut it, and focus goes back to the button that opened it */
  function initRecruiter() {
    var dialog = document.querySelector(".recruiter");
    if (!dialog || !dialog.showModal) return;
    var opener = null;
    document.querySelectorAll("[data-recruiter]").forEach(function (button) {
      button.addEventListener("click", function () {
        opener = button;
        var menu = document.getElementById("menu");
        if (menu && menu.classList.contains("is-open")) {
          var toggle = document.querySelector(".menu-button");
          if (toggle) toggle.click();
        }
        dialog.showModal();
      });
    });
    /* the About page's Quick summary lands here with ?summary: open it */
    if (/[?&]summary\b/.test(location.search)) {
      history.replaceState(null, "", location.pathname + location.hash);
      dialog.showModal();
    }
    dialog.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        /* a link moves on to the page; the close button hands focus back */
        if (el.tagName === "A") opener = null;
        dialog.close();
      });
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    /* "See more" shows every skill, and turns into "See fewer" */
    var more = dialog.querySelector(".recruiter__more");
    var list = dialog.querySelector(".recruiter__skills");
    if (more && list) {
      var label = more.textContent;
      more.addEventListener("click", function () {
        var open = !list.classList.contains("is-open");
        list.classList.toggle("is-open", open);
        more.setAttribute("aria-expanded", String(open));
        more.textContent = open ? "See fewer" : label;
      });
    }
    dialog.addEventListener("close", function () {
      if (opener && opener.offsetParent) opener.focus();
    });
  }

  /* Seasons, as on kigo.studio: four buttons at the top right of the hero
     (they stay there, sticky, until the case studies arrive) change what
     falls across it: petals in spring, fireflies rising in summer, leaves in
     autumn, snow in winter. Each pick replays the fall
     and is remembered; the first visit starts from today's date. Nothing
     falls for reduced motion, and the pause button holds the pieces. */
  var SEASONS = {
    spring: {
      count: 26, wind: 0.4, size: [12, 20], speed: [6, 9], flutter: ["flutter", "flutter flutter--r"],
      colors: ["#f4b6c8", "#f9cfdc", "#eaa0b8", "#f7c4d4"],
      shape: '<path d="M12 2 C16 6 17 12 14 18 C13 20 12.5 21 12 22 C11.5 21 11 20 10 18 C7 12 8 6 12 2 Z"/>'
    },
    /* fireflies: small warm lights that rise from the foot of the hero,
       wandering and blinking as they go */
    summer: {
      count: 26, rise: true, size: [6, 11], speed: [7, 12], flutter: ["hover"],
      colors: ["var(--firefly)", "var(--firefly-2)"],
      shape: '<circle cx="12" cy="12" r="7"/>'
    },
    autumn: {
      count: 22, size: [16, 30], speed: [4.5, 7.5], flutter: ["flutter", "flutter flutter--r"],
      colors: ["#d9682b", "#e8a33d", "#b8442a", "#c97b2a", "#9c3b1e", "#e0b04a"],
      wind: 0.35,
      /* a few small maple leaves among the others */
      extra: { share: 0.3, scale: 0.7, colors: ["#c8402a", "#d9552c", "#b8342a", "#e0782f"],
        shape: '<path d="M12 1 L13.6 5.6 L16.8 4 L16 8.4 L20.8 7.6 L18.8 11.2 L22.4 12.4 L17.6 15.2 L18.4 17.6 L13.2 16.4 L12.8 22.4 L11.2 22.4 L10.8 16.4 L5.6 17.6 L6.4 15.2 L1.6 12.4 L5.2 11.2 L3.2 7.6 L8 8.4 L7.2 4 L10.4 5.6 Z"/><path d="M12 6 L12 22 M12 13 L17 9.5 M12 13 L7 9.5" fill="none" stroke="rgb(70 20 10 / 0.4)" stroke-width="0.8" stroke-linecap="round"/>' },
      shape: '<path d="M12 1 C17 5 22 10 19 16 C17 20 14 22 12 23 C10 22 7 20 5 16 C2 10 7 5 12 1 Z"/>' +
        '<path d="M12 4 L12 23 M12 11 L16 8 M12 15 L8 12" fill="none" stroke="rgb(80 30 10 / 0.45)" stroke-width="1" stroke-linecap="round"/>'
    },
    winter: {
      count: 40, size: [5, 11], speed: [6, 10], flutter: ["drift"],
      colors: ["#b9cde4", "#cfdcec", "#a9c0dc", "#ffffff"],
      shape: '<circle cx="12" cy="12" r="8"/>'
    }
  };

  function seasonFromDate() {
    var m = new Date().getMonth();
    return m < 2 || m === 11 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";
  }

  function initSeasons() {
    var buttons = [].slice.call(document.querySelectorAll(".cv-season"));
    var layer = document.querySelector(".falling");
    var hero = document.querySelector(".cv-hero");
    if (!buttons.length || !layer || !hero) return;
    var season = seasonFromDate();
    try {
      var saved = localStorage.getItem("season");
      if (SEASONS[saved]) season = saved;
    } catch (e) {}

    function between(range) {
      return range[0] + Math.random() * (range[1] - range[0]);
    }
    function piece(kind, size) {
      var el = document.createElement("span");
      el.className = "falling__piece";
      var look = kind.extra && Math.random() < kind.extra.share ? kind.extra : kind;
      if (look !== kind) size = Math.round(size * look.scale);
      el.style.width = el.style.height = size + "px";
      var color = look.colors[Math.floor(Math.random() * look.colors.length)];
      var inner = document.createElement("span");
      inner.className = kind.flutter[Math.floor(Math.random() * kind.flutter.length)];
      inner.style.animationDuration = (1.2 + Math.random() * 1.2).toFixed(2) + "s";
      inner.innerHTML = '<svg viewBox="0 0 24 24" fill="' + color + '"' +
        (kind.rise ? ' class="falling__glow"' : "") + ">" + look.shape + "</svg>";
      el.appendChild(inner);
      layer.appendChild(el);
      return el;
    }

    /* the pieces fall across the window; on each play the wind blows one
       way, and some pieces (kind.wind of them) are caught by a gust partway
       down and swept sideways */
    function play() {
      layer.textContent = "";
      if (reduceMotion || !layer.animate) return;
      var kind = SEASONS[season];
      var w = window.innerWidth;
      var h = window.innerHeight;
      var windDir = Math.random() < 0.5 ? 1 : -1;
      for (var i = 0; i < kind.count; i++) {
        var el = piece(kind, Math.round(between(kind.size)));
        var left = 20 + Math.random() * (w - 40);
        var from = -40;
        var to = h + 20;
        var frames;
        if (kind.rise) {
          /* rises from the foot of the window, wandering side to side and
             blinking on and off */
          var x1 = 20 + Math.random() * (w - 40);
          var y1 = h * (0.6 + Math.random() * 0.4);
          var climb = h * (0.35 + Math.random() * 0.4);
          var sway = 30 + Math.random() * 50;
          frames = [];
          for (var n = 0; n <= 8; n++) {
            var t = n / 8;
            frames.push({
              offset: t,
              transform: "translate(" + (x1 + Math.sin(t * Math.PI * 2.5 + i) * sway).toFixed(0) + "px," + (y1 - climb * t).toFixed(0) + "px)",
              opacity: n === 0 || n === 8 ? 0 : n % 2 ? 1 : 0.25
            });
          }
        } else if (Math.random() < (kind.wind || 0)) {
          /* starts upwind, so the gust carries it across */
          var gx = windDir > 0 ? 20 + Math.random() * w * 0.55 : w * 0.45 + Math.random() * (w * 0.55 - 20);
          var dx = windDir * w * (0.22 + Math.random() * 0.28);
          var gust = 0.3 + Math.random() * 0.2;
          var at = function (x, f) {
            return "translate(" + x.toFixed(0) + "px," + (from + (to - from) * f).toFixed(0) + "px)";
          };
          frames = [
            { transform: at(gx, 0), opacity: 0 },
            { opacity: 1, offset: 0.08 },
            { transform: at(gx + dx * 0.05, gust), offset: gust, easing: "cubic-bezier(0.5, 0, 0.3, 1)" },
            { transform: at(gx + dx, gust + 0.06), offset: gust + 0.22, easing: "ease-in" },
            { opacity: 1, offset: 0.88 },
            { transform: at(gx + dx * 1.15, 1), opacity: 0 }
          ];
        } else {
          frames = [
            { transform: "translate(" + left + "px," + from + "px)", opacity: 0 },
            { opacity: 1, offset: 0.08 },
            { opacity: 1, offset: 0.85 },
            { transform: "translate(" + left + "px," + to + "px)", opacity: 0 }
          ];
        }
        el.animate(frames, { duration: between(kind.speed) * 1000, delay: Math.random() * 2400, fill: "both" });
      }
      if (document.documentElement.classList.contains("motion-paused")) hold(true);
    }

    /* the pause button holds the pieces where they are */
    function hold(paused) {
      layer.getAnimations({ subtree: true }).forEach(function (a) {
        if (paused) a.pause();
        else a.play();
      });
    }
    document.addEventListener("motionchange", function (event) {
      hold(event.detail.paused);
    });

    function set(next, replay) {
      season = next;
      document.documentElement.dataset.season = season;
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.season === season));
      });
      if (replay) play();
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        try {
          localStorage.setItem("season", b.dataset.season);
        } catch (e) {}
        set(b.dataset.season, true);
      });
    });
    /* the first fall plays once the intro has lifted */
    set(season, false);
    setTimeout(play, document.documentElement.classList.contains("hello-lock") ? 3400 : 400);

    /* the fall belongs to the hero: below it, the layer hides and its
       pieces rest */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var away = !entries[0].isIntersecting;
        layer.hidden = away;
        if (!document.documentElement.classList.contains("motion-paused")) hold(away);
      }).observe(hero);
    }
  }

  /* Fun facts about Nepal: the line beside the flag in the hero opens them;
     Close, Escape or a click outside shut it, and focus goes back */
  function initNepal() {
    var dialog = document.querySelector(".nepal");
    var button = document.querySelector("[data-nepal]");
    if (!dialog || !button || !dialog.showModal) return;
    button.addEventListener("click", function () {
      dialog.showModal();
    });
    dialog.querySelector("[data-close]").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      button.focus();
    });
  }

  function start() {
    initRecruiter();
    motionToggle();
    initSeasons();
    initNepal();

    /* In-page links land with the section's top just under the top bar. */
    var bar = document.querySelector(".cp-bar");
    function goTo(id, smooth) {
      var target = document.getElementById(id);
      if (!target) return false;
      var section = target.closest(".sections > section, .sections > .pin-spacer > section");
      /* a section GSAP holds in place sits in a spacer: its top is the
         spacer's (the section's own top stays put while it is held) */
      if (section && section.parentElement.classList.contains("pin-spacer")) section = section.parentElement;
      var top = section
        ? section.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight : 0)
        : document.documentElement.scrollHeight;
      /* with Lenis running (scroll.js), it does the glide */
      if (window.lenis) window.lenis.scrollTo(Math.max(0, top), { immediate: !smooth });
      else window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
      return true;
    }
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link || link.getAttribute("href").length < 2) return;
      if (goTo(link.getAttribute("href").slice(1), true)) {
        event.preventDefault();
        history.replaceState(null, "", link.getAttribute("href"));
      }
    });
    if (location.hash.length > 1) {
      var arrive = function () {
        goTo(location.hash.slice(1), false);
      };
      if (document.readyState === "complete") setTimeout(arrive, 100);
      else window.addEventListener("load", arrive);
    }
    /* Nav: marks the section you are reading, the last one whose top has
       passed the middle of the screen (each section is a screen tall, with
       room above its content, so the middle matches what you see) */
    var outlineLinks = [].slice.call(document.querySelectorAll('.pv-nav__links a[href^="#"]'));
    var outlineTargets = outlineLinks.map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    });
    var outlineTick = false;
    function markOutline() {
      outlineTick = false;
      var line = window.innerHeight / 2;
      /* nothing is marked over the hero, which has no link of its own */
      var current = -1;
      var best = -Infinity;
      outlineTargets.forEach(function (target, i) {
        if (!target) return;
        /* the section whose top passed the middle most recently, whatever
           order the links are in */
        var top = target.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = i;
        }
      });
      outlineLinks.forEach(function (link, i) {
        if (i === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    if (outlineLinks.length) {
      window.addEventListener(
        "scroll",
        function () {
          if (!outlineTick) {
            outlineTick = true;
            requestAnimationFrame(markOutline);
          }
        },
        { passive: true }
      );
      window.addEventListener("resize", markOutline);
      markOutline();
    }

    /* Artwork spotlight: pass the cursor position to CSS (--mx, --my); the
       light itself is a CSS gradient. Keyboard focus moves it onto a piece. */
    var track = document.querySelector(".artwork__track");
    var spot = document.querySelector(".spot");
    if (spot) {
      var aim = function (x, y) {
        var r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", (x - r.left).toFixed(0) + "px");
        spot.style.setProperty("--my", (y - r.top).toFixed(0) + "px");
        spot.classList.add("is-lit");
      };
      spot.addEventListener("pointermove", function (event) {
        aim(event.clientX, event.clientY);
      });
      spot.addEventListener("focusin", function (event) {
        var r = event.target.getBoundingClientRect();
        aim(r.left + r.width / 2, r.top + r.height / 2);
      });
    }

    /* Lightbox */
    var dialog = document.querySelector(".lightbox");
    if (dialog && track) {
      var buttons = [].slice.call(track.querySelectorAll(".artwork__item"));
      var big = dialog.querySelector("img");
      var count = dialog.querySelector(".lightbox__count");
      var current = 0;
      var show = function (index) {
        current = (index + buttons.length) % buttons.length;
        var img = buttons[current].querySelector("img");
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        count.textContent = current + 1 + " / " + buttons.length;
      };
      buttons.forEach(function (button, i) {
        button.addEventListener("click", function () {
          show(i);
          dialog.showModal();
        });
      });
      dialog.querySelectorAll("[data-step]").forEach(function (b) {
        b.addEventListener("click", function () {
          show(current + Number(b.dataset.step));
        });
      });
      dialog.querySelector("[data-close]").addEventListener("click", function () {
        dialog.close();
      });
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") show(current - 1);
        if (event.key === "ArrowRight") show(current + 1);
      });
      dialog.addEventListener("close", function () {
        buttons[current].focus();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
