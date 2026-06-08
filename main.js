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
  calendar: "Semana"
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
  // Re-renderiza todas as dashboards abertas (após mudar config na aba de
  // Configurações: ordem das seções, ocultar/mostrar, fontes da Semana).
  rerenderDashboards() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof DashboardView) v.refresh();
    }
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
    containerEl.createEl("h3", { text: "Fontes da Semana" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Pastas cujas notas viram cards nos dias da Semana (posi\xE7\xE3o pela data da nota). Cada fonte tem uma cor pr\xF3pria."
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
      new import_obsidian.Setting(containerEl).setName("Adicionar fonte").setDesc("Escolha uma pasta do cofre para alimentar a Semana.").addDropdown((d) => {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuXG50eXBlIFN0YXR1cyA9IFwicHJvZ3Jlc3NcIiB8IFwicGF1c2VkXCIgfCBcImNhbmNlbGxlZFwiO1xudHlwZSBTZWN0aW9uSWQgPSBcImNhbGVuZGFyXCIgfCBcInBhcmFcIiB8IFwiaGVhdG1hcFwiIHwgXCJncm93dGhcIiB8IFwic3RhdHNcIiB8IFwidG9kb2lzdFwiIHwgXCJzeW5jXCI7XG5cbmludGVyZmFjZSBUb2RvaXN0RmlsdGVycyB7XG4gIHByb2plY3RzOiBzdHJpbmdbXTsgICAvLyBpZHMgZGUgcHJvamV0byBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kb3MpXG4gIGxhYmVsczogc3RyaW5nW107ICAgICAvLyBub21lcyBkZSBldGlxdWV0YSBzZWxlY2lvbmFkb3MgKHZhemlvID0gdG9kYXMpXG59XG5cbi8vIEZvbnRlIGRlIGNhcmRzIGRhIFNlbWFuYTogdW1hIHBhc3RhIGRvIGNvZnJlICsgY29yICsgc2UgZXN0XHUwMEUxIHZpc1x1MDBFRHZlbC5cbi8vIEFzIG5vdGFzIGRlbnRybyBkZWxhIGFwYXJlY2VtIG5vcyBkaWFzIGRvIGNhbGVuZFx1MDBFMXJpbyAocG9zaVx1MDBFN1x1MDBFM28gcGVsbyBgZGF0ZTpgKS5cbmludGVyZmFjZSBDYWxTb3VyY2Uge1xuICBwYXRoOiBzdHJpbmc7ICAgIC8vIGNhbWluaG8gZGEgcGFzdGEgKGV4LjogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIilcbiAgY29sb3I6IHN0cmluZzsgICAvLyBjb3IgZG8gaW5kaWNhZG9yIGRhIGZvbnRlXG4gIG9uOiBib29sZWFuOyAgICAgLy8gbWFyY2FkYSA9IGFwYXJlY2UgbmEgc2VtYW5hXG59XG5cbmludGVyZmFjZSBEYXNoU2V0dGluZ3Mge1xuICBzZWN0aW9uT3JkZXI6IFNlY3Rpb25JZFtdO1xuICBjb21wYWN0OiBib29sZWFuO1xuICBoaWRkZW46IHN0cmluZ1tdOyAgIC8vIGNhbWluaG9zIGRlIHBhc3RhIG9jdWx0b3MgKyBcInNlYzpjYWxlbmRhclwiIC8gXCJzZWM6aGVhdG1hcFwiXG4gIG5vdGVWaWV3OiBcImxpc3RcIiB8IFwiZ3JpZFwiO1xuICBjYWxlbmRhclNvdXJjZXM6IENhbFNvdXJjZVtdOyAgIC8vIGZvbnRlcyAocGFzdGFzKSBxdWUgYWxpbWVudGFtIG9zIGNhcmRzIGRhIFNlbWFuYVxuICB0b2RvaXN0VG9rZW46IHN0cmluZztcbiAgdG9kb2lzdERheVJhbmdlOiAzIHwgNzsgICAgICAgIC8vIHF1YW50b3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiBtb3N0cmFyIG5hIGdyYWRlXG4gIHRvZG9pc3RGaWx0ZXJzOiBUb2RvaXN0RmlsdGVycztcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiBib29sZWFuOyAgIC8vIG1vc3RyYXIgbyBub21lIGRvIHByb2pldG8gbmFzIGxpbmhhc1xuICB0b2RvaXN0U2hvd0xhYmVsczogYm9vbGVhbjsgICAgLy8gbW9zdHJhciBhcyBldGlxdWV0YXMgbmFzIGxpbmhhc1xuICBzeW5jdGhpbmdVcmw6IHN0cmluZzsgICAgICAgICAgLy8gYmFzZSBkYSBBUEkgUkVTVCBkbyBTeW5jdGhpbmdcbiAgc3luY3RoaW5nQXBpS2V5OiBzdHJpbmc7ICAgICAgIC8vIFgtQVBJLUtleSAoZm9yYSBkbyBHaXQpXG4gIHN5bmN0aGluZ0ZvbGRlcklkOiBzdHJpbmc7ICAgICAvLyBpZCBkYSBwYXN0YTsgdmF6aW8gPSBhdXRvZGV0ZWN0YVxuICBzeW5jdGhpbmdTaG93Q291bnRzOiBib29sZWFuOyAgLy8gbW9zdHJhciBcInNpbmNyb25pemFkb3MgLyB0b3RhbFwiIGRlIGl0ZW5zIHBvciBhcGFyZWxob1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEYXNoU2V0dGluZ3MgPSB7XG4gIHNlY3Rpb25PcmRlcjogW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIGNhbGVuZGFyU291cmNlczogW1xuICAgIHsgcGF0aDogXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgY29sb3I6IFwiIzNCODJGNlwiLCBvbjogdHJ1ZSB9LFxuICAgIHsgcGF0aDogXCI1MC5EaVx1MDBFMXJpb1wiLCAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzEwQjk4MVwiLCBvbjogdHJ1ZSB9LFxuICBdLFxuICB0b2RvaXN0VG9rZW46IFwiXCIsXG4gIHRvZG9pc3REYXlSYW5nZTogNyxcbiAgdG9kb2lzdEZpbHRlcnM6IHsgcHJvamVjdHM6IFtdLCBsYWJlbHM6IFtdIH0sXG4gIHRvZG9pc3RTaG93UHJvamVjdDogdHJ1ZSxcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGZhbHNlLFxuICBzeW5jdGhpbmdVcmw6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIsXG4gIHN5bmN0aGluZ0FwaUtleTogXCJcIixcbiAgc3luY3RoaW5nRm9sZGVySWQ6IFwiXCIsXG4gIHN5bmN0aGluZ1Nob3dDb3VudHM6IGZhbHNlLFxufTtcblxuaW50ZXJmYWNlIFBhcmFTZWN0aW9uIHtcbiAgZm9sZGVyOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgYWNjZW50OiBzdHJpbmc7XG59XG5cbi8vIFBhc3RhcyBcImNvbmhlY2lkYXNcIiBkbyBQQVJBOiBtYW50XHUwMEVBbSBcdTAwRURjb25lLCByXHUwMEYzdHVsbyBlIGNvciBmaXhvcy4gQXMgZGVtYWlzIHBhc3Rhc1xuLy8gZG8gY29mcmUgc1x1MDBFM28gcmVuZGVyaXphZGFzIGNvbSBjb3IgYXV0b21cdTAwRTF0aWNhIGUgXHUwMEVEY29uZSBwYWRyXHUwMEUzbyAob3UgbyBpY29uOiBkbyBzdGF0dXMubWQpLlxuY29uc3QgUEFSQTogUGFyYVNlY3Rpb25bXSA9IFtcbiAgeyBmb2xkZXI6IFwiMDAuSW5ib3hcIiwgICAgIGljb246IFwiXHVEODNEXHVEQ0U1XCIsIGxhYmVsOiBcIkluYm94XCIsICAgIGFjY2VudDogXCIjNjM2NkYxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMTAuUHJvamVjdHNcIiwgIGljb246IFwiXHVEODNEXHVERTgwXCIsIGxhYmVsOiBcIlByb2pldG9zXCIsIGFjY2VudDogXCIjMTBCOTgxXCIgfSxcbiAgeyBmb2xkZXI6IFwiMjAuQXJlYXNcIiwgICAgIGljb246IFwiXHVEODNDXHVERkFGXCIsIGxhYmVsOiBcIlx1MDBDMXJlYXNcIiwgICAgYWNjZW50OiBcIiNGNTlFMEJcIiB9LFxuICB7IGZvbGRlcjogXCIzMC5SZXNvdXJjZXNcIiwgaWNvbjogXCJcdUQ4M0RcdURDREFcIiwgbGFiZWw6IFwiUmVjdXJzb3NcIiwgYWNjZW50OiBcIiMzQjgyRjZcIiB9LFxuICB7IGZvbGRlcjogXCI0MC5BcmNoaXZlXCIsICAgaWNvbjogXCJcdUQ4M0RcdUREQzRcdUZFMEZcIiwgIGxhYmVsOiBcIkFycXVpdm9cIiwgIGFjY2VudDogXCIjNkI3MjgwXCIgfSxcbl07XG5jb25zdCBQQVJBX01BUCA9IG5ldyBNYXAoUEFSQS5tYXAocCA9PiBbcC5mb2xkZXIsIHBdKSk7XG5cbi8vIFBhbGV0YSBwYXJhIGNvbG9yaXIgcGFzdGFzIGRlc2NvbmhlY2lkYXMgZGUgZm9ybWEgZXN0XHUwMEUxdmVsIChwb3IgaGFzaCBkbyBub21lKS5cbmNvbnN0IEFDQ0VOVFMgPSBbXCIjNjM2NkYxXCIsXCIjMTBCOTgxXCIsXCIjRjU5RTBCXCIsXCIjM0I4MkY2XCIsXCIjRUM0ODk5XCIsXCIjOEI1Q0Y2XCIsXCIjMTRCOEE2XCIsXCIjRUY0NDQ0XCJdO1xuXG5jb25zdCBEQVlfU0hPUlQgPSBbXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTXHUwMEUxYlwiLCBcIkRvbVwiXTtcbmNvbnN0IE1PTlRIX1NIT1JUID0gW1wiSmFuXCIsXCJGZXZcIixcIk1hclwiLFwiQWJyXCIsXCJNYWlcIixcIkp1blwiLFwiSnVsXCIsXCJBZ29cIixcIlNldFwiLFwiT3V0XCIsXCJOb3ZcIixcIkRlelwiXTtcbmNvbnN0IElNR19FWFQgPSBbXCJwbmdcIixcImpwZ1wiLFwianBlZ1wiLFwid2VicFwiLFwiZ2lmXCIsXCJzdmdcIl07XG5cbi8vIFBhc3RhIHJhaXogZGFzIG5vdGFzIGRpXHUwMEUxcmlhcyAoY3JpYWRhcyBhbyBjbGljYXIgbnVtIGRpYSBkbyBjYWxlbmRcdTAwRTFyaW8pLlxuY29uc3QgREFJTFlfRk9MREVSID0gXCI1MC5EaVx1MDBFMXJpb1wiO1xuLy8gVGVtcGxhdGUgb3BjaW9uYWw7IHBsYWNlaG9sZGVycyB7e2RhdGV9fSAoWVlZWS1NTS1ERCkgZSB7e3RpdGxlfX0gKGRhdGEgcG9yIGV4dGVuc28pLlxuY29uc3QgREFJTFlfVEVNUExBVEUgPSBcIk1vZGVsb3MvTm90YSBEaVx1MDBFMXJpYS5tZFwiO1xuXG5jb25zdCBTVEFUVVNfSUNPTjogUmVjb3JkPFN0YXR1cywgc3RyaW5nPiA9IHtcbiAgcHJvZ3Jlc3M6IFwiXHUyNUI2XCIsIHBhdXNlZDogXCJcdTIzRjhcIiwgY2FuY2VsbGVkOiBcIlx1MjcxNVwiLFxufTtcblxuY29uc3QgU0VDX0NBTCA9IFwic2VjOmNhbGVuZGFyXCI7XG5jb25zdCBTRUNfUEFSQSA9IFwic2VjOnBhcmFcIjtcbmNvbnN0IFNFQ19IRUFUID0gXCJzZWM6aGVhdG1hcFwiO1xuY29uc3QgU0VDX0dST1cgPSBcInNlYzpncm93dGhcIjtcbmNvbnN0IFNFQ19TVEFUID0gXCJzZWM6c3RhdHNcIjtcbmNvbnN0IFNFQ19UT0RPID0gXCJzZWM6dG9kb2lzdFwiO1xuY29uc3QgU0VDX1NZTkMgPSBcInNlYzpzeW5jXCI7XG5cbi8vIFJcdTAwRjN0dWxvcyBhbWlnXHUwMEUxdmVpcyBkYXMgc2VcdTAwRTdcdTAwRjVlcyAodXNhZG9zIG5hIGFiYSBkZSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcykuXG5jb25zdCBTRUNUSU9OX0xBQkVMOiBSZWNvcmQ8U2VjdGlvbklkLCBzdHJpbmc+ID0ge1xuICBzdGF0czogICAgXCJFc3RhdFx1MDBFRHN0aWNhc1wiLFxuICB0b2RvaXN0OiAgXCJUYXJlZmFzXCIsXG4gIHBhcmE6ICAgICBcIkNvZnJlIChwYXN0YXMpXCIsXG4gIHN5bmM6ICAgICBcIlNpbmNyb25pemFcdTAwRTdcdTAwRTNvXCIsXG4gIGhlYXRtYXA6ICBcIkF0aXZpZGFkZSBkbyBjb2ZyZVwiLFxuICBncm93dGg6ICAgXCJDcmVzY2ltZW50byBkbyBjb2ZyZVwiLFxuICBjYWxlbmRhcjogXCJTZW1hbmFcIixcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBUb2RvaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVG9kb2lzdFRhc2sge1xuICBpZDogc3RyaW5nO1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSTogMS4uNCwgb25kZSA0ID0gdXJnZW50ZSAoPSBwMSBuYSBVSSlcbiAgZHVlPzogeyBkYXRlOiBzdHJpbmc7IGRhdGV0aW1lPzogc3RyaW5nOyBzdHJpbmc/OiBzdHJpbmc7IGlzX3JlY3VycmluZz86IGJvb2xlYW4gfSB8IG51bGw7XG4gIHByb2plY3RfaWQ/OiBzdHJpbmc7XG4gIGlzX2NvbXBsZXRlZD86IGJvb2xlYW47XG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICB1cmw/OiBzdHJpbmc7XG59XG5cbi8vIFByaW9yaWRhZGUgZGEgQVBJICg0PXVyZ2VudGUpIFx1MjE5MiByXHUwMEYzdHVsby9jb3IgZGEgVUkgKHAxPXZlcm1lbGhvIFx1MjAyNiBwND1jaW56YSkuXG5jb25zdCBUT0RPSVNUX1BSSTogUmVjb3JkPG51bWJlciwgeyBsYWJlbDogc3RyaW5nOyBjb2xvcjogc3RyaW5nIH0+ID0ge1xuICA0OiB7IGxhYmVsOiBcInAxXCIsIGNvbG9yOiBcIiNFRjQ0NDRcIiB9LFxuICAzOiB7IGxhYmVsOiBcInAyXCIsIGNvbG9yOiBcIiNGNTlFMEJcIiB9LFxuICAyOiB7IGxhYmVsOiBcInAzXCIsIGNvbG9yOiBcIiMzQjgyRjZcIiB9LFxuICAxOiB7IGxhYmVsOiBcInA0XCIsIGNvbG9yOiBcIiM2QjcyODBcIiB9LFxufTtcbmZ1bmN0aW9uIHByaU1ldGEocDogbnVtYmVyKSB7IHJldHVybiBUT0RPSVNUX1BSSVtwXSA/PyBUT0RPSVNUX1BSSVsxXTsgfVxuXG4vLyBQYWxldGEgbm9tZWFkYSBkbyBUb2RvaXN0IFx1MjE5MiBoZXggKHBhcmEgY29sb3JpciBhcyBldGlxdWV0YXMgY29tbyBubyBhcHApLlxuY29uc3QgVE9ET0lTVF9DT0xPUlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGJlcnJ5X3JlZDogXCIjQjgyNTVGXCIsIHJlZDogXCIjREI0MDM1XCIsIG9yYW5nZTogXCIjRkY5OTMzXCIsIHllbGxvdzogXCIjRkFEMDAwXCIsXG4gIG9saXZlX2dyZWVuOiBcIiNBRkI4M0JcIiwgbGltZV9ncmVlbjogXCIjN0VDQzQ5XCIsIGdyZWVuOiBcIiMyOTk0MzhcIiwgbWludF9ncmVlbjogXCIjNkFDQ0JDXCIsXG4gIHRlYWw6IFwiIzE1OEZBRFwiLCBza3lfYmx1ZTogXCIjMTRBQUY1XCIsIGxpZ2h0X2JsdWU6IFwiIzk2QzNFQlwiLCBibHVlOiBcIiM0MDczRkZcIixcbiAgZ3JhcGU6IFwiIzg4NERGRlwiLCB2aW9sZXQ6IFwiI0FGMzhFQlwiLCBsYXZlbmRlcjogXCIjRUI5NkVCXCIsIG1hZ2VudGE6IFwiI0UwNTE5NFwiLFxuICBzYWxtb246IFwiI0ZGOEQ4NVwiLCBjaGFyY29hbDogXCIjODA4MDgwXCIsIGdyZXk6IFwiI0I4QjhCOFwiLCB0YXVwZTogXCIjQ0NBQzkzXCIsXG59O1xuY29uc3QgTEFCRUxfRkFMTEJBQ0sgPSBcIiNCOEI4QjhcIjtcblxuLy8gQnVzY2EgYXMgdGFyZWZhcyBhdGl2YXMgKG5cdTAwRTNvIGNvbmNsdVx1MDBFRGRhcykgdmlhIEFQSSB1bmlmaWNhZGEgdjEgKGEgUkVTVCB2MiBmb2lcbi8vIGFwb3NlbnRhZGEgXHUyMTkyIHJlc3BvbmRpYSA0MTApLiBBIHYxIFx1MDBFOSBwYWdpbmFkYTogeyByZXN1bHRzLCBuZXh0X2N1cnNvciB9LlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0VGFza3ModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFRhc2tbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0VGFza1tdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICAvLyB2MSBlbnZlbG9wYSBlbSByZXN1bHRzOyB0b2xlcmEgcmVzcG9zdGEgY29tbyBhcnJheSBwdXJvIHBvciBzZWd1cmFuXHUwMEU3YS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0VGFza1tdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RQcm9qZWN0IHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vLyBCdXNjYSBvcyBwcm9qZXRvcyAocGFyYSBvIGZpbHRybykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYSBkYXMgdGFyZWZhcy5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RQcm9qZWN0W10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9wcm9qZWN0c1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0UHJvamVjdFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0UHJvamVjdFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RMYWJlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZzsgICAvLyBub21lIGRhIHBhbGV0YSAoZXguOiBcImNoYXJjb2FsXCIpXG59XG5cbi8vIEJ1c2NhIGFzIGV0aXF1ZXRhcyBwZXNzb2FpcyAocGFyYSBjb2xvcmlyIG9zIGNoaXBzKS4gTWVzbWEgQVBJIHYxIHBhZ2luYWRhLlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0TGFiZWxzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RMYWJlbFtdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdExhYmVsW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL2xhYmVsc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0TGFiZWxbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdExhYmVsW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IpO1xuICByZXR1cm4gYWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3luY3RoaW5nIChBUEkgUkVTVCkgXHUyMDE0IHYwLjEwLjAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBTVEZvbGRlciB7IGlkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgcGF1c2VkOiBib29sZWFuIH1cbmludGVyZmFjZSBTVERldmljZSB7IGRldmljZUlEOiBzdHJpbmc7IG5hbWU6IHN0cmluZyB9XG5pbnRlcmZhY2UgU1RTdGF0dXMgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGVycm9yczogbnVtYmVyOyBwdWxsRXJyb3JzOiBudW1iZXIgfVxuaW50ZXJmYWNlIFNUQ29tcGxldGlvbiB7IGNvbXBsZXRpb246IG51bWJlcjsgZ2xvYmFsSXRlbXM6IG51bWJlcjsgbmVlZEl0ZW1zOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBuZWVkRGVsZXRlczogbnVtYmVyIH1cblxuaW50ZXJmYWNlIFN5bmNEZXZSb3cgeyBuYW1lOiBzdHJpbmc7IG9ubGluZTogYm9vbGVhbjsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXI7IGxhc3RTZWVuOiBzdHJpbmcgfVxuaW50ZXJmYWNlIFN5bmNEYXRhIHsgc3RhdGU6IHN0cmluZzsgbmVlZEZpbGVzOiBudW1iZXI7IG5lZWRCeXRlczogbnVtYmVyOyBmb2xkZXJMYWJlbDogc3RyaW5nOyBlcnJvcnM6IG51bWJlcjsgZGV2aWNlczogU3luY0RldlJvd1tdIH1cblxuZnVuY3Rpb24gaHVtYW5CeXRlcyhuOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAoIW4pIHJldHVybiBcIjAgQlwiO1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDQ4NTc2KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKG4gPCAxMDI0MCA/IDEgOiAwKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAxMDQ4NTc2KS50b0ZpeGVkKG4gPCAxMDQ4NTc2MCA/IDEgOiAwKX0gTUJgO1xufVxuXG5mdW5jdGlvbiByZWxUaW1lKGlzbzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdCA9IERhdGUucGFyc2UoaXNvKTtcbiAgaWYgKGlzTmFOKHQpIHx8IHQgPCAxKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgY29uc3QgcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSB0KSAvIDEwMDApO1xuICBpZiAocyA8IDYwKSByZXR1cm4gXCJhZ29yYVwiO1xuICBpZiAocyA8IDM2MDApIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDYwKX0gbWluYDtcbiAgaWYgKHMgPCA4NjQwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gMzYwMCl9IGhgO1xuICByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyA4NjQwMCl9IGRgO1xufVxuXG4vLyBHRVQgZ2VuXHUwMEU5cmljbyBuYSBBUEkgZG8gU3luY3RoaW5nIChoZWFkZXIgWC1BUEktS2V5OyByZXF1ZXN0VXJsIGlnbm9yYSBDT1JTKS5cbmFzeW5jIGZ1bmN0aW9uIHN0R2V0PFQ+KGJhc2U6IHN0cmluZywga2V5OiBzdHJpbmcsIHBhdGg6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICBjb25zdCB1cmwgPSBiYXNlLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHsgdXJsLCBtZXRob2Q6IFwiR0VUXCIsIGhlYWRlcnM6IHsgXCJYLUFQSS1LZXlcIjoga2V5IH0sIHRocm93OiBmYWxzZSB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcIkFQSSBrZXkgaW52XHUwMEUxbGlkYSAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUO1xufVxuXG4vLyBVUkwgcGFyYSBhYnJpciBhIHRhcmVmYSBubyBUb2RvaXN0ICh1c2EgYSBkbyBwYXlsb2FkIG91IG1vbnRhIGEgcGFydGlyIGRvIGlkKS5cbmZ1bmN0aW9uIHRhc2tVcmwodDogVG9kb2lzdFRhc2spOiBzdHJpbmcge1xuICByZXR1cm4gdC51cmwgPz8gYGh0dHBzOi8vYXBwLnRvZG9pc3QuY29tL2FwcC90YXNrLyR7dC5pZH1gO1xufVxuXG4vLyBDb25jbHVpIChmZWNoYSkgdW1hIHRhcmVmYSBubyBUb2RvaXN0LiBQT1NUIHNlbSBjb3JwbzsgMjA0ID0gc3VjZXNzby4gRmFzZSA4LjIuXG5hc3luYyBmdW5jdGlvbiBjbG9zZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L2Nsb3NlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDQgJiYgcmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgRXNjcml0YTogY3JpYXIgLyBlZGl0YXIgLyBtb3ZlciAvIGV4Y2x1aXIgKHYwLjguMCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIENhbXBvcyBncmF2XHUwMEUxdmVpcy4gVG9kb3Mgb3BjaW9uYWlzIFx1MjAxNCBubyBlZGl0YXIgbWFuZG8gc1x1MDBGMyBvIHF1ZSBtdWRvdS5cbmludGVyZmFjZSBUb2RvaXN0V3JpdGUge1xuICBjb250ZW50Pzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk/OiBudW1iZXI7ICAgICAvLyAxLi40ICg0ID0gdXJnZW50ZSAvIHAxIG5hIFVJKVxuICBkdWVfZGF0ZT86IHN0cmluZzsgICAgIC8vIGRhdGEgZml4YSBZWVlZLU1NLUREICh2aW5kbyBkbyBjYWxlbmRcdTAwRTFyaW8pXG4gIGR1ZV9zdHJpbmc/OiBzdHJpbmc7ICAgLy8gbGluZ3VhZ2VtIG5hdHVyYWw7IFwibm8gZGF0ZVwiIGxpbXBhIGEgZGF0YVxuICBkdWVfbGFuZz86IHN0cmluZzsgICAgIC8vIFwicHRcIiBcdTIxOTIgaW50ZXJwcmV0YSBlbSBwb3J0dWd1XHUwMEVBc1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbn1cblxuZnVuY3Rpb24ganNvbkhlYWRlcnModG9rZW46IHN0cmluZykge1xuICByZXR1cm4geyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCwgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfTtcbn1cblxuLy8gQ3JpYSB1bWEgdGFyZWZhLiBQT1NUIC90YXNrcyBcdTIxOTIgMjAwIGNvbSBhIHRhcmVmYSBjcmlhZGEuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8VG9kb2lzdFRhc2s+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICByZXR1cm4gcmVzLmpzb24gYXMgVG9kb2lzdFRhc2s7XG59XG5cbi8vIEVkaXRhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwMC4gTlx1MDBFM28gdHJvY2EgZGUgcHJvamV0byAodXNlIG1vdmVUb2RvaXN0VGFzaykuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBmaWVsZHM6IFRvZG9pc3RXcml0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZpZWxkcyksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBNb3ZlIGEgdGFyZWZhIHBhcmEgb3V0cm8gcHJvamV0by4gUE9TVCAvdGFza3Mve2lkfS9tb3ZlIFx1MjE5MiAyMDAuXG5hc3luYyBmdW5jdGlvbiBtb3ZlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZywgcHJvamVjdF9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9tb3ZlYCxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IGpzb25IZWFkZXJzKHRva2VuKSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHByb2plY3RfaWQgfSksXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRXhjbHVpIGEgdGFyZWZhLiBERUxFVEUgL3Rhc2tzL3tpZH0gXHUyMTkyIDIwNC5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9YCxcbiAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIERhdGEgZGUgdmVuY2ltZW50byAoWVlZWS1NTS1ERCkgZGUgdW1hIHRhcmVmYSwgb3UgbnVsbCBzZSBzZW0gZHVlLlxuZnVuY3Rpb24gZHVlS2V5KHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGQgPSB0LmR1ZT8uZGF0ZSA/PyB0LmR1ZT8uZGF0ZXRpbWU7XG4gIHJldHVybiBkID8gZC5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuLy8gQSB0YXJlZmEgdGVtIGRlc2NyaVx1MDBFN1x1MDBFM28gKGluc3RydVx1MDBFN1x1MDBGNWVzKT9cbmZ1bmN0aW9uIGhhc0Rlc2ModDogVG9kb2lzdFRhc2spOiBib29sZWFuIHtcbiAgcmV0dXJuICEhdC5kZXNjcmlwdGlvbiAmJiB0LmRlc2NyaXB0aW9uLnRyaW0oKS5sZW5ndGggPiAwO1xufVxuY29uc3QgREVTQ19NQVggPSA3MDA7ICAgLy8gY29ydGUgZGEgZGVzY3JpXHUwMEU3XHUwMEUzbyBubyB0b29sdGlwIChvIHJlc3RvIGZpY2Egbm8gVG9kb2lzdClcblxuLy8gRnVuXHUwMEU3XHUwMEUzbyBnbG9iYWwgZXhwb3N0YSBwZWxvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiAocXVhbmRvIGhhYmlsaXRhZG8pLlxudHlwZSBIZWF0bWFwRW50cnkgPSB7IGRhdGU6IHN0cmluZzsgaW50ZW5zaXR5PzogbnVtYmVyOyBjb2xvcj86IHN0cmluZzsgY29udGVudD86IHN0cmluZyB9O1xudHlwZSBIZWF0bWFwRGF0YSA9IHtcbiAgeWVhcjogbnVtYmVyO1xuICBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgZW50cmllczogSGVhdG1hcEVudHJ5W107XG4gIHNob3dDdXJyZW50RGF5Qm9yZGVyPzogYm9vbGVhbjtcbn07XG5mdW5jdGlvbiBnZXRIZWF0bWFwUmVuZGVyZXIoKTogKChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IEhlYXRtYXBEYXRhKSA9PiB2b2lkKSB8IG51bGwge1xuICBjb25zdCBmbiA9ICh3aW5kb3cgYXMgdW5rbm93biBhcyB7IHJlbmRlckhlYXRtYXBDYWxlbmRhcj86IHVua25vd24gfSkucmVuZGVySGVhdG1hcENhbGVuZGFyO1xuICByZXR1cm4gdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIgPyAoZm4gYXMgKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIDogbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgZGF0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gaXNvV2Vla051bWJlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSkpO1xuICBjb25zdCBkb3cgPSBkLmdldFVUQ0RheSgpIHx8IDc7XG4gIGQuc2V0VVRDRGF0ZShkLmdldFVUQ0RhdGUoKSArIDQgLSBkb3cpO1xuICBjb25zdCB5MCA9IG5ldyBEYXRlKERhdGUuVVRDKGQuZ2V0VVRDRnVsbFllYXIoKSwgMCwgMSkpO1xuICByZXR1cm4gTWF0aC5jZWlsKCgoZC5nZXRUaW1lKCkgLSB5MC5nZXRUaW1lKCkpIC8gODZfNDAwXzAwMCArIDEpIC8gNyk7XG59XG5cbmZ1bmN0aW9uIG1vbmRheU9mKG9mZnNldDogbnVtYmVyKTogRGF0ZSB7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGRvdyA9IG5vdy5nZXREYXkoKSB8fCA3O1xuICBjb25zdCBkID0gbmV3IERhdGUobm93KTtcbiAgZC5zZXREYXRlKG5vdy5nZXREYXRlKCkgLSBkb3cgKyAxICsgb2Zmc2V0ICogNyk7XG4gIGQuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiB0b0tleShkOiBEYXRlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2QuZ2V0RnVsbFllYXIoKX0tJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfS0ke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0ZSh2YWw6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbC5zdWJzdHJpbmcoMCwgMTApO1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHZhbC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsKTtcbiAgcmV0dXJuIHMubWF0Y2goL15cXGR7NH0tXFxkezJ9LVxcZHsyfS8pID8gcy5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9kYXlCUigpOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gIH0pO1xufVxuXG4vLyBUb2RvcyBvcyBjYW1pbmhvcyBkZSBwYXN0YSBkbyBjb2ZyZSAocmVjdXJzaXZvKSwgaWdub3JhbmRvIG9jdWx0YXMgKC5vYnNpZGlhbiBldGMuKSxcbi8vIGVtIG9yZGVtIGFsZmFiXHUwMEU5dGljYSBcdTIwMTQgdXNhZG8gbm8gc2VsZXRvciBkZSBmb250ZXMgZGEgU2VtYW5hLlxuZnVuY3Rpb24gYWxsRm9sZGVyUGF0aHMoYXBwOiBBcHApOiBzdHJpbmdbXSB7XG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlciAmJiAhYy5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSB7IG91dC5wdXNoKGMucGF0aCk7IHdhbGsoYyk7IH1cbiAgICB9XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiBvdXQuc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbn1cblxuLy8gZGQvbW0gYSBwYXJ0aXIgZGUgdW0gdGltZXN0YW1wIChtdGltZSlcbmZ1bmN0aW9uIGZtdFNob3J0KHRzOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBkID0gbmV3IERhdGUodHMpO1xuICByZXR1cm4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfWA7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVdGlsaWRhZGVzIGRlIHBhc3RhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDb250YSBub3RhcyByZXZpc2FkYXMgKHJldmlld2VkOiB0cnVlKSB2cyB0b3RhbCBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiByZXZpZXdlZFN0YXRzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IHJldmlld2VkOiBudW1iZXI7IHRvdGFsOiBudW1iZXIgfSB7XG4gIGxldCByZXZpZXdlZCA9IDAsIHRvdGFsID0gMDtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIHtcbiAgICAgICAgdG90YWwrKztcbiAgICAgICAgaWYgKGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGMucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgcmV2aWV3ZWQrKztcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIHJldHVybiB7IHJldmlld2VkLCB0b3RhbCB9O1xufVxuXG4vLyBDb250YSBtZCAoZXhjZXRvIHN0YXR1cy5tZCkgZSBpbWFnZW5zIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIGZvbGRlclN0YXRzKGZvbGRlcjogVEZvbGRlcik6IHsgbWQ6IG51bWJlcjsgaW1nOiBudW1iZXIgfSB7XG4gIGxldCBtZCA9IDAsIGltZyA9IDA7XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgIGlmIChjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikgbWQrKztcbiAgICAgICAgZWxzZSBpZiAoSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpIGltZysrO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgcmV0dXJuIHsgbWQsIGltZyB9O1xufVxuXG4vLyBUZXh0byBkZSBjb250YWdlbSBwYWRyb25pemFkbyBwYXJhIG9zIGNhcmRzIChub3RhcyArIGltYWdlbnMsIHF1YW5kbyBob3V2ZXIpLlxuZnVuY3Rpb24gY291bnRUZXh0KHN0YXRzOiB7IG1kOiBudW1iZXI7IGltZzogbnVtYmVyIH0pOiBzdHJpbmcge1xuICBpZiAoc3RhdHMubWQgPT09IDAgJiYgc3RhdHMuaW1nID4gMCkgcmV0dXJuIGAke3N0YXRzLmltZ30gaW1nYDtcbiAgcmV0dXJuIHN0YXRzLmltZyA+IDAgPyBgJHtzdGF0cy5tZH0gbm90YXMgXHUwMEI3ICR7c3RhdHMuaW1nfSBpbWdgIDogYCR7c3RhdHMubWR9IG5vdGFzYDtcbn1cblxuLy8gQXMgTiBub3RhcyAubWQgbW9kaWZpY2FkYXMgbWFpcyByZWNlbnRlbWVudGUgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gcmVjZW50Tm90ZXMoZm9sZGVyOiBURm9sZGVyLCBuOiBudW1iZXIpOiBURmlsZVtdIHtcbiAgY29uc3QgZmlsZXM6IFRGaWxlW10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIGZpbGVzLnB1c2goYyk7XG4gICAgICBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgZmlsZXMuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgcmV0dXJuIGZpbGVzLnNsaWNlKDAsIG4pO1xufVxuXG4vLyBQYXN0YSBcImRlIGFzc2V0c1wiOiBzXHUwMEYzIHRlbSBpbWFnZW5zLCBuZW5odW1hIG5vdGEgXHUyMTkyIGVzY29uZGlkYSBubyBuYXZlZ2Fkb3IgaW50ZXJuby5cbmZ1bmN0aW9uIGlzQXNzZXRGb2xkZXIoZm9sZGVyOiBURm9sZGVyKTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgbWQsIGltZyB9ID0gZm9sZGVyU3RhdHMoZm9sZGVyKTtcbiAgcmV0dXJuIGltZyA+IDAgJiYgbWQgPT09IDA7XG59XG5cbmZ1bmN0aW9uIHN1YkZvbGRlcnMoZm9sZGVyOiBURm9sZGVyKTogVEZvbGRlcltdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAuZmlsdGVyKGYgPT4gIWlzQXNzZXRGb2xkZXIoZikpXG4gICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG50eXBlIFVyZ2VuY3lJbmZvID0geyBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyBtYXg6IFVyZ2VuY3kgfCBudWxsIH07XG5cbi8vIE5vdGFzIGNvbSBgdXJnZW5jeWAgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlICsgbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vIChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYykuXG5mdW5jdGlvbiB1cmdlbmN5U3RhdHMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IFVyZ2VuY3lJbmZvIHtcbiAgY29uc3QgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikge1xuICAgICAgICBjb25zdCB1ID0gcmVhZE5vdGVVcmdlbmN5KGFwcCwgYyk7XG4gICAgICAgIGlmICh1KSBpdGVtcy5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICBsZXQgbWF4OiBVcmdlbmN5IHwgbnVsbCA9IG51bGw7XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIGlmICghbWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbbWF4XSkgbWF4ID0gaXQubGV2ZWw7XG4gIGl0ZW1zLnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gIHJldHVybiB7IGl0ZW1zLCBtYXggfTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFZpZXcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIERhc2hib2FyZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgd2Vla09mZnNldCA9IDA7XG4gIHByaXZhdGUgbmF2UGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGlwOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNlYXJjaFRlcm0gPSBcIlwiO1xuICBwcml2YXRlIHJldmlld0ZpbHRlciA9IGZhbHNlO1xuICBwcml2YXRlIGdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTtcblxuICAvLyBFc3RhZG8gZGEgaW50ZWdyYVx1MDBFN1x1MDBFM28gVG9kb2lzdFxuICBwcml2YXRlIHRvZG9pc3RUYXNrczogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBwcml2YXRlIHRvZG9pc3RQcm9qZWN0czogVG9kb2lzdFByb2plY3RbXSA9IFtdO1xuICBwcml2YXRlIHRvZG9pc3RQcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIHRvZG9pc3RMYWJlbENvbG9yID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSB0b2RvaXN0TG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHRvZG9pc3RFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdG9kb2lzdEZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgdG9kb2lzdExhdGVyT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIHRvZG9pc3RGaWx0ZXJPcGVuID0gZmFsc2U7XG5cbiAgLy8gRXN0YWRvIGRvIFN5bmN0aGluZyAodjAuMTAuMClcbiAgcHJpdmF0ZSBzeW5jRGF0YTogU3luY0RhdGEgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzeW5jTG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHN5bmNFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0ZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgY29uZmxpY3RDb25maXJtOiBzdHJpbmcgfCBudWxsID0gbnVsbDsgICAvLyBwYXRoIGRvIGNvbmZsaXRvIGFndWFyZGFuZG8gY29uZmlybWFcdTAwRTdcdTAwRTNvXG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGxlYWYpOyB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB0aGlzLnNjaGVkdWxlKCkpKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKSB7IHRoaXMuaGlkZVRpcCgpOyB9XG5cbiAgLy8gUmUtcmVuZGVyIHBcdTAwRkFibGljbyBcdTIwMTQgY2hhbWFkbyBwZWxvIHBsdWdpbiBxdWFuZG8gYSBjb25maWd1cmFcdTAwRTdcdTAwRTNvIG11ZGEgbmEgYWJhXG4gIC8vIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIChvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMgZGEgU2VtYW5hKS5cbiAgcmVmcmVzaCgpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgaWYgKGlkID09PSBcImNhbGVuZGFyXCIpICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJoZWF0bWFwXCIpIHRoaXMucmVuZGVySGVhdG1hcChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcImdyb3d0aFwiKSAgdGhpcy5yZW5kZXJHcm93dGgocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJzdGF0c1wiKSAgIHRoaXMucmVuZGVyU3RhdHMocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJ0b2RvaXN0XCIpIHRoaXMucmVuZGVyVG9kb2lzdChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInN5bmNcIikgICAgdGhpcy5yZW5kZXJTeW5jKHJvb3QpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBPY3VsdGFyIChsZWl0dXJhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gTW9zdHJhci9vY3VsdGFyIGUgYSBvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcyBzXHUwMEUzbyBhZG1pbmlzdHJhZG9zIG5hIGFiYSBkZVxuICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBkbyBwbHVnaW4uIEEgdmlldyBzXHUwMEYzICpsXHUwMEVBKiBgc2V0dGluZ3MuaGlkZGVuYCBwYXJhIHB1bGFyIG8gcXVlXG4gIC8vIGVzdFx1MDBFMSBvY3VsdG8uIFZlciBXZXJ1c1NldHRpbmdUYWIuXG5cbiAgcHJpdmF0ZSBpc0hpZGRlbihrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb29sdGlwIGRlIG5vdGFzIHJlY2VudGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgc2hvd1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBmaWxlczogVEZpbGVbXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIk1vZGlmaWNhZGFzIHJlY2VudGVtZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBQb3NpY2lvbmEgdW0gdG9vbHRpcCBmaXhvIGFiYWl4byBkbyBhbHZvICh2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN28pLlxuICBwcml2YXRlIHBvc2l0aW9uVGlwKHRpcDogSFRNTEVsZW1lbnQsIHRhcmdldDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR3ID0gdGlwLm9mZnNldFdpZHRoLCB0aCA9IHRpcC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGxlZnQgPSByZWN0LmxlZnQ7XG4gICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgNjtcbiAgICBpZiAobGVmdCArIHR3ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0dyAtIDg7XG4gICAgaWYgKHRvcCArIHRoID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgdG9wID0gcmVjdC50b3AgLSB0aCAtIDY7ICAvLyB2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN29cbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICB9XG5cbiAgLy8gVG9vbHRpcCBsaXN0YW5kbyBhcyBub3RhcyB1cmdlbnRlcyBkZSB1bWEgcGFzdGEgKGhvdmVyIG5vIGJhZGdlIGRlIGF2aXNvKS5cbiAgcHJpdmF0ZSBzaG93VXJnZW5jeVRpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC11cmdlbmN5LXRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiVXJnZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgY29uc3QgZG90ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdXRpcC1kb3RcIiB9KTtcbiAgICAgIGRvdC5zdHlsZS5iYWNrZ3JvdW5kID0gVVJHRU5DWV9DT0xPUltpdC5sZXZlbF07XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBpdC5maWxlLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogaXQubGV2ZWwgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gQmFkZ2UgZGUgYXZpc28gKHRyaVx1MDBFMm5ndWxvKSBubyBjYXJkIGRlIHBhc3RhIHF1ZSBjb250XHUwMEU5bSBub3RhcyBjb20gYHVyZ2VuY3lgLlxuICAvLyBDb3IgcGVsbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vOyBob3ZlciBsaXN0YSBvcyBhcnF1aXZvcy4gRmFzZSAxMC5cbiAgcHJpdmF0ZSB1cmdlbmN5QmFkZ2UoY2FyZDogSFRNTEVsZW1lbnQsIHVyZzogVXJnZW5jeUluZm8pIHtcbiAgICBpZiAoIXVyZy5tYXgpIHJldHVybjtcbiAgICBjb25zdCBiID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1iYWRnZSB3ZC11LSR7dXJnLm1heH1gIH0pO1xuICAgIHNldEljb24oYiwgXCJ0cmlhbmdsZS1hbGVydFwiKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1VyZ2VuY3lUaXAoYiwgdXJnLml0ZW1zKSk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUaXAoKSB7XG4gICAgaWYgKHRoaXMudGlwKSB7IHRoaXMudGlwLnJlbW92ZSgpOyB0aGlzLnRpcCA9IG51bGw7IH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGlwKGNhcmQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByZWNlbnRzID0gcmVjZW50Tm90ZXMoZm9sZGVyLCA0KTtcbiAgICBpZiAoIXJlY2VudHMubGVuZ3RoKSByZXR1cm47XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUaXAoY2FyZCwgcmVjZW50cykpO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhbGVuZFx1MDBFMXJpbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckNhbGVuZGFyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0NBTCkpIHJldHVybjtcblxuICAgIGNvbnN0IG1vbmRheSAgPSBtb25kYXlPZih0aGlzLndlZWtPZmZzZXQpO1xuICAgIGNvbnN0IHdlZWtOdW0gPSBpc29XZWVrTnVtYmVyKG1vbmRheSk7XG4gICAgY29uc3QgdG9kYXlLICA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gRm9udGVzIGF0aXZhcyAocGFzdGFzIG1hcmNhZGFzKS4gQSBjb3IgZGUgY2FkYSBub3RhIHZlbSBkYSBmb250ZSBkZVxuICAgIC8vIHByZWZpeG8gbWFpcyBlc3BlY1x1MDBFRGZpY28gcXVlIGEgY29udFx1MDBFOW0uXG4gICAgY29uc3Qgc291cmNlcyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5maWx0ZXIocyA9PiBzLm9uKTtcbiAgICBjb25zdCBjb2xvckZvciA9IChwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIGxldCBiZXN0OiBDYWxTb3VyY2UgfCBudWxsID0gbnVsbDtcbiAgICAgIGZvciAoY29uc3QgcyBvZiBzb3VyY2VzKSB7XG4gICAgICAgIGlmIChwYXRoID09PSBgJHtzLnBhdGh9Lm1kYCB8fCBwYXRoLnN0YXJ0c1dpdGgoYCR7cy5wYXRofS9gKSkge1xuICAgICAgICAgIGlmICghYmVzdCB8fCBzLnBhdGgubGVuZ3RoID4gYmVzdC5wYXRoLmxlbmd0aCkgYmVzdCA9IHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZXN0ID8gYmVzdC5jb2xvciA6IG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZzsgZmlsZTogVEZpbGU7IGNvbG9yOiBzdHJpbmcgfVtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gY29sb3JGb3IoZmlsZS5wYXRoKTtcbiAgICAgIGlmICghY29sb3IpIGNvbnRpbnVlOyAgIC8vIHNcdTAwRjMgbm90YXMgZGVudHJvIGRlIHVtYSBmb250ZSBtYXJjYWRhXG4gICAgICBjb25zdCBtID0gZmlsZS5iYXNlbmFtZS5tYXRjaCgvXihcXGR7NH0tXFxkezJ9LVxcZHsyfSkvKTtcbiAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpID8/IChtID8gbVsxXSA6IG51bGwpO1xuICAgICAgaWYgKGQpIChieURheVtkXSA/Pz0gW10pLnB1c2goeyBuYW1lOiBmaWxlLmJhc2VuYW1lLCBmaWxlLCBjb2xvciB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWNhbC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgbmF2ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmF2LWJhclwiIH0pO1xuICAgIGNvbnN0IHBob25lID0gUGxhdGZvcm0uaXNQaG9uZTtcblxuICAgIC8vIENlbHVsYXI6IGphbmVsYSBkZSAzIGRpYXMgPSBvbnRlbSBcdTAwQjcgaG9qZSBcdTAwQjcgYW1hbmhcdTAwRTMgKHdlZWtPZmZzZXQgcGFnaW5hIGRlIDMgZW0gMykuXG4gICAgY29uc3QgZGF5QW5jaG9yID0gbmV3IERhdGUoKTtcbiAgICBkYXlBbmNob3Iuc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpIC0gMSArIHRoaXMud2Vla09mZnNldCAqIDMpO1xuICAgIGNvbnN0IGZtdERNID0gKGQ6IERhdGUpID0+IGAke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMiwgXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCBcIjBcIil9YDtcblxuICAgIGlmIChwaG9uZSkge1xuICAgICAgY29uc3QgbGFzdCA9IG5ldyBEYXRlKGRheUFuY2hvcik7IGxhc3Quc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpICsgMik7XG4gICAgICBuYXYuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtd2Vlay1sYWJlbFwiLCB0ZXh0OiBgJHtmbXRETShkYXlBbmNob3IpfSBcdTIwMTMgJHtmbXRETShsYXN0KX1gIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYXYuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtd2Vlay1sYWJlbFwiLCB0ZXh0OiBgU2VtYW5hICR7d2Vla051bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGN0cmxzID0gbmF2LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtY3RybHNcIiB9KTtcbiAgICBjb25zdCBwcmV2ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwMzlcIiB9KTtcbiAgICBjb25zdCBuZXh0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICBwcmV2Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldC0tOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIG5leHQub25jbGljayA9ICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0Kys7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2VsdWxhcjogbGlzdGEgdmVydGljYWwgZGUgMyBkaWFzIChvbnRlbS9ob2plL2FtYW5oXHUwMEUzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBDYWRhIGRpYSA9IGEgbm90YSBkaVx1MDBFMXJpYSAodW1hIHBvciBkaWEpLiBMaW5oYSBpbnRlaXJhIGNsaWNcdTAwRTF2ZWw6IGFicmUgYVxuICAgIC8vIGV4aXN0ZW50ZTsgc2Ugblx1MDBFM28gaG91dmVyLCBjcmlhLlxuICAgIGlmIChwaG9uZSkge1xuICAgICAgY29uc3QgbGlzdCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWxpc3RcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKGRheUFuY2hvcik7XG4gICAgICAgIGRheS5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgICAgY29uc3QgZG93ID0gKGRheS5nZXREYXkoKSArIDYpICUgNztcbiAgICAgICAgY29uc3Qgbm90ZSA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtZHJvd1wiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGRvdyA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICAgIH0pO1xuICAgICAgICByb3cuc2V0QXR0cihcInRpdGxlXCIsIG5vdGUgPyBcIkFicmlyIG5vdGEgZGlcdTAwRTFyaWFcIiA6IFwiQ3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgICAgY29uc3QgaGQgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LWhkXCIgfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2Rvd10gfSk7XG4gICAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLW51bVwiLCB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1kcm93LW5vdGVzXCIgfSk7XG4gICAgICAgIGlmIChub3RlKSB7XG4gICAgICAgICAgY29uc3QgcGlsbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgICAgcGlsbC50ZXh0Q29udGVudCA9IG5vdGUuYmFzZW5hbWUubGVuZ3RoID4gMjQgPyBub3RlLmJhc2VuYW1lLnNsaWNlKDAsIDI0KSArIFwiXHUyMDI2XCIgOiBub3RlLmJhc2VuYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvZHkuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtZHJvdy1lbXB0eVwiLCB0ZXh0OiBcImNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICByb3cub25jbGljayA9ICgpID0+IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIERlc2t0b3AvdGFibGV0OiBncmFkZSBkZSA3IGRpYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWdyaWRcIiB9KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICAgIGRheS5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBjb2wgPSBncmlkLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogW1wid2QtY2FsLWNvbFwiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGkgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBoZCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWhkXCIgfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2ldIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1udW1cIiwgIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgIGhkLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIC8gY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgIGhkLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KTsgfTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldID8/IFtdO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcy5zbGljZSgwLCAzKSkge1xuICAgICAgICBjb25zdCBwaWxsID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICBwaWxsLnN0eWxlLnNldFByb3BlcnR5KFwiLS13ZC1zcmNcIiwgaXQuY29sb3IpO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtZG90XCIgfSk7XG4gICAgICAgIHBpbGwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtcGlsbC10eHRcIiwgdGV4dDogaXQubmFtZS5sZW5ndGggPiAxNCA/IGl0Lm5hbWUuc2xpY2UoMCwgMTQpICsgXCJcdTIwMjZcIiA6IGl0Lm5hbWUgfSk7XG4gICAgICAgIHBpbGwub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShpdC5maWxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAzKSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1tb3JlXCIsIHRleHQ6IGArJHtpdGVtcy5sZW5ndGggLSAzfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICBlbmQuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgNik7XG4gICAgc2VjLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IFwid2QtY2FsLWZvb3RlclwiLFxuICAgICAgdGV4dDogbW9uZGF5LmdldE1vbnRoKCkgPT09IGVuZC5nZXRNb250aCgpXG4gICAgICAgID8gYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSAke21vbmRheS5nZXRGdWxsWWVhcigpfWBcbiAgICAgICAgOiBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19IFx1MjAxMyAke01PTlRIX1NIT1JUW2VuZC5nZXRNb250aCgpXX0gJHtlbmQuZ2V0RnVsbFllYXIoKX1gLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQWNoYSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWAgKFlZWVktTU0tREQpOiBwcmltZWlybyBwZWxvIGNhbWluaG8gY2FuXHUwMEY0bmljbyBlbVxuICAvLyA1MC5EaVx1MDBFMXJpby8sIHNlblx1MDBFM28gcXVhbHF1ZXIgbm90YSBjdWpvIGBkYXRlOmAgc2VqYSBlc3NlIGRpYS4gTnVsbCBzZSBuXHUwMEUzbyBob3V2ZXIuXG4gIC8vIChSZWxhdFx1MDBGM3Jpby9ub3RhIGRpXHUwMEUxcmlhIFx1MDBFOSB1bSBwb3IgZGlhIFx1MjE5MiBhYnJlIG8gZXhpc3RlbnRlIGVtIHZleiBkZSBjcmlhciBvdXRyby4pXG4gIHByaXZhdGUgZmluZERhaWx5Tm90ZShrZXk6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZGlyZWN0ID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCk7XG4gICAgaWYgKGRpcmVjdCBpbnN0YW5jZW9mIFRGaWxlKSByZXR1cm4gZGlyZWN0O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpID09PSBrZXkpIHJldHVybiBmO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFicmUgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgOyBjcmlhIGVtIDUwLkRpXHUwMEUxcmlvLyBTXHUwMEQzIHNlIG5cdTAwRTNvIGV4aXN0aXIgbmVuaHVtYS5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuRGFpbHlOb3RlKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcpIHsgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGV4aXN0aW5nKTsgcmV0dXJuOyB9XG5cbiAgICAvLyBOXHUwMEUzbyBleGlzdGUgXHUyMTkyIGNyaWEgbm8gY2FtaW5obyBjYW5cdTAwRjRuaWNvLlxuICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX0ZPTERFUikpXG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoREFJTFlfRk9MREVSKS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBjb25zdCBbeSwgbSwgZF0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgIGNvbnN0IHRpdHVsbyA9IG5ldyBEYXRlKCt5LCArbSAtIDEsICtkKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICB9KTtcblxuICAgIC8vIFVzYSBvIHRlbXBsYXRlIGVtIE1vZGVsb3MvIHNlIGV4aXN0aXI7IHNlblx1MDBFM28sIGZhbGxiYWNrIGVtYnV0aWRvLlxuICAgIGNvbnN0IHRwbCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9URU1QTEFURSk7XG4gICAgbGV0IGJvZHk6IHN0cmluZztcbiAgICBpZiAodHBsIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgIGJvZHkgPSAoYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0cGwpKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmRhdGVcXHMqXFx9XFx9L2csIGtleSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyp0aXRsZVxccypcXH1cXH0vZywgdGl0dWxvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keSA9XG5gLS0tXG5vd25lcjogV2VydXNcbmNyZWF0ZWQ6ICR7a2V5fVxuZGF0ZTogJHtrZXl9XG5yZXZpZXdlZDogdHJ1ZVxudHlwZTogZGFpbHlcbnBlcm1pc3Npb25zOlxuICByZWFkOiBbYWxsXVxuICB3cml0ZTpcbiAgICAtIFdlcnVzXG4tLS1cblxuIyAke3RpdHVsb31cblxuYDtcbiAgICB9XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGAsIGJvZHkpO1xuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkcyBkbyBjb2ZyZSAodG9kYXMgYXMgcGFzdGFzIGRlIHRvcG8pICsgbmF2ZWdhZG9yIGFuaW5oYWRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyUGFyYShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19QQVJBKSkgcmV0dXJuO1xuICAgIC8vIFNlIGEgcGFzdGEgYWJlcnRhIG5vIG5hdmVnYWRvciBmb2kgb2N1bHRhZGEgbmFzIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzLCBmZWNoYS5cbiAgICBpZiAodGhpcy5uYXZQYXRoICYmIHRoaXMuaXNIaWRkZW4odGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpKSkgdGhpcy5uYXZQYXRoID0gbnVsbDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNPRlJFXCIgfSk7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYXJhLWdyaWRcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSAgIC8vIGlnbm9yYSAub2JzaWRpYW4sIC50cmFzaCwgZXRjLlxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgY29uc3QgYWN0aXZlUm9vdCA9IHRoaXMubmF2UGF0aCA/IHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSA6IG51bGw7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBtZXRhICAgID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHN0YXRzICAgPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSBzdWJGb2xkZXJzKGZvbGRlcikubGVuZ3RoID4gMCB8fCBmaWxlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB1cmdlbmN5U3RhdHModGhpcy5hcHAsIGZvbGRlcikpO1xuXG4gICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGZvbGRlcik7XG5cbiAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaWYgKG5hdmlnYWJsZSkgeyB0aGlzLm5hdlBhdGggPSBpc0FjdGl2ZSA/IG51bGwgOiBmb2xkZXIucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfVxuICAgICAgICBlbHNlIHJldmVhbEluRXhwbG9yZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IGZpbGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBhaW5lbCBpbmxpbmUgbmF2ZWdcdTAwRTF2ZWwgKGJyZWFkY3J1bWIgKyBzdWJwYXN0YXMgKyBub3RhcyBkYSBwYXN0YSBhdHVhbClcbiAgcHJpdmF0ZSByZW5kZXJCcm93c2VyKHBhcmVudDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy50b3BGb2xkZXJPZihmb2xkZXIucGF0aCk7XG4gICAgY29uc3Qgcm9vdEZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyb290UGF0aCk7XG4gICAgaWYgKCEocm9vdEZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIHJvb3RGb2xkZXIpO1xuXG4gICAgY29uc3QgcGFuZWwgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhbmVsXCIgfSk7XG4gICAgcGFuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAvLyBCcmVhZGNydW1iXG4gICAgY29uc3QgY3J1bWIgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY3J1bWJcIiB9KTtcbiAgICBjb25zdCByZWwgPSBmb2xkZXIucGF0aCA9PT0gcm9vdFBhdGggPyBbXSA6IGZvbGRlci5wYXRoLnNsaWNlKHJvb3RQYXRoLmxlbmd0aCArIDEpLnNwbGl0KFwiL1wiKTtcblxuICAgIGNvbnN0IHJvb3RTZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKHJlbC5sZW5ndGggPT09IDAgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpIH0pO1xuICAgIHJlbmRlckljb24ocm9vdFNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICByb290U2VnLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgIGlmIChyZWwubGVuZ3RoKSByb290U2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHJvb3RQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgbGV0IGFjYyA9IHJvb3RQYXRoO1xuICAgIHJlbC5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XG4gICAgICBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlcFwiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gcmVsLmxlbmd0aCAtIDE7XG4gICAgICBhY2MgPSBgJHthY2N9LyR7cGFydH1gO1xuICAgICAgY29uc3Qgc2VnUGF0aCA9IGFjYztcbiAgICAgIGNvbnN0IHNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAoaXNMYXN0ID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSwgdGV4dDogcGFydCB9KTtcbiAgICAgIGlmICghaXNMYXN0KSBzZWcub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2VnUGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3NlID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1jbG9zZVwiLCB0ZXh0OiBcIlx1MjcxNVwiIH0pO1xuICAgIGNsb3NlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkZlY2hhclwiKTtcbiAgICBjbG9zZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gQ2FtcG8gZGUgYnVzY2FcbiAgICBjb25zdCBzZWFyY2hXcmFwID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYXJjaC13cmFwXCIgfSk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hXcmFwLmNyZWF0ZUVsKFwiaW5wdXRcIiwge1xuICAgICAgY2xzOiBcIndkLXNlYXJjaFwiLFxuICAgICAgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiZmlsdHJhclx1MjAyNlwiLCB2YWx1ZTogdGhpcy5zZWFyY2hUZXJtIH0sXG4gICAgfSk7XG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtc3ViLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxibCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2QtbGFiZWxcIik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBsYmwuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLW5vdGUtcm93LCAud2Qtbm90ZS1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2Qtbm90ZS1uYW1lLCAud2Qtbm90ZS1jYXJkLW5hbWVcIik/LnRleHRDb250ZW50ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBuYW1lLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJwYXN0YXMgY29tbyBjYXJkc1xuICAgIGNvbnN0IHN1YnMgPSBzdWJGb2xkZXJzKGZvbGRlcik7XG4gICAgaWYgKHN1YnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZ3JpZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9qLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3Qgc2Ygb2Ygc3Vicykge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWFkRm9sZGVyU3RhdHVzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IHN0YXRzICA9IGZvbGRlclN0YXRzKHNmKTtcbiAgICAgICAgY29uc3QgY292ZXIgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBkZWVwZXIgPSBzdWJGb2xkZXJzKHNmKS5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBjdXN0b21JY29uID0gcmVhZEZvbGRlckljb24odGhpcy5hcHAsIHNmKTtcblxuICAgICAgICBjb25zdCBjYXJkID0gc2dyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtY2FyZCB3ZC1zdWItY2FyZCB3ZC1zLSR7c3RhdHVzfWAgfSk7XG4gICAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBzdXRpbCAodmVyc1x1MDBFM28gbWVub3IgcXVlIGFzIHBhc3RhcyBkZSB0b3BvKSBcdTIwMTQgRmFzZSA5LjFcbiAgICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHQgd2QtY292ZXItc3ViXCIgfSk7XG4gICAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIGN1c3RvbUljb24gPz8gXCJcdUQ4M0RcdURDQzFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLWJhZGdlIHdkLWJhZGdlLSR7c3RhdHVzfWAsIHRleHQ6IFNUQVRVU19JQ09OW3N0YXR1c10gfSk7XG4gICAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHVyZ2VuY3lTdGF0cyh0aGlzLmFwcCwgc2YpKTtcblxuICAgICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgICBpZiAoY3VzdG9tSWNvbikgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uIHdkLXN1Yi1pY29uXCIgfSksIGN1c3RvbUljb24pO1xuICAgICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoc3RhdHMpIH0pO1xuICAgICAgICBpZiAoZGVlcGVyKSB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdWItYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcblxuICAgICAgICBjb25zdCBsYWJlbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsIHRleHQ6IHNmLm5hbWUgfSk7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIGxhYmVsLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIHNmKTtcbiAgICAgICAgICBpZiAocnYudG90YWwgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKX0lYDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY2FyZC5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBzZik7XG4gICAgICAgICAgY2FyZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZi5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXJxdWl2b3MgZGEgcGFzdGEgYXR1YWwgKG5vdGFzLCBjYW52YXMsIGJhc2VzKVxuICAgIGNvbnN0IG5vdGVzID0gZmlsZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYXRtYXAgKHZpYSBwbHVnaW4gSGVhdG1hcCBDYWxlbmRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWF0bWFwKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0hFQVQpKSByZXR1cm47XG4gICAgaWYgKFBsYXRmb3JtLmlzUGhvbmUpIHJldHVybjsgICAvLyBoZWF0bWFwIChhbm8gaW50ZWlybykgb2N1bHRhZG8gbm8gY2VsdWxhclxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhLCBubyBhbm8gY29ycmVudGUuXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoZi5zdGF0LmN0aW1lKTtcbiAgICAgIGlmIChkLmdldEZ1bGxZZWFyKCkgIT09IHllYXIpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuICAgIGNvbnN0IGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdID0gT2JqZWN0LmVudHJpZXMoY291bnRzKS5tYXAoKFtkYXRlLCBuXSkgPT4gKHtcbiAgICAgIGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAsXG4gICAgfSkpO1xuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDAsIGNyZWF0ZWRUaGlzV2VlayA9IDA7XG4gICAgY29uc3Qgd2Vla0FnbyA9IERhdGUubm93KCkgLSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBjb250aW51ZTtcbiAgICAgIHRvdGFsTm90ZXMrKztcbiAgICAgIGlmICh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgdG90YWxSZXZpZXdlZCsrO1xuICAgICAgaWYgKGYuc3RhdC5jdGltZSA+PSB3ZWVrQWdvKSBjcmVhdGVkVGhpc1dlZWsrKztcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsUGN0ID0gdG90YWxOb3RlcyA+IDAgPyBNYXRoLnJvdW5kKHRvdGFsUmV2aWV3ZWQgLyB0b3RhbE5vdGVzICogMTAwKSA6IDA7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJFU1RBVFx1MDBDRFNUSUNBU1wiIH0pO1xuXG4gICAgLy8gTlx1MDBGQW1lcm9zIGdsb2JhaXNcbiAgICBjb25zdCBnbG9iID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWdsb2JhbFwiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZ1wiLCB0ZXh0OiBTdHJpbmcodG90YWxOb3RlcykgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwibm90YXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWcgd2Qtc3RhdC1yZXYtbnVtXCIsIHRleHQ6IGAke2dsb2JhbFBjdH0lYCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJyZXZpc2FkYXNcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1zZXBcIiwgdGV4dDogXCJcdTAwQjdcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC13ZWVrXCIsIHRleHQ6IGArJHtjcmVhdGVkVGhpc1dlZWt9YCB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJlc3RhIHNlbWFuYVwiIH0pO1xuXG4gICAgLy8gQnJlYWtkb3duIHBvciBwYXN0YVxuICAgIGNvbnN0IHRhYmxlID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXRhYmxlXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuXG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA9PT0gMCkgY29udGludWU7XG4gICAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHBjdCA9IE1hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCk7XG5cbiAgICAgIGNvbnN0IHJvdyA9IHRhYmxlLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXJvd1wiIH0pO1xuICAgICAgcm93LnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgICBjb25zdCBuYW1lRWwgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZm9sZGVyXCIgfSk7XG4gICAgICByZW5kZXJJY29uKG5hbWVFbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgbmFtZUVsLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtY291bnRcIiwgdGV4dDogYCR7cnYudG90YWx9YCB9KTtcblxuICAgICAgY29uc3QgYmFyV3JhcCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXJcIiB9KTtcbiAgICAgIGJhcldyYXAuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXMgKCR7cGN0fSUpYCk7XG4gICAgICBjb25zdCBmaWxsID0gYmFyV3JhcC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1iYXItZmlsbFwiIH0pO1xuICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LXBjdFwiLCB0ZXh0OiBgJHtwY3R9JWAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIExpc3RhIC8gZ3JhZGUgZGUgbm90YXMgY29tIHRvZ2dsZSBlIGluZGljYWRvciByZXZpZXdlZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlck5vdGVzKHBhcmVudDogSFRNTEVsZW1lbnQsIG5vdGVzOiBURmlsZVtdLCBsYWJlbCA9IFwiXCIpIHtcbiAgICBpZiAoIW5vdGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGlzR3JpZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID09PSBcImdyaWRcIjtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IHRoaXMucmV2aWV3RmlsdGVyID8gbm90ZXMuZmlsdGVyKGYgPT4gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgIT09IHRydWUpIDogbm90ZXM7XG5cbiAgICBjb25zdCBoZHIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWhkclwiIH0pO1xuICAgIGNvbnN0IGNvdW50VHh0ID0gdGhpcy5yZXZpZXdGaWx0ZXJcbiAgICAgID8gYCR7ZmlsdGVyZWQubGVuZ3RofSBwZW5kZW50ZSR7ZmlsdGVyZWQubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifSAvICR7bm90ZXMubGVuZ3RofWBcbiAgICAgIDogKGxhYmVsIHx8IGAke25vdGVzLmxlbmd0aH0gbm90YSR7bm90ZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWApO1xuICAgIGhkci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGVzLWxhYmVsXCIsIHRleHQ6IGNvdW50VHh0IH0pO1xuXG4gICAgY29uc3QgdG9nID0gaGRyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC12aWV3LXRvZ2dsZVwiIH0pO1xuICAgIGNvbnN0IGJ0blBlbmQgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKHRoaXMucmV2aWV3RmlsdGVyID8gXCIgd2Qtdmlldy1hY3RpdmUgd2Qtdmlldy1wZW5kXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1Q0JcIiB9KTtcbiAgICBidG5QZW5kLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vc3RyYXIgc1x1MDBGMyBwZW5kZW50ZXMgKG5cdTAwRTNvIHJldmlzYWRhcylcIik7XG4gICAgYnRuUGVuZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucmV2aWV3RmlsdGVyID0gIXRoaXMucmV2aWV3RmlsdGVyOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkwgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCFpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjYxXCIgfSk7XG4gICAgYnRuTC5zZXRBdHRyKFwidGl0bGVcIiwgXCJMaXN0YVwiKTtcbiAgICBidG5MLm9uY2xpY2sgPSBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImxpc3RcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgYnRuRyA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI5RVwiIH0pO1xuICAgIGJ0bkcuc2V0QXR0cihcInRpdGxlXCIsIFwiQ29sdW5hc1wiKTtcbiAgICBidG5HLm9uY2xpY2sgPSBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImdyaWRcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG5cbiAgICBpZiAoIWZpbHRlcmVkLmxlbmd0aCkge1xuICAgICAgcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiB0aGlzLnJldmlld0ZpbHRlciA/IFwiTmVuaHVtYSBub3RhIHBlbmRlbnRlIG5lc3RhIHBhc3RhLlwiIDogXCJOZW5odW1hIG5vdGEuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzR3JpZCkge1xuICAgICAgY29uc3QgZ3JpZCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY2FyZCB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBwb3IgdGlwbyBkZSBhcnF1aXZvIChub3RhIC8gY2FudmFzIC8gYmFzZSkgXHUyMDE0IEZhc2UgOS4yXG4gICAgICAgIGNvbnN0IGNvdiA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jb3ZlciB3ZC1maWxlLSR7Zi5leHRlbnNpb259YCB9KTtcbiAgICAgICAgc2V0SWNvbihjb3YuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLWNvdmVyLWdseXBoXCIgfSksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuXG4gICAgICAgIGlmIChpc01kKSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHVyZykgeyBjb25zdCB3ID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cblxuICAgICAgICBjb25zdCBuYW1lID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIGNhcmQub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGlzdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLXJvdyB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgY29uc3QgdGkgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtdHlwZWljb24gd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24odGksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLWRvdCB3ZC1iYWRnZS0ke3N0fWAgfSk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBHclx1MDBFMWZpY28gZGUgY3Jlc2NpbWVudG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJHcm93dGgocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfR1JPVykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNSRVNDSU1FTlRPIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBidG5EYXkgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJkaWFcIiB9KTtcbiAgICBidG5EYXkuc2V0QXR0cihcInRpdGxlXCIsIFwiTm90YXMgY3JpYWRhcyBwb3IgZGlhXCIpO1xuICAgIGJ0bkRheS5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkN1bSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwidG90YWxcIiB9KTtcbiAgICBidG5DdW0uc2V0QXR0cihcInRpdGxlXCIsIFwiVG90YWwgYWN1bXVsYWRvIG5vIHBlclx1MDBFRG9kb1wiKTtcbiAgICBidG5DdW0ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSB0cnVlOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gQWdydXBhIG5vdGFzIHBvciBkYXRhIGRlIGNyaWFcdTAwRTdcdTAwRTNvXG4gICAgY29uc3QgY291bnRzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkobmV3IERhdGUoZi5zdGF0LmN0aW1lKSk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuXG4gICAgLy8gXHUwMERBbHRpbW9zIE4gZGlhcyAobWVub3Mgbm8gY2VsdWxhcilcbiAgICBjb25zdCBEQVlTID0gUGxhdGZvcm0uaXNQaG9uZSA/IDE1IDogMzA7XG4gICAgY29uc3QgZGF5czogeyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gREFZUyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb25zdCBbLCBtLCBkYXldID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICAgIGRheXMucHVzaCh7IGtleSwgY291bnQ6IGNvdW50c1trZXldID8/IDAsIGxhYmVsOiBgJHtkYXl9LyR7bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsID0gZGF5cy5yZWR1Y2UoKHMsIGQpID0+IHMgKyBkLmNvdW50LCAwKTtcbiAgICBjb25zdCB0b2RheUtleSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gTW9kbyBjdW11bGF0aXZvOiBzb21hIGFjdW11bGFkYSBkaWEgYSBkaWFcbiAgICB0eXBlIERheUVudHJ5ID0geyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgZGlzcGxheVZhbDogbnVtYmVyIH07XG4gICAgbGV0IGVudHJpZXM6IERheUVudHJ5W107XG4gICAgaWYgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkge1xuICAgICAgbGV0IGFjYyA9IDA7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiB7IGFjYyArPSBkLmNvdW50OyByZXR1cm4geyAuLi5kLCBkaXNwbGF5VmFsOiBhY2MgfTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+ICh7IC4uLmQsIGRpc3BsYXlWYWw6IGQuY291bnQgfSkpO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5lbnRyaWVzLm1hcChlID0+IGUuZGlzcGxheVZhbCksIDEpO1xuXG4gICAgLy8gTGluaGEgZGUgcmVzdW1vXG4gICAgY29uc3QgaW5mbyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWluZm9cIiB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXRvdGFsXCIsIHRleHQ6IGAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGVudHJpZXNbZW50cmllcy5sZW5ndGggLSAxXS5kaXNwbGF5VmFsIDogdG90YWx9YCB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXBlcmlvZFwiLCB0ZXh0OiB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBgbm90YXMgYWN1bXVsYWRhcyAoJHtEQVlTfSBkaWFzKWAgOiBgbm90YXMgY3JpYWRhcyBub3MgXHUwMEZBbHRpbW9zICR7REFZU30gZGlhc2AgfSk7XG5cbiAgICAvLyBHclx1MDBFMWZpY28gZGUgYmFycmFzXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoeyBrZXksIGNvdW50LCBsYWJlbCwgZGlzcGxheVZhbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBkaXNwbGF5VmFsID09PSAwO1xuICAgICAgY29uc3QgYmFyID0gYmFyQXJlYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhclwiICsgKGlzRW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGlzRW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoZGlzcGxheVZhbCAvIG1heCkgKiAxMDApKX0lYDtcbiAgICAgIGlmICghaXNFbXB0eSkgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtsYWJlbH06ICR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZGlzcGxheVZhbCArIFwiIHRvdGFsXCIgOiBjb3VudCArIFwiIG5vdGEocylcIn1gKTtcblxuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IDcgfHwgaWR4ID09PSAxNCB8fCBpZHggPT09IDIxIHx8IGlkeCA9PT0gMjkgfHwga2V5ID09PSB0b2RheUtleTtcbiAgICAgIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWxibFwiLCB0ZXh0OiBzaG93TGJsID8gbGFiZWwgOiBcIlwiIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgKEZhc2UgOC4xIFx1MjAxNCBsZWl0dXJhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclRvZG9pc3Qocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfVE9ETykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcblxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIC8vIFRvZ2dsZSBkZSBqYW5lbGEgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiAoMyAvIDcpLlxuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgICBjb25zdCBzZWcgPSBjdHJscy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yYW5nZVwiIH0pO1xuICAgICAgZm9yIChjb25zdCBuIG9mIFszLCA3XSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBiID0gc2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yYW5nZS1idG5cIiArIChyYW5nZSA9PT0gbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogYCR7bn1kYCB9KTtcbiAgICAgICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgYE1vc3RyYXIgb3MgcHJcdTAwRjN4aW1vcyAke259IGRpYXNgKTtcbiAgICAgICAgYi5vbmNsaWNrID0gYXN5bmMgZSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSBuO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIEJvdFx1MDBFM28gZGUgZmlsdHJvcyAocHJvamV0by9ldGlxdWV0YSkuXG4gICAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgICBjb25zdCBuRiA9IGYucHJvamVjdHMubGVuZ3RoICsgZi5sYWJlbHMubGVuZ3RoO1xuICAgICAgY29uc3QgZmlsdCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0ZXJidG5cIiArICh0aGlzLnRvZG9pc3RGaWx0ZXJPcGVuID8gXCIgd2Qtb25cIiA6IFwiXCIpICsgKG5GID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24oZmlsdCwgXCJmaWx0ZXJcIik7XG4gICAgICBmaWx0LnNldEF0dHIoXCJ0aXRsZVwiLCBuRiA/IGBGaWx0cm9zIGF0aXZvcyAoJHtuRn0pIFx1MjAxNCBjbGlxdWUgcGFyYSBhanVzdGFyYCA6IFwiRmlsdHJhciBwb3IgcHJvamV0by9ldGlxdWV0YVwiKTtcbiAgICAgIGlmIChuRikgZmlsdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmlsdGN0XCIsIHRleHQ6IFN0cmluZyhuRikgfSk7XG4gICAgICBmaWx0Lm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy50b2RvaXN0RmlsdGVyT3BlbiA9ICF0aGlzLnRvZG9pc3RGaWx0ZXJPcGVuOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgICBjb25zdCByZWZyZXNoID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlZnJlc2hcIiArICh0aGlzLnRvZG9pc3RMb2FkaW5nID8gXCIgd2Qtc3BpblwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHJlZnJlc2gsIFwicmVmcmVzaC1jd1wiKTtcbiAgICAgIHJlZnJlc2guc2V0QXR0cihcInRpdGxlXCIsIFwiQXR1YWxpemFyIHRhcmVmYXMgZG8gVG9kb2lzdFwiKTtcbiAgICAgIHJlZnJlc2gub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuZmV0Y2hUb2RvaXN0KHRydWUpOyB9O1xuXG4gICAgICB0aGlzLmFkZFRhc2tCdG4oY3RybHMsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ29sZSBzZXUgdG9rZW4gZG8gVG9kb2lzdCBlbSBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgV2VydXMgRGFzaGJvYXJkIHBhcmEgdmVyIHN1YXMgdGFyZWZhcyBhcXVpLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFByaW1laXJhIGNhcmdhIHByZWd1aVx1MDBFN29zYSAoblx1MDBFM28gcmVmYXogZW0gbG9vcCBzZSBqXHUwMEUxIGJ1c2NvdSBvdSBzZSBkZXUgZXJybykuXG4gICAgaWYgKCF0aGlzLnRvZG9pc3RGZXRjaGVkQXQgJiYgIXRoaXMudG9kb2lzdExvYWRpbmcgJiYgIXRoaXMudG9kb2lzdEVycm9yKSB2b2lkIHRoaXMuZmV0Y2hUb2RvaXN0KGZhbHNlKTtcblxuICAgIGlmICh0aGlzLnRvZG9pc3RFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMudG9kb2lzdEVycm9yfWAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy50b2RvaXN0RmV0Y2hlZEF0KSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ2FycmVnYW5kbyB0YXJlZmFzXHUyMDI2XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQmFycmEgZGUgZmlsdHJvcyAocmVjb2xoXHUwMEVEdmVsKS5cbiAgICBpZiAodGhpcy50b2RvaXN0RmlsdGVyT3BlbikgdGhpcy5yZW5kZXJUb2RvRmlsdGVyQmFyKHNlYyk7XG5cbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZGF5UmFuZ2UoKTtcbiAgICBjb25zdCB0b2RheUsgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBsYXN0VXBjb21pbmcgPSBuZXcgRGF0ZSgpO1xuICAgIGxhc3RVcGNvbWluZy5zZXREYXRlKGxhc3RVcGNvbWluZy5nZXREYXRlKCkgKyByYW5nZSk7XG4gICAgY29uc3QgbGFzdEsgPSB0b0tleShsYXN0VXBjb21pbmcpOyAgIC8vIGxpbWl0ZSBkb3MgXCJwclx1MDBGM3hpbW9zIGRpYXNcIiAoaW5jbHVzaXZlKVxuXG4gICAgLy8gQXBsaWNhIGZpbHRyb3MgZSBzZXBhcmEgZW0gYmFsZGVzOiBhdHJhc2FkYXMgXHUwMEI3IGhvamUgXHUwMEI3IHByXHUwMEYzeGltb3MgTiBkaWFzIFx1MDBCNyBkZXBvaXMuXG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmFwcGx5VG9kb2lzdEZpbHRlcnModGhpcy50b2RvaXN0VGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgY29udGludWU7ICAgLy8gc2VtIGRhdGE6IGZvcmEgZG9zIGJsb2NvcyBwb3IgZGlhIChwb2Rlclx1MDBFMSB2aXJhciBcIkNhaXhhIGRlIGVudHJhZGFcIiBubyBmdXR1cm8pXG4gICAgICBpZiAoZGsgPCB0b2RheUspIG92ZXJkdWUucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrID09PSB0b2RheUspIHRvZGF5VGFza3MucHVzaCh0KTtcbiAgICAgIGVsc2UgaWYgKGRrIDw9IGxhc3RLKSAoYnlEYXlbZGtdID8/PSBbXSkucHVzaCh0KTtcbiAgICAgIGVsc2UgbGF0ZXIucHVzaCh0KTtcbiAgICB9XG4gICAgY29uc3QgYnlQcmkgPSAoYTogVG9kb2lzdFRhc2ssIGI6IFRvZG9pc3RUYXNrKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICBvdmVyZHVlLnNvcnQoYnlQcmkpOyB0b2RheVRhc2tzLnNvcnQoYnlQcmkpOyBsYXRlci5zb3J0KGJ5UHJpKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoYnlEYXkpKSBieURheVtrXS5zb3J0KGJ5UHJpKTtcblxuICAgIGNvbnN0IHZpc2libGUgPSBvdmVyZHVlLmxlbmd0aCArIHRvZGF5VGFza3MubGVuZ3RoICsgbGF0ZXIubGVuZ3RoICsgT2JqZWN0LnZhbHVlcyhieURheSkucmVkdWNlKChzLCBhKSA9PiBzICsgYS5sZW5ndGgsIDApO1xuICAgIGlmICh2aXNpYmxlID09PSAwKSB7XG4gICAgICBjb25zdCBhbGwgPSB0aGlzLnRvZG9pc3RUYXNrcy5sZW5ndGg7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IGFsbCA/IFwiTmVuaHVtYSB0YXJlZmEgYmF0ZSBjb20gb3MgZmlsdHJvcy5cIiA6IFwiTmVuaHVtYSB0YXJlZmEgY29tIGRhdGEgbm8gVG9kb2lzdC4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGluaGEgaG9yaXpvbnRhbCBjb20gMyBjYWl4YXMgbGFkbyBhIGxhZG86IEF0cmFzYWRhcyBcdTAwQjcgSG9qZSBcdTAwQjcgUHJcdTAwRjN4aW1vcyBOIGRpYXMuXG4gICAgY29uc3QgY29scyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1jb2xzXCIgfSk7XG5cbiAgICAvLyAxXHUwMEFBIFx1MjAxNCBBdHJhc2FkYXMgKGNhaXhhIHZlcm1lbGhhKS5cbiAgICBjb25zdCBvYm94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LW92ZXJkdWVcIiB9KTtcbiAgICBjb25zdCBvaGQgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3h3YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkF0cmFzYWRhc1wiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKG92ZXJkdWUubGVuZ3RoKSB9KTtcbiAgICBjb25zdCBvYm9keSA9IG9ib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkgZm9yIChjb25zdCB0IG9mIG92ZXJkdWUpIHRoaXMudG9kb1JvdyhvYm9keSwgdCk7XG4gICAgZWxzZSBvYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEuIFx1RDgzRFx1REM0RFwiIH0pO1xuXG4gICAgLy8gMlx1MDBBQSBcdTIwMTQgSG9qZSAoY2FpeGEgZW0gZGVzdGFxdWUpLlxuICAgIGNvbnN0IHRib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdG9kYXlcIiB9KTtcbiAgICBjb25zdCB0aGQgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkhvamVcIiB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odGhkLCBcImhvamVcIiwgXCJOb3ZhIHRhcmVmYSBwYXJhIGhvamVcIik7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodG9kYXlUYXNrcy5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IHRib2R5ID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHRvZGF5VGFza3MubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2YgdG9kYXlUYXNrcykgdGhpcy50b2RvUm93KHRib2R5LCB0KTtcbiAgICBlbHNlIHRib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmFkYSBwYXJhIGhvamUuXCIgfSk7XG5cbiAgICAvLyAzXHUwMEFBIFx1MjAxNCBQclx1MDBGM3hpbW9zIE4gZGlhcyAoYWdydXBhZG8gcG9yIGRpYSwgY29tIHN1Yi10XHUwMEVEdHVsbyBzXHUwMEYzIG5vcyBkaWFzIHF1ZSB0XHUwMEVBbSB0YXJlZmEpLlxuICAgIGxldCB1cGNvbWluZ0NvdW50ID0gMDtcbiAgICBjb25zdCB1cERheXM6IHsgZG93OiBudW1iZXI7IG51bTogbnVtYmVyOyBrZXk6IHN0cmluZzsgaXRlbXM6IFRvZG9pc3RUYXNrW10gfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcmFuZ2U7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV07XG4gICAgICBpZiAoIWl0ZW1zPy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgdXBjb21pbmdDb3VudCArPSBpdGVtcy5sZW5ndGg7XG4gICAgICB1cERheXMucHVzaCh7IGRvdzogKGRheS5nZXREYXkoKSArIDYpICUgNywgbnVtOiBkYXkuZ2V0RGF0ZSgpLCBrZXksIGl0ZW1zIH0pO1xuICAgIH1cbiAgICBjb25zdCB1Ym94ID0gY29scy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3ggd2QtYm94LXVwY29taW5nXCIgfSk7XG4gICAgY29uc3QgdWhkID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogYFByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhc2AgfSk7XG4gICAgdGhpcy5hZGRUYXNrQnRuKHVoZCwgdW5kZWZpbmVkLCBcIk5vdmEgdGFyZWZhXCIpO1xuICAgIHVoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94Y291bnRcIiwgdGV4dDogU3RyaW5nKHVwY29taW5nQ291bnQpIH0pO1xuICAgIGNvbnN0IHVib2R5ID0gdWJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHVwRGF5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgZyBvZiB1cERheXMpIHtcbiAgICAgICAgY29uc3QgZGggPSB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1kYXloZFwiICsgKGcuZG93ID49IDUgPyBcIiB3ZC13ZWVrZW5kXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2cuZG93XSB9KTtcbiAgICAgICAgZGguY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWRheW51bVwiLCB0ZXh0OiBTdHJpbmcoZy5udW0pIH0pO1xuICAgICAgICB0aGlzLmFkZFRhc2tCdG4oZGgsIGcua2V5LCBgTm92YSB0YXJlZmEgZW0gJHtnLm51bX1gKTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGcuaXRlbXMpIHRoaXMudG9kb1Jvdyh1Ym9keSwgdCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1Ym9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hlbXB0eVwiLCB0ZXh0OiBgTmFkYSBub3MgcHJcdTAwRjN4aW1vcyAke3JhbmdlfSBkaWFzLmAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVwb2lzICg+IE4gZGlhcyBcdTAwRTAgZnJlbnRlOyByZWNvbGhcdTAwRUR2ZWwsIGFiYWl4byBkYSBsaW5oYSwgZmVjaGFkbyBwb3IgcGFkclx1MDBFM28pLlxuICAgIGlmIChsYXRlci5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWxhdGVyXCIgfSk7XG4gICAgICBjb25zdCBsaGQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vaGRcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJpY29cIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RpdGxlXCIsIHRleHQ6IGBEZXBvaXMgKCR7bGF0ZXIubGVuZ3RofSlgIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMudG9kb2lzdExhdGVyT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIGxoZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnRvZG9pc3RMYXRlck9wZW4gPSAhdGhpcy50b2RvaXN0TGF0ZXJPcGVuOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgaWYgKHRoaXMudG9kb2lzdExhdGVyT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGxhdGVyKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSmFuZWxhIGRlIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgc2FuZWFkYSAoMyBvdSA3KS5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgLy8gTWFudFx1MDBFOW0gc1x1MDBGMyBhcyB0YXJlZmFzIHF1ZSBiYXRlbSBjb20gb3MgZmlsdHJvcyBhdGl2b3MgKHByb2pldG8gRSBldGlxdWV0YSkuXG4gIHByaXZhdGUgYXBwbHlUb2RvaXN0RmlsdGVycyh0YXNrczogVG9kb2lzdFRhc2tbXSk6IFRvZG9pc3RUYXNrW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBpZiAoIWYucHJvamVjdHMubGVuZ3RoICYmICFmLmxhYmVscy5sZW5ndGgpIHJldHVybiB0YXNrcztcbiAgICBjb25zdCBwcyA9IG5ldyBTZXQoZi5wcm9qZWN0cyksIGxzID0gbmV3IFNldChmLmxhYmVscyk7XG4gICAgcmV0dXJuIHRhc2tzLmZpbHRlcih0ID0+IHtcbiAgICAgIGlmIChwcy5zaXplICYmICEodC5wcm9qZWN0X2lkICYmIHBzLmhhcyh0LnByb2plY3RfaWQpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGxzLnNpemUgJiYgISh0LmxhYmVscyA/PyBbXSkuc29tZShsID0+IGxzLmhhcyhsKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVUb2RvRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgLy8gQmFycmEgZGUgZmlsdHJvczogY2hpcHMgZGUgcHJvamV0byBlIGRlIGV0aXF1ZXRhICh0b2dnbGUpLCArIGxpbXBhci5cbiAgcHJpdmF0ZSByZW5kZXJUb2RvRmlsdGVyQmFyKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgY29uc3QgYmFyID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJhclwiIH0pO1xuXG4gICAgaWYgKHRoaXMudG9kb2lzdFByb2plY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJQcm9qZXRvc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMudG9kb2lzdFByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5wcm9qZWN0cy5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogcC5uYW1lIH0pO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlVG9kb0ZpbHRlcihcInByb2plY3RzXCIsIHAuaWQpOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldCh0aGlzLnRvZG9pc3RUYXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBpZiAobGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsYWJlbHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IHRoaXMubGFiZWxDaGlwKGdycCwgbCwgXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikpO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlVG9kb0ZpbHRlcihcImxhYmVsc1wiLCBsKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xyID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2xlYXJcIiwgdGV4dDogXCJsaW1wYXIgZmlsdHJvc1wiIH0pO1xuICAgICAgY2xyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IGYucHJvamVjdHMgPSBbXTsgZi5sYWJlbHMgPSBbXTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2tib3ggZGUgY29uY2x1c1x1MDBFM28gKEZhc2UgOC4yKSBcdTIwMTQgY29uY2x1aSBubyBUb2RvaXN0IHJlYWwgYW8gY2xpY2FyLlxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNoZWNrLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KTsgfTtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgZGEgdGFyZWZhOiB0XHUwMEVEdHVsbyBjb21wbGV0byArIGRlc2NyaVx1MDBFN1x1MDBFM28gKGluc3RydVx1MDBFN1x1MDBGNWVzKSwgbm8gaG92ZXIuXG4gIHByaXZhdGUgc2hvd1Rhc2tUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXRhc2stdGlwXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10YXNrLXRpcC1wcmlcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpTWV0YSh0LnByaW9yaXR5KS5jb2xvcjtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtdGl0bGVcIiwgdGV4dDogdC5jb250ZW50IH0pO1xuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBkID0gdC5kZXNjcmlwdGlvbiEudHJpbSgpO1xuICAgICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLXRpcC1kZXNjXCIsIHRleHQ6IGQubGVuZ3RoID4gREVTQ19NQVggPyBkLnNsaWNlKDAsIERFU0NfTUFYKSArIFwiXHUyMDI2XCIgOiBkIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGFza1RpcChlbDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGFza1RpcChlbCwgdCkpO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIExpbmhhIGRlIHRhcmVmYSAodXNhZGEgbmFzIDMgY2FpeGFzOiBhdHJhc2FkYXMsIGhvamUsIHByXHUwMEYzeGltb3MgZSBlbSBcImRlcG9pc1wiKS5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KTtcbiAgICB0aGlzLmF0dGFjaFRhc2tUaXAocm93LCB0KTtcbiAgfVxuXG4gIC8vIEJvdFx1MDBFM28gXCIrXCIgZGUgY3JpYXIgdGFyZWZhIChoZWFkZXIgZGEgc2VcdTAwRTdcdTAwRTNvLCBjYWl4YXMgZSBzdWItdFx1MDBFRHR1bG9zIGRlIGRpYSkuXG4gIHByaXZhdGUgYWRkVGFza0J0bihob3N0OiBIVE1MRWxlbWVudCwgcHJlZmlsbER1ZT86IHN0cmluZywgdGl0bGUgPSBcIk5vdmEgdGFyZWZhXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYWRkXCIgfSk7XG4gICAgc2V0SWNvbihiLCBcInBsdXNcIik7XG4gICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgIGIub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH07XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBBYnJlIG8gZm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgb3UgZWRpdGFyKS5cbiAgcHJpdmF0ZSBvcGVuVGFza0Zvcm0ob3B0czogeyBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7IHRhc2s/OiBUb2RvaXN0VGFzazsgcHJlZmlsbER1ZT86IHN0cmluZyB9KSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgbGFiZWxzID0gWy4uLm5ldyBTZXQoWy4uLnRoaXMudG9kb2lzdExhYmVsQ29sb3Iua2V5cygpLCAuLi50aGlzLnRvZG9pc3RUYXNrcy5mbGF0TWFwKHQgPT4gdC5sYWJlbHMgPz8gW10pXSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgbmV3IFRhc2tGb3JtTW9kYWwodGhpcy5hcHAsIHtcbiAgICAgIG1vZGU6IG9wdHMubW9kZSxcbiAgICAgIHRhc2s6IG9wdHMudGFzayxcbiAgICAgIHByZWZpbGxEdWU6IG9wdHMucHJlZmlsbER1ZSxcbiAgICAgIHByb2plY3RzOiB0aGlzLnRvZG9pc3RQcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICAvLyBBYnJlIG8gcG9wLXVwIGRlIGRldGFsaGVzIChzXHUwMEYzIGxlaXR1cmEpOyBvIGJvdFx1MDBFM28gXCJFZGl0YXJcIiBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvLlxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcywge1xuICAgICAgdGFzazogdCxcbiAgICAgIHByb2plY3ROYW1lOiB0LnByb2plY3RfaWQgPyB0aGlzLnRvZG9pc3RQcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgLy8gQ3JpYSBvdSBlZGl0YSBubyBUb2RvaXN0IHJlYWwuIE5vIGVkaXRhciBtYW5kYSBzXHUwMEYzIG9zIGNhbXBvcyBhbHRlcmFkb3MgKHByZXNlcnZhXG4gIC8vIHJlY29yclx1MDBFQW5jaWEgc2UgYSBkYXRhIG5cdTAwRTNvIG11ZG91KSBlIHRyb2NhIGRlIHByb2pldG8gdmlhIC9tb3ZlLiBSZXRvcm5hIHRydWUgc2UgT0suXG4gIHByaXZhdGUgYXN5bmMgc3VibWl0VGFza0Zvcm0obW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiLCB0YXNrOiBUb2RvaXN0VGFzayB8IHVuZGVmaW5lZCwgdjogVGFza0Zvcm1WYWx1ZXMpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAobW9kZSA9PT0gXCJjcmVhdGVcIikge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHsgY29udGVudDogdi5jb250ZW50LCBwcmlvcml0eTogdi5wcmlvcml0eSB9O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbi50cmltKCkpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb24udHJpbSgpO1xuICAgICAgICBpZiAodi5kdWVEYXRlKSBmaWVsZHMuZHVlX2RhdGUgPSB2LmR1ZURhdGU7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCkgZmllbGRzLnByb2plY3RfaWQgPSB2LnByb2plY3RJZDtcbiAgICAgICAgaWYgKHYubGFiZWxzLmxlbmd0aCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBhd2FpdCBjcmVhdGVUb2RvaXN0VGFzayh0b2tlbiwgZmllbGRzKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIENyaWFkYTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKHRhc2spIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBUb2RvaXN0V3JpdGUgPSB7fTtcbiAgICAgICAgaWYgKHYuY29udGVudCAhPT0gdGFzay5jb250ZW50KSBmaWVsZHMuY29udGVudCA9IHYuY29udGVudDtcbiAgICAgICAgaWYgKHYuZGVzY3JpcHRpb24gIT09ICh0YXNrLmRlc2NyaXB0aW9uID8/IFwiXCIpKSBmaWVsZHMuZGVzY3JpcHRpb24gPSB2LmRlc2NyaXB0aW9uO1xuICAgICAgICBpZiAodi5wcmlvcml0eSAhPT0gdGFzay5wcmlvcml0eSkgZmllbGRzLnByaW9yaXR5ID0gdi5wcmlvcml0eTtcbiAgICAgICAgY29uc3Qgb2xkRGF0ZSA9IHRhc2suZHVlPy5kYXRlID8gdGFzay5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogXCJcIjtcbiAgICAgICAgaWYgKHYuZHVlRGF0ZSAhPT0gb2xkRGF0ZSkge1xuICAgICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgICBlbHNlIGZpZWxkcy5kdWVfc3RyaW5nID0gXCJubyBkYXRlXCI7ICAgLy8gbGltcGEgYSBkYXRhXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2xkTCA9ICh0YXNrLmxhYmVscyA/PyBbXSkuc2xpY2UoKS5zb3J0KCkuam9pbihcIlx1MDAwMFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCJcdTAwMDBcIik7XG4gICAgICAgIGlmIChvbGRMICE9PSBuZXdMKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhmaWVsZHMpLmxlbmd0aCkgYXdhaXQgdXBkYXRlVG9kb2lzdFRhc2sodG9rZW4sIHRhc2suaWQsIGZpZWxkcyk7XG4gICAgICAgIGNvbnN0IG9sZFByb2ogPSB0YXNrLnByb2plY3RfaWQgPz8gXCJcIjtcbiAgICAgICAgaWYgKHYucHJvamVjdElkICE9PSBvbGRQcm9qICYmIHYucHJvamVjdElkKSBhd2FpdCBtb3ZlVG9kb2lzdFRhc2sodG9rZW4sIHRhc2suaWQsIHYucHJvamVjdElkKTtcbiAgICAgICAgbmV3IE5vdGljZShgXHUyNzEzIFNhbHZhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuZmV0Y2hUb2RvaXN0KHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBFeGNsdWkgYSB0YXJlZmEgKG90aW1pc3RhKSBubyBUb2RvaXN0IHJlYWwuIFJldG9ybmEgdHJ1ZSBzZSBPSy5cbiAgcHJpdmF0ZSBhc3luYyBkZWxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRvZG9pc3RUYXNrcy5maW5kSW5kZXgoeCA9PiB4LmlkID09PSB0LmlkKTtcbiAgICBpZiAoaWR4ID49IDApIHRoaXMudG9kb2lzdFRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRlbGV0ZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1RDgzRFx1REREMSBFeGNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7ICAgLy8gcmV2ZXJ0ZVxuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gZXhjbHVpcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbmNsdWkgYSB0YXJlZmEgZGUgZm9ybWEgb3RpbWlzdGE6IHJlbW92ZSBkYSBsaXN0YSBlIHJlLXJlbmRlcml6YTsgc2UgYSBBUElcbiAgLy8gZmFsaGFyLCByZXN0YXVyYSBlIGF2aXNhLiBBIGVzY3JpdGEgcmVmbGV0ZSBubyBUb2RvaXN0IHJlYWwgKEZhc2UgOC4yKS5cbiAgcHJpdmF0ZSBhc3luYyBjb21wbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudG9kb2lzdFRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY2xvc2VUb2RvaXN0VGFzayh0b2tlbiwgdC5pZCk7XG4gICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ29uY2x1XHUwMEVEZGE6ICR7dC5jb250ZW50fWApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50b2RvaXN0VGFza3Muc3BsaWNlKGlkeCwgMCwgdCk7ICAgLy8gcmV2ZXJ0ZVxuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvLyBCdXNjYSB0YXJlZmFzOyBgbWFudWFsYCBtb3N0cmEgbyBzcGlubmVyIGltZWRpYXRhbWVudGUuXG4gIHByaXZhdGUgYXN5bmMgZmV0Y2hUb2RvaXN0KG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuIHx8IHRoaXMudG9kb2lzdExvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnRvZG9pc3RFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgLy8gUHJvamV0b3MvZXRpcXVldGFzIHNcdTAwRTNvIGF1eGlsaWFyZXM7IHNlIGZhbGhhcmVtLCBuXHUwMEUzbyBkZXJydWJhbSBhcyB0YXJlZmFzLlxuICAgICAgY29uc3QgW3Rhc2tzLCBwcm9qZWN0cywgbGFiZWxzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZmV0Y2hUb2RvaXN0VGFza3ModG9rZW4pLFxuICAgICAgICBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbikuY2F0Y2goKCkgPT4gW10gYXMgVG9kb2lzdFByb2plY3RbXSksXG4gICAgICAgIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbikuY2F0Y2goKCkgPT4gW10gYXMgVG9kb2lzdExhYmVsW10pLFxuICAgICAgXSk7XG4gICAgICB0aGlzLnRvZG9pc3RUYXNrcyA9IHRhc2tzO1xuICAgICAgdGhpcy50b2RvaXN0UHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgIHRoaXMudG9kb2lzdFByb2plY3RNYXAgPSBuZXcgTWFwKHByb2plY3RzLm1hcChwID0+IFtwLmlkLCBwLm5hbWVdKSk7XG4gICAgICB0aGlzLnRvZG9pc3RMYWJlbENvbG9yID0gbmV3IE1hcChsYWJlbHMubWFwKGwgPT4gW2wubmFtZSwgVE9ET0lTVF9DT0xPUlNbbC5jb2xvcl0gPz8gTEFCRUxfRkFMTEJBQ0tdKSk7XG4gICAgICB0aGlzLnRvZG9pc3RGZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMudG9kb2lzdEVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlc2V0YSBvIGVzdGFkbyAoZXguOiB0b2tlbiBhbHRlcmFkbyBuYXMgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpIGUgcmUtcmVuZGVyaXphLlxuICByZXNldFRvZG9pc3QoKSB7XG4gICAgdGhpcy50b2RvaXN0VGFza3MgPSBbXTtcbiAgICB0aGlzLnRvZG9pc3RQcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMudG9kb2lzdFByb2plY3RNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy50b2RvaXN0TGFiZWxDb2xvciA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnRvZG9pc3RGZXRjaGVkQXQgPSAwO1xuICAgIHRoaXMudG9kb2lzdEVycm9yID0gbnVsbDtcbiAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nICsgY29uZmxpdG9zKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICByZXNldFN5bmMoKSB7XG4gICAgdGhpcy5zeW5jRGF0YSA9IG51bGw7XG4gICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoU3luYyhtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmICghYmFzZSB8fCAha2V5IHx8IHRoaXMuc3luY0xvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHN0R2V0PFNURm9sZGVyW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZm9sZGVyc1wiKTtcbiAgICAgIGNvbnN0IHdhbnRlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkLnRyaW0oKTtcbiAgICAgIGNvbnN0IGZvbGRlciA9IGZvbGRlcnMuZmluZChmID0+IGYuaWQgPT09IHdhbnRlZCkgPz8gZm9sZGVyc1swXTtcbiAgICAgIGlmICghZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJuZW5odW1hIHBhc3RhIGNvbmZpZ3VyYWRhIG5vIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNvbnN0IGZpZCA9IGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIuaWQpO1xuXG4gICAgICBjb25zdCBbZGV2aWNlcywgY29ubnMsIHN0YXR1cywgc3RhdHMsIHN5c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0R2V0PFNURGV2aWNlW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZGV2aWNlc1wiKSxcbiAgICAgICAgc3RHZXQ8eyBjb25uZWN0aW9uczogUmVjb3JkPHN0cmluZywgeyBjb25uZWN0ZWQ6IGJvb2xlYW4gfT4gfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9jb25uZWN0aW9uc1wiKSxcbiAgICAgICAgc3RHZXQ8U1RTdGF0dXM+KGJhc2UsIGtleSwgYC9yZXN0L2RiL3N0YXR1cz9mb2xkZXI9JHtmaWR9YCksXG4gICAgICAgIHN0R2V0PFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9Pj4oYmFzZSwga2V5LCBcIi9yZXN0L3N0YXRzL2RldmljZVwiKS5jYXRjaCgoKSA9PiAoe30gYXMgUmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+KSksXG4gICAgICAgIHN0R2V0PHsgbXlJRDogc3RyaW5nIH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vc3RhdHVzXCIpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZSA9IGRldmljZXMuZmlsdGVyKGQgPT4gZC5kZXZpY2VJRCAhPT0gc3lzLm15SUQpO1xuICAgICAgY29uc3Qgcm93cyA9IGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZS5tYXAoYXN5bmMgZCA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBhd2FpdCBzdEdldDxTVENvbXBsZXRpb24+KGJhc2UsIGtleSwgYC9yZXN0L2RiL2NvbXBsZXRpb24/Zm9sZGVyPSR7ZmlkfSZkZXZpY2U9JHtkLmRldmljZUlEfWApXG4gICAgICAgICAgLmNhdGNoKCgpID0+ICh7IGNvbXBsZXRpb246IDAsIGdsb2JhbEl0ZW1zOiAwLCBuZWVkSXRlbXM6IDAsIG5lZWRCeXRlczogMCwgbmVlZERlbGV0ZXM6IDAgfSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGQubmFtZSB8fCBkLmRldmljZUlELnNsaWNlKDAsIDcpLFxuICAgICAgICAgIG9ubGluZTogISFjb25ucy5jb25uZWN0aW9uc1tkLmRldmljZUlEXT8uY29ubmVjdGVkLFxuICAgICAgICAgIGNvbXBsZXRpb246IGMuY29tcGxldGlvbixcbiAgICAgICAgICBnbG9iYWxJdGVtczogYy5nbG9iYWxJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRJdGVtczogYy5uZWVkSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkQnl0ZXM6IGMubmVlZEJ5dGVzLFxuICAgICAgICAgIG5lZWREZWxldGVzOiBjLm5lZWREZWxldGVzLFxuICAgICAgICAgIGxhc3RTZWVuOiBzdGF0c1tkLmRldmljZUlEXT8ubGFzdFNlZW4gPz8gXCJcIixcbiAgICAgICAgfTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5zeW5jRGF0YSA9IHtcbiAgICAgICAgc3RhdGU6IHN0YXR1cy5zdGF0ZSxcbiAgICAgICAgbmVlZEZpbGVzOiBzdGF0dXMubmVlZEZpbGVzLFxuICAgICAgICBuZWVkQnl0ZXM6IHN0YXR1cy5uZWVkQnl0ZXMsXG4gICAgICAgIGZvbGRlckxhYmVsOiBmb2xkZXIubGFiZWwgfHwgZm9sZGVyLmlkLFxuICAgICAgICBlcnJvcnM6IChzdGF0dXMuZXJyb3JzID8/IDApICsgKHN0YXR1cy5wdWxsRXJyb3JzID8/IDApLFxuICAgICAgICBkZXZpY2VzOiByb3dzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zeW5jRXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NZTkMpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXN5bmMtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiU0lOQ1JPTklaQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5zeW5jTG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciBlc3RhZG8gZG8gU3luY3RoaW5nXCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH07XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb25maWd1cmUgYSBVUkwgZSBhIEFQSSBrZXkgZG8gU3luY3RoaW5nIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQuXCIgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmNFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGZhbGFyIGNvbSBvIFN5bmN0aGluZzogJHt0aGlzLnN5bmNFcnJvcn1gIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3luY0ZldGNoZWRBdCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmNMb2FkaW5nKSB2b2lkIHRoaXMuZmV0Y2hTeW5jKGZhbHNlKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyU3luY0JvZHkoc2VjLCB0aGlzLnN5bmNEYXRhISk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDb25mbGljdHMoc2VjKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luY0JvZHkoc2VjOiBIVE1MRWxlbWVudCwgZDogU3luY0RhdGEpIHtcbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtYm94XCIgfSk7XG5cbiAgICAvLyBFc3RhZG8gZGEgcGFzdGEuXG4gICAgY29uc3QgYnVzeSA9IGQuc3RhdGUgPT09IFwic3luY2luZ1wiIHx8IGQuc3RhdGUgPT09IFwic2Nhbm5pbmdcIjtcbiAgICBjb25zdCBmbCA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1mb2xkZXJcIiB9KTtcbiAgICBjb25zdCBkb3QgPSBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGQuZXJyb3JzID8gXCJ3ZC1zLWVyclwiIDogYnVzeSA/IFwid2Qtcy1idXN5XCIgOiBcIndkLXMtb2tcIikgfSk7XG4gICAgZG90LnNldFRleHQoZC5lcnJvcnMgPyBcIlx1MjZBMFwiIDogYnVzeSA/IFwiXHUyN0YzXCIgOiBcIlx1MjVDRlwiKTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZm5hbWVcIiwgdGV4dDogZC5mb2xkZXJMYWJlbCB9KTtcbiAgICBjb25zdCBzdCA9IGQuc3RhdGUgPT09IFwiaWRsZVwiID8gXCJlbSBkaWFcIiA6IGQuc3RhdGUgPT09IFwic3luY2luZ1wiID8gYHNpbmNyb25pemFuZG8gXHUyMDE0ICR7ZC5uZWVkRmlsZXN9IGl0ZW5zICgke2h1bWFuQnl0ZXMoZC5uZWVkQnl0ZXMpfSlgIDogZC5zdGF0ZTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZnN0YXRlXCIsIHRleHQ6IHN0IH0pO1xuXG4gICAgLy8gQXBhcmVsaG9zLlxuICAgIGZvciAoY29uc3QgZGV2IG9mIGQuZGV2aWNlcykge1xuICAgICAgY29uc3Qgcm93ID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWRldlwiIH0pO1xuICAgICAgY29uc3QgbyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGRldi5vbmxpbmUgPyBcIndkLXMtb2tcIiA6IFwid2Qtcy1vZmZcIikgfSk7XG4gICAgICBvLnNldFRleHQoXCJcdTI1Q0ZcIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRuYW1lXCIsIHRleHQ6IGRldi5uYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY29tcFwiLCB0ZXh0OiBgJHtNYXRoLnJvdW5kKGRldi5jb21wbGV0aW9uKX0lYCB9KTtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzICYmIGRldi5nbG9iYWxJdGVtcylcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY291bnRcIiwgdGV4dDogYCR7ZGV2Lmdsb2JhbEl0ZW1zIC0gZGV2Lm5lZWRJdGVtc30vJHtkZXYuZ2xvYmFsSXRlbXN9YCB9KTtcbiAgICAgIGNvbnN0IGV4dHJhID0gZGV2Lm5lZWREZWxldGVzID8gYCR7ZGV2Lm5lZWREZWxldGVzfSBleGNsdXNcdTAwRjVlc2AgOiBkZXYubmVlZEJ5dGVzID8gaHVtYW5CeXRlcyhkZXYubmVlZEJ5dGVzKSA6IFwiXCI7XG4gICAgICBpZiAoZXh0cmEpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHBlbmRcIiwgdGV4dDogZXh0cmEgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRzZWVuXCIsIHRleHQ6IGRldi5vbmxpbmUgPyBcIm9ubGluZVwiIDogcmVsVGltZShkZXYubGFzdFNlZW4pIH0pO1xuICAgIH1cblxuICAgIGlmIChkLmVycm9ycykgYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWVycmxpbmVcIiwgdGV4dDogYFx1MjZBMCAke2QuZXJyb3JzfSBlcnJvKHMpIG5hIHBhc3RhYCB9KTtcbiAgfVxuXG4gIC8vIExpc3RhIGRlIGNcdTAwRjNwaWFzIGRlIGNvbmZsaXRvIGRvIFN5bmN0aGluZyAoYWJyaXIgLyBhcGFnYXIgY29tIGNvbmZpcm1hXHUwMEU3XHUwMEUzbykuXG4gIHByaXZhdGUgcmVuZGVyQ29uZmxpY3RzKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLmZpbHRlcihmID0+IGYubmFtZS5pbmNsdWRlcyhcIi5zeW5jLWNvbmZsaWN0LVwiKSk7XG4gICAgY29uc3Qgd3JhcCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jb25mbGljdHNcIiB9KTtcbiAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLXN1YlwiLCB0ZXh0OiBgQ29uZmxpdG9zICgke2NvbmZsaWN0cy5sZW5ndGh9KWAgfSk7XG4gICAgaWYgKCFjb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLW5vY29uZlwiLCB0ZXh0OiBcIk5lbmh1bSBjb25mbGl0by4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBjb25mbGljdHMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY3Jvd1wiIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25hbWVcIiwgdGV4dDogZi5uYW1lIH0pO1xuICAgICAgbmFtZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBcIiArIGYucGF0aCk7XG4gICAgICBuYW1lLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICBpZiAodGhpcy5jb25mbGljdENvbmZpcm0gPT09IGYucGF0aCkge1xuICAgICAgICBjb25zdCB5ZXMgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWN5ZXNcIiwgdGV4dDogXCJhcGFnYXI/XCIgfSk7XG4gICAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmLCBmYWxzZSk7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgICAgY29uc3Qgbm8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNub1wiLCB0ZXh0OiBcImNhbmNlbGFyXCIgfSk7XG4gICAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY2RlbFwiIH0pO1xuICAgICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpO1xuICAgICAgICBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiQXBhZ2FyIGNcdTAwRjNwaWEgZGUgY29uZmxpdG8gKHZhaSBwYXJhIGEgbGl4ZWlyYSlcIik7XG4gICAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IGYucGF0aDsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb3IgKGhleCkgZGUgdW1hIGV0aXF1ZXRhIHBlbG8gbm9tZTsgY2luemEgc2UgZGVzY29uaGVjaWRhLlxuICBwcml2YXRlIGxhYmVsQ29sb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50b2RvaXN0TGFiZWxDb2xvci5nZXQobmFtZSkgPz8gTEFCRUxfRkFMTEJBQ0s7XG4gIH1cblxuICAvLyBDcmlhIHVtIGNoaXAgZGUgZXRpcXVldGEgY29tIGJvbGluaGEgY29sb3JpZGEgKyBcIkBub21lXCIuXG4gIHByaXZhdGUgbGFiZWxDaGlwKGhvc3Q6IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGNsczogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGNoaXAgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHMgfSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmxhYmVsQ29sb3IobmFtZSk7XG4gICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke25hbWV9YCB9KTtcbiAgICByZXR1cm4gY2hpcDtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWFkZXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJTZWNvbmQgQnJhaW5cIiB9KTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGx1Z2luIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZXJ1c0Rhc2hib2FyZCBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBEYXNoU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgRGFzaGJvYXJkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGF5b3V0LWRhc2hib2FyZFwiLCBcIkFicmlyIFdlcnVzIERhc2hib2FyZFwiLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1kYXNoYm9hcmRcIiwgbmFtZTogXCJBYnJpciBEYXNoYm9hcmRcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbigpIH0pO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgV2VydXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gIH1cblxuICAvLyBSZS1idXNjYSBvIFRvZG9pc3QgZW0gdG9kYXMgYXMgZGFzaGJvYXJkcyBhYmVydGFzIChleC46IGFwXHUwMEYzcyBtdWRhciBvIHRva2VuKS5cbiAgcmVmcmVzaERhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFRvZG9pc3QoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXNldGEgbyBlc3RhZG8gZG8gU3luY3RoaW5nIGVtIHRvZGFzIGFzIGRhc2hib2FyZHMgKGV4LjogdG9rZW4vVVJMIGFsdGVyYWRvcykuXG4gIHJlZnJlc2hTeW5jKCkge1xuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSkpIHtcbiAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcpIHYucmVzZXRTeW5jKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmUtcmVuZGVyaXphIHRvZGFzIGFzIGRhc2hib2FyZHMgYWJlcnRhcyAoYXBcdTAwRjNzIG11ZGFyIGNvbmZpZyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXM6IG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcyBkYSBTZW1hbmEpLlxuICByZXJlbmRlckRhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZWZyZXNoKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTW9zdHJhL29jdWx0YSB1bWEgc2VcdTAwRTdcdTAwRTNvIChcInNlYzo8aWQ+XCIpIG91IHBhc3RhIChjYW1pbmhvKSBwb3IgY2hhdmUgZW0gYGhpZGRlbmAuXG4gIGFzeW5jIHNldEhpZGRlbihrZXk6IHN0cmluZywgaGlkZGVuOiBib29sZWFuKSB7XG4gICAgY29uc3QgaGFzID0gdGhpcy5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgICBpZiAoaGlkZGVuICYmICFoYXMpIHRoaXMuc2V0dGluZ3MuaGlkZGVuLnB1c2goa2V5KTtcbiAgICBlbHNlIGlmICghaGlkZGVuICYmIGhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4gPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5maWx0ZXIoayA9PiBrICE9PSBrZXkpO1xuICAgIGVsc2UgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIC8vIFJlb3JkZW5hIHVtYSBzZVx1MDBFN1x1MDBFM28gZW0gc2VjdGlvbk9yZGVyIChkaXIgPSAtMSBzb2JlLCArMSBkZXNjZSkuXG4gIGFzeW5jIG1vdmVTZWN0aW9uKGlkOiBTZWN0aW9uSWQsIGRpcjogbnVtYmVyKSB7XG4gICAgY29uc3Qgb3JkZXIgPSBbLi4udGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXJdO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaiA+PSBvcmRlci5sZW5ndGgpIHJldHVybjtcbiAgICBbb3JkZXJbaV0sIG9yZGVyW2pdXSA9IFtvcmRlcltqXSwgb3JkZXJbaV1dO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gb3JkZXI7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIC8vIFNhbmVhbWVudG86IHNlY3Rpb25PcmRlciBjb20gZXhhdGFtZW50ZSBhcyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl07XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8U2VjdGlvbklkPigpO1xuICAgIGNvbnN0IGNsZWFuZWQgPSAodGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgfHwgW10pLmZpbHRlcihcbiAgICAgIChzKTogcyBpcyBTZWN0aW9uSWQgPT4gdmFsaWQuaW5jbHVkZXMocyBhcyBTZWN0aW9uSWQpICYmICFzZWVuLmhhcyhzIGFzIFNlY3Rpb25JZCkgJiYgKHNlZW4uYWRkKHMgYXMgU2VjdGlvbklkKSwgdHJ1ZSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWxpZCkgaWYgKCFzZWVuLmhhcyh2KSkgY2xlYW5lZC5wdXNoKHYpO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gY2xlYW5lZDsgICAvLyBcInJlcG9ydHNcIiBzb21lIGFxdWkgc2UgZXN0YXZhIG51bWEgY29uZmlnIGFudGlnYVxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNldHRpbmdzLmhpZGRlbikpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gW107XG4gICAgLy8gRm9udGVzIGRhIFNlbWFuYSAodjAuMTAuMSk6IHZhbGlkYSBhIGxpc3RhOyBzZSBhdXNlbnRlL2ludlx1MDBFMWxpZGEsIHVzYSBvIGRlZmF1bHQuXG4gICAgY29uc3QgY3MgPSB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IEFycmF5LmlzQXJyYXkoY3MpICYmIGNzLmxlbmd0aFxuICAgICAgPyBjcy5maWx0ZXIocyA9PiBzICYmIHR5cGVvZiBzLnBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgLm1hcChzID0+ICh7IHBhdGg6IHMucGF0aCwgY29sb3I6IHR5cGVvZiBzLmNvbG9yID09PSBcInN0cmluZ1wiID8gcy5jb2xvciA6IEFDQ0VOVFNbMF0sIG9uOiBzLm9uICE9PSBmYWxzZSB9KSlcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5jYWxlbmRhclNvdXJjZXMubWFwKHMgPT4gKHsgLi4ucyB9KSk7XG4gICAgLy8gU2FuZWFtZW50byBUb2RvaXN0ICh2MC43LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPT09IDMgPyAzIDogNztcbiAgICBjb25zdCB0ZiA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycyA9IHtcbiAgICAgIHByb2plY3RzOiBBcnJheS5pc0FycmF5KHRmPy5wcm9qZWN0cykgPyB0Zi5wcm9qZWN0cyA6IFtdLFxuICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHRmPy5sYWJlbHMpID8gdGYubGFiZWxzIDogW10sXG4gICAgfTtcbiAgICAvLyBFeGliaVx1MDBFN1x1MDBFM28gbmFzIGxpbmhhcyAodjAuOC4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ICE9PSBmYWxzZTtcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9PT0gdHJ1ZTtcbiAgICAvLyBTeW5jdGhpbmcgKHYwLjEwLjApLlxuICAgIGlmICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgIT09IFwic3RyaW5nXCIgfHwgIXRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKSlcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsID0gXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIjtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ICE9PSBcInN0cmluZ1wiKSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IFwiXCI7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkICE9PSBcInN0cmluZ1wiKSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gXCJcIjtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPSB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMgPT09IHRydWU7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7IGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7IH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUG9wLXVwIGRlIGRldGFsaGVzIGRhIHRhcmVmYSAoc1x1MDBGMyBsZWl0dXJhOyBib3RcdTAwRTNvIEVkaXRhciBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvKSBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tEZXRhaWxPcHRzIHtcbiAgdGFzazogVG9kb2lzdFRhc2s7XG4gIHByb2plY3ROYW1lPzogc3RyaW5nO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGVkaXQ6ICgpID0+IHZvaWQ7XG4gIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRGV0YWlsTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LCBwcml2YXRlIG9wdHM6IFRhc2tEZXRhaWxPcHRzKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgdCA9IHRoaXMub3B0cy50YXNrO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLW1vZGFsXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0LmNvbnRlbnQpO1xuXG4gICAgY29uc3QgbWV0YSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGBcdUQ4M0RcdURDQzUgJHtkfS8ke219LyR7eX0ke3QuZHVlPy5pc19yZWN1cnJpbmcgPyBcIiBcdTI3RjNcIiA6IFwiXCJ9YCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0cy5wcm9qZWN0TmFtZSkgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYCMgJHt0aGlzLm9wdHMucHJvamVjdE5hbWV9YCB9KTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcCB3ZC10ZC1sYWJlbFwiIH0pO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgdm9pZCBNYXJrZG93blJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcCwgdC5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIC8vIEVkaXRhciAoZXNxdWVyZGEpIFx1MDBCNyBDb25jbHVpciArIEFicmlyIG5vIFRvZG9pc3QgKGRpcmVpdGEpLlxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IGVkaXQgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MEUgRWRpdGFyXCIgfSk7XG4gICAgZWRpdC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHRoaXMub3B0cy5lZGl0KCk7IH07XG4gICAgYWN0aW9ucy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgZG9uZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcxMyBDb25jbHVpclwiIH0pO1xuICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICBjb25zdCBvcGVuID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQWJyaXIgbm8gVG9kb2lzdFwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodCksIFwiX2JsYW5rXCIpO1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgLyBlZGl0YXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0Zvcm1WYWx1ZXMge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJIDEuLjQgKDQgPSBwMSlcbiAgZHVlRGF0ZTogc3RyaW5nOyAgICAvLyBZWVlZLU1NLUREIChjYWxlbmRcdTAwRTFyaW8pOyBcIlwiID0gc2VtIGRhdGFcbiAgcHJvamVjdElkOiBzdHJpbmc7XG4gIGxhYmVsczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBUYXNrRm9ybU9wdHMge1xuICBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7XG4gIHRhc2s/OiBUb2RvaXN0VGFzaztcbiAgcHJlZmlsbER1ZT86IHN0cmluZztcbiAgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W107XG4gIGxhYmVsczogc3RyaW5nW107XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgc3VibWl0OiAodjogVGFza0Zvcm1WYWx1ZXMpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIHJlbW92ZT86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0Zvcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSB2OiBUYXNrRm9ybVZhbHVlcztcbiAgcHJpdmF0ZSBrbm93bkxhYmVsczogc3RyaW5nW107XG4gIHByaXZhdGUgY29uZmlybURlbCA9IGZhbHNlO1xuICBwcml2YXRlIGFjdGlvbnNFbCE6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IFRhc2tGb3JtT3B0cykge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgdCA9IG9wdHMudGFzaztcbiAgICAvLyBQcmVmaWxsIGRlIGNyaWFcdTAwRTdcdTAwRTNvOiBcImhvamVcIiBcdTIxOTIgZGF0YSBkZSBob2plOyBqXHUwMEUxLVlZWVktTU0tREQgcGFzc2EgZGlyZXRvOyByZXN0byBpZ25vcmEuXG4gICAgY29uc3QgcHJlID0gb3B0cy5wcmVmaWxsRHVlO1xuICAgIGNvbnN0IHByZWZpbGxEYXRlID0gcHJlID09PSBcImhvamVcIiA/IHRvS2V5KG5ldyBEYXRlKCkpXG4gICAgICA6IChwcmUgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocHJlKSA/IHByZSA6IFwiXCIpO1xuICAgIHRoaXMudiA9IHtcbiAgICAgIGNvbnRlbnQ6IHQ/LmNvbnRlbnQgPz8gXCJcIixcbiAgICAgIGRlc2NyaXB0aW9uOiB0Py5kZXNjcmlwdGlvbiA/PyBcIlwiLFxuICAgICAgcHJpb3JpdHk6IHQ/LnByaW9yaXR5ID8/IDEsXG4gICAgICBkdWVEYXRlOiB0Py5kdWU/LmRhdGUgPyB0LmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBwcmVmaWxsRGF0ZSxcbiAgICAgIHByb2plY3RJZDogdD8ucHJvamVjdF9pZCA/PyBcIlwiLFxuICAgICAgbGFiZWxzOiAodD8ubGFiZWxzID8/IFtdKS5zbGljZSgpLFxuICAgIH07XG4gICAgdGhpcy5rbm93bkxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5vcHRzLmxhYmVscywgLi4udGhpcy52LmxhYmVsc10pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLWZvcm1cIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHRoaXMub3B0cy5tb2RlID09PSBcImNyZWF0ZVwiID8gXCJOb3ZhIHRhcmVmYVwiIDogXCJFZGl0YXIgdGFyZWZhXCIpO1xuXG4gICAgLy8gU1x1MDBGMyBuYSBlZGlcdTAwRTdcdTAwRTNvOiBhdGFsaG8gXCJBYnJpciBubyBUb2RvaXN0XCIgbm8gdG9wbywgYW8gbGFkbyBkbyBYIGRlIGZlY2hhci5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiICYmIHRoaXMub3B0cy50YXNrKSB7XG4gICAgICBjb25zdCBvcGVuID0gbW9kYWxFbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1vcGVuLXRvcFwiLCB0ZXh0OiBcIlx1MjE5NyBUb2RvaXN0XCIgfSk7XG4gICAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIG5vIFRvZG9pc3RcIik7XG4gICAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHRoaXMub3B0cy50YXNrISksIFwiX2JsYW5rXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZmllbGQoXCJUXHUwMEVEdHVsb1wiKTtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgY29udGVudC52YWx1ZSA9IHRoaXMudi5jb250ZW50O1xuICAgIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBcIk8gcXVlIHByZWNpc2Egc2VyIGZlaXRvP1wiO1xuICAgIGNvbnRlbnQub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmNvbnRlbnQgPSBjb250ZW50LnZhbHVlOyB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGVudC5mb2N1cygpLCAwKTtcblxuICAgIHRoaXMuZmllbGQoXCJEZXNjcmlcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNvbnN0IGRlc2MgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC10Zi10ZXh0YXJlYVwiIH0pO1xuICAgIGRlc2MudmFsdWUgPSB0aGlzLnYuZGVzY3JpcHRpb247XG4gICAgZGVzYy5wbGFjZWhvbGRlciA9IFwiRGV0YWxoZXMgLyBpbnN0cnVcdTAwRTdcdTAwRjVlcyAobWFya2Rvd24pXCI7XG4gICAgZGVzYy5yb3dzID0gMztcbiAgICBkZXNjLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kZXNjcmlwdGlvbiA9IGRlc2MudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJpb3JpZGFkZVwiKTtcbiAgICBjb25zdCBwcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1wcmktcm93XCIgfSk7XG4gICAgY29uc3QgcmVuZGVyUHJpID0gKCkgPT4ge1xuICAgICAgcHJvdy5lbXB0eSgpO1xuICAgICAgZm9yIChjb25zdCBhcGkgb2YgWzQsIDMsIDIsIDFdKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBUT0RPSVNUX1BSSVthcGldO1xuICAgICAgICBjb25zdCBiID0gcHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLXByaVwiICsgKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgICBiLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgbWV0YS5jb2xvcik7XG4gICAgICAgIGIub25jbGljayA9ICgpID0+IHsgdGhpcy52LnByaW9yaXR5ID0gYXBpOyByZW5kZXJQcmkoKTsgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlclByaSgpO1xuXG4gICAgdGhpcy5maWVsZChcIkRhdGFcIik7XG4gICAgY29uc3QgZHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtZHVlLXJvd1wiIH0pO1xuICAgIGNvbnN0IGR1ZSA9IGRyb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC10Zi1pbnB1dCB3ZC10Zi1kYXRlXCIsIHR5cGU6IFwiZGF0ZVwiIH0pO1xuICAgIGR1ZS52YWx1ZSA9IHRoaXMudi5kdWVEYXRlO1xuICAgIGR1ZS5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBkdWUudmFsdWU7IH07XG4gICAgY29uc3QgY2xyID0gZHJvdy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1kdWUtY2xlYXJcIiwgdGV4dDogXCJzZW0gZGF0YVwiIH0pO1xuICAgIGNsci5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnYuZHVlRGF0ZSA9IFwiXCI7IGR1ZS52YWx1ZSA9IFwiXCI7IH07XG4gICAgY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ2xpcXVlIHBhcmEgYWJyaXIgbyBjYWxlbmRcdTAwRTFyaW8uIFZhemlvID0gc2VtIGRhdGEuXCIgfSk7XG4gICAgaWYgKHRoaXMub3B0cy50YXNrPy5kdWU/LmlzX3JlY3VycmluZylcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtd2FyblwiLCB0ZXh0OiBcIlx1MjdGMyBUYXJlZmEgcmVjb3JyZW50ZSBcdTIwMTQgbXVkYXIgYSBkYXRhIGZpeGEgcG9kZSBlbmNlcnJhciBhIHJlY29yclx1MDBFQW5jaWEuXCIgfSk7XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJvamV0b1wiKTtcbiAgICBjb25zdCBzZWwgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtdGYtc2VsZWN0XCIgfSk7XG4gICAgY29uc3QgaW5ib3ggPSBzZWwuY3JlYXRlRWwoXCJvcHRpb25cIiwgeyB0ZXh0OiBcIkVudHJhZGEgKEluYm94KVwiLCB2YWx1ZTogXCJcIiB9KTtcbiAgICBpZiAoIXRoaXMudi5wcm9qZWN0SWQpIGluYm94LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5vcHRzLnByb2plY3RzKSB7XG4gICAgICBjb25zdCBvID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogcC5uYW1lLCB2YWx1ZTogcC5pZCB9KTtcbiAgICAgIGlmIChwLmlkID09PSB0aGlzLnYucHJvamVjdElkKSBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc2VsLm9uY2hhbmdlID0gKCkgPT4geyB0aGlzLnYucHJvamVjdElkID0gc2VsLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIkV0aXF1ZXRhc1wiKTtcbiAgICBjb25zdCBsd3JhcCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxzXCIgfSk7XG4gICAgaWYgKHRoaXMua25vd25MYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCByZW5kZXJMYWJlbHMgPSAoKSA9PiB7XG4gICAgICAgIGx3cmFwLmVtcHR5KCk7XG4gICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmtub3duTGFiZWxzKSB7XG4gICAgICAgICAgY29uc3Qgb24gPSB0aGlzLnYubGFiZWxzLmluY2x1ZGVzKGwpO1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsd3JhcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMub3B0cy5sYWJlbENvbG9yKGwpO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMudi5sYWJlbHMuaW5kZXhPZihsKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHRoaXMudi5sYWJlbHMuc3BsaWNlKGksIDEpOyBlbHNlIHRoaXMudi5sYWJlbHMucHVzaChsKTtcbiAgICAgICAgICAgIHJlbmRlckxhYmVscygpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJOZW5odW1hIGV0aXF1ZXRhIG5vIFRvZG9pc3QgYWluZGEuXCIgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3Rpb25zRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICB0aGlzLnJlbmRlckFjdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZmllbGQobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1sYWJlbFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQWN0aW9ucygpIHtcbiAgICBjb25zdCBhID0gdGhpcy5hY3Rpb25zRWw7XG4gICAgYS5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlybURlbCAmJiB0aGlzLm9wdHMucmVtb3ZlKSB7XG4gICAgICBhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGYtY29uZmlybVwiLCB0ZXh0OiBcIkV4Y2x1aXIgZXN0YSB0YXJlZmE/XCIgfSk7XG4gICAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICAgIGNvbnN0IHllcyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkV4Y2x1aXJcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSk7XG4gICAgICB5ZXMub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgeWVzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGF3YWl0IHRoaXMub3B0cy5yZW1vdmUhKCkpIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsYXJcIiB9KTtcbiAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IGZhbHNlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiKSB7XG4gICAgICBjb25zdCBkZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgZGVsLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmlybURlbCA9IHRydWU7IHRoaXMucmVuZGVyQWN0aW9ucygpOyB9O1xuICAgIH1cblxuICAgIGEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGNhbmNlbCA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgY2FuY2VsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgc2F2ZSA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlNhbHZhclwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIHNhdmUub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMudi5jb250ZW50ID0gdGhpcy52LmNvbnRlbnQudHJpbSgpO1xuICAgICAgaWYgKCF0aGlzLnYuY29udGVudCkgeyBuZXcgTm90aWNlKFwiRFx1MDBFQSB1bSB0XHUwMEVEdHVsbyBcdTAwRTAgdGFyZWZhLlwiKTsgcmV0dXJuOyB9XG4gICAgICBzYXZlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMuc3VibWl0KHRoaXMudikpIHRoaXMuY2xvc2UoKTtcbiAgICAgIGVsc2Ugc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICBvbkNsb3NlKCkgeyB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpOyB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBYmEgZGUgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIFdlcnVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGFwcCwgcGx1Z2luKTsgfVxuXG4gIGRpc3BsYXkoKSB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRvIGRhc2hib2FyZFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vZG8gY29tcGFjdG9cIilcbiAgICAgIC5zZXREZXNjKFwiTGF5b3V0IG1haXMgZGVuc28sIGNvbSBtZW5vcyBlc3BhXHUwMEU3YW1lbnRvIGVudHJlIG9zIGVsZW1lbnRvcy5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY29tcGFjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmQgKHZpc2liaWxpZGFkZSArIG9yZGVtKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTZVx1MDBFN1x1MDBGNWVzIGRvIGRhc2hib2FyZFwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkF0aXZlL2Rlc2F0aXZlIGNhZGEgc2VcdTAwRTdcdTAwRTNvIGUgYWp1c3RlIGEgb3JkZW0gZW0gcXVlIGFwYXJlY2VtIG5hIGRhc2hib2FyZC5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IG9yZGVyID0gcGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcjtcbiAgICBvcmRlci5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFNFQ1RJT05fTEFCRUxbaWRdKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy11cFwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBjaW1hXCIpLnNldERpc2FibGVkKGkgPT09IDApXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsIC0xKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy1kb3duXCIpLnNldFRvb2x0aXAoXCJNb3ZlciBwYXJhIGJhaXhvXCIpLnNldERpc2FibGVkKGkgPT09IG9yZGVyLmxlbmd0aCAtIDEpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKFwic2VjOlwiICsgaWQpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgYXdhaXQgcGx1Z2luLnNldEhpZGRlbihcInNlYzpcIiArIGlkLCAhdik7IH0pKTtcbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKVwiIH0pO1xuICAgIGNvbnN0IHRvcEZvbGRlcnMgPSAodGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpLmNoaWxkcmVuXG4gICAgICAuZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgIWMubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgYXMgVEZvbGRlcltdKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgaWYgKCF0b3BGb2xkZXJzLmxlbmd0aCkge1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgZGUgdG9wbyBubyBjb2ZyZS5cIiB9KTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIHRvcEZvbGRlcnMpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShmLm5hbWUpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJWaXNcdTAwRUR2ZWxcIilcbiAgICAgICAgICAuc2V0VmFsdWUoIXBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoZi5wYXRoKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oZi5wYXRoLCAhdik7IH0pKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRm9udGVzIGRhIFNlbWFuYSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJGb250ZXMgZGEgU2VtYW5hXCIgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICAgIHRleHQ6IFwiUGFzdGFzIGN1amFzIG5vdGFzIHZpcmFtIGNhcmRzIG5vcyBkaWFzIGRhIFNlbWFuYSAocG9zaVx1MDBFN1x1MDBFM28gcGVsYSBkYXRhIGRhIG5vdGEpLiBDYWRhIGZvbnRlIHRlbSB1bWEgY29yIHByXHUwMEYzcHJpYS5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNyY3MgPSBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHNyY3MuZm9yRWFjaChzID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShzLnBhdGgpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJBdGl2YVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZShzLm9uKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5vbiA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZENvbG9yUGlja2VyKGMgPT4gY1xuICAgICAgICAgIC5zZXRWYWx1ZShzLmNvbG9yKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5jb2xvciA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwidHJhc2gtMlwiKS5zZXRUb29sdGlwKFwiUmVtb3ZlciBmb250ZVwiKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMgPSBzcmNzLmZpbHRlcih4ID0+IHggIT09IHMpO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlZCA9IG5ldyBTZXQoc3Jjcy5tYXAocyA9PiBzLnBhdGgpKTtcbiAgICBjb25zdCBhdmFpbGFibGUgPSBhbGxGb2xkZXJQYXRocyh0aGlzLmFwcCkuZmlsdGVyKHAgPT4gIXVzZWQuaGFzKHApKTtcbiAgICBpZiAoYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiQWRpY2lvbmFyIGZvbnRlXCIpXG4gICAgICAgIC5zZXREZXNjKFwiRXNjb2xoYSB1bWEgcGFzdGEgZG8gY29mcmUgcGFyYSBhbGltZW50YXIgYSBTZW1hbmEuXCIpXG4gICAgICAgIC5hZGREcm9wZG93bihkID0+IHtcbiAgICAgICAgICBkLmFkZE9wdGlvbihcIlwiLCBcIkVzY29saGEgdW1hIHBhc3RhXHUyMDI2XCIpO1xuICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBhdmFpbGFibGUpIGQuYWRkT3B0aW9uKHAsIHApO1xuICAgICAgICAgIGQub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICBpZiAoIXYpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gQUNDRU5UU1twbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmxlbmd0aCAlIEFDQ0VOVFMubGVuZ3RoXTtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMucHVzaCh7IHBhdGg6IHYsIGNvbG9yLCBvbjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJJbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9rZW4gZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIlRvZG9pc3QgXHUyMTkyIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBJbnRlZ3JhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFRva2VuIGRlIEFQSSBkbyBkZXNlbnZvbHZlZG9yLiBTYWx2byBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIG8gdG9rZW4gYXF1aVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRhcyB0YXJlZmFzXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBvIHByb2pldG8gbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBvIG5vbWUgZG8gcHJvamV0byBhbyBsYWRvIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgYXMgQGV0aXF1ZXRhcyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nKVwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlVSTCBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiRW5kZXJlXHUwMEU3byBkbyBTeW5jdGhpbmcuIFBhZHJcdTAwRTNvOiBodHRwOi8vMTI3LjAuMC4xOjgzODQgKGEgaW5zdFx1MDBFMm5jaWEgbG9jYWwpLiBObyBjZWx1bGFyLCBhcG9udGUgcGFyYSBhIEFQSSBkZSBvdXRyYSBtXHUwMEUxcXVpbmEgbmEgcmVkZSBzZSBhIGxvY2FsIG5cdTAwRTNvIHJlc3BvbmRlci5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSB2LnRyaW0oKSB8fCBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFQSSBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiU3luY3RoaW5nIFx1MjE5MiBBY3Rpb25zIFx1MjE5MiBTZXR0aW5ncyBcdTIxOTIgQVBJIEtleS4gU2FsdmEgbG9jYWxtZW50ZSBlbSBkYXRhLmpzb24gKG5cdTAwRTNvIHZhaSBwYXJhIG8gR2l0KS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBhIEFQSSBrZXlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJRCBkYSBwYXN0YSAob3BjaW9uYWwpXCIpXG4gICAgICAuc2V0RGVzYyhcIkZvbGRlciBJRCBkbyBjb2ZyZSBubyBTeW5jdGhpbmcuIFZhemlvID0gdXNhIGEgcHJpbWVpcmEgcGFzdGEgYXV0b21hdGljYW1lbnRlLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJleC46IG51bnF2LW10aW1uXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBjb250YWdlbSBkZSBpdGVucyBwb3IgYXBhcmVsaG9cIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgXFxcInNpbmNyb25pemFkb3MgLyB0b3RhbFxcXCIgZGUgaXRlbnMgZW0gY2FkYSBhcGFyZWxobywgYWxcdTAwRTltIGRhIHBvcmNlbnRhZ2VtLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICB9KSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUEySztBQUUzSyxJQUFNLFlBQVk7QUFtQ2xCLElBQU0sbUJBQWlDO0FBQUEsRUFDckMsY0FBYyxDQUFDLFNBQVMsV0FBVyxRQUFRLFFBQVEsV0FBVyxVQUFVLFVBQVU7QUFBQSxFQUNsRixTQUFTO0FBQUEsRUFDVCxRQUFRLENBQUM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLGlCQUFpQjtBQUFBLElBQ2YsRUFBRSxNQUFNLG1DQUFnQyxPQUFPLFdBQVcsSUFBSSxLQUFLO0FBQUEsSUFDbkUsRUFBRSxNQUFNLGdCQUFnQyxPQUFPLFdBQVcsSUFBSSxLQUFLO0FBQUEsRUFDckU7QUFBQSxFQUNBLGNBQWM7QUFBQSxFQUNkLGlCQUFpQjtBQUFBLEVBQ2pCLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFO0FBQUEsRUFDM0Msb0JBQW9CO0FBQUEsRUFDcEIsbUJBQW1CO0FBQUEsRUFDbkIsY0FBYztBQUFBLEVBQ2QsaUJB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
