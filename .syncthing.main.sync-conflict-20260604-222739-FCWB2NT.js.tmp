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
  sectionOrder: ["stats", "todoist", "para", "heatmap", "growth", "reports", "calendar"],
  compact: false,
  hidden: [],
  noteView: "list",
  todoistToken: "",
  todoistDayRange: 7,
  todoistFilters: { projects: [], labels: [] },
  todoistShowProject: true,
  todoistShowLabels: false
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
var SEC_REP = "sec:reports";
var SEC_HEAT = "sec:heatmap";
var SEC_GROW = "sec:growth";
var SEC_STAT = "sec:stats";
var SEC_TODO = "sec:todoist";
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
      else if (id === "reports") this.renderReports(root);
      else if (id === "growth") this.renderGrowth(root);
      else if (id === "stats") this.renderStats(root);
      else if (id === "todoist") this.renderTodoist(root);
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
    if (key === SEC_REP) return "\u{1F4C4} Relat\xF3rios Claude";
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
    var _a, _b, _c, _d;
    if (this.isHidden(SEC_CAL)) return;
    const monday = mondayOf(this.weekOffset);
    const weekNum = isoWeekNumber(monday);
    const todayK = toKey(/* @__PURE__ */ new Date());
    const byDay = {};
    for (const file of this.app.vault.getMarkdownFiles()) {
      const d = normalizeDate((_b = (_a = this.app.metadataCache.getCache(file.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.date);
      if (d) ((_c = byDay[d]) != null ? _c : byDay[d] = []).push({ name: file.basename, file });
    }
    const sec = root.createDiv({ cls: "wd-section wd-cal-section" });
    const nav = sec.createDiv({ cls: "wd-cal-nav-bar" });
    nav.createSpan({ cls: "wd-cal-week-label", text: `Semana ${weekNum}` });
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
    this.moveControls(ctrls, "calendar");
    this.hideBtn(ctrls, SEC_CAL, "Ocultar calend\xE1rio", "wd-sec-hide");
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
      const items = (_d = byDay[key]) != null ? _d : [];
      for (const it of items.slice(0, 3)) {
        const pill = col.createDiv({ cls: "wd-cal-pill" });
        pill.textContent = it.name.length > 14 ? it.name.slice(0, 14) + "\u2026" : it.name;
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
  // Abre a nota diária de `key` (YYYY-MM-DD); cria em 50.Diário/ se não existir.
  async openDailyNote(key) {
    const path = `${DAILY_FOLDER}/${key}.md`;
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian.TFile)) {
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
      file = await this.app.vault.create(path, body);
    }
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
  // ── Relatórios ────────────────────────────────────────────────────────────
  renderReports(root) {
    var _a, _b;
    if (this.isHidden(SEC_REP)) return;
    const dir = this.app.vault.getAbstractFileByPath("40.Archive/Relat\xF3rios Claude");
    if (!(dir instanceof import_obsidian.TFolder)) return;
    const items = [];
    for (const c of dir.children) {
      if (!(c instanceof import_obsidian.TFile) || c.extension !== "md") continue;
      const d = normalizeDate((_b = (_a = this.app.metadataCache.getCache(c.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.date);
      if (d) items.push({ file: c, date: d });
    }
    items.sort((a, b) => b.date.localeCompare(a.date));
    if (!items.length) return;
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "RELAT\xD3RIOS CLAUDE" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.moveControls(ctrls, "reports");
    this.hideBtn(ctrls, SEC_REP, "Ocultar Relat\xF3rios Claude", "wd-sec-hide");
    const list = sec.createDiv({ cls: "wd-report-list" });
    for (const { file, date } of items.slice(0, 6)) {
      const [y, m, d] = date.split("-");
      const row = list.createDiv({ cls: "wd-report-row" });
      row.createSpan({ cls: "wd-report-date", text: `${d}/${m}/${y}` });
      row.createSpan({ cls: "wd-report-name", text: file.basename });
      row.onclick = () => this.app.workspace.getLeaf(false).openFile(file);
    }
  }
  // ── Heatmap (via plugin Heatmap Calendar) ─────────────────────────────────
  renderHeatmap(root) {
    var _a;
    if (this.isHidden(SEC_HEAT)) return;
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
    const DAYS = 30;
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
    info.createSpan({ cls: "wd-growth-period", text: this.growthCumulative ? "notas acumuladas (30 dias)" : "notas criadas nos \xFAltimos 30 dias" });
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
    var _a, _b, _c, _d, _e, _f, _g;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    try {
      if (mode === "create") {
        const fields = { content: v.content, priority: v.priority };
        if (v.description.trim()) fields.description = v.description.trim();
        if (v.dueString.trim()) {
          fields.due_string = v.dueString.trim();
          fields.due_lang = "pt";
        }
        if (v.projectId) fields.project_id = v.projectId;
        if (v.labels.length) fields.labels = v.labels;
        await createTodoistTask(token, fields);
        new import_obsidian.Notice(`\u2713 Criada: ${v.content}`);
      } else if (task) {
        const fields = {};
        if (v.content !== task.content) fields.content = v.content;
        if (v.description !== ((_a = task.description) != null ? _a : "")) fields.description = v.description;
        if (v.priority !== task.priority) fields.priority = v.priority;
        const oldDue = (_e = (_d = (_b = task.due) == null ? void 0 : _b.string) != null ? _d : (_c = task.due) == null ? void 0 : _c.date) != null ? _e : "";
        if (v.dueString.trim() !== oldDue) {
          fields.due_string = v.dueString.trim() || "no date";
          if (v.dueString.trim()) fields.due_lang = "pt";
        }
        const oldL = ((_f = task.labels) != null ? _f : []).slice().sort().join("\0");
        const newL = v.labels.slice().sort().join("\0");
        if (oldL !== newL) fields.labels = v.labels;
        if (Object.keys(fields).length) await updateTodoistTask(token, task.id, fields);
        const oldProj = (_g = task.project_id) != null ? _g : "";
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
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    const valid = ["stats", "todoist", "para", "heatmap", "growth", "reports", "calendar"];
    const seen = /* @__PURE__ */ new Set();
    const cleaned = (this.settings.sectionOrder || []).filter(
      (s) => valid.includes(s) && !seen.has(s) && (seen.add(s), true)
    );
    for (const v of valid) if (!seen.has(v)) cleaned.push(v);
    this.settings.sectionOrder = cleaned;
    if (!Array.isArray(this.settings.hidden)) this.settings.hidden = [];
    this.settings.todoistDayRange = this.settings.todoistDayRange === 3 ? 3 : 7;
    const tf = this.settings.todoistFilters;
    this.settings.todoistFilters = {
      projects: Array.isArray(tf == null ? void 0 : tf.projects) ? tf.projects : [],
      labels: Array.isArray(tf == null ? void 0 : tf.labels) ? tf.labels : []
    };
    this.settings.todoistShowProject = this.settings.todoistShowProject !== false;
    this.settings.todoistShowLabels = this.settings.todoistShowLabels === true;
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    super(app);
    this.opts = opts;
    this.confirmDel = false;
    const t = opts.task;
    this.v = {
      content: (_a = t == null ? void 0 : t.content) != null ? _a : "",
      description: (_b = t == null ? void 0 : t.description) != null ? _b : "",
      priority: (_c = t == null ? void 0 : t.priority) != null ? _c : 1,
      dueString: (_f = (_e = (_d = t == null ? void 0 : t.due) == null ? void 0 : _d.string) != null ? _e : opts.prefillDue) != null ? _f : "",
      projectId: (_g = t == null ? void 0 : t.project_id) != null ? _g : "",
      labels: ((_h = t == null ? void 0 : t.labels) != null ? _h : []).slice()
    };
    this.knownLabels = [.../* @__PURE__ */ new Set([...opts.labels, ...this.v.labels])].sort((a, b) => a.localeCompare(b));
  }
  onOpen() {
    var _a, _b;
    const { contentEl, titleEl, modalEl } = this;
    modalEl.addClass("wd-task-form");
    titleEl.setText(this.opts.mode === "create" ? "Nova tarefa" : "Editar tarefa");
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
    const due = contentEl.createEl("input", { cls: "wd-tf-input", type: "text" });
    due.value = this.v.dueString;
    due.placeholder = "ex.: amanh\xE3, sexta, todo dia 1, 2026-06-10";
    due.oninput = () => {
      this.v.dueString = due.value;
    };
    contentEl.createDiv({ cls: "wd-tf-hint", text: "Texto em portugu\xEAs. Vazio = sem data." });
    if ((_b = (_a = this.opts.task) == null ? void 0 : _a.due) == null ? void 0 : _b.is_recurring)
      contentEl.createDiv({ cls: "wd-tf-warn", text: "\u27F3 Tarefa recorrente \u2014 mudar a data pode alterar a recorr\xEAncia." });
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
      const open = a.createEl("button", { text: "Abrir no Todoist" });
      open.onclick = () => {
        if (this.opts.task) window.open(taskUrl(this.opts.task), "_blank");
      };
      if (this.opts.complete) {
        const done = a.createEl("button", { text: "\u2713 Concluir" });
        done.onclick = () => {
          this.opts.complete();
          this.close();
        };
      }
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
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIFRGaWxlLCBURm9sZGVyLCBXb3Jrc3BhY2VMZWFmLCByZXF1ZXN0VXJsLCBzZXRJY29uIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmNvbnN0IFZJRVdfVFlQRSA9IFwid2VydXMtZGFzaGJvYXJkXCI7XG5cbnR5cGUgU3RhdHVzID0gXCJwcm9ncmVzc1wiIHwgXCJwYXVzZWRcIiB8IFwiY2FuY2VsbGVkXCI7XG50eXBlIFNlY3Rpb25JZCA9IFwiY2FsZW5kYXJcIiB8IFwicGFyYVwiIHwgXCJyZXBvcnRzXCIgfCBcImhlYXRtYXBcIiB8IFwiZ3Jvd3RoXCIgfCBcInN0YXRzXCIgfCBcInRvZG9pc3RcIjtcblxuaW50ZXJmYWNlIFRvZG9pc3RGaWx0ZXJzIHtcbiAgcHJvamVjdHM6IHN0cmluZ1tdOyAgIC8vIGlkcyBkZSBwcm9qZXRvIHNlbGVjaW9uYWRvcyAodmF6aW8gPSB0b2RvcylcbiAgbGFiZWxzOiBzdHJpbmdbXTsgICAgIC8vIG5vbWVzIGRlIGV0aXF1ZXRhIHNlbGVjaW9uYWRvcyAodmF6aW8gPSB0b2Rhcylcbn1cblxuaW50ZXJmYWNlIERhc2hTZXR0aW5ncyB7XG4gIHNlY3Rpb25PcmRlcjogU2VjdGlvbklkW107XG4gIGNvbXBhY3Q6IGJvb2xlYW47XG4gIGhpZGRlbjogc3RyaW5nW107ICAgLy8gY2FtaW5ob3MgZGUgcGFzdGEgb2N1bHRvcyArIFwic2VjOmNhbGVuZGFyXCIgLyBcInNlYzpyZXBvcnRzXCJcbiAgbm90ZVZpZXc6IFwibGlzdFwiIHwgXCJncmlkXCI7XG4gIHRvZG9pc3RUb2tlbjogc3RyaW5nO1xuICB0b2RvaXN0RGF5UmFuZ2U6IDMgfCA3OyAgICAgICAgLy8gcXVhbnRvcyBcInByXHUwMEYzeGltb3MgZGlhc1wiIG1vc3RyYXIgbmEgZ3JhZGVcbiAgdG9kb2lzdEZpbHRlcnM6IFRvZG9pc3RGaWx0ZXJzO1xuICB0b2RvaXN0U2hvd1Byb2plY3Q6IGJvb2xlYW47ICAgLy8gbW9zdHJhciBvIG5vbWUgZG8gcHJvamV0byBuYXMgbGluaGFzXG4gIHRvZG9pc3RTaG93TGFiZWxzOiBib29sZWFuOyAgICAvLyBtb3N0cmFyIGFzIGV0aXF1ZXRhcyBuYXMgbGluaGFzXG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhc2hTZXR0aW5ncyA9IHtcbiAgc2VjdGlvbk9yZGVyOiBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwiaGVhdG1hcFwiLCBcImdyb3d0aFwiLCBcInJlcG9ydHNcIiwgXCJjYWxlbmRhclwiXSxcbiAgY29tcGFjdDogZmFsc2UsXG4gIGhpZGRlbjogW10sXG4gIG5vdGVWaWV3OiBcImxpc3RcIixcbiAgdG9kb2lzdFRva2VuOiBcIlwiLFxuICB0b2RvaXN0RGF5UmFuZ2U6IDcsXG4gIHRvZG9pc3RGaWx0ZXJzOiB7IHByb2plY3RzOiBbXSwgbGFiZWxzOiBbXSB9LFxuICB0b2RvaXN0U2hvd1Byb2plY3Q6IHRydWUsXG4gIHRvZG9pc3RTaG93TGFiZWxzOiBmYWxzZSxcbn07XG5cbmludGVyZmFjZSBQYXJhU2VjdGlvbiB7XG4gIGZvbGRlcjogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGFjY2VudDogc3RyaW5nO1xufVxuXG4vLyBQYXN0YXMgXCJjb25oZWNpZGFzXCIgZG8gUEFSQTogbWFudFx1MDBFQW0gXHUwMEVEY29uZSwgclx1MDBGM3R1bG8gZSBjb3IgZml4b3MuIEFzIGRlbWFpcyBwYXN0YXNcbi8vIGRvIGNvZnJlIHNcdTAwRTNvIHJlbmRlcml6YWRhcyBjb20gY29yIGF1dG9tXHUwMEUxdGljYSBlIFx1MDBFRGNvbmUgcGFkclx1MDBFM28gKG91IG8gaWNvbjogZG8gc3RhdHVzLm1kKS5cbmNvbnN0IFBBUkE6IFBhcmFTZWN0aW9uW10gPSBbXG4gIHsgZm9sZGVyOiBcIjAwLkluYm94XCIsICAgICBpY29uOiBcIlx1RDgzRFx1RENFNVwiLCBsYWJlbDogXCJJbmJveFwiLCAgICBhY2NlbnQ6IFwiIzYzNjZGMVwiIH0sXG4gIHsgZm9sZGVyOiBcIjEwLlByb2plY3RzXCIsICBpY29uOiBcIlx1RDgzRFx1REU4MFwiLCBsYWJlbDogXCJQcm9qZXRvc1wiLCBhY2NlbnQ6IFwiIzEwQjk4MVwiIH0sXG4gIHsgZm9sZGVyOiBcIjIwLkFyZWFzXCIsICAgICBpY29uOiBcIlx1RDgzQ1x1REZBRlwiLCBsYWJlbDogXCJcdTAwQzFyZWFzXCIsICAgIGFjY2VudDogXCIjRjU5RTBCXCIgfSxcbiAgeyBmb2xkZXI6IFwiMzAuUmVzb3VyY2VzXCIsIGljb246IFwiXHVEODNEXHVEQ0RBXCIsIGxhYmVsOiBcIlJlY3Vyc29zXCIsIGFjY2VudDogXCIjM0I4MkY2XCIgfSxcbiAgeyBmb2xkZXI6IFwiNDAuQXJjaGl2ZVwiLCAgIGljb246IFwiXHVEODNEXHVEREM0XHVGRTBGXCIsICBsYWJlbDogXCJBcnF1aXZvXCIsICBhY2NlbnQ6IFwiIzZCNzI4MFwiIH0sXG5dO1xuY29uc3QgUEFSQV9NQVAgPSBuZXcgTWFwKFBBUkEubWFwKHAgPT4gW3AuZm9sZGVyLCBwXSkpO1xuXG4vLyBQYWxldGEgcGFyYSBjb2xvcmlyIHBhc3RhcyBkZXNjb25oZWNpZGFzIGRlIGZvcm1hIGVzdFx1MDBFMXZlbCAocG9yIGhhc2ggZG8gbm9tZSkuXG5jb25zdCBBQ0NFTlRTID0gW1wiIzYzNjZGMVwiLFwiIzEwQjk4MVwiLFwiI0Y1OUUwQlwiLFwiIzNCODJGNlwiLFwiI0VDNDg5OVwiLFwiIzhCNUNGNlwiLFwiIzE0QjhBNlwiLFwiI0VGNDQ0NFwiXTtcblxuY29uc3QgREFZX1NIT1JUID0gW1wiU2VnXCIsIFwiVGVyXCIsIFwiUXVhXCIsIFwiUXVpXCIsIFwiU2V4XCIsIFwiU1x1MDBFMWJcIiwgXCJEb21cIl07XG5jb25zdCBNT05USF9TSE9SVCA9IFtcIkphblwiLFwiRmV2XCIsXCJNYXJcIixcIkFiclwiLFwiTWFpXCIsXCJKdW5cIixcIkp1bFwiLFwiQWdvXCIsXCJTZXRcIixcIk91dFwiLFwiTm92XCIsXCJEZXpcIl07XG5jb25zdCBJTUdfRVhUID0gW1wicG5nXCIsXCJqcGdcIixcImpwZWdcIixcIndlYnBcIixcImdpZlwiLFwic3ZnXCJdO1xuXG4vLyBQYXN0YSByYWl6IGRhcyBub3RhcyBkaVx1MDBFMXJpYXMgKGNyaWFkYXMgYW8gY2xpY2FyIG51bSBkaWEgZG8gY2FsZW5kXHUwMEUxcmlvKS5cbmNvbnN0IERBSUxZX0ZPTERFUiA9IFwiNTAuRGlcdTAwRTFyaW9cIjtcbi8vIFRlbXBsYXRlIG9wY2lvbmFsOyBwbGFjZWhvbGRlcnMge3tkYXRlfX0gKFlZWVktTU0tREQpIGUge3t0aXRsZX19IChkYXRhIHBvciBleHRlbnNvKS5cbmNvbnN0IERBSUxZX1RFTVBMQVRFID0gXCJNb2RlbG9zL05vdGEgRGlcdTAwRTFyaWEubWRcIjtcblxuY29uc3QgU1RBVFVTX0lDT046IFJlY29yZDxTdGF0dXMsIHN0cmluZz4gPSB7XG4gIHByb2dyZXNzOiBcIlx1MjVCNlwiLCBwYXVzZWQ6IFwiXHUyM0Y4XCIsIGNhbmNlbGxlZDogXCJcdTI3MTVcIixcbn07XG5cbmNvbnN0IFNFQ19DQUwgPSBcInNlYzpjYWxlbmRhclwiO1xuY29uc3QgU0VDX1JFUCA9IFwic2VjOnJlcG9ydHNcIjtcbmNvbnN0IFNFQ19IRUFUID0gXCJzZWM6aGVhdG1hcFwiO1xuY29uc3QgU0VDX0dST1cgPSBcInNlYzpncm93dGhcIjtcbmNvbnN0IFNFQ19TVEFUID0gXCJzZWM6c3RhdHNcIjtcbmNvbnN0IFNFQ19UT0RPID0gXCJzZWM6dG9kb2lzdFwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRvZG9pc3RUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEk6IDEuLjQsIG9uZGUgNCA9IHVyZ2VudGUgKD0gcDEgbmEgVUkpXG4gIGR1ZT86IHsgZGF0ZTogc3RyaW5nOyBkYXRldGltZT86IHN0cmluZzsgc3RyaW5nPzogc3RyaW5nOyBpc19yZWN1cnJpbmc/OiBib29sZWFuIH0gfCBudWxsO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xuICBpc19jb21wbGV0ZWQ/OiBib29sZWFuO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG5cbi8vIEJ1c2NhIGFzIHRhcmVmYXMgYXRpdmFzIChuXHUwMEUzbyBjb25jbHVcdTAwRURkYXMpIHZpYSBBUEkgdW5pZmljYWRhIHYxIChhIFJFU1QgdjIgZm9pXG4vLyBhcG9zZW50YWRhIFx1MjE5MiByZXNwb25kaWEgNDEwKS4gQSB2MSBcdTAwRTkgcGFnaW5hZGE6IHsgcmVzdWx0cywgbmV4dF9jdXJzb3IgfS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RUYXNrW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0VGFza1tdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgLy8gdjEgZW52ZWxvcGEgZW0gcmVzdWx0czsgdG9sZXJhIHJlc3Bvc3RhIGNvbW8gYXJyYXkgcHVybyBwb3Igc2VndXJhblx1MDBFN2EuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFRhc2tbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0UHJvamVjdCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuLy8gQnVzY2Egb3MgcHJvamV0b3MgKHBhcmEgbyBmaWx0cm8pLiBNZXNtYSBBUEkgdjEgcGFnaW5hZGEgZGFzIHRhcmVmYXMuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0UHJvamVjdFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFByb2plY3RbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvcHJvamVjdHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFByb2plY3RbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFByb2plY3RbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0TGFiZWwge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gbm9tZSBkYSBwYWxldGEgKGV4LjogXCJjaGFyY29hbFwiKVxufVxuXG4vLyBCdXNjYSBhcyBldGlxdWV0YXMgcGVzc29haXMgKHBhcmEgY29sb3JpciBvcyBjaGlwcykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0TGFiZWxbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RMYWJlbFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9sYWJlbHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdExhYmVsW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RMYWJlbFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuLy8gVVJMIHBhcmEgYWJyaXIgYSB0YXJlZmEgbm8gVG9kb2lzdCAodXNhIGEgZG8gcGF5bG9hZCBvdSBtb250YSBhIHBhcnRpciBkbyBpZCkuXG5mdW5jdGlvbiB0YXNrVXJsKHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHtcbiAgcmV0dXJuIHQudXJsID8/IGBodHRwczovL2FwcC50b2RvaXN0LmNvbS9hcHAvdGFzay8ke3QuaWR9YDtcbn1cblxuLy8gQ29uY2x1aSAoZmVjaGEpIHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gUE9TVCBzZW0gY29ycG87IDIwNCA9IHN1Y2Vzc28uIEZhc2UgOC4yLlxuYXN5bmMgZnVuY3Rpb24gY2xvc2VUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9jbG9zZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEVzY3JpdGE6IGNyaWFyIC8gZWRpdGFyIC8gbW92ZXIgLyBleGNsdWlyICh2MC44LjApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDYW1wb3MgZ3Jhdlx1MDBFMXZlaXMuIFRvZG9zIG9wY2lvbmFpcyBcdTIwMTQgbm8gZWRpdGFyIG1hbmRvIHNcdTAwRjMgbyBxdWUgbXVkb3UuXG5pbnRlcmZhY2UgVG9kb2lzdFdyaXRlIHtcbiAgY29udGVudD86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5PzogbnVtYmVyOyAgICAgLy8gMS4uNCAoNCA9IHVyZ2VudGUgLyBwMSBuYSBVSSlcbiAgZHVlX3N0cmluZz86IHN0cmluZzsgICAvLyBsaW5ndWFnZW0gbmF0dXJhbDsgXCJubyBkYXRlXCIgbGltcGEgYSBkYXRhXG4gIGR1ZV9sYW5nPzogc3RyaW5nOyAgICAgLy8gXCJwdFwiIFx1MjE5MiBpbnRlcnByZXRhIGVtIHBvcnR1Z3VcdTAwRUFzXG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBqc29uSGVhZGVycyh0b2tlbjogc3RyaW5nKSB7XG4gIHJldHVybiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLCBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9O1xufVxuXG4vLyBDcmlhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzIFx1MjE5MiAyMDAgY29tIGEgdGFyZWZhIGNyaWFkYS5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTxUb2RvaXN0VGFzaz4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUb2RvaXN0VGFzaztcbn1cblxuLy8gRWRpdGEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3Mve2lkfSBcdTIxOTIgMjAwLiBOXHUwMEUzbyB0cm9jYSBkZSBwcm9qZXRvICh1c2UgbW92ZVRvZG9pc3RUYXNrKS5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIE1vdmUgYSB0YXJlZmEgcGFyYSBvdXRybyBwcm9qZXRvLiBQT1NUIC90YXNrcy97aWR9L21vdmUgXHUyMTkyIDIwMC5cbmFzeW5jIGZ1bmN0aW9uIG1vdmVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBwcm9qZWN0X2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L21vdmVgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcHJvamVjdF9pZCB9KSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBFeGNsdWkgYSB0YXJlZmEuIERFTEVURSAvdGFza3Mve2lkfSBcdTIxOTIgMjA0LlxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIGRkL21tIGEgcGFydGlyIGRlIHVtIHRpbWVzdGFtcCAobXRpbWUpXG5mdW5jdGlvbiBmbXRTaG9ydCh0czogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKHRzKTtcbiAgcmV0dXJuIGAke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSsxKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBwYXN0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ29udGEgbm90YXMgcmV2aXNhZGFzIChyZXZpZXdlZDogdHJ1ZSkgdnMgdG90YWwgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gcmV2aWV3ZWRTdGF0cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyByZXZpZXdlZDogbnVtYmVyOyB0b3RhbDogbnVtYmVyIH0ge1xuICBsZXQgcmV2aWV3ZWQgPSAwLCB0b3RhbCA9IDA7XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgIHRvdGFsKys7XG4gICAgICAgIGlmIChhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShjLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWUpIHJldmlld2VkKys7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICByZXR1cm4geyByZXZpZXdlZCwgdG90YWwgfTtcbn1cblxuLy8gQ29udGEgbWQgKGV4Y2V0byBzdGF0dXMubWQpIGUgaW1hZ2VucyBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiBmb2xkZXJTdGF0cyhmb2xkZXI6IFRGb2xkZXIpOiB7IG1kOiBudW1iZXI7IGltZzogbnVtYmVyIH0ge1xuICBsZXQgbWQgPSAwLCBpbWcgPSAwO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICBpZiAoYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIG1kKys7XG4gICAgICAgIGVsc2UgaWYgKElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKSBpbWcrKztcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIHJldHVybiB7IG1kLCBpbWcgfTtcbn1cblxuLy8gVGV4dG8gZGUgY29udGFnZW0gcGFkcm9uaXphZG8gcGFyYSBvcyBjYXJkcyAobm90YXMgKyBpbWFnZW5zLCBxdWFuZG8gaG91dmVyKS5cbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbi8vIEFzIE4gbm90YXMgLm1kIG1vZGlmaWNhZGFzIG1haXMgcmVjZW50ZW1lbnRlIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIHJlY2VudE5vdGVzKGZvbGRlcjogVEZvbGRlciwgbjogbnVtYmVyKTogVEZpbGVbXSB7XG4gIGNvbnN0IGZpbGVzOiBURmlsZVtdID0gW107XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSBmaWxlcy5wdXNoKGMpO1xuICAgICAgZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIGZpbGVzLnNvcnQoKGEsIGIpID0+IGIuc3RhdC5tdGltZSAtIGEuc3RhdC5tdGltZSk7XG4gIHJldHVybiBmaWxlcy5zbGljZSgwLCBuKTtcbn1cblxuLy8gUGFzdGEgXCJkZSBhc3NldHNcIjogc1x1MDBGMyB0ZW0gaW1hZ2VucywgbmVuaHVtYSBub3RhIFx1MjE5MiBlc2NvbmRpZGEgbm8gbmF2ZWdhZG9yIGludGVybm8uXG5mdW5jdGlvbiBpc0Fzc2V0Rm9sZGVyKGZvbGRlcjogVEZvbGRlcik6IGJvb2xlYW4ge1xuICBjb25zdCB7IG1kLCBpbWcgfSA9IGZvbGRlclN0YXRzKGZvbGRlcik7XG4gIHJldHVybiBpbWcgPiAwICYmIG1kID09PSAwO1xufVxuXG5mdW5jdGlvbiBzdWJGb2xkZXJzKGZvbGRlcjogVEZvbGRlcik6IFRGb2xkZXJbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgLmZpbHRlcihmID0+ICFpc0Fzc2V0Rm9sZGVyKGYpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xufVxuXG5mdW5jdGlvbiBjb3ZlckluRm9sZGVyKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gMS4gQ2FtcG8gY292ZXI6IG5vIHN0YXR1cy5tZCAoYWNlaXRhIGNhbWluaG8gZGlyZXRvIG91IHdpa2lsaW5rIFtbLi4uXV0pXG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgaWYgKHNmKSB7XG4gICAgY29uc3QgcmF3ID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5jb3ZlcjtcbiAgICBpZiAodHlwZW9mIHJhdyA9PT0gXCJzdHJpbmdcIiAmJiByYXcudHJpbSgpKSB7XG4gICAgICBjb25zdCBsaW5rcGF0aCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiE/XFxbXFxbLywgXCJcIikucmVwbGFjZSgvXFxdXFxdJC8sIFwiXCIpLnNwbGl0KFwifFwiKVswXS50cmltKCk7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmtwYXRoLCBzZi5wYXRoKTtcbiAgICAgIGlmIChyZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlICYmIElNR19FWFQuaW5jbHVkZXMocmVzb2x2ZWQuZXh0ZW5zaW9uKSlcbiAgICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgocmVzb2x2ZWQpO1xuICAgIH1cbiAgfVxuICAvLyAyLiBGYWxsYmFjazogYXJxdWl2byBfY292ZXIuKiBuYSBwYXN0YVxuICBmb3IgKGNvbnN0IGMgb2YgZm9sZGVyLmNoaWxkcmVuKSB7XG4gICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmJhc2VuYW1lID09PSBcIl9jb3ZlclwiICYmIElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKVxuICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgoYyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHJlYWRGb2xkZXJTdGF0dXMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IFN0YXR1cyB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgcyA9IHNmICYmIGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuZnVuY3Rpb24gcmVhZE5vdGVTdGF0dXMoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogU3RhdHVzIHtcbiAgY29uc3QgcyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXJnXHUwMEVBbmNpYSAocHJvcHJpZWRhZGUgYHVyZ2VuY3lgKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbnR5cGUgVXJnZW5jeSA9IFwiYWx0YVwiIHwgXCJtZWRpYVwiIHwgXCJiYWl4YVwiO1xuY29uc3QgVVJHRU5DWV9SQU5LOiBSZWNvcmQ8VXJnZW5jeSwgbnVtYmVyPiA9IHsgYmFpeGE6IDEsIG1lZGlhOiAyLCBhbHRhOiAzIH07XG5jb25zdCBVUkdFTkNZX0NPTE9SOiBSZWNvcmQ8VXJnZW5jeSwgc3RyaW5nPiA9IHsgYWx0YTogXCIjRUY0NDQ0XCIsIG1lZGlhOiBcIiNGNTlFMEJcIiwgYmFpeGE6IFwiI0VBQjMwOFwiIH07XG5cbmZ1bmN0aW9uIHJlYWROb3RlVXJnZW5jeShhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBVcmdlbmN5IHwgbnVsbCB7XG4gIGNvbnN0IHUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8udXJnZW5jeTtcbiAgcmV0dXJuIHUgPT09IFwiYWx0YVwiIHx8IHUgPT09IFwibWVkaWFcIiB8fCB1ID09PSBcImJhaXhhXCIgPyB1IDogbnVsbDtcbn1cblxudHlwZSBVcmdlbmN5SW5mbyA9IHsgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXTsgbWF4OiBVcmdlbmN5IHwgbnVsbCB9O1xuXG4vLyBOb3RhcyBjb20gYHVyZ2VuY3lgIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZSArIG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbyAob3JkZW5hZGFzIHBvciBuXHUwMEVEdmVsIGRlc2MpLlxuZnVuY3Rpb24gdXJnZW5jeVN0YXRzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBVcmdlbmN5SW5mbyB7XG4gIGNvbnN0IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIHtcbiAgICAgICAgY29uc3QgdSA9IHJlYWROb3RlVXJnZW5jeShhcHAsIGMpO1xuICAgICAgICBpZiAodSkgaXRlbXMucHVzaCh7IGZpbGU6IGMsIGxldmVsOiB1IH0pO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgbGV0IG1heDogVXJnZW5jeSB8IG51bGwgPSBudWxsO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSBpZiAoIW1heCB8fCBVUkdFTkNZX1JBTktbaXQubGV2ZWxdID4gVVJHRU5DWV9SQU5LW21heF0pIG1heCA9IGl0LmxldmVsO1xuICBpdGVtcy5zb3J0KChhLCBiKSA9PiBVUkdFTkNZX1JBTktbYi5sZXZlbF0gLSBVUkdFTkNZX1JBTktbYS5sZXZlbF0pO1xuICByZXR1cm4geyBpdGVtcywgbWF4IH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBcnF1aXZvcyBleGliXHUwMEVEdmVpczogbm90YSAoLm1kKSAvIGNhbnZhcyAoLmNhbnZhcykgLyBiYXNlICguYmFzZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBGSUxFX0VYVFMgPSBbXCJtZFwiLCBcImNhbnZhc1wiLCBcImJhc2VcIl07XG4vLyBpZCBMdWNpZGUgcG9yIHRpcG8gZGUgYXJxdWl2by5cbmZ1bmN0aW9uIGZpbGVHbHlwaChleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChleHQgPT09IFwiY2FudmFzXCIpIHJldHVybiBcInNoYXBlc1wiO1xuICBpZiAoZXh0ID09PSBcImJhc2VcIikgcmV0dXJuIFwidGFibGUtMlwiO1xuICByZXR1cm4gXCJmaWxlLXRleHRcIjtcbn1cbmZ1bmN0aW9uIGZpbGVzSW4oZm9sZGVyOiBURm9sZGVyKTogVEZpbGVbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihcbiAgICBjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBGSUxFX0VYVFMuaW5jbHVkZXMoYy5leHRlbnNpb24pICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIlxuICApIGFzIFRGaWxlW10pLnNvcnQoKGEsIGIpID0+IGEuYmFzZW5hbWUubG9jYWxlQ29tcGFyZShiLmJhc2VuYW1lLCBcInB0XCIpKTtcbn1cblxuLy8gXHUwMENEY29uZSBkZWZpbmlkbyBlbSBgaWNvbjpgIG5vIHN0YXR1cy5tZCBkYSBwYXN0YSAoZW1vamkgb3UgaWQgTHVjaWRlKS4gbnVsbCBzZSBhdXNlbnRlLlxuZnVuY3Rpb24gcmVhZEZvbGRlckljb24oYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IGljID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5pY29uO1xuICByZXR1cm4gdHlwZW9mIGljID09PSBcInN0cmluZ1wiICYmIGljLnRyaW0oKSA/IGljLnRyaW0oKSA6IG51bGw7XG59XG5cbi8vIGlkIEx1Y2lkZSAoc1x1MDBGMyBbYS16MC05LV0pIFx1MjE5MiBzZXRJY29uIG5hdGl2bzsgY2FzbyBjb250clx1MDBFMXJpbyB0cmF0YSBjb21vIGVtb2ppL3RleHRvLlxuZnVuY3Rpb24gcmVuZGVySWNvbihlbDogSFRNTEVsZW1lbnQsIGljb246IHN0cmluZykge1xuICBpZiAoL15bYS16MC05LV0rJC8udGVzdChpY29uKSkgc2V0SWNvbihlbCwgaWNvbik7XG4gIGVsc2UgZWwuc2V0VGV4dChpY29uKTtcbn1cblxuLy8gQ29yIGVzdFx1MDBFMXZlbCBhIHBhcnRpciBkbyBub21lIChwYXJhIHBhc3RhcyBmb3JhIGRvIFBBUkEpLlxuZnVuY3Rpb24gYWNjZW50Rm9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIG5hbWUuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gIHJldHVybiBBQ0NFTlRTW2ggJSBBQ0NFTlRTLmxlbmd0aF07XG59XG5cbi8vIFx1MDBDRGNvbmUgLyByXHUwMEYzdHVsbyAvIGNvciBkZSB1bWEgcGFzdGEgZGUgdG9wbzogdXNhIG8gUEFSQSBzZSBjb25oZWNpZGEsIHNlblx1MDBFM28gZGVyaXZhLlxuZnVuY3Rpb24gZm9sZGVyTWV0YShhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyBpY29uOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IGFjY2VudDogc3RyaW5nIH0ge1xuICBjb25zdCBrbm93biA9IFBBUkFfTUFQLmdldChmb2xkZXIucGF0aCk7XG4gIGNvbnN0IGN1c3RvbSA9IHJlYWRGb2xkZXJJY29uKGFwcCwgZm9sZGVyKTtcbiAgcmV0dXJuIHtcbiAgICBpY29uOiAgIGN1c3RvbSA/PyBrbm93bj8uaWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiLFxuICAgIGxhYmVsOiAga25vd24/LmxhYmVsID8/IGZvbGRlci5uYW1lLFxuICAgIGFjY2VudDoga25vd24/LmFjY2VudCA/PyBhY2NlbnRGb3IoZm9sZGVyLm5hbWUpLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXZlYWxJbkV4cGxvcmVyKGFwcDogQXBwLCB0YXJnZXQ6IHVua25vd24pIHtcbiAgdHlwZSBFeHBQbHVnaW4gPSB7IGluc3RhbmNlOiB7IHJldmVhbEluRm9sZGVyKGY6IHVua25vd24pOiB2b2lkIH0gfTtcbiAgY29uc3QgZXhwID0gKGFwcCBhcyBBcHAgJiB7XG4gICAgaW50ZXJuYWxQbHVnaW5zOiB7IGdldFBsdWdpbkJ5SWQoaWQ6IHN0cmluZyk6IEV4cFBsdWdpbiB8IG51bGwgfTtcbiAgfSkuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoXCJmaWxlLWV4cGxvcmVyXCIpO1xuICBpZiAoZXhwICYmIHRhcmdldCkgZXhwLmluc3RhbmNlLnJldmVhbEluRm9sZGVyKHRhcmdldCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG5cbiAgLy8gRXN0YWRvIGRhIGludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcbiAgcHJpdmF0ZSB0b2RvaXN0VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgcHJpdmF0ZSB0b2RvaXN0UHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSB0b2RvaXN0UHJvamVjdE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7ICAgLy8gaWQgXHUyMTkyIG5vbWVcbiAgcHJpdmF0ZSB0b2RvaXN0TGFiZWxDb2xvciA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7ICAgLy8gbm9tZSBkYSBldGlxdWV0YSBcdTIxOTIgaGV4XG4gIHByaXZhdGUgdG9kb2lzdExvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b2RvaXN0RXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvZG9pc3RGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIHRvZG9pc3RMYXRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b2RvaXN0RmlsdGVyT3BlbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihsZWFmKTsgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJEYXNoYm9hcmRcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGF5b3V0LWRhc2hib2FyZFwiOyB9XG5cbiAgYXN5bmMgb25PcGVuKCkge1xuICAgIGF3YWl0IHRoaXMucmVuZGVyKCk7XG4gICAgZm9yIChjb25zdCBldiBvZiBbXCJtb2RpZnlcIiwgXCJjcmVhdGVcIiwgXCJkZWxldGVcIiwgXCJyZW5hbWVcIl0gYXMgY29uc3QpXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oZXYgYXMgXCJtb2RpZnlcIiwgKCkgPT4gdGhpcy5zY2hlZHVsZSgpKSk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCkgeyB0aGlzLmhpZGVUaXAoKTsgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGUoKSB7XG4gICAgaWYgKHRoaXMudGltZXIpIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlbmRlcigpLCA0MDApO1xuICB9XG5cbiAgLy8gUHJpbWVpcm8gc2VnbWVudG8gZGUgdW0gY2FtaW5obyAoXCIxMC5Qcm9qZWN0cy9Gb28vQmFyXCIgXHUyMTkyIFwiMTAuUHJvamVjdHNcIikuXG4gIHByaXZhdGUgdG9wRm9sZGVyT2YocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBpID0gcGF0aC5pbmRleE9mKFwiL1wiKTtcbiAgICByZXR1cm4gaSA9PT0gLTEgPyBwYXRoIDogcGF0aC5zbGljZSgwLCBpKTtcbiAgfVxuXG4gIGFzeW5jIHJlbmRlcigpIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHJvb3QuYWRkQ2xhc3MoXCJ3ZC1yb290XCIpO1xuICAgIHJvb3QudG9nZ2xlQ2xhc3MoXCJ3ZC1jb21wYWN0XCIsIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QpO1xuXG4gICAgdGhpcy5yZW5kZXJIZWFkZXIocm9vdCk7XG4gICAgZm9yIChjb25zdCBpZCBvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXIpIHtcbiAgICAgIGlmIChpZCA9PT0gXCJjYWxlbmRhclwiKSAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInBhcmFcIikgICAgdGhpcy5yZW5kZXJQYXJhKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwiaGVhdG1hcFwiKSB0aGlzLnJlbmRlckhlYXRtYXAocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJyZXBvcnRzXCIpIHRoaXMucmVuZGVyUmVwb3J0cyhyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcImdyb3d0aFwiKSAgdGhpcy5yZW5kZXJHcm93dGgocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJzdGF0c1wiKSAgIHRoaXMucmVuZGVyU3RhdHMocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJ0b2RvaXN0XCIpIHRoaXMucmVuZGVyVG9kb2lzdChyb290KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ29udHJvbGVzIGRlIG9yZGVtIGRlIHNlXHUwMEU3XHUwMEUzbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIG1vdmVDb250cm9scyhob3N0OiBIVE1MRWxlbWVudCwgaWQ6IFNlY3Rpb25JZCkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBjdHJsID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbW92ZS1jdHJsXCIgfSk7XG5cbiAgICBjb25zdCB1cCA9IGN0cmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1tb3ZlLWJ0blwiICsgKGkgPD0gMCA/IFwiIHdkLW1vdmUtb2ZmXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1QjJcIiB9KTtcbiAgICB1cC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBzZVx1MDBFN1x1MDBFM28gcGFyYSBjaW1hXCIpO1xuICAgIGlmIChpID4gMCkgdXAub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm1vdmVTZWN0aW9uKGlkLCAtMSk7IH07XG5cbiAgICBjb25zdCBkb3duID0gY3RybC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW1vdmUtYnRuXCIgKyAoaSA+PSBvcmRlci5sZW5ndGggLSAxID8gXCIgd2QtbW92ZS1vZmZcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVCQ1wiIH0pO1xuICAgIGRvd24uc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgc2VcdTAwRTdcdTAwRTNvIHBhcmEgYmFpeG9cIik7XG4gICAgaWYgKGkgPCBvcmRlci5sZW5ndGggLSAxKSBkb3duLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5tb3ZlU2VjdGlvbihpZCwgKzEpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBtb3ZlU2VjdGlvbihpZDogU2VjdGlvbklkLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IG9yZGVyID0gWy4uLnRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gb3JkZXI7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBPY3VsdGFyIC8gcmVzdGF1cmFyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVCdG4oaG9zdDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBjbHMgPSBcIndkLWhpZGUtYnRuXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzIH0pO1xuICAgIHNldEljb24oYiwgXCJleWUtb2ZmXCIpO1xuICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICBiLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5oaWRlSXRlbShrZXkpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoaWRlSXRlbShrZXk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKGtleSkpIHJldHVybjtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIC8vIFNlIGVzdFx1MDBFMXZhbW9zIGRlbnRybyBkYSBwYXN0YSBxdWUgYWNhYm91IGRlIHNlciBvY3VsdGEsIGZlY2hhIG8gbmF2ZWdhZG9yLlxuICAgIGlmICh0aGlzLm5hdlBhdGggJiYgKHRoaXMubmF2UGF0aCA9PT0ga2V5IHx8IHRoaXMubmF2UGF0aC5zdGFydHNXaXRoKGtleSArIFwiL1wiKSkpIHRoaXMubmF2UGF0aCA9IG51bGw7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdW5oaWRlSXRlbShrZXk6IHN0cmluZykge1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5maWx0ZXIoayA9PiBrICE9PSBrZXkpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGhpZGRlbkxhYmVsKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoa2V5ID09PSBTRUNfQ0FMKSByZXR1cm4gXCJcdUQ4M0RcdURDQzUgQ2FsZW5kXHUwMEUxcmlvXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX1JFUCkgcmV0dXJuIFwiXHVEODNEXHVEQ0M0IFJlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfSEVBVCkgcmV0dXJuIFwiXHVEODNEXHVERDI1IEhlYXRtYXBcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfR1JPVykgcmV0dXJuIFwiXHVEODNEXHVEQ0M4IENyZXNjaW1lbnRvXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX1NUQVQpIHJldHVybiBcIlx1RDgzRFx1RENDQSBFc3RhdFx1MDBFRHN0aWNhc1wiO1xuICAgIGlmIChrZXkgPT09IFNFQ19UT0RPKSByZXR1cm4gXCJcdUQ4M0RcdURDQ0IgVGFyZWZhc1wiO1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoa2V5KTtcbiAgICByZXR1cm4gZiBpbnN0YW5jZW9mIFRGb2xkZXIgPyBmLm5hbWUgOiBrZXk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckhpZGRlbkJhcihwYXJlbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaGlkZGVuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuO1xuICAgIGlmICghaGlkZGVuLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJhciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGlkZGVuLWJhclwiIH0pO1xuICAgIGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWhpZGRlbi1sYWJlbFwiLCB0ZXh0OiBcIm9jdWx0b3M6XCIgfSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgaGlkZGVuKSB7XG4gICAgICBjb25zdCBjaGlwID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaGlkZGVuLWNoaXBcIiB9KTtcbiAgICAgIC8vIFBhc3RhIG9jdWx0YSBjb20gbm90YXMgdXJnZW50ZXMgXHUyMTkyIGNvbnRvcm5vIHBlbGEgY29yIGRvIG5cdTAwRUR2ZWwgbVx1MDBFMXhpbW8uXG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGtleSk7XG4gICAgICBjb25zdCB1cmcgPSBmIGluc3RhbmNlb2YgVEZvbGRlciA/IHVyZ2VuY3lTdGF0cyh0aGlzLmFwcCwgZikgOiB7IGl0ZW1zOiBbXSwgbWF4OiBudWxsIH07XG4gICAgICBpZiAodXJnLm1heCkge1xuICAgICAgICBjaGlwLmFkZENsYXNzKFwid2QtaGlkZGVuLXVyZ2VudFwiKTtcbiAgICAgICAgY2hpcC5hZGRDbGFzcyhgd2QtdS0ke3VyZy5tYXh9YCk7XG4gICAgICAgIGNoaXAuc3R5bGUuYm9yZGVyQ29sb3IgPSBVUkdFTkNZX0NPTE9SW3VyZy5tYXhdO1xuICAgICAgfVxuICAgICAgc2V0SWNvbihjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2hpcC1pY29uXCIgfSksIFwiZXllXCIpO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogdGhpcy5oaWRkZW5MYWJlbChrZXkpIH0pO1xuICAgICAgY2hpcC5zZXRBdHRyKFwidGl0bGVcIiwgdXJnLm1heFxuICAgICAgICA/IGBNb3N0cmFyIG5vdmFtZW50ZSBcdTIwMTQgJHt1cmcuaXRlbXMubGVuZ3RofSBub3RhKHMpIHVyZ2VudGUocylgXG4gICAgICAgIDogXCJNb3N0cmFyIG5vdmFtZW50ZVwiKTtcbiAgICAgIGNoaXAub25jbGljayA9ICgpID0+IHRoaXMudW5oaWRlSXRlbShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb29sdGlwIGRlIG5vdGFzIHJlY2VudGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgc2hvd1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBmaWxlczogVEZpbGVbXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIk1vZGlmaWNhZGFzIHJlY2VudGVtZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBQb3NpY2lvbmEgdW0gdG9vbHRpcCBmaXhvIGFiYWl4byBkbyBhbHZvICh2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN28pLlxuICBwcml2YXRlIHBvc2l0aW9uVGlwKHRpcDogSFRNTEVsZW1lbnQsIHRhcmdldDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR3ID0gdGlwLm9mZnNldFdpZHRoLCB0aCA9IHRpcC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGxlZnQgPSByZWN0LmxlZnQ7XG4gICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgNjtcbiAgICBpZiAobGVmdCArIHR3ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0dyAtIDg7XG4gICAgaWYgKHRvcCArIHRoID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgdG9wID0gcmVjdC50b3AgLSB0aCAtIDY7ICAvLyB2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN29cbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICB9XG5cbiAgLy8gVG9vbHRpcCBsaXN0YW5kbyBhcyBub3RhcyB1cmdlbnRlcyBkZSB1bWEgcGFzdGEgKGhvdmVyIG5vIGJhZGdlIGRlIGF2aXNvKS5cbiAgcHJpdmF0ZSBzaG93VXJnZW5jeVRpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC11cmdlbmN5LXRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiVXJnZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgY29uc3QgZG90ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdXRpcC1kb3RcIiB9KTtcbiAgICAgIGRvdC5zdHlsZS5iYWNrZ3JvdW5kID0gVVJHRU5DWV9DT0xPUltpdC5sZXZlbF07XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBpdC5maWxlLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogaXQubGV2ZWwgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gQmFkZ2UgZGUgYXZpc28gKHRyaVx1MDBFMm5ndWxvKSBubyBjYXJkIGRlIHBhc3RhIHF1ZSBjb250XHUwMEU5bSBub3RhcyBjb20gYHVyZ2VuY3lgLlxuICAvLyBDb3IgcGVsbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vOyBob3ZlciBsaXN0YSBvcyBhcnF1aXZvcy4gRmFzZSAxMC5cbiAgcHJpdmF0ZSB1cmdlbmN5QmFkZ2UoY2FyZDogSFRNTEVsZW1lbnQsIHVyZzogVXJnZW5jeUluZm8pIHtcbiAgICBpZiAoIXVyZy5tYXgpIHJldHVybjtcbiAgICBjb25zdCBiID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1iYWRnZSB3ZC11LSR7dXJnLm1heH1gIH0pO1xuICAgIHNldEljb24oYiwgXCJ0cmlhbmdsZS1hbGVydFwiKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1VyZ2VuY3lUaXAoYiwgdXJnLml0ZW1zKSk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUaXAoKSB7XG4gICAgaWYgKHRoaXMudGlwKSB7IHRoaXMudGlwLnJlbW92ZSgpOyB0aGlzLnRpcCA9IG51bGw7IH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGlwKGNhcmQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByZWNlbnRzID0gcmVjZW50Tm90ZXMoZm9sZGVyLCA0KTtcbiAgICBpZiAoIXJlY2VudHMubGVuZ3RoKSByZXR1cm47XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUaXAoY2FyZCwgcmVjZW50cykpO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhbGVuZFx1MDBFMXJpbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckNhbGVuZGFyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0NBTCkpIHJldHVybjtcblxuICAgIGNvbnN0IG1vbmRheSAgPSBtb25kYXlPZih0aGlzLndlZWtPZmZzZXQpO1xuICAgIGNvbnN0IHdlZWtOdW0gPSBpc29XZWVrTnVtYmVyKG1vbmRheSk7XG4gICAgY29uc3QgdG9kYXlLICA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIHsgbmFtZTogc3RyaW5nOyBmaWxlOiBURmlsZSB9W10+ID0ge307XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3QgZCA9IG5vcm1hbGl6ZURhdGUodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8uZGF0ZSk7XG4gICAgICBpZiAoZCkgKGJ5RGF5W2RdID8/PSBbXSkucHVzaCh7IG5hbWU6IGZpbGUuYmFzZW5hbWUsIGZpbGUgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1jYWwtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IG5hdiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hdi1iYXJcIiB9KTtcbiAgICBuYXYuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtd2Vlay1sYWJlbFwiLCB0ZXh0OiBgU2VtYW5hICR7d2Vla051bX1gIH0pO1xuXG4gICAgY29uc3QgY3RybHMgPSBuYXYuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IHByZXYgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzOVwiIH0pO1xuICAgIGNvbnN0IG5leHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgIHByZXYub25jbGljayA9ICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0LS07IHRoaXMucmVuZGVyKCk7IH07XG4gICAgbmV4dC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQrKzsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJjYWxlbmRhclwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19DQUwsIFwiT2N1bHRhciBjYWxlbmRcdTAwRTFyaW9cIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBoZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7IH07XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC50ZXh0Q29udGVudCA9IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lO1xuICAgICAgICBwaWxsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoaXQuZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFicmUgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgIChZWVlZLU1NLUREKTsgY3JpYSBlbSA1MC5EaVx1MDBFMXJpby8gc2Ugblx1MDBFM28gZXhpc3Rpci5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuRGFpbHlOb3RlKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aCA9IGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYDtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcblxuICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgIC8vIEdhcmFudGUgYSBwYXN0YSByYWl6IChjYXNvIHRlbmhhIHNpZG8gcmVtb3ZpZGEpLlxuICAgICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfRk9MREVSKSlcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKERBSUxZX0ZPTERFUikuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3QgdGl0dWxvID0gbmV3IERhdGUoK3ksICttIC0gMSwgK2QpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICAgICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVXNhIG8gdGVtcGxhdGUgZW0gTW9kZWxvcy8gc2UgZXhpc3Rpcjsgc2VuXHUwMEUzbywgZmFsbGJhY2sgZW1idXRpZG8uXG4gICAgICBjb25zdCB0cGwgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfVEVNUExBVEUpO1xuICAgICAgbGV0IGJvZHk6IHN0cmluZztcbiAgICAgIGlmICh0cGwgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICBib2R5ID0gKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodHBsKSlcbiAgICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmRhdGVcXHMqXFx9XFx9L2csIGtleSlcbiAgICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKnRpdGxlXFxzKlxcfVxcfS9nLCB0aXR1bG8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9keSA9XG5gLS0tXG5vd25lcjogV2VydXNcbmNyZWF0ZWQ6ICR7a2V5fVxuZGF0ZTogJHtrZXl9XG5yZXZpZXdlZDogdHJ1ZVxudHlwZTogZGFpbHlcbnBlcm1pc3Npb25zOlxuICByZWFkOiBbYWxsXVxuICB3cml0ZTpcbiAgICAtIFdlcnVzXG4tLS1cblxuIyAke3RpdHVsb31cblxuYDtcbiAgICAgIH1cbiAgICAgIGZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUocGF0aCwgYm9keSk7XG4gICAgfVxuXG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRzIGRvIGNvZnJlICh0b2RhcyBhcyBwYXN0YXMgZGUgdG9wbykgKyBuYXZlZ2Fkb3IgYW5pbmhhZG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJQYXJhKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ09GUkVcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhoZWFkLCBcInBhcmFcIik7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYXJhLWdyaWRcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSAgIC8vIGlnbm9yYSAub2JzaWRpYW4sIC50cmFzaCwgZXRjLlxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgY29uc3QgYWN0aXZlUm9vdCA9IHRoaXMubmF2UGF0aCA/IHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSA6IG51bGw7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBtZXRhICAgID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHN0YXRzICAgPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSBzdWJGb2xkZXJzKGZvbGRlcikubGVuZ3RoID4gMCB8fCBmaWxlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLmhpZGVCdG4oY2FyZCwgZm9sZGVyLnBhdGgsIGBPY3VsdGFyIFwiJHttZXRhLmxhYmVsfVwiYCk7XG4gICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIGZvbGRlcikpO1xuXG4gICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGZvbGRlcik7XG5cbiAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaWYgKG5hdmlnYWJsZSkgeyB0aGlzLm5hdlBhdGggPSBpc0FjdGl2ZSA/IG51bGwgOiBmb2xkZXIucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfVxuICAgICAgICBlbHNlIHJldmVhbEluRXhwbG9yZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IGZpbGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVySGlkZGVuQmFyKHNlYyk7XG4gIH1cblxuICAvLyBQYWluZWwgaW5saW5lIG5hdmVnXHUwMEUxdmVsIChicmVhZGNydW1iICsgc3VicGFzdGFzICsgbm90YXMgZGEgcGFzdGEgYXR1YWwpXG4gIHByaXZhdGUgcmVuZGVyQnJvd3NlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHRoaXMudG9wRm9sZGVyT2YoZm9sZGVyLnBhdGgpO1xuICAgIGNvbnN0IHJvb3RGb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocm9vdFBhdGgpO1xuICAgIGlmICghKHJvb3RGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCByb290Rm9sZGVyKTtcblxuICAgIGNvbnN0IHBhbmVsID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYW5lbFwiIH0pO1xuICAgIHBhbmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgLy8gQnJlYWRjcnVtYlxuICAgIGNvbnN0IGNydW1iID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNydW1iXCIgfSk7XG4gICAgY29uc3QgcmVsID0gZm9sZGVyLnBhdGggPT09IHJvb3RQYXRoID8gW10gOiBmb2xkZXIucGF0aC5zbGljZShyb290UGF0aC5sZW5ndGggKyAxKS5zcGxpdChcIi9cIik7XG5cbiAgICBjb25zdCByb290U2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChyZWwubGVuZ3RoID09PSAwID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSB9KTtcbiAgICByZW5kZXJJY29uKHJvb3RTZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgcm9vdFNlZy5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICBpZiAocmVsLmxlbmd0aCkgcm9vdFNlZy5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgc2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNlZ1BhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xvc2Uub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIENhbXBvIGRlIGJ1c2NhXG4gICAgY29uc3Qgc2VhcmNoV3JhcCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWFyY2gtd3JhcFwiIH0pO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoV3JhcC5jcmVhdGVFbChcImlucHV0XCIsIHtcbiAgICAgIGNsczogXCJ3ZC1zZWFyY2hcIixcbiAgICAgIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcImZpbHRyYXJcdTIwMjZcIiwgdmFsdWU6IHRoaXMuc2VhcmNoVGVybSB9LFxuICAgIH0pO1xuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLXN1Yi1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYmwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLndkLWxhYmVsXCIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbGJsLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1ub3RlLXJvdywgLndkLW5vdGUtY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbC5xdWVyeVNlbGVjdG9yKFwiLndkLW5vdGUtbmFtZSwgLndkLW5vdGUtY2FyZC1uYW1lXCIpPy50ZXh0Q29udGVudCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbmFtZS5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU3VicGFzdGFzIGNvbW8gY2FyZHNcbiAgICBjb25zdCBzdWJzID0gc3ViRm9sZGVycyhmb2xkZXIpO1xuICAgIGlmIChzdWJzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2dyaWQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvai1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNmIG9mIHN1YnMpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVhZEZvbGRlclN0YXR1cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBzdGF0cyAgPSBmb2xkZXJTdGF0cyhzZik7XG4gICAgICAgIGNvbnN0IGNvdmVyICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgZGVlcGVyID0gc3ViRm9sZGVycyhzZikubGVuZ3RoID4gMDtcbiAgICAgICAgY29uc3QgY3VzdG9tSWNvbiA9IHJlYWRGb2xkZXJJY29uKHRoaXMuYXBwLCBzZik7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IHNncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLWNhcmQgd2Qtc3ViLWNhcmQgd2Qtcy0ke3N0YXR1c31gIH0pO1xuICAgICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gc3V0aWwgKHZlcnNcdTAwRTNvIG1lbm9yIHF1ZSBhcyBwYXN0YXMgZGUgdG9wbykgXHUyMDE0IEZhc2UgOS4xXG4gICAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0IHdkLWNvdmVyLXN1YlwiIH0pO1xuICAgICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBjdXN0b21JY29uID8/IFwiXHVEODNEXHVEQ0MxXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1iYWRnZSB3ZC1iYWRnZS0ke3N0YXR1c31gLCB0ZXh0OiBTVEFUVVNfSUNPTltzdGF0dXNdIH0pO1xuICAgICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIHNmKSk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgICAgaWYgKGN1c3RvbUljb24pIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvbiB3ZC1zdWItaWNvblwiIH0pLCBjdXN0b21JY29uKTtcbiAgICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgICAgaWYgKGRlZXBlcikgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3ViLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCB0ZXh0OiBzZi5uYW1lIH0pO1xuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSBsYWJlbC5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgICAgaWYgKHJ2LnRvdGFsID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhc2ApO1xuICAgICAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNhcmQuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgc2YpO1xuICAgICAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2YucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFycXVpdm9zIGRhIHBhc3RhIGF0dWFsIChub3RhcywgY2FudmFzLCBiYXNlcylcbiAgICBjb25zdCBub3RlcyA9IGZpbGVzSW4oZm9sZGVyKTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHBhbmVsLCBub3Rlcyk7XG5cbiAgICBpZiAoIXN1YnMubGVuZ3RoICYmICFub3Rlcy5sZW5ndGgpXG4gICAgICBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJQYXN0YSB2YXppYS5cIiB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBSZWxhdFx1MDBGM3Jpb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJSZXBvcnRzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1JFUCkpIHJldHVybjtcblxuICAgIGNvbnN0IGRpciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiKTtcbiAgICBpZiAoIShkaXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChjb25zdCBjIG9mIGRpci5jaGlsZHJlbikge1xuICAgICAgaWYgKCEoYyBpbnN0YW5jZW9mIFRGaWxlKSB8fCBjLmV4dGVuc2lvbiAhPT0gXCJtZFwiKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpO1xuICAgICAgaWYgKGQpIGl0ZW1zLnB1c2goeyBmaWxlOiBjLCBkYXRlOiBkIH0pO1xuICAgIH1cbiAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiBiLmRhdGUubG9jYWxlQ29tcGFyZShhLmRhdGUpKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiUkVMQVRcdTAwRDNSSU9TIENMQVVERVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwicmVwb3J0c1wiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19SRVAsIFwiT2N1bHRhciBSZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBjb25zdCBsaXN0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1yZXBvcnQtbGlzdFwiIH0pO1xuICAgIGZvciAoY29uc3QgeyBmaWxlLCBkYXRlIH0gb2YgaXRlbXMuc2xpY2UoMCwgNikpIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRhdGUuc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcmVwb3J0LXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcmVwb3J0LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfS8ke3l9YCB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXJlcG9ydC1uYW1lXCIsIHRleHQ6IGZpbGUuYmFzZW5hbWUgfSk7XG4gICAgICByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgICAgIHZvaWQgeTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhdG1hcCAodmlhIHBsdWdpbiBIZWF0bWFwIENhbGVuZGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYXRtYXAocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfSEVBVCkpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtaGVhdC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJBVElWSURBREUgRE8gQ09GUkVcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcImhlYXRtYXBcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfSEVBVCwgXCJPY3VsdGFyIGhlYXRtYXBcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGNvbnN0IHJlbmRlciA9IGdldEhlYXRtYXBSZW5kZXJlcigpO1xuICAgIGlmICghcmVuZGVyKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6ICdBdGl2ZSBvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiBwYXJhIHZlciBhIGF0aXZpZGFkZS4nIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdGFzIGNyaWFkYXMgcG9yIGRpYSwgbm8gYW5vIGNvcnJlbnRlLlxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY291bnRzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGYuc3RhdC5jdGltZSk7XG4gICAgICBpZiAoZC5nZXRGdWxsWWVhcigpICE9PSB5ZWFyKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY291bnRzW2tleV0gPSAoY291bnRzW2tleV0gPz8gMCkgKyAxO1xuICAgIH1cbiAgICBjb25zdCBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXSA9IE9iamVjdC5lbnRyaWVzKGNvdW50cykubWFwKChbZGF0ZSwgbl0pID0+ICh7XG4gICAgICBkYXRlLCBpbnRlbnNpdHk6IG4sIGNvbG9yOiBcImdyZWVuXCIsIGNvbnRlbnQ6IGAke259IG5vdGEocylgLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IGJveCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhdC1ib3hcIiB9KTtcbiAgICB0cnkge1xuICAgICAgcmVuZGVyKGJveCwge1xuICAgICAgICB5ZWFyLFxuICAgICAgICBjb2xvcnM6IHsgZ3JlZW46IFtcIiMxZTNhMmZcIiwgXCIjMWY2ZjQzXCIsIFwiIzJiYTg1YVwiLCBcIiMzOWQzNTNcIl0gfSxcbiAgICAgICAgc2hvd0N1cnJlbnREYXlCb3JkZXI6IHRydWUsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNlYy5lbXB0eSgpO1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkZhbGhhIGFvIHJlbmRlcml6YXIgbyBoZWF0bWFwLlwiIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBFc3RhdFx1MDBFRHN0aWNhcyBkbyBjb2ZyZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclN0YXRzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NUQVQpKSByZXR1cm47XG5cbiAgICBsZXQgdG90YWxOb3RlcyA9IDAsIHRvdGFsUmV2aWV3ZWQgPSAwLCBjcmVhdGVkVGhpc1dlZWsgPSAwO1xuICAgIGNvbnN0IHdlZWtBZ28gPSBEYXRlLm5vdygpIC0gNyAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgaWYgKGYubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgY29udGludWU7XG4gICAgICB0b3RhbE5vdGVzKys7XG4gICAgICBpZiAodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWUpIHRvdGFsUmV2aWV3ZWQrKztcbiAgICAgIGlmIChmLnN0YXQuY3RpbWUgPj0gd2Vla0FnbykgY3JlYXRlZFRoaXNXZWVrKys7XG4gICAgfVxuICAgIGNvbnN0IGdsb2JhbFBjdCA9IHRvdGFsTm90ZXMgPiAwID8gTWF0aC5yb3VuZCh0b3RhbFJldmlld2VkIC8gdG90YWxOb3RlcyAqIDEwMCkgOiAwO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiRVNUQVRcdTAwQ0RTVElDQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcInN0YXRzXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX1NUQVQsIFwiT2N1bHRhciBlc3RhdFx1MDBFRHN0aWNhc1wiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgLy8gTlx1MDBGQW1lcm9zIGdsb2JhaXNcbiAgICBjb25zdCBnbG9iID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWdsb2JhbFwiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZ1wiLCB0ZXh0OiBTdHJpbmcodG90YWxOb3RlcykgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwibm90YXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWcgd2Qtc3RhdC1yZXYtbnVtXCIsIHRleHQ6IGAke2dsb2JhbFBjdH0lYCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJyZXZpc2FkYXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC13ZWVrXCIsIHRleHQ6IGArJHtjcmVhdGVkVGhpc1dlZWt9YCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJlc3RhIHNlbWFuYVwiIH0pO1xuXG4gICAgLy8gQnJlYWtkb3duIHBvciBwYXN0YVxuICAgIGNvbnN0IHRhYmxlID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXRhYmxlXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuXG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA9PT0gMCkgY29udGludWU7XG4gICAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHBjdCA9IE1hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCk7XG5cbiAgICAgIGNvbnN0IHJvdyA9IHRhYmxlLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXJvd1wiIH0pO1xuICAgICAgcm93LnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgICBjb25zdCBuYW1lRWwgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZm9sZGVyXCIgfSk7XG4gICAgICByZW5kZXJJY29uKG5hbWVFbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgbmFtZUVsLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtY291bnRcIiwgdGV4dDogYCR7cnYudG90YWx9YCB9KTtcblxuICAgICAgY29uc3QgYmFyV3JhcCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXJcIiB9KTtcbiAgICAgIGJhcldyYXAuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXMgKCR7cGN0fSUpYCk7XG4gICAgICBjb25zdCBmaWxsID0gYmFyV3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXItZmlsbFwiIH0pO1xuICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXBjdFwiLCB0ZXh0OiBgJHtwY3R9JWAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIExpc3RhIC8gZ3JhZGUgZGUgbm90YXMgY29tIHRvZ2dsZSBlIGluZGljYWRvciByZXZpZXdlZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlck5vdGVzKHBhcmVudDogSFRNTEVsZW1lbnQsIG5vdGVzOiBURmlsZVtdLCBsYWJlbCA9IFwiXCIpIHtcbiAgICBpZiAoIW5vdGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGlzR3JpZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID09PSBcImdyaWRcIjtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IHRoaXMucmV2aWV3RmlsdGVyID8gbm90ZXMuZmlsdGVyKGYgPT4gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgIT09IHRydWUpIDogbm90ZXM7XG5cbiAgICBjb25zdCBoZHIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWhkclwiIH0pO1xuICAgIGNvbnN0IGNvdW50VHh0ID0gdGhpcy5yZXZpZXdGaWx0ZXJcbiAgICAgID8gYCR7ZmlsdGVyZWQubGVuZ3RofSBwZW5kZW50ZSR7ZmlsdGVyZWQubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifSAvICR7bm90ZXMubGVuZ3RofWBcbiAgICAgIDogKGxhYmVsIHx8IGAke25vdGVzLmxlbmd0aH0gbm90YSR7bm90ZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWApO1xuICAgIGhkci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGVzLWxhYmVsXCIsIHRleHQ6IGNvdW50VHh0IH0pO1xuXG4gICAgY29uc3QgdG9nID0gaGRyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC12aWV3LXRvZ2dsZVwiIH0pO1xuICAgIGNvbnN0IGJ0blBlbmQgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKHRoaXMucmV2aWV3RmlsdGVyID8gXCIgd2Qtdmlldy1hY3RpdmUgd2Qtdmlldy1wZW5kXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1Q0JcIiB9KTtcbiAgICBidG5QZW5kLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vc3RyYXIgc1x1MDBGMyBwZW5kZW50ZXMgKG5cdTAwRTNvIHJldmlzYWRhcylcIik7XG4gICAgYnRuUGVuZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucmV2aWV3RmlsdGVyID0gIXRoaXMucmV2aWV3RmlsdGVyOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkwgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCFpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjYxXCIgfSk7XG4gICAgYnRuTC5zZXRBdHRyKFwidGl0bGVcIiwgXCJMaXN0YVwiKTtcbiAgICBidG5MLm9uY2xpY2sgPSBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImxpc3RcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgYnRuRyA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI5RVwiIH0pO1xuICAgIGJ0bkcuc2V0QXR0cihcInRpdGxlXCIsIFwiQ29sdW5hc1wiKTtcbiAgICBidG5HLm9uY2xpY2sgPSBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImdyaWRcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICBpZiAoIWZpbHRlcmVkLmxlbmd0aCkge1xuICAgICAgcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiB0aGlzLnJldmlld0ZpbHRlciA/IFwiTmVuaHVtYSBub3RhIHBlbmRlbnRlIG5lc3RhIHBhc3RhLlwiIDogXCJOZW5odW1hIG5vdGEuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzR3JpZCkge1xuICAgICAgY29uc3QgZ3JpZCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY2FyZCB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBwb3IgdGlwbyBkZSBhcnF1aXZvIChub3RhIC8gY2FudmFzIC8gYmFzZSkgXHUyMDE0IEZhc2UgOS4yXG4gICAgICAgIGNvbnN0IGNvdiA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jb3ZlciB3ZC1maWxlLSR7Zi5leHRlbnNpb259YCB9KTtcbiAgICAgICAgc2V0SWNvbihjb3YuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLWNvdmVyLWdseXBoXCIgfSksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuXG4gICAgICAgIGlmIChpc01kKSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHVyZykgeyBjb25zdCB3ID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cblxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIGNhcmQub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGlzdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLXJvdyB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgY29uc3QgdGkgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtdHlwZWljb24gd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24odGksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLWRvdCB3ZC1iYWRnZS0ke3N0fWAgfSk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBHclx1MDBFMWZpY28gZGUgY3Jlc2NpbWVudG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJHcm93dGgocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfR1JPVykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNSRVNDSU1FTlRPIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBidG5EYXkgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJkaWFcIiB9KTtcbiAgICBidG5EYXkuc2V0QXR0cihcInRpdGxlXCIsIFwiTm90YXMgY3JpYWRhcyBwb3IgZGlhXCIpO1xuICAgIGJ0bkRheS5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkN1bSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwidG90YWxcIiB9KTtcbiAgICBidG5DdW0uc2V0QXR0cihcInRpdGxlXCIsIFwiVG90YWwgYWN1bXVsYWRvIG5vIHBlclx1MDBFRG9kb1wiKTtcbiAgICBidG5DdW0ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSB0cnVlOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcImdyb3d0aFwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19HUk9XLCBcIk9jdWx0YXIgY3Jlc2NpbWVudG9cIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIC8vIEFncnVwYSBub3RhcyBwb3IgZGF0YSBkZSBjcmlhXHUwMEU3XHUwMEUzb1xuICAgIGNvbnN0IGNvdW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KG5ldyBEYXRlKGYuc3RhdC5jdGltZSkpO1xuICAgICAgY291bnRzW2tleV0gPSAoY291bnRzW2tleV0gPz8gMCkgKyAxO1xuICAgIH1cblxuICAgIC8vIFx1MDBEQWx0aW1vcyAzMCBkaWFzXG4gICAgY29uc3QgREFZUyA9IDMwO1xuICAgIGNvbnN0IGRheXM6IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IERBWVMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBkYXlzLnB1c2goeyBrZXksIGNvdW50OiBjb3VudHNba2V5XSA/PyAwLCBsYWJlbDogYCR7ZGF5fS8ke219YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbCA9IGRheXMucmVkdWNlKChzLCBkKSA9PiBzICsgZC5jb3VudCwgMCk7XG4gICAgY29uc3QgdG9kYXlLZXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIE1vZG8gY3VtdWxhdGl2bzogc29tYSBhY3VtdWxhZGEgZGlhIGEgZGlhXG4gICAgdHlwZSBEYXlFbnRyeSA9IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmc7IGRpc3BsYXlWYWw6IG51bWJlciB9O1xuICAgIGxldCBlbnRyaWVzOiBEYXlFbnRyeVtdO1xuICAgIGlmICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUpIHtcbiAgICAgIGxldCBhY2MgPSAwO1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4geyBhY2MgKz0gZC5jb3VudDsgcmV0dXJuIHsgLi4uZCwgZGlzcGxheVZhbDogYWNjIH07IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiAoeyAuLi5kLCBkaXNwbGF5VmFsOiBkLmNvdW50IH0pKTtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZW50cmllcy5tYXAoZSA9PiBlLmRpc3BsYXlWYWwpLCAxKTtcblxuICAgIC8vIExpbmhhIGRlIHJlc3Vtb1xuICAgIGNvbnN0IGluZm8gPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1pbmZvXCIgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC10b3RhbFwiLCB0ZXh0OiBgJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBlbnRyaWVzW2VudHJpZXMubGVuZ3RoIC0gMV0uZGlzcGxheVZhbCA6IHRvdGFsfWAgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC1wZXJpb2RcIiwgdGV4dDogdGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCJub3RhcyBhY3VtdWxhZGFzICgzMCBkaWFzKVwiIDogXCJub3RhcyBjcmlhZGFzIG5vcyBcdTAwRkFsdGltb3MgMzAgZGlhc1wiIH0pO1xuXG4gICAgLy8gR3JcdTAwRTFmaWNvIGRlIGJhcnJhc1xuICAgIGNvbnN0IGNoYXJ0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY2hhcnRcIiB9KTtcbiAgICBlbnRyaWVzLmZvckVhY2goKHsga2V5LCBjb3VudCwgbGFiZWwsIGRpc3BsYXlWYWwgfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNvbFwiICsgKGtleSA9PT0gdG9kYXlLZXkgPyBcIiB3ZC1ncm93dGgtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgYmFyQXJlYSA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhci1hcmVhXCIgfSk7XG4gICAgICBjb25zdCBpc0VtcHR5ID0gZGlzcGxheVZhbCA9PT0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChpc0VtcHR5ID8gXCIgd2QtZ3Jvd3RoLWJhci16ZXJvXCIgOiBcIlwiKSB9KTtcbiAgICAgIGJhci5zdHlsZS5oZWlnaHQgPSBpc0VtcHR5ID8gXCIzcHhcIiA6IGAke01hdGgubWF4KDUsIE1hdGgucm91bmQoKGRpc3BsYXlWYWwgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBpZiAoIWlzRW1wdHkpIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7bGFiZWx9OiAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGRpc3BsYXlWYWwgKyBcIiB0b3RhbFwiIDogY291bnQgKyBcIiBub3RhKHMpXCJ9YCk7XG5cbiAgICAgIGNvbnN0IHNob3dMYmwgPSBpZHggPT09IDAgfHwgaWR4ID09PSA3IHx8IGlkeCA9PT0gMTQgfHwgaWR4ID09PSAyMSB8fCBpZHggPT09IDI5IHx8IGtleSA9PT0gdG9kYXlLZXk7XG4gICAgICBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1sYmxcIiwgdGV4dDogc2hvd0xibCA/IGxhYmVsIDogXCJcIiB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IChGYXNlIDguMSBcdTIwMTQgbGVpdHVyYSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJUb2RvaXN0KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1RPRE8pKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG5cbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICAvLyBUb2dnbGUgZGUgamFuZWxhIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgKDMgLyA3KS5cbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgICAgY29uc3Qgc2VnID0gY3RybHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tcmFuZ2VcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBbMywgN10gYXMgY29uc3QpIHtcbiAgICAgICAgY29uc3QgYiA9IHNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmFuZ2UtYnRuXCIgKyAocmFuZ2UgPT09IG4gPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IGAke259ZGAgfSk7XG4gICAgICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIGBNb3N0cmFyIG9zIHByXHUwMEYzeGltb3MgJHtufSBkaWFzYCk7XG4gICAgICAgIGIub25jbGljayA9IGFzeW5jIGUgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gbjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBCb3RcdTAwRTNvIGRlIGZpbHRyb3MgKHByb2pldG8vZXRpcXVldGEpLlxuICAgICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgICAgY29uc3QgbkYgPSBmLnByb2plY3RzLmxlbmd0aCArIGYubGFiZWxzLmxlbmd0aDtcbiAgICAgIGNvbnN0IGZpbHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYnRuXCIgKyAodGhpcy50b2RvaXN0RmlsdGVyT3BlbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSArIChuRiA/IFwiIHdkLWFjdGl2ZVwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKGZpbHQsIFwiZmlsdGVyXCIpO1xuICAgICAgZmlsdC5zZXRBdHRyKFwidGl0bGVcIiwgbkYgPyBgRmlsdHJvcyBhdGl2b3MgKCR7bkZ9KSBcdTIwMTQgY2xpcXVlIHBhcmEgYWp1c3RhcmAgOiBcIkZpbHRyYXIgcG9yIHByb2pldG8vZXRpcXVldGFcIik7XG4gICAgICBpZiAobkYpIGZpbHQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRjdFwiLCB0ZXh0OiBTdHJpbmcobkYpIH0pO1xuICAgICAgZmlsdC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMudG9kb2lzdEZpbHRlck9wZW4gPSAhdGhpcy50b2RvaXN0RmlsdGVyT3BlbjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy50b2RvaXN0TG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciB0YXJlZmFzIGRvIFRvZG9pc3RcIik7XG4gICAgICByZWZyZXNoLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmZldGNoVG9kb2lzdCh0cnVlKTsgfTtcblxuICAgICAgdGhpcy5hZGRUYXNrQnRuKGN0cmxzLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgfVxuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcInRvZG9pc3RcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfVE9ETywgXCJPY3VsdGFyIHRhcmVmYXNcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb2xlIHNldSB0b2tlbiBkbyBUb2RvaXN0IGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgcGFyYSB2ZXIgc3VhcyB0YXJlZmFzIGFxdWkuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJpbWVpcmEgY2FyZ2EgcHJlZ3VpXHUwMEU3b3NhIChuXHUwMEUzbyByZWZheiBlbSBsb29wIHNlIGpcdTAwRTEgYnVzY291IG91IHNlIGRldSBlcnJvKS5cbiAgICBpZiAoIXRoaXMudG9kb2lzdEZldGNoZWRBdCAmJiAhdGhpcy50b2RvaXN0TG9hZGluZyAmJiAhdGhpcy50b2RvaXN0RXJyb3IpIHZvaWQgdGhpcy5mZXRjaFRvZG9pc3QoZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMudG9kb2lzdEVycm9yKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZXJyb3JcIiwgdGV4dDogYEVycm8gYW8gYnVzY2FyIHRhcmVmYXM6ICR7dGhpcy50b2RvaXN0RXJyb3J9YCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnRvZG9pc3RGZXRjaGVkQXQpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvIHRhcmVmYXNcdTIwMjZcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBCYXJyYSBkZSBmaWx0cm9zIChyZWNvbGhcdTAwRUR2ZWwpLlxuICAgIGlmICh0aGlzLnRvZG9pc3RGaWx0ZXJPcGVuKSB0aGlzLnJlbmRlclRvZG9GaWx0ZXJCYXIoc2VjKTtcblxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgIGNvbnN0IHRvZGF5SyA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGNvbnN0IGxhc3RVcGNvbWluZyA9IG5ldyBEYXRlKCk7XG4gICAgbGFzdFVwY29taW5nLnNldERhdGUobGFzdFVwY29taW5nLmdldERhdGUoKSArIHJhbmdlKTtcbiAgICBjb25zdCBsYXN0SyA9IHRvS2V5KGxhc3RVcGNvbWluZyk7ICAgLy8gbGltaXRlIGRvcyBcInByXHUwMEYzeGltb3MgZGlhc1wiIChpbmNsdXNpdmUpXG5cbiAgICAvLyBBcGxpY2EgZmlsdHJvcyBlIHNlcGFyYSBlbSBiYWxkZXM6IGF0cmFzYWRhcyBcdTAwQjcgaG9qZSBcdTAwQjcgcHJcdTAwRjN4aW1vcyBOIGRpYXMgXHUwMEI3IGRlcG9pcy5cbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuYXBwbHlUb2RvaXN0RmlsdGVycyh0aGlzLnRvZG9pc3RUYXNrcyk7XG4gICAgY29uc3Qgb3ZlcmR1ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGNvbnN0IHRvZGF5VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgVG9kb2lzdFRhc2tbXT4gPSB7fTtcbiAgICBjb25zdCBsYXRlcjogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiB0YXNrcykge1xuICAgICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgICBpZiAoIWRrKSBjb250aW51ZTsgICAvLyBzZW0gZGF0YTogZm9yYSBkb3MgYmxvY29zIHBvciBkaWEgKHBvZGVyXHUwMEUxIHZpcmFyIFwiQ2FpeGEgZGUgZW50cmFkYVwiIG5vIGZ1dHVybylcbiAgICAgIGlmIChkayA8IHRvZGF5Sykgb3ZlcmR1ZS5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPT09IHRvZGF5SykgdG9kYXlUYXNrcy5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPD0gbGFzdEspIChieURheVtka10gPz89IFtdKS5wdXNoKHQpO1xuICAgICAgZWxzZSBsYXRlci5wdXNoKHQpO1xuICAgIH1cbiAgICBjb25zdCBieVByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIG92ZXJkdWUuc29ydChieVByaSk7IHRvZGF5VGFza3Muc29ydChieVByaSk7IGxhdGVyLnNvcnQoYnlQcmkpO1xuICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhieURheSkpIGJ5RGF5W2tdLnNvcnQoYnlQcmkpO1xuXG4gICAgY29uc3QgdmlzaWJsZSA9IG92ZXJkdWUubGVuZ3RoICsgdG9kYXlUYXNrcy5sZW5ndGggKyBsYXRlci5sZW5ndGggKyBPYmplY3QudmFsdWVzKGJ5RGF5KS5yZWR1Y2UoKHMsIGEpID0+IHMgKyBhLmxlbmd0aCwgMCk7XG4gICAgaWYgKHZpc2libGUgPT09IDApIHtcbiAgICAgIGNvbnN0IGFsbCA9IHRoaXMudG9kb2lzdFRhc2tzLmxlbmd0aDtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogYWxsID8gXCJOZW5odW1hIHRhcmVmYSBiYXRlIGNvbSBvcyBmaWx0cm9zLlwiIDogXCJOZW5odW1hIHRhcmVmYSBjb20gZGF0YSBubyBUb2RvaXN0LiBcdUQ4M0NcdURGODlcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMaW5oYSBob3Jpem9udGFsIGNvbSAzIGNhaXhhcyBsYWRvIGEgbGFkbzogQXRyYXNhZGFzIFx1MDBCNyBIb2plIFx1MDBCNyBQclx1MDBGM3hpbW9zIE4gZGlhcy5cbiAgICBjb25zdCBjb2xzID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWNvbHNcIiB9KTtcblxuICAgIC8vIDFcdTAwQUEgXHUyMDE0IEF0cmFzYWRhcyAoY2FpeGEgdmVybWVsaGEpLlxuICAgIGNvbnN0IG9ib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtb3ZlcmR1ZVwiIH0pO1xuICAgIGNvbnN0IG9oZCA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveHdhcm5cIiwgdGV4dDogXCJcdTI2QTBcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiQXRyYXNhZGFzXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcob3ZlcmR1ZS5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IG9ib2R5ID0gb2JveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKG92ZXJkdWUubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2Ygb3ZlcmR1ZSkgdGhpcy50b2RvUm93KG9ib2R5LCB0KTtcbiAgICBlbHNlIG9ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYS4gXHVEODNEXHVEQzREXCIgfSk7XG5cbiAgICAvLyAyXHUwMEFBIFx1MjAxNCBIb2plIChjYWl4YSBlbSBkZXN0YXF1ZSkuXG4gICAgY29uc3QgdGJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC10b2RheVwiIH0pO1xuICAgIGNvbnN0IHRoZCA9IHRib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IFwiSG9qZVwiIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih0aGQsIFwiaG9qZVwiLCBcIk5vdmEgdGFyZWZhIHBhcmEgaG9qZVwiKTtcbiAgICB0aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh0b2RheVRhc2tzLmxlbmd0aCkgfSk7XG4gICAgY29uc3QgdGJvZHkgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodG9kYXlUYXNrcy5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiB0b2RheVRhc2tzKSB0aGlzLnRvZG9Sb3codGJvZHksIHQpO1xuICAgIGVsc2UgdGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOYWRhIHBhcmEgaG9qZS5cIiB9KTtcblxuICAgIC8vIDNcdTAwQUEgXHUyMDE0IFByXHUwMEYzeGltb3MgTiBkaWFzIChhZ3J1cGFkbyBwb3IgZGlhLCBjb20gc3ViLXRcdTAwRUR0dWxvIHNcdTAwRjMgbm9zIGRpYXMgcXVlIHRcdTAwRUFtIHRhcmVmYSkuXG4gICAgbGV0IHVwY29taW5nQ291bnQgPSAwO1xuICAgIGNvbnN0IHVwRGF5czogeyBkb3c6IG51bWJlcjsgbnVtOiBudW1iZXI7IGtleTogc3RyaW5nOyBpdGVtczogVG9kb2lzdFRhc2tbXSB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSByYW5nZTsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XTtcbiAgICAgIGlmICghaXRlbXM/Lmxlbmd0aCkgY29udGludWU7XG4gICAgICB1cGNvbWluZ0NvdW50ICs9IGl0ZW1zLmxlbmd0aDtcbiAgICAgIHVwRGF5cy5wdXNoKHsgZG93OiAoZGF5LmdldERheSgpICsgNikgJSA3LCBudW06IGRheS5nZXREYXRlKCksIGtleSwgaXRlbXMgfSk7XG4gICAgfVxuICAgIGNvbnN0IHVib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdXBjb21pbmdcIiB9KTtcbiAgICBjb25zdCB1aGQgPSB1Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdWhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBgUHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzYCB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odWhkLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgdWhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodXBjb21pbmdDb3VudCkgfSk7XG4gICAgY29uc3QgdWJvZHkgPSB1Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAodXBEYXlzLmxlbmd0aCkge1xuICAgICAgZm9yIChjb25zdCBnIG9mIHVwRGF5cykge1xuICAgICAgICBjb25zdCBkaCA9IHVib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWRheWhkXCIgKyAoZy5kb3cgPj0gNSA/IFwiIHdkLXdlZWtlbmRcIiA6IFwiXCIpIH0pO1xuICAgICAgICBkaC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbZy5kb3ddIH0pO1xuICAgICAgICBkaC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bnVtXCIsIHRleHQ6IFN0cmluZyhnLm51bSkgfSk7XG4gICAgICAgIHRoaXMuYWRkVGFza0J0bihkaCwgZy5rZXksIGBOb3ZhIHRhcmVmYSBlbSAke2cubnVtfWApO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZy5pdGVtcykgdGhpcy50b2RvUm93KHVib2R5LCB0LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IGBOYWRhIG5vcyBwclx1MDBGM3hpbW9zICR7cmFuZ2V9IGRpYXMuYCB9KTtcbiAgICB9XG5cbiAgICAvLyBEZXBvaXMgKD4gTiBkaWFzIFx1MDBFMCBmcmVudGU7IHJlY29saFx1MDBFRHZlbCwgYWJhaXhvIGRhIGxpbmhhLCBmZWNoYWRvIHBvciBwYWRyXHUwMEUzbykuXG4gICAgaWYgKGxhdGVyLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFuZWwgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJcIiB9KTtcbiAgICAgIGNvbnN0IGxoZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1sYXRlcmljb1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYERlcG9pcyAoJHtsYXRlci5sZW5ndGh9KWAgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90b2dnbGVcIiwgdGV4dDogdGhpcy50b2RvaXN0TGF0ZXJPcGVuID8gXCJvY3VsdGFyIFx1MjVCRVwiIDogXCJtb3N0cmFyIFx1MjAzQVwiIH0pO1xuICAgICAgbGhkLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudG9kb2lzdExhdGVyT3BlbiA9ICF0aGlzLnRvZG9pc3RMYXRlck9wZW47IHRoaXMucmVuZGVyKCk7IH07XG4gICAgICBpZiAodGhpcy50b2RvaXN0TGF0ZXJPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbGF0ZXIpIHRoaXMudG9kb1JvdyhsaXN0LCB0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBKYW5lbGEgZGUgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiBzYW5lYWRhICgzIG91IDcpLlxuICBwcml2YXRlIGRheVJhbmdlKCk6IDMgfCA3IHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID09PSAzID8gMyA6IDc7XG4gIH1cblxuICAvLyBNYW50XHUwMEU5bSBzXHUwMEYzIGFzIHRhcmVmYXMgcXVlIGJhdGVtIGNvbSBvcyBmaWx0cm9zIGF0aXZvcyAocHJvamV0byBFIGV0aXF1ZXRhKS5cbiAgcHJpdmF0ZSBhcHBseVRvZG9pc3RGaWx0ZXJzKHRhc2tzOiBUb2RvaXN0VGFza1tdKTogVG9kb2lzdFRhc2tbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIGlmICghZi5wcm9qZWN0cy5sZW5ndGggJiYgIWYubGFiZWxzLmxlbmd0aCkgcmV0dXJuIHRhc2tzO1xuICAgIGNvbnN0IHBzID0gbmV3IFNldChmLnByb2plY3RzKSwgbHMgPSBuZXcgU2V0KGYubGFiZWxzKTtcbiAgICByZXR1cm4gdGFza3MuZmlsdGVyKHQgPT4ge1xuICAgICAgaWYgKHBzLnNpemUgJiYgISh0LnByb2plY3RfaWQgJiYgcHMuaGFzKHQucHJvamVjdF9pZCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAobHMuc2l6ZSAmJiAhKHQubGFiZWxzID8/IFtdKS5zb21lKGwgPT4gbHMuaGFzKGwpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZVRvZG9GaWx0ZXIoa2luZDogXCJwcm9qZWN0c1wiIHwgXCJsYWJlbHNcIiwgaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGFyciA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzW2tpbmRdO1xuICAgIGNvbnN0IGkgPSBhcnIuaW5kZXhPZihpZCk7XG4gICAgaWYgKGkgPj0gMCkgYXJyLnNwbGljZShpLCAxKTsgZWxzZSBhcnIucHVzaChpZCk7XG4gIH1cblxuICAvLyBCYXJyYSBkZSBmaWx0cm9zOiBjaGlwcyBkZSBwcm9qZXRvIGUgZGUgZXRpcXVldGEgKHRvZ2dsZSksICsgbGltcGFyLlxuICBwcml2YXRlIHJlbmRlclRvZG9GaWx0ZXJCYXIoc2VjOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBjb25zdCBiYXIgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmlsdGVyYmFyXCIgfSk7XG5cbiAgICBpZiAodGhpcy50b2RvaXN0UHJvamVjdHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIlByb2pldG9zXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy50b2RvaXN0UHJvamVjdHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLnByb2plY3RzLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICBjb25zdCBjaGlwID0gZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBwLm5hbWUgfSk7XG4gICAgICAgIGNoaXAub25jbGljayA9IGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVUb2RvRmlsdGVyKFwicHJvamVjdHNcIiwgcC5pZCk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KHRoaXMudG9kb2lzdFRhc2tzLmZsYXRNYXAodCA9PiB0LmxhYmVscyA/PyBbXSkpXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIGlmIChsYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBncnAgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZmdyb3VwXCIgfSk7XG4gICAgICBncnAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZsYWJlbFwiLCB0ZXh0OiBcIkV0aXF1ZXRhc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxhYmVscykge1xuICAgICAgICBjb25zdCBvbiA9IGYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICBjb25zdCBjaGlwID0gdGhpcy5sYWJlbENoaXAoZ3JwLCBsLCBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSk7XG4gICAgICAgIGNoaXAub25jbGljayA9IGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVUb2RvRmlsdGVyKFwibGFiZWxzXCIsIGwpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZi5wcm9qZWN0cy5sZW5ndGggfHwgZi5sYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjbHIgPSBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjbGVhclwiLCB0ZXh0OiBcImxpbXBhciBmaWx0cm9zXCIgfSk7XG4gICAgICBjbHIub25jbGljayA9IGFzeW5jICgpID0+IHsgZi5wcm9qZWN0cyA9IFtdOyBmLmxhYmVscyA9IFtdOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB9XG4gIH1cblxuICAvLyBDaGVja2JveCBkZSBjb25jbHVzXHUwMEUzbyAoRmFzZSA4LjIpIFx1MjAxNCBjb25jbHVpIG5vIFRvZG9pc3QgcmVhbCBhbyBjbGljYXIuXG4gIHByaXZhdGUgdG9kb0NoZWNrKGhvc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IGNoZWNrID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tY2hlY2tcIiB9KTtcbiAgICBjaGVjay5zZXRBdHRyKFwidGl0bGVcIiwgXCJDb25jbHVpciB0YXJlZmFcIik7XG4gICAgY2hlY2sub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuY29tcGxldGVUYXNrKHQpOyB9O1xuICB9XG5cbiAgLy8gVG9vbHRpcCBkYSB0YXJlZmE6IHRcdTAwRUR0dWxvIGNvbXBsZXRvICsgZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpLCBubyBob3Zlci5cbiAgcHJpdmF0ZSBzaG93VGFza1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdGFzay10aXBcIiB9KTtcbiAgICBjb25zdCBoZWFkID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXByaVwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmlNZXRhKHQucHJpb3JpdHkpLmNvbG9yO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC10aXRsZVwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGQgPSB0LmRlc2NyaXB0aW9uIS50cmltKCk7XG4gICAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWRlc2NcIiwgdGV4dDogZC5sZW5ndGggPiBERVNDX01BWCA/IGQuc2xpY2UoMCwgREVTQ19NQVgpICsgXCJcdTIwMjZcIiA6IGQgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hUYXNrVGlwKGVsOiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUYXNrVGlwKGVsLCB0KSk7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgLy8gTGluaGEgZGUgdGFyZWZhICh1c2FkYSBuYXMgMyBjYWl4YXM6IGF0cmFzYWRhcywgaG9qZSwgcHJcdTAwRjN4aW1vcyBlIGVtIFwiZGVwb2lzXCIpLlxuICBwcml2YXRlIHRvZG9Sb3cobGlzdDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrLCBzaG93RGF0ZSA9IHRydWUpIHtcbiAgICBjb25zdCBwcmkgPSBwcmlNZXRhKHQucHJpb3JpdHkpO1xuICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tcm93XCIgfSk7XG4gICAgcm93LnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgcHJpLmNvbG9yKTtcbiAgICB0aGlzLnRvZG9DaGVjayhyb3csIHQpO1xuICAgIGNvbnN0IHRhZyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcHJpXCIsIHRleHQ6IHByaS5sYWJlbCB9KTtcbiAgICB0YWcuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy10eHRcIiwgdGV4dDogdC5jb250ZW50IH0pO1xuICAgIGlmIChoYXNEZXNjKHQpKSBzZXRJY29uKHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8taGFzZGVzY1wiIH0pLCBcImFsaWduLWxlZnRcIik7XG4gICAgY29uc3QgcHJvaiA9IHQucHJvamVjdF9pZCA/IHRoaXMudG9kb2lzdFByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAmJiBwcm9qKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1wcm9qXCIsIHRleHQ6IHByb2ogfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB0aGlzLmxhYmVsQ2hpcChyb3csIGwsIFwid2QtdG9kby1yb3ctbGFiZWxcIik7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKHNob3dEYXRlICYmIGRrKSB7XG4gICAgICBjb25zdCBbLCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfWAgfSk7XG4gICAgfVxuICAgIGlmICh0LmR1ZT8uaXNfcmVjdXJyaW5nKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlY3VyXCIsIHRleHQ6IFwiXHUyN0YzXCIgfSk7XG4gICAgcm93Lm9uY2xpY2sgPSAoKSA9PiB0aGlzLm9wZW5UYXNrRGV0YWlsKHQpO1xuICAgIHRoaXMuYXR0YWNoVGFza1RpcChyb3csIHQpO1xuICB9XG5cbiAgLy8gQm90XHUwMEUzbyBcIitcIiBkZSBjcmlhciB0YXJlZmEgKGhlYWRlciBkYSBzZVx1MDBFN1x1MDBFM28sIGNhaXhhcyBlIHN1Yi10XHUwMEVEdHVsb3MgZGUgZGlhKS5cbiAgcHJpdmF0ZSBhZGRUYXNrQnRuKGhvc3Q6IEhUTUxFbGVtZW50LCBwcmVmaWxsRHVlPzogc3RyaW5nLCB0aXRsZSA9IFwiTm92YSB0YXJlZmFcIikge1xuICAgIGNvbnN0IGIgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1hZGRcIiB9KTtcbiAgICBzZXRJY29uKGIsIFwicGx1c1wiKTtcbiAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgYi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJjcmVhdGVcIiwgcHJlZmlsbER1ZSB9KTsgfTtcbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIC8vIEFicmUgbyBmb3JtdWxcdTAwRTFyaW8gZGUgdGFyZWZhIChjcmlhciBvdSBlZGl0YXIpLlxuICBwcml2YXRlIG9wZW5UYXNrRm9ybShvcHRzOiB7IG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjsgdGFzaz86IFRvZG9pc3RUYXNrOyBwcmVmaWxsRHVlPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4udGhpcy50b2RvaXN0TGFiZWxDb2xvci5rZXlzKCksIC4uLnRoaXMudG9kb2lzdFRhc2tzLmZsYXRNYXAodCA9PiB0LmxhYmVscyA/PyBbXSldKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBuZXcgVGFza0Zvcm1Nb2RhbCh0aGlzLmFwcCwge1xuICAgICAgbW9kZTogb3B0cy5tb2RlLFxuICAgICAgdGFzazogb3B0cy50YXNrLFxuICAgICAgcHJlZmlsbER1ZTogb3B0cy5wcmVmaWxsRHVlLFxuICAgICAgcHJvamVjdHM6IHRoaXMudG9kb2lzdFByb2plY3RzLFxuICAgICAgbGFiZWxzLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBzdWJtaXQ6IHYgPT4gdGhpcy5zdWJtaXRUYXNrRm9ybShvcHRzLm1vZGUsIG9wdHMudGFzaywgdiksXG4gICAgICByZW1vdmU6IG9wdHMudGFzayA/ICgpID0+IHRoaXMuZGVsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICAgIGNvbXBsZXRlOiBvcHRzLnRhc2sgPyAoKSA9PiB2b2lkIHRoaXMuY29tcGxldGVUYXNrKG9wdHMudGFzayEpIDogdW5kZWZpbmVkLFxuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIC8vIEFicmUgbyBwb3AtdXAgZGUgZGV0YWxoZXMgKHNcdTAwRjMgbGVpdHVyYSk7IG8gYm90XHUwMEUzbyBcIkVkaXRhclwiIGFicmUgbyBmb3JtdWxcdTAwRTFyaW8uXG4gIHByaXZhdGUgb3BlblRhc2tEZXRhaWwodDogVG9kb2lzdFRhc2spIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBuZXcgVGFza0RldGFpbE1vZGFsKHRoaXMuYXBwLCB0aGlzLCB7XG4gICAgICB0YXNrOiB0LFxuICAgICAgcHJvamVjdE5hbWU6IHQucHJvamVjdF9pZCA/IHRoaXMudG9kb2lzdFByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQsXG4gICAgICBsYWJlbENvbG9yOiBuID0+IHRoaXMubGFiZWxDb2xvcihuKSxcbiAgICAgIGVkaXQ6ICgpID0+IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJlZGl0XCIsIHRhc2s6IHQgfSksXG4gICAgICBjb21wbGV0ZTogKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KSxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICAvLyBDcmlhIG91IGVkaXRhIG5vIFRvZG9pc3QgcmVhbC4gTm8gZWRpdGFyIG1hbmRhIHNcdTAwRjMgb3MgY2FtcG9zIGFsdGVyYWRvcyAocHJlc2VydmFcbiAgLy8gcmVjb3JyXHUwMEVBbmNpYSBzZSBhIGRhdGEgblx1MDBFM28gbXVkb3UpIGUgdHJvY2EgZGUgcHJvamV0byB2aWEgL21vdmUuIFJldG9ybmEgdHJ1ZSBzZSBPSy5cbiAgcHJpdmF0ZSBhc3luYyBzdWJtaXRUYXNrRm9ybShtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCIsIHRhc2s6IFRvZG9pc3RUYXNrIHwgdW5kZWZpbmVkLCB2OiBUYXNrRm9ybVZhbHVlcyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB2LmNvbnRlbnQsIHByaW9yaXR5OiB2LnByaW9yaXR5IH07XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uLnRyaW0oKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIGlmICh2LmR1ZVN0cmluZy50cmltKCkpIHsgZmllbGRzLmR1ZV9zdHJpbmcgPSB2LmR1ZVN0cmluZy50cmltKCk7IGZpZWxkcy5kdWVfbGFuZyA9IFwicHRcIjsgfVxuICAgICAgICBpZiAodi5wcm9qZWN0SWQpIGZpZWxkcy5wcm9qZWN0X2lkID0gdi5wcm9qZWN0SWQ7XG4gICAgICAgIGlmICh2LmxhYmVscy5sZW5ndGgpIGZpZWxkcy5sYWJlbHMgPSB2LmxhYmVscztcbiAgICAgICAgYXdhaXQgY3JlYXRlVG9kb2lzdFRhc2sodG9rZW4sIGZpZWxkcyk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDcmlhZGE6ICR7di5jb250ZW50fWApO1xuICAgICAgfSBlbHNlIGlmICh0YXNrKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0ge307XG4gICAgICAgIGlmICh2LmNvbnRlbnQgIT09IHRhc2suY29udGVudCkgZmllbGRzLmNvbnRlbnQgPSB2LmNvbnRlbnQ7XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uICE9PSAodGFzay5kZXNjcmlwdGlvbiA/PyBcIlwiKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbjtcbiAgICAgICAgaWYgKHYucHJpb3JpdHkgIT09IHRhc2sucHJpb3JpdHkpIGZpZWxkcy5wcmlvcml0eSA9IHYucHJpb3JpdHk7XG4gICAgICAgIGNvbnN0IG9sZER1ZSA9IHRhc2suZHVlPy5zdHJpbmcgPz8gdGFzay5kdWU/LmRhdGUgPz8gXCJcIjtcbiAgICAgICAgaWYgKHYuZHVlU3RyaW5nLnRyaW0oKSAhPT0gb2xkRHVlKSB7XG4gICAgICAgICAgZmllbGRzLmR1ZV9zdHJpbmcgPSB2LmR1ZVN0cmluZy50cmltKCkgfHwgXCJubyBkYXRlXCI7XG4gICAgICAgICAgaWYgKHYuZHVlU3RyaW5nLnRyaW0oKSkgZmllbGRzLmR1ZV9sYW5nID0gXCJwdFwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9sZEwgPSAodGFzay5sYWJlbHMgPz8gW10pLnNsaWNlKCkuc29ydCgpLmpvaW4oXCJcdTAwMDBcIik7XG4gICAgICAgIGNvbnN0IG5ld0wgPSB2LmxhYmVscy5zbGljZSgpLnNvcnQoKS5qb2luKFwiXHUwMDAwXCIpO1xuICAgICAgICBpZiAob2xkTCAhPT0gbmV3TCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGRzKS5sZW5ndGgpIGF3YWl0IHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCBmaWVsZHMpO1xuICAgICAgICBjb25zdCBvbGRQcm9qID0gdGFzay5wcm9qZWN0X2lkID8/IFwiXCI7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCAhPT0gb2xkUHJvaiAmJiB2LnByb2plY3RJZCkgYXdhaXQgbW92ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCB2LnByb2plY3RJZCk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBTYWx2YTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZldGNoVG9kb2lzdCh0cnVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIHNhbHZhcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gRXhjbHVpIGEgdGFyZWZhIChvdGltaXN0YSkgbm8gVG9kb2lzdCByZWFsLiBSZXRvcm5hIHRydWUgc2UgT0suXG4gIHByaXZhdGUgYXN5bmMgZGVsZXRlVGFzayh0OiBUb2RvaXN0VGFzayk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaWR4ID0gdGhpcy50b2RvaXN0VGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRvZG9pc3RUYXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkZWxldGVUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7XG4gICAgICBuZXcgTm90aWNlKGBcdUQ4M0RcdURERDEgRXhjbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoaWR4ID49IDApIHRoaXMudG9kb2lzdFRhc2tzLnNwbGljZShpZHgsIDAsIHQpOyAgIC8vIHJldmVydGVcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGV4Y2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBDb25jbHVpIGEgdGFyZWZhIGRlIGZvcm1hIG90aW1pc3RhOiByZW1vdmUgZGEgbGlzdGEgZSByZS1yZW5kZXJpemE7IHNlIGEgQVBJXG4gIC8vIGZhbGhhciwgcmVzdGF1cmEgZSBhdmlzYS4gQSBlc2NyaXRhIHJlZmxldGUgbm8gVG9kb2lzdCByZWFsIChGYXNlIDguMikuXG4gIHByaXZhdGUgYXN5bmMgY29tcGxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybjtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRvZG9pc3RUYXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudG9kb2lzdFRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNsb3NlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgbmV3IE5vdGljZShgXHUyNzEzIENvbmNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoaWR4ID49IDApIHRoaXMudG9kb2lzdFRhc2tzLnNwbGljZShpZHgsIDAsIHQpOyAgIC8vIHJldmVydGVcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGNvbmNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQnVzY2EgdGFyZWZhczsgYG1hbnVhbGAgbW9zdHJhIG8gc3Bpbm5lciBpbWVkaWF0YW1lbnRlLlxuICBwcml2YXRlIGFzeW5jIGZldGNoVG9kb2lzdChtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbiB8fCB0aGlzLnRvZG9pc3RMb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy50b2RvaXN0TG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy50b2RvaXN0RXJyb3IgPSBudWxsO1xuICAgIGlmIChtYW51YWwpIHRoaXMucmVuZGVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFByb2pldG9zL2V0aXF1ZXRhcyBzXHUwMEUzbyBhdXhpbGlhcmVzOyBzZSBmYWxoYXJlbSwgblx1MDBFM28gZGVycnViYW0gYXMgdGFyZWZhcy5cbiAgICAgIGNvbnN0IFt0YXNrcywgcHJvamVjdHMsIGxhYmVsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RQcm9qZWN0W10pLFxuICAgICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RMYWJlbFtdKSxcbiAgICAgIF0pO1xuICAgICAgdGhpcy50b2RvaXN0VGFza3MgPSB0YXNrcztcbiAgICAgIHRoaXMudG9kb2lzdFByb2plY3RzID0gcHJvamVjdHM7XG4gICAgICB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwID0gbmV3IE1hcChwcm9qZWN0cy5tYXAocCA9PiBbcC5pZCwgcC5uYW1lXSkpO1xuICAgICAgdGhpcy50b2RvaXN0TGFiZWxDb2xvciA9IG5ldyBNYXAobGFiZWxzLm1hcChsID0+IFtsLm5hbWUsIFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLXSkpO1xuICAgICAgdGhpcy50b2RvaXN0RmV0Y2hlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnRvZG9pc3RFcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50b2RvaXN0TG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXNldGEgbyBlc3RhZG8gKGV4LjogdG9rZW4gYWx0ZXJhZG8gbmFzIGNvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzKSBlIHJlLXJlbmRlcml6YS5cbiAgcmVzZXRUb2RvaXN0KCkge1xuICAgIHRoaXMudG9kb2lzdFRhc2tzID0gW107XG4gICAgdGhpcy50b2RvaXN0UHJvamVjdHMgPSBbXTtcbiAgICB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMudG9kb2lzdExhYmVsQ29sb3IgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy50b2RvaXN0RmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnRvZG9pc3RFcnJvciA9IG51bGw7XG4gICAgdGhpcy50b2RvaXN0TG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyBDb3IgKGhleCkgZGUgdW1hIGV0aXF1ZXRhIHBlbG8gbm9tZTsgY2luemEgc2UgZGVzY29uaGVjaWRhLlxuICBwcml2YXRlIGxhYmVsQ29sb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50b2RvaXN0TGFiZWxDb2xvci5nZXQobmFtZSkgPz8gTEFCRUxfRkFMTEJBQ0s7XG4gIH1cblxuICAvLyBDcmlhIHVtIGNoaXAgZGUgZXRpcXVldGEgY29tIGJvbGluaGEgY29sb3JpZGEgKyBcIkBub21lXCIuXG4gIHByaXZhdGUgbGFiZWxDaGlwKGhvc3Q6IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGNsczogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGNoaXAgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHMgfSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmxhYmVsQ29sb3IobmFtZSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke25hbWV9YCB9KTtcbiAgICByZXR1cm4gY2hpcDtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWFkZXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJTZWNvbmQgQnJhaW5cIiB9KTtcblxuICAgIGNvbnN0IHRvZ2dsZSA9IGguY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IFwid2QtY29tcGFjdC10b2dnbGVcIixcbiAgICAgIHRleHQ6IHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QgPyBcIlx1MjVBNiBjb21wYWN0b1wiIDogXCJcdTI1QTQgY29uZm9ydFx1MDBFMXZlbFwiLFxuICAgIH0pO1xuICAgIHRvZ2dsZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBbHRlcm5hciBtb2RvIGNvbXBhY3RvXCIpO1xuICAgIHRvZ2dsZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA9ICF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0O1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH07XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEUsIGxlYWYgPT4gbmV3IERhc2hib2FyZFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxheW91dC1kYXNoYm9hcmRcIiwgXCJBYnJpciBXZXJ1cyBEYXNoYm9hcmRcIiwgKCkgPT4gdGhpcy5vcGVuKCkpO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tZGFzaGJvYXJkXCIsIG5hbWU6IFwiQWJyaXIgRGFzaGJvYXJkXCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW4oKSB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdlcnVzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICB9XG5cbiAgLy8gUmUtYnVzY2EgbyBUb2RvaXN0IGVtIHRvZGFzIGFzIGRhc2hib2FyZHMgYWJlcnRhcyAoZXguOiBhcFx1MDBGM3MgbXVkYXIgbyB0b2tlbikuXG4gIHJlZnJlc2hEYXNoYm9hcmRzKCkge1xuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSkpIHtcbiAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcpIHYucmVzZXRUb2RvaXN0KCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIC8vIFNhbmVhbWVudG86IHNlY3Rpb25PcmRlciBjb20gZXhhdGFtZW50ZSBhcyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJyZXBvcnRzXCIsIFwiY2FsZW5kYXJcIl07XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8U2VjdGlvbklkPigpO1xuICAgIGNvbnN0IGNsZWFuZWQgPSAodGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgfHwgW10pLmZpbHRlcihcbiAgICAgIChzKTogcyBpcyBTZWN0aW9uSWQgPT4gdmFsaWQuaW5jbHVkZXMocyBhcyBTZWN0aW9uSWQpICYmICFzZWVuLmhhcyhzIGFzIFNlY3Rpb25JZCkgJiYgKHNlZW4uYWRkKHMgYXMgU2VjdGlvbklkKSwgdHJ1ZSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWxpZCkgaWYgKCFzZWVuLmhhcyh2KSkgY2xlYW5lZC5wdXNoKHYpO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gY2xlYW5lZDtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5zZXR0aW5ncy5oaWRkZW4pKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IFtdO1xuICAgIC8vIFNhbmVhbWVudG8gVG9kb2lzdCAodjAuNy4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID09PSAzID8gMyA6IDc7XG4gICAgY29uc3QgdGYgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnMgPSB7XG4gICAgICBwcm9qZWN0czogQXJyYXkuaXNBcnJheSh0Zj8ucHJvamVjdHMpID8gdGYucHJvamVjdHMgOiBbXSxcbiAgICAgIGxhYmVsczogQXJyYXkuaXNBcnJheSh0Zj8ubGFiZWxzKSA/IHRmLmxhYmVscyA6IFtdLFxuICAgIH07XG4gICAgLy8gRXhpYmlcdTAwRTdcdTAwRTNvIG5hcyBsaW5oYXMgKHYwLjguMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAhPT0gZmFsc2U7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPT09IHRydWU7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7IGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7IH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUG9wLXVwIGRlIGRldGFsaGVzIGRhIHRhcmVmYSAoc1x1MDBGMyBsZWl0dXJhOyBib3RcdTAwRTNvIEVkaXRhciBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvKSBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tEZXRhaWxPcHRzIHtcbiAgdGFzazogVG9kb2lzdFRhc2s7XG4gIHByb2plY3ROYW1lPzogc3RyaW5nO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGVkaXQ6ICgpID0+IHZvaWQ7XG4gIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRGV0YWlsTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LCBwcml2YXRlIG9wdHM6IFRhc2tEZXRhaWxPcHRzKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgdCA9IHRoaXMub3B0cy50YXNrO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLW1vZGFsXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0LmNvbnRlbnQpO1xuXG4gICAgY29uc3QgbWV0YSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGBcdUQ4M0RcdURDQzUgJHtkfS8ke219LyR7eX0ke3QuZHVlPy5pc19yZWN1cnJpbmcgPyBcIiBcdTI3RjNcIiA6IFwiXCJ9YCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0cy5wcm9qZWN0TmFtZSkgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYCMgJHt0aGlzLm9wdHMucHJvamVjdE5hbWV9YCB9KTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcCB3ZC10ZC1sYWJlbFwiIH0pO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgdm9pZCBNYXJrZG93blJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcCwgdC5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIC8vIEVkaXRhciAoZXNxdWVyZGEpIFx1MDBCNyBDb25jbHVpciArIEFicmlyIG5vIFRvZG9pc3QgKGRpcmVpdGEpLlxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IGVkaXQgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MEUgRWRpdGFyXCIgfSk7XG4gICAgZWRpdC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHRoaXMub3B0cy5lZGl0KCk7IH07XG4gICAgYWN0aW9ucy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgZG9uZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcxMyBDb25jbHVpclwiIH0pO1xuICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICBjb25zdCBvcGVuID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQWJyaXIgbm8gVG9kb2lzdFwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodCksIFwiX2JsYW5rXCIpO1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgLyBlZGl0YXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0Zvcm1WYWx1ZXMge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJIDEuLjQgKDQgPSBwMSlcbiAgZHVlU3RyaW5nOiBzdHJpbmc7XG4gIHByb2plY3RJZDogc3RyaW5nO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgVGFza0Zvcm1PcHRzIHtcbiAgbW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiO1xuICB0YXNrPzogVG9kb2lzdFRhc2s7XG4gIHByZWZpbGxEdWU/OiBzdHJpbmc7XG4gIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIHN1Ym1pdDogKHY6IFRhc2tGb3JtVmFsdWVzKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICByZW1vdmU/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICBjb21wbGV0ZT86ICgpID0+IHZvaWQ7XG59XG5cbmNsYXNzIFRhc2tGb3JtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgdjogVGFza0Zvcm1WYWx1ZXM7XG4gIHByaXZhdGUga25vd25MYWJlbHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIGNvbmZpcm1EZWwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBhY3Rpb25zRWwhOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBvcHRzOiBUYXNrRm9ybU9wdHMpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIGNvbnN0IHQgPSBvcHRzLnRhc2s7XG4gICAgdGhpcy52ID0ge1xuICAgICAgY29udGVudDogdD8uY29udGVudCA/PyBcIlwiLFxuICAgICAgZGVzY3JpcHRpb246IHQ/LmRlc2NyaXB0aW9uID8/IFwiXCIsXG4gICAgICBwcmlvcml0eTogdD8ucHJpb3JpdHkgPz8gMSxcbiAgICAgIGR1ZVN0cmluZzogdD8uZHVlPy5zdHJpbmcgPz8gb3B0cy5wcmVmaWxsRHVlID8/IFwiXCIsXG4gICAgICBwcm9qZWN0SWQ6IHQ/LnByb2plY3RfaWQgPz8gXCJcIixcbiAgICAgIGxhYmVsczogKHQ/LmxhYmVscyA/PyBbXSkuc2xpY2UoKSxcbiAgICB9O1xuICAgIHRoaXMua25vd25MYWJlbHMgPSBbLi4ubmV3IFNldChbLi4ub3B0cy5sYWJlbHMsIC4uLnRoaXMudi5sYWJlbHNdKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCwgdGl0bGVFbCwgbW9kYWxFbCB9ID0gdGhpcztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1mb3JtXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0aGlzLm9wdHMubW9kZSA9PT0gXCJjcmVhdGVcIiA/IFwiTm92YSB0YXJlZmFcIiA6IFwiRWRpdGFyIHRhcmVmYVwiKTtcblxuICAgIHRoaXMuZmllbGQoXCJUXHUwMEVEdHVsb1wiKTtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgY29udGVudC52YWx1ZSA9IHRoaXMudi5jb250ZW50O1xuICAgIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBcIk8gcXVlIHByZWNpc2Egc2VyIGZlaXRvP1wiO1xuICAgIGNvbnRlbnQub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmNvbnRlbnQgPSBjb250ZW50LnZhbHVlOyB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGVudC5mb2N1cygpLCAwKTtcblxuICAgIHRoaXMuZmllbGQoXCJEZXNjcmlcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNvbnN0IGRlc2MgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC10Zi10ZXh0YXJlYVwiIH0pO1xuICAgIGRlc2MudmFsdWUgPSB0aGlzLnYuZGVzY3JpcHRpb247XG4gICAgZGVzYy5wbGFjZWhvbGRlciA9IFwiRGV0YWxoZXMgLyBpbnN0cnVcdTAwRTdcdTAwRjVlcyAobWFya2Rvd24pXCI7XG4gICAgZGVzYy5yb3dzID0gMztcbiAgICBkZXNjLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kZXNjcmlwdGlvbiA9IGRlc2MudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJpb3JpZGFkZVwiKTtcbiAgICBjb25zdCBwcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1wcmktcm93XCIgfSk7XG4gICAgY29uc3QgcmVuZGVyUHJpID0gKCkgPT4ge1xuICAgICAgcHJvdy5lbXB0eSgpO1xuICAgICAgZm9yIChjb25zdCBhcGkgb2YgWzQsIDMsIDIsIDFdKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBUT0RPSVNUX1BSSVthcGldO1xuICAgICAgICBjb25zdCBiID0gcHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLXByaVwiICsgKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgICBiLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgbWV0YS5jb2xvcik7XG4gICAgICAgIGIub25jbGljayA9ICgpID0+IHsgdGhpcy52LnByaW9yaXR5ID0gYXBpOyByZW5kZXJQcmkoKTsgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlclByaSgpO1xuXG4gICAgdGhpcy5maWVsZChcIkRhdGFcIik7XG4gICAgY29uc3QgZHVlID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgZHVlLnZhbHVlID0gdGhpcy52LmR1ZVN0cmluZztcbiAgICBkdWUucGxhY2Vob2xkZXIgPSBcImV4LjogYW1hbmhcdTAwRTMsIHNleHRhLCB0b2RvIGRpYSAxLCAyMDI2LTA2LTEwXCI7XG4gICAgZHVlLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kdWVTdHJpbmcgPSBkdWUudmFsdWU7IH07XG4gICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiVGV4dG8gZW0gcG9ydHVndVx1MDBFQXMuIFZhemlvID0gc2VtIGRhdGEuXCIgfSk7XG4gICAgaWYgKHRoaXMub3B0cy50YXNrPy5kdWU/LmlzX3JlY3VycmluZylcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtd2FyblwiLCB0ZXh0OiBcIlx1MjdGMyBUYXJlZmEgcmVjb3JyZW50ZSBcdTIwMTQgbXVkYXIgYSBkYXRhIHBvZGUgYWx0ZXJhciBhIHJlY29yclx1MDBFQW5jaWEuXCIgfSk7XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJvamV0b1wiKTtcbiAgICBjb25zdCBzZWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtdGYtc2VsZWN0XCIgfSk7XG4gICAgY29uc3QgaW5ib3ggPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBcIkVudHJhZGEgKEluYm94KVwiLCB2YWx1ZTogXCJcIiB9KTtcbiAgICBpZiAoIXRoaXMudi5wcm9qZWN0SWQpIGluYm94LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5vcHRzLnByb2plY3RzKSB7XG4gICAgICBjb25zdCBvID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogcC5uYW1lLCB2YWx1ZTogcC5pZCB9KTtcbiAgICAgIGlmIChwLmlkID09PSB0aGlzLnYucHJvamVjdElkKSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc2VsLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYucHJvamVjdElkID0gc2VsLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIkV0aXF1ZXRhc1wiKTtcbiAgICBjb25zdCBsd3JhcCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxzXCIgfSk7XG4gICAgaWYgKHRoaXMua25vd25MYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCByZW5kZXJMYWJlbHMgPSAoKSA9PiB7XG4gICAgICAgIGx3cmFwLmVtcHR5KCk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmtub3duTGFiZWxzKSB7XG4gICAgICAgICAgY29uc3Qgb24gPSB0aGlzLnYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsd3JhcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMudi5sYWJlbHMuaW5kZXhPZihsKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHRoaXMudi5sYWJlbHMuc3BsaWNlKGksIDEpOyBlbHNlIHRoaXMudi5sYWJlbHMucHVzaChsKTtcbiAgICAgICAgICAgIHJlbmRlckxhYmVscygpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QgYWluZGEuXCIgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3Rpb25zRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICB0aGlzLnJlbmRlckFjdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZmllbGQobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQWN0aW9ucygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5hY3Rpb25zRWw7XG4gICAgYS5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlybURlbCAmJiB0aGlzLm9wdHMucmVtb3ZlKSB7XG4gICAgICBhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtY29uZmlybVwiLCB0ZXh0OiBcIkV4Y2x1aXIgZXN0YSB0YXJlZmE/XCIgfSk7XG4gICAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICAgIGNvbnN0IHllcyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICB5ZXMub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgeWVzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5yZW1vdmUhKCkpIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiKSB7XG4gICAgICBjb25zdCBkZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgZGVsLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IHRydWU7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgICAgY29uc3Qgb3BlbiA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkFicmlyIG5vIFRvZG9pc3RcIiB9KTtcbiAgICAgIG9wZW4ub25jbGljayA9ICgpID0+IHsgaWYgKHRoaXMub3B0cy50YXNrKSB3aW5kb3cub3Blbih0YXNrVXJsKHRoaXMub3B0cy50YXNrKSwgXCJfYmxhbmtcIik7IH07XG4gICAgICBpZiAodGhpcy5vcHRzLmNvbXBsZXRlKSB7XG4gICAgICAgIGNvbnN0IGRvbmUgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MTMgQ29uY2x1aXJcIiB9KTtcbiAgICAgICAgZG9uZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm9wdHMuY29tcGxldGUhKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICBjb25zdCBjYW5jZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgIGNhbmNlbC5vbmNsaWNrID0gKCkgPT4gdGhpcy5jbG9zZSgpO1xuICAgIGNvbnN0IHNhdmUgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJTYWx2YXJcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBzYXZlLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnYuY29udGVudCA9IHRoaXMudi5jb250ZW50LnRyaW0oKTtcbiAgICAgIGlmICghdGhpcy52LmNvbnRlbnQpIHsgbmV3IE5vdGljZShcIkRcdTAwRUEgdW0gdFx1MDBFRHR1bG8gXHUwMEUwIHRhcmVmYS5cIik7IHJldHVybjsgfVxuICAgICAgc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnN1Ym1pdCh0aGlzLnYpKSB0aGlzLmNsb3NlKCk7XG4gICAgICBlbHNlIHNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlIGNvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBXZXJ1c1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihhcHAsIHBsdWdpbik7IH1cblxuICBkaXNwbGF5KCkge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJJbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9rZW4gZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIlRvZG9pc3QgXHUyMTkyIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBJbnRlZ3JhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFRva2VuIGRlIEFQSSBkbyBkZXNlbnZvbHZlZG9yLiBTYWx2byBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIG8gdG9rZW4gYXF1aVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRhcyB0YXJlZmFzXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBvIHByb2pldG8gbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBvIG5vbWUgZG8gcHJvamV0byBhbyBsYWRvIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgYXMgQGV0aXF1ZXRhcyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUFpSztBQUVqSyxJQUFNLFlBQVk7QUFzQmxCLElBQU0sbUJBQWlDO0FBQUEsRUFDckMsY0FBYyxDQUFDLFNBQVMsV0FBVyxRQUFRLFdBQVcsVUFBVSxXQUFXLFVBQVU7QUFBQSxFQUNyRixTQUFTO0FBQUEsRUFDVCxRQUFRLENBQUM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLGNBQWM7QUFBQSxFQUNkLGlCQUFpQjtBQUFBLEVBQ2pCLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFO0FBQUEsRUFDM0Msb0JBQW9CO0FBQUEsRUFDcEIsbUJBQW1CO0FBQ3JCO0FBV0EsSUFBTSxPQUFzQjtBQUFBLEVBQzFCLEVBQUUsUUFBUSxZQUFnQixNQUFNLGFBQU0sT0FBTyxTQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUsUUFBUSxlQUFnQixNQUFNLGFBQU0sT0FBTyxZQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUsUUFBUSxZQUFnQixNQUFNLGFBQU0sT0FBTyxZQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUsUUFBUSxnQkFB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
