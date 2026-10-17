/* Case-study behaviour shared by Luna, KU Brand and Asian's:
   the stages rail, principle tooltips, flip cards and opening a tab from a link. */
(function () {
  "use strict";

  /* Stages rail: highlight the stage on screen; on phones it opens as a list */
  function initRail() {
    var rail = document.querySelector(".rail");
    if (!rail) return;
    var links = [].slice.call(rail.querySelectorAll("ol a"));
    var stages = links
      .map(function (link) {
        return document.getElementById(link.getAttribute("href").slice(1));
      })
      .filter(Boolean);
    var toggle = rail.querySelector(".rail__toggle");
    var current = rail.querySelector(".rail__current");
    var count = rail.querySelector(".rail__count");

    function setActive(index) {
      links.forEach(function (link, i) {
        if (i === index) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      if (current) current.textContent = links[index].textContent.replace(/^\d+\.\s*/, "");
      if (count) count.textContent = index + 1 + "/" + links.length;
    }

    function update() {
      var line = window.innerHeight * 0.35;
      var index = 0;
      stages.forEach(function (stage, i) {
        if (stage.getBoundingClientRect().top <= line) index = i;
      });
      setActive(index);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = !rail.classList.contains("is-open");
        rail.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.forEach(function (link) {
        link.addEventListener("click", function () {
          rail.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* Principle chips: show the principle's definition in a small tooltip */
  function initPrinciples() {
    var chips = document.querySelectorAll("[data-principle]");
    if (!chips.length) return;
    var tip = document.createElement("div");
    tip.className = "tooltip";
    tip.id = "principle-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);

    function show(chip) {
      var card = document.getElementById(chip.getAttribute("href").slice(1));
      if (!card) return;
      var title = card.querySelector("h3, h4");
      var text = card.querySelector("p");
      tip.innerHTML = "";
      var b = document.createElement("b");
      b.textContent = title ? title.textContent : chip.textContent;
      var p = document.createElement("p");
      p.textContent = text ? text.textContent : "";
      tip.appendChild(b);
      tip.appendChild(p);
      tip.hidden = false;
      chip.setAttribute("aria-describedby", tip.id);
      var r = chip.getBoundingClientRect();
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      var left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), window.innerWidth - w - 12);
      var top = r.top - h - 12;
      if (top < 12) top = r.bottom + 12;
      tip.style.translate = left + "px " + top + "px";
    }
    function hide(chip) {
      tip.hidden = true;
      if (chip) chip.removeAttribute("aria-describedby");
    }
    chips.forEach(function (chip) {
      chip.addEventListener("mouseenter", function () {
        show(chip);
      });
      chip.addEventListener("focus", function () {
        show(chip);
      });
      chip.addEventListener("mouseleave", function () {
        hide(chip);
      });
      chip.addEventListener("blur", function () {
        hide(chip);
      });
    });
    window.addEventListener("scroll", function () {
      hide();
    }, { passive: true });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hide();
    });
  }

  /* Flip cards */
  function initFlips() {
    document.querySelectorAll(".flip").forEach(function (card) {
      card.addEventListener("click", function () {
        card.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true"));
      });
    });
  }

  /* A link to a panel inside tabs (for example #p-arm) selects that tab first */
  function openFromHash(hash) {
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    var panel = target.closest('[role="tabpanel"]');
    if (!panel) return;
    if (window.Site) window.Site.initTabs();
    var tab = document.querySelector('[role="tab"][aria-controls="' + panel.id + '"]');
    if (!tab) return;
    var list = tab.closest('[role="tablist"]');
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    if (list.selectTab) list.selectTab(tabs.indexOf(tab), false);
    requestAnimationFrame(function () {
      target.scrollIntoView({ block: "start" });
    });
  }
  function initHashLinks() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target && target.closest('[role="tabpanel"][hidden]')) {
        event.preventDefault();
        history.pushState(null, "", link.getAttribute("href"));
        openFromHash(link.getAttribute("href"));
      }
    });
    window.addEventListener("hashchange", function () {
      openFromHash(location.hash);
    });
    openFromHash(location.hash);
  }

  function start() {
    initRail();
    initPrinciples();
    initFlips();
    initHashLinks();
    /* one way to jump to any part of the page, even inside a closed tab */
    if (window.Site) {
      window.Site.goTo = function (id) {
        var target = document.getElementById(id);
        if (!target) return false;
        if (target.closest('[role="tabpanel"]')) openFromHash("#" + id);
        else target.scrollIntoView({ block: "start" });
        return true;
      };
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
