/* Luna page behaviour: room diagram, component rules, screen regions,
   fidelity layers, heuristic filter and the Design stage's project tabs. */
(function () {
  "use strict";

  function onTabChange(list, handler) {
    if (!list) return;
    list.addEventListener("tabchange", function (event) {
      handler(event.detail.index);
    });
  }

  function start() {
    if (window.Site) window.Site.initTabs();

    /* Room diagram follows the selected role */
    var roleTabs = document.querySelector("[data-room]");
    var room = document.querySelector(".room");
    onTabChange(roleTabs, function (index) {
      if (room) room.dataset.selected = String(index);
    });

    /* Component rules: previous and next buttons, and the counter */
    var rules = document.getElementById("rules");
    if (rules) {
      var tabs = rules.querySelectorAll('[role="tab"]');
      var counter = document.querySelector(".rules__count");
      var currentRule = 0;
      onTabChange(rules, function (index) {
        currentRule = index;
        if (counter) counter.textContent = index + 1 + " / " + tabs.length;
      });
      document.querySelectorAll(".rules__controls [data-step]").forEach(function (button) {
        button.addEventListener("click", function () {
          var next = (currentRule + Number(button.dataset.step) + tabs.length) % tabs.length;
          rules.selectTab(next, false);
        });
      });
    }

    /* Screen regions: a legend button lights up its regions */
    var regions = document.querySelector(".regions");
    if (regions) {
      var buttons = regions.querySelectorAll(".regions__legend button");
      var chosen = "primary";
      function light(tier) {
        regions.dataset.tier = tier;
      }
      buttons.forEach(function (button) {
        button.addEventListener("mouseenter", function () {
          light(button.dataset.tier);
        });
        button.addEventListener("mouseleave", function () {
          light(chosen);
        });
        button.addEventListener("focus", function () {
          light(button.dataset.tier);
        });
        button.addEventListener("click", function () {
          chosen = button.dataset.tier;
          buttons.forEach(function (b) {
            b.setAttribute("aria-pressed", String(b === button));
          });
          light(chosen);
        });
      });
    }

    /* Fidelity: the tabs switch the visible layer */
    var fidelity = document.querySelector("[data-fidelity]");
    if (fidelity) {
      var stage = fidelity.querySelector(".fidelity__stage");
      var list = fidelity.querySelector('[role="tablist"]');
      var fidTabs = list.querySelectorAll('[role="tab"]');
      onTabChange(list, function (index) {
        stage.dataset.level = String(index);
        stage.hidden = false;
        stage.setAttribute("aria-labelledby", fidTabs[index].id);
      });
      stage.hidden = false;
    }

    /* Heuristic review filter */
    var review = document.querySelector(".heuristics");
    if (review) {
      var filters = review.querySelectorAll(".heuristics__filter button");
      filters.forEach(function (button) {
        button.addEventListener("click", function () {
          review.dataset.filter = button.dataset.filter;
          filters.forEach(function (b) {
            b.setAttribute("aria-pressed", String(b === button));
          });
        });
      });
    }

    /* Design stage: the section heading names the selected project, and
       switching projects brings the switcher back into view */
    var projectTabs = document.getElementById("project-tabs");
    var projectHeading = document.getElementById("design-work-h");
    onTabChange(projectTabs, function (index) {
      var tab = projectTabs.querySelectorAll('[role="tab"]')[index];
      if (projectHeading && tab) projectHeading.textContent = tab.dataset.title;
      var section = projectTabs.closest(".project-switch");
      var top = section.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.4) {
        section.scrollIntoView({ block: "start" });
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
