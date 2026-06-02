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
  sectionOrder: ["stats", "para", "heatmap", "growth", "reports", "calendar"],
  compact: false,
  hidden: [],
  noteView: "list"
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
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    const valid = ["stats", "para", "heatmap", "growth", "reports", "calendar"];
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBJdGVtVmlldywgUGx1Z2luLCBURmlsZSwgVEZvbGRlciwgV29ya3NwYWNlTGVhZiwgc2V0SWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5jb25zdCBWSUVXX1RZUEUgPSBcIndlcnVzLWRhc2hib2FyZFwiO1xuXG50eXBlIFN0YXR1cyA9IFwicHJvZ3Jlc3NcIiB8IFwicGF1c2VkXCIgfCBcImNhbmNlbGxlZFwiO1xudHlwZSBTZWN0aW9uSWQgPSBcImNhbGVuZGFyXCIgfCBcInBhcmFcIiB8IFwicmVwb3J0c1wiIHwgXCJoZWF0bWFwXCIgfCBcImdyb3d0aFwiIHwgXCJzdGF0c1wiO1xuXG5pbnRlcmZhY2UgRGFzaFNldHRpbmdzIHtcbiAgc2VjdGlvbk9yZGVyOiBTZWN0aW9uSWRbXTtcbiAgY29tcGFjdDogYm9vbGVhbjtcbiAgaGlkZGVuOiBzdHJpbmdbXTsgICAvLyBjYW1pbmhvcyBkZSBwYXN0YSBvY3VsdG9zICsgXCJzZWM6Y2FsZW5kYXJcIiAvIFwic2VjOnJlcG9ydHNcIlxuICBub3RlVmlldzogXCJsaXN0XCIgfCBcImdyaWRcIjtcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogRGFzaFNldHRpbmdzID0ge1xuICBzZWN0aW9uT3JkZXI6IFtcInN0YXRzXCIsIFwicGFyYVwiLCBcImhlYXRtYXBcIiwgXCJncm93dGhcIiwgXCJyZXBvcnRzXCIsIFwiY2FsZW5kYXJcIl0sXG4gIGNvbXBhY3Q6IGZhbHNlLFxuICBoaWRkZW46IFtdLFxuICBub3RlVmlldzogXCJsaXN0XCIsXG59O1xuXG5pbnRlcmZhY2UgUGFyYVNlY3Rpb24ge1xuICBmb2xkZXI6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBhY2NlbnQ6IHN0cmluZztcbn1cblxuLy8gUGFzdGFzIFwiY29uaGVjaWRhc1wiIGRvIFBBUkE6IG1hbnRcdTAwRUFtIFx1MDBFRGNvbmUsIHJcdTAwRjN0dWxvIGUgY29yIGZpeG9zLiBBcyBkZW1haXMgcGFzdGFzXG4vLyBkbyBjb2ZyZSBzXHUwMEUzbyByZW5kZXJpemFkYXMgY29tIGNvciBhdXRvbVx1MDBFMXRpY2EgZSBcdTAwRURjb25lIHBhZHJcdTAwRTNvIChvdSBvIGljb246IGRvIHN0YXR1cy5tZCkuXG5jb25zdCBQQVJBOiBQYXJhU2VjdGlvbltdID0gW1xuICB7IGZvbGRlcjogXCIwMC5JbmJveFwiLCAgICAgaWNvbjogXCJcdUQ4M0RcdURDRTVcIiwgbGFiZWw6IFwiSW5ib3hcIiwgICAgYWNjZW50OiBcIiM2MzY2RjFcIiB9LFxuICB7IGZvbGRlcjogXCIxMC5Qcm9qZWN0c1wiLCAgaWNvbjogXCJcdUQ4M0RcdURFODBcIiwgbGFiZWw6IFwiUHJvamV0b3NcIiwgYWNjZW50OiBcIiMxMEI5ODFcIiB9LFxuICB7IGZvbGRlcjogXCIyMC5BcmVhc1wiLCAgICAgaWNvbjogXCJcdUQ4M0NcdURGQUZcIiwgbGFiZWw6IFwiXHUwMEMxcmVhc1wiLCAgICBhY2NlbnQ6IFwiI0Y1OUUwQlwiIH0sXG4gIHsgZm9sZGVyOiBcIjMwLlJlc291cmNlc1wiLCBpY29uOiBcIlx1RDgzRFx1RENEQVwiLCBsYWJlbDogXCJSZWN1cnNvc1wiLCBhY2NlbnQ6IFwiIzNCODJGNlwiIH0sXG4gIHsgZm9sZGVyOiBcIjQwLkFyY2hpdmVcIiwgICBpY29uOiBcIlx1RDgzRFx1RERDNFx1RkUwRlwiLCAgbGFiZWw6IFwiQXJxdWl2b1wiLCAgYWNjZW50OiBcIiM2QjcyODBcIiB9LFxuXTtcbmNvbnN0IFBBUkFfTUFQID0gbmV3IE1hcChQQVJBLm1hcChwID0+IFtwLmZvbGRlciwgcF0pKTtcblxuLy8gUGFsZXRhIHBhcmEgY29sb3JpciBwYXN0YXMgZGVzY29uaGVjaWRhcyBkZSBmb3JtYSBlc3RcdTAwRTF2ZWwgKHBvciBoYXNoIGRvIG5vbWUpLlxuY29uc3QgQUNDRU5UUyA9IFtcIiM2MzY2RjFcIixcIiMxMEI5ODFcIixcIiNGNTlFMEJcIixcIiMzQjgyRjZcIixcIiNFQzQ4OTlcIixcIiM4QjVDRjZcIixcIiMxNEI4QTZcIixcIiNFRjQ0NDRcIl07XG5cbmNvbnN0IERBWV9TSE9SVCA9IFtcIlNlZ1wiLCBcIlRlclwiLCBcIlF1YVwiLCBcIlF1aVwiLCBcIlNleFwiLCBcIlNcdTAwRTFiXCIsIFwiRG9tXCJdO1xuY29uc3QgTU9OVEhfU0hPUlQgPSBbXCJKYW5cIixcIkZldlwiLFwiTWFyXCIsXCJBYnJcIixcIk1haVwiLFwiSnVuXCIsXCJKdWxcIixcIkFnb1wiLFwiU2V0XCIsXCJPdXRcIixcIk5vdlwiLFwiRGV6XCJdO1xuY29uc3QgSU1HX0VYVCA9IFtcInBuZ1wiLFwianBnXCIsXCJqcGVnXCIsXCJ3ZWJwXCIsXCJnaWZcIixcInN2Z1wiXTtcblxuLy8gUGFzdGEgcmFpeiBkYXMgbm90YXMgZGlcdTAwRTFyaWFzIChjcmlhZGFzIGFvIGNsaWNhciBudW0gZGlhIGRvIGNhbGVuZFx1MDBFMXJpbykuXG5jb25zdCBEQUlMWV9GT0xERVIgPSBcIjUwLkRpXHUwMEUxcmlvXCI7XG4vLyBUZW1wbGF0ZSBvcGNpb25hbDsgcGxhY2Vob2xkZXJzIHt7ZGF0ZX19IChZWVlZLU1NLUREKSBlIHt7dGl0bGV9fSAoZGF0YSBwb3IgZXh0ZW5zbykuXG5jb25zdCBEQUlMWV9URU1QTEFURSA9IFwiTW9kZWxvcy9Ob3RhIERpXHUwMEUxcmlhLm1kXCI7XG5cbmNvbnN0IFNUQVRVU19JQ09OOiBSZWNvcmQ8U3RhdHVzLCBzdHJpbmc+ID0ge1xuICBwcm9ncmVzczogXCJcdTI1QjZcIiwgcGF1c2VkOiBcIlx1MjNGOFwiLCBjYW5jZWxsZWQ6IFwiXHUyNzE1XCIsXG59O1xuXG5jb25zdCBTRUNfQ0FMID0gXCJzZWM6Y2FsZW5kYXJcIjtcbmNvbnN0IFNFQ19SRVAgPSBcInNlYzpyZXBvcnRzXCI7XG5jb25zdCBTRUNfSEVBVCA9IFwic2VjOmhlYXRtYXBcIjtcbmNvbnN0IFNFQ19HUk9XID0gXCJzZWM6Z3Jvd3RoXCI7XG5jb25zdCBTRUNfU1RBVCA9IFwic2VjOnN0YXRzXCI7XG5cbi8vIEZ1blx1MDBFN1x1MDBFM28gZ2xvYmFsIGV4cG9zdGEgcGVsbyBwbHVnaW4gXCJIZWF0bWFwIENhbGVuZGFyXCIgKHF1YW5kbyBoYWJpbGl0YWRvKS5cbnR5cGUgSGVhdG1hcEVudHJ5ID0geyBkYXRlOiBzdHJpbmc7IGludGVuc2l0eT86IG51bWJlcjsgY29sb3I/OiBzdHJpbmc7IGNvbnRlbnQ/OiBzdHJpbmcgfTtcbnR5cGUgSGVhdG1hcERhdGEgPSB7XG4gIHllYXI6IG51bWJlcjtcbiAgY29sb3JzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT47XG4gIGVudHJpZXM6IEhlYXRtYXBFbnRyeVtdO1xuICBzaG93Q3VycmVudERheUJvcmRlcj86IGJvb2xlYW47XG59O1xuZnVuY3Rpb24gZ2V0SGVhdG1hcFJlbmRlcmVyKCk6ICgoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBIZWF0bWFwRGF0YSkgPT4gdm9pZCkgfCBudWxsIHtcbiAgY29uc3QgZm4gPSAod2luZG93IGFzIHVua25vd24gYXMgeyByZW5kZXJIZWF0bWFwQ2FsZW5kYXI/OiB1bmtub3duIH0pLnJlbmRlckhlYXRtYXBDYWxlbmRhcjtcbiAgcmV0dXJuIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiID8gKGZuIGFzIChlbDogSFRNTEVsZW1lbnQsIGRhdGE6IEhlYXRtYXBEYXRhKSA9PiB2b2lkKSA6IG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVdGlsaWRhZGVzIGRlIGRhdGEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGlzb1dlZWtOdW1iZXIoZGF0ZTogRGF0ZSk6IG51bWJlciB7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShEYXRlLlVUQyhkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCkpKTtcbiAgY29uc3QgZG93ID0gZC5nZXRVVENEYXkoKSB8fCA3O1xuICBkLnNldFVUQ0RhdGUoZC5nZXRVVENEYXRlKCkgKyA0IC0gZG93KTtcbiAgY29uc3QgeTAgPSBuZXcgRGF0ZShEYXRlLlVUQyhkLmdldFVUQ0Z1bGxZZWFyKCksIDAsIDEpKTtcbiAgcmV0dXJuIE1hdGguY2VpbCgoKGQuZ2V0VGltZSgpIC0geTAuZ2V0VGltZSgpKSAvIDg2XzQwMF8wMDAgKyAxKSAvIDcpO1xufVxuXG5mdW5jdGlvbiBtb25kYXlPZihvZmZzZXQ6IG51bWJlcik6IERhdGUge1xuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBkb3cgPSBub3cuZ2V0RGF5KCkgfHwgNztcbiAgY29uc3QgZCA9IG5ldyBEYXRlKG5vdyk7XG4gIGQuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpIC0gZG93ICsgMSArIG9mZnNldCAqIDcpO1xuICBkLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZDtcbn1cblxuZnVuY3Rpb24gdG9LZXkoZDogRGF0ZSk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtkLmdldEZ1bGxZZWFyKCl9LSR7U3RyaW5nKGQuZ2V0TW9udGgoKSsxKS5wYWRTdGFydCgyLFwiMFwiKX0tJHtTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsXCIwXCIpfWA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURhdGUodmFsOiB1bmtub3duKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdmFsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWwuc3Vic3RyaW5nKDAsIDEwKTtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHJldHVybiB2YWwudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApO1xuICBjb25zdCBzID0gU3RyaW5nKHZhbCk7XG4gIHJldHVybiBzLm1hdGNoKC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0vKSA/IHMuc3Vic3RyaW5nKDAsIDEwKSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHRvZGF5QlIoKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtQlJcIiwge1xuICAgIHdlZWtkYXk6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIHllYXI6IFwibnVtZXJpY1wiLFxuICB9KTtcbn1cblxuLy8gZGQvbW0gYSBwYXJ0aXIgZGUgdW0gdGltZXN0YW1wIChtdGltZSlcbmZ1bmN0aW9uIGZtdFNob3J0KHRzOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBkID0gbmV3IERhdGUodHMpO1xuICByZXR1cm4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLFwiMFwiKX0vJHtTdHJpbmcoZC5nZXRNb250aCgpKzEpLnBhZFN0YXJ0KDIsXCIwXCIpfWA7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVdGlsaWRhZGVzIGRlIHBhc3RhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vLyBDb250YSBub3RhcyByZXZpc2FkYXMgKHJldmlld2VkOiB0cnVlKSB2cyB0b3RhbCBlbSB0b2RhIGEgc3ViXHUwMEUxcnZvcmUuXG5mdW5jdGlvbiByZXZpZXdlZFN0YXRzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiB7IHJldmlld2VkOiBudW1iZXI7IHRvdGFsOiBudW1iZXIgfSB7XG4gIGxldCByZXZpZXdlZCA9IDAsIHRvdGFsID0gMDtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIHtcbiAgICAgICAgdG90YWwrKztcbiAgICAgICAgaWYgKGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGMucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZSkgcmV2aWV3ZWQrKztcbiAgICAgIH0gZWxzZSBpZiAoYyBpbnN0YW5jZW9mIFRGb2xkZXIpIHdhbGsoYyk7XG4gICAgfVxuICB9O1xuICB3YWxrKGZvbGRlcik7XG4gIHJldHVybiB7IHJldmlld2VkLCB0b3RhbCB9O1xufVxuXG4vLyBDb250YSBtZCAoZXhjZXRvIHN0YXR1cy5tZCkgZSBpbWFnZW5zIGVtIHRvZGEgYSBzdWJcdTAwRTFydm9yZS5cbmZ1bmN0aW9uIGZvbGRlclN0YXRzKGZvbGRlcjogVEZvbGRlcik6IHsgbWQ6IG51bWJlcjsgaW1nOiBudW1iZXIgfSB7XG4gIGxldCBtZCA9IDAsIGltZyA9IDA7XG4gIGNvbnN0IHdhbGsgPSAoZjogVEZvbGRlcikgPT4ge1xuICAgIGZvciAoY29uc3QgYyBvZiBmLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoYyBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgIGlmIChjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIikgbWQrKztcbiAgICAgICAgZWxzZSBpZiAoSU1HX0VYVC5pbmNsdWRlcyhjLmV4dGVuc2lvbikpIGltZysrO1xuICAgICAgfSBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgcmV0dXJuIHsgbWQsIGltZyB9O1xufVxuXG4vLyBUZXh0byBkZSBjb250YWdlbSBwYWRyb25pemFkbyBwYXJhIG9zIGNhcmRzIChub3RhcyArIGltYWdlbnMsIHF1YW5kbyBob3V2ZXIpLlxuZnVuY3Rpb24gY291bnRUZXh0KHN0YXRzOiB7IG1kOiBudW1iZXI7IGltZzogbnVtYmVyIH0pOiBzdHJpbmcge1xuICBpZiAoc3RhdHMubWQgPT09IDAgJiYgc3RhdHMuaW1nID4gMCkgcmV0dXJuIGAke3N0YXRzLmltZ30gaW1nYDtcbiAgcmV0dXJuIHN0YXRzLmltZyA+IDAgPyBgJHtzdGF0cy5tZH0gbm90YXMgXHUwMEI3ICR7c3RhdHMuaW1nfSBpbWdgIDogYCR7c3RhdHMubWR9IG5vdGFzYDtcbn1cblxuLy8gQXMgTiBub3RhcyAubWQgbW9kaWZpY2FkYXMgbWFpcyByZWNlbnRlbWVudGUgZW0gdG9kYSBhIHN1Ylx1MDBFMXJ2b3JlLlxuZnVuY3Rpb24gcmVjZW50Tm90ZXMoZm9sZGVyOiBURm9sZGVyLCBuOiBudW1iZXIpOiBURmlsZVtdIHtcbiAgY29uc3QgZmlsZXM6IFRGaWxlW10gPSBbXTtcbiAgY29uc3Qgd2FsayA9IChmOiBURm9sZGVyKSA9PiB7XG4gICAgZm9yIChjb25zdCBjIG9mIGYuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIiAmJiBjLm5hbWUgIT09IFwic3RhdHVzLm1kXCIpIGZpbGVzLnB1c2goYyk7XG4gICAgICBlbHNlIGlmIChjIGluc3RhbmNlb2YgVEZvbGRlcikgd2FsayhjKTtcbiAgICB9XG4gIH07XG4gIHdhbGsoZm9sZGVyKTtcbiAgZmlsZXMuc29ydCgoYSwgYikgPT4gYi5zdGF0Lm10aW1lIC0gYS5zdGF0Lm10aW1lKTtcbiAgcmV0dXJuIGZpbGVzLnNsaWNlKDAsIG4pO1xufVxuXG4vLyBQYXN0YSBcImRlIGFzc2V0c1wiOiBzXHUwMEYzIHRlbSBpbWFnZW5zLCBuZW5odW1hIG5vdGEgXHUyMTkyIGVzY29uZGlkYSBubyBuYXZlZ2Fkb3IgaW50ZXJuby5cbmZ1bmN0aW9uIGlzQXNzZXRGb2xkZXIoZm9sZGVyOiBURm9sZGVyKTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgbWQsIGltZyB9ID0gZm9sZGVyU3RhdHMoZm9sZGVyKTtcbiAgcmV0dXJuIGltZyA+IDAgJiYgbWQgPT09IDA7XG59XG5cbmZ1bmN0aW9uIHN1YkZvbGRlcnMoZm9sZGVyOiBURm9sZGVyKTogVEZvbGRlcltdIHtcbiAgcmV0dXJuIChmb2xkZXIuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAuZmlsdGVyKGYgPT4gIWlzQXNzZXRGb2xkZXIoZikpXG4gICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG59XG5cbmZ1bmN0aW9uIG5vdGVzSW4oZm9sZGVyOiBURm9sZGVyKTogVEZpbGVbXSB7XG4gIHJldHVybiAoZm9sZGVyLmNoaWxkcmVuLmZpbHRlcihcbiAgICBjID0+IGMgaW5zdGFuY2VvZiBURmlsZSAmJiBjLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmIGMubmFtZSAhPT0gXCJzdGF0dXMubWRcIlxuICApIGFzIFRGaWxlW10pLnNvcnQoKGEsIGIpID0+IGEuYmFzZW5hbWUubG9jYWxlQ29tcGFyZShiLmJhc2VuYW1lLCBcInB0XCIpKTtcbn1cblxuZnVuY3Rpb24gY292ZXJJbkZvbGRlcihhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIDEuIENhbXBvIGNvdmVyOiBubyBzdGF0dXMubWQgKGFjZWl0YSBjYW1pbmhvIGRpcmV0byBvdSB3aWtpbGluayBbWy4uLl1dKVxuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGlmIChzZikge1xuICAgIGNvbnN0IHJhdyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHNmLnBhdGgpPy5mcm9udG1hdHRlcj8uY292ZXI7XG4gICAgaWYgKHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIgJiYgcmF3LnRyaW0oKSkge1xuICAgICAgY29uc3QgbGlua3BhdGggPSByYXcudHJpbSgpLnJlcGxhY2UoL14hP1xcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0udHJpbSgpO1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChsaW5rcGF0aCwgc2YucGF0aCk7XG4gICAgICBpZiAocmVzb2x2ZWQgaW5zdGFuY2VvZiBURmlsZSAmJiBJTUdfRVhULmluY2x1ZGVzKHJlc29sdmVkLmV4dGVuc2lvbikpXG4gICAgICAgIHJldHVybiBhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKHJlc29sdmVkKTtcbiAgICB9XG4gIH1cbiAgLy8gMi4gRmFsbGJhY2s6IGFycXVpdm8gX2NvdmVyLiogbmEgcGFzdGFcbiAgZm9yIChjb25zdCBjIG9mIGZvbGRlci5jaGlsZHJlbikge1xuICAgIGlmIChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5iYXNlbmFtZSA9PT0gXCJfY292ZXJcIiAmJiBJTUdfRVhULmluY2x1ZGVzKGMuZXh0ZW5zaW9uKSlcbiAgICAgIHJldHVybiBhcHAudmF1bHQuZ2V0UmVzb3VyY2VQYXRoKGMpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiByZWFkRm9sZGVyU3RhdHVzKGFwcDogQXBwLCBmb2xkZXI6IFRGb2xkZXIpOiBTdGF0dXMge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IHMgPSBzZiAmJiBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShzZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnN0YXR1cztcbiAgcmV0dXJuIHMgPT09IFwicGF1c2VkXCIgfHwgcyA9PT0gXCJjYW5jZWxsZWRcIiA/IHMgOiBcInByb2dyZXNzXCI7XG59XG5cbmZ1bmN0aW9uIHJlYWROb3RlU3RhdHVzKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFN0YXR1cyB7XG4gIGNvbnN0IHMgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8uc3RhdHVzO1xuICByZXR1cm4gcyA9PT0gXCJwYXVzZWRcIiB8fCBzID09PSBcImNhbmNlbGxlZFwiID8gcyA6IFwicHJvZ3Jlc3NcIjtcbn1cblxuLy8gXHUwMENEY29uZSBkZWZpbmlkbyBlbSBgaWNvbjpgIG5vIHN0YXR1cy5tZCBkYSBwYXN0YSAoZW1vamkgb3UgaWQgTHVjaWRlKS4gbnVsbCBzZSBhdXNlbnRlLlxuZnVuY3Rpb24gcmVhZEZvbGRlckljb24oYXBwOiBBcHAsIGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBzZiA9IGZvbGRlci5jaGlsZHJlbi5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIFRGaWxlICYmIGMubmFtZSA9PT0gXCJzdGF0dXMubWRcIikgYXMgVEZpbGUgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IGljID0gc2YgJiYgYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoc2YucGF0aCk/LmZyb250bWF0dGVyPy5pY29uO1xuICByZXR1cm4gdHlwZW9mIGljID09PSBcInN0cmluZ1wiICYmIGljLnRyaW0oKSA/IGljLnRyaW0oKSA6IG51bGw7XG59XG5cbi8vIGlkIEx1Y2lkZSAoc1x1MDBGMyBbYS16MC05LV0pIFx1MjE5MiBzZXRJY29uIG5hdGl2bzsgY2FzbyBjb250clx1MDBFMXJpbyB0cmF0YSBjb21vIGVtb2ppL3RleHRvLlxuZnVuY3Rpb24gcmVuZGVySWNvbihlbDogSFRNTEVsZW1lbnQsIGljb246IHN0cmluZykge1xuICBpZiAoL15bYS16MC05LV0rJC8udGVzdChpY29uKSkgc2V0SWNvbihlbCwgaWNvbik7XG4gIGVsc2UgZWwuc2V0VGV4dChpY29uKTtcbn1cblxuLy8gQ29yIGVzdFx1MDBFMXZlbCBhIHBhcnRpciBkbyBub21lIChwYXJhIHBhc3RhcyBmb3JhIGRvIFBBUkEpLlxuZnVuY3Rpb24gYWNjZW50Rm9yKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIG5hbWUuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gIHJldHVybiBBQ0NFTlRTW2ggJSBBQ0NFTlRTLmxlbmd0aF07XG59XG5cbi8vIFx1MDBDRGNvbmUgLyByXHUwMEYzdHVsbyAvIGNvciBkZSB1bWEgcGFzdGEgZGUgdG9wbzogdXNhIG8gUEFSQSBzZSBjb25oZWNpZGEsIHNlblx1MDBFM28gZGVyaXZhLlxuZnVuY3Rpb24gZm9sZGVyTWV0YShhcHA6IEFwcCwgZm9sZGVyOiBURm9sZGVyKTogeyBpY29uOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IGFjY2VudDogc3RyaW5nIH0ge1xuICBjb25zdCBrbm93biA9IFBBUkFfTUFQLmdldChmb2xkZXIucGF0aCk7XG4gIGNvbnN0IGN1c3RvbSA9IHJlYWRGb2xkZXJJY29uKGFwcCwgZm9sZGVyKTtcbiAgcmV0dXJuIHtcbiAgICBpY29uOiAgIGN1c3RvbSA/PyBrbm93bj8uaWNvbiA/PyBcIlx1RDgzRFx1RENDMVwiLFxuICAgIGxhYmVsOiAga25vd24/LmxhYmVsID8/IGZvbGRlci5uYW1lLFxuICAgIGFjY2VudDoga25vd24/LmFjY2VudCA/PyBhY2NlbnRGb3IoZm9sZGVyLm5hbWUpLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXZlYWxJbkV4cGxvcmVyKGFwcDogQXBwLCB0YXJnZXQ6IHVua25vd24pIHtcbiAgdHlwZSBFeHBQbHVnaW4gPSB7IGluc3RhbmNlOiB7IHJldmVhbEluRm9sZGVyKGY6IHVua25vd24pOiB2b2lkIH0gfTtcbiAgY29uc3QgZXhwID0gKGFwcCBhcyBBcHAgJiB7XG4gICAgaW50ZXJuYWxQbHVnaW5zOiB7IGdldFBsdWdpbkJ5SWQoaWQ6IHN0cmluZyk6IEV4cFBsdWdpbiB8IG51bGwgfTtcbiAgfSkuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoXCJmaWxlLWV4cGxvcmVyXCIpO1xuICBpZiAoZXhwICYmIHRhcmdldCkgZXhwLmluc3RhbmNlLnJldmVhbEluRm9sZGVyKHRhcmdldCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jbGFzcyBEYXNoYm9hcmRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHdlZWtPZmZzZXQgPSAwO1xuICBwcml2YXRlIG5hdlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRpcDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzZWFyY2hUZXJtID0gXCJcIjtcbiAgcHJpdmF0ZSByZXZpZXdGaWx0ZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncm93dGhDdW11bGF0aXZlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcHJpdmF0ZSBwbHVnaW46IFdlcnVzRGFzaGJvYXJkKSB7IHN1cGVyKGxlYWYpOyB9XG5cbiAgZ2V0Vmlld1R5cGUoKSAgICB7IHJldHVybiBWSUVXX1RZUEU7IH1cbiAgZ2V0RGlzcGxheVRleHQoKSB7IHJldHVybiBcIkRhc2hib2FyZFwiOyB9XG4gIGdldEljb24oKSAgICAgICAgeyByZXR1cm4gXCJsYXlvdXQtZGFzaGJvYXJkXCI7IH1cblxuICBhc3luYyBvbk9wZW4oKSB7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXIoKTtcbiAgICBmb3IgKGNvbnN0IGV2IG9mIFtcIm1vZGlmeVwiLCBcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlbmFtZVwiXSBhcyBjb25zdClcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihldiBhcyBcIm1vZGlmeVwiLCAoKSA9PiB0aGlzLnNjaGVkdWxlKCkpKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKSB7IHRoaXMuaGlkZVRpcCgpOyB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZSgpIHtcbiAgICBpZiAodGhpcy50aW1lcikgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVuZGVyKCksIDQwMCk7XG4gIH1cblxuICAvLyBQcmltZWlybyBzZWdtZW50byBkZSB1bSBjYW1pbmhvIChcIjEwLlByb2plY3RzL0Zvby9CYXJcIiBcdTIxOTIgXCIxMC5Qcm9qZWN0c1wiKS5cbiAgcHJpdmF0ZSB0b3BGb2xkZXJPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGkgPSBwYXRoLmluZGV4T2YoXCIvXCIpO1xuICAgIHJldHVybiBpID09PSAtMSA/IHBhdGggOiBwYXRoLnNsaWNlKDAsIGkpO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIHRoaXMuaGlkZVRpcCgpO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgcm9vdC5hZGRDbGFzcyhcIndkLXJvb3RcIik7XG4gICAgcm9vdC50b2dnbGVDbGFzcyhcIndkLWNvbXBhY3RcIiwgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCk7XG5cbiAgICB0aGlzLnJlbmRlckhlYWRlcihyb290KTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcikge1xuICAgICAgaWYgKGlkID09PSBcImNhbGVuZGFyXCIpICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwicGFyYVwiKSAgICB0aGlzLnJlbmRlclBhcmEocm9vdCk7XG4gICAgICBlbHNlIGlmIChpZCA9PT0gXCJoZWF0bWFwXCIpIHRoaXMucmVuZGVySGVhdG1hcChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInJlcG9ydHNcIikgdGhpcy5yZW5kZXJSZXBvcnRzKHJvb3QpO1xuICAgICAgZWxzZSBpZiAoaWQgPT09IFwiZ3Jvd3RoXCIpICB0aGlzLnJlbmRlckdyb3d0aChyb290KTtcbiAgICAgIGVsc2UgaWYgKGlkID09PSBcInN0YXRzXCIpICAgdGhpcy5yZW5kZXJTdGF0cyhyb290KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQ29udHJvbGVzIGRlIG9yZGVtIGRlIHNlXHUwMEU3XHUwMEUzbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIG1vdmVDb250cm9scyhob3N0OiBIVE1MRWxlbWVudCwgaWQ6IFNlY3Rpb25JZCkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyO1xuICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGlkKTtcbiAgICBjb25zdCBjdHJsID0gaG9zdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbW92ZS1jdHJsXCIgfSk7XG5cbiAgICBjb25zdCB1cCA9IGN0cmwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1tb3ZlLWJ0blwiICsgKGkgPD0gMCA/IFwiIHdkLW1vdmUtb2ZmXCIgOiBcIlwiKSwgdGV4dDogXCJcdTI1QjJcIiB9KTtcbiAgICB1cC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3ZlciBzZVx1MDBFN1x1MDBFM28gcGFyYSBjaW1hXCIpO1xuICAgIGlmIChpID4gMCkgdXAub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLm1vdmVTZWN0aW9uKGlkLCAtMSk7IH07XG5cbiAgICBjb25zdCBkb3duID0gY3RybC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW1vdmUtYnRuXCIgKyAoaSA+PSBvcmRlci5sZW5ndGggLSAxID8gXCIgd2QtbW92ZS1vZmZcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjVCQ1wiIH0pO1xuICAgIGRvd24uc2V0QXR0cihcInRpdGxlXCIsIFwiTW92ZXIgc2VcdTAwRTdcdTAwRTNvIHBhcmEgYmFpeG9cIik7XG4gICAgaWYgKGkgPCBvcmRlci5sZW5ndGggLSAxKSBkb3duLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5tb3ZlU2VjdGlvbihpZCwgKzEpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBtb3ZlU2VjdGlvbihpZDogU2VjdGlvbklkLCBkaXI6IG51bWJlcikge1xuICAgIGNvbnN0IG9yZGVyID0gWy4uLnRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rpb25PcmRlcl07XG4gICAgY29uc3QgaSA9IG9yZGVyLmluZGV4T2YoaWQpO1xuICAgIGNvbnN0IGogPSBpICsgZGlyO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBqID49IG9yZGVyLmxlbmd0aCkgcmV0dXJuO1xuICAgIFtvcmRlcltpXSwgb3JkZXJbal1dID0gW29yZGVyW2pdLCBvcmRlcltpXV07XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdGlvbk9yZGVyID0gb3JkZXI7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBPY3VsdGFyIC8gcmVzdGF1cmFyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgaXNIaWRkZW4oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuLmluY2x1ZGVzKGtleSk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVCdG4oaG9zdDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBjbHMgPSBcIndkLWhpZGUtYnRuXCIpIHtcbiAgICBjb25zdCBiID0gaG9zdC5jcmVhdGVTcGFuKHsgY2xzIH0pO1xuICAgIHNldEljb24oYiwgXCJleWUtb2ZmXCIpO1xuICAgIGIuc2V0QXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICBiLm9uY2xpY2sgPSBlID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgdGhpcy5oaWRlSXRlbShrZXkpOyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoaWRlSXRlbShrZXk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKGtleSkpIHJldHVybjtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oaWRkZW4ucHVzaChrZXkpO1xuICAgIC8vIFNlIGVzdFx1MDBFMXZhbW9zIGRlbnRybyBkYSBwYXN0YSBxdWUgYWNhYm91IGRlIHNlciBvY3VsdGEsIGZlY2hhIG8gbmF2ZWdhZG9yLlxuICAgIGlmICh0aGlzLm5hdlBhdGggJiYgKHRoaXMubmF2UGF0aCA9PT0ga2V5IHx8IHRoaXMubmF2UGF0aC5zdGFydHNXaXRoKGtleSArIFwiL1wiKSkpIHRoaXMubmF2UGF0aCA9IG51bGw7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdW5oaWRlSXRlbShrZXk6IHN0cmluZykge1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmhpZGRlbi5maWx0ZXIoayA9PiBrICE9PSBrZXkpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGhpZGRlbkxhYmVsKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoa2V5ID09PSBTRUNfQ0FMKSByZXR1cm4gXCJcdUQ4M0RcdURDQzUgQ2FsZW5kXHUwMEUxcmlvXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX1JFUCkgcmV0dXJuIFwiXHVEODNEXHVEQ0M0IFJlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfSEVBVCkgcmV0dXJuIFwiXHVEODNEXHVERDI1IEhlYXRtYXBcIjtcbiAgICBpZiAoa2V5ID09PSBTRUNfR1JPVykgcmV0dXJuIFwiXHVEODNEXHVEQ0M4IENyZXNjaW1lbnRvXCI7XG4gICAgaWYgKGtleSA9PT0gU0VDX1NUQVQpIHJldHVybiBcIlx1RDgzRFx1RENDQSBFc3RhdFx1MDBFRHN0aWNhc1wiO1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoa2V5KTtcbiAgICByZXR1cm4gZiBpbnN0YW5jZW9mIFRGb2xkZXIgPyBmLm5hbWUgOiBrZXk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckhpZGRlbkJhcihwYXJlbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaGlkZGVuID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGlkZGVuO1xuICAgIGlmICghaGlkZGVuLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJhciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGlkZGVuLWJhclwiIH0pO1xuICAgIGJhci5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWhpZGRlbi1sYWJlbFwiLCB0ZXh0OiBcIm9jdWx0b3M6XCIgfSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgaGlkZGVuKSB7XG4gICAgICBjb25zdCBjaGlwID0gYmFyLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaGlkZGVuLWNoaXBcIiB9KTtcbiAgICAgIHNldEljb24oY2hpcC5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNoaXAtaWNvblwiIH0pLCBcImV5ZVwiKTtcbiAgICAgIGNoaXAuY3JlYXRlU3Bhbih7IHRleHQ6IHRoaXMuaGlkZGVuTGFiZWwoa2V5KSB9KTtcbiAgICAgIGNoaXAuc2V0QXR0cihcInRpdGxlXCIsIFwiTW9zdHJhciBub3ZhbWVudGVcIik7XG4gICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB0aGlzLnVuaGlkZUl0ZW0oa2V5KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgVG9vbHRpcCBkZSBub3RhcyByZWNlbnRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHNob3dUaXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgZmlsZXM6IFRGaWxlW10pIHtcbiAgICB0aGlzLmhpZGVUaXAoKTtcbiAgICBjb25zdCB0aXAgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC10b29sdGlwXCIgfSk7XG4gICAgdGlwLmNyZWF0ZURpdih7IGNsczogXCJ3ZC10aXAtdGl0bGVcIiwgdGV4dDogXCJNb2RpZmljYWRhcyByZWNlbnRlbWVudGVcIiB9KTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRpcC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGlwLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtdGlwLW5hbWVcIiwgdGV4dDogZi5iYXNlbmFtZSB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXRpcC1kYXRlXCIsIHRleHQ6IGZtdFNob3J0KGYuc3RhdC5tdGltZSkgfSk7XG4gICAgfVxuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdHcgPSB0aXAub2Zmc2V0V2lkdGgsIHRoID0gdGlwLm9mZnNldEhlaWdodDtcbiAgICBsZXQgbGVmdCA9IHJlY3QubGVmdDtcbiAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyA2O1xuICAgIGlmIChsZWZ0ICsgdHcgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDgpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHR3IC0gODtcbiAgICBpZiAodG9wICsgdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4KSB0b3AgPSByZWN0LnRvcCAtIHRoIC0gNjsgIC8vIHZpcmEgcGFyYSBjaW1hIHNlIGZhbHRhciBlc3BhXHUwMEU3b1xuICAgIHRpcC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5tYXgoOCwgbGVmdCl9cHhgO1xuICAgIHRpcC5zdHlsZS50b3AgID0gYCR7TWF0aC5tYXgoOCwgdG9wKX1weGA7XG4gICAgdGhpcy50aXAgPSB0aXA7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUaXAoKSB7XG4gICAgaWYgKHRoaXMudGlwKSB7IHRoaXMudGlwLnJlbW92ZSgpOyB0aGlzLnRpcCA9IG51bGw7IH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoVGlwKGNhcmQ6IEhUTUxFbGVtZW50LCBmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICBjb25zdCByZWNlbnRzID0gcmVjZW50Tm90ZXMoZm9sZGVyLCA0KTtcbiAgICBpZiAoIXJlY2VudHMubGVuZ3RoKSByZXR1cm47XG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUaXAoY2FyZCwgcmVjZW50cykpO1xuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVGlwKCkpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhbGVuZFx1MDBFMXJpbyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBwcml2YXRlIHJlbmRlckNhbGVuZGFyKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0NBTCkpIHJldHVybjtcblxuICAgIGNvbnN0IG1vbmRheSAgPSBtb25kYXlPZih0aGlzLndlZWtPZmZzZXQpO1xuICAgIGNvbnN0IHdlZWtOdW0gPSBpc29XZWVrTnVtYmVyKG1vbmRheSk7XG4gICAgY29uc3QgdG9kYXlLICA9IHRvS2V5KG5ldyBEYXRlKCkpO1xuXG4gICAgY29uc3QgYnlEYXk6IFJlY29yZDxzdHJpbmcsIHsgbmFtZTogc3RyaW5nOyBmaWxlOiBURmlsZSB9W10+ID0ge307XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgY29uc3QgZCA9IG5vcm1hbGl6ZURhdGUodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpPy5mcm9udG1hdHRlcj8uZGF0ZSk7XG4gICAgICBpZiAoZCkgKGJ5RGF5W2RdID8/PSBbXSkucHVzaCh7IG5hbWU6IGZpbGUuYmFzZW5hbWUsIGZpbGUgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvbiB3ZC1jYWwtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IG5hdiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLW5hdi1iYXJcIiB9KTtcbiAgICBuYXYuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jYWwtd2Vlay1sYWJlbFwiLCB0ZXh0OiBgU2VtYW5hICR7d2Vla051bX1gIH0pO1xuXG4gICAgY29uc3QgY3RybHMgPSBuYXYuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1jdHJsc1wiIH0pO1xuICAgIGNvbnN0IHByZXYgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzOVwiIH0pO1xuICAgIGNvbnN0IG5leHQgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNhbC1hcnJvd1wiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgIHByZXYub25jbGljayA9ICgpID0+IHsgdGhpcy53ZWVrT2Zmc2V0LS07IHRoaXMucmVuZGVyKCk7IH07XG4gICAgbmV4dC5vbmNsaWNrID0gKCkgPT4geyB0aGlzLndlZWtPZmZzZXQrKzsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJjYWxlbmRhclwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19DQUwsIFwiT2N1bHRhciBjYWxlbmRcdTAwRTFyaW9cIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIGNvbnN0IGdyaWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1ncmlkXCIgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgICBkYXkuc2V0RGF0ZShtb25kYXkuZ2V0RGF0ZSgpICsgaSk7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkYXkpO1xuICAgICAgY29uc3QgY29sID0gZ3JpZC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFtcIndkLWNhbC1jb2xcIiwga2V5ID09PSB0b2RheUsgPyBcIndkLXRvZGF5XCIgOiBcIlwiLCBpID49IDUgPyBcIndkLXdlZWtlbmRcIiA6IFwiXCJdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGQgPSBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1oZFwiIH0pO1xuICAgICAgaGQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhbC1uYW1lXCIsIHRleHQ6IERBWV9TSE9SVFtpXSB9KTtcbiAgICAgIGhkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbnVtXCIsICB0ZXh0OiBTdHJpbmcoZGF5LmdldERhdGUoKSkgfSk7XG4gICAgICBoZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJBYnJpciAvIGNyaWFyIG5vdGEgZGlcdTAwRTFyaWFcIik7XG4gICAgICBoZC5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHZvaWQgdGhpcy5vcGVuRGFpbHlOb3RlKGtleSk7IH07XG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gYnlEYXlba2V5XSA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMuc2xpY2UoMCwgMykpIHtcbiAgICAgICAgY29uc3QgcGlsbCA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FsLXBpbGxcIiB9KTtcbiAgICAgICAgcGlsbC50ZXh0Q29udGVudCA9IGl0Lm5hbWUubGVuZ3RoID4gMTQgPyBpdC5uYW1lLnNsaWNlKDAsIDE0KSArIFwiXHUyMDI2XCIgOiBpdC5uYW1lO1xuICAgICAgICBwaWxsLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoaXQuZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMykgY29sLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYWwtbW9yZVwiLCB0ZXh0OiBgKyR7aXRlbXMubGVuZ3RoIC0gM31gIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKG1vbmRheSk7XG4gICAgZW5kLnNldERhdGUobW9uZGF5LmdldERhdGUoKSArIDYpO1xuICAgIHNlYy5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBcIndkLWNhbC1mb290ZXJcIixcbiAgICAgIHRleHQ6IG1vbmRheS5nZXRNb250aCgpID09PSBlbmQuZ2V0TW9udGgoKVxuICAgICAgICA/IGAke01PTlRIX1NIT1JUW21vbmRheS5nZXRNb250aCgpXX0gJHttb25kYXkuZ2V0RnVsbFllYXIoKX1gXG4gICAgICAgIDogYCR7TU9OVEhfU0hPUlRbbW9uZGF5LmdldE1vbnRoKCldfSBcdTIwMTMgJHtNT05USF9TSE9SVFtlbmQuZ2V0TW9udGgoKV19ICR7ZW5kLmdldEZ1bGxZZWFyKCl9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFicmUgYSBub3RhIGRpXHUwMEUxcmlhIGRlIGBrZXlgIChZWVlZLU1NLUREKTsgY3JpYSBlbSA1MC5EaVx1MDBFMXJpby8gc2Ugblx1MDBFM28gZXhpc3Rpci5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuRGFpbHlOb3RlKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aCA9IGAke0RBSUxZX0ZPTERFUn0vJHtrZXl9Lm1kYDtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcblxuICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgIC8vIEdhcmFudGUgYSBwYXN0YSByYWl6IChjYXNvIHRlbmhhIHNpZG8gcmVtb3ZpZGEpLlxuICAgICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfRk9MREVSKSlcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKERBSUxZX0ZPTERFUikuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBrZXkuc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3QgdGl0dWxvID0gbmV3IERhdGUoK3ksICttIC0gMSwgK2QpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIsIHtcbiAgICAgICAgd2Vla2RheTogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVXNhIG8gdGVtcGxhdGUgZW0gTW9kZWxvcy8gc2UgZXhpc3Rpcjsgc2VuXHUwMEUzbywgZmFsbGJhY2sgZW1idXRpZG8uXG4gICAgICBjb25zdCB0cGwgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoREFJTFlfVEVNUExBVEUpO1xuICAgICAgbGV0IGJvZHk6IHN0cmluZztcbiAgICAgIGlmICh0cGwgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICBib2R5ID0gKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodHBsKSlcbiAgICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmRhdGVcXHMqXFx9XFx9L2csIGtleSlcbiAgICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKnRpdGxlXFxzKlxcfVxcfS9nLCB0aXR1bG8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9keSA9XG5gLS0tXG5vd25lcjogV2VydXNcbmNyZWF0ZWQ6ICR7a2V5fVxuZGF0ZTogJHtrZXl9XG5yZXZpZXdlZDogdHJ1ZVxudHlwZTogZGFpbHlcbnBlcm1pc3Npb25zOlxuICByZWFkOiBbYWxsXVxuICB3cml0ZTpcbiAgICAtIFdlcnVzXG4tLS1cblxuIyAke3RpdHVsb31cblxuYDtcbiAgICAgIH1cbiAgICAgIGZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUocGF0aCwgYm9keSk7XG4gICAgfVxuXG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGZpbGUpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRzIGRvIGNvZnJlICh0b2RhcyBhcyBwYXN0YXMgZGUgdG9wbykgKyBuYXZlZ2Fkb3IgYW5pbmhhZG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJQYXJhKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3Qgc2VjID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQ09GUkVcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhoZWFkLCBcInBhcmFcIik7XG5cbiAgICBjb25zdCBncmlkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wYXJhLWdyaWRcIiB9KTtcbiAgICBjb25zdCB2YXVsdFJvb3QgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgY29uc3QgZm9sZGVycyA9ICh2YXVsdFJvb3QuY2hpbGRyZW4uZmlsdGVyKGMgPT4gYyBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXSlcbiAgICAgIC5maWx0ZXIoZiA9PiAhZi5uYW1lLnN0YXJ0c1dpdGgoXCIuXCIpKSAgIC8vIGlnbm9yYSAub2JzaWRpYW4sIC50cmFzaCwgZXRjLlxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgXCJwdFwiKSk7XG4gICAgY29uc3QgYWN0aXZlUm9vdCA9IHRoaXMubmF2UGF0aCA/IHRoaXMudG9wRm9sZGVyT2YodGhpcy5uYXZQYXRoKSA6IG51bGw7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGZvbGRlciBvZiBmb2xkZXJzKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbihmb2xkZXIucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBtZXRhICAgID0gZm9sZGVyTWV0YSh0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIGNvbnN0IHN0YXRzICAgPSBmb2xkZXJTdGF0cyhmb2xkZXIpO1xuICAgICAgY29uc3QgY292ZXIgICA9IGNvdmVySW5Gb2xkZXIodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBuYXZpZ2FibGUgPSBzdWJGb2xkZXJzKGZvbGRlcikubGVuZ3RoID4gMCB8fCBub3Rlc0luKGZvbGRlcikubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlUm9vdCA9PT0gZm9sZGVyLnBhdGg7XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBncmlkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkIHdkLXBhcmEtY2FyZCB3ZC1hbmltLWluXCIgKyAoaXNBY3RpdmUgPyBcIiB3ZC1hY3RpdmVcIiA6IFwiXCIpIH0pO1xuICAgICAgY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcbiAgICAgIGNhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtpZHggKiA0MH1tc2A7XG4gICAgICBpZHgrKztcblxuICAgICAgaWYgKGNvdmVyKSB7XG4gICAgICAgIGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyXCIgfSkuY3JlYXRlRWwoXCJpbWdcIiwgeyBhdHRyOiB7IHNyYzogY292ZXIsIGRyYWdnYWJsZTogXCJmYWxzZVwiIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNvdmVyIHdkLWNvdmVyLWRlZmF1bHRcIiB9KTtcbiAgICAgICAgcmVuZGVySWNvbihkYy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNvdmVyLWdseXBoXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB9XG4gICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1hY2NlbnQtYmFyXCIgfSkuc3R5bGUuYmFja2dyb3VuZCA9IG1ldGEuYWNjZW50O1xuXG4gICAgICB0aGlzLmhpZGVCdG4oY2FyZCwgZm9sZGVyLnBhdGgsIGBPY3VsdGFyIFwiJHttZXRhLmxhYmVsfVwiYCk7XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLWJvZHlcIiB9KTtcbiAgICAgIGNvbnN0IHRvcCAgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1jYXJkLXRvcFwiIH0pO1xuICAgICAgcmVuZGVySWNvbih0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1pY29uXCIgfSksIG1ldGEuaWNvbik7XG4gICAgICB0b3AuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jb3VudFwiLCB0ZXh0OiBjb3VudFRleHQoc3RhdHMpIH0pO1xuICAgICAgYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtbGFiZWxcIiwgIHRleHQ6IG1ldGEubGFiZWwgfSk7XG4gICAgICBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1mb2xkZXJcIiwgdGV4dDogZm9sZGVyLnBhdGggfSk7XG4gICAgICBpZiAobmF2aWdhYmxlKSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1oYXMtc3Vic1wiLCB0ZXh0OiBpc0FjdGl2ZSA/IFwiZmVjaGFyIFx1MjVCRVwiIDogXCJhYnJpciBcdTIwM0FcIiB9KTtcblxuICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBmb2xkZXIpO1xuICAgICAgaWYgKHJ2LnRvdGFsID4gMCkge1xuICAgICAgICBjb25zdCBiYXIgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9ncmVzc1wiIH0pO1xuICAgICAgICBiYXIuc2V0QXR0cihcInRpdGxlXCIsIGAke3J2LnJldmlld2VkfS8ke3J2LnRvdGFsfSByZXZpc2FkYXNgKTtcbiAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICBmaWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChydi5yZXZpZXdlZCAvIHJ2LnRvdGFsICogMTAwKX0lYDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgZm9sZGVyKTtcblxuICAgICAgY2FyZC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAobmF2aWdhYmxlKSB7IHRoaXMubmF2UGF0aCA9IGlzQWN0aXZlID8gbnVsbCA6IGZvbGRlci5wYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9XG4gICAgICAgIGVsc2UgcmV2ZWFsSW5FeHBsb3Jlcih0aGlzLmFwcCwgZm9sZGVyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFpZHgpIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJOZW5odW1hIHBhc3RhIHZpc1x1MDBFRHZlbC5cIiB9KTtcblxuICAgIC8vIEFycXVpdm9zIHNvbHRvcyBuYSByYWl6IGRvIGNvZnJlXG4gICAgY29uc3Qgcm9vdEZpbGVzID0gbm90ZXNJbih2YXVsdFJvb3QpO1xuICAgIHRoaXMucmVuZGVyTm90ZXMoc2VjLCByb290RmlsZXMsIFwiYXJxdWl2b3MgbmEgcmFpelwiKTtcblxuICAgIGlmICh0aGlzLm5hdlBhdGgpIHtcbiAgICAgIGNvbnN0IGZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLm5hdlBhdGgpO1xuICAgICAgaWYgKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpIHRoaXMucmVuZGVyQnJvd3NlcihzZWMsIGZvbGRlcik7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJIaWRkZW5CYXIoc2VjKTtcbiAgfVxuXG4gIC8vIFBhaW5lbCBpbmxpbmUgbmF2ZWdcdTAwRTF2ZWwgKGJyZWFkY3J1bWIgKyBzdWJwYXN0YXMgKyBub3RhcyBkYSBwYXN0YSBhdHVhbClcbiAgcHJpdmF0ZSByZW5kZXJCcm93c2VyKHBhcmVudDogSFRNTEVsZW1lbnQsIGZvbGRlcjogVEZvbGRlcikge1xuICAgIGNvbnN0IHJvb3RQYXRoID0gdGhpcy50b3BGb2xkZXJPZihmb2xkZXIucGF0aCk7XG4gICAgY29uc3Qgcm9vdEZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyb290UGF0aCk7XG4gICAgaWYgKCEocm9vdEZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSByZXR1cm47XG4gICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIHJvb3RGb2xkZXIpO1xuXG4gICAgY29uc3QgcGFuZWwgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXBhbmVsXCIgfSk7XG4gICAgcGFuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG5cbiAgICAvLyBCcmVhZGNydW1iXG4gICAgY29uc3QgY3J1bWIgPSBwYW5lbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY3J1bWJcIiB9KTtcbiAgICBjb25zdCByZWwgPSBmb2xkZXIucGF0aCA9PT0gcm9vdFBhdGggPyBbXSA6IGZvbGRlci5wYXRoLnNsaWNlKHJvb3RQYXRoLmxlbmd0aCArIDEpLnNwbGl0KFwiL1wiKTtcblxuICAgIGNvbnN0IHJvb3RTZWcgPSBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlZ1wiICsgKHJlbC5sZW5ndGggPT09IDAgPyBcIiB3ZC1jcnVtYi1jdXJcIiA6IFwiXCIpIH0pO1xuICAgIHJlbmRlckljb24ocm9vdFNlZy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICByb290U2VnLmNyZWF0ZVNwYW4oeyB0ZXh0OiBtZXRhLmxhYmVsIH0pO1xuICAgIGlmIChyZWwubGVuZ3RoKSByb290U2VnLm9uY2xpY2sgPSAoKSA9PiB7IHRoaXMubmF2UGF0aCA9IHJvb3RQYXRoOyB0aGlzLnNlYXJjaFRlcm0gPSBcIlwiOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgbGV0IGFjYyA9IHJvb3RQYXRoO1xuICAgIHJlbC5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XG4gICAgICBjcnVtYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWNydW1iLXNlcFwiLCB0ZXh0OiBcIlx1MjAzQVwiIH0pO1xuICAgICAgY29uc3QgaXNMYXN0ID0gaSA9PT0gcmVsLmxlbmd0aCAtIDE7XG4gICAgICBhY2MgPSBgJHthY2N9LyR7cGFydH1gO1xuICAgICAgY29uc3Qgc2VnUGF0aCA9IGFjYztcbiAgICAgIGNvbnN0IHNlZyA9IGNydW1iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY3J1bWItc2VnXCIgKyAoaXNMYXN0ID8gXCIgd2QtY3J1bWItY3VyXCIgOiBcIlwiKSwgdGV4dDogcGFydCB9KTtcbiAgICAgIGlmICghaXNMYXN0KSBzZWcub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2VnUGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3NlID0gY3J1bWIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1jcnVtYi1jbG9zZVwiLCB0ZXh0OiBcIlx1MjcxNVwiIH0pO1xuICAgIGNsb3NlLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkZlY2hhclwiKTtcbiAgICBjbG9zZS5vbmNsaWNrID0gKCkgPT4geyB0aGlzLm5hdlBhdGggPSBudWxsOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgLy8gQ2FtcG8gZGUgYnVzY2FcbiAgICBjb25zdCBzZWFyY2hXcmFwID0gcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYXJjaC13cmFwXCIgfSk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hXcmFwLmNyZWF0ZUVsKFwiaW5wdXRcIiwge1xuICAgICAgY2xzOiBcIndkLXNlYXJjaFwiLFxuICAgICAgYXR0cjogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiZmlsdHJhclx1MjAyNlwiLCB2YWx1ZTogdGhpcy5zZWFyY2hUZXJtIH0sXG4gICAgfSk7XG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcGFuZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIud2Qtc3ViLWNhcmRcIikuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxibCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2QtbGFiZWxcIik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBsYmwuaW5jbHVkZXModGVybSkgPyBcIlwiIDogXCJub25lXCI7XG4gICAgICB9KTtcbiAgICAgIHBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLndkLW5vdGUtcm93LCAud2Qtbm90ZS1jYXJkXCIpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsLnF1ZXJ5U2VsZWN0b3IoXCIud2Qtbm90ZS1uYW1lLCAud2Qtbm90ZS1jYXJkLW5hbWVcIik/LnRleHRDb250ZW50ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBuYW1lLmluY2x1ZGVzKHRlcm0pID8gXCJcIiA6IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBTdWJwYXN0YXMgY29tbyBjYXJkc1xuICAgIGNvbnN0IHN1YnMgPSBzdWJGb2xkZXJzKGZvbGRlcik7XG4gICAgaWYgKHN1YnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZ3JpZCA9IHBhbmVsLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1wcm9qLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3Qgc2Ygb2Ygc3Vicykge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSByZWFkRm9sZGVyU3RhdHVzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgIGNvbnN0IHN0YXRzICA9IGZvbGRlclN0YXRzKHNmKTtcbiAgICAgICAgY29uc3QgY292ZXIgID0gY292ZXJJbkZvbGRlcih0aGlzLmFwcCwgc2YpO1xuICAgICAgICBjb25zdCBkZWVwZXIgPSBzdWJGb2xkZXJzKHNmKS5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBjdXN0b21JY29uID0gcmVhZEZvbGRlckljb24odGhpcy5hcHAsIHNmKTtcblxuICAgICAgICBjb25zdCBjYXJkID0gc2dyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2QtY2FyZCB3ZC1zdWItY2FyZCB3ZC1zLSR7c3RhdHVzfWAgfSk7XG4gICAgICAgIGNhcmQuc3R5bGUuc2V0UHJvcGVydHkoXCItLWFjY2VudFwiLCBtZXRhLmFjY2VudCk7XG4gICAgICAgIGlmIChjb3ZlcikgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY292ZXJcIiB9KS5jcmVhdGVFbChcImltZ1wiLCB7IGF0dHI6IHsgc3JjOiBjb3ZlciwgZHJhZ2dhYmxlOiBcImZhbHNlXCIgfSB9KTtcblxuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogYHdkLWJhZGdlIHdkLWJhZGdlLSR7c3RhdHVzfWAsIHRleHQ6IFNUQVRVU19JQ09OW3N0YXR1c10gfSk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWNhcmQtYm9keVwiIH0pO1xuICAgICAgICBjb25zdCB0b3AgID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtY2FyZC10b3BcIiB9KTtcbiAgICAgICAgaWYgKGN1c3RvbUljb24pIHJlbmRlckljb24odG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtaWNvbiB3ZC1zdWItaWNvblwiIH0pLCBjdXN0b21JY29uKTtcbiAgICAgICAgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2QtY291bnRcIiwgdGV4dDogY291bnRUZXh0KHN0YXRzKSB9KTtcbiAgICAgICAgaWYgKGRlZXBlcikgdG9wLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3ViLWFycm93XCIsIHRleHQ6IFwiXHUyMDNBXCIgfSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1sYWJlbFwiLCB0ZXh0OiBzZi5uYW1lIH0pO1xuICAgICAgICBpZiAoc3RhdHVzID09PSBcImNhbmNlbGxlZFwiKSBsYWJlbC5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICAgICAgY29uc3QgcnYgPSByZXZpZXdlZFN0YXRzKHRoaXMuYXBwLCBzZik7XG4gICAgICAgICAgaWYgKHJ2LnRvdGFsID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYmFyID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgICAgICAgIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7cnYucmV2aWV3ZWR9LyR7cnYudG90YWx9IHJldmlzYWRhc2ApO1xuICAgICAgICAgICAgY29uc3QgZmlsbCA9IGJhci5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcHJvZ3Jlc3MtZmlsbFwiIH0pO1xuICAgICAgICAgICAgZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocnYucmV2aWV3ZWQgLyBydi50b3RhbCAqIDEwMCl9JWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJjYW5jZWxsZWRcIikge1xuICAgICAgICAgIGNhcmQuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hUaXAoY2FyZCwgc2YpO1xuICAgICAgICAgIGNhcmQub25jbGljayA9ICgpID0+IHsgdGhpcy5uYXZQYXRoID0gc2YucGF0aDsgdGhpcy5zZWFyY2hUZXJtID0gXCJcIjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGFzIGRhIHBhc3RhIGF0dWFsXG4gICAgY29uc3Qgbm90ZXMgPSBub3Rlc0luKGZvbGRlcik7XG4gICAgdGhpcy5yZW5kZXJOb3RlcyhwYW5lbCwgbm90ZXMpO1xuXG4gICAgaWYgKCFzdWJzLmxlbmd0aCAmJiAhbm90ZXMubGVuZ3RoKVxuICAgICAgcGFuZWwuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWVtcHR5XCIsIHRleHQ6IFwiUGFzdGEgdmF6aWEuXCIgfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUmVsYXRcdTAwRjNyaW9zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIHByaXZhdGUgcmVuZGVyUmVwb3J0cyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19SRVApKSByZXR1cm47XG5cbiAgICBjb25zdCBkaXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCI0MC5BcmNoaXZlL1JlbGF0XHUwMEYzcmlvcyBDbGF1ZGVcIik7XG4gICAgaWYgKCEoZGlyIGluc3RhbmNlb2YgVEZvbGRlcikpIHJldHVybjtcbiAgICBjb25zdCBpdGVtczogeyBmaWxlOiBURmlsZTsgZGF0ZTogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiBkaXIuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghKGMgaW5zdGFuY2VvZiBURmlsZSkgfHwgYy5leHRlbnNpb24gIT09IFwibWRcIikgY29udGludWU7XG4gICAgICBjb25zdCBkID0gbm9ybWFsaXplRGF0ZSh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGMucGF0aCk/LmZyb250bWF0dGVyPy5kYXRlKTtcbiAgICAgIGlmIChkKSBpdGVtcy5wdXNoKHsgZmlsZTogYywgZGF0ZTogZCB9KTtcbiAgICB9XG4gICAgaXRlbXMuc29ydCgoYSwgYikgPT4gYi5kYXRlLmxvY2FsZUNvbXBhcmUoYS5kYXRlKSk7XG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIlJFTEFUXHUwMEQzUklPUyBDTEFVREVcIiB9KTtcbiAgICBjb25zdCBjdHJscyA9IGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1jdHJsc1wiIH0pO1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcInJlcG9ydHNcIik7XG4gICAgdGhpcy5oaWRlQnRuKGN0cmxzLCBTRUNfUkVQLCBcIk9jdWx0YXIgUmVsYXRcdTAwRjNyaW9zIENsYXVkZVwiLCBcIndkLXNlYy1oaWRlXCIpO1xuXG4gICAgY29uc3QgbGlzdCA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtcmVwb3J0LWxpc3RcIiB9KTtcbiAgICBmb3IgKGNvbnN0IHsgZmlsZSwgZGF0ZSB9IG9mIGl0ZW1zLnNsaWNlKDAsIDYpKSB7XG4gICAgICBjb25zdCBbeSwgbSwgZF0gPSBkYXRlLnNwbGl0KFwiLVwiKTtcbiAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXJlcG9ydC1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXJlcG9ydC1kYXRlXCIsIHRleHQ6IGAke2R9LyR7bX0vJHt5fWAgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1yZXBvcnQtbmFtZVwiLCB0ZXh0OiBmaWxlLmJhc2VuYW1lIH0pO1xuICAgICAgcm93Lm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZmlsZSk7XG4gICAgICB2b2lkIHk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEhlYXRtYXAgKHZpYSBwbHVnaW4gSGVhdG1hcCBDYWxlbmRhcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWF0bWFwKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oU0VDX0hFQVQpKSByZXR1cm47XG5cbiAgICBjb25zdCBzZWMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWN0aW9uIHdkLWhlYXQtc2VjdGlvblwiIH0pO1xuICAgIGNvbnN0IGhlYWQgPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1oZWFkXCIgfSk7XG4gICAgaGVhZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc2VjLWxhYmVsXCIsIHRleHQ6IFwiQVRJVklEQURFIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJoZWF0bWFwXCIpO1xuICAgIHRoaXMuaGlkZUJ0bihjdHJscywgU0VDX0hFQVQsIFwiT2N1bHRhciBoZWF0bWFwXCIsIFwid2Qtc2VjLWhpZGVcIik7XG5cbiAgICBjb25zdCByZW5kZXIgPSBnZXRIZWF0bWFwUmVuZGVyZXIoKTtcbiAgICBpZiAoIXJlbmRlcikge1xuICAgICAgc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1lbXB0eVwiLCB0ZXh0OiAnQXRpdmUgbyBwbHVnaW4gXCJIZWF0bWFwIENhbGVuZGFyXCIgcGFyYSB2ZXIgYSBhdGl2aWRhZGUuJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3RhcyBjcmlhZGFzIHBvciBkaWEsIG5vIGFubyBjb3JyZW50ZS5cbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGNvdW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShmLnN0YXQuY3RpbWUpO1xuICAgICAgaWYgKGQuZ2V0RnVsbFllYXIoKSAhPT0geWVhcikgY29udGludWU7XG4gICAgICBjb25zdCBrZXkgPSB0b0tleShkKTtcbiAgICAgIGNvdW50c1trZXldID0gKGNvdW50c1trZXldID8/IDApICsgMTtcbiAgICB9XG4gICAgY29uc3QgZW50cmllczogSGVhdG1hcEVudHJ5W10gPSBPYmplY3QuZW50cmllcyhjb3VudHMpLm1hcCgoW2RhdGUsIG5dKSA9PiAoe1xuICAgICAgZGF0ZSwgaW50ZW5zaXR5OiBuLCBjb2xvcjogXCJncmVlblwiLCBjb250ZW50OiBgJHtufSBub3RhKHMpYCxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBib3ggPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWhlYXQtYm94XCIgfSk7XG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlcihib3gsIHtcbiAgICAgICAgeWVhcixcbiAgICAgICAgY29sb3JzOiB7IGdyZWVuOiBbXCIjMWUzYTJmXCIsIFwiIzFmNmY0M1wiLCBcIiMyYmE4NWFcIiwgXCIjMzlkMzUzXCJdIH0sXG4gICAgICAgIHNob3dDdXJyZW50RGF5Qm9yZGVyOiB0cnVlLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZWMuZW1wdHkoKTtcbiAgICAgIHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogXCJGYWxoYSBhbyByZW5kZXJpemFyIG8gaGVhdG1hcC5cIiB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRXN0YXRcdTAwRURzdGljYXMgZG8gY29mcmUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJTdGF0cyhyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKFNFQ19TVEFUKSkgcmV0dXJuO1xuXG4gICAgbGV0IHRvdGFsTm90ZXMgPSAwLCB0b3RhbFJldmlld2VkID0gMCwgY3JlYXRlZFRoaXNXZWVrID0gMDtcbiAgICBjb25zdCB3ZWVrQWdvID0gRGF0ZS5ub3coKSAtIDcgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLm5hbWUgPT09IFwic3RhdHVzLm1kXCIpIGNvbnRpbnVlO1xuICAgICAgdG90YWxOb3RlcysrO1xuICAgICAgaWYgKHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlKSB0b3RhbFJldmlld2VkKys7XG4gICAgICBpZiAoZi5zdGF0LmN0aW1lID49IHdlZWtBZ28pIGNyZWF0ZWRUaGlzV2VlaysrO1xuICAgIH1cbiAgICBjb25zdCBnbG9iYWxQY3QgPSB0b3RhbE5vdGVzID4gMCA/IE1hdGgucm91bmQodG90YWxSZXZpZXdlZCAvIHRvdGFsTm90ZXMgKiAxMDApIDogMDtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkVTVEFUXHUwMENEU1RJQ0FTXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICB0aGlzLm1vdmVDb250cm9scyhjdHJscywgXCJzdGF0c1wiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19TVEFULCBcIk9jdWx0YXIgZXN0YXRcdTAwRURzdGljYXNcIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIC8vIE5cdTAwRkFtZXJvcyBnbG9iYWlzXG4gICAgY29uc3QgZ2xvYiA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1nbG9iYWxcIiB9KTtcbiAgICBnbG9iLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtc3RhdC1iaWdcIiwgdGV4dDogU3RyaW5nKHRvdGFsTm90ZXMpIH0pO1xuICAgIGdsb2IuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LW1pZFwiLCB0ZXh0OiBcIm5vdGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtYmlnIHdkLXN0YXQtcmV2LW51bVwiLCB0ZXh0OiBgJHtnbG9iYWxQY3R9JWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwicmV2aXNhZGFzXCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtc2VwXCIsIHRleHQ6IFwiXHUwMEI3XCIgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtd2Vla1wiLCB0ZXh0OiBgKyR7Y3JlYXRlZFRoaXNXZWVrfWAgfSk7XG4gICAgZ2xvYi5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXN0YXQtbWlkXCIsIHRleHQ6IFwiZXN0YSBzZW1hbmFcIiB9KTtcblxuICAgIC8vIEJyZWFrZG93biBwb3IgcGFzdGFcbiAgICBjb25zdCB0YWJsZSA9IHNlYy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC10YWJsZVwiIH0pO1xuICAgIGNvbnN0IHZhdWx0Um9vdCA9IHRoaXMuYXBwLnZhdWx0LmdldFJvb3QoKTtcbiAgICBjb25zdCBmb2xkZXJzID0gKHZhdWx0Um9vdC5jaGlsZHJlbi5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdKVxuICAgICAgLmZpbHRlcihmID0+ICFmLm5hbWUuc3RhcnRzV2l0aChcIi5cIikpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lLCBcInB0XCIpKTtcblxuICAgIGZvciAoY29uc3QgZm9sZGVyIG9mIGZvbGRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKGZvbGRlci5wYXRoKSkgY29udGludWU7XG4gICAgICBjb25zdCBydiA9IHJldmlld2VkU3RhdHModGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBpZiAocnYudG90YWwgPT09IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbWV0YSA9IGZvbGRlck1ldGEodGhpcy5hcHAsIGZvbGRlcik7XG4gICAgICBjb25zdCBwY3QgPSBNYXRoLnJvdW5kKHJ2LnJldmlld2VkIC8gcnYudG90YWwgKiAxMDApO1xuXG4gICAgICBjb25zdCByb3cgPSB0YWJsZS5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1yb3dcIiB9KTtcbiAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tYWNjZW50XCIsIG1ldGEuYWNjZW50KTtcblxuICAgICAgY29uc3QgbmFtZUVsID0gcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWZvbGRlclwiIH0pO1xuICAgICAgcmVuZGVySWNvbihuYW1lRWwuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1zdGF0LWljb25cIiB9KSwgbWV0YS5pY29uKTtcbiAgICAgIG5hbWVFbC5jcmVhdGVTcGFuKHsgdGV4dDogbWV0YS5sYWJlbCB9KTtcblxuICAgICAgcm93LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zdGF0LWNvdW50XCIsIHRleHQ6IGAke3J2LnRvdGFsfWAgfSk7XG5cbiAgICAgIGNvbnN0IGJhcldyYXAgPSByb3cuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyXCIgfSk7XG4gICAgICBiYXJXcmFwLnNldEF0dHIoXCJ0aXRsZVwiLCBgJHtydi5yZXZpZXdlZH0vJHtydi50b3RhbH0gcmV2aXNhZGFzICgke3BjdH0lKWApO1xuICAgICAgY29uc3QgZmlsbCA9IGJhcldyYXAuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXN0YXQtYmFyLWZpbGxcIiB9KTtcbiAgICAgIGZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3R9JWA7XG5cbiAgICAgIHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtc3RhdC1wY3RcIiwgdGV4dDogYCR7cGN0fSVgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXN0YSAvIGdyYWRlIGRlIG5vdGFzIGNvbSB0b2dnbGUgZSBpbmRpY2Fkb3IgcmV2aWV3ZWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RlcyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBub3RlczogVEZpbGVbXSwgbGFiZWwgPSBcIlwiKSB7XG4gICAgaWYgKCFub3Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBpc0dyaWQgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3RlVmlldyA9PT0gXCJncmlkXCI7XG4gICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLnJldmlld0ZpbHRlciA/IG5vdGVzLmZpbHRlcihmID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkICE9PSB0cnVlKSA6IG5vdGVzO1xuXG4gICAgY29uc3QgaGRyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3Rlcy1oZHJcIiB9KTtcbiAgICBjb25zdCBjb3VudFR4dCA9IHRoaXMucmV2aWV3RmlsdGVyXG4gICAgICA/IGAke2ZpbHRlcmVkLmxlbmd0aH0gcGVuZGVudGUke2ZpbHRlcmVkLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn0gLyAke25vdGVzLmxlbmd0aH1gXG4gICAgICA6IChsYWJlbCB8fCBgJHtub3Rlcy5sZW5ndGh9IG5vdGEke25vdGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gKTtcbiAgICBoZHIuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC1ub3Rlcy1sYWJlbFwiLCB0ZXh0OiBjb3VudFR4dCB9KTtcblxuICAgIGNvbnN0IHRvZyA9IGhkci5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtdmlldy10b2dnbGVcIiB9KTtcbiAgICBjb25zdCBidG5QZW5kID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLnJldmlld0ZpbHRlciA/IFwiIHdkLXZpZXctYWN0aXZlIHdkLXZpZXctcGVuZFwiIDogXCJcIiksIHRleHQ6IFwiXHUyNUNCXCIgfSk7XG4gICAgYnRuUGVuZC5zZXRBdHRyKFwidGl0bGVcIiwgXCJNb3N0cmFyIHNcdTAwRjMgcGVuZGVudGVzIChuXHUwMEUzbyByZXZpc2FkYXMpXCIpO1xuICAgIGJ0blBlbmQub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLnJldmlld0ZpbHRlciA9ICF0aGlzLnJldmlld0ZpbHRlcjsgdGhpcy5yZW5kZXIoKTsgfTtcbiAgICBjb25zdCBidG5MID0gdG9nLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICghaXNHcmlkID8gXCIgd2Qtdmlldy1hY3RpdmVcIiA6IFwiXCIpLCB0ZXh0OiBcIlx1MjI2MVwiIH0pO1xuICAgIGJ0bkwuc2V0QXR0cihcInRpdGxlXCIsIFwiTGlzdGFcIik7XG4gICAgYnRuTC5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJsaXN0XCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkcgPSB0b2cuY3JlYXRlU3Bhbih7IGNsczogXCJ3ZC12aWV3LWJ0blwiICsgKGlzR3JpZCA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJcdTIyOUVcIiB9KTtcbiAgICBidG5HLnNldEF0dHIoXCJ0aXRsZVwiLCBcIkNvbHVuYXNcIik7XG4gICAgYnRuRy5vbmNsaWNrID0gYXN5bmMgZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMucGx1Z2luLnNldHRpbmdzLm5vdGVWaWV3ID0gXCJncmlkXCI7IGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpOyB0aGlzLnJlbmRlcigpOyB9O1xuXG4gICAgaWYgKCFmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgIHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZW1wdHlcIiwgdGV4dDogdGhpcy5yZXZpZXdGaWx0ZXIgPyBcIk5lbmh1bWEgbm90YSBwZW5kZW50ZSBuZXN0YSBwYXN0YS5cIiA6IFwiTmVuaHVtYSBub3RhLlwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0dyaWQpIHtcbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGVzLWdyaWRcIiB9KTtcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWx0ZXJlZCkge1xuICAgICAgICBjb25zdCBzdCA9IHJlYWROb3RlU3RhdHVzKHRoaXMuYXBwLCBmKTtcbiAgICAgICAgY29uc3QgcnYgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKGYucGF0aCk/LmZyb250bWF0dGVyPy5yZXZpZXdlZCA9PT0gdHJ1ZTtcbiAgICAgICAgY29uc3QgY2FyZCA9IGdyaWQuY3JlYXRlRGl2KHsgY2xzOiBgd2Qtbm90ZS1jYXJkIHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICBjYXJkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ub3RlLXJ2IFwiICsgKHJ2ID8gXCJ3ZC1ydi15ZXNcIiA6IFwid2QtcnYtbm9cIikgfSkuc2V0QXR0cihcInRpdGxlXCIsIHJ2ID8gXCJSZXZpc2FkYVwiIDogXCJOXHUwMEUzbyByZXZpc2FkYVwiKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtY2FyZC1uYW1lXCIsIHRleHQ6IGYuYmFzZW5hbWUgfSk7XG4gICAgICAgIGlmIChzdCA9PT0gXCJjYW5jZWxsZWRcIikgbmFtZS5hZGRDbGFzcyhcIndkLXN0cmlrZVwiKTtcbiAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyBjbHM6IFwid2Qtbm90ZS1jYXJkLWRhdGVcIiwgdGV4dDogZm10U2hvcnQoZi5zdGF0Lm10aW1lKSB9KTtcbiAgICAgICAgaWYgKHN0ICE9PSBcImNhbmNlbGxlZFwiKSBjYXJkLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSkub3BlbkZpbGUoZik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLW5vdGUtbGlzdFwiIH0pO1xuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbHRlcmVkKSB7XG4gICAgICAgIGNvbnN0IHN0ID0gcmVhZE5vdGVTdGF0dXModGhpcy5hcHAsIGYpO1xuICAgICAgICBjb25zdCBydiA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoZi5wYXRoKT8uZnJvbnRtYXR0ZXI/LnJldmlld2VkID09PSB0cnVlO1xuICAgICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogYHdkLW5vdGUtcm93IHdkLXMtJHtzdH1gIH0pO1xuICAgICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogYHdkLW5vdGUtZG90IHdkLWJhZGdlLSR7c3R9YCB9KTtcbiAgICAgICAgY29uc3QgbmFtZSA9IHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtbmFtZVwiLCB0ZXh0OiBmLmJhc2VuYW1lIH0pO1xuICAgICAgICBpZiAoc3QgPT09IFwiY2FuY2VsbGVkXCIpIG5hbWUuYWRkQ2xhc3MoXCJ3ZC1zdHJpa2VcIik7XG4gICAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLW5vdGUtcnYgXCIgKyAocnYgPyBcIndkLXJ2LXllc1wiIDogXCJ3ZC1ydi1ub1wiKSB9KS5zZXRBdHRyKFwidGl0bGVcIiwgcnYgPyBcIlJldmlzYWRhXCIgOiBcIk5cdTAwRTNvIHJldmlzYWRhXCIpO1xuICAgICAgICBpZiAoc3QgIT09IFwiY2FuY2VsbGVkXCIpIHJvdy5vbmNsaWNrID0gKCkgPT4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBHclx1MDBFMWZpY28gZGUgY3Jlc2NpbWVudG8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJHcm93dGgocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbihTRUNfR1JPVykpIHJldHVybjtcblxuICAgIGNvbnN0IHNlYyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlY3Rpb25cIiB9KTtcbiAgICBjb25zdCBoZWFkID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtaGVhZFwiIH0pO1xuICAgIGhlYWQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLXNlYy1sYWJlbFwiLCB0ZXh0OiBcIkNSRVNDSU1FTlRPIERPIENPRlJFXCIgfSk7XG4gICAgY29uc3QgY3RybHMgPSBoZWFkLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1zZWMtY3RybHNcIiB9KTtcbiAgICBjb25zdCBidG5EYXkgPSBjdHJscy5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLXZpZXctYnRuXCIgKyAoIXRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IFwiIHdkLXZpZXctYWN0aXZlXCIgOiBcIlwiKSwgdGV4dDogXCJkaWFcIiB9KTtcbiAgICBidG5EYXkuc2V0QXR0cihcInRpdGxlXCIsIFwiTm90YXMgY3JpYWRhcyBwb3IgZGlhXCIpO1xuICAgIGJ0bkRheS5vbmNsaWNrID0gZSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA9IGZhbHNlOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIGNvbnN0IGJ0bkN1bSA9IGN0cmxzLmNyZWF0ZVNwYW4oeyBjbHM6IFwid2Qtdmlldy1idG5cIiArICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBcIiB3ZC12aWV3LWFjdGl2ZVwiIDogXCJcIiksIHRleHQ6IFwidG90YWxcIiB9KTtcbiAgICBidG5DdW0uc2V0QXR0cihcInRpdGxlXCIsIFwiVG90YWwgYWN1bXVsYWRvIG5vIHBlclx1MDBFRG9kb1wiKTtcbiAgICBidG5DdW0ub25jbGljayA9IGUgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPSB0cnVlOyB0aGlzLnJlbmRlcigpOyB9O1xuICAgIHRoaXMubW92ZUNvbnRyb2xzKGN0cmxzLCBcImdyb3d0aFwiKTtcbiAgICB0aGlzLmhpZGVCdG4oY3RybHMsIFNFQ19HUk9XLCBcIk9jdWx0YXIgY3Jlc2NpbWVudG9cIiwgXCJ3ZC1zZWMtaGlkZVwiKTtcblxuICAgIC8vIEFncnVwYSBub3RhcyBwb3IgZGF0YSBkZSBjcmlhXHUwMEU3XHUwMEUzb1xuICAgIGNvbnN0IGNvdW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KG5ldyBEYXRlKGYuc3RhdC5jdGltZSkpO1xuICAgICAgY291bnRzW2tleV0gPSAoY291bnRzW2tleV0gPz8gMCkgKyAxO1xuICAgIH1cblxuICAgIC8vIFx1MDBEQWx0aW1vcyAzMCBkaWFzXG4gICAgY29uc3QgREFZUyA9IDMwO1xuICAgIGNvbnN0IGRheXM6IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmcgfVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IERBWVMgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgLSBpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRvS2V5KGQpO1xuICAgICAgY29uc3QgWywgbSwgZGF5XSA9IGtleS5zcGxpdChcIi1cIik7XG4gICAgICBkYXlzLnB1c2goeyBrZXksIGNvdW50OiBjb3VudHNba2V5XSA/PyAwLCBsYWJlbDogYCR7ZGF5fS8ke219YCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbCA9IGRheXMucmVkdWNlKChzLCBkKSA9PiBzICsgZC5jb3VudCwgMCk7XG4gICAgY29uc3QgdG9kYXlLZXkgPSB0b0tleShuZXcgRGF0ZSgpKTtcblxuICAgIC8vIE1vZG8gY3VtdWxhdGl2bzogc29tYSBhY3VtdWxhZGEgZGlhIGEgZGlhXG4gICAgdHlwZSBEYXlFbnRyeSA9IHsga2V5OiBzdHJpbmc7IGNvdW50OiBudW1iZXI7IGxhYmVsOiBzdHJpbmc7IGRpc3BsYXlWYWw6IG51bWJlciB9O1xuICAgIGxldCBlbnRyaWVzOiBEYXlFbnRyeVtdO1xuICAgIGlmICh0aGlzLmdyb3d0aEN1bXVsYXRpdmUpIHtcbiAgICAgIGxldCBhY2MgPSAwO1xuICAgICAgZW50cmllcyA9IGRheXMubWFwKGQgPT4geyBhY2MgKz0gZC5jb3VudDsgcmV0dXJuIHsgLi4uZCwgZGlzcGxheVZhbDogYWNjIH07IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRyaWVzID0gZGF5cy5tYXAoZCA9PiAoeyAuLi5kLCBkaXNwbGF5VmFsOiBkLmNvdW50IH0pKTtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZW50cmllcy5tYXAoZSA9PiBlLmRpc3BsYXlWYWwpLCAxKTtcblxuICAgIC8vIExpbmhhIGRlIHJlc3Vtb1xuICAgIGNvbnN0IGluZm8gPSBzZWMuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1pbmZvXCIgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC10b3RhbFwiLCB0ZXh0OiBgJHt0aGlzLmdyb3d0aEN1bXVsYXRpdmUgPyBlbnRyaWVzW2VudHJpZXMubGVuZ3RoIC0gMV0uZGlzcGxheVZhbCA6IHRvdGFsfWAgfSk7XG4gICAgaW5mby5jcmVhdGVTcGFuKHsgY2xzOiBcIndkLWdyb3d0aC1wZXJpb2RcIiwgdGV4dDogdGhpcy5ncm93dGhDdW11bGF0aXZlID8gXCJub3RhcyBhY3VtdWxhZGFzICgzMCBkaWFzKVwiIDogXCJub3RhcyBjcmlhZGFzIG5vcyBcdTAwRkFsdGltb3MgMzAgZGlhc1wiIH0pO1xuXG4gICAgLy8gR3JcdTAwRTFmaWNvIGRlIGJhcnJhc1xuICAgIGNvbnN0IGNoYXJ0ID0gc2VjLmNyZWF0ZURpdih7IGNsczogXCJ3ZC1ncm93dGgtY2hhcnRcIiB9KTtcbiAgICBlbnRyaWVzLmZvckVhY2goKHsga2V5LCBjb3VudCwgbGFiZWwsIGRpc3BsYXlWYWwgfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSBjaGFydC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWNvbFwiICsgKGtleSA9PT0gdG9kYXlLZXkgPyBcIiB3ZC1ncm93dGgtdG9kYXlcIiA6IFwiXCIpIH0pO1xuICAgICAgY29uc3QgYmFyQXJlYSA9IGNvbC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtZ3Jvd3RoLWJhci1hcmVhXCIgfSk7XG4gICAgICBjb25zdCBpc0VtcHR5ID0gZGlzcGxheVZhbCA9PT0gMDtcbiAgICAgIGNvbnN0IGJhciA9IGJhckFyZWEuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1iYXJcIiArIChpc0VtcHR5ID8gXCIgd2QtZ3Jvd3RoLWJhci16ZXJvXCIgOiBcIlwiKSB9KTtcbiAgICAgIGJhci5zdHlsZS5oZWlnaHQgPSBpc0VtcHR5ID8gXCIzcHhcIiA6IGAke01hdGgubWF4KDUsIE1hdGgucm91bmQoKGRpc3BsYXlWYWwgLyBtYXgpICogMTAwKSl9JWA7XG4gICAgICBpZiAoIWlzRW1wdHkpIGJhci5zZXRBdHRyKFwidGl0bGVcIiwgYCR7bGFiZWx9OiAke3RoaXMuZ3Jvd3RoQ3VtdWxhdGl2ZSA/IGRpc3BsYXlWYWwgKyBcIiB0b3RhbFwiIDogY291bnQgKyBcIiBub3RhKHMpXCJ9YCk7XG5cbiAgICAgIGNvbnN0IHNob3dMYmwgPSBpZHggPT09IDAgfHwgaWR4ID09PSA3IHx8IGlkeCA9PT0gMTQgfHwgaWR4ID09PSAyMSB8fCBpZHggPT09IDI5IHx8IGtleSA9PT0gdG9kYXlLZXk7XG4gICAgICBjb2wuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWdyb3d0aC1sYmxcIiwgdGV4dDogc2hvd0xibCA/IGxhYmVsIDogXCJcIiB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBIZWFkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgcHJpdmF0ZSByZW5kZXJIZWFkZXIocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBoID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyXCIgfSk7XG4gICAgY29uc3QgdHh0ID0gaC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtaGVhZGVyLXRleHRcIiB9KTtcbiAgICB0eHQuY3JlYXRlRGl2KHsgY2xzOiBcIndkLWRhdGVcIiwgdGV4dDogdG9kYXlCUigpIH0pO1xuICAgIHR4dC5jcmVhdGVEaXYoeyBjbHM6IFwid2QtdGl0bGVcIiwgdGV4dDogXCJTZWNvbmQgQnJhaW5cIiB9KTtcblxuICAgIGNvbnN0IHRvZ2dsZSA9IGguY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IFwid2QtY29tcGFjdC10b2dnbGVcIixcbiAgICAgIHRleHQ6IHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBhY3QgPyBcIlx1MjVBNiBjb21wYWN0b1wiIDogXCJcdTI1QTQgY29uZm9ydFx1MDBFMXZlbFwiLFxuICAgIH0pO1xuICAgIHRvZ2dsZS5zZXRBdHRyKFwidGl0bGVcIiwgXCJBbHRlcm5hciBtb2RvIGNvbXBhY3RvXCIpO1xuICAgIHRvZ2dsZS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGFjdCA9ICF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wYWN0O1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH07XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBsdWdpbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VydXNEYXNoYm9hcmQgZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFzaFNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HUztcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEUsIGxlYWYgPT4gbmV3IERhc2hib2FyZFZpZXcobGVhZiwgdGhpcykpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImxheW91dC1kYXNoYm9hcmRcIiwgXCJBYnJpciBXZXJ1cyBEYXNoYm9hcmRcIiwgKCkgPT4gdGhpcy5vcGVuKCkpO1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcIm9wZW4tZGFzaGJvYXJkXCIsIG5hbWU6IFwiQWJyaXIgRGFzaGJvYXJkXCIsIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm9wZW4oKSB9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgICAvLyBTYW5lYW1lbnRvOiBzZWN0aW9uT3JkZXIgY29tIGV4YXRhbWVudGUgYXMgMyBzZVx1MDBFN1x1MDBGNWVzIHZcdTAwRTFsaWRhcywgc2VtIGR1cGxpY2F0YXMuXG4gICAgY29uc3QgdmFsaWQ6IFNlY3Rpb25JZFtdID0gW1wic3RhdHNcIiwgXCJwYXJhXCIsIFwiaGVhdG1hcFwiLCBcImdyb3d0aFwiLCBcInJlcG9ydHNcIiwgXCJjYWxlbmRhclwiXTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxTZWN0aW9uSWQ+KCk7XG4gICAgY29uc3QgY2xlYW5lZCA9ICh0aGlzLnNldHRpbmdzLnNlY3Rpb25PcmRlciB8fCBbXSkuZmlsdGVyKFxuICAgICAgKHMpOiBzIGlzIFNlY3Rpb25JZCA9PiB2YWxpZC5pbmNsdWRlcyhzIGFzIFNlY3Rpb25JZCkgJiYgIXNlZW4uaGFzKHMgYXMgU2VjdGlvbklkKSAmJiAoc2Vlbi5hZGQocyBhcyBTZWN0aW9uSWQpLCB0cnVlKVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbGlkKSBpZiAoIXNlZW4uaGFzKHYpKSBjbGVhbmVkLnB1c2godik7XG4gICAgdGhpcy5zZXR0aW5ncy5zZWN0aW9uT3JkZXIgPSBjbGVhbmVkO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnNldHRpbmdzLmhpZGRlbikpIHRoaXMuc2V0dGluZ3MuaGlkZGVuID0gW107XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7IGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7IH1cblxuICBhc3luYyBvcGVuKCkge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBsZXQgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFKVswXTtcbiAgICBpZiAoIWxlYWYpIHsgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTsgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBWSUVXX1RZUEUsIGFjdGl2ZTogdHJ1ZSB9KTsgfVxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQThFO0FBRTlFLElBQU0sWUFBWTtBQVlsQixJQUFNLG1CQUFpQztBQUFBLEVBQ3JDLGNBQWMsQ0FBQyxTQUFTLFFBQVEsV0FBVyxVQUFVLFdBQVcsVUFBVTtBQUFBLEVBQzFFLFNBQVM7QUFBQSxFQUNULFFBQVEsQ0FBQztBQUFBLEVBQ1QsVUFBVTtBQUNaO0FBV0EsSUFBTSxPQUFzQjtBQUFBLEVBQzFCLEVBQUUsUUFBUSxZQUFnQixNQUFNLGFBQU0sT0FBTyxTQUFZLFFBQVEsVUFBVTtBQUFBLEVBQzNFLEVBQUUsUUFBUSxl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
