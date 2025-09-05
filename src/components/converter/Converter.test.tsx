import { fireEvent, screen, waitFor } from "@testing-library/react";
import {renderWithRedux} from "../../test/utils.tsx";
import Converter, {type ConverterPropsType} from "./Converter";
// import  { currencyResponse } from "../../mocks/response.ts";
import { describe, expect, it, vi } from "vitest";
import { Currency } from "../../types/types.ts";
// import { userEvent } from "@testing-library/user-event";

// const currenciesMock = Object.values(currencyResponse.Valute);


describe('Converter Component', () => {
  let props: ConverterPropsType;

  beforeEach(() => {
    const mockChange = vi.fn();
    const mockCurrencies: Currency[] = [
      { ID: "1", CharCode: "USD", Value: 1, Previous: 0.95, Name: "Доллар США", Nominal: 1, NumCode: "840" },
      { ID: "2", CharCode: "EUR", Value: 0.9, Previous: 0.88, Name: "Евро", Nominal: 1, NumCode: "978" },
      { ID: "3", CharCode: "JPY", Value: 110, Previous: 109, Name: "Японская иена", Nominal: 100, NumCode: "392" },
      { ID: "4", CharCode: "KZT", Value: 430, Previous: 428, Name: "Казахстанский тенге", Nominal: 100, NumCode: "398" },
      { ID: "5", CharCode: "CAD", Value: 1.2, Previous: 1.18, Name: "Канадский доллар", Nominal: 1, NumCode: "124" },
      { ID: "6", CharCode: "GBP", Value: 0.8, Previous: 0.79, Name: "Фунт стерлингов", Nominal: 1, NumCode: "826" },
    ];

    props = {
      rateFirstCurrency: 1,
      rateSecondCurrency: 0.85,
      changeCurrency: mockChange,
      changeFirstFieldValue: mockChange,
      changeSecondFieldValue: mockChange,
      currencies: mockCurrencies,
    };
  });

  //Тест 1: Стартовое состояние (100 слева, 0 справа, правый недоступен)
  it('renders initial state correctly', async  () => {
    renderWithRedux(<Converter {...props}/>);

    screen.debug();

    await waitFor(() => {
      expect(screen.getByTestId("right-input")).not.toHaveValue(0);
      expect(screen.getByTestId("left-input")).toHaveValue(100);
      expect(screen.getByTestId("right-input")).toBeDisabled();
    });
  });

  //Тест 2: Обновить правильное значение при изменении валюты
  it('Refresh the right value when changing currency', async () => {
    const mockChange = vi.fn();
    props.changeCurrency = mockChange;

    renderWithRedux(<Converter {...props}/>);
    const rightInput = screen.getByTestId('right-input');

    await waitFor(() => {
      expect(rightInput).not.toHaveValue(0);
    });

    // const initialValue = rightInput.value;

    // Находим и кликаем на кнопку выбора валюты
    const currencyOptions = screen.getAllByTestId('currency-option');
    fireEvent.click(currencyOptions[1]);

    // Проверяем, что функция changeCurrency была вызвана
    expect(mockChange).toHaveBeenCalled();
  });

  // Тест 3: конвертация при изменении значения в левом инпуте
  it('conversion when changing the value in left inputting', () => {
    renderWithRedux(<Converter {...props} />);

    const leftInput = screen.getByTestId('left-input');
    const rightInput = screen.getByTestId('right-input');

    fireEvent.change(leftInput, {target: {value: "200"}});

    expect(rightInput).not.toHaveValue(0);
  });

  //Тест 4: отображение курсов валют
  test("currency display", async () => {
    renderWithRedux(<Converter {...props} />);

    // Ждем появления информации о курсах
    await waitFor(() => {
      const rateElements = document.querySelectorAll('.box__rate');
      expect(rateElements.length).toBe(2);
      expect(rateElements[0]).toHaveTextContent('1');
      expect(rateElements[1]).toHaveTextContent('1');
    });
  });

})