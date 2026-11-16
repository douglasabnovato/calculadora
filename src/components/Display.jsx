/*
 * Display · visor com a expressão pendente e o valor atual, anunciado a leitores de tela.
 * Tem o botão "Copiar resultado" e a mensagem de status da cópia (role="status").
 */
import React from "react";
import "./Display.css";

/* Mostra o valor; em erro usa fonte menor e role="alert" e esconde o botão de copiar. */
export default function Display({ value, expression, isError, onCopy, copyMessage }) {
  return (
    <div className={`display ${isError ? "display-error" : ""}`}>
      <div className="display-top">
        {onCopy && !isError ? (
          <button
            type="button"
            className="display-copy"
            aria-label="Copiar resultado"
            title="Copiar resultado (Ctrl+C)"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onCopy}
          >
            ⧉
          </button>
        ) : null}
        <span className="display-status" role="status">{copyMessage}</span>
        <span className="display-expression" aria-hidden="true">{expression}</span>
      </div>
      <output className="display-value" aria-live="polite" role={isError ? "alert" : undefined}>
        {value}
      </output>
    </div>
  );
}
/* fim de Display */
