import { describe, it, expect } from "vitest";
import es from "../content/es.json";
import en from "../content/en.json";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shape);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => [key, shape(v)])
    );
  }
  return typeof value;
}

describe("content parity", () => {
  it("es.json and en.json expose the same structure", () => {
    expect(shape(es)).toEqual(shape(en));
  });

  it("every project group has at least one item", () => {
    for (const group of es.projects.groups) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("contact info excludes DNI, exact address, and birth date fields", () => {
    const contactKeys = Object.keys(es.contact);
    expect(contactKeys).not.toContain("dni");
    expect(contactKeys).not.toContain("address");
    expect(contactKeys).not.toContain("birthDate");
  });
});
