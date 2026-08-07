import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/lib/language-context";

function Consumer() {
  const { locale, content, toggleLocale } = useLanguage();
  return <button onClick={toggleLocale}>{locale}:{content.hero.name}</button>;
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to Spanish content", () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("es:Pablo Mira Amante");
  });

  it("toggles to English and persists the choice", () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("en:Pablo Mira Amante");
    expect(window.localStorage.getItem("cv-locale")).toBe("en");
  });

  it("reads a previously stored locale on mount", () => {
    window.localStorage.setItem("cv-locale", "en");
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("en:Pablo Mira Amante");
  });
});
