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

## Ciclo de 16/11/2026

> Branch `feature/2026-11-16` → `developer/sprint-2026-11-12` (o PR #29 para a `main` segue aberto) → `main`. Nível: Estudo (N1), 10 critérios aplicáveis (5 e 7 não se aplicam).

### Produto

**Problema e público.** Quem estuda React, e quem avalia o autor, vê uma calculadora acessível, sem `eval`, com a regra numa máquina de estados testável.

**Hipótese e meta.** Acreditamos que uma pessoa, sem instrução, faz uma conta com dois operadores e copia o resultado, só com o mouse ou só com o teclado. Saberemos quando o teste de ponta a ponta no navegador (Playwright) fizer esse percurso no CI, nos dois temas, com o axe sem violações.

**Revisão contra a régua (16/11/2026).** O `MVP.md` dizia 9 de 10. Pela régua de `padroes.md`, 6 tinham a evidência pedida (1, 4, 6, 10, 11 e 12). Quatro "Atende" não tinham, e o 10 estava abaixo do que a evidência já mostrava:
- 2: a hipótese não tinha meta nem "saberemos quando".
- 3: não havia teste no navegador (Playwright) no CI; havia só Jest com jsdom.
- 8: a evidência era um Lighthouse manual de 02/11; não havia axe nem teste de teclado no CI.
- 9: `npm audit --omit=dev` apontava 43 alertas (1 crítico), todos do `react-scripts`, que estava em `dependencies`. O risco não estava decidido.
- 10: estava "Parcial", mas já tinha a evidência que a régua pede: CI nos PRs e o ruleset `principal-protegida`, que exige PR e o check `raiz` verde.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Teste de acessibilidade com `@axe-core/playwright` | O axe roda dentro do teste de ponta a ponta, na página montada, em cada tema e no estado de erro. O guia avisa que o axe acha só parte dos problemas; por isso o teste também percorre a tela por teclado | [Playwright: Accessibility testing](https://playwright.dev/docs/accessibility-testing) |
| `navigator.clipboard.writeText` só existe em contexto seguro (HTTPS ou localhost) e pode ser negado | A cópia nunca lança erro: sem a API ou com a permissão negada, a tela mostra uma mensagem clara | [MDN: Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) |
| Mensagem de status sem mover o foco (WCAG 4.1.3) | "Resultado copiado" sai numa região `role="status"`, e o foco fica onde estava | [W3C: Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) |
| Build hook da Netlify e "Ignore builds" | O CI chama o build hook só depois de passar na `main`; na Netlify, o comando de ignorar cancela o build que não vem do hook (`INCOMING_HOOK_URL` vazio). "Stopped builds" não serve: com ele, o hook também não publica. Fica pronto no workflow; ligar é do responsável (#18) | [Netlify: Build hooks](https://docs.netlify.com/build/configure-builds/build-hooks/), [Netlify: Ignore builds](https://docs.netlify.com/build/configure-builds/ignore-builds/), [Netlify: Stop or activate builds](https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/) |
| `npm audit --omit=dev` mede só o que vai para produção | Ferramenta de build fica em `devDependencies`; em `dependencies` ficam só `react`, `react-dom` e `web-vitals` | [npm: npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | `react-scripts` em `devDependencies`; `npm audit --omit=dev` limpo | Alto | Baixo | Este ciclo |
| 2 | `MVP.md` honesto: hipótese com meta, tabela com evidência da régua | Alto | Baixo | Este ciclo |
| 3 | Teste Playwright do fluxo principal com axe (claro, escuro e erro) e teclado; job `e2e` no CI | Alto | Médio | Este ciclo (fecha #21) |
| 4 | Copiar o resultado, com erro claro sem a Clipboard API | Médio | Baixo | Este ciclo (fecha #20) |
| 5 | `netlify.toml`, passo do build hook no CI e `DEPLOY.md` | Médio | Baixo | Este ciclo; ligar é do responsável (#18) |
| 6 | Exigir o check `e2e` no ruleset da `main` | Médio | Baixo | Responsável (issue nova) |
| 7 | Ligar os alertas do Dependabot | Médio | Baixo | Responsável (issue nova) |
| 8 | Histórico das contas | Médio | Médio | Issue (#19) |
| 9 | Vite no lugar do CRA | Médio | Médio | Issue (#22) |
| 10 | Colar um número no visor; teste com leitor de tela real | Baixo | Baixo | Issues novas |

**Fora do escopo.** Memória (M+, MR), modo científico, medição de uso, migrar para o Vite neste ciclo.

### Engenharia

**Arquitetura.** Sem mudança na FSM. A cópia fica num módulo novo, `src/core/clipboard.js`, que devolve `{ ok, message }` e nunca lança erro. O `Calculator` guarda a mensagem e a apaga a cada ação nova. O teste de ponta a ponta serve a pasta `build/` com um servidor estático de Node, sem dependência nova, numa porta própria.

**Riscos.**
- `react-scripts` em `devDependencies`: a Netlify instala as dependências de desenvolvimento por padrão. Se alguém definir `NODE_ENV=production` no painel, o build quebra. O `netlify.toml` fixa o comando e a pasta.
- Os 43 alertas seguem no `npm audit` completo, nas ferramentas de build. Não vão para o navegador. A saída é o Vite (#22).
- O job `e2e` instala o Chromium no CI e deixa o PR mais lento.
- O check `e2e` só bloqueia o merge na `main` quando o responsável o puser no ruleset.

**Qualidade.**
- Testes: unitários e de interface no Jest, mais o teste de ponta a ponta no Chromium.
- Acessibilidade: axe nos dois temas e no erro, em largura de desktop; Tab, foco visível e Esc no teste.
- Desempenho: não se aplica (N1).
- Segurança: `npm audit --omit=dev` sem alertas; sem dados, sem `eval`, sem segredo.

**Definição de pronto.** `npm ci`, `npm test`, `npm run build` e `npm run test:e2e` passam; CI verde nos jobs `raiz` e `e2e`; `docs/MVP.md`, README e `DEPLOY.md` atualizados; revisão independente feita.

### Plano de ação

**Este ciclo executa.**
1. `react-scripts` em `devDependencies` e auditoria de produção.
2. Teste Playwright com axe e teclado, e job `e2e` no CI.
3. Botão e atalho para copiar o resultado (#20).
4. `netlify.toml`, build hook opcional no CI e `DEPLOY.md`.
5. `MVP.md` e README com a evidência da régua.

**Vira issue.** Exigir o check `e2e` na `main` e ligar o Dependabot (responsável); colar um número no visor; teste com leitor de tela real; mesclar o ciclo na `main` (responsável).
