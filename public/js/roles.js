/* Role buttons over a drawing (Surgical Console, users and environment):
   choosing a role lights that person in the drawing and shows its short
   note. Tabs pattern: arrow keys, Home and End move between roles. */
(function () {
  "use strict";
  [].forEach.call(document.querySelectorAll("[data-roles]"), function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    var room = box.querySelector(".room");
    function select(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (room) room.dataset.selected = String(i);
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) {
          e.preventDefault();
          select(n, true);
        }
      });
    });
  });
})();
