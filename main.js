"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => WerusDashboard
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var VIEW_TYPE = "werus-dashboard";
var TODOIST_VIEW_TYPE = "werus-todoist";
var LS_ST_URL = "werus-dashboard:syncthingUrl";
var LS_ST_KEY = "werus-dashboard:syncthingApiKey";
var LS_ST_FOLDER = "werus-dashboard:syncthingFolderId";
var LS_TODO_CACHE = "werus-dashboard:todoistCache";
var TODO_TTL = 5 * 60 * 1e3;
var TODO_MAX_PAGES = 50;
var GAME_VIEW_TYPE = "werus-game";
var GAME_LOG_PATH = "20.Areas/Gamifica\xE7\xE3o.md";
var GAME_LOG_FENCE = "wd-game-log";
var HARVEST_BACKFILL_DAYS = 90;
var XP_BY_PRI = { 4: 8, 3: 5, 2: 3, 1: 1 };
function xpForPriority(p) {
  var _a;
  return (_a = XP_BY_PRI[p]) != null ? _a : 1;
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
var DEFAULT_SETTINGS = {
  sectionOrder: ["stats", "game", "todoist", "para", "sync", "heatmap", "growth", "calendar"],
  compact: false,
  hidden: [],
  noteView: "list",
  calendarSources: [
    { path: "40.Archive/Relat\xF3rios Claude", color: "#3B82F6", on: true },
    { path: "50.Di\xE1rio", color: "#10B981", on: true }
  ],
  todoistToken: "",
  todoistDayRange: 7,
  todoistFilters: { projects: [], labels: [] },
  todoistShowProject: true,
  todoistShowLabels: false,
  syncthingUrl: "http://127.0.0.1:8384",
  syncthingApiKey: "",
  syncthingFolderId: "",
  syncthingShowCounts: false,
  taskPackages: [],
  packageConfirm: "many",
  gamificationEnabled: true,
  gamePenaltyFactor: 1.5,
  gameLastHarvest: "",
  gameChartMode: "bars",
  growthChartMode: "bars"
};
var PARA = [
  { folder: "00.Inbox", icon: "\u{1F4E5}", label: "Inbox", accent: "#6366F1" },
  { folder: "10.Projects", icon: "\u{1F680}", label: "Projetos", accent: "#10B981" },
  { folder: "20.Areas", icon: "\u{1F3AF}", label: "\xC1reas", accent: "#F59E0B" },
  { folder: "30.Resources", icon: "\u{1F4DA}", label: "Recursos", accent: "#3B82F6" },
  { folder: "40.Archive", icon: "\u{1F5C4}\uFE0F", label: "Arquivo", accent: "#6B7280" }
];
var PARA_MAP = new Map(PARA.map((p) => [p.folder, p]));
var ACCENTS = ["#6366F1", "#10B981", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6", "#EF4444"];
var DAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "S\xE1b", "Dom"];
var MONTH_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
var IMG_EXT = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
var DAILY_FOLDER = "50.Di\xE1rio";
var DAILY_TEMPLATE = "Modelos/Nota Di\xE1ria.md";
var STATUS_ICON = {
  progress: "\u25B6",
  paused: "\u23F8",
  cancelled: "\u2715"
};
var SEC_CAL = "sec:calendar";
var SEC_PARA = "sec:para";
var SEC_HEAT = "sec:heatmap";
var SEC_GROW = "sec:growth";
var SEC_STAT = "sec:stats";
var SEC_TODO = "sec:todoist";
var SEC_SYNC = "sec:sync";
var SEC_GAME = "sec:game";
var SECTION_LABEL = {
  stats: "Estat\xEDsticas",
  todoist: "Tarefas",
  para: "Cofre (pastas)",
  sync: "Sincroniza\xE7\xE3o",
  heatmap: "Atividade do cofre",
  growth: "Crescimento do cofre",
  calendar: "Relat\xF3rios",
  game: "Gamifica\xE7\xE3o"
};
var TODOIST_PRI = {
  4: { label: "p1", color: "#EF4444" },
  3: { label: "p2", color: "#F59E0B" },
  2: { label: "p3", color: "#3B82F6" },
  1: { label: "p4", color: "#6B7280" }
};
function priMeta(p) {
  var _a;
  return (_a = TODOIST_PRI[p]) != null ? _a : TODOIST_PRI[1];
}
var TODOIST_COLORS = {
  berry_red: "#B8255F",
  red: "#DB4035",
  orange: "#FF9933",
  yellow: "#FAD000",
  olive_green: "#AFB83B",
  lime_green: "#7ECC49",
  green: "#299438",
  mint_green: "#6ACCBC",
  teal: "#158FAD",
  sky_blue: "#14AAF5",
  light_blue: "#96C3EB",
  blue: "#4073FF",
  grape: "#884DFF",
  violet: "#AF38EB",
  lavender: "#EB96EB",
  magenta: "#E05194",
  salmon: "#FF8D85",
  charcoal: "#808080",
  grey: "#B8B8B8",
  taupe: "#CCAC93"
};
var LABEL_FALLBACK = "#B8B8B8";
var LAUNCH_CONFIRM_MIN = 5;
var PKG_ICONS = [
  "sunrise",
  "sun",
  "sunset",
  "moon",
  "coffee",
  "utensils",
  "dumbbell",
  "book-open",
  "briefcase",
  "graduation-cap",
  "home",
  "shopping-cart",
  "heart",
  "droplet",
  "pill",
  "bed",
  "clock",
  "calendar",
  "check-check",
  "list-checks",
  "target",
  "flame",
  "zap",
  "star",
  "sparkles",
  "rocket",
  "brush",
  "music",
  "gamepad-2",
  "dog"
];
function splitTaskLabels(line, pkgLabels = []) {
  const inline = [];
  let priority = 1;
  const stripped = line.replace(/(?<=^|\s)@([\p{L}\p{N}_]+)/gu, (_m, name) => {
    inline.push(name);
    return "";
  }).replace(/(?<=^|\s)p([1-4])(?=\s|$)/gi, (_m, d) => {
    priority = 5 - Number(d);
    return "";
  }).replace(/\s{2,}/g, " ").trim();
  const title = stripped || line.trim();
  const labels = [.../* @__PURE__ */ new Set([...pkgLabels, ...inline])];
  return { title, labels, priority };
}
function clickable(el, handler) {
  el.onclick = handler;
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
  return el;
}
function openPopover(anchor, fill, opts = {}) {
  var _a;
  document.querySelectorAll(".wd-pop").forEach((e) => e.remove());
  const pop = ((_a = opts.container) != null ? _a : document.body).createDiv({ cls: "wd-pop" + (opts.cls ? " " + opts.cls : "") });
  if (opts.width) pop.style.width = `${opts.width}px`;
  const onDoc = (e) => {
    const t = e.target;
    if (!pop.contains(t) && t !== anchor && !anchor.contains(t)) close();
  };
  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  function close() {
    var _a2;
    (_a2 = opts.onClose) == null ? void 0 : _a2.call(opts);
    pop.remove();
    document.removeEventListener("mousedown", onDoc, true);
    document.removeEventListener("keydown", onKey, true);
  }
  fill(pop, close);
  const r = anchor.getBoundingClientRect();
  pop.style.top = `${r.bottom + 4}px`;
  pop.style.left = `${r.left}px`;
  requestAnimationFrame(() => {
    const pr = pop.getBoundingClientRect();
    if (pr.right > window.innerWidth - 8) pop.style.left = `${Math.max(8, window.innerWidth - pr.width - 8)}px`;
    if (pr.bottom > window.innerHeight - 8) pop.style.top = `${Math.max(8, r.top - pr.height - 4)}px`;
  });
  setTimeout(() => {
    document.addEventListener("mousedown", onDoc, true);
    document.addEventListener("keydown", onKey, true);
  }, 0);
  return close;
}
function openIconPopover(anchor, current, onPick) {
  openPopover(anchor, (pop, close) => {
    const none = pop.createSpan({ cls: "wd-pkg-iconopt wd-pkg-iconnone" + (!current ? " wd-on" : ""), text: "\u2014" });
    none.setAttr("title", "Sem \xEDcone");
    clickable(none, () => {
      onPick(void 0);
      close();
    });
    for (const ic of PKG_ICONS) {
      const opt = pop.createSpan({ cls: "wd-pkg-iconopt" + (current === ic ? " wd-on" : "") });
      renderIcon(opt, ic);
      opt.setAttr("title", ic);
      clickable(opt, () => {
        onPick(ic);
        close();
      });
    }
  }, { cls: "wd-icon-pop" });
}
async function fetchTodoistTasks(token) {
  var _a, _b;
  const all = [];
  let cursor = null;
  let pages = 0;
  do {
    const url = new URL("https://api.todoist.com/api/v1/tasks");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await (0, import_obsidian.requestUrl)({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false
    });
    if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = res.json;
    if (Array.isArray(data)) {
      all.push(...data);
      cursor = null;
    } else {
      all.push(...(_a = data.results) != null ? _a : []);
      cursor = (_b = data.next_cursor) != null ? _b : null;
    }
  } while (cursor && ++pages < TODO_MAX_PAGES);
  return all;
}
async function fetchTodoistProjects(token) {
  var _a, _b;
  const all = [];
  let cursor = null;
  let pages = 0;
  do {
    const url = new URL("https://api.todoist.com/api/v1/projects");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await (0, import_obsidian.requestUrl)({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = res.json;
    if (Array.isArray(data)) {
      all.push(...data);
      cursor = null;
    } else {
      all.push(...(_a = data.results) != null ? _a : []);
      cursor = (_b = data.next_cursor) != null ? _b : null;
    }
  } while (cursor && ++pages < TODO_MAX_PAGES);
  return all;
}
async function fetchTodoistLabels(token) {
  var _a, _b;
  const all = [];
  let cursor = null;
  let pages = 0;
  do {
    const url = new URL("https://api.todoist.com/api/v1/labels");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await (0, import_obsidian.requestUrl)({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = res.json;
    if (Array.isArray(data)) {
      all.push(...data);
      cursor = null;
    } else {
      all.push(...(_a = data.results) != null ? _a : []);
      cursor = (_b = data.next_cursor) != null ? _b : null;
    }
  } while (cursor && ++pages < TODO_MAX_PAGES);
  return all;
}
function humanBytes(n) {
  if (!n) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / 1048576).toFixed(n < 10485760 ? 1 : 0)} MB`;
}
function relTime(iso) {
  const t = Date.parse(iso);
  if (isNaN(t) || t < 1) return "\u2014";
  const s = Math.floor((Date.now() - t) / 1e3);
  if (s < 60) return "agora";
  if (s < 3600) return `h\xE1 ${Math.floor(s / 60)} min`;
  if (s < 86400) return `h\xE1 ${Math.floor(s / 3600)} h`;
  return `h\xE1 ${Math.floor(s / 86400)} d`;
}
async function stGet(base, key, path) {
  const url = base.replace(/\/+$/, "") + path;
  const res = await (0, import_obsidian.requestUrl)({ url, method: "GET", headers: { "X-API-Key": key }, throw: false });
  if (res.status === 401 || res.status === 403) throw new Error("API key inv\xE1lida (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  return res.json;
}
function taskUrl(t) {
  var _a;
  return (_a = t.url) != null ? _a : `https://app.todoist.com/app/task/${t.id}`;
}
async function closeTodoistTask(token, id) {
  const res = await (0, import_obsidian.requestUrl)({
    url: `https://api.todoist.com/api/v1/tasks/${id}/close`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    throw: false
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
  if (res.status !== 204 && res.status !== 200) throw new Error(`HTTP ${res.status}`);
}
function jsonHeaders(token) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}
async function createTodoistTask(token, fields) {
  const res = await (0, import_obsidian.requestUrl)({
    url: "https://api.todoist.com/api/v1/tasks",
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(fields),
    throw: false
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  return res.json;
}
async function updateTodoistTask(token, id, fields) {
  const res = await (0, import_obsidian.requestUrl)({
    url: `https://api.todoist.com/api/v1/tasks/${id}`,
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(fields),
    throw: false
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
}
async function moveTodoistTask(token, id, project_id) {
  const res = await (0, import_obsidian.requestUrl)({
    url: `https://api.todoist.com/api/v1/tasks/${id}/move`,
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ project_id }),
    throw: false
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
}
async function deleteTodoistTask(token, id) {
  const res = await (0, import_obsidian.requestUrl)({
    url: `https://api.todoist.com/api/v1/tasks/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    throw: false
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
  if (res.status !== 204 && res.status !== 200) throw new Error(`HTTP ${res.status}`);
}
async function fetchCompletedTasks(token, since, until) {
  var _a, _b;
  const all = [];
  let cursor = null;
  let pages = 0;
  do {
    const url = new URL("https://api.todoist.com/api/v1/tasks/completed/by_completion_date");
    url.searchParams.set("since", since);
    url.searchParams.set("until", until);
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await (0, import_obsidian.requestUrl)({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false
    });
    if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const data = res.json;
    all.push(...(_a = data.items) != null ? _a : []);
    cursor = (_b = data.next_cursor) != null ? _b : null;
  } while (cursor && ++pages < TODO_MAX_PAGES);
  return all;
}
var XP_LEVEL_BASE = 100;
function gameLevel(xp) {
  return xp <= 0 ? 0 : Math.floor(Math.sqrt(xp / XP_LEVEL_BASE));
}
function levelInfo(xp) {
  const level = gameLevel(xp);
  const into = Math.max(0, xp) - XP_LEVEL_BASE * level * level;
  const forNext = XP_LEVEL_BASE * (2 * level + 1);
  return { level, into, forNext, pct: forNext ? Math.min(100, Math.round(into / forNext * 100)) : 0 };
}
function renderLineChart(parent, points) {
  const n = points.length;
  const max = Math.max(...points.map((p) => Math.max(0, p.value)), 1);
  const xPct = (i) => n <= 1 ? 0 : i / (n - 1) * 100;
  const yPct = (v) => (1 - Math.max(0, v) / max) * 100;
  const chart = parent.createDiv({ cls: "wd-line-chart" });
  const wrap = chart.createDiv({ cls: "wd-line-wrap" });
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("class", "wd-line-svg");
  const poly = document.createElementNS(svgNS, "polyline");
  poly.setAttribute("points", points.map((p, i) => `${xPct(i)},${yPct(p.value)}`).join(" "));
  poly.setAttribute("class", "wd-line-path");
  svg.appendChild(poly);
  wrap.appendChild(svg);
  points.forEach((p, i) => {
    const dot = wrap.createDiv({ cls: "wd-line-dot" + (p.isToday ? " wd-line-dot-today" : "") });
    dot.style.left = `${xPct(i)}%`;
    dot.style.top = `${yPct(p.value)}%`;
    dot.setAttr("title", p.tip);
  });
  const lbls = chart.createDiv({ cls: "wd-line-lbls" });
  points.forEach((p, i) => {
    const show = i === 0 || i === n - 1 || i % 7 === 0;
    lbls.createDiv({ cls: "wd-line-lbl", text: show ? p.label : "" });
  });
}
function escapeGameField(s) {
  return s.replace(/[\r\n\t]+/g, " ");
}
function serializeGameEvent(e) {
  const labels = e.labels.map((l) => escapeGameField(l).replace(/,/g, " ")).join(",");
  return [e.date, e.type, String(e.xp), e.key, escapeGameField(e.content), escapeGameField(e.project), labels].join("	");
}
function parseGameEventLine(line) {
  const p = line.split("	").map((s) => s.trim());
  if (p.length < 4) return null;
  const [date, type, xpRaw, key, content = "", project = "", labelsRaw = ""] = p;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (type !== "feito" && type !== "nao-feito") return null;
  const xp = Number(xpRaw);
  if (!Number.isFinite(xp) || !key) return null;
  const labels = labelsRaw ? labelsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return { date, type, xp, key, content, project, labels };
}
function parseGameLog(content) {
  const m = content.match(new RegExp("```" + GAME_LOG_FENCE + "\\r?\\n([\\s\\S]*?)```"));
  if (!m) return [];
  const out = [];
  for (const raw of m[1].split("\n")) {
    const ev = parseGameEventLine(raw.trim());
    if (ev) out.push(ev);
  }
  return out;
}
function buildGameLogContent(events) {
  const sorted = [...events].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  return [
    "---",
    "owner: Werus",
    "permissions:",
    "  read: [all]",
    "  write:",
    "    - Werus",
    "    - Claude",
    "reviewed: false",
    "type: reference",
    "tags: [gamificacao]",
    "---",
    "",
    "# Gamifica\xE7\xE3o \u2014 Log de XP",
    "",
    "> Arquivo **gerido pelo plugin Werus Dashboard**. Cada linha do bloco abaixo \xE9 um evento",
    "> (tarefa feita = XP positivo, n\xE3o feita = XP negativo). N\xE3o edite \xE0 m\xE3o \u2014 o painel do",
    "> plugin mostra n\xEDvel, streak e estat\xEDsticas a partir daqui.",
    "",
    "```" + GAME_LOG_FENCE,
    sorted.map(serializeGameEvent).join("\n"),
    "```",
    ""
  ].join("\n");
}
function computeStreak(doneDays) {
  if (!doneDays.size) return { streakCurrent: 0, streakBest: 0 };
  const dayMs = 864e5;
  const sorted = [...doneDays].sort();
  let best = 1, run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (Date.parse(sorted[i] + "T00:00:00") - Date.parse(sorted[i - 1] + "T00:00:00") === dayMs) {
      run++;
      best = Math.max(best, run);
    } else run = 1;
  }
  let cur = 0;
  let cursor = /* @__PURE__ */ new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!doneDays.has(toKey(cursor))) cursor = new Date(cursor.getTime() - dayMs);
  while (doneDays.has(toKey(cursor))) {
    cur++;
    cursor = new Date(cursor.getTime() - dayMs);
  }
  return { streakCurrent: cur, streakBest: Math.max(best, cur) };
}
function computeGameStats(events) {
  var _a, _b, _c, _d;
  const byDay = /* @__PURE__ */ new Map();
  const byProject = /* @__PURE__ */ new Map();
  const byLabel = /* @__PURE__ */ new Map();
  let totalXp = 0;
  for (const e of events) {
    totalXp += e.xp;
    const d = (_a = byDay.get(e.date)) != null ? _a : { xp: 0, count: 0 };
    d.xp += e.xp;
    if (e.type === "feito") d.count += 1;
    byDay.set(e.date, d);
    if (e.type === "feito") {
      const proj = e.project || "\u2014";
      byProject.set(proj, ((_b = byProject.get(proj)) != null ? _b : 0) + e.xp);
      for (const l of e.labels) byLabel.set(l, ((_c = byLabel.get(l)) != null ? _c : 0) + e.xp);
    }
  }
  if (totalXp < 0) totalXp = 0;
  const level = gameLevel(totalXp);
  const doneDays = /* @__PURE__ */ new Set();
  for (const e of events) if (e.type === "feito") doneDays.add(e.date);
  const { streakCurrent, streakBest } = computeStreak(doneDays);
  const today = (_d = byDay.get(toKey(/* @__PURE__ */ new Date()))) != null ? _d : { xp: 0, count: 0 };
  return {
    totalXp,
    level,
    xpIntoLevel: totalXp - XP_LEVEL_BASE * level * level,
    xpForNext: XP_LEVEL_BASE * (2 * level + 1),
    streakCurrent,
    streakBest,
    todayXp: today.xp,
    todayCount: today.count,
    byDay,
    byProject,
    byLabel
  };
}
function dueKey(t) {
  var _a, _b, _c;
  const d = (_c = (_a = t.due) == null ? void 0 : _a.date) != null ? _c : (_b = t.due) == null ? void 0 : _b.datetime;
  return d ? d.substring(0, 10) : null;
}
function hasDesc(t) {
  return !!t.description && t.description.trim().length > 0;
}
var DESC_MAX = 700;
function getHeatmapRenderer() {
  const fn = window.renderHeatmapCalendar;
  return typeof fn === "function" ? fn : null;
}
function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow);
  const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - y0.getTime()) / 864e5 + 1) / 7);
}
function mondayOf(offset) {
  const now = /* @__PURE__ */ new Date();
  const dow = now.getDay() || 7;
  const d = new Date(now);
  d.setDate(now.getDate() - dow + 1 + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}
function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function normalizeDate(val) {
  if (!val) return null;
  if (typeof val === "string") return val.substring(0, 10);
  if (val instanceof Date) return val.toISOString().substring(0, 10);
  const s = String(val);
  return s.match(/^\d{4}-\d{2}-\d{2}/) ? s.substring(0, 10) : null;
}
function todayBR() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function allFolderPaths(app) {
  const out = [];
  const walk = (f) => {
    for (const c of f.children) {
      if (c instanceof import_obsidian.TFolder && !c.name.startsWith(".")) {
        out.push(c.path);
        walk(c);
      }
    }
  };
  walk(app.vault.getRoot());
  return out.sort((a, b) => a.localeCompare(b));
}
function fmtShort(ts) {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function countText(stats) {
  if (stats.md === 0 && stats.img > 0) return `${stats.img} img`;
  return stats.img > 0 ? `${stats.md} notas \xB7 ${stats.img} img` : `${stats.md} notas`;
}
function coverInFolder(app, folder) {
  var _a, _b;
  const sf = folder.children.find((c) => c instanceof import_obsidian.TFile && c.name === "status.md");
  if (sf) {
    const raw = (_b = (_a = app.metadataCache.getCache(sf.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.cover;
    if (typeof raw === "string" && raw.trim()) {
      const linkpath = raw.trim().replace(/^!?\[\[/, "").replace(/\]\]$/, "").split("|")[0].trim();
      const resolved = app.metadataCache.getFirstLinkpathDest(linkpath, sf.path);
      if (resolved instanceof import_obsidian.TFile && IMG_EXT.includes(resolved.extension))
        return app.vault.getResourcePath(resolved);
    }
  }
  for (const c of folder.children) {
    if (c instanceof import_obsidian.TFile && c.basename === "_cover" && IMG_EXT.includes(c.extension))
      return app.vault.getResourcePath(c);
  }
  return null;
}
function readFolderStatus(app, folder) {
  var _a, _b;
  const sf = folder.children.find((c) => c instanceof import_obsidian.TFile && c.name === "status.md");
  const s = sf && ((_b = (_a = app.metadataCache.getCache(sf.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.status);
  return s === "paused" || s === "cancelled" ? s : "progress";
}
function readNoteStatus(app, file) {
  var _a, _b;
  const s = (_b = (_a = app.metadataCache.getCache(file.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.status;
  return s === "paused" || s === "cancelled" ? s : "progress";
}
var URGENCY_RANK = { baixa: 1, media: 2, alta: 3 };
var URGENCY_COLOR = { alta: "#EF4444", media: "#F59E0B", baixa: "#EAB308" };
function readNoteUrgency(app, file) {
  var _a, _b;
  const u = (_b = (_a = app.metadataCache.getCache(file.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.urgency;
  return u === "alta" || u === "media" || u === "baixa" ? u : null;
}
var FILE_EXTS = ["md", "canvas", "base"];
function fileGlyph(ext) {
  if (ext === "canvas") return "shapes";
  if (ext === "base") return "table-2";
  return "file-text";
}
function filesIn(folder) {
  return folder.children.filter(
    (c) => c instanceof import_obsidian.TFile && FILE_EXTS.includes(c.extension) && c.name !== "status.md"
  ).sort((a, b) => a.basename.localeCompare(b.basename, "pt"));
}
function readFolderIcon(app, folder) {
  var _a, _b;
  const sf = folder.children.find((c) => c instanceof import_obsidian.TFile && c.name === "status.md");
  const ic = sf && ((_b = (_a = app.metadataCache.getCache(sf.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.icon);
  return typeof ic === "string" && ic.trim() ? ic.trim() : null;
}
function renderIcon(el, icon) {
  if (/^[a-z0-9-]+$/.test(icon)) (0, import_obsidian.setIcon)(el, icon);
  else el.setText(icon);
}
function accentFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}
function folderMeta(app, folder) {
  var _a, _b, _c;
  const known = PARA_MAP.get(folder.path);
  const custom = readFolderIcon(app, folder);
  return {
    icon: (_a = custom != null ? custom : known == null ? void 0 : known.icon) != null ? _a : "\u{1F4C1}",
    label: (_b = known == null ? void 0 : known.label) != null ? _b : folder.name,
    accent: (_c = known == null ? void 0 : known.accent) != null ? _c : accentFor(folder.name)
  };
}
function revealInExplorer(app, target) {
  const exp = app.internalPlugins.getPluginById("file-explorer");
  if (exp && target) exp.instance.revealInFolder(target);
}
var EMPTY_AGG = { md: 0, img: 0, reviewed: 0, urgency: [], urgencyMax: null, recent: [] };
function buildVaultCache(app) {
  const byFolder = /* @__PURE__ */ new Map();
  const datedNotes = [];
  const ctimeByDay = /* @__PURE__ */ new Map();
  let totalNotes = 0, totalReviewed = 0;
  const walk = (folder) => {
    var _a, _b, _c;
    const agg = { md: 0, img: 0, reviewed: 0, urgency: [], urgencyMax: null, recent: [] };
    const recent = [];
    for (const c of folder.children) {
      if (c instanceof import_obsidian.TFolder) {
        const sub = walk(c);
        agg.md += sub.md;
        agg.img += sub.img;
        agg.reviewed += sub.reviewed;
        if (sub.urgency.length) agg.urgency.push(...sub.urgency);
        if (sub.recent.length) recent.push(...sub.recent);
      } else if (c instanceof import_obsidian.TFile) {
        if (c.extension === "md" && c.name !== "status.md") {
          agg.md++;
          recent.push(c);
          totalNotes++;
          const fm = (_a = app.metadataCache.getCache(c.path)) == null ? void 0 : _a.frontmatter;
          if ((fm == null ? void 0 : fm.reviewed) === true) {
            agg.reviewed++;
            totalReviewed++;
          }
          const u = fm == null ? void 0 : fm.urgency;
          if (u === "alta" || u === "media" || u === "baixa") agg.urgency.push({ file: c, level: u });
          const ck = toKey(new Date(c.stat.ctime));
          ctimeByDay.set(ck, ((_b = ctimeByDay.get(ck)) != null ? _b : 0) + 1);
          const m = c.basename.match(/^(\d{4}-\d{2}-\d{2})/);
          const d = (_c = normalizeDate(fm == null ? void 0 : fm.date)) != null ? _c : m ? m[1] : null;
          if (d) datedNotes.push({ file: c, date: d });
        } else if (IMG_EXT.includes(c.extension)) {
          agg.img++;
        }
      }
    }
    recent.sort((a, b) => b.stat.mtime - a.stat.mtime);
    agg.recent = recent.slice(0, 4);
    for (const it of agg.urgency)
      if (!agg.urgencyMax || URGENCY_RANK[it.level] > URGENCY_RANK[agg.urgencyMax]) agg.urgencyMax = it.level;
    agg.urgency.sort((a, b) => URGENCY_RANK[b.level] - URGENCY_RANK[a.level]);
    byFolder.set(folder.path, agg);
    return agg;
  };
  walk(app.vault.getRoot());
  return { byFolder, datedNotes, ctimeByDay, totalNotes, totalReviewed };
}
var TodoistController = class {
  // views inscritas (re-render da seção Todoist)
  constructor(app, plugin, component) {
    this.app = app;
    this.plugin = plugin;
    this.component = component;
    this.tasks = [];
    this.projects = [];
    this.projectMap = /* @__PURE__ */ new Map();
    // id → nome
    this.labelColors = /* @__PURE__ */ new Map();
    // nome da etiqueta → hex
    this.loading = false;
    this.error = null;
    this.fetchedAt = 0;
    this.laterOpen = false;
    this.noDateOpen = false;
    this.filterOpen = false;
    this.tip = null;
    this.launching = /* @__PURE__ */ new Set();
    // ids de pacotes sendo lançados (anti clique-duplo)
    this.subs = /* @__PURE__ */ new Set();
    this.loadCache();
  }
  // Inscreve uma view; devolve a função de cancelar. O callback re-renderiza só a
  // seção Todoist daquela view (não a view inteira). Estado é único e compartilhado.
  subscribe(cb) {
    this.subs.add(cb);
    return () => {
      this.subs.delete(cb);
    };
  }
  rerenderAll() {
    for (const cb of this.subs) cb();
  }
  reset() {
    this.tasks = [];
    this.projects = [];
    this.projectMap = /* @__PURE__ */ new Map();
    this.labelColors = /* @__PURE__ */ new Map();
    this.fetchedAt = 0;
    this.error = null;
    this.loading = false;
    this.rerenderAll();
  }
  hideTip() {
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }
  // Nome do projeto pelo id (reusado pela Gamificação). Vazio se desconhecido.
  projectName(id) {
    return id && this.projectMap.get(id) || "";
  }
  // Nomes de projetos/etiquetas que existem hoje no Todoist (para sinalizar os que sumiram).
  knownProjects() {
    return new Set(this.projectMap.values());
  }
  knownLabels() {
    return new Set(this.labelColors.keys());
  }
  dayRange() {
    return this.plugin.settings.todoistDayRange === 3 ? 3 : 7;
  }
  applyFilters(tasks) {
    const f = this.plugin.settings.todoistFilters;
    if (!f.projects.length && !f.labels.length) return tasks;
    const ps = new Set(f.projects), ls = new Set(f.labels);
    return tasks.filter((t) => {
      var _a;
      if (ps.size && !(t.project_id && ps.has(t.project_id))) return false;
      if (ls.size && !((_a = t.labels) != null ? _a : []).some((l) => ls.has(l))) return false;
      return true;
    });
  }
  toggleFilter(kind, id) {
    const arr = this.plugin.settings.todoistFilters[kind];
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(id);
  }
  labelColor(name) {
    var _a;
    return (_a = this.labelColors.get(name)) != null ? _a : LABEL_FALLBACK;
  }
  labelChip(host, name, cls) {
    const chip = host.createSpan({ cls });
    chip.createSpan({ cls: "wd-label-dot" }).style.background = this.labelColor(name);
    chip.createSpan({ text: `@${name}` });
    return chip;
  }
  positionTip(tip, target) {
    const rect = target.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    if (top + th > window.innerHeight - 8) top = rect.top - th - 6;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
  }
  showTaskTip(target, t) {
    this.hideTip();
    const tip = document.body.createDiv({ cls: "wd-tooltip wd-task-tip" });
    const head = tip.createDiv({ cls: "wd-task-tip-head" });
    head.createSpan({ cls: "wd-task-tip-pri" }).style.background = priMeta(t.priority).color;
    head.createSpan({ cls: "wd-task-tip-title", text: t.content });
    if (hasDesc(t)) {
      const d = t.description.trim();
      tip.createDiv({ cls: "wd-task-tip-desc", text: d.length > DESC_MAX ? d.slice(0, DESC_MAX) + "\u2026" : d });
    }
    this.tip = tip;
    this.positionTip(tip, target);
  }
  attachTaskTip(el, t) {
    el.addEventListener("mouseenter", () => this.showTaskTip(el, t));
    el.addEventListener("mouseleave", () => this.hideTip());
  }
  todoCheck(host, t) {
    const check = host.createSpan({ cls: "wd-todo-check" });
    check.setAttr("title", "Concluir tarefa");
    clickable(check, (e) => {
      e.stopPropagation();
      void this.completeTask(t);
    });
  }
  todoRow(list, t, showDate = true) {
    var _a, _b;
    const pri = priMeta(t.priority);
    const row = list.createDiv({ cls: "wd-todo-row" });
    row.style.setProperty("--pri", pri.color);
    this.todoCheck(row, t);
    const tag = row.createSpan({ cls: "wd-todo-pri", text: pri.label });
    tag.style.background = pri.color;
    row.createSpan({ cls: "wd-todo-row-txt", text: t.content });
    if (hasDesc(t)) (0, import_obsidian.setIcon)(row.createSpan({ cls: "wd-todo-hasdesc" }), "align-left");
    const proj = t.project_id ? this.projectMap.get(t.project_id) : void 0;
    if (this.plugin.settings.todoistShowProject && proj) row.createSpan({ cls: "wd-todo-row-proj", text: proj });
    if (this.plugin.settings.todoistShowLabels)
      for (const l of (_a = t.labels) != null ? _a : []) this.labelChip(row, l, "wd-todo-row-label");
    const dk = dueKey(t);
    if (showDate && dk) {
      const [, m, d] = dk.split("-");
      row.createSpan({ cls: "wd-todo-row-date", text: `${d}/${m}` });
    }
    if ((_b = t.due) == null ? void 0 : _b.is_recurring) row.createSpan({ cls: "wd-todo-recur", text: "\u27F3" });
    if (this.plugin.settings.gamificationEnabled) {
      const x = row.createSpan({ cls: "wd-todo-undone" });
      (0, import_obsidian.setIcon)(x, "x");
      x.setAttr("title", "N\xE3o feita \u2014 puni\xE7\xE3o de XP e apaga do Todoist");
      clickable(x, (e) => {
        e.stopPropagation();
        void this.plugin.game.markUndone(t);
      });
    }
    clickable(row, () => this.openTaskDetail(t));
    this.attachTaskTip(row, t);
  }
  addTaskBtn(host, prefillDue, title = "Nova tarefa") {
    const b = host.createSpan({ cls: "wd-todo-add" });
    (0, import_obsidian.setIcon)(b, "plus");
    b.setAttr("title", title);
    clickable(b, (e) => {
      e.stopPropagation();
      this.openTaskForm({ mode: "create", prefillDue });
    });
    return b;
  }
  openTaskForm(opts) {
    this.hideTip();
    const labels = [.../* @__PURE__ */ new Set([...this.labelColors.keys(), ...this.tasks.flatMap((t) => {
      var _a;
      return (_a = t.labels) != null ? _a : [];
    })])].sort((a, b) => a.localeCompare(b));
    new TaskFormModal(this.app, {
      mode: opts.mode,
      task: opts.task,
      prefillDue: opts.prefillDue,
      projects: this.projects,
      labels,
      labelColor: (n) => this.labelColor(n),
      submit: (v) => this.submitTaskForm(opts.mode, opts.task, v),
      remove: opts.task ? () => this.deleteTask(opts.task) : void 0,
      complete: opts.task ? () => void this.completeTask(opts.task) : void 0
    }).open();
  }
  openTaskDetail(t) {
    this.hideTip();
    new TaskDetailModal(this.app, this.component, {
      task: t,
      projectName: t.project_id ? this.projectMap.get(t.project_id) : void 0,
      labelColor: (n) => this.labelColor(n),
      edit: () => this.openTaskForm({ mode: "edit", task: t }),
      complete: () => void this.completeTask(t)
    }).open();
  }
  async submitTaskForm(mode, task, v) {
    var _a, _b, _c, _d;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    try {
      if (mode === "create") {
        const fields = { content: v.content, priority: v.priority };
        if (v.description.trim()) fields.description = v.description.trim();
        if (v.dueDate) fields.due_date = v.dueDate;
        if (v.projectId) fields.project_id = v.projectId;
        if (v.labels.length) fields.labels = v.labels;
        await createTodoistTask(token, fields);
        new import_obsidian.Notice(`\u2713 Criada: ${v.content}`);
      } else if (task) {
        const fields = {};
        if (v.content !== task.content) fields.content = v.content;
        if (v.description !== ((_a = task.description) != null ? _a : "")) fields.description = v.description;
        if (v.priority !== task.priority) fields.priority = v.priority;
        const oldDate = ((_b = task.due) == null ? void 0 : _b.date) ? task.due.date.substring(0, 10) : "";
        if (v.dueDate !== oldDate) {
          if (v.dueDate) fields.due_date = v.dueDate;
          else fields.due_string = "no date";
        }
        const oldL = ((_c = task.labels) != null ? _c : []).slice().sort().join(" ");
        const newL = v.labels.slice().sort().join(" ");
        if (oldL !== newL) fields.labels = v.labels;
        if (Object.keys(fields).length) await updateTodoistTask(token, task.id, fields);
        const oldProj = (_d = task.project_id) != null ? _d : "";
        if (v.projectId !== oldProj && v.projectId) await moveTodoistTask(token, task.id, v.projectId);
        new import_obsidian.Notice(`\u2713 Salva: ${v.content}`);
      }
      await this.fetch(true);
      return true;
    } catch (e) {
      new import_obsidian.Notice(`Falha ao salvar: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  }
  async deleteTask(t) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    const idx = this.tasks.findIndex((x) => x.id === t.id);
    if (idx >= 0) this.tasks.splice(idx, 1);
    this.rerenderAll();
    try {
      await deleteTodoistTask(token, t.id);
      this.persistCache();
      new import_obsidian.Notice(`\u{1F5D1} Exclu\xEDda: ${t.content}`);
      return true;
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao excluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerenderAll();
      return false;
    }
  }
  async completeTask(t) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    const idx = this.tasks.findIndex((x) => x.id === t.id);
    if (idx >= 0) this.tasks.splice(idx, 1);
    this.rerenderAll();
    try {
      await closeTodoistTask(token, t.id);
      this.persistCache();
      new import_obsidian.Notice(`\u2713 Conclu\xEDda: ${t.content}`);
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao concluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerenderAll();
    }
  }
  isStale() {
    return Date.now() - this.fetchedAt >= TODO_TTL;
  }
  // Auto-refresh periódico (intervalo no onload): só busca se há view aberta, token
  // configurado, nada em voo e o cache passou do TTL. Sem view aberta = sem chamada à API.
  maybeRefresh() {
    if (!this.subs.size || this.loading) return;
    if (!this.plugin.settings.todoistToken.trim()) return;
    if (this.isStale()) void this.fetch(false);
  }
  // Cache offline (por-dispositivo, localStorage → não sincroniza): carrega o último
  // resultado para a aba abrir já com as tarefas, mesmo sem internet.
  loadCache() {
    try {
      const raw = this.app.loadLocalStorage(LS_TODO_CACHE);
      const c = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!c || !Array.isArray(c.tasks)) return;
      this.tasks = c.tasks;
      this.projects = Array.isArray(c.projects) ? c.projects : [];
      this.projectMap = new Map(this.projects.map((p) => [p.id, p.name]));
      this.labelColors = new Map(Array.isArray(c.labels) ? c.labels : []);
      this.fetchedAt = typeof c.fetchedAt === "number" ? c.fetchedAt : 0;
    } catch (e) {
    }
  }
  persistCache() {
    try {
      this.app.saveLocalStorage(LS_TODO_CACHE, JSON.stringify({
        tasks: this.tasks,
        projects: this.projects,
        labels: [...this.labelColors],
        fetchedAt: this.fetchedAt
      }));
    } catch (e) {
    }
  }
  // Aviso de frescor no topo da lista: durante uma busca, ou quando estamos
  // exibindo o cache porque a última busca falhou (offline).
  renderFreshness(host) {
    if (this.loading) {
      host.createDiv({ cls: "wd-todo-fresh", text: "Atualizando\u2026" });
      return;
    }
    if (this.error) {
      const when = this.fetchedAt ? relTime(new Date(this.fetchedAt).toISOString()) : "\u2014";
      host.createDiv({ cls: "wd-todo-fresh wd-todo-fresh-stale", text: `Sem conex\xE3o \u2014 exibindo o \xFAltimo carregado (${when})` });
    }
  }
  async fetch(manual) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token || this.loading) return;
    this.loading = true;
    this.error = null;
    if (manual) this.rerenderAll();
    try {
      const [tasks, projects, labels] = await Promise.all([
        fetchTodoistTasks(token),
        fetchTodoistProjects(token).catch(() => []),
        fetchTodoistLabels(token).catch(() => [])
      ]);
      this.tasks = tasks;
      this.projects = projects;
      this.projectMap = new Map(projects.map((p) => [p.id, p.name]));
      this.labelColors = new Map(labels.map((l) => {
        var _a;
        return [l.name, (_a = TODOIST_COLORS[l.color]) != null ? _a : LABEL_FALLBACK];
      }));
      this.fetchedAt = Date.now();
      this.persistCache();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.loading = false;
      this.rerenderAll();
    }
  }
  // Lança um pacote: cria cada tarefa no Todoist com data de hoje. Sequencial
  // (evita rajada na API). Atualiza a lista ao final.
  async launchPackage(pkg) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) {
      new import_obsidian.Notice("Configure o token do Todoist nas Configura\xE7\xF5es.");
      return;
    }
    const items = pkg.tasks.map((s) => s.trim()).filter(Boolean).map((line) => {
      var _a;
      return splitTaskLabels(line, (_a = pkg.labels) != null ? _a : []);
    });
    if (!items.length) {
      new import_obsidian.Notice("Pacote sem tarefas.");
      return;
    }
    if (this.launching.has(pkg.id)) return;
    const mode = this.plugin.settings.packageConfirm;
    const needConfirm = mode === "always" || mode === "many" && items.length > LAUNCH_CONFIRM_MIN;
    if (needConfirm) {
      const ok2 = await confirmModal(this.app, {
        title: `Lan\xE7ar \u201C${pkg.name || "pacote"}\u201D?`,
        body: `Isso vai criar ${items.length} tarefa(s) no Todoist com data de hoje:`,
        items: items.map((it) => ({
          text: (it.priority > 1 ? `[${priMeta(it.priority).label}] ` : "") + it.title,
          labels: it.labels.map((n) => ({ name: n, color: this.labelColor(n) }))
        })),
        cta: `Lan\xE7ar ${items.length}`
      });
      if (!ok2) return;
    }
    this.launching.add(pkg.id);
    this.rerenderAll();
    const due = toKey(/* @__PURE__ */ new Date());
    let ok = 0;
    try {
      for (const { title, labels, priority } of items) {
        try {
          const fields = { content: title, due_date: due };
          if (pkg.projectId) fields.project_id = pkg.projectId;
          if (labels.length) fields.labels = labels;
          if (priority > 1) fields.priority = priority;
          await createTodoistTask(token, fields);
          ok++;
        } catch (e) {
          new import_obsidian.Notice(`Falha em "${title}": ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    } finally {
      this.launching.delete(pkg.id);
    }
    new import_obsidian.Notice(`\u2713 ${ok}/${items.length} tarefa(s) lan\xE7ada(s) \u2014 ${pkg.name || "pacote"}`);
    await this.fetch(true);
  }
  // Barra de lançadores de pacotes. Com `heading`, monta a seção "PACOTES"
  // completa (aba do Todoist); sem ele, só a barra de botões (dashboard, e
  // some quando não há pacotes para manter o painel enxuto).
  renderPackages(host, opts = {}) {
    const pkgs = this.plugin.settings.taskPackages;
    let target = host;
    if (opts.heading) {
      const sec = host.createDiv({ cls: "wd-section" });
      const head = sec.createDiv({ cls: "wd-sec-head" });
      head.createDiv({ cls: "wd-sec-label", text: "PACOTES" });
      if (!pkgs.length) {
        sec.createDiv({ cls: "wd-empty", text: "Crie pacotes em Configura\xE7\xF5es \u2192 Werus Dashboard \u2192 Pacotes de tarefas." });
        return;
      }
      target = sec;
    } else if (!pkgs.length) {
      return;
    }
    const token = this.plugin.settings.todoistToken.trim();
    const bar = target.createDiv({ cls: "wd-pkg-bar" });
    for (const pkg of pkgs) {
      const valid = pkg.tasks.filter((s) => s.trim()).length;
      const busy = this.launching.has(pkg.id);
      const disabled = !token || !valid || busy;
      const btn = bar.createDiv({ cls: "wd-pkg-btn" + (disabled ? " wd-pkg-disabled" : "") + (busy ? " wd-pkg-busy" : "") });
      if (pkg.icon) renderIcon(btn.createSpan({ cls: "wd-pkg-ico" }), pkg.icon);
      btn.createSpan({ cls: "wd-pkg-name", text: pkg.name || "(sem nome)" });
      btn.createSpan({ cls: "wd-pkg-count", text: busy ? "\u2026" : String(valid) });
      btn.setAttr(
        "title",
        busy ? "Lan\xE7ando\u2026" : !token ? "Configure o token do Todoist" : !valid ? "Pacote sem tarefas" : `Lan\xE7ar ${valid} tarefa(s) no Todoist (hoje)`
      );
      if (!disabled) clickable(btn, () => void this.launchPackage(pkg));
    }
  }
  renderFilterBar(host) {
    const f = this.plugin.settings.todoistFilters;
    const bar = host.createDiv({ cls: "wd-todo-filterbar" });
    if (this.projects.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Projetos" });
      for (const p of this.projects) {
        const on = f.projects.includes(p.id);
        const chip = grp.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : ""), text: p.name });
        chip.setAttr("aria-pressed", String(on));
        clickable(chip, async () => {
          this.toggleFilter("projects", p.id);
          await this.plugin.saveSettings();
          this.rerenderAll();
        });
      }
    }
    const labels = [...new Set(this.tasks.flatMap((t) => {
      var _a;
      return (_a = t.labels) != null ? _a : [];
    }))].sort((a, b) => a.localeCompare(b));
    if (labels.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Etiquetas" });
      for (const l of labels) {
        const on = f.labels.includes(l);
        const chip = this.labelChip(grp, l, "wd-todo-fchip" + (on ? " wd-on" : ""));
        chip.setAttr("aria-pressed", String(on));
        clickable(chip, async () => {
          this.toggleFilter("labels", l);
          await this.plugin.saveSettings();
          this.rerenderAll();
        });
      }
    }
    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clickable(clr, async () => {
        f.projects = [];
        f.labels = [];
        await this.plugin.saveSettings();
        this.rerenderAll();
      });
    }
  }
  // Renderiza os controles de cabeçalho (em `ctrls`) + a lista de tarefas
  // (em `body`). O host fornece o rótulo da seção e o layout do cabeçalho.
  renderList(body, ctrls, opts = {}) {
    var _a;
    const token = this.plugin.settings.todoistToken.trim();
    if (token) {
      const range2 = this.dayRange();
      const seg = ctrls.createDiv({ cls: "wd-todo-range" });
      for (const n of [3, 7]) {
        const b = seg.createSpan({ cls: "wd-todo-range-btn" + (range2 === n ? " wd-on" : ""), text: `${n}d` });
        b.setAttr("title", `Mostrar os pr\xF3ximos ${n} dias`);
        b.setAttr("aria-pressed", String(range2 === n));
        clickable(b, async (e) => {
          e.stopPropagation();
          this.plugin.settings.todoistDayRange = n;
          await this.plugin.saveSettings();
          this.rerenderAll();
        });
      }
      const f = this.plugin.settings.todoistFilters;
      const nF = f.projects.length + f.labels.length;
      const filt = ctrls.createSpan({ cls: "wd-todo-filterbtn" + (this.filterOpen ? " wd-on" : "") + (nF ? " wd-active" : "") });
      (0, import_obsidian.setIcon)(filt, "filter");
      filt.setAttr("title", nF ? `Filtros ativos (${nF}) \u2014 clique para ajustar` : "Filtrar por projeto/etiqueta");
      if (nF) filt.createSpan({ cls: "wd-todo-filtct", text: String(nF) });
      filt.setAttr("aria-pressed", String(this.filterOpen));
      clickable(filt, (e) => {
        e.stopPropagation();
        this.filterOpen = !this.filterOpen;
        this.rerenderAll();
      });
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.loading ? " wd-spin" : "") });
      (0, import_obsidian.setIcon)(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      clickable(refresh, (e) => {
        e.stopPropagation();
        void this.fetch(true);
      });
      this.addTaskBtn(ctrls, void 0, "Nova tarefa");
    }
    if (!token) {
      body.createDiv({ cls: "wd-empty", text: "Cole seu token do Todoist em Configura\xE7\xF5es \u2192 Werus Dashboard para ver suas tarefas aqui." });
      return;
    }
    if (!this.loading && !this.error && (!this.fetchedAt || this.isStale())) void this.fetch(false);
    const hasCache = this.tasks.length > 0;
    if (this.error && !hasCache) {
      body.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao buscar tarefas: ${this.error}` });
      return;
    }
    if (!this.fetchedAt && !hasCache) {
      body.createDiv({ cls: "wd-empty", text: "Carregando tarefas\u2026" });
      return;
    }
    this.renderFreshness(body);
    if (this.filterOpen) this.renderFilterBar(body);
    const range = this.dayRange();
    const todayK = toKey(/* @__PURE__ */ new Date());
    const lastUpcoming = /* @__PURE__ */ new Date();
    lastUpcoming.setDate(lastUpcoming.getDate() + range);
    const lastK = toKey(lastUpcoming);
    const tasks = this.applyFilters(this.tasks);
    const overdue = [];
    const todayTasks = [];
    const byDay = {};
    const later = [];
    const noDate = [];
    for (const t of tasks) {
      const dk = dueKey(t);
      if (!dk) {
        noDate.push(t);
        continue;
      }
      if (dk < todayK) overdue.push(t);
      else if (dk === todayK) todayTasks.push(t);
      else if (dk <= lastK) ((_a = byDay[dk]) != null ? _a : byDay[dk] = []).push(t);
      else later.push(t);
    }
    const byPri = (a, b) => b.priority - a.priority;
    const byDateThenPri = (a, b) => {
      var _a2, _b;
      const da = (_a2 = dueKey(a)) != null ? _a2 : "", db = (_b = dueKey(b)) != null ? _b : "";
      if (da !== db) return da < db ? -1 : 1;
      return b.priority - a.priority;
    };
    overdue.sort(byPri);
    todayTasks.sort(byPri);
    later.sort(byDateThenPri);
    noDate.sort(byPri);
    for (const k of Object.keys(byDay)) byDay[k].sort(byPri);
    const showExtra = opts.showLater !== false;
    const visible = overdue.length + todayTasks.length + later.length + Object.values(byDay).reduce((s, a) => s + a.length, 0) + (showExtra ? noDate.length : 0);
    if (visible === 0) {
      const f = this.plugin.settings.todoistFilters;
      const filtered = !!(f.projects.length || f.labels.length);
      const msg = filtered ? "Nenhuma tarefa bate com os filtros." : showExtra ? "Nenhuma tarefa no Todoist. \u{1F389}" : "Nenhuma tarefa agendada. \u{1F389}";
      body.createDiv({ cls: "wd-empty", text: msg });
      return;
    }
    const cols = body.createDiv({ cls: "wd-todo-cols" });
    const obox = cols.createDiv({ cls: "wd-todo-box wd-box-overdue" });
    const ohd = obox.createDiv({ cls: "wd-todo-boxhd" });
    ohd.createSpan({ cls: "wd-todo-boxwarn", text: "\u26A0" });
    ohd.createSpan({ cls: "wd-todo-boxlabel", text: "Atrasadas" });
    ohd.createSpan({ cls: "wd-todo-boxcount", text: String(overdue.length) });
    const obody = obox.createDiv({ cls: "wd-todo-boxbody" });
    if (overdue.length) for (const t of overdue) this.todoRow(obody, t);
    else obody.createDiv({ cls: "wd-todo-boxempty", text: "Nenhuma. \u{1F44D}" });
    const tbox = cols.createDiv({ cls: "wd-todo-box wd-box-today" });
    const thd = tbox.createDiv({ cls: "wd-todo-boxhd" });
    thd.createSpan({ cls: "wd-todo-boxlabel", text: "Hoje" });
    this.addTaskBtn(thd, "hoje", "Nova tarefa para hoje");
    thd.createSpan({ cls: "wd-todo-boxcount", text: String(todayTasks.length) });
    const tbody = tbox.createDiv({ cls: "wd-todo-boxbody" });
    if (todayTasks.length) for (const t of todayTasks) this.todoRow(tbody, t);
    else tbody.createDiv({ cls: "wd-todo-boxempty", text: "Nada para hoje." });
    let upcomingCount = 0;
    const upDays = [];
    for (let i = 1; i <= range; i++) {
      const day = /* @__PURE__ */ new Date();
      day.setDate(day.getDate() + i);
      const key = toKey(day);
      const items = byDay[key];
      if (!(items == null ? void 0 : items.length)) continue;
      upcomingCount += items.length;
      upDays.push({ dow: (day.getDay() + 6) % 7, num: day.getDate(), key, items });
    }
    const ubox = cols.createDiv({ cls: "wd-todo-box wd-box-upcoming" });
    const uhd = ubox.createDiv({ cls: "wd-todo-boxhd" });
    uhd.createSpan({ cls: "wd-todo-boxlabel", text: `Pr\xF3ximos ${range} dias` });
    this.addTaskBtn(uhd, void 0, "Nova tarefa");
    uhd.createSpan({ cls: "wd-todo-boxcount", text: String(upcomingCount) });
    const ubody = ubox.createDiv({ cls: "wd-todo-boxbody" });
    if (upDays.length) {
      for (const g of upDays) {
        const dh = ubody.createDiv({ cls: "wd-todo-dayhd" + (g.dow >= 5 ? " wd-weekend" : "") });
        dh.createSpan({ cls: "wd-todo-dayname", text: DAY_SHORT[g.dow] });
        dh.createSpan({ cls: "wd-todo-daynum", text: String(g.num) });
        this.addTaskBtn(dh, g.key, `Nova tarefa em ${g.num}`);
        for (const t of g.items) this.todoRow(ubody, t, false);
      }
    } else {
      ubody.createDiv({ cls: "wd-todo-boxempty", text: `Nada nos pr\xF3ximos ${range} dias.` });
    }
    if (later.length && showExtra) {
      const panel = body.createDiv({ cls: "wd-todo-later" });
      const lhd = panel.createDiv({ cls: "wd-todo-ohd" });
      lhd.createSpan({ cls: "wd-todo-laterico", text: "\u203A" });
      lhd.createSpan({ cls: "wd-todo-otitle", text: `Depois (${later.length})` });
      lhd.createSpan({ cls: "wd-todo-otoggle", text: this.laterOpen ? "ocultar \u25BE" : "mostrar \u203A" });
      lhd.setAttr("aria-expanded", String(this.laterOpen));
      clickable(lhd, () => {
        this.laterOpen = !this.laterOpen;
        this.rerenderAll();
      });
      if (this.laterOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of later) this.todoRow(list, t);
      }
    }
    if (noDate.length && showExtra) {
      const panel = body.createDiv({ cls: "wd-todo-later wd-todo-nodate" });
      const nhd = panel.createDiv({ cls: "wd-todo-ohd" });
      nhd.createSpan({ cls: "wd-todo-laterico", text: "\u203A" });
      nhd.createSpan({ cls: "wd-todo-otitle", text: `Sem data (${noDate.length})` });
      nhd.createSpan({ cls: "wd-todo-otoggle", text: this.noDateOpen ? "ocultar \u25BE" : "mostrar \u203A" });
      nhd.setAttr("aria-expanded", String(this.noDateOpen));
      clickable(nhd, () => {
        this.noDateOpen = !this.noDateOpen;
        this.rerenderAll();
      });
      if (this.noDateOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of noDate) this.todoRow(list, t);
      }
    }
  }
};
function isRecurringCompleted(t) {
  var _a;
  return ((_a = t.due) == null ? void 0 : _a.is_recurring) === true;
}
var GameController = class {
  constructor(app, plugin) {
    this.app = app;
    this.plugin = plugin;
    this.events = [];
    this.loaded = false;
    this.busy = false;
    // colheita/markUndone em andamento
    this.pending = [];
    // concluídas na API ainda não no log (live)
    this.pendingXp = 0;
    this.lastBarPct = 0;
    // último % da barra (p/ animar do valor anterior)
    this.lastLevel = 0;
    this.subs = /* @__PURE__ */ new Set();
  }
  subscribe(cb) {
    this.subs.add(cb);
    return () => {
      this.subs.delete(cb);
    };
  }
  rerenderAll() {
    for (const cb of this.subs) cb();
  }
  logFile() {
    const f = this.app.vault.getAbstractFileByPath(GAME_LOG_PATH);
    return f instanceof import_obsidian.TFile ? f : null;
  }
  invalidate() {
    this.loaded = false;
  }
  async ensureLoaded() {
    if (this.loaded) return;
    const f = this.logFile();
    this.events = f ? parseGameLog(await this.app.vault.read(f)) : [];
    this.loaded = true;
  }
  stats() {
    return computeGameStats(this.events);
  }
  async writeLog() {
    const content = buildGameLogContent(this.events);
    const f = this.logFile();
    if (f) {
      await this.app.vault.modify(f, content);
      return;
    }
    const slash = GAME_LOG_PATH.lastIndexOf("/");
    const folder = slash > 0 ? GAME_LOG_PATH.slice(0, slash) : "";
    if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
      try {
        await this.app.vault.createFolder(folder);
      } catch (e) {
      }
    }
    await this.app.vault.create(GAME_LOG_PATH, content);
  }
  // Anexa eventos novos (dedup por chave). Devolve quantos entraram.
  async appendEvents(evs) {
    await this.ensureLoaded();
    const keys = new Set(this.events.map((e) => e.key));
    const add = evs.filter((e) => !keys.has(e.key));
    if (!add.length) return 0;
    this.events.push(...add);
    await this.writeLog();
    this.rerenderAll();
    return add.length;
  }
  projName(t) {
    var _a;
    return this.plugin.todo.projectName(t.project_id) || ((_a = t.project_id) != null ? _a : "");
  }
  doneEvent(t) {
    var _a, _b;
    const at = (_a = t.completed_at) != null ? _a : (/* @__PURE__ */ new Date()).toISOString();
    return {
      date: toKey(new Date(at)),
      type: "feito",
      xp: xpForPriority(t.priority),
      key: `${t.id}|${at}`,
      content: t.content,
      project: this.projName(t),
      labels: (_b = t.labels) != null ? _b : []
    };
  }
  // Janela do fetch: desde a última colheita (−2d de margem) ou backfill na 1ª vez.
  harvestSince() {
    const last = this.plugin.settings.gameLastHarvest;
    if (last && /^\d{4}-\d{2}-\d{2}$/.test(last))
      return toKey(new Date(Date.parse(last + "T00:00:00") - 2 * 864e5));
    return toKey(new Date(Date.now() - HARVEST_BACKFILL_DAYS * 864e5));
  }
  // `until` = AMANHÃ (local). completed_at da API é UTC: à noite no BRT, a conclusão de
  // hoje já é "amanhã" em UTC → com until=hoje ela cairia fora da janela.
  harvestUntil() {
    return toKey(new Date(Date.now() + 864e5));
  }
  // "Não feito": punição (−base×fator) → log → apaga do Todoist.
  async markUndone(t) {
    var _a;
    if (this.busy) return;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) {
      new import_obsidian.Notice("Configure o token do Todoist.");
      return;
    }
    const penalty = Math.max(1, Math.round(xpForPriority(t.priority) * this.plugin.settings.gamePenaltyFactor));
    const recurring = isRecurringCompleted(t);
    const ok = await confirmModal(this.app, {
      title: "Marcar como n\xE3o feita?",
      body: recurring ? `"${t.content}" \xE9 recorrente \u2014 voc\xEA perde ${penalty} XP, mas a tarefa N\xC3O \xE9 apagada (apagar quebraria a recorr\xEAncia).` : `"${t.content}" \u2014 voc\xEA perde ${penalty} XP e a tarefa \xE9 apagada do Todoist (irrevers\xEDvel).`,
      cta: `N\xE3o feita (\u2212${penalty} XP)`
    });
    if (!ok) return;
    this.busy = true;
    this.rerenderAll();
    try {
      await this.appendEvents([{
        date: toKey(/* @__PURE__ */ new Date()),
        type: "nao-feito",
        xp: -penalty,
        key: `${t.id}|${Date.now()}`,
        content: t.content,
        project: this.projName(t),
        labels: (_a = t.labels) != null ? _a : []
      }]);
      if (!recurring) await deleteTodoistTask(token, t.id);
      new import_obsidian.Notice(`\u2717 N\xE3o feita: ${t.content} (\u2212${penalty} XP)`);
      await this.plugin.todo.fetch(true);
    } catch (e) {
      new import_obsidian.Notice(`Falha: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      this.busy = false;
      this.rerenderAll();
    }
  }
  // Colhe concluídas → log; apaga do Todoist só as NÃO-recorrentes.
  async harvest() {
    if (this.busy) return;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) {
      new import_obsidian.Notice("Configure o token do Todoist.");
      return;
    }
    this.busy = true;
    this.rerenderAll();
    try {
      await this.ensureLoaded();
      const today = toKey(/* @__PURE__ */ new Date());
      const completed = await fetchCompletedTasks(token, this.harvestSince(), this.harvestUntil());
      const keys = new Set(this.events.map((e) => e.key));
      const fresh = completed.filter((t) => {
        var _a;
        return !keys.has(`${t.id}|${(_a = t.completed_at) != null ? _a : ""}`);
      });
      if (!fresh.length) {
        this.plugin.settings.gameLastHarvest = today;
        await this.plugin.saveSettings();
        this.pending = [];
        this.pendingXp = 0;
        new import_obsidian.Notice("Nada novo para salvar. \u{1F44D}");
        return;
      }
      const deletable = fresh.filter((t) => !isRecurringCompleted(t));
      const recurring = fresh.length - deletable.length;
      const totalXp = fresh.reduce((s, t) => s + xpForPriority(t.priority), 0);
      const ok = await confirmModal(this.app, {
        title: `Salvar ${fresh.length} tarefa(s) conclu\xEDda(s)?`,
        body: `+${totalXp} XP no log. ${deletable.length} apagada(s) do Todoist` + (recurring ? ` \xB7 ${recurring} recorrente(s) ficam (apagar quebraria a recorr\xEAncia).` : "."),
        items: fresh.slice(0, 30).map((t) => ({ text: `+${xpForPriority(t.priority)} \xB7 ${t.content}` })),
        cta: `Salvar e apagar ${deletable.length}`
      });
      if (!ok) return;
      await this.appendEvents(fresh.map((t) => this.doneEvent(t)));
      let del = 0;
      for (const t of deletable) {
        try {
          await deleteTodoistTask(token, t.id);
          del++;
        } catch (e) {
        }
      }
      this.plugin.settings.gameLastHarvest = today;
      await this.plugin.saveSettings();
      this.pending = [];
      this.pendingXp = 0;
      new import_obsidian.Notice(`\u2713 ${fresh.length} salva(s) (+${totalXp} XP) \xB7 ${del} apagada(s)`);
      await this.plugin.todo.fetch(true);
    } catch (e) {
      new import_obsidian.Notice(`Falha ao salvar: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      this.busy = false;
      this.rerenderAll();
    }
  }
  // Conta quantas concluídas estão pendentes de salvar (live, sem apagar nada).
  async refreshPending() {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    try {
      await this.ensureLoaded();
      const completed = await fetchCompletedTasks(token, this.harvestSince(), this.harvestUntil());
      const keys = new Set(this.events.map((e) => e.key));
      this.pending = completed.filter((t) => {
        var _a;
        return !keys.has(`${t.id}|${(_a = t.completed_at) != null ? _a : ""}`);
      });
      this.pendingXp = this.pending.reduce((s, t) => s + xpForPriority(t.priority), 0);
      this.rerenderAll();
    } catch (e) {
    }
  }
  // Painel compartilhado: dashboard (faixa, ctrls sem colheita) e aba (full).
  renderPanel(host, ctrls, opts = {}) {
    const s = this.stats();
    const token = this.plugin.settings.todoistToken.trim();
    if (opts.full && ctrls && token) {
      const save = ctrls.createSpan({ cls: "wd-game-harvest" + (this.busy ? " wd-game-busy" : "") });
      (0, import_obsidian.setIcon)(save.createSpan({ cls: "wd-game-harvest-ico" }), "download");
      save.createSpan({ text: this.busy ? "Salvando\u2026" : "Salvar conclu\xEDdas" });
      if (this.pending.length) save.createSpan({ cls: "wd-game-pend", text: `+${this.pendingXp}` });
      save.setAttr("title", this.pending.length ? `${this.pending.length} conclu\xEDda(s) aguardando salvar (+${this.pendingXp} XP)` : "Buscar tarefas conclu\xEDdas, salvar no log e limpar do Todoist");
      if (!this.busy) clickable(save, () => void this.harvest());
    }
    const lvl = host.createDiv({ cls: "wd-game-level" });
    lvl.createSpan({ cls: "wd-game-lvlnum", text: `N\xEDvel ${s.level}` });
    lvl.createSpan({ cls: "wd-game-xp", text: `${s.totalXp} XP` });
    const bar = host.createDiv({ cls: "wd-game-bar" });
    const fill = bar.createDiv({ cls: "wd-game-bar-fill" });
    const pct = s.xpForNext ? Math.min(100, Math.round(s.xpIntoLevel / s.xpForNext * 100)) : 0;
    fill.style.width = `${s.level > this.lastLevel ? 0 : this.lastBarPct}%`;
    void fill.offsetWidth;
    fill.style.width = `${pct}%`;
    this.lastBarPct = pct;
    this.lastLevel = s.level;
    bar.setAttr("title", `${s.xpIntoLevel}/${s.xpForNext} XP para o n\xEDvel ${s.level + 1}`);
    host.createDiv({
      cls: "wd-game-next",
      text: `faltam ${Math.max(0, s.xpForNext - s.xpIntoLevel)} XP para o n\xEDvel ${s.level + 1}`
    });
    const grid = host.createDiv({ cls: "wd-game-metrics" });
    const metric = (icon, val, label, cls = "") => {
      const c = grid.createDiv({ cls: "wd-game-metric " + cls });
      const v = c.createDiv({ cls: "wd-game-metric-val" });
      (0, import_obsidian.setIcon)(v.createSpan({ cls: "wd-game-metric-ico" }), icon);
      v.createSpan({ text: val });
      c.createDiv({ cls: "wd-game-metric-lbl", text: label });
    };
    metric("flame", String(s.streakCurrent), `streak \xB7 recorde ${s.streakBest}`, s.streakCurrent ? "wd-game-streak-on" : "");
    metric("zap", `${s.todayXp >= 0 ? "+" : ""}${s.todayXp}`, `XP hoje \xB7 ${s.todayCount} feita(s)`);
    if (opts.full && this.pending.length)
      host.createDiv({ cls: "wd-game-hint", text: `${this.pending.length} conclu\xEDda(s) aguardando salvar (+${this.pendingXp} XP) \u2014 clique em "Salvar conclu\xEDdas".` });
    if (opts.full) this.renderXpChart(host, s, !!opts.phone);
    if (opts.full) this.renderScopeLevels(host, s);
  }
  // Níveis por escopo (projeto/etiqueta): top por XP, cada um com nível + mini-barra.
  // Reusa a barra de XP (`.wd-game-bar`) e `levelInfo(xp)`.
  renderScopeLevels(host, s) {
    const TOP = 8;
    const section = (title, data, prefix, renameEmpty, known) => {
      const top = [...data.entries()].filter(([, xp]) => xp > 0).sort((a, b) => b[1] - a[1]).slice(0, TOP);
      if (!top.length) return;
      const ready = known.size > 0;
      const sec = host.createDiv({ cls: "wd-game-scopesec" });
      sec.createDiv({ cls: "wd-game-chart-title", text: title });
      for (const [name, xp] of top) {
        const li = levelInfo(xp);
        const gone = ready && name !== "\u2014" && !known.has(name);
        const item = sec.createDiv({ cls: "wd-game-scope-item" });
        const head = item.createDiv({ cls: "wd-game-scope-head" });
        const left = head.createDiv({ cls: "wd-game-scope-left" });
        left.createSpan({
          cls: "wd-game-scope-name" + (gone ? " wd-dim" : ""),
          text: prefix + (renameEmpty && name === "\u2014" ? renameEmpty : name)
        });
        if (gone) {
          const g = left.createSpan({ cls: "wd-game-scope-gone" });
          (0, import_obsidian.setIcon)(g, "unlink");
          g.setAttr("title", "N\xE3o existe mais no Todoist");
        }
        head.createSpan({ cls: "wd-game-scope-meta", text: `Nv ${li.level} \xB7 ${xp} XP` });
        const bar = item.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
        bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${li.pct}%`;
        bar.setAttr("title", `${li.into}/${li.forNext} XP para o n\xEDvel ${li.level + 1}`);
      }
    };
    section("N\xEDveis por projeto", s.byProject, "", "Sem projeto", this.plugin.todo.knownProjects());
    section("N\xEDveis por etiqueta", s.byLabel, "@", void 0, this.plugin.todo.knownLabels());
  }
  // Gráfico de XP por dia (últimos N dias) — barras ou linha com pontos (settings.gameChartMode).
  renderXpChart(host, s, phone) {
    var _a, _b;
    const DAYS = phone ? 15 : 30;
    const mode = this.plugin.settings.gameChartMode;
    const todayKey = toKey(/* @__PURE__ */ new Date());
    const days = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const key = toKey(d);
      const [, m, day] = key.split("-");
      const agg = s.byDay.get(key);
      days.push({ key, xp: (_a = agg == null ? void 0 : agg.xp) != null ? _a : 0, count: (_b = agg == null ? void 0 : agg.count) != null ? _b : 0, label: `${day}/${m}` });
    }
    const sec = host.createDiv({ cls: "wd-game-chartsec" });
    const hd = sec.createDiv({ cls: "wd-game-charthd" });
    hd.createSpan({ cls: "wd-game-chart-title", text: `XP nos \xFAltimos ${DAYS} dias` });
    const ctrls = hd.createDiv({ cls: "wd-sec-ctrls" });
    const mkBtn = (m, label, title) => {
      const b = ctrls.createSpan({ cls: "wd-view-btn" + (mode === m ? " wd-view-active" : ""), text: label });
      b.setAttr("title", title);
      b.setAttr("aria-pressed", String(mode === m));
      clickable(b, async (e) => {
        e.stopPropagation();
        this.plugin.settings.gameChartMode = m;
        await this.plugin.saveSettings();
        this.rerenderAll();
      });
    };
    mkBtn("bars", "barras", "Gr\xE1fico de barras");
    mkBtn("line", "linha", "Linha com pontos");
    const tip = (d) => `${d.label}: ${d.xp >= 0 ? "+" : ""}${d.xp} XP \xB7 ${d.count} feita(s)`;
    if (mode === "line") {
      renderLineChart(sec, days.map((d) => ({ value: d.xp, label: d.label, isToday: d.key === todayKey, tip: tip(d) })));
      return;
    }
    const max = Math.max(...days.map((d) => Math.max(0, d.xp)), 1);
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    days.forEach(({ key, xp, count, label }, idx) => {
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const empty = xp <= 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (empty ? " wd-growth-bar-zero" : "") });
      bar.style.height = empty ? "3px" : `${Math.max(5, Math.round(xp / max * 100))}%`;
      bar.setAttr("title", tip({ xp, count, label }));
      const showLbl = idx === 0 || idx === DAYS - 1 || idx % 7 === 0;
      col.createDiv({ cls: "wd-growth-lbl", text: showLbl ? label : "" });
    });
  }
};
var PHONE_MAX = 600;
function isPhoneWidth(el) {
  const w = el.clientWidth;
  return import_obsidian.Platform.isPhone || w > 0 && w <= PHONE_MAX;
}
var WdView = class extends import_obsidian.ItemView {
  constructor() {
    super(...arguments);
    this.phone = false;
  }
  initPhoneWatch() {
    const ro = new ResizeObserver(() => {
      const p = isPhoneWidth(this.contentEl);
      if (p !== this.phone) {
        this.phone = p;
        this.rerender();
      }
    });
    ro.observe(this.contentEl);
    this.register(() => ro.disconnect());
  }
};
var DashboardView = class extends WdView {
  // path do conflito aguardando confirmação
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.weekOffset = 0;
    this.navPath = null;
    this.timer = null;
    this.tip = null;
    this.searchTerm = "";
    this.reviewFilter = false;
    this.growthCumulative = false;
    this.secHosts = /* @__PURE__ */ new Map();
    // wrapper estável por seção
    this.unsubTodo = null;
    // cancelar inscrição no controller
    this.unsubGame = null;
    // idem para a Gamificação
    // Estado do Syncthing (v0.10.0)
    this.syncData = null;
    this.syncLoading = false;
    this.syncError = null;
    this.syncFetchedAt = 0;
    this.conflictConfirm = null;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Dashboard";
  }
  getIcon() {
    return "layout-dashboard";
  }
  async onOpen() {
    await this.render();
    this.unsubTodo = this.plugin.todo.subscribe(() => this.renderSection("todoist"));
    this.unsubGame = this.plugin.game.subscribe(() => this.renderSection("game"));
    for (const ev of ["modify", "create", "delete", "rename"])
      this.registerEvent(this.app.vault.on(ev, () => {
        this.plugin.invalidateVaultCache();
        this.schedule();
      }));
    this.initPhoneWatch();
  }
  async onClose() {
    var _a, _b;
    (_a = this.unsubTodo) == null ? void 0 : _a.call(this);
    this.unsubTodo = null;
    (_b = this.unsubGame) == null ? void 0 : _b.call(this);
    this.unsubGame = null;
    this.hideTip();
    this.plugin.todo.hideTip();
  }
  // Re-render público — chamado pelo plugin quando a configuração muda na aba
  // de Configurações (ordem das seções, ocultar/mostrar, fontes da Semana).
  refresh() {
    void this.render();
  }
  rerender() {
    void this.render();
  }
  schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.render(), 400);
  }
  // Primeiro segmento de um caminho ("10.Projects/Foo/Bar" → "10.Projects").
  topFolderOf(path) {
    const i = path.indexOf("/");
    return i === -1 ? path : path.slice(0, i);
  }
  async render() {
    this.hideTip();
    this.plugin.todo.hideTip();
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root");
    this.phone = isPhoneWidth(this.contentEl);
    root.toggleClass("wd-phone", this.phone);
    root.toggleClass("wd-compact", this.plugin.settings.compact);
    this.renderHeader(root);
    this.secHosts.clear();
    for (const id of this.plugin.settings.sectionOrder) {
      const host = root.createDiv({ cls: "wd-sec-host" });
      this.secHosts.set(id, host);
      this.renderSection(id);
    }
  }
  // Re-renderiza apenas a seção `id` dentro do seu host (sem tocar nas outras).
  renderSection(id) {
    const host = this.secHosts.get(id);
    if (!host) return;
    host.empty();
    if (id === "calendar") this.renderCalendar(host);
    else if (id === "para") this.renderPara(host);
    else if (id === "heatmap") this.renderHeatmap(host);
    else if (id === "growth") this.renderGrowth(host);
    else if (id === "stats") this.renderStats(host);
    else if (id === "todoist") this.renderTodoist(host);
    else if (id === "sync") this.renderSync(host);
    else if (id === "game") this.renderGame(host);
  }
  // Faixa compacta de Gamificação no dashboard (painel completo fica na aba própria).
  renderGame(host) {
    if (!this.plugin.settings.gamificationEnabled || this.isHidden(SEC_GAME)) return;
    const sec = host.createDiv({ cls: "wd-section wd-game-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "GAMIFICA\xC7\xC3O" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const open = ctrls.createSpan({ cls: "wd-todo-openbtn" });
    (0, import_obsidian.setIcon)(open, "trophy");
    open.setAttr("title", "Abrir a aba de Gamifica\xE7\xE3o");
    clickable(open, (e) => {
      e.stopPropagation();
      void this.plugin.openGame();
    });
    this.plugin.game.renderPanel(sec, ctrls, { full: false, phone: this.phone });
  }
  // ── Ocultar (leitura) ─────────────────────────────────────────────────────
  // Mostrar/ocultar e a ordem das seções são administrados na aba de
  // Configurações do plugin. A view só *lê* `settings.hidden` para pular o que
  // está oculto. Ver WerusSettingTab.
  isHidden(key) {
    return this.plugin.settings.hidden.includes(key);
  }
  // ── Tooltip de notas recentes ─────────────────────────────────────────────
  showTip(target, files) {
    this.hideTip();
    const tip = document.body.createDiv({ cls: "wd-tooltip" });
    tip.createDiv({ cls: "wd-tip-title", text: "Modificadas recentemente" });
    for (const f of files) {
      const row = tip.createDiv({ cls: "wd-tip-row" });
      row.createSpan({ cls: "wd-tip-name", text: f.basename });
      row.createSpan({ cls: "wd-tip-date", text: fmtShort(f.stat.mtime) });
    }
    this.tip = tip;
    this.positionTip(tip, target);
  }
  // Posiciona um tooltip fixo abaixo do alvo (vira para cima se faltar espaço).
  positionTip(tip, target) {
    const rect = target.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    if (top + th > window.innerHeight - 8) top = rect.top - th - 6;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
  }
  // Tooltip listando as notas urgentes de uma pasta (hover no badge de aviso).
  showUrgencyTip(target, items) {
    this.hideTip();
    const tip = document.body.createDiv({ cls: "wd-tooltip wd-urgency-tip" });
    tip.createDiv({ cls: "wd-tip-title", text: "Urgente" });
    for (const it of items) {
      const row = tip.createDiv({ cls: "wd-tip-row" });
      const dot = row.createSpan({ cls: "wd-utip-dot" });
      dot.style.background = URGENCY_COLOR[it.level];
      row.createSpan({ cls: "wd-tip-name", text: it.file.basename });
      row.createSpan({ cls: "wd-tip-date", text: it.level });
    }
    this.tip = tip;
    this.positionTip(tip, target);
  }
  // Badge de aviso (triângulo) no card de pasta que contém notas com `urgency`.
  // Cor pelo nível máximo; hover lista os arquivos. Fase 10.
  urgencyBadge(card, urg) {
    if (!urg.max) return;
    const b = card.createSpan({ cls: `wd-urgency-badge wd-u-${urg.max}` });
    (0, import_obsidian.setIcon)(b, "triangle-alert");
    b.addEventListener("mouseenter", () => this.showUrgencyTip(b, urg.items));
    b.addEventListener("mouseleave", () => this.hideTip());
  }
  hideTip() {
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }
  attachTip(card, recents) {
    if (!recents.length) return;
    card.addEventListener("mouseenter", () => this.showTip(card, recents));
    card.addEventListener("mouseleave", () => this.hideTip());
  }
  // Subpastas exibíveis (ignora pastas só-de-imagens), via cache do cofre.
  subFoldersOf(folder) {
    const cache = this.plugin.getVaultCache();
    return folder.children.filter((c) => c instanceof import_obsidian.TFolder).filter((f) => {
      const a = cache.byFolder.get(f.path);
      return !(a && a.img > 0 && a.md === 0);
    }).sort((a, b) => a.name.localeCompare(b.name, "pt"));
  }
  // ── Calendário ──────────────────────────────────────────────────────────
  renderCalendar(root) {
    var _a, _b;
    if (this.isHidden(SEC_CAL)) return;
    const monday = mondayOf(this.weekOffset);
    const weekNum = isoWeekNumber(monday);
    const todayK = toKey(/* @__PURE__ */ new Date());
    const sources = this.plugin.settings.calendarSources.filter((s) => s.on);
    const colorFor = (path) => {
      let best = null;
      for (const s of sources) {
        if (path === `${s.path}.md` || path.startsWith(`${s.path}/`)) {
          if (!best || s.path.length > best.path.length) best = s;
        }
      }
      return best ? best.color : null;
    };
    const byDay = {};
    for (const { file, date } of this.plugin.getVaultCache().datedNotes) {
      const color = colorFor(file.path);
      if (!color) continue;
      ((_a = byDay[date]) != null ? _a : byDay[date] = []).push({ name: file.basename, file, color });
    }
    const sec = root.createDiv({ cls: "wd-section wd-cal-section" });
    const nav = sec.createDiv({ cls: "wd-cal-nav-bar" });
    const phone = this.phone;
    const dayAnchor = /* @__PURE__ */ new Date();
    dayAnchor.setDate(dayAnchor.getDate() - 1 + this.weekOffset * 3);
    const fmtDM = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (phone) {
      const last = new Date(dayAnchor);
      last.setDate(dayAnchor.getDate() + 2);
      nav.createSpan({ cls: "wd-cal-week-label", text: `${fmtDM(dayAnchor)} \u2013 ${fmtDM(last)}` });
    } else {
      nav.createSpan({ cls: "wd-cal-week-label", text: `Relat\xF3rios \xB7 semana ${weekNum}` });
    }
    const ctrls = nav.createDiv({ cls: "wd-cal-ctrls" });
    const prev = ctrls.createSpan({ cls: "wd-cal-arrow", text: "\u2039" });
    const next = ctrls.createSpan({ cls: "wd-cal-arrow", text: "\u203A" });
    prev.setAttr("title", "Semana anterior");
    next.setAttr("title", "Pr\xF3xima semana");
    clickable(prev, () => {
      this.weekOffset--;
      this.render();
    });
    clickable(next, () => {
      this.weekOffset++;
      this.render();
    });
    if (phone) {
      const list = sec.createDiv({ cls: "wd-cal-list" });
      for (let i = 0; i < 3; i++) {
        const day = new Date(dayAnchor);
        day.setDate(dayAnchor.getDate() + i);
        const key = toKey(day);
        const dow = (day.getDay() + 6) % 7;
        const note = this.findDailyNote(key);
        const row = list.createDiv({
          cls: ["wd-cal-drow", key === todayK ? "wd-today" : "", dow >= 5 ? "wd-weekend" : ""].filter(Boolean).join(" ")
        });
        row.setAttr("title", note ? "Abrir nota di\xE1ria" : "Criar nota di\xE1ria");
        const hd = row.createDiv({ cls: "wd-cal-drow-hd" });
        hd.createSpan({ cls: "wd-cal-name", text: DAY_SHORT[dow] });
        hd.createSpan({ cls: "wd-cal-num", text: String(day.getDate()) });
        const body = row.createDiv({ cls: "wd-cal-drow-notes" });
        if (note) {
          const pill = body.createDiv({ cls: "wd-cal-pill" });
          pill.textContent = note.basename.length > 24 ? note.basename.slice(0, 24) + "\u2026" : note.basename;
        } else {
          body.createSpan({ cls: "wd-cal-drow-empty", text: "criar nota di\xE1ria" });
        }
        clickable(row, () => void this.openDailyNote(key));
      }
      return;
    }
    const grid = sec.createDiv({ cls: "wd-cal-grid" });
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const key = toKey(day);
      const col = grid.createDiv({
        cls: ["wd-cal-col", key === todayK ? "wd-today" : "", i >= 5 ? "wd-weekend" : ""].filter(Boolean).join(" ")
      });
      const hd = col.createDiv({ cls: "wd-cal-hd" });
      hd.createDiv({ cls: "wd-cal-name", text: DAY_SHORT[i] });
      hd.createDiv({ cls: "wd-cal-num", text: String(day.getDate()) });
      hd.setAttr("title", "Abrir / criar nota di\xE1ria");
      clickable(hd, (e) => {
        e.stopPropagation();
        void this.openDailyNote(key);
      });
      const items = (_b = byDay[key]) != null ? _b : [];
      for (const it of items.slice(0, 3)) {
        const pill = col.createDiv({ cls: "wd-cal-pill" });
        pill.style.setProperty("--wd-src", it.color);
        pill.createSpan({ cls: "wd-cal-pill-dot" });
        pill.createSpan({ cls: "wd-cal-pill-txt", text: it.name.length > 14 ? it.name.slice(0, 14) + "\u2026" : it.name });
        pill.setAttr("title", it.name);
        clickable(pill, () => this.app.workspace.getLeaf(false).openFile(it.file));
      }
      if (items.length > 3) col.createDiv({ cls: "wd-cal-more", text: `+${items.length - 3}` });
    }
    const end = new Date(monday);
    end.setDate(monday.getDate() + 6);
    sec.createDiv({
      cls: "wd-cal-footer",
      text: monday.getMonth() === end.getMonth() ? `${MONTH_SHORT[monday.getMonth()]} ${monday.getFullYear()}` : `${MONTH_SHORT[monday.getMonth()]} \u2013 ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`
    });
  }
  // Acha a nota diária de `key` (YYYY-MM-DD): primeiro pelo caminho canônico em
  // 50.Diário/, senão qualquer nota cujo `date:` seja esse dia. Null se não houver.
  // (Relatório/nota diária é um por dia → abre o existente em vez de criar outro.)
  findDailyNote(key) {
    var _a, _b;
    const direct = this.app.vault.getAbstractFileByPath(`${DAILY_FOLDER}/${key}.md`);
    if (direct instanceof import_obsidian.TFile) return direct;
    return (_b = (_a = this.plugin.getVaultCache().datedNotes.find((n) => n.date === key)) == null ? void 0 : _a.file) != null ? _b : null;
  }
  // Abre a nota diária de `key`; cria em 50.Diário/ SÓ se não existir nenhuma.
  async openDailyNote(key) {
    const existing = this.findDailyNote(key);
    if (existing) {
      await this.app.workspace.getLeaf(false).openFile(existing);
      return;
    }
    if (!this.app.vault.getAbstractFileByPath(DAILY_FOLDER))
      await this.app.vault.createFolder(DAILY_FOLDER).catch(() => {
      });
    const [y, m, d] = key.split("-");
    const titulo = new Date(+y, +m - 1, +d).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const tpl = this.app.vault.getAbstractFileByPath(DAILY_TEMPLATE);
    let body;
    if (tpl instanceof import_obsidian.TFile) {
      body = (await this.app.vault.read(tpl)).replace(/\{\{\s*date\s*\}\}/g, key).replace(/\{\{\s*title\s*\}\}/g, titulo);
    } else {
      body = `---
owner: Werus
created: ${key}
date: ${key}
reviewed: true
type: daily
permissions:
  read: [all]
  write:
    - Werus
---

# ${titulo}

`;
    }
    const file = await this.app.vault.create(`${DAILY_FOLDER}/${key}.md`, body);
    if (file instanceof import_obsidian.TFile) await this.app.workspace.getLeaf(false).openFile(file);
  }
  // ── Cards do cofre (todas as pastas de topo) + navegador aninhado ──────────
  renderPara(root) {
    var _a;
    if (this.isHidden(SEC_PARA)) return;
    if (this.navPath && this.isHidden(this.topFolderOf(this.navPath))) this.navPath = null;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "COFRE" });
    const grid = sec.createDiv({ cls: "wd-para-grid" });
    const vaultRoot = this.app.vault.getRoot();
    const folders = vaultRoot.children.filter((c) => c instanceof import_obsidian.TFolder).filter((f) => !f.name.startsWith(".")).sort((a, b) => a.name.localeCompare(b.name, "pt"));
    const activeRoot = this.navPath ? this.topFolderOf(this.navPath) : null;
    const cache = this.plugin.getVaultCache();
    let idx = 0;
    for (const folder of folders) {
      if (this.isHidden(folder.path)) continue;
      const agg = (_a = cache.byFolder.get(folder.path)) != null ? _a : EMPTY_AGG;
      const meta = folderMeta(this.app, folder);
      const cover = coverInFolder(this.app, folder);
      const navigable = this.subFoldersOf(folder).length > 0 || filesIn(folder).length > 0;
      const isActive = activeRoot === folder.path;
      const card = grid.createDiv({ cls: "wd-card wd-para-card wd-anim-in" + (isActive ? " wd-active" : "") });
      card.style.setProperty("--accent", meta.accent);
      card.style.animationDelay = `${idx * 40}ms`;
      idx++;
      if (cover) {
        card.createDiv({ cls: "wd-cover" }).createEl("img", { attr: { src: cover, draggable: "false" } });
      } else {
        const dc = card.createDiv({ cls: "wd-cover wd-cover-default" });
        renderIcon(dc.createSpan({ cls: "wd-cover-glyph" }), meta.icon);
      }
      card.createDiv({ cls: "wd-accent-bar" }).style.background = meta.accent;
      this.urgencyBadge(card, { items: agg.urgency, max: agg.urgencyMax });
      const body = card.createDiv({ cls: "wd-card-body" });
      const top = body.createDiv({ cls: "wd-card-top" });
      renderIcon(top.createSpan({ cls: "wd-icon" }), meta.icon);
      top.createSpan({ cls: "wd-count", text: countText({ md: agg.md, img: agg.img }) });
      body.createDiv({ cls: "wd-label", text: meta.label });
      body.createDiv({ cls: "wd-folder", text: folder.path });
      if (navigable) body.createDiv({ cls: "wd-has-subs", text: isActive ? "fechar \u25BE" : "abrir \u203A" });
      if (agg.md > 0) {
        const bar = body.createDiv({ cls: "wd-progress" });
        bar.setAttr("title", `${agg.reviewed}/${agg.md} revisadas`);
        const fill = bar.createDiv({ cls: "wd-progress-fill" });
        fill.style.width = `${Math.round(agg.reviewed / agg.md * 100)}%`;
      }
      this.attachTip(card, agg.recent);
      clickable(card, () => {
        if (navigable) {
          this.navPath = isActive ? null : folder.path;
          this.searchTerm = "";
          this.render();
        } else revealInExplorer(this.app, folder);
      });
    }
    if (!idx) sec.createDiv({ cls: "wd-empty", text: "Nenhuma pasta vis\xEDvel." });
    const rootFiles = filesIn(vaultRoot);
    this.renderNotes(sec, rootFiles, "arquivos na raiz");
    if (this.navPath) {
      const folder = this.app.vault.getAbstractFileByPath(this.navPath);
      if (folder instanceof import_obsidian.TFolder) this.renderBrowser(sec, folder);
    }
  }
  // Painel inline navegável (breadcrumb + subpastas + notas da pasta atual)
  renderBrowser(parent, folder) {
    var _a;
    const rootPath = this.topFolderOf(folder.path);
    const rootFolder = this.app.vault.getAbstractFileByPath(rootPath);
    if (!(rootFolder instanceof import_obsidian.TFolder)) return;
    const meta = folderMeta(this.app, rootFolder);
    const panel = parent.createDiv({ cls: "wd-panel" });
    panel.style.setProperty("--accent", meta.accent);
    const crumb = panel.createDiv({ cls: "wd-crumb" });
    const rel = folder.path === rootPath ? [] : folder.path.slice(rootPath.length + 1).split("/");
    const rootSeg = crumb.createSpan({ cls: "wd-crumb-seg" + (rel.length === 0 ? " wd-crumb-cur" : "") });
    renderIcon(rootSeg.createSpan({ cls: "wd-crumb-icon" }), meta.icon);
    rootSeg.createSpan({ text: meta.label });
    if (rel.length) clickable(rootSeg, () => {
      this.navPath = rootPath;
      this.searchTerm = "";
      this.render();
    });
    let acc = rootPath;
    rel.forEach((part, i) => {
      crumb.createSpan({ cls: "wd-crumb-sep", text: "\u203A" });
      const isLast = i === rel.length - 1;
      acc = `${acc}/${part}`;
      const segPath = acc;
      const seg = crumb.createSpan({ cls: "wd-crumb-seg" + (isLast ? " wd-crumb-cur" : ""), text: part });
      if (!isLast) clickable(seg, () => {
        this.navPath = segPath;
        this.searchTerm = "";
        this.render();
      });
    });
    const close = crumb.createSpan({ cls: "wd-crumb-close", text: "\u2715" });
    close.setAttr("title", "Fechar");
    clickable(close, () => {
      this.navPath = null;
      this.render();
    });
    const searchWrap = panel.createDiv({ cls: "wd-search-wrap" });
    const searchInput = searchWrap.createEl("input", {
      cls: "wd-search",
      attr: { type: "text", placeholder: "filtrar\u2026", value: this.searchTerm }
    });
    searchInput.addEventListener("input", () => {
      this.searchTerm = searchInput.value;
      const term = this.searchTerm.toLowerCase();
      panel.querySelectorAll(".wd-sub-card").forEach((el) => {
        var _a2, _b, _c;
        const lbl = (_c = (_b = (_a2 = el.querySelector(".wd-label")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.toLowerCase()) != null ? _c : "";
        el.style.display = lbl.includes(term) ? "" : "none";
      });
      panel.querySelectorAll(".wd-note-row, .wd-note-card").forEach((el) => {
        var _a2, _b;
        const name = ((_b = (_a2 = el.querySelector(".wd-note-name, .wd-note-card-name")) == null ? void 0 : _a2.textContent) != null ? _b : "").toLowerCase();
        el.style.display = name.includes(term) ? "" : "none";
      });
    });
    const cache = this.plugin.getVaultCache();
    const subs = this.subFoldersOf(folder);
    if (subs.length) {
      const sgrid = panel.createDiv({ cls: "wd-proj-grid" });
      for (const sf of subs) {
        const agg = (_a = cache.byFolder.get(sf.path)) != null ? _a : EMPTY_AGG;
        const status = readFolderStatus(this.app, sf);
        const cover = coverInFolder(this.app, sf);
        const deeper = this.subFoldersOf(sf).length > 0;
        const customIcon = readFolderIcon(this.app, sf);
        const card = sgrid.createDiv({ cls: `wd-card wd-sub-card wd-s-${status}` });
        card.style.setProperty("--accent", meta.accent);
        if (cover) {
          card.createDiv({ cls: "wd-cover" }).createEl("img", { attr: { src: cover, draggable: "false" } });
        } else {
          const dc = card.createDiv({ cls: "wd-cover wd-cover-default wd-cover-sub" });
          renderIcon(dc.createSpan({ cls: "wd-cover-glyph" }), customIcon != null ? customIcon : "\u{1F4C1}");
        }
        card.createDiv({ cls: `wd-badge wd-badge-${status}`, text: STATUS_ICON[status] });
        this.urgencyBadge(card, { items: agg.urgency, max: agg.urgencyMax });
        const body = card.createDiv({ cls: "wd-card-body" });
        const top = body.createDiv({ cls: "wd-card-top" });
        if (customIcon) renderIcon(top.createSpan({ cls: "wd-icon wd-sub-icon" }), customIcon);
        top.createSpan({ cls: "wd-count", text: countText({ md: agg.md, img: agg.img }) });
        if (deeper) top.createSpan({ cls: "wd-sub-arrow", text: "\u203A" });
        const label = body.createDiv({ cls: "wd-label", text: sf.name });
        if (status === "cancelled") label.addClass("wd-strike");
        if (status !== "cancelled" && agg.md > 0) {
          const bar = body.createDiv({ cls: "wd-progress" });
          bar.setAttr("title", `${agg.reviewed}/${agg.md} revisadas`);
          const fill = bar.createDiv({ cls: "wd-progress-fill" });
          fill.style.width = `${Math.round(agg.reviewed / agg.md * 100)}%`;
        }
        if (status === "cancelled") {
          card.style.cursor = "default";
        } else {
          this.attachTip(card, agg.recent);
          clickable(card, () => {
            this.navPath = sf.path;
            this.searchTerm = "";
            this.render();
          });
        }
      }
    }
    const notes = filesIn(folder);
    this.renderNotes(panel, notes);
    if (!subs.length && !notes.length)
      panel.createDiv({ cls: "wd-empty", text: "Pasta vazia." });
  }
  // ── Heatmap (via plugin Heatmap Calendar) ─────────────────────────────────
  renderHeatmap(root) {
    if (this.isHidden(SEC_HEAT)) return;
    if (this.phone) return;
    const sec = root.createDiv({ cls: "wd-section wd-heat-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "ATIVIDADE DO COFRE" });
    const render = getHeatmapRenderer();
    if (!render) {
      sec.createDiv({ cls: "wd-empty", text: 'Ative o plugin "Heatmap Calendar" para ver a atividade.' });
      return;
    }
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const prefix = String(year);
    const entries = [];
    for (const [date, n] of this.plugin.getVaultCache().ctimeByDay) {
      if (!date.startsWith(prefix)) continue;
      entries.push({ date, intensity: n, color: "green", content: `${n} nota(s)` });
    }
    const box = sec.createDiv({ cls: "wd-heat-box" });
    try {
      render(box, {
        year,
        colors: { green: ["#1e3a2f", "#1f6f43", "#2ba85a", "#39d353"] },
        showCurrentDayBorder: true,
        entries
      });
    } catch (e) {
      sec.empty();
      sec.createDiv({ cls: "wd-empty", text: "Falha ao renderizar o heatmap." });
    }
  }
  // ── Estatísticas do cofre ─────────────────────────────────────────────────
  renderStats(root) {
    var _a, _b;
    if (this.isHidden(SEC_STAT)) return;
    const cache = this.plugin.getVaultCache();
    const totalNotes = cache.totalNotes;
    const totalReviewed = cache.totalReviewed;
    let createdThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      createdThisWeek += (_a = cache.ctimeByDay.get(toKey(d))) != null ? _a : 0;
    }
    const globalPct = totalNotes > 0 ? Math.round(totalReviewed / totalNotes * 100) : 0;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "ESTAT\xCDSTICAS" });
    const glob = sec.createDiv({ cls: "wd-stat-global" });
    glob.createSpan({ cls: "wd-stat-big", text: String(totalNotes) });
    glob.createSpan({ cls: "wd-stat-mid", text: "notas" });
    glob.createSpan({ cls: "wd-stat-sep", text: "\xB7" });
    glob.createSpan({ cls: "wd-stat-big wd-stat-rev-num", text: `${globalPct}%` });
    glob.createSpan({ cls: "wd-stat-mid", text: "revisadas" });
    glob.createSpan({ cls: "wd-stat-sep", text: "\xB7" });
    glob.createSpan({ cls: "wd-stat-week", text: `+${createdThisWeek}` });
    glob.createSpan({ cls: "wd-stat-mid", text: "esta semana" });
    const table = sec.createDiv({ cls: "wd-stat-table" });
    const vaultRoot = this.app.vault.getRoot();
    const folders = vaultRoot.children.filter((c) => c instanceof import_obsidian.TFolder).filter((f) => !f.name.startsWith(".")).sort((a, b) => a.name.localeCompare(b.name, "pt"));
    for (const folder of folders) {
      if (this.isHidden(folder.path)) continue;
      const agg = (_b = cache.byFolder.get(folder.path)) != null ? _b : EMPTY_AGG;
      if (agg.md === 0) continue;
      const meta = folderMeta(this.app, folder);
      const pct = Math.round(agg.reviewed / agg.md * 100);
      const row = table.createDiv({ cls: "wd-stat-row" });
      row.style.setProperty("--accent", meta.accent);
      const nameEl = row.createDiv({ cls: "wd-stat-folder" });
      renderIcon(nameEl.createSpan({ cls: "wd-stat-icon" }), meta.icon);
      nameEl.createSpan({ text: meta.label });
      row.createDiv({ cls: "wd-stat-count", text: `${agg.md}` });
      const barWrap = row.createDiv({ cls: "wd-stat-bar" });
      barWrap.setAttr("title", `${agg.reviewed}/${agg.md} revisadas (${pct}%)`);
      const fill = barWrap.createDiv({ cls: "wd-stat-bar-fill" });
      fill.style.width = `${pct}%`;
      row.createDiv({ cls: "wd-stat-pct", text: `${pct}%` });
    }
  }
  // ── Lista / grade de notas com toggle e indicador reviewed ───────────────
  renderNotes(parent, notes, label = "") {
    var _a, _b, _c, _d;
    if (!notes.length) return;
    const isGrid = this.plugin.settings.noteView === "grid";
    const filtered = this.reviewFilter ? notes.filter((f) => {
      var _a2, _b2;
      return ((_b2 = (_a2 = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _a2.frontmatter) == null ? void 0 : _b2.reviewed) !== true;
    }) : notes;
    const hdr = parent.createDiv({ cls: "wd-notes-hdr" });
    const countTxt = this.reviewFilter ? `${filtered.length} pendente${filtered.length !== 1 ? "s" : ""} / ${notes.length}` : label || `${notes.length} nota${notes.length !== 1 ? "s" : ""}`;
    hdr.createSpan({ cls: "wd-notes-label", text: countTxt });
    const tog = hdr.createDiv({ cls: "wd-view-toggle" });
    const btnPend = tog.createSpan({ cls: "wd-view-btn" + (this.reviewFilter ? " wd-view-active wd-view-pend" : ""), text: "\u25CB" });
    btnPend.setAttr("title", "Mostrar s\xF3 pendentes (n\xE3o revisadas)");
    btnPend.setAttr("aria-pressed", String(this.reviewFilter));
    clickable(btnPend, (e) => {
      e.stopPropagation();
      this.reviewFilter = !this.reviewFilter;
      this.render();
    });
    const btnL = tog.createSpan({ cls: "wd-view-btn" + (!isGrid ? " wd-view-active" : ""), text: "\u2261" });
    btnL.setAttr("title", "Lista");
    btnL.setAttr("aria-pressed", String(!isGrid));
    clickable(btnL, async (e) => {
      e.stopPropagation();
      this.plugin.settings.noteView = "list";
      await this.plugin.saveSettings();
      this.render();
    });
    const btnG = tog.createSpan({ cls: "wd-view-btn" + (isGrid ? " wd-view-active" : ""), text: "\u229E" });
    btnG.setAttr("title", "Colunas");
    btnG.setAttr("aria-pressed", String(isGrid));
    clickable(btnG, async (e) => {
      e.stopPropagation();
      this.plugin.settings.noteView = "grid";
      await this.plugin.saveSettings();
      this.render();
    });
    if (!filtered.length) {
      parent.createDiv({ cls: "wd-empty", text: this.reviewFilter ? "Nenhuma nota pendente nesta pasta." : "Nenhuma nota." });
      return;
    }
    if (isGrid) {
      const grid = parent.createDiv({ cls: "wd-notes-grid" });
      for (const f of filtered) {
        const isMd = f.extension === "md";
        const st = isMd ? readNoteStatus(this.app, f) : "progress";
        const rv = isMd && ((_b = (_a = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.reviewed) === true;
        const urg = isMd ? readNoteUrgency(this.app, f) : null;
        const card = grid.createDiv({ cls: `wd-note-card wd-s-${st}` });
        const cov = card.createDiv({ cls: `wd-note-cover wd-file-${f.extension}` });
        (0, import_obsidian.setIcon)(cov.createSpan({ cls: "wd-note-cover-glyph" }), fileGlyph(f.extension));
        if (isMd) card.createDiv({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "N\xE3o revisada");
        if (urg) {
          const w = card.createSpan({ cls: `wd-urgency-mark wd-u-${urg}` });
          (0, import_obsidian.setIcon)(w, "triangle-alert");
          w.setAttr("title", `Urg\xEAncia: ${urg}`);
        }
        const name = card.createDiv({ cls: "wd-note-card-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        card.createDiv({ cls: "wd-note-card-date", text: fmtShort(f.stat.mtime) });
        if (st !== "cancelled") clickable(card, () => this.app.workspace.getLeaf(false).openFile(f));
      }
    } else {
      const list = parent.createDiv({ cls: "wd-note-list" });
      for (const f of filtered) {
        const isMd = f.extension === "md";
        const st = isMd ? readNoteStatus(this.app, f) : "progress";
        const rv = isMd && ((_d = (_c = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _c.frontmatter) == null ? void 0 : _d.reviewed) === true;
        const urg = isMd ? readNoteUrgency(this.app, f) : null;
        const row = list.createDiv({ cls: `wd-note-row wd-s-${st}` });
        const ti = row.createSpan({ cls: `wd-note-typeicon wd-file-${f.extension}` });
        (0, import_obsidian.setIcon)(ti, fileGlyph(f.extension));
        if (isMd) row.createSpan({ cls: `wd-note-dot wd-badge-${st}` });
        const name = row.createSpan({ cls: "wd-note-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        if (urg) {
          const w = row.createSpan({ cls: `wd-urgency-mark wd-u-${urg}` });
          (0, import_obsidian.setIcon)(w, "triangle-alert");
          w.setAttr("title", `Urg\xEAncia: ${urg}`);
        }
        if (isMd) row.createSpan({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "N\xE3o revisada");
        if (st !== "cancelled") clickable(row, () => this.app.workspace.getLeaf(false).openFile(f));
      }
    }
  }
  // ── Gráfico de crescimento ────────────────────────────────────────────────
  renderGrowth(root) {
    var _a;
    if (this.isHidden(SEC_GROW)) return;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "CRESCIMENTO DO COFRE" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const btnDay = ctrls.createSpan({ cls: "wd-view-btn" + (!this.growthCumulative ? " wd-view-active" : ""), text: "dia" });
    btnDay.setAttr("title", "Notas criadas por dia");
    btnDay.setAttr("aria-pressed", String(!this.growthCumulative));
    clickable(btnDay, (e) => {
      e.stopPropagation();
      this.growthCumulative = false;
      this.render();
    });
    const btnCum = ctrls.createSpan({ cls: "wd-view-btn" + (this.growthCumulative ? " wd-view-active" : ""), text: "total" });
    btnCum.setAttr("title", "Total acumulado no per\xEDodo");
    btnCum.setAttr("aria-pressed", String(this.growthCumulative));
    clickable(btnCum, (e) => {
      e.stopPropagation();
      this.growthCumulative = true;
      this.render();
    });
    const cm = this.plugin.settings.growthChartMode;
    const mkChartBtn = (m, label, title) => {
      const b = ctrls.createSpan({ cls: "wd-view-btn" + (cm === m ? " wd-view-active" : ""), text: label });
      b.setAttr("title", title);
      b.setAttr("aria-pressed", String(cm === m));
      clickable(b, async (e) => {
        e.stopPropagation();
        this.plugin.settings.growthChartMode = m;
        await this.plugin.saveSettings();
        this.render();
      });
    };
    mkChartBtn("bars", "barras", "Gr\xE1fico de barras");
    mkChartBtn("line", "linha", "Linha com pontos");
    const counts = this.plugin.getVaultCache().ctimeByDay;
    const DAYS = this.phone ? 15 : 30;
    const days = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const key = toKey(d);
      const [, m, day] = key.split("-");
      days.push({ key, count: (_a = counts.get(key)) != null ? _a : 0, label: `${day}/${m}` });
    }
    const total = days.reduce((s, d) => s + d.count, 0);
    const todayKey = toKey(/* @__PURE__ */ new Date());
    let entries;
    if (this.growthCumulative) {
      let acc = 0;
      entries = days.map((d) => {
        acc += d.count;
        return { ...d, displayVal: acc };
      });
    } else {
      entries = days.map((d) => ({ ...d, displayVal: d.count }));
    }
    const max = Math.max(...entries.map((e) => e.displayVal), 1);
    const info = sec.createDiv({ cls: "wd-growth-info" });
    info.createSpan({ cls: "wd-growth-total", text: `${this.growthCumulative ? entries[entries.length - 1].displayVal : total}` });
    info.createSpan({ cls: "wd-growth-period", text: this.growthCumulative ? `notas acumuladas (${DAYS} dias)` : `notas criadas nos \xFAltimos ${DAYS} dias` });
    const tipFor = (e) => `${e.label}: ${this.growthCumulative ? e.displayVal + " total" : e.count + " nota(s)"}`;
    if (this.plugin.settings.growthChartMode === "line") {
      renderLineChart(sec, entries.map((e) => ({ value: e.displayVal, label: e.label, isToday: e.key === todayKey, tip: tipFor(e) })));
      return;
    }
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    entries.forEach((e, idx) => {
      const { key, label, displayVal } = e;
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const isEmpty = displayVal === 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (isEmpty ? " wd-growth-bar-zero" : "") });
      bar.style.height = isEmpty ? "3px" : `${Math.max(5, Math.round(displayVal / max * 100))}%`;
      if (!isEmpty) bar.setAttr("title", tipFor(e));
      const showLbl = idx === 0 || idx === 7 || idx === 14 || idx === 21 || idx === 29 || key === todayKey;
      col.createDiv({ cls: "wd-growth-lbl", text: showLbl ? label : "" });
    });
  }
  // ── Todoist (delegado ao TodoistController compartilhado) ──────────────────
  renderTodoist(root) {
    if (this.isHidden(SEC_TODO)) return;
    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const open = ctrls.createSpan({ cls: "wd-todo-openbtn" });
    (0, import_obsidian.setIcon)(open, "square-arrow-out-up-right");
    open.setAttr("title", "Abrir a aba do Todoist");
    clickable(open, (e) => {
      e.stopPropagation();
      void this.plugin.openTodoist();
    });
    this.plugin.todo.renderPackages(sec);
    this.plugin.todo.renderList(sec, ctrls, { showLater: false });
  }
  // ── Sincronização (Syncthing + conflitos) — v0.10.0 ───────────────────────
  resetSync() {
    this.syncData = null;
    this.syncFetchedAt = 0;
    this.syncError = null;
    this.syncLoading = false;
    this.renderSection("sync");
  }
  async fetchSync(manual) {
    var _a, _b, _c;
    const base = this.plugin.settings.syncthingUrl.trim();
    const key = this.plugin.settings.syncthingApiKey.trim();
    if (!base || !key || this.syncLoading) return;
    this.syncLoading = true;
    this.syncError = null;
    if (manual) this.renderSection("sync");
    try {
      const folders = await stGet(base, key, "/rest/config/folders");
      const wanted = this.plugin.settings.syncthingFolderId.trim();
      const folder = (_a = folders.find((f) => f.id === wanted)) != null ? _a : folders[0];
      if (!folder) throw new Error("nenhuma pasta configurada no Syncthing");
      const fid = encodeURIComponent(folder.id);
      const [devices, conns, status, stats, sys] = await Promise.all([
        stGet(base, key, "/rest/config/devices"),
        stGet(base, key, "/rest/system/connections"),
        stGet(base, key, `/rest/db/status?folder=${fid}`),
        stGet(base, key, "/rest/stats/device").catch(() => ({})),
        stGet(base, key, "/rest/system/status")
      ]);
      const remote = devices.filter((d) => d.deviceID !== sys.myID);
      const rows = await Promise.all(remote.map(async (d) => {
        var _a2, _b2, _c2, _d, _e;
        const c = await stGet(base, key, `/rest/db/completion?folder=${fid}&device=${d.deviceID}`).catch(() => ({ completion: 0, globalItems: 0, needItems: 0, needBytes: 0, needDeletes: 0 }));
        return {
          name: d.name || d.deviceID.slice(0, 7),
          online: !!((_a2 = conns.connections[d.deviceID]) == null ? void 0 : _a2.connected),
          completion: c.completion,
          globalItems: (_b2 = c.globalItems) != null ? _b2 : 0,
          needItems: (_c2 = c.needItems) != null ? _c2 : 0,
          needBytes: c.needBytes,
          needDeletes: c.needDeletes,
          lastSeen: (_e = (_d = stats[d.deviceID]) == null ? void 0 : _d.lastSeen) != null ? _e : ""
        };
      }));
      this.syncData = {
        state: status.state,
        needFiles: status.needFiles,
        needBytes: status.needBytes,
        folderLabel: folder.label || folder.id,
        errors: ((_b = status.errors) != null ? _b : 0) + ((_c = status.pullErrors) != null ? _c : 0),
        devices: rows
      };
      this.syncFetchedAt = Date.now();
    } catch (e) {
      this.syncError = e instanceof Error ? e.message : String(e);
    } finally {
      this.syncLoading = false;
      this.renderSection("sync");
    }
  }
  renderSync(root) {
    if (this.isHidden(SEC_SYNC)) return;
    const sec = root.createDiv({ cls: "wd-section wd-sync-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "SINCRONIZA\xC7\xC3O" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const key = this.plugin.settings.syncthingApiKey.trim();
    if (key) {
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.syncLoading ? " wd-spin" : "") });
      (0, import_obsidian.setIcon)(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar estado do Syncthing");
      clickable(refresh, (e) => {
        e.stopPropagation();
        void this.fetchSync(true);
      });
    }
    if (!key) {
      sec.createDiv({ cls: "wd-empty", text: "Configure a URL e a API key do Syncthing em Configura\xE7\xF5es \u2192 Werus Dashboard." });
    } else if (this.syncError) {
      sec.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao falar com o Syncthing: ${this.syncError}` });
    } else if (!this.syncFetchedAt) {
      if (!this.syncLoading) void this.fetchSync(false);
      sec.createDiv({ cls: "wd-empty", text: "Carregando\u2026" });
    } else {
      this.renderSyncBody(sec, this.syncData);
    }
    this.renderConflicts(sec);
  }
  renderSyncBody(sec, d) {
    const box = sec.createDiv({ cls: "wd-sync-box" });
    const busy = d.state === "syncing" || d.state === "scanning";
    const fl = box.createDiv({ cls: "wd-sync-folder" });
    const dot = fl.createSpan({ cls: "wd-sync-dot " + (d.errors ? "wd-s-err" : busy ? "wd-s-busy" : "wd-s-ok") });
    dot.setText(d.errors ? "\u26A0" : busy ? "\u27F3" : "\u25CF");
    fl.createSpan({ cls: "wd-sync-fname", text: d.folderLabel });
    const st = d.state === "idle" ? "em dia" : d.state === "syncing" ? `sincronizando \u2014 ${d.needFiles} itens (${humanBytes(d.needBytes)})` : d.state;
    fl.createSpan({ cls: "wd-sync-fstate", text: st });
    for (const dev of d.devices) {
      const row = box.createDiv({ cls: "wd-sync-dev" });
      const o = row.createSpan({ cls: "wd-sync-dot " + (dev.online ? "wd-s-ok" : "wd-s-off") });
      o.setText("\u25CF");
      row.createSpan({ cls: "wd-sync-dname", text: dev.name });
      row.createSpan({ cls: "wd-sync-dcomp", text: `${Math.round(dev.completion)}%` });
      if (this.plugin.settings.syncthingShowCounts && dev.globalItems)
        row.createSpan({ cls: "wd-sync-dcount", text: `${dev.globalItems - dev.needItems}/${dev.globalItems}` });
      const extra = dev.needDeletes ? `${dev.needDeletes} exclus\xF5es` : dev.needBytes ? humanBytes(dev.needBytes) : "";
      if (extra) row.createSpan({ cls: "wd-sync-dpend", text: extra });
      row.createSpan({ cls: "wd-sync-dseen", text: dev.online ? "online" : relTime(dev.lastSeen) });
    }
    if (d.errors) box.createDiv({ cls: "wd-sync-errline", text: `\u26A0 ${d.errors} erro(s) na pasta` });
  }
  // Lista de cópias de conflito do Syncthing (abrir / apagar com confirmação).
  renderConflicts(sec) {
    const conflicts = this.app.vault.getFiles().filter((f) => f.name.includes(".sync-conflict-"));
    const wrap = sec.createDiv({ cls: "wd-sync-conflicts" });
    wrap.createDiv({ cls: "wd-sync-sub", text: `Conflitos (${conflicts.length})` });
    if (!conflicts.length) {
      wrap.createDiv({ cls: "wd-sync-noconf", text: "Nenhum conflito. \u{1F389}" });
      return;
    }
    for (const f of conflicts) {
      const row = wrap.createDiv({ cls: "wd-sync-crow" });
      const name = row.createSpan({ cls: "wd-sync-cname", text: f.name });
      name.setAttr("title", "Abrir " + f.path);
      clickable(name, () => this.app.workspace.getLeaf(false).openFile(f));
      if (this.conflictConfirm === f.path) {
        const yes = row.createSpan({ cls: "wd-sync-cyes", text: "apagar?" });
        clickable(yes, async () => {
          await this.app.vault.trash(f, false);
          this.conflictConfirm = null;
          this.renderSection("sync");
        });
        const no = row.createSpan({ cls: "wd-sync-cno", text: "cancelar" });
        clickable(no, () => {
          this.conflictConfirm = null;
          this.renderSection("sync");
        });
      } else {
        const del = row.createSpan({ cls: "wd-sync-cdel" });
        (0, import_obsidian.setIcon)(del, "trash-2");
        del.setAttr("title", "Apagar c\xF3pia de conflito (vai para a lixeira)");
        clickable(del, () => {
          this.conflictConfirm = f.path;
          this.renderSection("sync");
        });
      }
    }
  }
  // ── Header ──────────────────────────────────────────────────────────────────
  renderHeader(root) {
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Second Brain" });
  }
};
var WerusDashboard = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    // Cache do cofre (§3): montado 1x por ciclo, invalidado nos eventos do vault.
    this.vaultCache = null;
  }
  // Agregados do cofre (uma passada), reusados por todas as seções no render.
  getVaultCache() {
    if (!this.vaultCache) this.vaultCache = buildVaultCache(this.app);
    return this.vaultCache;
  }
  invalidateVaultCache() {
    this.vaultCache = null;
  }
  async onload() {
    await this.loadSettings();
    this.todo = new TodoistController(this.app, this, this);
    this.game = new GameController(this.app, this);
    this.registerInterval(window.setInterval(() => this.todo.maybeRefresh(), 6e4));
    this.registerView(VIEW_TYPE, (leaf) => new DashboardView(leaf, this));
    this.registerView(TODOIST_VIEW_TYPE, (leaf) => new TodoistView(leaf, this));
    this.registerView(GAME_VIEW_TYPE, (leaf) => new GamificationView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "Abrir Werus Dashboard", () => this.open());
    this.addRibbonIcon("list-checks", "Abrir Todoist (Werus)", () => this.openTodoist());
    this.addRibbonIcon("trophy", "Abrir Gamifica\xE7\xE3o (Werus)", () => this.openGame());
    this.addCommand({ id: "open-dashboard", name: "Abrir Dashboard", callback: () => this.open() });
    this.addCommand({ id: "open-todoist", name: "Abrir Todoist", callback: () => this.openTodoist() });
    this.addCommand({ id: "open-game", name: "Abrir Gamifica\xE7\xE3o", callback: () => this.openGame() });
    this.addSettingTab(new WerusSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      this.game.invalidate();
      void this.game.ensureLoaded().then(() => this.game.rerenderAll());
    });
    this.registerEvent(this.app.vault.on("modify", (f) => {
      if (f.path === GAME_LOG_PATH) {
        this.game.invalidate();
        void this.game.ensureLoaded().then(() => this.game.rerenderAll());
      }
    }));
  }
  // Todas as views (dashboard + aba Todoist) abertas, que têm controlador Todoist.
  todoViews() {
    const out = [];
    for (const t of [VIEW_TYPE, TODOIST_VIEW_TYPE])
      for (const leaf of this.app.workspace.getLeavesOfType(t)) {
        const v = leaf.view;
        if (v instanceof DashboardView || v instanceof TodoistView) out.push(v);
      }
    return out;
  }
  // Re-busca o Todoist (controller único → notifica todas as views inscritas).
  refreshDashboards() {
    this.todo.reset();
  }
  // Reseta o estado do Syncthing nas dashboards (ex.: token/URL alterados).
  refreshSync() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof DashboardView) v.resetSync();
    }
  }
  // Re-renderiza todas as views abertas (após mudar config na aba de
  // Configurações: ordem das seções, ocultar/mostrar, fontes, pacotes).
  rerenderDashboards() {
    for (const v of this.todoViews()) v.refresh();
  }
  // Mostra/oculta uma seção ("sec:<id>") ou pasta (caminho) por chave em `hidden`.
  async setHidden(key, hidden) {
    const has = this.settings.hidden.includes(key);
    if (hidden && !has) this.settings.hidden.push(key);
    else if (!hidden && has) this.settings.hidden = this.settings.hidden.filter((k) => k !== key);
    else return;
    await this.saveSettings();
    this.rerenderDashboards();
  }
  // Reordena uma seção em sectionOrder (dir = -1 sobe, +1 desce).
  async moveSection(id, dir) {
    const order = [...this.settings.sectionOrder];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this.settings.sectionOrder = order;
    await this.saveSettings();
    this.rerenderDashboards();
  }
  async movePackage(index, dir) {
    const arr = this.settings.taskPackages;
    const j = index + dir;
    if (index < 0 || j < 0 || j >= arr.length) return;
    [arr[index], arr[j]] = [arr[j], arr[index]];
    await this.saveSettings();
    this.rerenderDashboards();
  }
  async loadSettings() {
    var _a, _b, _c;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    let needStMigration = false;
    const valid = ["stats", "game", "todoist", "para", "sync", "heatmap", "growth", "calendar"];
    const seen = /* @__PURE__ */ new Set();
    const cleaned = (this.settings.sectionOrder || []).filter(
      (s) => valid.includes(s) && !seen.has(s) && (seen.add(s), true)
    );
    for (const v of valid) if (!seen.has(v)) cleaned.push(v);
    this.settings.sectionOrder = cleaned;
    if (!Array.isArray(this.settings.hidden)) this.settings.hidden = [];
    const cs = this.settings.calendarSources;
    this.settings.calendarSources = Array.isArray(cs) && cs.length ? cs.filter((s) => s && typeof s.path === "string").map((s) => ({ path: s.path, color: typeof s.color === "string" ? s.color : ACCENTS[0], on: s.on !== false })) : DEFAULT_SETTINGS.calendarSources.map((s) => ({ ...s }));
    this.settings.todoistDayRange = this.settings.todoistDayRange === 3 ? 3 : 7;
    const tf = this.settings.todoistFilters;
    this.settings.todoistFilters = {
      projects: Array.isArray(tf == null ? void 0 : tf.projects) ? tf.projects : [],
      labels: Array.isArray(tf == null ? void 0 : tf.labels) ? tf.labels : []
    };
    this.settings.todoistShowProject = this.settings.todoistShowProject !== false;
    this.settings.todoistShowLabels = this.settings.todoistShowLabels === true;
    const lsGet = (k) => {
      const v = this.app.loadLocalStorage(k);
      return typeof v === "string" ? v : null;
    };
    const dataUrl = typeof this.settings.syncthingUrl === "string" && this.settings.syncthingUrl.trim() ? this.settings.syncthingUrl : "http://127.0.0.1:8384";
    const dataKey = typeof this.settings.syncthingApiKey === "string" ? this.settings.syncthingApiKey : "";
    const dataFolder = typeof this.settings.syncthingFolderId === "string" ? this.settings.syncthingFolderId : "";
    needStMigration = lsGet(LS_ST_URL) === null && lsGet(LS_ST_KEY) === null && lsGet(LS_ST_FOLDER) === null;
    this.settings.syncthingUrl = (_a = lsGet(LS_ST_URL)) != null ? _a : dataUrl;
    this.settings.syncthingApiKey = (_b = lsGet(LS_ST_KEY)) != null ? _b : dataKey;
    this.settings.syncthingFolderId = (_c = lsGet(LS_ST_FOLDER)) != null ? _c : dataFolder;
    this.settings.syncthingShowCounts = this.settings.syncthingShowCounts === true;
    const tp = this.settings.taskPackages;
    this.settings.taskPackages = Array.isArray(tp) ? tp.filter((p) => p && typeof p.id === "string").map((p) => ({
      id: p.id,
      name: typeof p.name === "string" ? p.name : "",
      icon: typeof p.icon === "string" && p.icon.trim() ? p.icon : void 0,
      tasks: Array.isArray(p.tasks) ? p.tasks.filter((x) => typeof x === "string") : [],
      projectId: typeof p.projectId === "string" && p.projectId ? p.projectId : void 0,
      labels: Array.isArray(p.labels) ? p.labels.filter((x) => typeof x === "string") : void 0
    })) : [];
    this.settings.packageConfirm = ["always", "many", "never"].includes(this.settings.packageConfirm) ? this.settings.packageConfirm : "many";
    this.settings.gamificationEnabled = this.settings.gamificationEnabled !== false;
    const pf = Number(this.settings.gamePenaltyFactor);
    this.settings.gamePenaltyFactor = Number.isFinite(pf) && pf > 0 ? pf : 1.5;
    this.settings.gameLastHarvest = typeof this.settings.gameLastHarvest === "string" ? this.settings.gameLastHarvest : "";
    this.settings.gameChartMode = this.settings.gameChartMode === "line" ? "line" : "bars";
    this.settings.growthChartMode = this.settings.growthChartMode === "line" ? "line" : "bars";
    if (needStMigration) await this.saveSettings();
  }
  async saveSettings() {
    this.app.saveLocalStorage(LS_ST_URL, this.settings.syncthingUrl);
    this.app.saveLocalStorage(LS_ST_KEY, this.settings.syncthingApiKey);
    this.app.saveLocalStorage(LS_ST_FOLDER, this.settings.syncthingFolderId);
    const shared = { ...this.settings };
    delete shared.syncthingUrl;
    delete shared.syncthingApiKey;
    delete shared.syncthingFolderId;
    await this.saveData(shared);
  }
  async open() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
  async openTodoist() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(TODOIST_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf(false);
      await leaf.setViewState({ type: TODOIST_VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
  async openGame() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(GAME_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf(false);
      await leaf.setViewState({ type: GAME_VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
  onunload() {
    var _a;
    (_a = this.todo) == null ? void 0 : _a.hideTip();
    document.querySelectorAll(".wd-tooltip, .wd-pop").forEach((e) => e.remove());
  }
};
var TodoistView = class extends WdView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.unsubTodo = null;
  }
  getViewType() {
    return TODOIST_VIEW_TYPE;
  }
  getDisplayText() {
    return "Todoist";
  }
  getIcon() {
    return "list-checks";
  }
  async onOpen() {
    this.refresh();
    this.unsubTodo = this.plugin.todo.subscribe(() => this.refresh());
    this.initPhoneWatch();
  }
  async onClose() {
    var _a;
    (_a = this.unsubTodo) == null ? void 0 : _a.call(this);
    this.unsubTodo = null;
    this.plugin.todo.hideTip();
  }
  rerender() {
    this.refresh();
  }
  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-todoist-view");
    this.phone = isPhoneWidth(this.contentEl);
    root.toggleClass("wd-phone", this.phone);
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Todoist" });
    this.plugin.todo.renderPackages(root, { heading: true });
    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.plugin.todo.renderList(sec, ctrls);
  }
};
var GamificationView = class extends WdView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.unsub = null;
  }
  getViewType() {
    return GAME_VIEW_TYPE;
  }
  getDisplayText() {
    return "Gamifica\xE7\xE3o";
  }
  getIcon() {
    return "trophy";
  }
  async onOpen() {
    this.refresh();
    this.unsub = this.plugin.game.subscribe(() => this.refresh());
    await this.plugin.game.ensureLoaded();
    this.refresh();
    void this.plugin.game.refreshPending();
    this.initPhoneWatch();
  }
  async onClose() {
    var _a;
    (_a = this.unsub) == null ? void 0 : _a.call(this);
    this.unsub = null;
  }
  rerender() {
    this.refresh();
  }
  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-game-view");
    this.phone = isPhoneWidth(this.contentEl);
    root.toggleClass("wd-phone", this.phone);
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Gamifica\xE7\xE3o" });
    const sec = root.createDiv({ cls: "wd-section wd-game-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "PROGRESSO" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.plugin.game.renderPanel(sec, ctrls, { full: true, phone: this.phone });
  }
};
var ConfirmModal = class extends import_obsidian.Modal {
  constructor(app, opts, resolve) {
    super(app);
    this.opts = opts;
    this.resolve = resolve;
    this.done = false;
  }
  onOpen() {
    var _a, _b;
    const { contentEl } = this;
    contentEl.addClass("wd-confirm");
    contentEl.createEl("h3", { text: this.opts.title });
    contentEl.createEl("p", { text: this.opts.body });
    if ((_a = this.opts.items) == null ? void 0 : _a.length) {
      const ul = contentEl.createEl("ul", { cls: "wd-confirm-list" });
      for (const it of this.opts.items) {
        const li = ul.createEl("li");
        li.createSpan({ text: it.text });
        for (const l of (_b = it.labels) != null ? _b : []) {
          const chip = li.createSpan({ cls: "wd-confirm-label" });
          chip.createSpan({ cls: "wd-label-dot" }).style.background = l.color;
          chip.createSpan({ text: `@${l.name}` });
        }
      }
    }
    const actions = contentEl.createDiv({ cls: "wd-tf-actions" });
    actions.createEl("button", { text: "Cancelar" }).onclick = () => this.close();
    const ok = actions.createEl("button", { cls: "mod-cta", text: this.opts.cta });
    ok.onclick = () => {
      this.done = true;
      this.close();
    };
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(this.done);
  }
};
function confirmModal(app, opts) {
  return new Promise((resolve) => new ConfirmModal(app, opts, resolve).open());
}
var TaskDetailModal = class extends import_obsidian.Modal {
  constructor(app, component, opts) {
    super(app);
    this.component = component;
    this.opts = opts;
  }
  onOpen() {
    var _a, _b;
    const { contentEl, titleEl, modalEl } = this;
    const t = this.opts.task;
    modalEl.addClass("wd-task-modal");
    titleEl.setText(t.content);
    const meta = contentEl.createDiv({ cls: "wd-td-meta" });
    const pri = priMeta(t.priority);
    meta.createSpan({ cls: "wd-td-pri", text: pri.label }).style.background = pri.color;
    const dk = dueKey(t);
    if (dk) {
      const [y, m, d] = dk.split("-");
      meta.createSpan({ cls: "wd-td-chip", text: `\u{1F4C5} ${d}/${m}/${y}${((_a = t.due) == null ? void 0 : _a.is_recurring) ? " \u27F3" : ""}` });
    }
    if (this.opts.projectName) meta.createSpan({ cls: "wd-td-chip", text: `# ${this.opts.projectName}` });
    for (const l of (_b = t.labels) != null ? _b : []) {
      const chip = meta.createSpan({ cls: "wd-td-chip wd-td-label" });
      chip.createSpan({ cls: "wd-label-dot" }).style.background = this.opts.labelColor(l);
      chip.createSpan({ text: `@${l}` });
    }
    if (hasDesc(t)) {
      const body = contentEl.createDiv({ cls: "wd-task-modal-desc markdown-rendered" });
      void import_obsidian.MarkdownRenderer.render(this.app, t.description.trim(), body, "", this.component);
    } else {
      contentEl.createEl("p", { cls: "wd-task-modal-empty", text: "Esta tarefa n\xE3o tem descri\xE7\xE3o." });
    }
    const actions = contentEl.createDiv({ cls: "wd-task-modal-actions" });
    const edit = actions.createEl("button", { text: "\u270E Editar" });
    edit.onclick = () => {
      this.close();
      this.opts.edit();
    };
    actions.createDiv({ cls: "wd-tf-spacer" });
    const done = actions.createEl("button", { text: "\u2713 Concluir" });
    done.onclick = () => {
      this.opts.complete();
      this.close();
    };
    const open = actions.createEl("button", { text: "Abrir no Todoist", cls: "mod-cta" });
    open.onclick = () => window.open(taskUrl(t), "_blank");
  }
  onClose() {
    this.contentEl.empty();
  }
};
var TaskFormModal = class extends import_obsidian.Modal {
  constructor(app, opts) {
    var _a, _b, _c, _d, _e, _f;
    super(app);
    this.opts = opts;
    this.confirmDel = false;
    const t = opts.task;
    const pre = opts.prefillDue;
    const prefillDate = pre === "hoje" ? toKey(/* @__PURE__ */ new Date()) : pre && /^\d{4}-\d{2}-\d{2}$/.test(pre) ? pre : "";
    this.v = {
      content: (_a = t == null ? void 0 : t.content) != null ? _a : "",
      description: (_b = t == null ? void 0 : t.description) != null ? _b : "",
      priority: (_c = t == null ? void 0 : t.priority) != null ? _c : 1,
      dueDate: ((_d = t == null ? void 0 : t.due) == null ? void 0 : _d.date) ? t.due.date.substring(0, 10) : prefillDate,
      projectId: (_e = t == null ? void 0 : t.project_id) != null ? _e : "",
      labels: ((_f = t == null ? void 0 : t.labels) != null ? _f : []).slice()
    };
    this.knownLabels = [.../* @__PURE__ */ new Set([...opts.labels, ...this.v.labels])].sort((a, b) => a.localeCompare(b));
  }
  onOpen() {
    var _a, _b;
    const { contentEl, titleEl, modalEl } = this;
    modalEl.addClass("wd-task-form");
    titleEl.setText(this.opts.mode === "create" ? "Nova tarefa" : "Editar tarefa");
    if (this.opts.mode === "edit" && this.opts.task) {
      const open = modalEl.createEl("button", { cls: "wd-tf-open-top", text: "\u2197 Todoist" });
      open.setAttr("title", "Abrir no Todoist");
      open.onclick = () => window.open(taskUrl(this.opts.task), "_blank");
    }
    this.field("T\xEDtulo");
    const content = contentEl.createEl("input", { cls: "wd-tf-input", type: "text" });
    content.value = this.v.content;
    content.placeholder = "O que precisa ser feito?";
    content.oninput = () => {
      this.v.content = content.value;
    };
    setTimeout(() => content.focus(), 0);
    this.field("Descri\xE7\xE3o");
    const desc = contentEl.createEl("textarea", { cls: "wd-tf-textarea" });
    desc.value = this.v.description;
    desc.placeholder = "Detalhes / instru\xE7\xF5es (markdown)";
    desc.rows = 3;
    desc.oninput = () => {
      this.v.description = desc.value;
    };
    this.field("Prioridade");
    const prow = contentEl.createDiv({ cls: "wd-tf-pri-row" });
    const renderPri = () => {
      prow.empty();
      for (const api of [4, 3, 2, 1]) {
        const meta = TODOIST_PRI[api];
        const b = prow.createSpan({ cls: "wd-tf-pri" + (this.v.priority === api ? " wd-on" : ""), text: meta.label });
        b.style.setProperty("--pri", meta.color);
        b.setAttr("aria-pressed", String(this.v.priority === api));
        clickable(b, () => {
          this.v.priority = api;
          renderPri();
        });
      }
    };
    renderPri();
    this.field("Data");
    const drow = contentEl.createDiv({ cls: "wd-tf-due-row" });
    const due = drow.createEl("input", { cls: "wd-tf-input wd-tf-date", type: "date" });
    due.value = this.v.dueDate;
    due.onchange = () => {
      this.v.dueDate = due.value;
    };
    const clr = drow.createEl("button", { cls: "wd-tf-due-clear", text: "sem data" });
    clr.onclick = () => {
      this.v.dueDate = "";
      due.value = "";
    };
    contentEl.createDiv({ cls: "wd-tf-hint", text: "Clique para abrir o calend\xE1rio. Vazio = sem data." });
    if ((_b = (_a = this.opts.task) == null ? void 0 : _a.due) == null ? void 0 : _b.is_recurring)
      contentEl.createDiv({ cls: "wd-tf-warn", text: "\u27F3 Tarefa recorrente \u2014 mudar a data fixa pode encerrar a recorr\xEAncia." });
    this.field("Projeto");
    const sel = contentEl.createEl("select", { cls: "wd-tf-select" });
    const inbox = sel.createEl("option", { text: "Entrada (Inbox)", value: "" });
    if (!this.v.projectId) inbox.selected = true;
    for (const p of this.opts.projects) {
      const o = sel.createEl("option", { text: p.name, value: p.id });
      if (p.id === this.v.projectId) o.selected = true;
    }
    sel.onchange = () => {
      this.v.projectId = sel.value;
    };
    this.field("Etiquetas");
    const lwrap = contentEl.createDiv({ cls: "wd-tf-labels" });
    if (this.knownLabels.length) {
      const renderLabels = () => {
        lwrap.empty();
        for (const l of this.knownLabels) {
          const on = this.v.labels.includes(l);
          const chip = lwrap.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : "") });
          chip.createSpan({ cls: "wd-label-dot" }).style.background = this.opts.labelColor(l);
          chip.createSpan({ text: `@${l}` });
          chip.setAttr("aria-pressed", String(on));
          clickable(chip, () => {
            const i = this.v.labels.indexOf(l);
            if (i >= 0) this.v.labels.splice(i, 1);
            else this.v.labels.push(l);
            renderLabels();
          });
        }
      };
      renderLabels();
    } else {
      lwrap.createDiv({ cls: "wd-tf-hint", text: "Nenhuma etiqueta no Todoist ainda." });
    }
    this.actionsEl = contentEl.createDiv({ cls: "wd-tf-actions" });
    this.renderActions();
  }
  field(label) {
    this.contentEl.createDiv({ cls: "wd-tf-label", text: label });
  }
  renderActions() {
    const a = this.actionsEl;
    a.empty();
    if (this.confirmDel && this.opts.remove) {
      a.createSpan({ cls: "wd-tf-confirm", text: "Excluir esta tarefa?" });
      a.createDiv({ cls: "wd-tf-spacer" });
      const yes = a.createEl("button", { text: "Excluir", cls: "mod-warning" });
      yes.onclick = async () => {
        yes.disabled = true;
        if (await this.opts.remove()) this.close();
        else {
          this.confirmDel = false;
          this.renderActions();
        }
      };
      const no = a.createEl("button", { text: "Cancelar" });
      no.onclick = () => {
        this.confirmDel = false;
        this.renderActions();
      };
      return;
    }
    if (this.opts.mode === "edit") {
      const del = a.createEl("button", { text: "Excluir", cls: "mod-warning" });
      del.onclick = () => {
        this.confirmDel = true;
        this.renderActions();
      };
    }
    a.createDiv({ cls: "wd-tf-spacer" });
    const cancel = a.createEl("button", { text: "Cancelar" });
    cancel.onclick = () => this.close();
    const save = a.createEl("button", { text: "Salvar", cls: "mod-cta" });
    save.onclick = async () => {
      this.v.content = this.v.content.trim();
      if (!this.v.content) {
        new import_obsidian.Notice("D\xEA um t\xEDtulo \xE0 tarefa.");
        return;
      }
      save.disabled = true;
      if (await this.opts.submit(this.v)) this.close();
      else save.disabled = false;
    };
  }
  onClose() {
    this.contentEl.empty();
  }
};
var WerusSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    // Projetos do Todoist (para os dropdowns dos pacotes). Buscados 1x; quando
    // chegam, re-renderiza a aba para preencher os selects.
    this.projects = null;
    // Etiquetas do Todoist (chips por pacote). Mesma estratégia: busca 1x.
    this.labels = null;
  }
  display() {
    const { containerEl } = this;
    const plugin = this.plugin;
    containerEl.empty();
    containerEl.createEl("h3", { text: "Exibi\xE7\xE3o do dashboard" });
    new import_obsidian.Setting(containerEl).setName("Modo compacto").setDesc("Layout mais denso, com menos espa\xE7amento entre os elementos.").addToggle((t) => t.setValue(plugin.settings.compact).onChange(async (v) => {
      plugin.settings.compact = v;
      await plugin.saveSettings();
      plugin.rerenderDashboards();
    }));
    containerEl.createEl("h3", { text: "Se\xE7\xF5es do dashboard" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Ative/desative cada se\xE7\xE3o e ajuste a ordem em que aparecem na dashboard."
    });
    const order = plugin.settings.sectionOrder;
    order.forEach((id, i) => {
      new import_obsidian.Setting(containerEl).setName(SECTION_LABEL[id]).addExtraButton((b) => b.setIcon("arrow-up").setTooltip("Mover para cima").setDisabled(i === 0).onClick(async () => {
        await plugin.moveSection(id, -1);
        this.display();
      })).addExtraButton((b) => b.setIcon("arrow-down").setTooltip("Mover para baixo").setDisabled(i === order.length - 1).onClick(async () => {
        await plugin.moveSection(id, 1);
        this.display();
      })).addToggle((t) => t.setTooltip("Vis\xEDvel").setValue(!plugin.settings.hidden.includes("sec:" + id)).onChange(async (v) => {
        await plugin.setHidden("sec:" + id, !v);
      }));
    });
    containerEl.createEl("h3", { text: "Pastas exibidas (cards do Cofre)" });
    const topFolders = this.app.vault.getRoot().children.filter((c) => c instanceof import_obsidian.TFolder && !c.name.startsWith(".")).sort((a, b) => a.name.localeCompare(b.name, "pt"));
    if (!topFolders.length) {
      containerEl.createEl("p", { cls: "setting-item-description", text: "Nenhuma pasta de topo no cofre." });
    }
    for (const f of topFolders) {
      new import_obsidian.Setting(containerEl).setName(f.name).addToggle((t) => t.setTooltip("Vis\xEDvel").setValue(!plugin.settings.hidden.includes(f.path)).onChange(async (v) => {
        await plugin.setHidden(f.path, !v);
      }));
    }
    containerEl.createEl("h3", { text: "Fontes dos Relat\xF3rios" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Pastas cujas notas viram cards nos dias da se\xE7\xE3o Relat\xF3rios (posi\xE7\xE3o pela data da nota). Cada fonte tem uma cor pr\xF3pria."
    });
    const srcs = plugin.settings.calendarSources;
    srcs.forEach((s) => {
      new import_obsidian.Setting(containerEl).setName(s.path).addToggle((t) => t.setTooltip("Ativa").setValue(s.on).onChange(async (v) => {
        s.on = v;
        await plugin.saveSettings();
        plugin.rerenderDashboards();
      })).addColorPicker((c) => c.setValue(s.color).onChange(async (v) => {
        s.color = v;
        await plugin.saveSettings();
        plugin.rerenderDashboards();
      })).addExtraButton((b) => b.setIcon("trash-2").setTooltip("Remover fonte").onClick(async () => {
        plugin.settings.calendarSources = srcs.filter((x) => x !== s);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        this.display();
      }));
    });
    const used = new Set(srcs.map((s) => s.path));
    const available = allFolderPaths(this.app).filter((p) => !used.has(p));
    if (available.length) {
      new import_obsidian.Setting(containerEl).setName("Adicionar fonte").setDesc("Escolha uma pasta do cofre para alimentar a se\xE7\xE3o Relat\xF3rios.").addDropdown((d) => {
        d.addOption("", "Escolha uma pasta\u2026");
        for (const p of available) d.addOption(p, p);
        d.onChange(async (v) => {
          if (!v) return;
          const color = ACCENTS[plugin.settings.calendarSources.length % ACCENTS.length];
          plugin.settings.calendarSources.push({ path: v, color, on: true });
          await plugin.saveSettings();
          plugin.rerenderDashboards();
          this.display();
        });
      });
    }
    containerEl.createEl("h3", { text: "Gamifica\xE7\xE3o" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: 'Tarefas conclu\xEDdas viram XP/n\xEDvel/streak (aba Gamifica\xE7\xE3o + faixa no dashboard). "Salvar conclu\xEDdas" grava no log do cofre (20.Areas/Gamifica\xE7\xE3o.md) e limpa do Todoist. O bot\xE3o \u2717 marca uma tarefa como n\xE3o feita (puni\xE7\xE3o em XP) e a apaga.'
    });
    new import_obsidian.Setting(containerEl).setName("Ativar gamifica\xE7\xE3o").setDesc('Mostra a se\xE7\xE3o/aba de Gamifica\xE7\xE3o e o bot\xE3o "n\xE3o feita" nas tarefas.').addToggle((t) => t.setValue(plugin.settings.gamificationEnabled).onChange(async (v) => {
      plugin.settings.gamificationEnabled = v;
      await plugin.saveSettings();
      plugin.rerenderDashboards();
      plugin.game.rerenderAll();
    }));
    new import_obsidian.Setting(containerEl).setName('Penalidade do "n\xE3o feito"').setDesc("Multiplica a base da prioridade ao marcar como n\xE3o feita. Ex.: 1,5 = perde 50% a mais do que ganharia.").addText((t) => t.setPlaceholder("1.5").setValue(String(plugin.settings.gamePenaltyFactor)).onChange(async (v) => {
      const n = Number(v.replace(",", "."));
      if (Number.isFinite(n) && n > 0) {
        plugin.settings.gamePenaltyFactor = n;
        await plugin.saveSettings();
      }
    }));
    containerEl.createEl("h3", { text: "Pacotes de tarefas" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Conjuntos de tarefas que voc\xEA lan\xE7a no Todoist com um clique (na aba Todoist ou no dashboard), todas com data de hoje. Uma tarefa por linha. Numa linha, use @etiqueta para aplicar uma etiqueta s\xF3 \xE0quela tarefa e p1\u2013p4 para a prioridade (p1 = mais alta; padr\xE3o p4)."
    });
    new import_obsidian.Setting(containerEl).setName("Confirmar antes de lan\xE7ar").setDesc('Pede confirma\xE7\xE3o (com a lista de tarefas) antes de criar. "Sempre" confirma at\xE9 para 1 tarefa \u2014 \xFAtil para testar; depois mude para Nunca.').addDropdown((d) => d.addOption("always", "Sempre").addOption("many", "S\xF3 muitas (> 5 tarefas)").addOption("never", "Nunca").setValue(plugin.settings.packageConfirm).onChange(async (v) => {
      plugin.settings.packageConfirm = v;
      await plugin.saveSettings();
    }));
    const token = plugin.settings.todoistToken.trim();
    if (token && this.projects === null) {
      fetchTodoistProjects(token).then((ps) => {
        this.projects = ps;
        this.display();
      }).catch(() => {
        this.projects = [];
      });
    }
    if (token && this.labels === null) {
      fetchTodoistLabels(token).then((ls) => {
        this.labels = ls;
        this.display();
      }).catch(() => {
        this.labels = [];
      });
    }
    const openLabelsPopover = (anchor, pkg, refresh) => openPopover(anchor, (body) => {
      body.createDiv({ cls: "wd-pop-title", text: "Etiquetas do pacote" });
      if (!token) {
        body.createDiv({ cls: "wd-tf-hint", text: "Configure o token do Todoist." });
        return;
      }
      if (this.labels === null) {
        body.createDiv({ cls: "wd-tf-hint", text: "Carregando\u2026" });
        return;
      }
      if (!this.labels.length) {
        body.createDiv({ cls: "wd-tf-hint", text: "Nenhuma etiqueta no Todoist." });
        return;
      }
      const chips = body.createDiv({ cls: "wd-pop-chips" });
      const render = () => {
        var _a, _b;
        chips.empty();
        for (const l of this.labels) {
          const on = ((_a = pkg.labels) != null ? _a : []).includes(l.name);
          const chip = chips.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : "") });
          chip.setAttr("aria-pressed", String(on));
          chip.createSpan({ cls: "wd-label-dot" }).style.background = (_b = TODOIST_COLORS[l.color]) != null ? _b : LABEL_FALLBACK;
          chip.createSpan({ text: `@${l.name}` });
          clickable(chip, async () => {
            var _a2;
            const cur = (_a2 = pkg.labels) != null ? _a2 : [];
            const i = cur.indexOf(l.name);
            if (i >= 0) cur.splice(i, 1);
            else cur.push(l.name);
            pkg.labels = cur.length ? cur : void 0;
            await plugin.saveSettings();
            plugin.rerenderDashboards();
            render();
            refresh();
          });
        }
      };
      render();
    }, { cls: "wd-pop-labels" });
    const openTasksPopover = (anchor, pkg, refresh) => {
      let ta;
      openPopover(anchor, (body) => {
        body.createDiv({ cls: "wd-pop-title", text: "Tarefas do pacote" });
        ta = body.createEl("textarea", { cls: "wd-pkg-tasks" });
        ta.value = pkg.tasks.join("\n");
        ta.placeholder = "Uma tarefa por linha (ex.: Beber \xE1gua)";
        ta.rows = 6;
        ta.addEventListener("input", async () => {
          pkg.tasks = ta.value.split("\n").map((s) => s.trim()).filter(Boolean);
          await plugin.saveSettings();
          refresh();
        });
        body.createDiv({ cls: "wd-tf-hint", text: "Uma por linha \xB7 @etiqueta marca s\xF3 aquela tarefa \xB7 p1\u2013p4 define a prioridade (p1 = mais alta) \xB7 fecha ao clicar fora ou Esc." });
        setTimeout(() => ta.focus(), 0);
      }, { cls: "wd-pop-tasks", width: 320, container: this.containerEl, onClose: () => {
        plugin.rerenderDashboards();
      } });
    };
    const pkgs = plugin.settings.taskPackages;
    const list = containerEl.createDiv({ cls: "wd-pkg-list" });
    pkgs.forEach((pkg, idx) => {
      var _a;
      const row = list.createDiv({ cls: "wd-pkg-row" });
      const iconBtn = row.createSpan({ cls: "wd-pkg-icontrigger" });
      iconBtn.setAttr("title", "\xCDcone do pacote");
      const fillIcon = () => {
        iconBtn.empty();
        if (pkg.icon) renderIcon(iconBtn.createSpan({ cls: "wd-pkg-ico" }), pkg.icon);
        else iconBtn.createSpan({ cls: "wd-pkg-ico-empty", text: "+" });
      };
      fillIcon();
      clickable(iconBtn, () => openIconPopover(iconBtn, pkg.icon, async (ic) => {
        pkg.icon = ic;
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        fillIcon();
      }));
      const name = row.createEl("input", { cls: "wd-pkg-name-input", attr: { type: "text", placeholder: "Nome do pacote" } });
      name.value = pkg.name;
      name.addEventListener("input", async () => {
        pkg.name = name.value;
        await plugin.saveSettings();
      });
      name.addEventListener("change", () => plugin.rerenderDashboards());
      const proj = row.createEl("select", { cls: "wd-pkg-proj dropdown" });
      const addOpt = (v, t) => {
        var _a2;
        const o = proj.createEl("option", { text: t, value: v });
        if (((_a2 = pkg.projectId) != null ? _a2 : "") === v) o.selected = true;
      };
      addOpt("", "Entrada");
      for (const p of (_a = this.projects) != null ? _a : []) addOpt(p.id, p.name);
      proj.onchange = async () => {
        pkg.projectId = proj.value || void 0;
        await plugin.saveSettings();
      };
      const lblBtn = row.createEl("button", { cls: "wd-pkg-chip-btn" });
      const fillLbl = () => {
        var _a2, _b;
        lblBtn.empty();
        (0, import_obsidian.setIcon)(lblBtn.createSpan({ cls: "wd-pkg-btn-ico" }), "tag");
        lblBtn.createSpan({ text: "Etiquetas" });
        const n = (_b = (_a2 = pkg.labels) == null ? void 0 : _a2.length) != null ? _b : 0;
        if (n) lblBtn.createSpan({ cls: "wd-pkg-count", text: String(n) });
      };
      fillLbl();
      lblBtn.onclick = () => openLabelsPopover(lblBtn, pkg, fillLbl);
      const taskBtn = row.createEl("button", { cls: "wd-pkg-chip-btn" });
      const fillTask = () => {
        taskBtn.empty();
        (0, import_obsidian.setIcon)(taskBtn.createSpan({ cls: "wd-pkg-btn-ico" }), "list");
        taskBtn.createSpan({ text: "Tarefas" });
        const n = pkg.tasks.filter((s) => s.trim()).length;
        if (n) taskBtn.createSpan({ cls: "wd-pkg-count", text: String(n) });
      };
      fillTask();
      taskBtn.onclick = () => openTasksPopover(taskBtn, pkg, fillTask);
      const up = row.createSpan({ cls: "wd-pkg-mini" + (idx === 0 ? " wd-disabled" : "") });
      (0, import_obsidian.setIcon)(up, "chevron-up");
      up.setAttr("title", "Mover para cima");
      if (idx > 0) clickable(up, async () => {
        await plugin.movePackage(idx, -1);
        this.display();
      });
      const down = row.createSpan({ cls: "wd-pkg-mini" + (idx === pkgs.length - 1 ? " wd-disabled" : "") });
      (0, import_obsidian.setIcon)(down, "chevron-down");
      down.setAttr("title", "Mover para baixo");
      if (idx < pkgs.length - 1) clickable(down, async () => {
        await plugin.movePackage(idx, 1);
        this.display();
      });
      const del = row.createSpan({ cls: "wd-pkg-mini wd-pkg-del" });
      (0, import_obsidian.setIcon)(del, "trash-2");
      del.setAttr("title", "Remover pacote");
      clickable(del, async () => {
        plugin.settings.taskPackages = pkgs.filter((x) => x !== pkg);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        this.display();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Adicionar pacote").addButton((b) => b.setButtonText("+ Novo pacote").onClick(async () => {
      plugin.settings.taskPackages.push({ id: uid(), name: "Novo pacote", tasks: [] });
      await plugin.saveSettings();
      this.display();
    }));
    containerEl.createEl("h3", { text: "Integra\xE7\xE3o Todoist" });
    new import_obsidian.Setting(containerEl).setName("Token da API").setDesc("Todoist \u2192 Configura\xE7\xF5es \u2192 Integra\xE7\xF5es \u2192 Token de API do desenvolvedor. Salvo localmente em data.json (n\xE3o vai para o Git).").addText((t) => {
      t.setPlaceholder("cole o token aqui").setValue(this.plugin.settings.todoistToken).onChange(async (v) => {
        this.plugin.settings.todoistToken = v.trim();
        await this.plugin.saveSettings();
        this.plugin.refreshDashboards();
      });
      t.inputEl.type = "password";
      t.inputEl.style.width = "100%";
    });
    containerEl.createEl("h3", { text: "Exibi\xE7\xE3o das tarefas" });
    new import_obsidian.Setting(containerEl).setName("Mostrar o projeto nas linhas").setDesc("Exibe o nome do projeto ao lado de cada tarefa.").addToggle((t) => t.setValue(this.plugin.settings.todoistShowProject).onChange(async (v) => {
      this.plugin.settings.todoistShowProject = v;
      await this.plugin.saveSettings();
      this.plugin.refreshDashboards();
    }));
    new import_obsidian.Setting(containerEl).setName("Mostrar as etiquetas nas linhas").setDesc("Exibe as @etiquetas de cada tarefa.").addToggle((t) => t.setValue(this.plugin.settings.todoistShowLabels).onChange(async (v) => {
      this.plugin.settings.todoistShowLabels = v;
      await this.plugin.saveSettings();
      this.plugin.refreshDashboards();
    }));
    containerEl.createEl("h3", { text: "Sincroniza\xE7\xE3o (Syncthing)" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Estas credenciais s\xE3o guardadas por dispositivo (localStorage) \u2014 cada m\xE1quina tem a sua e elas n\xE3o sincronizam pelo Syncthing nem v\xE3o para o Git."
    });
    new import_obsidian.Setting(containerEl).setName("URL da API").setDesc("Endere\xE7o do Syncthing. Padr\xE3o: http://127.0.0.1:8384 (a inst\xE2ncia local). No celular, aponte para a API de outra m\xE1quina na rede se a local n\xE3o responder.").addText((t) => {
      t.setPlaceholder("http://127.0.0.1:8384").setValue(this.plugin.settings.syncthingUrl).onChange(async (v) => {
        this.plugin.settings.syncthingUrl = v.trim() || "http://127.0.0.1:8384";
        await this.plugin.saveSettings();
        this.plugin.refreshSync();
      });
      t.inputEl.style.width = "100%";
    });
    new import_obsidian.Setting(containerEl).setName("API key").setDesc("Syncthing \u2192 Actions \u2192 Settings \u2192 API Key. Guardada por dispositivo (localStorage), n\xE3o vai para o data.json/Git.").addText((t) => {
      t.setPlaceholder("cole a API key").setValue(this.plugin.settings.syncthingApiKey).onChange(async (v) => {
        this.plugin.settings.syncthingApiKey = v.trim();
        await this.plugin.saveSettings();
        this.plugin.refreshSync();
      });
      t.inputEl.type = "password";
      t.inputEl.style.width = "100%";
    });
    new import_obsidian.Setting(containerEl).setName("ID da pasta (opcional)").setDesc("Folder ID do cofre no Syncthing. Vazio = usa a primeira pasta automaticamente.").addText((t) => {
      t.setPlaceholder("ex.: nunqv-mtimn").setValue(this.plugin.settings.syncthingFolderId).onChange(async (v) => {
        this.plugin.settings.syncthingFolderId = v.trim();
        await this.plugin.saveSettings();
        this.plugin.refreshSync();
      });
      t.inputEl.style.width = "100%";
    });
    new import_obsidian.Setting(containerEl).setName("Mostrar contagem de itens por aparelho").setDesc('Exibe "sincronizados / total" de itens em cada aparelho, al\xE9m da porcentagem.').addToggle((t) => t.setValue(this.plugin.settings.syncthingShowCounts).onChange(async (v) => {
      this.plugin.settings.syncthingShowCounts = v;
      await this.plugin.saveSettings();
      this.plugin.refreshSync();
    }));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5jb25zdCBMU19UT0RPX0NBQ0hFID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6dG9kb2lzdENhY2hlXCI7ICAgLy8gY2FjaGUgb2ZmbGluZSBkbyBUb2RvaXN0IChwb3ItZGlzcG9zaXRpdm8pXG5jb25zdCBUT0RPX1RUTCA9IDUgKiA2MCAqIDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZGFkZSBtXHUwMEUxeC4gZG8gY2FjaGUgYW50ZXMgZGUgcmUtYnVzY2FyICg1IG1pbilcbmNvbnN0IFRPRE9fTUFYX1BBR0VTID0gNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRldG8gZGUgcFx1MDBFMWdpbmFzIHBhZ2luYWRhcyAoYW50aS1sb29wIHNlIGEgQVBJIHJlcGV0aXIgbyBjdXJzb3IpXG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM28gKHYwLjEzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEdBTUVfVklFV19UWVBFID0gXCJ3ZXJ1cy1nYW1lXCI7XG5jb25zdCBHQU1FX0xPR19QQVRIID0gXCIyMC5BcmVhcy9HYW1pZmljYVx1MDBFN1x1MDBFM28ubWRcIjsgICAgICAgIC8vIGxvZyBjYW5cdTAwRjRuaWNvIGRlIFhQIG5vIGNvZnJlXG5jb25zdCBHQU1FX0xPR19GRU5DRSA9IFwid2QtZ2FtZS1sb2dcIjsgICAgICAgICAgICAgICAgICAgLy8gYmxvY28gY2VyY2FkbyBjb20gb3MgZXZlbnRvcyAoMSBwb3IgbGluaGEpXG5jb25zdCBIQVJWRVNUX0JBQ0tGSUxMX0RBWVMgPSA5MDsgICAgICAgICAgICAgICAgICAgICAgIC8vIDFcdTAwQUEgY29saGVpdGE6IGphbmVsYSBtXHUwMEUxeC4gZGEgQVBJXG4vLyBYUCBiYXNlIHBvciBwcmlvcmlkYWRlIGRhIEFQSSAoNCA9IHAxIFx1MjAyNiAxID0gcDQpLlxuY29uc3QgWFBfQllfUFJJOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+ID0geyA0OiA4LCAzOiA1LCAyOiAzLCAxOiAxIH07XG5mdW5jdGlvbiB4cEZvclByaW9yaXR5KHA6IG51bWJlcik6IG51bWJlciB7IHJldHVybiBYUF9CWV9QUklbcF0gPz8gMTsgfVxuXG4vLyB1aWQgY3VydG8gZSBlc3RcdTAwRTF2ZWwgKHBhY290ZXMgZGUgdGFyZWZhcykuXG5mdW5jdGlvbiB1aWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyk7XG59XG5cbnR5cGUgU3RhdHVzID0gXCJwcm9ncmVzc1wiIHwgXCJwYXVzZWRcIiB8IFwiY2FuY2VsbGVkXCI7XG50eXBlIFNlY3Rpb25JZCA9IFwiY2FsZW5kYXJcIiB8IFwicGFyYVwiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiIHwgXCJ0b2RvaXN0XCIgfCBcInN5bmNcIiB8IFwiZ2FtZVwiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG4gIC8vIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodjAuMTMpXG4gIGdhbWlmaWNhdGlvbkVuYWJsZWQ6IGJvb2xlYW47ICAvLyBtb3N0cmEgYSBzZVx1MDBFN1x1MDBFM28vYWJhIGRvIEdhbWVcbiAgZ2FtZVBlbmFsdHlGYWN0b3I6IG51bWJlcjsgICAgIC8vIFwiblx1MDBFM28gZmVpdG9cIiB0aXJhIGJhc2UgXHUwMEQ3IGZhdG9yXG4gIGdhbWVMYXN0SGFydmVzdDogc3RyaW5nOyAgICAgICAvLyBJU08gZGEgXHUwMEZBbHRpbWEgY29saGVpdGEgZGUgY29uY2x1XHUwMEVEZGFzIChsaW1pdGEgbyBmZXRjaClcbiAgZ2FtZUNoYXJ0TW9kZTogXCJiYXJzXCIgfCBcImxpbmVcIjsgICAgLy8gZ3JcdTAwRTFmaWNvIGRlIFhQIHBvciBkaWE6IGJhcnJhcyBvdSBsaW5oYSBjb20gcG9udG9zXG4gIGdyb3d0aENoYXJ0TW9kZTogXCJiYXJzXCIgfCBcImxpbmVcIjsgIC8vIGdyXHUwMEUxZmljbyBkZSBDcmVzY2ltZW50byBkbyBjb2ZyZTogYmFycmFzIG91IGxpbmhhXG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhc2hTZXR0aW5ncyA9IHtcbiAgc2VjdGlvbk9yZGVyOiBbXCJzdGF0c1wiLCBcImdhbWVcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIGNhbGVuZGFyU291cmNlczogW1xuICAgIHsgcGF0aDogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgY29sb3I6IFwiIzNCODJGNlwiLCBvbjogdHJ1ZSB9LFxuICAgIHsgcGF0aDogXCI1MC5EaVx1MDBFMXJpb1wiLCAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzEwQjk4MVwiLCBvbjogdHJ1ZSB9LFxuICBdLFxuICB0b2RvaXN0VG9rZW46IFwiXCIsXG4gIHRvZG9pc3REYXlSYW5nZTogNyxcbiAgdG9kb2lzdEZpbHRlcnM6IHsgcHJvamVjdHM6IFtdLCBsYWJlbHM6IFtdIH0sXG4gIHRvZG9pc3RTaG93UHJvamVjdDogdHJ1ZSxcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGZhbHNlLFxuICBzeW5jdGhpbmdVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIsXG4gIHN5bmN0aGluZ0FwaUtleTogXCJcIixcbiAgc3luY3RoaW5nRm9sZGVySWQ6IFwiXCIsXG4gIHN5bmN0aGluZ1Nob3dDb3VudHM6IGZhbHNlLFxuICB0YXNrUGFja2FnZXM6IFtdLFxuICBwYWNrYWdlQ29uZmlybTogXCJtYW55XCIsXG4gIGdhbWlmaWNhdGlvbkVuYWJsZWQ6IHRydWUsXG4gIGdhbWVQZW5hbHR5RmFjdG9yOiAxLjUsXG4gIGdhbWVMYXN0SGFydmVzdDogXCJcIixcbiAgZ2FtZUNoYXJ0TW9kZTogXCJiYXJzXCIsXG4gIGdyb3d0aENoYXJ0TW9kZTogXCJiYXJzXCIsXG59O1xuXG5pbnRlcmZhY2UgUGFyYVNlY3Rpb24ge1xuICBmb2xkZXI6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBhY2NlbnQ6IHN0cmluZztcbn1cblxuLy8gUGFzdGFzIFwiY29uaGVjaWRhc1wiIGRvIFBBUkE6IG1hbnRcdTAwRUFtIFx1MDBFRGNvbmUsIHJcdTAwRjN0dWxvIGUgY29yIGZpeG9zLiBBcyBkZW1haXMgcGFzdGFzXG4vLyBkbyBjb2ZyZSBzXHUwMEUzbyByZW5kZXJpemFkYXMgY29tIGNvciBhdXRvbVx1MDBFMXRpY2EgZSBcdTAwRURjb25lIHBhZHJcdTAwRTNvIChvdSBvIGljb246IGRvIHN0YXR1cy5tZCkuXG5jb25zdCBQQVJBOiBQYXJhU2VjdGlvbltdID0gW1xuICB7IGZvbGRlcjogXCIwMC5JbmJveFwiLCAgICAgaWNvbjogXCJcdUQ4M0RcdURDRTVcIiwgbGFiZWw6IFwiSW5ib3hcIiwgICAgYWNjZW50OiBcIiM2MzY2RjFcIiB9LFxuICB7IGZvbGRlcjogXCIxMC5Qcm9qZWN0c1wiLCAgaWNvbjogXCJcdUQ4M0RcdURFODBcIiwgbGFiZWw6IFwiUHJvamV0b3NcIiwgYWNjZW50OiBcIiMxMEI5ODFcIiB9LFxuICB7IGZvbGRlcjogXCIyMC5BcmVhc1wiLCAgICAgaWNvbjogXCJcdUQ4M0NcdURGQUZcIiwgbGFiZWw6IFwiXHUwMEMxcmVhc1wiLCAgICBhY2NlbnQ6IFwiI0Y1OUUwQlwiIH0sXG4gIHsgZm9sZGVyOiBcIjMwLlJlc291cmNlc1wiLCBpY29uOiBcIlx1RDgzRFx1RENEQVwiLCBsYWJlbDogXCJSZWN1cnNvc1wiLCBhY2NlbnQ6IFwiIzNCODJGNlwiIH0sXG4gIHsgZm9sZGVyOiBcIjQwLkFyY2hpdmVcIiwgICBpY29uOiBcIlx1RDgzRFx1RERDNFx1RkUwRlwiLCAgbGFiZWw6IFwiQXJxdWl2b1wiLCAgYWNjZW50OiBcIiM2QjcyODBcIiB9LFxuXTtcbmNvbnN0IFBBUkFfTUFQID0gbmV3IE1hcChQQVJBLm1hcChwID0+IFtwLmZvbGRlciwgcF0pKTtcblxuLy8gUGFsZXRhIHBhcmEgY29sb3JpciBwYXN0YXMgZGVzY29uaGVjaWRhcyBkZSBmb3JtYSBlc3RcdTAwRTF2ZWwgKHBvciBoYXNoIGRvIG5vbWUpLlxuY29uc3QgQUNDRU5UUyA9IFtcIiM2MzY2RjFcIixcIiMxMEI5ODFcIixcIiNGNTlFMEJcIixcIiMzQjgyRjZcIixcIiNFQzQ4OTlcIixcIiM4QjVDRjZcIixcIiMxNEI4QTZcIixcIiNFRjQ0NDRcIl07XG5cbmNvbnN0IERBWV9TSE9SVCA9IFtcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNcdTAwRTFiXCIsIFwiRG9tXCJdO1xuY29uc3QgTU9OVEhfU0hPUlQgPSBbXCJKYW5cIixcIkZldlwiLFwiTWFyXCIsXCJBYnJcIixcIk1haVwiLFwiSnVuXCIsXCJKdWxcIixcIkFnb1wiLFwiU2V0XCIsXCJPdXRcIixcIk5vdlwiLFwiRGV6XCJdO1xuY29uc3QgSU1HX0VYVCA9IFtcInBuZ1wiLFwianBnXCIsXCJqcGVnXCIsXCJ3ZWJwXCIsXCJnaWZcIixcInN2Z1wiXTtcblxuLy8gUGFzdGEgcmFpeiBkYXMgbm90YXMgZGlcdTAwRTFyaWFzIChjcmlhZGFzIGFvIGNsaWNhciBudW0gZGlhIGRvIGNhbGVuZFx1MDBFMXJpbykuXG5jb25zdCBEQUlMWV9GT0xERVIgPSBcIjUwLkRpXHUwMEUxcmlvXCI7XG4vLyBUZW1wbGF0ZSBvcGNpb25hbDsgcGxhY2Vob2xkZXJzIHt7ZGF0ZX19IChZWVlZLU1NLUREKSBlIHt7dGl0bGV9fSAoZGF0YSBwb3IgZXh0ZW5zbykuXG5jb25zdCBEQUlMWV9URU1QTEFURSA9IFwiTW9kZWxvcy9Ob3RhIERpXHUwMEUxcmlhLm1kXCI7XG5cbmNvbnN0IFNUQVRVU19JQ09OOiBSZWNvcmQ8U3RhdHVzLCBzdHJpbmc+ID0ge1xuICBwcm9ncmVzczogXCJcdTI1QjZcIiwgcGF1c2VkOiBcIlx1MjNGOFwiLCBjYW5jZWxsZWQ6IFwiXHUyNzE1XCIsXG59O1xuXG5jb25zdCBTRUNfQ0FMID0gXCJzZWM6Y2FsZW5kYXJcIjtcbmNvbnN0IFNFQ19QQVJBID0gXCJzZWM6cGFyYVwiO1xuY29uc3QgU0VDX0hFQVQgPSBcInNlYzpoZWF0bWFwXCI7XG5jb25zdCBTRUNfR1JPVyA9IFwic2VjOmdyb3d0aFwiO1xuY29uc3QgU0VDX1NUQVQgPSBcInNlYzpzdGF0c1wiO1xuY29uc3QgU0VDX1RPRE8gPSBcInNlYzp0b2RvaXN0XCI7XG5jb25zdCBTRUNfU1lOQyA9IFwic2VjOnN5bmNcIjtcbmNvbnN0IFNFQ19HQU1FID0gXCJzZWM6Z2FtZVwiO1xuXG4vLyBSXHUwMEYzdHVsb3MgYW1pZ1x1MDBFMXZlaXMgZGFzIHNlXHUwMEU3XHUwMEY1ZXMgKHVzYWRvcyBuYSBhYmEgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlxuY29uc3QgU0VDVElPTl9MQUJFTDogUmVjb3JkPFNlY3Rpb25JZCwgc3RyaW5nPiA9IHtcbiAgc3RhdHM6ICAgIFwiRXN0YXRcdTAwRURzdGljYXNcIixcbiAgdG9kb2lzdDogIFwiVGFyZWZhc1wiLFxuICBwYXJhOiAgICAgXCJDb2ZyZSAocGFzdGFzKVwiLFxuICBzeW5jOiAgICAgXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzb1wiLFxuICBoZWF0bWFwOiAgXCJBdGl2aWRhZGUgZG8gY29mcmVcIixcbiAgZ3Jvd3RoOiAgIFwiQ3Jlc2NpbWVudG8gZG8gY29mcmVcIixcbiAgY2FsZW5kYXI6IFwiUmVsYXRcdTAwRjNyaW9zXCIsXG4gIGdhbWU6ICAgICBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiLFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBUb2RvaXN0VGFzayB7XG4gIGlkOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJOiAxLi40LCBvbmRlIDQgPSB1cmdlbnRlICg9IHAxIG5hIFVJKVxuICBkdWU/OiB7IGRhdGU6IHN0cmluZzsgZGF0ZXRpbWU/OiBzdHJpbmc7IHN0cmluZz86IHN0cmluZzsgaXNfcmVjdXJyaW5nPzogYm9vbGVhbiB9IHwgbnVsbDtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbiAgaXNfY29tcGxldGVkPzogYm9vbGVhbjtcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHVybD86IHN0cmluZztcbiAgY29tcGxldGVkX2F0Pzogc3RyaW5nOyAgIC8vIHNcdTAwRjMgbmFzIGNvbmNsdVx1MDBFRGRhcyAoYnlfY29tcGxldGlvbl9kYXRlKVxufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG4vLyBObyBtb2RvIFwibWFueVwiLCBsYW5cdTAwRTdhciBtYWlzIHF1ZSBpc3RvIHBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvLlxuY29uc3QgTEFVTkNIX0NPTkZJUk1fTUlOID0gNTtcblxuLy8gXHUwMENEY29uZXMgc3VnZXJpZG9zIHBhcmEgb3MgcGFjb3RlcyAobm9tZXMgTHVjaWRlOyByZW5kZXJpemFkb3MgcG9yIHJlbmRlckljb24pLlxuY29uc3QgUEtHX0lDT05TID0gW1xuICBcInN1bnJpc2VcIiwgXCJzdW5cIiwgXCJzdW5zZXRcIiwgXCJtb29uXCIsIFwiY29mZmVlXCIsIFwidXRlbnNpbHNcIiwgXCJkdW1iYmVsbFwiLCBcImJvb2stb3BlblwiLFxuICBcImJyaWVmY2FzZVwiLCBcImdyYWR1YXRpb24tY2FwXCIsIFwiaG9tZVwiLCBcInNob3BwaW5nLWNhcnRcIiwgXCJoZWFydFwiLCBcImRyb3BsZXRcIiwgXCJwaWxsXCIsXG4gIFwiYmVkXCIsIFwiY2xvY2tcIiwgXCJjYWxlbmRhclwiLCBcImNoZWNrLWNoZWNrXCIsIFwibGlzdC1jaGVja3NcIiwgXCJ0YXJnZXRcIiwgXCJmbGFtZVwiLCBcInphcFwiLFxuICBcInN0YXJcIiwgXCJzcGFya2xlc1wiLCBcInJvY2tldFwiLCBcImJydXNoXCIsIFwibXVzaWNcIiwgXCJnYW1lcGFkLTJcIiwgXCJkb2dcIixcbl07XG5cbi8vIFNlcGFyYSBhcyBldGlxdWV0YXMgaW5saW5lIChAZXRpcXVldGEpIGRvIHRleHRvIGRlIHVtYSBsaW5oYSBkZSB0YXJlZmEuXG4vLyBEZXZvbHZlIG8gdFx1MDBFRHR1bG8gbGltcG8gKGVzdGlsbyBRdWljayBBZGQgZG8gVG9kb2lzdCkgKyBldGlxdWV0YXMgY29tYmluYWRhc1xuLy8gKGFzIGRvIHBhY290ZSBwcmltZWlybywgZGVwb2lzIGFzIGlubGluZSwgc2VtIGR1cGxpY2FyKS5cbmZ1bmN0aW9uIHNwbGl0VGFza0xhYmVscyhsaW5lOiBzdHJpbmcsIHBrZ0xhYmVsczogc3RyaW5nW10gPSBbXSk6IHsgdGl0bGU6IHN0cmluZzsgbGFiZWxzOiBzdHJpbmdbXTsgcHJpb3JpdHk6IG51bWJlciB9IHtcbiAgY29uc3QgaW5saW5lOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgcHJpb3JpdHkgPSAxOyAgIC8vIEFQSTogMSA9IHA0IChwYWRyXHUwMEUzbykgXHUyMDI2IDQgPSBwMVxuICAvLyBTXHUwMEYzIGBAZXRpcXVldGFgIC8gYHBOYCBubyBpblx1MDBFRGNpbyBvdSBkZXBvaXMgZGUgZXNwYVx1MDBFN28gKGxvb2tiZWhpbmQpIFx1MjAxNCBuXHUwMEUzbyBwZWdhIG8gXCJAZ21haWxcIlxuICAvLyBkZSB1bSBlLW1haWwgbmVtIG8gXCJwMVwiIGRlIFwidG9wMVwiLlxuICBjb25zdCBzdHJpcHBlZCA9IGxpbmVcbiAgICAucmVwbGFjZSgvKD88PV58XFxzKUAoW1xccHtMfVxccHtOfV9dKykvZ3UsIChfbSwgbmFtZTogc3RyaW5nKSA9PiB7IGlubGluZS5wdXNoKG5hbWUpOyByZXR1cm4gXCJcIjsgfSlcbiAgICAucmVwbGFjZSgvKD88PV58XFxzKXAoWzEtNF0pKD89XFxzfCQpL2dpLCAoX20sIGQ6IHN0cmluZykgPT4geyBwcmlvcml0eSA9IDUgLSBOdW1iZXIoZCk7IHJldHVybiBcIlwiOyB9KVxuICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csIFwiIFwiKS50cmltKCk7XG4gIGNvbnN0IHRpdGxlID0gc3RyaXBwZWQgfHwgbGluZS50cmltKCk7XG4gIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5wa2dMYWJlbHMsIC4uLmlubGluZV0pXTtcbiAgcmV0dXJuIHsgdGl0bGUsIGxhYmVscywgcHJpb3JpdHkgfTtcbn1cblxuLy8gQWNlc3NpYmlsaWRhZGU6IGZheiB1bSBlbGVtZW50byBjbGljXHUwMEUxdmVsIChkaXYvc3Bhbikgc2UgY29tcG9ydGFyIGNvbW8gYm90XHUwMEUzbyBcdTIwMTRcbi8vIGZvY28gcG9yIHRlY2xhZG8gKFRhYiksIHBhcGVsIEFSSUEgZSBhdGl2YVx1MDBFN1x1MDBFM28gcG9yIEVudGVyL0VzcGFcdTAwRTdvIChkaXNwYXJhIG8gcHJcdTAwRjNwcmlvXG4vLyBvbmNsaWNrKS4gTyBub21lIGFjZXNzXHUwMEVEdmVsIHZlbSBkbyB0ZXh0by9gdGl0bGVgIHF1ZSBvIGNoYW1hZG9yIGpcdTAwRTEgZGVmaW5lLlxuZnVuY3Rpb24gY2xpY2thYmxlPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWw6IFQsIGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKTogVCB7XG4gIGVsLm9uY2xpY2sgPSBoYW5kbGVyO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7IGUucHJldmVudERlZmF1bHQoKTsgZWwuY2xpY2soKTsgfVxuICB9KTtcbiAgcmV0dXJuIGVsO1xufVxuXG4vLyBQb3BvdmVyIGZsdXR1YW50ZSBnZW5cdTAwRTlyaWNvLCBhbmNvcmFkbyBudW0gZWxlbWVudG8uIGBmaWxsKGJvZHksIGNsb3NlKWAgbW9udGEgb1xuLy8gY29udGVcdTAwRkFkby4gRmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjYXBlIChvcHRzLm9uQ2xvc2Ugcm9kYSBhbnRlcyBkZSByZW1vdmVyKS5cbmZ1bmN0aW9uIG9wZW5Qb3BvdmVyKFxuICBhbmNob3I6IEhUTUxFbGVtZW50LFxuICBmaWxsOiAoYm9keTogSFRNTEVsZW1lbnQsIGNsb3NlOiAoKSA9PiB2b2lkKSA9PiB2b2lkLFxuICBvcHRzOiB7IGNscz86IHN0cmluZzsgd2lkdGg/OiBudW1iZXI7IG9uQ2xvc2U/OiAoKSA9PiB2b2lkOyBjb250YWluZXI/OiBIVE1MRWxlbWVudCB9ID0ge30sXG4pOiAoKSA9PiB2b2lkIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZC1wb3BcIikuZm9yRWFjaChlID0+IGUucmVtb3ZlKCkpO1xuICAvLyBQb3IgcGFkclx1MDBFM28gdml2ZSBubyBkb2N1bWVudC5ib2R5OyBkZW50cm8gZGEgbW9kYWwgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgcHJlY2lzYSB2aXZlciBub1xuICAvLyBjb250YWluZXIgZGEgYWJhIChzZW5cdTAwRTNvIGEgbW9kYWwgcHJlbmRlIG8gZm9jbyBlIG5cdTAwRTNvIGRcdTAwRTEgcGFyYSBkaWdpdGFyIG5vIHRleHRhcmVhKS5cbiAgY29uc3QgcG9wID0gKG9wdHMuY29udGFpbmVyID8/IGRvY3VtZW50LmJvZHkpLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3BcIiArIChvcHRzLmNscyA/IFwiIFwiICsgb3B0cy5jbHMgOiBcIlwiKSB9KTtcbiAgaWYgKG9wdHMud2lkdGgpIHBvcC5zdHlsZS53aWR0aCA9IGAke29wdHMud2lkdGh9cHhgO1xuXG4gIGNvbnN0IG9uRG9jID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgTm9kZTtcbiAgICBpZiAoIXBvcC5jb250YWlucyh0KSAmJiB0ICE9PSBhbmNob3IgJiYgIWFuY2hvci5jb250YWlucyh0KSkgY2xvc2UoKTtcbiAgfTtcbiAgY29uc3Qgb25LZXkgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4geyBpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpIGNsb3NlKCk7IH07XG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIG9wdHMub25DbG9zZT8uKCk7XG4gICAgcG9wLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Eb2MsIHRydWUpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5LCB0cnVlKTtcbiAgfVxuXG4gIGZpbGwocG9wLCBjbG9zZSk7XG5cbiAgY29uc3QgciA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcG9wLnN0eWxlLnRvcCA9IGAke3IuYm90dG9tICsgNH1weGA7XG4gIHBvcC5zdHlsZS5sZWZ0ID0gYCR7ci5sZWZ0fXB4YDtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBjb25zdCBwciA9IHBvcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAocHIucmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIHBvcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgd2luZG93LmlubmVyV2lkdGggLSBwci53aWR0aCAtIDgpfXB4YDtcbiAgICBpZiAocHIuYm90dG9tID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgcG9wLnN0eWxlLnRvcCA9IGAke01hdGgubWF4KDgsIHIudG9wIC0gcHIuaGVpZ2h0IC0gNCl9cHhgO1xuICB9KTtcblxuICAvLyBSZWdpc3RyYSBkZXBvaXMgZG8gY2xpcXVlIGRlIGFiZXJ0dXJhIHBhcmEgblx1MDBFM28gZmVjaGFyIGltZWRpYXRhbWVudGUuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Eb2MsIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5LCB0cnVlKTtcbiAgfSwgMCk7XG4gIHJldHVybiBjbG9zZTtcbn1cblxuLy8gUG9wb3ZlciBkZSBzZWxlXHUwMEU3XHUwMEUzbyBkZSBcdTAwRURjb25lIChwYWxldGEpLiBgY3VycmVudGAgPSBcdTAwRURjb25lIHNlbGVjaW9uYWRvIChkZXN0YWNhKS5cbmZ1bmN0aW9uIG9wZW5JY29uUG9wb3ZlcihhbmNob3I6IEhUTUxFbGVtZW50LCBjdXJyZW50OiBzdHJpbmcgfCB1bmRlZmluZWQsIG9uUGljazogKGljb246IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4gdm9pZCkge1xuICBvcGVuUG9wb3ZlcihhbmNob3IsIChwb3AsIGNsb3NlKSA9PiB7XG4gICAgY29uc3Qgbm9uZSA9IHBvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29ub3B0IHdkLXBrZy1pY29ubm9uZVwiICsgKCFjdXJyZW50ID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjAxNFwiIH0pO1xuICAgIG5vbmUuc2V0QXR0cihcInRpdGxlXCIsIFwiU2VtIFx1MDBFRGNvbmVcIik7XG4gICAgY2xpY2thYmxlKG5vbmUsICgpID0+IHsgb25QaWNrKHVuZGVmaW5lZCk7IGNsb3NlKCk7IH0pO1xuICAgIGZvciAoY29uc3QgaWMgb2YgUEtHX0lDT05TKSB7XG4gICAgICBjb25zdCBvcHQgPSBwb3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbm9wdFwiICsgKGN1cnJlbnQgPT09IGljID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgcmVuZGVySWNvbihvcHQsIGljKTtcbiAgICAgIG9wdC5zZXRBdHRyKFwidGl0bGVcIiwgaWMpO1xuICAgICAgY2xpY2thYmxlKG9wdCwgKCkgPT4geyBvblBpY2soaWMpOyBjbG9zZSgpOyB9KTtcbiAgICB9XG4gIH0sIHsgY2xzOiBcIndkLWljb24tcG9wXCIgfSk7XG59XG5cbi8vIEJ1c2NhIGFzIHRhcmVmYXMgYXRpdmFzIChuXHUwMEUzbyBjb25jbHVcdTAwRURkYXMpIHZpYSBBUEkgdW5pZmljYWRhIHYxIChhIFJFU1QgdjIgZm9pXG4vLyBhcG9zZW50YWRhIFx1MjE5MiByZXNwb25kaWEgNDEwKS4gQSB2MSBcdTAwRTkgcGFnaW5hZGE6IHsgcmVzdWx0cywgbmV4dF9jdXJzb3IgfS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RUYXNrW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0VGFza1tdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgLy8gdjEgZW52ZWxvcGEgZW0gcmVzdWx0czsgdG9sZXJhIHJlc3Bvc3RhIGNvbW8gYXJyYXkgcHVybyBwb3Igc2VndXJhblx1MDBFN2EuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFRhc2tbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvciAmJiArK3BhZ2VzIDwgVE9ET19NQVhfUEFHRVMpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdFByb2plY3Qge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8vIEJ1c2NhIG9zIHByb2pldG9zIChwYXJhIG8gZmlsdHJvKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhIGRhcyB0YXJlZmFzLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFByb2plY3RbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBwYWdlcyA9IDA7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Byb2plY3RzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RQcm9qZWN0W107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RQcm9qZWN0W10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RMYWJlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZzsgICAvLyBub21lIGRhIHBhbGV0YSAoZXguOiBcImNoYXJjb2FsXCIpXG59XG5cbi8vIEJ1c2NhIGFzIGV0aXF1ZXRhcyBwZXNzb2FpcyAocGFyYSBjb2xvcmlyIG9zIGNoaXBzKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RMYWJlbFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdExhYmVsW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBwYWdlcyA9IDA7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL2xhYmVsc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0TGFiZWxbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdExhYmVsW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFN5bmN0aGluZyAoQVBJIFJFU1QpIFx1MjAxNCB2MC4xMC4wIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgU1RGb2xkZXIgeyBpZDogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IHBhdXNlZDogYm9vbGVhbiB9XG5pbnRlcmZhY2UgU1REZXZpY2UgeyBkZXZpY2VJRDogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfVxuaW50ZXJmYWNlIFNUU3RhdHVzIHsgc3RhdGU6IHN0cmluZzsgbmVlZEZpbGVzOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBlcnJvcnM6IG51bWJlcjsgcHVsbEVycm9yczogbnVtYmVyIH1cbmludGVyZmFjZSBTVENvbXBsZXRpb24geyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlciB9XG5cbmludGVyZmFjZSBTeW5jRGV2Um93IHsgbmFtZTogc3RyaW5nOyBvbmxpbmU6IGJvb2xlYW47IGNvbXBsZXRpb246IG51bWJlcjsgZ2xvYmFsSXRlbXM6IG51bWJlcjsgbmVlZEl0ZW1zOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBuZWVkRGVsZXRlczogbnVtYmVyOyBsYXN0U2Vlbjogc3RyaW5nIH1cbmludGVyZmFjZSBTeW5jRGF0YSB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZm9sZGVyTGFiZWw6IHN0cmluZzsgZXJyb3JzOiBudW1iZXI7IGRldmljZXM6IFN5bmNEZXZSb3dbXSB9XG5cbmZ1bmN0aW9uIGh1bWFuQnl0ZXMobjogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKCFuKSByZXR1cm4gXCIwIEJcIjtcbiAgaWYgKG4gPCAxMDI0KSByZXR1cm4gYCR7bn0gQmA7XG4gIGlmIChuIDwgMTA0ODU3NikgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZChuIDwgMTAyNDAgPyAxIDogMCl9IEtCYDtcbiAgcmV0dXJuIGAkeyhuIC8gMTA0ODU3NikudG9GaXhlZChuIDwgMTA0ODU3NjAgPyAxIDogMCl9IE1CYDtcbn1cblxuZnVuY3Rpb24gcmVsVGltZShpc286IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIGlmIChpc05hTih0KSB8fCB0IDwgMSkgcmV0dXJuIFwiXHUyMDE0XCI7XG4gIGNvbnN0IHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gdCkgLyAxMDAwKTtcbiAgaWYgKHMgPCA2MCkgcmV0dXJuIFwiYWdvcmFcIjtcbiAgaWYgKHMgPCAzNjAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyA2MCl9IG1pbmA7XG4gIGlmIChzIDwgODY0MDApIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDM2MDApfSBoYDtcbiAgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gODY0MDApfSBkYDtcbn1cblxuLy8gR0VUIGdlblx1MDBFOXJpY28gbmEgQVBJIGRvIFN5bmN0aGluZyAoaGVhZGVyIFgtQVBJLUtleTsgcmVxdWVzdFVybCBpZ25vcmEgQ09SUykuXG5hc3luYyBmdW5jdGlvbiBzdEdldDxUPihiYXNlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgdXJsID0gYmFzZS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7IHVybCwgbWV0aG9kOiBcIkdFVFwiLCBoZWFkZXJzOiB7IFwiWC1BUEktS2V5XCI6IGtleSB9LCB0aHJvdzogZmFsc2UgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJBUEkga2V5IGludlx1MDBFMWxpZGEgKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVDtcbn1cblxuLy8gVVJMIHBhcmEgYWJyaXIgYSB0YXJlZmEgbm8gVG9kb2lzdCAodXNhIGEgZG8gcGF5bG9hZCBvdSBtb250YSBhIHBhcnRpciBkbyBpZCkuXG5mdW5jdGlvbiB0YXNrVXJsKHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHtcbiAgcmV0dXJuIHQudXJsID8/IGBodHRwczovL2FwcC50b2RvaXN0LmNvbS9hcHAvdGFzay8ke3QuaWR9YDtcbn1cblxuLy8gQ29uY2x1aSAoZmVjaGEpIHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gUE9TVCBzZW0gY29ycG87IDIwNCA9IHN1Y2Vzc28uIEZhc2UgOC4yLlxuYXN5bmMgZnVuY3Rpb24gY2xvc2VUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9jbG9zZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEVzY3JpdGE6IGNyaWFyIC8gZWRpdGFyIC8gbW92ZXIgLyBleGNsdWlyICh2MC44LjApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDYW1wb3MgZ3Jhdlx1MDBFMXZlaXMuIFRvZG9zIG9wY2lvbmFpcyBcdTIwMTQgbm8gZWRpdGFyIG1hbmRvIHNcdTAwRjMgbyBxdWUgbXVkb3UuXG5pbnRlcmZhY2UgVG9kb2lzdFdyaXRlIHtcbiAgY29udGVudD86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5PzogbnVtYmVyOyAgICAgLy8gMS4uNCAoNCA9IHVyZ2VudGUgLyBwMSBuYSBVSSlcbiAgZHVlX2RhdGU/OiBzdHJpbmc7ICAgICAvLyBkYXRhIGZpeGEgWVlZWS1NTS1ERCAodmluZG8gZG8gY2FsZW5kXHUwMEUxcmlvKVxuICBkdWVfc3RyaW5nPzogc3RyaW5nOyAgIC8vIGxpbmd1YWdlbSBuYXR1cmFsOyBcIm5vIGRhdGVcIiBsaW1wYSBhIGRhdGFcbiAgZHVlX2xhbmc/OiBzdHJpbmc7ICAgICAvLyBcInB0XCIgXHUyMTkyIGludGVycHJldGEgZW0gcG9ydHVndVx1MDBFQXNcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGpzb25IZWFkZXJzKHRva2VuOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH07XG59XG5cbi8vIENyaWEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3MgXHUyMTkyIDIwMCBjb20gYSB0YXJlZmEgY3JpYWRhLlxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgZmllbGRzOiBUb2RvaXN0V3JpdGUpOiBQcm9taXNlPFRvZG9pc3RUYXNrPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIixcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmaWVsZHMpLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFRvZG9pc3RUYXNrO1xufVxuXG4vLyBFZGl0YSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcy97aWR9IFx1MjE5MiAyMDAuIE5cdTAwRTNvIHRyb2NhIGRlIHByb2pldG8gKHVzZSBtb3ZlVG9kb2lzdFRhc2spLlxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgZmllbGRzOiBUb2RvaXN0V3JpdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmaWVsZHMpLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gTW92ZSBhIHRhcmVmYSBwYXJhIG91dHJvIHByb2pldG8uIFBPU1QgL3Rhc2tzL3tpZH0vbW92ZSBcdTIxOTIgMjAwLlxuYXN5bmMgZnVuY3Rpb24gbW92ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHByb2plY3RfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vbW92ZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwcm9qZWN0X2lkIH0pLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIEV4Y2x1aSBhIHRhcmVmYS4gREVMRVRFIC90YXNrcy97aWR9IFx1MjE5MiAyMDQuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDQgJiYgcmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR2FtaWZpY2FcdTAwRTdcdTAwRTNvOiBjb25jbHVcdTAwRURkYXMgKyBsb2cgbm8gY29mcmUgKyBjXHUwMEUxbGN1bG8gKHYwLjEzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQnVzY2EgY29uY2x1XHUwMEVEZGFzIHBvciBkYXRhIGRlIGNvbmNsdXNcdTAwRTNvLiBBUEkgdjE6IHsgaXRlbXMsIG5leHRfY3Vyc29yIH0sIHBhZ2luYWRhLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb21wbGV0ZWRUYXNrcyh0b2tlbjogc3RyaW5nLCBzaW5jZTogc3RyaW5nLCB1bnRpbDogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvY29tcGxldGVkL2J5X2NvbXBsZXRpb25fZGF0ZVwiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcInNpbmNlXCIsIHNpbmNlKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcInVudGlsXCIsIHVudGlsKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IGl0ZW1zPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgYWxsLnB1c2goLi4uKGRhdGEuaXRlbXMgPz8gW10pKTtcbiAgICBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7XG4gIH0gd2hpbGUgKGN1cnNvciAmJiArK3BhZ2VzIDwgVE9ET19NQVhfUEFHRVMpO1xuICByZXR1cm4gYWxsO1xufVxuXG4vLyBVbSBldmVudG8gZG8gbG9nIGRlIGdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodGFyZWZhIGZlaXRhID0gK1hQOyBuXHUwMEUzby1mZWl0YSA9IFx1MjIxMlhQKS5cbnR5cGUgR2FtZUV2ZW50VHlwZSA9IFwiZmVpdG9cIiB8IFwibmFvLWZlaXRvXCI7XG5pbnRlcmZhY2UgR2FtZUV2ZW50IHtcbiAgZGF0ZTogc3RyaW5nOyAgICAgLy8gWVlZWS1NTS1ERCAoZGlhIGxvY2FsIGRhIGNvbmNsdXNcdTAwRTNvL21hcmNhXHUwMEU3XHUwMEUzbylcbiAgdHlwZTogR2FtZUV2ZW50VHlwZTtcbiAgeHA6IG51bWJlcjsgICAgICAgLy8gYXNzaW5hZG9cbiAga2V5OiBzdHJpbmc7ICAgICAgLy8gaWRlbXBvdFx1MDBFQW5jaWE6IGAke3Rhc2tJZH18JHtjb21wbGV0ZWRfYXR8dHN9YFxuICBjb250ZW50OiBzdHJpbmc7XG4gIHByb2plY3Q6IHN0cmluZzsgIC8vIG5vbWUgZG8gcHJvamV0byAob3UgaWQgc2UgZGVzY29uaGVjaWRvKVxuICBsYWJlbHM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgR2FtZVN0YXRzIHtcbiAgdG90YWxYcDogbnVtYmVyO1xuICBsZXZlbDogbnVtYmVyO1xuICB4cEludG9MZXZlbDogbnVtYmVyO1xuICB4cEZvck5leHQ6IG51bWJlcjtcbiAgc3RyZWFrQ3VycmVudDogbnVtYmVyO1xuICBzdHJlYWtCZXN0OiBudW1iZXI7XG4gIHRvZGF5WHA6IG51bWJlcjtcbiAgdG9kYXlDb3VudDogbnVtYmVyO1xuICBieURheTogTWFwPHN0cmluZywgeyB4cDogbnVtYmVyOyBjb3VudDogbnVtYmVyIH0+O1xuICBieVByb2plY3Q6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgLy8gc1x1MDBGMyBcImZlaXRvXCJcbiAgYnlMYWJlbDogTWFwPHN0cmluZywgbnVtYmVyPjsgICAgIC8vIHNcdTAwRjMgXCJmZWl0b1wiXG59XG5cbi8vIEJhc2UgZGEgY3VydmEgZGUgblx1MDBFRHZlbDogWFAgdG90YWwgcGFyYSBvIG5cdTAwRUR2ZWwgTCA9IFhQX0xFVkVMX0JBU0UgXHUwMEI3IExcdTAwQjIgKHF1YWRyXHUwMEUxdGljYSwgU0VNIHRldG8pLlxuLy8gTXVkZSBlc3RhIGNvbnN0YW50ZSBwYXJhIGVuY3VydGFyL2Fsb25nYXIgYSBwcm9ncmVzc1x1MDBFM28gKHZlciBkb2MgXCJHYW1pZmljYVx1MDBFN1x1MDBFM28gXHUyMDE0IE5cdTAwRUR2ZWlzIGUgQ29ucXVpc3Rhc1wiKS5cbmNvbnN0IFhQX0xFVkVMX0JBU0UgPSAxMDA7XG5mdW5jdGlvbiBnYW1lTGV2ZWwoeHA6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiB4cCA8PSAwID8gMCA6IE1hdGguZmxvb3IoTWF0aC5zcXJ0KHhwIC8gWFBfTEVWRUxfQkFTRSkpO1xufVxuLy8gTlx1MDBFRHZlbCArIHByb2dyZXNzbyBwYXJhIHVtIHRvdGFsIGRlIFhQIChnZXJhbCBvdSBwb3IgZXNjb3BvKS4gWFAgcC8gblx1MDBFRHZlbCBMID0gQkFTRVx1MDBCN0xcdTAwQjIuXG5mdW5jdGlvbiBsZXZlbEluZm8oeHA6IG51bWJlcik6IHsgbGV2ZWw6IG51bWJlcjsgaW50bzogbnVtYmVyOyBmb3JOZXh0OiBudW1iZXI7IHBjdDogbnVtYmVyIH0ge1xuICBjb25zdCBsZXZlbCA9IGdhbWVMZXZlbCh4cCk7XG4gIGNvbnN0IGludG8gPSBNYXRoLm1heCgwLCB4cCkgLSBYUF9MRVZFTF9CQVNFICogbGV2ZWwgKiBsZXZlbDtcbiAgY29uc3QgZm9yTmV4dCA9IFhQX0xFVkVMX0JBU0UgKiAoMiAqIGxldmVsICsgMSk7XG4gIHJldHVybiB7IGxldmVsLCBpbnRvLCBmb3JOZXh0LCBwY3Q6IGZvck5leHQgPyBNYXRoLm1pbigxMDAsIE1hdGgucm91bmQoaW50byAvIGZvck5leHQgKiAxMDApKSA6IDAgfTtcbn1cblxuLy8gR3JcdTAwRTFmaWNvIGRlIGxpbmhhIGNvbSBwb250b3MgKFNWRyByZXNwb25zaXZvKSBcdTIwMTQgcmV1c2FkbyBwZWxvIFhQL2RpYSBlIHBlbG8gQ3Jlc2NpbWVudG8uXG4vLyBBIGxpbmhhIFx1MDBFOSB1bSA8cG9seWxpbmU+IGNvbSBzdHJva2Ugblx1MDBFM28tZXNjYWxcdTAwRTF2ZWwgKGVzcGVzc3VyYSB1bmlmb3JtZSBhcGVzYXIgZG8gdmlld0JveFxuLy8gZXN0aWNhZG8pOyBvcyBwb250b3Mgc1x1MDBFM28gZGl2cyBIVE1MIHBvc2ljaW9uYWRvcyBlbSAlIChmaWNhbSByZWRvbmRvcyBlIGxldmFtIG8gdG9vbHRpcCkuXG5pbnRlcmZhY2UgTGluZVBvaW50IHsgdmFsdWU6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgaXNUb2RheTogYm9vbGVhbjsgdGlwOiBzdHJpbmcgfVxuZnVuY3Rpb24gcmVuZGVyTGluZUNoYXJ0KHBhcmVudDogSFRNTEVsZW1lbnQsIHBvaW50czogTGluZVBvaW50W10pOiB2b2lkIHtcbiAgY29uc3QgbiA9IHBvaW50cy5sZW5ndGg7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnBvaW50cy5tYXAocCA9PiBNYXRoLm1heCgwLCBwLnZhbHVlKSksIDEpO1xuICBjb25zdCB4UGN0ID0gKGk6IG51bWJlcikgPT4gbiA8PSAxID8gMCA6IChpIC8gKG4gLSAxKSkgKiAxMDA7XG4gIGNvbnN0IHlQY3QgPSAodjogbnVtYmVyKSA9PiAoMSAtIE1hdGgubWF4KDAsIHYpIC8gbWF4KSAqIDEwMDtcbiAgY29uc3QgY2hhcnQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxpbmUtY2hhcnRcIiB9KTtcbiAgY29uc3Qgd3JhcCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1saW5lLXdyYXBcIiB9KTtcbiAgY29uc3Qgc3ZnTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG4gIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOUywgXCJzdmdcIik7XG4gIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIDEwMCAxMDBcIik7XG4gIHN2Zy5zZXRBdHRyaWJ1dGUoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwibm9uZVwiKTtcbiAgc3ZnLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwid2QtbGluZS1zdmdcIik7XG4gIGNvbnN0IHBvbHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTlMsIFwicG9seWxpbmVcIik7XG4gIHBvbHkuc2V0QXR0cmlidXRlKFwicG9pbnRzXCIsIHBvaW50cy5tYXAoKHAsIGkpID0+IGAke3hQY3QoaSl9LCR7eVBjdChwLnZhbHVlKX1gKS5qb2luKFwiIFwiKSk7XG4gIHBvbHkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ3ZC1saW5lLXBhdGhcIik7XG4gIHN2Zy5hcHBlbmRDaGlsZChwb2x5KTtcbiAgd3JhcC5hcHBlbmRDaGlsZChzdmcpO1xuICBwb2ludHMuZm9yRWFjaCgocCwgaSkgPT4ge1xuICAgIGNvbnN0IGRvdCA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxpbmUtZG90XCIgKyAocC5pc1RvZGF5ID8gXCIgd2QtbGluZS1kb3QtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgIGRvdC5zdHlsZS5sZWZ0ID0gYCR7eFBjdChpKX0lYDtcbiAgICBkb3Quc3R5bGUudG9wID0gYCR7eVBjdChwLnZhbHVlKX0lYDtcbiAgICBkb3Quc2V0QXR0cihcInRpdGxlXCIsIHAudGlwKTtcbiAgfSk7XG4gIGNvbnN0IGxibHMgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGluZS1sYmxzXCIgfSk7XG4gIHBvaW50cy5mb3JFYWNoKChwLCBpKSA9PiB7XG4gICAgY29uc3Qgc2hvdyA9IGkgPT09IDAgfHwgaSA9PT0gbiAtIDEgfHwgaSAlIDcgPT09IDA7XG4gICAgbGJscy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGluZS1sYmxcIiwgdGV4dDogc2hvdyA/IHAubGFiZWwgOiBcIlwiIH0pO1xuICB9KTtcbn1cblxuLy8gQ2FtcG9zIHNlcGFyYWRvcyBwb3IgVEFCIChyb2J1c3RvOiBjb250ZVx1MDBGQWRvL2NoYXZlIG5cdTAwRTNvIGNvbnRcdTAwRUFtIHRhYjsgYSBjaGF2ZSBwb2RlXG4vLyBjb250ZXIgXCJ8XCIgc2VtIGNvbGlkaXIpLiBUYWJzL3F1ZWJyYXMgbm8gdGV4dG8gc1x1MDBFM28gbmV1dHJhbGl6YWRvcy5cbmZ1bmN0aW9uIGVzY2FwZUdhbWVGaWVsZChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bXFxyXFxuXFx0XSsvZywgXCIgXCIpO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplR2FtZUV2ZW50KGU6IEdhbWVFdmVudCk6IHN0cmluZyB7XG4gIGNvbnN0IGxhYmVscyA9IGUubGFiZWxzLm1hcChsID0+IGVzY2FwZUdhbWVGaWVsZChsKS5yZXBsYWNlKC8sL2csIFwiIFwiKSkuam9pbihcIixcIik7XG4gIHJldHVybiBbZS5kYXRlLCBlLnR5cGUsIFN0cmluZyhlLnhwKSwgZS5rZXksIGVzY2FwZUdhbWVGaWVsZChlLmNvbnRlbnQpLCBlc2NhcGVHYW1lRmllbGQoZS5wcm9qZWN0KSwgbGFiZWxzXS5qb2luKFwiXFx0XCIpO1xufVxuZnVuY3Rpb24gcGFyc2VHYW1lRXZlbnRMaW5lKGxpbmU6IHN0cmluZyk6IEdhbWVFdmVudCB8IG51bGwge1xuICBjb25zdCBwID0gbGluZS5zcGxpdChcIlxcdFwiKS5tYXAocyA9PiBzLnRyaW0oKSk7XG4gIGlmIChwLmxlbmd0aCA8IDQpIHJldHVybiBudWxsO1xuICBjb25zdCBbZGF0ZSwgdHlwZSwgeHBSYXcsIGtleSwgY29udGVudCA9IFwiXCIsIHByb2plY3QgPSBcIlwiLCBsYWJlbHNSYXcgPSBcIlwiXSA9IHA7XG4gIGlmICghL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QoZGF0ZSkpIHJldHVybiBudWxsO1xuICBpZiAodHlwZSAhPT0gXCJmZWl0b1wiICYmIHR5cGUgIT09IFwibmFvLWZlaXRvXCIpIHJldHVybiBudWxsO1xuICBjb25zdCB4cCA9IE51bWJlcih4cFJhdyk7XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKHhwKSB8fCAha2V5KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbGFiZWxzID0gbGFiZWxzUmF3ID8gbGFiZWxzUmF3LnNwbGl0KFwiLFwiKS5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pIDogW107XG4gIHJldHVybiB7IGRhdGUsIHR5cGUsIHhwLCBrZXksIGNvbnRlbnQsIHByb2plY3QsIGxhYmVscyB9O1xufVxuLy8gRXh0cmFpIG9zIGV2ZW50b3MgZG8gYmxvY28gY2VyY2FkbyBgYGB3ZC1nYW1lLWxvZyBcdTIwMjYgYGBgIGRhIG5vdGEuXG5mdW5jdGlvbiBwYXJzZUdhbWVMb2coY29udGVudDogc3RyaW5nKTogR2FtZUV2ZW50W10ge1xuICBjb25zdCBtID0gY29udGVudC5tYXRjaChuZXcgUmVnRXhwKFwiYGBgXCIgKyBHQU1FX0xPR19GRU5DRSArIFwiXFxcXHI/XFxcXG4oW1xcXFxzXFxcXFNdKj8pYGBgXCIpKTtcbiAgaWYgKCFtKSByZXR1cm4gW107XG4gIGNvbnN0IG91dDogR2FtZUV2ZW50W10gPSBbXTtcbiAgZm9yIChjb25zdCByYXcgb2YgbVsxXS5zcGxpdChcIlxcblwiKSkge1xuICAgIGNvbnN0IGV2ID0gcGFyc2VHYW1lRXZlbnRMaW5lKHJhdy50cmltKCkpO1xuICAgIGlmIChldikgb3V0LnB1c2goZXYpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4vLyBDb250ZVx1MDBGQWRvIGNvbXBsZXRvIGRhIG5vdGEgKGRldGVybWluXHUwMEVEc3RpY286IGV2ZW50b3Mgb3JkZW5hZG9zIFx1MjE5MiBtZXNtb3MgZXZlbnRvcyA9XG4vLyBtZXNtbyBhcnF1aXZvIGVtIHF1YWxxdWVyIGRpc3Bvc2l0aXZvLCBldml0YW5kbyBjb25mbGl0byBkZSBTeW5jdGhpbmcpLlxuZnVuY3Rpb24gYnVpbGRHYW1lTG9nQ29udGVudChldmVudHM6IEdhbWVFdmVudFtdKTogc3RyaW5nIHtcbiAgY29uc3Qgc29ydGVkID0gWy4uLmV2ZW50c10uc29ydCgoYSwgYikgPT5cbiAgICBhLmRhdGUgPCBiLmRhdGUgPyAtMSA6IGEuZGF0ZSA+IGIuZGF0ZSA/IDEgOiBhLmtleSA8IGIua2V5ID8gLTEgOiBhLmtleSA+IGIua2V5ID8gMSA6IDApO1xuICByZXR1cm4gW1xuICAgIFwiLS0tXCIsIFwib3duZXI6IFdlcnVzXCIsIFwicGVybWlzc2lvbnM6XCIsIFwiICByZWFkOiBbYWxsXVwiLCBcIiAgd3JpdGU6XCIsIFwiICAgIC0gV2VydXNcIiwgXCIgICAgLSBDbGF1ZGVcIixcbiAgICBcInJldmlld2VkOiBmYWxzZVwiLCBcInR5cGU6IHJlZmVyZW5jZVwiLCBcInRhZ3M6IFtnYW1pZmljYWNhb11cIiwgXCItLS1cIiwgXCJcIixcbiAgICBcIiMgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjAxNCBMb2cgZGUgWFBcIiwgXCJcIixcbiAgICBcIj4gQXJxdWl2byAqKmdlcmlkbyBwZWxvIHBsdWdpbiBXZXJ1cyBEYXNoYm9hcmQqKi4gQ2FkYSBsaW5oYSBkbyBibG9jbyBhYmFpeG8gXHUwMEU5IHVtIGV2ZW50b1wiLFxuICAgIFwiPiAodGFyZWZhIGZlaXRhID0gWFAgcG9zaXRpdm8sIG5cdTAwRTNvIGZlaXRhID0gWFAgbmVnYXRpdm8pLiBOXHUwMEUzbyBlZGl0ZSBcdTAwRTAgbVx1MDBFM28gXHUyMDE0IG8gcGFpbmVsIGRvXCIsXG4gICAgXCI+IHBsdWdpbiBtb3N0cmEgblx1MDBFRHZlbCwgc3RyZWFrIGUgZXN0YXRcdTAwRURzdGljYXMgYSBwYXJ0aXIgZGFxdWkuXCIsIFwiXCIsXG4gICAgXCJgYGBcIiArIEdBTUVfTE9HX0ZFTkNFLFxuICAgIHNvcnRlZC5tYXAoc2VyaWFsaXplR2FtZUV2ZW50KS5qb2luKFwiXFxuXCIpLFxuICAgIFwiYGBgXCIsIFwiXCIsXG4gIF0uam9pbihcIlxcblwiKTtcbn1cblxuLy8gU3RyZWFrIGF0dWFsIChhdFx1MDBFOSBob2plL29udGVtKSArIHJlY29yZGUsIGEgcGFydGlyIGRvcyBkaWFzIGNvbSBcdTIyNjUxIFwiZmVpdG9cIi5cbmZ1bmN0aW9uIGNvbXB1dGVTdHJlYWsoZG9uZURheXM6IFNldDxzdHJpbmc+KTogeyBzdHJlYWtDdXJyZW50OiBudW1iZXI7IHN0cmVha0Jlc3Q6IG51bWJlciB9IHtcbiAgaWYgKCFkb25lRGF5cy5zaXplKSByZXR1cm4geyBzdHJlYWtDdXJyZW50OiAwLCBzdHJlYWtCZXN0OiAwIH07XG4gIGNvbnN0IGRheU1zID0gODY0MDAwMDA7XG4gIGNvbnN0IHNvcnRlZCA9IFsuLi5kb25lRGF5c10uc29ydCgpO1xuICBsZXQgYmVzdCA9IDEsIHJ1biA9IDE7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc29ydGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKERhdGUucGFyc2Uoc29ydGVkW2ldICsgXCJUMDA6MDA6MDBcIikgLSBEYXRlLnBhcnNlKHNvcnRlZFtpIC0gMV0gKyBcIlQwMDowMDowMFwiKSA9PT0gZGF5TXMpIHtcbiAgICAgIHJ1bisrOyBiZXN0ID0gTWF0aC5tYXgoYmVzdCwgcnVuKTtcbiAgICB9IGVsc2UgcnVuID0gMTtcbiAgfVxuICBsZXQgY3VyID0gMDtcbiAgbGV0IGN1cnNvciA9IG5ldyBEYXRlKCk7IGN1cnNvci5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgaWYgKCFkb25lRGF5cy5oYXModG9LZXkoY3Vyc29yKSkpIGN1cnNvciA9IG5ldyBEYXRlKGN1cnNvci5nZXRUaW1lKCkgLSBkYXlNcyk7XG4gIHdoaWxlIChkb25lRGF5cy5oYXModG9LZXkoY3Vyc29yKSkpIHsgY3VyKys7IGN1cnNvciA9IG5ldyBEYXRlKGN1cnNvci5nZXRUaW1lKCkgLSBkYXlNcyk7IH1cbiAgcmV0dXJuIHsgc3RyZWFrQ3VycmVudDogY3VyLCBzdHJlYWtCZXN0OiBNYXRoLm1heChiZXN0LCBjdXIpIH07XG59XG5cbi8vIEVzdGF0XHUwMEVEc3RpY2FzIGEgcGFydGlyIGRvcyBldmVudG9zIGRvIGxvZyAoZm9udGUgY2FuXHUwMEY0bmljYSkuXG5mdW5jdGlvbiBjb21wdXRlR2FtZVN0YXRzKGV2ZW50czogR2FtZUV2ZW50W10pOiBHYW1lU3RhdHMge1xuICBjb25zdCBieURheSA9IG5ldyBNYXA8c3RyaW5nLCB7IHhwOiBudW1iZXI7IGNvdW50OiBudW1iZXIgfT4oKTtcbiAgY29uc3QgYnlQcm9qZWN0ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgY29uc3QgYnlMYWJlbCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbFhwID0gMDtcbiAgZm9yIChjb25zdCBlIG9mIGV2ZW50cykge1xuICAgIHRvdGFsWHAgKz0gZS54cDtcbiAgICBjb25zdCBkID0gYnlEYXkuZ2V0KGUuZGF0ZSkgPz8geyB4cDogMCwgY291bnQ6IDAgfTtcbiAgICBkLnhwICs9IGUueHA7XG4gICAgaWYgKGUudHlwZSA9PT0gXCJmZWl0b1wiKSBkLmNvdW50ICs9IDE7XG4gICAgYnlEYXkuc2V0KGUuZGF0ZSwgZCk7XG4gICAgaWYgKGUudHlwZSA9PT0gXCJmZWl0b1wiKSB7XG4gICAgICBjb25zdCBwcm9qID0gZS5wcm9qZWN0IHx8IFwiXHUyMDE0XCI7XG4gICAgICBieVByb2plY3Quc2V0KHByb2osIChieVByb2plY3QuZ2V0KHByb2opID8/IDApICsgZS54cCk7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgZS5sYWJlbHMpIGJ5TGFiZWwuc2V0KGwsIChieUxhYmVsLmdldChsKSA/PyAwKSArIGUueHApO1xuICAgIH1cbiAgfVxuICBpZiAodG90YWxYcCA8IDApIHRvdGFsWHAgPSAwO1xuICBjb25zdCBsZXZlbCA9IGdhbWVMZXZlbCh0b3RhbFhwKTtcbiAgY29uc3QgZG9uZURheXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBlIG9mIGV2ZW50cykgaWYgKGUudHlwZSA9PT0gXCJmZWl0b1wiKSBkb25lRGF5cy5hZGQoZS5kYXRlKTtcbiAgY29uc3QgeyBzdHJlYWtDdXJyZW50LCBzdHJlYWtCZXN0IH0gPSBjb21wdXRlU3RyZWFrKGRvbmVEYXlzKTtcbiAgY29uc3QgdG9kYXkgPSBieURheS5nZXQodG9LZXkobmV3IERhdGUoKSkpID8/IHsgeHA6IDAsIGNvdW50OiAwIH07XG4gIHJldHVybiB7XG4gICAgdG90YWxYcCwgbGV2ZWwsXG4gICAgeHBJbnRvTGV2ZWw6IHRvdGFsWHAgLSBYUF9MRVZFTF9CQVNFICogbGV2ZWwgKiBsZXZlbCxcbiAgICB4cEZvck5leHQ6IFhQX0xFVkVMX0JBU0UgKiAoMiAqIGxldmVsICsgMSksXG4gICAgc3RyZWFrQ3VycmVudCwgc3RyZWFrQmVzdCxcbiAgICB0b2RheVhwOiB0b2RheS54cCwgdG9kYXlDb3VudDogdG9kYXkuY291bnQsXG4gICAgYnlEYXksIGJ5UHJvamVjdCwgYnlMYWJlbCxcbiAgfTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG4vLyAobWQvaW1nIGRhIHN1Ylx1MDBFMXJ2b3JlIHZcdTAwRUFtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlLilcbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG4vLyBBZ3JlZ2FkbyBkZSB1cmdcdTAwRUFuY2lhIGRlIHVtYSBzdWJcdTAwRTFydm9yZSAodmVtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlKS5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFVNQSBwYXNzYWRhIChERlMpIG1vbnRhIG9zIGFncmVnYWRvcyBwb3IgcGFzdGEgKHN1Ylx1MDBFMXJ2b3JlKSArIG9zIGdsb2JhaXMgcXVlXG4vLyB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIGNvbnNvbWVtIFx1MjAxNCBhbnRlcyBjYWRhIHNlXHUwMEU3XHUwMEUzbyB2YXJyaWEgbyBjb2ZyZSBwb3IgY29udGEgcHJcdTAwRjNwcmlhXG4vLyAofjhcdTIwMTMxMFx1MDBENyBwb3IgcmVuZGVyKS4gSW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdCBlIHJlY3JpYWRvIHNvYiBkZW1hbmRhLlxuaW50ZXJmYWNlIEZvbGRlckFnZyB7XG4gIG1kOiBudW1iZXI7ICAgICAgICAgIC8vIG5vdGFzIC5tZCAoZXhjZXRvIHN0YXR1cy5tZCkgbmEgc3ViXHUwMEUxcnZvcmVcbiAgaW1nOiBudW1iZXI7ICAgICAgICAgLy8gaW1hZ2VucyBuYSBzdWJcdTAwRTFydm9yZVxuICByZXZpZXdlZDogbnVtYmVyOyAgICAvLyAubWQgY29tIHJldmlld2VkOnRydWUgbmEgc3ViXHUwMEUxcnZvcmVcbiAgdXJnZW5jeTogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyAgIC8vIG5vdGFzIGNvbSB1cmdlbmN5IChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYylcbiAgdXJnZW5jeU1heDogVXJnZW5jeSB8IG51bGw7XG4gIHJlY2VudDogVEZpbGVbXTsgICAgIC8vIGF0XHUwMEU5IDQgbm90YXMgLm1kIG1haXMgcmVjZW50ZXMgKG10aW1lKSBkYSBzdWJcdTAwRTFydm9yZVxufVxuaW50ZXJmYWNlIFZhdWx0Q2FjaGUge1xuICBieUZvbGRlcjogTWFwPHN0cmluZywgRm9sZGVyQWdnPjsgICAgICAgICAgICAgIC8vIHBhdGggZGEgcGFzdGEgXHUyMTkyIGFncmVnYWRvc1xuICBkYXRlZE5vdGVzOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdOyAgIC8vIG5vdGFzIGNvbSBkYXRhIChmcm9udG1hdHRlciBkYXRlOiBvdSBub21lIEFBQUEtTU0tREQpXG4gIGN0aW1lQnlEYXk6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAgICAgICAgICAgLy8gQUFBQS1NTS1ERCBcdTIxOTIgblx1MDBCQSBkZSBub3RhcyBjcmlhZGFzIChjdGltZSlcbiAgdG90YWxOb3RlczogbnVtYmVyO1xuICB0b3RhbFJldmlld2VkOiBudW1iZXI7XG59XG5jb25zdCBFTVBUWV9BR0c6IEZvbGRlckFnZyA9IHsgbWQ6IDAsIGltZzogMCwgcmV2aWV3ZWQ6IDAsIHVyZ2VuY3k6IFtdLCB1cmdlbmN5TWF4OiBudWxsLCByZWNlbnQ6IFtdIH07XG5cbmZ1bmN0aW9uIGJ1aWxkVmF1bHRDYWNoZShhcHA6IEFwcCk6IFZhdWx0Q2FjaGUge1xuICBjb25zdCBieUZvbGRlciA9IG5ldyBNYXA8c3RyaW5nLCBGb2xkZXJBZ2c+KCk7XG4gIGNvbnN0IGRhdGVkTm90ZXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgY29uc3QgY3RpbWVCeURheSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDA7XG5cbiAgY29uc3Qgd2FsayA9IChmb2xkZXI6IFRGb2xkZXIpOiBGb2xkZXJBZ2cgPT4ge1xuICAgIGNvbnN0IGFnZzogRm9sZGVyQWdnID0geyBtZDogMCwgaW1nOiAwLCByZXZpZXdlZDogMCwgdXJnZW5jeTogW10sIHVyZ2VuY3lNYXg6IG51bGwsIHJlY2VudDogW10gfTtcbiAgICBjb25zdCByZWNlbnQ6IFRGaWxlW10gPSBbXTsgICAvLyBjYW5kaWRhdG9zOiBhcnF1aXZvcyBwclx1MDBGM3ByaW9zICsgdG9wLTQgZGUgY2FkYSBmaWxob1xuICAgIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICBjb25zdCBzdWIgPSB3YWxrKGMpO1xuICAgICAgICBhZ2cubWQgKz0gc3ViLm1kOyBhZ2cuaW1nICs9IHN1Yi5pbWc7IGFnZy5yZXZpZXdlZCArPSBzdWIucmV2aWV3ZWQ7XG4gICAgICAgIGlmIChzdWIudXJnZW5jeS5sZW5ndGgpIGFnZy51cmdlbmN5LnB1c2goLi4uc3ViLnVyZ2VuY3kpO1xuICAgICAgICBpZiAoc3ViLnJlY2VudC5sZW5ndGgpIHJlY2VudC5wdXNoKC4uLnN1Yi5yZWNlbnQpO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgICAgYWdnLm1kKys7XG4gICAgICAgICAgcmVjZW50LnB1c2goYyk7XG4gICAgICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgICAgIGNvbnN0IGZtID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgaWYgKGZtPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgeyBhZ2cucmV2aWV3ZWQrKzsgdG90YWxSZXZpZXdlZCsrOyB9XG4gICAgICAgICAgY29uc3QgdSA9IGZtPy51cmdlbmN5O1xuICAgICAgICAgIGlmICh1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiKSBhZ2cudXJnZW5jeS5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICAgICAgY29uc3QgY2sgPSB0b0tleShuZXcgRGF0ZShjLnN0YXQuY3RpbWUpKTtcbiAgICAgICAgICBjdGltZUJ5RGF5LnNldChjaywgKGN0aW1lQnlEYXkuZ2V0KGNrKSA/PyAwKSArIDEpO1xuICAgICAgICAgIGNvbnN0IG0gPSBjLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKGZtPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgICAgICBpZiAoZCkgZGF0ZWROb3Rlcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGFnZy5pbWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWNlbnQuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgICBhZ2cucmVjZW50ID0gcmVjZW50LnNsaWNlKDAsIDQpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgYWdnLnVyZ2VuY3kpXG4gICAgICBpZiAoIWFnZy51cmdlbmN5TWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbYWdnLnVyZ2VuY3lNYXhdKSBhZ2cudXJnZW5jeU1heCA9IGl0LmxldmVsO1xuICAgIGFnZy51cmdlbmN5LnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gICAgYnlGb2xkZXIuc2V0KGZvbGRlci5wYXRoLCBhZ2cpO1xuICAgIHJldHVybiBhZ2c7XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiB7IGJ5Rm9sZGVyLCBkYXRlZE5vdGVzLCBjdGltZUJ5RGF5LCB0b3RhbE5vdGVzLCB0b3RhbFJldmlld2VkIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBcdTI1MDBcdTI1MDAgQ29udHJvbGFkb3IgZG8gVG9kb2lzdCAoY29tcGFydGlsaGFkbzogZGFzaGJvYXJkICsgYWJhIGRlZGljYWRhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERldFx1MDBFOW0gbyBlc3RhZG8gZGFzIHRhcmVmYXMsIGEgYnVzY2EsIGEgcmVuZGVyaXphXHUwMEU3XHUwMEUzbyBkYSBsaXN0YSBlIGFzIGFcdTAwRTdcdTAwRjVlc1xuLy8gKGNyaWFyL2VkaXRhci9jb25jbHVpci9leGNsdWlyKS4gYHJlcmVuZGVyYCBcdTAwRTkgbyBjYWxsYmFjayBkYSB2aWV3IGRvbmEgKHJlLXJlbmRlclxuLy8gY29tcGxldG8pLiBUZW0gdG9vbHRpcCBwclx1MDBGM3ByaW8gcGFyYSBuXHUwMEUzbyBkZXBlbmRlciBkYSB2aWV3LlxuY2xhc3MgVG9kb2lzdENvbnRyb2xsZXIge1xuICBwcml2YXRlIHRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIGxhYmVsQ29sb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSBsb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgbGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgbm9EYXRlT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge1xuICAgIHRoaXMubG9hZENhY2hlKCk7ICAgLy8gbW9zdHJhIG8gXHUwMEZBbHRpbW8gcmVzdWx0YWRvIG5hIGhvcmEgKG9mZmxpbmUpLCBhbnRlcyBkbyAxXHUwMEJBIGZldGNoXG4gIH1cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgLy8gTm9tZSBkbyBwcm9qZXRvIHBlbG8gaWQgKHJldXNhZG8gcGVsYSBHYW1pZmljYVx1MDBFN1x1MDBFM28pLiBWYXppbyBzZSBkZXNjb25oZWNpZG8uXG4gIHByb2plY3ROYW1lKGlkPzogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIChpZCAmJiB0aGlzLnByb2plY3RNYXAuZ2V0KGlkKSkgfHwgXCJcIjsgfVxuICAvLyBOb21lcyBkZSBwcm9qZXRvcy9ldGlxdWV0YXMgcXVlIGV4aXN0ZW0gaG9qZSBubyBUb2RvaXN0IChwYXJhIHNpbmFsaXphciBvcyBxdWUgc3VtaXJhbSkuXG4gIGtub3duUHJvamVjdHMoKTogU2V0PHN0cmluZz4geyByZXR1cm4gbmV3IFNldCh0aGlzLnByb2plY3RNYXAudmFsdWVzKCkpOyB9XG4gIGtub3duTGFiZWxzKCk6IFNldDxzdHJpbmc+IHsgcmV0dXJuIG5ldyBTZXQodGhpcy5sYWJlbENvbG9ycy5rZXlzKCkpOyB9XG5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUZpbHRlcnModGFza3M6IFRvZG9pc3RUYXNrW10pOiBUb2RvaXN0VGFza1tdIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgaWYgKCFmLnByb2plY3RzLmxlbmd0aCAmJiAhZi5sYWJlbHMubGVuZ3RoKSByZXR1cm4gdGFza3M7XG4gICAgY29uc3QgcHMgPSBuZXcgU2V0KGYucHJvamVjdHMpLCBscyA9IG5ldyBTZXQoZi5sYWJlbHMpO1xuICAgIHJldHVybiB0YXNrcy5maWx0ZXIodCA9PiB7XG4gICAgICBpZiAocHMuc2l6ZSAmJiAhKHQucHJvamVjdF9pZCAmJiBwcy5oYXModC5wcm9qZWN0X2lkKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChscy5zaXplICYmICEodC5sYWJlbHMgPz8gW10pLnNvbWUobCA9PiBscy5oYXMobCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENvbG9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxDb2xvcnMuZ2V0KG5hbWUpID8/IExBQkVMX0ZBTExCQUNLO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENoaXAoaG9zdDogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY2xzOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpcCA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMubGFiZWxDb2xvcihuYW1lKTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bmFtZX1gIH0pO1xuICAgIHJldHVybiBjaGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2O1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICBwcml2YXRlIHNob3dUYXNrVGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC10YXNrLXRpcFwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtcHJpXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaU1ldGEodC5wcmlvcml0eSkuY29sb3I7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXRpdGxlXCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgZCA9IHQuZGVzY3JpcHRpb24hLnRyaW0oKTtcbiAgICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtZGVzY1wiLCB0ZXh0OiBkLmxlbmd0aCA+IERFU0NfTUFYID8gZC5zbGljZSgwLCBERVNDX01BWCkgKyBcIlx1MjAyNlwiIDogZCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRhc2tUaXAoZWw6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rhc2tUaXAoZWwsIHQpKTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNsaWNrYWJsZShjaGVjaywgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCk7IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAmJiBwcm9qKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1wcm9qXCIsIHRleHQ6IHByb2ogfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB0aGlzLmxhYmVsQ2hpcChyb3csIGwsIFwid2QtdG9kby1yb3ctbGFiZWxcIik7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKHNob3dEYXRlICYmIGRrKSB7XG4gICAgICBjb25zdCBbLCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfWAgfSk7XG4gICAgfVxuICAgIGlmICh0LmR1ZT8uaXNfcmVjdXJyaW5nKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlY3VyXCIsIHRleHQ6IFwiXHUyN0YzXCIgfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHggPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXVuZG9uZVwiIH0pO1xuICAgICAgc2V0SWNvbih4LCBcInhcIik7XG4gICAgICB4LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5cdTAwRTNvIGZlaXRhIFx1MjAxNCBwdW5pXHUwMEU3XHUwMEUzbyBkZSBYUCBlIGFwYWdhIGRvIFRvZG9pc3RcIik7XG4gICAgICBjbGlja2FibGUoeCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4uZ2FtZS5tYXJrVW5kb25lKHQpOyB9KTtcbiAgICB9XG4gICAgY2xpY2thYmxlKHJvdywgKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KSk7XG4gICAgdGhpcy5hdHRhY2hUYXNrVGlwKHJvdywgdCk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRhc2tCdG4oaG9zdDogSFRNTEVsZW1lbnQsIHByZWZpbGxEdWU/OiBzdHJpbmcsIHRpdGxlID0gXCJOb3ZhIHRhcmVmYVwiKSB7XG4gICAgY29uc3QgYiA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWFkZFwiIH0pO1xuICAgIHNldEljb24oYiwgXCJwbHVzXCIpO1xuICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICBjbGlja2FibGUoYiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJjcmVhdGVcIiwgcHJlZmlsbER1ZSB9KTsgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRm9ybShvcHRzOiB7IG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjsgdGFzaz86IFRvZG9pc3RUYXNrOyBwcmVmaWxsRHVlPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4udGhpcy5sYWJlbENvbG9ycy5rZXlzKCksIC4uLnRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKV0pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIG5ldyBUYXNrRm9ybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICBtb2RlOiBvcHRzLm1vZGUsXG4gICAgICB0YXNrOiBvcHRzLnRhc2ssXG4gICAgICBwcmVmaWxsRHVlOiBvcHRzLnByZWZpbGxEdWUsXG4gICAgICBwcm9qZWN0czogdGhpcy5wcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcy5jb21wb25lbnQsIHtcbiAgICAgIHRhc2s6IHQsXG4gICAgICBwcm9qZWN0TmFtZTogdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdWJtaXRUYXNrRm9ybShtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCIsIHRhc2s6IFRvZG9pc3RUYXNrIHwgdW5kZWZpbmVkLCB2OiBUYXNrRm9ybVZhbHVlcyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB2LmNvbnRlbnQsIHByaW9yaXR5OiB2LnByaW9yaXR5IH07XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uLnRyaW0oKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgaWYgKHYucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHYucHJvamVjdElkO1xuICAgICAgICBpZiAodi5sYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ3JpYWRhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH0gZWxzZSBpZiAodGFzaykge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHt9O1xuICAgICAgICBpZiAodi5jb250ZW50ICE9PSB0YXNrLmNvbnRlbnQpIGZpZWxkcy5jb250ZW50ID0gdi5jb250ZW50O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAhPT0gKHRhc2suZGVzY3JpcHRpb24gPz8gXCJcIikpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb247XG4gICAgICAgIGlmICh2LnByaW9yaXR5ICE9PSB0YXNrLnByaW9yaXR5KSBmaWVsZHMucHJpb3JpdHkgPSB2LnByaW9yaXR5O1xuICAgICAgICBjb25zdCBvbGREYXRlID0gdGFzay5kdWU/LmRhdGUgPyB0YXNrLmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBcIlwiO1xuICAgICAgICBpZiAodi5kdWVEYXRlICE9PSBvbGREYXRlKSB7XG4gICAgICAgICAgaWYgKHYuZHVlRGF0ZSkgZmllbGRzLmR1ZV9kYXRlID0gdi5kdWVEYXRlO1xuICAgICAgICAgIGVsc2UgZmllbGRzLmR1ZV9zdHJpbmcgPSBcIm5vIGRhdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMID0gKHRhc2subGFiZWxzID8/IFtdKS5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCIgXCIpO1xuICAgICAgICBpZiAob2xkTCAhPT0gbmV3TCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGRzKS5sZW5ndGgpIGF3YWl0IHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCBmaWVsZHMpO1xuICAgICAgICBjb25zdCBvbGRQcm9qID0gdGFzay5wcm9qZWN0X2lkID8/IFwiXCI7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCAhPT0gb2xkUHJvaiAmJiB2LnByb2plY3RJZCkgYXdhaXQgbW92ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCB2LnByb2plY3RJZCk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBTYWx2YTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1RDgzRFx1REREMSBFeGNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGV4Y2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY29tcGxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybjtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNsb3NlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDAsIHQpO1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNTdGFsZSgpOiBib29sZWFuIHsgcmV0dXJuIERhdGUubm93KCkgLSB0aGlzLmZldGNoZWRBdCA+PSBUT0RPX1RUTDsgfVxuXG4gIC8vIEF1dG8tcmVmcmVzaCBwZXJpXHUwMEYzZGljbyAoaW50ZXJ2YWxvIG5vIG9ubG9hZCk6IHNcdTAwRjMgYnVzY2Egc2UgaFx1MDBFMSB2aWV3IGFiZXJ0YSwgdG9rZW5cbiAgLy8gY29uZmlndXJhZG8sIG5hZGEgZW0gdm9vIGUgbyBjYWNoZSBwYXNzb3UgZG8gVFRMLiBTZW0gdmlldyBhYmVydGEgPSBzZW0gY2hhbWFkYSBcdTAwRTAgQVBJLlxuICBtYXliZVJlZnJlc2goKSB7XG4gICAgaWYgKCF0aGlzLnN1YnMuc2l6ZSB8fCB0aGlzLmxvYWRpbmcpIHJldHVybjtcbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCkpIHJldHVybjtcbiAgICBpZiAodGhpcy5pc1N0YWxlKCkpIHZvaWQgdGhpcy5mZXRjaChmYWxzZSk7XG4gIH1cblxuICAvLyBDYWNoZSBvZmZsaW5lIChwb3ItZGlzcG9zaXRpdm8sIGxvY2FsU3RvcmFnZSBcdTIxOTIgblx1MDBFM28gc2luY3Jvbml6YSk6IGNhcnJlZ2EgbyBcdTAwRkFsdGltb1xuICAvLyByZXN1bHRhZG8gcGFyYSBhIGFiYSBhYnJpciBqXHUwMEUxIGNvbSBhcyB0YXJlZmFzLCBtZXNtbyBzZW0gaW50ZXJuZXQuXG4gIHByaXZhdGUgbG9hZENhY2hlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSB0aGlzLmFwcC5sb2FkTG9jYWxTdG9yYWdlKExTX1RPRE9fQ0FDSEUpO1xuICAgICAgY29uc3QgYyA9IHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHJhdykgOiByYXc7XG4gICAgICBpZiAoIWMgfHwgIUFycmF5LmlzQXJyYXkoYy50YXNrcykpIHJldHVybjtcbiAgICAgIHRoaXMudGFza3MgPSBjLnRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IEFycmF5LmlzQXJyYXkoYy5wcm9qZWN0cykgPyBjLnByb2plY3RzIDogW107XG4gICAgICB0aGlzLnByb2plY3RNYXAgPSBuZXcgTWFwKHRoaXMucHJvamVjdHMubWFwKChwOiBUb2RvaXN0UHJvamVjdCkgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKEFycmF5LmlzQXJyYXkoYy5sYWJlbHMpID8gYy5sYWJlbHMgOiBbXSk7XG4gICAgICB0aGlzLmZldGNoZWRBdCA9IHR5cGVvZiBjLmZldGNoZWRBdCA9PT0gXCJudW1iZXJcIiA/IGMuZmV0Y2hlZEF0IDogMDtcbiAgICB9IGNhdGNoIHsgLyogY2FjaGUgYXVzZW50ZS9jb3Jyb21waWRvIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgcHJpdmF0ZSBwZXJzaXN0Q2FjaGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfVE9ET19DQUNIRSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0YXNrczogdGhpcy50YXNrcywgcHJvamVjdHM6IHRoaXMucHJvamVjdHMsIGxhYmVsczogWy4uLnRoaXMubGFiZWxDb2xvcnNdLCBmZXRjaGVkQXQ6IHRoaXMuZmV0Y2hlZEF0LFxuICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggeyAvKiBzZXJpYWxpemFcdTAwRTdcdTAwRTNvL3F1b3RhIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgLy8gQXZpc28gZGUgZnJlc2NvciBubyB0b3BvIGRhIGxpc3RhOiBkdXJhbnRlIHVtYSBidXNjYSwgb3UgcXVhbmRvIGVzdGFtb3NcbiAgLy8gZXhpYmluZG8gbyBjYWNoZSBwb3JxdWUgYSBcdTAwRkFsdGltYSBidXNjYSBmYWxob3UgKG9mZmxpbmUpLlxuICBwcml2YXRlIHJlbmRlckZyZXNobmVzcyhob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmxvYWRpbmcpIHsgaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mcmVzaFwiLCB0ZXh0OiBcIkF0dWFsaXphbmRvXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICBjb25zdCB3aGVuID0gdGhpcy5mZXRjaGVkQXQgPyByZWxUaW1lKG5ldyBEYXRlKHRoaXMuZmV0Y2hlZEF0KS50b0lTT1N0cmluZygpKSA6IFwiXHUyMDE0XCI7XG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZyZXNoIHdkLXRvZG8tZnJlc2gtc3RhbGVcIiwgdGV4dDogYFNlbSBjb25leFx1MDBFM28gXHUyMDE0IGV4aWJpbmRvIG8gXHUwMEZBbHRpbW8gY2FycmVnYWRvICgke3doZW59KWAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2gobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4gfHwgdGhpcy5sb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFt0YXNrcywgcHJvamVjdHMsIGxhYmVsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RQcm9qZWN0W10pLFxuICAgICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RMYWJlbFtdKSxcbiAgICAgIF0pO1xuICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcChwcm9qZWN0cy5tYXAocCA9PiBbcC5pZCwgcC5uYW1lXSkpO1xuICAgICAgdGhpcy5sYWJlbENvbG9ycyA9IG5ldyBNYXAobGFiZWxzLm1hcChsID0+IFtsLm5hbWUsIFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLXSkpO1xuICAgICAgdGhpcy5mZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBMYW5cdTAwRTdhIHVtIHBhY290ZTogY3JpYSBjYWRhIHRhcmVmYSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamUuIFNlcXVlbmNpYWxcbiAgLy8gKGV2aXRhIHJhamFkYSBuYSBBUEkpLiBBdHVhbGl6YSBhIGxpc3RhIGFvIGZpbmFsLlxuICBhc3luYyBsYXVuY2hQYWNrYWdlKHBrZzogVGFza1BhY2thZ2UpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdCBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMuXCIpOyByZXR1cm47IH1cbiAgICAvLyBSZXNvbHZlIHRcdTAwRUR0dWxvIGxpbXBvICsgZXRpcXVldGFzIChwYWNvdGUgKyBpbmxpbmUgQGV0aXF1ZXRhKSBwb3IgdGFyZWZhLlxuICAgIGNvbnN0IGl0ZW1zID0gcGtnLnRhc2tzLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikubWFwKGxpbmUgPT4gc3BsaXRUYXNrTGFiZWxzKGxpbmUsIHBrZy5sYWJlbHMgPz8gW10pKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgeyBuZXcgTm90aWNlKFwiUGFjb3RlIHNlbSB0YXJlZmFzLlwiKTsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMubGF1bmNoaW5nLmhhcyhwa2cuaWQpKSByZXR1cm47ICAgLy8galx1MDBFMSBlc3RcdTAwRTEgbGFuXHUwMEU3YW5kbyBcdTIxOTIgaWdub3JhIGNsaXF1ZS1kdXBsb1xuXG4gICAgLy8gQ29uZmlybWFcdTAwRTdcdTAwRTNvIGNvbmZvcm1lIGEgY29uZmlndXJhXHUwMEU3XHUwMEUzbyAoc2VtcHJlIC8gc1x1MDBGMyBtdWl0YXMgLyBudW5jYSkuXG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtO1xuICAgIGNvbnN0IG5lZWRDb25maXJtID0gbW9kZSA9PT0gXCJhbHdheXNcIiB8fCAobW9kZSA9PT0gXCJtYW55XCIgJiYgaXRlbXMubGVuZ3RoID4gTEFVTkNIX0NPTkZJUk1fTUlOKTtcbiAgICBpZiAobmVlZENvbmZpcm0pIHtcbiAgICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICAgIHRpdGxlOiBgTGFuXHUwMEU3YXIgXHUyMDFDJHtwa2cubmFtZSB8fCBcInBhY290ZVwifVx1MjAxRD9gLFxuICAgICAgICBib2R5OiBgSXNzbyB2YWkgY3JpYXIgJHtpdGVtcy5sZW5ndGh9IHRhcmVmYShzKSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamU6YCxcbiAgICAgICAgaXRlbXM6IGl0ZW1zLm1hcChpdCA9PiAoe1xuICAgICAgICAgIHRleHQ6IChpdC5wcmlvcml0eSA+IDEgPyBgWyR7cHJpTWV0YShpdC5wcmlvcml0eSkubGFiZWx9XSBgIDogXCJcIikgKyBpdC50aXRsZSxcbiAgICAgICAgICBsYWJlbHM6IGl0LmxhYmVscy5tYXAobiA9PiAoeyBuYW1lOiBuLCBjb2xvcjogdGhpcy5sYWJlbENvbG9yKG4pIH0pKSxcbiAgICAgICAgfSkpLFxuICAgICAgICBjdGE6IGBMYW5cdTAwRTdhciAke2l0ZW1zLmxlbmd0aH1gLFxuICAgICAgfSk7XG4gICAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXVuY2hpbmcuYWRkKHBrZy5pZCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpOyAgIC8vIG1vc3RyYSBvIGJvdFx1MDBFM28gY29tbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIlxuICAgIGNvbnN0IGR1ZSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGxldCBvayA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAoY29uc3QgeyB0aXRsZSwgbGFiZWxzLCBwcmlvcml0eSB9IG9mIGl0ZW1zKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7IGNvbnRlbnQ6IHRpdGxlLCBkdWVfZGF0ZTogZHVlIH07XG4gICAgICAgICAgaWYgKHBrZy5wcm9qZWN0SWQpIGZpZWxkcy5wcm9qZWN0X2lkID0gcGtnLnByb2plY3RJZDtcbiAgICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IGxhYmVscztcbiAgICAgICAgICBpZiAocHJpb3JpdHkgPiAxKSBmaWVsZHMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgICBhd2FpdCBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbiwgZmllbGRzKTtcbiAgICAgICAgICBvaysrO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbmV3IE5vdGljZShgRmFsaGEgZW0gXCIke3RpdGxlfVwiOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxhdW5jaGluZy5kZWxldGUocGtnLmlkKTtcbiAgICB9XG4gICAgbmV3IE5vdGljZShgXHUyNzEzICR7b2t9LyR7aXRlbXMubGVuZ3RofSB0YXJlZmEocykgbGFuXHUwMEU3YWRhKHMpIFx1MjAxNCAke3BrZy5uYW1lIHx8IFwicGFjb3RlXCJ9YCk7XG4gICAgYXdhaXQgdGhpcy5mZXRjaCh0cnVlKTsgICAvLyByZS1yZW5kZXJpemEgKGxpbXBhIG8gZXN0YWRvIFwibGFuXHUwMEU3YW5kb1x1MjAyNlwiKVxuICB9XG5cbiAgLy8gQmFycmEgZGUgbGFuXHUwMEU3YWRvcmVzIGRlIHBhY290ZXMuIENvbSBgaGVhZGluZ2AsIG1vbnRhIGEgc2VcdTAwRTdcdTAwRTNvIFwiUEFDT1RFU1wiXG4gIC8vIGNvbXBsZXRhIChhYmEgZG8gVG9kb2lzdCk7IHNlbSBlbGUsIHNcdTAwRjMgYSBiYXJyYSBkZSBib3RcdTAwRjVlcyAoZGFzaGJvYXJkLCBlXG4gIC8vIHNvbWUgcXVhbmRvIG5cdTAwRTNvIGhcdTAwRTEgcGFjb3RlcyBwYXJhIG1hbnRlciBvIHBhaW5lbCBlbnh1dG8pLlxuICByZW5kZXJQYWNrYWdlcyhob3N0OiBIVE1MRWxlbWVudCwgb3B0czogeyBoZWFkaW5nPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCBwa2dzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGxldCB0YXJnZXQgPSBob3N0O1xuICAgIGlmIChvcHRzLmhlYWRpbmcpIHtcbiAgICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJQQUNPVEVTXCIgfSk7XG4gICAgICBpZiAoIXBrZ3MubGVuZ3RoKSB7XG4gICAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDcmllIHBhY290ZXMgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZCBcdTIxOTIgUGFjb3RlcyBkZSB0YXJlZmFzLlwiIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0YXJnZXQgPSBzZWM7XG4gICAgfSBlbHNlIGlmICghcGtncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgY29uc3QgYmFyID0gdGFyZ2V0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctYmFyXCIgfSk7XG4gICAgZm9yIChjb25zdCBwa2cgb2YgcGtncykge1xuICAgICAgY29uc3QgdmFsaWQgPSBwa2cudGFza3MuZmlsdGVyKHMgPT4gcy50cmltKCkpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ1c3kgPSB0aGlzLmxhdW5jaGluZy5oYXMocGtnLmlkKTtcbiAgICAgIGNvbnN0IGRpc2FibGVkID0gIXRva2VuIHx8ICF2YWxpZCB8fCBidXN5O1xuICAgICAgY29uc3QgYnRuID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctYnRuXCIgKyAoZGlzYWJsZWQgPyBcIiB3ZC1wa2ctZGlzYWJsZWRcIiA6IFwiXCIpICsgKGJ1c3kgPyBcIiB3ZC1wa2ctYnVzeVwiIDogXCJcIikgfSk7XG4gICAgICBpZiAocGtnLmljb24pIHJlbmRlckljb24oYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb1wiIH0pLCBwa2cuaWNvbik7XG4gICAgICBidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbmFtZVwiLCB0ZXh0OiBwa2cubmFtZSB8fCBcIihzZW0gbm9tZSlcIiB9KTtcbiAgICAgIGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1jb3VudFwiLCB0ZXh0OiBidXN5ID8gXCJcdTIwMjZcIiA6IFN0cmluZyh2YWxpZCkgfSk7XG4gICAgICBidG4uc2V0QXR0cihcInRpdGxlXCIsXG4gICAgICAgIGJ1c3kgPyBcIkxhblx1MDBFN2FuZG9cdTIwMjZcIiA6XG4gICAgICAgICF0b2tlbiA/IFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdFwiIDpcbiAgICAgICAgIXZhbGlkID8gXCJQYWNvdGUgc2VtIHRhcmVmYXNcIiA6XG4gICAgICAgIGBMYW5cdTAwRTdhciAke3ZhbGlkfSB0YXJlZmEocykgbm8gVG9kb2lzdCAoaG9qZSlgKTtcbiAgICAgIGlmICghZGlzYWJsZWQpIGNsaWNrYWJsZShidG4sICgpID0+IHZvaWQgdGhpcy5sYXVuY2hQYWNrYWdlKHBrZykpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRmlsdGVyQmFyKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIGNvbnN0IGJhciA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYmFyXCIgfSk7XG4gICAgaWYgKHRoaXMucHJvamVjdHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIlByb2pldG9zXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcm9qZWN0cykge1xuICAgICAgICBjb25zdCBvbiA9IGYucHJvamVjdHMuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IHAubmFtZSB9KTtcbiAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICBjbGlja2FibGUoY2hpcCwgYXN5bmMgKCkgPT4geyB0aGlzLnRvZ2dsZUZpbHRlcihcInByb2plY3RzXCIsIHAuaWQpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQodGhpcy50YXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBpZiAobGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsYWJlbHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IHRoaXMubGFiZWxDaGlwKGdycCwgbCwgXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikpO1xuICAgICAgICBjaGlwLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG9uKSk7XG4gICAgICAgIGNsaWNrYWJsZShjaGlwLCBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlRmlsdGVyKFwibGFiZWxzXCIsIGwpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xyID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2xlYXJcIiwgdGV4dDogXCJsaW1wYXIgZmlsdHJvc1wiIH0pO1xuICAgICAgY2xpY2thYmxlKGNsciwgYXN5bmMgKCkgPT4geyBmLnByb2plY3RzID0gW107IGYubGFiZWxzID0gW107IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlbmRlcml6YSBvcyBjb250cm9sZXMgZGUgY2FiZVx1MDBFN2FsaG8gKGVtIGBjdHJsc2ApICsgYSBsaXN0YSBkZSB0YXJlZmFzXG4gIC8vIChlbSBgYm9keWApLiBPIGhvc3QgZm9ybmVjZSBvIHJcdTAwRjN0dWxvIGRhIHNlXHUwMEU3XHUwMEUzbyBlIG8gbGF5b3V0IGRvIGNhYmVcdTAwRTdhbGhvLlxuICByZW5kZXJMaXN0KGJvZHk6IEhUTUxFbGVtZW50LCBjdHJsczogSFRNTEVsZW1lbnQsIG9wdHM6IHsgc2hvd0xhdGVyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICAgIGNvbnN0IHNlZyA9IGN0cmxzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJhbmdlXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgWzMsIDddIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGIgPSBzZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJhbmdlLWJ0blwiICsgKHJhbmdlID09PSBuID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBgJHtufWRgIH0pO1xuICAgICAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCBgTW9zdHJhciBvcyBwclx1MDBGM3hpbW9zICR7bn0gZGlhc2ApO1xuICAgICAgICBiLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHJhbmdlID09PSBuKSk7XG4gICAgICAgIGNsaWNrYWJsZShiLCBhc3luYyBlID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IG47XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICAgIGNvbnN0IG5GID0gZi5wcm9qZWN0cy5sZW5ndGggKyBmLmxhYmVscy5sZW5ndGg7XG4gICAgICBjb25zdCBmaWx0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJ0blwiICsgKHRoaXMuZmlsdGVyT3BlbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSArIChuRiA/IFwiIHdkLWFjdGl2ZVwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKGZpbHQsIFwiZmlsdGVyXCIpO1xuICAgICAgZmlsdC5zZXRBdHRyKFwidGl0bGVcIiwgbkYgPyBgRmlsdHJvcyBhdGl2b3MgKCR7bkZ9KSBcdTIwMTQgY2xpcXVlIHBhcmEgYWp1c3RhcmAgOiBcIkZpbHRyYXIgcG9yIHByb2pldG8vZXRpcXVldGFcIik7XG4gICAgICBpZiAobkYpIGZpbHQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRjdFwiLCB0ZXh0OiBTdHJpbmcobkYpIH0pO1xuICAgICAgZmlsdC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyh0aGlzLmZpbHRlck9wZW4pKTtcbiAgICAgIGNsaWNrYWJsZShmaWx0LCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5maWx0ZXJPcGVuID0gIXRoaXMuZmlsdGVyT3BlbjsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMubG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciB0YXJlZmFzIGRvIFRvZG9pc3RcIik7XG4gICAgICBjbGlja2FibGUocmVmcmVzaCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaCh0cnVlKTsgfSk7XG4gICAgICB0aGlzLmFkZFRhc2tCdG4oY3RybHMsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNvbGUgc2V1IHRva2VuIGRvIFRvZG9pc3QgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZCBwYXJhIHZlciBzdWFzIHRhcmVmYXMgYXF1aS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBdXRvLWZldGNoOiBudW5jYSBidXNjb3UsIG91IG8gY2FjaGUgcGFzc291IGRvIFRUTC4gRXJybyBuXHUwMEUzbyBkaXNwYXJhIHJlLXRlbnRhdGl2YVxuICAgIC8vIGF1dG9tXHUwMEUxdGljYSBhcXVpIChldml0YXJpYSBsb29wIGEgY2FkYSByZW5kZXIpOyBvIGludGVydmFsbyBlIG8gYm90XHUwMEUzbyBcdTIxQkIgY3VpZGFtIGRpc3NvLlxuICAgIGlmICghdGhpcy5sb2FkaW5nICYmICF0aGlzLmVycm9yICYmICghdGhpcy5mZXRjaGVkQXQgfHwgdGhpcy5pc1N0YWxlKCkpKSB2b2lkIHRoaXMuZmV0Y2goZmFsc2UpO1xuICAgIGNvbnN0IGhhc0NhY2hlID0gdGhpcy50YXNrcy5sZW5ndGggPiAwO1xuICAgIC8vIEVycm8vY2FycmVnYW5kbyBzXHUwMEYzIG9jdXBhbSBhIFx1MDBFMXJlYSB0b2RhIHF1YW5kbyBOXHUwMEMzTyBoXHUwMEUxIGNhY2hlIHBhcmEgbW9zdHJhciAob2ZmbGluZS1mcmllbmRseSkuXG4gICAgaWYgKHRoaXMuZXJyb3IgJiYgIWhhc0NhY2hlKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZXJyb3JcIiwgdGV4dDogYEVycm8gYW8gYnVzY2FyIHRhcmVmYXM6ICR7dGhpcy5lcnJvcn1gIH0pOyByZXR1cm47IH1cbiAgICBpZiAoIXRoaXMuZmV0Y2hlZEF0ICYmICFoYXNDYWNoZSkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG8gdGFyZWZhc1x1MjAyNlwiIH0pOyByZXR1cm47IH1cbiAgICB0aGlzLnJlbmRlckZyZXNobmVzcyhib2R5KTtcblxuICAgIGlmICh0aGlzLmZpbHRlck9wZW4pIHRoaXMucmVuZGVyRmlsdGVyQmFyKGJvZHkpO1xuXG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgY29uc3QgdG9kYXlLID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgY29uc3QgbGFzdFVwY29taW5nID0gbmV3IERhdGUoKTtcbiAgICBsYXN0VXBjb21pbmcuc2V0RGF0ZShsYXN0VXBjb21pbmcuZ2V0RGF0ZSgpICsgcmFuZ2UpO1xuICAgIGNvbnN0IGxhc3RLID0gdG9LZXkobGFzdFVwY29taW5nKTtcblxuICAgIGNvbnN0IHRhc2tzID0gdGhpcy5hcHBseUZpbHRlcnModGhpcy50YXNrcyk7XG4gICAgY29uc3Qgb3ZlcmR1ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IHRvZGF5VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgVG9kb2lzdFRhc2tbXT4gPSB7fTtcbiAgICBjb25zdCBsYXRlcjogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IG5vRGF0ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiB0YXNrcykge1xuICAgICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgICBpZiAoIWRrKSB7IG5vRGF0ZS5wdXNoKHQpOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRrIDwgdG9kYXlLKSBvdmVyZHVlLnB1c2godCk7XG4gICAgICBlbHNlIGlmIChkayA9PT0gdG9kYXlLKSB0b2RheVRhc2tzLnB1c2godCk7XG4gICAgICBlbHNlIGlmIChkayA8PSBsYXN0SykgKGJ5RGF5W2RrXSA/Pz0gW10pLnB1c2godCk7XG4gICAgICBlbHNlIGxhdGVyLnB1c2godCk7XG4gICAgfVxuICAgIGNvbnN0IGJ5UHJpID0gKGE6IFRvZG9pc3RUYXNrLCBiOiBUb2RvaXN0VGFzaykgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7XG4gICAgLy8gXCJEZXBvaXNcIjogb3JkZW5hIHBvciBEQVRBIChtYWlzIHByXHUwMEYzeGltYSBwcmltZWlybykgZSwgbm8gbWVzbW8gZGlhLCBwb3IgcHJpb3JpZGFkZS5cbiAgICBjb25zdCBieURhdGVUaGVuUHJpID0gKGE6IFRvZG9pc3RUYXNrLCBiOiBUb2RvaXN0VGFzaykgPT4ge1xuICAgICAgY29uc3QgZGEgPSBkdWVLZXkoYSkgPz8gXCJcIiwgZGIgPSBkdWVLZXkoYikgPz8gXCJcIjtcbiAgICAgIGlmIChkYSAhPT0gZGIpIHJldHVybiBkYSA8IGRiID8gLTEgOiAxO1xuICAgICAgcmV0dXJuIGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIH07XG4gICAgb3ZlcmR1ZS5zb3J0KGJ5UHJpKTsgdG9kYXlUYXNrcy5zb3J0KGJ5UHJpKTsgbGF0ZXIuc29ydChieURhdGVUaGVuUHJpKTsgbm9EYXRlLnNvcnQoYnlQcmkpO1xuICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhieURheSkpIGJ5RGF5W2tdLnNvcnQoYnlQcmkpO1xuXG4gICAgLy8gXCJEZXBvaXNcIiBlIFwiU2VtIGRhdGFcIiBzXHUwMEYzIGFwYXJlY2VtIG5hIGFiYSBkZWRpY2FkYSAoc2hvd0xhdGVyICE9PSBmYWxzZSkuXG4gICAgY29uc3Qgc2hvd0V4dHJhID0gb3B0cy5zaG93TGF0ZXIgIT09IGZhbHNlO1xuICAgIGNvbnN0IHZpc2libGUgPSBvdmVyZHVlLmxlbmd0aCArIHRvZGF5VGFza3MubGVuZ3RoICsgbGF0ZXIubGVuZ3RoXG4gICAgICArIE9iamVjdC52YWx1ZXMoYnlEYXkpLnJlZHVjZSgocywgYSkgPT4gcyArIGEubGVuZ3RoLCAwKVxuICAgICAgKyAoc2hvd0V4dHJhID8gbm9EYXRlLmxlbmd0aCA6IDApO1xuICAgIGlmICh2aXNpYmxlID09PSAwKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgICBjb25zdCBmaWx0ZXJlZCA9ICEhKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCk7XG4gICAgICBjb25zdCBtc2cgPSBmaWx0ZXJlZCA/IFwiTmVuaHVtYSB0YXJlZmEgYmF0ZSBjb20gb3MgZmlsdHJvcy5cIlxuICAgICAgICA6IHNob3dFeHRyYSA/IFwiTmVuaHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gXHVEODNDXHVERjg5XCJcbiAgICAgICAgOiBcIk5lbmh1bWEgdGFyZWZhIGFnZW5kYWRhLiBcdUQ4M0NcdURGODlcIjtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IG1zZyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2xzID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1jb2xzXCIgfSk7XG5cbiAgICBjb25zdCBvYm94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LW92ZXJkdWVcIiB9KTtcbiAgICBjb25zdCBvaGQgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3h3YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkF0cmFzYWRhc1wiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKG92ZXJkdWUubGVuZ3RoKSB9KTtcbiAgICBjb25zdCBvYm9keSA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIG92ZXJkdWUpIHRoaXMudG9kb1JvdyhvYm9keSwgdCk7XG4gICAgZWxzZSBvYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEuIFx1RDgzRFx1REM0RFwiIH0pO1xuXG4gICAgY29uc3QgdGJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC10b2RheVwiIH0pO1xuICAgIGNvbnN0IHRoZCA9IHRib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiSG9qZVwiIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih0aGQsIFwiaG9qZVwiLCBcIk5vdmEgdGFyZWZhIHBhcmEgaG9qZVwiKTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh0b2RheVRhc2tzLmxlbmd0aCkgfSk7XG4gICAgY29uc3QgdGJvZHkgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodG9kYXlUYXNrcy5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiB0b2RheVRhc2tzKSB0aGlzLnRvZG9Sb3codGJvZHksIHQpO1xuICAgIGVsc2UgdGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOYWRhIHBhcmEgaG9qZS5cIiB9KTtcblxuICAgIGxldCB1cGNvbWluZ0NvdW50ID0gMDtcbiAgICBjb25zdCB1cERheXM6IHsgZG93OiBudW1iZXI7IG51bTogbnVtYmVyOyBrZXk6IHN0cmluZzsgaXRlbXM6IFRvZG9pc3RUYXNrW10gfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmFuZ2U7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV07XG4gICAgICBpZiAoIWl0ZW1zPy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgdXBjb21pbmdDb3VudCArPSBpdGVtcy5sZW5ndGg7XG4gICAgICB1cERheXMucHVzaCh7IGRvdzogKGRheS5nZXREYXkoKSArIDYpICUgNywgbnVtOiBkYXkuZ2V0RGF0ZSgpLCBrZXksIGl0ZW1zIH0pO1xuICAgIH1cbiAgICBjb25zdCB1Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXVwY29taW5nXCIgfSk7XG4gICAgY29uc3QgdWhkID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogYFByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhc2AgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHVoZCwgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHVwY29taW5nQ291bnQpIH0pO1xuICAgIGNvbnN0IHVib2R5ID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHVwRGF5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgZyBvZiB1cERheXMpIHtcbiAgICAgICAgY29uc3QgZGggPSB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1kYXloZFwiICsgKGcuZG93ID49IDUgPyBcIiB3ZC13ZWVrZW5kXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2cuZG93XSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW51bVwiLCB0ZXh0OiBTdHJpbmcoZy5udW0pIH0pO1xuICAgICAgICB0aGlzLmFkZFRhc2tCdG4oZGgsIGcua2V5LCBgTm92YSB0YXJlZmEgZW0gJHtnLm51bX1gKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGcuaXRlbXMpIHRoaXMudG9kb1Jvdyh1Ym9keSwgdCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBgTmFkYSBub3MgcHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzLmAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGxhdGVyLmxlbmd0aCAmJiBzaG93RXh0cmEpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1sYXRlclwiIH0pO1xuICAgICAgY29uc3QgbGhkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2hkXCIgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWxhdGVyaWNvXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90aXRsZVwiLCB0ZXh0OiBgRGVwb2lzICgke2xhdGVyLmxlbmd0aH0pYCB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RvZ2dsZVwiLCB0ZXh0OiB0aGlzLmxhdGVyT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5zZXRBdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBTdHJpbmcodGhpcy5sYXRlck9wZW4pKTtcbiAgICAgIGNsaWNrYWJsZShsaGQsICgpID0+IHsgdGhpcy5sYXRlck9wZW4gPSAhdGhpcy5sYXRlck9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICBpZiAodGhpcy5sYXRlck9wZW4pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9saXN0XCIgfSk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBsYXRlcikgdGhpcy50b2RvUm93KGxpc3QsIHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub0RhdGUubGVuZ3RoICYmIHNob3dFeHRyYSkge1xuICAgICAgY29uc3QgcGFuZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyIHdkLXRvZG8tbm9kYXRlXCIgfSk7XG4gICAgICBjb25zdCBuaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIG5oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIG5oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBTZW0gZGF0YSAoJHtub0RhdGUubGVuZ3RofSlgIH0pO1xuICAgICAgbmhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMubm9EYXRlT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIG5oZC5zZXRBdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBTdHJpbmcodGhpcy5ub0RhdGVPcGVuKSk7XG4gICAgICBjbGlja2FibGUobmhkLCAoKSA9PiB7IHRoaXMubm9EYXRlT3BlbiA9ICF0aGlzLm5vRGF0ZU9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICBpZiAodGhpcy5ub0RhdGVPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2Ygbm9EYXRlKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIFVtYSBvY29yclx1MDBFQW5jaWEgY29uY2x1XHUwMEVEZGEgXHUwMEU5IHJlY29ycmVudGU/IChuXHUwMEUzbyBwb2RlIHNlciBhcGFnYWRhIFx1MjAxNCBxdWVicmFyaWEgYSByZWNvcnJcdTAwRUFuY2lhKVxuZnVuY3Rpb24gaXNSZWN1cnJpbmdDb21wbGV0ZWQodDogVG9kb2lzdFRhc2spOiBib29sZWFuIHtcbiAgcmV0dXJuIHQuZHVlPy5pc19yZWN1cnJpbmcgPT09IHRydWU7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM286IGNvbnRyb2xhZG9yIFx1MDBGQW5pY28gKGRvbm8gbm8gcGx1Z2luLCBjb21wYXJ0aWxoYWRvIHZpZXdcdTIxOTRmYWl4YSkgXHUyNTAwXHUyNTAwXG5jbGFzcyBHYW1lQ29udHJvbGxlciB7XG4gIHByaXZhdGUgZXZlbnRzOiBHYW1lRXZlbnRbXSA9IFtdO1xuICBwcml2YXRlIGxvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGJ1c3kgPSBmYWxzZTsgICAgICAgICAgICAgICAgIC8vIGNvbGhlaXRhL21hcmtVbmRvbmUgZW0gYW5kYW1lbnRvXG4gIHByaXZhdGUgcGVuZGluZzogVG9kb2lzdFRhc2tbXSA9IFtdOyAgLy8gY29uY2x1XHUwMEVEZGFzIG5hIEFQSSBhaW5kYSBuXHUwMEUzbyBubyBsb2cgKGxpdmUpXG4gIHByaXZhdGUgcGVuZGluZ1hwID0gMDtcbiAgcHJpdmF0ZSBsYXN0QmFyUGN0ID0gMDsgICAgICAgICAgICAgICAvLyBcdTAwRkFsdGltbyAlIGRhIGJhcnJhIChwLyBhbmltYXIgZG8gdmFsb3IgYW50ZXJpb3IpXG4gIHByaXZhdGUgbGFzdExldmVsID0gMDtcbiAgcHJpdmF0ZSBzdWJzID0gbmV3IFNldDwoKSA9PiB2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge31cblxuICBzdWJzY3JpYmUoY2I6ICgpID0+IHZvaWQpOiAoKSA9PiB2b2lkIHsgdGhpcy5zdWJzLmFkZChjYik7IHJldHVybiAoKSA9PiB7IHRoaXMuc3Vicy5kZWxldGUoY2IpOyB9OyB9XG4gIHJlcmVuZGVyQWxsKCkgeyBmb3IgKGNvbnN0IGNiIG9mIHRoaXMuc3VicykgY2IoKTsgfVxuXG4gIHByaXZhdGUgbG9nRmlsZSgpOiBURmlsZSB8IG51bGwge1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoR0FNRV9MT0dfUEFUSCk7XG4gICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURmlsZSA/IGYgOiBudWxsO1xuICB9XG4gIGludmFsaWRhdGUoKSB7IHRoaXMubG9hZGVkID0gZmFsc2U7IH1cbiAgYXN5bmMgZW5zdXJlTG9hZGVkKCkge1xuICAgIGlmICh0aGlzLmxvYWRlZCkgcmV0dXJuO1xuICAgIGNvbnN0IGYgPSB0aGlzLmxvZ0ZpbGUoKTtcbiAgICB0aGlzLmV2ZW50cyA9IGYgPyBwYXJzZUdhbWVMb2coYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmKSkgOiBbXTtcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gIH1cbiAgc3RhdHMoKTogR2FtZVN0YXRzIHsgcmV0dXJuIGNvbXB1dGVHYW1lU3RhdHModGhpcy5ldmVudHMpOyB9XG5cbiAgcHJpdmF0ZSBhc3luYyB3cml0ZUxvZygpIHtcbiAgICBjb25zdCBjb250ZW50ID0gYnVpbGRHYW1lTG9nQ29udGVudCh0aGlzLmV2ZW50cyk7XG4gICAgY29uc3QgZiA9IHRoaXMubG9nRmlsZSgpO1xuICAgIGlmIChmKSB7IGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBjb250ZW50KTsgcmV0dXJuOyB9XG4gICAgY29uc3Qgc2xhc2ggPSBHQU1FX0xPR19QQVRILmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICBjb25zdCBmb2xkZXIgPSBzbGFzaCA+IDAgPyBHQU1FX0xPR19QQVRILnNsaWNlKDAsIHNsYXNoKSA6IFwiXCI7XG4gICAgaWYgKGZvbGRlciAmJiAhdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZvbGRlcikpIHtcbiAgICAgIHRyeSB7IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihmb2xkZXIpOyB9IGNhdGNoIHsgLyogalx1MDBFMSBleGlzdGUgKi8gfVxuICAgIH1cbiAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoR0FNRV9MT0dfUEFUSCwgY29udGVudCk7XG4gIH1cblxuICAvLyBBbmV4YSBldmVudG9zIG5vdm9zIChkZWR1cCBwb3IgY2hhdmUpLiBEZXZvbHZlIHF1YW50b3MgZW50cmFyYW0uXG4gIHByaXZhdGUgYXN5bmMgYXBwZW5kRXZlbnRzKGV2czogR2FtZUV2ZW50W10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQodGhpcy5ldmVudHMubWFwKGUgPT4gZS5rZXkpKTtcbiAgICBjb25zdCBhZGQgPSBldnMuZmlsdGVyKGUgPT4gIWtleXMuaGFzKGUua2V5KSk7XG4gICAgaWYgKCFhZGQubGVuZ3RoKSByZXR1cm4gMDtcbiAgICB0aGlzLmV2ZW50cy5wdXNoKC4uLmFkZCk7XG4gICAgYXdhaXQgdGhpcy53cml0ZUxvZygpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICByZXR1cm4gYWRkLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgcHJvak5hbWUodDogVG9kb2lzdFRhc2spOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi50b2RvLnByb2plY3ROYW1lKHQucHJvamVjdF9pZCkgfHwgKHQucHJvamVjdF9pZCA/PyBcIlwiKTtcbiAgfVxuICBwcml2YXRlIGRvbmVFdmVudCh0OiBUb2RvaXN0VGFzayk6IEdhbWVFdmVudCB7XG4gICAgY29uc3QgYXQgPSB0LmNvbXBsZXRlZF9hdCA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgcmV0dXJuIHsgZGF0ZTogdG9LZXkobmV3IERhdGUoYXQpKSwgdHlwZTogXCJmZWl0b1wiLCB4cDogeHBGb3JQcmlvcml0eSh0LnByaW9yaXR5KSxcbiAgICAgIGtleTogYCR7dC5pZH18JHthdH1gLCBjb250ZW50OiB0LmNvbnRlbnQsIHByb2plY3Q6IHRoaXMucHJvak5hbWUodCksIGxhYmVsczogdC5sYWJlbHMgPz8gW10gfTtcbiAgfVxuXG4gIC8vIEphbmVsYSBkbyBmZXRjaDogZGVzZGUgYSBcdTAwRkFsdGltYSBjb2xoZWl0YSAoXHUyMjEyMmQgZGUgbWFyZ2VtKSBvdSBiYWNrZmlsbCBuYSAxXHUwMEFBIHZlei5cbiAgcHJpdmF0ZSBoYXJ2ZXN0U2luY2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBsYXN0ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0O1xuICAgIGlmIChsYXN0ICYmIC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KGxhc3QpKVxuICAgICAgcmV0dXJuIHRvS2V5KG5ldyBEYXRlKERhdGUucGFyc2UobGFzdCArIFwiVDAwOjAwOjAwXCIpIC0gMiAqIDg2NDAwMDAwKSk7XG4gICAgcmV0dXJuIHRvS2V5KG5ldyBEYXRlKERhdGUubm93KCkgLSBIQVJWRVNUX0JBQ0tGSUxMX0RBWVMgKiA4NjQwMDAwMCkpO1xuICB9XG4gIC8vIGB1bnRpbGAgPSBBTUFOSFx1MDBDMyAobG9jYWwpLiBjb21wbGV0ZWRfYXQgZGEgQVBJIFx1MDBFOSBVVEM6IFx1MDBFMCBub2l0ZSBubyBCUlQsIGEgY29uY2x1c1x1MDBFM28gZGVcbiAgLy8gaG9qZSBqXHUwMEUxIFx1MDBFOSBcImFtYW5oXHUwMEUzXCIgZW0gVVRDIFx1MjE5MiBjb20gdW50aWw9aG9qZSBlbGEgY2FpcmlhIGZvcmEgZGEgamFuZWxhLlxuICBwcml2YXRlIGhhcnZlc3RVbnRpbCgpOiBzdHJpbmcgeyByZXR1cm4gdG9LZXkobmV3IERhdGUoRGF0ZS5ub3coKSArIDg2NDAwMDAwKSk7IH1cblxuICAvLyBcIk5cdTAwRTNvIGZlaXRvXCI6IHB1bmlcdTAwRTdcdTAwRTNvIChcdTIyMTJiYXNlXHUwMEQ3ZmF0b3IpIFx1MjE5MiBsb2cgXHUyMTkyIGFwYWdhIGRvIFRvZG9pc3QuXG4gIGFzeW5jIG1hcmtVbmRvbmUodDogVG9kb2lzdFRhc2spIHtcbiAgICBpZiAodGhpcy5idXN5KSByZXR1cm47XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIpOyByZXR1cm47IH1cbiAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh4cEZvclByaW9yaXR5KHQucHJpb3JpdHkpICogdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZVBlbmFsdHlGYWN0b3IpKTtcbiAgICBjb25zdCByZWN1cnJpbmcgPSBpc1JlY3VycmluZ0NvbXBsZXRlZCh0KTtcbiAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgdGl0bGU6IFwiTWFyY2FyIGNvbW8gblx1MDBFM28gZmVpdGE/XCIsXG4gICAgICBib2R5OiByZWN1cnJpbmdcbiAgICAgICAgPyBgXCIke3QuY29udGVudH1cIiBcdTAwRTkgcmVjb3JyZW50ZSBcdTIwMTQgdm9jXHUwMEVBIHBlcmRlICR7cGVuYWx0eX0gWFAsIG1hcyBhIHRhcmVmYSBOXHUwMEMzTyBcdTAwRTkgYXBhZ2FkYSAoYXBhZ2FyIHF1ZWJyYXJpYSBhIHJlY29yclx1MDBFQW5jaWEpLmBcbiAgICAgICAgOiBgXCIke3QuY29udGVudH1cIiBcdTIwMTQgdm9jXHUwMEVBIHBlcmRlICR7cGVuYWx0eX0gWFAgZSBhIHRhcmVmYSBcdTAwRTkgYXBhZ2FkYSBkbyBUb2RvaXN0IChpcnJldmVyc1x1MDBFRHZlbCkuYCxcbiAgICAgIGN0YTogYE5cdTAwRTNvIGZlaXRhIChcdTIyMTIke3BlbmFsdHl9IFhQKWAsXG4gICAgfSk7XG4gICAgaWYgKCFvaykgcmV0dXJuO1xuICAgIHRoaXMuYnVzeSA9IHRydWU7IHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5hcHBlbmRFdmVudHMoW3sgZGF0ZTogdG9LZXkobmV3IERhdGUoKSksIHR5cGU6IFwibmFvLWZlaXRvXCIsIHhwOiAtcGVuYWx0eSxcbiAgICAgICAga2V5OiBgJHt0LmlkfXwke0RhdGUubm93KCl9YCwgY29udGVudDogdC5jb250ZW50LCBwcm9qZWN0OiB0aGlzLnByb2pOYW1lKHQpLCBsYWJlbHM6IHQubGFiZWxzID8/IFtdIH1dKTtcbiAgICAgIGlmICghcmVjdXJyaW5nKSBhd2FpdCBkZWxldGVUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTcgTlx1MDBFM28gZmVpdGE6ICR7dC5jb250ZW50fSAoXHUyMjEyJHtwZW5hbHR5fSBYUClgKTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnRvZG8uZmV0Y2godHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGE6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmJ1c3kgPSBmYWxzZTsgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbGhlIGNvbmNsdVx1MDBFRGRhcyBcdTIxOTIgbG9nOyBhcGFnYSBkbyBUb2RvaXN0IHNcdTAwRjMgYXMgTlx1MDBDM08tcmVjb3JyZW50ZXMuXG4gIGFzeW5jIGhhcnZlc3QoKSB7XG4gICAgaWYgKHRoaXMuYnVzeSkgcmV0dXJuO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSB7IG5ldyBOb3RpY2UoXCJDb25maWd1cmUgbyB0b2tlbiBkbyBUb2RvaXN0LlwiKTsgcmV0dXJuOyB9XG4gICAgdGhpcy5idXN5ID0gdHJ1ZTsgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZUxvYWRlZCgpO1xuICAgICAgY29uc3QgdG9kYXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICAgIGNvbnN0IGNvbXBsZXRlZCA9IGF3YWl0IGZldGNoQ29tcGxldGVkVGFza3ModG9rZW4sIHRoaXMuaGFydmVzdFNpbmNlKCksIHRoaXMuaGFydmVzdFVudGlsKCkpO1xuICAgICAgY29uc3Qga2V5cyA9IG5ldyBTZXQodGhpcy5ldmVudHMubWFwKGUgPT4gZS5rZXkpKTtcbiAgICAgIGNvbnN0IGZyZXNoID0gY29tcGxldGVkLmZpbHRlcih0ID0+ICFrZXlzLmhhcyhgJHt0LmlkfXwke3QuY29tcGxldGVkX2F0ID8/IFwiXCJ9YCkpO1xuICAgICAgaWYgKCFmcmVzaC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0ID0gdG9kYXk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLnBlbmRpbmcgPSBbXTsgdGhpcy5wZW5kaW5nWHAgPSAwO1xuICAgICAgICBuZXcgTm90aWNlKFwiTmFkYSBub3ZvIHBhcmEgc2FsdmFyLiBcdUQ4M0RcdURDNERcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRlbGV0YWJsZSA9IGZyZXNoLmZpbHRlcih0ID0+ICFpc1JlY3VycmluZ0NvbXBsZXRlZCh0KSk7XG4gICAgICBjb25zdCByZWN1cnJpbmcgPSBmcmVzaC5sZW5ndGggLSBkZWxldGFibGUubGVuZ3RoO1xuICAgICAgY29uc3QgdG90YWxYcCA9IGZyZXNoLnJlZHVjZSgocywgdCkgPT4gcyArIHhwRm9yUHJpb3JpdHkodC5wcmlvcml0eSksIDApO1xuICAgICAgY29uc3Qgb2sgPSBhd2FpdCBjb25maXJtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgICAgdGl0bGU6IGBTYWx2YXIgJHtmcmVzaC5sZW5ndGh9IHRhcmVmYShzKSBjb25jbHVcdTAwRURkYShzKT9gLFxuICAgICAgICBib2R5OiBgKyR7dG90YWxYcH0gWFAgbm8gbG9nLiAke2RlbGV0YWJsZS5sZW5ndGh9IGFwYWdhZGEocykgZG8gVG9kb2lzdGAgK1xuICAgICAgICAgIChyZWN1cnJpbmcgPyBgIFx1MDBCNyAke3JlY3VycmluZ30gcmVjb3JyZW50ZShzKSBmaWNhbSAoYXBhZ2FyIHF1ZWJyYXJpYSBhIHJlY29yclx1MDBFQW5jaWEpLmAgOiBcIi5cIiksXG4gICAgICAgIGl0ZW1zOiBmcmVzaC5zbGljZSgwLCAzMCkubWFwKHQgPT4gKHsgdGV4dDogYCske3hwRm9yUHJpb3JpdHkodC5wcmlvcml0eSl9IFx1MDBCNyAke3QuY29udGVudH1gIH0pKSxcbiAgICAgICAgY3RhOiBgU2FsdmFyIGUgYXBhZ2FyICR7ZGVsZXRhYmxlLmxlbmd0aH1gLFxuICAgICAgfSk7XG4gICAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgICBhd2FpdCB0aGlzLmFwcGVuZEV2ZW50cyhmcmVzaC5tYXAodCA9PiB0aGlzLmRvbmVFdmVudCh0KSkpO1xuICAgICAgbGV0IGRlbCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IHQgb2YgZGVsZXRhYmxlKSB7XG4gICAgICAgIHRyeSB7IGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTsgZGVsKys7IH0gY2F0Y2ggeyAvKiBzZWd1ZSAqLyB9XG4gICAgICB9XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPSB0b2RheTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBbXTsgdGhpcy5wZW5kaW5nWHAgPSAwO1xuICAgICAgbmV3IE5vdGljZShgXHUyNzEzICR7ZnJlc2gubGVuZ3RofSBzYWx2YShzKSAoKyR7dG90YWxYcH0gWFApIFx1MDBCNyAke2RlbH0gYXBhZ2FkYShzKWApO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udG9kby5mZXRjaCh0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBzYWx2YXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmJ1c3kgPSBmYWxzZTsgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnRhIHF1YW50YXMgY29uY2x1XHUwMEVEZGFzIGVzdFx1MDBFM28gcGVuZGVudGVzIGRlIHNhbHZhciAobGl2ZSwgc2VtIGFwYWdhciBuYWRhKS5cbiAgYXN5bmMgcmVmcmVzaFBlbmRpbmcoKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5lbnN1cmVMb2FkZWQoKTtcbiAgICAgIGNvbnN0IGNvbXBsZXRlZCA9IGF3YWl0IGZldGNoQ29tcGxldGVkVGFza3ModG9rZW4sIHRoaXMuaGFydmVzdFNpbmNlKCksIHRoaXMuaGFydmVzdFVudGlsKCkpO1xuICAgICAgY29uc3Qga2V5cyA9IG5ldyBTZXQodGhpcy5ldmVudHMubWFwKGUgPT4gZS5rZXkpKTtcbiAgICAgIHRoaXMucGVuZGluZyA9IGNvbXBsZXRlZC5maWx0ZXIodCA9PiAha2V5cy5oYXMoYCR7dC5pZH18JHt0LmNvbXBsZXRlZF9hdCA/PyBcIlwifWApKTtcbiAgICAgIHRoaXMucGVuZGluZ1hwID0gdGhpcy5wZW5kaW5nLnJlZHVjZSgocywgdCkgPT4gcyArIHhwRm9yUHJpb3JpdHkodC5wcmlvcml0eSksIDApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH0gY2F0Y2ggeyAvKiBzaWxlbmNpb3NvICovIH1cbiAgfVxuXG4gIC8vIFBhaW5lbCBjb21wYXJ0aWxoYWRvOiBkYXNoYm9hcmQgKGZhaXhhLCBjdHJscyBzZW0gY29saGVpdGEpIGUgYWJhIChmdWxsKS5cbiAgcmVuZGVyUGFuZWwoaG9zdDogSFRNTEVsZW1lbnQsIGN0cmxzOiBIVE1MRWxlbWVudCB8IG51bGwsIG9wdHM6IHsgZnVsbD86IGJvb2xlYW47IHBob25lPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCBzID0gdGhpcy5zdGF0cygpO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAob3B0cy5mdWxsICYmIGN0cmxzICYmIHRva2VuKSB7XG4gICAgICBjb25zdCBzYXZlID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWhhcnZlc3RcIiArICh0aGlzLmJ1c3kgPyBcIiB3ZC1nYW1lLWJ1c3lcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihzYXZlLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1oYXJ2ZXN0LWljb1wiIH0pLCBcImRvd25sb2FkXCIpO1xuICAgICAgc2F2ZS5jcmVhdGVTcGFuKHsgdGV4dDogdGhpcy5idXN5ID8gXCJTYWx2YW5kb1x1MjAyNlwiIDogXCJTYWx2YXIgY29uY2x1XHUwMEVEZGFzXCIgfSk7XG4gICAgICBpZiAodGhpcy5wZW5kaW5nLmxlbmd0aCkgc2F2ZS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtcGVuZFwiLCB0ZXh0OiBgKyR7dGhpcy5wZW5kaW5nWHB9YCB9KTtcbiAgICAgIHNhdmUuc2V0QXR0cihcInRpdGxlXCIsIHRoaXMucGVuZGluZy5sZW5ndGhcbiAgICAgICAgPyBgJHt0aGlzLnBlbmRpbmcubGVuZ3RofSBjb25jbHVcdTAwRURkYShzKSBhZ3VhcmRhbmRvIHNhbHZhciAoKyR7dGhpcy5wZW5kaW5nWHB9IFhQKWBcbiAgICAgICAgOiBcIkJ1c2NhciB0YXJlZmFzIGNvbmNsdVx1MDBFRGRhcywgc2FsdmFyIG5vIGxvZyBlIGxpbXBhciBkbyBUb2RvaXN0XCIpO1xuICAgICAgaWYgKCF0aGlzLmJ1c3kpIGNsaWNrYWJsZShzYXZlLCAoKSA9PiB2b2lkIHRoaXMuaGFydmVzdCgpKTtcbiAgICB9XG5cbiAgICBjb25zdCBsdmwgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWxldmVsXCIgfSk7XG4gICAgbHZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1sdmxudW1cIiwgdGV4dDogYE5cdTAwRUR2ZWwgJHtzLmxldmVsfWAgfSk7XG4gICAgbHZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS14cFwiLCB0ZXh0OiBgJHtzLnRvdGFsWHB9IFhQYCB9KTtcbiAgICBjb25zdCBiYXIgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWJhclwiIH0pO1xuICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYmFyLWZpbGxcIiB9KTtcbiAgICBjb25zdCBwY3QgPSBzLnhwRm9yTmV4dCA/IE1hdGgubWluKDEwMCwgTWF0aC5yb3VuZChzLnhwSW50b0xldmVsIC8gcy54cEZvck5leHQgKiAxMDApKSA6IDA7XG4gICAgLy8gQW5pbWEgZG8gXHUwMEZBbHRpbW8gJSBleGliaWRvIGF0XHUwMEU5IG8gbm92bzsgZW0gbGV2ZWwtdXAsIGVuY2hlIGRvIHplcm8uXG4gICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke3MubGV2ZWwgPiB0aGlzLmxhc3RMZXZlbCA/IDAgOiB0aGlzLmxhc3RCYXJQY3R9JWA7XG4gICAgdm9pZCBmaWxsLm9mZnNldFdpZHRoOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWZsb3cgXHUyMTkyIGEgdHJhbnNpXHUwMEU3XHUwMEUzbyBDU1MgcGFydGUgZG8gdmFsb3IgYW50ZXJpb3JcbiAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cGN0fSVgO1xuICAgIHRoaXMubGFzdEJhclBjdCA9IHBjdDsgdGhpcy5sYXN0TGV2ZWwgPSBzLmxldmVsO1xuICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cy54cEludG9MZXZlbH0vJHtzLnhwRm9yTmV4dH0gWFAgcGFyYSBvIG5cdTAwRUR2ZWwgJHtzLmxldmVsICsgMX1gKTtcbiAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW5leHRcIixcbiAgICAgIHRleHQ6IGBmYWx0YW0gJHtNYXRoLm1heCgwLCBzLnhwRm9yTmV4dCAtIHMueHBJbnRvTGV2ZWwpfSBYUCBwYXJhIG8gblx1MDBFRHZlbCAke3MubGV2ZWwgKyAxfWAgfSk7XG5cbiAgICBjb25zdCBncmlkID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1tZXRyaWNzXCIgfSk7XG4gICAgY29uc3QgbWV0cmljID0gKGljb246IHN0cmluZywgdmFsOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcsIGNscyA9IFwiXCIpID0+IHtcbiAgICAgIGNvbnN0IGMgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpYyBcIiArIGNscyB9KTtcbiAgICAgIGNvbnN0IHYgPSBjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpYy12YWxcIiB9KTtcbiAgICAgIHNldEljb24odi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLWljb1wiIH0pLCBpY29uKTtcbiAgICAgIHYuY3JlYXRlU3Bhbih7IHRleHQ6IHZhbCB9KTtcbiAgICAgIGMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLWxibFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgICB9O1xuICAgIG1ldHJpYyhcImZsYW1lXCIsIFN0cmluZyhzLnN0cmVha0N1cnJlbnQpLCBgc3RyZWFrIFx1MDBCNyByZWNvcmRlICR7cy5zdHJlYWtCZXN0fWAsIHMuc3RyZWFrQ3VycmVudCA/IFwid2QtZ2FtZS1zdHJlYWstb25cIiA6IFwiXCIpO1xuICAgIG1ldHJpYyhcInphcFwiLCBgJHtzLnRvZGF5WHAgPj0gMCA/IFwiK1wiIDogXCJcIn0ke3MudG9kYXlYcH1gLCBgWFAgaG9qZSBcdTAwQjcgJHtzLnRvZGF5Q291bnR9IGZlaXRhKHMpYCk7XG5cbiAgICBpZiAob3B0cy5mdWxsICYmIHRoaXMucGVuZGluZy5sZW5ndGgpXG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWhpbnRcIiwgdGV4dDpcbiAgICAgICAgYCR7dGhpcy5wZW5kaW5nLmxlbmd0aH0gY29uY2x1XHUwMEVEZGEocykgYWd1YXJkYW5kbyBzYWx2YXIgKCske3RoaXMucGVuZGluZ1hwfSBYUCkgXHUyMDE0IGNsaXF1ZSBlbSBcIlNhbHZhciBjb25jbHVcdTAwRURkYXNcIi5gIH0pO1xuXG4gICAgaWYgKG9wdHMuZnVsbCkgdGhpcy5yZW5kZXJYcENoYXJ0KGhvc3QsIHMsICEhb3B0cy5waG9uZSk7XG4gICAgaWYgKG9wdHMuZnVsbCkgdGhpcy5yZW5kZXJTY29wZUxldmVscyhob3N0LCBzKTtcbiAgfVxuXG4gIC8vIE5cdTAwRUR2ZWlzIHBvciBlc2NvcG8gKHByb2pldG8vZXRpcXVldGEpOiB0b3AgcG9yIFhQLCBjYWRhIHVtIGNvbSBuXHUwMEVEdmVsICsgbWluaS1iYXJyYS5cbiAgLy8gUmV1c2EgYSBiYXJyYSBkZSBYUCAoYC53ZC1nYW1lLWJhcmApIGUgYGxldmVsSW5mbyh4cClgLlxuICBwcml2YXRlIHJlbmRlclNjb3BlTGV2ZWxzKGhvc3Q6IEhUTUxFbGVtZW50LCBzOiBHYW1lU3RhdHMpIHtcbiAgICBjb25zdCBUT1AgPSA4O1xuICAgIGNvbnN0IHNlY3Rpb24gPSAodGl0bGU6IHN0cmluZywgZGF0YTogTWFwPHN0cmluZywgbnVtYmVyPiwgcHJlZml4OiBzdHJpbmcsIHJlbmFtZUVtcHR5OiBzdHJpbmcgfCB1bmRlZmluZWQsIGtub3duOiBTZXQ8c3RyaW5nPikgPT4ge1xuICAgICAgY29uc3QgdG9wID0gWy4uLmRhdGEuZW50cmllcygpXVxuICAgICAgICAuZmlsdGVyKChbLCB4cF0pID0+IHhwID4gMClcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdKVxuICAgICAgICAuc2xpY2UoMCwgVE9QKTtcbiAgICAgIGlmICghdG9wLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgLy8gU1x1MDBGMyBhdmlzYSBcIm5cdTAwRTNvIGV4aXN0ZSBtYWlzXCIgc2UgbyBUb2RvaXN0IGpcdTAwRTEgY2FycmVnb3Ugb3MgZXNjb3BvcyBhdHVhaXMgKG9mZmxpbmUvc2VtIHRva2VuIFx1MjE5MiBzZW0gYXZpc28pLlxuICAgICAgY29uc3QgcmVhZHkgPSBrbm93bi5zaXplID4gMDtcbiAgICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtc2NvcGVzZWNcIiB9KTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1jaGFydC10aXRsZVwiLCB0ZXh0OiB0aXRsZSB9KTtcbiAgICAgIGZvciAoY29uc3QgW25hbWUsIHhwXSBvZiB0b3ApIHtcbiAgICAgICAgY29uc3QgbGkgPSBsZXZlbEluZm8oeHApO1xuICAgICAgICBjb25zdCBnb25lID0gcmVhZHkgJiYgbmFtZSAhPT0gXCJcdTIwMTRcIiAmJiAha25vd24uaGFzKG5hbWUpO1xuICAgICAgICBjb25zdCBpdGVtID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLWl0ZW1cIiB9KTtcbiAgICAgICAgY29uc3QgaGVhZCA9IGl0ZW0uY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtaGVhZFwiIH0pO1xuICAgICAgICBjb25zdCBsZWZ0ID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1zY29wZS1sZWZ0XCIgfSk7XG4gICAgICAgIGxlZnQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLW5hbWVcIiArIChnb25lID8gXCIgd2QtZGltXCIgOiBcIlwiKSxcbiAgICAgICAgICB0ZXh0OiBwcmVmaXggKyAocmVuYW1lRW1wdHkgJiYgbmFtZSA9PT0gXCJcdTIwMTRcIiA/IHJlbmFtZUVtcHR5IDogbmFtZSkgfSk7XG4gICAgICAgIGlmIChnb25lKSB7XG4gICAgICAgICAgY29uc3QgZyA9IGxlZnQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLWdvbmVcIiB9KTtcbiAgICAgICAgICBzZXRJY29uKGcsIFwidW5saW5rXCIpO1xuICAgICAgICAgIGcuc2V0QXR0cihcInRpdGxlXCIsIFwiTlx1MDBFM28gZXhpc3RlIG1haXMgbm8gVG9kb2lzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1zY29wZS1tZXRhXCIsIHRleHQ6IGBOdiAke2xpLmxldmVsfSBcdTAwQjcgJHt4cH0gWFBgIH0pO1xuICAgICAgICBjb25zdCBiYXIgPSBpdGVtLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWJhciB3ZC1nYW1lLWJhci1taW5pXCIgfSk7XG4gICAgICAgIGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1iYXItZmlsbFwiIH0pLnN0eWxlLndpZHRoID0gYCR7bGkucGN0fSVgO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xpLmludG99LyR7bGkuZm9yTmV4dH0gWFAgcGFyYSBvIG5cdTAwRUR2ZWwgJHtsaS5sZXZlbCArIDF9YCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZWN0aW9uKFwiTlx1MDBFRHZlaXMgcG9yIHByb2pldG9cIiwgcy5ieVByb2plY3QsIFwiXCIsIFwiU2VtIHByb2pldG9cIiwgdGhpcy5wbHVnaW4udG9kby5rbm93blByb2plY3RzKCkpO1xuICAgIHNlY3Rpb24oXCJOXHUwMEVEdmVpcyBwb3IgZXRpcXVldGFcIiwgcy5ieUxhYmVsLCBcIkBcIiwgdW5kZWZpbmVkLCB0aGlzLnBsdWdpbi50b2RvLmtub3duTGFiZWxzKCkpO1xuICB9XG5cbiAgLy8gR3JcdTAwRTFmaWNvIGRlIFhQIHBvciBkaWEgKFx1MDBGQWx0aW1vcyBOIGRpYXMpIFx1MjAxNCBiYXJyYXMgb3UgbGluaGEgY29tIHBvbnRvcyAoc2V0dGluZ3MuZ2FtZUNoYXJ0TW9kZSkuXG4gIHByaXZhdGUgcmVuZGVyWHBDaGFydChob3N0OiBIVE1MRWxlbWVudCwgczogR2FtZVN0YXRzLCBwaG9uZTogYm9vbGVhbikge1xuICAgIGNvbnN0IERBWVMgPSBwaG9uZSA/IDE1IDogMzA7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVDaGFydE1vZGU7XG4gICAgY29uc3QgdG9kYXlLZXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyB4cDogbnVtYmVyOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpOyBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBjb25zdCBhZ2cgPSBzLmJ5RGF5LmdldChrZXkpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCB4cDogYWdnPy54cCA/PyAwLCBjb3VudDogYWdnPy5jb3VudCA/PyAwLCBsYWJlbDogYCR7ZGF5fS8ke219YCB9KTtcbiAgICB9XG4gICAgY29uc3Qgc2VjID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1jaGFydHNlY1wiIH0pO1xuICAgIGNvbnN0IGhkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWNoYXJ0aGRcIiB9KTtcbiAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtY2hhcnQtdGl0bGVcIiwgdGV4dDogYFhQIG5vcyBcdTAwRkFsdGltb3MgJHtEQVlTfSBkaWFzYCB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBta0J0biA9IChtOiBcImJhcnNcIiB8IFwibGluZVwiLCBsYWJlbDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBiID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKG1vZGUgPT09IG0gPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IGxhYmVsIH0pO1xuICAgICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpOyBiLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG1vZGUgPT09IG0pKTtcbiAgICAgIGNsaWNrYWJsZShiLCBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZUNoYXJ0TW9kZSA9IG07IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgIH07XG4gICAgbWtCdG4oXCJiYXJzXCIsIFwiYmFycmFzXCIsIFwiR3JcdTAwRTFmaWNvIGRlIGJhcnJhc1wiKTtcbiAgICBta0J0bihcImxpbmVcIiwgXCJsaW5oYVwiLCBcIkxpbmhhIGNvbSBwb250b3NcIik7XG5cbiAgICBjb25zdCB0aXAgPSAoZDogeyB4cDogbnVtYmVyOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH0pID0+IGAke2QubGFiZWx9OiAke2QueHAgPj0gMCA/IFwiK1wiIDogXCJcIn0ke2QueHB9IFhQIFx1MDBCNyAke2QuY291bnR9IGZlaXRhKHMpYDtcbiAgICBpZiAobW9kZSA9PT0gXCJsaW5lXCIpIHtcbiAgICAgIHJlbmRlckxpbmVDaGFydChzZWMsIGRheXMubWFwKGQgPT4gKHsgdmFsdWU6IGQueHAsIGxhYmVsOiBkLmxhYmVsLCBpc1RvZGF5OiBkLmtleSA9PT0gdG9kYXlLZXksIHRpcDogdGlwKGQpIH0pKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRheXMubWFwKGQgPT4gTWF0aC5tYXgoMCwgZC54cCkpLCAxKTsgICAvLyBzXHUwMEYzIFhQIHBvc2l0aXZvIGRpbWVuc2lvbmFcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZGF5cy5mb3JFYWNoKCh7IGtleSwgeHAsIGNvdW50LCBsYWJlbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGVtcHR5ID0geHAgPD0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChlbXB0eSA/IFwiIHdkLWdyb3d0aC1iYXItemVyb1wiIDogXCJcIikgfSk7XG4gICAgICBiYXIuc3R5bGUuaGVpZ2h0ID0gZW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoeHAgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIHRpcCh7IHhwLCBjb3VudCwgbGFiZWwgfSkpO1xuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IERBWVMgLSAxIHx8IGlkeCAlIDcgPT09IDA7XG4gICAgICBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1sYmxcIiwgdGV4dDogc2hvd0xibCA/IGxhYmVsIDogXCJcIiB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBQSE9ORV9NQVggPSA2MDA7ICAgLy8gcHggXHUyMDE0IGFiYWl4byBkaXNzbyBvIHBhaW5lbCBlbnRyYSBlbSBcIm1vZG8gQW5kcm9pZFwiXG4vLyBcIk1vZG8gQW5kcm9pZFwiIHBvciBMQVJHVVJBIGRvIHBhaW5lbCAoblx1MDBFM28gcG9yIGRpc3Bvc2l0aXZvKS4gTWVkZSBvIGNvbnRhaW5lcjtcbi8vIGFudGVzIGRvIGxheW91dCAoY2xpZW50V2lkdGggMCkgY2FpIG5vIGRpc3Bvc2l0aXZvLiBQbGF0Zm9ybS5pc1Bob25lIHJlZm9yXHUwMEU3YVxuLy8gcGFyYSBvIGNlbHVsYXIgcmVhbCBzZWd1aXIgZW0gbW9kbyBBbmRyb2lkIGVtIHF1YWxxdWVyIGxhcmd1cmEvb3JpZW50YVx1MDBFN1x1MDBFM28uXG5mdW5jdGlvbiBpc1Bob25lV2lkdGgoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHcgPSBlbC5jbGllbnRXaWR0aDtcbiAgcmV0dXJuIFBsYXRmb3JtLmlzUGhvbmUgfHwgKHcgPiAwICYmIHcgPD0gUEhPTkVfTUFYKTtcbn1cblxuLy8gQmFzZSBkYXMgdmlld3M6IG9ic2VydmEgYSBsYXJndXJhIGRvIHBhaW5lbCBlIHJlLXJlbmRlcml6YSBhbyBjcnV6YXIgbyBsaW1pYXIuXG5hYnN0cmFjdCBjbGFzcyBXZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByb3RlY3RlZCBwaG9uZSA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVyZW5kZXIoKTogdm9pZDtcbiAgcHJvdGVjdGVkIGluaXRQaG9uZVdhdGNoKCkge1xuICAgIGNvbnN0IHJvID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBpc1Bob25lV2lkdGgodGhpcy5jb250ZW50RWwpO1xuICAgICAgaWYgKHAgIT09IHRoaXMucGhvbmUpIHsgdGhpcy5waG9uZSA9IHA7IHRoaXMucmVyZW5kZXIoKTsgfSAgIC8vIHNcdTAwRjMgYW8gQ1JVWkFSIG8gbGltaWFyIFx1MjE5MiBzZW0gbG9vcFxuICAgIH0pO1xuICAgIHJvLm9ic2VydmUodGhpcy5jb250ZW50RWwpO1xuICAgIHRoaXMucmVnaXN0ZXIoKCkgPT4gcm8uZGlzY29ubmVjdCgpKTtcbiAgfVxufVxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgV2RWaWV3IHtcbiAgcHJpdmF0ZSB3ZWVrT2Zmc2V0ID0gMDtcbiAgcHJpdmF0ZSBuYXZQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2VhcmNoVGVybSA9IFwiXCI7XG4gIHByaXZhdGUgcmV2aWV3RmlsdGVyID0gZmFsc2U7XG4gIHByaXZhdGUgZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlO1xuICBwcml2YXRlIHNlY0hvc3RzID0gbmV3IE1hcDxTZWN0aW9uSWQsIEhUTUxFbGVtZW50PigpOyAgIC8vIHdyYXBwZXIgZXN0XHUwMEUxdmVsIHBvciBzZVx1MDBFN1x1MDBFM29cbiAgcHJpdmF0ZSB1bnN1YlRvZG86ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsOyAgICAgICAgICAvLyBjYW5jZWxhciBpbnNjcmlcdTAwRTdcdTAwRTNvIG5vIGNvbnRyb2xsZXJcbiAgcHJpdmF0ZSB1bnN1YkdhbWU6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsOyAgICAgICAgICAvLyBpZGVtIHBhcmEgYSBHYW1pZmljYVx1MDBFN1x1MDBFM29cblxuICAvLyBFc3RhZG8gZG8gU3luY3RoaW5nICh2MC4xMC4wKVxuICBwcml2YXRlIHN5bmNEYXRhOiBTeW5jRGF0YSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNMb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgc3luY0Vycm9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzeW5jRmV0Y2hlZEF0ID0gMDtcbiAgcHJpdmF0ZSBjb25mbGljdENvbmZpcm06IHN0cmluZyB8IG51bGwgPSBudWxsOyAgIC8vIHBhdGggZG8gY29uZmxpdG8gYWd1YXJkYW5kbyBjb25maXJtYVx1MDBFN1x1MDBFM29cblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJEYXNoYm9hcmRcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGF5b3V0LWRhc2hib2FyZFwiOyB9XG5cbiAgYXN5bmMgb25PcGVuKCkge1xuICAgIGF3YWl0IHRoaXMucmVuZGVyKCk7XG4gICAgLy8gSW5zY3JldmUgbm8gY29udHJvbGxlciBcdTAwRkFuaWNvOiBtdWRhblx1MDBFN2EgZGUgZXN0YWRvIHJlLXJlbmRlcml6YSBzXHUwMEYzIGEgc2VcdTAwRTdcdTAwRTNvIFRhcmVmYXMuXG4gICAgdGhpcy51bnN1YlRvZG8gPSB0aGlzLnBsdWdpbi50b2RvLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbmRlclNlY3Rpb24oXCJ0b2RvaXN0XCIpKTtcbiAgICB0aGlzLnVuc3ViR2FtZSA9IHRoaXMucGx1Z2luLmdhbWUuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVuZGVyU2VjdGlvbihcImdhbWVcIikpO1xuICAgIGZvciAoY29uc3QgZXYgb2YgW1wibW9kaWZ5XCIsIFwiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwicmVuYW1lXCJdIGFzIGNvbnN0KVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKGV2IGFzIFwibW9kaWZ5XCIsICgpID0+IHsgdGhpcy5wbHVnaW4uaW52YWxpZGF0ZVZhdWx0Q2FjaGUoKTsgdGhpcy5zY2hlZHVsZSgpOyB9KSk7XG4gICAgdGhpcy5pbml0UGhvbmVXYXRjaCgpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMudW5zdWJHYW1lPy4oKTtcbiAgICB0aGlzLnVuc3ViR2FtZSA9IG51bGw7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gIH1cblxuICAvLyBSZS1yZW5kZXIgcFx1MDBGQWJsaWNvIFx1MjAxNCBjaGFtYWRvIHBlbG8gcGx1Z2luIHF1YW5kbyBhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gbXVkYSBuYSBhYmFcbiAgLy8gZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgKG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcyBkYSBTZW1hbmEpLlxuICByZWZyZXNoKCkgeyB2b2lkIHRoaXMucmVuZGVyKCk7IH1cbiAgcHJvdGVjdGVkIHJlcmVuZGVyKCkgeyB2b2lkIHRoaXMucmVuZGVyKCk7IH1cblxuICBwcml2YXRlIHNjaGVkdWxlKCkge1xuICAgIGlmICh0aGlzLnRpbWVyKSBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXIoKSwgNDAwKTtcbiAgfVxuXG4gIC8vIFByaW1laXJvIHNlZ21lbnRvIGRlIHVtIGNhbWluaG8gKFwiMTAuUHJvamVjdHMvRm9vL0JhclwiIFx1MjE5MiBcIjEwLlByb2plY3RzXCIpLlxuICBwcml2YXRlIHRvcEZvbGRlck9mKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaSA9IHBhdGguaW5kZXhPZihcIi9cIik7XG4gICAgcmV0dXJuIGkgPT09IC0xID8gcGF0aCA6IHBhdGguc2xpY2UoMCwgaSk7XG4gIH1cblxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiKTtcbiAgICB0aGlzLnBob25lID0gaXNQaG9uZVdpZHRoKHRoaXMuY29udGVudEVsKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtcGhvbmVcIiwgdGhpcy5waG9uZSk7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICAvLyBDYWRhIHNlXHUwMEU3XHUwMEUzbyBtb3JhIG51bSBob3N0IGVzdFx1MDBFMXZlbCBcdTIxOTIgZFx1MDBFMSBwYXJhIHJlLXJlbmRlcml6YXIgdW1hIHNlXHUwMEU3XHUwMEUzbyBzXHUwMEYzXG4gICAgLy8gKGV4LjogcmVmcmVzaCBkbyBUb2RvaXN0L1N5bmN0aGluZykgc2VtIHJlY29uc3RydWlyIGEgdmlldyBpbnRlaXJhLlxuICAgIHRoaXMuc2VjSG9zdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgY29uc3QgaG9zdCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1ob3N0XCIgfSk7XG4gICAgICB0aGlzLnNlY0hvc3RzLnNldChpZCwgaG9zdCk7XG4gICAgICB0aGlzLnJlbmRlclNlY3Rpb24oaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlLXJlbmRlcml6YSBhcGVuYXMgYSBzZVx1MDBFN1x1MDBFM28gYGlkYCBkZW50cm8gZG8gc2V1IGhvc3QgKHNlbSB0b2NhciBuYXMgb3V0cmFzKS5cbiAgcHJpdmF0ZSByZW5kZXJTZWN0aW9uKGlkOiBTZWN0aW9uSWQpIHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5zZWNIb3N0cy5nZXQoaWQpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuZW1wdHkoKTtcbiAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiaGVhdG1hcFwiKSB0aGlzLnJlbmRlckhlYXRtYXAoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJzdGF0c1wiKSAgIHRoaXMucmVuZGVyU3RhdHMoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3QoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwic3luY1wiKSAgICB0aGlzLnJlbmRlclN5bmMoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiZ2FtZVwiKSAgICB0aGlzLnJlbmRlckdhbWUoaG9zdCk7XG4gIH1cblxuICAvLyBGYWl4YSBjb21wYWN0YSBkZSBHYW1pZmljYVx1MDBFN1x1MDBFM28gbm8gZGFzaGJvYXJkIChwYWluZWwgY29tcGxldG8gZmljYSBuYSBhYmEgcHJcdTAwRjNwcmlhKS5cbiAgcHJpdmF0ZSByZW5kZXJHYW1lKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkIHx8IHRoaXMuaXNIaWRkZW4oU0VDX0dBTUUpKSByZXR1cm47XG4gICAgY29uc3Qgc2VjID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1nYW1lLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkdBTUlGSUNBXHUwMEM3XHUwMEMzT1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3Qgb3BlbiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vcGVuYnRuXCIgfSk7XG4gICAgc2V0SWNvbihvcGVuLCBcInRyb3BoeVwiKTtcbiAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIGEgYWJhIGRlIEdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiKTtcbiAgICBjbGlja2FibGUob3BlbiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4ub3BlbkdhbWUoKTsgfSk7XG4gICAgdGhpcy5wbHVnaW4uZ2FtZS5yZW5kZXJQYW5lbChzZWMsIGN0cmxzLCB7IGZ1bGw6IGZhbHNlLCBwaG9uZTogdGhpcy5waG9uZSB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBPY3VsdGFyIChsZWl0dXJhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gTW9zdHJhci9vY3VsdGFyIGUgYSBvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcyBzXHUwMEUzbyBhZG1pbmlzdHJhZG9zIG5hIGFiYSBkZVxuICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBkbyBwbHVnaW4uIEEgdmlldyBzXHUwMEYzICpsXHUwMEVBKiBgc2V0dGluZ3MuaGlkZGVuYCBwYXJhIHB1bGFyIG8gcXVlXG4gIC8vIGVzdFx1MDBFMSBvY3VsdG8uIFZlciBXZXJ1c1NldHRpbmdUYWIuXG5cbiAgcHJpdmF0ZSBpc0hpZGRlbihrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb29sdGlwIGRlIG5vdGFzIHJlY2VudGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgc2hvd1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBmaWxlczogVEZpbGVbXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIk1vZGlmaWNhZGFzIHJlY2VudGVtZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBQb3NpY2lvbmEgdW0gdG9vbHRpcCBmaXhvIGFiYWl4byBkbyBhbHZvICh2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN28pLlxuICBwcml2YXRlIHBvc2l0aW9uVGlwKHRpcDogSFRNTEVsZW1lbnQsIHRhcmdldDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR3ID0gdGlwLm9mZnNldFdpZHRoLCB0aCA9IHRpcC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGxlZnQgPSByZWN0LmxlZnQ7XG4gICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgNjtcbiAgICBpZiAobGVmdCArIHR3ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0dyAtIDg7XG4gICAgaWYgKHRvcCArIHRoID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgdG9wID0gcmVjdC50b3AgLSB0aCAtIDY7ICAvLyB2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN29cbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICB9XG5cbiAgLy8gVG9vbHRpcCBsaXN0YW5kbyBhcyBub3RhcyB1cmdlbnRlcyBkZSB1bWEgcGFzdGEgKGhvdmVyIG5vIGJhZGdlIGRlIGF2aXNvKS5cbiAgcHJpdmF0ZSBzaG93VXJnZW5jeVRpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC11cmdlbmN5LXRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiVXJnZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgY29uc3QgZG90ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdXRpcC1kb3RcIiB9KTtcbiAgICAgIGRvdC5zdHlsZS5iYWNrZ3JvdW5kID0gVVJHRU5DWV9DT0xPUltpdC5sZXZlbF07XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBpdC5maWxlLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogaXQubGV2ZWwgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gQmFkZ2UgZGUgYXZpc28gKHRyaVx1MDBFMm5ndWxvKSBubyBjYXJkIGRlIHBhc3RhIHF1ZSBjb250XHUwMEU5bSBub3RhcyBjb20gYHVyZ2VuY3lgLlxuICAvLyBDb3IgcGVsbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vOyBob3ZlciBsaXN0YSBvcyBhcnF1aXZvcy4gRmFzZSAxMC5cbiAgcHJpdmF0ZSB1cmdlbmN5QmFkZ2UoY2FyZDogSFRNTEVsZW1lbnQsIHVyZzogVXJnZW5jeUluZm8pIHtcbiAgICBpZiAoIXVyZy5tYXgpIHJldHVybjtcbiAgICBjb25zdCBiID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1iYWRnZSB3ZC11LSR7dXJnLm1heH1gIH0pO1xuICAgIHNldEljb24oYiwgXCJ0cmlhbmdsZS1hbGVydFwiKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1VyZ2VuY3lUaXAoYiwgdXJnLml0ZW1zKSk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUaXAoKSB7XG4gICAgaWYgKHRoaXMudGlwKSB7IHRoaXMudGlwLnJlbW92ZSgpOyB0aGlzLnRpcCA9IG51bGw7IH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGlwKGNhcmQ6IEhUTUxFbGVtZW50LCByZWNlbnRzOiBURmlsZVtdKSB7XG4gICAgaWYgKCFyZWNlbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGlwKGNhcmQsIHJlY2VudHMpKTtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIFN1YnBhc3RhcyBleGliXHUwMEVEdmVpcyAoaWdub3JhIHBhc3RhcyBzXHUwMEYzLWRlLWltYWdlbnMpLCB2aWEgY2FjaGUgZG8gY29mcmUuXG4gIHByaXZhdGUgc3ViRm9sZGVyc09mKGZvbGRlcjogVEZvbGRlcik6IFRGb2xkZXJbXSB7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCk7XG4gICAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiB7IGNvbnN0IGEgPSBjYWNoZS5ieUZvbGRlci5nZXQoZi5wYXRoKTsgcmV0dXJuICEoYSAmJiBhLmltZyA+IDAgJiYgYS5tZCA9PT0gMCk7IH0pXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYWxlbmRcdTAwRTFyaW8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYWxlbmRhcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19DQUwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtb25kYXkgID0gbW9uZGF5T2YodGhpcy53ZWVrT2Zmc2V0KTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuICAgIGNvbnN0IHRvZGF5SyAgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIEZvbnRlcyBhdGl2YXMgKHBhc3RhcyBtYXJjYWRhcykuIEEgY29yIGRlIGNhZGEgbm90YSB2ZW0gZGEgZm9udGUgZGVcbiAgICAvLyBwcmVmaXhvIG1haXMgZXNwZWNcdTAwRURmaWNvIHF1ZSBhIGNvbnRcdTAwRTltLlxuICAgIGNvbnN0IHNvdXJjZXMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMuZmlsdGVyKHMgPT4gcy5vbik7XG4gICAgY29uc3QgY29sb3JGb3IgPSAocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBsZXQgYmVzdDogQ2FsU291cmNlIHwgbnVsbCA9IG51bGw7XG4gICAgICBmb3IgKGNvbnN0IHMgb2Ygc291cmNlcykge1xuICAgICAgICBpZiAocGF0aCA9PT0gYCR7cy5wYXRofS5tZGAgfHwgcGF0aC5zdGFydHNXaXRoKGAke3MucGF0aH0vYCkpIHtcbiAgICAgICAgICBpZiAoIWJlc3QgfHwgcy5wYXRoLmxlbmd0aCA+IGJlc3QucGF0aC5sZW5ndGgpIGJlc3QgPSBzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdCA/IGJlc3QuY29sb3IgOiBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBcyBub3RhcyBjb20gZGF0YSBqXHUwMEUxIHZcdTAwRUFtIGRvIGNhY2hlICh1bWEgcGFzc2FkYSk7IGFxdWkgc1x1MDBGMyBmaWx0cmEgcG9yIGZvbnRlLlxuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZzsgZmlsZTogVEZpbGU7IGNvbG9yOiBzdHJpbmcgfVtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgeyBmaWxlLCBkYXRlIH0gb2YgdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmRhdGVkTm90ZXMpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gY29sb3JGb3IoZmlsZS5wYXRoKTtcbiAgICAgIGlmICghY29sb3IpIGNvbnRpbnVlOyAgIC8vIHNcdTAwRjMgbm90YXMgZGVudHJvIGRlIHVtYSBmb250ZSBtYXJjYWRhXG4gICAgICAoYnlEYXlbZGF0ZV0gPz89IFtdKS5wdXNoKHsgbmFtZTogZmlsZS5iYXNlbmFtZSwgZmlsZSwgY29sb3IgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1jYWwtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IG5hdiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hdi1iYXJcIiB9KTtcbiAgICBjb25zdCBwaG9uZSA9IHRoaXMucGhvbmU7XG5cbiAgICAvLyBDZWx1bGFyOiBqYW5lbGEgZGUgMyBkaWFzID0gb250ZW0gXHUwMEI3IGhvamUgXHUwMEI3IGFtYW5oXHUwMEUzICh3ZWVrT2Zmc2V0IHBhZ2luYSBkZSAzIGVtIDMpLlxuICAgIGNvbnN0IGRheUFuY2hvciA9IG5ldyBEYXRlKCk7XG4gICAgZGF5QW5jaG9yLnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSAtIDEgKyB0aGlzLndlZWtPZmZzZXQgKiAzKTtcbiAgICBjb25zdCBmbXRETSA9IChkOiBEYXRlKSA9PiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSBuZXcgRGF0ZShkYXlBbmNob3IpOyBsYXN0LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIDIpO1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYCR7Zm10RE0oZGF5QW5jaG9yKX0gXHUyMDEzICR7Zm10RE0obGFzdCl9YCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYFJlbGF0XHUwMEYzcmlvcyBcdTAwQjcgc2VtYW5hICR7d2Vla051bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGN0cmxzID0gbmF2LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtY3RybHNcIiB9KTtcbiAgICBjb25zdCBwcmV2ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwMzlcIiB9KTtcbiAgICBjb25zdCBuZXh0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICBwcmV2LnNldEF0dHIoXCJ0aXRsZVwiLCBcIlNlbWFuYSBhbnRlcmlvclwiKTtcbiAgICBuZXh0LnNldEF0dHIoXCJ0aXRsZVwiLCBcIlByXHUwMEYzeGltYSBzZW1hbmFcIik7XG4gICAgY2xpY2thYmxlKHByZXYsICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0LS07IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNsaWNrYWJsZShuZXh0LCAoKSA9PiB7IHRoaXMud2Vla09mZnNldCsrOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDZWx1bGFyOiBsaXN0YSB2ZXJ0aWNhbCBkZSAzIGRpYXMgKG9udGVtL2hvamUvYW1hbmhcdTAwRTMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENhZGEgZGlhID0gYSBub3RhIGRpXHUwMEUxcmlhICh1bWEgcG9yIGRpYSkuIExpbmhhIGludGVpcmEgY2xpY1x1MDBFMXZlbDogYWJyZSBhXG4gICAgLy8gZXhpc3RlbnRlOyBzZSBuXHUwMEUzbyBob3V2ZXIsIGNyaWEuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsaXN0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbGlzdFwiIH0pO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoZGF5QW5jaG9yKTtcbiAgICAgICAgZGF5LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIGkpO1xuICAgICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgICBjb25zdCBkb3cgPSAoZGF5LmdldERheSgpICsgNikgJSA3O1xuICAgICAgICBjb25zdCBub3RlID0gdGhpcy5maW5kRGFpbHlOb3RlKGtleSk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IFtcIndkLWNhbC1kcm93XCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgZG93ID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5zZXRBdHRyKFwidGl0bGVcIiwgbm90ZSA/IFwiQWJyaXIgbm90YSBkaVx1MDBFMXJpYVwiIDogXCJDcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgICBjb25zdCBoZCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWRyb3ctaGRcIiB9KTtcbiAgICAgICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbZG93XSB9KTtcbiAgICAgICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgICAgY29uc3QgYm9keSA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWRyb3ctbm90ZXNcIiB9KTtcbiAgICAgICAgaWYgKG5vdGUpIHtcbiAgICAgICAgICBjb25zdCBwaWxsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgICBwaWxsLnRleHRDb250ZW50ID0gbm90ZS5iYXNlbmFtZS5sZW5ndGggPiAyNCA/IG5vdGUuYmFzZW5hbWUuc2xpY2UoMCwgMjQpICsgXCJcdTIwMjZcIiA6IG5vdGUuYmFzZW5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYm9keS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1kcm93LWVtcHR5XCIsIHRleHQ6IFwiY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNsaWNrYWJsZShyb3csICgpID0+IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBEZXNrdG9wL3RhYmxldDogZ3JhZGUgZGUgNyBkaWFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBjbGlja2FibGUoaGQsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpOyB9KTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldID8/IFtdO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcy5zbGljZSgwLCAzKSkge1xuICAgICAgICBjb25zdCBwaWxsID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICBwaWxsLnN0eWxlLnNldFByb3BlcnR5KFwiLS13ZC1zcmNcIiwgaXQuY29sb3IpO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtZG90XCIgfSk7XG4gICAgICAgIHBpbGwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtcGlsbC10eHRcIiwgdGV4dDogaXQubmFtZS5sZW5ndGggPiAxNCA/IGl0Lm5hbWUuc2xpY2UoMCwgMTQpICsgXCJcdTIwMjZcIiA6IGl0Lm5hbWUgfSk7XG4gICAgICAgIHBpbGwuc2V0QXR0cihcInRpdGxlXCIsIGl0Lm5hbWUpO1xuICAgICAgICBjbGlja2FibGUocGlsbCwgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGl0LmZpbGUpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAzKSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1tb3JlXCIsIHRleHQ6IGArJHtpdGVtcy5sZW5ndGggLSAzfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICBlbmQuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgNik7XG4gICAgc2VjLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IFwid2QtY2FsLWZvb3RlclwiLFxuICAgICAgdGV4dDogbW9uZGF5LmdldE1vbnRoKCkgPT09IGVuZC5nZXRNb250aCgpXG4gICAgICAgID8gYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSAke21vbmRheS5nZXRGdWxsWWVhcigpfWBcbiAgICAgICAgOiBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19IFx1MjAxMyAke01PTlRIX1NIT1JUW2VuZC5nZXRNb250aCgpXX0gJHtlbmQuZ2V0RnVsbFllYXIoKX1gLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQWNoYSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWAgKFlZWVktTU0tREQpOiBwcmltZWlybyBwZWxvIGNhbWluaG8gY2FuXHUwMEY0bmljbyBlbVxuICAvLyA1MC5EaVx1MDBFMXJpby8sIHNlblx1MDBFM28gcXVhbHF1ZXIgbm90YSBjdWpvIGBkYXRlOmAgc2VqYSBlc3NlIGRpYS4gTnVsbCBzZSBuXHUwMEUzbyBob3V2ZXIuXG4gIC8vIChSZWxhdFx1MDBGM3Jpby9ub3RhIGRpXHUwMEUxcmlhIFx1MDBFOSB1bSBwb3IgZGlhIFx1MjE5MiBhYnJlIG8gZXhpc3RlbnRlIGVtIHZleiBkZSBjcmlhciBvdXRyby4pXG4gIHByaXZhdGUgZmluZERhaWx5Tm90ZShrZXk6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZGlyZWN0ID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCk7XG4gICAgaWYgKGRpcmVjdCBpbnN0YW5jZW9mIFRGaWxlKSByZXR1cm4gZGlyZWN0O1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuZGF0ZWROb3Rlcy5maW5kKG4gPT4gbi5kYXRlID09PSBrZXkpPy5maWxlID8/IG51bGw7XG4gIH1cblxuICAvLyBBYnJlIGEgbm90YSBkaVx1MDBFMXJpYSBkZSBga2V5YDsgY3JpYSBlbSA1MC5EaVx1MDBFMXJpby8gU1x1MDBEMyBzZSBuXHUwMEUzbyBleGlzdGlyIG5lbmh1bWEuXG4gIHByaXZhdGUgYXN5bmMgb3BlbkRhaWx5Tm90ZShrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5maW5kRGFpbHlOb3RlKGtleSk7XG4gICAgaWYgKGV4aXN0aW5nKSB7IGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShleGlzdGluZyk7IHJldHVybjsgfVxuXG4gICAgLy8gTlx1MDBFM28gZXhpc3RlIFx1MjE5MiBjcmlhIG5vIGNhbWluaG8gY2FuXHUwMEY0bmljby5cbiAgICBpZiAoIXRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9GT0xERVIpKVxuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKERBSUxZX0ZPTERFUikuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgY29uc3QgW3ksIG0sIGRdID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICBjb25zdCB0aXR1bG8gPSBuZXcgRGF0ZSgreSwgK20gLSAxLCArZCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIiwge1xuICAgICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gICAgfSk7XG5cbiAgICAvLyBVc2EgbyB0ZW1wbGF0ZSBlbSBNb2RlbG9zLyBzZSBleGlzdGlyOyBzZW5cdTAwRTNvLCBmYWxsYmFjayBlbWJ1dGlkby5cbiAgICBjb25zdCB0cGwgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfVEVNUExBVEUpO1xuICAgIGxldCBib2R5OiBzdHJpbmc7XG4gICAgaWYgKHRwbCBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICBib2R5ID0gKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodHBsKSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccypkYXRlXFxzKlxcfVxcfS9nLCBrZXkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqdGl0bGVcXHMqXFx9XFx9L2csIHRpdHVsbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvZHkgPVxuYC0tLVxub3duZXI6IFdlcnVzXG5jcmVhdGVkOiAke2tleX1cbmRhdGU6ICR7a2V5fVxucmV2aWV3ZWQ6IHRydWVcbnR5cGU6IGRhaWx5XG5wZXJtaXNzaW9uczpcbiAgcmVhZDogW2FsbF1cbiAgd3JpdGU6XG4gICAgLSBXZXJ1c1xuLS0tXG5cbiMgJHt0aXR1bG99XG5cbmA7XG4gICAgfVxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoYCR7REFJTFlfRk9MREVSfS8ke2tleX0ubWRgLCBib2R5KTtcbiAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZmlsZSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZHMgZG8gY29mcmUgKHRvZGFzIGFzIHBhc3RhcyBkZSB0b3BvKSArIG5hdmVnYWRvciBhbmluaGFkbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclBhcmEocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfUEFSQSkpIHJldHVybjtcbiAgICAvLyBTZSBhIHBhc3RhIGFiZXJ0YSBubyBuYXZlZ2Fkb3IgZm9pIG9jdWx0YWRhIG5hcyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcywgZmVjaGEuXG4gICAgaWYgKHRoaXMubmF2UGF0aCAmJiB0aGlzLmlzSGlkZGVuKHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSkpIHRoaXMubmF2UGF0aCA9IG51bGw7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFyYS1ncmlkXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgICAvLyBpZ25vcmEgLm9ic2lkaWFuLCAudHJhc2gsIGV0Yy5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVJvb3QgPSB0aGlzLm5hdlBhdGggPyB0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkgOiBudWxsO1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgYWdnICAgICA9IGNhY2hlLmJ5Rm9sZGVyLmdldChmb2xkZXIucGF0aCkgPz8gRU1QVFlfQUdHO1xuICAgICAgY29uc3QgbWV0YSAgICA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBjb3ZlciAgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IG5hdmlnYWJsZSA9IHRoaXMuc3ViRm9sZGVyc09mKGZvbGRlcikubGVuZ3RoID4gMCB8fCBmaWxlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB7IGl0ZW1zOiBhZ2cudXJnZW5jeSwgbWF4OiBhZ2cudXJnZW5jeU1heCB9KTtcblxuICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dCh7IG1kOiBhZ2cubWQsIGltZzogYWdnLmltZyB9KSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGlmIChhZ2cubWQgPiAwKSB7XG4gICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQoYWdnLnJldmlld2VkIC8gYWdnLm1kICogMTAwKX0lYDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgYWdnLnJlY2VudCk7XG5cbiAgICAgIGNsaWNrYWJsZShjYXJkLCAoKSA9PiB7XG4gICAgICAgIGlmIChuYXZpZ2FibGUpIHsgdGhpcy5uYXZQYXRoID0gaXNBY3RpdmUgPyBudWxsIDogZm9sZGVyLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH1cbiAgICAgICAgZWxzZSByZXZlYWxJbkV4cGxvcmVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFpZHgpIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIHZpc1x1MDBFRHZlbC5cIiB9KTtcblxuICAgIC8vIEFycXVpdm9zIHNvbHRvcyBuYSByYWl6IGRvIGNvZnJlXG4gICAgY29uc3Qgcm9vdEZpbGVzID0gZmlsZXNJbih2YXVsdFJvb3QpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMoc2VjLCByb290RmlsZXMsIFwiYXJxdWl2b3MgbmEgcmFpelwiKTtcblxuICAgIGlmICh0aGlzLm5hdlBhdGgpIHtcbiAgICAgIGNvbnN0IGZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLm5hdlBhdGgpO1xuICAgICAgaWYgKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpIHRoaXMucmVuZGVyQnJvd3NlcihzZWMsIGZvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgLy8gUGFpbmVsIGlubGluZSBuYXZlZ1x1MDBFMXZlbCAoYnJlYWRjcnVtYiArIHN1YnBhc3RhcyArIG5vdGFzIGRhIHBhc3RhIGF0dWFsKVxuICBwcml2YXRlIHJlbmRlckJyb3dzZXIocGFyZW50OiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3Qgcm9vdFBhdGggPSB0aGlzLnRvcEZvbGRlck9mKGZvbGRlci5wYXRoKTtcbiAgICBjb25zdCByb290Rm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJvb3RQYXRoKTtcbiAgICBpZiAoIShyb290Rm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikpIHJldHVybjtcbiAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgcm9vdEZvbGRlcik7XG5cbiAgICBjb25zdCBwYW5lbCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFuZWxcIiB9KTtcbiAgICBwYW5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgIC8vIEJyZWFkY3J1bWJcbiAgICBjb25zdCBjcnVtYiA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jcnVtYlwiIH0pO1xuICAgIGNvbnN0IHJlbCA9IGZvbGRlci5wYXRoID09PSByb290UGF0aCA/IFtdIDogZm9sZGVyLnBhdGguc2xpY2Uocm9vdFBhdGgubGVuZ3RoICsgMSkuc3BsaXQoXCIvXCIpO1xuXG4gICAgY29uc3Qgcm9vdFNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAocmVsLmxlbmd0aCA9PT0gMCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIikgfSk7XG4gICAgcmVuZGVySWNvbihyb290U2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgIHJvb3RTZWcuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgaWYgKHJlbC5sZW5ndGgpIGNsaWNrYWJsZShyb290U2VnLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHJvb3RQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgY2xpY2thYmxlKHNlZywgKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZWdQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3NlID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1jbG9zZVwiLCB0ZXh0OiBcIlx1MjcxNVwiIH0pO1xuICAgIGNsb3NlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkZlY2hhclwiKTtcbiAgICBjbGlja2FibGUoY2xvc2UsICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICAvLyBDYW1wbyBkZSBidXNjYVxuICAgIGNvbnN0IHNlYXJjaFdyYXAgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VhcmNoLXdyYXBcIiB9KTtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHNlYXJjaFdyYXAuY3JlYXRlRWwoXCJpbnB1dFwiLCB7XG4gICAgICBjbHM6IFwid2Qtc2VhcmNoXCIsXG4gICAgICBhdHRyOiB7IHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJmaWx0cmFyXHUyMDI2XCIsIHZhbHVlOiB0aGlzLnNlYXJjaFRlcm0gfSxcbiAgICB9KTtcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zZWFyY2hUZXJtID0gc2VhcmNoSW5wdXQudmFsdWU7XG4gICAgICBjb25zdCB0ZXJtID0gdGhpcy5zZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1zdWItY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbGJsID0gZWwucXVlcnlTZWxlY3RvcihcIi53ZC1sYWJlbFwiKT8udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkgPz8gXCJcIjtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGxibC5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtbm90ZS1yb3csIC53ZC1ub3RlLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAoZWwucXVlcnlTZWxlY3RvcihcIi53ZC1ub3RlLW5hbWUsIC53ZC1ub3RlLWNhcmQtbmFtZVwiKT8udGV4dENvbnRlbnQgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IG5hbWUuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFN1YnBhc3RhcyBjb21vIGNhcmRzXG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCk7XG4gICAgY29uc3Qgc3VicyA9IHRoaXMuc3ViRm9sZGVyc09mKGZvbGRlcik7XG4gICAgaWYgKHN1YnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZ3JpZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9qLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3Qgc2Ygb2Ygc3Vicykge1xuICAgICAgICBjb25zdCBhZ2cgICAgPSBjYWNoZS5ieUZvbGRlci5nZXQoc2YucGF0aCkgPz8gRU1QVFlfQUdHO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWFkRm9sZGVyU3RhdHVzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IGNvdmVyICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgZGVlcGVyID0gdGhpcy5zdWJGb2xkZXJzT2Yoc2YpLmxlbmd0aCA+IDA7XG4gICAgICAgIGNvbnN0IGN1c3RvbUljb24gPSByZWFkRm9sZGVySWNvbih0aGlzLmFwcCwgc2YpO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBzZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1jYXJkIHdkLXN1Yi1jYXJkIHdkLXMtJHtzdGF0dXN9YCB9KTtcbiAgICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXJcIiB9KS5jcmVhdGVFbChcImltZ1wiLCB7IGF0dHI6IHsgc3JjOiBjb3ZlciwgZHJhZ2dhYmxlOiBcImZhbHNlXCIgfSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDYXBhIHBhZHJcdTAwRTNvIHN1dGlsICh2ZXJzXHUwMEUzbyBtZW5vciBxdWUgYXMgcGFzdGFzIGRlIHRvcG8pIFx1MjAxNCBGYXNlIDkuMVxuICAgICAgICAgIGNvbnN0IGRjID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXIgd2QtY292ZXItZGVmYXVsdCB3ZC1jb3Zlci1zdWJcIiB9KTtcbiAgICAgICAgICByZW5kZXJJY29uKGRjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY292ZXItZ2x5cGhcIiB9KSwgY3VzdG9tSWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtYmFkZ2Ugd2QtYmFkZ2UtJHtzdGF0dXN9YCwgdGV4dDogU1RBVFVTX0lDT05bc3RhdHVzXSB9KTtcbiAgICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgeyBpdGVtczogYWdnLnVyZ2VuY3ksIG1heDogYWdnLnVyZ2VuY3lNYXggfSk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgICAgaWYgKGN1c3RvbUljb24pIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvbiB3ZC1zdWItaWNvblwiIH0pLCBjdXN0b21JY29uKTtcbiAgICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHsgbWQ6IGFnZy5tZCwgaW1nOiBhZ2cuaW1nIH0pIH0pO1xuICAgICAgICBpZiAoZGVlcGVyKSB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdWItYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcblxuICAgICAgICBjb25zdCBsYWJlbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsIHRleHQ6IHNmLm5hbWUgfSk7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIGxhYmVsLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IFwiY2FuY2VsbGVkXCIgJiYgYWdnLm1kID4gMCkge1xuICAgICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHthZ2cucmV2aWV3ZWR9LyR7YWdnLm1kfSByZXZpc2FkYXNgKTtcbiAgICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQoYWdnLnJldmlld2VkIC8gYWdnLm1kICogMTAwKX0lYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjYXJkLnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGFnZy5yZWNlbnQpO1xuICAgICAgICAgIGNsaWNrYWJsZShjYXJkLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNmLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXJxdWl2b3MgZGEgcGFzdGEgYXR1YWwgKG5vdGFzLCBjYW52YXMsIGJhc2VzKVxuICAgIGNvbnN0IG5vdGVzID0gZmlsZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYXRtYXAgKHZpYSBwbHVnaW4gSGVhdG1hcCBDYWxlbmRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWF0bWFwKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0hFQVQpKSByZXR1cm47XG4gICAgaWYgKHRoaXMucGhvbmUpIHJldHVybjsgICAvLyBoZWF0bWFwIChhbm8gaW50ZWlybykgb2N1bHRhZG8gcXVhbmRvIG8gcGFpbmVsIFx1MDBFOSBlc3RyZWl0b1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhIChkbyBjYWNoZSksIGZpbHRyYWRhcyBwZWxvIGFubyBjb3JyZW50ZS5cbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IHByZWZpeCA9IFN0cmluZyh5ZWFyKTtcbiAgICBjb25zdCBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW2RhdGUsIG5dIG9mIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5jdGltZUJ5RGF5KSB7XG4gICAgICBpZiAoIWRhdGUuc3RhcnRzV2l0aChwcmVmaXgpKSBjb250aW51ZTtcbiAgICAgIGVudHJpZXMucHVzaCh7IGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIGNvbnN0IHRvdGFsTm90ZXMgPSBjYWNoZS50b3RhbE5vdGVzO1xuICAgIGNvbnN0IHRvdGFsUmV2aWV3ZWQgPSBjYWNoZS50b3RhbFJldmlld2VkO1xuICAgIC8vIFwiZXN0YSBzZW1hbmFcIiA9IGNyaWFcdTAwRTdcdTAwRjVlcyBub3MgXHUwMEZBbHRpbW9zIDcgZGlhcyAoZG8gY2FjaGUsIHBvciBkYXRhIFx1MjE5MiBzZW1wcmUgZnJlc2NvKS5cbiAgICBsZXQgY3JlYXRlZFRoaXNXZWVrID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7IGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY3JlYXRlZFRoaXNXZWVrICs9IGNhY2hlLmN0aW1lQnlEYXkuZ2V0KHRvS2V5KGQpKSA/PyAwO1xuICAgIH1cbiAgICBjb25zdCBnbG9iYWxQY3QgPSB0b3RhbE5vdGVzID4gMCA/IE1hdGgucm91bmQodG90YWxSZXZpZXdlZCAvIHRvdGFsTm90ZXMgKiAxMDApIDogMDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkVTVEFUXHUwMENEU1RJQ0FTXCIgfSk7XG5cbiAgICAvLyBOXHUwMEZBbWVyb3MgZ2xvYmFpc1xuICAgIGNvbnN0IGdsb2IgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZ2xvYmFsXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnXCIsIHRleHQ6IFN0cmluZyh0b3RhbE5vdGVzKSB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJub3Rhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZyB3ZC1zdGF0LXJldi1udW1cIiwgdGV4dDogYCR7Z2xvYmFsUGN0fSVgIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcInJldmlzYWRhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXdlZWtcIiwgdGV4dDogYCske2NyZWF0ZWRUaGlzV2Vla31gIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcImVzdGEgc2VtYW5hXCIgfSk7XG5cbiAgICAvLyBCcmVha2Rvd24gcG9yIHBhc3RhXG4gICAgY29uc3QgdGFibGUgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtdGFibGVcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG5cbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgYWdnID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGZvbGRlci5wYXRoKSA/PyBFTVBUWV9BR0c7XG4gICAgICBpZiAoYWdnLm1kID09PSAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgcGN0ID0gTWF0aC5yb3VuZChhZ2cucmV2aWV3ZWQgLyBhZ2cubWQgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke2FnZy5tZH1gIH0pO1xuXG4gICAgICBjb25zdCBiYXJXcmFwID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhclwiIH0pO1xuICAgICAgYmFyV3JhcC5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy5yZXZpZXdGaWx0ZXIpKTtcbiAgICBjbGlja2FibGUoYnRuUGVuZCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucmV2aWV3RmlsdGVyID0gIXRoaXMucmV2aWV3RmlsdGVyOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyghaXNHcmlkKSk7XG4gICAgY2xpY2thYmxlKGJ0bkwsIGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwibGlzdFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgY29uc3QgYnRuRyA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI5RVwiIH0pO1xuICAgIGJ0bkcuc2V0QXR0cihcInRpdGxlXCIsIFwiQ29sdW5hc1wiKTtcbiAgICBidG5HLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKGlzR3JpZCkpO1xuICAgIGNsaWNrYWJsZShidG5HLCBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImdyaWRcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNhcmQgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gcG9yIHRpcG8gZGUgYXJxdWl2byAobm90YSAvIGNhbnZhcyAvIGJhc2UpIFx1MjAxNCBGYXNlIDkuMlxuICAgICAgICBjb25zdCBjb3YgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY292ZXIgd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24oY292LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1jb3Zlci1nbHlwaFwiIH0pLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcblxuICAgICAgICBpZiAoaXNNZCkgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjbGlja2FibGUoY2FyZCwgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGlzdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLXJvdyB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgY29uc3QgdGkgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtdHlwZWljb24gd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24odGksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLWRvdCB3ZC1iYWRnZS0ke3N0fWAgfSk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIGNsaWNrYWJsZShyb3csICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEdyXHUwMEUxZmljbyBkZSBjcmVzY2ltZW50byBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckdyb3d0aChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19HUk9XKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ1JFU0NJTUVOVE8gRE8gQ09GUkVcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGJ0bkRheSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghdGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcImRpYVwiIH0pO1xuICAgIGJ0bkRheS5zZXRBdHRyKFwidGl0bGVcIiwgXCJOb3RhcyBjcmlhZGFzIHBvciBkaWFcIik7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUpKTtcbiAgICBjbGlja2FibGUoYnRuRGF5LCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gZmFsc2U7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNvbnN0IGJ0bkN1bSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwidG90YWxcIiB9KTtcbiAgICBidG5DdW0uc2V0QXR0cihcInRpdGxlXCIsIFwiVG90YWwgYWN1bXVsYWRvIG5vIHBlclx1MDBFRG9kb1wiKTtcbiAgICBidG5DdW0uc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy5ncm93dGhDdW11bGF0aXZlKSk7XG4gICAgY2xpY2thYmxlKGJ0bkN1bSwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IHRydWU7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNvbnN0IGNtID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ3Jvd3RoQ2hhcnRNb2RlO1xuICAgIGNvbnN0IG1rQ2hhcnRCdG4gPSAobTogXCJiYXJzXCIgfCBcImxpbmVcIiwgbGFiZWw6IHN0cmluZywgdGl0bGU6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgYiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArIChjbSA9PT0gbSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogbGFiZWwgfSk7XG4gICAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7IGIuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcoY20gPT09IG0pKTtcbiAgICAgIGNsaWNrYWJsZShiLCBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ3Jvd3RoQ2hhcnRNb2RlID0gbTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIH07XG4gICAgbWtDaGFydEJ0bihcImJhcnNcIiwgXCJiYXJyYXNcIiwgXCJHclx1MDBFMWZpY28gZGUgYmFycmFzXCIpO1xuICAgIG1rQ2hhcnRCdG4oXCJsaW5lXCIsIFwibGluaGFcIiwgXCJMaW5oYSBjb20gcG9udG9zXCIpO1xuXG4gICAgLy8gTm90YXMgcG9yIGRhdGEgZGUgY3JpYVx1MDBFN1x1MDBFM28gKGRvIGNhY2hlKS5cbiAgICBjb25zdCBjb3VudHMgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuY3RpbWVCeURheTtcblxuICAgIC8vIFx1MDBEQWx0aW1vcyBOIGRpYXMgKG1lbm9zIHF1YW5kbyBvIHBhaW5lbCBcdTAwRTkgZXN0cmVpdG8pXG4gICAgY29uc3QgREFZUyA9IHRoaXMucGhvbmUgPyAxNSA6IDMwO1xuICAgIGNvbnN0IGRheXM6IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IERBWVMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBkYXlzLnB1c2goeyBrZXksIGNvdW50OiBjb3VudHMuZ2V0KGtleSkgPz8gMCwgbGFiZWw6IGAke2RheX0vJHttfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWwgPSBkYXlzLnJlZHVjZSgocywgZCkgPT4gcyArIGQuY291bnQsIDApO1xuICAgIGNvbnN0IHRvZGF5S2V5ID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBNb2RvIGN1bXVsYXRpdm86IHNvbWEgYWN1bXVsYWRhIGRpYSBhIGRpYVxuICAgIHR5cGUgRGF5RW50cnkgPSB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nOyBkaXNwbGF5VmFsOiBudW1iZXIgfTtcbiAgICBsZXQgZW50cmllczogRGF5RW50cnlbXTtcbiAgICBpZiAodGhpcy5ncm93dGhDdW11bGF0aXZlKSB7XG4gICAgICBsZXQgYWNjID0gMDtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+IHsgYWNjICs9IGQuY291bnQ7IHJldHVybiB7IC4uLmQsIGRpc3BsYXlWYWw6IGFjYyB9OyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4gKHsgLi4uZCwgZGlzcGxheVZhbDogZC5jb3VudCB9KSk7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmVudHJpZXMubWFwKGUgPT4gZS5kaXNwbGF5VmFsKSwgMSk7XG5cbiAgICAvLyBMaW5oYSBkZSByZXN1bW9cbiAgICBjb25zdCBpbmZvID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtaW5mb1wiIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtdG90YWxcIiwgdGV4dDogYCR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZW50cmllc1tlbnRyaWVzLmxlbmd0aCAtIDFdLmRpc3BsYXlWYWwgOiB0b3RhbH1gIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtcGVyaW9kXCIsIHRleHQ6IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGBub3RhcyBhY3VtdWxhZGFzICgke0RBWVN9IGRpYXMpYCA6IGBub3RhcyBjcmlhZGFzIG5vcyBcdTAwRkFsdGltb3MgJHtEQVlTfSBkaWFzYCB9KTtcblxuICAgIGNvbnN0IHRpcEZvciA9IChlOiBEYXlFbnRyeSkgPT4gYCR7ZS5sYWJlbH06ICR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZS5kaXNwbGF5VmFsICsgXCIgdG90YWxcIiA6IGUuY291bnQgKyBcIiBub3RhKHMpXCJ9YDtcbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZ3Jvd3RoQ2hhcnRNb2RlID09PSBcImxpbmVcIikge1xuICAgICAgcmVuZGVyTGluZUNoYXJ0KHNlYywgZW50cmllcy5tYXAoZSA9PiAoeyB2YWx1ZTogZS5kaXNwbGF5VmFsLCBsYWJlbDogZS5sYWJlbCwgaXNUb2RheTogZS5rZXkgPT09IHRvZGF5S2V5LCB0aXA6IHRpcEZvcihlKSB9KSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEdyXHUwMEUxZmljbyBkZSBiYXJyYXNcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZW50cmllcy5mb3JFYWNoKChlLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHsga2V5LCBsYWJlbCwgZGlzcGxheVZhbCB9ID0gZTtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBkaXNwbGF5VmFsID09PSAwO1xuICAgICAgY29uc3QgYmFyID0gYmFyQXJlYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhclwiICsgKGlzRW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGlzRW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoZGlzcGxheVZhbCAvIG1heCkgKiAxMDApKX0lYDtcbiAgICAgIGlmICghaXNFbXB0eSkgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXBGb3IoZSkpO1xuXG4gICAgICBjb25zdCBzaG93TGJsID0gaWR4ID09PSAwIHx8IGlkeCA9PT0gNyB8fCBpZHggPT09IDE0IHx8IGlkeCA9PT0gMjEgfHwgaWR4ID09PSAyOSB8fCBrZXkgPT09IHRvZGF5S2V5O1xuICAgICAgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtbGJsXCIsIHRleHQ6IHNob3dMYmwgPyBsYWJlbCA6IFwiXCIgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCAoZGVsZWdhZG8gYW8gVG9kb2lzdENvbnRyb2xsZXIgY29tcGFydGlsaGFkbykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJUb2RvaXN0KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1RPRE8pKSByZXR1cm47XG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIC8vIEJvdFx1MDBFM28gZGUgbmF2ZWdhXHUwMEU3XHUwMEUzbyBcdTIxOTIgYWJyZSBhIGFiYSBkZWRpY2FkYSBkbyBUb2RvaXN0IChvIGRhc2hib2FyZCBcdTAwRTkgbyBodWIpLlxuICAgIGNvbnN0IG9wZW4gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3BlbmJ0blwiIH0pO1xuICAgIHNldEljb24ob3BlbiwgXCJzcXVhcmUtYXJyb3ctb3V0LXVwLXJpZ2h0XCIpO1xuICAgIG9wZW4uc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgYSBhYmEgZG8gVG9kb2lzdFwiKTtcbiAgICBjbGlja2FibGUob3BlbiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4ub3BlblRvZG9pc3QoKTsgfSk7XG4gICAgLy8gTGFuXHUwMEU3YWRvciBkZSBwYWNvdGVzIGNvbXBhY3RvIChzb21lIHNlIG5cdTAwRTNvIGhvdXZlciBwYWNvdGVzKS5cbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlclBhY2thZ2VzKHNlYyk7XG4gICAgLy8gRGFzaGJvYXJkID0gc1x1MDBGMyBvIGVzc2VuY2lhbCAoQXRyYXNhZGFzIFx1MDBCNyBIb2plIFx1MDBCNyBQclx1MDBGM3hpbW9zIDcpLiBcIkRlcG9pc1wiIGZpY2FcbiAgICAvLyBzXHUwMEYzIG5hIGFiYSBkbyBUb2RvaXN0IFx1MjE5MiByZWNvcnJlbnRlcyBzXHUwMEYzIGFwYXJlY2VtIGFxdWkgcGVydG8gZG8gZGlhLlxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyTGlzdChzZWMsIGN0cmxzLCB7IHNob3dMYXRlcjogZmFsc2UgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2luY3Jvbml6YVx1MDBFN1x1MDBFM28gKFN5bmN0aGluZyArIGNvbmZsaXRvcykgXHUyMDE0IHYwLjEwLjAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcmVzZXRTeW5jKCkge1xuICAgIHRoaXMuc3luY0RhdGEgPSBudWxsO1xuICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IDA7XG4gICAgdGhpcy5zeW5jRXJyb3IgPSBudWxsO1xuICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBmZXRjaFN5bmMobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgYmFzZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybC50cmltKCk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5LnRyaW0oKTtcbiAgICBpZiAoIWJhc2UgfHwgIWtleSB8fCB0aGlzLnN5bmNMb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5zeW5jRXJyb3IgPSBudWxsO1xuICAgIGlmIChtYW51YWwpIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvbGRlcnMgPSBhd2FpdCBzdEdldDxTVEZvbGRlcltdPihiYXNlLCBrZXksIFwiL3Jlc3QvY29uZmlnL2ZvbGRlcnNcIik7XG4gICAgICBjb25zdCB3YW50ZWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZC50cmltKCk7XG4gICAgICBjb25zdCBmb2xkZXIgPSBmb2xkZXJzLmZpbmQoZiA9PiBmLmlkID09PSB3YW50ZWQpID8/IGZvbGRlcnNbMF07XG4gICAgICBpZiAoIWZvbGRlcikgdGhyb3cgbmV3IEVycm9yKFwibmVuaHVtYSBwYXN0YSBjb25maWd1cmFkYSBubyBTeW5jdGhpbmdcIik7XG4gICAgICBjb25zdCBmaWQgPSBlbmNvZGVVUklDb21wb25lbnQoZm9sZGVyLmlkKTtcblxuICAgICAgY29uc3QgW2RldmljZXMsIGNvbm5zLCBzdGF0dXMsIHN0YXRzLCBzeXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBzdEdldDxTVERldmljZVtdPihiYXNlLCBrZXksIFwiL3Jlc3QvY29uZmlnL2RldmljZXNcIiksXG4gICAgICAgIHN0R2V0PHsgY29ubmVjdGlvbnM6IFJlY29yZDxzdHJpbmcsIHsgY29ubmVjdGVkOiBib29sZWFuIH0+IH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vY29ubmVjdGlvbnNcIiksXG4gICAgICAgIHN0R2V0PFNUU3RhdHVzPihiYXNlLCBrZXksIGAvcmVzdC9kYi9zdGF0dXM/Zm9sZGVyPSR7ZmlkfWApLFxuICAgICAgICBzdEdldDxSZWNvcmQ8c3RyaW5nLCB7IGxhc3RTZWVuOiBzdHJpbmcgfT4+KGJhc2UsIGtleSwgXCIvcmVzdC9zdGF0cy9kZXZpY2VcIikuY2F0Y2goKCkgPT4gKHt9IGFzIFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9PikpLFxuICAgICAgICBzdEdldDx7IG15SUQ6IHN0cmluZyB9PihiYXNlLCBrZXksIFwiL3Jlc3Qvc3lzdGVtL3N0YXR1c1wiKSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCByZW1vdGUgPSBkZXZpY2VzLmZpbHRlcihkID0+IGQuZGV2aWNlSUQgIT09IHN5cy5teUlEKTtcbiAgICAgIGNvbnN0IHJvd3MgPSBhd2FpdCBQcm9taXNlLmFsbChyZW1vdGUubWFwKGFzeW5jIGQgPT4ge1xuICAgICAgICBjb25zdCBjID0gYXdhaXQgc3RHZXQ8U1RDb21wbGV0aW9uPihiYXNlLCBrZXksIGAvcmVzdC9kYi9jb21wbGV0aW9uP2ZvbGRlcj0ke2ZpZH0mZGV2aWNlPSR7ZC5kZXZpY2VJRH1gKVxuICAgICAgICAgIC5jYXRjaCgoKSA9PiAoeyBjb21wbGV0aW9uOiAwLCBnbG9iYWxJdGVtczogMCwgbmVlZEl0ZW1zOiAwLCBuZWVkQnl0ZXM6IDAsIG5lZWREZWxldGVzOiAwIH0pKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBkLm5hbWUgfHwgZC5kZXZpY2VJRC5zbGljZSgwLCA3KSxcbiAgICAgICAgICBvbmxpbmU6ICEhY29ubnMuY29ubmVjdGlvbnNbZC5kZXZpY2VJRF0/LmNvbm5lY3RlZCxcbiAgICAgICAgICBjb21wbGV0aW9uOiBjLmNvbXBsZXRpb24sXG4gICAgICAgICAgZ2xvYmFsSXRlbXM6IGMuZ2xvYmFsSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkSXRlbXM6IGMubmVlZEl0ZW1zID8/IDAsXG4gICAgICAgICAgbmVlZEJ5dGVzOiBjLm5lZWRCeXRlcyxcbiAgICAgICAgICBuZWVkRGVsZXRlczogYy5uZWVkRGVsZXRlcyxcbiAgICAgICAgICBsYXN0U2Vlbjogc3RhdHNbZC5kZXZpY2VJRF0/Lmxhc3RTZWVuID8/IFwiXCIsXG4gICAgICAgIH07XG4gICAgICB9KSk7XG5cbiAgICAgIHRoaXMuc3luY0RhdGEgPSB7XG4gICAgICAgIHN0YXRlOiBzdGF0dXMuc3RhdGUsXG4gICAgICAgIG5lZWRGaWxlczogc3RhdHVzLm5lZWRGaWxlcyxcbiAgICAgICAgbmVlZEJ5dGVzOiBzdGF0dXMubmVlZEJ5dGVzLFxuICAgICAgICBmb2xkZXJMYWJlbDogZm9sZGVyLmxhYmVsIHx8IGZvbGRlci5pZCxcbiAgICAgICAgZXJyb3JzOiAoc3RhdHVzLmVycm9ycyA/PyAwKSArIChzdGF0dXMucHVsbEVycm9ycyA/PyAwKSxcbiAgICAgICAgZGV2aWNlczogcm93cyxcbiAgICAgIH07XG4gICAgICB0aGlzLnN5bmNGZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3luY0Vycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnN5bmNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luYyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19TWU5DKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1zeW5jLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlNJTkNST05JWkFcdTAwQzdcdTAwQzNPXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmIChrZXkpIHtcbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMuc3luY0xvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgZXN0YWRvIGRvIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNsaWNrYWJsZShyZWZyZXNoLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmZldGNoU3luYyh0cnVlKTsgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb25maWd1cmUgYSBVUkwgZSBhIEFQSSBrZXkgZG8gU3luY3RoaW5nIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQuXCIgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmNFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGZhbGFyIGNvbSBvIFN5bmN0aGluZzogJHt0aGlzLnN5bmNFcnJvcn1gIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3luY0ZldGNoZWRBdCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmNMb2FkaW5nKSB2b2lkIHRoaXMuZmV0Y2hTeW5jKGZhbHNlKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyU3luY0JvZHkoc2VjLCB0aGlzLnN5bmNEYXRhISk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDb25mbGljdHMoc2VjKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luY0JvZHkoc2VjOiBIVE1MRWxlbWVudCwgZDogU3luY0RhdGEpIHtcbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtYm94XCIgfSk7XG5cbiAgICAvLyBFc3RhZG8gZGEgcGFzdGEuXG4gICAgY29uc3QgYnVzeSA9IGQuc3RhdGUgPT09IFwic3luY2luZ1wiIHx8IGQuc3RhdGUgPT09IFwic2Nhbm5pbmdcIjtcbiAgICBjb25zdCBmbCA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1mb2xkZXJcIiB9KTtcbiAgICBjb25zdCBkb3QgPSBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGQuZXJyb3JzID8gXCJ3ZC1zLWVyclwiIDogYnVzeSA/IFwid2Qtcy1idXN5XCIgOiBcIndkLXMtb2tcIikgfSk7XG4gICAgZG90LnNldFRleHQoZC5lcnJvcnMgPyBcIlx1MjZBMFwiIDogYnVzeSA/IFwiXHUyN0YzXCIgOiBcIlx1MjVDRlwiKTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZm5hbWVcIiwgdGV4dDogZC5mb2xkZXJMYWJlbCB9KTtcbiAgICBjb25zdCBzdCA9IGQuc3RhdGUgPT09IFwiaWRsZVwiID8gXCJlbSBkaWFcIiA6IGQuc3RhdGUgPT09IFwic3luY2luZ1wiID8gYHNpbmNyb25pemFuZG8gXHUyMDE0ICR7ZC5uZWVkRmlsZXN9IGl0ZW5zICgke2h1bWFuQnl0ZXMoZC5uZWVkQnl0ZXMpfSlgIDogZC5zdGF0ZTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZnN0YXRlXCIsIHRleHQ6IHN0IH0pO1xuXG4gICAgLy8gQXBhcmVsaG9zLlxuICAgIGZvciAoY29uc3QgZGV2IG9mIGQuZGV2aWNlcykge1xuICAgICAgY29uc3Qgcm93ID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWRldlwiIH0pO1xuICAgICAgY29uc3QgbyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGRldi5vbmxpbmUgPyBcIndkLXMtb2tcIiA6IFwid2Qtcy1vZmZcIikgfSk7XG4gICAgICBvLnNldFRleHQoXCJcdTI1Q0ZcIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRuYW1lXCIsIHRleHQ6IGRldi5uYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY29tcFwiLCB0ZXh0OiBgJHtNYXRoLnJvdW5kKGRldi5jb21wbGV0aW9uKX0lYCB9KTtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzICYmIGRldi5nbG9iYWxJdGVtcylcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY291bnRcIiwgdGV4dDogYCR7ZGV2Lmdsb2JhbEl0ZW1zIC0gZGV2Lm5lZWRJdGVtc30vJHtkZXYuZ2xvYmFsSXRlbXN9YCB9KTtcbiAgICAgIGNvbnN0IGV4dHJhID0gZGV2Lm5lZWREZWxldGVzID8gYCR7ZGV2Lm5lZWREZWxldGVzfSBleGNsdXNcdTAwRjVlc2AgOiBkZXYubmVlZEJ5dGVzID8gaHVtYW5CeXRlcyhkZXYubmVlZEJ5dGVzKSA6IFwiXCI7XG4gICAgICBpZiAoZXh0cmEpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHBlbmRcIiwgdGV4dDogZXh0cmEgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRzZWVuXCIsIHRleHQ6IGRldi5vbmxpbmUgPyBcIm9ubGluZVwiIDogcmVsVGltZShkZXYubGFzdFNlZW4pIH0pO1xuICAgIH1cblxuICAgIGlmIChkLmVycm9ycykgYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWVycmxpbmVcIiwgdGV4dDogYFx1MjZBMCAke2QuZXJyb3JzfSBlcnJvKHMpIG5hIHBhc3RhYCB9KTtcbiAgfVxuXG4gIC8vIExpc3RhIGRlIGNcdTAwRjNwaWFzIGRlIGNvbmZsaXRvIGRvIFN5bmN0aGluZyAoYWJyaXIgLyBhcGFnYXIgY29tIGNvbmZpcm1hXHUwMEU3XHUwMEUzbykuXG4gIHByaXZhdGUgcmVuZGVyQ29uZmxpY3RzKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLmZpbHRlcihmID0+IGYubmFtZS5pbmNsdWRlcyhcIi5zeW5jLWNvbmZsaWN0LVwiKSk7XG4gICAgY29uc3Qgd3JhcCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jb25mbGljdHNcIiB9KTtcbiAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLXN1YlwiLCB0ZXh0OiBgQ29uZmxpdG9zICgke2NvbmZsaWN0cy5sZW5ndGh9KWAgfSk7XG4gICAgaWYgKCFjb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLW5vY29uZlwiLCB0ZXh0OiBcIk5lbmh1bSBjb25mbGl0by4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBjb25mbGljdHMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY3Jvd1wiIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25hbWVcIiwgdGV4dDogZi5uYW1lIH0pO1xuICAgICAgbmFtZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBcIiArIGYucGF0aCk7XG4gICAgICBjbGlja2FibGUobmFtZSwgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpKTtcbiAgICAgIGlmICh0aGlzLmNvbmZsaWN0Q29uZmlybSA9PT0gZi5wYXRoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY3llc1wiLCB0ZXh0OiBcImFwYWdhcj9cIiB9KTtcbiAgICAgICAgY2xpY2thYmxlKHllcywgYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmLCBmYWxzZSk7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfSk7XG4gICAgICAgIGNvbnN0IG5vID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jbm9cIiwgdGV4dDogXCJjYW5jZWxhclwiIH0pO1xuICAgICAgICBjbGlja2FibGUobm8sICgpID0+IHsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBudWxsOyB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpOyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY2RlbFwiIH0pO1xuICAgICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpO1xuICAgICAgICBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiQXBhZ2FyIGNcdTAwRjNwaWEgZGUgY29uZmxpdG8gKHZhaSBwYXJhIGEgbGl4ZWlyYSlcIik7XG4gICAgICAgIGNsaWNrYWJsZShkZWwsICgpID0+IHsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBmLnBhdGg7IHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWFkZXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJTZWNvbmQgQnJhaW5cIiB9KTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGx1Z2luIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZXJ1c0Rhc2hib2FyZCBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBEYXNoU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuICAvLyBDb250cm9sYWRvciBcdTAwRkFuaWNvIGRvIFRvZG9pc3QgKGVzdGFkbyBjb21wYXJ0aWxoYWRvIGVudHJlIGRhc2hib2FyZCBlIGFiYSkuXG4gIHRvZG8hOiBUb2RvaXN0Q29udHJvbGxlcjtcbiAgLy8gQ29udHJvbGFkb3IgXHUwMEZBbmljbyBkYSBHYW1pZmljYVx1MDBFN1x1MDBFM28gKGxvZyBkbyBjb2ZyZSArIHN0YXRzOyB2MC4xMykuXG4gIGdhbWUhOiBHYW1lQ29udHJvbGxlcjtcbiAgLy8gQ2FjaGUgZG8gY29mcmUgKFx1MDBBNzMpOiBtb250YWRvIDF4IHBvciBjaWNsbywgaW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdC5cbiAgcHJpdmF0ZSB2YXVsdENhY2hlOiBWYXVsdENhY2hlIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gQWdyZWdhZG9zIGRvIGNvZnJlICh1bWEgcGFzc2FkYSksIHJldXNhZG9zIHBvciB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIG5vIHJlbmRlci5cbiAgZ2V0VmF1bHRDYWNoZSgpOiBWYXVsdENhY2hlIHtcbiAgICBpZiAoIXRoaXMudmF1bHRDYWNoZSkgdGhpcy52YXVsdENhY2hlID0gYnVpbGRWYXVsdENhY2hlKHRoaXMuYXBwKTtcbiAgICByZXR1cm4gdGhpcy52YXVsdENhY2hlO1xuICB9XG4gIGludmFsaWRhdGVWYXVsdENhY2hlKCkgeyB0aGlzLnZhdWx0Q2FjaGUgPSBudWxsOyB9XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy50b2RvID0gbmV3IFRvZG9pc3RDb250cm9sbGVyKHRoaXMuYXBwLCB0aGlzLCB0aGlzKTtcbiAgICB0aGlzLmdhbWUgPSBuZXcgR2FtZUNvbnRyb2xsZXIodGhpcy5hcHAsIHRoaXMpO1xuICAgIC8vIEF1dG8tcmVmcmVzaCBkbyBUb2RvaXN0OiB2ZXJpZmljYSBhIGNhZGEgbWludXRvOyBzXHUwMEYzIGJ1c2NhIHNlIGhcdTAwRTEgdmlldyBhYmVydGEgZSBvXG4gICAgLy8gY2FjaGUgcGFzc291IGRvIFRUTCAoNSBtaW4pLiByZWdpc3RlckludGVydmFsIGxpbXBhIG8gdGltZXIgbm8gdW5sb2FkLlxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbCh3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy50b2RvLm1heWJlUmVmcmVzaCgpLCA2MF8wMDApKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEUsIGxlYWYgPT4gbmV3IERhc2hib2FyZFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFRPRE9JU1RfVklFV19UWVBFLCBsZWFmID0+IG5ldyBUb2RvaXN0VmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoR0FNRV9WSUVXX1RZUEUsIGxlYWYgPT4gbmV3IEdhbWlmaWNhdGlvblZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxheW91dC1kYXNoYm9hcmRcIiwgXCJBYnJpciBXZXJ1cyBEYXNoYm9hcmRcIiwgKCkgPT4gdGhpcy5vcGVuKCkpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxpc3QtY2hlY2tzXCIsIFwiQWJyaXIgVG9kb2lzdCAoV2VydXMpXCIsICgpID0+IHRoaXMub3BlblRvZG9pc3QoKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwidHJvcGh5XCIsIFwiQWJyaXIgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIChXZXJ1cylcIiwgKCkgPT4gdGhpcy5vcGVuR2FtZSgpKTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLWRhc2hib2FyZFwiLCBuYW1lOiBcIkFicmlyIERhc2hib2FyZFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuKCkgfSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi10b2RvaXN0XCIsIG5hbWU6IFwiQWJyaXIgVG9kb2lzdFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuVG9kb2lzdCgpIH0pO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tZ2FtZVwiLCBuYW1lOiBcIkFicmlyIEdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuR2FtZSgpIH0pO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgV2VydXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gICAgLy8gQ2FycmVnYSBvIGxvZyBkbyBjb2ZyZSBTXHUwMEQzIGRlcG9pcyBkbyB2YXVsdCBpbmRleGFyOiBubyBvbmxvYWQsIGdldEFic3RyYWN0RmlsZUJ5UGF0aFxuICAgIC8vIGRldm9sdmUgbnVsbCBwYXJhIHVtIGFycXVpdm8gcXVlIGV4aXN0ZSBcdTIxOTIgY2FjaGVhdmEgZXZlbnRzPVtdICh6ZXJhdmEgbm8gcmVsb2FkKS5cbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XG4gICAgICB0aGlzLmdhbWUuaW52YWxpZGF0ZSgpO1xuICAgICAgdm9pZCB0aGlzLmdhbWUuZW5zdXJlTG9hZGVkKCkudGhlbigoKSA9PiB0aGlzLmdhbWUucmVyZW5kZXJBbGwoKSk7XG4gICAgfSk7XG4gICAgLy8gUmUtcmVuZGVyaXphIHF1YW5kbyBvIGxvZyBtdWRhIChpbmNsdXNpdmUgbm9zc2FzIGdyYXZhXHUwMEU3XHUwMEY1ZXMpLlxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcIm1vZGlmeVwiLCBmID0+IHtcbiAgICAgIGlmIChmLnBhdGggPT09IEdBTUVfTE9HX1BBVEgpIHsgdGhpcy5nYW1lLmludmFsaWRhdGUoKTsgdm9pZCB0aGlzLmdhbWUuZW5zdXJlTG9hZGVkKCkudGhlbigoKSA9PiB0aGlzLmdhbWUucmVyZW5kZXJBbGwoKSk7IH1cbiAgICB9KSk7XG4gIH1cblxuICAvLyBUb2RhcyBhcyB2aWV3cyAoZGFzaGJvYXJkICsgYWJhIFRvZG9pc3QpIGFiZXJ0YXMsIHF1ZSB0XHUwMEVBbSBjb250cm9sYWRvciBUb2RvaXN0LlxuICBwcml2YXRlIHRvZG9WaWV3cygpOiAoRGFzaGJvYXJkVmlldyB8IFRvZG9pc3RWaWV3KVtdIHtcbiAgICBjb25zdCBvdXQ6IChEYXNoYm9hcmRWaWV3IHwgVG9kb2lzdFZpZXcpW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgW1ZJRVdfVFlQRSwgVE9ET0lTVF9WSUVXX1RZUEVdKVxuICAgICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUodCkpIHtcbiAgICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEYXNoYm9hcmRWaWV3IHx8IHYgaW5zdGFuY2VvZiBUb2RvaXN0Vmlldykgb3V0LnB1c2godik7XG4gICAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8vIFJlLWJ1c2NhIG8gVG9kb2lzdCAoY29udHJvbGxlciBcdTAwRkFuaWNvIFx1MjE5MiBub3RpZmljYSB0b2RhcyBhcyB2aWV3cyBpbnNjcml0YXMpLlxuICByZWZyZXNoRGFzaGJvYXJkcygpIHtcbiAgICB0aGlzLnRvZG8ucmVzZXQoKTtcbiAgfVxuXG4gIC8vIFJlc2V0YSBvIGVzdGFkbyBkbyBTeW5jdGhpbmcgbmFzIGRhc2hib2FyZHMgKGV4LjogdG9rZW4vVVJMIGFsdGVyYWRvcykuXG4gIHJlZnJlc2hTeW5jKCkge1xuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSkpIHtcbiAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcpIHYucmVzZXRTeW5jKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmUtcmVuZGVyaXphIHRvZGFzIGFzIHZpZXdzIGFiZXJ0YXMgKGFwXHUwMEYzcyBtdWRhciBjb25maWcgbmEgYWJhIGRlXG4gIC8vIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzOiBvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMsIHBhY290ZXMpLlxuICByZXJlbmRlckRhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCB2IG9mIHRoaXMudG9kb1ZpZXdzKCkpIHYucmVmcmVzaCgpO1xuICB9XG5cbiAgLy8gTW9zdHJhL29jdWx0YSB1bWEgc2VcdTAwRTdcdTAwRTNvIChcInNlYzo8aWQ+XCIpIG91IHBhc3RhIChjYW1pbmhvKSBwb3IgY2hhdmUgZW0gYGhpZGRlbmAuXG4gIGFzeW5jIHNldEhpZGRlbihrZXk6IHN0cmluZywgaGlkZGVuOiBib29sZWFuKSB7XG4gICAgY29uc3QgaGFzID0gdGhpcy5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgICBpZiAoaGlkZGVuICYmICFoYXMpIHRoaXMuc2V0dGluZ3MuaGlkZGVuLnB1c2goa2V5KTtcbiAgICBlbHNlIGlmICghaGlkZGVuICYmIGhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5maWx0ZXIoayA9PiBrICE9PSBrZXkpO1xuICAgIGVsc2UgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIC8vIFJlb3JkZW5hIHVtYSBzZVx1MDBFN1x1MDBFM28gZW0gc2VjdGlvbk9yZGVyIChkaXIgPSAtMSBzb2JlLCArMSBkZXNjZSkuXG4gIGFzeW5jIG1vdmVTZWN0aW9uKGlkOiBTZWN0aW9uSWQsIGRpcjogbnVtYmVyKSB7XG4gICAgY29uc3Qgb3JkZXIgPSBbLi4udGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXJdO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaiA+PSBvcmRlci5sZW5ndGgpIHJldHVybjtcbiAgICBbb3JkZXJbaV0sIG9yZGVyW2pdXSA9IFtvcmRlcltqXSwgb3JkZXJbaV1dO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gb3JkZXI7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgYXN5bmMgbW92ZVBhY2thZ2UoaW5kZXg6IG51bWJlciwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBjb25zdCBqID0gaW5kZXggKyBkaXI7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBqIDwgMCB8fCBqID49IGFyci5sZW5ndGgpIHJldHVybjtcbiAgICBbYXJyW2luZGV4XSwgYXJyW2pdXSA9IFthcnJbal0sIGFycltpbmRleF1dO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgICBsZXQgbmVlZFN0TWlncmF0aW9uID0gZmFsc2U7ICAgLy8gY3JlZGVuY2lhaXMgU3luY3RoaW5nIG1pZ3JhbmRvIGRhdGEuanNvbiBcdTIxOTIgbG9jYWxTdG9yYWdlXG4gICAgLy8gU2FuZWFtZW50bzogc2VjdGlvbk9yZGVyIGNvbSBleGF0YW1lbnRlIGFzIHNlXHUwMEU3XHUwMEY1ZXMgdlx1MDBFMWxpZGFzLCBzZW0gZHVwbGljYXRhcy5cbiAgICBjb25zdCB2YWxpZDogU2VjdGlvbklkW10gPSBbXCJzdGF0c1wiLCBcImdhbWVcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl07XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8U2VjdGlvbklkPigpO1xuICAgIGNvbnN0IGNsZWFuZWQgPSAodGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgfHwgW10pLmZpbHRlcihcbiAgICAgIChzKTogcyBpcyBTZWN0aW9uSWQgPT4gdmFsaWQuaW5jbHVkZXMocyBhcyBTZWN0aW9uSWQpICYmICFzZWVuLmhhcyhzIGFzIFNlY3Rpb25JZCkgJiYgKHNlZW4uYWRkKHMgYXMgU2VjdGlvbklkKSwgdHJ1ZSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWxpZCkgaWYgKCFzZWVuLmhhcyh2KSkgY2xlYW5lZC5wdXNoKHYpO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gY2xlYW5lZDsgICAvLyBcInJlcG9ydHNcIiBzb21lIGFxdWkgc2UgZXN0YXZhIG51bWEgY29uZmlnIGFudGlnYVxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNldHRpbmdzLmhpZGRlbikpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gW107XG4gICAgLy8gRm9udGVzIGRhIFNlbWFuYSAodjAuMTAuMSk6IHZhbGlkYSBhIGxpc3RhOyBzZSBhdXNlbnRlL2ludlx1MDBFMWxpZGEsIHVzYSBvIGRlZmF1bHQuXG4gICAgY29uc3QgY3MgPSB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IEFycmF5LmlzQXJyYXkoY3MpICYmIGNzLmxlbmd0aFxuICAgICAgPyBjcy5maWx0ZXIocyA9PiBzICYmIHR5cGVvZiBzLnBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgLm1hcChzID0+ICh7IHBhdGg6IHMucGF0aCwgY29sb3I6IHR5cGVvZiBzLmNvbG9yID09PSBcInN0cmluZ1wiID8gcy5jb2xvciA6IEFDQ0VOVFNbMF0sIG9uOiBzLm9uICE9PSBmYWxzZSB9KSlcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5jYWxlbmRhclNvdXJjZXMubWFwKHMgPT4gKHsgLi4ucyB9KSk7XG4gICAgLy8gU2FuZWFtZW50byBUb2RvaXN0ICh2MC43LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPT09IDMgPyAzIDogNztcbiAgICBjb25zdCB0ZiA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycyA9IHtcbiAgICAgIHByb2plY3RzOiBBcnJheS5pc0FycmF5KHRmPy5wcm9qZWN0cykgPyB0Zi5wcm9qZWN0cyA6IFtdLFxuICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHRmPy5sYWJlbHMpID8gdGYubGFiZWxzIDogW10sXG4gICAgfTtcbiAgICAvLyBFeGliaVx1MDBFN1x1MDBFM28gbmFzIGxpbmhhcyAodjAuOC4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ICE9PSBmYWxzZTtcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9PT0gdHJ1ZTtcbiAgICAvLyBTeW5jdGhpbmcgKHYwLjEwLjApIFx1MjAxNCBjcmVkZW5jaWFpcyBzXHUwMEUzbyBQT1ItRElTUE9TSVRJVk86IHZpdmVtIG5vIGxvY2FsU3RvcmFnZVxuICAgIC8vIChuXHUwMEUzbyBzaW5jcm9uaXphbSBwZWxvIGRhdGEuanNvbikuIE1pZ3JhXHUwMEU3XHUwMEUzbyAoMXgpOiBzZSBvIGxvY2FsU3RvcmFnZSBhaW5kYSBuXHUwMEUzb1xuICAgIC8vIHRlbSwgaGVyZGEgbyB2YWxvciBxdWUgZXN0YXZhIG5vIGRhdGEuanNvbiBlIHJlZ3JhdmEgKHZlciBmaW0gZG8gbVx1MDBFOXRvZG8pLlxuICAgIGNvbnN0IGxzR2V0ID0gKGs6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgY29uc3QgdiA9IHRoaXMuYXBwLmxvYWRMb2NhbFN0b3JhZ2Uoayk7XG4gICAgICByZXR1cm4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgPyB2IDogbnVsbDtcbiAgICB9O1xuICAgIGNvbnN0IGRhdGFVcmwgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwudHJpbSgpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsIDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIjtcbiAgICBjb25zdCBkYXRhS2V5ID0gdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID09PSBcInN0cmluZ1wiID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgOiBcIlwiO1xuICAgIGNvbnN0IGRhdGFGb2xkZXIgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgOiBcIlwiO1xuICAgIG5lZWRTdE1pZ3JhdGlvbiA9IGxzR2V0KExTX1NUX1VSTCkgPT09IG51bGwgJiYgbHNHZXQoTFNfU1RfS0VZKSA9PT0gbnVsbCAmJiBsc0dldChMU19TVF9GT0xERVIpID09PSBudWxsO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsID0gbHNHZXQoTFNfU1RfVVJMKSA/PyBkYXRhVXJsO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gbHNHZXQoTFNfU1RfS0VZKSA/PyBkYXRhS2V5O1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSBsc0dldChMU19TVF9GT0xERVIpID8/IGRhdGFGb2xkZXI7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID0gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID09PSB0cnVlO1xuICAgIC8vIFBhY290ZXMgZGUgdGFyZWZhcyAodjAuMTIuMCkuXG4gICAgY29uc3QgdHAgPSB0aGlzLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICB0aGlzLnNldHRpbmdzLnRhc2tQYWNrYWdlcyA9IEFycmF5LmlzQXJyYXkodHApXG4gICAgICA/IHRwLmZpbHRlcihwID0+IHAgJiYgdHlwZW9mIHAuaWQgPT09IFwic3RyaW5nXCIpLm1hcChwID0+ICh7XG4gICAgICAgICAgaWQ6IHAuaWQsXG4gICAgICAgICAgbmFtZTogdHlwZW9mIHAubmFtZSA9PT0gXCJzdHJpbmdcIiA/IHAubmFtZSA6IFwiXCIsXG4gICAgICAgICAgaWNvbjogdHlwZW9mIHAuaWNvbiA9PT0gXCJzdHJpbmdcIiAmJiBwLmljb24udHJpbSgpID8gcC5pY29uIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHRhc2tzOiBBcnJheS5pc0FycmF5KHAudGFza3MpID8gcC50YXNrcy5maWx0ZXIoeCA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIikgOiBbXSxcbiAgICAgICAgICBwcm9qZWN0SWQ6IHR5cGVvZiBwLnByb2plY3RJZCA9PT0gXCJzdHJpbmdcIiAmJiBwLnByb2plY3RJZCA/IHAucHJvamVjdElkIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGxhYmVsczogQXJyYXkuaXNBcnJheShwLmxhYmVscykgPyBwLmxhYmVscy5maWx0ZXIoeCA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIikgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pKVxuICAgICAgOiBbXTtcbiAgICB0aGlzLnNldHRpbmdzLnBhY2thZ2VDb25maXJtID0gW1wiYWx3YXlzXCIsIFwibWFueVwiLCBcIm5ldmVyXCJdLmluY2x1ZGVzKHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0pXG4gICAgICA/IHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gOiBcIm1hbnlcIjtcbiAgICAvLyBHYW1pZmljYVx1MDBFN1x1MDBFM28gKHYwLjEzKS5cbiAgICB0aGlzLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQgPSB0aGlzLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQgIT09IGZhbHNlO1xuICAgIGNvbnN0IHBmID0gTnVtYmVyKHRoaXMuc2V0dGluZ3MuZ2FtZVBlbmFsdHlGYWN0b3IpO1xuICAgIHRoaXMuc2V0dGluZ3MuZ2FtZVBlbmFsdHlGYWN0b3IgPSBOdW1iZXIuaXNGaW5pdGUocGYpICYmIHBmID4gMCA/IHBmIDogMS41O1xuICAgIHRoaXMuc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0ID0gdHlwZW9mIHRoaXMuc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0ID09PSBcInN0cmluZ1wiID8gdGhpcy5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgOiBcIlwiO1xuICAgIHRoaXMuc2V0dGluZ3MuZ2FtZUNoYXJ0TW9kZSA9IHRoaXMuc2V0dGluZ3MuZ2FtZUNoYXJ0TW9kZSA9PT0gXCJsaW5lXCIgPyBcImxpbmVcIiA6IFwiYmFyc1wiO1xuICAgIHRoaXMuc2V0dGluZ3MuZ3Jvd3RoQ2hhcnRNb2RlID0gdGhpcy5zZXR0aW5ncy5ncm93dGhDaGFydE1vZGUgPT09IFwibGluZVwiID8gXCJsaW5lXCIgOiBcImJhcnNcIjtcblxuICAgIC8vIE1pZ3JhXHUwMEU3XHUwMEUzbyAxeDogZ3JhdmEgYXMgY3JlZGVuY2lhaXMgbm8gbG9jYWxTdG9yYWdlIGUgYXMgcmVtb3ZlIGRvIGRhdGEuanNvbi5cbiAgICBpZiAobmVlZFN0TWlncmF0aW9uKSBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIC8vIENyZWRlbmNpYWlzIGRvIFN5bmN0aGluZyBzXHUwMEUzbyBwb3ItZGlzcG9zaXRpdm8gXHUyMTkyIGxvY2FsU3RvcmFnZSAoblx1MDBFM28gc2luY3Jvbml6YSkuXG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9VUkwsIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsKTtcbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX0tFWSwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpO1xuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfRk9MREVSLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKTtcbiAgICAvLyBPIGRhdGEuanNvbiAoc2luY3Jvbml6YWRvIHBlbG8gU3luY3RoaW5nKSBOXHUwMEMzTyBsZXZhIGFzIGNyZWRlbmNpYWlzLlxuICAgIGNvbnN0IHNoYXJlZDogUGFydGlhbDxEYXNoU2V0dGluZ3M+ID0geyAuLi50aGlzLnNldHRpbmdzIH07XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdVcmw7XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdBcGlLZXk7XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdGb2xkZXJJZDtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHNoYXJlZCk7XG4gIH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgb3BlblRvZG9pc3QoKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShUT0RPSVNUX1ZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVE9ET0lTVF9WSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgb3BlbkdhbWUoKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShHQU1FX1ZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogR0FNRV9WSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgLy8gVmFycmUgZWxlbWVudG9zIGZsdXR1YW50ZXMgcXVlIHZpdmVtIG5vIGRvY3VtZW50LmJvZHkgKHRvb2x0aXBzL3BvcG92ZXJzKTogc2Ugb1xuICAgIC8vIHBsdWdpbiBmb3IgZGVzYWJpbGl0YWRvIGNvbSB1bSBhYmVydG8sIG8gb25DbG9zZSBkYSB2aWV3IHBvZGUgblx1MDBFM28gcm9kYXIuXG4gICAgdGhpcy50b2RvPy5oaWRlVGlwKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZC10b29sdGlwLCAud2QtcG9wXCIpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlZGljYWRhIGRvIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBIdWIgZG8gVG9kb2lzdCBuYSBcdTAwRTFyZWEgY2VudHJhbCAoblx1MDBFM28gXHUwMEU5IHNpZGViYXIpOiBsYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgKyBhIG1lc21hXG4vLyBsaXN0YSBkZSB0YXJlZmFzIGRvIGRhc2hib2FyZCAodmlhIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pLlxuY2xhc3MgVG9kb2lzdFZpZXcgZXh0ZW5kcyBXZFZpZXcge1xuICBwcml2YXRlIHVuc3ViVG9kbzogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFRPRE9JU1RfVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJUb2RvaXN0XCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxpc3QtY2hlY2tzXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSB0aGlzLnBsdWdpbi50b2RvLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlZnJlc2goKSk7XG4gICAgdGhpcy5pbml0UGhvbmVXYXRjaCgpO1xuICB9XG4gIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy51bnN1YlRvZG8/LigpO1xuICAgIHRoaXMudW5zdWJUb2RvID0gbnVsbDtcbiAgICB0aGlzLnBsdWdpbi50b2RvLmhpZGVUaXAoKTtcbiAgfVxuICBwcm90ZWN0ZWQgcmVyZW5kZXIoKSB7IHRoaXMucmVmcmVzaCgpOyB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHJvb3QuYWRkQ2xhc3MoXCJ3ZC1yb290XCIsIFwid2QtdG9kb2lzdC12aWV3XCIpO1xuICAgIHRoaXMucGhvbmUgPSBpc1Bob25lV2lkdGgodGhpcy5jb250ZW50RWwpO1xuICAgIHJvb3QudG9nZ2xlQ2xhc3MoXCJ3ZC1waG9uZVwiLCB0aGlzLnBob25lKTtcblxuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIlRvZG9pc3RcIiB9KTtcblxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyUGFja2FnZXMocm9vdCwgeyBoZWFkaW5nOiB0cnVlIH0pO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyTGlzdChzZWMsIGN0cmxzKTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlZGljYWRhIGRlIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNsYXNzIEdhbWlmaWNhdGlvblZpZXcgZXh0ZW5kcyBXZFZpZXcge1xuICBwcml2YXRlIHVuc3ViOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gR0FNRV9WSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJ0cm9waHlcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLnVuc3ViID0gdGhpcy5wbHVnaW4uZ2FtZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZWZyZXNoKCkpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLmdhbWUuZW5zdXJlTG9hZGVkKCk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdm9pZCB0aGlzLnBsdWdpbi5nYW1lLnJlZnJlc2hQZW5kaW5nKCk7XG4gICAgdGhpcy5pbml0UGhvbmVXYXRjaCgpO1xuICB9XG4gIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy51bnN1Yj8uKCk7XG4gICAgdGhpcy51bnN1YiA9IG51bGw7XG4gIH1cbiAgcHJvdGVjdGVkIHJlcmVuZGVyKCkgeyB0aGlzLnJlZnJlc2goKTsgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiLCBcIndkLWdhbWUtdmlld1wiKTtcbiAgICB0aGlzLnBob25lID0gaXNQaG9uZVdpZHRoKHRoaXMuY29udGVudEVsKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtcGhvbmVcIiwgdGhpcy5waG9uZSk7XG5cbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJHYW1pZmljYVx1MDBFN1x1MDBFM29cIiB9KTtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtZ2FtZS1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJQUk9HUkVTU09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMucGx1Z2luLmdhbWUucmVuZGVyUGFuZWwoc2VjLCBjdHJscywgeyBmdWxsOiB0cnVlLCBwaG9uZTogdGhpcy5waG9uZSB9KTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgTW9kYWwgZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvIGdlblx1MDBFOXJpY28gKHJlc29sdmUgdHJ1ZS9mYWxzZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBDb25maXJtSXRlbSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbGFiZWxzPzogeyBuYW1lOiBzdHJpbmc7IGNvbG9yOiBzdHJpbmcgfVtdOyAgIC8vIGNoaXBzIG9wY2lvbmFpcyAoZXRpcXVldGFzKVxufVxuXG5pbnRlcmZhY2UgQ29uZmlybU9wdHMge1xuICB0aXRsZTogc3RyaW5nO1xuICBib2R5OiBzdHJpbmc7XG4gIGl0ZW1zPzogQ29uZmlybUl0ZW1bXTsgICAvLyBsaXN0YSBvcGNpb25hbCAoZXguOiB0YXJlZmFzIGEgY3JpYXIpXG4gIGN0YTogc3RyaW5nOyAgICAgICAgICAgICAvLyByXHUwMEYzdHVsbyBkbyBib3RcdTAwRTNvIGRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xufVxuXG5jbGFzcyBDb25maXJtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgZG9uZSA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBvcHRzOiBDb25maXJtT3B0cywgcHJpdmF0ZSByZXNvbHZlOiAob2s6IGJvb2xlYW4pID0+IHZvaWQpIHtcbiAgICBzdXBlcihhcHApO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcyhcIndkLWNvbmZpcm1cIik7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiB0aGlzLm9wdHMudGl0bGUgfSk7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwicFwiLCB7IHRleHQ6IHRoaXMub3B0cy5ib2R5IH0pO1xuICAgIGlmICh0aGlzLm9wdHMuaXRlbXM/Lmxlbmd0aCkge1xuICAgICAgY29uc3QgdWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ1bFwiLCB7IGNsczogXCJ3ZC1jb25maXJtLWxpc3RcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5vcHRzLml0ZW1zKSB7XG4gICAgICAgIGNvbnN0IGxpID0gdWwuY3JlYXRlRWwoXCJsaVwiKTtcbiAgICAgICAgbGkuY3JlYXRlU3Bhbih7IHRleHQ6IGl0LnRleHQgfSk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiBpdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgICAgICBjb25zdCBjaGlwID0gbGkuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb25maXJtLWxhYmVsXCIgfSk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBsLmNvbG9yO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsLm5hbWV9YCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhY3Rpb25zID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1hY3Rpb25zXCIgfSk7XG4gICAgYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KS5vbmNsaWNrID0gKCkgPT4gdGhpcy5jbG9zZSgpO1xuICAgIGNvbnN0IG9rID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJtb2QtY3RhXCIsIHRleHQ6IHRoaXMub3B0cy5jdGEgfSk7XG4gICAgb2sub25jbGljayA9ICgpID0+IHsgdGhpcy5kb25lID0gdHJ1ZTsgdGhpcy5jbG9zZSgpOyB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIHRoaXMucmVzb2x2ZSh0aGlzLmRvbmUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpcm1Nb2RhbChhcHA6IEFwcCwgb3B0czogQ29uZmlybU9wdHMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gbmV3IENvbmZpcm1Nb2RhbChhcHAsIG9wdHMsIHJlc29sdmUpLm9wZW4oKSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQb3AtdXAgZGUgZGV0YWxoZXMgZGEgdGFyZWZhIChzXHUwMEYzIGxlaXR1cmE7IGJvdFx1MDBFM28gRWRpdGFyIGFicmUgbyBmb3JtdWxcdTAwRTFyaW8pIFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0RldGFpbE9wdHMge1xuICB0YXNrOiBUb2RvaXN0VGFzaztcbiAgcHJvamVjdE5hbWU/OiBzdHJpbmc7XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgZWRpdDogKCkgPT4gdm9pZDtcbiAgY29tcGxldGU6ICgpID0+IHZvaWQ7XG59XG5cbmNsYXNzIFRhc2tEZXRhaWxNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsIHByaXZhdGUgb3B0czogVGFza0RldGFpbE9wdHMpIHsgc3VwZXIoYXBwKTsgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCwgdGl0bGVFbCwgbW9kYWxFbCB9ID0gdGhpcztcbiAgICBjb25zdCB0ID0gdGhpcy5vcHRzLnRhc2s7XG4gICAgbW9kYWxFbC5hZGRDbGFzcyhcIndkLXRhc2stbW9kYWxcIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHQuY29udGVudCk7XG5cbiAgICBjb25zdCBtZXRhID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10ZC1tZXRhXCIgfSk7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtcHJpXCIsIHRleHQ6IHByaS5sYWJlbCB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChkaykge1xuICAgICAgY29uc3QgW3ksIG0sIGRdID0gZGsuc3BsaXQoXCItXCIpO1xuICAgICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYFx1RDgzRFx1RENDNSAke2R9LyR7bX0vJHt5fSR7dC5kdWU/LmlzX3JlY3VycmluZyA/IFwiIFx1MjdGM1wiIDogXCJcIn1gIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRzLnByb2plY3ROYW1lKSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcFwiLCB0ZXh0OiBgIyAke3RoaXMub3B0cy5wcm9qZWN0TmFtZX1gIH0pO1xuICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkge1xuICAgICAgY29uc3QgY2hpcCA9IG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwIHdkLXRkLWxhYmVsXCIgfSk7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2x9YCB9KTtcbiAgICB9XG5cbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgYm9keSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay1tb2RhbC1kZXNjIG1hcmtkb3duLXJlbmRlcmVkXCIgfSk7XG4gICAgICB2b2lkIE1hcmtkb3duUmVuZGVyZXIucmVuZGVyKHRoaXMuYXBwLCB0LmRlc2NyaXB0aW9uIS50cmltKCksIGJvZHksIFwiXCIsIHRoaXMuY29tcG9uZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwicFwiLCB7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWVtcHR5XCIsIHRleHQ6IFwiRXN0YSB0YXJlZmEgblx1MDBFM28gdGVtIGRlc2NyaVx1MDBFN1x1MDBFM28uXCIgfSk7XG4gICAgfVxuXG4gICAgLy8gRWRpdGFyIChlc3F1ZXJkYSkgXHUwMEI3IENvbmNsdWlyICsgQWJyaXIgbm8gVG9kb2lzdCAoZGlyZWl0YSkuXG4gICAgY29uc3QgYWN0aW9ucyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay1tb2RhbC1hY3Rpb25zXCIgfSk7XG4gICAgY29uc3QgZWRpdCA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcwRSBFZGl0YXJcIiB9KTtcbiAgICBlZGl0Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY2xvc2UoKTsgdGhpcy5vcHRzLmVkaXQoKTsgfTtcbiAgICBhY3Rpb25zLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICBjb25zdCBkb25lID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzEzIENvbmNsdWlyXCIgfSk7XG4gICAgZG9uZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm9wdHMuY29tcGxldGUoKTsgdGhpcy5jbG9zZSgpOyB9O1xuICAgIGNvbnN0IG9wZW4gPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJBYnJpciBubyBUb2RvaXN0XCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgb3Blbi5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0KSwgXCJfYmxhbmtcIik7XG4gIH1cblxuICBvbkNsb3NlKCkgeyB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpOyB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBGb3JtdWxcdTAwRTFyaW8gZGUgdGFyZWZhIChjcmlhciAvIGVkaXRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBUYXNrRm9ybVZhbHVlcyB7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEkgMS4uNCAoNCA9IHAxKVxuICBkdWVEYXRlOiBzdHJpbmc7ICAgIC8vIFlZWVktTU0tREQgKGNhbGVuZFx1MDBFMXJpbyk7IFwiXCIgPSBzZW0gZGF0YVxuICBwcm9qZWN0SWQ6IHN0cmluZztcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbn1cblxuaW50ZXJmYWNlIFRhc2tGb3JtT3B0cyB7XG4gIG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjtcbiAgdGFzaz86IFRvZG9pc3RUYXNrO1xuICBwcmVmaWxsRHVlPzogc3RyaW5nO1xuICBwcm9qZWN0czogVG9kb2lzdFByb2plY3RbXTtcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBzdWJtaXQ6ICh2OiBUYXNrRm9ybVZhbHVlcykgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgcmVtb3ZlPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgY29tcGxldGU/OiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRm9ybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIHY6IFRhc2tGb3JtVmFsdWVzO1xuICBwcml2YXRlIGtub3duTGFiZWxzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBjb25maXJtRGVsID0gZmFsc2U7XG4gIHByaXZhdGUgYWN0aW9uc0VsITogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgb3B0czogVGFza0Zvcm1PcHRzKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICBjb25zdCB0ID0gb3B0cy50YXNrO1xuICAgIC8vIFByZWZpbGwgZGUgY3JpYVx1MDBFN1x1MDBFM286IFwiaG9qZVwiIFx1MjE5MiBkYXRhIGRlIGhvamU7IGpcdTAwRTEtWVlZWS1NTS1ERCBwYXNzYSBkaXJldG87IHJlc3RvIGlnbm9yYS5cbiAgICBjb25zdCBwcmUgPSBvcHRzLnByZWZpbGxEdWU7XG4gICAgY29uc3QgcHJlZmlsbERhdGUgPSBwcmUgPT09IFwiaG9qZVwiID8gdG9LZXkobmV3IERhdGUoKSlcbiAgICAgIDogKHByZSAmJiAvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChwcmUpID8gcHJlIDogXCJcIik7XG4gICAgdGhpcy52ID0ge1xuICAgICAgY29udGVudDogdD8uY29udGVudCA/PyBcIlwiLFxuICAgICAgZGVzY3JpcHRpb246IHQ/LmRlc2NyaXB0aW9uID8/IFwiXCIsXG4gICAgICBwcmlvcml0eTogdD8ucHJpb3JpdHkgPz8gMSxcbiAgICAgIGR1ZURhdGU6IHQ/LmR1ZT8uZGF0ZSA/IHQuZHVlLmRhdGUuc3Vic3RyaW5nKDAsIDEwKSA6IHByZWZpbGxEYXRlLFxuICAgICAgcHJvamVjdElkOiB0Py5wcm9qZWN0X2lkID8/IFwiXCIsXG4gICAgICBsYWJlbHM6ICh0Py5sYWJlbHMgPz8gW10pLnNsaWNlKCksXG4gICAgfTtcbiAgICB0aGlzLmtub3duTGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLm9wdHMubGFiZWxzLCAuLi50aGlzLnYubGFiZWxzXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgbW9kYWxFbC5hZGRDbGFzcyhcIndkLXRhc2stZm9ybVwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodGhpcy5vcHRzLm1vZGUgPT09IFwiY3JlYXRlXCIgPyBcIk5vdmEgdGFyZWZhXCIgOiBcIkVkaXRhciB0YXJlZmFcIik7XG5cbiAgICAvLyBTXHUwMEYzIG5hIGVkaVx1MDBFN1x1MDBFM286IGF0YWxobyBcIkFicmlyIG5vIFRvZG9pc3RcIiBubyB0b3BvLCBhbyBsYWRvIGRvIFggZGUgZmVjaGFyLlxuICAgIGlmICh0aGlzLm9wdHMubW9kZSA9PT0gXCJlZGl0XCIgJiYgdGhpcy5vcHRzLnRhc2spIHtcbiAgICAgIGNvbnN0IG9wZW4gPSBtb2RhbEVsLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXRmLW9wZW4tdG9wXCIsIHRleHQ6IFwiXHUyMTk3IFRvZG9pc3RcIiB9KTtcbiAgICAgIG9wZW4uc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgbm8gVG9kb2lzdFwiKTtcbiAgICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodGhpcy5vcHRzLnRhc2shKSwgXCJfYmxhbmtcIik7XG4gICAgfVxuXG4gICAgdGhpcy5maWVsZChcIlRcdTAwRUR0dWxvXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC10Zi1pbnB1dFwiLCB0eXBlOiBcInRleHRcIiB9KTtcbiAgICBjb250ZW50LnZhbHVlID0gdGhpcy52LmNvbnRlbnQ7XG4gICAgY29udGVudC5wbGFjZWhvbGRlciA9IFwiTyBxdWUgcHJlY2lzYSBzZXIgZmVpdG8/XCI7XG4gICAgY29udGVudC5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuY29udGVudCA9IGNvbnRlbnQudmFsdWU7IH07XG4gICAgc2V0VGltZW91dCgoKSA9PiBjb250ZW50LmZvY3VzKCksIDApO1xuXG4gICAgdGhpcy5maWVsZChcIkRlc2NyaVx1MDBFN1x1MDBFM29cIik7XG4gICAgY29uc3QgZGVzYyA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInRleHRhcmVhXCIsIHsgY2xzOiBcIndkLXRmLXRleHRhcmVhXCIgfSk7XG4gICAgZGVzYy52YWx1ZSA9IHRoaXMudi5kZXNjcmlwdGlvbjtcbiAgICBkZXNjLnBsYWNlaG9sZGVyID0gXCJEZXRhbGhlcyAvIGluc3RydVx1MDBFN1x1MDBGNWVzIChtYXJrZG93bilcIjtcbiAgICBkZXNjLnJvd3MgPSAzO1xuICAgIGRlc2Mub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmRlc2NyaXB0aW9uID0gZGVzYy52YWx1ZTsgfTtcblxuICAgIHRoaXMuZmllbGQoXCJQcmlvcmlkYWRlXCIpO1xuICAgIGNvbnN0IHByb3cgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXByaS1yb3dcIiB9KTtcbiAgICBjb25zdCByZW5kZXJQcmkgPSAoKSA9PiB7XG4gICAgICBwcm93LmVtcHR5KCk7XG4gICAgICBmb3IgKGNvbnN0IGFwaSBvZiBbNCwgMywgMiwgMV0pIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IFRPRE9JU1RfUFJJW2FwaV07XG4gICAgICAgIGNvbnN0IGIgPSBwcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtcHJpXCIgKyAodGhpcy52LnByaW9yaXR5ID09PSBhcGkgPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgICAgIGIuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBtZXRhLmNvbG9yKTtcbiAgICAgICAgYi5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyh0aGlzLnYucHJpb3JpdHkgPT09IGFwaSkpO1xuICAgICAgICBjbGlja2FibGUoYiwgKCkgPT4geyB0aGlzLnYucHJpb3JpdHkgPSBhcGk7IHJlbmRlclByaSgpOyB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlclByaSgpO1xuXG4gICAgdGhpcy5maWVsZChcIkRhdGFcIik7XG4gICAgY29uc3QgZHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtZHVlLXJvd1wiIH0pO1xuICAgIGNvbnN0IGR1ZSA9IGRyb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC10Zi1pbnB1dCB3ZC10Zi1kYXRlXCIsIHR5cGU6IFwiZGF0ZVwiIH0pO1xuICAgIGR1ZS52YWx1ZSA9IHRoaXMudi5kdWVEYXRlO1xuICAgIGR1ZS5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBkdWUudmFsdWU7IH07XG4gICAgY29uc3QgY2xyID0gZHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1kdWUtY2xlYXJcIiwgdGV4dDogXCJzZW0gZGF0YVwiIH0pO1xuICAgIGNsci5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IFwiXCI7IGR1ZS52YWx1ZSA9IFwiXCI7IH07XG4gICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ2xpcXVlIHBhcmEgYWJyaXIgbyBjYWxlbmRcdTAwRTFyaW8uIFZhemlvID0gc2VtIGRhdGEuXCIgfSk7XG4gICAgaWYgKHRoaXMub3B0cy50YXNrPy5kdWU/LmlzX3JlY3VycmluZylcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtd2FyblwiLCB0ZXh0OiBcIlx1MjdGMyBUYXJlZmEgcmVjb3JyZW50ZSBcdTIwMTQgbXVkYXIgYSBkYXRhIGZpeGEgcG9kZSBlbmNlcnJhciBhIHJlY29yclx1MDBFQW5jaWEuXCIgfSk7XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJvamV0b1wiKTtcbiAgICBjb25zdCBzZWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtdGYtc2VsZWN0XCIgfSk7XG4gICAgY29uc3QgaW5ib3ggPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBcIkVudHJhZGEgKEluYm94KVwiLCB2YWx1ZTogXCJcIiB9KTtcbiAgICBpZiAoIXRoaXMudi5wcm9qZWN0SWQpIGluYm94LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5vcHRzLnByb2plY3RzKSB7XG4gICAgICBjb25zdCBvID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogcC5uYW1lLCB2YWx1ZTogcC5pZCB9KTtcbiAgICAgIGlmIChwLmlkID09PSB0aGlzLnYucHJvamVjdElkKSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc2VsLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYucHJvamVjdElkID0gc2VsLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIkV0aXF1ZXRhc1wiKTtcbiAgICBjb25zdCBsd3JhcCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxzXCIgfSk7XG4gICAgaWYgKHRoaXMua25vd25MYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCByZW5kZXJMYWJlbHMgPSAoKSA9PiB7XG4gICAgICAgIGx3cmFwLmVtcHR5KCk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmtub3duTGFiZWxzKSB7XG4gICAgICAgICAgY29uc3Qgb24gPSB0aGlzLnYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsd3JhcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICAgIGNsaWNrYWJsZShjaGlwLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy52LmxhYmVscy5pbmRleE9mKGwpO1xuICAgICAgICAgICAgaWYgKGkgPj0gMCkgdGhpcy52LmxhYmVscy5zcGxpY2UoaSwgMSk7IGVsc2UgdGhpcy52LmxhYmVscy5wdXNoKGwpO1xuICAgICAgICAgICAgcmVuZGVyTGFiZWxzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QgYWluZGEuXCIgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3Rpb25zRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICB0aGlzLnJlbmRlckFjdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZmllbGQobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQWN0aW9ucygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5hY3Rpb25zRWw7XG4gICAgYS5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlybURlbCAmJiB0aGlzLm9wdHMucmVtb3ZlKSB7XG4gICAgICBhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtY29uZmlybVwiLCB0ZXh0OiBcIkV4Y2x1aXIgZXN0YSB0YXJlZmE/XCIgfSk7XG4gICAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICAgIGNvbnN0IHllcyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICB5ZXMub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgeWVzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5yZW1vdmUhKCkpIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiKSB7XG4gICAgICBjb25zdCBkZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgZGVsLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IHRydWU7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgIH1cblxuICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGNhbmNlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgY2FuY2VsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgc2F2ZSA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlNhbHZhclwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIHNhdmUub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMudi5jb250ZW50ID0gdGhpcy52LmNvbnRlbnQudHJpbSgpO1xuICAgICAgaWYgKCF0aGlzLnYuY29udGVudCkgeyBuZXcgTm90aWNlKFwiRFx1MDBFQSB1bSB0XHUwMEVEdHVsbyBcdTAwRTAgdGFyZWZhLlwiKTsgcmV0dXJuOyB9XG4gICAgICBzYXZlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMuc3VibWl0KHRoaXMudikpIHRoaXMuY2xvc2UoKTtcbiAgICAgIGVsc2Ugc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICBvbkNsb3NlKCkgeyB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpOyB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGUgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIFdlcnVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAvLyBQcm9qZXRvcyBkbyBUb2RvaXN0IChwYXJhIG9zIGRyb3Bkb3ducyBkb3MgcGFjb3RlcykuIEJ1c2NhZG9zIDF4OyBxdWFuZG9cbiAgLy8gY2hlZ2FtLCByZS1yZW5kZXJpemEgYSBhYmEgcGFyYSBwcmVlbmNoZXIgb3Mgc2VsZWN0cy5cbiAgcHJpdmF0ZSBwcm9qZWN0czogVG9kb2lzdFByb2plY3RbXSB8IG51bGwgPSBudWxsO1xuICAvLyBFdGlxdWV0YXMgZG8gVG9kb2lzdCAoY2hpcHMgcG9yIHBhY290ZSkuIE1lc21hIGVzdHJhdFx1MDBFOWdpYTogYnVzY2EgMXguXG4gIHByaXZhdGUgbGFiZWxzOiBUb2RvaXN0TGFiZWxbXSB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHsgc3VwZXIoYXBwLCBwbHVnaW4pOyB9XG5cbiAgZGlzcGxheSgpIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRXhpYmlcdTAwRTdcdTAwRTNvIGRvIGRhc2hib2FyZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJFeGliaVx1MDBFN1x1MDBFM28gZG8gZGFzaGJvYXJkXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9kbyBjb21wYWN0b1wiKVxuICAgICAgLnNldERlc2MoXCJMYXlvdXQgbWFpcyBkZW5zbywgY29tIG1lbm9zIGVzcGFcdTAwRTdhbWVudG8gZW50cmUgb3MgZWxlbWVudG9zLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNvbXBhY3QgPSB2O1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTZVx1MDBFN1x1MDBGNWVzIGRvIGRhc2hib2FyZCAodmlzaWJpbGlkYWRlICsgb3JkZW0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNlXHUwMEU3XHUwMEY1ZXMgZG8gZGFzaGJvYXJkXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiQXRpdmUvZGVzYXRpdmUgY2FkYSBzZVx1MDBFN1x1MDBFM28gZSBhanVzdGUgYSBvcmRlbSBlbSBxdWUgYXBhcmVjZW0gbmEgZGFzaGJvYXJkLlwiLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3JkZXIgPSBwbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyO1xuICAgIG9yZGVyLmZvckVhY2goKGlkLCBpKSA9PiB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoU0VDVElPTl9MQUJFTFtpZF0pXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcImFycm93LXVwXCIpLnNldFRvb2x0aXAoXCJNb3ZlciBwYXJhIGNpbWFcIikuc2V0RGlzYWJsZWQoaSA9PT0gMClcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlU2VjdGlvbihpZCwgLTEpOyB0aGlzLmRpc3BsYXkoKTsgfSkpXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcImFycm93LWRvd25cIikuc2V0VG9vbHRpcChcIk1vdmVyIHBhcmEgYmFpeG9cIikuc2V0RGlzYWJsZWQoaSA9PT0gb3JkZXIubGVuZ3RoIC0gMSlcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlU2VjdGlvbihpZCwgKzEpOyB0aGlzLmRpc3BsYXkoKTsgfSkpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJWaXNcdTAwRUR2ZWxcIilcbiAgICAgICAgICAuc2V0VmFsdWUoIXBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoXCJzZWM6XCIgKyBpZCkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBhd2FpdCBwbHVnaW4uc2V0SGlkZGVuKFwic2VjOlwiICsgaWQsICF2KTsgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhc3RhcyBleGliaWRhcyAoY2FyZHMgZG8gQ29mcmUpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlBhc3RhcyBleGliaWRhcyAoY2FyZHMgZG8gQ29mcmUpXCIgfSk7XG4gICAgY29uc3QgdG9wRm9sZGVycyA9ICh0aGlzLmFwcC52YXVsdC5nZXRSb290KCkuY2hpbGRyZW5cbiAgICAgIC5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlciAmJiAhYy5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSBhcyBURm9sZGVyW10pXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgICBpZiAoIXRvcEZvbGRlcnMubGVuZ3RoKSB7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSBkZSB0b3BvIG5vIGNvZnJlLlwiIH0pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGYgb2YgdG9wRm9sZGVycykge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKGYubmFtZSlcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIlZpc1x1MDBFRHZlbFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSghcGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhmLnBhdGgpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgYXdhaXQgcGx1Z2luLnNldEhpZGRlbihmLnBhdGgsICF2KTsgfSkpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBGb250ZXMgZGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJGb250ZXMgZG9zIFJlbGF0XHUwMEYzcmlvc1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIlBhc3RhcyBjdWphcyBub3RhcyB2aXJhbSBjYXJkcyBub3MgZGlhcyBkYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zIChwb3NpXHUwMEU3XHUwMEUzbyBwZWxhIGRhdGEgZGEgbm90YSkuIENhZGEgZm9udGUgdGVtIHVtYSBjb3IgcHJcdTAwRjNwcmlhLlwiLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3JjcyA9IHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXM7XG4gICAgc3Jjcy5mb3JFYWNoKHMgPT4ge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKHMucGF0aClcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIkF0aXZhXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHMub24pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBzLm9uID0gdjsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0pKVxuICAgICAgICAuYWRkQ29sb3JQaWNrZXIoYyA9PiBjXG4gICAgICAgICAgLnNldFZhbHVlKHMuY29sb3IpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBzLmNvbG9yID0gdjsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0pKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJ0cmFzaC0yXCIpLnNldFRvb2x0aXAoXCJSZW1vdmVyIGZvbnRlXCIpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IHNyY3MuZmlsdGVyKHggPT4geCAhPT0gcyk7XG4gICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCB1c2VkID0gbmV3IFNldChzcmNzLm1hcChzID0+IHMucGF0aCkpO1xuICAgIGNvbnN0IGF2YWlsYWJsZSA9IGFsbEZvbGRlclBhdGhzKHRoaXMuYXBwKS5maWx0ZXIocCA9PiAhdXNlZC5oYXMocCkpO1xuICAgIGlmIChhdmFpbGFibGUubGVuZ3RoKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJBZGljaW9uYXIgZm9udGVcIilcbiAgICAgICAgLnNldERlc2MoXCJFc2NvbGhhIHVtYSBwYXN0YSBkbyBjb2ZyZSBwYXJhIGFsaW1lbnRhciBhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MuXCIpXG4gICAgICAgIC5hZGREcm9wZG93bihkID0+IHtcbiAgICAgICAgICBkLmFkZE9wdGlvbihcIlwiLCBcIkVzY29saGEgdW1hIHBhc3RhXHUyMDI2XCIpO1xuICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBhdmFpbGFibGUpIGQuYWRkT3B0aW9uKHAsIHApO1xuICAgICAgICAgIGQub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICBpZiAoIXYpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gQUNDRU5UU1twbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmxlbmd0aCAlIEFDQ0VOVFMubGVuZ3RoXTtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMucHVzaCh7IHBhdGg6IHYsIGNvbG9yLCBvbjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIlRhcmVmYXMgY29uY2x1XHUwMEVEZGFzIHZpcmFtIFhQL25cdTAwRUR2ZWwvc3RyZWFrIChhYmEgR2FtaWZpY2FcdTAwRTdcdTAwRTNvICsgZmFpeGEgbm8gZGFzaGJvYXJkKS4gXFxcIlNhbHZhciBjb25jbHVcdTAwRURkYXNcXFwiIGdyYXZhIG5vIGxvZyBkbyBjb2ZyZSAoMjAuQXJlYXMvR2FtaWZpY2FcdTAwRTdcdTAwRTNvLm1kKSBlIGxpbXBhIGRvIFRvZG9pc3QuIE8gYm90XHUwMEUzbyBcdTI3MTcgbWFyY2EgdW1hIHRhcmVmYSBjb21vIG5cdTAwRTNvIGZlaXRhIChwdW5pXHUwMEU3XHUwMEUzbyBlbSBYUCkgZSBhIGFwYWdhLlwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF0aXZhciBnYW1pZmljYVx1MDBFN1x1MDBFM29cIilcbiAgICAgIC5zZXREZXNjKFwiTW9zdHJhIGEgc2VcdTAwRTdcdTAwRTNvL2FiYSBkZSBHYW1pZmljYVx1MDBFN1x1MDBFM28gZSBvIGJvdFx1MDBFM28gXFxcIm5cdTAwRTNvIGZlaXRhXFxcIiBuYXMgdGFyZWZhcy5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkID0gdjtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgIHBsdWdpbi5nYW1lLnJlcmVuZGVyQWxsKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQZW5hbGlkYWRlIGRvIFxcXCJuXHUwMEUzbyBmZWl0b1xcXCJcIilcbiAgICAgIC5zZXREZXNjKFwiTXVsdGlwbGljYSBhIGJhc2UgZGEgcHJpb3JpZGFkZSBhbyBtYXJjYXIgY29tbyBuXHUwMEUzbyBmZWl0YS4gRXguOiAxLDUgPSBwZXJkZSA1MCUgYSBtYWlzIGRvIHF1ZSBnYW5oYXJpYS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4gdFxuICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCIxLjVcIilcbiAgICAgICAgLnNldFZhbHVlKFN0cmluZyhwbHVnaW4uc2V0dGluZ3MuZ2FtZVBlbmFsdHlGYWN0b3IpKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgY29uc3QgbiA9IE51bWJlcih2LnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG4gICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCkgeyBwbHVnaW4uc2V0dGluZ3MuZ2FtZVBlbmFsdHlGYWN0b3IgPSBuOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH1cbiAgICAgICAgfSkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhY290ZXMgZGUgdGFyZWZhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYWNvdGVzIGRlIHRhcmVmYXNcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJDb25qdW50b3MgZGUgdGFyZWZhcyBxdWUgdm9jXHUwMEVBIGxhblx1MDBFN2Egbm8gVG9kb2lzdCBjb20gdW0gY2xpcXVlIChuYSBhYmEgVG9kb2lzdCBvdSBubyBkYXNoYm9hcmQpLCB0b2RhcyBjb20gZGF0YSBkZSBob2plLiBVbWEgdGFyZWZhIHBvciBsaW5oYS4gTnVtYSBsaW5oYSwgdXNlIEBldGlxdWV0YSBwYXJhIGFwbGljYXIgdW1hIGV0aXF1ZXRhIHNcdTAwRjMgXHUwMEUwcXVlbGEgdGFyZWZhIGUgcDFcdTIwMTNwNCBwYXJhIGEgcHJpb3JpZGFkZSAocDEgPSBtYWlzIGFsdGE7IHBhZHJcdTAwRTNvIHA0KS5cIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb25maXJtYXIgYW50ZXMgZGUgbGFuXHUwMEU3YXJcIilcbiAgICAgIC5zZXREZXNjKFwiUGVkZSBjb25maXJtYVx1MDBFN1x1MDBFM28gKGNvbSBhIGxpc3RhIGRlIHRhcmVmYXMpIGFudGVzIGRlIGNyaWFyLiBcXFwiU2VtcHJlXFxcIiBjb25maXJtYSBhdFx1MDBFOSBwYXJhIDEgdGFyZWZhIFx1MjAxNCBcdTAwRkF0aWwgcGFyYSB0ZXN0YXI7IGRlcG9pcyBtdWRlIHBhcmEgTnVuY2EuXCIpXG4gICAgICAuYWRkRHJvcGRvd24oZCA9PiBkXG4gICAgICAgIC5hZGRPcHRpb24oXCJhbHdheXNcIiwgXCJTZW1wcmVcIilcbiAgICAgICAgLmFkZE9wdGlvbihcIm1hbnlcIiwgXCJTXHUwMEYzIG11aXRhcyAoPiA1IHRhcmVmYXMpXCIpXG4gICAgICAgIC5hZGRPcHRpb24oXCJuZXZlclwiLCBcIk51bmNhXCIpXG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MucGFja2FnZUNvbmZpcm0pXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtID0gdiBhcyBEYXNoU2V0dGluZ3NbXCJwYWNrYWdlQ29uZmlybVwiXTsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIC8vIEJ1c2NhIHByb2pldG9zIGUgZXRpcXVldGFzIHVtYSB2ZXogKGRyb3Bkb3ducyArIGNoaXBzKTsgYW8gY2hlZ2FyLCByZS1yZW5kZXJpemEuXG4gICAgaWYgKHRva2VuICYmIHRoaXMucHJvamVjdHMgPT09IG51bGwpIHtcbiAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS50aGVuKHBzID0+IHsgdGhpcy5wcm9qZWN0cyA9IHBzOyB0aGlzLmRpc3BsYXkoKTsgfSkuY2F0Y2goKCkgPT4geyB0aGlzLnByb2plY3RzID0gW107IH0pO1xuICAgIH1cbiAgICBpZiAodG9rZW4gJiYgdGhpcy5sYWJlbHMgPT09IG51bGwpIHtcbiAgICAgIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbikudGhlbihscyA9PiB7IHRoaXMubGFiZWxzID0gbHM7IHRoaXMuZGlzcGxheSgpOyB9KS5jYXRjaCgoKSA9PiB7IHRoaXMubGFiZWxzID0gW107IH0pO1xuICAgIH1cblxuICAgIC8vIFBvcG92ZXIgZGUgZXRpcXVldGFzIGRlIHVtIHBhY290ZSAoY2hpcHMgdG9nZ2xlIGNvbSBhIGNvciBkbyBUb2RvaXN0KS5cbiAgICBjb25zdCBvcGVuTGFiZWxzUG9wb3ZlciA9IChhbmNob3I6IEhUTUxFbGVtZW50LCBwa2c6IFRhc2tQYWNrYWdlLCByZWZyZXNoOiAoKSA9PiB2b2lkKSA9PlxuICAgICAgb3BlblBvcG92ZXIoYW5jaG9yLCBib2R5ID0+IHtcbiAgICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLXRpdGxlXCIsIHRleHQ6IFwiRXRpcXVldGFzIGRvIHBhY290ZVwiIH0pO1xuICAgICAgICBpZiAoIXRva2VuKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDb25maWd1cmUgbyB0b2tlbiBkbyBUb2RvaXN0LlwiIH0pOyByZXR1cm47IH1cbiAgICAgICAgaWYgKHRoaXMubGFiZWxzID09PSBudWxsKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgICAgICBpZiAoIXRoaXMubGFiZWxzLmxlbmd0aCkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiTmVuaHVtYSBldGlxdWV0YSBubyBUb2RvaXN0LlwiIH0pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgY2hpcHMgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3AtY2hpcHNcIiB9KTtcbiAgICAgICAgY29uc3QgcmVuZGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNoaXBzLmVtcHR5KCk7XG4gICAgICAgICAgZm9yIChjb25zdCBsIG9mIHRoaXMubGFiZWxzISkge1xuICAgICAgICAgICAgY29uc3Qgb24gPSAocGtnLmxhYmVscyA/PyBbXSkuaW5jbHVkZXMobC5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGNoaXAgPSBjaGlwcy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gVE9ET0lTVF9DT0xPUlNbbC5jb2xvcl0gPz8gTEFCRUxfRkFMTEJBQ0s7XG4gICAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bC5uYW1lfWAgfSk7XG4gICAgICAgICAgICBjbGlja2FibGUoY2hpcCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjdXIgPSBwa2cubGFiZWxzID8/IFtdO1xuICAgICAgICAgICAgICBjb25zdCBpID0gY3VyLmluZGV4T2YobC5uYW1lKTtcbiAgICAgICAgICAgICAgaWYgKGkgPj0gMCkgY3VyLnNwbGljZShpLCAxKTsgZWxzZSBjdXIucHVzaChsLm5hbWUpO1xuICAgICAgICAgICAgICBwa2cubGFiZWxzID0gY3VyLmxlbmd0aCA/IGN1ciA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSwgeyBjbHM6IFwid2QtcG9wLWxhYmVsc1wiIH0pO1xuXG4gICAgLy8gUG9wb3ZlciBkZSB0YXJlZmFzIGRlIHVtIHBhY290ZSAodGV4dGFyZWE7IHBlcnNpc3RlIG5vIGlucHV0IGUgYW8gZmVjaGFyKS5cbiAgICBjb25zdCBvcGVuVGFza3NQb3BvdmVyID0gKGFuY2hvcjogSFRNTEVsZW1lbnQsIHBrZzogVGFza1BhY2thZ2UsIHJlZnJlc2g6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgIGxldCB0YTogSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICAgIG9wZW5Qb3BvdmVyKGFuY2hvciwgYm9keSA9PiB7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC10aXRsZVwiLCB0ZXh0OiBcIlRhcmVmYXMgZG8gcGFjb3RlXCIgfSk7XG4gICAgICAgIHRhID0gYm9keS5jcmVhdGVFbChcInRleHRhcmVhXCIsIHsgY2xzOiBcIndkLXBrZy10YXNrc1wiIH0pO1xuICAgICAgICB0YS52YWx1ZSA9IHBrZy50YXNrcy5qb2luKFwiXFxuXCIpO1xuICAgICAgICB0YS5wbGFjZWhvbGRlciA9IFwiVW1hIHRhcmVmYSBwb3IgbGluaGEgKGV4LjogQmViZXIgXHUwMEUxZ3VhKVwiO1xuICAgICAgICB0YS5yb3dzID0gNjtcbiAgICAgICAgdGEuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBwa2cudGFza3MgPSB0YS52YWx1ZS5zcGxpdChcIlxcblwiKS5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiVW1hIHBvciBsaW5oYSBcdTAwQjcgQGV0aXF1ZXRhIG1hcmNhIHNcdTAwRjMgYXF1ZWxhIHRhcmVmYSBcdTAwQjcgcDFcdTIwMTNwNCBkZWZpbmUgYSBwcmlvcmlkYWRlIChwMSA9IG1haXMgYWx0YSkgXHUwMEI3IGZlY2hhIGFvIGNsaWNhciBmb3JhIG91IEVzYy5cIiB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0YS5mb2N1cygpLCAwKTtcbiAgICAgIH0sIHsgY2xzOiBcIndkLXBvcC10YXNrc1wiLCB3aWR0aDogMzIwLCBjb250YWluZXI6IHRoaXMuY29udGFpbmVyRWwsIG9uQ2xvc2U6ICgpID0+IHsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9IH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBwa2dzID0gcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBjb25zdCBsaXN0ID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1saXN0XCIgfSk7XG4gICAgcGtncy5mb3JFYWNoKChwa2csIGlkeCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLXJvd1wiIH0pO1xuXG4gICAgICAvLyBcdTAwQ0Rjb25lIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyIGRlIHBhbGV0YSkuXG4gICAgICBjb25zdCBpY29uQnRuID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb250cmlnZ2VyXCIgfSk7XG4gICAgICBpY29uQnRuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlx1MDBDRGNvbmUgZG8gcGFjb3RlXCIpO1xuICAgICAgY29uc3QgZmlsbEljb24gPSAoKSA9PiB7XG4gICAgICAgIGljb25CdG4uZW1wdHkoKTtcbiAgICAgICAgaWYgKHBrZy5pY29uKSByZW5kZXJJY29uKGljb25CdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvXCIgfSksIHBrZy5pY29uKTtcbiAgICAgICAgZWxzZSBpY29uQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljby1lbXB0eVwiLCB0ZXh0OiBcIitcIiB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsSWNvbigpO1xuICAgICAgY2xpY2thYmxlKGljb25CdG4sICgpID0+IG9wZW5JY29uUG9wb3ZlcihpY29uQnRuLCBwa2cuaWNvbiwgYXN5bmMgaWMgPT4ge1xuICAgICAgICBwa2cuaWNvbiA9IGljOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgZmlsbEljb24oKTtcbiAgICAgIH0pKTtcblxuICAgICAgLy8gTm9tZS5cbiAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC1wa2ctbmFtZS1pbnB1dFwiLCBhdHRyOiB7IHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJOb21lIGRvIHBhY290ZVwiIH0gfSk7XG4gICAgICBuYW1lLnZhbHVlID0gcGtnLm5hbWU7XG4gICAgICBuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBhc3luYyAoKSA9PiB7IHBrZy5uYW1lID0gbmFtZS52YWx1ZTsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KTtcbiAgICAgIG5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCkpO1xuXG4gICAgICAvLyBQcm9qZXRvLlxuICAgICAgY29uc3QgcHJvaiA9IHJvdy5jcmVhdGVFbChcInNlbGVjdFwiLCB7IGNsczogXCJ3ZC1wa2ctcHJvaiBkcm9wZG93blwiIH0pO1xuICAgICAgY29uc3QgYWRkT3B0ID0gKHY6IHN0cmluZywgdDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IG8gPSBwcm9qLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogdCwgdmFsdWU6IHYgfSk7XG4gICAgICAgIGlmICgocGtnLnByb2plY3RJZCA/PyBcIlwiKSA9PT0gdikgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9O1xuICAgICAgYWRkT3B0KFwiXCIsIFwiRW50cmFkYVwiKTtcbiAgICAgIGZvciAoY29uc3QgcCBvZiAodGhpcy5wcm9qZWN0cyA/PyBbXSkpIGFkZE9wdChwLmlkLCBwLm5hbWUpO1xuICAgICAgcHJvai5vbmNoYW5nZSA9IGFzeW5jICgpID0+IHsgcGtnLnByb2plY3RJZCA9IHByb2oudmFsdWUgfHwgdW5kZWZpbmVkOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH07XG5cbiAgICAgIC8vIEV0aXF1ZXRhcyAoYm90XHUwMEUzbyBcdTIxOTIgcG9wb3ZlcikuXG4gICAgICBjb25zdCBsYmxCdG4gPSByb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtcGtnLWNoaXAtYnRuXCIgfSk7XG4gICAgICBjb25zdCBmaWxsTGJsID0gKCkgPT4ge1xuICAgICAgICBsYmxCdG4uZW1wdHkoKTtcbiAgICAgICAgc2V0SWNvbihsYmxCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctYnRuLWljb1wiIH0pLCBcInRhZ1wiKTtcbiAgICAgICAgbGJsQnRuLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIkV0aXF1ZXRhc1wiIH0pO1xuICAgICAgICBjb25zdCBuID0gcGtnLmxhYmVscz8ubGVuZ3RoID8/IDA7XG4gICAgICAgIGlmIChuKSBsYmxCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogU3RyaW5nKG4pIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxMYmwoKTtcbiAgICAgIGxibEJ0bi5vbmNsaWNrID0gKCkgPT4gb3BlbkxhYmVsc1BvcG92ZXIobGJsQnRuLCBwa2csIGZpbGxMYmwpO1xuXG4gICAgICAvLyBUYXJlZmFzIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyKS5cbiAgICAgIGNvbnN0IHRhc2tCdG4gPSByb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtcGtnLWNoaXAtYnRuXCIgfSk7XG4gICAgICBjb25zdCBmaWxsVGFzayA9ICgpID0+IHtcbiAgICAgICAgdGFza0J0bi5lbXB0eSgpO1xuICAgICAgICBzZXRJY29uKHRhc2tCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctYnRuLWljb1wiIH0pLCBcImxpc3RcIik7XG4gICAgICAgIHRhc2tCdG4uY3JlYXRlU3Bhbih7IHRleHQ6IFwiVGFyZWZhc1wiIH0pO1xuICAgICAgICBjb25zdCBuID0gcGtnLnRhc2tzLmZpbHRlcihzID0+IHMudHJpbSgpKS5sZW5ndGg7XG4gICAgICAgIGlmIChuKSB0YXNrQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IFN0cmluZyhuKSB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsVGFzaygpO1xuICAgICAgdGFza0J0bi5vbmNsaWNrID0gKCkgPT4gb3BlblRhc2tzUG9wb3Zlcih0YXNrQnRuLCBwa2csIGZpbGxUYXNrKTtcblxuICAgICAgLy8gUmVvcmRlbmFyIC8gcmVtb3Zlci5cbiAgICAgIGNvbnN0IHVwID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmlcIiArIChpZHggPT09IDAgPyBcIiB3ZC1kaXNhYmxlZFwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHVwLCBcImNoZXZyb24tdXBcIik7IHVwLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHBhcmEgY2ltYVwiKTtcbiAgICAgIGlmIChpZHggPiAwKSBjbGlja2FibGUodXAsIGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVQYWNrYWdlKGlkeCwgLTEpOyB0aGlzLmRpc3BsYXkoKTsgfSk7XG4gICAgICBjb25zdCBkb3duID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmlcIiArIChpZHggPT09IHBrZ3MubGVuZ3RoIC0gMSA/IFwiIHdkLWRpc2FibGVkXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24oZG93biwgXCJjaGV2cm9uLWRvd25cIik7IGRvd24uc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgcGFyYSBiYWl4b1wiKTtcbiAgICAgIGlmIChpZHggPCBwa2dzLmxlbmd0aCAtIDEpIGNsaWNrYWJsZShkb3duLCBhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlUGFja2FnZShpZHgsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH0pO1xuICAgICAgY29uc3QgZGVsID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmkgd2QtcGtnLWRlbFwiIH0pO1xuICAgICAgc2V0SWNvbihkZWwsIFwidHJhc2gtMlwiKTsgZGVsLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlJlbW92ZXIgcGFjb3RlXCIpO1xuICAgICAgY2xpY2thYmxlKGRlbCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzID0gcGtncy5maWx0ZXIoeCA9PiB4ICE9PSBwa2cpO1xuICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBZGljaW9uYXIgcGFjb3RlXCIpXG4gICAgICAuYWRkQnV0dG9uKGIgPT4gYlxuICAgICAgICAuc2V0QnV0dG9uVGV4dChcIisgTm92byBwYWNvdGVcIilcbiAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMucHVzaCh7IGlkOiB1aWQoKSwgbmFtZTogXCJOb3ZvIHBhY290ZVwiLCB0YXNrczogW10gfSk7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJJbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9rZW4gZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIlRvZG9pc3QgXHUyMTkyIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBJbnRlZ3JhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFRva2VuIGRlIEFQSSBkbyBkZXNlbnZvbHZlZG9yLiBTYWx2byBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIG8gdG9rZW4gYXF1aVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRhcyB0YXJlZmFzXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBvIHByb2pldG8gbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBvIG5vbWUgZG8gcHJvamV0byBhbyBsYWRvIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgYXMgQGV0aXF1ZXRhcyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nKVwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkVzdGFzIGNyZWRlbmNpYWlzIHNcdTAwRTNvIGd1YXJkYWRhcyBwb3IgZGlzcG9zaXRpdm8gKGxvY2FsU3RvcmFnZSkgXHUyMDE0IGNhZGEgbVx1MDBFMXF1aW5hIHRlbSBhIHN1YSBlIGVsYXMgblx1MDBFM28gc2luY3Jvbml6YW0gcGVsbyBTeW5jdGhpbmcgbmVtIHZcdTAwRTNvIHBhcmEgbyBHaXQuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVVJMIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJFbmRlcmVcdTAwRTdvIGRvIFN5bmN0aGluZy4gUGFkclx1MDBFM286IGh0dHA6Ly8xMjcuMC4wLjE6ODM4NCAoYSBpbnN0XHUwMEUybmNpYSBsb2NhbCkuIE5vIGNlbHVsYXIsIGFwb250ZSBwYXJhIGEgQVBJIGRlIG91dHJhIG1cdTAwRTFxdWluYSBuYSByZWRlIHNlIGEgbG9jYWwgblx1MDBFM28gcmVzcG9uZGVyLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IHYudHJpbSgpIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQVBJIGtleVwiKVxuICAgICAgLnNldERlc2MoXCJTeW5jdGhpbmcgXHUyMTkyIEFjdGlvbnMgXHUyMTkyIFNldHRpbmdzIFx1MjE5MiBBUEkgS2V5LiBHdWFyZGFkYSBwb3IgZGlzcG9zaXRpdm8gKGxvY2FsU3RvcmFnZSksIG5cdTAwRTNvIHZhaSBwYXJhIG8gZGF0YS5qc29uL0dpdC5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBhIEFQSSBrZXlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJRCBkYSBwYXN0YSAob3BjaW9uYWwpXCIpXG4gICAgICAuc2V0RGVzYyhcIkZvbGRlciBJRCBkbyBjb2ZyZSBubyBTeW5jdGhpbmcuIFZhemlvID0gdXNhIGEgcHJpbWVpcmEgcGFzdGEgYXV0b21hdGljYW1lbnRlLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJleC46IG51bnF2LW10aW1uXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBjb250YWdlbSBkZSBpdGVucyBwb3IgYXBhcmVsaG9cIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgXFxcInNpbmNyb25pemFkb3MgLyB0b3RhbFxcXCIgZGUgaXRlbnMgZW0gY2FkYSBhcGFyZWxobywgYWxcdTAwRTltIGRhIHBvcmNlbnRhZ2VtLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICB9KSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUEySztBQUUzSyxJQUFNLFlBQVk7QUFDbEIsSUFBTSxvQkFBb0I7QUFLMUIsSUFBTSxZQUFZO0FBQ2xCLElBQU0sWUFBWTtBQUNsQixJQUFNLGVBQWU7QUFDckIsSUFBTSxnQkFBZ0I7QUFDdEIsSUFBTSxXQUFXLElBQUksS0FBSztBQUMxQixJQUFNLGlCQUFpQjtBQUd2QixJQUFNLGlCQUFpQjtBQUN2QixJQUFNLGdCQUFnQjtBQUN0QixJQUFNLGlCQUFpQjtBQUN2QixJQUFNLHdCQUF3QjtBQUU5QixJQUFNLFlBQW9DLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFO0FBQ25FLFNBQVMsY0FBYyxHQUFtQjtBQXRCMUM7QUFzQjRDLFVBQU8sZUFBVSxDQUFDLE1BQVgsWUFBZ0I7QUFBRztBQUd0RSxTQUFTLE1BQWM7QUFDckIsU0FBTyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLE9B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UyxLQUFLLE9BQU8sU0FBUyxZQUFZLEVBQzFDLFNBQVMsT0FBTSxNQUFLO0FBQ25CLGFBQUssT0FBTyxTQUFTLGVBQWUsRUFBRSxLQUFLLEtBQUs7QUFDaEQsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzFCLENBQUM7QUFDSCxRQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDMUIsQ0FBQztBQUVILFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLFNBQVMsRUFDakIsUUFBUSxvSUFBa0gsRUFDMUgsUUFBUSxPQUFLO0FBQ1osUUFBRSxlQUFlLGdCQUFnQixFQUM5QixTQUFTLEtBQUssT0FBTyxTQUFTLGVBQWUsRUFDN0MsU0FBUyxPQUFNLE1BQUs7QUFDbkIsYUFBSyxPQUFPLFNBQVMsa0JBQWtCLEVBQUUsS0FBSztBQUM5QyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxZQUFZO0FBQUEsTUFDMUIsQ0FBQztBQUNILFFBQUUsUUFBUSxPQUFPO0FBQ2pCLFFBQUUsUUFBUSxNQUFNLFFBQVE7QUFBQSxJQUMxQixDQUFDO0FBRUgsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsd0JBQXdCLEVBQ2hDLFFBQVEsZ0ZBQWdGLEVBQ3hGLFFBQVEsT0FBSztBQUNaLFFBQUUsZUFBZSxrQkFBa0IsRUFDaEMsU0FBUyxLQUFLLE9BQU8sU0FBUyxpQkFBaUIsRUFDL0MsU0FBUyxPQUFNLE1BQUs7QUFDbkIsYUFBSyxPQUFPLFNBQVMsb0JBQW9CLEVBQUUsS0FBSztBQUNoRCxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxZQUFZO0FBQUEsTUFDMUIsQ0FBQztBQUNILFFBQUUsUUFBUSxNQUFNLFFBQVE7QUFBQSxJQUMxQixDQUFDO0FBRUgsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsd0NBQXdDLEVBQ2hELFFBQVEsa0ZBQWlGLEVBQ3pGLFVBQVUsT0FBSyxFQUNiLFNBQVMsS0FBSyxPQUFPLFNBQVMsbUJBQW1CLEVBQ2pELFNBQVMsT0FBTSxNQUFLO0FBQ25CLFdBQUssT0FBTyxTQUFTLHNCQUFzQjtBQUMzQyxZQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLFdBQUssT0FBTyxZQUFZO0FBQUEsSUFDMUIsQ0FBQyxDQUFDO0FBQUEsRUFDUjtBQUNGOyIsCiAgIm5hbWVzIjogWyJfYSIsICJvayIsICJyYW5nZSIsICJfYiIsICJfYyJdCn0K
