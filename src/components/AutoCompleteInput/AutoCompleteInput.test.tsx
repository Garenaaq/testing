import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AutoCompleteInput } from "./AutoCompleteInput";
import userEvent from "@testing-library/user-event";

const OPTIONS = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Ростов-на-Дону",
  "Краснодар",
];

const MAX_VISIBLE_SUGGESTIONS = 5;

describe("AutoCompleteInput", () => {
  test("Рендерит поле ввода с переданным placeholder", () => {
    render(<AutoCompleteInput options={OPTIONS} placeholder="Введите город" />);

    expect(screen.getByPlaceholderText("Введите город")).toBeInTheDocument();
  });

  test("Показывает все подсказки при фокусе на пустом поле ввода", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.click(input);

    OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  test("Фильтрует список подсказок в соответствии с введённым текстом", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.type(input, "ка");

    expect(screen.getByText("Казань")).toBeInTheDocument();
    expect(screen.queryByText("Москва")).not.toBeInTheDocument();
  });

  test("Ограничивает количество отображаемых подсказок 5 элементами", async () => {
    const user = userEvent.setup();
    const manyOptions = Array.from({ length: 10 }, (_, i) => `City ${i}`);

    render(<AutoCompleteInput options={manyOptions} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.type(input, "city");

    const items = screen.getAllByTestId("list-item");
    expect(items).toHaveLength(MAX_VISIBLE_SUGGESTIONS);
  });

  test("Заполняет поле ввода выбранной подсказкой при клике мышью", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.click(input);

    const option = screen.getByText("Москва");
    await user.pointer({ target: option, keys: "[MouseLeft]" });

    expect(input).toHaveValue("Москва");
  });

  test("Скрывает список подсказок при потере фокуса полем ввода", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.click(input);

    expect(screen.getByText("Москва")).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByText("Москва")).not.toBeInTheDocument();
  });

  test("Изменяет цвет подсказки при наведении и возвращает его при уходе курсора", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.click(input);

    const option = screen.getAllByTestId("list-item")[0];

    await user.hover(option);

    expect(option).toHaveStyle({
      background: "rgb(180, 180, 180)",
    });

    await user.unhover(option);

    expect(option).toHaveStyle({
      background: "rgb(133, 133, 133)",
    });
  });

  test("Показывает все подсказки, если введена только пустая строка", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");
    await user.type(input, " ");

    const options = screen.getAllByTestId("list-item");

    expect(options).toHaveLength(OPTIONS.length);
  });

  test("При фокусе на поле с введённым текстом показывает отфильтрованные подсказки", async () => {
    const user = userEvent.setup();

    render(<AutoCompleteInput options={OPTIONS} />);

    const input = screen.getByTestId("auto-complete-input");

    await user.type(input, "мо");

    await user.tab();

    await user.click(input);

    const options = screen.getAllByTestId("list-item");

    expect(options.length).toBeLessThanOrEqual(MAX_VISIBLE_SUGGESTIONS);

    expect(screen.getByText("Москва")).toBeInTheDocument();
    expect(screen.queryByText("Казань")).not.toBeInTheDocument();
  });
});
