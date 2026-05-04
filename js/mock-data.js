/**
 * Small static demo dataset — fast load, fits localStorage, happy path A→B.
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
  "Membership/Profile": 15,
  "Evidence Building": 40,
  LOR: 60,
  "Press Strategy": 70,
  "Quality Control": 85,
  Filing: 95,
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

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function isoAddDays(iso, delta) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function stageIndexFor(stage) {
  return STAGES.indexOf(stage);
}

function generateMockData() {
  const today = new Date().toISOString().slice(0, 10);

  const caseManagers = [
    {
      id: "cm_01",
      name: "Sarah Chen",
      email: "sarah.chen@lima.crm",
      role: "cm",
      avatarInitials: "SC",
      avatarBg: "#4f46e5",
      heatmapCount: 6,
      caseloadCount: 6,
    },
  ];

  const clientSpecs = [
    {
      id: "client_001",
      firstName: "Aisha",
      lastName: "Patel",
      visa: "EB-1",
      stage: "Evidence Building",
      status: "At Risk",
      daysActive: 120,
      kickoffDaysAgo: 120,
      pct: 42,
      lawyer: "Rebecca Stein",
      flags: ["no_recent_activity"],
    },
    {
      id: "client_002",
      firstName: "Marcus",
      lastName: "Nakamura",
      visa: "O-1",
      stage: "LOR",
      status: "On Track",
      daysActive: 95,
      kickoffDaysAgo: 95,
      pct: 58,
      lawyer: "Lisa Park",
      flags: [],
    },
    {
      id: "client_003",
      firstName: "Elena",
      lastName: "Volkov",
      visa: "EB-2 NIW",
      stage: "Membership/Profile",
      status: "Overdue",
      daysActive: 210,
      kickoffDaysAgo: 210,
      pct: 18,
      lawyer: "Ahmed Khalil",
      flags: ["stuck_membership", "overdue_tasks"],
    },
    {
      id: "client_004",
      firstName: "James",
      lastName: "Okafor",
      visa: "EB-1",
      stage: "Press Strategy",
      status: "On Track",
      daysActive: 88,
      kickoffDaysAgo: 88,
      pct: 72,
      lawyer: "Mark Davidson",
      flags: [],
    },
    {
      id: "client_005",
      firstName: "Sofia",
      lastName: "Andersson",
      visa: "L-1",
      stage: "Filing",
      status: "On Track",
      daysActive: 45,
      kickoffDaysAgo: 45,
      pct: 90,
      lawyer: "Rebecca Stein",
      flags: [],
    },
    {
      id: "client_006",
      firstName: "Diego",
      lastName: "Silva",
      visa: "O-1",
      stage: "Post-Filing",
      status: "Approved",
      daysActive: 400,
      kickoffDaysAgo: 400,
      pct: 100,
      lawyer: "Lisa Park",
      flags: [],
    },
  ];

  const clients = clientSpecs.map(function (s) {
    const kickoffDate = isoDaysAgo(s.kickoffDaysAgo);
    return {
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.firstName.toLowerCase() + "." + s.lastName.toLowerCase() + "@demo.client",
      visaCategory: s.visa,
      assignedCmId: "cm_01",
      cmId: "cm_01",
      cmName: "Sarah Chen",
      assignedLawyerName: s.lawyer,
      kickoffDate: kickoffDate,
      stage: s.stage,
      stageIndex: stageIndexFor(s.stage),
      status: s.status,
      percentComplete: s.pct,
      nextTaskDue: isoAddDays(today, 5),
      nextTaskTitle: "Upload updated CV and publication list",
      nextTask: "",
      daysActive: s.daysActive,
      daysInCurrentStage: 22,
      attentionFlags: s.flags,
      atRisk: s.status === "At Risk",
      overdue: s.status === "Overdue",
    };
  });

  const criteriaLabels = [
    "Original Contributions",
    "Authorship of Scholarly Articles",
    "Critical Role at Distinguished Organization",
    "High Salary",
  ];

  const criteria = [];
  const documents = [];
  const messages = [];
  const tasks = [];
  let critN = 0;
  let docN = 0;
  let msgN = 0;
  let taskN = 0;

  clients.forEach(function (c, ci) {
    var clientCritIds = [];
    criteriaLabels.forEach(function (label, j) {
      critN += 1;
      var cid = "crit_" + critN;
      clientCritIds.push(cid);
      var st = j === 0 ? "Approved" : j === 1 ? "In Progress" : j === 2 ? "Not Started" : "Under Review";
      criteria.push({
        id: cid,
        clientId: c.id,
        name: label,
        label: label,
        visaCategory: c.visaCategory,
        instructionText: "Provide primary evidence for " + label + " under " + c.visaCategory + ".",
        status: st,
        cmNotes: j === 1 ? "Waiting on client upload." : "",
        documentCount: j,
      });
    });

    for (var d = 0; d < 2; d++) {
      docN += 1;
      documents.push({
        id: "doc_" + docN,
        clientId: c.id,
        criterionId: d === 0 ? clientCritIds[0] : null,
        fileName: "Exhibit_" + c.id + "_" + d + ".pdf",
        name: "Exhibit_" + d + ".pdf",
        fileType: "pdf",
        fileSize: 240000,
        version: 1,
        uploadedById: "cm_01",
        uploadedAt: isoDaysAgo(3 + d + ci),
        stage: c.stage,
      });
    }

    messages.push({
      id: "msg_" + ++msgN,
      clientId: c.id,
      senderId: "cm_01",
      senderName: "Sarah Chen",
      content: "Hi " + c.firstName + " — next milestone is " + c.stage + ". Ping me if blocked.",
      author: "Sarah Chen",
      body: "Hi " + c.firstName + " — next milestone is " + c.stage + ". Ping me if blocked.",
      createdAt: isoDaysAgo(2),
      isPinned: ci === 0,
    });
    messages.push({
      id: "msg_" + ++msgN,
      clientId: c.id,
      senderId: c.id,
      senderName: c.firstName + " " + c.lastName,
      content: "Uploaded new documents to the portal.",
      author: c.firstName + " " + c.lastName,
      body: "Uploaded new documents to the portal.",
      createdAt: isoDaysAgo(1),
      isPinned: false,
    });

    var taskTitles = [
      "Schedule strategy call",
      "Upload tax returns 2023",
      "Review evidence index",
    ];
    taskTitles.forEach(function (title, ti) {
      taskN += 1;
      var due = isoAddDays(today, ti === 0 ? -2 : 7 + ti);
      tasks.push({
        id: "task_" + taskN,
        clientId: c.id,
        title: title,
        assignedToId: "cm_01",
        dueDate: due,
        priority: ti === 0 ? "High" : "Medium",
        status: ti === 2 ? "Complete" : "In Progress",
        createdAt: isoDaysAgo(10),
        completedAt: ti === 2 ? isoDaysAgo(1) : null,
        completed: ti === 2,
      });
    });
  });

  clients.forEach(function (c) {
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
    } else {
      c.nextTask = c.nextTaskTitle + " — due " + c.nextTaskDue;
    }
  });

  const lors = [
    {
      id: "lor_001",
      clientId: "client_002",
      clientName: "Marcus Nakamura",
      beneficiary: "Marcus Nakamura",
      recommenderName: "Dr. Jane Smith",
      recommenderTitle: "Professor",
      recommenderOrganization: "MIT",
      author: "Dr. Jane Smith, MIT",
      status: "Draft Sent",
      assignedWriter: "Emily Watson",
      deadline: isoAddDays(today, 4),
      daysOverdue: 0,
      cmId: "cm_01",
      cmName: "Sarah Chen",
      visaCategory: "O-1",
      dueDate: isoAddDays(today, 4),
      overdue: false,
    },
    {
      id: "lor_002",
      clientId: "client_001",
      clientName: "Aisha Patel",
      beneficiary: "Aisha Patel",
      recommenderName: "Prof. Robert Chen",
      recommenderTitle: "Department Chair",
      recommenderOrganization: "Stanford",
      author: "Prof. Robert Chen, Stanford",
      status: "Contacted",
      assignedWriter: "Noah Adams",
      deadline: isoAddDays(today, 10),
      daysOverdue: -3,
      cmId: "cm_01",
      cmName: "Sarah Chen",
      visaCategory: "EB-1",
      dueDate: isoAddDays(today, 10),
      overdue: false,
    },
    {
      id: "lor_003",
      clientId: "client_004",
      clientName: "James Okafor",
      beneficiary: "James Okafor",
      recommenderName: "CEO Maria Gonzalez",
      recommenderTitle: "CEO",
      recommenderOrganization: "Northwind Labs",
      author: "CEO Maria Gonzalez, Northwind Labs",
      status: "Agreed",
      assignedWriter: "Self",
      deadline: isoAddDays(today, -1),
      daysOverdue: 2,
      cmId: "cm_01",
      cmName: "Sarah Chen",
      visaCategory: "EB-1",
      dueDate: isoAddDays(today, -1),
      overdue: true,
    },
    {
      id: "lor_004",
      clientId: "client_005",
      clientName: "Sofia Andersson",
      beneficiary: "Sofia Andersson",
      recommenderName: "Dr. Alan Reeves",
      recommenderTitle: "Managing Director",
      recommenderOrganization: "Vertex Analytics",
      author: "Dr. Alan Reeves, Vertex Analytics",
      status: "Letter Received",
      assignedWriter: "Emily Watson",
      deadline: isoAddDays(today, -5),
      daysOverdue: 0,
      cmId: "cm_01",
      cmName: "Sarah Chen",
      visaCategory: "L-1",
      dueDate: isoAddDays(today, -5),
      overdue: false,
    },
  ];

  return {
    version: 3,
    caseManagers: caseManagers,
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
