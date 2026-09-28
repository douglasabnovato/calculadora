/*
 * Calculator.test.js · integração da interface com a FSM (clique e teclado físico).
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
});
/* fim de Calculator.test.js */
