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
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
var DEFAULT_SETTINGS = {
  sectionOrder: ["stats", "todoist", "para", "sync", "heatmap", "growth", "calendar"],
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
  packageConfirm: "many"
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
var SECTION_LABEL = {
  stats: "Estat\xEDsticas",
  todoist: "Tarefas",
  para: "Cofre (pastas)",
  sync: "Sincroniza\xE7\xE3o",
  heatmap: "Atividade do cofre",
  growth: "Crescimento do cofre",
  calendar: "Relat\xF3rios"
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
  const stripped = line.replace(/@([\p{L}\p{N}_]+)/gu, (_m, name) => {
    inline.push(name);
    return "";
  }).replace(/\s{2,}/g, " ").trim();
  const title = stripped || line.trim();
  const labels = [.../* @__PURE__ */ new Set([...pkgLabels, ...inline])];
  return { title, labels };
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
    none.onclick = () => {
      onPick(void 0);
      close();
    };
    for (const ic of PKG_ICONS) {
      const opt = pop.createSpan({ cls: "wd-pkg-iconopt" + (current === ic ? " wd-on" : "") });
      renderIcon(opt, ic);
      opt.setAttr("title", ic);
      opt.onclick = () => {
        onPick(ic);
        close();
      };
    }
  }, { cls: "wd-icon-pop" });
}
async function fetchTodoistTasks(token) {
  var _a, _b;
  const all = [];
  let cursor = null;
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
  } while (cursor);
  return all;
}
async function fetchTodoistProjects(token) {
  var _a, _b;
  const all = [];
  let cursor = null;
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
  } while (cursor);
  return all;
}
async function fetchTodoistLabels(token) {
  var _a, _b;
  const all = [];
  let cursor = null;
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
  } while (cursor);
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
function reviewedStats(app, folder) {
  let reviewed = 0, total = 0;
  const walk = (f) => {
    var _a, _b;
    for (const c of f.children) {
      if (c instanceof import_obsidian.TFile && c.extension === "md" && c.name !== "status.md") {
        total++;
        if (((_b = (_a = app.metadataCache.getCache(c.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.reviewed) === true) reviewed++;
      } else if (c instanceof import_obsidian.TFolder) walk(c);
    }
  };
  walk(folder);
  return { reviewed, total };
}
function folderStats(folder) {
  let md = 0, img = 0;
  const walk = (f) => {
    for (const c of f.children) {
      if (c instanceof import_obsidian.TFile) {
        if (c.extension === "md" && c.name !== "status.md") md++;
        else if (IMG_EXT.includes(c.extension)) img++;
      } else if (c instanceof import_obsidian.TFolder) walk(c);
    }
  };
  walk(folder);
  return { md, img };
}
function countText(stats) {
  if (stats.md === 0 && stats.img > 0) return `${stats.img} img`;
  return stats.img > 0 ? `${stats.md} notas \xB7 ${stats.img} img` : `${stats.md} notas`;
}
function recentNotes(folder, n) {
  const files = [];
  const walk = (f) => {
    for (const c of f.children) {
      if (c instanceof import_obsidian.TFile && c.extension === "md" && c.name !== "status.md") files.push(c);
      else if (c instanceof import_obsidian.TFolder) walk(c);
    }
  };
  walk(folder);
  files.sort((a, b) => b.stat.mtime - a.stat.mtime);
  return files.slice(0, n);
}
function isAssetFolder(folder) {
  const { md, img } = folderStats(folder);
  return img > 0 && md === 0;
}
function subFolders(folder) {
  return folder.children.filter((c) => c instanceof import_obsidian.TFolder).filter((f) => !isAssetFolder(f)).sort((a, b) => a.name.localeCompare(b.name, "pt"));
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
function urgencyStats(app, folder) {
  const items = [];
  const walk = (f) => {
    for (const c of f.children) {
      if (c instanceof import_obsidian.TFile && c.extension === "md" && c.name !== "status.md") {
        const u = readNoteUrgency(app, c);
        if (u) items.push({ file: c, level: u });
      } else if (c instanceof import_obsidian.TFolder) walk(c);
    }
  };
  walk(folder);
  let max = null;
  for (const it of items) if (!max || URGENCY_RANK[it.level] > URGENCY_RANK[max]) max = it.level;
  items.sort((a, b) => URGENCY_RANK[b.level] - URGENCY_RANK[a.level]);
  return { items, max };
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
    this.filterOpen = false;
    this.tip = null;
    this.launching = /* @__PURE__ */ new Set();
    // ids de pacotes sendo lançados (anti clique-duplo)
    this.subs = /* @__PURE__ */ new Set();
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
    check.onclick = (e) => {
      e.stopPropagation();
      void this.completeTask(t);
    };
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
    row.onclick = () => this.openTaskDetail(t);
    this.attachTaskTip(row, t);
  }
  addTaskBtn(host, prefillDue, title = "Nova tarefa") {
    const b = host.createSpan({ cls: "wd-todo-add" });
    (0, import_obsidian.setIcon)(b, "plus");
    b.setAttr("title", title);
    b.onclick = (e) => {
      e.stopPropagation();
      this.openTaskForm({ mode: "create", prefillDue });
    };
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
      new import_obsidian.Notice(`\u2713 Conclu\xEDda: ${t.content}`);
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao concluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerenderAll();
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
      if (!disabled) btn.onclick = () => void this.launchPackage(pkg);
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
        chip.onclick = async () => {
          this.toggleFilter("projects", p.id);
          await this.plugin.saveSettings();
          this.rerenderAll();
        };
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
        chip.onclick = async () => {
          this.toggleFilter("labels", l);
          await this.plugin.saveSettings();
          this.rerenderAll();
        };
      }
    }
    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clr.onclick = async () => {
        f.projects = [];
        f.labels = [];
        await this.plugin.saveSettings();
        this.rerenderAll();
      };
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
        b.onclick = async (e) => {
          e.stopPropagation();
          this.plugin.settings.todoistDayRange = n;
          await this.plugin.saveSettings();
          this.rerenderAll();
        };
      }
      const f = this.plugin.settings.todoistFilters;
      const nF = f.projects.length + f.labels.length;
      const filt = ctrls.createSpan({ cls: "wd-todo-filterbtn" + (this.filterOpen ? " wd-on" : "") + (nF ? " wd-active" : "") });
      (0, import_obsidian.setIcon)(filt, "filter");
      filt.setAttr("title", nF ? `Filtros ativos (${nF}) \u2014 clique para ajustar` : "Filtrar por projeto/etiqueta");
      if (nF) filt.createSpan({ cls: "wd-todo-filtct", text: String(nF) });
      filt.onclick = (e) => {
        e.stopPropagation();
        this.filterOpen = !this.filterOpen;
        this.rerenderAll();
      };
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.loading ? " wd-spin" : "") });
      (0, import_obsidian.setIcon)(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      refresh.onclick = (e) => {
        e.stopPropagation();
        void this.fetch(true);
      };
      this.addTaskBtn(ctrls, void 0, "Nova tarefa");
    }
    if (!token) {
      body.createDiv({ cls: "wd-empty", text: "Cole seu token do Todoist em Configura\xE7\xF5es \u2192 Werus Dashboard para ver suas tarefas aqui." });
      return;
    }
    if (!this.fetchedAt && !this.loading && !this.error) void this.fetch(false);
    if (this.error) {
      body.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao buscar tarefas: ${this.error}` });
      return;
    }
    if (!this.fetchedAt) {
      body.createDiv({ cls: "wd-empty", text: "Carregando tarefas\u2026" });
      return;
    }
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
    for (const t of tasks) {
      const dk = dueKey(t);
      if (!dk) continue;
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
    for (const k of Object.keys(byDay)) byDay[k].sort(byPri);
    const visible = overdue.length + todayTasks.length + later.length + Object.values(byDay).reduce((s, a) => s + a.length, 0);
    if (visible === 0) {
      const all = this.tasks.length;
      body.createDiv({ cls: "wd-empty", text: all ? "Nenhuma tarefa bate com os filtros." : "Nenhuma tarefa com data no Todoist. \u{1F389}" });
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
    if (later.length && opts.showLater !== false) {
      const panel = body.createDiv({ cls: "wd-todo-later" });
      const lhd = panel.createDiv({ cls: "wd-todo-ohd" });
      lhd.createSpan({ cls: "wd-todo-laterico", text: "\u203A" });
      lhd.createSpan({ cls: "wd-todo-otitle", text: `Depois (${later.length})` });
      lhd.createSpan({ cls: "wd-todo-otoggle", text: this.laterOpen ? "ocultar \u25BE" : "mostrar \u203A" });
      lhd.onclick = () => {
        this.laterOpen = !this.laterOpen;
        this.rerenderAll();
      };
      if (this.laterOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of later) this.todoRow(list, t);
      }
    }
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
    for (const ev of ["modify", "create", "delete", "rename"])
      this.registerEvent(this.app.vault.on(ev, () => this.schedule()));
  }
  async onClose() {
    var _a;
    (_a = this.unsubTodo) == null ? void 0 : _a.call(this);
    this.unsubTodo = null;
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
  attachTip(card, folder) {
    const recents = recentNotes(folder, 4);
    if (!recents.length) return;
    card.addEventListener("mouseenter", () => this.showTip(card, recents));
    card.addEventListener("mouseleave", () => this.hideTip());
  }
  // ── Calendário ──────────────────────────────────────────────────────────
  renderCalendar(root) {
    var _a, _b, _c, _d, _e;
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
    for (const file of this.app.vault.getMarkdownFiles()) {
      const color = colorFor(file.path);
      if (!color) continue;
      const m = file.basename.match(/^(\d{4}-\d{2}-\d{2})/);
      const d = (_c = normalizeDate((_b = (_a = this.app.metadataCache.getCache(file.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.date)) != null ? _c : m ? m[1] : null;
      if (d) ((_d = byDay[d]) != null ? _d : byDay[d] = []).push({ name: file.basename, file, color });
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
    prev.onclick = () => {
      this.weekOffset--;
      this.render();
    };
    next.onclick = () => {
      this.weekOffset++;
      this.render();
    };
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
        row.onclick = () => void this.openDailyNote(key);
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
      hd.onclick = (e) => {
        e.stopPropagation();
        void this.openDailyNote(key);
      };
      const items = (_e = byDay[key]) != null ? _e : [];
      for (const it of items.slice(0, 3)) {
        const pill = col.createDiv({ cls: "wd-cal-pill" });
        pill.style.setProperty("--wd-src", it.color);
        pill.createSpan({ cls: "wd-cal-pill-dot" });
        pill.createSpan({ cls: "wd-cal-pill-txt", text: it.name.length > 14 ? it.name.slice(0, 14) + "\u2026" : it.name });
        pill.onclick = () => this.app.workspace.getLeaf(false).openFile(it.file);
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
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (normalizeDate((_b = (_a = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.date) === key) return f;
    }
    return null;
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
    if (this.isHidden(SEC_PARA)) return;
    if (this.navPath && this.isHidden(this.topFolderOf(this.navPath))) this.navPath = null;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "COFRE" });
    const grid = sec.createDiv({ cls: "wd-para-grid" });
    const vaultRoot = this.app.vault.getRoot();
    const folders = vaultRoot.children.filter((c) => c instanceof import_obsidian.TFolder).filter((f) => !f.name.startsWith(".")).sort((a, b) => a.name.localeCompare(b.name, "pt"));
    const activeRoot = this.navPath ? this.topFolderOf(this.navPath) : null;
    let idx = 0;
    for (const folder of folders) {
      if (this.isHidden(folder.path)) continue;
      const meta = folderMeta(this.app, folder);
      const stats = folderStats(folder);
      const cover = coverInFolder(this.app, folder);
      const navigable = subFolders(folder).length > 0 || filesIn(folder).length > 0;
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
      this.urgencyBadge(card, urgencyStats(this.app, folder));
      const body = card.createDiv({ cls: "wd-card-body" });
      const top = body.createDiv({ cls: "wd-card-top" });
      renderIcon(top.createSpan({ cls: "wd-icon" }), meta.icon);
      top.createSpan({ cls: "wd-count", text: countText(stats) });
      body.createDiv({ cls: "wd-label", text: meta.label });
      body.createDiv({ cls: "wd-folder", text: folder.path });
      if (navigable) body.createDiv({ cls: "wd-has-subs", text: isActive ? "fechar \u25BE" : "abrir \u203A" });
      const rv = reviewedStats(this.app, folder);
      if (rv.total > 0) {
        const bar = body.createDiv({ cls: "wd-progress" });
        bar.setAttr("title", `${rv.reviewed}/${rv.total} revisadas`);
        const fill = bar.createDiv({ cls: "wd-progress-fill" });
        fill.style.width = `${Math.round(rv.reviewed / rv.total * 100)}%`;
      }
      this.attachTip(card, folder);
      card.onclick = () => {
        if (navigable) {
          this.navPath = isActive ? null : folder.path;
          this.searchTerm = "";
          this.render();
        } else revealInExplorer(this.app, folder);
      };
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
    if (rel.length) rootSeg.onclick = () => {
      this.navPath = rootPath;
      this.searchTerm = "";
      this.render();
    };
    let acc = rootPath;
    rel.forEach((part, i) => {
      crumb.createSpan({ cls: "wd-crumb-sep", text: "\u203A" });
      const isLast = i === rel.length - 1;
      acc = `${acc}/${part}`;
      const segPath = acc;
      const seg = crumb.createSpan({ cls: "wd-crumb-seg" + (isLast ? " wd-crumb-cur" : ""), text: part });
      if (!isLast) seg.onclick = () => {
        this.navPath = segPath;
        this.searchTerm = "";
        this.render();
      };
    });
    const close = crumb.createSpan({ cls: "wd-crumb-close", text: "\u2715" });
    close.setAttr("title", "Fechar");
    close.onclick = () => {
      this.navPath = null;
      this.render();
    };
    const searchWrap = panel.createDiv({ cls: "wd-search-wrap" });
    const searchInput = searchWrap.createEl("input", {
      cls: "wd-search",
      attr: { type: "text", placeholder: "filtrar\u2026", value: this.searchTerm }
    });
    searchInput.addEventListener("input", () => {
      this.searchTerm = searchInput.value;
      const term = this.searchTerm.toLowerCase();
      panel.querySelectorAll(".wd-sub-card").forEach((el) => {
        var _a, _b, _c;
        const lbl = (_c = (_b = (_a = el.querySelector(".wd-label")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.toLowerCase()) != null ? _c : "";
        el.style.display = lbl.includes(term) ? "" : "none";
      });
      panel.querySelectorAll(".wd-note-row, .wd-note-card").forEach((el) => {
        var _a, _b;
        const name = ((_b = (_a = el.querySelector(".wd-note-name, .wd-note-card-name")) == null ? void 0 : _a.textContent) != null ? _b : "").toLowerCase();
        el.style.display = name.includes(term) ? "" : "none";
      });
    });
    const subs = subFolders(folder);
    if (subs.length) {
      const sgrid = panel.createDiv({ cls: "wd-proj-grid" });
      for (const sf of subs) {
        const status = readFolderStatus(this.app, sf);
        const stats = folderStats(sf);
        const cover = coverInFolder(this.app, sf);
        const deeper = subFolders(sf).length > 0;
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
        this.urgencyBadge(card, urgencyStats(this.app, sf));
        const body = card.createDiv({ cls: "wd-card-body" });
        const top = body.createDiv({ cls: "wd-card-top" });
        if (customIcon) renderIcon(top.createSpan({ cls: "wd-icon wd-sub-icon" }), customIcon);
        top.createSpan({ cls: "wd-count", text: countText(stats) });
        if (deeper) top.createSpan({ cls: "wd-sub-arrow", text: "\u203A" });
        const label = body.createDiv({ cls: "wd-label", text: sf.name });
        if (status === "cancelled") label.addClass("wd-strike");
        if (status !== "cancelled") {
          const rv = reviewedStats(this.app, sf);
          if (rv.total > 0) {
            const bar = body.createDiv({ cls: "wd-progress" });
            bar.setAttr("title", `${rv.reviewed}/${rv.total} revisadas`);
            const fill = bar.createDiv({ cls: "wd-progress-fill" });
            fill.style.width = `${Math.round(rv.reviewed / rv.total * 100)}%`;
          }
        }
        if (status === "cancelled") {
          card.style.cursor = "default";
        } else {
          this.attachTip(card, sf);
          card.onclick = () => {
            this.navPath = sf.path;
            this.searchTerm = "";
            this.render();
          };
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
    var _a;
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
    const counts = {};
    for (const f of this.app.vault.getMarkdownFiles()) {
      const d = new Date(f.stat.ctime);
      if (d.getFullYear() !== year) continue;
      const key = toKey(d);
      counts[key] = ((_a = counts[key]) != null ? _a : 0) + 1;
    }
    const entries = Object.entries(counts).map(([date, n]) => ({
      date,
      intensity: n,
      color: "green",
      content: `${n} nota(s)`
    }));
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
    let totalNotes = 0, totalReviewed = 0, createdThisWeek = 0;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1e3;
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.name === "status.md") continue;
      totalNotes++;
      if (((_b = (_a = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.reviewed) === true) totalReviewed++;
      if (f.stat.ctime >= weekAgo) createdThisWeek++;
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
      const rv = reviewedStats(this.app, folder);
      if (rv.total === 0) continue;
      const meta = folderMeta(this.app, folder);
      const pct = Math.round(rv.reviewed / rv.total * 100);
      const row = table.createDiv({ cls: "wd-stat-row" });
      row.style.setProperty("--accent", meta.accent);
      const nameEl = row.createDiv({ cls: "wd-stat-folder" });
      renderIcon(nameEl.createSpan({ cls: "wd-stat-icon" }), meta.icon);
      nameEl.createSpan({ text: meta.label });
      row.createDiv({ cls: "wd-stat-count", text: `${rv.total}` });
      const barWrap = row.createDiv({ cls: "wd-stat-bar" });
      barWrap.setAttr("title", `${rv.reviewed}/${rv.total} revisadas (${pct}%)`);
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
    btnPend.onclick = (e) => {
      e.stopPropagation();
      this.reviewFilter = !this.reviewFilter;
      this.render();
    };
    const btnL = tog.createSpan({ cls: "wd-view-btn" + (!isGrid ? " wd-view-active" : ""), text: "\u2261" });
    btnL.setAttr("title", "Lista");
    btnL.onclick = async (e) => {
      e.stopPropagation();
      this.plugin.settings.noteView = "list";
      await this.plugin.saveSettings();
      this.render();
    };
    const btnG = tog.createSpan({ cls: "wd-view-btn" + (isGrid ? " wd-view-active" : ""), text: "\u229E" });
    btnG.setAttr("title", "Colunas");
    btnG.onclick = async (e) => {
      e.stopPropagation();
      this.plugin.settings.noteView = "grid";
      await this.plugin.saveSettings();
      this.render();
    };
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
        if (st !== "cancelled") card.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
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
        if (st !== "cancelled") row.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
      }
    }
  }
  // ── Gráfico de crescimento ────────────────────────────────────────────────
  renderGrowth(root) {
    var _a, _b;
    if (this.isHidden(SEC_GROW)) return;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "CRESCIMENTO DO COFRE" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const btnDay = ctrls.createSpan({ cls: "wd-view-btn" + (!this.growthCumulative ? " wd-view-active" : ""), text: "dia" });
    btnDay.setAttr("title", "Notas criadas por dia");
    btnDay.onclick = (e) => {
      e.stopPropagation();
      this.growthCumulative = false;
      this.render();
    };
    const btnCum = ctrls.createSpan({ cls: "wd-view-btn" + (this.growthCumulative ? " wd-view-active" : ""), text: "total" });
    btnCum.setAttr("title", "Total acumulado no per\xEDodo");
    btnCum.onclick = (e) => {
      e.stopPropagation();
      this.growthCumulative = true;
      this.render();
    };
    const counts = {};
    for (const f of this.app.vault.getMarkdownFiles()) {
      const key = toKey(new Date(f.stat.ctime));
      counts[key] = ((_a = counts[key]) != null ? _a : 0) + 1;
    }
    const DAYS = import_obsidian.Platform.isPhone ? 15 : 30;
    const days = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const key = toKey(d);
      const [, m, day] = key.split("-");
      days.push({ key, count: (_b = counts[key]) != null ? _b : 0, label: `${day}/${m}` });
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
    open.onclick = (e) => {
      e.stopPropagation();
      void this.plugin.openTodoist();
    };
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
      refresh.onclick = (e) => {
        e.stopPropagation();
        void this.fetchSync(true);
      };
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
      name.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
      if (this.conflictConfirm === f.path) {
        const yes = row.createSpan({ cls: "wd-sync-cyes", text: "apagar?" });
        yes.onclick = async () => {
          await this.app.vault.trash(f, false);
          this.conflictConfirm = null;
          this.renderSection("sync");
        };
        const no = row.createSpan({ cls: "wd-sync-cno", text: "cancelar" });
        no.onclick = () => {
          this.conflictConfirm = null;
          this.renderSection("sync");
        };
      } else {
        const del = row.createSpan({ cls: "wd-sync-cdel" });
        (0, import_obsidian.setIcon)(del, "trash-2");
        del.setAttr("title", "Apagar c\xF3pia de conflito (vai para a lixeira)");
        del.onclick = () => {
          this.conflictConfirm = f.path;
          this.renderSection("sync");
        };
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
  }
  async onload() {
    await this.loadSettings();
    this.todo = new TodoistController(this.app, this, this);
    this.registerView(VIEW_TYPE, (leaf) => new DashboardView(leaf, this));
    this.registerView(TODOIST_VIEW_TYPE, (leaf) => new TodoistView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "Abrir Werus Dashboard", () => this.open());
    this.addRibbonIcon("list-checks", "Abrir Todoist (Werus)", () => this.openTodoist());
    this.addCommand({ id: "open-dashboard", name: "Abrir Dashboard", callback: () => this.open() });
    this.addCommand({ id: "open-todoist", name: "Abrir Todoist", callback: () => this.openTodoist() });
    this.addSettingTab(new WerusSettingTab(this.app, this));
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
    const valid = ["stats", "todoist", "para", "sync", "heatmap", "growth", "calendar"];
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
  onunload() {
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
        b.onclick = () => {
          this.v.priority = api;
          renderPri();
        };
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
          chip.onclick = () => {
            const i = this.v.labels.indexOf(l);
            if (i >= 0) this.v.labels.splice(i, 1);
            else this.v.labels.push(l);
            renderLabels();
          };
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
          chip.createSpan({ cls: "wd-label-dot" }).style.background = (_b = TODOIST_COLORS[l.color]) != null ? _b : LABEL_FALLBACK;
          chip.createSpan({ text: `@${l.name}` });
          chip.onclick = async () => {
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
          };
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
      iconBtn.onclick = () => openIconPopover(iconBtn, pkg.icon, async (ic) => {
        pkg.icon = ic;
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        fillIcon();
      });
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
      if (idx > 0) up.onclick = async () => {
        await plugin.movePackage(idx, -1);
        this.display();
      };
      const down = row.createSpan({ cls: "wd-pkg-mini" + (idx === pkgs.length - 1 ? " wd-disabled" : "") });
      (0, import_obsidian.setIcon)(down, "chevron-down");
      down.setAttr("title", "Mover para baixo");
      if (idx < pkgs.length - 1) down.onclick = async () => {
        await plugin.movePackage(idx, 1);
        this.display();
      };
      const del = row.createSpan({ cls: "wd-pkg-mini wd-pkg-del" });
      (0, import_obsidian.setIcon)(del, "trash-2");
      del.setAttr("title", "Remover pacote");
      del.onclick = async () => {
        plugin.settings.taskPackages = pkgs.filter((x) => x !== pkg);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        this.display();
      };
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5cbi8vIHVpZCBjdXJ0byBlIGVzdFx1MDBFMXZlbCAocGFjb3RlcyBkZSB0YXJlZmFzKS5cbmZ1bmN0aW9uIHVpZCgpOiBzdHJpbmcge1xuICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KTtcbn1cblxudHlwZSBTdGF0dXMgPSBcInByb2dyZXNzXCIgfCBcInBhdXNlZFwiIHwgXCJjYW5jZWxsZWRcIjtcbnR5cGUgU2VjdGlvbklkID0gXCJjYWxlbmRhclwiIHwgXCJwYXJhXCIgfCBcImhlYXRtYXBcIiB8IFwiZ3Jvd3RoXCIgfCBcInN0YXRzXCIgfCBcInRvZG9pc3RcIiB8IFwic3luY1wiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhc2hTZXR0aW5ncyA9IHtcbiAgc2VjdGlvbk9yZGVyOiBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXSxcbiAgY29tcGFjdDogZmFsc2UsXG4gIGhpZGRlbjogW10sXG4gIG5vdGVWaWV3OiBcImxpc3RcIixcbiAgY2FsZW5kYXJTb3VyY2VzOiBbXG4gICAgeyBwYXRoOiBcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiLCBjb2xvcjogXCIjM0I4MkY2XCIsIG9uOiB0cnVlIH0sXG4gICAgeyBwYXRoOiBcIjUwLkRpXHUwMEUxcmlvXCIsICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMTBCOTgxXCIsIG9uOiB0cnVlIH0sXG4gIF0sXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbiAgdG9kb2lzdERheVJhbmdlOiA3LFxuICB0b2RvaXN0RmlsdGVyczogeyBwcm9qZWN0czogW10sIGxhYmVsczogW10gfSxcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiB0cnVlLFxuICB0b2RvaXN0U2hvd0xhYmVsczogZmFsc2UsXG4gIHN5bmN0aGluZ1VybDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIixcbiAgc3luY3RoaW5nQXBpS2V5OiBcIlwiLFxuICBzeW5jdGhpbmdGb2xkZXJJZDogXCJcIixcbiAgc3luY3RoaW5nU2hvd0NvdW50czogZmFsc2UsXG4gIHRhc2tQYWNrYWdlczogW10sXG4gIHBhY2thZ2VDb25maXJtOiBcIm1hbnlcIixcbn07XG5cbmludGVyZmFjZSBQYXJhU2VjdGlvbiB7XG4gIGZvbGRlcjogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGFjY2VudDogc3RyaW5nO1xufVxuXG4vLyBQYXN0YXMgXCJjb25oZWNpZGFzXCIgZG8gUEFSQTogbWFudFx1MDBFQW0gXHUwMEVEY29uZSwgclx1MDBGM3R1bG8gZSBjb3IgZml4b3MuIEFzIGRlbWFpcyBwYXN0YXNcbi8vIGRvIGNvZnJlIHNcdTAwRTNvIHJlbmRlcml6YWRhcyBjb20gY29yIGF1dG9tXHUwMEUxdGljYSBlIFx1MDBFRGNvbmUgcGFkclx1MDBFM28gKG91IG8gaWNvbjogZG8gc3RhdHVzLm1kKS5cbmNvbnN0IFBBUkE6IFBhcmFTZWN0aW9uW10gPSBbXG4gIHsgZm9sZGVyOiBcIjAwLkluYm94XCIsICAgICBpY29uOiBcIlx1RDgzRFx1RENFNVwiLCBsYWJlbDogXCJJbmJveFwiLCAgICBhY2NlbnQ6IFwiIzYzNjZGMVwiIH0sXG4gIHsgZm9sZGVyOiBcIjEwLlByb2plY3RzXCIsICBpY29uOiBcIlx1RDgzRFx1REU4MFwiLCBsYWJlbDogXCJQcm9qZXRvc1wiLCBhY2NlbnQ6IFwiIzEwQjk4MVwiIH0sXG4gIHsgZm9sZGVyOiBcIjIwLkFyZWFzXCIsICAgICBpY29uOiBcIlx1RDgzQ1x1REZBRlwiLCBsYWJlbDogXCJcdTAwQzFyZWFzXCIsICAgIGFjY2VudDogXCIjRjU5RTBCXCIgfSxcbiAgeyBmb2xkZXI6IFwiMzAuUmVzb3VyY2VzXCIsIGljb246IFwiXHVEODNEXHVEQ0RBXCIsIGxhYmVsOiBcIlJlY3Vyc29zXCIsIGFjY2VudDogXCIjM0I4MkY2XCIgfSxcbiAgeyBmb2xkZXI6IFwiNDAuQXJjaGl2ZVwiLCAgIGljb246IFwiXHVEODNEXHVEREM0XHVGRTBGXCIsICBsYWJlbDogXCJBcnF1aXZvXCIsICBhY2NlbnQ6IFwiIzZCNzI4MFwiIH0sXG5dO1xuY29uc3QgUEFSQV9NQVAgPSBuZXcgTWFwKFBBUkEubWFwKHAgPT4gW3AuZm9sZGVyLCBwXSkpO1xuXG4vLyBQYWxldGEgcGFyYSBjb2xvcmlyIHBhc3RhcyBkZXNjb25oZWNpZGFzIGRlIGZvcm1hIGVzdFx1MDBFMXZlbCAocG9yIGhhc2ggZG8gbm9tZSkuXG5jb25zdCBBQ0NFTlRTID0gW1wiIzYzNjZGMVwiLFwiIzEwQjk4MVwiLFwiI0Y1OUUwQlwiLFwiIzNCODJGNlwiLFwiI0VDNDg5OVwiLFwiIzhCNUNGNlwiLFwiIzE0QjhBNlwiLFwiI0VGNDQ0NFwiXTtcblxuY29uc3QgREFZX1NIT1JUID0gW1wiU2VnXCIsIFwiVGVyXCIsIFwiUXVhXCIsIFwiUXVpXCIsIFwiU2V4XCIsIFwiU1x1MDBFMWJcIiwgXCJEb21cIl07XG5jb25zdCBNT05USF9TSE9SVCA9IFtcIkphblwiLFwiRmV2XCIsXCJNYXJcIixcIkFiclwiLFwiTWFpXCIsXCJKdW5cIixcIkp1bFwiLFwiQWdvXCIsXCJTZXRcIixcIk91dFwiLFwiTm92XCIsXCJEZXpcIl07XG5jb25zdCBJTUdfRVhUID0gW1wicG5nXCIsXCJqcGdcIixcImpwZWdcIixcIndlYnBcIixcImdpZlwiLFwic3ZnXCJdO1xuXG4vLyBQYXN0YSByYWl6IGRhcyBub3RhcyBkaVx1MDBFMXJpYXMgKGNyaWFkYXMgYW8gY2xpY2FyIG51bSBkaWEgZG8gY2FsZW5kXHUwMEUxcmlvKS5cbmNvbnN0IERBSUxZX0ZPTERFUiA9IFwiNTAuRGlcdTAwRTFyaW9cIjtcbi8vIFRlbXBsYXRlIG9wY2lvbmFsOyBwbGFjZWhvbGRlcnMge3tkYXRlfX0gKFlZWVktTU0tREQpIGUge3t0aXRsZX19IChkYXRhIHBvciBleHRlbnNvKS5cbmNvbnN0IERBSUxZX1RFTVBMQVRFID0gXCJNb2RlbG9zL05vdGEgRGlcdTAwRTFyaWEubWRcIjtcblxuY29uc3QgU1RBVFVTX0lDT046IFJlY29yZDxTdGF0dXMsIHN0cmluZz4gPSB7XG4gIHByb2dyZXNzOiBcIlx1MjVCNlwiLCBwYXVzZWQ6IFwiXHUyM0Y4XCIsIGNhbmNlbGxlZDogXCJcdTI3MTVcIixcbn07XG5cbmNvbnN0IFNFQ19DQUwgPSBcInNlYzpjYWxlbmRhclwiO1xuY29uc3QgU0VDX1BBUkEgPSBcInNlYzpwYXJhXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5jb25zdCBTRUNfVE9ETyA9IFwic2VjOnRvZG9pc3RcIjtcbmNvbnN0IFNFQ19TWU5DID0gXCJzZWM6c3luY1wiO1xuXG4vLyBSXHUwMEYzdHVsb3MgYW1pZ1x1MDBFMXZlaXMgZGFzIHNlXHUwMEU3XHUwMEY1ZXMgKHVzYWRvcyBuYSBhYmEgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlxuY29uc3QgU0VDVElPTl9MQUJFTDogUmVjb3JkPFNlY3Rpb25JZCwgc3RyaW5nPiA9IHtcbiAgc3RhdHM6ICAgIFwiRXN0YXRcdTAwRURzdGljYXNcIixcbiAgdG9kb2lzdDogIFwiVGFyZWZhc1wiLFxuICBwYXJhOiAgICAgXCJDb2ZyZSAocGFzdGFzKVwiLFxuICBzeW5jOiAgICAgXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzb1wiLFxuICBoZWF0bWFwOiAgXCJBdGl2aWRhZGUgZG8gY29mcmVcIixcbiAgZ3Jvd3RoOiAgIFwiQ3Jlc2NpbWVudG8gZG8gY29mcmVcIixcbiAgY2FsZW5kYXI6IFwiUmVsYXRcdTAwRjNyaW9zXCIsXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRvZG9pc3RUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEk6IDEuLjQsIG9uZGUgNCA9IHVyZ2VudGUgKD0gcDEgbmEgVUkpXG4gIGR1ZT86IHsgZGF0ZTogc3RyaW5nOyBkYXRldGltZT86IHN0cmluZzsgc3RyaW5nPzogc3RyaW5nOyBpc19yZWN1cnJpbmc/OiBib29sZWFuIH0gfCBudWxsO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xuICBpc19jb21wbGV0ZWQ/OiBib29sZWFuO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG4vLyBObyBtb2RvIFwibWFueVwiLCBsYW5cdTAwRTdhciBtYWlzIHF1ZSBpc3RvIHBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvLlxuY29uc3QgTEFVTkNIX0NPTkZJUk1fTUlOID0gNTtcblxuLy8gXHUwMENEY29uZXMgc3VnZXJpZG9zIHBhcmEgb3MgcGFjb3RlcyAobm9tZXMgTHVjaWRlOyByZW5kZXJpemFkb3MgcG9yIHJlbmRlckljb24pLlxuY29uc3QgUEtHX0lDT05TID0gW1xuICBcInN1bnJpc2VcIiwgXCJzdW5cIiwgXCJzdW5zZXRcIiwgXCJtb29uXCIsIFwiY29mZmVlXCIsIFwidXRlbnNpbHNcIiwgXCJkdW1iYmVsbFwiLCBcImJvb2stb3BlblwiLFxuICBcImJyaWVmY2FzZVwiLCBcImdyYWR1YXRpb24tY2FwXCIsIFwiaG9tZVwiLCBcInNob3BwaW5nLWNhcnRcIiwgXCJoZWFydFwiLCBcImRyb3BsZXRcIiwgXCJwaWxsXCIsXG4gIFwiYmVkXCIsIFwiY2xvY2tcIiwgXCJjYWxlbmRhclwiLCBcImNoZWNrLWNoZWNrXCIsIFwibGlzdC1jaGVja3NcIiwgXCJ0YXJnZXRcIiwgXCJmbGFtZVwiLCBcInphcFwiLFxuICBcInN0YXJcIiwgXCJzcGFya2xlc1wiLCBcInJvY2tldFwiLCBcImJydXNoXCIsIFwibXVzaWNcIiwgXCJnYW1lcGFkLTJcIiwgXCJkb2dcIixcbl07XG5cbi8vIFNlcGFyYSBhcyBldGlxdWV0YXMgaW5saW5lIChAZXRpcXVldGEpIGRvIHRleHRvIGRlIHVtYSBsaW5oYSBkZSB0YXJlZmEuXG4vLyBEZXZvbHZlIG8gdFx1MDBFRHR1bG8gbGltcG8gKGVzdGlsbyBRdWljayBBZGQgZG8gVG9kb2lzdCkgKyBldGlxdWV0YXMgY29tYmluYWRhc1xuLy8gKGFzIGRvIHBhY290ZSBwcmltZWlybywgZGVwb2lzIGFzIGlubGluZSwgc2VtIGR1cGxpY2FyKS5cbmZ1bmN0aW9uIHNwbGl0VGFza0xhYmVscyhsaW5lOiBzdHJpbmcsIHBrZ0xhYmVsczogc3RyaW5nW10gPSBbXSk6IHsgdGl0bGU6IHN0cmluZzsgbGFiZWxzOiBzdHJpbmdbXSB9IHtcbiAgY29uc3QgaW5saW5lOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBzdHJpcHBlZCA9IGxpbmUucmVwbGFjZSgvQChbXFxwe0x9XFxwe059X10rKS9ndSwgKF9tLCBuYW1lOiBzdHJpbmcpID0+IHsgaW5saW5lLnB1c2gobmFtZSk7IHJldHVybiBcIlwiOyB9KVxuICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csIFwiIFwiKS50cmltKCk7XG4gIGNvbnN0IHRpdGxlID0gc3RyaXBwZWQgfHwgbGluZS50cmltKCk7XG4gIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5wa2dMYWJlbHMsIC4uLmlubGluZV0pXTtcbiAgcmV0dXJuIHsgdGl0bGUsIGxhYmVscyB9O1xufVxuXG4vLyBQb3BvdmVyIGZsdXR1YW50ZSBnZW5cdTAwRTlyaWNvLCBhbmNvcmFkbyBudW0gZWxlbWVudG8uIGBmaWxsKGJvZHksIGNsb3NlKWAgbW9udGEgb1xuLy8gY29udGVcdTAwRkFkby4gRmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjYXBlIChvcHRzLm9uQ2xvc2Ugcm9kYSBhbnRlcyBkZSByZW1vdmVyKS5cbmZ1bmN0aW9uIG9wZW5Qb3BvdmVyKFxuICBhbmNob3I6IEhUTUxFbGVtZW50LFxuICBmaWxsOiAoYm9keTogSFRNTEVsZW1lbnQsIGNsb3NlOiAoKSA9PiB2b2lkKSA9PiB2b2lkLFxuICBvcHRzOiB7IGNscz86IHN0cmluZzsgd2lkdGg/OiBudW1iZXI7IG9uQ2xvc2U/OiAoKSA9PiB2b2lkIH0gPSB7fSxcbik6ICgpID0+IHZvaWQge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndkLXBvcFwiKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gIGNvbnN0IHBvcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcFwiICsgKG9wdHMuY2xzID8gXCIgXCIgKyBvcHRzLmNscyA6IFwiXCIpIH0pO1xuICBpZiAob3B0cy53aWR0aCkgcG9wLnN0eWxlLndpZHRoID0gYCR7b3B0cy53aWR0aH1weGA7XG5cbiAgY29uc3Qgb25Eb2MgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBOb2RlO1xuICAgIGlmICghcG9wLmNvbnRhaW5zKHQpICYmIHQgIT09IGFuY2hvciAmJiAhYW5jaG9yLmNvbnRhaW5zKHQpKSBjbG9zZSgpO1xuICB9O1xuICBjb25zdCBvbktleSA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7IGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgY2xvc2UoKTsgfTtcbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgb3B0cy5vbkNsb3NlPy4oKTtcbiAgICBwb3AucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRvYywgdHJ1ZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXksIHRydWUpO1xuICB9XG5cbiAgZmlsbChwb3AsIGNsb3NlKTtcblxuICBjb25zdCByID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBwb3Auc3R5bGUudG9wID0gYCR7ci5ib3R0b20gKyA0fXB4YDtcbiAgcG9wLnN0eWxlLmxlZnQgPSBgJHtyLmxlZnR9cHhgO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGNvbnN0IHByID0gcG9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChwci5yaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgcG9wLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCB3aW5kb3cuaW5uZXJXaWR0aCAtIHByLndpZHRoIC0gOCl9cHhgO1xuICAgIGlmIChwci5ib3R0b20gPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSBwb3Auc3R5bGUudG9wID0gYCR7TWF0aC5tYXgoOCwgci50b3AgLSBwci5oZWlnaHQgLSA0KX1weGA7XG4gIH0pO1xuXG4gIC8vIFJlZ2lzdHJhIGRlcG9pcyBkbyBjbGlxdWUgZGUgYWJlcnR1cmEgcGFyYSBuXHUwMEUzbyBmZWNoYXIgaW1lZGlhdGFtZW50ZS5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRvYywgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXksIHRydWUpO1xuICB9LCAwKTtcbiAgcmV0dXJuIGNsb3NlO1xufVxuXG4vLyBQb3BvdmVyIGRlIHNlbGVcdTAwRTdcdTAwRTNvIGRlIFx1MDBFRGNvbmUgKHBhbGV0YSkuIGBjdXJyZW50YCA9IFx1MDBFRGNvbmUgc2VsZWNpb25hZG8gKGRlc3RhY2EpLlxuZnVuY3Rpb24gb3Blbkljb25Qb3BvdmVyKGFuY2hvcjogSFRNTEVsZW1lbnQsIGN1cnJlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCwgb25QaWNrOiAoaWNvbjogc3RyaW5nIHwgdW5kZWZpbmVkKSA9PiB2b2lkKSB7XG4gIG9wZW5Qb3BvdmVyKGFuY2hvciwgKHBvcCwgY2xvc2UpID0+IHtcbiAgICBjb25zdCBub25lID0gcG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb25vcHQgd2QtcGtnLWljb25ub25lXCIgKyAoIWN1cnJlbnQgPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IFwiXHUyMDE0XCIgfSk7XG4gICAgbm9uZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJTZW0gXHUwMEVEY29uZVwiKTtcbiAgICBub25lLm9uY2xpY2sgPSAoKSA9PiB7IG9uUGljayh1bmRlZmluZWQpOyBjbG9zZSgpOyB9O1xuICAgIGZvciAoY29uc3QgaWMgb2YgUEtHX0lDT05TKSB7XG4gICAgICBjb25zdCBvcHQgPSBwb3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbm9wdFwiICsgKGN1cnJlbnQgPT09IGljID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgcmVuZGVySWNvbihvcHQsIGljKTtcbiAgICAgIG9wdC5zZXRBdHRyKFwidGl0bGVcIiwgaWMpO1xuICAgICAgb3B0Lm9uY2xpY2sgPSAoKSA9PiB7IG9uUGljayhpYyk7IGNsb3NlKCk7IH07XG4gICAgfVxuICB9LCB7IGNsczogXCJ3ZC1pY29uLXBvcFwiIH0pO1xufVxuXG4vLyBCdXNjYSBhcyB0YXJlZmFzIGF0aXZhcyAoblx1MDBFM28gY29uY2x1XHUwMEVEZGFzKSB2aWEgQVBJIHVuaWZpY2FkYSB2MSAoYSBSRVNUIHYyIGZvaVxuLy8gYXBvc2VudGFkYSBcdTIxOTIgcmVzcG9uZGlhIDQxMCkuIEEgdjEgXHUwMEU5IHBhZ2luYWRhOiB7IHJlc3VsdHMsIG5leHRfY3Vyc29yIH0uXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RUYXNrW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIC8vIHYxIGVudmVsb3BhIGVtIHJlc3VsdHM7IHRvbGVyYSByZXNwb3N0YSBjb21vIGFycmF5IHB1cm8gcG9yIHNlZ3VyYW5cdTAwRTdhLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RUYXNrW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdFByb2plY3Qge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8vIEJ1c2NhIG9zIHByb2pldG9zIChwYXJhIG8gZmlsdHJvKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhIGRhcyB0YXJlZmFzLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFByb2plY3RbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Byb2plY3RzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RQcm9qZWN0W107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RQcm9qZWN0W10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdExhYmVsIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBjb2xvcjogc3RyaW5nOyAgIC8vIG5vbWUgZGEgcGFsZXRhIChleC46IFwiY2hhcmNvYWxcIilcbn1cblxuLy8gQnVzY2EgYXMgZXRpcXVldGFzIHBlc3NvYWlzIChwYXJhIGNvbG9yaXIgb3MgY2hpcHMpLiBNZXNtYSBBUEkgdjEgcGFnaW5hZGEuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdExhYmVsW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0TGFiZWxbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvbGFiZWxzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RMYWJlbFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0TGFiZWxbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jdGhpbmcgKEFQSSBSRVNUKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFNURm9sZGVyIHsgaWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBwYXVzZWQ6IGJvb2xlYW4gfVxuaW50ZXJmYWNlIFNURGV2aWNlIHsgZGV2aWNlSUQ6IHN0cmluZzsgbmFtZTogc3RyaW5nIH1cbmludGVyZmFjZSBTVFN0YXR1cyB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZXJyb3JzOiBudW1iZXI7IHB1bGxFcnJvcnM6IG51bWJlciB9XG5pbnRlcmZhY2UgU1RDb21wbGV0aW9uIHsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXIgfVxuXG5pbnRlcmZhY2UgU3luY0RldlJvdyB7IG5hbWU6IHN0cmluZzsgb25saW5lOiBib29sZWFuOyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlcjsgbGFzdFNlZW46IHN0cmluZyB9XG5pbnRlcmZhY2UgU3luY0RhdGEgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGZvbGRlckxhYmVsOiBzdHJpbmc7IGVycm9yczogbnVtYmVyOyBkZXZpY2VzOiBTeW5jRGV2Um93W10gfVxuXG5mdW5jdGlvbiBodW1hbkJ5dGVzKG46IG51bWJlcik6IHN0cmluZyB7XG4gIGlmICghbikgcmV0dXJuIFwiMCBCXCI7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwNDg1NzYpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQobiA8IDEwMjQwID8gMSA6IDApfSBLQmA7XG4gIHJldHVybiBgJHsobiAvIDEwNDg1NzYpLnRvRml4ZWQobiA8IDEwNDg1NzYwID8gMSA6IDApfSBNQmA7XG59XG5cbmZ1bmN0aW9uIHJlbFRpbWUoaXNvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICBpZiAoaXNOYU4odCkgfHwgdCA8IDEpIHJldHVybiBcIlx1MjAxNFwiO1xuICBjb25zdCBzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIHQpIC8gMTAwMCk7XG4gIGlmIChzIDwgNjApIHJldHVybiBcImFnb3JhXCI7XG4gIGlmIChzIDwgMzYwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gNjApfSBtaW5gO1xuICBpZiAocyA8IDg2NDAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyAzNjAwKX0gaGA7XG4gIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDg2NDAwKX0gZGA7XG59XG5cbi8vIEdFVCBnZW5cdTAwRTlyaWNvIG5hIEFQSSBkbyBTeW5jdGhpbmcgKGhlYWRlciBYLUFQSS1LZXk7IHJlcXVlc3RVcmwgaWdub3JhIENPUlMpLlxuYXN5bmMgZnVuY3Rpb24gc3RHZXQ8VD4oYmFzZTogc3RyaW5nLCBrZXk6IHN0cmluZywgcGF0aDogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IHVybCA9IGJhc2UucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoeyB1cmwsIG1ldGhvZDogXCJHRVRcIiwgaGVhZGVyczogeyBcIlgtQVBJLUtleVwiOiBrZXkgfSwgdGhyb3c6IGZhbHNlIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwiQVBJIGtleSBpbnZcdTAwRTFsaWRhICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFQ7XG59XG5cbi8vIFVSTCBwYXJhIGFicmlyIGEgdGFyZWZhIG5vIFRvZG9pc3QgKHVzYSBhIGRvIHBheWxvYWQgb3UgbW9udGEgYSBwYXJ0aXIgZG8gaWQpLlxuZnVuY3Rpb24gdGFza1VybCh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gIHJldHVybiB0LnVybCA/PyBgaHR0cHM6Ly9hcHAudG9kb2lzdC5jb20vYXBwL3Rhc2svJHt0LmlkfWA7XG59XG5cbi8vIENvbmNsdWkgKGZlY2hhKSB1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFBPU1Qgc2VtIGNvcnBvOyAyMDQgPSBzdWNlc3NvLiBGYXNlIDguMi5cbmFzeW5jIGZ1bmN0aW9uIGNsb3NlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vY2xvc2VgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBFc2NyaXRhOiBjcmlhciAvIGVkaXRhciAvIG1vdmVyIC8gZXhjbHVpciAodjAuOC4wKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ2FtcG9zIGdyYXZcdTAwRTF2ZWlzLiBUb2RvcyBvcGNpb25haXMgXHUyMDE0IG5vIGVkaXRhciBtYW5kbyBzXHUwMEYzIG8gcXVlIG11ZG91LlxuaW50ZXJmYWNlIFRvZG9pc3RXcml0ZSB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eT86IG51bWJlcjsgICAgIC8vIDEuLjQgKDQgPSB1cmdlbnRlIC8gcDEgbmEgVUkpXG4gIGR1ZV9kYXRlPzogc3RyaW5nOyAgICAgLy8gZGF0YSBmaXhhIFlZWVktTU0tREQgKHZpbmRvIGRvIGNhbGVuZFx1MDBFMXJpbylcbiAgZHVlX3N0cmluZz86IHN0cmluZzsgICAvLyBsaW5ndWFnZW0gbmF0dXJhbDsgXCJubyBkYXRlXCIgbGltcGEgYSBkYXRhXG4gIGR1ZV9sYW5nPzogc3RyaW5nOyAgICAgLy8gXCJwdFwiIFx1MjE5MiBpbnRlcnByZXRhIGVtIHBvcnR1Z3VcdTAwRUFzXG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBqc29uSGVhZGVycyh0b2tlbjogc3RyaW5nKSB7XG4gIHJldHVybiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLCBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9O1xufVxuXG4vLyBDcmlhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzIFx1MjE5MiAyMDAgY29tIGEgdGFyZWZhIGNyaWFkYS5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTxUb2RvaXN0VGFzaz4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUb2RvaXN0VGFzaztcbn1cblxuLy8gRWRpdGEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3Mve2lkfSBcdTIxOTIgMjAwLiBOXHUwMEUzbyB0cm9jYSBkZSBwcm9qZXRvICh1c2UgbW92ZVRvZG9pc3RUYXNrKS5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIE1vdmUgYSB0YXJlZmEgcGFyYSBvdXRybyBwcm9qZXRvLiBQT1NUIC90YXNrcy97aWR9L21vdmUgXHUyMTkyIDIwMC5cbmFzeW5jIGZ1bmN0aW9uIG1vdmVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBwcm9qZWN0X2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L21vdmVgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcHJvamVjdF9pZCB9KSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBFeGNsdWkgYSB0YXJlZmEuIERFTEVURSAvdGFza3Mve2lkfSBcdTIxOTIgMjA0LlxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIENvbnRhIG5vdGFzIHJldmlzYWRhcyAocmV2aWV3ZWQ6IHRydWUpIHZzIHRvdGFsIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIHJldmlld2VkU3RhdHMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHsgcmV2aWV3ZWQ6IG51bWJlcjsgdG90YWw6IG51bWJlciB9IHtcbiAgbGV0IHJldmlld2VkID0gMCwgdG90YWwgPSAwO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikge1xuICAgICAgICB0b3RhbCsrO1xuICAgICAgICBpZiAoYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlKSByZXZpZXdlZCsrO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgcmV0dXJuIHsgcmV2aWV3ZWQsIHRvdGFsIH07XG59XG5cbi8vIENvbnRhIG1kIChleGNldG8gc3RhdHVzLm1kKSBlIGltYWdlbnMgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gZm9sZGVyU3RhdHMoZm9sZGVyOiBURm9sZGVyKTogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9IHtcbiAgbGV0IG1kID0gMCwgaW1nID0gMDtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSBtZCsrO1xuICAgICAgICBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkgaW1nKys7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICByZXR1cm4geyBtZCwgaW1nIH07XG59XG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG5mdW5jdGlvbiBjb3VudFRleHQoc3RhdHM6IHsgbWQ6IG51bWJlcjsgaW1nOiBudW1iZXIgfSk6IHN0cmluZyB7XG4gIGlmIChzdGF0cy5tZCA9PT0gMCAmJiBzdGF0cy5pbWcgPiAwKSByZXR1cm4gYCR7c3RhdHMuaW1nfSBpbWdgO1xuICByZXR1cm4gc3RhdHMuaW1nID4gMCA/IGAke3N0YXRzLm1kfSBub3RhcyBcdTAwQjcgJHtzdGF0cy5pbWd9IGltZ2AgOiBgJHtzdGF0cy5tZH0gbm90YXNgO1xufVxuXG4vLyBBcyBOIG5vdGFzIC5tZCBtb2RpZmljYWRhcyBtYWlzIHJlY2VudGVtZW50ZSBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiByZWNlbnROb3Rlcyhmb2xkZXI6IFRGb2xkZXIsIG46IG51bWJlcik6IFRGaWxlW10ge1xuICBjb25zdCBmaWxlczogVEZpbGVbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikgZmlsZXMucHVzaChjKTtcbiAgICAgIGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICBmaWxlcy5zb3J0KChhLCBiKSA9PiBiLnN0YXQubXRpbWUgLSBhLnN0YXQubXRpbWUpO1xuICByZXR1cm4gZmlsZXMuc2xpY2UoMCwgbik7XG59XG5cbi8vIFBhc3RhIFwiZGUgYXNzZXRzXCI6IHNcdTAwRjMgdGVtIGltYWdlbnMsIG5lbmh1bWEgbm90YSBcdTIxOTIgZXNjb25kaWRhIG5vIG5hdmVnYWRvciBpbnRlcm5vLlxuZnVuY3Rpb24gaXNBc3NldEZvbGRlcihmb2xkZXI6IFRGb2xkZXIpOiBib29sZWFuIHtcbiAgY29uc3QgeyBtZCwgaW1nIH0gPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICByZXR1cm4gaW1nID4gMCAmJiBtZCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gc3ViRm9sZGVycyhmb2xkZXI6IFRGb2xkZXIpOiBURm9sZGVyW10ge1xuICByZXR1cm4gKGZvbGRlci5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgIC5maWx0ZXIoZiA9PiAhaXNBc3NldEZvbGRlcihmKSlcbiAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbn1cblxuZnVuY3Rpb24gY292ZXJJbkZvbGRlcihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIDEuIENhbXBvIGNvdmVyOiBubyBzdGF0dXMubWQgKGFjZWl0YSBjYW1pbmhvIGRpcmV0byBvdSB3aWtpbGluayBbWy4uLl1dKVxuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGlmIChzZikge1xuICAgIGNvbnN0IHJhdyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uY292ZXI7XG4gICAgaWYgKHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgJiYgcmF3LnRyaW0oKSkge1xuICAgICAgY29uc3QgbGlua3BhdGggPSByYXcudHJpbSgpLnJlcGxhY2UoL14hP1xcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0udHJpbSgpO1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChsaW5rcGF0aCwgc2YucGF0aCk7XG4gICAgICBpZiAocmVzb2x2ZWQgaW5zdGFuY2VvZiBURmlsZSAmJiBJTUdfRVhULmluY2x1ZGVzKHJlc29sdmVkLmV4dGVuc2lvbikpXG4gICAgICAgIHJldHVybiBhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKHJlc29sdmVkKTtcbiAgICB9XG4gIH1cbiAgLy8gMi4gRmFsbGJhY2s6IGFycXVpdm8gX2NvdmVyLiogbmEgcGFzdGFcbiAgZm9yIChjb25zdCBjIG9mIGZvbGRlci5jaGlsZHJlbikge1xuICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5iYXNlbmFtZSA9PT0gXCJfY292ZXJcIiAmJiBJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSlcbiAgICAgIHJldHVybiBhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKGMpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiByZWFkRm9sZGVyU3RhdHVzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBTdGF0dXMge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IHMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbmZ1bmN0aW9uIHJlYWROb3RlU3RhdHVzKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFN0YXR1cyB7XG4gIGNvbnN0IHMgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFVyZ1x1MDBFQW5jaWEgKHByb3ByaWVkYWRlIGB1cmdlbmN5YCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG50eXBlIFVyZ2VuY3kgPSBcImFsdGFcIiB8IFwibWVkaWFcIiB8IFwiYmFpeGFcIjtcbmNvbnN0IFVSR0VOQ1lfUkFOSzogUmVjb3JkPFVyZ2VuY3ksIG51bWJlcj4gPSB7IGJhaXhhOiAxLCBtZWRpYTogMiwgYWx0YTogMyB9O1xuY29uc3QgVVJHRU5DWV9DT0xPUjogUmVjb3JkPFVyZ2VuY3ksIHN0cmluZz4gPSB7IGFsdGE6IFwiI0VGNDQ0NFwiLCBtZWRpYTogXCIjRjU5RTBCXCIsIGJhaXhhOiBcIiNFQUIzMDhcIiB9O1xuXG5mdW5jdGlvbiByZWFkTm90ZVVyZ2VuY3koYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogVXJnZW5jeSB8IG51bGwge1xuICBjb25zdCB1ID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnVyZ2VuY3k7XG4gIHJldHVybiB1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiID8gdSA6IG51bGw7XG59XG5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gTm90YXMgY29tIGB1cmdlbmN5YCBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUgKyBvIG5cdTAwRUR2ZWwgbVx1MDBFMXhpbW8gKG9yZGVuYWRhcyBwb3Igblx1MDBFRHZlbCBkZXNjKS5cbmZ1bmN0aW9uIHVyZ2VuY3lTdGF0cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogVXJnZW5jeUluZm8ge1xuICBjb25zdCBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdID0gW107XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgIGNvbnN0IHUgPSByZWFkTm90ZVVyZ2VuY3koYXBwLCBjKTtcbiAgICAgICAgaWYgKHUpIGl0ZW1zLnB1c2goeyBmaWxlOiBjLCBsZXZlbDogdSB9KTtcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIGxldCBtYXg6IFVyZ2VuY3kgfCBudWxsID0gbnVsbDtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykgaWYgKCFtYXggfHwgVVJHRU5DWV9SQU5LW2l0LmxldmVsXSA+IFVSR0VOQ1lfUkFOS1ttYXhdKSBtYXggPSBpdC5sZXZlbDtcbiAgaXRlbXMuc29ydCgoYSwgYikgPT4gVVJHRU5DWV9SQU5LW2IubGV2ZWxdIC0gVVJHRU5DWV9SQU5LW2EubGV2ZWxdKTtcbiAgcmV0dXJuIHsgaXRlbXMsIG1heCB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQXJxdWl2b3MgZXhpYlx1MDBFRHZlaXM6IG5vdGEgKC5tZCkgLyBjYW52YXMgKC5jYW52YXMpIC8gYmFzZSAoLmJhc2UpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgRklMRV9FWFRTID0gW1wibWRcIiwgXCJjYW52YXNcIiwgXCJiYXNlXCJdO1xuLy8gaWQgTHVjaWRlIHBvciB0aXBvIGRlIGFycXVpdm8uXG5mdW5jdGlvbiBmaWxlR2x5cGgoZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoZXh0ID09PSBcImNhbnZhc1wiKSByZXR1cm4gXCJzaGFwZXNcIjtcbiAgaWYgKGV4dCA9PT0gXCJiYXNlXCIpIHJldHVybiBcInRhYmxlLTJcIjtcbiAgcmV0dXJuIFwiZmlsZS10ZXh0XCI7XG59XG5mdW5jdGlvbiBmaWxlc0luKGZvbGRlcjogVEZvbGRlcik6IFRGaWxlW10ge1xuICByZXR1cm4gKGZvbGRlci5jaGlsZHJlbi5maWx0ZXIoXG4gICAgYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgRklMRV9FWFRTLmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCJcbiAgKSBhcyBURmlsZVtdKS5zb3J0KChhLCBiKSA9PiBhLmJhc2VuYW1lLmxvY2FsZUNvbXBhcmUoYi5iYXNlbmFtZSwgXCJwdFwiKSk7XG59XG5cbi8vIFx1MDBDRGNvbmUgZGVmaW5pZG8gZW0gYGljb246YCBubyBzdGF0dXMubWQgZGEgcGFzdGEgKGVtb2ppIG91IGlkIEx1Y2lkZSkuIG51bGwgc2UgYXVzZW50ZS5cbmZ1bmN0aW9uIHJlYWRGb2xkZXJJY29uKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBpYyA9IHNmICYmIGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uaWNvbjtcbiAgcmV0dXJuIHR5cGVvZiBpYyA9PT0gXCJzdHJpbmdcIiAmJiBpYy50cmltKCkgPyBpYy50cmltKCkgOiBudWxsO1xufVxuXG4vLyBpZCBMdWNpZGUgKHNcdTAwRjMgW2EtejAtOS1dKSBcdTIxOTIgc2V0SWNvbiBuYXRpdm87IGNhc28gY29udHJcdTAwRTFyaW8gdHJhdGEgY29tbyBlbW9qaS90ZXh0by5cbmZ1bmN0aW9uIHJlbmRlckljb24oZWw6IEhUTUxFbGVtZW50LCBpY29uOiBzdHJpbmcpIHtcbiAgaWYgKC9eW2EtejAtOS1dKyQvLnRlc3QoaWNvbikpIHNldEljb24oZWwsIGljb24pO1xuICBlbHNlIGVsLnNldFRleHQoaWNvbik7XG59XG5cbi8vIENvciBlc3RcdTAwRTF2ZWwgYSBwYXJ0aXIgZG8gbm9tZSAocGFyYSBwYXN0YXMgZm9yYSBkbyBQQVJBKS5cbmZ1bmN0aW9uIGFjY2VudEZvcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgaCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykgaCA9IChoICogMzEgKyBuYW1lLmNoYXJDb2RlQXQoaSkpID4+PiAwO1xuICByZXR1cm4gQUNDRU5UU1toICUgQUNDRU5UUy5sZW5ndGhdO1xufVxuXG4vLyBcdTAwQ0Rjb25lIC8gclx1MDBGM3R1bG8gLyBjb3IgZGUgdW1hIHBhc3RhIGRlIHRvcG86IHVzYSBvIFBBUkEgc2UgY29uaGVjaWRhLCBzZW5cdTAwRTNvIGRlcml2YS5cbmZ1bmN0aW9uIGZvbGRlck1ldGEoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHsgaWNvbjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyBhY2NlbnQ6IHN0cmluZyB9IHtcbiAgY29uc3Qga25vd24gPSBQQVJBX01BUC5nZXQoZm9sZGVyLnBhdGgpO1xuICBjb25zdCBjdXN0b20gPSByZWFkRm9sZGVySWNvbihhcHAsIGZvbGRlcik7XG4gIHJldHVybiB7XG4gICAgaWNvbjogICBjdXN0b20gPz8ga25vd24/Lmljb24gPz8gXCJcdUQ4M0RcdURDQzFcIixcbiAgICBsYWJlbDogIGtub3duPy5sYWJlbCA/PyBmb2xkZXIubmFtZSxcbiAgICBhY2NlbnQ6IGtub3duPy5hY2NlbnQgPz8gYWNjZW50Rm9yKGZvbGRlci5uYW1lKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmV2ZWFsSW5FeHBsb3JlcihhcHA6IEFwcCwgdGFyZ2V0OiB1bmtub3duKSB7XG4gIHR5cGUgRXhwUGx1Z2luID0geyBpbnN0YW5jZTogeyByZXZlYWxJbkZvbGRlcihmOiB1bmtub3duKTogdm9pZCB9IH07XG4gIGNvbnN0IGV4cCA9IChhcHAgYXMgQXBwICYge1xuICAgIGludGVybmFsUGx1Z2luczogeyBnZXRQbHVnaW5CeUlkKGlkOiBzdHJpbmcpOiBFeHBQbHVnaW4gfCBudWxsIH07XG4gIH0pLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwiZmlsZS1leHBsb3JlclwiKTtcbiAgaWYgKGV4cCAmJiB0YXJnZXQpIGV4cC5pbnN0YW5jZS5yZXZlYWxJbkZvbGRlcih0YXJnZXQpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVmlldyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gXHUyNTAwXHUyNTAwIENvbnRyb2xhZG9yIGRvIFRvZG9pc3QgKGNvbXBhcnRpbGhhZG86IGRhc2hib2FyZCArIGFiYSBkZWRpY2FkYSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBEZXRcdTAwRTltIG8gZXN0YWRvIGRhcyB0YXJlZmFzLCBhIGJ1c2NhLCBhIHJlbmRlcml6YVx1MDBFN1x1MDBFM28gZGEgbGlzdGEgZSBhcyBhXHUwMEU3XHUwMEY1ZXNcbi8vIChjcmlhci9lZGl0YXIvY29uY2x1aXIvZXhjbHVpcikuIGByZXJlbmRlcmAgXHUwMEU5IG8gY2FsbGJhY2sgZGEgdmlldyBkb25hIChyZS1yZW5kZXJcbi8vIGNvbXBsZXRvKS4gVGVtIHRvb2x0aXAgcHJcdTAwRjNwcmlvIHBhcmEgblx1MDBFM28gZGVwZW5kZXIgZGEgdmlldy5cbmNsYXNzIFRvZG9pc3RDb250cm9sbGVyIHtcbiAgcHJpdmF0ZSB0YXNrczogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBwcml2YXRlIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIHByaXZhdGUgcHJvamVjdE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7ICAgLy8gaWQgXHUyMTkyIG5vbWVcbiAgcHJpdmF0ZSBsYWJlbENvbG9ycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7ICAgLy8gbm9tZSBkYSBldGlxdWV0YSBcdTIxOTIgaGV4XG4gIHByaXZhdGUgbG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIGVycm9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIGxhdGVyT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge31cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUZpbHRlcnModGFza3M6IFRvZG9pc3RUYXNrW10pOiBUb2RvaXN0VGFza1tdIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgaWYgKCFmLnByb2plY3RzLmxlbmd0aCAmJiAhZi5sYWJlbHMubGVuZ3RoKSByZXR1cm4gdGFza3M7XG4gICAgY29uc3QgcHMgPSBuZXcgU2V0KGYucHJvamVjdHMpLCBscyA9IG5ldyBTZXQoZi5sYWJlbHMpO1xuICAgIHJldHVybiB0YXNrcy5maWx0ZXIodCA9PiB7XG4gICAgICBpZiAocHMuc2l6ZSAmJiAhKHQucHJvamVjdF9pZCAmJiBwcy5oYXModC5wcm9qZWN0X2lkKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChscy5zaXplICYmICEodC5sYWJlbHMgPz8gW10pLnNvbWUobCA9PiBscy5oYXMobCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENvbG9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxDb2xvcnMuZ2V0KG5hbWUpID8/IExBQkVMX0ZBTExCQUNLO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENoaXAoaG9zdDogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY2xzOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpcCA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMubGFiZWxDb2xvcihuYW1lKTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bmFtZX1gIH0pO1xuICAgIHJldHVybiBjaGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2O1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICBwcml2YXRlIHNob3dUYXNrVGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC10YXNrLXRpcFwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtcHJpXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaU1ldGEodC5wcmlvcml0eSkuY29sb3I7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXRpdGxlXCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgZCA9IHQuZGVzY3JpcHRpb24hLnRyaW0oKTtcbiAgICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtZGVzY1wiLCB0ZXh0OiBkLmxlbmd0aCA+IERFU0NfTUFYID8gZC5zbGljZSgwLCBERVNDX01BWCkgKyBcIlx1MjAyNlwiIDogZCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRhc2tUaXAoZWw6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rhc2tUaXAoZWwsIHQpKTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNoZWNrLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KTsgfTtcbiAgfVxuXG4gIHByaXZhdGUgdG9kb1JvdyhsaXN0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2ssIHNob3dEYXRlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yb3dcIiB9KTtcbiAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBwcmkuY29sb3IpO1xuICAgIHRoaXMudG9kb0NoZWNrKHJvdywgdCk7XG4gICAgY29uc3QgdGFnID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pO1xuICAgIHRhZy5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LXR4dFwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHNldEljb24ocm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1oYXNkZXNjXCIgfSksIFwiYWxpZ24tbGVmdFwiKTtcbiAgICBjb25zdCBwcm9qID0gdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KTtcbiAgICB0aGlzLmF0dGFjaFRhc2tUaXAocm93LCB0KTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVGFza0J0bihob3N0OiBIVE1MRWxlbWVudCwgcHJlZmlsbER1ZT86IHN0cmluZywgdGl0bGUgPSBcIk5vdmEgdGFyZWZhXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYWRkXCIgfSk7XG4gICAgc2V0SWNvbihiLCBcInBsdXNcIik7XG4gICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgIGIub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH07XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRm9ybShvcHRzOiB7IG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjsgdGFzaz86IFRvZG9pc3RUYXNrOyBwcmVmaWxsRHVlPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4udGhpcy5sYWJlbENvbG9ycy5rZXlzKCksIC4uLnRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKV0pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIG5ldyBUYXNrRm9ybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICBtb2RlOiBvcHRzLm1vZGUsXG4gICAgICB0YXNrOiBvcHRzLnRhc2ssXG4gICAgICBwcmVmaWxsRHVlOiBvcHRzLnByZWZpbGxEdWUsXG4gICAgICBwcm9qZWN0czogdGhpcy5wcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcy5jb21wb25lbnQsIHtcbiAgICAgIHRhc2s6IHQsXG4gICAgICBwcm9qZWN0TmFtZTogdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdWJtaXRUYXNrRm9ybShtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCIsIHRhc2s6IFRvZG9pc3RUYXNrIHwgdW5kZWZpbmVkLCB2OiBUYXNrRm9ybVZhbHVlcyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB2LmNvbnRlbnQsIHByaW9yaXR5OiB2LnByaW9yaXR5IH07XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uLnRyaW0oKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgaWYgKHYucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHYucHJvamVjdElkO1xuICAgICAgICBpZiAodi5sYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ3JpYWRhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH0gZWxzZSBpZiAodGFzaykge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHt9O1xuICAgICAgICBpZiAodi5jb250ZW50ICE9PSB0YXNrLmNvbnRlbnQpIGZpZWxkcy5jb250ZW50ID0gdi5jb250ZW50O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAhPT0gKHRhc2suZGVzY3JpcHRpb24gPz8gXCJcIikpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb247XG4gICAgICAgIGlmICh2LnByaW9yaXR5ICE9PSB0YXNrLnByaW9yaXR5KSBmaWVsZHMucHJpb3JpdHkgPSB2LnByaW9yaXR5O1xuICAgICAgICBjb25zdCBvbGREYXRlID0gdGFzay5kdWU/LmRhdGUgPyB0YXNrLmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBcIlwiO1xuICAgICAgICBpZiAodi5kdWVEYXRlICE9PSBvbGREYXRlKSB7XG4gICAgICAgICAgaWYgKHYuZHVlRGF0ZSkgZmllbGRzLmR1ZV9kYXRlID0gdi5kdWVEYXRlO1xuICAgICAgICAgIGVsc2UgZmllbGRzLmR1ZV9zdHJpbmcgPSBcIm5vIGRhdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMID0gKHRhc2subGFiZWxzID8/IFtdKS5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCIgXCIpO1xuICAgICAgICBpZiAob2xkTCAhPT0gbmV3TCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGRzKS5sZW5ndGgpIGF3YWl0IHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCBmaWVsZHMpO1xuICAgICAgICBjb25zdCBvbGRQcm9qID0gdGFzay5wcm9qZWN0X2lkID8/IFwiXCI7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCAhPT0gb2xkUHJvaiAmJiB2LnByb2plY3RJZCkgYXdhaXQgbW92ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCB2LnByb2plY3RJZCk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBTYWx2YTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgbmV3IE5vdGljZShgXHVEODNEXHVEREQxIEV4Y2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDAsIHQpO1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gZXhjbHVpcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjb21wbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY2xvc2VUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ29uY2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGNvbmNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaChtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbiB8fCB0aGlzLmxvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgIGlmIChtYW51YWwpIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgW3Rhc2tzLCBwcm9qZWN0cywgbGFiZWxzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZmV0Y2hUb2RvaXN0VGFza3ModG9rZW4pLFxuICAgICAgICBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbikuY2F0Y2goKCkgPT4gW10gYXMgVG9kb2lzdFByb2plY3RbXSksXG4gICAgICAgIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbikuY2F0Y2goKCkgPT4gW10gYXMgVG9kb2lzdExhYmVsW10pLFxuICAgICAgXSk7XG4gICAgICB0aGlzLnRhc2tzID0gdGFza3M7XG4gICAgICB0aGlzLnByb2plY3RzID0gcHJvamVjdHM7XG4gICAgICB0aGlzLnByb2plY3RNYXAgPSBuZXcgTWFwKHByb2plY3RzLm1hcChwID0+IFtwLmlkLCBwLm5hbWVdKSk7XG4gICAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcChsYWJlbHMubWFwKGwgPT4gW2wubmFtZSwgVE9ET0lTVF9DT0xPUlNbbC5jb2xvcl0gPz8gTEFCRUxfRkFMTEJBQ0tdKSk7XG4gICAgICB0aGlzLmZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5lcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTGFuXHUwMEU3YSB1bSBwYWNvdGU6IGNyaWEgY2FkYSB0YXJlZmEgbm8gVG9kb2lzdCBjb20gZGF0YSBkZSBob2plLiBTZXF1ZW5jaWFsXG4gIC8vIChldml0YSByYWphZGEgbmEgQVBJKS4gQXR1YWxpemEgYSBsaXN0YSBhbyBmaW5hbC5cbiAgYXN5bmMgbGF1bmNoUGFja2FnZShwa2c6IFRhc2tQYWNrYWdlKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHsgbmV3IE5vdGljZShcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QgbmFzIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzLlwiKTsgcmV0dXJuOyB9XG4gICAgLy8gUmVzb2x2ZSB0XHUwMEVEdHVsbyBsaW1wbyArIGV0aXF1ZXRhcyAocGFjb3RlICsgaW5saW5lIEBldGlxdWV0YSkgcG9yIHRhcmVmYS5cbiAgICBjb25zdCBpdGVtcyA9IHBrZy50YXNrcy5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pLm1hcChsaW5lID0+IHNwbGl0VGFza0xhYmVscyhsaW5lLCBwa2cubGFiZWxzID8/IFtdKSk7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHsgbmV3IE5vdGljZShcIlBhY290ZSBzZW0gdGFyZWZhcy5cIik7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmxhdW5jaGluZy5oYXMocGtnLmlkKSkgcmV0dXJuOyAgIC8vIGpcdTAwRTEgZXN0XHUwMEUxIGxhblx1MDBFN2FuZG8gXHUyMTkyIGlnbm9yYSBjbGlxdWUtZHVwbG9cblxuICAgIC8vIENvbmZpcm1hXHUwMEU3XHUwMEUzbyBjb25mb3JtZSBhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gKHNlbXByZSAvIHNcdTAwRjMgbXVpdGFzIC8gbnVuY2EpLlxuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybTtcbiAgICBjb25zdCBuZWVkQ29uZmlybSA9IG1vZGUgPT09IFwiYWx3YXlzXCIgfHwgKG1vZGUgPT09IFwibWFueVwiICYmIGl0ZW1zLmxlbmd0aCA+IExBVU5DSF9DT05GSVJNX01JTik7XG4gICAgaWYgKG5lZWRDb25maXJtKSB7XG4gICAgICBjb25zdCBvayA9IGF3YWl0IGNvbmZpcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgICB0aXRsZTogYExhblx1MDBFN2FyIFx1MjAxQyR7cGtnLm5hbWUgfHwgXCJwYWNvdGVcIn1cdTIwMUQ/YCxcbiAgICAgICAgYm9keTogYElzc28gdmFpIGNyaWFyICR7aXRlbXMubGVuZ3RofSB0YXJlZmEocykgbm8gVG9kb2lzdCBjb20gZGF0YSBkZSBob2plOmAsXG4gICAgICAgIGl0ZW1zOiBpdGVtcy5tYXAoaXQgPT4gKHtcbiAgICAgICAgICB0ZXh0OiBpdC50aXRsZSxcbiAgICAgICAgICBsYWJlbHM6IGl0LmxhYmVscy5tYXAobiA9PiAoeyBuYW1lOiBuLCBjb2xvcjogdGhpcy5sYWJlbENvbG9yKG4pIH0pKSxcbiAgICAgICAgfSkpLFxuICAgICAgICBjdGE6IGBMYW5cdTAwRTdhciAke2l0ZW1zLmxlbmd0aH1gLFxuICAgICAgfSk7XG4gICAgICBpZiAoIW9rKSByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXVuY2hpbmcuYWRkKHBrZy5pZCk7XG4gICAgdGhpcy5yZXJlbmRlckFsbCgpOyAgIC8vIG1vc3RyYSBvIGJvdFx1MDBFM28gY29tbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIlxuICAgIGNvbnN0IGR1ZSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGxldCBvayA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAoY29uc3QgeyB0aXRsZSwgbGFiZWxzIH0gb2YgaXRlbXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdGl0bGUsIGR1ZV9kYXRlOiBkdWUgfTtcbiAgICAgICAgICBpZiAocGtnLnByb2plY3RJZCkgZmllbGRzLnByb2plY3RfaWQgPSBwa2cucHJvamVjdElkO1xuICAgICAgICAgIGlmIChsYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gbGFiZWxzO1xuICAgICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICAgIG9rKys7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBuZXcgTm90aWNlKGBGYWxoYSBlbSBcIiR7dGl0bGV9XCI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubGF1bmNoaW5nLmRlbGV0ZShwa2cuaWQpO1xuICAgIH1cbiAgICBuZXcgTm90aWNlKGBcdTI3MTMgJHtva30vJHtpdGVtcy5sZW5ndGh9IHRhcmVmYShzKSBsYW5cdTAwRTdhZGEocykgXHUyMDE0ICR7cGtnLm5hbWUgfHwgXCJwYWNvdGVcIn1gKTtcbiAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpOyAgIC8vIHJlLXJlbmRlcml6YSAobGltcGEgbyBlc3RhZG8gXCJsYW5cdTAwRTdhbmRvXHUyMDI2XCIpXG4gIH1cblxuICAvLyBCYXJyYSBkZSBsYW5cdTAwRTdhZG9yZXMgZGUgcGFjb3Rlcy4gQ29tIGBoZWFkaW5nYCwgbW9udGEgYSBzZVx1MDBFN1x1MDBFM28gXCJQQUNPVEVTXCJcbiAgLy8gY29tcGxldGEgKGFiYSBkbyBUb2RvaXN0KTsgc2VtIGVsZSwgc1x1MDBGMyBhIGJhcnJhIGRlIGJvdFx1MDBGNWVzIChkYXNoYm9hcmQsIGVcbiAgLy8gc29tZSBxdWFuZG8gblx1MDBFM28gaFx1MDBFMSBwYWNvdGVzIHBhcmEgbWFudGVyIG8gcGFpbmVsIGVueHV0bykuXG4gIHJlbmRlclBhY2thZ2VzKGhvc3Q6IEhUTUxFbGVtZW50LCBvcHRzOiB7IGhlYWRpbmc/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHBrZ3MgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgbGV0IHRhcmdldCA9IGhvc3Q7XG4gICAgaWYgKG9wdHMuaGVhZGluZykge1xuICAgICAgY29uc3Qgc2VjID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlBBQ09URVNcIiB9KTtcbiAgICAgIGlmICghcGtncy5sZW5ndGgpIHtcbiAgICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNyaWUgcGFjb3RlcyBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIFx1MjE5MiBQYWNvdGVzIGRlIHRhcmVmYXMuXCIgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRhcmdldCA9IHNlYztcbiAgICB9IGVsc2UgaWYgKCFwa2dzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBjb25zdCBiYXIgPSB0YXJnZXQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1iYXJcIiB9KTtcbiAgICBmb3IgKGNvbnN0IHBrZyBvZiBwa2dzKSB7XG4gICAgICBjb25zdCB2YWxpZCA9IHBrZy50YXNrcy5maWx0ZXIocyA9PiBzLnRyaW0oKSkubGVuZ3RoO1xuICAgICAgY29uc3QgYnVzeSA9IHRoaXMubGF1bmNoaW5nLmhhcyhwa2cuaWQpO1xuICAgICAgY29uc3QgZGlzYWJsZWQgPSAhdG9rZW4gfHwgIXZhbGlkIHx8IGJ1c3k7XG4gICAgICBjb25zdCBidG4gPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1idG5cIiArIChkaXNhYmxlZCA/IFwiIHdkLXBrZy1kaXNhYmxlZFwiIDogXCJcIikgKyAoYnVzeSA/IFwiIHdkLXBrZy1idXN5XCIgOiBcIlwiKSB9KTtcbiAgICAgIGlmIChwa2cuaWNvbikgcmVuZGVySWNvbihidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvXCIgfSksIHBrZy5pY29uKTtcbiAgICAgIGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1uYW1lXCIsIHRleHQ6IHBrZy5uYW1lIHx8IFwiKHNlbSBub21lKVwiIH0pO1xuICAgICAgYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IGJ1c3kgPyBcIlx1MjAyNlwiIDogU3RyaW5nKHZhbGlkKSB9KTtcbiAgICAgIGJ0bi5zZXRBdHRyKFwidGl0bGVcIixcbiAgICAgICAgYnVzeSA/IFwiTGFuXHUwMEU3YW5kb1x1MjAyNlwiIDpcbiAgICAgICAgIXRva2VuID8gXCJDb25maWd1cmUgbyB0b2tlbiBkbyBUb2RvaXN0XCIgOlxuICAgICAgICAhdmFsaWQgPyBcIlBhY290ZSBzZW0gdGFyZWZhc1wiIDpcbiAgICAgICAgYExhblx1MDBFN2FyICR7dmFsaWR9IHRhcmVmYShzKSBubyBUb2RvaXN0IChob2plKWApO1xuICAgICAgaWYgKCFkaXNhYmxlZCkgYnRuLm9uY2xpY2sgPSAoKSA9PiB2b2lkIHRoaXMubGF1bmNoUGFja2FnZShwa2cpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRmlsdGVyQmFyKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIGNvbnN0IGJhciA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYmFyXCIgfSk7XG4gICAgaWYgKHRoaXMucHJvamVjdHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIlByb2pldG9zXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wcm9qZWN0cykge1xuICAgICAgICBjb25zdCBvbiA9IGYucHJvamVjdHMuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IHAubmFtZSB9KTtcbiAgICAgICAgY2hpcC5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyB0aGlzLnRvZ2dsZUZpbHRlcihcInByb2plY3RzXCIsIHAuaWQpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9O1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldCh0aGlzLnRhc2tzLmZsYXRNYXAodCA9PiB0LmxhYmVscyA/PyBbXSkpXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIGlmIChsYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIkV0aXF1ZXRhc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxhYmVscykge1xuICAgICAgICBjb25zdCBvbiA9IGYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICBjb25zdCBjaGlwID0gdGhpcy5sYWJlbENoaXAoZ3JwLCBsLCBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSk7XG4gICAgICAgIGNoaXAub25jbGljayA9IGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVGaWx0ZXIoXCJsYWJlbHNcIiwgbCk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmLnByb2plY3RzLmxlbmd0aCB8fCBmLmxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsciA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNsZWFyXCIsIHRleHQ6IFwibGltcGFyIGZpbHRyb3NcIiB9KTtcbiAgICAgIGNsci5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBmLnByb2plY3RzID0gW107IGYubGFiZWxzID0gW107IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH07XG4gICAgfVxuICB9XG5cbiAgLy8gUmVuZGVyaXphIG9zIGNvbnRyb2xlcyBkZSBjYWJlXHUwMEU3YWxobyAoZW0gYGN0cmxzYCkgKyBhIGxpc3RhIGRlIHRhcmVmYXNcbiAgLy8gKGVtIGBib2R5YCkuIE8gaG9zdCBmb3JuZWNlIG8gclx1MDBGM3R1bG8gZGEgc2VcdTAwRTdcdTAwRTNvIGUgbyBsYXlvdXQgZG8gY2FiZVx1MDBFN2FsaG8uXG4gIHJlbmRlckxpc3QoYm9keTogSFRNTEVsZW1lbnQsIGN0cmxzOiBIVE1MRWxlbWVudCwgb3B0czogeyBzaG93TGF0ZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgICAgY29uc3Qgc2VnID0gY3RybHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tcmFuZ2VcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBbMywgN10gYXMgY29uc3QpIHtcbiAgICAgICAgY29uc3QgYiA9IHNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmFuZ2UtYnRuXCIgKyAocmFuZ2UgPT09IG4gPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IGAke259ZGAgfSk7XG4gICAgICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIGBNb3N0cmFyIG9zIHByXHUwMEYzeGltb3MgJHtufSBkaWFzYCk7XG4gICAgICAgIGIub25jbGljayA9IGFzeW5jIGUgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gbjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgICBjb25zdCBuRiA9IGYucHJvamVjdHMubGVuZ3RoICsgZi5sYWJlbHMubGVuZ3RoO1xuICAgICAgY29uc3QgZmlsdCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0ZXJidG5cIiArICh0aGlzLmZpbHRlck9wZW4gPyBcIiB3ZC1vblwiIDogXCJcIikgKyAobkYgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihmaWx0LCBcImZpbHRlclwiKTtcbiAgICAgIGZpbHQuc2V0QXR0cihcInRpdGxlXCIsIG5GID8gYEZpbHRyb3MgYXRpdm9zICgke25GfSkgXHUyMDE0IGNsaXF1ZSBwYXJhIGFqdXN0YXJgIDogXCJGaWx0cmFyIHBvciBwcm9qZXRvL2V0aXF1ZXRhXCIpO1xuICAgICAgaWYgKG5GKSBmaWx0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0Y3RcIiwgdGV4dDogU3RyaW5nKG5GKSB9KTtcbiAgICAgIGZpbHQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmZpbHRlck9wZW4gPSAhdGhpcy5maWx0ZXJPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH07XG4gICAgICBjb25zdCByZWZyZXNoID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlZnJlc2hcIiArICh0aGlzLmxvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgdGFyZWZhcyBkbyBUb2RvaXN0XCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaCh0cnVlKTsgfTtcbiAgICAgIHRoaXMuYWRkVGFza0J0bihjdHJscywgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIH1cblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29sZSBzZXUgdG9rZW4gZG8gVG9kb2lzdCBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIHBhcmEgdmVyIHN1YXMgdGFyZWZhcyBhcXVpLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5mZXRjaGVkQXQgJiYgIXRoaXMubG9hZGluZyAmJiAhdGhpcy5lcnJvcikgdm9pZCB0aGlzLmZldGNoKGZhbHNlKTtcbiAgICBpZiAodGhpcy5lcnJvcikgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMuZXJyb3J9YCB9KTsgcmV0dXJuOyB9XG4gICAgaWYgKCF0aGlzLmZldGNoZWRBdCkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG8gdGFyZWZhc1x1MjAyNlwiIH0pOyByZXR1cm47IH1cblxuICAgIGlmICh0aGlzLmZpbHRlck9wZW4pIHRoaXMucmVuZGVyRmlsdGVyQmFyKGJvZHkpO1xuXG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgY29uc3QgdG9kYXlLID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgY29uc3QgbGFzdFVwY29taW5nID0gbmV3IERhdGUoKTtcbiAgICBsYXN0VXBjb21pbmcuc2V0RGF0ZShsYXN0VXBjb21pbmcuZ2V0RGF0ZSgpICsgcmFuZ2UpO1xuICAgIGNvbnN0IGxhc3RLID0gdG9LZXkobGFzdFVwY29taW5nKTtcblxuICAgIGNvbnN0IHRhc2tzID0gdGhpcy5hcHBseUZpbHRlcnModGhpcy50YXNrcyk7XG4gICAgY29uc3Qgb3ZlcmR1ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IHRvZGF5VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgVG9kb2lzdFRhc2tbXT4gPSB7fTtcbiAgICBjb25zdCBsYXRlcjogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiB0YXNrcykge1xuICAgICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgICBpZiAoIWRrKSBjb250aW51ZTtcbiAgICAgIGlmIChkayA8IHRvZGF5Sykgb3ZlcmR1ZS5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPT09IHRvZGF5SykgdG9kYXlUYXNrcy5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPD0gbGFzdEspIChieURheVtka10gPz89IFtdKS5wdXNoKHQpO1xuICAgICAgZWxzZSBsYXRlci5wdXNoKHQpO1xuICAgIH1cbiAgICBjb25zdCBieVByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIC8vIFwiRGVwb2lzXCI6IG9yZGVuYSBwb3IgREFUQSAobWFpcyBwclx1MDBGM3hpbWEgcHJpbWVpcm8pIGUsIG5vIG1lc21vIGRpYSwgcG9yIHByaW9yaWRhZGUuXG4gICAgY29uc3QgYnlEYXRlVGhlblByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IHtcbiAgICAgIGNvbnN0IGRhID0gZHVlS2V5KGEpID8/IFwiXCIsIGRiID0gZHVlS2V5KGIpID8/IFwiXCI7XG4gICAgICBpZiAoZGEgIT09IGRiKSByZXR1cm4gZGEgPCBkYiA/IC0xIDogMTtcbiAgICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICB9O1xuICAgIG92ZXJkdWUuc29ydChieVByaSk7IHRvZGF5VGFza3Muc29ydChieVByaSk7IGxhdGVyLnNvcnQoYnlEYXRlVGhlblByaSk7XG4gICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKGJ5RGF5KSkgYnlEYXlba10uc29ydChieVByaSk7XG5cbiAgICBjb25zdCB2aXNpYmxlID0gb3ZlcmR1ZS5sZW5ndGggKyB0b2RheVRhc2tzLmxlbmd0aCArIGxhdGVyLmxlbmd0aCArIE9iamVjdC52YWx1ZXMoYnlEYXkpLnJlZHVjZSgocywgYSkgPT4gcyArIGEubGVuZ3RoLCAwKTtcbiAgICBpZiAodmlzaWJsZSA9PT0gMCkge1xuICAgICAgY29uc3QgYWxsID0gdGhpcy50YXNrcy5sZW5ndGg7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBhbGwgPyBcIk5lbmh1bWEgdGFyZWZhIGJhdGUgY29tIG9zIGZpbHRyb3MuXCIgOiBcIk5lbmh1bWEgdGFyZWZhIGNvbSBkYXRhIG5vIFRvZG9pc3QuIFx1RDgzQ1x1REY4OVwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbHMgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWNvbHNcIiB9KTtcblxuICAgIGNvbnN0IG9ib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtb3ZlcmR1ZVwiIH0pO1xuICAgIGNvbnN0IG9oZCA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveHdhcm5cIiwgdGV4dDogXCJcdTI2QTBcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiQXRyYXNhZGFzXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcob3ZlcmR1ZS5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IG9ib2R5ID0gb2JveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKG92ZXJkdWUubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2Ygb3ZlcmR1ZSkgdGhpcy50b2RvUm93KG9ib2R5LCB0KTtcbiAgICBlbHNlIG9ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYS4gXHVEODNEXHVEQzREXCIgfSk7XG5cbiAgICBjb25zdCB0Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXRvZGF5XCIgfSk7XG4gICAgY29uc3QgdGhkID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHRoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogXCJIb2plXCIgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHRoZCwgXCJob2plXCIsIFwiTm92YSB0YXJlZmEgcGFyYSBob2plXCIpO1xuICAgIHRoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHRvZGF5VGFza3MubGVuZ3RoKSB9KTtcbiAgICBjb25zdCB0Ym9keSA9IHRib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmICh0b2RheVRhc2tzLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIHRvZGF5VGFza3MpIHRoaXMudG9kb1Jvdyh0Ym9keSwgdCk7XG4gICAgZWxzZSB0Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5hZGEgcGFyYSBob2plLlwiIH0pO1xuXG4gICAgbGV0IHVwY29taW5nQ291bnQgPSAwO1xuICAgIGNvbnN0IHVwRGF5czogeyBkb3c6IG51bWJlcjsgbnVtOiBudW1iZXI7IGtleTogc3RyaW5nOyBpdGVtczogVG9kb2lzdFRhc2tbXSB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSByYW5nZTsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XTtcbiAgICAgIGlmICghaXRlbXM/Lmxlbmd0aCkgY29udGludWU7XG4gICAgICB1cGNvbWluZ0NvdW50ICs9IGl0ZW1zLmxlbmd0aDtcbiAgICAgIHVwRGF5cy5wdXNoKHsgZG93OiAoZGF5LmdldERheSgpICsgNikgJSA3LCBudW06IGRheS5nZXREYXRlKCksIGtleSwgaXRlbXMgfSk7XG4gICAgfVxuICAgIGNvbnN0IHVib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdXBjb21pbmdcIiB9KTtcbiAgICBjb25zdCB1aGQgPSB1Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdWhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBgUHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzYCB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odWhkLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgdWhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodXBjb21pbmdDb3VudCkgfSk7XG4gICAgY29uc3QgdWJvZHkgPSB1Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodXBEYXlzLmxlbmd0aCkge1xuICAgICAgZm9yIChjb25zdCBnIG9mIHVwRGF5cykge1xuICAgICAgICBjb25zdCBkaCA9IHVib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWRheWhkXCIgKyAoZy5kb3cgPj0gNSA/IFwiIHdkLXdlZWtlbmRcIiA6IFwiXCIpIH0pO1xuICAgICAgICBkaC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbZy5kb3ddIH0pO1xuICAgICAgICBkaC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bnVtXCIsIHRleHQ6IFN0cmluZyhnLm51bSkgfSk7XG4gICAgICAgIHRoaXMuYWRkVGFza0J0bihkaCwgZy5rZXksIGBOb3ZhIHRhcmVmYSBlbSAke2cubnVtfWApO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZy5pdGVtcykgdGhpcy50b2RvUm93KHVib2R5LCB0LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IGBOYWRhIG5vcyBwclx1MDBGM3hpbW9zICR7cmFuZ2V9IGRpYXMuYCB9KTtcbiAgICB9XG5cbiAgICBpZiAobGF0ZXIubGVuZ3RoICYmIG9wdHMuc2hvd0xhdGVyICE9PSBmYWxzZSkge1xuICAgICAgY29uc3QgcGFuZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyXCIgfSk7XG4gICAgICBjb25zdCBsaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBEZXBvaXMgKCR7bGF0ZXIubGVuZ3RofSlgIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMubGF0ZXJPcGVuID8gXCJvY3VsdGFyIFx1MjVCRVwiIDogXCJtb3N0cmFyIFx1MjAzQVwiIH0pO1xuICAgICAgbGhkLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubGF0ZXJPcGVuID0gIXRoaXMubGF0ZXJPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH07XG4gICAgICBpZiAodGhpcy5sYXRlck9wZW4pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9saXN0XCIgfSk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBsYXRlcikgdGhpcy50b2RvUm93KGxpc3QsIHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgc2VjSG9zdHMgPSBuZXcgTWFwPFNlY3Rpb25JZCwgSFRNTEVsZW1lbnQ+KCk7ICAgLy8gd3JhcHBlciBlc3RcdTAwRTF2ZWwgcG9yIHNlXHUwMEU3XHUwMEUzb1xuICBwcml2YXRlIHVuc3ViVG9kbzogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7ICAgICAgICAgIC8vIGNhbmNlbGFyIGluc2NyaVx1MDBFN1x1MDBFM28gbm8gY29udHJvbGxlclxuXG4gIC8vIEVzdGFkbyBkbyBTeW5jdGhpbmcgKHYwLjEwLjApXG4gIHByaXZhdGUgc3luY0RhdGE6IFN5bmNEYXRhIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzeW5jRXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIGNvbmZsaWN0Q29uZmlybTogc3RyaW5nIHwgbnVsbCA9IG51bGw7ICAgLy8gcGF0aCBkbyBjb25mbGl0byBhZ3VhcmRhbmRvIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICAvLyBJbnNjcmV2ZSBubyBjb250cm9sbGVyIFx1MDBGQW5pY286IG11ZGFuXHUwMEU3YSBkZSBlc3RhZG8gcmUtcmVuZGVyaXphIHNcdTAwRjMgYSBzZVx1MDBFN1x1MDBFM28gVGFyZWZhcy5cbiAgICB0aGlzLnVuc3ViVG9kbyA9IHRoaXMucGx1Z2luLnRvZG8uc3Vic2NyaWJlKCgpID0+IHRoaXMucmVuZGVyU2VjdGlvbihcInRvZG9pc3RcIikpO1xuICAgIGZvciAoY29uc3QgZXYgb2YgW1wibW9kaWZ5XCIsIFwiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwicmVuYW1lXCJdIGFzIGNvbnN0KVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKGV2IGFzIFwibW9kaWZ5XCIsICgpID0+IHRoaXMuc2NoZWR1bGUoKSkpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG5cbiAgLy8gUmUtcmVuZGVyIHBcdTAwRkFibGljbyBcdTIwMTQgY2hhbWFkbyBwZWxvIHBsdWdpbiBxdWFuZG8gYSBjb25maWd1cmFcdTAwRTdcdTAwRTNvIG11ZGEgbmEgYWJhXG4gIC8vIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIChvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMgZGEgU2VtYW5hKS5cbiAgcmVmcmVzaCgpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICAvLyBDYWRhIHNlXHUwMEU3XHUwMEUzbyBtb3JhIG51bSBob3N0IGVzdFx1MDBFMXZlbCBcdTIxOTIgZFx1MDBFMSBwYXJhIHJlLXJlbmRlcml6YXIgdW1hIHNlXHUwMEU3XHUwMEUzbyBzXHUwMEYzXG4gICAgLy8gKGV4LjogcmVmcmVzaCBkbyBUb2RvaXN0L1N5bmN0aGluZykgc2VtIHJlY29uc3RydWlyIGEgdmlldyBpbnRlaXJhLlxuICAgIHRoaXMuc2VjSG9zdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgY29uc3QgaG9zdCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1ob3N0XCIgfSk7XG4gICAgICB0aGlzLnNlY0hvc3RzLnNldChpZCwgaG9zdCk7XG4gICAgICB0aGlzLnJlbmRlclNlY3Rpb24oaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlLXJlbmRlcml6YSBhcGVuYXMgYSBzZVx1MDBFN1x1MDBFM28gYGlkYCBkZW50cm8gZG8gc2V1IGhvc3QgKHNlbSB0b2NhciBuYXMgb3V0cmFzKS5cbiAgcHJpdmF0ZSByZW5kZXJTZWN0aW9uKGlkOiBTZWN0aW9uSWQpIHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5zZWNIb3N0cy5nZXQoaWQpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuZW1wdHkoKTtcbiAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiaGVhdG1hcFwiKSB0aGlzLnJlbmRlckhlYXRtYXAoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJzdGF0c1wiKSAgIHRoaXMucmVuZGVyU3RhdHMoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3QoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwic3luY1wiKSAgICB0aGlzLnJlbmRlclN5bmMoaG9zdCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgT2N1bHRhciAobGVpdHVyYSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3RyYXIvb2N1bHRhciBlIGEgb3JkZW0gZGFzIHNlXHUwMEU3XHUwMEY1ZXMgc1x1MDBFM28gYWRtaW5pc3RyYWRvcyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZG8gcGx1Z2luLiBBIHZpZXcgc1x1MDBGMyAqbFx1MDBFQSogYHNldHRpbmdzLmhpZGRlbmAgcGFyYSBwdWxhciBvIHF1ZVxuICAvLyBlc3RcdTAwRTEgb2N1bHRvLiBWZXIgV2VydXNTZXR0aW5nVGFiLlxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gUG9zaWNpb25hIHVtIHRvb2x0aXAgZml4byBhYmFpeG8gZG8gYWx2byAodmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvKS5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2OyAgLy8gdmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvXG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgbGlzdGFuZG8gYXMgbm90YXMgdXJnZW50ZXMgZGUgdW1hIHBhc3RhIChob3ZlciBubyBiYWRnZSBkZSBhdmlzbykuXG4gIHByaXZhdGUgc2hvd1VyZ2VuY3lUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdXJnZW5jeS10aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIlVyZ2VudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXV0aXAtZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IFVSR0VOQ1lfQ09MT1JbaXQubGV2ZWxdO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogaXQuZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGl0LmxldmVsIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIEJhZGdlIGRlIGF2aXNvICh0cmlcdTAwRTJuZ3Vsbykgbm8gY2FyZCBkZSBwYXN0YSBxdWUgY29udFx1MDBFOW0gbm90YXMgY29tIGB1cmdlbmN5YC5cbiAgLy8gQ29yIHBlbG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbzsgaG92ZXIgbGlzdGEgb3MgYXJxdWl2b3MuIEZhc2UgMTAuXG4gIHByaXZhdGUgdXJnZW5jeUJhZGdlKGNhcmQ6IEhUTUxFbGVtZW50LCB1cmc6IFVyZ2VuY3lJbmZvKSB7XG4gICAgaWYgKCF1cmcubWF4KSByZXR1cm47XG4gICAgY29uc3QgYiA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktYmFkZ2Ugd2QtdS0ke3VyZy5tYXh9YCB9KTtcbiAgICBzZXRJY29uKGIsIFwidHJpYW5nbGUtYWxlcnRcIik7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dVcmdlbmN5VGlwKGIsIHVyZy5pdGVtcykpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3QgcmVjZW50cyA9IHJlY2VudE5vdGVzKGZvbGRlciwgNCk7XG4gICAgaWYgKCFyZWNlbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGlwKGNhcmQsIHJlY2VudHMpKTtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYWxlbmRcdTAwRTFyaW8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYWxlbmRhcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19DQUwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtb25kYXkgID0gbW9uZGF5T2YodGhpcy53ZWVrT2Zmc2V0KTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuICAgIGNvbnN0IHRvZGF5SyAgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIEZvbnRlcyBhdGl2YXMgKHBhc3RhcyBtYXJjYWRhcykuIEEgY29yIGRlIGNhZGEgbm90YSB2ZW0gZGEgZm9udGUgZGVcbiAgICAvLyBwcmVmaXhvIG1haXMgZXNwZWNcdTAwRURmaWNvIHF1ZSBhIGNvbnRcdTAwRTltLlxuICAgIGNvbnN0IHNvdXJjZXMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMuZmlsdGVyKHMgPT4gcy5vbik7XG4gICAgY29uc3QgY29sb3JGb3IgPSAocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBsZXQgYmVzdDogQ2FsU291cmNlIHwgbnVsbCA9IG51bGw7XG4gICAgICBmb3IgKGNvbnN0IHMgb2Ygc291cmNlcykge1xuICAgICAgICBpZiAocGF0aCA9PT0gYCR7cy5wYXRofS5tZGAgfHwgcGF0aC5zdGFydHNXaXRoKGAke3MucGF0aH0vYCkpIHtcbiAgICAgICAgICBpZiAoIWJlc3QgfHwgcy5wYXRoLmxlbmd0aCA+IGJlc3QucGF0aC5sZW5ndGgpIGJlc3QgPSBzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdCA/IGJlc3QuY29sb3IgOiBudWxsO1xuICAgIH07XG5cbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IGZpbGU6IFRGaWxlOyBjb2xvcjogc3RyaW5nIH1bXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBjb2xvciA9IGNvbG9yRm9yKGZpbGUucGF0aCk7XG4gICAgICBpZiAoIWNvbG9yKSBjb250aW51ZTsgICAvLyBzXHUwMEYzIG5vdGFzIGRlbnRybyBkZSB1bWEgZm9udGUgbWFyY2FkYVxuICAgICAgY29uc3QgbSA9IGZpbGUuYmFzZW5hbWUubWF0Y2goL14oXFxkezR9LVxcZHsyfS1cXGR7Mn0pLyk7XG4gICAgICBjb25zdCBkID0gbm9ybWFsaXplRGF0ZSh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgIGlmIChkKSAoYnlEYXlbZF0gPz89IFtdKS5wdXNoKHsgbmFtZTogZmlsZS5iYXNlbmFtZSwgZmlsZSwgY29sb3IgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1jYWwtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IG5hdiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hdi1iYXJcIiB9KTtcbiAgICBjb25zdCBwaG9uZSA9IFBsYXRmb3JtLmlzUGhvbmU7XG5cbiAgICAvLyBDZWx1bGFyOiBqYW5lbGEgZGUgMyBkaWFzID0gb250ZW0gXHUwMEI3IGhvamUgXHUwMEI3IGFtYW5oXHUwMEUzICh3ZWVrT2Zmc2V0IHBhZ2luYSBkZSAzIGVtIDMpLlxuICAgIGNvbnN0IGRheUFuY2hvciA9IG5ldyBEYXRlKCk7XG4gICAgZGF5QW5jaG9yLnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSAtIDEgKyB0aGlzLndlZWtPZmZzZXQgKiAzKTtcbiAgICBjb25zdCBmbXRETSA9IChkOiBEYXRlKSA9PiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSBuZXcgRGF0ZShkYXlBbmNob3IpOyBsYXN0LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIDIpO1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYCR7Zm10RE0oZGF5QW5jaG9yKX0gXHUyMDEzICR7Zm10RE0obGFzdCl9YCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYFJlbGF0XHUwMEYzcmlvcyBcdTAwQjcgc2VtYW5hICR7d2Vla051bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGN0cmxzID0gbmF2LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtY3RybHNcIiB9KTtcbiAgICBjb25zdCBwcmV2ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwMzlcIiB9KTtcbiAgICBjb25zdCBuZXh0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICBwcmV2Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldC0tOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIG5leHQub25jbGljayA9ICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0Kys7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2VsdWxhcjogbGlzdGEgdmVydGljYWwgZGUgMyBkaWFzIChvbnRlbS9ob2plL2FtYW5oXHUwMEUzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBDYWRhIGRpYSA9IGEgbm90YSBkaVx1MDBFMXJpYSAodW1hIHBvciBkaWEpLiBMaW5oYSBpbnRlaXJhIGNsaWNcdTAwRTF2ZWw6IGFicmUgYVxuICAgIC8vIGV4aXN0ZW50ZTsgc2Ugblx1MDBFM28gaG91dmVyLCBjcmlhLlxuICAgIGlmIChwaG9uZSkge1xuICAgICAgY29uc3QgbGlzdCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWxpc3RcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKGRheUFuY2hvcik7XG4gICAgICAgIGRheS5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgICAgY29uc3QgZG93ID0gKGRheS5nZXREYXkoKSArIDYpICUgNztcbiAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtZHJvd1wiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGRvdyA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICAgIH0pO1xuICAgICAgICByb3cuc2V0QXR0cihcInRpdGxlXCIsIG5vdGUgPyBcIkFicmlyIG5vdGEgZGlcdTAwRTFyaWFcIiA6IFwiQ3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgICAgY29uc3QgaGQgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LWhkXCIgfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2Rvd10gfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW51bVwiLCB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LW5vdGVzXCIgfSk7XG4gICAgICAgIGlmIChub3RlKSB7XG4gICAgICAgICAgY29uc3QgcGlsbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgICAgcGlsbC50ZXh0Q29udGVudCA9IG5vdGUuYmFzZW5hbWUubGVuZ3RoID4gMjQgPyBub3RlLmJhc2VuYW1lLnNsaWNlKDAsIDI0KSArIFwiXHUyMDI2XCIgOiBub3RlLmJhc2VuYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvZHkuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtZHJvdy1lbXB0eVwiLCB0ZXh0OiBcImNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICByb3cub25jbGljayA9ICgpID0+IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIERlc2t0b3AvdGFibGV0OiBncmFkZSBkZSA3IGRpYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWdyaWRcIiB9KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICAgIGRheS5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBjb2wgPSBncmlkLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogW1wid2QtY2FsLWNvbFwiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGkgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBoZCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWhkXCIgfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2ldIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1udW1cIiwgIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgIGhkLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIC8gY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgIGhkLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KTsgfTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldID8/IFtdO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcy5zbGljZSgwLCAzKSkge1xuICAgICAgICBjb25zdCBwaWxsID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICBwaWxsLnN0eWxlLnNldFByb3BlcnR5KFwiLS13ZC1zcmNcIiwgaXQuY29sb3IpO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtZG90XCIgfSk7XG4gICAgICAgIHBpbGwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtcGlsbC10eHRcIiwgdGV4dDogaXQubmFtZS5sZW5ndGggPiAxNCA/IGl0Lm5hbWUuc2xpY2UoMCwgMTQpICsgXCJcdTIwMjZcIiA6IGl0Lm5hbWUgfSk7XG4gICAgICAgIHBpbGwub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShpdC5maWxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAzKSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1tb3JlXCIsIHRleHQ6IGArJHtpdGVtcy5sZW5ndGggLSAzfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICBlbmQuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgNik7XG4gICAgc2VjLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IFwid2QtY2FsLWZvb3RlclwiLFxuICAgICAgdGV4dDogbW9uZGF5LmdldE1vbnRoKCkgPT09IGVuZC5nZXRNb250aCgpXG4gICAgICAgID8gYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSAke21vbmRheS5nZXRGdWxsWWVhcigpfWBcbiAgICAgICAgOiBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19IFx1MjAxMyAke01PTlRIX1NIT1JUW2VuZC5nZXRNb250aCgpXX0gJHtlbmQuZ2V0RnVsbFllYXIoKX1gLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQWNoYSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWAgKFlZWVktTU0tREQpOiBwcmltZWlybyBwZWxvIGNhbWluaG8gY2FuXHUwMEY0bmljbyBlbVxuICAvLyA1MC5EaVx1MDBFMXJpby8sIHNlblx1MDBFM28gcXVhbHF1ZXIgbm90YSBjdWpvIGBkYXRlOmAgc2VqYSBlc3NlIGRpYS4gTnVsbCBzZSBuXHUwMEUzbyBob3V2ZXIuXG4gIC8vIChSZWxhdFx1MDBGM3Jpby9ub3RhIGRpXHUwMEUxcmlhIFx1MDBFOSB1bSBwb3IgZGlhIFx1MjE5MiBhYnJlIG8gZXhpc3RlbnRlIGVtIHZleiBkZSBjcmlhciBvdXRyby4pXG4gIHByaXZhdGUgZmluZERhaWx5Tm90ZShrZXk6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZGlyZWN0ID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCk7XG4gICAgaWYgKGRpcmVjdCBpbnN0YW5jZW9mIFRGaWxlKSByZXR1cm4gZGlyZWN0O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpID09PSBrZXkpIHJldHVybiBmO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFicmUgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgOyBjcmlhIGVtIDUwLkRpXHUwMEUxcmlvLyBTXHUwMEQzIHNlIG5cdTAwRTNvIGV4aXN0aXIgbmVuaHVtYS5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuRGFpbHlOb3RlKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcpIHsgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGV4aXN0aW5nKTsgcmV0dXJuOyB9XG5cbiAgICAvLyBOXHUwMEUzbyBleGlzdGUgXHUyMTkyIGNyaWEgbm8gY2FtaW5obyBjYW5cdTAwRjRuaWNvLlxuICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX0ZPTERFUikpXG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoREFJTFlfRk9MREVSKS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBjb25zdCBbeSwgbSwgZF0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgIGNvbnN0IHRpdHVsbyA9IG5ldyBEYXRlKCt5LCArbSAtIDEsICtkKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICB9KTtcblxuICAgIC8vIFVzYSBvIHRlbXBsYXRlIGVtIE1vZGVsb3MvIHNlIGV4aXN0aXI7IHNlblx1MDBFM28sIGZhbGxiYWNrIGVtYnV0aWRvLlxuICAgIGNvbnN0IHRwbCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9URU1QTEFURSk7XG4gICAgbGV0IGJvZHk6IHN0cmluZztcbiAgICBpZiAodHBsIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgIGJvZHkgPSAoYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0cGwpKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmRhdGVcXHMqXFx9XFx9L2csIGtleSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyp0aXRsZVxccypcXH1cXH0vZywgdGl0dWxvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keSA9XG5gLS0tXG5vd25lcjogV2VydXNcbmNyZWF0ZWQ6ICR7a2V5fVxuZGF0ZTogJHtrZXl9XG5yZXZpZXdlZDogdHJ1ZVxudHlwZTogZGFpbHlcbnBlcm1pc3Npb25zOlxuICByZWFkOiBbYWxsXVxuICB3cml0ZTpcbiAgICAtIFdlcnVzXG4tLS1cblxuIyAke3RpdHVsb31cblxuYDtcbiAgICB9XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGAsIGJvZHkpO1xuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkcyBkbyBjb2ZyZSAodG9kYXMgYXMgcGFzdGFzIGRlIHRvcG8pICsgbmF2ZWdhZG9yIGFuaW5oYWRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyUGFyYShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19QQVJBKSkgcmV0dXJuO1xuICAgIC8vIFNlIGEgcGFzdGEgYWJlcnRhIG5vIG5hdmVnYWRvciBmb2kgb2N1bHRhZGEgbmFzIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzLCBmZWNoYS5cbiAgICBpZiAodGhpcy5uYXZQYXRoICYmIHRoaXMuaXNIaWRkZW4odGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpKSkgdGhpcy5uYXZQYXRoID0gbnVsbDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNPRlJFXCIgfSk7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYXJhLWdyaWRcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSAgIC8vIGlnbm9yYSAub2JzaWRpYW4sIC50cmFzaCwgZXRjLlxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgY29uc3QgYWN0aXZlUm9vdCA9IHRoaXMubmF2UGF0aCA/IHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSA6IG51bGw7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBtZXRhICAgID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHN0YXRzICAgPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSBzdWJGb2xkZXJzKGZvbGRlcikubGVuZ3RoID4gMCB8fCBmaWxlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIGZvbGRlcikpO1xuXG4gICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGZvbGRlcik7XG5cbiAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaWYgKG5hdmlnYWJsZSkgeyB0aGlzLm5hdlBhdGggPSBpc0FjdGl2ZSA/IG51bGwgOiBmb2xkZXIucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfVxuICAgICAgICBlbHNlIHJldmVhbEluRXhwbG9yZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IGZpbGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBhaW5lbCBpbmxpbmUgbmF2ZWdcdTAwRTF2ZWwgKGJyZWFkY3J1bWIgKyBzdWJwYXN0YXMgKyBub3RhcyBkYSBwYXN0YSBhdHVhbClcbiAgcHJpdmF0ZSByZW5kZXJCcm93c2VyKHBhcmVudDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy50b3BGb2xkZXJPZihmb2xkZXIucGF0aCk7XG4gICAgY29uc3Qgcm9vdEZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyb290UGF0aCk7XG4gICAgaWYgKCEocm9vdEZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIHJvb3RGb2xkZXIpO1xuXG4gICAgY29uc3QgcGFuZWwgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhbmVsXCIgfSk7XG4gICAgcGFuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAvLyBCcmVhZGNydW1iXG4gICAgY29uc3QgY3J1bWIgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY3J1bWJcIiB9KTtcbiAgICBjb25zdCByZWwgPSBmb2xkZXIucGF0aCA9PT0gcm9vdFBhdGggPyBbXSA6IGZvbGRlci5wYXRoLnNsaWNlKHJvb3RQYXRoLmxlbmd0aCArIDEpLnNwbGl0KFwiL1wiKTtcblxuICAgIGNvbnN0IHJvb3RTZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKHJlbC5sZW5ndGggPT09IDAgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpIH0pO1xuICAgIHJlbmRlckljb24ocm9vdFNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICByb290U2VnLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgIGlmIChyZWwubGVuZ3RoKSByb290U2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHJvb3RQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgbGV0IGFjYyA9IHJvb3RQYXRoO1xuICAgIHJlbC5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XG4gICAgICBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlcFwiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gcmVsLmxlbmd0aCAtIDE7XG4gICAgICBhY2MgPSBgJHthY2N9LyR7cGFydH1gO1xuICAgICAgY29uc3Qgc2VnUGF0aCA9IGFjYztcbiAgICAgIGNvbnN0IHNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAoaXNMYXN0ID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSwgdGV4dDogcGFydCB9KTtcbiAgICAgIGlmICghaXNMYXN0KSBzZWcub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2VnUGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3NlID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1jbG9zZVwiLCB0ZXh0OiBcIlx1MjcxNVwiIH0pO1xuICAgIGNsb3NlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkZlY2hhclwiKTtcbiAgICBjbG9zZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gQ2FtcG8gZGUgYnVzY2FcbiAgICBjb25zdCBzZWFyY2hXcmFwID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYXJjaC13cmFwXCIgfSk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hXcmFwLmNyZWF0ZUVsKFwiaW5wdXRcIiwge1xuICAgICAgY2xzOiBcIndkLXNlYXJjaFwiLFxuICAgICAgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiZmlsdHJhclx1MjAyNlwiLCB2YWx1ZTogdGhpcy5zZWFyY2hUZXJtIH0sXG4gICAgfSk7XG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtc3ViLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxibCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2QtbGFiZWxcIik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBsYmwuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLW5vdGUtcm93LCAud2Qtbm90ZS1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2Qtbm90ZS1uYW1lLCAud2Qtbm90ZS1jYXJkLW5hbWVcIik/LnRleHRDb250ZW50ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBuYW1lLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJwYXN0YXMgY29tbyBjYXJkc1xuICAgIGNvbnN0IHN1YnMgPSBzdWJGb2xkZXJzKGZvbGRlcik7XG4gICAgaWYgKHN1YnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZ3JpZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9qLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3Qgc2Ygb2Ygc3Vicykge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWFkRm9sZGVyU3RhdHVzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IHN0YXRzICA9IGZvbGRlclN0YXRzKHNmKTtcbiAgICAgICAgY29uc3QgY292ZXIgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBkZWVwZXIgPSBzdWJGb2xkZXJzKHNmKS5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBjdXN0b21JY29uID0gcmVhZEZvbGRlckljb24odGhpcy5hcHAsIHNmKTtcblxuICAgICAgICBjb25zdCBjYXJkID0gc2dyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtY2FyZCB3ZC1zdWItY2FyZCB3ZC1zLSR7c3RhdHVzfWAgfSk7XG4gICAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBzdXRpbCAodmVyc1x1MDBFM28gbWVub3IgcXVlIGFzIHBhc3RhcyBkZSB0b3BvKSBcdTIwMTQgRmFzZSA5LjFcbiAgICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHQgd2QtY292ZXItc3ViXCIgfSk7XG4gICAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIGN1c3RvbUljb24gPz8gXCJcdUQ4M0RcdURDQzFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLWJhZGdlIHdkLWJhZGdlLSR7c3RhdHVzfWAsIHRleHQ6IFNUQVRVU19JQ09OW3N0YXR1c10gfSk7XG4gICAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHVyZ2VuY3lTdGF0cyh0aGlzLmFwcCwgc2YpKTtcblxuICAgICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgICBpZiAoY3VzdG9tSWNvbikgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uIHdkLXN1Yi1pY29uXCIgfSksIGN1c3RvbUljb24pO1xuICAgICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoc3RhdHMpIH0pO1xuICAgICAgICBpZiAoZGVlcGVyKSB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdWItYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcblxuICAgICAgICBjb25zdCBsYWJlbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsIHRleHQ6IHNmLm5hbWUgfSk7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIGxhYmVsLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIHNmKTtcbiAgICAgICAgICBpZiAocnYudG90YWwgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKX0lYDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY2FyZC5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBzZik7XG4gICAgICAgICAgY2FyZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZi5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXJxdWl2b3MgZGEgcGFzdGEgYXR1YWwgKG5vdGFzLCBjYW52YXMsIGJhc2VzKVxuICAgIGNvbnN0IG5vdGVzID0gZmlsZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYXRtYXAgKHZpYSBwbHVnaW4gSGVhdG1hcCBDYWxlbmRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWF0bWFwKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0hFQVQpKSByZXR1cm47XG4gICAgaWYgKFBsYXRmb3JtLmlzUGhvbmUpIHJldHVybjsgICAvLyBoZWF0bWFwIChhbm8gaW50ZWlybykgb2N1bHRhZG8gbm8gY2VsdWxhclxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhLCBubyBhbm8gY29ycmVudGUuXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoZi5zdGF0LmN0aW1lKTtcbiAgICAgIGlmIChkLmdldEZ1bGxZZWFyKCkgIT09IHllYXIpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuICAgIGNvbnN0IGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdID0gT2JqZWN0LmVudHJpZXMoY291bnRzKS5tYXAoKFtkYXRlLCBuXSkgPT4gKHtcbiAgICAgIGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAsXG4gICAgfSkpO1xuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDAsIGNyZWF0ZWRUaGlzV2VlayA9IDA7XG4gICAgY29uc3Qgd2Vla0FnbyA9IERhdGUubm93KCkgLSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBjb250aW51ZTtcbiAgICAgIHRvdGFsTm90ZXMrKztcbiAgICAgIGlmICh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgdG90YWxSZXZpZXdlZCsrO1xuICAgICAgaWYgKGYuc3RhdC5jdGltZSA+PSB3ZWVrQWdvKSBjcmVhdGVkVGhpc1dlZWsrKztcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsUGN0ID0gdG90YWxOb3RlcyA+IDAgPyBNYXRoLnJvdW5kKHRvdGFsUmV2aWV3ZWQgLyB0b3RhbE5vdGVzICogMTAwKSA6IDA7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJFU1RBVFx1MDBDRFNUSUNBU1wiIH0pO1xuXG4gICAgLy8gTlx1MDBGQW1lcm9zIGdsb2JhaXNcbiAgICBjb25zdCBnbG9iID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWdsb2JhbFwiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZ1wiLCB0ZXh0OiBTdHJpbmcodG90YWxOb3RlcykgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwibm90YXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWcgd2Qtc3RhdC1yZXYtbnVtXCIsIHRleHQ6IGAke2dsb2JhbFBjdH0lYCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJyZXZpc2FkYXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC13ZWVrXCIsIHRleHQ6IGArJHtjcmVhdGVkVGhpc1dlZWt9YCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJlc3RhIHNlbWFuYVwiIH0pO1xuXG4gICAgLy8gQnJlYWtkb3duIHBvciBwYXN0YVxuICAgIGNvbnN0IHRhYmxlID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXRhYmxlXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuXG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA9PT0gMCkgY29udGludWU7XG4gICAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHBjdCA9IE1hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCk7XG5cbiAgICAgIGNvbnN0IHJvdyA9IHRhYmxlLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXJvd1wiIH0pO1xuICAgICAgcm93LnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgICBjb25zdCBuYW1lRWwgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZm9sZGVyXCIgfSk7XG4gICAgICByZW5kZXJJY29uKG5hbWVFbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgbmFtZUVsLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtY291bnRcIiwgdGV4dDogYCR7cnYudG90YWx9YCB9KTtcblxuICAgICAgY29uc3QgYmFyV3JhcCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXJcIiB9KTtcbiAgICAgIGJhcldyYXAuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXMgKCR7cGN0fSUpYCk7XG4gICAgICBjb25zdCBmaWxsID0gYmFyV3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXItZmlsbFwiIH0pO1xuICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXBjdFwiLCB0ZXh0OiBgJHtwY3R9JWAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIExpc3RhIC8gZ3JhZGUgZGUgbm90YXMgY29tIHRvZ2dsZSBlIGluZGljYWRvciByZXZpZXdlZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlck5vdGVzKHBhcmVudDogSFRNTEVsZW1lbnQsIG5vdGVzOiBURmlsZVtdLCBsYWJlbCA9IFwiXCIpIHtcbiAgICBpZiAoIW5vdGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGlzR3JpZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID09PSBcImdyaWRcIjtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IHRoaXMucmV2aWV3RmlsdGVyID8gbm90ZXMuZmlsdGVyKGYgPT4gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgIT09IHRydWUpIDogbm90ZXM7XG5cbiAgICBjb25zdCBoZHIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWhkclwiIH0pO1xuICAgIGNvbnN0IGNvdW50VHh0ID0gdGhpcy5yZXZpZXdGaWx0ZXJcbiAgICAgID8gYCR7ZmlsdGVyZWQubGVuZ3RofSBwZW5kZW50ZSR7ZmlsdGVyZWQubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifSAvICR7bm90ZXMubGVuZ3RofWBcbiAgICAgIDogKGxhYmVsIHx8IGAke25vdGVzLmxlbmd0aH0gbm90YSR7bm90ZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWApO1xuICAgIGhkci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGVzLWxhYmVsXCIsIHRleHQ6IGNvdW50VHh0IH0pO1xuXG4gICAgY29uc3QgdG9nID0gaGRyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC12aWV3LXRvZ2dsZVwiIH0pO1xuICAgIGNvbnN0IGJ0blBlbmQgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKHRoaXMucmV2aWV3RmlsdGVyID8gXCIgd2Qtdmlldy1hY3RpdmUgd2Qtdmlldy1wZW5kXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1Q0JcIiB9KTtcbiAgICBidG5QZW5kLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vc3RyYXIgc1x1MDBGMyBwZW5kZW50ZXMgKG5cdTAwRTNvIHJldmlzYWRhcylcIik7XG4gICAgYnRuUGVuZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucmV2aWV3RmlsdGVyID0gIXRoaXMucmV2aWV3RmlsdGVyOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkwgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCFpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjYxXCIgfSk7XG4gICAgYnRuTC5zZXRBdHRyKFwidGl0bGVcIiwgXCJMaXN0YVwiKTtcbiAgICBidG5MLm9uY2xpY2sgPSBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImxpc3RcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgYnRuRyA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI5RVwiIH0pO1xuICAgIGJ0bkcuc2V0QXR0cihcInRpdGxlXCIsIFwiQ29sdW5hc1wiKTtcbiAgICBidG5HLm9uY2xpY2sgPSBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImdyaWRcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICBpZiAoIWZpbHRlcmVkLmxlbmd0aCkge1xuICAgICAgcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiB0aGlzLnJldmlld0ZpbHRlciA/IFwiTmVuaHVtYSBub3RhIHBlbmRlbnRlIG5lc3RhIHBhc3RhLlwiIDogXCJOZW5odW1hIG5vdGEuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzR3JpZCkge1xuICAgICAgY29uc3QgZ3JpZCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY2FyZCB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBwb3IgdGlwbyBkZSBhcnF1aXZvIChub3RhIC8gY2FudmFzIC8gYmFzZSkgXHUyMDE0IEZhc2UgOS4yXG4gICAgICAgIGNvbnN0IGNvdiA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jb3ZlciB3ZC1maWxlLSR7Zi5leHRlbnNpb259YCB9KTtcbiAgICAgICAgc2V0SWNvbihjb3YuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLWNvdmVyLWdseXBoXCIgfSksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuXG4gICAgICAgIGlmIChpc01kKSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHVyZykgeyBjb25zdCB3ID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cblxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIGNhcmQub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGlzdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLXJvdyB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgY29uc3QgdGkgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtdHlwZWljb24gd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24odGksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLWRvdCB3ZC1iYWRnZS0ke3N0fWAgfSk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBHclx1MDBFMWZpY28gZGUgY3Jlc2NpbWVudG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJHcm93dGgocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfR1JPVykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNSRVNDSU1FTlRPIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBidG5EYXkgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJkaWFcIiB9KTtcbiAgICBidG5EYXkuc2V0QXR0cihcInRpdGxlXCIsIFwiTm90YXMgY3JpYWRhcyBwb3IgZGlhXCIpO1xuICAgIGJ0bkRheS5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkN1bSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwidG90YWxcIiB9KTtcbiAgICBidG5DdW0uc2V0QXR0cihcInRpdGxlXCIsIFwiVG90YWwgYWN1bXVsYWRvIG5vIHBlclx1MDBFRG9kb1wiKTtcbiAgICBidG5DdW0ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSB0cnVlOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gQWdydXBhIG5vdGFzIHBvciBkYXRhIGRlIGNyaWFcdTAwRTdcdTAwRTNvXG4gICAgY29uc3QgY291bnRzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkobmV3IERhdGUoZi5zdGF0LmN0aW1lKSk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuXG4gICAgLy8gXHUwMERBbHRpbW9zIE4gZGlhcyAobWVub3Mgbm8gY2VsdWxhcilcbiAgICBjb25zdCBEQVlTID0gUGxhdGZvcm0uaXNQaG9uZSA/IDE1IDogMzA7XG4gICAgY29uc3QgZGF5czogeyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gREFZUyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb25zdCBbLCBtLCBkYXldID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICAgIGRheXMucHVzaCh7IGtleSwgY291bnQ6IGNvdW50c1trZXldID8/IDAsIGxhYmVsOiBgJHtkYXl9LyR7bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsID0gZGF5cy5yZWR1Y2UoKHMsIGQpID0+IHMgKyBkLmNvdW50LCAwKTtcbiAgICBjb25zdCB0b2RheUtleSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gTW9kbyBjdW11bGF0aXZvOiBzb21hIGFjdW11bGFkYSBkaWEgYSBkaWFcbiAgICB0eXBlIERheUVudHJ5ID0geyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgZGlzcGxheVZhbDogbnVtYmVyIH07XG4gICAgbGV0IGVudHJpZXM6IERheUVudHJ5W107XG4gICAgaWYgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkge1xuICAgICAgbGV0IGFjYyA9IDA7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiB7IGFjYyArPSBkLmNvdW50OyByZXR1cm4geyAuLi5kLCBkaXNwbGF5VmFsOiBhY2MgfTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+ICh7IC4uLmQsIGRpc3BsYXlWYWw6IGQuY291bnQgfSkpO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5lbnRyaWVzLm1hcChlID0+IGUuZGlzcGxheVZhbCksIDEpO1xuXG4gICAgLy8gTGluaGEgZGUgcmVzdW1vXG4gICAgY29uc3QgaW5mbyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWluZm9cIiB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXRvdGFsXCIsIHRleHQ6IGAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGVudHJpZXNbZW50cmllcy5sZW5ndGggLSAxXS5kaXNwbGF5VmFsIDogdG90YWx9YCB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXBlcmlvZFwiLCB0ZXh0OiB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBgbm90YXMgYWN1bXVsYWRhcyAoJHtEQVlTfSBkaWFzKWAgOiBgbm90YXMgY3JpYWRhcyBub3MgXHUwMEZBbHRpbW9zICR7REFZU30gZGlhc2AgfSk7XG5cbiAgICAvLyBHclx1MDBFMWZpY28gZGUgYmFycmFzXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoeyBrZXksIGNvdW50LCBsYWJlbCwgZGlzcGxheVZhbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBkaXNwbGF5VmFsID09PSAwO1xuICAgICAgY29uc3QgYmFyID0gYmFyQXJlYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhclwiICsgKGlzRW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGlzRW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoZGlzcGxheVZhbCAvIG1heCkgKiAxMDApKX0lYDtcbiAgICAgIGlmICghaXNFbXB0eSkgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtsYWJlbH06ICR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZGlzcGxheVZhbCArIFwiIHRvdGFsXCIgOiBjb3VudCArIFwiIG5vdGEocylcIn1gKTtcblxuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IDcgfHwgaWR4ID09PSAxNCB8fCBpZHggPT09IDIxIHx8IGlkeCA9PT0gMjkgfHwga2V5ID09PSB0b2RheUtleTtcbiAgICAgIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWxibFwiLCB0ZXh0OiBzaG93TGJsID8gbGFiZWwgOiBcIlwiIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgKGRlbGVnYWRvIGFvIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICAvLyBCb3RcdTAwRTNvIGRlIG5hdmVnYVx1MDBFN1x1MDBFM28gXHUyMTkyIGFicmUgYSBhYmEgZGVkaWNhZGEgZG8gVG9kb2lzdCAobyBkYXNoYm9hcmQgXHUwMEU5IG8gaHViKS5cbiAgICBjb25zdCBvcGVuID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW9wZW5idG5cIiB9KTtcbiAgICBzZXRJY29uKG9wZW4sIFwic3F1YXJlLWFycm93LW91dC11cC1yaWdodFwiKTtcbiAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIGEgYWJhIGRvIFRvZG9pc3RcIik7XG4gICAgb3Blbi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4ub3BlblRvZG9pc3QoKTsgfTtcbiAgICAvLyBMYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgY29tcGFjdG8gKHNvbWUgc2Ugblx1MDBFM28gaG91dmVyIHBhY290ZXMpLlxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyUGFja2FnZXMoc2VjKTtcbiAgICAvLyBEYXNoYm9hcmQgPSBzXHUwMEYzIG8gZXNzZW5jaWFsIChBdHJhc2FkYXMgXHUwMEI3IEhvamUgXHUwMEI3IFByXHUwMEYzeGltb3MgNykuIFwiRGVwb2lzXCIgZmljYVxuICAgIC8vIHNcdTAwRjMgbmEgYWJhIGRvIFRvZG9pc3QgXHUyMTkyIHJlY29ycmVudGVzIHNcdTAwRjMgYXBhcmVjZW0gYXF1aSBwZXJ0byBkbyBkaWEuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMsIHsgc2hvd0xhdGVyOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nICsgY29uZmxpdG9zKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICByZXNldFN5bmMoKSB7XG4gICAgdGhpcy5zeW5jRGF0YSA9IG51bGw7XG4gICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoU3luYyhtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmICghYmFzZSB8fCAha2V5IHx8IHRoaXMuc3luY0xvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHN0R2V0PFNURm9sZGVyW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZm9sZGVyc1wiKTtcbiAgICAgIGNvbnN0IHdhbnRlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkLnRyaW0oKTtcbiAgICAgIGNvbnN0IGZvbGRlciA9IGZvbGRlcnMuZmluZChmID0+IGYuaWQgPT09IHdhbnRlZCkgPz8gZm9sZGVyc1swXTtcbiAgICAgIGlmICghZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJuZW5odW1hIHBhc3RhIGNvbmZpZ3VyYWRhIG5vIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNvbnN0IGZpZCA9IGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIuaWQpO1xuXG4gICAgICBjb25zdCBbZGV2aWNlcywgY29ubnMsIHN0YXR1cywgc3RhdHMsIHN5c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0R2V0PFNURGV2aWNlW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZGV2aWNlc1wiKSxcbiAgICAgICAgc3RHZXQ8eyBjb25uZWN0aW9uczogUmVjb3JkPHN0cmluZywgeyBjb25uZWN0ZWQ6IGJvb2xlYW4gfT4gfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9jb25uZWN0aW9uc1wiKSxcbiAgICAgICAgc3RHZXQ8U1RTdGF0dXM+KGJhc2UsIGtleSwgYC9yZXN0L2RiL3N0YXR1cz9mb2xkZXI9JHtmaWR9YCksXG4gICAgICAgIHN0R2V0PFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9Pj4oYmFzZSwga2V5LCBcIi9yZXN0L3N0YXRzL2RldmljZVwiKS5jYXRjaCgoKSA9PiAoe30gYXMgUmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+KSksXG4gICAgICAgIHN0R2V0PHsgbXlJRDogc3RyaW5nIH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vc3RhdHVzXCIpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZSA9IGRldmljZXMuZmlsdGVyKGQgPT4gZC5kZXZpY2VJRCAhPT0gc3lzLm15SUQpO1xuICAgICAgY29uc3Qgcm93cyA9IGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZS5tYXAoYXN5bmMgZCA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBhd2FpdCBzdEdldDxTVENvbXBsZXRpb24+KGJhc2UsIGtleSwgYC9yZXN0L2RiL2NvbXBsZXRpb24/Zm9sZGVyPSR7ZmlkfSZkZXZpY2U9JHtkLmRldmljZUlEfWApXG4gICAgICAgICAgLmNhdGNoKCgpID0+ICh7IGNvbXBsZXRpb246IDAsIGdsb2JhbEl0ZW1zOiAwLCBuZWVkSXRlbXM6IDAsIG5lZWRCeXRlczogMCwgbmVlZERlbGV0ZXM6IDAgfSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGQubmFtZSB8fCBkLmRldmljZUlELnNsaWNlKDAsIDcpLFxuICAgICAgICAgIG9ubGluZTogISFjb25ucy5jb25uZWN0aW9uc1tkLmRldmljZUlEXT8uY29ubmVjdGVkLFxuICAgICAgICAgIGNvbXBsZXRpb246IGMuY29tcGxldGlvbixcbiAgICAgICAgICBnbG9iYWxJdGVtczogYy5nbG9iYWxJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRJdGVtczogYy5uZWVkSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkQnl0ZXM6IGMubmVlZEJ5dGVzLFxuICAgICAgICAgIG5lZWREZWxldGVzOiBjLm5lZWREZWxldGVzLFxuICAgICAgICAgIGxhc3RTZWVuOiBzdGF0c1tkLmRldmljZUlEXT8ubGFzdFNlZW4gPz8gXCJcIixcbiAgICAgICAgfTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5zeW5jRGF0YSA9IHtcbiAgICAgICAgc3RhdGU6IHN0YXR1cy5zdGF0ZSxcbiAgICAgICAgbmVlZEZpbGVzOiBzdGF0dXMubmVlZEZpbGVzLFxuICAgICAgICBuZWVkQnl0ZXM6IHN0YXR1cy5uZWVkQnl0ZXMsXG4gICAgICAgIGZvbGRlckxhYmVsOiBmb2xkZXIubGFiZWwgfHwgZm9sZGVyLmlkLFxuICAgICAgICBlcnJvcnM6IChzdGF0dXMuZXJyb3JzID8/IDApICsgKHN0YXR1cy5wdWxsRXJyb3JzID8/IDApLFxuICAgICAgICBkZXZpY2VzOiByb3dzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zeW5jRXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NZTkMpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXN5bmMtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiU0lOQ1JPTklaQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5zeW5jTG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciBlc3RhZG8gZG8gU3luY3RoaW5nXCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH07XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb25maWd1cmUgYSBVUkwgZSBhIEFQSSBrZXkgZG8gU3luY3RoaW5nIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQuXCIgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmNFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGZhbGFyIGNvbSBvIFN5bmN0aGluZzogJHt0aGlzLnN5bmNFcnJvcn1gIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3luY0ZldGNoZWRBdCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmNMb2FkaW5nKSB2b2lkIHRoaXMuZmV0Y2hTeW5jKGZhbHNlKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyU3luY0JvZHkoc2VjLCB0aGlzLnN5bmNEYXRhISk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDb25mbGljdHMoc2VjKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luY0JvZHkoc2VjOiBIVE1MRWxlbWVudCwgZDogU3luY0RhdGEpIHtcbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtYm94XCIgfSk7XG5cbiAgICAvLyBFc3RhZG8gZGEgcGFzdGEuXG4gICAgY29uc3QgYnVzeSA9IGQuc3RhdGUgPT09IFwic3luY2luZ1wiIHx8IGQuc3RhdGUgPT09IFwic2Nhbm5pbmdcIjtcbiAgICBjb25zdCBmbCA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1mb2xkZXJcIiB9KTtcbiAgICBjb25zdCBkb3QgPSBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGQuZXJyb3JzID8gXCJ3ZC1zLWVyclwiIDogYnVzeSA/IFwid2Qtcy1idXN5XCIgOiBcIndkLXMtb2tcIikgfSk7XG4gICAgZG90LnNldFRleHQoZC5lcnJvcnMgPyBcIlx1MjZBMFwiIDogYnVzeSA/IFwiXHUyN0YzXCIgOiBcIlx1MjVDRlwiKTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZm5hbWVcIiwgdGV4dDogZC5mb2xkZXJMYWJlbCB9KTtcbiAgICBjb25zdCBzdCA9IGQuc3RhdGUgPT09IFwiaWRsZVwiID8gXCJlbSBkaWFcIiA6IGQuc3RhdGUgPT09IFwic3luY2luZ1wiID8gYHNpbmNyb25pemFuZG8gXHUyMDE0ICR7ZC5uZWVkRmlsZXN9IGl0ZW5zICgke2h1bWFuQnl0ZXMoZC5uZWVkQnl0ZXMpfSlgIDogZC5zdGF0ZTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZnN0YXRlXCIsIHRleHQ6IHN0IH0pO1xuXG4gICAgLy8gQXBhcmVsaG9zLlxuICAgIGZvciAoY29uc3QgZGV2IG9mIGQuZGV2aWNlcykge1xuICAgICAgY29uc3Qgcm93ID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWRldlwiIH0pO1xuICAgICAgY29uc3QgbyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGRldi5vbmxpbmUgPyBcIndkLXMtb2tcIiA6IFwid2Qtcy1vZmZcIikgfSk7XG4gICAgICBvLnNldFRleHQoXCJcdTI1Q0ZcIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRuYW1lXCIsIHRleHQ6IGRldi5uYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY29tcFwiLCB0ZXh0OiBgJHtNYXRoLnJvdW5kKGRldi5jb21wbGV0aW9uKX0lYCB9KTtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzICYmIGRldi5nbG9iYWxJdGVtcylcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY291bnRcIiwgdGV4dDogYCR7ZGV2Lmdsb2JhbEl0ZW1zIC0gZGV2Lm5lZWRJdGVtc30vJHtkZXYuZ2xvYmFsSXRlbXN9YCB9KTtcbiAgICAgIGNvbnN0IGV4dHJhID0gZGV2Lm5lZWREZWxldGVzID8gYCR7ZGV2Lm5lZWREZWxldGVzfSBleGNsdXNcdTAwRjVlc2AgOiBkZXYubmVlZEJ5dGVzID8gaHVtYW5CeXRlcyhkZXYubmVlZEJ5dGVzKSA6IFwiXCI7XG4gICAgICBpZiAoZXh0cmEpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHBlbmRcIiwgdGV4dDogZXh0cmEgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRzZWVuXCIsIHRleHQ6IGRldi5vbmxpbmUgPyBcIm9ubGluZVwiIDogcmVsVGltZShkZXYubGFzdFNlZW4pIH0pO1xuICAgIH1cblxuICAgIGlmIChkLmVycm9ycykgYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWVycmxpbmVcIiwgdGV4dDogYFx1MjZBMCAke2QuZXJyb3JzfSBlcnJvKHMpIG5hIHBhc3RhYCB9KTtcbiAgfVxuXG4gIC8vIExpc3RhIGRlIGNcdTAwRjNwaWFzIGRlIGNvbmZsaXRvIGRvIFN5bmN0aGluZyAoYWJyaXIgLyBhcGFnYXIgY29tIGNvbmZpcm1hXHUwMEU3XHUwMEUzbykuXG4gIHByaXZhdGUgcmVuZGVyQ29uZmxpY3RzKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLmZpbHRlcihmID0+IGYubmFtZS5pbmNsdWRlcyhcIi5zeW5jLWNvbmZsaWN0LVwiKSk7XG4gICAgY29uc3Qgd3JhcCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jb25mbGljdHNcIiB9KTtcbiAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLXN1YlwiLCB0ZXh0OiBgQ29uZmxpdG9zICgke2NvbmZsaWN0cy5sZW5ndGh9KWAgfSk7XG4gICAgaWYgKCFjb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLW5vY29uZlwiLCB0ZXh0OiBcIk5lbmh1bSBjb25mbGl0by4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBjb25mbGljdHMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY3Jvd1wiIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25hbWVcIiwgdGV4dDogZi5uYW1lIH0pO1xuICAgICAgbmFtZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBcIiArIGYucGF0aCk7XG4gICAgICBuYW1lLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICBpZiAodGhpcy5jb25mbGljdENvbmZpcm0gPT09IGYucGF0aCkge1xuICAgICAgICBjb25zdCB5ZXMgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWN5ZXNcIiwgdGV4dDogXCJhcGFnYXI/XCIgfSk7XG4gICAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmLCBmYWxzZSk7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfTtcbiAgICAgICAgY29uc3Qgbm8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNub1wiLCB0ZXh0OiBcImNhbmNlbGFyXCIgfSk7XG4gICAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY2RlbFwiIH0pO1xuICAgICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpO1xuICAgICAgICBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiQXBhZ2FyIGNcdTAwRjNwaWEgZGUgY29uZmxpdG8gKHZhaSBwYXJhIGEgbGl4ZWlyYSlcIik7XG4gICAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IGYucGF0aDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhZGVyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiU2Vjb25kIEJyYWluXCIgfSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcbiAgLy8gQ29udHJvbGFkb3IgXHUwMEZBbmljbyBkbyBUb2RvaXN0IChlc3RhZG8gY29tcGFydGlsaGFkbyBlbnRyZSBkYXNoYm9hcmQgZSBhYmEpLlxuICB0b2RvITogVG9kb2lzdENvbnRyb2xsZXI7XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy50b2RvID0gbmV3IFRvZG9pc3RDb250cm9sbGVyKHRoaXMuYXBwLCB0aGlzLCB0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEUsIGxlYWYgPT4gbmV3IERhc2hib2FyZFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFRPRE9JU1RfVklFV19UWVBFLCBsZWFmID0+IG5ldyBUb2RvaXN0VmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGF5b3V0LWRhc2hib2FyZFwiLCBcIkFicmlyIFdlcnVzIERhc2hib2FyZFwiLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGlzdC1jaGVja3NcIiwgXCJBYnJpciBUb2RvaXN0IChXZXJ1cylcIiwgKCkgPT4gdGhpcy5vcGVuVG9kb2lzdCgpKTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLWRhc2hib2FyZFwiLCBuYW1lOiBcIkFicmlyIERhc2hib2FyZFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuKCkgfSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi10b2RvaXN0XCIsIG5hbWU6IFwiQWJyaXIgVG9kb2lzdFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuVG9kb2lzdCgpIH0pO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgV2VydXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gIH1cblxuICAvLyBUb2RhcyBhcyB2aWV3cyAoZGFzaGJvYXJkICsgYWJhIFRvZG9pc3QpIGFiZXJ0YXMsIHF1ZSB0XHUwMEVBbSBjb250cm9sYWRvciBUb2RvaXN0LlxuICBwcml2YXRlIHRvZG9WaWV3cygpOiAoRGFzaGJvYXJkVmlldyB8IFRvZG9pc3RWaWV3KVtdIHtcbiAgICBjb25zdCBvdXQ6IChEYXNoYm9hcmRWaWV3IHwgVG9kb2lzdFZpZXcpW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgW1ZJRVdfVFlQRSwgVE9ET0lTVF9WSUVXX1RZUEVdKVxuICAgICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUodCkpIHtcbiAgICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEYXNoYm9hcmRWaWV3IHx8IHYgaW5zdGFuY2VvZiBUb2RvaXN0Vmlldykgb3V0LnB1c2godik7XG4gICAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8vIFJlLWJ1c2NhIG8gVG9kb2lzdCAoY29udHJvbGxlciBcdTAwRkFuaWNvIFx1MjE5MiBub3RpZmljYSB0b2RhcyBhcyB2aWV3cyBpbnNjcml0YXMpLlxuICByZWZyZXNoRGFzaGJvYXJkcygpIHtcbiAgICB0aGlzLnRvZG8ucmVzZXQoKTtcbiAgfVxuXG4gIC8vIFJlc2V0YSBvIGVzdGFkbyBkbyBTeW5jdGhpbmcgbmFzIGRhc2hib2FyZHMgKGV4LjogdG9rZW4vVVJMIGFsdGVyYWRvcykuXG4gIHJlZnJlc2hTeW5jKCkge1xuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSkpIHtcbiAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcpIHYucmVzZXRTeW5jKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmUtcmVuZGVyaXphIHRvZGFzIGFzIHZpZXdzIGFiZXJ0YXMgKGFwXHUwMEYzcyBtdWRhciBjb25maWcgbmEgYWJhIGRlXG4gIC8vIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzOiBvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMsIHBhY290ZXMpLlxuICByZXJlbmRlckRhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCB2IG9mIHRoaXMudG9kb1ZpZXdzKCkpIHYucmVmcmVzaCgpO1xuICB9XG5cbiAgLy8gTW9zdHJhL29jdWx0YSB1bWEgc2VcdTAwRTdcdTAwRTNvIChcInNlYzo8aWQ+XCIpIG91IHBhc3RhIChjYW1pbmhvKSBwb3IgY2hhdmUgZW0gYGhpZGRlbmAuXG4gIGFzeW5jIHNldEhpZGRlbihrZXk6IHN0cmluZywgaGlkZGVuOiBib29sZWFuKSB7XG4gICAgY29uc3QgaGFzID0gdGhpcy5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgICBpZiAoaGlkZGVuICYmICFoYXMpIHRoaXMuc2V0dGluZ3MuaGlkZGVuLnB1c2goa2V5KTtcbiAgICBlbHNlIGlmICghaGlkZGVuICYmIGhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5maWx0ZXIoayA9PiBrICE9PSBrZXkpO1xuICAgIGVsc2UgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIC8vIFJlb3JkZW5hIHVtYSBzZVx1MDBFN1x1MDBFM28gZW0gc2VjdGlvbk9yZGVyIChkaXIgPSAtMSBzb2JlLCArMSBkZXNjZSkuXG4gIGFzeW5jIG1vdmVTZWN0aW9uKGlkOiBTZWN0aW9uSWQsIGRpcjogbnVtYmVyKSB7XG4gICAgY29uc3Qgb3JkZXIgPSBbLi4udGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXJdO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaiA+PSBvcmRlci5sZW5ndGgpIHJldHVybjtcbiAgICBbb3JkZXJbaV0sIG9yZGVyW2pdXSA9IFtvcmRlcltqXSwgb3JkZXJbaV1dO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gb3JkZXI7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgYXN5bmMgbW92ZVBhY2thZ2UoaW5kZXg6IG51bWJlciwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBjb25zdCBqID0gaW5kZXggKyBkaXI7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBqIDwgMCB8fCBqID49IGFyci5sZW5ndGgpIHJldHVybjtcbiAgICBbYXJyW2luZGV4XSwgYXJyW2pdXSA9IFthcnJbal0sIGFycltpbmRleF1dO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgICBsZXQgbmVlZFN0TWlncmF0aW9uID0gZmFsc2U7ICAgLy8gY3JlZGVuY2lhaXMgU3luY3RoaW5nIG1pZ3JhbmRvIGRhdGEuanNvbiBcdTIxOTIgbG9jYWxTdG9yYWdlXG4gICAgLy8gU2FuZWFtZW50bzogc2VjdGlvbk9yZGVyIGNvbSBleGF0YW1lbnRlIGFzIHNlXHUwMEU3XHUwMEY1ZXMgdlx1MDBFMWxpZGFzLCBzZW0gZHVwbGljYXRhcy5cbiAgICBjb25zdCB2YWxpZDogU2VjdGlvbklkW10gPSBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxTZWN0aW9uSWQ+KCk7XG4gICAgY29uc3QgY2xlYW5lZCA9ICh0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciB8fCBbXSkuZmlsdGVyKFxuICAgICAgKHMpOiBzIGlzIFNlY3Rpb25JZCA9PiB2YWxpZC5pbmNsdWRlcyhzIGFzIFNlY3Rpb25JZCkgJiYgIXNlZW4uaGFzKHMgYXMgU2VjdGlvbklkKSAmJiAoc2Vlbi5hZGQocyBhcyBTZWN0aW9uSWQpLCB0cnVlKVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbGlkKSBpZiAoIXNlZW4uaGFzKHYpKSBjbGVhbmVkLnB1c2godik7XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBjbGVhbmVkOyAgIC8vIFwicmVwb3J0c1wiIHNvbWUgYXF1aSBzZSBlc3RhdmEgbnVtYSBjb25maWcgYW50aWdhXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2V0dGluZ3MuaGlkZGVuKSkgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSBbXTtcbiAgICAvLyBGb250ZXMgZGEgU2VtYW5hICh2MC4xMC4xKTogdmFsaWRhIGEgbGlzdGE7IHNlIGF1c2VudGUvaW52XHUwMEUxbGlkYSwgdXNhIG8gZGVmYXVsdC5cbiAgICBjb25zdCBjcyA9IHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gQXJyYXkuaXNBcnJheShjcykgJiYgY3MubGVuZ3RoXG4gICAgICA/IGNzLmZpbHRlcihzID0+IHMgJiYgdHlwZW9mIHMucGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAubWFwKHMgPT4gKHsgcGF0aDogcy5wYXRoLCBjb2xvcjogdHlwZW9mIHMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBzLmNvbG9yIDogQUNDRU5UU1swXSwgb246IHMub24gIT09IGZhbHNlIH0pKVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLmNhbGVuZGFyU291cmNlcy5tYXAocyA9PiAoeyAuLi5zIH0pKTtcbiAgICAvLyBTYW5lYW1lbnRvIFRvZG9pc3QgKHYwLjcuMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICAgIGNvbnN0IHRmID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzID0ge1xuICAgICAgcHJvamVjdHM6IEFycmF5LmlzQXJyYXkodGY/LnByb2plY3RzKSA/IHRmLnByb2plY3RzIDogW10sXG4gICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkodGY/LmxhYmVscykgPyB0Zi5sYWJlbHMgOiBbXSxcbiAgICB9O1xuICAgIC8vIEV4aWJpXHUwMEU3XHUwMEUzbyBuYXMgbGluaGFzICh2MC44LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgIT09IGZhbHNlO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID09PSB0cnVlO1xuICAgIC8vIFN5bmN0aGluZyAodjAuMTAuMCkgXHUyMDE0IGNyZWRlbmNpYWlzIHNcdTAwRTNvIFBPUi1ESVNQT1NJVElWTzogdml2ZW0gbm8gbG9jYWxTdG9yYWdlXG4gICAgLy8gKG5cdTAwRTNvIHNpbmNyb25pemFtIHBlbG8gZGF0YS5qc29uKS4gTWlncmFcdTAwRTdcdTAwRTNvICgxeCk6IHNlIG8gbG9jYWxTdG9yYWdlIGFpbmRhIG5cdTAwRTNvXG4gICAgLy8gdGVtLCBoZXJkYSBvIHZhbG9yIHF1ZSBlc3RhdmEgbm8gZGF0YS5qc29uIGUgcmVncmF2YSAodmVyIGZpbSBkbyBtXHUwMEU5dG9kbykuXG4gICAgY29uc3QgbHNHZXQgPSAoazogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBjb25zdCB2ID0gdGhpcy5hcHAubG9hZExvY2FsU3RvcmFnZShrKTtcbiAgICAgIHJldHVybiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiA/IHYgOiBudWxsO1xuICAgIH07XG4gICAgY29uc3QgZGF0YVVybCA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybC50cmltKClcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgOiBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgIGNvbnN0IGRhdGFLZXkgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA6IFwiXCI7XG4gICAgY29uc3QgZGF0YUZvbGRlciA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID09PSBcInN0cmluZ1wiID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA6IFwiXCI7XG4gICAgbmVlZFN0TWlncmF0aW9uID0gbHNHZXQoTFNfU1RfVVJMKSA9PT0gbnVsbCAmJiBsc0dldChMU19TVF9LRVkpID09PSBudWxsICYmIGxzR2V0KExTX1NUX0ZPTERFUikgPT09IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSBsc0dldChMU19TVF9VUkwpID8/IGRhdGFVcmw7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPSBsc0dldChMU19TVF9LRVkpID8/IGRhdGFLZXk7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9IGxzR2V0KExTX1NUX0ZPTERFUikgPz8gZGF0YUZvbGRlcjtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPT09IHRydWU7XG4gICAgLy8gUGFjb3RlcyBkZSB0YXJlZmFzICh2MC4xMi4wKS5cbiAgICBjb25zdCB0cCA9IHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzID0gQXJyYXkuaXNBcnJheSh0cClcbiAgICAgID8gdHAuZmlsdGVyKHAgPT4gcCAmJiB0eXBlb2YgcC5pZCA9PT0gXCJzdHJpbmdcIikubWFwKHAgPT4gKHtcbiAgICAgICAgICBpZDogcC5pZCxcbiAgICAgICAgICBuYW1lOiB0eXBlb2YgcC5uYW1lID09PSBcInN0cmluZ1wiID8gcC5uYW1lIDogXCJcIixcbiAgICAgICAgICBpY29uOiB0eXBlb2YgcC5pY29uID09PSBcInN0cmluZ1wiICYmIHAuaWNvbi50cmltKCkgPyBwLmljb24gOiB1bmRlZmluZWQsXG4gICAgICAgICAgdGFza3M6IEFycmF5LmlzQXJyYXkocC50YXNrcykgPyBwLnRhc2tzLmZpbHRlcih4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSA6IFtdLFxuICAgICAgICAgIHByb2plY3RJZDogdHlwZW9mIHAucHJvamVjdElkID09PSBcInN0cmluZ1wiICYmIHAucHJvamVjdElkID8gcC5wcm9qZWN0SWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHAubGFiZWxzKSA/IHAubGFiZWxzLmZpbHRlcih4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSkpXG4gICAgICA6IFtdO1xuICAgIHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gPSBbXCJhbHdheXNcIiwgXCJtYW55XCIsIFwibmV2ZXJcIl0uaW5jbHVkZXModGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSlcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA6IFwibWFueVwiO1xuXG4gICAgLy8gTWlncmFcdTAwRTdcdTAwRTNvIDF4OiBncmF2YSBhcyBjcmVkZW5jaWFpcyBubyBsb2NhbFN0b3JhZ2UgZSBhcyByZW1vdmUgZG8gZGF0YS5qc29uLlxuICAgIGlmIChuZWVkU3RNaWdyYXRpb24pIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgLy8gQ3JlZGVuY2lhaXMgZG8gU3luY3RoaW5nIHNcdTAwRTNvIHBvci1kaXNwb3NpdGl2byBcdTIxOTIgbG9jYWxTdG9yYWdlIChuXHUwMEUzbyBzaW5jcm9uaXphKS5cbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX1VSTCwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwpO1xuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfS0VZLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSk7XG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9GT0xERVIsIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQpO1xuICAgIC8vIE8gZGF0YS5qc29uIChzaW5jcm9uaXphZG8gcGVsbyBTeW5jdGhpbmcpIE5cdTAwQzNPIGxldmEgYXMgY3JlZGVuY2lhaXMuXG4gICAgY29uc3Qgc2hhcmVkOiBQYXJ0aWFsPERhc2hTZXR0aW5ncz4gPSB7IC4uLnRoaXMuc2V0dGluZ3MgfTtcbiAgICBkZWxldGUgc2hhcmVkLnN5bmN0aGluZ1VybDtcbiAgICBkZWxldGUgc2hhcmVkLnN5bmN0aGluZ0FwaUtleTtcbiAgICBkZWxldGUgc2hhcmVkLnN5bmN0aGluZ0ZvbGRlcklkO1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEoc2hhcmVkKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW4oKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEUpWzBdO1xuICAgIGlmICghbGVhZikgeyBsZWFmID0gd29ya3NwYWNlLmdldExlYWYoZmFsc2UpOyBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IFZJRVdfVFlQRSwgYWN0aXZlOiB0cnVlIH0pOyB9XG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBhc3luYyBvcGVuVG9kb2lzdCgpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFRPRE9JU1RfVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBUT0RPSVNUX1ZJRVdfVFlQRSwgYWN0aXZlOiB0cnVlIH0pOyB9XG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBvbnVubG9hZCgpIHt9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGVkaWNhZGEgZG8gVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIEh1YiBkbyBUb2RvaXN0IG5hIFx1MDBFMXJlYSBjZW50cmFsIChuXHUwMEUzbyBcdTAwRTkgc2lkZWJhcik6IGxhblx1MDBFN2Fkb3IgZGUgcGFjb3RlcyArIGEgbWVzbWFcbi8vIGxpc3RhIGRlIHRhcmVmYXMgZG8gZGFzaGJvYXJkICh2aWEgVG9kb2lzdENvbnRyb2xsZXIgY29tcGFydGlsaGFkbykuXG5jbGFzcyBUb2RvaXN0VmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSB1bnN1YlRvZG86ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBUT0RPSVNUX1ZJRVdfVFlQRTsgfVxuICBnZXREaXNwbGF5VGV4dCgpIHsgcmV0dXJuIFwiVG9kb2lzdFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsaXN0LWNoZWNrc1wiOyB9XG5cbiAgYXN5bmMgb25PcGVuKCkge1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIHRoaXMudW5zdWJUb2RvID0gdGhpcy5wbHVnaW4udG9kby5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZWZyZXNoKCkpO1xuICB9XG4gIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy51bnN1YlRvZG8/LigpO1xuICAgIHRoaXMudW5zdWJUb2RvID0gbnVsbDtcbiAgICB0aGlzLnBsdWdpbi50b2RvLmhpZGVUaXAoKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiLCBcIndkLXRvZG9pc3Qtdmlld1wiKTtcblxuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIlRvZG9pc3RcIiB9KTtcblxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyUGFja2FnZXMocm9vdCwgeyBoZWFkaW5nOiB0cnVlIH0pO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyTGlzdChzZWMsIGN0cmxzKTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgTW9kYWwgZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvIGdlblx1MDBFOXJpY28gKHJlc29sdmUgdHJ1ZS9mYWxzZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBDb25maXJtSXRlbSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbGFiZWxzPzogeyBuYW1lOiBzdHJpbmc7IGNvbG9yOiBzdHJpbmcgfVtdOyAgIC8vIGNoaXBzIG9wY2lvbmFpcyAoZXRpcXVldGFzKVxufVxuXG5pbnRlcmZhY2UgQ29uZmlybU9wdHMge1xuICB0aXRsZTogc3RyaW5nO1xuICBib2R5OiBzdHJpbmc7XG4gIGl0ZW1zPzogQ29uZmlybUl0ZW1bXTsgICAvLyBsaXN0YSBvcGNpb25hbCAoZXguOiB0YXJlZmFzIGEgY3JpYXIpXG4gIGN0YTogc3RyaW5nOyAgICAgICAgICAgICAvLyByXHUwMEYzdHVsbyBkbyBib3RcdTAwRTNvIGRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xufVxuXG5jbGFzcyBDb25maXJtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgZG9uZSA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBvcHRzOiBDb25maXJtT3B0cywgcHJpdmF0ZSByZXNvbHZlOiAob2s6IGJvb2xlYW4pID0+IHZvaWQpIHtcbiAgICBzdXBlcihhcHApO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcyhcIndkLWNvbmZpcm1cIik7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiB0aGlzLm9wdHMudGl0bGUgfSk7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwicFwiLCB7IHRleHQ6IHRoaXMub3B0cy5ib2R5IH0pO1xuICAgIGlmICh0aGlzLm9wdHMuaXRlbXM/Lmxlbmd0aCkge1xuICAgICAgY29uc3QgdWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ1bFwiLCB7IGNsczogXCJ3ZC1jb25maXJtLWxpc3RcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5vcHRzLml0ZW1zKSB7XG4gICAgICAgIGNvbnN0IGxpID0gdWwuY3JlYXRlRWwoXCJsaVwiKTtcbiAgICAgICAgbGkuY3JlYXRlU3Bhbih7IHRleHQ6IGl0LnRleHQgfSk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiBpdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgICAgICBjb25zdCBjaGlwID0gbGkuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb25maXJtLWxhYmVsXCIgfSk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBsLmNvbG9yO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsLm5hbWV9YCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhY3Rpb25zID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1hY3Rpb25zXCIgfSk7XG4gICAgYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KS5vbmNsaWNrID0gKCkgPT4gdGhpcy5jbG9zZSgpO1xuICAgIGNvbnN0IG9rID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJtb2QtY3RhXCIsIHRleHQ6IHRoaXMub3B0cy5jdGEgfSk7XG4gICAgb2sub25jbGljayA9ICgpID0+IHsgdGhpcy5kb25lID0gdHJ1ZTsgdGhpcy5jbG9zZSgpOyB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIHRoaXMucmVzb2x2ZSh0aGlzLmRvbmUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpcm1Nb2RhbChhcHA6IEFwcCwgb3B0czogQ29uZmlybU9wdHMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gbmV3IENvbmZpcm1Nb2RhbChhcHAsIG9wdHMsIHJlc29sdmUpLm9wZW4oKSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQb3AtdXAgZGUgZGV0YWxoZXMgZGEgdGFyZWZhIChzXHUwMEYzIGxlaXR1cmE7IGJvdFx1MDBFM28gRWRpdGFyIGFicmUgbyBmb3JtdWxcdTAwRTFyaW8pIFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0RldGFpbE9wdHMge1xuICB0YXNrOiBUb2RvaXN0VGFzaztcbiAgcHJvamVjdE5hbWU/OiBzdHJpbmc7XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgZWRpdDogKCkgPT4gdm9pZDtcbiAgY29tcGxldGU6ICgpID0+IHZvaWQ7XG59XG5cbmNsYXNzIFRhc2tEZXRhaWxNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsIHByaXZhdGUgb3B0czogVGFza0RldGFpbE9wdHMpIHsgc3VwZXIoYXBwKTsgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCwgdGl0bGVFbCwgbW9kYWxFbCB9ID0gdGhpcztcbiAgICBjb25zdCB0ID0gdGhpcy5vcHRzLnRhc2s7XG4gICAgbW9kYWxFbC5hZGRDbGFzcyhcIndkLXRhc2stbW9kYWxcIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHQuY29udGVudCk7XG5cbiAgICBjb25zdCBtZXRhID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10ZC1tZXRhXCIgfSk7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtcHJpXCIsIHRleHQ6IHByaS5sYWJlbCB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChkaykge1xuICAgICAgY29uc3QgW3ksIG0sIGRdID0gZGsuc3BsaXQoXCItXCIpO1xuICAgICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYFx1RDgzRFx1RENDNSAke2R9LyR7bX0vJHt5fSR7dC5kdWU/LmlzX3JlY3VycmluZyA/IFwiIFx1MjdGM1wiIDogXCJcIn1gIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRzLnByb2plY3ROYW1lKSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcFwiLCB0ZXh0OiBgIyAke3RoaXMub3B0cy5wcm9qZWN0TmFtZX1gIH0pO1xuICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkge1xuICAgICAgY29uc3QgY2hpcCA9IG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwIHdkLXRkLWxhYmVsXCIgfSk7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2x9YCB9KTtcbiAgICB9XG5cbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgYm9keSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay1tb2RhbC1kZXNjIG1hcmtkb3duLXJlbmRlcmVkXCIgfSk7XG4gICAgICB2b2lkIE1hcmtkb3duUmVuZGVyZXIucmVuZGVyKHRoaXMuYXBwLCB0LmRlc2NyaXB0aW9uIS50cmltKCksIGJvZHksIFwiXCIsIHRoaXMuY29tcG9uZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwicFwiLCB7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWVtcHR5XCIsIHRleHQ6IFwiRXN0YSB0YXJlZmEgblx1MDBFM28gdGVtIGRlc2NyaVx1MDBFN1x1MDBFM28uXCIgfSk7XG4gICAgfVxuXG4gICAgLy8gRWRpdGFyIChlc3F1ZXJkYSkgXHUwMEI3IENvbmNsdWlyICsgQWJyaXIgbm8gVG9kb2lzdCAoZGlyZWl0YSkuXG4gICAgY29uc3QgYWN0aW9ucyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay1tb2RhbC1hY3Rpb25zXCIgfSk7XG4gICAgY29uc3QgZWRpdCA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcwRSBFZGl0YXJcIiB9KTtcbiAgICBlZGl0Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY2xvc2UoKTsgdGhpcy5vcHRzLmVkaXQoKTsgfTtcbiAgICBhY3Rpb25zLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICBjb25zdCBkb25lID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzEzIENvbmNsdWlyXCIgfSk7XG4gICAgZG9uZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm9wdHMuY29tcGxldGUoKTsgdGhpcy5jbG9zZSgpOyB9O1xuICAgIGNvbnN0IG9wZW4gPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJBYnJpciBubyBUb2RvaXN0XCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgb3Blbi5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0KSwgXCJfYmxhbmtcIik7XG4gIH1cblxuICBvbkNsb3NlKCkgeyB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpOyB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBGb3JtdWxcdTAwRTFyaW8gZGUgdGFyZWZhIChjcmlhciAvIGVkaXRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBUYXNrRm9ybVZhbHVlcyB7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEkgMS4uNCAoNCA9IHAxKVxuICBkdWVEYXRlOiBzdHJpbmc7ICAgIC8vIFlZWVktTU0tREQgKGNhbGVuZFx1MDBFMXJpbyk7IFwiXCIgPSBzZW0gZGF0YVxuICBwcm9qZWN0SWQ6IHN0cmluZztcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbn1cblxuaW50ZXJmYWNlIFRhc2tGb3JtT3B0cyB7XG4gIG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjtcbiAgdGFzaz86IFRvZG9pc3RUYXNrO1xuICBwcmVmaWxsRHVlPzogc3RyaW5nO1xuICBwcm9qZWN0czogVG9kb2lzdFByb2plY3RbXTtcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBzdWJtaXQ6ICh2OiBUYXNrRm9ybVZhbHVlcykgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgcmVtb3ZlPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgY29tcGxldGU/OiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRm9ybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIHY6IFRhc2tGb3JtVmFsdWVzO1xuICBwcml2YXRlIGtub3duTGFiZWxzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBjb25maXJtRGVsID0gZmFsc2U7XG4gIHByaXZhdGUgYWN0aW9uc0VsITogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgb3B0czogVGFza0Zvcm1PcHRzKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICBjb25zdCB0ID0gb3B0cy50YXNrO1xuICAgIC8vIFByZWZpbGwgZGUgY3JpYVx1MDBFN1x1MDBFM286IFwiaG9qZVwiIFx1MjE5MiBkYXRhIGRlIGhvamU7IGpcdTAwRTEtWVlZWS1NTS1ERCBwYXNzYSBkaXJldG87IHJlc3RvIGlnbm9yYS5cbiAgICBjb25zdCBwcmUgPSBvcHRzLnByZWZpbGxEdWU7XG4gICAgY29uc3QgcHJlZmlsbERhdGUgPSBwcmUgPT09IFwiaG9qZVwiID8gdG9LZXkobmV3IERhdGUoKSlcbiAgICAgIDogKHByZSAmJiAvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChwcmUpID8gcHJlIDogXCJcIik7XG4gICAgdGhpcy52ID0ge1xuICAgICAgY29udGVudDogdD8uY29udGVudCA/PyBcIlwiLFxuICAgICAgZGVzY3JpcHRpb246IHQ/LmRlc2NyaXB0aW9uID8/IFwiXCIsXG4gICAgICBwcmlvcml0eTogdD8ucHJpb3JpdHkgPz8gMSxcbiAgICAgIGR1ZURhdGU6IHQ/LmR1ZT8uZGF0ZSA/IHQuZHVlLmRhdGUuc3Vic3RyaW5nKDAsIDEwKSA6IHByZWZpbGxEYXRlLFxuICAgICAgcHJvamVjdElkOiB0Py5wcm9qZWN0X2lkID8/IFwiXCIsXG4gICAgICBsYWJlbHM6ICh0Py5sYWJlbHMgPz8gW10pLnNsaWNlKCksXG4gICAgfTtcbiAgICB0aGlzLmtub3duTGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLm9wdHMubGFiZWxzLCAuLi50aGlzLnYubGFiZWxzXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgbW9kYWxFbC5hZGRDbGFzcyhcIndkLXRhc2stZm9ybVwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodGhpcy5vcHRzLm1vZGUgPT09IFwiY3JlYXRlXCIgPyBcIk5vdmEgdGFyZWZhXCIgOiBcIkVkaXRhciB0YXJlZmFcIik7XG5cbiAgICAvLyBTXHUwMEYzIG5hIGVkaVx1MDBFN1x1MDBFM286IGF0YWxobyBcIkFicmlyIG5vIFRvZG9pc3RcIiBubyB0b3BvLCBhbyBsYWRvIGRvIFggZGUgZmVjaGFyLlxuICAgIGlmICh0aGlzLm9wdHMubW9kZSA9PT0gXCJlZGl0XCIgJiYgdGhpcy5vcHRzLnRhc2spIHtcbiAgICAgIGNvbnN0IG9wZW4gPSBtb2RhbEVsLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXRmLW9wZW4tdG9wXCIsIHRleHQ6IFwiXHUyMTk3IFRvZG9pc3RcIiB9KTtcbiAgICAgIG9wZW4uc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgbm8gVG9kb2lzdFwiKTtcbiAgICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodGhpcy5vcHRzLnRhc2shKSwgXCJfYmxhbmtcIik7XG4gICAgfVxuXG4gICAgdGhpcy5maWVsZChcIlRcdTAwRUR0dWxvXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC10Zi1pbnB1dFwiLCB0eXBlOiBcInRleHRcIiB9KTtcbiAgICBjb250ZW50LnZhbHVlID0gdGhpcy52LmNvbnRlbnQ7XG4gICAgY29udGVudC5wbGFjZWhvbGRlciA9IFwiTyBxdWUgcHJlY2lzYSBzZXIgZmVpdG8/XCI7XG4gICAgY29udGVudC5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuY29udGVudCA9IGNvbnRlbnQudmFsdWU7IH07XG4gICAgc2V0VGltZW91dCgoKSA9PiBjb250ZW50LmZvY3VzKCksIDApO1xuXG4gICAgdGhpcy5maWVsZChcIkRlc2NyaVx1MDBFN1x1MDBFM29cIik7XG4gICAgY29uc3QgZGVzYyA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInRleHRhcmVhXCIsIHsgY2xzOiBcIndkLXRmLXRleHRhcmVhXCIgfSk7XG4gICAgZGVzYy52YWx1ZSA9IHRoaXMudi5kZXNjcmlwdGlvbjtcbiAgICBkZXNjLnBsYWNlaG9sZGVyID0gXCJEZXRhbGhlcyAvIGluc3RydVx1MDBFN1x1MDBGNWVzIChtYXJrZG93bilcIjtcbiAgICBkZXNjLnJvd3MgPSAzO1xuICAgIGRlc2Mub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmRlc2NyaXB0aW9uID0gZGVzYy52YWx1ZTsgfTtcblxuICAgIHRoaXMuZmllbGQoXCJQcmlvcmlkYWRlXCIpO1xuICAgIGNvbnN0IHByb3cgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXByaS1yb3dcIiB9KTtcbiAgICBjb25zdCByZW5kZXJQcmkgPSAoKSA9PiB7XG4gICAgICBwcm93LmVtcHR5KCk7XG4gICAgICBmb3IgKGNvbnN0IGFwaSBvZiBbNCwgMywgMiwgMV0pIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IFRPRE9JU1RfUFJJW2FwaV07XG4gICAgICAgIGNvbnN0IGIgPSBwcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtcHJpXCIgKyAodGhpcy52LnByaW9yaXR5ID09PSBhcGkgPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgICAgIGIuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBtZXRhLmNvbG9yKTtcbiAgICAgICAgYi5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnYucHJpb3JpdHkgPSBhcGk7IHJlbmRlclByaSgpOyB9O1xuICAgICAgfVxuICAgIH07XG4gICAgcmVuZGVyUHJpKCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGF0YVwiKTtcbiAgICBjb25zdCBkcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1kdWUtcm93XCIgfSk7XG4gICAgY29uc3QgZHVlID0gZHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0IHdkLXRmLWRhdGVcIiwgdHlwZTogXCJkYXRlXCIgfSk7XG4gICAgZHVlLnZhbHVlID0gdGhpcy52LmR1ZURhdGU7XG4gICAgZHVlLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IGR1ZS52YWx1ZTsgfTtcbiAgICBjb25zdCBjbHIgPSBkcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXRmLWR1ZS1jbGVhclwiLCB0ZXh0OiBcInNlbSBkYXRhXCIgfSk7XG4gICAgY2xyLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudi5kdWVEYXRlID0gXCJcIjsgZHVlLnZhbHVlID0gXCJcIjsgfTtcbiAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJDbGlxdWUgcGFyYSBhYnJpciBvIGNhbGVuZFx1MDBFMXJpby4gVmF6aW8gPSBzZW0gZGF0YS5cIiB9KTtcbiAgICBpZiAodGhpcy5vcHRzLnRhc2s/LmR1ZT8uaXNfcmVjdXJyaW5nKVxuICAgICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi13YXJuXCIsIHRleHQ6IFwiXHUyN0YzIFRhcmVmYSByZWNvcnJlbnRlIFx1MjAxNCBtdWRhciBhIGRhdGEgZml4YSBwb2RlIGVuY2VycmFyIGEgcmVjb3JyXHUwMEVBbmNpYS5cIiB9KTtcblxuICAgIHRoaXMuZmllbGQoXCJQcm9qZXRvXCIpO1xuICAgIGNvbnN0IHNlbCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInNlbGVjdFwiLCB7IGNsczogXCJ3ZC10Zi1zZWxlY3RcIiB9KTtcbiAgICBjb25zdCBpbmJveCA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IFwiRW50cmFkYSAoSW5ib3gpXCIsIHZhbHVlOiBcIlwiIH0pO1xuICAgIGlmICghdGhpcy52LnByb2plY3RJZCkgaW5ib3guc2VsZWN0ZWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLm9wdHMucHJvamVjdHMpIHtcbiAgICAgIGNvbnN0IG8gPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBwLm5hbWUsIHZhbHVlOiBwLmlkIH0pO1xuICAgICAgaWYgKHAuaWQgPT09IHRoaXMudi5wcm9qZWN0SWQpIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzZWwub25jaGFuZ2UgPSAoKSA9PiB7IHRoaXMudi5wcm9qZWN0SWQgPSBzZWwudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiRXRpcXVldGFzXCIpO1xuICAgIGNvbnN0IGx3cmFwID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbHNcIiB9KTtcbiAgICBpZiAodGhpcy5rbm93bkxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHJlbmRlckxhYmVscyA9ICgpID0+IHtcbiAgICAgICAgbHdyYXAuZW1wdHkoKTtcbiAgICAgICAgZm9yIChjb25zdCBsIG9mIHRoaXMua25vd25MYWJlbHMpIHtcbiAgICAgICAgICBjb25zdCBvbiA9IHRoaXMudi5sYWJlbHMuaW5jbHVkZXMobCk7XG4gICAgICAgICAgY29uc3QgY2hpcCA9IGx3cmFwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2x9YCB9KTtcbiAgICAgICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy52LmxhYmVscy5pbmRleE9mKGwpO1xuICAgICAgICAgICAgaWYgKGkgPj0gMCkgdGhpcy52LmxhYmVscy5zcGxpY2UoaSwgMSk7IGVsc2UgdGhpcy52LmxhYmVscy5wdXNoKGwpO1xuICAgICAgICAgICAgcmVuZGVyTGFiZWxzKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlbmRlckxhYmVscygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIk5lbmh1bWEgZXRpcXVldGEgbm8gVG9kb2lzdCBhaW5kYS5cIiB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGlvbnNFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtYWN0aW9uc1wiIH0pO1xuICAgIHRoaXMucmVuZGVyQWN0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaWVsZChsYWJlbDogc3RyaW5nKSB7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsXCIsIHRleHQ6IGxhYmVsIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBY3Rpb25zKCkge1xuICAgIGNvbnN0IGEgPSB0aGlzLmFjdGlvbnNFbDtcbiAgICBhLmVtcHR5KCk7XG5cbiAgICBpZiAodGhpcy5jb25maXJtRGVsICYmIHRoaXMub3B0cy5yZW1vdmUpIHtcbiAgICAgIGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1jb25maXJtXCIsIHRleHQ6IFwiRXhjbHVpciBlc3RhIHRhcmVmYT9cIiB9KTtcbiAgICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgICAgY29uc3QgeWVzID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICB5ZXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnJlbW92ZSEoKSkgdGhpcy5jbG9zZSgpO1xuICAgICAgICBlbHNlIHsgdGhpcy5jb25maXJtRGVsID0gZmFsc2U7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgbm8gPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgICAgbm8ub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25maXJtRGVsID0gZmFsc2U7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMubW9kZSA9PT0gXCJlZGl0XCIpIHtcbiAgICAgIGNvbnN0IGRlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICBkZWwub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25maXJtRGVsID0gdHJ1ZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgfVxuXG4gICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgY2FuY2VsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICBjYW5jZWwub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBzYXZlID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiU2FsdmFyXCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgc2F2ZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy52LmNvbnRlbnQgPSB0aGlzLnYuY29udGVudC50cmltKCk7XG4gICAgICBpZiAoIXRoaXMudi5jb250ZW50KSB7IG5ldyBOb3RpY2UoXCJEXHUwMEVBIHVtIHRcdTAwRUR0dWxvIFx1MDBFMCB0YXJlZmEuXCIpOyByZXR1cm47IH1cbiAgICAgIHNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5zdWJtaXQodGhpcy52KSkgdGhpcy5jbG9zZSgpO1xuICAgICAgZWxzZSBzYXZlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZSBjb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY2xhc3MgV2VydXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIC8vIFByb2pldG9zIGRvIFRvZG9pc3QgKHBhcmEgb3MgZHJvcGRvd25zIGRvcyBwYWNvdGVzKS4gQnVzY2Fkb3MgMXg7IHF1YW5kb1xuICAvLyBjaGVnYW0sIHJlLXJlbmRlcml6YSBhIGFiYSBwYXJhIHByZWVuY2hlciBvcyBzZWxlY3RzLlxuICBwcml2YXRlIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdIHwgbnVsbCA9IG51bGw7XG4gIC8vIEV0aXF1ZXRhcyBkbyBUb2RvaXN0IChjaGlwcyBwb3IgcGFjb3RlKS4gTWVzbWEgZXN0cmF0XHUwMEU5Z2lhOiBidXNjYSAxeC5cbiAgcHJpdmF0ZSBsYWJlbHM6IFRvZG9pc3RMYWJlbFtdIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihhcHAsIHBsdWdpbik7IH1cblxuICBkaXNwbGF5KCkge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW47XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFeGliaVx1MDBFN1x1MDBFM28gZG8gZGFzaGJvYXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmRcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb2RvIGNvbXBhY3RvXCIpXG4gICAgICAuc2V0RGVzYyhcIkxheW91dCBtYWlzIGRlbnNvLCBjb20gbWVub3MgZXNwYVx1MDBFN2FtZW50byBlbnRyZSBvcyBlbGVtZW50b3MuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmNvbXBhY3QpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFNlXHUwMEU3XHUwMEY1ZXMgZG8gZGFzaGJvYXJkICh2aXNpYmlsaWRhZGUgKyBvcmRlbSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmRcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJBdGl2ZS9kZXNhdGl2ZSBjYWRhIHNlXHUwMEU3XHUwMEUzbyBlIGFqdXN0ZSBhIG9yZGVtIGVtIHF1ZSBhcGFyZWNlbSBuYSBkYXNoYm9hcmQuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvcmRlciA9IHBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXI7XG4gICAgb3JkZXIuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShTRUNUSU9OX0xBQkVMW2lkXSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwiYXJyb3ctdXBcIikuc2V0VG9vbHRpcChcIk1vdmVyIHBhcmEgY2ltYVwiKS5zZXREaXNhYmxlZChpID09PSAwKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVTZWN0aW9uKGlkLCAtMSk7IHRoaXMuZGlzcGxheSgpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwiYXJyb3ctZG93blwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBiYWl4b1wiKS5zZXREaXNhYmxlZChpID09PSBvcmRlci5sZW5ndGggLSAxKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVTZWN0aW9uKGlkLCArMSk7IHRoaXMuZGlzcGxheSgpOyB9KSlcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIlZpc1x1MDBFRHZlbFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSghcGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhcInNlYzpcIiArIGlkKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oXCJzZWM6XCIgKyBpZCwgIXYpOyB9KSk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUGFzdGFzIGV4aWJpZGFzIChjYXJkcyBkbyBDb2ZyZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiUGFzdGFzIGV4aWJpZGFzIChjYXJkcyBkbyBDb2ZyZSlcIiB9KTtcbiAgICBjb25zdCB0b3BGb2xkZXJzID0gKHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKS5jaGlsZHJlblxuICAgICAgLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGlmICghdG9wRm9sZGVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7IGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIGRlIHRvcG8gbm8gY29mcmUuXCIgfSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiB0b3BGb2xkZXJzKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoZi5uYW1lKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGYucGF0aCkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBhd2FpdCBwbHVnaW4uc2V0SGlkZGVuKGYucGF0aCwgIXYpOyB9KSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEZvbnRlcyBkYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkZvbnRlcyBkb3MgUmVsYXRcdTAwRjNyaW9zXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiUGFzdGFzIGN1amFzIG5vdGFzIHZpcmFtIGNhcmRzIG5vcyBkaWFzIGRhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MgKHBvc2lcdTAwRTdcdTAwRTNvIHBlbGEgZGF0YSBkYSBub3RhKS4gQ2FkYSBmb250ZSB0ZW0gdW1hIGNvciBwclx1MDBGM3ByaWEuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzcmNzID0gcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICBzcmNzLmZvckVhY2gocyA9PiB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUocy5wYXRoKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiQXRpdmFcIilcbiAgICAgICAgICAuc2V0VmFsdWUocy5vbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHMub24gPSB2OyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSkpXG4gICAgICAgIC5hZGRDb2xvclBpY2tlcihjID0+IGNcbiAgICAgICAgICAuc2V0VmFsdWUocy5jb2xvcilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHMuY29sb3IgPSB2OyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSkpXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcInRyYXNoLTJcIikuc2V0VG9vbHRpcChcIlJlbW92ZXIgZm9udGVcIilcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gc3Jjcy5maWx0ZXIoeCA9PiB4ICE9PSBzKTtcbiAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVzZWQgPSBuZXcgU2V0KHNyY3MubWFwKHMgPT4gcy5wYXRoKSk7XG4gICAgY29uc3QgYXZhaWxhYmxlID0gYWxsRm9sZGVyUGF0aHModGhpcy5hcHApLmZpbHRlcihwID0+ICF1c2VkLmhhcyhwKSk7XG4gICAgaWYgKGF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkFkaWNpb25hciBmb250ZVwiKVxuICAgICAgICAuc2V0RGVzYyhcIkVzY29saGEgdW1hIHBhc3RhIGRvIGNvZnJlIHBhcmEgYWxpbWVudGFyIGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcy5cIilcbiAgICAgICAgLmFkZERyb3Bkb3duKGQgPT4ge1xuICAgICAgICAgIGQuYWRkT3B0aW9uKFwiXCIsIFwiRXNjb2xoYSB1bWEgcGFzdGFcdTIwMjZcIik7XG4gICAgICAgICAgZm9yIChjb25zdCBwIG9mIGF2YWlsYWJsZSkgZC5hZGRPcHRpb24ocCwgcCk7XG4gICAgICAgICAgZC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIGlmICghdikgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBBQ0NFTlRTW3BsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMubGVuZ3RoICUgQUNDRU5UUy5sZW5ndGhdO1xuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5wdXNoKHsgcGF0aDogdiwgY29sb3IsIG9uOiB0cnVlIH0pO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYWNvdGVzIGRlIHRhcmVmYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiUGFjb3RlcyBkZSB0YXJlZmFzXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiQ29uanVudG9zIGRlIHRhcmVmYXMgcXVlIHZvY1x1MDBFQSBsYW5cdTAwRTdhIG5vIFRvZG9pc3QgY29tIHVtIGNsaXF1ZSAobmEgYWJhIFRvZG9pc3Qgb3Ugbm8gZGFzaGJvYXJkKSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS4gVW1hIHRhcmVmYSBwb3IgbGluaGEuIFVzZSBAZXRpcXVldGEgbnVtYSBsaW5oYSBwYXJhIGFwbGljYXIgdW1hIGV0aXF1ZXRhIHNcdTAwRjMgXHUwMEUwcXVlbGEgdGFyZWZhLlwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm1hciBhbnRlcyBkZSBsYW5cdTAwRTdhclwiKVxuICAgICAgLnNldERlc2MoXCJQZWRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzbyAoY29tIGEgbGlzdGEgZGUgdGFyZWZhcykgYW50ZXMgZGUgY3JpYXIuIFxcXCJTZW1wcmVcXFwiIGNvbmZpcm1hIGF0XHUwMEU5IHBhcmEgMSB0YXJlZmEgXHUyMDE0IFx1MDBGQXRpbCBwYXJhIHRlc3RhcjsgZGVwb2lzIG11ZGUgcGFyYSBOdW5jYS5cIilcbiAgICAgIC5hZGREcm9wZG93bihkID0+IGRcbiAgICAgICAgLmFkZE9wdGlvbihcImFsd2F5c1wiLCBcIlNlbXByZVwiKVxuICAgICAgICAuYWRkT3B0aW9uKFwibWFueVwiLCBcIlNcdTAwRjMgbXVpdGFzICg+IDUgdGFyZWZhcylcIilcbiAgICAgICAgLmFkZE9wdGlvbihcIm5ldmVyXCIsIFwiTnVuY2FcIilcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSlcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBwbHVnaW4uc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gPSB2IGFzIERhc2hTZXR0aW5nc1tcInBhY2thZ2VDb25maXJtXCJdOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH0pKTtcblxuICAgIGNvbnN0IHRva2VuID0gcGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgLy8gQnVzY2EgcHJvamV0b3MgZSBldGlxdWV0YXMgdW1hIHZleiAoZHJvcGRvd25zICsgY2hpcHMpOyBhbyBjaGVnYXIsIHJlLXJlbmRlcml6YS5cbiAgICBpZiAodG9rZW4gJiYgdGhpcy5wcm9qZWN0cyA9PT0gbnVsbCkge1xuICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLnRoZW4ocHMgPT4geyB0aGlzLnByb2plY3RzID0gcHM7IHRoaXMuZGlzcGxheSgpOyB9KS5jYXRjaCgoKSA9PiB7IHRoaXMucHJvamVjdHMgPSBbXTsgfSk7XG4gICAgfVxuICAgIGlmICh0b2tlbiAmJiB0aGlzLmxhYmVscyA9PT0gbnVsbCkge1xuICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS50aGVuKGxzID0+IHsgdGhpcy5sYWJlbHMgPSBsczsgdGhpcy5kaXNwbGF5KCk7IH0pLmNhdGNoKCgpID0+IHsgdGhpcy5sYWJlbHMgPSBbXTsgfSk7XG4gICAgfVxuXG4gICAgLy8gUG9wb3ZlciBkZSBldGlxdWV0YXMgZGUgdW0gcGFjb3RlIChjaGlwcyB0b2dnbGUgY29tIGEgY29yIGRvIFRvZG9pc3QpLlxuICAgIGNvbnN0IG9wZW5MYWJlbHNQb3BvdmVyID0gKGFuY2hvcjogSFRNTEVsZW1lbnQsIHBrZzogVGFza1BhY2thZ2UsIHJlZnJlc2g6ICgpID0+IHZvaWQpID0+XG4gICAgICBvcGVuUG9wb3ZlcihhbmNob3IsIGJvZHkgPT4ge1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3AtdGl0bGVcIiwgdGV4dDogXCJFdGlxdWV0YXMgZG8gcGFjb3RlXCIgfSk7XG4gICAgICAgIGlmICghdG9rZW4pIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3QuXCIgfSk7IHJldHVybjsgfVxuICAgICAgICBpZiAodGhpcy5sYWJlbHMgPT09IG51bGwpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG9cdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGlmICghdGhpcy5sYWJlbHMubGVuZ3RoKSB7IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QuXCIgfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBjaGlwcyA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC1jaGlwc1wiIH0pO1xuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY2hpcHMuZW1wdHkoKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5sYWJlbHMhKSB7XG4gICAgICAgICAgICBjb25zdCBvbiA9IChwa2cubGFiZWxzID8/IFtdKS5pbmNsdWRlcyhsLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY2hpcCA9IGNoaXBzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDSztcbiAgICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsLm5hbWV9YCB9KTtcbiAgICAgICAgICAgIGNoaXAub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY3VyID0gcGtnLmxhYmVscyA/PyBbXTtcbiAgICAgICAgICAgICAgY29uc3QgaSA9IGN1ci5pbmRleE9mKGwubmFtZSk7XG4gICAgICAgICAgICAgIGlmIChpID49IDApIGN1ci5zcGxpY2UoaSwgMSk7IGVsc2UgY3VyLnB1c2gobC5uYW1lKTtcbiAgICAgICAgICAgICAgcGtnLmxhYmVscyA9IGN1ci5sZW5ndGggPyBjdXIgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSwgeyBjbHM6IFwid2QtcG9wLWxhYmVsc1wiIH0pO1xuXG4gICAgLy8gUG9wb3ZlciBkZSB0YXJlZmFzIGRlIHVtIHBhY290ZSAodGV4dGFyZWE7IHBlcnNpc3RlIG5vIGlucHV0IGUgYW8gZmVjaGFyKS5cbiAgICBjb25zdCBvcGVuVGFza3NQb3BvdmVyID0gKGFuY2hvcjogSFRNTEVsZW1lbnQsIHBrZzogVGFza1BhY2thZ2UsIHJlZnJlc2g6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgIGxldCB0YTogSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICAgIG9wZW5Qb3BvdmVyKGFuY2hvciwgYm9keSA9PiB7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC10aXRsZVwiLCB0ZXh0OiBcIlRhcmVmYXMgZG8gcGFjb3RlXCIgfSk7XG4gICAgICAgIHRhID0gYm9keS5jcmVhdGVFbChcInRleHRhcmVhXCIsIHsgY2xzOiBcIndkLXBrZy10YXNrc1wiIH0pO1xuICAgICAgICB0YS52YWx1ZSA9IHBrZy50YXNrcy5qb2luKFwiXFxuXCIpO1xuICAgICAgICB0YS5wbGFjZWhvbGRlciA9IFwiVW1hIHRhcmVmYSBwb3IgbGluaGEgKGV4LjogQmViZXIgXHUwMEUxZ3VhKVwiO1xuICAgICAgICB0YS5yb3dzID0gNjtcbiAgICAgICAgdGEuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBwa2cudGFza3MgPSB0YS52YWx1ZS5zcGxpdChcIlxcblwiKS5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiVW1hIHBvciBsaW5oYSBcdTAwQjcgQGV0aXF1ZXRhIG1hcmNhIHNcdTAwRjMgYXF1ZWxhIHRhcmVmYSBcdTAwQjcgZmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjLlwiIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRhLmZvY3VzKCksIDApO1xuICAgICAgfSwgeyBjbHM6IFwid2QtcG9wLXRhc2tzXCIsIHdpZHRoOiAzMjAsIG9uQ2xvc2U6ICgpID0+IHsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9IH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBwa2dzID0gcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBjb25zdCBsaXN0ID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1saXN0XCIgfSk7XG4gICAgcGtncy5mb3JFYWNoKChwa2csIGlkeCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLXJvd1wiIH0pO1xuXG4gICAgICAvLyBcdTAwQ0Rjb25lIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyIGRlIHBhbGV0YSkuXG4gICAgICBjb25zdCBpY29uQnRuID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb250cmlnZ2VyXCIgfSk7XG4gICAgICBpY29uQnRuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlx1MDBDRGNvbmUgZG8gcGFjb3RlXCIpO1xuICAgICAgY29uc3QgZmlsbEljb24gPSAoKSA9PiB7XG4gICAgICAgIGljb25CdG4uZW1wdHkoKTtcbiAgICAgICAgaWYgKHBrZy5pY29uKSByZW5kZXJJY29uKGljb25CdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvXCIgfSksIHBrZy5pY29uKTtcbiAgICAgICAgZWxzZSBpY29uQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljby1lbXB0eVwiLCB0ZXh0OiBcIitcIiB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsSWNvbigpO1xuICAgICAgaWNvbkJ0bi5vbmNsaWNrID0gKCkgPT4gb3Blbkljb25Qb3BvdmVyKGljb25CdG4sIHBrZy5pY29uLCBhc3luYyBpYyA9PiB7XG4gICAgICAgIHBrZy5pY29uID0gaWM7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyBmaWxsSWNvbigpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIE5vbWUuXG4gICAgICBjb25zdCBuYW1lID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtcGtnLW5hbWUtaW5wdXRcIiwgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiTm9tZSBkbyBwYWNvdGVcIiB9IH0pO1xuICAgICAgbmFtZS52YWx1ZSA9IHBrZy5uYW1lO1xuICAgICAgbmFtZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgYXN5bmMgKCkgPT4geyBwa2cubmFtZSA9IG5hbWUudmFsdWU7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfSk7XG4gICAgICBuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpKTtcblxuICAgICAgLy8gUHJvamV0by5cbiAgICAgIGNvbnN0IHByb2ogPSByb3cuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtcGtnLXByb2ogZHJvcGRvd25cIiB9KTtcbiAgICAgIGNvbnN0IGFkZE9wdCA9ICh2OiBzdHJpbmcsIHQ6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBvID0gcHJvai5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IHQsIHZhbHVlOiB2IH0pO1xuICAgICAgICBpZiAoKHBrZy5wcm9qZWN0SWQgPz8gXCJcIikgPT09IHYpIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfTtcbiAgICAgIGFkZE9wdChcIlwiLCBcIkVudHJhZGFcIik7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgKHRoaXMucHJvamVjdHMgPz8gW10pKSBhZGRPcHQocC5pZCwgcC5uYW1lKTtcbiAgICAgIHByb2oub25jaGFuZ2UgPSBhc3luYyAoKSA9PiB7IHBrZy5wcm9qZWN0SWQgPSBwcm9qLnZhbHVlIHx8IHVuZGVmaW5lZDsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9O1xuXG4gICAgICAvLyBFdGlxdWV0YXMgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIpLlxuICAgICAgY29uc3QgbGJsQnRuID0gcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXBrZy1jaGlwLWJ0blwiIH0pO1xuICAgICAgY29uc3QgZmlsbExibCA9ICgpID0+IHtcbiAgICAgICAgbGJsQnRuLmVtcHR5KCk7XG4gICAgICAgIHNldEljb24obGJsQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWJ0bi1pY29cIiB9KSwgXCJ0YWdcIik7XG4gICAgICAgIGxibEJ0bi5jcmVhdGVTcGFuKHsgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgICAgY29uc3QgbiA9IHBrZy5sYWJlbHM/Lmxlbmd0aCA/PyAwO1xuICAgICAgICBpZiAobikgbGJsQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IFN0cmluZyhuKSB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsTGJsKCk7XG4gICAgICBsYmxCdG4ub25jbGljayA9ICgpID0+IG9wZW5MYWJlbHNQb3BvdmVyKGxibEJ0biwgcGtnLCBmaWxsTGJsKTtcblxuICAgICAgLy8gVGFyZWZhcyAoYm90XHUwMEUzbyBcdTIxOTIgcG9wb3ZlcikuXG4gICAgICBjb25zdCB0YXNrQnRuID0gcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXBrZy1jaGlwLWJ0blwiIH0pO1xuICAgICAgY29uc3QgZmlsbFRhc2sgPSAoKSA9PiB7XG4gICAgICAgIHRhc2tCdG4uZW1wdHkoKTtcbiAgICAgICAgc2V0SWNvbih0YXNrQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWJ0bi1pY29cIiB9KSwgXCJsaXN0XCIpO1xuICAgICAgICB0YXNrQnRuLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIlRhcmVmYXNcIiB9KTtcbiAgICAgICAgY29uc3QgbiA9IHBrZy50YXNrcy5maWx0ZXIocyA9PiBzLnRyaW0oKSkubGVuZ3RoO1xuICAgICAgICBpZiAobikgdGFza0J0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1jb3VudFwiLCB0ZXh0OiBTdHJpbmcobikgfSk7XG4gICAgICB9O1xuICAgICAgZmlsbFRhc2soKTtcbiAgICAgIHRhc2tCdG4ub25jbGljayA9ICgpID0+IG9wZW5UYXNrc1BvcG92ZXIodGFza0J0biwgcGtnLCBmaWxsVGFzayk7XG5cbiAgICAgIC8vIFJlb3JkZW5hciAvIHJlbW92ZXIuXG4gICAgICBjb25zdCB1cCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1taW5pXCIgKyAoaWR4ID09PSAwID8gXCIgd2QtZGlzYWJsZWRcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbih1cCwgXCJjaGV2cm9uLXVwXCIpOyB1cC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBwYXJhIGNpbWFcIik7XG4gICAgICBpZiAoaWR4ID4gMCkgdXAub25jbGljayA9IGFzeW5jICgpID0+IHsgYXdhaXQgcGx1Z2luLm1vdmVQYWNrYWdlKGlkeCwgLTEpOyB0aGlzLmRpc3BsYXkoKTsgfTtcbiAgICAgIGNvbnN0IGRvd24gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaVwiICsgKGlkeCA9PT0gcGtncy5sZW5ndGggLSAxID8gXCIgd2QtZGlzYWJsZWRcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihkb3duLCBcImNoZXZyb24tZG93blwiKTsgZG93bi5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBwYXJhIGJhaXhvXCIpO1xuICAgICAgaWYgKGlkeCA8IHBrZ3MubGVuZ3RoIC0gMSkgZG93bi5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVBhY2thZ2UoaWR4LCArMSk7IHRoaXMuZGlzcGxheSgpOyB9O1xuICAgICAgY29uc3QgZGVsID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmkgd2QtcGtnLWRlbFwiIH0pO1xuICAgICAgc2V0SWNvbihkZWwsIFwidHJhc2gtMlwiKTsgZGVsLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlJlbW92ZXIgcGFjb3RlXCIpO1xuICAgICAgZGVsLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMgPSBwa2dzLmZpbHRlcih4ID0+IHggIT09IHBrZyk7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQWRpY2lvbmFyIHBhY290ZVwiKVxuICAgICAgLmFkZEJ1dHRvbihiID0+IGJcbiAgICAgICAgLnNldEJ1dHRvblRleHQoXCIrIE5vdm8gcGFjb3RlXCIpXG4gICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzLnB1c2goeyBpZDogdWlkKCksIG5hbWU6IFwiTm92byBwYWNvdGVcIiwgdGFza3M6IFtdIH0pO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiSW50ZWdyYVx1MDBFN1x1MDBFM28gVG9kb2lzdFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRva2VuIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJUb2RvaXN0IFx1MjE5MiBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgSW50ZWdyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBUb2tlbiBkZSBBUEkgZG8gZGVzZW52b2x2ZWRvci4gU2Fsdm8gbG9jYWxtZW50ZSBlbSBkYXRhLmpzb24gKG5cdTAwRTNvIHZhaSBwYXJhIG8gR2l0KS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBvIHRva2VuIGFxdWlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbiA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkV4aWJpXHUwMEU3XHUwMEUzbyBkYXMgdGFyZWZhc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgbyBwcm9qZXRvIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgbyBub21lIGRvIHByb2pldG8gYW8gbGFkbyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGFzIGV0aXF1ZXRhcyBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIGFzIEBldGlxdWV0YXMgZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiU2luY3Jvbml6YVx1MDBFN1x1MDBFM28gKFN5bmN0aGluZylcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJFc3RhcyBjcmVkZW5jaWFpcyBzXHUwMEUzbyBndWFyZGFkYXMgcG9yIGRpc3Bvc2l0aXZvIChsb2NhbFN0b3JhZ2UpIFx1MjAxNCBjYWRhIG1cdTAwRTFxdWluYSB0ZW0gYSBzdWEgZSBlbGFzIG5cdTAwRTNvIHNpbmNyb25pemFtIHBlbG8gU3luY3RoaW5nIG5lbSB2XHUwMEUzbyBwYXJhIG8gR2l0LlwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlVSTCBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiRW5kZXJlXHUwMEU3byBkbyBTeW5jdGhpbmcuIFBhZHJcdTAwRTNvOiBodHRwOi8vMTI3LjAuMC4xOjgzODQgKGEgaW5zdFx1MDBFMm5jaWEgbG9jYWwpLiBObyBjZWx1bGFyLCBhcG9udGUgcGFyYSBhIEFQSSBkZSBvdXRyYSBtXHUwMEUxcXVpbmEgbmEgcmVkZSBzZSBhIGxvY2FsIG5cdTAwRTNvIHJlc3BvbmRlci5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSB2LnRyaW0oKSB8fCBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFQSSBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiU3luY3RoaW5nIFx1MjE5MiBBY3Rpb25zIFx1MjE5MiBTZXR0aW5ncyBcdTIxOTIgQVBJIEtleS4gR3VhcmRhZGEgcG9yIGRpc3Bvc2l0aXZvIChsb2NhbFN0b3JhZ2UpLCBuXHUwMEUzbyB2YWkgcGFyYSBvIGRhdGEuanNvbi9HaXQuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImNvbGUgYSBBUEkga2V5XCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiSUQgZGEgcGFzdGEgKG9wY2lvbmFsKVwiKVxuICAgICAgLnNldERlc2MoXCJGb2xkZXIgSUQgZG8gY29mcmUgbm8gU3luY3RoaW5nLiBWYXppbyA9IHVzYSBhIHByaW1laXJhIHBhc3RhIGF1dG9tYXRpY2FtZW50ZS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiZXguOiBudW5xdi1tdGltblwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgY29udGFnZW0gZGUgaXRlbnMgcG9yIGFwYXJlbGhvXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIFxcXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcXFwiIGRlIGl0ZW5zIGVtIGNhZGEgYXBhcmVsaG8sIGFsXHUwMEU5bSBkYSBwb3JjZW50YWdlbS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgfSkpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBMks7QUFFM0ssSUFBTSxZQUFZO0FBQ2xCLElBQU0sb0JBQW9CO0FBSzFCLElBQU0sWUFBWTtBQUNsQixJQUFNLFlBQVk7QUFDbEIsSUFBTSxlQUFlO0FBR3JCLFNBQVMsTUFBYztBQUNyQixTQUFPLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBQ3hFO0FBZ0RBLElBQU0sbUJBQWlDO0FBQUEsRUFDckMsY0FBYyxDQUFDLFNBQVMsV0FBVyxRQUFRLFFBQVEsV0FBVyxVQUFVLFVBQVU7QUFBQSxFQUNsRixTQUFTO0FBQUEsRUFDVCxRQUFRLENBQUM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLGlCQUFpQjtBQUFBLElBQ2YsRUFBRSxNQUFNLG1DQUFnQyxPQUFPLFdBQVcsSUFBSSxLQUFLO0FBQUEsSUFDbkUsRUFBRSxNQUFNLGdCQUFnQyxPQUFPLFdBQVcsSUFBSSxLQUFLO0FBQUEsRUFDckU7QUFBQSxFQUNBLGNBQWM7QUFBQSxFQUNkLGlCQUFpQjtBQUFBLEVBQ2pCLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFO0FBQUEsRUFDM0Msb0JBQW9CO0FBQUEsRUFDcEIsbUJBQW1CO0FBQUEsRUFDbkIsY0FBYztBQUFBLEVBQ2QsaUJBQWlCO0FBQUEsRUFDakIsbUJBQW1CO0FBQUEsRUFDbkIscUJBQXFCO0FBQUEsRUFDckIsY0FBYyxDQUFDO0FBQUEsRUFDZixnQkFBZ0I7QUFDbEI7QUFXQSxJQUFNLE9BQXNCO0FB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UUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsWUFBWSxFQUNwQixRQUFRLDJLQUE0SixFQUNwSyxRQUFRLE9BQUs7QUFDWixRQUFFLGVBQWUsdUJBQXVCLEVBQ3JDLFNBQVMsS0FBSyxPQUFPLFNBQVMsWUFBWSxFQUMxQyxTQUFTLE9BQU0sTUFBSztBQUNuQixhQUFLLE9BQU8sU0FBUyxlQUFlLEVBQUUsS0FBSyxLQUFLO0FBQ2hELGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFlBQVk7QUFBQSxNQUMxQixDQUFDO0FBQ0gsUUFBRSxRQUFRLE1BQU0sUUFBUTtBQUFBLElBQzFCLENBQUM7QUFFSCxRQUFJLHdCQUFRLFdBQVcsRUFDcEIsUUFBUSxTQUFTLEVBQ2pCLFFBQVEsb0lBQWtILEVBQzFILFFBQVEsT0FBSztBQUNaLFFBQUUsZUFBZSxnQkFBZ0IsRUFDOUIsU0FBUyxLQUFLLE9BQU8sU0FBUyxlQUFlLEVBQzdDLFNBQVMsT0FBTSxNQUFLO0FBQ25CLGFBQUssT0FBTyxTQUFTLGtCQUFrQixFQUFFLEtBQUs7QUFDOUMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzFCLENBQUM7QUFDSCxRQUFFLFFBQVEsT0FBTztBQUNqQixRQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDMUIsQ0FBQztBQUVILFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLHdCQUF3QixFQUNoQyxRQUFRLGdGQUFnRixFQUN4RixRQUFRLE9BQUs7QUFDWixRQUFFLGVBQWUsa0JBQWtCLEVBQ2hDLFNBQVMsS0FBSyxPQUFPLFNBQVMsaUJBQWlCLEVBQy9DLFNBQVMsT0FBTSxNQUFLO0FBQ25CLGFBQUssT0FBTyxTQUFTLG9CQUFvQixFQUFFLEtBQUs7QUFDaEQsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzFCLENBQUM7QUFDSCxRQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDMUIsQ0FBQztBQUVILFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLHdDQUF3QyxFQUNoRCxRQUFRLGtGQUFpRixFQUN6RixVQUFVLE9BQUssRUFDYixTQUFTLEtBQUssT0FBTyxTQUFTLG1CQUFtQixFQUNqRCxTQUFTLE9BQU0sTUFBSztBQUNuQixXQUFLLE9BQU8sU0FBUyxzQkFBc0I7QUFDM0MsWUFBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixXQUFLLE9BQU8sWUFBWTtBQUFBLElBQzFCLENBQUMsQ0FBQztBQUFBLEVBQ1I7QUFDRjsiLAogICJuYW1lcyI6IFsib2siLCAicmFuZ2UiLCAiX2EiLCAiX2IiLCAiX2MiXQp9Cg==
