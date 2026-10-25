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
  /* in page order: the tab strip (acts only) comes before the outline in
     the markup, so list order alone would put every act ahead of its parts */
  ids = ids.filter(function (id) {
    return document.getElementById(id);
  });
  ids.sort(function (a, b) {
    var pos = document.getElementById(a).compareDocumentPosition(document.getElementById(b));
    return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
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
    /* the outline scrolls on its own when it is taller than the screen:
       keep the marked link inside it */
    var box = document.querySelector(".a-outline");
    var on = box && box.querySelector("a[aria-current]");
    if (on && box.scrollHeight > box.clientHeight) {
      var b = box.getBoundingClientRect(), r = on.getBoundingClientRect();
      if (r.top < b.top + 24 || r.bottom > b.bottom - 24) {
        box.scrollTop += r.top - b.top - box.clientHeight / 3;
      }
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(mark);
    }
  }, { passive: true });
  window.addEventListener("resize", mark);
  mark();

  /* the outline shows only the current section's parts; "Show all" opens
     every section, and "Show less" folds them back */
  var outline = document.querySelector(".a-outline");
  var all = outline && outline.querySelector(".a-outline__all");
  if (all) {
    all.addEventListener("click", function () {
      var open = outline.classList.toggle("is-all");
      all.setAttribute("aria-expanded", String(open));
      all.textContent = open ? "Show less" : "Show all";
    });
  }
})();
