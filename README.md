# Werus Dashboard

> 🤖 **Este app está sendo criado com o Claude Code** (Anthropic) — desenvolvimento assistido por IA, uma versão por vez, a partir dos pedidos do autor.

Plugin Obsidian pessoal para o Second Brain. Reúne num só lugar: cards por pasta, estatísticas do cofre, calendário/relatórios, hub do **Todoist** (tarefas + pacotes), **gamificação** das tarefas (XP/níveis), saúde do **Syncthing**, avisos de urgência, gráficos de atividade e navegador inline de notas.

> ✅ **v1.0.0** — primeira versão estável. Desenvolvimento pessoal, publicado no GitHub.
> Compatível com Obsidian ≥ 1.5.0, **desktop e mobile** (Android testado).
> **Responsivo por largura do painel:** quando um painel fica estreito (≤ 600px) — inclusive no PC, com abas lado a lado — entra em **modo Android** (layout compacto + alvos de toque maiores). Vale para Dashboard, Todoist e Gamificação.
> **Segue o tema do Obsidian** (claro/escuro) automaticamente, usando a cor de destaque do seu tema.

---

## Funcionalidades

### Cards do cofre
- Todas as pastas de topo viram cards com ícone, cor de acento e contagem de notas
- Pastas PARA (Inbox, Projects, Areas, Resources, Archive) têm cor e ícone fixos; demais recebem cor por hash do nome
- Barra de progresso `reviewed` na base de cada card (X/Y notas revisadas)
- Imagem de capa configurável (`cover:` no `status.md` ou `_cover.*`)
- Mostrar/ocultar cada card pelas **Configurações** do plugin

### Navegador inline
- Clicar num card abre painel de subpastas abaixo do grid, sem trocar de view
- Navegação em qualquer profundidade com breadcrumb clicável
- **Busca em tempo real**: filtra subpastas e notas instantaneamente
- Lista/grid de notas da pasta atual com indicador `reviewed` e toggle de visualização
- Filtro "pendentes": mostra só notas com `reviewed: false`

### Seções (reordenáveis e ocultáveis pelas Configurações)

A coluna **Nome no dashboard** é o título que aparece na tela; **id** é o valor usado em
`sectionOrder` no `data.json`. A **ordem** e a **visibilidade** de cada seção são ajustadas em
**Configurações → Werus Dashboard → Seções do dashboard** (a dashboard em si não tem mais
setas ▲▼ nem botões de ocultar durante o uso — desde a v0.11.0).

| Nome no dashboard | id (`sectionOrder`) | Conteúdo |
|---|---|---|
| ESTATÍSTICAS | `stats` | Total de notas, % revisadas, criadas na semana, breakdown por pasta |
| TAREFAS | `todoist` | Tarefas do Todoist em 3 caixas (Atrasadas · Hoje · Próximos N dias); "Depois" só na aba |
| GAMIFICAÇÃO | `game` | Faixa com XP, nível, streak e XP de hoje (painel completo na aba própria) |
| COFRE | `para` | Cards de todas as pastas de topo + navegador inline |
| SINCRONIZAÇÃO | `sync` | Saúde do Syncthing (pasta + aparelhos) via API + lista de conflitos |
| ATIVIDADE DO COFRE | `heatmap` | Heatmap de notas criadas/dia via plugin Heatmap Calendar |
| CRESCIMENTO DO COFRE | `growth` | Notas criadas/dia nos últimos 30 dias; modo cumulativo disponível |
| RELATÓRIOS | `calendar` | Calendário semanal com notas das **fontes** configuradas (cards por dia) |

### Integração Todoist
- **Aba dedicada do Todoist** (área central — abre pelo ícone `list-checks` na ribbon, pelo comando **"Abrir Todoist"**, ou pelo botão `↗` no cabeçalho da seção TAREFAS): hub com os **pacotes** no topo + a mesma lista de tarefas do dashboard. Dashboard e aba compartilham o mesmo `TodoistController` (estado compartilhado, 1 fetch só).
- **Pacotes de tarefas:** conjuntos nomeados de tarefas que você **lança no Todoist num clique** (todas com data de hoje). Configure em **Configurações → Pacotes de tarefas** (nome, ícone, projeto padrão, etiquetas e as tarefas — uma por linha; cada linha aceita `@etiqueta` e prioridade `p1`–`p4` inline). Lance na aba do Todoist.
- **3 caixas lado a lado por urgência:** **Atrasadas** (vermelha) · **Hoje** (destaque) · **Próximos N dias** (lista agrupada por dia). Prioridade colorida por linha (🔴 p1 / 🟠 p2 / 🔵 p3 / cinza p4)
- **"Depois"** (tarefas além da janela) aparece **só na aba** — o **dashboard** fica enxuto (Atrasadas · Hoje · Próximos 7). Ordenado por data e, no mesmo dia, por prioridade
- **Toggle 3 / 7 dias** e **filtros por projeto/etiqueta** (chips) no header
- **Criar / editar / excluir** tarefas (sync de duas vias com o Todoist real); **concluir** pela checkbox (otimista); descrição em markdown com links no detalhe
- **Cache offline** (localStorage) + auto-refresh por TTL: a aba abre com as últimas tarefas mesmo sem conexão
- Requer o token pessoal do Todoist nas configurações (salvo em `data.json`, fora do Git)

### Gamificação (configurável e compartilhável)
Transforma tarefas concluídas em **XP**, níveis, conquistas e metas. Aba própria **Gamificação** (ícone `trophy` + comando **"Abrir Gamificação"**) + uma **faixa no dashboard** (seção `game`). O histórico mora num **log no cofre** — `20.Areas/Gamificação.md` — que é a fonte canônica (não depende do limite de ~3 meses da API do Todoist).

**Tudo é configurado numa nota declarativa — `Gamificação — Regras.md`** (caminho ajustável nas Configurações), num bloco `json` auto-documentado. Edite pelo ✏️; bloco inválido → padrões embutidos. **Compartilhe a nota = compartilha o "jogo" inteiro** (XP, níveis, conquistas, metas, projetos e etiquetas).

- **Coleta:** **"Salvar concluídas"** lê as tarefas concluídas do Todoist, grava no log com o XP e **apaga do Todoist** (recorrentes são registradas mas não apagadas). O botão **"não feito" (✗)** registra a falha com **punição** e apaga. Sempre confirma.
- **XP por tarefa = prioridade + Σ(etiquetas)** — totalmente configurável (`xpByPriority`, `xpByLabel`; bônus de etiqueta pode ser negativo). Uma "fórmula visual" na aba mostra os valores atuais.
- **Níveis por fórmula ou tabela:** `levelCurve` (padrão `100 * n^2`) vale para o nível geral e por escopo; cada projeto/etiqueta pode ter níveis próprios via `scopeLevels` — fórmula com teto (`{ "levels": N, "curve": "..." }`) ou tabela de limiares (`{ "thresholds": [...] }`). Fórmulas avaliadas por um interpretador aritmético **seguro**.
- **Conquistas** (badges declarativas, permanentes, com "novo!") e **metas** (`goals` por dia/semana/mês/ano, de XP ou nº de tarefas, com filtro por projeto/etiqueta) — ambas editáveis na nota de Regras, com barras de progresso na aba.
- **Escopos (projetos/etiquetas)** com selos de origem **Cofre / Todoist / Hist** e ação na divergência: **apagar do histórico** (órfão), **+ Cofre** (registrar e configurar) ou **+ Todoist** (criar lá). Botão **"Provisionar Todoist"** cria de uma vez tudo o que falta.
- **Gráfico de XP por dia** (30 / 15 dias, **barras ou linha**), **streak** (atual + recorde) e **XP de hoje** — na aba.
- **Configurações → Gamificação:** ligar/desligar, fator de punição, caminho da nota de Regras, regenerar documentação, provisionar Todoist.
- Referência conceitual em `10.Projects/Werus Dashboard/Gamificação — Níveis e Conquistas.md`; a referência completa dos campos fica na própria nota de Regras.

### Sincronização (Syncthing)
- **Estado da pasta** e, por **aparelho**: online, **completação %**, pendências e **último visto** — via API REST do Syncthing
- **Conflitos:** lista os `*.sync-conflict-*` do cofre com **abrir** e **apagar** (confirmação → lixeira do Obsidian)
- **Configurações → Sincronização:** URL (default `http://127.0.0.1:8384`), API key e ID da pasta. Essas três credenciais ficam no **localStorage por-dispositivo** (não no `data.json`, que sincroniza), porque cada máquina tem a sua própria API key

### Aviso de urgência
- Notas com frontmatter `urgency: baixa | media | alta` acendem um ícone de aviso (`triangle-alert`) no card da pasta que as contém (propaga em qualquer nível, usa a maior urgência da subárvore)
- Cor por nível: alta = vermelho com glow/pulse · media = laranja · baixa = amarelo

### Responsividade (modo Android por largura do painel)
- O plugin carrega no Obsidian Mobile (`isDesktopOnly: false`). Instalação automática: o Syncthing já leva o cofre + `main.js` pro aparelho; basta habilitar o plugin no app
- O **modo Android** é disparado pela **largura do painel** (≤ 600px), não pelo dispositivo — então estreitar uma aba no PC já compacta o layout (calendário de 3 dias, grids 2 colunas, caixas do Todoist empilhadas, heatmap oculto, gráficos em 15 dias, alvos de toque maiores). Cada painel decide pelo seu próprio tamanho

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
Campo de frontmatter em qualquer nota `.md`: `reviewed: true | false` (padrão `false` quando ausente).
`true` → dot verde no dashboard; `false`/ausente → dot escuro, contado como "pendente" no filtro.

### `urgency`
Campo opcional em qualquer nota `.md`: `urgency: baixa | media | alta`. Acende o ícone de aviso no card da pasta (cor pelo nível). Ausente → sem aviso.

### Imagem de capa (fallback)
Sem `cover:` no `status.md`, o plugin procura um arquivo `_cover` (qualquer extensão: `.png`, `.jpg`, `.webp`, `.gif`, `.svg`) na pasta. Sem `_cover`, os cards do topo (PARA) recebem capa padrão: gradiente da cor de acento + ícone da pasta como marca d'água.

### Fontes dos Relatórios
As notas das pastas marcadas como **fonte** (Configurações → Fontes dos Relatórios) aparecem como cards nos dias da seção **Relatórios**, cada fonte com sua cor. Padrão: `40.Archive/Relatórios Claude` e `50.Diário`. A posição vem do `date: YYYY-MM-DD` do frontmatter (ou da data no nome do arquivo).

### Calendário e notas diárias
Notas com `date: YYYY-MM-DD` aparecem como pílulas no dia correspondente. Clicar no cabeçalho de um dia abre a nota diária; se não existir, é criada em `50.Diário/YYYY-MM-DD.md` (a partir do template `Modelos/Nota Diária.md`, com fallback embutido).

### Log de gamificação
`20.Areas/Gamificação.md` contém um bloco cercado ```` ```wd-game-log ```` ```` mantido pelo plugin (fonte canônica do XP). Não editar à mão — é determinístico para não gerar conflito no Syncthing.

---

## Instalação / Build

### Requisitos
- Node.js (via nvm recomendado) + pnpm

### Compilar
```bash
cd "Second Brain/.obsidian/plugins/werus-dashboard"
pnpm install
pnpm build          # compila main.ts → main.js
pnpm dev            # modo watch
npx tsc --noEmit    # verificar tipos (o esbuild NÃO checa tipos)
```
Após compilar, recarregue o Obsidian: `Ctrl+R`.

---

## Settings persistidas (`data.json`)

| Campo | Tipo | Descrição |
|---|---|---|
| `sectionOrder` | `string[]` | Ordem das seções no dashboard |
| `compact` | `boolean` | Modo compacto |
| `hidden` | `string[]` | Pastas e seções ocultas |
| `noteView` | `"list" \| "grid"` | Visualização padrão das notas |
| `todoistToken` | `string` | Token da API do Todoist |
| `todoistShowProject` / `todoistShowLabels` | `boolean` | Mostrar projeto/etiquetas nas linhas |
| `todoistDayRange` | `3 \| 7` | Janela "Próximos N dias" |
| `todoistFilters` | `{projects,labels}` | Filtros (chips) de projeto/etiqueta |
| `taskPackages` | `Package[]` | Pacotes de tarefas (nome/ícone/projeto/etiquetas/tarefas) |
| `packageConfirm` | `"always"\|"many"\|"never"` | Quando confirmar o lançamento de pacote |
| `calendarSources` | `{path,color,on}[]` | Fontes da seção Relatórios |
| `gamificationEnabled` | `boolean` | Liga a gamificação |
| `gamePenaltyFactor` | `number` | Fator da punição de "não feito" (default 1,5) |
| `gameLastHarvest` | `string` | Controle da última colheita |
| `gameRulesPath` | `string` | Caminho da nota de Regras (default `20.Areas/Gamificação — Regras.md`) |
| `gameAchievements` | `{[id]:data}` | Data de desbloqueio de cada conquista |
| `gameChartMode` / `growthChartMode` | `"bars"\|"line"` | Modo dos gráficos de XP/dia e Crescimento |

> O **conteúdo do jogo** (XP por prioridade/etiqueta, curvas/tabelas de níveis, conquistas, metas, projetos e etiquetas) **não** fica no `data.json`: vive na **nota de Regras** (`gameRulesPath`), em texto, para poder ser editada e compartilhada.
> As credenciais do **Syncthing** (URL, API key, ID da pasta) ficam no **localStorage por-dispositivo**, não no `data.json` — cada máquina tem a sua. O `data.json` e o token do Todoist ficam fora do Git (`.gitignore`).

---

## Estrutura do código (`main.ts`)

- **Views** (`extends WdView`, que observa a largura do painel via `ResizeObserver`): `DashboardView`, `TodoistView`, `GamificationView`.
- **Controllers** (estado único, compartilhado por dashboard + aba): `TodoistController` (fetch/ações/pacotes/cache), `GameController` (log de XP, colheita, regras, painel, níveis, conquistas, metas e reconciliação de escopos).
- **Regras da gamificação:** `parseGameRules`/`buildGameRulesContent` (nota declarativa), `compileFormula` (interpretador aritmético seguro), `levelFromThr`/`scopeLevelFn` (níveis por curva/tabela), `computeGameStats(events, rules)`, `evalAchievement`, `goalProgress`.
- **Cache do cofre:** `buildVaultCache(app)` faz **uma** varredura → `VaultCache` (stats por pasta, datas, ctime/dia), invalidado por eventos do vault.
- **Helpers:** `isPhoneWidth`, `reviewedStats`, `folderStats`, `filesIn`, `urgencyStats`, `coverInFolder`, `fetchTodoistTasks`/`closeTodoistTask`, e os `render*` por seção.
- **Settings:** `WerusSettingTab` (toda a administração de exibição, fontes, pacotes, Todoist, Syncthing e gamificação).

---

## Versão atual

**v1.0.0** — primeira versão estável. Ver [CHANGELOG](CHANGELOG.md) para o histórico de desenvolvimento.
