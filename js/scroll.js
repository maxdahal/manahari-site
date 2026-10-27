/* Home page motion, with Lenis (the smooth, weighted scroll) and GSAP with
   ScrollTrigger, after catalinvintila.design:
     hero       the words of the headline slide up into place one after
                another, the pictures in it open out from their middle; the labels and the
                rest fade in; "code." is typed out ("design" builds itself
                in CSS)
     statement  held in place while its words light up one by one as you
                scroll
     work       each case study's picture eases from zoomed in to resting as
                it passes; its name rises in
     artwork    the title rises; the paintings pop in, at different depths
     contact    the closing statement echoes the hero: the words slide up,
                the portrait opens out, the email and buttons follow
   Nothing runs for reduced motion or while motion is paused (the pause
   button): Lenis stops and every GSAP change is undone, so the page simply
   shows and scrolls natively. While it runs, the site's CSS text
   animations step aside (.has-gsap). */
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

  /* the statement's words, each in its own span so they can light up */
  var statement = document.querySelector(".cv-statement__text");
  if (statement) {
    var words = statement.textContent.trim().split(/\s+/);
    statement.textContent = "";
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "cv-sw";
      span.textContent = word;
      statement.appendChild(span);
      if (i < words.length - 1) statement.appendChild(document.createTextNode(" "));
    });
  }

  /* "code." letter by letter, so it can be typed out (the h1's aria-label
     keeps it one word for screen readers) */
  var code = document.querySelector(".cv-hero .cv-code");
  if (code) {
    var letters = code.textContent.split("");
    code.textContent = "";
    letters.forEach(function (letter) {
      var span = document.createElement("span");
      span.className = "cv-key";
      span.textContent = letter;
      code.appendChild(span);
    });
  }

  /* in as it comes into view, back out when you scroll up past it */
  function enter(targets, trigger, vars, start) {
    if (!targets || (targets.length !== undefined && !targets.length)) return;
    gsap.from(targets, Object.assign({
      opacity: 0,
      y: 60,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger || targets,
        start: start || "top 82%",
        toggleActions: "play none none reverse"
      }
    }, vars));
  }

  function build() {
    root.classList.add("has-gsap");
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.09 });
      window.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    ctx = gsap.context(function () {
      /* hero: the headline's words slide up, the pictures open out */
      if (document.querySelector(".cv-hero")) {
        gsap.timeline({ delay: 0.15 })
          .from(".cv-hero .cv-w:not(.cv-code)", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.06 })
          .from(".cv-hero .cv-pill", { clipPath: "inset(0 50% 0 50% round 999px)", duration: 1, ease: "power3.inOut", stagger: 0.12, clearProps: "clipPath" }, 0.25)
          /* "code." is typed out, one key at a time */
          .from(".cv-hero .cv-key", { display: "none", duration: 0.01, stagger: 0.12 }, 1)
          .from(".cv-hero__labels, .cv-hero__foot", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, 0.6);
      }

      /* statement: held while its words light up */
      var block = document.querySelector(".cv-statement");
      if (block && statement) {
        gsap.to(statement.querySelectorAll(".cv-sw"), {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: block, start: "top top", end: "+=120%", scrub: 0.5, pin: true }
        });
        enter(block.querySelectorAll(".cv-stats li, .cv-more"), ".cv-stats", { stagger: 0.1, y: 30 }, "top 95%");
      }

      /* work: each picture eases from zoomed in to resting; the name rises */
      enter(".cv-work__head", ".cv-work");
      /* the held counter shows over the panels and follows them */
      var counter = document.querySelector(".cv-counter");
      var now = counter && counter.querySelector(".cv-counter__now");
      if (counter) {
        ScrollTrigger.create({
          trigger: ".cv-projects",
          start: "top 60%",
          end: "bottom 80%",
          toggleClass: { targets: counter, className: "is-on" }
        });
        gsap.utils.toArray(".cv-project").forEach(function (item, i) {
          ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onToggle: function (self) {
              if (self.isActive && now) now.textContent = ("0" + (i + 1)).slice(-2);
            }
          });
        });
      }
      gsap.utils.toArray(".cv-project__link").forEach(function (panel) {
        gsap.fromTo(panel.querySelector("img"), { scale: 1.25 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true }
        });
        enter(panel.querySelectorAll(".cv-project__words > *"), panel, { y: 80, stagger: 0.1, duration: 1 }, "top 55%");
      });

      /* skills, then research and recognition: the title, then each row */
      enter(".cv-skills .cv-heading", ".cv-skills");
      enter(".cv-skill", ".cv-skills__list", { y: 40, stagger: 0.08 });
      enter(".cv-recog .cv-heading", ".cv-recog");
      gsap.utils.toArray(".cv-rows").forEach(function (list) {
        enter(list.previousElementSibling, list, { y: 20 });
        enter(list.children, list, { y: 30, stagger: 0.06 });
      });

      /* artwork */
      enter(".cv-art__head", ".artwork");
      gsap.utils.toArray(".artwork__item").forEach(function (item, i) {
        enter(item, ".spot", { scale: 0.85, y: 50, delay: (i % 5) * 0.08 }, "top 75%");
        gsap.to(item, {
          y: (i % 3 - 1) * -30,
          ease: "none",
          scrollTrigger: { trigger: ".spot", start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      /* contact: the closing statement echoes the hero as it comes in */
      var contact = document.querySelector(".cv-contact");
      if (contact) {
        gsap.timeline({ scrollTrigger: { trigger: contact, start: "top 70%", toggleActions: "play none none reverse" } })
          .from(".cv-contact__hi", { opacity: 0, y: 30, duration: 0.6, ease: "power2.out" })
          .from(".cv-contact__title .cv-w", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.08 }, 0.1)
          .from(".cv-contact__title .cv-pill", { clipPath: "inset(0 50% 0 50% round 999px)", duration: 1, ease: "power3.inOut", clearProps: "clipPath" }, 0.3)
          .from(".cv-contact__foot > *", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out", stagger: 0.1 }, 0.5);
      }
    });
  }

  function teardown() {
    if (ctx) ctx.revert();
    ctx = null;
    if (lenis) {
      gsap.ticker.remove(tick);
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
