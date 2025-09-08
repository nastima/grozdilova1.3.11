import { screen, fireEvent } from '@testing-library/react';
import { renderWithRedux } from '../../test/utils';
import Converter from './Converter';
import { currencyResponse } from '../../mocks/response';
import { Currency } from '../../types/types';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Полные моковые данные
const mockCurrencies: Currency[] = Object.values(currencyResponse.Valute);

const mockProps = {
  rateFirstCurrency: 1,
  rateSecondCurrency: 0.85,
  changeCurrency: vi.fn(),
  changeFirstFieldValue: vi.fn(),
  changeSecondFieldValue: vi.fn(),
  currencies: mockCurrencies,
};

// Mock Redux state для useSelector
const mockState = {
  converter: {
    currencyFirstField: 'USD',
    currencySecondField: 'EUR',
    countFirstField: '100',
    countSecondField: '85.00',
    mainCurrencies: [
      currencyResponse.Valute.USD,
      currencyResponse.Valute.EUR,
      currencyResponse.Valute.GBP,
      currencyResponse.Valute.JPY,
      currencyResponse.Valute.KZT,
      currencyResponse.Valute.CAD,
    ]
  }
};


describe('Converter Component', () => {
  // Тест 1: Рендер начального состояния
  test('renders initial state correctly', () => {
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    expect(screen.getByText('Конвертер валют онлайн')).toBeInTheDocument();
    expect(screen.getByText('У меня есть')).toBeInTheDocument();
    expect(screen.getByText('Хочу приобрести')).toBeInTheDocument();

    const leftInput = screen.getByTestId('left-input');
    const rightInput = screen.getByTestId('right-input');

    expect(leftInput).toHaveValue(100);
    expect(rightInput).toBeDisabled();
  });


  // Тест 2: Активное состояние валют
  test('shows active state for selected currencies', () => {
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    const currencyButtons = screen.getAllByTestId('currency-option');

    // Первая кнопка (RUR) должна быть активна
    expect(currencyButtons[0]).toHaveClass('active');
    expect(currencyButtons[0]).toHaveTextContent('RUR');

    // Вторая кнопка (RUR) не должна быть активна
    expect(currencyButtons[1]).not.toHaveClass('active');
    expect(currencyButtons[1]).toHaveTextContent('RUR');
  });

  // Тест 3: Вызов changeCurrency при клике
  test('calls changeCurrency when currency button is clicked', () => {
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    const currencyOptions = screen.getAllByTestId('currency-option');
    fireEvent.click(currencyOptions[0]);

    expect(mockProps.changeCurrency).toHaveBeenCalled();
  });

  // Тест 4: Отображение курсов
  test('displays exchange rates correctly', () => {
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    const rateElements = document.querySelectorAll('.box__rate');
    expect(rateElements.length).toBe(2);

    // Проверяем формат курсов
    rateElements.forEach(element => {
      expect(element.textContent).toMatch(/1 [A-Z]{3} = \d+\.\d{2} [A-Z]{3}/);
    });
  });

  // Тест 5: Конвертация при изменении левого инпута
  test('calls changeFirstFieldValue when left input changes', () => {
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    const leftInput = screen.getByTestId('left-input');
    fireEvent.change(leftInput, { target: { value: '200' } });

    expect(mockProps.changeFirstFieldValue).toHaveBeenCalledWith('200');
  });

  // Тест 6: Правый инпут недоступен для редактирования
  test('right input is disabled', async () => {
    const user = userEvent.setup();
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    const rightInput = screen.getByTestId('right-input');
    expect(rightInput).toBeDisabled();

    // Пытаемся изменить - userEvent должен игнорировать disabled элементы
    await user.type(rightInput, '500');
    expect(mockProps.changeSecondFieldValue).not.toHaveBeenCalled();
  });

  // Тест 7: Swap функциональность
  test('swap currencies calls changeCurrency with swapped values', () => {
    renderWithRedux(<Converter {...mockProps} />, { preloadedState: mockState });

    const swapButton = document.querySelector('.direction__reverse');
    fireEvent.click(swapButton!);

    // Ожидаем аргументы в соответствии с фактическим mockState
    // Если в mockState leftCurrency: 'USD', rightCurrency: 'RUR'
    expect(mockProps.changeCurrency).toHaveBeenCalledWith('USD', 'RUR', '100');
  });

  // Тест 8: Форматирование чисел
  test('formats numbers with 2 decimal places', () => {
    const formattedProps = {
      ...mockProps,
      rateFirstCurrency: 1.23456,
      rateSecondCurrency: 0.98765
    };

    renderWithRedux(<Converter {...formattedProps} />, { preloadedState: mockState });

    const rateElements = document.querySelectorAll('.box__rate');
    expect(rateElements[0].textContent).toContain('1.23');
    expect(rateElements[1].textContent).toContain('0.99');
  });
});