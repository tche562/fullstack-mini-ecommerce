import type { Cart, SelectedSize } from "../types";

export function addToCart(cart: Cart, selectedSize: SelectedSize, product?: unknown): Cart {
  void product; // reserved (avoid unused param)
  const sizeId = selectedSize.id;
  const existing = cart[sizeId];

  if (!existing) {
    return {
      ...cart,
      [sizeId]: { sizeId, sizeLabel: selectedSize.label, qty: 1 },
    };
  }

  return {
    ...cart,
    [sizeId]: { ...existing, qty: existing.qty + 1 },
  };
}

