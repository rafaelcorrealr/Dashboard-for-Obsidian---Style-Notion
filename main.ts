import { App, ItemView, Plugin, TFile, TFolder, WorkspaceLeaf, setIcon } from "obsidian";

const VIEW_TYPE = "werus-dashboard";

type Status = "progress" | "paused" | "cancelled";
type SectionId = "calendar" | "para" | "reports" | "heatmap" | "growth" | "stats";

interface DashSettings {
  sectionOrder: SectionId[];
  compact: boolean;
  hidden: string[];   // caminhos de pasta ocultos + "sec:calendar" / "sec:reports"
  noteView: "list" | "grid";
}

const DEFAULT_SETTINGS: DashSettings = {
  sectionOrder: ["stats", "para", "heatmap", "growth", "reports", "calendar"],
  compact: false,
  hidden: [],
  noteView: "list",
};

interface ParaSection {
  folder: string;
  icon: string;
  label: string;
  accent: string;
}

// Pastas "conhecidas" do PARA: mantêm ícone, rótulo e cor fixos. As demais pastas
// do cofre são renderizadas com cor automática e ícone padrão (ou o icon: do status.md).
const PARA: ParaSection[] = [
  { folder: "00.Inbox",     icon: "📥", label: "Inbox",    accent: "#6366F1" },
  { folder: "10.Projects",  icon: "🚀", label: "Projetos", accent: "#10B981" },
  { folder: "20.Areas",     icon: "🎯", label: "Áreas",    accent: "#F59E0B" },
  { folder: "30.Resources", icon: "📚", label: "Recursos", accent: "#3B82F6" },
  { folder: "40.Archive",   icon: "🗄️",  label: "Arquivo",  accent: "#6B7280" },
];
const PARA_MAP = new Map(PARA.map(p => [p.folder, p]));

// Paleta para colorir pastas desconhecidas de forma estável (por hash do nome).
const ACCENTS = ["#6366F1","#10B981","#F59E0B","#3B82F6","#EC4899","#8B5CF6","#14B8A6","#EF4444"];

const DAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const IMG_EXT = ["png","jpg","jpeg","webp","gif","svg"];

// Pasta raiz das notas diárias (criadas ao clicar num dia do calendário).
const DAILY_FOLDER = "50.Diário";
// Template opcional; placeholders {{date}} (YYYY-MM-DD) e {{title}} (data por extenso).
const DAILY_TEMPLATE = "Modelos/Nota Diária.md";

const STATUS_ICON: Record<Status, string> = {
  progress: "▶", paused: "⏸", cancelled: "✕",
};

const SEC_CAL = "sec:calendar";
const SEC_REP = "sec:reports";
const SEC_HEAT = "sec:heatmap";
const SEC_GROW = "sec:growth";
const SEC_STAT = "sec:stats";

// Função global exposta pelo plugin "Heatmap Calendar" (quando habilitado).
type HeatmapEntry = { date: string; intensity?: number; color?: string; content?: string };
type HeatmapData = {
  year: number;
  colors: Record<string, string[]>;
  entries: HeatmapEntry[];
  showCurrentDayBorder?: boolean;
};
function getHeatmapRenderer(): ((el: HTMLElement, data: HeatmapData) => void) | null {
  const fn = (window as unknown as { renderHeatmapCalendar?: unknown }).renderHeatmapCalendar;
  return typeof fn === "function" ? (fn as (el: HTMLElement, data: HeatmapData) => void) : null;
}

// ── Utilidades de data ──────────────────────────────────────────────────────

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow);
  const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - y0.getTime()) / 86_400_000 + 1) / 7);
}

function mondayOf(offset: number): Date {
  const now = new Date();
  const dow = now.getDay() || 7;
  const d = new Date(now);
  d.setDate(now.getDate() - dow + 1 + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function normalizeDate(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val.substring(0, 10);
  if (val instanceof Date) return val.toISOString().substring(0, 10);
  const s = String(val);
  return s.match(/^\d{4}-\d{2}-\d{2}/) ? s.substring(0, 10) : null;
}

function todayBR(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// dd/mm a partir de um timestamp (mtime)
function fmtShort(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
}

// ── Utilidades de pasta ─────────────────────────────────────────────────────

// Conta notas revisadas (reviewed: true) vs total em toda a subárvore.
function reviewedStats(app: App, folder: TFolder): { reviewed: number; total: number } {
  let reviewed = 0, total = 0;
  const walk = (f: TFolder) => {
    for (const c of f.children) {
      if (c instanceof TFile && c.extension === "md" && c.name !== "status.md") {
        total++;
        if (app.metadataCache.getCache(c.path)?.frontmatter?.reviewed === true) reviewed++;
      } else if (c instanceof TFolder) walk(c);
    }
  };
  walk(folder);
  return { reviewed, total };
}

// Conta md (exceto status.md) e imagens em toda a subárvore.
function folderStats(folder: TFolder): { md: number; img: number } {
  let md = 0, img = 0;
  const walk = (f: TFolder) => {
    for (const c of f.children) {
      if (c instanceof TFile) {
        if (c.extension === "md" && c.name !== "status.md") md++;
        else if (IMG_EXT.includes(c.extension)) img++;
      } else if (c instanceof TFolder) walk(c);
    }
  };
  walk(folder);
  return { md, img };
}

// Texto de contagem padronizado para os cards (notas + imagens, quando houver).
function countText(stats: { md: number; img: number }): string {
  if (stats.md === 0 && stats.img > 0) return `${stats.img} img`;
  return stats.img > 0 ? `${stats.md} notas · ${stats.img} img` : `${stats.md} notas`;
}

// As N notas .md modificadas mais recentemente em toda a subárvore.
function recentNotes(folder: TFolder, n: number): TFile[] {
  const files: TFile[] = [];
  const walk = (f: TFolder) => {
    for (const c of f.children) {
      if (c instanceof TFile && c.extension === "md" && c.name !== "status.md") files.push(c);
      else if (c instanceof TFolder) walk(c);
    }
  };
  walk(folder);
  files.sort((a, b) => b.stat.mtime - a.stat.mtime);
  return files.slice(0, n);
}

// Pasta "de assets": só tem imagens, nenhuma nota → escondida no navegador interno.
function isAssetFolder(folder: TFolder): boolean {
  const { md, img } = folderStats(folder);
  return img > 0 && md === 0;
}

function subFolders(folder: TFolder): TFolder[] {
  return (folder.children.filter(c => c instanceof TFolder) as TFolder[])
    .filter(f => !isAssetFolder(f))
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));
}

function notesIn(folder: TFolder): TFile[] {
  return (folder.children.filter(
    c => c instanceof TFile && c.extension === "md" && c.name !== "status.md"
  ) as TFile[]).sort((a, b) => a.basename.localeCompare(b.basename, "pt"));
}

function coverInFolder(app: App, folder: TFolder): string | null {
  // 1. Campo cover: no status.md (aceita caminho direto ou wikilink [[...]])
  const sf = folder.children.find(c => c instanceof TFile && c.name === "status.md") as TFile | undefined;
  if (sf) {
    const raw = app.metadataCache.getCache(sf.path)?.frontmatter?.cover;
    if (typeof raw === "string" && raw.trim()) {
      const linkpath = raw.trim().replace(/^!?\[\[/, "").replace(/\]\]$/, "").split("|")[0].trim();
      const resolved = app.metadataCache.getFirstLinkpathDest(linkpath, sf.path);
      if (resolved instanceof TFile && IMG_EXT.includes(resolved.extension))
        return app.vault.getResourcePath(resolved);
    }
  }
  // 2. Fallback: arquivo _cover.* na pasta
  for (const c of folder.children) {
    if (c instanceof TFile && c.basename === "_cover" && IMG_EXT.includes(c.extension))
      return app.vault.getResourcePath(c);
  }
  return null;
}

function readFolderStatus(app: App, folder: TFolder): Status {
  const sf = folder.children.find(c => c instanceof TFile && c.name === "status.md") as TFile | undefined;
  const s = sf && app.metadataCache.getCache(sf.path)?.frontmatter?.status;
  return s === "paused" || s === "cancelled" ? s : "progress";
}

function readNoteStatus(app: App, file: TFile): Status {
  const s = app.metadataCache.getCache(file.path)?.frontmatter?.status;
  return s === "paused" || s === "cancelled" ? s : "progress";
}

// Ícone definido em `icon:` no status.md da pasta (emoji ou id Lucide). null se ausente.
function readFolderIcon(app: App, folder: TFolder): string | null {
  const sf = folder.children.find(c => c instanceof TFile && c.name === "status.md") as TFile | undefined;
  const ic = sf && app.metadataCache.getCache(sf.path)?.frontmatter?.icon;
  return typeof ic === "string" && ic.trim() ? ic.trim() : null;
}

// id Lucide (só [a-z0-9-]) → setIcon nativo; caso contrário trata como emoji/texto.
function renderIcon(el: HTMLElement, icon: string) {
  if (/^[a-z0-9-]+$/.test(icon)) setIcon(el, icon);
  else el.setText(icon);
}

// Cor estável a partir do nome (para pastas fora do PARA).
function accentFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

// Ícone / rótulo / cor de uma pasta de topo: usa o PARA se conhecida, senão deriva.
function folderMeta(app: App, folder: TFolder): { icon: string; label: string; accent: string } {
  const known = PARA_MAP.get(folder.path);
  const custom = readFolderIcon(app, folder);
  return {
    icon:   custom ?? known?.icon ?? "📁",
    label:  known?.label ?? folder.name,
    accent: known?.accent ?? accentFor(folder.name),
  };
}

function revealInExplorer(app: App, target: unknown) {
  type ExpPlugin = { instance: { revealInFolder(f: unknown): void } };
  const exp = (app as App & {
    internalPlugins: { getPluginById(id: string): ExpPlugin | null };
  }).internalPlugins.getPluginById("file-explorer");
  if (exp && target) exp.instance.revealInFolder(target);
}

// ── View ──────────────────────────────────────────────────────────────────────

class DashboardView extends ItemView {
  private weekOffset = 0;
  private navPath: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private tip: HTMLElement | null = null;
  private searchTerm = "";
  private reviewFilter = false;
  private growthCumulative = false;

  constructor(leaf: WorkspaceLeaf, private plugin: WerusDashboard) { super(leaf); }

  getViewType()    { return VIEW_TYPE; }
  getDisplayText() { return "Dashboard"; }
  getIcon()        { return "layout-dashboard"; }

  async onOpen() {
    await this.render();
    for (const ev of ["modify", "create", "delete", "rename"] as const)
      this.registerEvent(this.app.vault.on(ev as "modify", () => this.schedule()));
  }

  async onClose() { this.hideTip(); }

  private schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.render(), 400);
  }

  // Primeiro segmento de um caminho ("10.Projects/Foo/Bar" → "10.Projects").
  private topFolderOf(path: string): string {
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
      if (id === "calendar")     this.renderCalendar(root);
      else if (id === "para")    this.renderPara(root);
      else if (id === "heatmap") this.renderHeatmap(root);
      else if (id === "reports") this.renderReports(root);
      else if (id === "growth")  this.renderGrowth(root);
      else if (id === "stats")   this.renderStats(root);
    }
  }

  // ── Controles de ordem de seção ───────────────────────────────────────────

  private moveControls(host: HTMLElement, id: SectionId) {
    const order = this.plugin.settings.sectionOrder;
    const i = order.indexOf(id);
    const ctrl = host.createDiv({ cls: "wd-move-ctrl" });

    const up = ctrl.createSpan({ cls: "wd-move-btn" + (i <= 0 ? " wd-move-off" : ""), text: "▲" });
    up.setAttr("title", "Mover seção para cima");
    if (i > 0) up.onclick = e => { e.stopPropagation(); this.moveSection(id, -1); };

    const down = ctrl.createSpan({ cls: "wd-move-btn" + (i >= order.length - 1 ? " wd-move-off" : ""), text: "▼" });
    down.setAttr("title", "Mover seção para baixo");
    if (i < order.length - 1) down.onclick = e => { e.stopPropagation(); this.moveSection(id, +1); };
  }

  private async moveSection(id: SectionId, dir: number) {
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

  private isHidden(key: string): boolean {
    return this.plugin.settings.hidden.includes(key);
  }

  private hideBtn(host: HTMLElement, key: string, title: string, cls = "wd-hide-btn") {
    const b = host.createSpan({ cls });
    setIcon(b, "eye-off");
    b.setAttr("title", title);
    b.onclick = e => { e.stopPropagation(); this.hideItem(key); };
  }

  private async hideItem(key: string) {
    if (this.isHidden(key)) return;
    this.plugin.settings.hidden.push(key);
    // Se estávamos dentro da pasta que acabou de ser oculta, fecha o navegador.
    if (this.navPath && (this.navPath === key || this.navPath.startsWith(key + "/"))) this.navPath = null;
    await this.plugin.saveSettings();
    this.render();
  }

  private async unhideItem(key: string) {
    this.plugin.settings.hidden = this.plugin.settings.hidden.filter(k => k !== key);
    await this.plugin.saveSettings();
    this.render();
  }

  private hiddenLabel(key: string): string {
    if (key === SEC_CAL) return "📅 Calendário";
    if (key === SEC_REP) return "📄 Relatórios Claude";
    if (key === SEC_HEAT) return "🔥 Heatmap";
    if (key === SEC_GROW) return "📈 Crescimento";
    if (key === SEC_STAT) return "📊 Estatísticas";
    const f = this.app.vault.getAbstractFileByPath(key);
    return f instanceof TFolder ? f.name : key;
  }

  private renderHiddenBar(parent: HTMLElement) {
    const hidden = this.plugin.settings.hidden;
    if (!hidden.length) return;
    const bar = parent.createDiv({ cls: "wd-hidden-bar" });
    bar.createSpan({ cls: "wd-hidden-label", text: "ocultos:" });
    for (const key of hidden) {
      const chip = bar.createSpan({ cls: "wd-hidden-chip" });
      setIcon(chip.createSpan({ cls: "wd-chip-icon" }), "eye");
      chip.createSpan({ text: this.hiddenLabel(key) });
      chip.setAttr("title", "Mostrar novamente");
      chip.onclick = () => this.unhideItem(key);
    }
  }

  // ── Tooltip de notas recentes ─────────────────────────────────────────────

  private showTip(target: HTMLElement, files: TFile[]) {
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
    if (top + th > window.innerHeight - 8) top = rect.top - th - 6;  // vira para cima se faltar espaço
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top  = `${Math.max(8, top)}px`;
    this.tip = tip;
  }

  private hideTip() {
    if (this.tip) { this.tip.remove(); this.tip = null; }
  }

  private attachTip(card: HTMLElement, folder: TFolder) {
    const recents = recentNotes(folder, 4);
    if (!recents.length) return;
    card.addEventListener("mouseenter", () => this.showTip(card, recents));
    card.addEventListener("mouseleave", () => this.hideTip());
  }

  // ── Calendário ──────────────────────────────────────────────────────────

  private renderCalendar(root: HTMLElement) {
    if (this.isHidden(SEC_CAL)) return;

    const monday  = mondayOf(this.weekOffset);
    const weekNum = isoWeekNumber(monday);
    const todayK  = toKey(new Date());

    const byDay: Record<string, { name: string; file: TFile }[]> = {};
    for (const file of this.app.vault.getMarkdownFiles()) {
      const d = normalizeDate(this.app.metadataCache.getCache(file.path)?.frontmatter?.date);
      if (d) (byDay[d] ??= []).push({ name: file.basename, file });
    }

    const sec = root.createDiv({ cls: "wd-section wd-cal-section" });
    const nav = sec.createDiv({ cls: "wd-cal-nav-bar" });
    nav.createSpan({ cls: "wd-cal-week-label", text: `Semana ${weekNum}` });

    const ctrls = nav.createDiv({ cls: "wd-cal-ctrls" });
    const prev = ctrls.createSpan({ cls: "wd-cal-arrow", text: "‹" });
    const next = ctrls.createSpan({ cls: "wd-cal-arrow", text: "›" });
    prev.onclick = () => { this.weekOffset--; this.render(); };
    next.onclick = () => { this.weekOffset++; this.render(); };
    this.moveControls(ctrls, "calendar");
    this.hideBtn(ctrls, SEC_CAL, "Ocultar calendário", "wd-sec-hide");

    const grid = sec.createDiv({ cls: "wd-cal-grid" });
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const key = toKey(day);
      const col = grid.createDiv({
        cls: ["wd-cal-col", key === todayK ? "wd-today" : "", i >= 5 ? "wd-weekend" : ""]
          .filter(Boolean).join(" "),
      });
      const hd = col.createDiv({ cls: "wd-cal-hd" });
      hd.createDiv({ cls: "wd-cal-name", text: DAY_SHORT[i] });
      hd.createDiv({ cls: "wd-cal-num",  text: String(day.getDate()) });
      hd.setAttr("title", "Abrir / criar nota diária");
      hd.onclick = e => { e.stopPropagation(); void this.openDailyNote(key); };

      const items = byDay[key] ?? [];
      for (const it of items.slice(0, 3)) {
        const pill = col.createDiv({ cls: "wd-cal-pill" });
        pill.textContent = it.name.length > 14 ? it.name.slice(0, 14) + "…" : it.name;
        pill.onclick = () => this.app.workspace.getLeaf(false).openFile(it.file);
      }
      if (items.length > 3) col.createDiv({ cls: "wd-cal-more", text: `+${items.length - 3}` });
    }

    const end = new Date(monday);
    end.setDate(monday.getDate() + 6);
    sec.createDiv({
      cls: "wd-cal-footer",
      text: monday.getMonth() === end.getMonth()
        ? `${MONTH_SHORT[monday.getMonth()]} ${monday.getFullYear()}`
        : `${MONTH_SHORT[monday.getMonth()]} – ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`,
    });
  }

  // Abre a nota diária de `key` (YYYY-MM-DD); cria em 50.Diário/ se não existir.
  private async openDailyNote(key: string) {
    const path = `${DAILY_FOLDER}/${key}.md`;
    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      // Garante a pasta raiz (caso tenha sido removida).
      if (!this.app.vault.getAbstractFileByPath(DAILY_FOLDER))
        await this.app.vault.createFolder(DAILY_FOLDER).catch(() => {});

      const [y, m, d] = key.split("-");
      const titulo = new Date(+y, +m - 1, +d).toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });

      // Usa o template em Modelos/ se existir; senão, fallback embutido.
      const tpl = this.app.vault.getAbstractFileByPath(DAILY_TEMPLATE);
      let body: string;
      if (tpl instanceof TFile) {
        body = (await this.app.vault.read(tpl))
          .replace(/\{\{\s*date\s*\}\}/g, key)
          .replace(/\{\{\s*title\s*\}\}/g, titulo);
      } else {
        body =
`---
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

    if (file instanceof TFile) await this.app.workspace.getLeaf(false).openFile(file);
  }

  // ── Cards do cofre (todas as pastas de topo) + navegador aninhado ──────────

  private renderPara(root: HTMLElement) {
    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "COFRE" });
    this.moveControls(head, "para");

    const grid = sec.createDiv({ cls: "wd-para-grid" });
    const vaultRoot = this.app.vault.getRoot();
    const folders = (vaultRoot.children.filter(c => c instanceof TFolder) as TFolder[])
      .filter(f => !f.name.startsWith("."))   // ignora .obsidian, .trash, etc.
      .sort((a, b) => a.name.localeCompare(b.name, "pt"));
    const activeRoot = this.navPath ? this.topFolderOf(this.navPath) : null;

    let idx = 0;
    for (const folder of folders) {
      if (this.isHidden(folder.path)) continue;

      const meta    = folderMeta(this.app, folder);
      const stats   = folderStats(folder);
      const cover   = coverInFolder(this.app, folder);
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
      const top  = body.createDiv({ cls: "wd-card-top" });
      renderIcon(top.createSpan({ cls: "wd-icon" }), meta.icon);
      top.createSpan({ cls: "wd-count", text: countText(stats) });
      body.createDiv({ cls: "wd-label",  text: meta.label });
      body.createDiv({ cls: "wd-folder", text: folder.path });
      if (navigable) body.createDiv({ cls: "wd-has-subs", text: isActive ? "fechar ▾" : "abrir ›" });

      const rv = reviewedStats(this.app, folder);
      if (rv.total > 0) {
        const bar = body.createDiv({ cls: "wd-progress" });
        bar.setAttr("title", `${rv.reviewed}/${rv.total} revisadas`);
        const fill = bar.createDiv({ cls: "wd-progress-fill" });
        fill.style.width = `${Math.round(rv.reviewed / rv.total * 100)}%`;
      }

      this.attachTip(card, folder);

      card.onclick = () => {
        if (navigable) { this.navPath = isActive ? null : folder.path; this.searchTerm = ""; this.render(); }
        else revealInExplorer(this.app, folder);
      };
    }

    if (!idx) sec.createDiv({ cls: "wd-empty", text: "Nenhuma pasta visível." });

    // Arquivos soltos na raiz do cofre
    const rootFiles = notesIn(vaultRoot);
    this.renderNotes(sec, rootFiles, "arquivos na raiz");

    if (this.navPath) {
      const folder = this.app.vault.getAbstractFileByPath(this.navPath);
      if (folder instanceof TFolder) this.renderBrowser(sec, folder);
    }

    this.renderHiddenBar(sec);
  }

  // Painel inline navegável (breadcrumb + subpastas + notas da pasta atual)
  private renderBrowser(parent: HTMLElement, folder: TFolder) {
    const rootPath = this.topFolderOf(folder.path);
    const rootFolder = this.app.vault.getAbstractFileByPath(rootPath);
    if (!(rootFolder instanceof TFolder)) return;
    const meta = folderMeta(this.app, rootFolder);

    const panel = parent.createDiv({ cls: "wd-panel" });
    panel.style.setProperty("--accent", meta.accent);

    // Breadcrumb
    const crumb = panel.createDiv({ cls: "wd-crumb" });
    const rel = folder.path === rootPath ? [] : folder.path.slice(rootPath.length + 1).split("/");

    const rootSeg = crumb.createSpan({ cls: "wd-crumb-seg" + (rel.length === 0 ? " wd-crumb-cur" : "") });
    renderIcon(rootSeg.createSpan({ cls: "wd-crumb-icon" }), meta.icon);
    rootSeg.createSpan({ text: meta.label });
    if (rel.length) rootSeg.onclick = () => { this.navPath = rootPath; this.searchTerm = ""; this.render(); };

    let acc = rootPath;
    rel.forEach((part, i) => {
      crumb.createSpan({ cls: "wd-crumb-sep", text: "›" });
      const isLast = i === rel.length - 1;
      acc = `${acc}/${part}`;
      const segPath = acc;
      const seg = crumb.createSpan({ cls: "wd-crumb-seg" + (isLast ? " wd-crumb-cur" : ""), text: part });
      if (!isLast) seg.onclick = () => { this.navPath = segPath; this.searchTerm = ""; this.render(); };
    });

    const close = crumb.createSpan({ cls: "wd-crumb-close", text: "✕" });
    close.setAttr("title", "Fechar");
    close.onclick = () => { this.navPath = null; this.render(); };

    // Campo de busca
    const searchWrap = panel.createDiv({ cls: "wd-search-wrap" });
    const searchInput = searchWrap.createEl("input", {
      cls: "wd-search",
      attr: { type: "text", placeholder: "filtrar…", value: this.searchTerm },
    });
    searchInput.addEventListener("input", () => {
      this.searchTerm = searchInput.value;
      const term = this.searchTerm.toLowerCase();
      panel.querySelectorAll<HTMLElement>(".wd-sub-card").forEach(el => {
        const lbl = el.querySelector(".wd-label")?.textContent?.toLowerCase() ?? "";
        el.style.display = lbl.includes(term) ? "" : "none";
      });
      panel.querySelectorAll<HTMLElement>(".wd-note-row, .wd-note-card").forEach(el => {
        const name = (el.querySelector(".wd-note-name, .wd-note-card-name")?.textContent ?? "").toLowerCase();
        el.style.display = name.includes(term) ? "" : "none";
      });
    });

    // Subpastas como cards
    const subs = subFolders(folder);
    if (subs.length) {
      const sgrid = panel.createDiv({ cls: "wd-proj-grid" });
      for (const sf of subs) {
        const status = readFolderStatus(this.app, sf);
        const stats  = folderStats(sf);
        const cover  = coverInFolder(this.app, sf);
        const deeper = subFolders(sf).length > 0;
        const customIcon = readFolderIcon(this.app, sf);

        const card = sgrid.createDiv({ cls: `wd-card wd-sub-card wd-s-${status}` });
        card.style.setProperty("--accent", meta.accent);
        if (cover) card.createDiv({ cls: "wd-cover" }).createEl("img", { attr: { src: cover, draggable: "false" } });

        card.createDiv({ cls: `wd-badge wd-badge-${status}`, text: STATUS_ICON[status] });

        const body = card.createDiv({ cls: "wd-card-body" });
        const top  = body.createDiv({ cls: "wd-card-top" });
        if (customIcon) renderIcon(top.createSpan({ cls: "wd-icon wd-sub-icon" }), customIcon);
        top.createSpan({ cls: "wd-count", text: countText(stats) });
        if (deeper) top.createSpan({ cls: "wd-sub-arrow", text: "›" });

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
          card.onclick = () => { this.navPath = sf.path; this.searchTerm = ""; this.render(); };
        }
      }
    }

    // Notas da pasta atual
    const notes = notesIn(folder);
    this.renderNotes(panel, notes);

    if (!subs.length && !notes.length)
      panel.createDiv({ cls: "wd-empty", text: "Pasta vazia." });
  }

  // ── Relatórios ────────────────────────────────────────────────────────────

  private renderReports(root: HTMLElement) {
    if (this.isHidden(SEC_REP)) return;

    const dir = this.app.vault.getAbstractFileByPath("40.Archive/Relatórios Claude");
    if (!(dir instanceof TFolder)) return;
    const items: { file: TFile; date: string }[] = [];
    for (const c of dir.children) {
      if (!(c instanceof TFile) || c.extension !== "md") continue;
      const d = normalizeDate(this.app.metadataCache.getCache(c.path)?.frontmatter?.date);
      if (d) items.push({ file: c, date: d });
    }
    items.sort((a, b) => b.date.localeCompare(a.date));
    if (!items.length) return;

    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "RELATÓRIOS CLAUDE" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.moveControls(ctrls, "reports");
    this.hideBtn(ctrls, SEC_REP, "Ocultar Relatórios Claude", "wd-sec-hide");

    const list = sec.createDiv({ cls: "wd-report-list" });
    for (const { file, date } of items.slice(0, 6)) {
      const [y, m, d] = date.split("-");
      const row = list.createDiv({ cls: "wd-report-row" });
      row.createSpan({ cls: "wd-report-date", text: `${d}/${m}/${y}` });
      row.createSpan({ cls: "wd-report-name", text: file.basename });
      row.onclick = () => this.app.workspace.getLeaf(false).openFile(file);
      void y;
    }
  }

  // ── Heatmap (via plugin Heatmap Calendar) ─────────────────────────────────

  private renderHeatmap(root: HTMLElement) {
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

    // Notas criadas por dia, no ano corrente.
    const year = new Date().getFullYear();
    const counts: Record<string, number> = {};
    for (const f of this.app.vault.getMarkdownFiles()) {
      const d = new Date(f.stat.ctime);
      if (d.getFullYear() !== year) continue;
      const key = toKey(d);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    const entries: HeatmapEntry[] = Object.entries(counts).map(([date, n]) => ({
      date, intensity: n, color: "green", content: `${n} nota(s)`,
    }));

    const box = sec.createDiv({ cls: "wd-heat-box" });
    try {
      render(box, {
        year,
        colors: { green: ["#1e3a2f", "#1f6f43", "#2ba85a", "#39d353"] },
        showCurrentDayBorder: true,
        entries,
      });
    } catch {
      sec.empty();
      sec.createDiv({ cls: "wd-empty", text: "Falha ao renderizar o heatmap." });
    }
  }

  // ── Estatísticas do cofre ─────────────────────────────────────────────────

  private renderStats(root: HTMLElement) {
    if (this.isHidden(SEC_STAT)) return;

    let totalNotes = 0, totalReviewed = 0, createdThisWeek = 0;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.name === "status.md") continue;
      totalNotes++;
      if (this.app.metadataCache.getCache(f.path)?.frontmatter?.reviewed === true) totalReviewed++;
      if (f.stat.ctime >= weekAgo) createdThisWeek++;
    }
    const globalPct = totalNotes > 0 ? Math.round(totalReviewed / totalNotes * 100) : 0;

    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "ESTATÍSTICAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.moveControls(ctrls, "stats");
    this.hideBtn(ctrls, SEC_STAT, "Ocultar estatísticas", "wd-sec-hide");

    // Números globais
    const glob = sec.createDiv({ cls: "wd-stat-global" });
    glob.createSpan({ cls: "wd-stat-big", text: String(totalNotes) });
    glob.createSpan({ cls: "wd-stat-mid", text: "notas" });
    glob.createSpan({ cls: "wd-stat-sep", text: "·" });
    glob.createSpan({ cls: "wd-stat-big wd-stat-rev-num", text: `${globalPct}%` });
    glob.createSpan({ cls: "wd-stat-mid", text: "revisadas" });
    glob.createSpan({ cls: "wd-stat-sep", text: "·" });
    glob.createSpan({ cls: "wd-stat-week", text: `+${createdThisWeek}` });
    glob.createSpan({ cls: "wd-stat-mid", text: "esta semana" });

    // Breakdown por pasta
    const table = sec.createDiv({ cls: "wd-stat-table" });
    const vaultRoot = this.app.vault.getRoot();
    const folders = (vaultRoot.children.filter(c => c instanceof TFolder) as TFolder[])
      .filter(f => !f.name.startsWith("."))
      .sort((a, b) => a.name.localeCompare(b.name, "pt"));

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

  private renderNotes(parent: HTMLElement, notes: TFile[], label = "") {
    if (!notes.length) return;
    const isGrid = this.plugin.settings.noteView === "grid";
    const filtered = this.reviewFilter ? notes.filter(f => this.app.metadataCache.getCache(f.path)?.frontmatter?.reviewed !== true) : notes;

    const hdr = parent.createDiv({ cls: "wd-notes-hdr" });
    const countTxt = this.reviewFilter
      ? `${filtered.length} pendente${filtered.length !== 1 ? "s" : ""} / ${notes.length}`
      : (label || `${notes.length} nota${notes.length !== 1 ? "s" : ""}`);
    hdr.createSpan({ cls: "wd-notes-label", text: countTxt });

    const tog = hdr.createDiv({ cls: "wd-view-toggle" });
    const btnPend = tog.createSpan({ cls: "wd-view-btn" + (this.reviewFilter ? " wd-view-active wd-view-pend" : ""), text: "○" });
    btnPend.setAttr("title", "Mostrar só pendentes (não revisadas)");
    btnPend.onclick = e => { e.stopPropagation(); this.reviewFilter = !this.reviewFilter; this.render(); };
    const btnL = tog.createSpan({ cls: "wd-view-btn" + (!isGrid ? " wd-view-active" : ""), text: "≡" });
    btnL.setAttr("title", "Lista");
    btnL.onclick = async e => { e.stopPropagation(); this.plugin.settings.noteView = "list"; await this.plugin.saveSettings(); this.render(); };
    const btnG = tog.createSpan({ cls: "wd-view-btn" + (isGrid ? " wd-view-active" : ""), text: "⊞" });
    btnG.setAttr("title", "Colunas");
    btnG.onclick = async e => { e.stopPropagation(); this.plugin.settings.noteView = "grid"; await this.plugin.saveSettings(); this.render(); };

    if (!filtered.length) {
      parent.createDiv({ cls: "wd-empty", text: this.reviewFilter ? "Nenhuma nota pendente nesta pasta." : "Nenhuma nota." });
      return;
    }

    if (isGrid) {
      const grid = parent.createDiv({ cls: "wd-notes-grid" });
      for (const f of filtered) {
        const st = readNoteStatus(this.app, f);
        const rv = this.app.metadataCache.getCache(f.path)?.frontmatter?.reviewed === true;
        const card = grid.createDiv({ cls: `wd-note-card wd-s-${st}` });
        card.createDiv({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "Não revisada");
        const name = card.createDiv({ cls: "wd-note-card-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        card.createDiv({ cls: "wd-note-card-date", text: fmtShort(f.stat.mtime) });
        if (st !== "cancelled") card.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
      }
    } else {
      const list = parent.createDiv({ cls: "wd-note-list" });
      for (const f of filtered) {
        const st = readNoteStatus(this.app, f);
        const rv = this.app.metadataCache.getCache(f.path)?.frontmatter?.reviewed === true;
        const row = list.createDiv({ cls: `wd-note-row wd-s-${st}` });
        row.createSpan({ cls: `wd-note-dot wd-badge-${st}` });
        const name = row.createSpan({ cls: "wd-note-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        row.createSpan({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "Não revisada");
        if (st !== "cancelled") row.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
      }
    }
  }

  // ── Gráfico de crescimento ────────────────────────────────────────────────

  private renderGrowth(root: HTMLElement) {
    if (this.isHidden(SEC_GROW)) return;

    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "CRESCIMENTO DO COFRE" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const btnDay = ctrls.createSpan({ cls: "wd-view-btn" + (!this.growthCumulative ? " wd-view-active" : ""), text: "dia" });
    btnDay.setAttr("title", "Notas criadas por dia");
    btnDay.onclick = e => { e.stopPropagation(); this.growthCumulative = false; this.render(); };
    const btnCum = ctrls.createSpan({ cls: "wd-view-btn" + (this.growthCumulative ? " wd-view-active" : ""), text: "total" });
    btnCum.setAttr("title", "Total acumulado no período");
    btnCum.onclick = e => { e.stopPropagation(); this.growthCumulative = true; this.render(); };
    this.moveControls(ctrls, "growth");
    this.hideBtn(ctrls, SEC_GROW, "Ocultar crescimento", "wd-sec-hide");

    // Agrupa notas por data de criação
    const counts: Record<string, number> = {};
    for (const f of this.app.vault.getMarkdownFiles()) {
      const key = toKey(new Date(f.stat.ctime));
      counts[key] = (counts[key] ?? 0) + 1;
    }

    // Últimos 30 dias
    const DAYS = 30;
    const days: { key: string; count: number; label: string }[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toKey(d);
      const [, m, day] = key.split("-");
      days.push({ key, count: counts[key] ?? 0, label: `${day}/${m}` });
    }

    const total = days.reduce((s, d) => s + d.count, 0);
    const todayKey = toKey(new Date());

    // Modo cumulativo: soma acumulada dia a dia
    type DayEntry = { key: string; count: number; label: string; displayVal: number };
    let entries: DayEntry[];
    if (this.growthCumulative) {
      let acc = 0;
      entries = days.map(d => { acc += d.count; return { ...d, displayVal: acc }; });
    } else {
      entries = days.map(d => ({ ...d, displayVal: d.count }));
    }
    const max = Math.max(...entries.map(e => e.displayVal), 1);

    // Linha de resumo
    const info = sec.createDiv({ cls: "wd-growth-info" });
    info.createSpan({ cls: "wd-growth-total", text: `${this.growthCumulative ? entries[entries.length - 1].displayVal : total}` });
    info.createSpan({ cls: "wd-growth-period", text: this.growthCumulative ? "notas acumuladas (30 dias)" : "notas criadas nos últimos 30 dias" });

    // Gráfico de barras
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    entries.forEach(({ key, count, label, displayVal }, idx) => {
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const isEmpty = displayVal === 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (isEmpty ? " wd-growth-bar-zero" : "") });
      bar.style.height = isEmpty ? "3px" : `${Math.max(5, Math.round((displayVal / max) * 100))}%`;
      if (!isEmpty) bar.setAttr("title", `${label}: ${this.growthCumulative ? displayVal + " total" : count + " nota(s)"}`);

      const showLbl = idx === 0 || idx === 7 || idx === 14 || idx === 21 || idx === 29 || key === todayKey;
      col.createDiv({ cls: "wd-growth-lbl", text: showLbl ? label : "" });
    });
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  private renderHeader(root: HTMLElement) {
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Second Brain" });

    const toggle = h.createSpan({
      cls: "wd-compact-toggle",
      text: this.plugin.settings.compact ? "▦ compacto" : "▤ confortável",
    });
    toggle.setAttr("title", "Alternar modo compacto");
    toggle.onclick = async () => {
      this.plugin.settings.compact = !this.plugin.settings.compact;
      await this.plugin.saveSettings();
      this.render();
    };
  }
}

// ── Plugin ────────────────────────────────────────────────────────────────────

export default class WerusDashboard extends Plugin {
  settings: DashSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, leaf => new DashboardView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "Abrir Werus Dashboard", () => this.open());
    this.addCommand({ id: "open-dashboard", name: "Abrir Dashboard", callback: () => this.open() });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    // Saneamento: sectionOrder com exatamente as 3 seções válidas, sem duplicatas.
    const valid: SectionId[] = ["stats", "para", "heatmap", "growth", "reports", "calendar"];
    const seen = new Set<SectionId>();
    const cleaned = (this.settings.sectionOrder || []).filter(
      (s): s is SectionId => valid.includes(s as SectionId) && !seen.has(s as SectionId) && (seen.add(s as SectionId), true)
    );
    for (const v of valid) if (!seen.has(v)) cleaned.push(v);
    this.settings.sectionOrder = cleaned;
    if (!Array.isArray(this.settings.hidden)) this.settings.hidden = [];
  }

  async saveSettings() { await this.saveData(this.settings); }

  async open() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) { leaf = workspace.getLeaf(false); await leaf.setViewState({ type: VIEW_TYPE, active: true }); }
    workspace.revealLeaf(leaf);
  }

  onunload() {}
}
