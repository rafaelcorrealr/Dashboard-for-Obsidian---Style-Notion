# Changelog — Werus Dashboard

> **Estado atual:** Alpha — desenvolvimento pessoal, não publicado.
> A primeira versão pública será `1.0.0` ao publicar no GitHub/marketplace.
> Versões `0.x.x` = iterações internas de desenvolvimento.

---

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
