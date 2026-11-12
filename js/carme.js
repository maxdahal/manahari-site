/* Carme-style page behaviour: the header hides while reading down and comes
   back on the way up, sections ease in as they arrive, and the big name in
   the footer pans a little with the scroll. All of it stands still for
   reduced motion or the pause button; the page reads the same without it. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function still() {
    return reduce.matches || root.classList.contains("motion-paused");
  }

  /* the caption beside the name rolls up to the next title, the same
     movement as the links on hover; it stays on the first when motion is off */
  var role = document.querySelector(".cm-brand__role");
  if (role) {
    var titles = role.getAttribute("data-words").split("|");
    var track = role.querySelector(".cm-role");
    var rows = track.children;
    var shown = 0;
    setInterval(function () {
      if (still() || document.hidden) return;
      shown = (shown + 1) % titles.length;
      rows[1].textContent = titles[shown];
      track.classList.add("is-rolling");
      setTimeout(function () {
        track.style.transition = "none";
        track.classList.remove("is-rolling");
        rows[0].textContent = titles[shown];
        rows[1].textContent = "";
        void track.offsetWidth;
        track.style.transition = "";
      }, 440);
    }, 2800);
  }

  /* header: hides after a little downward scroll, returns after a little up.
     The page also learns whether it is hidden (a class on the body), so the
     sticky step bar and the held opening statement can slide up into the
     space it leaves instead of staying 84px down. */
  var header = document.querySelector(".cm-header");
  if (header) {
    var last = window.scrollY;
    var travelled = 0;
    var hidden = false;
    var setHidden = function (on) {
      if (on === hidden) return;
      hidden = on;
      header.classList.toggle("is-hidden", on);
      document.body.classList.toggle("cm-nav-hidden", on);
    };
    /* only keyboard focus keeps the header up; a mouse click on the theme
       button would otherwise pin it open for good */
    var keyboardInside = function () {
      var el = document.activeElement;
      return !!(el && header.contains(el) && el.matches(":focus-visible"));
    };
    var menuOpen = function () {
      var menu = document.getElementById("menu");
      return !!(menu && menu.classList.contains("is-open"));
    };
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var delta = y - last;
      last = y;
      if (!delta) return;
      if (y < 24 || keyboardInside() || menuOpen()) {
        setHidden(false);
        travelled = 0;
        return;
      }
      travelled = Math.sign(delta) === Math.sign(travelled) ? travelled + delta : delta;
      if (travelled > 20) setHidden(true);
      else if (travelled < -6) setHidden(false);
    }, { passive: true });
    header.addEventListener("focusin", function () {
      if (keyboardInside()) setHidden(false);
    });
  }

  /* sections ease in once as they come into view */
  var items = [].slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && items.length) {
    root.classList.add("cm-js");
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        seen.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (item) {
      seen.observe(item);
    });
  }

  /* the resume opens in a dialog (the PDF is loaded the first time it opens);
     the links inside it, and a middle-click or ctrl-click, still go to the file */
  var rdialog = document.querySelector(".cm-rdialog");
  if (rdialog && rdialog.showModal) {
    var pdfFrame = rdialog.querySelector(".cm-rdialog__frame");
    var rOpener = null;
    document.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest('a[href="/resume.pdf"]');
      if (!link || rdialog.contains(link) || event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
      event.preventDefault();
      rOpener = link;
      var menu = document.getElementById("menu");
      if (menu && menu.classList.contains("is-open")) {
        var toggle = document.querySelector(".menu-button");
        if (toggle) toggle.click();
      }
      if (!pdfFrame.getAttribute("src")) pdfFrame.setAttribute("src", pdfFrame.getAttribute("data-src"));
      rdialog.showModal();
    });
    rdialog.querySelector("[data-close]").addEventListener("click", function () {
      rdialog.close();
    });
    rdialog.addEventListener("click", function (event) {
      if (event.target === rdialog) rdialog.close();
    });
    rdialog.addEventListener("close", function () {
      if (rOpener && rOpener.offsetParent) rOpener.focus();
    });
  }

  /* the scroll cue in the hero fades once you have started scrolling */
  var cue = document.querySelector(".cm-scroll");
  if (cue) {
    var fade = function () {
      cue.classList.toggle("is-gone", window.scrollY > 40);
    };
    window.addEventListener("scroll", fade, { passive: true });
    fade();
  }

  /* Home and About: the opening statement is held in place while its words
     light up one by one as you scroll (the section is made tall and the
     text sticks); without motion it simply reads in full */
  function wrapWords(node, out) {
    [].slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
          var span = document.createElement("span");
          span.className = "cm-sw";
          span.textContent = part;
          out.push(span);
          frag.appendChild(span);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) wrapWords(child, out);
    });
  }
  [].slice.call(document.querySelectorAll(".cm-about")).forEach(function (about) {
    var statement = about.querySelector(".cm-about__text");
    if (!statement) return;
    var spans = [];
    wrapWords(statement, spans);
    /* the home hero starts with just its first word ("I’m") already lit;
       the rest fills in as you scroll */
    var litTo = about.classList.contains("cm-hero") ? 0 : -1;
    var light = function () {
      if (!about.classList.contains("is-held")) return;
      var box = about.getBoundingClientRect();
      var head = 84;
      var travel = box.height - (window.innerHeight - head);
      var progress = travel > 0 ? Math.min(Math.max((head - box.top) / travel, 0), 1) : 1;
      var at = progress * (spans.length + 3) - 1.5;
      spans.forEach(function (span, i) {
        span.style.opacity = i <= litTo ? "1" : (0.16 + 0.84 * Math.min(Math.max(at - i + 1, 0), 1)).toFixed(2);
      });
    };
    var hold = function () {
      var on = !still();
      about.classList.toggle("is-held", on);
      if (on) light();
      else spans.forEach(function (span) {
        span.style.opacity = "";
      });
    };
    window.addEventListener("scroll", light, { passive: true });
    window.addEventListener("resize", light);
    document.addEventListener("motionchange", hold);
    reduce.addEventListener("change", hold);
    hold();
  });

  /* My journey: the line draws down the middle as you scroll, and each stop
     lights as the line reaches its pin (all of them again without motion) */
  var route = document.querySelector(".cm-journey .cv-route");
  if (route) {
    var stops = [].slice.call(route.querySelectorAll(".cv-stop"));
    var draw = function () {
      if (!route.classList.contains("cm-draw")) return;
      var box = route.getBoundingClientRect();
      var reach = window.innerHeight * 0.6 - box.top;
      var progress = Math.min(Math.max(reach / box.height, 0), 1);
      route.style.setProperty("--route", progress.toFixed(3));
      stops.forEach(function (stop) {
        var pin = stop.querySelector(".cv-stop__pin").getBoundingClientRect();
        stop.classList.toggle("is-reached", progress >= 0.999 || pin.top - box.top <= progress * box.height + 8);
      });
    };
    var sync = function () {
      var on = !still();
      route.classList.toggle("cm-draw", on);
      if (on) draw();
      else {
        route.style.setProperty("--route", 1);
        stops.forEach(function (stop) {
          stop.classList.add("is-reached");
        });
      }
    };
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", draw);
    document.addEventListener("motionchange", sync);
    reduce.addEventListener("change", sync);
    sync();
  }

  /* work: the case studies are held in place while you scroll; each next one
     wipes in over the last (its --q goes 0 to 1) and its picture settles */
  var work = document.querySelector(".cm-work");
  var reel = work && work.querySelector(".cm-reel");
  if (reel) {
    var panels = [].slice.call(reel.querySelectorAll(".cm-panel"));
    var count = reel.querySelector(".cm-reel__now");
    var clamp = function (v) {
      return Math.min(Math.max(v, 0), 1);
    };
    var inOut = function (t) {
      return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    };
    var current = -1;
    var run = function () {
      if (!work.classList.contains("is-reel")) return;
      var stage = reel.querySelector(".cm-reel__stage");
      var travel = reel.offsetHeight - stage.offsetHeight;
      var progress = clamp(-reel.getBoundingClientRect().top / travel);
      var steps = panels.length - 1;
      var along = panels.map(function (panel, i) {
        return i ? clamp(progress * steps - (i - 1)) : 1;
      });
      panels.forEach(function (panel, i) {
        if (i) panel.style.setProperty("--q", inOut(along[i]).toFixed(3));
        var img = panel.querySelector("img");
        var coming = i && along[i] < 1 ? 1.3 - 0.3 * (1 - Math.pow(1 - along[i], 3)) : 1;
        var going = i < steps ? 1 + 0.12 * along[i + 1] * along[i + 1] : 1;
        img.style.scale = (coming * going).toFixed(3);
      });
      var now = Math.min(steps, Math.round(progress * steps));
      if (now !== current) {
        current = now;
        panels.forEach(function (panel, i) {
          panel.classList.toggle("is-current", i === now);
        });
        if (count) count.textContent = ("0" + (now + 1)).slice(-2);
      }
    };
    var hold = function () {
      var on = !still();
      work.classList.toggle("is-reel", on);
      if (on) {
        current = -1;
        run();
      } else {
        panels.forEach(function (panel) {
          panel.style.removeProperty("--q");
          panel.classList.remove("is-current");
          panel.querySelector("img").style.scale = "";
        });
      }
    };
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    document.addEventListener("motionchange", hold);
    reduce.addEventListener("change", hold);
    hold();
  }

  /* the footer name slides sideways as the page ends */
  var name = document.querySelector(".cm-footer__name");
  if (name) {
    var frame = 0;
    var pan = function () {
      frame = 0;
      var box = name.getBoundingClientRect();
      var progress = 1 - Math.min(Math.max(box.top / window.innerHeight, 0), 1);
      name.style.setProperty("--pan", still() ? "0" : (progress * -8).toFixed(2) + "%");
    };
    window.addEventListener("scroll", function () {
      if (!frame) frame = requestAnimationFrame(pan);
    }, { passive: true });
    document.addEventListener("motionchange", pan);
    pan();
  }
})();
