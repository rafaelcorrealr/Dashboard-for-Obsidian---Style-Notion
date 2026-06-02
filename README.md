# Werus Dashboard

Plugin Obsidian pessoal para o Second Brain. Exibe um dashboard com cards por pasta, estatísticas do cofre, calendário semanal, gráficos de atividade e navegador inline de notas.

> ⚠️ **Alpha** — desenvolvimento pessoal, não publicado. A primeira versão pública será `1.0.0`.
> Compatível com Obsidian ≥ 1.5.0 (desktop only).

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
| Seção | Conteúdo |
|---|---|
| `stats` | Total de notas, % revisadas, criadas na semana, breakdown por pasta |
| `para` | Cards do cofre + navegador inline |
| `heatmap` | Atividade do cofre via plugin Heatmap Calendar |
| `growth` | Notas criadas/dia nos últimos 30 dias; modo cumulativo disponível |
| `reports` | Últimos 6 relatórios Claude de `40.Archive/Relatórios Claude/` |
| `calendar` | Calendário semanal navegável com notas do dia |

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

---

## Estrutura do código

```
main.ts
├── reviewedStats()       — conta reviewed:true vs total em subárvore
├── folderStats()         — conta md e imagens em subárvore
├── coverInFolder()       — resolve cover: do status.md ou _cover.*
├── renderStats()         — painel de estatísticas
├── renderPara()          — grid de cards + navegador inline
├── renderBrowser()       — painel de navegação aninhada
├── renderNotes()         — lista/grid de notas com toggle e filtros
├── renderGrowth()        — gráfico de crescimento (dia/total)
├── renderHeatmap()       — heatmap via plugin heatmap-calendar
├── renderReports()       — lista de relatórios Claude
└── renderCalendar()      — calendário semanal
```

---

## Versão atual

**v0.2.4 (alpha)** — ver [CHANGELOG](CHANGELOG.md) para histórico de desenvolvimento.
A primeira versão pública será `1.0.0` ao publicar no GitHub.
