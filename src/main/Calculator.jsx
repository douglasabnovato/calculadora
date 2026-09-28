/*
 * Calculator · interface da calculadora; toda regra está na FSM de core/calculator.js.
 * Aceita clique e teclado físico (números, + − × ÷, Enter, Backspace, Esc).
 */
import React, { useEffect, useReducer } from "react";
import "./Calculator.css";
import Button from "../components/Button";
import Display from "../components/Display";
import { reducer, initialState, displayText, expressionText, keyToAction } from "../core/calculator";

const KEYS = [
  { label: "AC", aria: "Limpar tudo", action: { type: "CLEAR" }, className: "double" },
  { label: "⌫", aria: "Apagar último dígito", action: { type: "BACKSPACE" } },
  { label: "÷", aria: "Dividir", action: { type: "OPERATOR", operator: "/" }, operation: true },
  { label: "7", action: { type: "DIGIT", digit: "7" } },
  { label: "8", action: { type: "DIGIT", digit: "8" } },
  { label: "9", action: { type: "DIGIT", digit: "9" } },
  { label: "×", aria: "Multiplicar", action: { type: "OPERATOR", operator: "*" }, operation: true },
  { label: "4", action: { type: "DIGIT", digit: "4" } },
  { label: "5", action: { type: "DIGIT", digit: "5" } },
  { label: "6", action: { type: "DIGIT", digit: "6" } },
  { label: "−", aria: "Subtrair", action: { type: "OPERATOR", operator: "-" }, operation: true },
  { label: "1", action: { type: "DIGIT", digit: "1" } },
  { label: "2", action: { type: "DIGIT", digit: "2" } },
  { label: "3", action: { type: "DIGIT", digit: "3" } },
  { label: "+", aria: "Somar", action: { type: "OPERATOR", operator: "+" }, operation: true },
  { label: "0", action: { type: "DIGIT", digit: "0" }, className: "double" },
  { label: ",", aria: "Vírgula decimal", action: { type: "DOT" } },
  { label: "=", aria: "Igual", action: { type: "EQUALS" }, operation: true },
];

/* Componente da calculadora. */
export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    /* Converte teclas em ações; Enter sobre um botão focado fica com o próprio botão. */
    function onKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Enter" && event.target instanceof HTMLButtonElement) return;
      const action = keyToAction(event.key);
      if (!action) return;
      event.preventDefault();
      dispatch(action);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="calculator" aria-label="Calculadora">
      <Display
        value={displayText(state)}
        expression={expressionText(state)}
        isError={state.phase === "error"}
      />
      {KEYS.map((key) => (
        <Button
          key={key.label}
          label={key.label}
          ariaLabel={key.aria}
          operation={key.operation}
          className={key.className}
          onPress={() => dispatch(key.action)}
        />
      ))}
    </section>
  );
}
/* fim de Calculator */
