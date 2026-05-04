/** Switch CM portfolio ↔ Leadership without going through index.html */
(function () {
  function goLeadership(e) {
    if (e) e.preventDefault();
    if (window.LimaStore) {
      window.LimaStore.setDemoProfile({ mode: "leadership" });
    }
    window.location.href = "./leadership.html";
  }

  function goCmPortfolio(e) {
    if (e) e.preventDefault();
    if (window.LimaStore) {
      window.LimaStore.setDemoProfile({ mode: "cm", cmId: "cm_01" });
    }
    window.location.href = "./dashboard.html";
  }

  document.querySelectorAll(".nav-leadership").forEach(function (el) {
    el.addEventListener("click", goLeadership);
  });

  document.querySelectorAll(".nav-cm-portfolio").forEach(function (el) {
    el.addEventListener("click", goCmPortfolio);
  });
})();
