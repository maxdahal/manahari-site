/* About page: the Education / Experience switch on the timeline, and the
   statement that fills in as you scroll. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initTimeline() {
    var list = document.querySelector(".timeline-tabs");
    var timeline = document.getElementById("timeline");
    var summary = document.querySelector(".timeline-summary");
    if (!list || !timeline) return;
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));

    function select(index, focus) {
      var kind = tabs[index].dataset.kind;
      tabs.forEach(function (tab, i) {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      if (focus) tabs[index].focus();
      timeline.setAttribute("aria-labelledby", tabs[index].id);
      summary.textContent = tabs[index].dataset.summary;

      /* show this kind; print each year once */
      var lastYear = null;
      timeline.querySelectorAll(".timeline > li").forEach(function (item) {
        var show = item.dataset.kind === kind;
        item.hidden = !show;
        if (!show) return;
        var year = item.querySelector(".timeline__year");
        year.classList.toggle("is-repeat", item.dataset.year === lastYear);
        lastYear = item.dataset.year;
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        select(i, false);
      });
      tab.addEventListener("keydown", function (event) {
        var keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        select((keys[event.key] + tabs.length) % tabs.length, true);
      });
    });
    var start = tabs.findIndex(function (t) {
      return t.getAttribute("aria-selected") === "true";
    });
    select(Math.max(0, start), false);
  }

  function initFill() {
    var statement = document.querySelector("[data-fill]");
    if (!statement || reduceMotion) return;
    var words = [];
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
    /* the statement is near the top, so it fills over the first stretch of scrolling
       and over a short delay on load */
    var t0 = performance.now();
    function frame() {
      var p = Math.max(Math.min(1, (performance.now() - t0) / 1600), Math.min(1, window.scrollY / 260));
      words.forEach(function (word, i) {
        var f = Math.max(0, Math.min(1, (p - i * (0.7 / words.length)) / 0.3));
        word.style.setProperty("--f", (f * 100).toFixed(1) + "%");
      });
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    window.addEventListener("scroll", function () {
      requestAnimationFrame(frame);
    }, { passive: true });
  }

  /* Education and experience as slides: the four chapters share one stage
     and show one at a time, with previous / next, a row of place names to
     jump to any chapter, and the arrow keys. Nothing moves on its own.
     Without this script the chapters simply stack. */
  function initChapterSlides() {
    var section = document.querySelector(".chapters");
    var chapters = section ? [].slice.call(section.querySelectorAll(".chapter")) : [];
    if (chapters.length < 2) return;
    var total = chapters.length;
    var pad = function (n) {
      return (n < 10 ? "0" : "") + n;
    };
    var places = chapters.map(function (ch) {
      return ch.querySelector(".chapter__place").textContent.trim();
    });

    var stage = document.createElement("div");
    stage.className = "slides";
    stage.setAttribute("role", "region");
    stage.setAttribute("aria-roledescription", "carousel");
    stage.setAttribute("aria-label", "Education and experience, " + total + " chapters");
    stage.tabIndex = -1;
    chapters[0].parentNode.insertBefore(stage, chapters[0]);

    chapters.forEach(function (ch, i) {
      stage.appendChild(ch);
      ch.setAttribute("role", "group");
      ch.setAttribute("aria-roledescription", "slide");
      /* the panel: the big chapter number and count at the top, the
         story's parts in one box below, and the place as a ghost word */
      var text = ch.querySelector(".chapter__text");
      text.dataset.ghost = places[i];
      var body = document.createElement("div");
      body.className = "chapter__body";
      while (text.firstChild) body.appendChild(text.firstChild);
      var count = document.createElement("p");
      count.className = "chapter__count";
      count.setAttribute("aria-hidden", "true");
      count.innerHTML = "<b>" + pad(i + 1) + "</b><span>/ " + pad(total) + "</span>";
      text.appendChild(count);
      text.appendChild(body);
    });

    var nav = document.createElement("div");
    nav.className = "slides__nav";
    var arrow = function (d) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
    };
    nav.innerHTML =
      '<ol class="slides__places">' + places.map(function (p, i) {
        return '<li><button type="button" class="slides__place" data-go="' + i + '">' +
          '<span class="slides__place-num">' + pad(i + 1) + "</span>" + p + "</button></li>";
      }).join("") + "</ol>" +
      '<div class="slides__steps">' +
      '<button type="button" class="slides__step" data-step="-1" aria-label="Previous chapter">' + arrow("m15 18-6-6 6-6") + "</button>" +
      '<button type="button" class="slides__step" data-step="1" aria-label="Next chapter">' + arrow("m9 18 6-6-6-6") + "</button>" +
      "</div>";
    stage.before(nav);
    var live = document.createElement("p");
    live.className = "sr-only";
    live.setAttribute("aria-live", "polite");
    stage.after(live);

    var current = 0;
    function show(index, announce) {
      current = (index + total) % total;
      chapters.forEach(function (ch, i) {
        var on = i === current;
        ch.classList.toggle("is-active", on);
        ch.inert = !on;
        ch.setAttribute("aria-hidden", String(!on));
      });
      nav.querySelectorAll(".slides__place").forEach(function (b, i) {
        if (i === current) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
      if (announce) live.textContent = "Chapter " + (current + 1) + " of " + total + ": " + places[current];
    }
    nav.addEventListener("click", function (event) {
      var go = event.target.closest("[data-go]");
      var step = event.target.closest("[data-step]");
      if (go) show(Number(go.dataset.go), true);
      if (step) show(current + Number(step.dataset.step), true);
    });
    section.addEventListener("keydown", function (event) {
      if (!event.target.closest(".slides, .slides__nav")) return;
      if (event.key === "ArrowRight") show(current + 1, true);
      else if (event.key === "ArrowLeft") show(current - 1, true);
      else return;
      event.preventDefault();
    });
    section.classList.add("chapters--slides");
    show(0, false);
  }

  function start() {
    initTimeline();
    initFill();
    initChapterSlides();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
