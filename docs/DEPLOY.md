# Deploy · Calculadora (calcAPP)

Atualizado em 16/11/2026.

## Estado

- Site: https://calculadora-thema.netlify.app/ (HTTP 200 em 16/11/2026, `<title>Calculadora · calcAPP</title>`).
- Hospedagem: Netlify, plano gratuito, site estático. Sem backend, sem banco, sem segredo no código.
- A Netlify publica a cada push na `main`. A `main` só recebe mudança por PR, com o check `raiz` verde (ruleset `principal-protegida`).
- O que falta (responsável, #18): a Netlify publicar só depois de o CI passar **na própria `main`**. Hoje ela não espera o run da `main`.

## Configuração versionada

| Arquivo | O que faz |
|---|---|
| `netlify.toml` | Comando `npm run build`, pasta `build` e Node 22, iguais aos do CI |
| `.github/workflows/ci.yml` | Jobs `raiz` (auditoria, testes, build) e `e2e` (Playwright com axe). O job `publicar` chama o build hook da Netlify só na `main`, depois dos dois, e só se o segredo `NETLIFY_BUILD_HOOK` existir |
| `package.json` | `"homepage": "."`: caminhos relativos no build |

O job `raiz` roda `npm audit --omit=dev` sem `--audit-level`: qualquer alerta novo numa dependência de produção (`react`, `react-dom`, `web-vitals`) deixa o CI vermelho, mesmo sem mudança no código. É de propósito. Quando quebrar, atualizar a dependência em patch ou minor num PR; se só houver versão maior, abrir issue e decidir.

O `react-scripts` está em `devDependencies`. A Netlify instala as dependências de desenvolvimento por padrão. Não defina `NODE_ENV=production` nas variáveis do site: o build quebraria.

## Rodar e conferir localmente

```bash
npm ci
npm audit --omit=dev          # 0 vulnerabilidades
npm test -- --watchAll=false  # Jest: regras, tela e teclado
npm run build                 # pasta build/
npx playwright install chromium
npm run test:e2e              # Playwright + axe sobre o build, porta 4317
```

## Passo a passo do responsável: publicar só depois do CI (#18)

Nada aqui exige plano pago. Não cole o endereço do build hook em issue, PR ou chat: ele funciona como senha.

1. **Criar o build hook na Netlify.**
   1. Entre em app.netlify.com e abra o site `calculadora-thema`.
   2. **Site configuration → Build & deploy → Continuous deployment → Build hooks → Add build hook**.
   3. Nome: `ci-main`. Branch to build: `main`. Clique em **Save**.
   4. Copie o endereço gerado (começa com `https://api.netlify.com/build_hooks/`).
2. **Guardar o endereço como segredo no GitHub.**
   1. No repositório `calculadora`: **Settings → Secrets and variables → Actions → New repository secret**.
   2. Name: `NETLIFY_BUILD_HOOK`. Secret: o endereço do passo 1.4. Clique em **Add secret**.
3. **Ignorar os builds que não vêm do build hook.**
   1. Na Netlify: **Site configuration → Build & deploy → Continuous deployment → Build settings → Configure**.
   2. Deixe **Build status** em **Active**. Não use **Stopped builds**: com os builds parados, a Netlify também ignora o build hook.
   3. No campo **Ignore builds**, cole `[ -z "$INCOMING_HOOK_URL" ]` e clique em **Save**. A Netlify só define `INCOMING_HOOK_URL` quando o build vem de um build hook. Num push, o comando sai com 0 e o build é cancelado; pelo hook, sai com 1 e o build segue.
   4. Faça este passo só depois do passo 2. Sem o segredo, nenhum build seria disparado.
4. **Conferir.**
   1. Depois do próximo merge na `main`, abra **Actions → CI** e veja o job `publicar` com a linha "Build hook chamado.".
   2. Na Netlify, **Deploys** mostra um deploy com a origem "build hook".
   3. Nos PRs, o job `publicar` aparece como "skipped": ele só roda em push na `main`, com `needs: [raiz, e2e]`. Um teste quebrado não chega à `main`, porque o ruleset exige o `raiz` verde no PR (e o `e2e`, depois da #30).
5. **Exigir o teste no navegador antes do merge** (#30): em **Settings → Rules → Rulesets → principal-protegida → Require status checks to pass**, adicione o check `e2e` ao lado do `raiz` e salve.

Fontes: [Netlify, Build hooks](https://docs.netlify.com/build/configure-builds/build-hooks/); [Netlify, Ignore builds](https://docs.netlify.com/build/configure-builds/ignore-builds/); [Netlify, variáveis do build (`INCOMING_HOOK_URL`)](https://docs.netlify.com/build/configure-builds/environment-variables/); [Netlify, Stop or activate builds](https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/) (com builds parados, o hook não publica); [Netlify, File-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Conferir o site no ar

1. `curl -s -o /dev/null -w "%{http_code}" https://calculadora-thema.netlify.app/` devolve `200`.
2. A página tem `<title>Calculadora · calcAPP</title>`.
3. `12 × 3 + 4 =` mostra `40`; "Copiar resultado" mostra "Resultado copiado".
4. `8 ÷ 0 =` mostra "Não é possível dividir por zero".

## Histórico

- 03/11/2026: o endereço do Render dava 404; o site passou para a Netlify e o `render.yaml` saiu do repositório.
- 10/11/2026: ruleset `principal-protegida` na `main` (PR obrigatório e check `raiz`).
- 16/11/2026: `netlify.toml`, job `e2e` e job `publicar` (build hook opcional) no CI.
