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
var DEFAULT_RULES_PATH = "20.Areas/Gamifica\xE7\xE3o \u2014 Regras.md";
var LEGACY_ACH_PATH = "20.Areas/Gamifica\xE7\xE3o \u2014 Conquistas.md";
var HARVEST_BACKFILL_DAYS = 90;
var DEFAULT_XP_BY_PRI = { p1: 8, p2: 5, p3: 3, p4: 1 };
function priKey(p) {
  return p === 4 ? "p1" : p === 3 ? "p2" : p === 2 ? "p3" : "p4";
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
  growthChartMode: "bars",
  gameAchievements: {},
  gameRulesPath: DEFAULT_RULES_PATH
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
async function createTodoistProject(token, name) {
  const res = await (0, import_obsidian.requestUrl)({
    url: "https://api.todoist.com/api/v1/projects",
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ name }),
    throw: false
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
}
async function createTodoistLabel(token, name, color) {
  const body = { name };
  if (color) body.color = color;
  const res = await (0, import_obsidian.requestUrl)({
    url: "https://api.todoist.com/api/v1/labels",
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
    throw: false
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inv\xE1lido (401/403)");
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
function compileFormula(src, allowed) {
  const allow = new Set(allowed);
  const toks = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const num = src.slice(i, j);
      if (!/^\d*\.?\d+$/.test(num)) return null;
      toks.push({ t: "num", n: Number(num) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j++;
      const id = src.slice(i, j);
      if (!allow.has(id)) return null;
      toks.push({ t: "id", s: id });
      i = j;
      continue;
    }
    if ("+-*/%^()".includes(c)) {
      toks.push({ t: c });
      i++;
      continue;
    }
    return null;
  }
  let p = 0, bad = false;
  const cur = () => toks[p];
  function parseExpr() {
    let a = parseTerm();
    while (cur() && (cur().t === "+" || cur().t === "-")) {
      const op = toks[p++].t, left = a, right = parseTerm();
      a = op === "+" ? (e) => left(e) + right(e) : (e) => left(e) - right(e);
    }
    return a;
  }
  function parseTerm() {
    let a = parseUnary();
    while (cur() && (cur().t === "*" || cur().t === "/" || cur().t === "%")) {
      const op = toks[p++].t, left = a, right = parseUnary();
      a = op === "*" ? (e) => left(e) * right(e) : op === "/" ? (e) => left(e) / right(e) : (e) => left(e) % right(e);
    }
    return a;
  }
  function parseUnary() {
    if (cur() && (cur().t === "-" || cur().t === "+")) {
      const op = toks[p++].t, x = parseUnary();
      return op === "-" ? (e) => -x(e) : x;
    }
    return parsePower();
  }
  function parsePower() {
    const base = parsePrimary();
    if (cur() && cur().t === "^") {
      p++;
      const exp = parseUnary();
      return (e) => Math.pow(base(e), exp(e));
    }
    return base;
  }
  function parsePrimary() {
    var _a, _b;
    const tk = cur();
    if (!tk) {
      bad = true;
      return () => 0;
    }
    if (tk.t === "num") {
      p++;
      const n = (_a = tk.n) != null ? _a : 0;
      return () => n;
    }
    if (tk.t === "id") {
      p++;
      const s = (_b = tk.s) != null ? _b : "";
      return (e) => {
        var _a2;
        return (_a2 = e[s]) != null ? _a2 : 0;
      };
    }
    if (tk.t === "(") {
      p++;
      const x = parseExpr();
      if (!cur() || cur().t !== ")") bad = true;
      else p++;
      return x;
    }
    bad = true;
    return () => 0;
  }
  const fn = parseExpr();
  if (bad || p !== toks.length || toks.length === 0) return null;
  return (env) => {
    const v = fn(env);
    return Number.isFinite(v) ? v : 0;
  };
}
var DEFAULT_LEVEL_CURVE = "100 * n^2";
var MAX_LEVEL_ITER = 1e5;
function curveToThr(curve) {
  var _a;
  const fn = (_a = compileFormula(curve, ["n"])) != null ? _a : compileFormula(DEFAULT_LEVEL_CURVE, ["n"]);
  return (n) => fn({ n });
}
function levelFromThr(xp, thr, maxLevel) {
  const x = Math.max(0, xp);
  let level = 0;
  const cap = maxLevel > 0 ? maxLevel : MAX_LEVEL_ITER;
  let prev = 0;
  while (level < cap) {
    const need = thr(level + 1);
    if (!Number.isFinite(need) || need > x) break;
    if (level > 0 && need <= prev) break;
    prev = need;
    level++;
  }
  const atMax = maxLevel > 0 && level >= maxLevel;
  const base = level >= 1 ? thr(level) : 0;
  const next = atMax ? base : thr(level + 1);
  const into = Math.max(0, x - base);
  const forNext = Math.max(1, (Number.isFinite(next) ? next : base) - base);
  const pct = atMax ? 100 : Math.min(100, Math.round(into / forNext * 100));
  return { level, into, forNext, pct, max: atMax };
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
  return [
    e.date,
    e.type,
    String(e.xp),
    e.key,
    escapeGameField(e.content),
    escapeGameField(e.project),
    labels,
    e.pri != null ? String(e.pri) : ""
  ].join("	");
}
function parseGameEventLine(line) {
  const p = line.split("	").map((s) => s.trim());
  if (p.length < 4) return null;
  const [date, type, xpRaw, key, content = "", project = "", labelsRaw = "", priRaw = ""] = p;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (type !== "feito" && type !== "nao-feito") return null;
  const xp = Number(xpRaw);
  if (!Number.isFinite(xp) || !key) return null;
  const labels = labelsRaw ? labelsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const priN = Number(priRaw);
  const ev = { date, type, xp, key, content, project, labels };
  if (priRaw && Number.isInteger(priN) && priN >= 1 && priN <= 4) ev.pri = priN;
  return ev;
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
function scopeLevelFn(def, defaultThr) {
  if (!def) return { thr: defaultThr, max: 0 };
  if (def.kind === "table") {
    const t = def.thresholds;
    return { thr: (n) => n >= 1 && n <= t.length ? t[n - 1] : Infinity, max: t.length };
  }
  return { thr: curveToThr(def.curve), max: def.levels };
}
function maxScopeLevel(infos, skip) {
  let best = 0;
  for (const [name, info] of infos) {
    if (skip && name === skip) continue;
    best = Math.max(best, info.level);
  }
  return best;
}
function computeGameStats(events, rules) {
  var _a, _b, _c, _d, _e;
  const byDay = /* @__PURE__ */ new Map();
  const byProject = /* @__PURE__ */ new Map();
  const byLabel = /* @__PURE__ */ new Map();
  let totalXp = 0;
  let doneCount = 0;
  let p1Count = 0;
  const fallbackP1 = DEFAULT_XP_BY_PRI.p1;
  for (const e of events) {
    totalXp += e.xp;
    const d = (_a = byDay.get(e.date)) != null ? _a : { xp: 0, count: 0 };
    d.xp += e.xp;
    if (e.type === "feito") {
      d.count += 1;
      doneCount += 1;
      if (e.pri != null ? e.pri === 4 : e.xp === fallbackP1) p1Count += 1;
    }
    byDay.set(e.date, d);
    if (e.type === "feito") {
      const proj = e.project || "\u2014";
      byProject.set(proj, ((_b = byProject.get(proj)) != null ? _b : 0) + e.xp);
      for (const l of e.labels) byLabel.set(l, ((_c = byLabel.get(l)) != null ? _c : 0) + e.xp);
    }
  }
  if (totalXp < 0) totalXp = 0;
  let maxDayXp = 0;
  for (const d of byDay.values()) if (d.xp > maxDayXp) maxDayXp = d.xp;
  const defThr = curveToThr((_d = rules == null ? void 0 : rules.levelCurve) != null ? _d : DEFAULT_LEVEL_CURVE);
  const gi = levelFromThr(totalXp, defThr, 0);
  const scopeInfo = (m, defs) => {
    const out = /* @__PURE__ */ new Map();
    for (const [name, xp] of m) {
      const { thr, max } = scopeLevelFn(defs == null ? void 0 : defs.get(name), defThr);
      out.set(name, levelFromThr(xp, thr, max));
    }
    return out;
  };
  const byProjectInfo = scopeInfo(byProject, rules == null ? void 0 : rules.scopeLevels.projects);
  const byLabelInfo = scopeInfo(byLabel, rules == null ? void 0 : rules.scopeLevels.labels);
  const doneDays = /* @__PURE__ */ new Set();
  for (const e of events) if (e.type === "feito") doneDays.add(e.date);
  const { streakCurrent, streakBest } = computeStreak(doneDays);
  const today = (_e = byDay.get(toKey(/* @__PURE__ */ new Date()))) != null ? _e : { xp: 0, count: 0 };
  return {
    totalXp,
    level: gi.level,
    xpIntoLevel: gi.into,
    xpForNext: gi.forNext,
    levelMax: gi.max,
    streakCurrent,
    streakBest,
    todayXp: today.xp,
    todayCount: today.count,
    doneCount,
    p1Count,
    maxDayXp,
    byDay,
    byProject,
    byLabel,
    byProjectInfo,
    byLabelInfo
  };
}
var METRICS = {
  level: (s) => s.level,
  totalXp: (s) => s.totalXp,
  doneCount: (s) => s.doneCount,
  p1Count: (s) => s.p1Count,
  maxDayXp: (s) => s.maxDayXp,
  streakBest: (s) => s.streakBest,
  streakCurrent: (s) => s.streakCurrent,
  projectLevel: (s) => maxScopeLevel(s.byProjectInfo, "\u2014"),
  labelLevel: (s) => maxScopeLevel(s.byLabelInfo)
};
var METRIC_LABELS = {
  level: "N\xEDvel geral",
  totalXp: "XP total acumulado",
  doneCount: "Tarefas conclu\xEDdas (total)",
  p1Count: "Tarefas p1 conclu\xEDdas",
  maxDayXp: "Maior XP num \xFAnico dia",
  streakBest: "Maior sequ\xEAncia de dias",
  streakCurrent: "Sequ\xEAncia de dias atual",
  projectLevel: "Maior n\xEDvel entre os projetos",
  labelLevel: "Maior n\xEDvel entre as etiquetas"
};
var DEFAULT_ACHIEVEMENTS = [
  // Nível (geral)
  { id: "lvl5", cat: "N\xEDvel", title: "Aprendiz", desc: "Alcance o n\xEDvel 5", icon: "star", goal: 5, metric: "level" },
  { id: "lvl10", cat: "N\xEDvel", title: "Veterano", desc: "Alcance o n\xEDvel 10", icon: "medal", goal: 10, metric: "level" },
  { id: "lvl20", cat: "N\xEDvel", title: "Mestre", desc: "Alcance o n\xEDvel 20", icon: "crown", goal: 20, metric: "level" },
  // Sequência (streak recorde)
  { id: "streak3", cat: "Sequ\xEAncia", title: "Pegando o ritmo", desc: "3 dias seguidos com tarefa", icon: "flame", goal: 3, metric: "streakBest" },
  { id: "streak7", cat: "Sequ\xEAncia", title: "Semana cheia", desc: "7 dias seguidos com tarefa", icon: "flame", goal: 7, metric: "streakBest" },
  { id: "streak30", cat: "Sequ\xEAncia", title: "M\xEAs de fogo", desc: "30 dias seguidos com tarefa", icon: "flame", goal: 30, metric: "streakBest" },
  { id: "streak100", cat: "Sequ\xEAncia", title: "Centuri\xE3o", desc: "100 dias seguidos com tarefa", icon: "flame", goal: 100, metric: "streakBest" },
  // Volume (tarefas concluídas)
  { id: "vol10", cat: "Volume", title: "Primeiros passos", desc: "10 tarefas conclu\xEDdas", icon: "check-check", goal: 10, metric: "doneCount" },
  { id: "vol50", cat: "Volume", title: "Engrenando", desc: "50 tarefas conclu\xEDdas", icon: "check-check", goal: 50, metric: "doneCount" },
  { id: "vol100", cat: "Volume", title: "Centena", desc: "100 tarefas conclu\xEDdas", icon: "check-check", goal: 100, metric: "doneCount" },
  { id: "vol500", cat: "Volume", title: "Impar\xE1vel", desc: "500 tarefas conclu\xEDdas", icon: "check-check", goal: 500, metric: "doneCount" },
  { id: "vol1000", cat: "Volume", title: "Milhar", desc: "1000 tarefas conclu\xEDdas", icon: "check-check", goal: 1e3, metric: "doneCount" },
  // Prioridade (tarefas p1)
  { id: "p1_25", cat: "Prioridade", title: "Ca\xE7ador de p1", desc: "25 tarefas p1 conclu\xEDdas", icon: "zap", goal: 25, metric: "p1Count" },
  { id: "p1_100", cat: "Prioridade", title: "Matador de prioridades", desc: "100 tarefas p1 conclu\xEDdas", icon: "zap", goal: 100, metric: "p1Count" },
  // Dia cheio (XP num único dia)
  { id: "day50", cat: "Dia cheio", title: "Dia produtivo", desc: "50+ XP num \xFAnico dia", icon: "sun", goal: 50, metric: "maxDayXp" },
  { id: "day100", cat: "Dia cheio", title: "Dia \xE9pico", desc: "100+ XP num \xFAnico dia", icon: "sunrise", goal: 100, metric: "maxDayXp" },
  // Escopo (níveis por projeto/etiqueta)
  { id: "proj5", cat: "Escopo", title: "Especialista", desc: "N\xEDvel 5 em algum projeto", icon: "folder", goal: 5, metric: "projectLevel" },
  { id: "label5", cat: "Escopo", title: "H\xE1bito formado", desc: "N\xEDvel 5 em alguma etiqueta", icon: "tag", goal: 5, metric: "labelLevel" }
];
function metricValue(metric, s) {
  const fn = METRICS[metric];
  return fn ? fn(s) : 0;
}
function evalAchievement(a, s) {
  const value = metricValue(a.metric, s);
  const unlocked = value >= a.goal;
  const pct = a.goal > 0 ? Math.min(100, Math.round(value / a.goal * 100)) : 0;
  return { a, value, unlocked, pct };
}
var GOAL_PERIODS = ["day", "week", "month", "year"];
var GOAL_PERIOD_LABELS = { day: "hoje", week: "esta semana", month: "este m\xEAs", year: "este ano" };
var DEFAULT_GOALS = [
  { id: "dia-xp", title: "Meta di\xE1ria", period: "day", metric: "xp", target: 30 },
  { id: "semana-vol", title: "Semana produtiva", period: "week", metric: "tasks", target: 20 }
];
function periodStartKey(period, now) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") {
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
  } else if (period === "month") d.setDate(1);
  else if (period === "year") d.setMonth(0, 1);
  return toKey(d);
}
function goalProgress(events, goal, now) {
  const start = periodStartKey(goal.period, now);
  let current = 0;
  for (const e of events) {
    if (e.type !== "feito" || e.date < start) continue;
    if (goal.project && (e.project || "") !== goal.project) continue;
    if (goal.label && !e.labels.includes(goal.label)) continue;
    current += goal.metric === "tasks" ? 1 : e.xp;
  }
  current = Math.max(0, current);
  const pct = goal.target > 0 ? Math.min(100, Math.round(current / goal.target * 100)) : 0;
  return { goal, current, pct, done: current >= goal.target };
}
var MAX_SCOPE_LEVELS = 1e3;
function emptyScopeLevels() {
  return { projects: /* @__PURE__ */ new Map(), labels: /* @__PURE__ */ new Map() };
}
function defaultRules() {
  return {
    projects: [],
    labels: [],
    xpByPriority: { ...DEFAULT_XP_BY_PRI },
    xpByLabel: /* @__PURE__ */ new Map(),
    levelCurve: DEFAULT_LEVEL_CURVE,
    scopeLevels: emptyScopeLevels(),
    achievements: DEFAULT_ACHIEVEMENTS,
    goals: DEFAULT_GOALS
  };
}
function parseAchievementList(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const metric = typeof o.metric === "string" ? o.metric : "";
    const goal = Number(o.goal);
    if (!id || seen.has(id) || !title || !(metric in METRICS) || !Number.isFinite(goal) || goal <= 0) continue;
    seen.add(id);
    out.push({
      id,
      title,
      metric,
      goal,
      cat: typeof o.cat === "string" && o.cat.trim() ? o.cat.trim() : "Outros",
      desc: typeof o.desc === "string" ? o.desc : "",
      icon: typeof o.icon === "string" && o.icon.trim() ? o.icon.trim() : "trophy"
    });
  }
  return out;
}
function parseScopeLevelDef(raw) {
  const asTable = (arr) => {
    const t = [...new Set(arr.map(Number).filter((n) => Number.isFinite(n) && n > 0))].sort((a, b) => a - b);
    return t.length ? { kind: "table", thresholds: t } : null;
  };
  if (Array.isArray(raw)) return asTable(raw);
  if (raw && typeof raw === "object") {
    const o = raw;
    if (Array.isArray(o.thresholds)) return asTable(o.thresholds);
    const levels = Math.floor(Number(o.levels));
    const curve = typeof o.curve === "string" ? o.curve.trim() : "";
    if (Number.isFinite(levels) && levels >= 1 && levels <= MAX_SCOPE_LEVELS && curve && compileFormula(curve, ["n"]))
      return { kind: "curve", levels, curve };
  }
  return null;
}
function parseScopeLevelMap(raw) {
  const m = /* @__PURE__ */ new Map();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return m;
  for (const [k, v] of Object.entries(raw)) {
    const name = k.trim();
    const def = parseScopeLevelDef(v);
    if (name && def) m.set(name, def);
  }
  return m;
}
function parseScopeLevels(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  return { projects: parseScopeLevelMap(o.projects), labels: parseScopeLevelMap(o.labels) };
}
function parseXpByPriority(raw) {
  const out = { ...DEFAULT_XP_BY_PRI };
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw;
    for (const k of ["p1", "p2", "p3", "p4"]) {
      const n = Number(o[k]);
      if (Number.isFinite(n) && n >= 0) out[k] = n;
    }
  }
  return out;
}
function parseXpByLabel(raw) {
  const m = /* @__PURE__ */ new Map();
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const [k, v] of Object.entries(raw)) {
      const name = k.trim();
      const n = Number(v);
      if (name && Number.isFinite(n)) m.set(name, n);
    }
  }
  return m;
}
function parseLevelCurve(raw) {
  if (typeof raw === "string" && raw.trim() && compileFormula(raw.trim(), ["n"])) return raw.trim();
  return DEFAULT_LEVEL_CURVE;
}
function parseRulesProjects(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const r of raw) {
    const name = typeof r === "string" ? r.trim() : "";
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
function parseRulesLabels(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const r of raw) {
    let name = "", color;
    if (typeof r === "string") name = r.trim();
    else if (r && typeof r === "object") {
      const o = r;
      name = typeof o.name === "string" ? o.name.trim() : "";
      if (typeof o.color === "string" && o.color.trim() in TODOIST_COLORS) color = o.color.trim();
    }
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(color ? { name, color } : { name });
  }
  return out;
}
function parseGoals(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const period = typeof o.period === "string" ? o.period : "";
    const metric = typeof o.metric === "string" ? o.metric : "";
    const target = Number(o.target);
    if (!id || seen.has(id) || !title || !GOAL_PERIODS.includes(period) || metric !== "xp" && metric !== "tasks" || !Number.isFinite(target) || target <= 0) continue;
    seen.add(id);
    const g = { id, title, period, metric, target };
    if (typeof o.project === "string" && o.project.trim()) g.project = o.project.trim();
    if (typeof o.label === "string" && o.label.trim()) g.label = o.label.trim();
    out.push(g);
  }
  return out;
}
function parseGameRules(content) {
  const m = content.match(/```json\s*\r?\n([\s\S]*?)```/);
  if (!m) return null;
  let raw;
  try {
    raw = JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
  if (Array.isArray(raw)) {
    const ach2 = parseAchievementList(raw);
    if (!ach2.length) return null;
    const r = defaultRules();
    r.achievements = ach2;
    return r;
  }
  if (!raw || typeof raw !== "object") return null;
  const o = raw;
  const ach = parseAchievementList(o.achievements);
  const goals = parseGoals(o.goals);
  return {
    projects: parseRulesProjects(o.projects),
    labels: parseRulesLabels(o.labels),
    xpByPriority: parseXpByPriority(o.xpByPriority),
    xpByLabel: parseXpByLabel(o.xpByLabel),
    levelCurve: parseLevelCurve(o.levelCurve),
    scopeLevels: parseScopeLevels(o.scopeLevels),
    achievements: ach.length ? ach : DEFAULT_ACHIEVEMENTS,
    // identidade preservada → isCustomAchievements()
    goals: goals.length ? goals : DEFAULT_GOALS
  };
}
function scopeLevelDefToJson(def) {
  return def.kind === "table" ? { thresholds: def.thresholds } : { levels: def.levels, curve: def.curve };
}
function rulesToJsonObj(rules) {
  const lvlMap = (m) => Object.fromEntries([...m].map(([k, v]) => [k, scopeLevelDefToJson(v)]));
  return {
    projects: rules.projects,
    labels: rules.labels,
    xpByPriority: rules.xpByPriority,
    xpByLabel: Object.fromEntries(rules.xpByLabel),
    levelCurve: rules.levelCurve,
    scopeLevels: { projects: lvlMap(rules.scopeLevels.projects), labels: lvlMap(rules.scopeLevels.labels) },
    achievements: rules.achievements.map((a) => ({ id: a.id, cat: a.cat, title: a.title, desc: a.desc, icon: a.icon, metric: a.metric, goal: a.goal })),
    goals: rules.goals.map((g) => ({
      id: g.id,
      title: g.title,
      period: g.period,
      metric: g.metric,
      target: g.target,
      ...g.project ? { project: g.project } : {},
      ...g.label ? { label: g.label } : {}
    }))
  };
}
function replaceFirstJsonBlock(content, json) {
  if (!/```json\s*\r?\n[\s\S]*?```/.test(content)) return null;
  return content.replace(/```json\s*\r?\n[\s\S]*?```/, () => "```json\n" + json + "\n```");
}
function buildGameRulesContent(rules) {
  const rows = Object.keys(METRIC_LABELS).map((k) => `| \`${k}\` | ${METRIC_LABELS[k]} |`).join("\n");
  const colors = Object.keys(TODOIST_COLORS).join(", ");
  const json = JSON.stringify(rulesToJsonObj(rules), null, 2);
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
    "tags: [gamificacao, regras]",
    "---",
    "",
    "# Gamifica\xE7\xE3o \u2014 Regras (configura\xE7\xE3o)",
    "",
    "> Arquivo **lido pelo plugin Werus Dashboard**. Edite o bloco `json` no fim e recarregue (Ctrl+R).",
    "> Bloco vazio/inv\xE1lido \u2192 o plugin usa os padr\xF5es embutidos. **Compartilhe esta nota** para distribuir",
    '> um "jogo" inteiro (projetos, etiquetas, XP, n\xEDveis, conquistas e metas).',
    "",
    "## Como funciona",
    "",
    "- **XP por tarefa** = `xpByPriority[prioridade]` + soma dos `xpByLabel` das etiquetas da tarefa (m\xEDnimo 0).",
    '- **"Salvar conclu\xEDdas"** (aba Gamifica\xE7\xE3o) registra as tarefas feitas no log e d\xE1 o XP; o bot\xE3o **\u2717 n\xE3o feita** desconta (penalidade nas Configura\xE7\xF5es).',
    "- **N\xEDvel** = derivado do XP acumulado pela curva `levelCurve` (geral) ou pela defini\xE7\xE3o do escopo em `scopeLevels`.",
    "- A aba mostra: n\xEDvel geral, **metas** do per\xEDodo, gr\xE1fico de XP, **escopos** (projetos/etiquetas) e **conquistas**.",
    "- Toda entrada inv\xE1lida \xE9 **ignorada** (o resto continua valendo). O l\xE1pis (\u270F\uFE0F) na aba abre esta nota.",
    "",
    "## Campos do JSON",
    "",
    "### `projects` \u2014 lista de texto",
    "",
    "Nomes dos projetos do jogo. O bot\xE3o **Provisionar Todoist** (Configura\xE7\xF5es) cria no Todoist os que faltam; na aba, um escopo que s\xF3 existe no Todoist ganha o bot\xE3o **+ Cofre** para entrar aqui.",
    'Ex.: `["Estudos", "Trabalho"]`',
    "",
    "### `labels` \u2014 lista",
    "",
    'Etiquetas do jogo. Cada item \xE9 `"nome"` **ou** `{ "name": "nome", "color": "blue" }` (a cor \xE9 usada ao criar no Todoist).',
    "Cores v\xE1lidas: " + colors + ".",
    'Ex.: `[{ "name": "foco", "color": "blue" }, "urgente"]`',
    "",
    "### `xpByPriority` \u2014 objeto",
    "",
    "XP ganho por prioridade da tarefa (`p1` = mais alta/urgente \u2026 `p4` = padr\xE3o). O que faltar usa o padr\xE3o `p1 8 \xB7 p2 5 \xB7 p3 3 \xB7 p4 1`. Valores \u2265 0.",
    'Ex.: `{ "p1": 10, "p2": 5, "p3": 3, "p4": 1 }`',
    "",
    "### `xpByLabel` \u2014 objeto",
    "",
    "B\xF4nus de XP **somado** por etiqueta presente na tarefa (pode ser negativo para penalizar). Etiquetas fora da lista somam 0.",
    'Ex.: `{ "foco": 2, "chato": -3 }` \u2192 uma `p1` com `@foco` rende `8 + 2 = 10` XP.',
    "",
    "### `levelCurve` \u2014 texto (f\xF3rmula)",
    "",
    "F\xF3rmula do XP **cumulativo** para alcan\xE7ar o n\xEDvel `n`. Vale para o n\xEDvel **geral** e para qualquer escopo sem entrada em `scopeLevels`.",
    "- Vari\xE1vel: `n` (n\xFAmero do n\xEDvel, \u2265 1). Operadores: `+` `-` `*` `/` `%` `^` (pot\xEAncia) e par\xEAnteses `( )`.",
    "- Padr\xE3o `100 * n^2` (equivale ao antigo \u230A\u221A(XP/100)\u230B, **sem teto**).",
    "- O n\xEDvel \xE9 o **maior `n`** cujo limiar \xE9 `\u2264` ao XP acumulado. Com `100*n^2`: 100 XP \u2192 Nv 1, 400 \u2192 Nv 2, 900 \u2192 Nv 3.",
    'Ex.: `"50 * n"` (linear) \xB7 `"100 * n^1.5"` \xB7 `"200 + 50 * n^2"`.',
    "",
    "### `scopeLevels` \u2014 objeto",
    "",
    "N\xEDveis **pr\xF3prios** por projeto/etiqueta (sobrep\xF5em `levelCurve`). Dois sub-objetos, `projects` e `labels`, mapeando nome \u2192 defini\xE7\xE3o. Duas formas:",
    '- **F\xF3rmula com teto:** `{ "levels": 100, "curve": "50 * n" }` \u2014 gera 100 n\xEDveis pela f\xF3rmula; o n\xEDvel 100 \xE9 o teto.',
    '- **Tabela expl\xEDcita:** `{ "thresholds": [30, 80, 150, 250] }` \u2014 XP cumulativo de cada n\xEDvel (em ordem crescente). Aqui o escopo tem 4 n\xEDveis. No teto, a barra fica cheia e o escopo mostra **"m\xE1x"**.',
    "Ex.:",
    "```",
    '"scopeLevels": {',
    '  "projects": { "Estudos": { "thresholds": [30, 80, 150, 250] } },',
    '  "labels":   { "foco": { "levels": 10, "curve": "50 * n" } }',
    "}",
    "```",
    "",
    "### `achievements` \u2014 lista de badges (permanentes)",
    "",
    "| campo | o qu\xEA |",
    "|---|---|",
    "| `id` | identificador \xFAnico |",
    "| `title` | nome exibido |",
    "| `desc` | descri\xE7\xE3o (tooltip) |",
    "| `icon` | \xEDcone **Lucide** (ex.: `star`, `flame`, `trophy`, `medal`, `crown`, `zap`, `sun`, `folder`, `tag`) \u2014 ver lucide.dev |",
    "| `cat` | categoria (vira cabe\xE7alho na UI) |",
    "| `metric` | o que mede (tabela de m\xE9tricas abaixo) |",
    "| `goal` | desbloqueia quando a m\xE9trica \u2265 goal (fica permanente) |",
    'Ex.: `{ "id":"lvl5", "cat":"N\xEDvel", "title":"Aprendiz", "desc":"Alcance o n\xEDvel 5", "icon":"star", "metric":"level", "goal":5 }`',
    "Lista vazia \u2192 usa as conquistas padr\xE3o embutidas.",
    "",
    "**M\xE9tricas dispon\xEDveis (para `achievements`):**",
    "",
    "| metric | mede |",
    "|---|---|",
    rows,
    "",
    "### `goals` \u2014 metas do per\xEDodo (resetam sozinhas)",
    "",
    "O progresso vem das tarefas **feitas** no per\xEDodo atual; ao virar o per\xEDodo, recome\xE7a.",
    "| campo | o qu\xEA |",
    "|---|---|",
    "| `id` | identificador \xFAnico |",
    "| `title` | nome exibido |",
    "| `period` | `day` (hoje) \xB7 `week` (semana, come\xE7a na segunda) \xB7 `month` (m\xEAs) \xB7 `year` (ano) |",
    "| `metric` | `xp` (soma de XP) ou `tasks` (n\xBA de tarefas conclu\xEDdas) |",
    "| `target` | alvo a alcan\xE7ar (> 0) |",
    "| `project` | _(opcional)_ conta s\xF3 tarefas deste projeto |",
    "| `label` | _(opcional)_ conta s\xF3 tarefas com esta etiqueta |",
    'Ex.: `{ "id":"foco-sem", "title":"Foco da semana", "period":"week", "metric":"tasks", "target":10, "label":"foco" }`',
    "Lista vazia \u2192 usa as metas padr\xE3o embutidas.",
    "",
    "## Observa\xE7\xF5es",
    "",
    "- O XP de tarefas **j\xE1 registradas** no log n\xE3o muda ao alterar `xpByPriority`/`xpByLabel` (o XP \xE9 carimbado na hora da conclus\xE3o); a mudan\xE7a vale para as pr\xF3ximas.",
    "- A sintaxe de f\xF3rmula \xE9 aritm\xE9tica **segura** (sem c\xF3digo execut\xE1vel): apenas `n`, n\xFAmeros e `+ - * / % ^ ( )`.",
    '- Penalidades ("n\xE3o feita") **n\xE3o** contam para as metas.',
    "",
    "## Configura\xE7\xE3o atual",
    "",
    "```json",
    json,
    "```",
    ""
  ].join("\n");
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
  hasData() {
    return this.fetchedAt > 0;
  }
  // já houve um fetch (online) → known* confiáveis
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
    this.rules = null;
    // regras vindas da nota (null = padrões embutidos)
    this.busy = false;
    // colheita/markUndone em andamento
    this.pending = [];
    // concluídas na API ainda não no log (live)
    this.pendingXp = 0;
    this.lastBarPct = 0;
    // último % da barra (p/ animar do valor anterior)
    this.lastLevel = 0;
    this.newAch = /* @__PURE__ */ new Set();
    // conquistas recém-desbloqueadas (mostra "novo!" até a aba ser vista)
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
  rulesPath() {
    return this.plugin.settings.gameRulesPath;
  }
  invalidate() {
    this.loaded = false;
  }
  async ensureLoaded() {
    if (this.loaded) return;
    const f = this.logFile();
    this.events = f ? parseGameLog(await this.app.vault.read(f)) : [];
    let cf = this.app.vault.getAbstractFileByPath(this.rulesPath());
    if (!(cf instanceof import_obsidian.TFile)) cf = this.app.vault.getAbstractFileByPath(LEGACY_ACH_PATH);
    this.rules = cf instanceof import_obsidian.TFile ? parseGameRules(await this.app.vault.read(cf)) : null;
    this.loaded = true;
  }
  // Lista efetiva de conquistas: a da nota do cofre (se válida), senão a padrão embutida.
  achievements() {
    var _a, _b;
    return (_b = (_a = this.rules) == null ? void 0 : _a.achievements) != null ? _b : DEFAULT_ACHIEVEMENTS;
  }
  isCustomAchievements() {
    return !!this.rules && this.rules.achievements !== DEFAULT_ACHIEVEMENTS;
  }
  goals() {
    var _a, _b;
    return (_b = (_a = this.rules) == null ? void 0 : _a.goals) != null ? _b : DEFAULT_GOALS;
  }
  // XP de uma tarefa: prioridade + Σ(bônus das etiquetas). Clampa ≥ 0 (config é responsável).
  taskXp(t) {
    var _a, _b, _c, _d, _e, _f;
    const xpPri = (_b = (_a = this.rules) == null ? void 0 : _a.xpByPriority) != null ? _b : DEFAULT_XP_BY_PRI;
    const xpLab = (_c = this.rules) == null ? void 0 : _c.xpByLabel;
    let xp = (_d = xpPri[priKey(t.priority)]) != null ? _d : 0;
    if (xpLab) for (const l of (_e = t.labels) != null ? _e : []) xp += (_f = xpLab.get(l)) != null ? _f : 0;
    return Math.max(0, xp);
  }
  // Projetos/etiquetas declarados nas Regras (para o botão Provisionar Todoist).
  provisionLists() {
    var _a, _b, _c, _d;
    return { projects: (_b = (_a = this.rules) == null ? void 0 : _a.projects) != null ? _b : [], labels: (_d = (_c = this.rules) == null ? void 0 : _c.labels) != null ? _d : [] };
  }
  // Abre a nota de Regras (cria, já preenchida com os padrões, se ainda não existir).
  async openGameRules() {
    var _a;
    const path = this.rulesPath();
    let f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian.TFile)) {
      const slash = path.lastIndexOf("/");
      const folder = slash > 0 ? path.slice(0, slash) : "";
      if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
        try {
          await this.app.vault.createFolder(folder);
        } catch (e) {
        }
      }
      await this.ensureLoaded();
      f = await this.app.vault.create(path, buildGameRulesContent((_a = this.rules) != null ? _a : defaultRules()));
      this.invalidate();
      await this.ensureLoaded();
      this.rerenderAll();
    }
    if (f instanceof import_obsidian.TFile) await this.app.workspace.getLeaf(false).openFile(f);
  }
  // Reescreve a nota com a documentação completa, mantendo a configuração (o JSON). Se não existir, cria.
  async regenerateRulesDoc() {
    var _a;
    const path = this.rulesPath();
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian.TFile)) {
      await this.openGameRules();
      return;
    }
    const rules = (_a = parseGameRules(await this.app.vault.read(f))) != null ? _a : defaultRules();
    const ok = await confirmModal(this.app, {
      title: "Regenerar documenta\xE7\xE3o?",
      body: "Reescreve a nota de Regras com a documenta\xE7\xE3o completa, mantendo a sua configura\xE7\xE3o (o JSON). Texto adicionado \xE0 m\xE3o na nota ser\xE1 perdido.",
      cta: "Regenerar"
    });
    if (!ok) return;
    await this.app.vault.modify(f, buildGameRulesContent(rules));
    this.invalidate();
    await this.ensureLoaded();
    this.rerenderAll();
    await this.app.workspace.getLeaf(false).openFile(f);
    new import_obsidian.Notice("Documenta\xE7\xE3o das Regras atualizada (configura\xE7\xE3o preservada).");
  }
  stats() {
    var _a;
    return computeGameStats(this.events, (_a = this.rules) != null ? _a : void 0);
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
      xp: this.taskXp(t),
      key: `${t.id}|${at}`,
      content: t.content,
      project: this.projName(t),
      labels: (_b = t.labels) != null ? _b : [],
      pri: t.priority
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
    const penalty = Math.max(1, Math.round(this.taskXp(t) * this.plugin.settings.gamePenaltyFactor));
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
        labels: (_a = t.labels) != null ? _a : [],
        pri: t.priority
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
      const totalXp = fresh.reduce((s, t) => s + this.taskXp(t), 0);
      const ok = await confirmModal(this.app, {
        title: `Salvar ${fresh.length} tarefa(s) conclu\xEDda(s)?`,
        body: `+${totalXp} XP no log. ${deletable.length} apagada(s) do Todoist` + (recurring ? ` \xB7 ${recurring} recorrente(s) ficam (apagar quebraria a recorr\xEAncia).` : "."),
        items: fresh.slice(0, 30).map((t) => ({ text: `+${this.taskXp(t)} \xB7 ${t.content}` })),
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
      this.pendingXp = this.pending.reduce((s, t) => s + this.taskXp(t), 0);
      this.rerenderAll();
    } catch (e) {
    }
  }
  // Painel compartilhado: dashboard (faixa, ctrls sem colheita) e aba (full).
  renderPanel(host, ctrls, opts = {}) {
    const s = this.stats();
    this.syncAchievements(s);
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
    if (opts.full) this.renderGoals(host);
    if (opts.full) this.renderXpChart(host, s, !!opts.phone);
    if (opts.full) this.renderXpFormula(host);
    if (opts.full) this.renderScopes(host, s);
    if (opts.full) this.renderAchievements(host, s);
  }
  // Metas (só na aba): alvo do período atual, com barra de progresso. Editáveis na nota de Regras.
  renderGoals(host) {
    const goals = this.goals();
    if (!goals.length) return;
    const now = /* @__PURE__ */ new Date();
    const sec = host.createDiv({ cls: "wd-game-goalsec" });
    sec.createDiv({ cls: "wd-game-chart-title", text: "Metas" });
    for (const g of goals) {
      const st = goalProgress(this.events, g, now);
      const item = sec.createDiv({ cls: "wd-game-goal" + (st.done ? " wd-game-goal-done" : "") });
      const head = item.createDiv({ cls: "wd-game-scope-head" });
      const left = head.createDiv({ cls: "wd-game-scope-left" });
      left.createSpan({ cls: "wd-game-scope-name", text: g.title });
      const scope = g.project ? g.project : g.label ? "@" + g.label : "";
      left.createSpan({ cls: "wd-game-goal-sub", text: GOAL_PERIOD_LABELS[g.period] + (scope ? " \xB7 " + scope : "") });
      const unit = g.metric === "xp" ? "XP" : "feitas";
      head.createSpan({ cls: "wd-game-scope-meta", text: `${st.current}/${g.target} ${unit}` + (st.done ? " \u2713" : "") });
      const bar = item.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
      bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${st.pct}%`;
      bar.setAttr("title", st.done ? "Meta conclu\xEDda!" : `${st.current}/${g.target} ${unit} ${GOAL_PERIOD_LABELS[g.period]}`);
    }
  }
  // Marca conquistas recém-desbloqueadas: grava a data (permanente) e sinaliza "novo!".
  syncAchievements(s) {
    const saved = this.plugin.settings.gameAchievements;
    let changed = false;
    for (const a of this.achievements()) {
      if (!saved[a.id] && metricValue(a.metric, s) >= a.goal) {
        saved[a.id] = toKey(/* @__PURE__ */ new Date());
        this.newAch.add(a.id);
        changed = true;
      }
    }
    if (changed) void this.plugin.saveSettings();
  }
  // Conquistas (só na aba): grid de badges — desbloqueadas coloridas + data; bloqueadas
  // em cinza com a condição e o progresso (decisão do Werus: mostrar bloqueadas).
  renderAchievements(host, s) {
    const list = this.achievements();
    const states = list.map((a) => evalAchievement(a, s));
    const unlocked = states.filter((x) => x.unlocked).length;
    const sec = host.createDiv({ cls: "wd-game-achsec" });
    const hd = sec.createDiv({ cls: "wd-game-charthd" });
    hd.createDiv({ cls: "wd-game-chart-title", text: "Conquistas" });
    const right = hd.createDiv({ cls: "wd-game-ach-hd-right" });
    right.createSpan({
      cls: "wd-game-ach-count" + (this.isCustomAchievements() ? " wd-game-ach-custom" : ""),
      text: `${unlocked}/${list.length}`
    });
    const edit = right.createSpan({ cls: "wd-view-btn wd-game-ach-edit" });
    (0, import_obsidian.setIcon)(edit, "pencil");
    edit.setAttr("title", "Editar regras \u2014 abre a nota com o bloco JSON (projetos, etiquetas, XP, n\xEDveis, conquistas)" + (this.isCustomAchievements() ? " (lista personalizada ativa)" : ""));
    clickable(edit, () => void this.openGameRules());
    const grid = sec.createDiv({ cls: "wd-game-ach-grid" });
    for (const st of states) {
      const date = this.plugin.settings.gameAchievements[st.a.id];
      const isNew = this.newAch.has(st.a.id);
      const cell = grid.createDiv({ cls: "wd-game-ach" + (st.unlocked ? " wd-game-ach-on" : "") + (isNew ? " wd-game-ach-new" : "") });
      (0, import_obsidian.setIcon)(cell.createDiv({ cls: "wd-game-ach-ico" }), st.a.icon);
      cell.createDiv({ cls: "wd-game-ach-title", text: st.a.title });
      if (st.unlocked) {
        cell.createDiv({ cls: "wd-game-ach-sub", text: date ? `\u2713 ${date}` : "\u2713" });
      } else {
        cell.createDiv({ cls: "wd-game-ach-sub", text: `${Math.min(st.value, st.a.goal)}/${st.a.goal}` });
        const bar = cell.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
        bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${st.pct}%`;
      }
      cell.setAttr("title", `${st.a.desc}` + (st.unlocked ? date ? ` \xB7 desbloqueada em ${date}` : " \xB7 desbloqueada" : ` \xB7 ${Math.min(st.value, st.a.goal)}/${st.a.goal}`));
      if (isNew) cell.createSpan({ cls: "wd-game-ach-newbadge", text: "novo!" });
    }
    this.newAch.clear();
  }
  // Fórmula visual do XP por tarefa (estilo Notion): prioridade + Σ(etiquetas), com os valores vigentes.
  renderXpFormula(host) {
    var _a, _b, _c, _d;
    const pri = (_b = (_a = this.rules) == null ? void 0 : _a.xpByPriority) != null ? _b : DEFAULT_XP_BY_PRI;
    const labs = [...(_d = (_c = this.rules) == null ? void 0 : _c.xpByLabel) != null ? _d : /* @__PURE__ */ new Map()].filter(([, v]) => v !== 0);
    const sec = host.createDiv({ cls: "wd-game-formula" });
    sec.createSpan({ cls: "wd-game-formula-eq", text: "XP por tarefa = prioridade + \u03A3 etiquetas" });
    const parts = sec.createDiv({ cls: "wd-game-formula-parts" });
    const chip = (text) => parts.createSpan({ cls: "wd-game-formula-chip", text });
    chip(`p1 ${pri.p1}`);
    chip(`p2 ${pri.p2}`);
    chip(`p3 ${pri.p3}`);
    chip(`p4 ${pri.p4}`);
    for (const [name, v] of labs) chip(`@${name} ${v >= 0 ? "+" : ""}${v}`);
  }
  // Escopos (projetos/etiquetas): lista única com selos de origem (Cofre/Todoist/Hist) + nível,
  // e botão de ação na divergência (apagar histórico órfão / adicionar ao cofre / adicionar ao Todoist).
  renderScopes(host, s) {
    var _a, _b, _c, _d;
    this.renderScopeSection(
      host,
      "Projetos",
      "project",
      s.byProject,
      s.byProjectInfo,
      new Set((_b = (_a = this.rules) == null ? void 0 : _a.projects) != null ? _b : []),
      this.plugin.todo.knownProjects(),
      ""
    );
    this.renderScopeSection(
      host,
      "Etiquetas",
      "label",
      s.byLabel,
      s.byLabelInfo,
      new Set(((_d = (_c = this.rules) == null ? void 0 : _c.labels) != null ? _d : []).map((l) => l.name)),
      this.plugin.todo.knownLabels(),
      "@"
    );
  }
  renderScopeSection(host, title, kind, xpMap, infoMap, registered, known, prefix) {
    const todoReady = this.plugin.todo.hasData();
    const names = /* @__PURE__ */ new Set();
    for (const n of registered) names.add(n);
    if (todoReady) for (const n of known) names.add(n);
    for (const n of xpMap.keys()) if (n !== "\u2014") names.add(n);
    if (!names.size) return;
    const rows = [...names].map((name) => {
      var _a;
      return {
        name,
        xp: (_a = xpMap.get(name)) != null ? _a : 0,
        info: infoMap.get(name),
        inCofre: registered.has(name),
        inTodo: todoReady ? known.has(name) : null,
        inHist: xpMap.has(name)
      };
    }).sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
    const sec = host.createDiv({ cls: "wd-game-scopesec" });
    sec.createDiv({ cls: "wd-game-chart-title", text: title });
    const noun = kind === "project" ? "projeto" : "etiqueta";
    for (const r of rows) {
      const item = sec.createDiv({ cls: "wd-game-scope-item" });
      const head = item.createDiv({ cls: "wd-game-scope-head" });
      const left = head.createDiv({ cls: "wd-game-scope-left" });
      left.createSpan({ cls: "wd-game-scope-name", text: prefix + r.name });
      const src = left.createDiv({ cls: "wd-scope-srcs" });
      if (r.inCofre) src.createSpan({ cls: "wd-scope-src wd-scope-src-cofre", text: "Cofre" });
      if (r.inTodo) src.createSpan({ cls: "wd-scope-src wd-scope-src-todo", text: "Todoist" });
      if (r.inHist) src.createSpan({ cls: "wd-scope-src wd-scope-src-hist", text: "Hist" });
      const right = head.createDiv({ cls: "wd-game-scope-right" });
      if (r.info && r.xp > 0)
        right.createSpan({ cls: "wd-game-scope-meta", text: `Nv ${r.info.level} \xB7 ${r.xp} XP` + (r.info.max ? " \xB7 m\xE1x" : "") });
      let act = null;
      if (todoReady && r.inHist && !r.inCofre && r.inTodo === false)
        act = {
          label: "Apagar hist\xF3rico",
          danger: true,
          title: `Remove "${r.name}" do hist\xF3rico de XP (confirma antes)`,
          run: () => this.clearScopeHistory(kind, r.name)
        };
      else if (todoReady && r.inTodo && !r.inCofre)
        act = {
          label: "+ Cofre",
          title: `Adicionar \xE0s Regras e abrir para configurar os n\xEDveis deste ${noun}`,
          run: () => this.addScopeToRules(kind, r.name)
        };
      else if (r.inCofre && r.inTodo === false)
        act = {
          label: "+ Todoist",
          title: `Criar este ${noun} no Todoist`,
          run: () => this.addScopeToTodoist(kind, r.name)
        };
      if (act) {
        const btn = right.createSpan({ cls: "wd-view-btn wd-scope-act" + (act.danger ? " wd-scope-act-danger" : "") });
        btn.setText(act.label);
        btn.setAttr("title", act.title);
        const run = act.run;
        clickable(btn, () => void run());
      }
      if (r.info && r.xp > 0) {
        const bar = item.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
        bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${r.info.pct}%`;
        bar.setAttr("title", r.info.max ? "N\xEDvel m\xE1ximo do escopo" : `${r.info.into}/${r.info.forNext} XP para o n\xEDvel ${r.info.level + 1}`);
      }
    }
  }
  // Limpa um escopo do histórico (projeto → vira "Sem projeto"; etiqueta → removida dos eventos). XP total mantido.
  async clearScopeHistory(kind, name) {
    await this.ensureLoaded();
    const affected = kind === "project" ? this.events.filter((e) => (e.project || "\u2014") === name).length : this.events.filter((e) => e.labels.includes(name)).length;
    if (!affected) return;
    const ok = await confirmModal(this.app, {
      title: "Apagar do hist\xF3rico?",
      body: kind === "project" ? `Remover o projeto "${name}" do hist\xF3rico (${affected} evento(s) viram "Sem projeto"). O XP total \xE9 mantido.` : `Remover a etiqueta "@${name}" do hist\xF3rico (${affected} evento(s)). O XP total \xE9 mantido.`,
      cta: "Apagar"
    });
    if (!ok) return;
    for (const e of this.events) {
      if (kind === "project") {
        if ((e.project || "\u2014") === name) e.project = "";
      } else if (e.labels.includes(name)) e.labels = e.labels.filter((l) => l !== name);
    }
    await this.writeLog();
    this.rerenderAll();
    new import_obsidian.Notice(`Hist\xF3rico de "${name}" limpo.`);
  }
  // Adiciona um escopo às Regras (cofre) e abre a nota para configurar seus níveis.
  async addScopeToRules(kind, name) {
    var _a, _b;
    const path = this.rulesPath();
    let f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian.TFile)) {
      await this.openGameRules();
      f = this.app.vault.getAbstractFileByPath(path);
    }
    if (!(f instanceof import_obsidian.TFile)) return;
    const content = await this.app.vault.read(f);
    const rules = (_a = parseGameRules(content)) != null ? _a : defaultRules();
    if (kind === "project") {
      if (!rules.projects.includes(name)) rules.projects.push(name);
    } else if (!rules.labels.some((l) => l.name === name)) rules.labels.push({ name });
    const json = JSON.stringify(rulesToJsonObj(rules), null, 2);
    const next = (_b = replaceFirstJsonBlock(content, json)) != null ? _b : buildGameRulesContent(rules);
    await this.app.vault.modify(f, next);
    this.invalidate();
    await this.ensureLoaded();
    this.rerenderAll();
    await this.app.workspace.getLeaf(false).openFile(f);
    new import_obsidian.Notice(`"${name}" adicionado \xE0s Regras \u2014 configure os n\xEDveis na nota.`);
  }
  // Cria UM escopo no Todoist (não substitui o "Provisionar" em massa das Configurações).
  async addScopeToTodoist(kind, name) {
    var _a, _b;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) {
      new import_obsidian.Notice("Configure o token do Todoist.");
      return;
    }
    const color = kind === "label" ? (_b = (_a = this.rules) == null ? void 0 : _a.labels.find((l) => l.name === name)) == null ? void 0 : _b.color : void 0;
    try {
      if (kind === "project") await createTodoistProject(token, name);
      else await createTodoistLabel(token, name, color);
      await this.plugin.todo.fetch(true);
      this.rerenderAll();
      new import_obsidian.Notice(`"${name}" criado no Todoist.`);
    } catch (e) {
      new import_obsidian.Notice(`Falha: ${e instanceof Error ? e.message : String(e)}`);
    }
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
      if (f.path === GAME_LOG_PATH || f.path === this.settings.gameRulesPath || f.path === LEGACY_ACH_PATH) {
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
  // Provisiona o Todoist com os projetos/etiquetas declarados nas Regras (cria só os que faltam).
  // Assim a comunidade escreve as regras do jogo e o jogador só clica para preparar seu Todoist.
  async provisionTodoist() {
    const token = this.settings.todoistToken.trim();
    if (!token) {
      new import_obsidian.Notice("Configure o token do Todoist primeiro.");
      return;
    }
    await this.game.ensureLoaded();
    const { projects, labels } = this.game.provisionLists();
    if (!projects.length && !labels.length) {
      new import_obsidian.Notice("As Regras n\xE3o listam projetos nem etiquetas. Edite a nota de Regras (bot\xE3o \u270F\uFE0F).");
      return;
    }
    let existProjects, existLabels;
    try {
      const [ps, ls] = await Promise.all([fetchTodoistProjects(token), fetchTodoistLabels(token)]);
      existProjects = new Set(ps.map((p) => p.name));
      existLabels = new Set(ls.map((l) => l.name));
    } catch (e) {
      new import_obsidian.Notice("Falha ao consultar o Todoist: " + (e instanceof Error ? e.message : String(e)));
      return;
    }
    const newProjects = projects.filter((p) => !existProjects.has(p));
    const newLabels = labels.filter((l) => !existLabels.has(l.name));
    if (!newProjects.length && !newLabels.length) {
      new import_obsidian.Notice("Todos os projetos e etiquetas das Regras j\xE1 existem no Todoist. \u2705");
      return;
    }
    const items = [
      ...newProjects.map((p) => ({ text: `\u{1F4C1} ${p}` })),
      ...newLabels.map((l) => ({ text: `\u{1F3F7}\uFE0F ${l.name}` }))
    ];
    const ok = await confirmModal(this.app, {
      title: "Provisionar Todoist",
      body: `Criar ${newProjects.length} projeto(s) e ${newLabels.length} etiqueta(s) no Todoist?`,
      items,
      cta: "Criar"
    });
    if (!ok) return;
    let done = 0, failed = 0;
    for (const p of newProjects) {
      try {
        await createTodoistProject(token, p);
        done++;
      } catch (e) {
        failed++;
      }
    }
    for (const l of newLabels) {
      try {
        await createTodoistLabel(token, l.name, l.color);
        done++;
      } catch (e) {
        failed++;
      }
    }
    this.todo.reset();
    new import_obsidian.Notice(`Provisionamento: ${done} criado(s)` + (failed ? `, ${failed} falha(s)` : "") + ".");
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
    const ga = this.settings.gameAchievements;
    this.settings.gameAchievements = ga && typeof ga === "object" && !Array.isArray(ga) ? ga : {};
    this.settings.gameRulesPath = typeof this.settings.gameRulesPath === "string" && this.settings.gameRulesPath.trim() ? this.settings.gameRulesPath.trim() : DEFAULT_RULES_PATH;
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
    new import_obsidian.Setting(containerEl).setName("Nota de Regras (JSON)").setDesc("Caminho da nota com as regras do jogo (projetos, etiquetas, XP por prioridade/etiqueta, n\xEDveis e conquistas). Mude se o seu cofre n\xE3o usa o m\xE9todo PARA. O l\xE1pis abre \u2014 e cria, j\xE1 preenchida \u2014 a nota.").addText((t) => t.setPlaceholder(DEFAULT_RULES_PATH).setValue(plugin.settings.gameRulesPath).onChange(async (v) => {
      plugin.settings.gameRulesPath = v.trim() || DEFAULT_RULES_PATH;
      await plugin.saveSettings();
      plugin.game.invalidate();
      void plugin.game.ensureLoaded().then(() => plugin.game.rerenderAll());
    })).addExtraButton((b) => b.setIcon("pencil").setTooltip("Abrir / criar a nota de Regras").onClick(() => void plugin.game.openGameRules())).addExtraButton((b) => b.setIcon("book-open").setTooltip("Regenerar a documenta\xE7\xE3o da nota (mant\xE9m a sua configura\xE7\xE3o)").onClick(() => void plugin.game.regenerateRulesDoc()));
    new import_obsidian.Setting(containerEl).setName("Provisionar Todoist").setDesc('Cria no seu Todoist os projetos e etiquetas listados nas Regras (s\xF3 os que faltam). \xDAtil ao adotar um "jogo" feito pela comunidade.').addButton((b) => b.setButtonText("Criar projetos e etiquetas").onClick(() => void plugin.provisionTodoist()));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5jb25zdCBMU19UT0RPX0NBQ0hFID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6dG9kb2lzdENhY2hlXCI7ICAgLy8gY2FjaGUgb2ZmbGluZSBkbyBUb2RvaXN0IChwb3ItZGlzcG9zaXRpdm8pXG5jb25zdCBUT0RPX1RUTCA9IDUgKiA2MCAqIDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZGFkZSBtXHUwMEUxeC4gZG8gY2FjaGUgYW50ZXMgZGUgcmUtYnVzY2FyICg1IG1pbilcbmNvbnN0IFRPRE9fTUFYX1BBR0VTID0gNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRldG8gZGUgcFx1MDBFMWdpbmFzIHBhZ2luYWRhcyAoYW50aS1sb29wIHNlIGEgQVBJIHJlcGV0aXIgbyBjdXJzb3IpXG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM28gKHYwLjEzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEdBTUVfVklFV19UWVBFID0gXCJ3ZXJ1cy1nYW1lXCI7XG5jb25zdCBHQU1FX0xPR19QQVRIID0gXCIyMC5BcmVhcy9HYW1pZmljYVx1MDBFN1x1MDBFM28ubWRcIjsgICAgICAgIC8vIGxvZyBjYW5cdTAwRjRuaWNvIGRlIFhQIG5vIGNvZnJlXG5jb25zdCBHQU1FX0xPR19GRU5DRSA9IFwid2QtZ2FtZS1sb2dcIjsgICAgICAgICAgICAgICAgICAgLy8gYmxvY28gY2VyY2FkbyBjb20gb3MgZXZlbnRvcyAoMSBwb3IgbGluaGEpXG5jb25zdCBERUZBVUxUX1JVTEVTX1BBVEggPSBcIjIwLkFyZWFzL0dhbWlmaWNhXHUwMEU3XHUwMEUzbyBcdTIwMTQgUmVncmFzLm1kXCI7ICAgLy8gbm90YSBlZGl0XHUwMEUxdmVsIChibG9jbyBgYGBqc29uKSBjb20gYXMgcmVncmFzIGRvIGpvZ29cbmNvbnN0IExFR0FDWV9BQ0hfUEFUSCA9IFwiMjAuQXJlYXMvR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjAxNCBDb25xdWlzdGFzLm1kXCI7ICAvLyBub3RhIGFudGlnYSAoc1x1MDBGMyBjb25xdWlzdGFzKSBcdTIwMTQgbWlncmFkYSAxeCBwYXJhIGFzIFJlZ3Jhc1xuY29uc3QgSEFSVkVTVF9CQUNLRklMTF9EQVlTID0gOTA7ICAgICAgICAgICAgICAgICAgICAgICAvLyAxXHUwMEFBIGNvbGhlaXRhOiBqYW5lbGEgbVx1MDBFMXguIGRhIEFQSVxuLy8gWFAgYmFzZSBwb3IgcHJpb3JpZGFkZSBkYSBBUEkgKDQgPSBwMSBcdTIwMjYgMSA9IHA0KS5cbnR5cGUgUHJpS2V5ID0gXCJwMVwiIHwgXCJwMlwiIHwgXCJwM1wiIHwgXCJwNFwiO1xuY29uc3QgREVGQVVMVF9YUF9CWV9QUkk6IFJlY29yZDxQcmlLZXksIG51bWJlcj4gPSB7IHAxOiA4LCBwMjogNSwgcDM6IDMsIHA0OiAxIH07XG4vLyBBUEkgZG8gVG9kb2lzdDogcHJpb3JpdHkgNCA9IHAxICh1cmdlbnRlKSBcdTIwMjYgMSA9IHA0IChwYWRyXHUwMEUzbykuXG5mdW5jdGlvbiBwcmlLZXkocDogbnVtYmVyKTogUHJpS2V5IHsgcmV0dXJuIHAgPT09IDQgPyBcInAxXCIgOiBwID09PSAzID8gXCJwMlwiIDogcCA9PT0gMiA/IFwicDNcIiA6IFwicDRcIjsgfVxuXG4vLyB1aWQgY3VydG8gZSBlc3RcdTAwRTF2ZWwgKHBhY290ZXMgZGUgdGFyZWZhcykuXG5mdW5jdGlvbiB1aWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyk7XG59XG5cbnR5cGUgU3RhdHVzID0gXCJwcm9ncmVzc1wiIHwgXCJwYXVzZWRcIiB8IFwiY2FuY2VsbGVkXCI7XG50eXBlIFNlY3Rpb25JZCA9IFwiY2FsZW5kYXJcIiB8IFwicGFyYVwiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiIHwgXCJ0b2RvaXN0XCIgfCBcInN5bmNcIiB8IFwiZ2FtZVwiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG4gIC8vIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodjAuMTMpXG4gIGdhbWlmaWNhdGlvbkVuYWJsZWQ6IGJvb2xlYW47ICAvLyBtb3N0cmEgYSBzZVx1MDBFN1x1MDBFM28vYWJhIGRvIEdhbWVcbiAgZ2FtZVBlbmFsdHlGYWN0b3I6IG51bWJlcjsgICAgIC8vIFwiblx1MDBFM28gZmVpdG9cIiB0aXJhIGJhc2UgXHUwMEQ3IGZhdG9yXG4gIGdhbWVMYXN0SGFydmVzdDogc3RyaW5nOyAgICAgICAvLyBJU08gZGEgXHUwMEZBbHRpbWEgY29saGVpdGEgZGUgY29uY2x1XHUwMEVEZGFzIChsaW1pdGEgbyBmZXRjaClcbiAgZ2FtZUNoYXJ0TW9kZTogXCJiYXJzXCIgfCBcImxpbmVcIjsgICAgLy8gZ3JcdTAwRTFmaWNvIGRlIFhQIHBvciBkaWE6IGJhcnJhcyBvdSBsaW5oYSBjb20gcG9udG9zXG4gIGdyb3d0aENoYXJ0TW9kZTogXCJiYXJzXCIgfCBcImxpbmVcIjsgIC8vIGdyXHUwMEUxZmljbyBkZSBDcmVzY2ltZW50byBkbyBjb2ZyZTogYmFycmFzIG91IGxpbmhhXG4gIGdhbWVBY2hpZXZlbWVudHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47ICAvLyBpZCBkYSBjb25xdWlzdGEgXHUyMTkyIGRhdGEgSVNPIGRlIGRlc2Jsb3F1ZWlvXG4gIGdhbWVSdWxlc1BhdGg6IHN0cmluZzsgICAgICAgICAvLyBjYW1pbmhvIGRhIG5vdGEgZGUgUmVncmFzIChKU09OKSBcdTIwMTQgY29uZmlndXJcdTAwRTF2ZWwgcC8gY29mcmVzIHNlbSBQQVJBXG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhc2hTZXR0aW5ncyA9IHtcbiAgc2VjdGlvbk9yZGVyOiBbXCJzdGF0c1wiLCBcImdhbWVcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIGNhbGVuZGFyU291cmNlczogW1xuICAgIHsgcGF0aDogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgY29sb3I6IFwiIzNCODJGNlwiLCBvbjogdHJ1ZSB9LFxuICAgIHsgcGF0aDogXCI1MC5EaVx1MDBFMXJpb1wiLCAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzEwQjk4MVwiLCBvbjogdHJ1ZSB9LFxuICBdLFxuICB0b2RvaXN0VG9rZW46IFwiXCIsXG4gIHRvZG9pc3REYXlSYW5nZTogNyxcbiAgdG9kb2lzdEZpbHRlcnM6IHsgcHJvamVjdHM6IFtdLCBsYWJlbHM6IFtdIH0sXG4gIHRvZG9pc3RTaG93UHJvamVjdDogdHJ1ZSxcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGZhbHNlLFxuICBzeW5jdGhpbmdVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIsXG4gIHN5bmN0aGluZ0FwaUtleTogXCJcIixcbiAgc3luY3RoaW5nRm9sZGVySWQ6IFwiXCIsXG4gIHN5bmN0aGluZ1Nob3dDb3VudHM6IGZhbHNlLFxuICB0YXNrUGFja2FnZXM6IFtdLFxuICBwYWNrYWdlQ29uZmlybTogXCJtYW55XCIsXG4gIGdhbWlmaWNhdGlvbkVuYWJsZWQ6IHRydWUsXG4gIGdhbWVQZW5hbHR5RmFjdG9yOiAxLjUsXG4gIGdhbWVMYXN0SGFydmVzdDogXCJcIixcbiAgZ2FtZUNoYXJ0TW9kZTogXCJiYXJzXCIsXG4gIGdyb3d0aENoYXJ0TW9kZTogXCJiYXJzXCIsXG4gIGdhbWVBY2hpZXZlbWVudHM6IHt9LFxuICBnYW1lUnVsZXNQYXRoOiBERUZBVUxUX1JVTEVTX1BBVEgsXG59O1xuXG5pbnRlcmZhY2UgUGFyYVNlY3Rpb24ge1xuICBmb2xkZXI6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBhY2NlbnQ6IHN0cmluZztcbn1cblxuLy8gUGFzdGFzIFwiY29uaGVjaWRhc1wiIGRvIFBBUkE6IG1hbnRcdTAwRUFtIFx1MDBFRGNvbmUsIHJcdTAwRjN0dWxvIGUgY29yIGZpeG9zLiBBcyBkZW1haXMgcGFzdGFzXG4vLyBkbyBjb2ZyZSBzXHUwMEUzbyByZW5kZXJpemFkYXMgY29tIGNvciBhdXRvbVx1MDBFMXRpY2EgZSBcdTAwRURjb25lIHBhZHJcdTAwRTNvIChvdSBvIGljb246IGRvIHN0YXR1cy5tZCkuXG5jb25zdCBQQVJBOiBQYXJhU2VjdGlvbltdID0gW1xuICB7IGZvbGRlcjogXCIwMC5JbmJveFwiLCAgICAgaWNvbjogXCJcdUQ4M0RcdURDRTVcIiwgbGFiZWw6IFwiSW5ib3hcIiwgICAgYWNjZW50OiBcIiM2MzY2RjFcIiB9LFxuICB7IGZvbGRlcjogXCIxMC5Qcm9qZWN0c1wiLCAgaWNvbjogXCJcdUQ4M0RcdURFODBcIiwgbGFiZWw6IFwiUHJvamV0b3NcIiwgYWNjZW50OiBcIiMxMEI5ODFcIiB9LFxuICB7IGZvbGRlcjogXCIyMC5BcmVhc1wiLCAgICAgaWNvbjogXCJcdUQ4M0NcdURGQUZcIiwgbGFiZWw6IFwiXHUwMEMxcmVhc1wiLCAgICBhY2NlbnQ6IFwiI0Y1OUUwQlwiIH0sXG4gIHsgZm9sZGVyOiBcIjMwLlJlc291cmNlc1wiLCBpY29uOiBcIlx1RDgzRFx1RENEQVwiLCBsYWJlbDogXCJSZWN1cnNvc1wiLCBhY2NlbnQ6IFwiIzNCODJGNlwiIH0sXG4gIHsgZm9sZGVyOiBcIjQwLkFyY2hpdmVcIiwgICBpY29uOiBcIlx1RDgzRFx1RERDNFx1RkUwRlwiLCAgbGFiZWw6IFwiQXJxdWl2b1wiLCAgYWNjZW50OiBcIiM2QjcyODBcIiB9LFxuXTtcbmNvbnN0IFBBUkFfTUFQID0gbmV3IE1hcChQQVJBLm1hcChwID0+IFtwLmZvbGRlciwgcF0pKTtcblxuLy8gUGFsZXRhIHBhcmEgY29sb3JpciBwYXN0YXMgZGVzY29uaGVjaWRhcyBkZSBmb3JtYSBlc3RcdTAwRTF2ZWwgKHBvciBoYXNoIGRvIG5vbWUpLlxuY29uc3QgQUNDRU5UUyA9IFtcIiM2MzY2RjFcIixcIiMxMEI5ODFcIixcIiNGNTlFMEJcIixcIiMzQjgyRjZcIixcIiNFQzQ4OTlcIixcIiM4QjVDRjZcIixcIiMxNEI4QTZcIixcIiNFRjQ0NDRcIl07XG5cbmNvbnN0IERBWV9TSE9SVCA9IFtcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNcdTAwRTFiXCIsIFwiRG9tXCJdO1xuY29uc3QgTU9OVEhfU0hPUlQgPSBbXCJKYW5cIixcIkZldlwiLFwiTWFyXCIsXCJBYnJcIixcIk1haVwiLFwiSnVuXCIsXCJKdWxcIixcIkFnb1wiLFwiU2V0XCIsXCJPdXRcIixcIk5vdlwiLFwiRGV6XCJdO1xuY29uc3QgSU1HX0VYVCA9IFtcInBuZ1wiLFwianBnXCIsXCJqcGVnXCIsXCJ3ZWJwXCIsXCJnaWZcIixcInN2Z1wiXTtcblxuLy8gUGFzdGEgcmFpeiBkYXMgbm90YXMgZGlcdTAwRTFyaWFzIChjcmlhZGFzIGFvIGNsaWNhciBudW0gZGlhIGRvIGNhbGVuZFx1MDBFMXJpbykuXG5jb25zdCBEQUlMWV9GT0xERVIgPSBcIjUwLkRpXHUwMEUxcmlvXCI7XG4vLyBUZW1wbGF0ZSBvcGNpb25hbDsgcGxhY2Vob2xkZXJzIHt7ZGF0ZX19IChZWVlZLU1NLUREKSBlIHt7dGl0bGV9fSAoZGF0YSBwb3IgZXh0ZW5zbykuXG5jb25zdCBEQUlMWV9URU1QTEFURSA9IFwiTW9kZWxvcy9Ob3RhIERpXHUwMEUxcmlhLm1kXCI7XG5cbmNvbnN0IFNUQVRVU19JQ09OOiBSZWNvcmQ8U3RhdHVzLCBzdHJpbmc+ID0ge1xuICBwcm9ncmVzczogXCJcdTI1QjZcIiwgcGF1c2VkOiBcIlx1MjNGOFwiLCBjYW5jZWxsZWQ6IFwiXHUyNzE1XCIsXG59O1xuXG5jb25zdCBTRUNfQ0FMID0gXCJzZWM6Y2FsZW5kYXJcIjtcbmNvbnN0IFNFQ19QQVJBID0gXCJzZWM6cGFyYVwiO1xuY29uc3QgU0VDX0hFQVQgPSBcInNlYzpoZWF0bWFwXCI7XG5jb25zdCBTRUNfR1JPVyA9IFwic2VjOmdyb3d0aFwiO1xuY29uc3QgU0VDX1NUQVQgPSBcInNlYzpzdGF0c1wiO1xuY29uc3QgU0VDX1RPRE8gPSBcInNlYzp0b2RvaXN0XCI7XG5jb25zdCBTRUNfU1lOQyA9IFwic2VjOnN5bmNcIjtcbmNvbnN0IFNFQ19HQU1FID0gXCJzZWM6Z2FtZVwiO1xuXG4vLyBSXHUwMEYzdHVsb3MgYW1pZ1x1MDBFMXZlaXMgZGFzIHNlXHUwMEU3XHUwMEY1ZXMgKHVzYWRvcyBuYSBhYmEgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlxuY29uc3QgU0VDVElPTl9MQUJFTDogUmVjb3JkPFNlY3Rpb25JZCwgc3RyaW5nPiA9IHtcbiAgc3RhdHM6ICAgIFwiRXN0YXRcdTAwRURzdGljYXNcIixcbiAgdG9kb2lzdDogIFwiVGFyZWZhc1wiLFxuICBwYXJhOiAgICAgXCJDb2ZyZSAocGFzdGFzKVwiLFxuICBzeW5jOiAgICAgXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzb1wiLFxuICBoZWF0bWFwOiAgXCJBdGl2aWRhZGUgZG8gY29mcmVcIixcbiAgZ3Jvd3RoOiAgIFwiQ3Jlc2NpbWVudG8gZG8gY29mcmVcIixcbiAgY2FsZW5kYXI6IFwiUmVsYXRcdTAwRjNyaW9zXCIsXG4gIGdhbWU6ICAgICBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiLFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBUb2RvaXN0VGFzayB7XG4gIGlkOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJOiAxLi40LCBvbmRlIDQgPSB1cmdlbnRlICg9IHAxIG5hIFVJKVxuICBkdWU/OiB7IGRhdGU6IHN0cmluZzsgZGF0ZXRpbWU/OiBzdHJpbmc7IHN0cmluZz86IHN0cmluZzsgaXNfcmVjdXJyaW5nPzogYm9vbGVhbiB9IHwgbnVsbDtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbiAgaXNfY29tcGxldGVkPzogYm9vbGVhbjtcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHVybD86IHN0cmluZztcbiAgY29tcGxldGVkX2F0Pzogc3RyaW5nOyAgIC8vIHNcdTAwRjMgbmFzIGNvbmNsdVx1MDBFRGRhcyAoYnlfY29tcGxldGlvbl9kYXRlKVxufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG4vLyBObyBtb2RvIFwibWFueVwiLCBsYW5cdTAwRTdhciBtYWlzIHF1ZSBpc3RvIHBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvLlxuY29uc3QgTEFVTkNIX0NPTkZJUk1fTUlOID0gNTtcblxuLy8gXHUwMENEY29uZXMgc3VnZXJpZG9zIHBhcmEgb3MgcGFjb3RlcyAobm9tZXMgTHVjaWRlOyByZW5kZXJpemFkb3MgcG9yIHJlbmRlckljb24pLlxuY29uc3QgUEtHX0lDT05TID0gW1xuICBcInN1bnJpc2VcIiwgXCJzdW5cIiwgXCJzdW5zZXRcIiwgXCJtb29uXCIsIFwiY29mZmVlXCIsIFwidXRlbnNpbHNcIiwgXCJkdW1iYmVsbFwiLCBcImJvb2stb3BlblwiLFxuICBcImJyaWVmY2FzZVwiLCBcImdyYWR1YXRpb24tY2FwXCIsIFwiaG9tZVwiLCBcInNob3BwaW5nLWNhcnRcIiwgXCJoZWFydFwiLCBcImRyb3BsZXRcIiwgXCJwaWxsXCIsXG4gIFwiYmVkXCIsIFwiY2xvY2tcIiwgXCJjYWxlbmRhclwiLCBcImNoZWNrLWNoZWNrXCIsIFwibGlzdC1jaGVja3NcIiwgXCJ0YXJnZXRcIiwgXCJmbGFtZVwiLCBcInphcFwiLFxuICBcInN0YXJcIiwgXCJzcGFya2xlc1wiLCBcInJvY2tldFwiLCBcImJydXNoXCIsIFwibXVzaWNcIiwgXCJnYW1lcGFkLTJcIiwgXCJkb2dcIixcbl07XG5cbi8vIFNlcGFyYSBhcyBldGlxdWV0YXMgaW5saW5lIChAZXRpcXVldGEpIGRvIHRleHRvIGRlIHVtYSBsaW5oYSBkZSB0YXJlZmEuXG4vLyBEZXZvbHZlIG8gdFx1MDBFRHR1bG8gbGltcG8gKGVzdGlsbyBRdWljayBBZGQgZG8gVG9kb2lzdCkgKyBldGlxdWV0YXMgY29tYmluYWRhc1xuLy8gKGFzIGRvIHBhY290ZSBwcmltZWlybywgZGVwb2lzIGFzIGlubGluZSwgc2VtIGR1cGxpY2FyKS5cbmZ1bmN0aW9uIHNwbGl0VGFza0xhYmVscyhsaW5lOiBzdHJpbmcsIHBrZ0xhYmVsczogc3RyaW5nW10gPSBbXSk6IHsgdGl0bGU6IHN0cmluZzsgbGFiZWxzOiBzdHJpbmdbXTsgcHJpb3JpdHk6IG51bWJlciB9IHtcbiAgY29uc3QgaW5saW5lOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgcHJpb3JpdHkgPSAxOyAgIC8vIEFQSTogMSA9IHA0IChwYWRyXHUwMEUzbykgXHUyMDI2IDQgPSBwMVxuICAvLyBTXHUwMEYzIGBAZXRpcXVldGFgIC8gYHBOYCBubyBpblx1MDBFRGNpbyBvdSBkZXBvaXMgZGUgZXNwYVx1MDBFN28gKGxvb2tiZWhpbmQpIFx1MjAxNCBuXHUwMEUzbyBwZWdhIG8gXCJAZ21haWxcIlxuICAvLyBkZSB1bSBlLW1haWwgbmVtIG8gXCJwMVwiIGRlIFwidG9wMVwiLlxuICBjb25zdCBzdHJpcHBlZCA9IGxpbmVcbiAgICAucmVwbGFjZSgvKD88PV58XFxzKUAoW1xccHtMfVxccHtOfV9dKykvZ3UsIChfbSwgbmFtZTogc3RyaW5nKSA9PiB7IGlubGluZS5wdXNoKG5hbWUpOyByZXR1cm4gXCJcIjsgfSlcbiAgICAucmVwbGFjZSgvKD88PV58XFxzKXAoWzEtNF0pKD89XFxzfCQpL2dpLCAoX20sIGQ6IHN0cmluZykgPT4geyBwcmlvcml0eSA9IDUgLSBOdW1iZXIoZCk7IHJldHVybiBcIlwiOyB9KVxuICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csIFwiIFwiKS50cmltKCk7XG4gIGNvbnN0IHRpdGxlID0gc3RyaXBwZWQgfHwgbGluZS50cmltKCk7XG4gIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5wa2dMYWJlbHMsIC4uLmlubGluZV0pXTtcbiAgcmV0dXJuIHsgdGl0bGUsIGxhYmVscywgcHJpb3JpdHkgfTtcbn1cblxuLy8gQWNlc3NpYmlsaWRhZGU6IGZheiB1bSBlbGVtZW50byBjbGljXHUwMEUxdmVsIChkaXYvc3Bhbikgc2UgY29tcG9ydGFyIGNvbW8gYm90XHUwMEUzbyBcdTIwMTRcbi8vIGZvY28gcG9yIHRlY2xhZG8gKFRhYiksIHBhcGVsIEFSSUEgZSBhdGl2YVx1MDBFN1x1MDBFM28gcG9yIEVudGVyL0VzcGFcdTAwRTdvIChkaXNwYXJhIG8gcHJcdTAwRjNwcmlvXG4vLyBvbmNsaWNrKS4gTyBub21lIGFjZXNzXHUwMEVEdmVsIHZlbSBkbyB0ZXh0by9gdGl0bGVgIHF1ZSBvIGNoYW1hZG9yIGpcdTAwRTEgZGVmaW5lLlxuZnVuY3Rpb24gY2xpY2thYmxlPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWw6IFQsIGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKTogVCB7XG4gIGVsLm9uY2xpY2sgPSBoYW5kbGVyO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7IGUucHJldmVudERlZmF1bHQoKTsgZWwuY2xpY2soKTsgfVxuICB9KTtcbiAgcmV0dXJuIGVsO1xufVxuXG4vLyBQb3BvdmVyIGZsdXR1YW50ZSBnZW5cdTAwRTlyaWNvLCBhbmNvcmFkbyBudW0gZWxlbWVudG8uIGBmaWxsKGJvZHksIGNsb3NlKWAgbW9udGEgb1xuLy8gY29udGVcdTAwRkFkby4gRmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjYXBlIChvcHRzLm9uQ2xvc2Ugcm9kYSBhbnRlcyBkZSByZW1vdmVyKS5cbmZ1bmN0aW9uIG9wZW5Qb3BvdmVyKFxuICBhbmNob3I6IEhUTUxFbGVtZW50LFxuICBmaWxsOiAoYm9keTogSFRNTEVsZW1lbnQsIGNsb3NlOiAoKSA9PiB2b2lkKSA9PiB2b2lkLFxuICBvcHRzOiB7IGNscz86IHN0cmluZzsgd2lkdGg/OiBudW1iZXI7IG9uQ2xvc2U/OiAoKSA9PiB2b2lkOyBjb250YWluZXI/OiBIVE1MRWxlbWVudCB9ID0ge30sXG4pOiAoKSA9PiB2b2lkIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZC1wb3BcIikuZm9yRWFjaChlID0+IGUucmVtb3ZlKCkpO1xuICAvLyBQb3IgcGFkclx1MDBFM28gdml2ZSBubyBkb2N1bWVudC5ib2R5OyBkZW50cm8gZGEgbW9kYWwgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgcHJlY2lzYSB2aXZlciBub1xuICAvLyBjb250YWluZXIgZGEgYWJhIChzZW5cdTAwRTNvIGEgbW9kYWwgcHJlbmRlIG8gZm9jbyBlIG5cdTAwRTNvIGRcdTAwRTEgcGFyYSBkaWdpdGFyIG5vIHRleHRhcmVhKS5cbiAgY29uc3QgcG9wID0gKG9wdHMuY29udGFpbmVyID8/IGRvY3VtZW50LmJvZHkpLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3BcIiArIChvcHRzLmNscyA/IFwiIFwiICsgb3B0cy5jbHMgOiBcIlwiKSB9KTtcbiAgaWYgKG9wdHMud2lkdGgpIHBvcC5zdHlsZS53aWR0aCA9IGAke29wdHMud2lkdGh9cHhgO1xuXG4gIGNvbnN0IG9uRG9jID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgTm9kZTtcbiAgICBpZiAoIXBvcC5jb250YWlucyh0KSAmJiB0ICE9PSBhbmNob3IgJiYgIWFuY2hvci5jb250YWlucyh0KSkgY2xvc2UoKTtcbiAgfTtcbiAgY29uc3Qgb25LZXkgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4geyBpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpIGNsb3NlKCk7IH07XG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIG9wdHMub25DbG9zZT8uKCk7XG4gICAgcG9wLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Eb2MsIHRydWUpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5LCB0cnVlKTtcbiAgfVxuXG4gIGZpbGwocG9wLCBjbG9zZSk7XG5cbiAgY29uc3QgciA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcG9wLnN0eWxlLnRvcCA9IGAke3IuYm90dG9tICsgNH1weGA7XG4gIHBvcC5zdHlsZS5sZWZ0ID0gYCR7ci5sZWZ0fXB4YDtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBjb25zdCBwciA9IHBvcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAocHIucmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIHBvcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgd2luZG93LmlubmVyV2lkdGggLSBwci53aWR0aCAtIDgpfXB4YDtcbiAgICBpZiAocHIuYm90dG9tID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgcG9wLnN0eWxlLnRvcCA9IGAke01hdGgubWF4KDgsIHIudG9wIC0gcHIuaGVpZ2h0IC0gNCl9cHhgO1xuICB9KTtcblxuICAvLyBSZWdpc3RyYSBkZXBvaXMgZG8gY2xpcXVlIGRlIGFiZXJ0dXJhIHBhcmEgblx1MDBFM28gZmVjaGFyIGltZWRpYXRhbWVudGUuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Eb2MsIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5LCB0cnVlKTtcbiAgfSwgMCk7XG4gIHJldHVybiBjbG9zZTtcbn1cblxuLy8gUG9wb3ZlciBkZSBzZWxlXHUwMEU3XHUwMEUzbyBkZSBcdTAwRURjb25lIChwYWxldGEpLiBgY3VycmVudGAgPSBcdTAwRURjb25lIHNlbGVjaW9uYWRvIChkZXN0YWNhKS5cbmZ1bmN0aW9uIG9wZW5JY29uUG9wb3ZlcihhbmNob3I6IEhUTUxFbGVtZW50LCBjdXJyZW50OiBzdHJpbmcgfCB1bmRlZmluZWQsIG9uUGljazogKGljb246IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4gdm9pZCkge1xuICBvcGVuUG9wb3ZlcihhbmNob3IsIChwb3AsIGNsb3NlKSA9PiB7XG4gICAgY29uc3Qgbm9uZSA9IHBvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29ub3B0IHdkLXBrZy1pY29ubm9uZVwiICsgKCFjdXJyZW50ID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjAxNFwiIH0pO1xuICAgIG5vbmUuc2V0QXR0cihcInRpdGxlXCIsIFwiU2VtIFx1MDBFRGNvbmVcIik7XG4gICAgY2xpY2thYmxlKG5vbmUsICgpID0+IHsgb25QaWNrKHVuZGVmaW5lZCk7IGNsb3NlKCk7IH0pO1xuICAgIGZvciAoY29uc3QgaWMgb2YgUEtHX0lDT05TKSB7XG4gICAgICBjb25zdCBvcHQgPSBwb3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbm9wdFwiICsgKGN1cnJlbnQgPT09IGljID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgcmVuZGVySWNvbihvcHQsIGljKTtcbiAgICAgIG9wdC5zZXRBdHRyKFwidGl0bGVcIiwgaWMpO1xuICAgICAgY2xpY2thYmxlKG9wdCwgKCkgPT4geyBvblBpY2soaWMpOyBjbG9zZSgpOyB9KTtcbiAgICB9XG4gIH0sIHsgY2xzOiBcIndkLWljb24tcG9wXCIgfSk7XG59XG5cbi8vIEJ1c2NhIGFzIHRhcmVmYXMgYXRpdmFzIChuXHUwMEUzbyBjb25jbHVcdTAwRURkYXMpIHZpYSBBUEkgdW5pZmljYWRhIHYxIChhIFJFU1QgdjIgZm9pXG4vLyBhcG9zZW50YWRhIFx1MjE5MiByZXNwb25kaWEgNDEwKS4gQSB2MSBcdTAwRTkgcGFnaW5hZGE6IHsgcmVzdWx0cywgbmV4dF9jdXJzb3IgfS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RUYXNrW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0VGFza1tdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgLy8gdjEgZW52ZWxvcGEgZW0gcmVzdWx0czsgdG9sZXJhIHJlc3Bvc3RhIGNvbW8gYXJyYXkgcHVybyBwb3Igc2VndXJhblx1MDBFN2EuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFRhc2tbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvciAmJiArK3BhZ2VzIDwgVE9ET19NQVhfUEFHRVMpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdFByb2plY3Qge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8vIEJ1c2NhIG9zIHByb2pldG9zIChwYXJhIG8gZmlsdHJvKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhIGRhcyB0YXJlZmFzLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFByb2plY3RbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBwYWdlcyA9IDA7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Byb2plY3RzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RQcm9qZWN0W107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RQcm9qZWN0W10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RMYWJlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZzsgICAvLyBub21lIGRhIHBhbGV0YSAoZXguOiBcImNoYXJjb2FsXCIpXG59XG5cbi8vIEJ1c2NhIGFzIGV0aXF1ZXRhcyBwZXNzb2FpcyAocGFyYSBjb2xvcmlyIG9zIGNoaXBzKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RMYWJlbFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdExhYmVsW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBwYWdlcyA9IDA7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL2xhYmVsc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0TGFiZWxbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdExhYmVsW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFN5bmN0aGluZyAoQVBJIFJFU1QpIFx1MjAxNCB2MC4xMC4wIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgU1RGb2xkZXIgeyBpZDogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IHBhdXNlZDogYm9vbGVhbiB9XG5pbnRlcmZhY2UgU1REZXZpY2UgeyBkZXZpY2VJRDogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfVxuaW50ZXJmYWNlIFNUU3RhdHVzIHsgc3RhdGU6IHN0cmluZzsgbmVlZEZpbGVzOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBlcnJvcnM6IG51bWJlcjsgcHVsbEVycm9yczogbnVtYmVyIH1cbmludGVyZmFjZSBTVENvbXBsZXRpb24geyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlciB9XG5cbmludGVyZmFjZSBTeW5jRGV2Um93IHsgbmFtZTogc3RyaW5nOyBvbmxpbmU6IGJvb2xlYW47IGNvbXBsZXRpb246IG51bWJlcjsgZ2xvYmFsSXRlbXM6IG51bWJlcjsgbmVlZEl0ZW1zOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBuZWVkRGVsZXRlczogbnVtYmVyOyBsYXN0U2Vlbjogc3RyaW5nIH1cbmludGVyZmFjZSBTeW5jRGF0YSB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZm9sZGVyTGFiZWw6IHN0cmluZzsgZXJyb3JzOiBudW1iZXI7IGRldmljZXM6IFN5bmNEZXZSb3dbXSB9XG5cbmZ1bmN0aW9uIGh1bWFuQnl0ZXMobjogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKCFuKSByZXR1cm4gXCIwIEJcIjtcbiAgaWYgKG4gPCAxMDI0KSByZXR1cm4gYCR7bn0gQmA7XG4gIGlmIChuIDwgMTA0ODU3NikgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZChuIDwgMTAyNDAgPyAxIDogMCl9IEtCYDtcbiAgcmV0dXJuIGAkeyhuIC8gMTA0ODU3NikudG9GaXhlZChuIDwgMTA0ODU3NjAgPyAxIDogMCl9IE1CYDtcbn1cblxuZnVuY3Rpb24gcmVsVGltZShpc286IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIGlmIChpc05hTih0KSB8fCB0IDwgMSkgcmV0dXJuIFwiXHUyMDE0XCI7XG4gIGNvbnN0IHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gdCkgLyAxMDAwKTtcbiAgaWYgKHMgPCA2MCkgcmV0dXJuIFwiYWdvcmFcIjtcbiAgaWYgKHMgPCAzNjAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyA2MCl9IG1pbmA7XG4gIGlmIChzIDwgODY0MDApIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDM2MDApfSBoYDtcbiAgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gODY0MDApfSBkYDtcbn1cblxuLy8gR0VUIGdlblx1MDBFOXJpY28gbmEgQVBJIGRvIFN5bmN0aGluZyAoaGVhZGVyIFgtQVBJLUtleTsgcmVxdWVzdFVybCBpZ25vcmEgQ09SUykuXG5hc3luYyBmdW5jdGlvbiBzdEdldDxUPihiYXNlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgdXJsID0gYmFzZS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7IHVybCwgbWV0aG9kOiBcIkdFVFwiLCBoZWFkZXJzOiB7IFwiWC1BUEktS2V5XCI6IGtleSB9LCB0aHJvdzogZmFsc2UgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJBUEkga2V5IGludlx1MDBFMWxpZGEgKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVDtcbn1cblxuLy8gVVJMIHBhcmEgYWJyaXIgYSB0YXJlZmEgbm8gVG9kb2lzdCAodXNhIGEgZG8gcGF5bG9hZCBvdSBtb250YSBhIHBhcnRpciBkbyBpZCkuXG5mdW5jdGlvbiB0YXNrVXJsKHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHtcbiAgcmV0dXJuIHQudXJsID8/IGBodHRwczovL2FwcC50b2RvaXN0LmNvbS9hcHAvdGFzay8ke3QuaWR9YDtcbn1cblxuLy8gQ29uY2x1aSAoZmVjaGEpIHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gUE9TVCBzZW0gY29ycG87IDIwNCA9IHN1Y2Vzc28uIEZhc2UgOC4yLlxuYXN5bmMgZnVuY3Rpb24gY2xvc2VUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9jbG9zZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEVzY3JpdGE6IGNyaWFyIC8gZWRpdGFyIC8gbW92ZXIgLyBleGNsdWlyICh2MC44LjApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDYW1wb3MgZ3Jhdlx1MDBFMXZlaXMuIFRvZG9zIG9wY2lvbmFpcyBcdTIwMTQgbm8gZWRpdGFyIG1hbmRvIHNcdTAwRjMgbyBxdWUgbXVkb3UuXG5pbnRlcmZhY2UgVG9kb2lzdFdyaXRlIHtcbiAgY29udGVudD86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5PzogbnVtYmVyOyAgICAgLy8gMS4uNCAoNCA9IHVyZ2VudGUgLyBwMSBuYSBVSSlcbiAgZHVlX2RhdGU/OiBzdHJpbmc7ICAgICAvLyBkYXRhIGZpeGEgWVlZWS1NTS1ERCAodmluZG8gZG8gY2FsZW5kXHUwMEUxcmlvKVxuICBkdWVfc3RyaW5nPzogc3RyaW5nOyAgIC8vIGxpbmd1YWdlbSBuYXR1cmFsOyBcIm5vIGRhdGVcIiBsaW1wYSBhIGRhdGFcbiAgZHVlX2xhbmc/OiBzdHJpbmc7ICAgICAvLyBcInB0XCIgXHUyMTkyIGludGVycHJldGEgZW0gcG9ydHVndVx1MDBFQXNcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGpzb25IZWFkZXJzKHRva2VuOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH07XG59XG5cbi8vIENyaWEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3MgXHUyMTkyIDIwMCBjb20gYSB0YXJlZmEgY3JpYWRhLlxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgZmllbGRzOiBUb2RvaXN0V3JpdGUpOiBQcm9taXNlPFRvZG9pc3RUYXNrPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIixcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmaWVsZHMpLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFRvZG9pc3RUYXNrO1xufVxuXG4vLyBFZGl0YSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcy97aWR9IFx1MjE5MiAyMDAuIE5cdTAwRTNvIHRyb2NhIGRlIHByb2pldG8gKHVzZSBtb3ZlVG9kb2lzdFRhc2spLlxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgZmllbGRzOiBUb2RvaXN0V3JpdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmaWVsZHMpLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gTW92ZSBhIHRhcmVmYSBwYXJhIG91dHJvIHByb2pldG8uIFBPU1QgL3Rhc2tzL3tpZH0vbW92ZSBcdTIxOTIgMjAwLlxuYXN5bmMgZnVuY3Rpb24gbW92ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHByb2plY3RfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vbW92ZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwcm9qZWN0X2lkIH0pLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIENyaWEgdW0gcHJvamV0by4gUE9TVCAvcHJvamVjdHMgXHUyMTkyIDIwMCBjb20gbyBwcm9qZXRvIGNyaWFkby4gKFByb3Zpc2lvbmFtZW50byBkYXMgUmVncmFzLilcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRvZG9pc3RQcm9qZWN0KHRva2VuOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Byb2plY3RzXCIsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBuYW1lIH0pLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gQ3JpYSB1bWEgZXRpcXVldGEgcGVzc29hbC4gUE9TVCAvbGFiZWxzIFx1MjE5MiAyMDAuIGBjb2xvcmAgPSBub21lIGRlIHBhbGV0YSBkbyBUb2RvaXN0IChvcGNpb25hbCkuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVUb2RvaXN0TGFiZWwodG9rZW46IHN0cmluZywgbmFtZTogc3RyaW5nLCBjb2xvcj86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBib2R5OiB7IG5hbWU6IHN0cmluZzsgY29sb3I/OiBzdHJpbmcgfSA9IHsgbmFtZSB9O1xuICBpZiAoY29sb3IpIGJvZHkuY29sb3IgPSBjb2xvcjtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9sYWJlbHNcIixcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIEV4Y2x1aSBhIHRhcmVmYS4gREVMRVRFIC90YXNrcy97aWR9IFx1MjE5MiAyMDQuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDQgJiYgcmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR2FtaWZpY2FcdTAwRTdcdTAwRTNvOiBjb25jbHVcdTAwRURkYXMgKyBsb2cgbm8gY29mcmUgKyBjXHUwMEUxbGN1bG8gKHYwLjEzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQnVzY2EgY29uY2x1XHUwMEVEZGFzIHBvciBkYXRhIGRlIGNvbmNsdXNcdTAwRTNvLiBBUEkgdjE6IHsgaXRlbXMsIG5leHRfY3Vyc29yIH0sIHBhZ2luYWRhLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb21wbGV0ZWRUYXNrcyh0b2tlbjogc3RyaW5nLCBzaW5jZTogc3RyaW5nLCB1bnRpbDogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvY29tcGxldGVkL2J5X2NvbXBsZXRpb25fZGF0ZVwiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcInNpbmNlXCIsIHNpbmNlKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcInVudGlsXCIsIHVudGlsKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IGl0ZW1zPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgYWxsLnB1c2goLi4uKGRhdGEuaXRlbXMgPz8gW10pKTtcbiAgICBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7XG4gIH0gd2hpbGUgKGN1cnNvciAmJiArK3BhZ2VzIDwgVE9ET19NQVhfUEFHRVMpO1xuICByZXR1cm4gYWxsO1xufVxuXG4vLyBVbSBldmVudG8gZG8gbG9nIGRlIGdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodGFyZWZhIGZlaXRhID0gK1hQOyBuXHUwMEUzby1mZWl0YSA9IFx1MjIxMlhQKS5cbnR5cGUgR2FtZUV2ZW50VHlwZSA9IFwiZmVpdG9cIiB8IFwibmFvLWZlaXRvXCI7XG5pbnRlcmZhY2UgR2FtZUV2ZW50IHtcbiAgZGF0ZTogc3RyaW5nOyAgICAgLy8gWVlZWS1NTS1ERCAoZGlhIGxvY2FsIGRhIGNvbmNsdXNcdTAwRTNvL21hcmNhXHUwMEU3XHUwMEUzbylcbiAgdHlwZTogR2FtZUV2ZW50VHlwZTtcbiAgeHA6IG51bWJlcjsgICAgICAgLy8gYXNzaW5hZG9cbiAga2V5OiBzdHJpbmc7ICAgICAgLy8gaWRlbXBvdFx1MDBFQW5jaWE6IGAke3Rhc2tJZH18JHtjb21wbGV0ZWRfYXR8dHN9YFxuICBjb250ZW50OiBzdHJpbmc7XG4gIHByb2plY3Q6IHN0cmluZzsgIC8vIG5vbWUgZG8gcHJvamV0byAob3UgaWQgc2UgZGVzY29uaGVjaWRvKVxuICBsYWJlbHM6IHN0cmluZ1tdO1xuICBwcmk/OiBudW1iZXI7ICAgICAvLyBwcmlvcmlkYWRlIGRhIEFQSSAoMS4uNCkgbm8gbW9tZW50byBcdTIwMTQgcC8gcDFDb3VudCBjb20gWFAgY29uZmlndXJcdTAwRTF2ZWxcbn1cblxuaW50ZXJmYWNlIEdhbWVTdGF0cyB7XG4gIHRvdGFsWHA6IG51bWJlcjtcbiAgbGV2ZWw6IG51bWJlcjtcbiAgeHBJbnRvTGV2ZWw6IG51bWJlcjtcbiAgeHBGb3JOZXh0OiBudW1iZXI7XG4gIHN0cmVha0N1cnJlbnQ6IG51bWJlcjtcbiAgc3RyZWFrQmVzdDogbnVtYmVyO1xuICB0b2RheVhwOiBudW1iZXI7XG4gIHRvZGF5Q291bnQ6IG51bWJlcjtcbiAgZG9uZUNvdW50OiBudW1iZXI7ICAgLy8gdG90YWwgZGUgZXZlbnRvcyBcImZlaXRvXCIgKHZvbHVtZSlcbiAgcDFDb3VudDogbnVtYmVyOyAgICAgLy8gXCJmZWl0b1wiIGRlIHByaW9yaWRhZGUgcDEgKHBvciBlLnByaSwgY29tIGZhbGxiYWNrIGRlIFhQIG5vcyBldmVudG9zIGFudGlnb3MpXG4gIG1heERheVhwOiBudW1iZXI7ICAgIC8vIG1haW9yIFhQIG51bSBcdTAwRkFuaWNvIGRpYSAoXHUyMjY1MClcbiAgbGV2ZWxNYXg6IGJvb2xlYW47ICAgLy8gbyBuXHUwMEVEdmVsIGdlcmFsIGVzdFx1MDBFMSBubyB0ZXRvIGRhIGN1cnZhIChjdXJ2YSBwYWRyXHUwMEUzbyBcdTAwRTkgaWxpbWl0YWRhIFx1MjE5MiBmYWxzZSlcbiAgYnlEYXk6IE1hcDxzdHJpbmcsIHsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlciB9PjtcbiAgYnlQcm9qZWN0OiBNYXA8c3RyaW5nLCBudW1iZXI+OyAgICAgICAgLy8gWFAgYnJ1dG8gYWN1bXVsYWRvLCBzXHUwMEYzIFwiZmVpdG9cIlxuICBieUxhYmVsOiBNYXA8c3RyaW5nLCBudW1iZXI+OyAgICAgICAgICAvLyBpZGVtXG4gIGJ5UHJvamVjdEluZm86IE1hcDxzdHJpbmcsIExldmVsSW5mbz47IC8vIG5cdTAwRUR2ZWwvcHJvZ3Jlc3NvIHBvciBwcm9qZXRvIChyZXNwZWl0YSBjdXJ2YS90YWJlbGEgZG8gZXNjb3BvKVxuICBieUxhYmVsSW5mbzogTWFwPHN0cmluZywgTGV2ZWxJbmZvPjsgICAvLyBpZGVtIHBvciBldGlxdWV0YVxufVxuXG4vLyBBdmFsaWFkb3IgZGUgZlx1MDBGM3JtdWxhIEFSSVRNXHUwMEM5VElDQSBzZWd1cm8gKHNlbSBldmFsL0Z1bmN0aW9uIFx1MjAxNCBhcyBSZWdyYXMgc1x1MDBFM28gY29tcGFydGlsaFx1MDBFMXZlaXMpLlxuLy8gU3Vwb3J0YSBuXHUwMEZBbWVyb3MsIHZhcmlcdTAwRTF2ZWlzIHBlcm1pdGlkYXMsICsgLSAqIC8gJSwgXiAocG90XHUwMEVBbmNpYSwgZGlyZWl0YS1hc3NvYyksIHVuXHUwMEUxcmlvIC0sIGUgKCApLlxuLy8gQ29tcGlsYSB1bWEgdmV6IFx1MjE5MiAoZW52KSA9PiBuXHUwMEZBbWVybzsgbnVsbCBzZSBhIGV4cHJlc3NcdTAwRTNvIGZvciBpbnZcdTAwRTFsaWRhLlxudHlwZSBGb3JtdWxhRm4gPSAoZW52OiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+KSA9PiBudW1iZXI7XG5mdW5jdGlvbiBjb21waWxlRm9ybXVsYShzcmM6IHN0cmluZywgYWxsb3dlZDogc3RyaW5nW10pOiBGb3JtdWxhRm4gfCBudWxsIHtcbiAgY29uc3QgYWxsb3cgPSBuZXcgU2V0KGFsbG93ZWQpO1xuICBjb25zdCB0b2tzOiB7IHQ6IHN0cmluZzsgbj86IG51bWJlcjsgcz86IHN0cmluZyB9W10gPSBbXTtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICBjb25zdCBjID0gc3JjW2ldO1xuICAgIGlmICgvXFxzLy50ZXN0KGMpKSB7IGkrKzsgY29udGludWU7IH1cbiAgICBpZiAoL1swLTkuXS8udGVzdChjKSkge1xuICAgICAgbGV0IGogPSBpICsgMTtcbiAgICAgIHdoaWxlIChqIDwgc3JjLmxlbmd0aCAmJiAvWzAtOS5dLy50ZXN0KHNyY1tqXSkpIGorKztcbiAgICAgIGNvbnN0IG51bSA9IHNyYy5zbGljZShpLCBqKTtcbiAgICAgIGlmICghL15cXGQqXFwuP1xcZCskLy50ZXN0KG51bSkpIHJldHVybiBudWxsO1xuICAgICAgdG9rcy5wdXNoKHsgdDogXCJudW1cIiwgbjogTnVtYmVyKG51bSkgfSk7IGkgPSBqOyBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKC9bYS16QS1aX10vLnRlc3QoYykpIHtcbiAgICAgIGxldCBqID0gaSArIDE7XG4gICAgICB3aGlsZSAoaiA8IHNyYy5sZW5ndGggJiYgL1thLXpBLVowLTlfXS8udGVzdChzcmNbal0pKSBqKys7XG4gICAgICBjb25zdCBpZCA9IHNyYy5zbGljZShpLCBqKTtcbiAgICAgIGlmICghYWxsb3cuaGFzKGlkKSkgcmV0dXJuIG51bGw7XG4gICAgICB0b2tzLnB1c2goeyB0OiBcImlkXCIsIHM6IGlkIH0pOyBpID0gajsgY29udGludWU7XG4gICAgfVxuICAgIGlmIChcIistKi8lXigpXCIuaW5jbHVkZXMoYykpIHsgdG9rcy5wdXNoKHsgdDogYyB9KTsgaSsrOyBjb250aW51ZTsgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGxldCBwID0gMCwgYmFkID0gZmFsc2U7XG4gIGNvbnN0IGN1ciA9ICgpID0+IHRva3NbcF07XG4gIGZ1bmN0aW9uIHBhcnNlRXhwcigpOiBGb3JtdWxhRm4ge1xuICAgIGxldCBhID0gcGFyc2VUZXJtKCk7XG4gICAgd2hpbGUgKGN1cigpICYmIChjdXIoKS50ID09PSBcIitcIiB8fCBjdXIoKS50ID09PSBcIi1cIikpIHtcbiAgICAgIGNvbnN0IG9wID0gdG9rc1twKytdLnQsIGxlZnQgPSBhLCByaWdodCA9IHBhcnNlVGVybSgpO1xuICAgICAgYSA9IG9wID09PSBcIitcIiA/IChlKSA9PiBsZWZ0KGUpICsgcmlnaHQoZSkgOiAoZSkgPT4gbGVmdChlKSAtIHJpZ2h0KGUpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZVRlcm0oKTogRm9ybXVsYUZuIHtcbiAgICBsZXQgYSA9IHBhcnNlVW5hcnkoKTtcbiAgICB3aGlsZSAoY3VyKCkgJiYgKGN1cigpLnQgPT09IFwiKlwiIHx8IGN1cigpLnQgPT09IFwiL1wiIHx8IGN1cigpLnQgPT09IFwiJVwiKSkge1xuICAgICAgY29uc3Qgb3AgPSB0b2tzW3ArK10udCwgbGVmdCA9IGEsIHJpZ2h0ID0gcGFyc2VVbmFyeSgpO1xuICAgICAgYSA9IG9wID09PSBcIipcIiA/IChlKSA9PiBsZWZ0KGUpICogcmlnaHQoZSkgOiBvcCA9PT0gXCIvXCIgPyAoZSkgPT4gbGVmdChlKSAvIHJpZ2h0KGUpIDogKGUpID0+IGxlZnQoZSkgJSByaWdodChlKTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VVbmFyeSgpOiBGb3JtdWxhRm4ge1xuICAgIGlmIChjdXIoKSAmJiAoY3VyKCkudCA9PT0gXCItXCIgfHwgY3VyKCkudCA9PT0gXCIrXCIpKSB7XG4gICAgICBjb25zdCBvcCA9IHRva3NbcCsrXS50LCB4ID0gcGFyc2VVbmFyeSgpO1xuICAgICAgcmV0dXJuIG9wID09PSBcIi1cIiA/IChlKSA9PiAteChlKSA6IHg7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZVBvd2VyKCk7XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VQb3dlcigpOiBGb3JtdWxhRm4ge1xuICAgIGNvbnN0IGJhc2UgPSBwYXJzZVByaW1hcnkoKTtcbiAgICBpZiAoY3VyKCkgJiYgY3VyKCkudCA9PT0gXCJeXCIpIHsgcCsrOyBjb25zdCBleHAgPSBwYXJzZVVuYXJ5KCk7IHJldHVybiAoZSkgPT4gTWF0aC5wb3coYmFzZShlKSwgZXhwKGUpKTsgfVxuICAgIHJldHVybiBiYXNlO1xuICB9XG4gIGZ1bmN0aW9uIHBhcnNlUHJpbWFyeSgpOiBGb3JtdWxhRm4ge1xuICAgIGNvbnN0IHRrID0gY3VyKCk7XG4gICAgaWYgKCF0aykgeyBiYWQgPSB0cnVlOyByZXR1cm4gKCkgPT4gMDsgfVxuICAgIGlmICh0ay50ID09PSBcIm51bVwiKSB7IHArKzsgY29uc3QgbiA9IHRrLm4gPz8gMDsgcmV0dXJuICgpID0+IG47IH1cbiAgICBpZiAodGsudCA9PT0gXCJpZFwiKSB7IHArKzsgY29uc3QgcyA9IHRrLnMgPz8gXCJcIjsgcmV0dXJuIChlKSA9PiBlW3NdID8/IDA7IH1cbiAgICBpZiAodGsudCA9PT0gXCIoXCIpIHsgcCsrOyBjb25zdCB4ID0gcGFyc2VFeHByKCk7IGlmICghY3VyKCkgfHwgY3VyKCkudCAhPT0gXCIpXCIpIGJhZCA9IHRydWU7IGVsc2UgcCsrOyByZXR1cm4geDsgfVxuICAgIGJhZCA9IHRydWU7IHJldHVybiAoKSA9PiAwO1xuICB9XG4gIGNvbnN0IGZuID0gcGFyc2VFeHByKCk7XG4gIGlmIChiYWQgfHwgcCAhPT0gdG9rcy5sZW5ndGggfHwgdG9rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICByZXR1cm4gKGVudikgPT4geyBjb25zdCB2ID0gZm4oZW52KTsgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh2KSA/IHYgOiAwOyB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTlx1MDBFRHZlaXMgcG9yIGN1cnZhIChmXHUwMEYzcm11bGEpIG91IHRhYmVsYSAobGltaWFyZXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgREVGQVVMVF9MRVZFTF9DVVJWRSA9IFwiMTAwICogbl4yXCI7ICAgLy8gWFAgY3VtdWxhdGl2byBkbyBuXHUwMEVEdmVsIG4gKD0gXHUyMzBBXHUyMjFBKHhwLzEwMClcdTIzMEIsIHJldHJvY29tcGF0KVxuY29uc3QgTUFYX0xFVkVMX0lURVIgPSAxMDAwMDA7ICAgICAgICAgICAgIC8vIHRldG8gZGUgc2VndXJhblx1MDBFN2EgcC8gY3VydmFzIGlsaW1pdGFkYXNcbmludGVyZmFjZSBMZXZlbEluZm8geyBsZXZlbDogbnVtYmVyOyBpbnRvOiBudW1iZXI7IGZvck5leHQ6IG51bWJlcjsgcGN0OiBudW1iZXI7IG1heDogYm9vbGVhbiB9XG50eXBlIFRockZuID0gKG46IG51bWJlcikgPT4gbnVtYmVyOyAgICAgICAgLy8gWFAgY3VtdWxhdGl2byBwYXJhIGFsY2FuXHUwMEU3YXIgbyBuXHUwMEVEdmVsIG4gKG5cdTIyNjUxKSwgY3Jlc2NlbnRlXG5cbi8vIENvbXBpbGEgdW1hIGN1cnZhIFx1MjE5MiBUaHJGbjsgY2FpIG5vIHBhZHJcdTAwRTNvIHNlIGEgZlx1MDBGM3JtdWxhIGZvciBpbnZcdTAwRTFsaWRhLlxuZnVuY3Rpb24gY3VydmVUb1RocihjdXJ2ZTogc3RyaW5nKTogVGhyRm4ge1xuICBjb25zdCBmbiA9IGNvbXBpbGVGb3JtdWxhKGN1cnZlLCBbXCJuXCJdKSA/PyBjb21waWxlRm9ybXVsYShERUZBVUxUX0xFVkVMX0NVUlZFLCBbXCJuXCJdKSBhcyBGb3JtdWxhRm47XG4gIHJldHVybiAobikgPT4gZm4oeyBuIH0pO1xufVxuLy8gTlx1MDBFRHZlbCArIHByb2dyZXNzbyBhIHBhcnRpciBkZSB0aHIobikgZSBkbyBYUC4gbWF4TGV2ZWwgPSAwIFx1MjE5MiBpbGltaXRhZG87ID4wIFx1MjE5MiB0cmF2YSBvIG5cdTAwRUR2ZWwuXG5mdW5jdGlvbiBsZXZlbEZyb21UaHIoeHA6IG51bWJlciwgdGhyOiBUaHJGbiwgbWF4TGV2ZWw6IG51bWJlcik6IExldmVsSW5mbyB7XG4gIGNvbnN0IHggPSBNYXRoLm1heCgwLCB4cCk7XG4gIGxldCBsZXZlbCA9IDA7XG4gIGNvbnN0IGNhcCA9IG1heExldmVsID4gMCA/IG1heExldmVsIDogTUFYX0xFVkVMX0lURVI7XG4gIGxldCBwcmV2ID0gMDtcbiAgd2hpbGUgKGxldmVsIDwgY2FwKSB7XG4gICAgY29uc3QgbmVlZCA9IHRocihsZXZlbCArIDEpO1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG5lZWQpIHx8IG5lZWQgPiB4KSBicmVhaztcbiAgICBpZiAobGV2ZWwgPiAwICYmIG5lZWQgPD0gcHJldikgYnJlYWs7ICAgLy8gY3VydmEgblx1MDBFM28tY3Jlc2NlbnRlOiBwYXJhIChldml0YSB2YXJyZXIgYXRcdTAwRTkgbyB0ZXRvKVxuICAgIHByZXYgPSBuZWVkOyBsZXZlbCsrO1xuICB9XG4gIGNvbnN0IGF0TWF4ID0gbWF4TGV2ZWwgPiAwICYmIGxldmVsID49IG1heExldmVsO1xuICBjb25zdCBiYXNlID0gbGV2ZWwgPj0gMSA/IHRocihsZXZlbCkgOiAwO1xuICBjb25zdCBuZXh0ID0gYXRNYXggPyBiYXNlIDogdGhyKGxldmVsICsgMSk7XG4gIGNvbnN0IGludG8gPSBNYXRoLm1heCgwLCB4IC0gYmFzZSk7XG4gIGNvbnN0IGZvck5leHQgPSBNYXRoLm1heCgxLCAoTnVtYmVyLmlzRmluaXRlKG5leHQpID8gbmV4dCA6IGJhc2UpIC0gYmFzZSk7XG4gIGNvbnN0IHBjdCA9IGF0TWF4ID8gMTAwIDogTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKGludG8gLyBmb3JOZXh0ICogMTAwKSk7XG4gIHJldHVybiB7IGxldmVsLCBpbnRvLCBmb3JOZXh0LCBwY3QsIG1heDogYXRNYXggfTtcbn1cblxuLy8gR3JcdTAwRTFmaWNvIGRlIGxpbmhhIGNvbSBwb250b3MgKFNWRyByZXNwb25zaXZvKSBcdTIwMTQgcmV1c2FkbyBwZWxvIFhQL2RpYSBlIHBlbG8gQ3Jlc2NpbWVudG8uXG4vLyBBIGxpbmhhIFx1MDBFOSB1bSA8cG9seWxpbmU+IGNvbSBzdHJva2Ugblx1MDBFM28tZXNjYWxcdTAwRTF2ZWwgKGVzcGVzc3VyYSB1bmlmb3JtZSBhcGVzYXIgZG8gdmlld0JveFxuLy8gZXN0aWNhZG8pOyBvcyBwb250b3Mgc1x1MDBFM28gZGl2cyBIVE1MIHBvc2ljaW9uYWRvcyBlbSAlIChmaWNhbSByZWRvbmRvcyBlIGxldmFtIG8gdG9vbHRpcCkuXG5pbnRlcmZhY2UgTGluZVBvaW50IHsgdmFsdWU6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgaXNUb2RheTogYm9vbGVhbjsgdGlwOiBzdHJpbmcgfVxuZnVuY3Rpb24gcmVuZGVyTGluZUNoYXJ0KHBhcmVudDogSFRNTEVsZW1lbnQsIHBvaW50czogTGluZVBvaW50W10pOiB2b2lkIHtcbiAgY29uc3QgbiA9IHBvaW50cy5sZW5ndGg7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnBvaW50cy5tYXAocCA9PiBNYXRoLm1heCgwLCBwLnZhbHVlKSksIDEpO1xuICBjb25zdCB4UGN0ID0gKGk6IG51bWJlcikgPT4gbiA8PSAxID8gMCA6IChpIC8gKG4gLSAxKSkgKiAxMDA7XG4gIGNvbnN0IHlQY3QgPSAodjogbnVtYmVyKSA9PiAoMSAtIE1hdGgubWF4KDAsIHYpIC8gbWF4KSAqIDEwMDtcbiAgY29uc3QgY2hhcnQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxpbmUtY2hhcnRcIiB9KTtcbiAgY29uc3Qgd3JhcCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1saW5lLXdyYXBcIiB9KTtcbiAgY29uc3Qgc3ZnTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG4gIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOUywgXCJzdmdcIik7XG4gIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIDEwMCAxMDBcIik7XG4gIHN2Zy5zZXRBdHRyaWJ1dGUoXCJwcmVzZXJ2ZUFzcGVjdFJhdGlvXCIsIFwibm9uZVwiKTtcbiAgc3ZnLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwid2QtbGluZS1zdmdcIik7XG4gIGNvbnN0IHBvbHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTlMsIFwicG9seWxpbmVcIik7XG4gIHBvbHkuc2V0QXR0cmlidXRlKFwicG9pbnRzXCIsIHBvaW50cy5tYXAoKHAsIGkpID0+IGAke3hQY3QoaSl9LCR7eVBjdChwLnZhbHVlKX1gKS5qb2luKFwiIFwiKSk7XG4gIHBvbHkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ3ZC1saW5lLXBhdGhcIik7XG4gIHN2Zy5hcHBlbmRDaGlsZChwb2x5KTtcbiAgd3JhcC5hcHBlbmRDaGlsZChzdmcpO1xuICBwb2ludHMuZm9yRWFjaCgocCwgaSkgPT4ge1xuICAgIGNvbnN0IGRvdCA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxpbmUtZG90XCIgKyAocC5pc1RvZGF5ID8gXCIgd2QtbGluZS1kb3QtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgIGRvdC5zdHlsZS5sZWZ0ID0gYCR7eFBjdChpKX0lYDtcbiAgICBkb3Quc3R5bGUudG9wID0gYCR7eVBjdChwLnZhbHVlKX0lYDtcbiAgICBkb3Quc2V0QXR0cihcInRpdGxlXCIsIHAudGlwKTtcbiAgfSk7XG4gIGNvbnN0IGxibHMgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGluZS1sYmxzXCIgfSk7XG4gIHBvaW50cy5mb3JFYWNoKChwLCBpKSA9PiB7XG4gICAgY29uc3Qgc2hvdyA9IGkgPT09IDAgfHwgaSA9PT0gbiAtIDEgfHwgaSAlIDcgPT09IDA7XG4gICAgbGJscy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGluZS1sYmxcIiwgdGV4dDogc2hvdyA/IHAubGFiZWwgOiBcIlwiIH0pO1xuICB9KTtcbn1cblxuLy8gQ2FtcG9zIHNlcGFyYWRvcyBwb3IgVEFCIChyb2J1c3RvOiBjb250ZVx1MDBGQWRvL2NoYXZlIG5cdTAwRTNvIGNvbnRcdTAwRUFtIHRhYjsgYSBjaGF2ZSBwb2RlXG4vLyBjb250ZXIgXCJ8XCIgc2VtIGNvbGlkaXIpLiBUYWJzL3F1ZWJyYXMgbm8gdGV4dG8gc1x1MDBFM28gbmV1dHJhbGl6YWRvcy5cbmZ1bmN0aW9uIGVzY2FwZUdhbWVGaWVsZChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bXFxyXFxuXFx0XSsvZywgXCIgXCIpO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplR2FtZUV2ZW50KGU6IEdhbWVFdmVudCk6IHN0cmluZyB7XG4gIGNvbnN0IGxhYmVscyA9IGUubGFiZWxzLm1hcChsID0+IGVzY2FwZUdhbWVGaWVsZChsKS5yZXBsYWNlKC8sL2csIFwiIFwiKSkuam9pbihcIixcIik7XG4gIHJldHVybiBbZS5kYXRlLCBlLnR5cGUsIFN0cmluZyhlLnhwKSwgZS5rZXksIGVzY2FwZUdhbWVGaWVsZChlLmNvbnRlbnQpLCBlc2NhcGVHYW1lRmllbGQoZS5wcm9qZWN0KSwgbGFiZWxzLFxuICAgIGUucHJpICE9IG51bGwgPyBTdHJpbmcoZS5wcmkpIDogXCJcIl0uam9pbihcIlxcdFwiKTtcbn1cbmZ1bmN0aW9uIHBhcnNlR2FtZUV2ZW50TGluZShsaW5lOiBzdHJpbmcpOiBHYW1lRXZlbnQgfCBudWxsIHtcbiAgY29uc3QgcCA9IGxpbmUuc3BsaXQoXCJcXHRcIikubWFwKHMgPT4gcy50cmltKCkpO1xuICBpZiAocC5sZW5ndGggPCA0KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgW2RhdGUsIHR5cGUsIHhwUmF3LCBrZXksIGNvbnRlbnQgPSBcIlwiLCBwcm9qZWN0ID0gXCJcIiwgbGFiZWxzUmF3ID0gXCJcIiwgcHJpUmF3ID0gXCJcIl0gPSBwO1xuICBpZiAoIS9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KGRhdGUpKSByZXR1cm4gbnVsbDtcbiAgaWYgKHR5cGUgIT09IFwiZmVpdG9cIiAmJiB0eXBlICE9PSBcIm5hby1mZWl0b1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgeHAgPSBOdW1iZXIoeHBSYXcpO1xuICBpZiAoIU51bWJlci5pc0Zpbml0ZSh4cCkgfHwgIWtleSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGxhYmVscyA9IGxhYmVsc1JhdyA/IGxhYmVsc1Jhdy5zcGxpdChcIixcIikubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKSA6IFtdO1xuICBjb25zdCBwcmlOID0gTnVtYmVyKHByaVJhdyk7XG4gIGNvbnN0IGV2OiBHYW1lRXZlbnQgPSB7IGRhdGUsIHR5cGUsIHhwLCBrZXksIGNvbnRlbnQsIHByb2plY3QsIGxhYmVscyB9O1xuICBpZiAocHJpUmF3ICYmIE51bWJlci5pc0ludGVnZXIocHJpTikgJiYgcHJpTiA+PSAxICYmIHByaU4gPD0gNCkgZXYucHJpID0gcHJpTjtcbiAgcmV0dXJuIGV2O1xufVxuLy8gRXh0cmFpIG9zIGV2ZW50b3MgZG8gYmxvY28gY2VyY2FkbyBgYGB3ZC1nYW1lLWxvZyBcdTIwMjYgYGBgIGRhIG5vdGEuXG5mdW5jdGlvbiBwYXJzZUdhbWVMb2coY29udGVudDogc3RyaW5nKTogR2FtZUV2ZW50W10ge1xuICBjb25zdCBtID0gY29udGVudC5tYXRjaChuZXcgUmVnRXhwKFwiYGBgXCIgKyBHQU1FX0xPR19GRU5DRSArIFwiXFxcXHI/XFxcXG4oW1xcXFxzXFxcXFNdKj8pYGBgXCIpKTtcbiAgaWYgKCFtKSByZXR1cm4gW107XG4gIGNvbnN0IG91dDogR2FtZUV2ZW50W10gPSBbXTtcbiAgZm9yIChjb25zdCByYXcgb2YgbVsxXS5zcGxpdChcIlxcblwiKSkge1xuICAgIGNvbnN0IGV2ID0gcGFyc2VHYW1lRXZlbnRMaW5lKHJhdy50cmltKCkpO1xuICAgIGlmIChldikgb3V0LnB1c2goZXYpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4vLyBDb250ZVx1MDBGQWRvIGNvbXBsZXRvIGRhIG5vdGEgKGRldGVybWluXHUwMEVEc3RpY286IGV2ZW50b3Mgb3JkZW5hZG9zIFx1MjE5MiBtZXNtb3MgZXZlbnRvcyA9XG4vLyBtZXNtbyBhcnF1aXZvIGVtIHF1YWxxdWVyIGRpc3Bvc2l0aXZvLCBldml0YW5kbyBjb25mbGl0byBkZSBTeW5jdGhpbmcpLlxuZnVuY3Rpb24gYnVpbGRHYW1lTG9nQ29udGVudChldmVudHM6IEdhbWVFdmVudFtdKTogc3RyaW5nIHtcbiAgY29uc3Qgc29ydGVkID0gWy4uLmV2ZW50c10uc29ydCgoYSwgYikgPT5cbiAgICBhLmRhdGUgPCBiLmRhdGUgPyAtMSA6IGEuZGF0ZSA+IGIuZGF0ZSA/IDEgOiBhLmtleSA8IGIua2V5ID8gLTEgOiBhLmtleSA+IGIua2V5ID8gMSA6IDApO1xuICByZXR1cm4gW1xuICAgIFwiLS0tXCIsIFwib3duZXI6IFdlcnVzXCIsIFwicGVybWlzc2lvbnM6XCIsIFwiICByZWFkOiBbYWxsXVwiLCBcIiAgd3JpdGU6XCIsIFwiICAgIC0gV2VydXNcIiwgXCIgICAgLSBDbGF1ZGVcIixcbiAgICBcInJldmlld2VkOiBmYWxzZVwiLCBcInR5cGU6IHJlZmVyZW5jZVwiLCBcInRhZ3M6IFtnYW1pZmljYWNhb11cIiwgXCItLS1cIiwgXCJcIixcbiAgICBcIiMgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjAxNCBMb2cgZGUgWFBcIiwgXCJcIixcbiAgICBcIj4gQXJxdWl2byAqKmdlcmlkbyBwZWxvIHBsdWdpbiBXZXJ1cyBEYXNoYm9hcmQqKi4gQ2FkYSBsaW5oYSBkbyBibG9jbyBhYmFpeG8gXHUwMEU5IHVtIGV2ZW50b1wiLFxuICAgIFwiPiAodGFyZWZhIGZlaXRhID0gWFAgcG9zaXRpdm8sIG5cdTAwRTNvIGZlaXRhID0gWFAgbmVnYXRpdm8pLiBOXHUwMEUzbyBlZGl0ZSBcdTAwRTAgbVx1MDBFM28gXHUyMDE0IG8gcGFpbmVsIGRvXCIsXG4gICAgXCI+IHBsdWdpbiBtb3N0cmEgblx1MDBFRHZlbCwgc3RyZWFrIGUgZXN0YXRcdTAwRURzdGljYXMgYSBwYXJ0aXIgZGFxdWkuXCIsIFwiXCIsXG4gICAgXCJgYGBcIiArIEdBTUVfTE9HX0ZFTkNFLFxuICAgIHNvcnRlZC5tYXAoc2VyaWFsaXplR2FtZUV2ZW50KS5qb2luKFwiXFxuXCIpLFxuICAgIFwiYGBgXCIsIFwiXCIsXG4gIF0uam9pbihcIlxcblwiKTtcbn1cblxuLy8gU3RyZWFrIGF0dWFsIChhdFx1MDBFOSBob2plL29udGVtKSArIHJlY29yZGUsIGEgcGFydGlyIGRvcyBkaWFzIGNvbSBcdTIyNjUxIFwiZmVpdG9cIi5cbmZ1bmN0aW9uIGNvbXB1dGVTdHJlYWsoZG9uZURheXM6IFNldDxzdHJpbmc+KTogeyBzdHJlYWtDdXJyZW50OiBudW1iZXI7IHN0cmVha0Jlc3Q6IG51bWJlciB9IHtcbiAgaWYgKCFkb25lRGF5cy5zaXplKSByZXR1cm4geyBzdHJlYWtDdXJyZW50OiAwLCBzdHJlYWtCZXN0OiAwIH07XG4gIGNvbnN0IGRheU1zID0gODY0MDAwMDA7XG4gIGNvbnN0IHNvcnRlZCA9IFsuLi5kb25lRGF5c10uc29ydCgpO1xuICBsZXQgYmVzdCA9IDEsIHJ1biA9IDE7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc29ydGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKERhdGUucGFyc2Uoc29ydGVkW2ldICsgXCJUMDA6MDA6MDBcIikgLSBEYXRlLnBhcnNlKHNvcnRlZFtpIC0gMV0gKyBcIlQwMDowMDowMFwiKSA9PT0gZGF5TXMpIHtcbiAgICAgIHJ1bisrOyBiZXN0ID0gTWF0aC5tYXgoYmVzdCwgcnVuKTtcbiAgICB9IGVsc2UgcnVuID0gMTtcbiAgfVxuICBsZXQgY3VyID0gMDtcbiAgbGV0IGN1cnNvciA9IG5ldyBEYXRlKCk7IGN1cnNvci5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgaWYgKCFkb25lRGF5cy5oYXModG9LZXkoY3Vyc29yKSkpIGN1cnNvciA9IG5ldyBEYXRlKGN1cnNvci5nZXRUaW1lKCkgLSBkYXlNcyk7XG4gIHdoaWxlIChkb25lRGF5cy5oYXModG9LZXkoY3Vyc29yKSkpIHsgY3VyKys7IGN1cnNvciA9IG5ldyBEYXRlKGN1cnNvci5nZXRUaW1lKCkgLSBkYXlNcyk7IH1cbiAgcmV0dXJuIHsgc3RyZWFrQ3VycmVudDogY3VyLCBzdHJlYWtCZXN0OiBNYXRoLm1heChiZXN0LCBjdXIpIH07XG59XG5cbi8vIEVzdGF0XHUwMEVEc3RpY2FzIGEgcGFydGlyIGRvcyBldmVudG9zIGRvIGxvZyAoZm9udGUgY2FuXHUwMEY0bmljYSkuIGBjYXBzYCAob3BjaW9uYWwpIHRyYXZhIG8gWFAgYWN1bXVsYWRvXG4vLyBwb3IgcHJvamV0by9ldGlxdWV0YSBubyBtXHUwMEUxeGltbyBjb25maWd1cmFkbyBcdTIwMTQgc1x1MDBGMyBsaW1pdGEgb3MgZXNjb3BvcyBsaXN0YWRvczsgbyBYUC9uXHUwMEVEdmVsIGdlcmFsIG5cdTAwRTNvIG11ZGEuXG4vLyB0aHIobikgKyBuXHUwMEJBIG1cdTAwRTF4LiBkZSBuXHUwMEVEdmVpcyBwYXJhIHVtIGVzY29wbzogdGFiZWxhIGV4cGxcdTAwRURjaXRhIChsaW1pYXJlcykgb3UgY3VydmEgcHJcdTAwRjNwcmlhOyBzZW0gZGVmIFx1MjE5MiBjdXJ2YSBwYWRyXHUwMEUzbyBpbGltaXRhZGEuXG5mdW5jdGlvbiBzY29wZUxldmVsRm4oZGVmOiBTY29wZUxldmVsRGVmIHwgdW5kZWZpbmVkLCBkZWZhdWx0VGhyOiBUaHJGbik6IHsgdGhyOiBUaHJGbjsgbWF4OiBudW1iZXIgfSB7XG4gIGlmICghZGVmKSByZXR1cm4geyB0aHI6IGRlZmF1bHRUaHIsIG1heDogMCB9O1xuICBpZiAoZGVmLmtpbmQgPT09IFwidGFibGVcIikge1xuICAgIGNvbnN0IHQgPSBkZWYudGhyZXNob2xkcztcbiAgICByZXR1cm4geyB0aHI6IChuKSA9PiAobiA+PSAxICYmIG4gPD0gdC5sZW5ndGggPyB0W24gLSAxXSA6IEluZmluaXR5KSwgbWF4OiB0Lmxlbmd0aCB9O1xuICB9XG4gIHJldHVybiB7IHRocjogY3VydmVUb1RocihkZWYuY3VydmUpLCBtYXg6IGRlZi5sZXZlbHMgfTtcbn1cbi8vIE1haW9yIG5cdTAwRUR2ZWwgZW50cmUgb3MgZXNjb3BvcyAoaWdub3JhIGBza2lwYCwgZXguOiBcIlx1MjAxNFwiID0gc2VtIHByb2pldG8pLlxuZnVuY3Rpb24gbWF4U2NvcGVMZXZlbChpbmZvczogTWFwPHN0cmluZywgTGV2ZWxJbmZvPiwgc2tpcD86IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCBiZXN0ID0gMDtcbiAgZm9yIChjb25zdCBbbmFtZSwgaW5mb10gb2YgaW5mb3MpIHsgaWYgKHNraXAgJiYgbmFtZSA9PT0gc2tpcCkgY29udGludWU7IGJlc3QgPSBNYXRoLm1heChiZXN0LCBpbmZvLmxldmVsKTsgfVxuICByZXR1cm4gYmVzdDtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZUdhbWVTdGF0cyhldmVudHM6IEdhbWVFdmVudFtdLCBydWxlcz86IEdhbWVSdWxlcyk6IEdhbWVTdGF0cyB7XG4gIGNvbnN0IGJ5RGF5ID0gbmV3IE1hcDxzdHJpbmcsIHsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlciB9PigpO1xuICBjb25zdCBieVByb2plY3QgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBjb25zdCBieUxhYmVsID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgbGV0IHRvdGFsWHAgPSAwO1xuICBsZXQgZG9uZUNvdW50ID0gMDtcbiAgbGV0IHAxQ291bnQgPSAwO1xuICBjb25zdCBmYWxsYmFja1AxID0gREVGQVVMVF9YUF9CWV9QUkkucDE7ICAgLy8gZXZlbnRvcyBhbnRpZ29zIHNlbSBgcHJpYDogZGVkdXogcDEgcGVsbyBYUCBwYWRyXHUwMEUzbyBkZSBlbnRcdTAwRTNvXG4gIGZvciAoY29uc3QgZSBvZiBldmVudHMpIHtcbiAgICB0b3RhbFhwICs9IGUueHA7XG4gICAgY29uc3QgZCA9IGJ5RGF5LmdldChlLmRhdGUpID8/IHsgeHA6IDAsIGNvdW50OiAwIH07XG4gICAgZC54cCArPSBlLnhwO1xuICAgIGlmIChlLnR5cGUgPT09IFwiZmVpdG9cIikge1xuICAgICAgZC5jb3VudCArPSAxOyBkb25lQ291bnQgKz0gMTtcbiAgICAgIGlmIChlLnByaSAhPSBudWxsID8gZS5wcmkgPT09IDQgOiBlLnhwID09PSBmYWxsYmFja1AxKSBwMUNvdW50ICs9IDE7XG4gICAgfVxuICAgIGJ5RGF5LnNldChlLmRhdGUsIGQpO1xuICAgIGlmIChlLnR5cGUgPT09IFwiZmVpdG9cIikge1xuICAgICAgY29uc3QgcHJvaiA9IGUucHJvamVjdCB8fCBcIlx1MjAxNFwiO1xuICAgICAgYnlQcm9qZWN0LnNldChwcm9qLCAoYnlQcm9qZWN0LmdldChwcm9qKSA/PyAwKSArIGUueHApO1xuICAgICAgZm9yIChjb25zdCBsIG9mIGUubGFiZWxzKSBieUxhYmVsLnNldChsLCAoYnlMYWJlbC5nZXQobCkgPz8gMCkgKyBlLnhwKTtcbiAgICB9XG4gIH1cbiAgaWYgKHRvdGFsWHAgPCAwKSB0b3RhbFhwID0gMDtcbiAgbGV0IG1heERheVhwID0gMDtcbiAgZm9yIChjb25zdCBkIG9mIGJ5RGF5LnZhbHVlcygpKSBpZiAoZC54cCA+IG1heERheVhwKSBtYXhEYXlYcCA9IGQueHA7XG5cbiAgY29uc3QgZGVmVGhyID0gY3VydmVUb1RocihydWxlcz8ubGV2ZWxDdXJ2ZSA/PyBERUZBVUxUX0xFVkVMX0NVUlZFKTtcbiAgY29uc3QgZ2kgPSBsZXZlbEZyb21UaHIodG90YWxYcCwgZGVmVGhyLCAwKTtcbiAgY29uc3Qgc2NvcGVJbmZvID0gKG06IE1hcDxzdHJpbmcsIG51bWJlcj4sIGRlZnM/OiBNYXA8c3RyaW5nLCBTY29wZUxldmVsRGVmPik6IE1hcDxzdHJpbmcsIExldmVsSW5mbz4gPT4ge1xuICAgIGNvbnN0IG91dCA9IG5ldyBNYXA8c3RyaW5nLCBMZXZlbEluZm8+KCk7XG4gICAgZm9yIChjb25zdCBbbmFtZSwgeHBdIG9mIG0pIHtcbiAgICAgIGNvbnN0IHsgdGhyLCBtYXggfSA9IHNjb3BlTGV2ZWxGbihkZWZzPy5nZXQobmFtZSksIGRlZlRocik7XG4gICAgICBvdXQuc2V0KG5hbWUsIGxldmVsRnJvbVRocih4cCwgdGhyLCBtYXgpKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgYnlQcm9qZWN0SW5mbyA9IHNjb3BlSW5mbyhieVByb2plY3QsIHJ1bGVzPy5zY29wZUxldmVscy5wcm9qZWN0cyk7XG4gIGNvbnN0IGJ5TGFiZWxJbmZvID0gc2NvcGVJbmZvKGJ5TGFiZWwsIHJ1bGVzPy5zY29wZUxldmVscy5sYWJlbHMpO1xuXG4gIGNvbnN0IGRvbmVEYXlzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgZSBvZiBldmVudHMpIGlmIChlLnR5cGUgPT09IFwiZmVpdG9cIikgZG9uZURheXMuYWRkKGUuZGF0ZSk7XG4gIGNvbnN0IHsgc3RyZWFrQ3VycmVudCwgc3RyZWFrQmVzdCB9ID0gY29tcHV0ZVN0cmVhayhkb25lRGF5cyk7XG4gIGNvbnN0IHRvZGF5ID0gYnlEYXkuZ2V0KHRvS2V5KG5ldyBEYXRlKCkpKSA/PyB7IHhwOiAwLCBjb3VudDogMCB9O1xuICByZXR1cm4ge1xuICAgIHRvdGFsWHAsIGxldmVsOiBnaS5sZXZlbCwgeHBJbnRvTGV2ZWw6IGdpLmludG8sIHhwRm9yTmV4dDogZ2kuZm9yTmV4dCwgbGV2ZWxNYXg6IGdpLm1heCxcbiAgICBzdHJlYWtDdXJyZW50LCBzdHJlYWtCZXN0LFxuICAgIHRvZGF5WHA6IHRvZGF5LnhwLCB0b2RheUNvdW50OiB0b2RheS5jb3VudCxcbiAgICBkb25lQ291bnQsIHAxQ291bnQsIG1heERheVhwLFxuICAgIGJ5RGF5LCBieVByb2plY3QsIGJ5TGFiZWwsIGJ5UHJvamVjdEluZm8sIGJ5TGFiZWxJbmZvLFxuICB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgQ29ucXVpc3RhcyAoYmFkZ2VzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERlcml2YWRhcyBzXHUwMEYzIGRlIEdhbWVTdGF0cyAoalx1MDBFMSBjYWxjdWxhZG8pIFx1MjAxNCBzZW0gY2hhbWFkYSBleHRyYSBhbyBUb2RvaXN0LlxuLy8gRGVzYmxvcXVlYWRhIHF1YW5kbyB2YWx1ZShzKSA+PSBnb2FsOyBwZXJtYW5lbnRlICh1bWEgdmV6IGdhbmhhLCBmaWNhIFx1MjAxNCBwdW5pXHUwMEU3XHUwMEUzbyBuXHUwMEUzbyByZS1ibG9xdWVpYSkuXG50eXBlIE1ldHJpY0lkID0gXCJsZXZlbFwiIHwgXCJ0b3RhbFhwXCIgfCBcImRvbmVDb3VudFwiIHwgXCJwMUNvdW50XCIgfCBcIm1heERheVhwXCJcbiAgfCBcInN0cmVha0Jlc3RcIiB8IFwic3RyZWFrQ3VycmVudFwiIHwgXCJwcm9qZWN0TGV2ZWxcIiB8IFwibGFiZWxMZXZlbFwiO1xuLy8gVm9jYWJ1bFx1MDBFMXJpbyBkZSBtXHUwMEU5dHJpY2FzIHF1ZSB1bWEgY29ucXVpc3RhIChvdSBmdXR1cmEgbWV0YSkgcG9kZSBtZWRpciBcdTIwMTQgYSBcdTAwREFOSUNBIHBhcnRlIGVtIGNcdTAwRjNkaWdvLlxuLy8gUGFyYSBjcmlhciBjb25xdWlzdGFzIHZpYSBub3RhLCB1c2UgdW0gZGVzdGVzIG5vbWVzIGVtIFwibWV0cmljXCIuIEFkaWNpb25hciB1bWEgbVx1MDBFOXRyaWNhIG5vdmEgYXF1aVxuLy8gYSB0b3JuYSBkaXNwb25cdTAwRUR2ZWwgcGFyYSB0b2Rvcy5cbmNvbnN0IE1FVFJJQ1M6IFJlY29yZDxNZXRyaWNJZCwgKHM6IEdhbWVTdGF0cykgPT4gbnVtYmVyPiA9IHtcbiAgbGV2ZWw6ICAgICAgICAgcyA9PiBzLmxldmVsLFxuICB0b3RhbFhwOiAgICAgICBzID0+IHMudG90YWxYcCxcbiAgZG9uZUNvdW50OiAgICAgcyA9PiBzLmRvbmVDb3VudCxcbiAgcDFDb3VudDogICAgICAgcyA9PiBzLnAxQ291bnQsXG4gIG1heERheVhwOiAgICAgIHMgPT4gcy5tYXhEYXlYcCxcbiAgc3RyZWFrQmVzdDogICAgcyA9PiBzLnN0cmVha0Jlc3QsXG4gIHN0cmVha0N1cnJlbnQ6IHMgPT4gcy5zdHJlYWtDdXJyZW50LFxuICBwcm9qZWN0TGV2ZWw6ICBzID0+IG1heFNjb3BlTGV2ZWwocy5ieVByb2plY3RJbmZvLCBcIlx1MjAxNFwiKSxcbiAgbGFiZWxMZXZlbDogICAgcyA9PiBtYXhTY29wZUxldmVsKHMuYnlMYWJlbEluZm8pLFxufTtcbmNvbnN0IE1FVFJJQ19MQUJFTFM6IFJlY29yZDxNZXRyaWNJZCwgc3RyaW5nPiA9IHtcbiAgbGV2ZWw6IFwiTlx1MDBFRHZlbCBnZXJhbFwiLFxuICB0b3RhbFhwOiBcIlhQIHRvdGFsIGFjdW11bGFkb1wiLFxuICBkb25lQ291bnQ6IFwiVGFyZWZhcyBjb25jbHVcdTAwRURkYXMgKHRvdGFsKVwiLFxuICBwMUNvdW50OiBcIlRhcmVmYXMgcDEgY29uY2x1XHUwMEVEZGFzXCIsXG4gIG1heERheVhwOiBcIk1haW9yIFhQIG51bSBcdTAwRkFuaWNvIGRpYVwiLFxuICBzdHJlYWtCZXN0OiBcIk1haW9yIHNlcXVcdTAwRUFuY2lhIGRlIGRpYXNcIixcbiAgc3RyZWFrQ3VycmVudDogXCJTZXF1XHUwMEVBbmNpYSBkZSBkaWFzIGF0dWFsXCIsXG4gIHByb2plY3RMZXZlbDogXCJNYWlvciBuXHUwMEVEdmVsIGVudHJlIG9zIHByb2pldG9zXCIsXG4gIGxhYmVsTGV2ZWw6IFwiTWFpb3Igblx1MDBFRHZlbCBlbnRyZSBhcyBldGlxdWV0YXNcIixcbn07XG4vLyBDb25xdWlzdGEgPSBEQURPIHB1cm8gKHNlcmlhbGl6XHUwMEUxdmVsIGVtIEpTT04pOiBpZCwgdFx1MDBFRHR1bG8sIFx1MDBFRGNvbmUsIGNhdGVnb3JpYSArIG1cdTAwRTl0cmljYSBlIGxpbWlhci5cbi8vIERlc2Jsb3F1ZWlhIHF1YW5kbyBNRVRSSUNTW21ldHJpY10oc3RhdHMpID49IGdvYWw7IHBlcm1hbmVudGUgKHB1bmlcdTAwRTdcdTAwRTNvIG5cdTAwRTNvIHJlLWJsb3F1ZWlhKS5cbmludGVyZmFjZSBBY2hpZXZlbWVudCB7XG4gIGlkOiBzdHJpbmc7XG4gIGNhdDogc3RyaW5nOyAgICAgICAgLy8gY2F0ZWdvcmlhIChjYWJlXHUwMEU3YWxobyBuYSBVSSlcbiAgdGl0bGU6IHN0cmluZztcbiAgZGVzYzogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7ICAgICAgIC8vIEx1Y2lkZVxuICBtZXRyaWM6IE1ldHJpY0lkO1xuICBnb2FsOiBudW1iZXI7XG59XG4vLyBMaXN0YSBwYWRyXHUwMEUzbyBlbWJ1dGlkYS4gTyBjYW1wbyBgYWNoaWV2ZW1lbnRzYCBkYSBub3RhIGRlIFJlZ3JhcyBwb2RlIHN1YnN0aXR1XHUwMEVELWxhIHBvciBjb21wbGV0by5cbmNvbnN0IERFRkFVTFRfQUNISUVWRU1FTlRTOiBBY2hpZXZlbWVudFtdID0gW1xuICAvLyBOXHUwMEVEdmVsIChnZXJhbClcbiAgeyBpZDogXCJsdmw1XCIsICBjYXQ6IFwiTlx1MDBFRHZlbFwiLCB0aXRsZTogXCJBcHJlbmRpelwiLCBkZXNjOiBcIkFsY2FuY2UgbyBuXHUwMEVEdmVsIDVcIiwgIGljb246IFwic3RhclwiLCAgZ29hbDogNSwgIG1ldHJpYzogXCJsZXZlbFwiIH0sXG4gIHsgaWQ6IFwibHZsMTBcIiwgY2F0OiBcIk5cdTAwRUR2ZWxcIiwgdGl0bGU6IFwiVmV0ZXJhbm9cIiwgZGVzYzogXCJBbGNhbmNlIG8gblx1MDBFRHZlbCAxMFwiLCBpY29uOiBcIm1lZGFsXCIsIGdvYWw6IDEwLCBtZXRyaWM6IFwibGV2ZWxcIiB9LFxuICB7IGlkOiBcImx2bDIwXCIsIGNhdDogXCJOXHUwMEVEdmVsXCIsIHRpdGxlOiBcIk1lc3RyZVwiLCAgIGRlc2M6IFwiQWxjYW5jZSBvIG5cdTAwRUR2ZWwgMjBcIiwgaWNvbjogXCJjcm93blwiLCBnb2FsOiAyMCwgbWV0cmljOiBcImxldmVsXCIgfSxcbiAgLy8gU2VxdVx1MDBFQW5jaWEgKHN0cmVhayByZWNvcmRlKVxuICB7IGlkOiBcInN0cmVhazNcIiwgICBjYXQ6IFwiU2VxdVx1MDBFQW5jaWFcIiwgdGl0bGU6IFwiUGVnYW5kbyBvIHJpdG1vXCIsIGRlc2M6IFwiMyBkaWFzIHNlZ3VpZG9zIGNvbSB0YXJlZmFcIiwgICBpY29uOiBcImZsYW1lXCIsIGdvYWw6IDMsICAgbWV0cmljOiBcInN0cmVha0Jlc3RcIiB9LFxuICB7IGlkOiBcInN0cmVhazdcIiwgICBjYXQ6IFwiU2VxdVx1MDBFQW5jaWFcIiwgdGl0bGU6IFwiU2VtYW5hIGNoZWlhXCIsICAgIGRlc2M6IFwiNyBkaWFzIHNlZ3VpZG9zIGNvbSB0YXJlZmFcIiwgICBpY29uOiBcImZsYW1lXCIsIGdvYWw6IDcsICAgbWV0cmljOiBcInN0cmVha0Jlc3RcIiB9LFxuICB7IGlkOiBcInN0cmVhazMwXCIsICBjYXQ6IFwiU2VxdVx1MDBFQW5jaWFcIiwgdGl0bGU6IFwiTVx1MDBFQXMgZGUgZm9nb1wiLCAgICAgZGVzYzogXCIzMCBkaWFzIHNlZ3VpZG9zIGNvbSB0YXJlZmFcIiwgIGljb246IFwiZmxhbWVcIiwgZ29hbDogMzAsICBtZXRyaWM6IFwic3RyZWFrQmVzdFwiIH0sXG4gIHsgaWQ6IFwic3RyZWFrMTAwXCIsIGNhdDogXCJTZXF1XHUwMEVBbmNpYVwiLCB0aXRsZTogXCJDZW50dXJpXHUwMEUzb1wiLCAgICAgICBkZXNjOiBcIjEwMCBkaWFzIHNlZ3VpZG9zIGNvbSB0YXJlZmFcIiwgaWNvbjogXCJmbGFtZVwiLCBnb2FsOiAxMDAsIG1ldHJpYzogXCJzdHJlYWtCZXN0XCIgfSxcbiAgLy8gVm9sdW1lICh0YXJlZmFzIGNvbmNsdVx1MDBFRGRhcylcbiAgeyBpZDogXCJ2b2wxMFwiLCAgIGNhdDogXCJWb2x1bWVcIiwgdGl0bGU6IFwiUHJpbWVpcm9zIHBhc3Nvc1wiLCBkZXNjOiBcIjEwIHRhcmVmYXMgY29uY2x1XHUwMEVEZGFzXCIsICAgaWNvbjogXCJjaGVjay1jaGVja1wiLCBnb2FsOiAxMCwgICBtZXRyaWM6IFwiZG9uZUNvdW50XCIgfSxcbiAgeyBpZDogXCJ2b2w1MFwiLCAgIGNhdDogXCJWb2x1bWVcIiwgdGl0bGU6IFwiRW5ncmVuYW5kb1wiLCAgICAgICBkZXNjOiBcIjUwIHRhcmVmYXMgY29uY2x1XHUwMEVEZGFzXCIsICAgaWNvbjogXCJjaGVjay1jaGVja1wiLCBnb2FsOiA1MCwgICBtZXRyaWM6IFwiZG9uZUNvdW50XCIgfSxcbiAgeyBpZDogXCJ2b2wxMDBcIiwgIGNhdDogXCJWb2x1bWVcIiwgdGl0bGU6IFwiQ2VudGVuYVwiLCAgICAgICAgICBkZXNjOiBcIjEwMCB0YXJlZmFzIGNvbmNsdVx1MDBFRGRhc1wiLCAgaWNvbjogXCJjaGVjay1jaGVja1wiLCBnb2FsOiAxMDAsICBtZXRyaWM6IFwiZG9uZUNvdW50XCIgfSxcbiAgeyBpZDogXCJ2b2w1MDBcIiwgIGNhdDogXCJWb2x1bWVcIiwgdGl0bGU6IFwiSW1wYXJcdTAwRTF2ZWxcIiwgICAgICAgIGRlc2M6IFwiNTAwIHRhcmVmYXMgY29uY2x1XHUwMEVEZGFzXCIsICBpY29uOiBcImNoZWNrLWNoZWNrXCIsIGdvYWw6IDUwMCwgIG1ldHJpYzogXCJkb25lQ291bnRcIiB9LFxuICB7IGlkOiBcInZvbDEwMDBcIiwgY2F0OiBcIlZvbHVtZVwiLCB0aXRsZTogXCJNaWxoYXJcIiwgICAgICAgICAgIGRlc2M6IFwiMTAwMCB0YXJlZmFzIGNvbmNsdVx1MDBFRGRhc1wiLCBpY29uOiBcImNoZWNrLWNoZWNrXCIsIGdvYWw6IDEwMDAsIG1ldHJpYzogXCJkb25lQ291bnRcIiB9LFxuICAvLyBQcmlvcmlkYWRlICh0YXJlZmFzIHAxKVxuICB7IGlkOiBcInAxXzI1XCIsICBjYXQ6IFwiUHJpb3JpZGFkZVwiLCB0aXRsZTogXCJDYVx1MDBFN2Fkb3IgZGUgcDFcIiwgICAgICAgICAgZGVzYzogXCIyNSB0YXJlZmFzIHAxIGNvbmNsdVx1MDBFRGRhc1wiLCAgaWNvbjogXCJ6YXBcIiwgZ29hbDogMjUsICBtZXRyaWM6IFwicDFDb3VudFwiIH0sXG4gIHsgaWQ6IFwicDFfMTAwXCIsIGNhdDogXCJQcmlvcmlkYWRlXCIsIHRpdGxlOiBcIk1hdGFkb3IgZGUgcHJpb3JpZGFkZXNcIiwgZGVzYzogXCIxMDAgdGFyZWZhcyBwMSBjb25jbHVcdTAwRURkYXNcIiwgaWNvbjogXCJ6YXBcIiwgZ29hbDogMTAwLCBtZXRyaWM6IFwicDFDb3VudFwiIH0sXG4gIC8vIERpYSBjaGVpbyAoWFAgbnVtIFx1MDBGQW5pY28gZGlhKVxuICB7IGlkOiBcImRheTUwXCIsICBjYXQ6IFwiRGlhIGNoZWlvXCIsIHRpdGxlOiBcIkRpYSBwcm9kdXRpdm9cIiwgZGVzYzogXCI1MCsgWFAgbnVtIFx1MDBGQW5pY28gZGlhXCIsICBpY29uOiBcInN1blwiLCAgICAgZ29hbDogNTAsICBtZXRyaWM6IFwibWF4RGF5WHBcIiB9LFxuICB7IGlkOiBcImRheTEwMFwiLCBjYXQ6IFwiRGlhIGNoZWlvXCIsIHRpdGxlOiBcIkRpYSBcdTAwRTlwaWNvXCIsICAgICBkZXNjOiBcIjEwMCsgWFAgbnVtIFx1MDBGQW5pY28gZGlhXCIsIGljb246IFwic3VucmlzZVwiLCBnb2FsOiAxMDAsIG1ldHJpYzogXCJtYXhEYXlYcFwiIH0sXG4gIC8vIEVzY29wbyAoblx1MDBFRHZlaXMgcG9yIHByb2pldG8vZXRpcXVldGEpXG4gIHsgaWQ6IFwicHJvajVcIiwgIGNhdDogXCJFc2NvcG9cIiwgdGl0bGU6IFwiRXNwZWNpYWxpc3RhXCIsICAgZGVzYzogXCJOXHUwMEVEdmVsIDUgZW0gYWxndW0gcHJvamV0b1wiLCAgIGljb246IFwiZm9sZGVyXCIsIGdvYWw6IDUsIG1ldHJpYzogXCJwcm9qZWN0TGV2ZWxcIiB9LFxuICB7IGlkOiBcImxhYmVsNVwiLCBjYXQ6IFwiRXNjb3BvXCIsIHRpdGxlOiBcIkhcdTAwRTFiaXRvIGZvcm1hZG9cIiwgZGVzYzogXCJOXHUwMEVEdmVsIDUgZW0gYWxndW1hIGV0aXF1ZXRhXCIsIGljb246IFwidGFnXCIsICAgIGdvYWw6IDUsIG1ldHJpYzogXCJsYWJlbExldmVsXCIgfSxcbl07XG5pbnRlcmZhY2UgQWNoaWV2ZW1lbnRTdGF0ZSB7IGE6IEFjaGlldmVtZW50OyB2YWx1ZTogbnVtYmVyOyB1bmxvY2tlZDogYm9vbGVhbjsgcGN0OiBudW1iZXIgfVxuZnVuY3Rpb24gbWV0cmljVmFsdWUobWV0cmljOiBzdHJpbmcsIHM6IEdhbWVTdGF0cyk6IG51bWJlciB7XG4gIGNvbnN0IGZuID0gKE1FVFJJQ1MgYXMgUmVjb3JkPHN0cmluZywgKHM6IEdhbWVTdGF0cykgPT4gbnVtYmVyPilbbWV0cmljXTtcbiAgcmV0dXJuIGZuID8gZm4ocykgOiAwO1xufVxuZnVuY3Rpb24gZXZhbEFjaGlldmVtZW50KGE6IEFjaGlldmVtZW50LCBzOiBHYW1lU3RhdHMpOiBBY2hpZXZlbWVudFN0YXRlIHtcbiAgY29uc3QgdmFsdWUgPSBtZXRyaWNWYWx1ZShhLm1ldHJpYywgcyk7XG4gIGNvbnN0IHVubG9ja2VkID0gdmFsdWUgPj0gYS5nb2FsO1xuICBjb25zdCBwY3QgPSBhLmdvYWwgPiAwID8gTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKHZhbHVlIC8gYS5nb2FsICogMTAwKSkgOiAwO1xuICByZXR1cm4geyBhLCB2YWx1ZSwgdW5sb2NrZWQsIHBjdCB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWV0YXMgKGdhbWVHb2Fscyk6IGFsdm8gcG9yIHBlclx1MDBFRG9kbyAoZGlhL3NlbWFuYS9tXHUwMEVBcy9hbm8pLCBkZSBYUCBvdSBkZSBuXHUwMEJBIGRlIHRhcmVmYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBEZXJpdmFkYXMgZG9zIGV2ZW50b3MgXCJmZWl0b1wiIGRvIHBlclx1MDBFRG9kbyBBVFVBTCAocmVzZXRhbSBzb3ppbmhhcyBhIGNhZGEgcGVyXHUwMEVEb2RvKS4gRmlsdHJvIG9wY2lvbmFsXG4vLyBwb3IgcHJvamV0by9ldGlxdWV0YS4gRWRpdFx1MDBFMXZlaXMgbmEgbm90YSBkZSBSZWdyYXMsIGNvbW8gYXMgY29ucXVpc3Rhcy5cbnR5cGUgR29hbFBlcmlvZCA9IFwiZGF5XCIgfCBcIndlZWtcIiB8IFwibW9udGhcIiB8IFwieWVhclwiO1xudHlwZSBHb2FsTWV0cmljID0gXCJ4cFwiIHwgXCJ0YXNrc1wiO1xuaW50ZXJmYWNlIEdhbWVHb2FsIHtcbiAgaWQ6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgcGVyaW9kOiBHb2FsUGVyaW9kO1xuICBtZXRyaWM6IEdvYWxNZXRyaWM7XG4gIHRhcmdldDogbnVtYmVyO1xuICBwcm9qZWN0Pzogc3RyaW5nOyAgIC8vIGZpbHRybzogc1x1MDBGMyBjb250YSBldmVudG9zIGRlc3RlIHByb2pldG9cbiAgbGFiZWw/OiBzdHJpbmc7ICAgICAvLyBmaWx0cm86IHNcdTAwRjMgY29udGEgZXZlbnRvcyBjb20gZXN0YSBldGlxdWV0YVxufVxuY29uc3QgR09BTF9QRVJJT0RTOiBHb2FsUGVyaW9kW10gPSBbXCJkYXlcIiwgXCJ3ZWVrXCIsIFwibW9udGhcIiwgXCJ5ZWFyXCJdO1xuY29uc3QgR09BTF9QRVJJT0RfTEFCRUxTOiBSZWNvcmQ8R29hbFBlcmlvZCwgc3RyaW5nPiA9IHsgZGF5OiBcImhvamVcIiwgd2VlazogXCJlc3RhIHNlbWFuYVwiLCBtb250aDogXCJlc3RlIG1cdTAwRUFzXCIsIHllYXI6IFwiZXN0ZSBhbm9cIiB9O1xuY29uc3QgREVGQVVMVF9HT0FMUzogR2FtZUdvYWxbXSA9IFtcbiAgeyBpZDogXCJkaWEteHBcIiwgICAgICB0aXRsZTogXCJNZXRhIGRpXHUwMEUxcmlhXCIsICAgICAgcGVyaW9kOiBcImRheVwiLCAgbWV0cmljOiBcInhwXCIsICAgIHRhcmdldDogMzAgfSxcbiAgeyBpZDogXCJzZW1hbmEtdm9sXCIsICB0aXRsZTogXCJTZW1hbmEgcHJvZHV0aXZhXCIsIHBlcmlvZDogXCJ3ZWVrXCIsIG1ldHJpYzogXCJ0YXNrc1wiLCB0YXJnZXQ6IDIwIH0sXG5dO1xuLy8gSW5cdTAwRURjaW8gKFlZWVktTU0tREQgbG9jYWwpIGRvIHBlclx1MDBFRG9kbyBhdHVhbC4gU2VtYW5hID0gc2VndW5kYS1mZWlyYSAoSVNPKS5cbmZ1bmN0aW9uIHBlcmlvZFN0YXJ0S2V5KHBlcmlvZDogR29hbFBlcmlvZCwgbm93OiBEYXRlKTogc3RyaW5nIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKSk7XG4gIGlmIChwZXJpb2QgPT09IFwid2Vla1wiKSB7IGNvbnN0IGRvdyA9IChkLmdldERheSgpICsgNikgJSA3OyBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBkb3cpOyB9XG4gIGVsc2UgaWYgKHBlcmlvZCA9PT0gXCJtb250aFwiKSBkLnNldERhdGUoMSk7XG4gIGVsc2UgaWYgKHBlcmlvZCA9PT0gXCJ5ZWFyXCIpIGQuc2V0TW9udGgoMCwgMSk7XG4gIHJldHVybiB0b0tleShkKTtcbn1cbmludGVyZmFjZSBHb2FsU3RhdGUgeyBnb2FsOiBHYW1lR29hbDsgY3VycmVudDogbnVtYmVyOyBwY3Q6IG51bWJlcjsgZG9uZTogYm9vbGVhbiB9XG4vLyBQcm9ncmVzc28gZGUgdW1hIG1ldGEgbm8gcGVyXHUwMEVEb2RvIGF0dWFsOiBzb21hIGRlIFhQIFwiZmVpdG9cIiBvdSBjb250YWdlbSBkZSBcImZlaXRvXCIsIGNvbSBmaWx0cm8gZGUgZXNjb3BvLlxuZnVuY3Rpb24gZ29hbFByb2dyZXNzKGV2ZW50czogR2FtZUV2ZW50W10sIGdvYWw6IEdhbWVHb2FsLCBub3c6IERhdGUpOiBHb2FsU3RhdGUge1xuICBjb25zdCBzdGFydCA9IHBlcmlvZFN0YXJ0S2V5KGdvYWwucGVyaW9kLCBub3cpO1xuICBsZXQgY3VycmVudCA9IDA7XG4gIGZvciAoY29uc3QgZSBvZiBldmVudHMpIHtcbiAgICBpZiAoZS50eXBlICE9PSBcImZlaXRvXCIgfHwgZS5kYXRlIDwgc3RhcnQpIGNvbnRpbnVlO1xuICAgIGlmIChnb2FsLnByb2plY3QgJiYgKGUucHJvamVjdCB8fCBcIlwiKSAhPT0gZ29hbC5wcm9qZWN0KSBjb250aW51ZTtcbiAgICBpZiAoZ29hbC5sYWJlbCAmJiAhZS5sYWJlbHMuaW5jbHVkZXMoZ29hbC5sYWJlbCkpIGNvbnRpbnVlO1xuICAgIGN1cnJlbnQgKz0gZ29hbC5tZXRyaWMgPT09IFwidGFza3NcIiA/IDEgOiBlLnhwO1xuICB9XG4gIGN1cnJlbnQgPSBNYXRoLm1heCgwLCBjdXJyZW50KTtcbiAgY29uc3QgcGN0ID0gZ29hbC50YXJnZXQgPiAwID8gTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKGN1cnJlbnQgLyBnb2FsLnRhcmdldCAqIDEwMCkpIDogMDtcbiAgcmV0dXJuIHsgZ29hbCwgY3VycmVudCwgcGN0LCBkb25lOiBjdXJyZW50ID49IGdvYWwudGFyZ2V0IH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBSZWdyYXMgZG8gam9nbyAoY29uZmlndXJhXHUwMEU3XHUwMEUzbyBkZWNsYXJhdGl2YSB1bmlmaWNhZGEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gVW1hIG5vdGEgc1x1MDBGMyAoc2V0dGluZ3MuZ2FtZVJ1bGVzUGF0aCwgYmxvY28gYGBganNvbikgZGVmaW5lIG8gXCJqb2dvXCI6IHByb2pldG9zLCBldGlxdWV0YXMsXG4vLyBYUCBwb3IgcHJpb3JpZGFkZS9ldGlxdWV0YSwgY3VydmEvdGFiZWxhIGRlIG5cdTAwRUR2ZWlzIGUgY29ucXVpc3Rhcy4gRWRpdFx1MDBFMXZlbC9wYXJ0aWxoXHUwMEUxdmVsIHBlbGEgY29tdW5pZGFkZS5cbmludGVyZmFjZSBSdWxlc0xhYmVsIHsgbmFtZTogc3RyaW5nOyBjb2xvcj86IHN0cmluZyB9ICAgLy8gY29sb3IgPSBub21lIGRlIHBhbGV0YSBkbyBUb2RvaXN0XG4vLyBOXHUwMEVEdmVsIGRlIHVtIGVzY29wbzogdGFiZWxhIGV4cGxcdTAwRURjaXRhIGRlIGxpbWlhcmVzIE9VIGN1cnZhIChmXHUwMEYzcm11bGEgKyBuXHUwMEJBIGRlIG5cdTAwRUR2ZWlzKS5cbnR5cGUgU2NvcGVMZXZlbERlZiA9XG4gIHwgeyBraW5kOiBcInRhYmxlXCI7IHRocmVzaG9sZHM6IG51bWJlcltdIH1cbiAgfCB7IGtpbmQ6IFwiY3VydmVcIjsgbGV2ZWxzOiBudW1iZXI7IGN1cnZlOiBzdHJpbmcgfTtcbmludGVyZmFjZSBTY29wZUxldmVscyB7IHByb2plY3RzOiBNYXA8c3RyaW5nLCBTY29wZUxldmVsRGVmPjsgbGFiZWxzOiBNYXA8c3RyaW5nLCBTY29wZUxldmVsRGVmPiB9XG50eXBlIFhwQnlQcmlvcml0eSA9IFJlY29yZDxQcmlLZXksIG51bWJlcj47XG5pbnRlcmZhY2UgR2FtZVJ1bGVzIHtcbiAgcHJvamVjdHM6IHN0cmluZ1tdOyAgICAgICAgICAgLy8gcHJvamV0b3MgYSBwcm92aXNpb25hciBubyBUb2RvaXN0XG4gIGxhYmVsczogUnVsZXNMYWJlbFtdOyAgICAgICAgIC8vIGV0aXF1ZXRhcyBhIHByb3Zpc2lvbmFyIG5vIFRvZG9pc3RcbiAgeHBCeVByaW9yaXR5OiBYcEJ5UHJpb3JpdHk7ICAgIC8vIFhQIHBvciBwcmlvcmlkYWRlIChwMSBtYWlzIGFsdGEpXG4gIHhwQnlMYWJlbDogTWFwPHN0cmluZywgbnVtYmVyPjsgLy8gYlx1MDBGNG51cyBkZSBYUCBwb3IgZXRpcXVldGEgKHNvbWFkbyBcdTAwRTAgcHJpb3JpZGFkZTsgcG9kZSBzZXIgbmVnYXRpdm8pXG4gIGxldmVsQ3VydmU6IHN0cmluZzsgICAgICAgICAgIC8vIGZcdTAwRjNybXVsYSBkbyBYUCBjdW11bGF0aXZvIGRvIG5cdTAwRUR2ZWwgbiAocGFkclx1MDBFM28gZGUgdG9kb3Mgb3MgZXNjb3BvcylcbiAgc2NvcGVMZXZlbHM6IFNjb3BlTGV2ZWxzOyAgICAgLy8gb3ZlcnJpZGUgZGUgblx1MDBFRHZlaXMgcG9yIHByb2pldG8vZXRpcXVldGFcbiAgYWNoaWV2ZW1lbnRzOiBBY2hpZXZlbWVudFtdOyAgLy8gYmFkZ2VzIChjYWkgbm9zIHBhZHJcdTAwRjVlcyBzZSB2YXppbylcbiAgZ29hbHM6IEdhbWVHb2FsW107ICAgICAgICAgICAgLy8gbWV0YXMgcG9yIHBlclx1MDBFRG9kbyAoY2FpIG5vcyBwYWRyXHUwMEY1ZXMgc2UgdmF6aW8pXG59XG5jb25zdCBNQVhfU0NPUEVfTEVWRUxTID0gMTAwMDsgIC8vIGxpbWl0ZSBzZW5zYXRvIGRlIG5cdTAwRUR2ZWlzIGdlcmFkb3MgcG9yIGZcdTAwRjNybXVsYSBudW0gZXNjb3BvXG5mdW5jdGlvbiBlbXB0eVNjb3BlTGV2ZWxzKCk6IFNjb3BlTGV2ZWxzIHsgcmV0dXJuIHsgcHJvamVjdHM6IG5ldyBNYXAoKSwgbGFiZWxzOiBuZXcgTWFwKCkgfTsgfVxuZnVuY3Rpb24gZGVmYXVsdFJ1bGVzKCk6IEdhbWVSdWxlcyB7XG4gIHJldHVybiB7IHByb2plY3RzOiBbXSwgbGFiZWxzOiBbXSwgeHBCeVByaW9yaXR5OiB7IC4uLkRFRkFVTFRfWFBfQllfUFJJIH0sIHhwQnlMYWJlbDogbmV3IE1hcCgpLFxuICAgIGxldmVsQ3VydmU6IERFRkFVTFRfTEVWRUxfQ1VSVkUsIHNjb3BlTGV2ZWxzOiBlbXB0eVNjb3BlTGV2ZWxzKCksIGFjaGlldmVtZW50czogREVGQVVMVF9BQ0hJRVZFTUVOVFMsIGdvYWxzOiBERUZBVUxUX0dPQUxTIH07XG59XG5cbi8vIFZhbGlkYSB1bSBhcnJheSBjcnUgZGUgY29ucXVpc3RhcyAoaWQgXHUwMEZBbmljbywgdFx1MDBFRHR1bG8sIGdvYWwgPiAwLCBtZXRyaWMgY29uaGVjaWRvKS4gSW52XHUwMEUxbGlkYXMgXHUyMTkyIGRlc2NhcnRhZGFzLlxuZnVuY3Rpb24gcGFyc2VBY2hpZXZlbWVudExpc3QocmF3OiB1bmtub3duKTogQWNoaWV2ZW1lbnRbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gW107XG4gIGNvbnN0IG91dDogQWNoaWV2ZW1lbnRbXSA9IFtdO1xuICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgciBvZiByYXcpIHtcbiAgICBpZiAoIXIgfHwgdHlwZW9mIHIgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG8gPSByIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgIGNvbnN0IGlkID0gdHlwZW9mIG8uaWQgPT09IFwic3RyaW5nXCIgPyBvLmlkLnRyaW0oKSA6IFwiXCI7XG4gICAgY29uc3QgdGl0bGUgPSB0eXBlb2Ygby50aXRsZSA9PT0gXCJzdHJpbmdcIiA/IG8udGl0bGUudHJpbSgpIDogXCJcIjtcbiAgICBjb25zdCBtZXRyaWMgPSB0eXBlb2Ygby5tZXRyaWMgPT09IFwic3RyaW5nXCIgPyBvLm1ldHJpYyA6IFwiXCI7XG4gICAgY29uc3QgZ29hbCA9IE51bWJlcihvLmdvYWwpO1xuICAgIGlmICghaWQgfHwgc2Vlbi5oYXMoaWQpIHx8ICF0aXRsZSB8fCAhKG1ldHJpYyBpbiBNRVRSSUNTKSB8fCAhTnVtYmVyLmlzRmluaXRlKGdvYWwpIHx8IGdvYWwgPD0gMCkgY29udGludWU7XG4gICAgc2Vlbi5hZGQoaWQpO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGlkLCB0aXRsZSwgbWV0cmljOiBtZXRyaWMgYXMgTWV0cmljSWQsIGdvYWwsXG4gICAgICBjYXQ6IHR5cGVvZiBvLmNhdCA9PT0gXCJzdHJpbmdcIiAmJiBvLmNhdC50cmltKCkgPyBvLmNhdC50cmltKCkgOiBcIk91dHJvc1wiLFxuICAgICAgZGVzYzogdHlwZW9mIG8uZGVzYyA9PT0gXCJzdHJpbmdcIiA/IG8uZGVzYyA6IFwiXCIsXG4gICAgICBpY29uOiB0eXBlb2Ygby5pY29uID09PSBcInN0cmluZ1wiICYmIG8uaWNvbi50cmltKCkgPyBvLmljb24udHJpbSgpIDogXCJ0cm9waHlcIixcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuLy8gTFx1MDBFQSBhIGRlZmluaVx1MDBFN1x1MDBFM28gZGUgblx1MDBFRHZlaXMgZGUgVU0gZXNjb3BvOiBhcnJheS9gdGhyZXNob2xkc2AgPSB0YWJlbGEgKFhQIGN1bXVsYXRpdm8gcG9yIG5cdTAwRUR2ZWwsIGNyZXNjZW50ZSk7XG4vLyBgeyBsZXZlbHMsIGN1cnZlIH1gID0gZlx1MDBGM3JtdWxhLiBJbnZcdTAwRTFsaWRhIFx1MjE5MiBudWxsICh1c2EgYSBjdXJ2YSBwYWRyXHUwMEUzbykuXG5mdW5jdGlvbiBwYXJzZVNjb3BlTGV2ZWxEZWYocmF3OiB1bmtub3duKTogU2NvcGVMZXZlbERlZiB8IG51bGwge1xuICBjb25zdCBhc1RhYmxlID0gKGFycjogdW5rbm93bltdKTogU2NvcGVMZXZlbERlZiB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHQgPSBbLi4ubmV3IFNldChhcnIubWFwKE51bWJlcikuZmlsdGVyKG4gPT4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwKSldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICByZXR1cm4gdC5sZW5ndGggPyB7IGtpbmQ6IFwidGFibGVcIiwgdGhyZXNob2xkczogdCB9IDogbnVsbDtcbiAgfTtcbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIGFzVGFibGUocmF3KTtcbiAgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3QgbyA9IHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvLnRocmVzaG9sZHMpKSByZXR1cm4gYXNUYWJsZShvLnRocmVzaG9sZHMpO1xuICAgIGNvbnN0IGxldmVscyA9IE1hdGguZmxvb3IoTnVtYmVyKG8ubGV2ZWxzKSk7XG4gICAgY29uc3QgY3VydmUgPSB0eXBlb2Ygby5jdXJ2ZSA9PT0gXCJzdHJpbmdcIiA/IG8uY3VydmUudHJpbSgpIDogXCJcIjtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGxldmVscykgJiYgbGV2ZWxzID49IDEgJiYgbGV2ZWxzIDw9IE1BWF9TQ09QRV9MRVZFTFMgJiYgY3VydmUgJiYgY29tcGlsZUZvcm11bGEoY3VydmUsIFtcIm5cIl0pKVxuICAgICAgcmV0dXJuIHsga2luZDogXCJjdXJ2ZVwiLCBsZXZlbHMsIGN1cnZlIH07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBwYXJzZVNjb3BlTGV2ZWxNYXAocmF3OiB1bmtub3duKTogTWFwPHN0cmluZywgU2NvcGVMZXZlbERlZj4ge1xuICBjb25zdCBtID0gbmV3IE1hcDxzdHJpbmcsIFNjb3BlTGV2ZWxEZWY+KCk7XG4gIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gbTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocmF3IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KSkge1xuICAgIGNvbnN0IG5hbWUgPSBrLnRyaW0oKTtcbiAgICBjb25zdCBkZWYgPSBwYXJzZVNjb3BlTGV2ZWxEZWYodik7XG4gICAgaWYgKG5hbWUgJiYgZGVmKSBtLnNldChuYW1lLCBkZWYpO1xuICB9XG4gIHJldHVybiBtO1xufVxuZnVuY3Rpb24gcGFyc2VTY29wZUxldmVscyhyYXc6IHVua25vd24pOiBTY29wZUxldmVscyB7XG4gIGNvbnN0IG8gPSAocmF3ICYmIHR5cGVvZiByYXcgPT09IFwib2JqZWN0XCIgPyByYXcgOiB7fSkgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHJldHVybiB7IHByb2plY3RzOiBwYXJzZVNjb3BlTGV2ZWxNYXAoby5wcm9qZWN0cyksIGxhYmVsczogcGFyc2VTY29wZUxldmVsTWFwKG8ubGFiZWxzKSB9O1xufVxuLy8gWFAgcG9yIHByaW9yaWRhZGU6IGFjZWl0YSBwMS4ucDQgXHUyMjY1IDA7IG8gcXVlIGZhbHRhciBmaWNhIG5vIHBhZHJcdTAwRTNvLlxuZnVuY3Rpb24gcGFyc2VYcEJ5UHJpb3JpdHkocmF3OiB1bmtub3duKTogWHBCeVByaW9yaXR5IHtcbiAgY29uc3Qgb3V0OiBYcEJ5UHJpb3JpdHkgPSB7IC4uLkRFRkFVTFRfWFBfQllfUFJJIH07XG4gIGlmIChyYXcgJiYgdHlwZW9mIHJhdyA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShyYXcpKSB7XG4gICAgY29uc3QgbyA9IHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICBmb3IgKGNvbnN0IGsgb2YgW1wicDFcIiwgXCJwMlwiLCBcInAzXCIsIFwicDRcIl0gYXMgUHJpS2V5W10pIHtcbiAgICAgIGNvbnN0IG4gPSBOdW1iZXIob1trXSk7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPj0gMCkgb3V0W2tdID0gbjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbi8vIEJcdTAwRjRudXMgZGUgWFAgcG9yIGV0aXF1ZXRhIChzb21hZG8gYW8gZGEgcHJpb3JpZGFkZTsgcG9kZSBzZXIgbmVnYXRpdm8pLlxuZnVuY3Rpb24gcGFyc2VYcEJ5TGFiZWwocmF3OiB1bmtub3duKTogTWFwPHN0cmluZywgbnVtYmVyPiB7XG4gIGNvbnN0IG0gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBpZiAocmF3ICYmIHR5cGVvZiByYXcgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocmF3KSkge1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBrLnRyaW0oKTsgY29uc3QgbiA9IE51bWJlcih2KTtcbiAgICAgIGlmIChuYW1lICYmIE51bWJlci5pc0Zpbml0ZShuKSkgbS5zZXQobmFtZSwgbik7XG4gICAgfVxuICB9XG4gIHJldHVybiBtO1xufVxuLy8gQ3VydmEgcGFkclx1MDBFM28gKGZcdTAwRjNybXVsYSBlbSBuKTogdmFsaWRhZGEgcG9yIGNvbXBpbGVGb3JtdWxhOyBpbnZcdTAwRTFsaWRhIFx1MjE5MiBjdXJ2YSBlbWJ1dGlkYS5cbmZ1bmN0aW9uIHBhcnNlTGV2ZWxDdXJ2ZShyYXc6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodHlwZW9mIHJhdyA9PT0gXCJzdHJpbmdcIiAmJiByYXcudHJpbSgpICYmIGNvbXBpbGVGb3JtdWxhKHJhdy50cmltKCksIFtcIm5cIl0pKSByZXR1cm4gcmF3LnRyaW0oKTtcbiAgcmV0dXJuIERFRkFVTFRfTEVWRUxfQ1VSVkU7XG59XG4vLyBMXHUwMEVBIG9zIG5vbWVzIGRlIHByb2pldG8gKHN0cmluZ3MgXHUwMEZBbmljYXMsIG5cdTAwRTNvLXZhemlhcykuXG5mdW5jdGlvbiBwYXJzZVJ1bGVzUHJvamVjdHMocmF3OiB1bmtub3duKTogc3RyaW5nW10ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIFtdO1xuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJhdykge1xuICAgIGNvbnN0IG5hbWUgPSB0eXBlb2YgciA9PT0gXCJzdHJpbmdcIiA/IHIudHJpbSgpIDogXCJcIjtcbiAgICBpZiAoIW5hbWUgfHwgc2Vlbi5oYXMobmFtZSkpIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKG5hbWUpOyBvdXQucHVzaChuYW1lKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuLy8gTFx1MDBFQSBhcyBldGlxdWV0YXM6IFwibm9tZVwiIG91IHsgbmFtZSwgY29sb3IgfS4gQ29yIHNcdTAwRjMgc2UgZm9yIHVtIG5vbWUgZGUgcGFsZXRhIGRvIFRvZG9pc3Qgdlx1MDBFMWxpZG8uXG5mdW5jdGlvbiBwYXJzZVJ1bGVzTGFiZWxzKHJhdzogdW5rbm93bik6IFJ1bGVzTGFiZWxbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gW107XG4gIGNvbnN0IG91dDogUnVsZXNMYWJlbFtdID0gW107XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJhdykge1xuICAgIGxldCBuYW1lID0gXCJcIiwgY29sb3I6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIHIgPT09IFwic3RyaW5nXCIpIG5hbWUgPSByLnRyaW0oKTtcbiAgICBlbHNlIGlmIChyICYmIHR5cGVvZiByID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBjb25zdCBvID0gciBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICAgIG5hbWUgPSB0eXBlb2Ygby5uYW1lID09PSBcInN0cmluZ1wiID8gby5uYW1lLnRyaW0oKSA6IFwiXCI7XG4gICAgICBpZiAodHlwZW9mIG8uY29sb3IgPT09IFwic3RyaW5nXCIgJiYgby5jb2xvci50cmltKCkgaW4gVE9ET0lTVF9DT0xPUlMpIGNvbG9yID0gby5jb2xvci50cmltKCk7XG4gICAgfVxuICAgIGlmICghbmFtZSB8fCBzZWVuLmhhcyhuYW1lKSkgY29udGludWU7XG4gICAgc2Vlbi5hZGQobmFtZSk7XG4gICAgb3V0LnB1c2goY29sb3IgPyB7IG5hbWUsIGNvbG9yIH0gOiB7IG5hbWUgfSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbi8vIFZhbGlkYSB1bSBhcnJheSBjcnUgZGUgbWV0YXMgKGlkIFx1MDBGQW5pY28sIHRcdTAwRUR0dWxvLCBwZXJcdTAwRURvZG8vbVx1MDBFOXRyaWNhIGNvbmhlY2lkb3MsIHRhcmdldCA+IDApLiBJbnZcdTAwRTFsaWRhcyBcdTIxOTIgZGVzY2FydGFkYXMuXG5mdW5jdGlvbiBwYXJzZUdvYWxzKHJhdzogdW5rbm93bik6IEdhbWVHb2FsW10ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIFtdO1xuICBjb25zdCBvdXQ6IEdhbWVHb2FsW10gPSBbXTtcbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHIgb2YgcmF3KSB7XG4gICAgaWYgKCFyIHx8IHR5cGVvZiByICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBvID0gciBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICBjb25zdCBpZCA9IHR5cGVvZiBvLmlkID09PSBcInN0cmluZ1wiID8gby5pZC50cmltKCkgOiBcIlwiO1xuICAgIGNvbnN0IHRpdGxlID0gdHlwZW9mIG8udGl0bGUgPT09IFwic3RyaW5nXCIgPyBvLnRpdGxlLnRyaW0oKSA6IFwiXCI7XG4gICAgY29uc3QgcGVyaW9kID0gdHlwZW9mIG8ucGVyaW9kID09PSBcInN0cmluZ1wiID8gby5wZXJpb2QgOiBcIlwiO1xuICAgIGNvbnN0IG1ldHJpYyA9IHR5cGVvZiBvLm1ldHJpYyA9PT0gXCJzdHJpbmdcIiA/IG8ubWV0cmljIDogXCJcIjtcbiAgICBjb25zdCB0YXJnZXQgPSBOdW1iZXIoby50YXJnZXQpO1xuICAgIGlmICghaWQgfHwgc2Vlbi5oYXMoaWQpIHx8ICF0aXRsZSB8fCAhR09BTF9QRVJJT0RTLmluY2x1ZGVzKHBlcmlvZCBhcyBHb2FsUGVyaW9kKVxuICAgICAgfHwgKG1ldHJpYyAhPT0gXCJ4cFwiICYmIG1ldHJpYyAhPT0gXCJ0YXNrc1wiKSB8fCAhTnVtYmVyLmlzRmluaXRlKHRhcmdldCkgfHwgdGFyZ2V0IDw9IDApIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKGlkKTtcbiAgICBjb25zdCBnOiBHYW1lR29hbCA9IHsgaWQsIHRpdGxlLCBwZXJpb2Q6IHBlcmlvZCBhcyBHb2FsUGVyaW9kLCBtZXRyaWM6IG1ldHJpYyBhcyBHb2FsTWV0cmljLCB0YXJnZXQgfTtcbiAgICBpZiAodHlwZW9mIG8ucHJvamVjdCA9PT0gXCJzdHJpbmdcIiAmJiBvLnByb2plY3QudHJpbSgpKSBnLnByb2plY3QgPSBvLnByb2plY3QudHJpbSgpO1xuICAgIGlmICh0eXBlb2Ygby5sYWJlbCA9PT0gXCJzdHJpbmdcIiAmJiBvLmxhYmVsLnRyaW0oKSkgZy5sYWJlbCA9IG8ubGFiZWwudHJpbSgpO1xuICAgIG91dC5wdXNoKGcpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4vLyBMXHUwMEVBIG8gMVx1MDBCQSBibG9jbyBgYGBqc29uIGRhIG5vdGEgZGUgUmVncmFzLiBBY2VpdGEgbyBvYmpldG8gY29tcGxldG8gb3UsIHBvciByZXRyb2NvbXBhdCwgdW0gYXJyYXlcbi8vICg9IHNcdTAwRjMgY29ucXVpc3RhcykuIFNlbSBibG9jbyB2XHUwMEUxbGlkbyBcdTIxOTIgbnVsbCAodXNhIG9zIHBhZHJcdTAwRjVlcyBlbWJ1dGlkb3MpLlxuZnVuY3Rpb24gcGFyc2VHYW1lUnVsZXMoY29udGVudDogc3RyaW5nKTogR2FtZVJ1bGVzIHwgbnVsbCB7XG4gIGNvbnN0IG0gPSBjb250ZW50Lm1hdGNoKC9gYGBqc29uXFxzKlxccj9cXG4oW1xcc1xcU10qPylgYGAvKTtcbiAgaWYgKCFtKSByZXR1cm4gbnVsbDtcbiAgbGV0IHJhdzogdW5rbm93bjtcbiAgdHJ5IHsgcmF3ID0gSlNPTi5wYXJzZShtWzFdKTsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHtcbiAgICBjb25zdCBhY2ggPSBwYXJzZUFjaGlldmVtZW50TGlzdChyYXcpO1xuICAgIGlmICghYWNoLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgciA9IGRlZmF1bHRSdWxlcygpOyByLmFjaGlldmVtZW50cyA9IGFjaDsgcmV0dXJuIHI7XG4gIH1cbiAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG8gPSByYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGNvbnN0IGFjaCA9IHBhcnNlQWNoaWV2ZW1lbnRMaXN0KG8uYWNoaWV2ZW1lbnRzKTtcbiAgY29uc3QgZ29hbHMgPSBwYXJzZUdvYWxzKG8uZ29hbHMpO1xuICByZXR1cm4ge1xuICAgIHByb2plY3RzOiBwYXJzZVJ1bGVzUHJvamVjdHMoby5wcm9qZWN0cyksXG4gICAgbGFiZWxzOiBwYXJzZVJ1bGVzTGFiZWxzKG8ubGFiZWxzKSxcbiAgICB4cEJ5UHJpb3JpdHk6IHBhcnNlWHBCeVByaW9yaXR5KG8ueHBCeVByaW9yaXR5KSxcbiAgICB4cEJ5TGFiZWw6IHBhcnNlWHBCeUxhYmVsKG8ueHBCeUxhYmVsKSxcbiAgICBsZXZlbEN1cnZlOiBwYXJzZUxldmVsQ3VydmUoby5sZXZlbEN1cnZlKSxcbiAgICBzY29wZUxldmVsczogcGFyc2VTY29wZUxldmVscyhvLnNjb3BlTGV2ZWxzKSxcbiAgICBhY2hpZXZlbWVudHM6IGFjaC5sZW5ndGggPyBhY2ggOiBERUZBVUxUX0FDSElFVkVNRU5UUywgICAvLyBpZGVudGlkYWRlIHByZXNlcnZhZGEgXHUyMTkyIGlzQ3VzdG9tQWNoaWV2ZW1lbnRzKClcbiAgICBnb2FsczogZ29hbHMubGVuZ3RoID8gZ29hbHMgOiBERUZBVUxUX0dPQUxTLFxuICB9O1xufVxuZnVuY3Rpb24gc2NvcGVMZXZlbERlZlRvSnNvbihkZWY6IFNjb3BlTGV2ZWxEZWYpOiB1bmtub3duIHtcbiAgcmV0dXJuIGRlZi5raW5kID09PSBcInRhYmxlXCIgPyB7IHRocmVzaG9sZHM6IGRlZi50aHJlc2hvbGRzIH0gOiB7IGxldmVsczogZGVmLmxldmVscywgY3VydmU6IGRlZi5jdXJ2ZSB9O1xufVxuLy8gT2JqZXRvIEpTT04gY2FuXHUwMEY0bmljbyBkYXMgUmVncmFzIChtZXNtYSBmb3JtYSBxdWUgbyBwYXJzZXIgbFx1MDBFQSkgXHUyMDE0IHJldXNhZG8gcGVsbyBidWlsZGVyIGUgcGVsYSBlZGlcdTAwRTdcdTAwRTNvIGNpclx1MDBGQXJnaWNhLlxuZnVuY3Rpb24gcnVsZXNUb0pzb25PYmoocnVsZXM6IEdhbWVSdWxlcyk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgbHZsTWFwID0gKG06IE1hcDxzdHJpbmcsIFNjb3BlTGV2ZWxEZWY+KSA9PiBPYmplY3QuZnJvbUVudHJpZXMoWy4uLm1dLm1hcCgoW2ssIHZdKSA9PiBbaywgc2NvcGVMZXZlbERlZlRvSnNvbih2KV0pKTtcbiAgcmV0dXJuIHtcbiAgICBwcm9qZWN0czogcnVsZXMucHJvamVjdHMsXG4gICAgbGFiZWxzOiBydWxlcy5sYWJlbHMsXG4gICAgeHBCeVByaW9yaXR5OiBydWxlcy54cEJ5UHJpb3JpdHksXG4gICAgeHBCeUxhYmVsOiBPYmplY3QuZnJvbUVudHJpZXMocnVsZXMueHBCeUxhYmVsKSxcbiAgICBsZXZlbEN1cnZlOiBydWxlcy5sZXZlbEN1cnZlLFxuICAgIHNjb3BlTGV2ZWxzOiB7IHByb2plY3RzOiBsdmxNYXAocnVsZXMuc2NvcGVMZXZlbHMucHJvamVjdHMpLCBsYWJlbHM6IGx2bE1hcChydWxlcy5zY29wZUxldmVscy5sYWJlbHMpIH0sXG4gICAgYWNoaWV2ZW1lbnRzOiBydWxlcy5hY2hpZXZlbWVudHMubWFwKGEgPT4gKHsgaWQ6IGEuaWQsIGNhdDogYS5jYXQsIHRpdGxlOiBhLnRpdGxlLCBkZXNjOiBhLmRlc2MsIGljb246IGEuaWNvbiwgbWV0cmljOiBhLm1ldHJpYywgZ29hbDogYS5nb2FsIH0pKSxcbiAgICBnb2FsczogcnVsZXMuZ29hbHMubWFwKGcgPT4gKHsgaWQ6IGcuaWQsIHRpdGxlOiBnLnRpdGxlLCBwZXJpb2Q6IGcucGVyaW9kLCBtZXRyaWM6IGcubWV0cmljLCB0YXJnZXQ6IGcudGFyZ2V0LFxuICAgICAgLi4uKGcucHJvamVjdCA/IHsgcHJvamVjdDogZy5wcm9qZWN0IH0gOiB7fSksIC4uLihnLmxhYmVsID8geyBsYWJlbDogZy5sYWJlbCB9IDoge30pIH0pKSxcbiAgfTtcbn1cbi8vIFRyb2NhIG8gY29ycG8gZG8gMVx1MDBCQSBibG9jbyBgYGBqc29uIHByZXNlcnZhbmRvIG8gcmVzdG8gZGEgbm90YSAocHJvc2EgZG8gdXN1XHUwMEUxcmlvKS4gbnVsbCBzZSBuXHUwMEUzbyBob3V2ZXIgYmxvY28uXG5mdW5jdGlvbiByZXBsYWNlRmlyc3RKc29uQmxvY2soY29udGVudDogc3RyaW5nLCBqc29uOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCEvYGBganNvblxccypcXHI/XFxuW1xcc1xcU10qP2BgYC8udGVzdChjb250ZW50KSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBjb250ZW50LnJlcGxhY2UoL2BgYGpzb25cXHMqXFxyP1xcbltcXHNcXFNdKj9gYGAvLCAoKSA9PiBcImBgYGpzb25cXG5cIiArIGpzb24gKyBcIlxcbmBgYFwiKTtcbn1cbi8vIENvbnRlXHUwMEZBZG8gaW5pY2lhbCBkYSBub3RhIChhdXRvLWRvY3VtZW50YWRhKTogcmVmZXJcdTAwRUFuY2lhIGNvbXBsZXRhIGRlIGNhZGEgY2FtcG8gKyB0YWJlbGFzICsgbyBKU09OIGF0dWFsLlxuZnVuY3Rpb24gYnVpbGRHYW1lUnVsZXNDb250ZW50KHJ1bGVzOiBHYW1lUnVsZXMpOiBzdHJpbmcge1xuICBjb25zdCByb3dzID0gKE9iamVjdC5rZXlzKE1FVFJJQ19MQUJFTFMpIGFzIE1ldHJpY0lkW10pLm1hcChrID0+IGB8IFxcYCR7a31cXGAgfCAke01FVFJJQ19MQUJFTFNba119IHxgKS5qb2luKFwiXFxuXCIpO1xuICBjb25zdCBjb2xvcnMgPSBPYmplY3Qua2V5cyhUT0RPSVNUX0NPTE9SUykuam9pbihcIiwgXCIpO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkocnVsZXNUb0pzb25PYmoocnVsZXMpLCBudWxsLCAyKTtcbiAgcmV0dXJuIFtcbiAgICBcIi0tLVwiLCBcIm93bmVyOiBXZXJ1c1wiLCBcInBlcm1pc3Npb25zOlwiLCBcIiAgcmVhZDogW2FsbF1cIiwgXCIgIHdyaXRlOlwiLCBcIiAgICAtIFdlcnVzXCIsIFwiICAgIC0gQ2xhdWRlXCIsXG4gICAgXCJyZXZpZXdlZDogZmFsc2VcIiwgXCJ0eXBlOiByZWZlcmVuY2VcIiwgXCJ0YWdzOiBbZ2FtaWZpY2FjYW8sIHJlZ3Jhc11cIiwgXCItLS1cIiwgXCJcIixcbiAgICBcIiMgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjAxNCBSZWdyYXMgKGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28pXCIsIFwiXCIsXG4gICAgXCI+IEFycXVpdm8gKipsaWRvIHBlbG8gcGx1Z2luIFdlcnVzIERhc2hib2FyZCoqLiBFZGl0ZSBvIGJsb2NvIGBqc29uYCBubyBmaW0gZSByZWNhcnJlZ3VlIChDdHJsK1IpLlwiLFxuICAgIFwiPiBCbG9jbyB2YXppby9pbnZcdTAwRTFsaWRvIFx1MjE5MiBvIHBsdWdpbiB1c2Egb3MgcGFkclx1MDBGNWVzIGVtYnV0aWRvcy4gKipDb21wYXJ0aWxoZSBlc3RhIG5vdGEqKiBwYXJhIGRpc3RyaWJ1aXJcIixcbiAgICBcIj4gdW0gXFxcImpvZ29cXFwiIGludGVpcm8gKHByb2pldG9zLCBldGlxdWV0YXMsIFhQLCBuXHUwMEVEdmVpcywgY29ucXVpc3RhcyBlIG1ldGFzKS5cIiwgXCJcIixcbiAgICBcIiMjIENvbW8gZnVuY2lvbmFcIiwgXCJcIixcbiAgICBcIi0gKipYUCBwb3IgdGFyZWZhKiogPSBgeHBCeVByaW9yaXR5W3ByaW9yaWRhZGVdYCArIHNvbWEgZG9zIGB4cEJ5TGFiZWxgIGRhcyBldGlxdWV0YXMgZGEgdGFyZWZhIChtXHUwMEVEbmltbyAwKS5cIixcbiAgICBcIi0gKipcXFwiU2FsdmFyIGNvbmNsdVx1MDBFRGRhc1xcXCIqKiAoYWJhIEdhbWlmaWNhXHUwMEU3XHUwMEUzbykgcmVnaXN0cmEgYXMgdGFyZWZhcyBmZWl0YXMgbm8gbG9nIGUgZFx1MDBFMSBvIFhQOyBvIGJvdFx1MDBFM28gKipcdTI3MTcgblx1MDBFM28gZmVpdGEqKiBkZXNjb250YSAocGVuYWxpZGFkZSBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlwiLFxuICAgIFwiLSAqKk5cdTAwRUR2ZWwqKiA9IGRlcml2YWRvIGRvIFhQIGFjdW11bGFkbyBwZWxhIGN1cnZhIGBsZXZlbEN1cnZlYCAoZ2VyYWwpIG91IHBlbGEgZGVmaW5pXHUwMEU3XHUwMEUzbyBkbyBlc2NvcG8gZW0gYHNjb3BlTGV2ZWxzYC5cIixcbiAgICBcIi0gQSBhYmEgbW9zdHJhOiBuXHUwMEVEdmVsIGdlcmFsLCAqKm1ldGFzKiogZG8gcGVyXHUwMEVEb2RvLCBnclx1MDBFMWZpY28gZGUgWFAsICoqZXNjb3BvcyoqIChwcm9qZXRvcy9ldGlxdWV0YXMpIGUgKipjb25xdWlzdGFzKiouXCIsXG4gICAgXCItIFRvZGEgZW50cmFkYSBpbnZcdTAwRTFsaWRhIFx1MDBFOSAqKmlnbm9yYWRhKiogKG8gcmVzdG8gY29udGludWEgdmFsZW5kbykuIE8gbFx1MDBFMXBpcyAoXHUyNzBGXHVGRTBGKSBuYSBhYmEgYWJyZSBlc3RhIG5vdGEuXCIsIFwiXCIsXG4gICAgXCIjIyBDYW1wb3MgZG8gSlNPTlwiLCBcIlwiLFxuICAgIFwiIyMjIGBwcm9qZWN0c2AgXHUyMDE0IGxpc3RhIGRlIHRleHRvXCIsIFwiXCIsXG4gICAgXCJOb21lcyBkb3MgcHJvamV0b3MgZG8gam9nby4gTyBib3RcdTAwRTNvICoqUHJvdmlzaW9uYXIgVG9kb2lzdCoqIChDb25maWd1cmFcdTAwRTdcdTAwRjVlcykgY3JpYSBubyBUb2RvaXN0IG9zIHF1ZSBmYWx0YW07IG5hIGFiYSwgdW0gZXNjb3BvIHF1ZSBzXHUwMEYzIGV4aXN0ZSBubyBUb2RvaXN0IGdhbmhhIG8gYm90XHUwMEUzbyAqKisgQ29mcmUqKiBwYXJhIGVudHJhciBhcXVpLlwiLFxuICAgIFwiRXguOiBgW1xcXCJFc3R1ZG9zXFxcIiwgXFxcIlRyYWJhbGhvXFxcIl1gXCIsIFwiXCIsXG4gICAgXCIjIyMgYGxhYmVsc2AgXHUyMDE0IGxpc3RhXCIsIFwiXCIsXG4gICAgXCJFdGlxdWV0YXMgZG8gam9nby4gQ2FkYSBpdGVtIFx1MDBFOSBgXFxcIm5vbWVcXFwiYCAqKm91KiogYHsgXFxcIm5hbWVcXFwiOiBcXFwibm9tZVxcXCIsIFxcXCJjb2xvclxcXCI6IFxcXCJibHVlXFxcIiB9YCAoYSBjb3IgXHUwMEU5IHVzYWRhIGFvIGNyaWFyIG5vIFRvZG9pc3QpLlwiLFxuICAgIFwiQ29yZXMgdlx1MDBFMWxpZGFzOiBcIiArIGNvbG9ycyArIFwiLlwiLFxuICAgIFwiRXguOiBgW3sgXFxcIm5hbWVcXFwiOiBcXFwiZm9jb1xcXCIsIFxcXCJjb2xvclxcXCI6IFxcXCJibHVlXFxcIiB9LCBcXFwidXJnZW50ZVxcXCJdYFwiLCBcIlwiLFxuICAgIFwiIyMjIGB4cEJ5UHJpb3JpdHlgIFx1MjAxNCBvYmpldG9cIiwgXCJcIixcbiAgICBcIlhQIGdhbmhvIHBvciBwcmlvcmlkYWRlIGRhIHRhcmVmYSAoYHAxYCA9IG1haXMgYWx0YS91cmdlbnRlIFx1MjAyNiBgcDRgID0gcGFkclx1MDBFM28pLiBPIHF1ZSBmYWx0YXIgdXNhIG8gcGFkclx1MDBFM28gYHAxIDggXHUwMEI3IHAyIDUgXHUwMEI3IHAzIDMgXHUwMEI3IHA0IDFgLiBWYWxvcmVzIFx1MjI2NSAwLlwiLFxuICAgIFwiRXguOiBgeyBcXFwicDFcXFwiOiAxMCwgXFxcInAyXFxcIjogNSwgXFxcInAzXFxcIjogMywgXFxcInA0XFxcIjogMSB9YFwiLCBcIlwiLFxuICAgIFwiIyMjIGB4cEJ5TGFiZWxgIFx1MjAxNCBvYmpldG9cIiwgXCJcIixcbiAgICBcIkJcdTAwRjRudXMgZGUgWFAgKipzb21hZG8qKiBwb3IgZXRpcXVldGEgcHJlc2VudGUgbmEgdGFyZWZhIChwb2RlIHNlciBuZWdhdGl2byBwYXJhIHBlbmFsaXphcikuIEV0aXF1ZXRhcyBmb3JhIGRhIGxpc3RhIHNvbWFtIDAuXCIsXG4gICAgXCJFeC46IGB7IFxcXCJmb2NvXFxcIjogMiwgXFxcImNoYXRvXFxcIjogLTMgfWAgXHUyMTkyIHVtYSBgcDFgIGNvbSBgQGZvY29gIHJlbmRlIGA4ICsgMiA9IDEwYCBYUC5cIiwgXCJcIixcbiAgICBcIiMjIyBgbGV2ZWxDdXJ2ZWAgXHUyMDE0IHRleHRvIChmXHUwMEYzcm11bGEpXCIsIFwiXCIsXG4gICAgXCJGXHUwMEYzcm11bGEgZG8gWFAgKipjdW11bGF0aXZvKiogcGFyYSBhbGNhblx1MDBFN2FyIG8gblx1MDBFRHZlbCBgbmAuIFZhbGUgcGFyYSBvIG5cdTAwRUR2ZWwgKipnZXJhbCoqIGUgcGFyYSBxdWFscXVlciBlc2NvcG8gc2VtIGVudHJhZGEgZW0gYHNjb3BlTGV2ZWxzYC5cIixcbiAgICBcIi0gVmFyaVx1MDBFMXZlbDogYG5gIChuXHUwMEZBbWVybyBkbyBuXHUwMEVEdmVsLCBcdTIyNjUgMSkuIE9wZXJhZG9yZXM6IGArYCBgLWAgYCpgIGAvYCBgJWAgYF5gIChwb3RcdTAwRUFuY2lhKSBlIHBhclx1MDBFQW50ZXNlcyBgKCApYC5cIixcbiAgICBcIi0gUGFkclx1MDBFM28gYDEwMCAqIG5eMmAgKGVxdWl2YWxlIGFvIGFudGlnbyBcdTIzMEFcdTIyMUEoWFAvMTAwKVx1MjMwQiwgKipzZW0gdGV0byoqKS5cIixcbiAgICBcIi0gTyBuXHUwMEVEdmVsIFx1MDBFOSBvICoqbWFpb3IgYG5gKiogY3VqbyBsaW1pYXIgXHUwMEU5IGBcdTIyNjRgIGFvIFhQIGFjdW11bGFkby4gQ29tIGAxMDAqbl4yYDogMTAwIFhQIFx1MjE5MiBOdiAxLCA0MDAgXHUyMTkyIE52IDIsIDkwMCBcdTIxOTIgTnYgMy5cIixcbiAgICBcIkV4LjogYFxcXCI1MCAqIG5cXFwiYCAobGluZWFyKSBcdTAwQjcgYFxcXCIxMDAgKiBuXjEuNVxcXCJgIFx1MDBCNyBgXFxcIjIwMCArIDUwICogbl4yXFxcImAuXCIsIFwiXCIsXG4gICAgXCIjIyMgYHNjb3BlTGV2ZWxzYCBcdTIwMTQgb2JqZXRvXCIsIFwiXCIsXG4gICAgXCJOXHUwMEVEdmVpcyAqKnByXHUwMEYzcHJpb3MqKiBwb3IgcHJvamV0by9ldGlxdWV0YSAoc29icmVwXHUwMEY1ZW0gYGxldmVsQ3VydmVgKS4gRG9pcyBzdWItb2JqZXRvcywgYHByb2plY3RzYCBlIGBsYWJlbHNgLCBtYXBlYW5kbyBub21lIFx1MjE5MiBkZWZpbmlcdTAwRTdcdTAwRTNvLiBEdWFzIGZvcm1hczpcIixcbiAgICBcIi0gKipGXHUwMEYzcm11bGEgY29tIHRldG86KiogYHsgXFxcImxldmVsc1xcXCI6IDEwMCwgXFxcImN1cnZlXFxcIjogXFxcIjUwICogblxcXCIgfWAgXHUyMDE0IGdlcmEgMTAwIG5cdTAwRUR2ZWlzIHBlbGEgZlx1MDBGM3JtdWxhOyBvIG5cdTAwRUR2ZWwgMTAwIFx1MDBFOSBvIHRldG8uXCIsXG4gICAgXCItICoqVGFiZWxhIGV4cGxcdTAwRURjaXRhOioqIGB7IFxcXCJ0aHJlc2hvbGRzXFxcIjogWzMwLCA4MCwgMTUwLCAyNTBdIH1gIFx1MjAxNCBYUCBjdW11bGF0aXZvIGRlIGNhZGEgblx1MDBFRHZlbCAoZW0gb3JkZW0gY3Jlc2NlbnRlKS4gQXF1aSBvIGVzY29wbyB0ZW0gNCBuXHUwMEVEdmVpcy4gTm8gdGV0bywgYSBiYXJyYSBmaWNhIGNoZWlhIGUgbyBlc2NvcG8gbW9zdHJhICoqXFxcIm1cdTAwRTF4XFxcIioqLlwiLFxuICAgIFwiRXguOlwiLFxuICAgIFwiYGBgXCIsXG4gICAgXCJcXFwic2NvcGVMZXZlbHNcXFwiOiB7XCIsXG4gICAgXCIgIFxcXCJwcm9qZWN0c1xcXCI6IHsgXFxcIkVzdHVkb3NcXFwiOiB7IFxcXCJ0aHJlc2hvbGRzXFxcIjogWzMwLCA4MCwgMTUwLCAyNTBdIH0gfSxcIixcbiAgICBcIiAgXFxcImxhYmVsc1xcXCI6ICAgeyBcXFwiZm9jb1xcXCI6IHsgXFxcImxldmVsc1xcXCI6IDEwLCBcXFwiY3VydmVcXFwiOiBcXFwiNTAgKiBuXFxcIiB9IH1cIixcbiAgICBcIn1cIixcbiAgICBcImBgYFwiLCBcIlwiLFxuICAgIFwiIyMjIGBhY2hpZXZlbWVudHNgIFx1MjAxNCBsaXN0YSBkZSBiYWRnZXMgKHBlcm1hbmVudGVzKVwiLCBcIlwiLFxuICAgIFwifCBjYW1wbyB8IG8gcXVcdTAwRUEgfFwiLCBcInwtLS18LS0tfFwiLFxuICAgIFwifCBgaWRgIHwgaWRlbnRpZmljYWRvciBcdTAwRkFuaWNvIHxcIixcbiAgICBcInwgYHRpdGxlYCB8IG5vbWUgZXhpYmlkbyB8XCIsXG4gICAgXCJ8IGBkZXNjYCB8IGRlc2NyaVx1MDBFN1x1MDBFM28gKHRvb2x0aXApIHxcIixcbiAgICBcInwgYGljb25gIHwgXHUwMEVEY29uZSAqKkx1Y2lkZSoqIChleC46IGBzdGFyYCwgYGZsYW1lYCwgYHRyb3BoeWAsIGBtZWRhbGAsIGBjcm93bmAsIGB6YXBgLCBgc3VuYCwgYGZvbGRlcmAsIGB0YWdgKSBcdTIwMTQgdmVyIGx1Y2lkZS5kZXYgfFwiLFxuICAgIFwifCBgY2F0YCB8IGNhdGVnb3JpYSAodmlyYSBjYWJlXHUwMEU3YWxobyBuYSBVSSkgfFwiLFxuICAgIFwifCBgbWV0cmljYCB8IG8gcXVlIG1lZGUgKHRhYmVsYSBkZSBtXHUwMEU5dHJpY2FzIGFiYWl4bykgfFwiLFxuICAgIFwifCBgZ29hbGAgfCBkZXNibG9xdWVpYSBxdWFuZG8gYSBtXHUwMEU5dHJpY2EgXHUyMjY1IGdvYWwgKGZpY2EgcGVybWFuZW50ZSkgfFwiLFxuICAgIFwiRXguOiBgeyBcXFwiaWRcXFwiOlxcXCJsdmw1XFxcIiwgXFxcImNhdFxcXCI6XFxcIk5cdTAwRUR2ZWxcXFwiLCBcXFwidGl0bGVcXFwiOlxcXCJBcHJlbmRpelxcXCIsIFxcXCJkZXNjXFxcIjpcXFwiQWxjYW5jZSBvIG5cdTAwRUR2ZWwgNVxcXCIsIFxcXCJpY29uXFxcIjpcXFwic3RhclxcXCIsIFxcXCJtZXRyaWNcXFwiOlxcXCJsZXZlbFxcXCIsIFxcXCJnb2FsXFxcIjo1IH1gXCIsXG4gICAgXCJMaXN0YSB2YXppYSBcdTIxOTIgdXNhIGFzIGNvbnF1aXN0YXMgcGFkclx1MDBFM28gZW1idXRpZGFzLlwiLCBcIlwiLFxuICAgIFwiKipNXHUwMEU5dHJpY2FzIGRpc3Bvblx1MDBFRHZlaXMgKHBhcmEgYGFjaGlldmVtZW50c2ApOioqXCIsIFwiXCIsIFwifCBtZXRyaWMgfCBtZWRlIHxcIiwgXCJ8LS0tfC0tLXxcIiwgcm93cywgXCJcIixcbiAgICBcIiMjIyBgZ29hbHNgIFx1MjAxNCBtZXRhcyBkbyBwZXJcdTAwRURvZG8gKHJlc2V0YW0gc296aW5oYXMpXCIsIFwiXCIsXG4gICAgXCJPIHByb2dyZXNzbyB2ZW0gZGFzIHRhcmVmYXMgKipmZWl0YXMqKiBubyBwZXJcdTAwRURvZG8gYXR1YWw7IGFvIHZpcmFyIG8gcGVyXHUwMEVEb2RvLCByZWNvbWVcdTAwRTdhLlwiLFxuICAgIFwifCBjYW1wbyB8IG8gcXVcdTAwRUEgfFwiLCBcInwtLS18LS0tfFwiLFxuICAgIFwifCBgaWRgIHwgaWRlbnRpZmljYWRvciBcdTAwRkFuaWNvIHxcIixcbiAgICBcInwgYHRpdGxlYCB8IG5vbWUgZXhpYmlkbyB8XCIsXG4gICAgXCJ8IGBwZXJpb2RgIHwgYGRheWAgKGhvamUpIFx1MDBCNyBgd2Vla2AgKHNlbWFuYSwgY29tZVx1MDBFN2EgbmEgc2VndW5kYSkgXHUwMEI3IGBtb250aGAgKG1cdTAwRUFzKSBcdTAwQjcgYHllYXJgIChhbm8pIHxcIixcbiAgICBcInwgYG1ldHJpY2AgfCBgeHBgIChzb21hIGRlIFhQKSBvdSBgdGFza3NgIChuXHUwMEJBIGRlIHRhcmVmYXMgY29uY2x1XHUwMEVEZGFzKSB8XCIsXG4gICAgXCJ8IGB0YXJnZXRgIHwgYWx2byBhIGFsY2FuXHUwMEU3YXIgKD4gMCkgfFwiLFxuICAgIFwifCBgcHJvamVjdGAgfCBfKG9wY2lvbmFsKV8gY29udGEgc1x1MDBGMyB0YXJlZmFzIGRlc3RlIHByb2pldG8gfFwiLFxuICAgIFwifCBgbGFiZWxgIHwgXyhvcGNpb25hbClfIGNvbnRhIHNcdTAwRjMgdGFyZWZhcyBjb20gZXN0YSBldGlxdWV0YSB8XCIsXG4gICAgXCJFeC46IGB7IFxcXCJpZFxcXCI6XFxcImZvY28tc2VtXFxcIiwgXFxcInRpdGxlXFxcIjpcXFwiRm9jbyBkYSBzZW1hbmFcXFwiLCBcXFwicGVyaW9kXFxcIjpcXFwid2Vla1xcXCIsIFxcXCJtZXRyaWNcXFwiOlxcXCJ0YXNrc1xcXCIsIFxcXCJ0YXJnZXRcXFwiOjEwLCBcXFwibGFiZWxcXFwiOlxcXCJmb2NvXFxcIiB9YFwiLFxuICAgIFwiTGlzdGEgdmF6aWEgXHUyMTkyIHVzYSBhcyBtZXRhcyBwYWRyXHUwMEUzbyBlbWJ1dGlkYXMuXCIsIFwiXCIsXG4gICAgXCIjIyBPYnNlcnZhXHUwMEU3XHUwMEY1ZXNcIiwgXCJcIixcbiAgICBcIi0gTyBYUCBkZSB0YXJlZmFzICoqalx1MDBFMSByZWdpc3RyYWRhcyoqIG5vIGxvZyBuXHUwMEUzbyBtdWRhIGFvIGFsdGVyYXIgYHhwQnlQcmlvcml0eWAvYHhwQnlMYWJlbGAgKG8gWFAgXHUwMEU5IGNhcmltYmFkbyBuYSBob3JhIGRhIGNvbmNsdXNcdTAwRTNvKTsgYSBtdWRhblx1MDBFN2EgdmFsZSBwYXJhIGFzIHByXHUwMEYzeGltYXMuXCIsXG4gICAgXCItIEEgc2ludGF4ZSBkZSBmXHUwMEYzcm11bGEgXHUwMEU5IGFyaXRtXHUwMEU5dGljYSAqKnNlZ3VyYSoqIChzZW0gY1x1MDBGM2RpZ28gZXhlY3V0XHUwMEUxdmVsKTogYXBlbmFzIGBuYCwgblx1MDBGQW1lcm9zIGUgYCsgLSAqIC8gJSBeICggKWAuXCIsXG4gICAgXCItIFBlbmFsaWRhZGVzIChcXFwiblx1MDBFM28gZmVpdGFcXFwiKSAqKm5cdTAwRTNvKiogY29udGFtIHBhcmEgYXMgbWV0YXMuXCIsIFwiXCIsXG4gICAgXCIjIyBDb25maWd1cmFcdTAwRTdcdTAwRTNvIGF0dWFsXCIsIFwiXCIsXG4gICAgXCJgYGBqc29uXCIsIGpzb24sIFwiYGBgXCIsIFwiXCIsXG4gIF0uam9pbihcIlxcblwiKTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG4vLyAobWQvaW1nIGRhIHN1Ylx1MDBFMXJ2b3JlIHZcdTAwRUFtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlLilcbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG4vLyBBZ3JlZ2FkbyBkZSB1cmdcdTAwRUFuY2lhIGRlIHVtYSBzdWJcdTAwRTFydm9yZSAodmVtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlKS5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFVNQSBwYXNzYWRhIChERlMpIG1vbnRhIG9zIGFncmVnYWRvcyBwb3IgcGFzdGEgKHN1Ylx1MDBFMXJ2b3JlKSArIG9zIGdsb2JhaXMgcXVlXG4vLyB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIGNvbnNvbWVtIFx1MjAxNCBhbnRlcyBjYWRhIHNlXHUwMEU3XHUwMEUzbyB2YXJyaWEgbyBjb2ZyZSBwb3IgY29udGEgcHJcdTAwRjNwcmlhXG4vLyAofjhcdTIwMTMxMFx1MDBENyBwb3IgcmVuZGVyKS4gSW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdCBlIHJlY3JpYWRvIHNvYiBkZW1hbmRhLlxuaW50ZXJmYWNlIEZvbGRlckFnZyB7XG4gIG1kOiBudW1iZXI7ICAgICAgICAgIC8vIG5vdGFzIC5tZCAoZXhjZXRvIHN0YXR1cy5tZCkgbmEgc3ViXHUwMEUxcnZvcmVcbiAgaW1nOiBudW1iZXI7ICAgICAgICAgLy8gaW1hZ2VucyBuYSBzdWJcdTAwRTFydm9yZVxuICByZXZpZXdlZDogbnVtYmVyOyAgICAvLyAubWQgY29tIHJldmlld2VkOnRydWUgbmEgc3ViXHUwMEUxcnZvcmVcbiAgdXJnZW5jeTogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyAgIC8vIG5vdGFzIGNvbSB1cmdlbmN5IChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYylcbiAgdXJnZW5jeU1heDogVXJnZW5jeSB8IG51bGw7XG4gIHJlY2VudDogVEZpbGVbXTsgICAgIC8vIGF0XHUwMEU5IDQgbm90YXMgLm1kIG1haXMgcmVjZW50ZXMgKG10aW1lKSBkYSBzdWJcdTAwRTFydm9yZVxufVxuaW50ZXJmYWNlIFZhdWx0Q2FjaGUge1xuICBieUZvbGRlcjogTWFwPHN0cmluZywgRm9sZGVyQWdnPjsgICAgICAgICAgICAgIC8vIHBhdGggZGEgcGFzdGEgXHUyMTkyIGFncmVnYWRvc1xuICBkYXRlZE5vdGVzOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdOyAgIC8vIG5vdGFzIGNvbSBkYXRhIChmcm9udG1hdHRlciBkYXRlOiBvdSBub21lIEFBQUEtTU0tREQpXG4gIGN0aW1lQnlEYXk6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAgICAgICAgICAgLy8gQUFBQS1NTS1ERCBcdTIxOTIgblx1MDBCQSBkZSBub3RhcyBjcmlhZGFzIChjdGltZSlcbiAgdG90YWxOb3RlczogbnVtYmVyO1xuICB0b3RhbFJldmlld2VkOiBudW1iZXI7XG59XG5jb25zdCBFTVBUWV9BR0c6IEZvbGRlckFnZyA9IHsgbWQ6IDAsIGltZzogMCwgcmV2aWV3ZWQ6IDAsIHVyZ2VuY3k6IFtdLCB1cmdlbmN5TWF4OiBudWxsLCByZWNlbnQ6IFtdIH07XG5cbmZ1bmN0aW9uIGJ1aWxkVmF1bHRDYWNoZShhcHA6IEFwcCk6IFZhdWx0Q2FjaGUge1xuICBjb25zdCBieUZvbGRlciA9IG5ldyBNYXA8c3RyaW5nLCBGb2xkZXJBZ2c+KCk7XG4gIGNvbnN0IGRhdGVkTm90ZXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgY29uc3QgY3RpbWVCeURheSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDA7XG5cbiAgY29uc3Qgd2FsayA9IChmb2xkZXI6IFRGb2xkZXIpOiBGb2xkZXJBZ2cgPT4ge1xuICAgIGNvbnN0IGFnZzogRm9sZGVyQWdnID0geyBtZDogMCwgaW1nOiAwLCByZXZpZXdlZDogMCwgdXJnZW5jeTogW10sIHVyZ2VuY3lNYXg6IG51bGwsIHJlY2VudDogW10gfTtcbiAgICBjb25zdCByZWNlbnQ6IFRGaWxlW10gPSBbXTsgICAvLyBjYW5kaWRhdG9zOiBhcnF1aXZvcyBwclx1MDBGM3ByaW9zICsgdG9wLTQgZGUgY2FkYSBmaWxob1xuICAgIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICBjb25zdCBzdWIgPSB3YWxrKGMpO1xuICAgICAgICBhZ2cubWQgKz0gc3ViLm1kOyBhZ2cuaW1nICs9IHN1Yi5pbWc7IGFnZy5yZXZpZXdlZCArPSBzdWIucmV2aWV3ZWQ7XG4gICAgICAgIGlmIChzdWIudXJnZW5jeS5sZW5ndGgpIGFnZy51cmdlbmN5LnB1c2goLi4uc3ViLnVyZ2VuY3kpO1xuICAgICAgICBpZiAoc3ViLnJlY2VudC5sZW5ndGgpIHJlY2VudC5wdXNoKC4uLnN1Yi5yZWNlbnQpO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgICAgYWdnLm1kKys7XG4gICAgICAgICAgcmVjZW50LnB1c2goYyk7XG4gICAgICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgICAgIGNvbnN0IGZtID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgaWYgKGZtPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgeyBhZ2cucmV2aWV3ZWQrKzsgdG90YWxSZXZpZXdlZCsrOyB9XG4gICAgICAgICAgY29uc3QgdSA9IGZtPy51cmdlbmN5O1xuICAgICAgICAgIGlmICh1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiKSBhZ2cudXJnZW5jeS5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICAgICAgY29uc3QgY2sgPSB0b0tleShuZXcgRGF0ZShjLnN0YXQuY3RpbWUpKTtcbiAgICAgICAgICBjdGltZUJ5RGF5LnNldChjaywgKGN0aW1lQnlEYXkuZ2V0KGNrKSA/PyAwKSArIDEpO1xuICAgICAgICAgIGNvbnN0IG0gPSBjLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKGZtPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgICAgICBpZiAoZCkgZGF0ZWROb3Rlcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGFnZy5pbWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWNlbnQuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgICBhZ2cucmVjZW50ID0gcmVjZW50LnNsaWNlKDAsIDQpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgYWdnLnVyZ2VuY3kpXG4gICAgICBpZiAoIWFnZy51cmdlbmN5TWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbYWdnLnVyZ2VuY3lNYXhdKSBhZ2cudXJnZW5jeU1heCA9IGl0LmxldmVsO1xuICAgIGFnZy51cmdlbmN5LnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gICAgYnlGb2xkZXIuc2V0KGZvbGRlci5wYXRoLCBhZ2cpO1xuICAgIHJldHVybiBhZ2c7XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiB7IGJ5Rm9sZGVyLCBkYXRlZE5vdGVzLCBjdGltZUJ5RGF5LCB0b3RhbE5vdGVzLCB0b3RhbFJldmlld2VkIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBcdTI1MDBcdTI1MDAgQ29udHJvbGFkb3IgZG8gVG9kb2lzdCAoY29tcGFydGlsaGFkbzogZGFzaGJvYXJkICsgYWJhIGRlZGljYWRhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERldFx1MDBFOW0gbyBlc3RhZG8gZGFzIHRhcmVmYXMsIGEgYnVzY2EsIGEgcmVuZGVyaXphXHUwMEU3XHUwMEUzbyBkYSBsaXN0YSBlIGFzIGFcdTAwRTdcdTAwRjVlc1xuLy8gKGNyaWFyL2VkaXRhci9jb25jbHVpci9leGNsdWlyKS4gYHJlcmVuZGVyYCBcdTAwRTkgbyBjYWxsYmFjayBkYSB2aWV3IGRvbmEgKHJlLXJlbmRlclxuLy8gY29tcGxldG8pLiBUZW0gdG9vbHRpcCBwclx1MDBGM3ByaW8gcGFyYSBuXHUwMEUzbyBkZXBlbmRlciBkYSB2aWV3LlxuY2xhc3MgVG9kb2lzdENvbnRyb2xsZXIge1xuICBwcml2YXRlIHRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIGxhYmVsQ29sb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSBsb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgbGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgbm9EYXRlT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge1xuICAgIHRoaXMubG9hZENhY2hlKCk7ICAgLy8gbW9zdHJhIG8gXHUwMEZBbHRpbW8gcmVzdWx0YWRvIG5hIGhvcmEgKG9mZmxpbmUpLCBhbnRlcyBkbyAxXHUwMEJBIGZldGNoXG4gIH1cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgLy8gTm9tZSBkbyBwcm9qZXRvIHBlbG8gaWQgKHJldXNhZG8gcGVsYSBHYW1pZmljYVx1MDBFN1x1MDBFM28pLiBWYXppbyBzZSBkZXNjb25oZWNpZG8uXG4gIHByb2plY3ROYW1lKGlkPzogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIChpZCAmJiB0aGlzLnByb2plY3RNYXAuZ2V0KGlkKSkgfHwgXCJcIjsgfVxuICAvLyBOb21lcyBkZSBwcm9qZXRvcy9ldGlxdWV0YXMgcXVlIGV4aXN0ZW0gaG9qZSBubyBUb2RvaXN0IChwYXJhIHNpbmFsaXphciBvcyBxdWUgc3VtaXJhbSkuXG4gIGtub3duUHJvamVjdHMoKTogU2V0PHN0cmluZz4geyByZXR1cm4gbmV3IFNldCh0aGlzLnByb2plY3RNYXAudmFsdWVzKCkpOyB9XG4gIGtub3duTGFiZWxzKCk6IFNldDxzdHJpbmc+IHsgcmV0dXJuIG5ldyBTZXQodGhpcy5sYWJlbENvbG9ycy5rZXlzKCkpOyB9XG4gIGhhc0RhdGEoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmZldGNoZWRBdCA+IDA7IH0gICAvLyBqXHUwMEUxIGhvdXZlIHVtIGZldGNoIChvbmxpbmUpIFx1MjE5MiBrbm93biogY29uZmlcdTAwRTF2ZWlzXG5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUZpbHRlcnModGFza3M6IFRvZG9pc3RUYXNrW10pOiBUb2RvaXN0VGFza1tdIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgaWYgKCFmLnByb2plY3RzLmxlbmd0aCAmJiAhZi5sYWJlbHMubGVuZ3RoKSByZXR1cm4gdGFza3M7XG4gICAgY29uc3QgcHMgPSBuZXcgU2V0KGYucHJvamVjdHMpLCBscyA9IG5ldyBTZXQoZi5sYWJlbHMpO1xuICAgIHJldHVybiB0YXNrcy5maWx0ZXIodCA9PiB7XG4gICAgICBpZiAocHMuc2l6ZSAmJiAhKHQucHJvamVjdF9pZCAmJiBwcy5oYXModC5wcm9qZWN0X2lkKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChscy5zaXplICYmICEodC5sYWJlbHMgPz8gW10pLnNvbWUobCA9PiBscy5oYXMobCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENvbG9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxDb2xvcnMuZ2V0KG5hbWUpID8/IExBQkVMX0ZBTExCQUNLO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENoaXAoaG9zdDogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY2xzOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpcCA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMubGFiZWxDb2xvcihuYW1lKTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bmFtZX1gIH0pO1xuICAgIHJldHVybiBjaGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2O1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICBwcml2YXRlIHNob3dUYXNrVGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC10YXNrLXRpcFwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtcHJpXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaU1ldGEodC5wcmlvcml0eSkuY29sb3I7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXRpdGxlXCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgZCA9IHQuZGVzY3JpcHRpb24hLnRyaW0oKTtcbiAgICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtZGVzY1wiLCB0ZXh0OiBkLmxlbmd0aCA+IERFU0NfTUFYID8gZC5zbGljZSgwLCBERVNDX01BWCkgKyBcIlx1MjAyNlwiIDogZCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRhc2tUaXAoZWw6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rhc2tUaXAoZWwsIHQpKTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNsaWNrYWJsZShjaGVjaywgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCk7IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAmJiBwcm9qKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1wcm9qXCIsIHRleHQ6IHByb2ogfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB0aGlzLmxhYmVsQ2hpcChyb3csIGwsIFwid2QtdG9kby1yb3ctbGFiZWxcIik7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKHNob3dEYXRlICYmIGRrKSB7XG4gICAgICBjb25zdCBbLCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfWAgfSk7XG4gICAgfVxuICAgIGlmICh0LmR1ZT8uaXNfcmVjdXJyaW5nKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlY3VyXCIsIHRleHQ6IFwiXHUyN0YzXCIgfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHggPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXVuZG9uZVwiIH0pO1xuICAgICAgc2V0SWNvbih4LCBcInhcIik7XG4gICAgICB4LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5cdTAwRTNvIGZlaXRhIFx1MjAxNCBwdW5pXHUwMEU3XHUwMEUzbyBkZSBYUCBlIGFwYWdhIGRvIFRvZG9pc3RcIik7XG4gICAgICBjbGlja2FibGUoeCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4uZ2FtZS5tYXJrVW5kb25lKHQpOyB9KTtcbiAgICB9XG4gICAgY2xpY2thYmxlKHJvdywgKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KSk7XG4gICAgdGhpcy5hdHRhY2hUYXNrVGlwKHJvdywgdCk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRhc2tCdG4oaG9zdDogSFRNTEVsZW1lbnQsIHByZWZpbGxEdWU/OiBzdHJpbmcsIHRpdGxlID0gXCJOb3ZhIHRhcmVmYVwiKSB7XG4gICAgY29uc3QgYiA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWFkZFwiIH0pO1xuICAgIHNldEljb24oYiwgXCJwbHVzXCIpO1xuICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICBjbGlja2FibGUoYiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJjcmVhdGVcIiwgcHJlZmlsbER1ZSB9KTsgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRm9ybShvcHRzOiB7IG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjsgdGFzaz86IFRvZG9pc3RUYXNrOyBwcmVmaWxsRHVlPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4udGhpcy5sYWJlbENvbG9ycy5rZXlzKCksIC4uLnRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKV0pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIG5ldyBUYXNrRm9ybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICBtb2RlOiBvcHRzLm1vZGUsXG4gICAgICB0YXNrOiBvcHRzLnRhc2ssXG4gICAgICBwcmVmaWxsRHVlOiBvcHRzLnByZWZpbGxEdWUsXG4gICAgICBwcm9qZWN0czogdGhpcy5wcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcy5jb21wb25lbnQsIHtcbiAgICAgIHRhc2s6IHQsXG4gICAgICBwcm9qZWN0TmFtZTogdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdWJtaXRUYXNrRm9ybShtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCIsIHRhc2s6IFRvZG9pc3RUYXNrIHwgdW5kZWZpbmVkLCB2OiBUYXNrRm9ybVZhbHVlcyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB2LmNvbnRlbnQsIHByaW9yaXR5OiB2LnByaW9yaXR5IH07XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uLnRyaW0oKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgaWYgKHYucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHYucHJvamVjdElkO1xuICAgICAgICBpZiAodi5sYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ3JpYWRhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH0gZWxzZSBpZiAodGFzaykge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHt9O1xuICAgICAgICBpZiAodi5jb250ZW50ICE9PSB0YXNrLmNvbnRlbnQpIGZpZWxkcy5jb250ZW50ID0gdi5jb250ZW50O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAhPT0gKHRhc2suZGVzY3JpcHRpb24gPz8gXCJcIikpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb247XG4gICAgICAgIGlmICh2LnByaW9yaXR5ICE9PSB0YXNrLnByaW9yaXR5KSBmaWVsZHMucHJpb3JpdHkgPSB2LnByaW9yaXR5O1xuICAgICAgICBjb25zdCBvbGREYXRlID0gdGFzay5kdWU/LmRhdGUgPyB0YXNrLmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBcIlwiO1xuICAgICAgICBpZiAodi5kdWVEYXRlICE9PSBvbGREYXRlKSB7XG4gICAgICAgICAgaWYgKHYuZHVlRGF0ZSkgZmllbGRzLmR1ZV9kYXRlID0gdi5kdWVEYXRlO1xuICAgICAgICAgIGVsc2UgZmllbGRzLmR1ZV9zdHJpbmcgPSBcIm5vIGRhdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMID0gKHRhc2subGFiZWxzID8/IFtdKS5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCIgXCIpO1xuICAgICAgICBpZiAob2xkTCAhPT0gbmV3TCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGRzKS5sZW5ndGgpIGF3YWl0IHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCBmaWVsZHMpO1xuICAgICAgICBjb25zdCBvbGRQcm9qID0gdGFzay5wcm9qZWN0X2lkID8/IFwiXCI7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCAhPT0gb2xkUHJvaiAmJiB2LnByb2plY3RJZCkgYXdhaXQgbW92ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCB2LnByb2plY3RJZCk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBTYWx2YTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1RDgzRFx1REREMSBFeGNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGV4Y2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY29tcGxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybjtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNsb3NlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDAsIHQpO1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNTdGFsZSgpOiBib29sZWFuIHsgcmV0dXJuIERhdGUubm93KCkgLSB0aGlzLmZldGNoZWRBdCA+PSBUT0RPX1RUTDsgfVxuXG4gIC8vIEF1dG8tcmVmcmVzaCBwZXJpXHUwMEYzZGljbyAoaW50ZXJ2YWxvIG5vIG9ubG9hZCk6IHNcdTAwRjMgYnVzY2Egc2UgaFx1MDBFMSB2aWV3IGFiZXJ0YSwgdG9rZW5cbiAgLy8gY29uZmlndXJhZG8sIG5hZGEgZW0gdm9vIGUgbyBjYWNoZSBwYXNzb3UgZG8gVFRMLiBTZW0gdmlldyBhYmVydGEgPSBzZW0gY2hhbWFkYSBcdTAwRTAgQVBJLlxuICBtYXliZVJlZnJlc2goKSB7XG4gICAgaWYgKCF0aGlzLnN1YnMuc2l6ZSB8fCB0aGlzLmxvYWRpbmcpIHJldHVybjtcbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCkpIHJldHVybjtcbiAgICBpZiAodGhpcy5pc1N0YWxlKCkpIHZvaWQgdGhpcy5mZXRjaChmYWxzZSk7XG4gIH1cblxuICAvLyBDYWNoZSBvZmZsaW5lIChwb3ItZGlzcG9zaXRpdm8sIGxvY2FsU3RvcmFnZSBcdTIxOTIgblx1MDBFM28gc2luY3Jvbml6YSk6IGNhcnJlZ2EgbyBcdTAwRkFsdGltb1xuICAvLyByZXN1bHRhZG8gcGFyYSBhIGFiYSBhYnJpciBqXHUwMEUxIGNvbSBhcyB0YXJlZmFzLCBtZXNtbyBzZW0gaW50ZXJuZXQuXG4gIHByaXZhdGUgbG9hZENhY2hlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSB0aGlzLmFwcC5sb2FkTG9jYWxTdG9yYWdlKExTX1RPRE9fQ0FDSEUpO1xuICAgICAgY29uc3QgYyA9IHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHJhdykgOiByYXc7XG4gICAgICBpZiAoIWMgfHwgIUFycmF5LmlzQXJyYXkoYy50YXNrcykpIHJldHVybjtcbiAgICAgIHRoaXMudGFza3MgPSBjLnRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IEFycmF5LmlzQXJyYXkoYy5wcm9qZWN0cykgPyBjLnByb2plY3RzIDogW107XG4gICAgICB0aGlzLnByb2plY3RNYXAgPSBuZXcgTWFwKHRoaXMucHJvamVjdHMubWFwKChwOiBUb2RvaXN0UHJvamVjdCkgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKEFycmF5LmlzQXJyYXkoYy5sYWJlbHMpID8gYy5sYWJlbHMgOiBbXSk7XG4gICAgICB0aGlzLmZldGNoZWRBdCA9IHR5cGVvZiBjLmZldGNoZWRBdCA9PT0gXCJudW1iZXJcIiA/IGMuZmV0Y2hlZEF0IDogMDtcbiAgICB9IGNhdGNoIHsgLyogY2FjaGUgYXVzZW50ZS9jb3Jyb21waWRvIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgcHJpdmF0ZSBwZXJzaXN0Q2FjaGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfVE9ET19DQUNIRSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0YXNrczogdGhpcy50YXNrcywgcHJvamVjdHM6IHRoaXMucHJvamVjdHMsIGxhYmVsczogWy4uLnRoaXMubGFiZWxDb2xvcnNdLCBmZXRjaGVkQXQ6IHRoaXMuZmV0Y2hlZEF0LFxuICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggeyAvKiBzZXJpYWxpemFcdTAwRTdcdTAwRTNvL3F1b3RhIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgLy8gQXZpc28gZGUgZnJlc2NvciBubyB0b3BvIGRhIGxpc3RhOiBkdXJhbnRlIHVtYSBidXNjYSwgb3UgcXVhbmRvIGVzdGFtb3NcbiAgLy8gZXhpYmluZG8gbyBjYWNoZSBwb3JxdWUgYSBcdTAwRkFsdGltYSBidXNjYSBmYWxob3UgKG9mZmxpbmUpLlxuICBwcml2YXRlIHJlbmRlckZyZXNobmVzcyhob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmxvYWRpbmcpIHsgaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mcmVzaFwiLCB0ZXh0OiBcIkF0dWFsaXphbmRvXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICBjb25zdCB3aGVuID0gdGhpcy5mZXRjaGVkQXQgPyByZWxUaW1lKG5ldyBEYXRlKHRoaXMuZmV0Y2hlZEF0KS50b0lTT1N0cmluZygpKSA6IFwiXHUyMDE0XCI7XG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZyZXNoIHdkLXRvZG8tZnJlc2gtc3RhbGVcIiwgdGV4dDogYFNlbSBjb25leFx1MDBFM28gXHUyMDE0IGV4aWJpbmRvIG8gXHUwMEZBbHRpbW8gY2FycmVnYWRvICgke3doZW59KWAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2gobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4gfHwgdGhpcy5sb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFt0YXNrcywgcHJvamVjdHMsIGxhYmVsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RQcm9qZWN0W10pLFxuICAgICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RMYWJlbFtdKSxcbiAgICAgIF0pO1xuICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcChwcm9qZWN0cy5tYXAocCA9PiBbcC5pZCwgcC5uYW1lXSkpO1xuICAgICAgdGhpcy5sYWJlbENvbG9ycyA9IG5ldyBNYXAobGFiZWxzLm1hcChsID0+IFtsLm5hbWUsIFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLXSkpO1xuICAgICAgdGhpcy5mZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBMYW5cdTAwRTdhIHVtIHBhY290ZTogY3JpYSBjYWRhIHRhcmVmYSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamUuIFNlcXVlbmNpYWxcbiAgLy8gKGV2aXRhIHJhamFkYSBuYSBBUEkpLiBBdHVhbGl6YSBhIGxpc3RhIGFvIGZpbmFsLlxuICBhc3luYyBsYXVuY2hQYWNrYWdlKHBrZzogVGFza1BhY2thZ2UpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdCBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMuXCIpOyByZXR1cm47IH1cbiAgICAvLyBSZXNvbHZlIHRcdTAwRUR0dWxvIGxpbXBvICsgZXRpcXVldGFzIChwYWNvdGUgKyBpbmxpbmUgQGV0aXF1ZXRhKSBwb3IgdGFyZWZhLlxuICAgIGNvbnN0IGl0ZW1zID0gcGtnLnRhc2tzLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikubWFwKGxpbmUgPT4gc3BsaXRUYXNrTGFiZWxzKGxpbmUsIHBrZy5sYWJlbHMgPz8gW10pKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgeyBuZXcgTm90aWNlKFwiUGFjb3RlIHNlbSB0YXJlZmFzLlwiKTsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMubGF1bmNoaW5nLmhhcyhwa2cuaWQpKSByZXR1cm47ICAgLy8galx1MDBFMSBlc3RcdTAwRTEgbGFuXHUwMEU3YW5kbyBcdTIxOTIgaWdub3JhIGNsaXF1ZS1kdXBsb1xuXG4gICAgLy8gQ29uZmlybWFcdTAwRTdcdTAwRTNvIGNvbmZvcm1lIGEgY29uZmlndXJhXHUwMEU3XHUwMEUzbyAoc2VtcHJlIC8gc1x1MDBGMyBtdWl0YXMgLyBudW5jYSkuXG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtO1xuICAgIGNvbnN0IG5lZWRDb25maXJtID0gbW9kZSA9PT0gXCJhbHdheXNcIiB8fCAobW9kZSA9PT0gXCJtYW55XCIgJiYgaXRlbXMubGVuZ3RoID4gTEFVTkNIX0NPTkZJUk1fTUlOKTtcbiAgICBpZiAobmVlZENvbmZpcm0pIHtcbiAgICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICAgIHRpdGxlOiBgTGFuXHUwMEU3YXIgXHUyMDFDJHtwa2cubmFtZSB8fCBcInBhY290ZVwifVx1MjAxRD9gLFxuICAgICAgICBib2R5OiBgSXNzbyB2YWkgY3JpYXIgJHtpdGVtcy5sZW5ndGh9IHRhcmVmYShzKSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamU6YCxcbiAgICAgICAgaXRlbXM6IGl0ZW1zLm1hcChpdCA9PiAoe1xuICAgICAgICAgIHRleHQ6IChpdC5wcmlvcml0eSA+IDEgPyBgWyR7cHJpTWV0YShpdC5wcmlvcml0eSkubGFiZWx9XSBgIDogXCJcIikgKyBpdC50aXRsZSxcbiAgICAgICAgICBsYWJlbHM6IGl0LmxhYmVscy5tYXAobiA9PiAoeyBuYW1lOiBuLCBjb2xvcjogdGhpcy5sYWJlbENvbG9yKG4pIH0pKSxcbiAgICAgICAgfSkpLFxuICAgICAgICBjdGE6IGBMYW5cdTAwRTdhciAke2l0ZW1zLmxlbmd0aH1gLFxuICAgICAgfSk7XG4gICAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXVuY2hpbmcuYWRkKHBrZy5pZCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpOyAgIC8vIG1vc3RyYSBvIGJvdFx1MDBFM28gY29tbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIlxuICAgIGNvbnN0IGR1ZSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGxldCBvayA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAoY29uc3QgeyB0aXRsZSwgbGFiZWxzLCBwcmlvcml0eSB9IG9mIGl0ZW1zKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7IGNvbnRlbnQ6IHRpdGxlLCBkdWVfZGF0ZTogZHVlIH07XG4gICAgICAgICAgaWYgKHBrZy5wcm9qZWN0SWQpIGZpZWxkcy5wcm9qZWN0X2lkID0gcGtnLnByb2plY3RJZDtcbiAgICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IGxhYmVscztcbiAgICAgICAgICBpZiAocHJpb3JpdHkgPiAxKSBmaWVsZHMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgICBhd2FpdCBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbiwgZmllbGRzKTtcbiAgICAgICAgICBvaysrO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbmV3IE5vdGljZShgRmFsaGEgZW0gXCIke3RpdGxlfVwiOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxhdW5jaGluZy5kZWxldGUocGtnLmlkKTtcbiAgICB9XG4gICAgbmV3IE5vdGljZShgXHUyNzEzICR7b2t9LyR7aXRlbXMubGVuZ3RofSB0YXJlZmEocykgbGFuXHUwMEU3YWRhKHMpIFx1MjAxNCAke3BrZy5uYW1lIHx8IFwicGFjb3RlXCJ9YCk7XG4gICAgYXdhaXQgdGhpcy5mZXRjaCh0cnVlKTsgICAvLyByZS1yZW5kZXJpemEgKGxpbXBhIG8gZXN0YWRvIFwibGFuXHUwMEU3YW5kb1x1MjAyNlwiKVxuICB9XG5cbiAgLy8gQmFycmEgZGUgbGFuXHUwMEU3YWRvcmVzIGRlIHBhY290ZXMuIENvbSBgaGVhZGluZ2AsIG1vbnRhIGEgc2VcdTAwRTdcdTAwRTNvIFwiUEFDT1RFU1wiXG4gIC8vIGNvbXBsZXRhIChhYmEgZG8gVG9kb2lzdCk7IHNlbSBlbGUsIHNcdTAwRjMgYSBiYXJyYSBkZSBib3RcdTAwRjVlcyAoZGFzaGJvYXJkLCBlXG4gIC8vIHNvbWUgcXVhbmRvIG5cdTAwRTNvIGhcdTAwRTEgcGFjb3RlcyBwYXJhIG1hbnRlciBvIHBhaW5lbCBlbnh1dG8pLlxuICByZW5kZXJQYWNrYWdlcyhob3N0OiBIVE1MRWxlbWVudCwgb3B0czogeyBoZWFkaW5nPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCBwa2dzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGxldCB0YXJnZXQgPSBob3N0O1xuICAgIGlmIChvcHRzLmhlYWRpbmcpIHtcbiAgICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJQQUNPVEVTXCIgfSk7XG4gICAgICBpZiAoIXBrZ3MubGVuZ3RoKSB7XG4gICAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDcmllIHBhY290ZXMgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZCBcdTIxOTIgUGFjb3RlcyBkZSB0YXJlZmFzLlwiIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0YXJnZXQgPSBzZWM7XG4gICAgfSBlbHNlIGlmICghcGtncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgY29uc3QgYmFyID0gdGFyZ2V0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctYmFyXCIgfSk7XG4gICAgZm9yIChjb25zdCBwa2cgb2YgcGtncykge1xuICAgICAgY29uc3QgdmFsaWQgPSBwa2cudGFza3MuZmlsdGVyKHMgPT4gcy50cmltKCkpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ1c3kgPSB0aGlzLmxhdW5jaGluZy5oYXMocGtnLmlkKTtcbiAgICAgIGNvbnN0IGRpc2FibGVkID0gIXRva2VuIHx8ICF2YWxpZCB8fCBidXN5O1xuICAgICAgY29uc3QgYnRuID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctYnRuXCIgKyAoZGlzYWJsZWQgPyBcIiB3ZC1wa2ctZGlzYWJsZWRcIiA6IFwiXCIpICsgKGJ1c3kgPyBcIiB3ZC1wa2ctYnVzeVwiIDogXCJcIikgfSk7XG4gICAgICBpZiAocGtnLmljb24pIHJlbmRlckljb24oYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb1wiIH0pLCBwa2cuaWNvbik7XG4gICAgICBidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbmFtZVwiLCB0ZXh0OiBwa2cubmFtZSB8fCBcIihzZW0gbm9tZSlcIiB9KTtcbiAgICAgIGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1jb3VudFwiLCB0ZXh0OiBidXN5ID8gXCJcdTIwMjZcIiA6IFN0cmluZyh2YWxpZCkgfSk7XG4gICAgICBidG4uc2V0QXR0cihcInRpdGxlXCIsXG4gICAgICAgIGJ1c3kgPyBcIkxhblx1MDBFN2FuZG9cdTIwMjZcIiA6XG4gICAgICAgICF0b2tlbiA/IFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdFwiIDpcbiAgICAgICAgIXZhbGlkID8gXCJQYWNvdGUgc2VtIHRhcmVmYXNcIiA6XG4gICAgICAgIGBMYW5cdTAwRTdhciAke3ZhbGlkfSB0YXJlZmEocykgbm8gVG9kb2lzdCAoaG9qZSlgKTtcbiAgICAgIGlmICghZGlzYWJsZWQpIGNsaWNrYWJsZShidG4sICgpID0+IHZvaWQgdGhpcy5sYXVuY2hQYWNrYWdlKHBrZykpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRmlsdGVyQmFyKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIGNvbnN0IGJhciA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYmFyXCIgfSk7XG4gICAgaWYgKHRoaXMucHJvamVjdHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIlByb2pldG9zXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcm9qZWN0cykge1xuICAgICAgICBjb25zdCBvbiA9IGYucHJvamVjdHMuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IHAubmFtZSB9KTtcbiAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICBjbGlja2FibGUoY2hpcCwgYXN5bmMgKCkgPT4geyB0aGlzLnRvZ2dsZUZpbHRlcihcInByb2plY3RzXCIsIHAuaWQpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQodGhpcy50YXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBpZiAobGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsYWJlbHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IHRoaXMubGFiZWxDaGlwKGdycCwgbCwgXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikpO1xuICAgICAgICBjaGlwLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG9uKSk7XG4gICAgICAgIGNsaWNrYWJsZShjaGlwLCBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlRmlsdGVyKFwibGFiZWxzXCIsIGwpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xyID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2xlYXJcIiwgdGV4dDogXCJsaW1wYXIgZmlsdHJvc1wiIH0pO1xuICAgICAgY2xpY2thYmxlKGNsciwgYXN5bmMgKCkgPT4geyBmLnByb2plY3RzID0gW107IGYubGFiZWxzID0gW107IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlbmRlcml6YSBvcyBjb250cm9sZXMgZGUgY2FiZVx1MDBFN2FsaG8gKGVtIGBjdHJsc2ApICsgYSBsaXN0YSBkZSB0YXJlZmFzXG4gIC8vIChlbSBgYm9keWApLiBPIGhvc3QgZm9ybmVjZSBvIHJcdTAwRjN0dWxvIGRhIHNlXHUwMEU3XHUwMEUzbyBlIG8gbGF5b3V0IGRvIGNhYmVcdTAwRTdhbGhvLlxuICByZW5kZXJMaXN0KGJvZHk6IEhUTUxFbGVtZW50LCBjdHJsczogSFRNTEVsZW1lbnQsIG9wdHM6IHsgc2hvd0xhdGVyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICAgIGNvbnN0IHNlZyA9IGN0cmxzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJhbmdlXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgWzMsIDddIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGIgPSBzZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJhbmdlLWJ0blwiICsgKHJhbmdlID09PSBuID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBgJHtufWRgIH0pO1xuICAgICAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCBgTW9zdHJhciBvcyBwclx1MDBGM3hpbW9zICR7bn0gZGlhc2ApO1xuICAgICAgICBiLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHJhbmdlID09PSBuKSk7XG4gICAgICAgIGNsaWNrYWJsZShiLCBhc3luYyBlID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IG47XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICAgIGNvbnN0IG5GID0gZi5wcm9qZWN0cy5sZW5ndGggKyBmLmxhYmVscy5sZW5ndGg7XG4gICAgICBjb25zdCBmaWx0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJ0blwiICsgKHRoaXMuZmlsdGVyT3BlbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSArIChuRiA/IFwiIHdkLWFjdGl2ZVwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKGZpbHQsIFwiZmlsdGVyXCIpO1xuICAgICAgZmlsdC5zZXRBdHRyKFwidGl0bGVcIiwgbkYgPyBgRmlsdHJvcyBhdGl2b3MgKCR7bkZ9KSBcdTIwMTQgY2xpcXVlIHBhcmEgYWp1c3RhcmAgOiBcIkZpbHRyYXIgcG9yIHByb2pldG8vZXRpcXVldGFcIik7XG4gICAgICBpZiAobkYpIGZpbHQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRjdFwiLCB0ZXh0OiBTdHJpbmcobkYpIH0pO1xuICAgICAgZmlsdC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyh0aGlzLmZpbHRlck9wZW4pKTtcbiAgICAgIGNsaWNrYWJsZShmaWx0LCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5maWx0ZXJPcGVuID0gIXRoaXMuZmlsdGVyT3BlbjsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMubG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciB0YXJlZmFzIGRvIFRvZG9pc3RcIik7XG4gICAgICBjbGlja2FibGUocmVmcmVzaCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaCh0cnVlKTsgfSk7XG4gICAgICB0aGlzLmFkZFRhc2tCdG4oY3RybHMsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNvbGUgc2V1IHRva2VuIGRvIFRvZG9pc3QgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZCBwYXJhIHZlciBzdWFzIHRhcmVmYXMgYXF1aS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBdXRvLWZldGNoOiBudW5jYSBidXNjb3UsIG91IG8gY2FjaGUgcGFzc291IGRvIFRUTC4gRXJybyBuXHUwMEUzbyBkaXNwYXJhIHJlLXRlbnRhdGl2YVxuICAgIC8vIGF1dG9tXHUwMEUxdGljYSBhcXVpIChldml0YXJpYSBsb29wIGEgY2FkYSByZW5kZXIpOyBvIGludGVydmFsbyBlIG8gYm90XHUwMEUzbyBcdTIxQkIgY3VpZGFtIGRpc3NvLlxuICAgIGlmICghdGhpcy5sb2FkaW5nICYmICF0aGlzLmVycm9yICYmICghdGhpcy5mZXRjaGVkQXQgfHwgdGhpcy5pc1N0YWxlKCkpKSB2b2lkIHRoaXMuZmV0Y2goZmFsc2UpO1xuICAgIGNvbnN0IGhhc0NhY2hlID0gdGhpcy50YXNrcy5sZW5ndGggPiAwO1xuICAgIC8vIEVycm8vY2FycmVnYW5kbyBzXHUwMEYzIG9jdXBhbSBhIFx1MDBFMXJlYSB0b2RhIHF1YW5kbyBOXHUwMEMzTyBoXHUwMEUxIGNhY2hlIHBhcmEgbW9zdHJhciAob2ZmbGluZS1mcmllbmRseSkuXG4gICAgaWYgKHRoaXMuZXJyb3IgJiYgIWhhc0NhY2hlKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZXJyb3JcIiwgdGV4dDogYEVycm8gYW8gYnVzY2FyIHRhcmVmYXM6ICR7dGhpcy5lcnJvcn1gIH0pOyByZXR1cm47IH1cbiAgICBpZiAoIXRoaXMuZmV0Y2hlZEF0ICYmICFoYXNDYWNoZSkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG8gdGFyZWZhc1x1MjAyNlwiIH0pOyByZXR1cm47IH1cbiAgICB0aGlzLnJlbmRlckZyZXNobmVzcyhib2R5KTtcblxuICAgIGlmICh0aGlzLmZpbHRlck9wZW4pIHRoaXMucmVuZGVyRmlsdGVyQmFyKGJvZHkpO1xuXG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgY29uc3QgdG9kYXlLID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgY29uc3QgbGFzdFVwY29taW5nID0gbmV3IERhdGUoKTtcbiAgICBsYXN0VXBjb21pbmcuc2V0RGF0ZShsYXN0VXBjb21pbmcuZ2V0RGF0ZSgpICsgcmFuZ2UpO1xuICAgIGNvbnN0IGxhc3RLID0gdG9LZXkobGFzdFVwY29taW5nKTtcblxuICAgIGNvbnN0IHRhc2tzID0gdGhpcy5hcHBseUZpbHRlcnModGhpcy50YXNrcyk7XG4gICAgY29uc3Qgb3ZlcmR1ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IHRvZGF5VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgVG9kb2lzdFRhc2tbXT4gPSB7fTtcbiAgICBjb25zdCBsYXRlcjogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IG5vRGF0ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiB0YXNrcykge1xuICAgICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgICBpZiAoIWRrKSB7IG5vRGF0ZS5wdXNoKHQpOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRrIDwgdG9kYXlLKSBvdmVyZHVlLnB1c2godCk7XG4gICAgICBlbHNlIGlmIChkayA9PT0gdG9kYXlLKSB0b2RheVRhc2tzLnB1c2godCk7XG4gICAgICBlbHNlIGlmIChkayA8PSBsYXN0SykgKGJ5RGF5W2RrXSA/Pz0gW10pLnB1c2godCk7XG4gICAgICBlbHNlIGxhdGVyLnB1c2godCk7XG4gICAgfVxuICAgIGNvbnN0IGJ5UHJpID0gKGE6IFRvZG9pc3RUYXNrLCBiOiBUb2RvaXN0VGFzaykgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7XG4gICAgLy8gXCJEZXBvaXNcIjogb3JkZW5hIHBvciBEQVRBIChtYWlzIHByXHUwMEYzeGltYSBwcmltZWlybykgZSwgbm8gbWVzbW8gZGlhLCBwb3IgcHJpb3JpZGFkZS5cbiAgICBjb25zdCBieURhdGVUaGVuUHJpID0gKGE6IFRvZG9pc3RUYXNrLCBiOiBUb2RvaXN0VGFzaykgPT4ge1xuICAgICAgY29uc3QgZGEgPSBkdWVLZXkoYSkgPz8gXCJcIiwgZGIgPSBkdWVLZXkoYikgPz8gXCJcIjtcbiAgICAgIGlmIChkYSAhPT0gZGIpIHJldHVybiBkYSA8IGRiID8gLTEgOiAxO1xuICAgICAgcmV0dXJuIGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIH07XG4gICAgb3ZlcmR1ZS5zb3J0KGJ5UHJpKTsgdG9kYXlUYXNrcy5zb3J0KGJ5UHJpKTsgbGF0ZXIuc29ydChieURhdGVUaGVuUHJpKTsgbm9EYXRlLnNvcnQoYnlQcmkpO1xuICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhieURheSkpIGJ5RGF5W2tdLnNvcnQoYnlQcmkpO1xuXG4gICAgLy8gXCJEZXBvaXNcIiBlIFwiU2VtIGRhdGFcIiBzXHUwMEYzIGFwYXJlY2VtIG5hIGFiYSBkZWRpY2FkYSAoc2hvd0xhdGVyICE9PSBmYWxzZSkuXG4gICAgY29uc3Qgc2hvd0V4dHJhID0gb3B0cy5zaG93TGF0ZXIgIT09IGZhbHNlO1xuICAgIGNvbnN0IHZpc2libGUgPSBvdmVyZHVlLmxlbmd0aCArIHRvZGF5VGFza3MubGVuZ3RoICsgbGF0ZXIubGVuZ3RoXG4gICAgICArIE9iamVjdC52YWx1ZXMoYnlEYXkpLnJlZHVjZSgocywgYSkgPT4gcyArIGEubGVuZ3RoLCAwKVxuICAgICAgKyAoc2hvd0V4dHJhID8gbm9EYXRlLmxlbmd0aCA6IDApO1xuICAgIGlmICh2aXNpYmxlID09PSAwKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgICBjb25zdCBmaWx0ZXJlZCA9ICEhKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCk7XG4gICAgICBjb25zdCBtc2cgPSBmaWx0ZXJlZCA/IFwiTmVuaHVtYSB0YXJlZmEgYmF0ZSBjb20gb3MgZmlsdHJvcy5cIlxuICAgICAgICA6IHNob3dFeHRyYSA/IFwiTmVuaHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gXHVEODNDXHVERjg5XCJcbiAgICAgICAgOiBcIk5lbmh1bWEgdGFyZWZhIGFnZW5kYWRhLiBcdUQ4M0NcdURGODlcIjtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IG1zZyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2xzID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1jb2xzXCIgfSk7XG5cbiAgICBjb25zdCBvYm94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LW92ZXJkdWVcIiB9KTtcbiAgICBjb25zdCBvaGQgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3h3YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkF0cmFzYWRhc1wiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKG92ZXJkdWUubGVuZ3RoKSB9KTtcbiAgICBjb25zdCBvYm9keSA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIG92ZXJkdWUpIHRoaXMudG9kb1JvdyhvYm9keSwgdCk7XG4gICAgZWxzZSBvYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEuIFx1RDgzRFx1REM0RFwiIH0pO1xuXG4gICAgY29uc3QgdGJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC10b2RheVwiIH0pO1xuICAgIGNvbnN0IHRoZCA9IHRib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiSG9qZVwiIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih0aGQsIFwiaG9qZVwiLCBcIk5vdmEgdGFyZWZhIHBhcmEgaG9qZVwiKTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh0b2RheVRhc2tzLmxlbmd0aCkgfSk7XG4gICAgY29uc3QgdGJvZHkgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodG9kYXlUYXNrcy5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiB0b2RheVRhc2tzKSB0aGlzLnRvZG9Sb3codGJvZHksIHQpO1xuICAgIGVsc2UgdGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOYWRhIHBhcmEgaG9qZS5cIiB9KTtcblxuICAgIGxldCB1cGNvbWluZ0NvdW50ID0gMDtcbiAgICBjb25zdCB1cERheXM6IHsgZG93OiBudW1iZXI7IG51bTogbnVtYmVyOyBrZXk6IHN0cmluZzsgaXRlbXM6IFRvZG9pc3RUYXNrW10gfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmFuZ2U7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV07XG4gICAgICBpZiAoIWl0ZW1zPy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgdXBjb21pbmdDb3VudCArPSBpdGVtcy5sZW5ndGg7XG4gICAgICB1cERheXMucHVzaCh7IGRvdzogKGRheS5nZXREYXkoKSArIDYpICUgNywgbnVtOiBkYXkuZ2V0RGF0ZSgpLCBrZXksIGl0ZW1zIH0pO1xuICAgIH1cbiAgICBjb25zdCB1Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXVwY29taW5nXCIgfSk7XG4gICAgY29uc3QgdWhkID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogYFByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhc2AgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHVoZCwgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHVwY29taW5nQ291bnQpIH0pO1xuICAgIGNvbnN0IHVib2R5ID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHVwRGF5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgZyBvZiB1cERheXMpIHtcbiAgICAgICAgY29uc3QgZGggPSB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1kYXloZFwiICsgKGcuZG93ID49IDUgPyBcIiB3ZC13ZWVrZW5kXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2cuZG93XSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW51bVwiLCB0ZXh0OiBTdHJpbmcoZy5udW0pIH0pO1xuICAgICAgICB0aGlzLmFkZFRhc2tCdG4oZGgsIGcua2V5LCBgTm92YSB0YXJlZmEgZW0gJHtnLm51bX1gKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGcuaXRlbXMpIHRoaXMudG9kb1Jvdyh1Ym9keSwgdCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBgTmFkYSBub3MgcHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzLmAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGxhdGVyLmxlbmd0aCAmJiBzaG93RXh0cmEpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1sYXRlclwiIH0pO1xuICAgICAgY29uc3QgbGhkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2hkXCIgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWxhdGVyaWNvXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90aXRsZVwiLCB0ZXh0OiBgRGVwb2lzICgke2xhdGVyLmxlbmd0aH0pYCB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RvZ2dsZVwiLCB0ZXh0OiB0aGlzLmxhdGVyT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5zZXRBdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBTdHJpbmcodGhpcy5sYXRlck9wZW4pKTtcbiAgICAgIGNsaWNrYWJsZShsaGQsICgpID0+IHsgdGhpcy5sYXRlck9wZW4gPSAhdGhpcy5sYXRlck9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICBpZiAodGhpcy5sYXRlck9wZW4pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9saXN0XCIgfSk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBsYXRlcikgdGhpcy50b2RvUm93KGxpc3QsIHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub0RhdGUubGVuZ3RoICYmIHNob3dFeHRyYSkge1xuICAgICAgY29uc3QgcGFuZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyIHdkLXRvZG8tbm9kYXRlXCIgfSk7XG4gICAgICBjb25zdCBuaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIG5oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIG5oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBTZW0gZGF0YSAoJHtub0RhdGUubGVuZ3RofSlgIH0pO1xuICAgICAgbmhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMubm9EYXRlT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIG5oZC5zZXRBdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBTdHJpbmcodGhpcy5ub0RhdGVPcGVuKSk7XG4gICAgICBjbGlja2FibGUobmhkLCAoKSA9PiB7IHRoaXMubm9EYXRlT3BlbiA9ICF0aGlzLm5vRGF0ZU9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICBpZiAodGhpcy5ub0RhdGVPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2Ygbm9EYXRlKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIFVtYSBvY29yclx1MDBFQW5jaWEgY29uY2x1XHUwMEVEZGEgXHUwMEU5IHJlY29ycmVudGU/IChuXHUwMEUzbyBwb2RlIHNlciBhcGFnYWRhIFx1MjAxNCBxdWVicmFyaWEgYSByZWNvcnJcdTAwRUFuY2lhKVxuZnVuY3Rpb24gaXNSZWN1cnJpbmdDb21wbGV0ZWQodDogVG9kb2lzdFRhc2spOiBib29sZWFuIHtcbiAgcmV0dXJuIHQuZHVlPy5pc19yZWN1cnJpbmcgPT09IHRydWU7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM286IGNvbnRyb2xhZG9yIFx1MDBGQW5pY28gKGRvbm8gbm8gcGx1Z2luLCBjb21wYXJ0aWxoYWRvIHZpZXdcdTIxOTRmYWl4YSkgXHUyNTAwXHUyNTAwXG5jbGFzcyBHYW1lQ29udHJvbGxlciB7XG4gIHByaXZhdGUgZXZlbnRzOiBHYW1lRXZlbnRbXSA9IFtdO1xuICBwcml2YXRlIGxvYWRlZCA9IGZhbHNlO1xuICBwcml2YXRlIHJ1bGVzOiBHYW1lUnVsZXMgfCBudWxsID0gbnVsbDsgICAvLyByZWdyYXMgdmluZGFzIGRhIG5vdGEgKG51bGwgPSBwYWRyXHUwMEY1ZXMgZW1idXRpZG9zKVxuICBwcml2YXRlIGJ1c3kgPSBmYWxzZTsgICAgICAgICAgICAgICAgIC8vIGNvbGhlaXRhL21hcmtVbmRvbmUgZW0gYW5kYW1lbnRvXG4gIHByaXZhdGUgcGVuZGluZzogVG9kb2lzdFRhc2tbXSA9IFtdOyAgLy8gY29uY2x1XHUwMEVEZGFzIG5hIEFQSSBhaW5kYSBuXHUwMEUzbyBubyBsb2cgKGxpdmUpXG4gIHByaXZhdGUgcGVuZGluZ1hwID0gMDtcbiAgcHJpdmF0ZSBsYXN0QmFyUGN0ID0gMDsgICAgICAgICAgICAgICAvLyBcdTAwRkFsdGltbyAlIGRhIGJhcnJhIChwLyBhbmltYXIgZG8gdmFsb3IgYW50ZXJpb3IpXG4gIHByaXZhdGUgbGFzdExldmVsID0gMDtcbiAgcHJpdmF0ZSBuZXdBY2ggPSBuZXcgU2V0PHN0cmluZz4oKTsgICAvLyBjb25xdWlzdGFzIHJlY1x1MDBFOW0tZGVzYmxvcXVlYWRhcyAobW9zdHJhIFwibm92byFcIiBhdFx1MDBFOSBhIGFiYSBzZXIgdmlzdGEpXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHt9XG5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7IHRoaXMuc3Vicy5hZGQoY2IpOyByZXR1cm4gKCkgPT4geyB0aGlzLnN1YnMuZGVsZXRlKGNiKTsgfTsgfVxuICByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICBwcml2YXRlIGxvZ0ZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKEdBTUVfTE9HX1BBVEgpO1xuICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZpbGUgPyBmIDogbnVsbDtcbiAgfVxuICBwcml2YXRlIHJ1bGVzUGF0aCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZVJ1bGVzUGF0aDsgfVxuICBpbnZhbGlkYXRlKCkgeyB0aGlzLmxvYWRlZCA9IGZhbHNlOyB9XG4gIGFzeW5jIGVuc3VyZUxvYWRlZCgpIHtcbiAgICBpZiAodGhpcy5sb2FkZWQpIHJldHVybjtcbiAgICBjb25zdCBmID0gdGhpcy5sb2dGaWxlKCk7XG4gICAgdGhpcy5ldmVudHMgPSBmID8gcGFyc2VHYW1lTG9nKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZikpIDogW107XG4gICAgbGV0IGNmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMucnVsZXNQYXRoKCkpO1xuICAgIC8vIE1pZ3JhXHUwMEU3XHUwMEUzbyAxeDogbm90YSBhbnRpZ2Egc1x1MDBGMy1kZS1jb25xdWlzdGFzIFx1MjE5MiBsXHUwMEVBIGNvbW8gUmVncmFzIChtZXNtbyBwYXJzZXIgYWNlaXRhIG8gYXJyYXkgbGVnYWRvKS5cbiAgICBpZiAoIShjZiBpbnN0YW5jZW9mIFRGaWxlKSkgY2YgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoTEVHQUNZX0FDSF9QQVRIKTtcbiAgICB0aGlzLnJ1bGVzID0gY2YgaW5zdGFuY2VvZiBURmlsZSA/IHBhcnNlR2FtZVJ1bGVzKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoY2YpKSA6IG51bGw7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICB9XG4gIC8vIExpc3RhIGVmZXRpdmEgZGUgY29ucXVpc3RhczogYSBkYSBub3RhIGRvIGNvZnJlIChzZSB2XHUwMEUxbGlkYSksIHNlblx1MDBFM28gYSBwYWRyXHUwMEUzbyBlbWJ1dGlkYS5cbiAgYWNoaWV2ZW1lbnRzKCk6IEFjaGlldmVtZW50W10geyByZXR1cm4gdGhpcy5ydWxlcz8uYWNoaWV2ZW1lbnRzID8/IERFRkFVTFRfQUNISUVWRU1FTlRTOyB9XG4gIGlzQ3VzdG9tQWNoaWV2ZW1lbnRzKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLnJ1bGVzICYmIHRoaXMucnVsZXMuYWNoaWV2ZW1lbnRzICE9PSBERUZBVUxUX0FDSElFVkVNRU5UUzsgfVxuICBnb2FscygpOiBHYW1lR29hbFtdIHsgcmV0dXJuIHRoaXMucnVsZXM/LmdvYWxzID8/IERFRkFVTFRfR09BTFM7IH1cbiAgLy8gWFAgZGUgdW1hIHRhcmVmYTogcHJpb3JpZGFkZSArIFx1MDNBMyhiXHUwMEY0bnVzIGRhcyBldGlxdWV0YXMpLiBDbGFtcGEgXHUyMjY1IDAgKGNvbmZpZyBcdTAwRTkgcmVzcG9uc1x1MDBFMXZlbCkuXG4gIHRhc2tYcCh0OiBUb2RvaXN0VGFzayk6IG51bWJlciB7XG4gICAgY29uc3QgeHBQcmkgPSB0aGlzLnJ1bGVzPy54cEJ5UHJpb3JpdHkgPz8gREVGQVVMVF9YUF9CWV9QUkk7XG4gICAgY29uc3QgeHBMYWIgPSB0aGlzLnJ1bGVzPy54cEJ5TGFiZWw7XG4gICAgbGV0IHhwID0geHBQcmlbcHJpS2V5KHQucHJpb3JpdHkpXSA/PyAwO1xuICAgIGlmICh4cExhYikgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB4cCArPSB4cExhYi5nZXQobCkgPz8gMDtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgeHApO1xuICB9XG4gIC8vIFByb2pldG9zL2V0aXF1ZXRhcyBkZWNsYXJhZG9zIG5hcyBSZWdyYXMgKHBhcmEgbyBib3RcdTAwRTNvIFByb3Zpc2lvbmFyIFRvZG9pc3QpLlxuICBwcm92aXNpb25MaXN0cygpOiB7IHByb2plY3RzOiBzdHJpbmdbXTsgbGFiZWxzOiBSdWxlc0xhYmVsW10gfSB7XG4gICAgcmV0dXJuIHsgcHJvamVjdHM6IHRoaXMucnVsZXM/LnByb2plY3RzID8/IFtdLCBsYWJlbHM6IHRoaXMucnVsZXM/LmxhYmVscyA/PyBbXSB9O1xuICB9XG4gIC8vIEFicmUgYSBub3RhIGRlIFJlZ3JhcyAoY3JpYSwgalx1MDBFMSBwcmVlbmNoaWRhIGNvbSBvcyBwYWRyXHUwMEY1ZXMsIHNlIGFpbmRhIG5cdTAwRTNvIGV4aXN0aXIpLlxuICBhc3luYyBvcGVuR2FtZVJ1bGVzKCkge1xuICAgIGNvbnN0IHBhdGggPSB0aGlzLnJ1bGVzUGF0aCgpO1xuICAgIGxldCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgIGNvbnN0IHNsYXNoID0gcGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICBjb25zdCBmb2xkZXIgPSBzbGFzaCA+IDAgPyBwYXRoLnNsaWNlKDAsIHNsYXNoKSA6IFwiXCI7XG4gICAgICBpZiAoZm9sZGVyICYmICF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZm9sZGVyKSkge1xuICAgICAgICB0cnkgeyBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoZm9sZGVyKTsgfSBjYXRjaCB7IC8qIGpcdTAwRTEgZXhpc3RlICovIH1cbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7ICAgLy8gc2VtZWlhIGNvbSBhcyByZWdyYXMgdmlnZW50ZXMgKG1pZ3JhIGEgbm90YSBhbnRpZ2EsIHNlIGhvdXZlcilcbiAgICAgIGYgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUocGF0aCwgYnVpbGRHYW1lUnVsZXNDb250ZW50KHRoaXMucnVsZXMgPz8gZGVmYXVsdFJ1bGVzKCkpKTtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZSgpOyBhd2FpdCB0aGlzLmVuc3VyZUxvYWRlZCgpOyB0aGlzLnJlcmVuZGVyQWxsKCk7ICAgLy8gcGFzc2EgYSBsZXIgZG8gbm92byBjYW1pbmhvXG4gICAgfVxuICAgIGlmIChmIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgfVxuICAvLyBSZWVzY3JldmUgYSBub3RhIGNvbSBhIGRvY3VtZW50YVx1MDBFN1x1MDBFM28gY29tcGxldGEsIG1hbnRlbmRvIGEgY29uZmlndXJhXHUwMEU3XHUwMEUzbyAobyBKU09OKS4gU2Ugblx1MDBFM28gZXhpc3RpciwgY3JpYS5cbiAgYXN5bmMgcmVnZW5lcmF0ZVJ1bGVzRG9jKCkge1xuICAgIGNvbnN0IHBhdGggPSB0aGlzLnJ1bGVzUGF0aCgpO1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgeyBhd2FpdCB0aGlzLm9wZW5HYW1lUnVsZXMoKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgcnVsZXMgPSBwYXJzZUdhbWVSdWxlcyhhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGYpKSA/PyBkZWZhdWx0UnVsZXMoKTtcbiAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgdGl0bGU6IFwiUmVnZW5lcmFyIGRvY3VtZW50YVx1MDBFN1x1MDBFM28/XCIsXG4gICAgICBib2R5OiBcIlJlZXNjcmV2ZSBhIG5vdGEgZGUgUmVncmFzIGNvbSBhIGRvY3VtZW50YVx1MDBFN1x1MDBFM28gY29tcGxldGEsIG1hbnRlbmRvIGEgc3VhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gKG8gSlNPTikuIFRleHRvIGFkaWNpb25hZG8gXHUwMEUwIG1cdTAwRTNvIG5hIG5vdGEgc2VyXHUwMEUxIHBlcmRpZG8uXCIsXG4gICAgICBjdGE6IFwiUmVnZW5lcmFyXCIsXG4gICAgfSk7XG4gICAgaWYgKCFvaykgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBidWlsZEdhbWVSdWxlc0NvbnRlbnQocnVsZXMpKTtcbiAgICB0aGlzLmludmFsaWRhdGUoKTsgYXdhaXQgdGhpcy5lbnN1cmVMb2FkZWQoKTsgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICBuZXcgTm90aWNlKFwiRG9jdW1lbnRhXHUwMEU3XHUwMEUzbyBkYXMgUmVncmFzIGF0dWFsaXphZGEgKGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gcHJlc2VydmFkYSkuXCIpO1xuICB9XG4gIHN0YXRzKCk6IEdhbWVTdGF0cyB7IHJldHVybiBjb21wdXRlR2FtZVN0YXRzKHRoaXMuZXZlbnRzLCB0aGlzLnJ1bGVzID8/IHVuZGVmaW5lZCk7IH1cblxuICBwcml2YXRlIGFzeW5jIHdyaXRlTG9nKCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBidWlsZEdhbWVMb2dDb250ZW50KHRoaXMuZXZlbnRzKTtcbiAgICBjb25zdCBmID0gdGhpcy5sb2dGaWxlKCk7XG4gICAgaWYgKGYpIHsgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGYsIGNvbnRlbnQpOyByZXR1cm47IH1cbiAgICBjb25zdCBzbGFzaCA9IEdBTUVfTE9HX1BBVEgubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGNvbnN0IGZvbGRlciA9IHNsYXNoID4gMCA/IEdBTUVfTE9HX1BBVEguc2xpY2UoMCwgc2xhc2gpIDogXCJcIjtcbiAgICBpZiAoZm9sZGVyICYmICF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZm9sZGVyKSkge1xuICAgICAgdHJ5IHsgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKGZvbGRlcik7IH0gY2F0Y2ggeyAvKiBqXHUwMEUxIGV4aXN0ZSAqLyB9XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShHQU1FX0xPR19QQVRILCBjb250ZW50KTtcbiAgfVxuXG4gIC8vIEFuZXhhIGV2ZW50b3Mgbm92b3MgKGRlZHVwIHBvciBjaGF2ZSkuIERldm9sdmUgcXVhbnRvcyBlbnRyYXJhbS5cbiAgcHJpdmF0ZSBhc3luYyBhcHBlbmRFdmVudHMoZXZzOiBHYW1lRXZlbnRbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgYXdhaXQgdGhpcy5lbnN1cmVMb2FkZWQoKTtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCh0aGlzLmV2ZW50cy5tYXAoZSA9PiBlLmtleSkpO1xuICAgIGNvbnN0IGFkZCA9IGV2cy5maWx0ZXIoZSA9PiAha2V5cy5oYXMoZS5rZXkpKTtcbiAgICBpZiAoIWFkZC5sZW5ndGgpIHJldHVybiAwO1xuICAgIHRoaXMuZXZlbnRzLnB1c2goLi4uYWRkKTtcbiAgICBhd2FpdCB0aGlzLndyaXRlTG9nKCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIHJldHVybiBhZGQubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9qTmFtZSh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnRvZG8ucHJvamVjdE5hbWUodC5wcm9qZWN0X2lkKSB8fCAodC5wcm9qZWN0X2lkID8/IFwiXCIpO1xuICB9XG4gIHByaXZhdGUgZG9uZUV2ZW50KHQ6IFRvZG9pc3RUYXNrKTogR2FtZUV2ZW50IHtcbiAgICBjb25zdCBhdCA9IHQuY29tcGxldGVkX2F0ID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICByZXR1cm4geyBkYXRlOiB0b0tleShuZXcgRGF0ZShhdCkpLCB0eXBlOiBcImZlaXRvXCIsIHhwOiB0aGlzLnRhc2tYcCh0KSxcbiAgICAgIGtleTogYCR7dC5pZH18JHthdH1gLCBjb250ZW50OiB0LmNvbnRlbnQsIHByb2plY3Q6IHRoaXMucHJvak5hbWUodCksIGxhYmVsczogdC5sYWJlbHMgPz8gW10sIHByaTogdC5wcmlvcml0eSB9O1xuICB9XG5cbiAgLy8gSmFuZWxhIGRvIGZldGNoOiBkZXNkZSBhIFx1MDBGQWx0aW1hIGNvbGhlaXRhIChcdTIyMTIyZCBkZSBtYXJnZW0pIG91IGJhY2tmaWxsIG5hIDFcdTAwQUEgdmV6LlxuICBwcml2YXRlIGhhcnZlc3RTaW5jZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxhc3QgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3Q7XG4gICAgaWYgKGxhc3QgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QobGFzdCkpXG4gICAgICByZXR1cm4gdG9LZXkobmV3IERhdGUoRGF0ZS5wYXJzZShsYXN0ICsgXCJUMDA6MDA6MDBcIikgLSAyICogODY0MDAwMDApKTtcbiAgICByZXR1cm4gdG9LZXkobmV3IERhdGUoRGF0ZS5ub3coKSAtIEhBUlZFU1RfQkFDS0ZJTExfREFZUyAqIDg2NDAwMDAwKSk7XG4gIH1cbiAgLy8gYHVudGlsYCA9IEFNQU5IXHUwMEMzIChsb2NhbCkuIGNvbXBsZXRlZF9hdCBkYSBBUEkgXHUwMEU5IFVUQzogXHUwMEUwIG5vaXRlIG5vIEJSVCwgYSBjb25jbHVzXHUwMEUzbyBkZVxuICAvLyBob2plIGpcdTAwRTEgXHUwMEU5IFwiYW1hbmhcdTAwRTNcIiBlbSBVVEMgXHUyMTkyIGNvbSB1bnRpbD1ob2plIGVsYSBjYWlyaWEgZm9yYSBkYSBqYW5lbGEuXG4gIHByaXZhdGUgaGFydmVzdFVudGlsKCk6IHN0cmluZyB7IHJldHVybiB0b0tleShuZXcgRGF0ZShEYXRlLm5vdygpICsgODY0MDAwMDApKTsgfVxuXG4gIC8vIFwiTlx1MDBFM28gZmVpdG9cIjogcHVuaVx1MDBFN1x1MDBFM28gKFx1MjIxMmJhc2VcdTAwRDdmYXRvcikgXHUyMTkyIGxvZyBcdTIxOTIgYXBhZ2EgZG8gVG9kb2lzdC5cbiAgYXN5bmMgbWFya1VuZG9uZSh0OiBUb2RvaXN0VGFzaykge1xuICAgIGlmICh0aGlzLmJ1c3kpIHJldHVybjtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdC5cIik7IHJldHVybjsgfVxuICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMudGFza1hwKHQpICogdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZVBlbmFsdHlGYWN0b3IpKTtcbiAgICBjb25zdCByZWN1cnJpbmcgPSBpc1JlY3VycmluZ0NvbXBsZXRlZCh0KTtcbiAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgdGl0bGU6IFwiTWFyY2FyIGNvbW8gblx1MDBFM28gZmVpdGE/XCIsXG4gICAgICBib2R5OiByZWN1cnJpbmdcbiAgICAgICAgPyBgXCIke3QuY29udGVudH1cIiBcdTAwRTkgcmVjb3JyZW50ZSBcdTIwMTQgdm9jXHUwMEVBIHBlcmRlICR7cGVuYWx0eX0gWFAsIG1hcyBhIHRhcmVmYSBOXHUwMEMzTyBcdTAwRTkgYXBhZ2FkYSAoYXBhZ2FyIHF1ZWJyYXJpYSBhIHJlY29yclx1MDBFQW5jaWEpLmBcbiAgICAgICAgOiBgXCIke3QuY29udGVudH1cIiBcdTIwMTQgdm9jXHUwMEVBIHBlcmRlICR7cGVuYWx0eX0gWFAgZSBhIHRhcmVmYSBcdTAwRTkgYXBhZ2FkYSBkbyBUb2RvaXN0IChpcnJldmVyc1x1MDBFRHZlbCkuYCxcbiAgICAgIGN0YTogYE5cdTAwRTNvIGZlaXRhIChcdTIyMTIke3BlbmFsdHl9IFhQKWAsXG4gICAgfSk7XG4gICAgaWYgKCFvaykgcmV0dXJuO1xuICAgIHRoaXMuYnVzeSA9IHRydWU7IHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5hcHBlbmRFdmVudHMoW3sgZGF0ZTogdG9LZXkobmV3IERhdGUoKSksIHR5cGU6IFwibmFvLWZlaXRvXCIsIHhwOiAtcGVuYWx0eSxcbiAgICAgICAga2V5OiBgJHt0LmlkfXwke0RhdGUubm93KCl9YCwgY29udGVudDogdC5jb250ZW50LCBwcm9qZWN0OiB0aGlzLnByb2pOYW1lKHQpLCBsYWJlbHM6IHQubGFiZWxzID8/IFtdLCBwcmk6IHQucHJpb3JpdHkgfV0pO1xuICAgICAgaWYgKCFyZWN1cnJpbmcpIGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxNyBOXHUwMEUzbyBmZWl0YTogJHt0LmNvbnRlbnR9IChcdTIyMTIke3BlbmFsdHl9IFhQKWApO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udG9kby5mZXRjaCh0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYTogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuYnVzeSA9IGZhbHNlOyB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29saGUgY29uY2x1XHUwMEVEZGFzIFx1MjE5MiBsb2c7IGFwYWdhIGRvIFRvZG9pc3Qgc1x1MDBGMyBhcyBOXHUwMEMzTy1yZWNvcnJlbnRlcy5cbiAgYXN5bmMgaGFydmVzdCgpIHtcbiAgICBpZiAodGhpcy5idXN5KSByZXR1cm47XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIpOyByZXR1cm47IH1cbiAgICB0aGlzLmJ1c3kgPSB0cnVlOyB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7XG4gICAgICBjb25zdCB0b2RheSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgICAgY29uc3QgY29tcGxldGVkID0gYXdhaXQgZmV0Y2hDb21wbGV0ZWRUYXNrcyh0b2tlbiwgdGhpcy5oYXJ2ZXN0U2luY2UoKSwgdGhpcy5oYXJ2ZXN0VW50aWwoKSk7XG4gICAgICBjb25zdCBrZXlzID0gbmV3IFNldCh0aGlzLmV2ZW50cy5tYXAoZSA9PiBlLmtleSkpO1xuICAgICAgY29uc3QgZnJlc2ggPSBjb21wbGV0ZWQuZmlsdGVyKHQgPT4gIWtleXMuaGFzKGAke3QuaWR9fCR7dC5jb21wbGV0ZWRfYXQgPz8gXCJcIn1gKSk7XG4gICAgICBpZiAoIWZyZXNoLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPSB0b2RheTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIHRoaXMucGVuZGluZyA9IFtdOyB0aGlzLnBlbmRpbmdYcCA9IDA7XG4gICAgICAgIG5ldyBOb3RpY2UoXCJOYWRhIG5vdm8gcGFyYSBzYWx2YXIuIFx1RDgzRFx1REM0RFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZGVsZXRhYmxlID0gZnJlc2guZmlsdGVyKHQgPT4gIWlzUmVjdXJyaW5nQ29tcGxldGVkKHQpKTtcbiAgICAgIGNvbnN0IHJlY3VycmluZyA9IGZyZXNoLmxlbmd0aCAtIGRlbGV0YWJsZS5sZW5ndGg7XG4gICAgICBjb25zdCB0b3RhbFhwID0gZnJlc2gucmVkdWNlKChzLCB0KSA9PiBzICsgdGhpcy50YXNrWHAodCksIDApO1xuICAgICAgY29uc3Qgb2sgPSBhd2FpdCBjb25maXJtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgICAgdGl0bGU6IGBTYWx2YXIgJHtmcmVzaC5sZW5ndGh9IHRhcmVmYShzKSBjb25jbHVcdTAwRURkYShzKT9gLFxuICAgICAgICBib2R5OiBgKyR7dG90YWxYcH0gWFAgbm8gbG9nLiAke2RlbGV0YWJsZS5sZW5ndGh9IGFwYWdhZGEocykgZG8gVG9kb2lzdGAgK1xuICAgICAgICAgIChyZWN1cnJpbmcgPyBgIFx1MDBCNyAke3JlY3VycmluZ30gcmVjb3JyZW50ZShzKSBmaWNhbSAoYXBhZ2FyIHF1ZWJyYXJpYSBhIHJlY29yclx1MDBFQW5jaWEpLmAgOiBcIi5cIiksXG4gICAgICAgIGl0ZW1zOiBmcmVzaC5zbGljZSgwLCAzMCkubWFwKHQgPT4gKHsgdGV4dDogYCske3RoaXMudGFza1hwKHQpfSBcdTAwQjcgJHt0LmNvbnRlbnR9YCB9KSksXG4gICAgICAgIGN0YTogYFNhbHZhciBlIGFwYWdhciAke2RlbGV0YWJsZS5sZW5ndGh9YCxcbiAgICAgIH0pO1xuICAgICAgaWYgKCFvaykgcmV0dXJuO1xuICAgICAgYXdhaXQgdGhpcy5hcHBlbmRFdmVudHMoZnJlc2gubWFwKHQgPT4gdGhpcy5kb25lRXZlbnQodCkpKTtcbiAgICAgIGxldCBkZWwgPSAwO1xuICAgICAgZm9yIChjb25zdCB0IG9mIGRlbGV0YWJsZSkge1xuICAgICAgICB0cnkgeyBhd2FpdCBkZWxldGVUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7IGRlbCsrOyB9IGNhdGNoIHsgLyogc2VndWUgKi8gfVxuICAgICAgfVxuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZUxhc3RIYXJ2ZXN0ID0gdG9kYXk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgdGhpcy5wZW5kaW5nID0gW107IHRoaXMucGVuZGluZ1hwID0gMDtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyAke2ZyZXNoLmxlbmd0aH0gc2FsdmEocykgKCske3RvdGFsWHB9IFhQKSBcdTAwQjcgJHtkZWx9IGFwYWdhZGEocylgKTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnRvZG8uZmV0Y2godHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7IHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb250YSBxdWFudGFzIGNvbmNsdVx1MDBFRGRhcyBlc3RcdTAwRTNvIHBlbmRlbnRlcyBkZSBzYWx2YXIgKGxpdmUsIHNlbSBhcGFnYXIgbmFkYSkuXG4gIGFzeW5jIHJlZnJlc2hQZW5kaW5nKCkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7XG4gICAgICBjb25zdCBjb21wbGV0ZWQgPSBhd2FpdCBmZXRjaENvbXBsZXRlZFRhc2tzKHRva2VuLCB0aGlzLmhhcnZlc3RTaW5jZSgpLCB0aGlzLmhhcnZlc3RVbnRpbCgpKTtcbiAgICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KHRoaXMuZXZlbnRzLm1hcChlID0+IGUua2V5KSk7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBjb21wbGV0ZWQuZmlsdGVyKHQgPT4gIWtleXMuaGFzKGAke3QuaWR9fCR7dC5jb21wbGV0ZWRfYXQgPz8gXCJcIn1gKSk7XG4gICAgICB0aGlzLnBlbmRpbmdYcCA9IHRoaXMucGVuZGluZy5yZWR1Y2UoKHMsIHQpID0+IHMgKyB0aGlzLnRhc2tYcCh0KSwgMCk7XG4gICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfSBjYXRjaCB7IC8qIHNpbGVuY2lvc28gKi8gfVxuICB9XG5cbiAgLy8gUGFpbmVsIGNvbXBhcnRpbGhhZG86IGRhc2hib2FyZCAoZmFpeGEsIGN0cmxzIHNlbSBjb2xoZWl0YSkgZSBhYmEgKGZ1bGwpLlxuICByZW5kZXJQYW5lbChob3N0OiBIVE1MRWxlbWVudCwgY3RybHM6IEhUTUxFbGVtZW50IHwgbnVsbCwgb3B0czogeyBmdWxsPzogYm9vbGVhbjsgcGhvbmU/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHMgPSB0aGlzLnN0YXRzKCk7XG4gICAgdGhpcy5zeW5jQWNoaWV2ZW1lbnRzKHMpOyAgIC8vIGRldGVjdGEvcGVyc2lzdGUgZGVzYmxvcXVlaW9zIG1lc21vIHNcdTAwRjMgY29tIGEgZmFpeGEgZG8gZGFzaGJvYXJkIGFiZXJ0YVxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAob3B0cy5mdWxsICYmIGN0cmxzICYmIHRva2VuKSB7XG4gICAgICBjb25zdCBzYXZlID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWhhcnZlc3RcIiArICh0aGlzLmJ1c3kgPyBcIiB3ZC1nYW1lLWJ1c3lcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihzYXZlLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1oYXJ2ZXN0LWljb1wiIH0pLCBcImRvd25sb2FkXCIpO1xuICAgICAgc2F2ZS5jcmVhdGVTcGFuKHsgdGV4dDogdGhpcy5idXN5ID8gXCJTYWx2YW5kb1x1MjAyNlwiIDogXCJTYWx2YXIgY29uY2x1XHUwMEVEZGFzXCIgfSk7XG4gICAgICBpZiAodGhpcy5wZW5kaW5nLmxlbmd0aCkgc2F2ZS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtcGVuZFwiLCB0ZXh0OiBgKyR7dGhpcy5wZW5kaW5nWHB9YCB9KTtcbiAgICAgIHNhdmUuc2V0QXR0cihcInRpdGxlXCIsIHRoaXMucGVuZGluZy5sZW5ndGhcbiAgICAgICAgPyBgJHt0aGlzLnBlbmRpbmcubGVuZ3RofSBjb25jbHVcdTAwRURkYShzKSBhZ3VhcmRhbmRvIHNhbHZhciAoKyR7dGhpcy5wZW5kaW5nWHB9IFhQKWBcbiAgICAgICAgOiBcIkJ1c2NhciB0YXJlZmFzIGNvbmNsdVx1MDBFRGRhcywgc2FsdmFyIG5vIGxvZyBlIGxpbXBhciBkbyBUb2RvaXN0XCIpO1xuICAgICAgaWYgKCF0aGlzLmJ1c3kpIGNsaWNrYWJsZShzYXZlLCAoKSA9PiB2b2lkIHRoaXMuaGFydmVzdCgpKTtcbiAgICB9XG5cbiAgICBjb25zdCBsdmwgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWxldmVsXCIgfSk7XG4gICAgbHZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1sdmxudW1cIiwgdGV4dDogYE5cdTAwRUR2ZWwgJHtzLmxldmVsfWAgfSk7XG4gICAgbHZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS14cFwiLCB0ZXh0OiBgJHtzLnRvdGFsWHB9IFhQYCB9KTtcbiAgICBjb25zdCBiYXIgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWJhclwiIH0pO1xuICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYmFyLWZpbGxcIiB9KTtcbiAgICBjb25zdCBwY3QgPSBzLnhwRm9yTmV4dCA/IE1hdGgubWluKDEwMCwgTWF0aC5yb3VuZChzLnhwSW50b0xldmVsIC8gcy54cEZvck5leHQgKiAxMDApKSA6IDA7XG4gICAgLy8gQW5pbWEgZG8gXHUwMEZBbHRpbW8gJSBleGliaWRvIGF0XHUwMEU5IG8gbm92bzsgZW0gbGV2ZWwtdXAsIGVuY2hlIGRvIHplcm8uXG4gICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke3MubGV2ZWwgPiB0aGlzLmxhc3RMZXZlbCA/IDAgOiB0aGlzLmxhc3RCYXJQY3R9JWA7XG4gICAgdm9pZCBmaWxsLm9mZnNldFdpZHRoOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWZsb3cgXHUyMTkyIGEgdHJhbnNpXHUwMEU3XHUwMEUzbyBDU1MgcGFydGUgZG8gdmFsb3IgYW50ZXJpb3JcbiAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cGN0fSVgO1xuICAgIHRoaXMubGFzdEJhclBjdCA9IHBjdDsgdGhpcy5sYXN0TGV2ZWwgPSBzLmxldmVsO1xuICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cy54cEludG9MZXZlbH0vJHtzLnhwRm9yTmV4dH0gWFAgcGFyYSBvIG5cdTAwRUR2ZWwgJHtzLmxldmVsICsgMX1gKTtcbiAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW5leHRcIixcbiAgICAgIHRleHQ6IGBmYWx0YW0gJHtNYXRoLm1heCgwLCBzLnhwRm9yTmV4dCAtIHMueHBJbnRvTGV2ZWwpfSBYUCBwYXJhIG8gblx1MDBFRHZlbCAke3MubGV2ZWwgKyAxfWAgfSk7XG5cbiAgICBjb25zdCBncmlkID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1tZXRyaWNzXCIgfSk7XG4gICAgY29uc3QgbWV0cmljID0gKGljb246IHN0cmluZywgdmFsOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcsIGNscyA9IFwiXCIpID0+IHtcbiAgICAgIGNvbnN0IGMgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpYyBcIiArIGNscyB9KTtcbiAgICAgIGNvbnN0IHYgPSBjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLW1ldHJpYy12YWxcIiB9KTtcbiAgICAgIHNldEljb24odi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLWljb1wiIH0pLCBpY29uKTtcbiAgICAgIHYuY3JlYXRlU3Bhbih7IHRleHQ6IHZhbCB9KTtcbiAgICAgIGMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtbWV0cmljLWxibFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgICB9O1xuICAgIG1ldHJpYyhcImZsYW1lXCIsIFN0cmluZyhzLnN0cmVha0N1cnJlbnQpLCBgc3RyZWFrIFx1MDBCNyByZWNvcmRlICR7cy5zdHJlYWtCZXN0fWAsIHMuc3RyZWFrQ3VycmVudCA/IFwid2QtZ2FtZS1zdHJlYWstb25cIiA6IFwiXCIpO1xuICAgIG1ldHJpYyhcInphcFwiLCBgJHtzLnRvZGF5WHAgPj0gMCA/IFwiK1wiIDogXCJcIn0ke3MudG9kYXlYcH1gLCBgWFAgaG9qZSBcdTAwQjcgJHtzLnRvZGF5Q291bnR9IGZlaXRhKHMpYCk7XG5cbiAgICBpZiAob3B0cy5mdWxsICYmIHRoaXMucGVuZGluZy5sZW5ndGgpXG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWhpbnRcIiwgdGV4dDpcbiAgICAgICAgYCR7dGhpcy5wZW5kaW5nLmxlbmd0aH0gY29uY2x1XHUwMEVEZGEocykgYWd1YXJkYW5kbyBzYWx2YXIgKCske3RoaXMucGVuZGluZ1hwfSBYUCkgXHUyMDE0IGNsaXF1ZSBlbSBcIlNhbHZhciBjb25jbHVcdTAwRURkYXNcIi5gIH0pO1xuXG4gICAgaWYgKG9wdHMuZnVsbCkgdGhpcy5yZW5kZXJHb2Fscyhob3N0KTtcbiAgICBpZiAob3B0cy5mdWxsKSB0aGlzLnJlbmRlclhwQ2hhcnQoaG9zdCwgcywgISFvcHRzLnBob25lKTtcbiAgICBpZiAob3B0cy5mdWxsKSB0aGlzLnJlbmRlclhwRm9ybXVsYShob3N0KTtcbiAgICBpZiAob3B0cy5mdWxsKSB0aGlzLnJlbmRlclNjb3Blcyhob3N0LCBzKTtcbiAgICBpZiAob3B0cy5mdWxsKSB0aGlzLnJlbmRlckFjaGlldmVtZW50cyhob3N0LCBzKTtcbiAgfVxuXG4gIC8vIE1ldGFzIChzXHUwMEYzIG5hIGFiYSk6IGFsdm8gZG8gcGVyXHUwMEVEb2RvIGF0dWFsLCBjb20gYmFycmEgZGUgcHJvZ3Jlc3NvLiBFZGl0XHUwMEUxdmVpcyBuYSBub3RhIGRlIFJlZ3Jhcy5cbiAgcHJpdmF0ZSByZW5kZXJHb2Fscyhob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGdvYWxzID0gdGhpcy5nb2FscygpO1xuICAgIGlmICghZ29hbHMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBzZWMgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWdvYWxzZWNcIiB9KTtcbiAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtY2hhcnQtdGl0bGVcIiwgdGV4dDogXCJNZXRhc1wiIH0pO1xuICAgIGZvciAoY29uc3QgZyBvZiBnb2Fscykge1xuICAgICAgY29uc3Qgc3QgPSBnb2FsUHJvZ3Jlc3ModGhpcy5ldmVudHMsIGcsIG5vdyk7XG4gICAgICBjb25zdCBpdGVtID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWdvYWxcIiArIChzdC5kb25lID8gXCIgd2QtZ2FtZS1nb2FsLWRvbmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgaGVhZCA9IGl0ZW0uY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtaGVhZFwiIH0pO1xuICAgICAgY29uc3QgbGVmdCA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtbGVmdFwiIH0pO1xuICAgICAgbGVmdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtbmFtZVwiLCB0ZXh0OiBnLnRpdGxlIH0pO1xuICAgICAgY29uc3Qgc2NvcGUgPSBnLnByb2plY3QgPyBnLnByb2plY3QgOiBnLmxhYmVsID8gXCJAXCIgKyBnLmxhYmVsIDogXCJcIjtcbiAgICAgIGxlZnQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWdvYWwtc3ViXCIsIHRleHQ6IEdPQUxfUEVSSU9EX0xBQkVMU1tnLnBlcmlvZF0gKyAoc2NvcGUgPyBcIiBcdTAwQjcgXCIgKyBzY29wZSA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgdW5pdCA9IGcubWV0cmljID09PSBcInhwXCIgPyBcIlhQXCIgOiBcImZlaXRhc1wiO1xuICAgICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtbWV0YVwiLCB0ZXh0OiBgJHtzdC5jdXJyZW50fS8ke2cudGFyZ2V0fSAke3VuaXR9YCArIChzdC5kb25lID8gXCIgXHUyNzEzXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNvbnN0IGJhciA9IGl0ZW0uY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYmFyIHdkLWdhbWUtYmFyLW1pbmlcIiB9KTtcbiAgICAgIGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1iYXItZmlsbFwiIH0pLnN0eWxlLndpZHRoID0gYCR7c3QucGN0fSVgO1xuICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBzdC5kb25lID8gXCJNZXRhIGNvbmNsdVx1MDBFRGRhIVwiIDogYCR7c3QuY3VycmVudH0vJHtnLnRhcmdldH0gJHt1bml0fSAke0dPQUxfUEVSSU9EX0xBQkVMU1tnLnBlcmlvZF19YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTWFyY2EgY29ucXVpc3RhcyByZWNcdTAwRTltLWRlc2Jsb3F1ZWFkYXM6IGdyYXZhIGEgZGF0YSAocGVybWFuZW50ZSkgZSBzaW5hbGl6YSBcIm5vdm8hXCIuXG4gIHByaXZhdGUgc3luY0FjaGlldmVtZW50cyhzOiBHYW1lU3RhdHMpIHtcbiAgICBjb25zdCBzYXZlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVBY2hpZXZlbWVudHM7XG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgdGhpcy5hY2hpZXZlbWVudHMoKSkge1xuICAgICAgaWYgKCFzYXZlZFthLmlkXSAmJiBtZXRyaWNWYWx1ZShhLm1ldHJpYywgcykgPj0gYS5nb2FsKSB7XG4gICAgICAgIHNhdmVkW2EuaWRdID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgICAgIHRoaXMubmV3QWNoLmFkZChhLmlkKTtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFuZ2VkKSB2b2lkIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLy8gQ29ucXVpc3RhcyAoc1x1MDBGMyBuYSBhYmEpOiBncmlkIGRlIGJhZGdlcyBcdTIwMTQgZGVzYmxvcXVlYWRhcyBjb2xvcmlkYXMgKyBkYXRhOyBibG9xdWVhZGFzXG4gIC8vIGVtIGNpbnphIGNvbSBhIGNvbmRpXHUwMEU3XHUwMEUzbyBlIG8gcHJvZ3Jlc3NvIChkZWNpc1x1MDBFM28gZG8gV2VydXM6IG1vc3RyYXIgYmxvcXVlYWRhcykuXG4gIHByaXZhdGUgcmVuZGVyQWNoaWV2ZW1lbnRzKGhvc3Q6IEhUTUxFbGVtZW50LCBzOiBHYW1lU3RhdHMpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5hY2hpZXZlbWVudHMoKTtcbiAgICBjb25zdCBzdGF0ZXMgPSBsaXN0Lm1hcChhID0+IGV2YWxBY2hpZXZlbWVudChhLCBzKSk7XG4gICAgY29uc3QgdW5sb2NrZWQgPSBzdGF0ZXMuZmlsdGVyKHggPT4geC51bmxvY2tlZCkubGVuZ3RoO1xuICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYWNoc2VjXCIgfSk7XG4gICAgY29uc3QgaGQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtY2hhcnRoZFwiIH0pO1xuICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWNoYXJ0LXRpdGxlXCIsIHRleHQ6IFwiQ29ucXVpc3Rhc1wiIH0pO1xuICAgIGNvbnN0IHJpZ2h0ID0gaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYWNoLWhkLXJpZ2h0XCIgfSk7XG4gICAgcmlnaHQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWFjaC1jb3VudFwiICsgKHRoaXMuaXNDdXN0b21BY2hpZXZlbWVudHMoKSA/IFwiIHdkLWdhbWUtYWNoLWN1c3RvbVwiIDogXCJcIiksXG4gICAgICB0ZXh0OiBgJHt1bmxvY2tlZH0vJHtsaXN0Lmxlbmd0aH1gIH0pO1xuICAgIGNvbnN0IGVkaXQgPSByaWdodC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuIHdkLWdhbWUtYWNoLWVkaXRcIiB9KTtcbiAgICBzZXRJY29uKGVkaXQsIFwicGVuY2lsXCIpO1xuICAgIGVkaXQuc2V0QXR0cihcInRpdGxlXCIsIFwiRWRpdGFyIHJlZ3JhcyBcdTIwMTQgYWJyZSBhIG5vdGEgY29tIG8gYmxvY28gSlNPTiAocHJvamV0b3MsIGV0aXF1ZXRhcywgWFAsIG5cdTAwRUR2ZWlzLCBjb25xdWlzdGFzKVwiXG4gICAgICArICh0aGlzLmlzQ3VzdG9tQWNoaWV2ZW1lbnRzKCkgPyBcIiAobGlzdGEgcGVyc29uYWxpemFkYSBhdGl2YSlcIiA6IFwiXCIpKTtcbiAgICBjbGlja2FibGUoZWRpdCwgKCkgPT4gdm9pZCB0aGlzLm9wZW5HYW1lUnVsZXMoKSk7XG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1hY2gtZ3JpZFwiIH0pO1xuICAgIGZvciAoY29uc3Qgc3Qgb2Ygc3RhdGVzKSB7XG4gICAgICBjb25zdCBkYXRlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtZUFjaGlldmVtZW50c1tzdC5hLmlkXTtcbiAgICAgIGNvbnN0IGlzTmV3ID0gdGhpcy5uZXdBY2guaGFzKHN0LmEuaWQpO1xuICAgICAgY29uc3QgY2VsbCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYWNoXCJcbiAgICAgICAgKyAoc3QudW5sb2NrZWQgPyBcIiB3ZC1nYW1lLWFjaC1vblwiIDogXCJcIikgKyAoaXNOZXcgPyBcIiB3ZC1nYW1lLWFjaC1uZXdcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihjZWxsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWFjaC1pY29cIiB9KSwgc3QuYS5pY29uKTtcbiAgICAgIGNlbGwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYWNoLXRpdGxlXCIsIHRleHQ6IHN0LmEudGl0bGUgfSk7XG4gICAgICBpZiAoc3QudW5sb2NrZWQpIHtcbiAgICAgICAgY2VsbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1hY2gtc3ViXCIsIHRleHQ6IGRhdGUgPyBgXHUyNzEzICR7ZGF0ZX1gIDogXCJcdTI3MTNcIiB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNlbGwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYWNoLXN1YlwiLCB0ZXh0OiBgJHtNYXRoLm1pbihzdC52YWx1ZSwgc3QuYS5nb2FsKX0vJHtzdC5hLmdvYWx9YCB9KTtcbiAgICAgICAgY29uc3QgYmFyID0gY2VsbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1iYXIgd2QtZ2FtZS1iYXItbWluaVwiIH0pO1xuICAgICAgICBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYmFyLWZpbGxcIiB9KS5zdHlsZS53aWR0aCA9IGAke3N0LnBjdH0lYDtcbiAgICAgIH1cbiAgICAgIGNlbGwuc2V0QXR0cihcInRpdGxlXCIsIGAke3N0LmEuZGVzY31gICsgKHN0LnVubG9ja2VkXG4gICAgICAgID8gKGRhdGUgPyBgIFx1MDBCNyBkZXNibG9xdWVhZGEgZW0gJHtkYXRlfWAgOiBcIiBcdTAwQjcgZGVzYmxvcXVlYWRhXCIpXG4gICAgICAgIDogYCBcdTAwQjcgJHtNYXRoLm1pbihzdC52YWx1ZSwgc3QuYS5nb2FsKX0vJHtzdC5hLmdvYWx9YCkpO1xuICAgICAgaWYgKGlzTmV3KSBjZWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1hY2gtbmV3YmFkZ2VcIiwgdGV4dDogXCJub3ZvIVwiIH0pO1xuICAgIH1cbiAgICB0aGlzLm5ld0FjaC5jbGVhcigpOyAgIC8vIFwibm92byFcIiBhcGFyZWNlIHVtYSB2ZXogcG9yIHZpc3VhbGl6YVx1MDBFN1x1MDBFM28gZGEgYWJhXG4gIH1cblxuICAvLyBGXHUwMEYzcm11bGEgdmlzdWFsIGRvIFhQIHBvciB0YXJlZmEgKGVzdGlsbyBOb3Rpb24pOiBwcmlvcmlkYWRlICsgXHUwM0EzKGV0aXF1ZXRhcyksIGNvbSBvcyB2YWxvcmVzIHZpZ2VudGVzLlxuICBwcml2YXRlIHJlbmRlclhwRm9ybXVsYShob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHByaSA9IHRoaXMucnVsZXM/LnhwQnlQcmlvcml0eSA/PyBERUZBVUxUX1hQX0JZX1BSSTtcbiAgICBjb25zdCBsYWJzID0gWy4uLih0aGlzLnJ1bGVzPy54cEJ5TGFiZWwgPz8gbmV3IE1hcCgpKV0uZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gMCk7XG4gICAgY29uc3Qgc2VjID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1mb3JtdWxhXCIgfSk7XG4gICAgc2VjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ2FtZS1mb3JtdWxhLWVxXCIsIHRleHQ6IFwiWFAgcG9yIHRhcmVmYSA9IHByaW9yaWRhZGUgKyBcdTAzQTMgZXRpcXVldGFzXCIgfSk7XG4gICAgY29uc3QgcGFydHMgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtZm9ybXVsYS1wYXJ0c1wiIH0pO1xuICAgIGNvbnN0IGNoaXAgPSAodGV4dDogc3RyaW5nKSA9PiBwYXJ0cy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtZm9ybXVsYS1jaGlwXCIsIHRleHQgfSk7XG4gICAgY2hpcChgcDEgJHtwcmkucDF9YCk7IGNoaXAoYHAyICR7cHJpLnAyfWApOyBjaGlwKGBwMyAke3ByaS5wM31gKTsgY2hpcChgcDQgJHtwcmkucDR9YCk7XG4gICAgZm9yIChjb25zdCBbbmFtZSwgdl0gb2YgbGFicykgY2hpcChgQCR7bmFtZX0gJHt2ID49IDAgPyBcIitcIiA6IFwiXCJ9JHt2fWApO1xuICB9XG5cbiAgLy8gRXNjb3BvcyAocHJvamV0b3MvZXRpcXVldGFzKTogbGlzdGEgXHUwMEZBbmljYSBjb20gc2Vsb3MgZGUgb3JpZ2VtIChDb2ZyZS9Ub2RvaXN0L0hpc3QpICsgblx1MDBFRHZlbCxcbiAgLy8gZSBib3RcdTAwRTNvIGRlIGFcdTAwRTdcdTAwRTNvIG5hIGRpdmVyZ1x1MDBFQW5jaWEgKGFwYWdhciBoaXN0XHUwMEYzcmljbyBcdTAwRjNyZlx1MDBFM28gLyBhZGljaW9uYXIgYW8gY29mcmUgLyBhZGljaW9uYXIgYW8gVG9kb2lzdCkuXG4gIHByaXZhdGUgcmVuZGVyU2NvcGVzKGhvc3Q6IEhUTUxFbGVtZW50LCBzOiBHYW1lU3RhdHMpIHtcbiAgICB0aGlzLnJlbmRlclNjb3BlU2VjdGlvbihob3N0LCBcIlByb2pldG9zXCIsIFwicHJvamVjdFwiLCBzLmJ5UHJvamVjdCwgcy5ieVByb2plY3RJbmZvLFxuICAgICAgbmV3IFNldCh0aGlzLnJ1bGVzPy5wcm9qZWN0cyA/PyBbXSksIHRoaXMucGx1Z2luLnRvZG8ua25vd25Qcm9qZWN0cygpLCBcIlwiKTtcbiAgICB0aGlzLnJlbmRlclNjb3BlU2VjdGlvbihob3N0LCBcIkV0aXF1ZXRhc1wiLCBcImxhYmVsXCIsIHMuYnlMYWJlbCwgcy5ieUxhYmVsSW5mbyxcbiAgICAgIG5ldyBTZXQoKHRoaXMucnVsZXM/LmxhYmVscyA/PyBbXSkubWFwKGwgPT4gbC5uYW1lKSksIHRoaXMucGx1Z2luLnRvZG8ua25vd25MYWJlbHMoKSwgXCJAXCIpO1xuICB9XG4gIHByaXZhdGUgcmVuZGVyU2NvcGVTZWN0aW9uKGhvc3Q6IEhUTUxFbGVtZW50LCB0aXRsZTogc3RyaW5nLCBraW5kOiBcInByb2plY3RcIiB8IFwibGFiZWxcIixcbiAgICB4cE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiwgaW5mb01hcDogTWFwPHN0cmluZywgTGV2ZWxJbmZvPixcbiAgICByZWdpc3RlcmVkOiBTZXQ8c3RyaW5nPiwga25vd246IFNldDxzdHJpbmc+LCBwcmVmaXg6IHN0cmluZykge1xuICAgIGNvbnN0IHRvZG9SZWFkeSA9IHRoaXMucGx1Z2luLnRvZG8uaGFzRGF0YSgpO1xuICAgIGNvbnN0IG5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBuIG9mIHJlZ2lzdGVyZWQpIG5hbWVzLmFkZChuKTtcbiAgICBpZiAodG9kb1JlYWR5KSBmb3IgKGNvbnN0IG4gb2Yga25vd24pIG5hbWVzLmFkZChuKTtcbiAgICBmb3IgKGNvbnN0IG4gb2YgeHBNYXAua2V5cygpKSBpZiAobiAhPT0gXCJcdTIwMTRcIikgbmFtZXMuYWRkKG4pO1xuICAgIGlmICghbmFtZXMuc2l6ZSkgcmV0dXJuO1xuICAgIGNvbnN0IHJvd3MgPSBbLi4ubmFtZXNdLm1hcChuYW1lID0+ICh7XG4gICAgICBuYW1lLCB4cDogeHBNYXAuZ2V0KG5hbWUpID8/IDAsIGluZm86IGluZm9NYXAuZ2V0KG5hbWUpLFxuICAgICAgaW5Db2ZyZTogcmVnaXN0ZXJlZC5oYXMobmFtZSksXG4gICAgICBpblRvZG86IHRvZG9SZWFkeSA/IGtub3duLmhhcyhuYW1lKSA6IG51bGwgYXMgYm9vbGVhbiB8IG51bGwsXG4gICAgICBpbkhpc3Q6IHhwTWFwLmhhcyhuYW1lKSxcbiAgICB9KSkuc29ydCgoYSwgYikgPT4gKGIueHAgLSBhLnhwKSB8fCBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKTtcbiAgICBjb25zdCBzZWMgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3Blc2VjXCIgfSk7XG4gICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWNoYXJ0LXRpdGxlXCIsIHRleHQ6IHRpdGxlIH0pO1xuICAgIGNvbnN0IG5vdW4gPSBraW5kID09PSBcInByb2plY3RcIiA/IFwicHJvamV0b1wiIDogXCJldGlxdWV0YVwiO1xuICAgIGZvciAoY29uc3QgciBvZiByb3dzKSB7XG4gICAgICBjb25zdCBpdGVtID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLWl0ZW1cIiB9KTtcbiAgICAgIGNvbnN0IGhlYWQgPSBpdGVtLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLWhlYWRcIiB9KTtcbiAgICAgIGNvbnN0IGxlZnQgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLWxlZnRcIiB9KTtcbiAgICAgIGxlZnQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLW5hbWVcIiwgdGV4dDogcHJlZml4ICsgci5uYW1lIH0pO1xuICAgICAgY29uc3Qgc3JjID0gbGVmdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2NvcGUtc3Jjc1wiIH0pO1xuICAgICAgaWYgKHIuaW5Db2ZyZSkgc3JjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc2NvcGUtc3JjIHdkLXNjb3BlLXNyYy1jb2ZyZVwiLCB0ZXh0OiBcIkNvZnJlXCIgfSk7XG4gICAgICBpZiAoci5pblRvZG8pIHNyYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXNjb3BlLXNyYyB3ZC1zY29wZS1zcmMtdG9kb1wiLCB0ZXh0OiBcIlRvZG9pc3RcIiB9KTtcbiAgICAgIGlmIChyLmluSGlzdCkgc3JjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc2NvcGUtc3JjIHdkLXNjb3BlLXNyYy1oaXN0XCIsIHRleHQ6IFwiSGlzdFwiIH0pO1xuICAgICAgY29uc3QgcmlnaHQgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLXNjb3BlLXJpZ2h0XCIgfSk7XG4gICAgICBpZiAoci5pbmZvICYmIHIueHAgPiAwKVxuICAgICAgICByaWdodC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdhbWUtc2NvcGUtbWV0YVwiLCB0ZXh0OiBgTnYgJHtyLmluZm8ubGV2ZWx9IFx1MDBCNyAke3IueHB9IFhQYCArIChyLmluZm8ubWF4ID8gXCIgXHUwMEI3IG1cdTAwRTF4XCIgOiBcIlwiKSB9KTtcbiAgICAgIC8vIEFcdTAwRTdcdTAwRTNvIHBvciBkaXZlcmdcdTAwRUFuY2lhIGVudHJlIENvZnJlIC8gVG9kb2lzdCAvIEhpc3RcdTAwRjNyaWNvLlxuICAgICAgbGV0IGFjdDogeyBsYWJlbDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBkYW5nZXI/OiBib29sZWFuOyBydW46ICgpID0+IFByb21pc2U8dm9pZD4gfSB8IG51bGwgPSBudWxsO1xuICAgICAgaWYgKHRvZG9SZWFkeSAmJiByLmluSGlzdCAmJiAhci5pbkNvZnJlICYmIHIuaW5Ub2RvID09PSBmYWxzZSlcbiAgICAgICAgYWN0ID0geyBsYWJlbDogXCJBcGFnYXIgaGlzdFx1MDBGM3JpY29cIiwgZGFuZ2VyOiB0cnVlLCB0aXRsZTogYFJlbW92ZSBcIiR7ci5uYW1lfVwiIGRvIGhpc3RcdTAwRjNyaWNvIGRlIFhQIChjb25maXJtYSBhbnRlcylgLFxuICAgICAgICAgIHJ1bjogKCkgPT4gdGhpcy5jbGVhclNjb3BlSGlzdG9yeShraW5kLCByLm5hbWUpIH07XG4gICAgICBlbHNlIGlmICh0b2RvUmVhZHkgJiYgci5pblRvZG8gJiYgIXIuaW5Db2ZyZSlcbiAgICAgICAgYWN0ID0geyBsYWJlbDogXCIrIENvZnJlXCIsIHRpdGxlOiBgQWRpY2lvbmFyIFx1MDBFMHMgUmVncmFzIGUgYWJyaXIgcGFyYSBjb25maWd1cmFyIG9zIG5cdTAwRUR2ZWlzIGRlc3RlICR7bm91bn1gLFxuICAgICAgICAgIHJ1bjogKCkgPT4gdGhpcy5hZGRTY29wZVRvUnVsZXMoa2luZCwgci5uYW1lKSB9O1xuICAgICAgZWxzZSBpZiAoci5pbkNvZnJlICYmIHIuaW5Ub2RvID09PSBmYWxzZSlcbiAgICAgICAgYWN0ID0geyBsYWJlbDogXCIrIFRvZG9pc3RcIiwgdGl0bGU6IGBDcmlhciBlc3RlICR7bm91bn0gbm8gVG9kb2lzdGAsXG4gICAgICAgICAgcnVuOiAoKSA9PiB0aGlzLmFkZFNjb3BlVG9Ub2RvaXN0KGtpbmQsIHIubmFtZSkgfTtcbiAgICAgIGlmIChhY3QpIHtcbiAgICAgICAgY29uc3QgYnRuID0gcmlnaHQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0biB3ZC1zY29wZS1hY3RcIiArIChhY3QuZGFuZ2VyID8gXCIgd2Qtc2NvcGUtYWN0LWRhbmdlclwiIDogXCJcIikgfSk7XG4gICAgICAgIGJ0bi5zZXRUZXh0KGFjdC5sYWJlbCk7IGJ0bi5zZXRBdHRyKFwidGl0bGVcIiwgYWN0LnRpdGxlKTtcbiAgICAgICAgY29uc3QgcnVuID0gYWN0LnJ1bjtcbiAgICAgICAgY2xpY2thYmxlKGJ0biwgKCkgPT4gdm9pZCBydW4oKSk7XG4gICAgICB9XG4gICAgICBpZiAoci5pbmZvICYmIHIueHAgPiAwKSB7XG4gICAgICAgIGNvbnN0IGJhciA9IGl0ZW0uY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtYmFyIHdkLWdhbWUtYmFyLW1pbmlcIiB9KTtcbiAgICAgICAgYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1nYW1lLWJhci1maWxsXCIgfSkuc3R5bGUud2lkdGggPSBgJHtyLmluZm8ucGN0fSVgO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIHIuaW5mby5tYXggPyBcIk5cdTAwRUR2ZWwgbVx1MDBFMXhpbW8gZG8gZXNjb3BvXCJcbiAgICAgICAgICA6IGAke3IuaW5mby5pbnRvfS8ke3IuaW5mby5mb3JOZXh0fSBYUCBwYXJhIG8gblx1MDBFRHZlbCAke3IuaW5mby5sZXZlbCArIDF9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTGltcGEgdW0gZXNjb3BvIGRvIGhpc3RcdTAwRjNyaWNvIChwcm9qZXRvIFx1MjE5MiB2aXJhIFwiU2VtIHByb2pldG9cIjsgZXRpcXVldGEgXHUyMTkyIHJlbW92aWRhIGRvcyBldmVudG9zKS4gWFAgdG90YWwgbWFudGlkby5cbiAgYXN5bmMgY2xlYXJTY29wZUhpc3Rvcnkoa2luZDogXCJwcm9qZWN0XCIgfCBcImxhYmVsXCIsIG5hbWU6IHN0cmluZykge1xuICAgIGF3YWl0IHRoaXMuZW5zdXJlTG9hZGVkKCk7XG4gICAgY29uc3QgYWZmZWN0ZWQgPSBraW5kID09PSBcInByb2plY3RcIlxuICAgICAgPyB0aGlzLmV2ZW50cy5maWx0ZXIoZSA9PiAoZS5wcm9qZWN0IHx8IFwiXHUyMDE0XCIpID09PSBuYW1lKS5sZW5ndGhcbiAgICAgIDogdGhpcy5ldmVudHMuZmlsdGVyKGUgPT4gZS5sYWJlbHMuaW5jbHVkZXMobmFtZSkpLmxlbmd0aDtcbiAgICBpZiAoIWFmZmVjdGVkKSByZXR1cm47XG4gICAgY29uc3Qgb2sgPSBhd2FpdCBjb25maXJtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgIHRpdGxlOiBcIkFwYWdhciBkbyBoaXN0XHUwMEYzcmljbz9cIixcbiAgICAgIGJvZHk6IGtpbmQgPT09IFwicHJvamVjdFwiXG4gICAgICAgID8gYFJlbW92ZXIgbyBwcm9qZXRvIFwiJHtuYW1lfVwiIGRvIGhpc3RcdTAwRjNyaWNvICgke2FmZmVjdGVkfSBldmVudG8ocykgdmlyYW0gXCJTZW0gcHJvamV0b1wiKS4gTyBYUCB0b3RhbCBcdTAwRTkgbWFudGlkby5gXG4gICAgICAgIDogYFJlbW92ZXIgYSBldGlxdWV0YSBcIkAke25hbWV9XCIgZG8gaGlzdFx1MDBGM3JpY28gKCR7YWZmZWN0ZWR9IGV2ZW50byhzKSkuIE8gWFAgdG90YWwgXHUwMEU5IG1hbnRpZG8uYCxcbiAgICAgIGN0YTogXCJBcGFnYXJcIixcbiAgICB9KTtcbiAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgZm9yIChjb25zdCBlIG9mIHRoaXMuZXZlbnRzKSB7XG4gICAgICBpZiAoa2luZCA9PT0gXCJwcm9qZWN0XCIpIHsgaWYgKChlLnByb2plY3QgfHwgXCJcdTIwMTRcIikgPT09IG5hbWUpIGUucHJvamVjdCA9IFwiXCI7IH1cbiAgICAgIGVsc2UgaWYgKGUubGFiZWxzLmluY2x1ZGVzKG5hbWUpKSBlLmxhYmVscyA9IGUubGFiZWxzLmZpbHRlcihsID0+IGwgIT09IG5hbWUpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLndyaXRlTG9nKCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIG5ldyBOb3RpY2UoYEhpc3RcdTAwRjNyaWNvIGRlIFwiJHtuYW1lfVwiIGxpbXBvLmApO1xuICB9XG5cbiAgLy8gQWRpY2lvbmEgdW0gZXNjb3BvIFx1MDBFMHMgUmVncmFzIChjb2ZyZSkgZSBhYnJlIGEgbm90YSBwYXJhIGNvbmZpZ3VyYXIgc2V1cyBuXHUwMEVEdmVpcy5cbiAgYXN5bmMgYWRkU2NvcGVUb1J1bGVzKGtpbmQ6IFwicHJvamVjdFwiIHwgXCJsYWJlbFwiLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXRoID0gdGhpcy5ydWxlc1BhdGgoKTtcbiAgICBsZXQgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSB7IGF3YWl0IHRoaXMub3BlbkdhbWVSdWxlcygpOyBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpOyB9XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGYpO1xuICAgIGNvbnN0IHJ1bGVzID0gcGFyc2VHYW1lUnVsZXMoY29udGVudCkgPz8gZGVmYXVsdFJ1bGVzKCk7XG4gICAgaWYgKGtpbmQgPT09IFwicHJvamVjdFwiKSB7IGlmICghcnVsZXMucHJvamVjdHMuaW5jbHVkZXMobmFtZSkpIHJ1bGVzLnByb2plY3RzLnB1c2gobmFtZSk7IH1cbiAgICBlbHNlIGlmICghcnVsZXMubGFiZWxzLnNvbWUobCA9PiBsLm5hbWUgPT09IG5hbWUpKSBydWxlcy5sYWJlbHMucHVzaCh7IG5hbWUgfSk7XG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHJ1bGVzVG9Kc29uT2JqKHJ1bGVzKSwgbnVsbCwgMik7XG4gICAgY29uc3QgbmV4dCA9IHJlcGxhY2VGaXJzdEpzb25CbG9jayhjb250ZW50LCBqc29uKSA/PyBidWlsZEdhbWVSdWxlc0NvbnRlbnQocnVsZXMpO1xuICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBuZXh0KTtcbiAgICB0aGlzLmludmFsaWRhdGUoKTsgYXdhaXQgdGhpcy5lbnN1cmVMb2FkZWQoKTsgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICBuZXcgTm90aWNlKGBcIiR7bmFtZX1cIiBhZGljaW9uYWRvIFx1MDBFMHMgUmVncmFzIFx1MjAxNCBjb25maWd1cmUgb3Mgblx1MDBFRHZlaXMgbmEgbm90YS5gKTtcbiAgfVxuXG4gIC8vIENyaWEgVU0gZXNjb3BvIG5vIFRvZG9pc3QgKG5cdTAwRTNvIHN1YnN0aXR1aSBvIFwiUHJvdmlzaW9uYXJcIiBlbSBtYXNzYSBkYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlxuICBhc3luYyBhZGRTY29wZVRvVG9kb2lzdChraW5kOiBcInByb2plY3RcIiB8IFwibGFiZWxcIiwgbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIpOyByZXR1cm47IH1cbiAgICBjb25zdCBjb2xvciA9IGtpbmQgPT09IFwibGFiZWxcIiA/IHRoaXMucnVsZXM/LmxhYmVscy5maW5kKGwgPT4gbC5uYW1lID09PSBuYW1lKT8uY29sb3IgOiB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChraW5kID09PSBcInByb2plY3RcIikgYXdhaXQgY3JlYXRlVG9kb2lzdFByb2plY3QodG9rZW4sIG5hbWUpO1xuICAgICAgZWxzZSBhd2FpdCBjcmVhdGVUb2RvaXN0TGFiZWwodG9rZW4sIG5hbWUsIGNvbG9yKTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnRvZG8uZmV0Y2godHJ1ZSk7ICAgLy8gYXR1YWxpemEga25vd25Qcm9qZWN0cy9rbm93bkxhYmVsc1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgbmV3IE5vdGljZShgXCIke25hbWV9XCIgY3JpYWRvIG5vIFRvZG9pc3QuYCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGE6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdyXHUwMEUxZmljbyBkZSBYUCBwb3IgZGlhIChcdTAwRkFsdGltb3MgTiBkaWFzKSBcdTIwMTQgYmFycmFzIG91IGxpbmhhIGNvbSBwb250b3MgKHNldHRpbmdzLmdhbWVDaGFydE1vZGUpLlxuICBwcml2YXRlIHJlbmRlclhwQ2hhcnQoaG9zdDogSFRNTEVsZW1lbnQsIHM6IEdhbWVTdGF0cywgcGhvbmU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBEQVlTID0gcGhvbmUgPyAxNSA6IDMwO1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5nYW1lQ2hhcnRNb2RlO1xuICAgIGNvbnN0IHRvZGF5S2V5ID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgY29uc3QgZGF5czogeyBrZXk6IHN0cmluZzsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gREFZUyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTsgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3QgYWdnID0gcy5ieURheS5nZXQoa2V5KTtcbiAgICAgIGRheXMucHVzaCh7IGtleSwgeHA6IGFnZz8ueHAgPz8gMCwgY291bnQ6IGFnZz8uY291bnQgPz8gMCwgbGFiZWw6IGAke2RheX0vJHttfWAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdhbWUtY2hhcnRzZWNcIiB9KTtcbiAgICBjb25zdCBoZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ2FtZS1jaGFydGhkXCIgfSk7XG4gICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1nYW1lLWNoYXJ0LXRpdGxlXCIsIHRleHQ6IGBYUCBub3MgXHUwMEZBbHRpbW9zICR7REFZU30gZGlhc2AgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgbWtCdG4gPSAobTogXCJiYXJzXCIgfCBcImxpbmVcIiwgbGFiZWw6IHN0cmluZywgdGl0bGU6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgYiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArIChtb2RlID09PSBtID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBsYWJlbCB9KTtcbiAgICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTsgYi5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhtb2RlID09PSBtKSk7XG4gICAgICBjbGlja2FibGUoYiwgYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLmdhbWVDaGFydE1vZGUgPSBtOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICB9O1xuICAgIG1rQnRuKFwiYmFyc1wiLCBcImJhcnJhc1wiLCBcIkdyXHUwMEUxZmljbyBkZSBiYXJyYXNcIik7XG4gICAgbWtCdG4oXCJsaW5lXCIsIFwibGluaGFcIiwgXCJMaW5oYSBjb20gcG9udG9zXCIpO1xuXG4gICAgY29uc3QgdGlwID0gKGQ6IHsgeHA6IG51bWJlcjsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZyB9KSA9PiBgJHtkLmxhYmVsfTogJHtkLnhwID49IDAgPyBcIitcIiA6IFwiXCJ9JHtkLnhwfSBYUCBcdTAwQjcgJHtkLmNvdW50fSBmZWl0YShzKWA7XG4gICAgaWYgKG1vZGUgPT09IFwibGluZVwiKSB7XG4gICAgICByZW5kZXJMaW5lQ2hhcnQoc2VjLCBkYXlzLm1hcChkID0+ICh7IHZhbHVlOiBkLnhwLCBsYWJlbDogZC5sYWJlbCwgaXNUb2RheTogZC5rZXkgPT09IHRvZGF5S2V5LCB0aXA6IHRpcChkKSB9KSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kYXlzLm1hcChkID0+IE1hdGgubWF4KDAsIGQueHApKSwgMSk7ICAgLy8gc1x1MDBGMyBYUCBwb3NpdGl2byBkaW1lbnNpb25hXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGRheXMuZm9yRWFjaCgoeyBrZXksIHhwLCBjb3VudCwgbGFiZWwgfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNvbFwiICsgKGtleSA9PT0gdG9kYXlLZXkgPyBcIiB3ZC1ncm93dGgtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgYmFyQXJlYSA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhci1hcmVhXCIgfSk7XG4gICAgICBjb25zdCBlbXB0eSA9IHhwIDw9IDA7XG4gICAgICBjb25zdCBiYXIgPSBiYXJBcmVhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyXCIgKyAoZW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGVtcHR5ID8gXCIzcHhcIiA6IGAke01hdGgubWF4KDUsIE1hdGgucm91bmQoKHhwIC8gbWF4KSAqIDEwMCkpfSVgO1xuICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXAoeyB4cCwgY291bnQsIGxhYmVsIH0pKTtcbiAgICAgIGNvbnN0IHNob3dMYmwgPSBpZHggPT09IDAgfHwgaWR4ID09PSBEQVlTIC0gMSB8fCBpZHggJSA3ID09PSAwO1xuICAgICAgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtbGJsXCIsIHRleHQ6IHNob3dMYmwgPyBsYWJlbCA6IFwiXCIgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgUEhPTkVfTUFYID0gNjAwOyAgIC8vIHB4IFx1MjAxNCBhYmFpeG8gZGlzc28gbyBwYWluZWwgZW50cmEgZW0gXCJtb2RvIEFuZHJvaWRcIlxuLy8gXCJNb2RvIEFuZHJvaWRcIiBwb3IgTEFSR1VSQSBkbyBwYWluZWwgKG5cdTAwRTNvIHBvciBkaXNwb3NpdGl2bykuIE1lZGUgbyBjb250YWluZXI7XG4vLyBhbnRlcyBkbyBsYXlvdXQgKGNsaWVudFdpZHRoIDApIGNhaSBubyBkaXNwb3NpdGl2by4gUGxhdGZvcm0uaXNQaG9uZSByZWZvclx1MDBFN2Fcbi8vIHBhcmEgbyBjZWx1bGFyIHJlYWwgc2VndWlyIGVtIG1vZG8gQW5kcm9pZCBlbSBxdWFscXVlciBsYXJndXJhL29yaWVudGFcdTAwRTdcdTAwRTNvLlxuZnVuY3Rpb24gaXNQaG9uZVdpZHRoKGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICBjb25zdCB3ID0gZWwuY2xpZW50V2lkdGg7XG4gIHJldHVybiBQbGF0Zm9ybS5pc1Bob25lIHx8ICh3ID4gMCAmJiB3IDw9IFBIT05FX01BWCk7XG59XG5cbi8vIEJhc2UgZGFzIHZpZXdzOiBvYnNlcnZhIGEgbGFyZ3VyYSBkbyBwYWluZWwgZSByZS1yZW5kZXJpemEgYW8gY3J1emFyIG8gbGltaWFyLlxuYWJzdHJhY3QgY2xhc3MgV2RWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcm90ZWN0ZWQgcGhvbmUgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlcmVuZGVyKCk6IHZvaWQ7XG4gIHByb3RlY3RlZCBpbml0UGhvbmVXYXRjaCgpIHtcbiAgICBjb25zdCBybyA9IG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7XG4gICAgICBjb25zdCBwID0gaXNQaG9uZVdpZHRoKHRoaXMuY29udGVudEVsKTtcbiAgICAgIGlmIChwICE9PSB0aGlzLnBob25lKSB7IHRoaXMucGhvbmUgPSBwOyB0aGlzLnJlcmVuZGVyKCk7IH0gICAvLyBzXHUwMEYzIGFvIENSVVpBUiBvIGxpbWlhciBcdTIxOTIgc2VtIGxvb3BcbiAgICB9KTtcbiAgICByby5vYnNlcnZlKHRoaXMuY29udGVudEVsKTtcbiAgICB0aGlzLnJlZ2lzdGVyKCgpID0+IHJvLmRpc2Nvbm5lY3QoKSk7XG4gIH1cbn1cblxuY2xhc3MgRGFzaGJvYXJkVmlldyBleHRlbmRzIFdkVmlldyB7XG4gIHByaXZhdGUgd2Vla09mZnNldCA9IDA7XG4gIHByaXZhdGUgbmF2UGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGlwOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNlYXJjaFRlcm0gPSBcIlwiO1xuICBwcml2YXRlIHJldmlld0ZpbHRlciA9IGZhbHNlO1xuICBwcml2YXRlIGdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzZWNIb3N0cyA9IG5ldyBNYXA8U2VjdGlvbklkLCBIVE1MRWxlbWVudD4oKTsgICAvLyB3cmFwcGVyIGVzdFx1MDBFMXZlbCBwb3Igc2VcdTAwRTdcdTAwRTNvXG4gIHByaXZhdGUgdW5zdWJUb2RvOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDsgICAgICAgICAgLy8gY2FuY2VsYXIgaW5zY3JpXHUwMEU3XHUwMEUzbyBubyBjb250cm9sbGVyXG4gIHByaXZhdGUgdW5zdWJHYW1lOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDsgICAgICAgICAgLy8gaWRlbSBwYXJhIGEgR2FtaWZpY2FcdTAwRTdcdTAwRTNvXG5cbiAgLy8gRXN0YWRvIGRvIFN5bmN0aGluZyAodjAuMTAuMClcbiAgcHJpdmF0ZSBzeW5jRGF0YTogU3luY0RhdGEgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzeW5jTG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHN5bmNFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0ZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgY29uZmxpY3RDb25maXJtOiBzdHJpbmcgfCBudWxsID0gbnVsbDsgICAvLyBwYXRoIGRvIGNvbmZsaXRvIGFndWFyZGFuZG8gY29uZmlybWFcdTAwRTdcdTAwRTNvXG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFZJRVdfVFlQRTsgfVxuICBnZXREaXNwbGF5VGV4dCgpIHsgcmV0dXJuIFwiRGFzaGJvYXJkXCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxheW91dC1kYXNoYm9hcmRcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICBhd2FpdCB0aGlzLnJlbmRlcigpO1xuICAgIC8vIEluc2NyZXZlIG5vIGNvbnRyb2xsZXIgXHUwMEZBbmljbzogbXVkYW5cdTAwRTdhIGRlIGVzdGFkbyByZS1yZW5kZXJpemEgc1x1MDBGMyBhIHNlXHUwMEU3XHUwMEUzbyBUYXJlZmFzLlxuICAgIHRoaXMudW5zdWJUb2RvID0gdGhpcy5wbHVnaW4udG9kby5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZW5kZXJTZWN0aW9uKFwidG9kb2lzdFwiKSk7XG4gICAgdGhpcy51bnN1YkdhbWUgPSB0aGlzLnBsdWdpbi5nYW1lLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbmRlclNlY3Rpb24oXCJnYW1lXCIpKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB7IHRoaXMucGx1Z2luLmludmFsaWRhdGVWYXVsdENhY2hlKCk7IHRoaXMuc2NoZWR1bGUoKTsgfSkpO1xuICAgIHRoaXMuaW5pdFBob25lV2F0Y2goKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy51bnN1YlRvZG8/LigpO1xuICAgIHRoaXMudW5zdWJUb2RvID0gbnVsbDtcbiAgICB0aGlzLnVuc3ViR2FtZT8uKCk7XG4gICAgdGhpcy51bnN1YkdhbWUgPSBudWxsO1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG5cbiAgLy8gUmUtcmVuZGVyIHBcdTAwRkFibGljbyBcdTIwMTQgY2hhbWFkbyBwZWxvIHBsdWdpbiBxdWFuZG8gYSBjb25maWd1cmFcdTAwRTdcdTAwRTNvIG11ZGEgbmEgYWJhXG4gIC8vIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIChvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMgZGEgU2VtYW5hKS5cbiAgcmVmcmVzaCgpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG4gIHByb3RlY3RlZCByZXJlbmRlcigpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgdGhpcy5waG9uZSA9IGlzUGhvbmVXaWR0aCh0aGlzLmNvbnRlbnRFbCk7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLXBob25lXCIsIHRoaXMucGhvbmUpO1xuICAgIHJvb3QudG9nZ2xlQ2xhc3MoXCJ3ZC1jb21wYWN0XCIsIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QpO1xuXG4gICAgdGhpcy5yZW5kZXJIZWFkZXIocm9vdCk7XG4gICAgLy8gQ2FkYSBzZVx1MDBFN1x1MDBFM28gbW9yYSBudW0gaG9zdCBlc3RcdTAwRTF2ZWwgXHUyMTkyIGRcdTAwRTEgcGFyYSByZS1yZW5kZXJpemFyIHVtYSBzZVx1MDBFN1x1MDBFM28gc1x1MDBGM1xuICAgIC8vIChleC46IHJlZnJlc2ggZG8gVG9kb2lzdC9TeW5jdGhpbmcpIHNlbSByZWNvbnN0cnVpciBhIHZpZXcgaW50ZWlyYS5cbiAgICB0aGlzLnNlY0hvc3RzLmNsZWFyKCk7XG4gICAgZm9yIChjb25zdCBpZCBvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXIpIHtcbiAgICAgIGNvbnN0IGhvc3QgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaG9zdFwiIH0pO1xuICAgICAgdGhpcy5zZWNIb3N0cy5zZXQoaWQsIGhvc3QpO1xuICAgICAgdGhpcy5yZW5kZXJTZWN0aW9uKGlkKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZS1yZW5kZXJpemEgYXBlbmFzIGEgc2VcdTAwRTdcdTAwRTNvIGBpZGAgZGVudHJvIGRvIHNldSBob3N0IChzZW0gdG9jYXIgbmFzIG91dHJhcykuXG4gIHByaXZhdGUgcmVuZGVyU2VjdGlvbihpZDogU2VjdGlvbklkKSB7XG4gICAgY29uc3QgaG9zdCA9IHRoaXMuc2VjSG9zdHMuZ2V0KGlkKTtcbiAgICBpZiAoIWhvc3QpIHJldHVybjtcbiAgICBob3N0LmVtcHR5KCk7XG4gICAgaWYgKGlkID09PSBcImNhbGVuZGFyXCIpICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcInBhcmFcIikgICAgdGhpcy5yZW5kZXJQYXJhKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcImhlYXRtYXBcIikgdGhpcy5yZW5kZXJIZWF0bWFwKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcImdyb3d0aFwiKSAgdGhpcy5yZW5kZXJHcm93dGgoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwic3RhdHNcIikgICB0aGlzLnJlbmRlclN0YXRzKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcInRvZG9pc3RcIikgdGhpcy5yZW5kZXJUb2RvaXN0KGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcInN5bmNcIikgICAgdGhpcy5yZW5kZXJTeW5jKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcImdhbWVcIikgICAgdGhpcy5yZW5kZXJHYW1lKGhvc3QpO1xuICB9XG5cbiAgLy8gRmFpeGEgY29tcGFjdGEgZGUgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIG5vIGRhc2hib2FyZCAocGFpbmVsIGNvbXBsZXRvIGZpY2EgbmEgYWJhIHByXHUwMEYzcHJpYSkuXG4gIHByaXZhdGUgcmVuZGVyR2FtZShob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZCB8fCB0aGlzLmlzSGlkZGVuKFNFQ19HQU1FKSkgcmV0dXJuO1xuICAgIGNvbnN0IHNlYyA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtZ2FtZS1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJHQU1JRklDQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IG9wZW4gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3BlbmJ0blwiIH0pO1xuICAgIHNldEljb24ob3BlbiwgXCJ0cm9waHlcIik7XG4gICAgb3Blbi5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBhIGFiYSBkZSBHYW1pZmljYVx1MDBFN1x1MDBFM29cIik7XG4gICAgY2xpY2thYmxlKG9wZW4sIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMucGx1Z2luLm9wZW5HYW1lKCk7IH0pO1xuICAgIHRoaXMucGx1Z2luLmdhbWUucmVuZGVyUGFuZWwoc2VjLCBjdHJscywgeyBmdWxsOiBmYWxzZSwgcGhvbmU6IHRoaXMucGhvbmUgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgT2N1bHRhciAobGVpdHVyYSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3RyYXIvb2N1bHRhciBlIGEgb3JkZW0gZGFzIHNlXHUwMEU3XHUwMEY1ZXMgc1x1MDBFM28gYWRtaW5pc3RyYWRvcyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZG8gcGx1Z2luLiBBIHZpZXcgc1x1MDBGMyAqbFx1MDBFQSogYHNldHRpbmdzLmhpZGRlbmAgcGFyYSBwdWxhciBvIHF1ZVxuICAvLyBlc3RcdTAwRTEgb2N1bHRvLiBWZXIgV2VydXNTZXR0aW5nVGFiLlxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gUG9zaWNpb25hIHVtIHRvb2x0aXAgZml4byBhYmFpeG8gZG8gYWx2byAodmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvKS5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2OyAgLy8gdmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvXG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgbGlzdGFuZG8gYXMgbm90YXMgdXJnZW50ZXMgZGUgdW1hIHBhc3RhIChob3ZlciBubyBiYWRnZSBkZSBhdmlzbykuXG4gIHByaXZhdGUgc2hvd1VyZ2VuY3lUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdXJnZW5jeS10aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIlVyZ2VudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXV0aXAtZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IFVSR0VOQ1lfQ09MT1JbaXQubGV2ZWxdO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogaXQuZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGl0LmxldmVsIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIEJhZGdlIGRlIGF2aXNvICh0cmlcdTAwRTJuZ3Vsbykgbm8gY2FyZCBkZSBwYXN0YSBxdWUgY29udFx1MDBFOW0gbm90YXMgY29tIGB1cmdlbmN5YC5cbiAgLy8gQ29yIHBlbG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbzsgaG92ZXIgbGlzdGEgb3MgYXJxdWl2b3MuIEZhc2UgMTAuXG4gIHByaXZhdGUgdXJnZW5jeUJhZGdlKGNhcmQ6IEhUTUxFbGVtZW50LCB1cmc6IFVyZ2VuY3lJbmZvKSB7XG4gICAgaWYgKCF1cmcubWF4KSByZXR1cm47XG4gICAgY29uc3QgYiA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktYmFkZ2Ugd2QtdS0ke3VyZy5tYXh9YCB9KTtcbiAgICBzZXRJY29uKGIsIFwidHJpYW5nbGUtYWxlcnRcIik7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dVcmdlbmN5VGlwKGIsIHVyZy5pdGVtcykpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgcmVjZW50czogVEZpbGVbXSkge1xuICAgIGlmICghcmVjZW50cy5sZW5ndGgpIHJldHVybjtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1RpcChjYXJkLCByZWNlbnRzKSk7XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICAvLyBTdWJwYXN0YXMgZXhpYlx1MDBFRHZlaXMgKGlnbm9yYSBwYXN0YXMgc1x1MDBGMy1kZS1pbWFnZW5zKSwgdmlhIGNhY2hlIGRvIGNvZnJlLlxuICBwcml2YXRlIHN1YkZvbGRlcnNPZihmb2xkZXI6IFRGb2xkZXIpOiBURm9sZGVyW10ge1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4geyBjb25zdCBhID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGYucGF0aCk7IHJldHVybiAhKGEgJiYgYS5pbWcgPiAwICYmIGEubWQgPT09IDApOyB9KVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FsZW5kXHUwMEUxcmlvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyQ2FsZW5kYXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfQ0FMKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbW9uZGF5ICA9IG1vbmRheU9mKHRoaXMud2Vla09mZnNldCk7XG4gICAgY29uc3Qgd2Vla051bSA9IGlzb1dlZWtOdW1iZXIobW9uZGF5KTtcbiAgICBjb25zdCB0b2RheUsgID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBGb250ZXMgYXRpdmFzIChwYXN0YXMgbWFyY2FkYXMpLiBBIGNvciBkZSBjYWRhIG5vdGEgdmVtIGRhIGZvbnRlIGRlXG4gICAgLy8gcHJlZml4byBtYWlzIGVzcGVjXHUwMEVEZmljbyBxdWUgYSBjb250XHUwMEU5bS5cbiAgICBjb25zdCBzb3VyY2VzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmZpbHRlcihzID0+IHMub24pO1xuICAgIGNvbnN0IGNvbG9yRm9yID0gKHBhdGg6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgbGV0IGJlc3Q6IENhbFNvdXJjZSB8IG51bGwgPSBudWxsO1xuICAgICAgZm9yIChjb25zdCBzIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgaWYgKHBhdGggPT09IGAke3MucGF0aH0ubWRgIHx8IHBhdGguc3RhcnRzV2l0aChgJHtzLnBhdGh9L2ApKSB7XG4gICAgICAgICAgaWYgKCFiZXN0IHx8IHMucGF0aC5sZW5ndGggPiBiZXN0LnBhdGgubGVuZ3RoKSBiZXN0ID0gcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlc3QgPyBiZXN0LmNvbG9yIDogbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQXMgbm90YXMgY29tIGRhdGEgalx1MDBFMSB2XHUwMEVBbSBkbyBjYWNoZSAodW1hIHBhc3NhZGEpOyBhcXVpIHNcdTAwRjMgZmlsdHJhIHBvciBmb250ZS5cbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IGZpbGU6IFRGaWxlOyBjb2xvcjogc3RyaW5nIH1bXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHsgZmlsZSwgZGF0ZSB9IG9mIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5kYXRlZE5vdGVzKSB7XG4gICAgICBjb25zdCBjb2xvciA9IGNvbG9yRm9yKGZpbGUucGF0aCk7XG4gICAgICBpZiAoIWNvbG9yKSBjb250aW51ZTsgICAvLyBzXHUwMEYzIG5vdGFzIGRlbnRybyBkZSB1bWEgZm9udGUgbWFyY2FkYVxuICAgICAgKGJ5RGF5W2RhdGVdID8/PSBbXSkucHVzaCh7IG5hbWU6IGZpbGUuYmFzZW5hbWUsIGZpbGUsIGNvbG9yIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtY2FsLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBuYXYgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYXYtYmFyXCIgfSk7XG4gICAgY29uc3QgcGhvbmUgPSB0aGlzLnBob25lO1xuXG4gICAgLy8gQ2VsdWxhcjogamFuZWxhIGRlIDMgZGlhcyA9IG9udGVtIFx1MDBCNyBob2plIFx1MDBCNyBhbWFuaFx1MDBFMyAod2Vla09mZnNldCBwYWdpbmEgZGUgMyBlbSAzKS5cbiAgICBjb25zdCBkYXlBbmNob3IgPSBuZXcgRGF0ZSgpO1xuICAgIGRheUFuY2hvci5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgLSAxICsgdGhpcy53ZWVrT2Zmc2V0ICogMyk7XG4gICAgY29uc3QgZm10RE0gPSAoZDogRGF0ZSkgPT4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCBcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsYXN0ID0gbmV3IERhdGUoZGF5QW5jaG9yKTsgbGFzdC5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyAyKTtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGAke2ZtdERNKGRheUFuY2hvcil9IFx1MjAxMyAke2ZtdERNKGxhc3QpfWAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGBSZWxhdFx1MDBGM3Jpb3MgXHUwMEI3IHNlbWFuYSAke3dlZWtOdW19YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHJscyA9IG5hdi5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgcHJldiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDM5XCIgfSk7XG4gICAgY29uc3QgbmV4dCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgcHJldi5zZXRBdHRyKFwidGl0bGVcIiwgXCJTZW1hbmEgYW50ZXJpb3JcIik7XG4gICAgbmV4dC5zZXRBdHRyKFwidGl0bGVcIiwgXCJQclx1MDBGM3hpbWEgc2VtYW5hXCIpO1xuICAgIGNsaWNrYWJsZShwcmV2LCAoKSA9PiB7IHRoaXMud2Vla09mZnNldC0tOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjbGlja2FibGUobmV4dCwgKCkgPT4geyB0aGlzLndlZWtPZmZzZXQrKzsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2VsdWxhcjogbGlzdGEgdmVydGljYWwgZGUgMyBkaWFzIChvbnRlbS9ob2plL2FtYW5oXHUwMEUzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBDYWRhIGRpYSA9IGEgbm90YSBkaVx1MDBFMXJpYSAodW1hIHBvciBkaWEpLiBMaW5oYSBpbnRlaXJhIGNsaWNcdTAwRTF2ZWw6IGFicmUgYVxuICAgIC8vIGV4aXN0ZW50ZTsgc2Ugblx1MDBFM28gaG91dmVyLCBjcmlhLlxuICAgIGlmIChwaG9uZSkge1xuICAgICAgY29uc3QgbGlzdCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWxpc3RcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKGRheUFuY2hvcik7XG4gICAgICAgIGRheS5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgICAgY29uc3QgZG93ID0gKGRheS5nZXREYXkoKSArIDYpICUgNztcbiAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtZHJvd1wiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGRvdyA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICAgIH0pO1xuICAgICAgICByb3cuc2V0QXR0cihcInRpdGxlXCIsIG5vdGUgPyBcIkFicmlyIG5vdGEgZGlcdTAwRTFyaWFcIiA6IFwiQ3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgICAgY29uc3QgaGQgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LWhkXCIgfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2Rvd10gfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW51bVwiLCB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LW5vdGVzXCIgfSk7XG4gICAgICAgIGlmIChub3RlKSB7XG4gICAgICAgICAgY29uc3QgcGlsbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgICAgcGlsbC50ZXh0Q29udGVudCA9IG5vdGUuYmFzZW5hbWUubGVuZ3RoID4gMjQgPyBub3RlLmJhc2VuYW1lLnNsaWNlKDAsIDI0KSArIFwiXHUyMDI2XCIgOiBub3RlLmJhc2VuYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvZHkuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtZHJvdy1lbXB0eVwiLCB0ZXh0OiBcImNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBjbGlja2FibGUocm93LCAoKSA9PiB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRGVza3RvcC90YWJsZXQ6IGdyYWRlIGRlIDcgZGlhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZ3JpZFwiIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgICAgZGF5LnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGNvbCA9IGdyaWQuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtY29sXCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgaSA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhkID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtaGRcIiB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbaV0gfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW51bVwiLCAgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgaGQuc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgLyBjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgY2xpY2thYmxlKGhkLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KTsgfSk7XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0td2Qtc3JjXCIsIGl0LmNvbG9yKTtcbiAgICAgICAgcGlsbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1waWxsLWRvdFwiIH0pO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtdHh0XCIsIHRleHQ6IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lIH0pO1xuICAgICAgICBwaWxsLnNldEF0dHIoXCJ0aXRsZVwiLCBpdC5uYW1lKTtcbiAgICAgICAgY2xpY2thYmxlKHBpbGwsICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShpdC5maWxlKSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFjaGEgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgIChZWVlZLU1NLUREKTogcHJpbWVpcm8gcGVsbyBjYW1pbmhvIGNhblx1MDBGNG5pY28gZW1cbiAgLy8gNTAuRGlcdTAwRTFyaW8vLCBzZW5cdTAwRTNvIHF1YWxxdWVyIG5vdGEgY3VqbyBgZGF0ZTpgIHNlamEgZXNzZSBkaWEuIE51bGwgc2Ugblx1MDBFM28gaG91dmVyLlxuICAvLyAoUmVsYXRcdTAwRjNyaW8vbm90YSBkaVx1MDBFMXJpYSBcdTAwRTkgdW0gcG9yIGRpYSBcdTIxOTIgYWJyZSBvIGV4aXN0ZW50ZSBlbSB2ZXogZGUgY3JpYXIgb3V0cm8uKVxuICBwcml2YXRlIGZpbmREYWlseU5vdGUoa2V5OiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICAgIGNvbnN0IGRpcmVjdCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGApO1xuICAgIGlmIChkaXJlY3QgaW5zdGFuY2VvZiBURmlsZSkgcmV0dXJuIGRpcmVjdDtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmRhdGVkTm90ZXMuZmluZChuID0+IG4uZGF0ZSA9PT0ga2V5KT8uZmlsZSA/PyBudWxsO1xuICB9XG5cbiAgLy8gQWJyZSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWA7IGNyaWEgZW0gNTAuRGlcdTAwRTFyaW8vIFNcdTAwRDMgc2Ugblx1MDBFM28gZXhpc3RpciBuZW5odW1hLlxuICBwcml2YXRlIGFzeW5jIG9wZW5EYWlseU5vdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgIGlmIChleGlzdGluZykgeyBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZXhpc3RpbmcpOyByZXR1cm47IH1cblxuICAgIC8vIE5cdTAwRTNvIGV4aXN0ZSBcdTIxOTIgY3JpYSBubyBjYW1pbmhvIGNhblx1MDBGNG5pY28uXG4gICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfRk9MREVSKSlcbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihEQUlMWV9GT0xERVIpLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIGNvbnN0IFt5LCBtLCBkXSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgY29uc3QgdGl0dWxvID0gbmV3IERhdGUoK3ksICttIC0gMSwgK2QpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICAgIH0pO1xuXG4gICAgLy8gVXNhIG8gdGVtcGxhdGUgZW0gTW9kZWxvcy8gc2UgZXhpc3Rpcjsgc2VuXHUwMEUzbywgZmFsbGJhY2sgZW1idXRpZG8uXG4gICAgY29uc3QgdHBsID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX1RFTVBMQVRFKTtcbiAgICBsZXQgYm9keTogc3RyaW5nO1xuICAgIGlmICh0cGwgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgYm9keSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKHRwbCkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZGF0ZVxccypcXH1cXH0vZywga2V5KVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKnRpdGxlXFxzKlxcfVxcfS9nLCB0aXR1bG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5ID1cbmAtLS1cbm93bmVyOiBXZXJ1c1xuY3JlYXRlZDogJHtrZXl9XG5kYXRlOiAke2tleX1cbnJldmlld2VkOiB0cnVlXG50eXBlOiBkYWlseVxucGVybWlzc2lvbnM6XG4gIHJlYWQ6IFthbGxdXG4gIHdyaXRlOlxuICAgIC0gV2VydXNcbi0tLVxuXG4jICR7dGl0dWxvfVxuXG5gO1xuICAgIH1cbiAgICBjb25zdCBmaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCwgYm9keSk7XG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRzIGRvIGNvZnJlICh0b2RhcyBhcyBwYXN0YXMgZGUgdG9wbykgKyBuYXZlZ2Fkb3IgYW5pbmhhZG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJQYXJhKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1BBUkEpKSByZXR1cm47XG4gICAgLy8gU2UgYSBwYXN0YSBhYmVydGEgbm8gbmF2ZWdhZG9yIGZvaSBvY3VsdGFkYSBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMsIGZlY2hhLlxuICAgIGlmICh0aGlzLm5hdlBhdGggJiYgdGhpcy5pc0hpZGRlbih0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkpKSB0aGlzLm5hdlBhdGggPSBudWxsO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ09GUkVcIiB9KTtcblxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhcmEtZ3JpZFwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpICAgLy8gaWdub3JhIC5vYnNpZGlhbiwgLnRyYXNoLCBldGMuXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgICBjb25zdCBhY3RpdmVSb290ID0gdGhpcy5uYXZQYXRoID8gdGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpIDogbnVsbDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcblxuICAgIGxldCBpZHggPSAwO1xuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGFnZyAgICAgPSBjYWNoZS5ieUZvbGRlci5nZXQoZm9sZGVyLnBhdGgpID8/IEVNUFRZX0FHRztcbiAgICAgIGNvbnN0IG1ldGEgICAgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSB0aGlzLnN1YkZvbGRlcnNPZihmb2xkZXIpLmxlbmd0aCA+IDAgfHwgZmlsZXNJbihmb2xkZXIpLmxlbmd0aCA+IDA7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVJvb3QgPT09IGZvbGRlci5wYXRoO1xuXG4gICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZCB3ZC1wYXJhLWNhcmQgd2QtYW5pbS1pblwiICsgKGlzQWN0aXZlID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICBjYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7aWR4ICogNDB9bXNgO1xuICAgICAgaWR4Kys7XG5cbiAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0XCIgfSk7XG4gICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgfVxuICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtYWNjZW50LWJhclwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBtZXRhLmFjY2VudDtcblxuICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgeyBpdGVtczogYWdnLnVyZ2VuY3ksIG1heDogYWdnLnVyZ2VuY3lNYXggfSk7XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoeyBtZDogYWdnLm1kLCBpbWc6IGFnZy5pbWcgfSkgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCAgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWZvbGRlclwiLCB0ZXh0OiBmb2xkZXIucGF0aCB9KTtcbiAgICAgIGlmIChuYXZpZ2FibGUpIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhhcy1zdWJzXCIsIHRleHQ6IGlzQWN0aXZlID8gXCJmZWNoYXIgXHUyNUJFXCIgOiBcImFicmlyIFx1MjAzQVwiIH0pO1xuXG4gICAgICBpZiAoYWdnLm1kID4gMCkge1xuICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhc2ApO1xuICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKGFnZy5yZXZpZXdlZCAvIGFnZy5tZCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGFnZy5yZWNlbnQpO1xuXG4gICAgICBjbGlja2FibGUoY2FyZCwgKCkgPT4ge1xuICAgICAgICBpZiAobmF2aWdhYmxlKSB7IHRoaXMubmF2UGF0aCA9IGlzQWN0aXZlID8gbnVsbCA6IGZvbGRlci5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9XG4gICAgICAgIGVsc2UgcmV2ZWFsSW5FeHBsb3Jlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IGZpbGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBhaW5lbCBpbmxpbmUgbmF2ZWdcdTAwRTF2ZWwgKGJyZWFkY3J1bWIgKyBzdWJwYXN0YXMgKyBub3RhcyBkYSBwYXN0YSBhdHVhbClcbiAgcHJpdmF0ZSByZW5kZXJCcm93c2VyKHBhcmVudDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy50b3BGb2xkZXJPZihmb2xkZXIucGF0aCk7XG4gICAgY29uc3Qgcm9vdEZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyb290UGF0aCk7XG4gICAgaWYgKCEocm9vdEZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIHJvb3RGb2xkZXIpO1xuXG4gICAgY29uc3QgcGFuZWwgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhbmVsXCIgfSk7XG4gICAgcGFuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAvLyBCcmVhZGNydW1iXG4gICAgY29uc3QgY3J1bWIgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY3J1bWJcIiB9KTtcbiAgICBjb25zdCByZWwgPSBmb2xkZXIucGF0aCA9PT0gcm9vdFBhdGggPyBbXSA6IGZvbGRlci5wYXRoLnNsaWNlKHJvb3RQYXRoLmxlbmd0aCArIDEpLnNwbGl0KFwiL1wiKTtcblxuICAgIGNvbnN0IHJvb3RTZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKHJlbC5sZW5ndGggPT09IDAgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpIH0pO1xuICAgIHJlbmRlckljb24ocm9vdFNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICByb290U2VnLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgIGlmIChyZWwubGVuZ3RoKSBjbGlja2FibGUocm9vdFNlZywgKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICBsZXQgYWNjID0gcm9vdFBhdGg7XG4gICAgcmVsLmZvckVhY2goKHBhcnQsIGkpID0+IHtcbiAgICAgIGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VwXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBjb25zdCBpc0xhc3QgPSBpID09PSByZWwubGVuZ3RoIC0gMTtcbiAgICAgIGFjYyA9IGAke2FjY30vJHtwYXJ0fWA7XG4gICAgICBjb25zdCBzZWdQYXRoID0gYWNjO1xuICAgICAgY29uc3Qgc2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChpc0xhc3QgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpLCB0ZXh0OiBwYXJ0IH0pO1xuICAgICAgaWYgKCFpc0xhc3QpIGNsaWNrYWJsZShzZWcsICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2VnUGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xpY2thYmxlKGNsb3NlLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IG51bGw7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgLy8gQ2FtcG8gZGUgYnVzY2FcbiAgICBjb25zdCBzZWFyY2hXcmFwID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYXJjaC13cmFwXCIgfSk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hXcmFwLmNyZWF0ZUVsKFwiaW5wdXRcIiwge1xuICAgICAgY2xzOiBcIndkLXNlYXJjaFwiLFxuICAgICAgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiZmlsdHJhclx1MjAyNlwiLCB2YWx1ZTogdGhpcy5zZWFyY2hUZXJtIH0sXG4gICAgfSk7XG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtc3ViLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxibCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2QtbGFiZWxcIik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBsYmwuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLW5vdGUtcm93LCAud2Qtbm90ZS1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2Qtbm90ZS1uYW1lLCAud2Qtbm90ZS1jYXJkLW5hbWVcIik/LnRleHRDb250ZW50ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBuYW1lLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJwYXN0YXMgY29tbyBjYXJkc1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIGNvbnN0IHN1YnMgPSB0aGlzLnN1YkZvbGRlcnNPZihmb2xkZXIpO1xuICAgIGlmIChzdWJzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2dyaWQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvai1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNmIG9mIHN1YnMpIHtcbiAgICAgICAgY29uc3QgYWdnICAgID0gY2FjaGUuYnlGb2xkZXIuZ2V0KHNmLnBhdGgpID8/IEVNUFRZX0FHRztcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVhZEZvbGRlclN0YXR1cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBjb3ZlciAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IGRlZXBlciA9IHRoaXMuc3ViRm9sZGVyc09mKHNmKS5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBjdXN0b21JY29uID0gcmVhZEZvbGRlckljb24odGhpcy5hcHAsIHNmKTtcblxuICAgICAgICBjb25zdCBjYXJkID0gc2dyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtY2FyZCB3ZC1zdWItY2FyZCB3ZC1zLSR7c3RhdHVzfWAgfSk7XG4gICAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBzdXRpbCAodmVyc1x1MDBFM28gbWVub3IgcXVlIGFzIHBhc3RhcyBkZSB0b3BvKSBcdTIwMTQgRmFzZSA5LjFcbiAgICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHQgd2QtY292ZXItc3ViXCIgfSk7XG4gICAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIGN1c3RvbUljb24gPz8gXCJcdUQ4M0RcdURDQzFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLWJhZGdlIHdkLWJhZGdlLSR7c3RhdHVzfWAsIHRleHQ6IFNUQVRVU19JQ09OW3N0YXR1c10gfSk7XG4gICAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHsgaXRlbXM6IGFnZy51cmdlbmN5LCBtYXg6IGFnZy51cmdlbmN5TWF4IH0pO1xuXG4gICAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICAgIGlmIChjdXN0b21JY29uKSByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb24gd2Qtc3ViLWljb25cIiB9KSwgY3VzdG9tSWNvbik7XG4gICAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dCh7IG1kOiBhZ2cubWQsIGltZzogYWdnLmltZyB9KSB9KTtcbiAgICAgICAgaWYgKGRlZXBlcikgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3ViLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCB0ZXh0OiBzZi5uYW1lIH0pO1xuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSBsYWJlbC5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiICYmIGFnZy5tZCA+IDApIHtcbiAgICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzYCk7XG4gICAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKGFnZy5yZXZpZXdlZCAvIGFnZy5tZCAqIDEwMCl9JWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY2FyZC5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBhZ2cucmVjZW50KTtcbiAgICAgICAgICBjbGlja2FibGUoY2FyZCwgKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZi5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFycXVpdm9zIGRhIHBhc3RhIGF0dWFsIChub3RhcywgY2FudmFzLCBiYXNlcylcbiAgICBjb25zdCBub3RlcyA9IGZpbGVzSW4oZm9sZGVyKTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHBhbmVsLCBub3Rlcyk7XG5cbiAgICBpZiAoIXN1YnMubGVuZ3RoICYmICFub3Rlcy5sZW5ndGgpXG4gICAgICBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJQYXN0YSB2YXppYS5cIiB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWF0bWFwICh2aWEgcGx1Z2luIEhlYXRtYXAgQ2FsZW5kYXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhdG1hcChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19IRUFUKSkgcmV0dXJuO1xuICAgIGlmICh0aGlzLnBob25lKSByZXR1cm47ICAgLy8gaGVhdG1hcCAoYW5vIGludGVpcm8pIG9jdWx0YWRvIHF1YW5kbyBvIHBhaW5lbCBcdTAwRTkgZXN0cmVpdG9cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtaGVhdC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJBVElWSURBREUgRE8gQ09GUkVcIiB9KTtcblxuICAgIGNvbnN0IHJlbmRlciA9IGdldEhlYXRtYXBSZW5kZXJlcigpO1xuICAgIGlmICghcmVuZGVyKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6ICdBdGl2ZSBvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiBwYXJhIHZlciBhIGF0aXZpZGFkZS4nIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdGFzIGNyaWFkYXMgcG9yIGRpYSAoZG8gY2FjaGUpLCBmaWx0cmFkYXMgcGVsbyBhbm8gY29ycmVudGUuXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBwcmVmaXggPSBTdHJpbmcoeWVhcik7XG4gICAgY29uc3QgZW50cmllczogSGVhdG1hcEVudHJ5W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtkYXRlLCBuXSBvZiB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuY3RpbWVCeURheSkge1xuICAgICAgaWYgKCFkYXRlLnN0YXJ0c1dpdGgocHJlZml4KSkgY29udGludWU7XG4gICAgICBlbnRyaWVzLnB1c2goeyBkYXRlLCBpbnRlbnNpdHk6IG4sIGNvbG9yOiBcImdyZWVuXCIsIGNvbnRlbnQ6IGAke259IG5vdGEocylgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGJveCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhdC1ib3hcIiB9KTtcbiAgICB0cnkge1xuICAgICAgcmVuZGVyKGJveCwge1xuICAgICAgICB5ZWFyLFxuICAgICAgICBjb2xvcnM6IHsgZ3JlZW46IFtcIiMxZTNhMmZcIiwgXCIjMWY2ZjQzXCIsIFwiIzJiYTg1YVwiLCBcIiMzOWQzNTNcIl0gfSxcbiAgICAgICAgc2hvd0N1cnJlbnREYXlCb3JkZXI6IHRydWUsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNlYy5lbXB0eSgpO1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkZhbGhhIGFvIHJlbmRlcml6YXIgbyBoZWF0bWFwLlwiIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBFc3RhdFx1MDBFRHN0aWNhcyBkbyBjb2ZyZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclN0YXRzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NUQVQpKSByZXR1cm47XG5cbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcbiAgICBjb25zdCB0b3RhbE5vdGVzID0gY2FjaGUudG90YWxOb3RlcztcbiAgICBjb25zdCB0b3RhbFJldmlld2VkID0gY2FjaGUudG90YWxSZXZpZXdlZDtcbiAgICAvLyBcImVzdGEgc2VtYW5hXCIgPSBjcmlhXHUwMEU3XHUwMEY1ZXMgbm9zIFx1MDBGQWx0aW1vcyA3IGRpYXMgKGRvIGNhY2hlLCBwb3IgZGF0YSBcdTIxOTIgc2VtcHJlIGZyZXNjbykuXG4gICAgbGV0IGNyZWF0ZWRUaGlzV2VlayA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpOyBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNyZWF0ZWRUaGlzV2VlayArPSBjYWNoZS5jdGltZUJ5RGF5LmdldCh0b0tleShkKSkgPz8gMDtcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsUGN0ID0gdG90YWxOb3RlcyA+IDAgPyBNYXRoLnJvdW5kKHRvdGFsUmV2aWV3ZWQgLyB0b3RhbE5vdGVzICogMTAwKSA6IDA7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJFU1RBVFx1MDBDRFNUSUNBU1wiIH0pO1xuXG4gICAgLy8gTlx1MDBGQW1lcm9zIGdsb2JhaXNcbiAgICBjb25zdCBnbG9iID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWdsb2JhbFwiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZ1wiLCB0ZXh0OiBTdHJpbmcodG90YWxOb3RlcykgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwibm90YXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWcgd2Qtc3RhdC1yZXYtbnVtXCIsIHRleHQ6IGAke2dsb2JhbFBjdH0lYCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJyZXZpc2FkYXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC13ZWVrXCIsIHRleHQ6IGArJHtjcmVhdGVkVGhpc1dlZWt9YCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJlc3RhIHNlbWFuYVwiIH0pO1xuXG4gICAgLy8gQnJlYWtkb3duIHBvciBwYXN0YVxuICAgIGNvbnN0IHRhYmxlID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXRhYmxlXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuXG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGFnZyA9IGNhY2hlLmJ5Rm9sZGVyLmdldChmb2xkZXIucGF0aCkgPz8gRU1QVFlfQUdHO1xuICAgICAgaWYgKGFnZy5tZCA9PT0gMCkgY29udGludWU7XG4gICAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHBjdCA9IE1hdGgucm91bmQoYWdnLnJldmlld2VkIC8gYWdnLm1kICogMTAwKTtcblxuICAgICAgY29uc3Qgcm93ID0gdGFibGUuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcm93XCIgfSk7XG4gICAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAgIGNvbnN0IG5hbWVFbCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1mb2xkZXJcIiB9KTtcbiAgICAgIHJlbmRlckljb24obmFtZUVsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICBuYW1lRWwuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1jb3VudFwiLCB0ZXh0OiBgJHthZ2cubWR9YCB9KTtcblxuICAgICAgY29uc3QgYmFyV3JhcCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXJcIiB9KTtcbiAgICAgIGJhcldyYXAuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhcyAoJHtwY3R9JSlgKTtcbiAgICAgIGNvbnN0IGZpbGwgPSBiYXJXcmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhci1maWxsXCIgfSk7XG4gICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cGN0fSVgO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcGN0XCIsIHRleHQ6IGAke3BjdH0lYCB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTGlzdGEgLyBncmFkZSBkZSBub3RhcyBjb20gdG9nZ2xlIGUgaW5kaWNhZG9yIHJldmlld2VkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyTm90ZXMocGFyZW50OiBIVE1MRWxlbWVudCwgbm90ZXM6IFRGaWxlW10sIGxhYmVsID0gXCJcIikge1xuICAgIGlmICghbm90ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgaXNHcmlkID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPT09IFwiZ3JpZFwiO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5yZXZpZXdGaWx0ZXIgPyBub3Rlcy5maWx0ZXIoZiA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCAhPT0gdHJ1ZSkgOiBub3RlcztcblxuICAgIGNvbnN0IGhkciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtaGRyXCIgfSk7XG4gICAgY29uc3QgY291bnRUeHQgPSB0aGlzLnJldmlld0ZpbHRlclxuICAgICAgPyBgJHtmaWx0ZXJlZC5sZW5ndGh9IHBlbmRlbnRlJHtmaWx0ZXJlZC5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9IC8gJHtub3Rlcy5sZW5ndGh9YFxuICAgICAgOiAobGFiZWwgfHwgYCR7bm90ZXMubGVuZ3RofSBub3RhJHtub3Rlcy5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9YCk7XG4gICAgaGRyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZXMtbGFiZWxcIiwgdGV4dDogY291bnRUeHQgfSk7XG5cbiAgICBjb25zdCB0b2cgPSBoZHIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXZpZXctdG9nZ2xlXCIgfSk7XG4gICAgY29uc3QgYnRuUGVuZCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5yZXZpZXdGaWx0ZXIgPyBcIiB3ZC12aWV3LWFjdGl2ZSB3ZC12aWV3LXBlbmRcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVDQlwiIH0pO1xuICAgIGJ0blBlbmQuc2V0QXR0cihcInRpdGxlXCIsIFwiTW9zdHJhciBzXHUwMEYzIHBlbmRlbnRlcyAoblx1MDBFM28gcmV2aXNhZGFzKVwiKTtcbiAgICBidG5QZW5kLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMucmV2aWV3RmlsdGVyKSk7XG4gICAgY2xpY2thYmxlKGJ0blBlbmQsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgY29uc3QgYnRuTCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIWlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyNjFcIiB9KTtcbiAgICBidG5MLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkxpc3RhXCIpO1xuICAgIGJ0bkwuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcoIWlzR3JpZCkpO1xuICAgIGNsaWNrYWJsZShidG5MLCBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImxpc3RcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhpc0dyaWQpKTtcbiAgICBjbGlja2FibGUoYnRuRywgYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIGlmICghZmlsdGVyZWQubGVuZ3RoKSB7XG4gICAgICBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IHRoaXMucmV2aWV3RmlsdGVyID8gXCJOZW5odW1hIG5vdGEgcGVuZGVudGUgbmVzdGEgcGFzdGEuXCIgOiBcIk5lbmh1bWEgbm90YS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNHcmlkKSB7XG4gICAgICBjb25zdCBncmlkID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jYXJkIHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICAvLyBDYXBhIHBhZHJcdTAwRTNvIHBvciB0aXBvIGRlIGFycXVpdm8gKG5vdGEgLyBjYW52YXMgLyBiYXNlKSBcdTIwMTQgRmFzZSA5LjJcbiAgICAgICAgY29uc3QgY292ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNvdmVyIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKGNvdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtY292ZXItZ2x5cGhcIiB9KSwgZmlsZUdseXBoKGYuZXh0ZW5zaW9uKSk7XG5cbiAgICAgICAgaWYgKGlzTWQpIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSBjYXJkLmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LW1hcmsgd2QtdS0ke3VyZ31gIH0pOyBzZXRJY29uKHcsIFwidHJpYW5nbGUtYWxlcnRcIik7IHcuc2V0QXR0cihcInRpdGxlXCIsIGBVcmdcdTAwRUFuY2lhOiAke3VyZ31gKTsgfVxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgICAgIGlmIChzdCAhPT0gXCJjYW5jZWxsZWRcIikgY2xpY2thYmxlKGNhcmQsICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1yb3cgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IHRpID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLXR5cGVpY29uIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKHRpLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS1kb3Qgd2QtYmFkZ2UtJHtzdH1gIH0pO1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjbGlja2FibGUocm93LCAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZikpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBHclx1MDBFMWZpY28gZGUgY3Jlc2NpbWVudG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJHcm93dGgocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfR1JPVykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNSRVNDSU1FTlRPIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBidG5EYXkgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJkaWFcIiB9KTtcbiAgICBidG5EYXkuc2V0QXR0cihcInRpdGxlXCIsIFwiTm90YXMgY3JpYWRhcyBwb3IgZGlhXCIpO1xuICAgIGJ0bkRheS5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyghdGhpcy5ncm93dGhDdW11bGF0aXZlKSk7XG4gICAgY2xpY2thYmxlKGJ0bkRheSwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkpO1xuICAgIGNsaWNrYWJsZShidG5DdW0sIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSB0cnVlOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjb25zdCBjbSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmdyb3d0aENoYXJ0TW9kZTtcbiAgICBjb25zdCBta0NoYXJ0QnRuID0gKG06IFwiYmFyc1wiIHwgXCJsaW5lXCIsIGxhYmVsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGIgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoY20gPT09IG0gPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IGxhYmVsIH0pO1xuICAgICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpOyBiLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKGNtID09PSBtKSk7XG4gICAgICBjbGlja2FibGUoYiwgYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLmdyb3d0aENoYXJ0TW9kZSA9IG07IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICB9O1xuICAgIG1rQ2hhcnRCdG4oXCJiYXJzXCIsIFwiYmFycmFzXCIsIFwiR3JcdTAwRTFmaWNvIGRlIGJhcnJhc1wiKTtcbiAgICBta0NoYXJ0QnRuKFwibGluZVwiLCBcImxpbmhhXCIsIFwiTGluaGEgY29tIHBvbnRvc1wiKTtcblxuICAgIC8vIE5vdGFzIHBvciBkYXRhIGRlIGNyaWFcdTAwRTdcdTAwRTNvIChkbyBjYWNoZSkuXG4gICAgY29uc3QgY291bnRzID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmN0aW1lQnlEYXk7XG5cbiAgICAvLyBcdTAwREFsdGltb3MgTiBkaWFzIChtZW5vcyBxdWFuZG8gbyBwYWluZWwgXHUwMEU5IGVzdHJlaXRvKVxuICAgIGNvbnN0IERBWVMgPSB0aGlzLnBob25lID8gMTUgOiAzMDtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCBjb3VudDogY291bnRzLmdldChrZXkpID8/IDAsIGxhYmVsOiBgJHtkYXl9LyR7bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsID0gZGF5cy5yZWR1Y2UoKHMsIGQpID0+IHMgKyBkLmNvdW50LCAwKTtcbiAgICBjb25zdCB0b2RheUtleSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gTW9kbyBjdW11bGF0aXZvOiBzb21hIGFjdW11bGFkYSBkaWEgYSBkaWFcbiAgICB0eXBlIERheUVudHJ5ID0geyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgZGlzcGxheVZhbDogbnVtYmVyIH07XG4gICAgbGV0IGVudHJpZXM6IERheUVudHJ5W107XG4gICAgaWYgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkge1xuICAgICAgbGV0IGFjYyA9IDA7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiB7IGFjYyArPSBkLmNvdW50OyByZXR1cm4geyAuLi5kLCBkaXNwbGF5VmFsOiBhY2MgfTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+ICh7IC4uLmQsIGRpc3BsYXlWYWw6IGQuY291bnQgfSkpO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5lbnRyaWVzLm1hcChlID0+IGUuZGlzcGxheVZhbCksIDEpO1xuXG4gICAgLy8gTGluaGEgZGUgcmVzdW1vXG4gICAgY29uc3QgaW5mbyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWluZm9cIiB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXRvdGFsXCIsIHRleHQ6IGAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGVudHJpZXNbZW50cmllcy5sZW5ndGggLSAxXS5kaXNwbGF5VmFsIDogdG90YWx9YCB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXBlcmlvZFwiLCB0ZXh0OiB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBgbm90YXMgYWN1bXVsYWRhcyAoJHtEQVlTfSBkaWFzKWAgOiBgbm90YXMgY3JpYWRhcyBub3MgXHUwMEZBbHRpbW9zICR7REFZU30gZGlhc2AgfSk7XG5cbiAgICBjb25zdCB0aXBGb3IgPSAoZTogRGF5RW50cnkpID0+IGAke2UubGFiZWx9OiAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGUuZGlzcGxheVZhbCArIFwiIHRvdGFsXCIgOiBlLmNvdW50ICsgXCIgbm90YShzKVwifWA7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmdyb3d0aENoYXJ0TW9kZSA9PT0gXCJsaW5lXCIpIHtcbiAgICAgIHJlbmRlckxpbmVDaGFydChzZWMsIGVudHJpZXMubWFwKGUgPT4gKHsgdmFsdWU6IGUuZGlzcGxheVZhbCwgbGFiZWw6IGUubGFiZWwsIGlzVG9kYXk6IGUua2V5ID09PSB0b2RheUtleSwgdGlwOiB0aXBGb3IoZSkgfSkpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHclx1MDBFMWZpY28gZGUgYmFycmFzXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoZSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCB7IGtleSwgbGFiZWwsIGRpc3BsYXlWYWwgfSA9IGU7XG4gICAgICBjb25zdCBjb2wgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNvbFwiICsgKGtleSA9PT0gdG9kYXlLZXkgPyBcIiB3ZC1ncm93dGgtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgYmFyQXJlYSA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhci1hcmVhXCIgfSk7XG4gICAgICBjb25zdCBpc0VtcHR5ID0gZGlzcGxheVZhbCA9PT0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChpc0VtcHR5ID8gXCIgd2QtZ3Jvd3RoLWJhci16ZXJvXCIgOiBcIlwiKSB9KTtcbiAgICAgIGJhci5zdHlsZS5oZWlnaHQgPSBpc0VtcHR5ID8gXCIzcHhcIiA6IGAke01hdGgubWF4KDUsIE1hdGgucm91bmQoKGRpc3BsYXlWYWwgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBpZiAoIWlzRW1wdHkpIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgdGlwRm9yKGUpKTtcblxuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IDcgfHwgaWR4ID09PSAxNCB8fCBpZHggPT09IDIxIHx8IGlkeCA9PT0gMjkgfHwga2V5ID09PSB0b2RheUtleTtcbiAgICAgIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWxibFwiLCB0ZXh0OiBzaG93TGJsID8gbGFiZWwgOiBcIlwiIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgKGRlbGVnYWRvIGFvIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICAvLyBCb3RcdTAwRTNvIGRlIG5hdmVnYVx1MDBFN1x1MDBFM28gXHUyMTkyIGFicmUgYSBhYmEgZGVkaWNhZGEgZG8gVG9kb2lzdCAobyBkYXNoYm9hcmQgXHUwMEU5IG8gaHViKS5cbiAgICBjb25zdCBvcGVuID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW9wZW5idG5cIiB9KTtcbiAgICBzZXRJY29uKG9wZW4sIFwic3F1YXJlLWFycm93LW91dC11cC1yaWdodFwiKTtcbiAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIGEgYWJhIGRvIFRvZG9pc3RcIik7XG4gICAgY2xpY2thYmxlKG9wZW4sIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMucGx1Z2luLm9wZW5Ub2RvaXN0KCk7IH0pO1xuICAgIC8vIExhblx1MDBFN2Fkb3IgZGUgcGFjb3RlcyBjb21wYWN0byAoc29tZSBzZSBuXHUwMEUzbyBob3V2ZXIgcGFjb3RlcykuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJQYWNrYWdlcyhzZWMpO1xuICAgIC8vIERhc2hib2FyZCA9IHNcdTAwRjMgbyBlc3NlbmNpYWwgKEF0cmFzYWRhcyBcdTAwQjcgSG9qZSBcdTAwQjcgUHJcdTAwRjN4aW1vcyA3KS4gXCJEZXBvaXNcIiBmaWNhXG4gICAgLy8gc1x1MDBGMyBuYSBhYmEgZG8gVG9kb2lzdCBcdTIxOTIgcmVjb3JyZW50ZXMgc1x1MDBGMyBhcGFyZWNlbSBhcXVpIHBlcnRvIGRvIGRpYS5cbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlckxpc3Qoc2VjLCBjdHJscywgeyBzaG93TGF0ZXI6IGZhbHNlIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNpbmNyb25pemFcdTAwRTdcdTAwRTNvIChTeW5jdGhpbmcgKyBjb25mbGl0b3MpIFx1MjAxNCB2MC4xMC4wIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHJlc2V0U3luYygpIHtcbiAgICB0aGlzLnN5bmNEYXRhID0gbnVsbDtcbiAgICB0aGlzLnN5bmNGZXRjaGVkQXQgPSAwO1xuICAgIHRoaXMuc3luY0Vycm9yID0gbnVsbDtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZmV0Y2hTeW5jKG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IGJhc2UgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwudHJpbSgpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKCFiYXNlIHx8ICFrZXkgfHwgdGhpcy5zeW5jTG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMuc3luY0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuc3luY0Vycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb2xkZXJzID0gYXdhaXQgc3RHZXQ8U1RGb2xkZXJbXT4oYmFzZSwga2V5LCBcIi9yZXN0L2NvbmZpZy9mb2xkZXJzXCIpO1xuICAgICAgY29uc3Qgd2FudGVkID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQudHJpbSgpO1xuICAgICAgY29uc3QgZm9sZGVyID0gZm9sZGVycy5maW5kKGYgPT4gZi5pZCA9PT0gd2FudGVkKSA/PyBmb2xkZXJzWzBdO1xuICAgICAgaWYgKCFmb2xkZXIpIHRocm93IG5ldyBFcnJvcihcIm5lbmh1bWEgcGFzdGEgY29uZmlndXJhZGEgbm8gU3luY3RoaW5nXCIpO1xuICAgICAgY29uc3QgZmlkID0gZW5jb2RlVVJJQ29tcG9uZW50KGZvbGRlci5pZCk7XG5cbiAgICAgIGNvbnN0IFtkZXZpY2VzLCBjb25ucywgc3RhdHVzLCBzdGF0cywgc3lzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgc3RHZXQ8U1REZXZpY2VbXT4oYmFzZSwga2V5LCBcIi9yZXN0L2NvbmZpZy9kZXZpY2VzXCIpLFxuICAgICAgICBzdEdldDx7IGNvbm5lY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCB7IGNvbm5lY3RlZDogYm9vbGVhbiB9PiB9PihiYXNlLCBrZXksIFwiL3Jlc3Qvc3lzdGVtL2Nvbm5lY3Rpb25zXCIpLFxuICAgICAgICBzdEdldDxTVFN0YXR1cz4oYmFzZSwga2V5LCBgL3Jlc3QvZGIvc3RhdHVzP2ZvbGRlcj0ke2ZpZH1gKSxcbiAgICAgICAgc3RHZXQ8UmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+PihiYXNlLCBrZXksIFwiL3Jlc3Qvc3RhdHMvZGV2aWNlXCIpLmNhdGNoKCgpID0+ICh7fSBhcyBSZWNvcmQ8c3RyaW5nLCB7IGxhc3RTZWVuOiBzdHJpbmcgfT4pKSxcbiAgICAgICAgc3RHZXQ8eyBteUlEOiBzdHJpbmcgfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9zdGF0dXNcIiksXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgcmVtb3RlID0gZGV2aWNlcy5maWx0ZXIoZCA9PiBkLmRldmljZUlEICE9PSBzeXMubXlJRCk7XG4gICAgICBjb25zdCByb3dzID0gYXdhaXQgUHJvbWlzZS5hbGwocmVtb3RlLm1hcChhc3luYyBkID0+IHtcbiAgICAgICAgY29uc3QgYyA9IGF3YWl0IHN0R2V0PFNUQ29tcGxldGlvbj4oYmFzZSwga2V5LCBgL3Jlc3QvZGIvY29tcGxldGlvbj9mb2xkZXI9JHtmaWR9JmRldmljZT0ke2QuZGV2aWNlSUR9YClcbiAgICAgICAgICAuY2F0Y2goKCkgPT4gKHsgY29tcGxldGlvbjogMCwgZ2xvYmFsSXRlbXM6IDAsIG5lZWRJdGVtczogMCwgbmVlZEJ5dGVzOiAwLCBuZWVkRGVsZXRlczogMCB9KSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogZC5uYW1lIHx8IGQuZGV2aWNlSUQuc2xpY2UoMCwgNyksXG4gICAgICAgICAgb25saW5lOiAhIWNvbm5zLmNvbm5lY3Rpb25zW2QuZGV2aWNlSURdPy5jb25uZWN0ZWQsXG4gICAgICAgICAgY29tcGxldGlvbjogYy5jb21wbGV0aW9uLFxuICAgICAgICAgIGdsb2JhbEl0ZW1zOiBjLmdsb2JhbEl0ZW1zID8/IDAsXG4gICAgICAgICAgbmVlZEl0ZW1zOiBjLm5lZWRJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRCeXRlczogYy5uZWVkQnl0ZXMsXG4gICAgICAgICAgbmVlZERlbGV0ZXM6IGMubmVlZERlbGV0ZXMsXG4gICAgICAgICAgbGFzdFNlZW46IHN0YXRzW2QuZGV2aWNlSURdPy5sYXN0U2VlbiA/PyBcIlwiLFxuICAgICAgICB9O1xuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLnN5bmNEYXRhID0ge1xuICAgICAgICBzdGF0ZTogc3RhdHVzLnN0YXRlLFxuICAgICAgICBuZWVkRmlsZXM6IHN0YXR1cy5uZWVkRmlsZXMsXG4gICAgICAgIG5lZWRCeXRlczogc3RhdHVzLm5lZWRCeXRlcyxcbiAgICAgICAgZm9sZGVyTGFiZWw6IGZvbGRlci5sYWJlbCB8fCBmb2xkZXIuaWQsXG4gICAgICAgIGVycm9yczogKHN0YXR1cy5lcnJvcnMgPz8gMCkgKyAoc3RhdHVzLnB1bGxFcnJvcnMgPz8gMCksXG4gICAgICAgIGRldmljZXM6IHJvd3MsXG4gICAgICB9O1xuICAgICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnN5bmNFcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclN5bmMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1lOQykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2Qtc3luYy1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJTSU5DUk9OSVpBXHUwMEM3XHUwMEMzT1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5LnRyaW0oKTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICBjb25zdCByZWZyZXNoID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlZnJlc2hcIiArICh0aGlzLnN5bmNMb2FkaW5nID8gXCIgd2Qtc3BpblwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHJlZnJlc2gsIFwicmVmcmVzaC1jd1wiKTtcbiAgICAgIHJlZnJlc2guc2V0QXR0cihcInRpdGxlXCIsIFwiQXR1YWxpemFyIGVzdGFkbyBkbyBTeW5jdGhpbmdcIik7XG4gICAgICBjbGlja2FibGUocmVmcmVzaCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH0pO1xuICAgIH1cblxuICAgIGlmICgha2V5KSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29uZmlndXJlIGEgVVJMIGUgYSBBUEkga2V5IGRvIFN5bmN0aGluZyBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkLlwiIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zeW5jRXJyb3IpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHkgd2QtdG9kby1lcnJvclwiLCB0ZXh0OiBgRXJybyBhbyBmYWxhciBjb20gbyBTeW5jdGhpbmc6ICR7dGhpcy5zeW5jRXJyb3J9YCB9KTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN5bmNGZXRjaGVkQXQpIHtcbiAgICAgIGlmICghdGhpcy5zeW5jTG9hZGluZykgdm9pZCB0aGlzLmZldGNoU3luYyhmYWxzZSk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ2FycmVnYW5kb1x1MjAyNlwiIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlclN5bmNCb2R5KHNlYywgdGhpcy5zeW5jRGF0YSEpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyQ29uZmxpY3RzKHNlYyk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclN5bmNCb2R5KHNlYzogSFRNTEVsZW1lbnQsIGQ6IFN5bmNEYXRhKSB7XG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWJveFwiIH0pO1xuXG4gICAgLy8gRXN0YWRvIGRhIHBhc3RhLlxuICAgIGNvbnN0IGJ1c3kgPSBkLnN0YXRlID09PSBcInN5bmNpbmdcIiB8fCBkLnN0YXRlID09PSBcInNjYW5uaW5nXCI7XG4gICAgY29uc3QgZmwgPSBib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtZm9sZGVyXCIgfSk7XG4gICAgY29uc3QgZG90ID0gZmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRvdCBcIiArIChkLmVycm9ycyA/IFwid2Qtcy1lcnJcIiA6IGJ1c3kgPyBcIndkLXMtYnVzeVwiIDogXCJ3ZC1zLW9rXCIpIH0pO1xuICAgIGRvdC5zZXRUZXh0KGQuZXJyb3JzID8gXCJcdTI2QTBcIiA6IGJ1c3kgPyBcIlx1MjdGM1wiIDogXCJcdTI1Q0ZcIik7XG4gICAgZmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWZuYW1lXCIsIHRleHQ6IGQuZm9sZGVyTGFiZWwgfSk7XG4gICAgY29uc3Qgc3QgPSBkLnN0YXRlID09PSBcImlkbGVcIiA/IFwiZW0gZGlhXCIgOiBkLnN0YXRlID09PSBcInN5bmNpbmdcIiA/IGBzaW5jcm9uaXphbmRvIFx1MjAxNCAke2QubmVlZEZpbGVzfSBpdGVucyAoJHtodW1hbkJ5dGVzKGQubmVlZEJ5dGVzKX0pYCA6IGQuc3RhdGU7XG4gICAgZmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWZzdGF0ZVwiLCB0ZXh0OiBzdCB9KTtcblxuICAgIC8vIEFwYXJlbGhvcy5cbiAgICBmb3IgKGNvbnN0IGRldiBvZiBkLmRldmljZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1kZXZcIiB9KTtcbiAgICAgIGNvbnN0IG8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRvdCBcIiArIChkZXYub25saW5lID8gXCJ3ZC1zLW9rXCIgOiBcIndkLXMtb2ZmXCIpIH0pO1xuICAgICAgby5zZXRUZXh0KFwiXHUyNUNGXCIpO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kbmFtZVwiLCB0ZXh0OiBkZXYubmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZGNvbXBcIiwgdGV4dDogYCR7TWF0aC5yb3VuZChkZXYuY29tcGxldGlvbil9JWAgfSk7XG4gICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyAmJiBkZXYuZ2xvYmFsSXRlbXMpXG4gICAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZGNvdW50XCIsIHRleHQ6IGAke2Rldi5nbG9iYWxJdGVtcyAtIGRldi5uZWVkSXRlbXN9LyR7ZGV2Lmdsb2JhbEl0ZW1zfWAgfSk7XG4gICAgICBjb25zdCBleHRyYSA9IGRldi5uZWVkRGVsZXRlcyA/IGAke2Rldi5uZWVkRGVsZXRlc30gZXhjbHVzXHUwMEY1ZXNgIDogZGV2Lm5lZWRCeXRlcyA/IGh1bWFuQnl0ZXMoZGV2Lm5lZWRCeXRlcykgOiBcIlwiO1xuICAgICAgaWYgKGV4dHJhKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRwZW5kXCIsIHRleHQ6IGV4dHJhIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kc2VlblwiLCB0ZXh0OiBkZXYub25saW5lID8gXCJvbmxpbmVcIiA6IHJlbFRpbWUoZGV2Lmxhc3RTZWVuKSB9KTtcbiAgICB9XG5cbiAgICBpZiAoZC5lcnJvcnMpIGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1lcnJsaW5lXCIsIHRleHQ6IGBcdTI2QTAgJHtkLmVycm9yc30gZXJybyhzKSBuYSBwYXN0YWAgfSk7XG4gIH1cblxuICAvLyBMaXN0YSBkZSBjXHUwMEYzcGlhcyBkZSBjb25mbGl0byBkbyBTeW5jdGhpbmcgKGFicmlyIC8gYXBhZ2FyIGNvbSBjb25maXJtYVx1MDBFN1x1MDBFM28pLlxuICBwcml2YXRlIHJlbmRlckNvbmZsaWN0cyhzZWM6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgY29uZmxpY3RzID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZXMoKS5maWx0ZXIoZiA9PiBmLm5hbWUuaW5jbHVkZXMoXCIuc3luYy1jb25mbGljdC1cIikpO1xuICAgIGNvbnN0IHdyYXAgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY29uZmxpY3RzXCIgfSk7XG4gICAgd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1zdWJcIiwgdGV4dDogYENvbmZsaXRvcyAoJHtjb25mbGljdHMubGVuZ3RofSlgIH0pO1xuICAgIGlmICghY29uZmxpY3RzLmxlbmd0aCkge1xuICAgICAgd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1ub2NvbmZcIiwgdGV4dDogXCJOZW5odW0gY29uZmxpdG8uIFx1RDgzQ1x1REY4OVwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGYgb2YgY29uZmxpY3RzKSB7XG4gICAgICBjb25zdCByb3cgPSB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWNyb3dcIiB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNuYW1lXCIsIHRleHQ6IGYubmFtZSB9KTtcbiAgICAgIG5hbWUuc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgXCIgKyBmLnBhdGgpO1xuICAgICAgY2xpY2thYmxlKG5hbWUsICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKSk7XG4gICAgICBpZiAodGhpcy5jb25mbGljdENvbmZpcm0gPT09IGYucGF0aCkge1xuICAgICAgICBjb25zdCB5ZXMgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWN5ZXNcIiwgdGV4dDogXCJhcGFnYXI/XCIgfSk7XG4gICAgICAgIGNsaWNrYWJsZSh5ZXMsIGFzeW5jICgpID0+IHsgYXdhaXQgdGhpcy5hcHAudmF1bHQudHJhc2goZiwgZmFsc2UpOyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IG51bGw7IHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7IH0pO1xuICAgICAgICBjb25zdCBubyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25vXCIsIHRleHQ6IFwiY2FuY2VsYXJcIiB9KTtcbiAgICAgICAgY2xpY2thYmxlKG5vLCAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkZWwgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNkZWxcIiB9KTtcbiAgICAgICAgc2V0SWNvbihkZWwsIFwidHJhc2gtMlwiKTtcbiAgICAgICAgZGVsLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFwYWdhciBjXHUwMEYzcGlhIGRlIGNvbmZsaXRvICh2YWkgcGFyYSBhIGxpeGVpcmEpXCIpO1xuICAgICAgICBjbGlja2FibGUoZGVsLCAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gZi5wYXRoOyB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhZGVyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiU2Vjb25kIEJyYWluXCIgfSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcbiAgLy8gQ29udHJvbGFkb3IgXHUwMEZBbmljbyBkbyBUb2RvaXN0IChlc3RhZG8gY29tcGFydGlsaGFkbyBlbnRyZSBkYXNoYm9hcmQgZSBhYmEpLlxuICB0b2RvITogVG9kb2lzdENvbnRyb2xsZXI7XG4gIC8vIENvbnRyb2xhZG9yIFx1MDBGQW5pY28gZGEgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIChsb2cgZG8gY29mcmUgKyBzdGF0czsgdjAuMTMpLlxuICBnYW1lITogR2FtZUNvbnRyb2xsZXI7XG4gIC8vIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKTogbW9udGFkbyAxeCBwb3IgY2ljbG8sIGludmFsaWRhZG8gbm9zIGV2ZW50b3MgZG8gdmF1bHQuXG4gIHByaXZhdGUgdmF1bHRDYWNoZTogVmF1bHRDYWNoZSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIEFncmVnYWRvcyBkbyBjb2ZyZSAodW1hIHBhc3NhZGEpLCByZXVzYWRvcyBwb3IgdG9kYXMgYXMgc2VcdTAwRTdcdTAwRjVlcyBubyByZW5kZXIuXG4gIGdldFZhdWx0Q2FjaGUoKTogVmF1bHRDYWNoZSB7XG4gICAgaWYgKCF0aGlzLnZhdWx0Q2FjaGUpIHRoaXMudmF1bHRDYWNoZSA9IGJ1aWxkVmF1bHRDYWNoZSh0aGlzLmFwcCk7XG4gICAgcmV0dXJuIHRoaXMudmF1bHRDYWNoZTtcbiAgfVxuICBpbnZhbGlkYXRlVmF1bHRDYWNoZSgpIHsgdGhpcy52YXVsdENhY2hlID0gbnVsbDsgfVxuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgIHRoaXMudG9kbyA9IG5ldyBUb2RvaXN0Q29udHJvbGxlcih0aGlzLmFwcCwgdGhpcywgdGhpcyk7XG4gICAgdGhpcy5nYW1lID0gbmV3IEdhbWVDb250cm9sbGVyKHRoaXMuYXBwLCB0aGlzKTtcbiAgICAvLyBBdXRvLXJlZnJlc2ggZG8gVG9kb2lzdDogdmVyaWZpY2EgYSBjYWRhIG1pbnV0bzsgc1x1MDBGMyBidXNjYSBzZSBoXHUwMEUxIHZpZXcgYWJlcnRhIGUgb1xuICAgIC8vIGNhY2hlIHBhc3NvdSBkbyBUVEwgKDUgbWluKS4gcmVnaXN0ZXJJbnRlcnZhbCBsaW1wYSBvIHRpbWVyIG5vIHVubG9hZC5cbiAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwod2luZG93LnNldEludGVydmFsKCgpID0+IHRoaXMudG9kby5tYXliZVJlZnJlc2goKSwgNjBfMDAwKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFLCBsZWFmID0+IG5ldyBEYXNoYm9hcmRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhUT0RPSVNUX1ZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgVG9kb2lzdFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KEdBTUVfVklFV19UWVBFLCBsZWFmID0+IG5ldyBHYW1pZmljYXRpb25WaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsYXlvdXQtZGFzaGJvYXJkXCIsIFwiQWJyaXIgV2VydXMgRGFzaGJvYXJkXCIsICgpID0+IHRoaXMub3BlbigpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsaXN0LWNoZWNrc1wiLCBcIkFicmlyIFRvZG9pc3QgKFdlcnVzKVwiLCAoKSA9PiB0aGlzLm9wZW5Ub2RvaXN0KCkpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInRyb3BoeVwiLCBcIkFicmlyIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAoV2VydXMpXCIsICgpID0+IHRoaXMub3BlbkdhbWUoKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1kYXNoYm9hcmRcIiwgbmFtZTogXCJBYnJpciBEYXNoYm9hcmRcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbigpIH0pO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tdG9kb2lzdFwiLCBuYW1lOiBcIkFicmlyIFRvZG9pc3RcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlblRvZG9pc3QoKSB9KTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLWdhbWVcIiwgbmFtZTogXCJBYnJpciBHYW1pZmljYVx1MDBFN1x1MDBFM29cIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbkdhbWUoKSB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdlcnVzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICAgIC8vIENhcnJlZ2EgbyBsb2cgZG8gY29mcmUgU1x1MDBEMyBkZXBvaXMgZG8gdmF1bHQgaW5kZXhhcjogbm8gb25sb2FkLCBnZXRBYnN0cmFjdEZpbGVCeVBhdGhcbiAgICAvLyBkZXZvbHZlIG51bGwgcGFyYSB1bSBhcnF1aXZvIHF1ZSBleGlzdGUgXHUyMTkyIGNhY2hlYXZhIGV2ZW50cz1bXSAoemVyYXZhIG5vIHJlbG9hZCkuXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4ge1xuICAgICAgdGhpcy5nYW1lLmludmFsaWRhdGUoKTtcbiAgICAgIHZvaWQgdGhpcy5nYW1lLmVuc3VyZUxvYWRlZCgpLnRoZW4oKCkgPT4gdGhpcy5nYW1lLnJlcmVuZGVyQWxsKCkpO1xuICAgIH0pO1xuICAgIC8vIFJlLXJlbmRlcml6YSBxdWFuZG8gbyBsb2cgbXVkYSAoaW5jbHVzaXZlIG5vc3NhcyBncmF2YVx1MDBFN1x1MDBGNWVzKS5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJtb2RpZnlcIiwgZiA9PiB7XG4gICAgICBpZiAoZi5wYXRoID09PSBHQU1FX0xPR19QQVRIIHx8IGYucGF0aCA9PT0gdGhpcy5zZXR0aW5ncy5nYW1lUnVsZXNQYXRoIHx8IGYucGF0aCA9PT0gTEVHQUNZX0FDSF9QQVRIKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnZhbGlkYXRlKCk7IHZvaWQgdGhpcy5nYW1lLmVuc3VyZUxvYWRlZCgpLnRoZW4oKCkgPT4gdGhpcy5nYW1lLnJlcmVuZGVyQWxsKCkpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIC8vIFRvZGFzIGFzIHZpZXdzIChkYXNoYm9hcmQgKyBhYmEgVG9kb2lzdCkgYWJlcnRhcywgcXVlIHRcdTAwRUFtIGNvbnRyb2xhZG9yIFRvZG9pc3QuXG4gIHByaXZhdGUgdG9kb1ZpZXdzKCk6IChEYXNoYm9hcmRWaWV3IHwgVG9kb2lzdFZpZXcpW10ge1xuICAgIGNvbnN0IG91dDogKERhc2hib2FyZFZpZXcgfCBUb2RvaXN0VmlldylbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiBbVklFV19UWVBFLCBUT0RPSVNUX1ZJRVdfVFlQRV0pXG4gICAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSh0KSkge1xuICAgICAgICBjb25zdCB2ID0gbGVhZi52aWV3O1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcgfHwgdiBpbnN0YW5jZW9mIFRvZG9pc3RWaWV3KSBvdXQucHVzaCh2KTtcbiAgICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgLy8gUmUtYnVzY2EgbyBUb2RvaXN0IChjb250cm9sbGVyIFx1MDBGQW5pY28gXHUyMTkyIG5vdGlmaWNhIHRvZGFzIGFzIHZpZXdzIGluc2NyaXRhcykuXG4gIHJlZnJlc2hEYXNoYm9hcmRzKCkge1xuICAgIHRoaXMudG9kby5yZXNldCgpO1xuICB9XG5cbiAgLy8gUmVzZXRhIG8gZXN0YWRvIGRvIFN5bmN0aGluZyBuYXMgZGFzaGJvYXJkcyAoZXguOiB0b2tlbi9VUkwgYWx0ZXJhZG9zKS5cbiAgcmVmcmVzaFN5bmMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFN5bmMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZS1yZW5kZXJpemEgdG9kYXMgYXMgdmlld3MgYWJlcnRhcyAoYXBcdTAwRjNzIG11ZGFyIGNvbmZpZyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXM6IG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcywgcGFjb3RlcykuXG4gIHJlcmVuZGVyRGFzaGJvYXJkcygpIHtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdGhpcy50b2RvVmlld3MoKSkgdi5yZWZyZXNoKCk7XG4gIH1cblxuICAvLyBNb3N0cmEvb2N1bHRhIHVtYSBzZVx1MDBFN1x1MDBFM28gKFwic2VjOjxpZD5cIikgb3UgcGFzdGEgKGNhbWluaG8pIHBvciBjaGF2ZSBlbSBgaGlkZGVuYC5cbiAgYXN5bmMgc2V0SGlkZGVuKGtleTogc3RyaW5nLCBoaWRkZW46IGJvb2xlYW4pIHtcbiAgICBjb25zdCBoYXMgPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICAgIGlmIChoaWRkZW4gJiYgIWhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIGVsc2UgaWYgKCFoaWRkZW4gJiYgaGFzKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMuc2V0dGluZ3MuaGlkZGVuLmZpbHRlcihrID0+IGsgIT09IGtleSk7XG4gICAgZWxzZSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgLy8gUmVvcmRlbmEgdW1hIHNlXHUwMEU3XHUwMEUzbyBlbSBzZWN0aW9uT3JkZXIgKGRpciA9IC0xIHNvYmUsICsxIGRlc2NlKS5cbiAgYXN5bmMgbW92ZVNlY3Rpb24oaWQ6IFNlY3Rpb25JZCwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBvcmRlciA9IFsuLi50aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBvcmRlcjtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICBhc3luYyBtb3ZlUGFja2FnZShpbmRleDogbnVtYmVyLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGNvbnN0IGogPSBpbmRleCArIGRpcjtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGogPCAwIHx8IGogPj0gYXJyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFthcnJbaW5kZXhdLCBhcnJbal1dID0gW2FycltqXSwgYXJyW2luZGV4XV07XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgLy8gUHJvdmlzaW9uYSBvIFRvZG9pc3QgY29tIG9zIHByb2pldG9zL2V0aXF1ZXRhcyBkZWNsYXJhZG9zIG5hcyBSZWdyYXMgKGNyaWEgc1x1MDBGMyBvcyBxdWUgZmFsdGFtKS5cbiAgLy8gQXNzaW0gYSBjb211bmlkYWRlIGVzY3JldmUgYXMgcmVncmFzIGRvIGpvZ28gZSBvIGpvZ2Fkb3Igc1x1MDBGMyBjbGljYSBwYXJhIHByZXBhcmFyIHNldSBUb2RvaXN0LlxuICBhc3luYyBwcm92aXNpb25Ub2RvaXN0KCkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QgcHJpbWVpcm8uXCIpOyByZXR1cm47IH1cbiAgICBhd2FpdCB0aGlzLmdhbWUuZW5zdXJlTG9hZGVkKCk7XG4gICAgY29uc3QgeyBwcm9qZWN0cywgbGFiZWxzIH0gPSB0aGlzLmdhbWUucHJvdmlzaW9uTGlzdHMoKTtcbiAgICBpZiAoIXByb2plY3RzLmxlbmd0aCAmJiAhbGFiZWxzLmxlbmd0aCkge1xuICAgICAgbmV3IE5vdGljZShcIkFzIFJlZ3JhcyBuXHUwMEUzbyBsaXN0YW0gcHJvamV0b3MgbmVtIGV0aXF1ZXRhcy4gRWRpdGUgYSBub3RhIGRlIFJlZ3JhcyAoYm90XHUwMEUzbyBcdTI3MEZcdUZFMEYpLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGV4aXN0UHJvamVjdHM6IFNldDxzdHJpbmc+LCBleGlzdExhYmVsczogU2V0PHN0cmluZz47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFtwcywgbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW2ZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKSwgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKV0pO1xuICAgICAgZXhpc3RQcm9qZWN0cyA9IG5ldyBTZXQocHMubWFwKHAgPT4gcC5uYW1lKSk7XG4gICAgICBleGlzdExhYmVscyA9IG5ldyBTZXQobHMubWFwKGwgPT4gbC5uYW1lKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShcIkZhbGhhIGFvIGNvbnN1bHRhciBvIFRvZG9pc3Q6IFwiICsgKGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdQcm9qZWN0cyA9IHByb2plY3RzLmZpbHRlcihwID0+ICFleGlzdFByb2plY3RzLmhhcyhwKSk7XG4gICAgY29uc3QgbmV3TGFiZWxzID0gbGFiZWxzLmZpbHRlcihsID0+ICFleGlzdExhYmVscy5oYXMobC5uYW1lKSk7XG4gICAgaWYgKCFuZXdQcm9qZWN0cy5sZW5ndGggJiYgIW5ld0xhYmVscy5sZW5ndGgpIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJUb2RvcyBvcyBwcm9qZXRvcyBlIGV0aXF1ZXRhcyBkYXMgUmVncmFzIGpcdTAwRTEgZXhpc3RlbSBubyBUb2RvaXN0LiBcdTI3MDVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGl0ZW1zOiBDb25maXJtSXRlbVtdID0gW1xuICAgICAgLi4ubmV3UHJvamVjdHMubWFwKHAgPT4gKHsgdGV4dDogYFx1RDgzRFx1RENDMSAke3B9YCB9KSksXG4gICAgICAuLi5uZXdMYWJlbHMubWFwKGwgPT4gKHsgdGV4dDogYFx1RDgzQ1x1REZGN1x1RkUwRiAke2wubmFtZX1gIH0pKSxcbiAgICBdO1xuICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICB0aXRsZTogXCJQcm92aXNpb25hciBUb2RvaXN0XCIsXG4gICAgICBib2R5OiBgQ3JpYXIgJHtuZXdQcm9qZWN0cy5sZW5ndGh9IHByb2pldG8ocykgZSAke25ld0xhYmVscy5sZW5ndGh9IGV0aXF1ZXRhKHMpIG5vIFRvZG9pc3Q/YCxcbiAgICAgIGl0ZW1zLFxuICAgICAgY3RhOiBcIkNyaWFyXCIsXG4gICAgfSk7XG4gICAgaWYgKCFvaykgcmV0dXJuO1xuICAgIGxldCBkb25lID0gMCwgZmFpbGVkID0gMDtcbiAgICBmb3IgKGNvbnN0IHAgb2YgbmV3UHJvamVjdHMpIHsgdHJ5IHsgYXdhaXQgY3JlYXRlVG9kb2lzdFByb2plY3QodG9rZW4sIHApOyBkb25lKys7IH0gY2F0Y2ggeyBmYWlsZWQrKzsgfSB9XG4gICAgZm9yIChjb25zdCBsIG9mIG5ld0xhYmVscykgeyB0cnkgeyBhd2FpdCBjcmVhdGVUb2RvaXN0TGFiZWwodG9rZW4sIGwubmFtZSwgbC5jb2xvcik7IGRvbmUrKzsgfSBjYXRjaCB7IGZhaWxlZCsrOyB9IH1cbiAgICB0aGlzLnRvZG8ucmVzZXQoKTsgICAvLyByZWNhcnJlZ2EgcHJvamV0b3MvZXRpcXVldGFzIG5vIGNvbnRyb2xsZXIgKGF0dWFsaXphIGtub3duUHJvamVjdHMva25vd25MYWJlbHMpXG4gICAgbmV3IE5vdGljZShgUHJvdmlzaW9uYW1lbnRvOiAke2RvbmV9IGNyaWFkbyhzKWAgKyAoZmFpbGVkID8gYCwgJHtmYWlsZWR9IGZhbGhhKHMpYCA6IFwiXCIpICsgXCIuXCIpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIGxldCBuZWVkU3RNaWdyYXRpb24gPSBmYWxzZTsgICAvLyBjcmVkZW5jaWFpcyBTeW5jdGhpbmcgbWlncmFuZG8gZGF0YS5qc29uIFx1MjE5MiBsb2NhbFN0b3JhZ2VcbiAgICAvLyBTYW5lYW1lbnRvOiBzZWN0aW9uT3JkZXIgY29tIGV4YXRhbWVudGUgYXMgc2VcdTAwRTdcdTAwRjVlcyB2XHUwMEUxbGlkYXMsIHNlbSBkdXBsaWNhdGFzLlxuICAgIGNvbnN0IHZhbGlkOiBTZWN0aW9uSWRbXSA9IFtcInN0YXRzXCIsIFwiZ2FtZVwiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxTZWN0aW9uSWQ+KCk7XG4gICAgY29uc3QgY2xlYW5lZCA9ICh0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciB8fCBbXSkuZmlsdGVyKFxuICAgICAgKHMpOiBzIGlzIFNlY3Rpb25JZCA9PiB2YWxpZC5pbmNsdWRlcyhzIGFzIFNlY3Rpb25JZCkgJiYgIXNlZW4uaGFzKHMgYXMgU2VjdGlvbklkKSAmJiAoc2Vlbi5hZGQocyBhcyBTZWN0aW9uSWQpLCB0cnVlKVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbGlkKSBpZiAoIXNlZW4uaGFzKHYpKSBjbGVhbmVkLnB1c2godik7XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBjbGVhbmVkOyAgIC8vIFwicmVwb3J0c1wiIHNvbWUgYXF1aSBzZSBlc3RhdmEgbnVtYSBjb25maWcgYW50aWdhXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2V0dGluZ3MuaGlkZGVuKSkgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSBbXTtcbiAgICAvLyBGb250ZXMgZGEgU2VtYW5hICh2MC4xMC4xKTogdmFsaWRhIGEgbGlzdGE7IHNlIGF1c2VudGUvaW52XHUwMEUxbGlkYSwgdXNhIG8gZGVmYXVsdC5cbiAgICBjb25zdCBjcyA9IHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gQXJyYXkuaXNBcnJheShjcykgJiYgY3MubGVuZ3RoXG4gICAgICA/IGNzLmZpbHRlcihzID0+IHMgJiYgdHlwZW9mIHMucGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAubWFwKHMgPT4gKHsgcGF0aDogcy5wYXRoLCBjb2xvcjogdHlwZW9mIHMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBzLmNvbG9yIDogQUNDRU5UU1swXSwgb246IHMub24gIT09IGZhbHNlIH0pKVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLmNhbGVuZGFyU291cmNlcy5tYXAocyA9PiAoeyAuLi5zIH0pKTtcbiAgICAvLyBTYW5lYW1lbnRvIFRvZG9pc3QgKHYwLjcuMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICAgIGNvbnN0IHRmID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzID0ge1xuICAgICAgcHJvamVjdHM6IEFycmF5LmlzQXJyYXkodGY/LnByb2plY3RzKSA/IHRmLnByb2plY3RzIDogW10sXG4gICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkodGY/LmxhYmVscykgPyB0Zi5sYWJlbHMgOiBbXSxcbiAgICB9O1xuICAgIC8vIEV4aWJpXHUwMEU3XHUwMEUzbyBuYXMgbGluaGFzICh2MC44LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgIT09IGZhbHNlO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID09PSB0cnVlO1xuICAgIC8vIFN5bmN0aGluZyAodjAuMTAuMCkgXHUyMDE0IGNyZWRlbmNpYWlzIHNcdTAwRTNvIFBPUi1ESVNQT1NJVElWTzogdml2ZW0gbm8gbG9jYWxTdG9yYWdlXG4gICAgLy8gKG5cdTAwRTNvIHNpbmNyb25pemFtIHBlbG8gZGF0YS5qc29uKS4gTWlncmFcdTAwRTdcdTAwRTNvICgxeCk6IHNlIG8gbG9jYWxTdG9yYWdlIGFpbmRhIG5cdTAwRTNvXG4gICAgLy8gdGVtLCBoZXJkYSBvIHZhbG9yIHF1ZSBlc3RhdmEgbm8gZGF0YS5qc29uIGUgcmVncmF2YSAodmVyIGZpbSBkbyBtXHUwMEU5dG9kbykuXG4gICAgY29uc3QgbHNHZXQgPSAoazogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBjb25zdCB2ID0gdGhpcy5hcHAubG9hZExvY2FsU3RvcmFnZShrKTtcbiAgICAgIHJldHVybiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiA/IHYgOiBudWxsO1xuICAgIH07XG4gICAgY29uc3QgZGF0YVVybCA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybC50cmltKClcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgOiBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgIGNvbnN0IGRhdGFLZXkgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA6IFwiXCI7XG4gICAgY29uc3QgZGF0YUZvbGRlciA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID09PSBcInN0cmluZ1wiID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA6IFwiXCI7XG4gICAgbmVlZFN0TWlncmF0aW9uID0gbHNHZXQoTFNfU1RfVVJMKSA9PT0gbnVsbCAmJiBsc0dldChMU19TVF9LRVkpID09PSBudWxsICYmIGxzR2V0KExTX1NUX0ZPTERFUikgPT09IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSBsc0dldChMU19TVF9VUkwpID8/IGRhdGFVcmw7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPSBsc0dldChMU19TVF9LRVkpID8/IGRhdGFLZXk7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9IGxzR2V0KExTX1NUX0ZPTERFUikgPz8gZGF0YUZvbGRlcjtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPT09IHRydWU7XG4gICAgLy8gUGFjb3RlcyBkZSB0YXJlZmFzICh2MC4xMi4wKS5cbiAgICBjb25zdCB0cCA9IHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzID0gQXJyYXkuaXNBcnJheSh0cClcbiAgICAgID8gdHAuZmlsdGVyKHAgPT4gcCAmJiB0eXBlb2YgcC5pZCA9PT0gXCJzdHJpbmdcIikubWFwKHAgPT4gKHtcbiAgICAgICAgICBpZDogcC5pZCxcbiAgICAgICAgICBuYW1lOiB0eXBlb2YgcC5uYW1lID09PSBcInN0cmluZ1wiID8gcC5uYW1lIDogXCJcIixcbiAgICAgICAgICBpY29uOiB0eXBlb2YgcC5pY29uID09PSBcInN0cmluZ1wiICYmIHAuaWNvbi50cmltKCkgPyBwLmljb24gOiB1bmRlZmluZWQsXG4gICAgICAgICAgdGFza3M6IEFycmF5LmlzQXJyYXkocC50YXNrcykgPyBwLnRhc2tzLmZpbHRlcih4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSA6IFtdLFxuICAgICAgICAgIHByb2plY3RJZDogdHlwZW9mIHAucHJvamVjdElkID09PSBcInN0cmluZ1wiICYmIHAucHJvamVjdElkID8gcC5wcm9qZWN0SWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHAubGFiZWxzKSA/IHAubGFiZWxzLmZpbHRlcih4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSkpXG4gICAgICA6IFtdO1xuICAgIHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gPSBbXCJhbHdheXNcIiwgXCJtYW55XCIsIFwibmV2ZXJcIl0uaW5jbHVkZXModGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSlcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA6IFwibWFueVwiO1xuICAgIC8vIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyAodjAuMTMpLlxuICAgIHRoaXMuc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZCA9IHRoaXMuc2V0dGluZ3MuZ2FtaWZpY2F0aW9uRW5hYmxlZCAhPT0gZmFsc2U7XG4gICAgY29uc3QgcGYgPSBOdW1iZXIodGhpcy5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3Rvcik7XG4gICAgdGhpcy5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvciA9IE51bWJlci5pc0Zpbml0ZShwZikgJiYgcGYgPiAwID8gcGYgOiAxLjU7XG4gICAgdGhpcy5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5nYW1lTGFzdEhhcnZlc3QgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLmdhbWVMYXN0SGFydmVzdCA6IFwiXCI7XG4gICAgdGhpcy5zZXR0aW5ncy5nYW1lQ2hhcnRNb2RlID0gdGhpcy5zZXR0aW5ncy5nYW1lQ2hhcnRNb2RlID09PSBcImxpbmVcIiA/IFwibGluZVwiIDogXCJiYXJzXCI7XG4gICAgdGhpcy5zZXR0aW5ncy5ncm93dGhDaGFydE1vZGUgPSB0aGlzLnNldHRpbmdzLmdyb3d0aENoYXJ0TW9kZSA9PT0gXCJsaW5lXCIgPyBcImxpbmVcIiA6IFwiYmFyc1wiO1xuICAgIGNvbnN0IGdhID0gdGhpcy5zZXR0aW5ncy5nYW1lQWNoaWV2ZW1lbnRzO1xuICAgIHRoaXMuc2V0dGluZ3MuZ2FtZUFjaGlldmVtZW50cyA9IGdhICYmIHR5cGVvZiBnYSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShnYSkgPyBnYSA6IHt9O1xuICAgIHRoaXMuc2V0dGluZ3MuZ2FtZVJ1bGVzUGF0aCA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLmdhbWVSdWxlc1BhdGggPT09IFwic3RyaW5nXCIgJiYgdGhpcy5zZXR0aW5ncy5nYW1lUnVsZXNQYXRoLnRyaW0oKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLmdhbWVSdWxlc1BhdGgudHJpbSgpIDogREVGQVVMVF9SVUxFU19QQVRIO1xuXG4gICAgLy8gTWlncmFcdTAwRTdcdTAwRTNvIDF4OiBncmF2YSBhcyBjcmVkZW5jaWFpcyBubyBsb2NhbFN0b3JhZ2UgZSBhcyByZW1vdmUgZG8gZGF0YS5qc29uLlxuICAgIGlmIChuZWVkU3RNaWdyYXRpb24pIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgLy8gQ3JlZGVuY2lhaXMgZG8gU3luY3RoaW5nIHNcdTAwRTNvIHBvci1kaXNwb3NpdGl2byBcdTIxOTIgbG9jYWxTdG9yYWdlIChuXHUwMEUzbyBzaW5jcm9uaXphKS5cbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX1VSTCwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwpO1xuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfS0VZLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSk7XG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9GT0xERVIsIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQpO1xuICAgIC8vIE8gZGF0YS5qc29uIChzaW5jcm9uaXphZG8gcGVsbyBTeW5jdGhpbmcpIE5cdTAwQzNPIGxldmEgYXMgY3JlZGVuY2lhaXMuXG4gICAgY29uc3Qgc2hhcmVkOiBQYXJ0aWFsPERhc2hTZXR0aW5ncz4gPSB7IC4uLnRoaXMuc2V0dGluZ3MgfTtcbiAgICBkZWxldGUgc2hhcmVkLnN5bmN0aGluZ1VybDtcbiAgICBkZWxldGUgc2hhcmVkLnN5bmN0aGluZ0FwaUtleTtcbiAgICBkZWxldGUgc2hhcmVkLnN5bmN0aGluZ0ZvbGRlcklkO1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEoc2hhcmVkKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW4oKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEUpWzBdO1xuICAgIGlmICghbGVhZikgeyBsZWFmID0gd29ya3NwYWNlLmdldExlYWYoZmFsc2UpOyBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IFZJRVdfVFlQRSwgYWN0aXZlOiB0cnVlIH0pOyB9XG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBhc3luYyBvcGVuVG9kb2lzdCgpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFRPRE9JU1RfVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBUT0RPSVNUX1ZJRVdfVFlQRSwgYWN0aXZlOiB0cnVlIH0pOyB9XG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBhc3luYyBvcGVuR2FtZSgpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKEdBTUVfVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBHQU1FX1ZJRVdfVFlQRSwgYWN0aXZlOiB0cnVlIH0pOyB9XG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBvbnVubG9hZCgpIHtcbiAgICAvLyBWYXJyZSBlbGVtZW50b3MgZmx1dHVhbnRlcyBxdWUgdml2ZW0gbm8gZG9jdW1lbnQuYm9keSAodG9vbHRpcHMvcG9wb3ZlcnMpOiBzZSBvXG4gICAgLy8gcGx1Z2luIGZvciBkZXNhYmlsaXRhZG8gY29tIHVtIGFiZXJ0bywgbyBvbkNsb3NlIGRhIHZpZXcgcG9kZSBuXHUwMEUzbyByb2Rhci5cbiAgICB0aGlzLnRvZG8/LmhpZGVUaXAoKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndkLXRvb2x0aXAsIC53ZC1wb3BcIikuZm9yRWFjaChlID0+IGUucmVtb3ZlKCkpO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGVkaWNhZGEgZG8gVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIEh1YiBkbyBUb2RvaXN0IG5hIFx1MDBFMXJlYSBjZW50cmFsIChuXHUwMEUzbyBcdTAwRTkgc2lkZWJhcik6IGxhblx1MDBFN2Fkb3IgZGUgcGFjb3RlcyArIGEgbWVzbWFcbi8vIGxpc3RhIGRlIHRhcmVmYXMgZG8gZGFzaGJvYXJkICh2aWEgVG9kb2lzdENvbnRyb2xsZXIgY29tcGFydGlsaGFkbykuXG5jbGFzcyBUb2RvaXN0VmlldyBleHRlbmRzIFdkVmlldyB7XG4gIHByaXZhdGUgdW5zdWJUb2RvOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVE9ET0lTVF9WSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIlRvZG9pc3RcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGlzdC1jaGVja3NcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLnVuc3ViVG9kbyA9IHRoaXMucGx1Z2luLnRvZG8uc3Vic2NyaWJlKCgpID0+IHRoaXMucmVmcmVzaCgpKTtcbiAgICB0aGlzLmluaXRQaG9uZVdhdGNoKCk7XG4gIH1cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG4gIHByb3RlY3RlZCByZXJlbmRlcigpIHsgdGhpcy5yZWZyZXNoKCk7IH1cblxuICByZWZyZXNoKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIiwgXCJ3ZC10b2RvaXN0LXZpZXdcIik7XG4gICAgdGhpcy5waG9uZSA9IGlzUGhvbmVXaWR0aCh0aGlzLmNvbnRlbnRFbCk7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLXBob25lXCIsIHRoaXMucGhvbmUpO1xuXG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiVG9kb2lzdFwiIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJQYWNrYWdlcyhyb290LCB7IGhlYWRpbmc6IHRydWUgfSk7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMpO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGVkaWNhZGEgZGUgR2FtaWZpY2FcdTAwRTdcdTAwRTNvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY2xhc3MgR2FtaWZpY2F0aW9uVmlldyBleHRlbmRzIFdkVmlldyB7XG4gIHByaXZhdGUgdW5zdWI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBHQU1FX1ZJRVdfVFlQRTsgfVxuICBnZXREaXNwbGF5VGV4dCgpIHsgcmV0dXJuIFwiR2FtaWZpY2FcdTAwRTdcdTAwRTNvXCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcInRyb3BoeVwiOyB9XG5cbiAgYXN5bmMgb25PcGVuKCkge1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIHRoaXMudW5zdWIgPSB0aGlzLnBsdWdpbi5nYW1lLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlZnJlc2goKSk7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uZ2FtZS5lbnN1cmVMb2FkZWQoKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB2b2lkIHRoaXMucGx1Z2luLmdhbWUucmVmcmVzaFBlbmRpbmcoKTtcbiAgICB0aGlzLmluaXRQaG9uZVdhdGNoKCk7XG4gIH1cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViPy4oKTtcbiAgICB0aGlzLnVuc3ViID0gbnVsbDtcbiAgfVxuICBwcm90ZWN0ZWQgcmVyZW5kZXIoKSB7IHRoaXMucmVmcmVzaCgpOyB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHJvb3QuYWRkQ2xhc3MoXCJ3ZC1yb290XCIsIFwid2QtZ2FtZS12aWV3XCIpO1xuICAgIHRoaXMucGhvbmUgPSBpc1Bob25lV2lkdGgodGhpcy5jb250ZW50RWwpO1xuICAgIHJvb3QudG9nZ2xlQ2xhc3MoXCJ3ZC1waG9uZVwiLCB0aGlzLnBob25lKTtcblxuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIkdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiIH0pO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1nYW1lLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlBST0dSRVNTT1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5wbHVnaW4uZ2FtZS5yZW5kZXJQYW5lbChzZWMsIGN0cmxzLCB7IGZ1bGw6IHRydWUsIHBob25lOiB0aGlzLnBob25lIH0pO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNb2RhbCBkZSBjb25maXJtYVx1MDBFN1x1MDBFM28gZ2VuXHUwMEU5cmljbyAocmVzb2x2ZSB0cnVlL2ZhbHNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIENvbmZpcm1JdGVtIHtcbiAgdGV4dDogc3RyaW5nO1xuICBsYWJlbHM/OiB7IG5hbWU6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9W107ICAgLy8gY2hpcHMgb3BjaW9uYWlzIChldGlxdWV0YXMpXG59XG5cbmludGVyZmFjZSBDb25maXJtT3B0cyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGJvZHk6IHN0cmluZztcbiAgaXRlbXM/OiBDb25maXJtSXRlbVtdOyAgIC8vIGxpc3RhIG9wY2lvbmFsIChleC46IHRhcmVmYXMgYSBjcmlhcilcbiAgY3RhOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHJcdTAwRjN0dWxvIGRvIGJvdFx1MDBFM28gZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvXG59XG5cbmNsYXNzIENvbmZpcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBkb25lID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IENvbmZpcm1PcHRzLCBwcml2YXRlIHJlc29sdmU6IChvazogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgIHN1cGVyKGFwcCk7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmFkZENsYXNzKFwid2QtY29uZmlybVwiKTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IHRoaXMub3B0cy50aXRsZSB9KTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgdGV4dDogdGhpcy5vcHRzLmJvZHkgfSk7XG4gICAgaWYgKHRoaXMub3B0cy5pdGVtcz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCB1bCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInVsXCIsIHsgY2xzOiBcIndkLWNvbmZpcm0tbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLm9wdHMuaXRlbXMpIHtcbiAgICAgICAgY29uc3QgbGkgPSB1bC5jcmVhdGVFbChcImxpXCIpO1xuICAgICAgICBsaS5jcmVhdGVTcGFuKHsgdGV4dDogaXQudGV4dCB9KTtcbiAgICAgICAgZm9yIChjb25zdCBsIG9mIGl0LmxhYmVscyA/PyBbXSkge1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsaS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvbmZpcm0tbGFiZWxcIiB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IGwuY29sb3I7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2wubmFtZX1gIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgb2sgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIm1vZC1jdGFcIiwgdGV4dDogdGhpcy5vcHRzLmN0YSB9KTtcbiAgICBvay5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmRvbmUgPSB0cnVlOyB0aGlzLmNsb3NlKCk7IH07XG4gIH1cblxuICBvbkNsb3NlKCkge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5yZXNvbHZlKHRoaXMuZG9uZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uZmlybU1vZGFsKGFwcDogQXBwLCBvcHRzOiBDb25maXJtT3B0cyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBuZXcgQ29uZmlybU1vZGFsKGFwcCwgb3B0cywgcmVzb2x2ZSkub3BlbigpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBvcC11cCBkZSBkZXRhbGhlcyBkYSB0YXJlZmEgKHNcdTAwRjMgbGVpdHVyYTsgYm90XHUwMEUzbyBFZGl0YXIgYWJyZSBvIGZvcm11bFx1MDBFMXJpbykgXHUyNTAwXG5cbmludGVyZmFjZSBUYXNrRGV0YWlsT3B0cyB7XG4gIHRhc2s6IFRvZG9pc3RUYXNrO1xuICBwcm9qZWN0TmFtZT86IHN0cmluZztcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBlZGl0OiAoKSA9PiB2b2lkO1xuICBjb21wbGV0ZTogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0RldGFpbE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBjb21wb25lbnQ6IENvbXBvbmVudCwgcHJpdmF0ZSBvcHRzOiBUYXNrRGV0YWlsT3B0cykgeyBzdXBlcihhcHApOyB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHQgPSB0aGlzLm9wdHMudGFzaztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1tb2RhbFwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodC5jb250ZW50KTtcblxuICAgIGNvbnN0IG1ldGEgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRkLW1ldGFcIiB9KTtcbiAgICBjb25zdCBwcmkgPSBwcmlNZXRhKHQucHJpb3JpdHkpO1xuICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKGRrKSB7XG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcFwiLCB0ZXh0OiBgXHVEODNEXHVEQ0M1ICR7ZH0vJHttfS8ke3l9JHt0LmR1ZT8uaXNfcmVjdXJyaW5nID8gXCIgXHUyN0YzXCIgOiBcIlwifWAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdHMucHJvamVjdE5hbWUpIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGAjICR7dGhpcy5vcHRzLnByb2plY3ROYW1lfWAgfSk7XG4gICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB7XG4gICAgICBjb25zdCBjaGlwID0gbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXAgd2QtdGQtbGFiZWxcIiB9KTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgIH1cblxuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBib2R5ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWRlc2MgbWFya2Rvd24tcmVuZGVyZWRcIiB9KTtcbiAgICAgIHZvaWQgTWFya2Rvd25SZW5kZXJlci5yZW5kZXIodGhpcy5hcHAsIHQuZGVzY3JpcHRpb24hLnRyaW0oKSwgYm9keSwgXCJcIiwgdGhpcy5jb21wb25lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZW1wdHlcIiwgdGV4dDogXCJFc3RhIHRhcmVmYSBuXHUwMEUzbyB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzby5cIiB9KTtcbiAgICB9XG5cbiAgICAvLyBFZGl0YXIgKGVzcXVlcmRhKSBcdTAwQjcgQ29uY2x1aXIgKyBBYnJpciBubyBUb2RvaXN0IChkaXJlaXRhKS5cbiAgICBjb25zdCBhY3Rpb25zID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWFjdGlvbnNcIiB9KTtcbiAgICBjb25zdCBlZGl0ID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzBFIEVkaXRhclwiIH0pO1xuICAgIGVkaXQub25jbGljayA9ICgpID0+IHsgdGhpcy5jbG9zZSgpOyB0aGlzLm9wdHMuZWRpdCgpOyB9O1xuICAgIGFjdGlvbnMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGRvbmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MTMgQ29uY2x1aXJcIiB9KTtcbiAgICBkb25lLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMub3B0cy5jb21wbGV0ZSgpOyB0aGlzLmNsb3NlKCk7IH07XG4gICAgY29uc3Qgb3BlbiA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkFicmlyIG5vIFRvZG9pc3RcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHQpLCBcIl9ibGFua1wiKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEZvcm11bFx1MDBFMXJpbyBkZSB0YXJlZmEgKGNyaWFyIC8gZWRpdGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tGb3JtVmFsdWVzIHtcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSSAxLi40ICg0ID0gcDEpXG4gIGR1ZURhdGU6IHN0cmluZzsgICAgLy8gWVlZWS1NTS1ERCAoY2FsZW5kXHUwMEUxcmlvKTsgXCJcIiA9IHNlbSBkYXRhXG4gIHByb2plY3RJZDogc3RyaW5nO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgVGFza0Zvcm1PcHRzIHtcbiAgbW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiO1xuICB0YXNrPzogVG9kb2lzdFRhc2s7XG4gIHByZWZpbGxEdWU/OiBzdHJpbmc7XG4gIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIHN1Ym1pdDogKHY6IFRhc2tGb3JtVmFsdWVzKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICByZW1vdmU/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICBjb21wbGV0ZT86ICgpID0+IHZvaWQ7XG59XG5cbmNsYXNzIFRhc2tGb3JtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgdjogVGFza0Zvcm1WYWx1ZXM7XG4gIHByaXZhdGUga25vd25MYWJlbHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIGNvbmZpcm1EZWwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBhY3Rpb25zRWwhOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBvcHRzOiBUYXNrRm9ybU9wdHMpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIGNvbnN0IHQgPSBvcHRzLnRhc2s7XG4gICAgLy8gUHJlZmlsbCBkZSBjcmlhXHUwMEU3XHUwMEUzbzogXCJob2plXCIgXHUyMTkyIGRhdGEgZGUgaG9qZTsgalx1MDBFMS1ZWVlZLU1NLUREIHBhc3NhIGRpcmV0bzsgcmVzdG8gaWdub3JhLlxuICAgIGNvbnN0IHByZSA9IG9wdHMucHJlZmlsbER1ZTtcbiAgICBjb25zdCBwcmVmaWxsRGF0ZSA9IHByZSA9PT0gXCJob2plXCIgPyB0b0tleShuZXcgRGF0ZSgpKVxuICAgICAgOiAocHJlICYmIC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KHByZSkgPyBwcmUgOiBcIlwiKTtcbiAgICB0aGlzLnYgPSB7XG4gICAgICBjb250ZW50OiB0Py5jb250ZW50ID8/IFwiXCIsXG4gICAgICBkZXNjcmlwdGlvbjogdD8uZGVzY3JpcHRpb24gPz8gXCJcIixcbiAgICAgIHByaW9yaXR5OiB0Py5wcmlvcml0eSA/PyAxLFxuICAgICAgZHVlRGF0ZTogdD8uZHVlPy5kYXRlID8gdC5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogcHJlZmlsbERhdGUsXG4gICAgICBwcm9qZWN0SWQ6IHQ/LnByb2plY3RfaWQgPz8gXCJcIixcbiAgICAgIGxhYmVsczogKHQ/LmxhYmVscyA/PyBbXSkuc2xpY2UoKSxcbiAgICB9O1xuICAgIHRoaXMua25vd25MYWJlbHMgPSBbLi4ubmV3IFNldChbLi4ub3B0cy5sYWJlbHMsIC4uLnRoaXMudi5sYWJlbHNdKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCwgdGl0bGVFbCwgbW9kYWxFbCB9ID0gdGhpcztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1mb3JtXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0aGlzLm9wdHMubW9kZSA9PT0gXCJjcmVhdGVcIiA/IFwiTm92YSB0YXJlZmFcIiA6IFwiRWRpdGFyIHRhcmVmYVwiKTtcblxuICAgIC8vIFNcdTAwRjMgbmEgZWRpXHUwMEU3XHUwMEUzbzogYXRhbGhvIFwiQWJyaXIgbm8gVG9kb2lzdFwiIG5vIHRvcG8sIGFvIGxhZG8gZG8gWCBkZSBmZWNoYXIuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIiAmJiB0aGlzLm9wdHMudGFzaykge1xuICAgICAgY29uc3Qgb3BlbiA9IG1vZGFsRWwuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtdGYtb3Blbi10b3BcIiwgdGV4dDogXCJcdTIxOTcgVG9kb2lzdFwiIH0pO1xuICAgICAgb3Blbi5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBubyBUb2RvaXN0XCIpO1xuICAgICAgb3Blbi5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0aGlzLm9wdHMudGFzayEpLCBcIl9ibGFua1wiKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpZWxkKFwiVFx1MDBFRHR1bG9cIik7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0XCIsIHR5cGU6IFwidGV4dFwiIH0pO1xuICAgIGNvbnRlbnQudmFsdWUgPSB0aGlzLnYuY29udGVudDtcbiAgICBjb250ZW50LnBsYWNlaG9sZGVyID0gXCJPIHF1ZSBwcmVjaXNhIHNlciBmZWl0bz9cIjtcbiAgICBjb250ZW50Lm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5jb250ZW50ID0gY29udGVudC52YWx1ZTsgfTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRlbnQuZm9jdXMoKSwgMCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGVzY3JpXHUwMEU3XHUwMEUzb1wiKTtcbiAgICBjb25zdCBkZXNjID0gY29udGVudEVsLmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtdGYtdGV4dGFyZWFcIiB9KTtcbiAgICBkZXNjLnZhbHVlID0gdGhpcy52LmRlc2NyaXB0aW9uO1xuICAgIGRlc2MucGxhY2Vob2xkZXIgPSBcIkRldGFsaGVzIC8gaW5zdHJ1XHUwMEU3XHUwMEY1ZXMgKG1hcmtkb3duKVwiO1xuICAgIGRlc2Mucm93cyA9IDM7XG4gICAgZGVzYy5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuZGVzY3JpcHRpb24gPSBkZXNjLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIlByaW9yaWRhZGVcIik7XG4gICAgY29uc3QgcHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtcHJpLXJvd1wiIH0pO1xuICAgIGNvbnN0IHJlbmRlclByaSA9ICgpID0+IHtcbiAgICAgIHByb3cuZW1wdHkoKTtcbiAgICAgIGZvciAoY29uc3QgYXBpIG9mIFs0LCAzLCAyLCAxXSkge1xuICAgICAgICBjb25zdCBtZXRhID0gVE9ET0lTVF9QUklbYXBpXTtcbiAgICAgICAgY29uc3QgYiA9IHByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1wcmlcIiArICh0aGlzLnYucHJpb3JpdHkgPT09IGFwaSA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgICAgYi5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIG1ldGEuY29sb3IpO1xuICAgICAgICBiLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpKSk7XG4gICAgICAgIGNsaWNrYWJsZShiLCAoKSA9PiB7IHRoaXMudi5wcmlvcml0eSA9IGFwaTsgcmVuZGVyUHJpKCk7IH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmVuZGVyUHJpKCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGF0YVwiKTtcbiAgICBjb25zdCBkcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1kdWUtcm93XCIgfSk7XG4gICAgY29uc3QgZHVlID0gZHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0IHdkLXRmLWRhdGVcIiwgdHlwZTogXCJkYXRlXCIgfSk7XG4gICAgZHVlLnZhbHVlID0gdGhpcy52LmR1ZURhdGU7XG4gICAgZHVlLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IGR1ZS52YWx1ZTsgfTtcbiAgICBjb25zdCBjbHIgPSBkcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXRmLWR1ZS1jbGVhclwiLCB0ZXh0OiBcInNlbSBkYXRhXCIgfSk7XG4gICAgY2xyLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudi5kdWVEYXRlID0gXCJcIjsgZHVlLnZhbHVlID0gXCJcIjsgfTtcbiAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDbGlxdWUgcGFyYSBhYnJpciBvIGNhbGVuZFx1MDBFMXJpby4gVmF6aW8gPSBzZW0gZGF0YS5cIiB9KTtcbiAgICBpZiAodGhpcy5vcHRzLnRhc2s/LmR1ZT8uaXNfcmVjdXJyaW5nKVxuICAgICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi13YXJuXCIsIHRleHQ6IFwiXHUyN0YzIFRhcmVmYSByZWNvcnJlbnRlIFx1MjAxNCBtdWRhciBhIGRhdGEgZml4YSBwb2RlIGVuY2VycmFyIGEgcmVjb3JyXHUwMEVBbmNpYS5cIiB9KTtcblxuICAgIHRoaXMuZmllbGQoXCJQcm9qZXRvXCIpO1xuICAgIGNvbnN0IHNlbCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInNlbGVjdFwiLCB7IGNsczogXCJ3ZC10Zi1zZWxlY3RcIiB9KTtcbiAgICBjb25zdCBpbmJveCA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IFwiRW50cmFkYSAoSW5ib3gpXCIsIHZhbHVlOiBcIlwiIH0pO1xuICAgIGlmICghdGhpcy52LnByb2plY3RJZCkgaW5ib3guc2VsZWN0ZWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLm9wdHMucHJvamVjdHMpIHtcbiAgICAgIGNvbnN0IG8gPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBwLm5hbWUsIHZhbHVlOiBwLmlkIH0pO1xuICAgICAgaWYgKHAuaWQgPT09IHRoaXMudi5wcm9qZWN0SWQpIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzZWwub25jaGFuZ2UgPSAoKSA9PiB7IHRoaXMudi5wcm9qZWN0SWQgPSBzZWwudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiRXRpcXVldGFzXCIpO1xuICAgIGNvbnN0IGx3cmFwID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbHNcIiB9KTtcbiAgICBpZiAodGhpcy5rbm93bkxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHJlbmRlckxhYmVscyA9ICgpID0+IHtcbiAgICAgICAgbHdyYXAuZW1wdHkoKTtcbiAgICAgICAgZm9yIChjb25zdCBsIG9mIHRoaXMua25vd25MYWJlbHMpIHtcbiAgICAgICAgICBjb25zdCBvbiA9IHRoaXMudi5sYWJlbHMuaW5jbHVkZXMobCk7XG4gICAgICAgICAgY29uc3QgY2hpcCA9IGx3cmFwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2x9YCB9KTtcbiAgICAgICAgICBjaGlwLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG9uKSk7XG4gICAgICAgICAgY2xpY2thYmxlKGNoaXAsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnYubGFiZWxzLmluZGV4T2YobCk7XG4gICAgICAgICAgICBpZiAoaSA+PSAwKSB0aGlzLnYubGFiZWxzLnNwbGljZShpLCAxKTsgZWxzZSB0aGlzLnYubGFiZWxzLnB1c2gobCk7XG4gICAgICAgICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlbmRlckxhYmVscygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIk5lbmh1bWEgZXRpcXVldGEgbm8gVG9kb2lzdCBhaW5kYS5cIiB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGlvbnNFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtYWN0aW9uc1wiIH0pO1xuICAgIHRoaXMucmVuZGVyQWN0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaWVsZChsYWJlbDogc3RyaW5nKSB7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsXCIsIHRleHQ6IGxhYmVsIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBY3Rpb25zKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmFjdGlvbnNFbDtcbiAgICBhLmVtcHR5KCk7XG5cbiAgICBpZiAodGhpcy5jb25maXJtRGVsICYmIHRoaXMub3B0cy5yZW1vdmUpIHtcbiAgICAgIGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1jb25maXJtXCIsIHRleHQ6IFwiRXhjbHVpciBlc3RhIHRhcmVmYT9cIiB9KTtcbiAgICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgICAgY29uc3QgeWVzID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICB5ZXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnJlbW92ZSEoKSkgdGhpcy5jbG9zZSgpO1xuICAgICAgICBlbHNlIHsgdGhpcy5jb25maXJtRGVsID0gZmFsc2U7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgbm8gPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgICAgbm8ub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25maXJtRGVsID0gZmFsc2U7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMubW9kZSA9PT0gXCJlZGl0XCIpIHtcbiAgICAgIGNvbnN0IGRlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICBkZWwub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25maXJtRGVsID0gdHJ1ZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgfVxuXG4gICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgY2FuY2VsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICBjYW5jZWwub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBzYXZlID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiU2FsdmFyXCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgc2F2ZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy52LmNvbnRlbnQgPSB0aGlzLnYuY29udGVudC50cmltKCk7XG4gICAgICBpZiAoIXRoaXMudi5jb250ZW50KSB7IG5ldyBOb3RpY2UoXCJEXHUwMEVBIHVtIHRcdTAwRUR0dWxvIFx1MDBFMCB0YXJlZmEuXCIpOyByZXR1cm47IH1cbiAgICAgIHNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5zdWJtaXQodGhpcy52KSkgdGhpcy5jbG9zZSgpO1xuICAgICAgZWxzZSBzYXZlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZSBjb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY2xhc3MgV2VydXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIC8vIFByb2pldG9zIGRvIFRvZG9pc3QgKHBhcmEgb3MgZHJvcGRvd25zIGRvcyBwYWNvdGVzKS4gQnVzY2Fkb3MgMXg7IHF1YW5kb1xuICAvLyBjaGVnYW0sIHJlLXJlbmRlcml6YSBhIGFiYSBwYXJhIHByZWVuY2hlciBvcyBzZWxlY3RzLlxuICBwcml2YXRlIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdIHwgbnVsbCA9IG51bGw7XG4gIC8vIEV0aXF1ZXRhcyBkbyBUb2RvaXN0IChjaGlwcyBwb3IgcGFjb3RlKS4gTWVzbWEgZXN0cmF0XHUwMEU5Z2lhOiBidXNjYSAxeC5cbiAgcHJpdmF0ZSBsYWJlbHM6IFRvZG9pc3RMYWJlbFtdIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihhcHAsIHBsdWdpbik7IH1cblxuICBkaXNwbGF5KCkge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW47XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFeGliaVx1MDBFN1x1MDBFM28gZG8gZGFzaGJvYXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmRcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb2RvIGNvbXBhY3RvXCIpXG4gICAgICAuc2V0RGVzYyhcIkxheW91dCBtYWlzIGRlbnNvLCBjb20gbWVub3MgZXNwYVx1MDBFN2FtZW50byBlbnRyZSBvcyBlbGVtZW50b3MuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmNvbXBhY3QpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFNlXHUwMEU3XHUwMEY1ZXMgZG8gZGFzaGJvYXJkICh2aXNpYmlsaWRhZGUgKyBvcmRlbSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmRcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJBdGl2ZS9kZXNhdGl2ZSBjYWRhIHNlXHUwMEU3XHUwMEUzbyBlIGFqdXN0ZSBhIG9yZGVtIGVtIHF1ZSBhcGFyZWNlbSBuYSBkYXNoYm9hcmQuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvcmRlciA9IHBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXI7XG4gICAgb3JkZXIuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShTRUNUSU9OX0xBQkVMW2lkXSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwiYXJyb3ctdXBcIikuc2V0VG9vbHRpcChcIk1vdmVyIHBhcmEgY2ltYVwiKS5zZXREaXNhYmxlZChpID09PSAwKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVTZWN0aW9uKGlkLCAtMSk7IHRoaXMuZGlzcGxheSgpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwiYXJyb3ctZG93blwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBiYWl4b1wiKS5zZXREaXNhYmxlZChpID09PSBvcmRlci5sZW5ndGggLSAxKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVTZWN0aW9uKGlkLCArMSk7IHRoaXMuZGlzcGxheSgpOyB9KSlcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIlZpc1x1MDBFRHZlbFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSghcGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhcInNlYzpcIiArIGlkKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oXCJzZWM6XCIgKyBpZCwgIXYpOyB9KSk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUGFzdGFzIGV4aWJpZGFzIChjYXJkcyBkbyBDb2ZyZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiUGFzdGFzIGV4aWJpZGFzIChjYXJkcyBkbyBDb2ZyZSlcIiB9KTtcbiAgICBjb25zdCB0b3BGb2xkZXJzID0gKHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKS5jaGlsZHJlblxuICAgICAgLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGlmICghdG9wRm9sZGVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7IGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIGRlIHRvcG8gbm8gY29mcmUuXCIgfSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiB0b3BGb2xkZXJzKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoZi5uYW1lKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGYucGF0aCkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBhd2FpdCBwbHVnaW4uc2V0SGlkZGVuKGYucGF0aCwgIXYpOyB9KSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEZvbnRlcyBkYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkZvbnRlcyBkb3MgUmVsYXRcdTAwRjNyaW9zXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiUGFzdGFzIGN1amFzIG5vdGFzIHZpcmFtIGNhcmRzIG5vcyBkaWFzIGRhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MgKHBvc2lcdTAwRTdcdTAwRTNvIHBlbGEgZGF0YSBkYSBub3RhKS4gQ2FkYSBmb250ZSB0ZW0gdW1hIGNvciBwclx1MDBGM3ByaWEuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzcmNzID0gcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICBzcmNzLmZvckVhY2gocyA9PiB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUocy5wYXRoKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiQXRpdmFcIilcbiAgICAgICAgICAuc2V0VmFsdWUocy5vbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHMub24gPSB2OyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSkpXG4gICAgICAgIC5hZGRDb2xvclBpY2tlcihjID0+IGNcbiAgICAgICAgICAuc2V0VmFsdWUocy5jb2xvcilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHMuY29sb3IgPSB2OyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSkpXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcInRyYXNoLTJcIikuc2V0VG9vbHRpcChcIlJlbW92ZXIgZm9udGVcIilcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gc3Jjcy5maWx0ZXIoeCA9PiB4ICE9PSBzKTtcbiAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVzZWQgPSBuZXcgU2V0KHNyY3MubWFwKHMgPT4gcy5wYXRoKSk7XG4gICAgY29uc3QgYXZhaWxhYmxlID0gYWxsRm9sZGVyUGF0aHModGhpcy5hcHApLmZpbHRlcihwID0+ICF1c2VkLmhhcyhwKSk7XG4gICAgaWYgKGF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkFkaWNpb25hciBmb250ZVwiKVxuICAgICAgICAuc2V0RGVzYyhcIkVzY29saGEgdW1hIHBhc3RhIGRvIGNvZnJlIHBhcmEgYWxpbWVudGFyIGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcy5cIilcbiAgICAgICAgLmFkZERyb3Bkb3duKGQgPT4ge1xuICAgICAgICAgIGQuYWRkT3B0aW9uKFwiXCIsIFwiRXNjb2xoYSB1bWEgcGFzdGFcdTIwMjZcIik7XG4gICAgICAgICAgZm9yIChjb25zdCBwIG9mIGF2YWlsYWJsZSkgZC5hZGRPcHRpb24ocCwgcCk7XG4gICAgICAgICAgZC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIGlmICghdikgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBBQ0NFTlRTW3BsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMubGVuZ3RoICUgQUNDRU5UUy5sZW5ndGhdO1xuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5wdXNoKHsgcGF0aDogdiwgY29sb3IsIG9uOiB0cnVlIH0pO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBHYW1pZmljYVx1MDBFN1x1MDBFM28gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiR2FtaWZpY2FcdTAwRTdcdTAwRTNvXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiVGFyZWZhcyBjb25jbHVcdTAwRURkYXMgdmlyYW0gWFAvblx1MDBFRHZlbC9zdHJlYWsgKGFiYSBHYW1pZmljYVx1MDBFN1x1MDBFM28gKyBmYWl4YSBubyBkYXNoYm9hcmQpLiBcXFwiU2FsdmFyIGNvbmNsdVx1MDBFRGRhc1xcXCIgZ3JhdmEgbm8gbG9nIGRvIGNvZnJlICgyMC5BcmVhcy9HYW1pZmljYVx1MDBFN1x1MDBFM28ubWQpIGUgbGltcGEgZG8gVG9kb2lzdC4gTyBib3RcdTAwRTNvIFx1MjcxNyBtYXJjYSB1bWEgdGFyZWZhIGNvbW8gblx1MDBFM28gZmVpdGEgKHB1bmlcdTAwRTdcdTAwRTNvIGVtIFhQKSBlIGEgYXBhZ2EuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQXRpdmFyIGdhbWlmaWNhXHUwMEU3XHUwMEUzb1wiKVxuICAgICAgLnNldERlc2MoXCJNb3N0cmEgYSBzZVx1MDBFN1x1MDBFM28vYWJhIGRlIEdhbWlmaWNhXHUwMEU3XHUwMEUzbyBlIG8gYm90XHUwMEUzbyBcXFwiblx1MDBFM28gZmVpdGFcXFwiIG5hcyB0YXJlZmFzLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5nYW1pZmljYXRpb25FbmFibGVkKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmdhbWlmaWNhdGlvbkVuYWJsZWQgPSB2O1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgcGx1Z2luLmdhbWUucmVyZW5kZXJBbGwoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlBlbmFsaWRhZGUgZG8gXFxcIm5cdTAwRTNvIGZlaXRvXFxcIlwiKVxuICAgICAgLnNldERlc2MoXCJNdWx0aXBsaWNhIGEgYmFzZSBkYSBwcmlvcmlkYWRlIGFvIG1hcmNhciBjb21vIG5cdTAwRTNvIGZlaXRhLiBFeC46IDEsNSA9IHBlcmRlIDUwJSBhIG1haXMgZG8gcXVlIGdhbmhhcmlhLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB0XG4gICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIjEuNVwiKVxuICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHBsdWdpbi5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvcikpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICBjb25zdCBuID0gTnVtYmVyKHYucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbiAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwKSB7IHBsdWdpbi5zZXR0aW5ncy5nYW1lUGVuYWx0eUZhY3RvciA9IG47IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfVxuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTm90YSBkZSBSZWdyYXMgKEpTT04pXCIpXG4gICAgICAuc2V0RGVzYyhcIkNhbWluaG8gZGEgbm90YSBjb20gYXMgcmVncmFzIGRvIGpvZ28gKHByb2pldG9zLCBldGlxdWV0YXMsIFhQIHBvciBwcmlvcmlkYWRlL2V0aXF1ZXRhLCBuXHUwMEVEdmVpcyBlIGNvbnF1aXN0YXMpLiBNdWRlIHNlIG8gc2V1IGNvZnJlIG5cdTAwRTNvIHVzYSBvIG1cdTAwRTl0b2RvIFBBUkEuIE8gbFx1MDBFMXBpcyBhYnJlIFx1MjAxNCBlIGNyaWEsIGpcdTAwRTEgcHJlZW5jaGlkYSBcdTIwMTQgYSBub3RhLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB0XG4gICAgICAgIC5zZXRQbGFjZWhvbGRlcihERUZBVUxUX1JVTEVTX1BBVEgpXG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuZ2FtZVJ1bGVzUGF0aClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5nYW1lUnVsZXNQYXRoID0gdi50cmltKCkgfHwgREVGQVVMVF9SVUxFU19QQVRIO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICBwbHVnaW4uZ2FtZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgdm9pZCBwbHVnaW4uZ2FtZS5lbnN1cmVMb2FkZWQoKS50aGVuKCgpID0+IHBsdWdpbi5nYW1lLnJlcmVuZGVyQWxsKCkpO1xuICAgICAgICB9KSlcbiAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgLnNldEljb24oXCJwZW5jaWxcIilcbiAgICAgICAgLnNldFRvb2x0aXAoXCJBYnJpciAvIGNyaWFyIGEgbm90YSBkZSBSZWdyYXNcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCBwbHVnaW4uZ2FtZS5vcGVuR2FtZVJ1bGVzKCkpKVxuICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAuc2V0SWNvbihcImJvb2stb3BlblwiKVxuICAgICAgICAuc2V0VG9vbHRpcChcIlJlZ2VuZXJhciBhIGRvY3VtZW50YVx1MDBFN1x1MDBFM28gZGEgbm90YSAobWFudFx1MDBFOW0gYSBzdWEgY29uZmlndXJhXHUwMEU3XHUwMEUzbylcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCBwbHVnaW4uZ2FtZS5yZWdlbmVyYXRlUnVsZXNEb2MoKSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlByb3Zpc2lvbmFyIFRvZG9pc3RcIilcbiAgICAgIC5zZXREZXNjKFwiQ3JpYSBubyBzZXUgVG9kb2lzdCBvcyBwcm9qZXRvcyBlIGV0aXF1ZXRhcyBsaXN0YWRvcyBuYXMgUmVncmFzIChzXHUwMEYzIG9zIHF1ZSBmYWx0YW0pLiBcdTAwREF0aWwgYW8gYWRvdGFyIHVtIFxcXCJqb2dvXFxcIiBmZWl0byBwZWxhIGNvbXVuaWRhZGUuXCIpXG4gICAgICAuYWRkQnV0dG9uKGIgPT4gYlxuICAgICAgICAuc2V0QnV0dG9uVGV4dChcIkNyaWFyIHByb2pldG9zIGUgZXRpcXVldGFzXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHZvaWQgcGx1Z2luLnByb3Zpc2lvblRvZG9pc3QoKSkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhY290ZXMgZGUgdGFyZWZhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYWNvdGVzIGRlIHRhcmVmYXNcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJDb25qdW50b3MgZGUgdGFyZWZhcyBxdWUgdm9jXHUwMEVBIGxhblx1MDBFN2Egbm8gVG9kb2lzdCBjb20gdW0gY2xpcXVlIChuYSBhYmEgVG9kb2lzdCBvdSBubyBkYXNoYm9hcmQpLCB0b2RhcyBjb20gZGF0YSBkZSBob2plLiBVbWEgdGFyZWZhIHBvciBsaW5oYS4gTnVtYSBsaW5oYSwgdXNlIEBldGlxdWV0YSBwYXJhIGFwbGljYXIgdW1hIGV0aXF1ZXRhIHNcdTAwRjMgXHUwMEUwcXVlbGEgdGFyZWZhIGUgcDFcdTIwMTNwNCBwYXJhIGEgcHJpb3JpZGFkZSAocDEgPSBtYWlzIGFsdGE7IHBhZHJcdTAwRTNvIHA0KS5cIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb25maXJtYXIgYW50ZXMgZGUgbGFuXHUwMEU3YXJcIilcbiAgICAgIC5zZXREZXNjKFwiUGVkZSBjb25maXJtYVx1MDBFN1x1MDBFM28gKGNvbSBhIGxpc3RhIGRlIHRhcmVmYXMpIGFudGVzIGRlIGNyaWFyLiBcXFwiU2VtcHJlXFxcIiBjb25maXJtYSBhdFx1MDBFOSBwYXJhIDEgdGFyZWZhIFx1MjAxNCBcdTAwRkF0aWwgcGFyYSB0ZXN0YXI7IGRlcG9pcyBtdWRlIHBhcmEgTnVuY2EuXCIpXG4gICAgICAuYWRkRHJvcGRvd24oZCA9PiBkXG4gICAgICAgIC5hZGRPcHRpb24oXCJhbHdheXNcIiwgXCJTZW1wcmVcIilcbiAgICAgICAgLmFkZE9wdGlvbihcIm1hbnlcIiwgXCJTXHUwMEYzIG11aXRhcyAoPiA1IHRhcmVmYXMpXCIpXG4gICAgICAgIC5hZGRPcHRpb24oXCJuZXZlclwiLCBcIk51bmNhXCIpXG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MucGFja2FnZUNvbmZpcm0pXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtID0gdiBhcyBEYXNoU2V0dGluZ3NbXCJwYWNrYWdlQ29uZmlybVwiXTsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIC8vIEJ1c2NhIHByb2pldG9zIGUgZXRpcXVldGFzIHVtYSB2ZXogKGRyb3Bkb3ducyArIGNoaXBzKTsgYW8gY2hlZ2FyLCByZS1yZW5kZXJpemEuXG4gICAgaWYgKHRva2VuICYmIHRoaXMucHJvamVjdHMgPT09IG51bGwpIHtcbiAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS50aGVuKHBzID0+IHsgdGhpcy5wcm9qZWN0cyA9IHBzOyB0aGlzLmRpc3BsYXkoKTsgfSkuY2F0Y2goKCkgPT4geyB0aGlzLnByb2plY3RzID0gW107IH0pO1xuICAgIH1cbiAgICBpZiAodG9rZW4gJiYgdGhpcy5sYWJlbHMgPT09IG51bGwpIHtcbiAgICAgIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbikudGhlbihscyA9PiB7IHRoaXMubGFiZWxzID0gbHM7IHRoaXMuZGlzcGxheSgpOyB9KS5jYXRjaCgoKSA9PiB7IHRoaXMubGFiZWxzID0gW107IH0pO1xuICAgIH1cblxuICAgIC8vIFBvcG92ZXIgZGUgZXRpcXVldGFzIGRlIHVtIHBhY290ZSAoY2hpcHMgdG9nZ2xlIGNvbSBhIGNvciBkbyBUb2RvaXN0KS5cbiAgICBjb25zdCBvcGVuTGFiZWxzUG9wb3ZlciA9IChhbmNob3I6IEhUTUxFbGVtZW50LCBwa2c6IFRhc2tQYWNrYWdlLCByZWZyZXNoOiAoKSA9PiB2b2lkKSA9PlxuICAgICAgb3BlblBvcG92ZXIoYW5jaG9yLCBib2R5ID0+IHtcbiAgICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLXRpdGxlXCIsIHRleHQ6IFwiRXRpcXVldGFzIGRvIHBhY290ZVwiIH0pO1xuICAgICAgICBpZiAoIXRva2VuKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDb25maWd1cmUgbyB0b2tlbiBkbyBUb2RvaXN0LlwiIH0pOyByZXR1cm47IH1cbiAgICAgICAgaWYgKHRoaXMubGFiZWxzID09PSBudWxsKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgICAgICBpZiAoIXRoaXMubGFiZWxzLmxlbmd0aCkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiTmVuaHVtYSBldGlxdWV0YSBubyBUb2RvaXN0LlwiIH0pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgY2hpcHMgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3AtY2hpcHNcIiB9KTtcbiAgICAgICAgY29uc3QgcmVuZGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNoaXBzLmVtcHR5KCk7XG4gICAgICAgICAgZm9yIChjb25zdCBsIG9mIHRoaXMubGFiZWxzISkge1xuICAgICAgICAgICAgY29uc3Qgb24gPSAocGtnLmxhYmVscyA/PyBbXSkuaW5jbHVkZXMobC5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGNoaXAgPSBjaGlwcy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gVE9ET0lTVF9DT0xPUlNbbC5jb2xvcl0gPz8gTEFCRUxfRkFMTEJBQ0s7XG4gICAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bC5uYW1lfWAgfSk7XG4gICAgICAgICAgICBjbGlja2FibGUoY2hpcCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjdXIgPSBwa2cubGFiZWxzID8/IFtdO1xuICAgICAgICAgICAgICBjb25zdCBpID0gY3VyLmluZGV4T2YobC5uYW1lKTtcbiAgICAgICAgICAgICAgaWYgKGkgPj0gMCkgY3VyLnNwbGljZShpLCAxKTsgZWxzZSBjdXIucHVzaChsLm5hbWUpO1xuICAgICAgICAgICAgICBwa2cubGFiZWxzID0gY3VyLmxlbmd0aCA/IGN1ciA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSwgeyBjbHM6IFwid2QtcG9wLWxhYmVsc1wiIH0pO1xuXG4gICAgLy8gUG9wb3ZlciBkZSB0YXJlZmFzIGRlIHVtIHBhY290ZSAodGV4dGFyZWE7IHBlcnNpc3RlIG5vIGlucHV0IGUgYW8gZmVjaGFyKS5cbiAgICBjb25zdCBvcGVuVGFza3NQb3BvdmVyID0gKGFuY2hvcjogSFRNTEVsZW1lbnQsIHBrZzogVGFza1BhY2thZ2UsIHJlZnJlc2g6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgIGxldCB0YTogSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICAgIG9wZW5Qb3BvdmVyKGFuY2hvciwgYm9keSA9PiB7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC10aXRsZVwiLCB0ZXh0OiBcIlRhcmVmYXMgZG8gcGFjb3RlXCIgfSk7XG4gICAgICAgIHRhID0gYm9keS5jcmVhdGVFbChcInRleHRhcmVhXCIsIHsgY2xzOiBcIndkLXBrZy10YXNrc1wiIH0pO1xuICAgICAgICB0YS52YWx1ZSA9IHBrZy50YXNrcy5qb2luKFwiXFxuXCIpO1xuICAgICAgICB0YS5wbGFjZWhvbGRlciA9IFwiVW1hIHRhcmVmYSBwb3IgbGluaGEgKGV4LjogQmViZXIgXHUwMEUxZ3VhKVwiO1xuICAgICAgICB0YS5yb3dzID0gNjtcbiAgICAgICAgdGEuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBwa2cudGFza3MgPSB0YS52YWx1ZS5zcGxpdChcIlxcblwiKS5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiVW1hIHBvciBsaW5oYSBcdTAwQjcgQGV0aXF1ZXRhIG1hcmNhIHNcdTAwRjMgYXF1ZWxhIHRhcmVmYSBcdTAwQjcgcDFcdTIwMTNwNCBkZWZpbmUgYSBwcmlvcmlkYWRlIChwMSA9IG1haXMgYWx0YSkgXHUwMEI3IGZlY2hhIGFvIGNsaWNhciBmb3JhIG91IEVzYy5cIiB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0YS5mb2N1cygpLCAwKTtcbiAgICAgIH0sIHsgY2xzOiBcIndkLXBvcC10YXNrc1wiLCB3aWR0aDogMzIwLCBjb250YWluZXI6IHRoaXMuY29udGFpbmVyRWwsIG9uQ2xvc2U6ICgpID0+IHsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9IH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBwa2dzID0gcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBjb25zdCBsaXN0ID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1saXN0XCIgfSk7XG4gICAgcGtncy5mb3JFYWNoKChwa2csIGlkeCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLXJvd1wiIH0pO1xuXG4gICAgICAvLyBcdTAwQ0Rjb25lIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyIGRlIHBhbGV0YSkuXG4gICAgICBjb25zdCBpY29uQnRuID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb250cmlnZ2VyXCIgfSk7XG4gICAgICBpY29uQnRuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlx1MDBDRGNvbmUgZG8gcGFjb3RlXCIpO1xuICAgICAgY29uc3QgZmlsbEljb24gPSAoKSA9PiB7XG4gICAgICAgIGljb25CdG4uZW1wdHkoKTtcbiAgICAgICAgaWYgKHBrZy5pY29uKSByZW5kZXJJY29uKGljb25CdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvXCIgfSksIHBrZy5pY29uKTtcbiAgICAgICAgZWxzZSBpY29uQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljby1lbXB0eVwiLCB0ZXh0OiBcIitcIiB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsSWNvbigpO1xuICAgICAgY2xpY2thYmxlKGljb25CdG4sICgpID0+IG9wZW5JY29uUG9wb3ZlcihpY29uQnRuLCBwa2cuaWNvbiwgYXN5bmMgaWMgPT4ge1xuICAgICAgICBwa2cuaWNvbiA9IGljOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgZmlsbEljb24oKTtcbiAgICAgIH0pKTtcblxuICAgICAgLy8gTm9tZS5cbiAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC1wa2ctbmFtZS1pbnB1dFwiLCBhdHRyOiB7IHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJOb21lIGRvIHBhY290ZVwiIH0gfSk7XG4gICAgICBuYW1lLnZhbHVlID0gcGtnLm5hbWU7XG4gICAgICBuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBhc3luYyAoKSA9PiB7IHBrZy5uYW1lID0gbmFtZS52YWx1ZTsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KTtcbiAgICAgIG5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCkpO1xuXG4gICAgICAvLyBQcm9qZXRvLlxuICAgICAgY29uc3QgcHJvaiA9IHJvdy5jcmVhdGVFbChcInNlbGVjdFwiLCB7IGNsczogXCJ3ZC1wa2ctcHJvaiBkcm9wZG93blwiIH0pO1xuICAgICAgY29uc3QgYWRkT3B0ID0gKHY6IHN0cmluZywgdDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IG8gPSBwcm9qLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogdCwgdmFsdWU6IHYgfSk7XG4gICAgICAgIGlmICgocGtnLnByb2plY3RJZCA/PyBcIlwiKSA9PT0gdikgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9O1xuICAgICAgYWRkT3B0KFwiXCIsIFwiRW50cmFkYVwiKTtcbiAgICAgIGZvciAoY29uc3QgcCBvZiAodGhpcy5wcm9qZWN0cyA/PyBbXSkpIGFkZE9wdChwLmlkLCBwLm5hbWUpO1xuICAgICAgcHJvai5vbmNoYW5nZSA9IGFzeW5jICgpID0+IHsgcGtnLnByb2plY3RJZCA9IHByb2oudmFsdWUgfHwgdW5kZWZpbmVkOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH07XG5cbiAgICAgIC8vIEV0aXF1ZXRhcyAoYm90XHUwMEUzbyBcdTIxOTIgcG9wb3ZlcikuXG4gICAgICBjb25zdCBsYmxCdG4gPSByb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtcGtnLWNoaXAtYnRuXCIgfSk7XG4gICAgICBjb25zdCBmaWxsTGJsID0gKCkgPT4ge1xuICAgICAgICBsYmxCdG4uZW1wdHkoKTtcbiAgICAgICAgc2V0SWNvbihsYmxCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctYnRuLWljb1wiIH0pLCBcInRhZ1wiKTtcbiAgICAgICAgbGJsQnRuLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIkV0aXF1ZXRhc1wiIH0pO1xuICAgICAgICBjb25zdCBuID0gcGtnLmxhYmVscz8ubGVuZ3RoID8/IDA7XG4gICAgICAgIGlmIChuKSBsYmxCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogU3RyaW5nKG4pIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxMYmwoKTtcbiAgICAgIGxibEJ0bi5vbmNsaWNrID0gKCkgPT4gb3BlbkxhYmVsc1BvcG92ZXIobGJsQnRuLCBwa2csIGZpbGxMYmwpO1xuXG4gICAgICAvLyBUYXJlZmFzIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyKS5cbiAgICAgIGNvbnN0IHRhc2tCdG4gPSByb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtcGtnLWNoaXAtYnRuXCIgfSk7XG4gICAgICBjb25zdCBmaWxsVGFzayA9ICgpID0+IHtcbiAgICAgICAgdGFza0J0bi5lbXB0eSgpO1xuICAgICAgICBzZXRJY29uKHRhc2tCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctYnRuLWljb1wiIH0pLCBcImxpc3RcIik7XG4gICAgICAgIHRhc2tCdG4uY3JlYXRlU3Bhbih7IHRleHQ6IFwiVGFyZWZhc1wiIH0pO1xuICAgICAgICBjb25zdCBuID0gcGtnLnRhc2tzLmZpbHRlcihzID0+IHMudHJpbSgpKS5sZW5ndGg7XG4gICAgICAgIGlmIChuKSB0YXNrQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IFN0cmluZyhuKSB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsVGFzaygpO1xuICAgICAgdGFza0J0bi5vbmNsaWNrID0gKCkgPT4gb3BlblRhc2tzUG9wb3Zlcih0YXNrQnRuLCBwa2csIGZpbGxUYXNrKTtcblxuICAgICAgLy8gUmVvcmRlbmFyIC8gcmVtb3Zlci5cbiAgICAgIGNvbnN0IHVwID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmlcIiArIChpZHggPT09IDAgPyBcIiB3ZC1kaXNhYmxlZFwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHVwLCBcImNoZXZyb24tdXBcIik7IHVwLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHBhcmEgY2ltYVwiKTtcbiAgICAgIGlmIChpZHggPiAwKSBjbGlja2FibGUodXAsIGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVQYWNrYWdlKGlkeCwgLTEpOyB0aGlzLmRpc3BsYXkoKTsgfSk7XG4gICAgICBjb25zdCBkb3duID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmlcIiArIChpZHggPT09IHBrZ3MubGVuZ3RoIC0gMSA/IFwiIHdkLWRpc2FibGVkXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24oZG93biwgXCJjaGV2cm9uLWRvd25cIik7IGRvd24uc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgcGFyYSBiYWl4b1wiKTtcbiAgICAgIGlmIChpZHggPCBwa2dzLmxlbmd0aCAtIDEpIGNsaWNrYWJsZShkb3duLCBhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlUGFja2FnZShpZHgsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH0pO1xuICAgICAgY29uc3QgZGVsID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmkgd2QtcGtnLWRlbFwiIH0pO1xuICAgICAgc2V0SWNvbihkZWwsIFwidHJhc2gtMlwiKTsgZGVsLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlJlbW92ZXIgcGFjb3RlXCIpO1xuICAgICAgY2xpY2thYmxlKGRlbCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzID0gcGtncy5maWx0ZXIoeCA9PiB4ICE9PSBwa2cpO1xuICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBZGljaW9uYXIgcGFjb3RlXCIpXG4gICAgICAuYWRkQnV0dG9uKGIgPT4gYlxuICAgICAgICAuc2V0QnV0dG9uVGV4dChcIisgTm92byBwYWNvdGVcIilcbiAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMucHVzaCh7IGlkOiB1aWQoKSwgbmFtZTogXCJOb3ZvIHBhY290ZVwiLCB0YXNrczogW10gfSk7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJJbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9rZW4gZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIlRvZG9pc3QgXHUyMTkyIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBJbnRlZ3JhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFRva2VuIGRlIEFQSSBkbyBkZXNlbnZvbHZlZG9yLiBTYWx2byBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIG8gdG9rZW4gYXF1aVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRhcyB0YXJlZmFzXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBvIHByb2pldG8gbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBvIG5vbWUgZG8gcHJvamV0byBhbyBsYWRvIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgYXMgQGV0aXF1ZXRhcyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nKVwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkVzdGFzIGNyZWRlbmNpYWlzIHNcdTAwRTNvIGd1YXJkYWRhcyBwb3IgZGlzcG9zaXRpdm8gKGxvY2FsU3RvcmFnZSkgXHUyMDE0IGNhZGEgbVx1MDBFMXF1aW5hIHRlbSBhIHN1YSBlIGVsYXMgblx1MDBFM28gc2luY3Jvbml6YW0gcGVsbyBTeW5jdGhpbmcgbmVtIHZcdTAwRTNvIHBhcmEgbyBHaXQuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVVJMIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJFbmRlcmVcdTAwRTdvIGRvIFN5bmN0aGluZy4gUGFkclx1MDBFM286IGh0dHA6Ly8xMjcuMC4wLjE6ODM4NCAoYSBpbnN0XHUwMEUybmNpYSBsb2NhbCkuIE5vIGNlbHVsYXIsIGFwb250ZSBwYXJhIGEgQVBJIGRlIG91dHJhIG1cdTAwRTFxdWluYSBuYSByZWRlIHNlIGEgbG9jYWwgblx1MDBFM28gcmVzcG9uZGVyLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IHYudHJpbSgpIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQVBJIGtleVwiKVxuICAgICAgLnNldERlc2MoXCJTeW5jdGhpbmcgXHUyMTkyIEFjdGlvbnMgXHUyMTkyIFNldHRpbmdzIFx1MjE5MiBBUEkgS2V5LiBHdWFyZGFkYSBwb3IgZGlzcG9zaXRpdm8gKGxvY2FsU3RvcmFnZSksIG5cdTAwRTNvIHZhaSBwYXJhIG8gZGF0YS5qc29uL0dpdC5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBhIEFQSSBrZXlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJRCBkYSBwYXN0YSAob3BjaW9uYWwpXCIpXG4gICAgICAuc2V0RGVzYyhcIkZvbGRlciBJRCBkbyBjb2ZyZSBubyBTeW5jdGhpbmcuIFZhemlvID0gdXNhIGEgcHJpbWVpcmEgcGFzdGEgYXV0b21hdGljYW1lbnRlLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJleC46IG51bnF2LW10aW1uXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBjb250YWdlbSBkZSBpdGVucyBwb3IgYXBhcmVsaG9cIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgXFxcInNpbmNyb25pemFkb3MgLyB0b3RhbFxcXCIgZGUgaXRlbnMgZW0gY2FkYSBhcGFyZWxobywgYWxcdTAwRTltIGRhIHBvcmNlbnRhZ2VtLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICB9KSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUEySztBQUUzSyxJQUFNLFlBQVk7QUFDbEIsSUFBTSxvQkFBb0I7QUFLMUIsSUFBTSxZQUFZO0FBQ2xCLElBQU0sWUFBWTtBQUNsQixJQUFNLGVBQWU7QUFDckIsSUFBTSxnQkFBZ0I7QUFDdEIsSUFBTSxXQUFXLElBQUksS0FBSztBQUMxQixJQUFNLGlCQUFpQjtBQUd2QixJQUFNLGlCQUFpQjtBQUN2QixJQUFNLGdCQUFnQjtBQUN0QixJQUFNLGlCQUFpQjtBQUN2QixJQUFNLHFCQUFxQjtBQUMzQixJQUFNLGtCQUFrQjtBQUN4QixJQUFNLHdCQUF3QjtBQUc5QixJQUFNLG9CQUE0QyxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksRUFBRTtBQUUvRSxTQUFTLE9BQU8sR0FBbUI7QUFBRSxTQUFPLE1BQU0sSUFBSSxPQUFPLE1B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WixRQUFFLGVBQWUsa0JBQWtCLEVBQ2hDLFNBQVMsS0FBSyxPQUFPLFNBQVMsaUJBQWlCLEVBQy9DLFNBQVMsT0FBTSxNQUFLO0FBQ25CLGFBQUssT0FBTyxTQUFTLG9CQUFvQixFQUFFLEtBQUs7QUFDaEQsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzFCLENBQUM7QUFDSCxRQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDMUIsQ0FBQztBQUVILFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLHdDQUF3QyxFQUNoRCxRQUFRLGtGQUFpRixFQUN6RixVQUFVLE9BQUssRUFDYixTQUFTLEtBQUssT0FBTyxTQUFTLG1CQUFtQixFQUNqRCxTQUFTLE9BQU0sTUFBSztBQUNuQixXQUFLLE9BQU8sU0FBUyxzQkFBc0I7QUFDM0MsWUFBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixXQUFLLE9BQU8sWUFBWTtBQUFBLElBQzFCLENBQUMsQ0FBQztBQUFBLEVBQ1I7QUFDRjsiLAogICJuYW1lcyI6IFsiX2EiLCAiYWNoIiwgIm9rIiwgInJhbmdlIiwgIl9iIiwgIl9jIl0KfQo=
