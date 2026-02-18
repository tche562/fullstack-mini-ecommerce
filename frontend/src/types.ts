export type Product = {
  id: number;
  title: string;
  description: string;
  price: number | string;
  imageURL: string;
  sizeOptions: { id: number; label?: string; long?: string }[];
};

export type CartItem = {
  sizeId: number;
  sizeLabel: string;
  qty: number;
};

export type Cart = Record<number, CartItem>;

export type SelectedSize = {
  id: number;
  label: string;
};