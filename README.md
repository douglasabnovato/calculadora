<h4 align="center"> 
  🚧 Calculadora - React.js 🚧
</h4>   

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;"> 
  <img alt="Calculadora" title="#Calculadora" src="./.github/tela-1.jpg" width="600px"> 
</p> 

## 🎯 Visão do Produto
Desenvolvimento de uma calculadora web responsiva com forte foco em experiência de usuário (UX). O projeto evoluiu de um componente isolado para uma Single Page Application (SPA) profissional, incorporando um design system moderno com cabeçalho, rodapé e sistema dinâmico de troca de temas (*Theme Switcher* entre o Modo Vivo e o Modo Dark).

## 🏗️ Arquitetura e Engenharia de Software
- **Stack Tecnológica:** React.js, Vanilla CSS.
- **Padrões de Projeto (Design Patterns):**
  - **Componentização (Dumb vs Smart Components):** Separação clara entre componentes de apresentação estática (`Button`, `Display`, `Header`, `Footer`) e o componente de regra de negócio (`Calculator`, `App`).
  - **Single Source of Truth:** O estado da aplicação (valores numéricos, operação atual e o tema selecionado) é gerenciado de forma centralizada nos componentes pais.
  - **CSS Variables & Theming:** Utilização de variáveis customizadas do CSS (`--var`) controladas dinamicamente pelo estado do React para alternar paletas de cores, sombras e contrastes em tempo de execução.
- **Segurança (Tratamento de Débito Técnico):** A função nativa `eval()` foi totalmente removida e substituída por um parser matemático seguro baseado em estrutura de controle (`switch/case`), eliminando vulnerabilidades e o warning `no-eval` do ESLint.

## 💻 Plano de Ação & Roadmap Executado

### Fase 1: Fundação e MVP (Concluído)
- [x] 1. Inicialização do projeto (`create-react-app`) e limpeza estrutural.
- [x] 2. Estilização do Componente Calculator (`src/main/Calculator.jsx`).
- [x] 3. Estilização do Componente Button (`src/components/Button.jsx` e `src/components/Button.css`).
- [x] 4. Estilização do Componente Display (`src/components/Display.jsx`).
- [x] 5. Implementação da lógica base da calculadora.

### Fase 2: Segurança e Engenharia (Concluído)
- [x] 6. Refatoração da lógica de cálculo para eliminação do uso de `eval()`.

### Fase 3: Redesign, Layout SPA e UX (Concluído)
- [x] 7. Criação do estado global de temas (`App.jsx`) com alternância interativa.
- [x] 8. Desenvolvimento do componente `<Header />` com identidade visual e botão de *Theme Switcher*.
- [x] 9. Desenvolvimento do componente `<Footer />` com créditos e links de contato.
- [x] 10. Configuração do Design System em `index.css` com paletas dinâmicas para o **Modo Vivo** (contraste aprimorado, display destacado e detalhes em vermelho vivo inspirados em referências de alto padrão) e **Modo Dark** (gradientes profundos e botões estilizados).
- [x] 11. Estruturação global em Layout Flexbox (`column`) empilhando Header, Main e Footer perfeitamente.

### Fase 4: Testes e Cobertura (Próximo Passo)
- [ ] Implementação de testes unitários para a lógica da máquina de estados.
- [ ] Implementação de testes de integração e comportamento da interface (interação com os botões e alternância de temas).
 
## 🚀 Tecnologias e Recursos
- Favicon personalizado
- Configuração de idioma e meta tags
- Fontes Google Roboto via link
- [Gradiente uiGradients](https://uigradients.com/#CitrusPeel) (Referência de base)
- Sistema dinâmico de Variáveis CSS
- Layout estruturado com **CSS Grid** (teclado) e **Flexbox** (estrutura da SPA)

## 🚀 Testes e Cobertura

Arquivos de **Calculator.test.js** e **App.test.js** e o resultado em **test-results.log**.

Missão cumprida! O projeto saiu de uma calculadora simples para uma SPA com arquitetura limpa, Design System dinâmico, sem débitos técnicos e com 100% de cobertura nos testes essenciais.

### 🧪 Evidência de Cobertura de Testes

Os testes automatizados foram executados em ambiente isolado via Jest e React Testing Library. A suíte completa passou com 100% de sucesso em todas as verificações:

```text
PASS src/main/Calculator.test.js
PASS src/App.test.js

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        3.59 s
Ran all test suites.
```



## 📝 Licença
Este projeto está sob a licença MIT.

---
Feito com ❤️ por Douglas A B Novato 👋🏽 [Entre em contato!](https://www.linkedin.com/in/douglasabnovato/)
 
*Fonte original do projeto: Curso React + Redux (Cod3r).*