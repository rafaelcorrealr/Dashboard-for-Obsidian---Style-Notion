# Changelog — Werus Dashboard

> **Estado atual:** Alpha — desenvolvimento pessoal, publicado no GitHub
> ([rafaelcorrealr/Dashboard-for-Obsidian---Style-Notion](https://github.com/rafaelcorrealr/Dashboard-for-Obsidian---Style-Notion)).
> A primeira versão estável será `1.0.0`. Versões `0.x.x` = iterações internas de desenvolvimento.

---

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
