(function () {
  var Store = window.LimaStore;
  var UI = window.LimaUi;
  var renderBadge = UI.renderBadge;
  var escapeHtml = UI.escapeHtml;
  var statusBadgeClass = UI.statusBadgeClass;

  var STATUS_CHART_LABELS = ["On Track", "Overdue", "At Risk", "Filed", "Approved", "RFE"];

  function renderStatCards(stats) {
    var map = [
      ["stat-total", stats.total],
      ["stat-active", stats.activeMotion],
      ["stat-filed", stats.filed],
      ["stat-approved", stats.approved],
      ["stat-rfe", stats.rfe],
      ["stat-attn", stats.needsAttention],
    ];
    map.forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (el) el.textContent = pair[1];
    });
  }

  function heatClass(n) {
    if (n <= 28) return "heatmap--low";
    if (n <= 33) return "heatmap--mid";
    return "heatmap--high";
  }

  function renderHeatmap(loads) {
    var host = document.getElementById("heatmap");
    if (!host) return;
    host.innerHTML = loads
      .map(function (row) {
        return (
          '<div class="heatmap__cell ' +
          heatClass(row.count) +
          '">' +
          '<div style="font-size:11px;color:var(--color-text-muted)">' +
          escapeHtml(row.cm.name.split(" ")[0]) +
          "</div>" +
          "<span>" +
          row.count +
          "</span>" +
          '<div style="font-size:10px;color:var(--color-text-muted)">cases</div>' +
          "</div>"
        );
      })
      .join("");
  }

  function renderCmTable(loads) {
    var tb = document.getElementById("cm-tbody");
    if (!tb) return;
    tb.innerHTML = loads
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" +
          escapeHtml(row.cm.name) +
          "</td>" +
          "<td>" +
          row.count +
          "</td>" +
          "<td>" +
          row.atRisk +
          "</td>" +
          "<td>" +
          row.overdue +
          "</td>" +
          "<td>" +
          (row.count > 33 ? "High" : row.count > 28 ? "Elevated" : "OK") +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderAttention() {
    var panel = document.getElementById("attention-list");
    if (!panel) return;
    var rows = Store.getAttentionClients()
      .sort(function (a, b) {
        function o(x) {
          if (x.status === "Overdue") return 0;
          if (x.status === "At Risk") return 1;
          return 2;
        }
        return o(a) - o(b) || (a.lastName + "").localeCompare(b.lastName + "");
      })
      .slice(0, 14);
    panel.innerHTML = rows
      .map(function (c) {
        return (
          '<div class="panel-list__item" style="display:flex;justify-content:space-between;gap:12px;align-items:center;">' +
          "<div>" +
          '<div style="font-weight:500">' +
          escapeHtml(c.lastName) +
          ", " +
          escapeHtml(c.firstName) +
          "</div>" +
          '<div style="font-size:12px;color:var(--color-text-muted)">' +
          escapeHtml(c.nextTask || "") +
          "</div>" +
          "</div>" +
          renderBadge(c.status, statusBadgeClass(c.status)) +
          "</div>"
        );
      })
      .join("");
    if (!rows.length) panel.innerHTML = '<p class="empty">No cases flagged right now.</p>';
  }

  function simpleBarRow(label, count, max) {
    var pct = max > 0 ? Math.round((100 * count) / max) : 0;
    return (
      '<div style="margin:10px 0">' +
      '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">' +
      "<span>" +
      escapeHtml(label) +
      "</span>" +
      "<span>" +
      count +
      "</span>" +
      "</div>" +
      '<div class="progress" aria-hidden="true"><div class="progress__bar" style="width:' +
      pct +
      '%"></div></div>' +
      "</div>"
    );
  }

  function renderCharts(clients) {
    var statusData = STATUS_CHART_LABELS.map(function (s) {
      return clients.filter(function (c) {
        return c.status === s;
      }).length;
    });
    var maxS = Math.max.apply(null, statusData.concat([1]));

    var statusHost = document.getElementById("chart-status-inner");
    if (statusHost) {
      statusHost.innerHTML = STATUS_CHART_LABELS.map(function (l, i) {
        return simpleBarRow(l, statusData[i], maxS);
      }).join("");
    }

    var visaLabels = ["EB-1", "O-1", "L-1", "EB-2 NIW"];
    var visaData = visaLabels.map(function (v) {
      return clients.filter(function (c) {
        return c.visaCategory === v;
      }).length;
    });
    var maxV = Math.max.apply(null, visaData.concat([1]));
    var visaHost = document.getElementById("chart-visa-inner");
    if (visaHost) {
      visaHost.innerHTML = visaLabels.map(function (l, i) {
        return simpleBarRow(l, visaData[i], maxV);
      }).join("");
    }
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

  function fullRender() {
    var clients = Store.getClients();
    var stats = Store.getPortfolioStats();
    renderStatCards(stats);
    var loads = Store.getCMCaseloads();
    renderHeatmap(loads);
    renderCmTable(loads);
    renderAttention();
    renderCharts(clients);
  }

  function boot() {
    Store.initStore().then(function () {
      wireDemoReset();
      Store.subscribe(function () {
        fullRender();
      });
      fullRender();
    });
  }

  boot();
})();
