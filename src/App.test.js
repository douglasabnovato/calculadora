/*
 * App.test.js · layout, troca de tema e persistência da escolha.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => window.localStorage.clear());

  test("alterna o tema, informa aria-pressed e salva a escolha", () => {
    const { container } = render(<App />);
    const toggle = screen.getByRole("button", { name: /Modo Dark/ });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /Modo Vivo/ })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".app-container")).toHaveClass("dark");
    expect(window.localStorage.getItem("calculadora:tema")).toBe("dark");
  });

  test("restaura o tema salvo", () => {
    window.localStorage.setItem("calculadora:tema", "dark");
    const { container } = render(<App />);
    expect(container.querySelector(".app-container")).toHaveClass("dark");
  });

  test("AC limpa o visor", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    expect(container.querySelector("output")).toHaveTextContent("9");
    fireEvent.click(screen.getByRole("button", { name: "Limpar tudo" }));
    expect(container.querySelector("output")).toHaveTextContent("0");
  });

  test("renderiza cabeçalho e rodapé", () => {
    render(<App />);
    expect(screen.getByText(/Douglas A B Novato/)).toBeInTheDocument();
    expect(screen.getByText("calc")).toBeInTheDocument();
  });
});
/* fim de App.test.js */
