/*
 * calculator.js · máquina de estados finita (FSM) da calculadora, pura e sem React.
 * Estados: first (1º número), operator (operação escolhida), second (2º número), result (após =), error.
 * `fresh` marca um valor vindo de % : o próximo dígito começa um número novo em vez de concatenar.
 * Toda transição é uma função (estado, ação) → novo estado, o que torna cada regra testável isoladamente.
 */
export const MAX_DIGITS = 12;

export const initialState = {
  phase: "first",
  display: "0",
  accumulator: null,
  operator: null,
  lastOperator: null,
  lastOperand: null,
  error: null,
  fresh: false,
};

const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

/* Aplica a operação; lança Error com mensagem amigável em divisão por zero ou estouro. */
export function compute(left, operator, right) {
  let result;
  switch (operator) {
    case "+": result = left + right; break;
    case "-": result = left - right; break;
    case "*": result = left * right; break;
    case "/":
      if (right === 0) throw new Error("Não é possível dividir por zero");
      result = left / right;
      break;
    default: return right;
  }
  if (!Number.isFinite(result)) throw new Error("Resultado muito grande");
  return result;
}

/* Converte o número em texto com no máximo 12 algarismos significativos (corrige 0,1 + 0,2). */
export function formatNumber(value) {
  if (Object.is(value, -0)) return "0";
  const rounded = Number.parseFloat(value.toPrecision(MAX_DIGITS));
  if (Math.abs(rounded) >= 10 ** MAX_DIGITS || (rounded !== 0 && Math.abs(rounded) < 1e-9)) {
    return rounded.toExponential(6).replace(/\.?0+e/, "e");
  }
  return String(rounded);
}

/* Conta só os algarismos (sem sinal e ponto) para limitar a entrada. */
function digitCount(text) {
  return text.replace(/[^0-9]/g, "").length;
}

/* Calcula e leva ao próximo estado, ou ao estado de erro. */
function settle(state, left, operator, right, next) {
  try {
    const value = compute(left, operator, right);
    return { ...state, ...next(value), display: formatNumber(value), error: null };
  } catch (error) {
    return { ...initialState, phase: "error", display: "0", error: error.message };
  }
}

/* Troca o sinal do texto do visor ("5" ↔ "-5"); zero não ganha sinal. */
function negateText(text) {
  if (Number(text) === 0) return text;
  return text.startsWith("-") ? text.slice(1) : `-${text}`;
}

/* Percentual: em + e − é a parte do 1º número (50 + 10 % = 50 + 5); em × e ÷ e sozinho, valor / 100. */
function percentOf(state) {
  const value = Number(state.display);
  if (state.phase === "second" && (state.operator === "+" || state.operator === "-")) {
    return (state.accumulator * value) / 100;
  }
  return value / 100;
}

/* Função de transição da FSM. Só % e ± mantêm `fresh`; as demais ações o desligam. */
export function reducer(state, action) {
  const next = transition(state, action);
  if (next.fresh && action.type !== "PERCENT" && action.type !== "NEGATE") return { ...next, fresh: false };
  return next;
}

function transition(state, action) {
  switch (action.type) {
    case "DIGIT": {
      if (state.phase === "operator") return { ...state, phase: "second", display: action.digit };
      if (state.fresh) return { ...state, display: action.digit };
      if (state.phase === "result" || state.phase === "error") {
        return { ...initialState, display: action.digit };
      }
      if (digitCount(state.display) >= MAX_DIGITS) return state;
      const display = state.display === "0" ? action.digit : state.display + action.digit;
      return { ...state, display };
    }

    case "DOT": {
      if (state.phase === "operator") return { ...state, phase: "second", display: "0." };
      if (state.phase === "result" || state.phase === "error") return { ...initialState, display: "0." };
      if (state.fresh) return { ...state, display: "0." };
      if (state.display.includes(".")) return state;
      return { ...state, display: `${state.display}.` };
    }

    case "OPERATOR": {
      const { operator } = action;
      if (state.phase === "error") return state;
      if (state.phase === "operator") return { ...state, operator };
      if (state.phase === "second") {
        return settle(state, state.accumulator, state.operator, Number(state.display), (value) => ({
          phase: "operator", accumulator: value, operator,
        }));
      }
      return { ...state, phase: "operator", accumulator: Number(state.display), operator };
    }

    case "EQUALS": {
      if (state.phase === "second") {
        const operand = Number(state.display);
        return settle(state, state.accumulator, state.operator, operand, () => ({
          phase: "result", accumulator: null, operator: null,
          lastOperator: state.operator, lastOperand: operand,
        }));
      }
      if (state.phase === "operator") {
        return { ...state, phase: "result", display: formatNumber(state.accumulator), operator: null, accumulator: null };
      }
      if (state.phase === "result" && state.lastOperator) {
        return settle(state, Number(state.display), state.lastOperator, state.lastOperand, () => ({}));
      }
      return state;
    }

    case "BACKSPACE": {
      if (state.phase !== "first" && state.phase !== "second") return state;
      const display = state.display.slice(0, -1);
      return { ...state, display: display === "" || display === "-" ? "0" : display };
    }

    case "NEGATE": {
      if (state.phase === "operator" || state.phase === "error") return state;
      return { ...state, display: negateText(state.display) };
    }

    case "PERCENT": {
      if (state.phase === "operator" || state.phase === "error") return state;
      const value = percentOf(state);
      if (state.phase === "second") return { ...state, display: formatNumber(value), fresh: true };
      return { ...state, phase: "result", display: formatNumber(value), lastOperator: null, lastOperand: null, fresh: false };
    }

    case "CLEAR":
      return { ...initialState };

    default:
      return state;
  }
}

/* Texto do visor no padrão brasileiro (vírgula decimal). */
export function displayText(state) {
  if (state.phase === "error") return state.error;
  return state.display.replace(".", ",");
}

/* Expressão pendente mostrada acima do visor, por exemplo "12 ×". */
export function expressionText(state) {
  if (state.accumulator === null || !state.operator) return "";
  return `${formatNumber(state.accumulator).replace(".", ",")} ${SYMBOLS[state.operator]}`;
}

/* Traduz uma tecla do teclado físico em ação da FSM, ou null. */
export function keyToAction(key) {
  if (/^[0-9]$/.test(key)) return { type: "DIGIT", digit: key };
  if (key === "." || key === ",") return { type: "DOT" };
  if (["+", "-", "*", "/"].includes(key)) return { type: "OPERATOR", operator: key };
  if (key === "x" || key === "X") return { type: "OPERATOR", operator: "*" };
  if (key === "Enter" || key === "=") return { type: "EQUALS" };
  if (key === "Backspace") return { type: "BACKSPACE" };
  if (key === "Escape" || key === "Delete") return { type: "CLEAR" };
  if (key === "%") return { type: "PERCENT" };
  if (key === "F9") return { type: "NEGATE" };
  return null;
}
/* fim de calculator.js */
