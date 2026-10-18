/* Sandbox: what every case-study sandbox shares (see sandbox.css). Each
   page's own script (ku.js, luna.js) builds on it:
   - Sandbox.tabs(root): the panel's tabs, by click or by arrow keys, Home
     and End when a tab has focus.
   - Sandbox.reveal(root, steps, gap): once the sandbox is a third in view it
     rises in (CSS), then runs the demo steps one after another, gap ms
     apart, until the visitor touches, clicks or tabs into it. Nothing moves
     for reduced motion.
   - Sandbox.attention(key): the outline's entry for the sandbox pulses until
     the visitor goes there once (that link or any link to #sandbox), then
     stays quiet on this browser (remembered under key). */
(function () {
  "use strict";

  function tabs(root) {
    var list = [].slice.call(root.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      list.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    }
    list.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        select(tab, false);
      });
      tab.addEventListener("keydown", function (event) {
        var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: list.length - 1 }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(list[(next + list.length) % list.length], true);
      });
    });
  }

  function reveal(root, steps, gap) {
    var wrap = root.closest(".sandbox-wrap");
    if (!wrap || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var touched = false;
    ["pointerdown", "keydown", "focusin"].forEach(function (type) {
      root.addEventListener(type, function () {
        touched = true;
      });
    });
    function run(i) {
      if (touched || i >= steps.length) return;
      steps[i]();
      setTimeout(function () {
        run(i + 1);
      }, gap || 850);
    }
    wrap.classList.add("js-reveal");
    var io = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        wrap.classList.add("is-in");
        setTimeout(function () {
          run(0);
        }, 1300);
      },
      { threshold: 0.3 }
    );
    io.observe(wrap);
  }

  function attention(key) {
    var calls = [].slice.call(document.querySelectorAll("[data-attn]"));
    if (!calls.length) return;
    var seen = false;
    try {
      seen = localStorage.getItem(key) === "1";
    } catch (e) {}
    function quiet() {
      calls.forEach(function (el) {
        el.removeAttribute("data-attn");
      });
    }
    if (seen) return quiet();
    [].forEach.call(document.querySelectorAll('[data-attn], a[href="#sandbox"]'), function (link) {
      link.addEventListener("click", function () {
        quiet();
        try {
          localStorage.setItem(key, "1");
        } catch (e) {}
      });
    });
  }

  window.Sandbox = { tabs: tabs, reveal: reveal, attention: attention };
})();
