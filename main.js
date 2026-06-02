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
function dueKey(t) {
  var _a, _b, _c;
  const d = (_c = (_a = t.due) == null ? void 0 : _a.date) != null ? _c : (_b = t.due) == null ? void 0 : _b.datetime;
  return d ? d.substring(0, 10) : null;
}
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
function notesIn(folder) {
  return folder.children.filter(
    (c) => c instanceof import_obsidian.TFile && c.extension === "md" && c.name !== "status.md"
  ).sort((a, b) => a.basename.localeCompare(b.basename, "pt"));
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
      (0, import_obsidian.setIcon)(chip.createSpan({ cls: "wd-chip-icon" }), "eye");
      chip.createSpan({ text: this.hiddenLabel(key) });
      chip.setAttr("title", "Mostrar novamente");
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
    const rect = target.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    if (top + th > window.innerHeight - 8) top = rect.top - th - 6;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
    this.tip = tip;
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
      const navigable = subFolders(folder).length > 0 || notesIn(folder).length > 0;
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
    const rootFiles = notesIn(vaultRoot);
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
        if (cover) card.createDiv({ cls: "wd-cover" }).createEl("img", { attr: { src: cover, draggable: "false" } });
        card.createDiv({ cls: `wd-badge wd-badge-${status}`, text: STATUS_ICON[status] });
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
    const notes = notesIn(folder);
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
        const st = readNoteStatus(this.app, f);
        const rv = ((_b = (_a = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.reviewed) === true;
        const card = grid.createDiv({ cls: `wd-note-card wd-s-${st}` });
        card.createDiv({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "N\xE3o revisada");
        const name = card.createDiv({ cls: "wd-note-card-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        card.createDiv({ cls: "wd-note-card-date", text: fmtShort(f.stat.mtime) });
        if (st !== "cancelled") card.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
      }
    } else {
      const list = parent.createDiv({ cls: "wd-note-list" });
      for (const f of filtered) {
        const st = readNoteStatus(this.app, f);
        const rv = ((_d = (_c = this.app.metadataCache.getCache(f.path)) == null ? void 0 : _c.frontmatter) == null ? void 0 : _d.reviewed) === true;
        const row = list.createDiv({ cls: `wd-note-row wd-s-${st}` });
        row.createSpan({ cls: `wd-note-dot wd-badge-${st}` });
        const name = row.createSpan({ cls: "wd-note-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        row.createSpan({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "N\xE3o revisada");
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
  // Chip compacto de tarefa (na grade semanal).
  todoChip(col, t) {
    var _a;
    const pri = priMeta(t.priority);
    const chip = col.createDiv({ cls: "wd-todo-chip" });
    chip.style.setProperty("--pri", pri.color);
    if ((_a = t.due) == null ? void 0 : _a.is_recurring) chip.createSpan({ cls: "wd-todo-recur", text: "\u27F3" });
    chip.createSpan({ cls: "wd-todo-chip-txt", text: t.content });
    chip.setAttr("title", `${pri.label} \xB7 ${t.content}`);
    chip.onclick = () => window.open(taskUrl(t), "_blank");
  }
  // Linha de tarefa (no painel de atrasadas).
  todoRow(list, t) {
    var _a;
    const pri = priMeta(t.priority);
    const row = list.createDiv({ cls: "wd-todo-row" });
    const tag = row.createSpan({ cls: "wd-todo-pri", text: pri.label });
    tag.style.background = pri.color;
    row.createSpan({ cls: "wd-todo-row-txt", text: t.content });
    const dk = dueKey(t);
    if (dk) {
      const [, m, d] = dk.split("-");
      row.createSpan({ cls: "wd-todo-row-date", text: `${d}/${m}` });
    }
    if ((_a = t.due) == null ? void 0 : _a.is_recurring) row.createSpan({ cls: "wd-todo-recur", text: "\u27F3" });
    row.setAttr("title", "Abrir no Todoist");
    row.onclick = () => window.open(taskUrl(t), "_blank");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBJdGVtVmlldywgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgcmVxdWVzdFVybCwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuXG50eXBlIFN0YXR1cyA9IFwicHJvZ3Jlc3NcIiB8IFwicGF1c2VkXCIgfCBcImNhbmNlbGxlZFwiO1xudHlwZSBTZWN0aW9uSWQgPSBcImNhbGVuZGFyXCIgfCBcInBhcmFcIiB8IFwicmVwb3J0c1wiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiIHwgXCJ0b2RvaXN0XCI7XG5cbmludGVyZmFjZSBEYXNoU2V0dGluZ3Mge1xuICBzZWN0aW9uT3JkZXI6IFNlY3Rpb25JZFtdO1xuICBjb21wYWN0OiBib29sZWFuO1xuICBoaWRkZW46IHN0cmluZ1tdOyAgIC8vIGNhbWluaG9zIGRlIHBhc3RhIG9jdWx0b3MgKyBcInNlYzpjYWxlbmRhclwiIC8gXCJzZWM6cmVwb3J0c1wiXG4gIG5vdGVWaWV3OiBcImxpc3RcIiB8IFwiZ3JpZFwiO1xuICB0b2RvaXN0VG9rZW46IHN0cmluZztcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogRGFzaFNldHRpbmdzID0ge1xuICBzZWN0aW9uT3JkZXI6IFtcInN0YXRzXCIsIFwidG9kb2lzdFwiLCBcInBhcmFcIiwgXCJoZWF0bWFwXCIsIFwiZ3Jvd3RoXCIsIFwicmVwb3J0c1wiLCBcImNhbGVuZGFyXCJdLFxuICBjb21wYWN0OiBmYWxzZSxcbiAgaGlkZGVuOiBbXSxcbiAgbm90ZVZpZXc6IFwibGlzdFwiLFxuICB0b2RvaXN0VG9rZW46IFwiXCIsXG59O1xuXG5pbnRlcmZhY2UgUGFyYVNlY3Rpb24ge1xuICBmb2xkZXI6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBhY2NlbnQ6IHN0cmluZztcbn1cblxuLy8gUGFzdGFzIFwiY29uaGVjaWRhc1wiIGRvIFBBUkE6IG1hbnRcdTAwRUFtIFx1MDBFRGNvbmUsIHJcdTAwRjN0dWxvIGUgY29yIGZpeG9zLiBBcyBkZW1haXMgcGFzdGFzXG4vLyBkbyBjb2ZyZSBzXHUwMEUzbyByZW5kZXJpemFkYXMgY29tIGNvciBhdXRvbVx1MDBFMXRpY2EgZSBcdTAwRURjb25lIHBhZHJcdTAwRTNvIChvdSBvIGljb246IGRvIHN0YXR1cy5tZCkuXG5jb25zdCBQQVJBOiBQYXJhU2VjdGlvbltdID0gW1xuICB7IGZvbGRlcjogXCIwMC5JbmJveFwiLCAgICAgaWNvbjogXCJcdUQ4M0RcdURDRTVcIiwgbGFiZWw6IFwiSW5ib3hcIiwgICAgYWNjZW50OiBcIiM2MzY2RjFcIiB9LFxuICB7IGZvbGRlcjogXCIxMC5Qcm9qZWN0c1wiLCAgaWNvbjogXCJcdUQ4M0RcdURFODBcIiwgbGFiZWw6IFwiUHJvamV0b3NcIiwgYWNjZW50OiBcIiMxMEI5ODFcIiB9LFxuICB7IGZvbGRlcjogXCIyMC5BcmVhc1wiLCAgICAgaWNvbjogXCJcdUQ4M0NcdURGQUZcIiwgbGFiZWw6IFwiXHUwMEMxcmVhc1wiLCAgICBhY2NlbnQ6IFwiI0Y1OUUwQlwiIH0sXG4gIHsgZm9sZGVyOiBcIjMwLlJlc291cmNlc1wiLCBpY29uOiBcIlx1RDgzRFx1RENEQVwiLCBsYWJlbDogXCJSZWN1cnNvc1wiLCBhY2NlbnQ6IFwiIzNCODJGNlwiIH0sXG4gIHsgZm9sZGVyOiBcIjQwLkFyY2hpdmVcIiwgICBpY29uOiBcIlx1RDgzRFx1RERDNFx1RkUwRlwiLCAgbGFiZWw6IFwiQXJxdWl2b1wiLCAgYWNjZW50OiBcIiM2QjcyODBcIiB9LFxuXTtcbmNvbnN0IFBBUkFfTUFQID0gbmV3IE1hcChQQVJBLm1hcChwID0+IFtwLmZvbGRlciwgcF0pKTtcblxuLy8gUGFsZXRhIHBhcmEgY29sb3JpciBwYXN0YXMgZGVzY29uaGVjaWRhcyBkZSBmb3JtYSBlc3RcdTAwRTF2ZWwgKHBvciBoYXNoIGRvIG5vbWUpLlxuY29uc3QgQUNDRU5UUyA9IFtcIiM2MzY2RjFcIixcIiMxMEI5ODFcIixcIiNGNTlFMEJcIixcIiMzQjgyRjZcIixcIiNFQzQ4OTlcIixcIiM4QjVDRjZcIixcIiMxNEI4QTZcIixcIiNFRjQ0NDRcIl07XG5cbmNvbnN0IERBWV9TSE9SVCA9IFtcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNcdTAwRTFiXCIsIFwiRG9tXCJdO1xuY29uc3QgTU9OVEhfU0hPUlQgPSBbXCJKYW5cIixcIkZldlwiLFwiTWFyXCIsXCJBYnJcIixcIk1haVwiLFwiSnVuXCIsXCJKdWxcIixcIkFnb1wiLFwiU2V0XCIsXCJPdXRcIixcIk5vdlwiLFwiRGV6XCJdO1xuY29uc3QgSU1HX0VYVCA9IFtcInBuZ1wiLFwianBnXCIsXCJqcGVnXCIsXCJ3ZWJwXCIsXCJnaWZcIixcInN2Z1wiXTtcblxuLy8gUGFzdGEgcmFpeiBkYXMgbm90YXMgZGlcdTAwRTFyaWFzIChjcmlhZGFzIGFvIGNsaWNhciBudW0gZGlhIGRvIGNhbGVuZFx1MDBFMXJpbykuXG5jb25zdCBEQUlMWV9GT0xERVIgPSBcIjUwLkRpXHUwMEUxcmlvXCI7XG4vLyBUZW1wbGF0ZSBvcGNpb25hbDsgcGxhY2Vob2xkZXJzIHt7ZGF0ZX19IChZWVlZLU1NLUREKSBlIHt7dGl0bGV9fSAoZGF0YSBwb3IgZXh0ZW5zbykuXG5jb25zdCBEQUlMWV9URU1QTEFURSA9IFwiTW9kZWxvcy9Ob3RhIERpXHUwMEUxcmlhLm1kXCI7XG5cbmNvbnN0IFNUQVRVU19JQ09OOiBSZWNvcmQ8U3RhdHVzLCBzdHJpbmc+ID0ge1xuICBwcm9ncmVzczogXCJcdTI1QjZcIiwgcGF1c2VkOiBcIlx1MjNGOFwiLCBjYW5jZWxsZWQ6IFwiXHUyNzE1XCIsXG59O1xuXG5jb25zdCBTRUNfQ0FMID0gXCJzZWM6Y2FsZW5kYXJcIjtcbmNvbnN0IFNFQ19SRVAgPSBcInNlYzpyZXBvcnRzXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5jb25zdCBTRUNfVE9ETyA9IFwic2VjOnRvZG9pc3RcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRvZG9pc3QgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBUb2RvaXN0VGFzayB7XG4gIGlkOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7ICAgLy8gQVBJOiAxLi40LCBvbmRlIDQgPSB1cmdlbnRlICg9IHAxIG5hIFVJKVxuICBkdWU/OiB7IGRhdGU6IHN0cmluZzsgZGF0ZXRpbWU/OiBzdHJpbmc7IHN0cmluZz86IHN0cmluZzsgaXNfcmVjdXJyaW5nPzogYm9vbGVhbiB9IHwgbnVsbDtcbiAgcHJvamVjdF9pZD86IHN0cmluZztcbiAgaXNfY29tcGxldGVkPzogYm9vbGVhbjtcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIHVybD86IHN0cmluZztcbn1cblxuLy8gUHJpb3JpZGFkZSBkYSBBUEkgKDQ9dXJnZW50ZSkgXHUyMTkyIHJcdTAwRjN0dWxvL2NvciBkYSBVSSAocDE9dmVybWVsaG8gXHUyMDI2IHA0PWNpbnphKS5cbmNvbnN0IFRPRE9JU1RfUFJJOiBSZWNvcmQ8bnVtYmVyLCB7IGxhYmVsOiBzdHJpbmc7IGNvbG9yOiBzdHJpbmcgfT4gPSB7XG4gIDQ6IHsgbGFiZWw6IFwicDFcIiwgY29sb3I6IFwiI0VGNDQ0NFwiIH0sXG4gIDM6IHsgbGFiZWw6IFwicDJcIiwgY29sb3I6IFwiI0Y1OUUwQlwiIH0sXG4gIDI6IHsgbGFiZWw6IFwicDNcIiwgY29sb3I6IFwiIzNCODJGNlwiIH0sXG4gIDE6IHsgbGFiZWw6IFwicDRcIiwgY29sb3I6IFwiIzZCNzI4MFwiIH0sXG59O1xuZnVuY3Rpb24gcHJpTWV0YShwOiBudW1iZXIpIHsgcmV0dXJuIFRPRE9JU1RfUFJJW3BdID8/IFRPRE9JU1RfUFJJWzFdOyB9XG5cbi8vIEJ1c2NhIGFzIHRhcmVmYXMgYXRpdmFzIChuXHUwMEUzbyBjb25jbHVcdTAwRURkYXMpIHZpYSBBUEkgdW5pZmljYWRhIHYxIChhIFJFU1QgdjIgZm9pXG4vLyBhcG9zZW50YWRhIFx1MjE5MiByZXNwb25kaWEgNDEwKS4gQSB2MSBcdTAwRTkgcGFnaW5hZGE6IHsgcmVzdWx0cywgbmV4dF9jdXJzb3IgfS5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoVG9kb2lzdFRhc2tzKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFRvZG9pc3RUYXNrW10+IHtcbiAgY29uc3QgYWxsOiBUb2RvaXN0VGFza1tdID0gW107XG4gIGxldCBjdXJzb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBkbyB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChcImh0dHBzOi8vYXBpLnRvZG9pc3QuY29tL2FwaS92MS90YXNrc1wiKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChcImxpbWl0XCIsIFwiMjAwXCIpO1xuICAgIGlmIChjdXJzb3IpIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiY3Vyc29yXCIsIGN1cnNvcik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0VXJsKHtcbiAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0sXG4gICAgICB0aHJvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHRocm93IG5ldyBFcnJvcihcInRva2VuIGludlx1MDBFMWxpZG8gKDQwMS80MDMpXCIpO1xuICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9YCk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzLmpzb24gYXMgeyByZXN1bHRzPzogVG9kb2lzdFRhc2tbXTsgbmV4dF9jdXJzb3I/OiBzdHJpbmcgfCBudWxsIH07XG4gICAgLy8gdjEgZW52ZWxvcGEgZW0gcmVzdWx0czsgdG9sZXJhIHJlc3Bvc3RhIGNvbW8gYXJyYXkgcHVybyBwb3Igc2VndXJhblx1MDBFN2EuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsgYWxsLnB1c2goLi4uKGRhdGEgYXMgVG9kb2lzdFRhc2tbXSkpOyBjdXJzb3IgPSBudWxsOyB9XG4gICAgZWxzZSB7IGFsbC5wdXNoKC4uLihkYXRhLnJlc3VsdHMgPz8gW10pKTsgY3Vyc29yID0gZGF0YS5uZXh0X2N1cnNvciA/PyBudWxsOyB9XG4gIH0gd2hpbGUgKGN1cnNvcik7XG4gIHJldHVybiBhbGw7XG59XG5cbi8vIFVSTCBwYXJhIGFicmlyIGEgdGFyZWZhIG5vIFRvZG9pc3QgKHVzYSBhIGRvIHBheWxvYWQgb3UgbW9udGEgYSBwYXJ0aXIgZG8gaWQpLlxuZnVuY3Rpb24gdGFza1VybCh0OiBUb2RvaXN0VGFzayk6IHN0cmluZyB7XG4gIHJldHVybiB0LnVybCA/PyBgaHR0cHM6Ly9hcHAudG9kb2lzdC5jb20vYXBwL3Rhc2svJHt0LmlkfWA7XG59XG5cbi8vIERhdGEgZGUgdmVuY2ltZW50byAoWVlZWS1NTS1ERCkgZGUgdW1hIHRhcmVmYSwgb3UgbnVsbCBzZSBzZW0gZHVlLlxuZnVuY3Rpb24gZHVlS2V5KHQ6IFRvZG9pc3RUYXNrKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGQgPSB0LmR1ZT8uZGF0ZSA/PyB0LmR1ZT8uZGF0ZXRpbWU7XG4gIHJldHVybiBkID8gZC5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuLy8gRnVuXHUwMEU3XHUwMEUzbyBnbG9iYWwgZXhwb3N0YSBwZWxvIHBsdWdpbiBcIkhlYXRtYXAgQ2FsZW5kYXJcIiAocXVhbmRvIGhhYmlsaXRhZG8pLlxudHlwZSBIZWF0bWFwRW50cnkgPSB7IGRhdGU6IHN0cmluZzsgaW50ZW5zaXR5PzogbnVtYmVyOyBjb2xvcj86IHN0cmluZzsgY29udGVudD86IHN0cmluZyB9O1xudHlwZSBIZWF0bWFwRGF0YSA9IHtcbiAgeWVhcjogbnVtYmVyO1xuICBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgZW50cmllczogSGVhdG1hcEVudHJ5W107XG4gIHNob3dDdXJyZW50RGF5Qm9yZGVyPzogYm9vbGVhbjtcbn07XG5mdW5jdGlvbiBnZXRIZWF0bWFwUmVuZGVyZXIoKTogKChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IEhlYXRtYXBEYXRhKSA9PiB2b2lkKSB8IG51bGwge1xuICBjb25zdCBmbiA9ICh3aW5kb3cgYXMgdW5rbm93biBhcyB7IHJlbmRlckhlYXRtYXBDYWxlbmRhcj86IHVua25vd24gfSkucmVuZGVySGVhdG1hcENhbGVuZGFyO1xuICByZXR1cm4gdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIgPyAoZm4gYXMgKGVsOiBIVE1MRWxlbWVudCwgZGF0YTogSGVhdG1hcERhdGEpID0+IHZvaWQpIDogbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgZGF0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gaXNvV2Vla051bWJlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSkpO1xuICBjb25zdCBkb3cgPSBkLmdldFVUQ0RheSgpIHx8IDc7XG4gIGQuc2V0VVRDRGF0ZShkLmdldFVUQ0RhdGUoKSArIDQgLSBkb3cpO1xuICBjb25zdCB5MCA9IG5ldyBEYXRlKERhdGUuVVRDKGQuZ2V0VVRDRnVsbFllYXIoKSwgMCwgMSkpO1xuICByZXR1cm4gTWF0aC5jZWlsKCgoZC5nZXRUaW1lKCkgLSB5MC5nZXRUaW1lKCkpIC8gODZfNDAwXzAwMCArIDEpIC8gNyk7XG59XG5cbmZ1bmN0aW9uIG1vbmRheU9mKG9mZnNldDogbnVtYmVyKTogRGF0ZSB7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGRvdyA9IG5vdy5nZXREYXkoKSB8fCA3O1xuICBjb25zdCBkID0gbmV3IERhdGUobm93KTtcbiAgZC5zZXREYXRlKG5vdy5nZXREYXRlKCkgLSBkb3cgKyAxICsgb2Zmc2V0ICogNyk7XG4gIGQuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiB0b0tleShkOiBEYXRlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2QuZ2V0RnVsbFllYXIoKX0tJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfS0ke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRGF0ZSh2YWw6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbC5zdWJzdHJpbmcoMCwgMTApO1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHZhbC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsKTtcbiAgcmV0dXJuIHMubWF0Y2goL15cXGR7NH0tXFxkezJ9LVxcZHsyfS8pID8gcy5zdWJzdHJpbmcoMCwgMTApIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9kYXlCUigpOiBzdHJpbmcge1xuICByZXR1cm4gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gIH0pO1xufVxuXG4vLyBkZC9tbSBhIHBhcnRpciBkZSB1bSB0aW1lc3RhbXAgKG10aW1lKVxuZnVuY3Rpb24gZm10U2hvcnQodHM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSh0cyk7XG4gIHJldHVybiBgJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfS8ke1N0cmluZyhkLmdldE1vbnRoKCkrMSkucGFkU3RhcnQoMixcIjBcIil9YDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFV0aWxpZGFkZXMgZGUgcGFzdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8vIENvbnRhIG5vdGFzIHJldmlzYWRhcyAocmV2aWV3ZWQ6IHRydWUpIHZzIHRvdGFsIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIHJldmlld2VkU3RhdHMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHsgcmV2aWV3ZWQ6IG51bWJlcjsgdG90YWw6IG51bWJlciB9IHtcbiAgbGV0IHJldmlld2VkID0gMCwgdG90YWwgPSAwO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikge1xuICAgICAgICB0b3RhbCsrO1xuICAgICAgICBpZiAoYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoYy5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlKSByZXZpZXdlZCsrO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgcmV0dXJuIHsgcmV2aWV3ZWQsIHRvdGFsIH07XG59XG5cbi8vIENvbnRhIG1kIChleGNldG8gc3RhdHVzLm1kKSBlIGltYWdlbnMgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gZm9sZGVyU3RhdHMoZm9sZGVyOiBURm9sZGVyKTogeyBtZDogbnVtYmVyOyBpbWc6IG51bWJlciB9IHtcbiAgbGV0IG1kID0gMCwgaW1nID0gMDtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgaWYgKGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiKSBtZCsrO1xuICAgICAgICBlbHNlIGlmIChJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSkgaW1nKys7XG4gICAgICB9IGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICByZXR1cm4geyBtZCwgaW1nIH07XG59XG5cbi8vIFRleHRvIGRlIGNvbnRhZ2VtIHBhZHJvbml6YWRvIHBhcmEgb3MgY2FyZHMgKG5vdGFzICsgaW1hZ2VucywgcXVhbmRvIGhvdXZlcikuXG5mdW5jdGlvbiBjb3VudFRleHQoc3RhdHM6IHsgbWQ6IG51bWJlcjsgaW1nOiBudW1iZXIgfSk6IHN0cmluZyB7XG4gIGlmIChzdGF0cy5tZCA9PT0gMCAmJiBzdGF0cy5pbWcgPiAwKSByZXR1cm4gYCR7c3RhdHMuaW1nfSBpbWdgO1xuICByZXR1cm4gc3RhdHMuaW1nID4gMCA/IGAke3N0YXRzLm1kfSBub3RhcyBcdTAwQjcgJHtzdGF0cy5pbWd9IGltZ2AgOiBgJHtzdGF0cy5tZH0gbm90YXNgO1xufVxuXG4vLyBBcyBOIG5vdGFzIC5tZCBtb2RpZmljYWRhcyBtYWlzIHJlY2VudGVtZW50ZSBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiByZWNlbnROb3Rlcyhmb2xkZXI6IFRGb2xkZXIsIG46IG51bWJlcik6IFRGaWxlW10ge1xuICBjb25zdCBmaWxlczogVEZpbGVbXSA9IFtdO1xuICBjb25zdCB3YWxrID0gKGY6IFRGb2xkZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZi5jaGlsZHJlbikge1xuICAgICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikgZmlsZXMucHVzaChjKTtcbiAgICAgIGVsc2UgaWYgKGMgaW5zdGFuY2VvZiBURm9sZGVyKSB3YWxrKGMpO1xuICAgIH1cbiAgfTtcbiAgd2Fsayhmb2xkZXIpO1xuICBmaWxlcy5zb3J0KChhLCBiKSA9PiBiLnN0YXQubXRpbWUgLSBhLnN0YXQubXRpbWUpO1xuICByZXR1cm4gZmlsZXMuc2xpY2UoMCwgbik7XG59XG5cbi8vIFBhc3RhIFwiZGUgYXNzZXRzXCI6IHNcdTAwRjMgdGVtIGltYWdlbnMsIG5lbmh1bWEgbm90YSBcdTIxOTIgZXNjb25kaWRhIG5vIG5hdmVnYWRvciBpbnRlcm5vLlxuZnVuY3Rpb24gaXNBc3NldEZvbGRlcihmb2xkZXI6IFRGb2xkZXIpOiBib29sZWFuIHtcbiAgY29uc3QgeyBtZCwgaW1nIH0gPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICByZXR1cm4gaW1nID4gMCAmJiBtZCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gc3ViRm9sZGVycyhmb2xkZXI6IFRGb2xkZXIpOiBURm9sZGVyW10ge1xuICByZXR1cm4gKGZvbGRlci5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgIC5maWx0ZXIoZiA9PiAhaXNBc3NldEZvbGRlcihmKSlcbiAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcbn1cblxuZnVuY3Rpb24gbm90ZXNJbihmb2xkZXI6IFRGb2xkZXIpOiBURmlsZVtdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKFxuICAgIGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMuZXh0ZW5zaW9uID09PSBcIm1kXCIgJiYgYy5uYW1lICE9PSBcInN0YXR1cy5tZFwiXG4gICkgYXMgVEZpbGVbXSkuc29ydCgoYSwgYikgPT4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUsIFwicHRcIikpO1xufVxuXG5mdW5jdGlvbiBjb3ZlckluRm9sZGVyKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gMS4gQ2FtcG8gY292ZXI6IG5vIHN0YXR1cy5tZCAoYWNlaXRhIGNhbWluaG8gZGlyZXRvIG91IHdpa2lsaW5rIFtbLi4uXV0pXG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgaWYgKHNmKSB7XG4gICAgY29uc3QgcmF3ID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5jb3ZlcjtcbiAgICBpZiAodHlwZW9mIHJhdyA9PT0gXCJzdHJpbmdcIiAmJiByYXcudHJpbSgpKSB7XG4gICAgICBjb25zdCBsaW5rcGF0aCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiE/XFxbXFxbLywgXCJcIikucmVwbGFjZSgvXFxdXFxdJC8sIFwiXCIpLnNwbGl0KFwifFwiKVswXS50cmltKCk7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmtwYXRoLCBzZi5wYXRoKTtcbiAgICAgIGlmIChyZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlICYmIElNR19FWFQuaW5jbHVkZXMocmVzb2x2ZWQuZXh0ZW5zaW9uKSlcbiAgICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgocmVzb2x2ZWQpO1xuICAgIH1cbiAgfVxuICAvLyAyLiBGYWxsYmFjazogYXJxdWl2byBfY292ZXIuKiBuYSBwYXN0YVxuICBmb3IgKGNvbnN0IGMgb2YgZm9sZGVyLmNoaWxkcmVuKSB7XG4gICAgaWYgKGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmJhc2VuYW1lID09PSBcIl9jb3ZlclwiICYmIElNR19FWFQuaW5jbHVkZXMoYy5leHRlbnNpb24pKVxuICAgICAgcmV0dXJuIGFwcC52YXVsdC5nZXRSZXNvdXJjZVBhdGgoYyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHJlYWRGb2xkZXJTdGF0dXMoYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IFN0YXR1cyB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgcyA9IHNmICYmIGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuZnVuY3Rpb24gcmVhZE5vdGVTdGF0dXMoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogU3RhdHVzIHtcbiAgY29uc3QgcyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGZpbGUucGF0aCk/LmZyb250bWF0dGVyPy5zdGF0dXM7XG4gIHJldHVybiBzID09PSBcInBhdXNlZFwiIHx8IHMgPT09IFwiY2FuY2VsbGVkXCIgPyBzIDogXCJwcm9ncmVzc1wiO1xufVxuXG4vLyBcdTAwQ0Rjb25lIGRlZmluaWRvIGVtIGBpY29uOmAgbm8gc3RhdHVzLm1kIGRhIHBhc3RhIChlbW9qaSBvdSBpZCBMdWNpZGUpLiBudWxsIHNlIGF1c2VudGUuXG5mdW5jdGlvbiByZWFkRm9sZGVySWNvbihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNmID0gZm9sZGVyLmNoaWxkcmVuLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBhcyBURmlsZSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgaWMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/Lmljb247XG4gIHJldHVybiB0eXBlb2YgaWMgPT09IFwic3RyaW5nXCIgJiYgaWMudHJpbSgpID8gaWMudHJpbSgpIDogbnVsbDtcbn1cblxuLy8gaWQgTHVjaWRlIChzXHUwMEYzIFthLXowLTktXSkgXHUyMTkyIHNldEljb24gbmF0aXZvOyBjYXNvIGNvbnRyXHUwMEUxcmlvIHRyYXRhIGNvbW8gZW1vamkvdGV4dG8uXG5mdW5jdGlvbiByZW5kZXJJY29uKGVsOiBIVE1MRWxlbWVudCwgaWNvbjogc3RyaW5nKSB7XG4gIGlmICgvXlthLXowLTktXSskLy50ZXN0KGljb24pKSBzZXRJY29uKGVsLCBpY29uKTtcbiAgZWxzZSBlbC5zZXRUZXh0KGljb24pO1xufVxuXG4vLyBDb3IgZXN0XHUwMEUxdmVsIGEgcGFydGlyIGRvIG5vbWUgKHBhcmEgcGFzdGFzIGZvcmEgZG8gUEFSQSkuXG5mdW5jdGlvbiBhY2NlbnRGb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgbmFtZS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgcmV0dXJuIEFDQ0VOVFNbaCAlIEFDQ0VOVFMubGVuZ3RoXTtcbn1cblxuLy8gXHUwMENEY29uZSAvIHJcdTAwRjN0dWxvIC8gY29yIGRlIHVtYSBwYXN0YSBkZSB0b3BvOiB1c2EgbyBQQVJBIHNlIGNvbmhlY2lkYSwgc2VuXHUwMEUzbyBkZXJpdmEuXG5mdW5jdGlvbiBmb2xkZXJNZXRhKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IGljb246IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgYWNjZW50OiBzdHJpbmcgfSB7XG4gIGNvbnN0IGtub3duID0gUEFSQV9NQVAuZ2V0KGZvbGRlci5wYXRoKTtcbiAgY29uc3QgY3VzdG9tID0gcmVhZEZvbGRlckljb24oYXBwLCBmb2xkZXIpO1xuICByZXR1cm4ge1xuICAgIGljb246ICAgY3VzdG9tID8/IGtub3duPy5pY29uID8/IFwiXHVEODNEXHVEQ0MxXCIsXG4gICAgbGFiZWw6ICBrbm93bj8ubGFiZWwgPz8gZm9sZGVyLm5hbWUsXG4gICAgYWNjZW50OiBrbm93bj8uYWNjZW50ID8/IGFjY2VudEZvcihmb2xkZXIubmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJldmVhbEluRXhwbG9yZXIoYXBwOiBBcHAsIHRhcmdldDogdW5rbm93bikge1xuICB0eXBlIEV4cFBsdWdpbiA9IHsgaW5zdGFuY2U6IHsgcmV2ZWFsSW5Gb2xkZXIoZjogdW5rbm93bik6IHZvaWQgfSB9O1xuICBjb25zdCBleHAgPSAoYXBwIGFzIEFwcCAmIHtcbiAgICBpbnRlcm5hbFBsdWdpbnM6IHsgZ2V0UGx1Z2luQnlJZChpZDogc3RyaW5nKTogRXhwUGx1Z2luIHwgbnVsbCB9O1xuICB9KS5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIik7XG4gIGlmIChleHAgJiYgdGFyZ2V0KSBleHAuaW5zdGFuY2UucmV2ZWFsSW5Gb2xkZXIodGFyZ2V0KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFZpZXcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNsYXNzIERhc2hib2FyZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgd2Vla09mZnNldCA9IDA7XG4gIHByaXZhdGUgbmF2UGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGlwOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNlYXJjaFRlcm0gPSBcIlwiO1xuICBwcml2YXRlIHJldmlld0ZpbHRlciA9IGZhbHNlO1xuICBwcml2YXRlIGdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTtcblxuICAvLyBFc3RhZG8gZGEgaW50ZWdyYVx1MDBFN1x1MDBFM28gVG9kb2lzdFxuICBwcml2YXRlIHRvZG9pc3RUYXNrczogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICBwcml2YXRlIHRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgdG9kb2lzdEVycm9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0b2RvaXN0RmV0Y2hlZEF0ID0gMDtcbiAgcHJpdmF0ZSB0b2RvaXN0T3ZlcmR1ZU9wZW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHsgc3VwZXIobGVhZik7IH1cblxuICBnZXRWaWV3VHlwZSgpICAgIHsgcmV0dXJuIFZJRVdfVFlQRTsgfVxuICBnZXREaXNwbGF5VGV4dCgpIHsgcmV0dXJuIFwiRGFzaGJvYXJkXCI7IH1cbiAgZ2V0SWNvbigpICAgICAgICB7IHJldHVybiBcImxheW91dC1kYXNoYm9hcmRcIjsgfVxuXG4gIGFzeW5jIG9uT3BlbigpIHtcbiAgICBhd2FpdCB0aGlzLnJlbmRlcigpO1xuICAgIGZvciAoY29uc3QgZXYgb2YgW1wibW9kaWZ5XCIsIFwiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwicmVuYW1lXCJdIGFzIGNvbnN0KVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKGV2IGFzIFwibW9kaWZ5XCIsICgpID0+IHRoaXMuc2NoZWR1bGUoKSkpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpIHsgdGhpcy5oaWRlVGlwKCk7IH1cblxuICBwcml2YXRlIHNjaGVkdWxlKCkge1xuICAgIGlmICh0aGlzLnRpbWVyKSBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXIoKSwgNDAwKTtcbiAgfVxuXG4gIC8vIFByaW1laXJvIHNlZ21lbnRvIGRlIHVtIGNhbWluaG8gKFwiMTAuUHJvamVjdHMvRm9vL0JhclwiIFx1MjE5MiBcIjEwLlByb2plY3RzXCIpLlxuICBwcml2YXRlIHRvcEZvbGRlck9mKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgaSA9IHBhdGguaW5kZXhPZihcIi9cIik7XG4gICAgcmV0dXJuIGkgPT09IC0xID8gcGF0aCA6IHBhdGguc2xpY2UoMCwgaSk7XG4gIH1cblxuICBhc3luYyByZW5kZXIoKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICByb290LmFkZENsYXNzKFwid2Qtcm9vdFwiKTtcbiAgICByb290LnRvZ2dsZUNsYXNzKFwid2QtY29tcGFjdFwiLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0KTtcblxuICAgIHRoaXMucmVuZGVySGVhZGVyKHJvb3QpO1xuICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyKSB7XG4gICAgICBpZiAoaWQgPT09IFwiY2FsZW5kYXJcIikgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJwYXJhXCIpICAgIHRoaXMucmVuZGVyUGFyYShyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcImhlYXRtYXBcIikgdGhpcy5yZW5kZXJIZWF0bWFwKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwicmVwb3J0c1wiKSB0aGlzLnJlbmRlclJlcG9ydHMocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJncm93dGhcIikgIHRoaXMucmVuZGVyR3Jvd3RoKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwic3RhdHNcIikgICB0aGlzLnJlbmRlclN0YXRzKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwidG9kb2lzdFwiKSB0aGlzLnJlbmRlclRvZG9pc3Qocm9vdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENvbnRyb2xlcyBkZSBvcmRlbSBkZSBzZVx1MDBFN1x1MDBFM28gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBtb3ZlQ29udHJvbHMoaG9zdDogSFRNTEVsZW1lbnQsIGlkOiBTZWN0aW9uSWQpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcjtcbiAgICBjb25zdCBpID0gb3JkZXIuaW5kZXhPZihpZCk7XG4gICAgY29uc3QgY3RybCA9IGhvc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW1vdmUtY3RybFwiIH0pO1xuXG4gICAgY29uc3QgdXAgPSBjdHJsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtbW92ZS1idG5cIiArIChpIDw9IDAgPyBcIiB3ZC1tb3ZlLW9mZlwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUIyXCIgfSk7XG4gICAgdXAuc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgc2VcdTAwRTdcdTAwRTNvIHBhcmEgY2ltYVwiKTtcbiAgICBpZiAoaSA+IDApIHVwLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5tb3ZlU2VjdGlvbihpZCwgLTEpOyB9O1xuXG4gICAgY29uc3QgZG93biA9IGN0cmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1tb3ZlLWJ0blwiICsgKGkgPj0gb3JkZXIubGVuZ3RoIC0gMSA/IFwiIHdkLW1vdmUtb2ZmXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1QkNcIiB9KTtcbiAgICBkb3duLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vdmVyIHNlXHUwMEU3XHUwMEUzbyBwYXJhIGJhaXhvXCIpO1xuICAgIGlmIChpIDwgb3JkZXIubGVuZ3RoIC0gMSkgZG93bi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMubW92ZVNlY3Rpb24oaWQsICsxKTsgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbW92ZVNlY3Rpb24oaWQ6IFNlY3Rpb25JZCwgZGlyOiBudW1iZXIpIHtcbiAgICBjb25zdCBvcmRlciA9IFsuLi50aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWN0aW9uT3JkZXJdO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaiA+PSBvcmRlci5sZW5ndGgpIHJldHVybjtcbiAgICBbb3JkZXJbaV0sIG9yZGVyW2pdXSA9IFtvcmRlcltqXSwgb3JkZXJbaV1dO1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlciA9IG9yZGVyO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgT2N1bHRhciAvIHJlc3RhdXJhciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIGlzSGlkZGVuKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5pbmNsdWRlcyhrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlQnRuKGhvc3Q6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgdGl0bGU6IHN0cmluZywgY2xzID0gXCJ3ZC1oaWRlLWJ0blwiKSB7XG4gICAgY29uc3QgYiA9IGhvc3QuY3JlYXRlU3Bhbih7IGNscyB9KTtcbiAgICBzZXRJY29uKGIsIFwiZXllLW9mZlwiKTtcbiAgICBiLnNldEF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgYi5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuaGlkZUl0ZW0oa2V5KTsgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGlkZUl0ZW0oa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihrZXkpKSByZXR1cm47XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLnB1c2goa2V5KTtcbiAgICAvLyBTZSBlc3RcdTAwRTF2YW1vcyBkZW50cm8gZGEgcGFzdGEgcXVlIGFjYWJvdSBkZSBzZXIgb2N1bHRhLCBmZWNoYSBvIG5hdmVnYWRvci5cbiAgICBpZiAodGhpcy5uYXZQYXRoICYmICh0aGlzLm5hdlBhdGggPT09IGtleSB8fCB0aGlzLm5hdlBhdGguc3RhcnRzV2l0aChrZXkgKyBcIi9cIikpKSB0aGlzLm5hdlBhdGggPSBudWxsO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVuaGlkZUl0ZW0oa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4uZmlsdGVyKGsgPT4gayAhPT0ga2V5KTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRkZW5MYWJlbChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKGtleSA9PT0gU0VDX0NBTCkgcmV0dXJuIFwiXHVEODNEXHVEQ0M1IENhbGVuZFx1MDBFMXJpb1wiO1xuICAgIGlmIChrZXkgPT09IFNFQ19SRVApIHJldHVybiBcIlx1RDgzRFx1RENDNCBSZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX0hFQVQpIHJldHVybiBcIlx1RDgzRFx1REQyNSBIZWF0bWFwXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX0dST1cpIHJldHVybiBcIlx1RDgzRFx1RENDOCBDcmVzY2ltZW50b1wiO1xuICAgIGlmIChrZXkgPT09IFNFQ19TVEFUKSByZXR1cm4gXCJcdUQ4M0RcdURDQ0EgRXN0YXRcdTAwRURzdGljYXNcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfVE9ETykgcmV0dXJuIFwiXHVEODNEXHVEQ0NCIFRhcmVmYXNcIjtcbiAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGtleSk7XG4gICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURm9sZGVyID8gZi5uYW1lIDoga2V5O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJIaWRkZW5CYXIocGFyZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGhpZGRlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbjtcbiAgICBpZiAoIWhpZGRlbi5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBiYXIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhpZGRlbi1iYXJcIiB9KTtcbiAgICBiYXIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1oaWRkZW4tbGFiZWxcIiwgdGV4dDogXCJvY3VsdG9zOlwiIH0pO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGhpZGRlbikge1xuICAgICAgY29uc3QgY2hpcCA9IGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWhpZGRlbi1jaGlwXCIgfSk7XG4gICAgICBzZXRJY29uKGNoaXAuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jaGlwLWljb25cIiB9KSwgXCJleWVcIik7XG4gICAgICBjaGlwLmNyZWF0ZVNwYW4oeyB0ZXh0OiB0aGlzLmhpZGRlbkxhYmVsKGtleSkgfSk7XG4gICAgICBjaGlwLnNldEF0dHIoXCJ0aXRsZVwiLCBcIk1vc3RyYXIgbm92YW1lbnRlXCIpO1xuICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4gdGhpcy51bmhpZGVJdGVtKGtleSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRvb2x0aXAgZGUgbm90YXMgcmVjZW50ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSBzaG93VGlwKHRhcmdldDogSFRNTEVsZW1lbnQsIGZpbGVzOiBURmlsZVtdKSB7XG4gICAgdGhpcy5oaWRlVGlwKCk7XG4gICAgY29uc3QgdGlwID0gZG9jdW1lbnQuYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9vbHRpcFwiIH0pO1xuICAgIHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXRpdGxlXCIsIHRleHQ6IFwiTW9kaWZpY2FkYXMgcmVjZW50ZW1lbnRlXCIgfSk7XG4gICAgZm9yIChjb25zdCBmIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCByb3cgPSB0aXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRpcC1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10aXAtZGF0ZVwiLCB0ZXh0OiBmbXRTaG9ydChmLnN0YXQubXRpbWUpIH0pO1xuICAgIH1cbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR3ID0gdGlwLm9mZnNldFdpZHRoLCB0aCA9IHRpcC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGxlZnQgPSByZWN0LmxlZnQ7XG4gICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgNjtcbiAgICBpZiAobGVmdCArIHR3ID4gd2luZG93LmlubmVyV2lkdGggLSA4KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0dyAtIDg7XG4gICAgaWYgKHRvcCArIHRoID4gd2luZG93LmlubmVySGVpZ2h0IC0gOCkgdG9wID0gcmVjdC50b3AgLSB0aCAtIDY7ICAvLyB2aXJhIHBhcmEgY2ltYSBzZSBmYWx0YXIgZXNwYVx1MDBFN29cbiAgICB0aXAuc3R5bGUubGVmdCA9IGAke01hdGgubWF4KDgsIGxlZnQpfXB4YDtcbiAgICB0aXAuc3R5bGUudG9wICA9IGAke01hdGgubWF4KDgsIHRvcCl9cHhgO1xuICAgIHRoaXMudGlwID0gdGlwO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVGlwKCkge1xuICAgIGlmICh0aGlzLnRpcCkgeyB0aGlzLnRpcC5yZW1vdmUoKTsgdGhpcy50aXAgPSBudWxsOyB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaFRpcChjYXJkOiBIVE1MRWxlbWVudCwgZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgY29uc3QgcmVjZW50cyA9IHJlY2VudE5vdGVzKGZvbGRlciwgNCk7XG4gICAgaWYgKCFyZWNlbnRzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4gdGhpcy5zaG93VGlwKGNhcmQsIHJlY2VudHMpKTtcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHRoaXMuaGlkZVRpcCgpKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYWxlbmRcdTAwRTFyaW8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJDYWxlbmRhcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19DQUwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtb25kYXkgID0gbW9uZGF5T2YodGhpcy53ZWVrT2Zmc2V0KTtcbiAgICBjb25zdCB3ZWVrTnVtID0gaXNvV2Vla051bWJlcihtb25kYXkpO1xuICAgIGNvbnN0IHRvZGF5SyAgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIGNvbnN0IGJ5RGF5OiBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZzsgZmlsZTogVEZpbGUgfVtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGQgPSBub3JtYWxpemVEYXRlKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZmlsZS5wYXRoKT8uZnJvbnRtYXR0ZXI/LmRhdGUpO1xuICAgICAgaWYgKGQpIChieURheVtkXSA/Pz0gW10pLnB1c2goeyBuYW1lOiBmaWxlLmJhc2VuYW1lLCBmaWxlIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb24gd2QtY2FsLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBuYXYgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYXYtYmFyXCIgfSk7XG4gICAgbmF2LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY2FsLXdlZWstbGFiZWxcIiwgdGV4dDogYFNlbWFuYSAke3dlZWtOdW19YCB9KTtcblxuICAgIGNvbnN0IGN0cmxzID0gbmF2LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtY3RybHNcIiB9KTtcbiAgICBjb25zdCBwcmV2ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwMzlcIiB9KTtcbiAgICBjb25zdCBuZXh0ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtYXJyb3dcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICBwcmV2Lm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMud2Vla09mZnNldC0tOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIG5leHQub25jbGljayA9ICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0Kys7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwiY2FsZW5kYXJcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfQ0FMLCBcIk9jdWx0YXIgY2FsZW5kXHUwMEUxcmlvXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtZ3JpZFwiIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgICAgZGF5LnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIGkpO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZGF5KTtcbiAgICAgIGNvbnN0IGNvbCA9IGdyaWQuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiBbXCJ3ZC1jYWwtY29sXCIsIGtleSA9PT0gdG9kYXlLID8gXCJ3ZC10b2RheVwiIDogXCJcIiwgaSA+PSA1ID8gXCJ3ZC13ZWVrZW5kXCIgOiBcIlwiXVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIiksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhkID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtaGRcIiB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbmFtZVwiLCB0ZXh0OiBEQVlfU0hPUlRbaV0gfSk7XG4gICAgICBoZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW51bVwiLCAgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuICAgICAgaGQuc2V0QXR0cihcInRpdGxlXCIsIFwiQWJyaXIgLyBjcmlhciBub3RhIGRpXHUwMEUxcmlhXCIpO1xuICAgICAgaGQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB2b2lkIHRoaXMub3BlbkRhaWx5Tm90ZShrZXkpOyB9O1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV0gPz8gW107XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zLnNsaWNlKDAsIDMpKSB7XG4gICAgICAgIGNvbnN0IHBpbGwgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1waWxsXCIgfSk7XG4gICAgICAgIHBpbGwudGV4dENvbnRlbnQgPSBpdC5uYW1lLmxlbmd0aCA+IDE0ID8gaXQubmFtZS5zbGljZSgwLCAxNCkgKyBcIlx1MjAyNlwiIDogaXQubmFtZTtcbiAgICAgICAgcGlsbC5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGl0LmZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDMpIGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW1vcmVcIiwgdGV4dDogYCske2l0ZW1zLmxlbmd0aCAtIDN9YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShtb25kYXkpO1xuICAgIGVuZC5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyA2KTtcbiAgICBzZWMuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogXCJ3ZC1jYWwtZm9vdGVyXCIsXG4gICAgICB0ZXh0OiBtb25kYXkuZ2V0TW9udGgoKSA9PT0gZW5kLmdldE1vbnRoKClcbiAgICAgICAgPyBgJHtNT05USF9TSE9SVFttb25kYXkuZ2V0TW9udGgoKV19ICR7bW9uZGF5LmdldEZ1bGxZZWFyKCl9YFxuICAgICAgICA6IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gXHUyMDEzICR7TU9OVEhfU0hPUlRbZW5kLmdldE1vbnRoKCldfSAke2VuZC5nZXRGdWxsWWVhcigpfWAsXG4gICAgfSk7XG4gIH1cblxuICAvLyBBYnJlIGEgbm90YSBkaVx1MDBFMXJpYSBkZSBga2V5YCAoWVlZWS1NTS1ERCk7IGNyaWEgZW0gNTAuRGlcdTAwRTFyaW8vIHNlIG5cdTAwRTNvIGV4aXN0aXIuXG4gIHByaXZhdGUgYXN5bmMgb3BlbkRhaWx5Tm90ZShrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IHBhdGggPSBgJHtEQUlMWV9GT0xERVJ9LyR7a2V5fS5tZGA7XG4gICAgbGV0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG5cbiAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAvLyBHYXJhbnRlIGEgcGFzdGEgcmFpeiAoY2FzbyB0ZW5oYSBzaWRvIHJlbW92aWRhKS5cbiAgICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX0ZPTERFUikpXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihEQUlMWV9GT0xERVIpLmNhdGNoKCgpID0+IHt9KTtcblxuICAgICAgY29uc3QgW3ksIG0sIGRdID0ga2V5LnNwbGl0KFwiLVwiKTtcbiAgICAgIGNvbnN0IHRpdHVsbyA9IG5ldyBEYXRlKCt5LCArbSAtIDEsICtkKS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1CUlwiLCB7XG4gICAgICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFVzYSBvIHRlbXBsYXRlIGVtIE1vZGVsb3MvIHNlIGV4aXN0aXI7IHNlblx1MDBFM28sIGZhbGxiYWNrIGVtYnV0aWRvLlxuICAgICAgY29uc3QgdHBsID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKERBSUxZX1RFTVBMQVRFKTtcbiAgICAgIGxldCBib2R5OiBzdHJpbmc7XG4gICAgICBpZiAodHBsIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgYm9keSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKHRwbCkpXG4gICAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccypkYXRlXFxzKlxcfVxcfS9nLCBrZXkpXG4gICAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyp0aXRsZVxccypcXH1cXH0vZywgdGl0dWxvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPVxuYC0tLVxub3duZXI6IFdlcnVzXG5jcmVhdGVkOiAke2tleX1cbmRhdGU6ICR7a2V5fVxucmV2aWV3ZWQ6IHRydWVcbnR5cGU6IGRhaWx5XG5wZXJtaXNzaW9uczpcbiAgcmVhZDogW2FsbF1cbiAgd3JpdGU6XG4gICAgLSBXZXJ1c1xuLS0tXG5cbiMgJHt0aXR1bG99XG5cbmA7XG4gICAgICB9XG4gICAgICBmaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKHBhdGgsIGJvZHkpO1xuICAgIH1cblxuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmaWxlKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkcyBkbyBjb2ZyZSAodG9kYXMgYXMgcGFzdGFzIGRlIHRvcG8pICsgbmF2ZWdhZG9yIGFuaW5oYWRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyUGFyYShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNPRlJFXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoaGVhZCwgXCJwYXJhXCIpO1xuXG4gICAgY29uc3QgZ3JpZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcGFyYS1ncmlkXCIgfSk7XG4gICAgY29uc3QgdmF1bHRSb290ID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgIGNvbnN0IGZvbGRlcnMgPSAodmF1bHRSb290LmNoaWxkcmVuLmZpbHRlcihjID0+IGMgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW10pXG4gICAgICAuZmlsdGVyKGYgPT4gIWYubmFtZS5zdGFydHNXaXRoKFwiLlwiKSkgICAvLyBpZ25vcmEgLm9ic2lkaWFuLCAudHJhc2gsIGV0Yy5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIFwicHRcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVJvb3QgPSB0aGlzLm5hdlBhdGggPyB0aGlzLnRvcEZvbGRlck9mKHRoaXMubmF2UGF0aCkgOiBudWxsO1xuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oZm9sZGVyLnBhdGgpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgbWV0YSAgICA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBzdGF0cyAgID0gZm9sZGVyU3RhdHMoZm9sZGVyKTtcbiAgICAgIGNvbnN0IGNvdmVyICAgPSBjb3ZlckluRm9sZGVyKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgbmF2aWdhYmxlID0gc3ViRm9sZGVycyhmb2xkZXIpLmxlbmd0aCA+IDAgfHwgbm90ZXNJbihmb2xkZXIpLmxlbmd0aCA+IDA7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZVJvb3QgPT09IGZvbGRlci5wYXRoO1xuXG4gICAgICBjb25zdCBjYXJkID0gZ3JpZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZCB3ZC1wYXJhLWNhcmQgd2QtYW5pbS1pblwiICsgKGlzQWN0aXZlID8gXCIgd2QtYWN0aXZlXCIgOiBcIlwiKSB9KTtcbiAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICBjYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7aWR4ICogNDB9bXNgO1xuICAgICAgaWR4Kys7XG5cbiAgICAgIGlmIChjb3Zlcikge1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlclwiIH0pLmNyZWF0ZUVsKFwiaW1nXCIsIHsgYXR0cjogeyBzcmM6IGNvdmVyLCBkcmFnZ2FibGU6IFwiZmFsc2VcIiB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGMgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jb3ZlciB3ZC1jb3Zlci1kZWZhdWx0XCIgfSk7XG4gICAgICAgIHJlbmRlckljb24oZGMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3Zlci1nbHlwaFwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgfVxuICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtYWNjZW50LWJhclwiIH0pLnN0eWxlLmJhY2tncm91bmQgPSBtZXRhLmFjY2VudDtcblxuICAgICAgdGhpcy5oaWRlQnRuKGNhcmQsIGZvbGRlci5wYXRoLCBgT2N1bHRhciBcIiR7bWV0YS5sYWJlbH1cImApO1xuXG4gICAgICBjb25zdCBib2R5ID0gY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC1ib2R5XCIgfSk7XG4gICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvblwiIH0pLCBtZXRhLmljb24pO1xuICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgIGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWxhYmVsXCIsICB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZm9sZGVyXCIsIHRleHQ6IGZvbGRlci5wYXRoIH0pO1xuICAgICAgaWYgKG5hdmlnYWJsZSkgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGFzLXN1YnNcIiwgdGV4dDogaXNBY3RpdmUgPyBcImZlY2hhciBcdTI1QkVcIiA6IFwiYWJyaXIgXHUyMDNBXCIgfSk7XG5cbiAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgYmFyLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzYCk7XG4gICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIGZvbGRlcik7XG5cbiAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaWYgKG5hdmlnYWJsZSkgeyB0aGlzLm5hdlBhdGggPSBpc0FjdGl2ZSA/IG51bGwgOiBmb2xkZXIucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfVxuICAgICAgICBlbHNlIHJldmVhbEluRXhwbG9yZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghaWR4KSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiTmVuaHVtYSBwYXN0YSB2aXNcdTAwRUR2ZWwuXCIgfSk7XG5cbiAgICAvLyBBcnF1aXZvcyBzb2x0b3MgbmEgcmFpeiBkbyBjb2ZyZVxuICAgIGNvbnN0IHJvb3RGaWxlcyA9IG5vdGVzSW4odmF1bHRSb290KTtcbiAgICB0aGlzLnJlbmRlck5vdGVzKHNlYywgcm9vdEZpbGVzLCBcImFycXVpdm9zIG5hIHJhaXpcIik7XG5cbiAgICBpZiAodGhpcy5uYXZQYXRoKSB7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5uYXZQYXRoKTtcbiAgICAgIGlmIChmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSB0aGlzLnJlbmRlckJyb3dzZXIoc2VjLCBmb2xkZXIpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVySGlkZGVuQmFyKHNlYyk7XG4gIH1cblxuICAvLyBQYWluZWwgaW5saW5lIG5hdmVnXHUwMEUxdmVsIChicmVhZGNydW1iICsgc3VicGFzdGFzICsgbm90YXMgZGEgcGFzdGEgYXR1YWwpXG4gIHByaXZhdGUgcmVuZGVyQnJvd3NlcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByb290UGF0aCA9IHRoaXMudG9wRm9sZGVyT2YoZm9sZGVyLnBhdGgpO1xuICAgIGNvbnN0IHJvb3RGb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocm9vdFBhdGgpO1xuICAgIGlmICghKHJvb3RGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkgcmV0dXJuO1xuICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCByb290Rm9sZGVyKTtcblxuICAgIGNvbnN0IHBhbmVsID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYW5lbFwiIH0pO1xuICAgIHBhbmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuXG4gICAgLy8gQnJlYWRjcnVtYlxuICAgIGNvbnN0IGNydW1iID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNydW1iXCIgfSk7XG4gICAgY29uc3QgcmVsID0gZm9sZGVyLnBhdGggPT09IHJvb3RQYXRoID8gW10gOiBmb2xkZXIucGF0aC5zbGljZShyb290UGF0aC5sZW5ndGggKyAxKS5zcGxpdChcIi9cIik7XG5cbiAgICBjb25zdCByb290U2VnID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZWdcIiArIChyZWwubGVuZ3RoID09PSAwID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSB9KTtcbiAgICByZW5kZXJJY29uKHJvb3RTZWcuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgcm9vdFNlZy5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcbiAgICBpZiAocmVsLmxlbmd0aCkgcm9vdFNlZy5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSByb290UGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGxldCBhY2MgPSByb290UGF0aDtcbiAgICByZWwuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1zZXBcIiwgdGV4dDogXCJcdTIwM0FcIiB9KTtcbiAgICAgIGNvbnN0IGlzTGFzdCA9IGkgPT09IHJlbC5sZW5ndGggLSAxO1xuICAgICAgYWNjID0gYCR7YWNjfS8ke3BhcnR9YDtcbiAgICAgIGNvbnN0IHNlZ1BhdGggPSBhY2M7XG4gICAgICBjb25zdCBzZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKGlzTGFzdCA/IFwiIHdkLWNydW1iLWN1clwiIDogXCJcIiksIHRleHQ6IHBhcnQgfSk7XG4gICAgICBpZiAoIWlzTGFzdCkgc2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNlZ1BhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG9zZSA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItY2xvc2VcIiwgdGV4dDogXCJcdTI3MTVcIiB9KTtcbiAgICBjbG9zZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJGZWNoYXJcIik7XG4gICAgY2xvc2Uub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gbnVsbDsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIC8vIENhbXBvIGRlIGJ1c2NhXG4gICAgY29uc3Qgc2VhcmNoV3JhcCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWFyY2gtd3JhcFwiIH0pO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoV3JhcC5jcmVhdGVFbChcImlucHV0XCIsIHtcbiAgICAgIGNsczogXCJ3ZC1zZWFyY2hcIixcbiAgICAgIGF0dHI6IHsgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcImZpbHRyYXJcdTIwMjZcIiwgdmFsdWU6IHRoaXMuc2VhcmNoVGVybSB9LFxuICAgIH0pO1xuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLXN1Yi1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYmwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLndkLWxhYmVsXCIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSA/PyBcIlwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbGJsLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi53ZC1ub3RlLXJvdywgLndkLW5vdGUtY2FyZFwiKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbC5xdWVyeVNlbGVjdG9yKFwiLndkLW5vdGUtbmFtZSwgLndkLW5vdGUtY2FyZC1uYW1lXCIpPy50ZXh0Q29udGVudCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gbmFtZS5pbmNsdWRlcyh0ZXJtKSA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU3VicGFzdGFzIGNvbW8gY2FyZHNcbiAgICBjb25zdCBzdWJzID0gc3ViRm9sZGVycyhmb2xkZXIpO1xuICAgIGlmIChzdWJzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc2dyaWQgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvai1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNmIG9mIHN1YnMpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVhZEZvbGRlclN0YXR1cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBzdGF0cyAgPSBmb2xkZXJTdGF0cyhzZik7XG4gICAgICAgIGNvbnN0IGNvdmVyICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIHNmKTtcbiAgICAgICAgY29uc3QgZGVlcGVyID0gc3ViRm9sZGVycyhzZikubGVuZ3RoID4gMDtcbiAgICAgICAgY29uc3QgY3VzdG9tSWNvbiA9IHJlYWRGb2xkZXJJY29uKHRoaXMuYXBwLCBzZik7XG5cbiAgICAgICAgY29uc3QgY2FyZCA9IHNncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLWNhcmQgd2Qtc3ViLWNhcmQgd2Qtcy0ke3N0YXR1c31gIH0pO1xuICAgICAgICBjYXJkLnN0eWxlLnNldFByb3BlcnR5KFwiLS1hY2NlbnRcIiwgbWV0YS5hY2NlbnQpO1xuICAgICAgICBpZiAoY292ZXIpIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG5cbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1iYWRnZSB3ZC1iYWRnZS0ke3N0YXR1c31gLCB0ZXh0OiBTVEFUVVNfSUNPTltzdGF0dXNdIH0pO1xuXG4gICAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgICAgY29uc3QgdG9wICA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtdG9wXCIgfSk7XG4gICAgICAgIGlmIChjdXN0b21JY29uKSByZW5kZXJJY29uKHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWljb24gd2Qtc3ViLWljb25cIiB9KSwgY3VzdG9tSWNvbik7XG4gICAgICAgIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdW50XCIsIHRleHQ6IGNvdW50VGV4dChzdGF0cykgfSk7XG4gICAgICAgIGlmIChkZWVwZXIpIHRvcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN1Yi1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgdGV4dDogc2YubmFtZSB9KTtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikgbGFiZWwuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNvbnN0IHJ2ID0gcmV2aWV3ZWRTdGF0cyh0aGlzLmFwcCwgc2YpO1xuICAgICAgICAgIGlmIChydi50b3RhbCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJhciA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzXCIgfSk7XG4gICAgICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXNgKTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBiYXIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXByb2dyZXNzLWZpbGxcIiB9KTtcbiAgICAgICAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApfSVgO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IFwiY2FuY2VsbGVkXCIpIHtcbiAgICAgICAgICBjYXJkLnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYXR0YWNoVGlwKGNhcmQsIHNmKTtcbiAgICAgICAgICBjYXJkLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHNmLnBhdGg7IHRoaXMuc2VhcmNoVGVybSA9IFwiXCI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3RhcyBkYSBwYXN0YSBhdHVhbFxuICAgIGNvbnN0IG5vdGVzID0gbm90ZXNJbihmb2xkZXIpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMocGFuZWwsIG5vdGVzKTtcblxuICAgIGlmICghc3Vicy5sZW5ndGggJiYgIW5vdGVzLmxlbmd0aClcbiAgICAgIHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIlBhc3RhIHZhemlhLlwiIH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFJlbGF0XHUwMEYzcmlvcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlclJlcG9ydHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfUkVQKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFwiNDAuQXJjaGl2ZS9SZWxhdFx1MDBGM3Jpb3MgQ2xhdWRlXCIpO1xuICAgIGlmICghKGRpciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgaXRlbXM6IHsgZmlsZTogVEZpbGU7IGRhdGU6IHN0cmluZyB9W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgZGlyLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoIShjIGluc3RhbmNlb2YgVEZpbGUpIHx8IGMuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZCA9IG5vcm1hbGl6ZURhdGUodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShjLnBhdGgpPy5mcm9udG1hdHRlcj8uZGF0ZSk7XG4gICAgICBpZiAoZCkgaXRlbXMucHVzaCh7IGZpbGU6IGMsIGRhdGU6IGQgfSk7XG4gICAgfVxuICAgIGl0ZW1zLnNvcnQoKGEsIGIpID0+IGIuZGF0ZS5sb2NhbGVDb21wYXJlKGEuZGF0ZSkpO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJSRUxBVFx1MDBEM1JJT1MgQ0xBVURFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJyZXBvcnRzXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX1JFUCwgXCJPY3VsdGFyIFJlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGNvbnN0IGxpc3QgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXJlcG9ydC1saXN0XCIgfSk7XG4gICAgZm9yIChjb25zdCB7IGZpbGUsIGRhdGUgfSBvZiBpdGVtcy5zbGljZSgwLCA2KSkge1xuICAgICAgY29uc3QgW3ksIG0sIGRdID0gZGF0ZS5zcGxpdChcIi1cIik7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1yZXBvcnQtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1yZXBvcnQtZGF0ZVwiLCB0ZXh0OiBgJHtkfS8ke219LyR7eX1gIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtcmVwb3J0LW5hbWVcIiwgdGV4dDogZmlsZS5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICAgICAgdm9pZCB5O1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWF0bWFwICh2aWEgcGx1Z2luIEhlYXRtYXAgQ2FsZW5kYXIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVySGVhdG1hcChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19IRUFUKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1oZWF0LXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkFUSVZJREFERSBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwiaGVhdG1hcFwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19IRUFULCBcIk9jdWx0YXIgaGVhdG1hcFwiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgY29uc3QgcmVuZGVyID0gZ2V0SGVhdG1hcFJlbmRlcmVyKCk7XG4gICAgaWYgKCFyZW5kZXIpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogJ0F0aXZlIG8gcGx1Z2luIFwiSGVhdG1hcCBDYWxlbmRhclwiIHBhcmEgdmVyIGEgYXRpdmlkYWRlLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90YXMgY3JpYWRhcyBwb3IgZGlhLCBubyBhbm8gY29ycmVudGUuXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoZi5zdGF0LmN0aW1lKTtcbiAgICAgIGlmIChkLmdldEZ1bGxZZWFyKCkgIT09IHllYXIpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qga2V5ID0gdG9LZXkoZCk7XG4gICAgICBjb3VudHNba2V5XSA9IChjb3VudHNba2V5XSA/PyAwKSArIDE7XG4gICAgfVxuICAgIGNvbnN0IGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdID0gT2JqZWN0LmVudHJpZXMoY291bnRzKS5tYXAoKFtkYXRlLCBuXSkgPT4gKHtcbiAgICAgIGRhdGUsIGludGVuc2l0eTogbiwgY29sb3I6IFwiZ3JlZW5cIiwgY29udGVudDogYCR7bn0gbm90YShzKWAsXG4gICAgfSkpO1xuXG4gICAgY29uc3QgYm94ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oZWF0LWJveFwiIH0pO1xuICAgIHRyeSB7XG4gICAgICByZW5kZXIoYm94LCB7XG4gICAgICAgIHllYXIsXG4gICAgICAgIGNvbG9yczogeyBncmVlbjogW1wiIzFlM2EyZlwiLCBcIiMxZjZmNDNcIiwgXCIjMmJhODVhXCIsIFwiIzM5ZDM1M1wiXSB9LFxuICAgICAgICBzaG93Q3VycmVudERheUJvcmRlcjogdHJ1ZSxcbiAgICAgICAgZW50cmllcyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2VjLmVtcHR5KCk7XG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiRmFsaGEgYW8gcmVuZGVyaXphciBvIGhlYXRtYXAuXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEVzdGF0XHUwMEVEc3RpY2FzIGRvIGNvZnJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyU3RhdHMocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfU1RBVCkpIHJldHVybjtcblxuICAgIGxldCB0b3RhbE5vdGVzID0gMCwgdG90YWxSZXZpZXdlZCA9IDAsIGNyZWF0ZWRUaGlzV2VlayA9IDA7XG4gICAgY29uc3Qgd2Vla0FnbyA9IERhdGUubm93KCkgLSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5uYW1lID09PSBcInN0YXR1cy5tZFwiKSBjb250aW51ZTtcbiAgICAgIHRvdGFsTm90ZXMrKztcbiAgICAgIGlmICh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgdG90YWxSZXZpZXdlZCsrO1xuICAgICAgaWYgKGYuc3RhdC5jdGltZSA+PSB3ZWVrQWdvKSBjcmVhdGVkVGhpc1dlZWsrKztcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsUGN0ID0gdG90YWxOb3RlcyA+IDAgPyBNYXRoLnJvdW5kKHRvdGFsUmV2aWV3ZWQgLyB0b3RhbE5vdGVzICogMTAwKSA6IDA7XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJFU1RBVFx1MDBDRFNUSUNBU1wiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwic3RhdHNcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfU1RBVCwgXCJPY3VsdGFyIGVzdGF0XHUwMEVEc3RpY2FzXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICAvLyBOXHUwMEZBbWVyb3MgZ2xvYmFpc1xuICAgIGNvbnN0IGdsb2IgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtZ2xvYmFsXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnXCIsIHRleHQ6IFN0cmluZyh0b3RhbE5vdGVzKSB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1taWRcIiwgdGV4dDogXCJub3Rhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWJpZyB3ZC1zdGF0LXJldi1udW1cIiwgdGV4dDogYCR7Z2xvYmFsUGN0fSVgIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcInJldmlzYWRhc1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXNlcFwiLCB0ZXh0OiBcIlx1MDBCN1wiIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LXdlZWtcIiwgdGV4dDogYCske2NyZWF0ZWRUaGlzV2Vla31gIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcImVzdGEgc2VtYW5hXCIgfSk7XG5cbiAgICAvLyBCcmVha2Rvd24gcG9yIHBhc3RhXG4gICAgY29uc3QgdGFibGUgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtdGFibGVcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG5cbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgaWYgKHJ2LnRvdGFsID09PSAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG1ldGEgPSBmb2xkZXJNZXRhKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgY29uc3QgcGN0ID0gTWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKTtcblxuICAgICAgY29uc3Qgcm93ID0gdGFibGUuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcm93XCIgfSk7XG4gICAgICByb3cuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAgIGNvbnN0IG5hbWVFbCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1mb2xkZXJcIiB9KTtcbiAgICAgIHJlbmRlckljb24obmFtZUVsLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICBuYW1lRWwuY3JlYXRlU3Bhbih7IHRleHQ6IG1ldGEubGFiZWwgfSk7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1jb3VudFwiLCB0ZXh0OiBgJHtydi50b3RhbH1gIH0pO1xuXG4gICAgICBjb25zdCBiYXJXcmFwID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhclwiIH0pO1xuICAgICAgYmFyV3JhcC5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhcyAoJHtwY3R9JSlgKTtcbiAgICAgIGNvbnN0IGZpbGwgPSBiYXJXcmFwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWJhci1maWxsXCIgfSk7XG4gICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7cGN0fSVgO1xuXG4gICAgICByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtcGN0XCIsIHRleHQ6IGAke3BjdH0lYCB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTGlzdGEgLyBncmFkZSBkZSBub3RhcyBjb20gdG9nZ2xlIGUgaW5kaWNhZG9yIHJldmlld2VkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyTm90ZXMocGFyZW50OiBIVE1MRWxlbWVudCwgbm90ZXM6IFRGaWxlW10sIGxhYmVsID0gXCJcIikge1xuICAgIGlmICghbm90ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgaXNHcmlkID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Mubm90ZVZpZXcgPT09IFwiZ3JpZFwiO1xuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5yZXZpZXdGaWx0ZXIgPyBub3Rlcy5maWx0ZXIoZiA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCAhPT0gdHJ1ZSkgOiBub3RlcztcblxuICAgIGNvbnN0IGhkciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZXMtaGRyXCIgfSk7XG4gICAgY29uc3QgY291bnRUeHQgPSB0aGlzLnJldmlld0ZpbHRlclxuICAgICAgPyBgJHtmaWx0ZXJlZC5sZW5ndGh9IHBlbmRlbnRlJHtmaWx0ZXJlZC5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9IC8gJHtub3Rlcy5sZW5ndGh9YFxuICAgICAgOiAobGFiZWwgfHwgYCR7bm90ZXMubGVuZ3RofSBub3RhJHtub3Rlcy5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9YCk7XG4gICAgaGRyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtbm90ZXMtbGFiZWxcIiwgdGV4dDogY291bnRUeHQgfSk7XG5cbiAgICBjb25zdCB0b2cgPSBoZHIuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXZpZXctdG9nZ2xlXCIgfSk7XG4gICAgY29uc3QgYnRuUGVuZCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5yZXZpZXdGaWx0ZXIgPyBcIiB3ZC12aWV3LWFjdGl2ZSB3ZC12aWV3LXBlbmRcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVDQlwiIH0pO1xuICAgIGJ0blBlbmQuc2V0QXR0cihcInRpdGxlXCIsIFwiTW9zdHJhciBzXHUwMEYzIHBlbmRlbnRlcyAoblx1MDBFM28gcmV2aXNhZGFzKVwiKTtcbiAgICBidG5QZW5kLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5yZXZpZXdGaWx0ZXIgPSAhdGhpcy5yZXZpZXdGaWx0ZXI7IHRoaXMucmVuZGVyKCk7IH07XG4gICAgY29uc3QgYnRuTCA9IHRvZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIWlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyNjFcIiB9KTtcbiAgICBidG5MLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkxpc3RhXCIpO1xuICAgIGJ0bkwub25jbGljayA9IGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwibGlzdFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5HID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArIChpc0dyaWQgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiXHUyMjlFXCIgfSk7XG4gICAgYnRuRy5zZXRBdHRyKFwidGl0bGVcIiwgXCJDb2x1bmFzXCIpO1xuICAgIGJ0bkcub25jbGljayA9IGFzeW5jIGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9IFwiZ3JpZFwiOyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgdGhpcy5yZW5kZXIoKTsgfTtcblxuICAgIGlmICghZmlsdGVyZWQubGVuZ3RoKSB7XG4gICAgICBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IHRoaXMucmV2aWV3RmlsdGVyID8gXCJOZW5odW1hIG5vdGEgcGVuZGVudGUgbmVzdGEgcGFzdGEuXCIgOiBcIk5lbmh1bWEgbm90YS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNHcmlkKSB7XG4gICAgICBjb25zdCBncmlkID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1ncmlkXCIgfSk7XG4gICAgICBmb3IgKGNvbnN0IGYgb2YgZmlsdGVyZWQpIHtcbiAgICAgICAgY29uc3Qgc3QgPSByZWFkTm90ZVN0YXR1cyh0aGlzLmFwcCwgZik7XG4gICAgICAgIGNvbnN0IHJ2ID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmLnBhdGgpPy5mcm9udG1hdHRlcj8ucmV2aWV3ZWQgPT09IHRydWU7XG4gICAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtY2FyZCB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1ydiBcIiArIChydiA/IFwid2QtcnYteWVzXCIgOiBcIndkLXJ2LW5vXCIpIH0pLnNldEF0dHIoXCJ0aXRsZVwiLCBydiA/IFwiUmV2aXNhZGFcIiA6IFwiTlx1MDBFM28gcmV2aXNhZGFcIik7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWNhcmQtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgICAgIGlmIChzdCAhPT0gXCJjYW5jZWxsZWRcIikgY2FyZC5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaXN0ID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLWxpc3RcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBzdCA9IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKTtcbiAgICAgICAgY29uc3QgcnYgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IGB3ZC1ub3RlLXJvdyB3ZC1zLSR7c3R9YCB9KTtcbiAgICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IGB3ZC1ub3RlLWRvdCB3ZC1iYWRnZS0ke3N0fWAgfSk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgICAgaWYgKHN0ID09PSBcImNhbmNlbGxlZFwiKSBuYW1lLmFkZENsYXNzKFwid2Qtc3RyaWtlXCIpO1xuICAgICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSByb3cub25jbGljayA9ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKS5vcGVuRmlsZShmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR3JcdTAwRTFmaWNvIGRlIGNyZXNjaW1lbnRvIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyR3Jvd3RoKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0dST1cpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uXCIgfSk7XG4gICAgY29uc3QgaGVhZCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWhlYWRcIiB9KTtcbiAgICBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtbGFiZWxcIiwgdGV4dDogXCJDUkVTQ0lNRU5UTyBETyBDT0ZSRVwiIH0pO1xuICAgIGNvbnN0IGN0cmxzID0gaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWN0cmxzXCIgfSk7XG4gICAgY29uc3QgYnRuRGF5ID0gY3RybHMuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKCF0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwiZGlhXCIgfSk7XG4gICAgYnRuRGF5LnNldEF0dHIoXCJ0aXRsZVwiLCBcIk5vdGFzIGNyaWFkYXMgcG9yIGRpYVwiKTtcbiAgICBidG5EYXkub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSBmYWxzZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5DdW0gPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAodGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcInRvdGFsXCIgfSk7XG4gICAgYnRuQ3VtLnNldEF0dHIoXCJ0aXRsZVwiLCBcIlRvdGFsIGFjdW11bGFkbyBubyBwZXJcdTAwRURvZG9cIik7XG4gICAgYnRuQ3VtLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5ncm93dGhDdW11bGF0aXZlID0gdHJ1ZTsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJncm93dGhcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfR1JPVywgXCJPY3VsdGFyIGNyZXNjaW1lbnRvXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICAvLyBBZ3J1cGEgbm90YXMgcG9yIGRhdGEgZGUgY3JpYVx1MDBFN1x1MDBFM29cbiAgICBjb25zdCBjb3VudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShuZXcgRGF0ZShmLnN0YXQuY3RpbWUpKTtcbiAgICAgIGNvdW50c1trZXldID0gKGNvdW50c1trZXldID8/IDApICsgMTtcbiAgICB9XG5cbiAgICAvLyBcdTAwREFsdGltb3MgMzAgZGlhc1xuICAgIGNvbnN0IERBWVMgPSAzMDtcbiAgICBjb25zdCBkYXlzOiB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBEQVlTIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpIC0gaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvbnN0IFssIG0sIGRheV0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgZGF5cy5wdXNoKHsga2V5LCBjb3VudDogY291bnRzW2tleV0gPz8gMCwgbGFiZWw6IGAke2RheX0vJHttfWAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG90YWwgPSBkYXlzLnJlZHVjZSgocywgZCkgPT4gcyArIGQuY291bnQsIDApO1xuICAgIGNvbnN0IHRvZGF5S2V5ID0gdG9LZXkobmV3IERhdGUoKSk7XG5cbiAgICAvLyBNb2RvIGN1bXVsYXRpdm86IHNvbWEgYWN1bXVsYWRhIGRpYSBhIGRpYVxuICAgIHR5cGUgRGF5RW50cnkgPSB7IGtleTogc3RyaW5nOyBjb3VudDogbnVtYmVyOyBsYWJlbDogc3RyaW5nOyBkaXNwbGF5VmFsOiBudW1iZXIgfTtcbiAgICBsZXQgZW50cmllczogRGF5RW50cnlbXTtcbiAgICBpZiAodGhpcy5ncm93dGhDdW11bGF0aXZlKSB7XG4gICAgICBsZXQgYWNjID0gMDtcbiAgICAgIGVudHJpZXMgPSBkYXlzLm1hcChkID0+IHsgYWNjICs9IGQuY291bnQ7IHJldHVybiB7IC4uLmQsIGRpc3BsYXlWYWw6IGFjYyB9OyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4gKHsgLi4uZCwgZGlzcGxheVZhbDogZC5jb3VudCB9KSk7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmVudHJpZXMubWFwKGUgPT4gZS5kaXNwbGF5VmFsKSwgMSk7XG5cbiAgICAvLyBMaW5oYSBkZSByZXN1bW9cbiAgICBjb25zdCBpbmZvID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtaW5mb1wiIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtdG90YWxcIiwgdGV4dDogYCR7dGhpcy5ncm93dGhDdW11bGF0aXZlID8gZW50cmllc1tlbnRyaWVzLmxlbmd0aCAtIDFdLmRpc3BsYXlWYWwgOiB0b3RhbH1gIH0pO1xuICAgIGluZm8uY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ncm93dGgtcGVyaW9kXCIsIHRleHQ6IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwibm90YXMgYWN1bXVsYWRhcyAoMzAgZGlhcylcIiA6IFwibm90YXMgY3JpYWRhcyBub3MgXHUwMEZBbHRpbW9zIDMwIGRpYXNcIiB9KTtcblxuICAgIC8vIEdyXHUwMEUxZmljbyBkZSBiYXJyYXNcbiAgICBjb25zdCBjaGFydCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNoYXJ0XCIgfSk7XG4gICAgZW50cmllcy5mb3JFYWNoKCh7IGtleSwgY291bnQsIGxhYmVsLCBkaXNwbGF5VmFsIH0sIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY29sID0gY2hhcnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1jb2xcIiArIChrZXkgPT09IHRvZGF5S2V5ID8gXCIgd2QtZ3Jvd3RoLXRvZGF5XCIgOiBcIlwiKSB9KTtcbiAgICAgIGNvbnN0IGJhckFyZWEgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXItYXJlYVwiIH0pO1xuICAgICAgY29uc3QgaXNFbXB0eSA9IGRpc3BsYXlWYWwgPT09IDA7XG4gICAgICBjb25zdCBiYXIgPSBiYXJBcmVhLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtYmFyXCIgKyAoaXNFbXB0eSA/IFwiIHdkLWdyb3d0aC1iYXItemVyb1wiIDogXCJcIikgfSk7XG4gICAgICBiYXIuc3R5bGUuaGVpZ2h0ID0gaXNFbXB0eSA/IFwiM3B4XCIgOiBgJHtNYXRoLm1heCg1LCBNYXRoLnJvdW5kKChkaXNwbGF5VmFsIC8gbWF4KSAqIDEwMCkpfSVgO1xuICAgICAgaWYgKCFpc0VtcHR5KSBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke2xhYmVsfTogJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBkaXNwbGF5VmFsICsgXCIgdG90YWxcIiA6IGNvdW50ICsgXCIgbm90YShzKVwifWApO1xuXG4gICAgICBjb25zdCBzaG93TGJsID0gaWR4ID09PSAwIHx8IGlkeCA9PT0gNyB8fCBpZHggPT09IDE0IHx8IGlkeCA9PT0gMjEgfHwgaWR4ID09PSAyOSB8fCBrZXkgPT09IHRvZGF5S2V5O1xuICAgICAgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtbGJsXCIsIHRleHQ6IHNob3dMYmwgPyBsYWJlbCA6IFwiXCIgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9kb2lzdCAoRmFzZSA4LjEgXHUyMDE0IGxlaXR1cmEpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyVG9kb2lzdChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19UT0RPKSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC10b2RvLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlRBUkVGQVNcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2RvaXN0VG9rZW4udHJpbSgpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgY29uc3QgcmVmcmVzaCA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWZyZXNoXCIgKyAodGhpcy50b2RvaXN0TG9hZGluZyA/IFwiIHdkLXNwaW5cIiA6IFwiXCIpIH0pO1xuICAgICAgc2V0SWNvbihyZWZyZXNoLCBcInJlZnJlc2gtY3dcIik7XG4gICAgICByZWZyZXNoLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkF0dWFsaXphciB0YXJlZmFzIGRvIFRvZG9pc3RcIik7XG4gICAgICByZWZyZXNoLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdm9pZCB0aGlzLmZldGNoVG9kb2lzdCh0cnVlKTsgfTtcbiAgICB9XG4gICAgdGhpcy5tb3ZlQ29udHJvbHMoY3RybHMsIFwidG9kb2lzdFwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19UT0RPLCBcIk9jdWx0YXIgdGFyZWZhc1wiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNvbGUgc2V1IHRva2VuIGRvIFRvZG9pc3QgZW0gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgXHUyMTkyIFdlcnVzIERhc2hib2FyZCBwYXJhIHZlciBzdWFzIHRhcmVmYXMgYXF1aS5cIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQcmltZWlyYSBjYXJnYSBwcmVndWlcdTAwRTdvc2EgKG5cdTAwRTNvIHJlZmF6IGVtIGxvb3Agc2Ugalx1MDBFMSBidXNjb3Ugb3Ugc2UgZGV1IGVycm8pLlxuICAgIGlmICghdGhpcy50b2RvaXN0RmV0Y2hlZEF0ICYmICF0aGlzLnRvZG9pc3RMb2FkaW5nICYmICF0aGlzLnRvZG9pc3RFcnJvcikgdm9pZCB0aGlzLmZldGNoVG9kb2lzdChmYWxzZSk7XG5cbiAgICBpZiAodGhpcy50b2RvaXN0RXJyb3IpIHtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHkgd2QtdG9kby1lcnJvclwiLCB0ZXh0OiBgRXJybyBhbyBidXNjYXIgdGFyZWZhczogJHt0aGlzLnRvZG9pc3RFcnJvcn1gIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMudG9kb2lzdEZldGNoZWRBdCkge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiBcIkNhcnJlZ2FuZG8gdGFyZWZhc1x1MjAyNlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1vbmRheSA9IG1vbmRheU9mKDApOyAgIC8vIHNlbXByZSBhIHNlbWFuYSBhdHVhbFxuICAgIGNvbnN0IHRvZGF5SyA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuICAgIGNvbnN0IHdlZWtOdW0gPSBpc29XZWVrTnVtYmVyKG1vbmRheSk7XG5cbiAgICAvLyBBZ3J1cGEgcG9yIGRpYSBkZSB2ZW5jaW1lbnRvICsgY29sZXRhIGF0cmFzYWRhcyAoZHVlIDwgaG9qZSkuXG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIFRvZG9pc3RUYXNrW10+ID0ge307XG4gICAgY29uc3Qgb3ZlcmR1ZTogVG9kb2lzdFRhc2tbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdCBvZiB0aGlzLnRvZG9pc3RUYXNrcykge1xuICAgICAgY29uc3QgZGsgPSBkdWVLZXkodCk7XG4gICAgICBpZiAoIWRrKSBjb250aW51ZTtcbiAgICAgIGlmIChkayA8IHRvZGF5Sykgb3ZlcmR1ZS5wdXNoKHQpO1xuICAgICAgKGJ5RGF5W2RrXSA/Pz0gW10pLnB1c2godCk7XG4gICAgfVxuICAgIGNvbnN0IGJ5UHJpID0gKGE6IFRvZG9pc3RUYXNrLCBiOiBUb2RvaXN0VGFzaykgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7XG4gICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKGJ5RGF5KSkgYnlEYXlba10uc29ydChieVByaSk7XG4gICAgb3ZlcmR1ZS5zb3J0KGJ5UHJpKTtcblxuICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdG9kby13ZWVrbGFiZWxcIiwgdGV4dDogYFNlbWFuYSAke3dlZWtOdW19IFx1MDBCNyAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gIH0pO1xuXG4gICAgLy8gR3JhZGUgc2VtYW5hbCBjb20gY2hpcHMgcG9yIGRpYVxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tZ3JpZFwiIH0pO1xuICAgIGxldCB3ZWVrVGFza0NvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUobW9uZGF5KTtcbiAgICAgIGRheS5zZXREYXRlKG1vbmRheS5nZXREYXRlKCkgKyBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGRheSk7XG4gICAgICBjb25zdCBjb2wgPSBncmlkLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogW1wid2QtdG9kby1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tY29saGRcIiB9KTtcbiAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXluYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1kYXludW1cIiwgdGV4dDogU3RyaW5nKGRheS5nZXREYXRlKCkpIH0pO1xuXG4gICAgICBjb25zdCBpdGVtcyA9IGJ5RGF5W2tleV0gPz8gW107XG4gICAgICBmb3IgKGNvbnN0IHQgb2YgaXRlbXMpIHsgdGhpcy50b2RvQ2hpcChjb2wsIHQpOyB3ZWVrVGFza0NvdW50Kys7IH1cbiAgICB9XG4gICAgaWYgKHdlZWtUYXNrQ291bnQgPT09IDApXG4gICAgICBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5IHdkLXRvZG8tZW1wdHl3ZWVrXCIsIHRleHQ6IFwiTmVuaHVtYSB0YXJlZmEgY29tIGRhdGEgbmVzdGEgc2VtYW5hLlwiIH0pO1xuXG4gICAgLy8gUGFpbmVsIGRlIGF0cmFzYWRhcyAocmVjb2xoXHUwMEVEdmVsKVxuICAgIGlmIChvdmVyZHVlLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFuZWwgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb3ZlcmR1ZVwiIH0pO1xuICAgICAgY29uc3Qgb2hkID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXRvZG8tb2hkXCIgfSk7XG4gICAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW93YXJuXCIsIHRleHQ6IFwiXHUyNkEwXCIgfSk7XG4gICAgICBvaGQuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLW90aXRsZVwiLCB0ZXh0OiBgQXRyYXNhZGFzICgke292ZXJkdWUubGVuZ3RofSlgIH0pO1xuICAgICAgb2hkLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1vdG9nZ2xlXCIsIHRleHQ6IHRoaXMudG9kb2lzdE92ZXJkdWVPcGVuID8gXCJvY3VsdGFyIFx1MjVCRVwiIDogXCJtb3N0cmFyIFx1MjAzQVwiIH0pO1xuICAgICAgb2hkLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMudG9kb2lzdE92ZXJkdWVPcGVuID0gIXRoaXMudG9kb2lzdE92ZXJkdWVPcGVuOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgICBpZiAodGhpcy50b2RvaXN0T3ZlcmR1ZU9wZW4pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLW9saXN0XCIgfSk7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBvdmVyZHVlKSB0aGlzLnRvZG9Sb3cobGlzdCwgdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpcCBjb21wYWN0byBkZSB0YXJlZmEgKG5hIGdyYWRlIHNlbWFuYWwpLlxuICBwcml2YXRlIHRvZG9DaGlwKGNvbDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCBjaGlwID0gY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLWNoaXBcIiB9KTtcbiAgICBjaGlwLnN0eWxlLnNldFByb3BlcnR5KFwiLS1wcmlcIiwgcHJpLmNvbG9yKTtcbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcmVjdXJcIiwgdGV4dDogXCJcdTI3RjNcIiB9KTtcbiAgICBjaGlwLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1jaGlwLXR4dFwiLCB0ZXh0OiB0LmNvbnRlbnQgfSk7XG4gICAgY2hpcC5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cHJpLmxhYmVsfSBcdTAwQjcgJHt0LmNvbnRlbnR9YCk7XG4gICAgY2hpcC5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0KSwgXCJfYmxhbmtcIik7XG4gIH1cblxuICAvLyBMaW5oYSBkZSB0YXJlZmEgKG5vIHBhaW5lbCBkZSBhdHJhc2FkYXMpLlxuICBwcml2YXRlIHRvZG9Sb3cobGlzdDogSFRNTEVsZW1lbnQsIHQ6IFRvZG9pc3RUYXNrKSB7XG4gICAgY29uc3QgcHJpID0gcHJpTWV0YSh0LnByaW9yaXR5KTtcbiAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b2RvLXJvd1wiIH0pO1xuICAgIGNvbnN0IHRhZyA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRvZG8tcHJpXCIsIHRleHQ6IHByaS5sYWJlbCB9KTtcbiAgICB0YWcuc3R5bGUuYmFja2dyb3VuZCA9IHByaS5jb2xvcjtcbiAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy10eHRcIiwgdGV4dDogdC5jb250ZW50IH0pO1xuICAgIGNvbnN0IGRrID0gZHVlS2V5KHQpO1xuICAgIGlmIChkaykge1xuICAgICAgY29uc3QgWywgbSwgZF0gPSBkay5zcGxpdChcIi1cIik7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC10b2RvLXJvdy1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX1gIH0pO1xuICAgIH1cbiAgICBpZiAodC5kdWU/LmlzX3JlY3VycmluZykgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdG9kby1yZWN1clwiLCB0ZXh0OiBcIlx1MjdGM1wiIH0pO1xuICAgIHJvdy5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciBubyBUb2RvaXN0XCIpO1xuICAgIHJvdy5vbmNsaWNrID0gKCkgPT4gd2luZG93Lm9wZW4odGFza1VybCh0KSwgXCJfYmxhbmtcIik7XG4gIH1cblxuICAvLyBCdXNjYSB0YXJlZmFzOyBgbWFudWFsYCBtb3N0cmEgbyBzcGlubmVyIGltZWRpYXRhbWVudGUuXG4gIHByaXZhdGUgYXN5bmMgZmV0Y2hUb2RvaXN0KG1hbnVhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuLnRyaW0oKTtcbiAgICBpZiAoIXRva2VuIHx8IHRoaXMudG9kb2lzdExvYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnRvZG9pc3RFcnJvciA9IG51bGw7XG4gICAgaWYgKG1hbnVhbCkgdGhpcy5yZW5kZXIoKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy50b2RvaXN0VGFza3MgPSBhd2FpdCBmZXRjaFRvZG9pc3RUYXNrcyh0b2tlbik7XG4gICAgICB0aGlzLnRvZG9pc3RGZXRjaGVkQXQgPSBEYXRlLm5vdygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMudG9kb2lzdEVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlc2V0YSBvIGVzdGFkbyAoZXguOiB0b2tlbiBhbHRlcmFkbyBuYXMgY29uZmlndXJhXHUwMEU3XHUwMEY1ZXMpIGUgcmUtcmVuZGVyaXphLlxuICByZXNldFRvZG9pc3QoKSB7XG4gICAgdGhpcy50b2RvaXN0VGFza3MgPSBbXTtcbiAgICB0aGlzLnRvZG9pc3RGZXRjaGVkQXQgPSAwO1xuICAgIHRoaXMudG9kb2lzdEVycm9yID0gbnVsbDtcbiAgICB0aGlzLnRvZG9pc3RMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWFkZXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJTZWNvbmQgQnJhaW5cIiB9KTtcblxuICAgIGNvbnN0IHRvZ2dsZSA9IGguY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IFwid2QtY29tcGFjdC10b2dnbGVcIixcbiAgICAgIHRleHQ6IHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QgPyBcIlx1MjVBNiBjb21wYWN0b1wiIDogXCJcdTI1QTQgY29uZm9ydFx1MDBFMXZlbFwiLFxuICAgIH0pO1xuICAgIHRvZ2dsZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBbHRlcm5hciBtb2RvIGNvbXBhY3RvXCIpO1xuICAgIHRvZ2dsZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA9ICF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0O1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH07XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEUsIGxlYWYgPT4gbmV3IERhc2hib2FyZFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxheW91dC1kYXNoYm9hcmRcIiwgXCJBYnJpciBXZXJ1cyBEYXNoYm9hcmRcIiwgKCkgPT4gdGhpcy5vcGVuKCkpO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tZGFzaGJvYXJkXCIsIG5hbWU6IFwiQWJyaXIgRGFzaGJvYXJkXCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW4oKSB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdlcnVzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICB9XG5cbiAgLy8gUmUtYnVzY2EgbyBUb2RvaXN0IGVtIHRvZGFzIGFzIGRhc2hib2FyZHMgYWJlcnRhcyAoZXguOiBhcFx1MDBGM3MgbXVkYXIgbyB0b2tlbikuXG4gIHJlZnJlc2hEYXNoYm9hcmRzKCkge1xuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSkpIHtcbiAgICAgIGNvbnN0IHYgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodiBpbnN0YW5jZW9mIERhc2hib2FyZFZpZXcpIHYucmVzZXRUb2RvaXN0KCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIC8vIFNhbmVhbWVudG86IHNlY3Rpb25PcmRlciBjb20gZXhhdGFtZW50ZSBhcyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJ0b2RvaXN0XCIsIFwicGFyYVwiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJyZXBvcnRzXCIsIFwiY2FsZW5kYXJcIl07XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8U2VjdGlvbklkPigpO1xuICAgIGNvbnN0IGNsZWFuZWQgPSAodGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgfHwgW10pLmZpbHRlcihcbiAgICAgIChzKTogcyBpcyBTZWN0aW9uSWQgPT4gdmFsaWQuaW5jbHVkZXMocyBhcyBTZWN0aW9uSWQpICYmICFzZWVuLmhhcyhzIGFzIFNlY3Rpb25JZCkgJiYgKHNlZW4uYWRkKHMgYXMgU2VjdGlvbklkKSwgdHJ1ZSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB2YWxpZCkgaWYgKCFzZWVuLmhhcyh2KSkgY2xlYW5lZC5wdXNoKHYpO1xuICAgIHRoaXMuc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gY2xlYW5lZDtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5zZXR0aW5ncy5oaWRkZW4pKSB0aGlzLnNldHRpbmdzLmhpZGRlbiA9IFtdO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkgeyBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpOyB9XG5cbiAgYXN5bmMgb3BlbigpIHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRSlbMF07XG4gICAgaWYgKCFsZWFmKSB7IGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7IGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogVklFV19UWVBFLCBhY3RpdmU6IHRydWUgfSk7IH1cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge31cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEFiYSBkZSBjb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY2xhc3MgV2VydXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogV2VydXNEYXNoYm9hcmQpIHsgc3VwZXIoYXBwLCBwbHVnaW4pOyB9XG5cbiAgZGlzcGxheSgpIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiSW50ZWdyYVx1MDBFN1x1MDBFM28gVG9kb2lzdFwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRva2VuIGRhIEFQSVwiKVxuICAgICAgLnNldERlc2MoXCJUb2RvaXN0IFx1MjE5MiBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBcdTIxOTIgSW50ZWdyYVx1MDBFN1x1MDBGNWVzIFx1MjE5MiBUb2tlbiBkZSBBUEkgZG8gZGVzZW52b2x2ZWRvci4gU2Fsdm8gbG9jYWxtZW50ZSBlbSBkYXRhLmpzb24gKG5cdTAwRTNvIHZhaSBwYXJhIG8gR2l0KS5cIilcbiAgICAgIC5hZGRUZXh0KHQgPT4ge1xuICAgICAgICB0LnNldFBsYWNlaG9sZGVyKFwiY29sZSBvIHRva2VuIGFxdWlcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudG9kb2lzdFRva2VuKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZG9pc3RUb2tlbiA9IHYudHJpbSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoRGFzaGJvYXJkcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0LmlucHV0RWwudHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICAgICAgdC5pbnB1dEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB9KTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQXFIO0FBRXJILElBQU0sWUFBWTtBQWFsQixJQUFNLG1CQUFpQztBQUFBLEVBQ3JDLGNBQWMsQ0FBQyxTQUFTLFdBQVcsUUFBUSxXQUFXLFVBQVUsV0FBVyxVQUFVO0FBQUEsRUFDckYsU0FBUztBQUFBLEVBQ1QsUUFBUSxDQUFDO0FBQUEsRUFDVCxVQUFVO0FBQUEsRUFDVixjQUFjO0FBQ2hCO0FBV0EsSUFBTSxPQUFzQjtBQUFBLEVBQzFCLEVBQUUsUUFBUSxZQUFnQixNQUFNLGFBQU0sT0FBTyxTQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUsUUFBUSxlQUFnQixNQUFNLGFBQU0sT0FBTyxZQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUs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
