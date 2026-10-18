/* Case-study behaviour shared by Luna, KU Brand and Asian's: the stages list
   that follows your reading, the step-by-step drawings (scrollytelling),
   principle tooltips, flip cards and opening a tab from a link. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Under each stage's title: how many sections it has and how long it
     takes to read (about 200 words a minute). */
  function initStageMeta() {
    document.querySelectorAll(".stage__label").forEach(function (label) {
      var stage = label.closest(".stage");
      var sections = stage.querySelectorAll(":scope > .block").length;
      var words = stage.textContent.trim().split(/\s+/).length;
      var minutes = Math.max(1, Math.round(words / 200));
      var meta = document.createElement("p");
      meta.className = "stage__meta";
      meta.textContent = (sections > 1 ? sections + " sections · " : "") + minutes + " min read";
      label.appendChild(meta);
    });
  }

  /* Stages list: all stages are on the page; the list marks the one you are
     reading (the last stage whose top has passed a line a third of the way
     down the screen) and sizes the others by how far away they are. The
     stage you are reading opens to list its sections, marking the one you
     are in. On smaller screens the list moves into a sheet opened from a
     floating chip that names the stage you are in. */
  var icon = function (d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  };
  function initRail() {
    var rail = document.querySelector(".rail");
    if (!rail) return;
    var list = rail.querySelector("ol");
    var links = [].slice.call(list.querySelectorAll(":scope > li > a"));
    var stages = links.map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    });
    if (stages.some(function (s) { return !s; })) return;
    var names = links.map(function (link) {
      return link.textContent.replace(/^\s*\d+\.\s*/, "").trim();
    });
    var nums = links.map(function (link) {
      var num = link.querySelector(".rail__num");
      return num ? num.textContent.trim() : "";
    });

    /* each stage with more than one section gets a list of its sections */
    var sections = stages.map(function (stage, i) {
      var blocks = [].slice.call(stage.querySelectorAll(":scope > .block")).filter(function (block) {
        return block.querySelector(".block__title");
      });
      if (blocks.length < 2) return [];
      var sub = document.createElement("ol");
      sub.className = "rail__sub";
      blocks.forEach(function (block, j) {
        var title = block.querySelector(".block__title");
        if (!block.id) block.id = title.id ? title.id.replace(/-h$/, "") + "-section" : stage.id + "-" + (j + 1);
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + block.id;
        a.textContent = title.textContent.trim();
        li.appendChild(a);
        sub.appendChild(li);
      });
      links[i].parentNode.appendChild(sub);
      return blocks;
    });

    /* the sheet: a dialog with a copy of the list */
    var sheet = document.createElement("dialog");
    sheet.className = "stage-sheet";
    sheet.setAttribute("aria-labelledby", "stage-sheet-title");
    sheet.innerHTML =
      '<div class="stage-sheet__head"><p class="rail__title" id="stage-sheet-title">Stages</p>' +
      '<button class="stage-sheet__close" type="button" aria-label="Close stages">' + icon("M18 6 6 18M6 6l12 12") + "</button></div>";
    var sheetList = list.cloneNode(true);
    sheet.appendChild(sheetList);
    document.body.appendChild(sheet);
    var sheetLinks = [].slice.call(sheetList.querySelectorAll(":scope > li > a"));

    /* the chip: last in the stages column, so it sticks to the bottom of the
       screen only while you are reading the stages */
    var chip = document.createElement("button");
    chip.className = "stage-chip";
    chip.type = "button";
    chip.setAttribute("aria-haspopup", "dialog");
    chip.innerHTML =
      '<span class="stage-chip__ring" aria-hidden="true"></span>' +
      '<span class="sr-only">Stages, now reading: </span>' +
      '<span class="stage-chip__num"></span><span class="stage-chip__name"></span>' +
      icon("m18 15-6-6-6 6");
    var content = stages[0].parentNode;
    content.insertBefore(chip, content.querySelector(".page-end"));

    chip.addEventListener("click", function () {
      sheet.showModal();
      var here = sheetList.querySelector('[aria-current="true"]');
      if (here) here.focus();
    });
    sheet.querySelector(".stage-sheet__close").addEventListener("click", function () {
      sheet.close();
    });
    sheet.addEventListener("click", function (event) {
      /* a tap on the dimmed page outside the sheet lands on the dialog itself */
      if (event.target === sheet) sheet.close();
      /* choosing a stage closes the sheet; the link then scrolls there */
      if (event.target.closest("a")) sheet.close();
    });

    var current = -1;
    var currentBlock = null;
    function mark() {
      var line = window.innerHeight / 3;
      var index = 0;
      stages.forEach(function (stage, i) {
        if (stage.getBoundingClientRect().top <= line) index = i;
      });
      var block = null;
      sections[index].forEach(function (b) {
        if (b.getBoundingClientRect().top <= line) block = b;
      });
      if (!block && sections[index].length) block = sections[index][0];
      if (index === current && block === currentBlock) return;
      currentBlock = block;
      [list, sheetList].forEach(function (ol) {
        [].slice.call(ol.querySelectorAll(":scope > li > a")).forEach(function (link, i) {
          if (i === index) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
          /* how far each stage is from the one you are reading (sets its size) */
          link.dataset.d = String(Math.min(3, Math.abs(i - index)));
        });
        [].slice.call(ol.querySelectorAll(".rail__sub a")).forEach(function (link) {
          if (block && link.getAttribute("href") === "#" + block.id) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
      if (index === current) return;
      current = index;
      chip.querySelector(".stage-chip__num").textContent = nums[index];
      chip.querySelector(".stage-chip__name").textContent = names[index];
    }
    window.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("resize", mark);
    mark();
  }

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

  /* Behind-the-scenes reels: previous and next move one picture at a time;
     the count and the buttons follow the track as it is scrolled or swiped */
  function initReels() {
    document.querySelectorAll(".reel").forEach(function (reel) {
      var track = reel.querySelector(".reel__track");
      if (!track) return;
      var count = reel.querySelector(".reel__count");
      var steps = [].slice.call(reel.querySelectorAll(".reel__step"));
      var total = track.children.length;
      /* one picture is the track's width plus the gap between pictures */
      var stepWidth = function () {
        return track.clientWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
      };
      function update() {
        var i = Math.round(track.scrollLeft / Math.max(1, stepWidth()));
        if (count) count.textContent = i + 1 + " / " + total;
        steps.forEach(function (b) {
          var dir = Number(b.dataset.step);
          b.disabled = dir < 0 ? i <= 0 : i >= total - 1;
        });
      }
      steps.forEach(function (b) {
        b.addEventListener("click", function () {
          track.scrollBy({ left: Number(b.dataset.step) * stepWidth() });
        });
      });
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
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
      '<span class="outline-chip__label">Stage</span>' +
      '<span class="outline-chip__name">' + (stages[0] ? stages[0].firstChild.textContent.trim() : "") + "</span>" +
      icon("m18 15-6-6-6 6");
    document.body.appendChild(chip);
    var name = chip.querySelector(".outline-chip__name");

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
      if (name.textContent !== text) name.textContent = text;
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
    initStageMeta();
    initRail();
    initOutlineSheet();
    initSteps();
    initReels();
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
