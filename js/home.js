/* Home page behaviour: the hero name and skill rings, the recruiter
   summary, the motion tip, nav jumps and highlight, the hero swap, the
   case-study seasons, the artwork spotlight and lightbox. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v) {
    return Math.max(0, Math.min(1, v));
  };

  /* Hero name: one span per letter, numbered for the CSS stagger. The h1
     keeps its words as its accessible name so it is not read letter by letter. */
  function splitHeroName() {
    var name = document.querySelector(".hero__name");
    if (!name) return;
    name.setAttribute(
      "aria-label",
      [].map.call(name.querySelectorAll(".hero__word:not(.hero__word--role)"), function (w) {
        return w.textContent.trim();
      }).join(" ")
    );
    [].forEach.call(name.querySelectorAll(".hero__word"), function (word) {
      var i = 0;
      [].slice.call(word.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          Array.from(node.textContent).forEach(function (c) {
            var ch = document.createElement("span");
            ch.className = "hero__ch";
            ch.setAttribute("aria-hidden", "true");
            ch.textContent = c;
            ch.style.setProperty("--i", i++);
            word.insertBefore(ch, node);
          });
          word.removeChild(node);
        } else {
          node.classList.add("hero__ch");
          node.style.setProperty("--i", i++);
        }
      });
    });
  }

  /* Skill rings round the hero name: the ring's text is repeated until it
     fills the ring at about one letter per em, then each letter is numbered
     for its place on the ring. The CSS does the rest. */
  function buildSkillRings() {
    [].forEach.call(document.querySelectorAll(".skills3d__spin[data-text]"), function (spin) {
      var style = getComputedStyle(spin);
      var r = parseFloat(style.getPropertyValue("--r-px")) || spin.closest(".skills3d").offsetWidth / 2;
      var room = Math.floor((2 * Math.PI * r) / (parseFloat(style.fontSize) * 1.05));
      var text = spin.dataset.text.toUpperCase();
      var chars = Array.from(text);
      while (chars.length + text.length <= room) chars = chars.concat(Array.from(text));
      spin.style.setProperty("--n", chars.length);
      chars.forEach(function (c, i) {
        var ch = document.createElement("span");
        ch.className = "skills3d__ch";
        ch.dataset.c = c === " " ? "\u00a0" : c;
        ch.style.setProperty("--i", i);
        spin.appendChild(ch);
      });
    });
  }

  /* Pause motion: the button in the top bar toggles .motion-paused on the
     page (the CSS pauses what it animates), tells the falling leaves, and
     remembers the choice for next time. */
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

  function start() {
    splitHeroName();
    initRecruiter();
    motionToggle();
    buildSkillRings();
    var sections = [].slice.call(document.querySelectorAll(".sections > section"));

    /* In-page links land with the section's top just under the top bar.
       The footer sits under the page and is revealed at the very bottom. */
    var bar = document.querySelector(".cp-bar");
    function goTo(id, smooth) {
      var target = document.getElementById(id);
      if (!target) return false;
      var section = target.closest(".sections > section");
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
      var current = 0;
      var best = -Infinity;
      outlineTargets.forEach(function (target, i) {
        if (!target) return;
        /* the footer waits under the page, so it is "reached" only where
           the page above it ends */
        /* the section whose top passed the middle most recently, whatever
           order the links are in */
        var top = target.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = i;
        }
      });
      outlineLinks.forEach(function (link, i) {
        if (i === current) link.setAttribute("aria-current", i === 0 ? "page" : "location");
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
      count: 26, land: 12, wind: 0.4, size: [12, 20], speed: [6, 9], flutter: ["flutter", "flutter flutter--r"],
      colors: ["#f4b6c8", "#f9cfdc", "#eaa0b8", "#f7c4d4"],
      shape: '<path d="M12 2 C16 6 17 12 14 18 C13 20 12.5 21 12 22 C11.5 21 11 20 10 18 C7 12 8 6 12 2 Z"/>'
    },
    /* dandelion seeds: greyed, with hair-thin threads, carried across on a
       breeze (kind.breeze) instead of falling; their colour comes from the
       CSS (--seed), so they suit light and dark paper */
    summer: {
      count: 22, land: 4, seed: true, breeze: true, size: [18, 28], speed: [10, 16], flutter: ["hover"],
      colors: ["var(--seed)"],
      shape: '<path d="M12 9.5 L12 20 M12 9.5 L3.0 9.5 M12 9.5 L3.1 7.9 M12 9.5 L3.5 6.4 M12 9.5 L4.2 5.0 M12 9.5 L5.1 3.7 M12 9.5 L6.2 2.6 M12 9.5 L7.5 1.7 M12 9.5 L8.9 1.0 M12 9.5 L10.4 0.6 M12 9.5 L12.0 0.5 M12 9.5 L13.6 0.6 M12 9.5 L15.1 1.0 M12 9.5 L16.5 1.7 M12 9.5 L17.8 2.6 M12 9.5 L18.9 3.7 M12 9.5 L19.8 5.0 M12 9.5 L20.5 6.4 M12 9.5 L20.9 7.9 M12 9.5 L21.0 9.5" fill="none" stroke="var(--seed)" stroke-width="0.35" stroke-linecap="round"/><ellipse cx="12" cy="21" rx="0.9" ry="1.8" fill="var(--seed-core)"/>'
    },
    autumn: {
      count: 22, land: 10, size: [16, 30], speed: [4.5, 7.5], flutter: ["flutter", "flutter flutter--r"],
      colors: ["#d9682b", "#e8a33d", "#b8442a", "#c97b2a", "#9c3b1e", "#e0b04a"],
      wind: 0.35,
      /* a few small maple leaves among the others */
      extra: { share: 0.3, scale: 0.7, colors: ["#c8402a", "#d9552c", "#b8342a", "#e0782f"],
        shape: '<path d="M12 1 L13.6 5.6 L16.8 4 L16 8.4 L20.8 7.6 L18.8 11.2 L22.4 12.4 L17.6 15.2 L18.4 17.6 L13.2 16.4 L12.8 22.4 L11.2 22.4 L10.8 16.4 L5.6 17.6 L6.4 15.2 L1.6 12.4 L5.2 11.2 L3.2 7.6 L8 8.4 L7.2 4 L10.4 5.6 Z"/><path d="M12 6 L12 22 M12 13 L17 9.5 M12 13 L7 9.5" fill="none" stroke="rgb(70 20 10 / 0.4)" stroke-width="0.8" stroke-linecap="round"/>' },
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
      var look = kind.extra && Math.random() < kind.extra.share ? kind.extra : kind;
      if (look !== kind) size = Math.round(size * look.scale);
      el.style.width = el.style.height = size + "px";
      var color = look.colors[Math.floor(Math.random() * look.colors.length)];
      var inner = document.createElement("span");
      inner.className = kind.flutter[Math.floor(Math.random() * kind.flutter.length)];
      inner.style.animationDuration = (1.2 + Math.random() * 1.2).toFixed(2) + "s";
      inner.innerHTML = '<svg viewBox="0 0 24 24" fill="' + color + '"' +
        (kind.glow ? ' style="filter: drop-shadow(0 0 6px ' + color + ')"' : "") + ">" + look.shape + "</svg>";
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

      /* Wind: on each play it blows one way; some of the falling pieces
         (kind.wind of them) get caught by a gust partway down, swept
         sideways with a little lift, then fall on */
      var windDir = Math.random() < 0.5 ? 1 : -1;
      for (var i = 0; i < kind.count; i++) {
        var size = Math.round(between(kind.size));
        var el = piece(kind, size);
        var delay = Math.random() * 2400;
        var landing = i < kind.land && surfaces.length;

        if (landing) {
          var s = pickSurface();
          var x = s.x + 8 + Math.random() * Math.max(0, s.w - 16) - size / 2;
          var y = s.y - size * (kind.snow ? 0.85 : kind.seed ? 0.95 : 0.6);
          var startY = -40;
          var fall = (between(kind.speed) * 1000 * (y - startY)) / h;
          var tilt = kind.snow || kind.seed ? 0 : (Math.random() > 0.5 ? 1 : -1) * (70 + Math.random() * 35);
          var hop = kind.snow || kind.seed ? 4 : 12;
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
            kind.snow || kind.seed
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
              : kind.breeze
              ? (function () {
                  /* drifts across the section with the wind, tilted into it,
                     bobbing on the air and sinking only a little */
                  var y0 = h * (0.05 + Math.random() * 0.6);
                  var x0 = windDir > 0 ? -40 - Math.random() * 60 : w + 40 + Math.random() * 60;
                  var span = windDir * w * (0.7 + Math.random() * 0.5);
                  var sink = h * (0.08 + Math.random() * 0.18);
                  var tilt = windDir * (12 + Math.random() * 14);
                  var bob = 14 + Math.random() * 18;
                  var frames = [];
                  for (var k = 0; k <= 6; k++) {
                    var f = k / 6;
                    frames.push({
                      offset: f,
                      transform: "translate(" + (x0 + span * f).toFixed(0) + "px," + (y0 + sink * f + Math.sin(f * Math.PI * 3) * bob).toFixed(0) + "px) rotate(" + (tilt + Math.sin(f * Math.PI * 4) * 8).toFixed(1) + "deg)",
                      opacity: k === 0 || k === 6 ? 0 : 1
                    });
                  }
                  return frames;
                })()
              : Math.random() < (kind.wind || 0)
              ? (function () {
                  /* start upwind, so the gust carries it across */
                  var x0 = windDir > 0 ? 20 + Math.random() * w * 0.55 : w * 0.45 + Math.random() * (w * 0.55 - 20);
                  var dx = windDir * w * (0.22 + Math.random() * 0.28);
                  var at = function (x, y) {
                    return "translate(" + x.toFixed(0) + "px," + y.toFixed(0) + "px)";
                  };
                  var gust = 0.3 + Math.random() * 0.2;
                  var yAt = function (f) {
                    return from + (to - from) * f;
                  };
                  return [
                    { transform: at(x0, from), opacity: 0 },
                    { opacity: 1, offset: 0.08 },
                    { transform: at(x0 + dx * 0.05, yAt(gust)), offset: gust, easing: "cubic-bezier(0.5, 0, 0.3, 1)" },
                    { transform: at(x0 + dx, yAt(gust + 0.06)), offset: gust + 0.22, easing: "ease-in" },
                    { opacity: 1, offset: 0.88 },
                    { transform: at(x0 + dx * 1.15, to), opacity: 0 }
                  ];
                })()
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
      if (document.documentElement.classList.contains("motion-paused")) pauseLeaves(true);
    }

    /* the pause-motion button holds the pieces where they are */
    function pauseLeaves(paused) {
      layer.getAnimations({ subtree: true }).forEach(function (a) {
        if (paused) a.pause();
        else a.play();
      });
    }
    document.addEventListener("motionchange", function (event) {
      pauseLeaves(event.detail.paused);
    });

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
