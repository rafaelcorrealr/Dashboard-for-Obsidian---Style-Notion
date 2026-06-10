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
  const stripped = line.replace(/(?<=^|\s)@([\p{L}\p{N}_]+)/gu, (_m, name) => {
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
      lhd.onclick = () => {
        this.laterOpen = !this.laterOpen;
        this.rerenderAll();
      };
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
      nhd.onclick = () => {
        this.noDateOpen = !this.noDateOpen;
        this.rerenderAll();
      };
      if (this.noDateOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of noDate) this.todoRow(list, t);
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
      this.registerEvent(this.app.vault.on(ev, () => {
        this.plugin.invalidateVaultCache();
        this.schedule();
      }));
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
      const items = (_b = byDay[key]) != null ? _b : [];
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
    var _a;
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
    this.registerInterval(window.setInterval(() => this.todo.maybeRefresh(), 6e4));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5jb25zdCBMU19UT0RPX0NBQ0hFID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6dG9kb2lzdENhY2hlXCI7ICAgLy8gY2FjaGUgb2ZmbGluZSBkbyBUb2RvaXN0IChwb3ItZGlzcG9zaXRpdm8pXG5jb25zdCBUT0RPX1RUTCA9IDUgKiA2MCAqIDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZGFkZSBtXHUwMEUxeC4gZG8gY2FjaGUgYW50ZXMgZGUgcmUtYnVzY2FyICg1IG1pbilcbmNvbnN0IFRPRE9fTUFYX1BBR0VTID0gNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRldG8gZGUgcFx1MDBFMWdpbmFzIHBhZ2luYWRhcyAoYW50aS1sb29wIHNlIGEgQVBJIHJlcGV0aXIgbyBjdXJzb3IpXG5cbi8vIHVpZCBjdXJ0byBlIGVzdFx1MDBFMXZlbCAocGFjb3RlcyBkZSB0YXJlZmFzKS5cbmZ1bmN0aW9uIHVpZCgpOiBzdHJpbmcge1xuICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KTtcbn1cblxudHlwZSBTdGF0dXMgPSBcInByb2dyZXNzXCIgfCBcInBhdXNlZFwiIHwgXCJjYW5jZWxsZWRcIjtcbnR5cGUgU2VjdGlvbklkID0gXCJjYWxlbmRhclwiIHwgXCJwYXJhXCIgfCBcImhlYXRtYXBcIiB8IFwiZ3Jvd3RoXCIgfCBcInN0YXRzXCIgfCBcInRvZG9pc3RcIiB8IFwic3luY1wiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhc2hTZXR0aW5ncyA9IHtcbiAgc2VjdGlvbk9yZGVyOiBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXSxcbiAgY29tcGFjdDogZmFsc2UsXG4gIGhpZGRlbjogW10sXG4gIG5vdGVWaWV3OiBcImxpc3RcIixcbiAgY2FsZW5kYXJTb3VyY2VzOiBbXG4gICAgeyBwYXRoOiBcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiLCBjb2xvcjogXCIjM0I4MkY2XCIsIG9uOiB0cnVlIH0sXG4gICAgeyBwYXRoOiBcIjUwLkRpXHUwMEUxcmlvXCIsICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMTBCOTgxXCIsIG9uOiB0cnVlIH0sXG4gIF0sXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbiAgdG9kb2lzdERheVJhbmdlOiA3LFxuICB0b2RvaXN0RmlsdGVyczogeyBwcm9qZWN0czogW10sIGxhYmVsczogW10gfSxcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiB0cnVlLFxuICB0b2RvaXN0U2hvd0xhYmVsczogZmFsc2UsXG4gIHN5bmN0aGluZ1VybDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIixcbiAgc3luY3RoaW5nQXBpS2V5OiBcIlwiLFxuICBzeW5jdGhpbmdGb2xkZXJJZDogXCJcIixcbiAgc3luY3RoaW5nU2hvd0NvdW50czogZmFsc2UsXG4gIHRhc2tQYWNrYWdlczogW10sXG4gIHBhY2thZ2VDb25maXJtOiBcIm1hbnlcIixcbn07XG5cbmludGVyZmFjZSBQYXJhU2VjdGlvbiB7XG4gIGZvbGRlcjogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGFjY2VudDogc3RyaW5nO1xufVxuXG4vLyBQYXN0YXMgXCJjb25oZWNpZGFzXCIgZG8gUEFSQTogbWFudFx1MDBFQW0gXHUwMEVEY29uZSwgclx1MDBGM3R1bG8gZSBjb3IgZml4b3MuIEFzIGRlbWFpcyBwYXN0YXNcbi8vIGRvIGNvZnJlIHNcdTAwRTNvIHJlbmRlcml6YWRhcyBjb20gY29yIGF1dG9tXHUwMEUxdGljYSBlIFx1MDBFRGNvbmUgcGFkclx1MDBFM28gKG91IG8gaWNvbjogZG8gc3RhdHVzLm1kKS5cbmNvbnN0IFBBUkE6IFBhcmFTZWN0aW9uW10gPSBbXG4gIHsgZm9sZGVyOiBcIjAwLkluYm94XCIsICAgICBpY29uOiBcIlx1RDgzRFx1RENFNVwiLCBsYWJlbDogXCJJbmJveFwiLCAgICBhY2NlbnQ6IFwiIzYzNjZGMVwiIH0sXG4gIHsgZm9sZGVyOiBcIjEwLlByb2plY3RzXCIsICBpY29uOiBcIlx1RDgzRFx1REU4MFwiLCBsYWJlbDogXCJQcm9qZXRvc1wiLCBhY2NlbnQ6IFwiIzEwQjk4MVwiIH0sXG4gIHsgZm9sZGVyOiBcIjIwLkFyZWFzXCIsICAgICBpY29uOiBcIlx1RDgzQ1x1REZBRlwiLCBsYWJlbDogXCJcdTAwQzFyZWFzXCIsICAgIGFjY2VudDogXCIjRjU5RTBCXCIgfSxcbiAgeyBmb2xkZXI6IFwiMzAuUmVzb3VyY2VzXCIsIGljb246IFwiXHVEODNEXHVEQ0RBXCIsIGxhYmVsOiBcIlJlY3Vyc29zXCIsIGFjY2VudDogXCIjM0I4MkY2XCIgfSxcbiAgeyBmb2xkZXI6IFwiNDAuQXJjaGl2ZVwiLCAgIGljb246IFwiXHVEODNEXHVEREM0XHVGRTBGXCIsICBsYWJlbDogXCJBcnF1aXZvXCIsICBhY2NlbnQ6IFwiIzZCNzI4MFwiIH0sXG5dO1xuY29uc3QgUEFSQV9NQVAgPSBuZXcgTWFwKFBBUkEubWFwKHAgPT4gW3AuZm9sZGVyLCBwXSkpO1xuXG4vLyBQYWxldGEgcGFyYSBjb2xvcmlyIHBhc3RhcyBkZXNjb25oZWNpZGFzIGRlIGZvcm1hIGVzdFx1MDBFMXZlbCAocG9yIGhhc2ggZG8gbm9tZSkuXG5jb25zdCBBQ0NFTlRTID0gW1wiIzYzNjZGMVwiLFwiIzEwQjk4MVwiLFwiI0Y1OUUwQlwiLFwiIzNCODJGNlwiLFwiI0VDNDg5OVwiLFwiIzhCNUNGNlwiLFwiIzE0QjhBNlwiLFwiI0VGNDQ0NFwiXTtcblxuY29uc3QgREFZX1NIT1JUID0gW1wiU2VnXCIsIFwiVGVyXCIsIFwiUXVhXCIsIFwiUXVpXCIsIFwiU2V4XCIsIFwiU1x1MDBFMWJcIiwgXCJEb21cIl07XG5jb25zdCBNT05USF9TSE9SVCA9IFtcIkphblwiLFwiRmV2XCIsXCJNYXJcIixcIkFiclwiLFwiTWFpXCIsXCJKdW5cIixcIkp1bFwiLFwiQWdvXCIsXCJTZXRcIixcIk91dFwiLFwiTm92XCIsXCJEZXpcIl07XG5jb25zdCBJTUdfRVhUID0gW1wicG5nXCIsXCJqcGdcIixcImpwZWdcIixcIndlYnBcIixcImdpZlwiLFwic3ZnXCJdO1xuXG4vLyBQYXN0YSByYWl6IGRhcyBub3RhcyBkaVx1MDBFMXJpYXMgKGNyaWFkYXMgYW8gY2xpY2FyIG51bSBkaWEgZG8gY2FsZW5kXHUwMEUxcmlvKS5cbmNvbnN0IERBSUxZX0ZPTERFUiA9IFwiNTAuRGlcdTAwRTFyaW9cIjtcbi8vIFRlbXBsYXRlIG9wY2lvbmFsOyBwbGFjZWhvbGRlcnMge3tkYXRlfX0gKFlZWVktTU0tREQpIGUge3t0aXRsZX19IChkYXRhIHBvciBleHRlbnNvKS5cbmNvbnN0IERBSUxZX1RFTVBMQVRFID0gXCJNb2RlbG9zL05vdGEgRGlcdTAwRTFyaWEubWRcIjtcblxuY29uc3QgU1RBVFVTX0lDT046IFJlY29yZDxTdGF0dXMsIHN0cmluZz4gPSB7XG4gIHByb2dyZXNzOiBcIlx1MjVCNlwiLCBwYXVzZWQ6IFwiXHUyM0Y4XCIsIGNhbmNlbGxlZDogXCJcdTI3MTVcIixcbn07XG5cbmNvbnN0IFNFQ19DQUwgPSBcInNlYzpjYWxlbmRhclwiO1xuY29uc3QgU0VDX1BBUkEgPSBcInNlYzpwYXJhXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5jb25zdCBTRUNfVE9ETyA9IFwic2VjOnRvZG9pc3RcIjtcbmNvbnN0IFNFQ19TWU5DID0gXCJzZWM6c3luY1wiO1xuXG4vLyBSXHUwMEYzdHVsb3MgYW1pZ1x1MDBFMXZlaXMgZGFzIHNlXHUwMEU3XHUwMEY1ZXMgKHVzYWRvcyBuYSBhYmEgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlxuY29uc3QgU0VDVElPTl9MQUJFTDogUmVjb3JkPFNlY3Rpb25JZCwgc3RyaW5nPiA9IHtcbiAgc3RhdHM6ICAgIFwiRXN0YXRcdTAwRURzdGljYXNcIixcbiAgdG9kb2lzdDogIFwiVGFyZWZhc1wiLFxuICBwYXJhOiAgICAgXCJDb2ZyZSAocGFzdGFzKVwiLFxuICBzeW5jOiAgICAgXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzb1wiLFxuICBoZWF0bWFwOiAgXCJBdGl2aWRhZGUgZG8gY29mcmVcIixcbiAgZ3Jvd3RoOiAgIFwiQ3Jlc2NpbWVudG8gZG8gY29mcmVcIixcbiAgY2FsZW5kYXI6IFwiUmVsYXRcdTAwRjNyaW9zXCIsXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRvZG9pc3RUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEk6IDEuLjQsIG9uZGUgNCA9IHVyZ2VudGUgKD0gcDEgbmEgVUkpXG4gIGR1ZT86IHsgZGF0ZTogc3RyaW5nOyBkYXRldGltZT86IHN0cmluZzsgc3RyaW5nPzogc3RyaW5nOyBpc19yZWN1cnJpbmc/OiBib29sZWFuIH0gfCBudWxsO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xuICBpc19jb21wbGV0ZWQ/OiBib29sZWFuO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG4vLyBObyBtb2RvIFwibWFueVwiLCBsYW5cdTAwRTdhciBtYWlzIHF1ZSBpc3RvIHBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvLlxuY29uc3QgTEFVTkNIX0NPTkZJUk1fTUlOID0gNTtcblxuLy8gXHUwMENEY29uZXMgc3VnZXJpZG9zIHBhcmEgb3MgcGFjb3RlcyAobm9tZXMgTHVjaWRlOyByZW5kZXJpemFkb3MgcG9yIHJlbmRlckljb24pLlxuY29uc3QgUEtHX0lDT05TID0gW1xuICBcInN1bnJpc2VcIiwgXCJzdW5cIiwgXCJzdW5zZXRcIiwgXCJtb29uXCIsIFwiY29mZmVlXCIsIFwidXRlbnNpbHNcIiwgXCJkdW1iYmVsbFwiLCBcImJvb2stb3BlblwiLFxuICBcImJyaWVmY2FzZVwiLCBcImdyYWR1YXRpb24tY2FwXCIsIFwiaG9tZVwiLCBcInNob3BwaW5nLWNhcnRcIiwgXCJoZWFydFwiLCBcImRyb3BsZXRcIiwgXCJwaWxsXCIsXG4gIFwiYmVkXCIsIFwiY2xvY2tcIiwgXCJjYWxlbmRhclwiLCBcImNoZWNrLWNoZWNrXCIsIFwibGlzdC1jaGVja3NcIiwgXCJ0YXJnZXRcIiwgXCJmbGFtZVwiLCBcInphcFwiLFxuICBcInN0YXJcIiwgXCJzcGFya2xlc1wiLCBcInJvY2tldFwiLCBcImJydXNoXCIsIFwibXVzaWNcIiwgXCJnYW1lcGFkLTJcIiwgXCJkb2dcIixcbl07XG5cbi8vIFNlcGFyYSBhcyBldGlxdWV0YXMgaW5saW5lIChAZXRpcXVldGEpIGRvIHRleHRvIGRlIHVtYSBsaW5oYSBkZSB0YXJlZmEuXG4vLyBEZXZvbHZlIG8gdFx1MDBFRHR1bG8gbGltcG8gKGVzdGlsbyBRdWljayBBZGQgZG8gVG9kb2lzdCkgKyBldGlxdWV0YXMgY29tYmluYWRhc1xuLy8gKGFzIGRvIHBhY290ZSBwcmltZWlybywgZGVwb2lzIGFzIGlubGluZSwgc2VtIGR1cGxpY2FyKS5cbmZ1bmN0aW9uIHNwbGl0VGFza0xhYmVscyhsaW5lOiBzdHJpbmcsIHBrZ0xhYmVsczogc3RyaW5nW10gPSBbXSk6IHsgdGl0bGU6IHN0cmluZzsgbGFiZWxzOiBzdHJpbmdbXSB9IHtcbiAgY29uc3QgaW5saW5lOiBzdHJpbmdbXSA9IFtdO1xuICAvLyBTXHUwMEYzIGBAZXRpcXVldGFgIG5vIGluXHUwMEVEY2lvIG91IGRlcG9pcyBkZSBlc3BhXHUwMEU3byAobG9va2JlaGluZCkgXHUyMDE0IG5cdTAwRTNvIHBlZ2EgbyBcIkBnbWFpbFwiXG4gIC8vIGRlIHVtIGUtbWFpbCBjb21vIFwicGFnYXIgY29udGFAZ21haWwuY29tXCIuXG4gIGNvbnN0IHN0cmlwcGVkID0gbGluZS5yZXBsYWNlKC8oPzw9XnxcXHMpQChbXFxwe0x9XFxwe059X10rKS9ndSwgKF9tLCBuYW1lOiBzdHJpbmcpID0+IHsgaW5saW5lLnB1c2gobmFtZSk7IHJldHVybiBcIlwiOyB9KVxuICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csIFwiIFwiKS50cmltKCk7XG4gIGNvbnN0IHRpdGxlID0gc3RyaXBwZWQgfHwgbGluZS50cmltKCk7XG4gIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5wa2dMYWJlbHMsIC4uLmlubGluZV0pXTtcbiAgcmV0dXJuIHsgdGl0bGUsIGxhYmVscyB9O1xufVxuXG4vLyBQb3BvdmVyIGZsdXR1YW50ZSBnZW5cdTAwRTlyaWNvLCBhbmNvcmFkbyBudW0gZWxlbWVudG8uIGBmaWxsKGJvZHksIGNsb3NlKWAgbW9udGEgb1xuLy8gY29udGVcdTAwRkFkby4gRmVjaGEgYW8gY2xpY2FyIGZvcmEgb3UgRXNjYXBlIChvcHRzLm9uQ2xvc2Ugcm9kYSBhbnRlcyBkZSByZW1vdmVyKS5cbmZ1bmN0aW9uIG9wZW5Qb3BvdmVyKFxuICBhbmNob3I6IEhUTUxFbGVtZW50LFxuICBmaWxsOiAoYm9keTogSFRNTEVsZW1lbnQsIGNsb3NlOiAoKSA9PiB2b2lkKSA9PiB2b2lkLFxuICBvcHRzOiB7IGNscz86IHN0cmluZzsgd2lkdGg/OiBudW1iZXI7IG9uQ2xvc2U/OiAoKSA9PiB2b2lkIH0gPSB7fSxcbik6ICgpID0+IHZvaWQge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndkLXBvcFwiKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gIGNvbnN0IHBvcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcFwiICsgKG9wdHMuY2xzID8gXCIgXCIgKyBvcHRzLmNscyA6IFwiXCIpIH0pO1xuICBpZiAob3B0cy53aWR0aCkgcG9wLnN0eWxlLndpZHRoID0gYCR7b3B0cy53aWR0aH1weGA7XG5cbiAgY29uc3Qgb25Eb2MgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBOb2RlO1xuICAgIGlmICghcG9wLmNvbnRhaW5zKHQpICYmIHQgIT09IGFuY2hvciAmJiAhYW5jaG9yLmNvbnRhaW5zKHQpKSBjbG9zZSgpO1xuICB9O1xuICBjb25zdCBvbktleSA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7IGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgY2xvc2UoKTsgfTtcbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgb3B0cy5vbkNsb3NlPy4oKTtcbiAgICBwb3AucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRvYywgdHJ1ZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXksIHRydWUpO1xuICB9XG5cbiAgZmlsbChwb3AsIGNsb3NlKTtcblxuICBjb25zdCByID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBwb3Auc3R5bGUudG9wID0gYCR7ci5ib3R0b20gKyA0fXB4YDtcbiAgcG9wLnN0eWxlLmxlZnQgPSBgJHtyLmxlZnR9cHhgO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGNvbnN0IHByID0gcG9wLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChwci5yaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgcG9wLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCB3aW5kb3cuaW5uZXJXaWR0aCAtIHByLndpZHRoIC0gOCl9cHhgO1xuICAgIGlmIChwci5ib3R0b20gPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSBwb3Auc3R5bGUudG9wID0gYCR7TWF0aC5tYXgoOCwgci50b3AgLSBwci5oZWlnaHQgLSA0KX1weGA7XG4gIH0pO1xuXG4gIC8vIFJlZ2lzdHJhIGRlcG9pcyBkbyBjbGlxdWUgZGUgYWJlcnR1cmEgcGFyYSBuXHUwMEUzbyBmZWNoYXIgaW1lZGlhdGFtZW50ZS5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRvYywgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXksIHRydWUpO1xuICB9LCAwKTtcbiAgcmV0dXJuIGNsb3NlO1xufVxuXG4vLyBQb3BvdmVyIGRlIHNlbGVcdTAwRTdcdTAwRTNvIGRlIFx1MDBFRGNvbmUgKHBhbGV0YSkuIGBjdXJyZW50YCA9IFx1MDBFRGNvbmUgc2VsZWNpb25hZG8gKGRlc3RhY2EpLlxuZnVuY3Rpb24gb3Blbkljb25Qb3BvdmVyKGFuY2hvcjogSFRNTEVsZW1lbnQsIGN1cnJlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCwgb25QaWNrOiAoaWNvbjogc3RyaW5nIHwgdW5kZWZpbmVkKSA9PiB2b2lkKSB7XG4gIG9wZW5Qb3BvdmVyKGFuY2hvciwgKHBvcCwgY2xvc2UpID0+IHtcbiAgICBjb25zdCBub25lID0gcG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb25vcHQgd2QtcGtnLWljb25ub25lXCIgKyAoIWN1cnJlbnQgPyBcIiB3ZC1vblwiIDogXCJcIiksIHRleHQ6IFwiXHUyMDE0XCIgfSk7XG4gICAgbm9uZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJTZW0gXHUwMEVEY29uZVwiKTtcbiAgICBub25lLm9uY2xpY2sgPSAoKSA9PiB7IG9uUGljayh1bmRlZmluZWQpOyBjbG9zZSgpOyB9O1xuICAgIGZvciAoY29uc3QgaWMgb2YgUEtHX0lDT05TKSB7XG4gICAgICBjb25zdCBvcHQgPSBwb3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbm9wdFwiICsgKGN1cnJlbnQgPT09IGljID8gXCIgd2Qtb25cIiA6IFwiXCIpIH0pO1xuICAgICAgcmVuZGVySWNvbihvcHQsIGljKTtcbiAgICAgIG9wdC5zZXRBdHRyKFwidGl0bGVcIiwgaWMpO1xuICAgICAgb3B0Lm9uY2xpY2sgPSAoKSA9PiB7IG9uUGljayhpYyk7IGNsb3NlKCk7IH07XG4gICAgfVxuICB9LCB7IGNsczogXCJ3ZC1pY29uLXBvcFwiIH0pO1xufVxuXG4vLyBCdXNjYSBhcyB0YXJlZmFzIGF0aXZhcyAoblx1MDBFM28gY29uY2x1XHUwMEVEZGFzKSB2aWEgQVBJIHVuaWZpY2FkYSB2MSAoYSBSRVNUIHYyIGZvaVxuLy8gYXBvc2VudGFkYSBcdTIxOTIgcmVzcG9uZGlhIDQxMCkuIEEgdjEgXHUwMEU5IHBhZ2luYWRhOiB7IHJlc3VsdHMsIG5leHRfY3Vyc29yIH0uXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RUYXNrW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIC8vIHYxIGVudmVsb3BhIGVtIHJlc3VsdHM7IHRvbGVyYSByZXNwb3N0YSBjb21vIGFycmF5IHB1cm8gcG9yIHNlZ3VyYW5cdTAwRTdhLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RUYXNrW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RQcm9qZWN0IHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vLyBCdXNjYSBvcyBwcm9qZXRvcyAocGFyYSBvIGZpbHRybykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYSBkYXMgdGFyZWZhcy5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RQcm9qZWN0W10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9wcm9qZWN0c1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0UHJvamVjdFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0UHJvamVjdFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0TGFiZWwge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gbm9tZSBkYSBwYWxldGEgKGV4LjogXCJjaGFyY29hbFwiKVxufVxuXG4vLyBCdXNjYSBhcyBldGlxdWV0YXMgcGVzc29haXMgKHBhcmEgY29sb3JpciBvcyBjaGlwcykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0TGFiZWxbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RMYWJlbFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9sYWJlbHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdExhYmVsW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RMYWJlbFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jdGhpbmcgKEFQSSBSRVNUKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFNURm9sZGVyIHsgaWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBwYXVzZWQ6IGJvb2xlYW4gfVxuaW50ZXJmYWNlIFNURGV2aWNlIHsgZGV2aWNlSUQ6IHN0cmluZzsgbmFtZTogc3RyaW5nIH1cbmludGVyZmFjZSBTVFN0YXR1cyB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZXJyb3JzOiBudW1iZXI7IHB1bGxFcnJvcnM6IG51bWJlciB9XG5pbnRlcmZhY2UgU1RDb21wbGV0aW9uIHsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXIgfVxuXG5pbnRlcmZhY2UgU3luY0RldlJvdyB7IG5hbWU6IHN0cmluZzsgb25saW5lOiBib29sZWFuOyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlcjsgbGFzdFNlZW46IHN0cmluZyB9XG5pbnRlcmZhY2UgU3luY0RhdGEgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGZvbGRlckxhYmVsOiBzdHJpbmc7IGVycm9yczogbnVtYmVyOyBkZXZpY2VzOiBTeW5jRGV2Um93W10gfVxuXG5mdW5jdGlvbiBodW1hbkJ5dGVzKG46IG51bWJlcik6IHN0cmluZyB7XG4gIGlmICghbikgcmV0dXJuIFwiMCBCXCI7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwNDg1NzYpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQobiA8IDEwMjQwID8gMSA6IDApfSBLQmA7XG4gIHJldHVybiBgJHsobiAvIDEwNDg1NzYpLnRvRml4ZWQobiA8IDEwNDg1NzYwID8gMSA6IDApfSBNQmA7XG59XG5cbmZ1bmN0aW9uIHJlbFRpbWUoaXNvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICBpZiAoaXNOYU4odCkgfHwgdCA8IDEpIHJldHVybiBcIlx1MjAxNFwiO1xuICBjb25zdCBzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIHQpIC8gMTAwMCk7XG4gIGlmIChzIDwgNjApIHJldHVybiBcImFnb3JhXCI7XG4gIGlmIChzIDwgMzYwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gNjApfSBtaW5gO1xuICBpZiAocyA8IDg2NDAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyAzNjAwKX0gaGA7XG4gIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDg2NDAwKX0gZGA7XG59XG5cbi8vIEdFVCBnZW5cdTAwRTlyaWNvIG5hIEFQSSBkbyBTeW5jdGhpbmcgKGhlYWRlciBYLUFQSS1LZXk7IHJlcXVlc3RVcmwgaWdub3JhIENPUlMpLlxuYXN5bmMgZnVuY3Rpb24gc3RHZXQ8VD4oYmFzZTogc3RyaW5nLCBrZXk6IHN0cmluZywgcGF0aDogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IHVybCA9IGJhc2UucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoeyB1cmwsIG1ldGhvZDogXCJHRVRcIiwgaGVhZGVyczogeyBcIlgtQVBJLUtleVwiOiBrZXkgfSwgdGhyb3c6IGZhbHNlIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwiQVBJIGtleSBpbnZcdTAwRTFsaWRhICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFQ7XG59XG5cbi8vIFVSTCBwYXJhIGFicmlyIGEgdGFyZWZhIG5vIFRvZG9pc3QgKHVzYSBhIGRvIHBheWxvYWQgb3UgbW9udGEgYSBwYXJ0aXIgZG8gaWQpLlxuZnVuY3Rpb24gdGFza1VybCh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gIHJldHVybiB0LnVybCA/PyBgaHR0cHM6Ly9hcHAudG9kb2lzdC5jb20vYXBwL3Rhc2svJHt0LmlkfWA7XG59XG5cbi8vIENvbmNsdWkgKGZlY2hhKSB1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFBPU1Qgc2VtIGNvcnBvOyAyMDQgPSBzdWNlc3NvLiBGYXNlIDguMi5cbmFzeW5jIGZ1bmN0aW9uIGNsb3NlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vY2xvc2VgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBFc2NyaXRhOiBjcmlhciAvIGVkaXRhciAvIG1vdmVyIC8gZXhjbHVpciAodjAuOC4wKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ2FtcG9zIGdyYXZcdTAwRTF2ZWlzLiBUb2RvcyBvcGNpb25haXMgXHUyMDE0IG5vIGVkaXRhciBtYW5kbyBzXHUwMEYzIG8gcXVlIG11ZG91LlxuaW50ZXJmYWNlIFRvZG9pc3RXcml0ZSB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eT86IG51bWJlcjsgICAgIC8vIDEuLjQgKDQgPSB1cmdlbnRlIC8gcDEgbmEgVUkpXG4gIGR1ZV9kYXRlPzogc3RyaW5nOyAgICAgLy8gZGF0YSBmaXhhIFlZWVktTU0tREQgKHZpbmRvIGRvIGNhbGVuZFx1MDBFMXJpbylcbiAgZHVlX3N0cmluZz86IHN0cmluZzsgICAvLyBsaW5ndWFnZW0gbmF0dXJhbDsgXCJubyBkYXRlXCIgbGltcGEgYSBkYXRhXG4gIGR1ZV9sYW5nPzogc3RyaW5nOyAgICAgLy8gXCJwdFwiIFx1MjE5MiBpbnRlcnByZXRhIGVtIHBvcnR1Z3VcdTAwRUFzXG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBqc29uSGVhZGVycyh0b2tlbjogc3RyaW5nKSB7XG4gIHJldHVybiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLCBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9O1xufVxuXG4vLyBDcmlhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzIFx1MjE5MiAyMDAgY29tIGEgdGFyZWZhIGNyaWFkYS5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTxUb2RvaXN0VGFzaz4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUb2RvaXN0VGFzaztcbn1cblxuLy8gRWRpdGEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3Mve2lkfSBcdTIxOTIgMjAwLiBOXHUwMEUzbyB0cm9jYSBkZSBwcm9qZXRvICh1c2UgbW92ZVRvZG9pc3RUYXNrKS5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIE1vdmUgYSB0YXJlZmEgcGFyYSBvdXRybyBwcm9qZXRvLiBQT1NUIC90YXNrcy97aWR9L21vdmUgXHUyMTkyIDIwMC5cbmFzeW5jIGZ1bmN0aW9uIG1vdmVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBwcm9qZWN0X2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L21vdmVgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcHJvamVjdF9pZCB9KSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBFeGNsdWkgYSB0YXJlZmEuIERFTEVURSAvdGFza3Mve2lkfSBcdTIxOTIgMjA0LlxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG4vLyAobWQvaW1nIGRhIHN1Ylx1MDBFMXJ2b3JlIHZcdTAwRUFtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlLilcbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG4vLyBBZ3JlZ2FkbyBkZSB1cmdcdTAwRUFuY2lhIGRlIHVtYSBzdWJcdTAwRTFydm9yZSAodmVtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlKS5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFVNQSBwYXNzYWRhIChERlMpIG1vbnRhIG9zIGFncmVnYWRvcyBwb3IgcGFzdGEgKHN1Ylx1MDBFMXJ2b3JlKSArIG9zIGdsb2JhaXMgcXVlXG4vLyB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIGNvbnNvbWVtIFx1MjAxNCBhbnRlcyBjYWRhIHNlXHUwMEU3XHUwMEUzbyB2YXJyaWEgbyBjb2ZyZSBwb3IgY29udGEgcHJcdTAwRjNwcmlhXG4vLyAofjhcdTIwMTMxMFx1MDBENyBwb3IgcmVuZGVyKS4gSW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdCBlIHJlY3JpYWRvIHNvYiBkZW1hbmRhLlxuaW50ZXJmYWNlIEZvbGRlckFnZyB7XG4gIG1kOiBudW1iZXI7ICAgICAgICAgIC8vIG5vdGFzIC5tZCAoZXhjZXRvIHN0YXR1cy5tZCkgbmEgc3ViXHUwMEUxcnZvcmVcbiAgaW1nOiBudW1iZXI7ICAgICAgICAgLy8gaW1hZ2VucyBuYSBzdWJcdTAwRTFydm9yZVxuICByZXZpZXdlZDogbnVtYmVyOyAgICAvLyAubWQgY29tIHJldmlld2VkOnRydWUgbmEgc3ViXHUwMEUxcnZvcmVcbiAgdXJnZW5jeTogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyAgIC8vIG5vdGFzIGNvbSB1cmdlbmN5IChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYylcbiAgdXJnZW5jeU1heDogVXJnZW5jeSB8IG51bGw7XG4gIHJlY2VudDogVEZpbGVbXTsgICAgIC8vIGF0XHUwMEU5IDQgbm90YXMgLm1kIG1haXMgcmVjZW50ZXMgKG10aW1lKSBkYSBzdWJcdTAwRTFydm9yZVxufVxuaW50ZXJmYWNlIFZhdWx0Q2FjaGUge1xuICBieUZvbGRlcjogTWFwPHN0cmluZywgRm9sZGVyQWdnPjsgICAgICAgICAgICAgIC8vIHBhdGggZGEgcGFzdGEgXHUyMTkyIGFncmVnYWRvc1xuICBkYXRlZE5vdGVzOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdOyAgIC8vIG5vdGFzIGNvbSBkYXRhIChmcm9udG1hdHRlciBkYXRlOiBvdSBub21lIEFBQUEtTU0tREQpXG4gIGN0aW1lQnlEYXk6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAgICAgICAgICAgLy8gQUFBQS1NTS1ERCBcdTIxOTIgblx1MDBCQSBkZSBub3RhcyBjcmlhZGFzIChjdGltZSlcbiAgdG90YWxOb3RlczogbnVtYmVyO1xuICB0b3RhbFJldmlld2VkOiBudW1iZXI7XG59XG5jb25zdCBFTVBUWV9BR0c6IEZvbGRlckFnZyA9IHsgbWQ6IDAsIGltZzogMCwgcmV2aWV3ZWQ6IDAsIHVyZ2VuY3k6IFtdLCB1cmdlbmN5TWF4OiBudWxsLCByZWNlbnQ6IFtdIH07XG5cbmZ1bmN0aW9uIGJ1aWxkVmF1bHRDYWNoZShhcHA6IEFwcCk6IFZhdWx0Q2FjaGUge1xuICBjb25zdCBieUZvbGRlciA9IG5ldyBNYXA8c3RyaW5nLCBGb2xkZXJBZ2c+KCk7XG4gIGNvbnN0IGRhdGVkTm90ZXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgY29uc3QgY3RpbWVCeURheSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDA7XG5cbiAgY29uc3Qgd2FsayA9IChmb2xkZXI6IFRGb2xkZXIpOiBGb2xkZXJBZ2cgPT4ge1xuICAgIGNvbnN0IGFnZzogRm9sZGVyQWdnID0geyBtZDogMCwgaW1nOiAwLCByZXZpZXdlZDogMCwgdXJnZW5jeTogW10sIHVyZ2VuY3lNYXg6IG51bGwsIHJlY2VudDogW10gfTtcbiAgICBjb25zdCByZWNlbnQ6IFRGaWxlW10gPSBbXTsgICAvLyBjYW5kaWRhdG9zOiBhcnF1aXZvcyBwclx1MDBGM3ByaW9zICsgdG9wLTQgZGUgY2FkYSBmaWxob1xuICAgIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICBjb25zdCBzdWIgPSB3YWxrKGMpO1xuICAgICAgICBhZ2cubWQgKz0gc3ViLm1kOyBhZ2cuaW1nICs9IHN1Yi5pbWc7IGFnZy5yZXZpZXdlZCArPSBzdWIucmV2aWV3ZWQ7XG4gICAgICAgIGlmIChzdWIudXJnZW5jeS5sZW5ndGgpIGFnZy51cmdlbmN5LnB1c2goLi4uc3ViLnVyZ2VuY3kpO1xuICAgICAgICBpZiAoc3ViLnJlY2VudC5sZW5ndGgpIHJlY2VudC5wdXNoKC4uLnN1Yi5yZWNlbnQpO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgICAgYWdnLm1kKys7XG4gICAgICAgICAgcmVjZW50LnB1c2goYyk7XG4gICAgICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgICAgIGNvbnN0IGZtID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgaWYgKGZtPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgeyBhZ2cucmV2aWV3ZWQrKzsgdG90YWxSZXZpZXdlZCsrOyB9XG4gICAgICAgICAgY29uc3QgdSA9IGZtPy51cmdlbmN5O1xuICAgICAgICAgIGlmICh1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiKSBhZ2cudXJnZW5jeS5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICAgICAgY29uc3QgY2sgPSB0b0tleShuZXcgRGF0ZShjLnN0YXQuY3RpbWUpKTtcbiAgICAgICAgICBjdGltZUJ5RGF5LnNldChjaywgKGN0aW1lQnlEYXkuZ2V0KGNrKSA/PyAwKSArIDEpO1xuICAgICAgICAgIGNvbnN0IG0gPSBjLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKGZtPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgICAgICBpZiAoZCkgZGF0ZWROb3Rlcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGFnZy5pbWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWNlbnQuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgICBhZ2cucmVjZW50ID0gcmVjZW50LnNsaWNlKDAsIDQpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgYWdnLnVyZ2VuY3kpXG4gICAgICBpZiAoIWFnZy51cmdlbmN5TWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbYWdnLnVyZ2VuY3lNYXhdKSBhZ2cudXJnZW5jeU1heCA9IGl0LmxldmVsO1xuICAgIGFnZy51cmdlbmN5LnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gICAgYnlGb2xkZXIuc2V0KGZvbGRlci5wYXRoLCBhZ2cpO1xuICAgIHJldHVybiBhZ2c7XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiB7IGJ5Rm9sZGVyLCBkYXRlZE5vdGVzLCBjdGltZUJ5RGF5LCB0b3RhbE5vdGVzLCB0b3RhbFJldmlld2VkIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBcdTI1MDBcdTI1MDAgQ29udHJvbGFkb3IgZG8gVG9kb2lzdCAoY29tcGFydGlsaGFkbzogZGFzaGJvYXJkICsgYWJhIGRlZGljYWRhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERldFx1MDBFOW0gbyBlc3RhZG8gZGFzIHRhcmVmYXMsIGEgYnVzY2EsIGEgcmVuZGVyaXphXHUwMEU3XHUwMEUzbyBkYSBsaXN0YSBlIGFzIGFcdTAwRTdcdTAwRjVlc1xuLy8gKGNyaWFyL2VkaXRhci9jb25jbHVpci9leGNsdWlyKS4gYHJlcmVuZGVyYCBcdTAwRTkgbyBjYWxsYmFjayBkYSB2aWV3IGRvbmEgKHJlLXJlbmRlclxuLy8gY29tcGxldG8pLiBUZW0gdG9vbHRpcCBwclx1MDBGM3ByaW8gcGFyYSBuXHUwMEUzbyBkZXBlbmRlciBkYSB2aWV3LlxuY2xhc3MgVG9kb2lzdENvbnRyb2xsZXIge1xuICBwcml2YXRlIHRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIGxhYmVsQ29sb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSBsb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgbGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgbm9EYXRlT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge1xuICAgIHRoaXMubG9hZENhY2hlKCk7ICAgLy8gbW9zdHJhIG8gXHUwMEZBbHRpbW8gcmVzdWx0YWRvIG5hIGhvcmEgKG9mZmxpbmUpLCBhbnRlcyBkbyAxXHUwMEJBIGZldGNoXG4gIH1cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUZpbHRlcnModGFza3M6IFRvZG9pc3RUYXNrW10pOiBUb2RvaXN0VGFza1tdIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgaWYgKCFmLnByb2plY3RzLmxlbmd0aCAmJiAhZi5sYWJlbHMubGVuZ3RoKSByZXR1cm4gdGFza3M7XG4gICAgY29uc3QgcHMgPSBuZXcgU2V0KGYucHJvamVjdHMpLCBscyA9IG5ldyBTZXQoZi5sYWJlbHMpO1xuICAgIHJldHVybiB0YXNrcy5maWx0ZXIodCA9PiB7XG4gICAgICBpZiAocHMuc2l6ZSAmJiAhKHQucHJvamVjdF9pZCAmJiBwcy5oYXModC5wcm9qZWN0X2lkKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChscy5zaXplICYmICEodC5sYWJlbHMgPz8gW10pLnNvbWUobCA9PiBscy5oYXMobCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENvbG9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxDb2xvcnMuZ2V0KG5hbWUpID8/IExBQkVMX0ZBTExCQUNLO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENoaXAoaG9zdDogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY2xzOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpcCA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMubGFiZWxDb2xvcihuYW1lKTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bmFtZX1gIH0pO1xuICAgIHJldHVybiBjaGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2O1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICBwcml2YXRlIHNob3dUYXNrVGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC10YXNrLXRpcFwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtcHJpXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaU1ldGEodC5wcmlvcml0eSkuY29sb3I7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXRpdGxlXCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgZCA9IHQuZGVzY3JpcHRpb24hLnRyaW0oKTtcbiAgICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtZGVzY1wiLCB0ZXh0OiBkLmxlbmd0aCA+IERFU0NfTUFYID8gZC5zbGljZSgwLCBERVNDX01BWCkgKyBcIlx1MjAyNlwiIDogZCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRhc2tUaXAoZWw6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rhc2tUaXAoZWwsIHQpKTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNoZWNrLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KTsgfTtcbiAgfVxuXG4gIHByaXZhdGUgdG9kb1JvdyhsaXN0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2ssIHNob3dEYXRlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yb3dcIiB9KTtcbiAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBwcmkuY29sb3IpO1xuICAgIHRoaXMudG9kb0NoZWNrKHJvdywgdCk7XG4gICAgY29uc3QgdGFnID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pO1xuICAgIHRhZy5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LXR4dFwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHNldEljb24ocm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1oYXNkZXNjXCIgfSksIFwiYWxpZ24tbGVmdFwiKTtcbiAgICBjb25zdCBwcm9qID0gdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgJiYgcHJvaikgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctcHJvalwiLCB0ZXh0OiBwcm9qIH0pO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgIGZvciAoY29uc3QgbCBvZiB0LmxhYmVscyA/PyBbXSkgdGhpcy5sYWJlbENoaXAocm93LCBsLCBcIndkLXRvZG8tcm93LWxhYmVsXCIpO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChzaG93RGF0ZSAmJiBkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KTtcbiAgICB0aGlzLmF0dGFjaFRhc2tUaXAocm93LCB0KTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVGFza0J0bihob3N0OiBIVE1MRWxlbWVudCwgcHJlZmlsbER1ZT86IHN0cmluZywgdGl0bGUgPSBcIk5vdmEgdGFyZWZhXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYWRkXCIgfSk7XG4gICAgc2V0SWNvbihiLCBcInBsdXNcIik7XG4gICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgIGIub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiY3JlYXRlXCIsIHByZWZpbGxEdWUgfSk7IH07XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRm9ybShvcHRzOiB7IG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjsgdGFzaz86IFRvZG9pc3RUYXNrOyBwcmVmaWxsRHVlPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4udGhpcy5sYWJlbENvbG9ycy5rZXlzKCksIC4uLnRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKV0pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIG5ldyBUYXNrRm9ybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICBtb2RlOiBvcHRzLm1vZGUsXG4gICAgICB0YXNrOiBvcHRzLnRhc2ssXG4gICAgICBwcmVmaWxsRHVlOiBvcHRzLnByZWZpbGxEdWUsXG4gICAgICBwcm9qZWN0czogdGhpcy5wcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcy5jb21wb25lbnQsIHtcbiAgICAgIHRhc2s6IHQsXG4gICAgICBwcm9qZWN0TmFtZTogdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdWJtaXRUYXNrRm9ybShtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCIsIHRhc2s6IFRvZG9pc3RUYXNrIHwgdW5kZWZpbmVkLCB2OiBUYXNrRm9ybVZhbHVlcyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB2LmNvbnRlbnQsIHByaW9yaXR5OiB2LnByaW9yaXR5IH07XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uLnRyaW0oKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgaWYgKHYucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHYucHJvamVjdElkO1xuICAgICAgICBpZiAodi5sYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ3JpYWRhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH0gZWxzZSBpZiAodGFzaykge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHt9O1xuICAgICAgICBpZiAodi5jb250ZW50ICE9PSB0YXNrLmNvbnRlbnQpIGZpZWxkcy5jb250ZW50ID0gdi5jb250ZW50O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAhPT0gKHRhc2suZGVzY3JpcHRpb24gPz8gXCJcIikpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb247XG4gICAgICAgIGlmICh2LnByaW9yaXR5ICE9PSB0YXNrLnByaW9yaXR5KSBmaWVsZHMucHJpb3JpdHkgPSB2LnByaW9yaXR5O1xuICAgICAgICBjb25zdCBvbGREYXRlID0gdGFzay5kdWU/LmRhdGUgPyB0YXNrLmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBcIlwiO1xuICAgICAgICBpZiAodi5kdWVEYXRlICE9PSBvbGREYXRlKSB7XG4gICAgICAgICAgaWYgKHYuZHVlRGF0ZSkgZmllbGRzLmR1ZV9kYXRlID0gdi5kdWVEYXRlO1xuICAgICAgICAgIGVsc2UgZmllbGRzLmR1ZV9zdHJpbmcgPSBcIm5vIGRhdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMID0gKHRhc2subGFiZWxzID8/IFtdKS5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCIgXCIpO1xuICAgICAgICBpZiAob2xkTCAhPT0gbmV3TCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGRzKS5sZW5ndGgpIGF3YWl0IHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCBmaWVsZHMpO1xuICAgICAgICBjb25zdCBvbGRQcm9qID0gdGFzay5wcm9qZWN0X2lkID8/IFwiXCI7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCAhPT0gb2xkUHJvaiAmJiB2LnByb2plY3RJZCkgYXdhaXQgbW92ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCB2LnByb2plY3RJZCk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBTYWx2YTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1RDgzRFx1REREMSBFeGNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGV4Y2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY29tcGxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybjtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNsb3NlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDAsIHQpO1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNTdGFsZSgpOiBib29sZWFuIHsgcmV0dXJuIERhdGUubm93KCkgLSB0aGlzLmZldGNoZWRBdCA+PSBUT0RPX1RUTDsgfVxuXG4gIC8vIEF1dG8tcmVmcmVzaCBwZXJpXHUwMEYzZGljbyAoaW50ZXJ2YWxvIG5vIG9ubG9hZCk6IHNcdTAwRjMgYnVzY2Egc2UgaFx1MDBFMSB2aWV3IGFiZXJ0YSwgdG9rZW5cbiAgLy8gY29uZmlndXJhZG8sIG5hZGEgZW0gdm9vIGUgbyBjYWNoZSBwYXNzb3UgZG8gVFRMLiBTZW0gdmlldyBhYmVydGEgPSBzZW0gY2hhbWFkYSBcdTAwRTAgQVBJLlxuICBtYXliZVJlZnJlc2goKSB7XG4gICAgaWYgKCF0aGlzLnN1YnMuc2l6ZSB8fCB0aGlzLmxvYWRpbmcpIHJldHVybjtcbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCkpIHJldHVybjtcbiAgICBpZiAodGhpcy5pc1N0YWxlKCkpIHZvaWQgdGhpcy5mZXRjaChmYWxzZSk7XG4gIH1cblxuICAvLyBDYWNoZSBvZmZsaW5lIChwb3ItZGlzcG9zaXRpdm8sIGxvY2FsU3RvcmFnZSBcdTIxOTIgblx1MDBFM28gc2luY3Jvbml6YSk6IGNhcnJlZ2EgbyBcdTAwRkFsdGltb1xuICAvLyByZXN1bHRhZG8gcGFyYSBhIGFiYSBhYnJpciBqXHUwMEUxIGNvbSBhcyB0YXJlZmFzLCBtZXNtbyBzZW0gaW50ZXJuZXQuXG4gIHByaXZhdGUgbG9hZENhY2hlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSB0aGlzLmFwcC5sb2FkTG9jYWxTdG9yYWdlKExTX1RPRE9fQ0FDSEUpO1xuICAgICAgY29uc3QgYyA9IHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHJhdykgOiByYXc7XG4gICAgICBpZiAoIWMgfHwgIUFycmF5LmlzQXJyYXkoYy50YXNrcykpIHJldHVybjtcbiAgICAgIHRoaXMudGFza3MgPSBjLnRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IEFycmF5LmlzQXJyYXkoYy5wcm9qZWN0cykgPyBjLnByb2plY3RzIDogW107XG4gICAgICB0aGlzLnByb2plY3RNYXAgPSBuZXcgTWFwKHRoaXMucHJvamVjdHMubWFwKChwOiBUb2RvaXN0UHJvamVjdCkgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKEFycmF5LmlzQXJyYXkoYy5sYWJlbHMpID8gYy5sYWJlbHMgOiBbXSk7XG4gICAgICB0aGlzLmZldGNoZWRBdCA9IHR5cGVvZiBjLmZldGNoZWRBdCA9PT0gXCJudW1iZXJcIiA/IGMuZmV0Y2hlZEF0IDogMDtcbiAgICB9IGNhdGNoIHsgLyogY2FjaGUgYXVzZW50ZS9jb3Jyb21waWRvIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgcHJpdmF0ZSBwZXJzaXN0Q2FjaGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfVE9ET19DQUNIRSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0YXNrczogdGhpcy50YXNrcywgcHJvamVjdHM6IHRoaXMucHJvamVjdHMsIGxhYmVsczogWy4uLnRoaXMubGFiZWxDb2xvcnNdLCBmZXRjaGVkQXQ6IHRoaXMuZmV0Y2hlZEF0LFxuICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggeyAvKiBzZXJpYWxpemFcdTAwRTdcdTAwRTNvL3F1b3RhIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgLy8gQXZpc28gZGUgZnJlc2NvciBubyB0b3BvIGRhIGxpc3RhOiBkdXJhbnRlIHVtYSBidXNjYSwgb3UgcXVhbmRvIGVzdGFtb3NcbiAgLy8gZXhpYmluZG8gbyBjYWNoZSBwb3JxdWUgYSBcdTAwRkFsdGltYSBidXNjYSBmYWxob3UgKG9mZmxpbmUpLlxuICBwcml2YXRlIHJlbmRlckZyZXNobmVzcyhob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmxvYWRpbmcpIHsgaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mcmVzaFwiLCB0ZXh0OiBcIkF0dWFsaXphbmRvXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICBjb25zdCB3aGVuID0gdGhpcy5mZXRjaGVkQXQgPyByZWxUaW1lKG5ldyBEYXRlKHRoaXMuZmV0Y2hlZEF0KS50b0lTT1N0cmluZygpKSA6IFwiXHUyMDE0XCI7XG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZyZXNoIHdkLXRvZG8tZnJlc2gtc3RhbGVcIiwgdGV4dDogYFNlbSBjb25leFx1MDBFM28gXHUyMDE0IGV4aWJpbmRvIG8gXHUwMEZBbHRpbW8gY2FycmVnYWRvICgke3doZW59KWAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2gobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4gfHwgdGhpcy5sb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFt0YXNrcywgcHJvamVjdHMsIGxhYmVsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RQcm9qZWN0W10pLFxuICAgICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RMYWJlbFtdKSxcbiAgICAgIF0pO1xuICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcChwcm9qZWN0cy5tYXAocCA9PiBbcC5pZCwgcC5uYW1lXSkpO1xuICAgICAgdGhpcy5sYWJlbENvbG9ycyA9IG5ldyBNYXAobGFiZWxzLm1hcChsID0+IFtsLm5hbWUsIFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLXSkpO1xuICAgICAgdGhpcy5mZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBMYW5cdTAwRTdhIHVtIHBhY290ZTogY3JpYSBjYWRhIHRhcmVmYSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamUuIFNlcXVlbmNpYWxcbiAgLy8gKGV2aXRhIHJhamFkYSBuYSBBUEkpLiBBdHVhbGl6YSBhIGxpc3RhIGFvIGZpbmFsLlxuICBhc3luYyBsYXVuY2hQYWNrYWdlKHBrZzogVGFza1BhY2thZ2UpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdCBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMuXCIpOyByZXR1cm47IH1cbiAgICAvLyBSZXNvbHZlIHRcdTAwRUR0dWxvIGxpbXBvICsgZXRpcXVldGFzIChwYWNvdGUgKyBpbmxpbmUgQGV0aXF1ZXRhKSBwb3IgdGFyZWZhLlxuICAgIGNvbnN0IGl0ZW1zID0gcGtnLnRhc2tzLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikubWFwKGxpbmUgPT4gc3BsaXRUYXNrTGFiZWxzKGxpbmUsIHBrZy5sYWJlbHMgPz8gW10pKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgeyBuZXcgTm90aWNlKFwiUGFjb3RlIHNlbSB0YXJlZmFzLlwiKTsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMubGF1bmNoaW5nLmhhcyhwa2cuaWQpKSByZXR1cm47ICAgLy8galx1MDBFMSBlc3RcdTAwRTEgbGFuXHUwMEU3YW5kbyBcdTIxOTIgaWdub3JhIGNsaXF1ZS1kdXBsb1xuXG4gICAgLy8gQ29uZmlybWFcdTAwRTdcdTAwRTNvIGNvbmZvcm1lIGEgY29uZmlndXJhXHUwMEU3XHUwMEUzbyAoc2VtcHJlIC8gc1x1MDBGMyBtdWl0YXMgLyBudW5jYSkuXG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtO1xuICAgIGNvbnN0IG5lZWRDb25maXJtID0gbW9kZSA9PT0gXCJhbHdheXNcIiB8fCAobW9kZSA9PT0gXCJtYW55XCIgJiYgaXRlbXMubGVuZ3RoID4gTEFVTkNIX0NPTkZJUk1fTUlOKTtcbiAgICBpZiAobmVlZENvbmZpcm0pIHtcbiAgICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICAgIHRpdGxlOiBgTGFuXHUwMEU3YXIgXHUyMDFDJHtwa2cubmFtZSB8fCBcInBhY290ZVwifVx1MjAxRD9gLFxuICAgICAgICBib2R5OiBgSXNzbyB2YWkgY3JpYXIgJHtpdGVtcy5sZW5ndGh9IHRhcmVmYShzKSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamU6YCxcbiAgICAgICAgaXRlbXM6IGl0ZW1zLm1hcChpdCA9PiAoe1xuICAgICAgICAgIHRleHQ6IGl0LnRpdGxlLFxuICAgICAgICAgIGxhYmVsczogaXQubGFiZWxzLm1hcChuID0+ICh7IG5hbWU6IG4sIGNvbG9yOiB0aGlzLmxhYmVsQ29sb3IobikgfSkpLFxuICAgICAgICB9KSksXG4gICAgICAgIGN0YTogYExhblx1MDBFN2FyICR7aXRlbXMubGVuZ3RofWAsXG4gICAgICB9KTtcbiAgICAgIGlmICghb2spIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhdW5jaGluZy5hZGQocGtnLmlkKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7ICAgLy8gbW9zdHJhIG8gYm90XHUwMEUzbyBjb21vIFwibGFuXHUwMEU3YW5kb1x1MjAyNlwiXG4gICAgY29uc3QgZHVlID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgbGV0IG9rID0gMDtcbiAgICB0cnkge1xuICAgICAgZm9yIChjb25zdCB7IHRpdGxlLCBsYWJlbHMgfSBvZiBpdGVtcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB0aXRsZSwgZHVlX2RhdGU6IGR1ZSB9O1xuICAgICAgICAgIGlmIChwa2cucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHBrZy5wcm9qZWN0SWQ7XG4gICAgICAgICAgaWYgKGxhYmVscy5sZW5ndGgpIGZpZWxkcy5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICAgICAgYXdhaXQgY3JlYXRlVG9kb2lzdFRhc2sodG9rZW4sIGZpZWxkcyk7XG4gICAgICAgICAgb2srKztcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGVtIFwiJHt0aXRsZX1cIjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sYXVuY2hpbmcuZGVsZXRlKHBrZy5pZCk7XG4gICAgfVxuICAgIG5ldyBOb3RpY2UoYFx1MjcxMyAke29rfS8ke2l0ZW1zLmxlbmd0aH0gdGFyZWZhKHMpIGxhblx1MDBFN2FkYShzKSBcdTIwMTQgJHtwa2cubmFtZSB8fCBcInBhY290ZVwifWApO1xuICAgIGF3YWl0IHRoaXMuZmV0Y2godHJ1ZSk7ICAgLy8gcmUtcmVuZGVyaXphIChsaW1wYSBvIGVzdGFkbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIilcbiAgfVxuXG4gIC8vIEJhcnJhIGRlIGxhblx1MDBFN2Fkb3JlcyBkZSBwYWNvdGVzLiBDb20gYGhlYWRpbmdgLCBtb250YSBhIHNlXHUwMEU3XHUwMEUzbyBcIlBBQ09URVNcIlxuICAvLyBjb21wbGV0YSAoYWJhIGRvIFRvZG9pc3QpOyBzZW0gZWxlLCBzXHUwMEYzIGEgYmFycmEgZGUgYm90XHUwMEY1ZXMgKGRhc2hib2FyZCwgZVxuICAvLyBzb21lIHF1YW5kbyBuXHUwMEUzbyBoXHUwMEUxIHBhY290ZXMgcGFyYSBtYW50ZXIgbyBwYWluZWwgZW54dXRvKS5cbiAgcmVuZGVyUGFja2FnZXMoaG9zdDogSFRNTEVsZW1lbnQsIG9wdHM6IHsgaGVhZGluZz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgcGtncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBsZXQgdGFyZ2V0ID0gaG9zdDtcbiAgICBpZiAob3B0cy5oZWFkaW5nKSB7XG4gICAgICBjb25zdCBzZWMgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiUEFDT1RFU1wiIH0pO1xuICAgICAgaWYgKCFwa2dzLmxlbmd0aCkge1xuICAgICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ3JpZSBwYWNvdGVzIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgXHUyMTkyIFBhY290ZXMgZGUgdGFyZWZhcy5cIiB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGFyZ2V0ID0gc2VjO1xuICAgIH0gZWxzZSBpZiAoIXBrZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGNvbnN0IGJhciA9IHRhcmdldC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJhclwiIH0pO1xuICAgIGZvciAoY29uc3QgcGtnIG9mIHBrZ3MpIHtcbiAgICAgIGNvbnN0IHZhbGlkID0gcGtnLnRhc2tzLmZpbHRlcihzID0+IHMudHJpbSgpKS5sZW5ndGg7XG4gICAgICBjb25zdCBidXN5ID0gdGhpcy5sYXVuY2hpbmcuaGFzKHBrZy5pZCk7XG4gICAgICBjb25zdCBkaXNhYmxlZCA9ICF0b2tlbiB8fCAhdmFsaWQgfHwgYnVzeTtcbiAgICAgIGNvbnN0IGJ0biA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJ0blwiICsgKGRpc2FibGVkID8gXCIgd2QtcGtnLWRpc2FibGVkXCIgOiBcIlwiKSArIChidXN5ID8gXCIgd2QtcGtnLWJ1c3lcIiA6IFwiXCIpIH0pO1xuICAgICAgaWYgKHBrZy5pY29uKSByZW5kZXJJY29uKGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29cIiB9KSwgcGtnLmljb24pO1xuICAgICAgYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW5hbWVcIiwgdGV4dDogcGtnLm5hbWUgfHwgXCIoc2VtIG5vbWUpXCIgfSk7XG4gICAgICBidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogYnVzeSA/IFwiXHUyMDI2XCIgOiBTdHJpbmcodmFsaWQpIH0pO1xuICAgICAgYnRuLnNldEF0dHIoXCJ0aXRsZVwiLFxuICAgICAgICBidXN5ID8gXCJMYW5cdTAwRTdhbmRvXHUyMDI2XCIgOlxuICAgICAgICAhdG9rZW4gPyBcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3RcIiA6XG4gICAgICAgICF2YWxpZCA/IFwiUGFjb3RlIHNlbSB0YXJlZmFzXCIgOlxuICAgICAgICBgTGFuXHUwMEU3YXIgJHt2YWxpZH0gdGFyZWZhKHMpIG5vIFRvZG9pc3QgKGhvamUpYCk7XG4gICAgICBpZiAoIWRpc2FibGVkKSBidG4ub25jbGljayA9ICgpID0+IHZvaWQgdGhpcy5sYXVuY2hQYWNrYWdlKHBrZyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJGaWx0ZXJCYXIoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgY29uc3QgYmFyID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1maWx0ZXJiYXJcIiB9KTtcbiAgICBpZiAodGhpcy5wcm9qZWN0cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGdycCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mZ3JvdXBcIiB9KTtcbiAgICAgIGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmxhYmVsXCIsIHRleHQ6IFwiUHJvamV0b3NcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLnByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5wcm9qZWN0cy5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgY29uc3QgY2hpcCA9IGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNoaXBcIiArIChvbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogcC5uYW1lIH0pO1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IHRoaXMudG9nZ2xlRmlsdGVyKFwicHJvamVjdHNcIiwgcC5pZCk7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH07XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KHRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgaWYgKGxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGdycCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mZ3JvdXBcIiB9KTtcbiAgICAgIGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmxhYmVsXCIsIHRleHQ6IFwiRXRpcXVldGFzXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGFiZWxzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5sYWJlbHMuaW5jbHVkZXMobCk7XG4gICAgICAgIGNvbnN0IGNoaXAgPSB0aGlzLmxhYmVsQ2hpcChncnAsIGwsIFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpKTtcbiAgICAgICAgY2hpcC5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyB0aGlzLnRvZ2dsZUZpbHRlcihcImxhYmVsc1wiLCBsKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGYucHJvamVjdHMubGVuZ3RoIHx8IGYubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xyID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2xlYXJcIiwgdGV4dDogXCJsaW1wYXIgZmlsdHJvc1wiIH0pO1xuICAgICAgY2xyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IGYucHJvamVjdHMgPSBbXTsgZi5sYWJlbHMgPSBbXTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfTtcbiAgICB9XG4gIH1cblxuICAvLyBSZW5kZXJpemEgb3MgY29udHJvbGVzIGRlIGNhYmVcdTAwRTdhbGhvIChlbSBgY3RybHNgKSArIGEgbGlzdGEgZGUgdGFyZWZhc1xuICAvLyAoZW0gYGJvZHlgKS4gTyBob3N0IGZvcm5lY2UgbyByXHUwMEYzdHVsbyBkYSBzZVx1MDBFN1x1MDBFM28gZSBvIGxheW91dCBkbyBjYWJlXHUwMEU3YWxoby5cbiAgcmVuZGVyTGlzdChib2R5OiBIVE1MRWxlbWVudCwgY3RybHM6IEhUTUxFbGVtZW50LCBvcHRzOiB7IHNob3dMYXRlcj86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgICBjb25zdCBzZWcgPSBjdHJscy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yYW5nZVwiIH0pO1xuICAgICAgZm9yIChjb25zdCBuIG9mIFszLCA3XSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBiID0gc2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yYW5nZS1idG5cIiArIChyYW5nZSA9PT0gbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogYCR7bn1kYCB9KTtcbiAgICAgICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgYE1vc3RyYXIgb3MgcHJcdTAwRjN4aW1vcyAke259IGRpYXNgKTtcbiAgICAgICAgYi5vbmNsaWNrID0gYXN5bmMgZSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSBuO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICAgIGNvbnN0IG5GID0gZi5wcm9qZWN0cy5sZW5ndGggKyBmLmxhYmVscy5sZW5ndGg7XG4gICAgICBjb25zdCBmaWx0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJ0blwiICsgKHRoaXMuZmlsdGVyT3BlbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSArIChuRiA/IFwiIHdkLWFjdGl2ZVwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKGZpbHQsIFwiZmlsdGVyXCIpO1xuICAgICAgZmlsdC5zZXRBdHRyKFwidGl0bGVcIiwgbkYgPyBgRmlsdHJvcyBhdGl2b3MgKCR7bkZ9KSBcdTIwMTQgY2xpcXVlIHBhcmEgYWp1c3RhcmAgOiBcIkZpbHRyYXIgcG9yIHByb2pldG8vZXRpcXVldGFcIik7XG4gICAgICBpZiAobkYpIGZpbHQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZpbHRjdFwiLCB0ZXh0OiBTdHJpbmcobkYpIH0pO1xuICAgICAgZmlsdC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZmlsdGVyT3BlbiA9ICF0aGlzLmZpbHRlck9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfTtcbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMubG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciB0YXJlZmFzIGRvIFRvZG9pc3RcIik7XG4gICAgICByZWZyZXNoLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmZldGNoKHRydWUpOyB9O1xuICAgICAgdGhpcy5hZGRUYXNrQnRuKGN0cmxzLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgfVxuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb2xlIHNldSB0b2tlbiBkbyBUb2RvaXN0IGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgcGFyYSB2ZXIgc3VhcyB0YXJlZmFzIGFxdWkuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQXV0by1mZXRjaDogbnVuY2EgYnVzY291LCBvdSBvIGNhY2hlIHBhc3NvdSBkbyBUVEwuIEVycm8gblx1MDBFM28gZGlzcGFyYSByZS10ZW50YXRpdmFcbiAgICAvLyBhdXRvbVx1MDBFMXRpY2EgYXF1aSAoZXZpdGFyaWEgbG9vcCBhIGNhZGEgcmVuZGVyKTsgbyBpbnRlcnZhbG8gZSBvIGJvdFx1MDBFM28gXHUyMUJCIGN1aWRhbSBkaXNzby5cbiAgICBpZiAoIXRoaXMubG9hZGluZyAmJiAhdGhpcy5lcnJvciAmJiAoIXRoaXMuZmV0Y2hlZEF0IHx8IHRoaXMuaXNTdGFsZSgpKSkgdm9pZCB0aGlzLmZldGNoKGZhbHNlKTtcbiAgICBjb25zdCBoYXNDYWNoZSA9IHRoaXMudGFza3MubGVuZ3RoID4gMDtcbiAgICAvLyBFcnJvL2NhcnJlZ2FuZG8gc1x1MDBGMyBvY3VwYW0gYSBcdTAwRTFyZWEgdG9kYSBxdWFuZG8gTlx1MDBDM08gaFx1MDBFMSBjYWNoZSBwYXJhIG1vc3RyYXIgKG9mZmxpbmUtZnJpZW5kbHkpLlxuICAgIGlmICh0aGlzLmVycm9yICYmICFoYXNDYWNoZSkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMuZXJyb3J9YCB9KTsgcmV0dXJuOyB9XG4gICAgaWYgKCF0aGlzLmZldGNoZWRBdCAmJiAhaGFzQ2FjaGUpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvIHRhcmVmYXNcdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG4gICAgdGhpcy5yZW5kZXJGcmVzaG5lc3MoYm9keSk7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJPcGVuKSB0aGlzLnJlbmRlckZpbHRlckJhcihib2R5KTtcblxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgIGNvbnN0IHRvZGF5SyA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGNvbnN0IGxhc3RVcGNvbWluZyA9IG5ldyBEYXRlKCk7XG4gICAgbGFzdFVwY29taW5nLnNldERhdGUobGFzdFVwY29taW5nLmdldERhdGUoKSArIHJhbmdlKTtcbiAgICBjb25zdCBsYXN0SyA9IHRvS2V5KGxhc3RVcGNvbWluZyk7XG5cbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuYXBwbHlGaWx0ZXJzKHRoaXMudGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBub0RhdGU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgeyBub0RhdGUucHVzaCh0KTsgY29udGludWU7IH1cbiAgICAgIGlmIChkayA8IHRvZGF5Sykgb3ZlcmR1ZS5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPT09IHRvZGF5SykgdG9kYXlUYXNrcy5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPD0gbGFzdEspIChieURheVtka10gPz89IFtdKS5wdXNoKHQpO1xuICAgICAgZWxzZSBsYXRlci5wdXNoKHQpO1xuICAgIH1cbiAgICBjb25zdCBieVByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIC8vIFwiRGVwb2lzXCI6IG9yZGVuYSBwb3IgREFUQSAobWFpcyBwclx1MDBGM3hpbWEgcHJpbWVpcm8pIGUsIG5vIG1lc21vIGRpYSwgcG9yIHByaW9yaWRhZGUuXG4gICAgY29uc3QgYnlEYXRlVGhlblByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IHtcbiAgICAgIGNvbnN0IGRhID0gZHVlS2V5KGEpID8/IFwiXCIsIGRiID0gZHVlS2V5KGIpID8/IFwiXCI7XG4gICAgICBpZiAoZGEgIT09IGRiKSByZXR1cm4gZGEgPCBkYiA/IC0xIDogMTtcbiAgICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICB9O1xuICAgIG92ZXJkdWUuc29ydChieVByaSk7IHRvZGF5VGFza3Muc29ydChieVByaSk7IGxhdGVyLnNvcnQoYnlEYXRlVGhlblByaSk7IG5vRGF0ZS5zb3J0KGJ5UHJpKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoYnlEYXkpKSBieURheVtrXS5zb3J0KGJ5UHJpKTtcblxuICAgIC8vIFwiRGVwb2lzXCIgZSBcIlNlbSBkYXRhXCIgc1x1MDBGMyBhcGFyZWNlbSBuYSBhYmEgZGVkaWNhZGEgKHNob3dMYXRlciAhPT0gZmFsc2UpLlxuICAgIGNvbnN0IHNob3dFeHRyYSA9IG9wdHMuc2hvd0xhdGVyICE9PSBmYWxzZTtcbiAgICBjb25zdCB2aXNpYmxlID0gb3ZlcmR1ZS5sZW5ndGggKyB0b2RheVRhc2tzLmxlbmd0aCArIGxhdGVyLmxlbmd0aFxuICAgICAgKyBPYmplY3QudmFsdWVzKGJ5RGF5KS5yZWR1Y2UoKHMsIGEpID0+IHMgKyBhLmxlbmd0aCwgMClcbiAgICAgICsgKHNob3dFeHRyYSA/IG5vRGF0ZS5sZW5ndGggOiAwKTtcbiAgICBpZiAodmlzaWJsZSA9PT0gMCkge1xuICAgICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgICAgY29uc3QgZmlsdGVyZWQgPSAhIShmLnByb2plY3RzLmxlbmd0aCB8fCBmLmxhYmVscy5sZW5ndGgpO1xuICAgICAgY29uc3QgbXNnID0gZmlsdGVyZWQgPyBcIk5lbmh1bWEgdGFyZWZhIGJhdGUgY29tIG9zIGZpbHRyb3MuXCJcbiAgICAgICAgOiBzaG93RXh0cmEgPyBcIk5lbmh1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFx1RDgzQ1x1REY4OVwiXG4gICAgICAgIDogXCJOZW5odW1hIHRhcmVmYSBhZ2VuZGFkYS4gXHVEODNDXHVERjg5XCI7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBtc2cgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29scyA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tY29sc1wiIH0pO1xuXG4gICAgY29uc3Qgb2JveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC1vdmVyZHVlXCIgfSk7XG4gICAgY29uc3Qgb2hkID0gb2JveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94d2FyblwiLCB0ZXh0OiBcIlx1MjZBMFwiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogXCJBdHJhc2FkYXNcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyhvdmVyZHVlLmxlbmd0aCkgfSk7XG4gICAgY29uc3Qgb2JvZHkgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAob3ZlcmR1ZS5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiBvdmVyZHVlKSB0aGlzLnRvZG9Sb3cob2JvZHksIHQpO1xuICAgIGVsc2Ugb2JvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hLiBcdUQ4M0RcdURDNERcIiB9KTtcblxuICAgIGNvbnN0IHRib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdG9kYXlcIiB9KTtcbiAgICBjb25zdCB0aGQgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkhvamVcIiB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odGhkLCBcImhvamVcIiwgXCJOb3ZhIHRhcmVmYSBwYXJhIGhvamVcIik7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodG9kYXlUYXNrcy5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IHRib2R5ID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHRvZGF5VGFza3MubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2YgdG9kYXlUYXNrcykgdGhpcy50b2RvUm93KHRib2R5LCB0KTtcbiAgICBlbHNlIHRib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmFkYSBwYXJhIGhvamUuXCIgfSk7XG5cbiAgICBsZXQgdXBjb21pbmdDb3VudCA9IDA7XG4gICAgY29uc3QgdXBEYXlzOiB7IGRvdzogbnVtYmVyOyBudW06IG51bWJlcjsga2V5OiBzdHJpbmc7IGl0ZW1zOiBUb2RvaXN0VGFza1tdIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHJhbmdlOyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XG4gICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldO1xuICAgICAgaWYgKCFpdGVtcz8ubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgIHVwY29taW5nQ291bnQgKz0gaXRlbXMubGVuZ3RoO1xuICAgICAgdXBEYXlzLnB1c2goeyBkb3c6IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDcsIG51bTogZGF5LmdldERhdGUoKSwga2V5LCBpdGVtcyB9KTtcbiAgICB9XG4gICAgY29uc3QgdWJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC11cGNvbWluZ1wiIH0pO1xuICAgIGNvbnN0IHVoZCA9IHVib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB1aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IGBQclx1MDBGM3hpbW9zICR7cmFuZ2V9IGRpYXNgIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih1aGQsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB1aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh1cGNvbWluZ0NvdW50KSB9KTtcbiAgICBjb25zdCB1Ym9keSA9IHVib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmICh1cERheXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGNvbnN0IGcgb2YgdXBEYXlzKSB7XG4gICAgICAgIGNvbnN0IGRoID0gdWJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZGF5aGRcIiArIChnLmRvdyA+PSA1ID8gXCIgd2Qtd2Vla2VuZFwiIDogXCJcIikgfSk7XG4gICAgICAgIGRoLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXluYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtnLmRvd10gfSk7XG4gICAgICAgIGRoLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXludW1cIiwgdGV4dDogU3RyaW5nKGcubnVtKSB9KTtcbiAgICAgICAgdGhpcy5hZGRUYXNrQnRuKGRoLCBnLmtleSwgYE5vdmEgdGFyZWZhIGVtICR7Zy5udW19YCk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBnLml0ZW1zKSB0aGlzLnRvZG9Sb3codWJvZHksIHQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdWJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogYE5hZGEgbm9zIHByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhcy5gIH0pO1xuICAgIH1cblxuICAgIGlmIChsYXRlci5sZW5ndGggJiYgc2hvd0V4dHJhKSB7XG4gICAgICBjb25zdCBwYW5lbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJcIiB9KTtcbiAgICAgIGNvbnN0IGxoZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1sYXRlcmljb1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYERlcG9pcyAoJHtsYXRlci5sZW5ndGh9KWAgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90b2dnbGVcIiwgdGV4dDogdGhpcy5sYXRlck9wZW4gPyBcIm9jdWx0YXIgXHUyNUJFXCIgOiBcIm1vc3RyYXIgXHUyMDNBXCIgfSk7XG4gICAgICBsaGQub25jbGljayA9ICgpID0+IHsgdGhpcy5sYXRlck9wZW4gPSAhdGhpcy5sYXRlck9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfTtcbiAgICAgIGlmICh0aGlzLmxhdGVyT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGxhdGVyKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vRGF0ZS5sZW5ndGggJiYgc2hvd0V4dHJhKSB7XG4gICAgICBjb25zdCBwYW5lbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tbGF0ZXIgd2QtdG9kby1ub2RhdGVcIiB9KTtcbiAgICAgIGNvbnN0IG5oZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgbmhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1sYXRlcmljb1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgbmhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYFNlbSBkYXRhICgke25vRGF0ZS5sZW5ndGh9KWAgfSk7XG4gICAgICBuaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90b2dnbGVcIiwgdGV4dDogdGhpcy5ub0RhdGVPcGVuID8gXCJvY3VsdGFyIFx1MjVCRVwiIDogXCJtb3N0cmFyIFx1MjAzQVwiIH0pO1xuICAgICAgbmhkLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubm9EYXRlT3BlbiA9ICF0aGlzLm5vRGF0ZU9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfTtcbiAgICAgIGlmICh0aGlzLm5vRGF0ZU9wZW4pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9saXN0XCIgfSk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBub0RhdGUpIHRoaXMudG9kb1JvdyhsaXN0LCB0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRGFzaGJvYXJkVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSB3ZWVrT2Zmc2V0ID0gMDtcbiAgcHJpdmF0ZSBuYXZQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2VhcmNoVGVybSA9IFwiXCI7XG4gIHByaXZhdGUgcmV2aWV3RmlsdGVyID0gZmFsc2U7XG4gIHByaXZhdGUgZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlO1xuICBwcml2YXRlIHNlY0hvc3RzID0gbmV3IE1hcDxTZWN0aW9uSWQsIEhUTUxFbGVtZW50PigpOyAgIC8vIHdyYXBwZXIgZXN0XHUwMEUxdmVsIHBvciBzZVx1MDBFN1x1MDBFM29cbiAgcHJpdmF0ZSB1bnN1YlRvZG86ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsOyAgICAgICAgICAvLyBjYW5jZWxhciBpbnNjcmlcdTAwRTdcdTAwRTNvIG5vIGNvbnRyb2xsZXJcblxuICAvLyBFc3RhZG8gZG8gU3luY3RoaW5nICh2MC4xMC4wKVxuICBwcml2YXRlIHN5bmNEYXRhOiBTeW5jRGF0YSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNMb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgc3luY0Vycm9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzeW5jRmV0Y2hlZEF0ID0gMDtcbiAgcHJpdmF0ZSBjb25mbGljdENvbmZpcm06IHN0cmluZyB8IG51bGwgPSBudWxsOyAgIC8vIHBhdGggZG8gY29uZmxpdG8gYWd1YXJkYW5kbyBjb25maXJtYVx1MDBFN1x1MDBFM29cblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJEYXNoYm9hcmRcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGF5b3V0LWRhc2hib2FyZFwiOyB9XG5cbiAgYXN5bmMgb25PcGVuKCkge1xuICAgIGF3YWl0IHRoaXMucmVuZGVyKCk7XG4gICAgLy8gSW5zY3JldmUgbm8gY29udHJvbGxlciBcdTAwRkFuaWNvOiBtdWRhblx1MDBFN2EgZGUgZXN0YWRvIHJlLXJlbmRlcml6YSBzXHUwMEYzIGEgc2VcdTAwRTdcdTAwRTNvIFRhcmVmYXMuXG4gICAgdGhpcy51bnN1YlRvZG8gPSB0aGlzLnBsdWdpbi50b2RvLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbmRlclNlY3Rpb24oXCJ0b2RvaXN0XCIpKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB7IHRoaXMucGx1Z2luLmludmFsaWRhdGVWYXVsdENhY2hlKCk7IHRoaXMuc2NoZWR1bGUoKTsgfSkpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG5cbiAgLy8gUmUtcmVuZGVyIHBcdTAwRkFibGljbyBcdTIwMTQgY2hhbWFkbyBwZWxvIHBsdWdpbiBxdWFuZG8gYSBjb25maWd1cmFcdTAwRTdcdTAwRTNvIG11ZGEgbmEgYWJhXG4gIC8vIGRlIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIChvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcywgb2N1bHRhci9tb3N0cmFyLCBmb250ZXMgZGEgU2VtYW5hKS5cbiAgcmVmcmVzaCgpIHsgdm9pZCB0aGlzLnJlbmRlcigpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICAvLyBDYWRhIHNlXHUwMEU3XHUwMEUzbyBtb3JhIG51bSBob3N0IGVzdFx1MDBFMXZlbCBcdTIxOTIgZFx1MDBFMSBwYXJhIHJlLXJlbmRlcml6YXIgdW1hIHNlXHUwMEU3XHUwMEUzbyBzXHUwMEYzXG4gICAgLy8gKGV4LjogcmVmcmVzaCBkbyBUb2RvaXN0L1N5bmN0aGluZykgc2VtIHJlY29uc3RydWlyIGEgdmlldyBpbnRlaXJhLlxuICAgIHRoaXMuc2VjSG9zdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgY29uc3QgaG9zdCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1ob3N0XCIgfSk7XG4gICAgICB0aGlzLnNlY0hvc3RzLnNldChpZCwgaG9zdCk7XG4gICAgICB0aGlzLnJlbmRlclNlY3Rpb24oaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlLXJlbmRlcml6YSBhcGVuYXMgYSBzZVx1MDBFN1x1MDBFM28gYGlkYCBkZW50cm8gZG8gc2V1IGhvc3QgKHNlbSB0b2NhciBuYXMgb3V0cmFzKS5cbiAgcHJpdmF0ZSByZW5kZXJTZWN0aW9uKGlkOiBTZWN0aW9uSWQpIHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5zZWNIb3N0cy5nZXQoaWQpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuZW1wdHkoKTtcbiAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiaGVhdG1hcFwiKSB0aGlzLnJlbmRlckhlYXRtYXAoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJzdGF0c1wiKSAgIHRoaXMucmVuZGVyU3RhdHMoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3QoaG9zdCk7XG4gICAgZWxzZSBpZiAoaWQgPT09IFwic3luY1wiKSAgICB0aGlzLnJlbmRlclN5bmMoaG9zdCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgT2N1bHRhciAobGVpdHVyYSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3RyYXIvb2N1bHRhciBlIGEgb3JkZW0gZGFzIHNlXHUwMEU3XHUwMEY1ZXMgc1x1MDBFM28gYWRtaW5pc3RyYWRvcyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZG8gcGx1Z2luLiBBIHZpZXcgc1x1MDBGMyAqbFx1MDBFQSogYHNldHRpbmdzLmhpZGRlbmAgcGFyYSBwdWxhciBvIHF1ZVxuICAvLyBlc3RcdTAwRTEgb2N1bHRvLiBWZXIgV2VydXNTZXR0aW5nVGFiLlxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gUG9zaWNpb25hIHVtIHRvb2x0aXAgZml4byBhYmFpeG8gZG8gYWx2byAodmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvKS5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2OyAgLy8gdmlyYSBwYXJhIGNpbWEgc2UgZmFsdGFyIGVzcGFcdTAwRTdvXG4gICAgdGlwLnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1heCg4LCBsZWZ0KX1weGA7XG4gICAgdGlwLnN0eWxlLnRvcCAgPSBgJHtNYXRoLm1heCg4LCB0b3ApfXB4YDtcbiAgfVxuXG4gIC8vIFRvb2x0aXAgbGlzdGFuZG8gYXMgbm90YXMgdXJnZW50ZXMgZGUgdW1hIHBhc3RhIChob3ZlciBubyBiYWRnZSBkZSBhdmlzbykuXG4gIHByaXZhdGUgc2hvd1VyZ2VuY3lUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXAgd2QtdXJnZW5jeS10aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIlVyZ2VudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGRvdCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXV0aXAtZG90XCIgfSk7XG4gICAgICBkb3Quc3R5bGUuYmFja2dyb3VuZCA9IFVSR0VOQ1lfQ09MT1JbaXQubGV2ZWxdO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogaXQuZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGl0LmxldmVsIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIEJhZGdlIGRlIGF2aXNvICh0cmlcdTAwRTJuZ3Vsbykgbm8gY2FyZCBkZSBwYXN0YSBxdWUgY29udFx1MDBFOW0gbm90YXMgY29tIGB1cmdlbmN5YC5cbiAgLy8gQ29yIHBlbG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbzsgaG92ZXIgbGlzdGEgb3MgYXJxdWl2b3MuIEZhc2UgMTAuXG4gIHByaXZhdGUgdXJnZW5jeUJhZGdlKGNhcmQ6IEhUTUxFbGVtZW50LCB1cmc6IFVyZ2VuY3lJbmZvKSB7XG4gICAgaWYgKCF1cmcubWF4KSByZXR1cm47XG4gICAgY29uc3QgYiA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktYmFkZ2Ugd2QtdS0ke3VyZy5tYXh9YCB9KTtcbiAgICBzZXRJY29uKGIsIFwidHJpYW5nbGUtYWxlcnRcIik7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dVcmdlbmN5VGlwKGIsIHVyZy5pdGVtcykpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgcmVjZW50czogVEZpbGVbXSkge1xuICAgIGlmICghcmVjZW50cy5sZW5ndGgpIHJldHVybjtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1RpcChjYXJkLCByZWNlbnRzKSk7XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICAvLyBTdWJwYXN0YXMgZXhpYlx1MDBFRHZlaXMgKGlnbm9yYSBwYXN0YXMgc1x1MDBGMy1kZS1pbWFnZW5zKSwgdmlhIGNhY2hlIGRvIGNvZnJlLlxuICBwcml2YXRlIHN1YkZvbGRlcnNPZihmb2xkZXI6IFRGb2xkZXIpOiBURm9sZGVyW10ge1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4geyBjb25zdCBhID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGYucGF0aCk7IHJldHVybiAhKGEgJiYgYS5pbWcgPiAwICYmIGEubWQgPT09IDApOyB9KVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FsZW5kXHUwMEUxcmlvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyQ2FsZW5kYXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfQ0FMKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbW9uZGF5ICA9IG1vbmRheU9mKHRoaXMud2Vla09mZnNldCk7XG4gICAgY29uc3Qgd2Vla051bSA9IGlzb1dlZWtOdW1iZXIobW9uZGF5KTtcbiAgICBjb25zdCB0b2RheUsgID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBGb250ZXMgYXRpdmFzIChwYXN0YXMgbWFyY2FkYXMpLiBBIGNvciBkZSBjYWRhIG5vdGEgdmVtIGRhIGZvbnRlIGRlXG4gICAgLy8gcHJlZml4byBtYWlzIGVzcGVjXHUwMEVEZmljbyBxdWUgYSBjb250XHUwMEU5bS5cbiAgICBjb25zdCBzb3VyY2VzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLmZpbHRlcihzID0+IHMub24pO1xuICAgIGNvbnN0IGNvbG9yRm9yID0gKHBhdGg6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgbGV0IGJlc3Q6IENhbFNvdXJjZSB8IG51bGwgPSBudWxsO1xuICAgICAgZm9yIChjb25zdCBzIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgaWYgKHBhdGggPT09IGAke3MucGF0aH0ubWRgIHx8IHBhdGguc3RhcnRzV2l0aChgJHtzLnBhdGh9L2ApKSB7XG4gICAgICAgICAgaWYgKCFiZXN0IHx8IHMucGF0aC5sZW5ndGggPiBiZXN0LnBhdGgubGVuZ3RoKSBiZXN0ID0gcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlc3QgPyBiZXN0LmNvbG9yIDogbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQXMgbm90YXMgY29tIGRhdGEgalx1MDBFMSB2XHUwMEVBbSBkbyBjYWNoZSAodW1hIHBhc3NhZGEpOyBhcXVpIHNcdTAwRjMgZmlsdHJhIHBvciBmb250ZS5cbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IGZpbGU6IFRGaWxlOyBjb2xvcjogc3RyaW5nIH1bXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHsgZmlsZSwgZGF0ZSB9IG9mIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5kYXRlZE5vdGVzKSB7XG4gICAgICBjb25zdCBjb2xvciA9IGNvbG9yRm9yKGZpbGUucGF0aCk7XG4gICAgICBpZiAoIWNvbG9yKSBjb250aW51ZTsgICAvLyBzXHUwMEYzIG5vdGFzIGRlbnRybyBkZSB1bWEgZm9udGUgbWFyY2FkYVxuICAgICAgKGJ5RGF5W2RhdGVdID8/PSBbXSkucHVzaCh7IG5hbWU6IGZpbGUuYmFzZW5hbWUsIGZpbGUsIGNvbG9yIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtY2FsLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBuYXYgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYXYtYmFyXCIgfSk7XG4gICAgY29uc3QgcGhvbmUgPSBQbGF0Zm9ybS5pc1Bob25lO1xuXG4gICAgLy8gQ2VsdWxhcjogamFuZWxhIGRlIDMgZGlhcyA9IG9udGVtIFx1MDBCNyBob2plIFx1MDBCNyBhbWFuaFx1MDBFMyAod2Vla09mZnNldCBwYWdpbmEgZGUgMyBlbSAzKS5cbiAgICBjb25zdCBkYXlBbmNob3IgPSBuZXcgRGF0ZSgpO1xuICAgIGRheUFuY2hvci5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgLSAxICsgdGhpcy53ZWVrT2Zmc2V0ICogMyk7XG4gICAgY29uc3QgZm10RE0gPSAoZDogRGF0ZSkgPT4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCBcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsYXN0ID0gbmV3IERhdGUoZGF5QW5jaG9yKTsgbGFzdC5zZXREYXRlKGRheUFuY2hvci5nZXREYXRlKCkgKyAyKTtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGAke2ZtdERNKGRheUFuY2hvcil9IFx1MjAxMyAke2ZtdERNKGxhc3QpfWAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGBSZWxhdFx1MDBGM3Jpb3MgXHUwMEI3IHNlbWFuYSAke3dlZWtOdW19YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHJscyA9IG5hdi5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgcHJldiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDM5XCIgfSk7XG4gICAgY29uc3QgbmV4dCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgcHJldi5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQtLTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBuZXh0Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldCsrOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENlbHVsYXI6IGxpc3RhIHZlcnRpY2FsIGRlIDMgZGlhcyAob250ZW0vaG9qZS9hbWFuaFx1MDBFMykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ2FkYSBkaWEgPSBhIG5vdGEgZGlcdTAwRTFyaWEgKHVtYSBwb3IgZGlhKS4gTGluaGEgaW50ZWlyYSBjbGljXHUwMEUxdmVsOiBhYnJlIGFcbiAgICAvLyBleGlzdGVudGU7IHNlIG5cdTAwRTNvIGhvdXZlciwgY3JpYS5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1saXN0XCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShkYXlBbmNob3IpO1xuICAgICAgICBkYXkuc2V0RGF0ZShkYXlBbmNob3IuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICAgIGNvbnN0IGRvdyA9IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDc7XG4gICAgICAgIGNvbnN0IG5vdGUgPSB0aGlzLmZpbmREYWlseU5vdGUoa2V5KTtcbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogW1wid2QtY2FsLWRyb3dcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBkb3cgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgcm93LnNldEF0dHIoXCJ0aXRsZVwiLCBub3RlID8gXCJBYnJpciBub3RhIGRpXHUwMEUxcmlhXCIgOiBcIkNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICAgIGNvbnN0IGhkID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1oZFwiIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtkb3ddIH0pO1xuICAgICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1udW1cIiwgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgICBjb25zdCBib2R5ID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZHJvdy1ub3Rlc1wiIH0pO1xuICAgICAgICBpZiAobm90ZSkge1xuICAgICAgICAgIGNvbnN0IHBpbGwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICAgIHBpbGwudGV4dENvbnRlbnQgPSBub3RlLmJhc2VuYW1lLmxlbmd0aCA+IDI0ID8gbm90ZS5iYXNlbmFtZS5zbGljZSgwLCAyNCkgKyBcIlx1MjAyNlwiIDogbm90ZS5iYXNlbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBib2R5LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWRyb3ctZW1wdHlcIiwgdGV4dDogXCJjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcm93Lm9uY2xpY2sgPSAoKSA9PiB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBEZXNrdG9wL3RhYmxldDogZ3JhZGUgZGUgNyBkaWFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBoZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7IH07XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0td2Qtc3JjXCIsIGl0LmNvbG9yKTtcbiAgICAgICAgcGlsbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1waWxsLWRvdFwiIH0pO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtdHh0XCIsIHRleHQ6IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lIH0pO1xuICAgICAgICBwaWxsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoaXQuZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFjaGEgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgIChZWVlZLU1NLUREKTogcHJpbWVpcm8gcGVsbyBjYW1pbmhvIGNhblx1MDBGNG5pY28gZW1cbiAgLy8gNTAuRGlcdTAwRTFyaW8vLCBzZW5cdTAwRTNvIHF1YWxxdWVyIG5vdGEgY3VqbyBgZGF0ZTpgIHNlamEgZXNzZSBkaWEuIE51bGwgc2Ugblx1MDBFM28gaG91dmVyLlxuICAvLyAoUmVsYXRcdTAwRjNyaW8vbm90YSBkaVx1MDBFMXJpYSBcdTAwRTkgdW0gcG9yIGRpYSBcdTIxOTIgYWJyZSBvIGV4aXN0ZW50ZSBlbSB2ZXogZGUgY3JpYXIgb3V0cm8uKVxuICBwcml2YXRlIGZpbmREYWlseU5vdGUoa2V5OiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICAgIGNvbnN0IGRpcmVjdCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGApO1xuICAgIGlmIChkaXJlY3QgaW5zdGFuY2VvZiBURmlsZSkgcmV0dXJuIGRpcmVjdDtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmRhdGVkTm90ZXMuZmluZChuID0+IG4uZGF0ZSA9PT0ga2V5KT8uZmlsZSA/PyBudWxsO1xuICB9XG5cbiAgLy8gQWJyZSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWA7IGNyaWEgZW0gNTAuRGlcdTAwRTFyaW8vIFNcdTAwRDMgc2Ugblx1MDBFM28gZXhpc3RpciBuZW5odW1hLlxuICBwcml2YXRlIGFzeW5jIG9wZW5EYWlseU5vdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuZmluZERhaWx5Tm90ZShrZXkpO1xuICAgIGlmIChleGlzdGluZykgeyBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZXhpc3RpbmcpOyByZXR1cm47IH1cblxuICAgIC8vIE5cdTAwRTNvIGV4aXN0ZSBcdTIxOTIgY3JpYSBubyBjYW1pbmhvIGNhblx1MDBGNG5pY28uXG4gICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfRk9MREVSKSlcbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihEQUlMWV9GT0xERVIpLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIGNvbnN0IFt5LCBtLCBkXSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgY29uc3QgdGl0dWxvID0gbmV3IERhdGUoK3ksICttIC0gMSwgK2QpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICAgIH0pO1xuXG4gICAgLy8gVXNhIG8gdGVtcGxhdGUgZW0gTW9kZWxvcy8gc2UgZXhpc3Rpcjsgc2VuXHUwMEUzbywgZmFsbGJhY2sgZW1idXRpZG8uXG4gICAgY29uc3QgdHBsID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX1RFTVBMQVRFKTtcbiAgICBsZXQgYm9keTogc3RyaW5nO1xuICAgIGlmICh0cGwgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgYm9keSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKHRwbCkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZGF0ZVxccypcXH1cXH0vZywga2V5KVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKnRpdGxlXFxzKlxcfVxcfS9nLCB0aXR1bG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5ID1cbmAtLS1cbm93bmVyOiBXZXJ1c1xuY3JlYXRlZDogJHtrZXl9XG5kYXRlOiAke2tleX1cbnJldmlld2VkOiB0cnVlXG50eXBlOiBkYWlseVxucGVybWlzc2lvbnM6XG4gIHJlYWQ6IFthbGxdXG4gIHdyaXRlOlxuICAgIC0gV2VydXNcbi0tLVxuXG4jICR7dGl0dWxvfVxuXG5gO1xuICAgIH1cbiAgICBjb25zdCBmaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCwgYm9keSk7XG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRzIGRvIGNvZnJlICh0b2RhcyBhcyBwYXN0YXMgZGUgdG9wbykgKyBuYXZlZ2Fkb3IgYW5pbmhhZG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJQYXJhKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1BBUkEpKSByZXR1cm47XG4gICAgLy8gU2UgYSBwYXN0YSBhYmVydGEgbm8gbmF2ZWdhZG9yIGZvaSBvY3VsdGFkYSBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMsIGZlY2hhLlxuICAgIGlmICh0aGlzLm5hdlBhdGggJiYgdGhpcy5pc0hpZGRlbih0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkpKSB0aGlzLm5hdlBhdGggPSBudWxsO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ09GUkVcIiB9KTtcblxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhcmEtZ3JpZFwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpICAgLy8gaWdub3JhIC5vYnNpZGlhbiwgLnRyYXNoLCBldGMuXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgICBjb25zdCBhY3RpdmVSb290ID0gdGhpcy5uYXZQYXRoID8gdGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpIDogbnVsbDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcblxuICAgIGxldCBpZHggPSAwO1xuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGFnZyAgICAgPSBjYWNoZS5ieUZvbGRlci5nZXQoZm9sZGVyLnBhdGgpID8/IEVNUFRZX0FHRztcbiAgICAgIGNvbnN0IG1ldGEgICAgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSB0aGlzLnN1YkZvbGRlcnNPZihmb2xkZXIpLmxlbmd0aCA+IDAgfHwgZmlsZXNJbihmb2xkZXIpLmxlbmd0aCA+IDA7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVJvb3QgPT09IGZvbGRlci5wYXRoO1xuXG4gICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZCB3ZC1wYXJhLWNhcmQgd2QtYW5pbS1pblwiICsgKGlzQWN0aXZlID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICBjYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7aWR4ICogNDB9bXNgO1xuICAgICAgaWR4Kys7XG5cbiAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0XCIgfSk7XG4gICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgfVxuICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtYWNjZW50LWJhclwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBtZXRhLmFjY2VudDtcblxuICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgeyBpdGVtczogYWdnLnVyZ2VuY3ksIG1heDogYWdnLnVyZ2VuY3lNYXggfSk7XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoeyBtZDogYWdnLm1kLCBpbWc6IGFnZy5pbWcgfSkgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCAgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWZvbGRlclwiLCB0ZXh0OiBmb2xkZXIucGF0aCB9KTtcbiAgICAgIGlmIChuYXZpZ2FibGUpIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhhcy1zdWJzXCIsIHRleHQ6IGlzQWN0aXZlID8gXCJmZWNoYXIgXHUyNUJFXCIgOiBcImFicmlyIFx1MjAzQVwiIH0pO1xuXG4gICAgICBpZiAoYWdnLm1kID4gMCkge1xuICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhc2ApO1xuICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKGFnZy5yZXZpZXdlZCAvIGFnZy5tZCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGFnZy5yZWNlbnQpO1xuXG4gICAgICBjYXJkLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChuYXZpZ2FibGUpIHsgdGhpcy5uYXZQYXRoID0gaXNBY3RpdmUgPyBudWxsIDogZm9sZGVyLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH1cbiAgICAgICAgZWxzZSByZXZlYWxJbkV4cGxvcmVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIWlkeCkgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgdmlzXHUwMEVEdmVsLlwiIH0pO1xuXG4gICAgLy8gQXJxdWl2b3Mgc29sdG9zIG5hIHJhaXogZG8gY29mcmVcbiAgICBjb25zdCByb290RmlsZXMgPSBmaWxlc0luKHZhdWx0Um9vdCk7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhzZWMsIHJvb3RGaWxlcywgXCJhcnF1aXZvcyBuYSByYWl6XCIpO1xuXG4gICAgaWYgKHRoaXMubmF2UGF0aCkge1xuICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMubmF2UGF0aCk7XG4gICAgICBpZiAoZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikgdGhpcy5yZW5kZXJCcm93c2VyKHNlYywgZm9sZGVyKTtcbiAgICB9XG4gIH1cblxuICAvLyBQYWluZWwgaW5saW5lIG5hdmVnXHUwMEUxdmVsIChicmVhZGNydW1iICsgc3VicGFzdGFzICsgbm90YXMgZGEgcGFzdGEgYXR1YWwpXG4gIHByaXZhdGUgcmVuZGVyQnJvd3NlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHRoaXMudG9wRm9sZGVyT2YoZm9sZGVyLnBhdGgpO1xuICAgIGNvbnN0IHJvb3RGb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocm9vdFBhdGgpO1xuICAgIGlmICghKHJvb3RGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCByb290Rm9sZGVyKTtcblxuICAgIGNvbnN0IHBhbmVsID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYW5lbFwiIH0pO1xuICAgIHBhbmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgLy8gQnJlYWRjcnVtYlxuICAgIGNvbnN0IGNydW1iID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNydW1iXCIgfSk7XG4gICAgY29uc3QgcmVsID0gZm9sZGVyLnBhdGggPT09IHJvb3RQYXRoID8gW10gOiBmb2xkZXIucGF0aC5zbGljZShyb290UGF0aC5sZW5ndGggKyAxKS5zcGxpdChcIi9cIik7XG5cbiAgICBjb25zdCByb290U2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChyZWwubGVuZ3RoID09PSAwID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSB9KTtcbiAgICByZW5kZXJJY29uKHJvb3RTZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgcm9vdFNlZy5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICBpZiAocmVsLmxlbmd0aCkgcm9vdFNlZy5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgc2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNlZ1BhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xvc2Uub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIENhbXBvIGRlIGJ1c2NhXG4gICAgY29uc3Qgc2VhcmNoV3JhcCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWFyY2gtd3JhcFwiIH0pO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoV3JhcC5jcmVhdGVFbChcImlucHV0XCIsIHtcbiAgICAgIGNsczogXCJ3ZC1zZWFyY2hcIixcbiAgICAgIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcImZpbHRyYXJcdTIwMjZcIiwgdmFsdWU6IHRoaXMuc2VhcmNoVGVybSB9LFxuICAgIH0pO1xuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLXN1Yi1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYmwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLndkLWxhYmVsXCIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbGJsLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1ub3RlLXJvdywgLndkLW5vdGUtY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbC5xdWVyeVNlbGVjdG9yKFwiLndkLW5vdGUtbmFtZSwgLndkLW5vdGUtY2FyZC1uYW1lXCIpPy50ZXh0Q29udGVudCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbmFtZS5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU3VicGFzdGFzIGNvbW8gY2FyZHNcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKTtcbiAgICBjb25zdCBzdWJzID0gdGhpcy5zdWJGb2xkZXJzT2YoZm9sZGVyKTtcbiAgICBpZiAoc3Vicy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNncmlkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2otZ3JpZFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBzZiBvZiBzdWJzKSB7XG4gICAgICAgIGNvbnN0IGFnZyAgICA9IGNhY2hlLmJ5Rm9sZGVyLmdldChzZi5wYXRoKSA/PyBFTVBUWV9BR0c7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHJlYWRGb2xkZXJTdGF0dXModGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgY292ZXIgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBkZWVwZXIgPSB0aGlzLnN1YkZvbGRlcnNPZihzZikubGVuZ3RoID4gMDtcbiAgICAgICAgY29uc3QgY3VzdG9tSWNvbiA9IHJlYWRGb2xkZXJJY29uKHRoaXMuYXBwLCBzZik7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IHNncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLWNhcmQgd2Qtc3ViLWNhcmQgd2Qtcy0ke3N0YXR1c31gIH0pO1xuICAgICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gc3V0aWwgKHZlcnNcdTAwRTNvIG1lbm9yIHF1ZSBhcyBwYXN0YXMgZGUgdG9wbykgXHUyMDE0IEZhc2UgOS4xXG4gICAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0IHdkLWNvdmVyLXN1YlwiIH0pO1xuICAgICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBjdXN0b21JY29uID8/IFwiXHVEODNEXHVEQ0MxXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1iYWRnZSB3ZC1iYWRnZS0ke3N0YXR1c31gLCB0ZXh0OiBTVEFUVVNfSUNPTltzdGF0dXNdIH0pO1xuICAgICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB7IGl0ZW1zOiBhZ2cudXJnZW5jeSwgbWF4OiBhZ2cudXJnZW5jeU1heCB9KTtcblxuICAgICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgICBpZiAoY3VzdG9tSWNvbikgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uIHdkLXN1Yi1pY29uXCIgfSksIGN1c3RvbUljb24pO1xuICAgICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoeyBtZDogYWdnLm1kLCBpbWc6IGFnZy5pbWcgfSkgfSk7XG4gICAgICAgIGlmIChkZWVwZXIpIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN1Yi1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgdGV4dDogc2YubmFtZSB9KTtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikgbGFiZWwuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gXCJjYW5jZWxsZWRcIiAmJiBhZ2cubWQgPiAwKSB7XG4gICAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2FnZy5yZXZpZXdlZH0vJHthZ2cubWR9IHJldmlzYWRhc2ApO1xuICAgICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChhZ2cucmV2aWV3ZWQgLyBhZ2cubWQgKiAxMDApfSVgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNhcmQuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgYWdnLnJlY2VudCk7XG4gICAgICAgICAgY2FyZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZi5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXJxdWl2b3MgZGEgcGFzdGEgYXR1YWwgKG5vdGFzLCBjYW52YXMsIGJhc2VzKVxuICAgIGNvbnN0IG5vdGVzID0gZmlsZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYXRtYXAgKHZpYSBwbHVnaW4gSGVhdG1hcCBDYWxlbmRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWF0bWFwKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0hFQVQpKSByZXR1cm47XG4gICAgaWYgKFBsYXRmb3JtLmlzUGhvbmUpIHJldHVybjsgICAvLyBoZWF0bWFwIChhbm8gaW50ZWlybykgb2N1bHRhZG8gbm8gY2VsdWxhclxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhIChkbyBjYWNoZSksIGZpbHRyYWRhcyBwZWxvIGFubyBjb3JyZW50ZS5cbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IHByZWZpeCA9IFN0cmluZyh5ZWFyKTtcbiAgICBjb25zdCBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW2RhdGUsIG5dIG9mIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5jdGltZUJ5RGF5KSB7XG4gICAgICBpZiAoIWRhdGUuc3RhcnRzV2l0aChwcmVmaXgpKSBjb250aW51ZTtcbiAgICAgIGVudHJpZXMucHVzaCh7IGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIGNvbnN0IHRvdGFsTm90ZXMgPSBjYWNoZS50b3RhbE5vdGVzO1xuICAgIGNvbnN0IHRvdGFsUmV2aWV3ZWQgPSBjYWNoZS50b3RhbFJldmlld2VkO1xuICAgIC8vIFwiZXN0YSBzZW1hbmFcIiA9IGNyaWFcdTAwRTdcdTAwRjVlcyBub3MgXHUwMEZBbHRpbW9zIDcgZGlhcyAoZG8gY2FjaGUsIHBvciBkYXRhIFx1MjE5MiBzZW1wcmUgZnJlc2NvKS5cbiAgICBsZXQgY3JlYXRlZFRoaXNXZWVrID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7IGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY3JlYXRlZFRoaXNXZWVrICs9IGNhY2hlLmN0aW1lQnlEYXkuZ2V0KHRvS2V5KGQpKSA/PyAwO1xuICAgIH1cbiAgICBjb25zdCBnbG9iYWxQY3QgPSB0b3RhbE5vdGVzID4gMCA/IE1hdGgucm91bmQodG90YWxSZXZpZXdlZCAvIHRvdGFsTm90ZXMgKiAxMDApIDogMDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkVTVEFUXHUwMENEU1RJQ0FTXCIgfSk7XG5cbiAgICAvLyBOXHUwMEZBbWVyb3MgZ2xvYmFpc1xuICAgIGNvbnN0IGdsb2IgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZ2xvYmFsXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnXCIsIHRleHQ6IFN0cmluZyh0b3RhbE5vdGVzKSB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJub3Rhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZyB3ZC1zdGF0LXJldi1udW1cIiwgdGV4dDogYCR7Z2xvYmFsUGN0fSVgIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcInJldmlzYWRhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXdlZWtcIiwgdGV4dDogYCske2NyZWF0ZWRUaGlzV2Vla31gIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcImVzdGEgc2VtYW5hXCIgfSk7XG5cbiAgICAvLyBCcmVha2Rvd24gcG9yIHBhc3RhXG4gICAgY29uc3QgdGFibGUgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtdGFibGVcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG5cbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgYWdnID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGZvbGRlci5wYXRoKSA/PyBFTVBUWV9BR0c7XG4gICAgICBpZiAoYWdnLm1kID09PSAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgcGN0ID0gTWF0aC5yb3VuZChhZ2cucmV2aWV3ZWQgLyBhZ2cubWQgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke2FnZy5tZH1gIH0pO1xuXG4gICAgICBjb25zdCBiYXJXcmFwID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhclwiIH0pO1xuICAgICAgYmFyV3JhcC5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJsaXN0XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNhcmQgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gcG9yIHRpcG8gZGUgYXJxdWl2byAobm90YSAvIGNhbnZhcyAvIGJhc2UpIFx1MjAxNCBGYXNlIDkuMlxuICAgICAgICBjb25zdCBjb3YgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY292ZXIgd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24oY292LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1jb3Zlci1nbHlwaFwiIH0pLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcblxuICAgICAgICBpZiAoaXNNZCkgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjYXJkLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IGlzTWQgPSBmLmV4dGVuc2lvbiA9PT0gXCJtZFwiO1xuICAgICAgICBjb25zdCBzdCA9IGlzTWQgPyByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZikgOiBcInByb2dyZXNzXCI7XG4gICAgICAgIGNvbnN0IHJ2ID0gaXNNZCAmJiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdXJnID0gaXNNZCA/IHJlYWROb3RlVXJnZW5jeSh0aGlzLmFwcCwgZikgOiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1yb3cgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IHRpID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLXR5cGVpY29uIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKHRpLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS1kb3Qgd2QtYmFkZ2UtJHtzdH1gIH0pO1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR3JcdTAwRTFmaWNvIGRlIGNyZXNjaW1lbnRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyR3Jvd3RoKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0dST1cpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDUkVTQ0lNRU5UTyBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgYnRuRGF5ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiZGlhXCIgfSk7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5vdGFzIGNyaWFkYXMgcG9yIGRpYVwiKTtcbiAgICBidG5EYXkub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gdHJ1ZTsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIE5vdGFzIHBvciBkYXRhIGRlIGNyaWFcdTAwRTdcdTAwRTNvIChkbyBjYWNoZSkuXG4gICAgY29uc3QgY291bnRzID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmN0aW1lQnlEYXk7XG5cbiAgICAvLyBcdTAwREFsdGltb3MgTiBkaWFzIChtZW5vcyBubyBjZWx1bGFyKVxuICAgIGNvbnN0IERBWVMgPSBQbGF0Zm9ybS5pc1Bob25lID8gMTUgOiAzMDtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCBjb3VudDogY291bnRzLmdldChrZXkpID8/IDAsIGxhYmVsOiBgJHtkYXl9LyR7bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsID0gZGF5cy5yZWR1Y2UoKHMsIGQpID0+IHMgKyBkLmNvdW50LCAwKTtcbiAgICBjb25zdCB0b2RheUtleSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gTW9kbyBjdW11bGF0aXZvOiBzb21hIGFjdW11bGFkYSBkaWEgYSBkaWFcbiAgICB0eXBlIERheUVudHJ5ID0geyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgZGlzcGxheVZhbDogbnVtYmVyIH07XG4gICAgbGV0IGVudHJpZXM6IERheUVudHJ5W107XG4gICAgaWYgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkge1xuICAgICAgbGV0IGFjYyA9IDA7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiB7IGFjYyArPSBkLmNvdW50OyByZXR1cm4geyAuLi5kLCBkaXNwbGF5VmFsOiBhY2MgfTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+ICh7IC4uLmQsIGRpc3BsYXlWYWw6IGQuY291bnQgfSkpO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5lbnRyaWVzLm1hcChlID0+IGUuZGlzcGxheVZhbCksIDEpO1xuXG4gICAgLy8gTGluaGEgZGUgcmVzdW1vXG4gICAgY29uc3QgaW5mbyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWluZm9cIiB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXRvdGFsXCIsIHRleHQ6IGAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGVudHJpZXNbZW50cmllcy5sZW5ndGggLSAxXS5kaXNwbGF5VmFsIDogdG90YWx9YCB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXBlcmlvZFwiLCB0ZXh0OiB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBgbm90YXMgYWN1bXVsYWRhcyAoJHtEQVlTfSBkaWFzKWAgOiBgbm90YXMgY3JpYWRhcyBub3MgXHUwMEZBbHRpbW9zICR7REFZU30gZGlhc2AgfSk7XG5cbiAgICAvLyBHclx1MDBFMWZpY28gZGUgYmFycmFzXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoeyBrZXksIGNvdW50LCBsYWJlbCwgZGlzcGxheVZhbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBkaXNwbGF5VmFsID09PSAwO1xuICAgICAgY29uc3QgYmFyID0gYmFyQXJlYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhclwiICsgKGlzRW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGlzRW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoZGlzcGxheVZhbCAvIG1heCkgKiAxMDApKX0lYDtcbiAgICAgIGlmICghaXNFbXB0eSkgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtsYWJlbH06ICR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZGlzcGxheVZhbCArIFwiIHRvdGFsXCIgOiBjb3VudCArIFwiIG5vdGEocylcIn1gKTtcblxuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IDcgfHwgaWR4ID09PSAxNCB8fCBpZHggPT09IDIxIHx8IGlkeCA9PT0gMjkgfHwga2V5ID09PSB0b2RheUtleTtcbiAgICAgIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWxibFwiLCB0ZXh0OiBzaG93TGJsID8gbGFiZWwgOiBcIlwiIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgKGRlbGVnYWRvIGFvIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICAvLyBCb3RcdTAwRTNvIGRlIG5hdmVnYVx1MDBFN1x1MDBFM28gXHUyMTkyIGFicmUgYSBhYmEgZGVkaWNhZGEgZG8gVG9kb2lzdCAobyBkYXNoYm9hcmQgXHUwMEU5IG8gaHViKS5cbiAgICBjb25zdCBvcGVuID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW9wZW5idG5cIiB9KTtcbiAgICBzZXRJY29uKG9wZW4sIFwic3F1YXJlLWFycm93LW91dC11cC1yaWdodFwiKTtcbiAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIGEgYWJhIGRvIFRvZG9pc3RcIik7XG4gICAgb3Blbi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4ub3BlblRvZG9pc3QoKTsgfTtcbiAgICAvLyBMYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgY29tcGFjdG8gKHNvbWUgc2Ugblx1MDBFM28gaG91dmVyIHBhY290ZXMpLlxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyUGFja2FnZXMoc2VjKTtcbiAgICAvLyBEYXNoYm9hcmQgPSBzXHUwMEYzIG8gZXNzZW5jaWFsIChBdHJhc2FkYXMgXHUwMEI3IEhvamUgXHUwMEI3IFByXHUwMEYzeGltb3MgNykuIFwiRGVwb2lzXCIgZmljYVxuICAgIC8vIHNcdTAwRjMgbmEgYWJhIGRvIFRvZG9pc3QgXHUyMTkyIHJlY29ycmVudGVzIHNcdTAwRjMgYXBhcmVjZW0gYXF1aSBwZXJ0byBkbyBkaWEuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMsIHsgc2hvd0xhdGVyOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nICsgY29uZmxpdG9zKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICByZXNldFN5bmMoKSB7XG4gICAgdGhpcy5zeW5jRGF0YSA9IG51bGw7XG4gICAgdGhpcy5zeW5jRmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGZldGNoU3luYyhtYW51YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBiYXNlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmICghYmFzZSB8fCAha2V5IHx8IHRoaXMuc3luY0xvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnN5bmNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN5bmNFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9sZGVycyA9IGF3YWl0IHN0R2V0PFNURm9sZGVyW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZm9sZGVyc1wiKTtcbiAgICAgIGNvbnN0IHdhbnRlZCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkLnRyaW0oKTtcbiAgICAgIGNvbnN0IGZvbGRlciA9IGZvbGRlcnMuZmluZChmID0+IGYuaWQgPT09IHdhbnRlZCkgPz8gZm9sZGVyc1swXTtcbiAgICAgIGlmICghZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoXCJuZW5odW1hIHBhc3RhIGNvbmZpZ3VyYWRhIG5vIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNvbnN0IGZpZCA9IGVuY29kZVVSSUNvbXBvbmVudChmb2xkZXIuaWQpO1xuXG4gICAgICBjb25zdCBbZGV2aWNlcywgY29ubnMsIHN0YXR1cywgc3RhdHMsIHN5c10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0R2V0PFNURGV2aWNlW10+KGJhc2UsIGtleSwgXCIvcmVzdC9jb25maWcvZGV2aWNlc1wiKSxcbiAgICAgICAgc3RHZXQ8eyBjb25uZWN0aW9uczogUmVjb3JkPHN0cmluZywgeyBjb25uZWN0ZWQ6IGJvb2xlYW4gfT4gfT4oYmFzZSwga2V5LCBcIi9yZXN0L3N5c3RlbS9jb25uZWN0aW9uc1wiKSxcbiAgICAgICAgc3RHZXQ8U1RTdGF0dXM+KGJhc2UsIGtleSwgYC9yZXN0L2RiL3N0YXR1cz9mb2xkZXI9JHtmaWR9YCksXG4gICAgICAgIHN0R2V0PFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9Pj4oYmFzZSwga2V5LCBcIi9yZXN0L3N0YXRzL2RldmljZVwiKS5jYXRjaCgoKSA9PiAoe30gYXMgUmVjb3JkPHN0cmluZywgeyBsYXN0U2Vlbjogc3RyaW5nIH0+KSksXG4gICAgICAgIHN0R2V0PHsgbXlJRDogc3RyaW5nIH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vc3RhdHVzXCIpLFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZSA9IGRldmljZXMuZmlsdGVyKGQgPT4gZC5kZXZpY2VJRCAhPT0gc3lzLm15SUQpO1xuICAgICAgY29uc3Qgcm93cyA9IGF3YWl0IFByb21pc2UuYWxsKHJlbW90ZS5tYXAoYXN5bmMgZCA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBhd2FpdCBzdEdldDxTVENvbXBsZXRpb24+KGJhc2UsIGtleSwgYC9yZXN0L2RiL2NvbXBsZXRpb24/Zm9sZGVyPSR7ZmlkfSZkZXZpY2U9JHtkLmRldmljZUlEfWApXG4gICAgICAgICAgLmNhdGNoKCgpID0+ICh7IGNvbXBsZXRpb246IDAsIGdsb2JhbEl0ZW1zOiAwLCBuZWVkSXRlbXM6IDAsIG5lZWRCeXRlczogMCwgbmVlZERlbGV0ZXM6IDAgfSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGQubmFtZSB8fCBkLmRldmljZUlELnNsaWNlKDAsIDcpLFxuICAgICAgICAgIG9ubGluZTogISFjb25ucy5jb25uZWN0aW9uc1tkLmRldmljZUlEXT8uY29ubmVjdGVkLFxuICAgICAgICAgIGNvbXBsZXRpb246IGMuY29tcGxldGlvbixcbiAgICAgICAgICBnbG9iYWxJdGVtczogYy5nbG9iYWxJdGVtcyA/PyAwLFxuICAgICAgICAgIG5lZWRJdGVtczogYy5uZWVkSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkQnl0ZXM6IGMubmVlZEJ5dGVzLFxuICAgICAgICAgIG5lZWREZWxldGVzOiBjLm5lZWREZWxldGVzLFxuICAgICAgICAgIGxhc3RTZWVuOiBzdGF0c1tkLmRldmljZUlEXT8ubGFzdFNlZW4gPz8gXCJcIixcbiAgICAgICAgfTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5zeW5jRGF0YSA9IHtcbiAgICAgICAgc3RhdGU6IHN0YXR1cy5zdGF0ZSxcbiAgICAgICAgbmVlZEZpbGVzOiBzdGF0dXMubmVlZEZpbGVzLFxuICAgICAgICBuZWVkQnl0ZXM6IHN0YXR1cy5uZWVkQnl0ZXMsXG4gICAgICAgIGZvbGRlckxhYmVsOiBmb2xkZXIubGFiZWwgfHwgZm9sZGVyLmlkLFxuICAgICAgICBlcnJvcnM6IChzdGF0dXMuZXJyb3JzID8/IDApICsgKHN0YXR1cy5wdWxsRXJyb3JzID8/IDApLFxuICAgICAgICBkZXZpY2VzOiByb3dzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5zeW5jRXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTeW5jKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1NZTkMpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXN5bmMtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiU0lOQ1JPTklaQVx1MDBDN1x1MDBDM09cIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleS50cmltKCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy5zeW5jTG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciBlc3RhZG8gZG8gU3luY3RoaW5nXCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFN5bmModHJ1ZSk7IH07XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb25maWd1cmUgYSBVUkwgZSBhIEFQSSBrZXkgZG8gU3luY3RoaW5nIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQuXCIgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmNFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGZhbGFyIGNvbSBvIFN5bmN0aGluZzogJHt0aGlzLnN5bmNFcnJvcn1gIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3luY0ZldGNoZWRBdCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmNMb2FkaW5nKSB2b2lkIHRoaXMuZmV0Y2hTeW5jKGZhbHNlKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyU3luY0JvZHkoc2VjLCB0aGlzLnN5bmNEYXRhISk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDb25mbGljdHMoc2VjKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luY0JvZHkoc2VjOiBIVE1MRWxlbWVudCwgZDogU3luY0RhdGEpIHtcbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtYm94XCIgfSk7XG5cbiAgICAvLyBFc3RhZG8gZGEgcGFzdGEuXG4gICAgY29uc3QgYnVzeSA9IGQuc3RhdGUgPT09IFwic3luY2luZ1wiIHx8IGQuc3RhdGUgPT09IFwic2Nhbm5pbmdcIjtcbiAgICBjb25zdCBmbCA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1mb2xkZXJcIiB9KTtcbiAgICBjb25zdCBkb3QgPSBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGQuZXJyb3JzID8gXCJ3ZC1zLWVyclwiIDogYnVzeSA/IFwid2Qtcy1idXN5XCIgOiBcIndkLXMtb2tcIikgfSk7XG4gICAgZG90LnNldFRleHQoZC5lcnJvcnMgPyBcIlx1MjZBMFwiIDogYnVzeSA/IFwiXHUyN0YzXCIgOiBcIlx1MjVDRlwiKTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZm5hbWVcIiwgdGV4dDogZC5mb2xkZXJMYWJlbCB9KTtcbiAgICBjb25zdCBzdCA9IGQuc3RhdGUgPT09IFwiaWRsZVwiID8gXCJlbSBkaWFcIiA6IGQuc3RhdGUgPT09IFwic3luY2luZ1wiID8gYHNpbmNyb25pemFuZG8gXHUyMDE0ICR7ZC5uZWVkRmlsZXN9IGl0ZW5zICgke2h1bWFuQnl0ZXMoZC5uZWVkQnl0ZXMpfSlgIDogZC5zdGF0ZTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZnN0YXRlXCIsIHRleHQ6IHN0IH0pO1xuXG4gICAgLy8gQXBhcmVsaG9zLlxuICAgIGZvciAoY29uc3QgZGV2IG9mIGQuZGV2aWNlcykge1xuICAgICAgY29uc3Qgcm93ID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWRldlwiIH0pO1xuICAgICAgY29uc3QgbyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGRldi5vbmxpbmUgPyBcIndkLXMtb2tcIiA6IFwid2Qtcy1vZmZcIikgfSk7XG4gICAgICBvLnNldFRleHQoXCJcdTI1Q0ZcIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRuYW1lXCIsIHRleHQ6IGRldi5uYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY29tcFwiLCB0ZXh0OiBgJHtNYXRoLnJvdW5kKGRldi5jb21wbGV0aW9uKX0lYCB9KTtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzICYmIGRldi5nbG9iYWxJdGVtcylcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY291bnRcIiwgdGV4dDogYCR7ZGV2Lmdsb2JhbEl0ZW1zIC0gZGV2Lm5lZWRJdGVtc30vJHtkZXYuZ2xvYmFsSXRlbXN9YCB9KTtcbiAgICAgIGNvbnN0IGV4dHJhID0gZGV2Lm5lZWREZWxldGVzID8gYCR7ZGV2Lm5lZWREZWxldGVzfSBleGNsdXNcdTAwRjVlc2AgOiBkZXYubmVlZEJ5dGVzID8gaHVtYW5CeXRlcyhkZXYubmVlZEJ5dGVzKSA6IFwiXCI7XG4gICAgICBpZiAoZXh0cmEpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHBlbmRcIiwgdGV4dDogZXh0cmEgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRzZWVuXCIsIHRleHQ6IGRldi5vbmxpbmUgPyBcIm9ubGluZVwiIDogcmVsVGltZShkZXYubGFzdFNlZW4pIH0pO1xuICAgIH1cblxuICAgIGlmIChkLmVycm9ycykgYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWVycmxpbmVcIiwgdGV4dDogYFx1MjZBMCAke2QuZXJyb3JzfSBlcnJvKHMpIG5hIHBhc3RhYCB9KTtcbiAgfVxuXG4gIC8vIExpc3RhIGRlIGNcdTAwRjNwaWFzIGRlIGNvbmZsaXRvIGRvIFN5bmN0aGluZyAoYWJyaXIgLyBhcGFnYXIgY29tIGNvbmZpcm1hXHUwMEU3XHUwMEUzbykuXG4gIHByaXZhdGUgcmVuZGVyQ29uZmxpY3RzKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLmZpbHRlcihmID0+IGYubmFtZS5pbmNsdWRlcyhcIi5zeW5jLWNvbmZsaWN0LVwiKSk7XG4gICAgY29uc3Qgd3JhcCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jb25mbGljdHNcIiB9KTtcbiAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLXN1YlwiLCB0ZXh0OiBgQ29uZmxpdG9zICgke2NvbmZsaWN0cy5sZW5ndGh9KWAgfSk7XG4gICAgaWYgKCFjb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLW5vY29uZlwiLCB0ZXh0OiBcIk5lbmh1bSBjb25mbGl0by4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBjb25mbGljdHMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY3Jvd1wiIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25hbWVcIiwgdGV4dDogZi5uYW1lIH0pO1xuICAgICAgbmFtZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBcIiArIGYucGF0aCk7XG4gICAgICBuYW1lLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICBpZiAodGhpcy5jb25mbGljdENvbmZpcm0gPT09IGYucGF0aCkge1xuICAgICAgICBjb25zdCB5ZXMgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWN5ZXNcIiwgdGV4dDogXCJhcGFnYXI/XCIgfSk7XG4gICAgICAgIHllcy5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmLCBmYWxzZSk7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfTtcbiAgICAgICAgY29uc3Qgbm8gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWNub1wiLCB0ZXh0OiBcImNhbmNlbGFyXCIgfSk7XG4gICAgICAgIG5vLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY2RlbFwiIH0pO1xuICAgICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpO1xuICAgICAgICBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiQXBhZ2FyIGNcdTAwRjNwaWEgZGUgY29uZmxpdG8gKHZhaSBwYXJhIGEgbGl4ZWlyYSlcIik7XG4gICAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZsaWN0Q29uZmlybSA9IGYucGF0aDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhZGVyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiU2Vjb25kIEJyYWluXCIgfSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcbiAgLy8gQ29udHJvbGFkb3IgXHUwMEZBbmljbyBkbyBUb2RvaXN0IChlc3RhZG8gY29tcGFydGlsaGFkbyBlbnRyZSBkYXNoYm9hcmQgZSBhYmEpLlxuICB0b2RvITogVG9kb2lzdENvbnRyb2xsZXI7XG4gIC8vIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKTogbW9udGFkbyAxeCBwb3IgY2ljbG8sIGludmFsaWRhZG8gbm9zIGV2ZW50b3MgZG8gdmF1bHQuXG4gIHByaXZhdGUgdmF1bHRDYWNoZTogVmF1bHRDYWNoZSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIEFncmVnYWRvcyBkbyBjb2ZyZSAodW1hIHBhc3NhZGEpLCByZXVzYWRvcyBwb3IgdG9kYXMgYXMgc2VcdTAwRTdcdTAwRjVlcyBubyByZW5kZXIuXG4gIGdldFZhdWx0Q2FjaGUoKTogVmF1bHRDYWNoZSB7XG4gICAgaWYgKCF0aGlzLnZhdWx0Q2FjaGUpIHRoaXMudmF1bHRDYWNoZSA9IGJ1aWxkVmF1bHRDYWNoZSh0aGlzLmFwcCk7XG4gICAgcmV0dXJuIHRoaXMudmF1bHRDYWNoZTtcbiAgfVxuICBpbnZhbGlkYXRlVmF1bHRDYWNoZSgpIHsgdGhpcy52YXVsdENhY2hlID0gbnVsbDsgfVxuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgIHRoaXMudG9kbyA9IG5ldyBUb2RvaXN0Q29udHJvbGxlcih0aGlzLmFwcCwgdGhpcywgdGhpcyk7XG4gICAgLy8gQXV0by1yZWZyZXNoIGRvIFRvZG9pc3Q6IHZlcmlmaWNhIGEgY2FkYSBtaW51dG87IHNcdTAwRjMgYnVzY2Egc2UgaFx1MDBFMSB2aWV3IGFiZXJ0YSBlIG9cbiAgICAvLyBjYWNoZSBwYXNzb3UgZG8gVFRMICg1IG1pbikuIHJlZ2lzdGVySW50ZXJ2YWwgbGltcGEgbyB0aW1lciBubyB1bmxvYWQuXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnRvZG8ubWF5YmVSZWZyZXNoKCksIDYwXzAwMCkpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgRGFzaGJvYXJkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVE9ET0lTVF9WSUVXX1RZUEUsIGxlYWYgPT4gbmV3IFRvZG9pc3RWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsYXlvdXQtZGFzaGJvYXJkXCIsIFwiQWJyaXIgV2VydXMgRGFzaGJvYXJkXCIsICgpID0+IHRoaXMub3BlbigpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJsaXN0LWNoZWNrc1wiLCBcIkFicmlyIFRvZG9pc3QgKFdlcnVzKVwiLCAoKSA9PiB0aGlzLm9wZW5Ub2RvaXN0KCkpO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tZGFzaGJvYXJkXCIsIG5hbWU6IFwiQWJyaXIgRGFzaGJvYXJkXCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW4oKSB9KTtcbiAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJvcGVuLXRvZG9pc3RcIiwgbmFtZTogXCJBYnJpciBUb2RvaXN0XCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW5Ub2RvaXN0KCkgfSk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBXZXJ1c1NldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcbiAgfVxuXG4gIC8vIFRvZGFzIGFzIHZpZXdzIChkYXNoYm9hcmQgKyBhYmEgVG9kb2lzdCkgYWJlcnRhcywgcXVlIHRcdTAwRUFtIGNvbnRyb2xhZG9yIFRvZG9pc3QuXG4gIHByaXZhdGUgdG9kb1ZpZXdzKCk6IChEYXNoYm9hcmRWaWV3IHwgVG9kb2lzdFZpZXcpW10ge1xuICAgIGNvbnN0IG91dDogKERhc2hib2FyZFZpZXcgfCBUb2RvaXN0VmlldylbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiBbVklFV19UWVBFLCBUT0RPSVNUX1ZJRVdfVFlQRV0pXG4gICAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSh0KSkge1xuICAgICAgICBjb25zdCB2ID0gbGVhZi52aWV3O1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcgfHwgdiBpbnN0YW5jZW9mIFRvZG9pc3RWaWV3KSBvdXQucHVzaCh2KTtcbiAgICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgLy8gUmUtYnVzY2EgbyBUb2RvaXN0IChjb250cm9sbGVyIFx1MDBGQW5pY28gXHUyMTkyIG5vdGlmaWNhIHRvZGFzIGFzIHZpZXdzIGluc2NyaXRhcykuXG4gIHJlZnJlc2hEYXNoYm9hcmRzKCkge1xuICAgIHRoaXMudG9kby5yZXNldCgpO1xuICB9XG5cbiAgLy8gUmVzZXRhIG8gZXN0YWRvIGRvIFN5bmN0aGluZyBuYXMgZGFzaGJvYXJkcyAoZXguOiB0b2tlbi9VUkwgYWx0ZXJhZG9zKS5cbiAgcmVmcmVzaFN5bmMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFN5bmMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZS1yZW5kZXJpemEgdG9kYXMgYXMgdmlld3MgYWJlcnRhcyAoYXBcdTAwRjNzIG11ZGFyIGNvbmZpZyBuYSBhYmEgZGVcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXM6IG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcywgcGFjb3RlcykuXG4gIHJlcmVuZGVyRGFzaGJvYXJkcygpIHtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdGhpcy50b2RvVmlld3MoKSkgdi5yZWZyZXNoKCk7XG4gIH1cblxuICAvLyBNb3N0cmEvb2N1bHRhIHVtYSBzZVx1MDBFN1x1MDBFM28gKFwic2VjOjxpZD5cIikgb3UgcGFzdGEgKGNhbWluaG8pIHBvciBjaGF2ZSBlbSBgaGlkZGVuYC5cbiAgYXN5bmMgc2V0SGlkZGVuKGtleTogc3RyaW5nLCBoaWRkZW46IGJvb2xlYW4pIHtcbiAgICBjb25zdCBoYXMgPSB0aGlzLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICAgIGlmIChoaWRkZW4gJiYgIWhhcykgdGhpcy5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIGVsc2UgaWYgKCFoaWRkZW4gJiYgaGFzKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMuc2V0dGluZ3MuaGlkZGVuLmZpbHRlcihrID0+IGsgIT09IGtleSk7XG4gICAgZWxzZSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgLy8gUmVvcmRlbmEgdW1hIHNlXHUwMEU3XHUwMEUzbyBlbSBzZWN0aW9uT3JkZXIgKGRpciA9IC0xIHNvYmUsICsxIGRlc2NlKS5cbiAgYXN5bmMgbW92ZVNlY3Rpb24oaWQ6IFNlY3Rpb25JZCwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBvcmRlciA9IFsuLi50aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBvcmRlcjtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICBhc3luYyBtb3ZlUGFja2FnZShpbmRleDogbnVtYmVyLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGNvbnN0IGogPSBpbmRleCArIGRpcjtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGogPCAwIHx8IGogPj0gYXJyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFthcnJbaW5kZXhdLCBhcnJbal1dID0gW2FycltqXSwgYXJyW2luZGV4XV07XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIGxldCBuZWVkU3RNaWdyYXRpb24gPSBmYWxzZTsgICAvLyBjcmVkZW5jaWFpcyBTeW5jdGhpbmcgbWlncmFuZG8gZGF0YS5qc29uIFx1MjE5MiBsb2NhbFN0b3JhZ2VcbiAgICAvLyBTYW5lYW1lbnRvOiBzZWN0aW9uT3JkZXIgY29tIGV4YXRhbWVudGUgYXMgc2VcdTAwRTdcdTAwRjVlcyB2XHUwMEUxbGlkYXMsIHNlbSBkdXBsaWNhdGFzLlxuICAgIGNvbnN0IHZhbGlkOiBTZWN0aW9uSWRbXSA9IFtcInN0YXRzXCIsIFwidG9kb2lzdFwiLCBcInBhcmFcIiwgXCJzeW5jXCIsIFwiaGVhdG1hcFwiLCBcImdyb3d0aFwiLCBcImNhbGVuZGFyXCJdO1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PFNlY3Rpb25JZD4oKTtcbiAgICBjb25zdCBjbGVhbmVkID0gKHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyIHx8IFtdKS5maWx0ZXIoXG4gICAgICAocyk6IHMgaXMgU2VjdGlvbklkID0+IHZhbGlkLmluY2x1ZGVzKHMgYXMgU2VjdGlvbklkKSAmJiAhc2Vlbi5oYXMocyBhcyBTZWN0aW9uSWQpICYmIChzZWVuLmFkZChzIGFzIFNlY3Rpb25JZCksIHRydWUpXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmFsaWQpIGlmICghc2Vlbi5oYXModikpIGNsZWFuZWQucHVzaCh2KTtcbiAgICB0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IGNsZWFuZWQ7ICAgLy8gXCJyZXBvcnRzXCIgc29tZSBhcXVpIHNlIGVzdGF2YSBudW1hIGNvbmZpZyBhbnRpZ2FcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5zZXR0aW5ncy5oaWRkZW4pKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IFtdO1xuICAgIC8vIEZvbnRlcyBkYSBTZW1hbmEgKHYwLjEwLjEpOiB2YWxpZGEgYSBsaXN0YTsgc2UgYXVzZW50ZS9pbnZcdTAwRTFsaWRhLCB1c2EgbyBkZWZhdWx0LlxuICAgIGNvbnN0IGNzID0gdGhpcy5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXM7XG4gICAgdGhpcy5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMgPSBBcnJheS5pc0FycmF5KGNzKSAmJiBjcy5sZW5ndGhcbiAgICAgID8gY3MuZmlsdGVyKHMgPT4gcyAmJiB0eXBlb2Ygcy5wYXRoID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgIC5tYXAocyA9PiAoeyBwYXRoOiBzLnBhdGgsIGNvbG9yOiB0eXBlb2Ygcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IHMuY29sb3IgOiBBQ0NFTlRTWzBdLCBvbjogcy5vbiAhPT0gZmFsc2UgfSkpXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MuY2FsZW5kYXJTb3VyY2VzLm1hcChzID0+ICh7IC4uLnMgfSkpO1xuICAgIC8vIFNhbmVhbWVudG8gVG9kb2lzdCAodjAuNy4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID09PSAzID8gMyA6IDc7XG4gICAgY29uc3QgdGYgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnMgPSB7XG4gICAgICBwcm9qZWN0czogQXJyYXkuaXNBcnJheSh0Zj8ucHJvamVjdHMpID8gdGYucHJvamVjdHMgOiBbXSxcbiAgICAgIGxhYmVsczogQXJyYXkuaXNBcnJheSh0Zj8ubGFiZWxzKSA/IHRmLmxhYmVscyA6IFtdLFxuICAgIH07XG4gICAgLy8gRXhpYmlcdTAwRTdcdTAwRTNvIG5hcyBsaW5oYXMgKHYwLjguMCkuXG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgPSB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAhPT0gZmFsc2U7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMgPT09IHRydWU7XG4gICAgLy8gU3luY3RoaW5nICh2MC4xMC4wKSBcdTIwMTQgY3JlZGVuY2lhaXMgc1x1MDBFM28gUE9SLURJU1BPU0lUSVZPOiB2aXZlbSBubyBsb2NhbFN0b3JhZ2VcbiAgICAvLyAoblx1MDBFM28gc2luY3Jvbml6YW0gcGVsbyBkYXRhLmpzb24pLiBNaWdyYVx1MDBFN1x1MDBFM28gKDF4KTogc2UgbyBsb2NhbFN0b3JhZ2UgYWluZGEgblx1MDBFM29cbiAgICAvLyB0ZW0sIGhlcmRhIG8gdmFsb3IgcXVlIGVzdGF2YSBubyBkYXRhLmpzb24gZSByZWdyYXZhICh2ZXIgZmltIGRvIG1cdTAwRTl0b2RvKS5cbiAgICBjb25zdCBsc0dldCA9IChrOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIGNvbnN0IHYgPSB0aGlzLmFwcC5sb2FkTG9jYWxTdG9yYWdlKGspO1xuICAgICAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiID8gdiA6IG51bGw7XG4gICAgfTtcbiAgICBjb25zdCBkYXRhVXJsID0gdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsID09PSBcInN0cmluZ1wiICYmIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsLnRyaW0oKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA6IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgY29uc3QgZGF0YUtleSA9IHR5cGVvZiB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5IDogXCJcIjtcbiAgICBjb25zdCBkYXRhRm9sZGVyID0gdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPT09IFwic3RyaW5nXCIgPyB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkIDogXCJcIjtcbiAgICBuZWVkU3RNaWdyYXRpb24gPSBsc0dldChMU19TVF9VUkwpID09PSBudWxsICYmIGxzR2V0KExTX1NUX0tFWSkgPT09IG51bGwgJiYgbHNHZXQoTFNfU1RfRk9MREVSKSA9PT0gbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IGxzR2V0KExTX1NUX1VSTCkgPz8gZGF0YVVybDtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IGxzR2V0KExTX1NUX0tFWSkgPz8gZGF0YUtleTtcbiAgICB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gbHNHZXQoTFNfU1RfRk9MREVSKSA/PyBkYXRhRm9sZGVyO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9PT0gdHJ1ZTtcbiAgICAvLyBQYWNvdGVzIGRlIHRhcmVmYXMgKHYwLjEyLjApLlxuICAgIGNvbnN0IHRwID0gdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXMgPSBBcnJheS5pc0FycmF5KHRwKVxuICAgICAgPyB0cC5maWx0ZXIocCA9PiBwICYmIHR5cGVvZiBwLmlkID09PSBcInN0cmluZ1wiKS5tYXAocCA9PiAoe1xuICAgICAgICAgIGlkOiBwLmlkLFxuICAgICAgICAgIG5hbWU6IHR5cGVvZiBwLm5hbWUgPT09IFwic3RyaW5nXCIgPyBwLm5hbWUgOiBcIlwiLFxuICAgICAgICAgIGljb246IHR5cGVvZiBwLmljb24gPT09IFwic3RyaW5nXCIgJiYgcC5pY29uLnRyaW0oKSA/IHAuaWNvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB0YXNrczogQXJyYXkuaXNBcnJheShwLnRhc2tzKSA/IHAudGFza3MuZmlsdGVyKHggPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIpIDogW10sXG4gICAgICAgICAgcHJvamVjdElkOiB0eXBlb2YgcC5wcm9qZWN0SWQgPT09IFwic3RyaW5nXCIgJiYgcC5wcm9qZWN0SWQgPyBwLnByb2plY3RJZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBsYWJlbHM6IEFycmF5LmlzQXJyYXkocC5sYWJlbHMpID8gcC5sYWJlbHMuZmlsdGVyKHggPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIpIDogdW5kZWZpbmVkLFxuICAgICAgICB9KSlcbiAgICAgIDogW107XG4gICAgdGhpcy5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA9IFtcImFsd2F5c1wiLCBcIm1hbnlcIiwgXCJuZXZlclwiXS5pbmNsdWRlcyh0aGlzLnNldHRpbmdzLnBhY2thZ2VDb25maXJtKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnBhY2thZ2VDb25maXJtIDogXCJtYW55XCI7XG5cbiAgICAvLyBNaWdyYVx1MDBFN1x1MDBFM28gMXg6IGdyYXZhIGFzIGNyZWRlbmNpYWlzIG5vIGxvY2FsU3RvcmFnZSBlIGFzIHJlbW92ZSBkbyBkYXRhLmpzb24uXG4gICAgaWYgKG5lZWRTdE1pZ3JhdGlvbikgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICAvLyBDcmVkZW5jaWFpcyBkbyBTeW5jdGhpbmcgc1x1MDBFM28gcG9yLWRpc3Bvc2l0aXZvIFx1MjE5MiBsb2NhbFN0b3JhZ2UgKG5cdTAwRTNvIHNpbmNyb25pemEpLlxuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfVVJMLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ1VybCk7XG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9LRVksIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5KTtcbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX0ZPTERFUiwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCk7XG4gICAgLy8gTyBkYXRhLmpzb24gKHNpbmNyb25pemFkbyBwZWxvIFN5bmN0aGluZykgTlx1MDBDM08gbGV2YSBhcyBjcmVkZW5jaWFpcy5cbiAgICBjb25zdCBzaGFyZWQ6IFBhcnRpYWw8RGFzaFNldHRpbmdzPiA9IHsgLi4udGhpcy5zZXR0aW5ncyB9O1xuICAgIGRlbGV0ZSBzaGFyZWQuc3luY3RoaW5nVXJsO1xuICAgIGRlbGV0ZSBzaGFyZWQuc3luY3RoaW5nQXBpS2V5O1xuICAgIGRlbGV0ZSBzaGFyZWQuc3luY3RoaW5nRm9sZGVySWQ7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YShzaGFyZWQpO1xuICB9XG5cbiAgYXN5bmMgb3BlbigpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5Ub2RvaXN0KCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVE9ET0lTVF9WSUVXX1RZUEUpWzBdO1xuICAgIGlmICghbGVhZikgeyBsZWFmID0gd29ya3NwYWNlLmdldExlYWYoZmFsc2UpOyBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IFRPRE9JU1RfVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge1xuICAgIC8vIFZhcnJlIGVsZW1lbnRvcyBmbHV0dWFudGVzIHF1ZSB2aXZlbSBubyBkb2N1bWVudC5ib2R5ICh0b29sdGlwcy9wb3BvdmVycyk6IHNlIG9cbiAgICAvLyBwbHVnaW4gZm9yIGRlc2FiaWxpdGFkbyBjb20gdW0gYWJlcnRvLCBvIG9uQ2xvc2UgZGEgdmlldyBwb2RlIG5cdTAwRTNvIHJvZGFyLlxuICAgIHRoaXMudG9kbz8uaGlkZVRpcCgpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2QtdG9vbHRpcCwgLndkLXBvcFwiKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZWRpY2FkYSBkbyBUb2RvaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gSHViIGRvIFRvZG9pc3QgbmEgXHUwMEUxcmVhIGNlbnRyYWwgKG5cdTAwRTNvIFx1MDBFOSBzaWRlYmFyKTogbGFuXHUwMEU3YWRvciBkZSBwYWNvdGVzICsgYSBtZXNtYVxuLy8gbGlzdGEgZGUgdGFyZWZhcyBkbyBkYXNoYm9hcmQgKHZpYSBUb2RvaXN0Q29udHJvbGxlciBjb21wYXJ0aWxoYWRvKS5cbmNsYXNzIFRvZG9pc3RWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHVuc3ViVG9kbzogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFRPRE9JU1RfVklFV19UWVBFOyB9XG4gIGdldERpc3BsYXlUZXh0KCkgeyByZXR1cm4gXCJUb2RvaXN0XCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxpc3QtY2hlY2tzXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSB0aGlzLnBsdWdpbi50b2RvLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlZnJlc2goKSk7XG4gIH1cbiAgYXN5bmMgb25DbG9zZSgpIHtcbiAgICB0aGlzLnVuc3ViVG9kbz8uKCk7XG4gICAgdGhpcy51bnN1YlRvZG8gPSBudWxsO1xuICAgIHRoaXMucGx1Z2luLnRvZG8uaGlkZVRpcCgpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHJvb3QuYWRkQ2xhc3MoXCJ3ZC1yb290XCIsIFwid2QtdG9kb2lzdC12aWV3XCIpO1xuXG4gICAgY29uc3QgaCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlclwiIH0pO1xuICAgIGNvbnN0IHR4dCA9IGguY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYWRlci10ZXh0XCIgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1kYXRlXCIsIHRleHQ6IHRvZGF5QlIoKSB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpdGxlXCIsIHRleHQ6IFwiVG9kb2lzdFwiIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJQYWNrYWdlcyhyb290LCB7IGhlYWRpbmc6IHRydWUgfSk7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLXRvZG8tc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiVEFSRUZBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5yZW5kZXJMaXN0KHNlYywgY3RybHMpO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNb2RhbCBkZSBjb25maXJtYVx1MDBFN1x1MDBFM28gZ2VuXHUwMEU5cmljbyAocmVzb2x2ZSB0cnVlL2ZhbHNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIENvbmZpcm1JdGVtIHtcbiAgdGV4dDogc3RyaW5nO1xuICBsYWJlbHM/OiB7IG5hbWU6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9W107ICAgLy8gY2hpcHMgb3BjaW9uYWlzIChldGlxdWV0YXMpXG59XG5cbmludGVyZmFjZSBDb25maXJtT3B0cyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGJvZHk6IHN0cmluZztcbiAgaXRlbXM/OiBDb25maXJtSXRlbVtdOyAgIC8vIGxpc3RhIG9wY2lvbmFsIChleC46IHRhcmVmYXMgYSBjcmlhcilcbiAgY3RhOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHJcdTAwRjN0dWxvIGRvIGJvdFx1MDBFM28gZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvXG59XG5cbmNsYXNzIENvbmZpcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBkb25lID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IENvbmZpcm1PcHRzLCBwcml2YXRlIHJlc29sdmU6IChvazogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgIHN1cGVyKGFwcCk7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmFkZENsYXNzKFwid2QtY29uZmlybVwiKTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IHRoaXMub3B0cy50aXRsZSB9KTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgdGV4dDogdGhpcy5vcHRzLmJvZHkgfSk7XG4gICAgaWYgKHRoaXMub3B0cy5pdGVtcz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCB1bCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInVsXCIsIHsgY2xzOiBcIndkLWNvbmZpcm0tbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLm9wdHMuaXRlbXMpIHtcbiAgICAgICAgY29uc3QgbGkgPSB1bC5jcmVhdGVFbChcImxpXCIpO1xuICAgICAgICBsaS5jcmVhdGVTcGFuKHsgdGV4dDogaXQudGV4dCB9KTtcbiAgICAgICAgZm9yIChjb25zdCBsIG9mIGl0LmxhYmVscyA/PyBbXSkge1xuICAgICAgICAgIGNvbnN0IGNoaXAgPSBsaS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvbmZpcm0tbGFiZWxcIiB9KTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IGwuY29sb3I7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2wubmFtZX1gIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmNsb3NlKCk7XG4gICAgY29uc3Qgb2sgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIm1vZC1jdGFcIiwgdGV4dDogdGhpcy5vcHRzLmN0YSB9KTtcbiAgICBvay5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmRvbmUgPSB0cnVlOyB0aGlzLmNsb3NlKCk7IH07XG4gIH1cblxuICBvbkNsb3NlKCkge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5yZXNvbHZlKHRoaXMuZG9uZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uZmlybU1vZGFsKGFwcDogQXBwLCBvcHRzOiBDb25maXJtT3B0cyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBuZXcgQ29uZmlybU1vZGFsKGFwcCwgb3B0cywgcmVzb2x2ZSkub3BlbigpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBvcC11cCBkZSBkZXRhbGhlcyBkYSB0YXJlZmEgKHNcdTAwRjMgbGVpdHVyYTsgYm90XHUwMEUzbyBFZGl0YXIgYWJyZSBvIGZvcm11bFx1MDBFMXJpbykgXHUyNTAwXG5cbmludGVyZmFjZSBUYXNrRGV0YWlsT3B0cyB7XG4gIHRhc2s6IFRvZG9pc3RUYXNrO1xuICBwcm9qZWN0TmFtZT86IHN0cmluZztcbiAgbGFiZWxDb2xvcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBlZGl0OiAoKSA9PiB2b2lkO1xuICBjb21wbGV0ZTogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0RldGFpbE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBjb21wb25lbnQ6IENvbXBvbmVudCwgcHJpdmF0ZSBvcHRzOiBUYXNrRGV0YWlsT3B0cykgeyBzdXBlcihhcHApOyB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIGNvbnN0IHQgPSB0aGlzLm9wdHMudGFzaztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1tb2RhbFwiKTtcbiAgICB0aXRsZUVsLnNldFRleHQodC5jb250ZW50KTtcblxuICAgIGNvbnN0IG1ldGEgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRkLW1ldGFcIiB9KTtcbiAgICBjb25zdCBwcmkgPSBwcmlNZXRhKHQucHJpb3JpdHkpO1xuICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKGRrKSB7XG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcFwiLCB0ZXh0OiBgXHVEODNEXHVEQ0M1ICR7ZH0vJHttfS8ke3l9JHt0LmR1ZT8uaXNfcmVjdXJyaW5nID8gXCIgXHUyN0YzXCIgOiBcIlwifWAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdHMucHJvamVjdE5hbWUpIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGAjICR7dGhpcy5vcHRzLnByb2plY3ROYW1lfWAgfSk7XG4gICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB7XG4gICAgICBjb25zdCBjaGlwID0gbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXAgd2QtdGQtbGFiZWxcIiB9KTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5vcHRzLmxhYmVsQ29sb3IobCk7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgIH1cblxuICAgIGlmIChoYXNEZXNjKHQpKSB7XG4gICAgICBjb25zdCBib2R5ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWRlc2MgbWFya2Rvd24tcmVuZGVyZWRcIiB9KTtcbiAgICAgIHZvaWQgTWFya2Rvd25SZW5kZXJlci5yZW5kZXIodGhpcy5hcHAsIHQuZGVzY3JpcHRpb24hLnRyaW0oKSwgYm9keSwgXCJcIiwgdGhpcy5jb21wb25lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZW1wdHlcIiwgdGV4dDogXCJFc3RhIHRhcmVmYSBuXHUwMEUzbyB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzby5cIiB9KTtcbiAgICB9XG5cbiAgICAvLyBFZGl0YXIgKGVzcXVlcmRhKSBcdTAwQjcgQ29uY2x1aXIgKyBBYnJpciBubyBUb2RvaXN0IChkaXJlaXRhKS5cbiAgICBjb25zdCBhY3Rpb25zID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10YXNrLW1vZGFsLWFjdGlvbnNcIiB9KTtcbiAgICBjb25zdCBlZGl0ID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzBFIEVkaXRhclwiIH0pO1xuICAgIGVkaXQub25jbGljayA9ICgpID0+IHsgdGhpcy5jbG9zZSgpOyB0aGlzLm9wdHMuZWRpdCgpOyB9O1xuICAgIGFjdGlvbnMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXNwYWNlclwiIH0pO1xuICAgIGNvbnN0IGRvbmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MTMgQ29uY2x1aXJcIiB9KTtcbiAgICBkb25lLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMub3B0cy5jb21wbGV0ZSgpOyB0aGlzLmNsb3NlKCk7IH07XG4gICAgY29uc3Qgb3BlbiA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkFicmlyIG5vIFRvZG9pc3RcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHQpLCBcIl9ibGFua1wiKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEZvcm11bFx1MDBFMXJpbyBkZSB0YXJlZmEgKGNyaWFyIC8gZWRpdGFyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tGb3JtVmFsdWVzIHtcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyOyAgIC8vIEFQSSAxLi40ICg0ID0gcDEpXG4gIGR1ZURhdGU6IHN0cmluZzsgICAgLy8gWVlZWS1NTS1ERCAoY2FsZW5kXHUwMEUxcmlvKTsgXCJcIiA9IHNlbSBkYXRhXG4gIHByb2plY3RJZDogc3RyaW5nO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgVGFza0Zvcm1PcHRzIHtcbiAgbW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiO1xuICB0YXNrPzogVG9kb2lzdFRhc2s7XG4gIHByZWZpbGxEdWU/OiBzdHJpbmc7XG4gIHByb2plY3RzOiBUb2RvaXN0UHJvamVjdFtdO1xuICBsYWJlbHM6IHN0cmluZ1tdO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIHN1Ym1pdDogKHY6IFRhc2tGb3JtVmFsdWVzKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICByZW1vdmU/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuICBjb21wbGV0ZT86ICgpID0+IHZvaWQ7XG59XG5cbmNsYXNzIFRhc2tGb3JtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgdjogVGFza0Zvcm1WYWx1ZXM7XG4gIHByaXZhdGUga25vd25MYWJlbHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIGNvbmZpcm1EZWwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBhY3Rpb25zRWwhOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBvcHRzOiBUYXNrRm9ybU9wdHMpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIGNvbnN0IHQgPSBvcHRzLnRhc2s7XG4gICAgLy8gUHJlZmlsbCBkZSBjcmlhXHUwMEU3XHUwMEUzbzogXCJob2plXCIgXHUyMTkyIGRhdGEgZGUgaG9qZTsgalx1MDBFMS1ZWVlZLU1NLUREIHBhc3NhIGRpcmV0bzsgcmVzdG8gaWdub3JhLlxuICAgIGNvbnN0IHByZSA9IG9wdHMucHJlZmlsbER1ZTtcbiAgICBjb25zdCBwcmVmaWxsRGF0ZSA9IHByZSA9PT0gXCJob2plXCIgPyB0b0tleShuZXcgRGF0ZSgpKVxuICAgICAgOiAocHJlICYmIC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KHByZSkgPyBwcmUgOiBcIlwiKTtcbiAgICB0aGlzLnYgPSB7XG4gICAgICBjb250ZW50OiB0Py5jb250ZW50ID8/IFwiXCIsXG4gICAgICBkZXNjcmlwdGlvbjogdD8uZGVzY3JpcHRpb24gPz8gXCJcIixcbiAgICAgIHByaW9yaXR5OiB0Py5wcmlvcml0eSA/PyAxLFxuICAgICAgZHVlRGF0ZTogdD8uZHVlPy5kYXRlID8gdC5kdWUuZGF0ZS5zdWJzdHJpbmcoMCwgMTApIDogcHJlZmlsbERhdGUsXG4gICAgICBwcm9qZWN0SWQ6IHQ/LnByb2plY3RfaWQgPz8gXCJcIixcbiAgICAgIGxhYmVsczogKHQ/LmxhYmVscyA/PyBbXSkuc2xpY2UoKSxcbiAgICB9O1xuICAgIHRoaXMua25vd25MYWJlbHMgPSBbLi4ubmV3IFNldChbLi4ub3B0cy5sYWJlbHMsIC4uLnRoaXMudi5sYWJlbHNdKV0uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCwgdGl0bGVFbCwgbW9kYWxFbCB9ID0gdGhpcztcbiAgICBtb2RhbEVsLmFkZENsYXNzKFwid2QtdGFzay1mb3JtXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0aGlzLm9wdHMubW9kZSA9PT0gXCJjcmVhdGVcIiA/IFwiTm92YSB0YXJlZmFcIiA6IFwiRWRpdGFyIHRhcmVmYVwiKTtcblxuICAgIC8vIFNcdTAwRjMgbmEgZWRpXHUwMEU3XHUwMEUzbzogYXRhbGhvIFwiQWJyaXIgbm8gVG9kb2lzdFwiIG5vIHRvcG8sIGFvIGxhZG8gZG8gWCBkZSBmZWNoYXIuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIiAmJiB0aGlzLm9wdHMudGFzaykge1xuICAgICAgY29uc3Qgb3BlbiA9IG1vZGFsRWwuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtdGYtb3Blbi10b3BcIiwgdGV4dDogXCJcdTIxOTcgVG9kb2lzdFwiIH0pO1xuICAgICAgb3Blbi5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBubyBUb2RvaXN0XCIpO1xuICAgICAgb3Blbi5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0aGlzLm9wdHMudGFzayEpLCBcIl9ibGFua1wiKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpZWxkKFwiVFx1MDBFRHR1bG9cIik7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcImlucHV0XCIsIHsgY2xzOiBcIndkLXRmLWlucHV0XCIsIHR5cGU6IFwidGV4dFwiIH0pO1xuICAgIGNvbnRlbnQudmFsdWUgPSB0aGlzLnYuY29udGVudDtcbiAgICBjb250ZW50LnBsYWNlaG9sZGVyID0gXCJPIHF1ZSBwcmVjaXNhIHNlciBmZWl0bz9cIjtcbiAgICBjb250ZW50Lm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5jb250ZW50ID0gY29udGVudC52YWx1ZTsgfTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRlbnQuZm9jdXMoKSwgMCk7XG5cbiAgICB0aGlzLmZpZWxkKFwiRGVzY3JpXHUwMEU3XHUwMEUzb1wiKTtcbiAgICBjb25zdCBkZXNjID0gY29udGVudEVsLmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtdGYtdGV4dGFyZWFcIiB9KTtcbiAgICBkZXNjLnZhbHVlID0gdGhpcy52LmRlc2NyaXB0aW9uO1xuICAgIGRlc2MucGxhY2Vob2xkZXIgPSBcIkRldGFsaGVzIC8gaW5zdHJ1XHUwMEU3XHUwMEY1ZXMgKG1hcmtkb3duKVwiO1xuICAgIGRlc2Mucm93cyA9IDM7XG4gICAgZGVzYy5vbmlucHV0ID0gKCkgPT4geyB0aGlzLnYuZGVzY3JpcHRpb24gPSBkZXNjLnZhbHVlOyB9O1xuXG4gICAgdGhpcy5maWVsZChcIlByaW9yaWRhZGVcIik7XG4gICAgY29uc3QgcHJvdyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtcHJpLXJvd1wiIH0pO1xuICAgIGNvbnN0IHJlbmRlclByaSA9ICgpID0+IHtcbiAgICAgIHByb3cuZW1wdHkoKTtcbiAgICAgIGZvciAoY29uc3QgYXBpIG9mIFs0LCAzLCAyLCAxXSkge1xuICAgICAgICBjb25zdCBtZXRhID0gVE9ET0lTVF9QUklbYXBpXTtcbiAgICAgICAgY29uc3QgYiA9IHByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10Zi1wcmlcIiArICh0aGlzLnYucHJpb3JpdHkgPT09IGFwaSA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICAgICAgYi5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIG1ldGEuY29sb3IpO1xuICAgICAgICBiLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudi5wcmlvcml0eSA9IGFwaTsgcmVuZGVyUHJpKCk7IH07XG4gICAgICB9XG4gICAgfTtcbiAgICByZW5kZXJQcmkoKTtcblxuICAgIHRoaXMuZmllbGQoXCJEYXRhXCIpO1xuICAgIGNvbnN0IGRyb3cgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWR1ZS1yb3dcIiB9KTtcbiAgICBjb25zdCBkdWUgPSBkcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXQgd2QtdGYtZGF0ZVwiLCB0eXBlOiBcImRhdGVcIiB9KTtcbiAgICBkdWUudmFsdWUgPSB0aGlzLnYuZHVlRGF0ZTtcbiAgICBkdWUub25jaGFuZ2UgPSAoKSA9PiB7IHRoaXMudi5kdWVEYXRlID0gZHVlLnZhbHVlOyB9O1xuICAgIGNvbnN0IGNsciA9IGRyb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtdGYtZHVlLWNsZWFyXCIsIHRleHQ6IFwic2VtIGRhdGFcIiB9KTtcbiAgICBjbHIub25jbGljayA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBcIlwiOyBkdWUudmFsdWUgPSBcIlwiOyB9O1xuICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNsaXF1ZSBwYXJhIGFicmlyIG8gY2FsZW5kXHUwMEUxcmlvLiBWYXppbyA9IHNlbSBkYXRhLlwiIH0pO1xuICAgIGlmICh0aGlzLm9wdHMudGFzaz8uZHVlPy5pc19yZWN1cnJpbmcpXG4gICAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXdhcm5cIiwgdGV4dDogXCJcdTI3RjMgVGFyZWZhIHJlY29ycmVudGUgXHUyMDE0IG11ZGFyIGEgZGF0YSBmaXhhIHBvZGUgZW5jZXJyYXIgYSByZWNvcnJcdTAwRUFuY2lhLlwiIH0pO1xuXG4gICAgdGhpcy5maWVsZChcIlByb2pldG9cIik7XG4gICAgY29uc3Qgc2VsID0gY29udGVudEVsLmNyZWF0ZUVsKFwic2VsZWN0XCIsIHsgY2xzOiBcIndkLXRmLXNlbGVjdFwiIH0pO1xuICAgIGNvbnN0IGluYm94ID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogXCJFbnRyYWRhIChJbmJveClcIiwgdmFsdWU6IFwiXCIgfSk7XG4gICAgaWYgKCF0aGlzLnYucHJvamVjdElkKSBpbmJveC5zZWxlY3RlZCA9IHRydWU7XG4gICAgZm9yIChjb25zdCBwIG9mIHRoaXMub3B0cy5wcm9qZWN0cykge1xuICAgICAgY29uc3QgbyA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IHAubmFtZSwgdmFsdWU6IHAuaWQgfSk7XG4gICAgICBpZiAocC5pZCA9PT0gdGhpcy52LnByb2plY3RJZCkgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICAgIHNlbC5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LnByb2plY3RJZCA9IHNlbC52YWx1ZTsgfTtcblxuICAgIHRoaXMuZmllbGQoXCJFdGlxdWV0YXNcIik7XG4gICAgY29uc3QgbHdyYXAgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsc1wiIH0pO1xuICAgIGlmICh0aGlzLmtub3duTGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcmVuZGVyTGFiZWxzID0gKCkgPT4ge1xuICAgICAgICBsd3JhcC5lbXB0eSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5rbm93bkxhYmVscykge1xuICAgICAgICAgIGNvbnN0IG9uID0gdGhpcy52LmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgICBjb25zdCBjaGlwID0gbHdyYXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgICAgICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnYubGFiZWxzLmluZGV4T2YobCk7XG4gICAgICAgICAgICBpZiAoaSA+PSAwKSB0aGlzLnYubGFiZWxzLnNwbGljZShpLCAxKTsgZWxzZSB0aGlzLnYubGFiZWxzLnB1c2gobCk7XG4gICAgICAgICAgICByZW5kZXJMYWJlbHMoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVuZGVyTGFiZWxzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGx3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiTmVuaHVtYSBldGlxdWV0YSBubyBUb2RvaXN0IGFpbmRhLlwiIH0pO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aW9uc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1hY3Rpb25zXCIgfSk7XG4gICAgdGhpcy5yZW5kZXJBY3Rpb25zKCk7XG4gIH1cblxuICBwcml2YXRlIGZpZWxkKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxcIiwgdGV4dDogbGFiZWwgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFjdGlvbnMoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuYWN0aW9uc0VsO1xuICAgIGEuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLmNvbmZpcm1EZWwgJiYgdGhpcy5vcHRzLnJlbW92ZSkge1xuICAgICAgYS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLWNvbmZpcm1cIiwgdGV4dDogXCJFeGNsdWlyIGVzdGEgdGFyZWZhP1wiIH0pO1xuICAgICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgICBjb25zdCB5ZXMgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgeWVzLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHllcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMucmVtb3ZlISgpKSB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGVsc2UgeyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH1cbiAgICAgIH07XG4gICAgICBjb25zdCBubyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgICBuby5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIikge1xuICAgICAgY29uc3QgZGVsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSB0cnVlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICB9XG5cbiAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICBjb25zdCBjYW5jZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgIGNhbmNlbC5vbmNsaWNrID0gKCkgPT4gdGhpcy5jbG9zZSgpO1xuICAgIGNvbnN0IHNhdmUgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJTYWx2YXJcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBzYXZlLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnYuY29udGVudCA9IHRoaXMudi5jb250ZW50LnRyaW0oKTtcbiAgICAgIGlmICghdGhpcy52LmNvbnRlbnQpIHsgbmV3IE5vdGljZShcIkRcdTAwRUEgdW0gdFx1MDBFRHR1bG8gXHUwMEUwIHRhcmVmYS5cIik7IHJldHVybjsgfVxuICAgICAgc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnN1Ym1pdCh0aGlzLnYpKSB0aGlzLmNsb3NlKCk7XG4gICAgICBlbHNlIHNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlIGNvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBXZXJ1c1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgLy8gUHJvamV0b3MgZG8gVG9kb2lzdCAocGFyYSBvcyBkcm9wZG93bnMgZG9zIHBhY290ZXMpLiBCdXNjYWRvcyAxeDsgcXVhbmRvXG4gIC8vIGNoZWdhbSwgcmUtcmVuZGVyaXphIGEgYWJhIHBhcmEgcHJlZW5jaGVyIG9zIHNlbGVjdHMuXG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gfCBudWxsID0gbnVsbDtcbiAgLy8gRXRpcXVldGFzIGRvIFRvZG9pc3QgKGNoaXBzIHBvciBwYWNvdGUpLiBNZXNtYSBlc3RyYXRcdTAwRTlnaWE6IGJ1c2NhIDF4LlxuICBwcml2YXRlIGxhYmVsczogVG9kb2lzdExhYmVsW10gfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGFwcCwgcGx1Z2luKTsgfVxuXG4gIGRpc3BsYXkoKSB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRvIGRhc2hib2FyZFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vZG8gY29tcGFjdG9cIilcbiAgICAgIC5zZXREZXNjKFwiTGF5b3V0IG1haXMgZGVuc28sIGNvbSBtZW5vcyBlc3BhXHUwMEU3YW1lbnRvIGVudHJlIG9zIGVsZW1lbnRvcy5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY29tcGFjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmQgKHZpc2liaWxpZGFkZSArIG9yZGVtKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTZVx1MDBFN1x1MDBGNWVzIGRvIGRhc2hib2FyZFwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkF0aXZlL2Rlc2F0aXZlIGNhZGEgc2VcdTAwRTdcdTAwRTNvIGUgYWp1c3RlIGEgb3JkZW0gZW0gcXVlIGFwYXJlY2VtIG5hIGRhc2hib2FyZC5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IG9yZGVyID0gcGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcjtcbiAgICBvcmRlci5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFNFQ1RJT05fTEFCRUxbaWRdKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy11cFwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBjaW1hXCIpLnNldERpc2FibGVkKGkgPT09IDApXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsIC0xKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy1kb3duXCIpLnNldFRvb2x0aXAoXCJNb3ZlciBwYXJhIGJhaXhvXCIpLnNldERpc2FibGVkKGkgPT09IG9yZGVyLmxlbmd0aCAtIDEpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKFwic2VjOlwiICsgaWQpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgYXdhaXQgcGx1Z2luLnNldEhpZGRlbihcInNlYzpcIiArIGlkLCAhdik7IH0pKTtcbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKVwiIH0pO1xuICAgIGNvbnN0IHRvcEZvbGRlcnMgPSAodGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpLmNoaWxkcmVuXG4gICAgICAuZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgIWMubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgYXMgVEZvbGRlcltdKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgaWYgKCF0b3BGb2xkZXJzLmxlbmd0aCkge1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgZGUgdG9wbyBubyBjb2ZyZS5cIiB9KTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIHRvcEZvbGRlcnMpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShmLm5hbWUpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJWaXNcdTAwRUR2ZWxcIilcbiAgICAgICAgICAuc2V0VmFsdWUoIXBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoZi5wYXRoKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oZi5wYXRoLCAhdik7IH0pKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRm9udGVzIGRhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRm9udGVzIGRvcyBSZWxhdFx1MDBGM3Jpb3NcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJQYXN0YXMgY3VqYXMgbm90YXMgdmlyYW0gY2FyZHMgbm9zIGRpYXMgZGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcyAocG9zaVx1MDBFN1x1MDBFM28gcGVsYSBkYXRhIGRhIG5vdGEpLiBDYWRhIGZvbnRlIHRlbSB1bWEgY29yIHByXHUwMEYzcHJpYS5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNyY3MgPSBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHNyY3MuZm9yRWFjaChzID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShzLnBhdGgpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJBdGl2YVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZShzLm9uKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5vbiA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZENvbG9yUGlja2VyKGMgPT4gY1xuICAgICAgICAgIC5zZXRWYWx1ZShzLmNvbG9yKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5jb2xvciA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwidHJhc2gtMlwiKS5zZXRUb29sdGlwKFwiUmVtb3ZlciBmb250ZVwiKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMgPSBzcmNzLmZpbHRlcih4ID0+IHggIT09IHMpO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlZCA9IG5ldyBTZXQoc3Jjcy5tYXAocyA9PiBzLnBhdGgpKTtcbiAgICBjb25zdCBhdmFpbGFibGUgPSBhbGxGb2xkZXJQYXRocyh0aGlzLmFwcCkuZmlsdGVyKHAgPT4gIXVzZWQuaGFzKHApKTtcbiAgICBpZiAoYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiQWRpY2lvbmFyIGZvbnRlXCIpXG4gICAgICAgIC5zZXREZXNjKFwiRXNjb2xoYSB1bWEgcGFzdGEgZG8gY29mcmUgcGFyYSBhbGltZW50YXIgYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zLlwiKVxuICAgICAgICAuYWRkRHJvcGRvd24oZCA9PiB7XG4gICAgICAgICAgZC5hZGRPcHRpb24oXCJcIiwgXCJFc2NvbGhhIHVtYSBwYXN0YVx1MjAyNlwiKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgYXZhaWxhYmxlKSBkLmFkZE9wdGlvbihwLCBwKTtcbiAgICAgICAgICBkLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgaWYgKCF2KSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IEFDQ0VOVFNbcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5sZW5ndGggJSBBQ0NFTlRTLmxlbmd0aF07XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLnB1c2goeyBwYXRoOiB2LCBjb2xvciwgb246IHRydWUgfSk7XG4gICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhY290ZXMgZGUgdGFyZWZhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYWNvdGVzIGRlIHRhcmVmYXNcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJDb25qdW50b3MgZGUgdGFyZWZhcyBxdWUgdm9jXHUwMEVBIGxhblx1MDBFN2Egbm8gVG9kb2lzdCBjb20gdW0gY2xpcXVlIChuYSBhYmEgVG9kb2lzdCBvdSBubyBkYXNoYm9hcmQpLCB0b2RhcyBjb20gZGF0YSBkZSBob2plLiBVbWEgdGFyZWZhIHBvciBsaW5oYS4gVXNlIEBldGlxdWV0YSBudW1hIGxpbmhhIHBhcmEgYXBsaWNhciB1bWEgZXRpcXVldGEgc1x1MDBGMyBcdTAwRTBxdWVsYSB0YXJlZmEuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29uZmlybWFyIGFudGVzIGRlIGxhblx1MDBFN2FyXCIpXG4gICAgICAuc2V0RGVzYyhcIlBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvIChjb20gYSBsaXN0YSBkZSB0YXJlZmFzKSBhbnRlcyBkZSBjcmlhci4gXFxcIlNlbXByZVxcXCIgY29uZmlybWEgYXRcdTAwRTkgcGFyYSAxIHRhcmVmYSBcdTIwMTQgXHUwMEZBdGlsIHBhcmEgdGVzdGFyOyBkZXBvaXMgbXVkZSBwYXJhIE51bmNhLlwiKVxuICAgICAgLmFkZERyb3Bkb3duKGQgPT4gZFxuICAgICAgICAuYWRkT3B0aW9uKFwiYWx3YXlzXCIsIFwiU2VtcHJlXCIpXG4gICAgICAgIC5hZGRPcHRpb24oXCJtYW55XCIsIFwiU1x1MDBGMyBtdWl0YXMgKD4gNSB0YXJlZmFzKVwiKVxuICAgICAgICAuYWRkT3B0aW9uKFwibmV2ZXJcIiwgXCJOdW5jYVwiKVxuICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA9IHYgYXMgRGFzaFNldHRpbmdzW1wicGFja2FnZUNvbmZpcm1cIl07IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfSkpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBwbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICAvLyBCdXNjYSBwcm9qZXRvcyBlIGV0aXF1ZXRhcyB1bWEgdmV6IChkcm9wZG93bnMgKyBjaGlwcyk7IGFvIGNoZWdhciwgcmUtcmVuZGVyaXphLlxuICAgIGlmICh0b2tlbiAmJiB0aGlzLnByb2plY3RzID09PSBudWxsKSB7XG4gICAgICBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbikudGhlbihwcyA9PiB7IHRoaXMucHJvamVjdHMgPSBwczsgdGhpcy5kaXNwbGF5KCk7IH0pLmNhdGNoKCgpID0+IHsgdGhpcy5wcm9qZWN0cyA9IFtdOyB9KTtcbiAgICB9XG4gICAgaWYgKHRva2VuICYmIHRoaXMubGFiZWxzID09PSBudWxsKSB7XG4gICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLnRoZW4obHMgPT4geyB0aGlzLmxhYmVscyA9IGxzOyB0aGlzLmRpc3BsYXkoKTsgfSkuY2F0Y2goKCkgPT4geyB0aGlzLmxhYmVscyA9IFtdOyB9KTtcbiAgICB9XG5cbiAgICAvLyBQb3BvdmVyIGRlIGV0aXF1ZXRhcyBkZSB1bSBwYWNvdGUgKGNoaXBzIHRvZ2dsZSBjb20gYSBjb3IgZG8gVG9kb2lzdCkuXG4gICAgY29uc3Qgb3BlbkxhYmVsc1BvcG92ZXIgPSAoYW5jaG9yOiBIVE1MRWxlbWVudCwgcGtnOiBUYXNrUGFja2FnZSwgcmVmcmVzaDogKCkgPT4gdm9pZCkgPT5cbiAgICAgIG9wZW5Qb3BvdmVyKGFuY2hvciwgYm9keSA9PiB7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC10aXRsZVwiLCB0ZXh0OiBcIkV0aXF1ZXRhcyBkbyBwYWNvdGVcIiB9KTtcbiAgICAgICAgaWYgKCF0b2tlbikgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdC5cIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGlmICh0aGlzLmxhYmVscyA9PT0gbnVsbCkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ2FycmVnYW5kb1x1MjAyNlwiIH0pOyByZXR1cm47IH1cbiAgICAgICAgaWYgKCF0aGlzLmxhYmVscy5sZW5ndGgpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIk5lbmh1bWEgZXRpcXVldGEgbm8gVG9kb2lzdC5cIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGNvbnN0IGNoaXBzID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLWNoaXBzXCIgfSk7XG4gICAgICAgIGNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICBjaGlwcy5lbXB0eSgpO1xuICAgICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmxhYmVscyEpIHtcbiAgICAgICAgICAgIGNvbnN0IG9uID0gKHBrZy5sYWJlbHMgPz8gW10pLmluY2x1ZGVzKGwubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBjaGlwID0gY2hpcHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLO1xuICAgICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2wubmFtZX1gIH0pO1xuICAgICAgICAgICAgY2hpcC5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjdXIgPSBwa2cubGFiZWxzID8/IFtdO1xuICAgICAgICAgICAgICBjb25zdCBpID0gY3VyLmluZGV4T2YobC5uYW1lKTtcbiAgICAgICAgICAgICAgaWYgKGkgPj0gMCkgY3VyLnNwbGljZShpLCAxKTsgZWxzZSBjdXIucHVzaChsLm5hbWUpO1xuICAgICAgICAgICAgICBwa2cubGFiZWxzID0gY3VyLmxlbmd0aCA/IGN1ciA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LCB7IGNsczogXCJ3ZC1wb3AtbGFiZWxzXCIgfSk7XG5cbiAgICAvLyBQb3BvdmVyIGRlIHRhcmVmYXMgZGUgdW0gcGFjb3RlICh0ZXh0YXJlYTsgcGVyc2lzdGUgbm8gaW5wdXQgZSBhbyBmZWNoYXIpLlxuICAgIGNvbnN0IG9wZW5UYXNrc1BvcG92ZXIgPSAoYW5jaG9yOiBIVE1MRWxlbWVudCwgcGtnOiBUYXNrUGFja2FnZSwgcmVmcmVzaDogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgbGV0IHRhOiBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgICAgb3BlblBvcG92ZXIoYW5jaG9yLCBib2R5ID0+IHtcbiAgICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLXRpdGxlXCIsIHRleHQ6IFwiVGFyZWZhcyBkbyBwYWNvdGVcIiB9KTtcbiAgICAgICAgdGEgPSBib2R5LmNyZWF0ZUVsKFwidGV4dGFyZWFcIiwgeyBjbHM6IFwid2QtcGtnLXRhc2tzXCIgfSk7XG4gICAgICAgIHRhLnZhbHVlID0gcGtnLnRhc2tzLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIHRhLnBsYWNlaG9sZGVyID0gXCJVbWEgdGFyZWZhIHBvciBsaW5oYSAoZXguOiBCZWJlciBcdTAwRTFndWEpXCI7XG4gICAgICAgIHRhLnJvd3MgPSA2O1xuICAgICAgICB0YS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHBrZy50YXNrcyA9IHRhLnZhbHVlLnNwbGl0KFwiXFxuXCIpLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWhpbnRcIiwgdGV4dDogXCJVbWEgcG9yIGxpbmhhIFx1MDBCNyBAZXRpcXVldGEgbWFyY2Egc1x1MDBGMyBhcXVlbGEgdGFyZWZhIFx1MDBCNyBmZWNoYSBhbyBjbGljYXIgZm9yYSBvdSBFc2MuXCIgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGEuZm9jdXMoKSwgMCk7XG4gICAgICB9LCB7IGNsczogXCJ3ZC1wb3AtdGFza3NcIiwgd2lkdGg6IDMyMCwgb25DbG9zZTogKCkgPT4geyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IH0gfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBrZ3MgPSBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzO1xuICAgIGNvbnN0IGxpc3QgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWxpc3RcIiB9KTtcbiAgICBwa2dzLmZvckVhY2goKHBrZywgaWR4KSA9PiB7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctcm93XCIgfSk7XG5cbiAgICAgIC8vIFx1MDBDRGNvbmUgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIgZGUgcGFsZXRhKS5cbiAgICAgIGNvbnN0IGljb25CdG4gPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbnRyaWdnZXJcIiB9KTtcbiAgICAgIGljb25CdG4uc2V0QXR0cihcInRpdGxlXCIsIFwiXHUwMENEY29uZSBkbyBwYWNvdGVcIik7XG4gICAgICBjb25zdCBmaWxsSWNvbiA9ICgpID0+IHtcbiAgICAgICAgaWNvbkJ0bi5lbXB0eSgpO1xuICAgICAgICBpZiAocGtnLmljb24pIHJlbmRlckljb24oaWNvbkJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29cIiB9KSwgcGtnLmljb24pO1xuICAgICAgICBlbHNlIGljb25CdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvLWVtcHR5XCIsIHRleHQ6IFwiK1wiIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxJY29uKCk7XG4gICAgICBpY29uQnRuLm9uY2xpY2sgPSAoKSA9PiBvcGVuSWNvblBvcG92ZXIoaWNvbkJ0biwgcGtnLmljb24sIGFzeW5jIGljID0+IHtcbiAgICAgICAgcGtnLmljb24gPSBpYzsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IGZpbGxJY29uKCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gTm9tZS5cbiAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IGNsczogXCJ3ZC1wa2ctbmFtZS1pbnB1dFwiLCBhdHRyOiB7IHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJOb21lIGRvIHBhY290ZVwiIH0gfSk7XG4gICAgICBuYW1lLnZhbHVlID0gcGtnLm5hbWU7XG4gICAgICBuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBhc3luYyAoKSA9PiB7IHBrZy5uYW1lID0gbmFtZS52YWx1ZTsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9KTtcbiAgICAgIG5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCkpO1xuXG4gICAgICAvLyBQcm9qZXRvLlxuICAgICAgY29uc3QgcHJvaiA9IHJvdy5jcmVhdGVFbChcInNlbGVjdFwiLCB7IGNsczogXCJ3ZC1wa2ctcHJvaiBkcm9wZG93blwiIH0pO1xuICAgICAgY29uc3QgYWRkT3B0ID0gKHY6IHN0cmluZywgdDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IG8gPSBwcm9qLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogdCwgdmFsdWU6IHYgfSk7XG4gICAgICAgIGlmICgocGtnLnByb2plY3RJZCA/PyBcIlwiKSA9PT0gdikgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9O1xuICAgICAgYWRkT3B0KFwiXCIsIFwiRW50cmFkYVwiKTtcbiAgICAgIGZvciAoY29uc3QgcCBvZiAodGhpcy5wcm9qZWN0cyA/PyBbXSkpIGFkZE9wdChwLmlkLCBwLm5hbWUpO1xuICAgICAgcHJvai5vbmNoYW5nZSA9IGFzeW5jICgpID0+IHsgcGtnLnByb2plY3RJZCA9IHByb2oudmFsdWUgfHwgdW5kZWZpbmVkOyBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7IH07XG5cbiAgICAgIC8vIEV0aXF1ZXRhcyAoYm90XHUwMEUzbyBcdTIxOTIgcG9wb3ZlcikuXG4gICAgICBjb25zdCBsYmxCdG4gPSByb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtcGtnLWNoaXAtYnRuXCIgfSk7XG4gICAgICBjb25zdCBmaWxsTGJsID0gKCkgPT4ge1xuICAgICAgICBsYmxCdG4uZW1wdHkoKTtcbiAgICAgICAgc2V0SWNvbihsYmxCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctYnRuLWljb1wiIH0pLCBcInRhZ1wiKTtcbiAgICAgICAgbGJsQnRuLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIkV0aXF1ZXRhc1wiIH0pO1xuICAgICAgICBjb25zdCBuID0gcGtnLmxhYmVscz8ubGVuZ3RoID8/IDA7XG4gICAgICAgIGlmIChuKSBsYmxCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogU3RyaW5nKG4pIH0pO1xuICAgICAgfTtcbiAgICAgIGZpbGxMYmwoKTtcbiAgICAgIGxibEJ0bi5vbmNsaWNrID0gKCkgPT4gb3BlbkxhYmVsc1BvcG92ZXIobGJsQnRuLCBwa2csIGZpbGxMYmwpO1xuXG4gICAgICAvLyBUYXJlZmFzIChib3RcdTAwRTNvIFx1MjE5MiBwb3BvdmVyKS5cbiAgICAgIGNvbnN0IHRhc2tCdG4gPSByb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtcGtnLWNoaXAtYnRuXCIgfSk7XG4gICAgICBjb25zdCBmaWxsVGFzayA9ICgpID0+IHtcbiAgICAgICAgdGFza0J0bi5lbXB0eSgpO1xuICAgICAgICBzZXRJY29uKHRhc2tCdG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctYnRuLWljb1wiIH0pLCBcImxpc3RcIik7XG4gICAgICAgIHRhc2tCdG4uY3JlYXRlU3Bhbih7IHRleHQ6IFwiVGFyZWZhc1wiIH0pO1xuICAgICAgICBjb25zdCBuID0gcGtnLnRhc2tzLmZpbHRlcihzID0+IHMudHJpbSgpKS5sZW5ndGg7XG4gICAgICAgIGlmIChuKSB0YXNrQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IFN0cmluZyhuKSB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsVGFzaygpO1xuICAgICAgdGFza0J0bi5vbmNsaWNrID0gKCkgPT4gb3BlblRhc2tzUG9wb3Zlcih0YXNrQnRuLCBwa2csIGZpbGxUYXNrKTtcblxuICAgICAgLy8gUmVvcmRlbmFyIC8gcmVtb3Zlci5cbiAgICAgIGNvbnN0IHVwID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW1pbmlcIiArIChpZHggPT09IDAgPyBcIiB3ZC1kaXNhYmxlZFwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKHVwLCBcImNoZXZyb24tdXBcIik7IHVwLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHBhcmEgY2ltYVwiKTtcbiAgICAgIGlmIChpZHggPiAwKSB1cC5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVBhY2thZ2UoaWR4LCAtMSk7IHRoaXMuZGlzcGxheSgpOyB9O1xuICAgICAgY29uc3QgZG93biA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1taW5pXCIgKyAoaWR4ID09PSBwa2dzLmxlbmd0aCAtIDEgPyBcIiB3ZC1kaXNhYmxlZFwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKGRvd24sIFwiY2hldnJvbi1kb3duXCIpOyBkb3duLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHBhcmEgYmFpeG9cIik7XG4gICAgICBpZiAoaWR4IDwgcGtncy5sZW5ndGggLSAxKSBkb3duLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlUGFja2FnZShpZHgsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH07XG4gICAgICBjb25zdCBkZWwgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctbWluaSB3ZC1wa2ctZGVsXCIgfSk7XG4gICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpOyBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiUmVtb3ZlciBwYWNvdGVcIik7XG4gICAgICBkZWwub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcyA9IHBrZ3MuZmlsdGVyKHggPT4geCAhPT0gcGtnKTtcbiAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBZGljaW9uYXIgcGFjb3RlXCIpXG4gICAgICAuYWRkQnV0dG9uKGIgPT4gYlxuICAgICAgICAuc2V0QnV0dG9uVGV4dChcIisgTm92byBwYWNvdGVcIilcbiAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXMucHVzaCh7IGlkOiB1aWQoKSwgbmFtZTogXCJOb3ZvIHBhY290ZVwiLCB0YXNrczogW10gfSk7XG4gICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJJbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9rZW4gZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIlRvZG9pc3QgXHUyMTkyIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBJbnRlZ3JhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFRva2VuIGRlIEFQSSBkbyBkZXNlbnZvbHZlZG9yLiBTYWx2byBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIG8gdG9rZW4gYXF1aVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRhcyB0YXJlZmFzXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBvIHByb2pldG8gbmFzIGxpbmhhc1wiKVxuICAgICAgLnNldERlc2MoXCJFeGliZSBvIG5vbWUgZG8gcHJvamV0byBhbyBsYWRvIGRlIGNhZGEgdGFyZWZhLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgYXMgQGV0aXF1ZXRhcyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzbyAoU3luY3RoaW5nKVwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkVzdGFzIGNyZWRlbmNpYWlzIHNcdTAwRTNvIGd1YXJkYWRhcyBwb3IgZGlzcG9zaXRpdm8gKGxvY2FsU3RvcmFnZSkgXHUyMDE0IGNhZGEgbVx1MDBFMXF1aW5hIHRlbSBhIHN1YSBlIGVsYXMgblx1MDBFM28gc2luY3Jvbml6YW0gcGVsbyBTeW5jdGhpbmcgbmVtIHZcdTAwRTNvIHBhcmEgbyBHaXQuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVVJMIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJFbmRlcmVcdTAwRTdvIGRvIFN5bmN0aGluZy4gUGFkclx1MDBFM286IGh0dHA6Ly8xMjcuMC4wLjE6ODM4NCAoYSBpbnN0XHUwMEUybmNpYSBsb2NhbCkuIE5vIGNlbHVsYXIsIGFwb250ZSBwYXJhIGEgQVBJIGRlIG91dHJhIG1cdTAwRTFxdWluYSBuYSByZWRlIHNlIGEgbG9jYWwgblx1MDBFM28gcmVzcG9uZGVyLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nVXJsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybCA9IHYudHJpbSgpIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQVBJIGtleVwiKVxuICAgICAgLnNldERlc2MoXCJTeW5jdGhpbmcgXHUyMTkyIEFjdGlvbnMgXHUyMTkyIFNldHRpbmdzIFx1MjE5MiBBUEkgS2V5LiBHdWFyZGFkYSBwb3IgZGlzcG9zaXRpdm8gKGxvY2FsU3RvcmFnZSksIG5cdTAwRTNvIHZhaSBwYXJhIG8gZGF0YS5qc29uL0dpdC5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBhIEFQSSBrZXlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJRCBkYSBwYXN0YSAob3BjaW9uYWwpXCIpXG4gICAgICAuc2V0RGVzYyhcIkZvbGRlciBJRCBkbyBjb2ZyZSBubyBTeW5jdGhpbmcuIFZhemlvID0gdXNhIGEgcHJpbWVpcmEgcGFzdGEgYXV0b21hdGljYW1lbnRlLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJleC46IG51bnF2LW10aW1uXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hTeW5jKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9zdHJhciBjb250YWdlbSBkZSBpdGVucyBwb3IgYXBhcmVsaG9cIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgXFxcInNpbmNyb25pemFkb3MgLyB0b3RhbFxcXCIgZGUgaXRlbnMgZW0gY2FkYSBhcGFyZWxobywgYWxcdTAwRTltIGRhIHBvcmNlbnRhZ2VtLlwiKVxuICAgICAgLmFkZFRvZ2dsZSh0ID0+IHRcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1Nob3dDb3VudHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID0gdjtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICB9KSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUEySztBQUUzSyxJQUFNLFlBQVk7QUFDbEIsSUFBTSxvQkFBb0I7QUFLMUIsSUFBTSxZQUFZO0FBQ2xCLElBQU0sWUFBWTtBQUNsQixJQUFNLGVBQWU7QUFDckIsSUFBTSxnQkFBZ0I7QUFDdEIsSUFBTSxXQUFXLElBQUksS0FB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
