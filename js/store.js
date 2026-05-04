const STORAGE_KEY = "lima_crm_data";
const LEGACY_KEY = "lima_crm_state";
const DEMO_PROFILE_KEY = "lima_demo_profile";

const listeners = new Set();

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.__state));
  } catch {
    /* quota — in-memory only */
  }
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(window.__state);
    } catch (e) {
      console.error(e);
    }
  });
}

function getDemoProfile() {
  try {
    const raw = localStorage.getItem(DEMO_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { mode: "cm", cmId: "cm_01" };
}

function setDemoProfile(profile) {
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
}

function getCurrentCmId() {
  const p = getDemoProfile();
  return p.mode === "cm" ? p.cmId || "cm_01" : "cm_01";
}

function ensureStateShape(raw) {
  if (!raw || raw.version !== 3 || !Array.isArray(raw.clients) || raw.clients.length < 5) return null;
  return raw;
}

function initStore() {
  return new Promise(function (resolve) {
    var stale = document.getElementById("demo-boot-overlay");
    if (stale) stale.remove();
    try {
      try {
        localStorage.removeItem(LEGACY_KEY);
      } catch {
        /* ignore */
      }
      var raw = ensureStateShape(loadRaw());
      if (!raw) {
        raw = window.LimaMock.generateMockData();
        window.__state = raw;
        persist();
      } else {
        window.__state = raw;
      }
      notify();
    } catch (e) {
      console.error(e);
      window.__state = window.LimaMock.generateMockData();
      persist();
      notify();
    }
    resolve();
  });
}

function resetDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.__state = window.LimaMock.generateMockData();
  persist();
  notify();
}

function resetStore() {
  resetDemoData();
}

function sync(mutator) {
  mutator();
  persist();
  notify();
}

/** Recompute derived client fields after tasks/criteria change. */
function syncClientRollups(clientId) {
  const client = window.__state.clients.find((c) => c.id === clientId);
  if (!client) return;

  const tasks = window.__state.tasks.filter((t) => t.clientId === clientId);
  const crits = window.__state.criteria.filter((c) => c.clientId === clientId);
  const totalCrit = Math.max(1, crits.length);
  const approvedCrit = crits.filter((x) => x.status === "Approved").length;
  const stageBase = {
    Kickoff: 5,
    "Membership/Profile": 15,
    "Evidence Building": 40,
    LOR: 60,
    "Press Strategy": 70,
    "Quality Control": 85,
    Filing: 95,
    "Post-Filing": 100,
  }[client.stage] ?? 50;
  const critBoost = Math.round((approvedCrit / totalCrit) * 22);
  client.percentComplete = Math.min(100, stageBase + critBoost);

  const open = tasks
    .filter((t) => t.status !== "Complete")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const nt = open[0];
  if (nt) {
    client.nextTaskTitle = nt.title;
    client.nextTaskDue = nt.dueDate;
    client.nextTask = `${nt.title} — due ${nt.dueDate}`;
  }

  const today = new Date().toISOString().slice(0, 10);
  const overdueTasks = tasks.some((t) => t.status !== "Complete" && t.dueDate < today);
  client.overdue = client.status === "Overdue" || overdueTasks;
  client.atRisk = client.status === "At Risk";
}

function getClients() {
  return window.__state.clients;
}

function getClientsByCM(cmId) {
  return window.__state.clients.filter((c) => c.cmId === cmId || c.assignedCmId === cmId);
}

function getClient(id) {
  return window.__state.clients.find((c) => c.id === id) || null;
}

function getClientById(id) {
  return getClient(id);
}

function updateClient(id, patch) {
  sync(() => {
    const idx = window.__state.clients.findIndex((c) => c.id === id);
    if (idx === -1) return;
    window.__state.clients[idx] = { ...window.__state.clients[idx], ...patch };
  });
}

function getCaseManagers() {
  return window.__state.caseManagers;
}

function getLeadershipUsers() {
  return window.__state.leadership || [];
}

function getTasks(clientId) {
  return window.__state.tasks.filter((t) => t.clientId === clientId);
}

function getTasksByClient(clientId) {
  return getTasks(clientId);
}

function addTask(clientId, { title, dueDate, priority }) {
  const id = `task_${Date.now()}`;
  sync(() => {
    window.__state.tasks.push({
      id,
      clientId,
      title,
      dueDate,
      priority: priority || "Medium",
      status: "Not Started",
      assignedToId: getCurrentCmId(),
      createdAt: new Date().toISOString().slice(0, 10),
      completedAt: null,
      completed: false,
    });
    syncClientRollups(clientId);
  });
  return id;
}

function completeTask(taskId, completed) {
  sync(() => {
    const t = window.__state.tasks.find((x) => x.id === taskId);
    if (!t) return;
    t.completed = completed;
    t.status = completed ? "Complete" : "In Progress";
    t.completedAt = completed ? new Date().toISOString().slice(0, 10) : null;
    syncClientRollups(t.clientId);
  });
}

function getCriteria(clientId) {
  return window.__state.criteria.filter((c) => c.clientId === clientId);
}

function getCriteriaByClient(clientId) {
  return getCriteria(clientId);
}

function updateCriterion(id, patch) {
  sync(() => {
    const row = window.__state.criteria.find((c) => c.id === id);
    if (!row) return;
    Object.assign(row, patch);
    syncClientRollups(row.clientId);
  });
}

function addCriterion(clientId, label) {
  const id = `crit_${Date.now()}`;
  sync(() => {
    const client = getClient(clientId);
    window.__state.criteria.push({
      id,
      clientId,
      name: label,
      label,
      visaCategory: client?.visaCategory || "EB-1",
      instructionText: "Add supporting evidence and CM review notes.",
      status: "Not Started",
      cmNotes: "",
      documentCount: 0,
    });
    syncClientRollups(clientId);
  });
  return id;
}

function getDocuments(clientId) {
  return window.__state.documents.filter((d) => d.clientId === clientId);
}

function getDocumentsByClient(clientId) {
  return getDocuments(clientId);
}

function addDocument(clientId, name, stage) {
  const id = `doc_${Date.now()}`;
  sync(() => {
    window.__state.documents.push({
      id,
      clientId,
      criterionId: null,
      fileName: name,
      name,
      fileType: "pdf",
      fileSize: 250000,
      version: 1,
      uploadedById: getCurrentCmId(),
      uploadedAt: new Date().toISOString(),
      stage: stage || "Evidence Building",
    });
  });
  return id;
}

function getMessages(clientId) {
  return window.__state.messages
    .filter((m) => m.clientId === clientId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function getMessagesByClient(clientId) {
  return getMessages(clientId);
}

function addMessage(clientId, authorOrName, body) {
  const id = `msg_${Date.now()}`;
  sync(() => {
    window.__state.messages.push({
      id,
      clientId,
      senderId: getCurrentCmId(),
      senderName: authorOrName,
      content: body,
      author: authorOrName,
      body,
      createdAt: new Date().toISOString().slice(0, 10),
      isPinned: false,
    });
  });
  return id;
}

function getLors() {
  return window.__state.lors;
}

function getAllLORs() {
  return window.__state.lors;
}

function getLORsByClient(clientId) {
  return window.__state.lors.filter((l) => l.clientId === clientId);
}

function updateLor(id, patch) {
  sync(() => {
    const row = window.__state.lors.find((l) => l.id === id);
    if (row) Object.assign(row, patch);
  });
}

function getAttentionClients() {
  return window.__state.clients.filter(
    (c) =>
      (c.attentionFlags && c.attentionFlags.length > 0) ||
      c.status === "Overdue" ||
      c.status === "At Risk" ||
      c.status === "RFE",
  );
}

function getCMCaseloads() {
  const clients = window.__state.clients;
  return window.__state.caseManagers.map((cm) => {
    const mine = clients.filter((c) => c.cmId === cm.id);
    const atRisk = mine.filter((c) => c.status === "At Risk").length;
    const overdue = mine.filter((c) => c.status === "Overdue").length;
    return {
      cm,
      count: cm.heatmapCount ?? mine.length,
      activeCount: mine.length,
      atRisk,
      overdue,
    };
  });
}

function getPortfolioStats() {
  const clients = window.__state.clients;
  const total = clients.length;
  const onTrack = clients.filter((c) => c.status === "On Track").length;
  const filed = clients.filter((c) => c.status === "Filed").length;
  const approved = clients.filter((c) => c.status === "Approved").length;
  const rfe = clients.filter((c) => c.status === "RFE").length;
  const needsAttention = clients.filter(
    (c) =>
      c.status === "Overdue" ||
      c.status === "At Risk" ||
      (c.attentionFlags && c.attentionFlags.length > 0),
  ).length;
  const activeMotion = clients.filter((c) => ["On Track", "At Risk", "Overdue"].includes(c.status)).length;
  return { total, onTrack, activeMotion, filed, approved, rfe, needsAttention };
}

function reassignClients(clientIds, newCmId) {
  const cm = window.__state.caseManagers.find((x) => x.id === newCmId);
  if (!cm) return;
  sync(() => {
    for (const cid of clientIds) {
      const c = window.__state.clients.find((x) => x.id === cid);
      if (c) {
        c.cmId = cm.id;
        c.assignedCmId = cm.id;
        c.cmName = cm.name;
      }
    }
  });
}

window.LimaStore = {
  subscribe,
  getDemoProfile,
  setDemoProfile,
  getCurrentCmId,
  initStore,
  resetDemoData,
  resetStore,
  syncClientRollups,
  getClients,
  getClientsByCM,
  getClient,
  getClientById,
  updateClient,
  getCaseManagers,
  getLeadershipUsers,
  getTasks,
  getTasksByClient,
  addTask,
  completeTask,
  getCriteria,
  getCriteriaByClient,
  updateCriterion,
  addCriterion,
  getDocuments,
  getDocumentsByClient,
  addDocument,
  getMessages,
  getMessagesByClient,
  addMessage,
  getLors,
  getAllLORs,
  getLORsByClient,
  updateLor,
  getAttentionClients,
  getCMCaseloads,
  getPortfolioStats,
  reassignClients,
};
