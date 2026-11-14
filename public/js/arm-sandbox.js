/* Surgical Console arm panel sandbox ("Try it"): the designs I tested, live
   arm states, the one-second glance test and my notes. Brought back from the
   earlier case study; the frame, tabs, entrance and outline pulse come from
   sandbox.js. */
(function () {
  "use strict";

  var SIDE = { 1: "L", 2: "L", 3: "R", 4: "R" };
  var STATES = ["Running", "Warning", "Error", "Inactive"];
  var DESIGNS = {
    before: {
      name: "Before · Number only",
      note: "A warning showed in one list, and the arm was only a number. A nurse had to match that number to a real arm in the room."
    },
    a: {
      name: "A · Warning on the picture (kept)",
      note: "A label with L or R sat next to the instrument. Kept."
    },
    b: {
      name: "B · Arm color as a fill (dropped)",
      note: "The whole panel took the arm color. Dropped, because it hid the state. Filling the whole panel with the arm color, or using it as the status dot, made it unclear which arm it was and what it was doing."
    },
    c: {
      name: "C · Bar, dot and word (kept)",
      note: "Color showed identity. The dot and the word showed state. Kept. The robot already gave each arm its own color. I kept those colors and showed them only as a bar along the top of the arm panel."
    },
    final: {
      name: "A + C · Final design (shipped)",
      note: "Warnings on the picture, and a color bar on each arm. The state showed as a dot and a word: Running, Warning, Error or Inactive. An arm in error kept its own color, and still looked like an error."
    }
  };


  function start() {
    var root = document.querySelector("[data-arms]");
    if (!root || !window.Sandbox) return;
    var consoleEl = root.querySelector("[data-console]");
    var canvas = root.querySelector("[data-canvas]");
    var list = root.querySelector("[data-list]");
    var flags = { l: root.querySelector('[data-flag="l"]'), r: root.querySelector('[data-flag="r"]') };
    var quiz = root.querySelector("[data-quiz]");
    var result = root.querySelector("[data-result]");
    var after = root.querySelector("[data-after]");
    var picks = [].slice.call(root.querySelectorAll("[data-pick]"));
    var badge = root.querySelector("[data-badge]");
    var scores = root.querySelector("[data-scores]");
    var designButtons = [].slice.call(root.querySelectorAll("[data-design]")).filter(function (b) {
      return b.tagName === "BUTTON";
    });
    var design = "final";
    var tally = {};
    Object.keys(DESIGNS).forEach(function (d) {
      tally[d] = { tries: 0, right: 0, time: 0 };
    });

    function state(n) {
      var checked = root.querySelector('input[name="arm-' + n + '"]:checked');
      return checked ? checked.value : "Running";
    }
    function setState(n, value) {
      [].forEach.call(root.querySelectorAll('input[name="arm-' + n + '"]'), function (r) {
        r.checked = r.value === value;
      });
    }

    function render() {
      consoleEl.dataset.design = design;
      var alerts = [];
      var side = { l: null, r: null };
      [1, 2, 3, 4].forEach(function (n) {
        var s = state(n);
        var panel = root.querySelector('.carm[data-arm="' + n + '"]');
        panel.dataset.state = s;
        panel.querySelector(".carm__word").textContent = s;
        if (s === "Warning" || s === "Error") {
          alerts.push("Arm " + n + " " + s);
          var k = SIDE[n].toLowerCase();
          if (!side[k] || s === "Error") side[k] = s;
        }
      });
      list.innerHTML = alerts.length ? "<b>Warnings</b> · " + alerts.join(", ") : "<b>Warnings</b> · none";
      ["l", "r"].forEach(function (k) {
        var f = flags[k];
        f.classList.toggle("is-on", !!side[k]);
        f.classList.toggle("is-warning", side[k] === "Warning");
        f.textContent = side[k] ? k.toUpperCase() + " · " + side[k] : "";
      });
      designButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.design === design));
      });
      root.querySelector("[data-notes-title]").textContent = DESIGNS[design].name;
      root.querySelector("[data-notes]").textContent = DESIGNS[design].note;
    }

    function renderScores() {
      var all = { tries: 0, right: 0 };
      scores.innerHTML = Object.keys(DESIGNS)
        .map(function (d) {
          var t = tally[d];
          all.tries += t.tries;
          all.right += t.right;
          var avg = t.right ? (t.time / t.right / 1000).toFixed(1) + "s" : "–";
          return "<li><span class=\"glance__name\">" + DESIGNS[d].name + "</span><span class=\"glance__num\"><b>" + t.right + " / " + t.tries + "</b> right · " + avg + "</span></li>";
        })
        .join("");
      badge.textContent = all.right + " / " + all.tries;
    }

    /* one arm gets a warning or an error, the others run or rest */
    function randomFault() {
      var target = 1 + Math.floor(Math.random() * 4);
      [1, 2, 3, 4].forEach(function (n) {
        setState(n, n === target ? (Math.random() < 0.6 ? "Error" : "Warning") : Math.random() < 0.8 ? "Running" : "Inactive");
      });
      render();
      return target;
    }

    var target = null;
    var askedAt = 0;
    var timer = null;
    function glance() {
      clearTimeout(timer);
      quiz.hidden = true;
      picks.forEach(function (p) {
        p.classList.remove("is-right", "is-wrong");
        p.disabled = false;
      });
      result.textContent = "";
      after.hidden = true;
      target = randomFault();
      timer = setTimeout(function () {
        quiz.hidden = false;
        askedAt = performance.now();
        picks[0].focus({ preventScroll: true });
      }, 1000);
    }
    picks.forEach(function (p) {
      p.addEventListener("click", function () {
        if (target === null) return;
        var n = Number(p.dataset.pick);
        var ms = performance.now() - askedAt;
        var right = n === target;
        tally[design].tries += 1;
        if (right) {
          tally[design].right += 1;
          tally[design].time += ms;
        }
        picks.forEach(function (q) {
          q.disabled = true;
          if (Number(q.dataset.pick) === target) q.classList.add("is-right");
        });
        if (!right) p.classList.add("is-wrong");
        result.textContent = (right ? "Right. " : "Not quite. ") + "Arm " + target + " had " + (state(target) === "Error" ? "an error" : "a warning") + ". You answered in " + (ms / 1000).toFixed(1) + "s.";
        target = null;
        after.hidden = false;
        renderScores();
      });
    });
    root.querySelector("[data-again]").addEventListener("click", glance);
    root.querySelector("[data-show]").addEventListener("click", function () {
      quiz.hidden = true;
    });
    root.querySelector("[data-glance]").addEventListener("click", glance);
    root.querySelector("[data-fault]").addEventListener("click", function () {
      quiz.hidden = true;
      randomFault();
    });
    root.querySelector("[data-far]").addEventListener("change", function (event) {
      canvas.classList.toggle("is-far", event.target.checked);
    });
    root.addEventListener("change", function (event) {
      if (/^arm-\d$/.test(event.target.name)) render();
    });
    designButtons.forEach(function (b) {
      b.addEventListener("click", function () {
        design = b.dataset.design;
        quiz.hidden = true;
        render();
      });
    });

    window.Sandbox.tabs(root);
    window.Sandbox.attention("console-sandbox-seen");
    render();
    renderScores();

    /* the entrance demo: the same faults, shown each way in turn, ending on
       the final design */
    window.Sandbox.reveal(
      root,
      ["before", "a", "b", "c", "final"].map(function (d) {
        return function () {
          design = d;
          render();
        };
      }),
      1100
    );
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
