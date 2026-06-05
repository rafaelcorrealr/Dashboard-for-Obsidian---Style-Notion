import { App, Component, ItemView, MarkdownRenderer, Modal, Notice, Platform, Plugin, PluginSettingTab, Setting, TFile, TFolder, WorkspaceLeaf, requestUrl, setIcon } from "obsidian";

const VIEW_TYPE = "werus-dashboard";

type Status = "progress" | "paused" | "cancelled";
type SectionId = "calendar" | "para" | "reports" | "heatmap" | "growth" | "stats" | "todoist" | "sync";

interface TodoistFilters {
  projects: string[];   // ids de projeto selecionados (vazio = todos)
  labels: string[];     // nomes de etiqueta selecionados (vazio = todas)
}

interface DashSettings {
  sectionOrder: SectionId[];
  compact: boolean;
  hidden: string[];   // caminhos de pasta ocultos + "sec:calendar" / "sec:reports"
  noteView: "list" | "grid";
  todoistToken: string;
  todoistDayRange: 3 | 7;        // quantos "próximos dias" mostrar na grade
  todoistFilters: TodoistFilters;
  todoistShowProject: boolean;   // mostrar o nome do projeto nas linhas
  todoistShowLabels: boolean;    // mostrar as etiquetas nas linhas
  syncthingUrl: string;          // base da API REST do Syncthing
  syncthingApiKey: string;       // X-API-Key (fora do Git)
  syncthingFolderId: string;     // id da pasta; vazio = autodetecta
  syncthingShowCounts: boolean;  // mostrar "sincronizados / total" de itens por aparelho
}

const DEFAULT_SETTINGS: DashSettings = {
  sectionOrder: ["stats", "todoist", "para", "sync", "heatmap", "growth", "reports", "calendar"],
  compact: false,
  hidden: [],
  noteView: "list",
  todoistToken: "",
  todoistDayRange: 7,
  todoistFilters: { projects: [], labels: [] },
  todoistShowProject: true,
  todoistShowLabels: false,
  syncthingUrl: "http://127.0.0.1:8384",
  syncthingApiKey: "",
  syncthingFolderId: "",
  syncthingShowCounts: false,
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
const SEC_TODO = "sec:todoist";
const SEC_SYNC = "sec:sync";

// ── Todoist ─────────────────────────────────────────────────────────────────

interface TodoistTask {
  id: string;
  content: string;
  description?: string;
  priority: number;   // API: 1..4, onde 4 = urgente (= p1 na UI)
  due?: { date: string; datetime?: string; string?: string; is_recurring?: boolean } | null;
  project_id?: string;
  is_completed?: boolean;
  labels?: string[];
  url?: string;
}

// Prioridade da API (4=urgente) → rótulo/cor da UI (p1=vermelho … p4=cinza).
const TODOIST_PRI: Record<number, { label: string; color: string }> = {
  4: { label: "p1", color: "#EF4444" },
  3: { label: "p2", color: "#F59E0B" },
  2: { label: "p3", color: "#3B82F6" },
  1: { label: "p4", color: "#6B7280" },
};
function priMeta(p: number) { return TODOIST_PRI[p] ?? TODOIST_PRI[1]; }

// Paleta nomeada do Todoist → hex (para colorir as etiquetas como no app).
const TODOIST_COLORS: Record<string, string> = {
  berry_red: "#B8255F", red: "#DB4035", orange: "#FF9933", yellow: "#FAD000",
  olive_green: "#AFB83B", lime_green: "#7ECC49", green: "#299438", mint_green: "#6ACCBC",
  teal: "#158FAD", sky_blue: "#14AAF5", light_blue: "#96C3EB", blue: "#4073FF",
  grape: "#884DFF", violet: "#AF38EB", lavender: "#EB96EB", magenta: "#E05194",
  salmon: "#FF8D85", charcoal: "#808080", grey: "#B8B8B8", taupe: "#CCAC93",
};
const LABEL_FALLBACK = "#B8B8B8";

// Busca as tarefas ativas (não concluídas) via API unificada v1 (a REST v2 foi
// aposentada → respondia 410). A v1 é paginada: { results, next_cursor }.
async function fetchTodoistTasks(token: string): Promise<TodoistTask[]> {
  const all: TodoistTask[] = [];
  let cursor: string | null = null;
  do {
    const url = new URL("https://api.todoist.com/api/v1/tasks");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await requestUrl({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false,
    });
    if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

    const data = res.json as { results?: TodoistTask[]; next_cursor?: string | null };
    // v1 envelopa em results; tolera resposta como array puro por segurança.
    if (Array.isArray(data)) { all.push(...(data as TodoistTask[])); cursor = null; }
    else { all.push(...(data.results ?? [])); cursor = data.next_cursor ?? null; }
  } while (cursor);
  return all;
}

interface TodoistProject {
  id: string;
  name: string;
}

// Busca os projetos (para o filtro). Mesma API v1 paginada das tarefas.
async function fetchTodoistProjects(token: string): Promise<TodoistProject[]> {
  const all: TodoistProject[] = [];
  let cursor: string | null = null;
  do {
    const url = new URL("https://api.todoist.com/api/v1/projects");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await requestUrl({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false,
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

    const data = res.json as { results?: TodoistProject[]; next_cursor?: string | null };
    if (Array.isArray(data)) { all.push(...(data as TodoistProject[])); cursor = null; }
    else { all.push(...(data.results ?? [])); cursor = data.next_cursor ?? null; }
  } while (cursor);
  return all;
}

interface TodoistLabel {
  id: string;
  name: string;
  color: string;   // nome da paleta (ex.: "charcoal")
}

// Busca as etiquetas pessoais (para colorir os chips). Mesma API v1 paginada.
async function fetchTodoistLabels(token: string): Promise<TodoistLabel[]> {
  const all: TodoistLabel[] = [];
  let cursor: string | null = null;
  do {
    const url = new URL("https://api.todoist.com/api/v1/labels");
    url.searchParams.set("limit", "200");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await requestUrl({
      url: url.toString(),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      throw: false,
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

    const data = res.json as { results?: TodoistLabel[]; next_cursor?: string | null };
    if (Array.isArray(data)) { all.push(...(data as TodoistLabel[])); cursor = null; }
    else { all.push(...(data.results ?? [])); cursor = data.next_cursor ?? null; }
  } while (cursor);
  return all;
}

// ── Syncthing (API REST) — v0.10.0 ───────────────────────────────────────────

interface STFolder { id: string; label: string; path: string; paused: boolean }
interface STDevice { deviceID: string; name: string }
interface STStatus { state: string; needFiles: number; needBytes: number; errors: number; pullErrors: number }
interface STCompletion { completion: number; globalItems: number; needItems: number; needBytes: number; needDeletes: number }

interface SyncDevRow { name: string; online: boolean; completion: number; globalItems: number; needItems: number; needBytes: number; needDeletes: number; lastSeen: string }
interface SyncData { state: string; needFiles: number; needBytes: number; folderLabel: string; errors: number; devices: SyncDevRow[] }

function humanBytes(n: number): string {
  if (!n) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / 1048576).toFixed(n < 10485760 ? 1 : 0)} MB`;
}

function relTime(iso: string): string {
  const t = Date.parse(iso);
  if (isNaN(t) || t < 1) return "—";
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "agora";
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  return `há ${Math.floor(s / 86400)} d`;
}

// GET genérico na API do Syncthing (header X-API-Key; requestUrl ignora CORS).
async function stGet<T>(base: string, key: string, path: string): Promise<T> {
  const url = base.replace(/\/+$/, "") + path;
  const res = await requestUrl({ url, method: "GET", headers: { "X-API-Key": key }, throw: false });
  if (res.status === 401 || res.status === 403) throw new Error("API key inválida (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  return res.json as T;
}

// URL para abrir a tarefa no Todoist (usa a do payload ou monta a partir do id).
function taskUrl(t: TodoistTask): string {
  return t.url ?? `https://app.todoist.com/app/task/${t.id}`;
}

// Conclui (fecha) uma tarefa no Todoist. POST sem corpo; 204 = sucesso. Fase 8.2.
async function closeTodoistTask(token: string, id: string): Promise<void> {
  const res = await requestUrl({
    url: `https://api.todoist.com/api/v1/tasks/${id}/close`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    throw: false,
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
  if (res.status !== 204 && res.status !== 200) throw new Error(`HTTP ${res.status}`);
}

// ── Escrita: criar / editar / mover / excluir (v0.8.0) ───────────────────────

// Campos graváveis. Todos opcionais — no editar mando só o que mudou.
interface TodoistWrite {
  content?: string;
  description?: string;
  priority?: number;     // 1..4 (4 = urgente / p1 na UI)
  due_string?: string;   // linguagem natural; "no date" limpa a data
  due_lang?: string;     // "pt" → interpreta em português
  labels?: string[];
  project_id?: string;
}

function jsonHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

// Cria uma tarefa. POST /tasks → 200 com a tarefa criada.
async function createTodoistTask(token: string, fields: TodoistWrite): Promise<TodoistTask> {
  const res = await requestUrl({
    url: "https://api.todoist.com/api/v1/tasks",
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(fields),
    throw: false,
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  return res.json as TodoistTask;
}

// Edita uma tarefa. POST /tasks/{id} → 200. Não troca de projeto (use moveTodoistTask).
async function updateTodoistTask(token: string, id: string, fields: TodoistWrite): Promise<void> {
  const res = await requestUrl({
    url: `https://api.todoist.com/api/v1/tasks/${id}`,
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(fields),
    throw: false,
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
}

// Move a tarefa para outro projeto. POST /tasks/{id}/move → 200.
async function moveTodoistTask(token: string, id: string, project_id: string): Promise<void> {
  const res = await requestUrl({
    url: `https://api.todoist.com/api/v1/tasks/${id}/move`,
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ project_id }),
    throw: false,
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
}

// Exclui a tarefa. DELETE /tasks/{id} → 204.
async function deleteTodoistTask(token: string, id: string): Promise<void> {
  const res = await requestUrl({
    url: `https://api.todoist.com/api/v1/tasks/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    throw: false,
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
  if (res.status !== 204 && res.status !== 200) throw new Error(`HTTP ${res.status}`);
}

// Data de vencimento (YYYY-MM-DD) de uma tarefa, ou null se sem due.
function dueKey(t: TodoistTask): string | null {
  const d = t.due?.date ?? t.due?.datetime;
  return d ? d.substring(0, 10) : null;
}

// A tarefa tem descrição (instruções)?
function hasDesc(t: TodoistTask): boolean {
  return !!t.description && t.description.trim().length > 0;
}
const DESC_MAX = 700;   // corte da descrição no tooltip (o resto fica no Todoist)

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

// ── Urgência (propriedade `urgency`) ──────────────────────────────────────────
type Urgency = "alta" | "media" | "baixa";
const URGENCY_RANK: Record<Urgency, number> = { baixa: 1, media: 2, alta: 3 };
const URGENCY_COLOR: Record<Urgency, string> = { alta: "#EF4444", media: "#F59E0B", baixa: "#EAB308" };

function readNoteUrgency(app: App, file: TFile): Urgency | null {
  const u = app.metadataCache.getCache(file.path)?.frontmatter?.urgency;
  return u === "alta" || u === "media" || u === "baixa" ? u : null;
}

type UrgencyInfo = { items: { file: TFile; level: Urgency }[]; max: Urgency | null };

// Notas com `urgency` em toda a subárvore + o nível máximo (ordenadas por nível desc).
function urgencyStats(app: App, folder: TFolder): UrgencyInfo {
  const items: { file: TFile; level: Urgency }[] = [];
  const walk = (f: TFolder) => {
    for (const c of f.children) {
      if (c instanceof TFile && c.extension === "md" && c.name !== "status.md") {
        const u = readNoteUrgency(app, c);
        if (u) items.push({ file: c, level: u });
      } else if (c instanceof TFolder) walk(c);
    }
  };
  walk(folder);
  let max: Urgency | null = null;
  for (const it of items) if (!max || URGENCY_RANK[it.level] > URGENCY_RANK[max]) max = it.level;
  items.sort((a, b) => URGENCY_RANK[b.level] - URGENCY_RANK[a.level]);
  return { items, max };
}

// ── Arquivos exibíveis: nota (.md) / canvas (.canvas) / base (.base) ──────────
const FILE_EXTS = ["md", "canvas", "base"];
// id Lucide por tipo de arquivo.
function fileGlyph(ext: string): string {
  if (ext === "canvas") return "shapes";
  if (ext === "base") return "table-2";
  return "file-text";
}
function filesIn(folder: TFolder): TFile[] {
  return (folder.children.filter(
    c => c instanceof TFile && FILE_EXTS.includes(c.extension) && c.name !== "status.md"
  ) as TFile[]).sort((a, b) => a.basename.localeCompare(b.basename, "pt"));
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

  // Estado da integração Todoist
  private todoistTasks: TodoistTask[] = [];
  private todoistProjects: TodoistProject[] = [];
  private todoistProjectMap = new Map<string, string>();   // id → nome
  private todoistLabelColor = new Map<string, string>();   // nome da etiqueta → hex
  private todoistLoading = false;
  private todoistError: string | null = null;
  private todoistFetchedAt = 0;
  private todoistLaterOpen = false;
  private todoistFilterOpen = false;

  // Estado do Syncthing (v0.10.0)
  private syncData: SyncData | null = null;
  private syncLoading = false;
  private syncError: string | null = null;
  private syncFetchedAt = 0;
  private conflictConfirm: string | null = null;   // path do conflito aguardando confirmação

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
      else if (id === "todoist") this.renderTodoist(root);
      else if (id === "sync")    this.renderSync(root);
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
    if (key === SEC_TODO) return "📋 Tarefas";
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
      // Pasta oculta com notas urgentes → contorno pela cor do nível máximo.
      const f = this.app.vault.getAbstractFileByPath(key);
      const urg = f instanceof TFolder ? urgencyStats(this.app, f) : { items: [], max: null };
      if (urg.max) {
        chip.addClass("wd-hidden-urgent");
        chip.addClass(`wd-u-${urg.max}`);
        chip.style.borderColor = URGENCY_COLOR[urg.max];
      }
      setIcon(chip.createSpan({ cls: "wd-chip-icon" }), "eye");
      chip.createSpan({ text: this.hiddenLabel(key) });
      chip.setAttr("title", urg.max
        ? `Mostrar novamente — ${urg.items.length} nota(s) urgente(s)`
        : "Mostrar novamente");
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
    this.tip = tip;
    this.positionTip(tip, target);
  }

  // Posiciona um tooltip fixo abaixo do alvo (vira para cima se faltar espaço).
  private positionTip(tip: HTMLElement, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    if (top + th > window.innerHeight - 8) top = rect.top - th - 6;  // vira para cima se faltar espaço
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top  = `${Math.max(8, top)}px`;
  }

  // Tooltip listando as notas urgentes de uma pasta (hover no badge de aviso).
  private showUrgencyTip(target: HTMLElement, items: { file: TFile; level: Urgency }[]) {
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
  private urgencyBadge(card: HTMLElement, urg: UrgencyInfo) {
    if (!urg.max) return;
    const b = card.createSpan({ cls: `wd-urgency-badge wd-u-${urg.max}` });
    setIcon(b, "triangle-alert");
    b.addEventListener("mouseenter", () => this.showUrgencyTip(b, urg.items));
    b.addEventListener("mouseleave", () => this.hideTip());
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
    const phone = Platform.isPhone;

    // Celular: janela de 3 dias = ontem · hoje · amanhã (weekOffset pagina de 3 em 3).
    const dayAnchor = new Date();
    dayAnchor.setDate(dayAnchor.getDate() - 1 + this.weekOffset * 3);
    const fmtDM = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (phone) {
      const last = new Date(dayAnchor); last.setDate(dayAnchor.getDate() + 2);
      nav.createSpan({ cls: "wd-cal-week-label", text: `${fmtDM(dayAnchor)} – ${fmtDM(last)}` });
    } else {
      nav.createSpan({ cls: "wd-cal-week-label", text: `Semana ${weekNum}` });
    }

    const ctrls = nav.createDiv({ cls: "wd-cal-ctrls" });
    const prev = ctrls.createSpan({ cls: "wd-cal-arrow", text: "‹" });
    const next = ctrls.createSpan({ cls: "wd-cal-arrow", text: "›" });
    prev.onclick = () => { this.weekOffset--; this.render(); };
    next.onclick = () => { this.weekOffset++; this.render(); };
    this.moveControls(ctrls, "calendar");
    this.hideBtn(ctrls, SEC_CAL, "Ocultar calendário", "wd-sec-hide");

    // ── Celular: lista vertical de 3 dias (ontem/hoje/amanhã) ───────────────
    // Cada dia = a nota diária (uma por dia). Linha inteira clicável: abre a
    // existente; se não houver, cria.
    if (phone) {
      const list = sec.createDiv({ cls: "wd-cal-list" });
      for (let i = 0; i < 3; i++) {
        const day = new Date(dayAnchor);
        day.setDate(dayAnchor.getDate() + i);
        const key = toKey(day);
        const dow = (day.getDay() + 6) % 7;
        const note = this.findDailyNote(key);
        const row = list.createDiv({
          cls: ["wd-cal-drow", key === todayK ? "wd-today" : "", dow >= 5 ? "wd-weekend" : ""].filter(Boolean).join(" "),
        });
        row.setAttr("title", note ? "Abrir nota diária" : "Criar nota diária");
        const hd = row.createDiv({ cls: "wd-cal-drow-hd" });
        hd.createSpan({ cls: "wd-cal-name", text: DAY_SHORT[dow] });
        hd.createSpan({ cls: "wd-cal-num", text: String(day.getDate()) });
        const body = row.createDiv({ cls: "wd-cal-drow-notes" });
        if (note) {
          const pill = body.createDiv({ cls: "wd-cal-pill" });
          pill.textContent = note.basename.length > 24 ? note.basename.slice(0, 24) + "…" : note.basename;
        } else {
          body.createSpan({ cls: "wd-cal-drow-empty", text: "criar nota diária" });
        }
        row.onclick = () => void this.openDailyNote(key);
      }
      return;
    }

    // ── Desktop/tablet: grade de 7 dias ─────────────────────────────────────
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

  // Acha a nota diária de `key` (YYYY-MM-DD): primeiro pelo caminho canônico em
  // 50.Diário/, senão qualquer nota cujo `date:` seja esse dia. Null se não houver.
  // (Relatório/nota diária é um por dia → abre o existente em vez de criar outro.)
  private findDailyNote(key: string): TFile | null {
    const direct = this.app.vault.getAbstractFileByPath(`${DAILY_FOLDER}/${key}.md`);
    if (direct instanceof TFile) return direct;
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (normalizeDate(this.app.metadataCache.getCache(f.path)?.frontmatter?.date) === key) return f;
    }
    return null;
  }

  // Abre a nota diária de `key`; cria em 50.Diário/ SÓ se não existir nenhuma.
  private async openDailyNote(key: string) {
    const existing = this.findDailyNote(key);
    if (existing) { await this.app.workspace.getLeaf(false).openFile(existing); return; }

    // Não existe → cria no caminho canônico.
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
    const file = await this.app.vault.create(`${DAILY_FOLDER}/${key}.md`, body);
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
    const rootFiles = filesIn(vaultRoot);
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
        if (cover) {
          card.createDiv({ cls: "wd-cover" }).createEl("img", { attr: { src: cover, draggable: "false" } });
        } else {
          // Capa padrão sutil (versão menor que as pastas de topo) — Fase 9.1
          const dc = card.createDiv({ cls: "wd-cover wd-cover-default wd-cover-sub" });
          renderIcon(dc.createSpan({ cls: "wd-cover-glyph" }), customIcon ?? "📁");
        }

        card.createDiv({ cls: `wd-badge wd-badge-${status}`, text: STATUS_ICON[status] });
        this.urgencyBadge(card, urgencyStats(this.app, sf));

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

    // Arquivos da pasta atual (notas, canvas, bases)
    const notes = filesIn(folder);
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
    if (Platform.isPhone) return;   // heatmap (ano inteiro) ocultado no celular

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
        const isMd = f.extension === "md";
        const st = isMd ? readNoteStatus(this.app, f) : "progress";
        const rv = isMd && this.app.metadataCache.getCache(f.path)?.frontmatter?.reviewed === true;
        const urg = isMd ? readNoteUrgency(this.app, f) : null;

        const card = grid.createDiv({ cls: `wd-note-card wd-s-${st}` });
        // Capa padrão por tipo de arquivo (nota / canvas / base) — Fase 9.2
        const cov = card.createDiv({ cls: `wd-note-cover wd-file-${f.extension}` });
        setIcon(cov.createSpan({ cls: "wd-note-cover-glyph" }), fileGlyph(f.extension));

        if (isMd) card.createDiv({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "Não revisada");
        if (urg) { const w = card.createSpan({ cls: `wd-urgency-mark wd-u-${urg}` }); setIcon(w, "triangle-alert"); w.setAttr("title", `Urgência: ${urg}`); }

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
        const rv = isMd && this.app.metadataCache.getCache(f.path)?.frontmatter?.reviewed === true;
        const urg = isMd ? readNoteUrgency(this.app, f) : null;

        const row = list.createDiv({ cls: `wd-note-row wd-s-${st}` });
        const ti = row.createSpan({ cls: `wd-note-typeicon wd-file-${f.extension}` });
        setIcon(ti, fileGlyph(f.extension));
        if (isMd) row.createSpan({ cls: `wd-note-dot wd-badge-${st}` });

        const name = row.createSpan({ cls: "wd-note-name", text: f.basename });
        if (st === "cancelled") name.addClass("wd-strike");
        if (urg) { const w = row.createSpan({ cls: `wd-urgency-mark wd-u-${urg}` }); setIcon(w, "triangle-alert"); w.setAttr("title", `Urgência: ${urg}`); }
        if (isMd) row.createSpan({ cls: "wd-note-rv " + (rv ? "wd-rv-yes" : "wd-rv-no") }).setAttr("title", rv ? "Revisada" : "Não revisada");
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

    // Últimos N dias (menos no celular)
    const DAYS = Platform.isPhone ? 15 : 30;
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
    info.createSpan({ cls: "wd-growth-period", text: this.growthCumulative ? `notas acumuladas (${DAYS} dias)` : `notas criadas nos últimos ${DAYS} dias` });

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

  // ── Todoist (Fase 8.1 — leitura) ──────────────────────────────────────────

  private renderTodoist(root: HTMLElement) {
    if (this.isHidden(SEC_TODO)) return;

    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });

    const token = this.plugin.settings.todoistToken.trim();
    if (token) {
      // Toggle de janela "próximos dias" (3 / 7).
      const range = this.dayRange();
      const seg = ctrls.createDiv({ cls: "wd-todo-range" });
      for (const n of [3, 7] as const) {
        const b = seg.createSpan({ cls: "wd-todo-range-btn" + (range === n ? " wd-on" : ""), text: `${n}d` });
        b.setAttr("title", `Mostrar os próximos ${n} dias`);
        b.onclick = async e => {
          e.stopPropagation();
          this.plugin.settings.todoistDayRange = n;
          await this.plugin.saveSettings();
          this.render();
        };
      }

      // Botão de filtros (projeto/etiqueta).
      const f = this.plugin.settings.todoistFilters;
      const nF = f.projects.length + f.labels.length;
      const filt = ctrls.createSpan({ cls: "wd-todo-filterbtn" + (this.todoistFilterOpen ? " wd-on" : "") + (nF ? " wd-active" : "") });
      setIcon(filt, "filter");
      filt.setAttr("title", nF ? `Filtros ativos (${nF}) — clique para ajustar` : "Filtrar por projeto/etiqueta");
      if (nF) filt.createSpan({ cls: "wd-todo-filtct", text: String(nF) });
      filt.onclick = e => { e.stopPropagation(); this.todoistFilterOpen = !this.todoistFilterOpen; this.render(); };

      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.todoistLoading ? " wd-spin" : "") });
      setIcon(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      refresh.onclick = e => { e.stopPropagation(); void this.fetchTodoist(true); };

      this.addTaskBtn(ctrls, undefined, "Nova tarefa");
    }
    this.moveControls(ctrls, "todoist");
    this.hideBtn(ctrls, SEC_TODO, "Ocultar tarefas", "wd-sec-hide");

    if (!token) {
      sec.createDiv({ cls: "wd-empty", text: "Cole seu token do Todoist em Configurações → Werus Dashboard para ver suas tarefas aqui." });
      return;
    }

    // Primeira carga preguiçosa (não refaz em loop se já buscou ou se deu erro).
    if (!this.todoistFetchedAt && !this.todoistLoading && !this.todoistError) void this.fetchTodoist(false);

    if (this.todoistError) {
      sec.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao buscar tarefas: ${this.todoistError}` });
      return;
    }
    if (!this.todoistFetchedAt) {
      sec.createDiv({ cls: "wd-empty", text: "Carregando tarefas…" });
      return;
    }

    // Barra de filtros (recolhível).
    if (this.todoistFilterOpen) this.renderTodoFilterBar(sec);

    const range = this.dayRange();
    const todayK = toKey(new Date());
    const lastUpcoming = new Date();
    lastUpcoming.setDate(lastUpcoming.getDate() + range);
    const lastK = toKey(lastUpcoming);   // limite dos "próximos dias" (inclusive)

    // Aplica filtros e separa em baldes: atrasadas · hoje · próximos N dias · depois.
    const tasks = this.applyTodoistFilters(this.todoistTasks);
    const overdue: TodoistTask[] = [];
    const todayTasks: TodoistTask[] = [];
    const byDay: Record<string, TodoistTask[]> = {};
    const later: TodoistTask[] = [];
    for (const t of tasks) {
      const dk = dueKey(t);
      if (!dk) continue;   // sem data: fora dos blocos por dia (poderá virar "Caixa de entrada" no futuro)
      if (dk < todayK) overdue.push(t);
      else if (dk === todayK) todayTasks.push(t);
      else if (dk <= lastK) (byDay[dk] ??= []).push(t);
      else later.push(t);
    }
    const byPri = (a: TodoistTask, b: TodoistTask) => b.priority - a.priority;
    overdue.sort(byPri); todayTasks.sort(byPri); later.sort(byPri);
    for (const k of Object.keys(byDay)) byDay[k].sort(byPri);

    const visible = overdue.length + todayTasks.length + later.length + Object.values(byDay).reduce((s, a) => s + a.length, 0);
    if (visible === 0) {
      const all = this.todoistTasks.length;
      sec.createDiv({ cls: "wd-empty", text: all ? "Nenhuma tarefa bate com os filtros." : "Nenhuma tarefa com data no Todoist. 🎉" });
      return;
    }

    // Linha horizontal com 3 caixas lado a lado: Atrasadas · Hoje · Próximos N dias.
    const cols = sec.createDiv({ cls: "wd-todo-cols" });

    // 1ª — Atrasadas (caixa vermelha).
    const obox = cols.createDiv({ cls: "wd-todo-box wd-box-overdue" });
    const ohd = obox.createDiv({ cls: "wd-todo-boxhd" });
    ohd.createSpan({ cls: "wd-todo-boxwarn", text: "⚠" });
    ohd.createSpan({ cls: "wd-todo-boxlabel", text: "Atrasadas" });
    ohd.createSpan({ cls: "wd-todo-boxcount", text: String(overdue.length) });
    const obody = obox.createDiv({ cls: "wd-todo-boxbody" });
    if (overdue.length) for (const t of overdue) this.todoRow(obody, t);
    else obody.createDiv({ cls: "wd-todo-boxempty", text: "Nenhuma. 👍" });

    // 2ª — Hoje (caixa em destaque).
    const tbox = cols.createDiv({ cls: "wd-todo-box wd-box-today" });
    const thd = tbox.createDiv({ cls: "wd-todo-boxhd" });
    thd.createSpan({ cls: "wd-todo-boxlabel", text: "Hoje" });
    this.addTaskBtn(thd, "hoje", "Nova tarefa para hoje");
    thd.createSpan({ cls: "wd-todo-boxcount", text: String(todayTasks.length) });
    const tbody = tbox.createDiv({ cls: "wd-todo-boxbody" });
    if (todayTasks.length) for (const t of todayTasks) this.todoRow(tbody, t);
    else tbody.createDiv({ cls: "wd-todo-boxempty", text: "Nada para hoje." });

    // 3ª — Próximos N dias (agrupado por dia, com sub-título só nos dias que têm tarefa).
    let upcomingCount = 0;
    const upDays: { dow: number; num: number; key: string; items: TodoistTask[] }[] = [];
    for (let i = 1; i <= range; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      const key = toKey(day);
      const items = byDay[key];
      if (!items?.length) continue;
      upcomingCount += items.length;
      upDays.push({ dow: (day.getDay() + 6) % 7, num: day.getDate(), key, items });
    }
    const ubox = cols.createDiv({ cls: "wd-todo-box wd-box-upcoming" });
    const uhd = ubox.createDiv({ cls: "wd-todo-boxhd" });
    uhd.createSpan({ cls: "wd-todo-boxlabel", text: `Próximos ${range} dias` });
    this.addTaskBtn(uhd, undefined, "Nova tarefa");
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
      ubody.createDiv({ cls: "wd-todo-boxempty", text: `Nada nos próximos ${range} dias.` });
    }

    // Depois (> N dias à frente; recolhível, abaixo da linha, fechado por padrão).
    if (later.length) {
      const panel = sec.createDiv({ cls: "wd-todo-later" });
      const lhd = panel.createDiv({ cls: "wd-todo-ohd" });
      lhd.createSpan({ cls: "wd-todo-laterico", text: "›" });
      lhd.createSpan({ cls: "wd-todo-otitle", text: `Depois (${later.length})` });
      lhd.createSpan({ cls: "wd-todo-otoggle", text: this.todoistLaterOpen ? "ocultar ▾" : "mostrar ›" });
      lhd.onclick = () => { this.todoistLaterOpen = !this.todoistLaterOpen; this.render(); };
      if (this.todoistLaterOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of later) this.todoRow(list, t);
      }
    }
  }

  // Janela de "próximos dias" saneada (3 ou 7).
  private dayRange(): 3 | 7 {
    return this.plugin.settings.todoistDayRange === 3 ? 3 : 7;
  }

  // Mantém só as tarefas que batem com os filtros ativos (projeto E etiqueta).
  private applyTodoistFilters(tasks: TodoistTask[]): TodoistTask[] {
    const f = this.plugin.settings.todoistFilters;
    if (!f.projects.length && !f.labels.length) return tasks;
    const ps = new Set(f.projects), ls = new Set(f.labels);
    return tasks.filter(t => {
      if (ps.size && !(t.project_id && ps.has(t.project_id))) return false;
      if (ls.size && !(t.labels ?? []).some(l => ls.has(l))) return false;
      return true;
    });
  }

  private toggleTodoFilter(kind: "projects" | "labels", id: string) {
    const arr = this.plugin.settings.todoistFilters[kind];
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1); else arr.push(id);
  }

  // Barra de filtros: chips de projeto e de etiqueta (toggle), + limpar.
  private renderTodoFilterBar(sec: HTMLElement) {
    const f = this.plugin.settings.todoistFilters;
    const bar = sec.createDiv({ cls: "wd-todo-filterbar" });

    if (this.todoistProjects.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Projetos" });
      for (const p of this.todoistProjects) {
        const on = f.projects.includes(p.id);
        const chip = grp.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : ""), text: p.name });
        chip.onclick = async () => { this.toggleTodoFilter("projects", p.id); await this.plugin.saveSettings(); this.render(); };
      }
    }

    const labels = [...new Set(this.todoistTasks.flatMap(t => t.labels ?? []))].sort((a, b) => a.localeCompare(b));
    if (labels.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Etiquetas" });
      for (const l of labels) {
        const on = f.labels.includes(l);
        const chip = this.labelChip(grp, l, "wd-todo-fchip" + (on ? " wd-on" : ""));
        chip.onclick = async () => { this.toggleTodoFilter("labels", l); await this.plugin.saveSettings(); this.render(); };
      }
    }

    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clr.onclick = async () => { f.projects = []; f.labels = []; await this.plugin.saveSettings(); this.render(); };
    }
  }

  // Checkbox de conclusão (Fase 8.2) — conclui no Todoist real ao clicar.
  private todoCheck(host: HTMLElement, t: TodoistTask) {
    const check = host.createSpan({ cls: "wd-todo-check" });
    check.setAttr("title", "Concluir tarefa");
    check.onclick = e => { e.stopPropagation(); void this.completeTask(t); };
  }

  // Tooltip da tarefa: título completo + descrição (instruções), no hover.
  private showTaskTip(target: HTMLElement, t: TodoistTask) {
    this.hideTip();
    const tip = document.body.createDiv({ cls: "wd-tooltip wd-task-tip" });
    const head = tip.createDiv({ cls: "wd-task-tip-head" });
    head.createSpan({ cls: "wd-task-tip-pri" }).style.background = priMeta(t.priority).color;
    head.createSpan({ cls: "wd-task-tip-title", text: t.content });
    if (hasDesc(t)) {
      const d = t.description!.trim();
      tip.createDiv({ cls: "wd-task-tip-desc", text: d.length > DESC_MAX ? d.slice(0, DESC_MAX) + "…" : d });
    }
    this.tip = tip;
    this.positionTip(tip, target);
  }

  private attachTaskTip(el: HTMLElement, t: TodoistTask) {
    el.addEventListener("mouseenter", () => this.showTaskTip(el, t));
    el.addEventListener("mouseleave", () => this.hideTip());
  }

  // Linha de tarefa (usada nas 3 caixas: atrasadas, hoje, próximos e em "depois").
  private todoRow(list: HTMLElement, t: TodoistTask, showDate = true) {
    const pri = priMeta(t.priority);
    const row = list.createDiv({ cls: "wd-todo-row" });
    row.style.setProperty("--pri", pri.color);
    this.todoCheck(row, t);
    const tag = row.createSpan({ cls: "wd-todo-pri", text: pri.label });
    tag.style.background = pri.color;
    row.createSpan({ cls: "wd-todo-row-txt", text: t.content });
    if (hasDesc(t)) setIcon(row.createSpan({ cls: "wd-todo-hasdesc" }), "align-left");
    const proj = t.project_id ? this.todoistProjectMap.get(t.project_id) : undefined;
    if (this.plugin.settings.todoistShowProject && proj) row.createSpan({ cls: "wd-todo-row-proj", text: proj });
    if (this.plugin.settings.todoistShowLabels)
      for (const l of t.labels ?? []) this.labelChip(row, l, "wd-todo-row-label");
    const dk = dueKey(t);
    if (showDate && dk) {
      const [, m, d] = dk.split("-");
      row.createSpan({ cls: "wd-todo-row-date", text: `${d}/${m}` });
    }
    if (t.due?.is_recurring) row.createSpan({ cls: "wd-todo-recur", text: "⟳" });
    row.onclick = () => this.openTaskDetail(t);
    this.attachTaskTip(row, t);
  }

  // Botão "+" de criar tarefa (header da seção, caixas e sub-títulos de dia).
  private addTaskBtn(host: HTMLElement, prefillDue?: string, title = "Nova tarefa") {
    const b = host.createSpan({ cls: "wd-todo-add" });
    setIcon(b, "plus");
    b.setAttr("title", title);
    b.onclick = e => { e.stopPropagation(); this.openTaskForm({ mode: "create", prefillDue }); };
    return b;
  }

  // Abre o formulário de tarefa (criar ou editar).
  private openTaskForm(opts: { mode: "create" | "edit"; task?: TodoistTask; prefillDue?: string }) {
    this.hideTip();
    const labels = [...new Set([...this.todoistLabelColor.keys(), ...this.todoistTasks.flatMap(t => t.labels ?? [])])].sort((a, b) => a.localeCompare(b));
    new TaskFormModal(this.app, {
      mode: opts.mode,
      task: opts.task,
      prefillDue: opts.prefillDue,
      projects: this.todoistProjects,
      labels,
      labelColor: n => this.labelColor(n),
      submit: v => this.submitTaskForm(opts.mode, opts.task, v),
      remove: opts.task ? () => this.deleteTask(opts.task!) : undefined,
      complete: opts.task ? () => void this.completeTask(opts.task!) : undefined,
    }).open();
  }

  // Abre o pop-up de detalhes (só leitura); o botão "Editar" abre o formulário.
  private openTaskDetail(t: TodoistTask) {
    this.hideTip();
    new TaskDetailModal(this.app, this, {
      task: t,
      projectName: t.project_id ? this.todoistProjectMap.get(t.project_id) : undefined,
      labelColor: n => this.labelColor(n),
      edit: () => this.openTaskForm({ mode: "edit", task: t }),
      complete: () => void this.completeTask(t),
    }).open();
  }

  // Cria ou edita no Todoist real. No editar manda só os campos alterados (preserva
  // recorrência se a data não mudou) e troca de projeto via /move. Retorna true se OK.
  private async submitTaskForm(mode: "create" | "edit", task: TodoistTask | undefined, v: TaskFormValues): Promise<boolean> {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    try {
      if (mode === "create") {
        const fields: TodoistWrite = { content: v.content, priority: v.priority };
        if (v.description.trim()) fields.description = v.description.trim();
        if (v.dueString.trim()) { fields.due_string = v.dueString.trim(); fields.due_lang = "pt"; }
        if (v.projectId) fields.project_id = v.projectId;
        if (v.labels.length) fields.labels = v.labels;
        await createTodoistTask(token, fields);
        new Notice(`✓ Criada: ${v.content}`);
      } else if (task) {
        const fields: TodoistWrite = {};
        if (v.content !== task.content) fields.content = v.content;
        if (v.description !== (task.description ?? "")) fields.description = v.description;
        if (v.priority !== task.priority) fields.priority = v.priority;
        const oldDue = task.due?.string ?? task.due?.date ?? "";
        if (v.dueString.trim() !== oldDue) {
          fields.due_string = v.dueString.trim() || "no date";
          if (v.dueString.trim()) fields.due_lang = "pt";
        }
        const oldL = (task.labels ?? []).slice().sort().join(" ");
        const newL = v.labels.slice().sort().join(" ");
        if (oldL !== newL) fields.labels = v.labels;
        if (Object.keys(fields).length) await updateTodoistTask(token, task.id, fields);
        const oldProj = task.project_id ?? "";
        if (v.projectId !== oldProj && v.projectId) await moveTodoistTask(token, task.id, v.projectId);
        new Notice(`✓ Salva: ${v.content}`);
      }
      await this.fetchTodoist(true);
      return true;
    } catch (e) {
      new Notice(`Falha ao salvar: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  }

  // Exclui a tarefa (otimista) no Todoist real. Retorna true se OK.
  private async deleteTask(t: TodoistTask): Promise<boolean> {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    const idx = this.todoistTasks.findIndex(x => x.id === t.id);
    if (idx >= 0) this.todoistTasks.splice(idx, 1);
    this.render();
    try {
      await deleteTodoistTask(token, t.id);
      new Notice(`🗑 Excluída: ${t.content}`);
      return true;
    } catch (e) {
      if (idx >= 0) this.todoistTasks.splice(idx, 0, t);   // reverte
      new Notice(`Falha ao excluir: ${e instanceof Error ? e.message : String(e)}`);
      this.render();
      return false;
    }
  }

  // Conclui a tarefa de forma otimista: remove da lista e re-renderiza; se a API
  // falhar, restaura e avisa. A escrita reflete no Todoist real (Fase 8.2).
  private async completeTask(t: TodoistTask) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    const idx = this.todoistTasks.findIndex(x => x.id === t.id);
    if (idx >= 0) this.todoistTasks.splice(idx, 1);
    this.render();
    try {
      await closeTodoistTask(token, t.id);
      new Notice(`✓ Concluída: ${t.content}`);
    } catch (e) {
      if (idx >= 0) this.todoistTasks.splice(idx, 0, t);   // reverte
      new Notice(`Falha ao concluir: ${e instanceof Error ? e.message : String(e)}`);
      this.render();
    }
  }

  // Busca tarefas; `manual` mostra o spinner imediatamente.
  private async fetchTodoist(manual: boolean) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token || this.todoistLoading) return;
    this.todoistLoading = true;
    this.todoistError = null;
    if (manual) this.render();
    try {
      // Projetos/etiquetas são auxiliares; se falharem, não derrubam as tarefas.
      const [tasks, projects, labels] = await Promise.all([
        fetchTodoistTasks(token),
        fetchTodoistProjects(token).catch(() => [] as TodoistProject[]),
        fetchTodoistLabels(token).catch(() => [] as TodoistLabel[]),
      ]);
      this.todoistTasks = tasks;
      this.todoistProjects = projects;
      this.todoistProjectMap = new Map(projects.map(p => [p.id, p.name]));
      this.todoistLabelColor = new Map(labels.map(l => [l.name, TODOIST_COLORS[l.color] ?? LABEL_FALLBACK]));
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
    this.todoistProjectMap = new Map();
    this.todoistLabelColor = new Map();
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

  private async fetchSync(manual: boolean) {
    const base = this.plugin.settings.syncthingUrl.trim();
    const key = this.plugin.settings.syncthingApiKey.trim();
    if (!base || !key || this.syncLoading) return;
    this.syncLoading = true;
    this.syncError = null;
    if (manual) this.render();
    try {
      const folders = await stGet<STFolder[]>(base, key, "/rest/config/folders");
      const wanted = this.plugin.settings.syncthingFolderId.trim();
      const folder = folders.find(f => f.id === wanted) ?? folders[0];
      if (!folder) throw new Error("nenhuma pasta configurada no Syncthing");
      const fid = encodeURIComponent(folder.id);

      const [devices, conns, status, stats, sys] = await Promise.all([
        stGet<STDevice[]>(base, key, "/rest/config/devices"),
        stGet<{ connections: Record<string, { connected: boolean }> }>(base, key, "/rest/system/connections"),
        stGet<STStatus>(base, key, `/rest/db/status?folder=${fid}`),
        stGet<Record<string, { lastSeen: string }>>(base, key, "/rest/stats/device").catch(() => ({} as Record<string, { lastSeen: string }>)),
        stGet<{ myID: string }>(base, key, "/rest/system/status"),
      ]);

      const remote = devices.filter(d => d.deviceID !== sys.myID);
      const rows = await Promise.all(remote.map(async d => {
        const c = await stGet<STCompletion>(base, key, `/rest/db/completion?folder=${fid}&device=${d.deviceID}`)
          .catch(() => ({ completion: 0, globalItems: 0, needItems: 0, needBytes: 0, needDeletes: 0 }));
        return {
          name: d.name || d.deviceID.slice(0, 7),
          online: !!conns.connections[d.deviceID]?.connected,
          completion: c.completion,
          globalItems: c.globalItems ?? 0,
          needItems: c.needItems ?? 0,
          needBytes: c.needBytes,
          needDeletes: c.needDeletes,
          lastSeen: stats[d.deviceID]?.lastSeen ?? "",
        };
      }));

      this.syncData = {
        state: status.state,
        needFiles: status.needFiles,
        needBytes: status.needBytes,
        folderLabel: folder.label || folder.id,
        errors: (status.errors ?? 0) + (status.pullErrors ?? 0),
        devices: rows,
      };
      this.syncFetchedAt = Date.now();
    } catch (e) {
      this.syncError = e instanceof Error ? e.message : String(e);
    } finally {
      this.syncLoading = false;
      this.render();
    }
  }

  private renderSync(root: HTMLElement) {
    if (this.isHidden(SEC_SYNC)) return;

    const sec = root.createDiv({ cls: "wd-section wd-sync-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "SINCRONIZAÇÃO" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const key = this.plugin.settings.syncthingApiKey.trim();
    if (key) {
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.syncLoading ? " wd-spin" : "") });
      setIcon(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar estado do Syncthing");
      refresh.onclick = e => { e.stopPropagation(); void this.fetchSync(true); };
    }
    this.moveControls(ctrls, "sync");
    this.hideBtn(ctrls, SEC_SYNC, "Ocultar sincronização", "wd-sec-hide");

    if (!key) {
      sec.createDiv({ cls: "wd-empty", text: "Configure a URL e a API key do Syncthing em Configurações → Werus Dashboard." });
    } else if (this.syncError) {
      sec.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao falar com o Syncthing: ${this.syncError}` });
    } else if (!this.syncFetchedAt) {
      if (!this.syncLoading) void this.fetchSync(false);
      sec.createDiv({ cls: "wd-empty", text: "Carregando…" });
    } else {
      this.renderSyncBody(sec, this.syncData!);
    }

    this.renderConflicts(sec);
  }

  private renderSyncBody(sec: HTMLElement, d: SyncData) {
    const box = sec.createDiv({ cls: "wd-sync-box" });

    // Estado da pasta.
    const busy = d.state === "syncing" || d.state === "scanning";
    const fl = box.createDiv({ cls: "wd-sync-folder" });
    const dot = fl.createSpan({ cls: "wd-sync-dot " + (d.errors ? "wd-s-err" : busy ? "wd-s-busy" : "wd-s-ok") });
    dot.setText(d.errors ? "⚠" : busy ? "⟳" : "●");
    fl.createSpan({ cls: "wd-sync-fname", text: d.folderLabel });
    const st = d.state === "idle" ? "em dia" : d.state === "syncing" ? `sincronizando — ${d.needFiles} itens (${humanBytes(d.needBytes)})` : d.state;
    fl.createSpan({ cls: "wd-sync-fstate", text: st });

    // Aparelhos.
    for (const dev of d.devices) {
      const row = box.createDiv({ cls: "wd-sync-dev" });
      const o = row.createSpan({ cls: "wd-sync-dot " + (dev.online ? "wd-s-ok" : "wd-s-off") });
      o.setText("●");
      row.createSpan({ cls: "wd-sync-dname", text: dev.name });
      row.createSpan({ cls: "wd-sync-dcomp", text: `${Math.round(dev.completion)}%` });
      if (this.plugin.settings.syncthingShowCounts && dev.globalItems)
        row.createSpan({ cls: "wd-sync-dcount", text: `${dev.globalItems - dev.needItems}/${dev.globalItems}` });
      const extra = dev.needDeletes ? `${dev.needDeletes} exclusões` : dev.needBytes ? humanBytes(dev.needBytes) : "";
      if (extra) row.createSpan({ cls: "wd-sync-dpend", text: extra });
      row.createSpan({ cls: "wd-sync-dseen", text: dev.online ? "online" : relTime(dev.lastSeen) });
    }

    if (d.errors) box.createDiv({ cls: "wd-sync-errline", text: `⚠ ${d.errors} erro(s) na pasta` });
  }

  // Lista de cópias de conflito do Syncthing (abrir / apagar com confirmação).
  private renderConflicts(sec: HTMLElement) {
    const conflicts = this.app.vault.getFiles().filter(f => f.name.includes(".sync-conflict-"));
    const wrap = sec.createDiv({ cls: "wd-sync-conflicts" });
    wrap.createDiv({ cls: "wd-sync-sub", text: `Conflitos (${conflicts.length})` });
    if (!conflicts.length) {
      wrap.createDiv({ cls: "wd-sync-noconf", text: "Nenhum conflito. 🎉" });
      return;
    }
    for (const f of conflicts) {
      const row = wrap.createDiv({ cls: "wd-sync-crow" });
      const name = row.createSpan({ cls: "wd-sync-cname", text: f.name });
      name.setAttr("title", "Abrir " + f.path);
      name.onclick = () => this.app.workspace.getLeaf(false).openFile(f);
      if (this.conflictConfirm === f.path) {
        const yes = row.createSpan({ cls: "wd-sync-cyes", text: "apagar?" });
        yes.onclick = async () => { await this.app.vault.trash(f, false); this.conflictConfirm = null; this.render(); };
        const no = row.createSpan({ cls: "wd-sync-cno", text: "cancelar" });
        no.onclick = () => { this.conflictConfirm = null; this.render(); };
      } else {
        const del = row.createSpan({ cls: "wd-sync-cdel" });
        setIcon(del, "trash-2");
        del.setAttr("title", "Apagar cópia de conflito (vai para a lixeira)");
        del.onclick = () => { this.conflictConfirm = f.path; this.render(); };
      }
    }
  }

  // Cor (hex) de uma etiqueta pelo nome; cinza se desconhecida.
  private labelColor(name: string): string {
    return this.todoistLabelColor.get(name) ?? LABEL_FALLBACK;
  }

  // Cria um chip de etiqueta com bolinha colorida + "@nome".
  private labelChip(host: HTMLElement, name: string, cls: string): HTMLElement {
    const chip = host.createSpan({ cls });
    chip.createSpan({ cls: "wd-label-dot" }).style.background = this.labelColor(name);
    chip.createSpan({ text: `@${name}` });
    return chip;
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
    // Saneamento: sectionOrder com exatamente as seções válidas, sem duplicatas.
    const valid: SectionId[] = ["stats", "todoist", "para", "sync", "heatmap", "growth", "reports", "calendar"];
    const seen = new Set<SectionId>();
    const cleaned = (this.settings.sectionOrder || []).filter(
      (s): s is SectionId => valid.includes(s as SectionId) && !seen.has(s as SectionId) && (seen.add(s as SectionId), true)
    );
    for (const v of valid) if (!seen.has(v)) cleaned.push(v);
    this.settings.sectionOrder = cleaned;
    if (!Array.isArray(this.settings.hidden)) this.settings.hidden = [];
    // Saneamento Todoist (v0.7.0).
    this.settings.todoistDayRange = this.settings.todoistDayRange === 3 ? 3 : 7;
    const tf = this.settings.todoistFilters;
    this.settings.todoistFilters = {
      projects: Array.isArray(tf?.projects) ? tf.projects : [],
      labels: Array.isArray(tf?.labels) ? tf.labels : [],
    };
    // Exibição nas linhas (v0.8.0).
    this.settings.todoistShowProject = this.settings.todoistShowProject !== false;
    this.settings.todoistShowLabels = this.settings.todoistShowLabels === true;
    // Syncthing (v0.10.0).
    if (typeof this.settings.syncthingUrl !== "string" || !this.settings.syncthingUrl.trim())
      this.settings.syncthingUrl = "http://127.0.0.1:8384";
    if (typeof this.settings.syncthingApiKey !== "string") this.settings.syncthingApiKey = "";
    if (typeof this.settings.syncthingFolderId !== "string") this.settings.syncthingFolderId = "";
    this.settings.syncthingShowCounts = this.settings.syncthingShowCounts === true;
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

// ── Pop-up de detalhes da tarefa (só leitura; botão Editar abre o formulário) ─

interface TaskDetailOpts {
  task: TodoistTask;
  projectName?: string;
  labelColor: (name: string) => string;
  edit: () => void;
  complete: () => void;
}

class TaskDetailModal extends Modal {
  constructor(app: App, private component: Component, private opts: TaskDetailOpts) { super(app); }

  onOpen() {
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
      meta.createSpan({ cls: "wd-td-chip", text: `📅 ${d}/${m}/${y}${t.due?.is_recurring ? " ⟳" : ""}` });
    }
    if (this.opts.projectName) meta.createSpan({ cls: "wd-td-chip", text: `# ${this.opts.projectName}` });
    for (const l of t.labels ?? []) {
      const chip = meta.createSpan({ cls: "wd-td-chip wd-td-label" });
      chip.createSpan({ cls: "wd-label-dot" }).style.background = this.opts.labelColor(l);
      chip.createSpan({ text: `@${l}` });
    }

    if (hasDesc(t)) {
      const body = contentEl.createDiv({ cls: "wd-task-modal-desc markdown-rendered" });
      void MarkdownRenderer.render(this.app, t.description!.trim(), body, "", this.component);
    } else {
      contentEl.createEl("p", { cls: "wd-task-modal-empty", text: "Esta tarefa não tem descrição." });
    }

    // Editar (esquerda) · Concluir + Abrir no Todoist (direita).
    const actions = contentEl.createDiv({ cls: "wd-task-modal-actions" });
    const edit = actions.createEl("button", { text: "✎ Editar" });
    edit.onclick = () => { this.close(); this.opts.edit(); };
    actions.createDiv({ cls: "wd-tf-spacer" });
    const done = actions.createEl("button", { text: "✓ Concluir" });
    done.onclick = () => { this.opts.complete(); this.close(); };
    const open = actions.createEl("button", { text: "Abrir no Todoist", cls: "mod-cta" });
    open.onclick = () => window.open(taskUrl(t), "_blank");
  }

  onClose() { this.contentEl.empty(); }
}

// ── Formulário de tarefa (criar / editar) ────────────────────────────────────

interface TaskFormValues {
  content: string;
  description: string;
  priority: number;   // API 1..4 (4 = p1)
  dueString: string;
  projectId: string;
  labels: string[];
}

interface TaskFormOpts {
  mode: "create" | "edit";
  task?: TodoistTask;
  prefillDue?: string;
  projects: TodoistProject[];
  labels: string[];
  labelColor: (name: string) => string;
  submit: (v: TaskFormValues) => Promise<boolean>;
  remove?: () => Promise<boolean>;
  complete?: () => void;
}

class TaskFormModal extends Modal {
  private v: TaskFormValues;
  private knownLabels: string[];
  private confirmDel = false;
  private actionsEl!: HTMLElement;

  constructor(app: App, private opts: TaskFormOpts) {
    super(app);
    const t = opts.task;
    this.v = {
      content: t?.content ?? "",
      description: t?.description ?? "",
      priority: t?.priority ?? 1,
      dueString: t?.due?.string ?? opts.prefillDue ?? "",
      projectId: t?.project_id ?? "",
      labels: (t?.labels ?? []).slice(),
    };
    this.knownLabels = [...new Set([...opts.labels, ...this.v.labels])].sort((a, b) => a.localeCompare(b));
  }

  onOpen() {
    const { contentEl, titleEl, modalEl } = this;
    modalEl.addClass("wd-task-form");
    titleEl.setText(this.opts.mode === "create" ? "Nova tarefa" : "Editar tarefa");

    this.field("Título");
    const content = contentEl.createEl("input", { cls: "wd-tf-input", type: "text" });
    content.value = this.v.content;
    content.placeholder = "O que precisa ser feito?";
    content.oninput = () => { this.v.content = content.value; };
    setTimeout(() => content.focus(), 0);

    this.field("Descrição");
    const desc = contentEl.createEl("textarea", { cls: "wd-tf-textarea" });
    desc.value = this.v.description;
    desc.placeholder = "Detalhes / instruções (markdown)";
    desc.rows = 3;
    desc.oninput = () => { this.v.description = desc.value; };

    this.field("Prioridade");
    const prow = contentEl.createDiv({ cls: "wd-tf-pri-row" });
    const renderPri = () => {
      prow.empty();
      for (const api of [4, 3, 2, 1]) {
        const meta = TODOIST_PRI[api];
        const b = prow.createSpan({ cls: "wd-tf-pri" + (this.v.priority === api ? " wd-on" : ""), text: meta.label });
        b.style.setProperty("--pri", meta.color);
        b.onclick = () => { this.v.priority = api; renderPri(); };
      }
    };
    renderPri();

    this.field("Data");
    const due = contentEl.createEl("input", { cls: "wd-tf-input", type: "text" });
    due.value = this.v.dueString;
    due.placeholder = "ex.: amanhã, sexta, todo dia 1, 2026-06-10";
    due.oninput = () => { this.v.dueString = due.value; };
    contentEl.createDiv({ cls: "wd-tf-hint", text: "Texto em português. Vazio = sem data." });
    if (this.opts.task?.due?.is_recurring)
      contentEl.createDiv({ cls: "wd-tf-warn", text: "⟳ Tarefa recorrente — mudar a data pode alterar a recorrência." });

    this.field("Projeto");
    const sel = contentEl.createEl("select", { cls: "wd-tf-select" });
    const inbox = sel.createEl("option", { text: "Entrada (Inbox)", value: "" });
    if (!this.v.projectId) inbox.selected = true;
    for (const p of this.opts.projects) {
      const o = sel.createEl("option", { text: p.name, value: p.id });
      if (p.id === this.v.projectId) o.selected = true;
    }
    sel.onchange = () => { this.v.projectId = sel.value; };

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
            if (i >= 0) this.v.labels.splice(i, 1); else this.v.labels.push(l);
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

  private field(label: string) {
    this.contentEl.createDiv({ cls: "wd-tf-label", text: label });
  }

  private renderActions() {
    const a = this.actionsEl;
    a.empty();

    if (this.confirmDel && this.opts.remove) {
      a.createSpan({ cls: "wd-tf-confirm", text: "Excluir esta tarefa?" });
      a.createDiv({ cls: "wd-tf-spacer" });
      const yes = a.createEl("button", { text: "Excluir", cls: "mod-warning" });
      yes.onclick = async () => {
        yes.disabled = true;
        if (await this.opts.remove!()) this.close();
        else { this.confirmDel = false; this.renderActions(); }
      };
      const no = a.createEl("button", { text: "Cancelar" });
      no.onclick = () => { this.confirmDel = false; this.renderActions(); };
      return;
    }

    if (this.opts.mode === "edit") {
      const del = a.createEl("button", { text: "Excluir", cls: "mod-warning" });
      del.onclick = () => { this.confirmDel = true; this.renderActions(); };
      const open = a.createEl("button", { text: "Abrir no Todoist" });
      open.onclick = () => { if (this.opts.task) window.open(taskUrl(this.opts.task), "_blank"); };
      if (this.opts.complete) {
        const done = a.createEl("button", { text: "✓ Concluir" });
        done.onclick = () => { this.opts.complete!(); this.close(); };
      }
    }

    a.createDiv({ cls: "wd-tf-spacer" });
    const cancel = a.createEl("button", { text: "Cancelar" });
    cancel.onclick = () => this.close();
    const save = a.createEl("button", { text: "Salvar", cls: "mod-cta" });
    save.onclick = async () => {
      this.v.content = this.v.content.trim();
      if (!this.v.content) { new Notice("Dê um título à tarefa."); return; }
      save.disabled = true;
      if (await this.opts.submit(this.v)) this.close();
      else save.disabled = false;
    };
  }

  onClose() { this.contentEl.empty(); }
}

// ── Aba de configurações ────────────────────────────────────────────────────

class WerusSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: WerusDashboard) { super(app, plugin); }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h3", { text: "Integração Todoist" });

    new Setting(containerEl)
      .setName("Token da API")
      .setDesc("Todoist → Configurações → Integrações → Token de API do desenvolvedor. Salvo localmente em data.json (não vai para o Git).")
      .addText(t => {
        t.setPlaceholder("cole o token aqui")
          .setValue(this.plugin.settings.todoistToken)
          .onChange(async v => {
            this.plugin.settings.todoistToken = v.trim();
            await this.plugin.saveSettings();
            this.plugin.refreshDashboards();
          });
        t.inputEl.type = "password";
        t.inputEl.style.width = "100%";
      });

    containerEl.createEl("h3", { text: "Exibição das tarefas" });

    new Setting(containerEl)
      .setName("Mostrar o projeto nas linhas")
      .setDesc("Exibe o nome do projeto ao lado de cada tarefa.")
      .addToggle(t => t
        .setValue(this.plugin.settings.todoistShowProject)
        .onChange(async v => {
          this.plugin.settings.todoistShowProject = v;
          await this.plugin.saveSettings();
          this.plugin.refreshDashboards();
        }));

    new Setting(containerEl)
      .setName("Mostrar as etiquetas nas linhas")
      .setDesc("Exibe as @etiquetas de cada tarefa.")
      .addToggle(t => t
        .setValue(this.plugin.settings.todoistShowLabels)
        .onChange(async v => {
          this.plugin.settings.todoistShowLabels = v;
          await this.plugin.saveSettings();
          this.plugin.refreshDashboards();
        }));

    containerEl.createEl("h3", { text: "Sincronização (Syncthing)" });

    new Setting(containerEl)
      .setName("URL da API")
      .setDesc("Endereço do Syncthing. Padrão: http://127.0.0.1:8384 (a instância local). No celular, aponte para a API de outra máquina na rede se a local não responder.")
      .addText(t => {
        t.setPlaceholder("http://127.0.0.1:8384")
          .setValue(this.plugin.settings.syncthingUrl)
          .onChange(async v => {
            this.plugin.settings.syncthingUrl = v.trim() || "http://127.0.0.1:8384";
            await this.plugin.saveSettings();
            this.plugin.refreshSync();
          });
        t.inputEl.style.width = "100%";
      });

    new Setting(containerEl)
      .setName("API key")
      .setDesc("Syncthing → Actions → Settings → API Key. Salva localmente em data.json (não vai para o Git).")
      .addText(t => {
        t.setPlaceholder("cole a API key")
          .setValue(this.plugin.settings.syncthingApiKey)
          .onChange(async v => {
            this.plugin.settings.syncthingApiKey = v.trim();
            await this.plugin.saveSettings();
            this.plugin.refreshSync();
          });
        t.inputEl.type = "password";
        t.inputEl.style.width = "100%";
      });

    new Setting(containerEl)
      .setName("ID da pasta (opcional)")
      .setDesc("Folder ID do cofre no Syncthing. Vazio = usa a primeira pasta automaticamente.")
      .addText(t => {
        t.setPlaceholder("ex.: nunqv-mtimn")
          .setValue(this.plugin.settings.syncthingFolderId)
          .onChange(async v => {
            this.plugin.settings.syncthingFolderId = v.trim();
            await this.plugin.saveSettings();
            this.plugin.refreshSync();
          });
        t.inputEl.style.width = "100%";
      });

    new Setting(containerEl)
      .setName("Mostrar contagem de itens por aparelho")
      .setDesc("Exibe \"sincronizados / total\" de itens em cada aparelho, além da porcentagem.")
      .addToggle(t => t
        .setValue(this.plugin.settings.syncthingShowCounts)
        .onChange(async v => {
          this.plugin.settings.syncthingShowCounts = v;
          await this.plugin.saveSettings();
          this.plugin.refreshSync();
        }));
  }
}
