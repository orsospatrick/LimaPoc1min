/** Shared presentational helpers — keeps page scripts focused on wiring. */

function delay(ms) {
  const n = ms ?? 200 + Math.floor(Math.random() * 200);
  return new Promise((r) => setTimeout(r, n));
}

function statusBadgeClass(status) {
  const map = {
    "On Track": "badge--success",
    Overdue: "badge--danger",
    "At Risk": "badge--warning",
    Active: "badge--info",
    Filed: "badge--neutral",
    Approved: "badge--success",
    RFE: "badge--rfe",
    "Needs Attention": "badge--danger",
    Pending: "badge--warning",
    Rejected: "badge--danger",
    "Revision Needed": "badge--warning",
    "Not Started": "badge--neutral",
    "Under Review": "badge--warning",
    Blocked: "badge--danger",
    Complete: "badge--success",
    Requested: "badge--neutral",
    "Not Contacted": "badge--neutral",
    Contacted: "badge--info",
    Agreed: "badge--info",
    "Draft Sent": "badge--warning",
    "Letter Received": "badge--success",
    "In Progress": "badge--info",
    Submitted: "badge--success",
    Accepted: "badge--success",
  };
  return map[status] || "badge--neutral";
}

function visaBadgeClass(visa) {
  if (visa === "EB-1") return "badge--visa-eb1";
  if (visa === "O-1") return "badge--visa-o1";
  if (visa === "L-1") return "badge--visa-l1";
  if (visa === "EB-2 NIW") return "badge--visa-eb2";
  return "badge--neutral";
}

function renderBadge(text, variantClass) {
  return `<span class="badge ${variantClass}">${escapeHtml(text)}</span>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toast(message) {
  let host = document.querySelector(".toast-host");
  if (!host) {
    host = document.createElement("div");
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function showLoading(text = "Saving…") {
  const el = document.createElement("div");
  el.className = "loading-overlay";
  el.setAttribute("data-loading", "1");
  el.textContent = text;
  document.body.appendChild(el);
  return () => el.remove();
}

async function withDemoLatency(run, loadingText) {
  const stop = showLoading(loadingText);
  await delay();
  try {
    return await run();
  } finally {
    stop();
  }
}

window.LimaUi = {
  delay,
  statusBadgeClass,
  visaBadgeClass,
  renderBadge,
  escapeHtml,
  toast,
  showLoading,
  withDemoLatency,
};
