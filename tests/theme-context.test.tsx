import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/lib/theme-context";

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light when there is no stored preference and the system prefers light", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("light");
  });

  it("toggles the theme, persists it, and updates the html class", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark");
    expect(window.localStorage.getItem("cv-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("reads a previously stored theme on mount", () => {
    window.localStorage.setItem("cv-theme", "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("dark");
  });
});
