/*
 * clipboard.js · copia texto para a área de transferência e devolve a mensagem para a tela.
 * Nunca lança erro: sem a Clipboard API (navegador antigo ou página sem HTTPS) ou com a
 * permissão negada, devolve { ok: false } com uma mensagem clara.
 */
export const COPY_OK = "Resultado copiado";
export const COPY_UNAVAILABLE = "Não foi possível copiar: o navegador não dá acesso à área de transferência";
export const COPY_DENIED = "Não foi possível copiar: o navegador negou o acesso à área de transferência";

/* Copia `text`; `clipboard` pode ser trocado nos testes. */
export async function copyText(text, clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined) {
  if (!clipboard || typeof clipboard.writeText !== "function") {
    return { ok: false, message: COPY_UNAVAILABLE };
  }
  try {
    await clipboard.writeText(text);
    return { ok: true, message: COPY_OK };
  } catch (error) {
    return { ok: false, message: COPY_DENIED };
  }
}
/* fim de clipboard.js */
