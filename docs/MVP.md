# MVP — Calculadora

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 03/11/2026 com a régua N1 (`docs/PLANO-DE-ACAO.md`, seção "Ciclo de 03/11/2026").

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta.

**Resumo:** 9 de 10 aplicáveis atendidos

**Finalizado:** sim. Todos os critérios aplicáveis atendem, menos o 10, que depende do responsável e tem a issue #18 (`depende-do-responsavel`). Desde 10/11/2026 a `main` está protegida; falta a Netlify publicar só depois do CI.

## Problema e hipótese

**Problema e público:** Mostra uma calculadora web acessível, sem `eval`, e a evolução de um componente para uma SPA.

**Hipótese:** Projeto de estudo: uma pessoa faz uma conta com teclado ou toque sem instrução. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 03/11/2026 | Evidência |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende | Seção acima |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: objetivo de estudo | Seção acima |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende | 41 testes no CI; site responde (HTTP 200 em 03/11) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende | Divisão por zero e estouro com mensagem em `role=alert`; `%` e `±` ignorados em erro (`calculator.test.js`) |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1) | Registro: mediana de 1,68 s no site publicado em 02/11/2026 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende | Lighthouse 100 em 02/11; foco visível; teclas novas com nome falado ("Percentual", "Trocar sinal") |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende | Sem dados, sem `eval` |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: a `main` está protegida e o workflow `CI` roda nos PRs para a `main` e a `developer/**`; falta a Netlify esperar o CI | `gh api repos/douglasabnovato/calculadora/rulesets` em 10/11/2026: ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão); #18 (responsável, parte da Netlify) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende | 41 testes: regras, tela e teclado |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende | README com Netlify, 41 testes e próximos passos (03/11) |

**Resultado:** 9 de 10 critérios aplicáveis atendidos. O 10 é parcial: a proteção da `main` saiu em 10/11/2026, e a Netlify esperar o CI depende do responsável (#18).

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Corrigir o link da demo e tirar o log de testes do Git | Feito (02/11) |
| 2 | Régua N1, resumo batendo com a tabela | Feito (03/11) |
| 3 | Teclas `%` e `±`, com teclado `%` e `F9` | Feito (03/11) |
| 4 | CI nos PRs para `developer/**` | Feito (03/11) |

## 3. Fora do MVP

Memória e calculadora científica. Histórico e copiar resultado viraram próximos passos (#19, #20).

## Medições de 02/11/2026

Build local, antes da mudança: mediana do LCP de 3,35 s, desempenho 76. Depois: 3,19 s, desempenho 87, acessibilidade 100. No site publicado, a mediana foi 1,68 s (tabela acima). Lighthouse 12.8.2, perfil móvel simulado, sem aparelho real.
