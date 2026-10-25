/* Case study section lists (the outline on the left, and the tab strip on
   narrow screens): mark the section you are reading, the last one whose
   top has passed the upper third of the screen. */
(function () {
  "use strict";
  var links = [].slice.call(document.querySelectorAll(".a-outline a[href^='#'], .a-sections a[href^='#']"));
  if (!links.length) return;
  var ids = [];
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (ids.indexOf(id) < 0) ids.push(id);
  });
  var targets = ids.map(function (id) {
    return document.getElementById(id);
  });
  var ticking = false;
  function mark() {
    ticking = false;
    var line = window.innerHeight / 3;
    var current = ids[0];
    targets.forEach(function (t, i) {
      if (t && t.getBoundingClientRect().top <= line) current = ids[i];
    });
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "location");
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

  /* Pictures load lazily as the page scrolls past them and push the
     content down, so a jump can stop short of its section: once the
     scroll settles, aim again (instantly) until the heading is in place. */
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      var tries = 0;
      function settle() {
        var off = target.getBoundingClientRect().top
          - parseFloat(getComputedStyle(target).scrollMarginTop || 0)
          - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || 0);
        if (Math.abs(off) > 4 && tries++ < 4) {
          target.scrollIntoView({ behavior: "instant", block: "start" });
          setTimeout(settle, 250);
        } else {
          mark();
        }
      }
      setTimeout(settle, 900);
    });
  });
})();
