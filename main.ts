import { App, Component, ItemView, MarkdownRenderer, Modal, Notice, Platform, Plugin, PluginSettingTab, Setting, TFile, TFolder, WorkspaceLeaf, requestUrl, setIcon } from "obsidian";

const VIEW_TYPE = "werus-dashboard";
const TODOIST_VIEW_TYPE = "werus-todoist";

// Chaves do localStorage (POR-DISPOSITIVO, não sincronizam): credenciais do
// Syncthing. Ficam fora do data.json porque a API key/URL são de cada máquina
// (o data.json viaja pelo Syncthing → a key de uma daria 403 na outra).
const LS_ST_URL = "werus-dashboard:syncthingUrl";
const LS_ST_KEY = "werus-dashboard:syncthingApiKey";
const LS_ST_FOLDER = "werus-dashboard:syncthingFolderId";
const LS_TODO_CACHE = "werus-dashboard:todoistCache";   // cache offline do Todoist (por-dispositivo)
const TODO_TTL = 5 * 60 * 1000;                          // idade máx. do cache antes de re-buscar (5 min)
const TODO_MAX_PAGES = 50;                               // teto de páginas paginadas (anti-loop se a API repetir o cursor)

// uid curto e estável (pacotes de tarefas).
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

type Status = "progress" | "paused" | "cancelled";
type SectionId = "calendar" | "para" | "heatmap" | "growth" | "stats" | "todoist" | "sync";

interface TodoistFilters {
  projects: string[];   // ids de projeto selecionados (vazio = todos)
  labels: string[];     // nomes de etiqueta selecionados (vazio = todas)
}

// Fonte de cards da Semana: uma pasta do cofre + cor + se está visível.
// As notas dentro dela aparecem nos dias do calendário (posição pelo `date:`).
interface CalSource {
  path: string;    // caminho da pasta (ex.: "40.Archive/Relatórios Claude")
  color: string;   // cor do indicador da fonte
  on: boolean;     // marcada = aparece na semana
}

// Pacote de tarefas: um conjunto nomeado de tarefas que se lança no Todoist
// num clique (na aba Todoist), todas com data de hoje.
interface TaskPackage {
  id: string;            // uid estável
  name: string;          // "Manhã"
  icon?: string;         // lucide/emoji opcional
  tasks: string[];       // conteúdos das tarefas (1 por linha)
  projectId?: string;    // projeto padrão (vazio = Entrada/Inbox)
  labels?: string[];     // etiquetas padrão (opcional)
}

interface DashSettings {
  sectionOrder: SectionId[];
  compact: boolean;
  hidden: string[];   // caminhos de pasta ocultos + "sec:calendar" / "sec:heatmap"
  noteView: "list" | "grid";
  calendarSources: CalSource[];   // fontes (pastas) que alimentam os cards da Semana
  todoistToken: string;
  todoistDayRange: 3 | 7;        // quantos "próximos dias" mostrar na grade
  todoistFilters: TodoistFilters;
  todoistShowProject: boolean;   // mostrar o nome do projeto nas linhas
  todoistShowLabels: boolean;    // mostrar as etiquetas nas linhas
  syncthingUrl: string;          // base da API REST do Syncthing
  syncthingApiKey: string;       // X-API-Key (fora do Git)
  syncthingFolderId: string;     // id da pasta; vazio = autodetecta
  syncthingShowCounts: boolean;  // mostrar "sincronizados / total" de itens por aparelho
  taskPackages: TaskPackage[];   // pacotes de tarefas (lançar no Todoist)
  packageConfirm: "always" | "many" | "never";   // quando pedir confirmação ao lançar
}

const DEFAULT_SETTINGS: DashSettings = {
  sectionOrder: ["stats", "todoist", "para", "sync", "heatmap", "growth", "calendar"],
  compact: false,
  hidden: [],
  noteView: "list",
  calendarSources: [
    { path: "40.Archive/Relatórios Claude", color: "#3B82F6", on: true },
    { path: "50.Diário",                    color: "#10B981", on: true },
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
  packageConfirm: "many",
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
const SEC_PARA = "sec:para";
const SEC_HEAT = "sec:heatmap";
const SEC_GROW = "sec:growth";
const SEC_STAT = "sec:stats";
const SEC_TODO = "sec:todoist";
const SEC_SYNC = "sec:sync";

// Rótulos amigáveis das seções (usados na aba de Configurações).
const SECTION_LABEL: Record<SectionId, string> = {
  stats:    "Estatísticas",
  todoist:  "Tarefas",
  para:     "Cofre (pastas)",
  sync:     "Sincronização",
  heatmap:  "Atividade do cofre",
  growth:   "Crescimento do cofre",
  calendar: "Relatórios",
};

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
// No modo "many", lançar mais que isto pede confirmação.
const LAUNCH_CONFIRM_MIN = 5;

// Ícones sugeridos para os pacotes (nomes Lucide; renderizados por renderIcon).
const PKG_ICONS = [
  "sunrise", "sun", "sunset", "moon", "coffee", "utensils", "dumbbell", "book-open",
  "briefcase", "graduation-cap", "home", "shopping-cart", "heart", "droplet", "pill",
  "bed", "clock", "calendar", "check-check", "list-checks", "target", "flame", "zap",
  "star", "sparkles", "rocket", "brush", "music", "gamepad-2", "dog",
];

// Separa as etiquetas inline (@etiqueta) do texto de uma linha de tarefa.
// Devolve o título limpo (estilo Quick Add do Todoist) + etiquetas combinadas
// (as do pacote primeiro, depois as inline, sem duplicar).
function splitTaskLabels(line: string, pkgLabels: string[] = []): { title: string; labels: string[] } {
  const inline: string[] = [];
  // Só `@etiqueta` no início ou depois de espaço (lookbehind) — não pega o "@gmail"
  // de um e-mail como "pagar conta@gmail.com".
  const stripped = line.replace(/(?<=^|\s)@([\p{L}\p{N}_]+)/gu, (_m, name: string) => { inline.push(name); return ""; })
    .replace(/\s{2,}/g, " ").trim();
  const title = stripped || line.trim();
  const labels = [...new Set([...pkgLabels, ...inline])];
  return { title, labels };
}

// Popover flutuante genérico, ancorado num elemento. `fill(body, close)` monta o
// conteúdo. Fecha ao clicar fora ou Escape (opts.onClose roda antes de remover).
function openPopover(
  anchor: HTMLElement,
  fill: (body: HTMLElement, close: () => void) => void,
  opts: { cls?: string; width?: number; onClose?: () => void } = {},
): () => void {
  document.querySelectorAll(".wd-pop").forEach(e => e.remove());
  const pop = document.body.createDiv({ cls: "wd-pop" + (opts.cls ? " " + opts.cls : "") });
  if (opts.width) pop.style.width = `${opts.width}px`;

  const onDoc = (e: MouseEvent) => {
    const t = e.target as Node;
    if (!pop.contains(t) && t !== anchor && !anchor.contains(t)) close();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
  function close() {
    opts.onClose?.();
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

  // Registra depois do clique de abertura para não fechar imediatamente.
  setTimeout(() => {
    document.addEventListener("mousedown", onDoc, true);
    document.addEventListener("keydown", onKey, true);
  }, 0);
  return close;
}

// Popover de seleção de ícone (paleta). `current` = ícone selecionado (destaca).
function openIconPopover(anchor: HTMLElement, current: string | undefined, onPick: (icon: string | undefined) => void) {
  openPopover(anchor, (pop, close) => {
    const none = pop.createSpan({ cls: "wd-pkg-iconopt wd-pkg-iconnone" + (!current ? " wd-on" : ""), text: "—" });
    none.setAttr("title", "Sem ícone");
    none.onclick = () => { onPick(undefined); close(); };
    for (const ic of PKG_ICONS) {
      const opt = pop.createSpan({ cls: "wd-pkg-iconopt" + (current === ic ? " wd-on" : "") });
      renderIcon(opt, ic);
      opt.setAttr("title", ic);
      opt.onclick = () => { onPick(ic); close(); };
    }
  }, { cls: "wd-icon-pop" });
}

// Busca as tarefas ativas (não concluídas) via API unificada v1 (a REST v2 foi
// aposentada → respondia 410). A v1 é paginada: { results, next_cursor }.
async function fetchTodoistTasks(token: string): Promise<TodoistTask[]> {
  const all: TodoistTask[] = [];
  let cursor: string | null = null;
  let pages = 0;
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
  } while (cursor && ++pages < TODO_MAX_PAGES);
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
  let pages = 0;
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
  } while (cursor && ++pages < TODO_MAX_PAGES);
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
  let pages = 0;
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
  } while (cursor && ++pages < TODO_MAX_PAGES);
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
  due_date?: string;     // data fixa YYYY-MM-DD (vindo do calendário)
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

// Todos os caminhos de pasta do cofre (recursivo), ignorando ocultas (.obsidian etc.),
// em ordem alfabética — usado no seletor de fontes da Semana.
function allFolderPaths(app: App): string[] {
  const out: string[] = [];
  const walk = (f: TFolder) => {
    for (const c of f.children) {
      if (c instanceof TFolder && !c.name.startsWith(".")) { out.push(c.path); walk(c); }
    }
  };
  walk(app.vault.getRoot());
  return out.sort((a, b) => a.localeCompare(b));
}

// dd/mm a partir de um timestamp (mtime)
function fmtShort(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
}

// ── Utilidades de pasta ─────────────────────────────────────────────────────

// Texto de contagem padronizado para os cards (notas + imagens, quando houver).
// (md/img da subárvore vêm do cache do cofre — ver buildVaultCache.)
function countText(stats: { md: number; img: number }): string {
  if (stats.md === 0 && stats.img > 0) return `${stats.img} img`;
  return stats.img > 0 ? `${stats.md} notas · ${stats.img} img` : `${stats.md} notas`;
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

// Agregado de urgência de uma subárvore (vem do cache do cofre — ver buildVaultCache).
type UrgencyInfo = { items: { file: TFile; level: Urgency }[]; max: Urgency | null };

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

// ── Cache do cofre (§3) ───────────────────────────────────────────────────────
// UMA passada (DFS) monta os agregados por pasta (subárvore) + os globais que
// todas as seções consomem — antes cada seção varria o cofre por conta própria
// (~8–10× por render). Invalidado nos eventos do vault e recriado sob demanda.
interface FolderAgg {
  md: number;          // notas .md (exceto status.md) na subárvore
  img: number;         // imagens na subárvore
  reviewed: number;    // .md com reviewed:true na subárvore
  urgency: { file: TFile; level: Urgency }[];   // notas com urgency (ordenadas por nível desc)
  urgencyMax: Urgency | null;
  recent: TFile[];     // até 4 notas .md mais recentes (mtime) da subárvore
}
interface VaultCache {
  byFolder: Map<string, FolderAgg>;              // path da pasta → agregados
  datedNotes: { file: TFile; date: string }[];   // notas com data (frontmatter date: ou nome AAAA-MM-DD)
  ctimeByDay: Map<string, number>;               // AAAA-MM-DD → nº de notas criadas (ctime)
  totalNotes: number;
  totalReviewed: number;
}
const EMPTY_AGG: FolderAgg = { md: 0, img: 0, reviewed: 0, urgency: [], urgencyMax: null, recent: [] };

function buildVaultCache(app: App): VaultCache {
  const byFolder = new Map<string, FolderAgg>();
  const datedNotes: { file: TFile; date: string }[] = [];
  const ctimeByDay = new Map<string, number>();
  let totalNotes = 0, totalReviewed = 0;

  const walk = (folder: TFolder): FolderAgg => {
    const agg: FolderAgg = { md: 0, img: 0, reviewed: 0, urgency: [], urgencyMax: null, recent: [] };
    const recent: TFile[] = [];   // candidatos: arquivos próprios + top-4 de cada filho
    for (const c of folder.children) {
      if (c instanceof TFolder) {
        const sub = walk(c);
        agg.md += sub.md; agg.img += sub.img; agg.reviewed += sub.reviewed;
        if (sub.urgency.length) agg.urgency.push(...sub.urgency);
        if (sub.recent.length) recent.push(...sub.recent);
      } else if (c instanceof TFile) {
        if (c.extension === "md" && c.name !== "status.md") {
          agg.md++;
          recent.push(c);
          totalNotes++;
          const fm = app.metadataCache.getCache(c.path)?.frontmatter;
          if (fm?.reviewed === true) { agg.reviewed++; totalReviewed++; }
          const u = fm?.urgency;
          if (u === "alta" || u === "media" || u === "baixa") agg.urgency.push({ file: c, level: u });
          const ck = toKey(new Date(c.stat.ctime));
          ctimeByDay.set(ck, (ctimeByDay.get(ck) ?? 0) + 1);
          const m = c.basename.match(/^(\d{4}-\d{2}-\d{2})/);
          const d = normalizeDate(fm?.date) ?? (m ? m[1] : null);
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

// ── View ──────────────────────────────────────────────────────────────────────

// ── Controlador do Todoist (compartilhado: dashboard + aba dedicada) ──────────
// Detém o estado das tarefas, a busca, a renderização da lista e as ações
// (criar/editar/concluir/excluir). `rerender` é o callback da view dona (re-render
// completo). Tem tooltip próprio para não depender da view.
class TodoistController {
  private tasks: TodoistTask[] = [];
  private projects: TodoistProject[] = [];
  private projectMap = new Map<string, string>();   // id → nome
  private labelColors = new Map<string, string>();   // nome da etiqueta → hex
  private loading = false;
  private error: string | null = null;
  private fetchedAt = 0;
  private laterOpen = false;
  private noDateOpen = false;
  private filterOpen = false;
  private tip: HTMLElement | null = null;
  private launching = new Set<string>();   // ids de pacotes sendo lançados (anti clique-duplo)
  private subs = new Set<() => void>();     // views inscritas (re-render da seção Todoist)

  constructor(
    private app: App,
    private plugin: WerusDashboard,
    private component: Component,
  ) {
    this.loadCache();   // mostra o último resultado na hora (offline), antes do 1º fetch
  }

  // Inscreve uma view; devolve a função de cancelar. O callback re-renderiza só a
  // seção Todoist daquela view (não a view inteira). Estado é único e compartilhado.
  subscribe(cb: () => void): () => void {
    this.subs.add(cb);
    return () => { this.subs.delete(cb); };
  }
  private rerenderAll() { for (const cb of this.subs) cb(); }

  reset() {
    this.tasks = [];
    this.projects = [];
    this.projectMap = new Map();
    this.labelColors = new Map();
    this.fetchedAt = 0;
    this.error = null;
    this.loading = false;
    this.rerenderAll();
  }

  hideTip() { if (this.tip) { this.tip.remove(); this.tip = null; } }

  private dayRange(): 3 | 7 {
    return this.plugin.settings.todoistDayRange === 3 ? 3 : 7;
  }

  private applyFilters(tasks: TodoistTask[]): TodoistTask[] {
    const f = this.plugin.settings.todoistFilters;
    if (!f.projects.length && !f.labels.length) return tasks;
    const ps = new Set(f.projects), ls = new Set(f.labels);
    return tasks.filter(t => {
      if (ps.size && !(t.project_id && ps.has(t.project_id))) return false;
      if (ls.size && !(t.labels ?? []).some(l => ls.has(l))) return false;
      return true;
    });
  }

  private toggleFilter(kind: "projects" | "labels", id: string) {
    const arr = this.plugin.settings.todoistFilters[kind];
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1); else arr.push(id);
  }

  private labelColor(name: string): string {
    return this.labelColors.get(name) ?? LABEL_FALLBACK;
  }

  private labelChip(host: HTMLElement, name: string, cls: string): HTMLElement {
    const chip = host.createSpan({ cls });
    chip.createSpan({ cls: "wd-label-dot" }).style.background = this.labelColor(name);
    chip.createSpan({ text: `@${name}` });
    return chip;
  }

  private positionTip(tip: HTMLElement, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    if (top + th > window.innerHeight - 8) top = rect.top - th - 6;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top  = `${Math.max(8, top)}px`;
  }

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

  private todoCheck(host: HTMLElement, t: TodoistTask) {
    const check = host.createSpan({ cls: "wd-todo-check" });
    check.setAttr("title", "Concluir tarefa");
    check.onclick = e => { e.stopPropagation(); void this.completeTask(t); };
  }

  private todoRow(list: HTMLElement, t: TodoistTask, showDate = true) {
    const pri = priMeta(t.priority);
    const row = list.createDiv({ cls: "wd-todo-row" });
    row.style.setProperty("--pri", pri.color);
    this.todoCheck(row, t);
    const tag = row.createSpan({ cls: "wd-todo-pri", text: pri.label });
    tag.style.background = pri.color;
    row.createSpan({ cls: "wd-todo-row-txt", text: t.content });
    if (hasDesc(t)) setIcon(row.createSpan({ cls: "wd-todo-hasdesc" }), "align-left");
    const proj = t.project_id ? this.projectMap.get(t.project_id) : undefined;
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

  private addTaskBtn(host: HTMLElement, prefillDue?: string, title = "Nova tarefa") {
    const b = host.createSpan({ cls: "wd-todo-add" });
    setIcon(b, "plus");
    b.setAttr("title", title);
    b.onclick = e => { e.stopPropagation(); this.openTaskForm({ mode: "create", prefillDue }); };
    return b;
  }

  private openTaskForm(opts: { mode: "create" | "edit"; task?: TodoistTask; prefillDue?: string }) {
    this.hideTip();
    const labels = [...new Set([...this.labelColors.keys(), ...this.tasks.flatMap(t => t.labels ?? [])])].sort((a, b) => a.localeCompare(b));
    new TaskFormModal(this.app, {
      mode: opts.mode,
      task: opts.task,
      prefillDue: opts.prefillDue,
      projects: this.projects,
      labels,
      labelColor: n => this.labelColor(n),
      submit: v => this.submitTaskForm(opts.mode, opts.task, v),
      remove: opts.task ? () => this.deleteTask(opts.task!) : undefined,
      complete: opts.task ? () => void this.completeTask(opts.task!) : undefined,
    }).open();
  }

  private openTaskDetail(t: TodoistTask) {
    this.hideTip();
    new TaskDetailModal(this.app, this.component, {
      task: t,
      projectName: t.project_id ? this.projectMap.get(t.project_id) : undefined,
      labelColor: n => this.labelColor(n),
      edit: () => this.openTaskForm({ mode: "edit", task: t }),
      complete: () => void this.completeTask(t),
    }).open();
  }

  private async submitTaskForm(mode: "create" | "edit", task: TodoistTask | undefined, v: TaskFormValues): Promise<boolean> {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    try {
      if (mode === "create") {
        const fields: TodoistWrite = { content: v.content, priority: v.priority };
        if (v.description.trim()) fields.description = v.description.trim();
        if (v.dueDate) fields.due_date = v.dueDate;
        if (v.projectId) fields.project_id = v.projectId;
        if (v.labels.length) fields.labels = v.labels;
        await createTodoistTask(token, fields);
        new Notice(`✓ Criada: ${v.content}`);
      } else if (task) {
        const fields: TodoistWrite = {};
        if (v.content !== task.content) fields.content = v.content;
        if (v.description !== (task.description ?? "")) fields.description = v.description;
        if (v.priority !== task.priority) fields.priority = v.priority;
        const oldDate = task.due?.date ? task.due.date.substring(0, 10) : "";
        if (v.dueDate !== oldDate) {
          if (v.dueDate) fields.due_date = v.dueDate;
          else fields.due_string = "no date";
        }
        const oldL = (task.labels ?? []).slice().sort().join(" ");
        const newL = v.labels.slice().sort().join(" ");
        if (oldL !== newL) fields.labels = v.labels;
        if (Object.keys(fields).length) await updateTodoistTask(token, task.id, fields);
        const oldProj = task.project_id ?? "";
        if (v.projectId !== oldProj && v.projectId) await moveTodoistTask(token, task.id, v.projectId);
        new Notice(`✓ Salva: ${v.content}`);
      }
      await this.fetch(true);
      return true;
    } catch (e) {
      new Notice(`Falha ao salvar: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  }

  private async deleteTask(t: TodoistTask): Promise<boolean> {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return false;
    const idx = this.tasks.findIndex(x => x.id === t.id);
    if (idx >= 0) this.tasks.splice(idx, 1);
    this.rerenderAll();
    try {
      await deleteTodoistTask(token, t.id);
      this.persistCache();
      new Notice(`🗑 Excluída: ${t.content}`);
      return true;
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new Notice(`Falha ao excluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerenderAll();
      return false;
    }
  }

  private async completeTask(t: TodoistTask) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    const idx = this.tasks.findIndex(x => x.id === t.id);
    if (idx >= 0) this.tasks.splice(idx, 1);
    this.rerenderAll();
    try {
      await closeTodoistTask(token, t.id);
      this.persistCache();
      new Notice(`✓ Concluída: ${t.content}`);
    } catch (e) {
      if (idx >= 0) this.tasks.splice(idx, 0, t);
      new Notice(`Falha ao concluir: ${e instanceof Error ? e.message : String(e)}`);
      this.rerenderAll();
    }
  }

  private isStale(): boolean { return Date.now() - this.fetchedAt >= TODO_TTL; }

  // Auto-refresh periódico (intervalo no onload): só busca se há view aberta, token
  // configurado, nada em voo e o cache passou do TTL. Sem view aberta = sem chamada à API.
  maybeRefresh() {
    if (!this.subs.size || this.loading) return;
    if (!this.plugin.settings.todoistToken.trim()) return;
    if (this.isStale()) void this.fetch(false);
  }

  // Cache offline (por-dispositivo, localStorage → não sincroniza): carrega o último
  // resultado para a aba abrir já com as tarefas, mesmo sem internet.
  private loadCache() {
    try {
      const raw = this.app.loadLocalStorage(LS_TODO_CACHE);
      const c = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!c || !Array.isArray(c.tasks)) return;
      this.tasks = c.tasks;
      this.projects = Array.isArray(c.projects) ? c.projects : [];
      this.projectMap = new Map(this.projects.map((p: TodoistProject) => [p.id, p.name]));
      this.labelColors = new Map(Array.isArray(c.labels) ? c.labels : []);
      this.fetchedAt = typeof c.fetchedAt === "number" ? c.fetchedAt : 0;
    } catch { /* cache ausente/corrompido → ignora */ }
  }

  private persistCache() {
    try {
      this.app.saveLocalStorage(LS_TODO_CACHE, JSON.stringify({
        tasks: this.tasks, projects: this.projects, labels: [...this.labelColors], fetchedAt: this.fetchedAt,
      }));
    } catch { /* serialização/quota → ignora */ }
  }

  // Aviso de frescor no topo da lista: durante uma busca, ou quando estamos
  // exibindo o cache porque a última busca falhou (offline).
  private renderFreshness(host: HTMLElement) {
    if (this.loading) { host.createDiv({ cls: "wd-todo-fresh", text: "Atualizando…" }); return; }
    if (this.error) {
      const when = this.fetchedAt ? relTime(new Date(this.fetchedAt).toISOString()) : "—";
      host.createDiv({ cls: "wd-todo-fresh wd-todo-fresh-stale", text: `Sem conexão — exibindo o último carregado (${when})` });
    }
  }

  async fetch(manual: boolean) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token || this.loading) return;
    this.loading = true;
    this.error = null;
    if (manual) this.rerenderAll();
    try {
      const [tasks, projects, labels] = await Promise.all([
        fetchTodoistTasks(token),
        fetchTodoistProjects(token).catch(() => [] as TodoistProject[]),
        fetchTodoistLabels(token).catch(() => [] as TodoistLabel[]),
      ]);
      this.tasks = tasks;
      this.projects = projects;
      this.projectMap = new Map(projects.map(p => [p.id, p.name]));
      this.labelColors = new Map(labels.map(l => [l.name, TODOIST_COLORS[l.color] ?? LABEL_FALLBACK]));
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
  async launchPackage(pkg: TaskPackage) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) { new Notice("Configure o token do Todoist nas Configurações."); return; }
    // Resolve título limpo + etiquetas (pacote + inline @etiqueta) por tarefa.
    const items = pkg.tasks.map(s => s.trim()).filter(Boolean).map(line => splitTaskLabels(line, pkg.labels ?? []));
    if (!items.length) { new Notice("Pacote sem tarefas."); return; }
    if (this.launching.has(pkg.id)) return;   // já está lançando → ignora clique-duplo

    // Confirmação conforme a configuração (sempre / só muitas / nunca).
    const mode = this.plugin.settings.packageConfirm;
    const needConfirm = mode === "always" || (mode === "many" && items.length > LAUNCH_CONFIRM_MIN);
    if (needConfirm) {
      const ok = await confirmModal(this.app, {
        title: `Lançar “${pkg.name || "pacote"}”?`,
        body: `Isso vai criar ${items.length} tarefa(s) no Todoist com data de hoje:`,
        items: items.map(it => ({
          text: it.title,
          labels: it.labels.map(n => ({ name: n, color: this.labelColor(n) })),
        })),
        cta: `Lançar ${items.length}`,
      });
      if (!ok) return;
    }

    this.launching.add(pkg.id);
    this.rerenderAll();   // mostra o botão como "lançando…"
    const due = toKey(new Date());
    let ok = 0;
    try {
      for (const { title, labels } of items) {
        try {
          const fields: TodoistWrite = { content: title, due_date: due };
          if (pkg.projectId) fields.project_id = pkg.projectId;
          if (labels.length) fields.labels = labels;
          await createTodoistTask(token, fields);
          ok++;
        } catch (e) {
          new Notice(`Falha em "${title}": ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    } finally {
      this.launching.delete(pkg.id);
    }
    new Notice(`✓ ${ok}/${items.length} tarefa(s) lançada(s) — ${pkg.name || "pacote"}`);
    await this.fetch(true);   // re-renderiza (limpa o estado "lançando…")
  }

  // Barra de lançadores de pacotes. Com `heading`, monta a seção "PACOTES"
  // completa (aba do Todoist); sem ele, só a barra de botões (dashboard, e
  // some quando não há pacotes para manter o painel enxuto).
  renderPackages(host: HTMLElement, opts: { heading?: boolean } = {}) {
    const pkgs = this.plugin.settings.taskPackages;
    let target = host;
    if (opts.heading) {
      const sec = host.createDiv({ cls: "wd-section" });
      const head = sec.createDiv({ cls: "wd-sec-head" });
      head.createDiv({ cls: "wd-sec-label", text: "PACOTES" });
      if (!pkgs.length) {
        sec.createDiv({ cls: "wd-empty", text: "Crie pacotes em Configurações → Werus Dashboard → Pacotes de tarefas." });
        return;
      }
      target = sec;
    } else if (!pkgs.length) {
      return;
    }

    const token = this.plugin.settings.todoistToken.trim();
    const bar = target.createDiv({ cls: "wd-pkg-bar" });
    for (const pkg of pkgs) {
      const valid = pkg.tasks.filter(s => s.trim()).length;
      const busy = this.launching.has(pkg.id);
      const disabled = !token || !valid || busy;
      const btn = bar.createDiv({ cls: "wd-pkg-btn" + (disabled ? " wd-pkg-disabled" : "") + (busy ? " wd-pkg-busy" : "") });
      if (pkg.icon) renderIcon(btn.createSpan({ cls: "wd-pkg-ico" }), pkg.icon);
      btn.createSpan({ cls: "wd-pkg-name", text: pkg.name || "(sem nome)" });
      btn.createSpan({ cls: "wd-pkg-count", text: busy ? "…" : String(valid) });
      btn.setAttr("title",
        busy ? "Lançando…" :
        !token ? "Configure o token do Todoist" :
        !valid ? "Pacote sem tarefas" :
        `Lançar ${valid} tarefa(s) no Todoist (hoje)`);
      if (!disabled) btn.onclick = () => void this.launchPackage(pkg);
    }
  }

  private renderFilterBar(host: HTMLElement) {
    const f = this.plugin.settings.todoistFilters;
    const bar = host.createDiv({ cls: "wd-todo-filterbar" });
    if (this.projects.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Projetos" });
      for (const p of this.projects) {
        const on = f.projects.includes(p.id);
        const chip = grp.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : ""), text: p.name });
        chip.onclick = async () => { this.toggleFilter("projects", p.id); await this.plugin.saveSettings(); this.rerenderAll(); };
      }
    }
    const labels = [...new Set(this.tasks.flatMap(t => t.labels ?? []))].sort((a, b) => a.localeCompare(b));
    if (labels.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Etiquetas" });
      for (const l of labels) {
        const on = f.labels.includes(l);
        const chip = this.labelChip(grp, l, "wd-todo-fchip" + (on ? " wd-on" : ""));
        chip.onclick = async () => { this.toggleFilter("labels", l); await this.plugin.saveSettings(); this.rerenderAll(); };
      }
    }
    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clr.onclick = async () => { f.projects = []; f.labels = []; await this.plugin.saveSettings(); this.rerenderAll(); };
    }
  }

  // Renderiza os controles de cabeçalho (em `ctrls`) + a lista de tarefas
  // (em `body`). O host fornece o rótulo da seção e o layout do cabeçalho.
  renderList(body: HTMLElement, ctrls: HTMLElement, opts: { showLater?: boolean } = {}) {
    const token = this.plugin.settings.todoistToken.trim();
    if (token) {
      const range = this.dayRange();
      const seg = ctrls.createDiv({ cls: "wd-todo-range" });
      for (const n of [3, 7] as const) {
        const b = seg.createSpan({ cls: "wd-todo-range-btn" + (range === n ? " wd-on" : ""), text: `${n}d` });
        b.setAttr("title", `Mostrar os próximos ${n} dias`);
        b.onclick = async e => {
          e.stopPropagation();
          this.plugin.settings.todoistDayRange = n;
          await this.plugin.saveSettings();
          this.rerenderAll();
        };
      }
      const f = this.plugin.settings.todoistFilters;
      const nF = f.projects.length + f.labels.length;
      const filt = ctrls.createSpan({ cls: "wd-todo-filterbtn" + (this.filterOpen ? " wd-on" : "") + (nF ? " wd-active" : "") });
      setIcon(filt, "filter");
      filt.setAttr("title", nF ? `Filtros ativos (${nF}) — clique para ajustar` : "Filtrar por projeto/etiqueta");
      if (nF) filt.createSpan({ cls: "wd-todo-filtct", text: String(nF) });
      filt.onclick = e => { e.stopPropagation(); this.filterOpen = !this.filterOpen; this.rerenderAll(); };
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.loading ? " wd-spin" : "") });
      setIcon(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      refresh.onclick = e => { e.stopPropagation(); void this.fetch(true); };
      this.addTaskBtn(ctrls, undefined, "Nova tarefa");
    }

    if (!token) {
      body.createDiv({ cls: "wd-empty", text: "Cole seu token do Todoist em Configurações → Werus Dashboard para ver suas tarefas aqui." });
      return;
    }

    // Auto-fetch: nunca buscou, ou o cache passou do TTL. Erro não dispara re-tentativa
    // automática aqui (evitaria loop a cada render); o intervalo e o botão ↻ cuidam disso.
    if (!this.loading && !this.error && (!this.fetchedAt || this.isStale())) void this.fetch(false);
    const hasCache = this.tasks.length > 0;
    // Erro/carregando só ocupam a área toda quando NÃO há cache para mostrar (offline-friendly).
    if (this.error && !hasCache) { body.createDiv({ cls: "wd-empty wd-todo-error", text: `Erro ao buscar tarefas: ${this.error}` }); return; }
    if (!this.fetchedAt && !hasCache) { body.createDiv({ cls: "wd-empty", text: "Carregando tarefas…" }); return; }
    this.renderFreshness(body);

    if (this.filterOpen) this.renderFilterBar(body);

    const range = this.dayRange();
    const todayK = toKey(new Date());
    const lastUpcoming = new Date();
    lastUpcoming.setDate(lastUpcoming.getDate() + range);
    const lastK = toKey(lastUpcoming);

    const tasks = this.applyFilters(this.tasks);
    const overdue: TodoistTask[] = [];
    const todayTasks: TodoistTask[] = [];
    const byDay: Record<string, TodoistTask[]> = {};
    const later: TodoistTask[] = [];
    const noDate: TodoistTask[] = [];
    for (const t of tasks) {
      const dk = dueKey(t);
      if (!dk) { noDate.push(t); continue; }
      if (dk < todayK) overdue.push(t);
      else if (dk === todayK) todayTasks.push(t);
      else if (dk <= lastK) (byDay[dk] ??= []).push(t);
      else later.push(t);
    }
    const byPri = (a: TodoistTask, b: TodoistTask) => b.priority - a.priority;
    // "Depois": ordena por DATA (mais próxima primeiro) e, no mesmo dia, por prioridade.
    const byDateThenPri = (a: TodoistTask, b: TodoistTask) => {
      const da = dueKey(a) ?? "", db = dueKey(b) ?? "";
      if (da !== db) return da < db ? -1 : 1;
      return b.priority - a.priority;
    };
    overdue.sort(byPri); todayTasks.sort(byPri); later.sort(byDateThenPri); noDate.sort(byPri);
    for (const k of Object.keys(byDay)) byDay[k].sort(byPri);

    // "Depois" e "Sem data" só aparecem na aba dedicada (showLater !== false).
    const showExtra = opts.showLater !== false;
    const visible = overdue.length + todayTasks.length + later.length
      + Object.values(byDay).reduce((s, a) => s + a.length, 0)
      + (showExtra ? noDate.length : 0);
    if (visible === 0) {
      const f = this.plugin.settings.todoistFilters;
      const filtered = !!(f.projects.length || f.labels.length);
      const msg = filtered ? "Nenhuma tarefa bate com os filtros."
        : showExtra ? "Nenhuma tarefa no Todoist. 🎉"
        : "Nenhuma tarefa agendada. 🎉";
      body.createDiv({ cls: "wd-empty", text: msg });
      return;
    }

    const cols = body.createDiv({ cls: "wd-todo-cols" });

    const obox = cols.createDiv({ cls: "wd-todo-box wd-box-overdue" });
    const ohd = obox.createDiv({ cls: "wd-todo-boxhd" });
    ohd.createSpan({ cls: "wd-todo-boxwarn", text: "⚠" });
    ohd.createSpan({ cls: "wd-todo-boxlabel", text: "Atrasadas" });
    ohd.createSpan({ cls: "wd-todo-boxcount", text: String(overdue.length) });
    const obody = obox.createDiv({ cls: "wd-todo-boxbody" });
    if (overdue.length) for (const t of overdue) this.todoRow(obody, t);
    else obody.createDiv({ cls: "wd-todo-boxempty", text: "Nenhuma. 👍" });

    const tbox = cols.createDiv({ cls: "wd-todo-box wd-box-today" });
    const thd = tbox.createDiv({ cls: "wd-todo-boxhd" });
    thd.createSpan({ cls: "wd-todo-boxlabel", text: "Hoje" });
    this.addTaskBtn(thd, "hoje", "Nova tarefa para hoje");
    thd.createSpan({ cls: "wd-todo-boxcount", text: String(todayTasks.length) });
    const tbody = tbox.createDiv({ cls: "wd-todo-boxbody" });
    if (todayTasks.length) for (const t of todayTasks) this.todoRow(tbody, t);
    else tbody.createDiv({ cls: "wd-todo-boxempty", text: "Nada para hoje." });

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

    if (later.length && showExtra) {
      const panel = body.createDiv({ cls: "wd-todo-later" });
      const lhd = panel.createDiv({ cls: "wd-todo-ohd" });
      lhd.createSpan({ cls: "wd-todo-laterico", text: "›" });
      lhd.createSpan({ cls: "wd-todo-otitle", text: `Depois (${later.length})` });
      lhd.createSpan({ cls: "wd-todo-otoggle", text: this.laterOpen ? "ocultar ▾" : "mostrar ›" });
      lhd.onclick = () => { this.laterOpen = !this.laterOpen; this.rerenderAll(); };
      if (this.laterOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of later) this.todoRow(list, t);
      }
    }

    if (noDate.length && showExtra) {
      const panel = body.createDiv({ cls: "wd-todo-later wd-todo-nodate" });
      const nhd = panel.createDiv({ cls: "wd-todo-ohd" });
      nhd.createSpan({ cls: "wd-todo-laterico", text: "›" });
      nhd.createSpan({ cls: "wd-todo-otitle", text: `Sem data (${noDate.length})` });
      nhd.createSpan({ cls: "wd-todo-otoggle", text: this.noDateOpen ? "ocultar ▾" : "mostrar ›" });
      nhd.onclick = () => { this.noDateOpen = !this.noDateOpen; this.rerenderAll(); };
      if (this.noDateOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of noDate) this.todoRow(list, t);
      }
    }
  }
}

class DashboardView extends ItemView {
  private weekOffset = 0;
  private navPath: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private tip: HTMLElement | null = null;
  private searchTerm = "";
  private reviewFilter = false;
  private growthCumulative = false;
  private secHosts = new Map<SectionId, HTMLElement>();   // wrapper estável por seção
  private unsubTodo: (() => void) | null = null;          // cancelar inscrição no controller

  // Estado do Syncthing (v0.10.0)
  private syncData: SyncData | null = null;
  private syncLoading = false;
  private syncError: string | null = null;
  private syncFetchedAt = 0;
  private conflictConfirm: string | null = null;   // path do conflito aguardando confirmação

  constructor(leaf: WorkspaceLeaf, private plugin: WerusDashboard) {
    super(leaf);
  }

  getViewType()    { return VIEW_TYPE; }
  getDisplayText() { return "Dashboard"; }
  getIcon()        { return "layout-dashboard"; }

  async onOpen() {
    await this.render();
    // Inscreve no controller único: mudança de estado re-renderiza só a seção Tarefas.
    this.unsubTodo = this.plugin.todo.subscribe(() => this.renderSection("todoist"));
    for (const ev of ["modify", "create", "delete", "rename"] as const)
      this.registerEvent(this.app.vault.on(ev as "modify", () => { this.plugin.invalidateVaultCache(); this.schedule(); }));
  }

  async onClose() {
    this.unsubTodo?.();
    this.unsubTodo = null;
    this.hideTip();
    this.plugin.todo.hideTip();
  }

  // Re-render público — chamado pelo plugin quando a configuração muda na aba
  // de Configurações (ordem das seções, ocultar/mostrar, fontes da Semana).
  refresh() { void this.render(); }

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
    this.plugin.todo.hideTip();
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root");
    root.toggleClass("wd-compact", this.plugin.settings.compact);

    this.renderHeader(root);
    // Cada seção mora num host estável → dá para re-renderizar uma seção só
    // (ex.: refresh do Todoist/Syncthing) sem reconstruir a view inteira.
    this.secHosts.clear();
    for (const id of this.plugin.settings.sectionOrder) {
      const host = root.createDiv({ cls: "wd-sec-host" });
      this.secHosts.set(id, host);
      this.renderSection(id);
    }
  }

  // Re-renderiza apenas a seção `id` dentro do seu host (sem tocar nas outras).
  private renderSection(id: SectionId) {
    const host = this.secHosts.get(id);
    if (!host) return;
    host.empty();
    if (id === "calendar")     this.renderCalendar(host);
    else if (id === "para")    this.renderPara(host);
    else if (id === "heatmap") this.renderHeatmap(host);
    else if (id === "growth")  this.renderGrowth(host);
    else if (id === "stats")   this.renderStats(host);
    else if (id === "todoist") this.renderTodoist(host);
    else if (id === "sync")    this.renderSync(host);
  }

  // ── Ocultar (leitura) ─────────────────────────────────────────────────────
  // Mostrar/ocultar e a ordem das seções são administrados na aba de
  // Configurações do plugin. A view só *lê* `settings.hidden` para pular o que
  // está oculto. Ver WerusSettingTab.

  private isHidden(key: string): boolean {
    return this.plugin.settings.hidden.includes(key);
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

  private attachTip(card: HTMLElement, recents: TFile[]) {
    if (!recents.length) return;
    card.addEventListener("mouseenter", () => this.showTip(card, recents));
    card.addEventListener("mouseleave", () => this.hideTip());
  }

  // Subpastas exibíveis (ignora pastas só-de-imagens), via cache do cofre.
  private subFoldersOf(folder: TFolder): TFolder[] {
    const cache = this.plugin.getVaultCache();
    return (folder.children.filter(c => c instanceof TFolder) as TFolder[])
      .filter(f => { const a = cache.byFolder.get(f.path); return !(a && a.img > 0 && a.md === 0); })
      .sort((a, b) => a.name.localeCompare(b.name, "pt"));
  }

  // ── Calendário ──────────────────────────────────────────────────────────

  private renderCalendar(root: HTMLElement) {
    if (this.isHidden(SEC_CAL)) return;

    const monday  = mondayOf(this.weekOffset);
    const weekNum = isoWeekNumber(monday);
    const todayK  = toKey(new Date());

    // Fontes ativas (pastas marcadas). A cor de cada nota vem da fonte de
    // prefixo mais específico que a contém.
    const sources = this.plugin.settings.calendarSources.filter(s => s.on);
    const colorFor = (path: string): string | null => {
      let best: CalSource | null = null;
      for (const s of sources) {
        if (path === `${s.path}.md` || path.startsWith(`${s.path}/`)) {
          if (!best || s.path.length > best.path.length) best = s;
        }
      }
      return best ? best.color : null;
    };

    // As notas com data já vêm do cache (uma passada); aqui só filtra por fonte.
    const byDay: Record<string, { name: string; file: TFile; color: string }[]> = {};
    for (const { file, date } of this.plugin.getVaultCache().datedNotes) {
      const color = colorFor(file.path);
      if (!color) continue;   // só notas dentro de uma fonte marcada
      (byDay[date] ??= []).push({ name: file.basename, file, color });
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
      nav.createSpan({ cls: "wd-cal-week-label", text: `Relatórios · semana ${weekNum}` });
    }

    const ctrls = nav.createDiv({ cls: "wd-cal-ctrls" });
    const prev = ctrls.createSpan({ cls: "wd-cal-arrow", text: "‹" });
    const next = ctrls.createSpan({ cls: "wd-cal-arrow", text: "›" });
    prev.onclick = () => { this.weekOffset--; this.render(); };
    next.onclick = () => { this.weekOffset++; this.render(); };

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
        pill.style.setProperty("--wd-src", it.color);
        pill.createSpan({ cls: "wd-cal-pill-dot" });
        pill.createSpan({ cls: "wd-cal-pill-txt", text: it.name.length > 14 ? it.name.slice(0, 14) + "…" : it.name });
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
    return this.plugin.getVaultCache().datedNotes.find(n => n.date === key)?.file ?? null;
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
    if (this.isHidden(SEC_PARA)) return;
    // Se a pasta aberta no navegador foi ocultada nas Configurações, fecha.
    if (this.navPath && this.isHidden(this.topFolderOf(this.navPath))) this.navPath = null;

    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "COFRE" });

    const grid = sec.createDiv({ cls: "wd-para-grid" });
    const vaultRoot = this.app.vault.getRoot();
    const folders = (vaultRoot.children.filter(c => c instanceof TFolder) as TFolder[])
      .filter(f => !f.name.startsWith("."))   // ignora .obsidian, .trash, etc.
      .sort((a, b) => a.name.localeCompare(b.name, "pt"));
    const activeRoot = this.navPath ? this.topFolderOf(this.navPath) : null;
    const cache = this.plugin.getVaultCache();

    let idx = 0;
    for (const folder of folders) {
      if (this.isHidden(folder.path)) continue;

      const agg     = cache.byFolder.get(folder.path) ?? EMPTY_AGG;
      const meta    = folderMeta(this.app, folder);
      const cover   = coverInFolder(this.app, folder);
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
      const top  = body.createDiv({ cls: "wd-card-top" });
      renderIcon(top.createSpan({ cls: "wd-icon" }), meta.icon);
      top.createSpan({ cls: "wd-count", text: countText({ md: agg.md, img: agg.img }) });
      body.createDiv({ cls: "wd-label",  text: meta.label });
      body.createDiv({ cls: "wd-folder", text: folder.path });
      if (navigable) body.createDiv({ cls: "wd-has-subs", text: isActive ? "fechar ▾" : "abrir ›" });

      if (agg.md > 0) {
        const bar = body.createDiv({ cls: "wd-progress" });
        bar.setAttr("title", `${agg.reviewed}/${agg.md} revisadas`);
        const fill = bar.createDiv({ cls: "wd-progress-fill" });
        fill.style.width = `${Math.round(agg.reviewed / agg.md * 100)}%`;
      }

      this.attachTip(card, agg.recent);

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
    const cache = this.plugin.getVaultCache();
    const subs = this.subFoldersOf(folder);
    if (subs.length) {
      const sgrid = panel.createDiv({ cls: "wd-proj-grid" });
      for (const sf of subs) {
        const agg    = cache.byFolder.get(sf.path) ?? EMPTY_AGG;
        const status = readFolderStatus(this.app, sf);
        const cover  = coverInFolder(this.app, sf);
        const deeper = this.subFoldersOf(sf).length > 0;
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
        this.urgencyBadge(card, { items: agg.urgency, max: agg.urgencyMax });

        const body = card.createDiv({ cls: "wd-card-body" });
        const top  = body.createDiv({ cls: "wd-card-top" });
        if (customIcon) renderIcon(top.createSpan({ cls: "wd-icon wd-sub-icon" }), customIcon);
        top.createSpan({ cls: "wd-count", text: countText({ md: agg.md, img: agg.img }) });
        if (deeper) top.createSpan({ cls: "wd-sub-arrow", text: "›" });

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

  // ── Heatmap (via plugin Heatmap Calendar) ─────────────────────────────────

  private renderHeatmap(root: HTMLElement) {
    if (this.isHidden(SEC_HEAT)) return;
    if (Platform.isPhone) return;   // heatmap (ano inteiro) ocultado no celular

    const sec = root.createDiv({ cls: "wd-section wd-heat-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "ATIVIDADE DO COFRE" });

    const render = getHeatmapRenderer();
    if (!render) {
      sec.createDiv({ cls: "wd-empty", text: 'Ative o plugin "Heatmap Calendar" para ver a atividade.' });
      return;
    }

    // Notas criadas por dia (do cache), filtradas pelo ano corrente.
    const year = new Date().getFullYear();
    const prefix = String(year);
    const entries: HeatmapEntry[] = [];
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

    const cache = this.plugin.getVaultCache();
    const totalNotes = cache.totalNotes;
    const totalReviewed = cache.totalReviewed;
    // "esta semana" = criações nos últimos 7 dias (do cache, por data → sempre fresco).
    let createdThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      createdThisWeek += cache.ctimeByDay.get(toKey(d)) ?? 0;
    }
    const globalPct = totalNotes > 0 ? Math.round(totalReviewed / totalNotes * 100) : 0;

    const sec = root.createDiv({ cls: "wd-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "ESTATÍSTICAS" });

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
      const agg = cache.byFolder.get(folder.path) ?? EMPTY_AGG;
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

    // Notas por data de criação (do cache).
    const counts = this.plugin.getVaultCache().ctimeByDay;

    // Últimos N dias (menos no celular)
    const DAYS = Platform.isPhone ? 15 : 30;
    const days: { key: string; count: number; label: string }[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toKey(d);
      const [, m, day] = key.split("-");
      days.push({ key, count: counts.get(key) ?? 0, label: `${day}/${m}` });
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

  // ── Todoist (delegado ao TodoistController compartilhado) ──────────────────

  private renderTodoist(root: HTMLElement) {
    if (this.isHidden(SEC_TODO)) return;
    const sec = root.createDiv({ cls: "wd-section wd-todo-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "TAREFAS" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    // Botão de navegação → abre a aba dedicada do Todoist (o dashboard é o hub).
    const open = ctrls.createSpan({ cls: "wd-todo-openbtn" });
    setIcon(open, "square-arrow-out-up-right");
    open.setAttr("title", "Abrir a aba do Todoist");
    open.onclick = e => { e.stopPropagation(); void this.plugin.openTodoist(); };
    // Lançador de pacotes compacto (some se não houver pacotes).
    this.plugin.todo.renderPackages(sec);
    // Dashboard = só o essencial (Atrasadas · Hoje · Próximos 7). "Depois" fica
    // só na aba do Todoist → recorrentes só aparecem aqui perto do dia.
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

  private async fetchSync(manual: boolean) {
    const base = this.plugin.settings.syncthingUrl.trim();
    const key = this.plugin.settings.syncthingApiKey.trim();
    if (!base || !key || this.syncLoading) return;
    this.syncLoading = true;
    this.syncError = null;
    if (manual) this.renderSection("sync");
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
      this.renderSection("sync");
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
        yes.onclick = async () => { await this.app.vault.trash(f, false); this.conflictConfirm = null; this.renderSection("sync"); };
        const no = row.createSpan({ cls: "wd-sync-cno", text: "cancelar" });
        no.onclick = () => { this.conflictConfirm = null; this.renderSection("sync"); };
      } else {
        const del = row.createSpan({ cls: "wd-sync-cdel" });
        setIcon(del, "trash-2");
        del.setAttr("title", "Apagar cópia de conflito (vai para a lixeira)");
        del.onclick = () => { this.conflictConfirm = f.path; this.renderSection("sync"); };
      }
    }
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  private renderHeader(root: HTMLElement) {
    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Second Brain" });
  }
}

// ── Plugin ────────────────────────────────────────────────────────────────────

export default class WerusDashboard extends Plugin {
  settings: DashSettings = DEFAULT_SETTINGS;
  // Controlador único do Todoist (estado compartilhado entre dashboard e aba).
  todo!: TodoistController;
  // Cache do cofre (§3): montado 1x por ciclo, invalidado nos eventos do vault.
  private vaultCache: VaultCache | null = null;

  // Agregados do cofre (uma passada), reusados por todas as seções no render.
  getVaultCache(): VaultCache {
    if (!this.vaultCache) this.vaultCache = buildVaultCache(this.app);
    return this.vaultCache;
  }
  invalidateVaultCache() { this.vaultCache = null; }

  async onload() {
    await this.loadSettings();
    this.todo = new TodoistController(this.app, this, this);
    // Auto-refresh do Todoist: verifica a cada minuto; só busca se há view aberta e o
    // cache passou do TTL (5 min). registerInterval limpa o timer no unload.
    this.registerInterval(window.setInterval(() => this.todo.maybeRefresh(), 60_000));
    this.registerView(VIEW_TYPE, leaf => new DashboardView(leaf, this));
    this.registerView(TODOIST_VIEW_TYPE, leaf => new TodoistView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "Abrir Werus Dashboard", () => this.open());
    this.addRibbonIcon("list-checks", "Abrir Todoist (Werus)", () => this.openTodoist());
    this.addCommand({ id: "open-dashboard", name: "Abrir Dashboard", callback: () => this.open() });
    this.addCommand({ id: "open-todoist", name: "Abrir Todoist", callback: () => this.openTodoist() });
    this.addSettingTab(new WerusSettingTab(this.app, this));
  }

  // Todas as views (dashboard + aba Todoist) abertas, que têm controlador Todoist.
  private todoViews(): (DashboardView | TodoistView)[] {
    const out: (DashboardView | TodoistView)[] = [];
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
  async setHidden(key: string, hidden: boolean) {
    const has = this.settings.hidden.includes(key);
    if (hidden && !has) this.settings.hidden.push(key);
    else if (!hidden && has) this.settings.hidden = this.settings.hidden.filter(k => k !== key);
    else return;
    await this.saveSettings();
    this.rerenderDashboards();
  }

  // Reordena uma seção em sectionOrder (dir = -1 sobe, +1 desce).
  async moveSection(id: SectionId, dir: number) {
    const order = [...this.settings.sectionOrder];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this.settings.sectionOrder = order;
    await this.saveSettings();
    this.rerenderDashboards();
  }

  async movePackage(index: number, dir: number) {
    const arr = this.settings.taskPackages;
    const j = index + dir;
    if (index < 0 || j < 0 || j >= arr.length) return;
    [arr[index], arr[j]] = [arr[j], arr[index]];
    await this.saveSettings();
    this.rerenderDashboards();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    let needStMigration = false;   // credenciais Syncthing migrando data.json → localStorage
    // Saneamento: sectionOrder com exatamente as seções válidas, sem duplicatas.
    const valid: SectionId[] = ["stats", "todoist", "para", "sync", "heatmap", "growth", "calendar"];
    const seen = new Set<SectionId>();
    const cleaned = (this.settings.sectionOrder || []).filter(
      (s): s is SectionId => valid.includes(s as SectionId) && !seen.has(s as SectionId) && (seen.add(s as SectionId), true)
    );
    for (const v of valid) if (!seen.has(v)) cleaned.push(v);
    this.settings.sectionOrder = cleaned;   // "reports" some aqui se estava numa config antiga
    if (!Array.isArray(this.settings.hidden)) this.settings.hidden = [];
    // Fontes da Semana (v0.10.1): valida a lista; se ausente/inválida, usa o default.
    const cs = this.settings.calendarSources;
    this.settings.calendarSources = Array.isArray(cs) && cs.length
      ? cs.filter(s => s && typeof s.path === "string")
          .map(s => ({ path: s.path, color: typeof s.color === "string" ? s.color : ACCENTS[0], on: s.on !== false }))
      : DEFAULT_SETTINGS.calendarSources.map(s => ({ ...s }));
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
    // Syncthing (v0.10.0) — credenciais são POR-DISPOSITIVO: vivem no localStorage
    // (não sincronizam pelo data.json). Migração (1x): se o localStorage ainda não
    // tem, herda o valor que estava no data.json e regrava (ver fim do método).
    const lsGet = (k: string): string | null => {
      const v = this.app.loadLocalStorage(k);
      return typeof v === "string" ? v : null;
    };
    const dataUrl = typeof this.settings.syncthingUrl === "string" && this.settings.syncthingUrl.trim()
      ? this.settings.syncthingUrl : "http://127.0.0.1:8384";
    const dataKey = typeof this.settings.syncthingApiKey === "string" ? this.settings.syncthingApiKey : "";
    const dataFolder = typeof this.settings.syncthingFolderId === "string" ? this.settings.syncthingFolderId : "";
    needStMigration = lsGet(LS_ST_URL) === null && lsGet(LS_ST_KEY) === null && lsGet(LS_ST_FOLDER) === null;
    this.settings.syncthingUrl = lsGet(LS_ST_URL) ?? dataUrl;
    this.settings.syncthingApiKey = lsGet(LS_ST_KEY) ?? dataKey;
    this.settings.syncthingFolderId = lsGet(LS_ST_FOLDER) ?? dataFolder;
    this.settings.syncthingShowCounts = this.settings.syncthingShowCounts === true;
    // Pacotes de tarefas (v0.12.0).
    const tp = this.settings.taskPackages;
    this.settings.taskPackages = Array.isArray(tp)
      ? tp.filter(p => p && typeof p.id === "string").map(p => ({
          id: p.id,
          name: typeof p.name === "string" ? p.name : "",
          icon: typeof p.icon === "string" && p.icon.trim() ? p.icon : undefined,
          tasks: Array.isArray(p.tasks) ? p.tasks.filter(x => typeof x === "string") : [],
          projectId: typeof p.projectId === "string" && p.projectId ? p.projectId : undefined,
          labels: Array.isArray(p.labels) ? p.labels.filter(x => typeof x === "string") : undefined,
        }))
      : [];
    this.settings.packageConfirm = ["always", "many", "never"].includes(this.settings.packageConfirm)
      ? this.settings.packageConfirm : "many";

    // Migração 1x: grava as credenciais no localStorage e as remove do data.json.
    if (needStMigration) await this.saveSettings();
  }

  async saveSettings() {
    // Credenciais do Syncthing são por-dispositivo → localStorage (não sincroniza).
    this.app.saveLocalStorage(LS_ST_URL, this.settings.syncthingUrl);
    this.app.saveLocalStorage(LS_ST_KEY, this.settings.syncthingApiKey);
    this.app.saveLocalStorage(LS_ST_FOLDER, this.settings.syncthingFolderId);
    // O data.json (sincronizado pelo Syncthing) NÃO leva as credenciais.
    const shared: Partial<DashSettings> = { ...this.settings };
    delete shared.syncthingUrl;
    delete shared.syncthingApiKey;
    delete shared.syncthingFolderId;
    await this.saveData(shared);
  }

  async open() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) { leaf = workspace.getLeaf(false); await leaf.setViewState({ type: VIEW_TYPE, active: true }); }
    workspace.revealLeaf(leaf);
  }

  async openTodoist() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(TODOIST_VIEW_TYPE)[0];
    if (!leaf) { leaf = workspace.getLeaf(false); await leaf.setViewState({ type: TODOIST_VIEW_TYPE, active: true }); }
    workspace.revealLeaf(leaf);
  }

  onunload() {
    // Varre elementos flutuantes que vivem no document.body (tooltips/popovers): se o
    // plugin for desabilitado com um aberto, o onClose da view pode não rodar.
    this.todo?.hideTip();
    document.querySelectorAll(".wd-tooltip, .wd-pop").forEach(e => e.remove());
  }
}

// ── Aba dedicada do Todoist ──────────────────────────────────────────────────
// Hub do Todoist na área central (não é sidebar): lançador de pacotes + a mesma
// lista de tarefas do dashboard (via TodoistController compartilhado).
class TodoistView extends ItemView {
  private unsubTodo: (() => void) | null = null;

  constructor(leaf: WorkspaceLeaf, private plugin: WerusDashboard) {
    super(leaf);
  }

  getViewType()    { return TODOIST_VIEW_TYPE; }
  getDisplayText() { return "Todoist"; }
  getIcon()        { return "list-checks"; }

  async onOpen() {
    this.refresh();
    this.unsubTodo = this.plugin.todo.subscribe(() => this.refresh());
  }
  async onClose() {
    this.unsubTodo?.();
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
}

// ── Modal de confirmação genérico (resolve true/false) ───────────────────────

interface ConfirmItem {
  text: string;
  labels?: { name: string; color: string }[];   // chips opcionais (etiquetas)
}

interface ConfirmOpts {
  title: string;
  body: string;
  items?: ConfirmItem[];   // lista opcional (ex.: tarefas a criar)
  cta: string;             // rótulo do botão de confirmação
}

class ConfirmModal extends Modal {
  private done = false;
  constructor(app: App, private opts: ConfirmOpts, private resolve: (ok: boolean) => void) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("wd-confirm");
    contentEl.createEl("h3", { text: this.opts.title });
    contentEl.createEl("p", { text: this.opts.body });
    if (this.opts.items?.length) {
      const ul = contentEl.createEl("ul", { cls: "wd-confirm-list" });
      for (const it of this.opts.items) {
        const li = ul.createEl("li");
        li.createSpan({ text: it.text });
        for (const l of it.labels ?? []) {
          const chip = li.createSpan({ cls: "wd-confirm-label" });
          chip.createSpan({ cls: "wd-label-dot" }).style.background = l.color;
          chip.createSpan({ text: `@${l.name}` });
        }
      }
    }
    const actions = contentEl.createDiv({ cls: "wd-tf-actions" });
    actions.createEl("button", { text: "Cancelar" }).onclick = () => this.close();
    const ok = actions.createEl("button", { cls: "mod-cta", text: this.opts.cta });
    ok.onclick = () => { this.done = true; this.close(); };
  }

  onClose() {
    this.contentEl.empty();
    this.resolve(this.done);
  }
}

function confirmModal(app: App, opts: ConfirmOpts): Promise<boolean> {
  return new Promise(resolve => new ConfirmModal(app, opts, resolve).open());
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
  dueDate: string;    // YYYY-MM-DD (calendário); "" = sem data
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
    // Prefill de criação: "hoje" → data de hoje; já-YYYY-MM-DD passa direto; resto ignora.
    const pre = opts.prefillDue;
    const prefillDate = pre === "hoje" ? toKey(new Date())
      : (pre && /^\d{4}-\d{2}-\d{2}$/.test(pre) ? pre : "");
    this.v = {
      content: t?.content ?? "",
      description: t?.description ?? "",
      priority: t?.priority ?? 1,
      dueDate: t?.due?.date ? t.due.date.substring(0, 10) : prefillDate,
      projectId: t?.project_id ?? "",
      labels: (t?.labels ?? []).slice(),
    };
    this.knownLabels = [...new Set([...opts.labels, ...this.v.labels])].sort((a, b) => a.localeCompare(b));
  }

  onOpen() {
    const { contentEl, titleEl, modalEl } = this;
    modalEl.addClass("wd-task-form");
    titleEl.setText(this.opts.mode === "create" ? "Nova tarefa" : "Editar tarefa");

    // Só na edição: atalho "Abrir no Todoist" no topo, ao lado do X de fechar.
    if (this.opts.mode === "edit" && this.opts.task) {
      const open = modalEl.createEl("button", { cls: "wd-tf-open-top", text: "↗ Todoist" });
      open.setAttr("title", "Abrir no Todoist");
      open.onclick = () => window.open(taskUrl(this.opts.task!), "_blank");
    }

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
    const drow = contentEl.createDiv({ cls: "wd-tf-due-row" });
    const due = drow.createEl("input", { cls: "wd-tf-input wd-tf-date", type: "date" });
    due.value = this.v.dueDate;
    due.onchange = () => { this.v.dueDate = due.value; };
    const clr = drow.createEl("button", { cls: "wd-tf-due-clear", text: "sem data" });
    clr.onclick = () => { this.v.dueDate = ""; due.value = ""; };
    contentEl.createDiv({ cls: "wd-tf-hint", text: "Clique para abrir o calendário. Vazio = sem data." });
    if (this.opts.task?.due?.is_recurring)
      contentEl.createDiv({ cls: "wd-tf-warn", text: "⟳ Tarefa recorrente — mudar a data fixa pode encerrar a recorrência." });

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
  // Projetos do Todoist (para os dropdowns dos pacotes). Buscados 1x; quando
  // chegam, re-renderiza a aba para preencher os selects.
  private projects: TodoistProject[] | null = null;
  // Etiquetas do Todoist (chips por pacote). Mesma estratégia: busca 1x.
  private labels: TodoistLabel[] | null = null;

  constructor(app: App, private plugin: WerusDashboard) { super(app, plugin); }

  display() {
    const { containerEl } = this;
    const plugin = this.plugin;
    containerEl.empty();

    // ── Exibição do dashboard ───────────────────────────────────────────────
    containerEl.createEl("h3", { text: "Exibição do dashboard" });

    new Setting(containerEl)
      .setName("Modo compacto")
      .setDesc("Layout mais denso, com menos espaçamento entre os elementos.")
      .addToggle(t => t
        .setValue(plugin.settings.compact)
        .onChange(async v => {
          plugin.settings.compact = v;
          await plugin.saveSettings();
          plugin.rerenderDashboards();
        }));

    // ── Seções do dashboard (visibilidade + ordem) ──────────────────────────
    containerEl.createEl("h3", { text: "Seções do dashboard" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Ative/desative cada seção e ajuste a ordem em que aparecem na dashboard.",
    });

    const order = plugin.settings.sectionOrder;
    order.forEach((id, i) => {
      new Setting(containerEl)
        .setName(SECTION_LABEL[id])
        .addExtraButton(b => b
          .setIcon("arrow-up").setTooltip("Mover para cima").setDisabled(i === 0)
          .onClick(async () => { await plugin.moveSection(id, -1); this.display(); }))
        .addExtraButton(b => b
          .setIcon("arrow-down").setTooltip("Mover para baixo").setDisabled(i === order.length - 1)
          .onClick(async () => { await plugin.moveSection(id, +1); this.display(); }))
        .addToggle(t => t
          .setTooltip("Visível")
          .setValue(!plugin.settings.hidden.includes("sec:" + id))
          .onChange(async v => { await plugin.setHidden("sec:" + id, !v); }));
    });

    // ── Pastas exibidas (cards do Cofre) ────────────────────────────────────
    containerEl.createEl("h3", { text: "Pastas exibidas (cards do Cofre)" });
    const topFolders = (this.app.vault.getRoot().children
      .filter(c => c instanceof TFolder && !c.name.startsWith(".")) as TFolder[])
      .sort((a, b) => a.name.localeCompare(b.name, "pt"));
    if (!topFolders.length) {
      containerEl.createEl("p", { cls: "setting-item-description", text: "Nenhuma pasta de topo no cofre." });
    }
    for (const f of topFolders) {
      new Setting(containerEl)
        .setName(f.name)
        .addToggle(t => t
          .setTooltip("Visível")
          .setValue(!plugin.settings.hidden.includes(f.path))
          .onChange(async v => { await plugin.setHidden(f.path, !v); }));
    }

    // ── Fontes da seção Relatórios ───────────────────────────────────────────
    containerEl.createEl("h3", { text: "Fontes dos Relatórios" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Pastas cujas notas viram cards nos dias da seção Relatórios (posição pela data da nota). Cada fonte tem uma cor própria.",
    });

    const srcs = plugin.settings.calendarSources;
    srcs.forEach(s => {
      new Setting(containerEl)
        .setName(s.path)
        .addToggle(t => t
          .setTooltip("Ativa")
          .setValue(s.on)
          .onChange(async v => { s.on = v; await plugin.saveSettings(); plugin.rerenderDashboards(); }))
        .addColorPicker(c => c
          .setValue(s.color)
          .onChange(async v => { s.color = v; await plugin.saveSettings(); plugin.rerenderDashboards(); }))
        .addExtraButton(b => b
          .setIcon("trash-2").setTooltip("Remover fonte")
          .onClick(async () => {
            plugin.settings.calendarSources = srcs.filter(x => x !== s);
            await plugin.saveSettings();
            plugin.rerenderDashboards();
            this.display();
          }));
    });

    const used = new Set(srcs.map(s => s.path));
    const available = allFolderPaths(this.app).filter(p => !used.has(p));
    if (available.length) {
      new Setting(containerEl)
        .setName("Adicionar fonte")
        .setDesc("Escolha uma pasta do cofre para alimentar a seção Relatórios.")
        .addDropdown(d => {
          d.addOption("", "Escolha uma pasta…");
          for (const p of available) d.addOption(p, p);
          d.onChange(async v => {
            if (!v) return;
            const color = ACCENTS[plugin.settings.calendarSources.length % ACCENTS.length];
            plugin.settings.calendarSources.push({ path: v, color, on: true });
            await plugin.saveSettings();
            plugin.rerenderDashboards();
            this.display();
          });
        });
    }

    // ── Pacotes de tarefas ───────────────────────────────────────────────────
    containerEl.createEl("h3", { text: "Pacotes de tarefas" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Conjuntos de tarefas que você lança no Todoist com um clique (na aba Todoist ou no dashboard), todas com data de hoje. Uma tarefa por linha. Use @etiqueta numa linha para aplicar uma etiqueta só àquela tarefa.",
    });

    new Setting(containerEl)
      .setName("Confirmar antes de lançar")
      .setDesc("Pede confirmação (com a lista de tarefas) antes de criar. \"Sempre\" confirma até para 1 tarefa — útil para testar; depois mude para Nunca.")
      .addDropdown(d => d
        .addOption("always", "Sempre")
        .addOption("many", "Só muitas (> 5 tarefas)")
        .addOption("never", "Nunca")
        .setValue(plugin.settings.packageConfirm)
        .onChange(async v => { plugin.settings.packageConfirm = v as DashSettings["packageConfirm"]; await plugin.saveSettings(); }));

    const token = plugin.settings.todoistToken.trim();
    // Busca projetos e etiquetas uma vez (dropdowns + chips); ao chegar, re-renderiza.
    if (token && this.projects === null) {
      fetchTodoistProjects(token).then(ps => { this.projects = ps; this.display(); }).catch(() => { this.projects = []; });
    }
    if (token && this.labels === null) {
      fetchTodoistLabels(token).then(ls => { this.labels = ls; this.display(); }).catch(() => { this.labels = []; });
    }

    // Popover de etiquetas de um pacote (chips toggle com a cor do Todoist).
    const openLabelsPopover = (anchor: HTMLElement, pkg: TaskPackage, refresh: () => void) =>
      openPopover(anchor, body => {
        body.createDiv({ cls: "wd-pop-title", text: "Etiquetas do pacote" });
        if (!token) { body.createDiv({ cls: "wd-tf-hint", text: "Configure o token do Todoist." }); return; }
        if (this.labels === null) { body.createDiv({ cls: "wd-tf-hint", text: "Carregando…" }); return; }
        if (!this.labels.length) { body.createDiv({ cls: "wd-tf-hint", text: "Nenhuma etiqueta no Todoist." }); return; }
        const chips = body.createDiv({ cls: "wd-pop-chips" });
        const render = () => {
          chips.empty();
          for (const l of this.labels!) {
            const on = (pkg.labels ?? []).includes(l.name);
            const chip = chips.createSpan({ cls: "wd-todo-fchip" + (on ? " wd-on" : "") });
            chip.createSpan({ cls: "wd-label-dot" }).style.background = TODOIST_COLORS[l.color] ?? LABEL_FALLBACK;
            chip.createSpan({ text: `@${l.name}` });
            chip.onclick = async () => {
              const cur = pkg.labels ?? [];
              const i = cur.indexOf(l.name);
              if (i >= 0) cur.splice(i, 1); else cur.push(l.name);
              pkg.labels = cur.length ? cur : undefined;
              await plugin.saveSettings();
              plugin.rerenderDashboards();
              render();
              refresh();
            };
          }
        };
        render();
      }, { cls: "wd-pop-labels" });

    // Popover de tarefas de um pacote (textarea; persiste no input e ao fechar).
    const openTasksPopover = (anchor: HTMLElement, pkg: TaskPackage, refresh: () => void) => {
      let ta: HTMLTextAreaElement;
      openPopover(anchor, body => {
        body.createDiv({ cls: "wd-pop-title", text: "Tarefas do pacote" });
        ta = body.createEl("textarea", { cls: "wd-pkg-tasks" });
        ta.value = pkg.tasks.join("\n");
        ta.placeholder = "Uma tarefa por linha (ex.: Beber água)";
        ta.rows = 6;
        ta.addEventListener("input", async () => {
          pkg.tasks = ta.value.split("\n").map(s => s.trim()).filter(Boolean);
          await plugin.saveSettings();
          refresh();
        });
        body.createDiv({ cls: "wd-tf-hint", text: "Uma por linha · @etiqueta marca só aquela tarefa · fecha ao clicar fora ou Esc." });
        setTimeout(() => ta.focus(), 0);
      }, { cls: "wd-pop-tasks", width: 320, onClose: () => { plugin.rerenderDashboards(); } });
    };

    const pkgs = plugin.settings.taskPackages;
    const list = containerEl.createDiv({ cls: "wd-pkg-list" });
    pkgs.forEach((pkg, idx) => {
      const row = list.createDiv({ cls: "wd-pkg-row" });

      // Ícone (botão → popover de paleta).
      const iconBtn = row.createSpan({ cls: "wd-pkg-icontrigger" });
      iconBtn.setAttr("title", "Ícone do pacote");
      const fillIcon = () => {
        iconBtn.empty();
        if (pkg.icon) renderIcon(iconBtn.createSpan({ cls: "wd-pkg-ico" }), pkg.icon);
        else iconBtn.createSpan({ cls: "wd-pkg-ico-empty", text: "+" });
      };
      fillIcon();
      iconBtn.onclick = () => openIconPopover(iconBtn, pkg.icon, async ic => {
        pkg.icon = ic; await plugin.saveSettings(); plugin.rerenderDashboards(); fillIcon();
      });

      // Nome.
      const name = row.createEl("input", { cls: "wd-pkg-name-input", attr: { type: "text", placeholder: "Nome do pacote" } });
      name.value = pkg.name;
      name.addEventListener("input", async () => { pkg.name = name.value; await plugin.saveSettings(); });
      name.addEventListener("change", () => plugin.rerenderDashboards());

      // Projeto.
      const proj = row.createEl("select", { cls: "wd-pkg-proj dropdown" });
      const addOpt = (v: string, t: string) => {
        const o = proj.createEl("option", { text: t, value: v });
        if ((pkg.projectId ?? "") === v) o.selected = true;
      };
      addOpt("", "Entrada");
      for (const p of (this.projects ?? [])) addOpt(p.id, p.name);
      proj.onchange = async () => { pkg.projectId = proj.value || undefined; await plugin.saveSettings(); };

      // Etiquetas (botão → popover).
      const lblBtn = row.createEl("button", { cls: "wd-pkg-chip-btn" });
      const fillLbl = () => {
        lblBtn.empty();
        setIcon(lblBtn.createSpan({ cls: "wd-pkg-btn-ico" }), "tag");
        lblBtn.createSpan({ text: "Etiquetas" });
        const n = pkg.labels?.length ?? 0;
        if (n) lblBtn.createSpan({ cls: "wd-pkg-count", text: String(n) });
      };
      fillLbl();
      lblBtn.onclick = () => openLabelsPopover(lblBtn, pkg, fillLbl);

      // Tarefas (botão → popover).
      const taskBtn = row.createEl("button", { cls: "wd-pkg-chip-btn" });
      const fillTask = () => {
        taskBtn.empty();
        setIcon(taskBtn.createSpan({ cls: "wd-pkg-btn-ico" }), "list");
        taskBtn.createSpan({ text: "Tarefas" });
        const n = pkg.tasks.filter(s => s.trim()).length;
        if (n) taskBtn.createSpan({ cls: "wd-pkg-count", text: String(n) });
      };
      fillTask();
      taskBtn.onclick = () => openTasksPopover(taskBtn, pkg, fillTask);

      // Reordenar / remover.
      const up = row.createSpan({ cls: "wd-pkg-mini" + (idx === 0 ? " wd-disabled" : "") });
      setIcon(up, "chevron-up"); up.setAttr("title", "Mover para cima");
      if (idx > 0) up.onclick = async () => { await plugin.movePackage(idx, -1); this.display(); };
      const down = row.createSpan({ cls: "wd-pkg-mini" + (idx === pkgs.length - 1 ? " wd-disabled" : "") });
      setIcon(down, "chevron-down"); down.setAttr("title", "Mover para baixo");
      if (idx < pkgs.length - 1) down.onclick = async () => { await plugin.movePackage(idx, +1); this.display(); };
      const del = row.createSpan({ cls: "wd-pkg-mini wd-pkg-del" });
      setIcon(del, "trash-2"); del.setAttr("title", "Remover pacote");
      del.onclick = async () => {
        plugin.settings.taskPackages = pkgs.filter(x => x !== pkg);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        this.display();
      };
    });

    new Setting(containerEl)
      .setName("Adicionar pacote")
      .addButton(b => b
        .setButtonText("+ Novo pacote")
        .onClick(async () => {
          plugin.settings.taskPackages.push({ id: uid(), name: "Novo pacote", tasks: [] });
          await plugin.saveSettings();
          this.display();
        }));

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
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Estas credenciais são guardadas por dispositivo (localStorage) — cada máquina tem a sua e elas não sincronizam pelo Syncthing nem vão para o Git.",
    });

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
      .setDesc("Syncthing → Actions → Settings → API Key. Guardada por dispositivo (localStorage), não vai para o data.json/Git.")
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
