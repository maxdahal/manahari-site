/* Home page behaviour: the recruiter summary, the motion tip, nav jumps
   and highlight, the artwork spotlight and lightbox. */
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

  function start() {
    initRecruiter();
    motionToggle();

    /* In-page links land with the section's top just under the top bar.
       The footer sits under the page and is revealed at the very bottom. */
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
