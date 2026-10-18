/* Home page behaviour: stacked sections, hero swap, statement fill, the ID
   badge, the case-study seasons, marquee and the artwork lightbox. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v) {
    return Math.max(0, Math.min(1, v));
  };

  /* Progress of an element through the viewport, 0 to 1, between two lines */
  function progress(el, startLine, endLine) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    return clamp((vh * startLine - r.top) / (vh * startLine - vh * endLine));
  }

  function start() {
    var sections = [].slice.call(document.querySelectorAll(".sections > section"));

    /* Each section sticks once its bottom reaches the bottom of the screen */
    function setStickyOffsets() {
      sections.forEach(function (section) {
        section.style.setProperty("--stick", Math.min(0, window.innerHeight - section.offsetHeight) + "px");
      });
    }
    setStickyOffsets();
    window.addEventListener("resize", setStickyOffsets);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(setStickyOffsets);
      sections.forEach(function (s) {
        ro.observe(s);
      });
    }

    /* In-page links. A stuck section already counts as "in view", so the
       browser would not move; scroll to where the section starts instead. */
    var holder = document.querySelector(".sections");
    function sectionTop(section) {
      var top = holder.getBoundingClientRect().top + window.scrollY;
      for (var s = section.previousElementSibling; s; s = s.previousElementSibling) top += s.offsetHeight;
      return top;
    }
    function goTo(id, smooth) {
      var target = document.getElementById(id);
      if (!target) return false;
      var section = target.closest(".sections > section");
      var top = section ? sectionTop(section) : document.documentElement.scrollHeight;
      window.scrollTo({ top: top, behavior: smooth && !reduceMotion ? "smooth" : "auto" });
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
    /* other scripts (and the board links) use the same jump */
    if (window.Site) window.Site.goTo = goTo;

    /* Statement: split into words that fill with color as you scroll */
    var statement = document.querySelector("[data-fill]");
    var words = [];
    if (statement && !reduceMotion) {
      var text = statement.textContent.trim();
      statement.textContent = "";
      text.split(/\s+/).forEach(function (word, i, all) {
        var span = document.createElement("span");
        span.className = "fill-word";
        span.textContent = word;
        statement.appendChild(span);
        if (i < all.length - 1) statement.appendChild(document.createTextNode(" "));
        words.push(span);
      });
    }

    /* Case studies: the season switch and what falls on the shelves */
    var work = document.querySelector(".work");
    if (work) seasons(work);

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

    /* Everything that follows the scroll position */
    var hero = document.querySelector(".hero");
    var rows = document.querySelectorAll(".marquee__row");
    var marquee = document.querySelector(".marquee");
    var ticking = false;

    function onScroll() {
      ticking = false;
      var vh = window.innerHeight;

      /* Hero: where scroll-driven CSS animations are supported, the name to
         role swap follows the scroll in CSS. Elsewhere this class triggers
         the same swap as a CSS transition once you are a little way in. */
      if (hero) {
        hero.classList.toggle("is-swapped", window.scrollY > vh * 0.1);
      }
      if (reduceMotion) return;

      if (hero) {
        var h = clamp((-hero.getBoundingClientRect().top / (hero.offsetHeight - vh) - 0.04) / 0.5);
        hero.style.setProperty("--hero", h.toFixed(3));
      }

      if (words.length && statement) {
        var p = progress(statement, 0.92, 0.4);
        words.forEach(function (word, i) {
          var f = clamp((p - 0.04 - i * (0.6 / Math.max(1, words.length - 1))) / 0.22);
          word.style.setProperty("--f", (f * 100).toFixed(1) + "%");
        });
      }

      if (marquee) {
        var section = marquee.getBoundingClientRect();
        var mp = clamp((vh - section.top) / (vh * 3));
        rows.forEach(function (row) {
          var width = (row.scrollWidth / 2) * 0.45;
          var dir = Number(row.dataset.direction) || 1;
          var x = dir > 0 ? -mp * width : -(1 - mp) * width;
          row.style.setProperty("--x", x.toFixed(1) + "px");
        });
      }

      sections.forEach(function (section, i) {
        var next = sections[i + 1];
        if (!next) return;
        var nr = next.getBoundingClientRect();
        section.style.setProperty("--cover", clamp(1 - nr.top / vh).toFixed(3));
      });
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScroll);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", onScroll);
    onScroll();

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

  /* Seasons. The switch sets data-season on the section (the plants' spring
     flowers and winter snow are CSS) and replays what falls: leaves in
     autumn, petals in spring, snow in winter, fireflies rising in summer.
     Some pieces land on the [data-land] surfaces (screens and shelves): they
     fall with gravity, bounce twice and stay. The rest fall through. The
     season starts from today's date and a visitor's pick is remembered. */
  var SEASONS = {
    spring: {
      count: 26, land: 12, size: [12, 20], speed: [6, 9], flutter: ["flutter", "flutter flutter--r"],
      colors: ["#f4b6c8", "#f9cfdc", "#eaa0b8", "#f7c4d4"],
      shape: '<path d="M12 2 C16 6 17 12 14 18 C13 20 12.5 21 12 22 C11.5 21 11 20 10 18 C7 12 8 6 12 2 Z"/>'
    },
    summer: {
      count: 18, land: 0, rise: true, size: [6, 11], speed: [6, 9], flutter: ["hover"], glow: true,
      colors: ["#e0a92a", "#ecc04e", "#ffe27a"],
      shape: '<circle cx="12" cy="12" r="8"/>'
    },
    autumn: {
      count: 22, land: 10, size: [16, 30], speed: [4.5, 7.5], flutter: ["flutter", "flutter flutter--r"],
      colors: ["#d9682b", "#e8a33d", "#b8442a", "#c97b2a", "#9c3b1e", "#e0b04a"],
      shape: '<path d="M12 1 C17 5 22 10 19 16 C17 20 14 22 12 23 C10 22 7 20 5 16 C2 10 7 5 12 1 Z"/>' +
        '<path d="M12 4 L12 23 M12 11 L16 8 M12 15 L8 12" fill="none" stroke="rgb(80 30 10 / 0.45)" stroke-width="1" stroke-linecap="round"/>'
    },
    winter: {
      count: 40, land: 22, snow: true, size: [5, 11], speed: [6, 10], flutter: ["drift"],
      colors: ["#b9cde4", "#cfdcec", "#a9c0dc", "#ffffff"],
      shape: '<circle cx="12" cy="12" r="8"/>'
    }
  };

  function seasonFromDate() {
    var m = new Date().getMonth();
    return m < 2 || m === 11 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";
  }

  function seasons(work) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var layer = work.querySelector(".falling");
    var buttons = [].slice.call(work.querySelectorAll(".seasons__btn"));
    var season = seasonFromDate();
    try {
      var saved = localStorage.getItem("season");
      if (SEASONS[saved]) season = saved;
    } catch (e) {}
    var seen = false;

    function between(range) {
      return range[0] + Math.random() * (range[1] - range[0]);
    }

    function piece(kind, size) {
      var el = document.createElement("span");
      el.className = "falling__piece";
      el.style.width = el.style.height = size + "px";
      var color = kind.colors[Math.floor(Math.random() * kind.colors.length)];
      var inner = document.createElement("span");
      inner.className = kind.flutter[Math.floor(Math.random() * kind.flutter.length)];
      inner.style.animationDuration = (1.2 + Math.random() * 1.2).toFixed(2) + "s";
      inner.innerHTML = '<svg viewBox="0 0 24 24" fill="' + color + '"' +
        (kind.glow ? ' style="filter: drop-shadow(0 0 6px ' + color + ')"' : "") + ">" + kind.shape + "</svg>";
      el.appendChild(inner);
      layer.appendChild(el);
      return el;
    }

    function play() {
      layer.textContent = "";
      if (reduceMotion || !layer.animate) return;
      var kind = SEASONS[season];
      var box = work.getBoundingClientRect();
      var w = box.width;
      var h = work.offsetHeight;
      /* where things can land: the top edge of each screen and shelf */
      var surfaces = [].slice.call(work.querySelectorAll("[data-land]"))
        .map(function (el) {
          var r = el.getBoundingClientRect();
          return { x: r.left - box.left, y: r.top - box.top, w: r.width };
        })
        .filter(function (s) {
          return s.w > 20 && s.y > 0;
        });
      var weight = surfaces.reduce(function (t, s) {
        return t + s.w;
      }, 0);
      function pickSurface() {
        var r = Math.random() * weight;
        for (var i = 0; i < surfaces.length; i++) {
          r -= surfaces[i].w;
          if (r <= 0) return surfaces[i];
        }
        return surfaces[0];
      }

      for (var i = 0; i < kind.count; i++) {
        var size = Math.round(between(kind.size));
        var el = piece(kind, size);
        var delay = Math.random() * 2400;
        var landing = i < kind.land && surfaces.length;

        if (landing) {
          var s = pickSurface();
          var x = s.x + 8 + Math.random() * Math.max(0, s.w - 16) - size / 2;
          var y = s.y - size * (kind.snow ? 0.85 : 0.6);
          var startY = -40;
          var fall = (between(kind.speed) * 1000 * (y - startY)) / h;
          var tilt = kind.snow ? 0 : (Math.random() > 0.5 ? 1 : -1) * (70 + Math.random() * 35);
          var hop = kind.snow ? 4 : 12;
          var at = function (dy, r) {
            return "translate(" + x.toFixed(0) + "px," + (y - dy).toFixed(0) + "px) rotate(" + r + "deg)";
          };
          el.animate(
            [
              { transform: "translate(" + x.toFixed(0) + "px," + startY + "px) rotate(0deg)", opacity: 0, easing: "cubic-bezier(.45,0,.9,.6)" },
              { opacity: 1, offset: 0.06 },
              { transform: at(0, tilt), offset: 0.8, easing: "ease-out" },
              { transform: at(hop, tilt + 10), offset: 0.87, easing: "ease-in" },
              { transform: at(0, tilt), offset: 0.93, easing: "ease-out" },
              { transform: at(3, tilt - 4), offset: 0.965, easing: "ease-in" },
              { transform: at(0, tilt), opacity: 1 }
            ],
            { duration: Math.max(2600, fall / 0.8), delay: delay, fill: "both" }
          );
          /* the flutter dies down as it lands */
          el.firstChild.className = "";
          el.firstChild.animate(
            kind.snow
              ? [{ transform: "translateX(-8px)" }, { transform: "translateX(8px)", offset: 0.4 }, { transform: "none", offset: 0.8 }, { transform: "none" }]
              : [
                  { transform: "translateX(-22px) rotate(-30deg)" },
                  { transform: "translateX(20px) rotate(28deg)", offset: 0.2 },
                  { transform: "translateX(-16px) rotate(-22deg)", offset: 0.4 },
                  { transform: "translateX(12px) rotate(16deg)", offset: 0.6 },
                  { transform: "translateX(-5px) rotate(-6deg)", offset: 0.74 },
                  { transform: "none", offset: 0.8 },
                  { transform: "none" }
                ],
            { duration: Math.max(2600, fall / 0.8), delay: delay, fill: "both", easing: "ease-in-out" }
          );
        } else {
          var left = 20 + Math.random() * (w - 40);
          var from = kind.rise ? h * (0.55 + Math.random() * 0.4) : -40;
          var to = kind.rise ? from - h * 0.6 : h + 20;
          el.animate(
            kind.rise
              ? [
                  { transform: "translate(" + left + "px," + from + "px)", opacity: 0 },
                  { opacity: 1, offset: 0.15 },
                  { opacity: 0.35, offset: 0.4 },
                  { opacity: 1, offset: 0.6 },
                  { opacity: 0.5, offset: 0.8 },
                  { transform: "translate(" + left + "px," + to + "px)", opacity: 0 }
                ]
              : [
                  { transform: "translate(" + left + "px," + from + "px)", opacity: 0 },
                  { opacity: 1, offset: 0.08 },
                  { opacity: 1, offset: 0.85 },
                  { transform: "translate(" + left + "px," + to + "px)", opacity: 0 }
                ],
            { duration: between(kind.speed) * 1000, delay: delay, fill: "both" }
          );
        }
      }
    }

    function set(next, replay) {
      season = next;
      work.dataset.season = season;
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.season === season));
      });
      if (replay) {
        seen = true;
        play();
      }
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        try {
          localStorage.setItem("season", b.dataset.season);
        } catch (e) {}
        set(b.dataset.season, true);
      });
    });
    set(season, false);

    /* play once when the shelves come into view */
    var shelves = work.querySelector(".shelves");
    if ("IntersectionObserver" in window && shelves) {
      var io = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting && !seen) {
            seen = true;
            io.disconnect();
            play();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(shelves);
    }
    /* landed pieces would sit in the wrong place after a resize: clear them */
    var lastWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        layer.textContent = "";
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
