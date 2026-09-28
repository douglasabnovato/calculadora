/*
 * App · layout da SPA (cabeçalho, calculadora, rodapé) e tema claro/escuro.
 * O tema inicial segue a preferência do sistema e a escolha fica salva no navegador.
 */
import React, { useEffect, useState } from "react";
import Calculator from "./main/Calculator";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const STORAGE_KEY = "calculadora:tema";

/* Lê o tema salvo ou a preferência do sistema; tolera navegador sem localStorage. */
function readInitialTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "vivo" || saved === "dark") return saved;
  } catch (error) {
    return "vivo";
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "vivo";
}

/* Componente raiz. */
export default function App() {
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      return;
    }
  }, [theme]);

  /* Alterna entre os temas vivo e dark. */
  const toggleTheme = () => setTheme((current) => (current === "vivo" ? "dark" : "vivo"));

  return (
    <div className={`app-container ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <h1 className="sr-only">Calculadora</h1>
        <Calculator />
      </main>
      <Footer />
    </div>
  );
}
/* fim de App */
