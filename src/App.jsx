import React, { useState } from 'react';
import Calculator from './main/Calculator';
import Header from './components/Header';
import Footer from './components/Footer'; // Importamos o Footer aqui
import './App.css';

function App() {
    const [theme, setTheme] = useState('vivo');

    const toggleTheme = () => {
        setTheme(theme === 'vivo' ? 'dark' : 'vivo');
    };

    return (
        <div className={`app-container ${theme}`}>
            <Header theme={theme} toggleTheme={toggleTheme} />

            <main className="main-content">
                <Calculator />
            </main>

            <Footer /> {/* Adicionamos o Footer aqui */}
        </div>
    );
}

export default App;