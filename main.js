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
  syncthingShowCounts: false
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
var SEC_HEAT = "sec:heatmap";
var SEC_GROW = "sec:growth";
var SEC_STAT = "sec:stats";
var SEC_TODO = "sec:todoist";
var SEC_SYNC = "sec:sync";
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
    this.calSourcesOpen = false;
    // seletor de fontes da Semana aberto
    // Estado da integração Todoist
    this.todoistTasks = [];
    this.todoistProjects = [];
    this.todoistProjectMap = /* @__PURE__ */ new Map();
    // id → nome
    this.todoistLabelColor = /* @__PURE__ */ new Map();
    // nome da etiqueta → hex
    this.todoistLoading = false;
    this.todoistError = null;
    this.todoistFetchedAt = 0;
    this.todoistLaterOpen = false;
    this.todoistFilterOpen = false;
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
    for (const ev of ["modify", "create", "delete", "rename"])
      this.registerEvent(this.app.vault.on(ev, () => this.schedule()));
  }
  async onClose() {
    this.hideTip();
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
  // ── Controles de ordem de seção ───────────────────────────────────────────
  moveControls(host, id) {
    const order = this.plugin.settings.sectionOrder;
    const i = order.indexOf(id);
    const ctrl = host.createDiv({ cls: "wd-move-ctrl" });
    const up = ctrl.createSpan({ cls: "wd-move-btn" + (i <= 0 ? " wd-move-off" : ""), text: "\u25B2" });
    up.setAttr("title", "Mover se\xE7\xE3o para cima");
    if (i > 0) up.onclick = (e) => {
      e.stopPropagation();
      this.moveSection(id, -1);
    };
    const down = ctrl.createSpan({ cls: "wd-move-btn" + (i >= order.length - 1 ? " wd-move-off" : ""), text: "\u25BC" });
    down.setAttr("title", "Mover se\xE7\xE3o para baixo");
    if (i < order.length - 1) down.onclick = (e) => {
      e.stopPropagation();
      this.moveSection(id, 1);
    };
  }
  async moveSection(id, dir) {
    const order = [...this.plugin.settings.sectionOrder];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this.plugin.settings.sectionOrder = order;
    await this.plugin.saveSettings();
    this.render();
  }
  // ── Ocultar / restaurar ───────────────────────────────────────────────────
  isHidden(key) {
    return this.plugin.settings.hidden.includes(key);
  }
  hideBtn(host, key, title, cls = "wd-hide-btn") {
    const b = host.createSpan({ cls });
    (0, import_obsidian.setIcon)(b, "eye-off");
    b.setAttr("title", title);
    b.onclick = (e) => {
      e.stopPropagation();
      this.hideItem(key);
    };
  }
  async hideItem(key) {
    if (this.isHidden(key)) return;
    this.plugin.settings.hidden.push(key);
    if (this.navPath && (this.navPath === key || this.navPath.startsWith(key + "/"))) this.navPath = null;
    await this.plugin.saveSettings();
    this.render();
  }
  async unhideItem(key) {
    this.plugin.settings.hidden = this.plugin.settings.hidden.filter((k) => k !== key);
    await this.plugin.saveSettings();
    this.render();
  }
  hiddenLabel(key) {
    if (key === SEC_CAL) return "\u{1F4C5} Calend\xE1rio";
    if (key === SEC_HEAT) return "\u{1F525} Heatmap";
    if (key === SEC_GROW) return "\u{1F4C8} Crescimento";
    if (key === SEC_STAT) return "\u{1F4CA} Estat\xEDsticas";
    if (key === SEC_TODO) return "\u{1F4CB} Tarefas";
    const f = this.app.vault.getAbstractFileByPath(key);
    return f instanceof import_obsidian.TFolder ? f.name : key;
  }
  renderHiddenBar(parent) {
    const hidden = this.plugin.settings.hidden;
    if (!hidden.length) return;
    const bar = parent.createDiv({ cls: "wd-hidden-bar" });
    bar.createSpan({ cls: "wd-hidden-label", text: "ocultos:" });
    for (const key of hidden) {
      const chip = bar.createSpan({ cls: "wd-hidden-chip" });
      const f = this.app.vault.getAbstractFileByPath(key);
      const urg = f instanceof import_obsidian.TFolder ? urgencyStats(this.app, f) : { items: [], max: null };
      if (urg.max) {
        chip.addClass("wd-hidden-urgent");
        chip.addClass(`wd-u-${urg.max}`);
        chip.style.borderColor = URGENCY_COLOR[urg.max];
      }
      (0, import_obsidian.setIcon)(chip.createSpan({ cls: "wd-chip-icon" }), "eye");
      chip.createSpan({ text: this.hiddenLabel(key) });
      chip.setAttr("title", urg.max ? `Mostrar novamente \u2014 ${urg.items.length} nota(s) urgente(s)` : "Mostrar novamente");
      chip.onclick = () => this.unhideItem(key);
    }
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
      nav.createSpan({ cls: "wd-cal-week-label", text: `Semana ${weekNum}` });
    }
    const ctrls = nav.createDiv({ cls: "wd-cal-ctrls" });
    const srcBtn = ctrls.createSpan({ cls: "wd-cal-srcbtn" + (this.calSourcesOpen ? " wd-on" : "") });
    (0, import_obsidian.setIcon)(srcBtn.createSpan({ cls: "wd-cal-srcico" }), "folder-cog");
    srcBtn.setAttr("title", "Fontes dos cards da semana");
    srcBtn.onclick = (e) => {
      e.stopPropagation();
      this.calSourcesOpen = !this.calSourcesOpen;
      this.render();
    };
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
    this.moveControls(ctrls, "calendar");
    this.hideBtn(ctrls, SEC_CAL, "Ocultar calend\xE1rio", "wd-sec-hide");
    if (this.calSourcesOpen) this.renderCalSources(sec);
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
  // Seletor de fontes da Semana: marca quais pastas alimentam os cards, com cor
  // por fonte. "+ pasta" adiciona qualquer pasta do cofre; × remove.
  renderCalSources(sec) {
    const srcs = this.plugin.settings.calendarSources;
    const bar = sec.createDiv({ cls: "wd-cal-srcbar" });
    bar.createSpan({ cls: "wd-cal-srclabel", text: "Fontes dos cards" });
    for (const s of srcs) {
      const chip = bar.createSpan({ cls: "wd-cal-srcchip" + (s.on ? " wd-on" : "") });
      const dot = chip.createSpan({ cls: "wd-cal-srcdot" });
      dot.style.background = s.color;
      chip.createSpan({ cls: "wd-cal-srcname", text: s.path });
      chip.onclick = async () => {
        s.on = !s.on;
        await this.plugin.saveSettings();
        this.render();
      };
      const rm = chip.createSpan({ cls: "wd-cal-srcrm", text: "\xD7" });
      rm.setAttr("title", "Remover fonte");
      rm.onclick = async (e) => {
        e.stopPropagation();
        this.plugin.settings.calendarSources = srcs.filter((x) => x !== s);
        await this.plugin.saveSettings();
        this.render();
      };
    }
    const used = new Set(srcs.map((s) => s.path));
    const available = allFolderPaths(this.app).filter((p) => !used.has(p));
    if (available.length) {
      const add = bar.createDiv({ cls: "wd-cal-srcadd" });
      add.createSpan({ cls: "wd-cal-srcaddico", text: "+" });
      const sel = add.createEl("select", { cls: "wd-cal-srcselect" });
      sel.createEl("option", { text: "adicionar pasta\u2026", value: "" });
      for (const p of available) sel.createEl("option", { text: p, value: p });
      sel.onchange = async () => {
        const path = sel.value;
        if (!path) return;
        const color = ACCENTS[srcs.length % ACCENTS.length];
        srcs.push({ path, color, on: true });
        await this.plugin.saveSettings();
        this.render();
      };
    }
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
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "COFRE" });
    this.moveControls(head, "para");
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
      this.hideBtn(card, folder.path, `Ocultar "${meta.label}"`);
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
    this.renderHiddenBar(sec);
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
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.moveControls(ctrls, "heatmap");
    this.hideBtn(ctrls, SEC_HEAT, "Ocultar heatmap", "wd-sec-hide");
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
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.moveControls(ctrls, "stats");
    this.hideBtn(ctrls, SEC_STAT, "Ocultar estat\xEDsticas", "wd-sec-hide");
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
    this.moveControls(ctrls, "growth");
    this.hideBtn(ctrls, SEC_GROW, "Ocultar crescimento", "wd-sec-hide");
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
  // ── Todoist (Fase 8.1 — leitura) ──────────────────────────────────────────
  renderTodoist(root) {
    var _a;
    if (this.isHidden(SEC_TODO)) return;
    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
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
          this.render();
        };
      }
      const f = this.plugin.settings.todoistFilters;
      const nF = f.projects.length + f.labels.length;
      const filt = ctrls.createSpan({ cls: "wd-todo-filterbtn" + (this.todoistFilterOpen ? " wd-on" : "") + (nF ? " wd-active" : "") });
      (0, import_obsidian.setIcon)(filt, "filter");
      filt.setAttr("title", nF ? `Filtros ativos (${nF}) \u2014 clique para ajustar` : "Filtrar por projeto/etiqueta");
      if (nF) filt.createSpan({ cls: "wd-todo-filtct", text: String(nF) });
      filt.onclick = (e) => {
        e.stopPropagation();
        this.todoistFilterOpen = !this.todoistFilterOpen;
        this.render();
      };
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.todoistLoading ? " wd-spin" : "") });
      (0, import_obsidian.setIcon)(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      refresh.onclick = (e) => {
        e.stopPropagation();
        void this.fetchTodoist(true);
      };
      this.addTaskBtn(ctrls, void 0, "Nova tarefa");
    }
    this.moveControls(ctrls, "todoist");
    this.hideBtn(ctrls, SEC_TODO, "Ocultar tarefas", "wd-sec-hide");
    if (!token) {
      sec.createDiv({ cls: "wd-empty", text: "Cole seu token do Todoist em Configura\xE7\xF5es \u2192 Werus Dashboard para ver suas tarefas aqui." });
      return;
    }
    if (!this.todoistFetchedAt && !this.todoistLoading && !this.todoistError) void this.fetchTodoist(false);
    if (this.todoistError) {
      sec.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao buscar tarefas: ${this.todoistError}` });
      return;
    }
    if (!this.todoistFetchedAt) {
      sec.createDiv({ cls: "wd-empty", text: "Carregando tarefas\u2026" });
      return;
    }
    if (this.todoistFilterOpen) this.renderTodoFilterBar(sec);
    const range = this.dayRange();
    const todayK = toKey(/* @__PURE__ */ new Date());
    const lastUpcoming = /* @__PURE__ */ new Date();
    lastUpcoming.setDate(lastUpcoming.getDate() + range);
    const lastK = toKey(lastUpcoming);
    const tasks = this.applyTodoistFilters(this.todoistTasks);
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
    overdue.sort(byPri);
    todayTasks.sort(byPri);
    later.sort(byPri);
    for (const k of Object.keys(byDay)) byDay[k].sort(byPri);
    const visible = overdue.length + todayTasks.length + later.length + Object.values(byDay).reduce((s, a) => s + a.length, 0);
    if (visible === 0) {
      const all = this.todoistTasks.length;
      sec.createDiv({ cls: "wd-empty", text: all ? "Nenhuma tarefa bate com os filtros." : "Nenhuma tarefa com data no Todoist. \u{1F389}" });
      return;
    }
    const cols = sec.createDiv({ cls: "wd-todo-cols" });
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
    if (later.length) {
      const panel = sec.createDiv({ cls: "wd-todo-later" });
      const lhd = panel.createDiv({ cls: "wd-todo-ohd" });
      lhd.createSpan({ cls: "wd-todo-laterico", text: "\u203A" });
      lhd.createSpan({ cls: "wd-todo-otitle", text: `Depois (${later.length})` });
      lhd.createSpan({ cls: "wd-todo-otoggle", text: this.todoistLaterOpen ? "ocultar \u25BE" : "mostrar \u203A" });
      lhd.onclick = () => {
        this.todoistLaterOpen = !this.todoistLaterOpen;
        this.render();
      };
      if (this.todoistLaterOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of later) this.todoRow(list, t);
      }
    }
  }
  // Janela de "próximos dias" saneada (3 ou 7).
  dayRange() {
    return this.plugin.settings.todoistDayRange === 3 ? 3 : 7;
  }
  // Mantém só as tarefas que batem com os filtros ativos (projeto E etiqueta).
  applyTodoistFilters(tasks) {
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
  toggleTodoFilter(kind, id) {
    const arr = this.plugin.settings.todoistFilters[kind];
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(id);
  }
  // Barra de filtros: chips de projeto e de etiqueta (toggle), + limpar.
  renderTodoFilterBar(sec) {
    const f = this.plugin.settings.todoistFilters;
    const bar = sec.createDiv({ cls: "wd-todo-filterbar" });
    if (this.todoistProjects.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Projetos" });
      for (const p of this.todoistProjects) {
        const on = f.projects.includes(p.id);
        const chip = grp.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : ""), text: p.name });
        chip.onclick = async () => {
          this.toggleTodoFilter("projects", p.id);
          await this.plugin.saveSettings();
          this.render();
        };
      }
    }
    const labels = [...new Set(this.todoistTasks.flatMap((t) => {
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
          this.toggleTodoFilter("labels", l);
          await this.plugin.saveSettings();
          this.render();
        };
      }
    }
    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clr.onclick = async () => {
        f.projects = [];
        f.labels = [];
        await this.plugin.saveSettings();
        this.render();
      };
    }
  }
  // Checkbox de conclusão (Fase 8.2) — conclui no Todoist real ao clicar.
  todoCheck(host, t) {
    const check = host.createSpan({ cls: "wd-todo-check" });
    check.setAttr("title", "Concluir tarefa");
    check.onclick = (e) => {
      e.stopPropagation();
      void this.completeTask(t);
    };
  }
  // Tooltip da tarefa: título completo + descrição (instruções), no hover.
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
  // Linha de tarefa (usada nas 3 caixas: atrasadas, hoje, próximos e em "depois").
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
    const proj = t.project_id ? this.todoistProjectMap.get(t.project_id) : void 0;
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
  // Botão "+" de criar tarefa (header da seção, caixas e sub-títulos de dia).
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
  // Abre o formulário de tarefa (criar ou editar).
  openTaskForm(opts) {
    this.hideTip();
    const labels = [.../* @__PURE__ */ new Set([...this.todoistLabelColor.keys(), ...this.todoistTasks.flatMap((t) => {
      var _a;
      return (_a = t.labels) != null ? _a : [];
    })])].sort((a, b) => a.localeCompare(b));
    new TaskFormModal(this.app, {
      mode: opts.mode,
      task: opts.task,
      prefillDue: opts.prefillDue,
      projects: this.todoistProjects,
      labels,
      labelColor: (n) => this.labelColor(n),
      submit: (v) => this.submitTaskForm(opts.mode, opts.task, v),
      remove: opts.task ? () => this.deleteTask(opts.task) : void 0,
      complete: opts.task ? () => void this.completeTask(opts.task) : void 0
    }).open();
  }
  // Abre o pop-up de detalhes (só leitura); o botão "Editar" abre o formulário.
  openTaskDetail(t) {
    this.hideTip();
    new TaskDetailModal(this.app, this, {
      task: t,
      projectName: t.project_id ? this.todoistProjectMap.get(t.project_id) : void 0,
      labelColor: (n) => this.labelColor(n),
      edit: () => this.openTaskForm({ mode: "edit", task: t }),
      complete: () => void this.completeTask(t)
    }).open();
  }
  // Cria ou edita no Todoist real. No editar manda só os campos alterados (preserva
  // recorrência se a data não mudou) e troca de projeto via /move. Retorna true se OK.
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
        const oldL = ((_c = task.labels) != null ? _c : []).slice().sort().join("\0");
        const newL = v.labels.slice().sort().join("\0");
        if (oldL !== newL) fields.labels = v.labels;
        if (Object.keys(fields).length) await updateTodoistTask(token, task.id, fields);
        const oldProj = (_d = task.project_id) != null ? _d : "";
        if (v.projectId !== oldProj && v.projectId) await moveTodoistTask(token, task.id, v.projectId);
        new import_obsidian.Notice(`\u2713 Salva: ${v.content}`);
      }
      await this.fetchTodoist(true);
      return true;
    } catch (e) {
      new import_obsidian.Notice(`Falha ao salvar: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  }
  // Exclui a tarefa (otimista) no Todoist real. Retorna true se OK.
  async deleteTask(t) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    const idx = this.todoistTasks.findIndex((x) => x.id === t.id);
    if (idx >= 0) this.todoistTasks.splice(idx, 1);
    this.render();
    try {
      await deleteTodoistTask(token, t.id);
      new import_obsidian.Notice(`\u{1F5D1} Exclu\xEDda: ${t.content}`);
      return true;
    } catch (e) {
      if (idx >= 0) this.todoistTasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao excluir: ${e instanceof Error ? e.message : String(e)}`);
      this.render();
      return false;
    }
  }
  // Conclui a tarefa de forma otimista: remove da lista e re-renderiza; se a API
  // falhar, restaura e avisa. A escrita reflete no Todoist real (Fase 8.2).
  async completeTask(t) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    const idx = this.todoistTasks.findIndex((x) => x.id === t.id);
    if (idx >= 0) this.todoistTasks.splice(idx, 1);
    this.render();
    try {
      await closeTodoistTask(token, t.id);
      new import_obsidian.Notice(`\u2713 Conclu\xEDda: ${t.content}`);
    } catch (e) {
      if (idx >= 0) this.todoistTasks.splice(idx, 0, t);
      new import_obsidian.Notice(`Falha ao concluir: ${e instanceof Error ? e.message : String(e)}`);
      this.render();
    }
  }
  // Busca tarefas; `manual` mostra o spinner imediatamente.
  async fetchTodoist(manual) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token || this.todoistLoading) return;
    this.todoistLoading = true;
    this.todoistError = null;
    if (manual) this.render();
    try {
      const [tasks, projects, labels] = await Promise.all([
        fetchTodoistTasks(token),
        fetchTodoistProjects(token).catch(() => []),
        fetchTodoistLabels(token).catch(() => [])
      ]);
      this.todoistTasks = tasks;
      this.todoistProjects = projects;
      this.todoistProjectMap = new Map(projects.map((p) => [p.id, p.name]));
      this.todoistLabelColor = new Map(labels.map((l) => {
        var _a;
        return [l.name, (_a = TODOIST_COLORS[l.color]) != null ? _a : LABEL_FALLBACK];
      }));
      this.todoistFetchedAt = Date.now();
    } catch (e) {
      this.todoistError = e instanceof Error ? e.message : String(e);
    } finally {
      this.todoistLoading = false;
      this.render();
    }
  }
  // Reseta o estado (ex.: token alterado nas configurações) e re-renderiza.
  resetTodoist() {
    this.todoistTasks = [];
    this.todoistProjects = [];
    this.todoistProjectMap = /* @__PURE__ */ new Map();
    this.todoistLabelColor = /* @__PURE__ */ new Map();
    this.todoistFetchedAt = 0;
    this.todoistError = null;
    this.todoistLoading = false;
    this.render();
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
    this.moveControls(ctrls, "sync");
    this.hideBtn(ctrls, SEC_SYNC, "Ocultar sincroniza\xE7\xE3o", "wd-sec-hide");
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
  // Cor (hex) de uma etiqueta pelo nome; cinza se desconhecida.
  labelColor(name) {
    var _a;
    return (_a = this.todoistLabelColor.get(name)) != null ? _a : LABEL_FALLBACK;
  }
  // Cria um chip de etiqueta com bolinha colorida + "@nome".
  labelChip(host, name, cls) {
    const chip = host.createSpan({ cls });
    chip.createSpan({ cls: "wd-label-dot" }).style.background = this.labelColor(name);
    chip.createSpan({ text: `@${name}` });
    return chip;
  }
  // ── Header ──────────────────────────────────────────────────────────────────
  renderHeader(root) {
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Second Brain" });
    const toggle = h.createSpan({
      cls: "wd-compact-toggle",
      text: this.plugin.settings.compact ? "\u25A6 compacto" : "\u25A4 confort\xE1vel"
    });
    toggle.setAttr("title", "Alternar modo compacto");
    toggle.onclick = async () => {
      this.plugin.settings.compact = !this.plugin.settings.compact;
      await this.plugin.saveSettings();
      this.render();
    };
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
    this.addRibbonIcon("layout-dashboard", "Abrir Werus Dashboard", () => this.open());
    this.addCommand({ id: "open-dashboard", name: "Abrir Dashboard", callback: () => this.open() });
    this.addSettingTab(new WerusSettingTab(this.app, this));
  }
  // Re-busca o Todoist em todas as dashboards abertas (ex.: após mudar o token).
  refreshDashboards() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof DashboardView) v.resetTodoist();
    }
  }
  // Reseta o estado do Syncthing em todas as dashboards (ex.: token/URL alterados).
  refreshSync() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof DashboardView) v.resetSync();
    }
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
  onunload() {
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
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuXG50eXBlIFN0YXR1cyA9IFwicHJvZ3Jlc3NcIiB8IFwicGF1c2VkXCIgfCBcImNhbmNlbGxlZFwiO1xudHlwZSBTZWN0aW9uSWQgPSBcImNhbGVuZGFyXCIgfCBcInBhcmFcIiB8IFwiaGVhdG1hcFwiIHwgXCJncm93dGhcIiB8IFwic3RhdHNcIiB8IFwidG9kb2lzdFwiIHwgXCJzeW5jXCI7XG5cbmludGVyZmFjZSBUb2RvaXN0RmlsdGVycyB7XG4gIHByb2plY3RzOiBzdHJpbmdbXTsgICAvLyBpZHMgZGUgcHJvamV0byBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kb3MpXG4gIGxhYmVsczogc3RyaW5nW107ICAgICAvLyBub21lcyBkZSBldGlxdWV0YSBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kYXMpXG59XG5cbi8vIEZvbnRlIGRlIGNhcmRzIGRhIFNlbWFuYTogdW1hIHBhc3RhIGRvIGNvZnJlICsgY29yICsgc2UgZXN0XHUwMEUxIHZpc1x1MDBFRHZlbC5cbi8vIEFzIG5vdGFzIGRlbnRybyBkZWxhIGFwYXJlY2VtIG5vcyBkaWFzIGRvIGNhbGVuZFx1MDBFMXJpbyAocG9zaVx1MDBFN1x1MDBFM28gcGVsbyBgZGF0ZTpgKS5cbmludGVyZmFjZSBDYWxTb3VyY2Uge1xuICBwYXRoOiBzdHJpbmc7ICAgIC8vIGNhbWluaG8gZGEgcGFzdGEgKGV4LjogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIilcbiAgY29sb3I6IHN0cmluZzsgICAvLyBjb3IgZG8gaW5kaWNhZG9yIGRhIGZvbnRlXG4gIG9uOiBib29sZWFuOyAgICAgLy8gbWFyY2FkYSA9IGFwYXJlY2UgbmEgc2VtYW5hXG59XG5cbmludGVyZmFjZSBEYXNoU2V0dGluZ3Mge1xuICBzZWN0aW9uT3JkZXI6IFNlY3Rpb25JZFtdO1xuICBjb21wYWN0OiBib29sZWFuO1xuICBoaWRkZW46IHN0cmluZ1tdOyAgIC8vIGNhbWluaG9zIGRlIHBhc3RhIG9jdWx0b3MgKyBcInNlYzpjYWxlbmRhclwiIC8gXCJzZWM6aGVhdG1hcFwiXG4gIG5vdGVWaWV3OiBcImxpc3RcIiB8IFwiZ3JpZFwiO1xuICBjYWxlbmRhclNvdXJjZXM6IENhbFNvdXJjZVtdOyAgIC8vIGZvbnRlcyAocGFzdGFzKSBxdWUgYWxpbWVudGFtIG9zIGNhcmRzIGRhIFNlbWFuYVxuICB0b2RvaXN0VG9rZW46IHN0cmluZztcbiAgdG9kb2lzdERheVJhbmdlOiAzIHwgNzsgICAgICAgIC8vIHF1YW50b3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiBtb3N0cmFyIG5hIGdyYWRlXG4gIHRvZG9pc3RGaWx0ZXJzOiBUb2RvaXN0RmlsdGVycztcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiBib29sZWFuOyAgIC8vIG1vc3RyYXIgbyBub21lIGRvIHByb2pldG8gbmFzIGxpbmhhc1xuICB0b2RvaXN0U2hvd0xhYmVsczogYm9vbGVhbjsgICAgLy8gbW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1xuICBzeW5jdGhpbmdVcmw6IHN0cmluZzsgICAgICAgICAgLy8gYmFzZSBkYSBBUEkgUkVTVCBkbyBTeW5jdGhpbmdcbiAgc3luY3RoaW5nQXBpS2V5OiBzdHJpbmc7ICAgICAgIC8vIFgtQVBJLUtleSAoZm9yYSBkbyBHaXQpXG4gIHN5bmN0aGluZ0ZvbGRlcklkOiBzdHJpbmc7ICAgICAvLyBpZCBkYSBwYXN0YTsgdmF6aW8gPSBhdXRvZGV0ZWN0YVxuICBzeW5jdGhpbmdTaG93Q291bnRzOiBib29sZWFuOyAgLy8gbW9zdHJhciBcInNpbmNyb25pemFkb3MgLyB0b3RhbFwiIGRlIGl0ZW5zIHBvciBhcGFyZWxob1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEYXNoU2V0dGluZ3MgPSB7XG4gIHNlY3Rpb25PcmRlcjogW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIGNhbGVuZGFyU291cmNlczogW1xuICAgIHsgcGF0aDogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgY29sb3I6IFwiIzNCODJGNlwiLCBvbjogdHJ1ZSB9LFxuICAgIHsgcGF0aDogXCI1MC5EaVx1MDBFMXJpb1wiLCAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzEwQjk4MVwiLCBvbjogdHJ1ZSB9LFxuICBdLFxuICB0b2RvaXN0VG9rZW46IFwiXCIsXG4gIHRvZG9pc3REYXlSYW5nZTogNyxcbiAgdG9kb2lzdEZpbHRlcnM6IHsgcHJvamVjdHM6IFtdLCBsYWJlbHM6IFtdIH0sXG4gIHRvZG9pc3RTaG93UHJvamVjdDogdHJ1ZSxcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGZhbHNlLFxuICBzeW5jdGhpbmdVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIsXG4gIHN5bmN0aGluZ0FwaUtleTogXCJcIixcbiAgc3luY3RoaW5nRm9sZGVySWQ6IFwiXCIsXG4gIHN5bmN0aGluZ1Nob3dDb3VudHM6IGZhbHNlLFxufTtcblxuaW50ZXJmYWNlIFBhcmFTZWN0aW9uIHtcbiAgZm9sZGVyOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgYWNjZW50OiBzdHJpbmc7XG59XG5cbi8vIFBhc3RhcyBcImNvbmhlY2lkYXNcIiBkbyBQQVJBOiBtYW50XHUwMEVBbSBcdTAwRURjb25lLCByXHUwMEYzdHVsbyBlIGNvciBmaXhvcy4gQXMgZGVtYWlzIHBhc3Rhc1xuLy8gZG8gY29mcmUgc1x1MDBFM28gcmVuZGVyaXphZGFzIGNvbSBjb3IgYXV0b21cdTAwRTF0aWNhIGUgXHUwMEVEY29uZSBwYWRyXHUwMEUzbyAob3UgbyBpY29uOiBkbyBzdGF0dXMubWQpLlxuY29uc3QgUEFSQTogUGFyYVNlY3Rpb25bXSA9IFtcbiAgeyBmb2xkZXI6IFwiMDAuSW5ib3hcIiwgICAgIGljb246IFwiXHVEODNEXHVEQ0U1XCIsIGxhYmVsOiBcIkluYm94XCIsICAgIGFjY2VudDogXCIjNjM2NkYxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMTAuUHJvamVjdHNcIiwgIGljb246IFwiXHVEODNEXHVERTgwXCIsIGxhYmVsOiBcIlByb2pldG9zXCIsIGFjY2VudDogXCIjMTBCOTgxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMjAuQXJlYXNcIiwgICAgIGljb246IFwiXHVEODNDXHVERkFGXCIsIGxhYmVsOiBcIlx1MDBDMXJlYXNcIiwgICAgYWNjZW50OiBcIiNGNTlFMEJcIiB9LFxuICB7IGZvbGRlcjogXCIzMC5SZXNvdXJjZXNcIiwgaWNvbjogXCJcdUQ4M0RcdURDREFcIiwgbGFiZWw6IFwiUmVjdXJzb3NcIiwgYWNjZW50OiBcIiMzQjgyRjZcIiB9LFxuICB7IGZvbGRlcjogXCI0MC5BcmNoaXZlXCIsICAgaWNvbjogXCJcdUQ4M0RcdUREQzRcdUZFMEZcIiwgIGxhYmVsOiBcIkFycXVpdm9cIiwgIGFjY2VudDogXCIjNkI3MjgwXCIgfSxcbl07XG5jb25zdCBQQVJBX01BUCA9IG5ldyBNYXAoUEFSQS5tYXAocCA9PiBbcC5mb2xkZXIsIHBdKSk7XG5cbi8vIFBhbGV0YSBwYXJhIGNvbG9yaXIgcGFzdGFzIGRlc2NvbmhlY2lkYXMgZGUgZm9ybWEgZXN0XHUwMEUxdmVsIChwb3IgaGFzaCBkbyBub21lKS5cbmNvbnN0IEFDQ0VOVFMgPSBbXCIjNjM2NkYxXCIsXCIjMTBCOTgxXCIsXCIjRjU5RTBCXCIsXCIjM0I4MkY2XCIsXCIjRUM0ODk5XCIsXCIjOEI1Q0Y2XCIsXCIjMTRCOEE2XCIsXCIjRUY0NDQ0XCJdO1xuXG5jb25zdCBEQVlfU0hPUlQgPSBbXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTXHUwMEUxYlwiLCBcIkRvbVwiXTtcbmNvbnN0IE1PTlRIX1NIT1JUID0gW1wiSmFuXCIsXCJGZXZcIixcIk1hclwiLFwiQWJyXCIsXCJNYWlcIixcIkp1blwiLFwiSnVsXCIsXCJBZ29cIixcIlNldFwiLFwiT3V0XCIsXCJOb3ZcIixcIkRlelwiXTtcbmNvbnN0IElNR19FWFQgPSBbXCJwbmdcIixcImpwZ1wiLFwianBlZ1wiLFwid2VicFwiLFwiZ2lmXCIsXCJzdmdcIl07XG5cbi8vIFBhc3RhIHJhaXogZGFzIG5vdGFzIGRpXHUwMEUxcmlhcyAoY3JpYWRhcyBhbyBjbGljYXIgbnVtIGRpYSBkbyBjYWxlbmRcdTAwRTFyaW8pLlxuY29uc3QgREFJTFlfRk9MREVSID0gXCI1MC5EaVx1MDBFMXJpb1wiO1xuLy8gVGVtcGxhdGUgb3BjaW9uYWw7IHBsYWNlaG9sZGVycyB7e2RhdGV9fSAoWVlZWS1NTS1ERCkgZSB7e3RpdGxlfX0gKGRhdGEgcG9yIGV4dGVuc28pLlxuY29uc3QgREFJTFlfVEVNUExBVEUgPSBcIk1vZGVsb3MvTm90YSBEaVx1MDBFMXJpYS5tZFwiO1xuXG5jb25zdCBTVEFUVVNfSUNPTjogUmVjb3JkPFN0YXR1cywgc3RyaW5nPiA9IHtcbiAgcHJvZ3Jlc3M6IFwiXHUyNUI2XCIsIHBhdXNlZDogXCJcdTIzRjhcIiwgY2FuY2VsbGVkOiBcIlx1MjcxNVwiLFxufTtcblxuY29uc3QgU0VDX0NBTCA9IFwic2VjOmNhbGVuZGFyXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5jb25zdCBTRUNfVE9ETyA9IFwic2VjOnRvZG9pc3RcIjtcbmNvbnN0IFNFQ19TWU5DID0gXCJzZWM6c3luY1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRvZG9pc3RUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEk6IDEuLjQsIG9uZGUgNCA9IHVyZ2VudGUgKD0gcDEgbmEgVUkpXG4gIGR1ZT86IHsgZGF0ZTogc3RyaW5nOyBkYXRldGltZT86IHN0cmluZzsgc3RyaW5nPzogc3RyaW5nOyBpc19yZWN1cnJpbmc/OiBib29sZWFuIH0gfCBudWxsO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xuICBpc19jb21wbGV0ZWQ/OiBib29sZWFuO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG5cbi8vIEJ1c2NhIGFzIHRhcmVmYXMgYXRpdmFzIChuXHUwMEUzbyBjb25jbHVcdTAwRURkYXMpIHZpYSBBUEkgdW5pZmljYWRhIHYxIChhIFJFU1QgdjIgZm9pXG4vLyBhcG9zZW50YWRhIFx1MjE5MiByZXNwb25kaWEgNDEwKS4gQSB2MSBcdTAwRTkgcGFnaW5hZGE6IHsgcmVzdWx0cywgbmV4dF9jdXJzb3IgfS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RUYXNrW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0VGFza1tdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgLy8gdjEgZW52ZWxvcGEgZW0gcmVzdWx0czsgdG9sZXJhIHJlc3Bvc3RhIGNvbW8gYXJyYXkgcHVybyBwb3Igc2VndXJhblx1MDBFN2EuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFRhc2tbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0UHJvamVjdCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLy8gQnVzY2Egb3MgcHJvamV0b3MgKHBhcmEgbyBmaWx0cm8pLiBNZXNtYSBBUEkgdjEgcGFnaW5hZGEgZGFzIHRhcmVmYXMuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0UHJvamVjdFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFByb2plY3RbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvcHJvamVjdHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFByb2plY3RbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFByb2plY3RbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0TGFiZWwge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gbm9tZSBkYSBwYWxldGEgKGV4LjogXCJjaGFyY29hbFwiKVxufVxuXG4vLyBCdXNjYSBhcyBldGlxdWV0YXMgcGVzc29haXMgKHBhcmEgY29sb3JpciBvcyBjaGlwcykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0TGFiZWxbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RMYWJlbFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9sYWJlbHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdExhYmVsW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RMYWJlbFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFN5bmN0aGluZyAoQVBJIFJFU1QpIFx1MjAxNCB2MC4xMC4wIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgU1RGb2xkZXIgeyBpZDogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IHBhdXNlZDogYm9vbGVhbiB9XG5pbnRlcmZhY2UgU1REZXZpY2UgeyBkZXZpY2VJRDogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfVxuaW50ZXJmYWNlIFNUU3RhdHVzIHsgc3RhdGU6IHN0cmluZzsgbmVlZEZpbGVzOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBlcnJvcnM6IG51bWJlcjsgcHVsbEVycm9yczogbnVtYmVyIH1cbmludGVyZmFjZSBTVENvbXBsZXRpb24geyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlciB9XG5cbmludGVyZmFjZSBTeW5jRGV2Um93IHsgbmFtZTogc3RyaW5nOyBvbmxpbmU6IGJvb2xlYW47IGNvbXBsZXRpb246IG51bWJlcjsgZ2xvYmFsSXRlbXM6IG51bWJlcjsgbmVlZEl0ZW1zOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBuZWVkRGVsZXRlczogbnVtYmVyOyBsYXN0U2Vlbjogc3RyaW5nIH1cbmludGVyZmFjZSBTeW5jRGF0YSB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZm9sZGVyTGFiZWw6IHN0cmluZzsgZXJyb3JzOiBudW1iZXI7IGRldmljZXM6IFN5bmNEZXZSb3dbXSB9XG5cbmZ1bmN0aW9uIGh1bWFuQnl0ZXMobjogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKCFuKSByZXR1cm4gXCIwIEJcIjtcbiAgaWYgKG4gPCAxMDI0KSByZXR1cm4gYCR7bn0gQmA7XG4gIGlmIChuIDwgMTA0ODU3NikgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZChuIDwgMTAyNDAgPyAxIDogMCl9IEtCYDtcbiAgcmV0dXJuIGAkeyhuIC8gMTA0ODU3NikudG9GaXhlZChuIDwgMTA0ODU3NjAgPyAxIDogMCl9IE1CYDtcbn1cblxuZnVuY3Rpb24gcmVsVGltZShpc286IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIGlmIChpc05hTih0KSB8fCB0IDwgMSkgcmV0dXJuIFwiXHUyMDE0XCI7XG4gIGNvbnN0IHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gdCkgLyAxMDAwKTtcbiAgaWYgKHMgPCA2MCkgcmV0dXJuIFwiYWdvcmFcIjtcbiAgaWYgKHMgPCAzNjAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyA2MCl9IG1pbmA7XG4gIGlmIChzIDwgODY0MDApIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDM2MDApfSBoYDtcbiAgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gODY0MDApfSBkYDtcbn1cblxuLy8gR0VUIGdlblx1MDBFOXJpY28gbmEgQVBJIGRvIFN5bmN0aGluZyAoaGVhZGVyIFgtQVBJLUtleTsgcmVxdWVzdFVybCBpZ25vcmEgQ09SUykuXG5hc3luYyBmdW5jdGlvbiBzdEdldDxUPihiYXNlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgdXJsID0gYmFzZS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7IHVybCwgbWV0aG9kOiBcIkdFVFwiLCBoZWFkZXJzOiB7IFwiWC1BUEktS2V5XCI6IGtleSB9LCB0aHJvdzogZmFsc2UgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJBUEkga2V5IGludlx1MDBFMWxpZGEgKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVDtcbn1cblxuLy8gVVJMIHBhcmEgYWJyaXIgYSB0YXJlZmEgbm8gVG9kb2lzdCAodXNhIGEgZG8gcGF5bG9hZCBvdSBtb250YSBhIHBhcnRpciBkbyBpZCkuXG5mdW5jdGlvbiB0YXNrVXJsKHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHtcbiAgcmV0dXJuIHQudXJsID8/IGBodHRwczovL2FwcC50b2RvaXN0LmNvbS9hcHAvdGFzay8ke3QuaWR9YDtcbn1cblxuLy8gQ29uY2x1aSAoZmVjaGEpIHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gUE9TVCBzZW0gY29ycG87IDIwNCA9IHN1Y2Vzc28uIEZhc2UgOC4yLlxuYXN5bmMgZnVuY3Rpb24gY2xvc2VUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9jbG9zZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEVzY3JpdGE6IGNyaWFyIC8gZWRpdGFyIC8gbW92ZXIgLyBleGNsdWlyICh2MC44LjApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDYW1wb3MgZ3Jhdlx1MDBFMXZlaXMuIFRvZG9zIG9wY2lvbmFpcyBcdTIwMTQgbm8gZWRpdGFyIG1hbmRvIHNcdTAwRjMgbyBxdWUgbXVkb3UuXG5pbnRlcmZhY2UgVG9kb2lzdFdyaXRlIHtcbiAgY29udGVudD86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5PzogbnVtYmVyOyAgICAgLy8gMS4uNCAoNCA9IHVyZ2VudGUgLyBwMSBuYSBVSSlcbiAgZHVlX2RhdGU/OiBzdHJpbmc7ICAgICAvLyBkYXRhIGZpeGEgWVlZWS1NTS1ERCAodmluZG8gZG8gY2FsZW5kXHUwMEUxcmlvKVxuICBkdWVfc3RyaW5nPzogc3RyaW5nOyAgIC8vIGxpbmd1YWdlbSBuYXR1cmFsOyBcIm5vIGRhdGVcIiBsaW1wYSBhIGRhdGFcbiAgZHVlX2xhbmc/OiBzdHJpbmc7ICAgICAvLyBcInB0XCIgXHUyMTkyIGludGVycHJldGEgZW0gcG9ydHVndVx1MDBFQXNcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGpzb25IZWFkZXJzKHRva2VuOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH07XG59XG5cbi8vIENyaWEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3MgXHUyMTkyIDIwMCBjb20gYSB0YXJlZmEgY3JpYWRhLlxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgZmllbGRzOiBUb2RvaXN0V3JpdGUpOiBQcm9taXNlPFRvZG9pc3RUYXNrPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIixcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmaWVsZHMpLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFRvZG9pc3RUYXNrO1xufVxuXG4vLyBFZGl0YSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcy97aWR9IFx1MjE5MiAyMDAuIE5cdTAwRTNvIHRyb2NhIGRlIHByb2pldG8gKHVzZSBtb3ZlVG9kb2lzdFRhc2spLlxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgZmllbGRzOiBUb2RvaXN0V3JpdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmaWVsZHMpLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gTW92ZSBhIHRhcmVmYSBwYXJhIG91dHJvIHByb2pldG8uIFBPU1QgL3Rhc2tzL3tpZH0vbW92ZSBcdTIxOTIgMjAwLlxuYXN5bmMgZnVuY3Rpb24gbW92ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHByb2plY3RfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vbW92ZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwcm9qZWN0X2lkIH0pLFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIEV4Y2x1aSBhIHRhcmVmYS4gREVMRVRFIC90YXNrcy97aWR9IFx1MjE5MiAyMDQuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDQgJiYgcmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBEYXRhIGRlIHZlbmNpbWVudG8gKFlZWVktTU0tREQpIGRlIHVtYSB0YXJlZmEsIG91IG51bGwgc2Ugc2VtIGR1ZS5cbmZ1bmN0aW9uIGR1ZUtleSh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBkID0gdC5kdWU/LmRhdGUgPz8gdC5kdWU/LmRhdGV0aW1lO1xuICByZXR1cm4gZCA/IGQuc3Vic3RyaW5nKDAsIDEwKSA6IG51bGw7XG59XG5cbi8vIEEgdGFyZWZhIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvIChpbnN0cnVcdTAwRTdcdTAwRjVlcyk/XG5mdW5jdGlvbiBoYXNEZXNjKHQ6IFRvZG9pc3RUYXNrKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIXQuZGVzY3JpcHRpb24gJiYgdC5kZXNjcmlwdGlvbi50cmltKCkubGVuZ3RoID4gMDtcbn1cbmNvbnN0IERFU0NfTUFYID0gNzAwOyAgIC8vIGNvcnRlIGRhIGRlc2NyaVx1MDBFN1x1MDBFM28gbm8gdG9vbHRpcCAobyByZXN0byBmaWNhIG5vIFRvZG9pc3QpXG5cbi8vIEZ1blx1MDBFN1x1MDBFM28gZ2xvYmFsIGV4cG9zdGEgcGVsbyBwbHVnaW4gXCJIZWF0bWFwIENhbGVuZGFyXCIgKHF1YW5kbyBoYWJpbGl0YWRvKS5cbnR5cGUgSGVhdG1hcEVudHJ5ID0geyBkYXRlOiBzdHJpbmc7IGludGVuc2l0eT86IG51bWJlcjsgY29sb3I/OiBzdHJpbmc7IGNvbnRlbnQ/OiBzdHJpbmcgfTtcbnR5cGUgSGVhdG1hcERhdGEgPSB7XG4gIHllYXI6IG51bWJlcjtcbiAgY29sb3JzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT47XG4gIGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdO1xuICBzaG93Q3VycmVudERheUJvcmRlcj86IGJvb2xlYW47XG59O1xuZnVuY3Rpb24gZ2V0SGVhdG1hcFJlbmRlcmVyKCk6ICgoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgfCBudWxsIHtcbiAgY29uc3QgZm4gPSAod2luZG93IGFzIHVua25vd24gYXMgeyByZW5kZXJIZWF0bWFwQ2FsZW5kYXI/OiB1bmtub3duIH0pLnJlbmRlckhlYXRtYXBDYWxlbmRhcjtcbiAgcmV0dXJuIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiID8gKGZuIGFzIChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IEhlYXRtYXBEYXRhKSA9PiB2b2lkKSA6IG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVdGlsaWRhZGVzIGRlIGRhdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGlzb1dlZWtOdW1iZXIoZGF0ZTogRGF0ZSk6IG51bWJlciB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShEYXRlLlVUQyhkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCkpKTtcbiAgY29uc3QgZG93ID0gZC5nZXRVVENEYXkoKSB8fCA3O1xuICBkLnNldFVUQ0RhdGUoZC5nZXRVVENEYXRlKCkgKyA0IC0gZG93KTtcbiAgY29uc3QgeTAgPSBuZXcgRGF0ZShEYXRlLlVUQyhkLmdldFVUQ0Z1bGxZZWFyKCksIDAsIDEpKTtcbiAgcmV0dXJuIE1hdGguY2VpbCgoKGQuZ2V0VGltZSgpIC0geTAuZ2V0VGltZSgpKSAvIDg2XzQwMF8wMDAgKyAxKSAvIDcpO1xufVxuXG5mdW5jdGlvbiBtb25kYXlPZihvZmZzZXQ6IG51bWJlcik6IERhdGUge1xuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBkb3cgPSBub3cuZ2V0RGF5KCkgfHwgNztcbiAgY29uc3QgZCA9IG5ldyBEYXRlKG5vdyk7XG4gIGQuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpIC0gZG93ICsgMSArIG9mZnNldCAqIDcpO1xuICBkLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZDtcbn1cblxuZnVuY3Rpb24gdG9LZXkoZDogRGF0ZSk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtkLmdldEZ1bGxZZWFyKCl9LSR7U3RyaW5nKGQuZ2V0TW9udGgoKSsxKS5wYWRTdGFydCgyLFwiMFwiKX0tJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfWA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGUodmFsOiB1bmtub3duKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdmFsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWwuc3Vic3RyaW5nKDAsIDEwKTtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHJldHVybiB2YWwudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApO1xuICBjb25zdCBzID0gU3RyaW5nKHZhbCk7XG4gIHJldHVybiBzLm1hdGNoKC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0vKSA/IHMuc3Vic3RyaW5nKDAsIDEwKSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHRvZGF5QlIoKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIiwge1xuICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICB9KTtcbn1cblxuLy8gVG9kb3Mgb3MgY2FtaW5ob3MgZGUgcGFzdGEgZG8gY29mcmUgKHJlY3Vyc2l2byksIGlnbm9yYW5kbyBvY3VsdGFzICgub2JzaWRpYW4gZXRjLiksXG4vLyBlbSBvcmRlbSBhbGZhYlx1MDBFOXRpY2EgXHUyMDE0IHVzYWRvIG5vIHNlbGV0b3IgZGUgZm9udGVzIGRhIFNlbWFuYS5cbmZ1bmN0aW9uIGFsbEZvbGRlclBhdGhzKGFwcDogQXBwKTogc3RyaW5nW10ge1xuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgIWMubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgeyBvdXQucHVzaChjLnBhdGgpOyB3YWxrKGMpOyB9XG4gICAgfVxuICB9O1xuICB3YWxrKGFwcC52YXVsdC5nZXRSb290KCkpO1xuICByZXR1cm4gb3V0LnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG59XG5cbi8vIGRkL21tIGEgcGFydGlyIGRlIHVtIHRpbWVzdGFtcCAobXRpbWUpXG5mdW5jdGlvbiBmbXRTaG9ydCh0czogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKHRzKTtcbiAgcmV0dXJuIGAke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSsxKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBwYXN0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ29udGEgbm90YXMgcmV2aXNhZGFzIChyZXZpZXdlZDogdHJ1ZSkgdnMgdG90YWwgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gcmV2aWV3ZWRTdGF0cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyByZXZpZXdlZDogbnVtYmVyOyB0b3RhbDogbnVtYmVyIH0ge1xuICBsZXQgcmV2aWV3ZWQgPSAwLCB0b3RhbCA9IDA7XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgIHRvdGFsKys7XG4gICAgICAgIGlmIChhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShjLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWUpIHJldmlld2VkKys7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICByZXR1cm4geyByZXZpZXdlZCwgdG90YWwgfTtcbn1cblxuLy8gQ29udGEgbWQgKGV4Y2V0byBzdGF0dXMubWQpIGUgaW1hZ2VucyBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiBmb2xkZXJTdGF0cyhmb2xkZXI6IFRGb2xkZXIpOiB7IG1kOiBudW1iZXI7IGltZzogbnVtYmVyIH0ge1xuICBsZXQgbWQgPSAwLCBpbWcgPSAwO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICBpZiAoYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIG1kKys7XG4gICAgICAgIGVsc2UgaWYgKElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKSBpbWcrKztcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIHJldHVybiB7IG1kLCBpbWcgfTtcbn1cblxuLy8gVGV4dG8gZGUgY29udGFnZW0gcGFkcm9uaXphZG8gcGFyYSBvcyBjYXJkcyAobm90YXMgKyBpbWFnZW5zLCBxdWFuZG8gaG91dmVyKS5cbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbi8vIEFzIE4gbm90YXMgLm1kIG1vZGlmaWNhZGFzIG1haXMgcmVjZW50ZW1lbnRlIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIHJlY2VudE5vdGVzKGZvbGRlcjogVEZvbGRlciwgbjogbnVtYmVyKTogVEZpbGVbXSB7XG4gIGNvbnN0IGZpbGVzOiBURmlsZVtdID0gW107XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSBmaWxlcy5wdXNoKGMpO1xuICAgICAgZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIGZpbGVzLnNvcnQoKGEsIGIpID0+IGIuc3RhdC5tdGltZSAtIGEuc3RhdC5tdGltZSk7XG4gIHJldHVybiBmaWxlcy5zbGljZSgwLCBuKTtcbn1cblxuLy8gUGFzdGEgXCJkZSBhc3NldHNcIjogc1x1MDBGMyB0ZW0gaW1hZ2VucywgbmVuaHVtYSBub3RhIFx1MjE5MiBlc2NvbmRpZGEgbm8gbmF2ZWdhZG9yIGludGVybm8uXG5mdW5jdGlvbiBpc0Fzc2V0Rm9sZGVyKGZvbGRlcjogVEZvbGRlcik6IGJvb2xlYW4ge1xuICBjb25zdCB7IG1kLCBpbWcgfSA9IGZvbGRlclN0YXRzKGZvbGRlcik7XG4gIHJldHVybiBpbWcgPiAwICYmIG1kID09PSAwO1xufVxuXG5mdW5jdGlvbiBzdWJGb2xkZXJzKGZvbGRlcjogVEZvbGRlcik6IFRGb2xkZXJbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgLmZpbHRlcihmID0+ICFpc0Fzc2V0Rm9sZGVyKGYpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xufVxuXG5mdW5jdGlvbiBjb3ZlckluRm9sZGVyKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gMS4gQ2FtcG8gY292ZXI6IG5vIHN0YXR1cy5tZCAoYWNlaXRhIGNhbWluaG8gZGlyZXRvIG91IHdpa2lsaW5rIFtbLi4uXV0pXG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgaWYgKHNmKSB7XG4gICAgY29uc3QgcmF3ID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5jb3ZlcjtcbiAgICBpZiAodHlwZW9mIHJhdyA9PT0gXCJzdHJpbmdcIiAmJiByYXcudHJpbSgpKSB7XG4gICAgICBjb25zdCBsaW5rcGF0aCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiE/XFxbXFxbLywgXCJcIikucmVwbGFjZSgvXFxdXFxdJC8sIFwiXCIpLnNwbGl0KFwifFwiKVswXS50cmltKCk7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmtwYXRoLCBzZi5wYXRoKTtcbiAgICAgIGlmIChyZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlICYmIElNR19FWFQuaW5jbHVkZXMocmVzb2x2ZWQuZXh0ZW5zaW9uKSlcbiAgICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgocmVzb2x2ZWQpO1xuICAgIH1cbiAgfVxuICAvLyAyLiBGYWxsYmFjazogYXJxdWl2byBfY292ZXIuKiBuYSBwYXN0YVxuICBmb3IgKGNvbnN0IGMgb2YgZm9sZGVyLmNoaWxkcmVuKSB7XG4gICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmJhc2VuYW1lID09PSBcIl9jb3ZlclwiICYmIElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKVxuICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgoYyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHJlYWRGb2xkZXJTdGF0dXMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IFN0YXR1cyB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgcyA9IHNmICYmIGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuZnVuY3Rpb24gcmVhZE5vdGVTdGF0dXMoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogU3RhdHVzIHtcbiAgY29uc3QgcyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXJnXHUwMEVBbmNpYSAocHJvcHJpZWRhZGUgYHVyZ2VuY3lgKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbnR5cGUgVXJnZW5jeSA9IFwiYWx0YVwiIHwgXCJtZWRpYVwiIHwgXCJiYWl4YVwiO1xuY29uc3QgVVJHRU5DWV9SQU5LOiBSZWNvcmQ8VXJnZW5jeSwgbnVtYmVyPiA9IHsgYmFpeGE6IDEsIG1lZGlhOiAyLCBhbHRhOiAzIH07XG5jb25zdCBVUkdFTkNZX0NPTE9SOiBSZWNvcmQ8VXJnZW5jeSwgc3RyaW5nPiA9IHsgYWx0YTogXCIjRUY0NDQ0XCIsIG1lZGlhOiBcIiNGNTlFMEJcIiwgYmFpeGE6IFwiI0VBQjMwOFwiIH07XG5cbmZ1bmN0aW9uIHJlYWROb3RlVXJnZW5jeShhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBVcmdlbmN5IHwgbnVsbCB7XG4gIGNvbnN0IHUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8udXJnZW5jeTtcbiAgcmV0dXJuIHUgPT09IFwiYWx0YVwiIHx8IHUgPT09IFwibWVkaWFcIiB8fCB1ID09PSBcImJhaXhhXCIgPyB1IDogbnVsbDtcbn1cblxudHlwZSBVcmdlbmN5SW5mbyA9IHsgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXTsgbWF4OiBVcmdlbmN5IHwgbnVsbCB9O1xuXG4vLyBOb3RhcyBjb20gYHVyZ2VuY3lgIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZSArIG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbyAob3JkZW5hZGFzIHBvciBuXHUwMEVEdmVsIGRlc2MpLlxuZnVuY3Rpb24gdXJnZW5jeVN0YXRzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBVcmdlbmN5SW5mbyB7XG4gIGNvbnN0IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIHtcbiAgICAgICAgY29uc3QgdSA9IHJlYWROb3RlVXJnZW5jeShhcHAsIGMpO1xuICAgICAgICBpZiAodSkgaXRlbXMucHVzaCh7IGZpbGU6IGMsIGxldmVsOiB1IH0pO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgbGV0IG1heDogVXJnZW5jeSB8IG51bGwgPSBudWxsO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSBpZiAoIW1heCB8fCBVUkdFTkNZX1JBTktbaXQubGV2ZWxdID4gVVJHRU5DWV9SQU5LW21heF0pIG1heCA9IGl0LmxldmVsO1xuICBpdGVtcy5zb3J0KChhLCBiKSA9PiBVUkdFTkNZX1JBTktbYi5sZXZlbF0gLSBVUkdFTkNZX1JBTktbYS5sZXZlbF0pO1xuICByZXR1cm4geyBpdGVtcywgbWF4IH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBcnF1aXZvcyBleGliXHUwMEVEdmVpczogbm90YSAoLm1kKSAvIGNhbnZhcyAoLmNhbnZhcykgLyBiYXNlICguYmFzZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBGSUxFX0VYVFMgPSBbXCJtZFwiLCBcImNhbnZhc1wiLCBcImJhc2VcIl07XG4vLyBpZCBMdWNpZGUgcG9yIHRpcG8gZGUgYXJxdWl2by5cbmZ1bmN0aW9uIGZpbGVHbHlwaChleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChleHQgPT09IFwiY2FudmFzXCIpIHJldHVybiBcInNoYXBlc1wiO1xuICBpZiAoZXh0ID09PSBcImJhc2VcIikgcmV0dXJuIFwidGFibGUtMlwiO1xuICByZXR1cm4gXCJmaWxlLXRleHRcIjtcbn1cbmZ1bmN0aW9uIGZpbGVzSW4oZm9sZGVyOiBURm9sZGVyKTogVEZpbGVbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihcbiAgICBjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBGSUxFX0VYVFMuaW5jbHVkZXMoYy5leHRlbnNpb24pICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIlxuICApIGFzIFRGaWxlW10pLnNvcnQoKGEsIGIpID0+IGEuYmFzZW5hbWUubG9jYWxlQ29tcGFyZShiLmJhc2VuYW1lLCBcInB0XCIpKTtcbn1cblxuLy8gXHUwMENEY29uZSBkZWZpbmlkbyBlbSBgaWNvbjpgIG5vIHN0YXR1cy5tZCBkYSBwYXN0YSAoZW1vamkgb3UgaWQgTHVjaWRlKS4gbnVsbCBzZSBhdXNlbnRlLlxuZnVuY3Rpb24gcmVhZEZvbGRlckljb24oYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IGljID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5pY29uO1xuICByZXR1cm4gdHlwZW9mIGljID09PSBcInN0cmluZ1wiICYmIGljLnRyaW0oKSA/IGljLnRyaW0oKSA6IG51bGw7XG59XG5cbi8vIGlkIEx1Y2lkZSAoc1x1MDBGMyBbYS16MC05LV0pIFx1MjE5MiBzZXRJY29uIG5hdGl2bzsgY2FzbyBjb250clx1MDBFMXJpbyB0cmF0YSBjb21vIGVtb2ppL3RleHRvLlxuZnVuY3Rpb24gcmVuZGVySWNvbihlbDogSFRNTEVsZW1lbnQsIGljb246IHN0cmluZykge1xuICBpZiAoL15bYS16MC05LV0rJC8udGVzdChpY29uKSkgc2V0SWNvbihlbCwgaWNvbik7XG4gIGVsc2UgZWwuc2V0VGV4dChpY29uKTtcbn1cblxuLy8gQ29yIGVzdFx1MDBFMXZlbCBhIHBhcnRpciBkbyBub21lIChwYXJhIHBhc3RhcyBmb3JhIGRvIFBBUkEpLlxuZnVuY3Rpb24gYWNjZW50Rm9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIG5hbWUuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gIHJldHVybiBBQ0NFTlRTW2ggJSBBQ0NFTlRTLmxlbmd0aF07XG59XG5cbi8vIFx1MDBDRGNvbmUgLyByXHUwMEYzdHVsbyAvIGNvciBkZSB1bWEgcGFzdGEgZGUgdG9wbzogdXNhIG8gUEFSQSBzZSBjb25oZWNpZGEsIHNlblx1MDBFM28gZGVyaXZhLlxuZnVuY3Rpb24gZm9sZGVyTWV0YShhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyBpY29uOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IGFjY2VudDogc3RyaW5nIH0ge1xuICBjb25zdCBrbm93biA9IFBBUkFfTUFQLmdldChmb2xkZXIucGF0aCk7XG4gIGNvbnN0IGN1c3RvbSA9IHJlYWRGb2xkZXJJY29uKGFwcCwgZm9sZGVyKTtcbiAgcmV0dXJuIHtcbiAgICBpY29uOiAgIGN1c3RvbSA/PyBrbm93bj8uaWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiLFxuICAgIGxhYmVsOiAga25vd24/LmxhYmVsID8/IGZvbGRlci5uYW1lLFxuICAgIGFjY2VudDoga25vd24/LmFjY2VudCA/PyBhY2NlbnRGb3IoZm9sZGVyLm5hbWUpLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXZlYWxJbkV4cGxvcmVyKGFwcDogQXBwLCB0YXJnZXQ6IHVua25vd24pIHtcbiAgdHlwZSBFeHBQbHVnaW4gPSB7IGluc3RhbmNlOiB7IHJldmVhbEluRm9sZGVyKGY6IHVua25vd24pOiB2b2lkIH0gfTtcbiAgY29uc3QgZXhwID0gKGFwcCBhcyBBcHAgJiB7XG4gICAgaW50ZXJuYWxQbHVnaW5zOiB7IGdldFBsdWdpbkJ5SWQoaWQ6IHN0cmluZyk6IEV4cFBsdWdpbiB8IG51bGwgfTtcbiAgfSkuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoXCJmaWxlLWV4cGxvcmVyXCIpO1xuICBpZiAoZXhwICYmIHRhcmdldCkgZXhwLmluc3RhbmNlLnJldmVhbEluRm9sZGVyKHRhcmdldCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgY2FsU291cmNlc09wZW4gPSBmYWxzZTsgICAvLyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEgYWJlcnRvXG5cbiAgLy8gRXN0YWRvIGRhIGludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcbiAgcHJpdmF0ZSB0b2RvaXN0VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgcHJpdmF0ZSB0b2RvaXN0UHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSB0b2RvaXN0UHJvamVjdE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7ICAgLy8gaWQgXHUyMTkyIG5vbWVcbiAgcHJpdmF0ZSB0b2RvaXN0TGFiZWxDb2xvciA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7ICAgLy8gbm9tZSBkYSBldGlxdWV0YSBcdTIxOTIgaGV4XG4gIHByaXZhdGUgdG9kb2lzdExvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b2RvaXN0RXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvZG9pc3RGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIHRvZG9pc3RMYXRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b2RvaXN0RmlsdGVyT3BlbiA9IGZhbHNlO1xuXG4gIC8vIEVzdGFkbyBkbyBTeW5jdGhpbmcgKHYwLjEwLjApXG4gIHByaXZhdGUgc3luY0RhdGE6IFN5bmNEYXRhIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzeW5jRXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIGNvbmZsaWN0Q29uZmlybTogc3RyaW5nIHwgbnVsbCA9IG51bGw7ICAgLy8gcGF0aCBkbyBjb25mbGl0byBhZ3VhcmRhbmRvIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihsZWFmKTsgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJEYXNoYm9hcmRcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGF5b3V0LWRhc2hib2FyZFwiOyB9XG5cbiAgYXN5bmMgb25PcGVuKCkge1xuICAgIGF3YWl0IHRoaXMucmVuZGVyKCk7XG4gICAgZm9yIChjb25zdCBldiBvZiBbXCJtb2RpZnlcIiwgXCJjcmVhdGVcIiwgXCJkZWxldGVcIiwgXCJyZW5hbWVcIl0gYXMgY29uc3QpXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oZXYgYXMgXCJtb2RpZnlcIiwgKCkgPT4gdGhpcy5zY2hlZHVsZSgpKSk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCkgeyB0aGlzLmhpZGVUaXAoKTsgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGUoKSB7XG4gICAgaWYgKHRoaXMudGltZXIpIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlbmRlcigpLCA0MDApO1xuICB9XG5cbiAgLy8gUHJpbWVpcm8gc2VnbWVudG8gZGUgdW0gY2FtaW5obyAoXCIxMC5Qcm9qZWN0cy9Gb28vQmFyXCIgXHUyMTkyIFwiMTAuUHJvamVjdHNcIikuXG4gIHByaXZhdGUgdG9wRm9sZGVyT2YocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBpID0gcGF0aC5pbmRleE9mKFwiL1wiKTtcbiAgICByZXR1cm4gaSA9PT0gLTEgPyBwYXRoIDogcGF0aC5zbGljZSgwLCBpKTtcbiAgfVxuXG4gIGFzeW5jIHJlbmRlcigpIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHJvb3QuYWRkQ2xhc3MoXCJ3ZC1yb290XCIpO1xuICAgIHJvb3QudG9nZ2xlQ2xhc3MoXCJ3ZC1jb21wYWN0XCIsIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QpO1xuXG4gICAgdGhpcy5yZW5kZXJIZWFkZXIocm9vdCk7XG4gICAgZm9yIChjb25zdCBpZCBvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXIpIHtcbiAgICAgIGlmIChpZCA9PT0gXCJjYWxlbmRhclwiKSAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInBhcmFcIikgICAgdGhpcy5yZW5kZXJQYXJhKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwiaGVhdG1hcFwiKSB0aGlzLnJlbmRlckhlYXRtYXAocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJncm93dGhcIikgIHRoaXMucmVuZGVyR3Jvd3RoKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwic3RhdHNcIikgICB0aGlzLnJlbmRlclN0YXRzKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3Qocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJzeW5jXCIpICAgIHRoaXMucmVuZGVyU3luYyhyb290KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ29udHJvbGVzIGRlIG9yZGVtIGRlIHNlXHUwMEU3XHUwMEUzbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIG1vdmVDb250cm9scyhob3N0OiBIVE1MRWxlbWVudCwgaWQ6IFNlY3Rpb25JZCkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBjdHJsID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbW92ZS1jdHJsXCIgfSk7XG5cbiAgICBjb25zdCB1cCA9IGN0cmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1tb3ZlLWJ0blwiICsgKGkgPD0gMCA/IFwiIHdkLW1vdmUtb2ZmXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1QjJcIiB9KTtcbiAgICB1cC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBzZVx1MDBFN1x1MDBFM28gcGFyYSBjaW1hXCIpO1xuICAgIGlmIChpID4gMCkgdXAub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm1vdmVTZWN0aW9uKGlkLCAtMSk7IH07XG5cbiAgICBjb25zdCBkb3duID0gY3RybC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW1vdmUtYnRuXCIgKyAoaSA+PSBvcmRlci5sZW5ndGggLSAxID8gXCIgd2QtbW92ZS1vZmZcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVCQ1wiIH0pO1xuICAgIGRvd24uc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgc2VcdTAwRTdcdTAwRTNvIHBhcmEgYmFpeG9cIik7XG4gICAgaWYgKGkgPCBvcmRlci5sZW5ndGggLSAxKSBkb3duLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5tb3ZlU2VjdGlvbihpZCwgKzEpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBtb3ZlU2VjdGlvbihpZDogU2VjdGlvbklkLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IG9yZGVyID0gWy4uLnRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gb3JkZXI7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBPY3VsdGFyIC8gcmVzdGF1cmFyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVCdG4oaG9zdDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBjbHMgPSBcIndkLWhpZGUtYnRuXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzIH0pO1xuICAgIHNldEljb24oYiwgXCJleWUtb2ZmXCIpO1xuICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICBiLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5oaWRlSXRlbShrZXkpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoaWRlSXRlbShrZXk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKGtleSkpIHJldHVybjtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIC8vIFNlIGVzdFx1MDBFMXZhbW9zIGRlbnRybyBkYSBwYXN0YSBxdWUgYWNhYm91IGRlIHNlciBvY3VsdGEsIGZlY2hhIG8gbmF2ZWdhZG9yLlxuICAgIGlmICh0aGlzLm5hdlBhdGggJiYgKHRoaXMubmF2UGF0aCA9PT0ga2V5IHx8IHRoaXMubmF2UGF0aC5zdGFydHNXaXRoKGtleSArIFwiL1wiKSkpIHRoaXMubmF2UGF0aCA9IG51bGw7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdW5oaWRlSXRlbShrZXk6IHN0cmluZykge1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5maWx0ZXIoayA9PiBrICE9PSBrZXkpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGhpZGRlbkxhYmVsKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoa2V5ID09PSBTRUNfQ0FMKSByZXR1cm4gXCJcdUQ4M0RcdURDQzUgQ2FsZW5kXHUwMEUxcmlvXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX0hFQVQpIHJldHVybiBcIlx1RDgzRFx1REQyNSBIZWF0bWFwXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX0dST1cpIHJldHVybiBcIlx1RDgzRFx1RENDOCBDcmVzY2ltZW50b1wiO1xuICAgIGlmIChrZXkgPT09IFNFQ19TVEFUKSByZXR1cm4gXCJcdUQ4M0RcdURDQ0EgRXN0YXRcdTAwRURzdGljYXNcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfVE9ETykgcmV0dXJuIFwiXHVEODNEXHVEQ0NCIFRhcmVmYXNcIjtcbiAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGtleSk7XG4gICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURm9sZGVyID8gZi5uYW1lIDoga2V5O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJIaWRkZW5CYXIocGFyZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGhpZGRlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbjtcbiAgICBpZiAoIWhpZGRlbi5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBiYXIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhpZGRlbi1iYXJcIiB9KTtcbiAgICBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1oaWRkZW4tbGFiZWxcIiwgdGV4dDogXCJvY3VsdG9zOlwiIH0pO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGhpZGRlbikge1xuICAgICAgY29uc3QgY2hpcCA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWhpZGRlbi1jaGlwXCIgfSk7XG4gICAgICAvLyBQYXN0YSBvY3VsdGEgY29tIG5vdGFzIHVyZ2VudGVzIFx1MjE5MiBjb250b3JubyBwZWxhIGNvciBkbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vLlxuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChrZXkpO1xuICAgICAgY29uc3QgdXJnID0gZiBpbnN0YW5jZW9mIFRGb2xkZXIgPyB1cmdlbmN5U3RhdHModGhpcy5hcHAsIGYpIDogeyBpdGVtczogW10sIG1heDogbnVsbCB9O1xuICAgICAgaWYgKHVyZy5tYXgpIHtcbiAgICAgICAgY2hpcC5hZGRDbGFzcyhcIndkLWhpZGRlbi11cmdlbnRcIik7XG4gICAgICAgIGNoaXAuYWRkQ2xhc3MoYHdkLXUtJHt1cmcubWF4fWApO1xuICAgICAgICBjaGlwLnN0eWxlLmJvcmRlckNvbG9yID0gVVJHRU5DWV9DT0xPUlt1cmcubWF4XTtcbiAgICAgIH1cbiAgICAgIHNldEljb24oY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNoaXAtaWNvblwiIH0pLCBcImV5ZVwiKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IHRoaXMuaGlkZGVuTGFiZWwoa2V5KSB9KTtcbiAgICAgIGNoaXAuc2V0QXR0cihcInRpdGxlXCIsIHVyZy5tYXhcbiAgICAgICAgPyBgTW9zdHJhciBub3ZhbWVudGUgXHUyMDE0ICR7dXJnLml0ZW1zLmxlbmd0aH0gbm90YShzKSB1cmdlbnRlKHMpYFxuICAgICAgICA6IFwiTW9zdHJhciBub3ZhbWVudGVcIik7XG4gICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB0aGlzLnVuaGlkZUl0ZW0oa2V5KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gUG9zaWNpb25hIHVtIHRvb2x0aXAgZml4byBhYmFpeG8gZG8gYWx2byAodmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvKS5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2OyAgLy8gdmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvXG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgbGlzdGFuZG8gYXMgbm90YXMgdXJnZW50ZXMgZGUgdW1hIHBhc3RhIChob3ZlciBubyBiYWRnZSBkZSBhdmlzbykuXG4gIHByaXZhdGUgc2hvd1VyZ2VuY3lUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdXJnZW5jeS10aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIlVyZ2VudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXV0aXAtZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IFVSR0VOQ1lfQ09MT1JbaXQubGV2ZWxdO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogaXQuZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGl0LmxldmVsIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIEJhZGdlIGRlIGF2aXNvICh0cmlcdTAwRTJuZ3Vsbykgbm8gY2FyZCBkZSBwYXN0YSBxdWUgY29udFx1MDBFOW0gbm90YXMgY29tIGB1cmdlbmN5YC5cbiAgLy8gQ29yIHBlbG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbzsgaG92ZXIgbGlzdGEgb3MgYXJxdWl2b3MuIEZhc2UgMTAuXG4gIHByaXZhdGUgdXJnZW5jeUJhZGdlKGNhcmQ6IEhUTUxFbGVtZW50LCB1cmc6IFVyZ2VuY3lJbmZvKSB7XG4gICAgaWYgKCF1cmcubWF4KSByZXR1cm47XG4gICAgY29uc3QgYiA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktYmFkZ2Ugd2QtdS0ke3VyZy5tYXh9YCB9KTtcbiAgICBzZXRJY29uKGIsIFwidHJpYW5nbGUtYWxlcnRcIik7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dVcmdlbmN5VGlwKGIsIHVyZy5pdGVtcykpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3QgcmVjZW50cyA9IHJlY2VudE5vdGVzKGZvbGRlciwgNCk7XG4gICAgaWYgKCFyZWNlbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGlwKGNhcmQsIHJlY2VudHMpKTtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYWxlbmRcdTAwRTFyaW8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYWxlbmRhcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19DQUwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtb25kYXkgID0gbW9uZGF5T2YodGhpcy53ZWVrT2Zmc2V0KTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuICAgIGNvbnN0IHRvZGF5SyAgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIEZvbnRlcyBhdGl2YXMgKHBhc3RhcyBtYXJjYWRhcykuIEEgY29yIGRlIGNhZGEgbm90YSB2ZW0gZGEgZm9udGUgZGVcbiAgICAvLyBwcmVmaXhvIG1haXMgZXNwZWNcdTAwRURmaWNvIHF1ZSBhIGNvbnRcdTAwRTltLlxuICAgIGNvbnN0IHNvdXJjZXMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMuZmlsdGVyKHMgPT4gcy5vbik7XG4gICAgY29uc3QgY29sb3JGb3IgPSAocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBsZXQgYmVzdDogQ2FsU291cmNlIHwgbnVsbCA9IG51bGw7XG4gICAgICBmb3IgKGNvbnN0IHMgb2Ygc291cmNlcykge1xuICAgICAgICBpZiAocGF0aCA9PT0gYCR7cy5wYXRofS5tZGAgfHwgcGF0aC5zdGFydHNXaXRoKGAke3MucGF0aH0vYCkpIHtcbiAgICAgICAgICBpZiAoIWJlc3QgfHwgcy5wYXRoLmxlbmd0aCA+IGJlc3QucGF0aC5sZW5ndGgpIGJlc3QgPSBzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdCA/IGJlc3QuY29sb3IgOiBudWxsO1xuICAgIH07XG5cbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IGZpbGU6IFRGaWxlOyBjb2xvcjogc3RyaW5nIH1bXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBjb2xvciA9IGNvbG9yRm9yKGZpbGUucGF0aCk7XG4gICAgICBpZiAoIWNvbG9yKSBjb250aW51ZTsgICAvLyBzXHUwMEYzIG5vdGFzIGRlbnRybyBkZSB1bWEgZm9udGUgbWFyY2FkYVxuICAgICAgY29uc3QgbSA9IGZpbGUuYmFzZW5hbWUubWF0Y2goL14oXFxkezR9LVxcZHsyfS1cXGR7Mn0pLyk7XG4gICAgICBjb25zdCBkID0gbm9ybWFsaXplRGF0ZSh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgIGlmIChkKSAoYnlEYXlbZF0gPz89IFtdKS5wdXNoKHsgbmFtZTogZmlsZS5iYXNlbmFtZSwgZmlsZSwgY29sb3IgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1jYWwtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IG5hdiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hdi1iYXJcIiB9KTtcbiAgICBjb25zdCBwaG9uZSA9IFBsYXRmb3JtLmlzUGhvbmU7XG5cbiAgICAvLyBDZWx1bGFyOiBqYW5lbGEgZGUgMyBkaWFzID0gb250ZW0gXHUwMEI3IGhvamUgXHUwMEI3IGFtYW5oXHUwMEUzICh3ZWVrT2Zmc2V0IHBhZ2luYSBkZSAzIGVtIDMpLlxuICAgIGNvbnN0IGRheUFuY2hvciA9IG5ldyBEYXRlKCk7XG4gICAgZGF5QW5jaG9yLnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSAtIDEgKyB0aGlzLndlZWtPZmZzZXQgKiAzKTtcbiAgICBjb25zdCBmbXRETSA9IChkOiBEYXRlKSA9PiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSBuZXcgRGF0ZShkYXlBbmNob3IpOyBsYXN0LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIDIpO1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYCR7Zm10RE0oZGF5QW5jaG9yKX0gXHUyMDEzICR7Zm10RE0obGFzdCl9YCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYFNlbWFuYSAke3dlZWtOdW19YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHJscyA9IG5hdi5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWN0cmxzXCIgfSk7XG4gICAgY29uc3Qgc3JjQnRuID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtc3JjYnRuXCIgKyAodGhpcy5jYWxTb3VyY2VzT3BlbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICBzZXRJY29uKHNyY0J0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1zcmNpY29cIiB9KSwgXCJmb2xkZXItY29nXCIpO1xuICAgIHNyY0J0bi5zZXRBdHRyKFwidGl0bGVcIiwgXCJGb250ZXMgZG9zIGNhcmRzIGRhIHNlbWFuYVwiKTtcbiAgICBzcmNCdG4ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmNhbFNvdXJjZXNPcGVuID0gIXRoaXMuY2FsU291cmNlc09wZW47IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgcHJldiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDM5XCIgfSk7XG4gICAgY29uc3QgbmV4dCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgcHJldi5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQtLTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBuZXh0Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldCsrOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcImNhbGVuZGFyXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX0NBTCwgXCJPY3VsdGFyIGNhbGVuZFx1MDBFMXJpb1wiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgaWYgKHRoaXMuY2FsU291cmNlc09wZW4pIHRoaXMucmVuZGVyQ2FsU291cmNlcyhzZWMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENlbHVsYXI6IGxpc3RhIHZlcnRpY2FsIGRlIDMgZGlhcyAob250ZW0vaG9qZS9hbWFuaFx1MDBFMykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ2FkYSBkaWEgPSBhIG5vdGEgZGlcdTAwRTFyaWEgKHVtYSBwb3IgZGlhKS4gTGluaGEgaW50ZWlyYSBjbGljXHUwMEUxdmVsOiBhYnJlIGFcbiAgICAvLyBleGlzdGVudGU7IHNlIG5cdTAwRTNvIGhvdXZlciwgY3JpYS5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1saXN0XCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShkYXlBbmNob3IpO1xuICAgICAgICBkYXkuc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICAgIGNvbnN0IGRvdyA9IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDc7XG4gICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogW1wid2QtY2FsLWRyb3dcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBkb3cgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgcm93LnNldEF0dHIoXCJ0aXRsZVwiLCBub3RlID8gXCJBYnJpciBub3RhIGRpXHUwMEUxcmlhXCIgOiBcIkNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICAgIGNvbnN0IGhkID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1oZFwiIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtkb3ddIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1udW1cIiwgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgICBjb25zdCBib2R5ID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1ub3Rlc1wiIH0pO1xuICAgICAgICBpZiAobm90ZSkge1xuICAgICAgICAgIGNvbnN0IHBpbGwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICAgIHBpbGwudGV4dENvbnRlbnQgPSBub3RlLmJhc2VuYW1lLmxlbmd0aCA+IDI0ID8gbm90ZS5iYXNlbmFtZS5zbGljZSgwLCAyNCkgKyBcIlx1MjAyNlwiIDogbm90ZS5iYXNlbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBib2R5LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWRyb3ctZW1wdHlcIiwgdGV4dDogXCJjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcm93Lm9uY2xpY2sgPSAoKSA9PiB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBEZXNrdG9wL3RhYmxldDogZ3JhZGUgZGUgNyBkaWFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBoZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7IH07XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0td2Qtc3JjXCIsIGl0LmNvbG9yKTtcbiAgICAgICAgcGlsbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1waWxsLWRvdFwiIH0pO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtdHh0XCIsIHRleHQ6IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lIH0pO1xuICAgICAgICBwaWxsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoaXQuZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNlbGV0b3IgZGUgZm9udGVzIGRhIFNlbWFuYTogbWFyY2EgcXVhaXMgcGFzdGFzIGFsaW1lbnRhbSBvcyBjYXJkcywgY29tIGNvclxuICAvLyBwb3IgZm9udGUuIFwiKyBwYXN0YVwiIGFkaWNpb25hIHF1YWxxdWVyIHBhc3RhIGRvIGNvZnJlOyBcdTAwRDcgcmVtb3ZlLlxuICBwcml2YXRlIHJlbmRlckNhbFNvdXJjZXMoc2VjOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNyY3MgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXM7XG4gICAgY29uc3QgYmFyID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtc3JjYmFyXCIgfSk7XG5cbiAgICBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtc3JjbGFiZWxcIiwgdGV4dDogXCJGb250ZXMgZG9zIGNhcmRzXCIgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHMgb2Ygc3Jjcykge1xuICAgICAgY29uc3QgY2hpcCA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1zcmNjaGlwXCIgKyAocy5vbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtc3JjZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IHMuY29sb3I7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXNyY25hbWVcIiwgdGV4dDogcy5wYXRoIH0pO1xuICAgICAgY2hpcC5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBzLm9uID0gIXMub247IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgY29uc3Qgcm0gPSBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXNyY3JtXCIsIHRleHQ6IFwiXHUwMEQ3XCIgfSk7XG4gICAgICBybS5zZXRBdHRyKFwidGl0bGVcIiwgXCJSZW1vdmVyIGZvbnRlXCIpO1xuICAgICAgcm0ub25jbGljayA9IGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IHNyY3MuZmlsdGVyKHggPT4geCAhPT0gcyk7XG4gICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBQYXN0YXMgZG8gY29mcmUgYWluZGEgblx1MDBFM28gdXNhZGFzIGNvbW8gZm9udGUgXHUyMTkyIFwiKyBhZGljaW9uYXJcIi5cbiAgICBjb25zdCB1c2VkID0gbmV3IFNldChzcmNzLm1hcChzID0+IHMucGF0aCkpO1xuICAgIGNvbnN0IGF2YWlsYWJsZSA9IGFsbEZvbGRlclBhdGhzKHRoaXMuYXBwKS5maWx0ZXIocCA9PiAhdXNlZC5oYXMocCkpO1xuICAgIGlmIChhdmFpbGFibGUubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhZGQgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1zcmNhZGRcIiB9KTtcbiAgICAgIGFkZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1zcmNhZGRpY29cIiwgdGV4dDogXCIrXCIgfSk7XG4gICAgICBjb25zdCBzZWwgPSBhZGQuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtY2FsLXNyY3NlbGVjdFwiIH0pO1xuICAgICAgc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogXCJhZGljaW9uYXIgcGFzdGFcdTIwMjZcIiwgdmFsdWU6IFwiXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgYXZhaWxhYmxlKSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBwLCB2YWx1ZTogcCB9KTtcbiAgICAgIHNlbC5vbmNoYW5nZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHNlbC52YWx1ZTtcbiAgICAgICAgaWYgKCFwYXRoKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGNvbG9yID0gQUNDRU5UU1tzcmNzLmxlbmd0aCAlIEFDQ0VOVFMubGVuZ3RoXTtcbiAgICAgICAgc3Jjcy5wdXNoKHsgcGF0aCwgY29sb3IsIG9uOiB0cnVlIH0pO1xuICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLy8gQWNoYSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWAgKFlZWVktTU0tREQpOiBwcmltZWlybyBwZWxvIGNhbWluaG8gY2FuXHUwMEY0bmljbyBlbVxuICAvLyA1MC5EaVx1MDBFMXJpby8sIHNlblx1MDBFM28gcXVhbHF1ZXIgbm90YSBjdWpvIGBkYXRlOmAgc2VqYSBlc3NlIGRpYS4gTnVsbCBzZSBuXHUwMEUzbyBob3V2ZXIuXG4gIC8vIChSZWxhdFx1MDBGM3Jpby9ub3RhIGRpXHUwMEUxcmlhIFx1MDBFOSB1bSBwb3IgZGlhIFx1MjE5MiBhYnJlIG8gZXhpc3RlbnRlIGVtIHZleiBkZSBjcmlhciBvdXRyby4pXG4gIHByaXZhdGUgZmluZERhaWx5Tm90ZShrZXk6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZGlyZWN0ID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCk7XG4gICAgaWYgKGRpcmVjdCBpbnN0YW5jZW9mIFRGaWxlKSByZXR1cm4gZGlyZWN0O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpID09PSBrZXkpIHJldHVybiBmO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFicmUgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgOyBjcmlhIGVtIDUwLkRpXHUwMEUxcmlvLyBTXHUwMEQzIHNlIG5cdTAwRTNvIGV4aXN0aXIgbmVuaHVtYS5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuRGFpbHlOb3RlKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcpIHsgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGV4aXN0aW5nKTsgcmV0dXJuOyB9XG5cbiAgICAvLyBOXHUwMEUzbyBleGlzdGUgXHUyMTkyIGNyaWEgbm8gY2FtaW5obyBjYW5cdTAwRjRuaWNvLlxuICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX0ZPTERFUikpXG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoREFJTFlfRk9MREVSKS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBjb25zdCBbeSwgbSwgZF0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgIGNvbnN0IHRpdHVsbyA9IG5ldyBEYXRlKCt5LCArbSAtIDEsICtkKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICB9KTtcblxuICAgIC8vIFVzYSBvIHRlbXBsYXRlIGVtIE1vZGVsb3MvIHNlIGV4aXN0aXI7IHNlblx1MDBFM28sIGZhbGxiYWNrIGVtYnV0aWRvLlxuICAgIGNvbnN0IHRwbCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9URU1QTEFURSk7XG4gICAgbGV0IGJvZHk6IHN0cmluZztcbiAgICBpZiAodHBsIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgIGJvZHkgPSAoYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0cGwpKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmRhdGVcXHMqXFx9XFx9L2csIGtleSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyp0aXRsZVxccypcXH1cXH0vZywgdGl0dWxvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keSA9XG5gLS0tXG5vd25lcjogV2VydXNcbmNyZWF0ZWQ6ICR7a2V5fVxuZGF0ZTogJHtrZXl9XG5yZXZpZXdlZDogdHJ1ZVxudHlwZTogZGFpbHlcbnBlcm1pc3Npb25zOlxuICByZWFkOiBbYWxsXVxuICB3cml0ZTpcbiAgICAtIFdlcnVzXG4tLS1cblxuIyAke3RpdHVsb31cblxuYDtcbiAgICB9XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGAsIGJvZHkpO1xuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkcyBkbyBjb2ZyZSAodG9kYXMgYXMgcGFzdGFzIGRlIHRvcG8pICsgbmF2ZWdhZG9yIGFuaW5oYWRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyUGFyYShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNPRlJFXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoaGVhZCwgXCJwYXJhXCIpO1xuXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFyYS1ncmlkXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgICAvLyBpZ25vcmEgLm9ic2lkaWFuLCAudHJhc2gsIGV0Yy5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVJvb3QgPSB0aGlzLm5hdlBhdGggPyB0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkgOiBudWxsO1xuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgbWV0YSAgICA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBzdGF0cyAgID0gZm9sZGVyU3RhdHMoZm9sZGVyKTtcbiAgICAgIGNvbnN0IGNvdmVyICAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgbmF2aWdhYmxlID0gc3ViRm9sZGVycyhmb2xkZXIpLmxlbmd0aCA+IDAgfHwgZmlsZXNJbihmb2xkZXIpLmxlbmd0aCA+IDA7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVJvb3QgPT09IGZvbGRlci5wYXRoO1xuXG4gICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZCB3ZC1wYXJhLWNhcmQgd2QtYW5pbS1pblwiICsgKGlzQWN0aXZlID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICBjYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7aWR4ICogNDB9bXNgO1xuICAgICAgaWR4Kys7XG5cbiAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0XCIgfSk7XG4gICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgfVxuICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtYWNjZW50LWJhclwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBtZXRhLmFjY2VudDtcblxuICAgICAgdGhpcy5oaWRlQnRuKGNhcmQsIGZvbGRlci5wYXRoLCBgT2N1bHRhciBcIiR7bWV0YS5sYWJlbH1cImApO1xuICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgdXJnZW5jeVN0YXRzKHRoaXMuYXBwLCBmb2xkZXIpKTtcblxuICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dChzdGF0cykgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCAgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWZvbGRlclwiLCB0ZXh0OiBmb2xkZXIucGF0aCB9KTtcbiAgICAgIGlmIChuYXZpZ2FibGUpIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhhcy1zdWJzXCIsIHRleHQ6IGlzQWN0aXZlID8gXCJmZWNoYXIgXHUyNUJFXCIgOiBcImFicmlyIFx1MjAzQVwiIH0pO1xuXG4gICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBpZiAocnYudG90YWwgPiAwKSB7XG4gICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhc2ApO1xuICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApfSVgO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBmb2xkZXIpO1xuXG4gICAgICBjYXJkLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChuYXZpZ2FibGUpIHsgdGhpcy5uYXZQYXRoID0gaXNBY3RpdmUgPyBudWxsIDogZm9sZGVyLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH1cbiAgICAgICAgZWxzZSByZXZlYWxJbkV4cGxvcmVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIWlkeCkgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgdmlzXHUwMEVEdmVsLlwiIH0pO1xuXG4gICAgLy8gQXJxdWl2b3Mgc29sdG9zIG5hIHJhaXogZG8gY29mcmVcbiAgICBjb25zdCByb290RmlsZXMgPSBmaWxlc0luKHZhdWx0Um9vdCk7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhzZWMsIHJvb3RGaWxlcywgXCJhcnF1aXZvcyBuYSByYWl6XCIpO1xuXG4gICAgaWYgKHRoaXMubmF2UGF0aCkge1xuICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMubmF2UGF0aCk7XG4gICAgICBpZiAoZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikgdGhpcy5yZW5kZXJCcm93c2VyKHNlYywgZm9sZGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlckhpZGRlbkJhcihzZWMpO1xuICB9XG5cbiAgLy8gUGFpbmVsIGlubGluZSBuYXZlZ1x1MDBFMXZlbCAoYnJlYWRjcnVtYiArIHN1YnBhc3RhcyArIG5vdGFzIGRhIHBhc3RhIGF0dWFsKVxuICBwcml2YXRlIHJlbmRlckJyb3dzZXIocGFyZW50OiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3Qgcm9vdFBhdGggPSB0aGlzLnRvcEZvbGRlck9mKGZvbGRlci5wYXRoKTtcbiAgICBjb25zdCByb290Rm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJvb3RQYXRoKTtcbiAgICBpZiAoIShyb290Rm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikpIHJldHVybjtcbiAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgcm9vdEZvbGRlcik7XG5cbiAgICBjb25zdCBwYW5lbCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFuZWxcIiB9KTtcbiAgICBwYW5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgIC8vIEJyZWFkY3J1bWJcbiAgICBjb25zdCBjcnVtYiA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jcnVtYlwiIH0pO1xuICAgIGNvbnN0IHJlbCA9IGZvbGRlci5wYXRoID09PSByb290UGF0aCA/IFtdIDogZm9sZGVyLnBhdGguc2xpY2Uocm9vdFBhdGgubGVuZ3RoICsgMSkuc3BsaXQoXCIvXCIpO1xuXG4gICAgY29uc3Qgcm9vdFNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAocmVsLmxlbmd0aCA9PT0gMCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIikgfSk7XG4gICAgcmVuZGVySWNvbihyb290U2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgIHJvb3RTZWcuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgaWYgKHJlbC5sZW5ndGgpIHJvb3RTZWcub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gcm9vdFBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICBsZXQgYWNjID0gcm9vdFBhdGg7XG4gICAgcmVsLmZvckVhY2goKHBhcnQsIGkpID0+IHtcbiAgICAgIGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VwXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBjb25zdCBpc0xhc3QgPSBpID09PSByZWwubGVuZ3RoIC0gMTtcbiAgICAgIGFjYyA9IGAke2FjY30vJHtwYXJ0fWA7XG4gICAgICBjb25zdCBzZWdQYXRoID0gYWNjO1xuICAgICAgY29uc3Qgc2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChpc0xhc3QgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpLCB0ZXh0OiBwYXJ0IH0pO1xuICAgICAgaWYgKCFpc0xhc3QpIHNlZy5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZWdQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2xvc2UgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWNsb3NlXCIsIHRleHQ6IFwiXHUyNzE1XCIgfSk7XG4gICAgY2xvc2Uuc2V0QXR0cihcInRpdGxlXCIsIFwiRmVjaGFyXCIpO1xuICAgIGNsb3NlLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IG51bGw7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICAvLyBDYW1wbyBkZSBidXNjYVxuICAgIGNvbnN0IHNlYXJjaFdyYXAgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VhcmNoLXdyYXBcIiB9KTtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHNlYXJjaFdyYXAuY3JlYXRlRWwoXCJpbnB1dFwiLCB7XG4gICAgICBjbHM6IFwid2Qtc2VhcmNoXCIsXG4gICAgICBhdHRyOiB7IHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJmaWx0cmFyXHUyMDI2XCIsIHZhbHVlOiB0aGlzLnNlYXJjaFRlcm0gfSxcbiAgICB9KTtcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zZWFyY2hUZXJtID0gc2VhcmNoSW5wdXQudmFsdWU7XG4gICAgICBjb25zdCB0ZXJtID0gdGhpcy5zZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1zdWItY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbGJsID0gZWwucXVlcnlTZWxlY3RvcihcIi53ZC1sYWJlbFwiKT8udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkgPz8gXCJcIjtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGxibC5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtbm90ZS1yb3csIC53ZC1ub3RlLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAoZWwucXVlcnlTZWxlY3RvcihcIi53ZC1ub3RlLW5hbWUsIC53ZC1ub3RlLWNhcmQtbmFtZVwiKT8udGV4dENvbnRlbnQgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IG5hbWUuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFN1YnBhc3RhcyBjb21vIGNhcmRzXG4gICAgY29uc3Qgc3VicyA9IHN1YkZvbGRlcnMoZm9sZGVyKTtcbiAgICBpZiAoc3Vicy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNncmlkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2otZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBzZiBvZiBzdWJzKSB7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlYWRGb2xkZXJTdGF0dXModGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3Qgc3RhdHMgID0gZm9sZGVyU3RhdHMoc2YpO1xuICAgICAgICBjb25zdCBjb3ZlciAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IGRlZXBlciA9IHN1YkZvbGRlcnMoc2YpLmxlbmd0aCA+IDA7XG4gICAgICAgIGNvbnN0IGN1c3RvbUljb24gPSByZWFkRm9sZGVySWNvbih0aGlzLmFwcCwgc2YpO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBzZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1jYXJkIHdkLXN1Yi1jYXJkIHdkLXMtJHtzdGF0dXN9YCB9KTtcbiAgICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXJcIiB9KS5jcmVhdGVFbChcImltZ1wiLCB7IGF0dHI6IHsgc3JjOiBjb3ZlciwgZHJhZ2dhYmxlOiBcImZhbHNlXCIgfSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDYXBhIHBhZHJcdTAwRTNvIHN1dGlsICh2ZXJzXHUwMEUzbyBtZW5vciBxdWUgYXMgcGFzdGFzIGRlIHRvcG8pIFx1MjAxNCBGYXNlIDkuMVxuICAgICAgICAgIGNvbnN0IGRjID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXIgd2QtY292ZXItZGVmYXVsdCB3ZC1jb3Zlci1zdWJcIiB9KTtcbiAgICAgICAgICByZW5kZXJJY29uKGRjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY292ZXItZ2x5cGhcIiB9KSwgY3VzdG9tSWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtYmFkZ2Ugd2QtYmFkZ2UtJHtzdGF0dXN9YCwgdGV4dDogU1RBVFVTX0lDT05bc3RhdHVzXSB9KTtcbiAgICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgdXJnZW5jeVN0YXRzKHRoaXMuYXBwLCBzZikpO1xuXG4gICAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICAgIGlmIChjdXN0b21JY29uKSByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb24gd2Qtc3ViLWljb25cIiB9KSwgY3VzdG9tSWNvbik7XG4gICAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dChzdGF0cykgfSk7XG4gICAgICAgIGlmIChkZWVwZXIpIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN1Yi1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgdGV4dDogc2YubmFtZSB9KTtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikgbGFiZWwuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXNgKTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApfSVgO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjYXJkLnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIHNmKTtcbiAgICAgICAgICBjYXJkLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNmLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcnF1aXZvcyBkYSBwYXN0YSBhdHVhbCAobm90YXMsIGNhbnZhcywgYmFzZXMpXG4gICAgY29uc3Qgbm90ZXMgPSBmaWxlc0luKGZvbGRlcik7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhwYW5lbCwgbm90ZXMpO1xuXG4gICAgaWYgKCFzdWJzLmxlbmd0aCAmJiAhbm90ZXMubGVuZ3RoKVxuICAgICAgcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiUGFzdGEgdmF6aWEuXCIgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhdG1hcCAodmlhIHBsdWdpbiBIZWF0bWFwIENhbGVuZGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYXRtYXAocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfSEVBVCkpIHJldHVybjtcbiAgICBpZiAoUGxhdGZvcm0uaXNQaG9uZSkgcmV0dXJuOyAgIC8vIGhlYXRtYXAgKGFubyBpbnRlaXJvKSBvY3VsdGFkbyBubyBjZWx1bGFyXG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWhlYXQtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQVRJVklEQURFIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJoZWF0bWFwXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX0hFQVQsIFwiT2N1bHRhciBoZWF0bWFwXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBjb25zdCByZW5kZXIgPSBnZXRIZWF0bWFwUmVuZGVyZXIoKTtcbiAgICBpZiAoIXJlbmRlcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiAnQXRpdmUgbyBwbHVnaW4gXCJIZWF0bWFwIENhbGVuZGFyXCIgcGFyYSB2ZXIgYSBhdGl2aWRhZGUuJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3RhcyBjcmlhZGFzIHBvciBkaWEsIG5vIGFubyBjb3JyZW50ZS5cbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGNvdW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShmLnN0YXQuY3RpbWUpO1xuICAgICAgaWYgKGQuZ2V0RnVsbFllYXIoKSAhPT0geWVhcikgY29udGludWU7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvdW50c1trZXldID0gKGNvdW50c1trZXldID8/IDApICsgMTtcbiAgICB9XG4gICAgY29uc3QgZW50cmllczogSGVhdG1hcEVudHJ5W10gPSBPYmplY3QuZW50cmllcyhjb3VudHMpLm1hcCgoW2RhdGUsIG5dKSA9PiAoe1xuICAgICAgZGF0ZSwgaW50ZW5zaXR5OiBuLCBjb2xvcjogXCJncmVlblwiLCBjb250ZW50OiBgJHtufSBub3RhKHMpYCxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYXQtYm94XCIgfSk7XG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlcihib3gsIHtcbiAgICAgICAgeWVhcixcbiAgICAgICAgY29sb3JzOiB7IGdyZWVuOiBbXCIjMWUzYTJmXCIsIFwiIzFmNmY0M1wiLCBcIiMyYmE4NWFcIiwgXCIjMzlkMzUzXCJdIH0sXG4gICAgICAgIHNob3dDdXJyZW50RGF5Qm9yZGVyOiB0cnVlLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZWMuZW1wdHkoKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJGYWxoYSBhbyByZW5kZXJpemFyIG8gaGVhdG1hcC5cIiB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRXN0YXRcdTAwRURzdGljYXMgZG8gY29mcmUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJTdGF0cyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19TVEFUKSkgcmV0dXJuO1xuXG4gICAgbGV0IHRvdGFsTm90ZXMgPSAwLCB0b3RhbFJldmlld2VkID0gMCwgY3JlYXRlZFRoaXNXZWVrID0gMDtcbiAgICBjb25zdCB3ZWVrQWdvID0gRGF0ZS5ub3coKSAtIDcgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGNvbnRpbnVlO1xuICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgaWYgKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlKSB0b3RhbFJldmlld2VkKys7XG4gICAgICBpZiAoZi5zdGF0LmN0aW1lID49IHdlZWtBZ28pIGNyZWF0ZWRUaGlzV2VlaysrO1xuICAgIH1cbiAgICBjb25zdCBnbG9iYWxQY3QgPSB0b3RhbE5vdGVzID4gMCA/IE1hdGgucm91bmQodG90YWxSZXZpZXdlZCAvIHRvdGFsTm90ZXMgKiAxMDApIDogMDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkVTVEFUXHUwMENEU1RJQ0FTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJzdGF0c1wiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19TVEFULCBcIk9jdWx0YXIgZXN0YXRcdTAwRURzdGljYXNcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIC8vIE5cdTAwRkFtZXJvcyBnbG9iYWlzXG4gICAgY29uc3QgZ2xvYiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1nbG9iYWxcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWdcIiwgdGV4dDogU3RyaW5nKHRvdGFsTm90ZXMpIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcIm5vdGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnIHdkLXN0YXQtcmV2LW51bVwiLCB0ZXh0OiBgJHtnbG9iYWxQY3R9JWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwicmV2aXNhZGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtd2Vla1wiLCB0ZXh0OiBgKyR7Y3JlYXRlZFRoaXNXZWVrfWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwiZXN0YSBzZW1hbmFcIiB9KTtcblxuICAgIC8vIEJyZWFrZG93biBwb3IgcGFzdGFcbiAgICBjb25zdCB0YWJsZSA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC10YWJsZVwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcblxuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG4gICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBpZiAocnYudG90YWwgPT09IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBwY3QgPSBNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke3J2LnRvdGFsfWAgfSk7XG5cbiAgICAgIGNvbnN0IGJhcldyYXAgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyXCIgfSk7XG4gICAgICBiYXJXcmFwLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJsaXN0XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNhcmQgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gcG9yIHRpcG8gZGUgYXJxdWl2byAobm90YSAvIGNhbnZhcyAvIGJhc2UpIFx1MjAxNCBGYXNlIDkuMlxuICAgICAgICBjb25zdCBjb3YgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY292ZXIgd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24oY292LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1jb3Zlci1nbHlwaFwiIH0pLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcblxuICAgICAgICBpZiAoaXNNZCkgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjYXJkLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1yb3cgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IHRpID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLXR5cGVpY29uIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKHRpLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS1kb3Qgd2QtYmFkZ2UtJHtzdH1gIH0pO1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR3JcdTAwRTFmaWNvIGRlIGNyZXNjaW1lbnRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyR3Jvd3RoKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0dST1cpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDUkVTQ0lNRU5UTyBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgYnRuRGF5ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiZGlhXCIgfSk7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5vdGFzIGNyaWFkYXMgcG9yIGRpYVwiKTtcbiAgICBidG5EYXkub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gdHJ1ZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJncm93dGhcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfR1JPVywgXCJPY3VsdGFyIGNyZXNjaW1lbnRvXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICAvLyBBZ3J1cGEgbm90YXMgcG9yIGRhdGEgZGUgY3JpYVx1MDBFN1x1MDBFM29cbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShuZXcgRGF0ZShmLnN0YXQuY3RpbWUpKTtcbiAgICAgIGNvdW50c1trZXldID0gKGNvdW50c1trZXldID8/IDApICsgMTtcbiAgICB9XG5cbiAgICAvLyBcdTAwREFsdGltb3MgTiBkaWFzIChtZW5vcyBubyBjZWx1bGFyKVxuICAgIGNvbnN0IERBWVMgPSBQbGF0Zm9ybS5pc1Bob25lID8gMTUgOiAzMDtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCBjb3VudDogY291bnRzW2tleV0gPz8gMCwgbGFiZWw6IGAke2RheX0vJHttfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWwgPSBkYXlzLnJlZHVjZSgocywgZCkgPT4gcyArIGQuY291bnQsIDApO1xuICAgIGNvbnN0IHRvZGF5S2V5ID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBNb2RvIGN1bXVsYXRpdm86IHNvbWEgYWN1bXVsYWRhIGRpYSBhIGRpYVxuICAgIHR5cGUgRGF5RW50cnkgPSB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nOyBkaXNwbGF5VmFsOiBudW1iZXIgfTtcbiAgICBsZXQgZW50cmllczogRGF5RW50cnlbXTtcbiAgICBpZiAodGhpcy5ncm93dGhDdW11bGF0aXZlKSB7XG4gICAgICBsZXQgYWNjID0gMDtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+IHsgYWNjICs9IGQuY291bnQ7IHJldHVybiB7IC4uLmQsIGRpc3BsYXlWYWw6IGFjYyB9OyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4gKHsgLi4uZCwgZGlzcGxheVZhbDogZC5jb3VudCB9KSk7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmVudHJpZXMubWFwKGUgPT4gZS5kaXNwbGF5VmFsKSwgMSk7XG5cbiAgICAvLyBMaW5oYSBkZSByZXN1bW9cbiAgICBjb25zdCBpbmZvID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtaW5mb1wiIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtdG90YWxcIiwgdGV4dDogYCR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZW50cmllc1tlbnRyaWVzLmxlbmd0aCAtIDFdLmRpc3BsYXlWYWwgOiB0b3RhbH1gIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtcGVyaW9kXCIsIHRleHQ6IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGBub3RhcyBhY3VtdWxhZGFzICgke0RBWVN9IGRpYXMpYCA6IGBub3RhcyBjcmlhZGFzIG5vcyBcdTAwRkFsdGltb3MgJHtEQVlTfSBkaWFzYCB9KTtcblxuICAgIC8vIEdyXHUwMEUxZmljbyBkZSBiYXJyYXNcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZW50cmllcy5mb3JFYWNoKCh7IGtleSwgY291bnQsIGxhYmVsLCBkaXNwbGF5VmFsIH0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY29sID0gY2hhcnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jb2xcIiArIChrZXkgPT09IHRvZGF5S2V5ID8gXCIgd2QtZ3Jvd3RoLXRvZGF5XCIgOiBcIlwiKSB9KTtcbiAgICAgIGNvbnN0IGJhckFyZWEgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXItYXJlYVwiIH0pO1xuICAgICAgY29uc3QgaXNFbXB0eSA9IGRpc3BsYXlWYWwgPT09IDA7XG4gICAgICBjb25zdCBiYXIgPSBiYXJBcmVhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyXCIgKyAoaXNFbXB0eSA/IFwiIHdkLWdyb3d0aC1iYXItemVyb1wiIDogXCJcIikgfSk7XG4gICAgICBiYXIuc3R5bGUuaGVpZ2h0ID0gaXNFbXB0eSA/IFwiM3B4XCIgOiBgJHtNYXRoLm1heCg1LCBNYXRoLnJvdW5kKChkaXNwbGF5VmFsIC8gbWF4KSAqIDEwMCkpfSVgO1xuICAgICAgaWYgKCFpc0VtcHR5KSBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xhYmVsfTogJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBkaXNwbGF5VmFsICsgXCIgdG90YWxcIiA6IGNvdW50ICsgXCIgbm90YShzKVwifWApO1xuXG4gICAgICBjb25zdCBzaG93TGJsID0gaWR4ID09PSAwIHx8IGlkeCA9PT0gNyB8fCBpZHggPT09IDE0IHx8IGlkeCA9PT0gMjEgfHwgaWR4ID09PSAyOSB8fCBrZXkgPT09IHRvZGF5S2V5O1xuICAgICAgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtbGJsXCIsIHRleHQ6IHNob3dMYmwgPyBsYWJlbCA6IFwiXCIgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCAoRmFzZSA4LjEgXHUyMDE0IGxlaXR1cmEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgLy8gVG9nZ2xlIGRlIGphbmVsYSBcInByXHUwMEYzeGltb3MgZGlhc1wiICgzIC8gNykuXG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICAgIGNvbnN0IHNlZyA9IGN0cmxzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJhbmdlXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgWzMsIDddIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGIgPSBzZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJhbmdlLWJ0blwiICsgKHJhbmdlID09PSBuID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBgJHtufWRgIH0pO1xuICAgICAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCBgTW9zdHJhciBvcyBwclx1MDBGM3hpbW9zICR7bn0gZGlhc2ApO1xuICAgICAgICBiLm9uY2xpY2sgPSBhc3luYyBlID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IG47XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gQm90XHUwMEUzbyBkZSBmaWx0cm9zIChwcm9qZXRvL2V0aXF1ZXRhKS5cbiAgICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICAgIGNvbnN0IG5GID0gZi5wcm9qZWN0cy5sZW5ndGggKyBmLmxhYmVscy5sZW5ndGg7XG4gICAgICBjb25zdCBmaWx0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJ0blwiICsgKHRoaXMudG9kb2lzdEZpbHRlck9wZW4gPyBcIiB3ZC1vblwiIDogXCJcIikgKyAobkYgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihmaWx0LCBcImZpbHRlclwiKTtcbiAgICAgIGZpbHQuc2V0QXR0cihcInRpdGxlXCIsIG5GID8gYEZpbHRyb3MgYXRpdm9zICgke25GfSkgXHUyMDE0IGNsaXF1ZSBwYXJhIGFqdXN0YXJgIDogXCJGaWx0cmFyIHBvciBwcm9qZXRvL2V0aXF1ZXRhXCIpO1xuICAgICAgaWYgKG5GKSBmaWx0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0Y3RcIiwgdGV4dDogU3RyaW5nKG5GKSB9KTtcbiAgICAgIGZpbHQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnRvZG9pc3RGaWx0ZXJPcGVuID0gIXRoaXMudG9kb2lzdEZpbHRlck9wZW47IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMudG9kb2lzdExvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgdGFyZWZhcyBkbyBUb2RvaXN0XCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFRvZG9pc3QodHJ1ZSk7IH07XG5cbiAgICAgIHRoaXMuYWRkVGFza0J0bihjdHJscywgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIH1cbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJ0b2RvaXN0XCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX1RPRE8sIFwiT2N1bHRhciB0YXJlZmFzXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29sZSBzZXUgdG9rZW4gZG8gVG9kb2lzdCBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIHBhcmEgdmVyIHN1YXMgdGFyZWZhcyBhcXVpLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFByaW1laXJhIGNhcmdhIHByZWd1aVx1MDBFN29zYSAoblx1MDBFM28gcmVmYXogZW0gbG9vcCBzZSBqXHUwMEUxIGJ1c2NvdSBvdSBzZSBkZXUgZXJybykuXG4gICAgaWYgKCF0aGlzLnRvZG9pc3RGZXRjaGVkQXQgJiYgIXRoaXMudG9kb2lzdExvYWRpbmcgJiYgIXRoaXMudG9kb2lzdEVycm9yKSB2b2lkIHRoaXMuZmV0Y2hUb2RvaXN0KGZhbHNlKTtcblxuICAgIGlmICh0aGlzLnRvZG9pc3RFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMudG9kb2lzdEVycm9yfWAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy50b2RvaXN0RmV0Y2hlZEF0KSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ2FycmVnYW5kbyB0YXJlZmFzXHUyMDI2XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQmFycmEgZGUgZmlsdHJvcyAocmVjb2xoXHUwMEVEdmVsKS5cbiAgICBpZiAodGhpcy50b2RvaXN0RmlsdGVyT3BlbikgdGhpcy5yZW5kZXJUb2RvRmlsdGVyQmFyKHNlYyk7XG5cbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICBjb25zdCB0b2RheUsgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBsYXN0VXBjb21pbmcgPSBuZXcgRGF0ZSgpO1xuICAgIGxhc3RVcGNvbWluZy5zZXREYXRlKGxhc3RVcGNvbWluZy5nZXREYXRlKCkgKyByYW5nZSk7XG4gICAgY29uc3QgbGFzdEsgPSB0b0tleShsYXN0VXBjb21pbmcpOyAgIC8vIGxpbWl0ZSBkb3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiAoaW5jbHVzaXZlKVxuXG4gICAgLy8gQXBsaWNhIGZpbHRyb3MgZSBzZXBhcmEgZW0gYmFsZGVzOiBhdHJhc2FkYXMgXHUwMEI3IGhvamUgXHUwMEI3IHByXHUwMEYzeGltb3MgTiBkaWFzIFx1MDBCNyBkZXBvaXMuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmFwcGx5VG9kb2lzdEZpbHRlcnModGhpcy50b2RvaXN0VGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgY29udGludWU7ICAgLy8gc2VtIGRhdGE6IGZvcmEgZG9zIGJsb2NvcyBwb3IgZGlhIChwb2Rlclx1MDBFMSB2aXJhciBcIkNhaXhhIGRlIGVudHJhZGFcIiBubyBmdXR1cm8pXG4gICAgICBpZiAoZGsgPCB0b2RheUspIG92ZXJkdWUucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrID09PSB0b2RheUspIHRvZGF5VGFza3MucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrIDw9IGxhc3RLKSAoYnlEYXlbZGtdID8/PSBbXSkucHVzaCh0KTtcbiAgICAgIGVsc2UgbGF0ZXIucHVzaCh0KTtcbiAgICB9XG4gICAgY29uc3QgYnlQcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICBvdmVyZHVlLnNvcnQoYnlQcmkpOyB0b2RheVRhc2tzLnNvcnQoYnlQcmkpOyBsYXRlci5zb3J0KGJ5UHJpKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoYnlEYXkpKSBieURheVtrXS5zb3J0KGJ5UHJpKTtcblxuICAgIGNvbnN0IHZpc2libGUgPSBvdmVyZHVlLmxlbmd0aCArIHRvZGF5VGFza3MubGVuZ3RoICsgbGF0ZXIubGVuZ3RoICsgT2JqZWN0LnZhbHVlcyhieURheSkucmVkdWNlKChzLCBhKSA9PiBzICsgYS5sZW5ndGgsIDApO1xuICAgIGlmICh2aXNpYmxlID09PSAwKSB7XG4gICAgICBjb25zdCBhbGwgPSB0aGlzLnRvZG9pc3RUYXNrcy5sZW5ndGg7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IGFsbCA/IFwiTmVuaHVtYSB0YXJlZmEgYmF0ZSBjb20gb3MgZmlsdHJvcy5cIiA6IFwiTmVuaHVtYSB0YXJlZmEgY29tIGRhdGEgbm8gVG9kb2lzdC4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGluaGEgaG9yaXpvbnRhbCBjb20gMyBjYWl4YXMgbGFkbyBhIGxhZG86IEF0cmFzYWRhcyBcdTAwQjcgSG9qZSBcdTAwQjcgUHJcdTAwRjN4aW1vcyBOIGRpYXMuXG4gICAgY29uc3QgY29scyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1jb2xzXCIgfSk7XG5cbiAgICAvLyAxXHUwMEFBIFx1MjAxNCBBdHJhc2FkYXMgKGNhaXhhIHZlcm1lbGhhKS5cbiAgICBjb25zdCBvYm94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LW92ZXJkdWVcIiB9KTtcbiAgICBjb25zdCBvaGQgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3h3YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkF0cmFzYWRhc1wiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKG92ZXJkdWUubGVuZ3RoKSB9KTtcbiAgICBjb25zdCBvYm9keSA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIG92ZXJkdWUpIHRoaXMudG9kb1JvdyhvYm9keSwgdCk7XG4gICAgZWxzZSBvYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEuIFx1RDgzRFx1REM0RFwiIH0pO1xuXG4gICAgLy8gMlx1MDBBQSBcdTIwMTQgSG9qZSAoY2FpeGEgZW0gZGVzdGFxdWUpLlxuICAgIGNvbnN0IHRib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdG9kYXlcIiB9KTtcbiAgICBjb25zdCB0aGQgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkhvamVcIiB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odGhkLCBcImhvamVcIiwgXCJOb3ZhIHRhcmVmYSBwYXJhIGhvamVcIik7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodG9kYXlUYXNrcy5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IHRib2R5ID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHRvZGF5VGFza3MubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2YgdG9kYXlUYXNrcykgdGhpcy50b2RvUm93KHRib2R5LCB0KTtcbiAgICBlbHNlIHRib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmFkYSBwYXJhIGhvamUuXCIgfSk7XG5cbiAgICAvLyAzXHUwMEFBIFx1MjAxNCBQclx1MDBGM3hpbW9zIE4gZGlhcyAoYWdydXBhZG8gcG9yIGRpYSwgY29tIHN1Yi10XHUwMEVEdHVsbyBzXHUwMEYzIG5vcyBkaWFzIHF1ZSB0XHUwMEVBbSB0YXJlZmEpLlxuICAgIGxldCB1cGNvbWluZ0NvdW50ID0gMDtcbiAgICBjb25zdCB1cERheXM6IHsgZG93OiBudW1iZXI7IG51bTogbnVtYmVyOyBrZXk6IHN0cmluZzsgaXRlbXM6IFRvZG9pc3RUYXNrW10gfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmFuZ2U7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV07XG4gICAgICBpZiAoIWl0ZW1zPy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgdXBjb21pbmdDb3VudCArPSBpdGVtcy5sZW5ndGg7XG4gICAgICB1cERheXMucHVzaCh7IGRvdzogKGRheS5nZXREYXkoKSArIDYpICUgNywgbnVtOiBkYXkuZ2V0RGF0ZSgpLCBrZXksIGl0ZW1zIH0pO1xuICAgIH1cbiAgICBjb25zdCB1Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXVwY29taW5nXCIgfSk7XG4gICAgY29uc3QgdWhkID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogYFByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhc2AgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHVoZCwgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHVwY29taW5nQ291bnQpIH0pO1xuICAgIGNvbnN0IHVib2R5ID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHVwRGF5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgZyBvZiB1cERheXMpIHtcbiAgICAgICAgY29uc3QgZGggPSB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1kYXloZFwiICsgKGcuZG93ID49IDUgPyBcIiB3ZC13ZWVrZW5kXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2cuZG93XSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW51bVwiLCB0ZXh0OiBTdHJpbmcoZy5udW0pIH0pO1xuICAgICAgICB0aGlzLmFkZFRhc2tCdG4oZGgsIGcua2V5LCBgTm92YSB0YXJlZmEgZW0gJHtnLm51bX1gKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGcuaXRlbXMpIHRoaXMudG9kb1Jvdyh1Ym9keSwgdCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBgTmFkYSBub3MgcHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzLmAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVwb2lzICg+IE4gZGlhcyBcdTAwRTAgZnJlbnRlOyByZWNvbGhcdTAwRUR2ZWwsIGFiYWl4byBkYSBsaW5oYSwgZmVjaGFkbyBwb3IgcGFkclx1MDBFM28pLlxuICAgIGlmIChsYXRlci5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyXCIgfSk7XG4gICAgICBjb25zdCBsaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBEZXBvaXMgKCR7bGF0ZXIubGVuZ3RofSlgIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMudG9kb2lzdExhdGVyT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnRvZG9pc3RMYXRlck9wZW4gPSAhdGhpcy50b2RvaXN0TGF0ZXJPcGVuOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgaWYgKHRoaXMudG9kb2lzdExhdGVyT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGxhdGVyKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSmFuZWxhIGRlIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgc2FuZWFkYSAoMyBvdSA3KS5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgLy8gTWFudFx1MDBFOW0gc1x1MDBGMyBhcyB0YXJlZmFzIHF1ZSBiYXRlbSBjb20gb3MgZmlsdHJvcyBhdGl2b3MgKHByb2pldG8gRSBldGlxdWV0YSkuXG4gIHByaXZhdGUgYXBwbHlUb2RvaXN0RmlsdGVycyh0YXNrczogVG9kb2lzdFRhc2tbXSk6IFRvZG9pc3RUYXNrW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBpZiAoIWYucHJvamVjdHMubGVuZ3RoICYmICFmLmxhYmVscy5sZW5ndGgpIHJldHVybiB0YXNrcztcbiAgICBjb25zdCBwcyA9IG5ldyBTZXQoZi5wcm9qZWN0cyksIGxzID0gbmV3IFNldChmLmxhYmVscyk7XG4gICAgcmV0dXJuIHRhc2tzLmZpbHRlcih0ID0+IHtcbiAgICAgIGlmIChwcy5zaXplICYmICEodC5wcm9qZWN0X2lkICYmIHBzLmhhcyh0LnByb2plY3RfaWQpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGxzLnNpemUgJiYgISh0LmxhYmVscyA/PyBbXSkuc29tZShsID0+IGxzLmhhcyhsKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVUb2RvRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgLy8gQmFycmEgZGUgZmlsdHJvczogY2hpcHMgZGUgcHJvamV0byBlIGRlIGV0aXF1ZXRhICh0b2dnbGUpLCArIGxpbXBhci5cbiAgcHJpdmF0ZSByZW5kZXJUb2RvRmlsdGVyQmFyKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgY29uc3QgYmFyID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJhclwiIH0pO1xuXG4gICAgaWYgKHRoaXMudG9kb2lzdFByb2plY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJQcm9qZXRvc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMudG9kb2lzdFByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5wcm9qZWN0cy5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogcC5uYW1lIH0pO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlVG9kb0ZpbHRlcihcInByb2plY3RzXCIsIHAuaWQpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldCh0aGlzLnRvZG9pc3RUYXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBpZiAobGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsYWJlbHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IHRoaXMubGFiZWxDaGlwKGdycCwgbCwgXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikpO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlVG9kb0ZpbHRlcihcImxhYmVsc1wiLCBsKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xyID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2xlYXJcIiwgdGV4dDogXCJsaW1wYXIgZmlsdHJvc1wiIH0pO1xuICAgICAgY2xyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IGYucHJvamVjdHMgPSBbXTsgZi5sYWJlbHMgPSBbXTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2tib3ggZGUgY29uY2x1c1x1MDBFM28gKEZhc2UgOC4yKSBcdTIwMTQgY29uY2x1aSBubyBUb2RvaXN0IHJlYWwgYW8gY2xpY2FyLlxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNoZWNrLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KTsgfTtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgZGEgdGFyZWZhOiB0XHUwMEVEdHVsbyBjb21wbGV0byArIGRlc2NyaVx1MDBFN1x1MDBFM28gKGluc3RydVx1MDBFN1x1MDBGNWVzKSwgbm8gaG92ZXIuXG4gIHByaXZhdGUgc2hvd1Rhc2tUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXRhc2stdGlwXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC1wcmlcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpTWV0YSh0LnByaW9yaXR5KS5jb2xvcjtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtdGl0bGVcIiwgdGV4dDogdC5jb250ZW50IH0pO1xuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBkID0gdC5kZXNjcmlwdGlvbiEudHJpbSgpO1xuICAgICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1kZXNjXCIsIHRleHQ6IGQubGVuZ3RoID4gREVTQ19NQVggPyBkLnNsaWNlKDAsIERFU0NfTUFYKSArIFwiXHUyMDI2XCIgOiBkIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGFza1RpcChlbDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGFza1RpcChlbCwgdCkpO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIExpbmhhIGRlIHRhcmVmYSAodXNhZGEgbmFzIDMgY2FpeGFzOiBhdHJhc2FkYXMsIGhvamUsIHByXHUwMEYzeGltb3MgZSBlbSBcImRlcG9pc1wiKS5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KTtcbiAgICB0aGlzLmF0dGFjaFRhc2tUaXAocm93LCB0KTtcbiAgfVxuXG4gIC8vIEJvdFx1MDBFM28gXCIrXCIgZGUgY3JpYXIgdGFyZWZhIChoZWFkZXIgZGEgc2VcdTAwRTdcdTAwRTNvLCBjYWl4YXMgZSBzdWItdFx1MDBFRHR1bG9zIGRlIGRpYSkuXG4gIHByaXZhdGUgYWRkVGFza0J0bihob3N0OiBIVE1MRWxlbWVudCwgcHJlZmlsbER1ZT86IHN0cmluZywgdGl0bGUgPSBcIk5vdmEgdGFyZWZhXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYWRkXCIgfSk7XG4gICAgc2V0SWNvbihiLCBcInBsdXNcIik7XG4gICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgIGIub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH07XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBBYnJlIG8gZm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgb3UgZWRpdGFyKS5cbiAgcHJpdmF0ZSBvcGVuVGFza0Zvcm0ob3B0czogeyBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7IHRhc2s/OiBUb2RvaXN0VGFzazsgcHJlZmlsbER1ZT86IHN0cmluZyB9KSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLnRoaXMudG9kb2lzdExhYmVsQ29sb3Iua2V5cygpLCAuLi50aGlzLnRvZG9pc3RUYXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgbmV3IFRhc2tGb3JtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgIG1vZGU6IG9wdHMubW9kZSxcbiAgICAgIHRhc2s6IG9wdHMudGFzayxcbiAgICAgIHByZWZpbGxEdWU6IG9wdHMucHJlZmlsbER1ZSxcbiAgICAgIHByb2plY3RzOiB0aGlzLnRvZG9pc3RQcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICAvLyBBYnJlIG8gcG9wLXVwIGRlIGRldGFsaGVzIChzXHUwMEYzIGxlaXR1cmEpOyBvIGJvdFx1MDBFM28gXCJFZGl0YXJcIiBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvLlxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcywge1xuICAgICAgdGFzazogdCxcbiAgICAgIHByb2plY3ROYW1lOiB0LnByb2plY3RfaWQgPyB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgLy8gQ3JpYSBvdSBlZGl0YSBubyBUb2RvaXN0IHJlYWwuIE5vIGVkaXRhciBtYW5kYSBzXHUwMEYzIG9zIGNhbXBvcyBhbHRlcmFkb3MgKHByZXNlcnZhXG4gIC8vIHJlY29yclx1MDBFQW5jaWEgc2UgYSBkYXRhIG5cdTAwRTNvIG11ZG91KSBlIHRyb2NhIGRlIHByb2pldG8gdmlhIC9tb3ZlLiBSZXRvcm5hIHRydWUgc2UgT0suXG4gIHByaXZhdGUgYXN5bmMgc3VibWl0VGFza0Zvcm0obW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiLCB0YXNrOiBUb2RvaXN0VGFzayB8IHVuZGVmaW5lZCwgdjogVGFza0Zvcm1WYWx1ZXMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAobW9kZSA9PT0gXCJjcmVhdGVcIikge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdi5jb250ZW50LCBwcmlvcml0eTogdi5wcmlvcml0eSB9O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbi50cmltKCkpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb24udHJpbSgpO1xuICAgICAgICBpZiAodi5kdWVEYXRlKSBmaWVsZHMuZHVlX2RhdGUgPSB2LmR1ZURhdGU7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCkgZmllbGRzLnByb2plY3RfaWQgPSB2LnByb2plY3RJZDtcbiAgICAgICAgaWYgKHYubGFiZWxzLmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBhd2FpdCBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbiwgZmllbGRzKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIENyaWFkYTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKHRhc2spIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7fTtcbiAgICAgICAgaWYgKHYuY29udGVudCAhPT0gdGFzay5jb250ZW50KSBmaWVsZHMuY29udGVudCA9IHYuY29udGVudDtcbiAgICAgICAgaWYgKHYuZGVzY3JpcHRpb24gIT09ICh0YXNrLmRlc2NyaXB0aW9uID8/IFwiXCIpKSBmaWVsZHMuZGVzY3JpcHRpb24gPSB2LmRlc2NyaXB0aW9uO1xuICAgICAgICBpZiAodi5wcmlvcml0eSAhPT0gdGFzay5wcmlvcml0eSkgZmllbGRzLnByaW9yaXR5ID0gdi5wcmlvcml0eTtcbiAgICAgICAgY29uc3Qgb2xkRGF0ZSA9IHRhc2suZHVlPy5kYXRlID8gdGFzay5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogXCJcIjtcbiAgICAgICAgaWYgKHYuZHVlRGF0ZSAhPT0gb2xkRGF0ZSkge1xuICAgICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgICBlbHNlIGZpZWxkcy5kdWVfc3RyaW5nID0gXCJubyBkYXRlXCI7ICAgLy8gbGltcGEgYSBkYXRhXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2xkTCA9ICh0YXNrLmxhYmVscyA/PyBbXSkuc2xpY2UoKS5zb3J0KCkuam9pbihcIlx1MDAwMFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCJcdTAwMDBcIik7XG4gICAgICAgIGlmIChvbGRMICE9PSBuZXdMKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhmaWVsZHMpLmxlbmd0aCkgYXdhaXQgdXBkYXRlVG9kb2lzdFRhc2sodG9rZW4sIHRhc2suaWQsIGZpZWxkcyk7XG4gICAgICAgIGNvbnN0IG9sZFByb2ogPSB0YXNrLnByb2plY3RfaWQgPz8gXCJcIjtcbiAgICAgICAgaWYgKHYucHJvamVjdElkICE9PSBvbGRQcm9qICYmIHYucHJvamVjdElkKSBhd2FpdCBtb3ZlVG9kb2lzdFRhc2sodG9rZW4sIHRhc2suaWQsIHYucHJvamVjdElkKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIFNhbHZhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuZmV0Y2hUb2RvaXN0KHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBFeGNsdWkgYSB0YXJlZmEgKG90aW1pc3RhKSBubyBUb2RvaXN0IHJlYWwuIFJldG9ybmEgdHJ1ZSBzZSBPSy5cbiAgcHJpdmF0ZSBhc3luYyBkZWxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRvZG9pc3RUYXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudG9kb2lzdFRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1RDgzRFx1REREMSBFeGNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7ICAgLy8gcmV2ZXJ0ZVxuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gZXhjbHVpcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbmNsdWkgYSB0YXJlZmEgZGUgZm9ybWEgb3RpbWlzdGE6IHJlbW92ZSBkYSBsaXN0YSBlIHJlLXJlbmRlcml6YTsgc2UgYSBBUElcbiAgLy8gZmFsaGFyLCByZXN0YXVyYSBlIGF2aXNhLiBBIGVzY3JpdGEgcmVmbGV0ZSBubyBUb2RvaXN0IHJlYWwgKEZhc2UgOC4yKS5cbiAgcHJpdmF0ZSBhc3luYyBjb21wbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudG9kb2lzdFRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY2xvc2VUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ29uY2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7ICAgLy8gcmV2ZXJ0ZVxuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvLyBCdXNjYSB0YXJlZmFzOyBgbWFudWFsYCBtb3N0cmEgbyBzcGlubmVyIGltZWRpYXRhbWVudGUuXG4gIHByaXZhdGUgYXN5bmMgZmV0Y2hUb2RvaXN0KG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuIHx8IHRoaXMudG9kb2lzdExvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnRvZG9pc3RFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgLy8gUHJvamV0b3MvZXRpcXVldGFzIHNcdTAwRTNvIGF1eGlsaWFyZXM7IHNlIGZhbGhhcmVtLCBuXHUwMEUzbyBkZXJydWJhbSBhcyB0YXJlZmFzLlxuICAgICAgY29uc3QgW3Rhc2tzLCBwcm9qZWN0cywgbGFiZWxzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZmV0Y2hUb2RvaXN0VGFza3ModG9rZW4pLFxuICAgICAgICBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbikuY2F0Y2goKCkgPT4gW10gYXMgVG9kb2lzdFByb2plY3RbXSksXG4gICAgICAgIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbikuY2F0Y2goKCkgPT4gW10gYXMgVG9kb2lzdExhYmVsW10pLFxuICAgICAgXSk7XG4gICAgICB0aGlzLnRvZG9pc3RUYXNrcyA9IHRhc2tzO1xuICAgICAgdGhpcy50b2RvaXN0UHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgIHRoaXMudG9kb2lzdFByb2plY3RNYXAgPSBuZXcgTWFwKHByb2plY3RzLm1hcChwID0+IFtwLmlkLCBwLm5hbWVdKSk7XG4gICAgICB0aGlzLnRvZG9pc3RMYWJlbENvbG9yID0gbmV3IE1hcChsYWJlbHMubWFwKGwgPT4gW2wubmFtZSwgVE9ET0lTVF9DT0xPUlNbbC5jb2xvcl0gPz8gTEFCRUxfRkFMTEJBQ0tdKSk7XG4gICAgICB0aGlzLnRvZG9pc3RGZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMudG9kb2lzdEVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlc2V0YSBvIGVzdGFkbyAoZXguOiB0b2tlbiBhbHRlcmFkbyBuYXMgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpIGUgcmUtcmVuZGVyaXphLlxuICByZXNldFRvZG9pc3QoKSB7XG4gICAgdGhpcy50b2RvaXN0VGFza3MgPSBbXTtcbiAgICB0aGlzLnRvZG9pc3RQcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMudG9kb2lzdFByb2plY3RNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy50b2RvaXN0TGFiZWxDb2xvciA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnRvZG9pc3RGZXRjaGVkQXQgPSAwO1xuICAgIHRoaXMudG9kb2lzdEVycm9yID0gbnVsbDtcbiAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nICsgY29uZmxpdG9zKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICByZXNldFN5bmMoKSB7XG4gICAgdGhpcy5zeW5jRGF0YSA9IG51bGw7XG4gICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoU3luYyhtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmICghYmFzZSB8fCAha2V5IHx8IHRoaXMuc3luY0xvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHN0R2V0PFNURm9sZGVyW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZm9sZGVyc1wiKTtcbiAgICAgIGNvbnN0IHdhbnRlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkLnRyaW0oKTtcbiAgICAgIGNvbnN0IGZvbGRlciA9IGZvbGRlcnMuZmluZChmID0+IGYuaWQgPT09IHdhbnRlZCkgPz8gZm9sZGVyc1swXTtcbiAgICAgIGlmICghZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJuZW5odW1hIHBhc3RhIGNvbmZpZ3VyYWRhIG5vIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNvbnN0IGZpZCA9IGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIuaWQpO1xuXG4gICAgICBjb25zdCBbZGV2aWNlcywgY29ubnMsIHN0YXR1cywgc3RhdHMsIHN5c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0R2V0PFNURGV2aWNlW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZGV2aWNlc1wiKSxcbiAgICAgICAgc3RHZXQ8eyBjb25uZWN0aW9uczogUmVjb3JkPHN0cmluZywgeyBjb25uZWN0ZWQ6IGJvb2xlYW4gfT4gfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9jb25uZWN0aW9uc1wiKSxcbiAgICAgICAgc3RHZXQ8U1RTdGF0dXM+KGJhc2UsIGtleSwgYC9yZXN0L2RiL3N0YXR1cz9mb2xkZXI9JHtmaWR9YCksXG4gICAgICAgIHN0R2V0PFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9Pj4oYmFzZSwga2V5LCBcIi9yZXN0L3N0YXRzL2RldmljZVwiKS5jYXRjaCgoKSA9PiAoe30gYXMgUmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+KSksXG4gICAgICAgIHN0R2V0PHsgbXlJRDogc3RyaW5nIH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vc3RhdHVzXCIpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZSA9IGRldmljZXMuZmlsdGVyKGQgPT4gZC5kZXZpY2VJRCAhPT0gc3lzLm15SUQpO1xuICAgICAgY29uc3Qgcm93cyA9IGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZS5tYXAoYXN5bmMgZCA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBhd2FpdCBzdEdldDxTVENvbXBsZXRpb24+KGJhc2UsIGtleSwgYC9yZXN0L2RiL2NvbXBsZXRpb24/Zm9sZGVyPSR7ZmlkfSZkZXZpY2U9JHtkLmRldmljZUlEfWApXG4gICAgICAgICAgLmNhdGNoKCgpID0+ICh7IGNvbXBsZXRpb246IDAsIGdsb2JhbEl0ZW1zOiAwLCBuZWVkSXRlbXM6IDAsIG5lZWRCeXRlczogMCwgbmVlZERlbGV0ZXM6IDAgfSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGQubmFtZSB8fCBkLmRldmljZUlELnNsaWNlKDAsIDcpLFxuICAgICAgICAgIG9ubGluZTogISFjb25ucy5jb25uZWN0aW9uc1tkLmRldmljZUlEXT8uY29ubmVjdGVkLFxuICAgICAgICAgIGNvbXBsZXRpb246IGMuY29tcGxldGlvbixcbiAgICAgICAgICBnbG9iYWxJdGVtczogYy5nbG9iYWxJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRJdGVtczogYy5uZWVkSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkQnl0ZXM6IGMubmVlZEJ5dGVzLFxuICAgICAgICAgIG5lZWREZWxldGVzOiBjLm5lZWREZWxldGVzLFxuICAgICAgICAgIGxhc3RTZWVuOiBzdGF0c1tkLmRldmljZUlEXT8ubGFzdFNlZW4gPz8gXCJcIixcbiAgICAgICAgfTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5zeW5jRGF0YSA9IHtcbiAgICAgICAgc3RhdGU6IHN0YXR1cy5zdGF0ZSxcbiAgICAgICAgbmVlZEZpbGVzOiBzdGF0dXMubmVlZEZpbGVzLFxuICAgICAgICBuZWVkQnl0ZXM6IHN0YXR1cy5uZWVkQnl0ZXMsXG4gICAgICAgIGZvbGRlckxhYmVsOiBmb2xkZXIubGFiZWwgfHwgZm9sZGVyLmlkLFxuICAgICAgICBlcnJvcnM6IChzdGF0dXMuZXJyb3JzID8/IDApICsgKHN0YXR1cy5wdWxsRXJyb3JzID8/IDApLFxuICAgICAgICBkZXZpY2VzOiByb3dzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zeW5jRXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NZTkMpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXN5bmMtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiU0lOQ1JPTklaQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5zeW5jTG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciBlc3RhZG8gZG8gU3luY3RoaW5nXCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH07XG4gICAgfVxuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcInN5bmNcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfU1lOQywgXCJPY3VsdGFyIHNpbmNyb25pemFcdTAwRTdcdTAwRTNvXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBpZiAoIWtleSkge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNvbmZpZ3VyZSBhIFVSTCBlIGEgQVBJIGtleSBkbyBTeW5jdGhpbmcgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZC5cIiB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3luY0Vycm9yKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZXJyb3JcIiwgdGV4dDogYEVycm8gYW8gZmFsYXIgY29tIG8gU3luY3RoaW5nOiAke3RoaXMuc3luY0Vycm9yfWAgfSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5zeW5jRmV0Y2hlZEF0KSB7XG4gICAgICBpZiAoIXRoaXMuc3luY0xvYWRpbmcpIHZvaWQgdGhpcy5mZXRjaFN5bmMoZmFsc2UpO1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG9cdTIwMjZcIiB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJTeW5jQm9keShzZWMsIHRoaXMuc3luY0RhdGEhKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlckNvbmZsaWN0cyhzZWMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jQm9keShzZWM6IEhUTUxFbGVtZW50LCBkOiBTeW5jRGF0YSkge1xuICAgIGNvbnN0IGJveCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1ib3hcIiB9KTtcblxuICAgIC8vIEVzdGFkbyBkYSBwYXN0YS5cbiAgICBjb25zdCBidXN5ID0gZC5zdGF0ZSA9PT0gXCJzeW5jaW5nXCIgfHwgZC5zdGF0ZSA9PT0gXCJzY2FubmluZ1wiO1xuICAgIGNvbnN0IGZsID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWZvbGRlclwiIH0pO1xuICAgIGNvbnN0IGRvdCA9IGZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kb3QgXCIgKyAoZC5lcnJvcnMgPyBcIndkLXMtZXJyXCIgOiBidXN5ID8gXCJ3ZC1zLWJ1c3lcIiA6IFwid2Qtcy1va1wiKSB9KTtcbiAgICBkb3Quc2V0VGV4dChkLmVycm9ycyA/IFwiXHUyNkEwXCIgOiBidXN5ID8gXCJcdTI3RjNcIiA6IFwiXHUyNUNGXCIpO1xuICAgIGZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1mbmFtZVwiLCB0ZXh0OiBkLmZvbGRlckxhYmVsIH0pO1xuICAgIGNvbnN0IHN0ID0gZC5zdGF0ZSA9PT0gXCJpZGxlXCIgPyBcImVtIGRpYVwiIDogZC5zdGF0ZSA9PT0gXCJzeW5jaW5nXCIgPyBgc2luY3Jvbml6YW5kbyBcdTIwMTQgJHtkLm5lZWRGaWxlc30gaXRlbnMgKCR7aHVtYW5CeXRlcyhkLm5lZWRCeXRlcyl9KWAgOiBkLnN0YXRlO1xuICAgIGZsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1mc3RhdGVcIiwgdGV4dDogc3QgfSk7XG5cbiAgICAvLyBBcGFyZWxob3MuXG4gICAgZm9yIChjb25zdCBkZXYgb2YgZC5kZXZpY2VzKSB7XG4gICAgICBjb25zdCByb3cgPSBib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtZGV2XCIgfSk7XG4gICAgICBjb25zdCBvID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kb3QgXCIgKyAoZGV2Lm9ubGluZSA/IFwid2Qtcy1va1wiIDogXCJ3ZC1zLW9mZlwiKSB9KTtcbiAgICAgIG8uc2V0VGV4dChcIlx1MjVDRlwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG5hbWVcIiwgdGV4dDogZGV2Lm5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRjb21wXCIsIHRleHQ6IGAke01hdGgucm91bmQoZGV2LmNvbXBsZXRpb24pfSVgIH0pO1xuICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgJiYgZGV2Lmdsb2JhbEl0ZW1zKVxuICAgICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRjb3VudFwiLCB0ZXh0OiBgJHtkZXYuZ2xvYmFsSXRlbXMgLSBkZXYubmVlZEl0ZW1zfS8ke2Rldi5nbG9iYWxJdGVtc31gIH0pO1xuICAgICAgY29uc3QgZXh0cmEgPSBkZXYubmVlZERlbGV0ZXMgPyBgJHtkZXYubmVlZERlbGV0ZXN9IGV4Y2x1c1x1MDBGNWVzYCA6IGRldi5uZWVkQnl0ZXMgPyBodW1hbkJ5dGVzKGRldi5uZWVkQnl0ZXMpIDogXCJcIjtcbiAgICAgIGlmIChleHRyYSkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kcGVuZFwiLCB0ZXh0OiBleHRyYSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHNlZW5cIiwgdGV4dDogZGV2Lm9ubGluZSA/IFwib25saW5lXCIgOiByZWxUaW1lKGRldi5sYXN0U2VlbikgfSk7XG4gICAgfVxuXG4gICAgaWYgKGQuZXJyb3JzKSBib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtZXJybGluZVwiLCB0ZXh0OiBgXHUyNkEwICR7ZC5lcnJvcnN9IGVycm8ocykgbmEgcGFzdGFgIH0pO1xuICB9XG5cbiAgLy8gTGlzdGEgZGUgY1x1MDBGM3BpYXMgZGUgY29uZmxpdG8gZG8gU3luY3RoaW5nIChhYnJpciAvIGFwYWdhciBjb20gY29uZmlybWFcdTAwRTdcdTAwRTNvKS5cbiAgcHJpdmF0ZSByZW5kZXJDb25mbGljdHMoc2VjOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGNvbmZsaWN0cyA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKCkuZmlsdGVyKGYgPT4gZi5uYW1lLmluY2x1ZGVzKFwiLnN5bmMtY29uZmxpY3QtXCIpKTtcbiAgICBjb25zdCB3cmFwID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWNvbmZsaWN0c1wiIH0pO1xuICAgIHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtc3ViXCIsIHRleHQ6IGBDb25mbGl0b3MgKCR7Y29uZmxpY3RzLmxlbmd0aH0pYCB9KTtcbiAgICBpZiAoIWNvbmZsaWN0cy5sZW5ndGgpIHtcbiAgICAgIHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtbm9jb25mXCIsIHRleHQ6IFwiTmVuaHVtIGNvbmZsaXRvLiBcdUQ4M0NcdURGODlcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIGNvbmZsaWN0cykge1xuICAgICAgY29uc3Qgcm93ID0gd3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jcm93XCIgfSk7XG4gICAgICBjb25zdCBuYW1lID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jbmFtZVwiLCB0ZXh0OiBmLm5hbWUgfSk7XG4gICAgICBuYW1lLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIFwiICsgZi5wYXRoKTtcbiAgICAgIG5hbWUub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIGlmICh0aGlzLmNvbmZsaWN0Q29uZmlybSA9PT0gZi5wYXRoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY3llc1wiLCB0ZXh0OiBcImFwYWdhcj9cIiB9KTtcbiAgICAgICAgeWVzLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnRyYXNoKGYsIGZhbHNlKTsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgICBjb25zdCBubyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25vXCIsIHRleHQ6IFwiY2FuY2VsYXJcIiB9KTtcbiAgICAgICAgbm8ub25jbGljayA9ICgpID0+IHsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGVsID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jZGVsXCIgfSk7XG4gICAgICAgIHNldEljb24oZGVsLCBcInRyYXNoLTJcIik7XG4gICAgICAgIGRlbC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBcGFnYXIgY1x1MDBGM3BpYSBkZSBjb25mbGl0byAodmFpIHBhcmEgYSBsaXhlaXJhKVwiKTtcbiAgICAgICAgZGVsLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gZi5wYXRoOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvciAoaGV4KSBkZSB1bWEgZXRpcXVldGEgcGVsbyBub21lOyBjaW56YSBzZSBkZXNjb25oZWNpZGEuXG4gIHByaXZhdGUgbGFiZWxDb2xvcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRvZG9pc3RMYWJlbENvbG9yLmdldChuYW1lKSA/PyBMQUJFTF9GQUxMQkFDSztcbiAgfVxuXG4gIC8vIENyaWEgdW0gY2hpcCBkZSBldGlxdWV0YSBjb20gYm9saW5oYSBjb2xvcmlkYSArIFwiQG5vbWVcIi5cbiAgcHJpdmF0ZSBsYWJlbENoaXAoaG9zdDogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY2xzOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpcCA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMubGFiZWxDb2xvcihuYW1lKTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bmFtZX1gIH0pO1xuICAgIHJldHVybiBjaGlwO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYWRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYWRlcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIlNlY29uZCBCcmFpblwiIH0pO1xuXG4gICAgY29uc3QgdG9nZ2xlID0gaC5jcmVhdGVTcGFuKHtcbiAgICAgIGNsczogXCJ3ZC1jb21wYWN0LXRvZ2dsZVwiLFxuICAgICAgdGV4dDogdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA/IFwiXHUyNUE2IGNvbXBhY3RvXCIgOiBcIlx1MjVBNCBjb25mb3J0XHUwMEUxdmVsXCIsXG4gICAgfSk7XG4gICAgdG9nZ2xlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFsdGVybmFyIG1vZG8gY29tcGFjdG9cIik7XG4gICAgdG9nZ2xlLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID0gIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3Q7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGx1Z2luIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZXJ1c0Rhc2hib2FyZCBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBEYXNoU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgRGFzaGJvYXJkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGF5b3V0LWRhc2hib2FyZFwiLCBcIkFicmlyIFdlcnVzIERhc2hib2FyZFwiLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1kYXNoYm9hcmRcIiwgbmFtZTogXCJBYnJpciBEYXNoYm9hcmRcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbigpIH0pO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgV2VydXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gIH1cblxuICAvLyBSZS1idXNjYSBvIFRvZG9pc3QgZW0gdG9kYXMgYXMgZGFzaGJvYXJkcyBhYmVydGFzIChleC46IGFwXHUwMEYzcyBtdWRhciBvIHRva2VuKS5cbiAgcmVmcmVzaERhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFRvZG9pc3QoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXNldGEgbyBlc3RhZG8gZG8gU3luY3RoaW5nIGVtIHRvZGFzIGFzIGRhc2hib2FyZHMgKGV4LjogdG9rZW4vVVJMIGFsdGVyYWRvcykuXG4gIHJlZnJlc2hTeW5jKCkge1xuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSkpIHtcbiAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcpIHYucmVzZXRTeW5jKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIC8vIFNhbmVhbWVudG86IHNlY3Rpb25PcmRlciBjb20gZXhhdGFtZW50ZSBhcyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl07XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8U2VjdGlvbklkPigpO1xuICAgIGNvbnN0IGNsZWFuZWQgPSAodGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgfHwgW10pLmZpbHRlcihcbiAgICAgIChzKTogcyBpcyBTZWN0aW9uSWQgPT4gdmFsaWQuaW5jbHVkZXMocyBhcyBTZWN0aW9uSWQpICYmICFzZWVuLmhhcyhzIGFzIFNlY3Rpb25JZCkgJiYgKHNlZW4uYWRkKHMgYXMgU2VjdGlvbklkKSwgdHJ1ZSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWxpZCkgaWYgKCFzZWVuLmhhcyh2KSkgY2xlYW5lZC5wdXNoKHYpO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gY2xlYW5lZDsgICAvLyBcInJlcG9ydHNcIiBzb21lIGFxdWkgc2UgZXN0YXZhIG51bWEgY29uZmlnIGFudGlnYVxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNldHRpbmdzLmhpZGRlbikpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gW107XG4gICAgLy8gRm9udGVzIGRhIFNlbWFuYSAodjAuMTAuMSk6IHZhbGlkYSBhIGxpc3RhOyBzZSBhdXNlbnRlL2ludlx1MDBFMWxpZGEsIHVzYSBvIGRlZmF1bHQuXG4gICAgY29uc3QgY3MgPSB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IEFycmF5LmlzQXJyYXkoY3MpICYmIGNzLmxlbmd0aFxuICAgICAgPyBjcy5maWx0ZXIocyA9PiBzICYmIHR5cGVvZiBzLnBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgLm1hcChzID0+ICh7IHBhdGg6IHMucGF0aCwgY29sb3I6IHR5cGVvZiBzLmNvbG9yID09PSBcInN0cmluZ1wiID8gcy5jb2xvciA6IEFDQ0VOVFNbMF0sIG9uOiBzLm9uICE9PSBmYWxzZSB9KSlcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5jYWxlbmRhclNvdXJjZXMubWFwKHMgPT4gKHsgLi4ucyB9KSk7XG4gICAgLy8gU2FuZWFtZW50byBUb2RvaXN0ICh2MC43LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPT09IDMgPyAzIDogNztcbiAgICBjb25zdCB0ZiA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycyA9IHtcbiAgICAgIHByb2plY3RzOiBBcnJheS5pc0FycmF5KHRmPy5wcm9qZWN0cykgPyB0Zi5wcm9qZWN0cyA6IFtdLFxuICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHRmPy5sYWJlbHMpID8gdGYubGFiZWxzIDogW10sXG4gICAgfTtcbiAgICAvLyBFeGliaVx1MDBFN1x1MDBFM28gbmFzIGxpbmhhcyAodjAuOC4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ICE9PSBmYWxzZTtcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9PT0gdHJ1ZTtcbiAgICAvLyBTeW5jdGhpbmcgKHYwLjEwLjApLlxuICAgIGlmICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgIT09IFwic3RyaW5nXCIgfHwgIXRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKSlcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsID0gXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIjtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ICE9PSBcInN0cmluZ1wiKSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IFwiXCI7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkICE9PSBcInN0cmluZ1wiKSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gXCJcIjtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPT09IHRydWU7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7IGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7IH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUG9wLXVwIGRlIGRldGFsaGVzIGRhIHRhcmVmYSAoc1x1MDBGMyBsZWl0dXJhOyBib3RcdTAwRTNvIEVkaXRhciBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvKSBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tEZXRhaWxPcHRzIHtcbiAgdGFzazogVG9kb2lzdFRhc2s7XG4gIHByb2plY3ROYW1lPzogc3RyaW5nO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGVkaXQ6ICgpID0+IHZvaWQ7XG4gIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRGV0YWlsTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LCBwcml2YXRlIG9wdHM6IFRhc2tEZXRhaWxPcHRzKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgdCA9IHRoaXMub3B0cy50YXNrO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLW1vZGFsXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0LmNvbnRlbnQpO1xuXG4gICAgY29uc3QgbWV0YSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGBcdUQ4M0RcdURDQzUgJHtkfS8ke219LyR7eX0ke3QuZHVlPy5pc19yZWN1cnJpbmcgPyBcIiBcdTI3RjNcIiA6IFwiXCJ9YCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0cy5wcm9qZWN0TmFtZSkgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYCMgJHt0aGlzLm9wdHMucHJvamVjdE5hbWV9YCB9KTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcCB3ZC10ZC1sYWJlbFwiIH0pO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgdm9pZCBNYXJrZG93blJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcCwgdC5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIC8vIEVkaXRhciAoZXNxdWVyZGEpIFx1MDBCNyBDb25jbHVpciArIEFicmlyIG5vIFRvZG9pc3QgKGRpcmVpdGEpLlxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IGVkaXQgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MEUgRWRpdGFyXCIgfSk7XG4gICAgZWRpdC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHRoaXMub3B0cy5lZGl0KCk7IH07XG4gICAgYWN0aW9ucy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgZG9uZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcxMyBDb25jbHVpclwiIH0pO1xuICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICBjb25zdCBvcGVuID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQWJyaXIgbm8gVG9kb2lzdFwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodCksIFwiX2JsYW5rXCIpO1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgLyBlZGl0YXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0Zvcm1WYWx1ZXMge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJIDEuLjQgKDQgPSBwMSlcbiAgZHVlRGF0ZTogc3RyaW5nOyAgICAvLyBZWVlZLU1NLUREIChjYWxlbmRcdTAwRTFyaW8pOyBcIlwiID0gc2VtIGRhdGFcbiAgcHJvamVjdElkOiBzdHJpbmc7XG4gIGxhYmVsczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBUYXNrRm9ybU9wdHMge1xuICBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7XG4gIHRhc2s/OiBUb2RvaXN0VGFzaztcbiAgcHJlZmlsbER1ZT86IHN0cmluZztcbiAgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W107XG4gIGxhYmVsczogc3RyaW5nW107XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgc3VibWl0OiAodjogVGFza0Zvcm1WYWx1ZXMpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIHJlbW92ZT86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0Zvcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSB2OiBUYXNrRm9ybVZhbHVlcztcbiAgcHJpdmF0ZSBrbm93bkxhYmVsczogc3RyaW5nW107XG4gIHByaXZhdGUgY29uZmlybURlbCA9IGZhbHNlO1xuICBwcml2YXRlIGFjdGlvbnNFbCE6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IFRhc2tGb3JtT3B0cykge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgdCA9IG9wdHMudGFzaztcbiAgICAvLyBQcmVmaWxsIGRlIGNyaWFcdTAwRTdcdTAwRTNvOiBcImhvamVcIiBcdTIxOTIgZGF0YSBkZSBob2plOyBqXHUwMEUxLVlZWVktTU0tREQgcGFzc2EgZGlyZXRvOyByZXN0byBpZ25vcmEuXG4gICAgY29uc3QgcHJlID0gb3B0cy5wcmVmaWxsRHVlO1xuICAgIGNvbnN0IHByZWZpbGxEYXRlID0gcHJlID09PSBcImhvamVcIiA/IHRvS2V5KG5ldyBEYXRlKCkpXG4gICAgICA6IChwcmUgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocHJlKSA/IHByZSA6IFwiXCIpO1xuICAgIHRoaXMudiA9IHtcbiAgICAgIGNvbnRlbnQ6IHQ/LmNvbnRlbnQgPz8gXCJcIixcbiAgICAgIGRlc2NyaXB0aW9uOiB0Py5kZXNjcmlwdGlvbiA/PyBcIlwiLFxuICAgICAgcHJpb3JpdHk6IHQ/LnByaW9yaXR5ID8/IDEsXG4gICAgICBkdWVEYXRlOiB0Py5kdWU/LmRhdGUgPyB0LmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBwcmVmaWxsRGF0ZSxcbiAgICAgIHByb2plY3RJZDogdD8ucHJvamVjdF9pZCA/PyBcIlwiLFxuICAgICAgbGFiZWxzOiAodD8ubGFiZWxzID8/IFtdKS5zbGljZSgpLFxuICAgIH07XG4gICAgdGhpcy5rbm93bkxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5vcHRzLmxhYmVscywgLi4udGhpcy52LmxhYmVsc10pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLWZvcm1cIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHRoaXMub3B0cy5tb2RlID09PSBcImNyZWF0ZVwiID8gXCJOb3ZhIHRhcmVmYVwiIDogXCJFZGl0YXIgdGFyZWZhXCIpO1xuXG4gICAgLy8gU1x1MDBGMyBuYSBlZGlcdTAwRTdcdTAwRTNvOiBhdGFsaG8gXCJBYnJpciBubyBUb2RvaXN0XCIgbm8gdG9wbywgYW8gbGFkbyBkbyBYIGRlIGZlY2hhci5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiICYmIHRoaXMub3B0cy50YXNrKSB7XG4gICAgICBjb25zdCBvcGVuID0gbW9kYWxFbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1vcGVuLXRvcFwiLCB0ZXh0OiBcIlx1MjE5NyBUb2RvaXN0XCIgfSk7XG4gICAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIG5vIFRvZG9pc3RcIik7XG4gICAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHRoaXMub3B0cy50YXNrISksIFwiX2JsYW5rXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZmllbGQoXCJUXHUwMEVEdHVsb1wiKTtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgY29udGVudC52YWx1ZSA9IHRoaXMudi5jb250ZW50O1xuICAgIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBcIk8gcXVlIHByZWNpc2Egc2VyIGZlaXRvP1wiO1xuICAgIGNvbnRlbnQub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmNvbnRlbnQgPSBjb250ZW50LnZhbHVlOyB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGVudC5mb2N1cygpLCAwKTtcblxuICAgIHRoaXMuZmllbGQoXCJEZXNjcmlcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNvbnN0IGRlc2MgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC10Zi10ZXh0YXJlYVwiIH0pO1xuICAgIGRlc2MudmFsdWUgPSB0aGlzLnYuZGVzY3JpcHRpb247XG4gICAgZGVzYy5wbGFjZWhvbGRlciA9IFwiRGV0YWxoZXMgLyBpbnN0cnVcdTAwRTdcdTAwRjVlcyAobWFya2Rvd24pXCI7XG4gICAgZGVzYy5yb3dzID0gMztcbiAgICBkZXNjLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kZXNjcmlwdGlvbiA9IGRlc2MudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJpb3JpZGFkZVwiKTtcbiAgICBjb25zdCBwcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1wcmktcm93XCIgfSk7XG4gICAgY29uc3QgcmVuZGVyUHJpID0gKCkgPT4ge1xuICAgICAgcHJvdy5lbXB0eSgpO1xuICAgICAgZm9yIChjb25zdCBhcGkgb2YgWzQsIDMsIDIsIDFdKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBUT0RPSVNUX1BSSVthcGldO1xuICAgICAgICBjb25zdCBiID0gcHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLXByaVwiICsgKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgICBiLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgbWV0YS5jb2xvcik7XG4gICAgICAgIGIub25jbGljayA9ICgpID0+IHsgdGhpcy52LnByaW9yaXR5ID0gYXBpOyByZW5kZXJQcmkoKTsgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlclByaSgpO1xuXG4gICAgdGhpcy5maWVsZChcIkRhdGFcIik7XG4gICAgY29uc3QgZHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtZHVlLXJvd1wiIH0pO1xuICAgIGNvbnN0IGR1ZSA9IGRyb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC10Zi1pbnB1dCB3ZC10Zi1kYXRlXCIsIHR5cGU6IFwiZGF0ZVwiIH0pO1xuICAgIGR1ZS52YWx1ZSA9IHRoaXMudi5kdWVEYXRlO1xuICAgIGR1ZS5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBkdWUudmFsdWU7IH07XG4gICAgY29uc3QgY2xyID0gZHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1kdWUtY2xlYXJcIiwgdGV4dDogXCJzZW0gZGF0YVwiIH0pO1xuICAgIGNsci5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IFwiXCI7IGR1ZS52YWx1ZSA9IFwiXCI7IH07XG4gICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ2xpcXVlIHBhcmEgYWJyaXIgbyBjYWxlbmRcdTAwRTFyaW8uIFZhemlvID0gc2VtIGRhdGEuXCIgfSk7XG4gICAgaWYgKHRoaXMub3B0cy50YXNrPy5kdWU/LmlzX3JlY3VycmluZylcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtd2FyblwiLCB0ZXh0OiBcIlx1MjdGMyBUYXJlZmEgcmVjb3JyZW50ZSBcdTIwMTQgbXVkYXIgYSBkYXRhIGZpeGEgcG9kZSBlbmNlcnJhciBhIHJlY29yclx1MDBFQW5jaWEuXCIgfSk7XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJvamV0b1wiKTtcbiAgICBjb25zdCBzZWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtdGYtc2VsZWN0XCIgfSk7XG4gICAgY29uc3QgaW5ib3ggPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBcIkVudHJhZGEgKEluYm94KVwiLCB2YWx1ZTogXCJcIiB9KTtcbiAgICBpZiAoIXRoaXMudi5wcm9qZWN0SWQpIGluYm94LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5vcHRzLnByb2plY3RzKSB7XG4gICAgICBjb25zdCBvID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogcC5uYW1lLCB2YWx1ZTogcC5pZCB9KTtcbiAgICAgIGlmIChwLmlkID09PSB0aGlzLnYucHJvamVjdElkKSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc2VsLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYucHJvamVjdElkID0gc2VsLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIkV0aXF1ZXRhc1wiKTtcbiAgICBjb25zdCBsd3JhcCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxzXCIgfSk7XG4gICAgaWYgKHRoaXMua25vd25MYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCByZW5kZXJMYWJlbHMgPSAoKSA9PiB7XG4gICAgICAgIGx3cmFwLmVtcHR5KCk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmtub3duTGFiZWxzKSB7XG4gICAgICAgICAgY29uc3Qgb24gPSB0aGlzLnYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsd3JhcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMudi5sYWJlbHMuaW5kZXhPZihsKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHRoaXMudi5sYWJlbHMuc3BsaWNlKGksIDEpOyBlbHNlIHRoaXMudi5sYWJlbHMucHVzaChsKTtcbiAgICAgICAgICAgIHJlbmRlckxhYmVscygpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QgYWluZGEuXCIgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3Rpb25zRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICB0aGlzLnJlbmRlckFjdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZmllbGQobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQWN0aW9ucygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5hY3Rpb25zRWw7XG4gICAgYS5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlybURlbCAmJiB0aGlzLm9wdHMucmVtb3ZlKSB7XG4gICAgICBhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtY29uZmlybVwiLCB0ZXh0OiBcIkV4Y2x1aXIgZXN0YSB0YXJlZmE/XCIgfSk7XG4gICAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICAgIGNvbnN0IHllcyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICB5ZXMub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgeWVzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5yZW1vdmUhKCkpIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiKSB7XG4gICAgICBjb25zdCBkZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgZGVsLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IHRydWU7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgIH1cblxuICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGNhbmNlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgY2FuY2VsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgc2F2ZSA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlNhbHZhclwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIHNhdmUub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMudi5jb250ZW50ID0gdGhpcy52LmNvbnRlbnQudHJpbSgpO1xuICAgICAgaWYgKCF0aGlzLnYuY29udGVudCkgeyBuZXcgTm90aWNlKFwiRFx1MDBFQSB1bSB0XHUwMEVEdHVsbyBcdTAwRTAgdGFyZWZhLlwiKTsgcmV0dXJuOyB9XG4gICAgICBzYXZlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMuc3VibWl0KHRoaXMudikpIHRoaXMuY2xvc2UoKTtcbiAgICAgIGVsc2Ugc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICBvbkNsb3NlKCkgeyB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpOyB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGUgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIFdlcnVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGFwcCwgcGx1Z2luKTsgfVxuXG4gIGRpc3BsYXkoKSB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJUb2tlbiBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiVG9kb2lzdCBcdTIxOTIgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIEludGVncmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgVG9rZW4gZGUgQVBJIGRvIGRlc2Vudm9sdmVkb3IuIFNhbHZvIGxvY2FsbWVudGUgZW0gZGF0YS5qc29uIChuXHUwMEUzbyB2YWkgcGFyYSBvIEdpdCkuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImNvbGUgbyB0b2tlbiBhcXVpXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4gPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJFeGliaVx1MDBFN1x1MDBFM28gZGFzIHRhcmVmYXNcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIG8gcHJvamV0byBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIG8gbm9tZSBkbyBwcm9qZXRvIGFvIGxhZG8gZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBhcyBAZXRpcXVldGFzIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlNpbmNyb25pemFcdTAwRTdcdTAwRTNvIChTeW5jdGhpbmcpXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVVJMIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJFbmRlcmVcdTAwRTdvIGRvIFN5bmN0aGluZy4gUGFkclx1MDBFM286IGh0dHA6Ly8xMjcuMC4wLjE6ODM4NCAoYSBpbnN0XHUwMEUybmNpYSBsb2NhbCkuIE5vIGNlbHVsYXIsIGFwb250ZSBwYXJhIGEgQVBJIGRlIG91dHJhIG1cdTAwRTFxdWluYSBuYSByZWRlIHNlIGEgbG9jYWwgblx1MDBFM28gcmVzcG9uZGVyLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IHYudHJpbSgpIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQVBJIGtleVwiKVxuICAgICAgLnNldERlc2MoXCJTeW5jdGhpbmcgXHUyMTkyIEFjdGlvbnMgXHUyMTkyIFNldHRpbmdzIFx1MjE5MiBBUEkgS2V5LiBTYWx2YSBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIGEgQVBJIGtleVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIklEIGRhIHBhc3RhIChvcGNpb25hbClcIilcbiAgICAgIC5zZXREZXNjKFwiRm9sZGVyIElEIGRvIGNvZnJlIG5vIFN5bmN0aGluZy4gVmF6aW8gPSB1c2EgYSBwcmltZWlyYSBwYXN0YSBhdXRvbWF0aWNhbWVudGUuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImV4LjogbnVucXYtbXRpbW5cIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGNvbnRhZ2VtIGRlIGl0ZW5zIHBvciBhcGFyZWxob1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBcXFwic2luY3Jvbml6YWRvcyAvIHRvdGFsXFxcIiBkZSBpdGVucyBlbSBjYWRhIGFwYXJlbGhvLCBhbFx1MDBFOW0gZGEgcG9yY2VudGFnZW0uXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgIH0pKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQTJLO0FBRTNLLElBQU0sWUFBWTtBQW1DbEIsSUFBTSxtQkFBaUM7QUFBQSxFQUNyQyxjQUFjLENBQUMsU0FBUyxXQUFXLFFBQVEsUUFBUSxXQUFXLFVBQVUsVUFBVTtBQUFBLEVBQ2xGLFNBQVM7QUFBQSxFQUNULFFBQVEsQ0FBQztBQUFBLEVBQ1QsVUFBVTtBQUFBLEVBQ1YsaUJBQWlCO0FBQUEsSUFDZixFQUFFLE1BQU0sbUNBQWdDLE9BQU8sV0FBVyxJQUFJLEtBQUs7QUFBQSxJQUNuRSxFQUFFLE1BQU0sZ0JBQWdDLE9BQU8sV0FBVyxJQUFJLEtBQUs7QUFBQSxFQUNyRTtBQUFBLEVBQ0EsY0FBYztBQUFBLEVBQ2QsaUJBQWlCO0FBQUEsRUFDakIsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUU7QUFBQSxFQUMzQyxvQkFBb0I7QUFBQSxFQUNwQixtQkFB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
