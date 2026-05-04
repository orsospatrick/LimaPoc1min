(function () {
  var Store = window.LimaStore;
  var Router = window.LimaRouter;
  var UI = window.LimaUi;
  var Mock = window.LimaMock;
  var STAGES = Mock.STAGES;
  var CLIENT_STATUSES = Mock.CLIENT_STATUSES;
  var renderBadge = UI.renderBadge;
  var escapeHtml = UI.escapeHtml;
  var statusBadgeClass = UI.statusBadgeClass;
  var visaBadgeClass = UI.visaBadgeClass;
  var navigate = Router.navigate;

  var els = {
    tbody: document.getElementById("client-tbody"),
    search: document.getElementById("filter-search"),
    stage: document.getElementById("filter-stage"),
    status: document.getElementById("filter-status"),
    pills: document.getElementById("visa-pills"),
    cmAvatar: document.getElementById("cm-avatar"),
    cmName: document.getElementById("cm-display-name"),
    counts: {
      onTrack: document.getElementById("count-ontrack"),
      filed: document.getElementById("count-filed"),
      approved: document.getElementById("count-approved"),
      rfe: document.getElementById("count-rfe"),
      attention: document.getElementById("count-attention"),
    },
  };

  var state = {
    visa: "all",
    stage: "all",
    status: "all",
    search: "",
    sortKey: "risk",
    sortDir: "asc",
  };

  function myClients() {
    return Store.getClientsByCM(Store.getCurrentCmId());
  }

  function countWhere(clients, pred) {
    return clients.filter(pred).length;
  }

  function updateSummary(clients) {
    els.counts.onTrack.textContent = countWhere(clients, function (c) {
      return c.status === "On Track";
    });
    els.counts.filed.textContent = countWhere(clients, function (c) {
      return c.status === "Filed";
    });
    els.counts.approved.textContent = countWhere(clients, function (c) {
      return c.status === "Approved";
    });
    els.counts.rfe.textContent = countWhere(clients, function (c) {
      return c.status === "RFE";
    });
    els.counts.attention.textContent = countWhere(clients, function (c) {
      return (
        c.status === "Overdue" ||
        c.status === "At Risk" ||
        (c.attentionFlags && c.attentionFlags.length > 0)
      );
    });
  }

  function riskScore(c) {
    if (c.status === "Overdue") return 0;
    if (c.status === "At Risk") return 1;
    if (c.status === "RFE") return 2;
    if (c.attentionFlags && c.attentionFlags.length) return 3;
    if (c.status === "Filed") return 4;
    return 5;
  }

  function filteredClients() {
    var list = myClients().slice();
    if (state.visa !== "all") list = list.filter(function (c) {
      return c.visaCategory === state.visa;
    });
    if (state.stage !== "all") list = list.filter(function (c) {
      return c.stage === state.stage;
    });
    if (state.status !== "all") list = list.filter(function (c) {
      return c.status === state.status;
    });
    if (state.search.trim()) {
      var q = state.search.trim().toLowerCase();
      list = list.filter(function (c) {
        return (
          (c.firstName + " " + c.lastName).toLowerCase().indexOf(q) !== -1 ||
          c.email.toLowerCase().indexOf(q) !== -1 ||
          c.id.toLowerCase().indexOf(q) !== -1
        );
      });
    }
    return list;
  }

  function sortClients(list) {
    var dir = state.sortDir === "asc" ? 1 : -1;
    return list.sort(function (a, b) {
      if (state.sortKey === "risk") {
        var ra = riskScore(a);
        var rb = riskScore(b);
        if (ra !== rb) return ra - rb;
        return (a.lastName + " " + a.firstName).localeCompare(b.lastName + " " + b.firstName);
      }
      var key = state.sortKey;
      var va;
      var vb;
      if (key === "name") {
        va = a.lastName + " " + a.firstName;
        vb = b.lastName + " " + b.firstName;
        return va.localeCompare(vb) * dir;
      }
      if (key === "visa") return a.visaCategory.localeCompare(b.visaCategory) * dir;
      if (key === "stage") return a.stage.localeCompare(b.stage) * dir;
      if (key === "days") return (a.daysActive - b.daysActive) * dir;
      if (key === "status") return a.status.localeCompare(b.status) * dir;
      if (key === "task") return (a.nextTask || "").localeCompare(b.nextTask || "") * dir;
      if (key === "pct") return (a.percentComplete - b.percentComplete) * dir;
      return 0;
    });
  }

  function renderTable() {
    var list = sortClients(filteredClients());
    els.tbody.innerHTML = list
      .map(function (c) {
        return (
          '<tr data-id="' +
          escapeHtml(c.id) +
          '">' +
          "<td><strong>" +
          escapeHtml(c.lastName) +
          "</strong>, " +
          escapeHtml(c.firstName) +
          "</td>" +
          "<td>" +
          renderBadge(c.visaCategory, visaBadgeClass(c.visaCategory)) +
          "</td>" +
          "<td>" +
          escapeHtml(c.stage) +
          "</td>" +
          "<td>" +
          c.daysActive +
          "</td>" +
          "<td>" +
          renderBadge(c.status, statusBadgeClass(c.status)) +
          "</td>" +
          "<td>" +
          escapeHtml(c.nextTask || "—") +
          "</td>" +
          "<td>" +
          '<div class="progress" aria-hidden="true"><div class="progress__bar" style="width:' +
          c.percentComplete +
          '%"></div></div>' +
          '<span class="sr-only">' +
          c.percentComplete +
          "%</span>" +
          "</td>" +
          '<td><button type="button" class="btn btn--ghost btn--sm row-open" data-id="' +
          escapeHtml(c.id) +
          '">Open</button></td>' +
          "</tr>"
        );
      })
      .join("");

    if (!list.length) {
      els.tbody.innerHTML = '<tr><td colspan="8" class="empty">No clients match these filters.</td></tr>';
    }
  }

  function wireSort() {
    document.querySelectorAll("[data-sort]").forEach(function (th) {
      th.addEventListener("click", function () {
        var key = th.getAttribute("data-sort");
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = key;
          state.sortDir = "asc";
        }
        renderTable();
      });
    });
  }

  function wireFilters() {
    els.search.addEventListener("input", function () {
      state.search = els.search.value;
      renderTable();
    });
    els.stage.addEventListener("change", function () {
      state.stage = els.stage.value;
      renderTable();
    });
    els.status.addEventListener("change", function () {
      state.status = els.status.value;
      renderTable();
    });
    els.pills.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-visa]");
      if (!btn) return;
      state.visa = btn.getAttribute("data-visa");
      els.pills.querySelectorAll("[data-visa]").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      renderTable();
    });
  }

  function wireTableNav() {
    els.tbody.addEventListener("click", function (e) {
      var tr = e.target.closest("tr[data-id]");
      var btn = e.target.closest(".row-open");
      var id = (btn && btn.getAttribute("data-id")) || (tr && tr.getAttribute("data-id"));
      if (!id) return;
      navigate("./client.html?id=" + encodeURIComponent(id));
    });
  }

  function fillStageOptions() {
    STAGES.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      els.stage.appendChild(opt);
    });
  }

  function fillStatusOptions() {
    CLIENT_STATUSES.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      els.status.appendChild(opt);
    });
  }

  function renderCmHeader() {
    var cms = Store.getCaseManagers();
    var cm = cms.find(function (x) {
      return x.id === Store.getCurrentCmId();
    }) || cms[0];
    if (!cm) return;
    if (els.cmAvatar) {
      els.cmAvatar.textContent = cm.avatarInitials || "CM";
      els.cmAvatar.style.background = cm.avatarBg || "var(--color-primary)";
      els.cmAvatar.style.color = "#fff";
    }
    if (els.cmName) els.cmName.textContent = cm.name;
  }

  function wireDemoReset() {
    var b = document.getElementById("demo-reset");
    if (!b) return;
    b.addEventListener("click", function () {
      if (!confirm("Reset demo data to a fresh snapshot?")) return;
      Store.resetDemoData();
      location.reload();
    });
  }

  function boot() {
    Store.initStore().then(function () {
      renderCmHeader();
      fillStageOptions();
      fillStatusOptions();
      wireSort();
      wireFilters();
      wireTableNav();
      wireDemoReset();
      Store.subscribe(function () {
        updateSummary(myClients());
        renderTable();
      });
      updateSummary(myClients());
      renderTable();
    });
  }

  boot();
})();
