# MVP — Calculadora

> Criado em 31/10/2026. Revisto em 16/11/2026 contra a régua de `engenharia/arquitetura/padroes.md` (plano em `docs/PLANO-DE-ACAO.md`, seção "Ciclo de 16/11/2026"). Critério 9 revisto em 16/11/2026, 12:00, com os alertas do Dependabot ligados.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta.

**Resumo:** 9 de 10 aplicáveis atendidos

**Finalizado:** não. O único critério fora de "Atende" é o 9: o responsável ligou os alertas do Dependabot em 16/11/2026, e 21 dos 51 seguem sem correção nem decisão escrita (#38). Antes desta revisão: sim, porque o 9 dependia só da #31.

## Problema e hipótese

**Problema e público:** quem estuda React, e quem avalia o autor, vê uma calculadora web acessível, sem `eval`, com a regra numa máquina de estados testável.

**Hipótese:** acreditamos que uma pessoa, sem instrução, faz uma conta com dois operadores e copia o resultado, só com o mouse ou só com o teclado, nos dois temas.

**Meta:** o percurso completo (conta, cópia, erro de divisão por zero, Tab, Esc) passa no navegador, com zero violações do axe (WCAG 2.2 AA) nos temas Vivo e Dark.

**Saberemos quando:** o job `e2e` do CI (`e2e/fluxo.e2e.js`, Playwright no Chromium) passar com os 5 testes, sem `skipped`.

## 1. Critérios (16/11/2026)

| # | Critério | Situação | Evidência (comando, data e resultado) |
|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase em "Problema e hipótese" (16/11/2026) |
| 2 | Hipótese a validar | Atende | Hipótese, meta e "saberemos quando" acima (16/11/2026) |
| 3 | Fluxo principal completo | Atende | `npm run build && npm run test:e2e` em 16/11/2026: 5 passed no Chromium (conta pelo mouse e pelo teclado, cópia, erro). Job `e2e` verde no CI do PR #35, [run 43802742117](https://github.com/douglasabnovato/calculadora/actions/runs/43802742117) (16/11/2026) |
| 4 | Escopo enxuto | Atende | Seção 3, "Fora do MVP" (16/11/2026) |
| 5 | Medição de uso | Não se aplica (N1) | — |
| 6 | Falhas tratadas | Atende | `CI=true npm test -- --watchAll=false` em 16/11/2026: 51 passed. Divisão por zero e estouro com `role=alert`; `%` e `±` ignorados em erro (`calculator.test.js`); cópia sem Clipboard API ou com permissão negada mostra erro claro (`clipboard.test.js`, `Calculator.test.js` e o 5º teste do `fluxo.e2e.js`). Sem rede nem lista: não há carregamento a tratar |
| 7 | Desempenho aceitável | Não se aplica (N1) | Registro antigo: mediana de LCP de 1,68 s no site publicado em 02/11/2026 |
| 8 | Acessibilidade básica | Atende | `npm run test:e2e` em 16/11/2026: axe (WCAG 2.2 AA) sem violações nos temas Vivo e Dark, no erro, em 1280 px; Tab chega ao botão de tema, ao "Copiar resultado" e à tecla AC, e o teste mede o contorno de foco nos três (pelo menos 2 px; o CSS usa 3 px); Esc limpa. O axe achou `label-content-name-mismatch` na tecla AC, corrigido no ciclo. Job `e2e` verde no [run 43802742117](https://github.com/douglasabnovato/calculadora/actions/runs/43802742117) |
| 9 | Segurança e conformidade | Parcial | `gh api "repos/douglasabnovato/calculadora/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, 12:00: 51 alertas abertos, todos de desenvolvimento (1 crítico, 16 altos, 24 médios, 10 baixos). 30 alertas corrigidos na sprint-19 (PR #39); fecham com o merge na principal; 21 restam (#38), presos ao `react-scripts` 5.0.1 (só saem com versão maior ou com o Vite, #22). `npm audit --omit=dev`, 16/11/2026: 0 vulnerabilidades (nada disso vai para o site). Sem dados pessoais, sem segredo, sem `eval`. Os alertas do `react-scripts` ficam nas ferramentas de build (#22) |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/calculadora/rulesets/26932504` em 16/11/2026: `principal-protegida` ativo, com `pull_request`, `non_fast_forward`, `deletion` e o check `raiz` obrigatório. CI em PR e push para `main` e `developer/**`. Melhorias: Netlify esperar o run da `main` (#18) e exigir o `e2e` no ruleset (#30, responsável) |
| 11 | Testes dos fluxos críticos | Atende | Jobs `raiz` (51 testes Jest) e `e2e` (5 testes Playwright) no CI, verdes no [run 43802742117](https://github.com/douglasabnovato/calculadora/actions/runs/43802742117), sem `skip` no código (`grep -rn "skip" src e2e` sem resultado em 16/11/2026) |
| 12 | Documentação honesta | Atende | README com comandos conferidos contra o `package.json` (`start`, `test`, `build`, `test:e2e`) em 16/11/2026; link publicado com HTTP 200 e `<title>Calculadora · calcAPP</title>` em 16/11/2026; `docs/DEPLOY.md` com o passo a passo |

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Corrigir o link da demo e tirar o log de testes do Git | Feito (02/11) |
| 2 | Régua N1, resumo batendo com a tabela | Feito (03/11) |
| 3 | Teclas `%` e `±`, com teclado `%` e `F9` | Feito (03/11) |
| 4 | CI nos PRs para `developer/**` | Feito (03/11) |
| 5 | `main` protegida pelo ruleset `principal-protegida` | Feito pelo responsável (10/11) |
| 6 | `react-scripts` em `devDependencies`; `npm audit --omit=dev` no CI | Feito (16/11) |
| 7 | Playwright com axe e teclado; job `e2e` | Feito (16/11, #21) |
| 8 | Copiar o resultado | Feito (16/11, #20) |
| 9 | `netlify.toml` e build hook opcional no CI | Feito (16/11); ligar é do responsável (#18) |

## 3. Fora do MVP

Memória e calculadora científica. Histórico das contas (#19) e migração para o Vite (#22) são próximos passos.

## Histórico

- 16/11/2026, 12:00: alertas do Dependabot ligados. Critério 9 segue Parcial, com motivo novo (21 alertas sem correção nem decisão, #38; 30 corrigidos só na sprint, PR #39). Finalizado: sim → não. Resumo segue 9 de 10.

- 03/11/2026: 9 de 10 declarados. A revisão de 16/11 mostrou que 2, 3, 8 e 9 não tinham a evidência da régua (hipótese sem meta; só jsdom, sem Playwright; Lighthouse manual, sem axe no CI; `npm audit --omit=dev` com 43 alertas), e que o 10 já tinha. Contagem honesta antes do ciclo: 6 de 10.
- 02/11/2026: build local, LCP de 3,35 s antes e 3,19 s depois; site publicado, mediana de 1,68 s. Lighthouse 12.8.2, perfil móvel simulado.
