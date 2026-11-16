/*
 * Calculator.test.js · integração da interface com a FSM (clique e teclado físico).
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calculator from "./Calculator";


describe("Calculator", () => {
  test("mostra 0 no visor ao iniciar", () => {
    const { container } = render(<Calculator />);
    expect(container.querySelector("output")).toHaveTextContent("0");
  });

  test("soma por clique usando os nomes acessíveis das teclas", () => {
    const { container } = render(<Calculator />);
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "Somar" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(container.querySelector(".display-expression")).toHaveTextContent("2 +");
    fireEvent.click(screen.getByRole("button", { name: "Igual" }));
    expect(container.querySelector("output")).toHaveTextContent("5");
  });

  test("aceita o teclado físico", () => {
    const { container } = render(<Calculator />);
    ["1", "2", "*", "3", "Enter"].forEach((key) => fireEvent.keyDown(window, { key }));
    expect(container.querySelector("output")).toHaveTextContent("36");
  });

  test("anuncia o erro de divisão por zero", () => {
    render(<Calculator />);
    ["8", "/", "0", "Enter"].forEach((key) => fireEvent.keyDown(window, { key }));
    expect(screen.getByRole("alert")).toHaveTextContent("Não é possível dividir por zero");
  });

  test("percentual e troca de sinal por clique", () => {
    const { container } = render(<Calculator />);
    ["2", "0", "0", "Somar", "1", "0", "Percentual", "Igual"].forEach((name) =>
      fireEvent.click(screen.getByRole("button", { name }))
    );
    expect(container.querySelector("output")).toHaveTextContent("220");
    fireEvent.click(screen.getByRole("button", { name: "Trocar sinal" }));
    expect(container.querySelector("output")).toHaveTextContent("-220");
  });

  test("teclado aceita % e F9", () => {
    const { container } = render(<Calculator />);
    ["5", "0", "%"].forEach((key) => fireEvent.keyDown(window, { key }));
    expect(container.querySelector("output")).toHaveTextContent("0,5");
    fireEvent.keyDown(window, { key: "F9" });
    expect(container.querySelector("output")).toHaveTextContent("-0,5");
  });

  test("teclado completo: 20 teclas na grade 4 × 5, mais o botão de copiar", () => {
    render(<Calculator />);
    const keys = screen.getAllByRole("button").filter((button) => !button.classList.contains("display-copy"));
    expect(keys).toHaveLength(20);
    expect(screen.getByRole("button", { name: "Copiar resultado" })).toBeInTheDocument();
  });
});

describe("Copiar resultado", () => {
  const original = Object.getOwnPropertyDescriptor(window.navigator, "clipboard");

  /* O <output> do visor também tem papel "status"; a mensagem da cópia é o outro. */
  const copyStatus = () => document.querySelector(".display-status");

  function setClipboard(value) {
    Object.defineProperty(window.navigator, "clipboard", { value, configurable: true });
  }

  afterEach(() => {
    if (original) Object.defineProperty(window.navigator, "clipboard", original);
    else delete window.navigator.clipboard;
  });

  test("o botão copia o resultado com vírgula e anuncia na região de status", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<Calculator />);
    ["7", "/", "2", "Enter"].forEach((key) => fireEvent.keyDown(window, { key }));
    fireEvent.click(screen.getByRole("button", { name: "Copiar resultado" }));
    await waitFor(() => expect(copyStatus()).toHaveTextContent("Resultado copiado"));
    expect(writeText).toHaveBeenCalledWith("3,5");
  });

  test("Ctrl+C sem texto selecionado copia o resultado", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<Calculator />);
    ["4", "2"].forEach((key) => fireEvent.keyDown(window, { key }));
    fireEvent.keyDown(window, { key: "c", ctrlKey: true });
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("42"));
    await waitFor(() => expect(copyStatus()).toHaveTextContent("Resultado copiado"));
  });

  test("Ctrl+C com texto selecionado fica com o navegador", () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    const spy = jest.spyOn(window, "getSelection").mockReturnValue({ toString: () => "Calculadora" });
    render(<Calculator />);
    fireEvent.keyDown(window, { key: "c", ctrlKey: true });
    expect(writeText).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test("sem Clipboard API, mostra erro claro e a calculadora segue funcionando", async () => {
    setClipboard(undefined);
    render(<Calculator />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar resultado" }));
    await waitFor(() => expect(copyStatus()).toHaveTextContent("Não foi possível copiar"));
    fireEvent.keyDown(window, { key: "9" });
    expect(copyStatus()).toBeEmptyDOMElement();
    expect(document.querySelector("output")).toHaveTextContent("9");
  });

  test("em erro não há botão de copiar e Ctrl+C não copia a mensagem", () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<Calculator />);
    ["8", "/", "0", "Enter"].forEach((key) => fireEvent.keyDown(window, { key }));
    expect(screen.queryByRole("button", { name: "Copiar resultado" })).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "c", ctrlKey: true });
    expect(writeText).not.toHaveBeenCalled();
  });
});
/* fim de Calculator.test.js */
