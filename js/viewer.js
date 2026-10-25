/* Case study pictures: each one opens full screen, with previous and next
   buttons to move through every picture on the page. Arrow keys work too,
   Escape closes, and focus goes back to the picture you opened. */
(function () {
  "use strict";
  var imgs = [].slice.call(document.querySelectorAll("main figure img")).filter(function (img) {
    return !img.closest("a, button");
  });
  if (!imgs.length) return;

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var dialog = document.createElement("dialog");
  dialog.className = "viewer";
  dialog.setAttribute("aria-label", "Picture viewer");
  dialog.innerHTML =
    '<div class="viewer__bar"><p class="viewer__count" aria-live="polite"></p>' +
    '<button class="viewer__btn viewer__close" type="button" aria-label="Close">' + ICON + '<path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
    '<div class="viewer__stage">' +
    '<button class="viewer__btn viewer__prev" type="button" aria-label="Previous picture">' + ICON + '<path d="m15 18-6-6 6-6"/></svg></button>' +
    '<img class="viewer__img" alt="">' +
    '<button class="viewer__btn viewer__next" type="button" aria-label="Next picture">' + ICON + '<path d="m9 18 6-6-6-6"/></svg></button>' +
    "</div>" +
    '<p class="viewer__caption"></p>';
  document.body.appendChild(dialog);

  var big = dialog.querySelector(".viewer__img");
  var count = dialog.querySelector(".viewer__count");
  var caption = dialog.querySelector(".viewer__caption");
  var current = 0;
  var opener = null;

  function show(i) {
    current = (i + imgs.length) % imgs.length;
    var img = imgs[current];
    var cap = img.closest("figure").querySelector("figcaption");
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    count.textContent = current + 1 + " / " + imgs.length;
    caption.textContent = cap ? cap.textContent : img.alt;
  }

  imgs.forEach(function (img, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "zoom";
    btn.setAttribute("aria-label", "View full screen: " + (img.alt || "picture"));
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("data-cursor", "View");
    img.parentNode.insertBefore(btn, img);
    btn.appendChild(img);
    btn.addEventListener("click", function () {
      opener = btn;
      show(i);
      dialog.showModal();
      document.documentElement.classList.add("viewer-open");
    });
  });

  dialog.querySelector(".viewer__prev").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector(".viewer__next").addEventListener("click", function () { show(current + 1); });
  dialog.querySelector(".viewer__close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });
  /* a click on the dark area around the picture closes it */
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target.classList.contains("viewer__stage")) dialog.close();
  });
  /* swipe on phones */
  var startX = null;
  dialog.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("viewer-open");
    if (opener) opener.focus();
  });
})();
