# Análise do projeto — Calculadora (calcAPP)

> Data da análise: 27/09/2026 · Branch analisada: `main` · Grupo: **front-end puro (SPA)**

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema | Fazer contas rápidas no navegador sem abrir outro aplicativo, com leitura confortável em qualquer tela. |
| Público | Qualquer pessoa no computador ou celular, incluindo quem usa só o teclado ou leitor de tela. |
| Proposta de valor | Calculadora de quatro operações, com visor em português (vírgula decimal), teclado físico, mensagens claras de erro e tema claro/escuro. |
| Origem | Curso React + Redux (Cod3r), evoluído com design system próprio. |
| Métrica norte (proposta) | Contas concluídas sem erro por sessão. |

## 2. Especificação de requisitos

### 2.1 Requisitos funcionais

| ID | Requisito | Situação encontrada |
|---|---|---|
| RF01 | Somar, subtrair, multiplicar e dividir. | Atende |
| RF02 | Encadear operações (2 + 3 × 4 = 20, da esquerda para a direita). | Atende |
| RF03 | Começar nova conta ao digitar depois do "=". | **Não atende**: concatena ao resultado (5 → 55). |
| RF04 | Digitar vírgula depois do "=". | **Não atende**: quebra a aplicação (`displayValue.includes` em número). |
| RF05 | Informar divisão por zero. | **Não atende**: mostra 0 como se fosse um resultado válido. |
| RF06 | Trocar de operador antes do segundo número. | Atende parcialmente: aplica a operação anterior com 0. |
| RF07 | Apagar o último dígito. | Não existe. |
| RF08 | Usar o teclado físico. | Não existe. |
| RF09 | Alternar tema e lembrar a escolha. | Parcial: alterna, mas não lembra nem respeita a preferência do sistema. |

### 2.2 Requisitos não funcionais

| ID | Característica | Requisito | Situação |
|---|---|---|---|
| RNF01 | Acessibilidade (WCAG 2.2 AA) | Visor anunciado, teclas com nome falado, foco visível, contraste. | Não atende (D4) |
| RNF02 | Manutenibilidade | Regras de cálculo isoladas e testáveis sem a interface. | Não atende (D5) |
| RNF03 | Portabilidade | Rodar em Node LTS sem `--openssl-legacy-provider`. | Não atende (D6) |
| RNF04 | Confiabilidade | Nenhuma sequência de teclas quebra a aplicação. | Não atende (RF04) |

## 3. Diagnóstico

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | Alta | `Calculator.jsx` | Estado implícito (`current`, `clearDisplay`, `values`) sem modelo formal: depois do "=" o visor vira `number` e a vírgula quebra a tela; digitar concatena ao resultado. | Máquina de estados finita (autômato determinístico) |
| D2 | Alta | `Calculator.jsx` | Divisão por zero exibida como 0 (resultado falso). | Heurística de Nielsen nº 9 |
| D3 | Média | `Calculator.jsx` | Sem teclado físico nem tecla de apagar. | Nielsen nº 7 (flexibilidade e eficiência) |
| D4 | Média | componentes | Visor sem `aria-live`; "*" e "/" lidos como "asterisco" e "barra"; `outline: none` nos botões; contraste do botão laranja (2,6:1). | WCAG 2.2 — 1.4.3, 2.4.7, 4.1.2, 4.1.3 |
| D5 | Média | `Calculator.jsx` | Regra de negócio acoplada ao componente de classe; testes só por interface. | Clean Architecture (regra independente de UI) |
| D6 | Média | `package.json` | `react-scripts` 4 com `--openssl-legacy-provider`; React 17 (API `ReactDOM.render` removida no 18). | Débito técnico de plataforma |
| D7 | Baixa | `public/index.html` | Manifesto e ícone apontam para arquivos que não existem (`manifest.json`, `logo192.png`); descrição padrão do CRA; fonte carregada (Roboto Mono) diferente da usada (Roboto). | Qualidade de entrega |
| D8 | Baixa | `test-results.log` | Log antigo com testes **falhando** versionado, enquanto o README diz 100% aprovado. | Documentação como contrato |

## 4. Critérios de MVP e nota atual

Pesos do grupo **front-end puro**. Aprovação: média ≥ 7,0 **e** C1 e C4 ≥ 5. Como não há dados pessoais nem rede, C4 avalia robustez da entrada e ausência de `eval`.

| # | Critério | Peso | Nota atual | Justificativa |
|---|---|---|---|---|
| C1 | Núcleo de valor | 20% | 6 | Contas básicas funcionam; RF03–RF05 falham. |
| C2 | Estados | 12% | 4 | Erro de divisão escondido; tela quebra com vírgula após "=". |
| C3 | Acessibilidade | 12% | 4 | D4. |
| C4 | Segurança / robustez | 12% | 7 | Sem `eval`; entrada sem limite de dígitos. |
| C5 | Dados | 4% | 5 | Estado sem tipo único (string e number no visor). |
| C6 | Testes | 10% | 5 | 6 testes de interface; log mostra falhas. |
| C7 | Qualidade de código | 10% | 5 | D1 e D5. |
| C8 | Desempenho | 8% | 8 | App leve. |
| C9 | Operação | 6% | 4 | D6 e D7. |
| C10 | Documentação | 6% | 6 | README bom, mas com D8. |

**Nota atual: 5,44 / 10 — REPROVADO** (média abaixo de 7,0).

### 4.1 Critérios de aceite (BDD)

```gherkin
Funcionalidade: Calcular

  Cenário: Nova conta depois do resultado
    Dado que calculei 2 + 3 = 5
    Quando digito 7
    Então o visor mostra 7

  Cenário: Divisão por zero
    Quando calculo 8 ÷ 0 =
    Então o visor mostra "Não é possível dividir por zero"
    E um leitor de tela anuncia a mensagem

  Cenário: Teclado físico
    Quando digito "12*3" e Enter no teclado
    Então o visor mostra 36

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 6 | 9 | RF01–RF09 atendidos. |
| C2 | Estados | 4 | 9 | Erro explícito, expressão pendente, nenhum estado inválido. |
| C3 | Acessibilidade | 4 | 9 | axe-core: 0 violações nos temas vivo e dark; teclado completo. |
| C4 | Segurança / robustez | 7 | 9 | Entrada limitada; estados fechados pela FSM. |
| C5 | Dados | 5 | 8 | Visor sempre string; números só no cálculo. |
| C6 | Testes | 5 | 9 | 28 testes (unitários da FSM + interface). |
| C7 | Qualidade de código | 5 | 9 | Regra pura separada da UI. |
| C8 | Desempenho | 8 | 9 | 47,6 kB de JS (gzip). |
| C9 | Operação | 4 | 8 | CRA 5 / React 18, manifesto e ícones corretos. |
| C10 | Documentação | 6 | 9 | README e `docs/` coerentes com o código. |

**Nota depois: 8,90 / 10 — APROVADO.**
