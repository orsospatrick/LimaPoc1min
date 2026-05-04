(function () {
  var Store = window.LimaStore;
  var Router = window.LimaRouter;
  var UI = window.LimaUi;
  var Mock = window.LimaMock;
  var STAGES = Mock.STAGES;
  var renderBadge = UI.renderBadge;
  var escapeHtml = UI.escapeHtml;
  var statusBadgeClass = UI.statusBadgeClass;
  var visaBadgeClass = UI.visaBadgeClass;
  var withDemoLatency = UI.withDemoLatency;
  var toast = UI.toast;
  var navigate = Router.navigate;
  var clientId = Router.getQueryParam("id");

  function tabSetup() {
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".tab-panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== id;
        });
      });
    });
  }

  function stageTimelineDates(c) {
    var weights = [10, 24, 55, 35, 18, 12, 16, 45];
    var out = [];
    var d = new Date(c.kickoffDate + "T12:00:00");
    STAGES.forEach(function (label, idx) {
      var w = weights[idx] * (idx <= c.stageIndex ? 1 : 0.35);
      d = new Date(d.getTime() + w * 86400000);
      out.push({
        label: label,
        date: d.toISOString().slice(0, 10),
        done: idx < c.stageIndex,
        current: idx === c.stageIndex,
      });
    });
    return out;
  }

  function renderHeader(c) {
    document.getElementById("client-name").textContent = c.firstName + " " + c.lastName;
    document.getElementById("client-visa").innerHTML = renderBadge(c.visaCategory, visaBadgeClass(c.visaCategory));
    document.getElementById("client-cm").textContent =
      c.cmName + " · Counsel: " + (c.assignedLawyerName || "—");
    document.getElementById("client-status").innerHTML = renderBadge(c.status, statusBadgeClass(c.status));
    document.getElementById("client-kickoff").textContent = c.kickoffDate;
  }

  function renderOverview(c) {
    var track = document.getElementById("stage-tracker");
    track.innerHTML = STAGES.map(function (label, idx) {
      var done = idx < c.stageIndex;
      var current = idx === c.stageIndex;
      var cls = [done && "is-done", current && "is-current"].filter(Boolean).join(" ");
      return (
        '<div class="stage-step ' +
        cls +
        '"><div class="stage-step__dot"></div>' +
        escapeHtml(label) +
        "</div>"
      );
    }).join("");

    var timeline = document.getElementById("timeline");
    var cols = stageTimelineDates(c);
    var maxH = 72;
    timeline.innerHTML = cols
      .map(function (col, idx) {
        var h = 8 + Math.round((idx <= c.stageIndex ? idx + 1 : 1) * (maxH / 8));
        var active = idx <= c.stageIndex;
        return (
          '<div class="timeline__col">' +
          '<div class="timeline__bar" style="height:' +
          (active ? h : 8) +
          "px;background:" +
          (active ? "var(--color-primary)" : "") +
          '"></div>' +
          '<div class="timeline__label">' +
          escapeHtml(col.label) +
          "</div>" +
          '<div class="timeline__date">' +
          escapeHtml(col.date) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderCriteria(criteria) {
    var ul = document.getElementById("criteria-list");
    ul.innerHTML = criteria
      .map(function (row) {
        var notes = row.cmNotes
          ? '<p style="font-size:12px;margin:0"><strong>CM notes:</strong> ' + escapeHtml(row.cmNotes) + "</p>"
          : "";
        return (
          '<li class="panel-list__item" style="display:flex;flex-direction:column;gap:8px;align-items:stretch;">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">' +
          "<div>" +
          '<div style="font-weight:500">' +
          escapeHtml(row.name || row.label) +
          "</div>" +
          renderBadge(row.status, statusBadgeClass(row.status)) +
          "</div>" +
          '<span style="display:flex;gap:8px;flex-shrink:0;">' +
          '<button type="button" class="btn btn--secondary btn--sm crit-approve" data-id="' +
          escapeHtml(row.id) +
          '">Approve</button>' +
          '<button type="button" class="btn btn--ghost btn--sm crit-revision" data-id="' +
          escapeHtml(row.id) +
          '">Request revision</button>' +
          "</span>" +
          "</div>" +
          '<p style="font-size:12px;color:var(--color-text-muted);margin:0;line-height:1.45">' +
          escapeHtml(row.instructionText || "") +
          "</p>" +
          notes +
          '<div style="font-size:11px;color:var(--color-text-muted)">Linked documents (count): ' +
          (row.documentCount != null ? row.documentCount : 0) +
          "</div>" +
          "</li>"
        );
      })
      .join("");
  }

  function renderTasks(tasks) {
    var ul = document.getElementById("task-list");
    ul.innerHTML = tasks
      .map(function (t) {
        var done = t.status === "Complete" || t.completed;
        return (
          '<li class="panel-list__item" style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center;">' +
          '<input type="checkbox" class="task-check" data-id="' +
          escapeHtml(t.id) +
          '" ' +
          (done ? "checked" : "") +
          " />" +
          "<div>" +
          '<div style="font-weight:500">' +
          escapeHtml(t.title) +
          "</div>" +
          '<div style="font-size:12px;color:var(--color-text-muted)">Due ' +
          escapeHtml(t.dueDate) +
          " · " +
          escapeHtml(t.priority) +
          " · " +
          escapeHtml(t.status) +
          "</div>" +
          "</div>" +
          renderBadge(t.priority, t.priority === "High" ? "badge--danger" : "badge--neutral") +
          "</li>"
        );
      })
      .join("");
  }

  function renderDocs(docs, criteria, client) {
    var critName = new Map(criteria.map(function (c) {
      return [c.id, c.name || c.label];
    }));
    var groups = new Map();
    groups.set("General uploads", []);

    docs.forEach(function (d) {
      var key = d.criterionId ? critName.get(d.criterionId) || "Criterion" : "General uploads";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(d);
    });

    var host = document.getElementById("doc-folders");
    var parts = [];
    groups.forEach(function (items, folder) {
      if (!items.length) return;
      parts.push(
        '<div class="doc-folder">' +
          '<div class="doc-folder__head">' +
          escapeHtml(folder) +
          "</div>" +
          '<ul class="doc-folder__list">' +
          items
            .map(function (d) {
              return (
                "<li>" +
                escapeHtml(d.fileName || d.name) +
                ' <span style="color:var(--color-text-muted);font-size:11px">' +
                escapeHtml(d.fileType || "pdf") +
                " · v" +
                (d.version || 1) +
                "</span></li>"
              );
            })
            .join("") +
          "</ul>" +
          "</div>",
      );
    });
    host.innerHTML = parts.join("") || '<p class="empty">No documents on file.</p>';
  }

  function renderMessages(msgs) {
    var host = document.getElementById("msg-thread");
    host.innerHTML = msgs
      .map(function (m) {
        return (
          '<div class="message">' +
          '<div class="message__meta">' +
          (m.isPinned ? "📌 " : "") +
          escapeHtml(m.senderName || m.author) +
          " · " +
          escapeHtml(m.createdAt) +
          "</div>" +
          "<div>" +
          escapeHtml(m.content || m.body) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function wireCriteria() {
    document.getElementById("criteria-list").addEventListener("click", function (e) {
      var ap = e.target.closest(".crit-approve");
      var rv = e.target.closest(".crit-revision");
      if (!ap && !rv) return;
      var id = (ap || rv).getAttribute("data-id");
      withDemoLatency(function () {
        Store.updateCriterion(id, { status: ap ? "Approved" : "Revision Needed" });
        return Promise.resolve();
      }).then(function () {
        toast(ap ? "Criterion approved." : "Revision requested.");
      });
    });
    document.getElementById("crit-upload-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("crit-label");
      var v = input.value.trim();
      if (!v) return;
      withDemoLatency(function () {
        Store.addCriterion(clientId, v);
        input.value = "";
        return Promise.resolve();
      }).then(function () {
        toast("Criterion added.");
      });
    });
  }

  function wireTasks() {
    document.getElementById("task-list").addEventListener("change", function (e) {
      var cb = e.target.closest(".task-check");
      if (!cb) return;
      withDemoLatency(function () {
        Store.completeTask(cb.getAttribute("data-id"), cb.checked);
        return Promise.resolve();
      }).then(function () {
        toast(cb.checked ? "Task marked complete." : "Task reopened.");
      });
    });
    document.getElementById("task-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var title = document.getElementById("task-title").value.trim();
      var due = document.getElementById("task-due").value;
      var pri = document.getElementById("task-pri").value;
      if (!title || !due) return;
      withDemoLatency(function () {
        Store.addTask(clientId, { title: title, dueDate: due, priority: pri });
        return Promise.resolve();
      }).then(function () {
        document.getElementById("task-title").value = "";
        toast("Task created.");
      });
    });
  }

  function wireDocs() {
    document.getElementById("doc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("doc-name").value.trim() || "uploaded_document.pdf";
      var stage = document.getElementById("doc-stage").value;
      withDemoLatency(function () {
        Store.addDocument(clientId, name, stage);
        return Promise.resolve();
      }).then(function () {
        document.getElementById("doc-name").value = "";
        toast("Document recorded.");
      });
    });
  }

  function wireMessages() {
    document.getElementById("msg-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var body = document.getElementById("msg-body").value.trim();
      if (!body) return;
      var cms = Store.getCaseManagers();
      var cm = cms.find(function (x) {
        return x.id === Store.getCurrentCmId();
      });
      var sender = (cm && cm.name) || "Case Manager";
      withDemoLatency(function () {
        Store.addMessage(clientId, sender, body);
        return Promise.resolve();
      }).then(function () {
        document.getElementById("msg-body").value = "";
        toast("Message posted to thread.");
      });
    });
  }

  function syncDemoStatusSelect(c) {
    var sel = document.getElementById("demo-status-select");
    if (!sel || !c) return;
    if (Mock.CLIENT_STATUSES.indexOf(c.status) !== -1) {
      sel.value = c.status;
    }
  }

  function wireDemoMatterStatus() {
    var sel = document.getElementById("demo-status-select");
    if (!sel || sel.dataset.wired === "1") return;
    sel.dataset.wired = "1";
    Mock.CLIENT_STATUSES.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s;
      o.textContent = s;
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () {
      var v = sel.value;
      Store.updateClient(clientId, {
        status: v,
        atRisk: v === "At Risk",
        overdue: v === "Overdue",
      });
      toast("Matter status updated.");
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

  function renderAll() {
    var c = Store.getClient(clientId);
    if (!c) {
      document.getElementById("client-root").innerHTML =
        '<div class="page-body"><p class="empty">Client not found.</p></div>';
      return;
    }
    renderHeader(c);
    renderOverview(c);
    syncDemoStatusSelect(c);
    renderCriteria(Store.getCriteria(clientId));
    renderTasks(Store.getTasks(clientId));
    renderDocs(Store.getDocuments(clientId), Store.getCriteria(clientId), c);
    renderMessages(Store.getMessages(clientId));
  }

  function boot() {
    if (!clientId) {
      navigate("./dashboard.html");
      return;
    }
    Store.initStore().then(function () {
      var docStage = document.getElementById("doc-stage");
      STAGES.forEach(function (s) {
        var o = document.createElement("option");
        o.value = s;
        o.textContent = s;
        docStage.appendChild(o);
      });
      tabSetup();
      wireCriteria();
      wireTasks();
      wireDocs();
      wireMessages();
      wireDemoReset();
      wireDemoMatterStatus();
      Store.subscribe(function () {
        renderAll();
      });
      document.getElementById("back-dash").addEventListener("click", function () {
        navigate("./dashboard.html");
      });
      renderAll();
    });
  }

  boot();
})();
