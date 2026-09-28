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
| T13 | Won't (agora) | %, ±, memória, histórico, Vite | — | — | — | — | Roadmap |

## Definição de pronto

- `npm test -- --watchAll=false` (28/28) e `npm run build` com `CI=true`.
- axe-core sem violações nos dois temas, inclusive no estado de erro.
