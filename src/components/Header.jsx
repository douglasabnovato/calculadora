import React from 'react';
import './Header.css';

export default function Header({ theme, toggleTheme }) {
    return (
        <header className="header">
            <div className="logo">
                <span className="logo-highlight">calc</span>
                <span className="logo-text">APP</span>
            </div>
            <nav className="nav-menu">
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'vivo' ? '🌙 Modo Dark' : '☀️ Modo Vivo'}
                </button>
            </nav>
        </header>
    );
}