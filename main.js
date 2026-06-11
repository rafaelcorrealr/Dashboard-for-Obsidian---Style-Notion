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
  const stripped = line.replace(/(?<=^|\s)@([\p{L}\p{N}_]+)/gu, (_m, name) => {
    inline.push(name);
    return "";
  }).replace(/\s{2,}/g, " ").trim();
  const title = stripped || line.trim();
  const labels = [.../* @__PURE__ */ new Set([...pkgLabels, ...inline])];
  return { title, labels };
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
  document.querySelectorAll(".wd-pop").forEach((e) => e.remove());
  const pop = document.body.createDiv({ cls: "wd-pop" + (opts.cls ? " " + opts.cls : "") });
  if (opts.width) pop.style.width = `${opts.width}px`;
  const onDoc = (e) => {
    const t = e.target;
    if (!pop.contains(t) && t !== anchor && !anchor.contains(t)) close();
  };
  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  function close() {
    var _a;
    (_a = opts.onClose) == null ? void 0 : _a.call(opts);
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
          text: it.title,
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
      for (const { title, labels } of items) {
        try {
          const fields = { content: title, due_date: due };
          if (pkg.projectId) fields.project_id = pkg.projectId;
          if (labels.length) fields.labels = labels;
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
    bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${s.xpForNext ? Math.min(100, Math.round(s.xpIntoLevel / s.xpForNext * 100)) : 0}%`;
    bar.setAttr("title", `${s.xpIntoLevel}/${s.xpForNext} XP para o n\xEDvel ${s.level + 1}`);
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
      text: "Conjuntos de tarefas que voc\xEA lan\xE7a no Todoist com um clique (na aba Todoist ou no dashboard), todas com data de hoje. Uma tarefa por linha. Use @etiqueta numa linha para aplicar uma etiqueta s\xF3 \xE0quela tarefa."
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
        body.createDiv({ cls: "wd-tf-hint", text: "Uma por linha \xB7 @etiqueta marca s\xF3 aquela tarefa \xB7 fecha ao clicar fora ou Esc." });
        setTimeout(() => ta.focus(), 0);
      }, { cls: "wd-pop-tasks", width: 320, onClose: () => {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5jb25zdCBMU19UT0RPX0NBQ0hFID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6dG9kb2lzdENhY2hlXCI7ICAgLy8gY2FjaGUgb2ZmbGluZSBkbyBUb2RvaXN0IChwb3ItZGlzcG9zaXRpdm8pXG5jb25zdCBUT0RPX1RUTCA9IDUgKiA2MCAqIDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZGFkZSBtXHUwMEUxeC4gZG8gY2FjaGUgYW50ZXMgZGUgcmUtYnVzY2FyICg1IG1pbilcbmNvbnN0IFRPRE9fTUFYX1BBR0VTID0gNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRldG8gZGUgcFx1MDBFMWdpbmFzIHBhZ2luYWRhcyAoYW50aS1sb29wIHNlIGEgQVBJIHJlcGV0aXIgbyBjdXJzb3IpXG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM28gKHYwLjEzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEdBTUVfVklFV19UWVBFID0gXCJ3ZXJ1cy1nYW1lXCI7XG5jb25zdCBHQU1FX0xPR19QQVRIID0gXCIyMC5BcmVhcy9HYW1pZmljYVx1MDBFN1x1MDBFM28ubWRcIjsgICAgICAgIC8vIGxvZyBjYW5cdTAwRjRuaWNvIGRlIFhQIG5vIGNvZnJlXG5jb25zdCBHQU1FX0xPR19GRU5DRSA9IFwid2QtZ2FtZS1sb2dcIjsgICAgICAgICAgICAgICAgICAgLy8gYmxvY28gY2VyY2FkbyBjb20gb3MgZXZlbnRvcyAoMSBwb3IgbGluaGEpXG5jb25zdCBIQVJWRVNUX0JBQ0tGSUxMX0RBWVMgPSA5MDsgICAgICAgICAgICAgICAgICAgICAgIC8vIDFcdTAwQUEgY29saGVpdGE6IGphbmVsYSBtXHUwMEUxeC4gZGEgQVBJXG4vLyBYUCBiYXNlIHBvciBwcmlvcmlkYWRlIGRhIEFQSSAoNCA9IHAxIFx1MjAyNiAxID0gcDQpLlxuY29uc3QgWFBfQllfUFJJOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+ID0geyA0OiA4LCAzOiA1LCAyOiAzLCAxOiAxIH07XG5mdW5jdGlvbiB4cEZvclByaW9yaXR5KHA6IG51bWJlcik6IG51bWJlciB7IHJldHVybiBYUF9CWV9QUklbcF0gPz8gMTsgfVxuXG4vLyB1aWQgY3VydG8gZSBlc3RcdTAwRTF2ZWwgKHBhY290ZXMgZGUgdGFyZWZhcykuXG5mdW5jdGlvbiB1aWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyk7XG59XG5cbnR5cGUgU3RhdHVzID0gXCJwcm9ncmVzc1wiIHwgXCJwYXVzZWRcIiB8IFwiY2FuY2VsbGVkXCI7XG50eXBlIFNlY3Rpb25JZCA9IFwiY2FsZW5kYXJcIiB8IFwicGFyYVwiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiIHwgXCJ0b2RvaXN0XCIgfCBcInN5bmNcIiB8IFwiZ2FtZVwiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG4gIC8vIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodjAuMTMpXG4gIGdhbWlmaWNhdGlvbkVuYWJsZWQ6IGJvb2xlYW47ICAvLyBtb3N0cmEgYSBzZVx1MDBFN1x1MDBFM28vYWJhIGRvIEdhbWVcbiAgZ2FtZVBlbmFsdHlGYWN0b3I6IG51bWJlcjsgICAgIC8vIFwiblx1MDBFM28gZmVpdG9cIiB0aXJhIGJhc2UgXHUwMEQ3IGZhdG9yXG4gIGdhbWVMYXN0SGFydmVzdDogc3RyaW5nOyAgICAgICAvLyBJU08gZGEgXHUwMEZBbHRpbWEgY29saGVpdGEgZGUgY29uY2x1XHUwMEVEZGFzIChsaW1pdGEgbyBmZXRjaClcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogRGFzaFNldHRpbmdzID0ge1xuICBzZWN0aW9uT3JkZXI6IFtcInN0YXRzXCIsIFwiZ2FtZVwiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXSxcbiAgY29tcGFjdDogZmFsc2UsXG4gIGhpZGRlbjogW10sXG4gIG5vdGVWaWV3OiBcImxpc3RcIixcbiAgY2FsZW5kYXJTb3VyY2VzOiBbXG4gICAgeyBwYXRoOiBcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiLCBjb2xvcjogXCIjM0I4MkY2XCIsIG9uOiB0cnVlIH0sXG4gICAgeyBwYXRoOiBcIjUwLkRpXHUwMEUxcmlvXCIsICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMTBCOTgxXCIsIG9uOiB0cnVlIH0sXG4gIF0sXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbiAgdG9kb2lzdERheVJhbmdlOiA3LFxuICB0b2RvaXN0RmlsdGVyczogeyBwcm9qZWN0czogW10sIGxhYmVsczogW10gfSxcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiB0cnVlLFxuICB0b2RvaXN0U2hvd0xhYmVsczogZmFsc2UsXG4gIHN5bmN0aGluZ1VybDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIixcbiAgc3luY3RoaW5nQXBpS2V5OiBcIlwiLFxuICBzeW5jdGhpbmdGb2xkZXJJZDogXCJcIixcbiAgc3luY3RoaW5nU2hvd0NvdW50czogZmFsc2UsXG4gIHRhc2tQYWNrYWdlczogW10sXG4gIHBhY2thZ2VDb25maXJtOiBcIm1hbnlcIixcbiAgZ2FtaWZpY2F0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgZ2FtZVBlbmFsdHlGYWN0b3I6IDEuNSxcbiAgZ2FtZUxhc3RIYXJ2ZXN0OiBcIlwiLFxufTtcblxuaW50ZXJmYWNlIFBhcmFTZWN0aW9uIHtcbiAgZm9sZGVyOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgYWNjZW50OiBzdHJpbmc7XG59XG5cbi8vIFBhc3RhcyBcImNvbmhlY2lkYXNcIiBkbyBQQVJBOiBtYW50XHUwMEVBbSBcdTAwRURjb25lLCByXHUwMEYzdHVsbyBlIGNvciBmaXhvcy4gQXMgZGVtYWlzIHBhc3Rhc1xuLy8gZG8gY29mcmUgc1x1MDBFM28gcmVuZGVyaXphZGFzIGNvbSBjb3IgYXV0b21cdTAwRTF0aWNhIGUgXHUwMEVEY29uZSBwYWRyXHUwMEUzbyAob3UgbyBpY29uOiBkbyBzdGF0dXMubWQpLlxuY29uc3QgUEFSQTogUGFyYVNlY3Rpb25bXSA9IFtcbiAgeyBmb2xkZXI6IFwiMDAuSW5ib3hcIiwgICAgIGljb246IFwiXHVEODNEXHVEQ0U1XCIsIGxhYmVsOiBcIkluYm94XCIsICAgIGFjY2VudDogXCIjNjM2NkYxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMTAuUHJvamVjdHNcIiwgIGljb246IFwiXHVEODNEXHVERTgwXCIsIGxhYmVsOiBcIlByb2pldG9zXCIsIGFjY2VudDogXCIjMTBCOTgxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMjAuQXJlYXNcIiwgICAgIGljb246IFwiXHVEODNDXHVERkFGXCIsIGxhYmVsOiBcIlx1MDBDMXJlYXNcIiwgICAgYWNjZW50OiBcIiNGNTlFMEJcIiB9LFxuICB7IGZvbGRlcjogXCIzMC5SZXNvdXJjZXNcIiwgaWNvbjogXCJcdUQ4M0RcdURDREFcIiwgbGFiZWw6IFwiUmVjdXJzb3NcIiwgYWNjZW50OiBcIiMzQjgyRjZcIiB9LFxuICB7IGZvbGRlcjogXCI0MC5BcmNoaXZlXCIsICAgaWNvbjogXCJcdUQ4M0RcdUREQzRcdUZFMEZcIiwgIGxhYmVsOiBcIkFycXVpdm9cIiwgIGFjY2VudDogXCIjNkI3MjgwXCIgfSxcbl07XG5jb25zdCBQQVJBX01BUCA9IG5ldyBNYXAoUEFSQS5tYXAocCA9PiBbcC5mb2xkZXIsIHBdKSk7XG5cbi8vIFBhbGV0YSBwYXJhIGNvbG9yaXIgcGFzdGFzIGRlc2NvbmhlY2lkYXMgZGUgZm9ybWEgZXN0XHUwMEUxdmVsIChwb3IgaGFzaCBkbyBub21lKS5cbmNvbnN0IEFDQ0VOVFMgPSBbXCIjNjM2NkYxXCIsXCIjMTBCOTgxXCIsXCIjRjU5RTBCXCIsXCIjM0I4MkY2XCIsXCIjRUM0ODk5XCIsXCIjOEI1Q0Y2XCIsXCIjMTRCOEE2XCIsXCIjRUY0NDQ0XCJdO1xuXG5jb25zdCBEQVlfU0hPUlQgPSBbXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTXHUwMEUxYlwiLCBcIkRvbVwiXTtcbmNvbnN0IE1PTlRIX1NIT1JUID0gW1wiSmFuXCIsXCJGZXZcIixcIk1hclwiLFwiQWJyXCIsXCJNYWlcIixcIkp1blwiLFwiSnVsXCIsXCJBZ29cIixcIlNldFwiLFwiT3V0XCIsXCJOb3ZcIixcIkRlelwiXTtcbmNvbnN0IElNR19FWFQgPSBbXCJwbmdcIixcImpwZ1wiLFwianBlZ1wiLFwid2VicFwiLFwiZ2lmXCIsXCJzdmdcIl07XG5cbi8vIFBhc3RhIHJhaXogZGFzIG5vdGFzIGRpXHUwMEUxcmlhcyAoY3JpYWRhcyBhbyBjbGljYXIgbnVtIGRpYSBkbyBjYWxlbmRcdTAwRTFyaW8pLlxuY29uc3QgREFJTFlfRk9MREVSID0gXCI1MC5EaVx1MDBFMXJpb1wiO1xuLy8gVGVtcGxhdGUgb3BjaW9uYWw7IHBsYWNlaG9sZGVycyB7e2RhdGV9fSAoWVlZWS1NTS1ERCkgZSB7e3RpdGxlfX0gKGRhdGEgcG9yIGV4dGVuc28pLlxuY29uc3QgREFJTFlfVEVNUExBVEUgPSBcIk1vZGVsb3MvTm90YSBEaVx1MDBFMXJpYS5tZFwiO1xuXG5jb25zdCBTVEFUVVNfSUNPTjogUmVjb3JkPFN0YXR1cywgc3RyaW5nPiA9IHtcbiAgcHJvZ3Jlc3M6IFwiXHUyNUI2XCIsIHBhdXNlZDogXCJcdTIzRjhcIiwgY2FuY2VsbGVkOiBcIlx1MjcxNVwiLFxufTtcblxuY29uc3QgU0VDX0NBTCA9IFwic2VjOmNhbGVuZGFyXCI7XG5jb25zdCBTRUNfUEFSQSA9IFwic2VjOnBhcmFcIjtcbmNvbnN0IFNFQ19IRUFUID0gXCJzZWM6aGVhdG1hcFwiO1xuY29uc3QgU0VDX0dST1cgPSBcInNlYzpncm93dGhcIjtcbmNvbnN0IFNFQ19TVEFUID0gXCJzZWM6c3RhdHNcIjtcbmNvbnN0IFNFQ19UT0RPID0gXCJzZWM6dG9kb2lzdFwiO1xuY29uc3QgU0VDX1NZTkMgPSBcInNlYzpzeW5jXCI7XG5jb25zdCBTRUNfR0FNRSA9IFwic2VjOmdhbWVcIjtcblxuLy8gUlx1MDBGM3R1bG9zIGFtaWdcdTAwRTF2ZWlzIGRhcyBzZVx1MDBFN1x1MDBGNWVzICh1c2Fkb3MgbmEgYWJhIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzKS5cbmNvbnN0IFNFQ1RJT05fTEFCRUw6IFJlY29yZDxTZWN0aW9uSWQsIHN0cmluZz4gPSB7XG4gIHN0YXRzOiAgICBcIkVzdGF0XHUwMEVEc3RpY2FzXCIsXG4gIHRvZG9pc3Q6ICBcIlRhcmVmYXNcIixcbiAgcGFyYTogICAgIFwiQ29mcmUgKHBhc3RhcylcIixcbiAgc3luYzogICAgIFwiU2luY3Jvbml6YVx1MDBFN1x1MDBFM29cIixcbiAgaGVhdG1hcDogIFwiQXRpdmlkYWRlIGRvIGNvZnJlXCIsXG4gIGdyb3d0aDogICBcIkNyZXNjaW1lbnRvIGRvIGNvZnJlXCIsXG4gIGNhbGVuZGFyOiBcIlJlbGF0XHUwMEYzcmlvc1wiLFxuICBnYW1lOiAgICAgXCJHYW1pZmljYVx1MDBFN1x1MDBFM29cIixcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVG9kb2lzdFRhc2sge1xuICBpZDogc3RyaW5nO1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSTogMS4uNCwgb25kZSA0ID0gdXJnZW50ZSAoPSBwMSBuYSBVSSlcbiAgZHVlPzogeyBkYXRlOiBzdHJpbmc7IGRhdGV0aW1lPzogc3RyaW5nOyBzdHJpbmc/OiBzdHJpbmc7IGlzX3JlY3VycmluZz86IGJvb2xlYW4gfSB8IG51bGw7XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG4gIGlzX2NvbXBsZXRlZD86IGJvb2xlYW47XG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICB1cmw/OiBzdHJpbmc7XG4gIGNvbXBsZXRlZF9hdD86IHN0cmluZzsgICAvLyBzXHUwMEYzIG5hcyBjb25jbHVcdTAwRURkYXMgKGJ5X2NvbXBsZXRpb25fZGF0ZSlcbn1cblxuLy8gUHJpb3JpZGFkZSBkYSBBUEkgKDQ9dXJnZW50ZSkgXHUyMTkyIHJcdTAwRjN0dWxvL2NvciBkYSBVSSAocDE9dmVybWVsaG8gXHUyMDI2IHA0PWNpbnphKS5cbmNvbnN0IFRPRE9JU1RfUFJJOiBSZWNvcmQ8bnVtYmVyLCB7IGxhYmVsOiBzdHJpbmc7IGNvbG9yOiBzdHJpbmcgfT4gPSB7XG4gIDQ6IHsgbGFiZWw6IFwicDFcIiwgY29sb3I6IFwiI0VGNDQ0NFwiIH0sXG4gIDM6IHsgbGFiZWw6IFwicDJcIiwgY29sb3I6IFwiI0Y1OUUwQlwiIH0sXG4gIDI6IHsgbGFiZWw6IFwicDNcIiwgY29sb3I6IFwiIzNCODJGNlwiIH0sXG4gIDE6IHsgbGFiZWw6IFwicDRcIiwgY29sb3I6IFwiIzZCNzI4MFwiIH0sXG59O1xuZnVuY3Rpb24gcHJpTWV0YShwOiBudW1iZXIpIHsgcmV0dXJuIFRPRE9JU1RfUFJJW3BdID8/IFRPRE9JU1RfUFJJWzFdOyB9XG5cbi8vIFBhbGV0YSBub21lYWRhIGRvIFRvZG9pc3QgXHUyMTkyIGhleCAocGFyYSBjb2xvcmlyIGFzIGV0aXF1ZXRhcyBjb21vIG5vIGFwcCkuXG5jb25zdCBUT0RPSVNUX0NPTE9SUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgYmVycnlfcmVkOiBcIiNCODI1NUZcIiwgcmVkOiBcIiNEQjQwMzVcIiwgb3JhbmdlOiBcIiNGRjk5MzNcIiwgeWVsbG93OiBcIiNGQUQwMDBcIixcbiAgb2xpdmVfZ3JlZW46IFwiI0FGQjgzQlwiLCBsaW1lX2dyZWVuOiBcIiM3RUNDNDlcIiwgZ3JlZW46IFwiIzI5OTQzOFwiLCBtaW50X2dyZWVuOiBcIiM2QUNDQkNcIixcbiAgdGVhbDogXCIjMTU4RkFEXCIsIHNreV9ibHVlOiBcIiMxNEFBRjVcIiwgbGlnaHRfYmx1ZTogXCIjOTZDM0VCXCIsIGJsdWU6IFwiIzQwNzNGRlwiLFxuICBncmFwZTogXCIjODg0REZGXCIsIHZpb2xldDogXCIjQUYzOEVCXCIsIGxhdmVuZGVyOiBcIiNFQjk2RUJcIiwgbWFnZW50YTogXCIjRTA1MTk0XCIsXG4gIHNhbG1vbjogXCIjRkY4RDg1XCIsIGNoYXJjb2FsOiBcIiM4MDgwODBcIiwgZ3JleTogXCIjQjhCOEI4XCIsIHRhdXBlOiBcIiNDQ0FDOTNcIixcbn07XG5jb25zdCBMQUJFTF9GQUxMQkFDSyA9IFwiI0I4QjhCOFwiO1xuLy8gTm8gbW9kbyBcIm1hbnlcIiwgbGFuXHUwMEU3YXIgbWFpcyBxdWUgaXN0byBwZWRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzby5cbmNvbnN0IExBVU5DSF9DT05GSVJNX01JTiA9IDU7XG5cbi8vIFx1MDBDRGNvbmVzIHN1Z2VyaWRvcyBwYXJhIG9zIHBhY290ZXMgKG5vbWVzIEx1Y2lkZTsgcmVuZGVyaXphZG9zIHBvciByZW5kZXJJY29uKS5cbmNvbnN0IFBLR19JQ09OUyA9IFtcbiAgXCJzdW5yaXNlXCIsIFwic3VuXCIsIFwic3Vuc2V0XCIsIFwibW9vblwiLCBcImNvZmZlZVwiLCBcInV0ZW5zaWxzXCIsIFwiZHVtYmJlbGxcIiwgXCJib29rLW9wZW5cIixcbiAgXCJicmllZmNhc2VcIiwgXCJncmFkdWF0aW9uLWNhcFwiLCBcImhvbWVcIiwgXCJzaG9wcGluZy1jYXJ0XCIsIFwiaGVhcnRcIiwgXCJkcm9wbGV0XCIsIFwicGlsbFwiLFxuICBcImJlZFwiLCBcImNsb2NrXCIsIFwiY2FsZW5kYXJcIiwgXCJjaGVjay1jaGVja1wiLCBcImxpc3QtY2hlY2tzXCIsIFwidGFyZ2V0XCIsIFwiZmxhbWVcIiwgXCJ6YXBcIixcbiAgXCJzdGFyXCIsIFwic3BhcmtsZXNcIiwgXCJyb2NrZXRcIiwgXCJicnVzaFwiLCBcIm11c2ljXCIsIFwiZ2FtZXBhZC0yXCIsIFwiZG9nXCIsXG5dO1xuXG4vLyBTZXBhcmEgYXMgZXRpcXVldGFzIGlubGluZSAoQGV0aXF1ZXRhKSBkbyB0ZXh0byBkZSB1bWEgbGluaGEgZGUgdGFyZWZhLlxuLy8gRGV2b2x2ZSBvIHRcdTAwRUR0dWxvIGxpbXBvIChlc3RpbG8gUXVpY2sgQWRkIGRvIFRvZG9pc3QpICsgZXRpcXVldGFzIGNvbWJpbmFkYXNcbi8vIChhcyBkbyBwYWNvdGUgcHJpbWVpcm8sIGRlcG9pcyBhcyBpbmxpbmUsIHNlbSBkdXBsaWNhcikuXG5mdW5jdGlvbiBzcGxpdFRhc2tMYWJlbHMobGluZTogc3RyaW5nLCBwa2dMYWJlbHM6IHN0cmluZ1tdID0gW10pOiB7IHRpdGxlOiBzdHJpbmc7IGxhYmVsczogc3RyaW5nW10gfSB7XG4gIGNvbnN0IGlubGluZTogc3RyaW5nW10gPSBbXTtcbiAgLy8gU1x1MDBGMyBgQGV0aXF1ZXRhYCBubyBpblx1MDBFRGNpbyBvdSBkZXBvaXMgZGUgZXNwYVx1MDBFN28gKGxvb2tiZWhpbmQpIFx1MjAxNCBuXHUwMEUzbyBwZWdhIG8gXCJAZ21haWxcIlxuICAvLyBkZSB1bSBlLW1haWwgY29tbyBcInBhZ2FyIGNvbnRhQGdtYWlsLmNvbVwiLlxuICBjb25zdCBzdHJpcHBlZCA9IGxpbmUucmVwbGFjZSgvKD88PV58XFxzKUAoW1xccHtMfVxccHtOfV9dKykvZ3UsIChfbSwgbmFtZTogc3RyaW5nKSA9PiB7IGlubGluZS5wdXNoKG5hbWUpOyByZXR1cm4gXCJcIjsgfSlcbiAgICAucmVwbGFjZSgvXFxzezIsfS9nLCBcIiBcIikudHJpbSgpO1xuICBjb25zdCB0aXRsZSA9IHN0cmlwcGVkIHx8IGxpbmUudHJpbSgpO1xuICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4ucGtnTGFiZWxzLCAuLi5pbmxpbmVdKV07XG4gIHJldHVybiB7IHRpdGxlLCBsYWJlbHMgfTtcbn1cblxuLy8gQWNlc3NpYmlsaWRhZGU6IGZheiB1bSBlbGVtZW50byBjbGljXHUwMEUxdmVsIChkaXYvc3Bhbikgc2UgY29tcG9ydGFyIGNvbW8gYm90XHUwMEUzbyBcdTIwMTRcbi8vIGZvY28gcG9yIHRlY2xhZG8gKFRhYiksIHBhcGVsIEFSSUEgZSBhdGl2YVx1MDBFN1x1MDBFM28gcG9yIEVudGVyL0VzcGFcdTAwRTdvIChkaXNwYXJhIG8gcHJcdTAwRjNwcmlvXG4vLyBvbmNsaWNrKS4gTyBub21lIGFjZXNzXHUwMEVEdmVsIHZlbSBkbyB0ZXh0by9gdGl0bGVgIHF1ZSBvIGNoYW1hZG9yIGpcdTAwRTEgZGVmaW5lLlxuZnVuY3Rpb24gY2xpY2thYmxlPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWw6IFQsIGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKTogVCB7XG4gIGVsLm9uY2xpY2sgPSBoYW5kbGVyO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7IGUucHJldmVudERlZmF1bHQoKTsgZWwuY2xpY2soKTsgfVxuICB9KTtcbiAgcmV0dXJuIGVsO1xufVxuXG4vLyBQb3BvdmVyIGZsdXR1YW50ZSBnZW5cdTAwRTlyaWNvLCBhbmNvcmFkbyBudW0gZWxlbWVudG8uIGBmaWxsKGJvZHksIGNsb3NlKWAgbW9udGEgb1xuLy8gY29udGVcdTAwRkFkby4gRmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjYXBlIChvcHRzLm9uQ2xvc2Ugcm9kYSBhbnRlcyBkZSByZW1vdmVyKS5cbmZ1bmN0aW9uIG9wZW5Qb3BvdmVyKFxuICBhbmNob3I6IEhUTUxFbGVtZW50LFxuICBmaWxsOiAoYm9keTogSFRNTEVsZW1lbnQsIGNsb3NlOiAoKSA9PiB2b2lkKSA9PiB2b2lkLFxuICBvcHRzOiB7IGNscz86IHN0cmluZzsgd2lkdGg/OiBudW1iZXI7IG9uQ2xvc2U/OiAoKSA9PiB2b2lkIH0gPSB7fSxcbik6ICgpID0+IHZvaWQge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndkLXBvcFwiKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gIGNvbnN0IHBvcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcFwiICsgKG9wdHMuY2xzID8gXCIgXCIgKyBvcHRzLmNscyA6IFwiXCIpIH0pO1xuICBpZiAob3B0cy53aWR0aCkgcG9wLnN0eWxlLndpZHRoID0gYCR7b3B0cy53aWR0aH1weGA7XG5cbiAgY29uc3Qgb25Eb2MgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBOb2RlO1xuICAgIGlmICghcG9wLmNvbnRhaW5zKHQpICYmIHQgIT09IGFuY2hvciAmJiAhYW5jaG9yLmNvbnRhaW5zKHQpKSBjbG9zZSgpO1xuICB9O1xuICBjb25zdCBvbktleSA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7IGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgY2xvc2UoKTsgfTtcbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgb3B0cy5vbkNsb3NlPy4oKTtcbiAgICBwb3AucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRvYywgdHJ1ZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXksIHRydWUpO1xuICB9XG5cbiAgZmlsbChwb3AsIGNsb3NlKTtcblxuICBjb25zdCByID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBwb3Auc3R5bGUudG9wID0gYCR7ci5ib3R0b20gKyA0fXB4YDtcbiAgcG9wLnN0eWxlLmxlZnQgPSBgJHtyLmxlZnR9cHhgO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGNvbnN0IHByID0gcG9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChwci5yaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgcG9wLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCB3aW5kb3cuaW5uZXJXaWR0aCAtIHByLndpZHRoIC0gOCl9cHhgO1xuICAgIGlmIChwci5ib3R0b20gPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSBwb3Auc3R5bGUudG9wID0gYCR7TWF0aC5tYXgoOCwgci50b3AgLSBwci5oZWlnaHQgLSA0KX1weGA7XG4gIH0pO1xuXG4gIC8vIFJlZ2lzdHJhIGRlcG9pcyBkbyBjbGlxdWUgZGUgYWJlcnR1cmEgcGFyYSBuXHUwMEUzbyBmZWNoYXIgaW1lZGlhdGFtZW50ZS5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRvYywgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXksIHRydWUpO1xuICB9LCAwKTtcbiAgcmV0dXJuIGNsb3NlO1xufVxuXG4vLyBQb3BvdmVyIGRlIHNlbGVcdTAwRTdcdTAwRTNvIGRlIFx1MDBFRGNvbmUgKHBhbGV0YSkuIGBjdXJyZW50YCA9IFx1MDBFRGNvbmUgc2VsZWNpb25hZG8gKGRlc3RhY2EpLlxuZnVuY3Rpb24gb3Blbkljb25Qb3BvdmVyKGFuY2hvcjogSFRNTEVsZW1lbnQsIGN1cnJlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCwgb25QaWNrOiAoaWNvbjogc3RyaW5nIHwgdW5kZWZpbmVkKSA9PiB2b2lkKSB7XG4gIG9wZW5Qb3BvdmVyKGFuY2hvciwgKHBvcCwgY2xvc2UpID0+IHtcbiAgICBjb25zdCBub25lID0gcG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb25vcHQgd2QtcGtnLWljb25ub25lXCIgKyAoIWN1cnJlbnQgPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IFwiXHUyMDE0XCIgfSk7XG4gICAgbm9uZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJTZW0gXHUwMEVEY29uZVwiKTtcbiAgICBjbGlja2FibGUobm9uZSwgKCkgPT4geyBvblBpY2sodW5kZWZpbmVkKTsgY2xvc2UoKTsgfSk7XG4gICAgZm9yIChjb25zdCBpYyBvZiBQS0dfSUNPTlMpIHtcbiAgICAgIGNvbnN0IG9wdCA9IHBvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29ub3B0XCIgKyAoY3VycmVudCA9PT0gaWMgPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICByZW5kZXJJY29uKG9wdCwgaWMpO1xuICAgICAgb3B0LnNldEF0dHIoXCJ0aXRsZVwiLCBpYyk7XG4gICAgICBjbGlja2FibGUob3B0LCAoKSA9PiB7IG9uUGljayhpYyk7IGNsb3NlKCk7IH0pO1xuICAgIH1cbiAgfSwgeyBjbHM6IFwid2QtaWNvbi1wb3BcIiB9KTtcbn1cblxuLy8gQnVzY2EgYXMgdGFyZWZhcyBhdGl2YXMgKG5cdTAwRTNvIGNvbmNsdVx1MDBFRGRhcykgdmlhIEFQSSB1bmlmaWNhZGEgdjEgKGEgUkVTVCB2MiBmb2lcbi8vIGFwb3NlbnRhZGEgXHUyMTkyIHJlc3BvbmRpYSA0MTApLiBBIHYxIFx1MDBFOSBwYWdpbmFkYTogeyByZXN1bHRzLCBuZXh0X2N1cnNvciB9LlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0VGFza3ModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFRhc2tbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBwYWdlcyA9IDA7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0VGFza1tdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICAvLyB2MSBlbnZlbG9wYSBlbSByZXN1bHRzOyB0b2xlcmEgcmVzcG9zdGEgY29tbyBhcnJheSBwdXJvIHBvciBzZWd1cmFuXHUwMEU3YS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0VGFza1tdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0UHJvamVjdCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLy8gQnVzY2Egb3MgcHJvamV0b3MgKHBhcmEgbyBmaWx0cm8pLiBNZXNtYSBBUEkgdjEgcGFnaW5hZGEgZGFzIHRhcmVmYXMuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0UHJvamVjdFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFByb2plY3RbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvcHJvamVjdHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFByb2plY3RbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFByb2plY3RbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvciAmJiArK3BhZ2VzIDwgVE9ET19NQVhfUEFHRVMpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdExhYmVsIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBjb2xvcjogc3RyaW5nOyAgIC8vIG5vbWUgZGEgcGFsZXRhIChleC46IFwiY2hhcmNvYWxcIilcbn1cblxuLy8gQnVzY2EgYXMgZXRpcXVldGFzIHBlc3NvYWlzIChwYXJhIGNvbG9yaXIgb3MgY2hpcHMpLiBNZXNtYSBBUEkgdjEgcGFnaW5hZGEuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdExhYmVsW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0TGFiZWxbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvbGFiZWxzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RMYWJlbFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0TGFiZWxbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvciAmJiArK3BhZ2VzIDwgVE9ET19NQVhfUEFHRVMpO1xuICByZXR1cm4gYWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3luY3RoaW5nIChBUEkgUkVTVCkgXHUyMDE0IHYwLjEwLjAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBTVEZvbGRlciB7IGlkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgcGF1c2VkOiBib29sZWFuIH1cbmludGVyZmFjZSBTVERldmljZSB7IGRldmljZUlEOiBzdHJpbmc7IG5hbWU6IHN0cmluZyB9XG5pbnRlcmZhY2UgU1RTdGF0dXMgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGVycm9yczogbnVtYmVyOyBwdWxsRXJyb3JzOiBudW1iZXIgfVxuaW50ZXJmYWNlIFNUQ29tcGxldGlvbiB7IGNvbXBsZXRpb246IG51bWJlcjsgZ2xvYmFsSXRlbXM6IG51bWJlcjsgbmVlZEl0ZW1zOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBuZWVkRGVsZXRlczogbnVtYmVyIH1cblxuaW50ZXJmYWNlIFN5bmNEZXZSb3cgeyBuYW1lOiBzdHJpbmc7IG9ubGluZTogYm9vbGVhbjsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXI7IGxhc3RTZWVuOiBzdHJpbmcgfVxuaW50ZXJmYWNlIFN5bmNEYXRhIHsgc3RhdGU6IHN0cmluZzsgbmVlZEZpbGVzOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBmb2xkZXJMYWJlbDogc3RyaW5nOyBlcnJvcnM6IG51bWJlcjsgZGV2aWNlczogU3luY0RldlJvd1tdIH1cblxuZnVuY3Rpb24gaHVtYW5CeXRlcyhuOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAoIW4pIHJldHVybiBcIjAgQlwiO1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDQ4NTc2KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKG4gPCAxMDI0MCA/IDEgOiAwKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAxMDQ4NTc2KS50b0ZpeGVkKG4gPCAxMDQ4NTc2MCA/IDEgOiAwKX0gTUJgO1xufVxuXG5mdW5jdGlvbiByZWxUaW1lKGlzbzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdCA9IERhdGUucGFyc2UoaXNvKTtcbiAgaWYgKGlzTmFOKHQpIHx8IHQgPCAxKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgY29uc3QgcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSB0KSAvIDEwMDApO1xuICBpZiAocyA8IDYwKSByZXR1cm4gXCJhZ29yYVwiO1xuICBpZiAocyA8IDM2MDApIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDYwKX0gbWluYDtcbiAgaWYgKHMgPCA4NjQwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gMzYwMCl9IGhgO1xuICByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyA4NjQwMCl9IGRgO1xufVxuXG4vLyBHRVQgZ2VuXHUwMEU5cmljbyBuYSBBUEkgZG8gU3luY3RoaW5nIChoZWFkZXIgWC1BUEktS2V5OyByZXF1ZXN0VXJsIGlnbm9yYSBDT1JTKS5cbmFzeW5jIGZ1bmN0aW9uIHN0R2V0PFQ+KGJhc2U6IHN0cmluZywga2V5OiBzdHJpbmcsIHBhdGg6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICBjb25zdCB1cmwgPSBiYXNlLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHsgdXJsLCBtZXRob2Q6IFwiR0VUXCIsIGhlYWRlcnM6IHsgXCJYLUFQSS1LZXlcIjoga2V5IH0sIHRocm93OiBmYWxzZSB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcIkFQSSBrZXkgaW52XHUwMEUxbGlkYSAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUO1xufVxuXG4vLyBVUkwgcGFyYSBhYnJpciBhIHRhcmVmYSBubyBUb2RvaXN0ICh1c2EgYSBkbyBwYXlsb2FkIG91IG1vbnRhIGEgcGFydGlyIGRvIGlkKS5cbmZ1bmN0aW9uIHRhc2tVcmwodDogVG9kb2lzdFRhc2spOiBzdHJpbmcge1xuICByZXR1cm4gdC51cmwgPz8gYGh0dHBzOi8vYXBwLnRvZG9pc3QuY29tL2FwcC90YXNrLyR7dC5pZH1gO1xufVxuXG4vLyBDb25jbHVpIChmZWNoYSkgdW1hIHRhcmVmYSBubyBUb2RvaXN0LiBQT1NUIHNlbSBjb3JwbzsgMjA0ID0gc3VjZXNzby4gRmFzZSA4LjIuXG5hc3luYyBmdW5jdGlvbiBjbG9zZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L2Nsb3NlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDQgJiYgcmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgRXNjcml0YTogY3JpYXIgLyBlZGl0YXIgLyBtb3ZlciAvIGV4Y2x1aXIgKHYwLjguMCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIENhbXBvcyBncmF2XHUwMEUxdmVpcy4gVG9kb3Mgb3BjaW9uYWlzIFx1MjAxNCBubyBlZGl0YXIgbWFuZG8gc1x1MDBGMyBvIHF1ZSBtdWRvdS5cbmludGVyZmFjZSBUb2RvaXN0V3JpdGUge1xuICBjb250ZW50Pzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk/OiBudW1iZXI7ICAgICAvLyAxLi40ICg0ID0gdXJnZW50ZSAvIHAxIG5hIFVJKVxuICBkdWVfZGF0ZT86IHN0cmluZzsgICAgIC8vIGRhdGEgZml4YSBZWVlZLU1NLUREICh2aW5kbyBkbyBjYWxlbmRcdTAwRTFyaW8pXG4gIGR1ZV9zdHJpbmc/OiBzdHJpbmc7ICAgLy8gbGluZ3VhZ2VtIG5hdHVyYWw7IFwibm8gZGF0ZVwiIGxpbXBhIGEgZGF0YVxuICBkdWVfbGFuZz86IHN0cmluZzsgICAgIC8vIFwicHRcIiBcdTIxOTIgaW50ZXJwcmV0YSBlbSBwb3J0dWd1XHUwMEVBc1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbn1cblxuZnVuY3Rpb24ganNvbkhlYWRlcnModG9rZW46IHN0cmluZykge1xuICByZXR1cm4geyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCwgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfTtcbn1cblxuLy8gQ3JpYSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcyBcdTIxOTIgMjAwIGNvbSBhIHRhcmVmYSBjcmlhZGEuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8VG9kb2lzdFRhc2s+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVG9kb2lzdFRhc2s7XG59XG5cbi8vIEVkaXRhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwMC4gTlx1MDBFM28gdHJvY2EgZGUgcHJvamV0byAodXNlIG1vdmVUb2RvaXN0VGFzaykuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBNb3ZlIGEgdGFyZWZhIHBhcmEgb3V0cm8gcHJvamV0by4gUE9TVCAvdGFza3Mve2lkfS9tb3ZlIFx1MjE5MiAyMDAuXG5hc3luYyBmdW5jdGlvbiBtb3ZlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgcHJvamVjdF9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9tb3ZlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHByb2plY3RfaWQgfSksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRXhjbHVpIGEgdGFyZWZhLiBERUxFVEUgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwNC5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM286IGNvbmNsdVx1MDBFRGRhcyArIGxvZyBubyBjb2ZyZSArIGNcdTAwRTFsY3VsbyAodjAuMTMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBCdXNjYSBjb25jbHVcdTAwRURkYXMgcG9yIGRhdGEgZGUgY29uY2x1c1x1MDBFM28uIEFQSSB2MTogeyBpdGVtcywgbmV4dF9jdXJzb3IgfSwgcGFnaW5hZGEuXG5hc3luYyBmdW5jdGlvbiBmZXRjaENvbXBsZXRlZFRhc2tzKHRva2VuOiBzdHJpbmcsIHNpbmNlOiBzdHJpbmcsIHVudGlsOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RUYXNrW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0VGFza1tdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy9jb21wbGV0ZWQvYnlfY29tcGxldGlvbl9kYXRlXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwic2luY2VcIiwgc2luY2UpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwidW50aWxcIiwgdW50aWwpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgaXRlbXM/OiBUb2RvaXN0VGFza1tdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBhbGwucHVzaCguLi4oZGF0YS5pdGVtcyA/PyBbXSkpO1xuICAgIGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDtcbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFVtIGV2ZW50byBkbyBsb2cgZGUgZ2FtaWZpY2FcdTAwRTdcdTAwRTNvICh0YXJlZmEgZmVpdGEgPSArWFA7IG5cdTAwRTNvLWZlaXRhID0gXHUyMjEyWFApLlxudHlwZSBHYW1lRXZlbnRUeXBlID0gXCJmZWl0b1wiIHwgXCJuYW8tZmVpdG9cIjtcbmludGVyZmFjZSBHYW1lRXZlbnQge1xuICBkYXRlOiBzdHJpbmc7ICAgICAvLyBZWVlZLU1NLUREIChkaWEgbG9jYWwgZGEgY29uY2x1c1x1MDBFM28vbWFyY2FcdTAwRTdcdTAwRTNvKVxuICB0eXBlOiBHYW1lRXZlbnRUeXBlO1xuICB4cDogbnVtYmVyOyAgICAgICAvLyBhc3NpbmFkb1xuICBrZXk6IHN0cmluZzsgICAgICAvLyBpZGVtcG90XHUwMEVBbmNpYTogYCR7dGFza0lkfXwke2NvbXBsZXRlZF9hdHx0c31gXG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgcHJvamVjdDogc3RyaW5nOyAgLy8gbm9tZSBkbyBwcm9qZXRvIChvdSBpZCBzZSBkZXNjb25oZWNpZG8pXG4gIGxhYmVsczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBHYW1lU3RhdHMge1xuICB0b3RhbFhwOiBudW1iZXI7XG4gIGxldmVsOiBudW1iZXI7XG4gIHhwSW50b0xldmVsOiBudW1iZXI7XG4gIHhwRm9yTmV4dDogbnVtYmVyO1xuICBzdHJlYWtDdXJyZW50OiBudW1iZXI7XG4gIHN0cmVha0Jlc3Q6IG51bWJlcjtcbiAgdG9kYXlYcDogbnVtYmVyO1xuICB0b2RheUNvdW50OiBudW1iZXI7XG4gIGJ5RGF5OiBNYXA8c3RyaW5nLCB7IHhwOiBudW1iZXI7IGNvdW50OiBudW1iZXIgfT47XG4gIGJ5UHJvamVjdDogTWFwPHN0cmluZywgbnVtYmVyPjsgICAvLyBzXHUwMEYzIFwiZmVpdG9cIlxuICBieUxhYmVsOiBNYXA8c3RyaW5nLCBudW1iZXI+OyAgICAgLy8gc1x1MDBGMyBcImZlaXRvXCJcbn1cblxuZnVuY3Rpb24gZ2FtZUxldmVsKHhwOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4geHAgPD0gMCA/IDAgOiBNYXRoLmZsb29yKE1hdGguc3FydCh4cCAvIDEwMCkpO1xufVxuXG4vLyBDYW1wb3Mgc2VwYXJhZG9zIHBvciBUQUIgKHJvYnVzdG86IGNvbnRlXHUwMEZBZG8vY2hhdmUgblx1MDBFM28gY29udFx1MDBFQW0gdGFiOyBhIGNoYXZlIHBvZGVcbi8vIGNvbnRlciBcInxcIiBzZW0gY29saWRpcikuIFRhYnMvcXVlYnJhcyBubyB0ZXh0byBzXHUwMEUzbyBuZXV0cmFsaXphZG9zLlxuZnVuY3Rpb24gZXNjYXBlR2FtZUZpZWxkKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1tcXHJcXG5cXHRdKy9nLCBcIiBcIik7XG59XG5mdW5jdGlvbiBzZXJpYWxpemVHYW1lRXZlbnQoZTogR2FtZUV2ZW50KTogc3RyaW5nIHtcbiAgY29uc3QgbGFiZWxzID0gZS5sYWJlbHMubWFwKGwgPT4gZXNjYXBlR2FtZUZpZWxkKGwpLnJlcGxhY2UoLywvZywgXCIgXCIpKS5qb2luKFwiLFwiKTtcbiAgcmV0dXJuIFtlLmRhdGUsIGUudHlwZSwgU3RyaW5nKGUueHApLCBlLmtleSwgZXNjYXBlR2FtZUZpZWxkKGUuY29udGVudCksIGVzY2FwZUdhbWVGaWVsZChlLnByb2plY3QpLCBsYWJlbHNdLmpvaW4oXCJcXHRcIik7XG59XG5mdW5jdGlvbiBwYXJzZUdhbWVFdmVudExpbmUobGluZTogc3RyaW5nKTogR2FtZUV2ZW50IHwgbnVsbCB7XG4gIGNvbnN0IHAgPSBsaW5lLnNwbGl0KFwiXFx0XCIpLm1hcChzID0+IHMudHJpbSgpKTtcbiAgaWYgKHAubGVuZ3RoIDwgNCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IFtkYXRlLCB0eXBlLCB4cFJhdywga2V5LCBjb250ZW50ID0gXCJcIiwgcHJvamVjdCA9IFwiXCIsIGxhYmVsc1JhdyA9IFwiXCJdID0gcDtcbiAgaWYgKCEvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChkYXRlKSkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlICE9PSBcImZlaXRvXCIgJiYgdHlwZSAhPT0gXCJuYW8tZmVpdG9cIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHhwID0gTnVtYmVyKHhwUmF3KTtcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoeHApIHx8ICFrZXkpIHJldHVybiBudWxsO1xuICBjb25zdCBsYWJlbHMgPSBsYWJlbHNSYXcgPyBsYWJlbHNSYXcuc3BsaXQoXCIsXCIpLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXTtcbiAgcmV0dXJuIHsgZGF0ZSwgdHlwZSwgeHAsIGtleSwgY29udGVudCwgcHJvamVjdCwgbGFiZWxzIH07XG59XG4vLyBFeHRyYWkgb3MgZXZlbnRvcyBkbyBibG9jbyBjZXJjYWRvIGBgYHdkLWdhbWUtbG9nIFx1MjAyNiBgYGAgZGEgbm90YS5cbmZ1bmN0aW9uIHBhcnNlR2FtZUxvZyhjb250ZW50OiBzdHJpbmcpOiBHYW1lRXZlbnRbXSB7XG4gIGNvbnN0IG0gPSBjb250ZW50Lm1hdGNoKG5ldyBSZWdFeHAoXCJgYGBcIiArIEdBTUVfTE9HX0ZFTkNFICsgXCJcXFxccj9cXFxcbihbXFxcXHNcXFxcU10qPylgYGBcIikpO1xuICBpZiAoIW0pIHJldHVybiBbXTtcbiAgY29uc3Qgb3V0OiBHYW1lRXZlbnRbXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiBtWzFdLnNwbGl0KFwiXFxuXCIpKSB7XG4gICAgY29uc3QgZXYgPSBwYXJzZUdhbWVFdmVudExpbmUocmF3LnRyaW0oKSk7XG4gICAgaWYgKGV2KSBvdXQucHVzaChldik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbi8vIENvbnRlXHUwMEZBZG8gY29tcGxldG8gZGEgbm90YSAoZGV0ZXJtaW5cdTAwRURzdGljbzogZXZlbnRvcyBvcmRlbmFkb3MgXHUyMTkyIG1lc21vcyBldmVudG9zID1cbi8vIG1lc21vIGFycXVpdm8gZW0gcXVhbHF1ZXIgZGlzcG9zaXRpdm8sIGV2aXRhbmRvIGNvbmZsaXRvIGRlIFN5bmN0aGluZykuXG5mdW5jdGlvbiBidWlsZEdhbWVMb2dDb250ZW50KGV2ZW50czogR2FtZUV2ZW50W10pOiBzdHJpbmcge1xuICBjb25zdCBzb3J0ZWQgPSBbLi4uZXZlbnRzXS5zb3J0KChhLCBiKSA9PlxuICAgIGEuZGF0ZSA8IGIuZGF0ZSA/IC0xIDogYS5kYXRlID4gYi5kYXRlID8gMSA6IGEua2V5IDwgYi5rZXkgPyAtMSA6IGEua2V5ID4gYi5rZXkgPyAxIDogMCk7XG4gIHJldHVybiBbXG4gICAgXCItLS1cIiwgXCJvd25lcjogV2VydXNcIiwgXCJwZXJtaXNzaW9uczpcIiwgXCIgIHJlYWQ6IFthbGxdXCIsIFwiICB3cml0ZTpcIiwgXCIgICAgLSBXZXJ1c1wiLCBcIiAgICAtIENsYXVkZVwiLFxuICAgIFwicmV2aWV3ZWQ6IGZhbHNlXCIsIFwidHlwZTogcmVmZXJlbmNlXCIsIFwidGFnczogW2dhbWlmaWNhY2FvXVwiLCBcIi0tLVwiLCBcIlwiLFxuICAgIFwiIyBHYW1pZmljYVx1MDBFN1x1MDBFM28gXHUyMDE0IExvZyBkZSBYUFwiLCBcIlwiLFxuICAgIFwiPiBBcnF1aXZvICoqZ2VyaWRvIHBlbG8gcGx1Z2luIFdlcnVzIERhc2hib2FyZCoqLiBDYWRhIGxpbmhhIGRvIGJsb2NvIGFiYWl4byBcdTAwRTkgdW0gZXZlbnRvXCIsXG4gICAgXCI+ICh0YXJlZmEgZmVpdGEgPSBYUCBwb3NpdGl2bywgblx1MDBFM28gZmVpdGEgPSBYUCBuZWdhdGl2bykuIE5cdTAwRTNvIGVkaXRlIFx1MDBFMCBtXHUwMEUzbyBcdTIwMTQgbyBwYWluZWwgZG9cIixcbiAgICBcIj4gcGx1Z2luIG1vc3RyYSBuXHUwMEVEdmVsLCBzdHJlYWsgZSBlc3RhdFx1MDBFRHN0aWNhcyBhIHBhcnRpciBkYXF1aS5cIiwgXCJcIixcbiAgICBcImBgYFwiICsgR0FNRV9MT0dfRkVOQ0UsXG4gICAgc29ydGVkLm1hcChzZXJpYWxpemVHYW1lRXZlbnQpLmpvaW4oXCJcXG5cIiksXG4gICAgXCJgYGBcIiwgXCJcIixcbiAgXS5qb2luKFwiXFxuXCIpO1xufVxuXG4vLyBTdHJlYWsgYXR1YWwgKGF0XHUwMEU5IGhvamUvb250ZW0pICsgcmVjb3JkZSwgYSBwYXJ0aXIgZG9zIGRpYXMgY29tIFx1MjI2NTEgXCJmZWl0b1wiLlxuZnVuY3Rpb24gY29tcHV0ZVN0cmVhayhkb25lRGF5czogU2V0PHN0cmluZz4pOiB7IHN0cmVha0N1cnJlbnQ6IG51bWJlcjsgc3RyZWFrQmVzdDogbnVtYmVyIH0ge1xuICBpZiAoIWRvbmVEYXlzLnNpemUpIHJldHVybiB7IHN0cmVha0N1cnJlbnQ6IDAsIHN0cmVha0Jlc3Q6IDAgfTtcbiAgY29uc3QgZGF5TXMgPSA4NjQwMDAwMDtcbiAgY29uc3Qgc29ydGVkID0gWy4uLmRvbmVEYXlzXS5zb3J0KCk7XG4gIGxldCBiZXN0ID0gMSwgcnVuID0gMTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoRGF0ZS5wYXJzZShzb3J0ZWRbaV0gKyBcIlQwMDowMDowMFwiKSAtIERhdGUucGFyc2Uoc29ydGVkW2kgLSAxXSArIFwiVDAwOjAwOjAwXCIpID09PSBkYXlNcykge1xuICAgICAgcnVuKys7IGJlc3QgPSBNYXRoLm1heChiZXN0LCBydW4pO1xuICAgIH0gZWxzZSBydW4gPSAxO1xuICB9XG4gIGxldCBjdXIgPSAwO1xuICBsZXQgY3Vyc29yID0gbmV3IERhdGUoKTsgY3Vyc29yLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICBpZiAoIWRvbmVEYXlzLmhhcyh0b0tleShjdXJzb3IpKSkgY3Vyc29yID0gbmV3IERhdGUoY3Vyc29yLmdldFRpbWUoKSAtIGRheU1zKTtcbiAgd2hpbGUgKGRvbmVEYXlzLmhhcyh0b0tleShjdXJzb3IpKSkgeyBjdXIrKzsgY3Vyc29yID0gbmV3IERhdGUoY3Vyc29yLmdldFRpbWUoKSAtIGRheU1zKTsgfVxuICByZXR1cm4geyBzdHJlYWtDdXJyZW50OiBjdXIsIHN0cmVha0Jlc3Q6IE1hdGgubWF4KGJlc3QsIGN1cikgfTtcbn1cblxuLy8gRXN0YXRcdTAwRURzdGljYXMgYSBwYXJ0aXIgZG9zIGV2ZW50b3MgZG8gbG9nIChmb250ZSBjYW5cdTAwRjRuaWNhKS5cbmZ1bmN0aW9uIGNvbXB1dGVHYW1lU3RhdHMoZXZlbnRzOiBHYW1lRXZlbnRbXSk6IEdhbWVTdGF0cyB7XG4gIGNvbnN0IGJ5RGF5ID0gbmV3IE1hcDxzdHJpbmcsIHsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlciB9PigpO1xuICBjb25zdCBieVByb2plY3QgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBjb25zdCBieUxhYmVsID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgbGV0IHRvdGFsWHAgPSAwO1xuICBmb3IgKGNvbnN0IGUgb2YgZXZlbnRzKSB7XG4gICAgdG90YWxYcCArPSBlLnhwO1xuICAgIGNvbnN0IGQgPSBieURheS5nZXQoZS5kYXRlKSA/PyB7IHhwOiAwLCBjb3VudDogMCB9O1xuICAgIGQueHAgKz0gZS54cDtcbiAgICBpZiAoZS50eXBlID09PSBcImZlaXRvXCIpIGQuY291bnQgKz0gMTtcbiAgICBieURheS5zZXQoZS5kYXRlLCBkKTtcbiAgICBpZiAoZS50eXBlID09PSBcImZlaXRvXCIpIHtcbiAgICAgIGNvbnN0IHByb2ogPSBlLnByb2plY3QgfHwgXCJcdTIwMTRcIjtcbiAgICAgIGJ5UHJvamVjdC5zZXQocHJvaiwgKGJ5UHJvamVjdC5nZXQocHJvaikgPz8gMCkgKyBlLnhwKTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBlLmxhYmVscykgYnlMYWJlbC5zZXQobCwgKGJ5TGFiZWwuZ2V0KGwpID8/IDApICsgZS54cCk7XG4gICAgfVxuICB9XG4gIGlmICh0b3RhbFhwIDwgMCkgdG90YWxYcCA9IDA7XG4gIGNvbnN0IGxldmVsID0gZ2FtZUxldmVsKHRvdGFsWHApO1xuICBjb25zdCBkb25lRGF5cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGUgb2YgZXZlbnRzKSBpZiAoZS50eXBlID09PSBcImZlaXRvXCIpIGRvbmVEYXlzLmFkZChlLmRhdGUpO1xuICBjb25zdCB7IHN0cmVha0N1cnJlbnQsIHN0cmVha0Jlc3QgfSA9IGNvbXB1dGVTdHJlYWsoZG9uZURheXMpO1xuICBjb25zdCB0b2RheSA9IGJ5RGF5LmdldCh0b0tleShuZXcgRGF0ZSgpKSkgPz8geyB4cDogMCwgY291bnQ6IDAgfTtcbiAgcmV0dXJuIHtcbiAgICB0b3RhbFhwLCBsZXZlbCxcbiAgICB4cEludG9MZXZlbDogdG90YWxYcCAtIDEwMCAqIGxldmVsICogbGV2ZWwsXG4gICAgeHBGb3JOZXh0OiAxMDAgKiAoMiAqIGxldmVsICsgMSksXG4gICAgc3RyZWFrQ3VycmVudCwgc3RyZWFrQmVzdCxcbiAgICB0b2RheVhwOiB0b2RheS54cCwgdG9kYXlDb3VudDogdG9kYXkuY291bnQsXG4gICAgYnlEYXksIGJ5UHJvamVjdCwgYnlMYWJlbCxcbiAgfTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG4vLyAobWQvaW1nIGRhIHN1Ylx1MDBFMXJ2b3JlIHZcdTAwRUFtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlLilcbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG4vLyBBZ3JlZ2FkbyBkZSB1cmdcdTAwRUFuY2lhIGRlIHVtYSBzdWJcdTAwRTFydm9yZSAodmVtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlKS5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFVNQSBwYXNzYWRhIChERlMpIG1vbnRhIG9zIGFncmVnYWRvcyBwb3IgcGFzdGEgKHN1Ylx1MDBFMXJ2b3JlKSArIG9zIGdsb2JhaXMgcXVlXG4vLyB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIGNvbnNvbWVtIFx1MjAxNCBhbnRlcyBjYWRhIHNlXHUwMEU3XHUwMEUzbyB2YXJyaWEgbyBjb2ZyZSBwb3IgY29udGEgcHJcdTAwRjNwcmlhXG4vLyAofjhcdTIwMTMxMFx1MDBENyBwb3IgcmVuZGVyKS4gSW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdCBlIHJlY3JpYWRvIHNvYiBkZW1hbmRhLlxuaW50ZXJmYWNlIEZvbGRlckFnZyB7XG4gIG1kOiBudW1iZXI7ICAgICAgICAgIC8vIG5vdGFzIC5tZCAoZXhjZXRvIHN0YXR1cy5tZCkgbmEgc3ViXHUwMEUxcnZvcmVcbiAgaW1nOiBudW1iZXI7ICAgICAgICAgLy8gaW1hZ2VucyBuYSBzdWJcdTAwRTFydm9yZVxuICByZXZpZXdlZDogbnVtYmVyOyAgICAvLyAubWQgY29tIHJldmlld2VkOnRydWUgbmEgc3ViXHUwMEUxcnZvcmVcbiAgdXJnZW5jeTogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyAgIC8vIG5vdGFzIGNvbSB1cmdlbmN5IChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYylcbiAgdXJnZW5jeU1heDogVXJnZW5jeSB8IG51bGw7XG4gIHJlY2VudDogVEZpbGVbXTsgICAgIC8vIGF0XHUwMEU5IDQgbm90YXMgLm1kIG1haXMgcmVjZW50ZXMgKG10aW1lKSBkYSBzdWJcdTAwRTFydm9yZVxufVxuaW50ZXJmYWNlIFZhdWx0Q2FjaGUge1xuICBieUZvbGRlcjogTWFwPHN0cmluZywgRm9sZGVyQWdnPjsgICAgICAgICAgICAgIC8vIHBhdGggZGEgcGFzdGEgXHUyMTkyIGFncmVnYWRvc1xuICBkYXRlZE5vdGVzOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdOyAgIC8vIG5vdGFzIGNvbSBkYXRhIChmcm9udG1hdHRlciBkYXRlOiBvdSBub21lIEFBQUEtTU0tREQpXG4gIGN0aW1lQnlEYXk6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAgICAgICAgICAgLy8gQUFBQS1NTS1ERCBcdTIxOTIgblx1MDBCQSBkZSBub3RhcyBjcmlhZGFzIChjdGltZSlcbiAgdG90YWxOb3RlczogbnVtYmVyO1xuICB0b3RhbFJldmlld2VkOiBudW1iZXI7XG59XG5jb25zdCBFTVBUWV9BR0c6IEZvbGRlckFnZyA9IHsgbWQ6IDAsIGltZzogMCwgcmV2aWV3ZWQ6IDAsIHVyZ2VuY3k6IFtdLCB1cmdlbmN5TWF4OiBudWxsLCByZWNlbnQ6IFtdIH07XG5cbmZ1bmN0aW9uIGJ1aWxkVmF1bHRDYWNoZShhcHA6IEFwcCk6IFZhdWx0Q2FjaGUge1xuICBjb25zdCBieUZvbGRlciA9IG5ldyBNYXA8c3RyaW5nLCBGb2xkZXJBZ2c+KCk7XG4gIGNvbnN0IGRhdGVkTm90ZXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgY29uc3QgY3RpbWVCeURheSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDA7XG5cbiAgY29uc3Qgd2FsayA9IChmb2xkZXI6IFRGb2xkZXIpOiBGb2xkZXJBZ2cgPT4ge1xuICAgIGNvbnN0IGFnZzogRm9sZGVyQWdnID0geyBtZDogMCwgaW1nOiAwLCByZXZpZXdlZDogMCwgdXJnZW5jeTogW10sIHVyZ2VuY3lNYXg6IG51bGwsIHJlY2VudDogW10gfTtcbiAgICBjb25zdCByZWNlbnQ6IFRGaWxlW10gPSBbXTsgICAvLyBjYW5kaWRhdG9zOiBhcnF1aXZvcyBwclx1MDBGM3ByaW9zICsgdG9wLTQgZGUgY2FkYSBmaWxob1xuICAgIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICBjb25zdCBzdWIgPSB3YWxrKGMpO1xuICAgICAgICBhZ2cubWQgKz0gc3ViLm1kOyBhZ2cuaW1nICs9IHN1Yi5pbWc7IGFnZy5yZXZpZXdlZCArPSBzdWIucmV2aWV3ZWQ7XG4gICAgICAgIGlmIChzdWIudXJnZW5jeS5sZW5ndGgpIGFnZy51cmdlbmN5LnB1c2goLi4uc3ViLnVyZ2VuY3kpO1xuICAgICAgICBpZiAoc3ViLnJlY2VudC5sZW5ndGgpIHJlY2VudC5wdXNoKC4uLnN1Yi5yZWNlbnQpO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgICAgYWdnLm1kKys7XG4gICAgICAgICAgcmVjZW50LnB1c2goYyk7XG4gICAgICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgICAgIGNvbnN0IGZtID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgaWYgKGZtPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgeyBhZ2cucmV2aWV3ZWQrKzsgdG90YWxSZXZpZXdlZCsrOyB9XG4gICAgICAgICAgY29uc3QgdSA9IGZtPy51cmdlbmN5O1xuICAgICAgICAgIGlmICh1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiKSBhZ2cudXJnZW5jeS5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICAgICAgY29uc3QgY2sgPSB0b0tleShuZXcgRGF0ZShjLnN0YXQuY3RpbWUpKTtcbiAgICAgICAgICBjdGltZUJ5RGF5LnNldChjaywgKGN0aW1lQnlEYXkuZ2V0KGNrKSA/PyAwKSArIDEpO1xuICAgICAgICAgIGNvbnN0IG0gPSBjLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKGZtPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgICAgICBpZiAoZCkgZGF0ZWROb3Rlcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGFnZy5pbWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWNlbnQuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgICBhZ2cucmVjZW50ID0gcmVjZW50LnNsaWNlKDAsIDQpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgYWdnLnVyZ2VuY3kpXG4gICAgICBpZiAoIWFnZy51cmdlbmN5TWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbYWdnLnVyZ2VuY3lNYXhdKSBhZ2cudXJnZW5jeU1heCA9IGl0LmxldmVsO1xuICAgIGFnZy51cmdlbmN5LnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gICAgYnlGb2xkZXIuc2V0KGZvbGRlci5wYXRoLCBhZ2cpO1xuICAgIHJldHVybiBhZ2c7XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiB7IGJ5Rm9sZGVyLCBkYXRlZE5vdGVzLCBjdGltZUJ5RGF5LCB0b3RhbE5vdGVzLCB0b3RhbFJldmlld2VkIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBcdTI1MDBcdTI1MDAgQ29udHJvbGFkb3IgZG8gVG9kb2lzdCAoY29tcGFydGlsaGFkbzogZGFzaGJvYXJkICsgYWJhIGRlZGljYWRhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERldFx1MDBFOW0gbyBlc3RhZG8gZGFzIHRhcmVmYXMsIGEgYnVzY2EsIGEgcmVuZGVyaXphXHUwMEU3XHUwMEUzbyBkYSBsaXN0YSBlIGFzIGFcdTAwRTdcdTAwRjVlc1xuLy8gKGNyaWFyL2VkaXRhci9jb25jbHVpci9leGNsdWlyKS4gYHJlcmVuZGVyYCBcdTAwRTkgbyBjYWxsYmFjayBkYSB2aWV3IGRvbmEgKHJlLXJlbmRlclxuLy8gY29tcGxldG8pLiBUZW0gdG9vbHRpcCBwclx1MDBGM3ByaW8gcGFyYSBuXHUwMEUzbyBkZXBlbmRlciBkYSB2aWV3LlxuY2xhc3MgVG9kb2lzdENvbnRyb2xsZXIge1xuICBwcml2YXRlIHRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIGxhYmVsQ29sb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSBsb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgbGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgbm9EYXRlT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge1xuICAgIHRoaXMubG9hZENhY2hlKCk7ICAgLy8gbW9zdHJhIG8gXHUwMEZBbHRpbW8gcmVzdWx0YWRvIG5hIGhvcmEgKG9mZmxpbmUpLCBhbnRlcyBkbyAxXHUwMEJBIGZldGNoXG4gIH1cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgLy8gTm9tZSBkbyBwcm9qZXRvIHBlbG8gaWQgKHJldXNhZG8gcGVsYSBHYW1pZmljYVx1MDBFN1x1MDBFM28pLiBWYXppbyBzZSBkZXNjb25oZWNpZG8uXG4gIHByb2plY3ROYW1lKGlkPzogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIChpZCAmJiB0aGlzLnByb2plY3RNYXAuZ2V0KGlkKSkgfHwgXCJcIjsgfVxuXG4gIHByaXZhdGUgZGF5UmFuZ2UoKTogMyB8IDcge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPT09IDMgPyAzIDogNztcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlGaWx0ZXJzKHRhc2tzOiBUb2RvaXN0VGFza1tdKTogVG9kb2lzdFRhc2tbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIGlmICghZi5wcm9qZWN0cy5sZW5ndGggJiYgIWYubGFiZWxzLmxlbmd0aCkgcmV0dXJuIHRhc2tzO1xuICAgIGNvbnN0IHBzID0gbmV3IFNldChmLnByb2plY3RzKSwgbHMgPSBuZXcgU2V0KGYubGFiZWxzKTtcbiAgICByZXR1cm4gdGFza3MuZmlsdGVyKHQgPT4ge1xuICAgICAgaWYgKHBzLnNpemUgJiYgISh0LnByb2plY3RfaWQgJiYgcHMuaGFzKHQucHJvamVjdF9pZCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAobHMuc2l6ZSAmJiAhKHQubGFiZWxzID8/IFtdKS5zb21lKGwgPT4gbHMuaGFzKGwpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUZpbHRlcihraW5kOiBcInByb2plY3RzXCIgfCBcImxhYmVsc1wiLCBpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnNba2luZF07XG4gICAgY29uc3QgaSA9IGFyci5pbmRleE9mKGlkKTtcbiAgICBpZiAoaSA+PSAwKSBhcnIuc3BsaWNlKGksIDEpOyBlbHNlIGFyci5wdXNoKGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgbGFiZWxDb2xvcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxhYmVsQ29sb3JzLmdldChuYW1lKSA/PyBMQUJFTF9GQUxMQkFDSztcbiAgfVxuXG4gIHByaXZhdGUgbGFiZWxDaGlwKGhvc3Q6IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGNsczogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGNoaXAgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHMgfSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmxhYmVsQ29sb3IobmFtZSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke25hbWV9YCB9KTtcbiAgICByZXR1cm4gY2hpcDtcbiAgfVxuXG4gIHByaXZhdGUgcG9zaXRpb25UaXAodGlwOiBIVE1MRWxlbWVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdHcgPSB0aXAub2Zmc2V0V2lkdGgsIHRoID0gdGlwLm9mZnNldEhlaWdodDtcbiAgICBsZXQgbGVmdCA9IHJlY3QubGVmdDtcbiAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyA2O1xuICAgIGlmIChsZWZ0ICsgdHcgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHR3IC0gODtcbiAgICBpZiAodG9wICsgdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSB0b3AgPSByZWN0LnRvcCAtIHRoIC0gNjtcbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93VGFza1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdGFzay10aXBcIiB9KTtcbiAgICBjb25zdCBoZWFkID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXByaVwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmlNZXRhKHQucHJpb3JpdHkpLmNvbG9yO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC10aXRsZVwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGQgPSB0LmRlc2NyaXB0aW9uIS50cmltKCk7XG4gICAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWRlc2NcIiwgdGV4dDogZC5sZW5ndGggPiBERVNDX01BWCA/IGQuc2xpY2UoMCwgREVTQ19NQVgpICsgXCJcdTIwMjZcIiA6IGQgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hUYXNrVGlwKGVsOiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUYXNrVGlwKGVsLCB0KSk7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2RvQ2hlY2soaG9zdDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgY2hlY2sgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1jaGVja1wiIH0pO1xuICAgIGNoZWNrLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbmNsdWlyIHRhcmVmYVwiKTtcbiAgICBjbGlja2FibGUoY2hlY2ssIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuY29tcGxldGVUYXNrKHQpOyB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9kb1JvdyhsaXN0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2ssIHNob3dEYXRlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yb3dcIiB9KTtcbiAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBwcmkuY29sb3IpO1xuICAgIHRoaXMudG9kb0NoZWNrKHJvdywgdCk7XG4gICAgY29uc3QgdGFnID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pO1xuICAgIHRhZy5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LXR4dFwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHNldEljb24ocm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1oYXNkZXNjXCIgfSksIFwiYWxpZ24tbGVmdFwiKTtcbiAgICBjb25zdCBwcm9qID0gdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkKSB7XG4gICAgICBjb25zdCB4ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby11bmRvbmVcIiB9KTtcbiAgICAgIHNldEljb24oeCwgXCJ4XCIpO1xuICAgICAgeC5zZXRBdHRyKFwidGl0bGVcIiwgXCJOXHUwMEUzbyBmZWl0YSBcdTIwMTQgcHVuaVx1MDBFN1x1MDBFM28gZGUgWFAgZSBhcGFnYSBkbyBUb2RvaXN0XCIpO1xuICAgICAgY2xpY2thYmxlKHgsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMucGx1Z2luLmdhbWUubWFya1VuZG9uZSh0KTsgfSk7XG4gICAgfVxuICAgIGNsaWNrYWJsZShyb3csICgpID0+IHRoaXMub3BlblRhc2tEZXRhaWwodCkpO1xuICAgIHRoaXMuYXR0YWNoVGFza1RpcChyb3csIHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUYXNrQnRuKGhvc3Q6IEhUTUxFbGVtZW50LCBwcmVmaWxsRHVlPzogc3RyaW5nLCB0aXRsZSA9IFwiTm92YSB0YXJlZmFcIikge1xuICAgIGNvbnN0IGIgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1hZGRcIiB9KTtcbiAgICBzZXRJY29uKGIsIFwicGx1c1wiKTtcbiAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgY2xpY2thYmxlKGIsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH0pO1xuICAgIHJldHVybiBiO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuVGFza0Zvcm0ob3B0czogeyBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7IHRhc2s/OiBUb2RvaXN0VGFzazsgcHJlZmlsbER1ZT86IHN0cmluZyB9KSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLnRoaXMubGFiZWxDb2xvcnMua2V5cygpLCAuLi50aGlzLnRhc2tzLmZsYXRNYXAodCA9PiB0LmxhYmVscyA/PyBbXSldKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBuZXcgVGFza0Zvcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgbW9kZTogb3B0cy5tb2RlLFxuICAgICAgdGFzazogb3B0cy50YXNrLFxuICAgICAgcHJlZmlsbER1ZTogb3B0cy5wcmVmaWxsRHVlLFxuICAgICAgcHJvamVjdHM6IHRoaXMucHJvamVjdHMsXG4gICAgICBsYWJlbHMsXG4gICAgICBsYWJlbENvbG9yOiBuID0+IHRoaXMubGFiZWxDb2xvcihuKSxcbiAgICAgIHN1Ym1pdDogdiA9PiB0aGlzLnN1Ym1pdFRhc2tGb3JtKG9wdHMubW9kZSwgb3B0cy50YXNrLCB2KSxcbiAgICAgIHJlbW92ZTogb3B0cy50YXNrID8gKCkgPT4gdGhpcy5kZWxldGVUYXNrKG9wdHMudGFzayEpIDogdW5kZWZpbmVkLFxuICAgICAgY29tcGxldGU6IG9wdHMudGFzayA/ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuVGFza0RldGFpbCh0OiBUb2RvaXN0VGFzaykge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIG5ldyBUYXNrRGV0YWlsTW9kYWwodGhpcy5hcHAsIHRoaXMuY29tcG9uZW50LCB7XG4gICAgICB0YXNrOiB0LFxuICAgICAgcHJvamVjdE5hbWU6IHQucHJvamVjdF9pZCA/IHRoaXMucHJvamVjdE1hcC5nZXQodC5wcm9qZWN0X2lkKSA6IHVuZGVmaW5lZCxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgZWRpdDogKCkgPT4gdGhpcy5vcGVuVGFza0Zvcm0oeyBtb2RlOiBcImVkaXRcIiwgdGFzazogdCB9KSxcbiAgICAgIGNvbXBsZXRlOiAoKSA9PiB2b2lkIHRoaXMuY29tcGxldGVUYXNrKHQpLFxuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc3VibWl0VGFza0Zvcm0obW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiLCB0YXNrOiBUb2RvaXN0VGFzayB8IHVuZGVmaW5lZCwgdjogVGFza0Zvcm1WYWx1ZXMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAobW9kZSA9PT0gXCJjcmVhdGVcIikge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdi5jb250ZW50LCBwcmlvcml0eTogdi5wcmlvcml0eSB9O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbi50cmltKCkpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb24udHJpbSgpO1xuICAgICAgICBpZiAodi5kdWVEYXRlKSBmaWVsZHMuZHVlX2RhdGUgPSB2LmR1ZURhdGU7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCkgZmllbGRzLnByb2plY3RfaWQgPSB2LnByb2plY3RJZDtcbiAgICAgICAgaWYgKHYubGFiZWxzLmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBhd2FpdCBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbiwgZmllbGRzKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIENyaWFkYTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKHRhc2spIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7fTtcbiAgICAgICAgaWYgKHYuY29udGVudCAhPT0gdGFzay5jb250ZW50KSBmaWVsZHMuY29udGVudCA9IHYuY29udGVudDtcbiAgICAgICAgaWYgKHYuZGVzY3JpcHRpb24gIT09ICh0YXNrLmRlc2NyaXB0aW9uID8/IFwiXCIpKSBmaWVsZHMuZGVzY3JpcHRpb24gPSB2LmRlc2NyaXB0aW9uO1xuICAgICAgICBpZiAodi5wcmlvcml0eSAhPT0gdGFzay5wcmlvcml0eSkgZmllbGRzLnByaW9yaXR5ID0gdi5wcmlvcml0eTtcbiAgICAgICAgY29uc3Qgb2xkRGF0ZSA9IHRhc2suZHVlPy5kYXRlID8gdGFzay5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogXCJcIjtcbiAgICAgICAgaWYgKHYuZHVlRGF0ZSAhPT0gb2xkRGF0ZSkge1xuICAgICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgICBlbHNlIGZpZWxkcy5kdWVfc3RyaW5nID0gXCJubyBkYXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2xkTCA9ICh0YXNrLmxhYmVscyA/PyBbXSkuc2xpY2UoKS5zb3J0KCkuam9pbihcIiBcIik7XG4gICAgICAgIGNvbnN0IG5ld0wgPSB2LmxhYmVscy5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgaWYgKG9sZEwgIT09IG5ld0wpIGZpZWxkcy5sYWJlbHMgPSB2LmxhYmVscztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGZpZWxkcykubGVuZ3RoKSBhd2FpdCB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbiwgdGFzay5pZCwgZmllbGRzKTtcbiAgICAgICAgY29uc3Qgb2xkUHJvaiA9IHRhc2sucHJvamVjdF9pZCA/PyBcIlwiO1xuICAgICAgICBpZiAodi5wcm9qZWN0SWQgIT09IG9sZFByb2ogJiYgdi5wcm9qZWN0SWQpIGF3YWl0IG1vdmVUb2RvaXN0VGFzayh0b2tlbiwgdGFzay5pZCwgdi5wcm9qZWN0SWQpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgU2FsdmE6ICR7di5jb250ZW50fWApO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5mZXRjaCh0cnVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIHNhbHZhcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBkZWxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIHRoaXMucGVyc2lzdENhY2hlKCk7XG4gICAgICBuZXcgTm90aWNlKGBcdUQ4M0RcdURERDEgRXhjbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBleGNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbXBsZXRlVGFzayh0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gdGhpcy50YXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjbG9zZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIHRoaXMucGVyc2lzdENhY2hlKCk7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ29uY2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGNvbmNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzU3RhbGUoKTogYm9vbGVhbiB7IHJldHVybiBEYXRlLm5vdygpIC0gdGhpcy5mZXRjaGVkQXQgPj0gVE9ET19UVEw7IH1cblxuICAvLyBBdXRvLXJlZnJlc2ggcGVyaVx1MDBGM2RpY28gKGludGVydmFsbyBubyBvbmxvYWQpOiBzXHUwMEYzIGJ1c2NhIHNlIGhcdTAwRTEgdmlldyBhYmVydGEsIHRva2VuXG4gIC8vIGNvbmZpZ3VyYWRvLCBuYWRhIGVtIHZvbyBlIG8gY2FjaGUgcGFzc291IGRvIFRUTC4gU2VtIHZpZXcgYWJlcnRhID0gc2VtIGNoYW1hZGEgXHUwMEUwIEFQSS5cbiAgbWF5YmVSZWZyZXNoKCkge1xuICAgIGlmICghdGhpcy5zdWJzLnNpemUgfHwgdGhpcy5sb2FkaW5nKSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpKSByZXR1cm47XG4gICAgaWYgKHRoaXMuaXNTdGFsZSgpKSB2b2lkIHRoaXMuZmV0Y2goZmFsc2UpO1xuICB9XG5cbiAgLy8gQ2FjaGUgb2ZmbGluZSAocG9yLWRpc3Bvc2l0aXZvLCBsb2NhbFN0b3JhZ2UgXHUyMTkyIG5cdTAwRTNvIHNpbmNyb25pemEpOiBjYXJyZWdhIG8gXHUwMEZBbHRpbW9cbiAgLy8gcmVzdWx0YWRvIHBhcmEgYSBhYmEgYWJyaXIgalx1MDBFMSBjb20gYXMgdGFyZWZhcywgbWVzbW8gc2VtIGludGVybmV0LlxuICBwcml2YXRlIGxvYWRDYWNoZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gdGhpcy5hcHAubG9hZExvY2FsU3RvcmFnZShMU19UT0RPX0NBQ0hFKTtcbiAgICAgIGNvbnN0IGMgPSB0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyYXcpIDogcmF3O1xuICAgICAgaWYgKCFjIHx8ICFBcnJheS5pc0FycmF5KGMudGFza3MpKSByZXR1cm47XG4gICAgICB0aGlzLnRhc2tzID0gYy50YXNrcztcbiAgICAgIHRoaXMucHJvamVjdHMgPSBBcnJheS5pc0FycmF5KGMucHJvamVjdHMpID8gYy5wcm9qZWN0cyA6IFtdO1xuICAgICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcCh0aGlzLnByb2plY3RzLm1hcCgocDogVG9kb2lzdFByb2plY3QpID0+IFtwLmlkLCBwLm5hbWVdKSk7XG4gICAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcChBcnJheS5pc0FycmF5KGMubGFiZWxzKSA/IGMubGFiZWxzIDogW10pO1xuICAgICAgdGhpcy5mZXRjaGVkQXQgPSB0eXBlb2YgYy5mZXRjaGVkQXQgPT09IFwibnVtYmVyXCIgPyBjLmZldGNoZWRBdCA6IDA7XG4gICAgfSBjYXRjaCB7IC8qIGNhY2hlIGF1c2VudGUvY29ycm9tcGlkbyBcdTIxOTIgaWdub3JhICovIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVyc2lzdENhY2hlKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1RPRE9fQ0FDSEUsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdGFza3M6IHRoaXMudGFza3MsIHByb2plY3RzOiB0aGlzLnByb2plY3RzLCBsYWJlbHM6IFsuLi50aGlzLmxhYmVsQ29sb3JzXSwgZmV0Y2hlZEF0OiB0aGlzLmZldGNoZWRBdCxcbiAgICAgIH0pKTtcbiAgICB9IGNhdGNoIHsgLyogc2VyaWFsaXphXHUwMEU3XHUwMEUzby9xdW90YSBcdTIxOTIgaWdub3JhICovIH1cbiAgfVxuXG4gIC8vIEF2aXNvIGRlIGZyZXNjb3Igbm8gdG9wbyBkYSBsaXN0YTogZHVyYW50ZSB1bWEgYnVzY2EsIG91IHF1YW5kbyBlc3RhbW9zXG4gIC8vIGV4aWJpbmRvIG8gY2FjaGUgcG9ycXVlIGEgXHUwMEZBbHRpbWEgYnVzY2EgZmFsaG91IChvZmZsaW5lKS5cbiAgcHJpdmF0ZSByZW5kZXJGcmVzaG5lc3MoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5sb2FkaW5nKSB7IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZnJlc2hcIiwgdGV4dDogXCJBdHVhbGl6YW5kb1x1MjAyNlwiIH0pOyByZXR1cm47IH1cbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgY29uc3Qgd2hlbiA9IHRoaXMuZmV0Y2hlZEF0ID8gcmVsVGltZShuZXcgRGF0ZSh0aGlzLmZldGNoZWRBdCkudG9JU09TdHJpbmcoKSkgOiBcIlx1MjAxNFwiO1xuICAgICAgaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mcmVzaCB3ZC10b2RvLWZyZXNoLXN0YWxlXCIsIHRleHQ6IGBTZW0gY29uZXhcdTAwRTNvIFx1MjAxNCBleGliaW5kbyBvIFx1MDBGQWx0aW1vIGNhcnJlZ2FkbyAoJHt3aGVufSlgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoKG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuIHx8IHRoaXMubG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBbdGFza3MsIHByb2plY3RzLCBsYWJlbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbiksXG4gICAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0UHJvamVjdFtdKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0TGFiZWxbXSksXG4gICAgICBdKTtcbiAgICAgIHRoaXMudGFza3MgPSB0YXNrcztcbiAgICAgIHRoaXMucHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAocHJvamVjdHMubWFwKHAgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKGxhYmVscy5tYXAobCA9PiBbbC5uYW1lLCBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDS10pKTtcbiAgICAgIHRoaXMuZmV0Y2hlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMucGVyc2lzdENhY2hlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5lcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTGFuXHUwMEU3YSB1bSBwYWNvdGU6IGNyaWEgY2FkYSB0YXJlZmEgbm8gVG9kb2lzdCBjb20gZGF0YSBkZSBob2plLiBTZXF1ZW5jaWFsXG4gIC8vIChldml0YSByYWphZGEgbmEgQVBJKS4gQXR1YWxpemEgYSBsaXN0YSBhbyBmaW5hbC5cbiAgYXN5bmMgbGF1bmNoUGFja2FnZShwa2c6IFRhc2tQYWNrYWdlKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QgbmFzIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzLlwiKTsgcmV0dXJuOyB9XG4gICAgLy8gUmVzb2x2ZSB0XHUwMEVEdHVsbyBsaW1wbyArIGV0aXF1ZXRhcyAocGFjb3RlICsgaW5saW5lIEBldGlxdWV0YSkgcG9yIHRhcmVmYS5cbiAgICBjb25zdCBpdGVtcyA9IHBrZy50YXNrcy5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pLm1hcChsaW5lID0+IHNwbGl0VGFza0xhYmVscyhsaW5lLCBwa2cubGFiZWxzID8/IFtdKSk7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHsgbmV3IE5vdGljZShcIlBhY290ZSBzZW0gdGFyZWZhcy5cIik7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmxhdW5jaGluZy5oYXMocGtnLmlkKSkgcmV0dXJuOyAgIC8vIGpcdTAwRTEgZXN0XHUwMEUxIGxhblx1MDBFN2FuZG8gXHUyMTkyIGlnbm9yYSBjbGlxdWUtZHVwbG9cblxuICAgIC8vIENvbmZpcm1hXHUwMEU3XHUwMEUzbyBjb25mb3JtZSBhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gKHNlbXByZSAvIHNcdTAwRjMgbXVpdGFzIC8gbnVuY2EpLlxuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybTtcbiAgICBjb25zdCBuZWVkQ29uZmlybSA9IG1vZGUgPT09IFwiYWx3YXlzXCIgfHwgKG1vZGUgPT09IFwibWFueVwiICYmIGl0ZW1zLmxlbmd0aCA+IExBVU5DSF9DT05GSVJNX01JTik7XG4gICAgaWYgKG5lZWRDb25maXJtKSB7XG4gICAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgICB0aXRsZTogYExhblx1MDBFN2FyIFx1MjAxQyR7cGtnLm5hbWUgfHwgXCJwYWNvdGVcIn1cdTIwMUQ/YCxcbiAgICAgICAgYm9keTogYElzc28gdmFpIGNyaWFyICR7aXRlbXMubGVuZ3RofSB0YXJlZmEocykgbm8gVG9kb2lzdCBjb20gZGF0YSBkZSBob2plOmAsXG4gICAgICAgIGl0ZW1zOiBpdGVtcy5tYXAoaXQgPT4gKHtcbiAgICAgICAgICB0ZXh0OiBpdC50aXRsZSxcbiAgICAgICAgICBsYWJlbHM6IGl0LmxhYmVscy5tYXAobiA9PiAoeyBuYW1lOiBuLCBjb2xvcjogdGhpcy5sYWJlbENvbG9yKG4pIH0pKSxcbiAgICAgICAgfSkpLFxuICAgICAgICBjdGE6IGBMYW5cdTAwRTdhciAke2l0ZW1zLmxlbmd0aH1gLFxuICAgICAgfSk7XG4gICAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXVuY2hpbmcuYWRkKHBrZy5pZCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpOyAgIC8vIG1vc3RyYSBvIGJvdFx1MDBFM28gY29tbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIlxuICAgIGNvbnN0IGR1ZSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGxldCBvayA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAoY29uc3QgeyB0aXRsZSwgbGFiZWxzIH0gb2YgaXRlbXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdGl0bGUsIGR1ZV9kYXRlOiBkdWUgfTtcbiAgICAgICAgICBpZiAocGtnLnByb2plY3RJZCkgZmllbGRzLnByb2plY3RfaWQgPSBwa2cucHJvamVjdElkO1xuICAgICAgICAgIGlmIChsYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gbGFiZWxzO1xuICAgICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICAgIG9rKys7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBuZXcgTm90aWNlKGBGYWxoYSBlbSBcIiR7dGl0bGV9XCI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubGF1bmNoaW5nLmRlbGV0ZShwa2cuaWQpO1xuICAgIH1cbiAgICBuZXcgTm90aWNlKGBcdTI3MTMgJHtva30vJHtpdGVtcy5sZW5ndGh9IHRhcmVmYShzKSBsYW5cdTAwRTdhZGEocykgXHUyMDE0ICR7cGtnLm5hbWUgfHwgXCJwYWNvdGVcIn1gKTtcbiAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpOyAgIC8vIHJlLXJlbmRlcml6YSAobGltcGEgbyBlc3RhZG8gXCJsYW5cdTAwRTdhbmRvXHUyMDI2XCIpXG4gIH1cblxuICAvLyBCYXJyYSBkZSBsYW5cdTAwRTdhZG9yZXMgZGUgcGFjb3Rlcy4gQ29tIGBoZWFkaW5nYCwgbW9udGEgYSBzZVx1MDBFN1x1MDBFM28gXCJQQUNPVEVTXCJcbiAgLy8gY29tcGxldGEgKGFiYSBkbyBUb2RvaXN0KTsgc2VtIGVsZSwgc1x1MDBGMyBhIGJhcnJhIGRlIGJvdFx1MDBGNWVzIChkYXNoYm9hcmQsIGVcbiAgLy8gc29tZSBxdWFuZG8gblx1MDBFM28gaFx1MDBFMSBwYWNvdGVzIHBhcmEgbWFudGVyIG8gcGFpbmVsIGVueHV0bykuXG4gIHJlbmRlclBhY2thZ2VzKGhvc3Q6IEhUTUxFbGVtZW50LCBvcHRzOiB7IGhlYWRpbmc/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHBrZ3MgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgbGV0IHRhcmdldCA9IGhvc3Q7XG4gICAgaWYgKG9wdHMuaGVhZGluZykge1xuICAgICAgY29uc3Qgc2VjID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlBBQ09URVNcIiB9KTtcbiAgICAgIGlmICghcGtncy5sZW5ndGgpIHtcbiAgICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNyaWUgcGFjb3RlcyBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIFx1MjE5MiBQYWNvdGVzIGRlIHRhcmVmYXMuXCIgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRhcmdldCA9IHNlYztcbiAgICB9IGVsc2UgaWYgKCFwa2dzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBjb25zdCBiYXIgPSB0YXJnZXQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1iYXJcIiB9KTtcbiAgICBmb3IgKGNvbnN0IHBrZyBvZiBwa2dzKSB7XG4gICAgICBjb25zdCB2YWxpZCA9IHBrZy50YXNrcy5maWx0ZXIocyA9PiBzLnRyaW0oKSkubGVuZ3RoO1xuICAgICAgY29uc3QgYnVzeSA9IHRoaXMubGF1bmNoaW5nLmhhcyhwa2cuaWQpO1xuICAgICAgY29uc3QgZGlzYWJsZWQgPSAhdG9rZW4gfHwgIXZhbGlkIHx8IGJ1c3k7XG4gICAgICBjb25zdCBidG4gPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1idG5cIiArIChkaXNhYmxlZCA/IFwiIHdkLXBrZy1kaXNhYmxlZFwiIDogXCJcIikgKyAoYnVzeSA/IFwiIHdkLXBrZy1idXN5XCIgOiBcIlwiKSB9KTtcbiAgICAgIGlmIChwa2cuaWNvbikgcmVuZGVySWNvbihidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvXCIgfSksIHBrZy5pY29uKTtcbiAgICAgIGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1uYW1lXCIsIHRleHQ6IHBrZy5uYW1lIHx8IFwiKHNlbSBub21lKVwiIH0pO1xuICAgICAgYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IGJ1c3kgPyBcIlx1MjAyNlwiIDogU3RyaW5nKHZhbGlkKSB9KTtcbiAgICAgIGJ0bi5zZXRBdHRyKFwidGl0bGVcIixcbiAgICAgICAgYnVzeSA/IFwiTGFuXHUwMEU3YW5kb1x1MjAyNlwiIDpcbiAgICAgICAgIXRva2VuID8gXCJDb25maWd1cmUgbyB0b2tlbiBkbyBUb2RvaXN0XCIgOlxuICAgICAgICAhdmFsaWQgPyBcIlBhY290ZSBzZW0gdGFyZWZhc1wiIDpcbiAgICAgICAgYExhblx1MDBFN2FyICR7dmFsaWR9IHRhcmVmYShzKSBubyBUb2RvaXN0IChob2plKWApO1xuICAgICAgaWYgKCFkaXNhYmxlZCkgY2xpY2thYmxlKGJ0biwgKCkgPT4gdm9pZCB0aGlzLmxhdW5jaFBhY2thZ2UocGtnKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJGaWx0ZXJCYXIoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgY29uc3QgYmFyID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1maWx0ZXJiYXJcIiB9KTtcbiAgICBpZiAodGhpcy5wcm9qZWN0cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGdycCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mZ3JvdXBcIiB9KTtcbiAgICAgIGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmxhYmVsXCIsIHRleHQ6IFwiUHJvamV0b3NcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLnByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5wcm9qZWN0cy5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogcC5uYW1lIH0pO1xuICAgICAgICBjaGlwLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG9uKSk7XG4gICAgICAgIGNsaWNrYWJsZShjaGlwLCBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlRmlsdGVyKFwicHJvamVjdHNcIiwgcC5pZCk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldCh0aGlzLnRhc2tzLmZsYXRNYXAodCA9PiB0LmxhYmVscyA/PyBbXSkpXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIGlmIChsYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIkV0aXF1ZXRhc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxhYmVscykge1xuICAgICAgICBjb25zdCBvbiA9IGYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICBjb25zdCBjaGlwID0gdGhpcy5sYWJlbENoaXAoZ3JwLCBsLCBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSk7XG4gICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgY2xpY2thYmxlKGNoaXAsIGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVGaWx0ZXIoXCJsYWJlbHNcIiwgbCk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZi5wcm9qZWN0cy5sZW5ndGggfHwgZi5sYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjbHIgPSBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjbGVhclwiLCB0ZXh0OiBcImxpbXBhciBmaWx0cm9zXCIgfSk7XG4gICAgICBjbGlja2FibGUoY2xyLCBhc3luYyAoKSA9PiB7IGYucHJvamVjdHMgPSBbXTsgZi5sYWJlbHMgPSBbXTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVuZGVyaXphIG9zIGNvbnRyb2xlcyBkZSBjYWJlXHUwMEU3YWxobyAoZW0gYGN0cmxzYCkgKyBhIGxpc3RhIGRlIHRhcmVmYXNcbiAgLy8gKGVtIGBib2R5YCkuIE8gaG9zdCBmb3JuZWNlIG8gclx1MDBGM3R1bG8gZGEgc2VcdTAwRTdcdTAwRTNvIGUgbyBsYXlvdXQgZG8gY2FiZVx1MDBFN2FsaG8uXG4gIHJlbmRlckxpc3QoYm9keTogSFRNTEVsZW1lbnQsIGN0cmxzOiBIVE1MRWxlbWVudCwgb3B0czogeyBzaG93TGF0ZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgICAgY29uc3Qgc2VnID0gY3RybHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tcmFuZ2VcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBbMywgN10gYXMgY29uc3QpIHtcbiAgICAgICAgY29uc3QgYiA9IHNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmFuZ2UtYnRuXCIgKyAocmFuZ2UgPT09IG4gPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IGAke259ZGAgfSk7XG4gICAgICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIGBNb3N0cmFyIG9zIHByXHUwMEYzeGltb3MgJHtufSBkaWFzYCk7XG4gICAgICAgIGIuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcocmFuZ2UgPT09IG4pKTtcbiAgICAgICAgY2xpY2thYmxlKGIsIGFzeW5jIGUgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gbjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgICAgY29uc3QgbkYgPSBmLnByb2plY3RzLmxlbmd0aCArIGYubGFiZWxzLmxlbmd0aDtcbiAgICAgIGNvbnN0IGZpbHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYnRuXCIgKyAodGhpcy5maWx0ZXJPcGVuID8gXCIgd2Qtb25cIiA6IFwiXCIpICsgKG5GID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24oZmlsdCwgXCJmaWx0ZXJcIik7XG4gICAgICBmaWx0LnNldEF0dHIoXCJ0aXRsZVwiLCBuRiA/IGBGaWx0cm9zIGF0aXZvcyAoJHtuRn0pIFx1MjAxNCBjbGlxdWUgcGFyYSBhanVzdGFyYCA6IFwiRmlsdHJhciBwb3IgcHJvamV0by9ldGlxdWV0YVwiKTtcbiAgICAgIGlmIChuRikgZmlsdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmlsdGN0XCIsIHRleHQ6IFN0cmluZyhuRikgfSk7XG4gICAgICBmaWx0LnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMuZmlsdGVyT3BlbikpO1xuICAgICAgY2xpY2thYmxlKGZpbHQsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmZpbHRlck9wZW4gPSAhdGhpcy5maWx0ZXJPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5sb2FkaW5nID8gXCIgd2Qtc3BpblwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHJlZnJlc2gsIFwicmVmcmVzaC1jd1wiKTtcbiAgICAgIHJlZnJlc2guc2V0QXR0cihcInRpdGxlXCIsIFwiQXR1YWxpemFyIHRhcmVmYXMgZG8gVG9kb2lzdFwiKTtcbiAgICAgIGNsaWNrYWJsZShyZWZyZXNoLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmZldGNoKHRydWUpOyB9KTtcbiAgICAgIHRoaXMuYWRkVGFza0J0bihjdHJscywgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIH1cblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29sZSBzZXUgdG9rZW4gZG8gVG9kb2lzdCBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIHBhcmEgdmVyIHN1YXMgdGFyZWZhcyBhcXVpLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEF1dG8tZmV0Y2g6IG51bmNhIGJ1c2NvdSwgb3UgbyBjYWNoZSBwYXNzb3UgZG8gVFRMLiBFcnJvIG5cdTAwRTNvIGRpc3BhcmEgcmUtdGVudGF0aXZhXG4gICAgLy8gYXV0b21cdTAwRTF0aWNhIGFxdWkgKGV2aXRhcmlhIGxvb3AgYSBjYWRhIHJlbmRlcik7IG8gaW50ZXJ2YWxvIGUgbyBib3RcdTAwRTNvIFx1MjFCQiBjdWlkYW0gZGlzc28uXG4gICAgaWYgKCF0aGlzLmxvYWRpbmcgJiYgIXRoaXMuZXJyb3IgJiYgKCF0aGlzLmZldGNoZWRBdCB8fCB0aGlzLmlzU3RhbGUoKSkpIHZvaWQgdGhpcy5mZXRjaChmYWxzZSk7XG4gICAgY29uc3QgaGFzQ2FjaGUgPSB0aGlzLnRhc2tzLmxlbmd0aCA+IDA7XG4gICAgLy8gRXJyby9jYXJyZWdhbmRvIHNcdTAwRjMgb2N1cGFtIGEgXHUwMEUxcmVhIHRvZGEgcXVhbmRvIE5cdTAwQzNPIGhcdTAwRTEgY2FjaGUgcGFyYSBtb3N0cmFyIChvZmZsaW5lLWZyaWVuZGx5KS5cbiAgICBpZiAodGhpcy5lcnJvciAmJiAhaGFzQ2FjaGUpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHkgd2QtdG9kby1lcnJvclwiLCB0ZXh0OiBgRXJybyBhbyBidXNjYXIgdGFyZWZhczogJHt0aGlzLmVycm9yfWAgfSk7IHJldHVybjsgfVxuICAgIGlmICghdGhpcy5mZXRjaGVkQXQgJiYgIWhhc0NhY2hlKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ2FycmVnYW5kbyB0YXJlZmFzXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgIHRoaXMucmVuZGVyRnJlc2huZXNzKGJvZHkpO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVyT3BlbikgdGhpcy5yZW5kZXJGaWx0ZXJCYXIoYm9keSk7XG5cbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICBjb25zdCB0b2RheUsgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBsYXN0VXBjb21pbmcgPSBuZXcgRGF0ZSgpO1xuICAgIGxhc3RVcGNvbWluZy5zZXREYXRlKGxhc3RVcGNvbWluZy5nZXREYXRlKCkgKyByYW5nZSk7XG4gICAgY29uc3QgbGFzdEsgPSB0b0tleShsYXN0VXBjb21pbmcpO1xuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmFwcGx5RmlsdGVycyh0aGlzLnRhc2tzKTtcbiAgICBjb25zdCBvdmVyZHVlOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgdG9kYXlUYXNrczogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCBUb2RvaXN0VGFza1tdPiA9IHt9O1xuICAgIGNvbnN0IGxhdGVyOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3Qgbm9EYXRlOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgZm9yIChjb25zdCB0IG9mIHRhc2tzKSB7XG4gICAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICAgIGlmICghZGspIHsgbm9EYXRlLnB1c2godCk7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGsgPCB0b2RheUspIG92ZXJkdWUucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrID09PSB0b2RheUspIHRvZGF5VGFza3MucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrIDw9IGxhc3RLKSAoYnlEYXlbZGtdID8/PSBbXSkucHVzaCh0KTtcbiAgICAgIGVsc2UgbGF0ZXIucHVzaCh0KTtcbiAgICB9XG4gICAgY29uc3QgYnlQcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICAvLyBcIkRlcG9pc1wiOiBvcmRlbmEgcG9yIERBVEEgKG1haXMgcHJcdTAwRjN4aW1hIHByaW1laXJvKSBlLCBubyBtZXNtbyBkaWEsIHBvciBwcmlvcmlkYWRlLlxuICAgIGNvbnN0IGJ5RGF0ZVRoZW5QcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiB7XG4gICAgICBjb25zdCBkYSA9IGR1ZUtleShhKSA/PyBcIlwiLCBkYiA9IGR1ZUtleShiKSA/PyBcIlwiO1xuICAgICAgaWYgKGRhICE9PSBkYikgcmV0dXJuIGRhIDwgZGIgPyAtMSA6IDE7XG4gICAgICByZXR1cm4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7XG4gICAgfTtcbiAgICBvdmVyZHVlLnNvcnQoYnlQcmkpOyB0b2RheVRhc2tzLnNvcnQoYnlQcmkpOyBsYXRlci5zb3J0KGJ5RGF0ZVRoZW5QcmkpOyBub0RhdGUuc29ydChieVByaSk7XG4gICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKGJ5RGF5KSkgYnlEYXlba10uc29ydChieVByaSk7XG5cbiAgICAvLyBcIkRlcG9pc1wiIGUgXCJTZW0gZGF0YVwiIHNcdTAwRjMgYXBhcmVjZW0gbmEgYWJhIGRlZGljYWRhIChzaG93TGF0ZXIgIT09IGZhbHNlKS5cbiAgICBjb25zdCBzaG93RXh0cmEgPSBvcHRzLnNob3dMYXRlciAhPT0gZmFsc2U7XG4gICAgY29uc3QgdmlzaWJsZSA9IG92ZXJkdWUubGVuZ3RoICsgdG9kYXlUYXNrcy5sZW5ndGggKyBsYXRlci5sZW5ndGhcbiAgICAgICsgT2JqZWN0LnZhbHVlcyhieURheSkucmVkdWNlKChzLCBhKSA9PiBzICsgYS5sZW5ndGgsIDApXG4gICAgICArIChzaG93RXh0cmEgPyBub0RhdGUubGVuZ3RoIDogMCk7XG4gICAgaWYgKHZpc2libGUgPT09IDApIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICAgIGNvbnN0IGZpbHRlcmVkID0gISEoZi5wcm9qZWN0cy5sZW5ndGggfHwgZi5sYWJlbHMubGVuZ3RoKTtcbiAgICAgIGNvbnN0IG1zZyA9IGZpbHRlcmVkID8gXCJOZW5odW1hIHRhcmVmYSBiYXRlIGNvbSBvcyBmaWx0cm9zLlwiXG4gICAgICAgIDogc2hvd0V4dHJhID8gXCJOZW5odW1hIHRhcmVmYSBubyBUb2RvaXN0LiBcdUQ4M0NcdURGODlcIlxuICAgICAgICA6IFwiTmVuaHVtYSB0YXJlZmEgYWdlbmRhZGEuIFx1RDgzQ1x1REY4OVwiO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogbXNnIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbHMgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWNvbHNcIiB9KTtcblxuICAgIGNvbnN0IG9ib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtb3ZlcmR1ZVwiIH0pO1xuICAgIGNvbnN0IG9oZCA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveHdhcm5cIiwgdGV4dDogXCJcdTI2QTBcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiQXRyYXNhZGFzXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcob3ZlcmR1ZS5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IG9ib2R5ID0gb2JveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKG92ZXJkdWUubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2Ygb3ZlcmR1ZSkgdGhpcy50b2RvUm93KG9ib2R5LCB0KTtcbiAgICBlbHNlIG9ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYS4gXHVEODNEXHVEQzREXCIgfSk7XG5cbiAgICBjb25zdCB0Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXRvZGF5XCIgfSk7XG4gICAgY29uc3QgdGhkID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHRoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogXCJIb2plXCIgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHRoZCwgXCJob2plXCIsIFwiTm92YSB0YXJlZmEgcGFyYSBob2plXCIpO1xuICAgIHRoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHRvZGF5VGFza3MubGVuZ3RoKSB9KTtcbiAgICBjb25zdCB0Ym9keSA9IHRib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmICh0b2RheVRhc2tzLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIHRvZGF5VGFza3MpIHRoaXMudG9kb1Jvdyh0Ym9keSwgdCk7XG4gICAgZWxzZSB0Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5hZGEgcGFyYSBob2plLlwiIH0pO1xuXG4gICAgbGV0IHVwY29taW5nQ291bnQgPSAwO1xuICAgIGNvbnN0IHVwRGF5czogeyBkb3c6IG51bWJlcjsgbnVtOiBudW1iZXI7IGtleTogc3RyaW5nOyBpdGVtczogVG9kb2lzdFRhc2tbXSB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSByYW5nZTsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XTtcbiAgICAgIGlmICghaXRlbXM/Lmxlbmd0aCkgY29udGludWU7XG4gICAgICB1cGNvbWluZ0NvdW50ICs9IGl0ZW1zLmxlbmd0aDtcbiAgICAgIHVwRGF5cy5wdXNoKHsgZG93OiAoZGF5LmdldERheSgpICsgNikgJSA3LCBudW06IGRheS5nZXREYXRlKCksIGtleSwgaXRlbXMgfSk7XG4gICAgfVxuICAgIGNvbnN0IHVib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdXBjb21pbmdcIiB9KTtcbiAgICBjb25zdCB1aGQgPSB1Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdWhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBgUHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzYCB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odWhkLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgdWhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodXBjb21pbmdDb3VudCkgfSk7XG4gICAgY29uc3QgdWJvZHkgPSB1Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodXBEYXlzLmxlbmd0aCkge1xuICAgICAgZm9yIChjb25zdCBnIG9mIHVwRGF5cykge1xuICAgICAgICBjb25zdCBkaCA9IHVib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWRheWhkXCIgKyAoZy5kb3cgPj0gNSA/IFwiIHdkLXdlZWtlbmRcIiA6IFwiXCIpIH0pO1xuICAgICAgICBkaC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbZy5kb3ddIH0pO1xuICAgICAgICBkaC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bnVtXCIsIHRleHQ6IFN0cmluZyhnLm51bSkgfSk7XG4gICAgICAgIHRoaXMuYWRkVGFza0J0bihkaCwgZy5rZXksIGBOb3ZhIHRhcmVmYSBlbSAke2cubnVtfWApO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZy5pdGVtcykgdGhpcy50b2RvUm93KHVib2R5LCB0LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IGBOYWRhIG5vcyBwclx1MDBGM3hpbW9zICR7cmFuZ2V9IGRpYXMuYCB9KTtcbiAgICB9XG5cbiAgICBpZiAobGF0ZXIubGVuZ3RoICYmIHNob3dFeHRyYSkge1xuICAgICAgY29uc3QgcGFuZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyXCIgfSk7XG4gICAgICBjb25zdCBsaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBEZXBvaXMgKCR7bGF0ZXIubGVuZ3RofSlgIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMubGF0ZXJPcGVuID8gXCJvY3VsdGFyIFx1MjVCRVwiIDogXCJtb3N0cmFyIFx1MjAzQVwiIH0pO1xuICAgICAgbGhkLnNldEF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsIFN0cmluZyh0aGlzLmxhdGVyT3BlbikpO1xuICAgICAgY2xpY2thYmxlKGxoZCwgKCkgPT4geyB0aGlzLmxhdGVyT3BlbiA9ICF0aGlzLmxhdGVyT3BlbjsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIGlmICh0aGlzLmxhdGVyT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGxhdGVyKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vRGF0ZS5sZW5ndGggJiYgc2hvd0V4dHJhKSB7XG4gICAgICBjb25zdCBwYW5lbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tbGF0ZXIgd2QtdG9kby1ub2RhdGVcIiB9KTtcbiAgICAgIGNvbnN0IG5oZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgbmhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1sYXRlcmljb1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgbmhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYFNlbSBkYXRhICgke25vRGF0ZS5sZW5ndGh9KWAgfSk7XG4gICAgICBuaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90b2dnbGVcIiwgdGV4dDogdGhpcy5ub0RhdGVPcGVuID8gXCJvY3VsdGFyIFx1MjVCRVwiIDogXCJtb3N0cmFyIFx1MjAzQVwiIH0pO1xuICAgICAgbmhkLnNldEF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsIFN0cmluZyh0aGlzLm5vRGF0ZU9wZW4pKTtcbiAgICAgIGNsaWNrYWJsZShuaGQsICgpID0+IHsgdGhpcy5ub0RhdGVPcGVuID0gIXRoaXMubm9EYXRlT3BlbjsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIGlmICh0aGlzLm5vRGF0ZU9wZW4pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9saXN0XCIgfSk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBub0RhdGUpIHRoaXMudG9kb1JvdyhsaXN0LCB0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gVW1hIG9jb3JyXHUwMEVBbmNpYSBjb25jbHVcdTAwRURkYSBcdTAwRTkgcmVjb3JyZW50ZT8gKG5cdTAwRTNvIHBvZGUgc2VyIGFwYWdhZGEgXHUyMDE0IHF1ZWJyYXJpYSBhIHJlY29yclx1MDBFQW5jaWEpXG5mdW5jdGlvbiBpc1JlY3VycmluZ0NvbXBsZXRlZCh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gdC5kdWU/LmlzX3JlY3VycmluZyA9PT0gdHJ1ZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEdhbWlmaWNhXHUwMEU3XHUwMEUzbzogY29udHJvbGFkb3IgXHUwMEZBbmljbyAoZG9ubyBubyBwbHVnaW4sIGNvbXBhcnRpbGhhZG8gdmlld1x1MjE5NGZhaXhhKSBcdTI1MDBcdTI1MDBcbmNsYXNzIEdhbWVDb250cm9sbGVyIHtcbiAgcHJpdmF0ZSBldmVudHM6IEdhbWVFdmVudFtdID0gW107XG4gIHByaXZhdGUgbG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgYnVzeSA9IGZhbHNlOyAgICAgICAgICAgICAgICAgLy8gY29saGVpdGEvbWFya1VuZG9uZSBlbSBhbmRhbWVudG9cbiAgcHJpdmF0ZSBwZW5kaW5nOiBUb2RvaXN0VGFza1tdID0gW107ICAvLyBjb25jbHVcdTAwRURkYXMgbmEgQVBJIGFpbmRhIG5cdTAwRTNvIG5vIGxvZyAobGl2ZSlcbiAgcHJpdmF0ZSBwZW5kaW5nWHAgPSAwO1xuICBwcml2YXRlIHN1YnMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7fVxuXG4gIHN1YnNjcmliZShjYjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQgeyB0aGlzLnN1YnMuYWRkKGNiKTsgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07IH1cbiAgcmVyZW5kZXJBbGwoKSB7IGZvciAoY29uc3QgY2Igb2YgdGhpcy5zdWJzKSBjYigpOyB9XG5cbiAgcHJpdmF0ZSBsb2dGaWxlKCk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChHQU1FX0xPR19QQVRIKTtcbiAgICByZXR1cm4gZiBpbnN0YW5jZW9mIFRGaWxlID8gZiA6IG51bGw7XG4gIH1cbiAgaW52YWxpZGF0ZSgpIHsgdGhpcy5sb2FkZWQgPSBmYWxzZTsgfVxuICBhc3luYyBlbnN1cmVMb2FkZWQoKSB7XG4gICAgaWYgKHRoaXMubG9hZGVkKSByZXR1cm47XG4gICAgY29uc3QgZiA9IHRoaXMubG9nRmlsZSgpO1xuICAgIHRoaXMuZXZlbnRzID0gZiA/IHBhcnNlR2FtZUxvZyhhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGYpKSA6IFtdO1xuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgfVxuICBzdGF0cygpOiBHYW1lU3RhdHMgeyByZXR1cm4gY29tcHV0ZUdhbWVTdGF0cyh0aGlzLmV2ZW50cyk7IH1cblxuICBwcml2YXRlIGFzeW5jIHdyaXRlTG9nKCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBidWlsZEdhbWVMb2dDb250ZW50KHRoaXMuZXZlbnRzKTtcbiAgICBjb25zdCBmID0gdGhpcy5sb2dGaWxlKCk7XG4gICAgaWYgKGYpIHsgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGYsIGNvbnRlbnQpOyByZXR1cm47IH1cbiAgICBjb25zdCBzbGFzaCA9IEdBTUVfTE9HX1BBVEgubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGNvbnN0IGZvbGRlciA9IHNsYXNoID4gMCA/IEdBTUVfTE9HX1BBVEguc2xpY2UoMCwgc2xhc2gpIDogXCJcIjtcbiAgICBpZiAoZm9sZGVyICYmICF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZm9sZGVyKSkge1xuICAgICAgdHJ5IHsgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKGZvbGRlcik7IH0gY2F0Y2ggeyAvKiBqXHUwMEUxIGV4aXN0ZSAqLyB9XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShHQU1FX0xPR19QQVRILCBjb250ZW50KTtcbiAgfVxuXG4gIC8vIEFuZXhhIGV2ZW50b3Mgbm92b3MgKGRlZHVwIHBvciBjaGF2ZSkuIERldm9sdmUgcXVhbnRvcyBlbnRyYXJhbS5cbiAgcHJpdmF0ZSBhc3luYyBhcHBlbmRFdmVudHMoZXZzOiBHYW1lRXZlbnRbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgYXdhaXQgdGhpcy5lbnN1cmVMb2FkZWQoKTtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCh0aGlzLmV2ZW50cy5tYXAoZSA9PiBlLmtleSkpO1xuICAgIGNvbnN0IGFkZCA9IGV2cy5maWx0ZXIoZSA9PiAha2V5cy5oYXMoZS5rZXkpKTtcbiAgICBpZiAoIWFkZC5sZW5ndGgpIHJldHVybiAwO1xuICAgIHRoaXMuZXZlbnRzLnB1c2goLi4uYWRkKTtcbiAgICBhd2FpdCB0aGlzLndyaXRlTG9nKCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHJldHVybiBhZGQubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9qTmFtZSh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnRvZG8ucHJvamVjdE5hbWUodC5wcm9qZWN0X2lkKSB8fCAodC5wcm9qZWN0X2lkID8/IFwiXCIpO1xuICB9XG4gIHByaXZhdGUgZG9uZUV2ZW50KHQ6IFRvZG9pc3RUYXNrKTogR2FtZUV2ZW50IHtcbiAgICBjb25zdCBhdCA9IHQuY29tcGxldGVkX2F0ID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICByZXR1cm4geyBkYXRlOiB0b0tleShuZXcgRGF0ZShhdCkpLCB0eXBlOiBcImZlaXRvXCIsIHhwOiB4cEZvclByaW9yaXR5KHQucHJpb3JpdHkpLFxuICAgICAga2V5OiBgJHt0LmlkfXwke2F0fWAsIGNvbnRlbnQ6IHQuY29udGVudCwgcHJvamVjdDogdGhpcy5wcm9qTmFtZSh0KSwgbGFiZWxzOiB0LmxhYmVscyA/PyBbXSB9O1xuICB9XG5cbiAgLy8gSmFuZWxhIGRvIGZldGNoOiBkZXNkZSBhIFx1MDBGQWx0aW1hIGNvbGhlaXRhIChcdTIyMTIyZCBkZSBtYXJnZW0pIG91IGJhY2tmaWxsIG5hIDFcdTAwQUEgdmV6LlxuICBwcml2YXRlIGhhcnZlc3RTaW5jZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxhc3QgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3Q7XG4gICAgaWYgKGxhc3QgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QobGFzdCkpXG4gICAgICByZXR1cm4gdG9LZXkobmV3IERhdGUoRGF0ZS5wYXJzZShsYXN0ICsgXCJUMDA6MDA6MDBcIikgLSAyICogODY0MDAwMDApKTtcbiAgICByZXR1cm4gdG9LZXkobmV3IERhdGUoRGF0ZS5ub3coKSAtIEhBUlZFU1RfQkFDS0ZJTExfREFZUyAqIDg2NDAwMDAwKSk7XG4gIH1cbiAgLy8gYHVudGlsYCA9IEFNQU5IXHUwMEMzIChsb2NhbCkuIGNvbXBsZXRlZF9hdCBkYSBBUEkgXHUwMEU5IFVUQzogXHUwMEUwIG5vaXRlIG5vIEJSVCwgYSBjb25jbHVzXHUwMEUzbyBkZVxuICAvLyBob2plIGpcdTAwRTEgXHUwMEU5IFwiYW1hbmhcdTAwRTNcIiBlbSBVVEMgXHUyMTkyIGNvbSB1bnRpbD1ob2plIGVsYSBjYWlyaWEgZm9yYSBkYSBqYW5lbGEuXG4gIHByaXZhdGUgaGFydmVzdFVudGlsKCk6IHN0cmluZyB7IHJldHVybiB0b0tleShuZXcgRGF0ZShEYXRlLm5vdygpICsgODY0MDAwMDApKTsgfVxuXG4gIC8vIFwiTlx1MDBFM28gZmVpdG9cIjogcHVuaVx1MDBFN1x1MDBFM28gKFx1MjIxMmJhc2VcdTAwRDdmYXRvcikgXHUyMTkyIGxvZyBcdTIxOTIgYXBhZ2EgZG8gVG9kb2lzdC5cbiAgYXN5bmMgbWFya1VuZG9uZSh0OiBUb2RvaXN0VGFzaykge1xuICAgIGlmICh0aGlzLmJ1c3kpIHJldHVybjtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdC5cIik7IHJldHVybjsgfVxuICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHhwRm9yUHJpb3JpdHkodC5wcmlvcml0eSkgKiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvcikpO1xuICAgIGNvbnN0IHJlY3VycmluZyA9IGlzUmVjdXJyaW5nQ29tcGxldGVkKHQpO1xuICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICB0aXRsZTogXCJNYXJjYXIgY29tbyBuXHUwMEUzbyBmZWl0YT9cIixcbiAgICAgIGJvZHk6IHJlY3VycmluZ1xuICAgICAgICA/IGBcIiR7dC5jb250ZW50fVwiIFx1MDBFOSByZWNvcnJlbnRlIFx1MjAxNCB2b2NcdTAwRUEgcGVyZGUgJHtwZW5hbHR5fSBYUCwgbWFzIGEgdGFyZWZhIE5cdTAwQzNPIFx1MDBFOSBhcGFnYWRhIChhcGFnYXIgcXVlYnJhcmlhIGEgcmVjb3JyXHUwMEVBbmNpYSkuYFxuICAgICAgICA6IGBcIiR7dC5jb250ZW50fVwiIFx1MjAxNCB2b2NcdTAwRUEgcGVyZGUgJHtwZW5hbHR5fSBYUCBlIGEgdGFyZWZhIFx1MDBFOSBhcGFnYWRhIGRvIFRvZG9pc3QgKGlycmV2ZXJzXHUwMEVEdmVsKS5gLFxuICAgICAgY3RhOiBgTlx1MDBFM28gZmVpdGEgKFx1MjIxMiR7cGVuYWx0eX0gWFApYCxcbiAgICB9KTtcbiAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgdGhpcy5idXN5ID0gdHJ1ZTsgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmFwcGVuZEV2ZW50cyhbeyBkYXRlOiB0b0tleShuZXcgRGF0ZSgpKSwgdHlwZTogXCJuYW8tZmVpdG9cIiwgeHA6IC1wZW5hbHR5LFxuICAgICAgICBrZXk6IGAke3QuaWR9fCR7RGF0ZS5ub3coKX1gLCBjb250ZW50OiB0LmNvbnRlbnQsIHByb2plY3Q6IHRoaXMucHJvak5hbWUodCksIGxhYmVsczogdC5sYWJlbHMgPz8gW10gfV0pO1xuICAgICAgaWYgKCFyZWN1cnJpbmcpIGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxNyBOXHUwMEUzbyBmZWl0YTogJHt0LmNvbnRlbnR9IChcdTIyMTIke3BlbmFsdHl9IFhQKWApO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udG9kby5mZXRjaCh0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYTogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuYnVzeSA9IGZhbHNlOyB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29saGUgY29uY2x1XHUwMEVEZGFzIFx1MjE5MiBsb2c7IGFwYWdhIGRvIFRvZG9pc3Qgc1x1MDBGMyBhcyBOXHUwMEMzTy1yZWNvcnJlbnRlcy5cbiAgYXN5bmMgaGFydmVzdCgpIHtcbiAgICBpZiAodGhpcy5idXN5KSByZXR1cm47XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIpOyByZXR1cm47IH1cbiAgICB0aGlzLmJ1c3kgPSB0cnVlOyB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7XG4gICAgICBjb25zdCB0b2RheSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgICAgY29uc3QgY29tcGxldGVkID0gYXdhaXQgZmV0Y2hDb21wbGV0ZWRUYXNrcyh0b2tlbiwgdGhpcy5oYXJ2ZXN0U2luY2UoKSwgdGhpcy5oYXJ2ZXN0VW50aWwoKSk7XG4gICAgICBjb25zdCBrZXlzID0gbmV3IFNldCh0aGlzLmV2ZW50cy5tYXAoZSA9PiBlLmtleSkpO1xuICAgICAgY29uc3QgZnJlc2ggPSBjb21wbGV0ZWQuZmlsdGVyKHQgPT4gIWtleXMuaGFzKGAke3QuaWR9fCR7dC5jb21wbGV0ZWRfYXQgPz8gXCJcIn1gKSk7XG4gICAgICBpZiAoIWZyZXNoLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPSB0b2RheTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIHRoaXMucGVuZGluZyA9IFtdOyB0aGlzLnBlbmRpbmdYcCA9IDA7XG4gICAgICAgIG5ldyBOb3RpY2UoXCJOYWRhIG5vdm8gcGFyYSBzYWx2YXIuIFx1RDgzRFx1REM0RFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZGVsZXRhYmxlID0gZnJlc2guZmlsdGVyKHQgPT4gIWlzUmVjdXJyaW5nQ29tcGxldGVkKHQpKTtcbiAgICAgIGNvbnN0IHJlY3VycmluZyA9IGZyZXNoLmxlbmd0aCAtIGRlbGV0YWJsZS5sZW5ndGg7XG4gICAgICBjb25zdCB0b3RhbFhwID0gZnJlc2gucmVkdWNlKChzLCB0KSA9PiBzICsgeHBGb3JQcmlvcml0eSh0LnByaW9yaXR5KSwgMCk7XG4gICAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgICB0aXRsZTogYFNhbHZhciAke2ZyZXNoLmxlbmd0aH0gdGFyZWZhKHMpIGNvbmNsdVx1MDBFRGRhKHMpP2AsXG4gICAgICAgIGJvZHk6IGArJHt0b3RhbFhwfSBYUCBubyBsb2cuICR7ZGVsZXRhYmxlLmxlbmd0aH0gYXBhZ2FkYShzKSBkbyBUb2RvaXN0YCArXG4gICAgICAgICAgKHJlY3VycmluZyA/IGAgXHUwMEI3ICR7cmVjdXJyaW5nfSByZWNvcnJlbnRlKHMpIGZpY2FtIChhcGFnYXIgcXVlYnJhcmlhIGEgcmVjb3JyXHUwMEVBbmNpYSkuYCA6IFwiLlwiKSxcbiAgICAgICAgaXRlbXM6IGZyZXNoLnNsaWNlKDAsIDMwKS5tYXAodCA9PiAoeyB0ZXh0OiBgKyR7eHBGb3JQcmlvcml0eSh0LnByaW9yaXR5KX0gXHUwMEI3ICR7dC5jb250ZW50fWAgfSkpLFxuICAgICAgICBjdGE6IGBTYWx2YXIgZSBhcGFnYXIgJHtkZWxldGFibGUubGVuZ3RofWAsXG4gICAgICB9KTtcbiAgICAgIGlmICghb2spIHJldHVybjtcbiAgICAgIGF3YWl0IHRoaXMuYXBwZW5kRXZlbnRzKGZyZXNoLm1hcCh0ID0+IHRoaXMuZG9uZUV2ZW50KHQpKSk7XG4gICAgICBsZXQgZGVsID0gMDtcbiAgICAgIGZvciAoY29uc3QgdCBvZiBkZWxldGFibGUpIHtcbiAgICAgICAgdHJ5IHsgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpOyBkZWwrKzsgfSBjYXRjaCB7IC8qIHNlZ3VlICovIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdCA9IHRvZGF5OyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgIHRoaXMucGVuZGluZyA9IFtdOyB0aGlzLnBlbmRpbmdYcCA9IDA7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTMgJHtmcmVzaC5sZW5ndGh9IHNhbHZhKHMpICgrJHt0b3RhbFhwfSBYUCkgXHUwMEI3ICR7ZGVsfSBhcGFnYWRhKHMpYCk7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi50b2RvLmZldGNoKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIHNhbHZhcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuYnVzeSA9IGZhbHNlOyB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29udGEgcXVhbnRhcyBjb25jbHVcdTAwRURkYXMgZXN0XHUwMEUzbyBwZW5kZW50ZXMgZGUgc2FsdmFyIChsaXZlLCBzZW0gYXBhZ2FyIG5hZGEpLlxuICBhc3luYyByZWZyZXNoUGVuZGluZygpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZUxvYWRlZCgpO1xuICAgICAgY29uc3QgY29tcGxldGVkID0gYXdhaXQgZmV0Y2hDb21wbGV0ZWRUYXNrcyh0b2tlbiwgdGhpcy5oYXJ2ZXN0U2luY2UoKSwgdGhpcy5oYXJ2ZXN0VW50aWwoKSk7XG4gICAgICBjb25zdCBrZXlzID0gbmV3IFNldCh0aGlzLmV2ZW50cy5tYXAoZSA9PiBlLmtleSkpO1xuICAgICAgdGhpcy5wZW5kaW5nID0gY29tcGxldGVkLmZpbHRlcih0ID0+ICFrZXlzLmhhcyhgJHt0LmlkfXwke3QuY29tcGxldGVkX2F0ID8/IFwiXCJ9YCkpO1xuICAgICAgdGhpcy5wZW5kaW5nWHAgPSB0aGlzLnBlbmRpbmcucmVkdWNlKChzLCB0KSA9PiBzICsgeHBGb3JQcmlvcml0eSh0LnByaW9yaXR5KSwgMCk7XG4gICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfSBjYXRjaCB7IC8qIHNpbGVuY2lvc28gKi8gfVxuICB9XG5cbiAgLy8gUGFpbmVsIGNvbXBhcnRpbGhhZG86IGRhc2hib2FyZCAoZmFpeGEsIGN0cmxzIHNlbSBjb2xoZWl0YSkgZSBhYmEgKGZ1bGwpLlxuICByZW5kZXJQYW5lbChob3N0OiBIVE1MRWxlbWVudCwgY3RybHM6IEhUTUxFbGVtZW50IHwgbnVsbCwgb3B0czogeyBmdWxsPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCBzID0gdGhpcy5zdGF0cygpO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAob3B0cy5mdWxsICYmIGN0cmxzICYmIHRva2VuKSB7XG4gICAgICBjb25zdCBzYXZlID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWhhcnZlc3RcIiArICh0aGlzLmJ1c3kgPyBcIiB3ZC1nYW1lLWJ1c3lcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihzYXZlLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1oYXJ2ZXN0LWljb1wiIH0pLCBcImRvd25sb2FkXCIpO1xuICAgICAgc2F2ZS5jcmVhdGVTcGFuKHsgdGV4dDogdGhpcy5idXN5ID8gXCJTYWx2YW5kb1x1MjAyNlwiIDogXCJTYWx2YXIgY29uY2x1XHUwMEVEZGFzXCIgfSk7XG4gICAgICBpZiAodGhpcy5wZW5kaW5nLmxlbmd0aCkgc2F2ZS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtcGVuZFwiLCB0ZXh0OiBgKyR7dGhpcy5wZW5kaW5nWHB9YCB9KTtcbiAgICAgIHNhdmUuc2V0QXR0cihcInRpdGxlXCIsIHRoaXMucGVuZGluZy5sZW5ndGhcbiAgICAgICAgPyBgJHt0aGlzLnBlbmRpbmcubGVuZ3RofSBjb25jbHVcdTAwRURkYShzKSBhZ3VhcmRhbmRvIHNhbHZhciAoKyR7dGhpcy5wZW5kaW5nWHB9IFhQKWBcbiAgICAgICAgOiBcIkJ1c2NhciB0YXJlZmFzIGNvbmNsdVx1MDBFRGRhcywgc2FsdmFyIG5vIGxvZyBlIGxpbXBhciBkbyBUb2RvaXN0XCIpO1xuICAgICAgaWYgKCF0aGlzLmJ1c3kpIGNsaWNrYWJsZShzYXZlLCAoKSA9PiB2b2lkIHRoaXMuaGFydmVzdCgpKTtcbiAgICB9XG5cbiAgICBjb25zdCBsdmwgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWxldmVsXCIgfSk7XG4gICAgbHZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1sdmxudW1cIiwgdGV4dDogYE5cdTAwRUR2ZWwgJHtzLmxldmVsfWAgfSk7XG4gICAgbHZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS14cFwiLCB0ZXh0OiBgJHtzLnRvdGFsWHB9IFhQYCB9KTtcbiAgICBjb25zdCBiYXIgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWJhclwiIH0pO1xuICAgIGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1iYXItZmlsbFwiIH0pLnN0eWxlLndpZHRoID1cbiAgICAgIGAke3MueHBGb3JOZXh0ID8gTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKHMueHBJbnRvTGV2ZWwgLyBzLnhwRm9yTmV4dCAqIDEwMCkpIDogMH0lYDtcbiAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke3MueHBJbnRvTGV2ZWx9LyR7cy54cEZvck5leHR9IFhQIHBhcmEgbyBuXHUwMEVEdmVsICR7cy5sZXZlbCArIDF9YCk7XG5cbiAgICBjb25zdCBncmlkID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1tZXRyaWNzXCIgfSk7XG4gICAgY29uc3QgbWV0cmljID0gKGljb246IHN0cmluZywgdmFsOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcsIGNscyA9IFwiXCIpID0+IHtcbiAgICAgIGNvbnN0IGMgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpYyBcIiArIGNscyB9KTtcbiAgICAgIGNvbnN0IHYgPSBjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpYy12YWxcIiB9KTtcbiAgICAgIHNldEljb24odi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLWljb1wiIH0pLCBpY29uKTtcbiAgICAgIHYuY3JlYXRlU3Bhbih7IHRleHQ6IHZhbCB9KTtcbiAgICAgIGMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLWxibFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgICB9O1xuICAgIG1ldHJpYyhcImZsYW1lXCIsIFN0cmluZyhzLnN0cmVha0N1cnJlbnQpLCBgc3RyZWFrIFx1MDBCNyByZWNvcmRlICR7cy5zdHJlYWtCZXN0fWAsIHMuc3RyZWFrQ3VycmVudCA/IFwid2QtZ2FtZS1zdHJlYWstb25cIiA6IFwiXCIpO1xuICAgIG1ldHJpYyhcInphcFwiLCBgJHtzLnRvZGF5WHAgPj0gMCA/IFwiK1wiIDogXCJcIn0ke3MudG9kYXlYcH1gLCBgWFAgaG9qZSBcdTAwQjcgJHtzLnRvZGF5Q291bnR9IGZlaXRhKHMpYCk7XG5cbiAgICBpZiAob3B0cy5mdWxsICYmIHRoaXMucGVuZGluZy5sZW5ndGgpXG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWhpbnRcIiwgdGV4dDpcbiAgICAgICAgYCR7dGhpcy5wZW5kaW5nLmxlbmd0aH0gY29uY2x1XHUwMEVEZGEocykgYWd1YXJkYW5kbyBzYWx2YXIgKCske3RoaXMucGVuZGluZ1hwfSBYUCkgXHUyMDE0IGNsaXF1ZSBlbSBcIlNhbHZhciBjb25jbHVcdTAwRURkYXNcIi5gIH0pO1xuICB9XG59XG5cbmNsYXNzIERhc2hib2FyZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgd2Vla09mZnNldCA9IDA7XG4gIHByaXZhdGUgbmF2UGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGlwOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNlYXJjaFRlcm0gPSBcIlwiO1xuICBwcml2YXRlIHJldmlld0ZpbHRlciA9IGZhbHNlO1xuICBwcml2YXRlIGdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzZWNIb3N0cyA9IG5ldyBNYXA8U2VjdGlvbklkLCBIVE1MRWxlbWVudD4oKTsgICAvLyB3cmFwcGVyIGVzdFx1MDBFMXZlbCBwb3Igc2VcdTAwRTdcdTAwRTNvXG4gIHByaXZhdGUgdW5zdWJUb2RvOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDsgICAgICAgICAgLy8gY2FuY2VsYXIgaW5zY3JpXHUwMEU3XHUwMEUzbyBubyBjb250cm9sbGVyXG4gIHByaXZhdGUgdW5zdWJHYW1lOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDsgICAgICAgICAgLy8gaWRlbSBwYXJhIGEgR2FtaWZpY2FcdTAwRTdcdTAwRTNvXG5cbiAgLy8gRXN0YWRvIGRvIFN5bmN0aGluZyAodjAuMTAuMClcbiAgcHJpdmF0ZSBzeW5jRGF0YTogU3luY0RhdGEgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzeW5jTG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHN5bmNFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0ZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgY29uZmxpY3RDb25maXJtOiBzdHJpbmcgfCBudWxsID0gbnVsbDsgICAvLyBwYXRoIGRvIGNvbmZsaXRvIGFndWFyZGFuZG8gY29uZmlybWFcdTAwRTdcdTAwRTNvXG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFZJRVdfVFlQRTsgfVxuICBnZXREaXNwbGF5VGV4dCgpIHsgcmV0dXJuIFwiRGFzaGJvYXJkXCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxheW91dC1kYXNoYm9hcmRcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICBhd2FpdCB0aGlzLnJlbmRlcigpO1xuICAgIC8vIEluc2NyZXZlIG5vIGNvbnRyb2xsZXIgXHUwMEZBbmljbzogbXVkYW5cdTAwRTdhIGRlIGVzdGFkbyByZS1yZW5kZXJpemEgc1x1MDBGMyBhIHNlXHUwMEU3XHUwMEUzbyBUYXJlZmFzLlxuICAgIHRoaXMudW5zdWJUb2RvID0gdGhpcy5wbHVnaW4udG9kby5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZW5kZXJTZWN0aW9uKFwidG9kb2lzdFwiKSk7XG4gICAgdGhpcy51bnN1YkdhbWUgPSB0aGlzLnBsdWdpbi5nYW1lLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbmRlclNlY3Rpb24oXCJnYW1lXCIpKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB7IHRoaXMucGx1Z2luLmludmFsaWRhdGVWYXVsdENhY2hlKCk7IHRoaXMuc2NoZWR1bGUoKTsgfSkpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMudW5zdWJHYW1lPy4oKTtcbiAgICB0aGlzLnVuc3ViR2FtZSA9IG51bGw7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gIH1cblxuICAvLyBSZS1yZW5kZXIgcFx1MDBGQWJsaWNvIFx1MjAxNCBjaGFtYWRvIHBlbG8gcGx1Z2luIHF1YW5kbyBhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gbXVkYSBuYSBhYmFcbiAgLy8gZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgKG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcyBkYSBTZW1hbmEpLlxuICByZWZyZXNoKCkgeyB2b2lkIHRoaXMucmVuZGVyKCk7IH1cblxuICBwcml2YXRlIHNjaGVkdWxlKCkge1xuICAgIGlmICh0aGlzLnRpbWVyKSBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXIoKSwgNDAwKTtcbiAgfVxuXG4gIC8vIFByaW1laXJvIHNlZ21lbnRvIGRlIHVtIGNhbWluaG8gKFwiMTAuUHJvamVjdHMvRm9vL0JhclwiIFx1MjE5MiBcIjEwLlByb2plY3RzXCIpLlxuICBwcml2YXRlIHRvcEZvbGRlck9mKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaSA9IHBhdGguaW5kZXhPZihcIi9cIik7XG4gICAgcmV0dXJuIGkgPT09IC0xID8gcGF0aCA6IHBhdGguc2xpY2UoMCwgaSk7XG4gIH1cblxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtY29tcGFjdFwiLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KTtcblxuICAgIHRoaXMucmVuZGVySGVhZGVyKHJvb3QpO1xuICAgIC8vIENhZGEgc2VcdTAwRTdcdTAwRTNvIG1vcmEgbnVtIGhvc3QgZXN0XHUwMEUxdmVsIFx1MjE5MiBkXHUwMEUxIHBhcmEgcmUtcmVuZGVyaXphciB1bWEgc2VcdTAwRTdcdTAwRTNvIHNcdTAwRjNcbiAgICAvLyAoZXguOiByZWZyZXNoIGRvIFRvZG9pc3QvU3luY3RoaW5nKSBzZW0gcmVjb25zdHJ1aXIgYSB2aWV3IGludGVpcmEuXG4gICAgdGhpcy5zZWNIb3N0cy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyKSB7XG4gICAgICBjb25zdCBob3N0ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhvc3RcIiB9KTtcbiAgICAgIHRoaXMuc2VjSG9zdHMuc2V0KGlkLCBob3N0KTtcbiAgICAgIHRoaXMucmVuZGVyU2VjdGlvbihpZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmUtcmVuZGVyaXphIGFwZW5hcyBhIHNlXHUwMEU3XHUwMEUzbyBgaWRgIGRlbnRybyBkbyBzZXUgaG9zdCAoc2VtIHRvY2FyIG5hcyBvdXRyYXMpLlxuICBwcml2YXRlIHJlbmRlclNlY3Rpb24oaWQ6IFNlY3Rpb25JZCkge1xuICAgIGNvbnN0IGhvc3QgPSB0aGlzLnNlY0hvc3RzLmdldChpZCk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5lbXB0eSgpO1xuICAgIGlmIChpZCA9PT0gXCJjYWxlbmRhclwiKSAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJwYXJhXCIpICAgIHRoaXMucmVuZGVyUGFyYShob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJoZWF0bWFwXCIpIHRoaXMucmVuZGVySGVhdG1hcChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJncm93dGhcIikgIHRoaXMucmVuZGVyR3Jvd3RoKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcInN0YXRzXCIpICAgdGhpcy5yZW5kZXJTdGF0cyhob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJ0b2RvaXN0XCIpIHRoaXMucmVuZGVyVG9kb2lzdChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJzeW5jXCIpICAgIHRoaXMucmVuZGVyU3luYyhob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJnYW1lXCIpICAgIHRoaXMucmVuZGVyR2FtZShob3N0KTtcbiAgfVxuXG4gIC8vIEZhaXhhIGNvbXBhY3RhIGRlIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyBubyBkYXNoYm9hcmQgKHBhaW5lbCBjb21wbGV0byBmaWNhIG5hIGFiYSBwclx1MDBGM3ByaWEpLlxuICBwcml2YXRlIHJlbmRlckdhbWUoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQgfHwgdGhpcy5pc0hpZGRlbihTRUNfR0FNRSkpIHJldHVybjtcbiAgICBjb25zdCBzZWMgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWdhbWUtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiR0FNSUZJQ0FcdTAwQzdcdTAwQzNPXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBvcGVuID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW9wZW5idG5cIiB9KTtcbiAgICBzZXRJY29uKG9wZW4sIFwidHJvcGh5XCIpO1xuICAgIG9wZW4uc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgYSBhYmEgZGUgR2FtaWZpY2FcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNsaWNrYWJsZShvcGVuLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLnBsdWdpbi5vcGVuR2FtZSgpOyB9KTtcbiAgICB0aGlzLnBsdWdpbi5nYW1lLnJlbmRlclBhbmVsKHNlYywgY3RybHMsIHsgZnVsbDogZmFsc2UgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgT2N1bHRhciAobGVpdHVyYSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3RyYXIvb2N1bHRhciBlIGEgb3JkZW0gZGFzIHNlXHUwMEU3XHUwMEY1ZXMgc1x1MDBFM28gYWRtaW5pc3RyYWRvcyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZG8gcGx1Z2luLiBBIHZpZXcgc1x1MDBGMyAqbFx1MDBFQSogYHNldHRpbmdzLmhpZGRlbmAgcGFyYSBwdWxhciBvIHF1ZVxuICAvLyBlc3RcdTAwRTEgb2N1bHRvLiBWZXIgV2VydXNTZXR0aW5nVGFiLlxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gUG9zaWNpb25hIHVtIHRvb2x0aXAgZml4byBhYmFpeG8gZG8gYWx2byAodmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvKS5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2OyAgLy8gdmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvXG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgbGlzdGFuZG8gYXMgbm90YXMgdXJnZW50ZXMgZGUgdW1hIHBhc3RhIChob3ZlciBubyBiYWRnZSBkZSBhdmlzbykuXG4gIHByaXZhdGUgc2hvd1VyZ2VuY3lUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdXJnZW5jeS10aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIlVyZ2VudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXV0aXAtZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IFVSR0VOQ1lfQ09MT1JbaXQubGV2ZWxdO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogaXQuZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGl0LmxldmVsIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIEJhZGdlIGRlIGF2aXNvICh0cmlcdTAwRTJuZ3Vsbykgbm8gY2FyZCBkZSBwYXN0YSBxdWUgY29udFx1MDBFOW0gbm90YXMgY29tIGB1cmdlbmN5YC5cbiAgLy8gQ29yIHBlbG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbzsgaG92ZXIgbGlzdGEgb3MgYXJxdWl2b3MuIEZhc2UgMTAuXG4gIHByaXZhdGUgdXJnZW5jeUJhZGdlKGNhcmQ6IEhUTUxFbGVtZW50LCB1cmc6IFVyZ2VuY3lJbmZvKSB7XG4gICAgaWYgKCF1cmcubWF4KSByZXR1cm47XG4gICAgY29uc3QgYiA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktYmFkZ2Ugd2QtdS0ke3VyZy5tYXh9YCB9KTtcbiAgICBzZXRJY29uKGIsIFwidHJpYW5nbGUtYWxlcnRcIik7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dVcmdlbmN5VGlwKGIsIHVyZy5pdGVtcykpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgcmVjZW50czogVEZpbGVbXSkge1xuICAgIGlmICghcmVjZW50cy5sZW5ndGgpIHJldHVybjtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1RpcChjYXJkLCByZWNlbnRzKSk7XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICAvLyBTdWJwYXN0YXMgZXhpYlx1MDBFRHZlaXMgKGlnbm9yYSBwYXN0YXMgc1x1MDBGMy1kZS1pbWFnZW5zKSwgdmlhIGNhY2hlIGRvIGNvZnJlLlxuICBwcml2YXRlIHN1YkZvbGRlcnNPZihmb2xkZXI6IFRGb2xkZXIpOiBURm9sZGVyW10ge1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4geyBjb25zdCBhID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGYucGF0aCk7IHJldHVybiAhKGEgJiYgYS5pbWcgPiAwICYmIGEubWQgPT09IDApOyB9KVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FsZW5kXHUwMEUxcmlvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyQ2FsZW5kYXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfQ0FMKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbW9uZGF5ICA9IG1vbmRheU9mKHRoaXMud2Vla09mZnNldCk7XG4gICAgY29uc3Qgd2Vla051bSA9IGlzb1dlZWtOdW1iZXIobW9uZGF5KTtcbiAgICBjb25zdCB0b2RheUsgID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBGb250ZXMgYXRpdmFzIChwYXN0YXMgbWFyY2FkYXMpLiBBIGNvciBkZSBjYWRhIG5vdGEgdmVtIGRhIGZvbnRlIGRlXG4gICAgLy8gcHJlZml4byBtYWlzIGVzcGVjXHUwMEVEZmljbyBxdWUgYSBjb250XHUwMEU5bS5cbiAgICBjb25zdCBzb3VyY2VzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmZpbHRlcihzID0+IHMub24pO1xuICAgIGNvbnN0IGNvbG9yRm9yID0gKHBhdGg6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgbGV0IGJlc3Q6IENhbFNvdXJjZSB8IG51bGwgPSBudWxsO1xuICAgICAgZm9yIChjb25zdCBzIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgaWYgKHBhdGggPT09IGAke3MucGF0aH0ubWRgIHx8IHBhdGguc3RhcnRzV2l0aChgJHtzLnBhdGh9L2ApKSB7XG4gICAgICAgICAgaWYgKCFiZXN0IHx8IHMucGF0aC5sZW5ndGggPiBiZXN0LnBhdGgubGVuZ3RoKSBiZXN0ID0gcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlc3QgPyBiZXN0LmNvbG9yIDogbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQXMgbm90YXMgY29tIGRhdGEgalx1MDBFMSB2XHUwMEVBbSBkbyBjYWNoZSAodW1hIHBhc3NhZGEpOyBhcXVpIHNcdTAwRjMgZmlsdHJhIHBvciBmb250ZS5cbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IGZpbGU6IFRGaWxlOyBjb2xvcjogc3RyaW5nIH1bXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHsgZmlsZSwgZGF0ZSB9IG9mIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5kYXRlZE5vdGVzKSB7XG4gICAgICBjb25zdCBjb2xvciA9IGNvbG9yRm9yKGZpbGUucGF0aCk7XG4gICAgICBpZiAoIWNvbG9yKSBjb250aW51ZTsgICAvLyBzXHUwMEYzIG5vdGFzIGRlbnRybyBkZSB1bWEgZm9udGUgbWFyY2FkYVxuICAgICAgKGJ5RGF5W2RhdGVdID8/PSBbXSkucHVzaCh7IG5hbWU6IGZpbGUuYmFzZW5hbWUsIGZpbGUsIGNvbG9yIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtY2FsLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBuYXYgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYXYtYmFyXCIgfSk7XG4gICAgY29uc3QgcGhvbmUgPSBQbGF0Zm9ybS5pc1Bob25lO1xuXG4gICAgLy8gQ2VsdWxhcjogamFuZWxhIGRlIDMgZGlhcyA9IG9udGVtIFx1MDBCNyBob2plIFx1MDBCNyBhbWFuaFx1MDBFMyAod2Vla09mZnNldCBwYWdpbmEgZGUgMyBlbSAzKS5cbiAgICBjb25zdCBkYXlBbmNob3IgPSBuZXcgRGF0ZSgpO1xuICAgIGRheUFuY2hvci5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgLSAxICsgdGhpcy53ZWVrT2Zmc2V0ICogMyk7XG4gICAgY29uc3QgZm10RE0gPSAoZDogRGF0ZSkgPT4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCBcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsYXN0ID0gbmV3IERhdGUoZGF5QW5jaG9yKTsgbGFzdC5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyAyKTtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGAke2ZtdERNKGRheUFuY2hvcil9IFx1MjAxMyAke2ZtdERNKGxhc3QpfWAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGBSZWxhdFx1MDBGM3Jpb3MgXHUwMEI3IHNlbWFuYSAke3dlZWtOdW19YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHJscyA9IG5hdi5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgcHJldiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDM5XCIgfSk7XG4gICAgY29uc3QgbmV4dCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgcHJldi5zZXRBdHRyKFwidGl0bGVcIiwgXCJTZW1hbmEgYW50ZXJpb3JcIik7XG4gICAgbmV4dC5zZXRBdHRyKFwidGl0bGVcIiwgXCJQclx1MDBGM3hpbWEgc2VtYW5hXCIpO1xuICAgIGNsaWNrYWJsZShwcmV2LCAoKSA9PiB7IHRoaXMud2Vla09mZnNldC0tOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjbGlja2FibGUobmV4dCwgKCkgPT4geyB0aGlzLndlZWtPZmZzZXQrKzsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2VsdWxhcjogbGlzdGEgdmVydGljYWwgZGUgMyBkaWFzIChvbnRlbS9ob2plL2FtYW5oXHUwMEUzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBDYWRhIGRpYSA9IGEgbm90YSBkaVx1MDBFMXJpYSAodW1hIHBvciBkaWEpLiBMaW5oYSBpbnRlaXJhIGNsaWNcdTAwRTF2ZWw6IGFicmUgYVxuICAgIC8vIGV4aXN0ZW50ZTsgc2Ugblx1MDBFM28gaG91dmVyLCBjcmlhLlxuICAgIGlmIChwaG9uZSkge1xuICAgICAgY29uc3QgbGlzdCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWxpc3RcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKGRheUFuY2hvcik7XG4gICAgICAgIGRheS5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgICAgY29uc3QgZG93ID0gKGRheS5nZXREYXkoKSArIDYpICUgNztcbiAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtZHJvd1wiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGRvdyA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICAgIH0pO1xuICAgICAgICByb3cuc2V0QXR0cihcInRpdGxlXCIsIG5vdGUgPyBcIkFicmlyIG5vdGEgZGlcdTAwRTFyaWFcIiA6IFwiQ3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgICAgY29uc3QgaGQgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LWhkXCIgfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2Rvd10gfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW51bVwiLCB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LW5vdGVzXCIgfSk7XG4gICAgICAgIGlmIChub3RlKSB7XG4gICAgICAgICAgY29uc3QgcGlsbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgICAgcGlsbC50ZXh0Q29udGVudCA9IG5vdGUuYmFzZW5hbWUubGVuZ3RoID4gMjQgPyBub3RlLmJhc2VuYW1lLnNsaWNlKDAsIDI0KSArIFwiXHUyMDI2XCIgOiBub3RlLmJhc2VuYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvZHkuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtZHJvdy1lbXB0eVwiLCB0ZXh0OiBcImNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBjbGlja2FibGUocm93LCAoKSA9PiB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRGVza3RvcC90YWJsZXQ6IGdyYWRlIGRlIDcgZGlhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZ3JpZFwiIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgICAgZGF5LnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGNvbCA9IGdyaWQuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtY29sXCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgaSA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhkID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtaGRcIiB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbaV0gfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW51bVwiLCAgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgaGQuc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgLyBjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgY2xpY2thYmxlKGhkLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KTsgfSk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0td2Qtc3JjXCIsIGl0LmNvbG9yKTtcbiAgICAgICAgcGlsbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1waWxsLWRvdFwiIH0pO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtdHh0XCIsIHRleHQ6IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lIH0pO1xuICAgICAgICBwaWxsLnNldEF0dHIoXCJ0aXRsZVwiLCBpdC5uYW1lKTtcbiAgICAgICAgY2xpY2thYmxlKHBpbGwsICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShpdC5maWxlKSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFjaGEgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgIChZWVlZLU1NLUREKTogcHJpbWVpcm8gcGVsbyBjYW1pbmhvIGNhblx1MDBGNG5pY28gZW1cbiAgLy8gNTAuRGlcdTAwRTFyaW8vLCBzZW5cdTAwRTNvIHF1YWxxdWVyIG5vdGEgY3VqbyBgZGF0ZTpgIHNlamEgZXNzZSBkaWEuIE51bGwgc2Ugblx1MDBFM28gaG91dmVyLlxuICAvLyAoUmVsYXRcdTAwRjNyaW8vbm90YSBkaVx1MDBFMXJpYSBcdTAwRTkgdW0gcG9yIGRpYSBcdTIxOTIgYWJyZSBvIGV4aXN0ZW50ZSBlbSB2ZXogZGUgY3JpYXIgb3V0cm8uKVxuICBwcml2YXRlIGZpbmREYWlseU5vdGUoa2V5OiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICAgIGNvbnN0IGRpcmVjdCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGApO1xuICAgIGlmIChkaXJlY3QgaW5zdGFuY2VvZiBURmlsZSkgcmV0dXJuIGRpcmVjdDtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmRhdGVkTm90ZXMuZmluZChuID0+IG4uZGF0ZSA9PT0ga2V5KT8uZmlsZSA/PyBudWxsO1xuICB9XG5cbiAgLy8gQWJyZSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWA7IGNyaWEgZW0gNTAuRGlcdTAwRTFyaW8vIFNcdTAwRDMgc2Ugblx1MDBFM28gZXhpc3RpciBuZW5odW1hLlxuICBwcml2YXRlIGFzeW5jIG9wZW5EYWlseU5vdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgIGlmIChleGlzdGluZykgeyBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZXhpc3RpbmcpOyByZXR1cm47IH1cblxuICAgIC8vIE5cdTAwRTNvIGV4aXN0ZSBcdTIxOTIgY3JpYSBubyBjYW1pbmhvIGNhblx1MDBGNG5pY28uXG4gICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfRk9MREVSKSlcbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihEQUlMWV9GT0xERVIpLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIGNvbnN0IFt5LCBtLCBkXSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgY29uc3QgdGl0dWxvID0gbmV3IERhdGUoK3ksICttIC0gMSwgK2QpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICAgIH0pO1xuXG4gICAgLy8gVXNhIG8gdGVtcGxhdGUgZW0gTW9kZWxvcy8gc2UgZXhpc3Rpcjsgc2VuXHUwMEUzbywgZmFsbGJhY2sgZW1idXRpZG8uXG4gICAgY29uc3QgdHBsID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX1RFTVBMQVRFKTtcbiAgICBsZXQgYm9keTogc3RyaW5nO1xuICAgIGlmICh0cGwgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgYm9keSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKHRwbCkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZGF0ZVxccypcXH1cXH0vZywga2V5KVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKnRpdGxlXFxzKlxcfVxcfS9nLCB0aXR1bG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5ID1cbmAtLS1cbm93bmVyOiBXZXJ1c1xuY3JlYXRlZDogJHtrZXl9XG5kYXRlOiAke2tleX1cbnJldmlld2VkOiB0cnVlXG50eXBlOiBkYWlseVxucGVybWlzc2lvbnM6XG4gIHJlYWQ6IFthbGxdXG4gIHdyaXRlOlxuICAgIC0gV2VydXNcbi0tLVxuXG4jICR7dGl0dWxvfVxuXG5gO1xuICAgIH1cbiAgICBjb25zdCBmaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCwgYm9keSk7XG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRzIGRvIGNvZnJlICh0b2RhcyBhcyBwYXN0YXMgZGUgdG9wbykgKyBuYXZlZ2Fkb3IgYW5pbmhhZG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJQYXJhKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1BBUkEpKSByZXR1cm47XG4gICAgLy8gU2UgYSBwYXN0YSBhYmVydGEgbm8gbmF2ZWdhZG9yIGZvaSBvY3VsdGFkYSBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMsIGZlY2hhLlxuICAgIGlmICh0aGlzLm5hdlBhdGggJiYgdGhpcy5pc0hpZGRlbih0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkpKSB0aGlzLm5hdlBhdGggPSBudWxsO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ09GUkVcIiB9KTtcblxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhcmEtZ3JpZFwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpICAgLy8gaWdub3JhIC5vYnNpZGlhbiwgLnRyYXNoLCBldGMuXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgICBjb25zdCBhY3RpdmVSb290ID0gdGhpcy5uYXZQYXRoID8gdGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpIDogbnVsbDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcblxuICAgIGxldCBpZHggPSAwO1xuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGFnZyAgICAgPSBjYWNoZS5ieUZvbGRlci5nZXQoZm9sZGVyLnBhdGgpID8/IEVNUFRZX0FHRztcbiAgICAgIGNvbnN0IG1ldGEgICAgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSB0aGlzLnN1YkZvbGRlcnNPZihmb2xkZXIpLmxlbmd0aCA+IDAgfHwgZmlsZXNJbihmb2xkZXIpLmxlbmd0aCA+IDA7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVJvb3QgPT09IGZvbGRlci5wYXRoO1xuXG4gICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZCB3ZC1wYXJhLWNhcmQgd2QtYW5pbS1pblwiICsgKGlzQWN0aXZlID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICBjYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7aWR4ICogNDB9bXNgO1xuICAgICAgaWR4Kys7XG5cbiAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0XCIgfSk7XG4gICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgfVxuICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtYWNjZW50LWJhclwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBtZXRhLmFjY2VudDtcblxuICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgeyBpdGVtczogYWdnLnVyZ2VuY3ksIG1heDogYWdnLnVyZ2VuY3lNYXggfSk7XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoeyBtZDogYWdnLm1kLCBpbWc6IGFnZy5pbWcgfSkgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCAgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWZvbGRlclwiLCB0ZXh0OiBmb2xkZXIucGF0aCB9KTtcbiAgICAgIGlmIChuYXZpZ2FibGUpIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhhcy1zdWJzXCIsIHRleHQ6IGlzQWN0aXZlID8gXCJmZWNoYXIgXHUyNUJFXCIgOiBcImFicmlyIFx1MjAzQVwiIH0pO1xuXG4gICAgICBpZiAoYWdnLm1kID4gMCkge1xuICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhc2ApO1xuICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKGFnZy5yZXZpZXdlZCAvIGFnZy5tZCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGFnZy5yZWNlbnQpO1xuXG4gICAgICBjbGlja2FibGUoY2FyZCwgKCkgPT4ge1xuICAgICAgICBpZiAobmF2aWdhYmxlKSB7IHRoaXMubmF2UGF0aCA9IGlzQWN0aXZlID8gbnVsbCA6IGZvbGRlci5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9XG4gICAgICAgIGVsc2UgcmV2ZWFsSW5FeHBsb3Jlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IGZpbGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBhaW5lbCBpbmxpbmUgbmF2ZWdcdTAwRTF2ZWwgKGJyZWFkY3J1bWIgKyBzdWJwYXN0YXMgKyBub3RhcyBkYSBwYXN0YSBhdHVhbClcbiAgcHJpdmF0ZSByZW5kZXJCcm93c2VyKHBhcmVudDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy50b3BGb2xkZXJPZihmb2xkZXIucGF0aCk7XG4gICAgY29uc3Qgcm9vdEZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyb290UGF0aCk7XG4gICAgaWYgKCEocm9vdEZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIHJvb3RGb2xkZXIpO1xuXG4gICAgY29uc3QgcGFuZWwgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhbmVsXCIgfSk7XG4gICAgcGFuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAvLyBCcmVhZGNydW1iXG4gICAgY29uc3QgY3J1bWIgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY3J1bWJcIiB9KTtcbiAgICBjb25zdCByZWwgPSBmb2xkZXIucGF0aCA9PT0gcm9vdFBhdGggPyBbXSA6IGZvbGRlci5wYXRoLnNsaWNlKHJvb3RQYXRoLmxlbmd0aCArIDEpLnNwbGl0KFwiL1wiKTtcblxuICAgIGNvbnN0IHJvb3RTZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKHJlbC5sZW5ndGggPT09IDAgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpIH0pO1xuICAgIHJlbmRlckljb24ocm9vdFNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICByb290U2VnLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgIGlmIChyZWwubGVuZ3RoKSBjbGlja2FibGUocm9vdFNlZywgKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICBsZXQgYWNjID0gcm9vdFBhdGg7XG4gICAgcmVsLmZvckVhY2goKHBhcnQsIGkpID0+IHtcbiAgICAgIGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VwXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBjb25zdCBpc0xhc3QgPSBpID09PSByZWwubGVuZ3RoIC0gMTtcbiAgICAgIGFjYyA9IGAke2FjY30vJHtwYXJ0fWA7XG4gICAgICBjb25zdCBzZWdQYXRoID0gYWNjO1xuICAgICAgY29uc3Qgc2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChpc0xhc3QgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpLCB0ZXh0OiBwYXJ0IH0pO1xuICAgICAgaWYgKCFpc0xhc3QpIGNsaWNrYWJsZShzZWcsICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2VnUGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xpY2thYmxlKGNsb3NlLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IG51bGw7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgLy8gQ2FtcG8gZGUgYnVzY2FcbiAgICBjb25zdCBzZWFyY2hXcmFwID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYXJjaC13cmFwXCIgfSk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hXcmFwLmNyZWF0ZUVsKFwiaW5wdXRcIiwge1xuICAgICAgY2xzOiBcIndkLXNlYXJjaFwiLFxuICAgICAgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiZmlsdHJhclx1MjAyNlwiLCB2YWx1ZTogdGhpcy5zZWFyY2hUZXJtIH0sXG4gICAgfSk7XG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtc3ViLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxibCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2QtbGFiZWxcIik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBsYmwuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLW5vdGUtcm93LCAud2Qtbm90ZS1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2Qtbm90ZS1uYW1lLCAud2Qtbm90ZS1jYXJkLW5hbWVcIik/LnRleHRDb250ZW50ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBuYW1lLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJwYXN0YXMgY29tbyBjYXJkc1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIGNvbnN0IHN1YnMgPSB0aGlzLnN1YkZvbGRlcnNPZihmb2xkZXIpO1xuICAgIGlmIChzdWJzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2dyaWQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvai1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNmIG9mIHN1YnMpIHtcbiAgICAgICAgY29uc3QgYWdnICAgID0gY2FjaGUuYnlGb2xkZXIuZ2V0KHNmLnBhdGgpID8/IEVNUFRZX0FHRztcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVhZEZvbGRlclN0YXR1cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBjb3ZlciAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IGRlZXBlciA9IHRoaXMuc3ViRm9sZGVyc09mKHNmKS5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBjdXN0b21JY29uID0gcmVhZEZvbGRlckljb24odGhpcy5hcHAsIHNmKTtcblxuICAgICAgICBjb25zdCBjYXJkID0gc2dyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtY2FyZCB3ZC1zdWItY2FyZCB3ZC1zLSR7c3RhdHVzfWAgfSk7XG4gICAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBzdXRpbCAodmVyc1x1MDBFM28gbWVub3IgcXVlIGFzIHBhc3RhcyBkZSB0b3BvKSBcdTIwMTQgRmFzZSA5LjFcbiAgICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHQgd2QtY292ZXItc3ViXCIgfSk7XG4gICAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIGN1c3RvbUljb24gPz8gXCJcdUQ4M0RcdURDQzFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLWJhZGdlIHdkLWJhZGdlLSR7c3RhdHVzfWAsIHRleHQ6IFNUQVRVU19JQ09OW3N0YXR1c10gfSk7XG4gICAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHsgaXRlbXM6IGFnZy51cmdlbmN5LCBtYXg6IGFnZy51cmdlbmN5TWF4IH0pO1xuXG4gICAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICAgIGlmIChjdXN0b21JY29uKSByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb24gd2Qtc3ViLWljb25cIiB9KSwgY3VzdG9tSWNvbik7XG4gICAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dCh7IG1kOiBhZ2cubWQsIGltZzogYWdnLmltZyB9KSB9KTtcbiAgICAgICAgaWYgKGRlZXBlcikgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3ViLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCB0ZXh0OiBzZi5uYW1lIH0pO1xuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSBsYWJlbC5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiICYmIGFnZy5tZCA+IDApIHtcbiAgICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzYCk7XG4gICAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKGFnZy5yZXZpZXdlZCAvIGFnZy5tZCAqIDEwMCl9JWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY2FyZC5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBhZ2cucmVjZW50KTtcbiAgICAgICAgICBjbGlja2FibGUoY2FyZCwgKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZi5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFycXVpdm9zIGRhIHBhc3RhIGF0dWFsIChub3RhcywgY2FudmFzLCBiYXNlcylcbiAgICBjb25zdCBub3RlcyA9IGZpbGVzSW4oZm9sZGVyKTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHBhbmVsLCBub3Rlcyk7XG5cbiAgICBpZiAoIXN1YnMubGVuZ3RoICYmICFub3Rlcy5sZW5ndGgpXG4gICAgICBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJQYXN0YSB2YXppYS5cIiB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWF0bWFwICh2aWEgcGx1Z2luIEhlYXRtYXAgQ2FsZW5kYXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhdG1hcChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19IRUFUKSkgcmV0dXJuO1xuICAgIGlmIChQbGF0Zm9ybS5pc1Bob25lKSByZXR1cm47ICAgLy8gaGVhdG1hcCAoYW5vIGludGVpcm8pIG9jdWx0YWRvIG5vIGNlbHVsYXJcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtaGVhdC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJBVElWSURBREUgRE8gQ09GUkVcIiB9KTtcblxuICAgIGNvbnN0IHJlbmRlciA9IGdldEhlYXRtYXBSZW5kZXJlcigpO1xuICAgIGlmICghcmVuZGVyKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6ICdBdGl2ZSBvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiBwYXJhIHZlciBhIGF0aXZpZGFkZS4nIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdGFzIGNyaWFkYXMgcG9yIGRpYSAoZG8gY2FjaGUpLCBmaWx0cmFkYXMgcGVsbyBhbm8gY29ycmVudGUuXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBwcmVmaXggPSBTdHJpbmcoeWVhcik7XG4gICAgY29uc3QgZW50cmllczogSGVhdG1hcEVudHJ5W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtkYXRlLCBuXSBvZiB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuY3RpbWVCeURheSkge1xuICAgICAgaWYgKCFkYXRlLnN0YXJ0c1dpdGgocHJlZml4KSkgY29udGludWU7XG4gICAgICBlbnRyaWVzLnB1c2goeyBkYXRlLCBpbnRlbnNpdHk6IG4sIGNvbG9yOiBcImdyZWVuXCIsIGNvbnRlbnQ6IGAke259IG5vdGEocylgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGJveCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhdC1ib3hcIiB9KTtcbiAgICB0cnkge1xuICAgICAgcmVuZGVyKGJveCwge1xuICAgICAgICB5ZWFyLFxuICAgICAgICBjb2xvcnM6IHsgZ3JlZW46IFtcIiMxZTNhMmZcIiwgXCIjMWY2ZjQzXCIsIFwiIzJiYTg1YVwiLCBcIiMzOWQzNTNcIl0gfSxcbiAgICAgICAgc2hvd0N1cnJlbnREYXlCb3JkZXI6IHRydWUsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNlYy5lbXB0eSgpO1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkZhbGhhIGFvIHJlbmRlcml6YXIgbyBoZWF0bWFwLlwiIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBFc3RhdFx1MDBFRHN0aWNhcyBkbyBjb2ZyZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclN0YXRzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NUQVQpKSByZXR1cm47XG5cbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcbiAgICBjb25zdCB0b3RhbE5vdGVzID0gY2FjaGUudG90YWxOb3RlcztcbiAgICBjb25zdCB0b3RhbFJldmlld2VkID0gY2FjaGUudG90YWxSZXZpZXdlZDtcbiAgICAvLyBcImVzdGEgc2VtYW5hXCIgPSBjcmlhXHUwMEU3XHUwMEY1ZXMgbm9zIFx1MDBGQWx0aW1vcyA3IGRpYXMgKGRvIGNhY2hlLCBwb3IgZGF0YSBcdTIxOTIgc2VtcHJlIGZyZXNjbykuXG4gICAgbGV0IGNyZWF0ZWRUaGlzV2VlayA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpOyBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNyZWF0ZWRUaGlzV2VlayArPSBjYWNoZS5jdGltZUJ5RGF5LmdldCh0b0tleShkKSkgPz8gMDtcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsUGN0ID0gdG90YWxOb3RlcyA+IDAgPyBNYXRoLnJvdW5kKHRvdGFsUmV2aWV3ZWQgLyB0b3RhbE5vdGVzICogMTAwKSA6IDA7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJFU1RBVFx1MDBDRFNUSUNBU1wiIH0pO1xuXG4gICAgLy8gTlx1MDBGQW1lcm9zIGdsb2JhaXNcbiAgICBjb25zdCBnbG9iID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWdsb2JhbFwiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZ1wiLCB0ZXh0OiBTdHJpbmcodG90YWxOb3RlcykgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwibm90YXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWcgd2Qtc3RhdC1yZXYtbnVtXCIsIHRleHQ6IGAke2dsb2JhbFBjdH0lYCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJyZXZpc2FkYXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC13ZWVrXCIsIHRleHQ6IGArJHtjcmVhdGVkVGhpc1dlZWt9YCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJlc3RhIHNlbWFuYVwiIH0pO1xuXG4gICAgLy8gQnJlYWtkb3duIHBvciBwYXN0YVxuICAgIGNvbnN0IHRhYmxlID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXRhYmxlXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuXG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGFnZyA9IGNhY2hlLmJ5Rm9sZGVyLmdldChmb2xkZXIucGF0aCkgPz8gRU1QVFlfQUdHO1xuICAgICAgaWYgKGFnZy5tZCA9PT0gMCkgY29udGludWU7XG4gICAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHBjdCA9IE1hdGgucm91bmQoYWdnLnJldmlld2VkIC8gYWdnLm1kICogMTAwKTtcblxuICAgICAgY29uc3Qgcm93ID0gdGFibGUuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcm93XCIgfSk7XG4gICAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAgIGNvbnN0IG5hbWVFbCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1mb2xkZXJcIiB9KTtcbiAgICAgIHJlbmRlckljb24obmFtZUVsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICBuYW1lRWwuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1jb3VudFwiLCB0ZXh0OiBgJHthZ2cubWR9YCB9KTtcblxuICAgICAgY29uc3QgYmFyV3JhcCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXJcIiB9KTtcbiAgICAgIGJhcldyYXAuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhcyAoJHtwY3R9JSlgKTtcbiAgICAgIGNvbnN0IGZpbGwgPSBiYXJXcmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhci1maWxsXCIgfSk7XG4gICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cGN0fSVgO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcGN0XCIsIHRleHQ6IGAke3BjdH0lYCB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTGlzdGEgLyBncmFkZSBkZSBub3RhcyBjb20gdG9nZ2xlIGUgaW5kaWNhZG9yIHJldmlld2VkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyTm90ZXMocGFyZW50OiBIVE1MRWxlbWVudCwgbm90ZXM6IFRGaWxlW10sIGxhYmVsID0gXCJcIikge1xuICAgIGlmICghbm90ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgaXNHcmlkID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPT09IFwiZ3JpZFwiO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5yZXZpZXdGaWx0ZXIgPyBub3Rlcy5maWx0ZXIoZiA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCAhPT0gdHJ1ZSkgOiBub3RlcztcblxuICAgIGNvbnN0IGhkciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtaGRyXCIgfSk7XG4gICAgY29uc3QgY291bnRUeHQgPSB0aGlzLnJldmlld0ZpbHRlclxuICAgICAgPyBgJHtmaWx0ZXJlZC5sZW5ndGh9IHBlbmRlbnRlJHtmaWx0ZXJlZC5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9IC8gJHtub3Rlcy5sZW5ndGh9YFxuICAgICAgOiAobGFiZWwgfHwgYCR7bm90ZXMubGVuZ3RofSBub3RhJHtub3Rlcy5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9YCk7XG4gICAgaGRyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZXMtbGFiZWxcIiwgdGV4dDogY291bnRUeHQgfSk7XG5cbiAgICBjb25zdCB0b2cgPSBoZHIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXZpZXctdG9nZ2xlXCIgfSk7XG4gICAgY29uc3QgYnRuUGVuZCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5yZXZpZXdGaWx0ZXIgPyBcIiB3ZC12aWV3LWFjdGl2ZSB3ZC12aWV3LXBlbmRcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVDQlwiIH0pO1xuICAgIGJ0blBlbmQuc2V0QXR0cihcInRpdGxlXCIsIFwiTW9zdHJhciBzXHUwMEYzIHBlbmRlbnRlcyAoblx1MDBFM28gcmV2aXNhZGFzKVwiKTtcbiAgICBidG5QZW5kLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMucmV2aWV3RmlsdGVyKSk7XG4gICAgY2xpY2thYmxlKGJ0blBlbmQsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgY29uc3QgYnRuTCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIWlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyNjFcIiB9KTtcbiAgICBidG5MLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkxpc3RhXCIpO1xuICAgIGJ0bkwuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcoIWlzR3JpZCkpO1xuICAgIGNsaWNrYWJsZShidG5MLCBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImxpc3RcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhpc0dyaWQpKTtcbiAgICBjbGlja2FibGUoYnRuRywgYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIGlmICghZmlsdGVyZWQubGVuZ3RoKSB7XG4gICAgICBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IHRoaXMucmV2aWV3RmlsdGVyID8gXCJOZW5odW1hIG5vdGEgcGVuZGVudGUgbmVzdGEgcGFzdGEuXCIgOiBcIk5lbmh1bWEgbm90YS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNHcmlkKSB7XG4gICAgICBjb25zdCBncmlkID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jYXJkIHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICAvLyBDYXBhIHBhZHJcdTAwRTNvIHBvciB0aXBvIGRlIGFycXVpdm8gKG5vdGEgLyBjYW52YXMgLyBiYXNlKSBcdTIwMTQgRmFzZSA5LjJcbiAgICAgICAgY29uc3QgY292ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNvdmVyIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKGNvdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtY292ZXItZ2x5cGhcIiB9KSwgZmlsZUdseXBoKGYuZXh0ZW5zaW9uKSk7XG5cbiAgICAgICAgaWYgKGlzTWQpIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSBjYXJkLmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LW1hcmsgd2QtdS0ke3VyZ31gIH0pOyBzZXRJY29uKHcsIFwidHJpYW5nbGUtYWxlcnRcIik7IHcuc2V0QXR0cihcInRpdGxlXCIsIGBVcmdcdTAwRUFuY2lhOiAke3VyZ31gKTsgfVxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgICAgIGlmIChzdCAhPT0gXCJjYW5jZWxsZWRcIikgY2xpY2thYmxlKGNhcmQsICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1yb3cgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IHRpID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLXR5cGVpY29uIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKHRpLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS1kb3Qgd2QtYmFkZ2UtJHtzdH1gIH0pO1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjbGlja2FibGUocm93LCAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZikpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBHclx1MDBFMWZpY28gZGUgY3Jlc2NpbWVudG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJHcm93dGgocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfR1JPVykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNSRVNDSU1FTlRPIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBidG5EYXkgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJkaWFcIiB9KTtcbiAgICBidG5EYXkuc2V0QXR0cihcInRpdGxlXCIsIFwiTm90YXMgY3JpYWRhcyBwb3IgZGlhXCIpO1xuICAgIGJ0bkRheS5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyghdGhpcy5ncm93dGhDdW11bGF0aXZlKSk7XG4gICAgY2xpY2thYmxlKGJ0bkRheSwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkpO1xuICAgIGNsaWNrYWJsZShidG5DdW0sIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSB0cnVlOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIC8vIE5vdGFzIHBvciBkYXRhIGRlIGNyaWFcdTAwRTdcdTAwRTNvIChkbyBjYWNoZSkuXG4gICAgY29uc3QgY291bnRzID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmN0aW1lQnlEYXk7XG5cbiAgICAvLyBcdTAwREFsdGltb3MgTiBkaWFzIChtZW5vcyBubyBjZWx1bGFyKVxuICAgIGNvbnN0IERBWVMgPSBQbGF0Zm9ybS5pc1Bob25lID8gMTUgOiAzMDtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCBjb3VudDogY291bnRzLmdldChrZXkpID8/IDAsIGxhYmVsOiBgJHtkYXl9LyR7bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsID0gZGF5cy5yZWR1Y2UoKHMsIGQpID0+IHMgKyBkLmNvdW50LCAwKTtcbiAgICBjb25zdCB0b2RheUtleSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gTW9kbyBjdW11bGF0aXZvOiBzb21hIGFjdW11bGFkYSBkaWEgYSBkaWFcbiAgICB0eXBlIERheUVudHJ5ID0geyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgZGlzcGxheVZhbDogbnVtYmVyIH07XG4gICAgbGV0IGVudHJpZXM6IERheUVudHJ5W107XG4gICAgaWYgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkge1xuICAgICAgbGV0IGFjYyA9IDA7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiB7IGFjYyArPSBkLmNvdW50OyByZXR1cm4geyAuLi5kLCBkaXNwbGF5VmFsOiBhY2MgfTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+ICh7IC4uLmQsIGRpc3BsYXlWYWw6IGQuY291bnQgfSkpO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5lbnRyaWVzLm1hcChlID0+IGUuZGlzcGxheVZhbCksIDEpO1xuXG4gICAgLy8gTGluaGEgZGUgcmVzdW1vXG4gICAgY29uc3QgaW5mbyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWluZm9cIiB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXRvdGFsXCIsIHRleHQ6IGAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGVudHJpZXNbZW50cmllcy5sZW5ndGggLSAxXS5kaXNwbGF5VmFsIDogdG90YWx9YCB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXBlcmlvZFwiLCB0ZXh0OiB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBgbm90YXMgYWN1bXVsYWRhcyAoJHtEQVlTfSBkaWFzKWAgOiBgbm90YXMgY3JpYWRhcyBub3MgXHUwMEZBbHRpbW9zICR7REFZU30gZGlhc2AgfSk7XG5cbiAgICAvLyBHclx1MDBFMWZpY28gZGUgYmFycmFzXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoeyBrZXksIGNvdW50LCBsYWJlbCwgZGlzcGxheVZhbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBkaXNwbGF5VmFsID09PSAwO1xuICAgICAgY29uc3QgYmFyID0gYmFyQXJlYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhclwiICsgKGlzRW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGlzRW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoZGlzcGxheVZhbCAvIG1heCkgKiAxMDApKX0lYDtcbiAgICAgIGlmICghaXNFbXB0eSkgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtsYWJlbH06ICR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZGlzcGxheVZhbCArIFwiIHRvdGFsXCIgOiBjb3VudCArIFwiIG5vdGEocylcIn1gKTtcblxuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IDcgfHwgaWR4ID09PSAxNCB8fCBpZHggPT09IDIxIHx8IGlkeCA9PT0gMjkgfHwga2V5ID09PSB0b2RheUtleTtcbiAgICAgIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWxibFwiLCB0ZXh0OiBzaG93TGJsID8gbGFiZWwgOiBcIlwiIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgKGRlbGVnYWRvIGFvIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICAvLyBCb3RcdTAwRTNvIGRlIG5hdmVnYVx1MDBFN1x1MDBFM28gXHUyMTkyIGFicmUgYSBhYmEgZGVkaWNhZGEgZG8gVG9kb2lzdCAobyBkYXNoYm9hcmQgXHUwMEU5IG8gaHViKS5cbiAgICBjb25zdCBvcGVuID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW9wZW5idG5cIiB9KTtcbiAgICBzZXRJY29uKG9wZW4sIFwic3F1YXJlLWFycm93LW91dC11cC1yaWdodFwiKTtcbiAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIGEgYWJhIGRvIFRvZG9pc3RcIik7XG4gICAgY2xpY2thYmxlKG9wZW4sIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMucGx1Z2luLm9wZW5Ub2RvaXN0KCk7IH0pO1xuICAgIC8vIExhblx1MDBFN2Fkb3IgZGUgcGFjb3RlcyBjb21wYWN0byAoc29tZSBzZSBuXHUwMEUzbyBob3V2ZXIgcGFjb3RlcykuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJQYWNrYWdlcyhzZWMpO1xuICAgIC8vIERhc2hib2FyZCA9IHNcdTAwRjMgbyBlc3NlbmNpYWwgKEF0cmFzYWRhcyBcdTAwQjcgSG9qZSBcdTAwQjcgUHJcdTAwRjN4aW1vcyA3KS4gXCJEZXBvaXNcIiBmaWNhXG4gICAgLy8gc1x1MDBGMyBuYSBhYmEgZG8gVG9kb2lzdCBcdTIxOTIgcmVjb3JyZW50ZXMgc1x1MDBGMyBhcGFyZWNlbSBhcXVpIHBlcnRvIGRvIGRpYS5cbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlckxpc3Qoc2VjLCBjdHJscywgeyBzaG93TGF0ZXI6IGZhbHNlIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNpbmNyb25pemFcdTAwRTdcdTAwRTNvIChTeW5jdGhpbmcgKyBjb25mbGl0b3MpIFx1MjAxNCB2MC4xMC4wIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHJlc2V0U3luYygpIHtcbiAgICB0aGlzLnN5bmNEYXRhID0gbnVsbDtcbiAgICB0aGlzLnN5bmNGZXRjaGVkQXQgPSAwO1xuICAgIHRoaXMuc3luY0Vycm9yID0gbnVsbDtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZmV0Y2hTeW5jKG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IGJhc2UgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwudHJpbSgpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKCFiYXNlIHx8ICFrZXkgfHwgdGhpcy5zeW5jTG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMuc3luY0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuc3luY0Vycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb2xkZXJzID0gYXdhaXQgc3RHZXQ8U1RGb2xkZXJbXT4oYmFzZSwga2V5LCBcIi9yZXN0L2NvbmZpZy9mb2xkZXJzXCIpO1xuICAgICAgY29uc3Qgd2FudGVkID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQudHJpbSgpO1xuICAgICAgY29uc3QgZm9sZGVyID0gZm9sZGVycy5maW5kKGYgPT4gZi5pZCA9PT0gd2FudGVkKSA/PyBmb2xkZXJzWzBdO1xuICAgICAgaWYgKCFmb2xkZXIpIHRocm93IG5ldyBFcnJvcihcIm5lbmh1bWEgcGFzdGEgY29uZmlndXJhZGEgbm8gU3luY3RoaW5nXCIpO1xuICAgICAgY29uc3QgZmlkID0gZW5jb2RlVVJJQ29tcG9uZW50KGZvbGRlci5pZCk7XG5cbiAgICAgIGNvbnN0IFtkZXZpY2VzLCBjb25ucywgc3RhdHVzLCBzdGF0cywgc3lzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgc3RHZXQ8U1REZXZpY2VbXT4oYmFzZSwga2V5LCBcIi9yZXN0L2NvbmZpZy9kZXZpY2VzXCIpLFxuICAgICAgICBzdEdldDx7IGNvbm5lY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCB7IGNvbm5lY3RlZDogYm9vbGVhbiB9PiB9PihiYXNlLCBrZXksIFwiL3Jlc3Qvc3lzdGVtL2Nvbm5lY3Rpb25zXCIpLFxuICAgICAgICBzdEdldDxTVFN0YXR1cz4oYmFzZSwga2V5LCBgL3Jlc3QvZGIvc3RhdHVzP2ZvbGRlcj0ke2ZpZH1gKSxcbiAgICAgICAgc3RHZXQ8UmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+PihiYXNlLCBrZXksIFwiL3Jlc3Qvc3RhdHMvZGV2aWNlXCIpLmNhdGNoKCgpID0+ICh7fSBhcyBSZWNvcmQ8c3RyaW5nLCB7IGxhc3RTZWVuOiBzdHJpbmcgfT4pKSxcbiAgICAgICAgc3RHZXQ8eyBteUlEOiBzdHJpbmcgfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9zdGF0dXNcIiksXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgcmVtb3RlID0gZGV2aWNlcy5maWx0ZXIoZCA9PiBkLmRldmljZUlEICE9PSBzeXMubXlJRCk7XG4gICAgICBjb25zdCByb3dzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVtb3RlLm1hcChhc3luYyBkID0+IHtcbiAgICAgICAgY29uc3QgYyA9IGF3YWl0IHN0R2V0PFNUQ29tcGxldGlvbj4oYmFzZSwga2V5LCBgL3Jlc3QvZGIvY29tcGxldGlvbj9mb2xkZXI9JHtmaWR9JmRldmljZT0ke2QuZGV2aWNlSUR9YClcbiAgICAgICAgICAuY2F0Y2goKCkgPT4gKHsgY29tcGxldGlvbjogMCwgZ2xvYmFsSXRlbXM6IDAsIG5lZWRJdGVtczogMCwgbmVlZEJ5dGVzOiAwLCBuZWVkRGVsZXRlczogMCB9KSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogZC5uYW1lIHx8IGQuZGV2aWNlSUQuc2xpY2UoMCwgNyksXG4gICAgICAgICAgb25saW5lOiAhIWNvbm5zLmNvbm5lY3Rpb25zW2QuZGV2aWNlSURdPy5jb25uZWN0ZWQsXG4gICAgICAgICAgY29tcGxldGlvbjogYy5jb21wbGV0aW9uLFxuICAgICAgICAgIGdsb2JhbEl0ZW1zOiBjLmdsb2JhbEl0ZW1zID8/IDAsXG4gICAgICAgICAgbmVlZEl0ZW1zOiBjLm5lZWRJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRCeXRlczogYy5uZWVkQnl0ZXMsXG4gICAgICAgICAgbmVlZERlbGV0ZXM6IGMubmVlZERlbGV0ZXMsXG4gICAgICAgICAgbGFzdFNlZW46IHN0YXRzW2QuZGV2aWNlSURdPy5sYXN0U2VlbiA/PyBcIlwiLFxuICAgICAgICB9O1xuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLnN5bmNEYXRhID0ge1xuICAgICAgICBzdGF0ZTogc3RhdHVzLnN0YXRlLFxuICAgICAgICBuZWVkRmlsZXM6IHN0YXR1cy5uZWVkRmlsZXMsXG4gICAgICAgIG5lZWRCeXRlczogc3RhdHVzLm5lZWRCeXRlcyxcbiAgICAgICAgZm9sZGVyTGFiZWw6IGZvbGRlci5sYWJlbCB8fCBmb2xkZXIuaWQsXG4gICAgICAgIGVycm9yczogKHN0YXR1cy5lcnJvcnMgPz8gMCkgKyAoc3RhdHVzLnB1bGxFcnJvcnMgPz8gMCksXG4gICAgICAgIGRldmljZXM6IHJvd3MsXG4gICAgICB9O1xuICAgICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnN5bmNFcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclN5bmMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1lOQykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2Qtc3luYy1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJTSU5DUk9OSVpBXHUwMEM3XHUwMEMzT1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5LnRyaW0oKTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICBjb25zdCByZWZyZXNoID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlZnJlc2hcIiArICh0aGlzLnN5bmNMb2FkaW5nID8gXCIgd2Qtc3BpblwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHJlZnJlc2gsIFwicmVmcmVzaC1jd1wiKTtcbiAgICAgIHJlZnJlc2guc2V0QXR0cihcInRpdGxlXCIsIFwiQXR1YWxpemFyIGVzdGFkbyBkbyBTeW5jdGhpbmdcIik7XG4gICAgICBjbGlja2FibGUocmVmcmVzaCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH0pO1xuICAgIH1cblxuICAgIGlmICgha2V5KSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29uZmlndXJlIGEgVVJMIGUgYSBBUEkga2V5IGRvIFN5bmN0aGluZyBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkLlwiIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zeW5jRXJyb3IpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHkgd2QtdG9kby1lcnJvclwiLCB0ZXh0OiBgRXJybyBhbyBmYWxhciBjb20gbyBTeW5jdGhpbmc6ICR7dGhpcy5zeW5jRXJyb3J9YCB9KTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN5bmNGZXRjaGVkQXQpIHtcbiAgICAgIGlmICghdGhpcy5zeW5jTG9hZGluZykgdm9pZCB0aGlzLmZldGNoU3luYyhmYWxzZSk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ2FycmVnYW5kb1x1MjAyNlwiIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlclN5bmNCb2R5KHNlYywgdGhpcy5zeW5jRGF0YSEpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyQ29uZmxpY3RzKHNlYyk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclN5bmNCb2R5KHNlYzogSFRNTEVsZW1lbnQsIGQ6IFN5bmNEYXRhKSB7XG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWJveFwiIH0pO1xuXG4gICAgLy8gRXN0YWRvIGRhIHBhc3RhLlxuICAgIGNvbnN0IGJ1c3kgPSBkLnN0YXRlID09PSBcInN5bmNpbmdcIiB8fCBkLnN0YXRlID09PSBcInNjYW5uaW5nXCI7XG4gICAgY29uc3QgZmwgPSBib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtZm9sZGVyXCIgfSk7XG4gICAgY29uc3QgZG90ID0gZmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRvdCBcIiArIChkLmVycm9ycyA/IFwid2Qtcy1lcnJcIiA6IGJ1c3kgPyBcIndkLXMtYnVzeVwiIDogXCJ3ZC1zLW9rXCIpIH0pO1xuICAgIGRvdC5zZXRUZXh0KGQuZXJyb3JzID8gXCJcdTI2QTBcIiA6IGJ1c3kgPyBcIlx1MjdGM1wiIDogXCJcdTI1Q0ZcIik7XG4gICAgZmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWZuYW1lXCIsIHRleHQ6IGQuZm9sZGVyTGFiZWwgfSk7XG4gICAgY29uc3Qgc3QgPSBkLnN0YXRlID09PSBcImlkbGVcIiA/IFwiZW0gZGlhXCIgOiBkLnN0YXRlID09PSBcInN5bmNpbmdcIiA/IGBzaW5jcm9uaXphbmRvIFx1MjAxNCAke2QubmVlZEZpbGVzfSBpdGVucyAoJHtodW1hbkJ5dGVzKGQubmVlZEJ5dGVzKX0pYCA6IGQuc3RhdGU7XG4gICAgZmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWZzdGF0ZVwiLCB0ZXh0OiBzdCB9KTtcblxuICAgIC8vIEFwYXJlbGhvcy5cbiAgICBmb3IgKGNvbnN0IGRldiBvZiBkLmRldmljZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1kZXZcIiB9KTtcbiAgICAgIGNvbnN0IG8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRvdCBcIiArIChkZXYub25saW5lID8gXCJ3ZC1zLW9rXCIgOiBcIndkLXMtb2ZmXCIpIH0pO1xuICAgICAgby5zZXRUZXh0KFwiXHUyNUNGXCIpO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kbmFtZVwiLCB0ZXh0OiBkZXYubmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZGNvbXBcIiwgdGV4dDogYCR7TWF0aC5yb3VuZChkZXYuY29tcGxldGlvbil9JWAgfSk7XG4gICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyAmJiBkZXYuZ2xvYmFsSXRlbXMpXG4gICAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZGNvdW50XCIsIHRleHQ6IGAke2Rldi5nbG9iYWxJdGVtcyAtIGRldi5uZWVkSXRlbXN9LyR7ZGV2Lmdsb2JhbEl0ZW1zfWAgfSk7XG4gICAgICBjb25zdCBleHRyYSA9IGRldi5uZWVkRGVsZXRlcyA/IGAke2Rldi5uZWVkRGVsZXRlc30gZXhjbHVzXHUwMEY1ZXNgIDogZGV2Lm5lZWRCeXRlcyA/IGh1bWFuQnl0ZXMoZGV2Lm5lZWRCeXRlcykgOiBcIlwiO1xuICAgICAgaWYgKGV4dHJhKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRwZW5kXCIsIHRleHQ6IGV4dHJhIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kc2VlblwiLCB0ZXh0OiBkZXYub25saW5lID8gXCJvbmxpbmVcIiA6IHJlbFRpbWUoZGV2Lmxhc3RTZWVuKSB9KTtcbiAgICB9XG5cbiAgICBpZiAoZC5lcnJvcnMpIGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1lcnJsaW5lXCIsIHRleHQ6IGBcdTI2QTAgJHtkLmVycm9yc30gZXJybyhzKSBuYSBwYXN0YWAgfSk7XG4gIH1cblxuICAvLyBMaXN0YSBkZSBjXHUwMEYzcGlhcyBkZSBjb25mbGl0byBkbyBTeW5jdGhpbmcgKGFicmlyIC8gYXBhZ2FyIGNvbSBjb25maXJtYVx1MDBFN1x1MDBFM28pLlxuICBwcml2YXRlIHJlbmRlckNvbmZsaWN0cyhzZWM6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgY29uZmxpY3RzID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZXMoKS5maWx0ZXIoZiA9PiBmLm5hbWUuaW5jbHVkZXMoXCIuc3luYy1jb25mbGljdC1cIikpO1xuICAgIGNvbnN0IHdyYXAgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY29uZmxpY3RzXCIgfSk7XG4gICAgd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1zdWJcIiwgdGV4dDogYENvbmZsaXRvcyAoJHtjb25mbGljdHMubGVuZ3RofSlgIH0pO1xuICAgIGlmICghY29uZmxpY3RzLmxlbmd0aCkge1xuICAgICAgd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1ub2NvbmZcIiwgdGV4dDogXCJOZW5odW0gY29uZmxpdG8uIFx1RDgzQ1x1REY4OVwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGYgb2YgY29uZmxpY3RzKSB7XG4gICAgICBjb25zdCByb3cgPSB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWNyb3dcIiB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNuYW1lXCIsIHRleHQ6IGYubmFtZSB9KTtcbiAgICAgIG5hbWUuc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgXCIgKyBmLnBhdGgpO1xuICAgICAgY2xpY2thYmxlKG5hbWUsICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKSk7XG4gICAgICBpZiAodGhpcy5jb25mbGljdENvbmZpcm0gPT09IGYucGF0aCkge1xuICAgICAgICBjb25zdCB5ZXMgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWN5ZXNcIiwgdGV4dDogXCJhcGFnYXI/XCIgfSk7XG4gICAgICAgIGNsaWNrYWJsZSh5ZXMsIGFzeW5jICgpID0+IHsgYXdhaXQgdGhpcy5hcHAudmF1bHQudHJhc2goZiwgZmFsc2UpOyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IG51bGw7IHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7IH0pO1xuICAgICAgICBjb25zdCBubyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25vXCIsIHRleHQ6IFwiY2FuY2VsYXJcIiB9KTtcbiAgICAgICAgY2xpY2thYmxlKG5vLCAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkZWwgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNkZWxcIiB9KTtcbiAgICAgICAgc2V0SWNvbihkZWwsIFwidHJhc2gtMlwiKTtcbiAgICAgICAgZGVsLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFwYWdhciBjXHUwMEYzcGlhIGRlIGNvbmZsaXRvICh2YWkgcGFyYSBhIGxpeGVpcmEpXCIpO1xuICAgICAgICBjbGlja2FibGUoZGVsLCAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gZi5wYXRoOyB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhZGVyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiU2Vjb25kIEJyYWluXCIgfSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcbiAgLy8gQ29udHJvbGFkb3IgXHUwMEZBbmljbyBkbyBUb2RvaXN0IChlc3RhZG8gY29tcGFydGlsaGFkbyBlbnRyZSBkYXNoYm9hcmQgZSBhYmEpLlxuICB0b2RvITogVG9kb2lzdENvbnRyb2xsZXI7XG4gIC8vIENvbnRyb2xhZG9yIFx1MDBGQW5pY28gZGEgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIChsb2cgZG8gY29mcmUgKyBzdGF0czsgdjAuMTMpLlxuICBnYW1lITogR2FtZUNvbnRyb2xsZXI7XG4gIC8vIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKTogbW9udGFkbyAxeCBwb3IgY2ljbG8sIGludmFsaWRhZG8gbm9zIGV2ZW50b3MgZG8gdmF1bHQuXG4gIHByaXZhdGUgdmF1bHRDYWNoZTogVmF1bHRDYWNoZSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIEFncmVnYWRvcyBkbyBjb2ZyZSAodW1hIHBhc3NhZGEpLCByZXVzYWRvcyBwb3IgdG9kYXMgYXMgc2VcdTAwRTdcdTAwRjVlcyBubyByZW5kZXIuXG4gIGdldFZhdWx0Q2FjaGUoKTogVmF1bHRDYWNoZSB7XG4gICAgaWYgKCF0aGlzLnZhdWx0Q2FjaGUpIHRoaXMudmF1bHRDYWNoZSA9IGJ1aWxkVmF1bHRDYWNoZSh0aGlzLmFwcCk7XG4gICAgcmV0dXJuIHRoaXMudmF1bHRDYWNoZTtcbiAgfVxuICBpbnZhbGlkYXRlVmF1bHRDYWNoZSgpIHsgdGhpcy52YXVsdENhY2hlID0gbnVsbDsgfVxuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgIHRoaXMudG9kbyA9IG5ldyBUb2RvaXN0Q29udHJvbGxlcih0aGlzLmFwcCwgdGhpcywgdGhpcyk7XG4gICAgdGhpcy5nYW1lID0gbmV3IEdhbWVDb250cm9sbGVyKHRoaXMuYXBwLCB0aGlzKTtcbiAgICAvLyBBdXRvLXJlZnJlc2ggZG8gVG9kb2lzdDogdmVyaWZpY2EgYSBjYWRhIG1pbnV0bzsgc1x1MDBGMyBidXNjYSBzZSBoXHUwMEUxIHZpZXcgYWJlcnRhIGUgb1xuICAgIC8vIGNhY2hlIHBhc3NvdSBkbyBUVEwgKDUgbWluKS4gcmVnaXN0ZXJJbnRlcnZhbCBsaW1wYSBvIHRpbWVyIG5vIHVubG9hZC5cbiAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwod2luZG93LnNldEludGVydmFsKCgpID0+IHRoaXMudG9kby5tYXliZVJlZnJlc2goKSwgNjBfMDAwKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFLCBsZWFmID0+IG5ldyBEYXNoYm9hcmRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhUT0RPSVNUX1ZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgVG9kb2lzdFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KEdBTUVfVklFV19UWVBFLCBsZWFmID0+IG5ldyBHYW1pZmljYXRpb25WaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsYXlvdXQtZGFzaGJvYXJkXCIsIFwiQWJyaXIgV2VydXMgRGFzaGJvYXJkXCIsICgpID0+IHRoaXMub3BlbigpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsaXN0LWNoZWNrc1wiLCBcIkFicmlyIFRvZG9pc3QgKFdlcnVzKVwiLCAoKSA9PiB0aGlzLm9wZW5Ub2RvaXN0KCkpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInRyb3BoeVwiLCBcIkFicmlyIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAoV2VydXMpXCIsICgpID0+IHRoaXMub3BlbkdhbWUoKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1kYXNoYm9hcmRcIiwgbmFtZTogXCJBYnJpciBEYXNoYm9hcmRcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbigpIH0pO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tdG9kb2lzdFwiLCBuYW1lOiBcIkFicmlyIFRvZG9pc3RcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlblRvZG9pc3QoKSB9KTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLWdhbWVcIiwgbmFtZTogXCJBYnJpciBHYW1pZmljYVx1MDBFN1x1MDBFM29cIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbkdhbWUoKSB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdlcnVzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICAgIC8vIENhcnJlZ2EgbyBsb2cgZG8gY29mcmUgU1x1MDBEMyBkZXBvaXMgZG8gdmF1bHQgaW5kZXhhcjogbm8gb25sb2FkLCBnZXRBYnN0cmFjdEZpbGVCeVBhdGhcbiAgICAvLyBkZXZvbHZlIG51bGwgcGFyYSB1bSBhcnF1aXZvIHF1ZSBleGlzdGUgXHUyMTkyIGNhY2hlYXZhIGV2ZW50cz1bXSAoemVyYXZhIG5vIHJlbG9hZCkuXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xuICAgICAgdGhpcy5nYW1lLmludmFsaWRhdGUoKTtcbiAgICAgIHZvaWQgdGhpcy5nYW1lLmVuc3VyZUxvYWRlZCgpLnRoZW4oKCkgPT4gdGhpcy5nYW1lLnJlcmVuZGVyQWxsKCkpO1xuICAgIH0pO1xuICAgIC8vIFJlLXJlbmRlcml6YSBxdWFuZG8gbyBsb2cgbXVkYSAoaW5jbHVzaXZlIG5vc3NhcyBncmF2YVx1MDBFN1x1MDBGNWVzKS5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJtb2RpZnlcIiwgZiA9PiB7XG4gICAgICBpZiAoZi5wYXRoID09PSBHQU1FX0xPR19QQVRIKSB7IHRoaXMuZ2FtZS5pbnZhbGlkYXRlKCk7IHZvaWQgdGhpcy5nYW1lLmVuc3VyZUxvYWRlZCgpLnRoZW4oKCkgPT4gdGhpcy5nYW1lLnJlcmVuZGVyQWxsKCkpOyB9XG4gICAgfSkpO1xuICB9XG5cbiAgLy8gVG9kYXMgYXMgdmlld3MgKGRhc2hib2FyZCArIGFiYSBUb2RvaXN0KSBhYmVydGFzLCBxdWUgdFx1MDBFQW0gY29udHJvbGFkb3IgVG9kb2lzdC5cbiAgcHJpdmF0ZSB0b2RvVmlld3MoKTogKERhc2hib2FyZFZpZXcgfCBUb2RvaXN0VmlldylbXSB7XG4gICAgY29uc3Qgb3V0OiAoRGFzaGJvYXJkVmlldyB8IFRvZG9pc3RWaWV3KVtdID0gW107XG4gICAgZm9yIChjb25zdCB0IG9mIFtWSUVXX1RZUEUsIFRPRE9JU1RfVklFV19UWVBFXSlcbiAgICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKHQpKSB7XG4gICAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldyB8fCB2IGluc3RhbmNlb2YgVG9kb2lzdFZpZXcpIG91dC5wdXNoKHYpO1xuICAgICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvLyBSZS1idXNjYSBvIFRvZG9pc3QgKGNvbnRyb2xsZXIgXHUwMEZBbmljbyBcdTIxOTIgbm90aWZpY2EgdG9kYXMgYXMgdmlld3MgaW5zY3JpdGFzKS5cbiAgcmVmcmVzaERhc2hib2FyZHMoKSB7XG4gICAgdGhpcy50b2RvLnJlc2V0KCk7XG4gIH1cblxuICAvLyBSZXNldGEgbyBlc3RhZG8gZG8gU3luY3RoaW5nIG5hcyBkYXNoYm9hcmRzIChleC46IHRva2VuL1VSTCBhbHRlcmFkb3MpLlxuICByZWZyZXNoU3luYygpIHtcbiAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEUpKSB7XG4gICAgICBjb25zdCB2ID0gbGVhZi52aWV3O1xuICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEYXNoYm9hcmRWaWV3KSB2LnJlc2V0U3luYygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlLXJlbmRlcml6YSB0b2RhcyBhcyB2aWV3cyBhYmVydGFzIChhcFx1MDBGM3MgbXVkYXIgY29uZmlnIG5hIGFiYSBkZVxuICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRjVlczogb3JkZW0gZGFzIHNlXHUwMEU3XHUwMEY1ZXMsIG9jdWx0YXIvbW9zdHJhciwgZm9udGVzLCBwYWNvdGVzKS5cbiAgcmVyZW5kZXJEYXNoYm9hcmRzKCkge1xuICAgIGZvciAoY29uc3QgdiBvZiB0aGlzLnRvZG9WaWV3cygpKSB2LnJlZnJlc2goKTtcbiAgfVxuXG4gIC8vIE1vc3RyYS9vY3VsdGEgdW1hIHNlXHUwMEU3XHUwMEUzbyAoXCJzZWM6PGlkPlwiKSBvdSBwYXN0YSAoY2FtaW5obykgcG9yIGNoYXZlIGVtIGBoaWRkZW5gLlxuICBhc3luYyBzZXRIaWRkZW4oa2V5OiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xuICAgIGNvbnN0IGhhcyA9IHRoaXMuc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gICAgaWYgKGhpZGRlbiAmJiAhaGFzKSB0aGlzLnNldHRpbmdzLmhpZGRlbi5wdXNoKGtleSk7XG4gICAgZWxzZSBpZiAoIWhpZGRlbiAmJiBoYXMpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gdGhpcy5zZXR0aW5ncy5oaWRkZW4uZmlsdGVyKGsgPT4gayAhPT0ga2V5KTtcbiAgICBlbHNlIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICAvLyBSZW9yZGVuYSB1bWEgc2VcdTAwRTdcdTAwRTNvIGVtIHNlY3Rpb25PcmRlciAoZGlyID0gLTEgc29iZSwgKzEgZGVzY2UpLlxuICBhc3luYyBtb3ZlU2VjdGlvbihpZDogU2VjdGlvbklkLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IG9yZGVyID0gWy4uLnRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyXTtcbiAgICBjb25zdCBpID0gb3JkZXIuaW5kZXhPZihpZCk7XG4gICAgY29uc3QgaiA9IGkgKyBkaXI7XG4gICAgaWYgKGkgPCAwIHx8IGogPCAwIHx8IGogPj0gb3JkZXIubGVuZ3RoKSByZXR1cm47XG4gICAgW29yZGVyW2ldLCBvcmRlcltqXV0gPSBbb3JkZXJbal0sIG9yZGVyW2ldXTtcbiAgICB0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IG9yZGVyO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIGFzeW5jIG1vdmVQYWNrYWdlKGluZGV4OiBudW1iZXIsIGRpcjogbnVtYmVyKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgY29uc3QgaiA9IGluZGV4ICsgZGlyO1xuICAgIGlmIChpbmRleCA8IDAgfHwgaiA8IDAgfHwgaiA+PSBhcnIubGVuZ3RoKSByZXR1cm47XG4gICAgW2FycltpbmRleF0sIGFycltqXV0gPSBbYXJyW2pdLCBhcnJbaW5kZXhdXTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gICAgbGV0IG5lZWRTdE1pZ3JhdGlvbiA9IGZhbHNlOyAgIC8vIGNyZWRlbmNpYWlzIFN5bmN0aGluZyBtaWdyYW5kbyBkYXRhLmpzb24gXHUyMTkyIGxvY2FsU3RvcmFnZVxuICAgIC8vIFNhbmVhbWVudG86IHNlY3Rpb25PcmRlciBjb20gZXhhdGFtZW50ZSBhcyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJnYW1lXCIsIFwidG9kb2lzdFwiLCBcInBhcmFcIiwgXCJzeW5jXCIsIFwiaGVhdG1hcFwiLCBcImdyb3d0aFwiLCBcImNhbGVuZGFyXCJdO1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PFNlY3Rpb25JZD4oKTtcbiAgICBjb25zdCBjbGVhbmVkID0gKHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyIHx8IFtdKS5maWx0ZXIoXG4gICAgICAocyk6IHMgaXMgU2VjdGlvbklkID0+IHZhbGlkLmluY2x1ZGVzKHMgYXMgU2VjdGlvbklkKSAmJiAhc2Vlbi5oYXMocyBhcyBTZWN0aW9uSWQpICYmIChzZWVuLmFkZChzIGFzIFNlY3Rpb25JZCksIHRydWUpXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsaWQpIGlmICghc2Vlbi5oYXModikpIGNsZWFuZWQucHVzaCh2KTtcbiAgICB0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IGNsZWFuZWQ7ICAgLy8gXCJyZXBvcnRzXCIgc29tZSBhcXVpIHNlIGVzdGF2YSBudW1hIGNvbmZpZyBhbnRpZ2FcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5zZXR0aW5ncy5oaWRkZW4pKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IFtdO1xuICAgIC8vIEZvbnRlcyBkYSBTZW1hbmEgKHYwLjEwLjEpOiB2YWxpZGEgYSBsaXN0YTsgc2UgYXVzZW50ZS9pbnZcdTAwRTFsaWRhLCB1c2EgbyBkZWZhdWx0LlxuICAgIGNvbnN0IGNzID0gdGhpcy5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXM7XG4gICAgdGhpcy5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMgPSBBcnJheS5pc0FycmF5KGNzKSAmJiBjcy5sZW5ndGhcbiAgICAgID8gY3MuZmlsdGVyKHMgPT4gcyAmJiB0eXBlb2Ygcy5wYXRoID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgIC5tYXAocyA9PiAoeyBwYXRoOiBzLnBhdGgsIGNvbG9yOiB0eXBlb2Ygcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IHMuY29sb3IgOiBBQ0NFTlRTWzBdLCBvbjogcy5vbiAhPT0gZmFsc2UgfSkpXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MuY2FsZW5kYXJTb3VyY2VzLm1hcChzID0+ICh7IC4uLnMgfSkpO1xuICAgIC8vIFNhbmVhbWVudG8gVG9kb2lzdCAodjAuNy4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID09PSAzID8gMyA6IDc7XG4gICAgY29uc3QgdGYgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnMgPSB7XG4gICAgICBwcm9qZWN0czogQXJyYXkuaXNBcnJheSh0Zj8ucHJvamVjdHMpID8gdGYucHJvamVjdHMgOiBbXSxcbiAgICAgIGxhYmVsczogQXJyYXkuaXNBcnJheSh0Zj8ubGFiZWxzKSA/IHRmLmxhYmVscyA6IFtdLFxuICAgIH07XG4gICAgLy8gRXhpYmlcdTAwRTdcdTAwRTNvIG5hcyBsaW5oYXMgKHYwLjguMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAhPT0gZmFsc2U7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPT09IHRydWU7XG4gICAgLy8gU3luY3RoaW5nICh2MC4xMC4wKSBcdTIwMTQgY3JlZGVuY2lhaXMgc1x1MDBFM28gUE9SLURJU1BPU0lUSVZPOiB2aXZlbSBubyBsb2NhbFN0b3JhZ2VcbiAgICAvLyAoblx1MDBFM28gc2luY3Jvbml6YW0gcGVsbyBkYXRhLmpzb24pLiBNaWdyYVx1MDBFN1x1MDBFM28gKDF4KTogc2UgbyBsb2NhbFN0b3JhZ2UgYWluZGEgblx1MDBFM29cbiAgICAvLyB0ZW0sIGhlcmRhIG8gdmFsb3IgcXVlIGVzdGF2YSBubyBkYXRhLmpzb24gZSByZWdyYXZhICh2ZXIgZmltIGRvIG1cdTAwRTl0b2RvKS5cbiAgICBjb25zdCBsc0dldCA9IChrOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIGNvbnN0IHYgPSB0aGlzLmFwcC5sb2FkTG9jYWxTdG9yYWdlKGspO1xuICAgICAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiID8gdiA6IG51bGw7XG4gICAgfTtcbiAgICBjb25zdCBkYXRhVXJsID0gdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsID09PSBcInN0cmluZ1wiICYmIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgY29uc3QgZGF0YUtleSA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5IDogXCJcIjtcbiAgICBjb25zdCBkYXRhRm9sZGVyID0gdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkIDogXCJcIjtcbiAgICBuZWVkU3RNaWdyYXRpb24gPSBsc0dldChMU19TVF9VUkwpID09PSBudWxsICYmIGxzR2V0KExTX1NUX0tFWSkgPT09IG51bGwgJiYgbHNHZXQoTFNfU1RfRk9MREVSKSA9PT0gbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IGxzR2V0KExTX1NUX1VSTCkgPz8gZGF0YVVybDtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IGxzR2V0KExTX1NUX0tFWSkgPz8gZGF0YUtleTtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gbHNHZXQoTFNfU1RfRk9MREVSKSA/PyBkYXRhRm9sZGVyO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9PT0gdHJ1ZTtcbiAgICAvLyBQYWNvdGVzIGRlIHRhcmVmYXMgKHYwLjEyLjApLlxuICAgIGNvbnN0IHRwID0gdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXMgPSBBcnJheS5pc0FycmF5KHRwKVxuICAgICAgPyB0cC5maWx0ZXIocCA9PiBwICYmIHR5cGVvZiBwLmlkID09PSBcInN0cmluZ1wiKS5tYXAocCA9PiAoe1xuICAgICAgICAgIGlkOiBwLmlkLFxuICAgICAgICAgIG5hbWU6IHR5cGVvZiBwLm5hbWUgPT09IFwic3RyaW5nXCIgPyBwLm5hbWUgOiBcIlwiLFxuICAgICAgICAgIGljb246IHR5cGVvZiBwLmljb24gPT09IFwic3RyaW5nXCIgJiYgcC5pY29uLnRyaW0oKSA/IHAuaWNvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB0YXNrczogQXJyYXkuaXNBcnJheShwLnRhc2tzKSA/IHAudGFza3MuZmlsdGVyKHggPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIpIDogW10sXG4gICAgICAgICAgcHJvamVjdElkOiB0eXBlb2YgcC5wcm9qZWN0SWQgPT09IFwic3RyaW5nXCIgJiYgcC5wcm9qZWN0SWQgPyBwLnByb2plY3RJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkocC5sYWJlbHMpID8gcC5sYWJlbHMuZmlsdGVyKHggPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIpIDogdW5kZWZpbmVkLFxuICAgICAgICB9KSlcbiAgICAgIDogW107XG4gICAgdGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA9IFtcImFsd2F5c1wiLCBcIm1hbnlcIiwgXCJuZXZlclwiXS5pbmNsdWRlcyh0aGlzLnNldHRpbmdzLnBhY2thZ2VDb25maXJtKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnBhY2thZ2VDb25maXJtIDogXCJtYW55XCI7XG4gICAgLy8gR2FtaWZpY2FcdTAwRTdcdTAwRTNvICh2MC4xMykuXG4gICAgdGhpcy5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkID0gdGhpcy5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkICE9PSBmYWxzZTtcbiAgICBjb25zdCBwZiA9IE51bWJlcih0aGlzLnNldHRpbmdzLmdhbWVQZW5hbHR5RmFjdG9yKTtcbiAgICB0aGlzLnNldHRpbmdzLmdhbWVQZW5hbHR5RmFjdG9yID0gTnVtYmVyLmlzRmluaXRlKHBmKSAmJiBwZiA+IDAgPyBwZiA6IDEuNTtcbiAgICB0aGlzLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdCA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdCA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0IDogXCJcIjtcblxuICAgIC8vIE1pZ3JhXHUwMEU3XHUwMEUzbyAxeDogZ3JhdmEgYXMgY3JlZGVuY2lhaXMgbm8gbG9jYWxTdG9yYWdlIGUgYXMgcmVtb3ZlIGRvIGRhdGEuanNvbi5cbiAgICBpZiAobmVlZFN0TWlncmF0aW9uKSBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIC8vIENyZWRlbmNpYWlzIGRvIFN5bmN0aGluZyBzXHUwMEUzbyBwb3ItZGlzcG9zaXRpdm8gXHUyMTkyIGxvY2FsU3RvcmFnZSAoblx1MDBFM28gc2luY3Jvbml6YSkuXG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9VUkwsIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsKTtcbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX0tFWSwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpO1xuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfRk9MREVSLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKTtcbiAgICAvLyBPIGRhdGEuanNvbiAoc2luY3Jvbml6YWRvIHBlbG8gU3luY3RoaW5nKSBOXHUwMEMzTyBsZXZhIGFzIGNyZWRlbmNpYWlzLlxuICAgIGNvbnN0IHNoYXJlZDogUGFydGlhbDxEYXNoU2V0dGluZ3M+ID0geyAuLi50aGlzLnNldHRpbmdzIH07XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdVcmw7XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdBcGlLZXk7XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdGb2xkZXJJZDtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHNoYXJlZCk7XG4gIH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgb3BlblRvZG9pc3QoKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShUT0RPSVNUX1ZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVE9ET0lTVF9WSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgb3BlbkdhbWUoKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShHQU1FX1ZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogR0FNRV9WSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgLy8gVmFycmUgZWxlbWVudG9zIGZsdXR1YW50ZXMgcXVlIHZpdmVtIG5vIGRvY3VtZW50LmJvZHkgKHRvb2x0aXBzL3BvcG92ZXJzKTogc2Ugb1xuICAgIC8vIHBsdWdpbiBmb3IgZGVzYWJpbGl0YWRvIGNvbSB1bSBhYmVydG8sIG8gb25DbG9zZSBkYSB2aWV3IHBvZGUgblx1MDBFM28gcm9kYXIuXG4gICAgdGhpcy50b2RvPy5oaWRlVGlwKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZC10b29sdGlwLCAud2QtcG9wXCIpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlZGljYWRhIGRvIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBIdWIgZG8gVG9kb2lzdCBuYSBcdTAwRTFyZWEgY2VudHJhbCAoblx1MDBFM28gXHUwMEU5IHNpZGViYXIpOiBsYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgKyBhIG1lc21hXG4vLyBsaXN0YSBkZSB0YXJlZmFzIGRvIGRhc2hib2FyZCAodmlhIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pLlxuY2xhc3MgVG9kb2lzdFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgdW5zdWJUb2RvOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVE9ET0lTVF9WSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIlRvZG9pc3RcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGlzdC1jaGVja3NcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLnVuc3ViVG9kbyA9IHRoaXMucGx1Z2luLnRvZG8uc3Vic2NyaWJlKCgpID0+IHRoaXMucmVmcmVzaCgpKTtcbiAgfVxuICBhc3luYyBvbkNsb3NlKCkge1xuICAgIHRoaXMudW5zdWJUb2RvPy4oKTtcbiAgICB0aGlzLnVuc3ViVG9kbyA9IG51bGw7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIiwgXCJ3ZC10b2RvaXN0LXZpZXdcIik7XG5cbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJUb2RvaXN0XCIgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlclBhY2thZ2VzKHJvb3QsIHsgaGVhZGluZzogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlckxpc3Qoc2VjLCBjdHJscyk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZWRpY2FkYSBkZSBHYW1pZmljYVx1MDBFN1x1MDBFM28gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jbGFzcyBHYW1pZmljYXRpb25WaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHVuc3ViOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gR0FNRV9WSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJ0cm9waHlcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLnVuc3ViID0gdGhpcy5wbHVnaW4uZ2FtZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZWZyZXNoKCkpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLmdhbWUuZW5zdXJlTG9hZGVkKCk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdm9pZCB0aGlzLnBsdWdpbi5nYW1lLnJlZnJlc2hQZW5kaW5nKCk7XG4gIH1cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViPy4oKTtcbiAgICB0aGlzLnVuc3ViID0gbnVsbDtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiLCBcIndkLWdhbWUtdmlld1wiKTtcblxuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiIH0pO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1nYW1lLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlBST0dSRVNTT1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5wbHVnaW4uZ2FtZS5yZW5kZXJQYW5lbChzZWMsIGN0cmxzLCB7IGZ1bGw6IHRydWUgfSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIE1vZGFsIGRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzbyBnZW5cdTAwRTlyaWNvIChyZXNvbHZlIHRydWUvZmFsc2UpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgQ29uZmlybUl0ZW0ge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxhYmVscz86IHsgbmFtZTogc3RyaW5nOyBjb2xvcjogc3RyaW5nIH1bXTsgICAvLyBjaGlwcyBvcGNpb25haXMgKGV0aXF1ZXRhcylcbn1cblxuaW50ZXJmYWNlIENvbmZpcm1PcHRzIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgYm9keTogc3RyaW5nO1xuICBpdGVtcz86IENvbmZpcm1JdGVtW107ICAgLy8gbGlzdGEgb3BjaW9uYWwgKGV4LjogdGFyZWZhcyBhIGNyaWFyKVxuICBjdGE6IHN0cmluZzsgICAgICAgICAgICAgLy8gclx1MDBGM3R1bG8gZG8gYm90XHUwMEUzbyBkZSBjb25maXJtYVx1MDBFN1x1MDBFM29cbn1cblxuY2xhc3MgQ29uZmlybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGRvbmUgPSBmYWxzZTtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgb3B0czogQ29uZmlybU9wdHMsIHByaXZhdGUgcmVzb2x2ZTogKG9rOiBib29sZWFuKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoXCJ3ZC1jb25maXJtXCIpO1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogdGhpcy5vcHRzLnRpdGxlIH0pO1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyB0ZXh0OiB0aGlzLm9wdHMuYm9keSB9KTtcbiAgICBpZiAodGhpcy5vcHRzLml0ZW1zPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHVsID0gY29udGVudEVsLmNyZWF0ZUVsKFwidWxcIiwgeyBjbHM6IFwid2QtY29uZmlybS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMub3B0cy5pdGVtcykge1xuICAgICAgICBjb25zdCBsaSA9IHVsLmNyZWF0ZUVsKFwibGlcIik7XG4gICAgICAgIGxpLmNyZWF0ZVNwYW4oeyB0ZXh0OiBpdC50ZXh0IH0pO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgaXQubGFiZWxzID8/IFtdKSB7XG4gICAgICAgICAgY29uc3QgY2hpcCA9IGxpLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY29uZmlybS1sYWJlbFwiIH0pO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gbC5jb2xvcjtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bC5uYW1lfWAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYWN0aW9ucyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtYWN0aW9uc1wiIH0pO1xuICAgIGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSkub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBvayA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwibW9kLWN0YVwiLCB0ZXh0OiB0aGlzLm9wdHMuY3RhIH0pO1xuICAgIG9rLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuZG9uZSA9IHRydWU7IHRoaXMuY2xvc2UoKTsgfTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgICB0aGlzLnJlc29sdmUodGhpcy5kb25lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25maXJtTW9kYWwoYXBwOiBBcHAsIG9wdHM6IENvbmZpcm1PcHRzKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IG5ldyBDb25maXJtTW9kYWwoYXBwLCBvcHRzLCByZXNvbHZlKS5vcGVuKCkpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUG9wLXVwIGRlIGRldGFsaGVzIGRhIHRhcmVmYSAoc1x1MDBGMyBsZWl0dXJhOyBib3RcdTAwRTNvIEVkaXRhciBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvKSBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tEZXRhaWxPcHRzIHtcbiAgdGFzazogVG9kb2lzdFRhc2s7XG4gIHByb2plY3ROYW1lPzogc3RyaW5nO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGVkaXQ6ICgpID0+IHZvaWQ7XG4gIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRGV0YWlsTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LCBwcml2YXRlIG9wdHM6IFRhc2tEZXRhaWxPcHRzKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgdCA9IHRoaXMub3B0cy50YXNrO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLW1vZGFsXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0LmNvbnRlbnQpO1xuXG4gICAgY29uc3QgbWV0YSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGBcdUQ4M0RcdURDQzUgJHtkfS8ke219LyR7eX0ke3QuZHVlPy5pc19yZWN1cnJpbmcgPyBcIiBcdTI3RjNcIiA6IFwiXCJ9YCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0cy5wcm9qZWN0TmFtZSkgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYCMgJHt0aGlzLm9wdHMucHJvamVjdE5hbWV9YCB9KTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcCB3ZC10ZC1sYWJlbFwiIH0pO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgdm9pZCBNYXJrZG93blJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcCwgdC5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIC8vIEVkaXRhciAoZXNxdWVyZGEpIFx1MDBCNyBDb25jbHVpciArIEFicmlyIG5vIFRvZG9pc3QgKGRpcmVpdGEpLlxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IGVkaXQgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MEUgRWRpdGFyXCIgfSk7XG4gICAgZWRpdC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHRoaXMub3B0cy5lZGl0KCk7IH07XG4gICAgYWN0aW9ucy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgZG9uZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcxMyBDb25jbHVpclwiIH0pO1xuICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICBjb25zdCBvcGVuID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQWJyaXIgbm8gVG9kb2lzdFwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodCksIFwiX2JsYW5rXCIpO1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgLyBlZGl0YXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0Zvcm1WYWx1ZXMge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJIDEuLjQgKDQgPSBwMSlcbiAgZHVlRGF0ZTogc3RyaW5nOyAgICAvLyBZWVlZLU1NLUREIChjYWxlbmRcdTAwRTFyaW8pOyBcIlwiID0gc2VtIGRhdGFcbiAgcHJvamVjdElkOiBzdHJpbmc7XG4gIGxhYmVsczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBUYXNrRm9ybU9wdHMge1xuICBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7XG4gIHRhc2s/OiBUb2RvaXN0VGFzaztcbiAgcHJlZmlsbER1ZT86IHN0cmluZztcbiAgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W107XG4gIGxhYmVsczogc3RyaW5nW107XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgc3VibWl0OiAodjogVGFza0Zvcm1WYWx1ZXMpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIHJlbW92ZT86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0Zvcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSB2OiBUYXNrRm9ybVZhbHVlcztcbiAgcHJpdmF0ZSBrbm93bkxhYmVsczogc3RyaW5nW107XG4gIHByaXZhdGUgY29uZmlybURlbCA9IGZhbHNlO1xuICBwcml2YXRlIGFjdGlvbnNFbCE6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IFRhc2tGb3JtT3B0cykge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgdCA9IG9wdHMudGFzaztcbiAgICAvLyBQcmVmaWxsIGRlIGNyaWFcdTAwRTdcdTAwRTNvOiBcImhvamVcIiBcdTIxOTIgZGF0YSBkZSBob2plOyBqXHUwMEUxLVlZWVktTU0tREQgcGFzc2EgZGlyZXRvOyByZXN0byBpZ25vcmEuXG4gICAgY29uc3QgcHJlID0gb3B0cy5wcmVmaWxsRHVlO1xuICAgIGNvbnN0IHByZWZpbGxEYXRlID0gcHJlID09PSBcImhvamVcIiA/IHRvS2V5KG5ldyBEYXRlKCkpXG4gICAgICA6IChwcmUgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocHJlKSA/IHByZSA6IFwiXCIpO1xuICAgIHRoaXMudiA9IHtcbiAgICAgIGNvbnRlbnQ6IHQ/LmNvbnRlbnQgPz8gXCJcIixcbiAgICAgIGRlc2NyaXB0aW9uOiB0Py5kZXNjcmlwdGlvbiA/PyBcIlwiLFxuICAgICAgcHJpb3JpdHk6IHQ/LnByaW9yaXR5ID8/IDEsXG4gICAgICBkdWVEYXRlOiB0Py5kdWU/LmRhdGUgPyB0LmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBwcmVmaWxsRGF0ZSxcbiAgICAgIHByb2plY3RJZDogdD8ucHJvamVjdF9pZCA/PyBcIlwiLFxuICAgICAgbGFiZWxzOiAodD8ubGFiZWxzID8/IFtdKS5zbGljZSgpLFxuICAgIH07XG4gICAgdGhpcy5rbm93bkxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5vcHRzLmxhYmVscywgLi4udGhpcy52LmxhYmVsc10pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLWZvcm1cIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHRoaXMub3B0cy5tb2RlID09PSBcImNyZWF0ZVwiID8gXCJOb3ZhIHRhcmVmYVwiIDogXCJFZGl0YXIgdGFyZWZhXCIpO1xuXG4gICAgLy8gU1x1MDBGMyBuYSBlZGlcdTAwRTdcdTAwRTNvOiBhdGFsaG8gXCJBYnJpciBubyBUb2RvaXN0XCIgbm8gdG9wbywgYW8gbGFkbyBkbyBYIGRlIGZlY2hhci5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiICYmIHRoaXMub3B0cy50YXNrKSB7XG4gICAgICBjb25zdCBvcGVuID0gbW9kYWxFbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1vcGVuLXRvcFwiLCB0ZXh0OiBcIlx1MjE5NyBUb2RvaXN0XCIgfSk7XG4gICAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIG5vIFRvZG9pc3RcIik7XG4gICAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHRoaXMub3B0cy50YXNrISksIFwiX2JsYW5rXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZmllbGQoXCJUXHUwMEVEdHVsb1wiKTtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgY29udGVudC52YWx1ZSA9IHRoaXMudi5jb250ZW50O1xuICAgIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBcIk8gcXVlIHByZWNpc2Egc2VyIGZlaXRvP1wiO1xuICAgIGNvbnRlbnQub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmNvbnRlbnQgPSBjb250ZW50LnZhbHVlOyB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGVudC5mb2N1cygpLCAwKTtcblxuICAgIHRoaXMuZmllbGQoXCJEZXNjcmlcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNvbnN0IGRlc2MgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC10Zi10ZXh0YXJlYVwiIH0pO1xuICAgIGRlc2MudmFsdWUgPSB0aGlzLnYuZGVzY3JpcHRpb247XG4gICAgZGVzYy5wbGFjZWhvbGRlciA9IFwiRGV0YWxoZXMgLyBpbnN0cnVcdTAwRTdcdTAwRjVlcyAobWFya2Rvd24pXCI7XG4gICAgZGVzYy5yb3dzID0gMztcbiAgICBkZXNjLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kZXNjcmlwdGlvbiA9IGRlc2MudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJpb3JpZGFkZVwiKTtcbiAgICBjb25zdCBwcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1wcmktcm93XCIgfSk7XG4gICAgY29uc3QgcmVuZGVyUHJpID0gKCkgPT4ge1xuICAgICAgcHJvdy5lbXB0eSgpO1xuICAgICAgZm9yIChjb25zdCBhcGkgb2YgWzQsIDMsIDIsIDFdKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBUT0RPSVNUX1BSSVthcGldO1xuICAgICAgICBjb25zdCBiID0gcHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLXByaVwiICsgKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgICBiLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgbWV0YS5jb2xvcik7XG4gICAgICAgIGIuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy52LnByaW9yaXR5ID09PSBhcGkpKTtcbiAgICAgICAgY2xpY2thYmxlKGIsICgpID0+IHsgdGhpcy52LnByaW9yaXR5ID0gYXBpOyByZW5kZXJQcmkoKTsgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZW5kZXJQcmkoKTtcblxuICAgIHRoaXMuZmllbGQoXCJEYXRhXCIpO1xuICAgIGNvbnN0IGRyb3cgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWR1ZS1yb3dcIiB9KTtcbiAgICBjb25zdCBkdWUgPSBkcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXQgd2QtdGYtZGF0ZVwiLCB0eXBlOiBcImRhdGVcIiB9KTtcbiAgICBkdWUudmFsdWUgPSB0aGlzLnYuZHVlRGF0ZTtcbiAgICBkdWUub25jaGFuZ2UgPSAoKSA9PiB7IHRoaXMudi5kdWVEYXRlID0gZHVlLnZhbHVlOyB9O1xuICAgIGNvbnN0IGNsciA9IGRyb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtdGYtZHVlLWNsZWFyXCIsIHRleHQ6IFwic2VtIGRhdGFcIiB9KTtcbiAgICBjbHIub25jbGljayA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBcIlwiOyBkdWUudmFsdWUgPSBcIlwiOyB9O1xuICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNsaXF1ZSBwYXJhIGFicmlyIG8gY2FsZW5kXHUwMEUxcmlvLiBWYXppbyA9IHNlbSBkYXRhLlwiIH0pO1xuICAgIGlmICh0aGlzLm9wdHMudGFzaz8uZHVlPy5pc19yZWN1cnJpbmcpXG4gICAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXdhcm5cIiwgdGV4dDogXCJcdTI3RjMgVGFyZWZhIHJlY29ycmVudGUgXHUyMDE0IG11ZGFyIGEgZGF0YSBmaXhhIHBvZGUgZW5jZXJyYXIgYSByZWNvcnJcdTAwRUFuY2lhLlwiIH0pO1xuXG4gICAgdGhpcy5maWVsZChcIlByb2pldG9cIik7XG4gICAgY29uc3Qgc2VsID0gY29udGVudEVsLmNyZWF0ZUVsKFwic2VsZWN0XCIsIHsgY2xzOiBcIndkLXRmLXNlbGVjdFwiIH0pO1xuICAgIGNvbnN0IGluYm94ID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogXCJFbnRyYWRhIChJbmJveClcIiwgdmFsdWU6IFwiXCIgfSk7XG4gICAgaWYgKCF0aGlzLnYucHJvamVjdElkKSBpbmJveC5zZWxlY3RlZCA9IHRydWU7XG4gICAgZm9yIChjb25zdCBwIG9mIHRoaXMub3B0cy5wcm9qZWN0cykge1xuICAgICAgY29uc3QgbyA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IHAubmFtZSwgdmFsdWU6IHAuaWQgfSk7XG4gICAgICBpZiAocC5pZCA9PT0gdGhpcy52LnByb2plY3RJZCkgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICAgIHNlbC5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LnByb2plY3RJZCA9IHNlbC52YWx1ZTsgfTtcblxuICAgIHRoaXMuZmllbGQoXCJFdGlxdWV0YXNcIik7XG4gICAgY29uc3QgbHdyYXAgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsc1wiIH0pO1xuICAgIGlmICh0aGlzLmtub3duTGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcmVuZGVyTGFiZWxzID0gKCkgPT4ge1xuICAgICAgICBsd3JhcC5lbXB0eSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5rbm93bkxhYmVscykge1xuICAgICAgICAgIGNvbnN0IG9uID0gdGhpcy52LmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgICBjb25zdCBjaGlwID0gbHdyYXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgICBjbGlja2FibGUoY2hpcCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMudi5sYWJlbHMuaW5kZXhPZihsKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHRoaXMudi5sYWJlbHMuc3BsaWNlKGksIDEpOyBlbHNlIHRoaXMudi5sYWJlbHMucHVzaChsKTtcbiAgICAgICAgICAgIHJlbmRlckxhYmVscygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVuZGVyTGFiZWxzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGx3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiTmVuaHVtYSBldGlxdWV0YSBubyBUb2RvaXN0IGFpbmRhLlwiIH0pO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aW9uc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1hY3Rpb25zXCIgfSk7XG4gICAgdGhpcy5yZW5kZXJBY3Rpb25zKCk7XG4gIH1cblxuICBwcml2YXRlIGZpZWxkKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxcIiwgdGV4dDogbGFiZWwgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFjdGlvbnMoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuYWN0aW9uc0VsO1xuICAgIGEuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLmNvbmZpcm1EZWwgJiYgdGhpcy5vcHRzLnJlbW92ZSkge1xuICAgICAgYS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLWNvbmZpcm1cIiwgdGV4dDogXCJFeGNsdWlyIGVzdGEgdGFyZWZhP1wiIH0pO1xuICAgICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgICBjb25zdCB5ZXMgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgeWVzLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHllcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMucmVtb3ZlISgpKSB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGVsc2UgeyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH1cbiAgICAgIH07XG4gICAgICBjb25zdCBubyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgICBuby5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIikge1xuICAgICAgY29uc3QgZGVsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSB0cnVlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICB9XG5cbiAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICBjb25zdCBjYW5jZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgIGNhbmNlbC5vbmNsaWNrID0gKCkgPT4gdGhpcy5jbG9zZSgpO1xuICAgIGNvbnN0IHNhdmUgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJTYWx2YXJcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBzYXZlLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnYuY29udGVudCA9IHRoaXMudi5jb250ZW50LnRyaW0oKTtcbiAgICAgIGlmICghdGhpcy52LmNvbnRlbnQpIHsgbmV3IE5vdGljZShcIkRcdTAwRUEgdW0gdFx1MDBFRHR1bG8gXHUwMEUwIHRhcmVmYS5cIik7IHJldHVybjsgfVxuICAgICAgc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnN1Ym1pdCh0aGlzLnYpKSB0aGlzLmNsb3NlKCk7XG4gICAgICBlbHNlIHNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlIGNvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBXZXJ1c1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgLy8gUHJvamV0b3MgZG8gVG9kb2lzdCAocGFyYSBvcyBkcm9wZG93bnMgZG9zIHBhY290ZXMpLiBCdXNjYWRvcyAxeDsgcXVhbmRvXG4gIC8vIGNoZWdhbSwgcmUtcmVuZGVyaXphIGEgYWJhIHBhcmEgcHJlZW5jaGVyIG9zIHNlbGVjdHMuXG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gfCBudWxsID0gbnVsbDtcbiAgLy8gRXRpcXVldGFzIGRvIFRvZG9pc3QgKGNoaXBzIHBvciBwYWNvdGUpLiBNZXNtYSBlc3RyYXRcdTAwRTlnaWE6IGJ1c2NhIDF4LlxuICBwcml2YXRlIGxhYmVsczogVG9kb2lzdExhYmVsW10gfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGFwcCwgcGx1Z2luKTsgfVxuXG4gIGRpc3BsYXkoKSB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRvIGRhc2hib2FyZFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vZG8gY29tcGFjdG9cIilcbiAgICAgIC5zZXREZXNjKFwiTGF5b3V0IG1haXMgZGVuc28sIGNvbSBtZW5vcyBlc3BhXHUwMEU3YW1lbnRvIGVudHJlIG9zIGVsZW1lbnRvcy5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY29tcGFjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmQgKHZpc2liaWxpZGFkZSArIG9yZGVtKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTZVx1MDBFN1x1MDBGNWVzIGRvIGRhc2hib2FyZFwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkF0aXZlL2Rlc2F0aXZlIGNhZGEgc2VcdTAwRTdcdTAwRTNvIGUgYWp1c3RlIGEgb3JkZW0gZW0gcXVlIGFwYXJlY2VtIG5hIGRhc2hib2FyZC5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IG9yZGVyID0gcGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcjtcbiAgICBvcmRlci5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFNFQ1RJT05fTEFCRUxbaWRdKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy11cFwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBjaW1hXCIpLnNldERpc2FibGVkKGkgPT09IDApXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsIC0xKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy1kb3duXCIpLnNldFRvb2x0aXAoXCJNb3ZlciBwYXJhIGJhaXhvXCIpLnNldERpc2FibGVkKGkgPT09IG9yZGVyLmxlbmd0aCAtIDEpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKFwic2VjOlwiICsgaWQpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgYXdhaXQgcGx1Z2luLnNldEhpZGRlbihcInNlYzpcIiArIGlkLCAhdik7IH0pKTtcbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKVwiIH0pO1xuICAgIGNvbnN0IHRvcEZvbGRlcnMgPSAodGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpLmNoaWxkcmVuXG4gICAgICAuZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgIWMubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgYXMgVEZvbGRlcltdKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgaWYgKCF0b3BGb2xkZXJzLmxlbmd0aCkge1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgZGUgdG9wbyBubyBjb2ZyZS5cIiB9KTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIHRvcEZvbGRlcnMpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShmLm5hbWUpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJWaXNcdTAwRUR2ZWxcIilcbiAgICAgICAgICAuc2V0VmFsdWUoIXBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoZi5wYXRoKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oZi5wYXRoLCAhdik7IH0pKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRm9udGVzIGRhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRm9udGVzIGRvcyBSZWxhdFx1MDBGM3Jpb3NcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJQYXN0YXMgY3VqYXMgbm90YXMgdmlyYW0gY2FyZHMgbm9zIGRpYXMgZGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcyAocG9zaVx1MDBFN1x1MDBFM28gcGVsYSBkYXRhIGRhIG5vdGEpLiBDYWRhIGZvbnRlIHRlbSB1bWEgY29yIHByXHUwMEYzcHJpYS5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNyY3MgPSBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHNyY3MuZm9yRWFjaChzID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShzLnBhdGgpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJBdGl2YVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZShzLm9uKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5vbiA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZENvbG9yUGlja2VyKGMgPT4gY1xuICAgICAgICAgIC5zZXRWYWx1ZShzLmNvbG9yKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5jb2xvciA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwidHJhc2gtMlwiKS5zZXRUb29sdGlwKFwiUmVtb3ZlciBmb250ZVwiKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMgPSBzcmNzLmZpbHRlcih4ID0+IHggIT09IHMpO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlZCA9IG5ldyBTZXQoc3Jjcy5tYXAocyA9PiBzLnBhdGgpKTtcbiAgICBjb25zdCBhdmFpbGFibGUgPSBhbGxGb2xkZXJQYXRocyh0aGlzLmFwcCkuZmlsdGVyKHAgPT4gIXVzZWQuaGFzKHApKTtcbiAgICBpZiAoYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiQWRpY2lvbmFyIGZvbnRlXCIpXG4gICAgICAgIC5zZXREZXNjKFwiRXNjb2xoYSB1bWEgcGFzdGEgZG8gY29mcmUgcGFyYSBhbGltZW50YXIgYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zLlwiKVxuICAgICAgICAuYWRkRHJvcGRvd24oZCA9PiB7XG4gICAgICAgICAgZC5hZGRPcHRpb24oXCJcIiwgXCJFc2NvbGhhIHVtYSBwYXN0YVx1MjAyNlwiKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgYXZhaWxhYmxlKSBkLmFkZE9wdGlvbihwLCBwKTtcbiAgICAgICAgICBkLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgaWYgKCF2KSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IEFDQ0VOVFNbcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5sZW5ndGggJSBBQ0NFTlRTLmxlbmd0aF07XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLnB1c2goeyBwYXRoOiB2LCBjb2xvciwgb246IHRydWUgfSk7XG4gICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJHYW1pZmljYVx1MDBFN1x1MDBFM29cIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJUYXJlZmFzIGNvbmNsdVx1MDBFRGRhcyB2aXJhbSBYUC9uXHUwMEVEdmVsL3N0cmVhayAoYWJhIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyArIGZhaXhhIG5vIGRhc2hib2FyZCkuIFxcXCJTYWx2YXIgY29uY2x1XHUwMEVEZGFzXFxcIiBncmF2YSBubyBsb2cgZG8gY29mcmUgKDIwLkFyZWFzL0dhbWlmaWNhXHUwMEU3XHUwMEUzby5tZCkgZSBsaW1wYSBkbyBUb2RvaXN0LiBPIGJvdFx1MDBFM28gXHUyNzE3IG1hcmNhIHVtYSB0YXJlZmEgY29tbyBuXHUwMEUzbyBmZWl0YSAocHVuaVx1MDBFN1x1MDBFM28gZW0gWFApIGUgYSBhcGFnYS5cIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBdGl2YXIgZ2FtaWZpY2FcdTAwRTdcdTAwRTNvXCIpXG4gICAgICAuc2V0RGVzYyhcIk1vc3RyYSBhIHNlXHUwMEU3XHUwMEUzby9hYmEgZGUgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIGUgbyBib3RcdTAwRTNvIFxcXCJuXHUwMEUzbyBmZWl0YVxcXCIgbmFzIHRhcmVmYXMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZCA9IHY7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICBwbHVnaW4uZ2FtZS5yZXJlbmRlckFsbCgpO1xuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUGVuYWxpZGFkZSBkbyBcXFwiblx1MDBFM28gZmVpdG9cXFwiXCIpXG4gICAgICAuc2V0RGVzYyhcIk11bHRpcGxpY2EgYSBiYXNlIGRhIHByaW9yaWRhZGUgYW8gbWFyY2FyIGNvbW8gblx1MDBFM28gZmVpdGEuIEV4LjogMSw1ID0gcGVyZGUgNTAlIGEgbWFpcyBkbyBxdWUgZ2FuaGFyaWEuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHRcbiAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiMS41XCIpXG4gICAgICAgIC5zZXRWYWx1ZShTdHJpbmcocGx1Z2luLnNldHRpbmdzLmdhbWVQZW5hbHR5RmFjdG9yKSlcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIGNvbnN0IG4gPSBOdW1iZXIodi5yZXBsYWNlKFwiLFwiLCBcIi5cIikpO1xuICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikgJiYgbiA+IDApIHsgcGx1Z2luLnNldHRpbmdzLmdhbWVQZW5hbHR5RmFjdG9yID0gbjsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9XG4gICAgICAgIH0pKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYWNvdGVzIGRlIHRhcmVmYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiUGFjb3RlcyBkZSB0YXJlZmFzXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiQ29uanVudG9zIGRlIHRhcmVmYXMgcXVlIHZvY1x1MDBFQSBsYW5cdTAwRTdhIG5vIFRvZG9pc3QgY29tIHVtIGNsaXF1ZSAobmEgYWJhIFRvZG9pc3Qgb3Ugbm8gZGFzaGJvYXJkKSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS4gVW1hIHRhcmVmYSBwb3IgbGluaGEuIFVzZSBAZXRpcXVldGEgbnVtYSBsaW5oYSBwYXJhIGFwbGljYXIgdW1hIGV0aXF1ZXRhIHNcdTAwRjMgXHUwMEUwcXVlbGEgdGFyZWZhLlwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm1hciBhbnRlcyBkZSBsYW5cdTAwRTdhclwiKVxuICAgICAgLnNldERlc2MoXCJQZWRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzbyAoY29tIGEgbGlzdGEgZGUgdGFyZWZhcykgYW50ZXMgZGUgY3JpYXIuIFxcXCJTZW1wcmVcXFwiIGNvbmZpcm1hIGF0XHUwMEU5IHBhcmEgMSB0YXJlZmEgXHUyMDE0IFx1MDBGQXRpbCBwYXJhIHRlc3RhcjsgZGVwb2lzIG11ZGUgcGFyYSBOdW5jYS5cIilcbiAgICAgIC5hZGREcm9wZG93bihkID0+IGRcbiAgICAgICAgLmFkZE9wdGlvbihcImFsd2F5c1wiLCBcIlNlbXByZVwiKVxuICAgICAgICAuYWRkT3B0aW9uKFwibWFueVwiLCBcIlNcdTAwRjMgbXVpdGFzICg+IDUgdGFyZWZhcylcIilcbiAgICAgICAgLmFkZE9wdGlvbihcIm5ldmVyXCIsIFwiTnVuY2FcIilcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSlcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBwbHVnaW4uc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gPSB2IGFzIERhc2hTZXR0aW5nc1tcInBhY2thZ2VDb25maXJtXCJdOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH0pKTtcblxuICAgIGNvbnN0IHRva2VuID0gcGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgLy8gQnVzY2EgcHJvamV0b3MgZSBldGlxdWV0YXMgdW1hIHZleiAoZHJvcGRvd25zICsgY2hpcHMpOyBhbyBjaGVnYXIsIHJlLXJlbmRlcml6YS5cbiAgICBpZiAodG9rZW4gJiYgdGhpcy5wcm9qZWN0cyA9PT0gbnVsbCkge1xuICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLnRoZW4ocHMgPT4geyB0aGlzLnByb2plY3RzID0gcHM7IHRoaXMuZGlzcGxheSgpOyB9KS5jYXRjaCgoKSA9PiB7IHRoaXMucHJvamVjdHMgPSBbXTsgfSk7XG4gICAgfVxuICAgIGlmICh0b2tlbiAmJiB0aGlzLmxhYmVscyA9PT0gbnVsbCkge1xuICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS50aGVuKGxzID0+IHsgdGhpcy5sYWJlbHMgPSBsczsgdGhpcy5kaXNwbGF5KCk7IH0pLmNhdGNoKCgpID0+IHsgdGhpcy5sYWJlbHMgPSBbXTsgfSk7XG4gICAgfVxuXG4gICAgLy8gUG9wb3ZlciBkZSBldGlxdWV0YXMgZGUgdW0gcGFjb3RlIChjaGlwcyB0b2dnbGUgY29tIGEgY29yIGRvIFRvZG9pc3QpLlxuICAgIGNvbnN0IG9wZW5MYWJlbHNQb3BvdmVyID0gKGFuY2hvcjogSFRNTEVsZW1lbnQsIHBrZzogVGFza1BhY2thZ2UsIHJlZnJlc2g6ICgpID0+IHZvaWQpID0+XG4gICAgICBvcGVuUG9wb3ZlcihhbmNob3IsIGJvZHkgPT4ge1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3AtdGl0bGVcIiwgdGV4dDogXCJFdGlxdWV0YXMgZG8gcGFjb3RlXCIgfSk7XG4gICAgICAgIGlmICghdG9rZW4pIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIgfSk7IHJldHVybjsgfVxuICAgICAgICBpZiAodGhpcy5sYWJlbHMgPT09IG51bGwpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG9cdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGlmICghdGhpcy5sYWJlbHMubGVuZ3RoKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QuXCIgfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBjaGlwcyA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC1jaGlwc1wiIH0pO1xuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY2hpcHMuZW1wdHkoKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5sYWJlbHMhKSB7XG4gICAgICAgICAgICBjb25zdCBvbiA9IChwa2cubGFiZWxzID8/IFtdKS5pbmNsdWRlcyhsLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY2hpcCA9IGNoaXBzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDSztcbiAgICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsLm5hbWV9YCB9KTtcbiAgICAgICAgICAgIGNsaWNrYWJsZShjaGlwLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGN1ciA9IHBrZy5sYWJlbHMgPz8gW107XG4gICAgICAgICAgICAgIGNvbnN0IGkgPSBjdXIuaW5kZXhPZihsLm5hbWUpO1xuICAgICAgICAgICAgICBpZiAoaSA+PSAwKSBjdXIuc3BsaWNlKGksIDEpOyBlbHNlIGN1ci5wdXNoKGwubmFtZSk7XG4gICAgICAgICAgICAgIHBrZy5sYWJlbHMgPSBjdXIubGVuZ3RoID8gY3VyIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgICAgICAgIHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LCB7IGNsczogXCJ3ZC1wb3AtbGFiZWxzXCIgfSk7XG5cbiAgICAvLyBQb3BvdmVyIGRlIHRhcmVmYXMgZGUgdW0gcGFjb3RlICh0ZXh0YXJlYTsgcGVyc2lzdGUgbm8gaW5wdXQgZSBhbyBmZWNoYXIpLlxuICAgIGNvbnN0IG9wZW5UYXNrc1BvcG92ZXIgPSAoYW5jaG9yOiBIVE1MRWxlbWVudCwgcGtnOiBUYXNrUGFja2FnZSwgcmVmcmVzaDogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgbGV0IHRhOiBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgICAgb3BlblBvcG92ZXIoYW5jaG9yLCBib2R5ID0+IHtcbiAgICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLXRpdGxlXCIsIHRleHQ6IFwiVGFyZWZhcyBkbyBwYWNvdGVcIiB9KTtcbiAgICAgICAgdGEgPSBib2R5LmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtcGtnLXRhc2tzXCIgfSk7XG4gICAgICAgIHRhLnZhbHVlID0gcGtnLnRhc2tzLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIHRhLnBsYWNlaG9sZGVyID0gXCJVbWEgdGFyZWZhIHBvciBsaW5oYSAoZXguOiBCZWJlciBcdTAwRTFndWEpXCI7XG4gICAgICAgIHRhLnJvd3MgPSA2O1xuICAgICAgICB0YS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHBrZy50YXNrcyA9IHRhLnZhbHVlLnNwbGl0KFwiXFxuXCIpLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJVbWEgcG9yIGxpbmhhIFx1MDBCNyBAZXRpcXVldGEgbWFyY2Egc1x1MDBGMyBhcXVlbGEgdGFyZWZhIFx1MDBCNyBmZWNoYSBhbyBjbGljYXIgZm9yYSBvdSBFc2MuXCIgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGEuZm9jdXMoKSwgMCk7XG4gICAgICB9LCB7IGNsczogXCJ3ZC1wb3AtdGFza3NcIiwgd2lkdGg6IDMyMCwgb25DbG9zZTogKCkgPT4geyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0gfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBrZ3MgPSBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGNvbnN0IGxpc3QgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWxpc3RcIiB9KTtcbiAgICBwa2dzLmZvckVhY2goKHBrZywgaWR4KSA9PiB7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctcm93XCIgfSk7XG5cbiAgICAgIC8vIFx1MDBDRGNvbmUgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIgZGUgcGFsZXRhKS5cbiAgICAgIGNvbnN0IGljb25CdG4gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbnRyaWdnZXJcIiB9KTtcbiAgICAgIGljb25CdG4uc2V0QXR0cihcInRpdGxlXCIsIFwiXHUwMENEY29uZSBkbyBwYWNvdGVcIik7XG4gICAgICBjb25zdCBmaWxsSWNvbiA9ICgpID0+IHtcbiAgICAgICAgaWNvbkJ0bi5lbXB0eSgpO1xuICAgICAgICBpZiAocGtnLmljb24pIHJlbmRlckljb24oaWNvbkJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29cIiB9KSwgcGtnLmljb24pO1xuICAgICAgICBlbHNlIGljb25CdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvLWVtcHR5XCIsIHRleHQ6IFwiK1wiIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxJY29uKCk7XG4gICAgICBjbGlja2FibGUoaWNvbkJ0biwgKCkgPT4gb3Blbkljb25Qb3BvdmVyKGljb25CdG4sIHBrZy5pY29uLCBhc3luYyBpYyA9PiB7XG4gICAgICAgIHBrZy5pY29uID0gaWM7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyBmaWxsSWNvbigpO1xuICAgICAgfSkpO1xuXG4gICAgICAvLyBOb21lLlxuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXBrZy1uYW1lLWlucHV0XCIsIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIk5vbWUgZG8gcGFjb3RlXCIgfSB9KTtcbiAgICAgIG5hbWUudmFsdWUgPSBwa2cubmFtZTtcbiAgICAgIG5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGFzeW5jICgpID0+IHsgcGtnLm5hbWUgPSBuYW1lLnZhbHVlOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH0pO1xuICAgICAgbmFtZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKSk7XG5cbiAgICAgIC8vIFByb2pldG8uXG4gICAgICBjb25zdCBwcm9qID0gcm93LmNyZWF0ZUVsKFwic2VsZWN0XCIsIHsgY2xzOiBcIndkLXBrZy1wcm9qIGRyb3Bkb3duXCIgfSk7XG4gICAgICBjb25zdCBhZGRPcHQgPSAodjogc3RyaW5nLCB0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgbyA9IHByb2ouY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiB0LCB2YWx1ZTogdiB9KTtcbiAgICAgICAgaWYgKChwa2cucHJvamVjdElkID8/IFwiXCIpID09PSB2KSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgICBhZGRPcHQoXCJcIiwgXCJFbnRyYWRhXCIpO1xuICAgICAgZm9yIChjb25zdCBwIG9mICh0aGlzLnByb2plY3RzID8/IFtdKSkgYWRkT3B0KHAuaWQsIHAubmFtZSk7XG4gICAgICBwcm9qLm9uY2hhbmdlID0gYXN5bmMgKCkgPT4geyBwa2cucHJvamVjdElkID0gcHJvai52YWx1ZSB8fCB1bmRlZmluZWQ7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfTtcblxuICAgICAgLy8gRXRpcXVldGFzIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyKS5cbiAgICAgIGNvbnN0IGxibEJ0biA9IHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC1wa2ctY2hpcC1idG5cIiB9KTtcbiAgICAgIGNvbnN0IGZpbGxMYmwgPSAoKSA9PiB7XG4gICAgICAgIGxibEJ0bi5lbXB0eSgpO1xuICAgICAgICBzZXRJY29uKGxibEJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1idG4taWNvXCIgfSksIFwidGFnXCIpO1xuICAgICAgICBsYmxCdG4uY3JlYXRlU3Bhbih7IHRleHQ6IFwiRXRpcXVldGFzXCIgfSk7XG4gICAgICAgIGNvbnN0IG4gPSBwa2cubGFiZWxzPy5sZW5ndGggPz8gMDtcbiAgICAgICAgaWYgKG4pIGxibEJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1jb3VudFwiLCB0ZXh0OiBTdHJpbmcobikgfSk7XG4gICAgICB9O1xuICAgICAgZmlsbExibCgpO1xuICAgICAgbGJsQnRuLm9uY2xpY2sgPSAoKSA9PiBvcGVuTGFiZWxzUG9wb3ZlcihsYmxCdG4sIHBrZywgZmlsbExibCk7XG5cbiAgICAgIC8vIFRhcmVmYXMgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIpLlxuICAgICAgY29uc3QgdGFza0J0biA9IHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC1wa2ctY2hpcC1idG5cIiB9KTtcbiAgICAgIGNvbnN0IGZpbGxUYXNrID0gKCkgPT4ge1xuICAgICAgICB0YXNrQnRuLmVtcHR5KCk7XG4gICAgICAgIHNldEljb24odGFza0J0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1idG4taWNvXCIgfSksIFwibGlzdFwiKTtcbiAgICAgICAgdGFza0J0bi5jcmVhdGVTcGFuKHsgdGV4dDogXCJUYXJlZmFzXCIgfSk7XG4gICAgICAgIGNvbnN0IG4gPSBwa2cudGFza3MuZmlsdGVyKHMgPT4gcy50cmltKCkpLmxlbmd0aDtcbiAgICAgICAgaWYgKG4pIHRhc2tCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogU3RyaW5nKG4pIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxUYXNrKCk7XG4gICAgICB0YXNrQnRuLm9uY2xpY2sgPSAoKSA9PiBvcGVuVGFza3NQb3BvdmVyKHRhc2tCdG4sIHBrZywgZmlsbFRhc2spO1xuXG4gICAgICAvLyBSZW9yZGVuYXIgLyByZW1vdmVyLlxuICAgICAgY29uc3QgdXAgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaVwiICsgKGlkeCA9PT0gMCA/IFwiIHdkLWRpc2FibGVkXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24odXAsIFwiY2hldnJvbi11cFwiKTsgdXAuc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgcGFyYSBjaW1hXCIpO1xuICAgICAgaWYgKGlkeCA+IDApIGNsaWNrYWJsZSh1cCwgYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVBhY2thZ2UoaWR4LCAtMSk7IHRoaXMuZGlzcGxheSgpOyB9KTtcbiAgICAgIGNvbnN0IGRvd24gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaVwiICsgKGlkeCA9PT0gcGtncy5sZW5ndGggLSAxID8gXCIgd2QtZGlzYWJsZWRcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihkb3duLCBcImNoZXZyb24tZG93blwiKTsgZG93bi5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBwYXJhIGJhaXhvXCIpO1xuICAgICAgaWYgKGlkeCA8IHBrZ3MubGVuZ3RoIC0gMSkgY2xpY2thYmxlKGRvd24sIGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVQYWNrYWdlKGlkeCwgKzEpOyB0aGlzLmRpc3BsYXkoKTsgfSk7XG4gICAgICBjb25zdCBkZWwgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaSB3ZC1wa2ctZGVsXCIgfSk7XG4gICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpOyBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiUmVtb3ZlciBwYWNvdGVcIik7XG4gICAgICBjbGlja2FibGUoZGVsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMgPSBwa2dzLmZpbHRlcih4ID0+IHggIT09IHBrZyk7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFkaWNpb25hciBwYWNvdGVcIilcbiAgICAgIC5hZGRCdXR0b24oYiA9PiBiXG4gICAgICAgIC5zZXRCdXR0b25UZXh0KFwiKyBOb3ZvIHBhY290ZVwiKVxuICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcy5wdXNoKHsgaWQ6IHVpZCgpLCBuYW1lOiBcIk5vdm8gcGFjb3RlXCIsIHRhc2tzOiBbXSB9KTtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJUb2tlbiBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiVG9kb2lzdCBcdTIxOTIgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIEludGVncmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgVG9rZW4gZGUgQVBJIGRvIGRlc2Vudm9sdmVkb3IuIFNhbHZvIGxvY2FsbWVudGUgZW0gZGF0YS5qc29uIChuXHUwMEUzbyB2YWkgcGFyYSBvIEdpdCkuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImNvbGUgbyB0b2tlbiBhcXVpXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4gPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJFeGliaVx1MDBFN1x1MDBFM28gZGFzIHRhcmVmYXNcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIG8gcHJvamV0byBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIG8gbm9tZSBkbyBwcm9qZXRvIGFvIGxhZG8gZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBhcyBAZXRpcXVldGFzIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNpbmNyb25pemFcdTAwRTdcdTAwRTNvIChTeW5jdGhpbmcpXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiRXN0YXMgY3JlZGVuY2lhaXMgc1x1MDBFM28gZ3VhcmRhZGFzIHBvciBkaXNwb3NpdGl2byAobG9jYWxTdG9yYWdlKSBcdTIwMTQgY2FkYSBtXHUwMEUxcXVpbmEgdGVtIGEgc3VhIGUgZWxhcyBuXHUwMEUzbyBzaW5jcm9uaXphbSBwZWxvIFN5bmN0aGluZyBuZW0gdlx1MDBFM28gcGFyYSBvIEdpdC5cIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJVUkwgZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIkVuZGVyZVx1MDBFN28gZG8gU3luY3RoaW5nLiBQYWRyXHUwMEUzbzogaHR0cDovLzEyNy4wLjAuMTo4Mzg0IChhIGluc3RcdTAwRTJuY2lhIGxvY2FsKS4gTm8gY2VsdWxhciwgYXBvbnRlIHBhcmEgYSBBUEkgZGUgb3V0cmEgbVx1MDBFMXF1aW5hIG5hIHJlZGUgc2UgYSBsb2NhbCBuXHUwMEUzbyByZXNwb25kZXIuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsID0gdi50cmltKCkgfHwgXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBUEkga2V5XCIpXG4gICAgICAuc2V0RGVzYyhcIlN5bmN0aGluZyBcdTIxOTIgQWN0aW9ucyBcdTIxOTIgU2V0dGluZ3MgXHUyMTkyIEFQSSBLZXkuIEd1YXJkYWRhIHBvciBkaXNwb3NpdGl2byAobG9jYWxTdG9yYWdlKSwgblx1MDBFM28gdmFpIHBhcmEgbyBkYXRhLmpzb24vR2l0LlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIGEgQVBJIGtleVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIklEIGRhIHBhc3RhIChvcGNpb25hbClcIilcbiAgICAgIC5zZXREZXNjKFwiRm9sZGVyIElEIGRvIGNvZnJlIG5vIFN5bmN0aGluZy4gVmF6aW8gPSB1c2EgYSBwcmltZWlyYSBwYXN0YSBhdXRvbWF0aWNhbWVudGUuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImV4LjogbnVucXYtbXRpbW5cIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGNvbnRhZ2VtIGRlIGl0ZW5zIHBvciBhcGFyZWxob1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBcXFwic2luY3Jvbml6YWRvcyAvIHRvdGFsXFxcIiBkZSBpdGVucyBlbSBjYWRhIGFwYXJlbGhvLCBhbFx1MDBFOW0gZGEgcG9yY2VudGFnZW0uXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgIH0pKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQTJLO0FBRTNLLElBQU0sWUFBWTtBQUNsQixJQUFNLG9CQUFvQjtBQUsxQixJQUFNLFlBQVk7QUFDbEIsSUFBTSxZQUFZO0FBQ2xCLElBQU0sZUFBZTtBQUNyQixJQUFN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
