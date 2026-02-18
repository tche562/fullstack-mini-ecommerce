import { describe, expect, it } from "vitest";
import { addToCart } from "./addToCart";
import type { Cart } from "../types";

describe("addToCart", () => {
  it("adds new size into empty cart with qty=1 (immutable)", () => {
    const cart: Cart = {};
    const next = addToCart(cart, { id: 2, label: "M" });

    expect(next).not.toBe(cart); // immutable: new object
    expect(cart).toEqual({}); // original unchanged

    expect(Object.values(next)).toHaveLength(1);
    expect(next[2]).toEqual({ sizeId: 2, sizeLabel: "M", qty: 1 });
  });

  it("increments qty when sizeId already exists (immutable)", () => {
    const cart: Cart = { 2: { sizeId: 2, sizeLabel: "M", qty: 1 } };
    const next = addToCart(cart, { id: 2, label: "M" });

    expect(next).not.toBe(cart); // new cart object
    expect(next[2]).not.toBe(cart[2]); // item object also immutable
    expect(cart[2].qty).toBe(1); // original unchanged

    expect(next[2]).toEqual({ sizeId: 2, sizeLabel: "M", qty: 2 });
  });

  it("keeps different sizes as separate lines (optional)", () => {
    const cart: Cart = { 2: { sizeId: 2, sizeLabel: "M", qty: 2 } };
    const next = addToCart(cart, { id: 1, label: "S" });

    expect(next).not.toBe(cart);
    expect(Object.values(next)).toHaveLength(2);

    expect(next[2]).toEqual({ sizeId: 2, sizeLabel: "M", qty: 2 });
    expect(next[1]).toEqual({ sizeId: 1, sizeLabel: "S", qty: 1 });
  });
});
