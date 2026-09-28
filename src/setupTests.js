/*
 * setupTests.js · matchers do jest-dom, matchMedia simulado (o jsdom não implementa)
 * e filtro do aviso de depreciação do act emitido pela Testing Library 13 com React 18.3.
 */
import "@testing-library/jest-dom";

window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));

const originalError = console.error;

/* Silencia só o aviso conhecido da biblioteca. */
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message, ...args) => {
    if (typeof message === "string" && message.includes("ReactDOMTestUtils.act")) return;
    originalError(message, ...args);
  });
});

/* Restaura o console. */
afterAll(() => console.error.mockRestore());
/* fim de setupTests.js */
