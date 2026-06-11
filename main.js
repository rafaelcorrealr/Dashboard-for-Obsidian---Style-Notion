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
  gameLastHarvest: ""
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
function gameLevel(xp) {
  return xp <= 0 ? 0 : Math.floor(Math.sqrt(xp / 100));
}
function levelInfo(xp) {
  const level = gameLevel(xp);
  const into = Math.max(0, xp) - 100 * level * level;
  const forNext = 100 * (2 * level + 1);
  return { level, into, forNext, pct: forNext ? Math.min(100, Math.round(into / forNext * 100)) : 0 };
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
    xpIntoLevel: totalXp - 100 * level * level,
    xpForNext: 100 * (2 * level + 1),
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
    if (opts.full) this.renderXpChart(host, s);
    if (opts.full) this.renderScopeLevels(host, s);
  }
  // Níveis por escopo (projeto/etiqueta): top por XP, cada um com nível + mini-barra.
  // Reusa a barra de XP (`.wd-game-bar`) e `levelInfo(xp)`.
  renderScopeLevels(host, s) {
    const TOP = 8;
    const section = (title, data, prefix = "", renameEmpty) => {
      const top = [...data.entries()].filter(([, xp]) => xp > 0).sort((a, b) => b[1] - a[1]).slice(0, TOP);
      if (!top.length) return;
      const sec = host.createDiv({ cls: "wd-game-scopesec" });
      sec.createDiv({ cls: "wd-game-chart-title", text: title });
      for (const [name, xp] of top) {
        const li = levelInfo(xp);
        const item = sec.createDiv({ cls: "wd-game-scope-item" });
        const head = item.createDiv({ cls: "wd-game-scope-head" });
        head.createSpan({
          cls: "wd-game-scope-name",
          text: prefix + (renameEmpty && name === "\u2014" ? renameEmpty : name)
        });
        head.createSpan({ cls: "wd-game-scope-meta", text: `Nv ${li.level} \xB7 ${xp} XP` });
        const bar = item.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
        bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${li.pct}%`;
        bar.setAttr("title", `${li.into}/${li.forNext} XP para o n\xEDvel ${li.level + 1}`);
      }
    };
    section("N\xEDveis por projeto", s.byProject, "", "Sem projeto");
    section("N\xEDveis por etiqueta", s.byLabel, "@");
  }
  // Gráfico de XP por dia (últimos N dias) — reusa o visual de barras do "Crescimento".
  renderXpChart(host, s) {
    var _a, _b;
    const DAYS = import_obsidian.Platform.isPhone ? 15 : 30;
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
    const max = Math.max(...days.map((d) => Math.max(0, d.xp)), 1);
    const sec = host.createDiv({ cls: "wd-game-chartsec" });
    sec.createDiv({ cls: "wd-game-chart-title", text: `XP nos \xFAltimos ${DAYS} dias` });
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    days.forEach(({ key, xp, count, label }, idx) => {
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const empty = xp <= 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (empty ? " wd-growth-bar-zero" : "") });
      bar.style.height = empty ? "3px" : `${Math.max(5, Math.round(xp / max * 100))}%`;
      bar.setAttr("title", `${label}: ${xp >= 0 ? "+" : ""}${xp} XP \xB7 ${count} feita(s)`);
      const showLbl = idx === 0 || idx === DAYS - 1 || idx % 7 === 0;
      col.createDiv({ cls: "wd-growth-lbl", text: showLbl ? label : "" });
    });
  }
};
var DashboardView = class extends import_obsidian.ItemView {
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
    this.plugin.game.renderPanel(sec, ctrls, { full: false });
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
    const phone = import_obsidian.Platform.isPhone;
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
    if (import_obsidian.Platform.isPhone) return;
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
    const counts = this.plugin.getVaultCache().ctimeByDay;
    const DAYS = import_obsidian.Platform.isPhone ? 15 : 30;
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
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    entries.forEach(({ key, count, label, displayVal }, idx) => {
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const isEmpty = displayVal === 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (isEmpty ? " wd-growth-bar-zero" : "") });
      bar.style.height = isEmpty ? "3px" : `${Math.max(5, Math.round(displayVal / max * 100))}%`;
      if (!isEmpty) bar.setAttr("title", `${label}: ${this.growthCumulative ? displayVal + " total" : count + " nota(s)"}`);
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
var TodoistView = class extends import_obsidian.ItemView {
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
  }
  async onClose() {
    var _a;
    (_a = this.unsubTodo) == null ? void 0 : _a.call(this);
    this.unsubTodo = null;
    this.plugin.todo.hideTip();
  }
  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-todoist-view");
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
var GamificationView = class extends import_obsidian.ItemView {
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
  }
  async onClose() {
    var _a;
    (_a = this.unsub) == null ? void 0 : _a.call(this);
    this.unsub = null;
  }
  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-game-view");
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Gamifica\xE7\xE3o" });
    const sec = root.createDiv({ cls: "wd-section wd-game-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "PROGRESSO" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.plugin.game.renderPanel(sec, ctrls, { full: true });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5jb25zdCBMU19UT0RPX0NBQ0hFID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6dG9kb2lzdENhY2hlXCI7ICAgLy8gY2FjaGUgb2ZmbGluZSBkbyBUb2RvaXN0IChwb3ItZGlzcG9zaXRpdm8pXG5jb25zdCBUT0RPX1RUTCA9IDUgKiA2MCAqIDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZGFkZSBtXHUwMEUxeC4gZG8gY2FjaGUgYW50ZXMgZGUgcmUtYnVzY2FyICg1IG1pbilcbmNvbnN0IFRPRE9fTUFYX1BBR0VTID0gNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRldG8gZGUgcFx1MDBFMWdpbmFzIHBhZ2luYWRhcyAoYW50aS1sb29wIHNlIGEgQVBJIHJlcGV0aXIgbyBjdXJzb3IpXG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM28gKHYwLjEzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEdBTUVfVklFV19UWVBFID0gXCJ3ZXJ1cy1nYW1lXCI7XG5jb25zdCBHQU1FX0xPR19QQVRIID0gXCIyMC5BcmVhcy9HYW1pZmljYVx1MDBFN1x1MDBFM28ubWRcIjsgICAgICAgIC8vIGxvZyBjYW5cdTAwRjRuaWNvIGRlIFhQIG5vIGNvZnJlXG5jb25zdCBHQU1FX0xPR19GRU5DRSA9IFwid2QtZ2FtZS1sb2dcIjsgICAgICAgICAgICAgICAgICAgLy8gYmxvY28gY2VyY2FkbyBjb20gb3MgZXZlbnRvcyAoMSBwb3IgbGluaGEpXG5jb25zdCBIQVJWRVNUX0JBQ0tGSUxMX0RBWVMgPSA5MDsgICAgICAgICAgICAgICAgICAgICAgIC8vIDFcdTAwQUEgY29saGVpdGE6IGphbmVsYSBtXHUwMEUxeC4gZGEgQVBJXG4vLyBYUCBiYXNlIHBvciBwcmlvcmlkYWRlIGRhIEFQSSAoNCA9IHAxIFx1MjAyNiAxID0gcDQpLlxuY29uc3QgWFBfQllfUFJJOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+ID0geyA0OiA4LCAzOiA1LCAyOiAzLCAxOiAxIH07XG5mdW5jdGlvbiB4cEZvclByaW9yaXR5KHA6IG51bWJlcik6IG51bWJlciB7IHJldHVybiBYUF9CWV9QUklbcF0gPz8gMTsgfVxuXG4vLyB1aWQgY3VydG8gZSBlc3RcdTAwRTF2ZWwgKHBhY290ZXMgZGUgdGFyZWZhcykuXG5mdW5jdGlvbiB1aWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyk7XG59XG5cbnR5cGUgU3RhdHVzID0gXCJwcm9ncmVzc1wiIHwgXCJwYXVzZWRcIiB8IFwiY2FuY2VsbGVkXCI7XG50eXBlIFNlY3Rpb25JZCA9IFwiY2FsZW5kYXJcIiB8IFwicGFyYVwiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiIHwgXCJ0b2RvaXN0XCIgfCBcInN5bmNcIiB8IFwiZ2FtZVwiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG4gIC8vIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodjAuMTMpXG4gIGdhbWlmaWNhdGlvbkVuYWJsZWQ6IGJvb2xlYW47ICAvLyBtb3N0cmEgYSBzZVx1MDBFN1x1MDBFM28vYWJhIGRvIEdhbWVcbiAgZ2FtZVBlbmFsdHlGYWN0b3I6IG51bWJlcjsgICAgIC8vIFwiblx1MDBFM28gZmVpdG9cIiB0aXJhIGJhc2UgXHUwMEQ3IGZhdG9yXG4gIGdhbWVMYXN0SGFydmVzdDogc3RyaW5nOyAgICAgICAvLyBJU08gZGEgXHUwMEZBbHRpbWEgY29saGVpdGEgZGUgY29uY2x1XHUwMEVEZGFzIChsaW1pdGEgbyBmZXRjaClcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogRGFzaFNldHRpbmdzID0ge1xuICBzZWN0aW9uT3JkZXI6IFtcInN0YXRzXCIsIFwiZ2FtZVwiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXSxcbiAgY29tcGFjdDogZmFsc2UsXG4gIGhpZGRlbjogW10sXG4gIG5vdGVWaWV3OiBcImxpc3RcIixcbiAgY2FsZW5kYXJTb3VyY2VzOiBbXG4gICAgeyBwYXRoOiBcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiLCBjb2xvcjogXCIjM0I4MkY2XCIsIG9uOiB0cnVlIH0sXG4gICAgeyBwYXRoOiBcIjUwLkRpXHUwMEUxcmlvXCIsICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMTBCOTgxXCIsIG9uOiB0cnVlIH0sXG4gIF0sXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbiAgdG9kb2lzdERheVJhbmdlOiA3LFxuICB0b2RvaXN0RmlsdGVyczogeyBwcm9qZWN0czogW10sIGxhYmVsczogW10gfSxcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiB0cnVlLFxuICB0b2RvaXN0U2hvd0xhYmVsczogZmFsc2UsXG4gIHN5bmN0aGluZ1VybDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIixcbiAgc3luY3RoaW5nQXBpS2V5OiBcIlwiLFxuICBzeW5jdGhpbmdGb2xkZXJJZDogXCJcIixcbiAgc3luY3RoaW5nU2hvd0NvdW50czogZmFsc2UsXG4gIHRhc2tQYWNrYWdlczogW10sXG4gIHBhY2thZ2VDb25maXJtOiBcIm1hbnlcIixcbiAgZ2FtaWZpY2F0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgZ2FtZVBlbmFsdHlGYWN0b3I6IDEuNSxcbiAgZ2FtZUxhc3RIYXJ2ZXN0OiBcIlwiLFxufTtcblxuaW50ZXJmYWNlIFBhcmFTZWN0aW9uIHtcbiAgZm9sZGVyOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgYWNjZW50OiBzdHJpbmc7XG59XG5cbi8vIFBhc3RhcyBcImNvbmhlY2lkYXNcIiBkbyBQQVJBOiBtYW50XHUwMEVBbSBcdTAwRURjb25lLCByXHUwMEYzdHVsbyBlIGNvciBmaXhvcy4gQXMgZGVtYWlzIHBhc3Rhc1xuLy8gZG8gY29mcmUgc1x1MDBFM28gcmVuZGVyaXphZGFzIGNvbSBjb3IgYXV0b21cdTAwRTF0aWNhIGUgXHUwMEVEY29uZSBwYWRyXHUwMEUzbyAob3UgbyBpY29uOiBkbyBzdGF0dXMubWQpLlxuY29uc3QgUEFSQTogUGFyYVNlY3Rpb25bXSA9IFtcbiAgeyBmb2xkZXI6IFwiMDAuSW5ib3hcIiwgICAgIGljb246IFwiXHVEODNEXHVEQ0U1XCIsIGxhYmVsOiBcIkluYm94XCIsICAgIGFjY2VudDogXCIjNjM2NkYxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMTAuUHJvamVjdHNcIiwgIGljb246IFwiXHVEODNEXHVERTgwXCIsIGxhYmVsOiBcIlByb2pldG9zXCIsIGFjY2VudDogXCIjMTBCOTgxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMjAuQXJlYXNcIiwgICAgIGljb246IFwiXHVEODNDXHVERkFGXCIsIGxhYmVsOiBcIlx1MDBDMXJlYXNcIiwgICAgYWNjZW50OiBcIiNGNTlFMEJcIiB9LFxuICB7IGZvbGRlcjogXCIzMC5SZXNvdXJjZXNcIiwgaWNvbjogXCJcdUQ4M0RcdURDREFcIiwgbGFiZWw6IFwiUmVjdXJzb3NcIiwgYWNjZW50OiBcIiMzQjgyRjZcIiB9LFxuICB7IGZvbGRlcjogXCI0MC5BcmNoaXZlXCIsICAgaWNvbjogXCJcdUQ4M0RcdUREQzRcdUZFMEZcIiwgIGxhYmVsOiBcIkFycXVpdm9cIiwgIGFjY2VudDogXCIjNkI3MjgwXCIgfSxcbl07XG5jb25zdCBQQVJBX01BUCA9IG5ldyBNYXAoUEFSQS5tYXAocCA9PiBbcC5mb2xkZXIsIHBdKSk7XG5cbi8vIFBhbGV0YSBwYXJhIGNvbG9yaXIgcGFzdGFzIGRlc2NvbmhlY2lkYXMgZGUgZm9ybWEgZXN0XHUwMEUxdmVsIChwb3IgaGFzaCBkbyBub21lKS5cbmNvbnN0IEFDQ0VOVFMgPSBbXCIjNjM2NkYxXCIsXCIjMTBCOTgxXCIsXCIjRjU5RTBCXCIsXCIjM0I4MkY2XCIsXCIjRUM0ODk5XCIsXCIjOEI1Q0Y2XCIsXCIjMTRCOEE2XCIsXCIjRUY0NDQ0XCJdO1xuXG5jb25zdCBEQVlfU0hPUlQgPSBbXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTXHUwMEUxYlwiLCBcIkRvbVwiXTtcbmNvbnN0IE1PTlRIX1NIT1JUID0gW1wiSmFuXCIsXCJGZXZcIixcIk1hclwiLFwiQWJyXCIsXCJNYWlcIixcIkp1blwiLFwiSnVsXCIsXCJBZ29cIixcIlNldFwiLFwiT3V0XCIsXCJOb3ZcIixcIkRlelwiXTtcbmNvbnN0IElNR19FWFQgPSBbXCJwbmdcIixcImpwZ1wiLFwianBlZ1wiLFwid2VicFwiLFwiZ2lmXCIsXCJzdmdcIl07XG5cbi8vIFBhc3RhIHJhaXogZGFzIG5vdGFzIGRpXHUwMEUxcmlhcyAoY3JpYWRhcyBhbyBjbGljYXIgbnVtIGRpYSBkbyBjYWxlbmRcdTAwRTFyaW8pLlxuY29uc3QgREFJTFlfRk9MREVSID0gXCI1MC5EaVx1MDBFMXJpb1wiO1xuLy8gVGVtcGxhdGUgb3BjaW9uYWw7IHBsYWNlaG9sZGVycyB7e2RhdGV9fSAoWVlZWS1NTS1ERCkgZSB7e3RpdGxlfX0gKGRhdGEgcG9yIGV4dGVuc28pLlxuY29uc3QgREFJTFlfVEVNUExBVEUgPSBcIk1vZGVsb3MvTm90YSBEaVx1MDBFMXJpYS5tZFwiO1xuXG5jb25zdCBTVEFUVVNfSUNPTjogUmVjb3JkPFN0YXR1cywgc3RyaW5nPiA9IHtcbiAgcHJvZ3Jlc3M6IFwiXHUyNUI2XCIsIHBhdXNlZDogXCJcdTIzRjhcIiwgY2FuY2VsbGVkOiBcIlx1MjcxNVwiLFxufTtcblxuY29uc3QgU0VDX0NBTCA9IFwic2VjOmNhbGVuZGFyXCI7XG5jb25zdCBTRUNfUEFSQSA9IFwic2VjOnBhcmFcIjtcbmNvbnN0IFNFQ19IRUFUID0gXCJzZWM6aGVhdG1hcFwiO1xuY29uc3QgU0VDX0dST1cgPSBcInNlYzpncm93dGhcIjtcbmNvbnN0IFNFQ19TVEFUID0gXCJzZWM6c3RhdHNcIjtcbmNvbnN0IFNFQ19UT0RPID0gXCJzZWM6dG9kb2lzdFwiO1xuY29uc3QgU0VDX1NZTkMgPSBcInNlYzpzeW5jXCI7XG5jb25zdCBTRUNfR0FNRSA9IFwic2VjOmdhbWVcIjtcblxuLy8gUlx1MDBGM3R1bG9zIGFtaWdcdTAwRTF2ZWlzIGRhcyBzZVx1MDBFN1x1MDBGNWVzICh1c2Fkb3MgbmEgYWJhIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzKS5cbmNvbnN0IFNFQ1RJT05fTEFCRUw6IFJlY29yZDxTZWN0aW9uSWQsIHN0cmluZz4gPSB7XG4gIHN0YXRzOiAgICBcIkVzdGF0XHUwMEVEc3RpY2FzXCIsXG4gIHRvZG9pc3Q6ICBcIlRhcmVmYXNcIixcbiAgcGFyYTogICAgIFwiQ29mcmUgKHBhc3RhcylcIixcbiAgc3luYzogICAgIFwiU2luY3Jvbml6YVx1MDBFN1x1MDBFM29cIixcbiAgaGVhdG1hcDogIFwiQXRpdmlkYWRlIGRvIGNvZnJlXCIsXG4gIGdyb3d0aDogICBcIkNyZXNjaW1lbnRvIGRvIGNvZnJlXCIsXG4gIGNhbGVuZGFyOiBcIlJlbGF0XHUwMEYzcmlvc1wiLFxuICBnYW1lOiAgICAgXCJHYW1pZmljYVx1MDBFN1x1MDBFM29cIixcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVG9kb2lzdFRhc2sge1xuICBpZDogc3RyaW5nO1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSTogMS4uNCwgb25kZSA0ID0gdXJnZW50ZSAoPSBwMSBuYSBVSSlcbiAgZHVlPzogeyBkYXRlOiBzdHJpbmc7IGRhdGV0aW1lPzogc3RyaW5nOyBzdHJpbmc/OiBzdHJpbmc7IGlzX3JlY3VycmluZz86IGJvb2xlYW4gfSB8IG51bGw7XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG4gIGlzX2NvbXBsZXRlZD86IGJvb2xlYW47XG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICB1cmw/OiBzdHJpbmc7XG4gIGNvbXBsZXRlZF9hdD86IHN0cmluZzsgICAvLyBzXHUwMEYzIG5hcyBjb25jbHVcdTAwRURkYXMgKGJ5X2NvbXBsZXRpb25fZGF0ZSlcbn1cblxuLy8gUHJpb3JpZGFkZSBkYSBBUEkgKDQ9dXJnZW50ZSkgXHUyMTkyIHJcdTAwRjN0dWxvL2NvciBkYSBVSSAocDE9dmVybWVsaG8gXHUyMDI2IHA0PWNpbnphKS5cbmNvbnN0IFRPRE9JU1RfUFJJOiBSZWNvcmQ8bnVtYmVyLCB7IGxhYmVsOiBzdHJpbmc7IGNvbG9yOiBzdHJpbmcgfT4gPSB7XG4gIDQ6IHsgbGFiZWw6IFwicDFcIiwgY29sb3I6IFwiI0VGNDQ0NFwiIH0sXG4gIDM6IHsgbGFiZWw6IFwicDJcIiwgY29sb3I6IFwiI0Y1OUUwQlwiIH0sXG4gIDI6IHsgbGFiZWw6IFwicDNcIiwgY29sb3I6IFwiIzNCODJGNlwiIH0sXG4gIDE6IHsgbGFiZWw6IFwicDRcIiwgY29sb3I6IFwiIzZCNzI4MFwiIH0sXG59O1xuZnVuY3Rpb24gcHJpTWV0YShwOiBudW1iZXIpIHsgcmV0dXJuIFRPRE9JU1RfUFJJW3BdID8/IFRPRE9JU1RfUFJJWzFdOyB9XG5cbi8vIFBhbGV0YSBub21lYWRhIGRvIFRvZG9pc3QgXHUyMTkyIGhleCAocGFyYSBjb2xvcmlyIGFzIGV0aXF1ZXRhcyBjb21vIG5vIGFwcCkuXG5jb25zdCBUT0RPSVNUX0NPTE9SUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgYmVycnlfcmVkOiBcIiNCODI1NUZcIiwgcmVkOiBcIiNEQjQwMzVcIiwgb3JhbmdlOiBcIiNGRjk5MzNcIiwgeWVsbG93OiBcIiNGQUQwMDBcIixcbiAgb2xpdmVfZ3JlZW46IFwiI0FGQjgzQlwiLCBsaW1lX2dyZWVuOiBcIiM3RUNDNDlcIiwgZ3JlZW46IFwiIzI5OTQzOFwiLCBtaW50X2dyZWVuOiBcIiM2QUNDQkNcIixcbiAgdGVhbDogXCIjMTU4RkFEXCIsIHNreV9ibHVlOiBcIiMxNEFBRjVcIiwgbGlnaHRfYmx1ZTogXCIjOTZDM0VCXCIsIGJsdWU6IFwiIzQwNzNGRlwiLFxuICBncmFwZTogXCIjODg0REZGXCIsIHZpb2xldDogXCIjQUYzOEVCXCIsIGxhdmVuZGVyOiBcIiNFQjk2RUJcIiwgbWFnZW50YTogXCIjRTA1MTk0XCIsXG4gIHNhbG1vbjogXCIjRkY4RDg1XCIsIGNoYXJjb2FsOiBcIiM4MDgwODBcIiwgZ3JleTogXCIjQjhCOEI4XCIsIHRhdXBlOiBcIiNDQ0FDOTNcIixcbn07XG5jb25zdCBMQUJFTF9GQUxMQkFDSyA9IFwiI0I4QjhCOFwiO1xuLy8gTm8gbW9kbyBcIm1hbnlcIiwgbGFuXHUwMEU3YXIgbWFpcyBxdWUgaXN0byBwZWRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzby5cbmNvbnN0IExBVU5DSF9DT05GSVJNX01JTiA9IDU7XG5cbi8vIFx1MDBDRGNvbmVzIHN1Z2VyaWRvcyBwYXJhIG9zIHBhY290ZXMgKG5vbWVzIEx1Y2lkZTsgcmVuZGVyaXphZG9zIHBvciByZW5kZXJJY29uKS5cbmNvbnN0IFBLR19JQ09OUyA9IFtcbiAgXCJzdW5yaXNlXCIsIFwic3VuXCIsIFwic3Vuc2V0XCIsIFwibW9vblwiLCBcImNvZmZlZVwiLCBcInV0ZW5zaWxzXCIsIFwiZHVtYmJlbGxcIiwgXCJib29rLW9wZW5cIixcbiAgXCJicmllZmNhc2VcIiwgXCJncmFkdWF0aW9uLWNhcFwiLCBcImhvbWVcIiwgXCJzaG9wcGluZy1jYXJ0XCIsIFwiaGVhcnRcIiwgXCJkcm9wbGV0XCIsIFwicGlsbFwiLFxuICBcImJlZFwiLCBcImNsb2NrXCIsIFwiY2FsZW5kYXJcIiwgXCJjaGVjay1jaGVja1wiLCBcImxpc3QtY2hlY2tzXCIsIFwidGFyZ2V0XCIsIFwiZmxhbWVcIiwgXCJ6YXBcIixcbiAgXCJzdGFyXCIsIFwic3BhcmtsZXNcIiwgXCJyb2NrZXRcIiwgXCJicnVzaFwiLCBcIm11c2ljXCIsIFwiZ2FtZXBhZC0yXCIsIFwiZG9nXCIsXG5dO1xuXG4vLyBTZXBhcmEgYXMgZXRpcXVldGFzIGlubGluZSAoQGV0aXF1ZXRhKSBkbyB0ZXh0byBkZSB1bWEgbGluaGEgZGUgdGFyZWZhLlxuLy8gRGV2b2x2ZSBvIHRcdTAwRUR0dWxvIGxpbXBvIChlc3RpbG8gUXVpY2sgQWRkIGRvIFRvZG9pc3QpICsgZXRpcXVldGFzIGNvbWJpbmFkYXNcbi8vIChhcyBkbyBwYWNvdGUgcHJpbWVpcm8sIGRlcG9pcyBhcyBpbmxpbmUsIHNlbSBkdXBsaWNhcikuXG5mdW5jdGlvbiBzcGxpdFRhc2tMYWJlbHMobGluZTogc3RyaW5nLCBwa2dMYWJlbHM6IHN0cmluZ1tdID0gW10pOiB7IHRpdGxlOiBzdHJpbmc7IGxhYmVsczogc3RyaW5nW107IHByaW9yaXR5OiBudW1iZXIgfSB7XG4gIGNvbnN0IGlubGluZTogc3RyaW5nW10gPSBbXTtcbiAgbGV0IHByaW9yaXR5ID0gMTsgICAvLyBBUEk6IDEgPSBwNCAocGFkclx1MDBFM28pIFx1MjAyNiA0ID0gcDFcbiAgLy8gU1x1MDBGMyBgQGV0aXF1ZXRhYCAvIGBwTmAgbm8gaW5cdTAwRURjaW8gb3UgZGVwb2lzIGRlIGVzcGFcdTAwRTdvIChsb29rYmVoaW5kKSBcdTIwMTQgblx1MDBFM28gcGVnYSBvIFwiQGdtYWlsXCJcbiAgLy8gZGUgdW0gZS1tYWlsIG5lbSBvIFwicDFcIiBkZSBcInRvcDFcIi5cbiAgY29uc3Qgc3RyaXBwZWQgPSBsaW5lXG4gICAgLnJlcGxhY2UoLyg/PD1efFxccylAKFtcXHB7TH1cXHB7Tn1fXSspL2d1LCAoX20sIG5hbWU6IHN0cmluZykgPT4geyBpbmxpbmUucHVzaChuYW1lKTsgcmV0dXJuIFwiXCI7IH0pXG4gICAgLnJlcGxhY2UoLyg/PD1efFxccylwKFsxLTRdKSg/PVxcc3wkKS9naSwgKF9tLCBkOiBzdHJpbmcpID0+IHsgcHJpb3JpdHkgPSA1IC0gTnVtYmVyKGQpOyByZXR1cm4gXCJcIjsgfSlcbiAgICAucmVwbGFjZSgvXFxzezIsfS9nLCBcIiBcIikudHJpbSgpO1xuICBjb25zdCB0aXRsZSA9IHN0cmlwcGVkIHx8IGxpbmUudHJpbSgpO1xuICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4ucGtnTGFiZWxzLCAuLi5pbmxpbmVdKV07XG4gIHJldHVybiB7IHRpdGxlLCBsYWJlbHMsIHByaW9yaXR5IH07XG59XG5cbi8vIEFjZXNzaWJpbGlkYWRlOiBmYXogdW0gZWxlbWVudG8gY2xpY1x1MDBFMXZlbCAoZGl2L3NwYW4pIHNlIGNvbXBvcnRhciBjb21vIGJvdFx1MDBFM28gXHUyMDE0XG4vLyBmb2NvIHBvciB0ZWNsYWRvIChUYWIpLCBwYXBlbCBBUklBIGUgYXRpdmFcdTAwRTdcdTAwRTNvIHBvciBFbnRlci9Fc3BhXHUwMEU3byAoZGlzcGFyYSBvIHByXHUwMEYzcHJpb1xuLy8gb25jbGljaykuIE8gbm9tZSBhY2Vzc1x1MDBFRHZlbCB2ZW0gZG8gdGV4dG8vYHRpdGxlYCBxdWUgbyBjaGFtYWRvciBqXHUwMEUxIGRlZmluZS5cbmZ1bmN0aW9uIGNsaWNrYWJsZTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KGVsOiBULCBoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCk6IFQge1xuICBlbC5vbmNsaWNrID0gaGFuZGxlcjtcbiAgZWwuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgZWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICBlbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikgeyBlLnByZXZlbnREZWZhdWx0KCk7IGVsLmNsaWNrKCk7IH1cbiAgfSk7XG4gIHJldHVybiBlbDtcbn1cblxuLy8gUG9wb3ZlciBmbHV0dWFudGUgZ2VuXHUwMEU5cmljbywgYW5jb3JhZG8gbnVtIGVsZW1lbnRvLiBgZmlsbChib2R5LCBjbG9zZSlgIG1vbnRhIG9cbi8vIGNvbnRlXHUwMEZBZG8uIEZlY2hhIGFvIGNsaWNhciBmb3JhIG91IEVzY2FwZSAob3B0cy5vbkNsb3NlIHJvZGEgYW50ZXMgZGUgcmVtb3ZlcikuXG5mdW5jdGlvbiBvcGVuUG9wb3ZlcihcbiAgYW5jaG9yOiBIVE1MRWxlbWVudCxcbiAgZmlsbDogKGJvZHk6IEhUTUxFbGVtZW50LCBjbG9zZTogKCkgPT4gdm9pZCkgPT4gdm9pZCxcbiAgb3B0czogeyBjbHM/OiBzdHJpbmc7IHdpZHRoPzogbnVtYmVyOyBvbkNsb3NlPzogKCkgPT4gdm9pZDsgY29udGFpbmVyPzogSFRNTEVsZW1lbnQgfSA9IHt9LFxuKTogKCkgPT4gdm9pZCB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2QtcG9wXCIpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgLy8gUG9yIHBhZHJcdTAwRTNvIHZpdmUgbm8gZG9jdW1lbnQuYm9keTsgZGVudHJvIGRhIG1vZGFsIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIHByZWNpc2Egdml2ZXIgbm9cbiAgLy8gY29udGFpbmVyIGRhIGFiYSAoc2VuXHUwMEUzbyBhIG1vZGFsIHByZW5kZSBvIGZvY28gZSBuXHUwMEUzbyBkXHUwMEUxIHBhcmEgZGlnaXRhciBubyB0ZXh0YXJlYSkuXG4gIGNvbnN0IHBvcCA9IChvcHRzLmNvbnRhaW5lciA/PyBkb2N1bWVudC5ib2R5KS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wXCIgKyAob3B0cy5jbHMgPyBcIiBcIiArIG9wdHMuY2xzIDogXCJcIikgfSk7XG4gIGlmIChvcHRzLndpZHRoKSBwb3Auc3R5bGUud2lkdGggPSBgJHtvcHRzLndpZHRofXB4YDtcblxuICBjb25zdCBvbkRvYyA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIE5vZGU7XG4gICAgaWYgKCFwb3AuY29udGFpbnModCkgJiYgdCAhPT0gYW5jaG9yICYmICFhbmNob3IuY29udGFpbnModCkpIGNsb3NlKCk7XG4gIH07XG4gIGNvbnN0IG9uS2V5ID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHsgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSBjbG9zZSgpOyB9O1xuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBvcHRzLm9uQ2xvc2U/LigpO1xuICAgIHBvcC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uRG9jLCB0cnVlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleSwgdHJ1ZSk7XG4gIH1cblxuICBmaWxsKHBvcCwgY2xvc2UpO1xuXG4gIGNvbnN0IHIgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHBvcC5zdHlsZS50b3AgPSBgJHtyLmJvdHRvbSArIDR9cHhgO1xuICBwb3Auc3R5bGUubGVmdCA9IGAke3IubGVmdH1weGA7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgY29uc3QgcHIgPSBwb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKHByLnJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBwb3Auc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIHdpbmRvdy5pbm5lcldpZHRoIC0gcHIud2lkdGggLSA4KX1weGA7XG4gICAgaWYgKHByLmJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHBvcC5zdHlsZS50b3AgPSBgJHtNYXRoLm1heCg4LCByLnRvcCAtIHByLmhlaWdodCAtIDQpfXB4YDtcbiAgfSk7XG5cbiAgLy8gUmVnaXN0cmEgZGVwb2lzIGRvIGNsaXF1ZSBkZSBhYmVydHVyYSBwYXJhIG5cdTAwRTNvIGZlY2hhciBpbWVkaWF0YW1lbnRlLlxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uRG9jLCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleSwgdHJ1ZSk7XG4gIH0sIDApO1xuICByZXR1cm4gY2xvc2U7XG59XG5cbi8vIFBvcG92ZXIgZGUgc2VsZVx1MDBFN1x1MDBFM28gZGUgXHUwMEVEY29uZSAocGFsZXRhKS4gYGN1cnJlbnRgID0gXHUwMEVEY29uZSBzZWxlY2lvbmFkbyAoZGVzdGFjYSkuXG5mdW5jdGlvbiBvcGVuSWNvblBvcG92ZXIoYW5jaG9yOiBIVE1MRWxlbWVudCwgY3VycmVudDogc3RyaW5nIHwgdW5kZWZpbmVkLCBvblBpY2s6IChpY29uOiBzdHJpbmcgfCB1bmRlZmluZWQpID0+IHZvaWQpIHtcbiAgb3BlblBvcG92ZXIoYW5jaG9yLCAocG9wLCBjbG9zZSkgPT4ge1xuICAgIGNvbnN0IG5vbmUgPSBwb3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbm9wdCB3ZC1wa2ctaWNvbm5vbmVcIiArICghY3VycmVudCA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIwMTRcIiB9KTtcbiAgICBub25lLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlNlbSBcdTAwRURjb25lXCIpO1xuICAgIGNsaWNrYWJsZShub25lLCAoKSA9PiB7IG9uUGljayh1bmRlZmluZWQpOyBjbG9zZSgpOyB9KTtcbiAgICBmb3IgKGNvbnN0IGljIG9mIFBLR19JQ09OUykge1xuICAgICAgY29uc3Qgb3B0ID0gcG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb25vcHRcIiArIChjdXJyZW50ID09PSBpYyA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgIHJlbmRlckljb24ob3B0LCBpYyk7XG4gICAgICBvcHQuc2V0QXR0cihcInRpdGxlXCIsIGljKTtcbiAgICAgIGNsaWNrYWJsZShvcHQsICgpID0+IHsgb25QaWNrKGljKTsgY2xvc2UoKTsgfSk7XG4gICAgfVxuICB9LCB7IGNsczogXCJ3ZC1pY29uLXBvcFwiIH0pO1xufVxuXG4vLyBCdXNjYSBhcyB0YXJlZmFzIGF0aXZhcyAoblx1MDBFM28gY29uY2x1XHUwMEVEZGFzKSB2aWEgQVBJIHVuaWZpY2FkYSB2MSAoYSBSRVNUIHYyIGZvaVxuLy8gYXBvc2VudGFkYSBcdTIxOTIgcmVzcG9uZGlhIDQxMCkuIEEgdjEgXHUwMEU5IHBhZ2luYWRhOiB7IHJlc3VsdHMsIG5leHRfY3Vyc29yIH0uXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RUYXNrW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIC8vIHYxIGVudmVsb3BhIGVtIHJlc3VsdHM7IHRvbGVyYSByZXNwb3N0YSBjb21vIGFycmF5IHB1cm8gcG9yIHNlZ3VyYW5cdTAwRTdhLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RUYXNrW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RQcm9qZWN0IHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vLyBCdXNjYSBvcyBwcm9qZXRvcyAocGFyYSBvIGZpbHRybykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYSBkYXMgdGFyZWZhcy5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RQcm9qZWN0W10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9wcm9qZWN0c1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0UHJvamVjdFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0UHJvamVjdFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0TGFiZWwge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gbm9tZSBkYSBwYWxldGEgKGV4LjogXCJjaGFyY29hbFwiKVxufVxuXG4vLyBCdXNjYSBhcyBldGlxdWV0YXMgcGVzc29haXMgKHBhcmEgY29sb3JpciBvcyBjaGlwcykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0TGFiZWxbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RMYWJlbFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9sYWJlbHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdExhYmVsW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RMYWJlbFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jdGhpbmcgKEFQSSBSRVNUKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFNURm9sZGVyIHsgaWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBwYXVzZWQ6IGJvb2xlYW4gfVxuaW50ZXJmYWNlIFNURGV2aWNlIHsgZGV2aWNlSUQ6IHN0cmluZzsgbmFtZTogc3RyaW5nIH1cbmludGVyZmFjZSBTVFN0YXR1cyB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZXJyb3JzOiBudW1iZXI7IHB1bGxFcnJvcnM6IG51bWJlciB9XG5pbnRlcmZhY2UgU1RDb21wbGV0aW9uIHsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXIgfVxuXG5pbnRlcmZhY2UgU3luY0RldlJvdyB7IG5hbWU6IHN0cmluZzsgb25saW5lOiBib29sZWFuOyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlcjsgbGFzdFNlZW46IHN0cmluZyB9XG5pbnRlcmZhY2UgU3luY0RhdGEgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGZvbGRlckxhYmVsOiBzdHJpbmc7IGVycm9yczogbnVtYmVyOyBkZXZpY2VzOiBTeW5jRGV2Um93W10gfVxuXG5mdW5jdGlvbiBodW1hbkJ5dGVzKG46IG51bWJlcik6IHN0cmluZyB7XG4gIGlmICghbikgcmV0dXJuIFwiMCBCXCI7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwNDg1NzYpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQobiA8IDEwMjQwID8gMSA6IDApfSBLQmA7XG4gIHJldHVybiBgJHsobiAvIDEwNDg1NzYpLnRvRml4ZWQobiA8IDEwNDg1NzYwID8gMSA6IDApfSBNQmA7XG59XG5cbmZ1bmN0aW9uIHJlbFRpbWUoaXNvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICBpZiAoaXNOYU4odCkgfHwgdCA8IDEpIHJldHVybiBcIlx1MjAxNFwiO1xuICBjb25zdCBzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIHQpIC8gMTAwMCk7XG4gIGlmIChzIDwgNjApIHJldHVybiBcImFnb3JhXCI7XG4gIGlmIChzIDwgMzYwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gNjApfSBtaW5gO1xuICBpZiAocyA8IDg2NDAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyAzNjAwKX0gaGA7XG4gIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDg2NDAwKX0gZGA7XG59XG5cbi8vIEdFVCBnZW5cdTAwRTlyaWNvIG5hIEFQSSBkbyBTeW5jdGhpbmcgKGhlYWRlciBYLUFQSS1LZXk7IHJlcXVlc3RVcmwgaWdub3JhIENPUlMpLlxuYXN5bmMgZnVuY3Rpb24gc3RHZXQ8VD4oYmFzZTogc3RyaW5nLCBrZXk6IHN0cmluZywgcGF0aDogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IHVybCA9IGJhc2UucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoeyB1cmwsIG1ldGhvZDogXCJHRVRcIiwgaGVhZGVyczogeyBcIlgtQVBJLUtleVwiOiBrZXkgfSwgdGhyb3c6IGZhbHNlIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwiQVBJIGtleSBpbnZcdTAwRTFsaWRhICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFQ7XG59XG5cbi8vIFVSTCBwYXJhIGFicmlyIGEgdGFyZWZhIG5vIFRvZG9pc3QgKHVzYSBhIGRvIHBheWxvYWQgb3UgbW9udGEgYSBwYXJ0aXIgZG8gaWQpLlxuZnVuY3Rpb24gdGFza1VybCh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gIHJldHVybiB0LnVybCA/PyBgaHR0cHM6Ly9hcHAudG9kb2lzdC5jb20vYXBwL3Rhc2svJHt0LmlkfWA7XG59XG5cbi8vIENvbmNsdWkgKGZlY2hhKSB1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFBPU1Qgc2VtIGNvcnBvOyAyMDQgPSBzdWNlc3NvLiBGYXNlIDguMi5cbmFzeW5jIGZ1bmN0aW9uIGNsb3NlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vY2xvc2VgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBFc2NyaXRhOiBjcmlhciAvIGVkaXRhciAvIG1vdmVyIC8gZXhjbHVpciAodjAuOC4wKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ2FtcG9zIGdyYXZcdTAwRTF2ZWlzLiBUb2RvcyBvcGNpb25haXMgXHUyMDE0IG5vIGVkaXRhciBtYW5kbyBzXHUwMEYzIG8gcXVlIG11ZG91LlxuaW50ZXJmYWNlIFRvZG9pc3RXcml0ZSB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eT86IG51bWJlcjsgICAgIC8vIDEuLjQgKDQgPSB1cmdlbnRlIC8gcDEgbmEgVUkpXG4gIGR1ZV9kYXRlPzogc3RyaW5nOyAgICAgLy8gZGF0YSBmaXhhIFlZWVktTU0tREQgKHZpbmRvIGRvIGNhbGVuZFx1MDBFMXJpbylcbiAgZHVlX3N0cmluZz86IHN0cmluZzsgICAvLyBsaW5ndWFnZW0gbmF0dXJhbDsgXCJubyBkYXRlXCIgbGltcGEgYSBkYXRhXG4gIGR1ZV9sYW5nPzogc3RyaW5nOyAgICAgLy8gXCJwdFwiIFx1MjE5MiBpbnRlcnByZXRhIGVtIHBvcnR1Z3VcdTAwRUFzXG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBqc29uSGVhZGVycyh0b2tlbjogc3RyaW5nKSB7XG4gIHJldHVybiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLCBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9O1xufVxuXG4vLyBDcmlhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzIFx1MjE5MiAyMDAgY29tIGEgdGFyZWZhIGNyaWFkYS5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTxUb2RvaXN0VGFzaz4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUb2RvaXN0VGFzaztcbn1cblxuLy8gRWRpdGEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3Mve2lkfSBcdTIxOTIgMjAwLiBOXHUwMEUzbyB0cm9jYSBkZSBwcm9qZXRvICh1c2UgbW92ZVRvZG9pc3RUYXNrKS5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIE1vdmUgYSB0YXJlZmEgcGFyYSBvdXRybyBwcm9qZXRvLiBQT1NUIC90YXNrcy97aWR9L21vdmUgXHUyMTkyIDIwMC5cbmFzeW5jIGZ1bmN0aW9uIG1vdmVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBwcm9qZWN0X2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L21vdmVgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcHJvamVjdF9pZCB9KSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBFeGNsdWkgYSB0YXJlZmEuIERFTEVURSAvdGFza3Mve2lkfSBcdTIxOTIgMjA0LlxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEdhbWlmaWNhXHUwMEU3XHUwMEUzbzogY29uY2x1XHUwMEVEZGFzICsgbG9nIG5vIGNvZnJlICsgY1x1MDBFMWxjdWxvICh2MC4xMykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIEJ1c2NhIGNvbmNsdVx1MDBFRGRhcyBwb3IgZGF0YSBkZSBjb25jbHVzXHUwMEUzby4gQVBJIHYxOiB7IGl0ZW1zLCBuZXh0X2N1cnNvciB9LCBwYWdpbmFkYS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoQ29tcGxldGVkVGFza3ModG9rZW46IHN0cmluZywgc2luY2U6IHN0cmluZywgdW50aWw6IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFRhc2tbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBwYWdlcyA9IDA7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzL2NvbXBsZXRlZC9ieV9jb21wbGV0aW9uX2RhdGVcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJzaW5jZVwiLCBzaW5jZSk7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJ1bnRpbFwiLCB1bnRpbCk7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyBpdGVtcz86IFRvZG9pc3RUYXNrW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGFsbC5wdXNoKC4uLihkYXRhLml0ZW1zID8/IFtdKSk7XG4gICAgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsO1xuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuLy8gVW0gZXZlbnRvIGRvIGxvZyBkZSBnYW1pZmljYVx1MDBFN1x1MDBFM28gKHRhcmVmYSBmZWl0YSA9ICtYUDsgblx1MDBFM28tZmVpdGEgPSBcdTIyMTJYUCkuXG50eXBlIEdhbWVFdmVudFR5cGUgPSBcImZlaXRvXCIgfCBcIm5hby1mZWl0b1wiO1xuaW50ZXJmYWNlIEdhbWVFdmVudCB7XG4gIGRhdGU6IHN0cmluZzsgICAgIC8vIFlZWVktTU0tREQgKGRpYSBsb2NhbCBkYSBjb25jbHVzXHUwMEUzby9tYXJjYVx1MDBFN1x1MDBFM28pXG4gIHR5cGU6IEdhbWVFdmVudFR5cGU7XG4gIHhwOiBudW1iZXI7ICAgICAgIC8vIGFzc2luYWRvXG4gIGtleTogc3RyaW5nOyAgICAgIC8vIGlkZW1wb3RcdTAwRUFuY2lhOiBgJHt0YXNrSWR9fCR7Y29tcGxldGVkX2F0fHRzfWBcbiAgY29udGVudDogc3RyaW5nO1xuICBwcm9qZWN0OiBzdHJpbmc7ICAvLyBub21lIGRvIHByb2pldG8gKG91IGlkIHNlIGRlc2NvbmhlY2lkbylcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbn1cblxuaW50ZXJmYWNlIEdhbWVTdGF0cyB7XG4gIHRvdGFsWHA6IG51bWJlcjtcbiAgbGV2ZWw6IG51bWJlcjtcbiAgeHBJbnRvTGV2ZWw6IG51bWJlcjtcbiAgeHBGb3JOZXh0OiBudW1iZXI7XG4gIHN0cmVha0N1cnJlbnQ6IG51bWJlcjtcbiAgc3RyZWFrQmVzdDogbnVtYmVyO1xuICB0b2RheVhwOiBudW1iZXI7XG4gIHRvZGF5Q291bnQ6IG51bWJlcjtcbiAgYnlEYXk6IE1hcDxzdHJpbmcsIHsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlciB9PjtcbiAgYnlQcm9qZWN0OiBNYXA8c3RyaW5nLCBudW1iZXI+OyAgIC8vIHNcdTAwRjMgXCJmZWl0b1wiXG4gIGJ5TGFiZWw6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAvLyBzXHUwMEYzIFwiZmVpdG9cIlxufVxuXG5mdW5jdGlvbiBnYW1lTGV2ZWwoeHA6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiB4cCA8PSAwID8gMCA6IE1hdGguZmxvb3IoTWF0aC5zcXJ0KHhwIC8gMTAwKSk7XG59XG4vLyBOXHUwMEVEdmVsICsgcHJvZ3Jlc3NvIHBhcmEgdW0gdG90YWwgZGUgWFAgKGdlcmFsIG91IHBvciBlc2NvcG8pLiBYUCBwLyBuXHUwMEVEdmVsIEwgPSAxMDBcdTAwQjdMXHUwMEIyLlxuZnVuY3Rpb24gbGV2ZWxJbmZvKHhwOiBudW1iZXIpOiB7IGxldmVsOiBudW1iZXI7IGludG86IG51bWJlcjsgZm9yTmV4dDogbnVtYmVyOyBwY3Q6IG51bWJlciB9IHtcbiAgY29uc3QgbGV2ZWwgPSBnYW1lTGV2ZWwoeHApO1xuICBjb25zdCBpbnRvID0gTWF0aC5tYXgoMCwgeHApIC0gMTAwICogbGV2ZWwgKiBsZXZlbDtcbiAgY29uc3QgZm9yTmV4dCA9IDEwMCAqICgyICogbGV2ZWwgKyAxKTtcbiAgcmV0dXJuIHsgbGV2ZWwsIGludG8sIGZvck5leHQsIHBjdDogZm9yTmV4dCA/IE1hdGgubWluKDEwMCwgTWF0aC5yb3VuZChpbnRvIC8gZm9yTmV4dCAqIDEwMCkpIDogMCB9O1xufVxuXG4vLyBDYW1wb3Mgc2VwYXJhZG9zIHBvciBUQUIgKHJvYnVzdG86IGNvbnRlXHUwMEZBZG8vY2hhdmUgblx1MDBFM28gY29udFx1MDBFQW0gdGFiOyBhIGNoYXZlIHBvZGVcbi8vIGNvbnRlciBcInxcIiBzZW0gY29saWRpcikuIFRhYnMvcXVlYnJhcyBubyB0ZXh0byBzXHUwMEUzbyBuZXV0cmFsaXphZG9zLlxuZnVuY3Rpb24gZXNjYXBlR2FtZUZpZWxkKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1tcXHJcXG5cXHRdKy9nLCBcIiBcIik7XG59XG5mdW5jdGlvbiBzZXJpYWxpemVHYW1lRXZlbnQoZTogR2FtZUV2ZW50KTogc3RyaW5nIHtcbiAgY29uc3QgbGFiZWxzID0gZS5sYWJlbHMubWFwKGwgPT4gZXNjYXBlR2FtZUZpZWxkKGwpLnJlcGxhY2UoLywvZywgXCIgXCIpKS5qb2luKFwiLFwiKTtcbiAgcmV0dXJuIFtlLmRhdGUsIGUudHlwZSwgU3RyaW5nKGUueHApLCBlLmtleSwgZXNjYXBlR2FtZUZpZWxkKGUuY29udGVudCksIGVzY2FwZUdhbWVGaWVsZChlLnByb2plY3QpLCBsYWJlbHNdLmpvaW4oXCJcXHRcIik7XG59XG5mdW5jdGlvbiBwYXJzZUdhbWVFdmVudExpbmUobGluZTogc3RyaW5nKTogR2FtZUV2ZW50IHwgbnVsbCB7XG4gIGNvbnN0IHAgPSBsaW5lLnNwbGl0KFwiXFx0XCIpLm1hcChzID0+IHMudHJpbSgpKTtcbiAgaWYgKHAubGVuZ3RoIDwgNCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IFtkYXRlLCB0eXBlLCB4cFJhdywga2V5LCBjb250ZW50ID0gXCJcIiwgcHJvamVjdCA9IFwiXCIsIGxhYmVsc1JhdyA9IFwiXCJdID0gcDtcbiAgaWYgKCEvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChkYXRlKSkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlICE9PSBcImZlaXRvXCIgJiYgdHlwZSAhPT0gXCJuYW8tZmVpdG9cIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHhwID0gTnVtYmVyKHhwUmF3KTtcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoeHApIHx8ICFrZXkpIHJldHVybiBudWxsO1xuICBjb25zdCBsYWJlbHMgPSBsYWJlbHNSYXcgPyBsYWJlbHNSYXcuc3BsaXQoXCIsXCIpLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXTtcbiAgcmV0dXJuIHsgZGF0ZSwgdHlwZSwgeHAsIGtleSwgY29udGVudCwgcHJvamVjdCwgbGFiZWxzIH07XG59XG4vLyBFeHRyYWkgb3MgZXZlbnRvcyBkbyBibG9jbyBjZXJjYWRvIGBgYHdkLWdhbWUtbG9nIFx1MjAyNiBgYGAgZGEgbm90YS5cbmZ1bmN0aW9uIHBhcnNlR2FtZUxvZyhjb250ZW50OiBzdHJpbmcpOiBHYW1lRXZlbnRbXSB7XG4gIGNvbnN0IG0gPSBjb250ZW50Lm1hdGNoKG5ldyBSZWdFeHAoXCJgYGBcIiArIEdBTUVfTE9HX0ZFTkNFICsgXCJcXFxccj9cXFxcbihbXFxcXHNcXFxcU10qPylgYGBcIikpO1xuICBpZiAoIW0pIHJldHVybiBbXTtcbiAgY29uc3Qgb3V0OiBHYW1lRXZlbnRbXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiBtWzFdLnNwbGl0KFwiXFxuXCIpKSB7XG4gICAgY29uc3QgZXYgPSBwYXJzZUdhbWVFdmVudExpbmUocmF3LnRyaW0oKSk7XG4gICAgaWYgKGV2KSBvdXQucHVzaChldik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbi8vIENvbnRlXHUwMEZBZG8gY29tcGxldG8gZGEgbm90YSAoZGV0ZXJtaW5cdTAwRURzdGljbzogZXZlbnRvcyBvcmRlbmFkb3MgXHUyMTkyIG1lc21vcyBldmVudG9zID1cbi8vIG1lc21vIGFycXVpdm8gZW0gcXVhbHF1ZXIgZGlzcG9zaXRpdm8sIGV2aXRhbmRvIGNvbmZsaXRvIGRlIFN5bmN0aGluZykuXG5mdW5jdGlvbiBidWlsZEdhbWVMb2dDb250ZW50KGV2ZW50czogR2FtZUV2ZW50W10pOiBzdHJpbmcge1xuICBjb25zdCBzb3J0ZWQgPSBbLi4uZXZlbnRzXS5zb3J0KChhLCBiKSA9PlxuICAgIGEuZGF0ZSA8IGIuZGF0ZSA/IC0xIDogYS5kYXRlID4gYi5kYXRlID8gMSA6IGEua2V5IDwgYi5rZXkgPyAtMSA6IGEua2V5ID4gYi5rZXkgPyAxIDogMCk7XG4gIHJldHVybiBbXG4gICAgXCItLS1cIiwgXCJvd25lcjogV2VydXNcIiwgXCJwZXJtaXNzaW9uczpcIiwgXCIgIHJlYWQ6IFthbGxdXCIsIFwiICB3cml0ZTpcIiwgXCIgICAgLSBXZXJ1c1wiLCBcIiAgICAtIENsYXVkZVwiLFxuICAgIFwicmV2aWV3ZWQ6IGZhbHNlXCIsIFwidHlwZTogcmVmZXJlbmNlXCIsIFwidGFnczogW2dhbWlmaWNhY2FvXVwiLCBcIi0tLVwiLCBcIlwiLFxuICAgIFwiIyBHYW1pZmljYVx1MDBFN1x1MDBFM28gXHUyMDE0IExvZyBkZSBYUFwiLCBcIlwiLFxuICAgIFwiPiBBcnF1aXZvICoqZ2VyaWRvIHBlbG8gcGx1Z2luIFdlcnVzIERhc2hib2FyZCoqLiBDYWRhIGxpbmhhIGRvIGJsb2NvIGFiYWl4byBcdTAwRTkgdW0gZXZlbnRvXCIsXG4gICAgXCI+ICh0YXJlZmEgZmVpdGEgPSBYUCBwb3NpdGl2bywgblx1MDBFM28gZmVpdGEgPSBYUCBuZWdhdGl2bykuIE5cdTAwRTNvIGVkaXRlIFx1MDBFMCBtXHUwMEUzbyBcdTIwMTQgbyBwYWluZWwgZG9cIixcbiAgICBcIj4gcGx1Z2luIG1vc3RyYSBuXHUwMEVEdmVsLCBzdHJlYWsgZSBlc3RhdFx1MDBFRHN0aWNhcyBhIHBhcnRpciBkYXF1aS5cIiwgXCJcIixcbiAgICBcImBgYFwiICsgR0FNRV9MT0dfRkVOQ0UsXG4gICAgc29ydGVkLm1hcChzZXJpYWxpemVHYW1lRXZlbnQpLmpvaW4oXCJcXG5cIiksXG4gICAgXCJgYGBcIiwgXCJcIixcbiAgXS5qb2luKFwiXFxuXCIpO1xufVxuXG4vLyBTdHJlYWsgYXR1YWwgKGF0XHUwMEU5IGhvamUvb250ZW0pICsgcmVjb3JkZSwgYSBwYXJ0aXIgZG9zIGRpYXMgY29tIFx1MjI2NTEgXCJmZWl0b1wiLlxuZnVuY3Rpb24gY29tcHV0ZVN0cmVhayhkb25lRGF5czogU2V0PHN0cmluZz4pOiB7IHN0cmVha0N1cnJlbnQ6IG51bWJlcjsgc3RyZWFrQmVzdDogbnVtYmVyIH0ge1xuICBpZiAoIWRvbmVEYXlzLnNpemUpIHJldHVybiB7IHN0cmVha0N1cnJlbnQ6IDAsIHN0cmVha0Jlc3Q6IDAgfTtcbiAgY29uc3QgZGF5TXMgPSA4NjQwMDAwMDtcbiAgY29uc3Qgc29ydGVkID0gWy4uLmRvbmVEYXlzXS5zb3J0KCk7XG4gIGxldCBiZXN0ID0gMSwgcnVuID0gMTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoRGF0ZS5wYXJzZShzb3J0ZWRbaV0gKyBcIlQwMDowMDowMFwiKSAtIERhdGUucGFyc2Uoc29ydGVkW2kgLSAxXSArIFwiVDAwOjAwOjAwXCIpID09PSBkYXlNcykge1xuICAgICAgcnVuKys7IGJlc3QgPSBNYXRoLm1heChiZXN0LCBydW4pO1xuICAgIH0gZWxzZSBydW4gPSAxO1xuICB9XG4gIGxldCBjdXIgPSAwO1xuICBsZXQgY3Vyc29yID0gbmV3IERhdGUoKTsgY3Vyc29yLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICBpZiAoIWRvbmVEYXlzLmhhcyh0b0tleShjdXJzb3IpKSkgY3Vyc29yID0gbmV3IERhdGUoY3Vyc29yLmdldFRpbWUoKSAtIGRheU1zKTtcbiAgd2hpbGUgKGRvbmVEYXlzLmhhcyh0b0tleShjdXJzb3IpKSkgeyBjdXIrKzsgY3Vyc29yID0gbmV3IERhdGUoY3Vyc29yLmdldFRpbWUoKSAtIGRheU1zKTsgfVxuICByZXR1cm4geyBzdHJlYWtDdXJyZW50OiBjdXIsIHN0cmVha0Jlc3Q6IE1hdGgubWF4KGJlc3QsIGN1cikgfTtcbn1cblxuLy8gRXN0YXRcdTAwRURzdGljYXMgYSBwYXJ0aXIgZG9zIGV2ZW50b3MgZG8gbG9nIChmb250ZSBjYW5cdTAwRjRuaWNhKS5cbmZ1bmN0aW9uIGNvbXB1dGVHYW1lU3RhdHMoZXZlbnRzOiBHYW1lRXZlbnRbXSk6IEdhbWVTdGF0cyB7XG4gIGNvbnN0IGJ5RGF5ID0gbmV3IE1hcDxzdHJpbmcsIHsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlciB9PigpO1xuICBjb25zdCBieVByb2plY3QgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBjb25zdCBieUxhYmVsID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgbGV0IHRvdGFsWHAgPSAwO1xuICBmb3IgKGNvbnN0IGUgb2YgZXZlbnRzKSB7XG4gICAgdG90YWxYcCArPSBlLnhwO1xuICAgIGNvbnN0IGQgPSBieURheS5nZXQoZS5kYXRlKSA/PyB7IHhwOiAwLCBjb3VudDogMCB9O1xuICAgIGQueHAgKz0gZS54cDtcbiAgICBpZiAoZS50eXBlID09PSBcImZlaXRvXCIpIGQuY291bnQgKz0gMTtcbiAgICBieURheS5zZXQoZS5kYXRlLCBkKTtcbiAgICBpZiAoZS50eXBlID09PSBcImZlaXRvXCIpIHtcbiAgICAgIGNvbnN0IHByb2ogPSBlLnByb2plY3QgfHwgXCJcdTIwMTRcIjtcbiAgICAgIGJ5UHJvamVjdC5zZXQocHJvaiwgKGJ5UHJvamVjdC5nZXQocHJvaikgPz8gMCkgKyBlLnhwKTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBlLmxhYmVscykgYnlMYWJlbC5zZXQobCwgKGJ5TGFiZWwuZ2V0KGwpID8/IDApICsgZS54cCk7XG4gICAgfVxuICB9XG4gIGlmICh0b3RhbFhwIDwgMCkgdG90YWxYcCA9IDA7XG4gIGNvbnN0IGxldmVsID0gZ2FtZUxldmVsKHRvdGFsWHApO1xuICBjb25zdCBkb25lRGF5cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGUgb2YgZXZlbnRzKSBpZiAoZS50eXBlID09PSBcImZlaXRvXCIpIGRvbmVEYXlzLmFkZChlLmRhdGUpO1xuICBjb25zdCB7IHN0cmVha0N1cnJlbnQsIHN0cmVha0Jlc3QgfSA9IGNvbXB1dGVTdHJlYWsoZG9uZURheXMpO1xuICBjb25zdCB0b2RheSA9IGJ5RGF5LmdldCh0b0tleShuZXcgRGF0ZSgpKSkgPz8geyB4cDogMCwgY291bnQ6IDAgfTtcbiAgcmV0dXJuIHtcbiAgICB0b3RhbFhwLCBsZXZlbCxcbiAgICB4cEludG9MZXZlbDogdG90YWxYcCAtIDEwMCAqIGxldmVsICogbGV2ZWwsXG4gICAgeHBGb3JOZXh0OiAxMDAgKiAoMiAqIGxldmVsICsgMSksXG4gICAgc3RyZWFrQ3VycmVudCwgc3RyZWFrQmVzdCxcbiAgICB0b2RheVhwOiB0b2RheS54cCwgdG9kYXlDb3VudDogdG9kYXkuY291bnQsXG4gICAgYnlEYXksIGJ5UHJvamVjdCwgYnlMYWJlbCxcbiAgfTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG4vLyAobWQvaW1nIGRhIHN1Ylx1MDBFMXJ2b3JlIHZcdTAwRUFtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlLilcbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG4vLyBBZ3JlZ2FkbyBkZSB1cmdcdTAwRUFuY2lhIGRlIHVtYSBzdWJcdTAwRTFydm9yZSAodmVtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlKS5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFVNQSBwYXNzYWRhIChERlMpIG1vbnRhIG9zIGFncmVnYWRvcyBwb3IgcGFzdGEgKHN1Ylx1MDBFMXJ2b3JlKSArIG9zIGdsb2JhaXMgcXVlXG4vLyB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIGNvbnNvbWVtIFx1MjAxNCBhbnRlcyBjYWRhIHNlXHUwMEU3XHUwMEUzbyB2YXJyaWEgbyBjb2ZyZSBwb3IgY29udGEgcHJcdTAwRjNwcmlhXG4vLyAofjhcdTIwMTMxMFx1MDBENyBwb3IgcmVuZGVyKS4gSW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdCBlIHJlY3JpYWRvIHNvYiBkZW1hbmRhLlxuaW50ZXJmYWNlIEZvbGRlckFnZyB7XG4gIG1kOiBudW1iZXI7ICAgICAgICAgIC8vIG5vdGFzIC5tZCAoZXhjZXRvIHN0YXR1cy5tZCkgbmEgc3ViXHUwMEUxcnZvcmVcbiAgaW1nOiBudW1iZXI7ICAgICAgICAgLy8gaW1hZ2VucyBuYSBzdWJcdTAwRTFydm9yZVxuICByZXZpZXdlZDogbnVtYmVyOyAgICAvLyAubWQgY29tIHJldmlld2VkOnRydWUgbmEgc3ViXHUwMEUxcnZvcmVcbiAgdXJnZW5jeTogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyAgIC8vIG5vdGFzIGNvbSB1cmdlbmN5IChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYylcbiAgdXJnZW5jeU1heDogVXJnZW5jeSB8IG51bGw7XG4gIHJlY2VudDogVEZpbGVbXTsgICAgIC8vIGF0XHUwMEU5IDQgbm90YXMgLm1kIG1haXMgcmVjZW50ZXMgKG10aW1lKSBkYSBzdWJcdTAwRTFydm9yZVxufVxuaW50ZXJmYWNlIFZhdWx0Q2FjaGUge1xuICBieUZvbGRlcjogTWFwPHN0cmluZywgRm9sZGVyQWdnPjsgICAgICAgICAgICAgIC8vIHBhdGggZGEgcGFzdGEgXHUyMTkyIGFncmVnYWRvc1xuICBkYXRlZE5vdGVzOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdOyAgIC8vIG5vdGFzIGNvbSBkYXRhIChmcm9udG1hdHRlciBkYXRlOiBvdSBub21lIEFBQUEtTU0tREQpXG4gIGN0aW1lQnlEYXk6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAgICAgICAgICAgLy8gQUFBQS1NTS1ERCBcdTIxOTIgblx1MDBCQSBkZSBub3RhcyBjcmlhZGFzIChjdGltZSlcbiAgdG90YWxOb3RlczogbnVtYmVyO1xuICB0b3RhbFJldmlld2VkOiBudW1iZXI7XG59XG5jb25zdCBFTVBUWV9BR0c6IEZvbGRlckFnZyA9IHsgbWQ6IDAsIGltZzogMCwgcmV2aWV3ZWQ6IDAsIHVyZ2VuY3k6IFtdLCB1cmdlbmN5TWF4OiBudWxsLCByZWNlbnQ6IFtdIH07XG5cbmZ1bmN0aW9uIGJ1aWxkVmF1bHRDYWNoZShhcHA6IEFwcCk6IFZhdWx0Q2FjaGUge1xuICBjb25zdCBieUZvbGRlciA9IG5ldyBNYXA8c3RyaW5nLCBGb2xkZXJBZ2c+KCk7XG4gIGNvbnN0IGRhdGVkTm90ZXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgY29uc3QgY3RpbWVCeURheSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDA7XG5cbiAgY29uc3Qgd2FsayA9IChmb2xkZXI6IFRGb2xkZXIpOiBGb2xkZXJBZ2cgPT4ge1xuICAgIGNvbnN0IGFnZzogRm9sZGVyQWdnID0geyBtZDogMCwgaW1nOiAwLCByZXZpZXdlZDogMCwgdXJnZW5jeTogW10sIHVyZ2VuY3lNYXg6IG51bGwsIHJlY2VudDogW10gfTtcbiAgICBjb25zdCByZWNlbnQ6IFRGaWxlW10gPSBbXTsgICAvLyBjYW5kaWRhdG9zOiBhcnF1aXZvcyBwclx1MDBGM3ByaW9zICsgdG9wLTQgZGUgY2FkYSBmaWxob1xuICAgIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICBjb25zdCBzdWIgPSB3YWxrKGMpO1xuICAgICAgICBhZ2cubWQgKz0gc3ViLm1kOyBhZ2cuaW1nICs9IHN1Yi5pbWc7IGFnZy5yZXZpZXdlZCArPSBzdWIucmV2aWV3ZWQ7XG4gICAgICAgIGlmIChzdWIudXJnZW5jeS5sZW5ndGgpIGFnZy51cmdlbmN5LnB1c2goLi4uc3ViLnVyZ2VuY3kpO1xuICAgICAgICBpZiAoc3ViLnJlY2VudC5sZW5ndGgpIHJlY2VudC5wdXNoKC4uLnN1Yi5yZWNlbnQpO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgICAgYWdnLm1kKys7XG4gICAgICAgICAgcmVjZW50LnB1c2goYyk7XG4gICAgICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgICAgIGNvbnN0IGZtID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgaWYgKGZtPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgeyBhZ2cucmV2aWV3ZWQrKzsgdG90YWxSZXZpZXdlZCsrOyB9XG4gICAgICAgICAgY29uc3QgdSA9IGZtPy51cmdlbmN5O1xuICAgICAgICAgIGlmICh1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiKSBhZ2cudXJnZW5jeS5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICAgICAgY29uc3QgY2sgPSB0b0tleShuZXcgRGF0ZShjLnN0YXQuY3RpbWUpKTtcbiAgICAgICAgICBjdGltZUJ5RGF5LnNldChjaywgKGN0aW1lQnlEYXkuZ2V0KGNrKSA/PyAwKSArIDEpO1xuICAgICAgICAgIGNvbnN0IG0gPSBjLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKGZtPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgICAgICBpZiAoZCkgZGF0ZWROb3Rlcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGFnZy5pbWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWNlbnQuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgICBhZ2cucmVjZW50ID0gcmVjZW50LnNsaWNlKDAsIDQpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgYWdnLnVyZ2VuY3kpXG4gICAgICBpZiAoIWFnZy51cmdlbmN5TWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbYWdnLnVyZ2VuY3lNYXhdKSBhZ2cudXJnZW5jeU1heCA9IGl0LmxldmVsO1xuICAgIGFnZy51cmdlbmN5LnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gICAgYnlGb2xkZXIuc2V0KGZvbGRlci5wYXRoLCBhZ2cpO1xuICAgIHJldHVybiBhZ2c7XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiB7IGJ5Rm9sZGVyLCBkYXRlZE5vdGVzLCBjdGltZUJ5RGF5LCB0b3RhbE5vdGVzLCB0b3RhbFJldmlld2VkIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBcdTI1MDBcdTI1MDAgQ29udHJvbGFkb3IgZG8gVG9kb2lzdCAoY29tcGFydGlsaGFkbzogZGFzaGJvYXJkICsgYWJhIGRlZGljYWRhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERldFx1MDBFOW0gbyBlc3RhZG8gZGFzIHRhcmVmYXMsIGEgYnVzY2EsIGEgcmVuZGVyaXphXHUwMEU3XHUwMEUzbyBkYSBsaXN0YSBlIGFzIGFcdTAwRTdcdTAwRjVlc1xuLy8gKGNyaWFyL2VkaXRhci9jb25jbHVpci9leGNsdWlyKS4gYHJlcmVuZGVyYCBcdTAwRTkgbyBjYWxsYmFjayBkYSB2aWV3IGRvbmEgKHJlLXJlbmRlclxuLy8gY29tcGxldG8pLiBUZW0gdG9vbHRpcCBwclx1MDBGM3ByaW8gcGFyYSBuXHUwMEUzbyBkZXBlbmRlciBkYSB2aWV3LlxuY2xhc3MgVG9kb2lzdENvbnRyb2xsZXIge1xuICBwcml2YXRlIHRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIGxhYmVsQ29sb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSBsb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgbGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgbm9EYXRlT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge1xuICAgIHRoaXMubG9hZENhY2hlKCk7ICAgLy8gbW9zdHJhIG8gXHUwMEZBbHRpbW8gcmVzdWx0YWRvIG5hIGhvcmEgKG9mZmxpbmUpLCBhbnRlcyBkbyAxXHUwMEJBIGZldGNoXG4gIH1cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgLy8gTm9tZSBkbyBwcm9qZXRvIHBlbG8gaWQgKHJldXNhZG8gcGVsYSBHYW1pZmljYVx1MDBFN1x1MDBFM28pLiBWYXppbyBzZSBkZXNjb25oZWNpZG8uXG4gIHByb2plY3ROYW1lKGlkPzogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIChpZCAmJiB0aGlzLnByb2plY3RNYXAuZ2V0KGlkKSkgfHwgXCJcIjsgfVxuXG4gIHByaXZhdGUgZGF5UmFuZ2UoKTogMyB8IDcge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPT09IDMgPyAzIDogNztcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlGaWx0ZXJzKHRhc2tzOiBUb2RvaXN0VGFza1tdKTogVG9kb2lzdFRhc2tbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIGlmICghZi5wcm9qZWN0cy5sZW5ndGggJiYgIWYubGFiZWxzLmxlbmd0aCkgcmV0dXJuIHRhc2tzO1xuICAgIGNvbnN0IHBzID0gbmV3IFNldChmLnByb2plY3RzKSwgbHMgPSBuZXcgU2V0KGYubGFiZWxzKTtcbiAgICByZXR1cm4gdGFza3MuZmlsdGVyKHQgPT4ge1xuICAgICAgaWYgKHBzLnNpemUgJiYgISh0LnByb2plY3RfaWQgJiYgcHMuaGFzKHQucHJvamVjdF9pZCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAobHMuc2l6ZSAmJiAhKHQubGFiZWxzID8/IFtdKS5zb21lKGwgPT4gbHMuaGFzKGwpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUZpbHRlcihraW5kOiBcInByb2plY3RzXCIgfCBcImxhYmVsc1wiLCBpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnNba2luZF07XG4gICAgY29uc3QgaSA9IGFyci5pbmRleE9mKGlkKTtcbiAgICBpZiAoaSA+PSAwKSBhcnIuc3BsaWNlKGksIDEpOyBlbHNlIGFyci5wdXNoKGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgbGFiZWxDb2xvcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxhYmVsQ29sb3JzLmdldChuYW1lKSA/PyBMQUJFTF9GQUxMQkFDSztcbiAgfVxuXG4gIHByaXZhdGUgbGFiZWxDaGlwKGhvc3Q6IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGNsczogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGNoaXAgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHMgfSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmxhYmVsQ29sb3IobmFtZSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke25hbWV9YCB9KTtcbiAgICByZXR1cm4gY2hpcDtcbiAgfVxuXG4gIHByaXZhdGUgcG9zaXRpb25UaXAodGlwOiBIVE1MRWxlbWVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdHcgPSB0aXAub2Zmc2V0V2lkdGgsIHRoID0gdGlwLm9mZnNldEhlaWdodDtcbiAgICBsZXQgbGVmdCA9IHJlY3QubGVmdDtcbiAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyA2O1xuICAgIGlmIChsZWZ0ICsgdHcgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHR3IC0gODtcbiAgICBpZiAodG9wICsgdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSB0b3AgPSByZWN0LnRvcCAtIHRoIC0gNjtcbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93VGFza1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdGFzay10aXBcIiB9KTtcbiAgICBjb25zdCBoZWFkID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXByaVwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmlNZXRhKHQucHJpb3JpdHkpLmNvbG9yO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC10aXRsZVwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGQgPSB0LmRlc2NyaXB0aW9uIS50cmltKCk7XG4gICAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWRlc2NcIiwgdGV4dDogZC5sZW5ndGggPiBERVNDX01BWCA/IGQuc2xpY2UoMCwgREVTQ19NQVgpICsgXCJcdTIwMjZcIiA6IGQgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hUYXNrVGlwKGVsOiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUYXNrVGlwKGVsLCB0KSk7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2RvQ2hlY2soaG9zdDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgY2hlY2sgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1jaGVja1wiIH0pO1xuICAgIGNoZWNrLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbmNsdWlyIHRhcmVmYVwiKTtcbiAgICBjbGlja2FibGUoY2hlY2ssIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuY29tcGxldGVUYXNrKHQpOyB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9kb1JvdyhsaXN0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2ssIHNob3dEYXRlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yb3dcIiB9KTtcbiAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBwcmkuY29sb3IpO1xuICAgIHRoaXMudG9kb0NoZWNrKHJvdywgdCk7XG4gICAgY29uc3QgdGFnID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pO1xuICAgIHRhZy5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LXR4dFwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHNldEljb24ocm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1oYXNkZXNjXCIgfSksIFwiYWxpZ24tbGVmdFwiKTtcbiAgICBjb25zdCBwcm9qID0gdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkKSB7XG4gICAgICBjb25zdCB4ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby11bmRvbmVcIiB9KTtcbiAgICAgIHNldEljb24oeCwgXCJ4XCIpO1xuICAgICAgeC5zZXRBdHRyKFwidGl0bGVcIiwgXCJOXHUwMEUzbyBmZWl0YSBcdTIwMTQgcHVuaVx1MDBFN1x1MDBFM28gZGUgWFAgZSBhcGFnYSBkbyBUb2RvaXN0XCIpO1xuICAgICAgY2xpY2thYmxlKHgsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMucGx1Z2luLmdhbWUubWFya1VuZG9uZSh0KTsgfSk7XG4gICAgfVxuICAgIGNsaWNrYWJsZShyb3csICgpID0+IHRoaXMub3BlblRhc2tEZXRhaWwodCkpO1xuICAgIHRoaXMuYXR0YWNoVGFza1RpcChyb3csIHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUYXNrQnRuKGhvc3Q6IEhUTUxFbGVtZW50LCBwcmVmaWxsRHVlPzogc3RyaW5nLCB0aXRsZSA9IFwiTm92YSB0YXJlZmFcIikge1xuICAgIGNvbnN0IGIgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1hZGRcIiB9KTtcbiAgICBzZXRJY29uKGIsIFwicGx1c1wiKTtcbiAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgY2xpY2thYmxlKGIsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH0pO1xuICAgIHJldHVybiBiO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuVGFza0Zvcm0ob3B0czogeyBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7IHRhc2s/OiBUb2RvaXN0VGFzazsgcHJlZmlsbER1ZT86IHN0cmluZyB9KSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLnRoaXMubGFiZWxDb2xvcnMua2V5cygpLCAuLi50aGlzLnRhc2tzLmZsYXRNYXAodCA9PiB0LmxhYmVscyA/PyBbXSldKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBuZXcgVGFza0Zvcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgbW9kZTogb3B0cy5tb2RlLFxuICAgICAgdGFzazogb3B0cy50YXNrLFxuICAgICAgcHJlZmlsbER1ZTogb3B0cy5wcmVmaWxsRHVlLFxuICAgICAgcHJvamVjdHM6IHRoaXMucHJvamVjdHMsXG4gICAgICBsYWJlbHMsXG4gICAgICBsYWJlbENvbG9yOiBuID0+IHRoaXMubGFiZWxDb2xvcihuKSxcbiAgICAgIHN1Ym1pdDogdiA9PiB0aGlzLnN1Ym1pdFRhc2tGb3JtKG9wdHMubW9kZSwgb3B0cy50YXNrLCB2KSxcbiAgICAgIHJlbW92ZTogb3B0cy50YXNrID8gKCkgPT4gdGhpcy5kZWxldGVUYXNrKG9wdHMudGFzayEpIDogdW5kZWZpbmVkLFxuICAgICAgY29tcGxldGU6IG9wdHMudGFzayA/ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuVGFza0RldGFpbCh0OiBUb2RvaXN0VGFzaykge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIG5ldyBUYXNrRGV0YWlsTW9kYWwodGhpcy5hcHAsIHRoaXMuY29tcG9uZW50LCB7XG4gICAgICB0YXNrOiB0LFxuICAgICAgcHJvamVjdE5hbWU6IHQucHJvamVjdF9pZCA/IHRoaXMucHJvamVjdE1hcC5nZXQodC5wcm9qZWN0X2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgZWRpdDogKCkgPT4gdGhpcy5vcGVuVGFza0Zvcm0oeyBtb2RlOiBcImVkaXRcIiwgdGFzazogdCB9KSxcbiAgICAgIGNvbXBsZXRlOiAoKSA9PiB2b2lkIHRoaXMuY29tcGxldGVUYXNrKHQpLFxuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc3VibWl0VGFza0Zvcm0obW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiLCB0YXNrOiBUb2RvaXN0VGFzayB8IHVuZGVmaW5lZCwgdjogVGFza0Zvcm1WYWx1ZXMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAobW9kZSA9PT0gXCJjcmVhdGVcIikge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdi5jb250ZW50LCBwcmlvcml0eTogdi5wcmlvcml0eSB9O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbi50cmltKCkpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb24udHJpbSgpO1xuICAgICAgICBpZiAodi5kdWVEYXRlKSBmaWVsZHMuZHVlX2RhdGUgPSB2LmR1ZURhdGU7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCkgZmllbGRzLnByb2plY3RfaWQgPSB2LnByb2plY3RJZDtcbiAgICAgICAgaWYgKHYubGFiZWxzLmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBhd2FpdCBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbiwgZmllbGRzKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIENyaWFkYTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKHRhc2spIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7fTtcbiAgICAgICAgaWYgKHYuY29udGVudCAhPT0gdGFzay5jb250ZW50KSBmaWVsZHMuY29udGVudCA9IHYuY29udGVudDtcbiAgICAgICAgaWYgKHYuZGVzY3JpcHRpb24gIT09ICh0YXNrLmRlc2NyaXB0aW9uID8/IFwiXCIpKSBmaWVsZHMuZGVzY3JpcHRpb24gPSB2LmRlc2NyaXB0aW9uO1xuICAgICAgICBpZiAodi5wcmlvcml0eSAhPT0gdGFzay5wcmlvcml0eSkgZmllbGRzLnByaW9yaXR5ID0gdi5wcmlvcml0eTtcbiAgICAgICAgY29uc3Qgb2xkRGF0ZSA9IHRhc2suZHVlPy5kYXRlID8gdGFzay5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogXCJcIjtcbiAgICAgICAgaWYgKHYuZHVlRGF0ZSAhPT0gb2xkRGF0ZSkge1xuICAgICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgICBlbHNlIGZpZWxkcy5kdWVfc3RyaW5nID0gXCJubyBkYXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2xkTCA9ICh0YXNrLmxhYmVscyA/PyBbXSkuc2xpY2UoKS5zb3J0KCkuam9pbihcIiBcIik7XG4gICAgICAgIGNvbnN0IG5ld0wgPSB2LmxhYmVscy5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgaWYgKG9sZEwgIT09IG5ld0wpIGZpZWxkcy5sYWJlbHMgPSB2LmxhYmVscztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGZpZWxkcykubGVuZ3RoKSBhd2FpdCB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbiwgdGFzay5pZCwgZmllbGRzKTtcbiAgICAgICAgY29uc3Qgb2xkUHJvaiA9IHRhc2sucHJvamVjdF9pZCA/PyBcIlwiO1xuICAgICAgICBpZiAodi5wcm9qZWN0SWQgIT09IG9sZFByb2ogJiYgdi5wcm9qZWN0SWQpIGF3YWl0IG1vdmVUb2RvaXN0VGFzayh0b2tlbiwgdGFzay5pZCwgdi5wcm9qZWN0SWQpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgU2FsdmE6ICR7di5jb250ZW50fWApO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5mZXRjaCh0cnVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIHNhbHZhcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBkZWxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIHRoaXMucGVyc2lzdENhY2hlKCk7XG4gICAgICBuZXcgTm90aWNlKGBcdUQ4M0RcdURERDEgRXhjbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBleGNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbXBsZXRlVGFzayh0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gdGhpcy50YXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjbG9zZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIHRoaXMucGVyc2lzdENhY2hlKCk7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ29uY2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGNvbmNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzU3RhbGUoKTogYm9vbGVhbiB7IHJldHVybiBEYXRlLm5vdygpIC0gdGhpcy5mZXRjaGVkQXQgPj0gVE9ET19UVEw7IH1cblxuICAvLyBBdXRvLXJlZnJlc2ggcGVyaVx1MDBGM2RpY28gKGludGVydmFsbyBubyBvbmxvYWQpOiBzXHUwMEYzIGJ1c2NhIHNlIGhcdTAwRTEgdmlldyBhYmVydGEsIHRva2VuXG4gIC8vIGNvbmZpZ3VyYWRvLCBuYWRhIGVtIHZvbyBlIG8gY2FjaGUgcGFzc291IGRvIFRUTC4gU2VtIHZpZXcgYWJlcnRhID0gc2VtIGNoYW1hZGEgXHUwMEUwIEFQSS5cbiAgbWF5YmVSZWZyZXNoKCkge1xuICAgIGlmICghdGhpcy5zdWJzLnNpemUgfHwgdGhpcy5sb2FkaW5nKSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpKSByZXR1cm47XG4gICAgaWYgKHRoaXMuaXNTdGFsZSgpKSB2b2lkIHRoaXMuZmV0Y2goZmFsc2UpO1xuICB9XG5cbiAgLy8gQ2FjaGUgb2ZmbGluZSAocG9yLWRpc3Bvc2l0aXZvLCBsb2NhbFN0b3JhZ2UgXHUyMTkyIG5cdTAwRTNvIHNpbmNyb25pemEpOiBjYXJyZWdhIG8gXHUwMEZBbHRpbW9cbiAgLy8gcmVzdWx0YWRvIHBhcmEgYSBhYmEgYWJyaXIgalx1MDBFMSBjb20gYXMgdGFyZWZhcywgbWVzbW8gc2VtIGludGVybmV0LlxuICBwcml2YXRlIGxvYWRDYWNoZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gdGhpcy5hcHAubG9hZExvY2FsU3RvcmFnZShMU19UT0RPX0NBQ0hFKTtcbiAgICAgIGNvbnN0IGMgPSB0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyYXcpIDogcmF3O1xuICAgICAgaWYgKCFjIHx8ICFBcnJheS5pc0FycmF5KGMudGFza3MpKSByZXR1cm47XG4gICAgICB0aGlzLnRhc2tzID0gYy50YXNrcztcbiAgICAgIHRoaXMucHJvamVjdHMgPSBBcnJheS5pc0FycmF5KGMucHJvamVjdHMpID8gYy5wcm9qZWN0cyA6IFtdO1xuICAgICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcCh0aGlzLnByb2plY3RzLm1hcCgocDogVG9kb2lzdFByb2plY3QpID0+IFtwLmlkLCBwLm5hbWVdKSk7XG4gICAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcChBcnJheS5pc0FycmF5KGMubGFiZWxzKSA/IGMubGFiZWxzIDogW10pO1xuICAgICAgdGhpcy5mZXRjaGVkQXQgPSB0eXBlb2YgYy5mZXRjaGVkQXQgPT09IFwibnVtYmVyXCIgPyBjLmZldGNoZWRBdCA6IDA7XG4gICAgfSBjYXRjaCB7IC8qIGNhY2hlIGF1c2VudGUvY29ycm9tcGlkbyBcdTIxOTIgaWdub3JhICovIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVyc2lzdENhY2hlKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1RPRE9fQ0FDSEUsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdGFza3M6IHRoaXMudGFza3MsIHByb2plY3RzOiB0aGlzLnByb2plY3RzLCBsYWJlbHM6IFsuLi50aGlzLmxhYmVsQ29sb3JzXSwgZmV0Y2hlZEF0OiB0aGlzLmZldGNoZWRBdCxcbiAgICAgIH0pKTtcbiAgICB9IGNhdGNoIHsgLyogc2VyaWFsaXphXHUwMEU3XHUwMEUzby9xdW90YSBcdTIxOTIgaWdub3JhICovIH1cbiAgfVxuXG4gIC8vIEF2aXNvIGRlIGZyZXNjb3Igbm8gdG9wbyBkYSBsaXN0YTogZHVyYW50ZSB1bWEgYnVzY2EsIG91IHF1YW5kbyBlc3RhbW9zXG4gIC8vIGV4aWJpbmRvIG8gY2FjaGUgcG9ycXVlIGEgXHUwMEZBbHRpbWEgYnVzY2EgZmFsaG91IChvZmZsaW5lKS5cbiAgcHJpdmF0ZSByZW5kZXJGcmVzaG5lc3MoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5sb2FkaW5nKSB7IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZnJlc2hcIiwgdGV4dDogXCJBdHVhbGl6YW5kb1x1MjAyNlwiIH0pOyByZXR1cm47IH1cbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgY29uc3Qgd2hlbiA9IHRoaXMuZmV0Y2hlZEF0ID8gcmVsVGltZShuZXcgRGF0ZSh0aGlzLmZldGNoZWRBdCkudG9JU09TdHJpbmcoKSkgOiBcIlx1MjAxNFwiO1xuICAgICAgaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mcmVzaCB3ZC10b2RvLWZyZXNoLXN0YWxlXCIsIHRleHQ6IGBTZW0gY29uZXhcdTAwRTNvIFx1MjAxNCBleGliaW5kbyBvIFx1MDBGQWx0aW1vIGNhcnJlZ2FkbyAoJHt3aGVufSlgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoKG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuIHx8IHRoaXMubG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBbdGFza3MsIHByb2plY3RzLCBsYWJlbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbiksXG4gICAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0UHJvamVjdFtdKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0TGFiZWxbXSksXG4gICAgICBdKTtcbiAgICAgIHRoaXMudGFza3MgPSB0YXNrcztcbiAgICAgIHRoaXMucHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAocHJvamVjdHMubWFwKHAgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKGxhYmVscy5tYXAobCA9PiBbbC5uYW1lLCBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDS10pKTtcbiAgICAgIHRoaXMuZmV0Y2hlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMucGVyc2lzdENhY2hlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5lcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTGFuXHUwMEU3YSB1bSBwYWNvdGU6IGNyaWEgY2FkYSB0YXJlZmEgbm8gVG9kb2lzdCBjb20gZGF0YSBkZSBob2plLiBTZXF1ZW5jaWFsXG4gIC8vIChldml0YSByYWphZGEgbmEgQVBJKS4gQXR1YWxpemEgYSBsaXN0YSBhbyBmaW5hbC5cbiAgYXN5bmMgbGF1bmNoUGFja2FnZShwa2c6IFRhc2tQYWNrYWdlKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QgbmFzIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzLlwiKTsgcmV0dXJuOyB9XG4gICAgLy8gUmVzb2x2ZSB0XHUwMEVEdHVsbyBsaW1wbyArIGV0aXF1ZXRhcyAocGFjb3RlICsgaW5saW5lIEBldGlxdWV0YSkgcG9yIHRhcmVmYS5cbiAgICBjb25zdCBpdGVtcyA9IHBrZy50YXNrcy5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pLm1hcChsaW5lID0+IHNwbGl0VGFza0xhYmVscyhsaW5lLCBwa2cubGFiZWxzID8/IFtdKSk7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHsgbmV3IE5vdGljZShcIlBhY290ZSBzZW0gdGFyZWZhcy5cIik7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmxhdW5jaGluZy5oYXMocGtnLmlkKSkgcmV0dXJuOyAgIC8vIGpcdTAwRTEgZXN0XHUwMEUxIGxhblx1MDBFN2FuZG8gXHUyMTkyIGlnbm9yYSBjbGlxdWUtZHVwbG9cblxuICAgIC8vIENvbmZpcm1hXHUwMEU3XHUwMEUzbyBjb25mb3JtZSBhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gKHNlbXByZSAvIHNcdTAwRjMgbXVpdGFzIC8gbnVuY2EpLlxuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybTtcbiAgICBjb25zdCBuZWVkQ29uZmlybSA9IG1vZGUgPT09IFwiYWx3YXlzXCIgfHwgKG1vZGUgPT09IFwibWFueVwiICYmIGl0ZW1zLmxlbmd0aCA+IExBVU5DSF9DT05GSVJNX01JTik7XG4gICAgaWYgKG5lZWRDb25maXJtKSB7XG4gICAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgICB0aXRsZTogYExhblx1MDBFN2FyIFx1MjAxQyR7cGtnLm5hbWUgfHwgXCJwYWNvdGVcIn1cdTIwMUQ/YCxcbiAgICAgICAgYm9keTogYElzc28gdmFpIGNyaWFyICR7aXRlbXMubGVuZ3RofSB0YXJlZmEocykgbm8gVG9kb2lzdCBjb20gZGF0YSBkZSBob2plOmAsXG4gICAgICAgIGl0ZW1zOiBpdGVtcy5tYXAoaXQgPT4gKHtcbiAgICAgICAgICB0ZXh0OiAoaXQucHJpb3JpdHkgPiAxID8gYFske3ByaU1ldGEoaXQucHJpb3JpdHkpLmxhYmVsfV0gYCA6IFwiXCIpICsgaXQudGl0bGUsXG4gICAgICAgICAgbGFiZWxzOiBpdC5sYWJlbHMubWFwKG4gPT4gKHsgbmFtZTogbiwgY29sb3I6IHRoaXMubGFiZWxDb2xvcihuKSB9KSksXG4gICAgICAgIH0pKSxcbiAgICAgICAgY3RhOiBgTGFuXHUwMEU3YXIgJHtpdGVtcy5sZW5ndGh9YCxcbiAgICAgIH0pO1xuICAgICAgaWYgKCFvaykgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGF1bmNoaW5nLmFkZChwa2cuaWQpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTsgICAvLyBtb3N0cmEgbyBib3RcdTAwRTNvIGNvbW8gXCJsYW5cdTAwRTdhbmRvXHUyMDI2XCJcbiAgICBjb25zdCBkdWUgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBsZXQgb2sgPSAwO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKGNvbnN0IHsgdGl0bGUsIGxhYmVscywgcHJpb3JpdHkgfSBvZiBpdGVtcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB0aXRsZSwgZHVlX2RhdGU6IGR1ZSB9O1xuICAgICAgICAgIGlmIChwa2cucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHBrZy5wcm9qZWN0SWQ7XG4gICAgICAgICAgaWYgKGxhYmVscy5sZW5ndGgpIGZpZWxkcy5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICAgICAgaWYgKHByaW9yaXR5ID4gMSkgZmllbGRzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgICAgICAgYXdhaXQgY3JlYXRlVG9kb2lzdFRhc2sodG9rZW4sIGZpZWxkcyk7XG4gICAgICAgICAgb2srKztcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGVtIFwiJHt0aXRsZX1cIjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sYXVuY2hpbmcuZGVsZXRlKHBrZy5pZCk7XG4gICAgfVxuICAgIG5ldyBOb3RpY2UoYFx1MjcxMyAke29rfS8ke2l0ZW1zLmxlbmd0aH0gdGFyZWZhKHMpIGxhblx1MDBFN2FkYShzKSBcdTIwMTQgJHtwa2cubmFtZSB8fCBcInBhY290ZVwifWApO1xuICAgIGF3YWl0IHRoaXMuZmV0Y2godHJ1ZSk7ICAgLy8gcmUtcmVuZGVyaXphIChsaW1wYSBvIGVzdGFkbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIilcbiAgfVxuXG4gIC8vIEJhcnJhIGRlIGxhblx1MDBFN2Fkb3JlcyBkZSBwYWNvdGVzLiBDb20gYGhlYWRpbmdgLCBtb250YSBhIHNlXHUwMEU3XHUwMEUzbyBcIlBBQ09URVNcIlxuICAvLyBjb21wbGV0YSAoYWJhIGRvIFRvZG9pc3QpOyBzZW0gZWxlLCBzXHUwMEYzIGEgYmFycmEgZGUgYm90XHUwMEY1ZXMgKGRhc2hib2FyZCwgZVxuICAvLyBzb21lIHF1YW5kbyBuXHUwMEUzbyBoXHUwMEUxIHBhY290ZXMgcGFyYSBtYW50ZXIgbyBwYWluZWwgZW54dXRvKS5cbiAgcmVuZGVyUGFja2FnZXMoaG9zdDogSFRNTEVsZW1lbnQsIG9wdHM6IHsgaGVhZGluZz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgcGtncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBsZXQgdGFyZ2V0ID0gaG9zdDtcbiAgICBpZiAob3B0cy5oZWFkaW5nKSB7XG4gICAgICBjb25zdCBzZWMgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiUEFDT1RFU1wiIH0pO1xuICAgICAgaWYgKCFwa2dzLmxlbmd0aCkge1xuICAgICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ3JpZSBwYWNvdGVzIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgXHUyMTkyIFBhY290ZXMgZGUgdGFyZWZhcy5cIiB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGFyZ2V0ID0gc2VjO1xuICAgIH0gZWxzZSBpZiAoIXBrZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGNvbnN0IGJhciA9IHRhcmdldC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJhclwiIH0pO1xuICAgIGZvciAoY29uc3QgcGtnIG9mIHBrZ3MpIHtcbiAgICAgIGNvbnN0IHZhbGlkID0gcGtnLnRhc2tzLmZpbHRlcihzID0+IHMudHJpbSgpKS5sZW5ndGg7XG4gICAgICBjb25zdCBidXN5ID0gdGhpcy5sYXVuY2hpbmcuaGFzKHBrZy5pZCk7XG4gICAgICBjb25zdCBkaXNhYmxlZCA9ICF0b2tlbiB8fCAhdmFsaWQgfHwgYnVzeTtcbiAgICAgIGNvbnN0IGJ0biA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJ0blwiICsgKGRpc2FibGVkID8gXCIgd2QtcGtnLWRpc2FibGVkXCIgOiBcIlwiKSArIChidXN5ID8gXCIgd2QtcGtnLWJ1c3lcIiA6IFwiXCIpIH0pO1xuICAgICAgaWYgKHBrZy5pY29uKSByZW5kZXJJY29uKGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29cIiB9KSwgcGtnLmljb24pO1xuICAgICAgYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW5hbWVcIiwgdGV4dDogcGtnLm5hbWUgfHwgXCIoc2VtIG5vbWUpXCIgfSk7XG4gICAgICBidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogYnVzeSA/IFwiXHUyMDI2XCIgOiBTdHJpbmcodmFsaWQpIH0pO1xuICAgICAgYnRuLnNldEF0dHIoXCJ0aXRsZVwiLFxuICAgICAgICBidXN5ID8gXCJMYW5cdTAwRTdhbmRvXHUyMDI2XCIgOlxuICAgICAgICAhdG9rZW4gPyBcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3RcIiA6XG4gICAgICAgICF2YWxpZCA/IFwiUGFjb3RlIHNlbSB0YXJlZmFzXCIgOlxuICAgICAgICBgTGFuXHUwMEU3YXIgJHt2YWxpZH0gdGFyZWZhKHMpIG5vIFRvZG9pc3QgKGhvamUpYCk7XG4gICAgICBpZiAoIWRpc2FibGVkKSBjbGlja2FibGUoYnRuLCAoKSA9PiB2b2lkIHRoaXMubGF1bmNoUGFja2FnZShwa2cpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckZpbHRlckJhcihob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBjb25zdCBiYXIgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJhclwiIH0pO1xuICAgIGlmICh0aGlzLnByb2plY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJQcm9qZXRvc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMucHJvamVjdHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLnByb2plY3RzLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICBjb25zdCBjaGlwID0gZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBwLm5hbWUgfSk7XG4gICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgY2xpY2thYmxlKGNoaXAsIGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVGaWx0ZXIoXCJwcm9qZWN0c1wiLCBwLmlkKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KHRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgaWYgKGxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGdycCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mZ3JvdXBcIiB9KTtcbiAgICAgIGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmxhYmVsXCIsIHRleHQ6IFwiRXRpcXVldGFzXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGFiZWxzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5sYWJlbHMuaW5jbHVkZXMobCk7XG4gICAgICAgIGNvbnN0IGNoaXAgPSB0aGlzLmxhYmVsQ2hpcChncnAsIGwsIFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpKTtcbiAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICBjbGlja2FibGUoY2hpcCwgYXN5bmMgKCkgPT4geyB0aGlzLnRvZ2dsZUZpbHRlcihcImxhYmVsc1wiLCBsKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmLnByb2plY3RzLmxlbmd0aCB8fCBmLmxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsciA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNsZWFyXCIsIHRleHQ6IFwibGltcGFyIGZpbHRyb3NcIiB9KTtcbiAgICAgIGNsaWNrYWJsZShjbHIsIGFzeW5jICgpID0+IHsgZi5wcm9qZWN0cyA9IFtdOyBmLmxhYmVscyA9IFtdOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBSZW5kZXJpemEgb3MgY29udHJvbGVzIGRlIGNhYmVcdTAwRTdhbGhvIChlbSBgY3RybHNgKSArIGEgbGlzdGEgZGUgdGFyZWZhc1xuICAvLyAoZW0gYGJvZHlgKS4gTyBob3N0IGZvcm5lY2UgbyByXHUwMEYzdHVsbyBkYSBzZVx1MDBFN1x1MDBFM28gZSBvIGxheW91dCBkbyBjYWJlXHUwMEU3YWxoby5cbiAgcmVuZGVyTGlzdChib2R5OiBIVE1MRWxlbWVudCwgY3RybHM6IEhUTUxFbGVtZW50LCBvcHRzOiB7IHNob3dMYXRlcj86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgICBjb25zdCBzZWcgPSBjdHJscy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yYW5nZVwiIH0pO1xuICAgICAgZm9yIChjb25zdCBuIG9mIFszLCA3XSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBiID0gc2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yYW5nZS1idG5cIiArIChyYW5nZSA9PT0gbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogYCR7bn1kYCB9KTtcbiAgICAgICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgYE1vc3RyYXIgb3MgcHJcdTAwRjN4aW1vcyAke259IGRpYXNgKTtcbiAgICAgICAgYi5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhyYW5nZSA9PT0gbikpO1xuICAgICAgICBjbGlja2FibGUoYiwgYXN5bmMgZSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSBuO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgICBjb25zdCBuRiA9IGYucHJvamVjdHMubGVuZ3RoICsgZi5sYWJlbHMubGVuZ3RoO1xuICAgICAgY29uc3QgZmlsdCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0ZXJidG5cIiArICh0aGlzLmZpbHRlck9wZW4gPyBcIiB3ZC1vblwiIDogXCJcIikgKyAobkYgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihmaWx0LCBcImZpbHRlclwiKTtcbiAgICAgIGZpbHQuc2V0QXR0cihcInRpdGxlXCIsIG5GID8gYEZpbHRyb3MgYXRpdm9zICgke25GfSkgXHUyMDE0IGNsaXF1ZSBwYXJhIGFqdXN0YXJgIDogXCJGaWx0cmFyIHBvciBwcm9qZXRvL2V0aXF1ZXRhXCIpO1xuICAgICAgaWYgKG5GKSBmaWx0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0Y3RcIiwgdGV4dDogU3RyaW5nKG5GKSB9KTtcbiAgICAgIGZpbHQuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy5maWx0ZXJPcGVuKSk7XG4gICAgICBjbGlja2FibGUoZmlsdCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZmlsdGVyT3BlbiA9ICF0aGlzLmZpbHRlck9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICBjb25zdCByZWZyZXNoID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlZnJlc2hcIiArICh0aGlzLmxvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgdGFyZWZhcyBkbyBUb2RvaXN0XCIpO1xuICAgICAgY2xpY2thYmxlKHJlZnJlc2gsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuZmV0Y2godHJ1ZSk7IH0pO1xuICAgICAgdGhpcy5hZGRUYXNrQnRuKGN0cmxzLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgfVxuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb2xlIHNldSB0b2tlbiBkbyBUb2RvaXN0IGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgcGFyYSB2ZXIgc3VhcyB0YXJlZmFzIGFxdWkuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQXV0by1mZXRjaDogbnVuY2EgYnVzY291LCBvdSBvIGNhY2hlIHBhc3NvdSBkbyBUVEwuIEVycm8gblx1MDBFM28gZGlzcGFyYSByZS10ZW50YXRpdmFcbiAgICAvLyBhdXRvbVx1MDBFMXRpY2EgYXF1aSAoZXZpdGFyaWEgbG9vcCBhIGNhZGEgcmVuZGVyKTsgbyBpbnRlcnZhbG8gZSBvIGJvdFx1MDBFM28gXHUyMUJCIGN1aWRhbSBkaXNzby5cbiAgICBpZiAoIXRoaXMubG9hZGluZyAmJiAhdGhpcy5lcnJvciAmJiAoIXRoaXMuZmV0Y2hlZEF0IHx8IHRoaXMuaXNTdGFsZSgpKSkgdm9pZCB0aGlzLmZldGNoKGZhbHNlKTtcbiAgICBjb25zdCBoYXNDYWNoZSA9IHRoaXMudGFza3MubGVuZ3RoID4gMDtcbiAgICAvLyBFcnJvL2NhcnJlZ2FuZG8gc1x1MDBGMyBvY3VwYW0gYSBcdTAwRTFyZWEgdG9kYSBxdWFuZG8gTlx1MDBDM08gaFx1MDBFMSBjYWNoZSBwYXJhIG1vc3RyYXIgKG9mZmxpbmUtZnJpZW5kbHkpLlxuICAgIGlmICh0aGlzLmVycm9yICYmICFoYXNDYWNoZSkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMuZXJyb3J9YCB9KTsgcmV0dXJuOyB9XG4gICAgaWYgKCF0aGlzLmZldGNoZWRBdCAmJiAhaGFzQ2FjaGUpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvIHRhcmVmYXNcdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG4gICAgdGhpcy5yZW5kZXJGcmVzaG5lc3MoYm9keSk7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJPcGVuKSB0aGlzLnJlbmRlckZpbHRlckJhcihib2R5KTtcblxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgIGNvbnN0IHRvZGF5SyA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGNvbnN0IGxhc3RVcGNvbWluZyA9IG5ldyBEYXRlKCk7XG4gICAgbGFzdFVwY29taW5nLnNldERhdGUobGFzdFVwY29taW5nLmdldERhdGUoKSArIHJhbmdlKTtcbiAgICBjb25zdCBsYXN0SyA9IHRvS2V5KGxhc3RVcGNvbWluZyk7XG5cbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuYXBwbHlGaWx0ZXJzKHRoaXMudGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBub0RhdGU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgeyBub0RhdGUucHVzaCh0KTsgY29udGludWU7IH1cbiAgICAgIGlmIChkayA8IHRvZGF5Sykgb3ZlcmR1ZS5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPT09IHRvZGF5SykgdG9kYXlUYXNrcy5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPD0gbGFzdEspIChieURheVtka10gPz89IFtdKS5wdXNoKHQpO1xuICAgICAgZWxzZSBsYXRlci5wdXNoKHQpO1xuICAgIH1cbiAgICBjb25zdCBieVByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIC8vIFwiRGVwb2lzXCI6IG9yZGVuYSBwb3IgREFUQSAobWFpcyBwclx1MDBGM3hpbWEgcHJpbWVpcm8pIGUsIG5vIG1lc21vIGRpYSwgcG9yIHByaW9yaWRhZGUuXG4gICAgY29uc3QgYnlEYXRlVGhlblByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IHtcbiAgICAgIGNvbnN0IGRhID0gZHVlS2V5KGEpID8/IFwiXCIsIGRiID0gZHVlS2V5KGIpID8/IFwiXCI7XG4gICAgICBpZiAoZGEgIT09IGRiKSByZXR1cm4gZGEgPCBkYiA/IC0xIDogMTtcbiAgICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICB9O1xuICAgIG92ZXJkdWUuc29ydChieVByaSk7IHRvZGF5VGFza3Muc29ydChieVByaSk7IGxhdGVyLnNvcnQoYnlEYXRlVGhlblByaSk7IG5vRGF0ZS5zb3J0KGJ5UHJpKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoYnlEYXkpKSBieURheVtrXS5zb3J0KGJ5UHJpKTtcblxuICAgIC8vIFwiRGVwb2lzXCIgZSBcIlNlbSBkYXRhXCIgc1x1MDBGMyBhcGFyZWNlbSBuYSBhYmEgZGVkaWNhZGEgKHNob3dMYXRlciAhPT0gZmFsc2UpLlxuICAgIGNvbnN0IHNob3dFeHRyYSA9IG9wdHMuc2hvd0xhdGVyICE9PSBmYWxzZTtcbiAgICBjb25zdCB2aXNpYmxlID0gb3ZlcmR1ZS5sZW5ndGggKyB0b2RheVRhc2tzLmxlbmd0aCArIGxhdGVyLmxlbmd0aFxuICAgICAgKyBPYmplY3QudmFsdWVzKGJ5RGF5KS5yZWR1Y2UoKHMsIGEpID0+IHMgKyBhLmxlbmd0aCwgMClcbiAgICAgICsgKHNob3dFeHRyYSA/IG5vRGF0ZS5sZW5ndGggOiAwKTtcbiAgICBpZiAodmlzaWJsZSA9PT0gMCkge1xuICAgICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgICAgY29uc3QgZmlsdGVyZWQgPSAhIShmLnByb2plY3RzLmxlbmd0aCB8fCBmLmxhYmVscy5sZW5ndGgpO1xuICAgICAgY29uc3QgbXNnID0gZmlsdGVyZWQgPyBcIk5lbmh1bWEgdGFyZWZhIGJhdGUgY29tIG9zIGZpbHRyb3MuXCJcbiAgICAgICAgOiBzaG93RXh0cmEgPyBcIk5lbmh1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFx1RDgzQ1x1REY4OVwiXG4gICAgICAgIDogXCJOZW5odW1hIHRhcmVmYSBhZ2VuZGFkYS4gXHVEODNDXHVERjg5XCI7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBtc2cgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29scyA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tY29sc1wiIH0pO1xuXG4gICAgY29uc3Qgb2JveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC1vdmVyZHVlXCIgfSk7XG4gICAgY29uc3Qgb2hkID0gb2JveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94d2FyblwiLCB0ZXh0OiBcIlx1MjZBMFwiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogXCJBdHJhc2FkYXNcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyhvdmVyZHVlLmxlbmd0aCkgfSk7XG4gICAgY29uc3Qgb2JvZHkgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAob3ZlcmR1ZS5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiBvdmVyZHVlKSB0aGlzLnRvZG9Sb3cob2JvZHksIHQpO1xuICAgIGVsc2Ugb2JvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hLiBcdUQ4M0RcdURDNERcIiB9KTtcblxuICAgIGNvbnN0IHRib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdG9kYXlcIiB9KTtcbiAgICBjb25zdCB0aGQgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkhvamVcIiB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odGhkLCBcImhvamVcIiwgXCJOb3ZhIHRhcmVmYSBwYXJhIGhvamVcIik7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodG9kYXlUYXNrcy5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IHRib2R5ID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHRvZGF5VGFza3MubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2YgdG9kYXlUYXNrcykgdGhpcy50b2RvUm93KHRib2R5LCB0KTtcbiAgICBlbHNlIHRib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmFkYSBwYXJhIGhvamUuXCIgfSk7XG5cbiAgICBsZXQgdXBjb21pbmdDb3VudCA9IDA7XG4gICAgY29uc3QgdXBEYXlzOiB7IGRvdzogbnVtYmVyOyBudW06IG51bWJlcjsga2V5OiBzdHJpbmc7IGl0ZW1zOiBUb2RvaXN0VGFza1tdIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHJhbmdlOyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XG4gICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldO1xuICAgICAgaWYgKCFpdGVtcz8ubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgIHVwY29taW5nQ291bnQgKz0gaXRlbXMubGVuZ3RoO1xuICAgICAgdXBEYXlzLnB1c2goeyBkb3c6IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDcsIG51bTogZGF5LmdldERhdGUoKSwga2V5LCBpdGVtcyB9KTtcbiAgICB9XG4gICAgY29uc3QgdWJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC11cGNvbWluZ1wiIH0pO1xuICAgIGNvbnN0IHVoZCA9IHVib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB1aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IGBQclx1MDBGM3hpbW9zICR7cmFuZ2V9IGRpYXNgIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih1aGQsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB1aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh1cGNvbWluZ0NvdW50KSB9KTtcbiAgICBjb25zdCB1Ym9keSA9IHVib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmICh1cERheXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGNvbnN0IGcgb2YgdXBEYXlzKSB7XG4gICAgICAgIGNvbnN0IGRoID0gdWJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZGF5aGRcIiArIChnLmRvdyA+PSA1ID8gXCIgd2Qtd2Vla2VuZFwiIDogXCJcIikgfSk7XG4gICAgICAgIGRoLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXluYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtnLmRvd10gfSk7XG4gICAgICAgIGRoLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXludW1cIiwgdGV4dDogU3RyaW5nKGcubnVtKSB9KTtcbiAgICAgICAgdGhpcy5hZGRUYXNrQnRuKGRoLCBnLmtleSwgYE5vdmEgdGFyZWZhIGVtICR7Zy5udW19YCk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBnLml0ZW1zKSB0aGlzLnRvZG9Sb3codWJvZHksIHQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdWJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogYE5hZGEgbm9zIHByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhcy5gIH0pO1xuICAgIH1cblxuICAgIGlmIChsYXRlci5sZW5ndGggJiYgc2hvd0V4dHJhKSB7XG4gICAgICBjb25zdCBwYW5lbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJcIiB9KTtcbiAgICAgIGNvbnN0IGxoZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1sYXRlcmljb1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYERlcG9pcyAoJHtsYXRlci5sZW5ndGh9KWAgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90b2dnbGVcIiwgdGV4dDogdGhpcy5sYXRlck9wZW4gPyBcIm9jdWx0YXIgXHUyNUJFXCIgOiBcIm1vc3RyYXIgXHUyMDNBXCIgfSk7XG4gICAgICBsaGQuc2V0QXR0cihcImFyaWEtZXhwYW5kZWRcIiwgU3RyaW5nKHRoaXMubGF0ZXJPcGVuKSk7XG4gICAgICBjbGlja2FibGUobGhkLCAoKSA9PiB7IHRoaXMubGF0ZXJPcGVuID0gIXRoaXMubGF0ZXJPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgaWYgKHRoaXMubGF0ZXJPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbGF0ZXIpIHRoaXMudG9kb1JvdyhsaXN0LCB0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9EYXRlLmxlbmd0aCAmJiBzaG93RXh0cmEpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1sYXRlciB3ZC10b2RvLW5vZGF0ZVwiIH0pO1xuICAgICAgY29uc3QgbmhkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2hkXCIgfSk7XG4gICAgICBuaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWxhdGVyaWNvXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBuaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90aXRsZVwiLCB0ZXh0OiBgU2VtIGRhdGEgKCR7bm9EYXRlLmxlbmd0aH0pYCB9KTtcbiAgICAgIG5oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RvZ2dsZVwiLCB0ZXh0OiB0aGlzLm5vRGF0ZU9wZW4gPyBcIm9jdWx0YXIgXHUyNUJFXCIgOiBcIm1vc3RyYXIgXHUyMDNBXCIgfSk7XG4gICAgICBuaGQuc2V0QXR0cihcImFyaWEtZXhwYW5kZWRcIiwgU3RyaW5nKHRoaXMubm9EYXRlT3BlbikpO1xuICAgICAgY2xpY2thYmxlKG5oZCwgKCkgPT4geyB0aGlzLm5vRGF0ZU9wZW4gPSAhdGhpcy5ub0RhdGVPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgaWYgKHRoaXMubm9EYXRlT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIG5vRGF0ZSkgdGhpcy50b2RvUm93KGxpc3QsIHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBVbWEgb2NvcnJcdTAwRUFuY2lhIGNvbmNsdVx1MDBFRGRhIFx1MDBFOSByZWNvcnJlbnRlPyAoblx1MDBFM28gcG9kZSBzZXIgYXBhZ2FkYSBcdTIwMTQgcXVlYnJhcmlhIGEgcmVjb3JyXHUwMEVBbmNpYSlcbmZ1bmN0aW9uIGlzUmVjdXJyaW5nQ29tcGxldGVkKHQ6IFRvZG9pc3RUYXNrKTogYm9vbGVhbiB7XG4gIHJldHVybiB0LmR1ZT8uaXNfcmVjdXJyaW5nID09PSB0cnVlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR2FtaWZpY2FcdTAwRTdcdTAwRTNvOiBjb250cm9sYWRvciBcdTAwRkFuaWNvIChkb25vIG5vIHBsdWdpbiwgY29tcGFydGlsaGFkbyB2aWV3XHUyMTk0ZmFpeGEpIFx1MjUwMFx1MjUwMFxuY2xhc3MgR2FtZUNvbnRyb2xsZXIge1xuICBwcml2YXRlIGV2ZW50czogR2FtZUV2ZW50W10gPSBbXTtcbiAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBidXN5ID0gZmFsc2U7ICAgICAgICAgICAgICAgICAvLyBjb2xoZWl0YS9tYXJrVW5kb25lIGVtIGFuZGFtZW50b1xuICBwcml2YXRlIHBlbmRpbmc6IFRvZG9pc3RUYXNrW10gPSBbXTsgIC8vIGNvbmNsdVx1MDBFRGRhcyBuYSBBUEkgYWluZGEgblx1MDBFM28gbm8gbG9nIChsaXZlKVxuICBwcml2YXRlIHBlbmRpbmdYcCA9IDA7XG4gIHByaXZhdGUgbGFzdEJhclBjdCA9IDA7ICAgICAgICAgICAgICAgLy8gXHUwMEZBbHRpbW8gJSBkYSBiYXJyYSAocC8gYW5pbWFyIGRvIHZhbG9yIGFudGVyaW9yKVxuICBwcml2YXRlIGxhc3RMZXZlbCA9IDA7XG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHt9XG5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7IHRoaXMuc3Vicy5hZGQoY2IpOyByZXR1cm4gKCkgPT4geyB0aGlzLnN1YnMuZGVsZXRlKGNiKTsgfTsgfVxuICByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICBwcml2YXRlIGxvZ0ZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKEdBTUVfTE9HX1BBVEgpO1xuICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZpbGUgPyBmIDogbnVsbDtcbiAgfVxuICBpbnZhbGlkYXRlKCkgeyB0aGlzLmxvYWRlZCA9IGZhbHNlOyB9XG4gIGFzeW5jIGVuc3VyZUxvYWRlZCgpIHtcbiAgICBpZiAodGhpcy5sb2FkZWQpIHJldHVybjtcbiAgICBjb25zdCBmID0gdGhpcy5sb2dGaWxlKCk7XG4gICAgdGhpcy5ldmVudHMgPSBmID8gcGFyc2VHYW1lTG9nKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZikpIDogW107XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICB9XG4gIHN0YXRzKCk6IEdhbWVTdGF0cyB7IHJldHVybiBjb21wdXRlR2FtZVN0YXRzKHRoaXMuZXZlbnRzKTsgfVxuXG4gIHByaXZhdGUgYXN5bmMgd3JpdGVMb2coKSB7XG4gICAgY29uc3QgY29udGVudCA9IGJ1aWxkR2FtZUxvZ0NvbnRlbnQodGhpcy5ldmVudHMpO1xuICAgIGNvbnN0IGYgPSB0aGlzLmxvZ0ZpbGUoKTtcbiAgICBpZiAoZikgeyBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZiwgY29udGVudCk7IHJldHVybjsgfVxuICAgIGNvbnN0IHNsYXNoID0gR0FNRV9MT0dfUEFUSC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgY29uc3QgZm9sZGVyID0gc2xhc2ggPiAwID8gR0FNRV9MT0dfUEFUSC5zbGljZSgwLCBzbGFzaCkgOiBcIlwiO1xuICAgIGlmIChmb2xkZXIgJiYgIXRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmb2xkZXIpKSB7XG4gICAgICB0cnkgeyBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoZm9sZGVyKTsgfSBjYXRjaCB7IC8qIGpcdTAwRTEgZXhpc3RlICovIH1cbiAgICB9XG4gICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKEdBTUVfTE9HX1BBVEgsIGNvbnRlbnQpO1xuICB9XG5cbiAgLy8gQW5leGEgZXZlbnRvcyBub3ZvcyAoZGVkdXAgcG9yIGNoYXZlKS4gRGV2b2x2ZSBxdWFudG9zIGVudHJhcmFtLlxuICBwcml2YXRlIGFzeW5jIGFwcGVuZEV2ZW50cyhldnM6IEdhbWVFdmVudFtdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBhd2FpdCB0aGlzLmVuc3VyZUxvYWRlZCgpO1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KHRoaXMuZXZlbnRzLm1hcChlID0+IGUua2V5KSk7XG4gICAgY29uc3QgYWRkID0gZXZzLmZpbHRlcihlID0+ICFrZXlzLmhhcyhlLmtleSkpO1xuICAgIGlmICghYWRkLmxlbmd0aCkgcmV0dXJuIDA7XG4gICAgdGhpcy5ldmVudHMucHVzaCguLi5hZGQpO1xuICAgIGF3YWl0IHRoaXMud3JpdGVMb2coKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgcmV0dXJuIGFkZC5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIHByb2pOYW1lKHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4udG9kby5wcm9qZWN0TmFtZSh0LnByb2plY3RfaWQpIHx8ICh0LnByb2plY3RfaWQgPz8gXCJcIik7XG4gIH1cbiAgcHJpdmF0ZSBkb25lRXZlbnQodDogVG9kb2lzdFRhc2spOiBHYW1lRXZlbnQge1xuICAgIGNvbnN0IGF0ID0gdC5jb21wbGV0ZWRfYXQgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiB7IGRhdGU6IHRvS2V5KG5ldyBEYXRlKGF0KSksIHR5cGU6IFwiZmVpdG9cIiwgeHA6IHhwRm9yUHJpb3JpdHkodC5wcmlvcml0eSksXG4gICAgICBrZXk6IGAke3QuaWR9fCR7YXR9YCwgY29udGVudDogdC5jb250ZW50LCBwcm9qZWN0OiB0aGlzLnByb2pOYW1lKHQpLCBsYWJlbHM6IHQubGFiZWxzID8/IFtdIH07XG4gIH1cblxuICAvLyBKYW5lbGEgZG8gZmV0Y2g6IGRlc2RlIGEgXHUwMEZBbHRpbWEgY29saGVpdGEgKFx1MjIxMjJkIGRlIG1hcmdlbSkgb3UgYmFja2ZpbGwgbmEgMVx1MDBBQSB2ZXouXG4gIHByaXZhdGUgaGFydmVzdFNpbmNlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbGFzdCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdDtcbiAgICBpZiAobGFzdCAmJiAvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChsYXN0KSlcbiAgICAgIHJldHVybiB0b0tleShuZXcgRGF0ZShEYXRlLnBhcnNlKGxhc3QgKyBcIlQwMDowMDowMFwiKSAtIDIgKiA4NjQwMDAwMCkpO1xuICAgIHJldHVybiB0b0tleShuZXcgRGF0ZShEYXRlLm5vdygpIC0gSEFSVkVTVF9CQUNLRklMTF9EQVlTICogODY0MDAwMDApKTtcbiAgfVxuICAvLyBgdW50aWxgID0gQU1BTkhcdTAwQzMgKGxvY2FsKS4gY29tcGxldGVkX2F0IGRhIEFQSSBcdTAwRTkgVVRDOiBcdTAwRTAgbm9pdGUgbm8gQlJULCBhIGNvbmNsdXNcdTAwRTNvIGRlXG4gIC8vIGhvamUgalx1MDBFMSBcdTAwRTkgXCJhbWFuaFx1MDBFM1wiIGVtIFVUQyBcdTIxOTIgY29tIHVudGlsPWhvamUgZWxhIGNhaXJpYSBmb3JhIGRhIGphbmVsYS5cbiAgcHJpdmF0ZSBoYXJ2ZXN0VW50aWwoKTogc3RyaW5nIHsgcmV0dXJuIHRvS2V5KG5ldyBEYXRlKERhdGUubm93KCkgKyA4NjQwMDAwMCkpOyB9XG5cbiAgLy8gXCJOXHUwMEUzbyBmZWl0b1wiOiBwdW5pXHUwMEU3XHUwMEUzbyAoXHUyMjEyYmFzZVx1MDBEN2ZhdG9yKSBcdTIxOTIgbG9nIFx1MjE5MiBhcGFnYSBkbyBUb2RvaXN0LlxuICBhc3luYyBtYXJrVW5kb25lKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgaWYgKHRoaXMuYnVzeSkgcmV0dXJuO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSB7IG5ldyBOb3RpY2UoXCJDb25maWd1cmUgbyB0b2tlbiBkbyBUb2RvaXN0LlwiKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgcGVuYWx0eSA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoeHBGb3JQcmlvcml0eSh0LnByaW9yaXR5KSAqIHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVQZW5hbHR5RmFjdG9yKSk7XG4gICAgY29uc3QgcmVjdXJyaW5nID0gaXNSZWN1cnJpbmdDb21wbGV0ZWQodCk7XG4gICAgY29uc3Qgb2sgPSBhd2FpdCBjb25maXJtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgIHRpdGxlOiBcIk1hcmNhciBjb21vIG5cdTAwRTNvIGZlaXRhP1wiLFxuICAgICAgYm9keTogcmVjdXJyaW5nXG4gICAgICAgID8gYFwiJHt0LmNvbnRlbnR9XCIgXHUwMEU5IHJlY29ycmVudGUgXHUyMDE0IHZvY1x1MDBFQSBwZXJkZSAke3BlbmFsdHl9IFhQLCBtYXMgYSB0YXJlZmEgTlx1MDBDM08gXHUwMEU5IGFwYWdhZGEgKGFwYWdhciBxdWVicmFyaWEgYSByZWNvcnJcdTAwRUFuY2lhKS5gXG4gICAgICAgIDogYFwiJHt0LmNvbnRlbnR9XCIgXHUyMDE0IHZvY1x1MDBFQSBwZXJkZSAke3BlbmFsdHl9IFhQIGUgYSB0YXJlZmEgXHUwMEU5IGFwYWdhZGEgZG8gVG9kb2lzdCAoaXJyZXZlcnNcdTAwRUR2ZWwpLmAsXG4gICAgICBjdGE6IGBOXHUwMEUzbyBmZWl0YSAoXHUyMjEyJHtwZW5hbHR5fSBYUClgLFxuICAgIH0pO1xuICAgIGlmICghb2spIHJldHVybjtcbiAgICB0aGlzLmJ1c3kgPSB0cnVlOyB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwZW5kRXZlbnRzKFt7IGRhdGU6IHRvS2V5KG5ldyBEYXRlKCkpLCB0eXBlOiBcIm5hby1mZWl0b1wiLCB4cDogLXBlbmFsdHksXG4gICAgICAgIGtleTogYCR7dC5pZH18JHtEYXRlLm5vdygpfWAsIGNvbnRlbnQ6IHQuY29udGVudCwgcHJvamVjdDogdGhpcy5wcm9qTmFtZSh0KSwgbGFiZWxzOiB0LmxhYmVscyA/PyBbXSB9XSk7XG4gICAgICBpZiAoIXJlY3VycmluZykgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgbmV3IE5vdGljZShgXHUyNzE3IE5cdTAwRTNvIGZlaXRhOiAke3QuY29udGVudH0gKFx1MjIxMiR7cGVuYWx0eX0gWFApYCk7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi50b2RvLmZldGNoKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7IHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb2xoZSBjb25jbHVcdTAwRURkYXMgXHUyMTkyIGxvZzsgYXBhZ2EgZG8gVG9kb2lzdCBzXHUwMEYzIGFzIE5cdTAwQzNPLXJlY29ycmVudGVzLlxuICBhc3luYyBoYXJ2ZXN0KCkge1xuICAgIGlmICh0aGlzLmJ1c3kpIHJldHVybjtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdC5cIik7IHJldHVybjsgfVxuICAgIHRoaXMuYnVzeSA9IHRydWU7IHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5lbnN1cmVMb2FkZWQoKTtcbiAgICAgIGNvbnN0IHRvZGF5ID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgICBjb25zdCBjb21wbGV0ZWQgPSBhd2FpdCBmZXRjaENvbXBsZXRlZFRhc2tzKHRva2VuLCB0aGlzLmhhcnZlc3RTaW5jZSgpLCB0aGlzLmhhcnZlc3RVbnRpbCgpKTtcbiAgICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KHRoaXMuZXZlbnRzLm1hcChlID0+IGUua2V5KSk7XG4gICAgICBjb25zdCBmcmVzaCA9IGNvbXBsZXRlZC5maWx0ZXIodCA9PiAha2V5cy5oYXMoYCR7dC5pZH18JHt0LmNvbXBsZXRlZF9hdCA/PyBcIlwifWApKTtcbiAgICAgIGlmICghZnJlc2gubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdCA9IHRvZGF5OyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gW107IHRoaXMucGVuZGluZ1hwID0gMDtcbiAgICAgICAgbmV3IE5vdGljZShcIk5hZGEgbm92byBwYXJhIHNhbHZhci4gXHVEODNEXHVEQzREXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBkZWxldGFibGUgPSBmcmVzaC5maWx0ZXIodCA9PiAhaXNSZWN1cnJpbmdDb21wbGV0ZWQodCkpO1xuICAgICAgY29uc3QgcmVjdXJyaW5nID0gZnJlc2gubGVuZ3RoIC0gZGVsZXRhYmxlLmxlbmd0aDtcbiAgICAgIGNvbnN0IHRvdGFsWHAgPSBmcmVzaC5yZWR1Y2UoKHMsIHQpID0+IHMgKyB4cEZvclByaW9yaXR5KHQucHJpb3JpdHkpLCAwKTtcbiAgICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICAgIHRpdGxlOiBgU2FsdmFyICR7ZnJlc2gubGVuZ3RofSB0YXJlZmEocykgY29uY2x1XHUwMEVEZGEocyk/YCxcbiAgICAgICAgYm9keTogYCske3RvdGFsWHB9IFhQIG5vIGxvZy4gJHtkZWxldGFibGUubGVuZ3RofSBhcGFnYWRhKHMpIGRvIFRvZG9pc3RgICtcbiAgICAgICAgICAocmVjdXJyaW5nID8gYCBcdTAwQjcgJHtyZWN1cnJpbmd9IHJlY29ycmVudGUocykgZmljYW0gKGFwYWdhciBxdWVicmFyaWEgYSByZWNvcnJcdTAwRUFuY2lhKS5gIDogXCIuXCIpLFxuICAgICAgICBpdGVtczogZnJlc2guc2xpY2UoMCwgMzApLm1hcCh0ID0+ICh7IHRleHQ6IGArJHt4cEZvclByaW9yaXR5KHQucHJpb3JpdHkpfSBcdTAwQjcgJHt0LmNvbnRlbnR9YCB9KSksXG4gICAgICAgIGN0YTogYFNhbHZhciBlIGFwYWdhciAke2RlbGV0YWJsZS5sZW5ndGh9YCxcbiAgICAgIH0pO1xuICAgICAgaWYgKCFvaykgcmV0dXJuO1xuICAgICAgYXdhaXQgdGhpcy5hcHBlbmRFdmVudHMoZnJlc2gubWFwKHQgPT4gdGhpcy5kb25lRXZlbnQodCkpKTtcbiAgICAgIGxldCBkZWwgPSAwO1xuICAgICAgZm9yIChjb25zdCB0IG9mIGRlbGV0YWJsZSkge1xuICAgICAgICB0cnkgeyBhd2FpdCBkZWxldGVUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7IGRlbCsrOyB9IGNhdGNoIHsgLyogc2VndWUgKi8gfVxuICAgICAgfVxuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0ID0gdG9kYXk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgdGhpcy5wZW5kaW5nID0gW107IHRoaXMucGVuZGluZ1hwID0gMDtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyAke2ZyZXNoLmxlbmd0aH0gc2FsdmEocykgKCske3RvdGFsWHB9IFhQKSBcdTAwQjcgJHtkZWx9IGFwYWdhZGEocylgKTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnRvZG8uZmV0Y2godHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7IHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb250YSBxdWFudGFzIGNvbmNsdVx1MDBFRGRhcyBlc3RcdTAwRTNvIHBlbmRlbnRlcyBkZSBzYWx2YXIgKGxpdmUsIHNlbSBhcGFnYXIgbmFkYSkuXG4gIGFzeW5jIHJlZnJlc2hQZW5kaW5nKCkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7XG4gICAgICBjb25zdCBjb21wbGV0ZWQgPSBhd2FpdCBmZXRjaENvbXBsZXRlZFRhc2tzKHRva2VuLCB0aGlzLmhhcnZlc3RTaW5jZSgpLCB0aGlzLmhhcnZlc3RVbnRpbCgpKTtcbiAgICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KHRoaXMuZXZlbnRzLm1hcChlID0+IGUua2V5KSk7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBjb21wbGV0ZWQuZmlsdGVyKHQgPT4gIWtleXMuaGFzKGAke3QuaWR9fCR7dC5jb21wbGV0ZWRfYXQgPz8gXCJcIn1gKSk7XG4gICAgICB0aGlzLnBlbmRpbmdYcCA9IHRoaXMucGVuZGluZy5yZWR1Y2UoKHMsIHQpID0+IHMgKyB4cEZvclByaW9yaXR5KHQucHJpb3JpdHkpLCAwKTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9IGNhdGNoIHsgLyogc2lsZW5jaW9zbyAqLyB9XG4gIH1cblxuICAvLyBQYWluZWwgY29tcGFydGlsaGFkbzogZGFzaGJvYXJkIChmYWl4YSwgY3RybHMgc2VtIGNvbGhlaXRhKSBlIGFiYSAoZnVsbCkuXG4gIHJlbmRlclBhbmVsKGhvc3Q6IEhUTUxFbGVtZW50LCBjdHJsczogSFRNTEVsZW1lbnQgfCBudWxsLCBvcHRzOiB7IGZ1bGw/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRzKCk7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmIChvcHRzLmZ1bGwgJiYgY3RybHMgJiYgdG9rZW4pIHtcbiAgICAgIGNvbnN0IHNhdmUgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtaGFydmVzdFwiICsgKHRoaXMuYnVzeSA/IFwiIHdkLWdhbWUtYnVzeVwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHNhdmUuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWhhcnZlc3QtaWNvXCIgfSksIFwiZG93bmxvYWRcIik7XG4gICAgICBzYXZlLmNyZWF0ZVNwYW4oeyB0ZXh0OiB0aGlzLmJ1c3kgPyBcIlNhbHZhbmRvXHUyMDI2XCIgOiBcIlNhbHZhciBjb25jbHVcdTAwRURkYXNcIiB9KTtcbiAgICAgIGlmICh0aGlzLnBlbmRpbmcubGVuZ3RoKSBzYXZlLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1wZW5kXCIsIHRleHQ6IGArJHt0aGlzLnBlbmRpbmdYcH1gIH0pO1xuICAgICAgc2F2ZS5zZXRBdHRyKFwidGl0bGVcIiwgdGhpcy5wZW5kaW5nLmxlbmd0aFxuICAgICAgICA/IGAke3RoaXMucGVuZGluZy5sZW5ndGh9IGNvbmNsdVx1MDBFRGRhKHMpIGFndWFyZGFuZG8gc2FsdmFyICgrJHt0aGlzLnBlbmRpbmdYcH0gWFApYFxuICAgICAgICA6IFwiQnVzY2FyIHRhcmVmYXMgY29uY2x1XHUwMEVEZGFzLCBzYWx2YXIgbm8gbG9nIGUgbGltcGFyIGRvIFRvZG9pc3RcIik7XG4gICAgICBpZiAoIXRoaXMuYnVzeSkgY2xpY2thYmxlKHNhdmUsICgpID0+IHZvaWQgdGhpcy5oYXJ2ZXN0KCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGx2bCA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbGV2ZWxcIiB9KTtcbiAgICBsdmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWx2bG51bVwiLCB0ZXh0OiBgTlx1MDBFRHZlbCAke3MubGV2ZWx9YCB9KTtcbiAgICBsdmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLXhwXCIsIHRleHQ6IGAke3MudG90YWxYcH0gWFBgIH0pO1xuICAgIGNvbnN0IGJhciA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYmFyXCIgfSk7XG4gICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1iYXItZmlsbFwiIH0pO1xuICAgIGNvbnN0IHBjdCA9IHMueHBGb3JOZXh0ID8gTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKHMueHBJbnRvTGV2ZWwgLyBzLnhwRm9yTmV4dCAqIDEwMCkpIDogMDtcbiAgICAvLyBBbmltYSBkbyBcdTAwRkFsdGltbyAlIGV4aWJpZG8gYXRcdTAwRTkgbyBub3ZvOyBlbSBsZXZlbC11cCwgZW5jaGUgZG8gemVyby5cbiAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cy5sZXZlbCA+IHRoaXMubGFzdExldmVsID8gMCA6IHRoaXMubGFzdEJhclBjdH0lYDtcbiAgICB2b2lkIGZpbGwub2Zmc2V0V2lkdGg7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlZmxvdyBcdTIxOTIgYSB0cmFuc2lcdTAwRTdcdTAwRTNvIENTUyBwYXJ0ZSBkbyB2YWxvciBhbnRlcmlvclxuICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG4gICAgdGhpcy5sYXN0QmFyUGN0ID0gcGN0OyB0aGlzLmxhc3RMZXZlbCA9IHMubGV2ZWw7XG4gICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtzLnhwSW50b0xldmVsfS8ke3MueHBGb3JOZXh0fSBYUCBwYXJhIG8gblx1MDBFRHZlbCAke3MubGV2ZWwgKyAxfWApO1xuICAgIGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbmV4dFwiLFxuICAgICAgdGV4dDogYGZhbHRhbSAke01hdGgubWF4KDAsIHMueHBGb3JOZXh0IC0gcy54cEludG9MZXZlbCl9IFhQIHBhcmEgbyBuXHUwMEVEdmVsICR7cy5sZXZlbCArIDF9YCB9KTtcblxuICAgIGNvbnN0IGdyaWQgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpY3NcIiB9KTtcbiAgICBjb25zdCBtZXRyaWMgPSAoaWNvbjogc3RyaW5nLCB2YWw6IHN0cmluZywgbGFiZWw6IHN0cmluZywgY2xzID0gXCJcIikgPT4ge1xuICAgICAgY29uc3QgYyA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbWV0cmljIFwiICsgY2xzIH0pO1xuICAgICAgY29uc3QgdiA9IGMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLXZhbFwiIH0pO1xuICAgICAgc2V0SWNvbih2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1tZXRyaWMtaWNvXCIgfSksIGljb24pO1xuICAgICAgdi5jcmVhdGVTcGFuKHsgdGV4dDogdmFsIH0pO1xuICAgICAgYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1tZXRyaWMtbGJsXCIsIHRleHQ6IGxhYmVsIH0pO1xuICAgIH07XG4gICAgbWV0cmljKFwiZmxhbWVcIiwgU3RyaW5nKHMuc3RyZWFrQ3VycmVudCksIGBzdHJlYWsgXHUwMEI3IHJlY29yZGUgJHtzLnN0cmVha0Jlc3R9YCwgcy5zdHJlYWtDdXJyZW50ID8gXCJ3ZC1nYW1lLXN0cmVhay1vblwiIDogXCJcIik7XG4gICAgbWV0cmljKFwiemFwXCIsIGAke3MudG9kYXlYcCA+PSAwID8gXCIrXCIgOiBcIlwifSR7cy50b2RheVhwfWAsIGBYUCBob2plIFx1MDBCNyAke3MudG9kYXlDb3VudH0gZmVpdGEocylgKTtcblxuICAgIGlmIChvcHRzLmZ1bGwgJiYgdGhpcy5wZW5kaW5nLmxlbmd0aClcbiAgICAgIGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtaGludFwiLCB0ZXh0OlxuICAgICAgICBgJHt0aGlzLnBlbmRpbmcubGVuZ3RofSBjb25jbHVcdTAwRURkYShzKSBhZ3VhcmRhbmRvIHNhbHZhciAoKyR7dGhpcy5wZW5kaW5nWHB9IFhQKSBcdTIwMTQgY2xpcXVlIGVtIFwiU2FsdmFyIGNvbmNsdVx1MDBFRGRhc1wiLmAgfSk7XG5cbiAgICBpZiAob3B0cy5mdWxsKSB0aGlzLnJlbmRlclhwQ2hhcnQoaG9zdCwgcyk7XG4gICAgaWYgKG9wdHMuZnVsbCkgdGhpcy5yZW5kZXJTY29wZUxldmVscyhob3N0LCBzKTtcbiAgfVxuXG4gIC8vIE5cdTAwRUR2ZWlzIHBvciBlc2NvcG8gKHByb2pldG8vZXRpcXVldGEpOiB0b3AgcG9yIFhQLCBjYWRhIHVtIGNvbSBuXHUwMEVEdmVsICsgbWluaS1iYXJyYS5cbiAgLy8gUmV1c2EgYSBiYXJyYSBkZSBYUCAoYC53ZC1nYW1lLWJhcmApIGUgYGxldmVsSW5mbyh4cClgLlxuICBwcml2YXRlIHJlbmRlclNjb3BlTGV2ZWxzKGhvc3Q6IEhUTUxFbGVtZW50LCBzOiBHYW1lU3RhdHMpIHtcbiAgICBjb25zdCBUT1AgPSA4O1xuICAgIGNvbnN0IHNlY3Rpb24gPSAodGl0bGU6IHN0cmluZywgZGF0YTogTWFwPHN0cmluZywgbnVtYmVyPiwgcHJlZml4ID0gXCJcIiwgcmVuYW1lRW1wdHk/OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHRvcCA9IFsuLi5kYXRhLmVudHJpZXMoKV1cbiAgICAgICAgLmZpbHRlcigoWywgeHBdKSA9PiB4cCA+IDApXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSlcbiAgICAgICAgLnNsaWNlKDAsIFRPUCk7XG4gICAgICBpZiAoIXRvcC5sZW5ndGgpIHJldHVybjtcbiAgICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtc2NvcGVzZWNcIiB9KTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1jaGFydC10aXRsZVwiLCB0ZXh0OiB0aXRsZSB9KTtcbiAgICAgIGZvciAoY29uc3QgW25hbWUsIHhwXSBvZiB0b3ApIHtcbiAgICAgICAgY29uc3QgbGkgPSBsZXZlbEluZm8oeHApO1xuICAgICAgICBjb25zdCBpdGVtID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLWl0ZW1cIiB9KTtcbiAgICAgICAgY29uc3QgaGVhZCA9IGl0ZW0uY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtaGVhZFwiIH0pO1xuICAgICAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1zY29wZS1uYW1lXCIsXG4gICAgICAgICAgdGV4dDogcHJlZml4ICsgKHJlbmFtZUVtcHR5ICYmIG5hbWUgPT09IFwiXHUyMDE0XCIgPyByZW5hbWVFbXB0eSA6IG5hbWUpIH0pO1xuICAgICAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1zY29wZS1tZXRhXCIsIHRleHQ6IGBOdiAke2xpLmxldmVsfSBcdTAwQjcgJHt4cH0gWFBgIH0pO1xuICAgICAgICBjb25zdCBiYXIgPSBpdGVtLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWJhciB3ZC1nYW1lLWJhci1taW5pXCIgfSk7XG4gICAgICAgIGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1iYXItZmlsbFwiIH0pLnN0eWxlLndpZHRoID0gYCR7bGkucGN0fSVgO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xpLmludG99LyR7bGkuZm9yTmV4dH0gWFAgcGFyYSBvIG5cdTAwRUR2ZWwgJHtsaS5sZXZlbCArIDF9YCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZWN0aW9uKFwiTlx1MDBFRHZlaXMgcG9yIHByb2pldG9cIiwgcy5ieVByb2plY3QsIFwiXCIsIFwiU2VtIHByb2pldG9cIik7XG4gICAgc2VjdGlvbihcIk5cdTAwRUR2ZWlzIHBvciBldGlxdWV0YVwiLCBzLmJ5TGFiZWwsIFwiQFwiKTtcbiAgfVxuXG4gIC8vIEdyXHUwMEUxZmljbyBkZSBYUCBwb3IgZGlhIChcdTAwRkFsdGltb3MgTiBkaWFzKSBcdTIwMTQgcmV1c2EgbyB2aXN1YWwgZGUgYmFycmFzIGRvIFwiQ3Jlc2NpbWVudG9cIi5cbiAgcHJpdmF0ZSByZW5kZXJYcENoYXJ0KGhvc3Q6IEhUTUxFbGVtZW50LCBzOiBHYW1lU3RhdHMpIHtcbiAgICBjb25zdCBEQVlTID0gUGxhdGZvcm0uaXNQaG9uZSA/IDE1IDogMzA7XG4gICAgY29uc3QgdG9kYXlLZXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyB4cDogbnVtYmVyOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpOyBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBjb25zdCBhZ2cgPSBzLmJ5RGF5LmdldChrZXkpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCB4cDogYWdnPy54cCA/PyAwLCBjb3VudDogYWdnPy5jb3VudCA/PyAwLCBsYWJlbDogYCR7ZGF5fS8ke219YCB9KTtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF5cy5tYXAoZCA9PiBNYXRoLm1heCgwLCBkLnhwKSksIDEpOyAgIC8vIHNcdTAwRjMgWFAgcG9zaXRpdm8gZGltZW5zaW9uYVxuICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtY2hhcnRzZWNcIiB9KTtcbiAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtY2hhcnQtdGl0bGVcIiwgdGV4dDogYFhQIG5vcyBcdTAwRkFsdGltb3MgJHtEQVlTfSBkaWFzYCB9KTtcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZGF5cy5mb3JFYWNoKCh7IGtleSwgeHAsIGNvdW50LCBsYWJlbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGVtcHR5ID0geHAgPD0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChlbXB0eSA/IFwiIHdkLWdyb3d0aC1iYXItemVyb1wiIDogXCJcIikgfSk7XG4gICAgICBiYXIuc3R5bGUuaGVpZ2h0ID0gZW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoeHAgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xhYmVsfTogJHt4cCA+PSAwID8gXCIrXCIgOiBcIlwifSR7eHB9IFhQIFx1MDBCNyAke2NvdW50fSBmZWl0YShzKWApO1xuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IERBWVMgLSAxIHx8IGlkeCAlIDcgPT09IDA7XG4gICAgICBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1sYmxcIiwgdGV4dDogc2hvd0xibCA/IGxhYmVsIDogXCJcIiB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgc2VjSG9zdHMgPSBuZXcgTWFwPFNlY3Rpb25JZCwgSFRNTEVsZW1lbnQ+KCk7ICAgLy8gd3JhcHBlciBlc3RcdTAwRTF2ZWwgcG9yIHNlXHUwMEU3XHUwMEUzb1xuICBwcml2YXRlIHVuc3ViVG9kbzogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7ICAgICAgICAgIC8vIGNhbmNlbGFyIGluc2NyaVx1MDBFN1x1MDBFM28gbm8gY29udHJvbGxlclxuICBwcml2YXRlIHVuc3ViR2FtZTogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7ICAgICAgICAgIC8vIGlkZW0gcGFyYSBhIEdhbWlmaWNhXHUwMEU3XHUwMEUzb1xuXG4gIC8vIEVzdGFkbyBkbyBTeW5jdGhpbmcgKHYwLjEwLjApXG4gIHByaXZhdGUgc3luY0RhdGE6IFN5bmNEYXRhIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzeW5jRXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIGNvbmZsaWN0Q29uZmlybTogc3RyaW5nIHwgbnVsbCA9IG51bGw7ICAgLy8gcGF0aCBkbyBjb25mbGl0byBhZ3VhcmRhbmRvIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICAvLyBJbnNjcmV2ZSBubyBjb250cm9sbGVyIFx1MDBGQW5pY286IG11ZGFuXHUwMEU3YSBkZSBlc3RhZG8gcmUtcmVuZGVyaXphIHNcdTAwRjMgYSBzZVx1MDBFN1x1MDBFM28gVGFyZWZhcy5cbiAgICB0aGlzLnVuc3ViVG9kbyA9IHRoaXMucGx1Z2luLnRvZG8uc3Vic2NyaWJlKCgpID0+IHRoaXMucmVuZGVyU2VjdGlvbihcInRvZG9pc3RcIikpO1xuICAgIHRoaXMudW5zdWJHYW1lID0gdGhpcy5wbHVnaW4uZ2FtZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZW5kZXJTZWN0aW9uKFwiZ2FtZVwiKSk7XG4gICAgZm9yIChjb25zdCBldiBvZiBbXCJtb2RpZnlcIiwgXCJjcmVhdGVcIiwgXCJkZWxldGVcIiwgXCJyZW5hbWVcIl0gYXMgY29uc3QpXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oZXYgYXMgXCJtb2RpZnlcIiwgKCkgPT4geyB0aGlzLnBsdWdpbi5pbnZhbGlkYXRlVmF1bHRDYWNoZSgpOyB0aGlzLnNjaGVkdWxlKCk7IH0pKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy51bnN1YlRvZG8/LigpO1xuICAgIHRoaXMudW5zdWJUb2RvID0gbnVsbDtcbiAgICB0aGlzLnVuc3ViR2FtZT8uKCk7XG4gICAgdGhpcy51bnN1YkdhbWUgPSBudWxsO1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG5cbiAgLy8gUmUtcmVuZGVyIHBcdTAwRkFibGljbyBcdTIwMTQgY2hhbWFkbyBwZWxvIHBsdWdpbiBxdWFuZG8gYSBjb25maWd1cmFcdTAwRTdcdTAwRTNvIG11ZGEgbmEgYWJhXG4gIC8vIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIChvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMgZGEgU2VtYW5hKS5cbiAgcmVmcmVzaCgpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICAvLyBDYWRhIHNlXHUwMEU3XHUwMEUzbyBtb3JhIG51bSBob3N0IGVzdFx1MDBFMXZlbCBcdTIxOTIgZFx1MDBFMSBwYXJhIHJlLXJlbmRlcml6YXIgdW1hIHNlXHUwMEU3XHUwMEUzbyBzXHUwMEYzXG4gICAgLy8gKGV4LjogcmVmcmVzaCBkbyBUb2RvaXN0L1N5bmN0aGluZykgc2VtIHJlY29uc3RydWlyIGEgdmlldyBpbnRlaXJhLlxuICAgIHRoaXMuc2VjSG9zdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgY29uc3QgaG9zdCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1ob3N0XCIgfSk7XG4gICAgICB0aGlzLnNlY0hvc3RzLnNldChpZCwgaG9zdCk7XG4gICAgICB0aGlzLnJlbmRlclNlY3Rpb24oaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlLXJlbmRlcml6YSBhcGVuYXMgYSBzZVx1MDBFN1x1MDBFM28gYGlkYCBkZW50cm8gZG8gc2V1IGhvc3QgKHNlbSB0b2NhciBuYXMgb3V0cmFzKS5cbiAgcHJpdmF0ZSByZW5kZXJTZWN0aW9uKGlkOiBTZWN0aW9uSWQpIHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5zZWNIb3N0cy5nZXQoaWQpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuZW1wdHkoKTtcbiAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiaGVhdG1hcFwiKSB0aGlzLnJlbmRlckhlYXRtYXAoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJzdGF0c1wiKSAgIHRoaXMucmVuZGVyU3RhdHMoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3QoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwic3luY1wiKSAgICB0aGlzLnJlbmRlclN5bmMoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiZ2FtZVwiKSAgICB0aGlzLnJlbmRlckdhbWUoaG9zdCk7XG4gIH1cblxuICAvLyBGYWl4YSBjb21wYWN0YSBkZSBHYW1pZmljYVx1MDBFN1x1MDBFM28gbm8gZGFzaGJvYXJkIChwYWluZWwgY29tcGxldG8gZmljYSBuYSBhYmEgcHJcdTAwRjNwcmlhKS5cbiAgcHJpdmF0ZSByZW5kZXJHYW1lKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkIHx8IHRoaXMuaXNIaWRkZW4oU0VDX0dBTUUpKSByZXR1cm47XG4gICAgY29uc3Qgc2VjID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1nYW1lLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkdBTUlGSUNBXHUwMEM3XHUwMEMzT1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3Qgb3BlbiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vcGVuYnRuXCIgfSk7XG4gICAgc2V0SWNvbihvcGVuLCBcInRyb3BoeVwiKTtcbiAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIGEgYWJhIGRlIEdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiKTtcbiAgICBjbGlja2FibGUob3BlbiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4ub3BlbkdhbWUoKTsgfSk7XG4gICAgdGhpcy5wbHVnaW4uZ2FtZS5yZW5kZXJQYW5lbChzZWMsIGN0cmxzLCB7IGZ1bGw6IGZhbHNlIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE9jdWx0YXIgKGxlaXR1cmEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0cmFyL29jdWx0YXIgZSBhIG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzIHNcdTAwRTNvIGFkbWluaXN0cmFkb3MgbmEgYWJhIGRlXG4gIC8vIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIGRvIHBsdWdpbi4gQSB2aWV3IHNcdTAwRjMgKmxcdTAwRUEqIGBzZXR0aW5ncy5oaWRkZW5gIHBhcmEgcHVsYXIgbyBxdWVcbiAgLy8gZXN0XHUwMEUxIG9jdWx0by4gVmVyIFdlcnVzU2V0dGluZ1RhYi5cblxuICBwcml2YXRlIGlzSGlkZGVuKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvb2x0aXAgZGUgbm90YXMgcmVjZW50ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBzaG93VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGZpbGVzOiBURmlsZVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiTW9kaWZpY2FkYXMgcmVjZW50ZW1lbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBmIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIFBvc2ljaW9uYSB1bSB0b29sdGlwIGZpeG8gYWJhaXhvIGRvIGFsdm8gKHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3bykuXG4gIHByaXZhdGUgcG9zaXRpb25UaXAodGlwOiBIVE1MRWxlbWVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdHcgPSB0aXAub2Zmc2V0V2lkdGgsIHRoID0gdGlwLm9mZnNldEhlaWdodDtcbiAgICBsZXQgbGVmdCA9IHJlY3QubGVmdDtcbiAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyA2O1xuICAgIGlmIChsZWZ0ICsgdHcgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHR3IC0gODtcbiAgICBpZiAodG9wICsgdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSB0b3AgPSByZWN0LnRvcCAtIHRoIC0gNjsgIC8vIHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3b1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICAvLyBUb29sdGlwIGxpc3RhbmRvIGFzIG5vdGFzIHVyZ2VudGVzIGRlIHVtYSBwYXN0YSAoaG92ZXIgbm8gYmFkZ2UgZGUgYXZpc28pLlxuICBwcml2YXRlIHNob3dVcmdlbmN5VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXVyZ2VuY3ktdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJVcmdlbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICBjb25zdCBkb3QgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC11dGlwLWRvdFwiIH0pO1xuICAgICAgZG90LnN0eWxlLmJhY2tncm91bmQgPSBVUkdFTkNZX0NPTE9SW2l0LmxldmVsXTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGl0LmZpbGUuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBpdC5sZXZlbCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBCYWRnZSBkZSBhdmlzbyAodHJpXHUwMEUybmd1bG8pIG5vIGNhcmQgZGUgcGFzdGEgcXVlIGNvbnRcdTAwRTltIG5vdGFzIGNvbSBgdXJnZW5jeWAuXG4gIC8vIENvciBwZWxvIG5cdTAwRUR2ZWwgbVx1MDBFMXhpbW87IGhvdmVyIGxpc3RhIG9zIGFycXVpdm9zLiBGYXNlIDEwLlxuICBwcml2YXRlIHVyZ2VuY3lCYWRnZShjYXJkOiBIVE1MRWxlbWVudCwgdXJnOiBVcmdlbmN5SW5mbykge1xuICAgIGlmICghdXJnLm1heCkgcmV0dXJuO1xuICAgIGNvbnN0IGIgPSBjYXJkLmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LWJhZGdlIHdkLXUtJHt1cmcubWF4fWAgfSk7XG4gICAgc2V0SWNvbihiLCBcInRyaWFuZ2xlLWFsZXJ0XCIpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VXJnZW5jeVRpcChiLCB1cmcuaXRlbXMpKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZVRpcCgpIHtcbiAgICBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfVxuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hUaXAoY2FyZDogSFRNTEVsZW1lbnQsIHJlY2VudHM6IFRGaWxlW10pIHtcbiAgICBpZiAoIXJlY2VudHMubGVuZ3RoKSByZXR1cm47XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUaXAoY2FyZCwgcmVjZW50cykpO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgLy8gU3VicGFzdGFzIGV4aWJcdTAwRUR2ZWlzIChpZ25vcmEgcGFzdGFzIHNcdTAwRjMtZGUtaW1hZ2VucyksIHZpYSBjYWNoZSBkbyBjb2ZyZS5cbiAgcHJpdmF0ZSBzdWJGb2xkZXJzT2YoZm9sZGVyOiBURm9sZGVyKTogVEZvbGRlcltdIHtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcbiAgICByZXR1cm4gKGZvbGRlci5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+IHsgY29uc3QgYSA9IGNhY2hlLmJ5Rm9sZGVyLmdldChmLnBhdGgpOyByZXR1cm4gIShhICYmIGEuaW1nID4gMCAmJiBhLm1kID09PSAwKTsgfSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhbGVuZFx1MDBFMXJpbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckNhbGVuZGFyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0NBTCkpIHJldHVybjtcblxuICAgIGNvbnN0IG1vbmRheSAgPSBtb25kYXlPZih0aGlzLndlZWtPZmZzZXQpO1xuICAgIGNvbnN0IHdlZWtOdW0gPSBpc29XZWVrTnVtYmVyKG1vbmRheSk7XG4gICAgY29uc3QgdG9kYXlLICA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gRm9udGVzIGF0aXZhcyAocGFzdGFzIG1hcmNhZGFzKS4gQSBjb3IgZGUgY2FkYSBub3RhIHZlbSBkYSBmb250ZSBkZVxuICAgIC8vIHByZWZpeG8gbWFpcyBlc3BlY1x1MDBFRGZpY28gcXVlIGEgY29udFx1MDBFOW0uXG4gICAgY29uc3Qgc291cmNlcyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5maWx0ZXIocyA9PiBzLm9uKTtcbiAgICBjb25zdCBjb2xvckZvciA9IChwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIGxldCBiZXN0OiBDYWxTb3VyY2UgfCBudWxsID0gbnVsbDtcbiAgICAgIGZvciAoY29uc3QgcyBvZiBzb3VyY2VzKSB7XG4gICAgICAgIGlmIChwYXRoID09PSBgJHtzLnBhdGh9Lm1kYCB8fCBwYXRoLnN0YXJ0c1dpdGgoYCR7cy5wYXRofS9gKSkge1xuICAgICAgICAgIGlmICghYmVzdCB8fCBzLnBhdGgubGVuZ3RoID4gYmVzdC5wYXRoLmxlbmd0aCkgYmVzdCA9IHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZXN0ID8gYmVzdC5jb2xvciA6IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFzIG5vdGFzIGNvbSBkYXRhIGpcdTAwRTEgdlx1MDBFQW0gZG8gY2FjaGUgKHVtYSBwYXNzYWRhKTsgYXF1aSBzXHUwMEYzIGZpbHRyYSBwb3IgZm9udGUuXG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIHsgbmFtZTogc3RyaW5nOyBmaWxlOiBURmlsZTsgY29sb3I6IHN0cmluZyB9W10+ID0ge307XG4gICAgZm9yIChjb25zdCB7IGZpbGUsIGRhdGUgfSBvZiB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuZGF0ZWROb3Rlcykge1xuICAgICAgY29uc3QgY29sb3IgPSBjb2xvckZvcihmaWxlLnBhdGgpO1xuICAgICAgaWYgKCFjb2xvcikgY29udGludWU7ICAgLy8gc1x1MDBGMyBub3RhcyBkZW50cm8gZGUgdW1hIGZvbnRlIG1hcmNhZGFcbiAgICAgIChieURheVtkYXRlXSA/Pz0gW10pLnB1c2goeyBuYW1lOiBmaWxlLmJhc2VuYW1lLCBmaWxlLCBjb2xvciB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWNhbC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgbmF2ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmF2LWJhclwiIH0pO1xuICAgIGNvbnN0IHBob25lID0gUGxhdGZvcm0uaXNQaG9uZTtcblxuICAgIC8vIENlbHVsYXI6IGphbmVsYSBkZSAzIGRpYXMgPSBvbnRlbSBcdTAwQjcgaG9qZSBcdTAwQjcgYW1hbmhcdTAwRTMgKHdlZWtPZmZzZXQgcGFnaW5hIGRlIDMgZW0gMykuXG4gICAgY29uc3QgZGF5QW5jaG9yID0gbmV3IERhdGUoKTtcbiAgICBkYXlBbmNob3Iuc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpIC0gMSArIHRoaXMud2Vla09mZnNldCAqIDMpO1xuICAgIGNvbnN0IGZtdERNID0gKGQ6IERhdGUpID0+IGAke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMiwgXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCBcIjBcIil9YDtcblxuICAgIGlmIChwaG9uZSkge1xuICAgICAgY29uc3QgbGFzdCA9IG5ldyBEYXRlKGRheUFuY2hvcik7IGxhc3Quc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpICsgMik7XG4gICAgICBuYXYuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtd2Vlay1sYWJlbFwiLCB0ZXh0OiBgJHtmbXRETShkYXlBbmNob3IpfSBcdTIwMTMgJHtmbXRETShsYXN0KX1gIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYXYuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtd2Vlay1sYWJlbFwiLCB0ZXh0OiBgUmVsYXRcdTAwRjNyaW9zIFx1MDBCNyBzZW1hbmEgJHt3ZWVrTnVtfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY3RybHMgPSBuYXYuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IHByZXYgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzOVwiIH0pO1xuICAgIGNvbnN0IG5leHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgIHByZXYuc2V0QXR0cihcInRpdGxlXCIsIFwiU2VtYW5hIGFudGVyaW9yXCIpO1xuICAgIG5leHQuc2V0QXR0cihcInRpdGxlXCIsIFwiUHJcdTAwRjN4aW1hIHNlbWFuYVwiKTtcbiAgICBjbGlja2FibGUocHJldiwgKCkgPT4geyB0aGlzLndlZWtPZmZzZXQtLTsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgY2xpY2thYmxlKG5leHQsICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0Kys7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENlbHVsYXI6IGxpc3RhIHZlcnRpY2FsIGRlIDMgZGlhcyAob250ZW0vaG9qZS9hbWFuaFx1MDBFMykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ2FkYSBkaWEgPSBhIG5vdGEgZGlcdTAwRTFyaWEgKHVtYSBwb3IgZGlhKS4gTGluaGEgaW50ZWlyYSBjbGljXHUwMEUxdmVsOiBhYnJlIGFcbiAgICAvLyBleGlzdGVudGU7IHNlIG5cdTAwRTNvIGhvdXZlciwgY3JpYS5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1saXN0XCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShkYXlBbmNob3IpO1xuICAgICAgICBkYXkuc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICAgIGNvbnN0IGRvdyA9IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDc7XG4gICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogW1wid2QtY2FsLWRyb3dcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBkb3cgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgcm93LnNldEF0dHIoXCJ0aXRsZVwiLCBub3RlID8gXCJBYnJpciBub3RhIGRpXHUwMEUxcmlhXCIgOiBcIkNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICAgIGNvbnN0IGhkID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1oZFwiIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtkb3ddIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1udW1cIiwgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgICBjb25zdCBib2R5ID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1ub3Rlc1wiIH0pO1xuICAgICAgICBpZiAobm90ZSkge1xuICAgICAgICAgIGNvbnN0IHBpbGwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICAgIHBpbGwudGV4dENvbnRlbnQgPSBub3RlLmJhc2VuYW1lLmxlbmd0aCA+IDI0ID8gbm90ZS5iYXNlbmFtZS5zbGljZSgwLCAyNCkgKyBcIlx1MjAyNlwiIDogbm90ZS5iYXNlbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBib2R5LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWRyb3ctZW1wdHlcIiwgdGV4dDogXCJjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2xpY2thYmxlKHJvdywgKCkgPT4gdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIERlc2t0b3AvdGFibGV0OiBncmFkZSBkZSA3IGRpYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWdyaWRcIiB9KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICAgIGRheS5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBjb2wgPSBncmlkLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogW1wid2QtY2FsLWNvbFwiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGkgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBoZCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWhkXCIgfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2ldIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1udW1cIiwgIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgIGhkLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIC8gY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgIGNsaWNrYWJsZShoZCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7IH0pO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV0gPz8gW107XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zLnNsaWNlKDAsIDMpKSB7XG4gICAgICAgIGNvbnN0IHBpbGwgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgIHBpbGwuc3R5bGUuc2V0UHJvcGVydHkoXCItLXdkLXNyY1wiLCBpdC5jb2xvcik7XG4gICAgICAgIHBpbGwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtcGlsbC1kb3RcIiB9KTtcbiAgICAgICAgcGlsbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1waWxsLXR4dFwiLCB0ZXh0OiBpdC5uYW1lLmxlbmd0aCA+IDE0ID8gaXQubmFtZS5zbGljZSgwLCAxNCkgKyBcIlx1MjAyNlwiIDogaXQubmFtZSB9KTtcbiAgICAgICAgcGlsbC5zZXRBdHRyKFwidGl0bGVcIiwgaXQubmFtZSk7XG4gICAgICAgIGNsaWNrYWJsZShwaWxsLCAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoaXQuZmlsZSkpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDMpIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW1vcmVcIiwgdGV4dDogYCske2l0ZW1zLmxlbmd0aCAtIDN9YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgIGVuZC5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyA2KTtcbiAgICBzZWMuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogXCJ3ZC1jYWwtZm9vdGVyXCIsXG4gICAgICB0ZXh0OiBtb25kYXkuZ2V0TW9udGgoKSA9PT0gZW5kLmdldE1vbnRoKClcbiAgICAgICAgPyBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19ICR7bW9uZGF5LmdldEZ1bGxZZWFyKCl9YFxuICAgICAgICA6IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gXHUyMDEzICR7TU9OVEhfU0hPUlRbZW5kLmdldE1vbnRoKCldfSAke2VuZC5nZXRGdWxsWWVhcigpfWAsXG4gICAgfSk7XG4gIH1cblxuICAvLyBBY2hhIGEgbm90YSBkaVx1MDBFMXJpYSBkZSBga2V5YCAoWVlZWS1NTS1ERCk6IHByaW1laXJvIHBlbG8gY2FtaW5obyBjYW5cdTAwRjRuaWNvIGVtXG4gIC8vIDUwLkRpXHUwMEUxcmlvLywgc2VuXHUwMEUzbyBxdWFscXVlciBub3RhIGN1am8gYGRhdGU6YCBzZWphIGVzc2UgZGlhLiBOdWxsIHNlIG5cdTAwRTNvIGhvdXZlci5cbiAgLy8gKFJlbGF0XHUwMEYzcmlvL25vdGEgZGlcdTAwRTFyaWEgXHUwMEU5IHVtIHBvciBkaWEgXHUyMTkyIGFicmUgbyBleGlzdGVudGUgZW0gdmV6IGRlIGNyaWFyIG91dHJvLilcbiAgcHJpdmF0ZSBmaW5kRGFpbHlOb3RlKGtleTogc3RyaW5nKTogVEZpbGUgfCBudWxsIHtcbiAgICBjb25zdCBkaXJlY3QgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoYCR7REFJTFlfRk9MREVSfS8ke2tleX0ubWRgKTtcbiAgICBpZiAoZGlyZWN0IGluc3RhbmNlb2YgVEZpbGUpIHJldHVybiBkaXJlY3Q7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5kYXRlZE5vdGVzLmZpbmQobiA9PiBuLmRhdGUgPT09IGtleSk/LmZpbGUgPz8gbnVsbDtcbiAgfVxuXG4gIC8vIEFicmUgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgOyBjcmlhIGVtIDUwLkRpXHUwMEUxcmlvLyBTXHUwMEQzIHNlIG5cdTAwRTNvIGV4aXN0aXIgbmVuaHVtYS5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuRGFpbHlOb3RlKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcpIHsgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGV4aXN0aW5nKTsgcmV0dXJuOyB9XG5cbiAgICAvLyBOXHUwMEUzbyBleGlzdGUgXHUyMTkyIGNyaWEgbm8gY2FtaW5obyBjYW5cdTAwRjRuaWNvLlxuICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX0ZPTERFUikpXG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoREFJTFlfRk9MREVSKS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBjb25zdCBbeSwgbSwgZF0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgIGNvbnN0IHRpdHVsbyA9IG5ldyBEYXRlKCt5LCArbSAtIDEsICtkKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICB9KTtcblxuICAgIC8vIFVzYSBvIHRlbXBsYXRlIGVtIE1vZGVsb3MvIHNlIGV4aXN0aXI7IHNlblx1MDBFM28sIGZhbGxiYWNrIGVtYnV0aWRvLlxuICAgIGNvbnN0IHRwbCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9URU1QTEFURSk7XG4gICAgbGV0IGJvZHk6IHN0cmluZztcbiAgICBpZiAodHBsIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgIGJvZHkgPSAoYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0cGwpKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmRhdGVcXHMqXFx9XFx9L2csIGtleSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyp0aXRsZVxccypcXH1cXH0vZywgdGl0dWxvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keSA9XG5gLS0tXG5vd25lcjogV2VydXNcbmNyZWF0ZWQ6ICR7a2V5fVxuZGF0ZTogJHtrZXl9XG5yZXZpZXdlZDogdHJ1ZVxudHlwZTogZGFpbHlcbnBlcm1pc3Npb25zOlxuICByZWFkOiBbYWxsXVxuICB3cml0ZTpcbiAgICAtIFdlcnVzXG4tLS1cblxuIyAke3RpdHVsb31cblxuYDtcbiAgICB9XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGAsIGJvZHkpO1xuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkcyBkbyBjb2ZyZSAodG9kYXMgYXMgcGFzdGFzIGRlIHRvcG8pICsgbmF2ZWdhZG9yIGFuaW5oYWRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyUGFyYShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19QQVJBKSkgcmV0dXJuO1xuICAgIC8vIFNlIGEgcGFzdGEgYWJlcnRhIG5vIG5hdmVnYWRvciBmb2kgb2N1bHRhZGEgbmFzIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzLCBmZWNoYS5cbiAgICBpZiAodGhpcy5uYXZQYXRoICYmIHRoaXMuaXNIaWRkZW4odGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpKSkgdGhpcy5uYXZQYXRoID0gbnVsbDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNPRlJFXCIgfSk7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYXJhLWdyaWRcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSAgIC8vIGlnbm9yYSAub2JzaWRpYW4sIC50cmFzaCwgZXRjLlxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgY29uc3QgYWN0aXZlUm9vdCA9IHRoaXMubmF2UGF0aCA/IHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSA6IG51bGw7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCk7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBhZ2cgICAgID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGZvbGRlci5wYXRoKSA/PyBFTVBUWV9BR0c7XG4gICAgICBjb25zdCBtZXRhICAgID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IGNvdmVyICAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgbmF2aWdhYmxlID0gdGhpcy5zdWJGb2xkZXJzT2YoZm9sZGVyKS5sZW5ndGggPiAwIHx8IGZpbGVzSW4oZm9sZGVyKS5sZW5ndGggPiAwO1xuICAgICAgY29uc3QgaXNBY3RpdmUgPSBhY3RpdmVSb290ID09PSBmb2xkZXIucGF0aDtcblxuICAgICAgY29uc3QgY2FyZCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQgd2QtcGFyYS1jYXJkIHdkLWFuaW0taW5cIiArIChpc0FjdGl2ZSA/IFwiIHdkLWFjdGl2ZVwiIDogXCJcIikgfSk7XG4gICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgY2FyZC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke2lkeCAqIDQwfW1zYDtcbiAgICAgIGlkeCsrO1xuXG4gICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXJcIiB9KS5jcmVhdGVFbChcImltZ1wiLCB7IGF0dHI6IHsgc3JjOiBjb3ZlciwgZHJhZ2dhYmxlOiBcImZhbHNlXCIgfSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRjID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXIgd2QtY292ZXItZGVmYXVsdFwiIH0pO1xuICAgICAgICByZW5kZXJJY29uKGRjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY292ZXItZ2x5cGhcIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIH1cbiAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWFjY2VudC1iYXJcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gbWV0YS5hY2NlbnQ7XG5cbiAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHsgaXRlbXM6IGFnZy51cmdlbmN5LCBtYXg6IGFnZy51cmdlbmN5TWF4IH0pO1xuXG4gICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHsgbWQ6IGFnZy5tZCwgaW1nOiBhZ2cuaW1nIH0pIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgIHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1mb2xkZXJcIiwgdGV4dDogZm9sZGVyLnBhdGggfSk7XG4gICAgICBpZiAobmF2aWdhYmxlKSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oYXMtc3Vic1wiLCB0ZXh0OiBpc0FjdGl2ZSA/IFwiZmVjaGFyIFx1MjVCRVwiIDogXCJhYnJpciBcdTIwM0FcIiB9KTtcblxuICAgICAgaWYgKGFnZy5tZCA+IDApIHtcbiAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHthZ2cucmV2aWV3ZWR9LyR7YWdnLm1kfSByZXZpc2FkYXNgKTtcbiAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChhZ2cucmV2aWV3ZWQgLyBhZ2cubWQgKiAxMDApfSVgO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBhZ2cucmVjZW50KTtcblxuICAgICAgY2xpY2thYmxlKGNhcmQsICgpID0+IHtcbiAgICAgICAgaWYgKG5hdmlnYWJsZSkgeyB0aGlzLm5hdlBhdGggPSBpc0FjdGl2ZSA/IG51bGwgOiBmb2xkZXIucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfVxuICAgICAgICBlbHNlIHJldmVhbEluRXhwbG9yZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWlkeCkgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgdmlzXHUwMEVEdmVsLlwiIH0pO1xuXG4gICAgLy8gQXJxdWl2b3Mgc29sdG9zIG5hIHJhaXogZG8gY29mcmVcbiAgICBjb25zdCByb290RmlsZXMgPSBmaWxlc0luKHZhdWx0Um9vdCk7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhzZWMsIHJvb3RGaWxlcywgXCJhcnF1aXZvcyBuYSByYWl6XCIpO1xuXG4gICAgaWYgKHRoaXMubmF2UGF0aCkge1xuICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMubmF2UGF0aCk7XG4gICAgICBpZiAoZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikgdGhpcy5yZW5kZXJCcm93c2VyKHNlYywgZm9sZGVyKTtcbiAgICB9XG4gIH1cblxuICAvLyBQYWluZWwgaW5saW5lIG5hdmVnXHUwMEUxdmVsIChicmVhZGNydW1iICsgc3VicGFzdGFzICsgbm90YXMgZGEgcGFzdGEgYXR1YWwpXG4gIHByaXZhdGUgcmVuZGVyQnJvd3NlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHRoaXMudG9wRm9sZGVyT2YoZm9sZGVyLnBhdGgpO1xuICAgIGNvbnN0IHJvb3RGb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocm9vdFBhdGgpO1xuICAgIGlmICghKHJvb3RGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCByb290Rm9sZGVyKTtcblxuICAgIGNvbnN0IHBhbmVsID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYW5lbFwiIH0pO1xuICAgIHBhbmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgLy8gQnJlYWRjcnVtYlxuICAgIGNvbnN0IGNydW1iID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNydW1iXCIgfSk7XG4gICAgY29uc3QgcmVsID0gZm9sZGVyLnBhdGggPT09IHJvb3RQYXRoID8gW10gOiBmb2xkZXIucGF0aC5zbGljZShyb290UGF0aC5sZW5ndGggKyAxKS5zcGxpdChcIi9cIik7XG5cbiAgICBjb25zdCByb290U2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChyZWwubGVuZ3RoID09PSAwID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSB9KTtcbiAgICByZW5kZXJJY29uKHJvb3RTZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgcm9vdFNlZy5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICBpZiAocmVsLmxlbmd0aCkgY2xpY2thYmxlKHJvb3RTZWcsICgpID0+IHsgdGhpcy5uYXZQYXRoID0gcm9vdFBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgbGV0IGFjYyA9IHJvb3RQYXRoO1xuICAgIHJlbC5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XG4gICAgICBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlcFwiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gcmVsLmxlbmd0aCAtIDE7XG4gICAgICBhY2MgPSBgJHthY2N9LyR7cGFydH1gO1xuICAgICAgY29uc3Qgc2VnUGF0aCA9IGFjYztcbiAgICAgIGNvbnN0IHNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAoaXNMYXN0ID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSwgdGV4dDogcGFydCB9KTtcbiAgICAgIGlmICghaXNMYXN0KSBjbGlja2FibGUoc2VnLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNlZ1BhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2xvc2UgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWNsb3NlXCIsIHRleHQ6IFwiXHUyNzE1XCIgfSk7XG4gICAgY2xvc2Uuc2V0QXR0cihcInRpdGxlXCIsIFwiRmVjaGFyXCIpO1xuICAgIGNsaWNrYWJsZShjbG9zZSwgKCkgPT4geyB0aGlzLm5hdlBhdGggPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIC8vIENhbXBvIGRlIGJ1c2NhXG4gICAgY29uc3Qgc2VhcmNoV3JhcCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWFyY2gtd3JhcFwiIH0pO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoV3JhcC5jcmVhdGVFbChcImlucHV0XCIsIHtcbiAgICAgIGNsczogXCJ3ZC1zZWFyY2hcIixcbiAgICAgIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcImZpbHRyYXJcdTIwMjZcIiwgdmFsdWU6IHRoaXMuc2VhcmNoVGVybSB9LFxuICAgIH0pO1xuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLXN1Yi1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYmwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLndkLWxhYmVsXCIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbGJsLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1ub3RlLXJvdywgLndkLW5vdGUtY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbC5xdWVyeVNlbGVjdG9yKFwiLndkLW5vdGUtbmFtZSwgLndkLW5vdGUtY2FyZC1uYW1lXCIpPy50ZXh0Q29udGVudCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbmFtZS5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU3VicGFzdGFzIGNvbW8gY2FyZHNcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcbiAgICBjb25zdCBzdWJzID0gdGhpcy5zdWJGb2xkZXJzT2YoZm9sZGVyKTtcbiAgICBpZiAoc3Vicy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNncmlkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2otZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBzZiBvZiBzdWJzKSB7XG4gICAgICAgIGNvbnN0IGFnZyAgICA9IGNhY2hlLmJ5Rm9sZGVyLmdldChzZi5wYXRoKSA/PyBFTVBUWV9BR0c7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlYWRGb2xkZXJTdGF0dXModGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgY292ZXIgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBkZWVwZXIgPSB0aGlzLnN1YkZvbGRlcnNPZihzZikubGVuZ3RoID4gMDtcbiAgICAgICAgY29uc3QgY3VzdG9tSWNvbiA9IHJlYWRGb2xkZXJJY29uKHRoaXMuYXBwLCBzZik7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IHNncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLWNhcmQgd2Qtc3ViLWNhcmQgd2Qtcy0ke3N0YXR1c31gIH0pO1xuICAgICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gc3V0aWwgKHZlcnNcdTAwRTNvIG1lbm9yIHF1ZSBhcyBwYXN0YXMgZGUgdG9wbykgXHUyMDE0IEZhc2UgOS4xXG4gICAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0IHdkLWNvdmVyLXN1YlwiIH0pO1xuICAgICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBjdXN0b21JY29uID8/IFwiXHVEODNEXHVEQ0MxXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1iYWRnZSB3ZC1iYWRnZS0ke3N0YXR1c31gLCB0ZXh0OiBTVEFUVVNfSUNPTltzdGF0dXNdIH0pO1xuICAgICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB7IGl0ZW1zOiBhZ2cudXJnZW5jeSwgbWF4OiBhZ2cudXJnZW5jeU1heCB9KTtcblxuICAgICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgICBpZiAoY3VzdG9tSWNvbikgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uIHdkLXN1Yi1pY29uXCIgfSksIGN1c3RvbUljb24pO1xuICAgICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoeyBtZDogYWdnLm1kLCBpbWc6IGFnZy5pbWcgfSkgfSk7XG4gICAgICAgIGlmIChkZWVwZXIpIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN1Yi1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgdGV4dDogc2YubmFtZSB9KTtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikgbGFiZWwuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gXCJjYW5jZWxsZWRcIiAmJiBhZ2cubWQgPiAwKSB7XG4gICAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhc2ApO1xuICAgICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChhZ2cucmV2aWV3ZWQgLyBhZ2cubWQgKiAxMDApfSVgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNhcmQuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgYWdnLnJlY2VudCk7XG4gICAgICAgICAgY2xpY2thYmxlKGNhcmQsICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2YucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcnF1aXZvcyBkYSBwYXN0YSBhdHVhbCAobm90YXMsIGNhbnZhcywgYmFzZXMpXG4gICAgY29uc3Qgbm90ZXMgPSBmaWxlc0luKGZvbGRlcik7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhwYW5lbCwgbm90ZXMpO1xuXG4gICAgaWYgKCFzdWJzLmxlbmd0aCAmJiAhbm90ZXMubGVuZ3RoKVxuICAgICAgcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiUGFzdGEgdmF6aWEuXCIgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhdG1hcCAodmlhIHBsdWdpbiBIZWF0bWFwIENhbGVuZGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYXRtYXAocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfSEVBVCkpIHJldHVybjtcbiAgICBpZiAoUGxhdGZvcm0uaXNQaG9uZSkgcmV0dXJuOyAgIC8vIGhlYXRtYXAgKGFubyBpbnRlaXJvKSBvY3VsdGFkbyBubyBjZWx1bGFyXG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWhlYXQtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQVRJVklEQURFIERPIENPRlJFXCIgfSk7XG5cbiAgICBjb25zdCByZW5kZXIgPSBnZXRIZWF0bWFwUmVuZGVyZXIoKTtcbiAgICBpZiAoIXJlbmRlcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiAnQXRpdmUgbyBwbHVnaW4gXCJIZWF0bWFwIENhbGVuZGFyXCIgcGFyYSB2ZXIgYSBhdGl2aWRhZGUuJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3RhcyBjcmlhZGFzIHBvciBkaWEgKGRvIGNhY2hlKSwgZmlsdHJhZGFzIHBlbG8gYW5vIGNvcnJlbnRlLlxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgcHJlZml4ID0gU3RyaW5nKHllYXIpO1xuICAgIGNvbnN0IGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdID0gW107XG4gICAgZm9yIChjb25zdCBbZGF0ZSwgbl0gb2YgdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmN0aW1lQnlEYXkpIHtcbiAgICAgIGlmICghZGF0ZS5zdGFydHNXaXRoKHByZWZpeCkpIGNvbnRpbnVlO1xuICAgICAgZW50cmllcy5wdXNoKHsgZGF0ZSwgaW50ZW5zaXR5OiBuLCBjb2xvcjogXCJncmVlblwiLCBjb250ZW50OiBgJHtufSBub3RhKHMpYCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYXQtYm94XCIgfSk7XG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlcihib3gsIHtcbiAgICAgICAgeWVhcixcbiAgICAgICAgY29sb3JzOiB7IGdyZWVuOiBbXCIjMWUzYTJmXCIsIFwiIzFmNmY0M1wiLCBcIiMyYmE4NWFcIiwgXCIjMzlkMzUzXCJdIH0sXG4gICAgICAgIHNob3dDdXJyZW50RGF5Qm9yZGVyOiB0cnVlLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZWMuZW1wdHkoKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJGYWxoYSBhbyByZW5kZXJpemFyIG8gaGVhdG1hcC5cIiB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRXN0YXRcdTAwRURzdGljYXMgZG8gY29mcmUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJTdGF0cyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19TVEFUKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCk7XG4gICAgY29uc3QgdG90YWxOb3RlcyA9IGNhY2hlLnRvdGFsTm90ZXM7XG4gICAgY29uc3QgdG90YWxSZXZpZXdlZCA9IGNhY2hlLnRvdGFsUmV2aWV3ZWQ7XG4gICAgLy8gXCJlc3RhIHNlbWFuYVwiID0gY3JpYVx1MDBFN1x1MDBGNWVzIG5vcyBcdTAwRkFsdGltb3MgNyBkaWFzIChkbyBjYWNoZSwgcG9yIGRhdGEgXHUyMTkyIHNlbXByZSBmcmVzY28pLlxuICAgIGxldCBjcmVhdGVkVGhpc1dlZWsgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTsgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjcmVhdGVkVGhpc1dlZWsgKz0gY2FjaGUuY3RpbWVCeURheS5nZXQodG9LZXkoZCkpID8/IDA7XG4gICAgfVxuICAgIGNvbnN0IGdsb2JhbFBjdCA9IHRvdGFsTm90ZXMgPiAwID8gTWF0aC5yb3VuZCh0b3RhbFJldmlld2VkIC8gdG90YWxOb3RlcyAqIDEwMCkgOiAwO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiRVNUQVRcdTAwQ0RTVElDQVNcIiB9KTtcblxuICAgIC8vIE5cdTAwRkFtZXJvcyBnbG9iYWlzXG4gICAgY29uc3QgZ2xvYiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1nbG9iYWxcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWdcIiwgdGV4dDogU3RyaW5nKHRvdGFsTm90ZXMpIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcIm5vdGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnIHdkLXN0YXQtcmV2LW51bVwiLCB0ZXh0OiBgJHtnbG9iYWxQY3R9JWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwicmV2aXNhZGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtd2Vla1wiLCB0ZXh0OiBgKyR7Y3JlYXRlZFRoaXNXZWVrfWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwiZXN0YSBzZW1hbmFcIiB9KTtcblxuICAgIC8vIEJyZWFrZG93biBwb3IgcGFzdGFcbiAgICBjb25zdCB0YWJsZSA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC10YWJsZVwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcblxuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG4gICAgICBjb25zdCBhZ2cgPSBjYWNoZS5ieUZvbGRlci5nZXQoZm9sZGVyLnBhdGgpID8/IEVNUFRZX0FHRztcbiAgICAgIGlmIChhZ2cubWQgPT09IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBwY3QgPSBNYXRoLnJvdW5kKGFnZy5yZXZpZXdlZCAvIGFnZy5tZCAqIDEwMCk7XG5cbiAgICAgIGNvbnN0IHJvdyA9IHRhYmxlLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXJvd1wiIH0pO1xuICAgICAgcm93LnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgICBjb25zdCBuYW1lRWwgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZm9sZGVyXCIgfSk7XG4gICAgICByZW5kZXJJY29uKG5hbWVFbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgbmFtZUVsLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtY291bnRcIiwgdGV4dDogYCR7YWdnLm1kfWAgfSk7XG5cbiAgICAgIGNvbnN0IGJhcldyYXAgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyXCIgfSk7XG4gICAgICBiYXJXcmFwLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHthZ2cucmV2aWV3ZWR9LyR7YWdnLm1kfSByZXZpc2FkYXMgKCR7cGN0fSUpYCk7XG4gICAgICBjb25zdCBmaWxsID0gYmFyV3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXItZmlsbFwiIH0pO1xuICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXBjdFwiLCB0ZXh0OiBgJHtwY3R9JWAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIExpc3RhIC8gZ3JhZGUgZGUgbm90YXMgY29tIHRvZ2dsZSBlIGluZGljYWRvciByZXZpZXdlZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlck5vdGVzKHBhcmVudDogSFRNTEVsZW1lbnQsIG5vdGVzOiBURmlsZVtdLCBsYWJlbCA9IFwiXCIpIHtcbiAgICBpZiAoIW5vdGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGlzR3JpZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID09PSBcImdyaWRcIjtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IHRoaXMucmV2aWV3RmlsdGVyID8gbm90ZXMuZmlsdGVyKGYgPT4gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgIT09IHRydWUpIDogbm90ZXM7XG5cbiAgICBjb25zdCBoZHIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWhkclwiIH0pO1xuICAgIGNvbnN0IGNvdW50VHh0ID0gdGhpcy5yZXZpZXdGaWx0ZXJcbiAgICAgID8gYCR7ZmlsdGVyZWQubGVuZ3RofSBwZW5kZW50ZSR7ZmlsdGVyZWQubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifSAvICR7bm90ZXMubGVuZ3RofWBcbiAgICAgIDogKGxhYmVsIHx8IGAke25vdGVzLmxlbmd0aH0gbm90YSR7bm90ZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWApO1xuICAgIGhkci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGVzLWxhYmVsXCIsIHRleHQ6IGNvdW50VHh0IH0pO1xuXG4gICAgY29uc3QgdG9nID0gaGRyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC12aWV3LXRvZ2dsZVwiIH0pO1xuICAgIGNvbnN0IGJ0blBlbmQgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKHRoaXMucmV2aWV3RmlsdGVyID8gXCIgd2Qtdmlldy1hY3RpdmUgd2Qtdmlldy1wZW5kXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1Q0JcIiB9KTtcbiAgICBidG5QZW5kLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vc3RyYXIgc1x1MDBGMyBwZW5kZW50ZXMgKG5cdTAwRTNvIHJldmlzYWRhcylcIik7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyh0aGlzLnJldmlld0ZpbHRlcikpO1xuICAgIGNsaWNrYWJsZShidG5QZW5kLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5yZXZpZXdGaWx0ZXIgPSAhdGhpcy5yZXZpZXdGaWx0ZXI7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNvbnN0IGJ0bkwgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCFpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjYxXCIgfSk7XG4gICAgYnRuTC5zZXRBdHRyKFwidGl0bGVcIiwgXCJMaXN0YVwiKTtcbiAgICBidG5MLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKCFpc0dyaWQpKTtcbiAgICBjbGlja2FibGUoYnRuTCwgYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJsaXN0XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjb25zdCBidG5HID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArIChpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjlFXCIgfSk7XG4gICAgYnRuRy5zZXRBdHRyKFwidGl0bGVcIiwgXCJDb2x1bmFzXCIpO1xuICAgIGJ0bkcuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcoaXNHcmlkKSk7XG4gICAgY2xpY2thYmxlKGJ0bkcsIGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwiZ3JpZFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICBpZiAoIWZpbHRlcmVkLmxlbmd0aCkge1xuICAgICAgcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiB0aGlzLnJldmlld0ZpbHRlciA/IFwiTmVuaHVtYSBub3RhIHBlbmRlbnRlIG5lc3RhIHBhc3RhLlwiIDogXCJOZW5odW1hIG5vdGEuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzR3JpZCkge1xuICAgICAgY29uc3QgZ3JpZCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY2FyZCB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBwb3IgdGlwbyBkZSBhcnF1aXZvIChub3RhIC8gY2FudmFzIC8gYmFzZSkgXHUyMDE0IEZhc2UgOS4yXG4gICAgICAgIGNvbnN0IGNvdiA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jb3ZlciB3ZC1maWxlLSR7Zi5leHRlbnNpb259YCB9KTtcbiAgICAgICAgc2V0SWNvbihjb3YuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLWNvdmVyLWdseXBoXCIgfSksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuXG4gICAgICAgIGlmIChpc01kKSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHVyZykgeyBjb25zdCB3ID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cblxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIGNsaWNrYWJsZShjYXJkLCAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZikpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaXN0ID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWxpc3RcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtcm93IHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICBjb25zdCB0aSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS10eXBlaWNvbiB3ZC1maWxlLSR7Zi5leHRlbnNpb259YCB9KTtcbiAgICAgICAgc2V0SWNvbih0aSwgZmlsZUdseXBoKGYuZXh0ZW5zaW9uKSk7XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtZG90IHdkLWJhZGdlLSR7c3R9YCB9KTtcblxuICAgICAgICBjb25zdCBuYW1lID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgaWYgKHVyZykgeyBjb25zdCB3ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LW1hcmsgd2QtdS0ke3VyZ31gIH0pOyBzZXRJY29uKHcsIFwidHJpYW5nbGUtYWxlcnRcIik7IHcuc2V0QXR0cihcInRpdGxlXCIsIGBVcmdcdTAwRUFuY2lhOiAke3VyZ31gKTsgfVxuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmIChzdCAhPT0gXCJjYW5jZWxsZWRcIikgY2xpY2thYmxlKHJvdywgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR3JcdTAwRTFmaWNvIGRlIGNyZXNjaW1lbnRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyR3Jvd3RoKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0dST1cpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDUkVTQ0lNRU5UTyBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgYnRuRGF5ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiZGlhXCIgfSk7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5vdGFzIGNyaWFkYXMgcG9yIGRpYVwiKTtcbiAgICBidG5EYXkuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkpO1xuICAgIGNsaWNrYWJsZShidG5EYXksIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgY29uc3QgYnRuQ3VtID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJ0b3RhbFwiIH0pO1xuICAgIGJ0bkN1bS5zZXRBdHRyKFwidGl0bGVcIiwgXCJUb3RhbCBhY3VtdWxhZG8gbm8gcGVyXHUwMEVEb2RvXCIpO1xuICAgIGJ0bkN1bS5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyh0aGlzLmdyb3d0aEN1bXVsYXRpdmUpKTtcbiAgICBjbGlja2FibGUoYnRuQ3VtLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gdHJ1ZTsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICAvLyBOb3RhcyBwb3IgZGF0YSBkZSBjcmlhXHUwMEU3XHUwMEUzbyAoZG8gY2FjaGUpLlxuICAgIGNvbnN0IGNvdW50cyA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5jdGltZUJ5RGF5O1xuXG4gICAgLy8gXHUwMERBbHRpbW9zIE4gZGlhcyAobWVub3Mgbm8gY2VsdWxhcilcbiAgICBjb25zdCBEQVlTID0gUGxhdGZvcm0uaXNQaG9uZSA/IDE1IDogMzA7XG4gICAgY29uc3QgZGF5czogeyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gREFZUyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb25zdCBbLCBtLCBkYXldID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICAgIGRheXMucHVzaCh7IGtleSwgY291bnQ6IGNvdW50cy5nZXQoa2V5KSA/PyAwLCBsYWJlbDogYCR7ZGF5fS8ke219YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbCA9IGRheXMucmVkdWNlKChzLCBkKSA9PiBzICsgZC5jb3VudCwgMCk7XG4gICAgY29uc3QgdG9kYXlLZXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIE1vZG8gY3VtdWxhdGl2bzogc29tYSBhY3VtdWxhZGEgZGlhIGEgZGlhXG4gICAgdHlwZSBEYXlFbnRyeSA9IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmc7IGRpc3BsYXlWYWw6IG51bWJlciB9O1xuICAgIGxldCBlbnRyaWVzOiBEYXlFbnRyeVtdO1xuICAgIGlmICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUpIHtcbiAgICAgIGxldCBhY2MgPSAwO1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4geyBhY2MgKz0gZC5jb3VudDsgcmV0dXJuIHsgLi4uZCwgZGlzcGxheVZhbDogYWNjIH07IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiAoeyAuLi5kLCBkaXNwbGF5VmFsOiBkLmNvdW50IH0pKTtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZW50cmllcy5tYXAoZSA9PiBlLmRpc3BsYXlWYWwpLCAxKTtcblxuICAgIC8vIExpbmhhIGRlIHJlc3Vtb1xuICAgIGNvbnN0IGluZm8gPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1pbmZvXCIgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC10b3RhbFwiLCB0ZXh0OiBgJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBlbnRyaWVzW2VudHJpZXMubGVuZ3RoIC0gMV0uZGlzcGxheVZhbCA6IHRvdGFsfWAgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC1wZXJpb2RcIiwgdGV4dDogdGhpcy5ncm93dGhDdW11bGF0aXZlID8gYG5vdGFzIGFjdW11bGFkYXMgKCR7REFZU30gZGlhcylgIDogYG5vdGFzIGNyaWFkYXMgbm9zIFx1MDBGQWx0aW1vcyAke0RBWVN9IGRpYXNgIH0pO1xuXG4gICAgLy8gR3JcdTAwRTFmaWNvIGRlIGJhcnJhc1xuICAgIGNvbnN0IGNoYXJ0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY2hhcnRcIiB9KTtcbiAgICBlbnRyaWVzLmZvckVhY2goKHsga2V5LCBjb3VudCwgbGFiZWwsIGRpc3BsYXlWYWwgfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNvbFwiICsgKGtleSA9PT0gdG9kYXlLZXkgPyBcIiB3ZC1ncm93dGgtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgYmFyQXJlYSA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhci1hcmVhXCIgfSk7XG4gICAgICBjb25zdCBpc0VtcHR5ID0gZGlzcGxheVZhbCA9PT0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChpc0VtcHR5ID8gXCIgd2QtZ3Jvd3RoLWJhci16ZXJvXCIgOiBcIlwiKSB9KTtcbiAgICAgIGJhci5zdHlsZS5oZWlnaHQgPSBpc0VtcHR5ID8gXCIzcHhcIiA6IGAke01hdGgubWF4KDUsIE1hdGgucm91bmQoKGRpc3BsYXlWYWwgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBpZiAoIWlzRW1wdHkpIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7bGFiZWx9OiAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGRpc3BsYXlWYWwgKyBcIiB0b3RhbFwiIDogY291bnQgKyBcIiBub3RhKHMpXCJ9YCk7XG5cbiAgICAgIGNvbnN0IHNob3dMYmwgPSBpZHggPT09IDAgfHwgaWR4ID09PSA3IHx8IGlkeCA9PT0gMTQgfHwgaWR4ID09PSAyMSB8fCBpZHggPT09IDI5IHx8IGtleSA9PT0gdG9kYXlLZXk7XG4gICAgICBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1sYmxcIiwgdGV4dDogc2hvd0xibCA/IGxhYmVsIDogXCJcIiB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IChkZWxlZ2FkbyBhbyBUb2RvaXN0Q29udHJvbGxlciBjb21wYXJ0aWxoYWRvKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclRvZG9pc3Qocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfVE9ETykpIHJldHVybjtcbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgLy8gQm90XHUwMEUzbyBkZSBuYXZlZ2FcdTAwRTdcdTAwRTNvIFx1MjE5MiBhYnJlIGEgYWJhIGRlZGljYWRhIGRvIFRvZG9pc3QgKG8gZGFzaGJvYXJkIFx1MDBFOSBvIGh1YikuXG4gICAgY29uc3Qgb3BlbiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vcGVuYnRuXCIgfSk7XG4gICAgc2V0SWNvbihvcGVuLCBcInNxdWFyZS1hcnJvdy1vdXQtdXAtcmlnaHRcIik7XG4gICAgb3Blbi5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBhIGFiYSBkbyBUb2RvaXN0XCIpO1xuICAgIGNsaWNrYWJsZShvcGVuLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLnBsdWdpbi5vcGVuVG9kb2lzdCgpOyB9KTtcbiAgICAvLyBMYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgY29tcGFjdG8gKHNvbWUgc2Ugblx1MDBFM28gaG91dmVyIHBhY290ZXMpLlxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyUGFja2FnZXMoc2VjKTtcbiAgICAvLyBEYXNoYm9hcmQgPSBzXHUwMEYzIG8gZXNzZW5jaWFsIChBdHJhc2FkYXMgXHUwMEI3IEhvamUgXHUwMEI3IFByXHUwMEYzeGltb3MgNykuIFwiRGVwb2lzXCIgZmljYVxuICAgIC8vIHNcdTAwRjMgbmEgYWJhIGRvIFRvZG9pc3QgXHUyMTkyIHJlY29ycmVudGVzIHNcdTAwRjMgYXBhcmVjZW0gYXF1aSBwZXJ0byBkbyBkaWEuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMsIHsgc2hvd0xhdGVyOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nICsgY29uZmxpdG9zKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICByZXNldFN5bmMoKSB7XG4gICAgdGhpcy5zeW5jRGF0YSA9IG51bGw7XG4gICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoU3luYyhtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmICghYmFzZSB8fCAha2V5IHx8IHRoaXMuc3luY0xvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHN0R2V0PFNURm9sZGVyW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZm9sZGVyc1wiKTtcbiAgICAgIGNvbnN0IHdhbnRlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkLnRyaW0oKTtcbiAgICAgIGNvbnN0IGZvbGRlciA9IGZvbGRlcnMuZmluZChmID0+IGYuaWQgPT09IHdhbnRlZCkgPz8gZm9sZGVyc1swXTtcbiAgICAgIGlmICghZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJuZW5odW1hIHBhc3RhIGNvbmZpZ3VyYWRhIG5vIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNvbnN0IGZpZCA9IGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIuaWQpO1xuXG4gICAgICBjb25zdCBbZGV2aWNlcywgY29ubnMsIHN0YXR1cywgc3RhdHMsIHN5c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0R2V0PFNURGV2aWNlW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZGV2aWNlc1wiKSxcbiAgICAgICAgc3RHZXQ8eyBjb25uZWN0aW9uczogUmVjb3JkPHN0cmluZywgeyBjb25uZWN0ZWQ6IGJvb2xlYW4gfT4gfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9jb25uZWN0aW9uc1wiKSxcbiAgICAgICAgc3RHZXQ8U1RTdGF0dXM+KGJhc2UsIGtleSwgYC9yZXN0L2RiL3N0YXR1cz9mb2xkZXI9JHtmaWR9YCksXG4gICAgICAgIHN0R2V0PFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9Pj4oYmFzZSwga2V5LCBcIi9yZXN0L3N0YXRzL2RldmljZVwiKS5jYXRjaCgoKSA9PiAoe30gYXMgUmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+KSksXG4gICAgICAgIHN0R2V0PHsgbXlJRDogc3RyaW5nIH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vc3RhdHVzXCIpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZSA9IGRldmljZXMuZmlsdGVyKGQgPT4gZC5kZXZpY2VJRCAhPT0gc3lzLm15SUQpO1xuICAgICAgY29uc3Qgcm93cyA9IGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZS5tYXAoYXN5bmMgZCA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBhd2FpdCBzdEdldDxTVENvbXBsZXRpb24+KGJhc2UsIGtleSwgYC9yZXN0L2RiL2NvbXBsZXRpb24/Zm9sZGVyPSR7ZmlkfSZkZXZpY2U9JHtkLmRldmljZUlEfWApXG4gICAgICAgICAgLmNhdGNoKCgpID0+ICh7IGNvbXBsZXRpb246IDAsIGdsb2JhbEl0ZW1zOiAwLCBuZWVkSXRlbXM6IDAsIG5lZWRCeXRlczogMCwgbmVlZERlbGV0ZXM6IDAgfSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGQubmFtZSB8fCBkLmRldmljZUlELnNsaWNlKDAsIDcpLFxuICAgICAgICAgIG9ubGluZTogISFjb25ucy5jb25uZWN0aW9uc1tkLmRldmljZUlEXT8uY29ubmVjdGVkLFxuICAgICAgICAgIGNvbXBsZXRpb246IGMuY29tcGxldGlvbixcbiAgICAgICAgICBnbG9iYWxJdGVtczogYy5nbG9iYWxJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRJdGVtczogYy5uZWVkSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkQnl0ZXM6IGMubmVlZEJ5dGVzLFxuICAgICAgICAgIG5lZWREZWxldGVzOiBjLm5lZWREZWxldGVzLFxuICAgICAgICAgIGxhc3RTZWVuOiBzdGF0c1tkLmRldmljZUlEXT8ubGFzdFNlZW4gPz8gXCJcIixcbiAgICAgICAgfTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5zeW5jRGF0YSA9IHtcbiAgICAgICAgc3RhdGU6IHN0YXR1cy5zdGF0ZSxcbiAgICAgICAgbmVlZEZpbGVzOiBzdGF0dXMubmVlZEZpbGVzLFxuICAgICAgICBuZWVkQnl0ZXM6IHN0YXR1cy5uZWVkQnl0ZXMsXG4gICAgICAgIGZvbGRlckxhYmVsOiBmb2xkZXIubGFiZWwgfHwgZm9sZGVyLmlkLFxuICAgICAgICBlcnJvcnM6IChzdGF0dXMuZXJyb3JzID8/IDApICsgKHN0YXR1cy5wdWxsRXJyb3JzID8/IDApLFxuICAgICAgICBkZXZpY2VzOiByb3dzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zeW5jRXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NZTkMpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXN5bmMtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiU0lOQ1JPTklaQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5zeW5jTG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciBlc3RhZG8gZG8gU3luY3RoaW5nXCIpO1xuICAgICAgY2xpY2thYmxlKHJlZnJlc2gsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuZmV0Y2hTeW5jKHRydWUpOyB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWtleSkge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNvbmZpZ3VyZSBhIFVSTCBlIGEgQVBJIGtleSBkbyBTeW5jdGhpbmcgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZC5cIiB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3luY0Vycm9yKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZXJyb3JcIiwgdGV4dDogYEVycm8gYW8gZmFsYXIgY29tIG8gU3luY3RoaW5nOiAke3RoaXMuc3luY0Vycm9yfWAgfSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5zeW5jRmV0Y2hlZEF0KSB7XG4gICAgICBpZiAoIXRoaXMuc3luY0xvYWRpbmcpIHZvaWQgdGhpcy5mZXRjaFN5bmMoZmFsc2UpO1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG9cdTIwMjZcIiB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJTeW5jQm9keShzZWMsIHRoaXMuc3luY0RhdGEhKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlckNvbmZsaWN0cyhzZWMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jQm9keShzZWM6IEhUTUxFbGVtZW50LCBkOiBTeW5jRGF0YSkge1xuICAgIGNvbnN0IGJveCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1ib3hcIiB9KTtcblxuICAgIC8vIEVzdGFkbyBkYSBwYXN0YS5cbiAgICBjb25zdCBidXN5ID0gZC5zdGF0ZSA9PT0gXCJzeW5jaW5nXCIgfHwgZC5zdGF0ZSA9PT0gXCJzY2FubmluZ1wiO1xuICAgIGNvbnN0IGZsID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWZvbGRlclwiIH0pO1xuICAgIGNvbnN0IGRvdCA9IGZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kb3QgXCIgKyAoZC5lcnJvcnMgPyBcIndkLXMtZXJyXCIgOiBidXN5ID8gXCJ3ZC1zLWJ1c3lcIiA6IFwid2Qtcy1va1wiKSB9KTtcbiAgICBkb3Quc2V0VGV4dChkLmVycm9ycyA/IFwiXHUyNkEwXCIgOiBidXN5ID8gXCJcdTI3RjNcIiA6IFwiXHUyNUNGXCIpO1xuICAgIGZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1mbmFtZVwiLCB0ZXh0OiBkLmZvbGRlckxhYmVsIH0pO1xuICAgIGNvbnN0IHN0ID0gZC5zdGF0ZSA9PT0gXCJpZGxlXCIgPyBcImVtIGRpYVwiIDogZC5zdGF0ZSA9PT0gXCJzeW5jaW5nXCIgPyBgc2luY3Jvbml6YW5kbyBcdTIwMTQgJHtkLm5lZWRGaWxlc30gaXRlbnMgKCR7aHVtYW5CeXRlcyhkLm5lZWRCeXRlcyl9KWAgOiBkLnN0YXRlO1xuICAgIGZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1mc3RhdGVcIiwgdGV4dDogc3QgfSk7XG5cbiAgICAvLyBBcGFyZWxob3MuXG4gICAgZm9yIChjb25zdCBkZXYgb2YgZC5kZXZpY2VzKSB7XG4gICAgICBjb25zdCByb3cgPSBib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtZGV2XCIgfSk7XG4gICAgICBjb25zdCBvID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kb3QgXCIgKyAoZGV2Lm9ubGluZSA/IFwid2Qtcy1va1wiIDogXCJ3ZC1zLW9mZlwiKSB9KTtcbiAgICAgIG8uc2V0VGV4dChcIlx1MjVDRlwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG5hbWVcIiwgdGV4dDogZGV2Lm5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRjb21wXCIsIHRleHQ6IGAke01hdGgucm91bmQoZGV2LmNvbXBsZXRpb24pfSVgIH0pO1xuICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgJiYgZGV2Lmdsb2JhbEl0ZW1zKVxuICAgICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRjb3VudFwiLCB0ZXh0OiBgJHtkZXYuZ2xvYmFsSXRlbXMgLSBkZXYubmVlZEl0ZW1zfS8ke2Rldi5nbG9iYWxJdGVtc31gIH0pO1xuICAgICAgY29uc3QgZXh0cmEgPSBkZXYubmVlZERlbGV0ZXMgPyBgJHtkZXYubmVlZERlbGV0ZXN9IGV4Y2x1c1x1MDBGNWVzYCA6IGRldi5uZWVkQnl0ZXMgPyBodW1hbkJ5dGVzKGRldi5uZWVkQnl0ZXMpIDogXCJcIjtcbiAgICAgIGlmIChleHRyYSkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kcGVuZFwiLCB0ZXh0OiBleHRyYSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHNlZW5cIiwgdGV4dDogZGV2Lm9ubGluZSA/IFwib25saW5lXCIgOiByZWxUaW1lKGRldi5sYXN0U2VlbikgfSk7XG4gICAgfVxuXG4gICAgaWYgKGQuZXJyb3JzKSBib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtZXJybGluZVwiLCB0ZXh0OiBgXHUyNkEwICR7ZC5lcnJvcnN9IGVycm8ocykgbmEgcGFzdGFgIH0pO1xuICB9XG5cbiAgLy8gTGlzdGEgZGUgY1x1MDBGM3BpYXMgZGUgY29uZmxpdG8gZG8gU3luY3RoaW5nIChhYnJpciAvIGFwYWdhciBjb20gY29uZmlybWFcdTAwRTdcdTAwRTNvKS5cbiAgcHJpdmF0ZSByZW5kZXJDb25mbGljdHMoc2VjOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGNvbmZsaWN0cyA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKCkuZmlsdGVyKGYgPT4gZi5uYW1lLmluY2x1ZGVzKFwiLnN5bmMtY29uZmxpY3QtXCIpKTtcbiAgICBjb25zdCB3cmFwID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWNvbmZsaWN0c1wiIH0pO1xuICAgIHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtc3ViXCIsIHRleHQ6IGBDb25mbGl0b3MgKCR7Y29uZmxpY3RzLmxlbmd0aH0pYCB9KTtcbiAgICBpZiAoIWNvbmZsaWN0cy5sZW5ndGgpIHtcbiAgICAgIHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtbm9jb25mXCIsIHRleHQ6IFwiTmVuaHVtIGNvbmZsaXRvLiBcdUQ4M0NcdURGODlcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIGNvbmZsaWN0cykge1xuICAgICAgY29uc3Qgcm93ID0gd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jcm93XCIgfSk7XG4gICAgICBjb25zdCBuYW1lID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jbmFtZVwiLCB0ZXh0OiBmLm5hbWUgfSk7XG4gICAgICBuYW1lLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIFwiICsgZi5wYXRoKTtcbiAgICAgIGNsaWNrYWJsZShuYW1lLCAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZikpO1xuICAgICAgaWYgKHRoaXMuY29uZmxpY3RDb25maXJtID09PSBmLnBhdGgpIHtcbiAgICAgICAgY29uc3QgeWVzID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jeWVzXCIsIHRleHQ6IFwiYXBhZ2FyP1wiIH0pO1xuICAgICAgICBjbGlja2FibGUoeWVzLCBhc3luYyAoKSA9PiB7IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnRyYXNoKGYsIGZhbHNlKTsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBudWxsOyB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpOyB9KTtcbiAgICAgICAgY29uc3Qgbm8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNub1wiLCB0ZXh0OiBcImNhbmNlbGFyXCIgfSk7XG4gICAgICAgIGNsaWNrYWJsZShubywgKCkgPT4geyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IG51bGw7IHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGVsID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jZGVsXCIgfSk7XG4gICAgICAgIHNldEljb24oZGVsLCBcInRyYXNoLTJcIik7XG4gICAgICAgIGRlbC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBcGFnYXIgY1x1MDBGM3BpYSBkZSBjb25mbGl0byAodmFpIHBhcmEgYSBsaXhlaXJhKVwiKTtcbiAgICAgICAgY2xpY2thYmxlKGRlbCwgKCkgPT4geyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IGYucGF0aDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYWRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYWRlcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIlNlY29uZCBCcmFpblwiIH0pO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQbHVnaW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlcnVzRGFzaGJvYXJkIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IERhc2hTZXR0aW5ncyA9IERFRkFVTFRfU0VUVElOR1M7XG4gIC8vIENvbnRyb2xhZG9yIFx1MDBGQW5pY28gZG8gVG9kb2lzdCAoZXN0YWRvIGNvbXBhcnRpbGhhZG8gZW50cmUgZGFzaGJvYXJkIGUgYWJhKS5cbiAgdG9kbyE6IFRvZG9pc3RDb250cm9sbGVyO1xuICAvLyBDb250cm9sYWRvciBcdTAwRkFuaWNvIGRhIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAobG9nIGRvIGNvZnJlICsgc3RhdHM7IHYwLjEzKS5cbiAgZ2FtZSE6IEdhbWVDb250cm9sbGVyO1xuICAvLyBDYWNoZSBkbyBjb2ZyZSAoXHUwMEE3Myk6IG1vbnRhZG8gMXggcG9yIGNpY2xvLCBpbnZhbGlkYWRvIG5vcyBldmVudG9zIGRvIHZhdWx0LlxuICBwcml2YXRlIHZhdWx0Q2FjaGU6IFZhdWx0Q2FjaGUgfCBudWxsID0gbnVsbDtcblxuICAvLyBBZ3JlZ2Fkb3MgZG8gY29mcmUgKHVtYSBwYXNzYWRhKSwgcmV1c2Fkb3MgcG9yIHRvZGFzIGFzIHNlXHUwMEU3XHUwMEY1ZXMgbm8gcmVuZGVyLlxuICBnZXRWYXVsdENhY2hlKCk6IFZhdWx0Q2FjaGUge1xuICAgIGlmICghdGhpcy52YXVsdENhY2hlKSB0aGlzLnZhdWx0Q2FjaGUgPSBidWlsZFZhdWx0Q2FjaGUodGhpcy5hcHApO1xuICAgIHJldHVybiB0aGlzLnZhdWx0Q2FjaGU7XG4gIH1cbiAgaW52YWxpZGF0ZVZhdWx0Q2FjaGUoKSB7IHRoaXMudmF1bHRDYWNoZSA9IG51bGw7IH1cblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnRvZG8gPSBuZXcgVG9kb2lzdENvbnRyb2xsZXIodGhpcy5hcHAsIHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuZ2FtZSA9IG5ldyBHYW1lQ29udHJvbGxlcih0aGlzLmFwcCwgdGhpcyk7XG4gICAgLy8gQXV0by1yZWZyZXNoIGRvIFRvZG9pc3Q6IHZlcmlmaWNhIGEgY2FkYSBtaW51dG87IHNcdTAwRjMgYnVzY2Egc2UgaFx1MDBFMSB2aWV3IGFiZXJ0YSBlIG9cbiAgICAvLyBjYWNoZSBwYXNzb3UgZG8gVFRMICg1IG1pbikuIHJlZ2lzdGVySW50ZXJ2YWwgbGltcGEgbyB0aW1lciBubyB1bmxvYWQuXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnRvZG8ubWF5YmVSZWZyZXNoKCksIDYwXzAwMCkpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgRGFzaGJvYXJkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVE9ET0lTVF9WSUVXX1RZUEUsIGxlYWYgPT4gbmV3IFRvZG9pc3RWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhHQU1FX1ZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgR2FtaWZpY2F0aW9uVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGF5b3V0LWRhc2hib2FyZFwiLCBcIkFicmlyIFdlcnVzIERhc2hib2FyZFwiLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGlzdC1jaGVja3NcIiwgXCJBYnJpciBUb2RvaXN0IChXZXJ1cylcIiwgKCkgPT4gdGhpcy5vcGVuVG9kb2lzdCgpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJ0cm9waHlcIiwgXCJBYnJpciBHYW1pZmljYVx1MDBFN1x1MDBFM28gKFdlcnVzKVwiLCAoKSA9PiB0aGlzLm9wZW5HYW1lKCkpO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tZGFzaGJvYXJkXCIsIG5hbWU6IFwiQWJyaXIgRGFzaGJvYXJkXCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW4oKSB9KTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLXRvZG9pc3RcIiwgbmFtZTogXCJBYnJpciBUb2RvaXN0XCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW5Ub2RvaXN0KCkgfSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1nYW1lXCIsIG5hbWU6IFwiQWJyaXIgR2FtaWZpY2FcdTAwRTdcdTAwRTNvXCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW5HYW1lKCkgfSk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBXZXJ1c1NldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcbiAgICAvLyBDYXJyZWdhIG8gbG9nIGRvIGNvZnJlIFNcdTAwRDMgZGVwb2lzIGRvIHZhdWx0IGluZGV4YXI6IG5vIG9ubG9hZCwgZ2V0QWJzdHJhY3RGaWxlQnlQYXRoXG4gICAgLy8gZGV2b2x2ZSBudWxsIHBhcmEgdW0gYXJxdWl2byBxdWUgZXhpc3RlIFx1MjE5MiBjYWNoZWF2YSBldmVudHM9W10gKHplcmF2YSBubyByZWxvYWQpLlxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcbiAgICAgIHRoaXMuZ2FtZS5pbnZhbGlkYXRlKCk7XG4gICAgICB2b2lkIHRoaXMuZ2FtZS5lbnN1cmVMb2FkZWQoKS50aGVuKCgpID0+IHRoaXMuZ2FtZS5yZXJlbmRlckFsbCgpKTtcbiAgICB9KTtcbiAgICAvLyBSZS1yZW5kZXJpemEgcXVhbmRvIG8gbG9nIG11ZGEgKGluY2x1c2l2ZSBub3NzYXMgZ3JhdmFcdTAwRTdcdTAwRjVlcykuXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwibW9kaWZ5XCIsIGYgPT4ge1xuICAgICAgaWYgKGYucGF0aCA9PT0gR0FNRV9MT0dfUEFUSCkgeyB0aGlzLmdhbWUuaW52YWxpZGF0ZSgpOyB2b2lkIHRoaXMuZ2FtZS5lbnN1cmVMb2FkZWQoKS50aGVuKCgpID0+IHRoaXMuZ2FtZS5yZXJlbmRlckFsbCgpKTsgfVxuICAgIH0pKTtcbiAgfVxuXG4gIC8vIFRvZGFzIGFzIHZpZXdzIChkYXNoYm9hcmQgKyBhYmEgVG9kb2lzdCkgYWJlcnRhcywgcXVlIHRcdTAwRUFtIGNvbnRyb2xhZG9yIFRvZG9pc3QuXG4gIHByaXZhdGUgdG9kb1ZpZXdzKCk6IChEYXNoYm9hcmRWaWV3IHwgVG9kb2lzdFZpZXcpW10ge1xuICAgIGNvbnN0IG91dDogKERhc2hib2FyZFZpZXcgfCBUb2RvaXN0VmlldylbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiBbVklFV19UWVBFLCBUT0RPSVNUX1ZJRVdfVFlQRV0pXG4gICAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSh0KSkge1xuICAgICAgICBjb25zdCB2ID0gbGVhZi52aWV3O1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcgfHwgdiBpbnN0YW5jZW9mIFRvZG9pc3RWaWV3KSBvdXQucHVzaCh2KTtcbiAgICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgLy8gUmUtYnVzY2EgbyBUb2RvaXN0IChjb250cm9sbGVyIFx1MDBGQW5pY28gXHUyMTkyIG5vdGlmaWNhIHRvZGFzIGFzIHZpZXdzIGluc2NyaXRhcykuXG4gIHJlZnJlc2hEYXNoYm9hcmRzKCkge1xuICAgIHRoaXMudG9kby5yZXNldCgpO1xuICB9XG5cbiAgLy8gUmVzZXRhIG8gZXN0YWRvIGRvIFN5bmN0aGluZyBuYXMgZGFzaGJvYXJkcyAoZXguOiB0b2tlbi9VUkwgYWx0ZXJhZG9zKS5cbiAgcmVmcmVzaFN5bmMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFN5bmMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZS1yZW5kZXJpemEgdG9kYXMgYXMgdmlld3MgYWJlcnRhcyAoYXBcdTAwRjNzIG11ZGFyIGNvbmZpZyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXM6IG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcywgcGFjb3RlcykuXG4gIHJlcmVuZGVyRGFzaGJvYXJkcygpIHtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdGhpcy50b2RvVmlld3MoKSkgdi5yZWZyZXNoKCk7XG4gIH1cblxuICAvLyBNb3N0cmEvb2N1bHRhIHVtYSBzZVx1MDBFN1x1MDBFM28gKFwic2VjOjxpZD5cIikgb3UgcGFzdGEgKGNhbWluaG8pIHBvciBjaGF2ZSBlbSBgaGlkZGVuYC5cbiAgYXN5bmMgc2V0SGlkZGVuKGtleTogc3RyaW5nLCBoaWRkZW46IGJvb2xlYW4pIHtcbiAgICBjb25zdCBoYXMgPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICAgIGlmIChoaWRkZW4gJiYgIWhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIGVsc2UgaWYgKCFoaWRkZW4gJiYgaGFzKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMuc2V0dGluZ3MuaGlkZGVuLmZpbHRlcihrID0+IGsgIT09IGtleSk7XG4gICAgZWxzZSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgLy8gUmVvcmRlbmEgdW1hIHNlXHUwMEU3XHUwMEUzbyBlbSBzZWN0aW9uT3JkZXIgKGRpciA9IC0xIHNvYmUsICsxIGRlc2NlKS5cbiAgYXN5bmMgbW92ZVNlY3Rpb24oaWQ6IFNlY3Rpb25JZCwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBvcmRlciA9IFsuLi50aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBvcmRlcjtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICBhc3luYyBtb3ZlUGFja2FnZShpbmRleDogbnVtYmVyLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGNvbnN0IGogPSBpbmRleCArIGRpcjtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGogPCAwIHx8IGogPj0gYXJyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFthcnJbaW5kZXhdLCBhcnJbal1dID0gW2FycltqXSwgYXJyW2luZGV4XV07XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIGxldCBuZWVkU3RNaWdyYXRpb24gPSBmYWxzZTsgICAvLyBjcmVkZW5jaWFpcyBTeW5jdGhpbmcgbWlncmFuZG8gZGF0YS5qc29uIFx1MjE5MiBsb2NhbFN0b3JhZ2VcbiAgICAvLyBTYW5lYW1lbnRvOiBzZWN0aW9uT3JkZXIgY29tIGV4YXRhbWVudGUgYXMgc2VcdTAwRTdcdTAwRjVlcyB2XHUwMEUxbGlkYXMsIHNlbSBkdXBsaWNhdGFzLlxuICAgIGNvbnN0IHZhbGlkOiBTZWN0aW9uSWRbXSA9IFtcInN0YXRzXCIsIFwiZ2FtZVwiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxTZWN0aW9uSWQ+KCk7XG4gICAgY29uc3QgY2xlYW5lZCA9ICh0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciB8fCBbXSkuZmlsdGVyKFxuICAgICAgKHMpOiBzIGlzIFNlY3Rpb25JZCA9PiB2YWxpZC5pbmNsdWRlcyhzIGFzIFNlY3Rpb25JZCkgJiYgIXNlZW4uaGFzKHMgYXMgU2VjdGlvbklkKSAmJiAoc2Vlbi5hZGQocyBhcyBTZWN0aW9uSWQpLCB0cnVlKVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbGlkKSBpZiAoIXNlZW4uaGFzKHYpKSBjbGVhbmVkLnB1c2godik7XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBjbGVhbmVkOyAgIC8vIFwicmVwb3J0c1wiIHNvbWUgYXF1aSBzZSBlc3RhdmEgbnVtYSBjb25maWcgYW50aWdhXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2V0dGluZ3MuaGlkZGVuKSkgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSBbXTtcbiAgICAvLyBGb250ZXMgZGEgU2VtYW5hICh2MC4xMC4xKTogdmFsaWRhIGEgbGlzdGE7IHNlIGF1c2VudGUvaW52XHUwMEUxbGlkYSwgdXNhIG8gZGVmYXVsdC5cbiAgICBjb25zdCBjcyA9IHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gQXJyYXkuaXNBcnJheShjcykgJiYgY3MubGVuZ3RoXG4gICAgICA/IGNzLmZpbHRlcihzID0+IHMgJiYgdHlwZW9mIHMucGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAubWFwKHMgPT4gKHsgcGF0aDogcy5wYXRoLCBjb2xvcjogdHlwZW9mIHMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBzLmNvbG9yIDogQUNDRU5UU1swXSwgb246IHMub24gIT09IGZhbHNlIH0pKVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLmNhbGVuZGFyU291cmNlcy5tYXAocyA9PiAoeyAuLi5zIH0pKTtcbiAgICAvLyBTYW5lYW1lbnRvIFRvZG9pc3QgKHYwLjcuMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICAgIGNvbnN0IHRmID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzID0ge1xuICAgICAgcHJvamVjdHM6IEFycmF5LmlzQXJyYXkodGY/LnByb2plY3RzKSA/IHRmLnByb2plY3RzIDogW10sXG4gICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkodGY/LmxhYmVscykgPyB0Zi5sYWJlbHMgOiBbXSxcbiAgICB9O1xuICAgIC8vIEV4aWJpXHUwMEU3XHUwMEUzbyBuYXMgbGluaGFzICh2MC44LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgIT09IGZhbHNlO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID09PSB0cnVlO1xuICAgIC8vIFN5bmN0aGluZyAodjAuMTAuMCkgXHUyMDE0IGNyZWRlbmNpYWlzIHNcdTAwRTNvIFBPUi1ESVNQT1NJVElWTzogdml2ZW0gbm8gbG9jYWxTdG9yYWdlXG4gICAgLy8gKG5cdTAwRTNvIHNpbmNyb25pemFtIHBlbG8gZGF0YS5qc29uKS4gTWlncmFcdTAwRTdcdTAwRTNvICgxeCk6IHNlIG8gbG9jYWxTdG9yYWdlIGFpbmRhIG5cdTAwRTNvXG4gICAgLy8gdGVtLCBoZXJkYSBvIHZhbG9yIHF1ZSBlc3RhdmEgbm8gZGF0YS5qc29uIGUgcmVncmF2YSAodmVyIGZpbSBkbyBtXHUwMEU5dG9kbykuXG4gICAgY29uc3QgbHNHZXQgPSAoazogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBjb25zdCB2ID0gdGhpcy5hcHAubG9hZExvY2FsU3RvcmFnZShrKTtcbiAgICAgIHJldHVybiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiA/IHYgOiBudWxsO1xuICAgIH07XG4gICAgY29uc3QgZGF0YVVybCA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybC50cmltKClcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgOiBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgIGNvbnN0IGRhdGFLZXkgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA6IFwiXCI7XG4gICAgY29uc3QgZGF0YUZvbGRlciA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID09PSBcInN0cmluZ1wiID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA6IFwiXCI7XG4gICAgbmVlZFN0TWlncmF0aW9uID0gbHNHZXQoTFNfU1RfVVJMKSA9PT0gbnVsbCAmJiBsc0dldChMU19TVF9LRVkpID09PSBudWxsICYmIGxzR2V0KExTX1NUX0ZPTERFUikgPT09IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSBsc0dldChMU19TVF9VUkwpID8/IGRhdGFVcmw7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPSBsc0dldChMU19TVF9LRVkpID8/IGRhdGFLZXk7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9IGxzR2V0KExTX1NUX0ZPTERFUikgPz8gZGF0YUZvbGRlcjtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPT09IHRydWU7XG4gICAgLy8gUGFjb3RlcyBkZSB0YXJlZmFzICh2MC4xMi4wKS5cbiAgICBjb25zdCB0cCA9IHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzID0gQXJyYXkuaXNBcnJheSh0cClcbiAgICAgID8gdHAuZmlsdGVyKHAgPT4gcCAmJiB0eXBlb2YgcC5pZCA9PT0gXCJzdHJpbmdcIikubWFwKHAgPT4gKHtcbiAgICAgICAgICBpZDogcC5pZCxcbiAgICAgICAgICBuYW1lOiB0eXBlb2YgcC5uYW1lID09PSBcInN0cmluZ1wiID8gcC5uYW1lIDogXCJcIixcbiAgICAgICAgICBpY29uOiB0eXBlb2YgcC5pY29uID09PSBcInN0cmluZ1wiICYmIHAuaWNvbi50cmltKCkgPyBwLmljb24gOiB1bmRlZmluZWQsXG4gICAgICAgICAgdGFza3M6IEFycmF5LmlzQXJyYXkocC50YXNrcykgPyBwLnRhc2tzLmZpbHRlcih4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSA6IFtdLFxuICAgICAgICAgIHByb2plY3RJZDogdHlwZW9mIHAucHJvamVjdElkID09PSBcInN0cmluZ1wiICYmIHAucHJvamVjdElkID8gcC5wcm9qZWN0SWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHAubGFiZWxzKSA/IHAubGFiZWxzLmZpbHRlcih4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSkpXG4gICAgICA6IFtdO1xuICAgIHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gPSBbXCJhbHdheXNcIiwgXCJtYW55XCIsIFwibmV2ZXJcIl0uaW5jbHVkZXModGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSlcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA6IFwibWFueVwiO1xuICAgIC8vIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodjAuMTMpLlxuICAgIHRoaXMuc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZCA9IHRoaXMuc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZCAhPT0gZmFsc2U7XG4gICAgY29uc3QgcGYgPSBOdW1iZXIodGhpcy5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3Rvcik7XG4gICAgdGhpcy5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvciA9IE51bWJlci5pc0Zpbml0ZShwZikgJiYgcGYgPiAwID8gcGYgOiAxLjU7XG4gICAgdGhpcy5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdCA6IFwiXCI7XG5cbiAgICAvLyBNaWdyYVx1MDBFN1x1MDBFM28gMXg6IGdyYXZhIGFzIGNyZWRlbmNpYWlzIG5vIGxvY2FsU3RvcmFnZSBlIGFzIHJlbW92ZSBkbyBkYXRhLmpzb24uXG4gICAgaWYgKG5lZWRTdE1pZ3JhdGlvbikgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICAvLyBDcmVkZW5jaWFpcyBkbyBTeW5jdGhpbmcgc1x1MDBFM28gcG9yLWRpc3Bvc2l0aXZvIFx1MjE5MiBsb2NhbFN0b3JhZ2UgKG5cdTAwRTNvIHNpbmNyb25pemEpLlxuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfVVJMLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCk7XG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9LRVksIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5KTtcbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX0ZPTERFUiwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCk7XG4gICAgLy8gTyBkYXRhLmpzb24gKHNpbmNyb25pemFkbyBwZWxvIFN5bmN0aGluZykgTlx1MDBDM08gbGV2YSBhcyBjcmVkZW5jaWFpcy5cbiAgICBjb25zdCBzaGFyZWQ6IFBhcnRpYWw8RGFzaFNldHRpbmdzPiA9IHsgLi4udGhpcy5zZXR0aW5ncyB9O1xuICAgIGRlbGV0ZSBzaGFyZWQuc3luY3RoaW5nVXJsO1xuICAgIGRlbGV0ZSBzaGFyZWQuc3luY3RoaW5nQXBpS2V5O1xuICAgIGRlbGV0ZSBzaGFyZWQuc3luY3RoaW5nRm9sZGVySWQ7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YShzaGFyZWQpO1xuICB9XG5cbiAgYXN5bmMgb3BlbigpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5Ub2RvaXN0KCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVE9ET0lTVF9WSUVXX1RZUEUpWzBdO1xuICAgIGlmICghbGVhZikgeyBsZWFmID0gd29ya3NwYWNlLmdldExlYWYoZmFsc2UpOyBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IFRPRE9JU1RfVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5HYW1lKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoR0FNRV9WSUVXX1RZUEUpWzBdO1xuICAgIGlmICghbGVhZikgeyBsZWFmID0gd29ya3NwYWNlLmdldExlYWYoZmFsc2UpOyBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IEdBTUVfVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge1xuICAgIC8vIFZhcnJlIGVsZW1lbnRvcyBmbHV0dWFudGVzIHF1ZSB2aXZlbSBubyBkb2N1bWVudC5ib2R5ICh0b29sdGlwcy9wb3BvdmVycyk6IHNlIG9cbiAgICAvLyBwbHVnaW4gZm9yIGRlc2FiaWxpdGFkbyBjb20gdW0gYWJlcnRvLCBvIG9uQ2xvc2UgZGEgdmlldyBwb2RlIG5cdTAwRTNvIHJvZGFyLlxuICAgIHRoaXMudG9kbz8uaGlkZVRpcCgpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2QtdG9vbHRpcCwgLndkLXBvcFwiKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZWRpY2FkYSBkbyBUb2RvaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gSHViIGRvIFRvZG9pc3QgbmEgXHUwMEUxcmVhIGNlbnRyYWwgKG5cdTAwRTNvIFx1MDBFOSBzaWRlYmFyKTogbGFuXHUwMEU3YWRvciBkZSBwYWNvdGVzICsgYSBtZXNtYVxuLy8gbGlzdGEgZGUgdGFyZWZhcyBkbyBkYXNoYm9hcmQgKHZpYSBUb2RvaXN0Q29udHJvbGxlciBjb21wYXJ0aWxoYWRvKS5cbmNsYXNzIFRvZG9pc3RWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHVuc3ViVG9kbzogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFRPRE9JU1RfVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJUb2RvaXN0XCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxpc3QtY2hlY2tzXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSB0aGlzLnBsdWdpbi50b2RvLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlZnJlc2goKSk7XG4gIH1cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHJvb3QuYWRkQ2xhc3MoXCJ3ZC1yb290XCIsIFwid2QtdG9kb2lzdC12aWV3XCIpO1xuXG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiVG9kb2lzdFwiIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJQYWNrYWdlcyhyb290LCB7IGhlYWRpbmc6IHRydWUgfSk7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMpO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGVkaWNhZGEgZGUgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY2xhc3MgR2FtaWZpY2F0aW9uVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSB1bnN1YjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIEdBTUVfVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJHYW1pZmljYVx1MDBFN1x1MDBFM29cIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwidHJvcGh5XCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy51bnN1YiA9IHRoaXMucGx1Z2luLmdhbWUuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVmcmVzaCgpKTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5nYW1lLmVuc3VyZUxvYWRlZCgpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIHZvaWQgdGhpcy5wbHVnaW4uZ2FtZS5yZWZyZXNoUGVuZGluZygpO1xuICB9XG4gIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy51bnN1Yj8uKCk7XG4gICAgdGhpcy51bnN1YiA9IG51bGw7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIiwgXCJ3ZC1nYW1lLXZpZXdcIik7XG5cbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJHYW1pZmljYVx1MDBFN1x1MDBFM29cIiB9KTtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtZ2FtZS1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJQUk9HUkVTU09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMucGx1Z2luLmdhbWUucmVuZGVyUGFuZWwoc2VjLCBjdHJscywgeyBmdWxsOiB0cnVlIH0pO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNb2RhbCBkZSBjb25maXJtYVx1MDBFN1x1MDBFM28gZ2VuXHUwMEU5cmljbyAocmVzb2x2ZSB0cnVlL2ZhbHNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIENvbmZpcm1JdGVtIHtcbiAgdGV4dDogc3RyaW5nO1xuICBsYWJlbHM/OiB7IG5hbWU6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9W107ICAgLy8gY2hpcHMgb3BjaW9uYWlzIChldGlxdWV0YXMpXG59XG5cbmludGVyZmFjZSBDb25maXJtT3B0cyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGJvZHk6IHN0cmluZztcbiAgaXRlbXM/OiBDb25maXJtSXRlbVtdOyAgIC8vIGxpc3RhIG9wY2lvbmFsIChleC46IHRhcmVmYXMgYSBjcmlhcilcbiAgY3RhOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHJcdTAwRjN0dWxvIGRvIGJvdFx1MDBFM28gZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvXG59XG5cbmNsYXNzIENvbmZpcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBkb25lID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IENvbmZpcm1PcHRzLCBwcml2YXRlIHJlc29sdmU6IChvazogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgIHN1cGVyKGFwcCk7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmFkZENsYXNzKFwid2QtY29uZmlybVwiKTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IHRoaXMub3B0cy50aXRsZSB9KTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgdGV4dDogdGhpcy5vcHRzLmJvZHkgfSk7XG4gICAgaWYgKHRoaXMub3B0cy5pdGVtcz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCB1bCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInVsXCIsIHsgY2xzOiBcIndkLWNvbmZpcm0tbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLm9wdHMuaXRlbXMpIHtcbiAgICAgICAgY29uc3QgbGkgPSB1bC5jcmVhdGVFbChcImxpXCIpO1xuICAgICAgICBsaS5jcmVhdGVTcGFuKHsgdGV4dDogaXQudGV4dCB9KTtcbiAgICAgICAgZm9yIChjb25zdCBsIG9mIGl0LmxhYmVscyA/PyBbXSkge1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsaS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvbmZpcm0tbGFiZWxcIiB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IGwuY29sb3I7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2wubmFtZX1gIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgb2sgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIm1vZC1jdGFcIiwgdGV4dDogdGhpcy5vcHRzLmN0YSB9KTtcbiAgICBvay5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmRvbmUgPSB0cnVlOyB0aGlzLmNsb3NlKCk7IH07XG4gIH1cblxuICBvbkNsb3NlKCkge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5yZXNvbHZlKHRoaXMuZG9uZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uZmlybU1vZGFsKGFwcDogQXBwLCBvcHRzOiBDb25maXJtT3B0cyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBuZXcgQ29uZmlybU1vZGFsKGFwcCwgb3B0cywgcmVzb2x2ZSkub3BlbigpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBvcC11cCBkZSBkZXRhbGhlcyBkYSB0YXJlZmEgKHNcdTAwRjMgbGVpdHVyYTsgYm90XHUwMEUzbyBFZGl0YXIgYWJyZSBvIGZvcm11bFx1MDBFMXJpbykgXHUyNTAwXG5cbmludGVyZmFjZSBUYXNrRGV0YWlsT3B0cyB7XG4gIHRhc2s6IFRvZG9pc3RUYXNrO1xuICBwcm9qZWN0TmFtZT86IHN0cmluZztcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBlZGl0OiAoKSA9PiB2b2lkO1xuICBjb21wbGV0ZTogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0RldGFpbE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBjb21wb25lbnQ6IENvbXBvbmVudCwgcHJpdmF0ZSBvcHRzOiBUYXNrRGV0YWlsT3B0cykgeyBzdXBlcihhcHApOyB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHQgPSB0aGlzLm9wdHMudGFzaztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1tb2RhbFwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodC5jb250ZW50KTtcblxuICAgIGNvbnN0IG1ldGEgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRkLW1ldGFcIiB9KTtcbiAgICBjb25zdCBwcmkgPSBwcmlNZXRhKHQucHJpb3JpdHkpO1xuICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKGRrKSB7XG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcFwiLCB0ZXh0OiBgXHVEODNEXHVEQ0M1ICR7ZH0vJHttfS8ke3l9JHt0LmR1ZT8uaXNfcmVjdXJyaW5nID8gXCIgXHUyN0YzXCIgOiBcIlwifWAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdHMucHJvamVjdE5hbWUpIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGAjICR7dGhpcy5vcHRzLnByb2plY3ROYW1lfWAgfSk7XG4gICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB7XG4gICAgICBjb25zdCBjaGlwID0gbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXAgd2QtdGQtbGFiZWxcIiB9KTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgIH1cblxuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBib2R5ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWRlc2MgbWFya2Rvd24tcmVuZGVyZWRcIiB9KTtcbiAgICAgIHZvaWQgTWFya2Rvd25SZW5kZXJlci5yZW5kZXIodGhpcy5hcHAsIHQuZGVzY3JpcHRpb24hLnRyaW0oKSwgYm9keSwgXCJcIiwgdGhpcy5jb21wb25lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZW1wdHlcIiwgdGV4dDogXCJFc3RhIHRhcmVmYSBuXHUwMEUzbyB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzby5cIiB9KTtcbiAgICB9XG5cbiAgICAvLyBFZGl0YXIgKGVzcXVlcmRhKSBcdTAwQjcgQ29uY2x1aXIgKyBBYnJpciBubyBUb2RvaXN0IChkaXJlaXRhKS5cbiAgICBjb25zdCBhY3Rpb25zID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWFjdGlvbnNcIiB9KTtcbiAgICBjb25zdCBlZGl0ID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzBFIEVkaXRhclwiIH0pO1xuICAgIGVkaXQub25jbGljayA9ICgpID0+IHsgdGhpcy5jbG9zZSgpOyB0aGlzLm9wdHMuZWRpdCgpOyB9O1xuICAgIGFjdGlvbnMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGRvbmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MTMgQ29uY2x1aXJcIiB9KTtcbiAgICBkb25lLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMub3B0cy5jb21wbGV0ZSgpOyB0aGlzLmNsb3NlKCk7IH07XG4gICAgY29uc3Qgb3BlbiA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkFicmlyIG5vIFRvZG9pc3RcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHQpLCBcIl9ibGFua1wiKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEZvcm11bFx1MDBFMXJpbyBkZSB0YXJlZmEgKGNyaWFyIC8gZWRpdGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tGb3JtVmFsdWVzIHtcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSSAxLi40ICg0ID0gcDEpXG4gIGR1ZURhdGU6IHN0cmluZzsgICAgLy8gWVlZWS1NTS1ERCAoY2FsZW5kXHUwMEUxcmlvKTsgXCJcIiA9IHNlbSBkYXRhXG4gIHByb2plY3RJZDogc3RyaW5nO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgVGFza0Zvcm1PcHRzIHtcbiAgbW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiO1xuICB0YXNrPzogVG9kb2lzdFRhc2s7XG4gIHByZWZpbGxEdWU/OiBzdHJpbmc7XG4gIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIHN1Ym1pdDogKHY6IFRhc2tGb3JtVmFsdWVzKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICByZW1vdmU/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICBjb21wbGV0ZT86ICgpID0+IHZvaWQ7XG59XG5cbmNsYXNzIFRhc2tGb3JtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgdjogVGFza0Zvcm1WYWx1ZXM7XG4gIHByaXZhdGUga25vd25MYWJlbHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIGNvbmZpcm1EZWwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBhY3Rpb25zRWwhOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBvcHRzOiBUYXNrRm9ybU9wdHMpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIGNvbnN0IHQgPSBvcHRzLnRhc2s7XG4gICAgLy8gUHJlZmlsbCBkZSBjcmlhXHUwMEU3XHUwMEUzbzogXCJob2plXCIgXHUyMTkyIGRhdGEgZGUgaG9qZTsgalx1MDBFMS1ZWVlZLU1NLUREIHBhc3NhIGRpcmV0bzsgcmVzdG8gaWdub3JhLlxuICAgIGNvbnN0IHByZSA9IG9wdHMucHJlZmlsbER1ZTtcbiAgICBjb25zdCBwcmVmaWxsRGF0ZSA9IHByZSA9PT0gXCJob2plXCIgPyB0b0tleShuZXcgRGF0ZSgpKVxuICAgICAgOiAocHJlICYmIC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KHByZSkgPyBwcmUgOiBcIlwiKTtcbiAgICB0aGlzLnYgPSB7XG4gICAgICBjb250ZW50OiB0Py5jb250ZW50ID8/IFwiXCIsXG4gICAgICBkZXNjcmlwdGlvbjogdD8uZGVzY3JpcHRpb24gPz8gXCJcIixcbiAgICAgIHByaW9yaXR5OiB0Py5wcmlvcml0eSA/PyAxLFxuICAgICAgZHVlRGF0ZTogdD8uZHVlPy5kYXRlID8gdC5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogcHJlZmlsbERhdGUsXG4gICAgICBwcm9qZWN0SWQ6IHQ/LnByb2plY3RfaWQgPz8gXCJcIixcbiAgICAgIGxhYmVsczogKHQ/LmxhYmVscyA/PyBbXSkuc2xpY2UoKSxcbiAgICB9O1xuICAgIHRoaXMua25vd25MYWJlbHMgPSBbLi4ubmV3IFNldChbLi4ub3B0cy5sYWJlbHMsIC4uLnRoaXMudi5sYWJlbHNdKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCwgdGl0bGVFbCwgbW9kYWxFbCB9ID0gdGhpcztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1mb3JtXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0aGlzLm9wdHMubW9kZSA9PT0gXCJjcmVhdGVcIiA/IFwiTm92YSB0YXJlZmFcIiA6IFwiRWRpdGFyIHRhcmVmYVwiKTtcblxuICAgIC8vIFNcdTAwRjMgbmEgZWRpXHUwMEU3XHUwMEUzbzogYXRhbGhvIFwiQWJyaXIgbm8gVG9kb2lzdFwiIG5vIHRvcG8sIGFvIGxhZG8gZG8gWCBkZSBmZWNoYXIuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIiAmJiB0aGlzLm9wdHMudGFzaykge1xuICAgICAgY29uc3Qgb3BlbiA9IG1vZGFsRWwuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtdGYtb3Blbi10b3BcIiwgdGV4dDogXCJcdTIxOTcgVG9kb2lzdFwiIH0pO1xuICAgICAgb3Blbi5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBubyBUb2RvaXN0XCIpO1xuICAgICAgb3Blbi5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0aGlzLm9wdHMudGFzayEpLCBcIl9ibGFua1wiKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpZWxkKFwiVFx1MDBFRHR1bG9cIik7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0XCIsIHR5cGU6IFwidGV4dFwiIH0pO1xuICAgIGNvbnRlbnQudmFsdWUgPSB0aGlzLnYuY29udGVudDtcbiAgICBjb250ZW50LnBsYWNlaG9sZGVyID0gXCJPIHF1ZSBwcmVjaXNhIHNlciBmZWl0bz9cIjtcbiAgICBjb250ZW50Lm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5jb250ZW50ID0gY29udGVudC52YWx1ZTsgfTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRlbnQuZm9jdXMoKSwgMCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGVzY3JpXHUwMEU3XHUwMEUzb1wiKTtcbiAgICBjb25zdCBkZXNjID0gY29udGVudEVsLmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtdGYtdGV4dGFyZWFcIiB9KTtcbiAgICBkZXNjLnZhbHVlID0gdGhpcy52LmRlc2NyaXB0aW9uO1xuICAgIGRlc2MucGxhY2Vob2xkZXIgPSBcIkRldGFsaGVzIC8gaW5zdHJ1XHUwMEU3XHUwMEY1ZXMgKG1hcmtkb3duKVwiO1xuICAgIGRlc2Mucm93cyA9IDM7XG4gICAgZGVzYy5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuZGVzY3JpcHRpb24gPSBkZXNjLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIlByaW9yaWRhZGVcIik7XG4gICAgY29uc3QgcHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtcHJpLXJvd1wiIH0pO1xuICAgIGNvbnN0IHJlbmRlclByaSA9ICgpID0+IHtcbiAgICAgIHByb3cuZW1wdHkoKTtcbiAgICAgIGZvciAoY29uc3QgYXBpIG9mIFs0LCAzLCAyLCAxXSkge1xuICAgICAgICBjb25zdCBtZXRhID0gVE9ET0lTVF9QUklbYXBpXTtcbiAgICAgICAgY29uc3QgYiA9IHByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1wcmlcIiArICh0aGlzLnYucHJpb3JpdHkgPT09IGFwaSA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgICAgYi5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIG1ldGEuY29sb3IpO1xuICAgICAgICBiLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpKSk7XG4gICAgICAgIGNsaWNrYWJsZShiLCAoKSA9PiB7IHRoaXMudi5wcmlvcml0eSA9IGFwaTsgcmVuZGVyUHJpKCk7IH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmVuZGVyUHJpKCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGF0YVwiKTtcbiAgICBjb25zdCBkcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1kdWUtcm93XCIgfSk7XG4gICAgY29uc3QgZHVlID0gZHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0IHdkLXRmLWRhdGVcIiwgdHlwZTogXCJkYXRlXCIgfSk7XG4gICAgZHVlLnZhbHVlID0gdGhpcy52LmR1ZURhdGU7XG4gICAgZHVlLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IGR1ZS52YWx1ZTsgfTtcbiAgICBjb25zdCBjbHIgPSBkcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXRmLWR1ZS1jbGVhclwiLCB0ZXh0OiBcInNlbSBkYXRhXCIgfSk7XG4gICAgY2xyLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudi5kdWVEYXRlID0gXCJcIjsgZHVlLnZhbHVlID0gXCJcIjsgfTtcbiAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDbGlxdWUgcGFyYSBhYnJpciBvIGNhbGVuZFx1MDBFMXJpby4gVmF6aW8gPSBzZW0gZGF0YS5cIiB9KTtcbiAgICBpZiAodGhpcy5vcHRzLnRhc2s/LmR1ZT8uaXNfcmVjdXJyaW5nKVxuICAgICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi13YXJuXCIsIHRleHQ6IFwiXHUyN0YzIFRhcmVmYSByZWNvcnJlbnRlIFx1MjAxNCBtdWRhciBhIGRhdGEgZml4YSBwb2RlIGVuY2VycmFyIGEgcmVjb3JyXHUwMEVBbmNpYS5cIiB9KTtcblxuICAgIHRoaXMuZmllbGQoXCJQcm9qZXRvXCIpO1xuICAgIGNvbnN0IHNlbCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInNlbGVjdFwiLCB7IGNsczogXCJ3ZC10Zi1zZWxlY3RcIiB9KTtcbiAgICBjb25zdCBpbmJveCA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IFwiRW50cmFkYSAoSW5ib3gpXCIsIHZhbHVlOiBcIlwiIH0pO1xuICAgIGlmICghdGhpcy52LnByb2plY3RJZCkgaW5ib3guc2VsZWN0ZWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLm9wdHMucHJvamVjdHMpIHtcbiAgICAgIGNvbnN0IG8gPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBwLm5hbWUsIHZhbHVlOiBwLmlkIH0pO1xuICAgICAgaWYgKHAuaWQgPT09IHRoaXMudi5wcm9qZWN0SWQpIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzZWwub25jaGFuZ2UgPSAoKSA9PiB7IHRoaXMudi5wcm9qZWN0SWQgPSBzZWwudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiRXRpcXVldGFzXCIpO1xuICAgIGNvbnN0IGx3cmFwID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbHNcIiB9KTtcbiAgICBpZiAodGhpcy5rbm93bkxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHJlbmRlckxhYmVscyA9ICgpID0+IHtcbiAgICAgICAgbHdyYXAuZW1wdHkoKTtcbiAgICAgICAgZm9yIChjb25zdCBsIG9mIHRoaXMua25vd25MYWJlbHMpIHtcbiAgICAgICAgICBjb25zdCBvbiA9IHRoaXMudi5sYWJlbHMuaW5jbHVkZXMobCk7XG4gICAgICAgICAgY29uc3QgY2hpcCA9IGx3cmFwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2x9YCB9KTtcbiAgICAgICAgICBjaGlwLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG9uKSk7XG4gICAgICAgICAgY2xpY2thYmxlKGNoaXAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnYubGFiZWxzLmluZGV4T2YobCk7XG4gICAgICAgICAgICBpZiAoaSA+PSAwKSB0aGlzLnYubGFiZWxzLnNwbGljZShpLCAxKTsgZWxzZSB0aGlzLnYubGFiZWxzLnB1c2gobCk7XG4gICAgICAgICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlbmRlckxhYmVscygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIk5lbmh1bWEgZXRpcXVldGEgbm8gVG9kb2lzdCBhaW5kYS5cIiB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGlvbnNFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtYWN0aW9uc1wiIH0pO1xuICAgIHRoaXMucmVuZGVyQWN0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaWVsZChsYWJlbDogc3RyaW5nKSB7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsXCIsIHRleHQ6IGxhYmVsIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBY3Rpb25zKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmFjdGlvbnNFbDtcbiAgICBhLmVtcHR5KCk7XG5cbiAgICBpZiAodGhpcy5jb25maXJtRGVsICYmIHRoaXMub3B0cy5yZW1vdmUpIHtcbiAgICAgIGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1jb25maXJtXCIsIHRleHQ6IFwiRXhjbHVpciBlc3RhIHRhcmVmYT9cIiB9KTtcbiAgICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgICAgY29uc3QgeWVzID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICB5ZXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnJlbW92ZSEoKSkgdGhpcy5jbG9zZSgpO1xuICAgICAgICBlbHNlIHsgdGhpcy5jb25maXJtRGVsID0gZmFsc2U7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgbm8gPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgICAgbm8ub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25maXJtRGVsID0gZmFsc2U7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMubW9kZSA9PT0gXCJlZGl0XCIpIHtcbiAgICAgIGNvbnN0IGRlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICBkZWwub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25maXJtRGVsID0gdHJ1ZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgfVxuXG4gICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgY2FuY2VsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICBjYW5jZWwub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBzYXZlID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiU2FsdmFyXCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgc2F2ZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy52LmNvbnRlbnQgPSB0aGlzLnYuY29udGVudC50cmltKCk7XG4gICAgICBpZiAoIXRoaXMudi5jb250ZW50KSB7IG5ldyBOb3RpY2UoXCJEXHUwMEVBIHVtIHRcdTAwRUR0dWxvIFx1MDBFMCB0YXJlZmEuXCIpOyByZXR1cm47IH1cbiAgICAgIHNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5zdWJtaXQodGhpcy52KSkgdGhpcy5jbG9zZSgpO1xuICAgICAgZWxzZSBzYXZlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZSBjb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY2xhc3MgV2VydXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIC8vIFByb2pldG9zIGRvIFRvZG9pc3QgKHBhcmEgb3MgZHJvcGRvd25zIGRvcyBwYWNvdGVzKS4gQnVzY2Fkb3MgMXg7IHF1YW5kb1xuICAvLyBjaGVnYW0sIHJlLXJlbmRlcml6YSBhIGFiYSBwYXJhIHByZWVuY2hlciBvcyBzZWxlY3RzLlxuICBwcml2YXRlIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdIHwgbnVsbCA9IG51bGw7XG4gIC8vIEV0aXF1ZXRhcyBkbyBUb2RvaXN0IChjaGlwcyBwb3IgcGFjb3RlKS4gTWVzbWEgZXN0cmF0XHUwMEU5Z2lhOiBidXNjYSAxeC5cbiAgcHJpdmF0ZSBsYWJlbHM6IFRvZG9pc3RMYWJlbFtdIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihhcHAsIHBsdWdpbik7IH1cblxuICBkaXNwbGF5KCkge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW47XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFeGliaVx1MDBFN1x1MDBFM28gZG8gZGFzaGJvYXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmRcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb2RvIGNvbXBhY3RvXCIpXG4gICAgICAuc2V0RGVzYyhcIkxheW91dCBtYWlzIGRlbnNvLCBjb20gbWVub3MgZXNwYVx1MDBFN2FtZW50byBlbnRyZSBvcyBlbGVtZW50b3MuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmNvbXBhY3QpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFNlXHUwMEU3XHUwMEY1ZXMgZG8gZGFzaGJvYXJkICh2aXNpYmlsaWRhZGUgKyBvcmRlbSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmRcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJBdGl2ZS9kZXNhdGl2ZSBjYWRhIHNlXHUwMEU3XHUwMEUzbyBlIGFqdXN0ZSBhIG9yZGVtIGVtIHF1ZSBhcGFyZWNlbSBuYSBkYXNoYm9hcmQuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvcmRlciA9IHBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXI7XG4gICAgb3JkZXIuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShTRUNUSU9OX0xBQkVMW2lkXSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwiYXJyb3ctdXBcIikuc2V0VG9vbHRpcChcIk1vdmVyIHBhcmEgY2ltYVwiKS5zZXREaXNhYmxlZChpID09PSAwKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVTZWN0aW9uKGlkLCAtMSk7IHRoaXMuZGlzcGxheSgpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwiYXJyb3ctZG93blwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBiYWl4b1wiKS5zZXREaXNhYmxlZChpID09PSBvcmRlci5sZW5ndGggLSAxKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVTZWN0aW9uKGlkLCArMSk7IHRoaXMuZGlzcGxheSgpOyB9KSlcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIlZpc1x1MDBFRHZlbFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSghcGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhcInNlYzpcIiArIGlkKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oXCJzZWM6XCIgKyBpZCwgIXYpOyB9KSk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUGFzdGFzIGV4aWJpZGFzIChjYXJkcyBkbyBDb2ZyZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiUGFzdGFzIGV4aWJpZGFzIChjYXJkcyBkbyBDb2ZyZSlcIiB9KTtcbiAgICBjb25zdCB0b3BGb2xkZXJzID0gKHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKS5jaGlsZHJlblxuICAgICAgLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGlmICghdG9wRm9sZGVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7IGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIGRlIHRvcG8gbm8gY29mcmUuXCIgfSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiB0b3BGb2xkZXJzKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoZi5uYW1lKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGYucGF0aCkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBhd2FpdCBwbHVnaW4uc2V0SGlkZGVuKGYucGF0aCwgIXYpOyB9KSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEZvbnRlcyBkYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkZvbnRlcyBkb3MgUmVsYXRcdTAwRjNyaW9zXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiUGFzdGFzIGN1amFzIG5vdGFzIHZpcmFtIGNhcmRzIG5vcyBkaWFzIGRhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MgKHBvc2lcdTAwRTdcdTAwRTNvIHBlbGEgZGF0YSBkYSBub3RhKS4gQ2FkYSBmb250ZSB0ZW0gdW1hIGNvciBwclx1MDBGM3ByaWEuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzcmNzID0gcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICBzcmNzLmZvckVhY2gocyA9PiB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUocy5wYXRoKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiQXRpdmFcIilcbiAgICAgICAgICAuc2V0VmFsdWUocy5vbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHMub24gPSB2OyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSkpXG4gICAgICAgIC5hZGRDb2xvclBpY2tlcihjID0+IGNcbiAgICAgICAgICAuc2V0VmFsdWUocy5jb2xvcilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHMuY29sb3IgPSB2OyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSkpXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcInRyYXNoLTJcIikuc2V0VG9vbHRpcChcIlJlbW92ZXIgZm9udGVcIilcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gc3Jjcy5maWx0ZXIoeCA9PiB4ICE9PSBzKTtcbiAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVzZWQgPSBuZXcgU2V0KHNyY3MubWFwKHMgPT4gcy5wYXRoKSk7XG4gICAgY29uc3QgYXZhaWxhYmxlID0gYWxsRm9sZGVyUGF0aHModGhpcy5hcHApLmZpbHRlcihwID0+ICF1c2VkLmhhcyhwKSk7XG4gICAgaWYgKGF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkFkaWNpb25hciBmb250ZVwiKVxuICAgICAgICAuc2V0RGVzYyhcIkVzY29saGEgdW1hIHBhc3RhIGRvIGNvZnJlIHBhcmEgYWxpbWVudGFyIGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcy5cIilcbiAgICAgICAgLmFkZERyb3Bkb3duKGQgPT4ge1xuICAgICAgICAgIGQuYWRkT3B0aW9uKFwiXCIsIFwiRXNjb2xoYSB1bWEgcGFzdGFcdTIwMjZcIik7XG4gICAgICAgICAgZm9yIChjb25zdCBwIG9mIGF2YWlsYWJsZSkgZC5hZGRPcHRpb24ocCwgcCk7XG4gICAgICAgICAgZC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIGlmICghdikgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBBQ0NFTlRTW3BsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMubGVuZ3RoICUgQUNDRU5UUy5sZW5ndGhdO1xuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5wdXNoKHsgcGF0aDogdiwgY29sb3IsIG9uOiB0cnVlIH0pO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM28gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiR2FtaWZpY2FcdTAwRTdcdTAwRTNvXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiVGFyZWZhcyBjb25jbHVcdTAwRURkYXMgdmlyYW0gWFAvblx1MDBFRHZlbC9zdHJlYWsgKGFiYSBHYW1pZmljYVx1MDBFN1x1MDBFM28gKyBmYWl4YSBubyBkYXNoYm9hcmQpLiBcXFwiU2FsdmFyIGNvbmNsdVx1MDBFRGRhc1xcXCIgZ3JhdmEgbm8gbG9nIGRvIGNvZnJlICgyMC5BcmVhcy9HYW1pZmljYVx1MDBFN1x1MDBFM28ubWQpIGUgbGltcGEgZG8gVG9kb2lzdC4gTyBib3RcdTAwRTNvIFx1MjcxNyBtYXJjYSB1bWEgdGFyZWZhIGNvbW8gblx1MDBFM28gZmVpdGEgKHB1bmlcdTAwRTdcdTAwRTNvIGVtIFhQKSBlIGEgYXBhZ2EuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQXRpdmFyIGdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiKVxuICAgICAgLnNldERlc2MoXCJNb3N0cmEgYSBzZVx1MDBFN1x1MDBFM28vYWJhIGRlIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyBlIG8gYm90XHUwMEUzbyBcXFwiblx1MDBFM28gZmVpdGFcXFwiIG5hcyB0YXJlZmFzLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQgPSB2O1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgcGx1Z2luLmdhbWUucmVyZW5kZXJBbGwoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlBlbmFsaWRhZGUgZG8gXFxcIm5cdTAwRTNvIGZlaXRvXFxcIlwiKVxuICAgICAgLnNldERlc2MoXCJNdWx0aXBsaWNhIGEgYmFzZSBkYSBwcmlvcmlkYWRlIGFvIG1hcmNhciBjb21vIG5cdTAwRTNvIGZlaXRhLiBFeC46IDEsNSA9IHBlcmRlIDUwJSBhIG1haXMgZG8gcXVlIGdhbmhhcmlhLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB0XG4gICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIjEuNVwiKVxuICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHBsdWdpbi5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvcikpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICBjb25zdCBuID0gTnVtYmVyKHYucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbiAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwKSB7IHBsdWdpbi5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvciA9IG47IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfVxuICAgICAgICB9KSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUGFjb3RlcyBkZSB0YXJlZmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlBhY290ZXMgZGUgdGFyZWZhc1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkNvbmp1bnRvcyBkZSB0YXJlZmFzIHF1ZSB2b2NcdTAwRUEgbGFuXHUwMEU3YSBubyBUb2RvaXN0IGNvbSB1bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0IG91IG5vIGRhc2hib2FyZCksIHRvZGFzIGNvbSBkYXRhIGRlIGhvamUuIFVtYSB0YXJlZmEgcG9yIGxpbmhhLiBOdW1hIGxpbmhhLCB1c2UgQGV0aXF1ZXRhIHBhcmEgYXBsaWNhciB1bWEgZXRpcXVldGEgc1x1MDBGMyBcdTAwRTBxdWVsYSB0YXJlZmEgZSBwMVx1MjAxM3A0IHBhcmEgYSBwcmlvcmlkYWRlIChwMSA9IG1haXMgYWx0YTsgcGFkclx1MDBFM28gcDQpLlwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm1hciBhbnRlcyBkZSBsYW5cdTAwRTdhclwiKVxuICAgICAgLnNldERlc2MoXCJQZWRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzbyAoY29tIGEgbGlzdGEgZGUgdGFyZWZhcykgYW50ZXMgZGUgY3JpYXIuIFxcXCJTZW1wcmVcXFwiIGNvbmZpcm1hIGF0XHUwMEU5IHBhcmEgMSB0YXJlZmEgXHUyMDE0IFx1MDBGQXRpbCBwYXJhIHRlc3RhcjsgZGVwb2lzIG11ZGUgcGFyYSBOdW5jYS5cIilcbiAgICAgIC5hZGREcm9wZG93bihkID0+IGRcbiAgICAgICAgLmFkZE9wdGlvbihcImFsd2F5c1wiLCBcIlNlbXByZVwiKVxuICAgICAgICAuYWRkT3B0aW9uKFwibWFueVwiLCBcIlNcdTAwRjMgbXVpdGFzICg+IDUgdGFyZWZhcylcIilcbiAgICAgICAgLmFkZE9wdGlvbihcIm5ldmVyXCIsIFwiTnVuY2FcIilcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSlcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBwbHVnaW4uc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gPSB2IGFzIERhc2hTZXR0aW5nc1tcInBhY2thZ2VDb25maXJtXCJdOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH0pKTtcblxuICAgIGNvbnN0IHRva2VuID0gcGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgLy8gQnVzY2EgcHJvamV0b3MgZSBldGlxdWV0YXMgdW1hIHZleiAoZHJvcGRvd25zICsgY2hpcHMpOyBhbyBjaGVnYXIsIHJlLXJlbmRlcml6YS5cbiAgICBpZiAodG9rZW4gJiYgdGhpcy5wcm9qZWN0cyA9PT0gbnVsbCkge1xuICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLnRoZW4ocHMgPT4geyB0aGlzLnByb2plY3RzID0gcHM7IHRoaXMuZGlzcGxheSgpOyB9KS5jYXRjaCgoKSA9PiB7IHRoaXMucHJvamVjdHMgPSBbXTsgfSk7XG4gICAgfVxuICAgIGlmICh0b2tlbiAmJiB0aGlzLmxhYmVscyA9PT0gbnVsbCkge1xuICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS50aGVuKGxzID0+IHsgdGhpcy5sYWJlbHMgPSBsczsgdGhpcy5kaXNwbGF5KCk7IH0pLmNhdGNoKCgpID0+IHsgdGhpcy5sYWJlbHMgPSBbXTsgfSk7XG4gICAgfVxuXG4gICAgLy8gUG9wb3ZlciBkZSBldGlxdWV0YXMgZGUgdW0gcGFjb3RlIChjaGlwcyB0b2dnbGUgY29tIGEgY29yIGRvIFRvZG9pc3QpLlxuICAgIGNvbnN0IG9wZW5MYWJlbHNQb3BvdmVyID0gKGFuY2hvcjogSFRNTEVsZW1lbnQsIHBrZzogVGFza1BhY2thZ2UsIHJlZnJlc2g6ICgpID0+IHZvaWQpID0+XG4gICAgICBvcGVuUG9wb3ZlcihhbmNob3IsIGJvZHkgPT4ge1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3AtdGl0bGVcIiwgdGV4dDogXCJFdGlxdWV0YXMgZG8gcGFjb3RlXCIgfSk7XG4gICAgICAgIGlmICghdG9rZW4pIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIgfSk7IHJldHVybjsgfVxuICAgICAgICBpZiAodGhpcy5sYWJlbHMgPT09IG51bGwpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG9cdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGlmICghdGhpcy5sYWJlbHMubGVuZ3RoKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QuXCIgfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBjaGlwcyA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC1jaGlwc1wiIH0pO1xuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY2hpcHMuZW1wdHkoKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5sYWJlbHMhKSB7XG4gICAgICAgICAgICBjb25zdCBvbiA9IChwa2cubGFiZWxzID8/IFtdKS5pbmNsdWRlcyhsLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY2hpcCA9IGNoaXBzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDSztcbiAgICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsLm5hbWV9YCB9KTtcbiAgICAgICAgICAgIGNsaWNrYWJsZShjaGlwLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGN1ciA9IHBrZy5sYWJlbHMgPz8gW107XG4gICAgICAgICAgICAgIGNvbnN0IGkgPSBjdXIuaW5kZXhPZihsLm5hbWUpO1xuICAgICAgICAgICAgICBpZiAoaSA+PSAwKSBjdXIuc3BsaWNlKGksIDEpOyBlbHNlIGN1ci5wdXNoKGwubmFtZSk7XG4gICAgICAgICAgICAgIHBrZy5sYWJlbHMgPSBjdXIubGVuZ3RoID8gY3VyIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgICAgICAgIHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LCB7IGNsczogXCJ3ZC1wb3AtbGFiZWxzXCIgfSk7XG5cbiAgICAvLyBQb3BvdmVyIGRlIHRhcmVmYXMgZGUgdW0gcGFjb3RlICh0ZXh0YXJlYTsgcGVyc2lzdGUgbm8gaW5wdXQgZSBhbyBmZWNoYXIpLlxuICAgIGNvbnN0IG9wZW5UYXNrc1BvcG92ZXIgPSAoYW5jaG9yOiBIVE1MRWxlbWVudCwgcGtnOiBUYXNrUGFja2FnZSwgcmVmcmVzaDogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgbGV0IHRhOiBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgICAgb3BlblBvcG92ZXIoYW5jaG9yLCBib2R5ID0+IHtcbiAgICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLXRpdGxlXCIsIHRleHQ6IFwiVGFyZWZhcyBkbyBwYWNvdGVcIiB9KTtcbiAgICAgICAgdGEgPSBib2R5LmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtcGtnLXRhc2tzXCIgfSk7XG4gICAgICAgIHRhLnZhbHVlID0gcGtnLnRhc2tzLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIHRhLnBsYWNlaG9sZGVyID0gXCJVbWEgdGFyZWZhIHBvciBsaW5oYSAoZXguOiBCZWJlciBcdTAwRTFndWEpXCI7XG4gICAgICAgIHRhLnJvd3MgPSA2O1xuICAgICAgICB0YS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHBrZy50YXNrcyA9IHRhLnZhbHVlLnNwbGl0KFwiXFxuXCIpLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJVbWEgcG9yIGxpbmhhIFx1MDBCNyBAZXRpcXVldGEgbWFyY2Egc1x1MDBGMyBhcXVlbGEgdGFyZWZhIFx1MDBCNyBwMVx1MjAxM3A0IGRlZmluZSBhIHByaW9yaWRhZGUgKHAxID0gbWFpcyBhbHRhKSBcdTAwQjcgZmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjLlwiIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRhLmZvY3VzKCksIDApO1xuICAgICAgfSwgeyBjbHM6IFwid2QtcG9wLXRhc2tzXCIsIHdpZHRoOiAzMjAsIGNvbnRhaW5lcjogdGhpcy5jb250YWluZXJFbCwgb25DbG9zZTogKCkgPT4geyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0gfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBrZ3MgPSBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGNvbnN0IGxpc3QgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWxpc3RcIiB9KTtcbiAgICBwa2dzLmZvckVhY2goKHBrZywgaWR4KSA9PiB7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctcm93XCIgfSk7XG5cbiAgICAgIC8vIFx1MDBDRGNvbmUgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIgZGUgcGFsZXRhKS5cbiAgICAgIGNvbnN0IGljb25CdG4gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbnRyaWdnZXJcIiB9KTtcbiAgICAgIGljb25CdG4uc2V0QXR0cihcInRpdGxlXCIsIFwiXHUwMENEY29uZSBkbyBwYWNvdGVcIik7XG4gICAgICBjb25zdCBmaWxsSWNvbiA9ICgpID0+IHtcbiAgICAgICAgaWNvbkJ0bi5lbXB0eSgpO1xuICAgICAgICBpZiAocGtnLmljb24pIHJlbmRlckljb24oaWNvbkJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29cIiB9KSwgcGtnLmljb24pO1xuICAgICAgICBlbHNlIGljb25CdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvLWVtcHR5XCIsIHRleHQ6IFwiK1wiIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxJY29uKCk7XG4gICAgICBjbGlja2FibGUoaWNvbkJ0biwgKCkgPT4gb3Blbkljb25Qb3BvdmVyKGljb25CdG4sIHBrZy5pY29uLCBhc3luYyBpYyA9PiB7XG4gICAgICAgIHBrZy5pY29uID0gaWM7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyBmaWxsSWNvbigpO1xuICAgICAgfSkpO1xuXG4gICAgICAvLyBOb21lLlxuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXBrZy1uYW1lLWlucHV0XCIsIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIk5vbWUgZG8gcGFjb3RlXCIgfSB9KTtcbiAgICAgIG5hbWUudmFsdWUgPSBwa2cubmFtZTtcbiAgICAgIG5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGFzeW5jICgpID0+IHsgcGtnLm5hbWUgPSBuYW1lLnZhbHVlOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH0pO1xuICAgICAgbmFtZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKSk7XG5cbiAgICAgIC8vIFByb2pldG8uXG4gICAgICBjb25zdCBwcm9qID0gcm93LmNyZWF0ZUVsKFwic2VsZWN0XCIsIHsgY2xzOiBcIndkLXBrZy1wcm9qIGRyb3Bkb3duXCIgfSk7XG4gICAgICBjb25zdCBhZGRPcHQgPSAodjogc3RyaW5nLCB0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgbyA9IHByb2ouY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiB0LCB2YWx1ZTogdiB9KTtcbiAgICAgICAgaWYgKChwa2cucHJvamVjdElkID8/IFwiXCIpID09PSB2KSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgICBhZGRPcHQoXCJcIiwgXCJFbnRyYWRhXCIpO1xuICAgICAgZm9yIChjb25zdCBwIG9mICh0aGlzLnByb2plY3RzID8/IFtdKSkgYWRkT3B0KHAuaWQsIHAubmFtZSk7XG4gICAgICBwcm9qLm9uY2hhbmdlID0gYXN5bmMgKCkgPT4geyBwa2cucHJvamVjdElkID0gcHJvai52YWx1ZSB8fCB1bmRlZmluZWQ7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfTtcblxuICAgICAgLy8gRXRpcXVldGFzIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyKS5cbiAgICAgIGNvbnN0IGxibEJ0biA9IHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC1wa2ctY2hpcC1idG5cIiB9KTtcbiAgICAgIGNvbnN0IGZpbGxMYmwgPSAoKSA9PiB7XG4gICAgICAgIGxibEJ0bi5lbXB0eSgpO1xuICAgICAgICBzZXRJY29uKGxibEJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1idG4taWNvXCIgfSksIFwidGFnXCIpO1xuICAgICAgICBsYmxCdG4uY3JlYXRlU3Bhbih7IHRleHQ6IFwiRXRpcXVldGFzXCIgfSk7XG4gICAgICAgIGNvbnN0IG4gPSBwa2cubGFiZWxzPy5sZW5ndGggPz8gMDtcbiAgICAgICAgaWYgKG4pIGxibEJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1jb3VudFwiLCB0ZXh0OiBTdHJpbmcobikgfSk7XG4gICAgICB9O1xuICAgICAgZmlsbExibCgpO1xuICAgICAgbGJsQnRuLm9uY2xpY2sgPSAoKSA9PiBvcGVuTGFiZWxzUG9wb3ZlcihsYmxCdG4sIHBrZywgZmlsbExibCk7XG5cbiAgICAgIC8vIFRhcmVmYXMgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIpLlxuICAgICAgY29uc3QgdGFza0J0biA9IHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC1wa2ctY2hpcC1idG5cIiB9KTtcbiAgICAgIGNvbnN0IGZpbGxUYXNrID0gKCkgPT4ge1xuICAgICAgICB0YXNrQnRuLmVtcHR5KCk7XG4gICAgICAgIHNldEljb24odGFza0J0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1idG4taWNvXCIgfSksIFwibGlzdFwiKTtcbiAgICAgICAgdGFza0J0bi5jcmVhdGVTcGFuKHsgdGV4dDogXCJUYXJlZmFzXCIgfSk7XG4gICAgICAgIGNvbnN0IG4gPSBwa2cudGFza3MuZmlsdGVyKHMgPT4gcy50cmltKCkpLmxlbmd0aDtcbiAgICAgICAgaWYgKG4pIHRhc2tCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogU3RyaW5nKG4pIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxUYXNrKCk7XG4gICAgICB0YXNrQnRuLm9uY2xpY2sgPSAoKSA9PiBvcGVuVGFza3NQb3BvdmVyKHRhc2tCdG4sIHBrZywgZmlsbFRhc2spO1xuXG4gICAgICAvLyBSZW9yZGVuYXIgLyByZW1vdmVyLlxuICAgICAgY29uc3QgdXAgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaVwiICsgKGlkeCA9PT0gMCA/IFwiIHdkLWRpc2FibGVkXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24odXAsIFwiY2hldnJvbi11cFwiKTsgdXAuc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgcGFyYSBjaW1hXCIpO1xuICAgICAgaWYgKGlkeCA+IDApIGNsaWNrYWJsZSh1cCwgYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVBhY2thZ2UoaWR4LCAtMSk7IHRoaXMuZGlzcGxheSgpOyB9KTtcbiAgICAgIGNvbnN0IGRvd24gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaVwiICsgKGlkeCA9PT0gcGtncy5sZW5ndGggLSAxID8gXCIgd2QtZGlzYWJsZWRcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihkb3duLCBcImNoZXZyb24tZG93blwiKTsgZG93bi5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBwYXJhIGJhaXhvXCIpO1xuICAgICAgaWYgKGlkeCA8IHBrZ3MubGVuZ3RoIC0gMSkgY2xpY2thYmxlKGRvd24sIGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVQYWNrYWdlKGlkeCwgKzEpOyB0aGlzLmRpc3BsYXkoKTsgfSk7XG4gICAgICBjb25zdCBkZWwgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaSB3ZC1wa2ctZGVsXCIgfSk7XG4gICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpOyBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiUmVtb3ZlciBwYWNvdGVcIik7XG4gICAgICBjbGlja2FibGUoZGVsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMgPSBwa2dzLmZpbHRlcih4ID0+IHggIT09IHBrZyk7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFkaWNpb25hciBwYWNvdGVcIilcbiAgICAgIC5hZGRCdXR0b24oYiA9PiBiXG4gICAgICAgIC5zZXRCdXR0b25UZXh0KFwiKyBOb3ZvIHBhY290ZVwiKVxuICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcy5wdXNoKHsgaWQ6IHVpZCgpLCBuYW1lOiBcIk5vdm8gcGFjb3RlXCIsIHRhc2tzOiBbXSB9KTtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJUb2tlbiBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiVG9kb2lzdCBcdTIxOTIgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIEludGVncmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgVG9rZW4gZGUgQVBJIGRvIGRlc2Vudm9sdmVkb3IuIFNhbHZvIGxvY2FsbWVudGUgZW0gZGF0YS5qc29uIChuXHUwMEUzbyB2YWkgcGFyYSBvIEdpdCkuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImNvbGUgbyB0b2tlbiBhcXVpXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4gPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJFeGliaVx1MDBFN1x1MDBFM28gZGFzIHRhcmVmYXNcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIG8gcHJvamV0byBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIG8gbm9tZSBkbyBwcm9qZXRvIGFvIGxhZG8gZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBhcyBAZXRpcXVldGFzIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNpbmNyb25pemFcdTAwRTdcdTAwRTNvIChTeW5jdGhpbmcpXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiRXN0YXMgY3JlZGVuY2lhaXMgc1x1MDBFM28gZ3VhcmRhZGFzIHBvciBkaXNwb3NpdGl2byAobG9jYWxTdG9yYWdlKSBcdTIwMTQgY2FkYSBtXHUwMEUxcXVpbmEgdGVtIGEgc3VhIGUgZWxhcyBuXHUwMEUzbyBzaW5jcm9uaXphbSBwZWxvIFN5bmN0aGluZyBuZW0gdlx1MDBFM28gcGFyYSBvIEdpdC5cIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJVUkwgZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIkVuZGVyZVx1MDBFN28gZG8gU3luY3RoaW5nLiBQYWRyXHUwMEUzbzogaHR0cDovLzEyNy4wLjAuMTo4Mzg0IChhIGluc3RcdTAwRTJuY2lhIGxvY2FsKS4gTm8gY2VsdWxhciwgYXBvbnRlIHBhcmEgYSBBUEkgZGUgb3V0cmEgbVx1MDBFMXF1aW5hIG5hIHJlZGUgc2UgYSBsb2NhbCBuXHUwMEUzbyByZXNwb25kZXIuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsID0gdi50cmltKCkgfHwgXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBUEkga2V5XCIpXG4gICAgICAuc2V0RGVzYyhcIlN5bmN0aGluZyBcdTIxOTIgQWN0aW9ucyBcdTIxOTIgU2V0dGluZ3MgXHUyMTkyIEFQSSBLZXkuIEd1YXJkYWRhIHBvciBkaXNwb3NpdGl2byAobG9jYWxTdG9yYWdlKSwgblx1MDBFM28gdmFpIHBhcmEgbyBkYXRhLmpzb24vR2l0LlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIGEgQVBJIGtleVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIklEIGRhIHBhc3RhIChvcGNpb25hbClcIilcbiAgICAgIC5zZXREZXNjKFwiRm9sZGVyIElEIGRvIGNvZnJlIG5vIFN5bmN0aGluZy4gVmF6aW8gPSB1c2EgYSBwcmltZWlyYSBwYXN0YSBhdXRvbWF0aWNhbWVudGUuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImV4LjogbnVucXYtbXRpbW5cIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGNvbnRhZ2VtIGRlIGl0ZW5zIHBvciBhcGFyZWxob1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBcXFwic2luY3Jvbml6YWRvcyAvIHRvdGFsXFxcIiBkZSBpdGVucyBlbSBjYWRhIGFwYXJlbGhvLCBhbFx1MDBFOW0gZGEgcG9yY2VudGFnZW0uXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgIH0pKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQTJLO0FBRTNLLElBQU0sWUFBWTtBQUNsQixJQUFNLG9CQUFvQjtBQUsxQixJQUFNLFlBQVk7QUFDbEIsSUFBTSxZQUFZO0FBQ2xCLElBQU0sZUFBZTtBQUNyQixJQUFNLGdCQUFnQjtBQUN0QixJQUFNLFdBQVcsSUFBSSxLQUFLO0FBQzFCLElBQU0saUJBQWlCO0FBR3ZCLElBQU0saUJBQWlCO0FBQ3ZCLElBQU0sZ0JBQWdCO0FBQ3RCLElBQU0saUJBQWlCO0FBQ3ZCLElBQU0sd0JBQXdCO0FBRTlCLElBQU0sWUFBb0MsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFDbkUsU0FBUyxjQUFjLEdBQW1C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
