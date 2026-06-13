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

// ── Gamificação (v0.13) ──────────────────────────────────────────────────────
const GAME_VIEW_TYPE = "werus-game";
const GAME_LOG_PATH = "20.Areas/Gamificação.md";        // log canônico de XP no cofre
const GAME_LOG_FENCE = "wd-game-log";                   // bloco cercado com os eventos (1 por linha)
const DEFAULT_RULES_PATH = "20.Areas/Gamificação — Regras.md";   // nota editável (bloco ```json) com as regras do jogo
const LEGACY_ACH_PATH = "20.Areas/Gamificação — Conquistas.md";  // nota antiga (só conquistas) — migrada 1x para as Regras
const HARVEST_BACKFILL_DAYS = 90;                       // 1ª colheita: janela máx. da API
// XP base por prioridade da API (4 = p1 … 1 = p4).
type PriKey = "p1" | "p2" | "p3" | "p4";
const DEFAULT_XP_BY_PRI: Record<PriKey, number> = { p1: 8, p2: 5, p3: 3, p4: 1 };
// API do Todoist: priority 4 = p1 (urgente) … 1 = p4 (padrão).
function priKey(p: number): PriKey { return p === 4 ? "p1" : p === 3 ? "p2" : p === 2 ? "p3" : "p4"; }

// uid curto e estável (pacotes de tarefas).
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

type Status = "progress" | "paused" | "cancelled";
type SectionId = "calendar" | "para" | "heatmap" | "growth" | "stats" | "todoist" | "sync" | "game";

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
  // Gamificação (v0.13)
  gamificationEnabled: boolean;  // mostra a seção/aba do Game
  gamePenaltyFactor: number;     // "não feito" tira base × fator
  gameLastHarvest: string;       // ISO da última colheita de concluídas (limita o fetch)
  gameChartMode: "bars" | "line";    // gráfico de XP por dia: barras ou linha com pontos
  growthChartMode: "bars" | "line";  // gráfico de Crescimento do cofre: barras ou linha
  gameAchievements: Record<string, string>;  // id da conquista → data ISO de desbloqueio
  gameRulesPath: string;         // caminho da nota de Regras (JSON) — configurável p/ cofres sem PARA
}

const DEFAULT_SETTINGS: DashSettings = {
  sectionOrder: ["stats", "game", "todoist", "para", "sync", "heatmap", "growth", "calendar"],
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
  gamificationEnabled: true,
  gamePenaltyFactor: 1.5,
  gameLastHarvest: "",
  gameChartMode: "bars",
  growthChartMode: "bars",
  gameAchievements: {},
  gameRulesPath: DEFAULT_RULES_PATH,
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
const SEC_GAME = "sec:game";

// Rótulos amigáveis das seções (usados na aba de Configurações).
const SECTION_LABEL: Record<SectionId, string> = {
  stats:    "Estatísticas",
  todoist:  "Tarefas",
  para:     "Cofre (pastas)",
  sync:     "Sincronização",
  heatmap:  "Atividade do cofre",
  growth:   "Crescimento do cofre",
  calendar: "Relatórios",
  game:     "Gamificação",
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
  completed_at?: string;   // só nas concluídas (by_completion_date)
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
function splitTaskLabels(line: string, pkgLabels: string[] = []): { title: string; labels: string[]; priority: number } {
  const inline: string[] = [];
  let priority = 1;   // API: 1 = p4 (padrão) … 4 = p1
  // Só `@etiqueta` / `pN` no início ou depois de espaço (lookbehind) — não pega o "@gmail"
  // de um e-mail nem o "p1" de "top1".
  const stripped = line
    .replace(/(?<=^|\s)@([\p{L}\p{N}_]+)/gu, (_m, name: string) => { inline.push(name); return ""; })
    .replace(/(?<=^|\s)p([1-4])(?=\s|$)/gi, (_m, d: string) => { priority = 5 - Number(d); return ""; })
    .replace(/\s{2,}/g, " ").trim();
  const title = stripped || line.trim();
  const labels = [...new Set([...pkgLabels, ...inline])];
  return { title, labels, priority };
}

// Acessibilidade: faz um elemento clicável (div/span) se comportar como botão —
// foco por teclado (Tab), papel ARIA e ativação por Enter/Espaço (dispara o próprio
// onclick). O nome acessível vem do texto/`title` que o chamador já define.
function clickable<T extends HTMLElement>(el: T, handler: (e: MouseEvent) => void): T {
  el.onclick = handler;
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
  });
  return el;
}

// Popover flutuante genérico, ancorado num elemento. `fill(body, close)` monta o
// conteúdo. Fecha ao clicar fora ou Escape (opts.onClose roda antes de remover).
function openPopover(
  anchor: HTMLElement,
  fill: (body: HTMLElement, close: () => void) => void,
  opts: { cls?: string; width?: number; onClose?: () => void; container?: HTMLElement } = {},
): () => void {
  document.querySelectorAll(".wd-pop").forEach(e => e.remove());
  // Por padrão vive no document.body; dentro da modal de Configurações precisa viver no
  // container da aba (senão a modal prende o foco e não dá para digitar no textarea).
  const pop = (opts.container ?? document.body).createDiv({ cls: "wd-pop" + (opts.cls ? " " + opts.cls : "") });
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
    clickable(none, () => { onPick(undefined); close(); });
    for (const ic of PKG_ICONS) {
      const opt = pop.createSpan({ cls: "wd-pkg-iconopt" + (current === ic ? " wd-on" : "") });
      renderIcon(opt, ic);
      opt.setAttr("title", ic);
      clickable(opt, () => { onPick(ic); close(); });
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

// Cria um projeto. POST /projects → 200 com o projeto criado. (Provisionamento das Regras.)
async function createTodoistProject(token: string, name: string): Promise<void> {
  const res = await requestUrl({
    url: "https://api.todoist.com/api/v1/projects",
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ name }),
    throw: false,
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
}

// Cria uma etiqueta pessoal. POST /labels → 200. `color` = nome de paleta do Todoist (opcional).
async function createTodoistLabel(token: string, name: string, color?: string): Promise<void> {
  const body: { name: string; color?: string } = { name };
  if (color) body.color = color;
  const res = await requestUrl({
    url: "https://api.todoist.com/api/v1/labels",
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
    throw: false,
  });
  if (res.status === 401 || res.status === 403) throw new Error("token inválido (401/403)");
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

// ── Gamificação: concluídas + log no cofre + cálculo (v0.13) ─────────────────

// Busca concluídas por data de conclusão. API v1: { items, next_cursor }, paginada.
async function fetchCompletedTasks(token: string, since: string, until: string): Promise<TodoistTask[]> {
  const all: TodoistTask[] = [];
  let cursor: string | null = null;
  let pages = 0;
  do {
    const url = new URL("https://api.todoist.com/api/v1/tasks/completed/by_completion_date");
    url.searchParams.set("since", since);
    url.searchParams.set("until", until);
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
    const data = res.json as { items?: TodoistTask[]; next_cursor?: string | null };
    all.push(...(data.items ?? []));
    cursor = data.next_cursor ?? null;
  } while (cursor && ++pages < TODO_MAX_PAGES);
  return all;
}

// Um evento do log de gamificação (tarefa feita = +XP; não-feita = −XP).
type GameEventType = "feito" | "nao-feito";
interface GameEvent {
  date: string;     // YYYY-MM-DD (dia local da conclusão/marcação)
  type: GameEventType;
  xp: number;       // assinado
  key: string;      // idempotência: `${taskId}|${completed_at|ts}`
  content: string;
  project: string;  // nome do projeto (ou id se desconhecido)
  labels: string[];
  pri?: number;     // prioridade da API (1..4) no momento — p/ p1Count com XP configurável
}

interface GameStats {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  streakCurrent: number;
  streakBest: number;
  todayXp: number;
  todayCount: number;
  doneCount: number;   // total de eventos "feito" (volume)
  p1Count: number;     // "feito" de prioridade p1 (por e.pri, com fallback de XP nos eventos antigos)
  maxDayXp: number;    // maior XP num único dia (≥0)
  levelMax: boolean;   // o nível geral está no teto da curva (curva padrão é ilimitada → false)
  byDay: Map<string, { xp: number; count: number }>;
  byProject: Map<string, number>;        // XP bruto acumulado, só "feito"
  byLabel: Map<string, number>;          // idem
  byProjectInfo: Map<string, LevelInfo>; // nível/progresso por projeto (respeita curva/tabela do escopo)
  byLabelInfo: Map<string, LevelInfo>;   // idem por etiqueta
}

// Avaliador de fórmula ARITMÉTICA seguro (sem eval/Function — as Regras são compartilháveis).
// Suporta números, variáveis permitidas, + - * / %, ^ (potência, direita-assoc), unário -, e ( ).
// Compila uma vez → (env) => número; null se a expressão for inválida.
type FormulaFn = (env: Record<string, number>) => number;
function compileFormula(src: string, allowed: string[]): FormulaFn | null {
  const allow = new Set(allowed);
  const toks: { t: string; n?: number; s?: string }[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const num = src.slice(i, j);
      if (!/^\d*\.?\d+$/.test(num)) return null;
      toks.push({ t: "num", n: Number(num) }); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j++;
      const id = src.slice(i, j);
      if (!allow.has(id)) return null;
      toks.push({ t: "id", s: id }); i = j; continue;
    }
    if ("+-*/%^()".includes(c)) { toks.push({ t: c }); i++; continue; }
    return null;
  }
  let p = 0, bad = false;
  const cur = () => toks[p];
  function parseExpr(): FormulaFn {
    let a = parseTerm();
    while (cur() && (cur().t === "+" || cur().t === "-")) {
      const op = toks[p++].t, left = a, right = parseTerm();
      a = op === "+" ? (e) => left(e) + right(e) : (e) => left(e) - right(e);
    }
    return a;
  }
  function parseTerm(): FormulaFn {
    let a = parseUnary();
    while (cur() && (cur().t === "*" || cur().t === "/" || cur().t === "%")) {
      const op = toks[p++].t, left = a, right = parseUnary();
      a = op === "*" ? (e) => left(e) * right(e) : op === "/" ? (e) => left(e) / right(e) : (e) => left(e) % right(e);
    }
    return a;
  }
  function parseUnary(): FormulaFn {
    if (cur() && (cur().t === "-" || cur().t === "+")) {
      const op = toks[p++].t, x = parseUnary();
      return op === "-" ? (e) => -x(e) : x;
    }
    return parsePower();
  }
  function parsePower(): FormulaFn {
    const base = parsePrimary();
    if (cur() && cur().t === "^") { p++; const exp = parseUnary(); return (e) => Math.pow(base(e), exp(e)); }
    return base;
  }
  function parsePrimary(): FormulaFn {
    const tk = cur();
    if (!tk) { bad = true; return () => 0; }
    if (tk.t === "num") { p++; const n = tk.n ?? 0; return () => n; }
    if (tk.t === "id") { p++; const s = tk.s ?? ""; return (e) => e[s] ?? 0; }
    if (tk.t === "(") { p++; const x = parseExpr(); if (!cur() || cur().t !== ")") bad = true; else p++; return x; }
    bad = true; return () => 0;
  }
  const fn = parseExpr();
  if (bad || p !== toks.length || toks.length === 0) return null;
  return (env) => { const v = fn(env); return Number.isFinite(v) ? v : 0; };
}

// ── Níveis por curva (fórmula) ou tabela (limiares) ──────────────────────────
const DEFAULT_LEVEL_CURVE = "100 * n^2";   // XP cumulativo do nível n (= ⌊√(xp/100)⌋, retrocompat)
const MAX_LEVEL_ITER = 100000;             // teto de segurança p/ curvas ilimitadas
interface LevelInfo { level: number; into: number; forNext: number; pct: number; max: boolean }
type ThrFn = (n: number) => number;        // XP cumulativo para alcançar o nível n (n≥1), crescente

// Compila uma curva → ThrFn; cai no padrão se a fórmula for inválida.
function curveToThr(curve: string): ThrFn {
  const fn = compileFormula(curve, ["n"]) ?? compileFormula(DEFAULT_LEVEL_CURVE, ["n"]) as FormulaFn;
  return (n) => fn({ n });
}
// Nível + progresso a partir de thr(n) e do XP. maxLevel = 0 → ilimitado; >0 → trava o nível.
function levelFromThr(xp: number, thr: ThrFn, maxLevel: number): LevelInfo {
  const x = Math.max(0, xp);
  let level = 0;
  const cap = maxLevel > 0 ? maxLevel : MAX_LEVEL_ITER;
  let prev = 0;
  while (level < cap) {
    const need = thr(level + 1);
    if (!Number.isFinite(need) || need > x) break;
    if (level > 0 && need <= prev) break;   // curva não-crescente: para (evita varrer até o teto)
    prev = need; level++;
  }
  const atMax = maxLevel > 0 && level >= maxLevel;
  const base = level >= 1 ? thr(level) : 0;
  const next = atMax ? base : thr(level + 1);
  const into = Math.max(0, x - base);
  const forNext = Math.max(1, (Number.isFinite(next) ? next : base) - base);
  const pct = atMax ? 100 : Math.min(100, Math.round(into / forNext * 100));
  return { level, into, forNext, pct, max: atMax };
}

// Gráfico de linha com pontos (SVG responsivo) — reusado pelo XP/dia e pelo Crescimento.
// A linha é um <polyline> com stroke não-escalável (espessura uniforme apesar do viewBox
// esticado); os pontos são divs HTML posicionados em % (ficam redondos e levam o tooltip).
interface LinePoint { value: number; label: string; isToday: boolean; tip: string }
function renderLineChart(parent: HTMLElement, points: LinePoint[]): void {
  const n = points.length;
  const max = Math.max(...points.map(p => Math.max(0, p.value)), 1);
  const xPct = (i: number) => n <= 1 ? 0 : (i / (n - 1)) * 100;
  const yPct = (v: number) => (1 - Math.max(0, v) / max) * 100;
  const chart = parent.createDiv({ cls: "wd-line-chart" });
  const wrap = chart.createDiv({ cls: "wd-line-wrap" });
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("class", "wd-line-svg");
  const poly = document.createElementNS(svgNS, "polyline");
  poly.setAttribute("points", points.map((p, i) => `${xPct(i)},${yPct(p.value)}`).join(" "));
  poly.setAttribute("class", "wd-line-path");
  svg.appendChild(poly);
  wrap.appendChild(svg);
  points.forEach((p, i) => {
    const dot = wrap.createDiv({ cls: "wd-line-dot" + (p.isToday ? " wd-line-dot-today" : "") });
    dot.style.left = `${xPct(i)}%`;
    dot.style.top = `${yPct(p.value)}%`;
    dot.setAttr("title", p.tip);
  });
  const lbls = chart.createDiv({ cls: "wd-line-lbls" });
  points.forEach((p, i) => {
    const show = i === 0 || i === n - 1 || i % 7 === 0;
    lbls.createDiv({ cls: "wd-line-lbl", text: show ? p.label : "" });
  });
}

// Campos separados por TAB (robusto: conteúdo/chave não contêm tab; a chave pode
// conter "|" sem colidir). Tabs/quebras no texto são neutralizados.
function escapeGameField(s: string): string {
  return s.replace(/[\r\n\t]+/g, " ");
}
function serializeGameEvent(e: GameEvent): string {
  const labels = e.labels.map(l => escapeGameField(l).replace(/,/g, " ")).join(",");
  return [e.date, e.type, String(e.xp), e.key, escapeGameField(e.content), escapeGameField(e.project), labels,
    e.pri != null ? String(e.pri) : ""].join("\t");
}
function parseGameEventLine(line: string): GameEvent | null {
  const p = line.split("\t").map(s => s.trim());
  if (p.length < 4) return null;
  const [date, type, xpRaw, key, content = "", project = "", labelsRaw = "", priRaw = ""] = p;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (type !== "feito" && type !== "nao-feito") return null;
  const xp = Number(xpRaw);
  if (!Number.isFinite(xp) || !key) return null;
  const labels = labelsRaw ? labelsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];
  const priN = Number(priRaw);
  const ev: GameEvent = { date, type, xp, key, content, project, labels };
  if (priRaw && Number.isInteger(priN) && priN >= 1 && priN <= 4) ev.pri = priN;
  return ev;
}
// Extrai os eventos do bloco cercado ```wd-game-log … ``` da nota.
function parseGameLog(content: string): GameEvent[] {
  const m = content.match(new RegExp("```" + GAME_LOG_FENCE + "\\r?\\n([\\s\\S]*?)```"));
  if (!m) return [];
  const out: GameEvent[] = [];
  for (const raw of m[1].split("\n")) {
    const ev = parseGameEventLine(raw.trim());
    if (ev) out.push(ev);
  }
  return out;
}
// Conteúdo completo da nota (determinístico: eventos ordenados → mesmos eventos =
// mesmo arquivo em qualquer dispositivo, evitando conflito de Syncthing).
function buildGameLogContent(events: GameEvent[]): string {
  const sorted = [...events].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  return [
    "---", "owner: Werus", "permissions:", "  read: [all]", "  write:", "    - Werus", "    - Claude",
    "reviewed: false", "type: reference", "tags: [gamificacao]", "---", "",
    "# Gamificação — Log de XP", "",
    "> Arquivo **gerido pelo plugin Werus Dashboard**. Cada linha do bloco abaixo é um evento",
    "> (tarefa feita = XP positivo, não feita = XP negativo). Não edite à mão — o painel do",
    "> plugin mostra nível, streak e estatísticas a partir daqui.", "",
    "```" + GAME_LOG_FENCE,
    sorted.map(serializeGameEvent).join("\n"),
    "```", "",
  ].join("\n");
}

// Streak atual (até hoje/ontem) + recorde, a partir dos dias com ≥1 "feito".
function computeStreak(doneDays: Set<string>): { streakCurrent: number; streakBest: number } {
  if (!doneDays.size) return { streakCurrent: 0, streakBest: 0 };
  const dayMs = 86400000;
  const sorted = [...doneDays].sort();
  let best = 1, run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (Date.parse(sorted[i] + "T00:00:00") - Date.parse(sorted[i - 1] + "T00:00:00") === dayMs) {
      run++; best = Math.max(best, run);
    } else run = 1;
  }
  let cur = 0;
  let cursor = new Date(); cursor.setHours(0, 0, 0, 0);
  if (!doneDays.has(toKey(cursor))) cursor = new Date(cursor.getTime() - dayMs);
  while (doneDays.has(toKey(cursor))) { cur++; cursor = new Date(cursor.getTime() - dayMs); }
  return { streakCurrent: cur, streakBest: Math.max(best, cur) };
}

// Estatísticas a partir dos eventos do log (fonte canônica). `caps` (opcional) trava o XP acumulado
// por projeto/etiqueta no máximo configurado — só limita os escopos listados; o XP/nível geral não muda.
// thr(n) + nº máx. de níveis para um escopo: tabela explícita (limiares) ou curva própria; sem def → curva padrão ilimitada.
function scopeLevelFn(def: ScopeLevelDef | undefined, defaultThr: ThrFn): { thr: ThrFn; max: number } {
  if (!def) return { thr: defaultThr, max: 0 };
  if (def.kind === "table") {
    const t = def.thresholds;
    return { thr: (n) => (n >= 1 && n <= t.length ? t[n - 1] : Infinity), max: t.length };
  }
  return { thr: curveToThr(def.curve), max: def.levels };
}
// Maior nível entre os escopos (ignora `skip`, ex.: "—" = sem projeto).
function maxScopeLevel(infos: Map<string, LevelInfo>, skip?: string): number {
  let best = 0;
  for (const [name, info] of infos) { if (skip && name === skip) continue; best = Math.max(best, info.level); }
  return best;
}

function computeGameStats(events: GameEvent[], rules?: GameRules): GameStats {
  const byDay = new Map<string, { xp: number; count: number }>();
  const byProject = new Map<string, number>();
  const byLabel = new Map<string, number>();
  let totalXp = 0;
  let doneCount = 0;
  let p1Count = 0;
  const fallbackP1 = DEFAULT_XP_BY_PRI.p1;   // eventos antigos sem `pri`: deduz p1 pelo XP padrão de então
  for (const e of events) {
    totalXp += e.xp;
    const d = byDay.get(e.date) ?? { xp: 0, count: 0 };
    d.xp += e.xp;
    if (e.type === "feito") {
      d.count += 1; doneCount += 1;
      if (e.pri != null ? e.pri === 4 : e.xp === fallbackP1) p1Count += 1;
    }
    byDay.set(e.date, d);
    if (e.type === "feito") {
      const proj = e.project || "—";
      byProject.set(proj, (byProject.get(proj) ?? 0) + e.xp);
      for (const l of e.labels) byLabel.set(l, (byLabel.get(l) ?? 0) + e.xp);
    }
  }
  if (totalXp < 0) totalXp = 0;
  let maxDayXp = 0;
  for (const d of byDay.values()) if (d.xp > maxDayXp) maxDayXp = d.xp;

  const defThr = curveToThr(rules?.levelCurve ?? DEFAULT_LEVEL_CURVE);
  const gi = levelFromThr(totalXp, defThr, 0);
  const scopeInfo = (m: Map<string, number>, defs?: Map<string, ScopeLevelDef>): Map<string, LevelInfo> => {
    const out = new Map<string, LevelInfo>();
    for (const [name, xp] of m) {
      const { thr, max } = scopeLevelFn(defs?.get(name), defThr);
      out.set(name, levelFromThr(xp, thr, max));
    }
    return out;
  };
  const byProjectInfo = scopeInfo(byProject, rules?.scopeLevels.projects);
  const byLabelInfo = scopeInfo(byLabel, rules?.scopeLevels.labels);

  const doneDays = new Set<string>();
  for (const e of events) if (e.type === "feito") doneDays.add(e.date);
  const { streakCurrent, streakBest } = computeStreak(doneDays);
  const today = byDay.get(toKey(new Date())) ?? { xp: 0, count: 0 };
  return {
    totalXp, level: gi.level, xpIntoLevel: gi.into, xpForNext: gi.forNext, levelMax: gi.max,
    streakCurrent, streakBest,
    todayXp: today.xp, todayCount: today.count,
    doneCount, p1Count, maxDayXp,
    byDay, byProject, byLabel, byProjectInfo, byLabelInfo,
  };
}

// ───────────────────────── Conquistas (badges) ─────────────────────────
// Derivadas só de GameStats (já calculado) — sem chamada extra ao Todoist.
// Desbloqueada quando value(s) >= goal; permanente (uma vez ganha, fica — punição não re-bloqueia).
type MetricId = "level" | "totalXp" | "doneCount" | "p1Count" | "maxDayXp"
  | "streakBest" | "streakCurrent" | "projectLevel" | "labelLevel";
// Vocabulário de métricas que uma conquista (ou futura meta) pode medir — a ÚNICA parte em código.
// Para criar conquistas via nota, use um destes nomes em "metric". Adicionar uma métrica nova aqui
// a torna disponível para todos.
const METRICS: Record<MetricId, (s: GameStats) => number> = {
  level:         s => s.level,
  totalXp:       s => s.totalXp,
  doneCount:     s => s.doneCount,
  p1Count:       s => s.p1Count,
  maxDayXp:      s => s.maxDayXp,
  streakBest:    s => s.streakBest,
  streakCurrent: s => s.streakCurrent,
  projectLevel:  s => maxScopeLevel(s.byProjectInfo, "—"),
  labelLevel:    s => maxScopeLevel(s.byLabelInfo),
};
const METRIC_LABELS: Record<MetricId, string> = {
  level: "Nível geral",
  totalXp: "XP total acumulado",
  doneCount: "Tarefas concluídas (total)",
  p1Count: "Tarefas p1 concluídas",
  maxDayXp: "Maior XP num único dia",
  streakBest: "Maior sequência de dias",
  streakCurrent: "Sequência de dias atual",
  projectLevel: "Maior nível entre os projetos",
  labelLevel: "Maior nível entre as etiquetas",
};
// Conquista = DADO puro (serializável em JSON): id, título, ícone, categoria + métrica e limiar.
// Desbloqueia quando METRICS[metric](stats) >= goal; permanente (punição não re-bloqueia).
interface Achievement {
  id: string;
  cat: string;        // categoria (cabeçalho na UI)
  title: string;
  desc: string;
  icon: string;       // Lucide
  metric: MetricId;
  goal: number;
}
// Lista padrão embutida. O campo `achievements` da nota de Regras pode substituí-la por completo.
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Nível (geral)
  { id: "lvl5",  cat: "Nível", title: "Aprendiz", desc: "Alcance o nível 5",  icon: "star",  goal: 5,  metric: "level" },
  { id: "lvl10", cat: "Nível", title: "Veterano", desc: "Alcance o nível 10", icon: "medal", goal: 10, metric: "level" },
  { id: "lvl20", cat: "Nível", title: "Mestre",   desc: "Alcance o nível 20", icon: "crown", goal: 20, metric: "level" },
  // Sequência (streak recorde)
  { id: "streak3",   cat: "Sequência", title: "Pegando o ritmo", desc: "3 dias seguidos com tarefa",   icon: "flame", goal: 3,   metric: "streakBest" },
  { id: "streak7",   cat: "Sequência", title: "Semana cheia",    desc: "7 dias seguidos com tarefa",   icon: "flame", goal: 7,   metric: "streakBest" },
  { id: "streak30",  cat: "Sequência", title: "Mês de fogo",     desc: "30 dias seguidos com tarefa",  icon: "flame", goal: 30,  metric: "streakBest" },
  { id: "streak100", cat: "Sequência", title: "Centurião",       desc: "100 dias seguidos com tarefa", icon: "flame", goal: 100, metric: "streakBest" },
  // Volume (tarefas concluídas)
  { id: "vol10",   cat: "Volume", title: "Primeiros passos", desc: "10 tarefas concluídas",   icon: "check-check", goal: 10,   metric: "doneCount" },
  { id: "vol50",   cat: "Volume", title: "Engrenando",       desc: "50 tarefas concluídas",   icon: "check-check", goal: 50,   metric: "doneCount" },
  { id: "vol100",  cat: "Volume", title: "Centena",          desc: "100 tarefas concluídas",  icon: "check-check", goal: 100,  metric: "doneCount" },
  { id: "vol500",  cat: "Volume", title: "Imparável",        desc: "500 tarefas concluídas",  icon: "check-check", goal: 500,  metric: "doneCount" },
  { id: "vol1000", cat: "Volume", title: "Milhar",           desc: "1000 tarefas concluídas", icon: "check-check", goal: 1000, metric: "doneCount" },
  // Prioridade (tarefas p1)
  { id: "p1_25",  cat: "Prioridade", title: "Caçador de p1",          desc: "25 tarefas p1 concluídas",  icon: "zap", goal: 25,  metric: "p1Count" },
  { id: "p1_100", cat: "Prioridade", title: "Matador de prioridades", desc: "100 tarefas p1 concluídas", icon: "zap", goal: 100, metric: "p1Count" },
  // Dia cheio (XP num único dia)
  { id: "day50",  cat: "Dia cheio", title: "Dia produtivo", desc: "50+ XP num único dia",  icon: "sun",     goal: 50,  metric: "maxDayXp" },
  { id: "day100", cat: "Dia cheio", title: "Dia épico",     desc: "100+ XP num único dia", icon: "sunrise", goal: 100, metric: "maxDayXp" },
  // Escopo (níveis por projeto/etiqueta)
  { id: "proj5",  cat: "Escopo", title: "Especialista",   desc: "Nível 5 em algum projeto",   icon: "folder", goal: 5, metric: "projectLevel" },
  { id: "label5", cat: "Escopo", title: "Hábito formado", desc: "Nível 5 em alguma etiqueta", icon: "tag",    goal: 5, metric: "labelLevel" },
];
interface AchievementState { a: Achievement; value: number; unlocked: boolean; pct: number }
function metricValue(metric: string, s: GameStats): number {
  const fn = (METRICS as Record<string, (s: GameStats) => number>)[metric];
  return fn ? fn(s) : 0;
}
function evalAchievement(a: Achievement, s: GameStats): AchievementState {
  const value = metricValue(a.metric, s);
  const unlocked = value >= a.goal;
  const pct = a.goal > 0 ? Math.min(100, Math.round(value / a.goal * 100)) : 0;
  return { a, value, unlocked, pct };
}

// ── Metas (gameGoals): alvo por período (dia/semana/mês/ano), de XP ou de nº de tarefas ──────
// Derivadas dos eventos "feito" do período ATUAL (resetam sozinhas a cada período). Filtro opcional
// por projeto/etiqueta. Editáveis na nota de Regras, como as conquistas.
type GoalPeriod = "day" | "week" | "month" | "year";
type GoalMetric = "xp" | "tasks";
interface GameGoal {
  id: string;
  title: string;
  period: GoalPeriod;
  metric: GoalMetric;
  target: number;
  project?: string;   // filtro: só conta eventos deste projeto
  label?: string;     // filtro: só conta eventos com esta etiqueta
}
const GOAL_PERIODS: GoalPeriod[] = ["day", "week", "month", "year"];
const GOAL_PERIOD_LABELS: Record<GoalPeriod, string> = { day: "hoje", week: "esta semana", month: "este mês", year: "este ano" };
const DEFAULT_GOALS: GameGoal[] = [
  { id: "dia-xp",      title: "Meta diária",      period: "day",  metric: "xp",    target: 30 },
  { id: "semana-vol",  title: "Semana produtiva", period: "week", metric: "tasks", target: 20 },
];
// Início (YYYY-MM-DD local) do período atual. Semana = segunda-feira (ISO).
function periodStartKey(period: GoalPeriod, now: Date): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") { const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); }
  else if (period === "month") d.setDate(1);
  else if (period === "year") d.setMonth(0, 1);
  return toKey(d);
}
interface GoalState { goal: GameGoal; current: number; pct: number; done: boolean }
// Progresso de uma meta no período atual: soma de XP "feito" ou contagem de "feito", com filtro de escopo.
function goalProgress(events: GameEvent[], goal: GameGoal, now: Date): GoalState {
  const start = periodStartKey(goal.period, now);
  let current = 0;
  for (const e of events) {
    if (e.type !== "feito" || e.date < start) continue;
    if (goal.project && (e.project || "") !== goal.project) continue;
    if (goal.label && !e.labels.includes(goal.label)) continue;
    current += goal.metric === "tasks" ? 1 : e.xp;
  }
  current = Math.max(0, current);
  const pct = goal.target > 0 ? Math.min(100, Math.round(current / goal.target * 100)) : 0;
  return { goal, current, pct, done: current >= goal.target };
}

// ── Regras do jogo (configuração declarativa unificada) ──────────────────────
// Uma nota só (settings.gameRulesPath, bloco ```json) define o "jogo": projetos, etiquetas,
// XP por prioridade/etiqueta, curva/tabela de níveis e conquistas. Editável/partilhável pela comunidade.
interface RulesLabel { name: string; color?: string }   // color = nome de paleta do Todoist
// Nível de um escopo: tabela explícita de limiares OU curva (fórmula + nº de níveis).
type ScopeLevelDef =
  | { kind: "table"; thresholds: number[] }
  | { kind: "curve"; levels: number; curve: string };
interface ScopeLevels { projects: Map<string, ScopeLevelDef>; labels: Map<string, ScopeLevelDef> }
type XpByPriority = Record<PriKey, number>;
interface GameRules {
  projects: string[];           // projetos a provisionar no Todoist
  labels: RulesLabel[];         // etiquetas a provisionar no Todoist
  xpByPriority: XpByPriority;    // XP por prioridade (p1 mais alta)
  xpByLabel: Map<string, number>; // bônus de XP por etiqueta (somado à prioridade; pode ser negativo)
  levelCurve: string;           // fórmula do XP cumulativo do nível n (padrão de todos os escopos)
  scopeLevels: ScopeLevels;     // override de níveis por projeto/etiqueta
  achievements: Achievement[];  // badges (cai nos padrões se vazio)
  goals: GameGoal[];            // metas por período (cai nos padrões se vazio)
}
const MAX_SCOPE_LEVELS = 1000;  // limite sensato de níveis gerados por fórmula num escopo
function emptyScopeLevels(): ScopeLevels { return { projects: new Map(), labels: new Map() }; }
function defaultRules(): GameRules {
  return { projects: [], labels: [], xpByPriority: { ...DEFAULT_XP_BY_PRI }, xpByLabel: new Map(),
    levelCurve: DEFAULT_LEVEL_CURVE, scopeLevels: emptyScopeLevels(), achievements: DEFAULT_ACHIEVEMENTS, goals: DEFAULT_GOALS };
}

// Valida um array cru de conquistas (id único, título, goal > 0, metric conhecido). Inválidas → descartadas.
function parseAchievementList(raw: unknown): Achievement[] {
  if (!Array.isArray(raw)) return [];
  const out: Achievement[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const metric = typeof o.metric === "string" ? o.metric : "";
    const goal = Number(o.goal);
    if (!id || seen.has(id) || !title || !(metric in METRICS) || !Number.isFinite(goal) || goal <= 0) continue;
    seen.add(id);
    out.push({
      id, title, metric: metric as MetricId, goal,
      cat: typeof o.cat === "string" && o.cat.trim() ? o.cat.trim() : "Outros",
      desc: typeof o.desc === "string" ? o.desc : "",
      icon: typeof o.icon === "string" && o.icon.trim() ? o.icon.trim() : "trophy",
    });
  }
  return out;
}
// Lê a definição de níveis de UM escopo: array/`thresholds` = tabela (XP cumulativo por nível, crescente);
// `{ levels, curve }` = fórmula. Inválida → null (usa a curva padrão).
function parseScopeLevelDef(raw: unknown): ScopeLevelDef | null {
  const asTable = (arr: unknown[]): ScopeLevelDef | null => {
    const t = [...new Set(arr.map(Number).filter(n => Number.isFinite(n) && n > 0))].sort((a, b) => a - b);
    return t.length ? { kind: "table", thresholds: t } : null;
  };
  if (Array.isArray(raw)) return asTable(raw);
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.thresholds)) return asTable(o.thresholds);
    const levels = Math.floor(Number(o.levels));
    const curve = typeof o.curve === "string" ? o.curve.trim() : "";
    if (Number.isFinite(levels) && levels >= 1 && levels <= MAX_SCOPE_LEVELS && curve && compileFormula(curve, ["n"]))
      return { kind: "curve", levels, curve };
  }
  return null;
}
function parseScopeLevelMap(raw: unknown): Map<string, ScopeLevelDef> {
  const m = new Map<string, ScopeLevelDef>();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return m;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const name = k.trim();
    const def = parseScopeLevelDef(v);
    if (name && def) m.set(name, def);
  }
  return m;
}
function parseScopeLevels(raw: unknown): ScopeLevels {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { projects: parseScopeLevelMap(o.projects), labels: parseScopeLevelMap(o.labels) };
}
// XP por prioridade: aceita p1..p4 ≥ 0; o que faltar fica no padrão.
function parseXpByPriority(raw: unknown): XpByPriority {
  const out: XpByPriority = { ...DEFAULT_XP_BY_PRI };
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    for (const k of ["p1", "p2", "p3", "p4"] as PriKey[]) {
      const n = Number(o[k]);
      if (Number.isFinite(n) && n >= 0) out[k] = n;
    }
  }
  return out;
}
// Bônus de XP por etiqueta (somado ao da prioridade; pode ser negativo).
function parseXpByLabel(raw: unknown): Map<string, number> {
  const m = new Map<string, number>();
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      const name = k.trim(); const n = Number(v);
      if (name && Number.isFinite(n)) m.set(name, n);
    }
  }
  return m;
}
// Curva padrão (fórmula em n): validada por compileFormula; inválida → curva embutida.
function parseLevelCurve(raw: unknown): string {
  if (typeof raw === "string" && raw.trim() && compileFormula(raw.trim(), ["n"])) return raw.trim();
  return DEFAULT_LEVEL_CURVE;
}
// Lê os nomes de projeto (strings únicas, não-vazias).
function parseRulesProjects(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    const name = typeof r === "string" ? r.trim() : "";
    if (!name || seen.has(name)) continue;
    seen.add(name); out.push(name);
  }
  return out;
}
// Lê as etiquetas: "nome" ou { name, color }. Cor só se for um nome de paleta do Todoist válido.
function parseRulesLabels(raw: unknown): RulesLabel[] {
  if (!Array.isArray(raw)) return [];
  const out: RulesLabel[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    let name = "", color: string | undefined;
    if (typeof r === "string") name = r.trim();
    else if (r && typeof r === "object") {
      const o = r as Record<string, unknown>;
      name = typeof o.name === "string" ? o.name.trim() : "";
      if (typeof o.color === "string" && o.color.trim() in TODOIST_COLORS) color = o.color.trim();
    }
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(color ? { name, color } : { name });
  }
  return out;
}
// Valida um array cru de metas (id único, título, período/métrica conhecidos, target > 0). Inválidas → descartadas.
function parseGoals(raw: unknown): GameGoal[] {
  if (!Array.isArray(raw)) return [];
  const out: GameGoal[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const period = typeof o.period === "string" ? o.period : "";
    const metric = typeof o.metric === "string" ? o.metric : "";
    const target = Number(o.target);
    if (!id || seen.has(id) || !title || !GOAL_PERIODS.includes(period as GoalPeriod)
      || (metric !== "xp" && metric !== "tasks") || !Number.isFinite(target) || target <= 0) continue;
    seen.add(id);
    const g: GameGoal = { id, title, period: period as GoalPeriod, metric: metric as GoalMetric, target };
    if (typeof o.project === "string" && o.project.trim()) g.project = o.project.trim();
    if (typeof o.label === "string" && o.label.trim()) g.label = o.label.trim();
    out.push(g);
  }
  return out;
}
// Lê o 1º bloco ```json da nota de Regras. Aceita o objeto completo ou, por retrocompat, um array
// (= só conquistas). Sem bloco válido → null (usa os padrões embutidos).
function parseGameRules(content: string): GameRules | null {
  const m = content.match(/```json\s*\r?\n([\s\S]*?)```/);
  if (!m) return null;
  let raw: unknown;
  try { raw = JSON.parse(m[1]); } catch { return null; }
  if (Array.isArray(raw)) {
    const ach = parseAchievementList(raw);
    if (!ach.length) return null;
    const r = defaultRules(); r.achievements = ach; return r;
  }
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const ach = parseAchievementList(o.achievements);
  const goals = parseGoals(o.goals);
  return {
    projects: parseRulesProjects(o.projects),
    labels: parseRulesLabels(o.labels),
    xpByPriority: parseXpByPriority(o.xpByPriority),
    xpByLabel: parseXpByLabel(o.xpByLabel),
    levelCurve: parseLevelCurve(o.levelCurve),
    scopeLevels: parseScopeLevels(o.scopeLevels),
    achievements: ach.length ? ach : DEFAULT_ACHIEVEMENTS,   // identidade preservada → isCustomAchievements()
    goals: goals.length ? goals : DEFAULT_GOALS,
  };
}
function scopeLevelDefToJson(def: ScopeLevelDef): unknown {
  return def.kind === "table" ? { thresholds: def.thresholds } : { levels: def.levels, curve: def.curve };
}
// Objeto JSON canônico das Regras (mesma forma que o parser lê) — reusado pelo builder e pela edição cirúrgica.
function rulesToJsonObj(rules: GameRules): Record<string, unknown> {
  const lvlMap = (m: Map<string, ScopeLevelDef>) => Object.fromEntries([...m].map(([k, v]) => [k, scopeLevelDefToJson(v)]));
  return {
    projects: rules.projects,
    labels: rules.labels,
    xpByPriority: rules.xpByPriority,
    xpByLabel: Object.fromEntries(rules.xpByLabel),
    levelCurve: rules.levelCurve,
    scopeLevels: { projects: lvlMap(rules.scopeLevels.projects), labels: lvlMap(rules.scopeLevels.labels) },
    achievements: rules.achievements.map(a => ({ id: a.id, cat: a.cat, title: a.title, desc: a.desc, icon: a.icon, metric: a.metric, goal: a.goal })),
    goals: rules.goals.map(g => ({ id: g.id, title: g.title, period: g.period, metric: g.metric, target: g.target,
      ...(g.project ? { project: g.project } : {}), ...(g.label ? { label: g.label } : {}) })),
  };
}
// Troca o corpo do 1º bloco ```json preservando o resto da nota (prosa do usuário). null se não houver bloco.
function replaceFirstJsonBlock(content: string, json: string): string | null {
  if (!/```json\s*\r?\n[\s\S]*?```/.test(content)) return null;
  return content.replace(/```json\s*\r?\n[\s\S]*?```/, () => "```json\n" + json + "\n```");
}
// Conteúdo inicial da nota (auto-documentada): referência completa de cada campo + tabelas + o JSON atual.
function buildGameRulesContent(rules: GameRules): string {
  const rows = (Object.keys(METRIC_LABELS) as MetricId[]).map(k => `| \`${k}\` | ${METRIC_LABELS[k]} |`).join("\n");
  const colors = Object.keys(TODOIST_COLORS).join(", ");
  const json = JSON.stringify(rulesToJsonObj(rules), null, 2);
  return [
    "---", "owner: Werus", "permissions:", "  read: [all]", "  write:", "    - Werus", "    - Claude",
    "reviewed: false", "type: reference", "tags: [gamificacao, regras]", "---", "",
    "# Gamificação — Regras (configuração)", "",
    "> Arquivo **lido pelo plugin Werus Dashboard**. Edite o bloco `json` no fim e recarregue (Ctrl+R).",
    "> Bloco vazio/inválido → o plugin usa os padrões embutidos. **Compartilhe esta nota** para distribuir",
    "> um \"jogo\" inteiro (projetos, etiquetas, XP, níveis, conquistas e metas).", "",
    "## Como funciona", "",
    "- **XP por tarefa** = `xpByPriority[prioridade]` + soma dos `xpByLabel` das etiquetas da tarefa (mínimo 0).",
    "- **\"Salvar concluídas\"** (aba Gamificação) registra as tarefas feitas no log e dá o XP; o botão **✗ não feita** desconta (penalidade nas Configurações).",
    "- **Nível** = derivado do XP acumulado pela curva `levelCurve` (geral) ou pela definição do escopo em `scopeLevels`.",
    "- A aba mostra: nível geral, **metas** do período, gráfico de XP, **escopos** (projetos/etiquetas) e **conquistas**.",
    "- Toda entrada inválida é **ignorada** (o resto continua valendo). O lápis (✏️) na aba abre esta nota.", "",
    "## Campos do JSON", "",
    "### `projects` — lista de texto", "",
    "Nomes dos projetos do jogo. O botão **Provisionar Todoist** (Configurações) cria no Todoist os que faltam; na aba, um escopo que só existe no Todoist ganha o botão **+ Cofre** para entrar aqui.",
    "Ex.: `[\"Estudos\", \"Trabalho\"]`", "",
    "### `labels` — lista", "",
    "Etiquetas do jogo. Cada item é `\"nome\"` **ou** `{ \"name\": \"nome\", \"color\": \"blue\" }` (a cor é usada ao criar no Todoist).",
    "Cores válidas: " + colors + ".",
    "Ex.: `[{ \"name\": \"foco\", \"color\": \"blue\" }, \"urgente\"]`", "",
    "### `xpByPriority` — objeto", "",
    "XP ganho por prioridade da tarefa (`p1` = mais alta/urgente … `p4` = padrão). O que faltar usa o padrão `p1 8 · p2 5 · p3 3 · p4 1`. Valores ≥ 0.",
    "Ex.: `{ \"p1\": 10, \"p2\": 5, \"p3\": 3, \"p4\": 1 }`", "",
    "### `xpByLabel` — objeto", "",
    "Bônus de XP **somado** por etiqueta presente na tarefa (pode ser negativo para penalizar). Etiquetas fora da lista somam 0.",
    "Ex.: `{ \"foco\": 2, \"chato\": -3 }` → uma `p1` com `@foco` rende `8 + 2 = 10` XP.", "",
    "### `levelCurve` — texto (fórmula)", "",
    "Fórmula do XP **cumulativo** para alcançar o nível `n`. Vale para o nível **geral** e para qualquer escopo sem entrada em `scopeLevels`.",
    "- Variável: `n` (número do nível, ≥ 1). Operadores: `+` `-` `*` `/` `%` `^` (potência) e parênteses `( )`.",
    "- Padrão `100 * n^2` (equivale ao antigo ⌊√(XP/100)⌋, **sem teto**).",
    "- O nível é o **maior `n`** cujo limiar é `≤` ao XP acumulado. Com `100*n^2`: 100 XP → Nv 1, 400 → Nv 2, 900 → Nv 3.",
    "Ex.: `\"50 * n\"` (linear) · `\"100 * n^1.5\"` · `\"200 + 50 * n^2\"`.", "",
    "### `scopeLevels` — objeto", "",
    "Níveis **próprios** por projeto/etiqueta (sobrepõem `levelCurve`). Dois sub-objetos, `projects` e `labels`, mapeando nome → definição. Duas formas:",
    "- **Fórmula com teto:** `{ \"levels\": 100, \"curve\": \"50 * n\" }` — gera 100 níveis pela fórmula; o nível 100 é o teto.",
    "- **Tabela explícita:** `{ \"thresholds\": [30, 80, 150, 250] }` — XP cumulativo de cada nível (em ordem crescente). Aqui o escopo tem 4 níveis. No teto, a barra fica cheia e o escopo mostra **\"máx\"**.",
    "Ex.:",
    "```",
    "\"scopeLevels\": {",
    "  \"projects\": { \"Estudos\": { \"thresholds\": [30, 80, 150, 250] } },",
    "  \"labels\":   { \"foco\": { \"levels\": 10, \"curve\": \"50 * n\" } }",
    "}",
    "```", "",
    "### `achievements` — lista de badges (permanentes)", "",
    "| campo | o quê |", "|---|---|",
    "| `id` | identificador único |",
    "| `title` | nome exibido |",
    "| `desc` | descrição (tooltip) |",
    "| `icon` | ícone **Lucide** (ex.: `star`, `flame`, `trophy`, `medal`, `crown`, `zap`, `sun`, `folder`, `tag`) — ver lucide.dev |",
    "| `cat` | categoria (vira cabeçalho na UI) |",
    "| `metric` | o que mede (tabela de métricas abaixo) |",
    "| `goal` | desbloqueia quando a métrica ≥ goal (fica permanente) |",
    "Ex.: `{ \"id\":\"lvl5\", \"cat\":\"Nível\", \"title\":\"Aprendiz\", \"desc\":\"Alcance o nível 5\", \"icon\":\"star\", \"metric\":\"level\", \"goal\":5 }`",
    "Lista vazia → usa as conquistas padrão embutidas.", "",
    "**Métricas disponíveis (para `achievements`):**", "", "| metric | mede |", "|---|---|", rows, "",
    "### `goals` — metas do período (resetam sozinhas)", "",
    "O progresso vem das tarefas **feitas** no período atual; ao virar o período, recomeça.",
    "| campo | o quê |", "|---|---|",
    "| `id` | identificador único |",
    "| `title` | nome exibido |",
    "| `period` | `day` (hoje) · `week` (semana, começa na segunda) · `month` (mês) · `year` (ano) |",
    "| `metric` | `xp` (soma de XP) ou `tasks` (nº de tarefas concluídas) |",
    "| `target` | alvo a alcançar (> 0) |",
    "| `project` | _(opcional)_ conta só tarefas deste projeto |",
    "| `label` | _(opcional)_ conta só tarefas com esta etiqueta |",
    "Ex.: `{ \"id\":\"foco-sem\", \"title\":\"Foco da semana\", \"period\":\"week\", \"metric\":\"tasks\", \"target\":10, \"label\":\"foco\" }`",
    "Lista vazia → usa as metas padrão embutidas.", "",
    "## Observações", "",
    "- O XP de tarefas **já registradas** no log não muda ao alterar `xpByPriority`/`xpByLabel` (o XP é carimbado na hora da conclusão); a mudança vale para as próximas.",
    "- A sintaxe de fórmula é aritmética **segura** (sem código executável): apenas `n`, números e `+ - * / % ^ ( )`.",
    "- Penalidades (\"não feita\") **não** contam para as metas.", "",
    "## Configuração atual", "",
    "```json", json, "```", "",
  ].join("\n");
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

  // Nome do projeto pelo id (reusado pela Gamificação). Vazio se desconhecido.
  projectName(id?: string): string { return (id && this.projectMap.get(id)) || ""; }
  // Nomes de projetos/etiquetas que existem hoje no Todoist (para sinalizar os que sumiram).
  knownProjects(): Set<string> { return new Set(this.projectMap.values()); }
  knownLabels(): Set<string> { return new Set(this.labelColors.keys()); }
  hasData(): boolean { return this.fetchedAt > 0; }   // já houve um fetch (online) → known* confiáveis

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
    clickable(check, e => { e.stopPropagation(); void this.completeTask(t); });
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
    if (this.plugin.settings.gamificationEnabled) {
      const x = row.createSpan({ cls: "wd-todo-undone" });
      setIcon(x, "x");
      x.setAttr("title", "Não feita — punição de XP e apaga do Todoist");
      clickable(x, e => { e.stopPropagation(); void this.plugin.game.markUndone(t); });
    }
    clickable(row, () => this.openTaskDetail(t));
    this.attachTaskTip(row, t);
  }

  private addTaskBtn(host: HTMLElement, prefillDue?: string, title = "Nova tarefa") {
    const b = host.createSpan({ cls: "wd-todo-add" });
    setIcon(b, "plus");
    b.setAttr("title", title);
    clickable(b, e => { e.stopPropagation(); this.openTaskForm({ mode: "create", prefillDue }); });
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
          text: (it.priority > 1 ? `[${priMeta(it.priority).label}] ` : "") + it.title,
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
      for (const { title, labels, priority } of items) {
        try {
          const fields: TodoistWrite = { content: title, due_date: due };
          if (pkg.projectId) fields.project_id = pkg.projectId;
          if (labels.length) fields.labels = labels;
          if (priority > 1) fields.priority = priority;
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
      if (!disabled) clickable(btn, () => void this.launchPackage(pkg));
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
        chip.setAttr("aria-pressed", String(on));
        clickable(chip, async () => { this.toggleFilter("projects", p.id); await this.plugin.saveSettings(); this.rerenderAll(); });
      }
    }
    const labels = [...new Set(this.tasks.flatMap(t => t.labels ?? []))].sort((a, b) => a.localeCompare(b));
    if (labels.length) {
      const grp = bar.createDiv({ cls: "wd-todo-fgroup" });
      grp.createSpan({ cls: "wd-todo-flabel", text: "Etiquetas" });
      for (const l of labels) {
        const on = f.labels.includes(l);
        const chip = this.labelChip(grp, l, "wd-todo-fchip" + (on ? " wd-on" : ""));
        chip.setAttr("aria-pressed", String(on));
        clickable(chip, async () => { this.toggleFilter("labels", l); await this.plugin.saveSettings(); this.rerenderAll(); });
      }
    }
    if (f.projects.length || f.labels.length) {
      const clr = bar.createSpan({ cls: "wd-todo-fclear", text: "limpar filtros" });
      clickable(clr, async () => { f.projects = []; f.labels = []; await this.plugin.saveSettings(); this.rerenderAll(); });
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
        b.setAttr("aria-pressed", String(range === n));
        clickable(b, async e => {
          e.stopPropagation();
          this.plugin.settings.todoistDayRange = n;
          await this.plugin.saveSettings();
          this.rerenderAll();
        });
      }
      const f = this.plugin.settings.todoistFilters;
      const nF = f.projects.length + f.labels.length;
      const filt = ctrls.createSpan({ cls: "wd-todo-filterbtn" + (this.filterOpen ? " wd-on" : "") + (nF ? " wd-active" : "") });
      setIcon(filt, "filter");
      filt.setAttr("title", nF ? `Filtros ativos (${nF}) — clique para ajustar` : "Filtrar por projeto/etiqueta");
      if (nF) filt.createSpan({ cls: "wd-todo-filtct", text: String(nF) });
      filt.setAttr("aria-pressed", String(this.filterOpen));
      clickable(filt, e => { e.stopPropagation(); this.filterOpen = !this.filterOpen; this.rerenderAll(); });
      const refresh = ctrls.createSpan({ cls: "wd-todo-refresh" + (this.loading ? " wd-spin" : "") });
      setIcon(refresh, "refresh-cw");
      refresh.setAttr("title", "Atualizar tarefas do Todoist");
      clickable(refresh, e => { e.stopPropagation(); void this.fetch(true); });
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
      lhd.setAttr("aria-expanded", String(this.laterOpen));
      clickable(lhd, () => { this.laterOpen = !this.laterOpen; this.rerenderAll(); });
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
      nhd.setAttr("aria-expanded", String(this.noDateOpen));
      clickable(nhd, () => { this.noDateOpen = !this.noDateOpen; this.rerenderAll(); });
      if (this.noDateOpen) {
        const list = panel.createDiv({ cls: "wd-todo-olist" });
        for (const t of noDate) this.todoRow(list, t);
      }
    }
  }
}

// Uma ocorrência concluída é recorrente? (não pode ser apagada — quebraria a recorrência)
function isRecurringCompleted(t: TodoistTask): boolean {
  return t.due?.is_recurring === true;
}

// ── Gamificação: controlador único (dono no plugin, compartilhado view↔faixa) ──
class GameController {
  private events: GameEvent[] = [];
  private loaded = false;
  private rules: GameRules | null = null;   // regras vindas da nota (null = padrões embutidos)
  private busy = false;                 // colheita/markUndone em andamento
  private pending: TodoistTask[] = [];  // concluídas na API ainda não no log (live)
  private pendingXp = 0;
  private lastBarPct = 0;               // último % da barra (p/ animar do valor anterior)
  private lastLevel = 0;
  private newAch = new Set<string>();   // conquistas recém-desbloqueadas (mostra "novo!" até a aba ser vista)
  private subs = new Set<() => void>();

  constructor(private app: App, private plugin: WerusDashboard) {}

  subscribe(cb: () => void): () => void { this.subs.add(cb); return () => { this.subs.delete(cb); }; }
  rerenderAll() { for (const cb of this.subs) cb(); }

  private logFile(): TFile | null {
    const f = this.app.vault.getAbstractFileByPath(GAME_LOG_PATH);
    return f instanceof TFile ? f : null;
  }
  private rulesPath(): string { return this.plugin.settings.gameRulesPath; }
  invalidate() { this.loaded = false; }
  async ensureLoaded() {
    if (this.loaded) return;
    const f = this.logFile();
    this.events = f ? parseGameLog(await this.app.vault.read(f)) : [];
    let cf = this.app.vault.getAbstractFileByPath(this.rulesPath());
    // Migração 1x: nota antiga só-de-conquistas → lê como Regras (mesmo parser aceita o array legado).
    if (!(cf instanceof TFile)) cf = this.app.vault.getAbstractFileByPath(LEGACY_ACH_PATH);
    this.rules = cf instanceof TFile ? parseGameRules(await this.app.vault.read(cf)) : null;
    this.loaded = true;
  }
  // Lista efetiva de conquistas: a da nota do cofre (se válida), senão a padrão embutida.
  achievements(): Achievement[] { return this.rules?.achievements ?? DEFAULT_ACHIEVEMENTS; }
  isCustomAchievements(): boolean { return !!this.rules && this.rules.achievements !== DEFAULT_ACHIEVEMENTS; }
  goals(): GameGoal[] { return this.rules?.goals ?? DEFAULT_GOALS; }
  // XP de uma tarefa: prioridade + Σ(bônus das etiquetas). Clampa ≥ 0 (config é responsável).
  taskXp(t: TodoistTask): number {
    const xpPri = this.rules?.xpByPriority ?? DEFAULT_XP_BY_PRI;
    const xpLab = this.rules?.xpByLabel;
    let xp = xpPri[priKey(t.priority)] ?? 0;
    if (xpLab) for (const l of t.labels ?? []) xp += xpLab.get(l) ?? 0;
    return Math.max(0, xp);
  }
  // Projetos/etiquetas declarados nas Regras (para o botão Provisionar Todoist).
  provisionLists(): { projects: string[]; labels: RulesLabel[] } {
    return { projects: this.rules?.projects ?? [], labels: this.rules?.labels ?? [] };
  }
  // Abre a nota de Regras (cria, já preenchida com os padrões, se ainda não existir).
  async openGameRules() {
    const path = this.rulesPath();
    let f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) {
      const slash = path.lastIndexOf("/");
      const folder = slash > 0 ? path.slice(0, slash) : "";
      if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
        try { await this.app.vault.createFolder(folder); } catch { /* já existe */ }
      }
      await this.ensureLoaded();   // semeia com as regras vigentes (migra a nota antiga, se houver)
      f = await this.app.vault.create(path, buildGameRulesContent(this.rules ?? defaultRules()));
      this.invalidate(); await this.ensureLoaded(); this.rerenderAll();   // passa a ler do novo caminho
    }
    if (f instanceof TFile) await this.app.workspace.getLeaf(false).openFile(f);
  }
  // Reescreve a nota com a documentação completa, mantendo a configuração (o JSON). Se não existir, cria.
  async regenerateRulesDoc() {
    const path = this.rulesPath();
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) { await this.openGameRules(); return; }
    const rules = parseGameRules(await this.app.vault.read(f)) ?? defaultRules();
    const ok = await confirmModal(this.app, {
      title: "Regenerar documentação?",
      body: "Reescreve a nota de Regras com a documentação completa, mantendo a sua configuração (o JSON). Texto adicionado à mão na nota será perdido.",
      cta: "Regenerar",
    });
    if (!ok) return;
    await this.app.vault.modify(f, buildGameRulesContent(rules));
    this.invalidate(); await this.ensureLoaded(); this.rerenderAll();
    await this.app.workspace.getLeaf(false).openFile(f);
    new Notice("Documentação das Regras atualizada (configuração preservada).");
  }
  stats(): GameStats { return computeGameStats(this.events, this.rules ?? undefined); }

  private async writeLog() {
    const content = buildGameLogContent(this.events);
    const f = this.logFile();
    if (f) { await this.app.vault.modify(f, content); return; }
    const slash = GAME_LOG_PATH.lastIndexOf("/");
    const folder = slash > 0 ? GAME_LOG_PATH.slice(0, slash) : "";
    if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
      try { await this.app.vault.createFolder(folder); } catch { /* já existe */ }
    }
    await this.app.vault.create(GAME_LOG_PATH, content);
  }

  // Anexa eventos novos (dedup por chave). Devolve quantos entraram.
  private async appendEvents(evs: GameEvent[]): Promise<number> {
    await this.ensureLoaded();
    const keys = new Set(this.events.map(e => e.key));
    const add = evs.filter(e => !keys.has(e.key));
    if (!add.length) return 0;
    this.events.push(...add);
    await this.writeLog();
    this.rerenderAll();
    return add.length;
  }

  private projName(t: TodoistTask): string {
    return this.plugin.todo.projectName(t.project_id) || (t.project_id ?? "");
  }
  private doneEvent(t: TodoistTask): GameEvent {
    const at = t.completed_at ?? new Date().toISOString();
    return { date: toKey(new Date(at)), type: "feito", xp: this.taskXp(t),
      key: `${t.id}|${at}`, content: t.content, project: this.projName(t), labels: t.labels ?? [], pri: t.priority };
  }

  // Janela do fetch: desde a última colheita (−2d de margem) ou backfill na 1ª vez.
  private harvestSince(): string {
    const last = this.plugin.settings.gameLastHarvest;
    if (last && /^\d{4}-\d{2}-\d{2}$/.test(last))
      return toKey(new Date(Date.parse(last + "T00:00:00") - 2 * 86400000));
    return toKey(new Date(Date.now() - HARVEST_BACKFILL_DAYS * 86400000));
  }
  // `until` = AMANHÃ (local). completed_at da API é UTC: à noite no BRT, a conclusão de
  // hoje já é "amanhã" em UTC → com until=hoje ela cairia fora da janela.
  private harvestUntil(): string { return toKey(new Date(Date.now() + 86400000)); }

  // "Não feito": punição (−base×fator) → log → apaga do Todoist.
  async markUndone(t: TodoistTask) {
    if (this.busy) return;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) { new Notice("Configure o token do Todoist."); return; }
    const penalty = Math.max(1, Math.round(this.taskXp(t) * this.plugin.settings.gamePenaltyFactor));
    const recurring = isRecurringCompleted(t);
    const ok = await confirmModal(this.app, {
      title: "Marcar como não feita?",
      body: recurring
        ? `"${t.content}" é recorrente — você perde ${penalty} XP, mas a tarefa NÃO é apagada (apagar quebraria a recorrência).`
        : `"${t.content}" — você perde ${penalty} XP e a tarefa é apagada do Todoist (irreversível).`,
      cta: `Não feita (−${penalty} XP)`,
    });
    if (!ok) return;
    this.busy = true; this.rerenderAll();
    try {
      await this.appendEvents([{ date: toKey(new Date()), type: "nao-feito", xp: -penalty,
        key: `${t.id}|${Date.now()}`, content: t.content, project: this.projName(t), labels: t.labels ?? [], pri: t.priority }]);
      if (!recurring) await deleteTodoistTask(token, t.id);
      new Notice(`✗ Não feita: ${t.content} (−${penalty} XP)`);
      await this.plugin.todo.fetch(true);
    } catch (e) {
      new Notice(`Falha: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      this.busy = false; this.rerenderAll();
    }
  }

  // Colhe concluídas → log; apaga do Todoist só as NÃO-recorrentes.
  async harvest() {
    if (this.busy) return;
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) { new Notice("Configure o token do Todoist."); return; }
    this.busy = true; this.rerenderAll();
    try {
      await this.ensureLoaded();
      const today = toKey(new Date());
      const completed = await fetchCompletedTasks(token, this.harvestSince(), this.harvestUntil());
      const keys = new Set(this.events.map(e => e.key));
      const fresh = completed.filter(t => !keys.has(`${t.id}|${t.completed_at ?? ""}`));
      if (!fresh.length) {
        this.plugin.settings.gameLastHarvest = today; await this.plugin.saveSettings();
        this.pending = []; this.pendingXp = 0;
        new Notice("Nada novo para salvar. 👍");
        return;
      }
      const deletable = fresh.filter(t => !isRecurringCompleted(t));
      const recurring = fresh.length - deletable.length;
      const totalXp = fresh.reduce((s, t) => s + this.taskXp(t), 0);
      const ok = await confirmModal(this.app, {
        title: `Salvar ${fresh.length} tarefa(s) concluída(s)?`,
        body: `+${totalXp} XP no log. ${deletable.length} apagada(s) do Todoist` +
          (recurring ? ` · ${recurring} recorrente(s) ficam (apagar quebraria a recorrência).` : "."),
        items: fresh.slice(0, 30).map(t => ({ text: `+${this.taskXp(t)} · ${t.content}` })),
        cta: `Salvar e apagar ${deletable.length}`,
      });
      if (!ok) return;
      await this.appendEvents(fresh.map(t => this.doneEvent(t)));
      let del = 0;
      for (const t of deletable) {
        try { await deleteTodoistTask(token, t.id); del++; } catch { /* segue */ }
      }
      this.plugin.settings.gameLastHarvest = today; await this.plugin.saveSettings();
      this.pending = []; this.pendingXp = 0;
      new Notice(`✓ ${fresh.length} salva(s) (+${totalXp} XP) · ${del} apagada(s)`);
      await this.plugin.todo.fetch(true);
    } catch (e) {
      new Notice(`Falha ao salvar: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      this.busy = false; this.rerenderAll();
    }
  }

  // Conta quantas concluídas estão pendentes de salvar (live, sem apagar nada).
  async refreshPending() {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) return;
    try {
      await this.ensureLoaded();
      const completed = await fetchCompletedTasks(token, this.harvestSince(), this.harvestUntil());
      const keys = new Set(this.events.map(e => e.key));
      this.pending = completed.filter(t => !keys.has(`${t.id}|${t.completed_at ?? ""}`));
      this.pendingXp = this.pending.reduce((s, t) => s + this.taskXp(t), 0);
      this.rerenderAll();
    } catch { /* silencioso */ }
  }

  // Painel compartilhado: dashboard (faixa, ctrls sem colheita) e aba (full).
  renderPanel(host: HTMLElement, ctrls: HTMLElement | null, opts: { full?: boolean; phone?: boolean } = {}) {
    const s = this.stats();
    this.syncAchievements(s);   // detecta/persiste desbloqueios mesmo só com a faixa do dashboard aberta
    const token = this.plugin.settings.todoistToken.trim();
    if (opts.full && ctrls && token) {
      const save = ctrls.createSpan({ cls: "wd-game-harvest" + (this.busy ? " wd-game-busy" : "") });
      setIcon(save.createSpan({ cls: "wd-game-harvest-ico" }), "download");
      save.createSpan({ text: this.busy ? "Salvando…" : "Salvar concluídas" });
      if (this.pending.length) save.createSpan({ cls: "wd-game-pend", text: `+${this.pendingXp}` });
      save.setAttr("title", this.pending.length
        ? `${this.pending.length} concluída(s) aguardando salvar (+${this.pendingXp} XP)`
        : "Buscar tarefas concluídas, salvar no log e limpar do Todoist");
      if (!this.busy) clickable(save, () => void this.harvest());
    }

    const lvl = host.createDiv({ cls: "wd-game-level" });
    lvl.createSpan({ cls: "wd-game-lvlnum", text: `Nível ${s.level}` });
    lvl.createSpan({ cls: "wd-game-xp", text: `${s.totalXp} XP` });
    const bar = host.createDiv({ cls: "wd-game-bar" });
    const fill = bar.createDiv({ cls: "wd-game-bar-fill" });
    const pct = s.xpForNext ? Math.min(100, Math.round(s.xpIntoLevel / s.xpForNext * 100)) : 0;
    // Anima do último % exibido até o novo; em level-up, enche do zero.
    fill.style.width = `${s.level > this.lastLevel ? 0 : this.lastBarPct}%`;
    void fill.offsetWidth;                         // reflow → a transição CSS parte do valor anterior
    fill.style.width = `${pct}%`;
    this.lastBarPct = pct; this.lastLevel = s.level;
    bar.setAttr("title", `${s.xpIntoLevel}/${s.xpForNext} XP para o nível ${s.level + 1}`);
    host.createDiv({ cls: "wd-game-next",
      text: `faltam ${Math.max(0, s.xpForNext - s.xpIntoLevel)} XP para o nível ${s.level + 1}` });

    const grid = host.createDiv({ cls: "wd-game-metrics" });
    const metric = (icon: string, val: string, label: string, cls = "") => {
      const c = grid.createDiv({ cls: "wd-game-metric " + cls });
      const v = c.createDiv({ cls: "wd-game-metric-val" });
      setIcon(v.createSpan({ cls: "wd-game-metric-ico" }), icon);
      v.createSpan({ text: val });
      c.createDiv({ cls: "wd-game-metric-lbl", text: label });
    };
    metric("flame", String(s.streakCurrent), `streak · recorde ${s.streakBest}`, s.streakCurrent ? "wd-game-streak-on" : "");
    metric("zap", `${s.todayXp >= 0 ? "+" : ""}${s.todayXp}`, `XP hoje · ${s.todayCount} feita(s)`);

    if (opts.full && this.pending.length)
      host.createDiv({ cls: "wd-game-hint", text:
        `${this.pending.length} concluída(s) aguardando salvar (+${this.pendingXp} XP) — clique em "Salvar concluídas".` });

    if (opts.full) this.renderGoals(host);
    if (opts.full) this.renderXpChart(host, s, !!opts.phone);
    if (opts.full) this.renderXpFormula(host);
    if (opts.full) this.renderScopes(host, s);
    if (opts.full) this.renderAchievements(host, s);
  }

  // Metas (só na aba): alvo do período atual, com barra de progresso. Editáveis na nota de Regras.
  private renderGoals(host: HTMLElement) {
    const goals = this.goals();
    if (!goals.length) return;
    const now = new Date();
    const sec = host.createDiv({ cls: "wd-game-goalsec" });
    sec.createDiv({ cls: "wd-game-chart-title", text: "Metas" });
    for (const g of goals) {
      const st = goalProgress(this.events, g, now);
      const item = sec.createDiv({ cls: "wd-game-goal" + (st.done ? " wd-game-goal-done" : "") });
      const head = item.createDiv({ cls: "wd-game-scope-head" });
      const left = head.createDiv({ cls: "wd-game-scope-left" });
      left.createSpan({ cls: "wd-game-scope-name", text: g.title });
      const scope = g.project ? g.project : g.label ? "@" + g.label : "";
      left.createSpan({ cls: "wd-game-goal-sub", text: GOAL_PERIOD_LABELS[g.period] + (scope ? " · " + scope : "") });
      const unit = g.metric === "xp" ? "XP" : "feitas";
      head.createSpan({ cls: "wd-game-scope-meta", text: `${st.current}/${g.target} ${unit}` + (st.done ? " ✓" : "") });
      const bar = item.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
      bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${st.pct}%`;
      bar.setAttr("title", st.done ? "Meta concluída!" : `${st.current}/${g.target} ${unit} ${GOAL_PERIOD_LABELS[g.period]}`);
    }
  }

  // Marca conquistas recém-desbloqueadas: grava a data (permanente) e sinaliza "novo!".
  private syncAchievements(s: GameStats) {
    const saved = this.plugin.settings.gameAchievements;
    let changed = false;
    for (const a of this.achievements()) {
      if (!saved[a.id] && metricValue(a.metric, s) >= a.goal) {
        saved[a.id] = toKey(new Date());
        this.newAch.add(a.id);
        changed = true;
      }
    }
    if (changed) void this.plugin.saveSettings();
  }

  // Conquistas (só na aba): grid de badges — desbloqueadas coloridas + data; bloqueadas
  // em cinza com a condição e o progresso (decisão do Werus: mostrar bloqueadas).
  private renderAchievements(host: HTMLElement, s: GameStats) {
    const list = this.achievements();
    const states = list.map(a => evalAchievement(a, s));
    const unlocked = states.filter(x => x.unlocked).length;
    const sec = host.createDiv({ cls: "wd-game-achsec" });
    const hd = sec.createDiv({ cls: "wd-game-charthd" });
    hd.createDiv({ cls: "wd-game-chart-title", text: "Conquistas" });
    const right = hd.createDiv({ cls: "wd-game-ach-hd-right" });
    right.createSpan({ cls: "wd-game-ach-count" + (this.isCustomAchievements() ? " wd-game-ach-custom" : ""),
      text: `${unlocked}/${list.length}` });
    const edit = right.createSpan({ cls: "wd-view-btn wd-game-ach-edit" });
    setIcon(edit, "pencil");
    edit.setAttr("title", "Editar regras — abre a nota com o bloco JSON (projetos, etiquetas, XP, níveis, conquistas)"
      + (this.isCustomAchievements() ? " (lista personalizada ativa)" : ""));
    clickable(edit, () => void this.openGameRules());
    const grid = sec.createDiv({ cls: "wd-game-ach-grid" });
    for (const st of states) {
      const date = this.plugin.settings.gameAchievements[st.a.id];
      const isNew = this.newAch.has(st.a.id);
      const cell = grid.createDiv({ cls: "wd-game-ach"
        + (st.unlocked ? " wd-game-ach-on" : "") + (isNew ? " wd-game-ach-new" : "") });
      setIcon(cell.createDiv({ cls: "wd-game-ach-ico" }), st.a.icon);
      cell.createDiv({ cls: "wd-game-ach-title", text: st.a.title });
      if (st.unlocked) {
        cell.createDiv({ cls: "wd-game-ach-sub", text: date ? `✓ ${date}` : "✓" });
      } else {
        cell.createDiv({ cls: "wd-game-ach-sub", text: `${Math.min(st.value, st.a.goal)}/${st.a.goal}` });
        const bar = cell.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
        bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${st.pct}%`;
      }
      cell.setAttr("title", `${st.a.desc}` + (st.unlocked
        ? (date ? ` · desbloqueada em ${date}` : " · desbloqueada")
        : ` · ${Math.min(st.value, st.a.goal)}/${st.a.goal}`));
      if (isNew) cell.createSpan({ cls: "wd-game-ach-newbadge", text: "novo!" });
    }
    this.newAch.clear();   // "novo!" aparece uma vez por visualização da aba
  }

  // Fórmula visual do XP por tarefa (estilo Notion): prioridade + Σ(etiquetas), com os valores vigentes.
  private renderXpFormula(host: HTMLElement) {
    const pri = this.rules?.xpByPriority ?? DEFAULT_XP_BY_PRI;
    const labs = [...(this.rules?.xpByLabel ?? new Map())].filter(([, v]) => v !== 0);
    const sec = host.createDiv({ cls: "wd-game-formula" });
    sec.createSpan({ cls: "wd-game-formula-eq", text: "XP por tarefa = prioridade + Σ etiquetas" });
    const parts = sec.createDiv({ cls: "wd-game-formula-parts" });
    const chip = (text: string) => parts.createSpan({ cls: "wd-game-formula-chip", text });
    chip(`p1 ${pri.p1}`); chip(`p2 ${pri.p2}`); chip(`p3 ${pri.p3}`); chip(`p4 ${pri.p4}`);
    for (const [name, v] of labs) chip(`@${name} ${v >= 0 ? "+" : ""}${v}`);
  }

  // Escopos (projetos/etiquetas): lista única com selos de origem (Cofre/Todoist/Hist) + nível,
  // e botão de ação na divergência (apagar histórico órfão / adicionar ao cofre / adicionar ao Todoist).
  private renderScopes(host: HTMLElement, s: GameStats) {
    this.renderScopeSection(host, "Projetos", "project", s.byProject, s.byProjectInfo,
      new Set(this.rules?.projects ?? []), this.plugin.todo.knownProjects(), "");
    this.renderScopeSection(host, "Etiquetas", "label", s.byLabel, s.byLabelInfo,
      new Set((this.rules?.labels ?? []).map(l => l.name)), this.plugin.todo.knownLabels(), "@");
  }
  private renderScopeSection(host: HTMLElement, title: string, kind: "project" | "label",
    xpMap: Map<string, number>, infoMap: Map<string, LevelInfo>,
    registered: Set<string>, known: Set<string>, prefix: string) {
    const todoReady = this.plugin.todo.hasData();
    const names = new Set<string>();
    for (const n of registered) names.add(n);
    if (todoReady) for (const n of known) names.add(n);
    for (const n of xpMap.keys()) if (n !== "—") names.add(n);
    if (!names.size) return;
    const rows = [...names].map(name => ({
      name, xp: xpMap.get(name) ?? 0, info: infoMap.get(name),
      inCofre: registered.has(name),
      inTodo: todoReady ? known.has(name) : null as boolean | null,
      inHist: xpMap.has(name),
    })).sort((a, b) => (b.xp - a.xp) || a.name.localeCompare(b.name));
    const sec = host.createDiv({ cls: "wd-game-scopesec" });
    sec.createDiv({ cls: "wd-game-chart-title", text: title });
    const noun = kind === "project" ? "projeto" : "etiqueta";
    for (const r of rows) {
      const item = sec.createDiv({ cls: "wd-game-scope-item" });
      const head = item.createDiv({ cls: "wd-game-scope-head" });
      const left = head.createDiv({ cls: "wd-game-scope-left" });
      left.createSpan({ cls: "wd-game-scope-name", text: prefix + r.name });
      const src = left.createDiv({ cls: "wd-scope-srcs" });
      if (r.inCofre) src.createSpan({ cls: "wd-scope-src wd-scope-src-cofre", text: "Cofre" });
      if (r.inTodo) src.createSpan({ cls: "wd-scope-src wd-scope-src-todo", text: "Todoist" });
      if (r.inHist) src.createSpan({ cls: "wd-scope-src wd-scope-src-hist", text: "Hist" });
      const right = head.createDiv({ cls: "wd-game-scope-right" });
      if (r.info && r.xp > 0)
        right.createSpan({ cls: "wd-game-scope-meta", text: `Nv ${r.info.level} · ${r.xp} XP` + (r.info.max ? " · máx" : "") });
      // Ação por divergência entre Cofre / Todoist / Histórico.
      let act: { label: string; title: string; danger?: boolean; run: () => Promise<void> } | null = null;
      if (todoReady && r.inHist && !r.inCofre && r.inTodo === false)
        act = { label: "Apagar histórico", danger: true, title: `Remove "${r.name}" do histórico de XP (confirma antes)`,
          run: () => this.clearScopeHistory(kind, r.name) };
      else if (todoReady && r.inTodo && !r.inCofre)
        act = { label: "+ Cofre", title: `Adicionar às Regras e abrir para configurar os níveis deste ${noun}`,
          run: () => this.addScopeToRules(kind, r.name) };
      else if (r.inCofre && r.inTodo === false)
        act = { label: "+ Todoist", title: `Criar este ${noun} no Todoist`,
          run: () => this.addScopeToTodoist(kind, r.name) };
      if (act) {
        const btn = right.createSpan({ cls: "wd-view-btn wd-scope-act" + (act.danger ? " wd-scope-act-danger" : "") });
        btn.setText(act.label); btn.setAttr("title", act.title);
        const run = act.run;
        clickable(btn, () => void run());
      }
      if (r.info && r.xp > 0) {
        const bar = item.createDiv({ cls: "wd-game-bar wd-game-bar-mini" });
        bar.createDiv({ cls: "wd-game-bar-fill" }).style.width = `${r.info.pct}%`;
        bar.setAttr("title", r.info.max ? "Nível máximo do escopo"
          : `${r.info.into}/${r.info.forNext} XP para o nível ${r.info.level + 1}`);
      }
    }
  }

  // Limpa um escopo do histórico (projeto → vira "Sem projeto"; etiqueta → removida dos eventos). XP total mantido.
  async clearScopeHistory(kind: "project" | "label", name: string) {
    await this.ensureLoaded();
    const affected = kind === "project"
      ? this.events.filter(e => (e.project || "—") === name).length
      : this.events.filter(e => e.labels.includes(name)).length;
    if (!affected) return;
    const ok = await confirmModal(this.app, {
      title: "Apagar do histórico?",
      body: kind === "project"
        ? `Remover o projeto "${name}" do histórico (${affected} evento(s) viram "Sem projeto"). O XP total é mantido.`
        : `Remover a etiqueta "@${name}" do histórico (${affected} evento(s)). O XP total é mantido.`,
      cta: "Apagar",
    });
    if (!ok) return;
    for (const e of this.events) {
      if (kind === "project") { if ((e.project || "—") === name) e.project = ""; }
      else if (e.labels.includes(name)) e.labels = e.labels.filter(l => l !== name);
    }
    await this.writeLog();
    this.rerenderAll();
    new Notice(`Histórico de "${name}" limpo.`);
  }

  // Adiciona um escopo às Regras (cofre) e abre a nota para configurar seus níveis.
  async addScopeToRules(kind: "project" | "label", name: string) {
    const path = this.rulesPath();
    let f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) { await this.openGameRules(); f = this.app.vault.getAbstractFileByPath(path); }
    if (!(f instanceof TFile)) return;
    const content = await this.app.vault.read(f);
    const rules = parseGameRules(content) ?? defaultRules();
    if (kind === "project") { if (!rules.projects.includes(name)) rules.projects.push(name); }
    else if (!rules.labels.some(l => l.name === name)) rules.labels.push({ name });
    const json = JSON.stringify(rulesToJsonObj(rules), null, 2);
    const next = replaceFirstJsonBlock(content, json) ?? buildGameRulesContent(rules);
    await this.app.vault.modify(f, next);
    this.invalidate(); await this.ensureLoaded(); this.rerenderAll();
    await this.app.workspace.getLeaf(false).openFile(f);
    new Notice(`"${name}" adicionado às Regras — configure os níveis na nota.`);
  }

  // Cria UM escopo no Todoist (não substitui o "Provisionar" em massa das Configurações).
  async addScopeToTodoist(kind: "project" | "label", name: string) {
    const token = this.plugin.settings.todoistToken.trim();
    if (!token) { new Notice("Configure o token do Todoist."); return; }
    const color = kind === "label" ? this.rules?.labels.find(l => l.name === name)?.color : undefined;
    try {
      if (kind === "project") await createTodoistProject(token, name);
      else await createTodoistLabel(token, name, color);
      await this.plugin.todo.fetch(true);   // atualiza knownProjects/knownLabels
      this.rerenderAll();
      new Notice(`"${name}" criado no Todoist.`);
    } catch (e) {
      new Notice(`Falha: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Gráfico de XP por dia (últimos N dias) — barras ou linha com pontos (settings.gameChartMode).
  private renderXpChart(host: HTMLElement, s: GameStats, phone: boolean) {
    const DAYS = phone ? 15 : 30;
    const mode = this.plugin.settings.gameChartMode;
    const todayKey = toKey(new Date());
    const days: { key: string; xp: number; count: number; label: string }[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = toKey(d);
      const [, m, day] = key.split("-");
      const agg = s.byDay.get(key);
      days.push({ key, xp: agg?.xp ?? 0, count: agg?.count ?? 0, label: `${day}/${m}` });
    }
    const sec = host.createDiv({ cls: "wd-game-chartsec" });
    const hd = sec.createDiv({ cls: "wd-game-charthd" });
    hd.createSpan({ cls: "wd-game-chart-title", text: `XP nos últimos ${DAYS} dias` });
    const ctrls = hd.createDiv({ cls: "wd-sec-ctrls" });
    const mkBtn = (m: "bars" | "line", label: string, title: string) => {
      const b = ctrls.createSpan({ cls: "wd-view-btn" + (mode === m ? " wd-view-active" : ""), text: label });
      b.setAttr("title", title); b.setAttr("aria-pressed", String(mode === m));
      clickable(b, async e => { e.stopPropagation(); this.plugin.settings.gameChartMode = m; await this.plugin.saveSettings(); this.rerenderAll(); });
    };
    mkBtn("bars", "barras", "Gráfico de barras");
    mkBtn("line", "linha", "Linha com pontos");

    const tip = (d: { xp: number; count: number; label: string }) => `${d.label}: ${d.xp >= 0 ? "+" : ""}${d.xp} XP · ${d.count} feita(s)`;
    if (mode === "line") {
      renderLineChart(sec, days.map(d => ({ value: d.xp, label: d.label, isToday: d.key === todayKey, tip: tip(d) })));
      return;
    }
    const max = Math.max(...days.map(d => Math.max(0, d.xp)), 1);   // só XP positivo dimensiona
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    days.forEach(({ key, xp, count, label }, idx) => {
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const empty = xp <= 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (empty ? " wd-growth-bar-zero" : "") });
      bar.style.height = empty ? "3px" : `${Math.max(5, Math.round((xp / max) * 100))}%`;
      bar.setAttr("title", tip({ xp, count, label }));
      const showLbl = idx === 0 || idx === DAYS - 1 || idx % 7 === 0;
      col.createDiv({ cls: "wd-growth-lbl", text: showLbl ? label : "" });
    });
  }
}

const PHONE_MAX = 600;   // px — abaixo disso o painel entra em "modo Android"
// "Modo Android" por LARGURA do painel (não por dispositivo). Mede o container;
// antes do layout (clientWidth 0) cai no dispositivo. Platform.isPhone reforça
// para o celular real seguir em modo Android em qualquer largura/orientação.
function isPhoneWidth(el: HTMLElement): boolean {
  const w = el.clientWidth;
  return Platform.isPhone || (w > 0 && w <= PHONE_MAX);
}

// Base das views: observa a largura do painel e re-renderiza ao cruzar o limiar.
abstract class WdView extends ItemView {
  protected phone = false;
  protected abstract rerender(): void;
  protected initPhoneWatch() {
    const ro = new ResizeObserver(() => {
      const p = isPhoneWidth(this.contentEl);
      if (p !== this.phone) { this.phone = p; this.rerender(); }   // só ao CRUZAR o limiar → sem loop
    });
    ro.observe(this.contentEl);
    this.register(() => ro.disconnect());
  }
}

class DashboardView extends WdView {
  private weekOffset = 0;
  private navPath: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private tip: HTMLElement | null = null;
  private searchTerm = "";
  private reviewFilter = false;
  private growthCumulative = false;
  private secHosts = new Map<SectionId, HTMLElement>();   // wrapper estável por seção
  private unsubTodo: (() => void) | null = null;          // cancelar inscrição no controller
  private unsubGame: (() => void) | null = null;          // idem para a Gamificação

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
    this.unsubGame = this.plugin.game.subscribe(() => this.renderSection("game"));
    for (const ev of ["modify", "create", "delete", "rename"] as const)
      this.registerEvent(this.app.vault.on(ev as "modify", () => { this.plugin.invalidateVaultCache(); this.schedule(); }));
    this.initPhoneWatch();
  }

  async onClose() {
    this.unsubTodo?.();
    this.unsubTodo = null;
    this.unsubGame?.();
    this.unsubGame = null;
    this.hideTip();
    this.plugin.todo.hideTip();
  }

  // Re-render público — chamado pelo plugin quando a configuração muda na aba
  // de Configurações (ordem das seções, ocultar/mostrar, fontes da Semana).
  refresh() { void this.render(); }
  protected rerender() { void this.render(); }

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
    this.phone = isPhoneWidth(this.contentEl);
    root.toggleClass("wd-phone", this.phone);
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
    else if (id === "game")    this.renderGame(host);
  }

  // Faixa compacta de Gamificação no dashboard (painel completo fica na aba própria).
  private renderGame(host: HTMLElement) {
    if (!this.plugin.settings.gamificationEnabled || this.isHidden(SEC_GAME)) return;
    const sec = host.createDiv({ cls: "wd-section wd-game-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "GAMIFICAÇÃO" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    const open = ctrls.createSpan({ cls: "wd-todo-openbtn" });
    setIcon(open, "trophy");
    open.setAttr("title", "Abrir a aba de Gamificação");
    clickable(open, e => { e.stopPropagation(); void this.plugin.openGame(); });
    this.plugin.game.renderPanel(sec, ctrls, { full: false, phone: this.phone });
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
    const phone = this.phone;

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
    prev.setAttr("title", "Semana anterior");
    next.setAttr("title", "Próxima semana");
    clickable(prev, () => { this.weekOffset--; this.render(); });
    clickable(next, () => { this.weekOffset++; this.render(); });

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
        clickable(row, () => void this.openDailyNote(key));
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
      clickable(hd, e => { e.stopPropagation(); void this.openDailyNote(key); });

      const items = byDay[key] ?? [];
      for (const it of items.slice(0, 3)) {
        const pill = col.createDiv({ cls: "wd-cal-pill" });
        pill.style.setProperty("--wd-src", it.color);
        pill.createSpan({ cls: "wd-cal-pill-dot" });
        pill.createSpan({ cls: "wd-cal-pill-txt", text: it.name.length > 14 ? it.name.slice(0, 14) + "…" : it.name });
        pill.setAttr("title", it.name);
        clickable(pill, () => this.app.workspace.getLeaf(false).openFile(it.file));
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

      clickable(card, () => {
        if (navigable) { this.navPath = isActive ? null : folder.path; this.searchTerm = ""; this.render(); }
        else revealInExplorer(this.app, folder);
      });
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
    if (rel.length) clickable(rootSeg, () => { this.navPath = rootPath; this.searchTerm = ""; this.render(); });

    let acc = rootPath;
    rel.forEach((part, i) => {
      crumb.createSpan({ cls: "wd-crumb-sep", text: "›" });
      const isLast = i === rel.length - 1;
      acc = `${acc}/${part}`;
      const segPath = acc;
      const seg = crumb.createSpan({ cls: "wd-crumb-seg" + (isLast ? " wd-crumb-cur" : ""), text: part });
      if (!isLast) clickable(seg, () => { this.navPath = segPath; this.searchTerm = ""; this.render(); });
    });

    const close = crumb.createSpan({ cls: "wd-crumb-close", text: "✕" });
    close.setAttr("title", "Fechar");
    clickable(close, () => { this.navPath = null; this.render(); });

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
          clickable(card, () => { this.navPath = sf.path; this.searchTerm = ""; this.render(); });
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
    if (this.phone) return;   // heatmap (ano inteiro) ocultado quando o painel é estreito

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
    btnPend.setAttr("aria-pressed", String(this.reviewFilter));
    clickable(btnPend, e => { e.stopPropagation(); this.reviewFilter = !this.reviewFilter; this.render(); });
    const btnL = tog.createSpan({ cls: "wd-view-btn" + (!isGrid ? " wd-view-active" : ""), text: "≡" });
    btnL.setAttr("title", "Lista");
    btnL.setAttr("aria-pressed", String(!isGrid));
    clickable(btnL, async e => { e.stopPropagation(); this.plugin.settings.noteView = "list"; await this.plugin.saveSettings(); this.render(); });
    const btnG = tog.createSpan({ cls: "wd-view-btn" + (isGrid ? " wd-view-active" : ""), text: "⊞" });
    btnG.setAttr("title", "Colunas");
    btnG.setAttr("aria-pressed", String(isGrid));
    clickable(btnG, async e => { e.stopPropagation(); this.plugin.settings.noteView = "grid"; await this.plugin.saveSettings(); this.render(); });

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
        if (st !== "cancelled") clickable(card, () => this.app.workspace.getLeaf(false).openFile(f));
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
        if (st !== "cancelled") clickable(row, () => this.app.workspace.getLeaf(false).openFile(f));
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
    btnDay.setAttr("aria-pressed", String(!this.growthCumulative));
    clickable(btnDay, e => { e.stopPropagation(); this.growthCumulative = false; this.render(); });
    const btnCum = ctrls.createSpan({ cls: "wd-view-btn" + (this.growthCumulative ? " wd-view-active" : ""), text: "total" });
    btnCum.setAttr("title", "Total acumulado no período");
    btnCum.setAttr("aria-pressed", String(this.growthCumulative));
    clickable(btnCum, e => { e.stopPropagation(); this.growthCumulative = true; this.render(); });
    const cm = this.plugin.settings.growthChartMode;
    const mkChartBtn = (m: "bars" | "line", label: string, title: string) => {
      const b = ctrls.createSpan({ cls: "wd-view-btn" + (cm === m ? " wd-view-active" : ""), text: label });
      b.setAttr("title", title); b.setAttr("aria-pressed", String(cm === m));
      clickable(b, async e => { e.stopPropagation(); this.plugin.settings.growthChartMode = m; await this.plugin.saveSettings(); this.render(); });
    };
    mkChartBtn("bars", "barras", "Gráfico de barras");
    mkChartBtn("line", "linha", "Linha com pontos");

    // Notas por data de criação (do cache).
    const counts = this.plugin.getVaultCache().ctimeByDay;

    // Últimos N dias (menos quando o painel é estreito)
    const DAYS = this.phone ? 15 : 30;
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

    const tipFor = (e: DayEntry) => `${e.label}: ${this.growthCumulative ? e.displayVal + " total" : e.count + " nota(s)"}`;
    if (this.plugin.settings.growthChartMode === "line") {
      renderLineChart(sec, entries.map(e => ({ value: e.displayVal, label: e.label, isToday: e.key === todayKey, tip: tipFor(e) })));
      return;
    }

    // Gráfico de barras
    const chart = sec.createDiv({ cls: "wd-growth-chart" });
    entries.forEach((e, idx) => {
      const { key, label, displayVal } = e;
      const col = chart.createDiv({ cls: "wd-growth-col" + (key === todayKey ? " wd-growth-today" : "") });
      const barArea = col.createDiv({ cls: "wd-growth-bar-area" });
      const isEmpty = displayVal === 0;
      const bar = barArea.createDiv({ cls: "wd-growth-bar" + (isEmpty ? " wd-growth-bar-zero" : "") });
      bar.style.height = isEmpty ? "3px" : `${Math.max(5, Math.round((displayVal / max) * 100))}%`;
      if (!isEmpty) bar.setAttr("title", tipFor(e));

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
    clickable(open, e => { e.stopPropagation(); void this.plugin.openTodoist(); });
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
      clickable(refresh, e => { e.stopPropagation(); void this.fetchSync(true); });
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
      clickable(name, () => this.app.workspace.getLeaf(false).openFile(f));
      if (this.conflictConfirm === f.path) {
        const yes = row.createSpan({ cls: "wd-sync-cyes", text: "apagar?" });
        clickable(yes, async () => { await this.app.vault.trash(f, false); this.conflictConfirm = null; this.renderSection("sync"); });
        const no = row.createSpan({ cls: "wd-sync-cno", text: "cancelar" });
        clickable(no, () => { this.conflictConfirm = null; this.renderSection("sync"); });
      } else {
        const del = row.createSpan({ cls: "wd-sync-cdel" });
        setIcon(del, "trash-2");
        del.setAttr("title", "Apagar cópia de conflito (vai para a lixeira)");
        clickable(del, () => { this.conflictConfirm = f.path; this.renderSection("sync"); });
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
  // Controlador único da Gamificação (log do cofre + stats; v0.13).
  game!: GameController;
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
    this.game = new GameController(this.app, this);
    // Auto-refresh do Todoist: verifica a cada minuto; só busca se há view aberta e o
    // cache passou do TTL (5 min). registerInterval limpa o timer no unload.
    this.registerInterval(window.setInterval(() => this.todo.maybeRefresh(), 60_000));
    this.registerView(VIEW_TYPE, leaf => new DashboardView(leaf, this));
    this.registerView(TODOIST_VIEW_TYPE, leaf => new TodoistView(leaf, this));
    this.registerView(GAME_VIEW_TYPE, leaf => new GamificationView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "Abrir Werus Dashboard", () => this.open());
    this.addRibbonIcon("list-checks", "Abrir Todoist (Werus)", () => this.openTodoist());
    this.addRibbonIcon("trophy", "Abrir Gamificação (Werus)", () => this.openGame());
    this.addCommand({ id: "open-dashboard", name: "Abrir Dashboard", callback: () => this.open() });
    this.addCommand({ id: "open-todoist", name: "Abrir Todoist", callback: () => this.openTodoist() });
    this.addCommand({ id: "open-game", name: "Abrir Gamificação", callback: () => this.openGame() });
    this.addSettingTab(new WerusSettingTab(this.app, this));
    // Carrega o log do cofre SÓ depois do vault indexar: no onload, getAbstractFileByPath
    // devolve null para um arquivo que existe → cacheava events=[] (zerava no reload).
    this.app.workspace.onLayoutReady(() => {
      this.game.invalidate();
      void this.game.ensureLoaded().then(() => this.game.rerenderAll());
    });
    // Re-renderiza quando o log muda (inclusive nossas gravações).
    this.registerEvent(this.app.vault.on("modify", f => {
      if (f.path === GAME_LOG_PATH || f.path === this.settings.gameRulesPath || f.path === LEGACY_ACH_PATH) {
        this.game.invalidate(); void this.game.ensureLoaded().then(() => this.game.rerenderAll());
      }
    }));
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

  // Provisiona o Todoist com os projetos/etiquetas declarados nas Regras (cria só os que faltam).
  // Assim a comunidade escreve as regras do jogo e o jogador só clica para preparar seu Todoist.
  async provisionTodoist() {
    const token = this.settings.todoistToken.trim();
    if (!token) { new Notice("Configure o token do Todoist primeiro."); return; }
    await this.game.ensureLoaded();
    const { projects, labels } = this.game.provisionLists();
    if (!projects.length && !labels.length) {
      new Notice("As Regras não listam projetos nem etiquetas. Edite a nota de Regras (botão ✏️).");
      return;
    }
    let existProjects: Set<string>, existLabels: Set<string>;
    try {
      const [ps, ls] = await Promise.all([fetchTodoistProjects(token), fetchTodoistLabels(token)]);
      existProjects = new Set(ps.map(p => p.name));
      existLabels = new Set(ls.map(l => l.name));
    } catch (e) {
      new Notice("Falha ao consultar o Todoist: " + (e instanceof Error ? e.message : String(e)));
      return;
    }
    const newProjects = projects.filter(p => !existProjects.has(p));
    const newLabels = labels.filter(l => !existLabels.has(l.name));
    if (!newProjects.length && !newLabels.length) {
      new Notice("Todos os projetos e etiquetas das Regras já existem no Todoist. ✅");
      return;
    }
    const items: ConfirmItem[] = [
      ...newProjects.map(p => ({ text: `📁 ${p}` })),
      ...newLabels.map(l => ({ text: `🏷️ ${l.name}` })),
    ];
    const ok = await confirmModal(this.app, {
      title: "Provisionar Todoist",
      body: `Criar ${newProjects.length} projeto(s) e ${newLabels.length} etiqueta(s) no Todoist?`,
      items,
      cta: "Criar",
    });
    if (!ok) return;
    let done = 0, failed = 0;
    for (const p of newProjects) { try { await createTodoistProject(token, p); done++; } catch { failed++; } }
    for (const l of newLabels) { try { await createTodoistLabel(token, l.name, l.color); done++; } catch { failed++; } }
    this.todo.reset();   // recarrega projetos/etiquetas no controller (atualiza knownProjects/knownLabels)
    new Notice(`Provisionamento: ${done} criado(s)` + (failed ? `, ${failed} falha(s)` : "") + ".");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    let needStMigration = false;   // credenciais Syncthing migrando data.json → localStorage
    // Saneamento: sectionOrder com exatamente as seções válidas, sem duplicatas.
    const valid: SectionId[] = ["stats", "game", "todoist", "para", "sync", "heatmap", "growth", "calendar"];
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
    // Gamificação (v0.13).
    this.settings.gamificationEnabled = this.settings.gamificationEnabled !== false;
    const pf = Number(this.settings.gamePenaltyFactor);
    this.settings.gamePenaltyFactor = Number.isFinite(pf) && pf > 0 ? pf : 1.5;
    this.settings.gameLastHarvest = typeof this.settings.gameLastHarvest === "string" ? this.settings.gameLastHarvest : "";
    this.settings.gameChartMode = this.settings.gameChartMode === "line" ? "line" : "bars";
    this.settings.growthChartMode = this.settings.growthChartMode === "line" ? "line" : "bars";
    const ga = this.settings.gameAchievements;
    this.settings.gameAchievements = ga && typeof ga === "object" && !Array.isArray(ga) ? ga : {};
    this.settings.gameRulesPath = typeof this.settings.gameRulesPath === "string" && this.settings.gameRulesPath.trim()
      ? this.settings.gameRulesPath.trim() : DEFAULT_RULES_PATH;

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

  async openGame() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(GAME_VIEW_TYPE)[0];
    if (!leaf) { leaf = workspace.getLeaf(false); await leaf.setViewState({ type: GAME_VIEW_TYPE, active: true }); }
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
class TodoistView extends WdView {
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
    this.initPhoneWatch();
  }
  async onClose() {
    this.unsubTodo?.();
    this.unsubTodo = null;
    this.plugin.todo.hideTip();
  }
  protected rerender() { this.refresh(); }

  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-todoist-view");
    this.phone = isPhoneWidth(this.contentEl);
    root.toggleClass("wd-phone", this.phone);

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

// ── Aba dedicada de Gamificação ──────────────────────────────────────────────
class GamificationView extends WdView {
  private unsub: (() => void) | null = null;

  constructor(leaf: WorkspaceLeaf, private plugin: WerusDashboard) {
    super(leaf);
  }

  getViewType()    { return GAME_VIEW_TYPE; }
  getDisplayText() { return "Gamificação"; }
  getIcon()        { return "trophy"; }

  async onOpen() {
    this.refresh();
    this.unsub = this.plugin.game.subscribe(() => this.refresh());
    await this.plugin.game.ensureLoaded();
    this.refresh();
    void this.plugin.game.refreshPending();
    this.initPhoneWatch();
  }
  async onClose() {
    this.unsub?.();
    this.unsub = null;
  }
  protected rerender() { this.refresh(); }

  refresh() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wd-root", "wd-game-view");
    this.phone = isPhoneWidth(this.contentEl);
    root.toggleClass("wd-phone", this.phone);

    const h = root.createDiv({ cls: "wd-header" });
    const txt = h.createDiv({ cls: "wd-header-text" });
    txt.createDiv({ cls: "wd-date", text: todayBR() });
    txt.createDiv({ cls: "wd-title", text: "Gamificação" });

    const sec = root.createDiv({ cls: "wd-section wd-game-section" });
    const head = sec.createDiv({ cls: "wd-sec-head" });
    head.createDiv({ cls: "wd-sec-label", text: "PROGRESSO" });
    const ctrls = head.createDiv({ cls: "wd-sec-ctrls" });
    this.plugin.game.renderPanel(sec, ctrls, { full: true, phone: this.phone });
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
        b.setAttr("aria-pressed", String(this.v.priority === api));
        clickable(b, () => { this.v.priority = api; renderPri(); });
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
          chip.setAttr("aria-pressed", String(on));
          clickable(chip, () => {
            const i = this.v.labels.indexOf(l);
            if (i >= 0) this.v.labels.splice(i, 1); else this.v.labels.push(l);
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

    // ── Gamificação ──────────────────────────────────────────────────────────
    containerEl.createEl("h3", { text: "Gamificação" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Tarefas concluídas viram XP/nível/streak (aba Gamificação + faixa no dashboard). \"Salvar concluídas\" grava no log do cofre (20.Areas/Gamificação.md) e limpa do Todoist. O botão ✗ marca uma tarefa como não feita (punição em XP) e a apaga.",
    });

    new Setting(containerEl)
      .setName("Ativar gamificação")
      .setDesc("Mostra a seção/aba de Gamificação e o botão \"não feita\" nas tarefas.")
      .addToggle(t => t
        .setValue(plugin.settings.gamificationEnabled)
        .onChange(async v => {
          plugin.settings.gamificationEnabled = v;
          await plugin.saveSettings();
          plugin.rerenderDashboards();
          plugin.game.rerenderAll();
        }));

    new Setting(containerEl)
      .setName("Penalidade do \"não feito\"")
      .setDesc("Multiplica a base da prioridade ao marcar como não feita. Ex.: 1,5 = perde 50% a mais do que ganharia.")
      .addText(t => t
        .setPlaceholder("1.5")
        .setValue(String(plugin.settings.gamePenaltyFactor))
        .onChange(async v => {
          const n = Number(v.replace(",", "."));
          if (Number.isFinite(n) && n > 0) { plugin.settings.gamePenaltyFactor = n; await plugin.saveSettings(); }
        }));

    new Setting(containerEl)
      .setName("Nota de Regras (JSON)")
      .setDesc("Caminho da nota com as regras do jogo (projetos, etiquetas, XP por prioridade/etiqueta, níveis e conquistas). Mude se o seu cofre não usa o método PARA. O lápis abre — e cria, já preenchida — a nota.")
      .addText(t => t
        .setPlaceholder(DEFAULT_RULES_PATH)
        .setValue(plugin.settings.gameRulesPath)
        .onChange(async v => {
          plugin.settings.gameRulesPath = v.trim() || DEFAULT_RULES_PATH;
          await plugin.saveSettings();
          plugin.game.invalidate();
          void plugin.game.ensureLoaded().then(() => plugin.game.rerenderAll());
        }))
      .addExtraButton(b => b
        .setIcon("pencil")
        .setTooltip("Abrir / criar a nota de Regras")
        .onClick(() => void plugin.game.openGameRules()))
      .addExtraButton(b => b
        .setIcon("book-open")
        .setTooltip("Regenerar a documentação da nota (mantém a sua configuração)")
        .onClick(() => void plugin.game.regenerateRulesDoc()));

    new Setting(containerEl)
      .setName("Provisionar Todoist")
      .setDesc("Cria no seu Todoist os projetos e etiquetas listados nas Regras (só os que faltam). Útil ao adotar um \"jogo\" feito pela comunidade.")
      .addButton(b => b
        .setButtonText("Criar projetos e etiquetas")
        .onClick(() => void plugin.provisionTodoist()));

    // ── Pacotes de tarefas ───────────────────────────────────────────────────
    containerEl.createEl("h3", { text: "Pacotes de tarefas" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Conjuntos de tarefas que você lança no Todoist com um clique (na aba Todoist ou no dashboard), todas com data de hoje. Uma tarefa por linha. Numa linha, use @etiqueta para aplicar uma etiqueta só àquela tarefa e p1–p4 para a prioridade (p1 = mais alta; padrão p4).",
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
            chip.setAttr("aria-pressed", String(on));
            chip.createSpan({ cls: "wd-label-dot" }).style.background = TODOIST_COLORS[l.color] ?? LABEL_FALLBACK;
            chip.createSpan({ text: `@${l.name}` });
            clickable(chip, async () => {
              const cur = pkg.labels ?? [];
              const i = cur.indexOf(l.name);
              if (i >= 0) cur.splice(i, 1); else cur.push(l.name);
              pkg.labels = cur.length ? cur : undefined;
              await plugin.saveSettings();
              plugin.rerenderDashboards();
              render();
              refresh();
            });
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
        body.createDiv({ cls: "wd-tf-hint", text: "Uma por linha · @etiqueta marca só aquela tarefa · p1–p4 define a prioridade (p1 = mais alta) · fecha ao clicar fora ou Esc." });
        setTimeout(() => ta.focus(), 0);
      }, { cls: "wd-pop-tasks", width: 320, container: this.containerEl, onClose: () => { plugin.rerenderDashboards(); } });
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
      clickable(iconBtn, () => openIconPopover(iconBtn, pkg.icon, async ic => {
        pkg.icon = ic; await plugin.saveSettings(); plugin.rerenderDashboards(); fillIcon();
      }));

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
      if (idx > 0) clickable(up, async () => { await plugin.movePackage(idx, -1); this.display(); });
      const down = row.createSpan({ cls: "wd-pkg-mini" + (idx === pkgs.length - 1 ? " wd-disabled" : "") });
      setIcon(down, "chevron-down"); down.setAttr("title", "Mover para baixo");
      if (idx < pkgs.length - 1) clickable(down, async () => { await plugin.movePackage(idx, +1); this.display(); });
      const del = row.createSpan({ cls: "wd-pkg-mini wd-pkg-del" });
      setIcon(del, "trash-2"); del.setAttr("title", "Remover pacote");
      clickable(del, async () => {
        plugin.settings.taskPackages = pkgs.filter(x => x !== pkg);
        await plugin.saveSettings();
        plugin.rerenderDashboards();
        this.display();
      });
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
