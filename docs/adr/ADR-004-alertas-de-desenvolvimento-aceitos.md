# ADR-004 — Aceitar os alertas de desenvolvimento do Dependabot

- **Situação:** Aceita.
- **Data:** 16/11/2026.
- **Ordem do responsável repassada pelo DG líder em 16/11/2026:** "Regra geral por ADR. alertas que nao atrapalham a producao, pode passar. os que atrapalham, entender, escolher a melhor estrategia para manter a funcionalidade"
- **Numeração:** continua a série ADR-001 a ADR-003 de [`ARQUITETURA.md`](../ARQUITETURA.md), seção 5. Complementa a ADR-002 (React 18 e `react-scripts` 5).

## Contexto

`gh api "repos/douglasabnovato/calculadora/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, 14:58: 51 alertas abertos, todos com escopo de desenvolvimento no `package-lock.json`.

- 30 já estão corrigidos na `developer/sprint-2026-11-19` (PR #39) e fecham com o merge na `main`.
- 21 seguem abertos, todos puxados pelo `react-scripts` 5.0.1, que está em `devDependencies`. A correção de cada um só existe numa versão maior que o `react-scripts` não aceita (detalhes na #38).

Prova de que esses 21 não chegam ao site, 16/11/2026:

- `npm ls @tootallnate/once svgo serialize-javascript webpack-dev-server deepmerge webpack-dev-middleware postcss uuid --package-lock-only --omit=dev`: `(empty)`.
- No `package-lock.json`, toda versão vulnerável desses pacotes tem `"dev": true`.
- `npm audit --omit=dev --package-lock-only`: `found 0 vulnerabilities`.

O site é o resultado do `npm run build`: arquivos estáticos na Netlify. O servidor de desenvolvimento, o Jest e as ferramentas de build rodam só na máquina de quem programa e no CI.

## Alertas aceitos

| Alerta | Pacote (versão) | Severidade | Quem o puxa | Por que não chega à produção |
|---|---|---|---|---|
| #9 | `@tootallnate/once` 1.1.2 | baixa | `react-scripts` → `jest` 27 → `jsdom` 16 → `http-proxy-agent` 4 | Só roda nos testes do Jest |
| #38 | `deepmerge` 4.3.1 | baixa | `react-scripts` → `@svgr/webpack`, `jest-config`, `fork-ts-checker-webpack-plugin`, `workbox-build` | Ferramentas de build e teste; sem versão corrigida publicada |
| #2, #7, #16, #17, #18 | `postcss` 7.0.39 | 2 altas, 3 médias | `react-scripts` → `resolve-url-loader` 4 | Processa o CSS no build; o site recebe só o CSS gerado |
| #5, #11, #35 | `serialize-javascript` 4.0.0 e 6.0.2 | 1 alta, 1 média, 1 baixa | `react-scripts` → `rollup-plugin-terser` (Workbox) e `css-minimizer-webpack-plugin` 3 | Minificação no build |
| #15, #19, #20 | `svgo` 1.3.2 | 2 altas, 1 média | `react-scripts` → `@svgr/webpack` 5 → `@svgr/plugin-svgo` | Otimiza SVG no build |
| #10 | `uuid` 8.3.2 | média | `react-scripts` → `webpack-dev-server` 4 → `sockjs` | Só no `npm start` local |
| #21 | `webpack-dev-middleware` 5.3.4 | alta | `react-scripts` → `webpack-dev-server` 4 | Só no `npm start` local |
| #3, #4, #8, #12, #13, #14 | `webpack-dev-server` 4.15.2 | 6 médias | `react-scripts` 5.0.1 | Só no `npm start` local |

## Decisão

Aceitar os 21 alertas acima. Eles não atrapalham a produção: nenhum vai para o build publicado. Não há dispensa de alerta pela API; os alertas seguem abertos no GitHub, e esta ADR registra o motivo.

## Consequências

- O risco fica no ambiente de quem desenvolve e no CI, não no site. Quem roda `npm start` numa rede aberta expõe o servidor de desenvolvimento; rode em `localhost`.
- O Dependabot continua mostrando os 21 alertas até a troca do Create React App.
- O critério 9 do [`MVP.md`](../MVP.md) conta estes alertas como decididos.

## Quando revisar

- Se algum desses pacotes passar a ir para o bundle (aparecer em `npm ls --omit=dev`).
- Se surgir correção sem versão maior dentro do `react-scripts` 5.
- Na migração do Create React App para o Vite (#22), que resolve os 21 de uma vez.
- Se aparecer alerta novo em pacote de runtime: esse não entra aqui e vai para correção.
