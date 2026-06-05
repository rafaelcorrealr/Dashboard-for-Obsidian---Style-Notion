# Changelog — Werus Dashboard

> **Estado atual:** Alpha — desenvolvimento pessoal, publicado no GitHub
> ([rafaelcorrealr/Dashboard-for-Obsidian---Style-Notion](https://github.com/rafaelcorrealr/Dashboard-for-Obsidian---Style-Notion)).
> A primeira versão estável será `1.0.0`. Versões `0.x.x` = iterações internas de desenvolvimento.

---

## [0.9.0] — alpha — 2026-06-04

**Responsividade no celular.** Gated em `Platform.isPhone` → **desktop e tablet ficam idênticos**; só o celular muda.

- **Calendário no celular** → lista vertical de **3 dias (ontem · hoje · amanhã)**, navegável pelas setas (paginam de 3 em 3). Cada dia mostra **uma nota diária** (um por dia, sem listar vários arquivos); a **linha inteira** é clicável.
- **Abrir em vez de criar:** clicar num dia abre a nota diária **existente** (achada pelo caminho `50.Diário/AAAA-MM-DD.md` **ou** por qualquer nota com `date:` daquele dia); só cria se não houver. Vale também no desktop (`findDailyNote`).
- **Heatmap oculto** no celular (o plugin só renderiza o ano inteiro).
- **Crescimento: 15 dias** no celular (era 30).
- **Toque:** `padding-bottom` no rodapé + alvos maiores (`.is-phone`: "+", setas, checkbox, ocultar/refresh/filtro).
- **Correção (regressão da v0.8.0):** os tokens `--wd-*` foram movidos de `:root` → `body`. O Obsidian define `--interactive-accent`/`--background-secondary-alt` etc. só no `body`; no `:root` viravam inválidos e deixavam **transparentes** as barras do **Crescimento** (e antes o tooltip).

## [0.8.0] — alpha — 2026-06-04

**Tema claro automático.** O dashboard agora **segue o tema do Obsidian** (claro/escuro) sozinho, sem botão.

- **Camada de tokens `--wd-*`** mapeando fundos, bordas e textos para as variáveis do Obsidian (`--background-*`, `--text-*`). O **accent** segue o do tema (`--interactive-accent`).
- **Cores semânticas mantidas** (prioridade, urgência, etiquetas, verde do crescimento); o **vermelho das Atrasadas** virou translúcido para funcionar nos dois temas.
- **Bordas com contraste garantido** nos dois temas (cinza translúcido `rgba(130,130,130,.32)`) — a `--background-modifier-border` do Obsidian era sutil demais com tantos cards; a separação some/aparece agora corretamente.
- **Correções de robustez:** fallback nos tokens "-alt" (`--background-secondary-alt`/`-primary-alt`) → caem para a base quando o tema não os define; **tooltip/preview** com fundo opaco fixo (`--background-secondary`) — antes ficava transparente em temas sem o "-alt".

## [0.7.3] — alpha — 2026-06-04

**Etiquetas coloridas + formulário mais enxuto.**

- **Etiquetas com a cor do Todoist:** novo `fetchTodoistLabels` (`GET /labels`) + paleta nomeada → hex (`TODOIST_COLORS`); cada chip de etiqueta ganha uma **bolinha colorida** nas linhas, no pop-up de detalhes, na barra de filtros e no formulário. (As cores usam os hex clássicos da paleta — ajustáveis.)
- **Removido o "adicionar nova etiqueta"** do formulário: agora só se **seleciona** entre etiquetas existentes (busca todas, não só as em uso) — evita criar etiqueta por engano/typo.
- Criar/excluir projetos e etiquetas ficará para uma futura **aba de configuração do Todoist** (anotada no roadmap como ideia, a decidir).

## [0.7.2] — alpha — 2026-06-04

**Todoist: criar, editar e excluir** (sync de duas vias completo; API v1, mesmo padrão `requestUrl`+Bearer). *Em andamento — mais ajustes desta feature virão ainda na série 0.7.x.*

- **Criar:** botão **"+"** (maior, com brilho vermelho) no header da seção, na caixa **Hoje** e em cada **sub-título de dia** — já pré-preenchendo a data (Hoje → "hoje", dia → aquela data). **Sem "+" nas Atrasadas** (não se cria tarefa para o passado).
- **Editar em 2 passos:** clicar numa tarefa abre um **pop-up só-leitura** (prioridade, data/recorrência, projeto, etiquetas e descrição em markdown com links clicáveis); o botão **"✎ Editar"** (canto inferior esquerdo) abre o **formulário** completo.
- **Formulário:** título, descrição, prioridade (p1–p4), **data em texto natural pt** (`due_string`+`due_lang:"pt"`: "amanhã", "todo dia 1", "2026-06-10"), projeto (troca via `/move`) e etiquetas (chips + adicionar nova). No editar envia **só os campos alterados** (preserva recorrência se a data não muda).
- **Excluir** com confirmação em 2 passos (DELETE otimista).
- **Configurações → Exibição das tarefas:** dois toggles para **mostrar o projeto** e/ou **as etiquetas** nas linhas (padrão: só projeto). Antes o projeto era fixo.
- API: `createTodoistTask` (POST `/tasks`), `updateTodoistTask` (POST `/tasks/{id}`), `moveTodoistTask` (POST `/tasks/{id}/move`), `deleteTodoistTask` (DELETE `/tasks/{id}`).

## [0.7.1] — alpha — 2026-06-04

**Todoist na horizontal.** A v0.7.0 ainda ficava muito vertical (blocos empilhados). Agora a seção TAREFAS mostra **3 caixas lado a lado**:

- **Atrasadas** (caixa fixa em vermelho) · **Hoje** (caixa em destaque indigo) · **Próximos N dias** — nessa ordem, em linha. Some o painel recolhível de atrasadas: vira uma caixa sempre visível com rolagem própria (cada caixa rola sozinha após ~380px)
- A caixa **Próximos N dias** deixou de ser uma grade de 7 colunas estreitas e virou uma **lista agrupada por dia**, com **sub-título por dia** (ex.: `TER 05`) só nos dias que têm tarefa; fim de semana em roxo. Dentro do grupo a data sai de cada linha (já está no sub-título)
- **Depois** (> N dias) continua recolhível, agora **abaixo** da linha de caixas
- No celular/painel estreito as 3 caixas **empilham** automaticamente (rolagem reduzida p/ 260px)
- O **toggle 3/7** e os **filtros** (projeto/etiqueta) continuam no header, inalterados
- Limpeza: removidos o método `todoChip` (era da grade antiga) e o estado `todoistOverdueOpen`. `todoRow` ganhou parâmetro `showDate` (oculta a data quando já há sub-título de dia)

## [0.7.0] — alpha — 2026-06-03

**Todoist redesenhado.** A seção TAREFAS deixou de ser uma grade fixa Seg→Dom e passou a priorizar pela urgência real:

- **Nova ordem de blocos:** 1º **Atrasadas** (recolhível, vermelho) · 2º **Hoje** · 3º **Próximos N dias** (grade de colunas, de amanhã em diante) · 4º **Depois** (tudo com vencimento além da janela; recolhível, fechado por padrão)
- **Toggle 3 / 7 dias** no header da seção (`settings.todoistDayRange`, default 7) — define o tamanho da janela "Próximos dias". A grade ajusta o nº de colunas automaticamente
- **Filtros por projeto e etiqueta:** botão de funil no header abre uma barra de **chips** (toggle). Projetos vêm de um novo fetch `GET /api/v1/projects`; etiquetas saem das próprias tarefas (`t.labels`). Persistidos em `settings.todoistFilters`; o botão mostra a contagem de filtros ativos e há um "limpar filtros". Combinação projeto **E** etiqueta
- As linhas de tarefa (Atrasadas / Hoje / Depois) agora mostram o **nome do projeto** ao lado
- Reaproveita toda a lógica existente: `dueKey`, `priMeta`, `todoChip`, `todoRow`, `todoCheck`, `completeTask`, `attachTaskTip`, `openTaskModal` (conclusão e descrição inalteradas)

## [0.6.0] — alpha — 2026-06-02

Pass de **documentação & convenções** (sem mudança de código). Início do roadmap derivado da tarefa "Changes" do Todoist.

- **README:** aviso no topo de que o app está sendo criado com o **Claude Code**
- **README — tabela "Seções" corrigida:** antes listava só os ids internos (`stats`, `para`…), que não batem com os títulos exibidos. Agora mostra **Nome no dashboard → id** (ex.: COFRE = `para`, TAREFAS = `todoist`, ATIVIDADE DO COFRE = `heatmap`)
- **Recuperação de conflito:** os docs do cofre haviam sido revertidos por um conflito do Syncthing (o `README` voltou a exibir "v2.4"); conteúdo recuperado das cópias `*.sync-conflict-*` e reconsolidado
- **Planejamento → roadmap:** reestruturado; "Fase N" renomeadas para "Versão x.y.z"

## [0.5.0] — alpha — 2026-06-02

- **Suporte a tablet/celular Android (Fase 11):** `isDesktopOnly` passou de `true` para `false` — o plugin agora carrega no Obsidian Mobile. O cofre (incluindo o `main.js`) já chega ao aparelho via Syncthing, então é só habilitar o plugin no app
  - **CSS responsivo:** `@media (max-width: 600px)` compacta os dois grids de 7 colunas (calendário semanal + semana do Todoist), reduz o padding do root, deixa os cards 2 por linha e estreita a linha de estatísticas. Tablet em paisagem (viewport largo) mantém o layout cheio de desktop
  - `min-width: 0` nas colunas dos grids de 7 dias evita que o conteúdo estoure a faixa em telas estreitas
  - Confirmado: o código não usa nenhuma API de Node/Electron (rede via `requestUrl`), então é seguro no mobile. Botão "Abrir no Todoist" via `window.open` validado no aparelho

## [0.4.1] — alpha — 2026-06-02

- **Descrição da tarefa no Todoist:**
  - *Hover* numa tarefa (chip ou linha "Atrasadas") mostra um tooltip com o título completo + a descrição (preview rápido, cortado em ~700 caracteres). Tarefas com descrição ganham um ícone discreto (`align-left`)
  - *Clicar* na tarefa abre um **modal** com a descrição renderizada em markdown — **links clicáveis** (abrem no navegador) — além de botões "Abrir no Todoist" e "✓ Concluir"

## [0.4.0] — alpha — 2026-06-02

- **Todoist — escrita (Fase 8.2):** checkbox em cada tarefa (chips da semana + painel "Atrasadas") conclui a tarefa no Todoist real (`POST /api/v1/tasks/{id}/close`). Conclusão otimista (some na hora; reverte e avisa via Notice se a API falhar). Fecha o sync de duas vias — mexer na dashboard reflete no app
- **Aviso de urgência (Fase 10):** lê a propriedade `urgency` (`baixa`/`media`/`alta`) das notas
  - Ícone de aviso (`triangle-alert`) no card da pasta que contém notas urgentes; propaga em qualquer nível (usa a maior urgência da subárvore). Canto superior direito nos cards de topo (esquerda nas subpastas, onde o status ocupa a direita)
  - Hover no ícone → tooltip listando quais arquivos estão urgentes + o nível
  - Ao navegar, a nota urgente é marcada com o mesmo ícone, cor por nível (alta = vermelho com glow/pulse · media = laranja · baixa = amarelo)
  - Pasta **oculta** que contém notas urgentes: o chip na barra "ocultos" fica contornado pela cor do nível (glow/pulse na alta) — dá pra ver a urgência mesmo sem o card visível
- **Capa padrão nas subpastas (Fase 9.1):** subpastas sem `cover` ganham capa padrão (gradiente + ícone) em versão menor/sutil que as pastas de topo
- **Cards de arquivo por tipo (Fase 9.2):** o cofre passa a mostrar também `.canvas` e `.base` (antes só `.md`); cada arquivo ganha capa/ícone padrão por tipo (nota → documento azul, canvas → roxo, base → teal), menores que os cards de pasta
- Refactor: tooltip de posicionamento extraído para `positionTip`; `notesIn` → `filesIn` (inclui canvas/base)

## [0.3.0] — alpha — 2026-06-01

- **Integração Todoist (Fase 8.1 — leitura):** nova seção "TAREFAS" que puxa as tarefas via API unificada v1 do Todoist (`/api/v1/tasks`, paginada por `next_cursor`; a REST v2 foi aposentada e respondia 410)
  - Grade da semana atual com chips por dia, cor pela prioridade (🔴 p1 / 🟠 p2 / 🔵 p3 / cinza p4); prioridade da API (4=urgente) mapeada para a UI
  - Painel "Atrasadas" recolhível, ordenado por prioridade
  - Botão de refresh manual (spinner enquanto busca) + carga preguiçosa na primeira abertura
  - Clicar numa tarefa abre ela no Todoist (web); indicador `⟳` para recorrentes
  - Aba de configurações do plugin (nova) com campo de token (tipo senha); token salvo em `data.json` (fora do Git)
  - Seção reordenável/ocultável como as demais; degradação graciosa sem token / erro de rede / token inválido
- Pendente (Fase 8.2): concluir tarefas pela dashboard (escrita)

## [0.2.4] — alpha — 2026-05-30

- Capa padrão nos cards PARA sem `cover`/`_cover`: gradiente da cor de acento + ícone da pasta como marca d'água; alinha a altura de todos os cards do topo

## [0.2.3] — alpha — 2026-05-30

- Notas diárias agora usam template editável em `Modelos/Nota Diária.md` (placeholders `{{date}}` e `{{title}}`); fallback embutido se o template não existir
- Dono fixo `owner: Werus` mantido no template padrão

## [0.2.2] — alpha — 2026-05-30

- Clicar no cabeçalho de um dia do calendário abre a nota diária; cria em `50.Diário/YYYY-MM-DD.md` se não existir (frontmatter `owner: Werus`, `date:`, `reviewed: true`, `type: daily`)

## [0.2.1] — alpha — 2026-05-30

- Painel de Estatísticas: total de notas, % revisadas, +N na semana, breakdown por pasta com barra de progresso
- Busca inline no navegador (filtra subpastas e notas em tempo real)
- Toggle "pendentes": mostra só notas com `reviewed: false`
- Modo cumulativo no gráfico de crescimento (toggle "dia / total")

## [0.2.0] — alpha — 2026-05-30

- Barra de progresso `reviewed` nos cards (X/Y notas revisadas)
- Seção "CRESCIMENTO DO COFRE": gráfico de barras 30 dias
- Toggle lista / colunas para notas (`≡` / `⊞`), persistido
- Indicador `reviewed` por nota (dot verde/escuro)
- Cover via campo `cover:` no `status.md` (aceita caminho ou wikilink)

## [0.1.7] — alpha — 2026-05-30

- Seção "ATIVIDADE DO COFRE": heatmap via plugin `heatmap-calendar`
- Degradação graciosa se o plugin estiver desativado

## [0.1.6] — alpha — 2026-05-30

- Cofre inteiro: todas as pastas de topo viram cards (não só PARA)
- Sistema ocultar/restaurar: eye-off no hover, barra de chips, persiste em `settings.hidden[]`

## [0.1.5] — alpha — 2026-05-30

- Ícone por pasta via `icon:` no `status.md` (emoji ou id Lucide)
- Animação de entrada dos cards (fade + slide com stagger)
- Modo compacto (persistido), tooltip com notas recentes
- Reordenar seções via ▲/▼, persiste em `settings.sectionOrder`

## [0.1.4] — alpha — 2026-05-30

- Navegação aninhada em qualquer profundidade com breadcrumb clicável
- Notas da pasta listadas com status individual (`reviewed` / `status:`)
- Pastas de imagens ocultadas automaticamente

## [0.1.3] — alpha — 2026-05-30

- Expansão inline de subpastas (sem trocar de view)
- Status por pasta via `status.md`: `progress` / `paused` / `cancelled`

## [0.1.2] — alpha — 2026-05-30

- Calendário semanal navegável com notas do dia (`date:` no frontmatter)

## [0.1.1] — alpha — 2026-05-30

- Imagem de capa via `_cover.*` na pasta
- Seção Relatórios Claude

## [0.1.0] — alpha — 2026-05-30

- Cards para as pastas PARA com ícone, cor e contagem
- Botão na ribbon + comando "Abrir Dashboard"
- Dark theme (`#0A0A0F`, accent `#6366F1`)

---

## Roadmap para v1.0.0 (primeira publicação)

- [ ] Estabilizar API pública (convenções de `status.md`)
- [ ] Testes em vaults diferentes
- [ ] README em inglês (para o marketplace)
- [ ] Screenshots para o repositório
- [x] Definir pasta de notas diárias e habilitar criação via calendário (`50.Diário/`)
