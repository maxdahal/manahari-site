/* Case-study behaviour shared by Surgical Console, KU Brand and Asian's: the outline
   button and sheet on smaller screens, the step-by-step drawings
   (scrollytelling), principle tooltips, flip cards, the wireframe
   video and opening a tab from a link. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* a small line icon (Lucide style) from one path */
  var icon = function (d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  };

  /* Scrollytelling: in a list of steps, the drawings share one pinned spot
     beside the text (see .steps in case-study.css). The step whose text is
     in the middle of the screen shows its drawing. */
  function initSteps() {
    document.querySelectorAll(".steps").forEach(function (list) {
      var steps = [].slice.call(list.querySelectorAll(":scope > .step"));
      if (steps.length < 2) return;
      list.classList.add("steps--story");
      var show = function (step) {
        steps.forEach(function (s) {
          s.classList.toggle("is-active", s === step);
        });
      };
      show(steps[0]);
      if (!("IntersectionObserver" in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) show(entry.target.closest(".step"));
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (step) {
        io.observe(step.querySelector(".step__text"));
        step.querySelector(".step__text").addEventListener("focusin", function () {
          show(step);
        });
      });
    });
  }



  /* Principle chips: show the principle's definition in a small tooltip */
  function initPrinciples() {
    var chips = document.querySelectorAll("[data-principle]");
    if (!chips.length) return;
    var tip = document.createElement("div");
    tip.className = "tooltip";
    tip.id = "principle-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);

    function show(chip) {
      var card = document.getElementById(chip.getAttribute("href").slice(1));
      if (!card) return;
      var title = card.querySelector("h3, h4");
      var text = card.querySelector("p");
      tip.innerHTML = "";
      var b = document.createElement("b");
      b.textContent = title ? title.textContent : chip.textContent;
      var p = document.createElement("p");
      p.textContent = text ? text.textContent : "";
      tip.appendChild(b);
      tip.appendChild(p);
      tip.hidden = false;
      chip.setAttribute("aria-describedby", tip.id);
      var r = chip.getBoundingClientRect();
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      var left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), window.innerWidth - w - 12);
      var top = r.top - h - 12;
      if (top < 12) top = r.bottom + 12;
      tip.style.translate = left + "px " + top + "px";
    }
    function hide(chip) {
      tip.hidden = true;
      if (chip) chip.removeAttribute("aria-describedby");
    }
    chips.forEach(function (chip) {
      chip.addEventListener("mouseenter", function () {
        show(chip);
      });
      chip.addEventListener("focus", function () {
        show(chip);
      });
      chip.addEventListener("mouseleave", function () {
        hide(chip);
      });
      chip.addEventListener("blur", function () {
        hide(chip);
      });
    });
    window.addEventListener("scroll", function () {
      hide();
    }, { passive: true });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hide();
    });
  }

  /* Flip cards */
  function initFlips() {
    document.querySelectorAll(".flip").forEach(function (card) {
      card.addEventListener("click", function () {
        card.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true"));
      });
    });
  }

  /* A link to a panel inside tabs (for example #p-arm) selects that tab first */
  function openFromHash(hash) {
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    var panel = target.closest('[role="tabpanel"]');
    if (!panel) return;
    if (window.Site) window.Site.initTabs();
    var tab = document.querySelector('[role="tab"][aria-controls="' + panel.id + '"]');
    if (!tab) return;
    var list = tab.closest('[role="tablist"]');
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    if (list.selectTab) list.selectTab(tabs.indexOf(tab), false);
    requestAnimationFrame(function () {
      target.scrollIntoView({ block: "start" });
    });
  }
  /* Links into a closed tab open it; everything else is an ordinary link
     (the page scrolls smoothly in CSS, under the bar at the top). */
  function initHashLinks() {
    function go(hash) {
      var target = hash.length > 1 && document.getElementById(hash.slice(1));
      if (!target || !target.closest('[role="tabpanel"][hidden]')) return false;
      openFromHash(hash);
      return true;
    }
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link || link.getAttribute("href").length < 2) return;
      var hash = link.getAttribute("href");
      if (go(hash)) {
        event.preventDefault();
        history.pushState(null, "", hash);
      }
    });
    window.addEventListener("hashchange", function () {
      go(location.hash);
    });
    if (location.hash.length > 1) go(location.hash);
  }

  /* Motion: short videos. Each waits under a big play button; pressing it
     plays the video with its controls showing, and when it ends the button
     comes back as "Replay". */
  function initMotion() {
    [].forEach.call(document.querySelectorAll(".motion"), function (fig) {
      var video = fig.querySelector("video");
      var button = fig.querySelector(".motion__start");
      var verb = fig.querySelector(".motion__verb");
      if (!video || !button) return;
      button.addEventListener("click", function () {
        button.hidden = true;
        video.controls = true;
        if (video.ended) video.currentTime = 0;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
        video.focus();
      });
      video.addEventListener("ended", function () {
        video.controls = false;
        if (verb) verb.textContent = "Replay";
        button.hidden = false;
        button.focus();
      });
    });
  }

  /* Outline on smaller screens: the page outline (left column on wide
     screens) moves into a bottom sheet, opened from a floating button at the
     bottom middle that names the stage you are reading. The same <nav> is
     moved, not copied, so the outline script keeps marking it. */
  function initOutlineSheet() {
    var nav = document.querySelector(".cp-side .cp-outline");
    if (!nav) return;
    var side = nav.parentNode;
    var spot = nav.nextSibling;
    var stages = [].slice.call(nav.querySelectorAll(".cp-outline__stage"));

    var sheet = document.createElement("dialog");
    sheet.className = "outline-sheet";
    sheet.setAttribute("aria-labelledby", "outline-sheet-title");
    sheet.innerHTML =
      '<div class="outline-sheet__head"><p class="outline-sheet__title" id="outline-sheet-title">On this page</p>' +
      '<button class="icon-button outline-sheet__close" type="button" aria-label="Close">' + icon("M18 6 6 18M6 6l12 12") + "</button></div>";
    document.body.appendChild(sheet);

    var chip = document.createElement("button");
    chip.className = "outline-chip";
    chip.type = "button";
    chip.setAttribute("aria-haspopup", "dialog");
    chip.innerHTML =
      '<span class="outline-chip__ring" aria-hidden="true"><span class="outline-chip__num">\u2022</span></span>' +
      '<span class="sr-only">Now reading: </span>' +
      '<span class="outline-chip__name">' + (stages[0] ? stages[0].firstChild.textContent.trim() : "") + "</span>" +
      icon("m18 15-6-6-6 6");
    document.body.appendChild(chip);
    var name = chip.querySelector(".outline-chip__name");
    var num = chip.querySelector(".outline-chip__num");
    /* the same numbers as the outline: the things to try have none (a play
       mark instead), and before the first act there is a dot */
    function label(stage) {
      var i = stages.indexOf(stage);
      if (i < 0) return "\u2022";
      if (stage.classList.contains("cp-outline__play")) return "\u25B8";
      var n = stages.slice(0, i + 1).filter(function (s) {
        return !s.classList.contains("cp-outline__play");
      }).length;
      return String(n).padStart(2, "0");
    }
    var ring = chip.querySelector(".outline-chip__ring");

    var small = window.matchMedia("(max-width: 1100px)");
    function place() {
      if (small.matches) sheet.appendChild(nav);
      else {
        if (sheet.open) sheet.close();
        side.insertBefore(nav, spot);
      }
    }
    small.addEventListener("change", place);
    place();

    chip.addEventListener("click", function () {
      sheet.showModal();
      var here = nav.querySelector('[aria-current]');
      if (here) here.scrollIntoView({ block: "center" });
    });
    sheet.querySelector(".outline-sheet__close").addEventListener("click", function () {
      sheet.close();
    });
    sheet.addEventListener("click", function (event) {
      /* a tap on the dimmed page outside the sheet lands on the dialog itself */
      if (event.target === sheet) sheet.close();
      /* choosing a part closes the sheet; the link then scrolls there */
      if (event.target.closest("a")) sheet.close();
    });

    /* the button names the stage you are in, and waits until you are past
       the opening of the page */
    var tick = false;
    function update() {
      tick = false;
      var stage = nav.querySelector(".cp-outline__stage.is-in");
      var text = stage ? stage.firstChild.textContent.trim() : name.textContent;
      if (name.textContent !== text || num.textContent !== label(stage)) {
        name.textContent = text;
        num.textContent = label(stage);
      }
      /* the ring fills as you read through the page */
      var max = document.documentElement.scrollHeight - window.innerHeight;
      ring.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(3) : "0");
      chip.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", function () {
      if (!tick) {
        tick = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function start() {
    initOutlineSheet();
    initSteps();
    initPrinciples();
    initFlips();
    initMotion();
    initHashLinks();
    /* one way to jump to any part of the page, even inside a closed tab */
    if (window.Site) {
      window.Site.goTo = function (id) {
        var target = document.getElementById(id);
        if (!target) return false;
        if (target.closest('[role="tabpanel"]')) openFromHash("#" + id);
        else target.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
        return true;
      };
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
