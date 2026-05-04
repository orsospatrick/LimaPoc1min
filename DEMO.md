# Lima CRM — Demo Guide (Happy Flow)

Static prototype: **no server**, data lives in **localStorage** (`lima_crm_data`, `lima_demo_profile`). Runs from the folder (with classic scripts) or on **GitHub Pages**.

---

## What the Demo Includes

| Area | Contents |
|------|----------|
| **Data** | 6 clients, all assigned to **Sarah Chen**; criteria, tasks, documents, messages, and a few LOR records in the dataset (no dedicated LOR page in the menu). |
| **Client Portfolio** (`dashboard.html`) | KPI cards, filters (visa / stage / status), search, sortable table, click-through to client. |
| **Client** (`client.html?id=…`) | Overview (stage tracker + **editable matter status** for demo), Criteria, Tasks, Timeline, Documents, Messages. |
| **Leadership** (`leadership.html`) | Portfolio KPIs, simple status/visa bar charts, CM heatmap, CM table, "Needs attention" list. |
| **Role Switching** | From the topbar: **Leadership** ↔ **Client Portfolio** (no need to return to `index.html`). **Home** takes you back to the entry page. |
| **Reset** | **Reset demo** button — clears the snapshot and regenerates the default data. |

---

## Happy Flow — Step by Step

### A. Entry and CM Role

1. Open **`index.html`**.
2. Click **"Log in as Client Manager (Sarah Chen)"** → loads `dashboard.html`.
3. You'll see **6 clients** in the table and **5 KPI cards** at the top (On Track, Filed, Approved, RFE, Needs Attention).
4. (Optional) Filter the list: click the **EB-1** pill, or use the **Stage** / **Status** dropdowns; try searching for **"Patel"**.
5. Sort the table: click any column header (e.g., **Days Active**).
6. Click **Open** on a row (e.g., **Aisha Patel**).

### B. Client Page (Matter View)

7. **Overview** tab: review the **stage tracker** and the **"Demo — matter status"** card (dropdown).
8. **Change the status (e.g., from At Risk to On Track)**
   - Open the **Demo — matter status** dropdown.
   - Select **On Track** (or any other status from the list).
   - The change saves to localStorage immediately; a toast confirms the action.
   - The header badge updates instantly; when you click **Back to portfolio**, you'll see the KPIs recalculated.
9. **Criteria** tab: try **Approve** / **Request revision** on different criteria.
10. **Tasks** tab: check off a task as complete, or add a new one.
11. **Documents** / **Messages** / **Timeline** tabs: browse through the demo content.
12. Click **Back to portfolio** to return to the client list.

### C. Leadership View (No Need to Log Out)

13. From the topbar, click **Leadership** → loads `leadership.html`.
14. Walk through the KPI cards, bar charts, heatmap, CM table, and attention panel.
15. Click **Client Portfolio** (topbar or sidebar) to return to the CM list, with the CM profile preserved.

### D. Reset

16. Click **Reset demo** (bottom-right corner) → confirm → fresh data is regenerated from `mock-data.js`.

---

## How the "At Risk" Status Changes (Technical Summary)

| Method | Where |
|--------|-------|
| **In the UI (recommended for the demo)** | Client page → **Overview** tab → **Demo — matter status** → pick another status (e.g., **On Track**). Uses `LimaStore.updateClient(id, { status, atRisk, overdue })`. |
| **In the default data** | Edit `js/mock-data.js`, modify the `clientSpecs` entry for the target client (e.g., `status: "On Track"`), then click **Reset demo** — or manually delete `lima_crm_data` from DevTools → Application. |

The statuses available in the dropdown are defined in **`CLIENT_STATUSES`** in `mock-data.js`: On Track, Overdue, At Risk, Filed, Approved, RFE.

---

## Key Files

- `js/mock-data.js` — generates the snapshot (clients, tasks, etc.).
- `js/store.js` — `initStore`, `updateClient`, `resetDemoData`, `setDemoProfile`.
- `js/persona-switch.js` — handles CM ↔ Leadership switching.
- `index.html` — entry page; `index-entry.js` sets the profile on click.

---

## Notes

- There is no backend — everything is **mocked** in the browser.
- If something seems "stuck" after experimenting, use **Reset demo** or manually clear the `lima_crm_*` keys from localStorage.