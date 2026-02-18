import { useEffect, useMemo, useState } from "react";
import "./ProductPage.css";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number | string;
  imageURL: string;
  sizeOptions: { id: number; label?: string; long?: string }[];
};

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

  if (loading) return <div className="page">Loading...</div>;
  if (error)
    return (
      <div className="page" style={{ color: "crimson" }}>
        {error}
      </div>
    );
  if (!product) return <div className="page">No product.</div>;

  return (
    <div className="page">
      <div className="grid">
        {/* Left: Image */}
        <div className="imageWrap">
          <img className="image" src={product.imageURL} alt={product.title} />
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="title">{product.title}</h1>
          <div className="price">{formattedPrice}</div>

          <p className="desc">{product.description}</p>

          {/* Sizes (display only for now, no selector behavior yet) */}
          <div className="sectionLabel">Size</div>
          <div className="sizesRow">
            {product.sizeOptions.map((s) => {
              const label = s.label ?? s.long ?? "";
              return (
                <span key={s.id} className="sizePill">
                  {label}
                </span>
              );
            })}
          </div>

          {/* Button (no logic yet) */}
          <button className="button" type="button" disabled>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
