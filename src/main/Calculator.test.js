import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calculator from './Calculator';

describe('Calculator Component - Testes da Máquina de Estados', () => {
  
  test('deve renderizar o display inicial com o valor "0"', () => {
    const { container } = render(<Calculator />);
    const display = container.querySelector('.display');
    expect(display).toHaveTextContent('0');
  });

  test('deve realizar uma operação de soma corretamente (2 + 3 = 5)', () => {
    const { container } = render(<Calculator />);
    
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));

    const display = container.querySelector('.display');
    expect(display).toHaveTextContent('5');
  });

  test('deve tratar divisão por zero de forma segura retornando 0', () => {
    const { container } = render(<Calculator />);
    
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('/'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('='));

    const display = container.querySelector('.display');
    expect(display).toHaveTextContent('0');
  });

});