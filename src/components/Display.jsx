/*
 * Display · visor com a expressão pendente e o valor atual, anunciado a leitores de tela.
 */
import React from "react";
import "./Display.css";

/* Mostra o valor; em erro usa fonte menor e role="alert". */
export default function Display({ value, expression, isError }) {
  return (
    <div className={`display ${isError ? "display-error" : ""}`}>
      <span className="display-expression" aria-hidden="true">{expression}</span>
      <output className="display-value" aria-live="polite" role={isError ? "alert" : undefined}>
        {value}
      </output>
    </div>
  );
}
/* fim de Display */
