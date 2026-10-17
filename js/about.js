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

  function start() {
    initTimeline();
    initFill();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
