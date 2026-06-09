# Werus Dashboard

> 🤖 **Este app está sendo criado com o Claude Code** (Anthropic) — desenvolvimento assistido por IA, uma versão por vez, a partir dos pedidos do autor.

Plugin Obsidian pessoal para o Second Brain. Exibe um dashboard com cards por pasta, estatísticas do cofre, calendário semanal, integração com o Todoist, avisos de urgência, gráficos de atividade e navegador inline de notas.

> ⚠️ **Alpha** — desenvolvimento pessoal. Publicado no GitHub; a primeira versão estável será `1.0.0`.
> Compatível com Obsidian ≥ 1.5.0, **desktop e mobile** (Android testado). Em telas estreitas o layout é responsivo.
> **Segue o tema do Obsidian** (claro/escuro) automaticamente, usando a cor de destaque do seu tema.

---

## Funcionalidades

### Cards do cofre
- Todas as pastas de topo viram cards com ícone, cor de acento e contagem de notas
- Pastas PARA (Inbox, Projects, Areas, Resources, Archive) têm cor e ícone fixos; demais recebem cor por hash do nome
- Barra de progresso `reviewed` na base de cada card (X/Y notas revisadas)
- Imagem de capa configurável
- Mostrar/ocultar cada card pelas **Configurações** do plugin (ver abaixo)

### Navegador inline
- Clicar num card abre painel de subpastas abaixo do grid, sem trocar de view
- Navegação em qualquer profundidade com breadcrumb clicável
- **Busca em tempo real**: campo de texto filtra subpastas e notas instantaneamente
- Lista/grid de notas da pasta atual com indicador `reviewed` e toggle de visualização
- Filtro "pendentes": mostra só notas com `reviewed: false`

### Seções (reordenáveis e ocultáveis pelas Configurações)

A coluna **Nome no dashboard** é o título que aparece na tela; **id** é o valor usado em
`sectionOrder` no `data.json`. A **ordem** e a **visibilidade** de cada seção são
ajustadas em **Configurações → Werus Dashboard → Seções do dashboard** (a dashboard em si
não tem mais setas ▲▼ nem botões de ocultar durante o uso).

| Nome no dashboard | id (`sectionOrder`) | Conteúdo |
|---|---|---|
| ESTATÍSTICAS | `stats` | Total de notas, % revisadas, criadas na semana, breakdown por pasta |
| COFRE | `para` | Cards de todas as pastas de topo + navegador inline |
| TAREFAS | `todoist` | Tarefas do Todoist em 3 caixas (Atrasadas · Hoje · Próximos N dias) + "Depois" (ler e concluir) |
| SINCRONIZAÇÃO | `sync` | Saúde do Syncthing (pasta + aparelhos) via API + lista de conflitos |
| ATIVIDADE DO COFRE | `heatmap` | Heatmap de notas criadas/dia via plugin Heatmap Calendar |
| CRESCIMENTO DO COFRE | `growth` | Notas criadas/dia nos últimos 30 dias; modo cumulativo disponível |
| Relatórios | `calendar` | Calendário semanal com notas das **fontes** configuradas (cards por dia) |

### Configurações (administração da aparência)

Toda a configuração de exibição fica em **Configurações → Werus Dashboard**:

- **Exibição do dashboard:** modo **compacto** (layout mais denso).
- **Seções do dashboard:** mostrar/ocultar e **reordenar** (▲▼) cada seção.
- **Pastas exibidas (cards do Cofre):** mostrar/ocultar cada pasta de topo.
- **Fontes dos Relatórios:** ativar/desativar, escolher a **cor** e **remover** cada fonte; **adicionar** qualquer pasta do cofre. As notas das fontes ativas aparecem como cards nos dias da seção Relatórios (posição pela data da nota).
- **Pacotes de tarefas:** criar/editar/remover pacotes (lançados na aba do Todoist).
- Além disso: token do **Todoist** + exibição das tarefas, e a **Sincronização** (Syncthing).

### Integração Todoist
- **Aba dedicada do Todoist** (área central — abre pelo ícone `list-checks` na ribbon, pelo comando **"Abrir Todoist"**, ou pelo botão `↗` no cabeçalho da seção TAREFAS do dashboard): hub com os **pacotes** no topo + a mesma lista de tarefas do dashboard. A seção TAREFAS do dashboard continua existindo; ambas compartilham o mesmo `TodoistController`.
- **Pacotes de tarefas:** conjuntos nomeados de tarefas que você **lança no Todoist num clique** (todas com data de hoje). Configure em **Configurações → Pacotes de tarefas** (nome, ícone opcional, projeto padrão e as tarefas — uma por linha); lance na aba do Todoist.
- **3 caixas lado a lado por urgência:** **Atrasadas** (vermelha) · **Hoje** (destaque) · **Próximos N dias** (lista agrupada por dia, com sub-título por dia). Cada linha tem **prioridade colorida** (🔴 p1 / 🟠 p2 / 🔵 p3 / cinza p4)
- **"Depois"** (tarefas além da janela, recolhível) aparece **só na aba do Todoist** — o **dashboard** fica enxuto (Atrasadas · Hoje · Próximos 7), então recorrentes distantes só entram nele perto do dia. O "Depois" é ordenado por **data** e, no mesmo dia, por **prioridade**
- **Toggle 3 / 7 dias** e **filtros por projeto/etiqueta** (chips) no header da seção
- **Criar tarefa:** botão **"+"** (com brilho vermelho) no header, na caixa Hoje e em cada dia (já preenche a data daquele dia)
- **Editar / excluir:** clicar numa tarefa abre o **pop-up de detalhes** (descrição em markdown com links); o botão **"✎ Editar"** abre o formulário (título, descrição, prioridade, data em texto natural pt, projeto, etiquetas) com **Salvar** e **Excluir** (confirmação). No editar envia só os campos alterados (preserva recorrência)
- **Concluir tarefa** pela checkbox (sync de duas vias: fecha no Todoist real via API) — conclusão otimista, reverte se a API falhar
- **Configurações → Exibição das tarefas:** mostrar **projeto** e/ou **etiquetas** nas linhas (padrão: só projeto). As **etiquetas** aparecem com a **cor do Todoist** (bolinha colorida) aqui e no pop-up/filtros/formulário
- Indicador `⟳` para tarefas recorrentes; botão `↻` de refresh manual; as 3 caixas empilham no celular
- Requer o token pessoal do Todoist nas configurações do plugin (salvo em `data.json`, fora do Git)

### Sincronização (Syncthing)
- **Estado da pasta** (em dia / sincronizando / scanning / erro) e, por **aparelho**: online, **completação %**, pendências e **último visto** — via API REST do Syncthing
- **Opção** "mostrar contagem de itens por aparelho" (`sincronizados/total`)
- **Conflitos:** lista os `*.sync-conflict-*` do cofre com **abrir** e **apagar** (confirmação → lixeira do Obsidian)
- Botão `↻` de refresh; se a API não responder, mostra aviso (não quebra)
- **Configurações → Sincronização:** URL (default `http://127.0.0.1:8384`), API key (em `data.json`, fora do Git) e ID da pasta (vazio = autodetecta). No celular, aponte a URL para a API de outra máquina na rede se a local não responder

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

### Fontes dos Relatórios
As notas das pastas marcadas como **fonte** (Configurações → Fontes dos Relatórios) aparecem como cards nos dias da seção **Relatórios**, cada fonte com sua cor. Padrão: `40.Archive/Relatórios Claude` e `50.Diário`. A posição vem do `date: YYYY-MM-DD` do frontmatter (ou da data no nome do arquivo).

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
