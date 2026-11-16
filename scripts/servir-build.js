/*
 * servir-build.js · servidor estático mínimo da pasta build/, usado pelo teste de ponta a ponta.
 * Sem dependência nova. Porta pela variável PORT (padrão 4317). Caminho desconhecido cai no index.html.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "build");
const PORT = Number(process.env.PORT) || 4317;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

/* Resolve o arquivo pedido dentro de build/; nada fora dela é servido. */
function resolveFile(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  } catch (error) {
    return null;
  }
  const file = path.resolve(ROOT, `.${pathname}`);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  return path.join(ROOT, "index.html");
}

http
  .createServer((request, response) => {
    const file = resolveFile(request.url);
    if (!file) {
      response.writeHead(400).end();
      return;
    }
    response.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file)
      .on("error", () => response.destroy())
      .pipe(response);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`build/ em http://127.0.0.1:${PORT}`));
/* fim de servir-build.js */
