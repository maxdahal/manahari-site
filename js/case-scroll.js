/* Case study and About motion, with Lenis (the smooth, weighted scroll) and
   GSAP with ScrollTrigger, in step with the homepage (scroll.js):
     top     the title's words slide up into place, the rest fades in, the
             before and after opens out from its middle (About: the ID badge
             fades in)
     acts    each act's (or About section's) title slides up out of its line
             as it comes in
     parts   each part's title and what follows rise in, one after another;
             on About, each block, card, chapter and plaque
     images  pictures ease from zoomed in to resting as they pass
   Links to sections on the page glide there with Lenis. Nothing runs for
   reduced motion or while motion is paused (the pause button): Lenis stops
   and every GSAP change is undone, so the page simply shows and scrolls
   natively. While it runs, the site's CSS text animations step aside
   (.has-gsap). */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ctx = null;
  var lenis = null;
  var tick = function (time) {
    if (lenis) lenis.raf(time * 1000);
  };

  /* the title's words and each act title's, each word in its own mask so it
     can slide up out of it (the heading keeps its text as one string for
     screen readers through aria-label) */
  function wrapWords(el) {
    var text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    /* a written full stop gives way to the dot */
    text = text.replace(/\.$/, "");
    el.textContent = "";
    var line = document.createElement("span");
    line.className = "cs-line";
    line.setAttribute("aria-hidden", "true");
    text.split(/\s+/).forEach(function (word, i, all) {
      var mask = document.createElement("span");
      var w = document.createElement("span");
      mask.className = "cs-m";
      w.className = "cs-w";
      w.textContent = word;
      /* the accent dot rides on the last word, so it never wraps alone */
      if (i === all.length - 1) {
        var dot = document.createElement("i");
        dot.className = "cs-dot";
        w.appendChild(dot);
      }
      mask.appendChild(w);
      line.appendChild(mask);
      if (i < all.length - 1) line.appendChild(document.createTextNode(" "));
    });
    el.appendChild(line);
  }
  document.querySelectorAll("#main :is(.a-title, .a-act > h2, .pv-h1, .pv-h2)").forEach(wrapWords);

  /* in as it comes into view, back out when you scroll up past it */
  function enter(targets, trigger, vars, start) {
    targets = gsap.utils.toArray(targets);
    if (!targets.length) return;
    gsap.from(targets, Object.assign({
      opacity: 0,
      y: 48,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger || targets,
        start: start || "top 85%",
        toggleActions: "play none none reverse"
      }
    }, vars));
  }

  /* a link to a place on this page */
  function glide(event) {
    var a = event.target.closest && event.target.closest("a[href^='#']");
    if (!a || !lenis) return;
    var target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target) return;
    event.preventDefault();
    var bar = document.querySelector(".a-bar");
    var offset = -((bar ? bar.offsetHeight : 0) + 24);
    lenis.scrollTo(target === document.getElementById("main") ? 0 : target, { offset: offset });
    history.pushState(null, "", a.getAttribute("href"));
  }

  function build() {
    root.classList.add("has-gsap");
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.09 });
      window.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.addEventListener("click", glide);
    }
    ctx = gsap.context(function () {
      /* the top */
      var top = gsap.timeline({ delay: 0.1 })
        .from("#main :is(.a-title, .pv-h1) .cs-w", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.08 })
        .from("#main :is(.a-hero2__intro > :not(.a-title), .pv-about__text > :not(.pv-h1))", { opacity: 0, y: 24, duration: 0.8, ease: "power2.out", stagger: 0.1 }, 0.35);
      if (document.querySelector("#main .a-hero2__image")) {
        top.from("#main .a-hero2__image", { clipPath: "inset(0 50% 0 50% round 16px)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" }, 0.4);
        enter("#main .a-hero2__meta, #main .a-hero2__aside", "#main .a-hero2__meta", { stagger: 0.12 }, "top 90%");
      }
      if (document.querySelector("#main .pv-about__badge")) {
        top.from("#main .pv-about__badge", { opacity: 0, y: 40, duration: 1, ease: "power3.out" }, 0.4);
        enter("#main .pv-bento > li", "#main .pv-bento", { stagger: 0.08 }, "top 90%");
      }

      /* acts: the title slides up out of its line */
      gsap.utils.toArray("#main :is(.a-act > h2, .pv-h2)").forEach(function (h) {
        gsap.from(h.querySelectorAll(".cs-w"), {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: h, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });

      /* parts: the title, then each thing under it */
      gsap.utils.toArray("#main .a-part").forEach(function (part) {
        /* (the sandboxes have their own reveal) */
        gsap.utils.toArray(part.children).filter(function (child) {
          return !child.classList.contains("js-reveal");
        }).forEach(function (child) {
          enter(child, child, { duration: 0.8 }, "top 88%");
        });
      });

      /* pictures settle as they pass */
      gsap.utils.toArray("#main .a-part figure > img, #main .a-part .row img").forEach(function (img) {
        var box = img.parentElement;
        box.classList.add("cs-zoom");
        gsap.fromTo(img, { scale: 1.12 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      /* About: each block, card, chapter and plaque */
      gsap.utils.toArray("#main :is(.pv-block > :not(.pv-h2, .pv-chapters, .pv-papers, .pv-plaques, .pv-accs), .pv-acc, .pv-chapter, .pv-paper, .pv-plaque, .pv-contact__photo, .pv-contact__text > :not(.pv-h2))").forEach(function (el) {
        enter(el, el, { duration: 0.8 }, "top 90%");
      });

      /* more projects */
      enter("#main .a-more > a", "#main .a-more", { stagger: 0.12 });
    });
  }

  function teardown() {
    if (ctx) ctx.revert();
    ctx = null;
    document.querySelectorAll(".cs-zoom").forEach(function (box) {
      box.classList.remove("cs-zoom");
    });
    if (lenis) {
      gsap.ticker.remove(tick);
      document.removeEventListener("click", glide);
      lenis.destroy();
      lenis = null;
      window.lenis = null;
    }
    root.classList.remove("has-gsap");
  }

  function sync() {
    var off = still.matches || root.classList.contains("motion-paused");
    if (off && ctx) teardown();
    if (!off && !ctx) build();
  }

  document.addEventListener("motionchange", sync);
  if (still.addEventListener) still.addEventListener("change", sync);
  sync();
  /* pictures and fonts change heights after load: measure again */
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
