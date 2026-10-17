/* Asian's page: survey donuts, the design system kit (swatches, type tester,
   icons, button states) and the card sort switch. Tabs come from site.js. */
(function () {
  "use strict";

  function pressOne(buttons, active) {
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === active));
    });
  }

  /* Survey donuts: a legend button highlights its slice and fills the center */
  function initDonuts() {
    document.querySelectorAll(".donut").forEach(function (donut) {
      var chart = donut.querySelector(".donut__chart");
      var center = donut.querySelector(".donut__center");
      var buttons = [].slice.call(donut.querySelectorAll(".donut__legend button"));
      function show(button) {
        pressOne(buttons, button);
        chart.dataset.on = button.dataset.slice;
        center.querySelector("b").textContent = button.dataset.value + "%";
        center.querySelector("span").textContent = button.dataset.label;
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          show(button);
        });
        button.addEventListener("mouseenter", function () {
          show(button);
        });
        button.addEventListener("focus", function () {
          show(button);
        });
      });
      var start = buttons.filter(function (b) {
        return b.getAttribute("aria-pressed") === "true";
      })[0];
      if (start) show(start);
    });
  }

  /* Colors: a swatch updates the sample screen; Copy puts the hex on the clipboard */
  function initSwatches() {
    var preview = document.querySelector(".app-preview");
    if (!preview) return;
    var swatches = [].slice.call(document.querySelectorAll(".app-swatch"));
    var name = preview.querySelector(".app-preview__name");
    var use = preview.querySelector(".app-preview__use");
    var value = preview.querySelector(".app-preview__value");
    var copy = preview.querySelector(".app-preview__copy");
    swatches.forEach(function (swatch) {
      swatch.addEventListener("click", function () {
        pressOne(swatches, swatch);
        preview.dataset.color = swatch.dataset.color;
        name.textContent = swatch.dataset.name;
        use.textContent = swatch.dataset.name + ". " + swatch.dataset.use;
        value.textContent = swatch.dataset.hex;
        copy.textContent = "Copy";
      });
    });
    copy.addEventListener("click", function () {
      var text = value.textContent;
      var done = function () {
        copy.textContent = "Copied";
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, function () {
          window.getSelection().selectAllChildren(value);
        });
      } else {
        window.getSelection().selectAllChildren(value);
      }
    });
  }

  /* Type: the sample follows the text field, the weight and the size */
  function initTypeTester() {
    var sample = document.getElementById("type-sample");
    if (!sample) return;
    var input = document.getElementById("type-text");
    var size = document.getElementById("type-size");
    var out = document.getElementById("type-size-out");
    var weights = [].slice.call(document.querySelectorAll(".type-tester__weights button"));
    /* starting values are set here, so the fields stay free to edit */
    input.value = sample.textContent;
    size.value = 25;
    input.addEventListener("input", function () {
      sample.textContent = input.value || " ";
    });
    size.addEventListener("input", function () {
      sample.style.fontSize = size.value + "px";
      out.textContent = size.value + "px";
    });
    weights.forEach(function (button) {
      button.addEventListener("click", function () {
        pressOne(weights, button);
        sample.style.fontWeight = button.dataset.weight;
      });
    });
  }

  /* Icons: a tile shows its icon large, with its name and use */
  function initIcons() {
    var preview = document.querySelector(".icon-preview");
    if (!preview) return;
    var tiles = [].slice.call(document.querySelectorAll(".icon-tile"));
    var path = preview.querySelector("path");
    tiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        pressOne(tiles, tile);
        path.setAttribute("d", tile.dataset.path);
        preview.querySelector(".icon-preview__name").textContent = tile.dataset.name;
        preview.querySelector(".icon-preview__use").textContent = tile.dataset.use;
      });
    });
  }

  /* Buttons: the state switch restyles the samples */
  function initButtonStates() {
    var samples = document.querySelector(".button-samples");
    if (!samples) return;
    var buttons = [].slice.call(document.querySelectorAll(".button-states button"));
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        pressOne(buttons, button);
        samples.dataset.state = button.dataset.state;
      });
    });
  }

  /* Card sort: switch between the pile and the groups guests made */
  function initCardSort() {
    var sort = document.querySelector(".card-sort");
    if (!sort) return;
    var buttons = [].slice.call(sort.querySelectorAll("[data-view]"));
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        pressOne(buttons, button);
        sort.querySelectorAll("[data-view-panel]").forEach(function (panel) {
          panel.hidden = panel.dataset.viewPanel !== button.dataset.view;
        });
      });
    });
  }

  function start() {
    initDonuts();
    initSwatches();
    initTypeTester();
    initIcons();
    initButtonStates();
    initCardSort();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
