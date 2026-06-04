# Werus Dashboard

> 🤖 **Este app está sendo criado com o Claude Code** (Anthropic) — desenvolvimento assistido por IA, uma versão por vez, a partir dos pedidos do autor.

Plugin Obsidian pessoal para o Second Brain. Exibe um dashboard com cards por pasta, estatísticas do cofre, calendário semanal, integração com o Todoist, avisos de urgência, gráficos de atividade e navegador inline de notas.

> ⚠️ **Alpha** — desenvolvimento pessoal. Publicado no GitHub; a primeira versão estável será `1.0.0`.
> Compatível com Obsidian ≥ 1.5.0, **desktop e mobile** (Android testado). Em telas estreitas o layout é responsivo.

---

## Funcionalidades

### Cards do cofre
- Todas as pastas de topo viram cards com ícone, cor de acento e contagem de notas
- Pastas PARA (Inbox, Projects, Areas, Resources, Archive) têm cor e ícone fixos; demais recebem cor por hash do nome
- Barra de progresso `reviewed` na base de cada card (X/Y notas revisadas)
- Imagem de capa configurável
- Ocultar/restaurar qualquer card

### Navegador inline
- Clicar num card abre painel de subpastas abaixo do grid, sem trocar de view
- Navegação em qualquer profundidade com breadcrumb clicável
- **Busca em tempo real**: campo de texto filtra subpastas e notas instantaneamente
- Lista/grid de notas da pasta atual com indicador `reviewed` e toggle de visualização
- Filtro "pendentes": mostra só notas com `reviewed: false`

### Seções (reordenáveis e ocultáveis)

A coluna **Nome no dashboard** é o título que aparece na tela; **id** é o valor usado em
`sectionOrder` no `data.json`. (Antes esta tabela listava só os ids internos, que não batem
com o que o usuário vê — por isso a correção.)

| Nome no dashboard | id (`sectionOrder`) | Conteúdo |
|---|---|---|
| ESTATÍSTICAS | `stats` | Total de notas, % revisadas, criadas na semana, breakdown por pasta |
| COFRE | `para` | Cards de todas as pastas de topo + navegador inline |
| TAREFAS | `todoist` | Tarefas do Todoist em 3 caixas (Atrasadas · Hoje · Próximos N dias) + "Depois" (ler e concluir) |
| ATIVIDADE DO COFRE | `heatmap` | Heatmap de notas criadas/dia via plugin Heatmap Calendar |
| CRESCIMENTO DO COFRE | `growth` | Notas criadas/dia nos últimos 30 dias; modo cumulativo disponível |
| RELATÓRIOS CLAUDE | `reports` | Últimos 6 relatórios Claude de `40.Archive/Relatórios Claude/` |
| Semana N | `calendar` | Calendário semanal navegável com notas do dia (`date:`) |

### Integração Todoist
- **3 caixas lado a lado por urgência:** **Atrasadas** (vermelha) · **Hoje** (destaque) · **Próximos N dias** (lista agrupada por dia, com sub-título por dia). Tarefas além da janela ficam em **"Depois"** (recolhível, abaixo). Cada linha tem **prioridade colorida** (🔴 p1 / 🟠 p2 / 🔵 p3 / cinza p4) e o nome do projeto
- **Toggle 3 / 7 dias** e **filtros por projeto/etiqueta** (chips) no header da seção
- **Concluir tarefa** pela checkbox (sync de duas vias: fecha no Todoist real via API) — conclusão otimista, reverte se a API falhar
- *Hover* mostra tooltip com a descrição; *clicar* abre modal com a descrição em markdown (links clicáveis) + botões "Abrir no Todoist" e "✓ Concluir"
- Indicador `⟳` para tarefas recorrentes; botão `↻` de refresh manual; as 3 caixas empilham no celular
- Requer o token pessoal do Todoist nas configurações do plugin (salvo em `data.json`, fora do Git)

### Aviso de urgência
- Notas com frontmatter `urgency: baixa | media | alta` acendem um ícone de aviso (`triangle-alert`) no card da pasta que as contém (propaga em qualquer nível, usa a maior urgência da subárvore)
- Cor por nível: alta = vermelho com glow/pulse · media = laranja · baixa = amarelo
- *Hover* no ícone lista quais arquivos estão urgentes; ao navegar, cada nota urgente é marcada

### Mobile (Android)
- O plugin carrega no Obsidian Mobile (`isDesktopOnly: false`). Layout responsivo em telas estreitas
- Instalação automática: o Syncthing já leva o cofre + `main.js` pro aparelho; basta habilitar o plugin no app

---

## Convenções no vault

### `status.md`
Arquivo opcional na raiz de qualquer subpasta. Controla aparência e comportamento do card:

```yaml
---
status: progress    # progress | paused | cancelled
icon: server        # id Lucide (ex: server) ou emoji (ex: 🖥️)
cover: imgs/foto.png                # caminho direto
# cover: "[[imgs/foto.png]]"        # ou wikilink Obsidian
---
```

| Status | Visual | Interação |
|---|---|---|
| `progress` | Normal | Navegável |
| `paused` | 65% opacidade | Navegável |
| `cancelled` | Grayscale + riscado | Não clicável |

### `reviewed`
Campo de frontmatter em qualquer nota `.md`:

```yaml
---
reviewed: true   # ou false (padrão quando ausente)
---
```

- `true` → dot verde no dashboard
- `false` / ausente → dot escuro; contado como "pendente" no filtro

### `urgency`
Campo de frontmatter opcional em qualquer nota `.md`:

```yaml
---
urgency: alta   # baixa | media | alta
---
```

Acende o ícone de aviso no card da pasta (cor pelo nível). Ausente → sem aviso.

### Imagem de capa (fallback)
Se o `status.md` não tiver `cover:`, o plugin procura um arquivo chamado `_cover` (qualquer extensão de imagem: `.png`, `.jpg`, `.webp`, `.gif`, `.svg`) na pasta. Se também não houver `_cover`, os cards do topo (PARA) recebem uma capa padrão: gradiente da cor de acento com o ícone da pasta como marca d'água.

### Relatórios Claude
Notas em `40.Archive/Relatórios Claude/` com frontmatter `date: YYYY-MM-DD` aparecem na seção Relatórios.

### Calendário e notas diárias
Notas com frontmatter `date: YYYY-MM-DD` aparecem como pílulas no dia correspondente do calendário semanal.
Clicar no cabeçalho de um dia abre a nota diária; se não existir, é criada em `50.Diário/YYYY-MM-DD.md`.
O conteúdo vem do template `Modelos/Nota Diária.md` (placeholders `{{date}}` e `{{title}}`); fallback embutido se o template não existir. O template padrão fixa `owner: Werus` e `reviewed: true`.

---

## Instalação / Build

### Requisitos
- Node.js (via nvm recomendado)
- pnpm

### Compilar
```bash
cd "Second Brain/.obsidian/plugins/werus-dashboard"
pnpm install
pnpm build          # compila main.ts → main.js
```

Após compilar, recarregue o Obsidian: `Ctrl+R` (ou Ctrl+P → "Reload app without saving").

### Modo watch (desenvolvimento)
```bash
pnpm dev
```

### Verificar tipos
```bash
npx tsc --noEmit
```

---

## Settings persistidas (`data.json`)

| Campo | Tipo | Descrição |
|---|---|---|
| `sectionOrder` | `string[]` | Ordem das seções no dashboard |
| `compact` | `boolean` | Modo compacto ativado |
| `hidden` | `string[]` | Pastas e seções ocultas |
| `noteView` | `"list" \| "grid"` | Visualização padrão das notas |
| `todoistToken` | `string` | Token pessoal da API do Todoist (fora do Git) |

---

## Estrutura do código

```
main.ts
├── reviewedStats()       — conta reviewed:true vs total em subárvore
├── folderStats()         — conta arquivos e imagens em subárvore
├── filesIn()             — lista .md/.canvas/.base de uma pasta
├── urgencyStats()        — varre a subárvore e devolve notas urgentes + nível máx
├── coverInFolder()       — resolve cover: do status.md ou _cover.*
├── fetchTodoistTasks()   — GET /api/v1/tasks (paginado), Bearer token
├── closeTodoistTask()    — POST /api/v1/tasks/{id}/close (Fase 8.2)
├── renderStats()         — painel de estatísticas
├── renderPara()          — grid de cards + navegador inline (+ badge de urgência)
├── renderBrowser()       — painel de navegação aninhada
├── renderNotes()         — lista/grid de notas com toggle e filtros
├── renderTodoist()       — grade semanal + "Atrasadas" (ler/concluir tarefas)
├── renderGrowth()        — gráfico de crescimento (dia/total)
├── renderHeatmap()       — heatmap via plugin heatmap-calendar
├── renderReports()       — lista de relatórios Claude
└── renderCalendar()      — calendário semanal
```

---

## Versão atual

**v0.6.0 (alpha)** — ver [CHANGELOG](CHANGELOG.md) para histórico de desenvolvimento.
A primeira versão estável será `1.0.0`.
