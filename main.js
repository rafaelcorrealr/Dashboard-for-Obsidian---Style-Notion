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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuXG50eXBlIFN0YXR1cyA9IFwicHJvZ3Jlc3NcIiB8IFwicGF1c2VkXCIgfCBcImNhbmNlbGxlZFwiO1xudHlwZSBTZWN0aW9uSWQgPSBcImNhbGVuZGFyXCIgfCBcInBhcmFcIiB8IFwicmVwb3J0c1wiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiIHwgXCJ0b2RvaXN0XCI7XG5cbmludGVyZmFjZSBUb2RvaXN0RmlsdGVycyB7XG4gIHByb2plY3RzOiBzdHJpbmdbXTsgICAvLyBpZHMgZGUgcHJvamV0byBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kb3MpXG4gIGxhYmVsczogc3RyaW5nW107ICAgICAvLyBub21lcyBkZSBldGlxdWV0YSBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kYXMpXG59XG5cbmludGVyZmFjZSBEYXNoU2V0dGluZ3Mge1xuICBzZWN0aW9uT3JkZXI6IFNlY3Rpb25JZFtdO1xuICBjb21wYWN0OiBib29sZWFuO1xuICBoaWRkZW46IHN0cmluZ1tdOyAgIC8vIGNhbWluaG9zIGRlIHBhc3RhIG9jdWx0b3MgKyBcInNlYzpjYWxlbmRhclwiIC8gXCJzZWM6cmVwb3J0c1wiXG4gIG5vdGVWaWV3OiBcImxpc3RcIiB8IFwiZ3JpZFwiO1xuICB0b2RvaXN0VG9rZW46IHN0cmluZztcbiAgdG9kb2lzdERheVJhbmdlOiAzIHwgNzsgICAgICAgIC8vIHF1YW50b3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiBtb3N0cmFyIG5hIGdyYWRlXG4gIHRvZG9pc3RGaWx0ZXJzOiBUb2RvaXN0RmlsdGVycztcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiBib29sZWFuOyAgIC8vIG1vc3RyYXIgbyBub21lIGRvIHByb2pldG8gbmFzIGxpbmhhc1xuICB0b2RvaXN0U2hvd0xhYmVsczogYm9vbGVhbjsgICAgLy8gbW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEYXNoU2V0dGluZ3MgPSB7XG4gIHNlY3Rpb25PcmRlcjogW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJyZXBvcnRzXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbiAgdG9kb2lzdERheVJhbmdlOiA3LFxuICB0b2RvaXN0RmlsdGVyczogeyBwcm9qZWN0czogW10sIGxhYmVsczogW10gfSxcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiB0cnVlLFxuICB0b2RvaXN0U2hvd0xhYmVsczogZmFsc2UsXG59O1xuXG5pbnRlcmZhY2UgUGFyYVNlY3Rpb24ge1xuICBmb2xkZXI6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBhY2NlbnQ6IHN0cmluZztcbn1cblxuLy8gUGFzdGFzIFwiY29uaGVjaWRhc1wiIGRvIFBBUkE6IG1hbnRcdTAwRUFtIFx1MDBFRGNvbmUsIHJcdTAwRjN0dWxvIGUgY29yIGZpeG9zLiBBcyBkZW1haXMgcGFzdGFzXG4vLyBkbyBjb2ZyZSBzXHUwMEUzbyByZW5kZXJpemFkYXMgY29tIGNvciBhdXRvbVx1MDBFMXRpY2EgZSBcdTAwRURjb25lIHBhZHJcdTAwRTNvIChvdSBvIGljb246IGRvIHN0YXR1cy5tZCkuXG5jb25zdCBQQVJBOiBQYXJhU2VjdGlvbltdID0gW1xuICB7IGZvbGRlcjogXCIwMC5JbmJveFwiLCAgICAgaWNvbjogXCJcdUQ4M0RcdURDRTVcIiwgbGFiZWw6IFwiSW5ib3hcIiwgICAgYWNjZW50OiBcIiM2MzY2RjFcIiB9LFxuICB7IGZvbGRlcjogXCIxMC5Qcm9qZWN0c1wiLCAgaWNvbjogXCJcdUQ4M0RcdURFODBcIiwgbGFiZWw6IFwiUHJvamV0b3NcIiwgYWNjZW50OiBcIiMxMEI5ODFcIiB9LFxuICB7IGZvbGRlcjogXCIyMC5BcmVhc1wiLCAgICAgaWNvbjogXCJcdUQ4M0NcdURGQUZcIiwgbGFiZWw6IFwiXHUwMEMxcmVhc1wiLCAgICBhY2NlbnQ6IFwiI0Y1OUUwQlwiIH0sXG4gIHsgZm9sZGVyOiBcIjMwLlJlc291cmNlc1wiLCBpY29uOiBcIlx1RDgzRFx1RENEQVwiLCBsYWJlbDogXCJSZWN1cnNvc1wiLCBhY2NlbnQ6IFwiIzNCODJGNlwiIH0sXG4gIHsgZm9sZGVyOiBcIjQwLkFyY2hpdmVcIiwgICBpY29uOiBcIlx1RDgzRFx1RERDNFx1RkUwRlwiLCAgbGFiZWw6IFwiQXJxdWl2b1wiLCAgYWNjZW50OiBcIiM2QjcyODBcIiB9LFxuXTtcbmNvbnN0IFBBUkFfTUFQID0gbmV3IE1hcChQQVJBLm1hcChwID0+IFtwLmZvbGRlciwgcF0pKTtcblxuLy8gUGFsZXRhIHBhcmEgY29sb3JpciBwYXN0YXMgZGVzY29uaGVjaWRhcyBkZSBmb3JtYSBlc3RcdTAwRTF2ZWwgKHBvciBoYXNoIGRvIG5vbWUpLlxuY29uc3QgQUNDRU5UUyA9IFtcIiM2MzY2RjFcIixcIiMxMEI5ODFcIixcIiNGNTlFMEJcIixcIiMzQjgyRjZcIixcIiNFQzQ4OTlcIixcIiM4QjVDRjZcIixcIiMxNEI4QTZcIixcIiNFRjQ0NDRcIl07XG5cbmNvbnN0IERBWV9TSE9SVCA9IFtcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNcdTAwRTFiXCIsIFwiRG9tXCJdO1xuY29uc3QgTU9OVEhfU0hPUlQgPSBbXCJKYW5cIixcIkZldlwiLFwiTWFyXCIsXCJBYnJcIixcIk1haVwiLFwiSnVuXCIsXCJKdWxcIixcIkFnb1wiLFwiU2V0XCIsXCJPdXRcIixcIk5vdlwiLFwiRGV6XCJdO1xuY29uc3QgSU1HX0VYVCA9IFtcInBuZ1wiLFwianBnXCIsXCJqcGVnXCIsXCJ3ZWJwXCIsXCJnaWZcIixcInN2Z1wiXTtcblxuLy8gUGFzdGEgcmFpeiBkYXMgbm90YXMgZGlcdTAwRTFyaWFzIChjcmlhZGFzIGFvIGNsaWNhciBudW0gZGlhIGRvIGNhbGVuZFx1MDBFMXJpbykuXG5jb25zdCBEQUlMWV9GT0xERVIgPSBcIjUwLkRpXHUwMEUxcmlvXCI7XG4vLyBUZW1wbGF0ZSBvcGNpb25hbDsgcGxhY2Vob2xkZXJzIHt7ZGF0ZX19IChZWVlZLU1NLUREKSBlIHt7dGl0bGV9fSAoZGF0YSBwb3IgZXh0ZW5zbykuXG5jb25zdCBEQUlMWV9URU1QTEFURSA9IFwiTW9kZWxvcy9Ob3RhIERpXHUwMEUxcmlhLm1kXCI7XG5cbmNvbnN0IFNUQVRVU19JQ09OOiBSZWNvcmQ8U3RhdHVzLCBzdHJpbmc+ID0ge1xuICBwcm9ncmVzczogXCJcdTI1QjZcIiwgcGF1c2VkOiBcIlx1MjNGOFwiLCBjYW5jZWxsZWQ6IFwiXHUyNzE1XCIsXG59O1xuXG5jb25zdCBTRUNfQ0FMID0gXCJzZWM6Y2FsZW5kYXJcIjtcbmNvbnN0IFNFQ19SRVAgPSBcInNlYzpyZXBvcnRzXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5jb25zdCBTRUNfVE9ETyA9IFwic2VjOnRvZG9pc3RcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBUb2RvaXN0VGFzayB7XG4gIGlkOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJOiAxLi40LCBvbmRlIDQgPSB1cmdlbnRlICg9IHAxIG5hIFVJKVxuICBkdWU/OiB7IGRhdGU6IHN0cmluZzsgZGF0ZXRpbWU/OiBzdHJpbmc7IHN0cmluZz86IHN0cmluZzsgaXNfcmVjdXJyaW5nPzogYm9vbGVhbiB9IHwgbnVsbDtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbiAgaXNfY29tcGxldGVkPzogYm9vbGVhbjtcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHVybD86IHN0cmluZztcbn1cblxuLy8gUHJpb3JpZGFkZSBkYSBBUEkgKDQ9dXJnZW50ZSkgXHUyMTkyIHJcdTAwRjN0dWxvL2NvciBkYSBVSSAocDE9dmVybWVsaG8gXHUyMDI2IHA0PWNpbnphKS5cbmNvbnN0IFRPRE9JU1RfUFJJOiBSZWNvcmQ8bnVtYmVyLCB7IGxhYmVsOiBzdHJpbmc7IGNvbG9yOiBzdHJpbmcgfT4gPSB7XG4gIDQ6IHsgbGFiZWw6IFwicDFcIiwgY29sb3I6IFwiI0VGNDQ0NFwiIH0sXG4gIDM6IHsgbGFiZWw6IFwicDJcIiwgY29sb3I6IFwiI0Y1OUUwQlwiIH0sXG4gIDI6IHsgbGFiZWw6IFwicDNcIiwgY29sb3I6IFwiIzNCODJGNlwiIH0sXG4gIDE6IHsgbGFiZWw6IFwicDRcIiwgY29sb3I6IFwiIzZCNzI4MFwiIH0sXG59O1xuZnVuY3Rpb24gcHJpTWV0YShwOiBudW1iZXIpIHsgcmV0dXJuIFRPRE9JU1RfUFJJW3BdID8/IFRPRE9JU1RfUFJJWzFdOyB9XG5cbi8vIFBhbGV0YSBub21lYWRhIGRvIFRvZG9pc3QgXHUyMTkyIGhleCAocGFyYSBjb2xvcmlyIGFzIGV0aXF1ZXRhcyBjb21vIG5vIGFwcCkuXG5jb25zdCBUT0RPSVNUX0NPTE9SUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgYmVycnlfcmVkOiBcIiNCODI1NUZcIiwgcmVkOiBcIiNEQjQwMzVcIiwgb3JhbmdlOiBcIiNGRjk5MzNcIiwgeWVsbG93OiBcIiNGQUQwMDBcIixcbiAgb2xpdmVfZ3JlZW46IFwiI0FGQjgzQlwiLCBsaW1lX2dyZWVuOiBcIiM3RUNDNDlcIiwgZ3JlZW46IFwiIzI5OTQzOFwiLCBtaW50X2dyZWVuOiBcIiM2QUNDQkNcIixcbiAgdGVhbDogXCIjMTU4RkFEXCIsIHNreV9ibHVlOiBcIiMxNEFBRjVcIiwgbGlnaHRfYmx1ZTogXCIjOTZDM0VCXCIsIGJsdWU6IFwiIzQwNzNGRlwiLFxuICBncmFwZTogXCIjODg0REZGXCIsIHZpb2xldDogXCIjQUYzOEVCXCIsIGxhdmVuZGVyOiBcIiNFQjk2RUJcIiwgbWFnZW50YTogXCIjRTA1MTk0XCIsXG4gIHNhbG1vbjogXCIjRkY4RDg1XCIsIGNoYXJjb2FsOiBcIiM4MDgwODBcIiwgZ3JleTogXCIjQjhCOEI4XCIsIHRhdXBlOiBcIiNDQ0FDOTNcIixcbn07XG5jb25zdCBMQUJFTF9GQUxMQkFDSyA9IFwiI0I4QjhCOFwiO1xuXG4vLyBCdXNjYSBhcyB0YXJlZmFzIGF0aXZhcyAoblx1MDBFM28gY29uY2x1XHUwMEVEZGFzKSB2aWEgQVBJIHVuaWZpY2FkYSB2MSAoYSBSRVNUIHYyIGZvaVxuLy8gYXBvc2VudGFkYSBcdTIxOTIgcmVzcG9uZGlhIDQxMCkuIEEgdjEgXHUwMEU5IHBhZ2luYWRhOiB7IHJlc3VsdHMsIG5leHRfY3Vyc29yIH0uXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RUYXNrW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIC8vIHYxIGVudmVsb3BhIGVtIHJlc3VsdHM7IHRvbGVyYSByZXNwb3N0YSBjb21vIGFycmF5IHB1cm8gcG9yIHNlZ3VyYW5cdTAwRTdhLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RUYXNrW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdFByb2plY3Qge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbi8vIEJ1c2NhIG9zIHByb2pldG9zIChwYXJhIG8gZmlsdHJvKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhIGRhcyB0YXJlZmFzLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFByb2plY3RbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Byb2plY3RzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RQcm9qZWN0W107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RQcm9qZWN0W10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IpO1xuICByZXR1cm4gYWxsO1xufVxuXG5pbnRlcmZhY2UgVG9kb2lzdExhYmVsIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBjb2xvcjogc3RyaW5nOyAgIC8vIG5vbWUgZGEgcGFsZXRhIChleC46IFwiY2hhcmNvYWxcIilcbn1cblxuLy8gQnVzY2EgYXMgZXRpcXVldGFzIHBlc3NvYWlzIChwYXJhIGNvbG9yaXIgb3MgY2hpcHMpLiBNZXNtYSBBUEkgdjEgcGFnaW5hZGEuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdExhYmVsW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0TGFiZWxbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvbGFiZWxzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RMYWJlbFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0TGFiZWxbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFVSTCBwYXJhIGFicmlyIGEgdGFyZWZhIG5vIFRvZG9pc3QgKHVzYSBhIGRvIHBheWxvYWQgb3UgbW9udGEgYSBwYXJ0aXIgZG8gaWQpLlxuZnVuY3Rpb24gdGFza1VybCh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gIHJldHVybiB0LnVybCA/PyBgaHR0cHM6Ly9hcHAudG9kb2lzdC5jb20vYXBwL3Rhc2svJHt0LmlkfWA7XG59XG5cbi8vIENvbmNsdWkgKGZlY2hhKSB1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFBPU1Qgc2VtIGNvcnBvOyAyMDQgPSBzdWNlc3NvLiBGYXNlIDguMi5cbmFzeW5jIGZ1bmN0aW9uIGNsb3NlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vY2xvc2VgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBFc2NyaXRhOiBjcmlhciAvIGVkaXRhciAvIG1vdmVyIC8gZXhjbHVpciAodjAuOC4wKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ2FtcG9zIGdyYXZcdTAwRTF2ZWlzLiBUb2RvcyBvcGNpb25haXMgXHUyMDE0IG5vIGVkaXRhciBtYW5kbyBzXHUwMEYzIG8gcXVlIG11ZG91LlxuaW50ZXJmYWNlIFRvZG9pc3RXcml0ZSB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eT86IG51bWJlcjsgICAgIC8vIDEuLjQgKDQgPSB1cmdlbnRlIC8gcDEgbmEgVUkpXG4gIGR1ZV9zdHJpbmc/OiBzdHJpbmc7ICAgLy8gbGluZ3VhZ2VtIG5hdHVyYWw7IFwibm8gZGF0ZVwiIGxpbXBhIGEgZGF0YVxuICBkdWVfbGFuZz86IHN0cmluZzsgICAgIC8vIFwicHRcIiBcdTIxOTIgaW50ZXJwcmV0YSBlbSBwb3J0dWd1XHUwMEVBc1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbn1cblxuZnVuY3Rpb24ganNvbkhlYWRlcnModG9rZW46IHN0cmluZykge1xuICByZXR1cm4geyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCwgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfTtcbn1cblxuLy8gQ3JpYSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcyBcdTIxOTIgMjAwIGNvbSBhIHRhcmVmYSBjcmlhZGEuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8VG9kb2lzdFRhc2s+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVG9kb2lzdFRhc2s7XG59XG5cbi8vIEVkaXRhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwMC4gTlx1MDBFM28gdHJvY2EgZGUgcHJvamV0byAodXNlIG1vdmVUb2RvaXN0VGFzaykuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBNb3ZlIGEgdGFyZWZhIHBhcmEgb3V0cm8gcHJvamV0by4gUE9TVCAvdGFza3Mve2lkfS9tb3ZlIFx1MjE5MiAyMDAuXG5hc3luYyBmdW5jdGlvbiBtb3ZlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgcHJvamVjdF9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9tb3ZlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHByb2plY3RfaWQgfSksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRXhjbHVpIGEgdGFyZWZhLiBERUxFVEUgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwNC5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIERhdGEgZGUgdmVuY2ltZW50byAoWVlZWS1NTS1ERCkgZGUgdW1hIHRhcmVmYSwgb3UgbnVsbCBzZSBzZW0gZHVlLlxuZnVuY3Rpb24gZHVlS2V5KHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGQgPSB0LmR1ZT8uZGF0ZSA/PyB0LmR1ZT8uZGF0ZXRpbWU7XG4gIHJldHVybiBkID8gZC5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuLy8gQSB0YXJlZmEgdGVtIGRlc2NyaVx1MDBFN1x1MDBFM28gKGluc3RydVx1MDBFN1x1MDBGNWVzKT9cbmZ1bmN0aW9uIGhhc0Rlc2ModDogVG9kb2lzdFRhc2spOiBib29sZWFuIHtcbiAgcmV0dXJuICEhdC5kZXNjcmlwdGlvbiAmJiB0LmRlc2NyaXB0aW9uLnRyaW0oKS5sZW5ndGggPiAwO1xufVxuY29uc3QgREVTQ19NQVggPSA3MDA7ICAgLy8gY29ydGUgZGEgZGVzY3JpXHUwMEU3XHUwMEUzbyBubyB0b29sdGlwIChvIHJlc3RvIGZpY2Egbm8gVG9kb2lzdClcblxuLy8gRnVuXHUwMEU3XHUwMEUzbyBnbG9iYWwgZXhwb3N0YSBwZWxvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiAocXVhbmRvIGhhYmlsaXRhZG8pLlxudHlwZSBIZWF0bWFwRW50cnkgPSB7IGRhdGU6IHN0cmluZzsgaW50ZW5zaXR5PzogbnVtYmVyOyBjb2xvcj86IHN0cmluZzsgY29udGVudD86IHN0cmluZyB9O1xudHlwZSBIZWF0bWFwRGF0YSA9IHtcbiAgeWVhcjogbnVtYmVyO1xuICBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgZW50cmllczogSGVhdG1hcEVudHJ5W107XG4gIHNob3dDdXJyZW50RGF5Qm9yZGVyPzogYm9vbGVhbjtcbn07XG5mdW5jdGlvbiBnZXRIZWF0bWFwUmVuZGVyZXIoKTogKChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IEhlYXRtYXBEYXRhKSA9PiB2b2lkKSB8IG51bGwge1xuICBjb25zdCBmbiA9ICh3aW5kb3cgYXMgdW5rbm93biBhcyB7IHJlbmRlckhlYXRtYXBDYWxlbmRhcj86IHVua25vd24gfSkucmVuZGVySGVhdG1hcENhbGVuZGFyO1xuICByZXR1cm4gdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIgPyAoZm4gYXMgKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIDogbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgZGF0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gaXNvV2Vla051bWJlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSkpO1xuICBjb25zdCBkb3cgPSBkLmdldFVUQ0RheSgpIHx8IDc7XG4gIGQuc2V0VVRDRGF0ZShkLmdldFVUQ0RhdGUoKSArIDQgLSBkb3cpO1xuICBjb25zdCB5MCA9IG5ldyBEYXRlKERhdGUuVVRDKGQuZ2V0VVRDRnVsbFllYXIoKSwgMCwgMSkpO1xuICByZXR1cm4gTWF0aC5jZWlsKCgoZC5nZXRUaW1lKCkgLSB5MC5nZXRUaW1lKCkpIC8gODZfNDAwXzAwMCArIDEpIC8gNyk7XG59XG5cbmZ1bmN0aW9uIG1vbmRheU9mKG9mZnNldDogbnVtYmVyKTogRGF0ZSB7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGRvdyA9IG5vdy5nZXREYXkoKSB8fCA3O1xuICBjb25zdCBkID0gbmV3IERhdGUobm93KTtcbiAgZC5zZXREYXRlKG5vdy5nZXREYXRlKCkgLSBkb3cgKyAxICsgb2Zmc2V0ICogNyk7XG4gIGQuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiB0b0tleShkOiBEYXRlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2QuZ2V0RnVsbFllYXIoKX0tJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfS0ke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0ZSh2YWw6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbC5zdWJzdHJpbmcoMCwgMTApO1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHZhbC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsKTtcbiAgcmV0dXJuIHMubWF0Y2goL15cXGR7NH0tXFxkezJ9LVxcZHsyfS8pID8gcy5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9kYXlCUigpOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gIH0pO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIENvbnRhIG5vdGFzIHJldmlzYWRhcyAocmV2aWV3ZWQ6IHRydWUpIHZzIHRvdGFsIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIHJldmlld2VkU3RhdHMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHsgcmV2aWV3ZWQ6IG51bWJlcjsgdG90YWw6IG51bWJlciB9IHtcbiAgbGV0IHJldmlld2VkID0gMCwgdG90YWwgPSAwO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikge1xuICAgICAgICB0b3RhbCsrO1xuICAgICAgICBpZiAoYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlKSByZXZpZXdlZCsrO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgcmV0dXJuIHsgcmV2aWV3ZWQsIHRvdGFsIH07XG59XG5cbi8vIENvbnRhIG1kIChleGNldG8gc3RhdHVzLm1kKSBlIGltYWdlbnMgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gZm9sZGVyU3RhdHMoZm9sZGVyOiBURm9sZGVyKTogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9IHtcbiAgbGV0IG1kID0gMCwgaW1nID0gMDtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSBtZCsrO1xuICAgICAgICBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkgaW1nKys7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICByZXR1cm4geyBtZCwgaW1nIH07XG59XG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG5mdW5jdGlvbiBjb3VudFRleHQoc3RhdHM6IHsgbWQ6IG51bWJlcjsgaW1nOiBudW1iZXIgfSk6IHN0cmluZyB7XG4gIGlmIChzdGF0cy5tZCA9PT0gMCAmJiBzdGF0cy5pbWcgPiAwKSByZXR1cm4gYCR7c3RhdHMuaW1nfSBpbWdgO1xuICByZXR1cm4gc3RhdHMuaW1nID4gMCA/IGAke3N0YXRzLm1kfSBub3RhcyBcdTAwQjcgJHtzdGF0cy5pbWd9IGltZ2AgOiBgJHtzdGF0cy5tZH0gbm90YXNgO1xufVxuXG4vLyBBcyBOIG5vdGFzIC5tZCBtb2RpZmljYWRhcyBtYWlzIHJlY2VudGVtZW50ZSBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiByZWNlbnROb3Rlcyhmb2xkZXI6IFRGb2xkZXIsIG46IG51bWJlcik6IFRGaWxlW10ge1xuICBjb25zdCBmaWxlczogVEZpbGVbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikgZmlsZXMucHVzaChjKTtcbiAgICAgIGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICBmaWxlcy5zb3J0KChhLCBiKSA9PiBiLnN0YXQubXRpbWUgLSBhLnN0YXQubXRpbWUpO1xuICByZXR1cm4gZmlsZXMuc2xpY2UoMCwgbik7XG59XG5cbi8vIFBhc3RhIFwiZGUgYXNzZXRzXCI6IHNcdTAwRjMgdGVtIGltYWdlbnMsIG5lbmh1bWEgbm90YSBcdTIxOTIgZXNjb25kaWRhIG5vIG5hdmVnYWRvciBpbnRlcm5vLlxuZnVuY3Rpb24gaXNBc3NldEZvbGRlcihmb2xkZXI6IFRGb2xkZXIpOiBib29sZWFuIHtcbiAgY29uc3QgeyBtZCwgaW1nIH0gPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICByZXR1cm4gaW1nID4gMCAmJiBtZCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gc3ViRm9sZGVycyhmb2xkZXI6IFRGb2xkZXIpOiBURm9sZGVyW10ge1xuICByZXR1cm4gKGZvbGRlci5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgIC5maWx0ZXIoZiA9PiAhaXNBc3NldEZvbGRlcihmKSlcbiAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbn1cblxuZnVuY3Rpb24gY292ZXJJbkZvbGRlcihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIDEuIENhbXBvIGNvdmVyOiBubyBzdGF0dXMubWQgKGFjZWl0YSBjYW1pbmhvIGRpcmV0byBvdSB3aWtpbGluayBbWy4uLl1dKVxuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGlmIChzZikge1xuICAgIGNvbnN0IHJhdyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uY292ZXI7XG4gICAgaWYgKHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgJiYgcmF3LnRyaW0oKSkge1xuICAgICAgY29uc3QgbGlua3BhdGggPSByYXcudHJpbSgpLnJlcGxhY2UoL14hP1xcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0udHJpbSgpO1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChsaW5rcGF0aCwgc2YucGF0aCk7XG4gICAgICBpZiAocmVzb2x2ZWQgaW5zdGFuY2VvZiBURmlsZSAmJiBJTUdfRVhULmluY2x1ZGVzKHJlc29sdmVkLmV4dGVuc2lvbikpXG4gICAgICAgIHJldHVybiBhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKHJlc29sdmVkKTtcbiAgICB9XG4gIH1cbiAgLy8gMi4gRmFsbGJhY2s6IGFycXVpdm8gX2NvdmVyLiogbmEgcGFzdGFcbiAgZm9yIChjb25zdCBjIG9mIGZvbGRlci5jaGlsZHJlbikge1xuICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5iYXNlbmFtZSA9PT0gXCJfY292ZXJcIiAmJiBJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSlcbiAgICAgIHJldHVybiBhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKGMpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiByZWFkRm9sZGVyU3RhdHVzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBTdGF0dXMge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IHMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbmZ1bmN0aW9uIHJlYWROb3RlU3RhdHVzKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFN0YXR1cyB7XG4gIGNvbnN0IHMgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFVyZ1x1MDBFQW5jaWEgKHByb3ByaWVkYWRlIGB1cmdlbmN5YCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG50eXBlIFVyZ2VuY3kgPSBcImFsdGFcIiB8IFwibWVkaWFcIiB8IFwiYmFpeGFcIjtcbmNvbnN0IFVSR0VOQ1lfUkFOSzogUmVjb3JkPFVyZ2VuY3ksIG51bWJlcj4gPSB7IGJhaXhhOiAxLCBtZWRpYTogMiwgYWx0YTogMyB9O1xuY29uc3QgVVJHRU5DWV9DT0xPUjogUmVjb3JkPFVyZ2VuY3ksIHN0cmluZz4gPSB7IGFsdGE6IFwiI0VGNDQ0NFwiLCBtZWRpYTogXCIjRjU5RTBCXCIsIGJhaXhhOiBcIiNFQUIzMDhcIiB9O1xuXG5mdW5jdGlvbiByZWFkTm90ZVVyZ2VuY3koYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogVXJnZW5jeSB8IG51bGwge1xuICBjb25zdCB1ID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnVyZ2VuY3k7XG4gIHJldHVybiB1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiID8gdSA6IG51bGw7XG59XG5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gTm90YXMgY29tIGB1cmdlbmN5YCBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUgKyBvIG5cdTAwRUR2ZWwgbVx1MDBFMXhpbW8gKG9yZGVuYWRhcyBwb3Igblx1MDBFRHZlbCBkZXNjKS5cbmZ1bmN0aW9uIHVyZ2VuY3lTdGF0cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogVXJnZW5jeUluZm8ge1xuICBjb25zdCBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdID0gW107XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgIGNvbnN0IHUgPSByZWFkTm90ZVVyZ2VuY3koYXBwLCBjKTtcbiAgICAgICAgaWYgKHUpIGl0ZW1zLnB1c2goeyBmaWxlOiBjLCBsZXZlbDogdSB9KTtcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIGxldCBtYXg6IFVyZ2VuY3kgfCBudWxsID0gbnVsbDtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykgaWYgKCFtYXggfHwgVVJHRU5DWV9SQU5LW2l0LmxldmVsXSA+IFVSR0VOQ1lfUkFOS1ttYXhdKSBtYXggPSBpdC5sZXZlbDtcbiAgaXRlbXMuc29ydCgoYSwgYikgPT4gVVJHRU5DWV9SQU5LW2IubGV2ZWxdIC0gVVJHRU5DWV9SQU5LW2EubGV2ZWxdKTtcbiAgcmV0dXJuIHsgaXRlbXMsIG1heCB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQXJxdWl2b3MgZXhpYlx1MDBFRHZlaXM6IG5vdGEgKC5tZCkgLyBjYW52YXMgKC5jYW52YXMpIC8gYmFzZSAoLmJhc2UpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgRklMRV9FWFRTID0gW1wibWRcIiwgXCJjYW52YXNcIiwgXCJiYXNlXCJdO1xuLy8gaWQgTHVjaWRlIHBvciB0aXBvIGRlIGFycXVpdm8uXG5mdW5jdGlvbiBmaWxlR2x5cGgoZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoZXh0ID09PSBcImNhbnZhc1wiKSByZXR1cm4gXCJzaGFwZXNcIjtcbiAgaWYgKGV4dCA9PT0gXCJiYXNlXCIpIHJldHVybiBcInRhYmxlLTJcIjtcbiAgcmV0dXJuIFwiZmlsZS10ZXh0XCI7XG59XG5mdW5jdGlvbiBmaWxlc0luKGZvbGRlcjogVEZvbGRlcik6IFRGaWxlW10ge1xuICByZXR1cm4gKGZvbGRlci5jaGlsZHJlbi5maWx0ZXIoXG4gICAgYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgRklMRV9FWFRTLmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCJcbiAgKSBhcyBURmlsZVtdKS5zb3J0KChhLCBiKSA9PiBhLmJhc2VuYW1lLmxvY2FsZUNvbXBhcmUoYi5iYXNlbmFtZSwgXCJwdFwiKSk7XG59XG5cbi8vIFx1MDBDRGNvbmUgZGVmaW5pZG8gZW0gYGljb246YCBubyBzdGF0dXMubWQgZGEgcGFzdGEgKGVtb2ppIG91IGlkIEx1Y2lkZSkuIG51bGwgc2UgYXVzZW50ZS5cbmZ1bmN0aW9uIHJlYWRGb2xkZXJJY29uKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBpYyA9IHNmICYmIGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uaWNvbjtcbiAgcmV0dXJuIHR5cGVvZiBpYyA9PT0gXCJzdHJpbmdcIiAmJiBpYy50cmltKCkgPyBpYy50cmltKCkgOiBudWxsO1xufVxuXG4vLyBpZCBMdWNpZGUgKHNcdTAwRjMgW2EtejAtOS1dKSBcdTIxOTIgc2V0SWNvbiBuYXRpdm87IGNhc28gY29udHJcdTAwRTFyaW8gdHJhdGEgY29tbyBlbW9qaS90ZXh0by5cbmZ1bmN0aW9uIHJlbmRlckljb24oZWw6IEhUTUxFbGVtZW50LCBpY29uOiBzdHJpbmcpIHtcbiAgaWYgKC9eW2EtejAtOS1dKyQvLnRlc3QoaWNvbikpIHNldEljb24oZWwsIGljb24pO1xuICBlbHNlIGVsLnNldFRleHQoaWNvbik7XG59XG5cbi8vIENvciBlc3RcdTAwRTF2ZWwgYSBwYXJ0aXIgZG8gbm9tZSAocGFyYSBwYXN0YXMgZm9yYSBkbyBQQVJBKS5cbmZ1bmN0aW9uIGFjY2VudEZvcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgaCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykgaCA9IChoICogMzEgKyBuYW1lLmNoYXJDb2RlQXQoaSkpID4+PiAwO1xuICByZXR1cm4gQUNDRU5UU1toICUgQUNDRU5UUy5sZW5ndGhdO1xufVxuXG4vLyBcdTAwQ0Rjb25lIC8gclx1MDBGM3R1bG8gLyBjb3IgZGUgdW1hIHBhc3RhIGRlIHRvcG86IHVzYSBvIFBBUkEgc2UgY29uaGVjaWRhLCBzZW5cdTAwRTNvIGRlcml2YS5cbmZ1bmN0aW9uIGZvbGRlck1ldGEoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHsgaWNvbjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyBhY2NlbnQ6IHN0cmluZyB9IHtcbiAgY29uc3Qga25vd24gPSBQQVJBX01BUC5nZXQoZm9sZGVyLnBhdGgpO1xuICBjb25zdCBjdXN0b20gPSByZWFkRm9sZGVySWNvbihhcHAsIGZvbGRlcik7XG4gIHJldHVybiB7XG4gICAgaWNvbjogICBjdXN0b20gPz8ga25vd24/Lmljb24gPz8gXCJcdUQ4M0RcdURDQzFcIixcbiAgICBsYWJlbDogIGtub3duPy5sYWJlbCA/PyBmb2xkZXIubmFtZSxcbiAgICBhY2NlbnQ6IGtub3duPy5hY2NlbnQgPz8gYWNjZW50Rm9yKGZvbGRlci5uYW1lKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmV2ZWFsSW5FeHBsb3JlcihhcHA6IEFwcCwgdGFyZ2V0OiB1bmtub3duKSB7XG4gIHR5cGUgRXhwUGx1Z2luID0geyBpbnN0YW5jZTogeyByZXZlYWxJbkZvbGRlcihmOiB1bmtub3duKTogdm9pZCB9IH07XG4gIGNvbnN0IGV4cCA9IChhcHAgYXMgQXBwICYge1xuICAgIGludGVybmFsUGx1Z2luczogeyBnZXRQbHVnaW5CeUlkKGlkOiBzdHJpbmcpOiBFeHBQbHVnaW4gfCBudWxsIH07XG4gIH0pLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwiZmlsZS1leHBsb3JlclwiKTtcbiAgaWYgKGV4cCAmJiB0YXJnZXQpIGV4cC5pbnN0YW5jZS5yZXZlYWxJbkZvbGRlcih0YXJnZXQpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVmlldyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY2xhc3MgRGFzaGJvYXJkVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSB3ZWVrT2Zmc2V0ID0gMDtcbiAgcHJpdmF0ZSBuYXZQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2VhcmNoVGVybSA9IFwiXCI7XG4gIHByaXZhdGUgcmV2aWV3RmlsdGVyID0gZmFsc2U7XG4gIHByaXZhdGUgZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlO1xuXG4gIC8vIEVzdGFkbyBkYSBpbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XG4gIHByaXZhdGUgdG9kb2lzdFRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgdG9kb2lzdFByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIHByaXZhdGUgdG9kb2lzdFByb2plY3RNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpOyAgIC8vIGlkIFx1MjE5MiBub21lXG4gIHByaXZhdGUgdG9kb2lzdExhYmVsQ29sb3IgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpOyAgIC8vIG5vbWUgZGEgZXRpcXVldGEgXHUyMTkyIGhleFxuICBwcml2YXRlIHRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgdG9kb2lzdEVycm9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0b2RvaXN0RmV0Y2hlZEF0ID0gMDtcbiAgcHJpdmF0ZSB0b2RvaXN0TGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgdG9kb2lzdEZpbHRlck9wZW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHsgc3VwZXIobGVhZik7IH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFZJRVdfVFlQRTsgfVxuICBnZXREaXNwbGF5VGV4dCgpIHsgcmV0dXJuIFwiRGFzaGJvYXJkXCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxheW91dC1kYXNoYm9hcmRcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICBhd2FpdCB0aGlzLnJlbmRlcigpO1xuICAgIGZvciAoY29uc3QgZXYgb2YgW1wibW9kaWZ5XCIsIFwiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwicmVuYW1lXCJdIGFzIGNvbnN0KVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKGV2IGFzIFwibW9kaWZ5XCIsICgpID0+IHRoaXMuc2NoZWR1bGUoKSkpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpIHsgdGhpcy5oaWRlVGlwKCk7IH1cblxuICBwcml2YXRlIHNjaGVkdWxlKCkge1xuICAgIGlmICh0aGlzLnRpbWVyKSBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXIoKSwgNDAwKTtcbiAgfVxuXG4gIC8vIFByaW1laXJvIHNlZ21lbnRvIGRlIHVtIGNhbWluaG8gKFwiMTAuUHJvamVjdHMvRm9vL0JhclwiIFx1MjE5MiBcIjEwLlByb2plY3RzXCIpLlxuICBwcml2YXRlIHRvcEZvbGRlck9mKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaSA9IHBhdGguaW5kZXhPZihcIi9cIik7XG4gICAgcmV0dXJuIGkgPT09IC0xID8gcGF0aCA6IHBhdGguc2xpY2UoMCwgaSk7XG4gIH1cblxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtY29tcGFjdFwiLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KTtcblxuICAgIHRoaXMucmVuZGVySGVhZGVyKHJvb3QpO1xuICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyKSB7XG4gICAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJwYXJhXCIpICAgIHRoaXMucmVuZGVyUGFyYShyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcImhlYXRtYXBcIikgdGhpcy5yZW5kZXJIZWF0bWFwKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwicmVwb3J0c1wiKSB0aGlzLnJlbmRlclJlcG9ydHMocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJncm93dGhcIikgIHRoaXMucmVuZGVyR3Jvd3RoKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwic3RhdHNcIikgICB0aGlzLnJlbmRlclN0YXRzKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3Qocm9vdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENvbnRyb2xlcyBkZSBvcmRlbSBkZSBzZVx1MDBFN1x1MDBFM28gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBtb3ZlQ29udHJvbHMoaG9zdDogSFRNTEVsZW1lbnQsIGlkOiBTZWN0aW9uSWQpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcjtcbiAgICBjb25zdCBpID0gb3JkZXIuaW5kZXhPZihpZCk7XG4gICAgY29uc3QgY3RybCA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW1vdmUtY3RybFwiIH0pO1xuXG4gICAgY29uc3QgdXAgPSBjdHJsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbW92ZS1idG5cIiArIChpIDw9IDAgPyBcIiB3ZC1tb3ZlLW9mZlwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUIyXCIgfSk7XG4gICAgdXAuc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgc2VcdTAwRTdcdTAwRTNvIHBhcmEgY2ltYVwiKTtcbiAgICBpZiAoaSA+IDApIHVwLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5tb3ZlU2VjdGlvbihpZCwgLTEpOyB9O1xuXG4gICAgY29uc3QgZG93biA9IGN0cmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1tb3ZlLWJ0blwiICsgKGkgPj0gb3JkZXIubGVuZ3RoIC0gMSA/IFwiIHdkLW1vdmUtb2ZmXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1QkNcIiB9KTtcbiAgICBkb3duLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHNlXHUwMEU3XHUwMEUzbyBwYXJhIGJhaXhvXCIpO1xuICAgIGlmIChpIDwgb3JkZXIubGVuZ3RoIC0gMSkgZG93bi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMubW92ZVNlY3Rpb24oaWQsICsxKTsgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbW92ZVNlY3Rpb24oaWQ6IFNlY3Rpb25JZCwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBvcmRlciA9IFsuLi50aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXJdO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaiA+PSBvcmRlci5sZW5ndGgpIHJldHVybjtcbiAgICBbb3JkZXJbaV0sIG9yZGVyW2pdXSA9IFtvcmRlcltqXSwgb3JkZXJbaV1dO1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IG9yZGVyO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgT2N1bHRhciAvIHJlc3RhdXJhciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIGlzSGlkZGVuKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlQnRuKGhvc3Q6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgdGl0bGU6IHN0cmluZywgY2xzID0gXCJ3ZC1oaWRlLWJ0blwiKSB7XG4gICAgY29uc3QgYiA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBzZXRJY29uKGIsIFwiZXllLW9mZlwiKTtcbiAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgYi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuaGlkZUl0ZW0oa2V5KTsgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGlkZUl0ZW0oa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihrZXkpKSByZXR1cm47XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLnB1c2goa2V5KTtcbiAgICAvLyBTZSBlc3RcdTAwRTF2YW1vcyBkZW50cm8gZGEgcGFzdGEgcXVlIGFjYWJvdSBkZSBzZXIgb2N1bHRhLCBmZWNoYSBvIG5hdmVnYWRvci5cbiAgICBpZiAodGhpcy5uYXZQYXRoICYmICh0aGlzLm5hdlBhdGggPT09IGtleSB8fCB0aGlzLm5hdlBhdGguc3RhcnRzV2l0aChrZXkgKyBcIi9cIikpKSB0aGlzLm5hdlBhdGggPSBudWxsO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVuaGlkZUl0ZW0oa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uZmlsdGVyKGsgPT4gayAhPT0ga2V5KTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRkZW5MYWJlbChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKGtleSA9PT0gU0VDX0NBTCkgcmV0dXJuIFwiXHVEODNEXHVEQ0M1IENhbGVuZFx1MDBFMXJpb1wiO1xuICAgIGlmIChrZXkgPT09IFNFQ19SRVApIHJldHVybiBcIlx1RDgzRFx1RENDNCBSZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX0hFQVQpIHJldHVybiBcIlx1RDgzRFx1REQyNSBIZWF0bWFwXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX0dST1cpIHJldHVybiBcIlx1RDgzRFx1RENDOCBDcmVzY2ltZW50b1wiO1xuICAgIGlmIChrZXkgPT09IFNFQ19TVEFUKSByZXR1cm4gXCJcdUQ4M0RcdURDQ0EgRXN0YXRcdTAwRURzdGljYXNcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfVE9ETykgcmV0dXJuIFwiXHVEODNEXHVEQ0NCIFRhcmVmYXNcIjtcbiAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGtleSk7XG4gICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURm9sZGVyID8gZi5uYW1lIDoga2V5O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJIaWRkZW5CYXIocGFyZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGhpZGRlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbjtcbiAgICBpZiAoIWhpZGRlbi5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBiYXIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhpZGRlbi1iYXJcIiB9KTtcbiAgICBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1oaWRkZW4tbGFiZWxcIiwgdGV4dDogXCJvY3VsdG9zOlwiIH0pO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGhpZGRlbikge1xuICAgICAgY29uc3QgY2hpcCA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWhpZGRlbi1jaGlwXCIgfSk7XG4gICAgICAvLyBQYXN0YSBvY3VsdGEgY29tIG5vdGFzIHVyZ2VudGVzIFx1MjE5MiBjb250b3JubyBwZWxhIGNvciBkbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vLlxuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChrZXkpO1xuICAgICAgY29uc3QgdXJnID0gZiBpbnN0YW5jZW9mIFRGb2xkZXIgPyB1cmdlbmN5U3RhdHModGhpcy5hcHAsIGYpIDogeyBpdGVtczogW10sIG1heDogbnVsbCB9O1xuICAgICAgaWYgKHVyZy5tYXgpIHtcbiAgICAgICAgY2hpcC5hZGRDbGFzcyhcIndkLWhpZGRlbi11cmdlbnRcIik7XG4gICAgICAgIGNoaXAuYWRkQ2xhc3MoYHdkLXUtJHt1cmcubWF4fWApO1xuICAgICAgICBjaGlwLnN0eWxlLmJvcmRlckNvbG9yID0gVVJHRU5DWV9DT0xPUlt1cmcubWF4XTtcbiAgICAgIH1cbiAgICAgIHNldEljb24oY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNoaXAtaWNvblwiIH0pLCBcImV5ZVwiKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IHRoaXMuaGlkZGVuTGFiZWwoa2V5KSB9KTtcbiAgICAgIGNoaXAuc2V0QXR0cihcInRpdGxlXCIsIHVyZy5tYXhcbiAgICAgICAgPyBgTW9zdHJhciBub3ZhbWVudGUgXHUyMDE0ICR7dXJnLml0ZW1zLmxlbmd0aH0gbm90YShzKSB1cmdlbnRlKHMpYFxuICAgICAgICA6IFwiTW9zdHJhciBub3ZhbWVudGVcIik7XG4gICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB0aGlzLnVuaGlkZUl0ZW0oa2V5KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gUG9zaWNpb25hIHVtIHRvb2x0aXAgZml4byBhYmFpeG8gZG8gYWx2byAodmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvKS5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2OyAgLy8gdmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvXG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgbGlzdGFuZG8gYXMgbm90YXMgdXJnZW50ZXMgZGUgdW1hIHBhc3RhIChob3ZlciBubyBiYWRnZSBkZSBhdmlzbykuXG4gIHByaXZhdGUgc2hvd1VyZ2VuY3lUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdXJnZW5jeS10aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIlVyZ2VudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXV0aXAtZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IFVSR0VOQ1lfQ09MT1JbaXQubGV2ZWxdO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogaXQuZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGl0LmxldmVsIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIEJhZGdlIGRlIGF2aXNvICh0cmlcdTAwRTJuZ3Vsbykgbm8gY2FyZCBkZSBwYXN0YSBxdWUgY29udFx1MDBFOW0gbm90YXMgY29tIGB1cmdlbmN5YC5cbiAgLy8gQ29yIHBlbG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbzsgaG92ZXIgbGlzdGEgb3MgYXJxdWl2b3MuIEZhc2UgMTAuXG4gIHByaXZhdGUgdXJnZW5jeUJhZGdlKGNhcmQ6IEhUTUxFbGVtZW50LCB1cmc6IFVyZ2VuY3lJbmZvKSB7XG4gICAgaWYgKCF1cmcubWF4KSByZXR1cm47XG4gICAgY29uc3QgYiA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktYmFkZ2Ugd2QtdS0ke3VyZy5tYXh9YCB9KTtcbiAgICBzZXRJY29uKGIsIFwidHJpYW5nbGUtYWxlcnRcIik7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dVcmdlbmN5VGlwKGIsIHVyZy5pdGVtcykpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3QgcmVjZW50cyA9IHJlY2VudE5vdGVzKGZvbGRlciwgNCk7XG4gICAgaWYgKCFyZWNlbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGlwKGNhcmQsIHJlY2VudHMpKTtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYWxlbmRcdTAwRTFyaW8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYWxlbmRhcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19DQUwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtb25kYXkgID0gbW9uZGF5T2YodGhpcy53ZWVrT2Zmc2V0KTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuICAgIGNvbnN0IHRvZGF5SyAgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZzsgZmlsZTogVEZpbGUgfVtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpO1xuICAgICAgaWYgKGQpIChieURheVtkXSA/Pz0gW10pLnB1c2goeyBuYW1lOiBmaWxlLmJhc2VuYW1lLCBmaWxlIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtY2FsLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBuYXYgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYXYtYmFyXCIgfSk7XG4gICAgY29uc3QgcGhvbmUgPSBQbGF0Zm9ybS5pc1Bob25lO1xuXG4gICAgLy8gQ2VsdWxhcjogamFuZWxhIGRlIDMgZGlhcyA9IG9udGVtIFx1MDBCNyBob2plIFx1MDBCNyBhbWFuaFx1MDBFMyAod2Vla09mZnNldCBwYWdpbmEgZGUgMyBlbSAzKS5cbiAgICBjb25zdCBkYXlBbmNob3IgPSBuZXcgRGF0ZSgpO1xuICAgIGRheUFuY2hvci5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgLSAxICsgdGhpcy53ZWVrT2Zmc2V0ICogMyk7XG4gICAgY29uc3QgZm10RE0gPSAoZDogRGF0ZSkgPT4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCBcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsYXN0ID0gbmV3IERhdGUoZGF5QW5jaG9yKTsgbGFzdC5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyAyKTtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGAke2ZtdERNKGRheUFuY2hvcil9IFx1MjAxMyAke2ZtdERNKGxhc3QpfWAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGBTZW1hbmEgJHt3ZWVrTnVtfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY3RybHMgPSBuYXYuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IHByZXYgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzOVwiIH0pO1xuICAgIGNvbnN0IG5leHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgIHByZXYub25jbGljayA9ICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0LS07IHRoaXMucmVuZGVyKCk7IH07XG4gICAgbmV4dC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQrKzsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJjYWxlbmRhclwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19DQUwsIFwiT2N1bHRhciBjYWxlbmRcdTAwRTFyaW9cIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDZWx1bGFyOiBsaXN0YSB2ZXJ0aWNhbCBkZSAzIGRpYXMgKG9udGVtL2hvamUvYW1hbmhcdTAwRTMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENhZGEgZGlhID0gYSBub3RhIGRpXHUwMEUxcmlhICh1bWEgcG9yIGRpYSkuIExpbmhhIGludGVpcmEgY2xpY1x1MDBFMXZlbDogYWJyZSBhXG4gICAgLy8gZXhpc3RlbnRlOyBzZSBuXHUwMEUzbyBob3V2ZXIsIGNyaWEuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsaXN0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbGlzdFwiIH0pO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoZGF5QW5jaG9yKTtcbiAgICAgICAgZGF5LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIGkpO1xuICAgICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgICBjb25zdCBkb3cgPSAoZGF5LmdldERheSgpICsgNikgJSA3O1xuICAgICAgICBjb25zdCBub3RlID0gdGhpcy5maW5kRGFpbHlOb3RlKGtleSk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IFtcIndkLWNhbC1kcm93XCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgZG93ID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5zZXRBdHRyKFwidGl0bGVcIiwgbm90ZSA/IFwiQWJyaXIgbm90YSBkaVx1MDBFMXJpYVwiIDogXCJDcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgICBjb25zdCBoZCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWRyb3ctaGRcIiB9KTtcbiAgICAgICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbZG93XSB9KTtcbiAgICAgICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgICAgY29uc3QgYm9keSA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWRyb3ctbm90ZXNcIiB9KTtcbiAgICAgICAgaWYgKG5vdGUpIHtcbiAgICAgICAgICBjb25zdCBwaWxsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgICBwaWxsLnRleHRDb250ZW50ID0gbm90ZS5iYXNlbmFtZS5sZW5ndGggPiAyNCA/IG5vdGUuYmFzZW5hbWUuc2xpY2UoMCwgMjQpICsgXCJcdTIwMjZcIiA6IG5vdGUuYmFzZW5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYm9keS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1kcm93LWVtcHR5XCIsIHRleHQ6IFwiY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRGVza3RvcC90YWJsZXQ6IGdyYWRlIGRlIDcgZGlhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZ3JpZFwiIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgICAgZGF5LnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGNvbCA9IGdyaWQuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtY29sXCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgaSA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhkID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtaGRcIiB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbaV0gfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW51bVwiLCAgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgaGQuc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgLyBjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgaGQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpOyB9O1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV0gPz8gW107XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zLnNsaWNlKDAsIDMpKSB7XG4gICAgICAgIGNvbnN0IHBpbGwgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgIHBpbGwudGV4dENvbnRlbnQgPSBpdC5uYW1lLmxlbmd0aCA+IDE0ID8gaXQubmFtZS5zbGljZSgwLCAxNCkgKyBcIlx1MjAyNlwiIDogaXQubmFtZTtcbiAgICAgICAgcGlsbC5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGl0LmZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDMpIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW1vcmVcIiwgdGV4dDogYCske2l0ZW1zLmxlbmd0aCAtIDN9YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgIGVuZC5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyA2KTtcbiAgICBzZWMuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogXCJ3ZC1jYWwtZm9vdGVyXCIsXG4gICAgICB0ZXh0OiBtb25kYXkuZ2V0TW9udGgoKSA9PT0gZW5kLmdldE1vbnRoKClcbiAgICAgICAgPyBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19ICR7bW9uZGF5LmdldEZ1bGxZZWFyKCl9YFxuICAgICAgICA6IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gXHUyMDEzICR7TU9OVEhfU0hPUlRbZW5kLmdldE1vbnRoKCldfSAke2VuZC5nZXRGdWxsWWVhcigpfWAsXG4gICAgfSk7XG4gIH1cblxuICAvLyBBY2hhIGEgbm90YSBkaVx1MDBFMXJpYSBkZSBga2V5YCAoWVlZWS1NTS1ERCk6IHByaW1laXJvIHBlbG8gY2FtaW5obyBjYW5cdTAwRjRuaWNvIGVtXG4gIC8vIDUwLkRpXHUwMEUxcmlvLywgc2VuXHUwMEUzbyBxdWFscXVlciBub3RhIGN1am8gYGRhdGU6YCBzZWphIGVzc2UgZGlhLiBOdWxsIHNlIG5cdTAwRTNvIGhvdXZlci5cbiAgLy8gKFJlbGF0XHUwMEYzcmlvL25vdGEgZGlcdTAwRTFyaWEgXHUwMEU5IHVtIHBvciBkaWEgXHUyMTkyIGFicmUgbyBleGlzdGVudGUgZW0gdmV6IGRlIGNyaWFyIG91dHJvLilcbiAgcHJpdmF0ZSBmaW5kRGFpbHlOb3RlKGtleTogc3RyaW5nKTogVEZpbGUgfCBudWxsIHtcbiAgICBjb25zdCBkaXJlY3QgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoYCR7REFJTFlfRk9MREVSfS8ke2tleX0ubWRgKTtcbiAgICBpZiAoZGlyZWN0IGluc3RhbmNlb2YgVEZpbGUpIHJldHVybiBkaXJlY3Q7XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgaWYgKG5vcm1hbGl6ZURhdGUodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8uZGF0ZSkgPT09IGtleSkgcmV0dXJuIGY7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQWJyZSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWA7IGNyaWEgZW0gNTAuRGlcdTAwRTFyaW8vIFNcdTAwRDMgc2Ugblx1MDBFM28gZXhpc3RpciBuZW5odW1hLlxuICBwcml2YXRlIGFzeW5jIG9wZW5EYWlseU5vdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgIGlmIChleGlzdGluZykgeyBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZXhpc3RpbmcpOyByZXR1cm47IH1cblxuICAgIC8vIE5cdTAwRTNvIGV4aXN0ZSBcdTIxOTIgY3JpYSBubyBjYW1pbmhvIGNhblx1MDBGNG5pY28uXG4gICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfRk9MREVSKSlcbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihEQUlMWV9GT0xERVIpLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIGNvbnN0IFt5LCBtLCBkXSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgY29uc3QgdGl0dWxvID0gbmV3IERhdGUoK3ksICttIC0gMSwgK2QpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICAgIH0pO1xuXG4gICAgLy8gVXNhIG8gdGVtcGxhdGUgZW0gTW9kZWxvcy8gc2UgZXhpc3Rpcjsgc2VuXHUwMEUzbywgZmFsbGJhY2sgZW1idXRpZG8uXG4gICAgY29uc3QgdHBsID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX1RFTVBMQVRFKTtcbiAgICBsZXQgYm9keTogc3RyaW5nO1xuICAgIGlmICh0cGwgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgYm9keSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKHRwbCkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZGF0ZVxccypcXH1cXH0vZywga2V5KVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKnRpdGxlXFxzKlxcfVxcfS9nLCB0aXR1bG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5ID1cbmAtLS1cbm93bmVyOiBXZXJ1c1xuY3JlYXRlZDogJHtrZXl9XG5kYXRlOiAke2tleX1cbnJldmlld2VkOiB0cnVlXG50eXBlOiBkYWlseVxucGVybWlzc2lvbnM6XG4gIHJlYWQ6IFthbGxdXG4gIHdyaXRlOlxuICAgIC0gV2VydXNcbi0tLVxuXG4jICR7dGl0dWxvfVxuXG5gO1xuICAgIH1cbiAgICBjb25zdCBmaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCwgYm9keSk7XG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRzIGRvIGNvZnJlICh0b2RhcyBhcyBwYXN0YXMgZGUgdG9wbykgKyBuYXZlZ2Fkb3IgYW5pbmhhZG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJQYXJhKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ09GUkVcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhoZWFkLCBcInBhcmFcIik7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYXJhLWdyaWRcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSAgIC8vIGlnbm9yYSAub2JzaWRpYW4sIC50cmFzaCwgZXRjLlxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgY29uc3QgYWN0aXZlUm9vdCA9IHRoaXMubmF2UGF0aCA/IHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSA6IG51bGw7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBtZXRhICAgID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHN0YXRzICAgPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSBzdWJGb2xkZXJzKGZvbGRlcikubGVuZ3RoID4gMCB8fCBmaWxlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLmhpZGVCdG4oY2FyZCwgZm9sZGVyLnBhdGgsIGBPY3VsdGFyIFwiJHttZXRhLmxhYmVsfVwiYCk7XG4gICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIGZvbGRlcikpO1xuXG4gICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGZvbGRlcik7XG5cbiAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaWYgKG5hdmlnYWJsZSkgeyB0aGlzLm5hdlBhdGggPSBpc0FjdGl2ZSA/IG51bGwgOiBmb2xkZXIucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfVxuICAgICAgICBlbHNlIHJldmVhbEluRXhwbG9yZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IGZpbGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVySGlkZGVuQmFyKHNlYyk7XG4gIH1cblxuICAvLyBQYWluZWwgaW5saW5lIG5hdmVnXHUwMEUxdmVsIChicmVhZGNydW1iICsgc3VicGFzdGFzICsgbm90YXMgZGEgcGFzdGEgYXR1YWwpXG4gIHByaXZhdGUgcmVuZGVyQnJvd3NlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHRoaXMudG9wRm9sZGVyT2YoZm9sZGVyLnBhdGgpO1xuICAgIGNvbnN0IHJvb3RGb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocm9vdFBhdGgpO1xuICAgIGlmICghKHJvb3RGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCByb290Rm9sZGVyKTtcblxuICAgIGNvbnN0IHBhbmVsID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYW5lbFwiIH0pO1xuICAgIHBhbmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgLy8gQnJlYWRjcnVtYlxuICAgIGNvbnN0IGNydW1iID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNydW1iXCIgfSk7XG4gICAgY29uc3QgcmVsID0gZm9sZGVyLnBhdGggPT09IHJvb3RQYXRoID8gW10gOiBmb2xkZXIucGF0aC5zbGljZShyb290UGF0aC5sZW5ndGggKyAxKS5zcGxpdChcIi9cIik7XG5cbiAgICBjb25zdCByb290U2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChyZWwubGVuZ3RoID09PSAwID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSB9KTtcbiAgICByZW5kZXJJY29uKHJvb3RTZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgcm9vdFNlZy5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICBpZiAocmVsLmxlbmd0aCkgcm9vdFNlZy5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgc2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNlZ1BhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xvc2Uub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIENhbXBvIGRlIGJ1c2NhXG4gICAgY29uc3Qgc2VhcmNoV3JhcCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWFyY2gtd3JhcFwiIH0pO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoV3JhcC5jcmVhdGVFbChcImlucHV0XCIsIHtcbiAgICAgIGNsczogXCJ3ZC1zZWFyY2hcIixcbiAgICAgIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcImZpbHRyYXJcdTIwMjZcIiwgdmFsdWU6IHRoaXMuc2VhcmNoVGVybSB9LFxuICAgIH0pO1xuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLXN1Yi1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYmwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLndkLWxhYmVsXCIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbGJsLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1ub3RlLXJvdywgLndkLW5vdGUtY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbC5xdWVyeVNlbGVjdG9yKFwiLndkLW5vdGUtbmFtZSwgLndkLW5vdGUtY2FyZC1uYW1lXCIpPy50ZXh0Q29udGVudCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbmFtZS5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU3VicGFzdGFzIGNvbW8gY2FyZHNcbiAgICBjb25zdCBzdWJzID0gc3ViRm9sZGVycyhmb2xkZXIpO1xuICAgIGlmIChzdWJzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2dyaWQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvai1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNmIG9mIHN1YnMpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVhZEZvbGRlclN0YXR1cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBzdGF0cyAgPSBmb2xkZXJTdGF0cyhzZik7XG4gICAgICAgIGNvbnN0IGNvdmVyICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgZGVlcGVyID0gc3ViRm9sZGVycyhzZikubGVuZ3RoID4gMDtcbiAgICAgICAgY29uc3QgY3VzdG9tSWNvbiA9IHJlYWRGb2xkZXJJY29uKHRoaXMuYXBwLCBzZik7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IHNncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLWNhcmQgd2Qtc3ViLWNhcmQgd2Qtcy0ke3N0YXR1c31gIH0pO1xuICAgICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gc3V0aWwgKHZlcnNcdTAwRTNvIG1lbm9yIHF1ZSBhcyBwYXN0YXMgZGUgdG9wbykgXHUyMDE0IEZhc2UgOS4xXG4gICAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0IHdkLWNvdmVyLXN1YlwiIH0pO1xuICAgICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBjdXN0b21JY29uID8/IFwiXHVEODNEXHVEQ0MxXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1iYWRnZSB3ZC1iYWRnZS0ke3N0YXR1c31gLCB0ZXh0OiBTVEFUVVNfSUNPTltzdGF0dXNdIH0pO1xuICAgICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIHNmKSk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgICAgaWYgKGN1c3RvbUljb24pIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvbiB3ZC1zdWItaWNvblwiIH0pLCBjdXN0b21JY29uKTtcbiAgICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgICAgaWYgKGRlZXBlcikgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3ViLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCB0ZXh0OiBzZi5uYW1lIH0pO1xuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSBsYWJlbC5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgICAgaWYgKHJ2LnRvdGFsID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhc2ApO1xuICAgICAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNhcmQuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgc2YpO1xuICAgICAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2YucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFycXVpdm9zIGRhIHBhc3RhIGF0dWFsIChub3RhcywgY2FudmFzLCBiYXNlcylcbiAgICBjb25zdCBub3RlcyA9IGZpbGVzSW4oZm9sZGVyKTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHBhbmVsLCBub3Rlcyk7XG5cbiAgICBpZiAoIXN1YnMubGVuZ3RoICYmICFub3Rlcy5sZW5ndGgpXG4gICAgICBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJQYXN0YSB2YXppYS5cIiB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBSZWxhdFx1MDBGM3Jpb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJSZXBvcnRzKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1JFUCkpIHJldHVybjtcblxuICAgIGNvbnN0IGRpciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiKTtcbiAgICBpZiAoIShkaXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChjb25zdCBjIG9mIGRpci5jaGlsZHJlbikge1xuICAgICAgaWYgKCEoYyBpbnN0YW5jZW9mIFRGaWxlKSB8fCBjLmV4dGVuc2lvbiAhPT0gXCJtZFwiKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpO1xuICAgICAgaWYgKGQpIGl0ZW1zLnB1c2goeyBmaWxlOiBjLCBkYXRlOiBkIH0pO1xuICAgIH1cbiAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiBiLmRhdGUubG9jYWxlQ29tcGFyZShhLmRhdGUpKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiUkVMQVRcdTAwRDNSSU9TIENMQVVERVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwicmVwb3J0c1wiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19SRVAsIFwiT2N1bHRhciBSZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBjb25zdCBsaXN0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1yZXBvcnQtbGlzdFwiIH0pO1xuICAgIGZvciAoY29uc3QgeyBmaWxlLCBkYXRlIH0gb2YgaXRlbXMuc2xpY2UoMCwgNikpIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRhdGUuc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcmVwb3J0LXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcmVwb3J0LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfS8ke3l9YCB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXJlcG9ydC1uYW1lXCIsIHRleHQ6IGZpbGUuYmFzZW5hbWUgfSk7XG4gICAgICByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgICAgIHZvaWQgeTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhdG1hcCAodmlhIHBsdWdpbiBIZWF0bWFwIENhbGVuZGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYXRtYXAocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfSEVBVCkpIHJldHVybjtcbiAgICBpZiAoUGxhdGZvcm0uaXNQaG9uZSkgcmV0dXJuOyAgIC8vIGhlYXRtYXAgKGFubyBpbnRlaXJvKSBvY3VsdGFkbyBubyBjZWx1bGFyXG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWhlYXQtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQVRJVklEQURFIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJoZWF0bWFwXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX0hFQVQsIFwiT2N1bHRhciBoZWF0bWFwXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBjb25zdCByZW5kZXIgPSBnZXRIZWF0bWFwUmVuZGVyZXIoKTtcbiAgICBpZiAoIXJlbmRlcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiAnQXRpdmUgbyBwbHVnaW4gXCJIZWF0bWFwIENhbGVuZGFyXCIgcGFyYSB2ZXIgYSBhdGl2aWRhZGUuJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3RhcyBjcmlhZGFzIHBvciBkaWEsIG5vIGFubyBjb3JyZW50ZS5cbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGNvdW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShmLnN0YXQuY3RpbWUpO1xuICAgICAgaWYgKGQuZ2V0RnVsbFllYXIoKSAhPT0geWVhcikgY29udGludWU7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvdW50c1trZXldID0gKGNvdW50c1trZXldID8/IDApICsgMTtcbiAgICB9XG4gICAgY29uc3QgZW50cmllczogSGVhdG1hcEVudHJ5W10gPSBPYmplY3QuZW50cmllcyhjb3VudHMpLm1hcCgoW2RhdGUsIG5dKSA9PiAoe1xuICAgICAgZGF0ZSwgaW50ZW5zaXR5OiBuLCBjb2xvcjogXCJncmVlblwiLCBjb250ZW50OiBgJHtufSBub3RhKHMpYCxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYXQtYm94XCIgfSk7XG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlcihib3gsIHtcbiAgICAgICAgeWVhcixcbiAgICAgICAgY29sb3JzOiB7IGdyZWVuOiBbXCIjMWUzYTJmXCIsIFwiIzFmNmY0M1wiLCBcIiMyYmE4NWFcIiwgXCIjMzlkMzUzXCJdIH0sXG4gICAgICAgIHNob3dDdXJyZW50RGF5Qm9yZGVyOiB0cnVlLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZWMuZW1wdHkoKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJGYWxoYSBhbyByZW5kZXJpemFyIG8gaGVhdG1hcC5cIiB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRXN0YXRcdTAwRURzdGljYXMgZG8gY29mcmUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJTdGF0cyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19TVEFUKSkgcmV0dXJuO1xuXG4gICAgbGV0IHRvdGFsTm90ZXMgPSAwLCB0b3RhbFJldmlld2VkID0gMCwgY3JlYXRlZFRoaXNXZWVrID0gMDtcbiAgICBjb25zdCB3ZWVrQWdvID0gRGF0ZS5ub3coKSAtIDcgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGNvbnRpbnVlO1xuICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgaWYgKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlKSB0b3RhbFJldmlld2VkKys7XG4gICAgICBpZiAoZi5zdGF0LmN0aW1lID49IHdlZWtBZ28pIGNyZWF0ZWRUaGlzV2VlaysrO1xuICAgIH1cbiAgICBjb25zdCBnbG9iYWxQY3QgPSB0b3RhbE5vdGVzID4gMCA/IE1hdGgucm91bmQodG90YWxSZXZpZXdlZCAvIHRvdGFsTm90ZXMgKiAxMDApIDogMDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkVTVEFUXHUwMENEU1RJQ0FTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJzdGF0c1wiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19TVEFULCBcIk9jdWx0YXIgZXN0YXRcdTAwRURzdGljYXNcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIC8vIE5cdTAwRkFtZXJvcyBnbG9iYWlzXG4gICAgY29uc3QgZ2xvYiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1nbG9iYWxcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWdcIiwgdGV4dDogU3RyaW5nKHRvdGFsTm90ZXMpIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcIm5vdGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnIHdkLXN0YXQtcmV2LW51bVwiLCB0ZXh0OiBgJHtnbG9iYWxQY3R9JWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwicmV2aXNhZGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtd2Vla1wiLCB0ZXh0OiBgKyR7Y3JlYXRlZFRoaXNXZWVrfWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwiZXN0YSBzZW1hbmFcIiB9KTtcblxuICAgIC8vIEJyZWFrZG93biBwb3IgcGFzdGFcbiAgICBjb25zdCB0YWJsZSA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC10YWJsZVwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcblxuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG4gICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBpZiAocnYudG90YWwgPT09IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBwY3QgPSBNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke3J2LnRvdGFsfWAgfSk7XG5cbiAgICAgIGNvbnN0IGJhcldyYXAgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyXCIgfSk7XG4gICAgICBiYXJXcmFwLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJsaXN0XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNhcmQgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gcG9yIHRpcG8gZGUgYXJxdWl2byAobm90YSAvIGNhbnZhcyAvIGJhc2UpIFx1MjAxNCBGYXNlIDkuMlxuICAgICAgICBjb25zdCBjb3YgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY292ZXIgd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24oY292LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1jb3Zlci1nbHlwaFwiIH0pLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcblxuICAgICAgICBpZiAoaXNNZCkgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjYXJkLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1yb3cgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IHRpID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLXR5cGVpY29uIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKHRpLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS1kb3Qgd2QtYmFkZ2UtJHtzdH1gIH0pO1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR3JcdTAwRTFmaWNvIGRlIGNyZXNjaW1lbnRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyR3Jvd3RoKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0dST1cpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDUkVTQ0lNRU5UTyBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgYnRuRGF5ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiZGlhXCIgfSk7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5vdGFzIGNyaWFkYXMgcG9yIGRpYVwiKTtcbiAgICBidG5EYXkub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gdHJ1ZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJncm93dGhcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfR1JPVywgXCJPY3VsdGFyIGNyZXNjaW1lbnRvXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICAvLyBBZ3J1cGEgbm90YXMgcG9yIGRhdGEgZGUgY3JpYVx1MDBFN1x1MDBFM29cbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShuZXcgRGF0ZShmLnN0YXQuY3RpbWUpKTtcbiAgICAgIGNvdW50c1trZXldID0gKGNvdW50c1trZXldID8/IDApICsgMTtcbiAgICB9XG5cbiAgICAvLyBcdTAwREFsdGltb3MgTiBkaWFzIChtZW5vcyBubyBjZWx1bGFyKVxuICAgIGNvbnN0IERBWVMgPSBQbGF0Zm9ybS5pc1Bob25lID8gMTUgOiAzMDtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCBjb3VudDogY291bnRzW2tleV0gPz8gMCwgbGFiZWw6IGAke2RheX0vJHttfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWwgPSBkYXlzLnJlZHVjZSgocywgZCkgPT4gcyArIGQuY291bnQsIDApO1xuICAgIGNvbnN0IHRvZGF5S2V5ID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBNb2RvIGN1bXVsYXRpdm86IHNvbWEgYWN1bXVsYWRhIGRpYSBhIGRpYVxuICAgIHR5cGUgRGF5RW50cnkgPSB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nOyBkaXNwbGF5VmFsOiBudW1iZXIgfTtcbiAgICBsZXQgZW50cmllczogRGF5RW50cnlbXTtcbiAgICBpZiAodGhpcy5ncm93dGhDdW11bGF0aXZlKSB7XG4gICAgICBsZXQgYWNjID0gMDtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+IHsgYWNjICs9IGQuY291bnQ7IHJldHVybiB7IC4uLmQsIGRpc3BsYXlWYWw6IGFjYyB9OyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4gKHsgLi4uZCwgZGlzcGxheVZhbDogZC5jb3VudCB9KSk7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmVudHJpZXMubWFwKGUgPT4gZS5kaXNwbGF5VmFsKSwgMSk7XG5cbiAgICAvLyBMaW5oYSBkZSByZXN1bW9cbiAgICBjb25zdCBpbmZvID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtaW5mb1wiIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtdG90YWxcIiwgdGV4dDogYCR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZW50cmllc1tlbnRyaWVzLmxlbmd0aCAtIDFdLmRpc3BsYXlWYWwgOiB0b3RhbH1gIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtcGVyaW9kXCIsIHRleHQ6IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGBub3RhcyBhY3VtdWxhZGFzICgke0RBWVN9IGRpYXMpYCA6IGBub3RhcyBjcmlhZGFzIG5vcyBcdTAwRkFsdGltb3MgJHtEQVlTfSBkaWFzYCB9KTtcblxuICAgIC8vIEdyXHUwMEUxZmljbyBkZSBiYXJyYXNcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZW50cmllcy5mb3JFYWNoKCh7IGtleSwgY291bnQsIGxhYmVsLCBkaXNwbGF5VmFsIH0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY29sID0gY2hhcnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jb2xcIiArIChrZXkgPT09IHRvZGF5S2V5ID8gXCIgd2QtZ3Jvd3RoLXRvZGF5XCIgOiBcIlwiKSB9KTtcbiAgICAgIGNvbnN0IGJhckFyZWEgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXItYXJlYVwiIH0pO1xuICAgICAgY29uc3QgaXNFbXB0eSA9IGRpc3BsYXlWYWwgPT09IDA7XG4gICAgICBjb25zdCBiYXIgPSBiYXJBcmVhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyXCIgKyAoaXNFbXB0eSA/IFwiIHdkLWdyb3d0aC1iYXItemVyb1wiIDogXCJcIikgfSk7XG4gICAgICBiYXIuc3R5bGUuaGVpZ2h0ID0gaXNFbXB0eSA/IFwiM3B4XCIgOiBgJHtNYXRoLm1heCg1LCBNYXRoLnJvdW5kKChkaXNwbGF5VmFsIC8gbWF4KSAqIDEwMCkpfSVgO1xuICAgICAgaWYgKCFpc0VtcHR5KSBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xhYmVsfTogJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBkaXNwbGF5VmFsICsgXCIgdG90YWxcIiA6IGNvdW50ICsgXCIgbm90YShzKVwifWApO1xuXG4gICAgICBjb25zdCBzaG93TGJsID0gaWR4ID09PSAwIHx8IGlkeCA9PT0gNyB8fCBpZHggPT09IDE0IHx8IGlkeCA9PT0gMjEgfHwgaWR4ID09PSAyOSB8fCBrZXkgPT09IHRvZGF5S2V5O1xuICAgICAgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtbGJsXCIsIHRleHQ6IHNob3dMYmwgPyBsYWJlbCA6IFwiXCIgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCAoRmFzZSA4LjEgXHUyMDE0IGxlaXR1cmEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgLy8gVG9nZ2xlIGRlIGphbmVsYSBcInByXHUwMEYzeGltb3MgZGlhc1wiICgzIC8gNykuXG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICAgIGNvbnN0IHNlZyA9IGN0cmxzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJhbmdlXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgWzMsIDddIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGIgPSBzZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJhbmdlLWJ0blwiICsgKHJhbmdlID09PSBuID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBgJHtufWRgIH0pO1xuICAgICAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCBgTW9zdHJhciBvcyBwclx1MDBGM3hpbW9zICR7bn0gZGlhc2ApO1xuICAgICAgICBiLm9uY2xpY2sgPSBhc3luYyBlID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IG47XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gQm90XHUwMEUzbyBkZSBmaWx0cm9zIChwcm9qZXRvL2V0aXF1ZXRhKS5cbiAgICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICAgIGNvbnN0IG5GID0gZi5wcm9qZWN0cy5sZW5ndGggKyBmLmxhYmVscy5sZW5ndGg7XG4gICAgICBjb25zdCBmaWx0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJ0blwiICsgKHRoaXMudG9kb2lzdEZpbHRlck9wZW4gPyBcIiB3ZC1vblwiIDogXCJcIikgKyAobkYgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihmaWx0LCBcImZpbHRlclwiKTtcbiAgICAgIGZpbHQuc2V0QXR0cihcInRpdGxlXCIsIG5GID8gYEZpbHRyb3MgYXRpdm9zICgke25GfSkgXHUyMDE0IGNsaXF1ZSBwYXJhIGFqdXN0YXJgIDogXCJGaWx0cmFyIHBvciBwcm9qZXRvL2V0aXF1ZXRhXCIpO1xuICAgICAgaWYgKG5GKSBmaWx0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0Y3RcIiwgdGV4dDogU3RyaW5nKG5GKSB9KTtcbiAgICAgIGZpbHQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnRvZG9pc3RGaWx0ZXJPcGVuID0gIXRoaXMudG9kb2lzdEZpbHRlck9wZW47IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMudG9kb2lzdExvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgdGFyZWZhcyBkbyBUb2RvaXN0XCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFRvZG9pc3QodHJ1ZSk7IH07XG5cbiAgICAgIHRoaXMuYWRkVGFza0J0bihjdHJscywgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIH1cbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJ0b2RvaXN0XCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX1RPRE8sIFwiT2N1bHRhciB0YXJlZmFzXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29sZSBzZXUgdG9rZW4gZG8gVG9kb2lzdCBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIHBhcmEgdmVyIHN1YXMgdGFyZWZhcyBhcXVpLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFByaW1laXJhIGNhcmdhIHByZWd1aVx1MDBFN29zYSAoblx1MDBFM28gcmVmYXogZW0gbG9vcCBzZSBqXHUwMEUxIGJ1c2NvdSBvdSBzZSBkZXUgZXJybykuXG4gICAgaWYgKCF0aGlzLnRvZG9pc3RGZXRjaGVkQXQgJiYgIXRoaXMudG9kb2lzdExvYWRpbmcgJiYgIXRoaXMudG9kb2lzdEVycm9yKSB2b2lkIHRoaXMuZmV0Y2hUb2RvaXN0KGZhbHNlKTtcblxuICAgIGlmICh0aGlzLnRvZG9pc3RFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMudG9kb2lzdEVycm9yfWAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy50b2RvaXN0RmV0Y2hlZEF0KSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ2FycmVnYW5kbyB0YXJlZmFzXHUyMDI2XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQmFycmEgZGUgZmlsdHJvcyAocmVjb2xoXHUwMEVEdmVsKS5cbiAgICBpZiAodGhpcy50b2RvaXN0RmlsdGVyT3BlbikgdGhpcy5yZW5kZXJUb2RvRmlsdGVyQmFyKHNlYyk7XG5cbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICBjb25zdCB0b2RheUsgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBsYXN0VXBjb21pbmcgPSBuZXcgRGF0ZSgpO1xuICAgIGxhc3RVcGNvbWluZy5zZXREYXRlKGxhc3RVcGNvbWluZy5nZXREYXRlKCkgKyByYW5nZSk7XG4gICAgY29uc3QgbGFzdEsgPSB0b0tleShsYXN0VXBjb21pbmcpOyAgIC8vIGxpbWl0ZSBkb3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiAoaW5jbHVzaXZlKVxuXG4gICAgLy8gQXBsaWNhIGZpbHRyb3MgZSBzZXBhcmEgZW0gYmFsZGVzOiBhdHJhc2FkYXMgXHUwMEI3IGhvamUgXHUwMEI3IHByXHUwMEYzeGltb3MgTiBkaWFzIFx1MDBCNyBkZXBvaXMuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmFwcGx5VG9kb2lzdEZpbHRlcnModGhpcy50b2RvaXN0VGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgY29udGludWU7ICAgLy8gc2VtIGRhdGE6IGZvcmEgZG9zIGJsb2NvcyBwb3IgZGlhIChwb2Rlclx1MDBFMSB2aXJhciBcIkNhaXhhIGRlIGVudHJhZGFcIiBubyBmdXR1cm8pXG4gICAgICBpZiAoZGsgPCB0b2RheUspIG92ZXJkdWUucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrID09PSB0b2RheUspIHRvZGF5VGFza3MucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrIDw9IGxhc3RLKSAoYnlEYXlbZGtdID8/PSBbXSkucHVzaCh0KTtcbiAgICAgIGVsc2UgbGF0ZXIucHVzaCh0KTtcbiAgICB9XG4gICAgY29uc3QgYnlQcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICBvdmVyZHVlLnNvcnQoYnlQcmkpOyB0b2RheVRhc2tzLnNvcnQoYnlQcmkpOyBsYXRlci5zb3J0KGJ5UHJpKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoYnlEYXkpKSBieURheVtrXS5zb3J0KGJ5UHJpKTtcblxuICAgIGNvbnN0IHZpc2libGUgPSBvdmVyZHVlLmxlbmd0aCArIHRvZGF5VGFza3MubGVuZ3RoICsgbGF0ZXIubGVuZ3RoICsgT2JqZWN0LnZhbHVlcyhieURheSkucmVkdWNlKChzLCBhKSA9PiBzICsgYS5sZW5ndGgsIDApO1xuICAgIGlmICh2aXNpYmxlID09PSAwKSB7XG4gICAgICBjb25zdCBhbGwgPSB0aGlzLnRvZG9pc3RUYXNrcy5sZW5ndGg7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IGFsbCA/IFwiTmVuaHVtYSB0YXJlZmEgYmF0ZSBjb20gb3MgZmlsdHJvcy5cIiA6IFwiTmVuaHVtYSB0YXJlZmEgY29tIGRhdGEgbm8gVG9kb2lzdC4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGluaGEgaG9yaXpvbnRhbCBjb20gMyBjYWl4YXMgbGFkbyBhIGxhZG86IEF0cmFzYWRhcyBcdTAwQjcgSG9qZSBcdTAwQjcgUHJcdTAwRjN4aW1vcyBOIGRpYXMuXG4gICAgY29uc3QgY29scyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1jb2xzXCIgfSk7XG5cbiAgICAvLyAxXHUwMEFBIFx1MjAxNCBBdHJhc2FkYXMgKGNhaXhhIHZlcm1lbGhhKS5cbiAgICBjb25zdCBvYm94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LW92ZXJkdWVcIiB9KTtcbiAgICBjb25zdCBvaGQgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3h3YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkF0cmFzYWRhc1wiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKG92ZXJkdWUubGVuZ3RoKSB9KTtcbiAgICBjb25zdCBvYm9keSA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIG92ZXJkdWUpIHRoaXMudG9kb1JvdyhvYm9keSwgdCk7XG4gICAgZWxzZSBvYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEuIFx1RDgzRFx1REM0RFwiIH0pO1xuXG4gICAgLy8gMlx1MDBBQSBcdTIwMTQgSG9qZSAoY2FpeGEgZW0gZGVzdGFxdWUpLlxuICAgIGNvbnN0IHRib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdG9kYXlcIiB9KTtcbiAgICBjb25zdCB0aGQgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkhvamVcIiB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odGhkLCBcImhvamVcIiwgXCJOb3ZhIHRhcmVmYSBwYXJhIGhvamVcIik7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodG9kYXlUYXNrcy5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IHRib2R5ID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHRvZGF5VGFza3MubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2YgdG9kYXlUYXNrcykgdGhpcy50b2RvUm93KHRib2R5LCB0KTtcbiAgICBlbHNlIHRib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmFkYSBwYXJhIGhvamUuXCIgfSk7XG5cbiAgICAvLyAzXHUwMEFBIFx1MjAxNCBQclx1MDBGM3hpbW9zIE4gZGlhcyAoYWdydXBhZG8gcG9yIGRpYSwgY29tIHN1Yi10XHUwMEVEdHVsbyBzXHUwMEYzIG5vcyBkaWFzIHF1ZSB0XHUwMEVBbSB0YXJlZmEpLlxuICAgIGxldCB1cGNvbWluZ0NvdW50ID0gMDtcbiAgICBjb25zdCB1cERheXM6IHsgZG93OiBudW1iZXI7IG51bTogbnVtYmVyOyBrZXk6IHN0cmluZzsgaXRlbXM6IFRvZG9pc3RUYXNrW10gfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmFuZ2U7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV07XG4gICAgICBpZiAoIWl0ZW1zPy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgdXBjb21pbmdDb3VudCArPSBpdGVtcy5sZW5ndGg7XG4gICAgICB1cERheXMucHVzaCh7IGRvdzogKGRheS5nZXREYXkoKSArIDYpICUgNywgbnVtOiBkYXkuZ2V0RGF0ZSgpLCBrZXksIGl0ZW1zIH0pO1xuICAgIH1cbiAgICBjb25zdCB1Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXVwY29taW5nXCIgfSk7XG4gICAgY29uc3QgdWhkID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogYFByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhc2AgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHVoZCwgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHVwY29taW5nQ291bnQpIH0pO1xuICAgIGNvbnN0IHVib2R5ID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHVwRGF5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgZyBvZiB1cERheXMpIHtcbiAgICAgICAgY29uc3QgZGggPSB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1kYXloZFwiICsgKGcuZG93ID49IDUgPyBcIiB3ZC13ZWVrZW5kXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2cuZG93XSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW51bVwiLCB0ZXh0OiBTdHJpbmcoZy5udW0pIH0pO1xuICAgICAgICB0aGlzLmFkZFRhc2tCdG4oZGgsIGcua2V5LCBgTm92YSB0YXJlZmEgZW0gJHtnLm51bX1gKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGcuaXRlbXMpIHRoaXMudG9kb1Jvdyh1Ym9keSwgdCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBgTmFkYSBub3MgcHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzLmAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVwb2lzICg+IE4gZGlhcyBcdTAwRTAgZnJlbnRlOyByZWNvbGhcdTAwRUR2ZWwsIGFiYWl4byBkYSBsaW5oYSwgZmVjaGFkbyBwb3IgcGFkclx1MDBFM28pLlxuICAgIGlmIChsYXRlci5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyXCIgfSk7XG4gICAgICBjb25zdCBsaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBEZXBvaXMgKCR7bGF0ZXIubGVuZ3RofSlgIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMudG9kb2lzdExhdGVyT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnRvZG9pc3RMYXRlck9wZW4gPSAhdGhpcy50b2RvaXN0TGF0ZXJPcGVuOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgaWYgKHRoaXMudG9kb2lzdExhdGVyT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGxhdGVyKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSmFuZWxhIGRlIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgc2FuZWFkYSAoMyBvdSA3KS5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgLy8gTWFudFx1MDBFOW0gc1x1MDBGMyBhcyB0YXJlZmFzIHF1ZSBiYXRlbSBjb20gb3MgZmlsdHJvcyBhdGl2b3MgKHByb2pldG8gRSBldGlxdWV0YSkuXG4gIHByaXZhdGUgYXBwbHlUb2RvaXN0RmlsdGVycyh0YXNrczogVG9kb2lzdFRhc2tbXSk6IFRvZG9pc3RUYXNrW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBpZiAoIWYucHJvamVjdHMubGVuZ3RoICYmICFmLmxhYmVscy5sZW5ndGgpIHJldHVybiB0YXNrcztcbiAgICBjb25zdCBwcyA9IG5ldyBTZXQoZi5wcm9qZWN0cyksIGxzID0gbmV3IFNldChmLmxhYmVscyk7XG4gICAgcmV0dXJuIHRhc2tzLmZpbHRlcih0ID0+IHtcbiAgICAgIGlmIChwcy5zaXplICYmICEodC5wcm9qZWN0X2lkICYmIHBzLmhhcyh0LnByb2plY3RfaWQpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGxzLnNpemUgJiYgISh0LmxhYmVscyA/PyBbXSkuc29tZShsID0+IGxzLmhhcyhsKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVUb2RvRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgLy8gQmFycmEgZGUgZmlsdHJvczogY2hpcHMgZGUgcHJvamV0byBlIGRlIGV0aXF1ZXRhICh0b2dnbGUpLCArIGxpbXBhci5cbiAgcHJpdmF0ZSByZW5kZXJUb2RvRmlsdGVyQmFyKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgY29uc3QgYmFyID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJhclwiIH0pO1xuXG4gICAgaWYgKHRoaXMudG9kb2lzdFByb2plY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJQcm9qZXRvc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMudG9kb2lzdFByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5wcm9qZWN0cy5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogcC5uYW1lIH0pO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlVG9kb0ZpbHRlcihcInByb2plY3RzXCIsIHAuaWQpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldCh0aGlzLnRvZG9pc3RUYXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBpZiAobGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsYWJlbHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IHRoaXMubGFiZWxDaGlwKGdycCwgbCwgXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikpO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlVG9kb0ZpbHRlcihcImxhYmVsc1wiLCBsKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xyID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2xlYXJcIiwgdGV4dDogXCJsaW1wYXIgZmlsdHJvc1wiIH0pO1xuICAgICAgY2xyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IGYucHJvamVjdHMgPSBbXTsgZi5sYWJlbHMgPSBbXTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2tib3ggZGUgY29uY2x1c1x1MDBFM28gKEZhc2UgOC4yKSBcdTIwMTQgY29uY2x1aSBubyBUb2RvaXN0IHJlYWwgYW8gY2xpY2FyLlxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNoZWNrLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KTsgfTtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgZGEgdGFyZWZhOiB0XHUwMEVEdHVsbyBjb21wbGV0byArIGRlc2NyaVx1MDBFN1x1MDBFM28gKGluc3RydVx1MDBFN1x1MDBGNWVzKSwgbm8gaG92ZXIuXG4gIHByaXZhdGUgc2hvd1Rhc2tUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXRhc2stdGlwXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC1wcmlcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpTWV0YSh0LnByaW9yaXR5KS5jb2xvcjtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtdGl0bGVcIiwgdGV4dDogdC5jb250ZW50IH0pO1xuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBkID0gdC5kZXNjcmlwdGlvbiEudHJpbSgpO1xuICAgICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1kZXNjXCIsIHRleHQ6IGQubGVuZ3RoID4gREVTQ19NQVggPyBkLnNsaWNlKDAsIERFU0NfTUFYKSArIFwiXHUyMDI2XCIgOiBkIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGFza1RpcChlbDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGFza1RpcChlbCwgdCkpO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIExpbmhhIGRlIHRhcmVmYSAodXNhZGEgbmFzIDMgY2FpeGFzOiBhdHJhc2FkYXMsIGhvamUsIHByXHUwMEYzeGltb3MgZSBlbSBcImRlcG9pc1wiKS5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KTtcbiAgICB0aGlzLmF0dGFjaFRhc2tUaXAocm93LCB0KTtcbiAgfVxuXG4gIC8vIEJvdFx1MDBFM28gXCIrXCIgZGUgY3JpYXIgdGFyZWZhIChoZWFkZXIgZGEgc2VcdTAwRTdcdTAwRTNvLCBjYWl4YXMgZSBzdWItdFx1MDBFRHR1bG9zIGRlIGRpYSkuXG4gIHByaXZhdGUgYWRkVGFza0J0bihob3N0OiBIVE1MRWxlbWVudCwgcHJlZmlsbER1ZT86IHN0cmluZywgdGl0bGUgPSBcIk5vdmEgdGFyZWZhXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYWRkXCIgfSk7XG4gICAgc2V0SWNvbihiLCBcInBsdXNcIik7XG4gICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgIGIub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH07XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBBYnJlIG8gZm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgb3UgZWRpdGFyKS5cbiAgcHJpdmF0ZSBvcGVuVGFza0Zvcm0ob3B0czogeyBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7IHRhc2s/OiBUb2RvaXN0VGFzazsgcHJlZmlsbER1ZT86IHN0cmluZyB9KSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLnRoaXMudG9kb2lzdExhYmVsQ29sb3Iua2V5cygpLCAuLi50aGlzLnRvZG9pc3RUYXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgbmV3IFRhc2tGb3JtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgIG1vZGU6IG9wdHMubW9kZSxcbiAgICAgIHRhc2s6IG9wdHMudGFzayxcbiAgICAgIHByZWZpbGxEdWU6IG9wdHMucHJlZmlsbER1ZSxcbiAgICAgIHByb2plY3RzOiB0aGlzLnRvZG9pc3RQcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICAvLyBBYnJlIG8gcG9wLXVwIGRlIGRldGFsaGVzIChzXHUwMEYzIGxlaXR1cmEpOyBvIGJvdFx1MDBFM28gXCJFZGl0YXJcIiBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvLlxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcywge1xuICAgICAgdGFzazogdCxcbiAgICAgIHByb2plY3ROYW1lOiB0LnByb2plY3RfaWQgPyB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgLy8gQ3JpYSBvdSBlZGl0YSBubyBUb2RvaXN0IHJlYWwuIE5vIGVkaXRhciBtYW5kYSBzXHUwMEYzIG9zIGNhbXBvcyBhbHRlcmFkb3MgKHByZXNlcnZhXG4gIC8vIHJlY29yclx1MDBFQW5jaWEgc2UgYSBkYXRhIG5cdTAwRTNvIG11ZG91KSBlIHRyb2NhIGRlIHByb2pldG8gdmlhIC9tb3ZlLiBSZXRvcm5hIHRydWUgc2UgT0suXG4gIHByaXZhdGUgYXN5bmMgc3VibWl0VGFza0Zvcm0obW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiLCB0YXNrOiBUb2RvaXN0VGFzayB8IHVuZGVmaW5lZCwgdjogVGFza0Zvcm1WYWx1ZXMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAobW9kZSA9PT0gXCJjcmVhdGVcIikge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdi5jb250ZW50LCBwcmlvcml0eTogdi5wcmlvcml0eSB9O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbi50cmltKCkpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb24udHJpbSgpO1xuICAgICAgICBpZiAodi5kdWVTdHJpbmcudHJpbSgpKSB7IGZpZWxkcy5kdWVfc3RyaW5nID0gdi5kdWVTdHJpbmcudHJpbSgpOyBmaWVsZHMuZHVlX2xhbmcgPSBcInB0XCI7IH1cbiAgICAgICAgaWYgKHYucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHYucHJvamVjdElkO1xuICAgICAgICBpZiAodi5sYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ3JpYWRhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH0gZWxzZSBpZiAodGFzaykge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHt9O1xuICAgICAgICBpZiAodi5jb250ZW50ICE9PSB0YXNrLmNvbnRlbnQpIGZpZWxkcy5jb250ZW50ID0gdi5jb250ZW50O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAhPT0gKHRhc2suZGVzY3JpcHRpb24gPz8gXCJcIikpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb247XG4gICAgICAgIGlmICh2LnByaW9yaXR5ICE9PSB0YXNrLnByaW9yaXR5KSBmaWVsZHMucHJpb3JpdHkgPSB2LnByaW9yaXR5O1xuICAgICAgICBjb25zdCBvbGREdWUgPSB0YXNrLmR1ZT8uc3RyaW5nID8/IHRhc2suZHVlPy5kYXRlID8/IFwiXCI7XG4gICAgICAgIGlmICh2LmR1ZVN0cmluZy50cmltKCkgIT09IG9sZER1ZSkge1xuICAgICAgICAgIGZpZWxkcy5kdWVfc3RyaW5nID0gdi5kdWVTdHJpbmcudHJpbSgpIHx8IFwibm8gZGF0ZVwiO1xuICAgICAgICAgIGlmICh2LmR1ZVN0cmluZy50cmltKCkpIGZpZWxkcy5kdWVfbGFuZyA9IFwicHRcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMID0gKHRhc2subGFiZWxzID8/IFtdKS5zbGljZSgpLnNvcnQoKS5qb2luKFwiXHUwMDAwXCIpO1xuICAgICAgICBjb25zdCBuZXdMID0gdi5sYWJlbHMuc2xpY2UoKS5zb3J0KCkuam9pbihcIlx1MDAwMFwiKTtcbiAgICAgICAgaWYgKG9sZEwgIT09IG5ld0wpIGZpZWxkcy5sYWJlbHMgPSB2LmxhYmVscztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGZpZWxkcykubGVuZ3RoKSBhd2FpdCB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbiwgdGFzay5pZCwgZmllbGRzKTtcbiAgICAgICAgY29uc3Qgb2xkUHJvaiA9IHRhc2sucHJvamVjdF9pZCA/PyBcIlwiO1xuICAgICAgICBpZiAodi5wcm9qZWN0SWQgIT09IG9sZFByb2ogJiYgdi5wcm9qZWN0SWQpIGF3YWl0IG1vdmVUb2RvaXN0VGFzayh0b2tlbiwgdGFzay5pZCwgdi5wcm9qZWN0SWQpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgU2FsdmE6ICR7di5jb250ZW50fWApO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5mZXRjaFRvZG9pc3QodHJ1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBzYWx2YXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEV4Y2x1aSBhIHRhcmVmYSAob3RpbWlzdGEpIG5vIFRvZG9pc3QgcmVhbC4gUmV0b3JuYSB0cnVlIHNlIE9LLlxuICBwcml2YXRlIGFzeW5jIGRlbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudG9kb2lzdFRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgbmV3IE5vdGljZShgXHVEODNEXHVEREQxIEV4Y2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRvZG9pc3RUYXNrcy5zcGxpY2UoaWR4LCAwLCB0KTsgICAvLyByZXZlcnRlXG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBleGNsdWlyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29uY2x1aSBhIHRhcmVmYSBkZSBmb3JtYSBvdGltaXN0YTogcmVtb3ZlIGRhIGxpc3RhIGUgcmUtcmVuZGVyaXphOyBzZSBhIEFQSVxuICAvLyBmYWxoYXIsIHJlc3RhdXJhIGUgYXZpc2EuIEEgZXNjcml0YSByZWZsZXRlIG5vIFRvZG9pc3QgcmVhbCAoRmFzZSA4LjIpLlxuICBwcml2YXRlIGFzeW5jIGNvbXBsZXRlVGFzayh0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gdGhpcy50b2RvaXN0VGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRvZG9pc3RUYXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjbG9zZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRvZG9pc3RUYXNrcy5zcGxpY2UoaWR4LCAwLCB0KTsgICAvLyByZXZlcnRlXG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBjb25jbHVpcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJ1c2NhIHRhcmVmYXM7IGBtYW51YWxgIG1vc3RyYSBvIHNwaW5uZXIgaW1lZGlhdGFtZW50ZS5cbiAgcHJpdmF0ZSBhc3luYyBmZXRjaFRvZG9pc3QobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4gfHwgdGhpcy50b2RvaXN0TG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMudG9kb2lzdExvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMudG9kb2lzdEVycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICAvLyBQcm9qZXRvcy9ldGlxdWV0YXMgc1x1MDBFM28gYXV4aWxpYXJlczsgc2UgZmFsaGFyZW0sIG5cdTAwRTNvIGRlcnJ1YmFtIGFzIHRhcmVmYXMuXG4gICAgICBjb25zdCBbdGFza3MsIHByb2plY3RzLCBsYWJlbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbiksXG4gICAgICAgIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0UHJvamVjdFtdKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuKS5jYXRjaCgoKSA9PiBbXSBhcyBUb2RvaXN0TGFiZWxbXSksXG4gICAgICBdKTtcbiAgICAgIHRoaXMudG9kb2lzdFRhc2tzID0gdGFza3M7XG4gICAgICB0aGlzLnRvZG9pc3RQcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgdGhpcy50b2RvaXN0UHJvamVjdE1hcCA9IG5ldyBNYXAocHJvamVjdHMubWFwKHAgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMudG9kb2lzdExhYmVsQ29sb3IgPSBuZXcgTWFwKGxhYmVscy5tYXAobCA9PiBbbC5uYW1lLCBUT0RPSVNUX0NPTE9SU1tsLmNvbG9yXSA/PyBMQUJFTF9GQUxMQkFDS10pKTtcbiAgICAgIHRoaXMudG9kb2lzdEZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy50b2RvaXN0RXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMudG9kb2lzdExvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVzZXRhIG8gZXN0YWRvIChleC46IHRva2VuIGFsdGVyYWRvIG5hcyBjb25maWd1cmFcdTAwRTdcdTAwRjVlcykgZSByZS1yZW5kZXJpemEuXG4gIHJlc2V0VG9kb2lzdCgpIHtcbiAgICB0aGlzLnRvZG9pc3RUYXNrcyA9IFtdO1xuICAgIHRoaXMudG9kb2lzdFByb2plY3RzID0gW107XG4gICAgdGhpcy50b2RvaXN0UHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnRvZG9pc3RMYWJlbENvbG9yID0gbmV3IE1hcCgpO1xuICAgIHRoaXMudG9kb2lzdEZldGNoZWRBdCA9IDA7XG4gICAgdGhpcy50b2RvaXN0RXJyb3IgPSBudWxsO1xuICAgIHRoaXMudG9kb2lzdExvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8gQ29yIChoZXgpIGRlIHVtYSBldGlxdWV0YSBwZWxvIG5vbWU7IGNpbnphIHNlIGRlc2NvbmhlY2lkYS5cbiAgcHJpdmF0ZSBsYWJlbENvbG9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudG9kb2lzdExhYmVsQ29sb3IuZ2V0KG5hbWUpID8/IExBQkVMX0ZBTExCQUNLO1xuICB9XG5cbiAgLy8gQ3JpYSB1bSBjaGlwIGRlIGV0aXF1ZXRhIGNvbSBib2xpbmhhIGNvbG9yaWRhICsgXCJAbm9tZVwiLlxuICBwcml2YXRlIGxhYmVsQ2hpcChob3N0OiBIVE1MRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjbHM6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBjaGlwID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzIH0pO1xuICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5sYWJlbENvbG9yKG5hbWUpO1xuICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtuYW1lfWAgfSk7XG4gICAgcmV0dXJuIGNoaXA7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhZGVyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiU2Vjb25kIEJyYWluXCIgfSk7XG5cbiAgICBjb25zdCB0b2dnbGUgPSBoLmNyZWF0ZVNwYW4oe1xuICAgICAgY2xzOiBcIndkLWNvbXBhY3QtdG9nZ2xlXCIsXG4gICAgICB0ZXh0OiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID8gXCJcdTI1QTYgY29tcGFjdG9cIiA6IFwiXHUyNUE0IGNvbmZvcnRcdTAwRTF2ZWxcIixcbiAgICB9KTtcbiAgICB0b2dnbGUuc2V0QXR0cihcInRpdGxlXCIsIFwiQWx0ZXJuYXIgbW9kbyBjb21wYWN0b1wiKTtcbiAgICB0b2dnbGUub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QgPSAhdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdDtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9O1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQbHVnaW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlcnVzRGFzaGJvYXJkIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IERhc2hTZXR0aW5ncyA9IERFRkFVTFRfU0VUVElOR1M7XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFLCBsZWFmID0+IG5ldyBEYXNoYm9hcmRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsYXlvdXQtZGFzaGJvYXJkXCIsIFwiQWJyaXIgV2VydXMgRGFzaGJvYXJkXCIsICgpID0+IHRoaXMub3BlbigpKTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLWRhc2hib2FyZFwiLCBuYW1lOiBcIkFicmlyIERhc2hib2FyZFwiLCBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuKCkgfSk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBXZXJ1c1NldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcbiAgfVxuXG4gIC8vIFJlLWJ1c2NhIG8gVG9kb2lzdCBlbSB0b2RhcyBhcyBkYXNoYm9hcmRzIGFiZXJ0YXMgKGV4LjogYXBcdTAwRjNzIG11ZGFyIG8gdG9rZW4pLlxuICByZWZyZXNoRGFzaGJvYXJkcygpIHtcbiAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEUpKSB7XG4gICAgICBjb25zdCB2ID0gbGVhZi52aWV3O1xuICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEYXNoYm9hcmRWaWV3KSB2LnJlc2V0VG9kb2lzdCgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgICAvLyBTYW5lYW1lbnRvOiBzZWN0aW9uT3JkZXIgY29tIGV4YXRhbWVudGUgYXMgc2VcdTAwRTdcdTAwRjVlcyB2XHUwMEUxbGlkYXMsIHNlbSBkdXBsaWNhdGFzLlxuICAgIGNvbnN0IHZhbGlkOiBTZWN0aW9uSWRbXSA9IFtcInN0YXRzXCIsIFwidG9kb2lzdFwiLCBcInBhcmFcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwicmVwb3J0c1wiLCBcImNhbGVuZGFyXCJdO1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PFNlY3Rpb25JZD4oKTtcbiAgICBjb25zdCBjbGVhbmVkID0gKHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyIHx8IFtdKS5maWx0ZXIoXG4gICAgICAocyk6IHMgaXMgU2VjdGlvbklkID0+IHZhbGlkLmluY2x1ZGVzKHMgYXMgU2VjdGlvbklkKSAmJiAhc2Vlbi5oYXMocyBhcyBTZWN0aW9uSWQpICYmIChzZWVuLmFkZChzIGFzIFNlY3Rpb25JZCksIHRydWUpXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsaWQpIGlmICghc2Vlbi5oYXModikpIGNsZWFuZWQucHVzaCh2KTtcbiAgICB0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IGNsZWFuZWQ7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2V0dGluZ3MuaGlkZGVuKSkgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSBbXTtcbiAgICAvLyBTYW5lYW1lbnRvIFRvZG9pc3QgKHYwLjcuMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICAgIGNvbnN0IHRmID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzID0ge1xuICAgICAgcHJvamVjdHM6IEFycmF5LmlzQXJyYXkodGY/LnByb2plY3RzKSA/IHRmLnByb2plY3RzIDogW10sXG4gICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkodGY/LmxhYmVscykgPyB0Zi5sYWJlbHMgOiBbXSxcbiAgICB9O1xuICAgIC8vIEV4aWJpXHUwMEU3XHUwMEUzbyBuYXMgbGluaGFzICh2MC44LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgIT09IGZhbHNlO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID09PSB0cnVlO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkgeyBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpOyB9XG5cbiAgYXN5bmMgb3BlbigpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge31cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBvcC11cCBkZSBkZXRhbGhlcyBkYSB0YXJlZmEgKHNcdTAwRjMgbGVpdHVyYTsgYm90XHUwMEUzbyBFZGl0YXIgYWJyZSBvIGZvcm11bFx1MDBFMXJpbykgXHUyNTAwXG5cbmludGVyZmFjZSBUYXNrRGV0YWlsT3B0cyB7XG4gIHRhc2s6IFRvZG9pc3RUYXNrO1xuICBwcm9qZWN0TmFtZT86IHN0cmluZztcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBlZGl0OiAoKSA9PiB2b2lkO1xuICBjb21wbGV0ZTogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0RldGFpbE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBjb21wb25lbnQ6IENvbXBvbmVudCwgcHJpdmF0ZSBvcHRzOiBUYXNrRGV0YWlsT3B0cykgeyBzdXBlcihhcHApOyB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHQgPSB0aGlzLm9wdHMudGFzaztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1tb2RhbFwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodC5jb250ZW50KTtcblxuICAgIGNvbnN0IG1ldGEgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRkLW1ldGFcIiB9KTtcbiAgICBjb25zdCBwcmkgPSBwcmlNZXRhKHQucHJpb3JpdHkpO1xuICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKGRrKSB7XG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcFwiLCB0ZXh0OiBgXHVEODNEXHVEQ0M1ICR7ZH0vJHttfS8ke3l9JHt0LmR1ZT8uaXNfcmVjdXJyaW5nID8gXCIgXHUyN0YzXCIgOiBcIlwifWAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdHMucHJvamVjdE5hbWUpIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGAjICR7dGhpcy5vcHRzLnByb2plY3ROYW1lfWAgfSk7XG4gICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB7XG4gICAgICBjb25zdCBjaGlwID0gbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXAgd2QtdGQtbGFiZWxcIiB9KTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgIH1cblxuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBib2R5ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWRlc2MgbWFya2Rvd24tcmVuZGVyZWRcIiB9KTtcbiAgICAgIHZvaWQgTWFya2Rvd25SZW5kZXJlci5yZW5kZXIodGhpcy5hcHAsIHQuZGVzY3JpcHRpb24hLnRyaW0oKSwgYm9keSwgXCJcIiwgdGhpcy5jb21wb25lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZW1wdHlcIiwgdGV4dDogXCJFc3RhIHRhcmVmYSBuXHUwMEUzbyB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzby5cIiB9KTtcbiAgICB9XG5cbiAgICAvLyBFZGl0YXIgKGVzcXVlcmRhKSBcdTAwQjcgQ29uY2x1aXIgKyBBYnJpciBubyBUb2RvaXN0IChkaXJlaXRhKS5cbiAgICBjb25zdCBhY3Rpb25zID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWFjdGlvbnNcIiB9KTtcbiAgICBjb25zdCBlZGl0ID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzBFIEVkaXRhclwiIH0pO1xuICAgIGVkaXQub25jbGljayA9ICgpID0+IHsgdGhpcy5jbG9zZSgpOyB0aGlzLm9wdHMuZWRpdCgpOyB9O1xuICAgIGFjdGlvbnMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGRvbmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MTMgQ29uY2x1aXJcIiB9KTtcbiAgICBkb25lLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMub3B0cy5jb21wbGV0ZSgpOyB0aGlzLmNsb3NlKCk7IH07XG4gICAgY29uc3Qgb3BlbiA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkFicmlyIG5vIFRvZG9pc3RcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHQpLCBcIl9ibGFua1wiKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEZvcm11bFx1MDBFMXJpbyBkZSB0YXJlZmEgKGNyaWFyIC8gZWRpdGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tGb3JtVmFsdWVzIHtcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSSAxLi40ICg0ID0gcDEpXG4gIGR1ZVN0cmluZzogc3RyaW5nO1xuICBwcm9qZWN0SWQ6IHN0cmluZztcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbn1cblxuaW50ZXJmYWNlIFRhc2tGb3JtT3B0cyB7XG4gIG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjtcbiAgdGFzaz86IFRvZG9pc3RUYXNrO1xuICBwcmVmaWxsRHVlPzogc3RyaW5nO1xuICBwcm9qZWN0czogVG9kb2lzdFByb2plY3RbXTtcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBzdWJtaXQ6ICh2OiBUYXNrRm9ybVZhbHVlcykgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgcmVtb3ZlPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbiAgY29tcGxldGU/OiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRm9ybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIHY6IFRhc2tGb3JtVmFsdWVzO1xuICBwcml2YXRlIGtub3duTGFiZWxzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBjb25maXJtRGVsID0gZmFsc2U7XG4gIHByaXZhdGUgYWN0aW9uc0VsITogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgb3B0czogVGFza0Zvcm1PcHRzKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICBjb25zdCB0ID0gb3B0cy50YXNrO1xuICAgIHRoaXMudiA9IHtcbiAgICAgIGNvbnRlbnQ6IHQ/LmNvbnRlbnQgPz8gXCJcIixcbiAgICAgIGRlc2NyaXB0aW9uOiB0Py5kZXNjcmlwdGlvbiA/PyBcIlwiLFxuICAgICAgcHJpb3JpdHk6IHQ/LnByaW9yaXR5ID8/IDEsXG4gICAgICBkdWVTdHJpbmc6IHQ/LmR1ZT8uc3RyaW5nID8/IG9wdHMucHJlZmlsbER1ZSA/PyBcIlwiLFxuICAgICAgcHJvamVjdElkOiB0Py5wcm9qZWN0X2lkID8/IFwiXCIsXG4gICAgICBsYWJlbHM6ICh0Py5sYWJlbHMgPz8gW10pLnNsaWNlKCksXG4gICAgfTtcbiAgICB0aGlzLmtub3duTGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLm9wdHMubGFiZWxzLCAuLi50aGlzLnYubGFiZWxzXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgbW9kYWxFbC5hZGRDbGFzcyhcIndkLXRhc2stZm9ybVwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodGhpcy5vcHRzLm1vZGUgPT09IFwiY3JlYXRlXCIgPyBcIk5vdmEgdGFyZWZhXCIgOiBcIkVkaXRhciB0YXJlZmFcIik7XG5cbiAgICB0aGlzLmZpZWxkKFwiVFx1MDBFRHR1bG9cIik7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0XCIsIHR5cGU6IFwidGV4dFwiIH0pO1xuICAgIGNvbnRlbnQudmFsdWUgPSB0aGlzLnYuY29udGVudDtcbiAgICBjb250ZW50LnBsYWNlaG9sZGVyID0gXCJPIHF1ZSBwcmVjaXNhIHNlciBmZWl0bz9cIjtcbiAgICBjb250ZW50Lm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5jb250ZW50ID0gY29udGVudC52YWx1ZTsgfTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRlbnQuZm9jdXMoKSwgMCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGVzY3JpXHUwMEU3XHUwMEUzb1wiKTtcbiAgICBjb25zdCBkZXNjID0gY29udGVudEVsLmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtdGYtdGV4dGFyZWFcIiB9KTtcbiAgICBkZXNjLnZhbHVlID0gdGhpcy52LmRlc2NyaXB0aW9uO1xuICAgIGRlc2MucGxhY2Vob2xkZXIgPSBcIkRldGFsaGVzIC8gaW5zdHJ1XHUwMEU3XHUwMEY1ZXMgKG1hcmtkb3duKVwiO1xuICAgIGRlc2Mucm93cyA9IDM7XG4gICAgZGVzYy5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuZGVzY3JpcHRpb24gPSBkZXNjLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIlByaW9yaWRhZGVcIik7XG4gICAgY29uc3QgcHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtcHJpLXJvd1wiIH0pO1xuICAgIGNvbnN0IHJlbmRlclByaSA9ICgpID0+IHtcbiAgICAgIHByb3cuZW1wdHkoKTtcbiAgICAgIGZvciAoY29uc3QgYXBpIG9mIFs0LCAzLCAyLCAxXSkge1xuICAgICAgICBjb25zdCBtZXRhID0gVE9ET0lTVF9QUklbYXBpXTtcbiAgICAgICAgY29uc3QgYiA9IHByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1wcmlcIiArICh0aGlzLnYucHJpb3JpdHkgPT09IGFwaSA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgICAgYi5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIG1ldGEuY29sb3IpO1xuICAgICAgICBiLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudi5wcmlvcml0eSA9IGFwaTsgcmVuZGVyUHJpKCk7IH07XG4gICAgICB9XG4gICAgfTtcbiAgICByZW5kZXJQcmkoKTtcblxuICAgIHRoaXMuZmllbGQoXCJEYXRhXCIpO1xuICAgIGNvbnN0IGR1ZSA9IGNvbnRlbnRFbC5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0XCIsIHR5cGU6IFwidGV4dFwiIH0pO1xuICAgIGR1ZS52YWx1ZSA9IHRoaXMudi5kdWVTdHJpbmc7XG4gICAgZHVlLnBsYWNlaG9sZGVyID0gXCJleC46IGFtYW5oXHUwMEUzLCBzZXh0YSwgdG9kbyBkaWEgMSwgMjAyNi0wNi0xMFwiO1xuICAgIGR1ZS5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuZHVlU3RyaW5nID0gZHVlLnZhbHVlOyB9O1xuICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIlRleHRvIGVtIHBvcnR1Z3VcdTAwRUFzLiBWYXppbyA9IHNlbSBkYXRhLlwiIH0pO1xuICAgIGlmICh0aGlzLm9wdHMudGFzaz8uZHVlPy5pc19yZWN1cnJpbmcpXG4gICAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXdhcm5cIiwgdGV4dDogXCJcdTI3RjMgVGFyZWZhIHJlY29ycmVudGUgXHUyMDE0IG11ZGFyIGEgZGF0YSBwb2RlIGFsdGVyYXIgYSByZWNvcnJcdTAwRUFuY2lhLlwiIH0pO1xuXG4gICAgdGhpcy5maWVsZChcIlByb2pldG9cIik7XG4gICAgY29uc3Qgc2VsID0gY29udGVudEVsLmNyZWF0ZUVsKFwic2VsZWN0XCIsIHsgY2xzOiBcIndkLXRmLXNlbGVjdFwiIH0pO1xuICAgIGNvbnN0IGluYm94ID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogXCJFbnRyYWRhIChJbmJveClcIiwgdmFsdWU6IFwiXCIgfSk7XG4gICAgaWYgKCF0aGlzLnYucHJvamVjdElkKSBpbmJveC5zZWxlY3RlZCA9IHRydWU7XG4gICAgZm9yIChjb25zdCBwIG9mIHRoaXMub3B0cy5wcm9qZWN0cykge1xuICAgICAgY29uc3QgbyA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IHAubmFtZSwgdmFsdWU6IHAuaWQgfSk7XG4gICAgICBpZiAocC5pZCA9PT0gdGhpcy52LnByb2plY3RJZCkgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICAgIHNlbC5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LnByb2plY3RJZCA9IHNlbC52YWx1ZTsgfTtcblxuICAgIHRoaXMuZmllbGQoXCJFdGlxdWV0YXNcIik7XG4gICAgY29uc3QgbHdyYXAgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsc1wiIH0pO1xuICAgIGlmICh0aGlzLmtub3duTGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcmVuZGVyTGFiZWxzID0gKCkgPT4ge1xuICAgICAgICBsd3JhcC5lbXB0eSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5rbm93bkxhYmVscykge1xuICAgICAgICAgIGNvbnN0IG9uID0gdGhpcy52LmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgICBjb25zdCBjaGlwID0gbHdyYXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgICAgICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnYubGFiZWxzLmluZGV4T2YobCk7XG4gICAgICAgICAgICBpZiAoaSA+PSAwKSB0aGlzLnYubGFiZWxzLnNwbGljZShpLCAxKTsgZWxzZSB0aGlzLnYubGFiZWxzLnB1c2gobCk7XG4gICAgICAgICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVuZGVyTGFiZWxzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGx3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiTmVuaHVtYSBldGlxdWV0YSBubyBUb2RvaXN0IGFpbmRhLlwiIH0pO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aW9uc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1hY3Rpb25zXCIgfSk7XG4gICAgdGhpcy5yZW5kZXJBY3Rpb25zKCk7XG4gIH1cblxuICBwcml2YXRlIGZpZWxkKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxcIiwgdGV4dDogbGFiZWwgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFjdGlvbnMoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuYWN0aW9uc0VsO1xuICAgIGEuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLmNvbmZpcm1EZWwgJiYgdGhpcy5vcHRzLnJlbW92ZSkge1xuICAgICAgYS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLWNvbmZpcm1cIiwgdGV4dDogXCJFeGNsdWlyIGVzdGEgdGFyZWZhP1wiIH0pO1xuICAgICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgICBjb25zdCB5ZXMgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgeWVzLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHllcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMucmVtb3ZlISgpKSB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGVsc2UgeyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH1cbiAgICAgIH07XG4gICAgICBjb25zdCBubyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgICBuby5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIikge1xuICAgICAgY29uc3QgZGVsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSB0cnVlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICAgIGNvbnN0IG9wZW4gPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJBYnJpciBubyBUb2RvaXN0XCIgfSk7XG4gICAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB7IGlmICh0aGlzLm9wdHMudGFzaykgd2luZG93Lm9wZW4odGFza1VybCh0aGlzLm9wdHMudGFzayksIFwiX2JsYW5rXCIpOyB9O1xuICAgICAgaWYgKHRoaXMub3B0cy5jb21wbGV0ZSkge1xuICAgICAgICBjb25zdCBkb25lID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzEzIENvbmNsdWlyXCIgfSk7XG4gICAgICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlISgpOyB0aGlzLmNsb3NlKCk7IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgY2FuY2VsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICBjYW5jZWwub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBzYXZlID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiU2FsdmFyXCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgc2F2ZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy52LmNvbnRlbnQgPSB0aGlzLnYuY29udGVudC50cmltKCk7XG4gICAgICBpZiAoIXRoaXMudi5jb250ZW50KSB7IG5ldyBOb3RpY2UoXCJEXHUwMEVBIHVtIHRcdTAwRUR0dWxvIFx1MDBFMCB0YXJlZmEuXCIpOyByZXR1cm47IH1cbiAgICAgIHNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5zdWJtaXQodGhpcy52KSkgdGhpcy5jbG9zZSgpO1xuICAgICAgZWxzZSBzYXZlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZSBjb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY2xhc3MgV2VydXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHsgc3VwZXIoYXBwLCBwbHVnaW4pOyB9XG5cbiAgZGlzcGxheSgpIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiSW50ZWdyYVx1MDBFN1x1MDBFM28gVG9kb2lzdFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRva2VuIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJUb2RvaXN0IFx1MjE5MiBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgSW50ZWdyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBUb2tlbiBkZSBBUEkgZG8gZGVzZW52b2x2ZWRvci4gU2Fsdm8gbG9jYWxtZW50ZSBlbSBkYXRhLmpzb24gKG5cdTAwRTNvIHZhaSBwYXJhIG8gR2l0KS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBvIHRva2VuIGFxdWlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbiA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkV4aWJpXHUwMEU3XHUwMEUzbyBkYXMgdGFyZWZhc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgbyBwcm9qZXRvIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgbyBub21lIGRvIHByb2pldG8gYW8gbGFkbyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGFzIGV0aXF1ZXRhcyBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIGFzIEBldGlxdWV0YXMgZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVn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
