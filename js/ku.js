/* KU Brand page: the color sandbox, laid out like Storybook. Pick a text
   color and a background from the Brand Center palette (Controls tab); the
   canvas repaints, the contrast ratio is worked out (WCAG 2 formula) and
   checked against body text (4.5), large text and icons (3) and enhanced (7)
   (Accessibility tab, its result also on the tab itself), and the matching
   CSS is shown to copy (Code tab). The pairs from the system, down the left,
   load with one click. */
(function () {
  "use strict";

  function luminance(hex) {
    var c = [1, 3, 5].map(function (i) {
      var v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) {
    var la = luminance(a);
    var lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  /* The outline's "Color sandbox" entry pulses until the visitor goes to
     the sandbox once (that link or the hero's play button); then it stops
     for good on this browser. */
  function attention() {
    var calls = [].slice.call(document.querySelectorAll("[data-attn]"));
    if (!calls.length) return;
    var seen = false;
    try {
      seen = localStorage.getItem("ku-sandbox-seen") === "1";
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
          localStorage.setItem("ku-sandbox-seen", "1");
        } catch (e) {}
      });
    });
  }

  function start() {
    attention();
    var play = document.querySelector("[data-play]");
    if (!play) return;
    var preview = play.querySelector("[data-preview]");
    var out = play.querySelector("[data-ratio]");
    var verdict = play.querySelector("[data-verdict]");
    var code = play.querySelector("[data-code]");
    var copy = play.querySelector("[data-copy]");
    var checks = [].slice.call(play.querySelectorAll("[data-check]"));
    var presets = [].slice.call(play.querySelectorAll(".play__preset"));
    var badge = play.querySelector("[data-badge]");
    var radios = {
      fg: [].slice.call(play.querySelectorAll('input[name="play-fg"]')),
      bg: [].slice.call(play.querySelectorAll('input[name="play-bg"]'))
    };

    function picked(role) {
      return radios[role].filter(function (r) {
        return r.checked;
      })[0];
    }
    function pick(role, value) {
      radios[role].forEach(function (r) {
        r.checked = r.value === value;
      });
    }
    function cssValue(input) {
      return input.dataset.token ? "var(" + input.dataset.token + ")" : input.dataset.hex;
    }

    function update() {
      var fg = picked("fg");
      var bg = picked("bg");
      preview.style.setProperty("--pg-fg", fg.dataset.hex);
      preview.style.setProperty("--pg-bg", bg.dataset.hex);
      play.querySelector('[data-picked="fg"]').textContent = fg.dataset.name + " " + fg.dataset.hex;
      play.querySelector('[data-picked="bg"]').textContent = bg.dataset.name + " " + bg.dataset.hex;

      var r = ratio(fg.dataset.hex, bg.dataset.hex);
      out.textContent = r.toFixed(2);
      checks.forEach(function (li) {
        var pass = r >= Number(li.dataset.check);
        li.classList.toggle("is-pass", pass);
        li.classList.toggle("is-fail", !pass);
        li.querySelector(".play__mark").textContent = pass ? "Pass" : "Fail";
      });
      badge.textContent = r.toFixed(1) + " " + (r >= 4.5 ? "Pass" : "Fail");
      badge.className = "sandbox__badge " + (r >= 4.5 ? "is-pass" : "is-fail");
      var same = fg.value === bg.value;
      verdict.textContent = same
        ? "Same color twice: there is nothing to read."
        : r >= 4.5
        ? "Use it. " + fg.dataset.name + " on " + bg.dataset.name + " works for body text."
        : r >= 3
        ? "Headlines only. " + fg.dataset.name + " on " + bg.dataset.name + " is too faint for body text."
        : "Avoid. " + fg.dataset.name + " on " + bg.dataset.name + " is too faint to read.";
      verdict.className = "play__verdict " + (r >= 4.5 ? "is-pass" : r >= 3 ? "is-mid" : "is-fail");

      code.textContent = ".ku-pair {\n  color: " + cssValue(fg) + "; /* " + fg.dataset.name + " */\n  background: " + cssValue(bg) + "; /* " + bg.dataset.name + " */\n}\n/* contrast " + r.toFixed(2) + " : 1 */";
      copy.textContent = "Copy";

      presets.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.fg === fg.value && b.dataset.bg === bg.value));
      });
    }

    play.addEventListener("change", function (event) {
      if (event.target.name === "play-fg" || event.target.name === "play-bg") update();
      if (event.target.hasAttribute("data-frame")) preview.classList.toggle("is-plain", !event.target.checked);
    });
    play.querySelector("[data-swap]").addEventListener("click", function () {
      var fg = picked("fg").value;
      pick("fg", picked("bg").value);
      pick("bg", fg);
      update();
    });
    play.querySelector("[data-shuffle]").addEventListener("click", function () {
      var pairs = [];
      radios.fg.forEach(function (f) {
        radios.bg.forEach(function (b) {
          if (f.value !== b.value && ratio(f.dataset.hex, b.dataset.hex) >= 4.5) pairs.push([f.value, b.value]);
        });
      });
      var current = picked("fg").value + "|" + picked("bg").value;
      var next;
      do {
        next = pairs[Math.floor(Math.random() * pairs.length)];
      } while (pairs.length > 1 && next.join("|") === current);
      pick("fg", next[0]);
      pick("bg", next[1]);
      update();
    });
    presets.forEach(function (b) {
      b.addEventListener("click", function () {
        pick("fg", b.dataset.fg);
        pick("bg", b.dataset.bg);
        update();
      });
    });
    copy.addEventListener("click", function () {
      var done = function () {
        copy.textContent = "Copied";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code.textContent).then(done, function () {});
      }
    });
    /* tabs: click, or arrow keys, Home and End when a tab has focus */
    var tabs = [].slice.call(play.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        select(tab, false);
      });
      tab.addEventListener("keydown", function (event) {
        var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[(next + tabs.length) % tabs.length], true);
      });
    });
    update();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
