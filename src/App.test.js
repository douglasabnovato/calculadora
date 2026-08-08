import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component - Testes de Integração e UI', () => {

  test('deve alternar entre o Modo Vivo e o Modo Dark ao clicar no botão do Header', () => {
    render(<App />);

    const themeButton = screen.getByRole('button', { name: /Modo Dark|Modo Vivo/i });
    expect(themeButton).toBeInTheDocument();

    fireEvent.click(themeButton);

    expect(screen.getByRole('button', { name: /Modo Vivo/i })).toBeInTheDocument();
  });

  test('deve limpar o display da calculadora ao acionar o botão AC', () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByText('9'));
    const display = container.querySelector('.display');
    expect(display).toHaveTextContent('9');

    fireEvent.click(screen.getByText('AC'));
    expect(display).toHaveTextContent('0');
  });

  test('deve renderizar os componentes estruturais Header e Footer', () => {
    render(<App />);

    expect(screen.getByText(/Douglas A B Novato/i)).toBeInTheDocument();
    expect(screen.getByText('calc')).toBeInTheDocument();
  });

});