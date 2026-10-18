/* Home page behaviour: stacked sections, hero swap, statement fill, the ID
   badge, case-study reveals, marquee and the artwork lightbox. */
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

    /* Case-study images: clip reveal when they arrive */
    var items = document.querySelectorAll(".work__item");
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px" }
      );
      items.forEach(function (item) {
        io.observe(item);
      });
    } else {
      items.forEach(function (item) {
        item.classList.add("is-in");
      });
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

    /* Everything that follows the scroll position */
    var hero = document.querySelector(".hero");
    var rows = document.querySelectorAll(".marquee__row");
    var marquee = document.querySelector(".marquee");
    var images = document.querySelectorAll(".work__image");
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

      images.forEach(function (frame) {
        var r = frame.getBoundingClientRect();
        var q = clamp((vh - r.top) / (vh + r.height));
        frame.style.setProperty("--py", ((q - 0.5) * -8).toFixed(2));
      });

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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
