import type { NormalizedProduct, NormalizedSizeOption } from "../types";

type RawProduct = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  price?: unknown;
  imageURL?: unknown;
  sizeOptions?: unknown;
};

const toNumber = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

export function normalizeProduct(raw: RawProduct): NormalizedProduct {
  const id = toNumber(raw.id) ?? 0;

  const title = typeof raw.title === "string" ? raw.title : "";
  const description = typeof raw.description === "string" ? raw.description : "";
  const imageURL = typeof raw.imageURL === "string" ? raw.imageURL : "";

    const priceNumber = toNumber(raw.price);
const price = priceNumber == null ? "N/A" : `$${priceNumber.toFixed(2)}`;
    

  const rawSizes = Array.isArray(raw.sizeOptions) ? raw.sizeOptions : [];
  const sizeOptions: NormalizedSizeOption[] = rawSizes
    .map((s: any) => {
      const sid = toNumber(s?.id);
      if (sid == null) return null;

      const label =
        (typeof s?.label === "string" && s.label) ||
        (typeof s?.long === "string" && s.long) ||
        String(sid);

      return { id: sid, label };
    })
    .filter(Boolean) as NormalizedSizeOption[];

  return { id, title, description, imageURL, price, priceNumber, sizeOptions };

}
