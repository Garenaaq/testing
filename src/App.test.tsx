import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App", () => {
  test("Отображает AutoCompleteInput", () => {
    render(<App />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
