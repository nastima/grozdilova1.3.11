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

    await waitFor(() => {
      expect(screen.getByTestId("right-input")).not.toHaveValue(0);
      expect(screen.getByTestId("left-input")).toHaveValue(100);
      expect(screen.getByTestId("right-input")).toBeDisabled();
    });

  });

  // Тест 2: конвертация при изменении значения в левом инпуте
  it('conversion when changing the value in left inputting', () => {
    renderWithRedux(<Converter {...props} />);

    const leftInput = screen.getByTestId('left-input');
    const rightInput = screen.getByTestId('right-input');

    fireEvent.change(leftInput, {target: {value: "200"}});

    expect(rightInput).not.toHaveValue(0);
  })

  //Тест 3: одинаковые валюты → курс 1:1
  //
  // it('The same currency rate 1:1', async () => {
  //   const user = userEvent.setup();
  //
  //   renderWithRedux(<Converter {...props} />);
  //
  //   const leftInput = screen.getByTestId('left-input');
  //   const rightInput = screen.getByTestId('right-input');
  //   const currencyOptions = screen.getAllByTestId("currency-option");
  //
  //   await user.click(currencyOptions.find(el => el.textContent === "USD")!);
  //   await user.click(currencyOptions.find(el => el.textContent === "USD")!);
  //
  //   await user.clear(leftInput);
  //   await user.type(leftInput, "50");
  //
  //   expect(leftInput).toHaveValue(50);
  //   expect(rightInput).toHaveValue(0);
  // });
})