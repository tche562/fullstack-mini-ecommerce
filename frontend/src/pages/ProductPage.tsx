import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types";

export default function ProductPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/product")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Product) => {
        if (!mounted) return;
        setProduct(data);
        setError("");
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const formattedPrice = useMemo(() => {
    const n = Number(product?.price);
    if (!Number.isFinite(n)) return "$0.00";
    return `$${n.toFixed(2)}`;
  }, [product?.price]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error)
    return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;
  if (!product) return <div style={{ padding: 16 }}>No product.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: "0 0 8px" }}>{product.title}</h1>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>{formattedPrice}</div>

      <div style={{ marginBottom: 8 }}>Sizes:</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {product.sizeOptions.map((s) => {
          const label = s.label ?? s.long ?? "";
          return (
            <span
              key={s.id}
              style={{
                border: "1px solid #ccc",
                padding: "6px 10px",
                borderRadius: 4,
                fontSize: 14,
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
