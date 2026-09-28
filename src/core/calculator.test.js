/*
 * calculator.test.js · testes unitários da FSM (cada transição e casos de borda).
 */
import { reducer, initialState, displayText, expressionText, keyToAction, formatNumber, MAX_DIGITS } from "./calculator";

/* Aplica uma sequência de teclas como o usuário digitaria. */
function press(sequence, start = initialState) {
  return sequence.split(" ").filter(Boolean).reduce((state, key) => reducer(state, keyToAction(key)), start);
}

describe("FSM da calculadora", () => {
  test("começa em 0 na fase first", () => {
    expect(initialState.phase).toBe("first");
    expect(displayText(initialState)).toBe("0");
  });

  test.each([
    ["2 + 3 Enter", "5"],
    ["9 - 1 2 Enter", "-3"],
    ["6 * 7 Enter", "42"],
    ["7 / 2 Enter", "3,5"],
    ["0 . 1 + 0 . 2 Enter", "0,3"],
    ["2 + 3 * 4 Enter", "20"],
  ])("%s = %s", (keys, expected) => {
    expect(displayText(press(keys))).toBe(expected);
  });

  test("divisão por zero entra em erro com mensagem clara", () => {
    const state = press("8 / 0 Enter");
    expect(state.phase).toBe("error");
    expect(displayText(state)).toBe("Não é possível dividir por zero");
  });

  test("após erro, operador é ignorado e dígito recomeça", () => {
    const error = press("8 / 0 Enter");
    expect(reducer(error, keyToAction("+"))).toBe(error);
    expect(displayText(press("5", error))).toBe("5");
  });

  test("dígito depois do resultado inicia nova conta (não concatena)", () => {
    expect(displayText(press("2 + 3 Enter 7"))).toBe("7");
  });

  test("vírgula depois do resultado não quebra e inicia 0,", () => {
    expect(displayText(press("2 + 3 Enter ,"))).toBe("0,");
  });

  test("operador depois do resultado continua a partir dele", () => {
    expect(displayText(press("2 + 3 Enter * 2 Enter"))).toBe("10");
  });

  test("= repetido reaplica a última operação", () => {
    expect(displayText(press("2 + 3 Enter Enter Enter"))).toBe("11");
  });

  test("trocar de operador antes do segundo número substitui a operação", () => {
    const state = press("9 + -");
    expect(state.operator).toBe("-");
    expect(expressionText(state)).toBe("9 −");
    expect(displayText(press("2 Enter", state))).toBe("7");
  });

  test("não aceita duas vírgulas no mesmo número", () => {
    expect(displayText(press("1 , , 5"))).toBe("1,5");
  });

  test("limita a entrada a 12 algarismos", () => {
    const state = press("1 2 3 4 5 6 7 8 9 0 1 2 3 4");
    expect(state.display.length).toBe(MAX_DIGITS);
  });

  test("backspace apaga o último dígito e volta a 0", () => {
    expect(displayText(press("1 2 Backspace"))).toBe("1");
    expect(displayText(press("7 Backspace"))).toBe("0");
  });

  test("AC (Escape) volta ao estado inicial", () => {
    expect(press("9 + 9 Escape")).toEqual(initialState);
  });

  test("números muito grandes usam notação científica", () => {
    expect(formatNumber(123456789012345)).toMatch(/e\+14$/);
    expect(formatNumber(-0)).toBe("0");
  });

  test("teclas sem ação retornam null", () => {
    expect(keyToAction("a")).toBeNull();
  });
});
/* fim de calculator.test.js */
