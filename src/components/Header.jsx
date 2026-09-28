/*
 * Header · marca e botão de troca de tema.
 */
import React from "react";
import "./Header.css";

/* Cabeçalho; aria-pressed informa se o modo escuro está ativo. */
export default function Header({ theme, toggleTheme }) {
  const isDark = theme === "dark";
  return (
    <header className="header">
      <div className="logo" aria-label="calc APP">
        <span className="logo-highlight">calc</span>
        <span className="logo-text">APP</span>
      </div>
      <button type="button" onClick={toggleTheme} className="theme-toggle" aria-pressed={isDark}>
        <span aria-hidden="true">{isDark ? "☀️ " : "🌙 "}</span>
        {isDark ? "Modo Vivo" : "Modo Dark"}
      </button>
    </header>
  );
}
/* fim de Header */
