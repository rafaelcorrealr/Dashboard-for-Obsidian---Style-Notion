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
  todoistToken: ""
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
    this.todoistLoading = false;
    this.todoistError = null;
    this.todoistFetchedAt = 0;
    this.todoistOverdueOpen = false;
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
    var _a, _b;
    if (this.isHidden(SEC_TODO)) return;
    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const token = this.plugin.settings.todoistToken.trim();
    if (token) {
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.todoistLoading ? " wd-spin" : "") });
      (0, import_obsidian.setIcon)(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      refresh.onclick = (e) => {
        e.stopPropagation();
        void this.fetchTodoist(true);
      };
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
    const monday = mondayOf(0);
    const todayK = toKey(/* @__PURE__ */ new Date());
    const weekNum = isoWeekNumber(monday);
    const byDay = {};
    const overdue = [];
    for (const t of this.todoistTasks) {
      const dk = dueKey(t);
      if (!dk) continue;
      if (dk < todayK) overdue.push(t);
      ((_a = byDay[dk]) != null ? _a : byDay[dk] = []).push(t);
    }
    const byPri = (a, b) => b.priority - a.priority;
    for (const k of Object.keys(byDay)) byDay[k].sort(byPri);
    overdue.sort(byPri);
    sec.createDiv({ cls: "wd-todo-weeklabel", text: `Semana ${weekNum} \xB7 ${MONTH_SHORT[monday.getMonth()]} ${monday.getFullYear()}` });
    const grid = sec.createDiv({ cls: "wd-todo-grid" });
    let weekTaskCount = 0;
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const key = toKey(day);
      const col = grid.createDiv({
        cls: ["wd-todo-col", key === todayK ? "wd-today" : "", i >= 5 ? "wd-weekend" : ""].filter(Boolean).join(" ")
      });
      const hd = col.createDiv({ cls: "wd-todo-colhd" });
      hd.createSpan({ cls: "wd-todo-dayname", text: DAY_SHORT[i] });
      hd.createSpan({ cls: "wd-todo-daynum", text: String(day.getDate()) });
      const items = (_b = byDay[key]) != null ? _b : [];
      for (const t of items) {
        this.todoChip(col, t);
        weekTaskCount++;
      }
    }
    if (weekTaskCount === 0)
      sec.createDiv({ cls: "wd-empty wd-todo-emptyweek", text: "Nenhuma tarefa com data nesta semana." });
    if (overdue.length) {
      const panel = sec.createDiv({ cls: "wd-todo-overdue" });
      const ohd = panel.createDiv({ cls: "wd-todo-ohd" });
      ohd.createSpan({ cls: "wd-todo-owarn", text: "\u26A0" });
      ohd.createSpan({ cls: "wd-todo-otitle", text: `Atrasadas (${overdue.length})` });
      ohd.createSpan({ cls: "wd-todo-otoggle", text: this.todoistOverdueOpen ? "ocultar \u25BE" : "mostrar \u203A" });
      ohd.onclick = () => {
        this.todoistOverdueOpen = !this.todoistOverdueOpen;
        this.render();
      };
      if (this.todoistOverdueOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of overdue) this.todoRow(list, t);
      }
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
  // Chip compacto de tarefa (na grade semanal).
  todoChip(col, t) {
    var _a;
    const pri = priMeta(t.priority);
    const chip = col.createDiv({ cls: "wd-todo-chip" });
    chip.style.setProperty("--pri", pri.color);
    this.todoCheck(chip, t);
    if ((_a = t.due) == null ? void 0 : _a.is_recurring) chip.createSpan({ cls: "wd-todo-recur", text: "\u27F3" });
    chip.createSpan({ cls: "wd-todo-chip-txt", text: t.content });
    if (hasDesc(t)) (0, import_obsidian.setIcon)(chip.createSpan({ cls: "wd-todo-hasdesc" }), "align-left");
    chip.onclick = () => this.openTaskModal(t);
    this.attachTaskTip(chip, t);
  }
  // Linha de tarefa (no painel de atrasadas).
  todoRow(list, t) {
    var _a;
    const pri = priMeta(t.priority);
    const row = list.createDiv({ cls: "wd-todo-row" });
    row.style.setProperty("--pri", pri.color);
    this.todoCheck(row, t);
    const tag = row.createSpan({ cls: "wd-todo-pri", text: pri.label });
    tag.style.background = pri.color;
    row.createSpan({ cls: "wd-todo-row-txt", text: t.content });
    if (hasDesc(t)) (0, import_obsidian.setIcon)(row.createSpan({ cls: "wd-todo-hasdesc" }), "align-left");
    const dk = dueKey(t);
    if (dk) {
      const [, m, d] = dk.split("-");
      row.createSpan({ cls: "wd-todo-row-date", text: `${d}/${m}` });
    }
    if ((_a = t.due) == null ? void 0 : _a.is_recurring) row.createSpan({ cls: "wd-todo-recur", text: "\u27F3" });
    row.onclick = () => this.openTaskModal(t);
    this.attachTaskTip(row, t);
  }
  // Abre o modal de detalhes da tarefa (descrição com links clicáveis).
  openTaskModal(t) {
    this.hideTip();
    new TaskModal(this.app, t, this, () => void this.completeTask(t)).open();
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
      this.todoistTasks = await fetchTodoistTasks(token);
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
    this.todoistFetchedAt = 0;
    this.todoistError = null;
    this.todoistLoading = false;
    this.render();
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
var TaskModal = class extends import_obsidian.Modal {
  constructor(app, task, component, onComplete) {
    super(app);
    this.task = task;
    this.component = component;
    this.onComplete = onComplete;
  }
  onOpen() {
    const { contentEl, titleEl, modalEl } = this;
    modalEl.addClass("wd-task-modal");
    titleEl.setText(this.task.content);
    if (hasDesc(this.task)) {
      const body = contentEl.createDiv({ cls: "wd-task-modal-desc markdown-rendered" });
      void import_obsidian.MarkdownRenderer.render(this.app, this.task.description.trim(), body, "", this.component);
    } else {
      contentEl.createEl("p", { cls: "wd-task-modal-empty", text: "Esta tarefa n\xE3o tem descri\xE7\xE3o." });
    }
    const actions = contentEl.createDiv({ cls: "wd-task-modal-actions" });
    const open = actions.createEl("button", { text: "Abrir no Todoist" });
    open.onclick = () => window.open(taskUrl(this.task), "_blank");
    const done = actions.createEl("button", { text: "\u2713 Concluir", cls: "mod-cta" });
    done.onclick = () => {
      this.onComplete();
      this.close();
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
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBNb2RhbCwgTm90aWNlLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIFRGaWxlLCBURm9sZGVyLCBXb3Jrc3BhY2VMZWFmLCByZXF1ZXN0VXJsLCBzZXRJY29uIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmNvbnN0IFZJRVdfVFlQRSA9IFwid2VydXMtZGFzaGJvYXJkXCI7XG5cbnR5cGUgU3RhdHVzID0gXCJwcm9ncmVzc1wiIHwgXCJwYXVzZWRcIiB8IFwiY2FuY2VsbGVkXCI7XG50eXBlIFNlY3Rpb25JZCA9IFwiY2FsZW5kYXJcIiB8IFwicGFyYVwiIHwgXCJyZXBvcnRzXCIgfCBcImhlYXRtYXBcIiB8IFwiZ3Jvd3RoXCIgfCBcInN0YXRzXCIgfCBcInRvZG9pc3RcIjtcblxuaW50ZXJmYWNlIERhc2hTZXR0aW5ncyB7XG4gIHNlY3Rpb25PcmRlcjogU2VjdGlvbklkW107XG4gIGNvbXBhY3Q6IGJvb2xlYW47XG4gIGhpZGRlbjogc3RyaW5nW107ICAgLy8gY2FtaW5ob3MgZGUgcGFzdGEgb2N1bHRvcyArIFwic2VjOmNhbGVuZGFyXCIgLyBcInNlYzpyZXBvcnRzXCJcbiAgbm90ZVZpZXc6IFwibGlzdFwiIHwgXCJncmlkXCI7XG4gIHRvZG9pc3RUb2tlbjogc3RyaW5nO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEYXNoU2V0dGluZ3MgPSB7XG4gIHNlY3Rpb25PcmRlcjogW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJyZXBvcnRzXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG4gIHRvZG9pc3RUb2tlbjogXCJcIixcbn07XG5cbmludGVyZmFjZSBQYXJhU2VjdGlvbiB7XG4gIGZvbGRlcjogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGFjY2VudDogc3RyaW5nO1xufVxuXG4vLyBQYXN0YXMgXCJjb25oZWNpZGFzXCIgZG8gUEFSQTogbWFudFx1MDBFQW0gXHUwMEVEY29uZSwgclx1MDBGM3R1bG8gZSBjb3IgZml4b3MuIEFzIGRlbWFpcyBwYXN0YXNcbi8vIGRvIGNvZnJlIHNcdTAwRTNvIHJlbmRlcml6YWRhcyBjb20gY29yIGF1dG9tXHUwMEUxdGljYSBlIFx1MDBFRGNvbmUgcGFkclx1MDBFM28gKG91IG8gaWNvbjogZG8gc3RhdHVzLm1kKS5cbmNvbnN0IFBBUkE6IFBhcmFTZWN0aW9uW10gPSBbXG4gIHsgZm9sZGVyOiBcIjAwLkluYm94XCIsICAgICBpY29uOiBcIlx1RDgzRFx1RENFNVwiLCBsYWJlbDogXCJJbmJveFwiLCAgICBhY2NlbnQ6IFwiIzYzNjZGMVwiIH0sXG4gIHsgZm9sZGVyOiBcIjEwLlByb2plY3RzXCIsICBpY29uOiBcIlx1RDgzRFx1REU4MFwiLCBsYWJlbDogXCJQcm9qZXRvc1wiLCBhY2NlbnQ6IFwiIzEwQjk4MVwiIH0sXG4gIHsgZm9sZGVyOiBcIjIwLkFyZWFzXCIsICAgICBpY29uOiBcIlx1RDgzQ1x1REZBRlwiLCBsYWJlbDogXCJcdTAwQzFyZWFzXCIsICAgIGFjY2VudDogXCIjRjU5RTBCXCIgfSxcbiAgeyBmb2xkZXI6IFwiMzAuUmVzb3VyY2VzXCIsIGljb246IFwiXHVEODNEXHVEQ0RBXCIsIGxhYmVsOiBcIlJlY3Vyc29zXCIsIGFjY2VudDogXCIjM0I4MkY2XCIgfSxcbiAgeyBmb2xkZXI6IFwiNDAuQXJjaGl2ZVwiLCAgIGljb246IFwiXHVEODNEXHVEREM0XHVGRTBGXCIsICBsYWJlbDogXCJBcnF1aXZvXCIsICBhY2NlbnQ6IFwiIzZCNzI4MFwiIH0sXG5dO1xuY29uc3QgUEFSQV9NQVAgPSBuZXcgTWFwKFBBUkEubWFwKHAgPT4gW3AuZm9sZGVyLCBwXSkpO1xuXG4vLyBQYWxldGEgcGFyYSBjb2xvcmlyIHBhc3RhcyBkZXNjb25oZWNpZGFzIGRlIGZvcm1hIGVzdFx1MDBFMXZlbCAocG9yIGhhc2ggZG8gbm9tZSkuXG5jb25zdCBBQ0NFTlRTID0gW1wiIzYzNjZGMVwiLFwiIzEwQjk4MVwiLFwiI0Y1OUUwQlwiLFwiIzNCODJGNlwiLFwiI0VDNDg5OVwiLFwiIzhCNUNGNlwiLFwiIzE0QjhBNlwiLFwiI0VGNDQ0NFwiXTtcblxuY29uc3QgREFZX1NIT1JUID0gW1wiU2VnXCIsIFwiVGVyXCIsIFwiUXVhXCIsIFwiUXVpXCIsIFwiU2V4XCIsIFwiU1x1MDBFMWJcIiwgXCJEb21cIl07XG5jb25zdCBNT05USF9TSE9SVCA9IFtcIkphblwiLFwiRmV2XCIsXCJNYXJcIixcIkFiclwiLFwiTWFpXCIsXCJKdW5cIixcIkp1bFwiLFwiQWdvXCIsXCJTZXRcIixcIk91dFwiLFwiTm92XCIsXCJEZXpcIl07XG5jb25zdCBJTUdfRVhUID0gW1wicG5nXCIsXCJqcGdcIixcImpwZWdcIixcIndlYnBcIixcImdpZlwiLFwic3ZnXCJdO1xuXG4vLyBQYXN0YSByYWl6IGRhcyBub3RhcyBkaVx1MDBFMXJpYXMgKGNyaWFkYXMgYW8gY2xpY2FyIG51bSBkaWEgZG8gY2FsZW5kXHUwMEUxcmlvKS5cbmNvbnN0IERBSUxZX0ZPTERFUiA9IFwiNTAuRGlcdTAwRTFyaW9cIjtcbi8vIFRlbXBsYXRlIG9wY2lvbmFsOyBwbGFjZWhvbGRlcnMge3tkYXRlfX0gKFlZWVktTU0tREQpIGUge3t0aXRsZX19IChkYXRhIHBvciBleHRlbnNvKS5cbmNvbnN0IERBSUxZX1RFTVBMQVRFID0gXCJNb2RlbG9zL05vdGEgRGlcdTAwRTFyaWEubWRcIjtcblxuY29uc3QgU1RBVFVTX0lDT046IFJlY29yZDxTdGF0dXMsIHN0cmluZz4gPSB7XG4gIHByb2dyZXNzOiBcIlx1MjVCNlwiLCBwYXVzZWQ6IFwiXHUyM0Y4XCIsIGNhbmNlbGxlZDogXCJcdTI3MTVcIixcbn07XG5cbmNvbnN0IFNFQ19DQUwgPSBcInNlYzpjYWxlbmRhclwiO1xuY29uc3QgU0VDX1JFUCA9IFwic2VjOnJlcG9ydHNcIjtcbmNvbnN0IFNFQ19IRUFUID0gXCJzZWM6aGVhdG1hcFwiO1xuY29uc3QgU0VDX0dST1cgPSBcInNlYzpncm93dGhcIjtcbmNvbnN0IFNFQ19TVEFUID0gXCJzZWM6c3RhdHNcIjtcbmNvbnN0IFNFQ19UT0RPID0gXCJzZWM6dG9kb2lzdFwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuaW50ZXJmYWNlIFRvZG9pc3RUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjsgICAvLyBBUEk6IDEuLjQsIG9uZGUgNCA9IHVyZ2VudGUgKD0gcDEgbmEgVUkpXG4gIGR1ZT86IHsgZGF0ZTogc3RyaW5nOyBkYXRldGltZT86IHN0cmluZzsgc3RyaW5nPzogc3RyaW5nOyBpc19yZWN1cnJpbmc/OiBib29sZWFuIH0gfCBudWxsO1xuICBwcm9qZWN0X2lkPzogc3RyaW5nO1xuICBpc19jb21wbGV0ZWQ/OiBib29sZWFuO1xuICBsYWJlbHM/OiBzdHJpbmdbXTtcbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vLyBQcmlvcmlkYWRlIGRhIEFQSSAoND11cmdlbnRlKSBcdTIxOTIgclx1MDBGM3R1bG8vY29yIGRhIFVJIChwMT12ZXJtZWxobyBcdTIwMjYgcDQ9Y2luemEpLlxuY29uc3QgVE9ET0lTVF9QUkk6IFJlY29yZDxudW1iZXIsIHsgbGFiZWw6IHN0cmluZzsgY29sb3I6IHN0cmluZyB9PiA9IHtcbiAgNDogeyBsYWJlbDogXCJwMVwiLCBjb2xvcjogXCIjRUY0NDQ0XCIgfSxcbiAgMzogeyBsYWJlbDogXCJwMlwiLCBjb2xvcjogXCIjRjU5RTBCXCIgfSxcbiAgMjogeyBsYWJlbDogXCJwM1wiLCBjb2xvcjogXCIjM0I4MkY2XCIgfSxcbiAgMTogeyBsYWJlbDogXCJwNFwiLCBjb2xvcjogXCIjNkI3MjgwXCIgfSxcbn07XG5mdW5jdGlvbiBwcmlNZXRhKHA6IG51bWJlcikgeyByZXR1cm4gVE9ET0lTVF9QUklbcF0gPz8gVE9ET0lTVF9QUklbMV07IH1cblxuLy8gQnVzY2EgYXMgdGFyZWZhcyBhdGl2YXMgKG5cdTAwRTNvIGNvbmNsdVx1MDBFRGRhcykgdmlhIEFQSSB1bmlmaWNhZGEgdjEgKGEgUkVTVCB2MiBmb2lcbi8vIGFwb3NlbnRhZGEgXHUyMTkyIHJlc3BvbmRpYSA0MTApLiBBIHYxIFx1MDBFOSBwYWdpbmFkYTogeyByZXN1bHRzLCBuZXh0X2N1cnNvciB9LlxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUb2RvaXN0VGFza3ModG9rZW46IHN0cmluZyk6IFByb21pc2U8VG9kb2lzdFRhc2tbXT4ge1xuICBjb25zdCBhbGw6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgbGV0IGN1cnNvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGRvIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9hcGkudG9kb2lzdC5jb20vYXBpL3YxL3Rhc2tzXCIpO1xuICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwibGltaXRcIiwgXCIyMDBcIik7XG4gICAgaWYgKGN1cnNvcikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJjdXJzb3JcIiwgY3Vyc29yKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAgfSxcbiAgICAgIHRocm93OiBmYWxzZSxcbiAgICB9KTtcbiAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykgdGhyb3cgbmV3IEVycm9yKFwidG9rZW4gaW52XHUwMEUxbGlkbyAoNDAxLzQwMylcIik7XG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcblxuICAgIGNvbnN0IGRhdGEgPSByZXMuanNvbiBhcyB7IHJlc3VsdHM/OiBUb2RvaXN0VGFza1tdOyBuZXh0X2N1cnNvcj86IHN0cmluZyB8IG51bGwgfTtcbiAgICAvLyB2MSBlbnZlbG9wYSBlbSByZXN1bHRzOyB0b2xlcmEgcmVzcG9zdGEgY29tbyBhcnJheSBwdXJvIHBvciBzZWd1cmFuXHUwMEU3YS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkgeyBhbGwucHVzaCguLi4oZGF0YSBhcyBUb2RvaXN0VGFza1tdKSk7IGN1cnNvciA9IG51bGw7IH1cbiAgICBlbHNlIHsgYWxsLnB1c2goLi4uKGRhdGEucmVzdWx0cyA/PyBbXSkpOyBjdXJzb3IgPSBkYXRhLm5leHRfY3Vyc29yID8/IG51bGw7IH1cbiAgfSB3aGlsZSAoY3Vyc29yKTtcbiAgcmV0dXJuIGFsbDtcbn1cblxuLy8gVVJMIHBhcmEgYWJyaXIgYSB0YXJlZmEgbm8gVG9kb2lzdCAodXNhIGEgZG8gcGF5bG9hZCBvdSBtb250YSBhIHBhcnRpciBkbyBpZCkuXG5mdW5jdGlvbiB0YXNrVXJsKHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHtcbiAgcmV0dXJuIHQudXJsID8/IGBodHRwczovL2FwcC50b2RvaXN0LmNvbS9hcHAvdGFzay8ke3QuaWR9YDtcbn1cblxuLy8gQ29uY2x1aSAoZmVjaGEpIHVtYSB0YXJlZmEgbm8gVG9kb2lzdC4gUE9TVCBzZW0gY29ycG87IDIwNCA9IHN1Y2Vzc28uIEZhc2UgOC4yLlxuYXN5bmMgZnVuY3Rpb24gY2xvc2VUb2RvaXN0VGFzayh0b2tlbjogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgIHVybDogYGh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrcy8ke2lkfS9jbG9zZWAsXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgdGhyb3c6IGZhbHNlLFxuICB9KTtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICBpZiAocmVzLnN0YXR1cyAhPT0gMjA0ICYmIHJlcy5zdGF0dXMgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzLnN0YXR1c31gKTtcbn1cblxuLy8gRGF0YSBkZSB2ZW5jaW1lbnRvIChZWVlZLU1NLUREKSBkZSB1bWEgdGFyZWZhLCBvdSBudWxsIHNlIHNlbSBkdWUuXG5mdW5jdGlvbiBkdWVLZXkodDogVG9kb2lzdFRhc2spOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZCA9IHQuZHVlPy5kYXRlID8/IHQuZHVlPy5kYXRldGltZTtcbiAgcmV0dXJuIGQgPyBkLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG4vLyBBIHRhcmVmYSB0ZW0gZGVzY3JpXHUwMEU3XHUwMEUzbyAoaW5zdHJ1XHUwMEU3XHUwMEY1ZXMpP1xuZnVuY3Rpb24gaGFzRGVzYyh0OiBUb2RvaXN0VGFzayk6IGJvb2xlYW4ge1xuICByZXR1cm4gISF0LmRlc2NyaXB0aW9uICYmIHQuZGVzY3JpcHRpb24udHJpbSgpLmxlbmd0aCA+IDA7XG59XG5jb25zdCBERVNDX01BWCA9IDcwMDsgICAvLyBjb3J0ZSBkYSBkZXNjcmlcdTAwRTdcdTAwRTNvIG5vIHRvb2x0aXAgKG8gcmVzdG8gZmljYSBubyBUb2RvaXN0KVxuXG4vLyBGdW5cdTAwRTdcdTAwRTNvIGdsb2JhbCBleHBvc3RhIHBlbG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIChxdWFuZG8gaGFiaWxpdGFkbykuXG50eXBlIEhlYXRtYXBFbnRyeSA9IHsgZGF0ZTogc3RyaW5nOyBpbnRlbnNpdHk/OiBudW1iZXI7IGNvbG9yPzogc3RyaW5nOyBjb250ZW50Pzogc3RyaW5nIH07XG50eXBlIEhlYXRtYXBEYXRhID0ge1xuICB5ZWFyOiBudW1iZXI7XG4gIGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xuICBlbnRyaWVzOiBIZWF0bWFwRW50cnlbXTtcbiAgc2hvd0N1cnJlbnREYXlCb3JkZXI/OiBib29sZWFuO1xufTtcbmZ1bmN0aW9uIGdldEhlYXRtYXBSZW5kZXJlcigpOiAoKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIHwgbnVsbCB7XG4gIGNvbnN0IGZuID0gKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgcmVuZGVySGVhdG1hcENhbGVuZGFyPzogdW5rbm93biB9KS5yZW5kZXJIZWF0bWFwQ2FsZW5kYXI7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiA/IChmbiBhcyAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgOiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBkYXRhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBpc29XZWVrTnVtYmVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSk7XG4gIGNvbnN0IGRvdyA9IGQuZ2V0VVRDRGF5KCkgfHwgNztcbiAgZC5zZXRVVENEYXRlKGQuZ2V0VVRDRGF0ZSgpICsgNCAtIGRvdyk7XG4gIGNvbnN0IHkwID0gbmV3IERhdGUoRGF0ZS5VVEMoZC5nZXRVVENGdWxsWWVhcigpLCAwLCAxKSk7XG4gIHJldHVybiBNYXRoLmNlaWwoKChkLmdldFRpbWUoKSAtIHkwLmdldFRpbWUoKSkgLyA4Nl80MDBfMDAwICsgMSkgLyA3KTtcbn1cblxuZnVuY3Rpb24gbW9uZGF5T2Yob2Zmc2V0OiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZG93ID0gbm93LmdldERheSgpIHx8IDc7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShub3cpO1xuICBkLnNldERhdGUobm93LmdldERhdGUoKSAtIGRvdyArIDEgKyBvZmZzZXQgKiA3KTtcbiAgZC5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIHRvS2V5KGQ6IERhdGUpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9LSR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRlKHZhbDogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsLnN1YnN0cmluZygwLCAxMCk7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWwpO1xuICByZXR1cm4gcy5tYXRjaCgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9LykgPyBzLnN1YnN0cmluZygwLCAxMCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b2RheUJSKCk6IHN0cmluZyB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgfSk7XG59XG5cbi8vIGRkL21tIGEgcGFydGlyIGRlIHVtIHRpbWVzdGFtcCAobXRpbWUpXG5mdW5jdGlvbiBmbXRTaG9ydCh0czogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKHRzKTtcbiAgcmV0dXJuIGAke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9LyR7U3RyaW5nKGQuZ2V0TW9udGgoKSsxKS5wYWRTdGFydCgyLFwiMFwiKX1gO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXRpbGlkYWRlcyBkZSBwYXN0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLy8gQ29udGEgbm90YXMgcmV2aXNhZGFzIChyZXZpZXdlZDogdHJ1ZSkgdnMgdG90YWwgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gcmV2aWV3ZWRTdGF0cyhhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyByZXZpZXdlZDogbnVtYmVyOyB0b3RhbDogbnVtYmVyIH0ge1xuICBsZXQgcmV2aWV3ZWQgPSAwLCB0b3RhbCA9IDA7XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSB7XG4gICAgICAgIHRvdGFsKys7XG4gICAgICAgIGlmIChhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShjLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWUpIHJldmlld2VkKys7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICByZXR1cm4geyByZXZpZXdlZCwgdG90YWwgfTtcbn1cblxuLy8gQ29udGEgbWQgKGV4Y2V0byBzdGF0dXMubWQpIGUgaW1hZ2VucyBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiBmb2xkZXJTdGF0cyhmb2xkZXI6IFRGb2xkZXIpOiB7IG1kOiBudW1iZXI7IGltZzogbnVtYmVyIH0ge1xuICBsZXQgbWQgPSAwLCBpbWcgPSAwO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICBpZiAoYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIG1kKys7XG4gICAgICAgIGVsc2UgaWYgKElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKSBpbWcrKztcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIHJldHVybiB7IG1kLCBpbWcgfTtcbn1cblxuLy8gVGV4dG8gZGUgY29udGFnZW0gcGFkcm9uaXphZG8gcGFyYSBvcyBjYXJkcyAobm90YXMgKyBpbWFnZW5zLCBxdWFuZG8gaG91dmVyKS5cbmZ1bmN0aW9uIGNvdW50VGV4dChzdGF0czogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9KTogc3RyaW5nIHtcbiAgaWYgKHN0YXRzLm1kID09PSAwICYmIHN0YXRzLmltZyA+IDApIHJldHVybiBgJHtzdGF0cy5pbWd9IGltZ2A7XG4gIHJldHVybiBzdGF0cy5pbWcgPiAwID8gYCR7c3RhdHMubWR9IG5vdGFzIFx1MDBCNyAke3N0YXRzLmltZ30gaW1nYCA6IGAke3N0YXRzLm1kfSBub3Rhc2A7XG59XG5cbi8vIEFzIE4gbm90YXMgLm1kIG1vZGlmaWNhZGFzIG1haXMgcmVjZW50ZW1lbnRlIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIHJlY2VudE5vdGVzKGZvbGRlcjogVEZvbGRlciwgbjogbnVtYmVyKTogVEZpbGVbXSB7XG4gIGNvbnN0IGZpbGVzOiBURmlsZVtdID0gW107XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSBmaWxlcy5wdXNoKGMpO1xuICAgICAgZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIGZpbGVzLnNvcnQoKGEsIGIpID0+IGIuc3RhdC5tdGltZSAtIGEuc3RhdC5tdGltZSk7XG4gIHJldHVybiBmaWxlcy5zbGljZSgwLCBuKTtcbn1cblxuLy8gUGFzdGEgXCJkZSBhc3NldHNcIjogc1x1MDBGMyB0ZW0gaW1hZ2VucywgbmVuaHVtYSBub3RhIFx1MjE5MiBlc2NvbmRpZGEgbm8gbmF2ZWdhZG9yIGludGVybm8uXG5mdW5jdGlvbiBpc0Fzc2V0Rm9sZGVyKGZvbGRlcjogVEZvbGRlcik6IGJvb2xlYW4ge1xuICBjb25zdCB7IG1kLCBpbWcgfSA9IGZvbGRlclN0YXRzKGZvbGRlcik7XG4gIHJldHVybiBpbWcgPiAwICYmIG1kID09PSAwO1xufVxuXG5mdW5jdGlvbiBzdWJGb2xkZXJzKGZvbGRlcjogVEZvbGRlcik6IFRGb2xkZXJbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgLmZpbHRlcihmID0+ICFpc0Fzc2V0Rm9sZGVyKGYpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xufVxuXG5mdW5jdGlvbiBjb3ZlckluRm9sZGVyKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gMS4gQ2FtcG8gY292ZXI6IG5vIHN0YXR1cy5tZCAoYWNlaXRhIGNhbWluaG8gZGlyZXRvIG91IHdpa2lsaW5rIFtbLi4uXV0pXG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgaWYgKHNmKSB7XG4gICAgY29uc3QgcmF3ID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5jb3ZlcjtcbiAgICBpZiAodHlwZW9mIHJhdyA9PT0gXCJzdHJpbmdcIiAmJiByYXcudHJpbSgpKSB7XG4gICAgICBjb25zdCBsaW5rcGF0aCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiE/XFxbXFxbLywgXCJcIikucmVwbGFjZSgvXFxdXFxdJC8sIFwiXCIpLnNwbGl0KFwifFwiKVswXS50cmltKCk7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmtwYXRoLCBzZi5wYXRoKTtcbiAgICAgIGlmIChyZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlICYmIElNR19FWFQuaW5jbHVkZXMocmVzb2x2ZWQuZXh0ZW5zaW9uKSlcbiAgICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgocmVzb2x2ZWQpO1xuICAgIH1cbiAgfVxuICAvLyAyLiBGYWxsYmFjazogYXJxdWl2byBfY292ZXIuKiBuYSBwYXN0YVxuICBmb3IgKGNvbnN0IGMgb2YgZm9sZGVyLmNoaWxkcmVuKSB7XG4gICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmJhc2VuYW1lID09PSBcIl9jb3ZlclwiICYmIElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKVxuICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgoYyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHJlYWRGb2xkZXJTdGF0dXMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IFN0YXR1cyB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgcyA9IHNmICYmIGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuZnVuY3Rpb24gcmVhZE5vdGVTdGF0dXMoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogU3RhdHVzIHtcbiAgY29uc3QgcyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVXJnXHUwMEVBbmNpYSAocHJvcHJpZWRhZGUgYHVyZ2VuY3lgKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbnR5cGUgVXJnZW5jeSA9IFwiYWx0YVwiIHwgXCJtZWRpYVwiIHwgXCJiYWl4YVwiO1xuY29uc3QgVVJHRU5DWV9SQU5LOiBSZWNvcmQ8VXJnZW5jeSwgbnVtYmVyPiA9IHsgYmFpeGE6IDEsIG1lZGlhOiAyLCBhbHRhOiAzIH07XG5jb25zdCBVUkdFTkNZX0NPTE9SOiBSZWNvcmQ8VXJnZW5jeSwgc3RyaW5nPiA9IHsgYWx0YTogXCIjRUY0NDQ0XCIsIG1lZGlhOiBcIiNGNTlFMEJcIiwgYmFpeGE6IFwiI0VBQjMwOFwiIH07XG5cbmZ1bmN0aW9uIHJlYWROb3RlVXJnZW5jeShhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBVcmdlbmN5IHwgbnVsbCB7XG4gIGNvbnN0IHUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8udXJnZW5jeTtcbiAgcmV0dXJuIHUgPT09IFwiYWx0YVwiIHx8IHUgPT09IFwibWVkaWFcIiB8fCB1ID09PSBcImJhaXhhXCIgPyB1IDogbnVsbDtcbn1cblxudHlwZSBVcmdlbmN5SW5mbyA9IHsgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGxldmVsOiBVcmdlbmN5IH1bXTsgbWF4OiBVcmdlbmN5IHwgbnVsbCB9O1xuXG4vLyBOb3RhcyBjb20gYHVyZ2VuY3lgIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZSArIG8gblx1MDBFRHZlbCBtXHUwMEUxeGltbyAob3JkZW5hZGFzIHBvciBuXHUwMEVEdmVsIGRlc2MpLlxuZnVuY3Rpb24gdXJnZW5jeVN0YXRzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBVcmdlbmN5SW5mbyB7XG4gIGNvbnN0IGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIHtcbiAgICAgICAgY29uc3QgdSA9IHJlYWROb3RlVXJnZW5jeShhcHAsIGMpO1xuICAgICAgICBpZiAodSkgaXRlbXMucHVzaCh7IGZpbGU6IGMsIGxldmVsOiB1IH0pO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgbGV0IG1heDogVXJnZW5jeSB8IG51bGwgPSBudWxsO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSBpZiAoIW1heCB8fCBVUkdFTkNZX1JBTktbaXQubGV2ZWxdID4gVVJHRU5DWV9SQU5LW21heF0pIG1heCA9IGl0LmxldmVsO1xuICBpdGVtcy5zb3J0KChhLCBiKSA9PiBVUkdFTkNZX1JBTktbYi5sZXZlbF0gLSBVUkdFTkNZX1JBTktbYS5sZXZlbF0pO1xuICByZXR1cm4geyBpdGVtcywgbWF4IH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBBcnF1aXZvcyBleGliXHUwMEVEdmVpczogbm90YSAoLm1kKSAvIGNhbnZhcyAoLmNhbnZhcykgLyBiYXNlICguYmFzZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBGSUxFX0VYVFMgPSBbXCJtZFwiLCBcImNhbnZhc1wiLCBcImJhc2VcIl07XG4vLyBpZCBMdWNpZGUgcG9yIHRpcG8gZGUgYXJxdWl2by5cbmZ1bmN0aW9uIGZpbGVHbHlwaChleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChleHQgPT09IFwiY2FudmFzXCIpIHJldHVybiBcInNoYXBlc1wiO1xuICBpZiAoZXh0ID09PSBcImJhc2VcIikgcmV0dXJuIFwidGFibGUtMlwiO1xuICByZXR1cm4gXCJmaWxlLXRleHRcIjtcbn1cbmZ1bmN0aW9uIGZpbGVzSW4oZm9sZGVyOiBURm9sZGVyKTogVEZpbGVbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihcbiAgICBjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBGSUxFX0VYVFMuaW5jbHVkZXMoYy5leHRlbnNpb24pICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIlxuICApIGFzIFRGaWxlW10pLnNvcnQoKGEsIGIpID0+IGEuYmFzZW5hbWUubG9jYWxlQ29tcGFyZShiLmJhc2VuYW1lLCBcInB0XCIpKTtcbn1cblxuLy8gXHUwMENEY29uZSBkZWZpbmlkbyBlbSBgaWNvbjpgIG5vIHN0YXR1cy5tZCBkYSBwYXN0YSAoZW1vamkgb3UgaWQgTHVjaWRlKS4gbnVsbCBzZSBhdXNlbnRlLlxuZnVuY3Rpb24gcmVhZEZvbGRlckljb24oYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IGljID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5pY29uO1xuICByZXR1cm4gdHlwZW9mIGljID09PSBcInN0cmluZ1wiICYmIGljLnRyaW0oKSA/IGljLnRyaW0oKSA6IG51bGw7XG59XG5cbi8vIGlkIEx1Y2lkZSAoc1x1MDBGMyBbYS16MC05LV0pIFx1MjE5MiBzZXRJY29uIG5hdGl2bzsgY2FzbyBjb250clx1MDBFMXJpbyB0cmF0YSBjb21vIGVtb2ppL3RleHRvLlxuZnVuY3Rpb24gcmVuZGVySWNvbihlbDogSFRNTEVsZW1lbnQsIGljb246IHN0cmluZykge1xuICBpZiAoL15bYS16MC05LV0rJC8udGVzdChpY29uKSkgc2V0SWNvbihlbCwgaWNvbik7XG4gIGVsc2UgZWwuc2V0VGV4dChpY29uKTtcbn1cblxuLy8gQ29yIGVzdFx1MDBFMXZlbCBhIHBhcnRpciBkbyBub21lIChwYXJhIHBhc3RhcyBmb3JhIGRvIFBBUkEpLlxuZnVuY3Rpb24gYWNjZW50Rm9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIG5hbWUuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gIHJldHVybiBBQ0NFTlRTW2ggJSBBQ0NFTlRTLmxlbmd0aF07XG59XG5cbi8vIFx1MDBDRGNvbmUgLyByXHUwMEYzdHVsbyAvIGNvciBkZSB1bWEgcGFzdGEgZGUgdG9wbzogdXNhIG8gUEFSQSBzZSBjb25oZWNpZGEsIHNlblx1MDBFM28gZGVyaXZhLlxuZnVuY3Rpb24gZm9sZGVyTWV0YShhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyBpY29uOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IGFjY2VudDogc3RyaW5nIH0ge1xuICBjb25zdCBrbm93biA9IFBBUkFfTUFQLmdldChmb2xkZXIucGF0aCk7XG4gIGNvbnN0IGN1c3RvbSA9IHJlYWRGb2xkZXJJY29uKGFwcCwgZm9sZGVyKTtcbiAgcmV0dXJuIHtcbiAgICBpY29uOiAgIGN1c3RvbSA/PyBrbm93bj8uaWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiLFxuICAgIGxhYmVsOiAga25vd24/LmxhYmVsID8/IGZvbGRlci5uYW1lLFxuICAgIGFjY2VudDoga25vd24/LmFjY2VudCA/PyBhY2NlbnRGb3IoZm9sZGVyLm5hbWUpLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXZlYWxJbkV4cGxvcmVyKGFwcDogQXBwLCB0YXJnZXQ6IHVua25vd24pIHtcbiAgdHlwZSBFeHBQbHVnaW4gPSB7IGluc3RhbmNlOiB7IHJldmVhbEluRm9sZGVyKGY6IHVua25vd24pOiB2b2lkIH0gfTtcbiAgY29uc3QgZXhwID0gKGFwcCBhcyBBcHAgJiB7XG4gICAgaW50ZXJuYWxQbHVnaW5zOiB7IGdldFBsdWdpbkJ5SWQoaWQ6IHN0cmluZyk6IEV4cFBsdWdpbiB8IG51bGwgfTtcbiAgfSkuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoXCJmaWxlLWV4cGxvcmVyXCIpO1xuICBpZiAoZXhwICYmIHRhcmdldCkgZXhwLmluc3RhbmNlLnJldmVhbEluRm9sZGVyKHRhcmdldCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG5cbiAgLy8gRXN0YWRvIGRhIGludGVncmFcdTAwRTdcdTAwRTNvIFRvZG9pc3RcbiAgcHJpdmF0ZSB0b2RvaXN0VGFza3M6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgcHJpdmF0ZSB0b2RvaXN0TG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHRvZG9pc3RFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdG9kb2lzdEZldGNoZWRBdCA9IDA7XG4gIHByaXZhdGUgdG9kb2lzdE92ZXJkdWVPcGVuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGxlYWYpOyB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB0aGlzLnNjaGVkdWxlKCkpKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKSB7IHRoaXMuaGlkZVRpcCgpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgaWYgKGlkID09PSBcImNhbGVuZGFyXCIpICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJoZWF0bWFwXCIpIHRoaXMucmVuZGVySGVhdG1hcChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInJlcG9ydHNcIikgdGhpcy5yZW5kZXJSZXBvcnRzKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInN0YXRzXCIpICAgdGhpcy5yZW5kZXJTdGF0cyhyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInRvZG9pc3RcIikgdGhpcy5yZW5kZXJUb2RvaXN0KHJvb3QpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDb250cm9sZXMgZGUgb3JkZW0gZGUgc2VcdTAwRTdcdTAwRTNvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgbW92ZUNvbnRyb2xzKGhvc3Q6IEhUTUxFbGVtZW50LCBpZDogU2VjdGlvbklkKSB7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXI7XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGN0cmwgPSBob3N0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1tb3ZlLWN0cmxcIiB9KTtcblxuICAgIGNvbnN0IHVwID0gY3RybC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW1vdmUtYnRuXCIgKyAoaSA8PSAwID8gXCIgd2QtbW92ZS1vZmZcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVCMlwiIH0pO1xuICAgIHVwLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHNlXHUwMEU3XHUwMEUzbyBwYXJhIGNpbWFcIik7XG4gICAgaWYgKGkgPiAwKSB1cC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMubW92ZVNlY3Rpb24oaWQsIC0xKTsgfTtcblxuICAgIGNvbnN0IGRvd24gPSBjdHJsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbW92ZS1idG5cIiArIChpID49IG9yZGVyLmxlbmd0aCAtIDEgPyBcIiB3ZC1tb3ZlLW9mZlwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUJDXCIgfSk7XG4gICAgZG93bi5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBzZVx1MDBFN1x1MDBFM28gcGFyYSBiYWl4b1wiKTtcbiAgICBpZiAoaSA8IG9yZGVyLmxlbmd0aCAtIDEpIGRvd24ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm1vdmVTZWN0aW9uKGlkLCArMSk7IH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1vdmVTZWN0aW9uKGlkOiBTZWN0aW9uSWQsIGRpcjogbnVtYmVyKSB7XG4gICAgY29uc3Qgb3JkZXIgPSBbLi4udGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyXTtcbiAgICBjb25zdCBpID0gb3JkZXIuaW5kZXhPZihpZCk7XG4gICAgY29uc3QgaiA9IGkgKyBkaXI7XG4gICAgaWYgKGkgPCAwIHx8IGogPCAwIHx8IGogPj0gb3JkZXIubGVuZ3RoKSByZXR1cm47XG4gICAgW29yZGVyW2ldLCBvcmRlcltqXV0gPSBbb3JkZXJbal0sIG9yZGVyW2ldXTtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBvcmRlcjtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE9jdWx0YXIgLyByZXN0YXVyYXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBpc0hpZGRlbihrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uaW5jbHVkZXMoa2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZUJ0bihob3N0OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGNscyA9IFwid2QtaGlkZS1idG5cIikge1xuICAgIGNvbnN0IGIgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHMgfSk7XG4gICAgc2V0SWNvbihiLCBcImV5ZS1vZmZcIik7XG4gICAgYi5zZXRBdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgIGIub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmhpZGVJdGVtKGtleSk7IH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhpZGVJdGVtKGtleTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oa2V5KSkgcmV0dXJuO1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5wdXNoKGtleSk7XG4gICAgLy8gU2UgZXN0XHUwMEUxdmFtb3MgZGVudHJvIGRhIHBhc3RhIHF1ZSBhY2Fib3UgZGUgc2VyIG9jdWx0YSwgZmVjaGEgbyBuYXZlZ2Fkb3IuXG4gICAgaWYgKHRoaXMubmF2UGF0aCAmJiAodGhpcy5uYXZQYXRoID09PSBrZXkgfHwgdGhpcy5uYXZQYXRoLnN0YXJ0c1dpdGgoa2V5ICsgXCIvXCIpKSkgdGhpcy5uYXZQYXRoID0gbnVsbDtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1bmhpZGVJdGVtKGtleTogc3RyaW5nKSB7XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmZpbHRlcihrID0+IGsgIT09IGtleSk7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZGVuTGFiZWwoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChrZXkgPT09IFNFQ19DQUwpIHJldHVybiBcIlx1RDgzRFx1RENDNSBDYWxlbmRcdTAwRTFyaW9cIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfUkVQKSByZXR1cm4gXCJcdUQ4M0RcdURDQzQgUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiO1xuICAgIGlmIChrZXkgPT09IFNFQ19IRUFUKSByZXR1cm4gXCJcdUQ4M0RcdUREMjUgSGVhdG1hcFwiO1xuICAgIGlmIChrZXkgPT09IFNFQ19HUk9XKSByZXR1cm4gXCJcdUQ4M0RcdURDQzggQ3Jlc2NpbWVudG9cIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfU1RBVCkgcmV0dXJuIFwiXHVEODNEXHVEQ0NBIEVzdGF0XHUwMEVEc3RpY2FzXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX1RPRE8pIHJldHVybiBcIlx1RDgzRFx1RENDQiBUYXJlZmFzXCI7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChrZXkpO1xuICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZvbGRlciA/IGYubmFtZSA6IGtleTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVySGlkZGVuQmFyKHBhcmVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoaWRkZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW47XG4gICAgaWYgKCFoaWRkZW4ubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgYmFyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oaWRkZW4tYmFyXCIgfSk7XG4gICAgYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaGlkZGVuLWxhYmVsXCIsIHRleHQ6IFwib2N1bHRvczpcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBoaWRkZW4pIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1oaWRkZW4tY2hpcFwiIH0pO1xuICAgICAgLy8gUGFzdGEgb2N1bHRhIGNvbSBub3RhcyB1cmdlbnRlcyBcdTIxOTIgY29udG9ybm8gcGVsYSBjb3IgZG8gblx1MDBFRHZlbCBtXHUwMEUxeGltby5cbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoa2V5KTtcbiAgICAgIGNvbnN0IHVyZyA9IGYgaW5zdGFuY2VvZiBURm9sZGVyID8gdXJnZW5jeVN0YXRzKHRoaXMuYXBwLCBmKSA6IHsgaXRlbXM6IFtdLCBtYXg6IG51bGwgfTtcbiAgICAgIGlmICh1cmcubWF4KSB7XG4gICAgICAgIGNoaXAuYWRkQ2xhc3MoXCJ3ZC1oaWRkZW4tdXJnZW50XCIpO1xuICAgICAgICBjaGlwLmFkZENsYXNzKGB3ZC11LSR7dXJnLm1heH1gKTtcbiAgICAgICAgY2hpcC5zdHlsZS5ib3JkZXJDb2xvciA9IFVSR0VOQ1lfQ09MT1JbdXJnLm1heF07XG4gICAgICB9XG4gICAgICBzZXRJY29uKGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jaGlwLWljb25cIiB9KSwgXCJleWVcIik7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiB0aGlzLmhpZGRlbkxhYmVsKGtleSkgfSk7XG4gICAgICBjaGlwLnNldEF0dHIoXCJ0aXRsZVwiLCB1cmcubWF4XG4gICAgICAgID8gYE1vc3RyYXIgbm92YW1lbnRlIFx1MjAxNCAke3VyZy5pdGVtcy5sZW5ndGh9IG5vdGEocykgdXJnZW50ZShzKWBcbiAgICAgICAgOiBcIk1vc3RyYXIgbm92YW1lbnRlXCIpO1xuICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4gdGhpcy51bmhpZGVJdGVtKGtleSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvb2x0aXAgZGUgbm90YXMgcmVjZW50ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBzaG93VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGZpbGVzOiBURmlsZVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiTW9kaWZpY2FkYXMgcmVjZW50ZW1lbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBmIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpcCA9IHRpcDtcbiAgICB0aGlzLnBvc2l0aW9uVGlwKHRpcCwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIFBvc2ljaW9uYSB1bSB0b29sdGlwIGZpeG8gYWJhaXhvIGRvIGFsdm8gKHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3bykuXG4gIHByaXZhdGUgcG9zaXRpb25UaXAodGlwOiBIVE1MRWxlbWVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdHcgPSB0aXAub2Zmc2V0V2lkdGgsIHRoID0gdGlwLm9mZnNldEhlaWdodDtcbiAgICBsZXQgbGVmdCA9IHJlY3QubGVmdDtcbiAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyA2O1xuICAgIGlmIChsZWZ0ICsgdHcgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHR3IC0gODtcbiAgICBpZiAodG9wICsgdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSB0b3AgPSByZWN0LnRvcCAtIHRoIC0gNjsgIC8vIHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3b1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gIH1cblxuICAvLyBUb29sdGlwIGxpc3RhbmRvIGFzIG5vdGFzIHVyZ2VudGVzIGRlIHVtYSBwYXN0YSAoaG92ZXIgbm8gYmFkZ2UgZGUgYXZpc28pLlxuICBwcml2YXRlIHNob3dVcmdlbmN5VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGl0ZW1zOiB7IGZpbGU6IFRGaWxlOyBsZXZlbDogVXJnZW5jeSB9W10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwIHdkLXVyZ2VuY3ktdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJVcmdlbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgICAgY29uc3Qgcm93ID0gdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtcm93XCIgfSk7XG4gICAgICBjb25zdCBkb3QgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC11dGlwLWRvdFwiIH0pO1xuICAgICAgZG90LnN0eWxlLmJhY2tncm91bmQgPSBVUkdFTkNZX0NPTE9SW2l0LmxldmVsXTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGl0LmZpbGUuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBpdC5sZXZlbCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICAvLyBCYWRnZSBkZSBhdmlzbyAodHJpXHUwMEUybmd1bG8pIG5vIGNhcmQgZGUgcGFzdGEgcXVlIGNvbnRcdTAwRTltIG5vdGFzIGNvbSBgdXJnZW5jeWAuXG4gIC8vIENvciBwZWxvIG5cdTAwRUR2ZWwgbVx1MDBFMXhpbW87IGhvdmVyIGxpc3RhIG9zIGFycXVpdm9zLiBGYXNlIDEwLlxuICBwcml2YXRlIHVyZ2VuY3lCYWRnZShjYXJkOiBIVE1MRWxlbWVudCwgdXJnOiBVcmdlbmN5SW5mbykge1xuICAgIGlmICghdXJnLm1heCkgcmV0dXJuO1xuICAgIGNvbnN0IGIgPSBjYXJkLmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LWJhZGdlIHdkLXUtJHt1cmcubWF4fWAgfSk7XG4gICAgc2V0SWNvbihiLCBcInRyaWFuZ2xlLWFsZXJ0XCIpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VXJnZW5jeVRpcChiLCB1cmcuaXRlbXMpKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZVRpcCgpIHtcbiAgICBpZiAodGhpcy50aXApIHsgdGhpcy50aXAucmVtb3ZlKCk7IHRoaXMudGlwID0gbnVsbDsgfVxuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hUaXAoY2FyZDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJlY2VudHMgPSByZWNlbnROb3Rlcyhmb2xkZXIsIDQpO1xuICAgIGlmICghcmVjZW50cy5sZW5ndGgpIHJldHVybjtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1RpcChjYXJkLCByZWNlbnRzKSk7XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FsZW5kXHUwMEUxcmlvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyQ2FsZW5kYXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfQ0FMKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbW9uZGF5ICA9IG1vbmRheU9mKHRoaXMud2Vla09mZnNldCk7XG4gICAgY29uc3Qgd2Vla051bSA9IGlzb1dlZWtOdW1iZXIobW9uZGF5KTtcbiAgICBjb25zdCB0b2RheUsgID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICBjb25zdCBieURheTogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IGZpbGU6IFRGaWxlIH1bXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBkID0gbm9ybWFsaXplRGF0ZSh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5kYXRlKTtcbiAgICAgIGlmIChkKSAoYnlEYXlbZF0gPz89IFtdKS5wdXNoKHsgbmFtZTogZmlsZS5iYXNlbmFtZSwgZmlsZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWNhbC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgbmF2ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmF2LWJhclwiIH0pO1xuICAgIG5hdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC13ZWVrLWxhYmVsXCIsIHRleHQ6IGBTZW1hbmEgJHt3ZWVrTnVtfWAgfSk7XG5cbiAgICBjb25zdCBjdHJscyA9IG5hdi5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgcHJldiA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDM5XCIgfSk7XG4gICAgY29uc3QgbmV4dCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG4gICAgcHJldi5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQtLTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBuZXh0Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldCsrOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcImNhbGVuZGFyXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX0NBTCwgXCJPY3VsdGFyIGNhbGVuZFx1MDBFMXJpb1wiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWdyaWRcIiB9KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICAgIGRheS5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBjb2wgPSBncmlkLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogW1wid2QtY2FsLWNvbFwiLCBrZXkgPT09IHRvZGF5SyA/IFwid2QtdG9kYXlcIiA6IFwiXCIsIGkgPj0gNSA/IFwid2Qtd2Vla2VuZFwiIDogXCJcIl1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBoZCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLWhkXCIgfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hbWVcIiwgdGV4dDogREFZX1NIT1JUW2ldIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1udW1cIiwgIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcbiAgICAgIGhkLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFicmlyIC8gY3JpYXIgbm90YSBkaVx1MDBFMXJpYVwiKTtcbiAgICAgIGhkLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLm9wZW5EYWlseU5vdGUoa2V5KTsgfTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldID8/IFtdO1xuICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVtcy5zbGljZSgwLCAzKSkge1xuICAgICAgICBjb25zdCBwaWxsID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtcGlsbFwiIH0pO1xuICAgICAgICBwaWxsLnRleHRDb250ZW50ID0gaXQubmFtZS5sZW5ndGggPiAxNCA/IGl0Lm5hbWUuc2xpY2UoMCwgMTQpICsgXCJcdTIwMjZcIiA6IGl0Lm5hbWU7XG4gICAgICAgIHBpbGwub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShpdC5maWxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAzKSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1tb3JlXCIsIHRleHQ6IGArJHtpdGVtcy5sZW5ndGggLSAzfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICBlbmQuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgNik7XG4gICAgc2VjLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IFwid2QtY2FsLWZvb3RlclwiLFxuICAgICAgdGV4dDogbW9uZGF5LmdldE1vbnRoKCkgPT09IGVuZC5nZXRNb250aCgpXG4gICAgICAgID8gYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSAke21vbmRheS5nZXRGdWxsWWVhcigpfWBcbiAgICAgICAgOiBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19IFx1MjAxMyAke01PTlRIX1NIT1JUW2VuZC5nZXRNb250aCgpXX0gJHtlbmQuZ2V0RnVsbFllYXIoKX1gLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQWJyZSBhIG5vdGEgZGlcdTAwRTFyaWEgZGUgYGtleWAgKFlZWVktTU0tREQpOyBjcmlhIGVtIDUwLkRpXHUwMEUxcmlvLyBzZSBuXHUwMEUzbyBleGlzdGlyLlxuICBwcml2YXRlIGFzeW5jIG9wZW5EYWlseU5vdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXRoID0gYCR7REFJTFlfRk9MREVSfS8ke2tleX0ubWRgO1xuICAgIGxldCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuXG4gICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgLy8gR2FyYW50ZSBhIHBhc3RhIHJhaXogKGNhc28gdGVuaGEgc2lkbyByZW1vdmlkYSkuXG4gICAgICBpZiAoIXRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9GT0xERVIpKVxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoREFJTFlfRk9MREVSKS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBjb25zdCB0aXR1bG8gPSBuZXcgRGF0ZSgreSwgK20gLSAxLCArZCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIiwge1xuICAgICAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBVc2EgbyB0ZW1wbGF0ZSBlbSBNb2RlbG9zLyBzZSBleGlzdGlyOyBzZW5cdTAwRTNvLCBmYWxsYmFjayBlbWJ1dGlkby5cbiAgICAgIGNvbnN0IHRwbCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChEQUlMWV9URU1QTEFURSk7XG4gICAgICBsZXQgYm9keTogc3RyaW5nO1xuICAgICAgaWYgKHRwbCBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgIGJvZHkgPSAoYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0cGwpKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZGF0ZVxccypcXH1cXH0vZywga2V5KVxuICAgICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqdGl0bGVcXHMqXFx9XFx9L2csIHRpdHVsbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID1cbmAtLS1cbm93bmVyOiBXZXJ1c1xuY3JlYXRlZDogJHtrZXl9XG5kYXRlOiAke2tleX1cbnJldmlld2VkOiB0cnVlXG50eXBlOiBkYWlseVxucGVybWlzc2lvbnM6XG4gIHJlYWQ6IFthbGxdXG4gIHdyaXRlOlxuICAgIC0gV2VydXNcbi0tLVxuXG4jICR7dGl0dWxvfVxuXG5gO1xuICAgICAgfVxuICAgICAgZmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShwYXRoLCBib2R5KTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZmlsZSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZHMgZG8gY29mcmUgKHRvZGFzIGFzIHBhc3RhcyBkZSB0b3BvKSArIG5hdmVnYWRvciBhbmluaGFkbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclBhcmEocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDT0ZSRVwiIH0pO1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGhlYWQsIFwicGFyYVwiKTtcblxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhcmEtZ3JpZFwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpICAgLy8gaWdub3JhIC5vYnNpZGlhbiwgLnRyYXNoLCBldGMuXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbiAgICBjb25zdCBhY3RpdmVSb290ID0gdGhpcy5uYXZQYXRoID8gdGhpcy50b3BGb2xkZXJPZih0aGlzLm5hdlBhdGgpIDogbnVsbDtcblxuICAgIGxldCBpZHggPSAwO1xuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IG1ldGEgICAgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3Qgc3RhdHMgICA9IGZvbGRlclN0YXRzKGZvbGRlcik7XG4gICAgICBjb25zdCBjb3ZlciAgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IG5hdmlnYWJsZSA9IHN1YkZvbGRlcnMoZm9sZGVyKS5sZW5ndGggPiAwIHx8IGZpbGVzSW4oZm9sZGVyKS5sZW5ndGggPiAwO1xuICAgICAgY29uc3QgaXNBY3RpdmUgPSBhY3RpdmVSb290ID09PSBmb2xkZXIucGF0aDtcblxuICAgICAgY29uc3QgY2FyZCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQgd2QtcGFyYS1jYXJkIHdkLWFuaW0taW5cIiArIChpc0FjdGl2ZSA/IFwiIHdkLWFjdGl2ZVwiIDogXCJcIikgfSk7XG4gICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgY2FyZC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke2lkeCAqIDQwfW1zYDtcbiAgICAgIGlkeCsrO1xuXG4gICAgICBpZiAoY292ZXIpIHtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXJcIiB9KS5jcmVhdGVFbChcImltZ1wiLCB7IGF0dHI6IHsgc3JjOiBjb3ZlciwgZHJhZ2dhYmxlOiBcImZhbHNlXCIgfSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRjID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXIgd2QtY292ZXItZGVmYXVsdFwiIH0pO1xuICAgICAgICByZW5kZXJJY29uKGRjLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY292ZXItZ2x5cGhcIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIH1cbiAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWFjY2VudC1iYXJcIiB9KS5zdHlsZS5iYWNrZ3JvdW5kID0gbWV0YS5hY2NlbnQ7XG5cbiAgICAgIHRoaXMuaGlkZUJ0bihjYXJkLCBmb2xkZXIucGF0aCwgYE9jdWx0YXIgXCIke21ldGEubGFiZWx9XCJgKTtcbiAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHVyZ2VuY3lTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKSk7XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoc3RhdHMpIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgIHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1mb2xkZXJcIiwgdGV4dDogZm9sZGVyLnBhdGggfSk7XG4gICAgICBpZiAobmF2aWdhYmxlKSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oYXMtc3Vic1wiLCB0ZXh0OiBpc0FjdGl2ZSA/IFwiZmVjaGFyIFx1MjVCRVwiIDogXCJhYnJpciBcdTIwM0FcIiB9KTtcblxuICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgaWYgKHJ2LnRvdGFsID4gMCkge1xuICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXNgKTtcbiAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKX0lYDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgZm9sZGVyKTtcblxuICAgICAgY2FyZC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAobmF2aWdhYmxlKSB7IHRoaXMubmF2UGF0aCA9IGlzQWN0aXZlID8gbnVsbCA6IGZvbGRlci5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9XG4gICAgICAgIGVsc2UgcmV2ZWFsSW5FeHBsb3Jlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFpZHgpIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIHZpc1x1MDBFRHZlbC5cIiB9KTtcblxuICAgIC8vIEFycXVpdm9zIHNvbHRvcyBuYSByYWl6IGRvIGNvZnJlXG4gICAgY29uc3Qgcm9vdEZpbGVzID0gZmlsZXNJbih2YXVsdFJvb3QpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMoc2VjLCByb290RmlsZXMsIFwiYXJxdWl2b3MgbmEgcmFpelwiKTtcblxuICAgIGlmICh0aGlzLm5hdlBhdGgpIHtcbiAgICAgIGNvbnN0IGZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLm5hdlBhdGgpO1xuICAgICAgaWYgKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpIHRoaXMucmVuZGVyQnJvd3NlcihzZWMsIGZvbGRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJIaWRkZW5CYXIoc2VjKTtcbiAgfVxuXG4gIC8vIFBhaW5lbCBpbmxpbmUgbmF2ZWdcdTAwRTF2ZWwgKGJyZWFkY3J1bWIgKyBzdWJwYXN0YXMgKyBub3RhcyBkYSBwYXN0YSBhdHVhbClcbiAgcHJpdmF0ZSByZW5kZXJCcm93c2VyKHBhcmVudDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy50b3BGb2xkZXJPZihmb2xkZXIucGF0aCk7XG4gICAgY29uc3Qgcm9vdEZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyb290UGF0aCk7XG4gICAgaWYgKCEocm9vdEZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIHJvb3RGb2xkZXIpO1xuXG4gICAgY29uc3QgcGFuZWwgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhbmVsXCIgfSk7XG4gICAgcGFuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAvLyBCcmVhZGNydW1iXG4gICAgY29uc3QgY3J1bWIgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY3J1bWJcIiB9KTtcbiAgICBjb25zdCByZWwgPSBmb2xkZXIucGF0aCA9PT0gcm9vdFBhdGggPyBbXSA6IGZvbGRlci5wYXRoLnNsaWNlKHJvb3RQYXRoLmxlbmd0aCArIDEpLnNwbGl0KFwiL1wiKTtcblxuICAgIGNvbnN0IHJvb3RTZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKHJlbC5sZW5ndGggPT09IDAgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpIH0pO1xuICAgIHJlbmRlckljb24ocm9vdFNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICByb290U2VnLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgIGlmIChyZWwubGVuZ3RoKSByb290U2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHJvb3RQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgbGV0IGFjYyA9IHJvb3RQYXRoO1xuICAgIHJlbC5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XG4gICAgICBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlcFwiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gcmVsLmxlbmd0aCAtIDE7XG4gICAgICBhY2MgPSBgJHthY2N9LyR7cGFydH1gO1xuICAgICAgY29uc3Qgc2VnUGF0aCA9IGFjYztcbiAgICAgIGNvbnN0IHNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAoaXNMYXN0ID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSwgdGV4dDogcGFydCB9KTtcbiAgICAgIGlmICghaXNMYXN0KSBzZWcub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2VnUGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3NlID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1jbG9zZVwiLCB0ZXh0OiBcIlx1MjcxNVwiIH0pO1xuICAgIGNsb3NlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkZlY2hhclwiKTtcbiAgICBjbG9zZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gQ2FtcG8gZGUgYnVzY2FcbiAgICBjb25zdCBzZWFyY2hXcmFwID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYXJjaC13cmFwXCIgfSk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hXcmFwLmNyZWF0ZUVsKFwiaW5wdXRcIiwge1xuICAgICAgY2xzOiBcIndkLXNlYXJjaFwiLFxuICAgICAgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiZmlsdHJhclx1MjAyNlwiLCB2YWx1ZTogdGhpcy5zZWFyY2hUZXJtIH0sXG4gICAgfSk7XG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtc3ViLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxibCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2QtbGFiZWxcIik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBsYmwuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLW5vdGUtcm93LCAud2Qtbm90ZS1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2Qtbm90ZS1uYW1lLCAud2Qtbm90ZS1jYXJkLW5hbWVcIik/LnRleHRDb250ZW50ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBuYW1lLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJwYXN0YXMgY29tbyBjYXJkc1xuICAgIGNvbnN0IHN1YnMgPSBzdWJGb2xkZXJzKGZvbGRlcik7XG4gICAgaWYgKHN1YnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZ3JpZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9qLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3Qgc2Ygb2Ygc3Vicykge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWFkRm9sZGVyU3RhdHVzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IHN0YXRzICA9IGZvbGRlclN0YXRzKHNmKTtcbiAgICAgICAgY29uc3QgY292ZXIgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBkZWVwZXIgPSBzdWJGb2xkZXJzKHNmKS5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBjdXN0b21JY29uID0gcmVhZEZvbGRlckljb24odGhpcy5hcHAsIHNmKTtcblxuICAgICAgICBjb25zdCBjYXJkID0gc2dyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtY2FyZCB3ZC1zdWItY2FyZCB3ZC1zLSR7c3RhdHVzfWAgfSk7XG4gICAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FwYSBwYWRyXHUwMEUzbyBzdXRpbCAodmVyc1x1MDBFM28gbWVub3IgcXVlIGFzIHBhc3RhcyBkZSB0b3BvKSBcdTIwMTQgRmFzZSA5LjFcbiAgICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHQgd2QtY292ZXItc3ViXCIgfSk7XG4gICAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIGN1c3RvbUljb24gPz8gXCJcdUQ4M0RcdURDQzFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLWJhZGdlIHdkLWJhZGdlLSR7c3RhdHVzfWAsIHRleHQ6IFNUQVRVU19JQ09OW3N0YXR1c10gfSk7XG4gICAgICAgIHRoaXMudXJnZW5jeUJhZGdlKGNhcmQsIHVyZ2VuY3lTdGF0cyh0aGlzLmFwcCwgc2YpKTtcblxuICAgICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgICBpZiAoY3VzdG9tSWNvbikgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uIHdkLXN1Yi1pY29uXCIgfSksIGN1c3RvbUljb24pO1xuICAgICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoc3RhdHMpIH0pO1xuICAgICAgICBpZiAoZGVlcGVyKSB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdWItYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcblxuICAgICAgICBjb25zdCBsYWJlbCA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsIHRleHQ6IHNmLm5hbWUgfSk7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIGxhYmVsLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIHNmKTtcbiAgICAgICAgICBpZiAocnYudG90YWwgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgICAgICBjb25zdCBmaWxsID0gYmFyLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzcy1maWxsXCIgfSk7XG4gICAgICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKX0lYDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY2FyZC5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaFRpcChjYXJkLCBzZik7XG4gICAgICAgICAgY2FyZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBzZi5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXJxdWl2b3MgZGEgcGFzdGEgYXR1YWwgKG5vdGFzLCBjYW52YXMsIGJhc2VzKVxuICAgIGNvbnN0IG5vdGVzID0gZmlsZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFJlbGF0XHUwMEYzcmlvcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclJlcG9ydHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfUkVQKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpO1xuICAgIGlmICghKGRpciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZGlyLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoIShjIGluc3RhbmNlb2YgVEZpbGUpIHx8IGMuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZCA9IG5vcm1hbGl6ZURhdGUodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShjLnBhdGgpPy5mcm9udG1hdHRlcj8uZGF0ZSk7XG4gICAgICBpZiAoZCkgaXRlbXMucHVzaCh7IGZpbGU6IGMsIGRhdGU6IGQgfSk7XG4gICAgfVxuICAgIGl0ZW1zLnNvcnQoKGEsIGIpID0+IGIuZGF0ZS5sb2NhbGVDb21wYXJlKGEuZGF0ZSkpO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJSRUxBVFx1MDBEM1JJT1MgQ0xBVURFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJyZXBvcnRzXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX1JFUCwgXCJPY3VsdGFyIFJlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGNvbnN0IGxpc3QgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXJlcG9ydC1saXN0XCIgfSk7XG4gICAgZm9yIChjb25zdCB7IGZpbGUsIGRhdGUgfSBvZiBpdGVtcy5zbGljZSgwLCA2KSkge1xuICAgICAgY29uc3QgW3ksIG0sIGRdID0gZGF0ZS5zcGxpdChcIi1cIik7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1yZXBvcnQtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1yZXBvcnQtZGF0ZVwiLCB0ZXh0OiBgJHtkfS8ke219LyR7eX1gIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcmVwb3J0LW5hbWVcIiwgdGV4dDogZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICAgICAgdm9pZCB5O1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWF0bWFwICh2aWEgcGx1Z2luIEhlYXRtYXAgQ2FsZW5kYXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhdG1hcChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19IRUFUKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwiaGVhdG1hcFwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19IRUFULCBcIk9jdWx0YXIgaGVhdG1hcFwiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhLCBubyBhbm8gY29ycmVudGUuXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoZi5zdGF0LmN0aW1lKTtcbiAgICAgIGlmIChkLmdldEZ1bGxZZWFyKCkgIT09IHllYXIpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuICAgIGNvbnN0IGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdID0gT2JqZWN0LmVudHJpZXMoY291bnRzKS5tYXAoKFtkYXRlLCBuXSkgPT4gKHtcbiAgICAgIGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAsXG4gICAgfSkpO1xuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDAsIGNyZWF0ZWRUaGlzV2VlayA9IDA7XG4gICAgY29uc3Qgd2Vla0FnbyA9IERhdGUubm93KCkgLSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBjb250aW51ZTtcbiAgICAgIHRvdGFsTm90ZXMrKztcbiAgICAgIGlmICh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgdG90YWxSZXZpZXdlZCsrO1xuICAgICAgaWYgKGYuc3RhdC5jdGltZSA+PSB3ZWVrQWdvKSBjcmVhdGVkVGhpc1dlZWsrKztcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsUGN0ID0gdG90YWxOb3RlcyA+IDAgPyBNYXRoLnJvdW5kKHRvdGFsUmV2aWV3ZWQgLyB0b3RhbE5vdGVzICogMTAwKSA6IDA7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJFU1RBVFx1MDBDRFNUSUNBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwic3RhdHNcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfU1RBVCwgXCJPY3VsdGFyIGVzdGF0XHUwMEVEc3RpY2FzXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICAvLyBOXHUwMEZBbWVyb3MgZ2xvYmFpc1xuICAgIGNvbnN0IGdsb2IgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZ2xvYmFsXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnXCIsIHRleHQ6IFN0cmluZyh0b3RhbE5vdGVzKSB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJub3Rhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZyB3ZC1zdGF0LXJldi1udW1cIiwgdGV4dDogYCR7Z2xvYmFsUGN0fSVgIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcInJldmlzYWRhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXdlZWtcIiwgdGV4dDogYCske2NyZWF0ZWRUaGlzV2Vla31gIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcImVzdGEgc2VtYW5hXCIgfSk7XG5cbiAgICAvLyBCcmVha2Rvd24gcG9yIHBhc3RhXG4gICAgY29uc3QgdGFibGUgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtdGFibGVcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG5cbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgaWYgKHJ2LnRvdGFsID09PSAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgcGN0ID0gTWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKTtcblxuICAgICAgY29uc3Qgcm93ID0gdGFibGUuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcm93XCIgfSk7XG4gICAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAgIGNvbnN0IG5hbWVFbCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1mb2xkZXJcIiB9KTtcbiAgICAgIHJlbmRlckljb24obmFtZUVsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICBuYW1lRWwuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1jb3VudFwiLCB0ZXh0OiBgJHtydi50b3RhbH1gIH0pO1xuXG4gICAgICBjb25zdCBiYXJXcmFwID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhclwiIH0pO1xuICAgICAgYmFyV3JhcC5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhcyAoJHtwY3R9JSlgKTtcbiAgICAgIGNvbnN0IGZpbGwgPSBiYXJXcmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhci1maWxsXCIgfSk7XG4gICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cGN0fSVgO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcGN0XCIsIHRleHQ6IGAke3BjdH0lYCB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTGlzdGEgLyBncmFkZSBkZSBub3RhcyBjb20gdG9nZ2xlIGUgaW5kaWNhZG9yIHJldmlld2VkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyTm90ZXMocGFyZW50OiBIVE1MRWxlbWVudCwgbm90ZXM6IFRGaWxlW10sIGxhYmVsID0gXCJcIikge1xuICAgIGlmICghbm90ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgaXNHcmlkID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPT09IFwiZ3JpZFwiO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5yZXZpZXdGaWx0ZXIgPyBub3Rlcy5maWx0ZXIoZiA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCAhPT0gdHJ1ZSkgOiBub3RlcztcblxuICAgIGNvbnN0IGhkciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtaGRyXCIgfSk7XG4gICAgY29uc3QgY291bnRUeHQgPSB0aGlzLnJldmlld0ZpbHRlclxuICAgICAgPyBgJHtmaWx0ZXJlZC5sZW5ndGh9IHBlbmRlbnRlJHtmaWx0ZXJlZC5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9IC8gJHtub3Rlcy5sZW5ndGh9YFxuICAgICAgOiAobGFiZWwgfHwgYCR7bm90ZXMubGVuZ3RofSBub3RhJHtub3Rlcy5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9YCk7XG4gICAgaGRyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZXMtbGFiZWxcIiwgdGV4dDogY291bnRUeHQgfSk7XG5cbiAgICBjb25zdCB0b2cgPSBoZHIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXZpZXctdG9nZ2xlXCIgfSk7XG4gICAgY29uc3QgYnRuUGVuZCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5yZXZpZXdGaWx0ZXIgPyBcIiB3ZC12aWV3LWFjdGl2ZSB3ZC12aWV3LXBlbmRcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVDQlwiIH0pO1xuICAgIGJ0blBlbmQuc2V0QXR0cihcInRpdGxlXCIsIFwiTW9zdHJhciBzXHUwMEYzIHBlbmRlbnRlcyAoblx1MDBFM28gcmV2aXNhZGFzKVwiKTtcbiAgICBidG5QZW5kLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5yZXZpZXdGaWx0ZXIgPSAhdGhpcy5yZXZpZXdGaWx0ZXI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgYnRuTCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIWlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyNjFcIiB9KTtcbiAgICBidG5MLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkxpc3RhXCIpO1xuICAgIGJ0bkwub25jbGljayA9IGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwibGlzdFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5HID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArIChpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjlFXCIgfSk7XG4gICAgYnRuRy5zZXRBdHRyKFwidGl0bGVcIiwgXCJDb2x1bmFzXCIpO1xuICAgIGJ0bkcub25jbGljayA9IGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwiZ3JpZFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGlmICghZmlsdGVyZWQubGVuZ3RoKSB7XG4gICAgICBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IHRoaXMucmV2aWV3RmlsdGVyID8gXCJOZW5odW1hIG5vdGEgcGVuZGVudGUgbmVzdGEgcGFzdGEuXCIgOiBcIk5lbmh1bWEgbm90YS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNHcmlkKSB7XG4gICAgICBjb25zdCBncmlkID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3QgaXNNZCA9IGYuZXh0ZW5zaW9uID09PSBcIm1kXCI7XG4gICAgICAgIGNvbnN0IHN0ID0gaXNNZCA/IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKSA6IFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgY29uc3QgcnYgPSBpc01kICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCB1cmcgPSBpc01kID8gcmVhZE5vdGVVcmdlbmN5KHRoaXMuYXBwLCBmKSA6IG51bGw7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jYXJkIHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICAvLyBDYXBhIHBhZHJcdTAwRTNvIHBvciB0aXBvIGRlIGFycXVpdm8gKG5vdGEgLyBjYW52YXMgLyBiYXNlKSBcdTIwMTQgRmFzZSA5LjJcbiAgICAgICAgY29uc3QgY292ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLWNvdmVyIHdkLWZpbGUtJHtmLmV4dGVuc2lvbn1gIH0pO1xuICAgICAgICBzZXRJY29uKGNvdi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtY292ZXItZ2x5cGhcIiB9KSwgZmlsZUdseXBoKGYuZXh0ZW5zaW9uKSk7XG5cbiAgICAgICAgaWYgKGlzTWQpIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAodXJnKSB7IGNvbnN0IHcgPSBjYXJkLmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LW1hcmsgd2QtdS0ke3VyZ31gIH0pOyBzZXRJY29uKHcsIFwidHJpYW5nbGUtYWxlcnRcIik7IHcuc2V0QXR0cihcInRpdGxlXCIsIGBVcmdcdTAwRUFuY2lhOiAke3VyZ31gKTsgfVxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgICAgIGlmIChzdCAhPT0gXCJjYW5jZWxsZWRcIikgY2FyZC5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaXN0ID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWxpc3RcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBpc01kID0gZi5leHRlbnNpb24gPT09IFwibWRcIjtcbiAgICAgICAgY29uc3Qgc3QgPSBpc01kID8gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpIDogXCJwcm9ncmVzc1wiO1xuICAgICAgICBjb25zdCBydiA9IGlzTWQgJiYgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHVyZyA9IGlzTWQgPyByZWFkTm90ZVVyZ2VuY3kodGhpcy5hcHAsIGYpIDogbnVsbDtcblxuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtcm93IHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICBjb25zdCB0aSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBgd2Qtbm90ZS10eXBlaWNvbiB3ZC1maWxlLSR7Zi5leHRlbnNpb259YCB9KTtcbiAgICAgICAgc2V0SWNvbih0aSwgZmlsZUdseXBoKGYuZXh0ZW5zaW9uKSk7XG4gICAgICAgIGlmIChpc01kKSByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtZG90IHdkLWJhZGdlLSR7c3R9YCB9KTtcblxuICAgICAgICBjb25zdCBuYW1lID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgaWYgKHVyZykgeyBjb25zdCB3ID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC11cmdlbmN5LW1hcmsgd2QtdS0ke3VyZ31gIH0pOyBzZXRJY29uKHcsIFwidHJpYW5nbGUtYWxlcnRcIik7IHcuc2V0QXR0cihcInRpdGxlXCIsIGBVcmdcdTAwRUFuY2lhOiAke3VyZ31gKTsgfVxuICAgICAgICBpZiAoaXNNZCkgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGlmIChzdCAhPT0gXCJjYW5jZWxsZWRcIikgcm93Lm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEdyXHUwMEUxZmljbyBkZSBjcmVzY2ltZW50byBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckdyb3d0aChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19HUk9XKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ1JFU0NJTUVOVE8gRE8gQ09GUkVcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IGJ0bkRheSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghdGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcImRpYVwiIH0pO1xuICAgIGJ0bkRheS5zZXRBdHRyKFwidGl0bGVcIiwgXCJOb3RhcyBjcmlhZGFzIHBvciBkaWFcIik7XG4gICAgYnRuRGF5Lm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gZmFsc2U7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgYnRuQ3VtID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJ0b3RhbFwiIH0pO1xuICAgIGJ0bkN1bS5zZXRBdHRyKFwidGl0bGVcIiwgXCJUb3RhbCBhY3VtdWxhZG8gbm8gcGVyXHUwMEVEb2RvXCIpO1xuICAgIGJ0bkN1bS5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IHRydWU7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwiZ3Jvd3RoXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX0dST1csIFwiT2N1bHRhciBjcmVzY2ltZW50b1wiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgLy8gQWdydXBhIG5vdGFzIHBvciBkYXRhIGRlIGNyaWFcdTAwRTdcdTAwRTNvXG4gICAgY29uc3QgY291bnRzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkobmV3IERhdGUoZi5zdGF0LmN0aW1lKSk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuXG4gICAgLy8gXHUwMERBbHRpbW9zIDMwIGRpYXNcbiAgICBjb25zdCBEQVlTID0gMzA7XG4gICAgY29uc3QgZGF5czogeyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gREFZUyAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGQuc2V0RGF0ZShkLmdldERhdGUoKSAtIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb25zdCBbLCBtLCBkYXldID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICAgIGRheXMucHVzaCh7IGtleSwgY291bnQ6IGNvdW50c1trZXldID8/IDAsIGxhYmVsOiBgJHtkYXl9LyR7bX1gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsID0gZGF5cy5yZWR1Y2UoKHMsIGQpID0+IHMgKyBkLmNvdW50LCAwKTtcbiAgICBjb25zdCB0b2RheUtleSA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gTW9kbyBjdW11bGF0aXZvOiBzb21hIGFjdW11bGFkYSBkaWEgYSBkaWFcbiAgICB0eXBlIERheUVudHJ5ID0geyBrZXk6IHN0cmluZzsgY291bnQ6IG51bWJlcjsgbGFiZWw6IHN0cmluZzsgZGlzcGxheVZhbDogbnVtYmVyIH07XG4gICAgbGV0IGVudHJpZXM6IERheUVudHJ5W107XG4gICAgaWYgKHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSkge1xuICAgICAgbGV0IGFjYyA9IDA7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiB7IGFjYyArPSBkLmNvdW50OyByZXR1cm4geyAuLi5kLCBkaXNwbGF5VmFsOiBhY2MgfTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+ICh7IC4uLmQsIGRpc3BsYXlWYWw6IGQuY291bnQgfSkpO1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5lbnRyaWVzLm1hcChlID0+IGUuZGlzcGxheVZhbCksIDEpO1xuXG4gICAgLy8gTGluaGEgZGUgcmVzdW1vXG4gICAgY29uc3QgaW5mbyA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWluZm9cIiB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXRvdGFsXCIsIHRleHQ6IGAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGVudHJpZXNbZW50cmllcy5sZW5ndGggLSAxXS5kaXNwbGF5VmFsIDogdG90YWx9YCB9KTtcbiAgICBpbmZvLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtZ3Jvd3RoLXBlcmlvZFwiLCB0ZXh0OiB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIm5vdGFzIGFjdW11bGFkYXMgKDMwIGRpYXMpXCIgOiBcIm5vdGFzIGNyaWFkYXMgbm9zIFx1MDBGQWx0aW1vcyAzMCBkaWFzXCIgfSk7XG5cbiAgICAvLyBHclx1MDBFMWZpY28gZGUgYmFycmFzXG4gICAgY29uc3QgY2hhcnQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jaGFydFwiIH0pO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoeyBrZXksIGNvdW50LCBsYWJlbCwgZGlzcGxheVZhbCB9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IGNoYXJ0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY29sXCIgKyAoa2V5ID09PSB0b2RheUtleSA/IFwiIHdkLWdyb3d0aC10b2RheVwiIDogXCJcIikgfSk7XG4gICAgICBjb25zdCBiYXJBcmVhID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyLWFyZWFcIiB9KTtcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBkaXNwbGF5VmFsID09PSAwO1xuICAgICAgY29uc3QgYmFyID0gYmFyQXJlYS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhclwiICsgKGlzRW1wdHkgPyBcIiB3ZC1ncm93dGgtYmFyLXplcm9cIiA6IFwiXCIpIH0pO1xuICAgICAgYmFyLnN0eWxlLmhlaWdodCA9IGlzRW1wdHkgPyBcIjNweFwiIDogYCR7TWF0aC5tYXgoNSwgTWF0aC5yb3VuZCgoZGlzcGxheVZhbCAvIG1heCkgKiAxMDApKX0lYDtcbiAgICAgIGlmICghaXNFbXB0eSkgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtsYWJlbH06ICR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZGlzcGxheVZhbCArIFwiIHRvdGFsXCIgOiBjb3VudCArIFwiIG5vdGEocylcIn1gKTtcblxuICAgICAgY29uc3Qgc2hvd0xibCA9IGlkeCA9PT0gMCB8fCBpZHggPT09IDcgfHwgaWR4ID09PSAxNCB8fCBpZHggPT09IDIxIHx8IGlkeCA9PT0gMjkgfHwga2V5ID09PSB0b2RheUtleTtcbiAgICAgIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWxibFwiLCB0ZXh0OiBzaG93TGJsID8gbGFiZWwgOiBcIlwiIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgKEZhc2UgOC4xIFx1MjAxNCBsZWl0dXJhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclRvZG9pc3Qocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfVE9ETykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtdG9kby1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJUQVJFRkFTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcblxuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIGNvbnN0IHJlZnJlc2ggPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVmcmVzaFwiICsgKHRoaXMudG9kb2lzdExvYWRpbmcgPyBcIiB3ZC1zcGluXCIgOiBcIlwiKSB9KTtcbiAgICAgIHNldEljb24ocmVmcmVzaCwgXCJyZWZyZXNoLWN3XCIpO1xuICAgICAgcmVmcmVzaC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBdHVhbGl6YXIgdGFyZWZhcyBkbyBUb2RvaXN0XCIpO1xuICAgICAgcmVmcmVzaC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5mZXRjaFRvZG9pc3QodHJ1ZSk7IH07XG4gICAgfVxuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcInRvZG9pc3RcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfVE9ETywgXCJPY3VsdGFyIHRhcmVmYXNcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDb2xlIHNldSB0b2tlbiBkbyBUb2RvaXN0IGVtIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBXZXJ1cyBEYXNoYm9hcmQgcGFyYSB2ZXIgc3VhcyB0YXJlZmFzIGFxdWkuXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJpbWVpcmEgY2FyZ2EgcHJlZ3VpXHUwMEU3b3NhIChuXHUwMEUzbyByZWZheiBlbSBsb29wIHNlIGpcdTAwRTEgYnVzY291IG91IHNlIGRldSBlcnJvKS5cbiAgICBpZiAoIXRoaXMudG9kb2lzdEZldGNoZWRBdCAmJiAhdGhpcy50b2RvaXN0TG9hZGluZyAmJiAhdGhpcy50b2RvaXN0RXJyb3IpIHZvaWQgdGhpcy5mZXRjaFRvZG9pc3QoZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMudG9kb2lzdEVycm9yKSB7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZXJyb3JcIiwgdGV4dDogYEVycm8gYW8gYnVzY2FyIHRhcmVmYXM6ICR7dGhpcy50b2RvaXN0RXJyb3J9YCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnRvZG9pc3RGZXRjaGVkQXQpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJDYXJyZWdhbmRvIHRhcmVmYXNcdTIwMjZcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtb25kYXkgPSBtb25kYXlPZigwKTsgICAvLyBzZW1wcmUgYSBzZW1hbmEgYXR1YWxcbiAgICBjb25zdCB0b2RheUsgPSB0b0tleShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuXG4gICAgLy8gQWdydXBhIHBvciBkaWEgZGUgdmVuY2ltZW50byArIGNvbGV0YSBhdHJhc2FkYXMgKGR1ZSA8IGhvamUpLlxuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCBUb2RvaXN0VGFza1tdPiA9IHt9O1xuICAgIGNvbnN0IG92ZXJkdWU6IFRvZG9pc3RUYXNrW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHQgb2YgdGhpcy50b2RvaXN0VGFza3MpIHtcbiAgICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgICAgaWYgKCFkaykgY29udGludWU7XG4gICAgICBpZiAoZGsgPCB0b2RheUspIG92ZXJkdWUucHVzaCh0KTtcbiAgICAgIChieURheVtka10gPz89IFtdKS5wdXNoKHQpO1xuICAgIH1cbiAgICBjb25zdCBieVByaSA9IChhOiBUb2RvaXN0VGFzaywgYjogVG9kb2lzdFRhc2spID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5O1xuICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhieURheSkpIGJ5RGF5W2tdLnNvcnQoYnlQcmkpO1xuICAgIG92ZXJkdWUuc29ydChieVByaSk7XG5cbiAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8td2Vla2xhYmVsXCIsIHRleHQ6IGBTZW1hbmEgJHt3ZWVrTnVtfSBcdTAwQjcgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19ICR7bW9uZGF5LmdldEZ1bGxZZWFyKCl9YCB9KTtcblxuICAgIC8vIEdyYWRlIHNlbWFuYWwgY29tIGNoaXBzIHBvciBkaWFcbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWdyaWRcIiB9KTtcbiAgICBsZXQgd2Vla1Rhc2tDb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLXRvZG8tY29sXCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgaSA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhkID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWNvbGhkXCIgfSk7XG4gICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbaV0gfSk7XG4gICAgICBoZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tZGF5bnVtXCIsIHRleHQ6IFN0cmluZyhkYXkuZ2V0RGF0ZSgpKSB9KTtcblxuICAgICAgY29uc3QgaXRlbXMgPSBieURheVtrZXldID8/IFtdO1xuICAgICAgZm9yIChjb25zdCB0IG9mIGl0ZW1zKSB7IHRoaXMudG9kb0NoaXAoY29sLCB0KTsgd2Vla1Rhc2tDb3VudCsrOyB9XG4gICAgfVxuICAgIGlmICh3ZWVrVGFza0NvdW50ID09PSAwKVxuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eSB3ZC10b2RvLWVtcHR5d2Vla1wiLCB0ZXh0OiBcIk5lbmh1bWEgdGFyZWZhIGNvbSBkYXRhIG5lc3RhIHNlbWFuYS5cIiB9KTtcblxuICAgIC8vIFBhaW5lbCBkZSBhdHJhc2FkYXMgKHJlY29saFx1MDBFRHZlbClcbiAgICBpZiAob3ZlcmR1ZS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW92ZXJkdWVcIiB9KTtcbiAgICAgIGNvbnN0IG9oZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9oZFwiIH0pO1xuICAgICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vd2FyblwiLCB0ZXh0OiBcIlx1MjZBMFwiIH0pO1xuICAgICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdGl0bGVcIiwgdGV4dDogYEF0cmFzYWRhcyAoJHtvdmVyZHVlLmxlbmd0aH0pYCB9KTtcbiAgICAgIG9oZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tb3RvZ2dsZVwiLCB0ZXh0OiB0aGlzLnRvZG9pc3RPdmVyZHVlT3BlbiA/IFwib2N1bHRhciBcdTI1QkVcIiA6IFwibW9zdHJhciBcdTIwM0FcIiB9KTtcbiAgICAgIG9oZC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLnRvZG9pc3RPdmVyZHVlT3BlbiA9ICF0aGlzLnRvZG9pc3RPdmVyZHVlT3BlbjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgICAgaWYgKHRoaXMudG9kb2lzdE92ZXJkdWVPcGVuKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1vbGlzdFwiIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2Ygb3ZlcmR1ZSkgdGhpcy50b2RvUm93KGxpc3QsIHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrYm94IGRlIGNvbmNsdXNcdTAwRTNvIChGYXNlIDguMikgXHUyMDE0IGNvbmNsdWkgbm8gVG9kb2lzdCByZWFsIGFvIGNsaWNhci5cbiAgcHJpdmF0ZSB0b2RvQ2hlY2soaG9zdDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgY2hlY2sgPSBob3N0LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1jaGVja1wiIH0pO1xuICAgIGNoZWNrLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbmNsdWlyIHRhcmVmYVwiKTtcbiAgICBjaGVjay5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5jb21wbGV0ZVRhc2sodCk7IH07XG4gIH1cblxuICAvLyBUb29sdGlwIGRhIHRhcmVmYTogdFx1MDBFRHR1bG8gY29tcGxldG8gKyBkZXNjcmlcdTAwRTdcdTAwRTNvIChpbnN0cnVcdTAwRTdcdTAwRjVlcyksIG5vIGhvdmVyLlxuICBwcml2YXRlIHNob3dUYXNrVGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcCB3ZC10YXNrLXRpcFwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stdGlwLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGFzay10aXAtcHJpXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IHByaU1ldGEodC5wcmlvcml0eSkuY29sb3I7XG4gICAgaGVhZC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRhc2stdGlwLXRpdGxlXCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkge1xuICAgICAgY29uc3QgZCA9IHQuZGVzY3JpcHRpb24hLnRyaW0oKTtcbiAgICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGFzay10aXAtZGVzY1wiLCB0ZXh0OiBkLmxlbmd0aCA+IERFU0NfTUFYID8gZC5zbGljZSgwLCBERVNDX01BWCkgKyBcIlx1MjAyNlwiIDogZCB9KTtcbiAgICB9XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gICAgdGhpcy5wb3NpdGlvblRpcCh0aXAsIHRhcmdldCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRhc2tUaXAoZWw6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rhc2tUaXAoZWwsIHQpKTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUaXAoKSk7XG4gIH1cblxuICAvLyBDaGlwIGNvbXBhY3RvIGRlIHRhcmVmYSAobmEgZ3JhZGUgc2VtYW5hbCkuXG4gIHByaXZhdGUgdG9kb0NoaXAoY29sOiBIVE1MRWxlbWVudCwgdDogVG9kb2lzdFRhc2spIHtcbiAgICBjb25zdCBwcmkgPSBwcmlNZXRhKHQucHJpb3JpdHkpO1xuICAgIGNvbnN0IGNoaXAgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tY2hpcFwiIH0pO1xuICAgIGNoaXAuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBwcmkuY29sb3IpO1xuICAgIHRoaXMudG9kb0NoZWNrKGNoaXAsIHQpO1xuICAgIGlmICh0LmR1ZT8uaXNfcmVjdXJyaW5nKSBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLWNoaXAtdHh0XCIsIHRleHQ6IHQuY29udGVudCB9KTtcbiAgICBpZiAoaGFzRGVzYyh0KSkgc2V0SWNvbihjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1oYXNkZXNjXCIgfSksIFwiYWxpZ24tbGVmdFwiKTtcbiAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB0aGlzLm9wZW5UYXNrTW9kYWwodCk7XG4gICAgdGhpcy5hdHRhY2hUYXNrVGlwKGNoaXAsIHQpO1xuICB9XG5cbiAgLy8gTGluaGEgZGUgdGFyZWZhIChubyBwYWluZWwgZGUgYXRyYXNhZGFzKS5cbiAgcHJpdmF0ZSB0b2RvUm93KGxpc3Q6IEhUTUxFbGVtZW50LCB0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IHByaSA9IHByaU1ldGEodC5wcmlvcml0eSk7XG4gICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby1yb3dcIiB9KTtcbiAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLXByaVwiLCBwcmkuY29sb3IpO1xuICAgIHRoaXMudG9kb0NoZWNrKHJvdywgdCk7XG4gICAgY29uc3QgdGFnID0gcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1wcmlcIiwgdGV4dDogcHJpLmxhYmVsIH0pO1xuICAgIHRhZy5zdHlsZS5iYWNrZ3JvdW5kID0gcHJpLmNvbG9yO1xuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcm93LXR4dFwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgaWYgKGhhc0Rlc2ModCkpIHNldEljb24ocm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1oYXNkZXNjXCIgfSksIFwiYWxpZ24tbGVmdFwiKTtcbiAgICBjb25zdCBkayA9IGR1ZUtleSh0KTtcbiAgICBpZiAoZGspIHtcbiAgICAgIGNvbnN0IFssIG0sIGRdID0gZGsuc3BsaXQoXCItXCIpO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yb3ctZGF0ZVwiLCB0ZXh0OiBgJHtkfS8ke219YCB9KTtcbiAgICB9XG4gICAgaWYgKHQuZHVlPy5pc19yZWN1cnJpbmcpIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVjdXJcIiwgdGV4dDogXCJcdTI3RjNcIiB9KTtcbiAgICByb3cub25jbGljayA9ICgpID0+IHRoaXMub3BlblRhc2tNb2RhbCh0KTtcbiAgICB0aGlzLmF0dGFjaFRhc2tUaXAocm93LCB0KTtcbiAgfVxuXG4gIC8vIEFicmUgbyBtb2RhbCBkZSBkZXRhbGhlcyBkYSB0YXJlZmEgKGRlc2NyaVx1MDBFN1x1MDBFM28gY29tIGxpbmtzIGNsaWNcdTAwRTF2ZWlzKS5cbiAgcHJpdmF0ZSBvcGVuVGFza01vZGFsKHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgbmV3IFRhc2tNb2RhbCh0aGlzLmFwcCwgdCwgdGhpcywgKCkgPT4gdm9pZCB0aGlzLmNvbXBsZXRlVGFzayh0KSkub3BlbigpO1xuICB9XG5cbiAgLy8gQ29uY2x1aSBhIHRhcmVmYSBkZSBmb3JtYSBvdGltaXN0YTogcmVtb3ZlIGRhIGxpc3RhIGUgcmUtcmVuZGVyaXphOyBzZSBhIEFQSVxuICAvLyBmYWxoYXIsIHJlc3RhdXJhIGUgYXZpc2EuIEEgZXNjcml0YSByZWZsZXRlIG5vIFRvZG9pc3QgcmVhbCAoRmFzZSA4LjIpLlxuICBwcml2YXRlIGFzeW5jIGNvbXBsZXRlVGFzayh0OiBUb2RvaXN0VGFzaykge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gdGhpcy50b2RvaXN0VGFza3MuZmluZEluZGV4KHggPT4geC5pZCA9PT0gdC5pZCk7XG4gICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRvZG9pc3RUYXNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjbG9zZVRvZG9pc3RUYXNrKHRva2VuLCB0LmlkKTtcbiAgICAgIG5ldyBOb3RpY2UoYFx1MjcxMyBDb25jbHVcdTAwRURkYTogJHt0LmNvbnRlbnR9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGlkeCA+PSAwKSB0aGlzLnRvZG9pc3RUYXNrcy5zcGxpY2UoaWR4LCAwLCB0KTsgICAvLyByZXZlcnRlXG4gICAgICBuZXcgTm90aWNlKGBGYWxoYSBhbyBjb25jbHVpcjogJHtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSl9YCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJ1c2NhIHRhcmVmYXM7IGBtYW51YWxgIG1vc3RyYSBvIHNwaW5uZXIgaW1lZGlhdGFtZW50ZS5cbiAgcHJpdmF0ZSBhc3luYyBmZXRjaFRvZG9pc3QobWFudWFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICghdG9rZW4gfHwgdGhpcy50b2RvaXN0TG9hZGluZykgcmV0dXJuO1xuICAgIHRoaXMudG9kb2lzdExvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMudG9kb2lzdEVycm9yID0gbnVsbDtcbiAgICBpZiAobWFudWFsKSB0aGlzLnJlbmRlcigpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnRvZG9pc3RUYXNrcyA9IGF3YWl0IGZldGNoVG9kb2lzdFRhc2tzKHRva2VuKTtcbiAgICAgIHRoaXMudG9kb2lzdEZldGNoZWRBdCA9IERhdGUubm93KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy50b2RvaXN0RXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMudG9kb2lzdExvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVzZXRhIG8gZXN0YWRvIChleC46IHRva2VuIGFsdGVyYWRvIG5hcyBjb25maWd1cmFcdTAwRTdcdTAwRjVlcykgZSByZS1yZW5kZXJpemEuXG4gIHJlc2V0VG9kb2lzdCgpIHtcbiAgICB0aGlzLnRvZG9pc3RUYXNrcyA9IFtdO1xuICAgIHRoaXMudG9kb2lzdEZldGNoZWRBdCA9IDA7XG4gICAgdGhpcy50b2RvaXN0RXJyb3IgPSBudWxsO1xuICAgIHRoaXMudG9kb2lzdExvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYWRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckhlYWRlcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGggPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXJcIiB9KTtcbiAgICBjb25zdCB0eHQgPSBoLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWFkZXItdGV4dFwiIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZGF0ZVwiLCB0ZXh0OiB0b2RheUJSKCkgfSk7XG4gICAgdHh0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXRsZVwiLCB0ZXh0OiBcIlNlY29uZCBCcmFpblwiIH0pO1xuXG4gICAgY29uc3QgdG9nZ2xlID0gaC5jcmVhdGVTcGFuKHtcbiAgICAgIGNsczogXCJ3ZC1jb21wYWN0LXRvZ2dsZVwiLFxuICAgICAgdGV4dDogdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA/IFwiXHUyNUE2IGNvbXBhY3RvXCIgOiBcIlx1MjVBNCBjb25mb3J0XHUwMEUxdmVsXCIsXG4gICAgfSk7XG4gICAgdG9nZ2xlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkFsdGVybmFyIG1vZG8gY29tcGFjdG9cIik7XG4gICAgdG9nZ2xlLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0ID0gIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3Q7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGx1Z2luIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZXJ1c0Rhc2hib2FyZCBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBEYXNoU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFZJRVdfVFlQRSwgbGVhZiA9PiBuZXcgRGFzaGJvYXJkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwibGF5b3V0LWRhc2hib2FyZFwiLCBcIkFicmlyIFdlcnVzIERhc2hib2FyZFwiLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwib3Blbi1kYXNoYm9hcmRcIiwgbmFtZTogXCJBYnJpciBEYXNoYm9hcmRcIiwgY2FsbGJhY2s6ICgpID0+IHRoaXMub3BlbigpIH0pO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgV2VydXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG4gIH1cblxuICAvLyBSZS1idXNjYSBvIFRvZG9pc3QgZW0gdG9kYXMgYXMgZGFzaGJvYXJkcyBhYmVydGFzIChleC46IGFwXHUwMEYzcyBtdWRhciBvIHRva2VuKS5cbiAgcmVmcmVzaERhc2hib2FyZHMoKSB7XG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKSkge1xuICAgICAgY29uc3QgdiA9IGxlYWYudmlldztcbiAgICAgIGlmICh2IGluc3RhbmNlb2YgRGFzaGJvYXJkVmlldykgdi5yZXNldFRvZG9pc3QoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gICAgLy8gU2FuZWFtZW50bzogc2VjdGlvbk9yZGVyIGNvbSBleGF0YW1lbnRlIGFzIHNlXHUwMEU3XHUwMEY1ZXMgdlx1MDBFMWxpZGFzLCBzZW0gZHVwbGljYXRhcy5cbiAgICBjb25zdCB2YWxpZDogU2VjdGlvbklkW10gPSBbXCJzdGF0c1wiLCBcInRvZG9pc3RcIiwgXCJwYXJhXCIsIFwiaGVhdG1hcFwiLCBcImdyb3d0aFwiLCBcInJlcG9ydHNcIiwgXCJjYWxlbmRhclwiXTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxTZWN0aW9uSWQ+KCk7XG4gICAgY29uc3QgY2xlYW5lZCA9ICh0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciB8fCBbXSkuZmlsdGVyKFxuICAgICAgKHMpOiBzIGlzIFNlY3Rpb25JZCA9PiB2YWxpZC5pbmNsdWRlcyhzIGFzIFNlY3Rpb25JZCkgJiYgIXNlZW4uaGFzKHMgYXMgU2VjdGlvbklkKSAmJiAoc2Vlbi5hZGQocyBhcyBTZWN0aW9uSWQpLCB0cnVlKVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbGlkKSBpZiAoIXNlZW4uaGFzKHYpKSBjbGVhbmVkLnB1c2godik7XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBjbGVhbmVkO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNldHRpbmdzLmhpZGRlbikpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gW107XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7IGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7IH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgTW9kYWwgZGUgZGV0YWxoZXMgZGEgdGFyZWZhIChkZXNjcmlcdTAwRTdcdTAwRTNvIGNvbSBsaW5rcyBjbGljXHUwMEUxdmVpcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIFRhc2tNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgY29uc3RydWN0b3IoXG4gICAgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSB0YXNrOiBUb2RvaXN0VGFzayxcbiAgICBwcml2YXRlIGNvbXBvbmVudDogQ29tcG9uZW50LFxuICAgIHByaXZhdGUgb25Db21wbGV0ZTogKCkgPT4gdm9pZCxcbiAgKSB7IHN1cGVyKGFwcCk7IH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwsIHRpdGxlRWwsIG1vZGFsRWwgfSA9IHRoaXM7XG4gICAgbW9kYWxFbC5hZGRDbGFzcyhcIndkLXRhc2stbW9kYWxcIik7XG4gICAgdGl0bGVFbC5zZXRUZXh0KHRoaXMudGFzay5jb250ZW50KTtcblxuICAgIGlmIChoYXNEZXNjKHRoaXMudGFzaykpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtZGVzYyBtYXJrZG93bi1yZW5kZXJlZFwiIH0pO1xuICAgICAgLy8gUmVuZGVyaXphIGEgZGVzY3JpXHUwMEU3XHUwMEUzbyBjb21vIG1hcmtkb3duIFx1MjE5MiBsaW5rcyBjbGljXHUwMEUxdmVpcyAoYWJyZW0gbm8gbmF2ZWdhZG9yKS5cbiAgICAgIHZvaWQgTWFya2Rvd25SZW5kZXJlci5yZW5kZXIodGhpcy5hcHAsIHRoaXMudGFzay5kZXNjcmlwdGlvbiEudHJpbSgpLCBib2R5LCBcIlwiLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBjbHM6IFwid2QtdGFzay1tb2RhbC1lbXB0eVwiLCB0ZXh0OiBcIkVzdGEgdGFyZWZhIG5cdTAwRTNvIHRlbSBkZXNjcmlcdTAwRTdcdTAwRTNvLlwiIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRhc2stbW9kYWwtYWN0aW9uc1wiIH0pO1xuICAgIGNvbnN0IG9wZW4gPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJBYnJpciBubyBUb2RvaXN0XCIgfSk7XG4gICAgb3Blbi5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0aGlzLnRhc2spLCBcIl9ibGFua1wiKTtcbiAgICBjb25zdCBkb25lID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiXHUyNzEzIENvbmNsdWlyXCIsIGNsczogXCJtb2QtY3RhXCIgfSk7XG4gICAgZG9uZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm9uQ29tcGxldGUoKTsgdGhpcy5jbG9zZSgpOyB9O1xuICB9XG5cbiAgb25DbG9zZSgpIHsgdGhpcy5jb250ZW50RWwuZW1wdHkoKTsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgQWJhIGRlIGNvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBXZXJ1c1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBXZXJ1c0Rhc2hib2FyZCkgeyBzdXBlcihhcHAsIHBsdWdpbik7IH1cblxuICBkaXNwbGF5KCkge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJJbnRlZ3JhXHUwMEU3XHUwMEUzbyBUb2RvaXN0XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9rZW4gZGEgQVBJXCIpXG4gICAgICAuc2V0RGVzYyhcIlRvZG9pc3QgXHUyMTkyIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBJbnRlZ3JhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFRva2VuIGRlIEFQSSBkbyBkZXNlbnZvbHZlZG9yLiBTYWx2byBsb2NhbG1lbnRlIGVtIGRhdGEuanNvbiAoblx1MDBFM28gdmFpIHBhcmEgbyBHaXQpLlwiKVxuICAgICAgLmFkZFRleHQodCA9PiB7XG4gICAgICAgIHQuc2V0UGxhY2Vob2xkZXIoXCJjb2xlIG8gdG9rZW4gYXF1aVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuID0gdi50cmltKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hEYXNoYm9hcmRzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHQuaW5wdXRFbC50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgICAgICB0LmlucHV0RWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIH0pO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBaUs7QUFFakssSUFBTSxZQUFZO0FBYWxCLElBQU0sbUJBQWlDO0FBQUEsRUFDckMsY0FBYyxDQUFDLFNBQVMsV0FBVyxRQUFRLFdBQVcsVUFBVSxXQUFXLFVBQVU7QUFBQSxFQUNyRixTQUFTO0FBQUEsRUFDVCxRQUFRLENBQUM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLGNBQWM7QUFDaEI7QUFXQSxJQUFNLE9BQXNCO0FBQUEsRUFDMUIsRUFBRSxRQUFRLFlBQWdCLE1BQU0sYUFBTSxPQUFPLFNBQVksUUFBUSxVQUFVO0FBQUEsRUFDM0UsRUFBRSxRQUFRLGVBQWdCLE1BQU0sYUFBTSxPQUFPLFlBQVksUUFBUSxVQUFVO0FBQUEsRUFDM0UsRUFBRSxRQUFRLFlBQWdCLE1BQU0sYUFBTSxPQUFPLFlBQVksUUFBUSxVQUFVO0FBQUEsRUFDM0UsRUFBRSxRQUFRLGdCQUFnQixNQUFNLGFBQU0sT0FBTyxZQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUsUUFBUSxjQUFnQixNQUFNLG1CQUFRLE9BQU8sV0FBWSxRQUFRLFVBQVU7QUFDL0U7QUFDQSxJQUFNLFdBQVcsSUFBSSxJQUFJLEtBQUssSUFBSSxPQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBR3JELElBQU0sVUFBVSxDQUFDLFdBQVUsV0FBVSxXQUFVLFdBQVUsV0FBVSxXQUFVLFdBQVUsU0FBUztBQUVoRyxJQUFNLFlBQVksQ0FBQyxPQUFPLE9BQU8sT0FBTyxPQUFPLE9BQU8sVUFBTyxLQUFLO0FBQ2xFLElBQU0sY0FBYyxDQUFDLE9BQU0sT0FBTSxP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
