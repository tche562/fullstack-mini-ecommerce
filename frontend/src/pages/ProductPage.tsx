import { useEffect, useMemo, useState } from "react";
import "./ProductPage.css";
import SizeSelector from "../components/SizeSelector";
import { addToCart } from "../cart/addToCart";
import type { Cart } from "../types";

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
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [cart, setCart] = useState<Cart>({});

  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const selectedSize = useMemo(() => {
    if (selectedSizeId == null) return null;

    const opt = product?.sizeOptions?.find((s) => s.id === selectedSizeId);
    const label = opt?.label ?? opt?.long ?? "";

    return { id: selectedSizeId, label };
  }, [product, selectedSizeId]);

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

          {/* Size area (selector placeholder for now) */}
          <div className="sectionLabel">Size</div>
          <SizeSelector
            options={product.sizeOptions}
            selectedId={selectedSizeId}
            onSelect={(id) => {
              setSelectedSizeId(id);
              setErrorMessage(""); // clear error immediately after selecting a size
            }}
          />

          {/* Add to Cart (visible now; logic comes later) */}

          <button
            className="button"
            type="button"
            onClick={() => {
              if (selectedSizeId == null) {
                setErrorMessage("Please select a size");
                return;
              }

              const opt = product?.sizeOptions?.find(
                (s) => s.id === selectedSizeId,
              );
              const label = opt?.label ?? opt?.long ?? "";
              if (!label) {
                setErrorMessage("Please select a size");
                return;
              }

              setErrorMessage("");
              setCart((prev) =>
                addToCart(prev, { id: selectedSizeId, label }, product),
              );
            }}
          >
            Add to Cart
          </button>

          {errorMessage ? (
            <div className="errorText">{errorMessage}</div>
          ) : null}

          {/* Mini-cart placeholder */}
          <div className="cartBox" aria-label="Mini cart">
            <div className="cartTitle">Cart</div>

            {Object.values(cart).length === 0 ? (
              <div className="cartEmpty">Cart is empty</div>
            ) : (
              <div className="cartList">
                {Object.values(cart).map((item) => (
                  <div key={item.sizeId} className="cartRow">
                    <span className="cartRowLabel">{item.sizeLabel}</span>
                    <span className="cartRowQty">x{item.qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <pre
            style={{
              marginTop: 12,
              fontSize: 12,
              background: "#f7f7f7",
              padding: 8,
              borderRadius: 6,
            }}
          >
            {JSON.stringify(cart, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
