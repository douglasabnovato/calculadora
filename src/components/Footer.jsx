import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <p>
                Feito com ❤️ por Douglas A B Novato 👋🏽{' '}
                <a 
                    href="https://www.linkedin.com/in/douglasabnovato/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Entre em contato!
                </a>
            </p>
        </footer>
    );
}