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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuY29uc3QgVE9ET0lTVF9WSUVXX1RZUEUgPSBcIndlcnVzLXRvZG9pc3RcIjtcblxuLy8gQ2hhdmVzIGRvIGxvY2FsU3RvcmFnZSAoUE9SLURJU1BPU0lUSVZPLCBuXHUwMEUzbyBzaW5jcm9uaXphbSk6IGNyZWRlbmNpYWlzIGRvXG4vLyBTeW5jdGhpbmcuIEZpY2FtIGZvcmEgZG8gZGF0YS5qc29uIHBvcnF1ZSBhIEFQSSBrZXkvVVJMIHNcdTAwRTNvIGRlIGNhZGEgbVx1MDBFMXF1aW5hXG4vLyAobyBkYXRhLmpzb24gdmlhamEgcGVsbyBTeW5jdGhpbmcgXHUyMTkyIGEga2V5IGRlIHVtYSBkYXJpYSA0MDMgbmEgb3V0cmEpLlxuY29uc3QgTFNfU1RfVVJMID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6c3luY3RoaW5nVXJsXCI7XG5jb25zdCBMU19TVF9LRVkgPSBcIndlcnVzLWRhc2hib2FyZDpzeW5jdGhpbmdBcGlLZXlcIjtcbmNvbnN0IExTX1NUX0ZPTERFUiA9IFwid2VydXMtZGFzaGJvYXJkOnN5bmN0aGluZ0ZvbGRlcklkXCI7XG5jb25zdCBMU19UT0RPX0NBQ0hFID0gXCJ3ZXJ1cy1kYXNoYm9hcmQ6dG9kb2lzdENhY2hlXCI7ICAgLy8gY2FjaGUgb2ZmbGluZSBkbyBUb2RvaXN0IChwb3ItZGlzcG9zaXRpdm8pXG5jb25zdCBUT0RPX1RUTCA9IDUgKiA2MCAqIDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZGFkZSBtXHUwMEUxeC4gZG8gY2FjaGUgYW50ZXMgZGUgcmUtYnVzY2FyICg1IG1pbilcbmNvbnN0IFRPRE9fTUFYX1BBR0VTID0gNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRldG8gZGUgcFx1MDBFMWdpbmFzIHBhZ2luYWRhcyAoYW50aS1sb29wIHNlIGEgQVBJIHJlcGV0aXIgbyBjdXJzb3IpXG5cbi8vIHVpZCBjdXJ0byBlIGVzdFx1MDBFMXZlbCAocGFjb3RlcyBkZSB0YXJlZmFzKS5cbmZ1bmN0aW9uIHVpZCgpOiBzdHJpbmcge1xuICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KTtcbn1cblxudHlwZSBTdGF0dXMgPSBcInByb2dyZXNzXCIgfCBcInBhdXNlZFwiIHwgXCJjYW5jZWxsZWRcIjtcbnR5cGUgU2VjdGlvbklkID0gXCJjYWxlbmRhclwiIHwgXCJwYXJhXCIgfCBcImhlYXRtYXBcIiB8IFwiZ3Jvd3RoXCIgfCBcInN0YXRzXCIgfCBcInRvZG9pc3RcIiB8IFwic3luY1wiO1xuXG5pbnRlcmZhY2UgVG9kb2lzdEZpbHRlcnMge1xuICBwcm9qZWN0czogc3RyaW5nW107ICAgLy8gaWRzIGRlIHByb2pldG8gc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZG9zKVxuICBsYWJlbHM6IHN0cmluZ1tdOyAgICAgLy8gbm9tZXMgZGUgZXRpcXVldGEgc2VsZWNpb25hZG9zICh2YXppbyA9IHRvZGFzKVxufVxuXG4vLyBGb250ZSBkZSBjYXJkcyBkYSBTZW1hbmE6IHVtYSBwYXN0YSBkbyBjb2ZyZSArIGNvciArIHNlIGVzdFx1MDBFMSB2aXNcdTAwRUR2ZWwuXG4vLyBBcyBub3RhcyBkZW50cm8gZGVsYSBhcGFyZWNlbSBub3MgZGlhcyBkbyBjYWxlbmRcdTAwRTFyaW8gKHBvc2lcdTAwRTdcdTAwRTNvIHBlbG8gYGRhdGU6YCkuXG5pbnRlcmZhY2UgQ2FsU291cmNlIHtcbiAgcGF0aDogc3RyaW5nOyAgICAvLyBjYW1pbmhvIGRhIHBhc3RhIChleC46IFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpXG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gY29yIGRvIGluZGljYWRvciBkYSBmb250ZVxuICBvbjogYm9vbGVhbjsgICAgIC8vIG1hcmNhZGEgPSBhcGFyZWNlIG5hIHNlbWFuYVxufVxuXG4vLyBQYWNvdGUgZGUgdGFyZWZhczogdW0gY29uanVudG8gbm9tZWFkbyBkZSB0YXJlZmFzIHF1ZSBzZSBsYW5cdTAwRTdhIG5vIFRvZG9pc3Rcbi8vIG51bSBjbGlxdWUgKG5hIGFiYSBUb2RvaXN0KSwgdG9kYXMgY29tIGRhdGEgZGUgaG9qZS5cbmludGVyZmFjZSBUYXNrUGFja2FnZSB7XG4gIGlkOiBzdHJpbmc7ICAgICAgICAgICAgLy8gdWlkIGVzdFx1MDBFMXZlbFxuICBuYW1lOiBzdHJpbmc7ICAgICAgICAgIC8vIFwiTWFuaFx1MDBFM1wiXG4gIGljb24/OiBzdHJpbmc7ICAgICAgICAgLy8gbHVjaWRlL2Vtb2ppIG9wY2lvbmFsXG4gIHRhc2tzOiBzdHJpbmdbXTsgICAgICAgLy8gY29udGVcdTAwRkFkb3MgZGFzIHRhcmVmYXMgKDEgcG9yIGxpbmhhKVxuICBwcm9qZWN0SWQ/OiBzdHJpbmc7ICAgIC8vIHByb2pldG8gcGFkclx1MDBFM28gKHZhemlvID0gRW50cmFkYS9JbmJveClcbiAgbGFiZWxzPzogc3RyaW5nW107ICAgICAvLyBldGlxdWV0YXMgcGFkclx1MDBFM28gKG9wY2lvbmFsKVxufVxuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOmhlYXRtYXBcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbiAgY2FsZW5kYXJTb3VyY2VzOiBDYWxTb3VyY2VbXTsgICAvLyBmb250ZXMgKHBhc3RhcykgcXVlIGFsaW1lbnRhbSBvcyBjYXJkcyBkYSBTZW1hbmFcbiAgdG9kb2lzdFRva2VuOiBzdHJpbmc7XG4gIHRvZG9pc3REYXlSYW5nZTogMyB8IDc7ICAgICAgICAvLyBxdWFudG9zIFwicHJcdTAwRjN4aW1vcyBkaWFzXCIgbW9zdHJhciBuYSBncmFkZVxuICB0b2RvaXN0RmlsdGVyczogVG9kb2lzdEZpbHRlcnM7XG4gIHRvZG9pc3RTaG93UHJvamVjdDogYm9vbGVhbjsgICAvLyBtb3N0cmFyIG8gbm9tZSBkbyBwcm9qZXRvIG5hcyBsaW5oYXNcbiAgdG9kb2lzdFNob3dMYWJlbHM6IGJvb2xlYW47ICAgIC8vIG1vc3RyYXIgYXMgZXRpcXVldGFzIG5hcyBsaW5oYXNcbiAgc3luY3RoaW5nVXJsOiBzdHJpbmc7ICAgICAgICAgIC8vIGJhc2UgZGEgQVBJIFJFU1QgZG8gU3luY3RoaW5nXG4gIHN5bmN0aGluZ0FwaUtleTogc3RyaW5nOyAgICAgICAvLyBYLUFQSS1LZXkgKGZvcmEgZG8gR2l0KVxuICBzeW5jdGhpbmdGb2xkZXJJZDogc3RyaW5nOyAgICAgLy8gaWQgZGEgcGFzdGE7IHZhemlvID0gYXV0b2RldGVjdGFcbiAgc3luY3RoaW5nU2hvd0NvdW50czogYm9vbGVhbjsgIC8vIG1vc3RyYXIgXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcIiBkZSBpdGVucyBwb3IgYXBhcmVsaG9cbiAgdGFza1BhY2thZ2VzOiBUYXNrUGFja2FnZVtdOyAgIC8vIHBhY290ZXMgZGUgdGFyZWZhcyAobGFuXHUwMEU3YXIgbm8gVG9kb2lzdClcbiAgcGFja2FnZUNvbmZpcm06IFwiYWx3YXlzXCIgfCBcIm1hbnlcIiB8IFwibmV2ZXJcIjsgICAvLyBxdWFuZG8gcGVkaXIgY29uZmlybWFcdTAwRTdcdTAwRTNvIGFvIGxhblx1MDBFN2FyXG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhc2hTZXR0aW5ncyA9IHtcbiAgc2VjdGlvbk9yZGVyOiBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwic3luY1wiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJjYWxlbmRhclwiXSxcbiAgY29tcGFjdDogZmFsc2UsXG4gIGhpZGRlbjogW10sXG4gIG5vdGVWaWV3OiBcImxpc3RcIixcbiAgY2FsZW5kYXJTb3VyY2VzOiBbXG4gICAgeyBwYXRoOiBcIjQwLkFyY2hpdmUvUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiLCBjb2xvcjogXCIjM0I4MkY2XCIsIG9uOiB0cnVlIH0sXG4gICAgeyBwYXRoOiBcIjUwLkRpXHUwMEUxcmlvXCIsICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMTBCOTgxXCIsIG9uOiB0cnVlIH0sXG4gIF0sXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbiAgdG9kb2lzdERheVJhbmdlOiA3LFxuICB0b2RvaXN0RmlsdGVyczogeyBwcm9qZWN0czogW10sIGxhYmVsczogW10gfSxcbiAgdG9kb2lzdFNob3dQcm9qZWN0OiB0cnVlLFxuICB0b2RvaXN0U2hvd0xhYmVsczogZmFsc2UsXG4gIHN5bmN0aGluZ1VybDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIixcbiAgc3luY3RoaW5nQXBpS2V5OiBcIlwiLFxuICBzeW5jdGhpbmdGb2xkZXJJZDogXCJcIixcbiAgc3luY3RoaW5nU2hvd0NvdW50czogZmFsc2UsXG4gIHRhc2tQYWNrYWdlczogW10sXG4gIHBhY2thZ2VDb25maXJtOiBcIm1hbnlcIixcbn07XG5cbmludGVyZmFjZSBQYXJhU2VjdGlvbiB7XG4gIGZvbGRlcjogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGFjY2VudDogc3RyaW5nO1xufVxuXG4vLyBQYXN0YXMgXCJjb25oZWNpZGFzXCIgZG8gUEFSQTogbWFudFx1MDBFQW0gXHUwMEVEY29uZSwgclx1MDBGM3R1bG8gZSBjb3IgZml4b3MuIEFzIGRlbWFpcyBwYXN0YXNcbi8vIGRvIGNvZnJlIHNcdTAwRTNvIHJlbmRlcml6YWRhcyBjb20gY29yIGF1dG9tXHUwMEUxdGljYSBlIFx1MDBFRGNvbmUgcGFkclx1MDBFM28gKG91IG8gaWNvbjogZG8gc3RhdHVzLm1kKS5cbmNvbnN0IFBBUkE6IFBhcmFTZWN0aW9uW10gPSBbXG4gIHsgZm9sZGVyOiBcIjAwLkluYm94XCIsICAgICBpY29uOiBcIlx1RDgzRFx1RENFNVwiLCBsYWJlbDogXCJJbmJveFwiLCAgICBhY2NlbnQ6IFwiIzYzNjZGMVwiIH0sXG4gIHsgZm9sZGVyOiBcIjEwLlByb2plY3RzXCIsICBpY29uOiBcIlx1RDgzRFx1REU4MFwiLCBsYWJlbDogXCJQcm9qZXRvc1wiLCBhY2NlbnQ6IFwiIzEwQjk4MVwiIH0sXG4gIHsgZm9sZGVyOiBcIjIwLkFyZWFzXCIsICAgICBpY29uOiBcIlx1RDgzQ1x1REZBRlwiLCBsYWJlbDogXCJcdTAwQzFyZWFzXCIsICAgIGFjY2VudDogXCIjRjU5RTBCXCIgfSxcbiAgeyBmb2xkZXI6IFwiMzAuUmVzb3VyY2VzXCIsIGljb246IFwiXHVEODNEXHVEQ0RBXCIsIGxhYmVsOiBcIlJlY3Vyc29zXCIsIGFjY2VudDogXCIjM0I4MkY2XCIgfSxcbiAgeyBmb2xkZXI6IFwiNDAuQXJjaGl2ZVwiLCAgIGljb246IFwiXHVEODNEXHVEREM0XHVGRTBGXCIsICBsYWJlbDogXCJBcnF1aXZvXCIsICBhY2NlbnQ6IFwiIzZCNzI4MFwiIH0sXG5dO1xuY29uc3QgUEFSQV9NQVAgPSBuZXcgTWFwKFBBUkEubWFwKHAgPT4gW3AuZm9sZGVyLCBwXSkpO1xuXG4vLyBQYWxldGEgcGFyYSBjb2xvcmlyIHBhc3RhcyBkZXNjb25oZWNpZGFzIGRlIGZvcm1hIGVzdFx1MDBFMXZlbCAocG9yIGhhc2ggZG8gbm9tZSkuXG5jb25zdCBBQ0NFTlRTID0gW1wiIzYzNjZGMVwiLFwiIzEwQjk4MVwiLFwiI0Y1OUUwQlwiLFwiIzNCODJGNlwiLFwiI0VDNDg5OVwiLFwiIzhCNUNGNlwiLFwiIzE0QjhBNlwiLFwiI0VGNDQ0NFwiXTtcblxuY29uc3QgREFZX1NIT1JUID0gW1wiU2VnXCIsIFwiVGVyXCIsIFwiUXVhXCIsIFwiUXVpXCIsIFwiU2V4XCIsIFwiU1x1MDBFMWJcIiwgXCJEb21cIl07XG5jb25zdCBNT05USF9TSE9SVCA9IFtcIkphblwiLFwiRmV2XCIsXCJNYXJcIixcIkFiclwiLFwiTWFpXCIsXCJKdW5cIixcIkp1bFwiLFwiQWdvXCIsXCJTZXRcIixcIk91dFwiLFwiTm92XCIsXCJEZXpcIl07XG5jb25zdCBJTUdfRVhUID0gW1wicG5nXCIsXCJqcGdcIixcImpwZWdcIixcIndlYnBcIixcImdpZlwiLFwic3ZnXCJdO1xuXG4vLyBQYXN0YSByYWl6IGRhcyBub3RhcyBkaVx1MDBFMXJpYXMgKGNyaWFkYXMgYW8gY2xpY2FyIG51bSBkaWEgZG8gY2FsZW5kXHUwMEUxcmlvKS5cbmNvbnN0IERBSUxZX0ZPTERFUiA9IFwiNTAuRGlcdTAwRTFyaW9cIjtcbi8vIFRlbXBsYXRlIG9wY2lvbmFsOyBwbGFjZWhvbGRlcnMge3tkYXRlfX0gKFlZWVktTU0tREQpIGUge3t0aXRsZX19IChkYXRhIHBvciBleHRlbnNvKS5cbmNvbnN0IERBSUxZX1RFTVBMQVRFID0gXCJNb2RlbG9zL05vdGEgRGlcdTAwRTFyaWEubWRcIjtcblxuY29uc3QgU1RBVFVTX0lDT046IFJlY29yZDxTdGF0dXMsIHN0cmluZz4gPSB7XG4gIHByb2dyZXNzOiBcIlx1MjVCNlwiLCBwYXVzZWQ6IFwiXHUyM0Y4XCIsIGNhbmNlbGxlZDogXCJcdTI3MTVcIixcbn07XG5cbmNvbnN0IFNFQ19DQUwgPSBcInNlYzpjYWxlbmRhclwiO1xuY29uc3QgU0VDX1BBUkEgPSBcInNlYzpwYXJhXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5jb25zdCBTRUNfVE9ETyA9IFwic2VjOnRvZG9pc3RcIjtcbmNvbnN0IFNFQ19TWU5DID0gXCJzZWM6c3luY1wiO1xuXG4vLyBSXHUwMEYzdHVsb3MgYW1pZ1x1MDBFMXZlaXMgZGFzIHNlXHUwMEU3XHUwMEY1ZXMgKHVzYWRvcyBuYSBhYmEgZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpLlxuY29uc3QgU0VDVElPTl9MQUJFTDogUmVjb3JkPFNlY3Rpb25JZCwgc3RyaW5nPiA9IHtcbiAgc3RhdHM6ICAgIFwiRXN0YXRcdTAwRURzdGljYXNcIixcbiAgdG9kb2lzdDogIFwiVGFyZWZhc1wiLFxuICBwYXJhOiAgICAgXCJDb2ZyZSAocGFzdGFzKVwiLFxuICBzeW5jOiAgICAgXCJTaW5jcm9uaXphXHUwMEU3XHUwMEUzb1wiLFxuICBoZWF0bWFwOiAgXCJBdGl2aWRhZGUgZG8gY29mcmVcIixcbiAgZ3Jvd3RoOiAgIFwiQ3Jlc2NpbWVudG8gZG8gY29mcmVcIixcbiAgY2FsZW5kYXI6IFwiUmVsYXRcdTAwRjNyaW9zXCIsXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRvZG9pc3RUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEk6IDEuLjQsIG9uZGUgNCA9IHVyZ2VudGUgKD0gcDEgbmEgVUkpXG4gIGR1ZT86IHsgZGF0ZTogc3RyaW5nOyBkYXRldGltZT86IHN0cmluZzsgc3RyaW5nPzogc3RyaW5nOyBpc19yZWN1cnJpbmc/OiBib29sZWFuIH0gfCBudWxsO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xuICBpc19jb21wbGV0ZWQ/OiBib29sZWFuO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gUGFsZXRhIG5vbWVhZGEgZG8gVG9kb2lzdCBcdTIxOTIgaGV4IChwYXJhIGNvbG9yaXIgYXMgZXRpcXVldGFzIGNvbW8gbm8gYXBwKS5cbmNvbnN0IFRPRE9JU1RfQ09MT1JTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBiZXJyeV9yZWQ6IFwiI0I4MjU1RlwiLCByZWQ6IFwiI0RCNDAzNVwiLCBvcmFuZ2U6IFwiI0ZGOTkzM1wiLCB5ZWxsb3c6IFwiI0ZBRDAwMFwiLFxuICBvbGl2ZV9ncmVlbjogXCIjQUZCODNCXCIsIGxpbWVfZ3JlZW46IFwiIzdFQ0M0OVwiLCBncmVlbjogXCIjMjk5NDM4XCIsIG1pbnRfZ3JlZW46IFwiIzZBQ0NCQ1wiLFxuICB0ZWFsOiBcIiMxNThGQURcIiwgc2t5X2JsdWU6IFwiIzE0QUFGNVwiLCBsaWdodF9ibHVlOiBcIiM5NkMzRUJcIiwgYmx1ZTogXCIjNDA3M0ZGXCIsXG4gIGdyYXBlOiBcIiM4ODRERkZcIiwgdmlvbGV0OiBcIiNBRjM4RUJcIiwgbGF2ZW5kZXI6IFwiI0VCOTZFQlwiLCBtYWdlbnRhOiBcIiNFMDUxOTRcIixcbiAgc2FsbW9uOiBcIiNGRjhEODVcIiwgY2hhcmNvYWw6IFwiIzgwODA4MFwiLCBncmV5OiBcIiNCOEI4QjhcIiwgdGF1cGU6IFwiI0NDQUM5M1wiLFxufTtcbmNvbnN0IExBQkVMX0ZBTExCQUNLID0gXCIjQjhCOEI4XCI7XG4vLyBObyBtb2RvIFwibWFueVwiLCBsYW5cdTAwRTdhciBtYWlzIHF1ZSBpc3RvIHBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvLlxuY29uc3QgTEFVTkNIX0NPTkZJUk1fTUlOID0gNTtcblxuLy8gXHUwMENEY29uZXMgc3VnZXJpZG9zIHBhcmEgb3MgcGFjb3RlcyAobm9tZXMgTHVjaWRlOyByZW5kZXJpemFkb3MgcG9yIHJlbmRlckljb24pLlxuY29uc3QgUEtHX0lDT05TID0gW1xuICBcInN1bnJpc2VcIiwgXCJzdW5cIiwgXCJzdW5zZXRcIiwgXCJtb29uXCIsIFwiY29mZmVlXCIsIFwidXRlbnNpbHNcIiwgXCJkdW1iYmVsbFwiLCBcImJvb2stb3BlblwiLFxuICBcImJyaWVmY2FzZVwiLCBcImdyYWR1YXRpb24tY2FwXCIsIFwiaG9tZVwiLCBcInNob3BwaW5nLWNhcnRcIiwgXCJoZWFydFwiLCBcImRyb3BsZXRcIiwgXCJwaWxsXCIsXG4gIFwiYmVkXCIsIFwiY2xvY2tcIiwgXCJjYWxlbmRhclwiLCBcImNoZWNrLWNoZWNrXCIsIFwibGlzdC1jaGVja3NcIiwgXCJ0YXJnZXRcIiwgXCJmbGFtZVwiLCBcInphcFwiLFxuICBcInN0YXJcIiwgXCJzcGFya2xlc1wiLCBcInJvY2tldFwiLCBcImJydXNoXCIsIFwibXVzaWNcIiwgXCJnYW1lcGFkLTJcIiwgXCJkb2dcIixcbl07XG5cbi8vIFNlcGFyYSBhcyBldGlxdWV0YXMgaW5saW5lIChAZXRpcXVldGEpIGRvIHRleHRvIGRlIHVtYSBsaW5oYSBkZSB0YXJlZmEuXG4vLyBEZXZvbHZlIG8gdFx1MDBFRHR1bG8gbGltcG8gKGVzdGlsbyBRdWljayBBZGQgZG8gVG9kb2lzdCkgKyBldGlxdWV0YXMgY29tYmluYWRhc1xuLy8gKGFzIGRvIHBhY290ZSBwcmltZWlybywgZGVwb2lzIGFzIGlubGluZSwgc2VtIGR1cGxpY2FyKS5cbmZ1bmN0aW9uIHNwbGl0VGFza0xhYmVscyhsaW5lOiBzdHJpbmcsIHBrZ0xhYmVsczogc3RyaW5nW10gPSBbXSk6IHsgdGl0bGU6IHN0cmluZzsgbGFiZWxzOiBzdHJpbmdbXSB9IHtcbiAgY29uc3QgaW5saW5lOiBzdHJpbmdbXSA9IFtdO1xuICAvLyBTXHUwMEYzIGBAZXRpcXVldGFgIG5vIGluXHUwMEVEY2lvIG91IGRlcG9pcyBkZSBlc3BhXHUwMEU3byAobG9va2JlaGluZCkgXHUyMDE0IG5cdTAwRTNvIHBlZ2EgbyBcIkBnbWFpbFwiXG4gIC8vIGRlIHVtIGUtbWFpbCBjb21vIFwicGFnYXIgY29udGFAZ21haWwuY29tXCIuXG4gIGNvbnN0IHN0cmlwcGVkID0gbGluZS5yZXBsYWNlKC8oPzw9XnxcXHMpQChbXFxwe0x9XFxwe059X10rKS9ndSwgKF9tLCBuYW1lOiBzdHJpbmcpID0+IHsgaW5saW5lLnB1c2gobmFtZSk7IHJldHVybiBcIlwiOyB9KVxuICAgIC5yZXBsYWNlKC9cXHN7Mix9L2csIFwiIFwiKS50cmltKCk7XG4gIGNvbnN0IHRpdGxlID0gc3RyaXBwZWQgfHwgbGluZS50cmltKCk7XG4gIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5wa2dMYWJlbHMsIC4uLmlubGluZV0pXTtcbiAgcmV0dXJuIHsgdGl0bGUsIGxhYmVscyB9O1xufVxuXG4vLyBBY2Vzc2liaWxpZGFkZTogZmF6IHVtIGVsZW1lbnRvIGNsaWNcdTAwRTF2ZWwgKGRpdi9zcGFuKSBzZSBjb21wb3J0YXIgY29tbyBib3RcdTAwRTNvIFx1MjAxNFxuLy8gZm9jbyBwb3IgdGVjbGFkbyAoVGFiKSwgcGFwZWwgQVJJQSBlIGF0aXZhXHUwMEU3XHUwMEUzbyBwb3IgRW50ZXIvRXNwYVx1MDBFN28gKGRpc3BhcmEgbyBwclx1MDBGM3ByaW9cbi8vIG9uY2xpY2spLiBPIG5vbWUgYWNlc3NcdTAwRUR2ZWwgdmVtIGRvIHRleHRvL2B0aXRsZWAgcXVlIG8gY2hhbWFkb3Igalx1MDBFMSBkZWZpbmUuXG5mdW5jdGlvbiBjbGlja2FibGU8VCBleHRlbmRzIEhUTUxFbGVtZW50PihlbDogVCwgaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpOiBUIHtcbiAgZWwub25jbGljayA9IGhhbmRsZXI7XG4gIGVsLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gIGVsLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBlbC5jbGljaygpOyB9XG4gIH0pO1xuICByZXR1cm4gZWw7XG59XG5cbi8vIFBvcG92ZXIgZmx1dHVhbnRlIGdlblx1MDBFOXJpY28sIGFuY29yYWRvIG51bSBlbGVtZW50by4gYGZpbGwoYm9keSwgY2xvc2UpYCBtb250YSBvXG4vLyBjb250ZVx1MDBGQWRvLiBGZWNoYSBhbyBjbGljYXIgZm9yYSBvdSBFc2NhcGUgKG9wdHMub25DbG9zZSByb2RhIGFudGVzIGRlIHJlbW92ZXIpLlxuZnVuY3Rpb24gb3BlblBvcG92ZXIoXG4gIGFuY2hvcjogSFRNTEVsZW1lbnQsXG4gIGZpbGw6IChib2R5OiBIVE1MRWxlbWVudCwgY2xvc2U6ICgpID0+IHZvaWQpID0+IHZvaWQsXG4gIG9wdHM6IHsgY2xzPzogc3RyaW5nOyB3aWR0aD86IG51bWJlcjsgb25DbG9zZT86ICgpID0+IHZvaWQgfSA9IHt9LFxuKTogKCkgPT4gdm9pZCB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2QtcG9wXCIpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgY29uc3QgcG9wID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wXCIgKyAob3B0cy5jbHMgPyBcIiBcIiArIG9wdHMuY2xzIDogXCJcIikgfSk7XG4gIGlmIChvcHRzLndpZHRoKSBwb3Auc3R5bGUud2lkdGggPSBgJHtvcHRzLndpZHRofXB4YDtcblxuICBjb25zdCBvbkRvYyA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIE5vZGU7XG4gICAgaWYgKCFwb3AuY29udGFpbnModCkgJiYgdCAhPT0gYW5jaG9yICYmICFhbmNob3IuY29udGFpbnModCkpIGNsb3NlKCk7XG4gIH07XG4gIGNvbnN0IG9uS2V5ID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHsgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSBjbG9zZSgpOyB9O1xuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBvcHRzLm9uQ2xvc2U/LigpO1xuICAgIHBvcC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uRG9jLCB0cnVlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleSwgdHJ1ZSk7XG4gIH1cblxuICBmaWxsKHBvcCwgY2xvc2UpO1xuXG4gIGNvbnN0IHIgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHBvcC5zdHlsZS50b3AgPSBgJHtyLmJvdHRvbSArIDR9cHhgO1xuICBwb3Auc3R5bGUubGVmdCA9IGAke3IubGVmdH1weGA7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgY29uc3QgcHIgPSBwb3AuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKHByLnJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBwb3Auc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIHdpbmRvdy5pbm5lcldpZHRoIC0gcHIud2lkdGggLSA4KX1weGA7XG4gICAgaWYgKHByLmJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHBvcC5zdHlsZS50b3AgPSBgJHtNYXRoLm1heCg4LCByLnRvcCAtIHByLmhlaWdodCAtIDQpfXB4YDtcbiAgfSk7XG5cbiAgLy8gUmVnaXN0cmEgZGVwb2lzIGRvIGNsaXF1ZSBkZSBhYmVydHVyYSBwYXJhIG5cdTAwRTNvIGZlY2hhciBpbWVkaWF0YW1lbnRlLlxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uRG9jLCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleSwgdHJ1ZSk7XG4gIH0sIDApO1xuICByZXR1cm4gY2xvc2U7XG59XG5cbi8vIFBvcG92ZXIgZGUgc2VsZVx1MDBFN1x1MDBFM28gZGUgXHUwMEVEY29uZSAocGFsZXRhKS4gYGN1cnJlbnRgID0gXHUwMEVEY29uZSBzZWxlY2lvbmFkbyAoZGVzdGFjYSkuXG5mdW5jdGlvbiBvcGVuSWNvblBvcG92ZXIoYW5jaG9yOiBIVE1MRWxlbWVudCwgY3VycmVudDogc3RyaW5nIHwgdW5kZWZpbmVkLCBvblBpY2s6IChpY29uOiBzdHJpbmcgfCB1bmRlZmluZWQpID0+IHZvaWQpIHtcbiAgb3BlblBvcG92ZXIoYW5jaG9yLCAocG9wLCBjbG9zZSkgPT4ge1xuICAgIGNvbnN0IG5vbmUgPSBwb3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctaWNvbm9wdCB3ZC1wa2ctaWNvbm5vbmVcIiArICghY3VycmVudCA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIwMTRcIiB9KTtcbiAgICBub25lLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlNlbSBcdTAwRURjb25lXCIpO1xuICAgIGNsaWNrYWJsZShub25lLCAoKSA9PiB7IG9uUGljayh1bmRlZmluZWQpOyBjbG9zZSgpOyB9KTtcbiAgICBmb3IgKGNvbnN0IGljIG9mIFBLR19JQ09OUykge1xuICAgICAgY29uc3Qgb3B0ID0gcG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb25vcHRcIiArIChjdXJyZW50ID09PSBpYyA/IFwiIHdkLW9uXCIgOiBcIlwiKSB9KTtcbiAgICAgIHJlbmRlckljb24ob3B0LCBpYyk7XG4gICAgICBvcHQuc2V0QXR0cihcInRpdGxlXCIsIGljKTtcbiAgICAgIGNsaWNrYWJsZShvcHQsICgpID0+IHsgb25QaWNrKGljKTsgY2xvc2UoKTsgfSk7XG4gICAgfVxuICB9LCB7IGNsczogXCJ3ZC1pY29uLXBvcFwiIH0pO1xufVxuXG4vLyBCdXNjYSBhcyB0YXJlZmFzIGF0aXZhcyAoblx1MDBFM28gY29uY2x1XHUwMEVEZGFzKSB2aWEgQVBJIHVuaWZpY2FkYSB2MSAoYSBSRVNUIHYyIGZvaVxuLy8gYXBvc2VudGFkYSBcdTIxOTIgcmVzcG9uZGlhIDQxMCkuIEEgdjEgXHUwMEU5IHBhZ2luYWRhOiB7IHJlc3VsdHMsIG5leHRfY3Vyc29yIH0uXG5hc3luYyBmdW5jdGlvbiBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0VGFza1tdPiB7XG4gIGNvbnN0IGFsbDogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBsZXQgY3Vyc29yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHBhZ2VzID0gMDtcbiAgZG8ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoXCJodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3NcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuXG4gICAgY29uc3QgZGF0YSA9IHJlcy5qc29uIGFzIHsgcmVzdWx0cz86IFRvZG9pc3RUYXNrW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIC8vIHYxIGVudmVsb3BhIGVtIHJlc3VsdHM7IHRvbGVyYSByZXNwb3N0YSBjb21vIGFycmF5IHB1cm8gcG9yIHNlZ3VyYW5cdTAwRTdhLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RUYXNrW10pKTsgY3Vyc29yID0gbnVsbDsgfVxuICAgIGVsc2UgeyBhbGwucHVzaCguLi4oZGF0YS5yZXN1bHRzID8/IFtdKSk7IGN1cnNvciA9IGRhdGEubmV4dF9jdXJzb3IgPz8gbnVsbDsgfVxuICB9IHdoaWxlIChjdXJzb3IgJiYgKytwYWdlcyA8IFRPRE9fTUFYX1BBR0VTKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuaW50ZXJmYWNlIFRvZG9pc3RQcm9qZWN0IHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vLyBCdXNjYSBvcyBwcm9qZXRvcyAocGFyYSBvIGZpbHRybykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYSBkYXMgdGFyZWZhcy5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFByb2plY3RzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RQcm9qZWN0W10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0UHJvamVjdFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9wcm9qZWN0c1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0UHJvamVjdFtdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0UHJvamVjdFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbmludGVyZmFjZSBUb2RvaXN0TGFiZWwge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7ICAgLy8gbm9tZSBkYSBwYWxldGEgKGV4LjogXCJjaGFyY29hbFwiKVxufVxuXG4vLyBCdXNjYSBhcyBldGlxdWV0YXMgcGVzc29haXMgKHBhcmEgY29sb3JpciBvcyBjaGlwcykuIE1lc21hIEFQSSB2MSBwYWdpbmFkYS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdExhYmVscyh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxUb2RvaXN0TGFiZWxbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RMYWJlbFtdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgcGFnZXMgPSAwO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS9sYWJlbHNcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJsaW1pdFwiLCBcIjIwMFwiKTtcbiAgICBpZiAoY3Vyc29yKSB1cmwuc2VhcmNoUGFyYW1zLnNldChcImN1cnNvclwiLCBjdXJzb3IpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgICAgdGhyb3c6IGZhbHNlLFxuICAgIH0pO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdExhYmVsW107IG5leHRfY3Vyc29yPzogc3RyaW5nIHwgbnVsbCB9O1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7IGFsbC5wdXNoKC4uLihkYXRhIGFzIFRvZG9pc3RMYWJlbFtdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yICYmICsrcGFnZXMgPCBUT0RPX01BWF9QQUdFUyk7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jdGhpbmcgKEFQSSBSRVNUKSBcdTIwMTQgdjAuMTAuMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFNURm9sZGVyIHsgaWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBwYXVzZWQ6IGJvb2xlYW4gfVxuaW50ZXJmYWNlIFNURGV2aWNlIHsgZGV2aWNlSUQ6IHN0cmluZzsgbmFtZTogc3RyaW5nIH1cbmludGVyZmFjZSBTVFN0YXR1cyB7IHN0YXRlOiBzdHJpbmc7IG5lZWRGaWxlczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgZXJyb3JzOiBudW1iZXI7IHB1bGxFcnJvcnM6IG51bWJlciB9XG5pbnRlcmZhY2UgU1RDb21wbGV0aW9uIHsgY29tcGxldGlvbjogbnVtYmVyOyBnbG9iYWxJdGVtczogbnVtYmVyOyBuZWVkSXRlbXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IG5lZWREZWxldGVzOiBudW1iZXIgfVxuXG5pbnRlcmZhY2UgU3luY0RldlJvdyB7IG5hbWU6IHN0cmluZzsgb25saW5lOiBib29sZWFuOyBjb21wbGV0aW9uOiBudW1iZXI7IGdsb2JhbEl0ZW1zOiBudW1iZXI7IG5lZWRJdGVtczogbnVtYmVyOyBuZWVkQnl0ZXM6IG51bWJlcjsgbmVlZERlbGV0ZXM6IG51bWJlcjsgbGFzdFNlZW46IHN0cmluZyB9XG5pbnRlcmZhY2UgU3luY0RhdGEgeyBzdGF0ZTogc3RyaW5nOyBuZWVkRmlsZXM6IG51bWJlcjsgbmVlZEJ5dGVzOiBudW1iZXI7IGZvbGRlckxhYmVsOiBzdHJpbmc7IGVycm9yczogbnVtYmVyOyBkZXZpY2VzOiBTeW5jRGV2Um93W10gfVxuXG5mdW5jdGlvbiBodW1hbkJ5dGVzKG46IG51bWJlcik6IHN0cmluZyB7XG4gIGlmICghbikgcmV0dXJuIFwiMCBCXCI7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwNDg1NzYpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQobiA8IDEwMjQwID8gMSA6IDApfSBLQmA7XG4gIHJldHVybiBgJHsobiAvIDEwNDg1NzYpLnRvRml4ZWQobiA8IDEwNDg1NzYwID8gMSA6IDApfSBNQmA7XG59XG5cbmZ1bmN0aW9uIHJlbFRpbWUoaXNvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICBpZiAoaXNOYU4odCkgfHwgdCA8IDEpIHJldHVybiBcIlx1MjAxNFwiO1xuICBjb25zdCBzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIHQpIC8gMTAwMCk7XG4gIGlmIChzIDwgNjApIHJldHVybiBcImFnb3JhXCI7XG4gIGlmIChzIDwgMzYwMCkgcmV0dXJuIGBoXHUwMEUxICR7TWF0aC5mbG9vcihzIC8gNjApfSBtaW5gO1xuICBpZiAocyA8IDg2NDAwKSByZXR1cm4gYGhcdTAwRTEgJHtNYXRoLmZsb29yKHMgLyAzNjAwKX0gaGA7XG4gIHJldHVybiBgaFx1MDBFMSAke01hdGguZmxvb3IocyAvIDg2NDAwKX0gZGA7XG59XG5cbi8vIEdFVCBnZW5cdTAwRTlyaWNvIG5hIEFQSSBkbyBTeW5jdGhpbmcgKGhlYWRlciBYLUFQSS1LZXk7IHJlcXVlc3RVcmwgaWdub3JhIENPUlMpLlxuYXN5bmMgZnVuY3Rpb24gc3RHZXQ8VD4oYmFzZTogc3RyaW5nLCBrZXk6IHN0cmluZywgcGF0aDogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IHVybCA9IGJhc2UucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoeyB1cmwsIG1ldGhvZDogXCJHRVRcIiwgaGVhZGVyczogeyBcIlgtQVBJLUtleVwiOiBrZXkgfSwgdGhyb3c6IGZhbHNlIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwiQVBJIGtleSBpbnZcdTAwRTFsaWRhICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbiAgcmV0dXJuIHJlcy5qc29uIGFzIFQ7XG59XG5cbi8vIFVSTCBwYXJhIGFicmlyIGEgdGFyZWZhIG5vIFRvZG9pc3QgKHVzYSBhIGRvIHBheWxvYWQgb3UgbW9udGEgYSBwYXJ0aXIgZG8gaWQpLlxuZnVuY3Rpb24gdGFza1VybCh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gIHJldHVybiB0LnVybCA/PyBgaHR0cHM6Ly9hcHAudG9kb2lzdC5jb20vYXBwL3Rhc2svJHt0LmlkfWA7XG59XG5cbi8vIENvbmNsdWkgKGZlY2hhKSB1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFBPU1Qgc2VtIGNvcnBvOyAyMDQgPSBzdWNlc3NvLiBGYXNlIDguMi5cbmFzeW5jIGZ1bmN0aW9uIGNsb3NlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH0vY2xvc2VgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCB9LFxuICAgIHRocm93OiBmYWxzZSxcbiAgfSk7XG4gIGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiBpbnZcdTAwRTFsaWRvICg0MDEvNDAzKVwiKTtcbiAgaWYgKHJlcy5zdGF0dXMgIT09IDIwNCAmJiByZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBFc2NyaXRhOiBjcmlhciAvIGVkaXRhciAvIG1vdmVyIC8gZXhjbHVpciAodjAuOC4wKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ2FtcG9zIGdyYXZcdTAwRTF2ZWlzLiBUb2RvcyBvcGNpb25haXMgXHUyMDE0IG5vIGVkaXRhciBtYW5kbyBzXHUwMEYzIG8gcXVlIG11ZG91LlxuaW50ZXJmYWNlIFRvZG9pc3RXcml0ZSB7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcmlvcml0eT86IG51bWJlcjsgICAgIC8vIDEuLjQgKDQgPSB1cmdlbnRlIC8gcDEgbmEgVUkpXG4gIGR1ZV9kYXRlPzogc3RyaW5nOyAgICAgLy8gZGF0YSBmaXhhIFlZWVktTU0tREQgKHZpbmRvIGRvIGNhbGVuZFx1MDBFMXJpbylcbiAgZHVlX3N0cmluZz86IHN0cmluZzsgICAvLyBsaW5ndWFnZW0gbmF0dXJhbDsgXCJubyBkYXRlXCIgbGltcGEgYSBkYXRhXG4gIGR1ZV9sYW5nPzogc3RyaW5nOyAgICAgLy8gXCJwdFwiIFx1MjE5MiBpbnRlcnByZXRhIGVtIHBvcnR1Z3VcdTAwRUFzXG4gIGxhYmVscz86IHN0cmluZ1tdO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBqc29uSGVhZGVycyh0b2tlbjogc3RyaW5nKSB7XG4gIHJldHVybiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLCBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9O1xufVxuXG4vLyBDcmlhIHVtYSB0YXJlZmEuIFBPU1QgL3Rhc2tzIFx1MjE5MiAyMDAgY29tIGEgdGFyZWZhIGNyaWFkYS5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTxUb2RvaXN0VGFzaz4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG4gIHJldHVybiByZXMuanNvbiBhcyBUb2RvaXN0VGFzaztcbn1cblxuLy8gRWRpdGEgdW1hIHRhcmVmYS4gUE9TVCAvdGFza3Mve2lkfSBcdTIxOTIgMjAwLiBOXHUwMEUzbyB0cm9jYSBkZSBwcm9qZXRvICh1c2UgbW92ZVRvZG9pc3RUYXNrKS5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGZpZWxkczogVG9kb2lzdFdyaXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBqc29uSGVhZGVycyh0b2tlbiksXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZmllbGRzKSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG59XG5cbi8vIE1vdmUgYSB0YXJlZmEgcGFyYSBvdXRybyBwcm9qZXRvLiBQT1NUIC90YXNrcy97aWR9L21vdmUgXHUyMTkyIDIwMC5cbmFzeW5jIGZ1bmN0aW9uIG1vdmVUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nLCBwcm9qZWN0X2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgdXJsOiBgaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzLyR7aWR9L21vdmVgLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoganNvbkhlYWRlcnModG9rZW4pLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcHJvamVjdF9pZCB9KSxcbiAgICB0aHJvdzogZmFsc2UsXG4gIH0pO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzfWApO1xufVxuXG4vLyBFeGNsdWkgYSB0YXJlZmEuIERFTEVURSAvdGFza3Mve2lkfSBcdTIxOTIgMjA0LlxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVG9kb2lzdFRhc2sodG9rZW46IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICB1cmw6IGBodHRwczovL2FwaS50b2RvaXN0LmNvbS9hcGkvdjEvdGFza3MvJHtpZH1gLFxuICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIFRvZG9zIG9zIGNhbWluaG9zIGRlIHBhc3RhIGRvIGNvZnJlIChyZWN1cnNpdm8pLCBpZ25vcmFuZG8gb2N1bHRhcyAoLm9ic2lkaWFuIGV0Yy4pLFxuLy8gZW0gb3JkZW0gYWxmYWJcdTAwRTl0aWNhIFx1MjAxNCB1c2FkbyBubyBzZWxldG9yIGRlIGZvbnRlcyBkYSBTZW1hbmEuXG5mdW5jdGlvbiBhbGxGb2xkZXJQYXRocyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyICYmICFjLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpIHsgb3V0LnB1c2goYy5wYXRoKTsgd2FsayhjKTsgfVxuICAgIH1cbiAgfTtcbiAgd2FsayhhcHAudmF1bHQuZ2V0Um9vdCgpKTtcbiAgcmV0dXJuIG91dC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG4vLyAobWQvaW1nIGRhIHN1Ylx1MDBFMXJ2b3JlIHZcdTAwRUFtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlLilcbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbmZ1bmN0aW9uIGNvdmVySW5Gb2xkZXIoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICAvLyAxLiBDYW1wbyBjb3Zlcjogbm8gc3RhdHVzLm1kIChhY2VpdGEgY2FtaW5obyBkaXJldG8gb3Ugd2lraWxpbmsgW1suLi5dXSlcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBpZiAoc2YpIHtcbiAgICBjb25zdCByYXcgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LmNvdmVyO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiICYmIHJhdy50cmltKCkpIHtcbiAgICAgIGNvbnN0IGxpbmtwYXRoID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eIT9cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobGlua3BhdGgsIHNmLnBhdGgpO1xuICAgICAgaWYgKHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgJiYgSU1HX0VYVC5pbmNsdWRlcyhyZXNvbHZlZC5leHRlbnNpb24pKVxuICAgICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChyZXNvbHZlZCk7XG4gICAgfVxuICB9XG4gIC8vIDIuIEZhbGxiYWNrOiBhcnF1aXZvIF9jb3Zlci4qIG5hIHBhc3RhXG4gIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuYmFzZW5hbWUgPT09IFwiX2NvdmVyXCIgJiYgSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpXG4gICAgICByZXR1cm4gYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aChjKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVhZEZvbGRlclN0YXR1cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogU3RhdHVzIHtcbiAgY29uc3Qgc2YgPSBmb2xkZXIuY2hpbGRyZW4uZmluZChjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGFzIFRGaWxlIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG5mdW5jdGlvbiByZWFkTm90ZVN0YXR1cyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTdGF0dXMge1xuICBjb25zdCBzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVcmdcdTAwRUFuY2lhIChwcm9wcmllZGFkZSBgdXJnZW5jeWApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxudHlwZSBVcmdlbmN5ID0gXCJhbHRhXCIgfCBcIm1lZGlhXCIgfCBcImJhaXhhXCI7XG5jb25zdCBVUkdFTkNZX1JBTks6IFJlY29yZDxVcmdlbmN5LCBudW1iZXI+ID0geyBiYWl4YTogMSwgbWVkaWE6IDIsIGFsdGE6IDMgfTtcbmNvbnN0IFVSR0VOQ1lfQ09MT1I6IFJlY29yZDxVcmdlbmN5LCBzdHJpbmc+ID0geyBhbHRhOiBcIiNFRjQ0NDRcIiwgbWVkaWE6IFwiI0Y1OUUwQlwiLCBiYWl4YTogXCIjRUFCMzA4XCIgfTtcblxuZnVuY3Rpb24gcmVhZE5vdGVVcmdlbmN5KGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFVyZ2VuY3kgfCBudWxsIHtcbiAgY29uc3QgdSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy51cmdlbmN5O1xuICByZXR1cm4gdSA9PT0gXCJhbHRhXCIgfHwgdSA9PT0gXCJtZWRpYVwiIHx8IHUgPT09IFwiYmFpeGFcIiA/IHUgOiBudWxsO1xufVxuXG4vLyBBZ3JlZ2FkbyBkZSB1cmdcdTAwRUFuY2lhIGRlIHVtYSBzdWJcdTAwRTFydm9yZSAodmVtIGRvIGNhY2hlIGRvIGNvZnJlIFx1MjAxNCB2ZXIgYnVpbGRWYXVsdENhY2hlKS5cbnR5cGUgVXJnZW5jeUluZm8gPSB7IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W107IG1heDogVXJnZW5jeSB8IG51bGwgfTtcblxuLy8gXHUyNTAwXHUyNTAwIEFycXVpdm9zIGV4aWJcdTAwRUR2ZWlzOiBub3RhICgubWQpIC8gY2FudmFzICguY2FudmFzKSAvIGJhc2UgKC5iYXNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEZJTEVfRVhUUyA9IFtcIm1kXCIsIFwiY2FudmFzXCIsIFwiYmFzZVwiXTtcbi8vIGlkIEx1Y2lkZSBwb3IgdGlwbyBkZSBhcnF1aXZvLlxuZnVuY3Rpb24gZmlsZUdseXBoKGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGV4dCA9PT0gXCJjYW52YXNcIikgcmV0dXJuIFwic2hhcGVzXCI7XG4gIGlmIChleHQgPT09IFwiYmFzZVwiKSByZXR1cm4gXCJ0YWJsZS0yXCI7XG4gIHJldHVybiBcImZpbGUtdGV4dFwiO1xufVxuZnVuY3Rpb24gZmlsZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIEZJTEVfRVhUUy5pbmNsdWRlcyhjLmV4dGVuc2lvbikgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhY2hlIGRvIGNvZnJlIChcdTAwQTczKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFVNQSBwYXNzYWRhIChERlMpIG1vbnRhIG9zIGFncmVnYWRvcyBwb3IgcGFzdGEgKHN1Ylx1MDBFMXJ2b3JlKSArIG9zIGdsb2JhaXMgcXVlXG4vLyB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIGNvbnNvbWVtIFx1MjAxNCBhbnRlcyBjYWRhIHNlXHUwMEU3XHUwMEUzbyB2YXJyaWEgbyBjb2ZyZSBwb3IgY29udGEgcHJcdTAwRjNwcmlhXG4vLyAofjhcdTIwMTMxMFx1MDBENyBwb3IgcmVuZGVyKS4gSW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdCBlIHJlY3JpYWRvIHNvYiBkZW1hbmRhLlxuaW50ZXJmYWNlIEZvbGRlckFnZyB7XG4gIG1kOiBudW1iZXI7ICAgICAgICAgIC8vIG5vdGFzIC5tZCAoZXhjZXRvIHN0YXR1cy5tZCkgbmEgc3ViXHUwMEUxcnZvcmVcbiAgaW1nOiBudW1iZXI7ICAgICAgICAgLy8gaW1hZ2VucyBuYSBzdWJcdTAwRTFydm9yZVxuICByZXZpZXdlZDogbnVtYmVyOyAgICAvLyAubWQgY29tIHJldmlld2VkOnRydWUgbmEgc3ViXHUwMEUxcnZvcmVcbiAgdXJnZW5jeTogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdOyAgIC8vIG5vdGFzIGNvbSB1cmdlbmN5IChvcmRlbmFkYXMgcG9yIG5cdTAwRUR2ZWwgZGVzYylcbiAgdXJnZW5jeU1heDogVXJnZW5jeSB8IG51bGw7XG4gIHJlY2VudDogVEZpbGVbXTsgICAgIC8vIGF0XHUwMEU5IDQgbm90YXMgLm1kIG1haXMgcmVjZW50ZXMgKG10aW1lKSBkYSBzdWJcdTAwRTFydm9yZVxufVxuaW50ZXJmYWNlIFZhdWx0Q2FjaGUge1xuICBieUZvbGRlcjogTWFwPHN0cmluZywgRm9sZGVyQWdnPjsgICAgICAgICAgICAgIC8vIHBhdGggZGEgcGFzdGEgXHUyMTkyIGFncmVnYWRvc1xuICBkYXRlZE5vdGVzOiB7IGZpbGU6IFRGaWxlOyBkYXRlOiBzdHJpbmcgfVtdOyAgIC8vIG5vdGFzIGNvbSBkYXRhIChmcm9udG1hdHRlciBkYXRlOiBvdSBub21lIEFBQUEtTU0tREQpXG4gIGN0aW1lQnlEYXk6IE1hcDxzdHJpbmcsIG51bWJlcj47ICAgICAgICAgICAgICAgLy8gQUFBQS1NTS1ERCBcdTIxOTIgblx1MDBCQSBkZSBub3RhcyBjcmlhZGFzIChjdGltZSlcbiAgdG90YWxOb3RlczogbnVtYmVyO1xuICB0b3RhbFJldmlld2VkOiBudW1iZXI7XG59XG5jb25zdCBFTVBUWV9BR0c6IEZvbGRlckFnZyA9IHsgbWQ6IDAsIGltZzogMCwgcmV2aWV3ZWQ6IDAsIHVyZ2VuY3k6IFtdLCB1cmdlbmN5TWF4OiBudWxsLCByZWNlbnQ6IFtdIH07XG5cbmZ1bmN0aW9uIGJ1aWxkVmF1bHRDYWNoZShhcHA6IEFwcCk6IFZhdWx0Q2FjaGUge1xuICBjb25zdCBieUZvbGRlciA9IG5ldyBNYXA8c3RyaW5nLCBGb2xkZXJBZ2c+KCk7XG4gIGNvbnN0IGRhdGVkTm90ZXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgY29uc3QgY3RpbWVCeURheSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDA7XG5cbiAgY29uc3Qgd2FsayA9IChmb2xkZXI6IFRGb2xkZXIpOiBGb2xkZXJBZ2cgPT4ge1xuICAgIGNvbnN0IGFnZzogRm9sZGVyQWdnID0geyBtZDogMCwgaW1nOiAwLCByZXZpZXdlZDogMCwgdXJnZW5jeTogW10sIHVyZ2VuY3lNYXg6IG51bGwsIHJlY2VudDogW10gfTtcbiAgICBjb25zdCByZWNlbnQ6IFRGaWxlW10gPSBbXTsgICAvLyBjYW5kaWRhdG9zOiBhcnF1aXZvcyBwclx1MDBGM3ByaW9zICsgdG9wLTQgZGUgY2FkYSBmaWxob1xuICAgIGZvciAoY29uc3QgYyBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICBjb25zdCBzdWIgPSB3YWxrKGMpO1xuICAgICAgICBhZ2cubWQgKz0gc3ViLm1kOyBhZ2cuaW1nICs9IHN1Yi5pbWc7IGFnZy5yZXZpZXdlZCArPSBzdWIucmV2aWV3ZWQ7XG4gICAgICAgIGlmIChzdWIudXJnZW5jeS5sZW5ndGgpIGFnZy51cmdlbmN5LnB1c2goLi4uc3ViLnVyZ2VuY3kpO1xuICAgICAgICBpZiAoc3ViLnJlY2VudC5sZW5ndGgpIHJlY2VudC5wdXNoKC4uLnN1Yi5yZWNlbnQpO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgICAgYWdnLm1kKys7XG4gICAgICAgICAgcmVjZW50LnB1c2goYyk7XG4gICAgICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgICAgIGNvbnN0IGZtID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI7XG4gICAgICAgICAgaWYgKGZtPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgeyBhZ2cucmV2aWV3ZWQrKzsgdG90YWxSZXZpZXdlZCsrOyB9XG4gICAgICAgICAgY29uc3QgdSA9IGZtPy51cmdlbmN5O1xuICAgICAgICAgIGlmICh1ID09PSBcImFsdGFcIiB8fCB1ID09PSBcIm1lZGlhXCIgfHwgdSA9PT0gXCJiYWl4YVwiKSBhZ2cudXJnZW5jeS5wdXNoKHsgZmlsZTogYywgbGV2ZWw6IHUgfSk7XG4gICAgICAgICAgY29uc3QgY2sgPSB0b0tleShuZXcgRGF0ZShjLnN0YXQuY3RpbWUpKTtcbiAgICAgICAgICBjdGltZUJ5RGF5LnNldChjaywgKGN0aW1lQnlEYXkuZ2V0KGNrKSA/PyAwKSArIDEpO1xuICAgICAgICAgIGNvbnN0IG0gPSBjLmJhc2VuYW1lLm1hdGNoKC9eKFxcZHs0fS1cXGR7Mn0tXFxkezJ9KS8pO1xuICAgICAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKGZtPy5kYXRlKSA/PyAobSA/IG1bMV0gOiBudWxsKTtcbiAgICAgICAgICBpZiAoZCkgZGF0ZWROb3Rlcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGFnZy5pbWcrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWNlbnQuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgICBhZ2cucmVjZW50ID0gcmVjZW50LnNsaWNlKDAsIDQpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgYWdnLnVyZ2VuY3kpXG4gICAgICBpZiAoIWFnZy51cmdlbmN5TWF4IHx8IFVSR0VOQ1lfUkFOS1tpdC5sZXZlbF0gPiBVUkdFTkNZX1JBTktbYWdnLnVyZ2VuY3lNYXhdKSBhZ2cudXJnZW5jeU1heCA9IGl0LmxldmVsO1xuICAgIGFnZy51cmdlbmN5LnNvcnQoKGEsIGIpID0+IFVSR0VOQ1lfUkFOS1tiLmxldmVsXSAtIFVSR0VOQ1lfUkFOS1thLmxldmVsXSk7XG4gICAgYnlGb2xkZXIuc2V0KGZvbGRlci5wYXRoLCBhZ2cpO1xuICAgIHJldHVybiBhZ2c7XG4gIH07XG4gIHdhbGsoYXBwLnZhdWx0LmdldFJvb3QoKSk7XG4gIHJldHVybiB7IGJ5Rm9sZGVyLCBkYXRlZE5vdGVzLCBjdGltZUJ5RGF5LCB0b3RhbE5vdGVzLCB0b3RhbFJldmlld2VkIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBcdTI1MDBcdTI1MDAgQ29udHJvbGFkb3IgZG8gVG9kb2lzdCAoY29tcGFydGlsaGFkbzogZGFzaGJvYXJkICsgYWJhIGRlZGljYWRhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERldFx1MDBFOW0gbyBlc3RhZG8gZGFzIHRhcmVmYXMsIGEgYnVzY2EsIGEgcmVuZGVyaXphXHUwMEU3XHUwMEUzbyBkYSBsaXN0YSBlIGFzIGFcdTAwRTdcdTAwRjVlc1xuLy8gKGNyaWFyL2VkaXRhci9jb25jbHVpci9leGNsdWlyKS4gYHJlcmVuZGVyYCBcdTAwRTkgbyBjYWxsYmFjayBkYSB2aWV3IGRvbmEgKHJlLXJlbmRlclxuLy8gY29tcGxldG8pLiBUZW0gdG9vbHRpcCBwclx1MDBGM3ByaW8gcGFyYSBuXHUwMEUzbyBkZXBlbmRlciBkYSB2aWV3LlxuY2xhc3MgVG9kb2lzdENvbnRyb2xsZXIge1xuICBwcml2YXRlIHRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gPSBbXTtcbiAgcHJpdmF0ZSBwcm9qZWN0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBpZCBcdTIxOTIgbm9tZVxuICBwcml2YXRlIGxhYmVsQ29sb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTsgICAvLyBub21lIGRhIGV0aXF1ZXRhIFx1MjE5MiBoZXhcbiAgcHJpdmF0ZSBsb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgbGF0ZXJPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgbm9EYXRlT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aXA6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGF1bmNoaW5nID0gbmV3IFNldDxzdHJpbmc+KCk7ICAgLy8gaWRzIGRlIHBhY290ZXMgc2VuZG8gbGFuXHUwMEU3YWRvcyAoYW50aSBjbGlxdWUtZHVwbG8pXG4gIHByaXZhdGUgc3VicyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTsgICAgIC8vIHZpZXdzIGluc2NyaXRhcyAocmUtcmVuZGVyIGRhIHNlXHUwMEU3XHUwMEUzbyBUb2RvaXN0KVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkLFxuICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnQsXG4gICkge1xuICAgIHRoaXMubG9hZENhY2hlKCk7ICAgLy8gbW9zdHJhIG8gXHUwMEZBbHRpbW8gcmVzdWx0YWRvIG5hIGhvcmEgKG9mZmxpbmUpLCBhbnRlcyBkbyAxXHUwMEJBIGZldGNoXG4gIH1cblxuICAvLyBJbnNjcmV2ZSB1bWEgdmlldzsgZGV2b2x2ZSBhIGZ1blx1MDBFN1x1MDBFM28gZGUgY2FuY2VsYXIuIE8gY2FsbGJhY2sgcmUtcmVuZGVyaXphIHNcdTAwRjMgYVxuICAvLyBzZVx1MDBFN1x1MDBFM28gVG9kb2lzdCBkYXF1ZWxhIHZpZXcgKG5cdTAwRTNvIGEgdmlldyBpbnRlaXJhKS4gRXN0YWRvIFx1MDBFOSBcdTAwRkFuaWNvIGUgY29tcGFydGlsaGFkby5cbiAgc3Vic2NyaWJlKGNiOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzLmFkZChjYik7XG4gICAgcmV0dXJuICgpID0+IHsgdGhpcy5zdWJzLmRlbGV0ZShjYik7IH07XG4gIH1cbiAgcHJpdmF0ZSByZXJlbmRlckFsbCgpIHsgZm9yIChjb25zdCBjYiBvZiB0aGlzLnN1YnMpIGNiKCk7IH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuICAgIHRoaXMucHJvamVjdE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmxhYmVsQ29sb3JzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmV0Y2hlZEF0ID0gMDtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gIH1cblxuICBoaWRlVGlwKCkgeyBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfSB9XG5cbiAgcHJpdmF0ZSBkYXlSYW5nZSgpOiAzIHwgNyB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3REYXlSYW5nZSA9PT0gMyA/IDMgOiA3O1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUZpbHRlcnModGFza3M6IFRvZG9pc3RUYXNrW10pOiBUb2RvaXN0VGFza1tdIHtcbiAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgaWYgKCFmLnByb2plY3RzLmxlbmd0aCAmJiAhZi5sYWJlbHMubGVuZ3RoKSByZXR1cm4gdGFza3M7XG4gICAgY29uc3QgcHMgPSBuZXcgU2V0KGYucHJvamVjdHMpLCBscyA9IG5ldyBTZXQoZi5sYWJlbHMpO1xuICAgIHJldHVybiB0YXNrcy5maWx0ZXIodCA9PiB7XG4gICAgICBpZiAocHMuc2l6ZSAmJiAhKHQucHJvamVjdF9pZCAmJiBwcy5oYXModC5wcm9qZWN0X2lkKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChscy5zaXplICYmICEodC5sYWJlbHMgPz8gW10pLnNvbWUobCA9PiBscy5oYXMobCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlRmlsdGVyKGtpbmQ6IFwicHJvamVjdHNcIiB8IFwibGFiZWxzXCIsIGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVyc1traW5kXTtcbiAgICBjb25zdCBpID0gYXJyLmluZGV4T2YoaWQpO1xuICAgIGlmIChpID49IDApIGFyci5zcGxpY2UoaSwgMSk7IGVsc2UgYXJyLnB1c2goaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENvbG9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxDb2xvcnMuZ2V0KG5hbWUpID8/IExBQkVMX0ZBTExCQUNLO1xuICB9XG5cbiAgcHJpdmF0ZSBsYWJlbENoaXAoaG9zdDogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY2xzOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY2hpcCA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMubGFiZWxDb2xvcihuYW1lKTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bmFtZX1gIH0pO1xuICAgIHJldHVybiBjaGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvblRpcCh0aXA6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0dyA9IHRpcC5vZmZzZXRXaWR0aCwgdGggPSB0aXAub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBsZWZ0ID0gcmVjdC5sZWZ0O1xuICAgIGxldCB0b3AgPSByZWN0LmJvdHRvbSArIDY7XG4gICAgaWYgKGxlZnQgKyB0dyA+IHdpbmRvdy5pbm5lcldpZHRoIC0gOCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdHcgLSA4O1xuICAgIGlmICh0b3AgKyB0aCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgpIHRvcCA9IHJlY3QudG9wIC0gdGggLSA2O1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICBwcml2YXRlIHNob3dUYXNrVGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC10YXNrLXRpcFwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtcHJpXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaU1ldGEodC5wcmlvcml0eSkuY29sb3I7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXRpdGxlXCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgZCA9IHQuZGVzY3JpcHRpb24hLnRyaW0oKTtcbiAgICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtZGVzY1wiLCB0ZXh0OiBkLmxlbmd0aCA+IERFU0NfTUFYID8gZC5zbGljZSgwLCBERVNDX01BWCkgKyBcIlx1MjAyNlwiIDogZCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRhc2tUaXAoZWw6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rhc2tUaXAoZWwsIHQpKTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIHRvZG9DaGVjayhob3N0OiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBjaGVjayA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoZWNrXCIgfSk7XG4gICAgY2hlY2suc2V0QXR0cihcInRpdGxlXCIsIFwiQ29uY2x1aXIgdGFyZWZhXCIpO1xuICAgIGNsaWNrYWJsZShjaGVjaywgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCk7IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaywgc2hvd0RhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcHJpXCIsIHByaS5jb2xvcik7XG4gICAgdGhpcy50b2RvQ2hlY2socm93LCB0KTtcbiAgICBjb25zdCB0YWcgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSk7XG4gICAgdGFnLnN0eWxlLmJhY2tncm91bmQgPSBwcmkuY29sb3I7XG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihyb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWhhc2Rlc2NcIiB9KSwgXCJhbGlnbi1sZWZ0XCIpO1xuICAgIGNvbnN0IHByb2ogPSB0LnByb2plY3RfaWQgPyB0aGlzLnByb2plY3RNYXAuZ2V0KHQucHJvamVjdF9pZCkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCAmJiBwcm9qKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1wcm9qXCIsIHRleHQ6IHByb2ogfSk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzKVxuICAgICAgZm9yIChjb25zdCBsIG9mIHQubGFiZWxzID8/IFtdKSB0aGlzLmxhYmVsQ2hpcChyb3csIGwsIFwid2QtdG9kby1yb3ctbGFiZWxcIik7XG4gICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgaWYgKHNob3dEYXRlICYmIGRrKSB7XG4gICAgICBjb25zdCBbLCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LWRhdGVcIiwgdGV4dDogYCR7ZH0vJHttfWAgfSk7XG4gICAgfVxuICAgIGlmICh0LmR1ZT8uaXNfcmVjdXJyaW5nKSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlY3VyXCIsIHRleHQ6IFwiXHUyN0YzXCIgfSk7XG4gICAgY2xpY2thYmxlKHJvdywgKCkgPT4gdGhpcy5vcGVuVGFza0RldGFpbCh0KSk7XG4gICAgdGhpcy5hdHRhY2hUYXNrVGlwKHJvdywgdCk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRhc2tCdG4oaG9zdDogSFRNTEVsZW1lbnQsIHByZWZpbGxEdWU/OiBzdHJpbmcsIHRpdGxlID0gXCJOb3ZhIHRhcmVmYVwiKSB7XG4gICAgY29uc3QgYiA9IGhvc3QuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWFkZFwiIH0pO1xuICAgIHNldEljb24oYiwgXCJwbHVzXCIpO1xuICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICBjbGlja2FibGUoYiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMub3BlblRhc2tGb3JtKHsgbW9kZTogXCJjcmVhdGVcIiwgcHJlZmlsbER1ZSB9KTsgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRm9ybShvcHRzOiB7IG1vZGU6IFwiY3JlYXRlXCIgfCBcImVkaXRcIjsgdGFzaz86IFRvZG9pc3RUYXNrOyBwcmVmaWxsRHVlPzogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCBsYWJlbHMgPSBbLi4ubmV3IFNldChbLi4udGhpcy5sYWJlbENvbG9ycy5rZXlzKCksIC4uLnRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKV0pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIG5ldyBUYXNrRm9ybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICBtb2RlOiBvcHRzLm1vZGUsXG4gICAgICB0YXNrOiBvcHRzLnRhc2ssXG4gICAgICBwcmVmaWxsRHVlOiBvcHRzLnByZWZpbGxEdWUsXG4gICAgICBwcm9qZWN0czogdGhpcy5wcm9qZWN0cyxcbiAgICAgIGxhYmVscyxcbiAgICAgIGxhYmVsQ29sb3I6IG4gPT4gdGhpcy5sYWJlbENvbG9yKG4pLFxuICAgICAgc3VibWl0OiB2ID0+IHRoaXMuc3VibWl0VGFza0Zvcm0ob3B0cy5tb2RlLCBvcHRzLnRhc2ssIHYpLFxuICAgICAgcmVtb3ZlOiBvcHRzLnRhc2sgPyAoKSA9PiB0aGlzLmRlbGV0ZVRhc2sob3B0cy50YXNrISkgOiB1bmRlZmluZWQsXG4gICAgICBjb21wbGV0ZTogb3B0cy50YXNrID8gKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayhvcHRzLnRhc2shKSA6IHVuZGVmaW5lZCxcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIG9wZW5UYXNrRGV0YWlsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tEZXRhaWxNb2RhbCh0aGlzLmFwcCwgdGhpcy5jb21wb25lbnQsIHtcbiAgICAgIHRhc2s6IHQsXG4gICAgICBwcm9qZWN0TmFtZTogdC5wcm9qZWN0X2lkID8gdGhpcy5wcm9qZWN0TWFwLmdldCh0LnByb2plY3RfaWQpIDogdW5kZWZpbmVkLFxuICAgICAgbGFiZWxDb2xvcjogbiA9PiB0aGlzLmxhYmVsQ29sb3IobiksXG4gICAgICBlZGl0OiAoKSA9PiB0aGlzLm9wZW5UYXNrRm9ybSh7IG1vZGU6IFwiZWRpdFwiLCB0YXNrOiB0IH0pLFxuICAgICAgY29tcGxldGU6ICgpID0+IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCksXG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdWJtaXRUYXNrRm9ybShtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCIsIHRhc2s6IFRvZG9pc3RUYXNrIHwgdW5kZWZpbmVkLCB2OiBUYXNrRm9ybVZhbHVlcyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB2LmNvbnRlbnQsIHByaW9yaXR5OiB2LnByaW9yaXR5IH07XG4gICAgICAgIGlmICh2LmRlc2NyaXB0aW9uLnRyaW0oKSkgZmllbGRzLmRlc2NyaXB0aW9uID0gdi5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIGlmICh2LmR1ZURhdGUpIGZpZWxkcy5kdWVfZGF0ZSA9IHYuZHVlRGF0ZTtcbiAgICAgICAgaWYgKHYucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHYucHJvamVjdElkO1xuICAgICAgICBpZiAodi5sYWJlbHMubGVuZ3RoKSBmaWVsZHMubGFiZWxzID0gdi5sYWJlbHM7XG4gICAgICAgIGF3YWl0IGNyZWF0ZVRvZG9pc3RUYXNrKHRva2VuLCBmaWVsZHMpO1xuICAgICAgICBuZXcgTm90aWNlKGBcdTI3MTMgQ3JpYWRhOiAke3YuY29udGVudH1gKTtcbiAgICAgIH0gZWxzZSBpZiAodGFzaykge1xuICAgICAgICBjb25zdCBmaWVsZHM6IFRvZG9pc3RXcml0ZSA9IHt9O1xuICAgICAgICBpZiAodi5jb250ZW50ICE9PSB0YXNrLmNvbnRlbnQpIGZpZWxkcy5jb250ZW50ID0gdi5jb250ZW50O1xuICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAhPT0gKHRhc2suZGVzY3JpcHRpb24gPz8gXCJcIikpIGZpZWxkcy5kZXNjcmlwdGlvbiA9IHYuZGVzY3JpcHRpb247XG4gICAgICAgIGlmICh2LnByaW9yaXR5ICE9PSB0YXNrLnByaW9yaXR5KSBmaWVsZHMucHJpb3JpdHkgPSB2LnByaW9yaXR5O1xuICAgICAgICBjb25zdCBvbGREYXRlID0gdGFzay5kdWU/LmRhdGUgPyB0YXNrLmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBcIlwiO1xuICAgICAgICBpZiAodi5kdWVEYXRlICE9PSBvbGREYXRlKSB7XG4gICAgICAgICAgaWYgKHYuZHVlRGF0ZSkgZmllbGRzLmR1ZV9kYXRlID0gdi5kdWVEYXRlO1xuICAgICAgICAgIGVsc2UgZmllbGRzLmR1ZV9zdHJpbmcgPSBcIm5vIGRhdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRMID0gKHRhc2subGFiZWxzID8/IFtdKS5zbGljZSgpLnNvcnQoKS5qb2luKFwiIFwiKTtcbiAgICAgICAgY29uc3QgbmV3TCA9IHYubGFiZWxzLnNsaWNlKCkuc29ydCgpLmpvaW4oXCIgXCIpO1xuICAgICAgICBpZiAob2xkTCAhPT0gbmV3TCkgZmllbGRzLmxhYmVscyA9IHYubGFiZWxzO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGRzKS5sZW5ndGgpIGF3YWl0IHVwZGF0ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCBmaWVsZHMpO1xuICAgICAgICBjb25zdCBvbGRQcm9qID0gdGFzay5wcm9qZWN0X2lkID8/IFwiXCI7XG4gICAgICAgIGlmICh2LnByb2plY3RJZCAhPT0gb2xkUHJvaiAmJiB2LnByb2plY3RJZCkgYXdhaXQgbW92ZVRvZG9pc3RUYXNrKHRva2VuLCB0YXNrLmlkLCB2LnByb2plY3RJZCk7XG4gICAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBTYWx2YTogJHt2LmNvbnRlbnR9YCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmZldGNoKHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gc2FsdmFyOiAke2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKX1gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlbGV0ZVRhc2sodDogVG9kb2lzdFRhc2spOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMudGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZGVsZXRlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1RDgzRFx1REREMSBFeGNsdVx1MDBFRGRhOiAke3QuY29udGVudH1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAwLCB0KTtcbiAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGFvIGV4Y2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY29tcGxldGVUYXNrKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4pIHJldHVybjtcbiAgICBjb25zdCBpZHggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh4ID0+IHguaWQgPT09IHQuaWQpO1xuICAgIGlmIChpZHggPj0gMCkgdGhpcy50YXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNsb3NlVG9kb2lzdFRhc2sodG9rZW4sIHQuaWQpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRhc2tzLnNwbGljZShpZHgsIDAsIHQpO1xuICAgICAgbmV3IE5vdGljZShgRmFsaGEgYW8gY29uY2x1aXI6ICR7ZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpfWApO1xuICAgICAgdGhpcy5yZXJlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNTdGFsZSgpOiBib29sZWFuIHsgcmV0dXJuIERhdGUubm93KCkgLSB0aGlzLmZldGNoZWRBdCA+PSBUT0RPX1RUTDsgfVxuXG4gIC8vIEF1dG8tcmVmcmVzaCBwZXJpXHUwMEYzZGljbyAoaW50ZXJ2YWxvIG5vIG9ubG9hZCk6IHNcdTAwRjMgYnVzY2Egc2UgaFx1MDBFMSB2aWV3IGFiZXJ0YSwgdG9rZW5cbiAgLy8gY29uZmlndXJhZG8sIG5hZGEgZW0gdm9vIGUgbyBjYWNoZSBwYXNzb3UgZG8gVFRMLiBTZW0gdmlldyBhYmVydGEgPSBzZW0gY2hhbWFkYSBcdTAwRTAgQVBJLlxuICBtYXliZVJlZnJlc2goKSB7XG4gICAgaWYgKCF0aGlzLnN1YnMuc2l6ZSB8fCB0aGlzLmxvYWRpbmcpIHJldHVybjtcbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCkpIHJldHVybjtcbiAgICBpZiAodGhpcy5pc1N0YWxlKCkpIHZvaWQgdGhpcy5mZXRjaChmYWxzZSk7XG4gIH1cblxuICAvLyBDYWNoZSBvZmZsaW5lIChwb3ItZGlzcG9zaXRpdm8sIGxvY2FsU3RvcmFnZSBcdTIxOTIgblx1MDBFM28gc2luY3Jvbml6YSk6IGNhcnJlZ2EgbyBcdTAwRkFsdGltb1xuICAvLyByZXN1bHRhZG8gcGFyYSBhIGFiYSBhYnJpciBqXHUwMEUxIGNvbSBhcyB0YXJlZmFzLCBtZXNtbyBzZW0gaW50ZXJuZXQuXG4gIHByaXZhdGUgbG9hZENhY2hlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSB0aGlzLmFwcC5sb2FkTG9jYWxTdG9yYWdlKExTX1RPRE9fQ0FDSEUpO1xuICAgICAgY29uc3QgYyA9IHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgPyBKU09OLnBhcnNlKHJhdykgOiByYXc7XG4gICAgICBpZiAoIWMgfHwgIUFycmF5LmlzQXJyYXkoYy50YXNrcykpIHJldHVybjtcbiAgICAgIHRoaXMudGFza3MgPSBjLnRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IEFycmF5LmlzQXJyYXkoYy5wcm9qZWN0cykgPyBjLnByb2plY3RzIDogW107XG4gICAgICB0aGlzLnByb2plY3RNYXAgPSBuZXcgTWFwKHRoaXMucHJvamVjdHMubWFwKChwOiBUb2RvaXN0UHJvamVjdCkgPT4gW3AuaWQsIHAubmFtZV0pKTtcbiAgICAgIHRoaXMubGFiZWxDb2xvcnMgPSBuZXcgTWFwKEFycmF5LmlzQXJyYXkoYy5sYWJlbHMpID8gYy5sYWJlbHMgOiBbXSk7XG4gICAgICB0aGlzLmZldGNoZWRBdCA9IHR5cGVvZiBjLmZldGNoZWRBdCA9PT0gXCJudW1iZXJcIiA/IGMuZmV0Y2hlZEF0IDogMDtcbiAgICB9IGNhdGNoIHsgLyogY2FjaGUgYXVzZW50ZS9jb3Jyb21waWRvIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgcHJpdmF0ZSBwZXJzaXN0Q2FjaGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfVE9ET19DQUNIRSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0YXNrczogdGhpcy50YXNrcywgcHJvamVjdHM6IHRoaXMucHJvamVjdHMsIGxhYmVsczogWy4uLnRoaXMubGFiZWxDb2xvcnNdLCBmZXRjaGVkQXQ6IHRoaXMuZmV0Y2hlZEF0LFxuICAgICAgfSkpO1xuICAgIH0gY2F0Y2ggeyAvKiBzZXJpYWxpemFcdTAwRTdcdTAwRTNvL3F1b3RhIFx1MjE5MiBpZ25vcmEgKi8gfVxuICB9XG5cbiAgLy8gQXZpc28gZGUgZnJlc2NvciBubyB0b3BvIGRhIGxpc3RhOiBkdXJhbnRlIHVtYSBidXNjYSwgb3UgcXVhbmRvIGVzdGFtb3NcbiAgLy8gZXhpYmluZG8gbyBjYWNoZSBwb3JxdWUgYSBcdTAwRkFsdGltYSBidXNjYSBmYWxob3UgKG9mZmxpbmUpLlxuICBwcml2YXRlIHJlbmRlckZyZXNobmVzcyhob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmxvYWRpbmcpIHsgaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mcmVzaFwiLCB0ZXh0OiBcIkF0dWFsaXphbmRvXHUyMDI2XCIgfSk7IHJldHVybjsgfVxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICBjb25zdCB3aGVuID0gdGhpcy5mZXRjaGVkQXQgPyByZWxUaW1lKG5ldyBEYXRlKHRoaXMuZmV0Y2hlZEF0KS50b0lTT1N0cmluZygpKSA6IFwiXHUyMDE0XCI7XG4gICAgICBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZyZXNoIHdkLXRvZG8tZnJlc2gtc3RhbGVcIiwgdGV4dDogYFNlbSBjb25leFx1MDBFM28gXHUyMDE0IGV4aWJpbmRvIG8gXHUwMEZBbHRpbW8gY2FycmVnYWRvICgke3doZW59KWAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2gobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4gfHwgdGhpcy5sb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlcmVuZGVyQWxsKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IFt0YXNrcywgcHJvamVjdHMsIGxhYmVsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuKSxcbiAgICAgICAgZmV0Y2hUb2RvaXN0UHJvamVjdHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RQcm9qZWN0W10pLFxuICAgICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLmNhdGNoKCgpID0+IFtdIGFzIFRvZG9pc3RMYWJlbFtdKSxcbiAgICAgIF0pO1xuICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuICAgICAgdGhpcy5wcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgdGhpcy5wcm9qZWN0TWFwID0gbmV3IE1hcChwcm9qZWN0cy5tYXAocCA9PiBbcC5pZCwgcC5uYW1lXSkpO1xuICAgICAgdGhpcy5sYWJlbENvbG9ycyA9IG5ldyBNYXAobGFiZWxzLm1hcChsID0+IFtsLm5hbWUsIFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLXSkpO1xuICAgICAgdGhpcy5mZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5wZXJzaXN0Q2FjaGUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvLyBMYW5cdTAwRTdhIHVtIHBhY290ZTogY3JpYSBjYWRhIHRhcmVmYSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamUuIFNlcXVlbmNpYWxcbiAgLy8gKGV2aXRhIHJhamFkYSBuYSBBUEkpLiBBdHVhbGl6YSBhIGxpc3RhIGFvIGZpbmFsLlxuICBhc3luYyBsYXVuY2hQYWNrYWdlKHBrZzogVGFza1BhY2thZ2UpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbi50cmltKCk7XG4gICAgaWYgKCF0b2tlbikgeyBuZXcgTm90aWNlKFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdCBuYXMgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMuXCIpOyByZXR1cm47IH1cbiAgICAvLyBSZXNvbHZlIHRcdTAwRUR0dWxvIGxpbXBvICsgZXRpcXVldGFzIChwYWNvdGUgKyBpbmxpbmUgQGV0aXF1ZXRhKSBwb3IgdGFyZWZhLlxuICAgIGNvbnN0IGl0ZW1zID0gcGtnLnRhc2tzLm1hcChzID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikubWFwKGxpbmUgPT4gc3BsaXRUYXNrTGFiZWxzKGxpbmUsIHBrZy5sYWJlbHMgPz8gW10pKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgeyBuZXcgTm90aWNlKFwiUGFjb3RlIHNlbSB0YXJlZmFzLlwiKTsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMubGF1bmNoaW5nLmhhcyhwa2cuaWQpKSByZXR1cm47ICAgLy8galx1MDBFMSBlc3RcdTAwRTEgbGFuXHUwMEU3YW5kbyBcdTIxOTIgaWdub3JhIGNsaXF1ZS1kdXBsb1xuXG4gICAgLy8gQ29uZmlybWFcdTAwRTdcdTAwRTNvIGNvbmZvcm1lIGEgY29uZmlndXJhXHUwMEU3XHUwMEUzbyAoc2VtcHJlIC8gc1x1MDBGMyBtdWl0YXMgLyBudW5jYSkuXG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtO1xuICAgIGNvbnN0IG5lZWRDb25maXJtID0gbW9kZSA9PT0gXCJhbHdheXNcIiB8fCAobW9kZSA9PT0gXCJtYW55XCIgJiYgaXRlbXMubGVuZ3RoID4gTEFVTkNIX0NPTkZJUk1fTUlOKTtcbiAgICBpZiAobmVlZENvbmZpcm0pIHtcbiAgICAgIGNvbnN0IG9rID0gYXdhaXQgY29uZmlybU1vZGFsKHRoaXMuYXBwLCB7XG4gICAgICAgIHRpdGxlOiBgTGFuXHUwMEU3YXIgXHUyMDFDJHtwa2cubmFtZSB8fCBcInBhY290ZVwifVx1MjAxRD9gLFxuICAgICAgICBib2R5OiBgSXNzbyB2YWkgY3JpYXIgJHtpdGVtcy5sZW5ndGh9IHRhcmVmYShzKSBubyBUb2RvaXN0IGNvbSBkYXRhIGRlIGhvamU6YCxcbiAgICAgICAgaXRlbXM6IGl0ZW1zLm1hcChpdCA9PiAoe1xuICAgICAgICAgIHRleHQ6IGl0LnRpdGxlLFxuICAgICAgICAgIGxhYmVsczogaXQubGFiZWxzLm1hcChuID0+ICh7IG5hbWU6IG4sIGNvbG9yOiB0aGlzLmxhYmVsQ29sb3IobikgfSkpLFxuICAgICAgICB9KSksXG4gICAgICAgIGN0YTogYExhblx1MDBFN2FyICR7aXRlbXMubGVuZ3RofWAsXG4gICAgICB9KTtcbiAgICAgIGlmICghb2spIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhdW5jaGluZy5hZGQocGtnLmlkKTtcbiAgICB0aGlzLnJlcmVuZGVyQWxsKCk7ICAgLy8gbW9zdHJhIG8gYm90XHUwMEUzbyBjb21vIFwibGFuXHUwMEU3YW5kb1x1MjAyNlwiXG4gICAgY29uc3QgZHVlID0gdG9LZXkobmV3IERhdGUoKSk7XG4gICAgbGV0IG9rID0gMDtcbiAgICB0cnkge1xuICAgICAgZm9yIChjb25zdCB7IHRpdGxlLCBsYWJlbHMgfSBvZiBpdGVtcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGZpZWxkczogVG9kb2lzdFdyaXRlID0geyBjb250ZW50OiB0aXRsZSwgZHVlX2RhdGU6IGR1ZSB9O1xuICAgICAgICAgIGlmIChwa2cucHJvamVjdElkKSBmaWVsZHMucHJvamVjdF9pZCA9IHBrZy5wcm9qZWN0SWQ7XG4gICAgICAgICAgaWYgKGxhYmVscy5sZW5ndGgpIGZpZWxkcy5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICAgICAgYXdhaXQgY3JlYXRlVG9kb2lzdFRhc2sodG9rZW4sIGZpZWxkcyk7XG4gICAgICAgICAgb2srKztcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIG5ldyBOb3RpY2UoYEZhbGhhIGVtIFwiJHt0aXRsZX1cIjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sYXVuY2hpbmcuZGVsZXRlKHBrZy5pZCk7XG4gICAgfVxuICAgIG5ldyBOb3RpY2UoYFx1MjcxMyAke29rfS8ke2l0ZW1zLmxlbmd0aH0gdGFyZWZhKHMpIGxhblx1MDBFN2FkYShzKSBcdTIwMTQgJHtwa2cubmFtZSB8fCBcInBhY290ZVwifWApO1xuICAgIGF3YWl0IHRoaXMuZmV0Y2godHJ1ZSk7ICAgLy8gcmUtcmVuZGVyaXphIChsaW1wYSBvIGVzdGFkbyBcImxhblx1MDBFN2FuZG9cdTIwMjZcIilcbiAgfVxuXG4gIC8vIEJhcnJhIGRlIGxhblx1MDBFN2Fkb3JlcyBkZSBwYWNvdGVzLiBDb20gYGhlYWRpbmdgLCBtb250YSBhIHNlXHUwMEU3XHUwMEUzbyBcIlBBQ09URVNcIlxuICAvLyBjb21wbGV0YSAoYWJhIGRvIFRvZG9pc3QpOyBzZW0gZWxlLCBzXHUwMEYzIGEgYmFycmEgZGUgYm90XHUwMEY1ZXMgKGRhc2hib2FyZCwgZVxuICAvLyBzb21lIHF1YW5kbyBuXHUwMEUzbyBoXHUwMEUxIHBhY290ZXMgcGFyYSBtYW50ZXIgbyBwYWluZWwgZW54dXRvKS5cbiAgcmVuZGVyUGFja2FnZXMoaG9zdDogSFRNTEVsZW1lbnQsIG9wdHM6IHsgaGVhZGluZz86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgcGtncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICBsZXQgdGFyZ2V0ID0gaG9zdDtcbiAgICBpZiAob3B0cy5oZWFkaW5nKSB7XG4gICAgICBjb25zdCBzZWMgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiUEFDT1RFU1wiIH0pO1xuICAgICAgaWYgKCFwa2dzLmxlbmd0aCkge1xuICAgICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiQ3JpZSBwYWNvdGVzIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgXHUyMTkyIFBhY290ZXMgZGUgdGFyZWZhcy5cIiB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGFyZ2V0ID0gc2VjO1xuICAgIH0gZWxzZSBpZiAoIXBrZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGNvbnN0IGJhciA9IHRhcmdldC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJhclwiIH0pO1xuICAgIGZvciAoY29uc3QgcGtnIG9mIHBrZ3MpIHtcbiAgICAgIGNvbnN0IHZhbGlkID0gcGtnLnRhc2tzLmZpbHRlcihzID0+IHMudHJpbSgpKS5sZW5ndGg7XG4gICAgICBjb25zdCBidXN5ID0gdGhpcy5sYXVuY2hpbmcuaGFzKHBrZy5pZCk7XG4gICAgICBjb25zdCBkaXNhYmxlZCA9ICF0b2tlbiB8fCAhdmFsaWQgfHwgYnVzeTtcbiAgICAgIGNvbnN0IGJ0biA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGtnLWJ0blwiICsgKGRpc2FibGVkID8gXCIgd2QtcGtnLWRpc2FibGVkXCIgOiBcIlwiKSArIChidXN5ID8gXCIgd2QtcGtnLWJ1c3lcIiA6IFwiXCIpIH0pO1xuICAgICAgaWYgKHBrZy5pY29uKSByZW5kZXJJY29uKGJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29cIiB9KSwgcGtnLmljb24pO1xuICAgICAgYnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLW5hbWVcIiwgdGV4dDogcGtnLm5hbWUgfHwgXCIoc2VtIG5vbWUpXCIgfSk7XG4gICAgICBidG4uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1wa2ctY291bnRcIiwgdGV4dDogYnVzeSA/IFwiXHUyMDI2XCIgOiBTdHJpbmcodmFsaWQpIH0pO1xuICAgICAgYnRuLnNldEF0dHIoXCJ0aXRsZVwiLFxuICAgICAgICBidXN5ID8gXCJMYW5cdTAwRTdhbmRvXHUyMDI2XCIgOlxuICAgICAgICAhdG9rZW4gPyBcIkNvbmZpZ3VyZSBvIHRva2VuIGRvIFRvZG9pc3RcIiA6XG4gICAgICAgICF2YWxpZCA/IFwiUGFjb3RlIHNlbSB0YXJlZmFzXCIgOlxuICAgICAgICBgTGFuXHUwMEU3YXIgJHt2YWxpZH0gdGFyZWZhKHMpIG5vIFRvZG9pc3QgKGhvamUpYCk7XG4gICAgICBpZiAoIWRpc2FibGVkKSBjbGlja2FibGUoYnRuLCAoKSA9PiB2b2lkIHRoaXMubGF1bmNoUGFja2FnZShwa2cpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckZpbHRlckJhcihob3N0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RmlsdGVycztcbiAgICBjb25zdCBiYXIgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZpbHRlcmJhclwiIH0pO1xuICAgIGlmICh0aGlzLnByb2plY3RzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZ3JwID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWZncm91cFwiIH0pO1xuICAgICAgZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mbGFiZWxcIiwgdGV4dDogXCJQcm9qZXRvc1wiIH0pO1xuICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMucHJvamVjdHMpIHtcbiAgICAgICAgY29uc3Qgb24gPSBmLnByb2plY3RzLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICBjb25zdCBjaGlwID0gZ3JwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBwLm5hbWUgfSk7XG4gICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgY2xpY2thYmxlKGNoaXAsIGFzeW5jICgpID0+IHsgdGhpcy50b2dnbGVGaWx0ZXIoXCJwcm9qZWN0c1wiLCBwLmlkKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGxhYmVscyA9IFsuLi5uZXcgU2V0KHRoaXMudGFza3MuZmxhdE1hcCh0ID0+IHQubGFiZWxzID8/IFtdKSldLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gICAgaWYgKGxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGdycCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1mZ3JvdXBcIiB9KTtcbiAgICAgIGdycC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmxhYmVsXCIsIHRleHQ6IFwiRXRpcXVldGFzXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGFiZWxzKSB7XG4gICAgICAgIGNvbnN0IG9uID0gZi5sYWJlbHMuaW5jbHVkZXMobCk7XG4gICAgICAgIGNvbnN0IGNoaXAgPSB0aGlzLmxhYmVsQ2hpcChncnAsIGwsIFwid2QtdG9kby1mY2hpcFwiICsgKG9uID8gXCIgd2Qtb25cIiA6IFwiXCIpKTtcbiAgICAgICAgY2hpcC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhvbikpO1xuICAgICAgICBjbGlja2FibGUoY2hpcCwgYXN5bmMgKCkgPT4geyB0aGlzLnRvZ2dsZUZpbHRlcihcImxhYmVsc1wiLCBsKTsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmLnByb2plY3RzLmxlbmd0aCB8fCBmLmxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsciA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZmNsZWFyXCIsIHRleHQ6IFwibGltcGFyIGZpbHRyb3NcIiB9KTtcbiAgICAgIGNsaWNrYWJsZShjbHIsIGFzeW5jICgpID0+IHsgZi5wcm9qZWN0cyA9IFtdOyBmLmxhYmVscyA9IFtdOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZXJlbmRlckFsbCgpOyB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBSZW5kZXJpemEgb3MgY29udHJvbGVzIGRlIGNhYmVcdTAwRTdhbGhvIChlbSBgY3RybHNgKSArIGEgbGlzdGEgZGUgdGFyZWZhc1xuICAvLyAoZW0gYGJvZHlgKS4gTyBob3N0IGZvcm5lY2UgbyByXHUwMEYzdHVsbyBkYSBzZVx1MDBFN1x1MDBFM28gZSBvIGxheW91dCBkbyBjYWJlXHUwMEU3YWxoby5cbiAgcmVuZGVyTGlzdChib2R5OiBIVE1MRWxlbWVudCwgY3RybHM6IEhUTUxFbGVtZW50LCBvcHRzOiB7IHNob3dMYXRlcj86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRheVJhbmdlKCk7XG4gICAgICBjb25zdCBzZWcgPSBjdHJscy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yYW5nZVwiIH0pO1xuICAgICAgZm9yIChjb25zdCBuIG9mIFszLCA3XSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBiID0gc2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yYW5nZS1idG5cIiArIChyYW5nZSA9PT0gbiA/IFwiIHdkLW9uXCIgOiBcIlwiKSwgdGV4dDogYCR7bn1kYCB9KTtcbiAgICAgICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgYE1vc3RyYXIgb3MgcHJcdTAwRjN4aW1vcyAke259IGRpYXNgKTtcbiAgICAgICAgYi5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyhyYW5nZSA9PT0gbikpO1xuICAgICAgICBjbGlja2FibGUoYiwgYXN5bmMgZSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPSBuO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucmVyZW5kZXJBbGwoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBmID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgICBjb25zdCBuRiA9IGYucHJvamVjdHMubGVuZ3RoICsgZi5sYWJlbHMubGVuZ3RoO1xuICAgICAgY29uc3QgZmlsdCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0ZXJidG5cIiArICh0aGlzLmZpbHRlck9wZW4gPyBcIiB3ZC1vblwiIDogXCJcIikgKyAobkYgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihmaWx0LCBcImZpbHRlclwiKTtcbiAgICAgIGZpbHQuc2V0QXR0cihcInRpdGxlXCIsIG5GID8gYEZpbHRyb3MgYXRpdm9zICgke25GfSkgXHUyMDE0IGNsaXF1ZSBwYXJhIGFqdXN0YXJgIDogXCJGaWx0cmFyIHBvciBwcm9qZXRvL2V0aXF1ZXRhXCIpO1xuICAgICAgaWYgKG5GKSBmaWx0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1maWx0Y3RcIiwgdGV4dDogU3RyaW5nKG5GKSB9KTtcbiAgICAgIGZpbHQuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy5maWx0ZXJPcGVuKSk7XG4gICAgICBjbGlja2FibGUoZmlsdCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZmlsdGVyT3BlbiA9ICF0aGlzLmZpbHRlck9wZW47IHRoaXMucmVyZW5kZXJBbGwoKTsgfSk7XG4gICAgICBjb25zdCByZWZyZXNoID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJlZnJlc2hcIiArICh0aGlzLmxvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgdGFyZWZhcyBkbyBUb2RvaXN0XCIpO1xuICAgICAgY2xpY2thYmxlKHJlZnJlc2gsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMuZmV0Y2godHJ1ZSk7IH0pO1xuICAgICAgdGhpcy5hZGRUYXNrQnRuKGN0cmxzLCB1bmRlZmluZWQsIFwiTm92YSB0YXJlZmFcIik7XG4gICAgfVxuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb2xlIHNldSB0b2tlbiBkbyBUb2RvaXN0IGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgcGFyYSB2ZXIgc3VhcyB0YXJlZmFzIGFxdWkuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQXV0by1mZXRjaDogbnVuY2EgYnVzY291LCBvdSBvIGNhY2hlIHBhc3NvdSBkbyBUVEwuIEVycm8gblx1MDBFM28gZGlzcGFyYSByZS10ZW50YXRpdmFcbiAgICAvLyBhdXRvbVx1MDBFMXRpY2EgYXF1aSAoZXZpdGFyaWEgbG9vcCBhIGNhZGEgcmVuZGVyKTsgbyBpbnRlcnZhbG8gZSBvIGJvdFx1MDBFM28gXHUyMUJCIGN1aWRhbSBkaXNzby5cbiAgICBpZiAoIXRoaXMubG9hZGluZyAmJiAhdGhpcy5lcnJvciAmJiAoIXRoaXMuZmV0Y2hlZEF0IHx8IHRoaXMuaXNTdGFsZSgpKSkgdm9pZCB0aGlzLmZldGNoKGZhbHNlKTtcbiAgICBjb25zdCBoYXNDYWNoZSA9IHRoaXMudGFza3MubGVuZ3RoID4gMDtcbiAgICAvLyBFcnJvL2NhcnJlZ2FuZG8gc1x1MDBGMyBvY3VwYW0gYSBcdTAwRTFyZWEgdG9kYSBxdWFuZG8gTlx1MDBDM08gaFx1MDBFMSBjYWNoZSBwYXJhIG1vc3RyYXIgKG9mZmxpbmUtZnJpZW5kbHkpLlxuICAgIGlmICh0aGlzLmVycm9yICYmICFoYXNDYWNoZSkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGJ1c2NhciB0YXJlZmFzOiAke3RoaXMuZXJyb3J9YCB9KTsgcmV0dXJuOyB9XG4gICAgaWYgKCF0aGlzLmZldGNoZWRBdCAmJiAhaGFzQ2FjaGUpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvIHRhcmVmYXNcdTIwMjZcIiB9KTsgcmV0dXJuOyB9XG4gICAgdGhpcy5yZW5kZXJGcmVzaG5lc3MoYm9keSk7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJPcGVuKSB0aGlzLnJlbmRlckZpbHRlckJhcihib2R5KTtcblxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXlSYW5nZSgpO1xuICAgIGNvbnN0IHRvZGF5SyA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGNvbnN0IGxhc3RVcGNvbWluZyA9IG5ldyBEYXRlKCk7XG4gICAgbGFzdFVwY29taW5nLnNldERhdGUobGFzdFVwY29taW5nLmdldERhdGUoKSArIHJhbmdlKTtcbiAgICBjb25zdCBsYXN0SyA9IHRvS2V5KGxhc3RVcGNvbWluZyk7XG5cbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuYXBwbHlGaWx0ZXJzKHRoaXMudGFza3MpO1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCB0b2RheVRhc2tzOiBUb2RvaXN0VGFza1tdID0gW107XG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3QgbGF0ZXI6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBjb25zdCBub0RhdGU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgeyBub0RhdGUucHVzaCh0KTsgY29udGludWU7IH1cbiAgICAgIGlmIChkayA8IHRvZGF5Sykgb3ZlcmR1ZS5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPT09IHRvZGF5SykgdG9kYXlUYXNrcy5wdXNoKHQpO1xuICAgICAgZWxzZSBpZiAoZGsgPD0gbGFzdEspIChieURheVtka10gPz89IFtdKS5wdXNoKHQpO1xuICAgICAgZWxzZSBsYXRlci5wdXNoKHQpO1xuICAgIH1cbiAgICBjb25zdCBieVByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIC8vIFwiRGVwb2lzXCI6IG9yZGVuYSBwb3IgREFUQSAobWFpcyBwclx1MDBGM3hpbWEgcHJpbWVpcm8pIGUsIG5vIG1lc21vIGRpYSwgcG9yIHByaW9yaWRhZGUuXG4gICAgY29uc3QgYnlEYXRlVGhlblByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IHtcbiAgICAgIGNvbnN0IGRhID0gZHVlS2V5KGEpID8/IFwiXCIsIGRiID0gZHVlS2V5KGIpID8/IFwiXCI7XG4gICAgICBpZiAoZGEgIT09IGRiKSByZXR1cm4gZGEgPCBkYiA/IC0xIDogMTtcbiAgICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTtcbiAgICB9O1xuICAgIG92ZXJkdWUuc29ydChieVByaSk7IHRvZGF5VGFza3Muc29ydChieVByaSk7IGxhdGVyLnNvcnQoYnlEYXRlVGhlblByaSk7IG5vRGF0ZS5zb3J0KGJ5UHJpKTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoYnlEYXkpKSBieURheVtrXS5zb3J0KGJ5UHJpKTtcblxuICAgIC8vIFwiRGVwb2lzXCIgZSBcIlNlbSBkYXRhXCIgc1x1MDBGMyBhcGFyZWNlbSBuYSBhYmEgZGVkaWNhZGEgKHNob3dMYXRlciAhPT0gZmFsc2UpLlxuICAgIGNvbnN0IHNob3dFeHRyYSA9IG9wdHMuc2hvd0xhdGVyICE9PSBmYWxzZTtcbiAgICBjb25zdCB2aXNpYmxlID0gb3ZlcmR1ZS5sZW5ndGggKyB0b2RheVRhc2tzLmxlbmd0aCArIGxhdGVyLmxlbmd0aFxuICAgICAgKyBPYmplY3QudmFsdWVzKGJ5RGF5KS5yZWR1Y2UoKHMsIGEpID0+IHMgKyBhLmxlbmd0aCwgMClcbiAgICAgICsgKHNob3dFeHRyYSA/IG5vRGF0ZS5sZW5ndGggOiAwKTtcbiAgICBpZiAodmlzaWJsZSA9PT0gMCkge1xuICAgICAgY29uc3QgZiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RGaWx0ZXJzO1xuICAgICAgY29uc3QgZmlsdGVyZWQgPSAhIShmLnByb2plY3RzLmxlbmd0aCB8fCBmLmxhYmVscy5sZW5ndGgpO1xuICAgICAgY29uc3QgbXNnID0gZmlsdGVyZWQgPyBcIk5lbmh1bWEgdGFyZWZhIGJhdGUgY29tIG9zIGZpbHRyb3MuXCJcbiAgICAgICAgOiBzaG93RXh0cmEgPyBcIk5lbmh1bWEgdGFyZWZhIG5vIFRvZG9pc3QuIFx1RDgzQ1x1REY4OVwiXG4gICAgICAgIDogXCJOZW5odW1hIHRhcmVmYSBhZ2VuZGFkYS4gXHVEODNDXHVERjg5XCI7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBtc2cgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29scyA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tY29sc1wiIH0pO1xuXG4gICAgY29uc3Qgb2JveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC1vdmVyZHVlXCIgfSk7XG4gICAgY29uc3Qgb2hkID0gb2JveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hoZFwiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94d2FyblwiLCB0ZXh0OiBcIlx1MjZBMFwiIH0pO1xuICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tYm94bGFiZWxcIiwgdGV4dDogXCJBdHJhc2FkYXNcIiB9KTtcbiAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyhvdmVyZHVlLmxlbmd0aCkgfSk7XG4gICAgY29uc3Qgb2JvZHkgPSBvYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGJvZHlcIiB9KTtcbiAgICBpZiAob3ZlcmR1ZS5sZW5ndGgpIGZvciAoY29uc3QgdCBvZiBvdmVyZHVlKSB0aGlzLnRvZG9Sb3cob2JvZHksIHQpO1xuICAgIGVsc2Ugb2JvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hLiBcdUQ4M0RcdURDNERcIiB9KTtcblxuICAgIGNvbnN0IHRib3ggPSBjb2xzLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveCB3ZC1ib3gtdG9kYXlcIiB9KTtcbiAgICBjb25zdCB0aGQgPSB0Ym94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGhkXCIgfSk7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hsYWJlbFwiLCB0ZXh0OiBcIkhvamVcIiB9KTtcbiAgICB0aGlzLmFkZFRhc2tCdG4odGhkLCBcImhvamVcIiwgXCJOb3ZhIHRhcmVmYSBwYXJhIGhvamVcIik7XG4gICAgdGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1ib3hjb3VudFwiLCB0ZXh0OiBTdHJpbmcodG9kYXlUYXNrcy5sZW5ndGgpIH0pO1xuICAgIGNvbnN0IHRib2R5ID0gdGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1ib3hib2R5XCIgfSk7XG4gICAgaWYgKHRvZGF5VGFza3MubGVuZ3RoKSBmb3IgKGNvbnN0IHQgb2YgdG9kYXlUYXNrcykgdGhpcy50b2RvUm93KHRib2R5LCB0KTtcbiAgICBlbHNlIHRib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWJveGVtcHR5XCIsIHRleHQ6IFwiTmFkYSBwYXJhIGhvamUuXCIgfSk7XG5cbiAgICBsZXQgdXBjb21pbmdDb3VudCA9IDA7XG4gICAgY29uc3QgdXBEYXlzOiB7IGRvdzogbnVtYmVyOyBudW06IG51bWJlcjsga2V5OiBzdHJpbmc7IGl0ZW1zOiBUb2RvaXN0VGFza1tdIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHJhbmdlOyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XG4gICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldO1xuICAgICAgaWYgKCFpdGVtcz8ubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgIHVwY29taW5nQ291bnQgKz0gaXRlbXMubGVuZ3RoO1xuICAgICAgdXBEYXlzLnB1c2goeyBkb3c6IChkYXkuZ2V0RGF5KCkgKyA2KSAlIDcsIG51bTogZGF5LmdldERhdGUoKSwga2V5LCBpdGVtcyB9KTtcbiAgICB9XG4gICAgY29uc3QgdWJveCA9IGNvbHMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94IHdkLWJveC11cGNvbWluZ1wiIH0pO1xuICAgIGNvbnN0IHVoZCA9IHVib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94aGRcIiB9KTtcbiAgICB1aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGxhYmVsXCIsIHRleHQ6IGBQclx1MDBGM3hpbW9zICR7cmFuZ2V9IGRpYXNgIH0pO1xuICAgIHRoaXMuYWRkVGFza0J0bih1aGQsIHVuZGVmaW5lZCwgXCJOb3ZhIHRhcmVmYVwiKTtcbiAgICB1aGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWJveGNvdW50XCIsIHRleHQ6IFN0cmluZyh1cGNvbWluZ0NvdW50KSB9KTtcbiAgICBjb25zdCB1Ym9keSA9IHVib3guY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94Ym9keVwiIH0pO1xuICAgIGlmICh1cERheXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGNvbnN0IGcgb2YgdXBEYXlzKSB7XG4gICAgICAgIGNvbnN0IGRoID0gdWJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZGF5aGRcIiArIChnLmRvdyA+PSA1ID8gXCIgd2Qtd2Vla2VuZFwiIDogXCJcIikgfSk7XG4gICAgICAgIGRoLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXluYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtnLmRvd10gfSk7XG4gICAgICAgIGRoLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXludW1cIiwgdGV4dDogU3RyaW5nKGcubnVtKSB9KTtcbiAgICAgICAgdGhpcy5hZGRUYXNrQnRuKGRoLCBnLmtleSwgYE5vdmEgdGFyZWZhIGVtICR7Zy5udW19YCk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBnLml0ZW1zKSB0aGlzLnRvZG9Sb3codWJvZHksIHQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdWJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tYm94ZW1wdHlcIiwgdGV4dDogYE5hZGEgbm9zIHByXHUwMEYzeGltb3MgJHtyYW5nZX0gZGlhcy5gIH0pO1xuICAgIH1cblxuICAgIGlmIChsYXRlci5sZW5ndGggJiYgc2hvd0V4dHJhKSB7XG4gICAgICBjb25zdCBwYW5lbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tbGF0ZXJcIiB9KTtcbiAgICAgIGNvbnN0IGxoZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1sYXRlcmljb1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgbGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYERlcG9pcyAoJHtsYXRlci5sZW5ndGh9KWAgfSk7XG4gICAgICBsaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90b2dnbGVcIiwgdGV4dDogdGhpcy5sYXRlck9wZW4gPyBcIm9jdWx0YXIgXHUyNUJFXCIgOiBcIm1vc3RyYXIgXHUyMDNBXCIgfSk7XG4gICAgICBsaGQuc2V0QXR0cihcImFyaWEtZXhwYW5kZWRcIiwgU3RyaW5nKHRoaXMubGF0ZXJPcGVuKSk7XG4gICAgICBjbGlja2FibGUobGhkLCAoKSA9PiB7IHRoaXMubGF0ZXJPcGVuID0gIXRoaXMubGF0ZXJPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgaWYgKHRoaXMubGF0ZXJPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbGF0ZXIpIHRoaXMudG9kb1JvdyhsaXN0LCB0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9EYXRlLmxlbmd0aCAmJiBzaG93RXh0cmEpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1sYXRlciB3ZC10b2RvLW5vZGF0ZVwiIH0pO1xuICAgICAgY29uc3QgbmhkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2hkXCIgfSk7XG4gICAgICBuaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWxhdGVyaWNvXCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgICBuaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90aXRsZVwiLCB0ZXh0OiBgU2VtIGRhdGEgKCR7bm9EYXRlLmxlbmd0aH0pYCB9KTtcbiAgICAgIG5oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RvZ2dsZVwiLCB0ZXh0OiB0aGlzLm5vRGF0ZU9wZW4gPyBcIm9jdWx0YXIgXHUyNUJFXCIgOiBcIm1vc3RyYXIgXHUyMDNBXCIgfSk7XG4gICAgICBuaGQuc2V0QXR0cihcImFyaWEtZXhwYW5kZWRcIiwgU3RyaW5nKHRoaXMubm9EYXRlT3BlbikpO1xuICAgICAgY2xpY2thYmxlKG5oZCwgKCkgPT4geyB0aGlzLm5vRGF0ZU9wZW4gPSAhdGhpcy5ub0RhdGVPcGVuOyB0aGlzLnJlcmVuZGVyQWxsKCk7IH0pO1xuICAgICAgaWYgKHRoaXMubm9EYXRlT3Blbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2xpc3RcIiB9KTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIG5vRGF0ZSkgdGhpcy50b2RvUm93KGxpc3QsIHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgc2VjSG9zdHMgPSBuZXcgTWFwPFNlY3Rpb25JZCwgSFRNTEVsZW1lbnQ+KCk7ICAgLy8gd3JhcHBlciBlc3RcdTAwRTF2ZWwgcG9yIHNlXHUwMEU3XHUwMEUzb1xuICBwcml2YXRlIHVuc3ViVG9kbzogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7ICAgICAgICAgIC8vIGNhbmNlbGFyIGluc2NyaVx1MDBFN1x1MDBFM28gbm8gY29udHJvbGxlclxuXG4gIC8vIEVzdGFkbyBkbyBTeW5jdGhpbmcgKHYwLjEwLjApXG4gIHByaXZhdGUgc3luY0RhdGE6IFN5bmNEYXRhIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzeW5jRXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN5bmNGZXRjaGVkQXQgPSAwO1xuICBwcml2YXRlIGNvbmZsaWN0Q29uZmlybTogc3RyaW5nIHwgbnVsbCA9IG51bGw7ICAgLy8gcGF0aCBkbyBjb25mbGl0byBhZ3VhcmRhbmRvIGNvbmZpcm1hXHUwMEU3XHUwMEUzb1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICAvLyBJbnNjcmV2ZSBubyBjb250cm9sbGVyIFx1MDBGQW5pY286IG11ZGFuXHUwMEU3YSBkZSBlc3RhZG8gcmUtcmVuZGVyaXphIHNcdTAwRjMgYSBzZVx1MDBFN1x1MDBFM28gVGFyZWZhcy5cbiAgICB0aGlzLnVuc3ViVG9kbyA9IHRoaXMucGx1Z2luLnRvZG8uc3Vic2NyaWJlKCgpID0+IHRoaXMucmVuZGVyU2VjdGlvbihcInRvZG9pc3RcIikpO1xuICAgIGZvciAoY29uc3QgZXYgb2YgW1wibW9kaWZ5XCIsIFwiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwicmVuYW1lXCJdIGFzIGNvbnN0KVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKGV2IGFzIFwibW9kaWZ5XCIsICgpID0+IHsgdGhpcy5wbHVnaW4uaW52YWxpZGF0ZVZhdWx0Q2FjaGUoKTsgdGhpcy5zY2hlZHVsZSgpOyB9KSk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCkge1xuICAgIHRoaXMudW5zdWJUb2RvPy4oKTtcbiAgICB0aGlzLnVuc3ViVG9kbyA9IG51bGw7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gIH1cblxuICAvLyBSZS1yZW5kZXIgcFx1MDBGQWJsaWNvIFx1MjAxNCBjaGFtYWRvIHBlbG8gcGx1Z2luIHF1YW5kbyBhIGNvbmZpZ3VyYVx1MDBFN1x1MDBFM28gbXVkYSBuYSBhYmFcbiAgLy8gZGUgQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgKG9yZGVtIGRhcyBzZVx1MDBFN1x1MDBGNWVzLCBvY3VsdGFyL21vc3RyYXIsIGZvbnRlcyBkYSBTZW1hbmEpLlxuICByZWZyZXNoKCkgeyB2b2lkIHRoaXMucmVuZGVyKCk7IH1cblxuICBwcml2YXRlIHNjaGVkdWxlKCkge1xuICAgIGlmICh0aGlzLnRpbWVyKSBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXIoKSwgNDAwKTtcbiAgfVxuXG4gIC8vIFByaW1laXJvIHNlZ21lbnRvIGRlIHVtIGNhbWluaG8gKFwiMTAuUHJvamVjdHMvRm9vL0JhclwiIFx1MjE5MiBcIjEwLlByb2plY3RzXCIpLlxuICBwcml2YXRlIHRvcEZvbGRlck9mKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaSA9IHBhdGguaW5kZXhPZihcIi9cIik7XG4gICAgcmV0dXJuIGkgPT09IC0xID8gcGF0aCA6IHBhdGguc2xpY2UoMCwgaSk7XG4gIH1cblxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtY29tcGFjdFwiLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KTtcblxuICAgIHRoaXMucmVuZGVySGVhZGVyKHJvb3QpO1xuICAgIC8vIENhZGEgc2VcdTAwRTdcdTAwRTNvIG1vcmEgbnVtIGhvc3QgZXN0XHUwMEUxdmVsIFx1MjE5MiBkXHUwMEUxIHBhcmEgcmUtcmVuZGVyaXphciB1bWEgc2VcdTAwRTdcdTAwRTNvIHNcdTAwRjNcbiAgICAvLyAoZXguOiByZWZyZXNoIGRvIFRvZG9pc3QvU3luY3RoaW5nKSBzZW0gcmVjb25zdHJ1aXIgYSB2aWV3IGludGVpcmEuXG4gICAgdGhpcy5zZWNIb3N0cy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyKSB7XG4gICAgICBjb25zdCBob3N0ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhvc3RcIiB9KTtcbiAgICAgIHRoaXMuc2VjSG9zdHMuc2V0KGlkLCBob3N0KTtcbiAgICAgIHRoaXMucmVuZGVyU2VjdGlvbihpZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmUtcmVuZGVyaXphIGFwZW5hcyBhIHNlXHUwMEU3XHUwMEUzbyBgaWRgIGRlbnRybyBkbyBzZXUgaG9zdCAoc2VtIHRvY2FyIG5hcyBvdXRyYXMpLlxuICBwcml2YXRlIHJlbmRlclNlY3Rpb24oaWQ6IFNlY3Rpb25JZCkge1xuICAgIGNvbnN0IGhvc3QgPSB0aGlzLnNlY0hvc3RzLmdldChpZCk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5lbXB0eSgpO1xuICAgIGlmIChpZCA9PT0gXCJjYWxlbmRhclwiKSAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJwYXJhXCIpICAgIHRoaXMucmVuZGVyUGFyYShob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJoZWF0bWFwXCIpIHRoaXMucmVuZGVySGVhdG1hcChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJncm93dGhcIikgIHRoaXMucmVuZGVyR3Jvd3RoKGhvc3QpO1xuICAgIGVsc2UgaWYgKGlkID09PSBcInN0YXRzXCIpICAgdGhpcy5yZW5kZXJTdGF0cyhob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJ0b2RvaXN0XCIpIHRoaXMucmVuZGVyVG9kb2lzdChob3N0KTtcbiAgICBlbHNlIGlmIChpZCA9PT0gXCJzeW5jXCIpICAgIHRoaXMucmVuZGVyU3luYyhob3N0KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBPY3VsdGFyIChsZWl0dXJhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gTW9zdHJhci9vY3VsdGFyIGUgYSBvcmRlbSBkYXMgc2VcdTAwRTdcdTAwRjVlcyBzXHUwMEUzbyBhZG1pbmlzdHJhZG9zIG5hIGFiYSBkZVxuICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBkbyBwbHVnaW4uIEEgdmlldyBzXHUwMEYzICpsXHUwMEVBKiBgc2V0dGluZ3MuaGlkZGVuYCBwYXJhIHB1bGFyIG8gcXVlXG4gIC8vIGVzdFx1MDBFMSBvY3VsdG8uIFZlciBXZXJ1c1NldHRpbmdUYWIuXG5cbiAgcHJpdmF0ZSBpc0hpZGRlbihrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBUb29sdGlwIGRlIG5vdGFzIHJlY2VudGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgc2hvd1RpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBmaWxlczogVEZpbGVbXSkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHRpcCA9IGRvY3VtZW50LmJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvb2x0aXBcIiB9KTtcbiAgICB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC10aXRsZVwiLCB0ZXh0OiBcIk1vZGlmaWNhZGFzIHJlY2VudGVtZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBQb3NpY2lvbmEgdW0gdG9vbHRpcCBmaXhvIGFiYWl4byBkbyBhbHZvICh2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN28pLlxuICBwcml2YXRlIHBvc2l0aW9uVGlwKHRpcDogSFRNTEVsZW1lbnQsIHRhcmdldDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR3ID0gdGlwLm9mZnNldFdpZHRoLCB0aCA9IHRpcC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGxlZnQgPSByZWN0LmxlZnQ7XG4gICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgNjtcbiAgICBpZiAobGVmdCArIHR3ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0dyAtIDg7XG4gICAgaWYgKHRvcCArIHRoID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgdG9wID0gcmVjdC50b3AgLSB0aCAtIDY7ICAvLyB2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN29cbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICB9XG5cbiAgLy8gVG9vbHRpcCBsaXN0YW5kbyBhcyBub3RhcyB1cmdlbnRlcyBkZSB1bWEgcGFzdGEgKGhvdmVyIG5vIGJhZGdlIGRlIGF2aXNvKS5cbiAgcHJpdmF0ZSBzaG93VXJnZW5jeVRpcCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBpdGVtczogeyBmaWxlOiBURmlsZTsgbGV2ZWw6IFVyZ2VuY3kgfVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC11cmdlbmN5LXRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiVXJnZW50ZVwiIH0pO1xuICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgY29uc3QgZG90ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdXRpcC1kb3RcIiB9KTtcbiAgICAgIGRvdC5zdHlsZS5iYWNrZ3JvdW5kID0gVVJHRU5DWV9DT0xPUltpdC5sZXZlbF07XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtbmFtZVwiLCB0ZXh0OiBpdC5maWxlLmJhc2VuYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLWRhdGVcIiwgdGV4dDogaXQubGV2ZWwgfSk7XG4gICAgfVxuICAgIHRoaXMudGlwID0gdGlwO1xuICAgIHRoaXMucG9zaXRpb25UaXAodGlwLCB0YXJnZXQpO1xuICB9XG5cbiAgLy8gQmFkZ2UgZGUgYXZpc28gKHRyaVx1MDBFMm5ndWxvKSBubyBjYXJkIGRlIHBhc3RhIHF1ZSBjb250XHUwMEU5bSBub3RhcyBjb20gYHVyZ2VuY3lgLlxuICAvLyBDb3IgcGVsbyBuXHUwMEVEdmVsIG1cdTAwRTF4aW1vOyBob3ZlciBsaXN0YSBvcyBhcnF1aXZvcy4gRmFzZSAxMC5cbiAgcHJpdmF0ZSB1cmdlbmN5QmFkZ2UoY2FyZDogSFRNTEVsZW1lbnQsIHVyZzogVXJnZW5jeUluZm8pIHtcbiAgICBpZiAoIXVyZy5tYXgpIHJldHVybjtcbiAgICBjb25zdCBiID0gY2FyZC5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1iYWRnZSB3ZC11LSR7dXJnLm1heH1gIH0pO1xuICAgIHNldEljb24oYiwgXCJ0cmlhbmdsZS1hbGVydFwiKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1VyZ2VuY3lUaXAoYiwgdXJnLml0ZW1zKSk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUaXAoKSB7XG4gICAgaWYgKHRoaXMudGlwKSB7IHRoaXMudGlwLnJlbW92ZSgpOyB0aGlzLnRpcCA9IG51bGw7IH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGlwKGNhcmQ6IEhUTUxFbGVtZW50LCByZWNlbnRzOiBURmlsZVtdKSB7XG4gICAgaWYgKCFyZWNlbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGlwKGNhcmQsIHJlY2VudHMpKTtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIFN1YnBhc3RhcyBleGliXHUwMEVEdmVpcyAoaWdub3JhIHBhc3RhcyBzXHUwMEYzLWRlLWltYWdlbnMpLCB2aWEgY2FjaGUgZG8gY29mcmUuXG4gIHByaXZhdGUgc3ViRm9sZGVyc09mKGZvbGRlcjogVEZvbGRlcik6IFRGb2xkZXJbXSB7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCk7XG4gICAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiB7IGNvbnN0IGEgPSBjYWNoZS5ieUZvbGRlci5nZXQoZi5wYXRoKTsgcmV0dXJuICEoYSAmJiBhLmltZyA+IDAgJiYgYS5tZCA9PT0gMCk7IH0pXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYWxlbmRcdTAwRTFyaW8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYWxlbmRhcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19DQUwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtb25kYXkgID0gbW9uZGF5T2YodGhpcy53ZWVrT2Zmc2V0KTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuICAgIGNvbnN0IHRvZGF5SyAgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIEZvbnRlcyBhdGl2YXMgKHBhc3RhcyBtYXJjYWRhcykuIEEgY29yIGRlIGNhZGEgbm90YSB2ZW0gZGEgZm9udGUgZGVcbiAgICAvLyBwcmVmaXhvIG1haXMgZXNwZWNcdTAwRURmaWNvIHF1ZSBhIGNvbnRcdTAwRTltLlxuICAgIGNvbnN0IHNvdXJjZXMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMuZmlsdGVyKHMgPT4gcy5vbik7XG4gICAgY29uc3QgY29sb3JGb3IgPSAocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBsZXQgYmVzdDogQ2FsU291cmNlIHwgbnVsbCA9IG51bGw7XG4gICAgICBmb3IgKGNvbnN0IHMgb2Ygc291cmNlcykge1xuICAgICAgICBpZiAocGF0aCA9PT0gYCR7cy5wYXRofS5tZGAgfHwgcGF0aC5zdGFydHNXaXRoKGAke3MucGF0aH0vYCkpIHtcbiAgICAgICAgICBpZiAoIWJlc3QgfHwgcy5wYXRoLmxlbmd0aCA+IGJlc3QucGF0aC5sZW5ndGgpIGJlc3QgPSBzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdCA/IGJlc3QuY29sb3IgOiBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBcyBub3RhcyBjb20gZGF0YSBqXHUwMEUxIHZcdTAwRUFtIGRvIGNhY2hlICh1bWEgcGFzc2FkYSk7IGFxdWkgc1x1MDBGMyBmaWx0cmEgcG9yIGZvbnRlLlxuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZzsgZmlsZTogVEZpbGU7IGNvbG9yOiBzdHJpbmcgfVtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgeyBmaWxlLCBkYXRlIH0gb2YgdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpLmRhdGVkTm90ZXMpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gY29sb3JGb3IoZmlsZS5wYXRoKTtcbiAgICAgIGlmICghY29sb3IpIGNvbnRpbnVlOyAgIC8vIHNcdTAwRjMgbm90YXMgZGVudHJvIGRlIHVtYSBmb250ZSBtYXJjYWRhXG4gICAgICAoYnlEYXlbZGF0ZV0gPz89IFtdKS5wdXNoKHsgbmFtZTogZmlsZS5iYXNlbmFtZSwgZmlsZSwgY29sb3IgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1jYWwtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IG5hdiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hdi1iYXJcIiB9KTtcbiAgICBjb25zdCBwaG9uZSA9IFBsYXRmb3JtLmlzUGhvbmU7XG5cbiAgICAvLyBDZWx1bGFyOiBqYW5lbGEgZGUgMyBkaWFzID0gb250ZW0gXHUwMEI3IGhvamUgXHUwMEI3IGFtYW5oXHUwMEUzICh3ZWVrT2Zmc2V0IHBhZ2luYSBkZSAzIGVtIDMpLlxuICAgIGNvbnN0IGRheUFuY2hvciA9IG5ldyBEYXRlKCk7XG4gICAgZGF5QW5jaG9yLnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSAtIDEgKyB0aGlzLndlZWtPZmZzZXQgKiAzKTtcbiAgICBjb25zdCBmbXRETSA9IChkOiBEYXRlKSA9PiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG5cbiAgICBpZiAocGhvbmUpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSBuZXcgRGF0ZShkYXlBbmNob3IpOyBsYXN0LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIDIpO1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYCR7Zm10RE0oZGF5QW5jaG9yKX0gXHUyMDEzICR7Zm10RE0obGFzdCl9YCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYFJlbGF0XHUwMEYzcmlvcyBcdTAwQjcgc2VtYW5hICR7d2Vla051bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGN0cmxzID0gbmF2LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtY3RybHNcIiB9KTtcbiAgICBjb25zdCBwcmV2ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwMzlcIiB9KTtcbiAgICBjb25zdCBuZXh0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICBwcmV2LnNldEF0dHIoXCJ0aXRsZVwiLCBcIlNlbWFuYSBhbnRlcmlvclwiKTtcbiAgICBuZXh0LnNldEF0dHIoXCJ0aXRsZVwiLCBcIlByXHUwMEYzeGltYSBzZW1hbmFcIik7XG4gICAgY2xpY2thYmxlKHByZXYsICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0LS07IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNsaWNrYWJsZShuZXh0LCAoKSA9PiB7IHRoaXMud2Vla09mZnNldCsrOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDZWx1bGFyOiBsaXN0YSB2ZXJ0aWNhbCBkZSAzIGRpYXMgKG9udGVtL2hvamUvYW1hbmhcdTAwRTMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENhZGEgZGlhID0gYSBub3RhIGRpXHUwMEUxcmlhICh1bWEgcG9yIGRpYSkuIExpbmhhIGludGVpcmEgY2xpY1x1MDBFMXZlbDogYWJyZSBhXG4gICAgLy8gZXhpc3RlbnRlOyBzZSBuXHUwMEUzbyBob3V2ZXIsIGNyaWEuXG4gICAgaWYgKHBob25lKSB7XG4gICAgICBjb25zdCBsaXN0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbGlzdFwiIH0pO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoZGF5QW5jaG9yKTtcbiAgICAgICAgZGF5LnNldERhdGUoZGF5QW5jaG9yLmdldERhdGUoKSArIGkpO1xuICAgICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgICBjb25zdCBkb3cgPSAoZGF5LmdldERheSgpICsgNikgJSA3O1xuICAgICAgICBjb25zdCBub3RlID0gdGhpcy5maW5kRGFpbHlOb3RlKGtleSk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IFtcIndkLWNhbC1kcm93XCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgZG93ID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5zZXRBdHRyKFwidGl0bGVcIiwgbm90ZSA/IFwiQWJyaXIgbm90YSBkaVx1MDBFMXJpYVwiIDogXCJDcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgICBjb25zdCBoZCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWRyb3ctaGRcIiB9KTtcbiAgICAgICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbZG93XSB9KTtcbiAgICAgICAgaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgICAgY29uc3QgYm9keSA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWRyb3ctbm90ZXNcIiB9KTtcbiAgICAgICAgaWYgKG5vdGUpIHtcbiAgICAgICAgICBjb25zdCBwaWxsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgICBwaWxsLnRleHRDb250ZW50ID0gbm90ZS5iYXNlbmFtZS5sZW5ndGggPiAyNCA/IG5vdGUuYmFzZW5hbWUuc2xpY2UoMCwgMjQpICsgXCJcdTIwMjZcIiA6IG5vdGUuYmFzZW5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYm9keS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1kcm93LWVtcHR5XCIsIHRleHQ6IFwiY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNsaWNrYWJsZShyb3csICgpID0+IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBEZXNrdG9wL3RhYmxldDogZ3JhZGUgZGUgNyBkaWFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBjbGlja2FibGUoaGQsIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpOyB9KTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldID8/IFtdO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcy5zbGljZSgwLCAzKSkge1xuICAgICAgICBjb25zdCBwaWxsID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICBwaWxsLnN0eWxlLnNldFByb3BlcnR5KFwiLS13ZC1zcmNcIiwgaXQuY29sb3IpO1xuICAgICAgICBwaWxsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXBpbGwtZG90XCIgfSk7XG4gICAgICAgIHBpbGwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtcGlsbC10eHRcIiwgdGV4dDogaXQubmFtZS5sZW5ndGggPiAxNCA/IGl0Lm5hbWUuc2xpY2UoMCwgMTQpICsgXCJcdTIwMjZcIiA6IGl0Lm5hbWUgfSk7XG4gICAgICAgIHBpbGwuc2V0QXR0cihcInRpdGxlXCIsIGl0Lm5hbWUpO1xuICAgICAgICBjbGlja2FibGUocGlsbCwgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGl0LmZpbGUpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAzKSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1tb3JlXCIsIHRleHQ6IGArJHtpdGVtcy5sZW5ndGggLSAzfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICBlbmQuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgNik7XG4gICAgc2VjLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IFwid2QtY2FsLWZvb3RlclwiLFxuICAgICAgdGV4dDogbW9uZGF5LmdldE1vbnRoKCkgPT09IGVuZC5nZXRNb250aCgpXG4gICAgICAgID8gYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSAke21vbmRheS5nZXRGdWxsWWVhcigpfWBcbiAgICAgICAgOiBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19IFx1MjAxMyAke01PTlRIX1NIT1JUW2VuZC5nZXRNb250aCgpXX0gJHtlbmQuZ2V0RnVsbFllYXIoKX1gLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQWNoYSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWAgKFlZWVktTU0tREQpOiBwcmltZWlybyBwZWxvIGNhbWluaG8gY2FuXHUwMEY0bmljbyBlbVxuICAvLyA1MC5EaVx1MDBFMXJpby8sIHNlblx1MDBFM28gcXVhbHF1ZXIgbm90YSBjdWpvIGBkYXRlOmAgc2VqYSBlc3NlIGRpYS4gTnVsbCBzZSBuXHUwMEUzbyBob3V2ZXIuXG4gIC8vIChSZWxhdFx1MDBGM3Jpby9ub3RhIGRpXHUwMEUxcmlhIFx1MDBFOSB1bSBwb3IgZGlhIFx1MjE5MiBhYnJlIG8gZXhpc3RlbnRlIGVtIHZleiBkZSBjcmlhciBvdXRyby4pXG4gIHByaXZhdGUgZmluZERhaWx5Tm90ZShrZXk6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZGlyZWN0ID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYCk7XG4gICAgaWYgKGRpcmVjdCBpbnN0YW5jZW9mIFRGaWxlKSByZXR1cm4gZGlyZWN0O1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuZGF0ZWROb3Rlcy5maW5kKG4gPT4gbi5kYXRlID09PSBrZXkpPy5maWxlID8/IG51bGw7XG4gIH1cblxuICAvLyBBYnJlIGEgbm90YSBkaVx1MDBFMXJpYSBkZSBga2V5YDsgY3JpYSBlbSA1MC5EaVx1MDBFMXJpby8gU1x1MDBEMyBzZSBuXHUwMEUzbyBleGlzdGlyIG5lbmh1bWEuXG4gIHByaXZhdGUgYXN5bmMgb3BlbkRhaWx5Tm90ZShrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5maW5kRGFpbHlOb3RlKGtleSk7XG4gICAgaWYgKGV4aXN0aW5nKSB7IGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShleGlzdGluZyk7IHJldHVybjsgfVxuXG4gICAgLy8gTlx1MDBFM28gZXhpc3RlIFx1MjE5MiBjcmlhIG5vIGNhbWluaG8gY2FuXHUwMEY0bmljby5cbiAgICBpZiAoIXRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9GT0xERVIpKVxuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKERBSUxZX0ZPTERFUikuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgY29uc3QgW3ksIG0sIGRdID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICBjb25zdCB0aXR1bG8gPSBuZXcgRGF0ZSgreSwgK20gLSAxLCArZCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIiwge1xuICAgICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gICAgfSk7XG5cbiAgICAvLyBVc2EgbyB0ZW1wbGF0ZSBlbSBNb2RlbG9zLyBzZSBleGlzdGlyOyBzZW5cdTAwRTNvLCBmYWxsYmFjayBlbWJ1dGlkby5cbiAgICBjb25zdCB0cGwgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfVEVNUExBVEUpO1xuICAgIGxldCBib2R5OiBzdHJpbmc7XG4gICAgaWYgKHRwbCBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICBib2R5ID0gKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodHBsKSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccypkYXRlXFxzKlxcfVxcfS9nLCBrZXkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqdGl0bGVcXHMqXFx9XFx9L2csIHRpdHVsbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvZHkgPVxuYC0tLVxub3duZXI6IFdlcnVzXG5jcmVhdGVkOiAke2tleX1cbmRhdGU6ICR7a2V5fVxucmV2aWV3ZWQ6IHRydWVcbnR5cGU6IGRhaWx5XG5wZXJtaXNzaW9uczpcbiAgcmVhZDogW2FsbF1cbiAgd3JpdGU6XG4gICAgLSBXZXJ1c1xuLS0tXG5cbiMgJHt0aXR1bG99XG5cbmA7XG4gICAgfVxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoYCR7REFJTFlfRk9MREVSfS8ke2tleX0ubWRgLCBib2R5KTtcbiAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZmlsZSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZHMgZG8gY29mcmUgKHRvZGFzIGFzIHBhc3RhcyBkZSB0b3BvKSArIG5hdmVnYWRvciBhbmluaGFkbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclBhcmEocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfUEFSQSkpIHJldHVybjtcbiAgICAvLyBTZSBhIHBhc3RhIGFiZXJ0YSBubyBuYXZlZ2Fkb3IgZm9pIG9jdWx0YWRhIG5hcyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcywgZmVjaGEuXG4gICAgaWYgKHRoaXMubmF2UGF0aCAmJiB0aGlzLmlzSGlkZGVuKHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSkpIHRoaXMubmF2UGF0aCA9IG51bGw7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFyYS1ncmlkXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgICAvLyBpZ25vcmEgLm9ic2lkaWFuLCAudHJhc2gsIGV0Yy5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVJvb3QgPSB0aGlzLm5hdlBhdGggPyB0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkgOiBudWxsO1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgYWdnICAgICA9IGNhY2hlLmJ5Rm9sZGVyLmdldChmb2xkZXIucGF0aCkgPz8gRU1QVFlfQUdHO1xuICAgICAgY29uc3QgbWV0YSAgICA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBjb3ZlciAgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IG5hdmlnYWJsZSA9IHRoaXMuc3ViRm9sZGVyc09mKGZvbGRlcikubGVuZ3RoID4gMCB8fCBmaWxlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLnVyZ2VuY3lCYWRnZShjYXJkLCB7IGl0ZW1zOiBhZ2cudXJnZW5jeSwgbWF4OiBhZ2cudXJnZW5jeU1heCB9KTtcblxuICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dCh7IG1kOiBhZ2cubWQsIGltZzogYWdnLmltZyB9KSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGlmIChhZ2cubWQgPiAwKSB7XG4gICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQoYWdnLnJldmlld2VkIC8gYWdnLm1kICogMTAwKX0lYDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgYWdnLnJlY2VudCk7XG5cbiAgICAgIGNsaWNrYWJsZShjYXJkLCAoKSA9PiB7XG4gICAgICAgIGlmIChuYXZpZ2FibGUpIHsgdGhpcy5uYXZQYXRoID0gaXNBY3RpdmUgPyBudWxsIDogZm9sZGVyLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH1cbiAgICAgICAgZWxzZSByZXZlYWxJbkV4cGxvcmVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFpZHgpIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIHZpc1x1MDBFRHZlbC5cIiB9KTtcblxuICAgIC8vIEFycXVpdm9zIHNvbHRvcyBuYSByYWl6IGRvIGNvZnJlXG4gICAgY29uc3Qgcm9vdEZpbGVzID0gZmlsZXNJbih2YXVsdFJvb3QpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMoc2VjLCByb290RmlsZXMsIFwiYXJxdWl2b3MgbmEgcmFpelwiKTtcblxuICAgIGlmICh0aGlzLm5hdlBhdGgpIHtcbiAgICAgIGNvbnN0IGZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLm5hdlBhdGgpO1xuICAgICAgaWYgKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpIHRoaXMucmVuZGVyQnJvd3NlcihzZWMsIGZvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgLy8gUGFpbmVsIGlubGluZSBuYXZlZ1x1MDBFMXZlbCAoYnJlYWRjcnVtYiArIHN1YnBhc3RhcyArIG5vdGFzIGRhIHBhc3RhIGF0dWFsKVxuICBwcml2YXRlIHJlbmRlckJyb3dzZXIocGFyZW50OiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3Qgcm9vdFBhdGggPSB0aGlzLnRvcEZvbGRlck9mKGZvbGRlci5wYXRoKTtcbiAgICBjb25zdCByb290Rm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJvb3RQYXRoKTtcbiAgICBpZiAoIShyb290Rm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikpIHJldHVybjtcbiAgICBjb25zdCBtZXRhID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgcm9vdEZvbGRlcik7XG5cbiAgICBjb25zdCBwYW5lbCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFuZWxcIiB9KTtcbiAgICBwYW5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgIC8vIEJyZWFkY3J1bWJcbiAgICBjb25zdCBjcnVtYiA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jcnVtYlwiIH0pO1xuICAgIGNvbnN0IHJlbCA9IGZvbGRlci5wYXRoID09PSByb290UGF0aCA/IFtdIDogZm9sZGVyLnBhdGguc2xpY2Uocm9vdFBhdGgubGVuZ3RoICsgMSkuc3BsaXQoXCIvXCIpO1xuXG4gICAgY29uc3Qgcm9vdFNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAocmVsLmxlbmd0aCA9PT0gMCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIikgfSk7XG4gICAgcmVuZGVySWNvbihyb290U2VnLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgIHJvb3RTZWcuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgaWYgKHJlbC5sZW5ndGgpIGNsaWNrYWJsZShyb290U2VnLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHJvb3RQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9KTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgY2xpY2thYmxlKHNlZywgKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZWdQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3NlID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1jbG9zZVwiLCB0ZXh0OiBcIlx1MjcxNVwiIH0pO1xuICAgIGNsb3NlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkZlY2hhclwiKTtcbiAgICBjbGlja2FibGUoY2xvc2UsICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfSk7XG5cbiAgICAvLyBDYW1wbyBkZSBidXNjYVxuICAgIGNvbnN0IHNlYXJjaFdyYXAgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VhcmNoLXdyYXBcIiB9KTtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHNlYXJjaFdyYXAuY3JlYXRlRWwoXCJpbnB1dFwiLCB7XG4gICAgICBjbHM6IFwid2Qtc2VhcmNoXCIsXG4gICAgICBhdHRyOiB7IHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJmaWx0cmFyXHUyMDI2XCIsIHZhbHVlOiB0aGlzLnNlYXJjaFRlcm0gfSxcbiAgICB9KTtcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zZWFyY2hUZXJtID0gc2VhcmNoSW5wdXQudmFsdWU7XG4gICAgICBjb25zdCB0ZXJtID0gdGhpcy5zZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1zdWItY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbGJsID0gZWwucXVlcnlTZWxlY3RvcihcIi53ZC1sYWJlbFwiKT8udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkgPz8gXCJcIjtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGxibC5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtbm90ZS1yb3csIC53ZC1ub3RlLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAoZWwucXVlcnlTZWxlY3RvcihcIi53ZC1ub3RlLW5hbWUsIC53ZC1ub3RlLWNhcmQtbmFtZVwiKT8udGV4dENvbnRlbnQgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IG5hbWUuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFN1YnBhc3RhcyBjb21vIGNhcmRzXG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCk7XG4gICAgY29uc3Qgc3VicyA9IHRoaXMuc3ViRm9sZGVyc09mKGZvbGRlcik7XG4gICAgaWYgKHN1YnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZ3JpZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9qLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3Qgc2Ygb2Ygc3Vicykge1xuICAgICAgICBjb25zdCBhZ2cgICAgPSBjYWNoZS5ieUZvbGRlci5nZXQoc2YucGF0aCkgPz8gRU1QVFlfQUdHO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWFkRm9sZGVyU3RhdHVzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IGNvdmVyICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgZGVlcGVyID0gdGhpcy5zdWJGb2xkZXJzT2Yoc2YpLmxlbmd0aCA+IDA7XG4gICAgICAgIGNvbnN0IGN1c3RvbUljb24gPSByZWFkRm9sZGVySWNvbih0aGlzLmFwcCwgc2YpO1xuXG4gICAgICAgIGNvbnN0IGNhcmQgPSBzZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1jYXJkIHdkLXN1Yi1jYXJkIHdkLXMtJHtzdGF0dXN9YCB9KTtcbiAgICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXJcIiB9KS5jcmVhdGVFbChcImltZ1wiLCB7IGF0dHI6IHsgc3JjOiBjb3ZlciwgZHJhZ2dhYmxlOiBcImZhbHNlXCIgfSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDYXBhIHBhZHJcdTAwRTNvIHN1dGlsICh2ZXJzXHUwMEUzbyBtZW5vciBxdWUgYXMgcGFzdGFzIGRlIHRvcG8pIFx1MjAxNCBGYXNlIDkuMVxuICAgICAgICAgIGNvbnN0IGRjID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXIgd2QtY292ZXItZGVmYXVsdCB3ZC1jb3Zlci1zdWJcIiB9KTtcbiAgICAgICAgICByZW5kZXJJY29uKGRjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY292ZXItZ2x5cGhcIiB9KSwgY3VzdG9tSWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtYmFkZ2Ugd2QtYmFkZ2UtJHtzdGF0dXN9YCwgdGV4dDogU1RBVFVTX0lDT05bc3RhdHVzXSB9KTtcbiAgICAgICAgdGhpcy51cmdlbmN5QmFkZ2UoY2FyZCwgeyBpdGVtczogYWdnLnVyZ2VuY3ksIG1heDogYWdnLnVyZ2VuY3lNYXggfSk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgICAgaWYgKGN1c3RvbUljb24pIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvbiB3ZC1zdWItaWNvblwiIH0pLCBjdXN0b21JY29uKTtcbiAgICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHsgbWQ6IGFnZy5tZCwgaW1nOiBhZ2cuaW1nIH0pIH0pO1xuICAgICAgICBpZiAoZGVlcGVyKSB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdWItYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcblxuICAgICAgICBjb25zdCBsYWJlbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsIHRleHQ6IHNmLm5hbWUgfSk7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIGxhYmVsLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IFwiY2FuY2VsbGVkXCIgJiYgYWdnLm1kID4gMCkge1xuICAgICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHthZ2cucmV2aWV3ZWR9LyR7YWdnLm1kfSByZXZpc2FkYXNgKTtcbiAgICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQoYWdnLnJldmlld2VkIC8gYWdnLm1kICogMTAwKX0lYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjYXJkLnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGFnZy5yZWNlbnQpO1xuICAgICAgICAgIGNsaWNrYWJsZShjYXJkLCAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNmLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXJxdWl2b3MgZGEgcGFzdGEgYXR1YWwgKG5vdGFzLCBjYW52YXMsIGJhc2VzKVxuICAgIGNvbnN0IG5vdGVzID0gZmlsZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYXRtYXAgKHZpYSBwbHVnaW4gSGVhdG1hcCBDYWxlbmRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWF0bWFwKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0hFQVQpKSByZXR1cm47XG4gICAgaWYgKFBsYXRmb3JtLmlzUGhvbmUpIHJldHVybjsgICAvLyBoZWF0bWFwIChhbm8gaW50ZWlybykgb2N1bHRhZG8gbm8gY2VsdWxhclxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhIChkbyBjYWNoZSksIGZpbHRyYWRhcyBwZWxvIGFubyBjb3JyZW50ZS5cbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IHByZWZpeCA9IFN0cmluZyh5ZWFyKTtcbiAgICBjb25zdCBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW2RhdGUsIG5dIG9mIHRoaXMucGx1Z2luLmdldFZhdWx0Q2FjaGUoKS5jdGltZUJ5RGF5KSB7XG4gICAgICBpZiAoIWRhdGUuc3RhcnRzV2l0aChwcmVmaXgpKSBjb250aW51ZTtcbiAgICAgIGVudHJpZXMucHVzaCh7IGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wbHVnaW4uZ2V0VmF1bHRDYWNoZSgpO1xuICAgIGNvbnN0IHRvdGFsTm90ZXMgPSBjYWNoZS50b3RhbE5vdGVzO1xuICAgIGNvbnN0IHRvdGFsUmV2aWV3ZWQgPSBjYWNoZS50b3RhbFJldmlld2VkO1xuICAgIC8vIFwiZXN0YSBzZW1hbmFcIiA9IGNyaWFcdTAwRTdcdTAwRjVlcyBub3MgXHUwMEZBbHRpbW9zIDcgZGlhcyAoZG8gY2FjaGUsIHBvciBkYXRhIFx1MjE5MiBzZW1wcmUgZnJlc2NvKS5cbiAgICBsZXQgY3JlYXRlZFRoaXNXZWVrID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7IGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY3JlYXRlZFRoaXNXZWVrICs9IGNhY2hlLmN0aW1lQnlEYXkuZ2V0KHRvS2V5KGQpKSA/PyAwO1xuICAgIH1cbiAgICBjb25zdCBnbG9iYWxQY3QgPSB0b3RhbE5vdGVzID4gMCA/IE1hdGgucm91bmQodG90YWxSZXZpZXdlZCAvIHRvdGFsTm90ZXMgKiAxMDApIDogMDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkVTVEFUXHUwMENEU1RJQ0FTXCIgfSk7XG5cbiAgICAvLyBOXHUwMEZBbWVyb3MgZ2xvYmFpc1xuICAgIGNvbnN0IGdsb2IgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZ2xvYmFsXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnXCIsIHRleHQ6IFN0cmluZyh0b3RhbE5vdGVzKSB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJub3Rhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZyB3ZC1zdGF0LXJldi1udW1cIiwgdGV4dDogYCR7Z2xvYmFsUGN0fSVgIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcInJldmlzYWRhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXdlZWtcIiwgdGV4dDogYCske2NyZWF0ZWRUaGlzV2Vla31gIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcImVzdGEgc2VtYW5hXCIgfSk7XG5cbiAgICAvLyBCcmVha2Rvd24gcG9yIHBhc3RhXG4gICAgY29uc3QgdGFibGUgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtdGFibGVcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG5cbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgYWdnID0gY2FjaGUuYnlGb2xkZXIuZ2V0KGZvbGRlci5wYXRoKSA/PyBFTVBUWV9BR0c7XG4gICAgICBpZiAoYWdnLm1kID09PSAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgcGN0ID0gTWF0aC5yb3VuZChhZ2cucmV2aWV3ZWQgLyBhZ2cubWQgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke2FnZy5tZH1gIH0pO1xuXG4gICAgICBjb25zdCBiYXJXcmFwID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhclwiIH0pO1xuICAgICAgYmFyV3JhcC5zZXRBdHRyKFwidGl0bGVcIiwgYCR7YWdnLnJldmlld2VkfS8ke2FnZy5tZH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy5yZXZpZXdGaWx0ZXIpKTtcbiAgICBjbGlja2FibGUoYnRuUGVuZCwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucmV2aWV3RmlsdGVyID0gIXRoaXMucmV2aWV3RmlsdGVyOyB0aGlzLnJlbmRlcigpOyB9KTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5zZXRBdHRyKFwiYXJpYS1wcmVzc2VkXCIsIFN0cmluZyghaXNHcmlkKSk7XG4gICAgY2xpY2thYmxlKGJ0bkwsIGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwibGlzdFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfSk7XG4gICAgY29uc3QgYnRuRyA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI5RVwiIH0pO1xuICAgIGJ0bkcuc2V0QXR0cihcInRpdGxlXCIsIFwiQ29sdW5hc1wiKTtcbiAgICBidG5HLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKGlzR3JpZCkpO1xuICAgIGNsaWNrYWJsZShidG5HLCBhc3luYyBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPSBcImdyaWRcIjsgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNhcmQgd2Qtcy0ke3N0fWAgfSk7XG4gICAgICAgIC8vIENhcGEgcGFkclx1MDBFM28gcG9yIHRpcG8gZGUgYXJxdWl2byAobm90YSAvIGNhbnZhcyAvIGJhc2UpIFx1MjAxNCBGYXNlIDkuMlxuICAgICAgICBjb25zdCBjb3YgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY292ZXIgd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24oY292LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1jb3Zlci1nbHlwaFwiIH0pLCBmaWxlR2x5cGgoZi5leHRlbnNpb24pKTtcblxuICAgICAgICBpZiAoaXNNZCkgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IGNhcmQuY3JlYXRlU3Bhbih7IGNsczogYHdkLXVyZ2VuY3ktbWFyayB3ZC11LSR7dXJnfWAgfSk7IHNldEljb24odywgXCJ0cmlhbmdsZS1hbGVydFwiKTsgdy5zZXRBdHRyKFwidGl0bGVcIiwgYFVyZ1x1MDBFQW5jaWE6ICR7dXJnfWApOyB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjbGlja2FibGUoY2FyZCwgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGlzdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLXJvdyB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgY29uc3QgdGkgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtdHlwZWljb24gd2QtZmlsZS0ke2YuZXh0ZW5zaW9ufWAgfSk7XG4gICAgICAgIHNldEljb24odGksIGZpbGVHbHlwaChmLmV4dGVuc2lvbikpO1xuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLWRvdCB3ZC1iYWRnZS0ke3N0fWAgfSk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGlmICh1cmcpIHsgY29uc3QgdyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2QtdXJnZW5jeS1tYXJrIHdkLXUtJHt1cmd9YCB9KTsgc2V0SWNvbih3LCBcInRyaWFuZ2xlLWFsZXJ0XCIpOyB3LnNldEF0dHIoXCJ0aXRsZVwiLCBgVXJnXHUwMEVBbmNpYTogJHt1cmd9YCk7IH1cbiAgICAgICAgaWYgKGlzTWQpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIGNsaWNrYWJsZShyb3csICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEdyXHUwMEUxZmljbyBkZSBjcmVzY2ltZW50byBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckdyb3d0aChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19HUk9XKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ1JFU0NJTUVOVE8gRE8gQ09GUkVcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGJ0bkRheSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghdGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcImRpYVwiIH0pO1xuICAgIGJ0bkRheS5zZXRBdHRyKFwidGl0bGVcIiwgXCJOb3RhcyBjcmlhZGFzIHBvciBkaWFcIik7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUpKTtcbiAgICBjbGlja2FibGUoYnRuRGF5LCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gZmFsc2U7IHRoaXMucmVuZGVyKCk7IH0pO1xuICAgIGNvbnN0IGJ0bkN1bSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwidG90YWxcIiB9KTtcbiAgICBidG5DdW0uc2V0QXR0cihcInRpdGxlXCIsIFwiVG90YWwgYWN1bXVsYWRvIG5vIHBlclx1MDBFRG9kb1wiKTtcbiAgICBidG5DdW0uc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy5ncm93dGhDdW11bGF0aXZlKSk7XG4gICAgY2xpY2thYmxlKGJ0bkN1bSwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IHRydWU7IHRoaXMucmVuZGVyKCk7IH0pO1xuXG4gICAgLy8gTm90YXMgcG9yIGRhdGEgZGUgY3JpYVx1MDBFN1x1MDBFM28gKGRvIGNhY2hlKS5cbiAgICBjb25zdCBjb3VudHMgPSB0aGlzLnBsdWdpbi5nZXRWYXVsdENhY2hlKCkuY3RpbWVCeURheTtcblxuICAgIC8vIFx1MDBEQWx0aW1vcyBOIGRpYXMgKG1lbm9zIG5vIGNlbHVsYXIpXG4gICAgY29uc3QgREFZUyA9IFBsYXRmb3JtLmlzUGhvbmUgPyAxNSA6IDMwO1xuICAgIGNvbnN0IGRheXM6IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IERBWVMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBkYXlzLnB1c2goeyBrZXksIGNvdW50OiBjb3VudHMuZ2V0KGtleSkgPz8gMCwgbGFiZWw6IGAke2RheX0vJHttfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWwgPSBkYXlzLnJlZHVjZSgocywgZCkgPT4gcyArIGQuY291bnQsIDApO1xuICAgIGNvbnN0IHRvZGF5S2V5ID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBNb2RvIGN1bXVsYXRpdm86IHNvbWEgYWN1bXVsYWRhIGRpYSBhIGRpYVxuICAgIHR5cGUgRGF5RW50cnkgPSB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nOyBkaXNwbGF5VmFsOiBudW1iZXIgfTtcbiAgICBsZXQgZW50cmllczogRGF5RW50cnlbXTtcbiAgICBpZiAodGhpcy5ncm93dGhDdW11bGF0aXZlKSB7XG4gICAgICBsZXQgYWNjID0gMDtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+IHsgYWNjICs9IGQuY291bnQ7IHJldHVybiB7IC4uLmQsIGRpc3BsYXlWYWw6IGFjYyB9OyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4gKHsgLi4uZCwgZGlzcGxheVZhbDogZC5jb3VudCB9KSk7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmVudHJpZXMubWFwKGUgPT4gZS5kaXNwbGF5VmFsKSwgMSk7XG5cbiAgICAvLyBMaW5oYSBkZSByZXN1bW9cbiAgICBjb25zdCBpbmZvID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtaW5mb1wiIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtdG90YWxcIiwgdGV4dDogYCR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZW50cmllc1tlbnRyaWVzLmxlbmd0aCAtIDFdLmRpc3BsYXlWYWwgOiB0b3RhbH1gIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtcGVyaW9kXCIsIHRleHQ6IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGBub3RhcyBhY3VtdWxhZGFzICgke0RBWVN9IGRpYXMpYCA6IGBub3RhcyBjcmlhZGFzIG5vcyBcdTAwRkFsdGltb3MgJHtEQVlTfSBkaWFzYCB9KTtcblxuICAgIC8vIEdyXHUwMEUxZmljbyBkZSBiYXJyYXNcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZW50cmllcy5mb3JFYWNoKCh7IGtleSwgY291bnQsIGxhYmVsLCBkaXNwbGF5VmFsIH0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY29sID0gY2hhcnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jb2xcIiArIChrZXkgPT09IHRvZGF5S2V5ID8gXCIgd2QtZ3Jvd3RoLXRvZGF5XCIgOiBcIlwiKSB9KTtcbiAgICAgIGNvbnN0IGJhckFyZWEgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXItYXJlYVwiIH0pO1xuICAgICAgY29uc3QgaXNFbXB0eSA9IGRpc3BsYXlWYWwgPT09IDA7XG4gICAgICBjb25zdCBiYXIgPSBiYXJBcmVhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyXCIgKyAoaXNFbXB0eSA/IFwiIHdkLWdyb3d0aC1iYXItemVyb1wiIDogXCJcIikgfSk7XG4gICAgICBiYXIuc3R5bGUuaGVpZ2h0ID0gaXNFbXB0eSA/IFwiM3B4XCIgOiBgJHtNYXRoLm1heCg1LCBNYXRoLnJvdW5kKChkaXNwbGF5VmFsIC8gbWF4KSAqIDEwMCkpfSVgO1xuICAgICAgaWYgKCFpc0VtcHR5KSBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xhYmVsfTogJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBkaXNwbGF5VmFsICsgXCIgdG90YWxcIiA6IGNvdW50ICsgXCIgbm90YShzKVwifWApO1xuXG4gICAgICBjb25zdCBzaG93TGJsID0gaWR4ID09PSAwIHx8IGlkeCA9PT0gNyB8fCBpZHggPT09IDE0IHx8IGlkeCA9PT0gMjEgfHwgaWR4ID09PSAyOSB8fCBrZXkgPT09IHRvZGF5S2V5O1xuICAgICAgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtbGJsXCIsIHRleHQ6IHNob3dMYmwgPyBsYWJlbCA6IFwiXCIgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCAoZGVsZWdhZG8gYW8gVG9kb2lzdENvbnRyb2xsZXIgY29tcGFydGlsaGFkbykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJUb2RvaXN0KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX1RPRE8pKSByZXR1cm47XG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIC8vIEJvdFx1MDBFM28gZGUgbmF2ZWdhXHUwMEU3XHUwMEUzbyBcdTIxOTIgYWJyZSBhIGFiYSBkZWRpY2FkYSBkbyBUb2RvaXN0IChvIGRhc2hib2FyZCBcdTAwRTkgbyBodWIpLlxuICAgIGNvbnN0IG9wZW4gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3BlbmJ0blwiIH0pO1xuICAgIHNldEljb24ob3BlbiwgXCJzcXVhcmUtYXJyb3ctb3V0LXVwLXJpZ2h0XCIpO1xuICAgIG9wZW4uc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgYSBhYmEgZG8gVG9kb2lzdFwiKTtcbiAgICBjbGlja2FibGUob3BlbiwgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5wbHVnaW4ub3BlblRvZG9pc3QoKTsgfSk7XG4gICAgLy8gTGFuXHUwMEU3YWRvciBkZSBwYWNvdGVzIGNvbXBhY3RvIChzb21lIHNlIG5cdTAwRTNvIGhvdXZlciBwYWNvdGVzKS5cbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlclBhY2thZ2VzKHNlYyk7XG4gICAgLy8gRGFzaGJvYXJkID0gc1x1MDBGMyBvIGVzc2VuY2lhbCAoQXRyYXNhZGFzIFx1MDBCNyBIb2plIFx1MDBCNyBQclx1MDBGM3hpbW9zIDcpLiBcIkRlcG9pc1wiIGZpY2FcbiAgICAvLyBzXHUwMEYzIG5hIGFiYSBkbyBUb2RvaXN0IFx1MjE5MiByZWNvcnJlbnRlcyBzXHUwMEYzIGFwYXJlY2VtIGFxdWkgcGVydG8gZG8gZGlhLlxuICAgIHRoaXMucGx1Z2luLnRvZG8ucmVuZGVyTGlzdChzZWMsIGN0cmxzLCB7IHNob3dMYXRlcjogZmFsc2UgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2luY3Jvbml6YVx1MDBFN1x1MDBFM28gKFN5bmN0aGluZyArIGNvbmZsaXRvcykgXHUyMDE0IHYwLjEwLjAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcmVzZXRTeW5jKCkge1xuICAgIHRoaXMuc3luY0RhdGEgPSBudWxsO1xuICAgIHRoaXMuc3luY0ZldGNoZWRBdCA9IDA7XG4gICAgdGhpcy5zeW5jRXJyb3IgPSBudWxsO1xuICAgIHRoaXMuc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBmZXRjaFN5bmMobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgYmFzZSA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybC50cmltKCk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5LnRyaW0oKTtcbiAgICBpZiAoIWJhc2UgfHwgIWtleSB8fCB0aGlzLnN5bmNMb2FkaW5nKSByZXR1cm47XG4gICAgdGhpcy5zeW5jTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5zeW5jRXJyb3IgPSBudWxsO1xuICAgIGlmIChtYW51YWwpIHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvbGRlcnMgPSBhd2FpdCBzdEdldDxTVEZvbGRlcltdPihiYXNlLCBrZXksIFwiL3Jlc3QvY29uZmlnL2ZvbGRlcnNcIik7XG4gICAgICBjb25zdCB3YW50ZWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZC50cmltKCk7XG4gICAgICBjb25zdCBmb2xkZXIgPSBmb2xkZXJzLmZpbmQoZiA9PiBmLmlkID09PSB3YW50ZWQpID8/IGZvbGRlcnNbMF07XG4gICAgICBpZiAoIWZvbGRlcikgdGhyb3cgbmV3IEVycm9yKFwibmVuaHVtYSBwYXN0YSBjb25maWd1cmFkYSBubyBTeW5jdGhpbmdcIik7XG4gICAgICBjb25zdCBmaWQgPSBlbmNvZGVVUklDb21wb25lbnQoZm9sZGVyLmlkKTtcblxuICAgICAgY29uc3QgW2RldmljZXMsIGNvbm5zLCBzdGF0dXMsIHN0YXRzLCBzeXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBzdEdldDxTVERldmljZVtdPihiYXNlLCBrZXksIFwiL3Jlc3QvY29uZmlnL2RldmljZXNcIiksXG4gICAgICAgIHN0R2V0PHsgY29ubmVjdGlvbnM6IFJlY29yZDxzdHJpbmcsIHsgY29ubmVjdGVkOiBib29sZWFuIH0+IH0+KGJhc2UsIGtleSwgXCIvcmVzdC9zeXN0ZW0vY29ubmVjdGlvbnNcIiksXG4gICAgICAgIHN0R2V0PFNUU3RhdHVzPihiYXNlLCBrZXksIGAvcmVzdC9kYi9zdGF0dXM/Zm9sZGVyPSR7ZmlkfWApLFxuICAgICAgICBzdEdldDxSZWNvcmQ8c3RyaW5nLCB7IGxhc3RTZWVuOiBzdHJpbmcgfT4+KGJhc2UsIGtleSwgXCIvcmVzdC9zdGF0cy9kZXZpY2VcIikuY2F0Y2goKCkgPT4gKHt9IGFzIFJlY29yZDxzdHJpbmcsIHsgbGFzdFNlZW46IHN0cmluZyB9PikpLFxuICAgICAgICBzdEdldDx7IG15SUQ6IHN0cmluZyB9PihiYXNlLCBrZXksIFwiL3Jlc3Qvc3lzdGVtL3N0YXR1c1wiKSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCByZW1vdGUgPSBkZXZpY2VzLmZpbHRlcihkID0+IGQuZGV2aWNlSUQgIT09IHN5cy5teUlEKTtcbiAgICAgIGNvbnN0IHJvd3MgPSBhd2FpdCBQcm9taXNlLmFsbChyZW1vdGUubWFwKGFzeW5jIGQgPT4ge1xuICAgICAgICBjb25zdCBjID0gYXdhaXQgc3RHZXQ8U1RDb21wbGV0aW9uPihiYXNlLCBrZXksIGAvcmVzdC9kYi9jb21wbGV0aW9uP2ZvbGRlcj0ke2ZpZH0mZGV2aWNlPSR7ZC5kZXZpY2VJRH1gKVxuICAgICAgICAgIC5jYXRjaCgoKSA9PiAoeyBjb21wbGV0aW9uOiAwLCBnbG9iYWxJdGVtczogMCwgbmVlZEl0ZW1zOiAwLCBuZWVkQnl0ZXM6IDAsIG5lZWREZWxldGVzOiAwIH0pKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBkLm5hbWUgfHwgZC5kZXZpY2VJRC5zbGljZSgwLCA3KSxcbiAgICAgICAgICBvbmxpbmU6ICEhY29ubnMuY29ubmVjdGlvbnNbZC5kZXZpY2VJRF0/LmNvbm5lY3RlZCxcbiAgICAgICAgICBjb21wbGV0aW9uOiBjLmNvbXBsZXRpb24sXG4gICAgICAgICAgZ2xvYmFsSXRlbXM6IGMuZ2xvYmFsSXRlbXMgPz8gMCxcbiAgICAgICAgICBuZWVkSXRlbXM6IGMubmVlZEl0ZW1zID8/IDAsXG4gICAgICAgICAgbmVlZEJ5dGVzOiBjLm5lZWRCeXRlcyxcbiAgICAgICAgICBuZWVkRGVsZXRlczogYy5uZWVkRGVsZXRlcyxcbiAgICAgICAgICBsYXN0U2Vlbjogc3RhdHNbZC5kZXZpY2VJRF0/Lmxhc3RTZWVuID8/IFwiXCIsXG4gICAgICAgIH07XG4gICAgICB9KSk7XG5cbiAgICAgIHRoaXMuc3luY0RhdGEgPSB7XG4gICAgICAgIHN0YXRlOiBzdGF0dXMuc3RhdGUsXG4gICAgICAgIG5lZWRGaWxlczogc3RhdHVzLm5lZWRGaWxlcyxcbiAgICAgICAgbmVlZEJ5dGVzOiBzdGF0dXMubmVlZEJ5dGVzLFxuICAgICAgICBmb2xkZXJMYWJlbDogZm9sZGVyLmxhYmVsIHx8IGZvbGRlci5pZCxcbiAgICAgICAgZXJyb3JzOiAoc3RhdHVzLmVycm9ycyA/PyAwKSArIChzdGF0dXMucHVsbEVycm9ycyA/PyAwKSxcbiAgICAgICAgZGV2aWNlczogcm93cyxcbiAgICAgIH07XG4gICAgICB0aGlzLnN5bmNGZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3luY0Vycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnN5bmNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luYyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19TWU5DKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1zeW5jLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlNJTkNST05JWkFcdTAwQzdcdTAwQzNPXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkudHJpbSgpO1xuICAgIGlmIChrZXkpIHtcbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMuc3luY0xvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgZXN0YWRvIGRvIFN5bmN0aGluZ1wiKTtcbiAgICAgIGNsaWNrYWJsZShyZWZyZXNoLCBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmZldGNoU3luYyh0cnVlKTsgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb25maWd1cmUgYSBVUkwgZSBhIEFQSSBrZXkgZG8gU3luY3RoaW5nIGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQuXCIgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN5bmNFcnJvcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVycm9yXCIsIHRleHQ6IGBFcnJvIGFvIGZhbGFyIGNvbSBvIFN5bmN0aGluZzogJHt0aGlzLnN5bmNFcnJvcn1gIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3luY0ZldGNoZWRBdCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmNMb2FkaW5nKSB2b2lkIHRoaXMuZmV0Y2hTeW5jKGZhbHNlKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvXHUyMDI2XCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyU3luY0JvZHkoc2VjLCB0aGlzLnN5bmNEYXRhISk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDb25mbGljdHMoc2VjKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3luY0JvZHkoc2VjOiBIVE1MRWxlbWVudCwgZDogU3luY0RhdGEpIHtcbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtYm94XCIgfSk7XG5cbiAgICAvLyBFc3RhZG8gZGEgcGFzdGEuXG4gICAgY29uc3QgYnVzeSA9IGQuc3RhdGUgPT09IFwic3luY2luZ1wiIHx8IGQuc3RhdGUgPT09IFwic2Nhbm5pbmdcIjtcbiAgICBjb25zdCBmbCA9IGJveC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1mb2xkZXJcIiB9KTtcbiAgICBjb25zdCBkb3QgPSBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGQuZXJyb3JzID8gXCJ3ZC1zLWVyclwiIDogYnVzeSA/IFwid2Qtcy1idXN5XCIgOiBcIndkLXMtb2tcIikgfSk7XG4gICAgZG90LnNldFRleHQoZC5lcnJvcnMgPyBcIlx1MjZBMFwiIDogYnVzeSA/IFwiXHUyN0YzXCIgOiBcIlx1MjVDRlwiKTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZm5hbWVcIiwgdGV4dDogZC5mb2xkZXJMYWJlbCB9KTtcbiAgICBjb25zdCBzdCA9IGQuc3RhdGUgPT09IFwiaWRsZVwiID8gXCJlbSBkaWFcIiA6IGQuc3RhdGUgPT09IFwic3luY2luZ1wiID8gYHNpbmNyb25pemFuZG8gXHUyMDE0ICR7ZC5uZWVkRmlsZXN9IGl0ZW5zICgke2h1bWFuQnl0ZXMoZC5uZWVkQnl0ZXMpfSlgIDogZC5zdGF0ZTtcbiAgICBmbC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZnN0YXRlXCIsIHRleHQ6IHN0IH0pO1xuXG4gICAgLy8gQXBhcmVsaG9zLlxuICAgIGZvciAoY29uc3QgZGV2IG9mIGQuZGV2aWNlcykge1xuICAgICAgY29uc3Qgcm93ID0gYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWRldlwiIH0pO1xuICAgICAgY29uc3QgbyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZG90IFwiICsgKGRldi5vbmxpbmUgPyBcIndkLXMtb2tcIiA6IFwid2Qtcy1vZmZcIikgfSk7XG4gICAgICBvLnNldFRleHQoXCJcdTI1Q0ZcIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRuYW1lXCIsIHRleHQ6IGRldi5uYW1lIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY29tcFwiLCB0ZXh0OiBgJHtNYXRoLnJvdW5kKGRldi5jb21wbGV0aW9uKX0lYCB9KTtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzICYmIGRldi5nbG9iYWxJdGVtcylcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1kY291bnRcIiwgdGV4dDogYCR7ZGV2Lmdsb2JhbEl0ZW1zIC0gZGV2Lm5lZWRJdGVtc30vJHtkZXYuZ2xvYmFsSXRlbXN9YCB9KTtcbiAgICAgIGNvbnN0IGV4dHJhID0gZGV2Lm5lZWREZWxldGVzID8gYCR7ZGV2Lm5lZWREZWxldGVzfSBleGNsdXNcdTAwRjVlc2AgOiBkZXYubmVlZEJ5dGVzID8gaHVtYW5CeXRlcyhkZXYubmVlZEJ5dGVzKSA6IFwiXCI7XG4gICAgICBpZiAoZXh0cmEpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtZHBlbmRcIiwgdGV4dDogZXh0cmEgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zeW5jLWRzZWVuXCIsIHRleHQ6IGRldi5vbmxpbmUgPyBcIm9ubGluZVwiIDogcmVsVGltZShkZXYubGFzdFNlZW4pIH0pO1xuICAgIH1cblxuICAgIGlmIChkLmVycm9ycykgYm94LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLWVycmxpbmVcIiwgdGV4dDogYFx1MjZBMCAke2QuZXJyb3JzfSBlcnJvKHMpIG5hIHBhc3RhYCB9KTtcbiAgfVxuXG4gIC8vIExpc3RhIGRlIGNcdTAwRjNwaWFzIGRlIGNvbmZsaXRvIGRvIFN5bmN0aGluZyAoYWJyaXIgLyBhcGFnYXIgY29tIGNvbmZpcm1hXHUwMEU3XHUwMEUzbykuXG4gIHByaXZhdGUgcmVuZGVyQ29uZmxpY3RzKHNlYzogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLmZpbHRlcihmID0+IGYubmFtZS5pbmNsdWRlcyhcIi5zeW5jLWNvbmZsaWN0LVwiKSk7XG4gICAgY29uc3Qgd3JhcCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3luYy1jb25mbGljdHNcIiB9KTtcbiAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLXN1YlwiLCB0ZXh0OiBgQ29uZmxpdG9zICgke2NvbmZsaWN0cy5sZW5ndGh9KWAgfSk7XG4gICAgaWYgKCFjb25mbGljdHMubGVuZ3RoKSB7XG4gICAgICB3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zeW5jLW5vY29uZlwiLCB0ZXh0OiBcIk5lbmh1bSBjb25mbGl0by4gXHVEODNDXHVERjg5XCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBjb25mbGljdHMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHdyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN5bmMtY3Jvd1wiIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY25hbWVcIiwgdGV4dDogZi5uYW1lIH0pO1xuICAgICAgbmFtZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBcIiArIGYucGF0aCk7XG4gICAgICBjbGlja2FibGUobmFtZSwgKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpKTtcbiAgICAgIGlmICh0aGlzLmNvbmZsaWN0Q29uZmlybSA9PT0gZi5wYXRoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY3llc1wiLCB0ZXh0OiBcImFwYWdhcj9cIiB9KTtcbiAgICAgICAgY2xpY2thYmxlKHllcywgYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLmFwcC52YXVsdC50cmFzaChmLCBmYWxzZSk7IHRoaXMuY29uZmxpY3RDb25maXJtID0gbnVsbDsgdGhpcy5yZW5kZXJTZWN0aW9uKFwic3luY1wiKTsgfSk7XG4gICAgICAgIGNvbnN0IG5vID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3luYy1jbm9cIiwgdGV4dDogXCJjYW5jZWxhclwiIH0pO1xuICAgICAgICBjbGlja2FibGUobm8sICgpID0+IHsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBudWxsOyB0aGlzLnJlbmRlclNlY3Rpb24oXCJzeW5jXCIpOyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN5bmMtY2RlbFwiIH0pO1xuICAgICAgICBzZXRJY29uKGRlbCwgXCJ0cmFzaC0yXCIpO1xuICAgICAgICBkZWwuc2V0QXR0cihcInRpdGxlXCIsIFwiQXBhZ2FyIGNcdTAwRjNwaWEgZGUgY29uZmxpdG8gKHZhaSBwYXJhIGEgbGl4ZWlyYSlcIik7XG4gICAgICAgIGNsaWNrYWJsZShkZWwsICgpID0+IHsgdGhpcy5jb25mbGljdENvbmZpcm0gPSBmLnBhdGg7IHRoaXMucmVuZGVyU2VjdGlvbihcInN5bmNcIik7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWFkZXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJTZWNvbmQgQnJhaW5cIiB9KTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGx1Z2luIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZXJ1c0Rhc2hib2FyZCBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBEYXNoU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuICAvLyBDb250cm9sYWRvciBcdTAwRkFuaWNvIGRvIFRvZG9pc3QgKGVzdGFkbyBjb21wYXJ0aWxoYWRvIGVudHJlIGRhc2hib2FyZCBlIGFiYSkuXG4gIHRvZG8hOiBUb2RvaXN0Q29udHJvbGxlcjtcbiAgLy8gQ2FjaGUgZG8gY29mcmUgKFx1MDBBNzMpOiBtb250YWRvIDF4IHBvciBjaWNsbywgaW52YWxpZGFkbyBub3MgZXZlbnRvcyBkbyB2YXVsdC5cbiAgcHJpdmF0ZSB2YXVsdENhY2hlOiBWYXVsdENhY2hlIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gQWdyZWdhZG9zIGRvIGNvZnJlICh1bWEgcGFzc2FkYSksIHJldXNhZG9zIHBvciB0b2RhcyBhcyBzZVx1MDBFN1x1MDBGNWVzIG5vIHJlbmRlci5cbiAgZ2V0VmF1bHRDYWNoZSgpOiBWYXVsdENhY2hlIHtcbiAgICBpZiAoIXRoaXMudmF1bHRDYWNoZSkgdGhpcy52YXVsdENhY2hlID0gYnVpbGRWYXVsdENhY2hlKHRoaXMuYXBwKTtcbiAgICByZXR1cm4gdGhpcy52YXVsdENhY2hlO1xuICB9XG4gIGludmFsaWRhdGVWYXVsdENhY2hlKCkgeyB0aGlzLnZhdWx0Q2FjaGUgPSBudWxsOyB9XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy50b2RvID0gbmV3IFRvZG9pc3RDb250cm9sbGVyKHRoaXMuYXBwLCB0aGlzLCB0aGlzKTtcbiAgICAvLyBBdXRvLXJlZnJlc2ggZG8gVG9kb2lzdDogdmVyaWZpY2EgYSBjYWRhIG1pbnV0bzsgc1x1MDBGMyBidXNjYSBzZSBoXHUwMEUxIHZpZXcgYWJlcnRhIGUgb1xuICAgIC8vIGNhY2hlIHBhc3NvdSBkbyBUVEwgKDUgbWluKS4gcmVnaXN0ZXJJbnRlcnZhbCBsaW1wYSBvIHRpbWVyIG5vIHVubG9hZC5cbiAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwod2luZG93LnNldEludGVydmFsKCgpID0+IHRoaXMudG9kby5tYXliZVJlZnJlc2goKSwgNjBfMDAwKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFLCBsZWFmID0+IG5ldyBEYXNoYm9hcmRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhUT0RPSVNUX1ZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgVG9kb2lzdFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxheW91dC1kYXNoYm9hcmRcIiwgXCJBYnJpciBXZXJ1cyBEYXNoYm9hcmRcIiwgKCkgPT4gdGhpcy5vcGVuKCkpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxpc3QtY2hlY2tzXCIsIFwiQWJyaXIgVG9kb2lzdCAoV2VydXMpXCIsICgpID0+IHRoaXMub3BlblRvZG9pc3QoKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1kYXNoYm9hcmRcIiwgbmFtZTogXCJBYnJpciBEYXNoYm9hcmRcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbigpIH0pO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tdG9kb2lzdFwiLCBuYW1lOiBcIkFicmlyIFRvZG9pc3RcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlblRvZG9pc3QoKSB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdlcnVzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICB9XG5cbiAgLy8gVG9kYXMgYXMgdmlld3MgKGRhc2hib2FyZCArIGFiYSBUb2RvaXN0KSBhYmVydGFzLCBxdWUgdFx1MDBFQW0gY29udHJvbGFkb3IgVG9kb2lzdC5cbiAgcHJpdmF0ZSB0b2RvVmlld3MoKTogKERhc2hib2FyZFZpZXcgfCBUb2RvaXN0VmlldylbXSB7XG4gICAgY29uc3Qgb3V0OiAoRGFzaGJvYXJkVmlldyB8IFRvZG9pc3RWaWV3KVtdID0gW107XG4gICAgZm9yIChjb25zdCB0IG9mIFtWSUVXX1RZUEUsIFRPRE9JU1RfVklFV19UWVBFXSlcbiAgICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKHQpKSB7XG4gICAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldyB8fCB2IGluc3RhbmNlb2YgVG9kb2lzdFZpZXcpIG91dC5wdXNoKHYpO1xuICAgICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvLyBSZS1idXNjYSBvIFRvZG9pc3QgKGNvbnRyb2xsZXIgXHUwMEZBbmljbyBcdTIxOTIgbm90aWZpY2EgdG9kYXMgYXMgdmlld3MgaW5zY3JpdGFzKS5cbiAgcmVmcmVzaERhc2hib2FyZHMoKSB7XG4gICAgdGhpcy50b2RvLnJlc2V0KCk7XG4gIH1cblxuICAvLyBSZXNldGEgbyBlc3RhZG8gZG8gU3luY3RoaW5nIG5hcyBkYXNoYm9hcmRzIChleC46IHRva2VuL1VSTCBhbHRlcmFkb3MpLlxuICByZWZyZXNoU3luYygpIHtcbiAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEUpKSB7XG4gICAgICBjb25zdCB2ID0gbGVhZi52aWV3O1xuICAgICAgaWYgKHYgaW5zdGFuY2VvZiBEYXNoYm9hcmRWaWV3KSB2LnJlc2V0U3luYygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlLXJlbmRlcml6YSB0b2RhcyBhcyB2aWV3cyBhYmVydGFzIChhcFx1MDBGM3MgbXVkYXIgY29uZmlnIG5hIGFiYSBkZVxuICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRjVlczogb3JkZW0gZGFzIHNlXHUwMEU3XHUwMEY1ZXMsIG9jdWx0YXIvbW9zdHJhciwgZm9udGVzLCBwYWNvdGVzKS5cbiAgcmVyZW5kZXJEYXNoYm9hcmRzKCkge1xuICAgIGZvciAoY29uc3QgdiBvZiB0aGlzLnRvZG9WaWV3cygpKSB2LnJlZnJlc2goKTtcbiAgfVxuXG4gIC8vIE1vc3RyYS9vY3VsdGEgdW1hIHNlXHUwMEU3XHUwMEUzbyAoXCJzZWM6PGlkPlwiKSBvdSBwYXN0YSAoY2FtaW5obykgcG9yIGNoYXZlIGVtIGBoaWRkZW5gLlxuICBhc3luYyBzZXRIaWRkZW4oa2V5OiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xuICAgIGNvbnN0IGhhcyA9IHRoaXMuc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gICAgaWYgKGhpZGRlbiAmJiAhaGFzKSB0aGlzLnNldHRpbmdzLmhpZGRlbi5wdXNoKGtleSk7XG4gICAgZWxzZSBpZiAoIWhpZGRlbiAmJiBoYXMpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gdGhpcy5zZXR0aW5ncy5oaWRkZW4uZmlsdGVyKGsgPT4gayAhPT0ga2V5KTtcbiAgICBlbHNlIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICAvLyBSZW9yZGVuYSB1bWEgc2VcdTAwRTdcdTAwRTNvIGVtIHNlY3Rpb25PcmRlciAoZGlyID0gLTEgc29iZSwgKzEgZGVzY2UpLlxuICBhc3luYyBtb3ZlU2VjdGlvbihpZDogU2VjdGlvbklkLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IG9yZGVyID0gWy4uLnRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyXTtcbiAgICBjb25zdCBpID0gb3JkZXIuaW5kZXhPZihpZCk7XG4gICAgY29uc3QgaiA9IGkgKyBkaXI7XG4gICAgaWYgKGkgPCAwIHx8IGogPCAwIHx8IGogPj0gb3JkZXIubGVuZ3RoKSByZXR1cm47XG4gICAgW29yZGVyW2ldLCBvcmRlcltqXV0gPSBbb3JkZXJbal0sIG9yZGVyW2ldXTtcbiAgICB0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IG9yZGVyO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZXJlbmRlckRhc2hib2FyZHMoKTtcbiAgfVxuXG4gIGFzeW5jIG1vdmVQYWNrYWdlKGluZGV4OiBudW1iZXIsIGRpcjogbnVtYmVyKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgY29uc3QgaiA9IGluZGV4ICsgZGlyO1xuICAgIGlmIChpbmRleCA8IDAgfHwgaiA8IDAgfHwgaiA+PSBhcnIubGVuZ3RoKSByZXR1cm47XG4gICAgW2FycltpbmRleF0sIGFycltqXV0gPSBbYXJyW2pdLCBhcnJbaW5kZXhdXTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gICAgbGV0IG5lZWRTdE1pZ3JhdGlvbiA9IGZhbHNlOyAgIC8vIGNyZWRlbmNpYWlzIFN5bmN0aGluZyBtaWdyYW5kbyBkYXRhLmpzb24gXHUyMTkyIGxvY2FsU3RvcmFnZVxuICAgIC8vIFNhbmVhbWVudG86IHNlY3Rpb25PcmRlciBjb20gZXhhdGFtZW50ZSBhcyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcInN5bmNcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwiY2FsZW5kYXJcIl07XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8U2VjdGlvbklkPigpO1xuICAgIGNvbnN0IGNsZWFuZWQgPSAodGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgfHwgW10pLmZpbHRlcihcbiAgICAgIChzKTogcyBpcyBTZWN0aW9uSWQgPT4gdmFsaWQuaW5jbHVkZXMocyBhcyBTZWN0aW9uSWQpICYmICFzZWVuLmhhcyhzIGFzIFNlY3Rpb25JZCkgJiYgKHNlZW4uYWRkKHMgYXMgU2VjdGlvbklkKSwgdHJ1ZSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWxpZCkgaWYgKCFzZWVuLmhhcyh2KSkgY2xlYW5lZC5wdXNoKHYpO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gY2xlYW5lZDsgICAvLyBcInJlcG9ydHNcIiBzb21lIGFxdWkgc2UgZXN0YXZhIG51bWEgY29uZmlnIGFudGlnYVxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNldHRpbmdzLmhpZGRlbikpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gW107XG4gICAgLy8gRm9udGVzIGRhIFNlbWFuYSAodjAuMTAuMSk6IHZhbGlkYSBhIGxpc3RhOyBzZSBhdXNlbnRlL2ludlx1MDBFMWxpZGEsIHVzYSBvIGRlZmF1bHQuXG4gICAgY29uc3QgY3MgPSB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcztcbiAgICB0aGlzLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcyA9IEFycmF5LmlzQXJyYXkoY3MpICYmIGNzLmxlbmd0aFxuICAgICAgPyBjcy5maWx0ZXIocyA9PiBzICYmIHR5cGVvZiBzLnBhdGggPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgLm1hcChzID0+ICh7IHBhdGg6IHMucGF0aCwgY29sb3I6IHR5cGVvZiBzLmNvbG9yID09PSBcInN0cmluZ1wiID8gcy5jb2xvciA6IEFDQ0VOVFNbMF0sIG9uOiBzLm9uICE9PSBmYWxzZSB9KSlcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5jYWxlbmRhclNvdXJjZXMubWFwKHMgPT4gKHsgLi4ucyB9KSk7XG4gICAgLy8gU2FuZWFtZW50byBUb2RvaXN0ICh2MC43LjApLlxuICAgIHRoaXMuc2V0dGluZ3MudG9kb2lzdERheVJhbmdlID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0RGF5UmFuZ2UgPT09IDMgPyAzIDogNztcbiAgICBjb25zdCB0ZiA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdEZpbHRlcnM7XG4gICAgdGhpcy5zZXR0aW5ncy50b2RvaXN0RmlsdGVycyA9IHtcbiAgICAgIHByb2plY3RzOiBBcnJheS5pc0FycmF5KHRmPy5wcm9qZWN0cykgPyB0Zi5wcm9qZWN0cyA6IFtdLFxuICAgICAgbGFiZWxzOiBBcnJheS5pc0FycmF5KHRmPy5sYWJlbHMpID8gdGYubGFiZWxzIDogW10sXG4gICAgfTtcbiAgICAvLyBFeGliaVx1MDBFN1x1MDBFM28gbmFzIGxpbmhhcyAodjAuOC4wKS5cbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93UHJvamVjdCA9IHRoaXMuc2V0dGluZ3MudG9kb2lzdFNob3dQcm9qZWN0ICE9PSBmYWxzZTtcbiAgICB0aGlzLnNldHRpbmdzLnRvZG9pc3RTaG93TGFiZWxzID0gdGhpcy5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9PT0gdHJ1ZTtcbiAgICAvLyBTeW5jdGhpbmcgKHYwLjEwLjApIFx1MjAxNCBjcmVkZW5jaWFpcyBzXHUwMEUzbyBQT1ItRElTUE9TSVRJVk86IHZpdmVtIG5vIGxvY2FsU3RvcmFnZVxuICAgIC8vIChuXHUwMEUzbyBzaW5jcm9uaXphbSBwZWxvIGRhdGEuanNvbikuIE1pZ3JhXHUwMEU3XHUwMEUzbyAoMXgpOiBzZSBvIGxvY2FsU3RvcmFnZSBhaW5kYSBuXHUwMEUzb1xuICAgIC8vIHRlbSwgaGVyZGEgbyB2YWxvciBxdWUgZXN0YXZhIG5vIGRhdGEuanNvbiBlIHJlZ3JhdmEgKHZlciBmaW0gZG8gbVx1MDBFOXRvZG8pLlxuICAgIGNvbnN0IGxzR2V0ID0gKGs6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgY29uc3QgdiA9IHRoaXMuYXBwLmxvYWRMb2NhbFN0b3JhZ2Uoayk7XG4gICAgICByZXR1cm4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgPyB2IDogbnVsbDtcbiAgICB9O1xuICAgIGNvbnN0IGRhdGFVcmwgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdVcmwudHJpbSgpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsIDogXCJodHRwOi8vMTI3LjAuMC4xOjgzODRcIjtcbiAgICBjb25zdCBkYXRhS2V5ID0gdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID09PSBcInN0cmluZ1wiID8gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgOiBcIlwiO1xuICAgIGNvbnN0IGRhdGFGb2xkZXIgPSB0eXBlb2YgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgOiBcIlwiO1xuICAgIG5lZWRTdE1pZ3JhdGlvbiA9IGxzR2V0KExTX1NUX1VSTCkgPT09IG51bGwgJiYgbHNHZXQoTFNfU1RfS0VZKSA9PT0gbnVsbCAmJiBsc0dldChMU19TVF9GT0xERVIpID09PSBudWxsO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsID0gbHNHZXQoTFNfU1RfVVJMKSA/PyBkYXRhVXJsO1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nQXBpS2V5ID0gbHNHZXQoTFNfU1RfS0VZKSA/PyBkYXRhS2V5O1xuICAgIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nRm9sZGVySWQgPSBsc0dldChMU19TVF9GT0xERVIpID8/IGRhdGFGb2xkZXI7XG4gICAgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID0gdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzID09PSB0cnVlO1xuICAgIC8vIFBhY290ZXMgZGUgdGFyZWZhcyAodjAuMTIuMCkuXG4gICAgY29uc3QgdHAgPSB0aGlzLnNldHRpbmdzLnRhc2tQYWNrYWdlcztcbiAgICB0aGlzLnNldHRpbmdzLnRhc2tQYWNrYWdlcyA9IEFycmF5LmlzQXJyYXkodHApXG4gICAgICA/IHRwLmZpbHRlcihwID0+IHAgJiYgdHlwZW9mIHAuaWQgPT09IFwic3RyaW5nXCIpLm1hcChwID0+ICh7XG4gICAgICAgICAgaWQ6IHAuaWQsXG4gICAgICAgICAgbmFtZTogdHlwZW9mIHAubmFtZSA9PT0gXCJzdHJpbmdcIiA/IHAubmFtZSA6IFwiXCIsXG4gICAgICAgICAgaWNvbjogdHlwZW9mIHAuaWNvbiA9PT0gXCJzdHJpbmdcIiAmJiBwLmljb24udHJpbSgpID8gcC5pY29uIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHRhc2tzOiBBcnJheS5pc0FycmF5KHAudGFza3MpID8gcC50YXNrcy5maWx0ZXIoeCA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIikgOiBbXSxcbiAgICAgICAgICBwcm9qZWN0SWQ6IHR5cGVvZiBwLnByb2plY3RJZCA9PT0gXCJzdHJpbmdcIiAmJiBwLnByb2plY3RJZCA/IHAucHJvamVjdElkIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGxhYmVsczogQXJyYXkuaXNBcnJheShwLmxhYmVscykgPyBwLmxhYmVscy5maWx0ZXIoeCA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIikgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pKVxuICAgICAgOiBbXTtcbiAgICB0aGlzLnNldHRpbmdzLnBhY2thZ2VDb25maXJtID0gW1wiYWx3YXlzXCIsIFwibWFueVwiLCBcIm5ldmVyXCJdLmluY2x1ZGVzKHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0pXG4gICAgICA/IHRoaXMuc2V0dGluZ3MucGFja2FnZUNvbmZpcm0gOiBcIm1hbnlcIjtcblxuICAgIC8vIE1pZ3JhXHUwMEU3XHUwMEUzbyAxeDogZ3JhdmEgYXMgY3JlZGVuY2lhaXMgbm8gbG9jYWxTdG9yYWdlIGUgYXMgcmVtb3ZlIGRvIGRhdGEuanNvbi5cbiAgICBpZiAobmVlZFN0TWlncmF0aW9uKSBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIC8vIENyZWRlbmNpYWlzIGRvIFN5bmN0aGluZyBzXHUwMEUzbyBwb3ItZGlzcG9zaXRpdm8gXHUyMTkyIGxvY2FsU3RvcmFnZSAoblx1MDBFM28gc2luY3Jvbml6YSkuXG4gICAgdGhpcy5hcHAuc2F2ZUxvY2FsU3RvcmFnZShMU19TVF9VUkwsIHRoaXMuc2V0dGluZ3Muc3luY3RoaW5nVXJsKTtcbiAgICB0aGlzLmFwcC5zYXZlTG9jYWxTdG9yYWdlKExTX1NUX0tFWSwgdGhpcy5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkpO1xuICAgIHRoaXMuYXBwLnNhdmVMb2NhbFN0b3JhZ2UoTFNfU1RfRk9MREVSLCB0aGlzLnNldHRpbmdzLnN5bmN0aGluZ0ZvbGRlcklkKTtcbiAgICAvLyBPIGRhdGEuanNvbiAoc2luY3Jvbml6YWRvIHBlbG8gU3luY3RoaW5nKSBOXHUwMEMzTyBsZXZhIGFzIGNyZWRlbmNpYWlzLlxuICAgIGNvbnN0IHNoYXJlZDogUGFydGlhbDxEYXNoU2V0dGluZ3M+ID0geyAuLi50aGlzLnNldHRpbmdzIH07XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdVcmw7XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdBcGlLZXk7XG4gICAgZGVsZXRlIHNoYXJlZC5zeW5jdGhpbmdGb2xkZXJJZDtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHNoYXJlZCk7XG4gIH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgb3BlblRvZG9pc3QoKSB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGxldCBsZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShUT0RPSVNUX1ZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVE9ET0lTVF9WSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgLy8gVmFycmUgZWxlbWVudG9zIGZsdXR1YW50ZXMgcXVlIHZpdmVtIG5vIGRvY3VtZW50LmJvZHkgKHRvb2x0aXBzL3BvcG92ZXJzKTogc2Ugb1xuICAgIC8vIHBsdWdpbiBmb3IgZGVzYWJpbGl0YWRvIGNvbSB1bSBhYmVydG8sIG8gb25DbG9zZSBkYSB2aWV3IHBvZGUgblx1MDBFM28gcm9kYXIuXG4gICAgdGhpcy50b2RvPy5oaWRlVGlwKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZC10b29sdGlwLCAud2QtcG9wXCIpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlZGljYWRhIGRvIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBIdWIgZG8gVG9kb2lzdCBuYSBcdTAwRTFyZWEgY2VudHJhbCAoblx1MDBFM28gXHUwMEU5IHNpZGViYXIpOiBsYW5cdTAwRTdhZG9yIGRlIHBhY290ZXMgKyBhIG1lc21hXG4vLyBsaXN0YSBkZSB0YXJlZmFzIGRvIGRhc2hib2FyZCAodmlhIFRvZG9pc3RDb250cm9sbGVyIGNvbXBhcnRpbGhhZG8pLlxuY2xhc3MgVG9kb2lzdFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgdW5zdWJUb2RvOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCkgICAgeyByZXR1cm4gVE9ET0lTVF9WSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIlRvZG9pc3RcIjsgfVxuICBnZXRJY29uKCkgICAgICAgIHsgcmV0dXJuIFwibGlzdC1jaGVja3NcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLnVuc3ViVG9kbyA9IHRoaXMucGx1Z2luLnRvZG8uc3Vic2NyaWJlKCgpID0+IHRoaXMucmVmcmVzaCgpKTtcbiAgfVxuICBhc3luYyBvbkNsb3NlKCkge1xuICAgIHRoaXMudW5zdWJUb2RvPy4oKTtcbiAgICB0aGlzLnVuc3ViVG9kbyA9IG51bGw7XG4gICAgdGhpcy5wbHVnaW4udG9kby5oaWRlVGlwKCk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIiwgXCJ3ZC10b2RvaXN0LXZpZXdcIik7XG5cbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJUb2RvaXN0XCIgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlclBhY2thZ2VzKHJvb3QsIHsgaGVhZGluZzogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLnBsdWdpbi50b2RvLnJlbmRlckxpc3Qoc2VjLCBjdHJscyk7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIE1vZGFsIGRlIGNvbmZpcm1hXHUwMEU3XHUwMEUzbyBnZW5cdTAwRTlyaWNvIChyZXNvbHZlIHRydWUvZmFsc2UpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgQ29uZmlybUl0ZW0ge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxhYmVscz86IHsgbmFtZTogc3RyaW5nOyBjb2xvcjogc3RyaW5nIH1bXTsgICAvLyBjaGlwcyBvcGNpb25haXMgKGV0aXF1ZXRhcylcbn1cblxuaW50ZXJmYWNlIENvbmZpcm1PcHRzIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgYm9keTogc3RyaW5nO1xuICBpdGVtcz86IENvbmZpcm1JdGVtW107ICAgLy8gbGlzdGEgb3BjaW9uYWwgKGV4LjogdGFyZWZhcyBhIGNyaWFyKVxuICBjdGE6IHN0cmluZzsgICAgICAgICAgICAgLy8gclx1MDBGM3R1bG8gZG8gYm90XHUwMEUzbyBkZSBjb25maXJtYVx1MDBFN1x1MDBFM29cbn1cblxuY2xhc3MgQ29uZmlybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGRvbmUgPSBmYWxzZTtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgb3B0czogQ29uZmlybU9wdHMsIHByaXZhdGUgcmVzb2x2ZTogKG9rOiBib29sZWFuKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoXCJ3ZC1jb25maXJtXCIpO1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogdGhpcy5vcHRzLnRpdGxlIH0pO1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyB0ZXh0OiB0aGlzLm9wdHMuYm9keSB9KTtcbiAgICBpZiAodGhpcy5vcHRzLml0ZW1zPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHVsID0gY29udGVudEVsLmNyZWF0ZUVsKFwidWxcIiwgeyBjbHM6IFwid2QtY29uZmlybS1saXN0XCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMub3B0cy5pdGVtcykge1xuICAgICAgICBjb25zdCBsaSA9IHVsLmNyZWF0ZUVsKFwibGlcIik7XG4gICAgICAgIGxpLmNyZWF0ZVNwYW4oeyB0ZXh0OiBpdC50ZXh0IH0pO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgaXQubGFiZWxzID8/IFtdKSB7XG4gICAgICAgICAgY29uc3QgY2hpcCA9IGxpLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY29uZmlybS1sYWJlbFwiIH0pO1xuICAgICAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1sYWJlbC1kb3RcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gbC5jb2xvcjtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bC5uYW1lfWAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYWN0aW9ucyA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtYWN0aW9uc1wiIH0pO1xuICAgIGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSkub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKTtcbiAgICBjb25zdCBvayA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwibW9kLWN0YVwiLCB0ZXh0OiB0aGlzLm9wdHMuY3RhIH0pO1xuICAgIG9rLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMuZG9uZSA9IHRydWU7IHRoaXMuY2xvc2UoKTsgfTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgICB0aGlzLnJlc29sdmUodGhpcy5kb25lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25maXJtTW9kYWwoYXBwOiBBcHAsIG9wdHM6IENvbmZpcm1PcHRzKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IG5ldyBDb25maXJtTW9kYWwoYXBwLCBvcHRzLCByZXNvbHZlKS5vcGVuKCkpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUG9wLXVwIGRlIGRldGFsaGVzIGRhIHRhcmVmYSAoc1x1MDBGMyBsZWl0dXJhOyBib3RcdTAwRTNvIEVkaXRhciBhYnJlIG8gZm9ybXVsXHUwMEUxcmlvKSBcdTI1MDBcblxuaW50ZXJmYWNlIFRhc2tEZXRhaWxPcHRzIHtcbiAgdGFzazogVG9kb2lzdFRhc2s7XG4gIHByb2plY3ROYW1lPzogc3RyaW5nO1xuICBsYWJlbENvbG9yOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIGVkaXQ6ICgpID0+IHZvaWQ7XG4gIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBUYXNrRGV0YWlsTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LCBwcml2YXRlIG9wdHM6IFRhc2tEZXRhaWxPcHRzKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgdCA9IHRoaXMub3B0cy50YXNrO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLW1vZGFsXCIpO1xuICAgIHRpdGxlRWwuc2V0VGV4dCh0LmNvbnRlbnQpO1xuXG4gICAgY29uc3QgbWV0YSA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLXByaVwiLCB0ZXh0OiBwcmkubGFiZWwgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGRrLnNwbGl0KFwiLVwiKTtcbiAgICAgIG1ldGEuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10ZC1jaGlwXCIsIHRleHQ6IGBcdUQ4M0RcdURDQzUgJHtkfS8ke219LyR7eX0ke3QuZHVlPy5pc19yZWN1cnJpbmcgPyBcIiBcdTI3RjNcIiA6IFwiXCJ9YCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0cy5wcm9qZWN0TmFtZSkgbWV0YS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRkLWNoaXBcIiwgdGV4dDogYCMgJHt0aGlzLm9wdHMucHJvamVjdE5hbWV9YCB9KTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgdC5sYWJlbHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBtZXRhLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGQtY2hpcCB3ZC10ZC1sYWJlbFwiIH0pO1xuICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IGBAJHtsfWAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rlc2ModCkpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgdm9pZCBNYXJrZG93blJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcCwgdC5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIC8vIEVkaXRhciAoZXNxdWVyZGEpIFx1MDBCNyBDb25jbHVpciArIEFicmlyIG5vIFRvZG9pc3QgKGRpcmVpdGEpLlxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IGVkaXQgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJcdTI3MEUgRWRpdGFyXCIgfSk7XG4gICAgZWRpdC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHRoaXMub3B0cy5lZGl0KCk7IH07XG4gICAgYWN0aW9ucy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgY29uc3QgZG9uZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlx1MjcxMyBDb25jbHVpclwiIH0pO1xuICAgIGRvbmUub25jbGljayA9ICgpID0+IHsgdGhpcy5vcHRzLmNvbXBsZXRlKCk7IHRoaXMuY2xvc2UoKTsgfTtcbiAgICBjb25zdCBvcGVuID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQWJyaXIgbm8gVG9kb2lzdFwiLCBjbHM6IFwibW9kLWN0YVwiIH0pO1xuICAgIG9wZW4ub25jbGljayA9ICgpID0+IHdpbmRvdy5vcGVuKHRhc2tVcmwodCksIFwiX2JsYW5rXCIpO1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRm9ybXVsXHUwMEUxcmlvIGRlIHRhcmVmYSAoY3JpYXIgLyBlZGl0YXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5pbnRlcmZhY2UgVGFza0Zvcm1WYWx1ZXMge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJIDEuLjQgKDQgPSBwMSlcbiAgZHVlRGF0ZTogc3RyaW5nOyAgICAvLyBZWVlZLU1NLUREIChjYWxlbmRcdTAwRTFyaW8pOyBcIlwiID0gc2VtIGRhdGFcbiAgcHJvamVjdElkOiBzdHJpbmc7XG4gIGxhYmVsczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBUYXNrRm9ybU9wdHMge1xuICBtb2RlOiBcImNyZWF0ZVwiIHwgXCJlZGl0XCI7XG4gIHRhc2s/OiBUb2RvaXN0VGFzaztcbiAgcHJlZmlsbER1ZT86IHN0cmluZztcbiAgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W107XG4gIGxhYmVsczogc3RyaW5nW107XG4gIGxhYmVsQ29sb3I6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgc3VibWl0OiAodjogVGFza0Zvcm1WYWx1ZXMpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIHJlbW92ZT86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZDtcbn1cblxuY2xhc3MgVGFza0Zvcm1Nb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSB2OiBUYXNrRm9ybVZhbHVlcztcbiAgcHJpdmF0ZSBrbm93bkxhYmVsczogc3RyaW5nW107XG4gIHByaXZhdGUgY29uZmlybURlbCA9IGZhbHNlO1xuICBwcml2YXRlIGFjdGlvbnNFbCE6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIG9wdHM6IFRhc2tGb3JtT3B0cykge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgdCA9IG9wdHMudGFzaztcbiAgICAvLyBQcmVmaWxsIGRlIGNyaWFcdTAwRTdcdTAwRTNvOiBcImhvamVcIiBcdTIxOTIgZGF0YSBkZSBob2plOyBqXHUwMEUxLVlZWVktTU0tREQgcGFzc2EgZGlyZXRvOyByZXN0byBpZ25vcmEuXG4gICAgY29uc3QgcHJlID0gb3B0cy5wcmVmaWxsRHVlO1xuICAgIGNvbnN0IHByZWZpbGxEYXRlID0gcHJlID09PSBcImhvamVcIiA/IHRvS2V5KG5ldyBEYXRlKCkpXG4gICAgICA6IChwcmUgJiYgL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocHJlKSA/IHByZSA6IFwiXCIpO1xuICAgIHRoaXMudiA9IHtcbiAgICAgIGNvbnRlbnQ6IHQ/LmNvbnRlbnQgPz8gXCJcIixcbiAgICAgIGRlc2NyaXB0aW9uOiB0Py5kZXNjcmlwdGlvbiA/PyBcIlwiLFxuICAgICAgcHJpb3JpdHk6IHQ/LnByaW9yaXR5ID8/IDEsXG4gICAgICBkdWVEYXRlOiB0Py5kdWU/LmRhdGUgPyB0LmR1ZS5kYXRlLnN1YnN0cmluZygwLCAxMCkgOiBwcmVmaWxsRGF0ZSxcbiAgICAgIHByb2plY3RJZDogdD8ucHJvamVjdF9pZCA/PyBcIlwiLFxuICAgICAgbGFiZWxzOiAodD8ubGFiZWxzID8/IFtdKS5zbGljZSgpLFxuICAgIH07XG4gICAgdGhpcy5rbm93bkxhYmVscyA9IFsuLi5uZXcgU2V0KFsuLi5vcHRzLmxhYmVscywgLi4udGhpcy52LmxhYmVsc10pXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsLCB0aXRsZUVsLCBtb2RhbEVsIH0gPSB0aGlzO1xuICAgIG1vZGFsRWwuYWRkQ2xhc3MoXCJ3ZC10YXNrLWZvcm1cIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHRoaXMub3B0cy5tb2RlID09PSBcImNyZWF0ZVwiID8gXCJOb3ZhIHRhcmVmYVwiIDogXCJFZGl0YXIgdGFyZWZhXCIpO1xuXG4gICAgLy8gU1x1MDBGMyBuYSBlZGlcdTAwRTdcdTAwRTNvOiBhdGFsaG8gXCJBYnJpciBubyBUb2RvaXN0XCIgbm8gdG9wbywgYW8gbGFkbyBkbyBYIGRlIGZlY2hhci5cbiAgICBpZiAodGhpcy5vcHRzLm1vZGUgPT09IFwiZWRpdFwiICYmIHRoaXMub3B0cy50YXNrKSB7XG4gICAgICBjb25zdCBvcGVuID0gbW9kYWxFbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJ3ZC10Zi1vcGVuLXRvcFwiLCB0ZXh0OiBcIlx1MjE5NyBUb2RvaXN0XCIgfSk7XG4gICAgICBvcGVuLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIG5vIFRvZG9pc3RcIik7XG4gICAgICBvcGVuLm9uY2xpY2sgPSAoKSA9PiB3aW5kb3cub3Blbih0YXNrVXJsKHRoaXMub3B0cy50YXNrISksIFwiX2JsYW5rXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZmllbGQoXCJUXHUwMEVEdHVsb1wiKTtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIgfSk7XG4gICAgY29udGVudC52YWx1ZSA9IHRoaXMudi5jb250ZW50O1xuICAgIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBcIk8gcXVlIHByZWNpc2Egc2VyIGZlaXRvP1wiO1xuICAgIGNvbnRlbnQub25pbnB1dCA9ICgpID0+IHsgdGhpcy52LmNvbnRlbnQgPSBjb250ZW50LnZhbHVlOyB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGVudC5mb2N1cygpLCAwKTtcblxuICAgIHRoaXMuZmllbGQoXCJEZXNjcmlcdTAwRTdcdTAwRTNvXCIpO1xuICAgIGNvbnN0IGRlc2MgPSBjb250ZW50RWwuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC10Zi10ZXh0YXJlYVwiIH0pO1xuICAgIGRlc2MudmFsdWUgPSB0aGlzLnYuZGVzY3JpcHRpb247XG4gICAgZGVzYy5wbGFjZWhvbGRlciA9IFwiRGV0YWxoZXMgLyBpbnN0cnVcdTAwRTdcdTAwRjVlcyAobWFya2Rvd24pXCI7XG4gICAgZGVzYy5yb3dzID0gMztcbiAgICBkZXNjLm9uaW5wdXQgPSAoKSA9PiB7IHRoaXMudi5kZXNjcmlwdGlvbiA9IGRlc2MudmFsdWU7IH07XG5cbiAgICB0aGlzLmZpZWxkKFwiUHJpb3JpZGFkZVwiKTtcbiAgICBjb25zdCBwcm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1wcmktcm93XCIgfSk7XG4gICAgY29uc3QgcmVuZGVyUHJpID0gKCkgPT4ge1xuICAgICAgcHJvdy5lbXB0eSgpO1xuICAgICAgZm9yIChjb25zdCBhcGkgb2YgWzQsIDMsIDIsIDFdKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBUT0RPSVNUX1BSSVthcGldO1xuICAgICAgICBjb25zdCBiID0gcHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLXByaVwiICsgKHRoaXMudi5wcmlvcml0eSA9PT0gYXBpID8gXCIgd2Qtb25cIiA6IFwiXCIpLCB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgICBiLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgbWV0YS5jb2xvcik7XG4gICAgICAgIGIuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcodGhpcy52LnByaW9yaXR5ID09PSBhcGkpKTtcbiAgICAgICAgY2xpY2thYmxlKGIsICgpID0+IHsgdGhpcy52LnByaW9yaXR5ID0gYXBpOyByZW5kZXJQcmkoKTsgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZW5kZXJQcmkoKTtcblxuICAgIHRoaXMuZmllbGQoXCJEYXRhXCIpO1xuICAgIGNvbnN0IGRyb3cgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWR1ZS1yb3dcIiB9KTtcbiAgICBjb25zdCBkdWUgPSBkcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtdGYtaW5wdXQgd2QtdGYtZGF0ZVwiLCB0eXBlOiBcImRhdGVcIiB9KTtcbiAgICBkdWUudmFsdWUgPSB0aGlzLnYuZHVlRGF0ZTtcbiAgICBkdWUub25jaGFuZ2UgPSAoKSA9PiB7IHRoaXMudi5kdWVEYXRlID0gZHVlLnZhbHVlOyB9O1xuICAgIGNvbnN0IGNsciA9IGRyb3cuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwid2QtdGYtZHVlLWNsZWFyXCIsIHRleHQ6IFwic2VtIGRhdGFcIiB9KTtcbiAgICBjbHIub25jbGljayA9ICgpID0+IHsgdGhpcy52LmR1ZURhdGUgPSBcIlwiOyBkdWUudmFsdWUgPSBcIlwiOyB9O1xuICAgIGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIkNsaXF1ZSBwYXJhIGFicmlyIG8gY2FsZW5kXHUwMEUxcmlvLiBWYXppbyA9IHNlbSBkYXRhLlwiIH0pO1xuICAgIGlmICh0aGlzLm9wdHMudGFzaz8uZHVlPy5pc19yZWN1cnJpbmcpXG4gICAgICBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLXdhcm5cIiwgdGV4dDogXCJcdTI3RjMgVGFyZWZhIHJlY29ycmVudGUgXHUyMDE0IG11ZGFyIGEgZGF0YSBmaXhhIHBvZGUgZW5jZXJyYXIgYSByZWNvcnJcdTAwRUFuY2lhLlwiIH0pO1xuXG4gICAgdGhpcy5maWVsZChcIlByb2pldG9cIik7XG4gICAgY29uc3Qgc2VsID0gY29udGVudEVsLmNyZWF0ZUVsKFwic2VsZWN0XCIsIHsgY2xzOiBcIndkLXRmLXNlbGVjdFwiIH0pO1xuICAgIGNvbnN0IGluYm94ID0gc2VsLmNyZWF0ZUVsKFwib3B0aW9uXCIsIHsgdGV4dDogXCJFbnRyYWRhIChJbmJveClcIiwgdmFsdWU6IFwiXCIgfSk7XG4gICAgaWYgKCF0aGlzLnYucHJvamVjdElkKSBpbmJveC5zZWxlY3RlZCA9IHRydWU7XG4gICAgZm9yIChjb25zdCBwIG9mIHRoaXMub3B0cy5wcm9qZWN0cykge1xuICAgICAgY29uc3QgbyA9IHNlbC5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IHAubmFtZSwgdmFsdWU6IHAuaWQgfSk7XG4gICAgICBpZiAocC5pZCA9PT0gdGhpcy52LnByb2plY3RJZCkgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICAgIHNlbC5vbmNoYW5nZSA9ICgpID0+IHsgdGhpcy52LnByb2plY3RJZCA9IHNlbC52YWx1ZTsgfTtcblxuICAgIHRoaXMuZmllbGQoXCJFdGlxdWV0YXNcIik7XG4gICAgY29uc3QgbHdyYXAgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRmLWxhYmVsc1wiIH0pO1xuICAgIGlmICh0aGlzLmtub3duTGFiZWxzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcmVuZGVyTGFiZWxzID0gKCkgPT4ge1xuICAgICAgICBsd3JhcC5lbXB0eSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGwgb2YgdGhpcy5rbm93bkxhYmVscykge1xuICAgICAgICAgIGNvbnN0IG9uID0gdGhpcy52LmxhYmVscy5pbmNsdWRlcyhsKTtcbiAgICAgICAgICBjb25zdCBjaGlwID0gbHdyYXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWxhYmVsLWRvdFwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLm9wdHMubGFiZWxDb2xvcihsKTtcbiAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiBgQCR7bH1gIH0pO1xuICAgICAgICAgIGNoaXAuc2V0QXR0cihcImFyaWEtcHJlc3NlZFwiLCBTdHJpbmcob24pKTtcbiAgICAgICAgICBjbGlja2FibGUoY2hpcCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMudi5sYWJlbHMuaW5kZXhPZihsKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHRoaXMudi5sYWJlbHMuc3BsaWNlKGksIDEpOyBlbHNlIHRoaXMudi5sYWJlbHMucHVzaChsKTtcbiAgICAgICAgICAgIHJlbmRlckxhYmVscygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVuZGVyTGFiZWxzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGx3cmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiTmVuaHVtYSBldGlxdWV0YSBubyBUb2RvaXN0IGFpbmRhLlwiIH0pO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aW9uc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1hY3Rpb25zXCIgfSk7XG4gICAgdGhpcy5yZW5kZXJBY3Rpb25zKCk7XG4gIH1cblxuICBwcml2YXRlIGZpZWxkKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtbGFiZWxcIiwgdGV4dDogbGFiZWwgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFjdGlvbnMoKSB7XG4gICAgY29uc3QgYSA9IHRoaXMuYWN0aW9uc0VsO1xuICAgIGEuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLmNvbmZpcm1EZWwgJiYgdGhpcy5vcHRzLnJlbW92ZSkge1xuICAgICAgYS5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRmLWNvbmZpcm1cIiwgdGV4dDogXCJFeGNsdWlyIGVzdGEgdGFyZWZhP1wiIH0pO1xuICAgICAgYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtc3BhY2VyXCIgfSk7XG4gICAgICBjb25zdCB5ZXMgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJFeGNsdWlyXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pO1xuICAgICAgeWVzLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHllcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmIChhd2FpdCB0aGlzLm9wdHMucmVtb3ZlISgpKSB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGVsc2UgeyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH1cbiAgICAgIH07XG4gICAgICBjb25zdCBubyA9IGEuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbGFyXCIgfSk7XG4gICAgICBuby5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSBmYWxzZTsgdGhpcy5yZW5kZXJBY3Rpb25zKCk7IH07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5tb2RlID09PSBcImVkaXRcIikge1xuICAgICAgY29uc3QgZGVsID0gYS5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRXhjbHVpclwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KTtcbiAgICAgIGRlbC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLmNvbmZpcm1EZWwgPSB0cnVlOyB0aGlzLnJlbmRlckFjdGlvbnMoKTsgfTtcbiAgICB9XG5cbiAgICBhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1zcGFjZXJcIiB9KTtcbiAgICBjb25zdCBjYW5jZWwgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxhclwiIH0pO1xuICAgIGNhbmNlbC5vbmNsaWNrID0gKCkgPT4gdGhpcy5jbG9zZSgpO1xuICAgIGNvbnN0IHNhdmUgPSBhLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJTYWx2YXJcIiwgY2xzOiBcIm1vZC1jdGFcIiB9KTtcbiAgICBzYXZlLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnYuY29udGVudCA9IHRoaXMudi5jb250ZW50LnRyaW0oKTtcbiAgICAgIGlmICghdGhpcy52LmNvbnRlbnQpIHsgbmV3IE5vdGljZShcIkRcdTAwRUEgdW0gdFx1MDBFRHR1bG8gXHUwMEUwIHRhcmVmYS5cIik7IHJldHVybjsgfVxuICAgICAgc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5vcHRzLnN1Ym1pdCh0aGlzLnYpKSB0aGlzLmNsb3NlKCk7XG4gICAgICBlbHNlIHNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlIGNvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBXZXJ1c1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgLy8gUHJvamV0b3MgZG8gVG9kb2lzdCAocGFyYSBvcyBkcm9wZG93bnMgZG9zIHBhY290ZXMpLiBCdXNjYWRvcyAxeDsgcXVhbmRvXG4gIC8vIGNoZWdhbSwgcmUtcmVuZGVyaXphIGEgYWJhIHBhcmEgcHJlZW5jaGVyIG9zIHNlbGVjdHMuXG4gIHByaXZhdGUgcHJvamVjdHM6IFRvZG9pc3RQcm9qZWN0W10gfCBudWxsID0gbnVsbDtcbiAgLy8gRXRpcXVldGFzIGRvIFRvZG9pc3QgKGNoaXBzIHBvciBwYWNvdGUpLiBNZXNtYSBlc3RyYXRcdTAwRTlnaWE6IGJ1c2NhIDF4LlxuICBwcml2YXRlIGxhYmVsczogVG9kb2lzdExhYmVsW10gfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGFwcCwgcGx1Z2luKTsgfVxuXG4gIGRpc3BsYXkoKSB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEV4aWJpXHUwMEU3XHUwMEUzbyBkbyBkYXNoYm9hcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRXhpYmlcdTAwRTdcdTAwRTNvIGRvIGRhc2hib2FyZFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vZG8gY29tcGFjdG9cIilcbiAgICAgIC5zZXREZXNjKFwiTGF5b3V0IG1haXMgZGVuc28sIGNvbSBtZW5vcyBlc3BhXHUwMEU3YW1lbnRvIGVudHJlIG9zIGVsZW1lbnRvcy5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY29tcGFjdClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID0gdjtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICB9KSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU2VcdTAwRTdcdTAwRjVlcyBkbyBkYXNoYm9hcmQgKHZpc2liaWxpZGFkZSArIG9yZGVtKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJTZVx1MDBFN1x1MDBGNWVzIGRvIGRhc2hib2FyZFwiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgICB0ZXh0OiBcIkF0aXZlL2Rlc2F0aXZlIGNhZGEgc2VcdTAwRTdcdTAwRTNvIGUgYWp1c3RlIGEgb3JkZW0gZW0gcXVlIGFwYXJlY2VtIG5hIGRhc2hib2FyZC5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IG9yZGVyID0gcGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcjtcbiAgICBvcmRlci5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFNFQ1RJT05fTEFCRUxbaWRdKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy11cFwiKS5zZXRUb29sdGlwKFwiTW92ZXIgcGFyYSBjaW1hXCIpLnNldERpc2FibGVkKGkgPT09IDApXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsIC0xKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkRXh0cmFCdXR0b24oYiA9PiBiXG4gICAgICAgICAgLnNldEljb24oXCJhcnJvdy1kb3duXCIpLnNldFRvb2x0aXAoXCJNb3ZlciBwYXJhIGJhaXhvXCIpLnNldERpc2FibGVkKGkgPT09IG9yZGVyLmxlbmd0aCAtIDEpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVNlY3Rpb24oaWQsICsxKTsgdGhpcy5kaXNwbGF5KCk7IH0pKVxuICAgICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAgIC5zZXRUb29sdGlwKFwiVmlzXHUwMEVEdmVsXCIpXG4gICAgICAgICAgLnNldFZhbHVlKCFwbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKFwic2VjOlwiICsgaWQpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgYXdhaXQgcGx1Z2luLnNldEhpZGRlbihcInNlYzpcIiArIGlkLCAhdik7IH0pKTtcbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYXN0YXMgZXhpYmlkYXMgKGNhcmRzIGRvIENvZnJlKVwiIH0pO1xuICAgIGNvbnN0IHRvcEZvbGRlcnMgPSAodGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpLmNoaWxkcmVuXG4gICAgICAuZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgIWMubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgYXMgVEZvbGRlcltdKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgaWYgKCF0b3BGb2xkZXJzLmxlbmd0aCkge1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLCB0ZXh0OiBcIk5lbmh1bWEgcGFzdGEgZGUgdG9wbyBubyBjb2ZyZS5cIiB9KTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIHRvcEZvbGRlcnMpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShmLm5hbWUpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJWaXNcdTAwRUR2ZWxcIilcbiAgICAgICAgICAuc2V0VmFsdWUoIXBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoZi5wYXRoKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IGF3YWl0IHBsdWdpbi5zZXRIaWRkZW4oZi5wYXRoLCAhdik7IH0pKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRm9udGVzIGRhIHNlXHUwMEU3XHUwMEUzbyBSZWxhdFx1MDBGM3Jpb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRm9udGVzIGRvcyBSZWxhdFx1MDBGM3Jpb3NcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJQYXN0YXMgY3VqYXMgbm90YXMgdmlyYW0gY2FyZHMgbm9zIGRpYXMgZGEgc2VcdTAwRTdcdTAwRTNvIFJlbGF0XHUwMEYzcmlvcyAocG9zaVx1MDBFN1x1MDBFM28gcGVsYSBkYXRhIGRhIG5vdGEpLiBDYWRhIGZvbnRlIHRlbSB1bWEgY29yIHByXHUwMEYzcHJpYS5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNyY3MgPSBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzO1xuICAgIHNyY3MuZm9yRWFjaChzID0+IHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShzLnBhdGgpXG4gICAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgICAgLnNldFRvb2x0aXAoXCJBdGl2YVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZShzLm9uKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5vbiA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZENvbG9yUGlja2VyKGMgPT4gY1xuICAgICAgICAgIC5zZXRWYWx1ZShzLmNvbG9yKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHsgcy5jb2xvciA9IHY7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpOyB9KSlcbiAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGIgPT4gYlxuICAgICAgICAgIC5zZXRJY29uKFwidHJhc2gtMlwiKS5zZXRUb29sdGlwKFwiUmVtb3ZlciBmb250ZVwiKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jYWxlbmRhclNvdXJjZXMgPSBzcmNzLmZpbHRlcih4ID0+IHggIT09IHMpO1xuICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlZCA9IG5ldyBTZXQoc3Jjcy5tYXAocyA9PiBzLnBhdGgpKTtcbiAgICBjb25zdCBhdmFpbGFibGUgPSBhbGxGb2xkZXJQYXRocyh0aGlzLmFwcCkuZmlsdGVyKHAgPT4gIXVzZWQuaGFzKHApKTtcbiAgICBpZiAoYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiQWRpY2lvbmFyIGZvbnRlXCIpXG4gICAgICAgIC5zZXREZXNjKFwiRXNjb2xoYSB1bWEgcGFzdGEgZG8gY29mcmUgcGFyYSBhbGltZW50YXIgYSBzZVx1MDBFN1x1MDBFM28gUmVsYXRcdTAwRjNyaW9zLlwiKVxuICAgICAgICAuYWRkRHJvcGRvd24oZCA9PiB7XG4gICAgICAgICAgZC5hZGRPcHRpb24oXCJcIiwgXCJFc2NvbGhhIHVtYSBwYXN0YVx1MjAyNlwiKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgYXZhaWxhYmxlKSBkLmFkZE9wdGlvbihwLCBwKTtcbiAgICAgICAgICBkLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgaWYgKCF2KSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IEFDQ0VOVFNbcGx1Z2luLnNldHRpbmdzLmNhbGVuZGFyU291cmNlcy5sZW5ndGggJSBBQ0NFTlRTLmxlbmd0aF07XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY2FsZW5kYXJTb3VyY2VzLnB1c2goeyBwYXRoOiB2LCBjb2xvciwgb246IHRydWUgfSk7XG4gICAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhY290ZXMgZGUgdGFyZWZhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJQYWNvdGVzIGRlIHRhcmVmYXNcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJDb25qdW50b3MgZGUgdGFyZWZhcyBxdWUgdm9jXHUwMEVBIGxhblx1MDBFN2Egbm8gVG9kb2lzdCBjb20gdW0gY2xpcXVlIChuYSBhYmEgVG9kb2lzdCBvdSBubyBkYXNoYm9hcmQpLCB0b2RhcyBjb20gZGF0YSBkZSBob2plLiBVbWEgdGFyZWZhIHBvciBsaW5oYS4gVXNlIEBldGlxdWV0YSBudW1hIGxpbmhhIHBhcmEgYXBsaWNhciB1bWEgZXRpcXVldGEgc1x1MDBGMyBcdTAwRTBxdWVsYSB0YXJlZmEuXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29uZmlybWFyIGFudGVzIGRlIGxhblx1MDBFN2FyXCIpXG4gICAgICAuc2V0RGVzYyhcIlBlZGUgY29uZmlybWFcdTAwRTdcdTAwRTNvIChjb20gYSBsaXN0YSBkZSB0YXJlZmFzKSBhbnRlcyBkZSBjcmlhci4gXFxcIlNlbXByZVxcXCIgY29uZmlybWEgYXRcdTAwRTkgcGFyYSAxIHRhcmVmYSBcdTIwMTQgXHUwMEZBdGlsIHBhcmEgdGVzdGFyOyBkZXBvaXMgbXVkZSBwYXJhIE51bmNhLlwiKVxuICAgICAgLmFkZERyb3Bkb3duKGQgPT4gZFxuICAgICAgICAuYWRkT3B0aW9uKFwiYWx3YXlzXCIsIFwiU2VtcHJlXCIpXG4gICAgICAgIC5hZGRPcHRpb24oXCJtYW55XCIsIFwiU1x1MDBGMyBtdWl0YXMgKD4gNSB0YXJlZmFzKVwiKVxuICAgICAgICAuYWRkT3B0aW9uKFwibmV2ZXJcIiwgXCJOdW5jYVwiKVxuICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnBhY2thZ2VDb25maXJtKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7IHBsdWdpbi5zZXR0aW5ncy5wYWNrYWdlQ29uZmlybSA9IHYgYXMgRGFzaFNldHRpbmdzW1wicGFja2FnZUNvbmZpcm1cIl07IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfSkpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBwbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICAvLyBCdXNjYSBwcm9qZXRvcyBlIGV0aXF1ZXRhcyB1bWEgdmV6IChkcm9wZG93bnMgKyBjaGlwcyk7IGFvIGNoZWdhciwgcmUtcmVuZGVyaXphLlxuICAgIGlmICh0b2tlbiAmJiB0aGlzLnByb2plY3RzID09PSBudWxsKSB7XG4gICAgICBmZXRjaFRvZG9pc3RQcm9qZWN0cyh0b2tlbikudGhlbihwcyA9PiB7IHRoaXMucHJvamVjdHMgPSBwczsgdGhpcy5kaXNwbGF5KCk7IH0pLmNhdGNoKCgpID0+IHsgdGhpcy5wcm9qZWN0cyA9IFtdOyB9KTtcbiAgICB9XG4gICAgaWYgKHRva2VuICYmIHRoaXMubGFiZWxzID09PSBudWxsKSB7XG4gICAgICBmZXRjaFRvZG9pc3RMYWJlbHModG9rZW4pLnRoZW4obHMgPT4geyB0aGlzLmxhYmVscyA9IGxzOyB0aGlzLmRpc3BsYXkoKTsgfSkuY2F0Y2goKCkgPT4geyB0aGlzLmxhYmVscyA9IFtdOyB9KTtcbiAgICB9XG5cbiAgICAvLyBQb3BvdmVyIGRlIGV0aXF1ZXRhcyBkZSB1bSBwYWNvdGUgKGNoaXBzIHRvZ2dsZSBjb20gYSBjb3IgZG8gVG9kb2lzdCkuXG4gICAgY29uc3Qgb3BlbkxhYmVsc1BvcG92ZXIgPSAoYW5jaG9yOiBIVE1MRWxlbWVudCwgcGtnOiBUYXNrUGFja2FnZSwgcmVmcmVzaDogKCkgPT4gdm9pZCkgPT5cbiAgICAgIG9wZW5Qb3BvdmVyKGFuY2hvciwgYm9keSA9PiB7XG4gICAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBvcC10aXRsZVwiLCB0ZXh0OiBcIkV0aXF1ZXRhcyBkbyBwYWNvdGVcIiB9KTtcbiAgICAgICAgaWYgKCF0b2tlbikgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ29uZmlndXJlIG8gdG9rZW4gZG8gVG9kb2lzdC5cIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGlmICh0aGlzLmxhYmVscyA9PT0gbnVsbCkgeyBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10Zi1oaW50XCIsIHRleHQ6IFwiQ2FycmVnYW5kb1x1MjAyNlwiIH0pOyByZXR1cm47IH1cbiAgICAgICAgaWYgKCF0aGlzLmxhYmVscy5sZW5ndGgpIHsgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIk5lbmh1bWEgZXRpcXVldGEgbm8gVG9kb2lzdC5cIiB9KTsgcmV0dXJuOyB9XG4gICAgICAgIGNvbnN0IGNoaXBzID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcG9wLWNoaXBzXCIgfSk7XG4gICAgICAgIGNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICBjaGlwcy5lbXB0eSgpO1xuICAgICAgICAgIGZvciAoY29uc3QgbCBvZiB0aGlzLmxhYmVscyEpIHtcbiAgICAgICAgICAgIGNvbnN0IG9uID0gKHBrZy5sYWJlbHMgPz8gW10pLmluY2x1ZGVzKGwubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBjaGlwID0gY2hpcHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWZjaGlwXCIgKyAob24gPyBcIiB3ZC1vblwiIDogXCJcIikgfSk7XG4gICAgICAgICAgICBjaGlwLnNldEF0dHIoXCJhcmlhLXByZXNzZWRcIiwgU3RyaW5nKG9uKSk7XG4gICAgICAgICAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbGFiZWwtZG90XCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IFRPRE9JU1RfQ09MT1JTW2wuY29sb3JdID8/IExBQkVMX0ZBTExCQUNLO1xuICAgICAgICAgICAgY2hpcC5jcmVhdGVTcGFuKHsgdGV4dDogYEAke2wubmFtZX1gIH0pO1xuICAgICAgICAgICAgY2xpY2thYmxlKGNoaXAsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY3VyID0gcGtnLmxhYmVscyA/PyBbXTtcbiAgICAgICAgICAgICAgY29uc3QgaSA9IGN1ci5pbmRleE9mKGwubmFtZSk7XG4gICAgICAgICAgICAgIGlmIChpID49IDApIGN1ci5zcGxpY2UoaSwgMSk7IGVsc2UgY3VyLnB1c2gobC5uYW1lKTtcbiAgICAgICAgICAgICAgcGtnLmxhYmVscyA9IGN1ci5sZW5ndGggPyBjdXIgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpO1xuICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sIHsgY2xzOiBcIndkLXBvcC1sYWJlbHNcIiB9KTtcblxuICAgIC8vIFBvcG92ZXIgZGUgdGFyZWZhcyBkZSB1bSBwYWNvdGUgKHRleHRhcmVhOyBwZXJzaXN0ZSBubyBpbnB1dCBlIGFvIGZlY2hhcikuXG4gICAgY29uc3Qgb3BlblRhc2tzUG9wb3ZlciA9IChhbmNob3I6IEhUTUxFbGVtZW50LCBwa2c6IFRhc2tQYWNrYWdlLCByZWZyZXNoOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICBsZXQgdGE6IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgICBvcGVuUG9wb3ZlcihhbmNob3IsIGJvZHkgPT4ge1xuICAgICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wb3AtdGl0bGVcIiwgdGV4dDogXCJUYXJlZmFzIGRvIHBhY290ZVwiIH0pO1xuICAgICAgICB0YSA9IGJvZHkuY3JlYXRlRWwoXCJ0ZXh0YXJlYVwiLCB7IGNsczogXCJ3ZC1wa2ctdGFza3NcIiB9KTtcbiAgICAgICAgdGEudmFsdWUgPSBwa2cudGFza3Muam9pbihcIlxcblwiKTtcbiAgICAgICAgdGEucGxhY2Vob2xkZXIgPSBcIlVtYSB0YXJlZmEgcG9yIGxpbmhhIChleC46IEJlYmVyIFx1MDBFMWd1YSlcIjtcbiAgICAgICAgdGEucm93cyA9IDY7XG4gICAgICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgcGtnLnRhc2tzID0gdGEudmFsdWUuc3BsaXQoXCJcXG5cIikubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGYtaGludFwiLCB0ZXh0OiBcIlVtYSBwb3IgbGluaGEgXHUwMEI3IEBldGlxdWV0YSBtYXJjYSBzXHUwMEYzIGFxdWVsYSB0YXJlZmEgXHUwMEI3IGZlY2hhIGFvIGNsaWNhciBmb3JhIG91IEVzYy5cIiB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0YS5mb2N1cygpLCAwKTtcbiAgICAgIH0sIHsgY2xzOiBcIndkLXBvcC10YXNrc1wiLCB3aWR0aDogMzIwLCBvbkNsb3NlOiAoKSA9PiB7IHBsdWdpbi5yZXJlbmRlckRhc2hib2FyZHMoKTsgfSB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGtncyA9IHBsdWdpbi5zZXR0aW5ncy50YXNrUGFja2FnZXM7XG4gICAgY29uc3QgbGlzdCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wa2ctbGlzdFwiIH0pO1xuICAgIHBrZ3MuZm9yRWFjaCgocGtnLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBrZy1yb3dcIiB9KTtcblxuICAgICAgLy8gXHUwMENEY29uZSAoYm90XHUwMEUzbyBcdTIxOTIgcG9wb3ZlciBkZSBwYWxldGEpLlxuICAgICAgY29uc3QgaWNvbkJ0biA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY29udHJpZ2dlclwiIH0pO1xuICAgICAgaWNvbkJ0bi5zZXRBdHRyKFwidGl0bGVcIiwgXCJcdTAwQ0Rjb25lIGRvIHBhY290ZVwiKTtcbiAgICAgIGNvbnN0IGZpbGxJY29uID0gKCkgPT4ge1xuICAgICAgICBpY29uQnRuLmVtcHR5KCk7XG4gICAgICAgIGlmIChwa2cuaWNvbikgcmVuZGVySWNvbihpY29uQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWljb1wiIH0pLCBwa2cuaWNvbik7XG4gICAgICAgIGVsc2UgaWNvbkJ0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1pY28tZW1wdHlcIiwgdGV4dDogXCIrXCIgfSk7XG4gICAgICB9O1xuICAgICAgZmlsbEljb24oKTtcbiAgICAgIGNsaWNrYWJsZShpY29uQnRuLCAoKSA9PiBvcGVuSWNvblBvcG92ZXIoaWNvbkJ0biwgcGtnLmljb24sIGFzeW5jIGljID0+IHtcbiAgICAgICAgcGtnLmljb24gPSBpYzsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7IGZpbGxJY29uKCk7XG4gICAgICB9KSk7XG5cbiAgICAgIC8vIE5vbWUuXG4gICAgICBjb25zdCBuYW1lID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyBjbHM6IFwid2QtcGtnLW5hbWUtaW5wdXRcIiwgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiTm9tZSBkbyBwYWNvdGVcIiB9IH0pO1xuICAgICAgbmFtZS52YWx1ZSA9IHBrZy5uYW1lO1xuICAgICAgbmFtZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgYXN5bmMgKCkgPT4geyBwa2cubmFtZSA9IG5hbWUudmFsdWU7IGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgfSk7XG4gICAgICBuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gcGx1Z2luLnJlcmVuZGVyRGFzaGJvYXJkcygpKTtcblxuICAgICAgLy8gUHJvamV0by5cbiAgICAgIGNvbnN0IHByb2ogPSByb3cuY3JlYXRlRWwoXCJzZWxlY3RcIiwgeyBjbHM6IFwid2QtcGtnLXByb2ogZHJvcGRvd25cIiB9KTtcbiAgICAgIGNvbnN0IGFkZE9wdCA9ICh2OiBzdHJpbmcsIHQ6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBvID0gcHJvai5jcmVhdGVFbChcIm9wdGlvblwiLCB7IHRleHQ6IHQsIHZhbHVlOiB2IH0pO1xuICAgICAgICBpZiAoKHBrZy5wcm9qZWN0SWQgPz8gXCJcIikgPT09IHYpIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfTtcbiAgICAgIGFkZE9wdChcIlwiLCBcIkVudHJhZGFcIik7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgKHRoaXMucHJvamVjdHMgPz8gW10pKSBhZGRPcHQocC5pZCwgcC5uYW1lKTtcbiAgICAgIHByb2oub25jaGFuZ2UgPSBhc3luYyAoKSA9PiB7IHBrZy5wcm9qZWN0SWQgPSBwcm9qLnZhbHVlIHx8IHVuZGVmaW5lZDsgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpOyB9O1xuXG4gICAgICAvLyBFdGlxdWV0YXMgKGJvdFx1MDBFM28gXHUyMTkyIHBvcG92ZXIpLlxuICAgICAgY29uc3QgbGJsQnRuID0gcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXBrZy1jaGlwLWJ0blwiIH0pO1xuICAgICAgY29uc3QgZmlsbExibCA9ICgpID0+IHtcbiAgICAgICAgbGJsQnRuLmVtcHR5KCk7XG4gICAgICAgIHNldEljb24obGJsQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWJ0bi1pY29cIiB9KSwgXCJ0YWdcIik7XG4gICAgICAgIGxibEJ0bi5jcmVhdGVTcGFuKHsgdGV4dDogXCJFdGlxdWV0YXNcIiB9KTtcbiAgICAgICAgY29uc3QgbiA9IHBrZy5sYWJlbHM/Lmxlbmd0aCA/PyAwO1xuICAgICAgICBpZiAobikgbGJsQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWNvdW50XCIsIHRleHQ6IFN0cmluZyhuKSB9KTtcbiAgICAgIH07XG4gICAgICBmaWxsTGJsKCk7XG4gICAgICBsYmxCdG4ub25jbGljayA9ICgpID0+IG9wZW5MYWJlbHNQb3BvdmVyKGxibEJ0biwgcGtnLCBmaWxsTGJsKTtcblxuICAgICAgLy8gVGFyZWZhcyAoYm90XHUwMEUzbyBcdTIxOTIgcG9wb3ZlcikuXG4gICAgICBjb25zdCB0YXNrQnRuID0gcm93LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIndkLXBrZy1jaGlwLWJ0blwiIH0pO1xuICAgICAgY29uc3QgZmlsbFRhc2sgPSAoKSA9PiB7XG4gICAgICAgIHRhc2tCdG4uZW1wdHkoKTtcbiAgICAgICAgc2V0SWNvbih0YXNrQnRuLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcGtnLWJ0bi1pY29cIiB9KSwgXCJsaXN0XCIpO1xuICAgICAgICB0YXNrQnRuLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIlRhcmVmYXNcIiB9KTtcbiAgICAgICAgY29uc3QgbiA9IHBrZy50YXNrcy5maWx0ZXIocyA9PiBzLnRyaW0oKSkubGVuZ3RoO1xuICAgICAgICBpZiAobikgdGFza0J0bi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1jb3VudFwiLCB0ZXh0OiBTdHJpbmcobikgfSk7XG4gICAgICB9O1xuICAgICAgZmlsbFRhc2soKTtcbiAgICAgIHRhc2tCdG4ub25jbGljayA9ICgpID0+IG9wZW5UYXNrc1BvcG92ZXIodGFza0J0biwgcGtnLCBmaWxsVGFzayk7XG5cbiAgICAgIC8vIFJlb3JkZW5hciAvIHJlbW92ZXIuXG4gICAgICBjb25zdCB1cCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1taW5pXCIgKyAoaWR4ID09PSAwID8gXCIgd2QtZGlzYWJsZWRcIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbih1cCwgXCJjaGV2cm9uLXVwXCIpOyB1cC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBwYXJhIGNpbWFcIik7XG4gICAgICBpZiAoaWR4ID4gMCkgY2xpY2thYmxlKHVwLCBhc3luYyAoKSA9PiB7IGF3YWl0IHBsdWdpbi5tb3ZlUGFja2FnZShpZHgsIC0xKTsgdGhpcy5kaXNwbGF5KCk7IH0pO1xuICAgICAgY29uc3QgZG93biA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1taW5pXCIgKyAoaWR4ID09PSBwa2dzLmxlbmd0aCAtIDEgPyBcIiB3ZC1kaXNhYmxlZFwiIDogXCJcIikgfSk7XG4gICAgICBzZXRJY29uKGRvd24sIFwiY2hldnJvbi1kb3duXCIpOyBkb3duLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHBhcmEgYmFpeG9cIik7XG4gICAgICBpZiAoaWR4IDwgcGtncy5sZW5ndGggLSAxKSBjbGlja2FibGUoZG93biwgYXN5bmMgKCkgPT4geyBhd2FpdCBwbHVnaW4ubW92ZVBhY2thZ2UoaWR4LCArMSk7IHRoaXMuZGlzcGxheSgpOyB9KTtcbiAgICAgIGNvbnN0IGRlbCA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXBrZy1taW5pIHdkLXBrZy1kZWxcIiB9KTtcbiAgICAgIHNldEljb24oZGVsLCBcInRyYXNoLTJcIik7IGRlbC5zZXRBdHRyKFwidGl0bGVcIiwgXCJSZW1vdmVyIHBhY290ZVwiKTtcbiAgICAgIGNsaWNrYWJsZShkZWwsIGFzeW5jICgpID0+IHtcbiAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRhc2tQYWNrYWdlcyA9IHBrZ3MuZmlsdGVyKHggPT4geCAhPT0gcGtnKTtcbiAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICBwbHVnaW4ucmVyZW5kZXJEYXNoYm9hcmRzKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQWRpY2lvbmFyIHBhY290ZVwiKVxuICAgICAgLmFkZEJ1dHRvbihiID0+IGJcbiAgICAgICAgLnNldEJ1dHRvblRleHQoXCIrIE5vdm8gcGFjb3RlXCIpXG4gICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MudGFza1BhY2thZ2VzLnB1c2goeyBpZDogdWlkKCksIG5hbWU6IFwiTm92byBwYWNvdGVcIiwgdGFza3M6IFtdIH0pO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiSW50ZWdyYVx1MDBFN1x1MDBFM28gVG9kb2lzdFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRva2VuIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJUb2RvaXN0IFx1MjE5MiBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgSW50ZWdyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBUb2tlbiBkZSBBUEkgZG8gZGVzZW52b2x2ZWRvci4gU2Fsdm8gbG9jYWxtZW50ZSBlbSBkYXRhLmpzb24gKG5cdTAwRTNvIHZhaSBwYXJhIG8gR2l0KS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBvIHRva2VuIGFxdWlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbiA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkV4aWJpXHUwMEU3XHUwMEUzbyBkYXMgdGFyZWZhc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgbyBwcm9qZXRvIG5hcyBsaW5oYXNcIilcbiAgICAgIC5zZXREZXNjKFwiRXhpYmUgbyBub21lIGRvIHByb2pldG8gYW8gbGFkbyBkZSBjYWRhIHRhcmVmYS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd1Byb2plY3QgPSB2O1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNb3N0cmFyIGFzIGV0aXF1ZXRhcyBuYXMgbGluaGFzXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIGFzIEBldGlxdWV0YXMgZGUgY2FkYSB0YXJlZmEuXCIpXG4gICAgICAuYWRkVG9nZ2xlKHQgPT4gdFxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFNob3dMYWJlbHMpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0U2hvd0xhYmVscyA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaERhc2hib2FyZHMoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiU2luY3Jvbml6YVx1MDBFN1x1MDBFM28gKFN5bmN0aGluZylcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiLFxuICAgICAgdGV4dDogXCJFc3RhcyBjcmVkZW5jaWFpcyBzXHUwMEUzbyBndWFyZGFkYXMgcG9yIGRpc3Bvc2l0aXZvIChsb2NhbFN0b3JhZ2UpIFx1MjAxNCBjYWRhIG1cdTAwRTFxdWluYSB0ZW0gYSBzdWEgZSBlbGFzIG5cdTAwRTNvIHNpbmNyb25pemFtIHBlbG8gU3luY3RoaW5nIG5lbSB2XHUwMEUzbyBwYXJhIG8gR2l0LlwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlVSTCBkYSBBUElcIilcbiAgICAgIC5zZXREZXNjKFwiRW5kZXJlXHUwMEU3byBkbyBTeW5jdGhpbmcuIFBhZHJcdTAwRTNvOiBodHRwOi8vMTI3LjAuMC4xOjgzODQgKGEgaW5zdFx1MDBFMm5jaWEgbG9jYWwpLiBObyBjZWx1bGFyLCBhcG9udGUgcGFyYSBhIEFQSSBkZSBvdXRyYSBtXHUwMEUxcXVpbmEgbmEgcmVkZSBzZSBhIGxvY2FsIG5cdTAwRTNvIHJlc3BvbmRlci5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiaHR0cDovLzEyNy4wLjAuMTo4Mzg0XCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ1VybClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdVcmwgPSB2LnRyaW0oKSB8fCBcImh0dHA6Ly8xMjcuMC4wLjE6ODM4NFwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFQSSBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiU3luY3RoaW5nIFx1MjE5MiBBY3Rpb25zIFx1MjE5MiBTZXR0aW5ncyBcdTIxOTIgQVBJIEtleS4gR3VhcmRhZGEgcG9yIGRpc3Bvc2l0aXZvIChsb2NhbFN0b3JhZ2UpLCBuXHUwMEUzbyB2YWkgcGFyYSBvIGRhdGEuanNvbi9HaXQuXCIpXG4gICAgICAuYWRkVGV4dCh0ID0+IHtcbiAgICAgICAgdC5zZXRQbGFjZWhvbGRlcihcImNvbGUgYSBBUEkga2V5XCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmN0aGluZ0FwaUtleSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdBcGlLZXkgPSB2LnRyaW0oKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdC5pbnB1dEVsLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgICAgIHQuaW5wdXRFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiSUQgZGEgcGFzdGEgKG9wY2lvbmFsKVwiKVxuICAgICAgLnNldERlc2MoXCJGb2xkZXIgSUQgZG8gY29mcmUgbm8gU3luY3RoaW5nLiBWYXppbyA9IHVzYSBhIHByaW1laXJhIHBhc3RhIGF1dG9tYXRpY2FtZW50ZS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiZXguOiBudW5xdi1tdGltblwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdGb2xkZXJJZCA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoU3luYygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1vc3RyYXIgY29udGFnZW0gZGUgaXRlbnMgcG9yIGFwYXJlbGhvXCIpXG4gICAgICAuc2V0RGVzYyhcIkV4aWJlIFxcXCJzaW5jcm9uaXphZG9zIC8gdG90YWxcXFwiIGRlIGl0ZW5zIGVtIGNhZGEgYXBhcmVsaG8sIGFsXHUwMEU5bSBkYSBwb3JjZW50YWdlbS5cIilcbiAgICAgIC5hZGRUb2dnbGUodCA9PiB0XG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW5jdGhpbmdTaG93Q291bnRzKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgdiA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY3RoaW5nU2hvd0NvdW50cyA9IHY7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaFN5bmMoKTtcbiAgICAgICAgfSkpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBMks7QUFFM0ssSUFBTSxZQUFZO0FBQ2xCLElBQU0sb0JBQW9CO0FBSzFCLElBQU0sWUFBWTtBQUNsQixJQUFNLFlBQVk7QUFDbEIsSUFBTSxlQUFlO0FBQ3JCLElBQU0sZ0JBQWdCO0FBQ3RCLElBQU0sV0FBVyxJQUFJLEtBQUs7QUFDMUIsSUFBTSxpQkFBaUI7QUFHdkIsU0FBUyxNQUFjO0FBQ3JCLFNBQU8sS0FB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
