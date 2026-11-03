# Plano de ação — Calculadora (calcAPP)

| # | Prioridade | Tarefa | Defeito | Critério | Ganho | Esforço | Status |
|---|---|---|---|---|---|---|---|
| T01 | Must | FSM pura em `core/calculator.js` com `useReducer` | D1, D5 | C1, C7 | Alto | 3 | ✅ Feito |
| T02 | Must | Erro claro para divisão por zero e estouro | D2 | C2 | Alto | 1 | ✅ Feito |
| T03 | Must | Nova conta após "=", vírgula segura, troca de operador, "=" repetido | D1 | C1 | Alto | incluído em T01 | ✅ Feito |
| T04 | Should | Teclado físico e tecla ⌫ | D3 | C1, C3 | Médio | 1 | ✅ Feito |
| T05 | Should | Acessibilidade: `output aria-live`, nomes falados, foco visível, contraste AA | D4 | C3 | Médio | 1 | ✅ Feito |
| T06 | Should | Visor em pt-BR (vírgula) e expressão pendente ("12 ×") | — | C1, C2 | Médio | 1 | ✅ Feito |
| T07 | Should | CRA 5 + React 18, sem flag OpenSSL | D6 | C9 | Médio | 1 | ✅ Feito |
| T08 | Should | `index.html` e manifesto corretos | D7 | C9 | Baixo | 1 | ✅ Feito |
| T09 | Should | Tema segue o sistema e fica salvo; `aria-pressed` | — | C1, C3 | Baixo | 1 | ✅ Feito |
| T10 | Should | 28 testes (20 unitários + 8 de interface) | — | C6 | Alto | 2 | ✅ Feito |
| T11 | Should | README atualizado | D8 | C10 | Médio | 1 | ✅ Feito |
| T12 | Must (usuário) | Apagar `test-results.log`; `npm install` (novo lockfile) | D8 | C10 | Baixo | 1 | ⏳ Com você |
| T13 | Won't (agora) | %, ±, memória, histórico, Vite | — | — | — | — | % e ± feitos em 03/11; o resto virou issue |

## Definição de pronto

- `npm test -- --watchAll=false` (28/28) e `npm run build` com `CI=true`.
- axe-core sem violações nos dois temas, inclusive no estado de erro.

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `main`. Nível: Estudo (N1), 10 critérios aplicáveis (5 e 7 não se aplicam).

### Produto

**Problema e público.** Quem estuda React, e quem avalia o autor, vê uma calculadora acessível, sem `eval`, com a regra numa máquina de estados testável.

**Hipótese e meta.** Uma pessoa faz uma conta com teclado ou toque sem instrução. Em N1 não há medição; a meta fica como proposta.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Tecla `%` das calculadoras de celular | Em `+` e `−`, o percentual sai do 1º número (100 + 20 % = 120); em `×`, vira fração (100 × 20 % = 20). Seguimos essa regra, que é a que a pessoa espera | [Comunidade Apple: % no iOS 18](https://origin-discussions2-us-dr-prz.apple.com/thread/255858773), [Straight Dope: como funciona a tecla %](https://www.straightdope.com/21342679/how-does-a-calculator-percent-key-work) |
| Tecla `±` com atalho de teclado | A calculadora do Windows usa `F9` para trocar o sinal. Usamos o mesmo atalho | [Microsoft: atalhos de teclado do Windows (Calculadora)](https://support.microsoft.com/pt-br/windows/atalhos-de-teclado-do-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec) |
| Nome acessível em toda tecla; visor como região viva | Cada controle precisa de nome falado e foco visível; o visor anuncia com `polite` e o erro com `alert`. As teclas novas ganharam "Percentual" e "Trocar sinal" | [Pearson: calculadora acessível](https://accessibility.pearson.com/resources/developers-corner/reference-library/calculator) |
| A Netlify não espera o GitHub Actions | O caminho é desligar a publicação automática e chamar um build hook no fim do CI. É configuração de conta: virou issue do responsável | [Fórum da Netlify](https://answers.netlify.com/t/github-actions-ci-tests-netlify-branch-deployments/51501) |
| Create React App descontinuado | O time do React indica migrar. Virou issue | [Blog do React, 14/02/2025](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Régua N1 e resumo do `MVP.md` batendo com a tabela | Alto | Baixo | Este ciclo |
| 2 | CI também na `developer` | Alto | Baixo | Este ciclo |
| 3 | Teclas `%` e `±` | Médio | Baixo | Este ciclo |
| 4 | README e `DEPLOY.md` com a Netlify; sai o `render.yaml` | Médio | Baixo | Este ciclo |
| 5 | Publicar só depois do CI e proteger a `main` | Alto | Baixo | Responsável (#18) |
| 6 | Axe no CI | Médio | Baixo | Issue (#21) |
| 7 | Histórico das contas | Médio | Médio | Issue (#19) |
| 8 | Copiar o resultado | Baixo | Baixo | Issue (#20) |
| 9 | Vite no lugar do CRA | Médio | Médio | Issue (#22) |
| 10 | "O que aprendi" e futuro do projeto | Médio | Baixo | Responsável (#23) |

**Fora do escopo.** Memória (M+, MR), modo científico, medição de uso.

### Engenharia

**Arquitetura.** React 18 com Create React App. Toda regra fica em `src/core/calculator.js`, uma função pura `(estado, ação) → estado` usada com `useReducer`. As teclas novas são duas ações: `PERCENT` e `NEGATE`. O campo `fresh` marca o valor vindo de `%`, para o próximo dígito começar um número novo.

**Riscos.**
- A tecla `%` muda de regra entre calculadoras. Escolhemos a do celular e a documentamos nos testes.
- O redutor desliga `fresh` em toda ação que não seja `%` ou `±`. Uma ação nova precisa seguir essa regra.
- A Netlify publica sem esperar o CI (#18).

**Qualidade.**
- Testes: 41 (eram 28), com `%` em cada operador, dígito depois de `%`, `%` em erro, `±` no zero e a grade com 20 teclas.
- CI: agora também em push e PR para `developer/**`.
- Acessibilidade: botões nativos com nome falado; grade 4 × 5 sem tecla dupla.
- Desempenho: não se aplica (N1); a última medida fica registrada no `MVP.md`.
- Segurança: sem dados, sem `eval`.

**Definição de pronto.** `npm ci`, `npm test` e `npm run build` passam; CI verde nos dois PRs; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Régua N1 no `MVP.md`, com evidência por linha.
2. CI na `developer`.
3. Teclas `%` e `±`, com teclado e testes.
4. README e `DEPLOY.md` com a Netlify; sai o `render.yaml`.

**Vira issue.** #18 e #23 (responsável); #19, #20, #21 e #22 (agente).
