(function () {
  var Store = window.LimaStore;
  var cm = document.getElementById("demo-cm");
  var ld = document.getElementById("demo-ld");
  if (cm) {
    cm.addEventListener("click", function () {
      Store.setDemoProfile({ mode: "cm", cmId: "cm_01" });
      window.location.href = "./dashboard.html";
    });
  }
  if (ld) {
    ld.addEventListener("click", function () {
      Store.setDemoProfile({ mode: "leadership" });
      window.location.href = "./leadership.html";
    });
  }
})();
