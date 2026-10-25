/* Case study outline: marks the part you are reading, the last one whose
   title has passed the upper third of the screen. */
(function () {
  "use strict";
  var links = [].slice.call(document.querySelectorAll(".a-toc a[href^='#']"));
  if (!links.length) return;
  var targets = links.map(function (a) {
    return document.getElementById(a.getAttribute("href").slice(1));
  });
  var ticking = false;
  function mark() {
    ticking = false;
    var line = window.innerHeight / 3;
    var current = 0;
    targets.forEach(function (t, i) {
      if (t && t.getBoundingClientRect().top <= line) current = i;
    });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(mark);
    }
  }, { passive: true });
  window.addEventListener("resize", mark);
  mark();
})();
