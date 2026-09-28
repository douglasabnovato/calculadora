# Deploy · Calculadora (calcAPP)

Plano de ação para publicar a calculadora em hospedagem gratuita.

## 1. Desafio

Publicar uma SPA em Create React App, sem backend e sem segredos, com deploy automático a cada push e sem custo.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **Render Static Site (escolhida)** | Gratuito, CDN, não hiberna, build a cada push, configuração versionada em `render.yaml` |
| GitHub Pages | Exigiria um workflow em `.github/` ou o pacote `gh-pages` com deploy manual |

### O que foi ajustado para o deploy

| Mudança | Arquivo | Por quê |
|---|---|---|
| Blueprint do site estático | `render.yaml` | Infraestrutura como código |
| `package-lock.json` regenerado | `package-lock.json` | O lock anterior estava fora de sincronia (`typescript@7` no lock contra `4.9.5` exigido) e o `npm ci` do deploy falhava |
| Seção "Em produção" | `README.md` | Link da demonstração e forma de publicar |

Já estava pronto do ciclo anterior: `"homepage": "."` no `package.json` (caminhos relativos no build).

### Verificação feita antes da entrega

- `npm ci` limpo, 28 testes passando (3 suítes), `npm run build` com `CI=true` sem avisos.
- `npm audit --omit=dev` aponta falhas apenas em ferramentas de build do `react-scripts` (não vão para o navegador). A saída definitiva é migrar CRA → Vite, já registrada como dívida técnica.

## 3. Solução (passo a passo)

### Etapa 1 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/calculadora`
2. `npm ci`
3. `npm test -- --watchAll=false` (28 testes)
4. `npm run build`

### Etapa 2 · Subir para o GitHub

1. `git rm test-results.log` (log antigo que contradiz o README)
2. `git status` (não podem aparecer `node_modules/`, `build/` nem `.env`)
3. `git add -A`
4. `git commit -m "refactor: MVP — FSM pura, teclado, vírgula pt-BR, React 18, testes, docs e deploy no Render"`
5. `git push`

### Etapa 3 · Criar o site no Render

1. Entrar em **render.com** com o GitHub e autorizar o repositório `calculadora`.
2. **New → Blueprint** e escolher `douglasabnovato/calculadora`.
3. Conferir o serviço `calculadora` (Static Site) e clicar em **Apply**.
4. Esperar o build (2 a 4 min) e abrir a URL gerada.

### Etapa 4 · Conferir no ar

1. A calculadora abre com o tema do sistema e o favicon.
2. `12 + 3 =` mostra `15`; `1 ÷ 0` mostra a mensagem de erro.
3. O teclado físico funciona (números, `Enter`, `Backspace`, `Esc`).
4. A troca de tema continua salva ao recarregar.

### Etapa 5 · Fechar

1. Se a URL real for diferente de `https://calculadora.onrender.com`, corrigir no `README.md`, commit e push.
2. No GitHub, **About → Website**: colar a URL.
