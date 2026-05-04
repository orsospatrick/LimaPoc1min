/**
 * Lima demo dataset — 310 clients, 10 CMs, scaled LOR pipeline.
 * Deterministic procedural fill + showcase row (Aisha Patel).
 * GitHub Pages + file:// (no ES modules).
 */

const STAGES = [
  "Kickoff",
  "Membership/Profile",
  "Evidence Building",
  "LOR",
  "Press Strategy",
  "Quality Control",
  "Filing",
  "Post-Filing",
];

const STAGE_PERCENT = {
  Kickoff: 5,
  "Membership/Profile": 20,
  "Evidence Building": 50,
  LOR: 70,
  "Press Strategy": 80,
  "Quality Control": 88,
  Filing: 93,
  "Post-Filing": 100,
};

const CLIENT_STATUSES = ["On Track", "Overdue", "At Risk", "Filed", "Approved", "RFE"];

const LOR_PIPELINE_STATUSES = [
  "Not Contacted",
  "Contacted",
  "Agreed",
  "Draft Sent",
  "Letter Received",
];

const LAWYERS = ["Rebecca Stein", "Mark Davidson", "Lisa Park", "Ahmed Khalil"];
const LOR_WRITERS = ["Noah Adams", "Emily Watson", "Self"];

const LEADERSHIP_USERS = [
  { id: "ld_01", name: "Elena Petrescu", title: "Director of Operations", role: "leadership" },
  { id: "ld_02", name: "Michael Brunner", title: "Head of Cases", role: "leadership" },
];

const FIRST_NAMES = [
  "Aisha", "Marcus", "Elena", "James", "Sofia", "Diego", "Yuki", "Hassan", "Olumide", "Liu",
  "Pedro", "Ingrid", "Amir", "Sven", "Kenji", "Priya", "David", "Emma", "Tom", "Rafael",
  "Nina", "Omar", "Fatima", "Chen", "Ananya", "Viktor", "Isabelle", "Kwame", "Mei", "Javier",
  "Hana", "Dmitri", "Zara", "Thiago", "Lin", "Raj", "Erik", "Youssef", "Giulia", "Min-jun",
  "Astrid", "Carlos", "Leila", "Henrik", "Akiko", "Ibrahim", "Nadia", "Seung", "Camila", "Lars",
  "Ade", "Kofi",
];

const LAST_NAMES = [
  "Patel", "Nakamura", "Volkov", "Okafor", "Andersson", "Silva", "Tanaka", "Hassan", "Kim", "Singh",
  "Rossi", "Mueller", "Okonkwo", "Zhang", "Garcia", "Nguyen", "Yilmaz", "Kowalski", "Fernandes", "Park",
  "Cohen", "Dubois", "Santos", "Ibrahim", "Lopez", "Wright", "Johansson", "Mensah", "Petrov", "Reyes",
  "Choi", "Bianchi", "Haddad", "Novak", "Costa", "Murphy", "Lindberg", "Osei", "Romano", "Khan",
  "Schmidt", "Alvarez", "Berg", "Diallo", "Yamamoto", "Popescu", "Torres", "Nielsen", "Quigley", "Westbrook",
];

const ORGS = [
  "MIT", "Stanford", "Northwind Labs", "Vertex Analytics", "Globex", "Acme Bio", "Stellar AI",
  "Blue River Capital", "Cascade Health", "Horizon Robotics", "Pacific Data Co.", "Summit Legal",
];

const CASE_MANAGERS = [
  { id: "cm_01", name: "Sarah Chen", email: "sarah.chen@lima.crm", role: "cm", avatarInitials: "SC", avatarBg: "#4f46e5", caseloadCount: 30, heatmapCount: 30 },
  { id: "cm_02", name: "Marcus Williams", email: "marcus.williams@lima.crm", role: "cm", avatarInitials: "MW", avatarBg: "#b91c1c", caseloadCount: 36, heatmapCount: 36 },
  { id: "cm_03", name: "Priya Patel", email: "priya.patel@lima.crm", role: "cm", avatarInitials: "PP", avatarBg: "#059669", caseloadCount: 28, heatmapCount: 28 },
  { id: "cm_04", name: "David Rodriguez", email: "david.rodriguez@lima.crm", role: "cm", avatarInitials: "DR", avatarBg: "#c2410c", caseloadCount: 34, heatmapCount: 34 },
  { id: "cm_05", name: "Emma Thompson", email: "emma.thompson@lima.crm", role: "cm", avatarInitials: "ET", avatarBg: "#d97706", caseloadCount: 32, heatmapCount: 32 },
  { id: "cm_06", name: "James O'Brien", email: "james.obrien@lima.crm", role: "cm", avatarInitials: "JO", avatarBg: "#0d9488", caseloadCount: 29, heatmapCount: 29 },
  { id: "cm_07", name: "Aisha Hassan", email: "aisha.hassan@lima.crm", role: "cm", avatarInitials: "AH", avatarBg: "#7c3aed", caseloadCount: 31, heatmapCount: 31 },
  { id: "cm_08", name: "Tom Nakamura", email: "tom.nakamura@lima.crm", role: "cm", avatarInitials: "TN", avatarBg: "#2563eb", caseloadCount: 27, heatmapCount: 27 },
  { id: "cm_09", name: "Sofia Andersson", email: "sofia.andersson@lima.crm", role: "cm", avatarInitials: "SA", avatarBg: "#db2777", caseloadCount: 33, heatmapCount: 33 },
  { id: "cm_10", name: "Rafael Costa", email: "rafael.costa@lima.crm", role: "cm", avatarInitials: "RC", avatarBg: "#ca8a04", caseloadCount: 30, heatmapCount: 30 },
];

function cmById(id) {
  for (var z = 0; z < CASE_MANAGERS.length; z++) {
    if (CASE_MANAGERS[z].id === id) return CASE_MANAGERS[z];
  }
  return CASE_MANAGERS[0];
}

function cmForIndex(idx) {
  if (idx <= 6) return cmById("cm_01");
  if (idx === 7) return cmById("cm_02");
  if (idx <= 31) return cmById("cm_01");
  if (idx <= 66) return cmById("cm_02");
  if (idx <= 94) return cmById("cm_03");
  if (idx <= 128) return cmById("cm_04");
  if (idx <= 160) return cmById("cm_05");
  if (idx <= 189) return cmById("cm_06");
  if (idx <= 220) return cmById("cm_07");
  if (idx <= 247) return cmById("cm_08");
  if (idx <= 280) return cmById("cm_09");
  return cmById("cm_10");
}

function clientIdFromIndex(i) {
  var s = String(i);
  if (i < 10) return "client_00" + s;
  if (i < 100) return "client_0" + s;
  return "client_" + s;
}

function isoDaysAgo(days) {
  var d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function isoAddDays(iso, delta) {
  var d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function stageIndexFor(stage) {
  return STAGES.indexOf(stage);
}

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function statusFromRoll(rng, cmId) {
  var r = Math.floor(rng() * 10000);
  var overload = cmId === "cm_02" || cmId === "cm_04";
  var under = cmId === "cm_03" || cmId === "cm_08";
  if (overload) {
    if (r < 5200) return "On Track";
    if (r < 7000) return "At Risk";
    if (r < 8200) return "Overdue";
    if (r < 8800) return "RFE";
    if (r < 9400) return "Filed";
    return "Approved";
  }
  if (under) {
    if (r < 8200) return "On Track";
    if (r < 8600) return "At Risk";
    if (r < 9000) return "Overdue";
    if (r < 9400) return "RFE";
    if (r < 9800) return "Filed";
    return "Approved";
  }
  if (r < 9000) return "On Track";
  if (r < 9250) return "At Risk";
  if (r < 9400) return "Overdue";
  if (r < 9700) return "RFE";
  if (r < 9900) return "Filed";
  return "Approved";
}

function stageFromRoll(rng) {
  var r = rng() * 100;
  if (r < 5) return "Kickoff";
  if (r < 20) return "Membership/Profile";
  if (r < 50) return "Evidence Building";
  if (r < 70) return "LOR";
  if (r < 80) return "Press Strategy";
  if (r < 88) return "Quality Control";
  if (r < 93) return "Filing";
  return "Post-Filing";
}

function visaFromRoll(rng) {
  var r = rng() * 100;
  if (r < 40) return "EB-1";
  if (r < 70) return "O-1";
  if (r < 90) return "EB-2 NIW";
  return "L-1";
}

var TASK_POOL = {
  Kickoff: [
    "Schedule intake call — due Mon",
    "OVERDUE: Complete intake questionnaire — 4d",
    "Send welcome packet — due Wed",
  ],
  "Membership/Profile": [
    "Submit work history form — overdue 3d",
    "Provide CV with publications — due Thu",
    "BLOCKED: waiting on employer letter (6d)",
    "Upload degree transcripts — due in 2d",
  ],
  "Evidence Building": [
    "Upload tax returns 2023 — due tomorrow",
    "BLOCKED: waiting on client salary docs (8d)",
    "Review evidence package — due Fri",
    "OVERDUE: Upload citation index — 2d",
    "Compile award certificates — due next week",
  ],
  LOR: [
    "Draft Dr. Smith letter — due in 4d",
    "OVERDUE: Follow up — Prof. Chen response (5d)",
    "Send draft to recommender — due Wed",
    "BLOCKED: recommender travel — ping next week",
    "LOR draft due in 2 days",
  ],
  "Press Strategy": [
    "Pitch TechCrunch — due Mon",
    "Review article draft from writer — due 2d",
    "OVERDUE: approve quote for publication — 3d",
  ],
  "Quality Control": [
    "Attorney review pending — assigned 3d ago",
    "Resolve formatting issues — due Fri",
  ],
  Filing: [
    "Final petition package due to USCIS Friday",
    "OVERDUE: pay filing fees receipt — 1d",
  ],
  "Post-Filing": [
    "RFE response — 87 days remaining",
    "Track receipt notice — due any day",
    "OVERDUE: upload RFE exhibit scans — 6d",
  ],
};

function nextTaskForClient(stage, status, rng) {
  var pool = TASK_POOL[stage] || TASK_POOL["Evidence Building"];
  var t = pick(rng, pool);
  if (status === "Overdue" || status === "At Risk") {
    if (rng() < 0.45 && t.indexOf("OVERDUE:") !== 0 && t.indexOf("BLOCKED:") !== 0) return "OVERDUE: " + t;
    if (rng() < 0.25 && t.indexOf("BLOCKED:") !== 0) return "BLOCKED: " + t.replace(/^OVERDUE:\s*/, "");
  }
  return t;
}

function buildProceduralClient(idx, cm, rng) {
  var visa = visaFromRoll(rng);
  var stage = stageFromRoll(rng);
  var status = statusFromRoll(rng, cm.id);
  var fn = pick(rng, FIRST_NAMES);
  var ln = pick(rng, LAST_NAMES);
  if (fn === "Aisha" && ln === "Patel") ln = "Patil";
  var daysActive = 40 + Math.floor(rng() * 320);
  var daysInStage = 5 + Math.floor(rng() * 80);
  var kickoff = isoDaysAgo(daysActive);
  var nextTitle = nextTaskForClient(stage, status, rng);
  var dueIn = Math.floor(rng() * 14) - 4;
  var nextDue = isoAddDays(isoDaysAgo(0), dueIn);
  var flags = [];
  if (rng() < 0.02 && status === "On Track") flags.push("no_recent_activity");
  if (rng() < 0.015 && stage === "Evidence Building") flags.push("stuck_evidence");
  var pct = 12 + Math.floor(rng() * 78);
  return {
    id: clientIdFromIndex(idx),
    firstName: fn,
    lastName: ln,
    email: (fn + "." + ln).toLowerCase().replace(/[^a-z]/g, "") + "@demo.client",
    visaCategory: visa,
    assignedCmId: cm.id,
    cmId: cm.id,
    cmName: cm.name,
    assignedLawyerName: pick(rng, LAWYERS),
    kickoffDate: kickoff,
    stage: stage,
    stageIndex: stageIndexFor(stage),
    status: status,
    percentComplete: pct,
    nextTaskDue: nextDue,
    nextTaskTitle: nextTitle,
    nextTask: nextTitle + " — due " + nextDue,
    daysActive: daysActive,
    daysInCurrentStage: daysInStage,
    attentionFlags: flags,
    atRisk: status === "At Risk",
    overdue: status === "Overdue",
    _rngSeed: idx,
  };
}

function sarahAtRiskNames(idx) {
  var names = [
    { fn: "Quentin", ln: "Quigley" },
    { fn: "Rachel", ln: "Richardson" },
    { fn: "Sam", ln: "Sinclair" },
    { fn: "Tara", ln: "Torres" },
  ];
  return names[(idx - 8) % names.length];
}

function applySarahRiskRow(client, idx) {
  if (client.cmId !== "cm_01" || idx < 8 || idx > 31) return client;
  var arIdx = idx - 8;
  if (arIdx < 4) {
    var pair = sarahAtRiskNames(idx);
    client.firstName = pair.fn;
    client.lastName = pair.ln;
    client.email = (pair.fn + "." + pair.ln).toLowerCase().replace(/[^a-z]/g, "") + "@demo.client";
    client.stage = arIdx < 2 ? "Evidence Building" : "LOR";
    client.stageIndex = stageIndexFor(client.stage);
    var rng = mulberry32(910000 + idx * 17);
    if (arIdx === 1) {
      client.status = "Overdue";
      client.overdue = true;
      client.atRisk = false;
      client.attentionFlags = ["overdue_tasks", "no_recent_activity"];
      client.nextTaskTitle = "OVERDUE: Follow up on recommender replies — chase Prof. Chen today";
      client.nextTaskDue = isoAddDays(isoDaysAgo(0), -1);
      client.nextTask = client.nextTaskTitle + " — due " + client.nextTaskDue;
      return client;
    }
    client.status = "At Risk";
    client.atRisk = true;
    client.overdue = false;
    client.attentionFlags = arIdx % 2 === 0 ? ["stuck_evidence"] : ["overdue_tasks"];
    client.nextTaskTitle = nextTaskForClient(client.stage, "At Risk", rng);
    client.nextTaskDue = isoAddDays(isoDaysAgo(0), Math.floor(rng() * 5) - 2);
    client.nextTask = client.nextTaskTitle + " — due " + client.nextTaskDue;
    return client;
  }
  if (client.status === "At Risk" || client.status === "Overdue") {
    client.status = "On Track";
    client.atRisk = false;
    client.overdue = false;
  }
  client.attentionFlags = [];
  return client;
}

function postBoostMarcusAtRisk(clients) {
  var counts = {};
  CASE_MANAGERS.forEach(function (cm) {
    counts[cm.id] = clients.filter(function (c) { return c.cmId === cm.id && c.status === "At Risk"; }).length;
  });
  var target = counts["cm_04"] + 3;
  if (counts["cm_02"] >= target) return;
  var pool = clients.filter(function (c) {
    return c.cmId === "cm_02" && c.status === "On Track";
  });
  var i = 0;
  while (counts["cm_02"] < target && i < pool.length) {
    pool[i].status = "At Risk";
    pool[i].atRisk = true;
    if (!pool[i].attentionFlags.length) pool[i].attentionFlags = ["overdue_tasks"];
    counts["cm_02"]++;
    i++;
  }
}

function ensureMarcusShowcaseOverdueOnlyYuki(clients) {
  clients.forEach(function (c) {
    if (c.cmId !== "cm_02" || c.status !== "Overdue" || c.id === "client_007") return;
    c.status = "At Risk";
    c.atRisk = true;
    c.overdue = false;
    if (!c.attentionFlags || !c.attentionFlags.length) c.attentionFlags = ["lor_overdue"];
  });
}

function generateMockData() {
  var today = new Date().toISOString().slice(0, 10);
  var clients = [];
  var i;
  for (i = 1; i <= 310; i++) {
    var cm = cmForIndex(i);
    var rng = mulberry32(i * 100003 + 777);
    if (i === 1) {
      clients.push({
        id: "client_001",
        firstName: "Aisha",
        lastName: "Patel",
        email: "aisha.patel@demo.client",
        visaCategory: "EB-1",
        assignedCmId: "cm_01",
        cmId: "cm_01",
        cmName: "Sarah Chen",
        assignedLawyerName: "Rebecca Stein",
        kickoffDate: isoDaysAgo(145),
        stage: "Evidence Building",
        stageIndex: stageIndexFor("Evidence Building"),
        status: "At Risk",
        percentComplete: 38,
        nextTaskDue: isoDaysAgo(12),
        nextTaskTitle: "BLOCKED: waiting on client docs (12d)",
        nextTask: "BLOCKED: waiting on client docs (12d) — due " + isoDaysAgo(12),
        daysActive: 145,
        daysInCurrentStage: 67,
        attentionFlags: ["stuck_evidence", "no_recent_activity"],
        atRisk: true,
        overdue: false,
      });
      continue;
    }
    if (i === 7) {
      clients.push({
        id: "client_007",
        firstName: "Yuki",
        lastName: "Tanaka",
        email: "yuki.tanaka@demo.client",
        visaCategory: "O-1",
        assignedCmId: "cm_02",
        cmId: "cm_02",
        cmName: "Marcus Williams",
        assignedLawyerName: "Mark Davidson",
        kickoffDate: isoDaysAgo(180),
        stage: "LOR",
        stageIndex: stageIndexFor("LOR"),
        status: "Overdue",
        percentComplete: 52,
        nextTaskDue: isoDaysAgo(8),
        nextTaskTitle: "OVERDUE: Follow up — Prof. Chen response (8d)",
        nextTask: "OVERDUE: Follow up — Prof. Chen response (8d) — due " + isoDaysAgo(8),
        daysActive: 180,
        daysInCurrentStage: 48,
        attentionFlags: ["lor_overdue", "no_recent_activity"],
        atRisk: false,
        overdue: true,
      });
      continue;
    }
    if (i >= 2 && i <= 6) {
      var specs = [
        null,
        {
          id: "client_002",
          fn: "Marcus",
          ln: "Nakamura",
          visa: "O-1",
          stage: "LOR",
          status: "On Track",
          days: 95,
          pct: 58,
          law: "Lisa Park",
          flags: [],
        },
        {
          id: "client_003",
          fn: "Elena",
          ln: "Volkov",
          visa: "EB-2 NIW",
          stage: "Membership/Profile",
          status: "At Risk",
          days: 210,
          pct: 22,
          law: "Ahmed Khalil",
          flags: ["stuck_membership", "overdue_tasks"],
        },
        {
          id: "client_004",
          fn: "James",
          ln: "Okafor",
          visa: "EB-1",
          stage: "Press Strategy",
          status: "On Track",
          days: 88,
          pct: 72,
          law: "Mark Davidson",
          flags: [],
        },
        {
          id: "client_005",
          fn: "Sofia",
          ln: "Andersson",
          visa: "L-1",
          stage: "Filing",
          status: "On Track",
          days: 45,
          pct: 90,
          law: "Rebecca Stein",
          flags: [],
        },
        {
          id: "client_006",
          fn: "Diego",
          ln: "Silva",
          visa: "O-1",
          stage: "Post-Filing",
          status: "Approved",
          days: 400,
          pct: 100,
          law: "Lisa Park",
          flags: [],
        },
      ];
      var sp = specs[i - 1];
      var kd = isoDaysAgo(sp.days);
      var r2 = mulberry32(i * 999 + 1);
      var nt = nextTaskForClient(sp.stage, sp.status, r2);
      var nd = isoAddDays(today, Math.floor(r2() * 10) - 2);
      clients.push({
        id: sp.id,
        firstName: sp.fn,
        lastName: sp.ln,
        email: (sp.fn + "." + sp.ln).toLowerCase().replace(/[^a-z]/g, "") + "@demo.client",
        visaCategory: sp.visa,
        assignedCmId: "cm_01",
        cmId: "cm_01",
        cmName: "Sarah Chen",
        assignedLawyerName: sp.law,
        kickoffDate: kd,
        stage: sp.stage,
        stageIndex: stageIndexFor(sp.stage),
        status: sp.status,
        percentComplete: sp.pct,
        nextTaskDue: nd,
        nextTaskTitle: nt,
        nextTask: nt + " — due " + nd,
        daysActive: sp.days,
        daysInCurrentStage: 18 + i * 3,
        attentionFlags: sp.flags.slice(),
        atRisk: sp.status === "At Risk",
        overdue: sp.status === "Overdue",
      });
      continue;
    }
    var c = buildProceduralClient(i, cm, rng);
    c = applySarahRiskRow(c, i);
    clients.push(c);
  }

  postBoostMarcusAtRisk(clients);
  ensureMarcusShowcaseOverdueOnlyYuki(clients);

  var criteria = [];
  var documents = [];
  var messages = [];
  var tasks = [];
  var critN = 0;
  var docN = 0;
  var msgN = 0;
  var taskN = 0;

  var critLabels = [
    "Original Contributions",
    "Authorship of Scholarly Articles",
    "Critical Role at Distinguished Organization",
    "High Salary",
  ];

  clients.forEach(function (c, ci) {
    var rngc = mulberry32(ci * 500009 + 13);
    var clientCritIds = [];
    var nCrit = /^client_00[1-7]$/.test(c.id) ? 4 : 2;
    var j;
    for (j = 0; j < nCrit; j++) {
      critN += 1;
      var cid = "crit_" + critN;
      clientCritIds.push(cid);
      var st = "In Progress";
      var note = "";
      if (c.id === "client_001" && j === 3) {
        st = "Revision Needed";
        note = "Salary verification documents incomplete — need 2023 W-2";
      } else if (j === 0) st = rngc() < 0.35 ? "Approved" : "In Progress";
      else if (j === 1) st = "In Progress";
      else st = rngc() < 0.5 ? "Not Started" : "Under Review";
      criteria.push({
        id: cid,
        clientId: c.id,
        name: critLabels[j % critLabels.length],
        label: critLabels[j % critLabels.length],
        visaCategory: c.visaCategory,
        instructionText: "Primary evidence.",
        status: st,
        cmNotes: note,
        documentCount: j,
      });
    }

    var ndocs = c.id === "client_001" || c.id === "client_007" ? 2 : 1;
    for (var d = 0; d < ndocs; d++) {
      docN += 1;
      documents.push({
        id: "doc_" + docN,
        clientId: c.id,
        criterionId: d === 0 ? clientCritIds[0] : null,
        fileName: "Exhibit_" + c.id + "_" + d + ".pdf",
        name: "Exhibit_" + d + ".pdf",
        fileType: "pdf",
        fileSize: 180000 + Math.floor(rngc() * 80000),
        version: 1,
        uploadedById: c.cmId,
        uploadedAt: isoDaysAgo(5 + d + (ci % 7)),
        stage: c.stage,
      });
    }

    if (c.id === "client_001") {
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: "cm_01",
        senderName: "Sarah Chen",
        content: "Following up on the evidence checklist — please confirm when you can upload the W-2.",
        author: "Sarah Chen",
        body: "Following up on the evidence checklist — please confirm when you can upload the W-2.",
        createdAt: isoDaysAgo(10),
        isPinned: false,
      });
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: c.id,
        senderName: "Aisha Patel",
        content: "Thanks — I will send the salary documents this week.",
        author: "Aisha Patel",
        body: "Thanks — I will send the salary documents this week.",
        createdAt: isoDaysAgo(18),
        isPinned: true,
      });
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: "cm_01",
        senderName: "Sarah Chen",
        content: "Gentle nudge on the open items — we're blocked on tax and payroll proof for High Salary.",
        author: "Sarah Chen",
        body: "Gentle nudge on the open items — we're blocked on tax and payroll proof for High Salary.",
        createdAt: isoDaysAgo(4),
        isPinned: false,
      });
    } else if (c.id === "client_007") {
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: "cm_02",
        senderName: "Marcus Williams",
        content: "Prof. Chen still has not returned the draft — escalating this week.",
        author: "Marcus Williams",
        body: "Prof. Chen still has not returned the draft — escalating this week.",
        createdAt: isoDaysAgo(3),
        isPinned: true,
      });
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: c.id,
        senderName: "Yuki Tanaka",
        content: "I pinged Prof. Chen again; waiting on his availability.",
        author: "Yuki Tanaka",
        body: "I pinged Prof. Chen again; waiting on his availability.",
        createdAt: isoDaysAgo(11),
        isPinned: false,
      });
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: "cm_02",
        senderName: "Marcus Williams",
        content: "We are now 8+ days past the agreed LOR deadline — please nudge or nominate a backup recommender.",
        author: "Marcus Williams",
        body: "We are now 8+ days past the agreed LOR deadline — please nudge or nominate a backup recommender.",
        createdAt: isoDaysAgo(1),
        isPinned: false,
      });
    } else {
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: c.cmId,
        senderName: c.cmName,
        content: "Hi " + c.firstName + " — next milestone is " + c.stage + ".",
        author: c.cmName,
        body: "Hi " + c.firstName + " — next milestone is " + c.stage + ".",
        createdAt: isoDaysAgo(2 + (ci % 5)),
        isPinned: ci % 17 === 0,
      });
      msgN += 1;
      messages.push({
        id: "msg_" + msgN,
        clientId: c.id,
        senderId: c.id,
        senderName: c.firstName + " " + c.lastName,
        content: "Uploaded documents to the portal.",
        author: c.firstName + " " + c.lastName,
        body: "Uploaded documents to the portal.",
        createdAt: isoDaysAgo(1 + (ci % 4)),
        isPinned: false,
      });
    }

    var taskSpecs = [];
    if (c.id === "client_001") {
      taskSpecs.push({
        title: "Upload publication list — due 5 days ago",
        due: isoDaysAgo(5),
        pri: "High",
        st: "In Progress",
        done: false,
      });
      taskSpecs.push({
        title: "Schedule LOR strategy call — due 12 days ago",
        due: isoDaysAgo(12),
        pri: "High",
        st: "In Progress",
        done: false,
      });
      taskSpecs.push({
        title: "BLOCKED: waiting on client docs (12d)",
        due: isoDaysAgo(20),
        pri: "High",
        st: "In Progress",
        done: false,
      });
    } else if (c.id === "client_007") {
      taskSpecs.push({
        title: "OVERDUE: Follow up — Prof. Chen response (8d)",
        due: isoDaysAgo(8),
        pri: "High",
        st: "In Progress",
        done: false,
      });
      taskSpecs.push({
        title: "Send backup recommender shortlist to client",
        due: isoDaysAgo(2),
        pri: "Medium",
        st: "In Progress",
        done: false,
      });
    } else {
      var ntsk = 2 + (ci % 2);
      var t;
      for (t = 0; t < ntsk; t++) {
        taskSpecs.push({
          title: nextTaskForClient(c.stage, c.status, rngc),
          due: isoAddDays(today, Math.floor(rngc() * 16) - 3 - t * 2),
          pri: t === 0 ? "High" : "Medium",
          st: rngc() < 0.15 && t === ntsk - 1 ? "Complete" : "In Progress",
          done: rngc() < 0.15 && t === ntsk - 1,
        });
      }
    }

    taskSpecs.forEach(function (ts) {
      taskN += 1;
      tasks.push({
        id: "task_" + taskN,
        clientId: c.id,
        title: ts.title,
        assignedToId: c.cmId,
        dueDate: ts.due,
        priority: ts.pri,
        status: ts.st,
        createdAt: isoDaysAgo(20),
        completedAt: ts.done ? isoDaysAgo(2) : null,
        completed: ts.done,
      });
    });
  });

  clients.forEach(function (c) {
    if (c.id === "client_001" || c.id === "client_007") return;
    var open = tasks
      .filter(function (t) {
        return t.clientId === c.id && t.status !== "Complete";
      })
      .sort(function (a, b) {
        return a.dueDate.localeCompare(b.dueDate);
      });
    var nt = open[0];
    if (nt) {
      c.nextTaskTitle = nt.title;
      c.nextTaskDue = nt.dueDate;
      c.nextTask = nt.title + " — due " + nt.dueDate;
    }
  });

  var lorClients = clients.filter(function (c) { return c.stage === "LOR"; });
  var lorTarget = 90;
  var statusCycle = [];
  var sc;
  for (sc = 0; sc < 14; sc++) statusCycle.push("Not Contacted");
  for (sc = 0; sc < 23; sc++) statusCycle.push("Contacted");
  for (sc = 0; sc < 18; sc++) statusCycle.push("Agreed");
  for (sc = 0; sc < 22; sc++) statusCycle.push("Draft Sent");
  for (sc = 0; sc < 13; sc++) statusCycle.push("Letter Received");
  while (statusCycle.length < lorTarget) statusCycle.push(pick(mulberry32(statusCycle.length + 99), LOR_PIPELINE_STATUSES));
  statusCycle = statusCycle.slice(0, lorTarget);

  function lorIdFromIndex(n) {
    var s = String(n);
    if (n < 10) return "lor_00" + s;
    if (n < 100) return "lor_0" + s;
    return "lor_" + s;
  }

  var lors = [];
  var lc;
  for (lc = 0; lc < lorTarget; lc++) {
    var cl = lorClients[lc % lorClients.length];
    var rlor = mulberry32(lc * 9001 + 42);
    var stL = statusCycle[lc];
    var overdueDays = 0;
    if (lc < 13) overdueDays = 1 + (lc % 9);
    if (stL === "Letter Received" && overdueDays > 0) overdueDays = 0;
    var dline = overdueDays > 0 ? isoDaysAgo(overdueDays) : isoAddDays(today, Math.floor(rlor() * 20) - 4);
    var recFn = pick(rlor, FIRST_NAMES);
    var recLn = pick(rlor, LAST_NAMES);
    var org = pick(rlor, ORGS);
    var titlePick = pick(rlor, ["Professor", "VP Engineering", "Director", "Chief Scientist", "Managing Partner"]);
    lors.push({
      id: lorIdFromIndex(lc + 1),
      clientId: cl.id,
      clientName: cl.firstName + " " + cl.lastName,
      beneficiary: cl.firstName + " " + cl.lastName,
      recommenderName: "Dr. " + recFn + " " + recLn,
      recommenderTitle: titlePick,
      recommenderOrganization: org,
      author: "Dr. " + recFn + " " + recLn + ", " + org,
      status: stL,
      assignedWriter: pick(rlor, LOR_WRITERS),
      deadline: dline,
      daysOverdue: overdueDays,
      cmId: cl.cmId,
      cmName: cl.cmName,
      visaCategory: cl.visaCategory,
      dueDate: dline,
      overdue: overdueDays > 0,
    });
  }

  return {
    version: 4,
    caseManagers: CASE_MANAGERS,
    leadership: LEADERSHIP_USERS,
    clients: clients,
    tasks: tasks,
    criteria: criteria,
    documents: documents,
    messages: messages,
    lors: lors,
  };
}

window.LimaMock = {
  STAGES: STAGES,
  STAGE_PERCENT: STAGE_PERCENT,
  CLIENT_STATUSES: CLIENT_STATUSES,
  LOR_PIPELINE_STATUSES: LOR_PIPELINE_STATUSES,
  LAWYERS: LAWYERS,
  LOR_WRITERS: LOR_WRITERS,
  LEADERSHIP_USERS: LEADERSHIP_USERS,
  generateMockData: generateMockData,
};
