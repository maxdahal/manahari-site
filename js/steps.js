/* Sections as steps: builds the sticky bar under the header from the
   article's sections (Overview, then each section with a title), marks the
   ones passed and the one you are in, and scrolls to a section on click. */
(function () {
  "use strict";
  var acts = [].slice.call(document.querySelectorAll("#main .a-act[id]")).filter(function (act) {
    return act.querySelector(":scope > h2") && !act.classList.contains("a-act--intro");
  });
  var header = document.querySelector(".cm-header");
  var main = document.getElementById("main");
  if (!acts.length || !header || !main) return;

  var items = [{ id: "main", label: "Overview", target: main }].concat(
    acts.map(function (act) {
      return { id: act.id, label: act.querySelector(":scope > h2").textContent.trim(), target: act };
    })
  );
  var nav = document.createElement("nav");
  nav.className = "cm-steps";
  nav.setAttribute("aria-label", "Sections of this case study");
  var list = document.createElement("ol");
  var links = items.map(function (item) {
    var li = document.createElement("li");
    li.className = "cm-step";
    var a = document.createElement("a");
    a.href = "#" + item.id;
    a.title = item.label;
    a.innerHTML = '<span class="cm-step__dot" aria-hidden="true"></span><span class="cm-step__label"></span>';
    a.querySelector(".cm-step__label").textContent = item.label;
    li.appendChild(a);
    list.appendChild(li);
    return li;
  });
  nav.appendChild(list);
  var now = document.createElement("p");
  now.className = "cm-steps__now";
  now.setAttribute("aria-hidden", "true");
  nav.appendChild(now);
  header.insertAdjacentElement("afterend", nav);

  nav.addEventListener("click", function (event) {
    var a = event.target.closest("a[href^='#']");
    if (!a) return;
    event.preventDefault();
    event.stopPropagation();
    var item = items[[].indexOf.call(list.querySelectorAll("a"), a)];
    var top = item.id === "main" ? 0 : item.target.getBoundingClientRect().top + window.scrollY - 150;
    if (window.lenis) window.lenis.scrollTo(Math.max(0, top));
    else window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", a.getAttribute("href"));
  });

  var ticking = false;
  function mark() {
    ticking = false;
    var line = window.innerHeight * 0.35;
    var current = 0;
    items.forEach(function (item, i) {
      if (i && item.target.getBoundingClientRect().top <= line) current = i;
    });
    links.forEach(function (li, i) {
      li.classList.toggle("is-done", i < current);
      li.classList.toggle("is-now", i === current);
      if (i === current) li.firstChild.setAttribute("aria-current", "step");
      else li.firstChild.removeAttribute("aria-current");
    });
    now.textContent = items[current].label;
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
