/*
 * Calculator · interface da calculadora; toda regra está na FSM de core/calculator.js.
 * Aceita clique e teclado físico (números, + − × ÷, %, F9 para ±, Enter, Backspace, Esc).
 * Ctrl+C (ou Cmd+C) sem texto selecionado copia o resultado do visor.
 */
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import "./Calculator.css";
import Button from "../components/Button";
import Display from "../components/Display";
import { reducer, initialState, displayText, expressionText, keyToAction } from "../core/calculator";
import { copyText } from "../core/clipboard";

const KEYS = [
  { label: "AC", aria: "AC, limpar tudo", action: { type: "CLEAR" } },
  { label: "±", aria: "Trocar sinal", action: { type: "NEGATE" } },
  { label: "%", aria: "Percentual", action: { type: "PERCENT" } },
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
  { label: "⌫", aria: "Apagar último dígito", action: { type: "BACKSPACE" } },
  { label: "0", action: { type: "DIGIT", digit: "0" } },
  { label: ",", aria: "Vírgula decimal", action: { type: "DOT" } },
  { label: "=", aria: "Igual", action: { type: "EQUALS" }, operation: true },
];

/* Há texto selecionado na página? Nesse caso o Ctrl+C fica com o navegador. */
function hasSelection() {
  const selection = window.getSelection ? window.getSelection() : null;
  return Boolean(selection && selection.toString() !== "");
}

/* Componente da calculadora. */
export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [copyMessage, setCopyMessage] = useState("");
  const stateRef = useRef(state);
  stateRef.current = state;

  /* Toda ação nova apaga a mensagem da cópia anterior. */
  const run = useCallback((action) => {
    setCopyMessage("");
    dispatch(action);
  }, []);

  /* Copia o texto do visor ("3,5"); em erro não há resultado para copiar. */
  const copyResult = useCallback(async () => {
    const current = stateRef.current;
    if (current.phase === "error") return;
    const { message } = await copyText(displayText(current));
    setCopyMessage(message);
  }, []);

  useEffect(() => {
    /* Converte teclas em ações; Enter sobre um botão focado fica com o próprio botão. */
    function onKeyDown(event) {
      const isCopy = (event.ctrlKey || event.metaKey) && !event.altKey && (event.key === "c" || event.key === "C");
      if (isCopy) {
        if (hasSelection() || stateRef.current.phase === "error") return;
        event.preventDefault();
        copyResult();
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Enter" && event.target instanceof HTMLButtonElement) return;
      const action = keyToAction(event.key);
      if (!action) return;
      event.preventDefault();
      run(action);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copyResult, run]);

  return (
    <section className="calculator" aria-label="Calculadora">
      <Display
        value={displayText(state)}
        expression={expressionText(state)}
        isError={state.phase === "error"}
        onCopy={copyResult}
        copyMessage={copyMessage}
      />
      {KEYS.map((key) => (
        <Button
          key={key.label}
          label={key.label}
          ariaLabel={key.aria}
          operation={key.operation}
          className={key.className}
          onPress={() => run(key.action)}
        />
      ))}
    </section>
  );
}
/* fim de Calculator */
