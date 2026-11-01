# MVP — Calculadora

> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

## Problema e hipótese

**Problema e público:** Mostra uma calculadora web acessível, sem `eval`, e a evolução de um componente para uma SPA.

**Hipótese:** Projeto de estudo: uma pessoa faz uma conta com teclado ou toque sem instrução. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 31/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: objetivo de estudo |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: testes passam e o site responde na Netlify |
| 4 | Escopo enxuto | O que não entra está registrado | Atende |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica a estudo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial: regras testadas; o erro de divisão não foi revisto neste ciclo |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido neste ciclo |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: `aria-live`, nomes das teclas e contraste no README; não medido |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende: sem dados |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: CI ativo; a Netlify não depende dele; `main` sem proteção |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: regras e tela |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com a correção do link em PR |

**Resultado:** 7 de 12 critérios atendidos por inteiro. É um julgamento técnico.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Corrigir o link da demo e tirar o log de testes do Git | PR aberto |

## 3. Fora do MVP

Histórico, memória e calculadora científica. A lista é uma proposta e pode mudar com a decisão do responsável.
