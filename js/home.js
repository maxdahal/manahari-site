/* Home: the recruiter summary dialog, the artwork preview and its lightbox,
   and the contrast ratios in the design system section. Everything on the
   page reads and works without this script; it only adds the dialogs and
   the live numbers. */
(function () {
  "use strict";

  /* For recruiters: the buttons (top bar and phone menu) open the summary
     dialog; Close, Escape or a click on the dimmed page shut it, and focus
     goes back to the button that opened it */
  function initRecruiter() {
    var dialog = document.querySelector(".recruiter");
    if (!dialog || !dialog.showModal) return;
    var opener = null;
    document.querySelectorAll("[data-recruiter]").forEach(function (button) {
      button.addEventListener("click", function () {
        opener = button;
        var menu = document.getElementById("menu");
        if (menu && menu.classList.contains("is-open")) {
          var toggle = document.querySelector(".menu-button");
          if (toggle) toggle.click();
          opener = toggle;
        }
        dialog.showModal();
      });
    });
    dialog.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        /* a link moves on to the page; the close button hands focus back */
        if (el.tagName === "A") opener = null;
        dialog.close();
      });
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    /* "See more" shows every skill, and turns into "See fewer" */
    var more = dialog.querySelector(".recruiter__more");
    var list = dialog.querySelector(".recruiter__skills");
    if (more && list) {
      var label = more.textContent;
      more.addEventListener("click", function () {
        var open = !list.classList.contains("is-open");
        list.classList.toggle("is-open", open);
        more.setAttribute("aria-expanded", String(open));
        more.textContent = open ? "See fewer" : label;
      });
    }
    dialog.addEventListener("close", function () {
      if (opener && opener.offsetParent) opener.focus();
    });
  }

  /* Artwork: six pieces show; the button reveals the rest. Each piece opens
     in a full-screen viewer with previous and next (buttons or arrow keys);
     closing returns focus to the piece. */
  function initArtwork() {
    var grid = document.getElementById("art-grid");
    var more = document.querySelector(".art-more");
    if (grid && more) {
      var label = more.textContent;
      more.addEventListener("click", function () {
        var open = !grid.classList.contains("is-open");
        grid.classList.toggle("is-open", open);
        more.setAttribute("aria-expanded", String(open));
        more.textContent = open ? "Show fewer" : label;
        /* move focus to the first newly shown piece */
        if (open) {
          var first = grid.querySelector(".is-more .art__open");
          if (first) first.focus();
        }
      });
    }
    var dialog = document.querySelector(".lightbox");
    if (!grid || !dialog || !dialog.showModal) return;
    var buttons = [].slice.call(grid.querySelectorAll(".art__open"));
    var big = dialog.querySelector("img");
    var count = dialog.querySelector(".lightbox__count");
    var current = 0;
    function show(index) {
      current = (index + buttons.length) % buttons.length;
      var img = buttons[current].querySelector("img");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      count.textContent = current + 1 + " / " + buttons.length;
    }
    buttons.forEach(function (button, i) {
      button.addEventListener("click", function () {
        show(i);
        dialog.showModal();
      });
    });
    dialog.querySelectorAll("[data-step]").forEach(function (b) {
      b.addEventListener("click", function () {
        show(current + Number(b.dataset.step));
      });
    });
    dialog.querySelector("[data-close]").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });
    dialog.addEventListener("close", function () {
      /* a piece hidden behind "Show all" cannot take focus; use the button */
      var target = buttons[current].offsetParent ? buttons[current] : more;
      if (target) target.focus();
    });
  }

  /* Design system: show each color's value and, for text colors, its
     contrast against the background (WCAG 2 formula), in the current theme */
  function initSwatches() {
    var codes = document.querySelectorAll(".ds__swatches [data-token]");
    if (!codes.length) return;
    function rgb(token) {
      var probe = document.createElement("span");
      probe.style.color = "var(" + token + ")";
      document.body.appendChild(probe);
      var parts = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
      probe.remove();
      return parts.slice(0, 3);
    }
    function hex(c) {
      return "#" + c.map(function (v) {
        return Math.round(v).toString(16).padStart(2, "0");
      }).join("");
    }
    function lum(c) {
      var l = c.map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
    }
    function update() {
      var bg = lum(rgb("--bg"));
      codes.forEach(function (code) {
        code.textContent = hex(rgb(code.dataset.token)).toUpperCase();
      });
      document.querySelectorAll(".ds__swatches [data-fg]").forEach(function (out) {
        var fg = lum(rgb(out.dataset.fg));
        var r = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
        out.textContent = r.toFixed(1) + ":1 " + (r >= 4.5 ? "AA" : "large text only");
      });
    }
    update();
    /* the theme switch sets data-theme on <html>; the device setting can
       change too */
    new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", update);
  }

  function start() {
    initRecruiter();
    initArtwork();
    initSwatches();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
