/*
 * Button · tecla da calculadora (botão nativo, acessível por teclado e leitor de tela).
 */
import React from "react";
import "./Button.css";

/* Renderiza a tecla; ariaLabel dá nome falado aos símbolos (÷, ×, ⌫).
   O clique do mouse não move o foco, então Enter no teclado continua sendo "=". */
export default function Button({ label, ariaLabel, operation, className = "", onPress }) {
  const classes = ["button", operation ? "operation" : "", className].filter(Boolean).join(" ");
  return (
    <button type="button" className={classes} aria-label={ariaLabel} onMouseDown={(event) => event.preventDefault()} onClick={onPress}>
      {label}
    </button>
  );
}
/* fim de Button */
