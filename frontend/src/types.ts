export type Product = {
  id: number;
  title: string;
  description: string;
  price: number | string;
  imageURL: string;
  sizeOptions: { id: number; label?: string; long?: string }[];
};
