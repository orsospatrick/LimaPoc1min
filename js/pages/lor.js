(function () {
  var Store = window.LimaStore;
  var UI = window.LimaUi;
  var Mock = window.LimaMock;
  var LOR_PIPELINE_STATUSES = Mock.LOR_PIPELINE_STATUSES;
  var renderBadge = UI.renderBadge;
  var escapeHtml = UI.escapeHtml;
  var statusBadgeClass = UI.statusBadgeClass;
  var visaBadgeClass = UI.visaBadgeClass;

  var els = {
    tbody: document.getElementById("lor-tbody"),
    chips: document.getElementById("lor-chips"),
    pipeline: document.getElementById("lor-pipeline"),
  };

  var filters = {
    cm: "all",
    status: "all",
    overdueOnly: false,
    visa: "all",
  };

  function pipelineCounts(list) {
    return LOR_PIPELINE_STATUSES.map(function (s) {
      return {
        label: s,
        count: list.filter(function (x) {
          return x.status === s;
        }).length,
      };
    });
  }

  function renderPipeline(list) {
    var counts = pipelineCounts(list);
    els.pipeline.innerHTML = counts
      .map(function (c) {
        return (
          '<div class="pipeline__col">' +
          '<div class="pipeline__count">' +
          c.count +
          "</div>" +
          '<div class="pipeline__label">' +
          escapeHtml(c.label) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function filtered() {
    var rows = Store.getAllLORs().slice();
    if (filters.cm !== "all") rows = rows.filter(function (r) {
      return r.cmId === filters.cm;
    });
    if (filters.status !== "all") rows = rows.filter(function (r) {
      return r.status === filters.status;
    });
    if (filters.overdueOnly) rows = rows.filter(function (r) {
      return r.daysOverdue > 0;
    });
    if (filters.visa !== "all") rows = rows.filter(function (r) {
      return r.visaCategory === filters.visa;
    });
    return rows;
  }

  function renderTable() {
    var rows = filtered();
    els.tbody.innerHTML = rows
      .map(function (r) {
        return (
          "<tr>" +
          "<td>" +
          escapeHtml(r.beneficiary || r.clientName) +
          "</td>" +
          "<td>" +
          escapeHtml(r.recommenderName) +
          '<div style="font-size:11px;color:var(--color-text-muted)">' +
          escapeHtml(r.recommenderTitle) +
          ", " +
          escapeHtml(r.recommenderOrganization) +
          "</div></td>" +
          "<td>" +
          escapeHtml(r.cmName) +
          "</td>" +
          "<td>" +
          renderBadge(r.visaCategory, visaBadgeClass(r.visaCategory)) +
          "</td>" +
          "<td>" +
          renderBadge(r.status, statusBadgeClass(r.status)) +
          "</td>" +
          "<td>" +
          escapeHtml(r.deadline || r.dueDate) +
          "</td>" +
          "<td>" +
          (r.daysOverdue > 0 ? renderBadge(r.daysOverdue + "d", "badge--danger") : "—") +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
    if (!rows.length) {
      els.tbody.innerHTML = '<tr><td colspan="7" class="empty">No LOR rows for this filter set.</td></tr>';
    }
    renderPipeline(Store.getAllLORs());
  }

  function renderChips(cms) {
    els.chips.innerHTML =
      '<button type="button" class="pill is-active" data-filter="reset">All</button>' +
      '<span style="font-size:12px;color:var(--color-text-muted);align-self:center">CM:</span>' +
      cms
        .map(function (cm) {
          return (
            '<button type="button" class="pill" data-cm="' +
            escapeHtml(cm.id) +
            '">' +
            escapeHtml(cm.name) +
            "</button>"
          );
        })
        .join("") +
      '<span style="font-size:12px;color:var(--color-text-muted);align-self:center">Status:</span>' +
      LOR_PIPELINE_STATUSES.map(function (s) {
        return (
          '<button type="button" class="pill" data-status="' +
          escapeHtml(s) +
          '">' +
          escapeHtml(s) +
          "</button>"
        );
      }).join("") +
      '<button type="button" class="pill" data-overdue="1">Overdue</button>' +
      '<span style="font-size:12px;color:var(--color-text-muted);align-self:center">Visa:</span>' +
      ["EB-1", "O-1", "L-1", "EB-2 NIW"]
        .map(function (v) {
          return (
            '<button type="button" class="pill" data-visa="' +
            escapeHtml(v) +
            '">' +
            escapeHtml(v) +
            "</button>"
          );
        })
        .join("");
  }

  function updatePillStyles() {
    els.chips.querySelectorAll(".pill").forEach(function (p) {
      var active = false;
      if (p.hasAttribute("data-filter")) {
        active =
          filters.cm === "all" &&
          filters.status === "all" &&
          !filters.overdueOnly &&
          filters.visa === "all";
      } else if (p.hasAttribute("data-cm")) {
        active = filters.cm !== "all" && p.getAttribute("data-cm") === filters.cm;
      } else if (p.hasAttribute("data-status")) {
        active = filters.status !== "all" && p.getAttribute("data-status") === filters.status;
      } else if (p.hasAttribute("data-overdue")) {
        active = filters.overdueOnly;
      } else if (p.hasAttribute("data-visa")) {
        active = filters.visa !== "all" && p.getAttribute("data-visa") === filters.visa;
      }
      p.classList.toggle("is-active", active);
    });
  }

  function wireChips() {
    els.chips.addEventListener("click", function (e) {
      var btn = e.target.closest(".pill");
      if (!btn) return;
      if (btn.hasAttribute("data-filter")) {
        filters.cm = "all";
        filters.status = "all";
        filters.overdueOnly = false;
        filters.visa = "all";
      }
      if (btn.hasAttribute("data-cm")) {
        filters.cm = btn.getAttribute("data-cm");
      }
      if (btn.hasAttribute("data-status")) {
        filters.status = btn.getAttribute("data-status");
      }
      if (btn.hasAttribute("data-overdue")) {
        filters.overdueOnly = !filters.overdueOnly;
      }
      if (btn.hasAttribute("data-visa")) {
        filters.visa = btn.getAttribute("data-visa");
      }
      updatePillStyles();
      renderTable();
    });
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
      var cms = Store.getCaseManagers();
      renderChips(cms);
      wireChips();
      wireDemoReset();
      updatePillStyles();
      Store.subscribe(function () {
        renderTable();
      });
      renderTable();
    });
  }

  boot();
})();
