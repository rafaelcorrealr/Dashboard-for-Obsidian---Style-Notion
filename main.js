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
  taskPackages: []
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
  constructor(app, plugin, component, rerender) {
    this.app = app;
    this.plugin = plugin;
    this.component = component;
    this.rerender = rerender;
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
  }
  reset() {
    this.tasks = [];
    this.projects = [];
    this.projectMap = /* @__PURE__ */ new Map();
    this.labelColors = /* @__PURE__ */ new Map();
    this.fetchedAt = 0;
    this.error = null;
    this.loading = false;
    this.rerender();
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
    this.rerender();
    try {
      await deleteTodoistTask(token, t.id);
      new import_obsidian.Notice(`\u{1F5D1} Exclu\xEDda: ${t.content}`);
      return true;
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao excluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerender();
      return false;
    }
  }
  async completeTask(t) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    const idx = this.tasks.findIndex((x) => x.id === t.id);
    if (idx >= 0) this.tasks.splice(idx, 1);
    this.rerender();
    try {
      await closeTodoistTask(token, t.id);
      new import_obsidian.Notice(`\u2713 Conclu\xEDda: ${t.content}`);
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao concluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerender();
    }
  }
  async fetch(manual) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token || this.loading) return;
    this.loading = true;
    this.error = null;
    if (manual) this.rerender();
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
      this.rerender();
    }
  }
  // Lança um pacote: cria cada tarefa no Todoist com data de hoje. Sequencial
  // (evita rajada na API). Atualiza a lista ao final.
  async launchPackage(pkg) {
    var _a;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) {
      new import_obsidian.Notice("Configure o token do Todoist nas Configura\xE7\xF5es.");
      return;
    }
    const lines = pkg.tasks.map((s) => s.trim()).filter(Boolean);
    if (!lines.length) {
      new import_obsidian.Notice("Pacote sem tarefas.");
      return;
    }
    const due = toKey(/* @__PURE__ */ new Date());
    let ok = 0;
    for (const content of lines) {
      try {
        const fields = { content, due_date: due };
        if (pkg.projectId) fields.project_id = pkg.projectId;
        if ((_a = pkg.labels) == null ? void 0 : _a.length) fields.labels = pkg.labels;
        await createTodoistTask(token, fields);
        ok++;
      } catch (e) {
        new import_obsidian.Notice(`Falha em "${content}": ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    new import_obsidian.Notice(`\u2713 ${ok}/${lines.length} tarefa(s) lan\xE7ada(s) \u2014 ${pkg.name || "pacote"}`);
    await this.fetch(true);
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
          this.rerender();
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
          this.rerender();
        };
      }
    }
    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clr.onclick = async () => {
        f.projects = [];
        f.labels = [];
        await this.plugin.saveSettings();
        this.rerender();
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
          this.rerender();
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
        this.rerender();
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
        this.rerender();
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
    // Estado do Syncthing (v0.10.0)
    this.syncData = null;
    this.syncLoading = false;
    this.syncError = null;
    this.syncFetchedAt = 0;
    this.conflictConfirm = null;
    this.todo = new TodoistController(this.app, this.plugin, this, () => this.render());
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
    for (const ev of ["modify", "create", "delete", "rename"])
      this.registerEvent(this.app.vault.on(ev, () => this.schedule()));
  }
  async onClose() {
    this.hideTip();
    this.todo.hideTip();
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
    this.todo.hideTip();
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root");
    root.toggleClass("wd-compact", this.plugin.settings.compact);
    this.renderHeader(root);
    for (const id of this.plugin.settings.sectionOrder) {
      if (id === "calendar") this.renderCalendar(root);
      else if (id === "para") this.renderPara(root);
      else if (id === "heatmap") this.renderHeatmap(root);
      else if (id === "growth") this.renderGrowth(root);
      else if (id === "stats") this.renderStats(root);
      else if (id === "todoist") this.renderTodoist(root);
      else if (id === "sync") this.renderSync(root);
    }
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
    this.todo.renderList(sec, ctrls, { showLater: false });
  }
  // ── Sincronização (Syncthing + conflitos) — v0.10.0 ───────────────────────
  resetSync() {
    this.syncData = null;
    this.syncFetchedAt = 0;
    this.syncError = null;
    this.syncLoading = false;
    this.render();
  }
  async fetchSync(manual) {
    var _a, _b, _c;
    const base = this.plugin.settings.syncthingUrl.trim();
    const key = this.plugin.settings.syncthingApiKey.trim();
    if (!base || !key || this.syncLoading) return;
    this.syncLoading = true;
    this.syncError = null;
    if (manual) this.render();
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
      this.render();
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
          this.render();
        };
        const no = row.createSpan({ cls: "wd-sync-cno", text: "cancelar" });
        no.onclick = () => {
          this.conflictConfirm = null;
          this.render();
        };
      } else {
        const del = row.createSpan({ cls: "wd-sync-cdel" });
        (0, import_obsidian.setIcon)(del, "trash-2");
        del.setAttr("title", "Apagar c\xF3pia de conflito (vai para a lixeira)");
        del.onclick = () => {
          this.conflictConfirm = f.path;
          this.render();
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
  // Re-busca o Todoist em todas as views abertas (ex.: após mudar o token).
  refreshDashboards() {
    for (const v of this.todoViews()) v.todo.reset();
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
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
    if (typeof this.settings.syncthingUrl !== "string" || !this.settings.syncthingUrl.trim())
      this.settings.syncthingUrl = "http://127.0.0.1:8384";
    if (typeof this.settings.syncthingApiKey !== "string") this.settings.syncthingApiKey = "";
    if (typeof this.settings.syncthingFolderId !== "string") this.settings.syncthingFolderId = "";
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
  }
  async saveSettings() {
    await this.saveData(this.settings);
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
    this.todo = new TodoistController(this.app, this.plugin, this, () => this.refresh());
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
  }
  async onClose() {
    this.todo.hideTip();
  }
  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-todoist-view");
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Todoist" });
    this.renderPackages(root);
    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.todo.renderList(sec, ctrls);
  }
  // Barra de lançadores: um botão por pacote → cria as tarefas no Todoist (hoje).
  renderPackages(root) {
    const pkgs = this.plugin.settings.taskPackages;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "PACOTES" });
    if (!pkgs.length) {
      sec.createDiv({ cls: "wd-empty", text: "Crie pacotes em Configura\xE7\xF5es \u2192 Werus Dashboard \u2192 Pacotes de tarefas." });
      return;
    }
    const token = this.plugin.settings.todoistToken.trim();
    const bar = sec.createDiv({ cls: "wd-pkg-bar" });
    for (const pkg of pkgs) {
      const valid = pkg.tasks.filter((s) => s.trim()).length;
      const disabled = !token || !valid;
      const btn = bar.createDiv({ cls: "wd-pkg-btn" + (disabled ? " wd-pkg-disabled" : "") });
      if (pkg.icon) renderIcon(btn.createSpan({ cls: "wd-pkg-ico" }), pkg.icon);
      btn.createSpan({ cls: "wd-pkg-name", text: pkg.name || "(sem nome)" });
      btn.createSpan({ cls: "wd-pkg-count", text: String(valid) });
      btn.setAttr("title", !token ? "Configure o token do Todoist" : !valid ? "Pacote sem tarefas" : `Lan\xE7ar ${valid} tarefa(s) no Todoist (hoje)`);
      if (!disabled) btn.onclick = () => void this.todo.launchPackage(pkg);
    }
  }
};
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
      text: "Conjuntos de tarefas que voc\xEA lan\xE7a no Todoist com um clique (na aba Todoist), todas com data de hoje. Uma tarefa por linha."
    });
    const token = plugin.settings.todoistToken.trim();
    if (token && this.projects === null) {
      fetchTodoistProjects(token).then((ps) => {
        this.projects = ps;
        this.display();
      }).catch(() => {
        this.projects = [];
      });
    }
    for (const pkg of plugin.settings.taskPackages) {
      const s = new import_obsidian.Setting(containerEl).setClass("wd-pkg-setting");
      s.addText((t) => t.setPlaceholder("Nome do pacote").setValue(pkg.name).onChange(async (v) => {
        pkg.name = v;
        await plugin.saveSettings();
        plugin.rerenderDashboards();
      }));
      s.addText((t) => {
        var _a;
        t.setPlaceholder("\xEDcone (lucide/emoji)").setValue((_a = pkg.icon) != null ? _a : "").onChange(async (v) => {
          pkg.icon = v.trim() || void 0;
          await plugin.saveSettings();
          plugin.rerenderDashboards();
        });
        t.inputEl.style.width = "9em";
      });
      s.addDropdown((d) => {
        var _a, _b;
        d.addOption("", "Entrada (Inbox)");
        for (const p of (_a = this.projects) != null ? _a : []) d.addOption(p.id, p.name);
        d.setValue((_b = pkg.projectId) != null ? _b : "");
        d.onChange(async (v) => {
          pkg.projectId = v || void 0;
          await plugin.saveSettings();
        });
      });
      s.addExtraButton((b) => b.setIcon("trash-2").setTooltip("Remover pacote").onClick(async () => {
        plugin.settings.taskPackages = plugin.settings.taskPackages.filter((x) => x !== pkg);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        this.display();
      }));
      const ta = containerEl.createEl("textarea", { cls: "wd-pkg-tasks" });
      ta.value = pkg.tasks.join("\n");
      ta.placeholder = "Uma tarefa por linha (ex.: Beber \xE1gua)";
      ta.rows = 4;
      ta.addEventListener("change", async () => {
        pkg.tasks = ta.value.split("\n").map((s2) => s2.trim()).filter(Boolean);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
      });
    }
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
    new import_obsidian.Setting(containerEl).setName("URL da API").setDesc("Endere\xE7o do Syncthing. Padr\xE3o: http://127.0.0.1:8384 (a inst\xE2ncia local). No celular, aponte para a API de outra m\xE1quina na rede se a local n\xE3o responder.").addText((t) => {
      t.setPlaceholder("http://127.0.0.1:8384").setValue(this.plugin.settings.syncthingUrl).onChange(async (v) => {
        this.plugin.settings.syncthingUrl = v.trim() || "http://127.0.0.1:8384";
        await this.plugin.saveSettings();
        this.plugin.refreshSync();
      });
      t.inputEl.style.width = "100%";
    });
    new import_obsidian.Setting(containerEl).setName("API key").setDesc("Syncthing \u2192 Actions \u2192 Settings \u2192 API Key. Salva localmente em data.json (n\xE3o vai para o Git).").addText((t) => {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gdWlkIGN1cnRvIGUgZXN0XHUwMEUxdmVsIChwYWNvdGVzIGRlIHRhcmVmYXMpLlxuZnVuY3Rpb24gdWlkKCk6IHN0cmluZyB7XG4gIHJldHVybiBEYXRlLm5vdygpLnRvU3RyaW5nKDM2KSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDcpO1xufVxuXG50eXBlIFN0YXR1cyA9IFwicHJvZ3Jlc3NcIiB8IFwicGF1c2VkXCIgfCBcImNhbmNlbGxlZFwiO1xudHlwZSBTZWN0aW9uSWQgPSBcImNhbGVuZGFyXCIgfCBcInBhcmFcIiB8IFwiaGVhdG1hcFwiIHwgXCJncm93dGhcIiB8IFwic3RhdHNcIiB8IFwidG9kb2lzdFwiIHwgXCJzeW5jXCI7XG5cbmludGVyZmFjZSBUb2RvaXN0RmlsdGVycyB7XG4gIHByb2plY3RzOiBzdHJpbmdbXTsgICAvLyBpZHMgZGUgcHJvamV0byBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kb3MpXG4gIGxhYmVsczogc3RyaW5nW107ICAgICAvLyBub21lcyBkZSBldGlxdWV0YSBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kYXMpXG59XG5cbi8vIEZvbnRlIGRlIGNhcmRzIGRhIFNlbWFuYTogdW1hIHBhc3RhIGRvIGNvZnJlICsgY29yICsgc2UgZXN0XHUwMEUxIHZpc1x1MDBFRHZlbC5cbi8vIEFzIG5vdGFzIGRlbnRybyBkZWxhIGFwYXJlY2VtIG5vcyBkaWFzIGRvIGNhbGVuZFx1MDBFMXJpbyAocG9zaVx1MDBFN1x1MDBFM28gcGVsbyBgZGF0ZTpgKS5cbmludGVyZmFjZSBDYWxTb3VyY2Uge1xuICBwYXRoOiBzdHJpbmc7ICAgIC8vIGNhbWluaG8gZGEgcGFzdGEgKGV4LjogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIilcbiAgY29sb3I6IHN0cmluZzsgICAvLyBjb3IgZG8gaW5kaWNhZG9yIGRhIGZvbnRlXG4gIG9uOiBib29sZWFuOyAgICAgLy8gbWFyY2FkYSA9IGFwYXJlY2UgbmEgc2VtYW5hXG59XG5cbi8vIFBhY290ZSBkZSB0YXJlZmFzOiB1bSBjb25qdW50byBub21lYWRvIGRlIHRhcmVmYXMgcXVlIHNlIGxhblx1MDBFN2Egbm8gVG9kb2lzdFxuLy8gbnVtIGNsaXF1ZSAobmEgYWJhIFRvZG9pc3QpLCB0b2RhcyBjb20gZGF0YSBkZSBob2plLlxuaW50ZXJmYWNlIFRhc2tQYWNrYWdlIHtcbiAgaWQ6IHN0cmluZzsgICAgICAgICAgICAvLyB1aWQgZXN0XHUwMEUxdmVsXG4gIG5hbWU6IHN0cmluZzsgICAgICAgICAgLy8gXCJNYW5oXHUwMEUzXCJcbiAgaWNvbj86IHN0cmluZzsgICAgICAgICAvLyBsdWNpZGUvZW1vamkgb3BjaW9uYWxcbiAgdGFza3M6IHN0cmluZ1tdOyAgICAgICAvLyBjb250ZVx1MDBGQWRvcyBkYXMgdGFyZWZhcyAoMSBwb3IgbGluaGEpXG4gIHByb2plY3RJZD86IHN0cmluZzsgICAgLy8gcHJvamV0byBwYWRyXHUwMEUzbyAodmF6aW8gPSBFbnRyYWRhL0luYm94KVxuICBsYWJlbHM/OiBzdHJpbmdbXTsgICAgIC8vIGV0aXF1ZXRhcyBwYWRyXHUwMEUzbyAob3BjaW9uYWwpXG59XG5cbmludGVyZmFjZSBEYXNoU2V0dGluZ3Mge1xuICBzZWN0aW9uT3JkZXI6IFNlY3Rpb25JZFtdO1xuICBjb21wYWN0OiBib29sZWFuO1xuICBoaWRkZW46IHN0cmluZ1tdOyAgIC8vIGNhbWluaG9zIGRlIHBhc3RhIG9jdWx0b3MgKyBcInNlYzpjYWxlbmRhclwiIC8gXCJzZWM6aGVhdG1hcFwiXG4gIG5vdGVWaWV3OiBcImxpc3RcIiB8IFwiZ3JpZFwiO1xuICBjYWxlbmRhclNvdXJjZXM6IENhbFNvdXJjZVtdOyAgIC8vIGZvbnRlcyAocGFzdGFzKSBxdWUgYWxpbWVudGFtIG9zIGNhcmRzIGRhIFNlbWFuYVxuICB0b2RvaXN0VG9rZW46IHN0cmluZztcbiAgdG9kb2lzdERheVJhbmdlOiAzIHwgNzsgICAgICAgIC8vIHF1YW50b3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiBtb3N0cmFyIG5hIGdyYWRlXG4gIHRvZG9pc3RGaWx0ZXJzOiBUb2RvaXN0RmlsdGVycztcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiBib29sZWFuOyAgIC8vIG1vc3RyYXIgbyBub21lIGRvIHByb2pldG8gbmFzIGxpbmhhc1xuICB0b2RvaXN0U2hvd0xhYmVsczogYm9vbGVhbjsgICAgLy8gbW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1xuICBzeW5jdGhpbmdVcmw6IHN0cmluZzsgICAgICAgICAgLy8gYmFzZSBkYSBBUEkgUkVTVCBkbyBTeW5jdGhpbmdcbiAgc3luY3RoaW5nQXBpS2V5OiBzdHJpbmc7ICAgICAgIC8vIFgtQVBJLUtleSAoZm9yYSBkbyBHaXQpXG4gIHN5bmN0aGluZ0ZvbGRlcklkOiBzdHJpbmc7ICAgICAvLyBpZCBkYSBwYXN0YTsgdmF6aW8gPSBhdXRvZGV0ZWN0YVxuICBzeW5jdGhpbmdTaG93Q291bnRzOiBib29sZWFuOyAgLy8gbW9zdHJhciBcInNpbmNyb25pemFkb3MgLyB0b3RhbFwiIGRlIGl0ZW5zIHBvciBhcGFyZWxob1xuICB0YXNrUGFja2FnZXM6IFRhc2tQYWNrYWdlW107ICAgLy8gcGFjb3RlcyBkZSB0YXJlZmFzIChsYW5cdTAwRTdhciBubyBUb2RvaXN0KVxufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEYXNoU2V0dGluZ3MgPSB7XG4gIHNlY3Rpb25PcmRlcjogW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIGNhbGVuZGFyU291cmNlczogW1xuICAgIHsgcGF0aDogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgY29sb3I6IFwiIzNCODJGNlwiLCBvbjogdHJ1ZSB9LFxuICAgIHsgcGF0aDogXCI1MC5EaVx1MDBFMXJpb1wiLCAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzEwQjk4MVwiLCBvbjogdHJ1ZSB9LFxuICBdLFxuICB0b2RvaXN0VG9rZW46IFwiXCIsXG4gIHRvZG9pc3REYXlSYW5nZTogNyxcbiAgdG9kb2lzdEZpbHRlcnM6IHsgcHJvamVjdHM6IFtdLCBsYWJlbHM6IFtdIH0sXG4gIHRvZG9pc3RTaG93UHJvamVjdDogdHJ1ZSxcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGZhbHNlLFxuICBzeW5jdGhpbmdVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIsXG4gIHN5bmN0aGluZ0FwaUtleTogXCJcIixcbiAgc3luY3RoaW5nRm9sZGVySWQ6IFwiXCIsXG4gIHN5bmN0aGluZ1Nob3dDb3VudHM6IGZhbHNlLFxuICB0YXNrUGFja2FnZXM6IFtdLFxufTtcblxuaW50ZXJmYWNlIFBhcmFTZWN0aW9uIHtcbiAgZm9sZGVyOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgYWNjZW50OiBzdHJpbmc7XG59XG5cbi8vIFBhc3RhcyBcImNvbmhlY2lkYXNcIiBkbyBQQVJBOiBtYW50XHUwMEVBbSBcdTAwRURjb25lLCByXHUwMEYzdHVsbyBlIGNvciBmaXhvcy4gQXMgZGVtYWlzIHBhc3Rhc1xuLy8gZG8gY29mcmUgc1x1MDBFM28gcmVuZGVyaXphZGFzIGNvbSBjb3IgYXV0b21cdTAwRTF0aWNhIGUgXHUwMEVEY29uZSBwYWRyXHUwMEUzbyAob3UgbyBpY29uOiBkbyBzdGF0dXMubWQpLlxuY29uc3QgUEFSQTogUGFyYVNlY3Rpb25bXSA9IFtcbiAgeyBmb2xkZXI6IFwiMDAuSW5ib3hcIiwgICAgIGljb246IFwiXHVEODNEXHVEQ0U1XCIsIGxhYmVsOiBcIkluYm94XCIsICAgIGFjY2VudDogXCIjNjM2NkYxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMTAuUHJvamVjdHNcIiwgIGljb246IFwiXHVEODNEXHVERTgwXCIsIGxhYmVsOiBcIlByb2pldG9zXCIsIGFjY2VudDogXCIjMTBCOTgxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMjAuQXJlYXNcIiwgICAgIGljb246IFwiXHVEODNDXHVERkFGXCIsIGxhYmVsOiBcIlx1MDBDMXJlYXNcIiwgICAgYWNjZW50OiBcIiNGNTlFMEJcIiB9LFxuICB7IGZvbGRlcjogXCIzMC5SZXNvdXJjZXNcIiwgaWNvbjogXCJcdUQ4M0RcdURDREFcIiwgbGFiZWw6IFwiUmVjdXJzb3NcIiwgYWNjZW50OiBcIiMzQjgyRjZcIiB9LFxuICB7IGZvbGRlcjogXCI0MC5BcmNoaXZlXCIsICAgaWNvbjogXCJcdUQ4M0RcdUREQzRcdUZFMEZcIiwgIGxhYmVsOiBcIkFycXVpdm9cIiwgIGFjY2VudDogXCIjNkI3MjgwXCIgfSxcbl07XG5jb25zdCBQQVJBX01BUCA9IG5ldyBNYXAoUEFSQS5tYXAocCA9PiBbcC5mb2xkZXIsIHBdKSk7XG5cbi8vIFBhbGV0YSBwYXJhIGNvbG9yaXIgcGFzdGFzIGRlc2NvbmhlY2lkYXMgZGUgZm9ybWEgZXN0XHUwMEUxdmVsIChwb3IgaGFzaCBkbyBub21lKS5cbmNvbnN0IEFDQ0VOVFMgPSBbXCIjNjM2NkYxXCIsXCIjMTBCOTgxXCIsXCIjRjU5RTBCXCIsXCIjM0I4MkY2XCIsXCIjRUM0ODk5XCIsXCIjOEI1Q0Y2XCIsXCIjMTRCOEE2XCIsXCIjRUY0NDQ0XCJdO1xuXG5jb25zdCBEQVlfU0hPUlQgPSBbXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTXHUwMEUxYlwiLCBcIkRvbVwiXTtcbmNvbnN0IE1PTlRIX1NIT1JUID0gW1wiSmFuXCIsXCJGZXZcIixcIk1hclwiLFwiQWJyXCIsXCJNYWlcIixcIkp1blwiLFwiSnVsXCIsXCJBZ29cIixcIlNldFwiLFwiT3V0XCIsXCJOb3ZcIixcIkRlelwiXTtcbmNvbnN0IElNR19FWFQgPSBbXCJwbmdcIixcImpwZ1wiLFwianBlZ1wiLFwid2VicFwiLFwiZ2lmXCIsXCJzdmdcIl07XG5cbi8vIFBhc3RhIHJhaXogZGFzIG5vdGFzIGRpXHUwMEUxcmlhcyAoY3JpYWRhcyBhbyBjbGljYXIgbnVtIGRpYSBkbyBjYWxlbmRcdTAwRTFyaW8pLlxuY29uc3QgREFJTFlfRk9MREVSID0gXCI1MC5EaVx1MDBFMXJpb1wiO1xuLy8gVGVtcGxhdGUgb3BjaW9uYWw7IHBsYWNlaG9sZGVycyB7e2RhdGV9fSAoWVlZWS1NTS1ERCkgZSB7e3RpdGxlfX0gKGRhdGEgcG9yIGV4dGVuc28pLlxuY29uc3QgREFJTFlfVEVNUExBVEUgPSBcIk1vZGVsb3MvTm90YSBEaVx1MDBFMXJpYS5tZFwiO1xuXG5jb25zdCBTVEFUVVNfSUNPTjogUmVjb3JkPFN0YXR1cywgc3RyaW5nPiA9IHtcbiAgcHJvZ3Jlc3M6IFwiXHUyNUI2XCIsIHBhdXNlZDogXCJcdTIzRjhcIiwgY2FuY2VsbGVkOiBcIlx1MjcxNVwiLFxufTtcblxuY29uc3QgU0VDX0NBTCA9IFwic2VjOmNhbGVuZGFyXCI7XG5jb25zdCBTRUNfUEFSQSA9IFwic2VjOnBhcmFcIjtcbmNvbnN0IFNFQ19IRUFUID0gXCJzZWM6aGVhdG1hcFwiO1xuY29uc3QgU0VDX0dST1cgPSBcInNlYzpncm93dGhcIjtcbmNvbnN0IFNFQ19TVEFUID0gXCJzZWM6c3RhdHNcIjtcbmNvbnN0IFNFQ19UT0RPID0gXCJzZWM6dG9kb2lzdFwiO1xuY29uc3QgU0VDX1NZTkMgPSBcInNlYzpzeW5jXCI7XG5cbi8vIFJcdTAwRjN0dWxvcyBhbWlnXHUwMEUxdmVpcyBkYXMgc2VcdTAwRTdcdTAwRjVlcyAodXNhZG9zIG5hIGFiYSBkZSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcykuXG5jb25zdCBTRUNUSU9OX0xBQkVMOiBSZWNvcmQ8U2VjdGlvbklkLCBzdHJpbmc+ID0ge1xuICBzdGF0czogICAgXCJFc3RhdFx1MDBFRHN0aWNhc1wiLFxuICB0b2RvaXN0OiAgXCJUYXJlZmFzXCIsXG4gIHBhcmE6ICAgICBcIkNvZnJlIChwYXN0YXMpXCIsXG4gIHN5bmM6ICAgICBcIlNpbmNyb25pemFcdTAwRTdcdTAwRTNvXCIsXG4gIGhlYXRtYXA6ICBcIkF0aXZpZGFkZSBkbyBjb2ZyZVwiLFxuICBncm93dGg6ICAgXCJDcmVzY2ltZW50byBkbyBjb2ZyZVwiLFxuICBjYWxlbmRhcjogXCJSZWxhdFx1MDBGM3Jpb3NcIixcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVG9kb2lzdFRhc2sge1xuICBpZDogc3RyaW5nO1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSTogMS4uNCwgb25kZSA0ID0gdXJnZW50ZSAoPSBwMSBuYSBVSSlcbiAgZHVlPzogeyBkYXRlOiBzdHJpbmc7IGRhdGV0aW1lPzogc3RyaW5nOyBzdHJpbmc/OiBzdHJpbmc7IGlzX3JlY3VycmluZz86IGJvb2xlYW4gfSB8IG51bGw7XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG4gIGlzX2NvbXBsZXRlZD86IGJvb2xlYW47XG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICB1cmw/OiBzdHJpbmc7XG59XG5cbi8vIFByaW9yaWRhZGUgZGEgQVBJICg0PXVyZ2VudGUpIFx1MjE5MiByXHUwMEYzdHVsby9jb3IgZGEgVUkgKHAxPXZlcm1lbGhvIFx1MjAyNiBwND1jaW56YSkuXG5jb25zdCBUT0RPSVNUX1BSSTogUmVjb3JkPG51bWJlciwgeyBsYWJlbDogc3RyaW5nOyBjb2xvcjogc3RyaW5nIH0+ID0ge1xuICA0OiB7IGxhYmVsOiBcInAxXCIsIGNvbG9yOiBcIiNFRjQ0NDRcIiB9LFxuICAzOiB7IGxhYmVsOiBcInAyXCIsIGNvbG9yOiBcIiNGNTlFMEJcIiB9LFxuICAyOiB7IGxhYmVsOiBcInAzXCIsIGNvbG9yOiBcIiMzQjgyRjZcIiB9LFxuICAxOiB7IGxhYmVsOiBcInA0XCIsIGNvbG9yOiBcIiM2QjcyODBcIiB9LFxufTtcbmZ1bmN0aW9uIHByaU1ldGEocDogbnVtYmVyKSB7IHJldHVybiBUT0RPSVNUX1BSSVtwXSA/PyBUT0RPSVNUX1BSSVsxXTsgfVxuXG4vLyBQYWxldGEgbm9tZWFkYSBkbyBUb2RvaXN0IFx1MjE5MiBoZXggKHBhcmEgY29sb3JpciBhcyBldGlxdWV0YXMgY29tbyBubyBhcHApLlxuY29uc3QgVE9ET0lTVF9DT0xPUlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGJlcnJ5X3JlZDogXCIjQjgyNTVGXCIsIHJlZDogXCIjREI0MDM1XCIsIG9yYW5nZTogXCIjRkY5OTMzXCIsIHllbGxvdzogXCIjRkFEMDAwXCIsXG4gIG9saXZlX2dyZWVuOiBcIiNBRkI4M0JcIiwgbGltZV9ncmVlbjogXCIjN0VDQzQ5XCIsIGdyZWVuOiBcIiMyOTk0MzhcIiwgbWludF9ncmVlbjogXCIjNkFDQ0JDXCIsXG4gIHRlYWw6IFwiIzE1OEZBRFwiLCBza3lfYmx1ZTogXCIjMTRBQUY1XCIsIGxpZ2h0X2JsdWU6IFwiIzk2QzNFQlwiLCBibHVlOiBcIiM0MDczRkZcIixcbiAgZ3JhcGU6IFwiIzg4NERGRlwiLCB2aW9sZXQ6IFwiI0FGMzhFQlwiLCBsYXZlbmRlcjogXCIjRUI5NkVCXCIsIG1hZ2VudGE6IFwiI0UwNTE5NFwiLFxuICBzYWxtb246IFwiI0ZGOEQ4NVwiLCBjaGFyY29hbDogXCIjODA4MDgwXCIsIGdyZXk6IFwiI0I4QjhCOFwiLCB0YXVwZTogXCIjQ0NBQzkzXCIsXG59O1xuY29uc3QgTEFCRUxfRkFMTEJBQ0sgPSBcIiNCOEI4QjhcIjtcblxuLy8gQnVzY2EgYXMgdGFyZWZhcyBhdGl2YXMgKG5cdTAwRTNvIGNvbmNsdVx1MDBFRGRhcykgdmlhIEFQSSB1bmlmaWNhZGEgdjEgKGEgUkVTVCB2MiBmb2lcbi8vIGFwb3NlbnRhZGEgXHUyMTkyIHJlc3BvbmRpYSA0MTApLiBBIHYxIFx1MDBFOSBwYWdpbmFkYTogeyByZXN1bHRzLCBuZXh0X2N1cnNvciB9LlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0VGFza3ModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFRhc2tbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0VGFza1tdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICAvLyB2MSBlbnZlbG9wYSBlbSByZXN1bHRzOyB0b2xlcmEgcmVzcG9zdGEgY29tbyBhcnJheSBwdXJvIHBvciBzZWd1cmFuXHUwMEU3YS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0VGFza1tdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RQcm9qZWN0IHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vLyBCdXNjYSBvcyBwcm9qZXRvcyAocGFyYSBvIGZpbHRybykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYSBkYXMgdGFyZWZhcy5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RQcm9qZWN0W10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9wcm9qZWN0c1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0UHJvamVjdFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0UHJvamVjdFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RMYWJlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZzsgICAvLyBub21lIGRhIHBhbGV0YSAoZXguOiBcImNoYXJjb2FsXCIpXG59XG5cbi8vIEJ1c2NhIGFzIGV0aXF1ZXRhcyBwZXNzb2FpcyAocGFyYSBjb2xvcmlyIG9zIGNoaXBzKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RMYWJlbFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdExhYmVsW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL2xhYmVsc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0TGFiZWxbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdExhYmVsW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IpO1xuICByZXR1cm4gYWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3luY3RoaW5nIChBUEkgUkVTVCkgXHUyMDE0IHYwLjEwLjAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBTVEZvbGRlciB7IGlkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgcGF1c2VkOiBib29sZWFuIH1cbmludGVyZmFjZSBTVERldmljZSB7IGRldmljZUlEOiBzdHJpbmc7IG5hbWU6IHN0cmluZyB9XG5pbnRlcmZhY2UgU1RTdGF0dXMgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGVycm9yczogbnVtYmVyOyBwdWxsRXJyb3JzOiBudW1iZXIgfVxuaW50ZXJmYWNlIFNUQ29tcGxldGlvbiB7IGNvbXBsZXRpb246IG51bWJlcjsgZ2xvYmFsSXRlbXM6IG51bWJlcjsgbmVlZEl0ZW1zOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBuZWVkRGVsZXRlczogbnVtYmVyIH1cblxuaW50ZXJmYWNlIFN5bmNEZXZSb3cgeyBuYW1lOiBzdHJpbmc7IG9ubGluZTogYm9vbGVhbjsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXI7IGxhc3RTZWVuOiBzdHJpbmcgfVxuaW50ZXJmYWNlIFN5bmNEYXRhIHsgc3RhdGU6IHN0cmluZzsgbmVlZEZpbGVzOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBmb2xkZXJMYWJlbDogc3RyaW5nOyBlcnJvcnM6IG51bWJlcjsgZGV2aWNlczogU3luY0RldlJvd1tdIH1cblxuZnVuY3Rpb24gaHVtYW5CeXRlcyhuOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAoIW4pIHJldHVybiBcIjAgQlwiO1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDQ4NTc2KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKG4gPCAxMDI0MCA/IDEgOiAwKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAxMDQ4NTc2KS50b0ZpeGVkKG4gPCAxMDQ4NTc2MCA/IDEgOiAwKX0gTUJgO1xufVxuXG5mdW5jdGlvbiByZWxUaW1lKGlzbzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdCA9IERhdGUucGFyc2UoaXNvKTtcbiAgaWYgKGlzTmFOKHQpIHx8IHQgPCAxKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgY29uc3QgcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSB0KSAvIDEwMDApO1xuICBpZiAocyA8IDYwKSByZXR1cm4gXCJhZ29yYVwiO1xuICBpZiAocyA8IDM2MDApIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDYwKX0gbWluYDtcbiAgaWYgKHMgPCA4NjQwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gMzYwMCl9IGhgO1xuICByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyA4NjQwMCl9IGRgO1xufVxuXG4vLyBHRVQgZ2VuXHUwMEU5cmljbyBuYSBBUEkgZG8gU3luY3RoaW5nIChoZWFkZXIgWC1BUEktS2V5OyByZXF1ZXN0VXJsIGlnbm9yYSBDT1JTKS5cbmFzeW5jIGZ1bmN0aW9uIHN0R2V0PFQ+KGJhc2U6IHN0cmluZywga2V5OiBzdHJpbmcsIHBhdGg6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICBjb25zdCB1cmwgPSBiYXNlLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHsgdXJsLCBtZXRob2Q6IFwiR0VUXCIsIGhlYWRlcnM6IHsgXCJYLUFQSS1LZXlcIjoga2V5IH0sIHRocm93OiBmYWxzZSB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcIkFQSSBrZXkgaW52XHUwMEUxbGlkYSAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUO1xufVxuXG4vLyBVUkwgcGFyYSBhYnJpciBhIHRhcmVmYSBubyBUb2RvaXN0ICh1c2EgYSBkbyBwYXlsb2FkIG91IG1vbnRhIGEgcGFydGlyIGRvIGlkKS5cbmZ1bmN0aW9uIHRhc2tVcmwodDogVG9kb2lzdFRhc2spOiBzdHJpbmcge1xuICByZXR1cm4gdC51cmwgPz8gYGh0dHBzOi8vYXBwLnRvZG9pc3QuY29tL2FwcC90YXNrLyR7dC5pZH1gO1xufVxuXG4vLyBDb25jbHVpIChmZWNoYSkgdW1hIHRhcmVmYSBubyBUb2RvaXN0LiBQT1NUIHNlbSBjb3JwbzsgMjA0ID0gc3VjZXNzby4gRmFzZSA4LjIuXG5hc3luYyBmdW5jdGlvbiBjbG9zZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L2Nsb3NlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDQgJiYgcmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgRXNjcml0YTogY3JpYXIgLyBlZGl0YXIgLyBtb3ZlciAvIGV4Y2x1aXIgKHYwLjguMCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIENhbXBvcyBncmF2XHUwMEUxdmVpcy4gVG9kb3Mgb3BjaW9uYWlzIFx1MjAxNCBubyBlZGl0YXIgbWFuZG8gc1x1MDBGMyBvIHF1ZSBtdWRvdS5cbmludGVyZmFjZSBUb2RvaXN0V3JpdGUge1xuICBjb250ZW50Pzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk/OiBudW1iZXI7ICAgICAvLyAxLi40ICg0ID0gdXJnZW50ZSAvIHAxIG5hIFVJKVxuICBkdWVfZGF0ZT86IHN0cmluZzsgICAgIC8vIGRhdGEgZml4YSBZWVlZLU1NLUREICh2aW5kbyBkbyBjYWxlbmRcdTAwRTFyaW8pXG4gIGR1ZV9zdHJpbmc/OiBzdHJpbmc7ICAgLy8gbGluZ3VhZ2VtIG5hdHVyYWw7IFwibm8gZGF0ZVwiIGxpbXBhIGEgZGF0YVxuICBkdWVfbGFuZz86IHN0cmluZzsgICAgIC8vIFwicHRcIiBcdTIxOTIgaW50ZXJwcmV0YSBlbSBwb3J0dWd1XHUwMEVBc1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbn1cblxuZnVuY3Rpb24ganNvbkhlYWRlcnModG9rZW46IHN0cmluZykge1xuICByZXR1cm4geyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCwgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfTtcbn1cblxuLy8gQ3JpYSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcyBcdTIxOTIgMjAwIGNvbSBhIHRhcmVmYSBjcmlhZGEuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8VG9kb2lzdFRhc2s+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVG9kb2lzdFRhc2s7XG59XG5cbi8vIEVkaXRhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwMC4gTlx1MDBFM28gdHJvY2EgZGUgcHJvamV0byAodXNlIG1vdmVUb2RvaXN0VGFzaykuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBNb3ZlIGEgdGFyZWZhIHBhcmEgb3V0cm8gcHJvamV0by4gUE9TVCAvdGFza3Mve2lkfS9tb3ZlIFx1MjE5MiAyMDAuXG5hc3luYyBmdW5jdGlvbiBtb3ZlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgcHJvamVjdF9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9tb3ZlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHByb2plY3RfaWQgfSksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRXhjbHVpIGEgdGFyZWZhLiBERUxFVEUgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwNC5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIERhdGEgZGUgdmVuY2ltZW50byAoWVlZWS1NTS1ERCkgZGUgdW1hIHRhcmVmYSwgb3UgbnVsbCBzZSBzZW0gZHVlLlxuZnVuY3Rpb24gZHVlS2V5KHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGQgPSB0LmR1ZT8uZGF0ZSA/PyB0LmR1ZT8uZGF0ZXRpbWU7XG4gIHJldHVybiBkID8gZC5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuLy8gQSB0YXJlZmEgdGVtIGRlc2NyaVx1MDBFN1x1MDBFM28gKGluc3RydVx1MDBFN1x1MDBGNWVzKT9cbmZ1bmN0aW9uIGhhc0Rlc2ModDogVG9kb2lzdFRhc2spOiBib29sZWFuIHtcbiAgcmV0dXJuICEhdC5kZXNjcmlwdGlvbiAmJiB0LmRlc2NyaXB0aW9uLnRyaW0oKS5sZW5ndGggPiAwO1xufVxuY29uc3QgREVTQ19NQVggPSA3MDA7ICAgLy8gY29ydGUgZGEgZGVzY3JpXHUwMEU3XHUwMEUzbyBubyB0b29sdGlwIChvIHJlc3RvIGZpY2Egbm8gVG9kb2lzdClcblxuLy8gRnVuXHUwMEU3XHUwMEUzbyBnbG9iYWwgZXhwb3N0YSBwZWxvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiAocXVhbmRvIGhhYmlsaXRhZG8pLlxudHlwZSBIZWF0bWFwRW50cnkgPSB7IGRhdGU6IHN0cmluZzsgaW50ZW5zaXR5PzogbnVtYmVyOyBjb2xvcj86IHN0cmluZzsgY29udGVudD86IHN0cmluZyB9O1xudHlwZSBIZWF0bWFwRGF0YSA9IHtcbiAgeWVhcjogbnVtYmVyO1xuICBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgZW50cmllczogSGVhdG1hcEVudHJ5W107XG4gIHNob3dDdXJyZW50RGF5Qm9yZGVyPzogYm9vbGVhbjtcbn07XG5mdW5jdGlvbiBnZXRIZWF0bWFwUmVuZGVyZXIoKTogKChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IEhlYXRtYXBEYXRhKSA9PiB2b2lkKSB8IG51bGwge1xuICBjb25zdCBmbiA9ICh3aW5kb3cgYXMgdW5rbm93biBhcyB7IHJlbmRlckhlYXRtYXBDYWxlbmRhcj86IHVua25vd24gfSkucmVuZGVySGVhdG1hcENhbGVuZGFyO1xuICByZXR1cm4gdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIgPyAoZm4gYXMgKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIDogbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgZGF0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gaXNvV2Vla051bWJlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSkpO1xuICBjb25zdCBkb3cgPSBkLmdldFVUQ0RheSgpIHx8IDc7XG4gIGQuc2V0VVRDRGF0ZShkLmdldFVUQ0RhdGUoKSArIDQgLSBkb3cpO1xuICBjb25zdCB5MCA9IG5ldyBEYXRlKERhdGUuVVRDKGQuZ2V0VVRDRnVsbFllYXIoKSwgMCwgMSkpO1xuICByZXR1cm4gTWF0aC5jZWlsKCgoZC5nZXRUaW1lKCkgLSB5MC5nZXRUaW1lKCkpIC8gODZfNDAwXzAwMCArIDEpIC8gNyk7XG59XG5cbmZ1bmN0aW9uIG1vbmRheU9mKG9mZnNldDogbnVtYmVyKTogRGF0ZSB7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGRvdyA9IG5vdy5nZXREYXkoKSB8fCA3O1xuICBjb25zdCBkID0gbmV3IERhdGUobm93KTtcbiAgZC5zZXREYXRlKG5vdy5nZXREYXRlKCkgLSBkb3cgKyAxICsgb2Zmc2V0ICogNyk7XG4gIGQuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiB0b0tleShkOiBEYXRlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2QuZ2V0RnVsbFllYXIoKX0tJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfS0ke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0ZSh2YWw6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbC5zdWJzdHJpbmcoMCwgMTApO1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHZhbC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsKTtcbiAgcmV0dXJuIHMubWF0Y2goL15cXGR7NH0tXFxkezJ9LVxcZHsyfS8pID8gcy5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9kYXlCUigpOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gIH0pO1xufVxuXG4vLyBUb2RvcyBvcyBjYW1pbmhvcyBkZSBwYXN0YSBkbyBjb2ZyZSAocmVjdXJzaXZvKSwgaWdub3JhbmRvIG9jdWx0YXMgKC5vYnNpZGlhbiBldGMuKSxcbi8vIGVtIG9yZGVtIGFsZmFiXHUwMEU5dGljYSBcdTIwMTQgdXNhZG8gbm8gc2VsZXRvciBkZSBmb250ZXMgZGEgU2VtYW5hLlxuZnVuY3Rpb24gYWxsRm9sZGVyUGF0aHMoYXBwOiBBcHApOiBzdHJpbmdbXSB7XG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlciAmJiAhYy5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSB7IG91dC5wdXNoKGMucGF0aCk7IHdhbGsoYyk7IH1cbiAgICB9XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiBvdXQuc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbn1cblxuLy8gZGQvbW0gYSBwYXJ0aXIgZGUgdW0gdGltZXN0YW1wIChtdGltZSlcbmZ1bmN0aW9uIGZtdFNob3J0KHRzOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBkID0gbmV3IERhdGUodHMpO1xuICByZXR1cm4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfWA7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVdGlsaWRhZGVzIGRlIHBhc3RhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDb250YSBub3RhcyByZXZpc2FkYXMgKHJldmlld2VkOiB0cnVlKSB2cyB0b3RhbCBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiByZXZpZXdlZFN0YXRzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IHJldmlld2VkOiBudW1iZXI7IHRvdGFsOiBudW1iZXIgfSB7XG4gIGxldCByZXZpZXdlZCA9IDAsIHRvdGFsID0gMDtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIHtcbiAgICAgICAgdG90YWwrKztcbiAgICAgICAgaWYgKGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGMucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgcmV2aWV3ZWQrKztcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIHJldHVybiB7IHJldmlld2VkLCB0b3RhbCB9O1xufVxuXG4vLyBDb250YSBtZCAoZXhjZXRvIHN0YXR1cy5tZCkgZSBpbWFnZW5zIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIGZvbGRlclN0YXRzKGZvbGRlcjogVEZvbGRlcik6IHsgbWQ6IG51bWJlcjsgaW1nOiBudW1iZXIgfSB7XG4gIGxldCBtZCA9IDAsIGltZyA9IDA7XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgIGlmIChjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikgbWQrKztcbiAgICAgICAgZWxzZSBpZiAoSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpIGltZysrO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgcmV0dXJuIHsgbWQsIGltZyB9O1xufVxuXG4vLyBUZXh0byBkZSBjb250YWdlbSBwYWRyb25pemFkbyBwYXJhIG9zIGNhcmRzIChub3RhcyArIGltYWdlbnMsIHF1YW5kbyBob3V2ZXIpLlxuZnVuY3Rpb24gY291bnRUZXh0KHN0YXRzOiB7IG1kOiBudW1iZXI7IGltZzogbnVtYmVyIH0pOiBzdHJpbmcge1xuICBpZiAoc3RhdHMubWQgPT09IDAgJiYgc3RhdHMuaW1nID4gMCkgcmV0dXJuIGAke3N0YXRzLmltZ30gaW1nYDtcbiAgcmV0dXJuIHN0YXRzLmltZyA+IDAgPyBgJHtzdGF0cy5tZH0gbm90YXMgXHUwMEI3ICR7c3RhdHMuaW1nfSBpbWdgIDogYCR7c3RhdHMubWR9IG5vdGFzYDtcbn1cblxuLy8gQXMgTiBub3RhcyAubWQgbW9kaWZpY2FkYXMgbWFpcyByZWNlbnRlbWVudGUgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gcmVjZW50Tm90ZXMoZm9sZGVyOiBURm9sZGVyLCBuOiBudW1iZXIpOiBURmlsZVtdIHtcbiAgY29uc3QgZmlsZXM6IFRGaWxlW10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIGZpbGVzLnB1c2goYyk7XG4gICAgICBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgZmlsZXMuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgcmV0dXJuIGZpbGVzLnNsaWNlKDAsIG4pO1xufVxuXG4vLyBQYXN0YSBcImRlIGFzc2V0c1wiOiBzXHUwMEYzIHRlbSBpbWFnZW5zLCBuZW5odW1hIG5vdGEgXHUyMTkyIGVzY29uZGlkYSBubyBuYXZlZ2Fkb3IgaW50ZXJuby5cbmZ1bmN0aW9uIGlzQXNzZXRGb2xkZXIoZm9sZGVyOiBURm9sZGVyKTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgbWQsIGltZyB9ID0gZm9sZGVyU3RhdHMoZm9sZGVyKTtcbiAgcmV0dXJuIGltZyA+IDAgJiYgbWQgPT09IDA7XG59XG5cbmZ1bmN0aW9uIHN1YkZvbGRlcnMoZm9sZGVyOiBURm9sZGVyKTogVEZvbGRlcltdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAuZmlsdGVyKGYgPT4gIWlzQXNzZXRGb2xkZXIoZikpXG4gICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG50eXBlIFVyZ2VuY3lJbmZvID0geyBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyBtYXg6IFVyZ2VuY3kgfCBudWxsIH07XG5cbi8vIE5vdGFzIGNvbSBgdXJnZW5jeWAgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlICsgbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vIChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYykuXG5mdW5jdGlvbiB1cmdlbmN5U3RhdHMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IFVyZ2VuY3lJbmZvIHtcbiAgY29uc3QgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikge1xuICAgICAgICBjb25zdCB1ID0gcmVhZE5vdGVVcmdlbmN5KGFwcCwgYyk7XG4gICAgICAgIGlmICh1KSBpdGVtcy5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICBsZXQgbWF4OiBVcmdlbmN5IHwgbnVsbCA9IG51bGw7XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIGlmICghbWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbbWF4XSkgbWF4ID0gaXQubGV2ZWw7XG4gIGl0ZW1zLnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gIHJldHVybiB7IGl0ZW1zLCBtYXggfTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFZpZXcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFx1MjUwMFx1MjUwMCBDb250cm9sYWRvciBkbyBUb2RvaXN0IChjb21wYXJ0aWxoYWRvOiBkYXNoYm9hcmQgKyBhYmEgZGVkaWNhZGEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRGV0XHUwMEU5bSBvIGVzdGFkbyBkYXMgdGFyZWZhcywgYSBidXNjYSwgYSByZW5kZXJpemFcdTAwRTdcdTAwRTNvIGRhIGxpc3RhIGUgYXMgYVx1MDBFN1x1MDBGNWVzXG4vLyAoY3JpYXIvZWRpdGFyL2NvbmNsdWlyL2V4Y2x1aXIpLiBgcmVyZW5kZXJgIFx1MDBFOSBvIGNhbGxiYWNrIGRhIHZpZXcgZG9uYSAocmUtcmVuZGVyXG4vLyBjb21wbGV0bykuIFRlbSB0b29sdGlwIHByXHUwMEYzcHJpbyBwYXJhIG5cdTAwRTNvIGRlcGVuZGVyIGRhIHZpZXcuXG5jbGFzcyBUb2RvaXN0Q29udHJvbGxlciB7XG4gIHByaXZhdGUgdGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0czogVG9kb2lzdFByb2plY3RbXSA9IFtdO1xuICBwcml2YXRlIHByb2plY3RNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpOyAgIC8vIGlkIFx1MjE5MiBub21lXG4gIHByaXZhdGUgbGFiZWxDb2xvcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpOyAgIC8vIG5vbWUgZGEgZXRpcXVldGEgXHUyMTkyIGhleFxuICBwcml2YXRlIGxvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBlcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZmV0Y2hlZEF0ID0gMDtcbiAgcHJpdmF0ZSBsYXRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBmaWx0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgdGlwOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgcHJpdmF0ZSByZXJlbmRlcjogKCkgPT4gdm9pZCxcbiAgKSB7fVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudGFza3MgPSBbXTtcbiAgICB0aGlzLnByb2plY3RzID0gW107XG4gICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5mZXRjaGVkQXQgPSAwO1xuICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgfVxuXG4gIGhpZGVUaXAoKSB7IGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9IH1cblxuICBwcml2YXRlIGRheVJhbmdlKCk6IDMgfCA3IHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID09PSAzID8gMyA6IDc7XG4gIH1cblxuICBwcml2YXRlIGFwcGx5RmlsdGVycyh0YXNrczogVG9kb2lzdFRhc2tbXSk6IFRvZG9pc3RUYXNrW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBpZiAoIWYucHJvamVjdHMubGVuZ3RoICYmICFmLmxhYmVscy5sZW5ndGgpIHJldHVybiB0YXNrcztcbiAgICBjb25zdCBwcyA9IG5ldyBTZXQoZi5wcm9qZWN0cyksIGxzID0gbmV3IFNldChmLmxhYmVscyk7XG4gICAgcmV0dXJuIHRhc2tzLmZpbHRlcih0ID0+IHtcbiAgICAgIGlmIChwcy5zaXplICYmICEodC5wcm9qZWN0X2lkICYmIHBzLmhhcyh0LnByb2plY3RfaWQpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGxzLnNpemUgJiYgISh0LmxhYmVscyA/PyBbXSkuc29tZShsID0+IGxzLmhhcyhsKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVGaWx0ZXIoa2luZDogXCJwcm9qZWN0c1wiIHwgXCJsYWJlbHNcIiwgaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGFyciA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzW2tpbmRdO1xuICAgIGNvbnN0IGkgPSBhcnIuaW5kZXhPZihpZCk7XG4gICAgaWYgKGkgPj0gMCkgYXJyLnNwbGljZShpLCAxKTsgZWxzZSBhcnIucHVzaChpZCk7XG4gIH1cblxuICBwcml2YXRlIGxhYmVsQ29sb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbENvbG9ycy5nZXQobmFtZSkgPz8gTEFCRUxfRkFMTEJBQ0s7XG4gIH1cblxuICBwcml2YXRlIGxhYmVsQ2hpcChob3N0OiBIVE1MRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjbHM6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBjaGlwID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzIH0pO1xuICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5sYWJlbENvbG9yKG5hbWUpO1xuICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtuYW1lfWAgfSk7XG4gICAgcmV0dXJuIGNoaXA7XG4gIH1cblxuICBwcml2YXRlIHBvc2l0aW9uVGlwKHRpcDogSFRNTEVsZW1lbnQsIHRhcmdldDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR3ID0gdGlwLm9mZnNldFdpZHRoLCB0aCA9IHRpcC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGxlZnQgPSByZWN0LmxlZnQ7XG4gICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgNjtcbiAgICBpZiAobGVmdCArIHR3ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0dyAtIDg7XG4gICAgaWYgKHRvcCArIHRoID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgdG9wID0gcmVjdC50b3AgLSB0aCAtIDY7XG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd1Rhc2tUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXRhc2stdGlwXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC1wcmlcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpTWV0YSh0LnByaW9yaXR5KS5jb2xvcjtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtdGl0bGVcIiwgdGV4dDogdC5jb250ZW50IH0pO1xuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBkID0gdC5kZXNjcmlwdGlvbiEudHJpbSgpO1xuICAgICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1kZXNjXCIsIHRleHQ6IGQubGVuZ3RoID4gREVTQ19NQVggPyBkLnNsaWNlKDAsIERFU0NfTUFYKSArIFwiXHUyMDI2XCIgOiBkIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGFza1RpcChlbDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGFza1RpcChlbCwgdCkpO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9kb0NoZWNrKGhvc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IGNoZWNrID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tY2hlY2tcIiB9KTtcbiAgICBjaGVjay5zZXRBdHRyKFwidGl0bGVcIiwgXCJDb25jbHVpciB0YXJlZmFcIik7XG4gICAgY2hlY2sub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuY29tcGxldGVUYXNrKHQpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAmJiBwcm9qKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1wcm9qXCIsIHRleHQ6IHByb2ogfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB0aGlzLmxhYmVsQ2hpcChyb3csIGwsIFwid2QtdG9kby1yb3ctbGFiZWxcIik7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKHNob3dEYXRlICYmIGRrKSB7XG4gICAgICBjb25zdCBbLCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfWAgfSk7XG4gICAgfVxuICAgIGlmICh0LmR1ZT8uaXNfcmVjdXJyaW5nKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlY3VyXCIsIHRleHQ6IFwiXHUyN0YzXCIgfSk7XG4gICAgcm93Lm9uY2xpY2sgPSAoKSA9PiB0aGlzLm9wZW5UYXNrRGV0YWlsKHQpO1xuICAgIHRoaXMuYXR0YWNoVGFza1RpcChyb3csIHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUYXNrQnRuKGhvc3Q6IEhUTUxFbGVtZW50LCBwcmVmaWxsRHVlPzogc3RyaW5nLCB0aXRsZSA9IFwiTm92YSB0YXJlZmFcIikge1xuICAgIGNvbnN0IGIgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1hZGRcIiB9KTtcbiAgICBzZXRJY29uKGIsIFwicGx1c1wiKTtcbiAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgYi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJjcmVhdGVcIiwgcHJlZmlsbER1ZSB9KTsgfTtcbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIHByaXZhdGUgb3BlblRhc2tGb3JtKG9wdHM6IHsgbW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiOyB0YXNrPzogVG9kb2lzdFRhc2s7IHByZWZpbGxEdWU/OiBzdHJpbmcgfSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi50aGlzLmxhYmVsQ29sb3JzLmtleXMoKSwgLi4udGhpcy50YXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgbmV3IFRhc2tGb3JtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgIG1vZGU6IG9wdHMubW9kZSxcbiAgICAgIHRhc2s6IG9wdHMudGFzayxcbiAgICAgIHByZWZpbGxEdWU6IG9wdHMucHJlZmlsbER1ZSxcbiAgICAgIHByb2plY3RzOiB0aGlzLnByb2plY3RzLFxuICAgICAgbGFiZWxzLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBzdWJtaXQ6IHYgPT4gdGhpcy5zdWJtaXRUYXNrRm9ybShvcHRzLm1vZGUsIG9wdHMudGFzaywgdiksXG4gICAgICByZW1vdmU6IG9wdHMudGFzayA/ICgpID0+IHRoaXMuZGVsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICAgIGNvbXBsZXRlOiBvcHRzLnRhc2sgPyAoKSA9PiB2b2lkIHRoaXMuY29tcGxldGVUYXNrKG9wdHMudGFzayEpIDogdW5kZWZpbmVkLFxuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgb3BlblRhc2tEZXRhaWwodDogVG9kb2lzdFRhc2spIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBuZXcgVGFza0RldGFpbE1vZGFsKHRoaXMuYXBwLCB0aGlzLmNvbXBvbmVudCwge1xuICAgICAgdGFzazogdCxcbiAgICAgIHByb2plY3ROYW1lOiB0LnByb2plY3RfaWQgPyB0aGlzLnByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQsXG4gICAgICBsYWJlbENvbG9yOiBuID0+IHRoaXMubGFiZWxDb2xvcihuKSxcbiAgICAgIGVkaXQ6ICgpID0+IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJlZGl0XCIsIHRhc2s6IHQgfSksXG4gICAgICBjb21wbGV0ZTogKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KSxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHN1Ym1pdFRhc2tGb3JtKG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIiwgdGFzazogVG9kb2lzdFRhc2sgfCB1bmRlZmluZWQsIHY6IFRhc2tGb3JtVmFsdWVzKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgaWYgKG1vZGUgPT09IFwiY3JlYXRlXCIpIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7IGNvbnRlbnQ6IHYuY29udGVudCwgcHJpb3JpdHk6IHYucHJpb3JpdHkgfTtcbiAgICAgICAgaWYgKHYuZGVzY3JpcHRpb24udHJpbSgpKSBmaWVsZHMuZGVzY3JpcHRpb24gPSB2LmRlc2NyaXB0aW9uLnRyaW0oKTtcbiAgICAgICAgaWYgKHYuZHVlRGF0ZSkgZmllbGRzLmR1ZV9kYXRlID0gdi5kdWVEYXRlO1xuICAgICAgICBpZiAodi5wcm9qZWN0SWQpIGZpZWxkcy5wcm9qZWN0X2lkID0gdi5wcm9qZWN0SWQ7XG4gICAgICAgIGlmICh2LmxhYmVscy5sZW5ndGgpIGZpZWxkcy5sYWJlbHMgPSB2LmxhYmVscztcbiAgICAgICAgYXdhaXQgY3JlYXRlVG9kb2lzdFRhc2sodG9rZW4sIGZpZWxkcyk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDcmlhZGE6ICR7di5jb250ZW50fWApO1xuICAgICAgfSBlbHNlIGlmICh0YXNrKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0ge307XG4gICAgICAgIGlmICh2LmNvbnRlbnQgIT09IHRhc2suY29udGVudCkgZmllbGRzLmNvbnRlbnQgPSB2LmNvbnRlbnQ7XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uICE9PSAodGFzay5kZXNjcmlwdGlvbiA/PyBcIlwiKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbjtcbiAgICAgICAgaWYgKHYucHJpb3JpdHkgIT09IHRhc2sucHJpb3JpdHkpIGZpZWxkcy5wcmlvcml0eSA9IHYucHJpb3JpdHk7XG4gICAgICAgIGNvbnN0IG9sZERhdGUgPSB0YXNrLmR1ZT8uZGF0ZSA/IHRhc2suZHVlLmRhdGUuc3Vic3RyaW5nKDAsIDEwKSA6IFwiXCI7XG4gICAgICAgIGlmICh2LmR1ZURhdGUgIT09IG9sZERhdGUpIHtcbiAgICAgICAgICBpZiAodi5kdWVEYXRlKSBmaWVsZHMuZHVlX2RhdGUgPSB2LmR1ZURhdGU7XG4gICAgICAgICAgZWxzZSBmaWVsZHMuZHVlX3N0cmluZyA9IFwibm8gZGF0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9sZEwgPSAodGFzay5sYWJlbHMgPz8gW10pLnNsaWNlKCkuc29ydCgpLmpvaW4oXCIgXCIpO1xuICAgICAgICBjb25zdCBuZXdMID0gdi5sYWJlbHMuc2xpY2UoKS5zb3J0KCkuam9pbihcIiBcIik7XG4gICAgICAgIGlmIChvbGRMICE9PSBuZXdMKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhmaWVsZHMpLmxlbmd0aCkgYXdhaXQgdXBkYXRlVG9kb2lzdFRhc2sodG9rZW4sIHRhc2suaWQsIGZpZWxkcyk7XG4gICAgICAgIGNvbnN0IG9sZFByb2ogPSB0YXNrLnByb2plY3RfaWQgPz8gXCJcIjtcbiAgICAgICAgaWYgKHYucHJvamVjdElkICE9PSBvbGRQcm9qICYmIHYucHJvamVjdElkKSBhd2FpdCBtb3ZlVG9kb2lzdFRhc2sodG9rZW4sIHRhc2suaWQsIHYucHJvamVjdElkKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIFNhbHZhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuZmV0Y2godHJ1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBzYWx2YXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZGVsZXRlVGFzayh0OiBUb2RvaXN0VGFzayk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaWR4ID0gdGhpcy50YXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZXJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkZWxldGVUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7XG4gICAgICBuZXcgTm90aWNlKGBcdUQ4M0RcdURERDEgRXhjbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBleGNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbXBsZXRlVGFzayh0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gdGhpcy50YXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZXJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjbG9zZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDAsIHQpO1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoKG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuIHx8IHRoaXMubG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZXJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBbdGFza3MsIHByb2plY3RzLCBsYWJlbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbiksXG4gICAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0UHJvamVjdFtdKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0TGFiZWxbXSksXG4gICAgICBdKTtcbiAgICAgIHRoaXMudGFza3MgPSB0YXNrcztcbiAgICAgIHRoaXMucHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAocHJvamVjdHMubWFwKHAgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKGxhYmVscy5tYXAobCA9PiBbbC5uYW1lLCBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDS10pKTtcbiAgICAgIHRoaXMuZmV0Y2hlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvLyBMYW5cdTAwRTdhIHVtIHBhY290ZTogY3JpYSBjYWRhIHRhcmVmYSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamUuIFNlcXVlbmNpYWxcbiAgLy8gKGV2aXRhIHJhamFkYSBuYSBBUEkpLiBBdHVhbGl6YSBhIGxpc3RhIGFvIGZpbmFsLlxuICBhc3luYyBsYXVuY2hQYWNrYWdlKHBrZzogVGFza1BhY2thZ2UpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdCBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMuXCIpOyByZXR1cm47IH1cbiAgICBjb25zdCBsaW5lcyA9IHBrZy50YXNrcy5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGluZXMubGVuZ3RoKSB7IG5ldyBOb3RpY2UoXCJQYWNvdGUgc2VtIHRhcmVmYXMuXCIpOyByZXR1cm47IH1cbiAgICBjb25zdCBkdWUgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBsZXQgb2sgPSAwO1xuICAgIGZvciAoY29uc3QgY29udGVudCBvZiBsaW5lcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7IGNvbnRlbnQsIGR1ZV9kYXRlOiBkdWUgfTtcbiAgICAgICAgaWYgKHBrZy5wcm9qZWN0SWQpIGZpZWxkcy5wcm9qZWN0X2lkID0gcGtnLnByb2plY3RJZDtcbiAgICAgICAgaWYgKHBrZy5sYWJlbHM/Lmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IHBrZy5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBvaysrO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBuZXcgTm90aWNlKGBGYWxoYSBlbSBcIiR7Y29udGVudH1cIjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIG5ldyBOb3RpY2UoYFx1MjcxMyAke29rfS8ke2xpbmVzLmxlbmd0aH0gdGFyZWZhKHMpIGxhblx1MDBFN2FkYShzKSBcdTIwMTQgJHtwa2cubmFtZSB8fCBcInBhY290ZVwifWApO1xuICAgIGF3YWl0IHRoaXMuZmV0Y2godHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckZpbHRlckJhcihob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBjb25zdCBiYXIgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJhclwiIH0pO1xuICAgIGlmICh0aGlzLnByb2plY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJQcm9qZXRvc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMucHJvamVjdHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLnByb2plY3RzLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICBjb25zdCBjaGlwID0gZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBwLm5hbWUgfSk7XG4gICAgICAgIGNoaXAub25jbGljayA9IGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVGaWx0ZXIoXCJwcm9qZWN0c1wiLCBwLmlkKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQodGhpcy50YXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBpZiAobGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsYWJlbHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IHRoaXMubGFiZWxDaGlwKGdycCwgbCwgXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikpO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlRmlsdGVyKFwibGFiZWxzXCIsIGwpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlcigpOyB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZi5wcm9qZWN0cy5sZW5ndGggfHwgZi5sYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjbHIgPSBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjbGVhclwiLCB0ZXh0OiBcImxpbXBhciBmaWx0cm9zXCIgfSk7XG4gICAgICBjbHIub25jbGljayA9IGFzeW5jICgpID0+IHsgZi5wcm9qZWN0cyA9IFtdOyBmLmxhYmVscyA9IFtdOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlcigpOyB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlbmRlcml6YSBvcyBjb250cm9sZXMgZGUgY2FiZVx1MDBFN2FsaG8gKGVtIGBjdHJsc2ApICsgYSBsaXN0YSBkZSB0YXJlZmFzXG4gIC8vIChlbSBgYm9keWApLiBPIGhvc3QgZm9ybmVjZSBvIHJcdTAwRjN0dWxvIGRhIHNlXHUwMEU3XHUwMEUzbyBlIG8gbGF5b3V0IGRvIGNhYmVcdTAwRTdhbGhvLlxuICByZW5kZXJMaXN0KGJvZHk6IEhUTUxFbGVtZW50LCBjdHJsczogSFRNTEVsZW1lbnQsIG9wdHM6IHsgc2hvd0xhdGVyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICAgIGNvbnN0IHNlZyA9IGN0cmxzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJhbmdlXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgWzMsIDddIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGIgPSBzZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJhbmdlLWJ0blwiICsgKHJhbmdlID09PSBuID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBgJHtufWRgIH0pO1xuICAgICAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCBgTW9zdHJhciBvcyBwclx1MDBGM3hpbW9zICR7bn0gZGlhc2ApO1xuICAgICAgICBiLm9uY2xpY2sgPSBhc3luYyBlID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IG47XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5yZXJlbmRlcigpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgICAgY29uc3QgbkYgPSBmLnByb2plY3RzLmxlbmd0aCArIGYubGFiZWxzLmxlbmd0aDtcbiAgICAgIGNvbnN0IGZpbHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYnRuXCIgKyAodGhpcy5maWx0ZXJPcGVuID8gXCIgd2Qtb25cIiA6IFwiXCIpICsgKG5GID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24oZmlsdCwgXCJmaWx0ZXJcIik7XG4gICAgICBmaWx0LnNldEF0dHIoXCJ0aXRsZVwiLCBuRiA/IGBGaWx0cm9zIGF0aXZvcyAoJHtuRn0pIFx1MjAxNCBjbGlxdWUgcGFyYSBhanVzdGFyYCA6IFwiRmlsdHJhciBwb3IgcHJvamV0by9ldGlxdWV0YVwiKTtcbiAgICAgIGlmIChuRikgZmlsdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmlsdGN0XCIsIHRleHQ6IFN0cmluZyhuRikgfSk7XG4gICAgICBmaWx0Lm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5maWx0ZXJPcGVuID0gIXRoaXMuZmlsdGVyT3BlbjsgdGhpcy5yZXJlbmRlcigpOyB9O1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5sb2FkaW5nID8gXCIgd2Qtc3BpblwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHJlZnJlc2gsIFwicmVmcmVzaC1jd1wiKTtcbiAgICAgIHJlZnJlc2guc2V0QXR0cihcInRpdGxlXCIsIFwiQXR1YWxpemFyIHRhcmVmYXMgZG8gVG9kb2lzdFwiKTtcbiAgICAgIHJlZnJlc2gub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuZmV0Y2godHJ1ZSk7IH07XG4gICAgICB0aGlzLmFkZFRhc2tCdG4oY3RybHMsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNvbGUgc2V1IHRva2VuIGRvIFRvZG9pc3QgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZCBwYXJhIHZlciBzdWFzIHRhcmVmYXMgYXF1aS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZmV0Y2hlZEF0ICYmICF0aGlzLmxvYWRpbmcgJiYgIXRoaXMuZXJyb3IpIHZvaWQgdGhpcy5mZXRjaChmYWxzZSk7XG4gICAgaWYgKHRoaXMuZXJyb3IpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHkgd2QtdG9kby1lcnJvclwiLCB0ZXh0OiBgRXJybyBhbyBidXNjYXIgdGFyZWZhczogJHt0aGlzLmVycm9yfWAgfSk7IHJldHVybjsgfVxuICAgIGlmICghdGhpcy5mZXRjaGVkQXQpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvIHRhcmVmYXNcdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG5cbiAgICBpZiAodGhpcy5maWx0ZXJPcGVuKSB0aGlzLnJlbmRlckZpbHRlckJhcihib2R5KTtcblxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgIGNvbnN0IHRvZGF5SyA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGNvbnN0IGxhc3RVcGNvbWluZyA9IG5ldyBEYXRlKCk7XG4gICAgbGFzdFVwY29taW5nLnNldERhdGUobGFzdFVwY29taW5nLmdldERhdGUoKSArIHJhbmdlKTtcbiAgICBjb25zdCBsYXN0SyA9IHRvS2V5KGxhc3RVcGNvbWluZyk7XG5cbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuYXBwbHlGaWx0ZXJzKHRoaXMudGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgY29udGludWU7XG4gICAgICBpZiAoZGsgPCB0b2RheUspIG92ZXJkdWUucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrID09PSB0b2RheUspIHRvZGF5VGFza3MucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrIDw9IGxhc3RLKSAoYnlEYXlbZGtdID8/PSBbXSkucHVzaCh0KTtcbiAgICAgIGVsc2UgbGF0ZXIucHVzaCh0KTtcbiAgICB9XG4gICAgY29uc3QgYnlQcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICAvLyBcIkRlcG9pc1wiOiBvcmRlbmEgcG9yIERBVEEgKG1haXMgcHJcdTAwRjN4aW1hIHByaW1laXJvKSBlLCBubyBtZXNtbyBkaWEsIHBvciBwcmlvcmlkYWRlLlxuICAgIGNvbnN0IGJ5RGF0ZVRoZW5QcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiB7XG4gICAgICBjb25zdCBkYSA9IGR1ZUtleShhKSA/PyBcIlwiLCBkYiA9IGR1ZUtleShiKSA/PyBcIlwiO1xuICAgICAgaWYgKGRhICE9PSBkYikgcmV0dXJuIGRhIDwgZGIgPyAtMSA6IDE7XG4gICAgICByZXR1cm4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7XG4gICAgfTtcbiAgICBvdmVyZHVlLnNvcnQoYnlQcmkpOyB0b2RheVRhc2tzLnNvcnQoYnlQcmkpOyBsYXRlci5zb3J0KGJ5RGF0ZVRoZW5QcmkpO1xuICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhieURheSkpIGJ5RGF5W2tdLnNvcnQoYnlQcmkpO1xuXG4gICAgY29uc3QgdmlzaWJsZSA9IG92ZXJkdWUubGVuZ3RoICsgdG9kYXlUYXNrcy5sZW5ndGggKyBsYXRlci5sZW5ndGggKyBPYmplY3QudmFsdWVzKGJ5RGF5KS5yZWR1Y2UoKHMsIGEpID0+IHMgKyBhLmxlbmd0aCwgMCk7XG4gICAgaWYgKHZpc2libGUgPT09IDApIHtcbiAgICAgIGNvbnN0IGFsbCA9IHRoaXMudGFza3MubGVuZ3RoO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogYWxsID8gXCJOZW5odW1hIHRhcmVmYSBiYXRlIGNvbSBvcyBmaWx0cm9zLlwiIDogXCJOZW5odW1hIHRhcmVmYSBjb20gZGF0YSBubyBUb2RvaXN0LiBcdUQ4M0NcdURGODlcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2xzID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1jb2xzXCIgfSk7XG5cbiAgICBjb25zdCBvYm94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LW92ZXJkdWVcIiB9KTtcbiAgICBjb25zdCBvaGQgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3h3YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkF0cmFzYWRhc1wiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKG92ZXJkdWUubGVuZ3RoKSB9KTtcbiAgICBjb25zdCBvYm9keSA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIG92ZXJkdWUpIHRoaXMudG9kb1JvdyhvYm9keSwgdCk7XG4gICAgZWxzZSBvYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEuIFx1RDgzRFx1REM0RFwiIH0pO1xuXG4gICAgY29uc3QgdGJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC10b2RheVwiIH0pO1xuICAgIGNvbnN0IHRoZCA9IHRib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiSG9qZVwiIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih0aGQsIFwiaG9qZVwiLCBcIk5vdmEgdGFyZWZhIHBhcmEgaG9qZVwiKTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh0b2RheVRhc2tzLmxlbmd0aCkgfSk7XG4gICAgY29uc3QgdGJvZHkgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodG9kYXlUYXNrcy5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiB0b2RheVRhc2tzKSB0aGlzLnRvZG9Sb3codGJvZHksIHQpO1xuICAgIGVsc2UgdGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOYWRhIHBhcmEgaG9qZS5cIiB9KTtcblxuICAgIGxldCB1cGNvbWluZ0NvdW50ID0gMDtcbiAgICBjb25zdCB1cERheXM6IHsgZG93OiBudW1iZXI7IG51bTogbnVtYmVyOyBrZXk6IHN0cmluZzsgaXRlbXM6IFRvZG9pc3RUYXNrW10gfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmFuZ2U7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV07XG4gICAgICBpZiAoIWl0ZW1zPy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgdXBjb21pbmdDb3VudCArPSBpdGVtcy5sZW5ndGg7XG4gICAgICB1cERheXMucHVzaCh7IGRvdzogKGRheS5nZXREYXkoKSArIDYpICUgNywgbnVtOiBkYXkuZ2V0RGF0ZSgpLCBrZXksIGl0ZW1zIH0pO1xuICAgIH1cbiAgICBjb25zdCB1Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXVwY29taW5nXCIgfSk7XG4gICAgY29uc3QgdWhkID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogYFByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhc2AgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHVoZCwgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHVwY29taW5nQ291bnQpIH0pO1xuICAgIGNvbnN0IHVib2R5ID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHVwRGF5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgZyBvZiB1cERheXMpIHtcbiAgICAgICAgY29uc3QgZGggPSB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1kYXloZFwiICsgKGcuZG93ID49IDUgPyBcIiB3ZC13ZWVrZW5kXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2cuZG93XSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW51bVwiLCB0ZXh0OiBTdHJpbmcoZy5udW0pIH0pO1xuICAgICAgICB0aGlzLmFkZFRhc2tCdG4oZGgsIGcua2V5LCBgTm92YSB0YXJlZmEgZW0gJHtnLm51bX1gKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGcuaXRlbXMpIHRoaXMudG9kb1Jvdyh1Ym9keSwgdCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBgTmFkYSBub3MgcHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzLmAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGxhdGVyLmxlbmd0aCAmJiBvcHRzLnNob3dMYXRlciAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1sYXRlclwiIH0pO1xuICAgICAgY29uc3QgbGhkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2hkXCIgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWxhdGVyaWNvXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90aXRsZVwiLCB0ZXh0OiBgRGVwb2lzICgke2xhdGVyLmxlbmd0aH0pYCB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RvZ2dsZVwiLCB0ZXh0OiB0aGlzLmxhdGVyT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmxhdGVyT3BlbiA9ICF0aGlzLmxhdGVyT3BlbjsgdGhpcy5yZXJlbmRlcigpOyB9O1xuICAgICAgaWYgKHRoaXMubGF0ZXJPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbGF0ZXIpIHRoaXMudG9kb1JvdyhsaXN0LCB0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRGFzaGJvYXJkVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSB3ZWVrT2Zmc2V0ID0gMDtcbiAgcHJpdmF0ZSBuYXZQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2VhcmNoVGVybSA9IFwiXCI7XG4gIHByaXZhdGUgcmV2aWV3RmlsdGVyID0gZmFsc2U7XG4gIHByaXZhdGUgZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlO1xuXG4gIC8vIEludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3QgXHUyMDE0IHRvZGEgYSBsXHUwMEYzZ2ljYSB2aXZlIG5vIGNvbnRyb2xhZG9yIGNvbXBhcnRpbGhhZG8uXG4gIHJlYWRvbmx5IHRvZG86IFRvZG9pc3RDb250cm9sbGVyO1xuXG4gIC8vIEVzdGFkbyBkbyBTeW5jdGhpbmcgKHYwLjEwLjApXG4gIHByaXZhdGUgc3luY0RhdGE6IFN5bmNEYXRhIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzeW5jRXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIGNvbmZsaWN0Q29uZmlybTogc3RyaW5nIHwgbnVsbCA9IG51bGw7ICAgLy8gcGF0aCBkbyBjb25mbGl0byBhZ3VhcmRhbmRvIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICAgIHRoaXMudG9kbyA9IG5ldyBUb2RvaXN0Q29udHJvbGxlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4sIHRoaXMsICgpID0+IHRoaXMucmVuZGVyKCkpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB0aGlzLnNjaGVkdWxlKCkpKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKSB7IHRoaXMuaGlkZVRpcCgpOyB0aGlzLnRvZG8uaGlkZVRpcCgpOyB9XG5cbiAgLy8gUmUtcmVuZGVyIHBcdTAwRkFibGljbyBcdTIwMTQgY2hhbWFkbyBwZWxvIHBsdWdpbiBxdWFuZG8gYSBjb25maWd1cmFcdTAwRTdcdTAwRTNvIG11ZGEgbmEgYWJhXG4gIC8vIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIChvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMgZGEgU2VtYW5hKS5cbiAgcmVmcmVzaCgpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMudG9kby5oaWRlVGlwKCk7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtY29tcGFjdFwiLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KTtcblxuICAgIHRoaXMucmVuZGVySGVhZGVyKHJvb3QpO1xuICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyKSB7XG4gICAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJwYXJhXCIpICAgIHRoaXMucmVuZGVyUGFyYShyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcImhlYXRtYXBcIikgdGhpcy5yZW5kZXJIZWF0bWFwKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInN0YXRzXCIpICAgdGhpcy5yZW5kZXJTdGF0cyhyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInRvZG9pc3RcIikgdGhpcy5yZW5kZXJUb2RvaXN0KHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwic3luY1wiKSAgICB0aGlzLnJlbmRlclN5bmMocm9vdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE9jdWx0YXIgKGxlaXR1cmEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0cmFyL29jdWx0YXIgZSBhIG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzIHNcdTAwRTNvIGFkbWluaXN0cmFkb3MgbmEgYWJhIGRlXG4gIC8vIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIGRvIHBsdWdpbi4gQSB2aWV3IHNcdTAwRjMgKmxcdTAwRUEqIGBzZXR0aW5ncy5oaWRkZW5gIHBhcmEgcHVsYXIgbyBxdWVcbiAgLy8gZXN0XHUwMEUxIG9jdWx0by4gVmVyIFdlcnVzU2V0dGluZ1RhYi5cblxuICBwcml2YXRlIGlzSGlkZGVuKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvb2x0aXAgZGUgbm90YXMgcmVjZW50ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBzaG93VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGZpbGVzOiBURmlsZVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiTW9kaWZpY2FkYXMgcmVjZW50ZW1lbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBmIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIFBvc2ljaW9uYSB1bSB0b29sdGlwIGZpeG8gYWJhaXhvIGRvIGFsdm8gKHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3bykuXG4gIHByaXZhdGUgcG9zaXRpb25UaXAodGlwOiBIVE1MRWxlbWVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdHcgPSB0aXAub2Zmc2V0V2lkdGgsIHRoID0gdGlwLm9mZnNldEhlaWdodDtcbiAgICBsZXQgbGVmdCA9IHJlY3QubGVmdDtcbiAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyA2O1xuICAgIGlmIChsZWZ0ICsgdHcgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHR3IC0gODtcbiAgICBpZiAodG9wICsgdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSB0b3AgPSByZWN0LnRvcCAtIHRoIC0gNjsgIC8vIHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3b1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICAvLyBUb29sdGlwIGxpc3RhbmRvIGFzIG5vdGFzIHVyZ2VudGVzIGRlIHVtYSBwYXN0YSAoaG92ZXIgbm8gYmFkZ2UgZGUgYXZpc28pLlxuICBwcml2YXRlIHNob3dVcmdlbmN5VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXVyZ2VuY3ktdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJVcmdlbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICBjb25zdCBkb3QgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC11dGlwLWRvdFwiIH0pO1xuICAgICAgZG90LnN0eWxlLmJhY2tncm91bmQgPSBVUkdFTkNZX0NPTE9SW2l0LmxldmVsXTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGl0LmZpbGUuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBpdC5sZXZlbCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBCYWRnZSBkZSBhdmlzbyAodHJpXHUwMEUybmd1bG8pIG5vIGNhcmQgZGUgcGFzdGEgcXVlIGNvbnRcdTAwRTltIG5vdGFzIGNvbSBgdXJnZW5jeWAuXG4gIC8vIENvciBwZWxvIG5cdTAwRUR2ZWwgbVx1MDBFMXhpbW87IGhvdmVyIGxpc3RhIG9zIGFycXVpdm9zLiBGYXNlIDEwLlxuICBwcml2YXRlIHVyZ2VuY3lCYWRnZShjYXJkOiBIVE1MRWxlbWVudCwgdXJnOiBVcmdlbmN5SW5mbykge1xuICAgIGlmICghdXJnLm1heCkgcmV0dXJuO1xuICAgIGNvbnN0IGIgPSBjYXJkLmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LWJhZGdlIHdkLXUtJHt1cmcubWF4fWAgfSk7XG4gICAgc2V0SWNvbihiLCBcInRyaWFuZ2xlLWFsZXJ0XCIpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VXJnZW5jeVRpcChiLCB1cmcuaXRlbXMpKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZVRpcCgpIHtcbiAgICBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfVxuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hUaXAoY2FyZDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJlY2VudHMgPSByZWNlbnROb3Rlcyhmb2xkZXIsIDQpO1xuICAgIGlmICghcmVjZW50cy5sZW5ndGgpIHJldHVybjtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1RpcChjYXJkLCByZWNlbnRzKSk7XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FsZW5kXHUwMEUxcmlvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyQ2FsZW5kYXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfQ0FMKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbW9uZGF5ICA9IG1vbmRheU9mKHRoaXMud2Vla09mZnNldCk7XG4gICAgY29uc3Qgd2Vla051bSA9IGlzb1dlZWtOdW1iZXIobW9uZGF5KTtcbiAgICBjb25zdCB0b2RheUsgID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBGb250ZXMgYXRpdmFzIChwYXN0YXMgbWFyY2FkYXMpLiBBIGNvciBkZSBjYWRhIG5vdGEgdmVtIGRhIGZvbnRlIGRlXG4gICAgLy8gcHJlZml4byBtYWlzIGVzcGVjXHUwMEVEZmljbyBxdWUgYSBjb250XHUwMEU5bS5cbiAgICBjb25zdCBzb3VyY2VzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmZpbHRlcihzID0+IHMub24pO1xuICAgIGNvbnN0IGNvbG9yRm9yID0gKHBhdGg6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgbGV0IGJlc3Q6IENhbFNvdXJjZSB8IG51bGwgPSBudWxsO1xuICAgICAgZm9yIChjb25zdCBzIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgaWYgKHBhdGggPT09IGAke3MucGF0aH0ubWRgIHx8IHBhdGguc3RhcnRzV2l0aChgJHtzLnBhdGh9L2ApKSB7XG4gICAgICAgICAgaWYgKCFiZXN0IHx8IHMucGF0aC5sZW5ndGggPiBiZXN0LnBhdGgubGVuZ3RoKSBiZXN0ID0gcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlc3QgPyBiZXN0LmNvbG9yIDogbnVsbDtcbiAgICB9O1xuXG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIHsgbmFtZTogc3RyaW5nOyBmaWxlOiBURmlsZTsgY29sb3I6IHN0cmluZyB9W10+ID0ge307XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3QgY29sb3IgPSBjb2xvckZvcihmaWxlLnBhdGgpO1xuICAgICAgaWYgKCFjb2xvcikgY29udGludWU7ICAgLy8gc1x1MDBGMyBub3RhcyBkZW50cm8gZGUgdW1hIGZvbnRlIG1hcmNhZGFcbiAgICAgIGNvbnN0IG0gPSBmaWxlLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgY29uc3QgZCA9IG5vcm1hbGl6ZURhdGUodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8uZGF0ZSkgPz8gKG0gPyBtWzFdIDogbnVsbCk7XG4gICAgICBpZiAoZCkgKGJ5RGF5W2RdID8/PSBbXSkucHVzaCh7IG5hbWU6IGZpbGUuYmFzZW5hbWUsIGZpbGUsIGNvbG9yIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtY2FsLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBuYXYgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYXYtYmFyXCIgfSk7XG4gICAgY29uc3QgcGhvbmUgPSBQbGF0Zm9ybS5pc1Bob25lO1xuXG4gICAgLy8gQ2VsdWxhcjogamFuZWxhIGRlIDMgZGlhcyA9IG9udGVtIFx1MDBCNyBob2plIFx1MDBCNyBhbWFuaFx1MDBFMyAod2Vla09mZnNldCBwYWdpbmEgZGUgMyBlbSAzKS5cbiAgICBjb25zdCBkYXlBbmNob3IgPSBuZXcgRGF0ZSgpO1xuICAgIGRheUFuY2hvci5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgLSAxICsgdGhpcy53ZWVrT2Zmc2V0ICogMyk7XG4gICAgY29uc3QgZm10RE0gPSAoZDogRGF0ZSkgPT4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCBcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsYXN0ID0gbmV3IERhdGUoZGF5QW5jaG9yKTsgbGFzdC5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyAyKTtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGAke2ZtdERNKGRheUFuY2hvcil9IFx1MjAxMyAke2ZtdERNKGxhc3QpfWAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGBSZWxhdFx1MDBGM3Jpb3MgXHUwMEI3IHNlbWFuYSAke3dlZWtOdW19YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHJscyA9IG5hdi5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgcHJldiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDM5XCIgfSk7XG4gICAgY29uc3QgbmV4dCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgcHJldi5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQtLTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBuZXh0Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldCsrOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENlbHVsYXI6IGxpc3RhIHZlcnRpY2FsIGRlIDMgZGlhcyAob250ZW0vaG9qZS9hbWFuaFx1MDBFMykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ2FkYSBkaWEgPSBhIG5vdGEgZGlcdTAwRTFyaWEgKHVtYSBwb3IgZGlhKS4gTGluaGEgaW50ZWlyYSBjbGljXHUwMEUxdmVsOiBhYnJlIGFcbiAgICAvLyBleGlzdGVudGU7IHNlIG5cdTAwRTNvIGhvdXZlciwgY3JpYS5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1saXN0XCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShkYXlBbmNob3IpO1xuICAgICAgICBkYXkuc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICAgIGNvbnN0IGRvdyA9IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDc7XG4gICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogW1wid2QtY2FsLWRyb3dcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBkb3cgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgcm93LnNldEF0dHIoXCJ0aXRsZVwiLCBub3RlID8gXCJBYnJpciBub3RhIGRpXHUwMEUxcmlhXCIgOiBcIkNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICAgIGNvbnN0IGhkID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1oZFwiIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtkb3ddIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1udW1cIiwgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgICBjb25zdCBib2R5ID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1ub3Rlc1wiIH0pO1xuICAgICAgICBpZiAobm90ZSkge1xuICAgICAgICAgIGNvbnN0IHBpbGwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICAgIHBpbGwudGV4dENvbnRlbnQgPSBub3RlLmJhc2VuYW1lLmxlbmd0aCA+IDI0ID8gbm90ZS5iYXNlbmFtZS5zbGljZSgwLCAyNCkgKyBcIlx1MjAyNlwiIDogbm90ZS5iYXNlbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBib2R5LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWRyb3ctZW1wdHlcIiwgdGV4dDogXCJjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcm93Lm9uY2xpY2sgPSAoKSA9PiB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBEZXNrdG9wL3RhYmxldDogZ3JhZGUgZGUgNyBkaWFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBoZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7IH07XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0td2Qtc3JjXCIsIGl0LmNvbG9yKTtcbiAgICAgICAgcGlsbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1waWxsLWRvdFwiIH0pO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtdHh0XCIsIHRleHQ6IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lIH0pO1xuICAgICAgICBwaWxsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoaXQuZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFjaGEgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgIChZWVlZLU1NLUREKTogcHJpbWVpcm8gcGVsbyBjYW1pbmhvIGNhblx1MDBGNG5pY28gZW1cbiAgLy8gNTAuRGlcdTAwRTFyaW8vLCBzZW5cdTAwRTNvIHF1YWxxdWVyIG5vdGEgY3VqbyBgZGF0ZTpgIHNlamEgZXNzZSBkaWEuIE51bGwgc2Ugblx1MDBFM28gaG91dmVyLlxuICAvLyAoUmVsYXRcdTAwRjNyaW8vbm90YSBkaVx1MDBFMXJpYSBcdTAwRTkgdW0gcG9yIGRpYSBcdTIxOTIgYWJyZSBvIGV4aXN0ZW50ZSBlbSB2ZXogZGUgY3JpYXIgb3V0cm8uKVxuICBwcml2YXRlIGZpbmREYWlseU5vdGUoa2V5OiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICAgIGNvbnN0IGRpcmVjdCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGApO1xuICAgIGlmIChkaXJlY3QgaW5zdGFuY2VvZiBURmlsZSkgcmV0dXJuIGRpcmVjdDtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAobm9ybWFsaXplRGF0ZSh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5kYXRlKSA9PT0ga2V5KSByZXR1cm4gZjtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBYnJlIGEgbm90YSBkaVx1MDBFMXJpYSBkZSBga2V5YDsgY3JpYSBlbSA1MC5EaVx1MDBFMXJpby8gU1x1MDBEMyBzZSBuXHUwMEUzbyBleGlzdGlyIG5lbmh1bWEuXG4gIHByaXZhdGUgYXN5bmMgb3BlbkRhaWx5Tm90ZShrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5maW5kRGFpbHlOb3RlKGtleSk7XG4gICAgaWYgKGV4aXN0aW5nKSB7IGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShleGlzdGluZyk7IHJldHVybjsgfVxuXG4gICAgLy8gTlx1MDBFM28gZXhpc3RlIFx1MjE5MiBjcmlhIG5vIGNhbWluaG8gY2FuXHUwMEY0bmljby5cbiAgICBpZiAoIXRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9GT0xERVIpKVxuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKERBSUxZX0ZPTERFUikuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgY29uc3QgW3ksIG0sIGRdID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICBjb25zdCB0aXR1bG8gPSBuZXcgRGF0ZSgreSwgK20gLSAxLCArZCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIiwge1xuICAgICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gICAgfSk7XG5cbiAgICAvLyBVc2EgbyB0ZW1wbGF0ZSBlbSBNb2RlbG9zLyBzZSBleGlzdGlyOyBzZW5cdTAwRTNvLCBmYWxsYmFjayBlbWJ1dGlkby5cbiAgICBjb25zdCB0cGwgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfVEVNUExBVEUpO1xuICAgIGxldCBib2R5OiBzdHJpbmc7XG4gICAgaWYgKHRwbCBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICBib2R5ID0gKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodHBsKSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccypkYXRlXFxzKlxcfVxcfS9nLCBrZXkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqdGl0bGVcXHMqXFx9XFx9L2csIHRpdHVsbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvZHkgPVxuYC0tLVxub3duZXI6IFdlcnVzXG5jcmVhdGVkOiAke2tleX1cbmRhdGU6ICR7a2V5fVxucmV2aWV3ZWQ6IHRydWVcbnR5cGU6IGRhaWx5XG5wZXJtaXNzaW9uczpcbiAgcmVhZDogW2FsbF1cbiAgd3JpdGU6XG4gICAgLSBXZXJ1c1xuLS0tXG5cbiMgJHt0aXR1bG99XG5cbmA7XG4gICAgfVxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoYCR7REFJTFlfRk9MREVSfS8ke2tleX0ubWRgLCBib2R5KTtcbiAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZmlsZSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZHMgZG8gY29mcmUgKHRvZGFzIGFzIHBhc3RhcyBkZSB0b3BvKSArIG5hdmVnYWRvciBhbmluaGFkbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclBhcmEocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfUEFSQSkpIHJldHVybjtcbiAgICAvLyBTZSBhIHBhc3RhIGFiZXJ0YSBubyBuYXZlZ2Fkb3IgZm9pIG9jdWx0YWRhIG5hcyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcywgZmVjaGEuXG4gICAgaWYgKHRoaXMubmF2UGF0aCAmJiB0aGlzLmlzSGlkZGVuKHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSkpIHRoaXMubmF2UGF0aCA9IG51bGw7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFyYS1ncmlkXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgICAvLyBpZ25vcmEgLm9ic2lkaWFuLCAudHJhc2gsIGV0Yy5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVJvb3QgPSB0aGlzLm5hdlBhdGggPyB0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkgOiBudWxsO1xuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgbWV0YSAgICA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBzdGF0cyAgID0gZm9sZGVyU3RhdHMoZm9sZGVyKTtcbiAgICAgIGNvbnN0IGNvdmVyICAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgbmF2aWdhYmxlID0gc3ViRm9sZGVycyhmb2xkZXIpLmxlbmd0aCA+IDAgfHwgZmlsZXNJbihmb2xkZXIpLmxlbmd0aCA+IDA7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVJvb3QgPT09IGZvbGRlci5wYXRoO1xuXG4gICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZCB3ZC1wYXJhLWNhcmQgd2QtYW5pbS1pblwiICsgKGlzQWN0aXZlID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICBjYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7aWR4ICogNDB9bXNgO1xuICAgICAgaWR4Kys7XG5cbiAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0XCIgfSk7XG4gICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgfVxuICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtYWNjZW50LWJhclwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBtZXRhLmFjY2VudDtcblxuICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgdXJnZW5jeVN0YXRzKHRoaXMuYXBwLCBmb2xkZXIpKTtcblxuICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dChzdGF0cykgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCAgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWZvbGRlclwiLCB0ZXh0OiBmb2xkZXIucGF0aCB9KTtcbiAgICAgIGlmIChuYXZpZ2FibGUpIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhhcy1zdWJzXCIsIHRleHQ6IGlzQWN0aXZlID8gXCJmZWNoYXIgXHUyNUJFXCIgOiBcImFicmlyIFx1MjAzQVwiIH0pO1xuXG4gICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBpZiAocnYudG90YWwgPiAwKSB7XG4gICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhc2ApO1xuICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApfSVgO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBmb2xkZXIpO1xuXG4gICAgICBjYXJkLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChuYXZpZ2FibGUpIHsgdGhpcy5uYXZQYXRoID0gaXNBY3RpdmUgPyBudWxsIDogZm9sZGVyLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH1cbiAgICAgICAgZWxzZSByZXZlYWxJbkV4cGxvcmVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIWlkeCkgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgdmlzXHUwMEVEdmVsLlwiIH0pO1xuXG4gICAgLy8gQXJxdWl2b3Mgc29sdG9zIG5hIHJhaXogZG8gY29mcmVcbiAgICBjb25zdCByb290RmlsZXMgPSBmaWxlc0luKHZhdWx0Um9vdCk7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhzZWMsIHJvb3RGaWxlcywgXCJhcnF1aXZvcyBuYSByYWl6XCIpO1xuXG4gICAgaWYgKHRoaXMubmF2UGF0aCkge1xuICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMubmF2UGF0aCk7XG4gICAgICBpZiAoZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikgdGhpcy5yZW5kZXJCcm93c2VyKHNlYywgZm9sZGVyKTtcbiAgICB9XG4gIH1cblxuICAvLyBQYWluZWwgaW5saW5lIG5hdmVnXHUwMEUxdmVsIChicmVhZGNydW1iICsgc3VicGFzdGFzICsgbm90YXMgZGEgcGFzdGEgYXR1YWwpXG4gIHByaXZhdGUgcmVuZGVyQnJvd3NlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHRoaXMudG9wRm9sZGVyT2YoZm9sZGVyLnBhdGgpO1xuICAgIGNvbnN0IHJvb3RGb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocm9vdFBhdGgpO1xuICAgIGlmICghKHJvb3RGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCByb290Rm9sZGVyKTtcblxuICAgIGNvbnN0IHBhbmVsID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYW5lbFwiIH0pO1xuICAgIHBhbmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgLy8gQnJlYWRjcnVtYlxuICAgIGNvbnN0IGNydW1iID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNydW1iXCIgfSk7XG4gICAgY29uc3QgcmVsID0gZm9sZGVyLnBhdGggPT09IHJvb3RQYXRoID8gW10gOiBmb2xkZXIucGF0aC5zbGljZShyb290UGF0aC5sZW5ndGggKyAxKS5zcGxpdChcIi9cIik7XG5cbiAgICBjb25zdCByb290U2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChyZWwubGVuZ3RoID09PSAwID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSB9KTtcbiAgICByZW5kZXJJY29uKHJvb3RTZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgcm9vdFNlZy5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICBpZiAocmVsLmxlbmd0aCkgcm9vdFNlZy5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgc2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNlZ1BhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xvc2Uub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIENhbXBvIGRlIGJ1c2NhXG4gICAgY29uc3Qgc2VhcmNoV3JhcCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWFyY2gtd3JhcFwiIH0pO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoV3JhcC5jcmVhdGVFbChcImlucHV0XCIsIHtcbiAgICAgIGNsczogXCJ3ZC1zZWFyY2hcIixcbiAgICAgIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcImZpbHRyYXJcdTIwMjZcIiwgdmFsdWU6IHRoaXMuc2VhcmNoVGVybSB9LFxuICAgIH0pO1xuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLXN1Yi1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYmwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLndkLWxhYmVsXCIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbGJsLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1ub3RlLXJvdywgLndkLW5vdGUtY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbC5xdWVyeVNlbGVjdG9yKFwiLndkLW5vdGUtbmFtZSwgLndkLW5vdGUtY2FyZC1uYW1lXCIpPy50ZXh0Q29udGVudCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbmFtZS5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU3VicGFzdGFzIGNvbW8gY2FyZHNcbiAgICBjb25zdCBzdWJzID0gc3ViRm9sZGVycyhmb2xkZXIpO1xuICAgIGlmIChzdWJzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2dyaWQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvai1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNmIG9mIHN1YnMpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVhZEZvbGRlclN0YXR1cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBzdGF0cyAgPSBmb2xkZXJTdGF0cyhzZik7XG4gICAgICAgIGNvbnN0IGNvdmVyICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgZGVlcGVyID0gc3ViRm9sZGVycyhzZikubGVuZ3RoID4gMDtcbiAgICAgICAgY29uc3QgY3VzdG9tSWNvbiA9IHJlYWRGb2xkZXJJY29uKHRoaXMuYXBwLCBzZik7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IHNncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLWNhcmQgd2Qtc3ViLWNhcmQgd2Qtcy0ke3N0YXR1c31gIH0pO1xuICAgICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gc3V0aWwgKHZlcnNcdTAwRTNvIG1lbm9yIHF1ZSBhcyBwYXN0YXMgZGUgdG9wbykgXHUyMDE0IEZhc2UgOS4xXG4gICAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0IHdkLWNvdmVyLXN1YlwiIH0pO1xuICAgICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBjdXN0b21JY29uID8/IFwiXHVEODNEXHVEQ0MxXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1iYWRnZSB3ZC1iYWRnZS0ke3N0YXR1c31gLCB0ZXh0OiBTVEFUVVNfSUNPTltzdGF0dXNdIH0pO1xuICAgICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIHNmKSk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgICAgaWYgKGN1c3RvbUljb24pIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvbiB3ZC1zdWItaWNvblwiIH0pLCBjdXN0b21JY29uKTtcbiAgICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgICAgaWYgKGRlZXBlcikgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3ViLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCB0ZXh0OiBzZi5uYW1lIH0pO1xuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSBsYWJlbC5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgICAgaWYgKHJ2LnRvdGFsID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhc2ApO1xuICAgICAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNhcmQuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgc2YpO1xuICAgICAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2YucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFycXVpdm9zIGRhIHBhc3RhIGF0dWFsIChub3RhcywgY2FudmFzLCBiYXNlcylcbiAgICBjb25zdCBub3RlcyA9IGZpbGVzSW4oZm9sZGVyKTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHBhbmVsLCBub3Rlcyk7XG5cbiAgICBpZiAoIXN1YnMubGVuZ3RoICYmICFub3Rlcy5sZW5ndGgpXG4gICAgICBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJQYXN0YSB2YXppYS5cIiB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWF0bWFwICh2aWEgcGx1Z2luIEhlYXRtYXAgQ2FsZW5kYXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhdG1hcChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19IRUFUKSkgcmV0dXJuO1xuICAgIGlmIChQbGF0Zm9ybS5pc1Bob25lKSByZXR1cm47ICAgLy8gaGVhdG1hcCAoYW5vIGludGVpcm8pIG9jdWx0YWRvIG5vIGNlbHVsYXJcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtaGVhdC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJBVElWSURBREUgRE8gQ09GUkVcIiB9KTtcblxuICAgIGNvbnN0IHJlbmRlciA9IGdldEhlYXRtYXBSZW5kZXJlcigpO1xuICAgIGlmICghcmVuZGVyKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6ICdBdGl2ZSBvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiBwYXJhIHZlciBhIGF0aXZpZGFkZS4nIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdGFzIGNyaWFkYXMgcG9yIGRpYSwgbm8gYW5vIGNvcnJlbnRlLlxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY291bnRzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGYuc3RhdC5jdGltZSk7XG4gICAgICBpZiAoZC5nZXRGdWxsWWVhcigpICE9PSB5ZWFyKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY291bnRzW2tleV0gPSAoY291bnRzW2tleV0gPz8gMCkgKyAxO1xuICAgIH1cbiAgICBjb25zdCBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXSA9IE9iamVjdC5lbnRyaWVzKGNvdW50cykubWFwKChbZGF0ZSwgbl0pID0+ICh7XG4gICAgICBkYXRlLCBpbnRlbnNpdHk6IG4sIGNvbG9yOiBcImdyZWVuXCIsIGNvbnRlbnQ6IGAke259IG5vdGEocylgLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IGJveCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhdC1ib3hcIiB9KTtcbiAgICB0cnkge1xuICAgICAgcmVuZGVyKGJveCwge1xuICAgICAgICB5ZWFyLFxuICAgICAgICBjb2xvcnM6IHsgZ3JlZW46IFtcIiMxZTNhMmZcIiwgXCIjMWY2ZjQzXCIsIFwiIzJiYTg1YVwiLCBcIiMzOWQzNTNcIl0gfSxcbiAgICAgICAgc2hvd0N1cnJlbnREYXlCb3JkZXI6IHRydWUsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNlYy5lbXB0eSgpO1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkZhbGhhIGFvIHJlbmRlcml6YXIgbyBoZWF0bWFwLlwiIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBFc3RhdFx1MDBFRHN0aWNhcyBkbyBjb2ZyZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclN0YXRzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NUQVQpKSByZXR1cm47XG5cbiAgICBsZXQgdG90YWxOb3RlcyA9IDAsIHRvdGFsUmV2aWV3ZWQgPSAwLCBjcmVhdGVkVGhpc1dlZWsgPSAwO1xuICAgIGNvbnN0IHdlZWtBZ28gPSBEYXRlLm5vdygpIC0gNyAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgaWYgKGYubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgY29udGludWU7XG4gICAgICB0b3RhbE5vdGVzKys7XG4gICAgICBpZiAodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWUpIHRvdGFsUmV2aWV3ZWQrKztcbiAgICAgIGlmIChmLnN0YXQuY3RpbWUgPj0gd2Vla0FnbykgY3JlYXRlZFRoaXNXZWVrKys7XG4gICAgfVxuICAgIGNvbnN0IGdsb2JhbFBjdCA9IHRvdGFsTm90ZXMgPiAwID8gTWF0aC5yb3VuZCh0b3RhbFJldmlld2VkIC8gdG90YWxOb3RlcyAqIDEwMCkgOiAwO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiRVNUQVRcdTAwQ0RTVElDQVNcIiB9KTtcblxuICAgIC8vIE5cdTAwRkFtZXJvcyBnbG9iYWlzXG4gICAgY29uc3QgZ2xvYiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1nbG9iYWxcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWdcIiwgdGV4dDogU3RyaW5nKHRvdGFsTm90ZXMpIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcIm5vdGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnIHdkLXN0YXQtcmV2LW51bVwiLCB0ZXh0OiBgJHtnbG9iYWxQY3R9JWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwicmV2aXNhZGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtd2Vla1wiLCB0ZXh0OiBgKyR7Y3JlYXRlZFRoaXNXZWVrfWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwiZXN0YSBzZW1hbmFcIiB9KTtcblxuICAgIC8vIEJyZWFrZG93biBwb3IgcGFzdGFcbiAgICBjb25zdCB0YWJsZSA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC10YWJsZVwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcblxuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG4gICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBpZiAocnYudG90YWwgPT09IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBwY3QgPSBNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke3J2LnRvdGFsfWAgfSk7XG5cbiAgICAgIGNvbnN0IGJhcldyYXAgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyXCIgfSk7XG4gICAgICBiYXJXcmFwLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJsaXN0XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNhcmQgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gcG9yIHRpcG8gZGUgYXJxdWl2byAobm90YSAvIGNhbnZhcyAvIGJhc2UpIFx1MjAxNCBGYXNlIDkuMlxuICAgICAgICBjb25zdCBjb3YgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY292ZXIgd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24oY292LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1jb3Zlci1nbHlwaFwiIH0pLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcblxuICAgICAgICBpZiAoaXNNZCkgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjYXJkLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1yb3cgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IHRpID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLXR5cGVpY29uIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKHRpLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS1kb3Qgd2QtYmFkZ2UtJHtzdH1gIH0pO1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR3JcdTAwRTFmaWNvIGRlIGNyZXNjaW1lbnRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyR3Jvd3RoKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0dST1cpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDUkVTQ0lNRU5UTyBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgYnRuRGF5ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiZGlhXCIgfSk7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5vdGFzIGNyaWFkYXMgcG9yIGRpYVwiKTtcbiAgICBidG5EYXkub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gdHJ1ZTsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIEFncnVwYSBub3RhcyBwb3IgZGF0YSBkZSBjcmlhXHUwMEU3XHUwMEUzb1xuICAgIGNvbnN0IGNvdW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KG5ldyBEYXRlKGYuc3RhdC5jdGltZSkpO1xuICAgICAgY291bnRzW2tleV0gPSAoY291bnRzW2tleV0gPz8gMCkgKyAxO1xuICAgIH1cblxuICAgIC8vIFx1MDBEQWx0aW1vcyBOIGRpYXMgKG1lbm9zIG5vIGNlbHVsYXIpXG4gICAgY29uc3QgREFZUyA9IFBsYXRmb3JtLmlzUGhvbmUgPyAxNSA6IDMwO1xuICAgIGNvbnN0IGRheXM6IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IERBWVMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBkYXlzLnB1c2goeyBrZXksIGNvdW50OiBjb3VudHNba2V5XSA/PyAwLCBsYWJlbDogYCR7ZGF5fS8ke219YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbCA9IGRheXMucmVkdWNlKChzLCBkKSA9PiBzICsgZC5jb3VudCwgMCk7XG4gICAgY29uc3QgdG9kYXlLZXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIE1vZG8gY3VtdWxhdGl2bzogc29tYSBhY3VtdWxhZGEgZGlhIGEgZGlhXG4gICAgdHlwZSBEYXlFbnRyeSA9IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmc7IGRpc3BsYXlWYWw6IG51bWJlciB9O1xuICAgIGxldCBlbnRyaWVzOiBEYXlFbnRyeVtdO1xuICAgIGlmICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUpIHtcbiAgICAgIGxldCBhY2MgPSAwO1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4geyBhY2MgKz0gZC5jb3VudDsgcmV0dXJuIHsgLi4uZCwgZGlzcGxheVZhbDogYWNjIH07IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiAoeyAuLi5kLCBkaXNwbGF5VmFsOiBkLmNvdW50IH0pKTtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZW50cmllcy5tYXAoZSA9PiBlLmRpc3BsYXlWYWwpLCAxKTtcblxuICAgIC8vIExpbmhhIGRlIHJlc3Vtb1xuICAgIGNvbnN0IGluZm8gPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1pbmZvXCIgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC10b3RhbFwiLCB0ZXh0OiBgJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBlbnRyaWVzW2VudHJpZXMubGVuZ3RoIC0gMV0uZGlzcGxheVZhbCA6IHRvdGFsfWAgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC1wZXJpb2RcIiwgdGV4dDogdGhpcy5ncm93dGhDdW11bGF0aXZlID8gYG5vdGFzIGFjdW11bGFkYXMgKCR7REFZU30gZGlhcylgIDogYG5vdGFzIGNyaWFkYXMgbm9zIFx1MDBGQWx0aW1vcyAke0RBWVN9IGRpYXNgIH0pO1xuXG4gICAgLy8gR3JcdTAwRTFmaWNvIGRlIGJhcnJhc1xuICAgIGNvbnN0IGNoYXJ0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY2hhcnRcIiB9KTtcbiAgICBlbnRyaWVzLmZvckVhY2goKHsga2V5LCBjb3VudCwgbGFiZWwsIGRpc3BsYXlWYWwgfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNvbFwiICsgKGtleSA9PT0gdG9kYXlLZXkgPyBcIiB3ZC1ncm93dGgtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgYmFyQXJlYSA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhci1hcmVhXCIgfSk7XG4gICAgICBjb25zdCBpc0VtcHR5ID0gZGlzcGxheVZhbCA9PT0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChpc0VtcHR5ID8gXCIgd2QtZ3Jvd3RoLWJhci16ZXJvXCIgOiBcIlwiKSB9KTtcbiAgICAgIGJhci5zdHlsZS5oZWlnaHQgPSBpc0VtcHR5ID8gXCIzcHhcIiA6IGAke01hdGgubWF4KDUsIE1hdGgucm91bmQoKGRpc3BsYXlWYWwgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBpZiAoIWlzRW1wdHkpIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7bGFiZWx9OiAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGRpc3BsYXlWYWwgKyBcIiB0b3RhbFwiIDogY291bnQgKyBcIiBub3RhKHMpXCJ9YCk7XG5cbiAgICAgIGNvbnN0IHNob3dMYmwgPSBpZHggPT09IDAgfHwgaWR4ID09PSA3IHx8IGlkeCA9PT0gMTQgfHwgaWR4ID09PSAyMSB8fCBpZHggPT09IDI5IHx8IGtleSA9PT0gdG9kYXlLZXk7XG4gICAgICBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1sYmxcIiwgdGV4dDogc2hvd0xibCA/IGxhYmVsIDogXCJcIiB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IChkZWxlZ2FkbyBhbyBUb2RvaXN0Q29udHJvbGxlciBjb21wYXJ0aWxoYWRvKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclRvZG9pc3Qocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfVE9ETykpIHJldHVybjtcbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgLy8gQm90XHUwMEUzbyBkZSBuYXZlZ2FcdTAwRTdcdTAwRTNvIFx1MjE5MiBhYnJlIGEgYWJhIGRlZGljYWRhIGRvIFRvZG9pc3QgKG8gZGFzaGJvYXJkIFx1MDBFOSBvIGh1YikuXG4gICAgY29uc3Qgb3BlbiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vcGVuYnRuXCIgfSk7XG4gICAgc2V0SWNvbihvcGVuLCBcInNxdWFyZS1hcnJvdy1vdXQtdXAtcmlnaHRcIik7XG4gICAgb3Blbi5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBhIGFiYSBkbyBUb2RvaXN0XCIpO1xuICAgIG9wZW4ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMucGx1Z2luLm9wZW5Ub2RvaXN0KCk7IH07XG4gICAgLy8gRGFzaGJvYXJkID0gc1x1MDBGMyBvIGVzc2VuY2lhbCAoQXRyYXNhZGFzIFx1MDBCNyBIb2plIFx1MDBCNyBQclx1MDBGM3hpbW9zIDcpLiBcIkRlcG9pc1wiIGZpY2FcbiAgICAvLyBzXHUwMEYzIG5hIGFiYSBkbyBUb2RvaXN0IFx1MjE5MiByZWNvcnJlbnRlcyBzXHUwMEYzIGFwYXJlY2VtIGFxdWkgcGVydG8gZG8gZGlhLlxuICAgIHRoaXMudG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMsIHsgc2hvd0xhdGVyOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nICsgY29uZmxpdG9zKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICByZXNldFN5bmMoKSB7XG4gICAgdGhpcy5zeW5jRGF0YSA9IG51bGw7XG4gICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoU3luYyhtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmICghYmFzZSB8fCAha2V5IHx8IHRoaXMuc3luY0xvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHN0R2V0PFNURm9sZGVyW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZm9sZGVyc1wiKTtcbiAgICAgIGNvbnN0IHdhbnRlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkLnRyaW0oKTtcbiAgICAgIGNvbnN0IGZvbGRlciA9IGZvbGRlcnMuZmluZChmID0+IGYuaWQgPT09IHdhbnRlZCkgPz8gZm9sZGVyc1swXTtcbiAgICAgIGlmICghZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJuZW5odW1hIHBhc3RhIGNvbmZpZ3VyYWRhIG5vIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNvbnN0IGZpZCA9IGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIuaWQpO1xuXG4gICAgICBjb25zdCBbZGV2aWNlcywgY29ubnMsIHN0YXR1cywgc3RhdHMsIHN5c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0R2V0PFNURGV2aWNlW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZGV2aWNlc1wiKSxcbiAgICAgICAgc3RHZXQ8eyBjb25uZWN0aW9uczogUmVjb3JkPHN0cmluZywgeyBjb25uZWN0ZWQ6IGJvb2xlYW4gfT4gfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9jb25uZWN0aW9uc1wiKSxcbiAgICAgICAgc3RHZXQ8U1RTdGF0dXM+KGJhc2UsIGtleSwgYC9yZXN0L2RiL3N0YXR1cz9mb2xkZXI9JHtmaWR9YCksXG4gICAgICAgIHN0R2V0PFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9Pj4oYmFzZSwga2V5LCBcIi9yZXN0L3N0YXRzL2RldmljZVwiKS5jYXRjaCgoKSA9PiAoe30gYXMgUmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+KSksXG4gICAgICAgIHN0R2V0PHsgbXlJRDogc3RyaW5nIH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vc3RhdHVzXCIpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZSA9IGRldmljZXMuZmlsdGVyKGQgPT4gZC5kZXZpY2VJRCAhPT0gc3lzLm15SUQpO1xuICAgICAgY29uc3Qgcm93cyA9IGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZS5tYXAoYXN5bmMgZCA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBhd2FpdCBzdEdldDxTVENvbXBsZXRpb24+KGJhc2UsIGtleSwgYC9yZXN0L2RiL2NvbXBsZXRpb24/Zm9sZGVyPSR7ZmlkfSZkZXZpY2U9JHtkLmRldmljZUlEfWApXG4gICAgICAgICAgLmNhdGNoKCgpID0+ICh7IGNvbXBsZXRpb246IDAsIGdsb2JhbEl0ZW1zOiAwLCBuZWVkSXRlbXM6IDAsIG5lZWRCeXRlczogMCwgbmVlZERlbGV0ZXM6IDAgfSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGQubmFtZSB8fCBkLmRldmljZUlELnNsaWNlKDAsIDcpLFxuICAgICAgICAgIG9ubGluZTogISFjb25ucy5jb25uZWN0aW9uc1tkLmRldmljZUlEXT8uY29ubmVjdGVkLFxuICAgICAgICAgIGNvbXBsZXRpb246IGMuY29tcGxldGlvbixcbiAgICAgICAgICBnbG9iYWxJdGVtczogYy5nbG9iYWxJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRJdGVtczogYy5uZWVkSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkQnl0ZXM6IGMubmVlZEJ5dGVzLFxuICAgICAgICAgIG5lZWREZWxldGVzOiBjLm5lZWREZWxldGVzLFxuICAgICAgICAgIGxhc3RTZWVuOiBzdGF0c1tkLmRldmljZUlEXT8ubGFzdFNlZW4gPz8gXCJcIixcbiAgICAgICAgfTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5zeW5jRGF0YSA9IHtcbiAgICAgICAgc3RhdGU6IHN0YXR1cy5zdGF0ZSxcbiAgICAgICAgbmVlZEZpbGVzOiBzdGF0dXMubmVlZEZpbGVzLFxuICAgICAgICBuZWVkQnl0ZXM6IHN0YXR1cy5uZWVkQnl0ZXMsXG4gICAgICAgIGZvbGRlckxhYmVsOiBmb2xkZXIubGFiZWwgfHwgZm9sZGVyLmlkLFxuICAgICAgICBlcnJvcnM6IChzdGF0dXMuZXJyb3JzID8/IDApICsgKHN0YXR1cy5wdWxsRXJyb3JzID8/IDApLFxuICAgICAgICBkZXZpY2VzOiByb3dzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zeW5jRXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NZTkMpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXN5bmMtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiU0lOQ1JPTklaQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5zeW5jTG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciBlc3RhZG8gZG8gU3luY3RoaW5nXCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH07XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb25maWd1cmUgYSBVUkwgZSBhIEFQSSBrZXkgZG8gU3luY3RoaW5nIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQuXCIgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmNFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGZhbGFyIGNvbSBvIFN5bmN0aGluZzogJHt0aGlzLnN5bmNFcnJvcn1gIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3luY0ZldGNoZWRBdCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmNMb2FkaW5nKSB2b2lkIHRoaXMuZmV0Y2hTeW5jKGZhbHNlKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyU3luY0JvZHkoc2VjLCB0aGlzLnN5bmNEYXRhISk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDb25mbGljdHMoc2VjKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luY0JvZHkoc2VjOiBIVE1MRWxlbWVudCwgZDogU3luY0RhdGEpIHtcbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtYm94XCIgfSk7XG5cbiAgICAvLyBFc3RhZG8gZGEgcGFzdGEuXG4gICAgY29uc3QgYnVzeSA9IGQuc3RhdGUgPT09IFwic3luY2luZ1wiIHx8IGQuc3RhdGUgPT09IFwic2Nhbm5pbmdcIjtcbiAgICBjb25zdCBmbCA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1mb2xkZXJcIiB9KTtcbiAgICBjb25zdCBkb3QgPSBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGQuZXJyb3JzID8gXCJ3ZC1zLWVyclwiIDogYnVzeSA/IFwid2Qtcy1idXN5XCIgOiBcIndkLXMtb2tcIikgfSk7XG4gICAgZG90LnNldFRleHQoZC5lcnJvcnMgPyBcIlx1MjZBMFwiIDogYnVzeSA/IFwiXHUyN0YzXCIgOiBcIlx1MjVDRlwiKTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZm5hbWVcIiwgdGV4dDogZC5mb2xkZXJMYWJlbCB9KTtcbiAgICBjb25zdCBzdCA9IGQuc3RhdGUgPT09IFwiaWRsZVwiID8gXCJlbSBkaWFcIiA6IGQuc3RhdGUgPT09IFwic3luY2luZ1wiID8gYHNpbmNyb25pemFuZG8gXHUyMDE0ICR7ZC5uZWVkRmlsZXN9IGl0ZW5zICgke2h1bWFuQnl0ZXMoZC5uZWVkQnl0ZXMpfSlgIDogZC5zdGF0ZTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZnN0YXRlXCIsIHRleHQ6IHN0IH0pO1xuXG4gICAgLy8gQXBhcmVsaG9zLlxuICAgIGZvciAoY29uc3QgZGV2IG9mIGQuZGV2aWNlcykge1xuICAgICAgY29uc3Qgcm93ID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWRldlwiIH0pO1xuICAgICAgY29uc3QgbyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGRldi5vbmxpbmUgPyBcIndkLXMtb2tcIiA6IFwid2Qtcy1vZmZcIikgfSk7XG4gICAgICBvLnNldFRleHQoXCJcdTI1Q0ZcIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRuYW1lXCIsIHRleHQ6IGRldi5uYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY29tcFwiLCB0ZXh0OiBgJHtNYXRoLnJvdW5kKGRldi5jb21wbGV0aW9uKX0lYCB9KTtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzICYmIGRldi5nbG9iYWxJdGVtcylcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY291bnRcIiwgdGV4dDogYCR7ZGV2Lmdsb2JhbEl0ZW1zIC0gZGV2Lm5lZWRJdGVtc30vJHtkZXYuZ2xvYmFsSXRlbXN9YCB9KTtcbiAgICAgIGNvbnN0IGV4dHJhID0gZGV2Lm5lZWREZWxldGVzID8gYCR7ZGV2Lm5lZWREZWxldGVzfSBleGNsdXNcdTAwRjVlc2AgOiBkZXYubmVlZEJ5dGVzID8gaHVtYW5CeXRlcyhkZXYubmVlZEJ5dGVzKSA6IFwiXCI7XG4gICAgICBpZiAoZXh0cmEpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHBlbmRcIiwgdGV4dDogZXh0cmEgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRzZWVuXCIsIHRleHQ6IGRldi5vbmxpbmUgPyBcIm9ubGluZVwiIDogcmVsVGltZShkZXYubGFzdFNlZW4pIH0pO1xuICAgIH1cblxuICAgIGlmIChkLmVycm9ycykgYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWVycmxpbmVcIiwgdGV4dDogYFx1MjZBMCAke2QuZXJyb3JzfSBlcnJvKHMpIG5hIHBhc3RhYCB9KTtcbiAgfVxuXG4gIC8vIExpc3RhIGRlIGNcdTAwRjNwaWFzIGRlIGNvbmZsaXRvIGRvIFN5bmN0aGluZyAoYWJyaXIgLyBhcGFnYXIgY29tIGNvbmZpcm1hXHUwMEU3XHUwMEUzbykuXG4gIHByaXZhdGUgcmVuZGVyQ29uZmxpY3RzKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLmZpbHRlcihmID0+IGYubmFtZS5pbmNsdWRlcyhcIi5zeW5jLWNvbmZsaWN0LVwiKSk7XG4gICAgY29uc3Qgd3JhcCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jb25mbGljdHNcIiB9KTtcbiAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLXN1YlwiLCB0ZXh0OiBgQ29uZmxpdG9zICgke2NvbmZsaWN0cy5sZW5ndGh9KWAgfSk7XG4gICAgaWYgKCFjb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLW5vY29uZlwiLCB0ZXh0OiBcIk5lbmh1bSBjb25mbGl0by4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBjb25mbGljdHMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY3Jvd1wiIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25hbWVcIiwgdGV4dDogZi5uYW1lIH0pO1xuICAgICAgbmFtZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBcIiArIGYucGF0aCk7XG4gICAgICBuYW1lLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICBpZiAodGhpcy5jb25mbGljdENvbmZpcm0gPT09IGYucGF0aCkge1xuICAgICAgICBjb25zdCB5ZXMgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWN5ZXNcIiwgdGV4dDogXCJhcGFnYXI/XCIgfSk7XG4gICAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmLCBmYWxzZSk7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgICAgY29uc3Qgbm8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNub1wiLCB0ZXh0OiBcImNhbmNlbGFyXCIgfSk7XG4gICAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY2RlbFwiIH0pO1xuICAgICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpO1xuICAgICAgICBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiQXBhZ2FyIGNcdTAwRjNwaWEgZGUgY29uZmxpdG8gKHZhaSBwYXJhIGEgbGl4ZWlyYSlcIik7XG4gICAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IGYucGF0aDsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhZGVyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiU2Vjb25kIEJyYWluXCIgfSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEUsIGxlYWYgPT4gbmV3IERhc2hib2FyZFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFRPRE9JU1RfVklFV19UWVBFLCBsZWFmID0+IG5ldyBUb2RvaXN0VmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGF5b3V0LWRhc2hib2FyZFwiLCBcIkFicmlyIFdlcnVzIERhc2hib2FyZFwiLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGlzdC1jaGVja3NcIiwgXCJBYnJpciBUb2RvaXN0IChXZXJ1cylcIiwgKCkgPT4gdGhpcy5vcGVuVG9kb2lzdCgpKTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLWRhc2hib2FyZFwiLCBuYW1lOiBcIkFicmlyIERhc2hib2FyZFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuKCkgfSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi10b2RvaXN0XCIsIG5hbWU6IFwiQWJyaXIgVG9kb2lzdFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuVG9kb2lzdCgpIH0pO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgV2VydXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gIH1cblxuICAvLyBUb2RhcyBhcyB2aWV3cyAoZGFzaGJvYXJkICsgYWJhIFRvZG9pc3QpIGFiZXJ0YXMsIHF1ZSB0XHUwMEVBbSBjb250cm9sYWRvciBUb2RvaXN0LlxuICBwcml2YXRlIHRvZG9WaWV3cygpOiAoRGFzaGJvYXJkVmlldyB8IFRvZG9pc3RWaWV3KVtdIHtcbiAgICBjb25zdCBvdXQ6IChEYXNoYm9hcmRWaWV3IHwgVG9kb2lzdFZpZXcpW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgW1ZJRVdfVFlQRSwgVE9ET0lTVF9WSUVXX1RZUEVdKVxuICAgICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUodCkpIHtcbiAgICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEYXNoYm9hcmRWaWV3IHx8IHYgaW5zdGFuY2VvZiBUb2RvaXN0Vmlldykgb3V0LnB1c2godik7XG4gICAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIC8vIFJlLWJ1c2NhIG8gVG9kb2lzdCBlbSB0b2RhcyBhcyB2aWV3cyBhYmVydGFzIChleC46IGFwXHUwMEYzcyBtdWRhciBvIHRva2VuKS5cbiAgcmVmcmVzaERhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCB2IG9mIHRoaXMudG9kb1ZpZXdzKCkpIHYudG9kby5yZXNldCgpO1xuICB9XG5cbiAgLy8gUmVzZXRhIG8gZXN0YWRvIGRvIFN5bmN0aGluZyBuYXMgZGFzaGJvYXJkcyAoZXguOiB0b2tlbi9VUkwgYWx0ZXJhZG9zKS5cbiAgcmVmcmVzaFN5bmMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFN5bmMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZS1yZW5kZXJpemEgdG9kYXMgYXMgdmlld3MgYWJlcnRhcyAoYXBcdTAwRjNzIG11ZGFyIGNvbmZpZyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXM6IG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcywgcGFjb3RlcykuXG4gIHJlcmVuZGVyRGFzaGJvYXJkcygpIHtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdGhpcy50b2RvVmlld3MoKSkgdi5yZWZyZXNoKCk7XG4gIH1cblxuICAvLyBNb3N0cmEvb2N1bHRhIHVtYSBzZVx1MDBFN1x1MDBFM28gKFwic2VjOjxpZD5cIikgb3UgcGFzdGEgKGNhbWluaG8pIHBvciBjaGF2ZSBlbSBgaGlkZGVuYC5cbiAgYXN5bmMgc2V0SGlkZGVuKGtleTogc3RyaW5nLCBoaWRkZW46IGJvb2xlYW4pIHtcbiAgICBjb25zdCBoYXMgPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICAgIGlmIChoaWRkZW4gJiYgIWhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIGVsc2UgaWYgKCFoaWRkZW4gJiYgaGFzKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMuc2V0dGluZ3MuaGlkZGVuLmZpbHRlcihrID0+IGsgIT09IGtleSk7XG4gICAgZWxzZSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgLy8gUmVvcmRlbmEgdW1hIHNlXHUwMEU3XHUwMEUzbyBlbSBzZWN0aW9uT3JkZXIgKGRpciA9IC0xIHNvYmUsICsxIGRlc2NlKS5cbiAgYXN5bmMgbW92ZVNlY3Rpb24oaWQ6IFNlY3Rpb25JZCwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBvcmRlciA9IFsuLi50aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBvcmRlcjtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gICAgLy8gU2FuZWFtZW50bzogc2VjdGlvbk9yZGVyIGNvbSBleGF0YW1lbnRlIGFzIHNlXHUwMEU3XHUwMEY1ZXMgdlx1MDBFMWxpZGFzLCBzZW0gZHVwbGljYXRhcy5cbiAgICBjb25zdCB2YWxpZDogU2VjdGlvbklkW10gPSBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxTZWN0aW9uSWQ+KCk7XG4gICAgY29uc3QgY2xlYW5lZCA9ICh0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciB8fCBbXSkuZmlsdGVyKFxuICAgICAgKHMpOiBzIGlzIFNlY3Rpb25JZCA9PiB2YWxpZC5pbmNsdWRlcyhzIGFzIFNlY3Rpb25JZCkgJiYgIXNlZW4uaGFzKHMgYXMgU2VjdGlvbklkKSAmJiAoc2Vlbi5hZGQocyBhcyBTZWN0aW9uSWQpLCB0cnVlKVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbGlkKSBpZiAoIXNlZW4uaGFzKHYpKSBjbGVhbmVkLnB1c2godik7XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBjbGVhbmVkOyAgIC8vIFwicmVwb3J0c1wiIHNvbWUgYXF1aSBzZSBlc3RhdmEgbnVtYSBjb25maWcgYW50aWdhXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2V0dGluZ3MuaGlkZGVuKSkgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSBbXTtcbiAgICAvLyBGb250ZXMgZGEgU2VtYW5hICh2MC4xMC4xKTogdmFsaWRhIGEgbGlzdGE7IHNlIGF1c2VudGUvaW52XHUwMEUxbGlkYSwgdXNhIG8gZGVmYXVsdC5cbiAgICBjb25zdCBjcyA9IHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHRoaXMuc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzID0gQXJyYXkuaXNBcnJheShjcykgJiYgY3MubGVuZ3RoXG4gICAgICA/IGNzLmZpbHRlcihzID0+IHMgJiYgdHlwZW9mIHMucGF0aCA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAubWFwKHMgPT4gKHsgcGF0aDogcy5wYXRoLCBjb2xvcjogdHlwZW9mIHMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBzLmNvbG9yIDogQUNDRU5UU1swXSwgb246IHMub24gIT09IGZhbHNlIH0pKVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLmNhbGVuZGFyU291cmNlcy5tYXAocyA9PiAoeyAuLi5zIH0pKTtcbiAgICAvLyBTYW5lYW1lbnRvIFRvZG9pc3QgKHYwLjcuMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICAgIGNvbnN0IHRmID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzID0ge1xuICAgICAgcHJvamVjdHM6IEFycmF5LmlzQXJyYXkodGY/LnByb2plY3RzKSA/IHRmLnByb2plY3RzIDogW10sXG4gICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkodGY/LmxhYmVscykgPyB0Zi5sYWJlbHMgOiBbXSxcbiAgICB9O1xuICAgIC8vIEV4aWJpXHUwMEU3XHUwMEUzbyBuYXMgbGluaGFzICh2MC44LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgIT09IGZhbHNlO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID09PSB0cnVlO1xuICAgIC8vIFN5bmN0aGluZyAodjAuMTAuMCkuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCAhPT0gXCJzdHJpbmdcIiB8fCAhdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwudHJpbSgpKVxuICAgICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgIGlmICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgIT09IFwic3RyaW5nXCIpIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gXCJcIjtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgIT09IFwic3RyaW5nXCIpIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSBcIlwiO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9PT0gdHJ1ZTtcbiAgICAvLyBQYWNvdGVzIGRlIHRhcmVmYXMgKHYwLjEyLjApLlxuICAgIGNvbnN0IHRwID0gdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXMgPSBBcnJheS5pc0FycmF5KHRwKVxuICAgICAgPyB0cC5maWx0ZXIocCA9PiBwICYmIHR5cGVvZiBwLmlkID09PSBcInN0cmluZ1wiKS5tYXAocCA9PiAoe1xuICAgICAgICAgIGlkOiBwLmlkLFxuICAgICAgICAgIG5hbWU6IHR5cGVvZiBwLm5hbWUgPT09IFwic3RyaW5nXCIgPyBwLm5hbWUgOiBcIlwiLFxuICAgICAgICAgIGljb246IHR5cGVvZiBwLmljb24gPT09IFwic3RyaW5nXCIgJiYgcC5pY29uLnRyaW0oKSA/IHAuaWNvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB0YXNrczogQXJyYXkuaXNBcnJheShwLnRhc2tzKSA/IHAudGFza3MuZmlsdGVyKHggPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIpIDogW10sXG4gICAgICAgICAgcHJvamVjdElkOiB0eXBlb2YgcC5wcm9qZWN0SWQgPT09IFwic3RyaW5nXCIgJiYgcC5wcm9qZWN0SWQgPyBwLnByb2plY3RJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkocC5sYWJlbHMpID8gcC5sYWJlbHMuZmlsdGVyKHggPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIpIDogdW5kZWZpbmVkLFxuICAgICAgICB9KSlcbiAgICAgIDogW107XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7IGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7IH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgb3BlblRvZG9pc3QoKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShUT0RPSVNUX1ZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVE9ET0lTVF9WSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlZGljYWRhIGRvIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBIdWIgZG8gVG9kb2lzdCBuYSBcdTAwRTFyZWEgY2VudHJhbCAoblx1MDBFM28gXHUwMEU5IHNpZGViYXIpOiBsYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgKyBhIG1lc21hXG4vLyBsaXN0YSBkZSB0YXJlZmFzIGRvIGRhc2hib2FyZCAodmlhIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pLlxuY2xhc3MgVG9kb2lzdFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHJlYWRvbmx5IHRvZG86IFRvZG9pc3RDb250cm9sbGVyO1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICAgIHRoaXMudG9kbyA9IG5ldyBUb2RvaXN0Q29udHJvbGxlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4sIHRoaXMsICgpID0+IHRoaXMucmVmcmVzaCgpKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVE9ET0lTVF9WSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIlRvZG9pc3RcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGlzdC1jaGVja3NcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHsgdGhpcy5yZWZyZXNoKCk7IH1cbiAgYXN5bmMgb25DbG9zZSgpIHsgdGhpcy50b2RvLmhpZGVUaXAoKTsgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiLCBcIndkLXRvZG9pc3Qtdmlld1wiKTtcblxuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIlRvZG9pc3RcIiB9KTtcblxuICAgIHRoaXMucmVuZGVyUGFja2FnZXMocm9vdCk7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy50b2RvLnJlbmRlckxpc3Qoc2VjLCBjdHJscyk7XG4gIH1cblxuICAvLyBCYXJyYSBkZSBsYW5cdTAwRTdhZG9yZXM6IHVtIGJvdFx1MDBFM28gcG9yIHBhY290ZSBcdTIxOTIgY3JpYSBhcyB0YXJlZmFzIG5vIFRvZG9pc3QgKGhvamUpLlxuICBwcml2YXRlIHJlbmRlclBhY2thZ2VzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcGtncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJQQUNPVEVTXCIgfSk7XG5cbiAgICBpZiAoIXBrZ3MubGVuZ3RoKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ3JpZSBwYWNvdGVzIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgXHUyMTkyIFBhY290ZXMgZGUgdGFyZWZhcy5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgY29uc3QgYmFyID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctYmFyXCIgfSk7XG4gICAgZm9yIChjb25zdCBwa2cgb2YgcGtncykge1xuICAgICAgY29uc3QgdmFsaWQgPSBwa2cudGFza3MuZmlsdGVyKHMgPT4gcy50cmltKCkpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGRpc2FibGVkID0gIXRva2VuIHx8ICF2YWxpZDtcbiAgICAgIGNvbnN0IGJ0biA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJ0blwiICsgKGRpc2FibGVkID8gXCIgd2QtcGtnLWRpc2FibGVkXCIgOiBcIlwiKSB9KTtcbiAgICAgIGlmIChwa2cuaWNvbikgcmVuZGVySWNvbihidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvXCIgfSksIHBrZy5pY29uKTtcbiAgICAgIGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1uYW1lXCIsIHRleHQ6IHBrZy5uYW1lIHx8IFwiKHNlbSBub21lKVwiIH0pO1xuICAgICAgYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IFN0cmluZyh2YWxpZCkgfSk7XG4gICAgICBidG4uc2V0QXR0cihcInRpdGxlXCIsICF0b2tlbiA/IFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdFwiIDogIXZhbGlkID8gXCJQYWNvdGUgc2VtIHRhcmVmYXNcIiA6IGBMYW5cdTAwRTdhciAke3ZhbGlkfSB0YXJlZmEocykgbm8gVG9kb2lzdCAoaG9qZSlgKTtcbiAgICAgIGlmICghZGlzYWJsZWQpIGJ0bi5vbmNsaWNrID0gKCkgPT4gdm9pZCB0aGlzLnRvZG8ubGF1bmNoUGFja2FnZShwa2cpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUG9wLXVwIGRlIGRldGFsaGVzIGRhIHRhcmVmYSAoc1x1MDBGMyBsZWl0dXJhOyBib3RcdTAwRTNvIEVkaXRhciBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvKSBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tEZXRhaWxPcHRzIHtcbiAgdGFzazogVG9kb2lzdFRhc2s7XG4gIHByb2plY3ROYW1lPzogc3RyaW5nO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGVkaXQ6ICgpID0+IHZvaWQ7XG4gIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRGV0YWlsTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LCBwcml2YXRlIG9wdHM6IFRhc2tEZXRhaWxPcHRzKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgdCA9IHRoaXMub3B0cy50YXNrO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLW1vZGFsXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0LmNvbnRlbnQpO1xuXG4gICAgY29uc3QgbWV0YSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGBcdUQ4M0RcdURDQzUgJHtkfS8ke219LyR7eX0ke3QuZHVlPy5pc19yZWN1cnJpbmcgPyBcIiBcdTI3RjNcIiA6IFwiXCJ9YCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0cy5wcm9qZWN0TmFtZSkgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYCMgJHt0aGlzLm9wdHMucHJvamVjdE5hbWV9YCB9KTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcCB3ZC10ZC1sYWJlbFwiIH0pO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgdm9pZCBNYXJrZG93blJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcCwgdC5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIC8vIEVkaXRhciAoZXNxdWVyZGEpIFx1MDBCNyBDb25jbHVpciArIEFicmlyIG5vIFRvZG9pc3QgKGRpcmVpdGEpLlxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IGVkaXQgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MEUgRWRpdGFyXCIgfSk7XG4gICAgZWRpdC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHRoaXMub3B0cy5lZGl0KCk7IH07XG4gICAgYWN0aW9ucy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgZG9uZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcxMyBDb25jbHVpclwiIH0pO1xuICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICBjb25zdCBvcGVuID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQWJyaXIgbm8gVG9kb2lzdFwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodCksIFwiX2JsYW5rXCIpO1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgLyBlZGl0YXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0Zvcm1WYWx1ZXMge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJIDEuLjQgKDQgPSBwMSlcbiAgZHVlRGF0ZTogc3RyaW5nOyAgICAvLyBZWVlZLU1NLUREIChjYWxlbmRcdTAwRTFyaW8pOyBcIlwiID0gc2VtIGRhdGFcbiAgcHJvamVjdElkOiBzdHJpbmc7XG4gIGxhYmVsczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBUYXNrRm9ybU9wdHMge1xuICBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7XG4gIHRhc2s/OiBUb2RvaXN0VGFzaztcbiAgcHJlZmlsbER1ZT86IHN0cmluZztcbiAgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W107XG4gIGxhYmVsczogc3RyaW5nW107XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgc3VibWl0OiAodjogVGFza0Zvcm1WYWx1ZXMpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIHJlbW92ZT86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0Zvcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSB2OiBUYXNrRm9ybVZhbHVlcztcbiAgcHJpdmF0ZSBrbm93bkxhYmVsczogc3RyaW5nW107XG4gIHByaXZhdGUgY29uZmlybURlbCA9IGZhbHNlO1xuICBwcml2YXRlIGFjdGlvbnNFbCE6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IFRhc2tGb3JtT3B0cykge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgdCA9IG9wdHMudGFzaztcbiAgICAvLyBQcmVmaWxsIGRlIGNyaWFcdTAwRTdcdTAwRTNvOiBcImhvamVcIiBcdTIxOTIgZGF0YSBkZSBob2plOyBqXHUwMEUxLVlZWVktTU0tREQgcGFzc2EgZGlyZXRvOyByZXN0byBpZ25vcmEuXG4gICAgY29uc3QgcHJlID0gb3B0cy5wcmVmaWxsRHVlO1xuICAgIGNvbnN0IHByZWZpbGxEYXRlID0gcHJlID09PSBcImhvamVcIiA/IHRvS2V5KG5ldyBEYXRlKCkpXG4gICAgICA6IChwcmUgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocHJlKSA/IHByZSA6IFwiXCIpO1xuICAgIHRoaXMudiA9IHtcbiAgICAgIGNvbnRlbnQ6IHQ/LmNvbnRlbnQgPz8gXCJcIixcbiAgICAgIGRlc2NyaXB0aW9uOiB0Py5kZXNjcmlwdGlvbiA/PyBcIlwiLFxuICAgICAgcHJpb3JpdHk6IHQ/LnByaW9yaXR5ID8/IDEsXG4gICAgICBkdWVEYXRlOiB0Py5kdWU/LmRhdGUgPyB0LmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBwcmVmaWxsRGF0ZSxcbiAgICAgIHByb2plY3RJZDogdD8ucHJvamVjdF9pZCA/PyBcIlwiLFxuICAgICAgbGFiZWxzOiAodD8ubGFiZWxzID8/IFtdKS5zbGljZSgpLFxuICAgIH07XG4gICAgdGhpcy5rbm93bkxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5vcHRzLmxhYmVscywgLi4udGhpcy52LmxhYmVsc10pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLWZvcm1cIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHRoaXMub3B0cy5tb2RlID09PSBcImNyZWF0ZVwiID8gXCJOb3ZhIHRhcmVmYVwiIDogXCJFZGl0YXIgdGFyZWZhXCIpO1xuXG4gICAgLy8gU1x1MDBGMyBuYSBlZGlcdTAwRTdcdTAwRTNvOiBhdGFsaG8gXCJBYnJpciBubyBUb2RvaXN0XCIgbm8gdG9wbywgYW8gbGFkbyBkbyBYIGRlIGZlY2hhci5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiICYmIHRoaXMub3B0cy50YXNrKSB7XG4gICAgICBjb25zdCBvcGVuID0gbW9kYWxFbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1vcGVuLXRvcFwiLCB0ZXh0OiBcIlx1MjE5NyBUb2RvaXN0XCIgfSk7XG4gICAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIG5vIFRvZG9pc3RcIik7XG4gICAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHRoaXMub3B0cy50YXNrISksIFwiX2JsYW5rXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZmllbGQoXCJUXHUwMEVEdHVsb1wiKTtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgY29udGVudC52YWx1ZSA9IHRoaXMudi5jb250ZW50O1xuICAgIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBcIk8gcXVlIHByZWNpc2Egc2VyIGZlaXRvP1wiO1xuICAgIGNvbnRlbnQub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmNvbnRlbnQgPSBjb250ZW50LnZhbHVlOyB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGVudC5mb2N1cygpLCAwKTtcblxuICAgIHRoaXMuZmllbGQoXCJEZXNjcmlcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNvbnN0IGRlc2MgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC10Zi10ZXh0YXJlYVwiIH0pO1xuICAgIGRlc2MudmFsdWUgPSB0aGlzLnYuZGVzY3JpcHRpb247XG4gICAgZGVzYy5wbGFjZWhvbGRlciA9IFwiRGV0YWxoZXMgLyBpbnN0cnVcdTAwRTdcdTAwRjVlcyAobWFya2Rvd24pXCI7XG4gICAgZGVzYy5yb3dzID0gMztcbiAgICBkZXNjLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kZXNjcmlwdGlvbiA9IGRlc2MudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJpb3JpZGFkZVwiKTtcbiAgICBjb25zdCBwcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1wcmktcm93XCIgfSk7XG4gICAgY29uc3QgcmVuZGVyUHJpID0gKCkgPT4ge1xuICAgICAgcHJvdy5lbXB0eSgpO1xuICAgICAgZm9yIChjb25zdCBhcGkgb2YgWzQsIDMsIDIsIDFdKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBUT0RPSVNUX1BSSVthcGldO1xuICAgICAgICBjb25zdCBiID0gcHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLXByaVwiICsgKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgICBiLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgbWV0YS5jb2xvcik7XG4gICAgICAgIGIub25jbGljayA9ICgpID0+IHsgdGhpcy52LnByaW9yaXR5ID0gYXBpOyByZW5kZXJQcmkoKTsgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlclByaSgpO1xuXG4gICAgdGhpcy5maWVsZChcIkRhdGFcIik7XG4gICAgY29uc3QgZHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtZHVlLXJvd1wiIH0pO1xuICAgIGNvbnN0IGR1ZSA9IGRyb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC10Zi1pbnB1dCB3ZC10Zi1kYXRlXCIsIHR5cGU6IFwiZGF0ZVwiIH0pO1xuICAgIGR1ZS52YWx1ZSA9IHRoaXMudi5kdWVEYXRlO1xuICAgIGR1ZS5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBkdWUudmFsdWU7IH07XG4gICAgY29uc3QgY2xyID0gZHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1kdWUtY2xlYXJcIiwgdGV4dDogXCJzZW0gZGF0YVwiIH0pO1xuICAgIGNsci5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IFwiXCI7IGR1ZS52YWx1ZSA9IFwiXCI7IH07XG4gICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ2xpcXVlIHBhcmEgYWJyaXIgbyBjYWxlbmRcdTAwRTFyaW8uIFZhemlvID0gc2VtIGRhdGEuXCIgfSk7XG4gICAgaWYgKHRoaXMub3B0cy50YXNrPy5kdWU/LmlzX3JlY3VycmluZylcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtd2FyblwiLCB0ZXh0OiBcIlx1MjdGMyBUYXJlZmEgcmVjb3JyZW50ZSBcdTIwMTQgbXVkYXIgYSBkYXRhIGZpeGEgcG9kZSBlbmNlcnJhciBhIHJlY29yclx1MDBFQW5jaWEuXCIgfSk7XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJvamV0b1wiKTtcbiAgICBjb25zdCBzZWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtdGYtc2VsZWN0XCIgfSk7XG4gICAgY29uc3QgaW5ib3ggPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBcIkVudHJhZGEgKEluYm94KVwiLCB2YWx1ZTogXCJcIiB9KTtcbiAgICBpZiAoIXRoaXMudi5wcm9qZWN0SWQpIGluYm94LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5vcHRzLnByb2plY3RzKSB7XG4gICAgICBjb25zdCBvID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogcC5uYW1lLCB2YWx1ZTogcC5pZCB9KTtcbiAgICAgIGlmIChwLmlkID09PSB0aGlzLnYucHJvamVjdElkKSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc2VsLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYucHJvamVjdElkID0gc2VsLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIkV0aXF1ZXRhc1wiKTtcbiAgICBjb25zdCBsd3JhcCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxzXCIgfSk7XG4gICAgaWYgKHRoaXMua25vd25MYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCByZW5kZXJMYWJlbHMgPSAoKSA9PiB7XG4gICAgICAgIGx3cmFwLmVtcHR5KCk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmtub3duTGFiZWxzKSB7XG4gICAgICAgICAgY29uc3Qgb24gPSB0aGlzLnYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsd3JhcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMudi5sYWJlbHMuaW5kZXhPZihsKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHRoaXMudi5sYWJlbHMuc3BsaWNlKGksIDEpOyBlbHNlIHRoaXMudi5sYWJlbHMucHVzaChsKTtcbiAgICAgICAgICAgIHJlbmRlckxhYmVscygpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QgYWluZGEuXCIgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3Rpb25zRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICB0aGlzLnJlbmRlckFjdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZmllbGQobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQWN0aW9ucygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5hY3Rpb25zRWw7XG4gICAgYS5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlybURlbCAmJiB0aGlzLm9wdHMucmVtb3ZlKSB7XG4gICAgICBhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtY29uZmlybVwiLCB0ZXh0OiBcIkV4Y2x1aXIgZXN0YSB0YXJlZmE/XCIgfSk7XG4gICAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICAgIGNvbnN0IHllcyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICB5ZXMub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgeWVzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5yZW1vdmUhKCkpIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiKSB7XG4gICAgICBjb25zdCBkZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgZGVsLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IHRydWU7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgIH1cblxuICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGNhbmNlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgY2FuY2VsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgc2F2ZSA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlNhbHZhclwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIHNhdmUub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMudi5jb250ZW50ID0gdGhpcy52LmNvbnRlbnQudHJpbSgpO1xuICAgICAgaWYgKCF0aGlzLnYuY29udGVudCkgeyBuZXcgTm90aWNlKFwiRFx1MDBFQSB1bSB0XHUwMEVEdHVsbyBcdTAwRTAgdGFyZWZhLlwiKTsgcmV0dXJuOyB9XG4gICAgICBzYXZlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMuc3VibWl0KHRoaXMudikpIHRoaXMuY2xvc2UoKTtcbiAgICAgIGVsc2Ugc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICBvbkNsb3NlKCkgeyB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpOyB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGUgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIFdlcnVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAvLyBQcm9qZXRvcyBkbyBUb2RvaXN0IChwYXJhIG9zIGRyb3Bkb3ducyBkb3MgcGFjb3RlcykuIEJ1c2NhZG9zIDF4OyBxdWFuZG9cbiAgLy8gY2hlZ2FtLCByZS1yZW5kZXJpemEgYSBhYmEgcGFyYSBwcmVlbmNoZXIgb3Mgc2VsZWN0cy5cbiAgcHJpdmF0ZSBwcm9qZWN0czogVG9kb2lzdFByb2plY3RbXSB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHsgc3VwZXIoYXBwLCBwbHVnaW4pOyB9XG5cbiAgZGlzcGxheSgpIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRXhpYmlcdTAwRTdcdTAwRTNvIGRvIGRhc2hib2FyZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJFeGliaVx1MDBFN1x1MDBFM28gZG8gZGFzaGJvYXJkXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9kbyBjb21wYWN0b1wiKVxuICAgICAgLnNldERlc2MoXCJMYXlvdXQgbWFpcyBkZW5zbywgY29tIG1lbm9zIGVzcGFcdTAwRTdhbWVudG8gZW50cmUgb3MgZWxlbWVudG9zLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNvbXBhY3QgPSB2O1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTZVx1MDBFN1x1MDBGNWVzIGRvIGRhc2hib2FyZCAodmlzaWJpbGlkYWRlICsgb3JkZW0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNlXHUwMEU3XHUwMEY1ZXMgZG8gZGFzaGJvYXJkXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiQXRpdmUvZGVzYXRpdmUgY2FkYSBzZVx1MDBFN1x1MDBFM28gZSBhanVzdGUgYSBvcmRlbSBlbSBxdWUgYXBhcmVjZW0gbmEgZGFzaGJvYXJkLlwiLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3JkZXIgPSBwbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyO1xuICAgIG9yZGVyLmZvckVhY2goKGlkLCBpKSA9PiB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoU0VDVElPTl9MQUJFTFtpZF0pXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcImFycm93LXVwXCIpLnNldFRvb2x0aXAoXCJNb3ZlciBwYXJhIGNpbWFcIikuc2V0RGlzYWJsZWQoaSA9PT0gMClcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlU2VjdGlvbihpZCwgLTEpOyB0aGlzLmRpc3BsYXkoKTsgfSkpXG4gICAgICAgIC5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgICAuc2V0SWNvbihcImFycm93LWRvd25cIikuc2V0VG9vbHRpcChcIk1vdmVyIHBhcmEgYmFpeG9cIikuc2V0RGlzYWJsZWQoaSA9PT0gb3JkZXIubGVuZ3RoIC0gMSlcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlU2VjdGlvbihpZCwgKzEpOyB0aGlzLmRpc3BsYXkoKTsgfSkpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJWaXNcdTAwRUR2ZWxcIilcbiAgICAgICAgICAuc2V0VmFsdWUoIXBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoXCJzZWM6XCIgKyBpZCkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBhd2FpdCBwbHVnaW4uc2V0SGlkZGVuKFwic2VjOlwiICsgaWQsICF2KTsgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhc3RhcyBleGliaWRhcyAoY2FyZHMgZG8gQ29mcmUpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlBhc3RhcyBleGliaWRhcyAoY2FyZHMgZG8gQ29mcmUpXCIgfSk7XG4gICAgY29uc3QgdG9wRm9sZGVycyA9ICh0aGlzLmFwcC52YXVsdC5nZXRSb290KCkuY2hpbGRyZW5cbiAgICAgIC5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlciAmJiAhYy5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSBhcyBURm9sZGVyW10pXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgICBpZiAoIXRvcEZvbGRlcnMubGVuZ3RoKSB7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSBkZSB0b3BvIG5vIGNvZnJlLlwiIH0pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGYgb2YgdG9wRm9sZGVycykge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKGYubmFtZSlcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIlZpc1x1MDBFRHZlbFwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSghcGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhmLnBhdGgpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgYXdhaXQgcGx1Z2luLnNldEhpZGRlbihmLnBhdGgsICF2KTsgfSkpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBGb250ZXMgZGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJGb250ZXMgZG9zIFJlbGF0XHUwMEYzcmlvc1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIlBhc3RhcyBjdWphcyBub3RhcyB2aXJhbSBjYXJkcyBub3MgZGlhcyBkYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zIChwb3NpXHUwMEU3XHUwMEUzbyBwZWxhIGRhdGEgZGEgbm90YSkuIENhZGEgZm9udGUgdGVtIHVtYSBjb3IgcHJcdTAwRjNwcmlhLlwiLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3JjcyA9IHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXM7XG4gICAgc3Jjcy5mb3JFYWNoKHMgPT4ge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKHMucGF0aClcbiAgICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgICAuc2V0VG9vbHRpcChcIkF0aXZhXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHMub24pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBzLm9uID0gdjsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0pKVxuICAgICAgICAuYWRkQ29sb3JQaWNrZXIoYyA9PiBjXG4gICAgICAgICAgLnNldFZhbHVlKHMuY29sb3IpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4geyBzLmNvbG9yID0gdjsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0pKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJ0cmFzaC0yXCIpLnNldFRvb2x0aXAoXCJSZW1vdmVyIGZvbnRlXCIpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IHNyY3MuZmlsdGVyKHggPT4geCAhPT0gcyk7XG4gICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCB1c2VkID0gbmV3IFNldChzcmNzLm1hcChzID0+IHMucGF0aCkpO1xuICAgIGNvbnN0IGF2YWlsYWJsZSA9IGFsbEZvbGRlclBhdGhzKHRoaXMuYXBwKS5maWx0ZXIocCA9PiAhdXNlZC5oYXMocCkpO1xuICAgIGlmIChhdmFpbGFibGUubGVuZ3RoKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJBZGljaW9uYXIgZm9udGVcIilcbiAgICAgICAgLnNldERlc2MoXCJFc2NvbGhhIHVtYSBwYXN0YSBkbyBjb2ZyZSBwYXJhIGFsaW1lbnRhciBhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MuXCIpXG4gICAgICAgIC5hZGREcm9wZG93bihkID0+IHtcbiAgICAgICAgICBkLmFkZE9wdGlvbihcIlwiLCBcIkVzY29saGEgdW1hIHBhc3RhXHUyMDI2XCIpO1xuICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBhdmFpbGFibGUpIGQuYWRkT3B0aW9uKHAsIHApO1xuICAgICAgICAgIGQub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICBpZiAoIXYpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gQUNDRU5UU1twbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmxlbmd0aCAlIEFDQ0VOVFMubGVuZ3RoXTtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMucHVzaCh7IHBhdGg6IHYsIGNvbG9yLCBvbjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUGFjb3RlcyBkZSB0YXJlZmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlBhY290ZXMgZGUgdGFyZWZhc1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkNvbmp1bnRvcyBkZSB0YXJlZmFzIHF1ZSB2b2NcdTAwRUEgbGFuXHUwMEU3YSBubyBUb2RvaXN0IGNvbSB1bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS4gVW1hIHRhcmVmYSBwb3IgbGluaGEuXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIC8vIEJ1c2NhIG9zIHByb2pldG9zIHVtYSB2ZXogKHBhcmEgb3MgZHJvcGRvd25zKTsgYW8gY2hlZ2FyLCByZS1yZW5kZXJpemEuXG4gICAgaWYgKHRva2VuICYmIHRoaXMucHJvamVjdHMgPT09IG51bGwpIHtcbiAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS50aGVuKHBzID0+IHsgdGhpcy5wcm9qZWN0cyA9IHBzOyB0aGlzLmRpc3BsYXkoKTsgfSkuY2F0Y2goKCkgPT4geyB0aGlzLnByb2plY3RzID0gW107IH0pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGtnIG9mIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMpIHtcbiAgICAgIGNvbnN0IHMgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0Q2xhc3MoXCJ3ZC1wa2ctc2V0dGluZ1wiKTtcbiAgICAgIHMuYWRkVGV4dCh0ID0+IHRcbiAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiTm9tZSBkbyBwYWNvdGVcIilcbiAgICAgICAgLnNldFZhbHVlKHBrZy5uYW1lKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHBrZy5uYW1lID0gdjsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0pKTtcbiAgICAgIHMuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcIlx1MDBFRGNvbmUgKGx1Y2lkZS9lbW9qaSlcIilcbiAgICAgICAgICAuc2V0VmFsdWUocGtnLmljb24gPz8gXCJcIilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHBrZy5pY29uID0gdi50cmltKCkgfHwgdW5kZWZpbmVkOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiOWVtXCI7XG4gICAgICB9KTtcbiAgICAgIHMuYWRkRHJvcGRvd24oZCA9PiB7XG4gICAgICAgIGQuYWRkT3B0aW9uKFwiXCIsIFwiRW50cmFkYSAoSW5ib3gpXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgKHRoaXMucHJvamVjdHMgPz8gW10pKSBkLmFkZE9wdGlvbihwLmlkLCBwLm5hbWUpO1xuICAgICAgICBkLnNldFZhbHVlKHBrZy5wcm9qZWN0SWQgPz8gXCJcIik7XG4gICAgICAgIGQub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHBrZy5wcm9qZWN0SWQgPSB2IHx8IHVuZGVmaW5lZDsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KTtcbiAgICAgIH0pO1xuICAgICAgcy5hZGRFeHRyYUJ1dHRvbihiID0+IGJcbiAgICAgICAgLnNldEljb24oXCJ0cmFzaC0yXCIpLnNldFRvb2x0aXAoXCJSZW1vdmVyIHBhY290ZVwiKVxuICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcyA9IHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMuZmlsdGVyKHggPT4geCAhPT0gcGtnKTtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KSk7XG4gICAgICBjb25zdCB0YSA9IGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtcGtnLXRhc2tzXCIgfSk7XG4gICAgICB0YS52YWx1ZSA9IHBrZy50YXNrcy5qb2luKFwiXFxuXCIpO1xuICAgICAgdGEucGxhY2Vob2xkZXIgPSBcIlVtYSB0YXJlZmEgcG9yIGxpbmhhIChleC46IEJlYmVyIFx1MDBFMWd1YSlcIjtcbiAgICAgIHRhLnJvd3MgPSA0O1xuICAgICAgdGEuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIHBrZy50YXNrcyA9IHRhLnZhbHVlLnNwbGl0KFwiXFxuXCIpLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFkaWNpb25hciBwYWNvdGVcIilcbiAgICAgIC5hZGRCdXR0b24oYiA9PiBiXG4gICAgICAgIC5zZXRCdXR0b25UZXh0KFwiKyBOb3ZvIHBhY290ZVwiKVxuICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcy5wdXNoKHsgaWQ6IHVpZCgpLCBuYW1lOiBcIk5vdm8gcGFjb3RlXCIsIHRhc2tzOiBbXSB9KTtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJUb2tlbiBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiVG9kb2lzdCBcdTIxOTIgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIEludGVncmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgVG9rZW4gZGUgQVBJIGRvIGRlc2Vudm9sdmVkb3IuIFNhbHZvIGxvY2FsbWVudGUgZW0gZGF0YS5qc29uIChuXHUwMEUzbyB2YWkgcGFyYSBvIEdpdCkuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImNvbGUgbyB0b2tlbiBhcXVpXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4gPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJFeGliaVx1MDBFN1x1MDBFM28gZGFzIHRhcmVmYXNcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIG8gcHJvamV0byBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIG8gbm9tZSBkbyBwcm9qZXRvIGFvIGxhZG8gZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBhcyBAZXRpcXVldGFzIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNpbmNyb25pemFcdTAwRTdcdTAwRTNvIChTeW5jdGhpbmcpXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVVJMIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJFbmRlcmVcdTAwRTdvIGRvIFN5bmN0aGluZy4gUGFkclx1MDBFM286IGh0dHA6Ly8xMjcuMC4wLjE6ODM4NCAoYSBpbnN0XHUwMEUybmNpYSBsb2NhbCkuIE5vIGNlbHVsYXIsIGFwb250ZSBwYXJhIGEgQVBJIGRlIG91dHJhIG1cdTAwRTFxdWluYSBuYSByZWRlIHNlIGEgbG9jYWwgblx1MDBFM28gcmVzcG9uZGVyLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IHYudHJpbSgpIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQVBJIGtleVwiKVxuICAgICAgLnNldERlc2MoXCJTeW5jdGhpbmcgXHUyMTkyIEFjdGlvbnMgXHUyMTkyIFNldHRpbmdzIFx1MjE5MiBBUEkgS2V5LiBTYWx2YSBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIGEgQVBJIGtleVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIklEIGRhIHBhc3RhIChvcGNpb25hbClcIilcbiAgICAgIC5zZXREZXNjKFwiRm9sZGVyIElEIGRvIGNvZnJlIG5vIFN5bmN0aGluZy4gVmF6aW8gPSB1c2EgYSBwcmltZWlyYSBwYXN0YSBhdXRvbWF0aWNhbWVudGUuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImV4LjogbnVucXYtbXRpbW5cIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGNvbnRhZ2VtIGRlIGl0ZW5zIHBvciBhcGFyZWxob1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBcXFwic2luY3Jvbml6YWRvcyAvIHRvdGFsXFxcIiBkZSBpdGVucyBlbSBjYWRhIGFwYXJlbGhvLCBhbFx1MDBFOW0gZGEgcG9yY2VudGFnZW0uXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgIH0pKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQTJLO0FBRTNLLElBQU0sWUFBWTtBQUNs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UyxPQUFNLE1BQUs7QUFDbkIsV0FBSyxPQUFPLFNBQVMsb0JBQW9CO0FBQ3pDLFlBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsV0FBSyxPQUFPLGtCQUFrQjtBQUFBLElBQ2hDLENBQUMsQ0FBQztBQUVOLGdCQUFZLFNBQVMsTUFBTSxFQUFFLE1BQU0sa0NBQTRCLENBQUM7QUFFaEUsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsWUFBWSxFQUNwQixRQUFRLDJLQUE0SixFQUNwSyxRQUFRLE9BQUs7QUFDWixRQUFFLGVBQWUsdUJBQXVCLEVBQ3JDLFNBQVMsS0FBSyxPQUFPLFNBQVMsWUFBWSxFQUMxQyxTQUFTLE9BQU0sTUFBSztBQUNuQixhQUFLLE9BQU8sU0FBUyxlQUFlLEVBQUUsS0FBSyxLQUFLO0FBQ2hELGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFlBQVk7QUFBQSxNQUMxQixDQUFDO0FBQ0gsUUFBRSxRQUFRLE1BQU0sUUFBUTtBQUFBLElBQzFCLENBQUM7QUFFSCxRQUFJLHdCQUFRLFdBQVcsRUFDcEIsUUFBUSxTQUFTLEVBQ2pCLFFBQVEsaUhBQStGLEVBQ3ZHLFFBQVEsT0FBSztBQUNaLFFBQUUsZUFBZSxnQkFBZ0IsRUFDOUIsU0FBUyxLQUFLLE9BQU8sU0FBUyxlQUFlLEVBQzdDLFNBQVMsT0FBTSxNQUFLO0FBQ25CLGFBQUssT0FBTyxTQUFTLGtCQUFrQixFQUFFLEtBQUs7QUFDOUMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzFCLENBQUM7QUFDSCxRQUFFLFFBQVEsT0FBTztBQUNqQixRQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDMUIsQ0FBQztBQUVILFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLHdCQUF3QixFQUNoQyxRQUFRLGdGQUFnRixFQUN4RixRQUFRLE9BQUs7QUFDWixRQUFFLGVBQWUsa0JBQWtCLEVBQ2hDLFNBQVMsS0FBSyxPQUFPLFNBQVMsaUJBQWlCLEVBQy9DLFNBQVMsT0FBTSxNQUFLO0FBQ25CLGFBQUssT0FBTyxTQUFTLG9CQUFvQixFQUFFLEtBQUs7QUFDaEQsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzFCLENBQUM7QUFDSCxRQUFFLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDMUIsQ0FBQztBQUVILFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLHdDQUF3QyxFQUNoRCxRQUFRLGtGQUFpRixFQUN6RixVQUFVLE9BQUssRUFDYixTQUFTLEtBQUssT0FBTyxTQUFTLG1CQUFtQixFQUNqRCxTQUFTLE9BQU0sTUFBSztBQUNuQixXQUFLLE9BQU8sU0FBUyxzQkFBc0I7QUFDM0MsWUFBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixXQUFLLE9BQU8sWUFBWTtBQUFBLElBQzFCLENBQUMsQ0FBQztBQUFBLEVBQ1I7QUFDRjsiLAogICJuYW1lcyI6IFsicmFuZ2UiLCAiX2EiLCAiX2IiLCAiX2MiLCAicyJdCn0K
